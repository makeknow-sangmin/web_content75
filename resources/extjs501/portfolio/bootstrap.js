// @tag core
// @define Ext.Boot
// @define Ext

var Ext = Ext || {};

//<editor-fold desc="Boot">
/*
 * @class Ext.Boot
 * @singleton
 */
Ext.Boot = (function (emptyFn) {

    var doc = document,
        apply = function (dest, src, defaults) {
            if (defaults) {
                apply(dest, defaults);
            }

            if (dest && src && typeof src == 'object') {
                for (var key in src) {
                    dest[key] = src[key];
                }
            }
            return dest;
        },
        _config = {
            /*
             * @cfg {Boolean} [disableCaching=true]
             * If `true` current timestamp is added to script URL's to prevent caching.
             * In debug builds, adding a "cache" or "disableCacheBuster" query parameter
             * to the page's URL will set this to `false`.
             */
            disableCaching: (/[?&](?:cache|disableCacheBuster)\b/i.test(location.search) ||
                !(/http[s]?\:/i.test(location.href)) ||
                /(^|[ ;])ext-cache=1/.test(doc.cookie)) ? false :
                true,

            /*
             * @cfg {String} [disableCachingParam="_dc"]
             * The query parameter name for the cache buster's timestamp.
             */
            disableCachingParam: '_dc',

            /*
             * @cfg {Boolean} loadDelay
             * Millisecond delay between asynchronous script injection (prevents stack
             * overflow on some user agents) 'false' disables delay but potentially
             * increases stack load.
             */
            loadDelay: false,

            /*
             * @cfg {Boolean} preserveScripts
             * `false` to remove asynchronously loaded scripts, `true` to retain script
             * element for browser debugger compatibility and improved load performance.
             */
            preserveScripts: true,

            /*
             * @cfg {String} charset
             * Optional charset to specify encoding of dynamic content.
             */
            charset: undefined
        },

        cssRe = /\.css(?:\?|$)/i,
        resolverEl = doc.createElement('a'),
        isBrowser = typeof window !== 'undefined',
        _environment = {
            browser: isBrowser,
            node: !isBrowser && (typeof require === 'function'),
            phantom: (typeof phantom !== 'undefined' && phantom.fs)
        },
        _tags = {},

        _apply = function (object, config, defaults) {
            if (defaults) {
                _apply(object, defaults);
            }
            if (object && config && typeof config === 'object') {
                for (var i in config) {
                    object[i] = config[i];
                }
            }
            return object;
        },
    /*
     * The Boot loader class manages Request objects that contain one or 
     * more individual urls that need to be loaded.  Requests can be performed
     * synchronously or asynchronously, but will always evaluate urls in the
     * order specified on the request object.
     */
        Boot = {
            loading: 0,
            loaded: 0,
            env: _environment,
            config: _config,

            // Keyed by absolute URL this object holds "true" if that URL is already loaded
            // or an array of callbacks to call once it loads.
            scripts: {
                /*
                 Entry objects 

                 'http://foo.com/bar/baz/Thing.js': {
                 done: true,
                 el: scriptEl || linkEl,
                 preserve: true,
                 requests: [ request1, ... ]
                 }
                 */
            },

            /*
             * contains the current script name being loaded
             * (loadSync or sequential load only)
             */
            currentFile: null,
            suspendedQueue: [],
            currentRequest: null,

            // when loadSync is called, need to cause subsequent load requests to also be loadSync,
            // eg, when Ext.require(...) is called
            syncMode: false,

            /*
             * simple helper method for debugging
             */
            listeners: [],

            Request: Request,

            Entry: Entry,

            platformTags: _tags,

            /**
             * The defult function that detects various platforms and sets tags
             * in the platform map accrodingly.  Examples are iOS, android, tablet, etc.
             * @param tags the set of tags to populate
             */
            detectPlatformTags: function () {
                var ua = navigator.userAgent,
                    isMobile = _tags.isMobile = /Mobile(\/|\s)/.test(ua),
                    isPhone, isDesktop, isTablet, touchSupported, isIE10, isBlackberry,
                    element = document.createElement('div'),
                    uaTagChecks = [
                        'iPhone',
                        'iPod',
                        'Android',
                        'Silk',
                        'Android 2',
                        'BlackBerry',
                        'BB',
                        'iPad',
                        'RIM Tablet OS',
                        'MSIE 10',
                        'Trident',
                        'Chrome',
                        'Tizen',
                        'Firefox',
                        'Safari',
                        'Windows Phone'
                    ],
                    isEventSupported = function(name, tag) {
                        if (tag === undefined) {
                            tag = window;
                        }

                        var eventName = 'on' + name.toLowerCase(),
                            isSupported = (eventName in element);

                        if (!isSupported) {
                            if (element.setAttribute && element.removeAttribute) {
                                element.setAttribute(eventName, '');
                                isSupported = typeof element[eventName] === 'function';

                                if (typeof element[eventName] !== 'undefined') {
                                    element[eventName] = undefined;
                                }

                                element.removeAttribute(eventName);
                            }
                        }

                        return isSupported;
                    },
                    uaTags = {},
                    len = uaTagChecks.length, check, c;

                for (c = 0; c < len; c++) {
                    check = uaTagChecks[c];
                    uaTags[check] = new RegExp(check).test(ua);
                }

                isPhone =
                    (uaTags.iPhone || uaTags.iPod) ||
                    (!uaTags.Silk && (uaTags.Android && (uaTags['Android 2'] || isMobile))) ||
                    ((uaTags.BlackBerry || uaTags.BB) && uaTags.isMobile) ||
                    (uaTags['Windows Phone']);

                isTablet =
                    (!_tags.isPhone) && (
                    uaTags.iPad ||
                    uaTags.Android ||
                    uaTags.Silk ||
                    uaTags['RIM Tablet OS'] ||
                    (uaTags['MSIE 10'] && /; Touch/.test(ua))
                    );

                touchSupported =
                    // if the browser has touch events we can be reasonably sure the device has
                    // a touch screen
                    isEventSupported('touchend') ||
                    // browsers that use pointer event have maxTouchPoints > 0 if the
                    // device supports touch input
                    // http://www.w3.org/TR/pointerevents/#widl-Navigator-maxTouchPoints
                    navigator.maxTouchPoints ||
                    // IE10 uses a vendor-prefixed maxTouchPoints property
                    navigator.msMaxTouchPoints;

                isDesktop = !isPhone && !isTablet;
                isIE10 = uaTags['MSIE 10'];
                isBlackberry = uaTags.Blackberry || uaTags.BB;

                apply(_tags, Boot.loadPlatformsParam(), {
                    phone: isPhone,
                    tablet: isTablet,
                    desktop: isDesktop,
                    touch: touchSupported,
                    ios: (uaTags.iPad || uaTags.iPhone || uaTags.iPod),
                    android: uaTags.Android || uaTags.Silk,
                    blackberry: isBlackberry,
                    safari: uaTags.Safari && isBlackberry,
                    chrome: uaTags.Chrome,
                    ie10: isIE10,
                    windows: isIE10 || uaTags.Trident,
                    tizen: uaTags.Tizen,
                    firefox: uaTags.Firefox
                });
            },

            /**
             * Extracts user supplied platform tags from the "platformTags" query parameter
             * of the form:
             *
             * ?platformTags=name:state,name:state,...
             *
             * (each tag defaults to true when state is unspecified)
             *
             * Example:
             * ?platformTags=isTablet,isPhone:false,isDesktop:0,iOS:1,Safari:true, ...
             *
             * @returns {Object} the platform tags supplied by the query string
             */
            loadPlatformsParam: function () {
                // Check if the ?platform parameter is set in the URL
                var paramsString = window.location.search.substr(1),
                    paramsArray = paramsString.split("&"),
                    params = {}, i,
                    platforms = {},
                    tmpArray, tmplen, platform, name, enabled;

                for (i = 0; i < paramsArray.length; i++) {
                    tmpArray = paramsArray[i].split("=");
                    params[tmpArray[0]] = tmpArray[1];
                }

                if (params.platformTags) {
                    tmpArray = params.platform.split(/\W/);
                    for (tmplen = tmpArray.length, i = 0; i < tmplen; i++) {
                        platform = tmpArray[i].split(":");
                        name = platform[0];
                        if (platform.length > 1) {
                            enabled = platform[1];
                            if (enabled === 'false' || enabled === '0') {
                                enabled = false;
                            } else {
                                enabled = true;
                            }
                        }
                        platforms[name] = enabled;
                    }
                }
                return platform;
            },

            getPlatformTags: function () {
                return Boot.platformTags;
            },

            filterPlatform: function (platform) {
                platform = [].concat(platform);
                var tags = Boot.getPlatformTags(),
                    len, p, tag;

                for (len = platform.length, p = 0; p < len; p++) {
                    tag = platform[p];
                    if (tags.hasOwnProperty(tag)) {
                        return !!tags[tag];
                    }
                }
                return false;
            },

            init: function () {
                var me = this,
                    scriptEls = doc.getElementsByTagName('script'),
                    len = scriptEls.length,
                    re = /\/ext(\-[a-z\-]+)?\.js$/,
                    entry, script, src, state, baseUrl, key, n, origin;

                // Since we are loading after other scripts, and we needed to gather them
                // anyway, we track them in _scripts so we don't have to ask for them all
                // repeatedly.
                for (n = 0; n < len; n++) {
                    src = (script = scriptEls[n]).src;
                    if (!src) {
                        continue;
                    }
                    state = script.readyState || null;

                    // If we find a script file called "ext-*.js", then the base path is that file's base path.
                    if (!baseUrl) {
                        if (re.test(src)) {
                            me.hasReadyState = ("readyState" in script);
                            me.hasAsync = ("async" in script) || !me.hasReadyState;
                            baseUrl = src;
                        }
                    }

                    if (!me.scripts[key = me.canonicalUrl(src)]) {
                        entry = new Entry({
                            key: key,
                            url: src,
                            done: state === null ||  // non-IE
                                state === 'loaded' || state === 'complete', // IE only
                            el: script,
                            prop: 'src'
                        });
                    }
                }

                if (!baseUrl) {
                    script = scriptEls[scriptEls.length - 1];
                    baseUrl = script.src;
                    me.hasReadyState = ('readyState' in script);
                    me.hasAsync = ("async" in script) || !me.hasReadyState;
                }

                me.baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
                origin = window.location.origin ||
                    window.location.protocol +
                    "//" +
                    window.location.hostname +
                    (window.location.port ? ':' + window.location.port: '');
                me.origin = origin;

                me.detectPlatformTags();
                Ext.filterPlatform = me.filterPlatform;
            },

            /*
             * This method returns a canonical URL for the given URL.
             *
             * For example, the following all produce the same canonical URL (which is the
             * last one):
             *
             *      http://foo.com/bar/baz/zoo/derp/../../goo/Thing.js?_dc=12345
             *      http://foo.com/bar/baz/zoo/derp/../../goo/Thing.js
             *      http://foo.com/bar/baz/zoo/derp/../jazz/../../goo/Thing.js
             *      http://foo.com/bar/baz/zoo/../goo/Thing.js
             *      http://foo.com/bar/baz/goo/Thing.js
             *
             * @private
             */
            canonicalUrl: function (url) {
                // @TODO - see if we need this fallback logic
                // http://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue
                resolverEl.href = url;

                var ret = resolverEl.href,
                    dc = _config.disableCachingParam,
                    pos = dc ? ret.indexOf(dc + '=') : -1,
                    c, end;

                // If we have a _dc query parameter we need to remove it from the canonical
                // URL.
                if (pos > 0 && ((c = ret.charAt(pos - 1)) === '?' || c === '&')) {
                    end = ret.indexOf('&', pos);
                    end = (end < 0) ? '' : ret.substring(end);
                    if (end && c === '?') {
                        ++pos; // keep the '?'
                        end = end.substring(1); // remove the '&'
                    }
                    ret = ret.substring(0, pos - 1) + end;
                }

                return ret;
            },

            /*
             * Get the config value corresponding to the specified name. If no name is given, will return the config object
             * @param {String} name The config property name
             * @return {Object}
             */
            getConfig: function (name) {
                return name ? this.config[name] : this.config;
            },

            /*
             * Set the configuration.
             * @param {Object} config The config object to override the default values.
             * @return {Ext.Boot} this
             */
            setConfig: function (name, value) {
                if (typeof name === 'string') {
                    this.config[name] = value;
                } else {
                    for (var s in name) {
                        this.setConfig(s, name[s]);
                    }
                }
                return this;
            },

            getHead: function () {
                return this.docHead ||
                    (this.docHead = doc.head ||
                        doc.getElementsByTagName('head')[0]);
            },

            create: function (url, key, cfg) {
                var config = cfg || {};
                config.url = url;
                config.key = key;
                return this.scripts[key] = new Entry(config);
            },

            getEntry: function (url, cfg) {
                var key = this.canonicalUrl(url),
                    entry = this.scripts[key];
                if (!entry) {
                    entry = this.create(url, key, cfg);
                }
                return entry;
            },

            processRequest: function(request, sync) {
                request.loadEntries(sync);
            },

            load: function (request) {
                var me = this,
                    request = new Request(request);

                if(request.sync || me.syncMode) {
                    return me.loadSync(request);
                }

                // If there is a request in progress, we must
                // queue this new request to be fired  when the current request completes.
                if (me.currentRequest) {
                    // trigger assignment of entries now to ensure that overlapping
                    // entries with currently running requests will synchronize state
                    // with this pending one as they complete
                    request.getEntries();
                    me.suspendedQueue.push(request);
                } else {
                    me.currentRequest = request;
                    me.processRequest(request, false);
                }
                return me;
            },

            loadSync: function (request) {
                var me = this,
                    request = new Request(request);

                me.syncMode++;
                me.processRequest(request, true);
                me.syncMode--;
                return me;
            },

            loadBasePrefix: function(request) {
                request = new Request(request);
                request.prependBaseUrl = true;
                return this.load(request);
            },

            loadSyncBasePrefix: function(request) {
                request = new Request(request);
                request.prependBaseUrl = true;
                return this.loadSync(request);
            },

            requestComplete: function(request) {
                var me = this,
                    next;
                if(me.currentRequest === request) {
                    me.currentRequest = null;
                    while(me.suspendedQueue.length > 0) {
                        next = me.suspendedQueue.shift();
                        if(!next.done) {
                            me.load(next);
                            break;
                        }
                    }
                }
                if(!me.currentRequest && me.suspendedQueue.length == 0) {
                    me.fireListeners();
                }
            },

            isLoading: function () {
                return !this.currentRequest && this.suspendedQueue.length == 0;
            },

            fireListeners: function () {
                var listener;
                while (this.isLoading() && (listener = this.listeners.shift())) {
                    listener();
                }
            },

            onBootReady: function (listener) {
                if (!this.isLoading()) {
                    listener();
                } else {
                    this.listeners.push(listener);
                }
            },

            /*
             * this is a helper function used by Ext.Loader to flush out
             * 'uses' arrays for classes
             */
            getPathsFromIndexes: function (indexMap, loadOrder) {
                return Request.prototype.getPathsFromIndexes(indexMap, loadOrder);
            },

            createLoadOrderMap: function(loadOrder) {
                return Request.prototype.createLoadOrderMap(loadOrder);
            },

            fetchSync: function(url) {
                var exception, xhr, status, content;

                exception = false;
                xhr = new XMLHttpRequest();

                try {
                    xhr.open('GET', url, false);
                    xhr.send(null);
                } catch (e) {
                    exception = true;
                }

                status = (xhr.status === 1223) ? 204 :
                    (xhr.status === 0 && ((self.location || {}).protocol === 'file:' ||
                        (self.location || {}).protocol === 'ionp:')) ? 200 : xhr.status;
                content = xhr.responseText;

                xhr = null; // Prevent potential IE memory leak

                return {
                    content: content,
                    exception: exception,
                    status: status
                };
            },

            notifyAll: function(entry) {
                entry.notifyRequests();
            }
        };

    /*
     * The request class encapsulates a series of Entry objects
     * and provides notification around the completion of all Entries
     * in this request.
     */
    function Request(cfg) {
        if(cfg.$isRequest) {
            return cfg;
        }

        var cfg = cfg.url ? cfg : {url: cfg},
            url = cfg.url,
            urls = url.charAt ? [ url ] : url,
            boot = cfg.boot || Boot,
            charset = cfg.charset || boot.config.charset,
            buster = (('cache' in cfg) ? !cfg.cache : boot.config.disableCaching) &&
                (boot.config.disableCachingParam + '=' + new Date().getTime());
        _apply(cfg, {
            urls: urls,
            boot: boot,
            charset: charset,
            buster: buster
        });
        _apply(this, cfg);
    };
    Request.prototype = {
        $isRequest: true,

        /*
         * @private
         * @param manifest
         * @returns {*}
         */
        createLoadOrderMap: function (loadOrder) {
            var len = loadOrder.length,
                loadOrderMap = {},
                i, element;

            for (i = 0; i < len; i++) {
                element = loadOrder[i];
                loadOrderMap[element.path] = element;
            }

            return loadOrderMap;
        },

        /*
         * @private
         * @param index
         * @param indexMap
         * @returns {{}}
         */
        getLoadIndexes: function (index, indexMap, loadOrder, includeUses, skipLoaded) {
            var item = loadOrder[index],
                len, i, reqs, entry, stop, added, idx, ridx, url;

            if (indexMap[index]) {
                // prevent cycles
                return indexMap;
            }

            indexMap[index] = true;

            stop = false;
            while (!stop) {
                added = false;

                // iterate the requirements for each index and 
                // accumulate in the index map
                for (idx in indexMap) {
                    if (indexMap.hasOwnProperty(idx)) {
                        item = loadOrder[idx];
                        if (!item) {
                            continue;
                        }
                        url = this.prepareUrl(item.path);
                        entry = Boot.getEntry(url);
                        if (!skipLoaded || !entry || !entry.done) {
                            reqs = item.requires;
                            if (includeUses && item.uses) {
                                reqs = reqs.concat(item.uses);
                            }
                            for (len = reqs.length, i = 0; i < len; i++) {
                                ridx = reqs[i];
                                // if we find a requirement that wasn't 
                                // already in the index map, 
                                // set the added flag to indicate we need to 
                                // reprocess
                                if (!indexMap[ridx]) {
                                    indexMap[ridx] = true;
                                    added = true;
                                }
                            }
                        }
                    }
                }

                // if we made a pass through the index map and didn't add anything
                // then we can stop
                if (!added) {
                    stop = true;
                }
            }

            return indexMap;
        },

        getPathsFromIndexes: function (indexMap, loadOrder) {
            var indexes = [],
                paths = [],
                index, len, i;

            for (index in indexMap) {
                if (indexMap.hasOwnProperty(index) && indexMap[index]) {
                    indexes.push(index);
                }
            }

            indexes.sort(function (a, b) {
                return a - b;
            });

            // convert indexes back into load paths
            for (len = indexes.length, i = 0; i < len; i++) {
                paths.push(loadOrder[indexes[i]].path);
            }

            return paths;
        },

        expandUrl: function (url, indexMap, includeUses, skipLoaded) {
            if (typeof url == 'string') {
                url = [url];
            }

            var me = this,
                loadOrder = me.loadOrder,
                loadOrderMap = me.loadOrderMap;

            if (loadOrder) {
                loadOrderMap = loadOrderMap || me.createLoadOrderMap(loadOrder);
                me.loadOrderMap = loadOrderMap;
                indexMap = indexMap || {};
                var len = url.length,
                    unmapped = [],
                    i, item;

                for (i = 0; i < len; i++) {
                    item = loadOrderMap[url[i]];
                    if (item) {
                        me.getLoadIndexes(item.idx, indexMap, loadOrder, includeUses, skipLoaded);
                    } else {
                        unmapped.push(url[i]);
                    }
                }


                return me.getPathsFromIndexes(indexMap, loadOrder).concat(unmapped);
            }
            return url;
        },

        expandUrls: function (urls, includeUses) {
            if (typeof urls == "string") {
                urls = [urls];
            }

            var expanded = [],
                expandMap = {},
                tmpExpanded,
                len = urls.length,
                i, t, tlen, tUrl;

            for (i = 0; i < len; i++) {
                tmpExpanded = this.expandUrl(urls[i], {}, includeUses, true);
                for (t = 0, tlen = tmpExpanded.length; t < tlen; t++) {
                    tUrl = tmpExpanded[t];
                    if (!expandMap[tUrl]) {
                        expandMap[tUrl] = true;
                        expanded.push(tUrl);
                    }
                }
            }

            if (expanded.length == 0) {
                expanded = urls;
            }

            return expanded;
        },

        expandLoadOrder: function () {
            var me = this,
                urls = me.urls,
                expanded;

            if (!me.expanded) {
                expanded = this.expandUrls(urls);
                me.expanded = true;
            } else {
                expanded = urls;
            }

            me.urls = expanded;

            // if we added some urls to the request to honor the indicated
            // load order, the request needs to be sequential
            if (urls.length != expanded.length) {
                me.sequential = true;
            }

            return me;
        },

        getUrls: function () {
            this.expandLoadOrder();
            return this.urls;
        },

        prepareUrl: function(url) {
            if(this.prependBaseUrl) {
                return Boot.baseUrl + url;
            }
            return url;
        },

        getEntries: function () {
            var me = this,
                entries = me.entries,
                i, entry, urls, url;
            if (!entries) {
                entries = [];
                urls = me.getUrls();
                for (i = 0; i < urls.length; i++) {
                    url = me.prepareUrl(urls[i]);
                    entry = Boot.getEntry(url, {
                        buster: me.buster,
                        charset: me.charset
                    });
                    entry.requests.push(me);
                    entries.push(entry);
                }
                me.entries = entries;
            }
            return entries;
        },

        loadEntries: function(sync) {
            var me = this,
                entries = me.getEntries(),
                len = entries.length,
                start = me.loadStart || 0,
                continueLoad, entry, i;

            if(sync !== undefined) {
                me.sync = sync;
            }

            me.loaded = me.loaded || 0;
            me.loading = me.loading || len;

            for(i = start; i < len; i++) {
                entry = entries[i];
  //              console.log('loadEntries', me.sync);
                if(!entry.loaded) {
                    continueLoad = entries[i].load(me.sync);
                } else {
                    continueLoad = true;
                }
                if(!continueLoad) {
                    me.loadStart = i;
                    entry.onDone(function(){
                        me.loadEntries(sync);
                    });
                    break;
                }
            }
            me.processLoadedEntries();
        },

        processLoadedEntries: function () {
            var me = this,
                entries = me.getEntries(),
                len = entries.length,
                start = me.startIndex || 0,
                i, entry;

            if (!me.done) {
                for (i = start; i < len; i++) {
                    entry = entries[i];

                    if (!entry.loaded) {
                        me.startIndex = i;
                        return;
                    }

                    if (!entry.evaluated) {
                        entry.evaluate();
                    }

                    if (entry.error) {
                        me.error = true;
                    }
                }
                me.notify();
            }
        },

        notify: function () {
            var me = this;
            if (!me.done) {
                var error = me.error,
                    fn = me[error ? 'failure' : 'success'],
                    delay = ('delay' in me)
                        ? me.delay
                        : (error ? 1 : Boot.config.chainDelay),
                    scope = me.scope || me;
                me.done = true;
                if (fn) {
                    if (delay === 0 || delay > 0) {
                        // Free the stack (and defer the next script)
                        setTimeout(function () {
                            fn.call(scope, me);
                        }, delay);
                    } else {
                        fn.call(scope, me);
                    }
                }
                me.fireListeners();
                Boot.requestComplete(me);
            }
        },

        onDone: function(listener) {
            var me = this,
                listeners = me.listeners || (me.listeners = []);
            if(me.done) {
                listener(me);
            } else {
                listeners.push(listener);
            }
        },

        fireListeners: function() {
            var listeners = this.listeners,
                listener;
            if(listeners) {
                while((listener = listeners.shift())) {
                    listener(this);
                }
            }
        }
    };

    /*
     * The Entry class is a token to manage the load and evaluation
     * state of a particular url.  It is used to notify all Requests
     * interested in this url that the content is available.
     */
    function Entry(cfg) {
        if(cfg.$isEntry) {
            return cfg;
        }


        var boot = cfg.boot || Boot,
            charset = cfg.charset || boot.config.charset,
            buster = cfg.buster || ((('cache' in cfg) ? !cfg.cache : boot.config.disableCaching) &&
                (boot.config.disableCachingParam + '=' + new Date().getTime()));

        _apply(cfg, {
            boot: boot,
            charset: charset,
            buster: buster,
            requests: []
        });
        _apply(this, cfg);
    };
    Entry.prototype = {
        $isEntry: true,
        done: false,
        evaluated: false,
        loaded: false,

        isCrossDomain: function() {
            var me = this;
            if(me.crossDomain === undefined) {
                me.crossDomain = (me.getLoadUrl().indexOf(Boot.origin) !== 0);
            }
            return me.crossDomain;
        },

        isCss: function () {
            var me = this;
            if (me.css === undefined) {
                me.css = me.url && cssRe.test(me.url);
            }
            return this.css;
        },

        getElement: function (tag) {
            var me = this,
                el = me.el;
            if (!el) {
                if (me.isCss()) {
                    tag = tag || "link";
                    el = doc.createElement(tag);
                    if(tag == "link") {
                        el.rel = 'stylesheet';
                        me.prop = 'href';
                    } else {
                        me.prop="textContent";
                    }
                    el.type = "text/css";
                } else {
                    tag = tag || "script";
                    el = doc.createElement(tag);
                    el.type = 'text/javascript';
                    me.prop = 'src';
                    if (Boot.hasAsync) {
                        el.async = false;
                    }
                }
                me.el = el;
            }
            return el;
        },

        getLoadUrl: function () {
            var me = this,
                url = Boot.canonicalUrl(me.url);
            if (!me.loadUrl) {
                me.loadUrl = !!me.buster
                    ? (url + (url.indexOf('?') === -1 ? '?' : '&') + me.buster)
                    : url;
            }
            return me.loadUrl;
        },

        fetch: function (req) {
            var url = this.getLoadUrl(),
                async = !!req.async,
                xhr = new XMLHttpRequest(),
                complete = req.complete,
                status, content, exception = false,
                readyStateChange = function () {
                    if (xhr && xhr.readyState == 4) {
                        if (complete) {
                            status = (xhr.status === 1223) ? 204 :
                                (xhr.status === 0 && ((self.location || {}).protocol === 'file:' ||
                                    (self.location || {}).protocol === 'ionp:')) ? 200 : xhr.status;
                            content = xhr.responseText;
                            complete({
                                content: content,
                                status: status,
                                exception: exception
                            });
                        }
                        xhr = null;
                    }
                };
			//console.log('url', url);
            async = !!async;

            if(async) {
                xhr.onreadystatechange = readyStateChange;
            }

            try {
                xhr.open('GET', url, async);
                xhr.send(null);
            } catch (err) {
                exception = err;
                readyStateChange();
            }

            if(!async) {
                readyStateChange();
            }
        },

        onContentLoaded: function (response) {
            var me = this,
                status = response.status,
                content = response.content,
                exception = response.exception,
                url = this.getLoadUrl();
            me.loaded = true;
            if ((exception || status === 0) && !_environment.phantom) {
                me.error =
                    true;
                me.evaluated = true;
            }
            else if ((status >= 200 && status < 300) || status === 304
                || _environment.phantom
                || (status === 0 && content.length > 0)
                ) {
                me.content = content;
            }
            else {
                me.error =
                    true;
                me.evaluated = true;
            }
        },

        createLoadElement: function(callback) {
            var me = this,
                el = me.getElement(),
                readyStateChange = function(){
                    if (this.readyState === 'loaded' || this.readyState === 'complete') {
                        if(callback) {
                            callback();
                        }
                    }
                },
                errorFn = function() {
                    me.error = true;
                    if(callback) {
                        callback();
                    }
                };
            me.preserve = true;
            el.onerror = errorFn;
            if(Boot.hasReadyState) {
                el.onreadystatechange = readyStateChange;
            } else {
                el.onload = callback;
            }
            // IE starts loading here
            el[me.prop] = me.getLoadUrl();
        },

        onLoadElementReady: function() {
            Boot.getHead().appendChild(this.getElement());
            this.evaluated = true;
        },

        inject: function (content, asset) {
            var me = this,
                head = Boot.getHead(),
                url = me.url,
                key = me.key,
                base, el, ieMode, basePath;

            if (me.isCss()) {
                me.preserve = true;
                
                basePath = key.substring(0, key.lastIndexOf("/") + 1);
                //console.log(key);                
                //console.log(basePath);
                base = doc.createElement('base');
                base.href = basePath;
                if(head.firstChild) {
                    head.insertBefore(base, head.firstChild);
                } else {
                    head.appendChild(base);
                }
                // reset the href attribute to cuase IE to pick up the change
                base.href = base.href;

                if (url) {
                    content += "\n/*# sourceURL=" + key + " */";
                }

                // create element after setting base
                el = me.getElement("style");

                ieMode = ('styleSheet' in el);
//console.log(base);
                head.appendChild(base);
                if(ieMode) {
                    head.appendChild(el);
                    el.styleSheet.cssText = content;
                } else {
                    el.textContent = content;
                    head.appendChild(el);
                }
                head.removeChild(base);

            } else {
                // Debugger friendly, file names are still shown even though they're 
                // eval'ed code. Breakpoints work on both Firebug and Chrome's Web
                // Inspector.
                if (url) {
                    content += "\n//# sourceURL=" + key;
                }
                Ext.globalEval(content);
            }
            return me;
        },

        loadCrossDomain: function() {
            var me = this,
                complete = function(){
                    me.loaded = me.evaluated = me.done = true;
                    me.notifyRequests();
                };
            if(me.isCss()) {
                me.createLoadElement();
                me.evaluateLoadElement();
                complete();
            } else {
                me.createLoadElement(function(){
                    complete();
                });
                me.evaluateLoadElement();
                // at this point, we need sequential evaluation, 
                // which means we can't advance the load until
                // this entry has fully completed
                return false;
            }
            return true;
        },

        loadSync: function() {
            var me = this;
            me.fetch({
                async: false,
                complete: function (response) {
                    me.onContentLoaded(response);
                }
            });
            me.evaluate();
            me.notifyRequests();
        },

        load: function (sync) {
            var me = this;
            if (!me.loaded) {
                if(me.loading) {
                    // if we're calling back through load and we're loading but haven't 
                    // yet loaded, then we should be in a sequential, cross domain 
                    // load scenario which means we can't continue the load on the 
                    // request until this entry has fully evaluated, which will mean
                    // loaded = evaluated = done = true in one step.  For css files, this
                    // will happen immediately upon <link> element creation / insertion, 
                    // but <script> elements will set this upon load notification
                    return false;
                }
                me.loading = true;

                // for async modes, we have some options 
                if (!sync) {
                    // if cross domain, just inject the script tag and let the onload
                    // events drive the progression
                    if(me.isCrossDomain()) {
                        return me.loadCrossDomain();
                    }
                    // for IE, use the readyStateChange allows us to load scripts in parallel
                    // but serialize the evaluation by appending the script node to the 
                    // document
                    else if(!me.isCss() && Boot.hasReadyState) {
                        me.createLoadElement(function () {
                            me.loaded = true;
                            me.notifyRequests();
                        });
                    }

                    // for other browsers, just ajax the content down in parallel, and use
                    // globalEval to serialize evaluation
                    else {
                        me.fetch({
                            async: !sync,
                            complete: function (response) {
                                me.onContentLoaded(response);
                                me.notifyRequests();
                            }
                        });
                    }
                }

                // for sync mode in js, global eval FTW.  IE won't honor the comment
                // paths in the debugger, so eventually we need a sync mode for IE that
                // uses the readyStateChange mechanism
                else {
                    me.loadSync();
                }
            }
            // signal that the load process can continue
            return true;
        },

        evaluateContent: function () {
            this.inject(this.content);
            this.content = null;
        },

        evaluateLoadElement: function() {
            Boot.getHead().appendChild(this.getElement());
        },

        evaluate: function () {
            var me = this;
            if(!me.evaluated) {
                if(me.evaluating) {
                    return;
                }
                me.evaluating = true;
                if(me.content !== undefined) {
                    me.evaluateContent();
                } else if(!me.error) {
                    me.evaluateLoadElement();
                }
                me.evaluated = me.done = true;
                me.cleanup();
            }
        },

        /*
         * @private
         */
        cleanup: function () {
            var me = this,
                el = me.el,
                prop;

            if (!el) {
                return;
            }

            if (!me.preserve) {
                me.el = null;

                el.parentNode.removeChild(el); // Remove, since its useless now

                for (prop in el) {
                    try {
                        if (prop !== me.prop) {
                            // If we set the src property to null IE
                            // will try and request a script at './null'
                            el[prop] = null;
                        }
                        delete el[prop];      // and prepare for GC
                    } catch (cleanEx) {
                        //ignore
                    }
                }
            }

            // Setting to null can cause exceptions if IE ever needs to call these
            // again (like onreadystatechange). This emptyFn has nothing locked in
            // closure scope so it is about as safe as null for memory leaks.
            el.onload = el.onerror = el.onreadystatechange = emptyFn;
        },

        notifyRequests: function () {
            var requests = this.requests,
                len = requests.length,
                i, request;
            for (i = 0; i < len; i++) {
                request = requests[i];
                request.processLoadedEntries();
            }
            if(this.done) {
                this.fireListeners();
            }
        },

        onDone: function(listener) {
            var me = this,
                listeners = me.listeners || (me.listeners = []);
            if(me.done) {
                listener(me);
            } else {
                listeners.push(listener);
            }
        },

        fireListeners: function() {
            var listeners = this.listeners,
                listener;
            if(listeners && listeners.length > 0) {
                while((listener = listeners.shift())) {
                    listener(this);
                }
            }
        }
    };

    /*
     * Turns on or off the "cache buster" applied to dynamically loaded scripts. Normally
     * dynamically loaded scripts have an extra query parameter appended to avoid stale
     * cached scripts. This method can be used to disable this mechanism, and is primarily
     * useful for testing. This is done using a cookie.
     * @param {Boolean} disable True to disable the cache buster.
     * @param {String} [path="/"] An optional path to scope the cookie.
     */
    Ext.disableCacheBuster = function (disable, path) {
        var date = new Date();
        date.setTime(date.getTime() + (disable ? 10 * 365 : -1) * 24 * 60 * 60 * 1000);
        date = date.toGMTString();
        doc.cookie = 'ext-cache=1; expires=' + date + '; path=' + (path || '/');
    };


    Boot.init();
    return Boot;

// NOTE: We run the eval at global scope to protect the body of the function and allow
// compressors to still process it.
}(function () {
}));//(eval("/*@cc_on!@*/!1"));

/*
 * This method evaluates the given code free of any local variable. This
 * will be at global scope, in others it will be in a function.
 * @parma {String} code The code to evaluate.
 * @private
 * @method
 */
Ext.globalEval = Ext.globalEval || (this.execScript
    ? function (code) { execScript(code); }
    : function ($$code) { eval.call(window, $$code); });

/*
 * Only IE8 & IE/Quirks lack Function.prototype.bind so we polyfill that here.
 */
if (!Function.prototype.bind) {
    (function () {
        var slice = Array.prototype.slice,
        // To reduce overhead on call of the bound fn we have two flavors based on
        // whether we have args to prepend or not:
            bind = function (me) {
                var args = slice.call(arguments, 1),
                    method = this;

                if (args.length) {
                    return function () {
                        var t = arguments;
                        // avoid the slice/concat if the caller does not supply args
                        return method.apply(me, t.length ? args.concat(slice.call(t)) : args);
                    };
                }
                // this is the majority use case - just fn.bind(this) and no args

                args = null;
                return function () {
                    return method.apply(me, arguments);
                };
            };
        Function.prototype.bind = bind;
        bind.$extjs = true; // to detect this polyfill if one want to improve it
    }());
}

//</editor-fold>

// here, the extra check for window['Ext'] is needed for use with cmd-test
// code injection.  we need to make that this file will sync up with page global
// scope to avoid duplicate Ext.Boot state.  That check is after the initial Ext check
// to allow the sandboxing template to inject an appropriate Ext var and prevent the
// global detection.
var Ext = Ext || window['Ext'] || {};


//<editor-fold desc="Microloader">
/**
 * @Class Ext.Microloader
 * @singleton
 */
Ext.Microloader = Ext.Microloader || (function () {
    var Boot = Ext.Boot,
        _listeners = [],
        _loaded = false,
        _tags = Boot.platformTags,
        Microloader = {

            /**
             * the global map of tags used
             */
            platformTags: _tags,

            detectPlatformTags: function () {
                if (Ext.beforeLoad) {
                    Ext.beforeLoad(_tags);
                }
            },

            initPlatformTags: function () {
                Microloader.detectPlatformTags();
            },

            getPlatformTags: function () {
                return Boot.platformTags;
            },

            filterPlatform: function (platform) {
                return Boot.filterPlatform(platform);
            },

            init: function () {
                Microloader.initPlatformTags();
            },

            initManifest: function (manifest) {
                Microloader.init();
                var tmpManifest = manifest || Ext.manifest;

                if (typeof tmpManifest === "string") {
                    var extension = ".json",
                        url = tmpManifest.indexOf(extension) === tmpManifest.length - extension.length
                            ? Boot.baseUrl + tmpManifest
                            : Boot.baseUrl + tmpManifest + ".json",
                        content = Boot.fetchSync(url);
                   
                   //console_log(G_RFXSHARE);
                   //content.content.replace(/G_RFXSHARE/gi, '\'' + G_RFXSHARE + '\'');
                   //console_log(content.content);
                    tmpManifest = JSON.parse(content.content);
                    //console.log(tmpManifest);
                }

                Ext.manifest = tmpManifest;
                return tmpManifest;
            },

            /**
             *
             * @param manifestDef
             */
            load: function (manifestDef) {
                var manifest = Microloader.initManifest(manifestDef),
                    loadOrder = manifest.loadOrder,
                    loadOrderMap = (loadOrder) ? Boot.createLoadOrderMap(loadOrder) : null,
                    urls = [],
                    js = manifest.js || [],
                    css = manifest.css || [],
                    resource, i, len, include,
                    loadedFn = function () {
                        _loaded = true;
                        Microloader.notify();
                    },
                    loadResources = function(resources, addLoadedFn){
                        for (len = resources.length, i = 0; i < len; i++) {
                            resource = resources[i];
                            include = true;
                            if (resource.platform && !Boot.filterPlatform(resource.platform)) {
                                include = false;
                            }
                            if (include) {
                                urls.push(resource.path);
                            }
                        }

                        if(!addLoadedFn) {
                            Boot.loadSync({
                                url: urls,
                                loadOrder: loadOrder,
                                loadOrderMap: loadOrderMap
                            });
                        } else {
                            Boot.load({
                                url: urls,
                                loadOrder: loadOrder,
                                loadOrderMap: loadOrderMap,
                                sequential: true,
                                success: loadedFn,
                                failure:  loadedFn
                            });
                        }
                    };

                if (loadOrder) {
                    manifest.loadOrderMap = loadOrderMap;
                }

                loadResources(css.concat(js), true);
            },

            onMicroloaderReady: function (listener) {
                if (_loaded) {
                    listener();
                } else {
                    _listeners.push(listener);
                }
            },

            /**
             * @private
             */
            notify: function () {
                var listener;
                while((listener = _listeners.shift())) {
                    listener();
                }
            }
        };

    return Microloader;
}());

//</editor-fold>

/**
 * the current application manifest
 *
 *
 * {
 *  name: 'name',
 *  version: <checksum>,
 *  debug: {
 *      hooks: {
 *          "*": true
 *      }
 *  },
 *  localStorage: false,
 *  mode: production,
 *  js: [
 *      ...
 *      {
 *          path: '../boo/baz.js',
 *          version: <checksum>,
 *          update: full | delta | <falsy>,
 *          platform: ['phone', 'ios', 'android']
 *      },
 *      {
 *          path: 'http://some.domain.com/api.js',
 *          remote: true
 *      },
 *      ...
 *  ],
 *  css: [
 *      ...
 *      {
 *          path: '../boo/baz.css',
 *          version: <checksum>,
 *          update: full | delta | <falsy>,
 *          platform: ['phone', 'ios', 'android']
 *      },
 *      ...
 *  ],
 *  localStorage: false,
 *  paths: {...},
 *  loadOrder: [
 *      ...
 *      {
 *          path: '../foo/bar.js",
 *          idx: 158,
 *          requires; [1,2,3,...,145,157],
 *          uses: [182, 193]
 *      },
 *      ...
 *  ],
 *  classes: {
 *      ...
 *      'Ext.panel.Panel': {
 *          requires: [...],
 *          uses: [...],
 *          aliases: [...],
 *          alternates: [...],
 *          mixins: [...]
 *      },
 *      'Ext.rtl.util.Renderable': {
 *          requires: [...],
 *          uses: [...],
 *          aliases: [...],
 *          alternates: [...],
 *          mixins: [...]
 *          override: 'Ext.util.Renderable'
 *      },
 *      ...
 *  },
 *  packages: {
 *      ...
 *      "sencha-core": {
 *          version: '1.2.3.4',
 *          requires: []
 *      },
 *      "ext": {
 *          version: '5.0.0.0',
 *          requires: ["sencha-core"]
 *      }.
 *      ...
 *  }
 * }
 *
 *
 * @type {String/Object}
 */
Ext.manifest = Ext.manifest || "bootstrap";

Ext.Microloader.load();
