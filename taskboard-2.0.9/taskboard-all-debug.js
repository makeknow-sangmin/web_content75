/*

Kanban TaskBoard 2.0.9
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**
 * @class Sch.util.Patch
 * @static
 * @private
 * Private utility class for Ext JS patches for the Bryntum components
 */
Ext.define('Sch.util.Patch', {
    /**
     * @cfg {String} target The class name to override
     */
    target      : null,

    /**
     * @cfg {String} minVersion The minimum Ext JS version for which this override is applicable. E.g. "4.0.5"
     */
    minVersion  : null,
    
    /**
     * @cfg {String} maxVersion The highest Ext JS version for which this override is applicable. E.g. "4.0.7"
     */
    maxVersion  : null,

    /**
     * @cfg {String} reportUrl A url to the forum post describing the bug/issue in greater detail
     */
    reportUrl   : null,
    
    /**
     * @cfg {String} description A brief description of why this override is required
     */
    description : null,
    
    /**
     * @cfg {Function} applyFn A function that will apply the patch(es) manually, instead of using 'overrides';
     */
    applyFn : null,

    /**
     * @cfg {Boolean} ieOnly true if patch is only applicable to IE
     */
    ieOnly : false,

    /**
     * @cfg {Boolean} macOnly true if patch is only applicable for Mac
     */
    macOnly : false,

    /**
     * @cfg {Object} overrides a custom object containing the methods to be overridden.
     */
    overrides : null,

    onClassExtended: function(cls, data) {
        
        if (Sch.disableOverrides) {
            return;
        }

        if (data.ieOnly && !Ext.isIE) {
            return;
        }

        if (data.macOnly && !Ext.isMac) {
            return;
        }

        if ((!data.minVersion || Ext.versions.extjs.equals(data.minVersion) || Ext.versions.extjs.isGreaterThan(data.minVersion)) &&
            (!data.maxVersion || Ext.versions.extjs.equals(data.maxVersion) || Ext.versions.extjs.isLessThan(data.maxVersion))) {
            if (data.applyFn) {
                // Custom override, implementor has full control
                data.applyFn();
            } else {
                // Simple case, just an Ext override
                Ext.ClassManager.get(data.target).override(data.overrides);
            }
        }
    }
});

//http://www.sencha.com/forum/showthread.php?295892-Ext-JS-5.1-Post-GA-Patches&p=1080371&viewfull=1#post1080371
Ext.define('Sch.patches.Collection', {
    extend : 'Sch.util.Patch',

    requires   : ['Ext.util.Collection'],
    target     : 'Ext.util.Collection',
    minVersion : '5.1.0',

    overrides : {

        updateKey: function (item, oldKey) {
            var me = this,
                map = me.map,
                indices = me.indices,
                source = me.getSource(),
                newKey;

            if (source && !source.updating) {
                // If we are being told of the key change and the source has the same idea
                // on keying the item, push the change down instead.
                source.updateKey(item, oldKey);
            }
            // If there *is* an existing item by the oldKey and the key yielded by the new item is different from the oldKey...
            else if (map[oldKey] && (newKey = me.getKey(item)) !== oldKey) {
                if (oldKey in map || map[newKey] !== item) {
                    if (oldKey in map) {

                        delete map[oldKey];
                    }

                    // We need to mark ourselves as updating so that observing collections
                    // don't reflect the updateKey back to us (see above check) but this is
                    // not really a normal update cycle so we don't call begin/endUpdate.
                    me.updating++;

                    me.generation++;
                    map[newKey] = item;
                    if (indices) {
                        indices[newKey] = indices[oldKey];
                        delete indices[oldKey];
                    }

                    me.notify('updatekey', [{
                        item: item,
                        newKey: newKey,
                        oldKey: oldKey
                    }]);

                    me.updating--;
                }
            }
        }
    }
});
Ext.define('Sch.patches.OperationDestroy', {
    extend      : 'Sch.util.Patch',

    requires    : ['Ext.data.operation.Destroy'],
    target      : 'Ext.data.operation.Destroy',

    minVersion  : '5.1.1',

    maxVersion  : '5.1.2',

    overrides   : {
        doProcess   : function () {
            // clientRecords record size gets down on each clientRecords[i].setErased() call
            // so we make a copy by slicing this.getRecords()
            var clientRecords = Ext.Array.slice(this.getRecords()),
                clientLen = clientRecords.length,
                i;
            for (i = 0; i < clientLen; ++i) {
                clientRecords[i].setErased();
            }
        }
    }
});
//http://www.sencha.com/forum/showthread.php?295892-Ext-JS-5.1-Post-GA-Patches&p=1080371&viewfull=1#post1080371
Ext.define('Sch.patches.View', {
    extend : 'Sch.util.Patch',

    requires   : ['Ext.view.View'],
    target     : 'Ext.view.View',
    minVersion : '5.1.0',

    overrides : {
        handleEvent: function(e) {
            var me = this,
                isKeyEvent = me.keyEventRe.test(e.type),
                nm = me.getNavigationModel();

            e.view = me;

            if (isKeyEvent) {
                e.item = nm.getItem();
                e.record = nm.getRecord();
            }

            // If the key event was fired programatically, it will not have triggered the focus
            // so the NavigationModel will not have this information.
            if (!e.item) {
                e.item = e.getTarget(me.itemSelector);
            }
            if (e.item && !e.record) {
                e.record = me.getRecord(e.item);
            }

            if (me.processUIEvent(e) !== false) {
                me.processSpecialEvent(e);
            }

            // We need to prevent default action on navigation keys
            // that can cause View element scroll unless the event is from an input field.
            // We MUST prevent browser's default action on SPACE which is to focus the event's target element.
            // Focusing causes the browser to attempt to scroll the element into view.

            if (isKeyEvent && !Ext.fly(e.target).isInputField()) {
                if (e.getKey() === e.SPACE || e.isNavKeyPress(true)) {
                    e.preventDefault();
                }
            }
        }
    }
});

/**
@class Sch.locale.Locale

Base locale class. You need to subclass it, when creating new locales for Bryntum components. Usually subclasses of this class
will be singletones.

See <a href="#!/guide/gantt_scheduler_localization">Localization guide</a> for additional details.

*/
Ext.define('Sch.locale.Locale', {

    /**
     * @cfg {Object} l10n An object with the keys corresponding to class names and values are in turn objects with "phraseName/phraseTranslation"
     * key/values. For example:
     *
    l10n        : {
        'Sch.plugin.EventEditor' : {
            saveText: 'Speichern',
            deleteText: 'Löschen',
            cancelText: 'Abbrechen'
        },
        'Sch.plugin.CurrentTimeLine' : {
            tooltipText : 'Aktuelle Zeit'
        },

        ...
    }

     */
    l10n            : null,

    legacyMode      : true,

    localeName      : null,
    namespaceId     : null,


    constructor : function () {
        if (!Sch.locale.Active) {
            Sch.locale.Active = {};
            this.bindRequire();
        }

        var name            = this.self.getName().split('.');
        var localeName      = this.localeName = name.pop();
        this.namespaceId    = name.join('.');

        var currentLocale   = Sch.locale.Active[ this.namespaceId ];

        // let's localize all the classes that are loaded
        // except the cases when English locale is being applied over some non-english locale
        if (!(localeName == 'En' && currentLocale && currentLocale.localeName != 'En')) this.apply();
    },

    bindRequire : function () {
        // OVERRIDE
        // we need central hook to localize class once it's been created
        // to achieve it we override Ext.ClassManager.triggerCreated
        var _triggerCreated = Ext.ClassManager.triggerCreated;

        Ext.ClassManager.triggerCreated = function(className) {
            _triggerCreated.apply(this, arguments);

            if (className) {
                var cls     = Ext.ClassManager.get(className);
                // trying to apply locales for the loaded class
                for (var namespaceId in Sch.locale.Active) {
                    Sch.locale.Active[namespaceId].apply(cls);
                }
            }
        };
    },


    applyToClass : function (className, cls) {
        var me        = this,
            localeId  = me.self.getName();

        cls = cls || Ext.ClassManager.get(className);

        if (cls && (cls.activeLocaleId !== localeId)) {
            var locale = me.l10n[className];

            // if it's procedural localization - run provided callback
            if (typeof locale === 'function') {
                locale(className);

            // if it's a singleton - apply to it
            } else if (cls.singleton) {
                cls.l10n = Ext.apply({}, locale, cls.prototype && cls.prototype.l10n);

            // otherwise we override class
            } else {
                Ext.override(cls, { l10n : locale });
            }

            // if we support old locales approach let's duplicate locale to old places
            if (me.legacyMode) {
                var target;

                // we update either class prototype
                if (cls.prototype) {
                    target = cls.prototype;
                // or object itself in case of singleton
                } else if (cls.singleton) {
                    target = cls;
                }

                if (target && target.legacyMode) {

                    if (target.legacyHolderProp) {
                        if (!target[target.legacyHolderProp]) target[target.legacyHolderProp] = {};

                        target = target[target.legacyHolderProp];
                    }

                    for (var p in locale) {
                        if (typeof target[p] !== 'function') target[p] = locale[p];
                    }
                }
            }

            // keep applied locale
            cls.activeLocaleId  = localeId;

            // for singletons we can have some postprocessing
            if (cls.onLocalized) cls.onLocalized();
        }
    },


    /**
     * Apply this locale to classes.
     * @param {String[]/Object[]} [classNames] Array of class names (or classes themself) to localize.
     * If no classes specified then will localize all exisiting classes.
     */
    apply : function (classNames) {
        if (this.l10n) {
            var me = this;

            // if class name is specified
            if (classNames) {
                if (!Ext.isArray(classNames)) classNames = [classNames];

                var name, cls;
                for (var i = 0, l = classNames.length; i < l; i++) {
                    if (Ext.isObject(classNames[i])) {
                        if (classNames[i].singleton) {
                            cls     = classNames[i];
                            name    = Ext.getClassName(Ext.getClass(cls));
                        } else {
                            cls     = Ext.getClass(classNames[i]);
                            name    = Ext.getClassName(cls);
                        }
                    } else {
                        cls     = null;
                        name    = 'string' === typeof classNames[i] ? classNames[i] : Ext.getClassName(classNames[i]);
                    }

                    if (name) {
                        if (name in this.l10n) {
                            me.applyToClass(name, cls);
                        }
                    }
                }

            // localize all the classes that we know about
            } else {
                // update active locales
                Sch.locale.Active[this.namespaceId] = this;

                for (var className in this.l10n) {
                    me.applyToClass(className);
                }
            }
        }
    }
});

/**
 * English translations for the Scheduler component
 *
 * NOTE: To change locale for month/day names you have to use the corresponding Ext JS language file.
 */
Ext.define('Sch.locale.En', {
    extend      : 'Sch.locale.Locale',
    singleton   : true,

    constructor : function (config) {

        Ext.apply(this , {
            l10n        : {
                'Sch.util.Date' : {
                    unitNames : {
                        YEAR        : { single : 'year',    plural : 'years',   abbrev : 'yr' },
                        QUARTER     : { single : 'quarter', plural : 'quarters',abbrev : 'q' },
                        MONTH       : { single : 'month',   plural : 'months',  abbrev : 'mon' },
                        WEEK        : { single : 'week',    plural : 'weeks',   abbrev : 'w' },
                        DAY         : { single : 'day',     plural : 'days',    abbrev : 'd' },
                        HOUR        : { single : 'hour',    plural : 'hours',   abbrev : 'h' },
                        MINUTE      : { single : 'minute',  plural : 'minutes', abbrev : 'min' },
                        SECOND      : { single : 'second',  plural : 'seconds', abbrev : 's' },
                        MILLI       : { single : 'ms',      plural : 'ms',      abbrev : 'ms' }
                    }
                },

                'Sch.panel.TimelineGridPanel' : {
                    weekStartDay : 1,
                    loadingText  : 'Loading, please wait...',
                    savingText   : 'Saving changes, please wait...'
                },

                'Sch.panel.TimelineTreePanel' : {
                    weekStartDay : 1,
                    loadingText  : 'Loading, please wait...',
                    savingText   : 'Saving changes, please wait...'
                },

                'Sch.mixin.SchedulerView' : {
                    loadingText : 'Loading events...'
                },

                'Sch.plugin.CurrentTimeLine' : {
                    tooltipText : 'Current time'
                },

                'Sch.plugin.EventEditor' : {
                    saveText    : 'Save',
                    deleteText  : 'Delete',
                    cancelText  : 'Cancel'
                },

                'Sch.plugin.SimpleEditor' : {
                    newEventText    : 'New booking...'
                },

                'Sch.widget.ExportDialogForm' : {
                    formatFieldLabel            : 'Paper format',
                    orientationFieldLabel       : 'Orientation',
                    rangeFieldLabel             : 'Schedule range',
                    showHeaderLabel             : 'Add page number',
                    showFooterLabel             : 'Add footer',
                    orientationPortraitText     : 'Portrait',
                    orientationLandscapeText    : 'Landscape',
                    completeViewText            : 'Complete schedule',
                    currentViewText             : 'Visible schedule',
                    dateRangeText               : 'Date range',
                    dateRangeFromText           : 'Export from',
                    dateRangeToText             : 'Export to',
                    exportersFieldLabel         : 'Control pagination',
                    adjustCols                  : 'Adjust column width',
                    adjustColsAndRows           : 'Adjust column width and row height',
                    specifyDateRange            : 'Specify date range',
                    columnPickerLabel           : 'Select columns',
                    completeDataText            : 'Complete schedule (for all events)',
                    dpiFieldLabel               : 'DPI (dots per inch)',
                    rowsRangeLabel              : 'Rows range',
                    allRowsLabel                : 'All rows',
                    visibleRowsLabel            : 'Visible rows'
                },

                'Sch.widget.ExportDialog' : {
                    title                       : 'Export Settings',
                    exportButtonText            : 'Export',
                    cancelButtonText            : 'Cancel',
                    progressBarText             : 'Exporting...'
                },

                'Sch.plugin.Export' : {
                    generalError            : 'An error occurred',
                    fetchingRows            : 'Fetching row {0} of {1}',
                    builtPage               : 'Built page {0} of {1}',
                    requestingPrintServer   : 'Please wait...'
                },

                'Sch.plugin.Printable' : {
                    dialogTitle         : 'Print settings',
                    exportButtonText    : 'Print'
                },

                'Sch.plugin.exporter.AbstractExporter' : {
                    name    : 'Exporter'
                },

                'Sch.plugin.exporter.SinglePage' : {
                    name    : 'Single page'
                },

                'Sch.plugin.exporter.MultiPageVertical' : {
                    name    : 'Multiple pages (vertically)'
                },

                'Sch.plugin.exporter.MultiPage' : {
                    name    : 'Multiple pages'
                },

                // -------------- View preset date formats/strings -------------------------------------
                'Sch.preset.Manager' : {
                    hourAndDay  : {
                        displayDateFormat   : 'G:i',
                        middleDateFormat    : 'G:i',
                        topDateFormat       : 'D d/m'
                    },

                    secondAndMinute : {
                        displayDateFormat   : 'g:i:s',
                        topDateFormat       : 'D, d g:iA'
                    },

                    dayAndWeek      : {
                        displayDateFormat   : 'm/d h:i A',
                        middleDateFormat    : 'D d M'
                    },

                    weekAndDay      : {
                        displayDateFormat   : 'm/d',
                        bottomDateFormat    : 'd M',
                        middleDateFormat    : 'Y F d'
                    },

                    weekAndMonth : {
                        displayDateFormat   : 'm/d/Y',
                        middleDateFormat    : 'm/d',
                        topDateFormat       : 'm/d/Y'
                    },

                    weekAndDayLetter : {
                        displayDateFormat   : 'm/d/Y',
                        middleDateFormat    : 'D d M Y'
                    },

                    weekDateAndMonth : {
                        displayDateFormat   : 'm/d/Y',
                        middleDateFormat    : 'd',
                        topDateFormat       : 'Y F'
                    },

                    monthAndYear : {
                        displayDateFormat   : 'm/d/Y',
                        middleDateFormat    : 'M Y',
                        topDateFormat       : 'Y'
                    },

                    year : {
                        displayDateFormat   : 'm/d/Y',
                        middleDateFormat    : 'Y'
                    },

                    manyYears : {
                        displayDateFormat   : 'm/d/Y',
                        middleDateFormat    : 'Y'
                    }
                }
            }
        });

        this.callParent(arguments);
    }
});

/**
@class Sch.mixin.Localizable

A mixin providing localization functionality to the consuming class.

    Ext.define('My.Toolbar', {
        extend      : 'Ext.Toolbar',
        mixins      : [ 'Sch.mixin.Localizable' ],

        initComponent   : function () {
            Ext.apply(this, {
                items   : [
                    {
                        xtype       : 'button',

                        // get the button label from the current locale
                        text        : this.L('loginText')
                    }
                ]
            });

            this.callParent(arguments);
        }
    });

*/
Ext.define('Sch.mixin.Localizable', {

    // This line used to be like this:
    //      if Sch.config.locale is specified then we'll require corresponding class
    //      by default we require Sch.locale.En class
//          requires            : [ typeof Sch != 'undefined' && Sch.config && Sch.config.locale || 'Sch.locale.En' ],
    //
    // But, SenchaCMD does not support dynamic expressions for `requires`
    // Falling back to requiring English locale - that will cause English locale to always be included in the build
    // (even if user has specified another locale in other `requires`), but thats better than requiring users
    // to always specify and load the locale they need explicitly
    requires            : [ 'Sch.locale.En' ],

    legacyMode          : false,

    activeLocaleId      : '',

    /**
     * @cfg {Object} l10n Container of locales for the class.
     */
    l10n                : null,

    isLocaleApplied     : function () {
        var activeLocaleId = (this.singleton && this.activeLocaleId) || this.self.activeLocaleId;

        if (!activeLocaleId) return false;

        for (var ns in Sch.locale.Active) {
            if (activeLocaleId === Sch.locale.Active[ns].self.getName()) return true;
        }

        return false;
    },

    applyLocale         : function () {
        // loop over activated locale classes and call apply() method of each one
        for (var ns in Sch.locale.Active) {
            Sch.locale.Active[ns].apply(this.singleton ? this : this.self.getName());
        }
    },

    /**
     * This is shorthand reference to {@link #localize}. Retrieves translation of a phrase.
     * @param {String} id Identifier of phrase.
     * @param {String} [legacyHolderProp=this.legacyHolderProp] Legacy class property name containing locales.
     * @param {Boolean} [skipLocalizedCheck=false] Do not localize class if it's not localized yet.
     * @return {String} Translation of specified phrase.
     */
    L                   : function () {
        return this.localize.apply(this, arguments);
    },

    /**
     * Retrieves translation of a phrase. There is a shorthand {@link #L} for this method.
     * @param {String} id Identifier of phrase.
     * @param {String} [legacyHolderProp=this.legacyHolderProp] Legacy class property name containing locales.
     * @param {Boolean} [skipLocalizedCheck=false] Do not localize class if it's not localized yet.
     * @return {String} Translation of specified phrase.
     */
    localize            : function (id, legacyHolderProp, skipLocalizedCheck) {
        // if not localized yet let's do it
        if (!this.isLocaleApplied() && !skipLocalizedCheck) {
            this.applyLocale();
        }

        // `l10n` instance property has highest priority
        if (this.hasOwnProperty('l10n') && this.l10n.hasOwnProperty(id) && 'function' != typeof this.l10n[id]) return this.l10n[id];

        var clsProto    = this.self && this.self.prototype;

        // if there were old properties for localization on this class
        if (this.legacyMode) {
            // if they were kept under some property
            var prop        = legacyHolderProp || this.legacyHolderProp;

            // check object instance first
            var instHolder  = prop ? this[prop] : this;
            if (instHolder && instHolder.hasOwnProperty(id) && 'function' != typeof instHolder[id]) return instHolder[id];

            if (clsProto) {
                // then let's check class definition
                var clsHolder = prop ? clsProto[prop] : clsProto;
                if (clsHolder && clsHolder.hasOwnProperty(id) && 'function' != typeof clsHolder[id]) return clsHolder[id];
            }
        }

        // let's try to get locale from class prototype `l10n` property
        var result      = clsProto.l10n && clsProto.l10n[id];

        // if no transalation found
        if (result === null || result === undefined) {

            var superClass  = clsProto && clsProto.superclass;
            // if parent class also has localize() method
            if (superClass && superClass.localize) {
                // try to get phrase translation from parent class
                result = superClass.localize(id, legacyHolderProp, skipLocalizedCheck);
            }

            if (result === null || result === undefined) throw 'Cannot find locale: '+id+' ['+this.self.getName()+']';
        }

        return result;
    }
});

/**
 * @class Sch.util.Date
 * @static
 * Static utility class for Date manipulation
 */
Ext.define('Sch.util.Date', {
    requires        : 'Ext.Date',
    mixins          : ['Sch.mixin.Localizable'],
    singleton       : true,

    // These stem from Ext.Date in Ext JS but since they don't exist in Sencha Touch we'll need to keep them here
    stripEscapeRe   : /(\\.)/g,
    hourInfoRe      : /([gGhHisucUOPZ]|MS)/,

    unitHash        : null,
    unitsByName     : {},

    // Override this to localize the time unit names.
    //unitNames   : {
        //YEAR    : { single : 'year', plural : 'years', abbrev : 'yr' },
        //QUARTER : { single : 'quarter', plural : 'quarters', abbrev : 'q' },
        //MONTH   : { single : 'month', plural : 'months', abbrev : 'mon' },
        //WEEK    : { single : 'week', plural : 'weeks', abbrev : 'w' },
        //DAY     : { single : 'day', plural : 'days', abbrev : 'd' },
        //HOUR    : { single : 'hour', plural : 'hours', abbrev : 'h' },
        //MINUTE  : { single : 'minute', plural : 'minutes', abbrev : 'min' },
        //SECOND  : { single : 'second', plural : 'seconds', abbrev : 's' },
        //MILLI   : { single : 'ms', plural : 'ms', abbrev : 'ms' }
    //},


    constructor : function () {
        var ED = Ext.Date;
        var unitHash = this.unitHash = {
            /**
             * Date interval constant
             * @static
             * @type String
             */
            MILLI : ED.MILLI,

            /**
             * Date interval constant
             * @static
             * @type String
             */
            SECOND : ED.SECOND,

            /**
             * Date interval constant
             * @static
             * @type String
             */
            MINUTE : ED.MINUTE,

            /** Date interval constant
             * @static
             * @type String
             */
            HOUR : ED.HOUR,

            /**
             * Date interval constant
             * @static
             * @type String
             */
            DAY : ED.DAY,

            /**
             * Date interval constant
             * @static
             * @type String
             */
            WEEK : "w",

            /**
             * Date interval constant
             * @static
             * @type String
             */
            MONTH : ED.MONTH,

            /**
             * Date interval constant
             * @static
             * @type String
             */
            QUARTER : "q",

            /**
             * Date interval constant
             * @static
             * @type String
             */
            YEAR : ED.YEAR
        };
        Ext.apply(this, unitHash);

        var me = this;
        this.units = [me.MILLI, me.SECOND, me.MINUTE, me.HOUR, me.DAY, me.WEEK, me.MONTH, me.QUARTER, me.YEAR];
    },


    onLocalized : function () {
        this.setUnitNames(this.L('unitNames'));
    },


    /**
     * Call this method to provide your own, localized values for duration unit names. See the "/js/Sch/locale/sch-lang-*.js" files for examples
     *
     * @param {Object} unitNames
     */
    setUnitNames : function (unitNames) {
        var unitsByName = this.unitsByName = {};

        this.l10n.unitNames = unitNames;

        this._unitNames     = Ext.apply({}, unitNames);

        var unitHash        = this.unitHash;

        // Make it possible to lookup readable date names from both 'DAY' and 'd' etc.
        for (var name in unitHash) {
            if (unitHash.hasOwnProperty(name)) {
                var unitValue = unitHash[name];

                this._unitNames[ unitValue ] = this._unitNames[name];

                unitsByName[ name ] = unitValue;
                unitsByName[ unitValue ] = unitValue;
            }
        }
    },


    /**
     * Checks if this date is >= start and < end.
     * @param {Date} date The source date
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Boolean} true if this date falls on or between the given start and end dates.
     * @static
     */
    betweenLesser : function (date, start, end) {
        var t = date.getTime();
        return start.getTime() <= t && t < end.getTime();
    },

    /**
     * Constrains the date within a min and a max date
     * @param {Date} date The date to constrain
     * @param {Date} min Min date
     * @param {Date} max Max date
     * @return {Date} The constrained date
     * @static
     */
    constrain : function (date, min, max) {
        return this.min(this.max(date, min), max);
    },

    /**
     * Returns 1 if first param is a greater unit than second param, -1 if the opposite is true or 0 if they're equal
     * @static
     *
     * @param {String} unit1 The 1st unit
     * @param {String} unit2 The 2nd unit
     */
    compareUnits : function (u1, u2) {
        var ind1 = Ext.Array.indexOf(this.units, u1),
            ind2 = Ext.Array.indexOf(this.units, u2);

        return ind1 > ind2 ? 1 : (ind1 < ind2 ? -1 : 0);
    },

    /**
     * Returns true if first unit passed is strictly greater than the second.
     * @static
     *
     * @param {String} unit1 The 1st unit
     * @param {String} unit2 The 2nd unit
     */
    isUnitGreater : function (u1, u2) {
        return this.compareUnits(u1, u2) > 0;
    },

    /**
     * Copies hours, minutes, seconds, milliseconds from one date to another
     * @static
     *
     * @param {String} targetDate The target date
     * @param {String} sourceDate The source date
     */
    copyTimeValues : function (targetDate, sourceDate) {
        targetDate.setHours(sourceDate.getHours());
        targetDate.setMinutes(sourceDate.getMinutes());
        targetDate.setSeconds(sourceDate.getSeconds());
        targetDate.setMilliseconds(sourceDate.getMilliseconds());
    },

    /**
     * Adds a date unit and interval
     * @param {Date} date The source date
     * @param {String} unit The date unit to add
     * @param {Number} value The number of units to add to the date
     * @return {Date} The new date
     * @static
     */
    add : function (date, unit, value) {
        var d = Ext.Date.clone(date);
        if (!unit || value === 0) return d;

        switch (unit.toLowerCase()) {
            case this.MILLI:
                d = new Date(date.getTime() + value);
                break;
            case this.SECOND:
                d = new Date(date.getTime() + (value * 1000));
                break;
            case this.MINUTE:
                d = new Date(date.getTime() + (value * 60000));
                break;
            case this.HOUR:
                d = new Date(date.getTime() + (value * 3600000));
                break;
            case this.DAY:
                d.setDate(date.getDate() + value);

                if(d.getHours() === 23 && date.getHours() === 0) {
                    d = Ext.Date.add(d, Ext.Date.HOUR, 1);
                }
                break;
            case this.WEEK:
                d.setDate(date.getDate() + value * 7);
                break;
            case this.MONTH:
                var day = date.getDate();
                if (day > 28) {
                    day = Math.min(day, Ext.Date.getLastDateOfMonth(this.add(Ext.Date.getFirstDateOfMonth(date), this.MONTH, value)).getDate());
                }
                d.setDate(day);
                d.setMonth(d.getMonth() + value);
                break;
            case this.QUARTER:
                d = this.add(date, this.MONTH, value * 3);
                break;
            case this.YEAR:
                d.setFullYear(date.getFullYear() + value);
                break;
        }
        return d;
    },


    getUnitDurationInMs : function (unit) {
        // hopefully there were no DST changes in year 1
        return this.add(new Date(1, 0, 1), unit, 1) - new Date(1, 0, 1);
    },


    getMeasuringUnit : function (unit) {
        if (unit === this.WEEK) {
            return this.DAY;
        }
        return unit;
    },


    /**
     * Returns a duration of the timeframe in the given unit.
     * @static
     * @param {Date} start The start date of the timeframe
     * @param {Date} end The end date of the timeframe
     * @param {String} unit Duration unit
     * @return {Number} The duration in the units
     */
    getDurationInUnit : function (start, end, unit, doNotRound) {
        var units;

        switch (unit) {
            case this.YEAR:
                units = this.getDurationInYears(start, end);
                break;

            case this.QUARTER:
                units = this.getDurationInMonths(start, end) / 3;
                break;

            case this.MONTH:
                units = this.getDurationInMonths(start, end);
                break;

            case this.WEEK:
                units = this.getDurationInDays(start, end) / 7;
                break;

            case this.DAY:
                units = this.getDurationInDays(start, end);
                break;

            case this.HOUR:
                units = this.getDurationInHours(start, end);
                break;

            case this.MINUTE:
                units = this.getDurationInMinutes(start, end);
                break;

            case this.SECOND:
                units = this.getDurationInSeconds(start, end);
                break;

            case this.MILLI:
                units = this.getDurationInMilliseconds(start, end);
                break;
        }

        return doNotRound ? units : Math.round(units);
    },


    getUnitToBaseUnitRatio : function (baseUnit, unit) {
        if (baseUnit === unit) {
            return 1;
        }

        switch (baseUnit) {
            case this.YEAR:
                switch (unit) {
                    case this.QUARTER:
                        return 1 / 4;

                    case this.MONTH:
                        return 1 / 12;
                }
                break;

            case this.QUARTER:
                switch (unit) {
                    case this.YEAR:
                        return 4;

                    case this.MONTH:
                        return 1 / 3;
                }
                break;

            case this.MONTH:
                switch (unit) {
                    case this.YEAR:
                        return 12;

                    case this.QUARTER:
                        return 3;
                }
                break;

            case this.WEEK:
                switch (unit) {
                    case this.DAY:
                        return 1 / 7;

                    case this.HOUR:
                        return 1 / 168;
                }
                break;

            case this.DAY:
                switch (unit) {
                    case this.WEEK:
                        return 7;

                    case this.HOUR:
                        return 1 / 24;

                    case this.MINUTE:
                        return 1 / 1440;
                }
                break;

            case this.HOUR:
                switch (unit) {
                    case this.DAY:
                        return 24;

                    case this.MINUTE:
                        return 1 / 60;
                }
                break;

            case this.MINUTE:
                switch (unit) {
                    case this.HOUR:
                        return 60;

                    case this.SECOND:
                        return 1 / 60;

                    case this.MILLI:
                        return 1 / 60000;
                }
                break;

            case this.SECOND:
                switch (unit) {
                    case this.MILLI:
                        return 1 / 1000;
                }
                break;


            case this.MILLI:
                switch (unit) {
                    case this.SECOND:
                        return 1000;
                }
                break;

        }

        return -1;
    },

    /**
     * Returns the number of milliseconds between the two dates
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Number} true number of minutes between the two dates
     * @static
     */
    getDurationInMilliseconds : function (start, end) {
        return (end - start);
    },

    /**
     * Returns the number of seconds between the two dates
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Number} The number of seconds between the two dates
     * @static
     */
    getDurationInSeconds : function (start, end) {
        return (end - start) / 1000;
    },

    /**
     * Returns the number of minutes between the two dates
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Number} true number of minutes between the two dates
     * @static
     */
    getDurationInMinutes : function (start, end) {
        return (end - start) / 60000;
    },

    /**
     * Returns the number of hours between the two dates.
     *
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Number} true number of hours between the two dates
     * @static
     */
    getDurationInHours : function (start, end) {
        return (end - start) / 3600000;
    },

    /**
     * This method returns the number of days between the two dates. It assumes a day is 24 hours and tries to take the DST into account.
     *
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Number} true number of days between the two dates
     *
     * @static
     */
    getDurationInDays : function (start, end) {
        var dstDiff     = start.getTimezoneOffset() - end.getTimezoneOffset();

        return (end - start + dstDiff * 60 * 1000) / 86400000;
    },

    /**
     * Returns the number of whole months between the two dates
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Number} The number of whole months between the two dates
     * @static
     */
    getDurationInMonths : function (start, end) {
        return ((end.getFullYear() - start.getFullYear()) * 12) + (end.getMonth() - start.getMonth());
    },

    /**
     * Returns the number of years between the two dates
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Number} The number of whole months between the two dates
     * @static
     */
    getDurationInYears : function (start, end) {
        return this.getDurationInMonths(start, end) / 12;
    },

    /**
     * Returns the lesser of the two dates
     * @param {Date} date1
     * @param {Date} date2
     * @return {Date} Returns the lesser of the two dates
     * @static
     */
    min : function (d1, d2) {
        return d1 < d2 ? d1 : d2;
    },

    /**
     * Returns the greater of the two dates
     * @param {Date} date1
     * @param {Date} date2
     * @return {Date} Returns the greater of the two dates
     * @static
     */
    max : function (d1, d2) {
        return d1 > d2 ? d1 : d2;
    },

    /**
     * Returns true if dates intersect
     * @param {Date} start1
     * @param {Date} end1
     * @param {Date} start2
     * @param {Date} end2
     * @return {Boolean} Returns true if dates intersect
     * @static
     */
    intersectSpans : function (date1Start, date1End, date2Start, date2End) {
        return this.betweenLesser(date1Start, date2Start, date2End) ||
            this.betweenLesser(date2Start, date1Start, date1End);
    },

    /**
     * Returns a name of the duration unit, matching its property on the Sch.util.Date class.
     * So, for example:
     *
     *      Sch.util.Date.getNameOfUnit(Sch.util.Date.DAY) == 'DAY' // true
     *
     * @static
     * @param {String} unit Duration unit
     * @return {String}
     */
    getNameOfUnit : function (unit) {
        unit = this.getUnitByName(unit);

        switch (unit.toLowerCase()) {
            case this.YEAR      :
                return 'YEAR';
            case this.QUARTER   :
                return 'QUARTER';
            case this.MONTH     :
                return 'MONTH';
            case this.WEEK      :
                return 'WEEK';
            case this.DAY       :
                return 'DAY';
            case this.HOUR      :
                return 'HOUR';
            case this.MINUTE    :
                return 'MINUTE';
            case this.SECOND    :
                return 'SECOND';
            case this.MILLI     :
                return 'MILLI';
        }

        throw "Incorrect UnitName";
    },

    /**
     * Returns a human-readable name of the duration unit. For for example for `Sch.util.Date.DAY` it will return either
     * "day" or "days", depending from the `plural` argument
     * @static
     * @param {String} unit Duration unit
     * @param {Boolean} plural Whether to return a plural name or singular
     * @return {String}
     */
    getReadableNameOfUnit : function (unit, plural) {
        if (!this.isLocaleApplied()) this.applyLocale();
        return this._unitNames[ unit ][ plural ? 'plural' : 'single' ];
    },

    /**
     * Returns an abbreviated form of the name of the duration unit.
     * @static
     * @param {String} unit Duration unit
     * @return {String}
     */
    getShortNameOfUnit : function (unit) {
        if (!this.isLocaleApplied()) this.applyLocale();
        return this._unitNames[ unit ].abbrev;
    },

    getUnitByName : function (name) {
        if (!this.isLocaleApplied()) this.applyLocale();

        if (!this.unitsByName[ name ]) {
            Ext.Error.raise('Unknown unit name: ' + name);
        }

        return this.unitsByName[ name ];
    },


    /**
     * Returns the beginning of the Nth next duration unit, after the provided `date`.
     * For example for the this call:
     *      Sch.util.Date.getNext(new Date('Jul 15, 2011'), Sch.util.Date.MONTH, 1)
     *
     * will return: Aug 1, 2011
     *
     * @static
     * @param {Date} date The date
     * @param {String} unit The duration unit
     * @param {Number} increment How many duration units to skip
     * @param {Number} weekStartDay The day index of the 1st day of the week.
     *                Only required when `unit` is `WEEK`. 0 for Sunday, 1 for Monday, 2 for Tuesday, and so on (defaults to 1).
     * @return {Date} The beginning of the next duration unit interval
     */
    getNext : function (date, unit, increment, weekStartDay) {
        var dt          = Ext.Date.clone(date);

        weekStartDay    = arguments.length < 4 ? 1 : weekStartDay;
        // support 0 increment
        increment       = increment == null ? 1 : increment;

        switch (unit) {
            case this.MILLI:
                dt = this.add(date, unit, increment);
                break;

            case this.SECOND:
                dt = this.add(date, unit, increment);

                if (dt.getMilliseconds() > 0) {
                    dt.setMilliseconds(0);
                }
                break;

            case this.MINUTE:
                dt = this.add(date, unit, increment);

                if (dt.getSeconds() > 0) {
                    dt.setSeconds(0);
                }
                if (dt.getMilliseconds() > 0) {
                    dt.setMilliseconds(0);
                }
                break;

            case this.HOUR:
                dt = this.add(date, unit, increment);

                // Without these checks Firefox messes up the date and it changes timezone in certain edge cases
                // See test 021_sch_util_date_dst.t.js
                if (dt.getMinutes() > 0) {
                    dt.setMinutes(0);
                }
                if (dt.getSeconds() > 0) {
                    dt.setSeconds(0);
                }
                if (dt.getMilliseconds() > 0) {
                    dt.setMilliseconds(0);
                }
                break;

            case this.DAY:
                // Check if date has 23 hrs and is in Chile timezone
                var midnightNotInTimeScale = date.getHours() === 23 && this.add(dt, this.HOUR, 1).getHours() === 1;

                if (midnightNotInTimeScale) {
                    // Correct the date manually for DST transitions happening at 00:00
                    dt = this.add(dt, this.DAY, 2);
                    this.clearTime(dt);

                    return dt;
                }

                this.clearTime(dt);

                dt = this.add(dt, this.DAY, increment);

                // Brazil timezone issue #1642, tested in 028_timeaxis_dst.t.js
                if (dt.getHours() === 1) {
                    this.clearTime(dt);
                }
                break;

            case this.WEEK:

                this.clearTime(dt);
                var day = dt.getDay();
                dt = this.add(dt, this.DAY, weekStartDay - day + 7 * (increment - (weekStartDay <= day ? 0 : 1)));

                // For south american timezones, midnight does not exist on DST transitions, adjust...
                if (dt.getDay() !== weekStartDay) {
                    dt = this.add(dt, this.HOUR, 1);
                } else {
                    this.clearTime(dt);
                }
                break;

            case this.MONTH:
                dt = this.add(dt, this.MONTH, increment);
                dt.setDate(1);
                this.clearTime(dt);
                break;

            case this.QUARTER:
                dt = this.add(dt, this.MONTH, ((increment - 1) * 3) + (3 - (dt.getMonth() % 3)));
                this.clearTime(dt);
                dt.setDate(1);
                break;

            case this.YEAR:
                dt = new Date(dt.getFullYear() + increment, 0, 1);
                break;

            default:
                throw 'Invalid date unit';
        }

        return dt;
    },


    getNumberOfMsFromTheStartOfDay : function (date) {
        return date - this.clearTime(date, true) || 86400000;
    },


    getNumberOfMsTillTheEndOfDay : function (date) {
        return this.getStartOfNextDay(date, true) - date;
    },


    getStartOfNextDay : function (date, clone, noNeedToClearTime) {
        var nextDay = this.add(noNeedToClearTime ? date : this.clearTime(date, clone), this.DAY, 1);

        // DST case
        if (nextDay.getDate() == date.getDate()) {
            var offsetNextDay   = this.add(this.clearTime(date, clone), this.DAY, 2).getTimezoneOffset();
            var offsetDate      = date.getTimezoneOffset();

            nextDay             = this.add(nextDay, this.MINUTE, offsetDate - offsetNextDay);
        }

        return nextDay;
    },

    getEndOfPreviousDay : function (date, noNeedToClearTime) {
        var dateOnly = noNeedToClearTime ? date : this.clearTime(date, true);

        // dates are different
        if (dateOnly - date) {
            return dateOnly;
        } else {
            return this.add(dateOnly, this.DAY, -1);
        }
    },

    /**
     * Returns true if the first time span completely 'covers' the second time span. E.g.
     *      Sch.util.Date.timeSpanContains(new Date(2010, 1, 2), new Date(2010, 1, 5), new Date(2010, 1, 3), new Date(2010, 1, 4)) ==> true
     *      Sch.util.Date.timeSpanContains(new Date(2010, 1, 2), new Date(2010, 1, 5), new Date(2010, 1, 3), new Date(2010, 1, 6)) ==> false
     * @static
     * @param {Date} spanStart The start date for initial time span
     * @param {Date} spanEnd The end date for initial time span
     * @param {Date} otherSpanStart The start date for the 2nd time span
     * @param {Date} otherSpanEnd The end date for the 2nd time span
     * @return {Boolean}
     */
    timeSpanContains : function (spanStart, spanEnd, otherSpanStart, otherSpanEnd) {
        return (otherSpanStart - spanStart) >= 0 && (spanEnd - otherSpanEnd) >= 0;
    },

    /**
     * Compares two days with given precision, for example if `date1` is Aug 1st, 2014 08:00 AM and `date2`
     * is Aug 1st, 2014 09:00 and `precisionUnit` is {@link Sch.util.Date.DAY} then both dates a considered equal
     * since they point to the same day.
     *
     * @param {Date} date1
     * @param {Date} date2
     * @param {String} [precisionUnit=Sch.util.Date.MILLI]
     * @return {Integer}
     * - -1 if `date1` is lesser than `date2`
     * - +1 if `date1` is greater than `date2`
     * -  0 if `date1` is equal to `date2`
     */
    compareWithPrecision : function(date1, date2, precisionUnit) {
        var D = Sch.util.Date,
            ED = Ext.Date,
            result;

        switch (precisionUnit) {
            case D.DAY:
                date1 = Number(ED.format(date1, 'Ymd'));
                date2 = Number(ED.format(date2, 'Ymd'));
                break;
            case D.WEEK:
                date1 = Number(ED.format(date1, 'YmW'));
                date2 = Number(ED.format(date2, 'YmW'));
                break;
            case D.MONTH:
                date1 = Number(ED.format(date1, 'Ym'));
                date2 = Number(ED.format(date2, 'Ym'));
                break;
            case D.QUARTER:
                date1 = date1.getFullYear() * 4 + Math.floor(date1.getMonth() / 3);
                date2 = date2.getFullYear() * 4 + Math.floor(date2.getMonth() / 3);
                break;
            case D.YEAR:
                date1 = date1.getFullYear();
                date2 = date2.getFullYear();
                break;
            default:
            case D.MILLI:
            case D.SECOND:
            case D.MINUTE:
            case D.HOUR:
                precisionUnit = precisionUnit && this.getUnitDurationInMs(precisionUnit) || 1;
                date1 = Math.floor(date1.valueOf() / precisionUnit);
                date2 = Math.floor(date2.valueOf() / precisionUnit);
                break;
        }

        ((date1 < date2) && (result = -1)) ||
        ((date1 > date2) && (result = +1)) ||
                            (result =  0);

        return result;
    },

    getValueInUnits : function (date, unit) {
        switch (unit) {
            case this.MONTH : return date.getMonth();
            case this.DAY   : return date.getDate();
            case this.HOUR  : return date.getHours();
            case this.MINUTE    : return date.getMinutes();
            case this.SECOND    : return date.getSeconds();
        }
    },

    setValueInUnits : function (date, unit, value) {
        var result = Ext.Date.clone(date),
            f;

        switch (unit) {
            case this.YEAR      : f = 'setFullYear'; break;
            case this.MONTH     : f = 'setMonth'; break;
            case this.DAY       : f = 'setDate'; break;
            case this.HOUR      : f = 'setHours'; break;
            case this.MINUTE    : f = 'setMinutes'; break;
            case this.SECOND    : f = 'setSeconds'; break;
            case this.MILLI     : f = 'setMilliseconds'; break;
        }

        result[f](value);

        return result;
    },

    getSubUnit          : function (unit) {
        switch (unit) {
            case this.YEAR      : return this.MONTH;
            /* falls through */
            case this.MONTH     : return this.DAY;
            /* falls through */
            case this.DAY       : return this.HOUR;
            /* falls through */
            case this.HOUR      : return this.MINUTE;
            /* falls through */
            case this.MINUTE    : return this.SECOND;
            /* falls through */
            case this.SECOND    : return this.MILLI;
            /* falls through */
        }
    },

    setValueInSubUnits  : function (date, unit, value) {
        unit = this.getSubUnit(unit);
        return this.setValueInUnits(date, unit, value);
    },
    /*
     * section for calendar view related functions
     */

    mergeDates : function (target, source, unit) {
        var copy        = Ext.Date.clone(target);

        switch (unit) {
            case this.YEAR      : copy.setFullYear(source.getFullYear());

            /* falls through */
            case this.MONTH     : copy.setMonth(source.getMonth());

            /* falls through */
            case this.WEEK      :

            /* falls through */
            case this.DAY       :
                // we want to return week start day for this case
                if (unit === this.WEEK) {
                    copy = this.add(copy, this.DAY, source.getDay() - copy.getDay());
                } else {
                    copy.setDate(source.getDate());
                }

            /* falls through */
            case this.HOUR      : copy.setHours(source.getHours());

            /* falls through */
            case this.MINUTE    : copy.setMinutes(source.getMinutes());

            /* falls through */
            case this.SECOND    : copy.setSeconds(source.getSeconds());

            /* falls through */
            case this.MILLI     : copy.setMilliseconds(source.getMilliseconds());
        }

        return copy;
    },

    // splitting specified unit to subunits including start of the next span
    // e.g. week will be split to days, days to hours, etc.
    splitToSubUnits : function (start, unit, increment, weekStartDay) {
        increment       = increment || 1;
        weekStartDay    = arguments.length < 4 ? 1 : weekStartDay;
        switch (unit) {
//            case this.YEAR      : return this.splitYear(start, increment, weekStartDay);
            case this.MONTH     : return this.splitMonth(start, increment, weekStartDay);
            case this.WEEK      : //return this.splitWeek(start, increment, weekStartDay);
            /* falls through */
            case this.DAY       : return this.splitDay(start, increment);
//            case this.HOUR      : return this.splitHour(start, increment);
//            case this.MINUTE    : return this.splitMinute(start, increment);
            default : break;
        }
    },

    splitYear   : function (start, increment) {
        var newStart    = this.clearTime(start, true);
        newStart.setMonth(0);
        newStart.setDate(1);

        var result      = [];

        for (var i = 0; i <= 12; i = i + increment) {
            result.push(this.add(newStart, this.MONTH, i));
        }

        return result;
    },

    splitMonth  : function (start, increment, weekStartDay) {
        var newStart    = this.clearTime(start, true);
        newStart.setDate(1);
        newStart        = this.add(newStart, this.DAY, weekStartDay - newStart.getDay());

        var currentDate = Ext.Date.clone(newStart);
        var monthEnd    = this.add(newStart, this.MONTH, 1);

        var result      = [];

        for (var i = 0; currentDate.getTime() < monthEnd.getTime(); i = i + increment) {
            currentDate = this.add(newStart, this.WEEK, i);
            result.push(currentDate);
        }

        return result;
    },

    splitWeek   : function (start, increment, weekStartDay) {
        var newStart    = this.add(start, this.DAY, weekStartDay - start.getDay());
        newStart        = this.clearTime(newStart);

        var result      = [];

        for (var i = 0; i <= 7; i = i + increment) {
            result.push(this.add(newStart, this.DAY, i));
        }

        return result;
    },

    splitDay    : function (start, increment) {
        var copy    = this.clearTime(start, true);

        var result  = [];

        for (var i = 0; i <= 24; i = i + increment) {
            result.push(this.add(copy, this.HOUR, i));
        }

        return result;
    },

    splitHour   : function (start, increment) {
        var copy = new Date(start.getTime());
        copy.setMinutes(0);
        copy.setSeconds(0);
        copy.setMilliseconds(0);

        var result = [];

        for (var i = 0; i <= 60; i = i + increment) {
            result.push(this.add(copy, this.MINUTE, i));
        }

        return result;
    },

    splitMinute : function (start, increment) {
        var copy    = Ext.Date.clone(start);
        copy.setSeconds(0);
        copy.setMilliseconds(0);

        var result  = [];

        for (var i = 0; i <= 60; i = i + increment) {
            result.push(this.add(copy, this.SECOND, i));
        }

        return result;
    },

    // Need this to prevent some browsers (Safari in Sydney timezone) to not mess up a date
    // See tests marked *dst* and https://www.assembla.com/spaces/bryntum/tickets/1757#/activity/ticket:
    clearTime : function(dt, clone) {
        if (dt.getHours() > 0 || dt.getMinutes() > 0 || dt.getSeconds() > 0) {
            return Ext.Date.clearTime(dt, clone);
        }

        return clone ? Ext.Date.clone(dt) : dt;
    }
});

/**
 * Simple caching utility.
 *
 * Internaly obtains a key value suitable to be used as object property name via {@link Sch.util.Cache#key key()}
 * method and caches a value provided under the key obtained, values with the same key are groupped
 * into single array. Cached values are obtained via {@link Sch.util.Cache#get get()} method and are managed via
 * {@link Sch.util.Cache#add add()}, {@link Sch.util.Cache#remove remove()}, {@link Sch.util.Cache#move move()},
 * {@link Sch.util.Cache#clear clear()}
 * methods.
 */
Ext.define('Sch.util.Cache', {

    cache : null,

    /**
     * @constructor
     */
    constructor : function() {
        this.cache = {};
    },

    /**
     * A function returning a key for given value.
     *
     * @param  {Mixed} v
     * @return {String}
     * @template
     */
    key : function(v) {
        var result;

        if (v instanceof Ext.data.Model) {
            result = v.getId().toString();
        }
        else if (v === undefined || v === null) {
            result = "[ undefined / null ]";
        }
        else {
            result = (v).toString();
        }

        return result;
    },

    /**
     * Returns all values cached with a given key, or if key isn't present executes a given function, caches
     * it's result (which should be array) after it's mapped over {@link #map} and returns it.
     *
     * *Warning*: the array returned must not be modified otherwise cache integrity will be violated.
     *
     * @param {Mixed} k
     * @param {Function} [fn]
     * @param {[Mixed]}  [fn.return]
     * @return {[Mixed]}
     */
    get : function(k, fn) {
        var me = this,
            result;

        k = me.key(k);

        result = me.cache.hasOwnProperty(k) && me.cache[k];

        if (!result && fn) {
            result = fn();
        }
        else if (!result) {
            result = [];
        }

        me.cache[k] = result;

        return result;
    },

    /**
     * Caches a value using either a key provided or a key obtained from {@link #key key()} method.
     *
     * @param {Mixed} k
     * @param {Mixed} v
     * @chainable
     */
    add : function(k, v) {
        var me = this,
            kAdopted = me.key(k);

        if (!me.cache.hasOwnProperty(kAdopted)) {
            me.cache[kAdopted] = me.get(k); // initial key cache filling
        }

        Ext.Array.include(me.cache[kAdopted], v);

        return me;
    },

    /**
     * Removes cached value from cache under a given key or under a key obtained from {@link #key key()} method.
     *
     * @param {Mixed} k
     * @param {Mixed} v
     * @chainable
     */
    remove : function(k, v) {
        var me = this;

        k = me.key(k);

        if (me.cache.hasOwnProperty(k)) {
            Ext.Array.remove(me.cache[k], v);
        }

        return me;
    },

    /**
     * Moves all items or a single item under old key to new key
     *
     * @param {Mixed} oldKey
     * @param {Mixed} newKey
     */
    move : function(oldKey, newKey, v) {
        var me = this;

        oldKey = me.key(oldKey);
        newKey = me.key(newKey);

        if (oldKey != newKey && arguments.length >= 3) {
            me.remove(oldKey, v);
            me.add(newKey, v);
        }
        else if (oldKey != newKey && me.cache.hasOwnProperty(oldKey) && me.cache.hasOwnProperty(newKey)) {
            me.cache[newKey] = Ext.Array.union(me.cache[newKey], me.cache[oldKey]);
            me.cache[oldKey] = [];
        }
        else if (oldKey != newKey && me.cache.hasOwnProperty(oldKey)) {
            me.cache[newKey] = me.cache[oldKey];
            me.cache[oldKey] = [];
        }
    },

    /**
     * Clears entire cache, or clears cache for a given key.
     *
     * @param {Mixed} [k]
     * @chainable
     */
    clear : function(k) {
        var me = this;

        if (!arguments.length) {
            me.cache = {};
        }
        else {
            k = me.key(k);
            if (me.cache.hasOwnProperty(k)) {
                delete me.cache[k];
            }
        }

        return me;
    },

    /**
     * Removes value from entire cache (from every key it exists under).
     *
     * @param {Mixed} v
     * @chanable
     */
    uncache : function(v) {
        var me = this,
            k;

        for (k in me.cache) {
            if (me.cache.hasOwnProperty(k)) {
                me.cache[k] = Ext.Array.remove(me.cache[k], v);
            }
        }

        return me;
    }
});

/**
@class Sch.model.Customizable
@extends Ext.data.Model

This class represent a model with customizable field names. Customizable fields are defined in separate
class config `customizableFields`. The format of definition is just the same as for usual fields:

        Ext.define('BaseModel', {
            extend             : 'Sch.model.Customizable',

            customizableFields : [
                { name : 'StartDate', type : 'date', dateFormat : 'c' },
                { name : 'EndDate',   type : 'date', dateFormat : 'c' }
            ],

            fields             : [
                'UsualField'
            ],

            getEndDate : function () {
                return "foo"
            }
        });

For each customizable field will be created getter and setter, using the camel-cased name of the field ("stable name"),
prepended with "get/set" respectively. They will not overwrite any existing methods:

        var baseModel   = new BaseModel({
            StartDate   : new Date(2012, 1, 1),
            EndDate     : new Date(2012, 2, 3)
        });

        // using getter for "StartDate" field
        // returns date for "2012/02/01"
        var startDate   = baseModel.getStartDate();

        // using custom getter for "EndDate" field
        // returns "foo"
        var endDate     = baseModel.getEndDate();

You can change the name of the customizable fields in the subclasses of the model or completely re-define them.
For that, add a special property to the class, name of this property should be formed as name of the field with lowercased first
letter, appended with "Field". The value of the property should contain the new name of the field.

        Ext.define('SubModel', {
            extend         : 'BaseModel',

            startDateField : 'beginDate',
            endDateField   : 'finalizeDate',

            fields         : [
                { name : 'beginDate', type : 'date', dateFormat : 'Y-m-d' },
            ]
        });

        var subModel     = new SubModel({
            beginDate    : new Date(2012, 1, 1),
            finalizeDate : new Date(2012, 2, 3)
        });

        // name of getter is still the same
        var startDate = subModel.getStartDate();

In the example above the `StartDate` field was completely re-defined to the `beginDate` field with different date format.
The `EndDate` has just changed its name to "finalizeDate". Note, that getters and setters are always named after "stable"
field name, not the customized one.
*/

// Don't redefine the class, which will screw up instanceof checks etc
if (!Ext.ClassManager.get("Sch.model.Customizable")) {

    Ext.define('Sch.model.Customizable', {
        extend             : 'Ext.data.Model',

        /**
         * @cfg {Array} customizableFields
         *
         * The array of customizale fields definitions.
         */
        customizableFields : null,

        // @private
        // Keeps temporary state of the previous state for a model, but is only available
        // when a model has changed, e.g. after 'set' or 'reject'. After those operations are completed, this property is cleared.
        previous           : null,

        // temp flag to check if we're currently editing the model
        __editing          : null,

        // To support nested beginEdit calls (see 043_nested_beginedit.t.js in Gantt)
        __editCounter      : 0,

        constructor : function() {
            // Sencha Touch requires the return value to be returned, hard crash without it
            var retVal = this.callParent(arguments);

            return retVal;
        },

        onClassExtended : function (cls, data, hooks) {
            var onBeforeCreated = hooks.onBeforeCreated;

            hooks.onBeforeCreated = function (cls, data) {
                onBeforeCreated.apply(this, arguments);

                var proto                   = cls.prototype;

                if (!proto.customizableFields) {
                    return;
                }

                // combining our customizable fields with ones from superclass
                // our fields goes after fields from superclass to overwrite them if some names match
                proto.customizableFields    = (cls.superclass.customizableFields || []).concat(proto.customizableFields);

                var customizableFields      = proto.customizableFields;

                // collect fields here, overwriting old ones with new
                var customizableFieldsByName    = {};
                // HACK, crashes without these in 5.1
                var me = this;
                var idField = Ext.Array.findBy(cls.fields, function(f) { return f.name === proto.idProperty; });

                me.idField = proto.idField = idField;

                if (!cls.fieldsMap[proto.idProperty]) {
                    cls.fieldsMap[proto.idProperty] = idField;
                }
                // EOF HACK, crashes without these in 5.1

                Ext.Array.forEach(customizableFields, function (field) {
                    // normalize to object
                    if (typeof field == 'string') field = { name : field };

                    customizableFieldsByName[ field.name ] = field;
                });

                // already processed by the Ext.data.Model `onBeforeCreated`
                var fields                  = proto.fields;
                var toAdd                   = [];
                var toRemove                = [];

                Ext.Array.forEach(fields, function (field) {
                    if (field.isCustomizableField) {
                        toRemove.push(field.getName());
                    }
                });

                if (proto.idProperty !== 'id' && proto.getField('id')) {

                    if (!proto.getField('id').hasOwnProperty('name')) {
                        toRemove.push('id');
                    }
                }

                if (proto.idProperty !== 'Id' && proto.getField('Id')) {

                    if (!proto.getField('Id').hasOwnProperty('name')) {
                        toRemove.push('Id');
                    }
                }

                cls.removeFields(toRemove);

                Ext.Object.each(customizableFieldsByName, function (name, customizableField) {
                    // mark all customizable fields with special property, to be able remove them later
                    customizableField.isCustomizableField     = true;

                    var stableFieldName     = customizableField.name || customizableField.getName();
                    var fieldProperty       = stableFieldName === 'Id' ? 'idProperty' : stableFieldName.charAt(0).toLowerCase() + stableFieldName.substr(1) + 'Field';
                    var overrideFieldName   = proto[ fieldProperty ];

                    var realFieldName       = overrideFieldName || stableFieldName;
                    var field;

                    if (proto.getField(realFieldName)) {
                        field = Ext.applyIf({ name : stableFieldName, isCustomizableField : true }, proto.getField(realFieldName));

                        // if user has re-defined some customizable field, mark it accordingly
                        // such fields weren't be inheritable though (won't replace the customizable field)
                        proto.getField(realFieldName).isCustomizableField = true;

                        // add it to our customizable fields list on the last position, so in the subclasses
                        // it will overwrite other fields with this name

                        field = Ext.create('data.field.' + (field.type || 'auto'), field);

                        customizableFields.push(field);
                    } else {
                        field = Ext.applyIf({ name : realFieldName, isCustomizableField : true }, customizableField);

                        field = Ext.create('data.field.' + (field.type || 'auto'), field);

                        // we create a new copy of the `customizableField` using possibly new name
                        toAdd.push(field);
                    }

                    var capitalizedStableName  = Ext.String.capitalize(stableFieldName);

                    // don't overwrite `getId` method
                    if (capitalizedStableName != 'Id') {
                        var getter              = 'get' + capitalizedStableName;
                        var setter              = 'set' + capitalizedStableName;

                        // overwrite old getters, pointing to a different field name
                        if (!proto[ getter ] || proto[ getter ].__getterFor__ && proto[ getter ].__getterFor__ != realFieldName) {
                            proto[ getter ] = function () {
                                // Need to read this property from the prototype if it exists, instead of relying on the field
                                // Since if someone subclasses a model and redefines a fieldProperty - the realFieldName variable
                                // will still have the value of the superclass
                                // See test 024_event.t.js
                                return this.get(this[fieldProperty] || realFieldName);
                            };

                            proto[ getter ].__getterFor__   = realFieldName;
                        }

                        // same for setters
                        if (!proto[ setter ] || proto[ setter ].__setterFor__ && proto[ setter ].__setterFor__ != realFieldName) {

                            proto[ setter ] = function (value) {
                                // Need to read this property from the prototype if it exists, instead of relying on the field
                                // Since if someone subclasses a model and redefines a fieldProperty - the realFieldName variable
                                // will still have the value of the superclass
                                // See test 024_event.t.js
                                return this.set(this[fieldProperty] || realFieldName, value);
                            };

                            proto[ setter ].__setterFor__   = realFieldName;
                        }
                    }
                });

                cls.addFields(toAdd);
            };
        },

        // Overridden to be able to track previous record field values
        set : function(fieldName, value) {
            var currentValue;
            var retVal;

            this.previous = this.previous || {};

            if (typeof fieldName === 'string') {
                currentValue = this.get(fieldName);

                // convert new value to Date if needed
                if (currentValue instanceof Date && !(value instanceof Date)) {
                    value   = this.getField(fieldName).convert(value, this);
                }

                // Store previous field value if it changed, if value didn't change - just return
                if ((currentValue instanceof Date && (currentValue - value)) || !(currentValue instanceof Date) && currentValue !== value) {
                    this.previous[fieldName] = currentValue;
                } else {
                    return [];
                }
            } else {
                for (var o in fieldName) {
                    currentValue    = this.get(o);

                    var newValue    = fieldName[o];

                    // convert new value to Date if needed
                    if (currentValue instanceof Date && !(newValue instanceof Date)) {
                        newValue    = this.getField(o).convert(newValue, this);
                    }

                    // Store previous field value
                    if ((currentValue instanceof Date && (currentValue - newValue)) || !(currentValue instanceof Date) && currentValue !== newValue) {
                        this.previous[o] = currentValue;
                    }
                }
            }
            retVal = this.callParent(arguments);

            if (!this.__editing) {
                delete this.previous;
            }

            return retVal;
        },

        // Overridden to be able to track previous record field values
        reject : function () {
            var me = this,
                modified = me.modified || {},
                field;

            // Ext could call 'set' during the callParent which should not reset the 'previous' object
            me.__editing = true;

            me.previous = me.previous || {};

            for (field in modified) {
                if (modified.hasOwnProperty(field)) {
                    if (typeof modified[field] != "function") {
                        me.previous[field] = me.get(field);
                    }
                }
            }
            me.callParent(arguments);

            // Reset the previous tracking object
            delete me.previous;
            me.__editing = false;
        },

        beginEdit: function () {
            this.__editCounter++;
            this.__editing = true;

            this.callParent(arguments);
        },

        cancelEdit: function () {
            this.__editCounter = 0;
            this.__editing = false;
            this.callParent(arguments);

            delete this.previous;
        },

        // Overridden to be able to clear the previous record field values. Must be done here to have access to the 'previous' object after
        // an endEdit call.
        endEdit: function (silent, modifiedFieldNames) {
            if (--this.__editCounter === 0) {

                // OVERRIDE HACK: If no fields were changed, make sure no events are fired by signaling 'silent'
                if (!silent && this.getModifiedFieldNames /* Touch doesn't have this method, skip optimization */ ) {
                    var editMemento = this.editMemento;
                    if (!modifiedFieldNames) {
                        modifiedFieldNames = this.getModifiedFieldNames(editMemento.data);
                    }

                    if (modifiedFieldNames && modifiedFieldNames.length === 0) {
                        silent = true;
                    }
                }

                this.callParent([silent].concat(Array.prototype.slice.call(arguments, 1)));

                this.__editing = false;
                delete this.previous;
            }
        }
        // -------------- EOF Supporting nested beginEdit calls - see test 043_nested_beginedit.t.js
    });
}

/**

 @class Sch.model.Range
 @extends Sch.model.Customizable

 This class represent a simple date range. It is being used in various subclasses and plugins which operate on date ranges.

 Its a subclass of the {@link Sch.model.Customizable}, which is in turn subclass of {@link Ext.data.Model}.
 Please refer to documentation of those classes to become familar with the base interface of this class.

 A range has the following fields:

 - `StartDate`   - start date of the task in the ISO 8601 format
 - `EndDate`     - end date of the task in the ISO 8601 format (not inclusive)
 - `Name`        - an optional name of the range
 - `Cls`         - an optional CSS class to be associated with the range.

 The name of any field can be customized in the subclass. Please refer to {@link Sch.model.Customizable} for details.

 */

if (!Ext.ClassManager.get("Sch.model.Range")) {
    Ext.define('Sch.model.Range', {
        extend : 'Sch.model.Customizable',

        requires : [
            'Sch.util.Date'
        ],

        idProperty : 'Id',

        // For Sencha Touch
        config     : Ext.versions.touch ? { idProperty : 'Id' } : null,

        /**
         * @cfg {String} startDateField The name of the field that defines the range start date. Defaults to "StartDate".
         */
        startDateField : 'StartDate',

        /**
         * @cfg {String} endDateField The name of the field that defines the range end date. Defaults to "EndDate".
         */
        endDateField : 'EndDate',

        /**
         * @cfg {String} nameField The name of the field that defines the range name. Defaults to "Name".
         */
        nameField : 'Name',

        /**
         * @cfg {String} clsField The name of the field that holds the range "class" value (usually corresponds to a CSS class). Defaults to "Cls".
         */
        clsField : 'Cls',

        customizableFields : [
        /**
         * @method getStartDate
         *
         * Returns the range start date
         *
         * @return {Date} The start date
         */
            { name : 'StartDate', type : 'date', dateFormat : 'c' },

        /**
         * @method getEndDate
         *
         * Returns the range end date
         *
         * @return {Date} The end date
         */
            { name : 'EndDate', type : 'date', dateFormat : 'c' },

        /**
         * @method getCls
         *
         * Gets the "class" of the range
         *
         * @return {String} cls The "class" of the range
         */
        /**
         * @method setCls
         *
         * Sets the "class" of the range
         *
         * @param {String} cls The new class of the range
         */
            {
                name : 'Cls', type : 'string'
            },

        /**
         * @method getName
         *
         * Gets the name of the range
         *
         * @return {String} name The "name" of the range
         */
        /**
         * @method setName
         *
         * Sets the "name" of the range
         *
         * @param {String} name The new name of the range
         */
            {
                name : 'Name', type : 'string'
            }
        ],

        /**
         * @method setStartDate
         *
         * Sets the range start date
         *
         * @param {Date} date The new start date
         * @param {Boolean} keepDuration Pass `true` to keep the duration of the task ("move" the event), `false` to change the duration ("resize" the event).
         * Defaults to `false`
         */
        setStartDate : function (date, keepDuration) {
            var endDate = this.getEndDate();
            var oldStart = this.getStartDate();

            this.set(this.startDateField, date);

            if (keepDuration === true && endDate && oldStart) {
                this.setEndDate(Sch.util.Date.add(date, Sch.util.Date.MILLI, endDate - oldStart));
            }
        },

        /**
         * @method setEndDate
         *
         * Sets the range end date
         *
         * @param {Date} date The new end date
         * @param {Boolean} keepDuration Pass `true` to keep the duration of the task ("move" the event), `false` to change the duration ("resize" the event).
         * Defaults to `false`
         */
        setEndDate : function (date, keepDuration) {
            var startDate = this.getStartDate();
            var oldEnd = this.getEndDate();

            this.set(this.endDateField, date);

            if (keepDuration === true && startDate && oldEnd) {
                this.setStartDate(Sch.util.Date.add(date, Sch.util.Date.MILLI, -(oldEnd - startDate)));
            }
        },

        /**
         * Sets the event start and end dates
         *
         * @param {Date} start The new start date
         * @param {Date} end The new end date
         */
        setStartEndDate : function (start, end) {
            this.beginEdit();

            this.set(this.startDateField, start);
            this.set(this.endDateField, end);

            this.endEdit();
        },

        /**
         * Returns an array of dates in this range. If the range starts/ends not at the beginning of day, the whole day will be included.
         * @return {Date[]}
         */
        getDates : function () {
            var dates = [],
                endDate = this.getEndDate();

            for (var date = Ext.Date.clearTime(this.getStartDate(), true); date < endDate; date = Sch.util.Date.add(date, Sch.util.Date.DAY, 1)) {

                dates.push(date);
            }

            return dates;
        },


        /**
         * Iterates over the results from {@link #getDates}
         * @param {Function} func The function to call for each date
         * @param {Object} scope The scope to use for the function call
         */
        forEachDate : function (func, scope) {
            return Ext.each(this.getDates(), func, scope);
        },

        // Simple check if end date is greater than start date
        isValid     : function () {
            var valid = this.callParent(arguments);

            if (valid) {
                var start = this.getStartDate(),
                    end = this.getEndDate();

                valid = !start || !end || (end - start >= 0);
            }

            return valid;
        },

        /**
         * Shift the dates for the date range by the passed amount and unit
         * @param {String} unit The unit to shift by (e.g. range.shift(Sch.util.Date.DAY, 2); ) to bump the range 2 days forward
         * @param {Number} amount The amount to shift
         */
        shift : function (unit, amount) {
            this.setStartEndDate(
                Sch.util.Date.add(this.getStartDate(), unit, amount),
                Sch.util.Date.add(this.getEndDate(), unit, amount)
            );
        },

        fullCopy : function () {
            return this.copy.apply(this, arguments);
        }
    });
}
/**
@class Sch.model.Resource
@extends Sch.model.Customizable

This class represent a single Resource in the scheduler chart. It's a subclass of the {@link Sch.model.Customizable}, which is in turn subclass of {@link Ext.data.Model}.
Please refer to documentation of those classes to become familar with the base interface of the resource.

A Resource has only 2 mandatory fields - `Id` and `Name`. If you want to add more fields with meta data describing your resources then you should subclass this class:

    Ext.define('MyProject.model.Resource', {
        extend      : 'Sch.model.Resource',

        fields      : [
            // `Id` and `Name` fields are already provided by the superclass
            { name: 'Company',          type : 'string' }
        ],

        getCompany : function () {
            return this.get('Company');
        },
        ...
    });

If you want to use other names for the Id and Name fields you can configure them as seen below:

    Ext.define('MyProject.model.Resource', {
        extend      : 'Sch.model.Resource',

        nameField   : 'UserName',
        ...
    });

Please refer to {@link Sch.model.Customizable} for details.
*/

// Don't redefine the class, which will screw up instanceof checks etc
if (!Ext.ClassManager.get('Sch.model.Resource')) Ext.define('Sch.model.Resource', {
    extend : 'Sch.model.Customizable',

    idProperty : 'Id',
    config     : Ext.versions.touch ? { idProperty : 'Id' } : null,

    /**
     * @cfg {String} nameField The name of the field that holds the resource name. Defaults to "Name".
     */
    nameField : 'Name',

    customizableFields : [
        /**
         * @method getName
         *
         * Returns the resource name
         *
         * @return {String} The name of the resource
         */
        /**
         * @method setName
         *
         * Sets the resource name
         *
         * @param {String} The new name of the resource
         */
        { name : 'Name', type : 'string' }
    ],

    getInternalId : function() {
        return this.internalId;
    },

    /**
     * Returns a resource store this resource is part of. Resource must be part
     * of a resource store to be able to retrieve resource store.
     *
     * @return {Sch.data.ResourceStore|null}
     */
    getResourceStore : function() {
        return this.joined && this.joined[ 0 ];
    },

    /**
     * Returns an event store this resource uses as default. Resource must be part
     * of a resource store to be able to retrieve event store.
     *
     * @return {Sch.data.EventStore|null}
     */
    getEventStore : function () {
        var resourceStore = this.getResourceStore();
        return resourceStore && resourceStore.getEventStore() || this.parentNode && this.parentNode.getEventStore();
    },

    /**
     * Returns as assignment store this resources uses as default. Resource must be part
     * of a resource store to be able to retrieve default assignment store.
     *
     * @return {Sch.data.AssignmentStore|null}
     */
    getAssignmentStore : function() {
        var eventStore = this.getEventStore();
        return eventStore && eventStore.getAssignmentStore();
    },

    /**
     * Returns an array of events, associated with this resource
     *
     * @param {Sch.data.EventStore} eventStore (optional) The event store to get events for (if a resource is bound to multiple stores)
     * @return {Sch.model.Range[]}
     */
    getEvents : function (eventStore) {
        var me = this;
        eventStore = eventStore || me.getEventStore();
        return eventStore && eventStore.getEventsForResource(me) || [];
    },

    /**
     * Returns all assignments for the resource. Resource must be part of the store for this method to work.
     *
     * @return {[Sch.model.Assignment]}
     */
    getAssignments : function() {
        var me = this,
            eventStore = me.getEventStore();

        return eventStore && eventStore.getAssignmentsForResource(me);
    },

    /**
     * Returns true if the Resource can be persisted.
     * In a flat store resource is always considered to be persistable, in a tree store resource is considered to
     * be persitable if it's parent node is persistable.
     *
     * @return {Boolean} true if this model can be persisted to server.
     */
    isPersistable : function() {
        var parent = this.parentNode;
        return !parent || !parent.phantom || (parent.isRoot && parent.isRoot());
    }
});

/**

@class Sch.model.Event
@extends Sch.model.Range

This class represent a single event in your schedule. Its a subclass of the {@link Sch.model.Range}, which is in turn subclass of {@link Sch.model.Customizable} and {@link Ext.data.Model}.
Please refer to documentation of those classes to become familar with the base interface of the task.

The Event model has a few predefined fields as seen below. If you want to add new fields or change the options for the existing fields,
you can do that by subclassing this class (see example below).

Fields
------

- `Id`          - (mandatory) unique identificator of task
- `Name`        - name of the event (task title)
- `StartDate`   - start date of the task in the ISO 8601 format
- `EndDate`     - end date of the task in the ISO 8601 format,
- `ResourceId`  - The id of the associated resource
- `Resizable`   - A field allowing you to easily control how an event can be resized. You can set it to: true, false, 'start' or 'end' as its value.
- `Draggable`   - A field allowing you to easily control if an event can be dragged. (true or false)
- `Cls`         - A field containing a CSS class to be added to the rendered event element.

Subclassing the Event model class
--------------------

    Ext.define('MyProject.model.Event', {
        extend      : 'Sch.model.Event',

        fields      : [
            // adding new field
            { name: 'MyField', type : 'number', defaultValue : 0 }
        ],

        myCheckMethod : function () {
            return this.get('MyField') > 0
        },
        ...
    });

If you want to use other names for the StartDate, EndDate, ResourceId and Name fields you can configure them as seen below:

    Ext.define('MyProject.model.Event', {
        extend      : 'Sch.model.Event',

        startDateField  : 'taskStart',
        endDateField    : 'taskEnd',

        // just rename the fields
        resourceIdField : 'userId',
        nameField       : 'taskTitle',

        fields      : [
            // completely change the definition of fields
            { name: 'taskStart', type: 'date', dateFormat : 'Y-m-d' },
            { name: 'taskEnd', type: 'date', dateFormat : 'Y-m-d' },
        ]
        ...
    });

Please refer to {@link Sch.model.Customizable} for additional details.

*/
if (!Ext.ClassManager.get("Sch.model.Event")) Ext.define('Sch.model.Event', {
    extend : 'Sch.model.Range',

    idProperty : 'Id',

    customizableFields : [
        { name : 'ResourceId' },
        { name : 'Draggable', type : 'boolean', persist : false, defaultValue : true },   // true or false
        { name : 'Resizable', persist : false, defaultValue : true }                     // true, false, 'start' or 'end'
    ],

    /**
     * @cfg {String} resourceIdField The name of the field identifying the resource to which an event belongs. Defaults to "ResourceId".
     */
    resourceIdField : 'ResourceId',

    /**
     * @cfg {String} draggableField The name of the field specifying if the event should be draggable in the timeline
     */
    draggableField : 'Draggable',

    /**
     * @cfg {String} resizableField The name of the field specifying if/how the event should be resizable.
     */
    resizableField : 'Resizable',

    getInternalId : function() {
        return this.internalId;
    },

    /**
     * Returns an event store this event is part of. Event must be part
     * of an event store to be able to retrieve event store.
     *
     * @return {Sch.data.EventStore}
     */
    getEventStore : function() {
        var me = this,
            result = me.joined && me.joined[0];

        if (result && !result.isEventStore) {
            // sort stores to avoid extra array walks in future
            Ext.Array.sort(me.joined, function(a, b) {
                return (a.isEventStore || false) > (b.isEventStore || false) && -1 || 1;
            });
            result = me.joined[0];

            // record can be joined to several stores none of which is an event store
            // e.g. if record is in viewmodel. test 025_eventstore
            result = result.isEventStore ? result : null;
        }

        return result;
    },

    /**
     * Returns a resource store this event uses as default resource store. Event must be part
     * of an event store to be able to retrieve default resource store.
     *
     * @return {Sch.data.ResourceStore}
     */
    getResourceStore : function() {
        var eventStore = this.getEventStore();
        return eventStore && eventStore.getResourceStore();
    },

    /**
     * Returns an assigment store this event uses as default assignment store. Event must be part
     * of an event store to be able to retrieve default assignment store.
     *
     * @return {Sch.data.AssigmentStore}
     */
    getAssignmentStore : function() {
        var eventStore = this.getEventStore();
        return eventStore && eventStore.getAssignmentStore();
    },

    /**
     * Returns all resources assigned to an event.
     *
     * @return {Sch.model.Resource[]}
     */
    getResources : function() {
        var me = this,
            eventStore = me.getEventStore();

        return eventStore && eventStore.getResourcesForEvent(me) || [];
    },

    /**
     * @private
     */
    forEachResource : function (fn, scope) {
        var rs = this.getResources();

        for (var i = 0; i < rs.length; i++) {
            if (fn.call(scope || this, rs[i]) === false) {
                return;
            }
        }
    },

    /**
     * Returns either the resource associated with this event (when called w/o `resourceId`) or resource
     * with specified id.
     *
     * @param {String} resourceId (optional)
     * @return {Sch.model.Resource}
     */
    getResource : function (resourceId, eventStore) { // TODO: this signature sucks, eventStore WHY?
        var me              = this,
            result          = null,
            resourceStore;

        eventStore    = eventStore || me.getEventStore();
        resourceStore = eventStore && eventStore.getResourceStore();

        // Allow 0 as a valid resource id
        resourceId = resourceId == null ? me.getResourceId() : resourceId;

        if (eventStore && (resourceId === null || resourceId === undefined)) {
            result = eventStore.getResourcesForEvent(me);

            if (result.length == 1) {
                result = result[0];
            }
            else if (result.length > 1) {
                Ext.Error.raise("Event::getResource() is not applicable for events with multiple assignments, please use Event::getResources() instead.");
            }
            else {
                result = null;
            }
        }
        else if (resourceStore) {
            result = resourceStore.getModelById(resourceId);
        }

        return result;
    },

    /**
     * Sets the resource which the event should belong to.
     *
     * @param {Sch.model.Resource/Mixed} resource The new resource
     */
    setResource : function(resource) {
        var me = this,
            eventStore = me.getEventStore();

        eventStore && eventStore.removeAssignmentsForEvent(me);

        me.assign(resource);
    },

    /**
     * Assigns this event to the specified resource.
     *
     * @param {Sch.model.Resource/Mixed/Array} resource A new resource for this event, either as a full Resource record or an id (or an array of such).
     */
    assign : function(resource) {
        var me = this,
            eventStore = me.getEventStore();

        resource = resource instanceof Sch.model.Resource ? resource.getId() : resource; // resource id might be 0 thus we use ? operator

        if (eventStore) {
            eventStore.assignEventToResource(me, resource);
        }
        else {
            me.setResourceId(resource);
        }
    },

    /**
     * Unassigns this event from the specified resource
     *
     * @param {Sch.model.Resource/Mixed/Array} [resource] The resource to unassign from.
     */
    unassign : function(resource) {
        var me = this,
            eventStore = me.getEventStore();

        resource = resource instanceof Sch.model.Resource ? resource.getId() : resource; // resource id might be 0 thus we use ? operator

        if (eventStore) {
            eventStore.unassignEventFromResource(me, resource);
        }
        else if (me.getResourceId() == resource) {
            me.setResourceId(null);
        }
    },

    /**
     * Reassigns an event from an old resource to a new resource
     *
     * @param {Sch.model.Resource/Mixed} resource A resource to unassign from
     * @param {Sch.model.Resource/Mixed} resource A resource to assign to
     */
    reassign : function(oldResource, newResource) {
        var me = this,
            eventStore = me.getEventStore();

        oldResource = oldResource instanceof Sch.model.Resource ? oldResource.getId() : oldResource; // resource id might be 0 thus we use ? operator
        newResource = newResource instanceof Sch.model.Resource ? newResource.getId() : newResource; // resource id might be 0 thus we use ? operator

        if (eventStore) {
            eventStore.reassignEventFromResourceToResource(me, oldResource, newResource);
        }
        else {
            me.setResourceId(newResource);
        }
    },

    /**
     * @method isAssignedTo
     * Returns true if this event is assigned to a certain resource.
     *
     * @param {Sch.model.Resource/Mixed} resource The resource to query for
     * @return {Boolean}
     */
    isAssignedTo : function(resource) {
        var me = this,
            eventStore = me.getEventStore(),
            result = false;

        resource = resource instanceof Sch.model.Resource && resource.getId() || resource;

        if (eventStore) {
            result = eventStore.isEventAssignedToResource(me, resource);
        }
        else {
            result = me.getResourceId() == resource;
        }

        return result;
    },

    /**
     * Returns all assignments for the event. Event must be part of the store for this method to work.
     *
     * @return {Sch.model.Assignment[]}
     */
    getAssignments : function() {
        var me = this,
            eventStore = me.getEventStore();

        return eventStore && eventStore.getAssignmentsForEvent(me);
    },

    /**
     * @method setDraggable
     *
     * Sets the new draggable state for the event
     * @param {Boolean} draggable true if this event should be draggable
     */

    /**
     * @method isDraggable
     *
     * Returns true if event can be drag and dropped
     * @return {Mixed} The draggable state for the event.
     */
    isDraggable : function () {
        return this.getDraggable();
    },

    /**
     * @method setResizable
     *
     * Sets the new resizable state for the event. You can specify true/false, or 'start'/'end' to only allow resizing one end of an event.
     * @param {Boolean} resizable true if this event should be resizable
     */

    /**
     * @method getResourceId
     *
     * Returns the resource id of the resource that the event belongs to.
     * @return {Mixed} The resource Id
     */

    /**
     * @method isResizable
     *
     * Returns true if event can be resized, but can additionally return 'start' or 'end' indicating how this event can be resized.
     * @return {Mixed} The resource Id
     */
    isResizable : function () {
        return this.getResizable();
    },

    /**
     * @method setResourceId
     *
     * Sets the new resource id of the resource that the event belongs to.
     * @param {Mixed} resourceId The resource Id
     */

    /**
     * Returns false if a linked resource is a phantom record, i.e. it's not persisted in the database.
     *
     * @return {Boolean} valid
     */
    isPersistable : function () {
        var me = this,
            eventStore = me.getEventStore();
        return eventStore && eventStore.isEventPersistable(me);
    }
});

/**
 * This class manages id consistency among model stores, it listens to 'idchanged' event on each store and updates
 * referential fields referencing records with changed ids in other model entities.
 *
 * Note on update process:
 *  at the time when 'idchanged' handler is called we can effectively query stores which are using caches for
 *  a data cached under old id, but we cannot update related models with the new id since at the time of
 *  'idchanged' handler is called a record which id has been updated is still marked as phantom, it's
 *  phantom flag will be reset only at 'update' event time (and 'idchanged' event is always followed by 'update'
 *  event) and it's important we start updating related records after primary records are not phantoms
 *  any more since we might rely on this flag (for example a related store sync operation might be blocked
 *  if primary store records it relies on are still phantom).
 *
 * @private
 */
if (!Ext.ClassManager.get("Sch.data.util.IdConsistencyManager")) Ext.define('Sch.data.util.IdConsistencyManager', {

    config : {
        eventStore      : null,
        resourceStore   : null,
        assignmentStore : null
    },

    eventStoreDetacher     : null,
    resourceStoreDetacher  : null,

    constructor : function(config) {
        this.initConfig(config);
    },

    // {{{ Event attachers
    updateEventStore : function(newEventStore, oldEventStore) {
        var me = this;

        Ext.destroyMembers(me, 'eventStoreDetacher');

        if (newEventStore) {
            me.eventStoreDetacher = newEventStore.on({
                idchanged   : me.onEventIdChanged,
                scope       : me,
                destroyable : true,
                // It's important that priority here was more then in assignment/event store caches
                // otherwise quering by old id won't return correct results, assignment will be moved
                // to new event id already if this priority is lower then the one used in cache
                priority    : 200
            });
        }
    },

    updateResourceStore : function(newResourceStore, oldResourceStore) {
        var me = this;

        Ext.destroyMembers(me, 'resourceStoreDetacher');

        if (newResourceStore) {
            me.resourceStoreDetacher = newResourceStore.on({
                idchanged   : me.onResourceIdChanged,
                scope       : me,
                destroyable : true,
                // It's important that priority here was more then in assignment/event store caches
                // otherwise quering by old id won't return correct results, assignment will be moved
                // to new resource id already if this priority is lower then the one used in cache
                priority    : 200
            });
        }
    },
    // }}}

    // {{{ Event handlers

    // Please see the note at the class description
    onEventIdChanged : function(eventStore, event, oldId, newId) {
        var me = this,
            assignmentStore = me.getAssignmentStore(),
            assignmentsUpdater;

        if (assignmentStore) {
            assignmentsUpdater = me.getUpdateAssignmentEventIdFieldFn(assignmentStore, oldId, newId);
            eventStore.on(
                'update',
                assignmentsUpdater,
                null,
                { single : true, priority : 200 }
            );
        }
    },

    // Please see the note at the class description
    onResourceIdChanged : function(resourceStore, resource, oldId, newId) {
        var me = this,
            eventStore = me.getEventStore(),
            assignmentStore = me.getAssignmentStore(),
            eventsUpdater,
            assignmentsUpdater;

        if (eventStore && !assignmentStore) {
            eventsUpdater = me.getUpdateEventResourceIdFieldFn(eventStore, oldId, newId);
        }

        if (assignmentStore) {
            assignmentsUpdater = me.getUpdateAssignmentResourceIdFieldFn(assignmentStore, oldId, newId);
        }

        if (eventsUpdater || assignmentStore) {
            resourceStore.on(
                'update',
                function() {
                    eventsUpdater && eventsUpdater();
                    assignmentsUpdater && assignmentsUpdater();
                },
                null,
                { single : true, priority : 200 }
            );
        }
    },
    // }}}

    // {{{ Update rules
    getUpdateEventResourceIdFieldFn : function(eventStore, oldId, newId) {
        var events = eventStore.getRange();

        return function() {
            Ext.Array.forEach(events, function(event) {
                event.getResourceId() == oldId && event.setResourceId(newId);
            });
        };
    },

    getUpdateAssignmentEventIdFieldFn : function(assignmentStore, oldId, newId) {
        var assignments = assignmentStore.getAssignmentsForEvent(oldId);

        return function() {
            Ext.Array.forEach(assignments, function(assignment) {
                assignment.getEventId() == oldId && assignment.setEventId(newId);
            });
        };
    },

    getUpdateAssignmentResourceIdFieldFn : function(assignmentStore, oldId, newId) {
        var assignments = assignmentStore.getAssignmentsForResource(oldId);

        return function() {
            Ext.Array.forEach(assignments, function(assignment) {
                assignment.getResourceId() == oldId && assignment.setResourceId(newId);
            });
        };
    }
    // }}}
});

/**
 * This class manages model persistency, it listens to model stores' beforesync event and removes all non persistable
 * records from sync operation. The logic has meaning only for CRUD-less sync operations.
 *
 * @private
 */
if (!Ext.ClassManager.get("Sch.data.util.ModelPersistencyManager")) Ext.define('Sch.data.util.ModelPersistencyManager', {

    config : {
        eventStore      : null,
        resourceStore   : null,
        assignmentStore : null
    },

    eventStoreDetacher      : null,
    resourceStoreDetacher   : null,
    assignmentStoreDetacher : null,

    constructor : function(config) {
        this.initConfig(config);
    },

    // {{{ Event attachers
    updateEventStore : function(newEventStore, oldEventStore) {
        var me = this;

        Ext.destroyMembers(me, 'eventStoreDetacher');

        if (newEventStore && newEventStore.autoSync) {
            me.eventStoreDetacher = newEventStore.on({
                beforesync  : me.onEventStoreBeforeSync,
                scope       : me,
                destroyable : true,
                // Just in case
                priority    : 100
            });
        }
    },

    updateResourceStore : function(newResourceStore, oldResourceStore) {
        var me = this;

        Ext.destroyMembers(me, 'resourceStoreDetacher');

        if (newResourceStore && newResourceStore.autoSync) {
            me.resourceStoreDetacher = newResourceStore.on({
                beforesync  : me.onResourceStoreBeforeSync,
                scope       : me,
                destroyable : true,
                // Just in case
                priority    : 100
            });
        }
    },

    updateAssignmentStore : function(newAssignmentStore, oldAssignmentStore) {
        var me = this;

        Ext.destroyMembers(me, 'assignmentStoreDetacher');

        if (newAssignmentStore && newAssignmentStore.autoSync) {
            me.assignmentStoreDetacher = newAssignmentStore.on({
                beforesync  : me.onAssignmentStoreBeforeSync,
                scope       : me,
                destroyable : true,
                // Just in case
                priority    : 100
            });
        }
    },
    // }}}

    // {{{ Event handlers
    onEventStoreBeforeSync : function(options) {
        var me = this;
        me.removeNonPersistableRecordsToCreate(options);
        return me.shallContinueSync(options);
    },

    onResourceStoreBeforeSync : function(options) {
        var me = this;
        me.removeNonPersistableRecordsToCreate(options);
        return me.shallContinueSync(options);
    },

    onAssignmentStoreBeforeSync : function(options) {
        var me = this;
        me.removeNonPersistableRecordsToCreate(options);
        return me.shallContinueSync(options);
    },
    // }}}

    // {{{ Management rules
    removeNonPersistableRecordsToCreate : function(options) {
        var recordsToCreate = options.create || [],
            r, i;

        // We remove from the array we iterate thus we iterate from end to start
        for (i = recordsToCreate.length - 1; i >= 0; --i) {
            r = recordsToCreate[i];
            if (!r.isPersistable()) {
                Ext.Array.remove(recordsToCreate, r);
            }
        }

        // Prevent empty create request
        if (recordsToCreate.length === 0) {
            delete options.create;
        }
    },

    shallContinueSync : function(options) {
        return Boolean((options.create  && options.create.length  > 0) ||
                       (options.update  && options.update.length  > 0) ||
                       (options.destroy && options.destroy.length > 0));
    }
    // }}}
});

/**
 * Event store's resource->events cache.
 * Uses resource records or resource record ids as keys.
 *
 * @private
 */
Ext.define('Sch.data.util.ResourceEventsCache', {
    extend   : 'Sch.util.Cache',
    requires : [
        'Ext.data.Model'
    ],

    eventStore            : null,
    eventStoreDetacher    : null,
    resourceStoreDetacher : null,

    constructor : function(eventStore) {
        var me            = this,
            resourceStore = eventStore.getResourceStore();

        me.callParent();

        function onEventAdd(eventStore, events) {
            Ext.Array.forEach(events, function(event) {
                me.add(event.getResourceId(), event);
            });
        }

        function onEventRemove(eventStore, events) {
            Ext.Array.forEach(events, function(event) {
                me.remove(event.getResourceId(), event);
            });
        }

        function onEventUpdate(eventStore, event, operation, modifiedFieldNames) {
            var resourceIdField    = event.resourceIdField,
                resourceIdChanged  = event.previous && resourceIdField in event.previous,
                previousResourceId = resourceIdChanged && event.previous[resourceIdField];

            if (resourceIdChanged) {
                me.move(previousResourceId, event.getResourceId(), event);
            }
        }

        function onEventStoreClearOrReset() {
            me.clear();
        }

        function onEventStoreResourceStoreChange(eventStore, newResourceStore, oldResourceStore) {
            me.clear();
            attachToResourceStore(newResourceStore);
        }

        function onResourceIdChanged(resourceStore, resource, oldId, newId) {
            me.move(oldId, newId);
        }

        function onResourceRemove(resourceStore, resources) {
            Ext.Array.forEach(resources, function(resource) {
                me.clear(resource);
            });
        }

        function onResourceStoreClearOrReset() {
            me.clear();
        }

        function attachToResourceStore(resourceStore) {
            Ext.destroy(me.resourceStoreDetacher);
            me.resourceStoreDetacher = resourceStore && resourceStore.on({
                idchanged      : onResourceIdChanged,
                remove         : onResourceRemove,
                clear          : onResourceStoreClearOrReset,
                cacheresethint : onResourceStoreClearOrReset,
                rootchange     : onResourceStoreClearOrReset,
                priority       : 100,
                destroyable    : true
            });
        }

        me.eventStoreDetacher = eventStore.on({
            add                 : onEventAdd,
            remove              : onEventRemove,
            update              : onEventUpdate,
            clear               : onEventStoreClearOrReset,
            cacheresethint      : onEventStoreClearOrReset,
            rootchange          : onEventStoreClearOrReset,
            resourcestorechange : onEventStoreResourceStoreChange,
            // subscribing to the CRUD using priority - should guarantee that our listeners
            // will be called first (before any other listeners, that could be provided in the "listeners" config)
            // and state in other listeners will be correct
            priority            : 100,
            destroyable         : true
        });

        me.eventStoreFiltersDetacher = eventStore.getFilters().on('endupdate', onEventStoreClearOrReset, this, {
            // priority is calculated as:
            // Ext.util.Collection.$endUpdatePriority + 1
            // to reset our cache before ExtJS "on filter end update" listeners run
            priority    : 1002,
            destroyable : true
        });

        attachToResourceStore(resourceStore);

        me.eventStore = eventStore;
    },

    destroy : function() {
        var me = this;
        Ext.destroyMembers(
            me,
            'eventStoreDetacher',
            'eventStoreFiltersDetacher',
            'resourceStoreDetacher'
        );
        me.eventStore = null;
    },

    get : function(k, fn) {
        var me = this;

        k = me.key(k);

        fn = fn || function() {
            return Ext.Array.filter(me.eventStore.getRange(), function(event) {
                return event.getResourceId() == k;
            });
        };

        return me.callParent([k, fn]);
    }
});

/**
 * This mixin eliminates differences between flat/tree store in get by [internal] id functionality and it should be
 * mixed into data model stores.
 *
 * It adds two methods {@link #getModelById getModelById()} and {@link #getModelByInternalId getModelByInternalId()}
 * which should be used everywhere in the code instead of native getById() / getByInternalId() methods.
 *
 * @private
 */
if (!Ext.ClassManager.get("Sch.data.mixin.UniversalModelGetter")) Ext.define('Sch.data.mixin.UniversalModelGetter', {

    getModelById : function(id) {
        var me = this;
        return me.getNodeById ? me.getNodeById(id) : me.getById(id);
    },

    getModelByInternalId : function(id) {
        var me = this;
        return me.byInternalIdMap ? me.byInternalIdMap[id] : me.getByInternalId(id);
    }

});

/**
 * This mixin intercepts a set of store methods and firing a set of events providing a cache with a better hint
 * when to update itself.
 *
 * @private
 */
if (!Ext.ClassManager.get('Sch.data.mixin.CacheHintHelper')) Ext.define('Sch.data.mixin.CacheHintHelper', {
    extend : 'Ext.Mixin',

    mixinConfig : {
        before : {
            loadRecords : 'loadRecords'
        }
    },

    // Call to loadRecords() results in 'datachanged' and 'refresh' events, but 'datachanged' is also fired upon
    // call to add/remove/write/filter/sort/removeAll so a cache cannot detect what method call results in 'datachanged'
    // in case of previosly mentioned methods a cache shouldn't handle 'datachanged' event it is not affected by
    // write/filter/sort at all, as for add/remove/removeAll it listens to preceding events like 'add'/'remove'/'clear'
    // and reflects updates correspondingly. But in case of loadRecords() the sequence of events fired 'datachanged' and
    // 'refresh' provides to little information to make right decision whether to reset a cache or not, moreover resetting
    // a cache on 'refresh' is to late since a lot of logic (rendering logic especially) start quering the store
    // upon 'datachanged' event and thus if cache wasn't reset it will provide that logic with outdated data.
    // Thus I have to override loadRecords() and make it fire private 'loadrecords' event to provide a cache with
    // a way to reset itself beforehand.
    loadRecords : function() {
        var me = this;
        me.fireEvent('cacheresethint', me);
    }
});

if (!Ext.ClassManager.get("Sch.data.mixin.EventStore"))
/**
 * This is a mixin, containing functionality related to managing events.
 *
 * It is consumed by the regular {@link Sch.data.EventStore} class and {@link Gnt.data.TaskStore} class
 * to allow data sharing between gantt chart and scheduler. Please note though, that datasharing is still
 * an experimental feature and not all methods of this mixin can be used yet on a TaskStore.
 *
 */
Ext.define("Sch.data.mixin.EventStore", {
    extend : 'Ext.Mixin',

    requires : [
        'Sch.util.Date',
        'Sch.data.util.IdConsistencyManager',
        'Sch.data.util.ModelPersistencyManager',
        'Sch.data.util.ResourceEventsCache'
    ],

    isEventStore : true,

    resourceStore         : null,
    resourceStoreDetacher : null,

    /**
     * @cfg {Sch.data.AssignmentStore} assignmentStore Provide assignment store to enable multiple connections between
     * events and resources
     */
    assignmentStore       : null,

    resourceEventsCache     : null,
    idConsistencyManager    : null,
    modelPersistencyManager : null,

    mixinConfig : {
        after : {
            constructor : 'constructor',
            destroy : 'destroy'
        }
    },

    /**
     * @constructor
     */
    constructor : function() {
        var me = this;
        me.resourceEventsCache     = me.createResourceEventsCache();
        me.idConsistencyManager    = me.createIdConsistencyManager();
        me.modelPersistencyManager = me.createModelPersistencyManager();
    },

    destroy : function() {
        var me = this;
        Ext.destroyMembers(
            me,
            'resourceEventsCache',
            'idConsistencyManager',
            'modelPersistencyManager'
        );
    },

    /**
     * Creates and returns Resource->Events cache.
     *
     * @return {Sch.data.util.ResourceEventsCache}
     * @template
     * @protected
     */
    createResourceEventsCache : function() {
        return new Sch.data.util.ResourceEventsCache(this);
    },

    /**
     * Creates and returns id consistency manager
     *
     * @return {Sch.data.util.IdConsistencyManager}
     * @tempalte
     * @protected
     */
    createIdConsistencyManager : function() {
        var me = this;
        return new Sch.data.util.IdConsistencyManager({
            eventStore      : me,
            resourceStore   : me.getResourceStore(),
            assignmentStore : me.getAssignmentStore()
        });
    },

    /**
     * Creates and returns model persistency manager
     *
     * @return {Sch.data.util.ModelPersistencyManager}
     * @tempalte
     * @protected
     */
    createModelPersistencyManager : function() {
        var me = this;
        return new Sch.data.util.ModelPersistencyManager({
            eventStore      : me,
            resourceStore   : me.getResourceStore(),
            assignmentStore : me.getAssignmentStore()
        });
    },

    /**
     * Gets the resource store for this store
     *
     * @return {Sch.data.ResourceStore} resourceStore
     */
    getResourceStore : function () {
        return this.resourceStore;
    },

    /**
     * Sets the resource store for this store
     *
     * @param {Sch.data.ResourceStore} resourceStore
     */
    setResourceStore : function (resourceStore) {
        var me = this,
            oldStore = me.resourceStore;

        if (me.resourceStore) {
            me.resourceStore.setEventStore(null);
            me.idConsistencyManager && me.idConsistencyManager.setResourceStore(null);
            me.modelPersistencyManager && me.modelPersistencyManager.setResourceStore(null);
        }

        me.resourceStore = resourceStore && Ext.StoreMgr.lookup(resourceStore) || null;

        if (me.resourceStore) {
            me.modelPersistencyManager && me.modelPersistencyManager.setResourceStore(me.resourceStore);
            me.idConsistencyManager && me.idConsistencyManager.setResourceStore(me.resourceStore);
            resourceStore.setEventStore(me);
        }

        if ((oldStore || resourceStore) && oldStore !== resourceStore) {
            /**
             * @event resourcestorechange
             * Fires when new resource store is set via {@link #setResourceStore} method.
             * @param {Sch.data.EventStore}         this
             * @param {Sch.data.ResourceStore|null} newResourceStore
             * @param {Sch.data.ResourceStore|null} oldResourceStore
             */
            me.fireEvent('resourcestorechange', me, resourceStore, oldStore);
        }
    },

    /**
     * Returns assignment store this event store is using by default.
     *
     * @return {Sch.data.AssignmentStore}
     */
    getAssignmentStore : function() {
        return this.assignmentStore;
    },

    /**
     * Sets assignment store instance this event store will be using by default.
     *
     * @param {Sch.data.AssignmentStore} store
     */
    setAssignmentStore : function(assignmentStore) {
        var me = this,
            oldStore = me.assignmentStore;

        if (me.assignmentStore) {
            me.assignmentStore.setEventStore(null);
            me.idConsistencyManager && me.idConsistencyManager.setAssignmentStore(null);
            me.modelPersistencyManager && me.modelPersistencyManager.setAssignmentStore(null);
        }

        me.assignmentStore = assignmentStore && Ext.StoreMgr.lookup(assignmentStore) || null;

        if (me.assignmentStore) {
            me.modelPersistencyManager && me.modelPersistencyManager.setAssignmentStore(me.assignmentStore);
            me.idConsistencyManager && me.idConsistencyManager.setAssignmentStore(me.assignmentStore);
            me.assignmentStore.setEventStore(me);
            // If assignment store's set then caching now will be done by it
            // and event store doesn't need to maintain it's own resource-to-events cache.
            Ext.destroy(me.resourceEventsCache);
        }
        else {
            // If assignment store's reset then caching now should be done by
            // event store again.
            me.resourceEventsCache = me.createResourceEventsCache();
        }

        if ((oldStore || assignmentStore) && oldStore !== assignmentStore) {
            /**
             * @event assignmentstorechange
             * Fires when new assignment store is set via {@link #setAssignmentStore} method.
             * @param {Sch.data.EventStore}           this
             * @param {Sch.data.AssignmentStore|null} newAssignmentStore
             * @param {Sch.data.AssignmentStore|null} oldAssignmentStore
             */
            me.fireEvent('assignmentstorechange', me, assignmentStore, oldStore);
        }
    },

    /**
    * Checks if a date range is allocated or not for a given resource.
    * @param {Date} start The start date
    * @param {Date} end The end date
    * @param {Sch.model.Event} excludeEvent An event to exclude from the check (or null)
    * @param {Sch.model.Resource} resource The resource
    * @return {Boolean} True if the timespan is available for the resource
    */
    isDateRangeAvailable: function (start, end, excludeEvent, resource) {
        var DATE = Sch.util.Date,
            events = this.getEventsForResource(resource),
            available = true;

        // This can be optimized further if we use simple for() statement (will lead to -1 function call in the loop)
        Ext.each(events, function (ev) {

            available = (
                excludeEvent === ev ||
                !DATE.intersectSpans(start, end, ev.getStartDate(), ev.getEndDate())
            );

            return available; // to immediately stop looping if interval is occupied by a non excluding event
        });

        return available;
    },

    /**
    * Returns events between the supplied start and end date
    * @param {Date} start The start date
    * @param {Date} end The end date
    * @param {Boolean} allowPartial false to only include events that start and end inside of the span
    * @return {Ext.util.MixedCollection} the events
    */
    getEventsInTimeSpan: function (start, end, allowPartial) {
        var coll = new Ext.util.MixedCollection(); // TODO: do we real need the mixed collection here?
        var events = [];

        if (allowPartial !== false) {
            var DATE = Sch.util.Date;

            this.forEachScheduledEvent(function (event, eventStart, eventEnd) {
                if (DATE.intersectSpans(eventStart, eventEnd, start, end)) {
                    events.push(event);
                }
            });
        } else {
            this.forEachScheduledEvent(function (event, eventStart, eventEnd) {
                if (eventStart - start >= 0 && end - eventEnd >= 0) {
                    events.push(event);
                }
            });
        }

        coll.addAll(events);

        return coll;
    },

    /**
     * Calls the supplied iterator function once for every scheduled event, providing these arguments
     *      - event : the event record
     *      - startDate : the event start date
     *      - endDate : the event end date
     *
     * Returning false cancels the iteration.
     *
     * @param {Function} fn iterator function
     * @param {Object} scope scope for the function
     */
    forEachScheduledEvent : function (fn, scope) {

        this.each(function (event) {
            var eventStart = event.getStartDate(),
                eventEnd = event.getEndDate();

            if (eventStart && eventEnd) {
                return fn.call(scope || this, event, eventStart, eventEnd);
            }
        }, this);
    },

    /**
     * Returns an object defining the earliest start date and the latest end date of all the events in the store.
     *
     * @return {Object} An object with 'start' and 'end' Date properties (or null values if data is missing).
     */
    getTotalTimeSpan : function() {
        var earliest = new Date(9999,0,1),
            latest = new Date(0),
            D = Sch.util.Date;

        this.each(function(r) {
            if (r.getStartDate()) {
                earliest = D.min(r.getStartDate(), earliest);
            }
            if (r.getEndDate()) {
                latest = D.max(r.getEndDate(), latest);
            }
        });

        // TODO: this will fail in programs designed to work with events in the past (after Jan 1, 1970)
        earliest = earliest < new Date(9999,0,1) ? earliest : null;
        latest = latest > new Date(0) ? latest : null;

        // keep last calculated value to be able to track total timespan changes
        this.lastTotalTimeSpan = {
            start : earliest || null,
            end   : latest || earliest || null
        };

        return this.lastTotalTimeSpan;
    },

    /**
     * Filters the events associated with a resource, based on the function provided. An array will be returned for those
     * events where the passed function returns true.
     * @private {Sch.model.Resource} resource
     * @param {Sch.model.Resource} resource
     * @param {Function} fn The function
     * @param {Object} [scope] The 'this object' for the function
     * @return {Sch.model.Event[]} the events in the time span
     */
    filterEventsForResource : function (resource, fn, scope) {
        // `getEvents` method of the resource will use either `indexByResource` or perform a full scan of the event store
        var events = resource.getEvents(this);

        return Ext.Array.filter(events, fn, scope || this);
    },

    // This method provides a way for the store to append a new record, and the consuming class has to implement it
    // since Store and TreeStore don't share the add API.
    append : function(record) {
        throw 'Must be implemented by consuming class';
    },

    // {{{ Entire data model management methods

    /**
     * Returns all resources assigned to an event.
     *
     * @param {Sch.model.Event/Mixed} event
     * @return {Sch.model.Resource[]}
     */
    getResourcesForEvent : function(event) {
        var me = this,
            assignmentStore = me.getAssignmentStore(),
            resourceStore   = me.getResourceStore(),
            result;

        if (assignmentStore) {
            result = assignmentStore.getResourcesForEvent(event);
        }
        else if (resourceStore) {
            event   = event instanceof Sch.model.Event && event || me.getModelById(event);
            result = event && resourceStore.getModelById(event.getResourceId());
            result = result && [result] || [];
        }
        else {
            result = [];
        }

        return result;
    },

    /**
     * Returns all events assigned to a resource
     *
     * @param {Sch.model.Resource/Mixed} resource
     * @return {Sch.model.Event[]}
     */
    getEventsForResource : function(resource) {
        var me = this,
            assignmentStore = me.getAssignmentStore(),
            resourceStore,
            result;

        if (assignmentStore) {
            result = assignmentStore.getEventsForResource(resource);
        }
        // Resource->Events cache is not always accessable, a subclass might override createResourceEventsCache() method
        // returning null
        else if (me.resourceEventsCache) {
            result = me.resourceEventsCache.get(resource);
        }
        else {
            result = [];
        }

        return result;
    },

    /**
     * Returns all assignments for a given event.
     *
     * @param {Sch.model.Event/Mixed} event
     * @return {Sch.model.Assignment[]}
     */
    getAssignmentsForEvent : function(event) {
        var me = this,
            assignmentStore = me.getAssignmentStore();

        return assignmentStore && assignmentStore.getAssignmentsForEvent(event) || [];
    },

    /**
     * Returns all assignments for a given resource.
     *
     * @param {Sch.model.Resource/Mixed} resource
     * @return {Sch.model.Assignment[]}
     */
    getAssignmentsForResource : function(resource) {
        var me = this,
            assignmentStore = me.getAssignmentStore();

        return assignmentStore && assignmentStore.getAssignmentsForResource(resource) || [];
    },

    /**
     * Creates and adds assignment record for a given event and a resource.
     *
     * @param {Sch.model.Event/Mixed} event
     * @param {Sch.model.Resource/Mixed/Sch.model.Resource[]/Mixed[]} resource The resource(s) to assign to the event
     */
    assignEventToResource : function(event, resource) {
        var me = this,
            assignmentStore = me.getAssignmentStore();

        if (assignmentStore) {
            assignmentStore.assignEventToResource(event, resource);
        }
        else {
            event = event instanceof Sch.model.Event && event || me.getModelById(event);
            resource = resource instanceof Sch.model.Resource ? resource.getId() : resource; // resource id might be 0 thus we use ? operator
            event && event.setResourceId(resource); // This will update resource events cache via 'update' event.
        }
    },

    /**
     * Removes assignment record for a given event and a resource.
     *
     * @param {Sch.model.Event/Mixed} event
     * @param {Sch.model.Resource/Mixed} resource
     */
    unassignEventFromResource : function(event, resource) {
        var me = this,
            assignmentStore = me.getAssignmentStore();

        if (assignmentStore) {
            assignmentStore.unassignEventFromResource(event, resource);
        }
        else  {
            event    = event instanceof Sch.model.Event && event || me.getModelById(event);
            resource = resource instanceof Sch.model.Resource ? resource.getId() : resource; // resource id might be 0 thus we use ? operator
            if (event && event.getResourceId() == resource) {
                event.setResourceId(null); // This will update resource events cache via 'update' event
            }
        }
    },

    /**
     * Reassigns an event from an old resource to a new resource
     *
     * @param {Sch.model.Event/Mixed}    event    An event to reassign
     * @param {Sch.model.Resource/Mixed} resource A resource to unassign from
     * @parma {Sch.model.Resource/Mixed} resource A resource to assign to
     */
    reassignEventFromResourceToResource : function(event, oldResource, newResource) {
        var me = this,
            assignmentStore = me.getAssignmentStore();

        if (assignmentStore) {
            assignmentStore.unassignEventFromResource(event, oldResource);
            assignmentStore.assignEventToResource(event, newResource);
        }
        else {
            event = event instanceof Sch.model.Event && event || me.getModelById(event);
            oldResource = oldResource instanceof Sch.model.Resource ? oldResource.getId() : oldResource; // resource id might be 0 thus we use ? operator
            newResource = newResource instanceof Sch.model.Resource ? newResource.getId() : newResource; // resource id might be 0 thus we use ? operator
            if (event.getResourceId() == oldResource) {
                event.setResourceId(newResource);
            }
        }
    },

    /**
     * Checks whether an event is assigned to a resource.
     *
     * @param {Sch.model.Event/Mixed} event
     * @param {Sch.model.Resouce/Mixed} resource
     * @param {Function} [fn] Function which will resieve assignment record if one present
     * @return {Boolean}
     */
    isEventAssignedToResource : function(event, resource) {
        var me = this,
            assignmentStore = me.getAssignmentStore(),
            result;

        if (assignmentStore) {
            result = assignmentStore.isEventAssignedToResource(event, resource);
        }
        else {
            event    = event    instanceof Sch.model.Event && event || me.getModelById(event);
            resource = resource instanceof Sch.model.Resource ? resource.getId() : resource; // resource id might be 0 thus we use ? operator
            result = event && (event.getResourceId() == resource) || false;
        }

        return result;
    },

    /**
     * Removes all assignments for given event
     *
     * @param {Sch.model.Event/Mixed} event
     */
    removeAssignmentsForEvent : function(event) {
        var me = this,
            assignmentStore = me.getAssignmentStore();

        if (assignmentStore) {
            assignmentStore.removeAssignmentsForEvent(event);
        }
        else {
            event = event instanceof Sch.model.Event && event || me.getModelById(event);
            event && event.setResourceId(null); // This will update resource events cache via 'update' event
        }
    },

    /**
     * Removes all assignments for given resource
     *
     * @param {Sch.model.Resource/Mixed} resource
     */
    removeAssignmentsForResource : function(resource) {
        var me = this,
            assignmentStore = me.getAssignmentStore(),
            resourceStore   = me.getResourceStore();

        if (assignmentStore) {
            assignmentStore.removeAssignmentsForResource(resource);
        }
        else if (resourceStore) {
            resource = resource instanceof Sch.model.Resource && resource || resourceStore.getModelById(resource);
            resource && Ext.Array.forEach(me.resourceEventsCache.get(resource), function(event) {
                event.setResourceId(null); // This will update resource events cache via 'update' event
            });
        }
        else {
            resource = resource instanceof Sch.model.Resource ? resource.getId() : resource; // resource id might be 0 thus we use ? operator
            Ext.Array.forEach(me.getRange(), function(event) {
                event.getResourceId() == resource && event.setResourceId(null); // This will update resource events cache via 'update' event
            });
        }
    },

    /**
     * Checks if given event record is persistable.
     * In case assignment store is used to assign events to resources and vise versa event is considered to be always
     * persistable. Otherwise backward compatible logic is used, i.e. event is considered to be persistable when
     * resources it's assigned to are not phantom.
     *
     * @param {Sch.model.Range} event
     * @return {Boolean}
     */
    isEventPersistable : function(event) {
        var me = this,
            assignmentStore = me.getAssignmentStore(),
            resources, i, len,
            result = true;

        if (!assignmentStore) {
            resources = event.getResources();
            for (i = 0, len = resources.length; result && i < len; ++i) {
                result = resources[i].phantom !== true;
            }
        }

        return result;
    }
});

/**
 * @class Sch.data.mixin.ResourceStore
 * This is a mixin for the ResourceStore functionality. It is consumed by the {@link Sch.data.ResourceStore} class ("usual" store) and {@link Sch.data.ResourceTreeStore} - tree store.
 *
 */
if (!Ext.ClassManager.get("Sch.data.mixin.ResourceStore")) Ext.define("Sch.data.mixin.ResourceStore", {

    eventStore : null,

    /**
     * Returns the associated event store instance.
     *
     * @return {Gnt.data.EventStore}
     */
    getEventStore: function() {
        return this.eventStore;
    },

    /**
     * Sets the associated event store instance.
     *
     * @param {Sch.data.EventStore} eventStore
     */
    setEventStore: function(eventStore) {
        var me = this,
            oldStore;

        if (me.eventStore !== eventStore) {
            oldStore      = me.eventStore;
            me.eventStore = eventStore && Ext.StoreMgr.lookup(eventStore) || null;
            /**
             * @event eventstorechange
             * Fires when new event store is set via {@link #setEventStore} method.
             * @param {Sch.data.ResourceStore}   this
             * @param {Sch.data.EventStore|null} newEventStore
             * @param {Sch.data.EventStore|null} oldEventStore
             */
            me.fireEvent('eventstorechange', me, eventStore, oldStore);
        }
    }
});

/**
@class Sch.data.EventStore
@extends Ext.data.Store
@mixins Sch.data.mixin.EventStore

This is a class holding all the {@link Sch.model.Event events} to be rendered into a {@link Sch.SchedulerPanel scheduler panel}.

*/
if (!Ext.ClassManager.get("Sch.data.EventStore")) Ext.define("Sch.data.EventStore", {
    extend      : 'Ext.data.Store',
    alias       : 'store.eventstore',

    mixins      : [
        'Sch.data.mixin.UniversalModelGetter',
        'Sch.data.mixin.CacheHintHelper',
        'Sch.data.mixin.EventStore'
    ],

    storeId     : 'events',
    model       : 'Sch.model.Event',
    config      : { model : 'Sch.model.Event' },
    proxy       : 'memory',

    constructor : function(config) {
        var me = this;

        me.callParent([config]);

        me.resourceStore   && me.setResourceStore(me.resourceStore);
        me.assignmentStore && me.setAssignmentStore(me.assignmentStore);

        if (me.getModel() !== Sch.model.Event && !(me.getModel().prototype instanceof Sch.model.Event)) {
            throw 'The model for the EventStore must subclass Sch.model.Event';
        }
    },

    /**
     * Appends a new record to the store
     * @param {Sch.model.Event} record The record to append to the store
     */
    append : function(record) {
        this.add(record);
    }
});

/**
@class Sch.data.ResourceStore
@extends Ext.data.Store
@mixin Sch.data.mixin.ResourceStore

This is a class holding the collection the {@link Sch.model.Resource resources} to be rendered into a {@link Sch.panel.SchedulerGrid scheduler panel}.
It is a subclass of {@link Ext.data.Store} - a store with linear data presentation.

*/
if (!Ext.ClassManager.get("Sch.data.ResourceStore")) Ext.define("Sch.data.ResourceStore", {
    extend      : 'Ext.data.Store',
    model       : 'Sch.model.Resource',
    config      : { model : 'Sch.model.Resource' },
    alias       : 'store.resourcestore',

    requires    : [
        'Sch.patches.OperationDestroy'
    ],

    mixins      : [
        'Sch.data.mixin.UniversalModelGetter',
        'Sch.data.mixin.CacheHintHelper',
        'Sch.data.mixin.ResourceStore'
    ],

    storeId     : 'resources',
    proxy       : 'memory',

    constructor : function() {
        this.callParent(arguments);

        if (this.getModel() !== Sch.model.Resource && !(this.getModel().prototype instanceof Sch.model.Resource)) {
            throw 'The model for the ResourceStore must subclass Sch.model.Resource';
        }
    }
});

Ext.define('Kanban.locale.Ko', {
    extend      : 'Sch.locale.Locale',

    singleton : true,

    constructor : function (config) {

        Ext.apply(this , {
            l10n        : {
                'Kanban.menu.TaskMenuItems' : {
                    copy    : '복사',
                    remove  : '삭제',
                    edit    : '수정',
                    states  : '이동',
                    users   : '배차'
                }
            },

            NotStarted : '대기',
            InProgress : '진행중',
            Test       : '검사',
            Done       : '완료'
        });

        this.callParent(arguments);
    }
});

/**

 @class Kanban.model.Resource
 @extends Sch.model.Resource

 A data model class describing a resource in your Kanban board that can be assigned to any {@link Kanban.model.Task}.
 */
Ext.define('Kanban.model.Resource', {
    extend : 'Sch.model.Resource',

    customizableFields : [
        { name : 'ImageUrl' }
    ],

    /**
     * @cfg {String} imageUrlField The name of the field that defines the user image url. Defaults to "ImageUrl".
     */
    imageUrlField  : 'ImageUrl'
});
/**

@class Kanban.model.Task
@extends Sch.model.Event

A data model class describing a task in your Kanban board. You can assign it to a resource using the {@link #assign} method or by
setting the 'ResourceId' property directly in the data (using {@link #setResourceId} or {@link setResource}).

You can of course also subclass this class like you would with any other Ext JS class and add your own custom fields.

    Ext.define('MyTask', {
        extend : 'Kanban.model.Task',

        fields : [
            { name : 'NbrComments', type : 'int' },
            { name : 'Attachments', type : 'int' }
        ],

        // Define the states your tasks can be in
        states            : [
            'NotStarted',
            'InProgress',
            'Test',
            'Acceptance',
            'Done'
        ],

        // Here you can control which state transitions are allowed
        isValidTransition : function (state) {
            return true;
        }
    })

*/
Ext.define('Kanban.model.Task', {
    extend      : 'Sch.model.Event',

    resourceStore   : null,

    /**
     * @cfg {String[]} states The names of the possible states that a task can be in. Default states are ["NotStarted", "InProgress", "Test", "Done"].
     */
    states      : [
        'NotStarted',
        'InProgress',
        'Test',
        'Done'
    ],

    customizableFields      : [
        { name : 'State', defaultValue : 'NotStarted' },

        // Used to keep the order of the tasks
        { name : 'Position', type : 'int' },
        { name : 'CreatedDate', type : 'date' },
        { name : 'ImageUrl' }
    ],

    constructor : function() {
        this.callParent(arguments);

        if (this.phantom && !this.getCreatedDate()) {
            this.setCreatedDate(new Date());
        }
    },

    /**
     * @cfg {String} stateField The name of the field that defines the task state. Defaults to "State".
     */
    stateField  : 'State',

    /**
     * @cfg {String} imageUrlField The name of the field that defines the task image url. Defaults to "ImageUrl".
     */
    imageUrlField  : 'ImageUrl',

    /**
     * @cfg {String} createdDateField The name of the field that defines the task state. Defaults to "CreatedDate".
     */
    createdDateField  : 'CreatedDate',

    /**
     * @cfg {String} positionField The name of the field that defines the task order. Defaults to "Position".
     */
    positionField  : 'Position',

    /**
     * @method getResource
     *
     * Returns the resource that is assigned to this task.
     * @return {Kanban.model.Resource} The resource
     */

    /**
     * @method setResource
     *
     * Assigns a new resource to this task.
     * @param {Kanban.model.Resource} resource The resource
     */

    /**
     * @method getPosition
     *
     * Returns the position of this task within it's current {@link Kanban.view.TaskView view}.
     * @return {Number} The position
     */

    /**
     * @method setPosition
     *
     * Sets the position of this task within it's current {@link Kanban.view.TaskView view}.
     * @param {Number} The position
     */

    /**
     * @method setResource
     *
     * Sets the new position of this task within it's current {@link Kanban.view.TaskView view}.
     * @param {Number} The new position
     */

    /**
     * @method getState
     *
     * Returns the state identifier of this task
     * @return {String} The state
     */

    /**
     * @method setState
     *
     * Sets the state identifier of this task
     * @param {String} The state
     */

    /**
     * @method getCreatedDate
     *
     * Returns the created date for this task
     * @return {Date} The created date
     */

    /**
     * @method setCreatedDate
     *
     * Sets the created date for this task
     * @param {Date} The created date
     */

    /**
     * @method getImageUrl
     *
     * Returns the image URL for this task
     * @return {String} The created date
     */

    /**
     * @method setImageUrl
     *
     * Sets the image URL for this task
     * @param {String} The created date
     */

    /**
     * Returns the associated user store of this task.
     *
     * @return {Kanban.data.ResourceStore} The user store
     */
    getResourceStore : function() {
        if (!this.resourceStore) {
            Ext.Array.each(this.joined, function(store) {
                if (store.resourceStore) {
                    this.resourceStore = store.resourceStore;

                    return false;
                }
            }, this);
        }

        return this.resourceStore;
    },

    /**
     * @method isValidTransition
     *
     * Override this method to define which states are valid based on the current task state. If you want to allow all,
     * simply create a method which always returns true.
     *
     * @param {String} toState The new state of this task
     * @return {Boolean} true if valid
     */
    isValidTransition : function (toState) {

        switch (this.getState()) {
            case "NotStarted":
                return toState == "InProgress";
            case "InProgress":
                return toState != "Done";
            case "Test":
                return toState != "NotStarted";
            case "Done":
                return toState == "Test" || toState == "InProgress";

            default:
                return true;
        }
    }
});
Ext.define('Kanban.data.mixin.StoreView', {

    state               : null,
    masterStore         : null,

    bindToStore : function (store) {

        var listeners = {
            add     : this.onMasterAdd,
            clear   : this.onMasterClear,
            remove  : this.onMasterRemove,
            update  : this.onMasterUpdate,
            refresh : this.onMasterDataChanged,
            scope   : this
        };

        if (this.masterStore) {
            this.masterStore.un(listeners);
        }

        this.masterStore = store;

        if (store) {
            store.on(listeners);

            this.copyStoreContent();
        }
    },

    onMasterAdd : function (store, records) {

        for (var i = 0; i < records.length; i++) {
            if (records[i].getState() === this.state) {
                this.add(records[i]);
            }
        }
    },

    onMasterClear : function () {
        this.removeAll();
    },

    onMasterUpdate : function (store, record, operation, modifiedFieldNames) {
        if (modifiedFieldNames && Ext.Array.indexOf(modifiedFieldNames, store.model.prototype.stateField) >= 0) {
            // Insert into the new store
            if (this.state === record.getState()) {
                this.add(record);
            }

            // Remove from old state store
            if (this.state === record.previous[record.stateField]) {
                this.remove(record);
            }
        }
    },

    onMasterRemove : function (store, records) {
        Ext.Array.each(records, function (rec) {
            if (rec.getState() === this.state) {
                this.remove(rec);
            }
        }, this);
    },

    onMasterDataChanged : function (store) {
        this.copyStoreContent();
    },

    copyStoreContent : function () {
        var state = this.state;
        var data  = [];

        this.masterStore.each(function (rec) {
            if (rec.getState() === state) data[data.length] = rec;
        });

        this.suspendEvents();

        this.sort(this.masterStore.getSorters().items);
        // We don't want this to persist
        this.sorters.removeAll();

        this.resumeEvents();

        // Sorting will happen here anyway
        this.loadData(data);
    }
});

// Private class
Ext.define('Kanban.data.ViewStore', {
    extend            : 'Ext.data.Store',
    mixins            : [
        'Kanban.data.mixin.StoreView'
    ],

    proxy             : 'memory',
    masterStore       : null,
    state             : null,

    constructor : function (config) {

        Ext.apply(this, config);

        if (this.state === null || this.state === undefined) {
            throw 'Must supply state';
        }

        if (this.masterStore) {
            var master = this.masterStore = Ext.StoreMgr.lookup(this.masterStore);
            var sorters = master.sorters;

            this.model = master.model;
        } else {
            throw 'Must supply a master store';
        }

        this.callParent(arguments);

        if (this.masterStore) {
            this.bindToStore(this.masterStore);
        }
    },

    getResourceStore : function() {
        return this.masterStore.getResourceStore();
    }
});

/**

@class Kanban.data.ResourceStore
@extends Sch.data.ResourceStore

A data store class containing {@link Kanban.model.Resource user records}. Sample usage below:

    var resourceStore = new Kanban.data.ResourceStore({
        sorters : 'Name',

        data    : [
            { Id : 1, Name : 'Dave' }
        ]
    });


You can of course also subclass this class like you would with any other Ext JS class and provide your own custom behavior.
*/
Ext.define('Kanban.data.ResourceStore', {
    extend  : 'Sch.data.ResourceStore',
    model   : 'Kanban.model.Resource',
    sorters : 'Name',
    proxy   : undefined,

    alias   : 'store.kanban_resourcestore'
});

/**

@class Kanban.data.TaskStore
@extends Sch.data.EventStore

A data store class containing {@link Kanban.model.Task task records}. Sample usage below:

    var taskStore = new Kanban.data.TaskStore({
        sorters : 'Name',
        data    : [
            { Id : 1, Name : 'Dig hole', State : 'NotStarted'}
        ]
    });


You can of course also subclass this class like you would with any other Ext JS class and provide your own custom behavior.
*/
Ext.define('Kanban.data.TaskStore', {
    extend           : 'Sch.data.EventStore',
    model            : 'Kanban.model.Task',
    proxy            : undefined,
    alias            : 'store.kanban_taskstore',

    resourceStore    : null,

    setResourceStore : function (store) {
        this.resourceStore = Ext.data.StoreManager.lookup(store);
    },

    getResourceStore : function () {
        return this.resourceStore;
    },

    constructor : function(){

        this.callParent(arguments);

        var model = this.getModel();

        this.setSorters([{
            property    : model.prototype.positionField,
            direction   : 'ASC'
        }, {
            property    : model.prototype.nameField,
            direction   : 'ASC'
        }]);
    }
});

Ext.define('Kanban.dd.DragZone', {
    extend : 'Ext.dd.DragZone',

    mixins : {
        observable : 'Ext.util.Observable'
    },

    requires : [

        // a missing require of Ext.dd.DragDrop:
        // http://www.sencha.com/forum/showthread.php?276603-4.2.1-Ext.dd.DragDrop-missing-Ext.util.Point-in-dependency-quot-requires-quot
        'Ext.util.Point'
    ],

    panel                : null,
    repairHighlight      : false,
    repairHighlightColor : 'transparent',
    containerScroll      : false,

    // @OVERRIDE
    autoOffset           : function (x, y) {
        this.setDelta(this.dragData.offsets[0], this.dragData.offsets[1]);
    },

    setVisibilityForSourceEvents : function (show) {
        Ext.each(this.dragData.taskEls, function (el) {
            el[ show ? 'removeCls' : 'addCls' ]('sch-hidden');
        });
    },

    constructor : function (config) {
        // Drag drop won't work in IE8 if running in an iframe
        // https://www.assembla.com/spaces/bryntum/tickets/712#/activity/ticket:
        if (Ext.isIE8m && window.top !== window) {
            Ext.dd.DragDropManager.notifyOccluded = true;
        }
        
        this.mixins.observable.constructor.call(this, config);

        this.callParent(arguments);

        this.proxy.el.child('.x-dd-drag-ghost').removeCls('x-dd-drag-ghost');

        this.proxy.addCls('sch-task-dd');
    },

    getPlaceholderElements : function (sourceEl, dragData) {
        var taskEls = dragData.taskEls;
        var copy;
        var offsetX = dragData.offsets[ 0 ];
        var offsetY = dragData.offsets[ 1 ];
        var sourceHeight = sourceEl.getHeight();

        var ctEl = Ext.core.DomHelper.createDom({
            tag : 'div',
            cls : 'sch-dd-wrap-holder'
        });

        Ext.Array.each(taskEls, function (el, i) {
            copy = el.dom.cloneNode(true);
            copy.innerHTML = '';

            copy.id = Ext.id();
            copy.boundView = el.dom.boundView;

            var fly = Ext.fly(copy);
            fly.removeCls('sch-task-selected');
            fly.addCls('sch-task-placeholder');

            ctEl.appendChild(copy);

            // Adjust each element offset to the source event element
            Ext.fly(copy).setStyle({
                width  : el.getWidth() + 'px',
                height : el.getHeight() + 'px'
            });
        });
        return ctEl;
    },

    getDragData : function (e) {
        var panel = this.panel,
            t = e.getTarget(panel.taskSelector);

        if (!t || panel.isReadOnly()) return;

        var task = panel.resolveRecordByNode(t);

        if (!task || task.isDraggable() === false || this.fireEvent('beforetaskdrag', this, task, e) === false) {
            return null;
        }

        var xy = e.getXY(),
            taskEl = Ext.get(t),
            taskXY = taskEl.getXY(),
            offsets = [ xy[0] - taskXY[0], xy[1] - taskXY[1] ],
            view = Ext.getCmp(taskEl.up('.sch-taskview').id),
            eventRegion = taskEl.getRegion();

        if (!view.isSelected(t) && !e.ctrlKey) {
            // Fire this so the task board can clear the selection models of other views if needed
            this.fireEvent('taskdragstarting', this, task, e);
        }

        // relatedRecords now hold all dragging tasks
        var relatedRecords = this.getDraggingRecords(task),
            taskEls = [];
            
        // Collect additional elements to drag
        Ext.Array.forEach(relatedRecords, function (r) {
            var el = panel.getElementForTask(r);

            if (el) taskEls.push(el);
        });


        var dragData = {
            view        : view,
            sourceZoomLevel : view.up('panel').zoomLevel,
            offsets     : offsets,
            repairXY    : [e.getX() - offsets[0], e.getY() - offsets[1]],
            taskEls     : taskEls,
            bodyScroll  : Ext.getBody().getScroll(),
            taskRecords : relatedRecords
        };
        
        // index of current task in view store
        var store = view.getStore();
        var dropBeforeTask = store.getAt(store.indexOf(task) + 1);
        
        if (dropBeforeTask) {
            dragData.dropOptions = {
                task    : dropBeforeTask,
                type    : 'before'
            };
        }

        dragData.ddel = this.getDragElement(taskEl, dragData);
        dragData.placeholder = this.getPlaceholderElements(taskEl, dragData);

        // To keep the look and size of the elements in the drag proxy
        this.proxy.el.set({
            size : this.panel.getZoomLevel()
        });

        return dragData;
    },

    onStartDrag : function (x, y) {
        var dd = this.dragData;
        
        // insert placeholder immediately
        Ext.fly(dd.placeholder).insertBefore(dd.taskEls[0]);
        
        Ext.Array.forEach(dd.taskEls, function (taskEl) {
            // we have to set this value because by default it will make component invisible,
            // but other components will not take it's place
            taskEl.addCls('sch-hidden');
        });

        this.fireEvent('taskdragstart', this, dd.taskRecords);
    },

    getDraggingRecords  : function (sourceEventRecord) {
        // we want to sort records by their position in view
        // in order to forbid selection order to affect position  
        var records = this.getRelatedRecords(sourceEventRecord);
        
        // we can select few records from one column and then start drag task from another column
        // if records are from same column, then we can just sort then by position
        var store = sourceEventRecord.store;
        if (records[0] && records[0].getState() == sourceEventRecord.getState()) {
            records = Ext.Array.sort([sourceEventRecord].concat(records), this.positionSorter);
        } else {
            records = [sourceEventRecord].concat(Ext.Array.sort(records, this.positionSorter));
            
        }
        return records;        
    },

    positionSorter : function (a, b) {
        var store = a.store;

        return store.indexOf(a) > store.indexOf(b) ? 1 : -1;
    },

    /**
     * Provide your custom implementation of this to allow additional event records to be dragged together with the original one.
     * @param {Kanban.model.Event} eventRecord The eventRecord about to be dragged
     * @return {Kanban.model.Event[]} An array of event records to drag together with the original event
     */
    getRelatedRecords : function (sourceEventRecord) {

        var panel = this.panel;
        var selected = panel.getSelectedRecords();
        var result = [];
        
        Ext.each(selected, function (rec) {
            if (rec.getId() !== sourceEventRecord.getId() /* && rec.isDraggable() !== false */) {
                result.push(rec);
            }
        });

        return result;
    },

    /**
     * This function should return a DOM node representing the markup to be dragged. By default it just returns the selected element(s) that are to be dragged.
     * @param {Ext.Element} sourceEl The event element that is the source drag element
     * @param {Object} dragData The drag drop context object
     * @return {HTMLElement} The DOM node to drag
     */
    getDragElement : function (sourceEl, dragData) {
        var taskEls = dragData.taskEls;
        var copy;
        var offsetX = dragData.offsets[ 0 ];
        var offsetY = dragData.offsets[ 1 ];
        var sourceHeight = this.panel.getElementForTask(dragData.taskRecords[0]).getHeight();

        if (taskEls.length > 1) {
            var ctEl = Ext.core.DomHelper.createDom({
                tag   : 'div',
                cls   : 'sch-dd-wrap',
                style : { overflow : 'visible' }
            });

            Ext.Array.forEach(taskEls, function (el, i) {
                copy = el.dom.cloneNode(true);
                
                copy.id = '';

                copy.className += i === 0 ? ' sch-dd-source' : ' sch-dd-extra';
                
                var parent = el.up('[size]');
                var wrapper = Ext.core.DomHelper.createDom({
                    tag : 'div',
                    size    : parent.getAttribute('size')
                }).cloneNode(true); // without the extra cloneNode, IE fails (most likely due to a Sencha bug in DomHelper
                
                wrapper.appendChild(copy);
                ctEl.appendChild(wrapper);

                // Adjust each element offset to the source event element
                Ext.fly(copy).setStyle({
                    left     : (i > 0 ? 10 : 0) + 'px',
                    top      : (i === 0 ? 0 : (sourceHeight - 30 + i * 20)) + 'px',
                    width    : el.getWidth() + 'px',
                    height   : el.getHeight() + 'px',
                    position : "absolute"
                });
            });

            return ctEl;
        } else {
            copy = sourceEl.dom.cloneNode(true);

            copy.id = '';
            copy.style.width = sourceEl.getWidth() + 'px';
            copy.style.height = sourceEl.getHeight() + 'px';
            
            var parent = sourceEl.up('[size]');
            var wrapper = Ext.core.DomHelper.createDom({
                tag : 'div',
                size    : parent.getAttribute('size')
            }).cloneNode(true); // without the extra cloneNode, IE fails (most likely due to a Sencha bug in DomHelper


            wrapper.appendChild(copy);
            
            return wrapper;

        }
    },

    getRepairXY : function (e, data) {
        return data.repairXY;
    },

    afterRepair   : function () {
        this.dragging = false;
    },

    // HACK: Override for IE, if you drag the task bar outside the window or iframe it crashes (missing e.target)
    onInvalidDrop : function (target, e, id) {
        if (!e) {
            e      = target;
            target = e.getTarget() || document.body;
        }

        var retVal = this.callParent([ target, e, id ]);

        this.fireEvent('aftertaskdrop', this, this.dragData.taskRecords);

        if (this.dragData.placeholder) {
            Ext.fly(this.dragData.placeholder).remove();
        }

        this.setVisibilityForSourceEvents(true);

        return retVal;
    }
});
Ext.define('Kanban.dd.DropZone', {
    extend : 'Ext.dd.DropZone',

    mixins : {
        observable : 'Ext.util.Observable'
    },

    constructor : function (config) {
        this.callParent(arguments);

        this.mixins.observable.constructor.call(this, config);
    },

    panel    : null,
    dragData : null,

    getTargetFromEvent : function (e) {
        return e.getTarget();
    },

    validatorFn          : Ext.emptyFn,
    validatorFnScope     : null,

    // list of available zoom levels
    zoomLevels           : ['large', 'medium', 'small', 'mini'],

    // returns true if we should insert placeholder before node
    shouldDropBeforeNode : function (xy, taskUnderCursor, dd) {
        var taskBox = Ext.fly(taskUnderCursor).getBox();
        var proxyXY = dd.proxy.getXY();
        var middle;

        if (this.dropMode == 'vertical') {
            middle = (taskBox.bottom - taskBox.top) / 2;

            if (this.direction.up) {
                return proxyXY[1] - taskBox.top < middle;
            } else {
                var taskHeight = Ext.fly(dd.dragData.placeholder.children[0]).getHeight();
                return proxyXY[1] + taskHeight - taskBox.top < middle;
            }
        } else {
            middle = (taskBox.right - taskBox.left) / 2;

            // in case we drag task over column with smaller tasks
            // we cannot rely on drag proxy size and should use cursor coordinates

            // more robust check, taking only zoom level into attention
            if (Ext.Array.indexOf(this.zoomLevels, dd.dragData.currentZoomLevel) > Ext.Array.indexOf(this.zoomLevels, dd.dragData.sourceZoomLevel)) {
                if (xy[1] < taskBox.top) {
                    return true;
                } else if (xy[1] > taskBox.bottom) {
                    return false;
                }

                return xy[0] - taskBox.left < (taskBox.right - taskBox.left) / 2;
            } else {
                // if we moved mouse out of the row limited by taskbox.top and taskbox.bottom
                // it's enough to look at vertical position to find out drop position
                if (xy[1] < taskBox.top) {
                    return true;
                } else if (xy[1] > taskBox.bottom) {
                    return false;
                }

                if (this.direction.left) {
                    return (proxyXY[0] - taskBox.left < middle);
                } else {
                    var taskWidth = Ext.fly(dd.dragData.placeholder.children[0]).getWidth();
                    return (proxyXY[0] + taskWidth - taskBox.left < middle);
                }
            }
        }
    },

    getDropMode : function (view) {
        // we need to define drop behaviour (where placeholder should appear)
        var tempNode = Ext.DomQuery.select(view.getItemSelector() + ':not(.sch-hidden)', view.el.dom)[0];

        // if panel doesn't have any elements rendered mode doesn't matter
        if (!tempNode) return 'vertical';

        // if rendered node takes less than half available width we can assume they form rows
        if (Ext.fly(tempNode).getWidth() * 2 < view.getWidth()) return 'horizontal';

        return 'vertical';
    },

    updatePlaceholderElements : function (taskEl, dragData) {
        var copy;

        // create wrap element
        var ctEl = Ext.core.DomHelper.createDom({
            tag : 'div',
            cls : 'sch-dd-wrap-holder'
        });

        // for each task record being dragged create proper placeholder
        for (var i = 0, l = dragData.taskRecords.length; i < l; i++) {
            copy = taskEl.cloneNode(true);

            copy.innerHTML = '';
            // boundView is required for some extjs stuff 4
            copy.boundView = taskEl.boundView;

            copy.id = Ext.id();

            var fly = Ext.fly(copy);
            fly.removeCls('sch-task-selected');
            fly.addCls('sch-task-placeholder');

            ctEl.appendChild(copy);

            // Adjust each element offset to the source event element
            Ext.fly(copy).setStyle({
                width  : taskEl.offsetWidth + 'px',
                height : taskEl.offsetHeight + 'px'
            });
        }

        return ctEl;
    },

    getSmallestTask : function (view) {
        var nodes = Ext.DomQuery.select(view.getItemSelector() + ':not(.sch-hidden)', view.el.dom);
        var smallestTask = nodes[0];

        for (var i = 0; i < nodes.length; i++) {
            smallestTask = smallestTask.offsetHeight > nodes[i].offsetHeight ? nodes[i] : smallestTask;
        }

        return smallestTask;
    },


    getNodeByCoordinate : function (xy, bodyScroll) {
        return document.elementFromPoint(xy[0] - bodyScroll.left, xy[1] - bodyScroll.top);
    },


    getTargetView : function (xy, e, data) {
        var node = this.getNodeByCoordinate(xy, data.bodyScroll);

        // IE8 likes it twice, for simulated events..
        // last condition commented to apply fix also in regular mode (no iframe)
        if (Ext.isIE8 && e) {
            // if we are using IE8, we need to call this code twice
            node = this.getNodeByCoordinate(xy, data.bodyScroll);
        }

        if (node) {
            if (!node.className.match('sch-taskview')) {
                var parent = Ext.fly(node).up('.sch-taskview');

                if (parent) {
                    node = parent.dom;
                } else {
                    node = null;
                }
            }

            if (node) {
                return Ext.getCmp(node.id);
            }
        }

        return null;
    },


    // While over a target node, return the default drop allowed class which
    // places a "tick" icon into the drag proxy.
    onNodeOver : function (target, dd, e, data) {
        var xy = e.getXY();

        this.direction = {
            left : false,
            up   : false
        };

        var prevXY = this.prevXY;

        if (prevXY) {
            if (prevXY[0] > xy[0]) {
                this.direction.left = true;
            } else {

            }
            if (prevXY[1] > xy[1]) {
                this.direction.up = true;
            }
        }

        this.prevXY = xy;

        var proxyDom = dd.proxy.el.dom;
        var allowed  = false;

        proxyDom.style.display = 'none';

        // resolve target view from mouse coordinate
        var view = this.getTargetView(xy, e, data);

        proxyDom.style.display = 'block';

        if (!view) {
            return this.dropNotAllowed;
        }

        if (view) {
            allowed = data.taskRecords[0].isValidTransition(view.state);

            if (allowed) {
                // update placeholder to match other tasks in view
                // Template for placeholder. If there is no visible task, then no need to update placeholder
                if (view != data.view) {
                    var tplEl = this.getSmallestTask(view);
                    if (tplEl) {
                        Ext.fly(data.placeholder).remove();
                        data.placeholder = this.updatePlaceholderElements(tplEl, data);
                    }
                }

                if (view != data.view || !this.dropMode) {
                    this.dropMode = this.getDropMode(view);
                    data.currentZoomLevel = view.up('panel').zoomLevel;
                }

                data.view = view;

                var placeholder = Ext.get(data.placeholder);

                // http://www.sencha.com/forum/showthread.php?294565
                // return this line when bug is fixed
//                var nodes = view.getNodes(),
                var nodes = view.all.elements.slice(),
                    start = 0,
                    end   = nodes.length - 1,
                    lastNode,
                    index,
                    dropBefore;

                // if we drop into column without any tasks we should skip this mess
                if (nodes.length) {
                    // using bisection we locate 2 tasks next to each other
                    while (end - start > 1) {
                        index = Math.floor((start + end) / 2);
                        lastNode = nodes[index];
                        if (Ext.fly(lastNode).isVisible()) {
                            dropBefore = this.shouldDropBeforeNode(xy, lastNode, dd);

                            if (dropBefore) {
                                end = index;
                            } else {
                                start = index;
                            }
                        } else {
                            nodes.splice(index, 1);
                            end = end - 1;
                        }
                    }

                    // if task is going to be dropped before first node - search is done
                    var firstNode = nodes[start],
                        dropBeforeFirst = this.shouldDropBeforeNode(xy, firstNode, dd);

                    if (dropBeforeFirst) {
                        lastNode = firstNode;
                        dropBefore = true;
                    } else if (Ext.fly(nodes[end]).isVisible()) {
                        // if we should drop after first node let's check if element is visible (can be hidden)
                        // and that can lead to wierd results
                        lastNode = nodes[end];
                        dropBefore = this.shouldDropBeforeNode(xy, lastNode, dd);
                    } else {
                        // both checks failed - we should drop element between nodes
                        lastNode = firstNode;
                        dropBefore = false;
                    }
                }

                if (lastNode) {
                    if (dropBefore) {
                        placeholder.insertBefore(lastNode);
                        data.dropOptions = {
                            task : view.getRecord(lastNode),
                            type : 'before'
                        };
                    } else {
                        placeholder.insertAfter(lastNode);
                        data.dropOptions = {
                            task : view.getRecord(lastNode),
                            type : 'after'
                        };
                    }
                } else {
                    view.el.appendChild(placeholder);
                    data.dropOptions = null;
                }
            }
        }

        return allowed ? this.dropAllowed : this.dropNotAllowed;
    },

    notifyDrop : function (dd, e, dragData) {
        var xy = e.getXY();

        dd.proxy.el.dom.style.display = 'none';

        // resolve target view from mouse coordinate
        var view = this.getTargetView(xy, e, dragData);

        dd.proxy.el.dom.style.display = 'block';

        var me         = this,
            newState   = view && view.state,
            doFinalize = true,
            valid      = newState !== false && newState !== null;

        // update dragData with new state, view etc.
        dragData.newState = newState;
        dragData.view     = view;
        dragData.proxy    = dd.proxy;

        dragData.finalize = function () {
            me.finalize.apply(me, arguments);
        };

        valid = valid && me.validatorFn.call(me.validatorFnScope || this, dragData.taskRecords, newState) !== false;

        this.dragData = dragData;

        // Allow implementor to take control of the flow, by returning false from this listener,
        // to show a confirmation popup etc.
        doFinalize = me.fireEvent('beforetaskdropfinalize', me, dragData, e) !== false;

        if (doFinalize) {
            return me.finalize(valid);
        }

        return true;
    },

    finalize : function (updateRecords) {

        var dragData      = this.dragData,
            proxy         = dragData.proxy,
            recordsToMove = [];

        Ext.fly(this.getEl()).select('.sch-dd-wrap-holder').remove();

        Ext.Array.forEach(dragData.taskEls, function (taskEl) {
            taskEl.removeCls('sch-hidden');
        });

        if (updateRecords) {
            var records       = dragData.taskRecords,
                positionField = records[0].positionField,
                newState      = dragData.newState,
                opt           = dragData.dropOptions,
                targetStore   = dragData.view.getStore();

            // this will remove records from source store and append to target store
            Ext.Array.each(records, function (record) {
                if (record.isValidTransition(newState)) {
                    record.setState(newState);
                    recordsToMove.push(record);
                }
            });

            // perform this if drop is valid
            if (recordsToMove.length > 0) {
                // remove records from view store and add them again to required position
                targetStore.remove(recordsToMove);

                var dropIndex = opt ? (targetStore.indexOf(opt.task) + (opt.type == 'before' ? 0 : 1)) :
                    targetStore.getCount();

                targetStore.insert(dropIndex, recordsToMove);

                // We now set the Position field for all tasks in this store to assure order is kept intact
                // after save
                for (var j = 0; j < targetStore.getCount(); j++) {
                    targetStore.getAt(j).set(positionField, j, { silent : true });
                }

                targetStore.sort(this.masterStoreSorters);
            }

        }

        // Drag was invalid
        if (recordsToMove.length === 0) {
            proxy.el.dom.style.display = 'block';
            proxy.el.animate({
                duration      : 500,
                easing        : 'ease-out',
                to            : {
                    x : dragData.repairXY[0],
                    y : dragData.repairXY[1]
                },
                stopAnimation : true
            });
        } else {
            // Signal that the drop was (at least partially) successful
            this.fireEvent('taskdrop', this, dragData.taskRecords);
        }

        delete this.dropMode;

        this.fireEvent('aftertaskdrop', this, dragData.taskRecords);

        if (dragData.placeholder) {
            Ext.fly(dragData.placeholder).remove();
        }

        return recordsToMove.length > 0;
    }
});
/**

@class Kanban.field.AddNew
@extends Ext.form.field.Text

A basic text field that allows you to easily add new tasks by typing a name and hitting the Enter key.

Sample usage:

    var taskBoard = new Kanban.view.TaskBoard({
        resourceStore : userStore,
        taskStore     : taskStore,

        // Configure each state column individually
        columnConfigs : {
            all : {
                iconCls : 'sch-header-icon'
            },

            "NotStarted" : {
                dockedItems : {
                    xtype   : 'container',
                    dock    : 'bottom',
                    layout  : 'fit',

                    items   : {
                        xtype    : 'addnewfield',
                        store    : taskStore,

                        // Configurations applied to the newly created taska
                        defaults : {
                            State : 'NewTask'
                        }
                    }
                }
            }
        }
    });

 */
Ext.define('Kanban.field.AddNew', {
    extend            : 'Ext.form.TextField',
    alias             : 'widget.addnewfield',
    enableKeyEvents   : true,
    emptyText         : 'Add new task...',

    /**
     * @cfg {Kanban.data.TaskStore} store (required) The task store
     */
    store             : null,

    /**
     * @cfg {Object} defaults Any default properties to be applied to the newly created tasks
     */
    defaults          : null,

    initComponent : function () {
        this.on('keyup', this.onMyKeyUp, this);

        if (Ext.isString(this.store)) {
            this.store = Ext.getStore(this.store);
        }

        this.callParent(arguments);
    },

    onMyKeyUp : function(field, e) {
        if (e.getKey() === e.ENTER) {
            this.addTask();
        }
    },

    addTask : function() {
        var vals = {};

        vals[this.store.model.prototype.nameField] = this.getValue();

        this.store.add(Ext.apply(vals, this.defaults));

        this.setValue();
    }
});

/**

 @class Kanban.field.TaskFilter
 @extends Ext.form.field.Text

 A text field that allows you to filter for tasks by Name in the TaskBoard view. You can filter for another field by setting the {@link #field} config.
 */
Ext.define('Kanban.field.TaskFilter', {
    extend          : 'Ext.form.TextField',
    alias           : 'widget.filterfield',
    requires        : ['Ext.util.Filter'],
    enableKeyEvents : true,
    height          : 26,
    minLength       : 2,

    /**
     * @cfg {Kanban.data.TaskStore/String} store (required) The store containing the tasks or a store identifier (storeId) identifying a store
     */
    store           : null,

    /**
     * @cfg {String} field The {@link Kanban.model.Task} field that should be used for filtering.
     */

    /**
     * @cfg {Boolean} caseSensitive True to use case sensitive filtering
     */
    caseSensitive   : false,

    initComponent : function () {
        this.on('change', this.onMyChange, this);

        this.store = Ext.data.StoreManager.lookup(this.store);

        this.field = this.field || this.store.getModel().prototype.nameField;

        this.filter = new Ext.util.Filter({
            id            : this.getId() + '-filter',
            property      : this.field,
            value         : '',
            caseSensitive : this.caseSensitive,
            anyMatch      : true
        });

        this.callParent(arguments);
    },

    onMyChange : function () {
        var val = this.getValue();

        if (val && val.length >= this.minLength) {
            this.filter.setValue(val);
            this.store.addFilter(this.filter);
        } else {
            this.store.removeFilter(this.filter);
        }
    }
});

/**

 @class Kanban.field.TaskHighlight
 @extends Ext.form.field.Text

 A text field that allows you to highlight certain tasks in the TaskBoard view.
 */
Ext.define('Kanban.field.TaskHighlight', {
    extend            : 'Ext.form.TextField',
    alias             : 'widget.highlightfield',

    mixins          : ['Ext.AbstractPlugin'],

    enableKeyEvents   : true,
    minLength         : 2,
    preventMark       : true,
    height            : 26,

    /**
     * @cfg {Kanban.view.TaskBoard} panel (required) The kanban panel
     */
    panel             : null,

    /**
     * @cfg {String} field The {@link Kanban.model.Task} field that should be used for filtering.
     */
    field             : 'Name',

    /**
     * @cfg {Boolean} caseSensitive True to use case sensitive filtering
     */
    caseSensitive     : false,

    initComponent : function () {
        this.on('keyup', this.onMyKeyUp, this);

        this.callParent(arguments);
    },

    onMyKeyUp : function(field, e) {
        var val = this.getValue();

        if (val && val.length >= this.minLength) {
            var matches = [];
            val = this.caseSensitive ? val : val.toLowerCase();

            this.panel.highlightTasksBy(function(rec) {
                var name    = this.caseSensitive ? rec.data[this.field] : rec.data[this.field].toLowerCase();

                return name && name.indexOf(val) >= 0;
            }, this);

        } else {
            this.panel.clearHighlight();
        }
    }
});

/**

 @class Kanban.field.ColumnFilter
 @extends Ext.form.field.ComboBox

 A text field that allows you to filter out undesired columns from the TaskBoard view.
 */

Ext.define('Kanban.field.ColumnFilter', {
    extend : 'Ext.form.ComboBox',
    alias  : 'widget.columnfilter',

    requires : [
        'Ext.data.JsonStore'
    ],

    multiSelect  : true,
    valueField   : 'id',
    displayField : 'name',
    panel        : null,
    queryMode    : 'local',
    listConfig   : {
        cls : 'sch-columnfilter-list'
    },

    initComponent : function () {

        this.store = new Ext.data.JsonStore({
            proxy  : 'memory',
            fields : ['id', 'name']
        });

        this.updateListItems(true);

        this.callParent(arguments);

        this.getPicker().on({
            beforeshow      : this.onMyBeforeExpand,
            scope           : this
        });

        this.getPicker().on({
            show            : function(picker) {
                picker.on('selectionchange', this.onMySelect, this);
            },

            hide            : function(picker) {
                picker.un('selectionchange', this.onMySelect, this);
            },

            delay           : 50,  // The picker fires 'selectionchange' as it shows itself
            scope           : this
        });

    },


    updateListItems : function (initial) {
        var locale = Sch.locale.Active['Kanban.locale'] || {},
            data   = [],
            value  = [];

        Ext.each(this.panel.query("taskcolumn"), function (column) {

            data.push({
                id      : column.state,
                name    : column.origTitle || locale[column.state] || column.state
            });

            if (initial && !column.hidden) {
                value.push(column.state);
            }
        });

        // All visible selected initially
        if (initial) {
            this.value = this.value || value;
        }

        this.store.loadData(data);

        // update the value by gathering visible columns
        if (!initial) {
            this.onMyBeforeExpand();
        }
    },


    onMySelect : function (cmb, selected) {

        this.store.each(function(rec) {
            this.panel.down('[state=' + rec.get('id') + ']')[Ext.Array.indexOf(selected, rec) >= 0 ? 'show' : 'hide']();
        }, this);
    },

    onMyBeforeExpand : function () {
        var panel = this.panel;
        var me = this;
        var visible = [];

        Ext.each(panel.query('taskcolumn'), function (column) {
            if (column.isVisible()) {
                visible.push(me.store.getById(column.state));
            }
        });

        me.select(visible);
    }

});

/**
 @class Kanban.editor.Base

 Internal base API for task editors
 */
Ext.define('Kanban.editor.Base', {

    /**
     * @cfg {String} triggerEvent The event that should trigger the editing to start. Set to null to disable the editor from being activated.
     */
    triggerEvent : 'taskdblclick',

    panel    : null,
    selector : '.sch-task',

    editRecord : function (record, e) {

        if (this.panel.isReadOnly()) return;

        var el = this.panel.getElementForTask(record);

        if (el) {
            this.triggerEdit(record, e);
        }
    },

    triggerEdit : function (record, e) {
        throw 'Abstract method call';
    }, 

    init : function (panel) {
        this.panel = panel;

        if (this.triggerEvent) {
            panel.on(this.triggerEvent, function (pnl, record, node, e) {
                this.editRecord(record, e);

            }, this);

            panel.on('taskkeydown', function (taskboard, record, item, e) {
                if (e.getKey() === e.ENTER && e.getTarget().nodeName.toLowerCase() !== 'input') {
                    this.editRecord(record, e);
                }

            }, this);
        }
    }
});
/**

@class Kanban.editor.SimpleEditor
@extends Ext.Editor

A textfield editor for the TaskBoard allowing you to edit the name of a task easily. By default, it reacts to the 'taskdblclick' event but you
can configure this by using the {@link #triggerEvent} config.

Sample usage below:

    var taskBoard = new Kanban.view.TaskBoard({
        resourceStore : resourceStore,
        taskStore     : taskStore,

        editor        : new Kanban.editor.SimpleEditor({
            dataIndex       : 'Name'
        })
    });

*/
Ext.define('Kanban.editor.SimpleEditor', {
    extend : 'Ext.Editor',

    mixins : [
        'Kanban.editor.Base'
    ],

    alias     : 'widget.kanban_simpleeditor',
    alignment : 'tl',
    autoSize  : {
        width : 'boundEl' // The width will be determined by the width of the boundEl, the height from the editor (21)
    },
    listeners : {
        complete : 'onEditDone'
    },

    selector : '.sch-task-name',

    /**
     * @cfg {String} dataIndex The data field in your {@link Kanban.model.Task} that this being editor should be editing.
     */
    dataIndex    : 'Name',

    /**
     * @cfg {Object/Ext.form.Field} field The Ext JS form field (or config) to use for editing.
     */
    field : {
        xtype      : 'textfield',
        minWidth   : 100,
        allowEmpty : false
    },

    triggerEdit : function (record) {
    	//console.log('triggerEdit record', record);
        var taskEl = this.panel.getElementForTask(record);
        if (taskEl) {
            this.record = record;
            
            var d = taskEl.down(this.selector);
            //console.log('d', d);
            if(d!=null) {
                this.startEdit(d);            	
            } else {
            	try {
                	gUtil.editRackRecord(record);            		
            	} catch(e){console.log('triggerEdit e', e);}

            }

        }
    },

    onEditDone : function () {
        this.record.set(this.dataIndex, this.getValue());
    }
});
/**

@class Kanban.menu.UserMenu
@extends Ext.menu.Menu

A simple menu showing a list of users that can be assigned to a task. Intended to be used together with the TaskBoard.
Sample usage:

    var taskBoard = new Kanban.view.TaskBoard({
        resourceStore : resourceStore,
        taskStore : taskStore,

        userMenu : new Kanban.menu.UserMenu({
            resourceStore : resourceStore
        }),

        ...
    });
*/
Ext.define('Kanban.menu.UserMenu', {
    extend    : 'Ext.menu.Menu',
    alias     : 'widget.kanban_usermenu',

    cls           : 'sch-usermenu',
    plain         : true,

    /**
     * @cfg {Kanban.data.ResourceStore} store (required) The task store
     */
    resourceStore : null,

    initComponent : function () {
        var me      = this;

        Ext.apply(this, {

            renderTo : document.body,

            listeners : {
                beforeshow : function () {
                    var user = this.task.getResource();

                    if (user) {
                        this.items.each(function (item) {
                            if (user == item.user) {
                                item.addCls('sch-user-selected');
                            }
                            else {
                                item.removeCls('sch-user-selected');
                            }
                        });
                    }
                }
            }
        });

        this.resourceStore = Ext.data.StoreManager.lookup(this.resourceStore);

        this.mon(this.resourceStore, {
            load    : this.populate,
            add     : this.populate,
            remove  : this.populate,
            update  : this.populate,

            scope   : this
        });

        this.callParent(arguments);

        this.populate();
    },

    showForTask : function (task, xy) {
        this.task = task;

        this.showAt(xy);
    },

    onUserSelected : function (item) {
        this.task.assign(item.user);
    },

    populate : function () {
        var me      = this;
        var items   = [];

        this.resourceStore.each(function (user) {
            items.push({
                text    : user.getName(),
                user    : user,
                handler : me.onUserSelected,
                scope   : me
            });
        });

        this.removeAll(true);

        this.add(items);
    }
});

Ext.define('Kanban.menu.UserPicker', {
    extend          : 'Ext.view.View',

    alias           : [
        'widget.userpicker',
        'widget.kanban_userpicker'
    ],

    cls             : 'sch-userpicture-view',
    autoScroll      : true,
    showName        : true,
    padding         : '10 5 5 5',

    itemSelector    : '.sch-user',
    overItemCls     : 'sch-user-hover',
    selectedItemCls : 'sch-user-selected',

    initComponent : function () {

        var modelProt     = this.store && this.store.model && this.store.model.prototype;
        var nameField     = modelProt && modelProt.nameField || 'Name';
        var imageUrlField = modelProt && modelProt.imageUrlField || 'ImageUrl';

        Ext.apply(this, {
            itemTpl : '<tpl for=".">' +
                '<div class="sch-user">' +
                '<img src="{'+ imageUrlField +':htmlEncode}" />' +
                (this.showName ? '<span>{'+ nameField +':htmlEncode}</span>' : '') +
                '</div>' +
                '</tpl>'
        });

        this.callParent(arguments);
    }
});

/**

@class Kanban.menu.UserPictureMenu
@extends Ext.menu.Menu

A simple menu showing a picture for each user that can be assigned to a task. Intended to be used together with the TaskBoard.
Sample usage:

    var taskBoard = new Kanban.view.TaskBoard({
        resourceStore : resourceStore,
        taskStore : taskStore,

        userMenu : new Kanban.menu.UserPictureMenu({
            resourceStore : resourceStore
        }),

        ...
    });

*/
Ext.define('Kanban.menu.UserPictureMenu', {
    extend : 'Ext.menu.Menu',

    alias : [
        'widget.userpicturemenu',
        'widget.kanban_userpicturemenu'
    ],

    requires : [
        'Kanban.menu.UserPicker'
    ],

    cls    : 'sch-userpicturemenu',
    width  : 290,
    height : 200,

    resourceStore   : null,
    hideOnSelect    : true,

    initComponent : function () {
        var me = this,
            cfg = Ext.apply({}, me.initialConfig);

        delete cfg.listeners;

        Ext.apply(me, {
            plain         : true,
            showSeparator : false,
            bodyPadding   : 0,
            items         : Ext.applyIf({
                margin : 0,
                store  : this.resourceStore,
                xtype  : 'userpicker'
            }, cfg)
        });

        me.callParent(arguments);

        me.picker = me.down('userpicker');

        me.relayEvents(me.picker, ['select']);

        if (me.hideOnSelect) {
            me.on('select', me.onUserSelected, me);
        }

        this.mon(Ext.getBody(), 'click', this.onBodyClick, this);
    },

    showForTask : function (task, xy) {
        this.task = task;

        this.showAt(xy);

        var user = task.getResource();

        if (user) {
            this.picker.select(user, false, true);
        } else {
            this.picker.getSelectionModel().deselectAll();
        }
    },

    onUserSelected : function (picker, user) {
        this.hide();

        this.task.assign(user);
    },

    onBodyClick : function(e, t) {
        if (!e.within(this.el)) {
            this.hide();
        }
    }
});

/**
 @class Kanban.menu.TaskMenuItems
 @private
 
 This class is a factory of items for the Kanban.menu.TaskMenu. This class should not be used directly.
 With the  {@link Kanban.menu.TaskMenu#defaultActions} this class can be configured.
 */

Ext.define('Kanban.menu.TaskMenuItems', {

    requires : [
        'Kanban.editor.SimpleEditor',
        'Kanban.menu.UserMenu'
    ],

    mixins : [
        'Sch.mixin.Localizable'
    ],

    taskBoard      : null,
    mainMenu       : null,
    defaultActions : null,
    editorClass    : null,
    editor         : null,
    userMenuClass  : null,
    userMenu       : null,

    constructor : function (config) {

        Ext.apply(this, config);

        this.mainMenu.on('beforeshow', this.onBeforeShow, this);

        this.items = this.items || [];

        if (this.defaultActions) {
            this.initEditor();
            this.initUserMenu();
            this.initStateMenu();

            this.items = this.items.concat([
                {
                    action  : 'edit',
                    text    : this.L('edit'),
                    handler : this.onEditClick,
                    scope   : this
                },
                {
                    action : 'assign',
                    text   : this.L('users'),
                    menu   : this.userMenu
                },
                {
                    action : 'setState',
                    text   : this.L('states'),
                    menu   : this.stateMenu
                },
                {
                    action  : 'copy',
                    text    : this.L('copy'),
                    handler : this.onCopyClick,
                    scope   : this
                },
                {
                    action  : 'remove',
                    text    : this.L('remove'),
                    handler : this.onRemoveClick,
                    scope   : this
                }
            ]);
        }

        this.callParent(arguments);
    },

    
    onBeforeShow : function (menu) {
        var task = menu.getTask();

        if (this.userMenu) {
            this.userMenu.task = task;
        }

        if (this.editor) {
            this.editor.task = task;
        }
    },


    getItems : function () {
        return this.items;
    },

    initEditor : function () {
        if (!this.editor) {
            if (this.taskBoard.getTaskEditor()) {
                this.editor = this.taskBoard.getTaskEditor();
            } else {
                this.editor = Ext.create(this.editorClass, {
                    dataIndex : this.taskBoard.taskStore.model.prototype.nameField,
                    panel     : this.taskBoard
                });
            }
        }
    },

    onEditClick : function (btn, e) {
        this.editor.editRecord(this.mainMenu.getTask(), e);
    },

    initUserMenu : function () {
        if (!this.userMenu) {
            this.userMenu = Ext.create(this.userMenuClass, {
                resourceStore : this.taskBoard.resourceStore,
                onBodyClick   : Ext.emptyFn
            });
        }
    },

    initStateMenu : function () {

        var me         = this,
            model      = this.taskBoard.taskStore.model,
            stateField = model.prototype.stateField,
            states     = model.prototype.states;

        var locale = Sch.locale.Active['Kanban.locale'] || {};
        var items  = Ext.Array.map(states, function (state) {
            return {
                text    : locale[state] || state,
                state   : state,
                handler : me.onStateClick,
                scope   : me
            };
        });

        var mainMenu = me.mainMenu;

        this.stateMenu = new Ext.menu.Menu({
            items     : items,
            plain     : true,
            listeners : {
                show : function () {
                    var state = mainMenu.getTask().get(stateField);

                    this.items.each(function (item) {
                        item.setDisabled(item.state === state);
                    });
                }
            }
        });
    },

    onStateClick : function (btn) {
        this.mainMenu.task.setState(btn.state);
    },

    onCopyClick : function (btn) {
        var store   = this.taskBoard.taskStore,
            task    = this.mainMenu.getTask(),
            newTask = task.copy(null);

        newTask.setName(newTask.getName());
        store.add(newTask);
    },

    onRemoveClick : function (btn) {
        var store = this.taskBoard.taskStore,
            task  = this.mainMenu.getTask();

        store.remove(task);
    }
});
/**

 @class Kanban.menu.TaskMenu
 @extends Ext.menu.Menu

 A simple menu that can be attached to a task on the kanban board. When configured a menu-handle-icon will be rendered on the task.
 The handle template can be configured in {@link Kanban.template.Task#menuIconTpl}

 */
Ext.define('Kanban.menu.TaskMenu', {

    extend : 'Ext.menu.Menu',

    requires : [
        'Kanban.menu.TaskMenuItems'
    ],

    isTaskMenu : true,
    
    /**
     * @property alias
     */

    alias   : 'widget.kanban_taskmenu',

    cls     : 'sch-task-menu',

    handleCls : 'sch-task-menu-handle',

    /**
     * @property {Kanban.view.TaskBoard} taskBoard A reference to the Kanban taskboard.
     */

    taskBoard : null,

    /**
     * @property {Kanban.model.Task} task A reference to the current task.
     */

    config : {
        task: null
    },

    hideHandleTimer : null,

    /**
     * @cfg {Number} handleHideDelay The handle will be hidden after this number of ms, when the mouse leaves the task element.
     */

    handleHideDelay : 500,

    currentHandle : null,

    editorClass   : 'Kanban.editor.SimpleEditor',
    userMenuClass : 'Kanban.menu.UserMenu',

    /**
     * @cfg {Boolean} defaultActions Set to true to include the default toolitems (Copy, delete, edit etc).
     */
    defaultActions : true,

    /**
     * @cfg {String} itemFactoryClass A classname of the class that can generate toolitems for the menu. The factory will be used when
     * no items are set in the config.
     *
     * A factory class needs to have a public function {@link Kanban.menu.TaskMenuItems#getItems} which is called to set the items for this menu.
     */

    itemFactoryClass : 'Kanban.menu.TaskMenuItems',

    initComponent : function () {
        this.on('beforeshow', this.onBeforeShow, this);

        if (this.defaultActions) {

            this.items = Ext.create(this.itemFactoryClass, {
                editorClass    : this.editorClass,
                userMenuClass  : this.userMenuClass,
                defaultActions : this.defaultActions,
                items          : this.items || [],
                taskBoard      : this.taskBoard,
                mainMenu       : this
            }).getItems();
        }

        this.callParent(arguments);
    },

    registerListeners : function () {

        this.mon(this.taskBoard.el, {
            click    : this.onMenuHandleClick,
            delegate : '.' + this.handleCls,
            scope    : this
        });

        this.mon(this.taskBoard, {
            taskmouseenter    : this.onHandleMouseOver,
            taskmouseleave    : this.onHandleMouseLeave,
            scope         : this
        });
    },

    /**
     * Shows this menu.
     * @param task
     */
    showForTask : function (task, e, node) {
        var el = e.getTarget('.sch-task');

        this.setTask(task);
        this.show();
        this.alignTo(el, 'tl-tr?');
    },

    onMenuHandleClick : function (e, node) {
        var task = this.taskBoard.resolveRecordByNode(node);

        e.stopEvent();

        this.showForTask(task, e, node);
    },

    onHandleMouseOver : function (view, task, taskNode, event, eOpts) {
        window.clearTimeout(this.hideHandleTimer);
        this.hide();
        this.currentHandle && this.currentHandle.setVisible(false);
        this.currentHandle = Ext.select('.' + this.handleCls, false, taskNode).setVisible(true);
    },

    onHandleMouseLeave : function (view, task, taskNode, event, eOpts) {

        this.hideHandleTimer = Ext.defer(function () {
            this.currentHandle.setVisible(false);
         }, this.handleHideDelay, this);
    },

    /**
     * Called once for each menuitem before the menu is shown. Use this to hide/disable items on a per-task basis.
     *
     * @param {Ext.menu.Item} menuItem the menu item
     * @param {Kanban.model.Task} task The task
     * @returns {Boolean} false to hide the menu item
     */
    shouldShowItem : function (menuItem, task) {
        return true;
    },

    onBeforeShow : function (menu) {
        var task = this.getTask();

        this.items.each(function (menuItem) {
            menuItem.task = task;
            menuItem.setVisible(this.shouldShowItem(menuItem, task));
        }, this);
    }
});
/**

 @class Kanban.template.Task
 @extends Ext.XTemplate

 Template class used to render {@link Kanban.model.Task a task}.
 */
Ext.define('Kanban.template.Task', {
    extend         : 'Ext.XTemplate',

    model          : null, // the task model

    /**
     * @cfg {String} resourceImgTpl Resource image template.
     */

    /**
     * @cfg {String} taskBodyTpl Internal part of a task template.
     */

    /**
     * @cfg {String} taskToolTpl Extra template for optional task tools.
     */

    /**
     * @cfg {String} menuIconTpl Template for the taskmenu handler.
     */
    menuIconTpl : '<div class="sch-task-menu-handle"></div>',

    constructor : function (config) {
        var me = this;

        Ext.apply(me, config);

        var modelProt  = me.model.prototype;
        var idProperty = modelProt.idProperty;
        var nameField  = modelProt.nameField;

        if (typeof me.taskBodyTpl !== 'string') {
            me.taskBodyTpl =
                '<tpl if="' + modelProt.imageUrlField + '"><img class="sch-task-img" src="{taskImageUrl:htmlEncode}"/></tpl>' +
                '<span class="sch-task-id">{[ values.'+ idProperty +' ? "#" + values.'+ idProperty +' : "" ]}</span><span class="sch-task-name"> {'+ nameField +':htmlEncode}</span>';
        }

        if (typeof me.resourceImgTpl !== 'string') {
            me.resourceImgTpl = '<img src="{resourceImageUrl:htmlEncode}" class="sch-user-avatar {resourceImageCls:htmlEncode}" />';
        }
        
        me.callParent([
            '<tpl for=".">',
                '<div class="sch-task sch-task-state-{' + modelProt.stateField + ':htmlEncode} {' + modelProt.clsField + ':htmlEncode} {cls:htmlEncode}" style="{style}">' +
                '<div class="sch-task-inner">' +
                me.taskBodyTpl +
                me.resourceImgTpl +
                (me.taskToolTpl || '') +
                '</div>' +
                me.menuIconTpl +
                '</div>' +
                '</tpl>'
        ]);
    }
});
/**
 @class Kanban.selection.TaskModel
 @extends Ext.mixin.Observable

 A composite selection model which relays methods to the various selection models used by the internal data
 views of the task board component.
 */
Ext.define('Kanban.selection.TaskModel', {
    extend : 'Ext.mixin.Observable',

    panel     : null,
    selModels : null,

    constructor : function (config) {
        var me = this;

        Ext.apply(me, config);
        me.callParent(arguments);

        me.selModels = Ext.Array.map(me.panel.views, function (view) {
            return view.getSelectionModel();
        });

        me.forEachView(function (view) {
            me.mon(view, 'containerclick', me.onEmptyAreaClick, me);
            me.relayEvents(view, [ 'select', 'deselect' ]);
        });
    },

    /**
     * Selects one or more tasks.
     * @param {Kanban.model.Task/Kanban.model.Task[]} tasks An array of tasks
     * @param {Boolean} [keepExisting=false] True to retain existing selections
     * @param {Boolean} [suppressEvent=false] True to not fire a select event
     */
    select : function (tasks, keepExisting, suppressEvent) {
        tasks        = [].concat(tasks);
        var fired    = false;
        var listener = function () {
            fired = true;
        };

        this.forEachSelModel(function (sm) {
            var recordsInView = Ext.Array.filter(tasks, function (rec) {
                return sm.store.indexOf(rec) >= 0;
            });

            sm.on('selectionchange', listener, null, { single : true });

            if (recordsInView.length > 0) {
                sm.select(recordsInView, keepExisting, suppressEvent);
            } else {
                sm.deselectAll();
            }

            sm.un('selectionchange', listener, null, { single : true });
        });

        if (fired) {
            this.fireEvent('selectionchange', this.getSelection());
        }
    },

    /**
     * Deselects a task instance.
     * @param {Kanban.model.Task/Kanban.model.Task} tasks One or more tasks
     * @param {Boolean} [suppressEvent=false] True to not fire a deselect event
     */
    deselect : function (tasks, suppressEvent) {
        tasks = [].concat(tasks);

        this.forEachSelModel(function (sm) {
            var recordsInView = Ext.Array.filter(tasks, function (rec) {
                return sm.store.indexOf(rec) >= 0;
            });

            sm.deselect(recordsInView, suppressEvent);
        });

        this.fireEvent('selectionchange', this.getSelection());
    },

    /**
     * Selects all tasks in the view.
     * @param {Boolean} suppressEvent True to suppress any select events
     */
    selectAll : function () {
        this.relayMethod('selectAll');
    },

    /**
     * Deselects all tasks in the view.
     * @param {Boolean} [suppressEvent] True to suppress any deselect events
     */
    deselectAll : function () {
        this.relayMethod('deselectAll');
    },

    /**
     * Returns an array of the currently selected tasks.
     * @return {Ext.data.Model[]} The selected tasks
     */
    getSelection : function () {
        return this.relayMethod('getSelection');
    },

    /**
     * Returns the count of selected tasks.
     * @return {Number} The number of selected tasks
     */
    getCount : function () {
        return Ext.Array.sum(this.relayMethod('getCount'));
    },

    // BEGIN PRIVATE METHODS
    deselectAllInOtherSelectionModels : function (selModel) {
        this.forEachSelModel(function (sm) {
            sm !== selModel && sm.deselectAll();
        });
    },

    // relays results, flattens results from all calls into one array
    relayMethod : function (method, args) {
        return [].concat.apply([], Ext.Array.map(this.selModels, function (sm) {
            return sm[ method ].apply(sm, args || []);
        }));
    },

    forEachSelModel : function (fn, scope) {
        Ext.Array.each(this.selModels, fn, scope || this);
    },

    onEmptyAreaClick : function () {
        this.deselectAll();
    },

    forEachView : function (fn, scope) {
        Ext.Array.each(this.panel.views, fn, scope || this);
    },

    destroy : function () {

    }
    // EOF PRIVATE METHODS
});
/**

 @class Kanban.view.TaskView
 @extends Ext.view.View

 A task view class used internally by the Kanban Panel, based on the {@link Ext.view.View} class, showing a
 plain list of {@link Kanban.model.Task tasks}.
 */
Ext.define('Kanban.view.TaskView', {
    extend : 'Ext.view.View',
    alias  : 'widget.taskview',

    requires        : [
        "Kanban.template.Task",
        "Kanban.data.ViewStore"
    ],

    // Inherited configs
    autoScroll      : true,
    trackOver       : true,
    overItemCls     : 'sch-task-over',
    selectedItemCls : 'sch-task-selected',
    itemSelector    : '.sch-task',

    // Class configs & properties
    state           : null,

    /**
     * @cfg {String} taskBodyTpl The template to use for the task body rendering
     */

    /**
     * @cfg {String} resourceImgTpl The template to use for the user image
     */

    /**
     * @cfg {String} taskToolTpl The template to use for any tools that should be shown at the bottom of a task box.  
     */

    /**
     * A renderer template method intended to be overwritten to supply custom values for the template used to render a task.
     * This is called once every time a task is rendered and two arguments are passed, the task record and a 'renderData' object containing
     * the properties that will be applied to the template. In addition to the prepopulated renderData properties such as task 'Name', 'Id' etc you can also
     * supply a 'cls' (added as a CSS class) property and 'style' (added as inline styles) to programmatically change the appearance of tasks in the list.

     * @param {Kanban.model.Task} task The task record
     * @param {Object} renderData The object that will be applied to the template
     */
    taskRenderer : function(task, renderData) {},

    initComponent : function () {

        this.tpl = new Kanban.template.Task({
            model          : this.store.model,
            resourceImgTpl : this.resourceImgTpl,
            taskToolTpl    : this.taskToolTpl,
            taskBodyTpl    : this.taskBodyTpl
        });

        this.addCls('sch-taskview sch-taskview-state-' + this.state);

        this.callParent(arguments);
    },

    // ViewSelector UX breaks after a view refresh :/
    // http://www.sencha.com/forum/showthread.php?293015-DragSelector-UX-broken-after-view-refresh&p=1069838#post1069838
    refresh : function() {
        var el            = this.getEl();
        var selectorProxy = el.down('.' + Ext.baseCSSPrefix + 'view-selector');

        if (selectorProxy) {
            el.removeChild(selectorProxy);
        }

        this.callParent(arguments);

        if (selectorProxy) {
            el.appendChild(selectorProxy);
        }
    },

    collectData : function(records) {
        var collected = this.callParent(arguments),
            result    = [];

        for (var i = 0; i < collected.length; i++) {
            // collected[i] is reference to the record[i].data
            // we don't want to pollute it so lets make a new object instead
            var taskRenderData  = Ext.apply({}, collected[i]);
            var task            = records[i];
            var user            = task.getResource();
            var userImgUrl      = user && user.getImageUrl();

            taskRenderData.resourceImageCls = '';
            taskRenderData.resourceImageUrl = userImgUrl || Ext.BLANK_IMAGE_URL;
            taskRenderData.taskImageUrl     = task.getImageUrl();
            taskRenderData.task             = task;
            taskRenderData.name             = task.getName();

            if (!userImgUrl) {
                taskRenderData.resourceImageCls = "sch-no-img";
            }

            this.taskRenderer(task, taskRenderData);

            if (task.phantom) {
                taskRenderData.cls = (taskRenderData.cls || '') + " sch-phantom-task";
            }

            result.push(taskRenderData);
        }

        return result;
    }
});

/**

@class Kanban.view.TaskColumn
@extends Ext.panel.Panel

A panel representing a 'swim lane' in the task board, based on the {@link Ext.panel.Panel} class. The TaskColumn holds a single {@link Kanban.view.TaskView}
instance and is consumed by the TaskBoard class. You normally don't interact directly with this class, but you can configure each column
using the {@link Kanban.view.TaskBoard#columnConfigs} config option.

    var taskBoard = new Kanban.view.TaskBoard({
        resourceStore : userStore,
        taskStore     : taskStore,
        ..,

        columnConfigs : {
            // Applied to all Task Columns
            all : {
                iconCls : 'sch-header-icon'
            },

            // Configure a Task Column individually
            "NotStarted" : {
                dockedItems : {
                    xtype   : 'container',
                    dock    : 'bottom',
                    layout  : 'fit',
                    border  : 0,
                    padding : '5 8',
                    items   : {
                        height : 30,

                        xtype : 'addnewfield',
                        store : taskStore
                    }
                }
            }
        }
    });

You can also subclass it and have the {@link Kanban.view.TaskBoard} consume your own custom class instead by providing the {@link Kanban.view.TaskBoard#columnClass}
config.
*/
Ext.define('Kanban.view.TaskColumn', {
    extend            : 'Ext.Panel',
    alias             : 'widget.taskcolumn',

    requires          : [
        // Ext JS 5 bug
        'Ext.layout.container.Fit',

        'Kanban.view.TaskView'
    ],

    iconCls           : 'sch-header-icon',
    flex              : 1,
    layout            : 'fit',
    collapseDirection : 'right',

    /**
     * @cfg {String} state The state name for this column
     * @required
     */
    state             : null,

    store             : null,
    taskBodyTpl       : null,
    taskToolTpl       : null,
    resourceImgTpl    : null,
    origTitle         : null,
    view              : null,
    zoomLevel         : 'large',

    /**
     * @cfg {Object} viewConfig A custom object containing config properties for the {@link Ext.view.View} which is added to this column
     * @required
     */
    viewConfig        : null,

    initComponent : function () {
        var me = this;

        if (me.state === null) {
            throw 'Must supply state';
        }

        var viewConfig = Ext.apply({
            store : me.store,
            state : me.state
        }, me.viewConfig || {});

        if (me.taskBodyTpl)       viewConfig.taskBodyTpl = me.taskBodyTpl;
        if (me.taskToolTpl)       viewConfig.taskToolTpl = me.taskToolTpl;
        if (me.resourceImgTpl)    viewConfig.resourceImgTpl = me.resourceImgTpl;

        me.items = me.view = new Kanban.view.TaskView(viewConfig);

        var locale = Sch.locale.Active['Kanban.locale'] || {};

        me.origTitle = me.title = (me.title || locale[me.state] || me.state);

        me.callParent(arguments);

        me.addCls('sch-taskcolumn sch-taskcolumn-state-' + me.state.replace(/\s/g, '-'));
    },

    onRender : function() {
        this.setZoomLevel(this.zoomLevel);

        if (this.header) {
            this.header.addCls('sch-taskcolumnheader-state-' + this.state.replace(/\s/g, '-'));
        }

        this.callParent(arguments);
    },

    afterRender : function() {
        this.callParent(arguments);

        this.refreshTitle();
    },

    refreshTitle : function () {
        var state = this.state;

        var nbrTasks = this.store.query(this.store.getModel().prototype.stateField, state, false, false, true).length;

        this.setTitle(this.origTitle + (nbrTasks ? ' (' + nbrTasks + ')' : ''));
    },

    bindStore : function(store) {
        var listeners = {
            load        : this.refreshTitle,
            datachanged : this.refreshTitle,
            update      : this.refreshTitle,
            add         : this.refreshTitle,
            remove      : this.refreshTitle,
            buffer      : 20,
            scope       : this
        };

        if (this.store) {
            this.mun(this.store, listeners);
        }

        if (store) {
            this.mon(store, listeners);

            this.view.bindStore(store);
        }

        this.store = store;
    },

    getZoomLevel : function() { return this.zoomLevel; },

    setZoomLevel : function(level) {
        this.zoomLevel = level || 'large';

        this.el.set({
            size : level
        });
    }

});

/**

@class Kanban.view.TaskBoard
@extends Ext.panel.Panel

A panel based on the {@link Ext.panel.Panel} class which allows you to visualize and manage {@link Kanban.model.Task tasks} and you can
also assign {@link Kanban.model.Resource resources} to these tasks. The panel expects a {@link Kanban.data.TaskStore taskStore} to be provided and can also
be configured with a {@link Kanban.data.ResourceStore resourceStore}. Based on the array of {@link Kanban.model.Task#states states}, a list of
{@link Kanban.view.TaskColumn TaskColumns} will be generated. Tasks can be dragged between these state panels, and you can control which state transitions
are allowed by subclassing the {@link Kanban.model.Task Task} class and overriding the {@link Kanban.model.Task#isValidTransition} method.

Sample usage below:

    var resourceStore = new Kanban.data.ResourceStore({
        data    : [
            { Id : 1, Name : 'Dave' }
        ]
    });

    var taskStore = new Kanban.data.TaskStore({
        data    : [
            { Id : 1, Name : 'Dig hole', State : 'NotStarted'}
        ]
    });

    var taskBoard = new Kanban.view.TaskBoard({
        resourceStore : resourceStore,
        taskStore     : taskStore
    });

    var vp = new Ext.Viewport({
        items       : taskBoard,
        layout      : 'fit'
    });

Additionally, you can control the layout of the columns yourself by providing an array of Columns yourself.

    var taskBoard = new Kanban.view.TaskBoard({
        ...
        columns : [
            {
                state       : 'NotStarted',
                title       : 'Not Started',
                dockedItems : {
                    xtype   : 'container',
                    dock    : 'bottom',
                    layout  : 'fit',
                    ...
                }
            },
            {
                state : 'InProgress',
                title : 'In Progress'
            },
            {
                xtype    : 'container',
                flex     : 1,
                layout   : { type : 'vbox', align : 'stretch' },
                defaults : { xtype : 'taskcolumn', flex : 1 },
                items    : [
                    {
                        state : 'Test',
                        title : 'Test'
                    },
                    {
                        state     : 'Acceptance',
                        title     : 'Acceptance',

                        // Column-level zoom setting
                        zoomLevel : 'mini'
                    }
                ]
            },
            {
                state : 'Done',
                title : 'Done'
            }
        ]
    });

{@img taskboard/images/board.png 2x}

You can of course also subclass this class like you would with any other Ext JS class and provide your own custom behavior.
Make sure to also study the other classes used by this component, the various store, model and UI classes.
*/
Ext.define('Kanban.view.TaskBoard', {
    extend : 'Ext.Panel',
    alias  : 'widget.taskboard',

    requires : [
        "Kanban.locale.Ko",
        "Kanban.data.TaskStore",
        "Kanban.data.ResourceStore",
        "Kanban.view.TaskColumn",
        "Kanban.dd.DropZone",
        "Kanban.dd.DragZone",
        "Kanban.editor.SimpleEditor",
        "Kanban.field.AddNew",
        "Kanban.menu.UserMenu",
        "Kanban.menu.TaskMenu",
        "Kanban.selection.TaskModel"
    ],


    border      : false,
    layout      : { type : 'hbox', align : 'stretch' },
    defaultType : 'taskcolumn',

    // BEGIN PANEL SPECIFIC PROPERTIES
    /**
     * @cfg {Kanban.data.TaskStore} taskStore (required) The store containing the tasks
     */
    taskStore : null,

    /**
     * @cfg {Kanban.data.ResourceStore} resourceStore The store containing the resources that can be assigned to tasks.
     */
    resourceStore : null,

    /**
     * @cfg {String} columnClass The class to use to instantiate the columns making up the task board. You can subclass
     * the default class and provide your own custom functionality by using this config property.
     * */
    columnClass : 'Kanban.view.TaskColumn',

    /**
     * @cfg {Kanban.view.TaskColumn[]} columns An array of {@link Kanban.view.TaskColumn} objects defining the various states of the tasks
     * in the board.
     * */
    columns : null,

    /**
     * @cfg {Object} columnConfigs An object containing configuration objects for individual TaskColumns. To set properties for the 'NotStarted' column,
     *               see the example below.
     *
     columnConfigs : {
        // Applied to all columns
        all : {
            iconCls : 'sch-header-icon'
        },

        "NotStarted" : {
            border : false
        }
    }
     * You can configure any columns matching the possible states defined in the TaskModel. Only relevant when not specifying the {@link columns} config option.
     * in the board.
     * */
    columnConfigs : null,

    /**
     * @cfg {Object} editor An array of objects containing configuration options for the columns which are automatically created based on
     * the possible states defined in the TaskModel. Only relevant when not specifying the {@link columns} config option.
     * in the board.
     * */
    editor : null,

    /**
     * @cfg {Object} viewConfig A custom config object that will be passed to each underlying {@link Ext.view.View} instance (one inside each state column)
     * */
    viewConfig : null,

    /**
     * @cfg {Boolean} enableUserMenu true to show a menu when clicking the user of a task.
     */
    enableUserMenu : true,

    /**
     * @cfg {Boolean} readOnly true to not allow editing or moving of tasks.
     * */
    readOnly : false,

    /**
     * @cfg {Ext.menu.Menu} userMenu A menu used to edit the assigned user for a task
     * */
    userMenu : null,

    /**
     * @cfg {Kanban.menu.TaskMenu/Object/Boolean} taskMenu Specify a menu for the task. A configuration will be passed to the {@link Kanban.view.TaskBoard#taskMenuClass}.
     *
     */

    taskMenu : true,

    /**
     * An empty function by default, but provided so that you can perform custom validation on
     * the tasks being dragged. This function is called after a drag and drop process to validate the operation.
     * To control what 'this' points to inside this function, use
     * {@link #validatorFnScope}.
     * @param {Kanban.model.Task[]} taskRecords an array containing the records being dragged
     * @param {String} newState The new state of the target task
     * @return {Boolean} true if the drop position is valid, else false to prevent a drop
     */
    dndValidatorFn : Ext.emptyFn,

    /**
     * @cfg {Object} validatorFnScope
     * The 'this' object to use for the {@link #dndValidatorFn} function
     */
    validatorFnScope : null,

    /**
     * @cfg {String} zoomLevel The size of the rendered tasks. Can also be controlled on a per-column level, see {@link Kanban.view.Column#zoomLevel}.
     * Options: ['large', 'medium', 'small', 'mini']
     * */
    zoomLevel : 'large',
    // EOF PANEL SPECIFIC PROPERTIES

    // Private properties
    taskCls        : 'sch-task',
    taskSelector   : '.sch-task',
    isHighlighting : false,
    views          : null,
    kanbanColumns  : null,
    selModel       : null,
    // EOF Private properties

    /**
     * @event taskclick
     * Fires when clicking a task
     * @param {Ext.view.View} view The DataView object
     * @param {Kanban.model.Task} task The task model
     * @param {HTMLElement} taskNode The clicked task root HTMLElement
     * @param {Ext.EventObject} event The event object
     */

    /**
     * @event taskdblclick
     * Fires when double clicking a task
     * @param {Ext.view.View} view The DataView object
     * @param {Kanban.model.Task} task The task model
     * @param {HTMLElement} taskNode The clicked task root HTMLElement
     * @param {Ext.EventObject} event The event object
     */

    /**
     * @event taskcontextmenu
     * Fires when right clicking a task
     * @param {Ext.view.View} view The DataView object
     * @param {Kanban.model.Task} task The task model
     * @param {HTMLElement} taskNode The clicked task root HTMLElement
     * @param {Ext.EventObject} event The event object
     */

    /**
     * @event taskmouseenter
     * Fires when the mouse moves over a task.
     * @param {Ext.view.View} view The DataView object
     * @param {Kanban.model.Task} task The task model
     * @param {HTMLElement} taskNode The hovered HTMLElement
     * @param {Ext.EventObject} event The event object
     */

    /**
     * @event taskmouseleave
     * Fires when the mouse leaves a task DOM node.
     * @param {Ext.view.View} view The DataView object
     * @param {Kanban.model.Task} task The task model
     * @param {HTMLElement} taskNode The HTMLElement
     * @param {Ext.EventObject} event The event object
     */

    /**
     * @event taskkeydown
     * Fires when a keydown event happens on a task DOM node.
     * @param {Ext.view.View} view The DataView object
     * @param {Kanban.model.Task} task The task model
     * @param {HTMLElement} taskNode The HTMLElement
     * @param {Ext.EventObject} event The event object
     */

    /**
     * @event taskkeyup
     * Fires when a keyup event happens on a task DOM node.
     * @param {Ext.view.View} view The DataView object
     * @param {Kanban.model.Task} task The task model
     * @param {HTMLElement} taskNode The HTMLElement
     * @param {Ext.EventObject} event The event object
     */

    initComponent : function () {
        var me = this;

        me.defaults = me.defaults || {};

        Ext.applyIf(me.defaults, {
            margin : 12
        });

        this.taskStore     = Ext.data.StoreManager.lookup(this.taskStore);
        this.resourceStore = Ext.data.StoreManager.lookup(this.resourceStore);

        this.addCls('sch-taskboard');
        this.addBodyCls('sch-taskboard-body');

        this.on({
            add    : this.onColumnsAdded,
            remove : this.onColumnsRemoved,
            scope  : this
        });

        if (!this.columns) {
            this.columns = this.createColumns();
        }
        else {
            this.initColumns(this.columns);
        }

        this.items = this.columns;

        if (!this.taskStore) {
            throw 'Must define a taskStore for the Panel';
        }

        if (!this.resourceStore) {
            throw 'Must define a resourceStore for the Panel';
        }

        this.callParent(arguments);

        this.bindResourceStore(this.resourceStore, true);
    },

    createColumns : function () {
        var me = this;

        var states     = me.taskStore.model.prototype.states;
        var colConfigs = me.columnConfigs || {};

        return Ext.Array.map(states, function (state, index) {
            return Ext.create(me.columnClass, Ext.apply({
                store      : me.taskStore,
                state      : state,
                viewConfig : me.viewConfig,
                zoomLevel  : me.zoomLevel,
                taskBoard  : me
            }, Ext.apply(colConfigs[ state ] || {}, colConfigs.all)));
        });
    },

    initColumns : function (columns) {

        var me = this;

        Ext.Array.forEach(columns, function (column) {

            if (column.items) {
                me.initColumns(column.items);
            }
            else {
                Ext.applyIf(column, {
                    store      : me.taskStore,
                    viewConfig : me.viewConfig
                });
            }
        }, this);
    },

    onColumnsAdded : function (me, component) {
        var columns = component instanceof Kanban.view.TaskColumn ? [ component ] : component.query('taskcolumn');

        Ext.Array.forEach(columns, function (col) {
            col.bindStore(
                new Kanban.data.ViewStore({
                    masterStore : this.taskStore,
                    state       : col.state
                })
            );

            this.bindViewListeners(col.view);
            // we only need to add columns and views to lists when they are being added after component is rendered
            // this listener will be invoked before we fill these properties, we can skip this part for now
            this.kanbanColumns && this.kanbanColumns.push(col);
            this.views && this.views.push(col.view);
        }, this);
    },

    onColumnsRemoved : function (me, component) {
        var column = component instanceof Kanban.view.TaskColumn && component;

        Ext.Array.remove(this.kanbanColumns, column);
        Ext.Array.remove(this.views, column.view);
    },

    afterRender : function () {
        var me = this;

        this.callParent(arguments);

        if (!this.isReadOnly()) {
            this.setupDragDrop();
            this.initEditor();
            this.initTaskMenu();

            if (this.enableUserMenu && this.userMenu) {
                this.initUserMenu();
            }
        }

        this.views         = this.query('taskview');
        this.kanbanColumns = this.query('taskcolumn');

        this.on('taskclick', this.onTaskClick, this);
    },

    setReadOnly : function (readOnly) {
        this.readOnly = readOnly;
    },

    isReadOnly : function () {
        return this.readOnly;
    },

    bindViewListeners : function (view) {

        view.on({
            itemclick       : this.getTaskListener('taskclick'),
            itemcontextmenu : this.getTaskListener('taskcontextmenu'),
            itemdblclick    : this.getTaskListener('taskdblclick'),
            itemmouseenter  : this.getTaskListener('taskmouseenter'),
            itemmouseleave  : this.getTaskListener('taskmouseleave'),
            itemkeydown     : this.getTaskListener('taskkeydown'),
            itemkeyup       : this.getTaskListener('taskkeyup'),
            scope           : this
        });
    },

    setupDragDrop : function () {
        var me = this;

        this.dragZone = new Kanban.dd.DragZone(this.id, { panel : this });
        this.dropZone = new Kanban.dd.DropZone(this.id, {
            panel            : this,
            validatorFn      : this.dndValidatorFn,
            validatorFnScope : this.validatorFnScope
        });

        this.relayEvents(this.dragZone, [
            /**
             * @event beforetaskdrag
             * Fires before a drag-drop operation is initiated, return false to cancel it
             * @param {Kanban.dd.DragZone} drag zone The drag zone
             * @param {Kanban.model.Task} task The task corresponding to the HTML node that's about to be dragged
             * @param {Ext.EventObject} e The event object
             */
            'beforetaskdrag',

            /**
             * @event taskdragstart
             * Fires when a drag-drop operation starts
             * @param {Kanban.dd.DragZone} drag zone The drag zone
             * @param {Kanban.model.Task[]} task The tasks being dragged
             */
            'taskdragstart',

            'aftertaskdrop'
        ]);

        this.relayEvents(this.dropZone, [
            /**
             * @event beforetaskdropfinalize
             * Fires before a succesful drop operation is finalized. Return false to finalize the drop at a later time.
             * To finalize the operation, call the 'finalize' method available on the context object. Pass `true` to it to accept drop or false if you want to cancel it
             * NOTE: you should **always** call `finalize` method whether or not drop operation has been canceled
             * @param {Ext.dd.DropZone} drop zone The drop zone
             * @param {Object} dragContext An object containing 'taskRecords', 'newState' and 'finalize' properties.
             * @param {Ext.EventObject} e The event object
             */
            'beforetaskdropfinalize',

            /**
             * @event taskdrop
             * Fires after a succesful drag and drop operation
             * @param {Ext.dd.DropZone} drop zone The drop zone
             * @param {Kanban.model.Task[]} task The tasks being dragged
             */
            'taskdrop',

            /**
             * @event aftertaskdrop
             * Fires after a drag n drop operation, even when drop was performed on an invalid location
             * @param {Ext.dd.DropZone} drop zone The drop zone
             */
            'aftertaskdrop'
        ]);

        this.dropZone.on('aftertaskdrop', this.onAfterTaskDrop, this);

        this.dragZone.on('taskdragstarting', this.onDragStarting, this);
    },

    resolveState : function (el) {
        // HACK: If you drag the task bar outside the IE window or iframe it crashes (missing e.target)
        if (Ext.isIE && !el) {
            el = document.body;
        }

        if (!el.dom) {
            var columnEl = Ext.fly(el);
            if (!columnEl.is('.sch-taskview')) {
                columnEl = columnEl.up('.sch-taskview');
            }
            if (columnEl && columnEl.component) {
                return columnEl.component.state;
            }
        }

        return false;
    },

    setZoomLevel : function (level) {
        this.translateToColumns('setZoomLevel', [ level ]);
    },

    // Will simply return the zoom level of the first scrum column
    getZoomLevel : function () {
        return this.down('taskcolumn').getZoomLevel();
    },

    initEditor : function () {

        if (this.editor) {

            if (!this.editor.isComponent) {
                this.editor = Ext.widget(this.editor);
            }

            this.editor.init(this);
        }
    },

    initUserMenu : function () {
        if (!(this.userMenu instanceof Ext.Component)) {
            this.userMenu = Ext.ComponentManager.create(this.userMenu);
        }

        this.el.on({
            click    : this.onUserImgClick,
            delegate : '.sch-user-avatar',
            scope    : this
        });
    },

    initTaskMenu : function () {

        if (this.taskMenu) {

            var taskMenu = typeof this.taskMenu === 'boolean' ? { xtype : 'kanban_taskmenu' } : this.taskMenu;

            if (Ext.isArray(taskMenu)) {
                taskMenu = {
                    items : taskMenu
                };
            }

            taskMenu.taskBoard = this;

            if (!taskMenu.isTaskMenu) {
                this.taskMenu = Ext.widget(Ext.applyIf(taskMenu, {
                    xtype : 'kanban_taskmenu'
                }));
            }

            this.taskMenu.registerListeners();

            this.addCls('sch-taskboard-with-menu');
        }
    },

    onUserImgClick : function (e, t) {
        e.stopEvent();

        if (!this.isReadOnly()) {
            this.userMenu.showForTask(this.resolveRecordByNode(t), e.getXY());
        }
    },

    resolveViewByNode : function (node) {
        var viewEl = Ext.fly(node).up('.sch-taskview');

        return (viewEl && Ext.getCmp(viewEl.id)) || null;
    },

    resolveRecordByNode : function (node) {
        var view = this.resolveViewByNode(node);

        return (view && view.getRecord(view.findItemByChild(node))) || null;
    },

    // Clear selections in other views if CTRL is not clicked
    onTaskClick : function (view, record, item, event) {
        if (!event.ctrlKey) {
            this.deselectAllInOtherViews(view);
        }
    },

    deselectAllInOtherViews : function (view) {
        this.getSelectionModel().deselectAllInOtherSelectionModels(view.getSelectionModel());
    },

    // record or id
    getElementForTask : function (task) {

        if (!(task instanceof Ext.data.Model)) task = this.taskStore.getById(task);

        var state = task.getState();

        if (state) {
            return Ext.get(this.getViewForState(state).getNode(task));
        }
    },

    getViewForState : function (state) {
        return this.down('taskview[state=' + [ state ] + ']');
    },

    forEachColumn : function (fn, scope) {
        Ext.Array.each(this.query('taskcolumn'), fn, scope || this);
    },

    translateToViews : function (method, args) {
    	
    	//console.log('this.views', this.views);
    	
    	if(this.views!=null) {
            Ext.Array.map(this.views, function (view) {
            	//console.log('view', view);
                return view[ method ].apply(view, args || []);
            });    		
    	}
    	

    },

    translateToColumns : function (method, args) {
        Ext.Array.map(this.kanbanColumns, function (col) {
            return col[ method ].apply(col, args || []);
        });
    },

    translateToSelectionModels : function (method, args) {
        Ext.Array.map(this.views, function (view) {
            var sm = view.getSelectionModel();

            sm[ method ].apply(sm, args || []);
        });
    },

    getSelectedRecords : function () {
        return [].concat.apply([], Ext.Array.map(this.views, function (view) {
            return view.getSelectionModel().getSelection();
        }));
    },

    selectAll : function () {
        this.getSelectionModel().selectAll();
    },

    deselectAll : function () {
        this.getSelectionModel().deselectAll();
    },

    onDestroy : function () {
        Ext.destroy(
            this.dragZone,
            this.dropZone,
            this.userMenu,
            this.taskMenu
        );
    },

    // private
    getTaskListener : function (eventName) {
        return function (view, record, item, index, event) {
            this.fireEvent(eventName, view, record, item, event);
        };
    },

    /**
     * Highlights tasks in the board based on a callback function.
     * @param {Function} callback A function returning true (to indicate a match) or false
     * @return {Object} The 'this' object to use for the callback. Defaults to the panel instance.
     */
    highlightTasksBy : function (callback, scope) {

        if (!this.isHighlighting) {
            this.el.addCls('sch-taskboard-filtered');
            this.isHighlighting = true;
        }

        // Clear old matches first
        this.el.select('.sch-filter-match').removeCls('sch-filter-match');

        for (var i = 0, l = this.taskStore.getCount(); i < l; i++) {
            var rec = this.taskStore.getAt(i);

            if (callback.call(scope || this, rec)) {
                var el = this.getElementForTask(rec);

                if (el) {
                    el.addCls('sch-filter-match');
                }
            }
        }
    },

    /**
     * Clears any highlighted tasks.
     */
    clearHighlight : function () {
        this.isHighlighting = false;

        this.el.removeCls('sch-taskboard-filtered');
        this.el.select('.sch-filter-match').removeCls('sch-filter-match');
    },

    /**
     * Refreshes all the task columns manually, which can be useful after performing lots of data operations or changes.
     */
    refresh : function () {
    	try {
            this.translateToViews('refresh');	
    	} catch(e) {
    		console.log('kanban refresh e', e);
    	}
        this.fireEvent('refresh', this);
    },

    /**
     * Refreshes the element of a single the task record.
     * @param {Kanban.model.Task} task the task record
     */
    refreshTaskNode : function (task) {
        var node = this.getElementForTask(task);

        if (node) {
            var view = this.resolveViewByNode(node);

            view.refreshNode(task);
        }
    },

    bindResourceStore : function (store, suppressRefresh) {

        var listeners = {
            update  : this.onResourceStoreUpdate,
            refresh : this.onResourceStoreRefresh,
            remove  : this.onResourceStoreRemove,

            scope : this
        };

        if (this.resourceStore) {
            this.mun(this.resourceStore, listeners);
        }

        if (store) {
            store = Ext.data.StoreManager.lookup(store);

            this.mon(store, listeners);

            this.taskStore.setResourceStore(store);

            if (!suppressRefresh) {
                this.refresh();
            }
        }

        this.resourceStore = store;
    },

    onResourceStoreUpdate : function () {
        // can be done cheaper
        this.refresh();
    },

    onResourceStoreRefresh : function () {
        // can be done cheaper
        this.refresh();
    },

    onResourceStoreRemove : function () {
        // can be done cheaper
        this.refresh();
    },

    
    // clear selections if user is not multi selecting
    onDragStarting : function (dz, task, e) {

        if (!e.ctrlKey) {
            this.deselectAllInOtherViews(this.getViewForState(task.getState()));
        }
    },


    onAfterTaskDrop : function () {
        this.getSelectionModel().deselectAll();
    },

    /**
     * Returns the task menu instance (if the task board was configured to use one).
     * @return {Kanban.menu.TaskMenu}
     */
    getTaskMenu : function () {
        return this.taskMenu;
    },

    /**
     * Returns the task store instance associated with the task board.
     * @return {Kanban.data.TaskStore}
     */
    getTaskStore : function () {
        return this.taskStore;
    },

    /**
     * Returns the resource store instance associated with the task board.
     * @return {Kanban.data.ResourceStore}
     */
    getResourceStore : function () {
        return this.resourceStore;
    },

    /**
     * Returns the task editor associated with the task board.
     * @return {Ext.Component}
     */
    getTaskEditor : function () {
        return this.editor;
    },

    /**
     * Returns the selection model associated with the task board.
     * @return {Kanban.selection.TaskModel}
     */
    getSelectionModel : function () {
        if (!this.selModel) {
            this.selModel = this.createSelectionModel();
        }
        return this.selModel;
    },

    createSelectionModel : function () {
        var selModel = new Kanban.selection.TaskModel({
            panel : this
        });

        this.relayEvents(selModel, [

            /**
             * @event deselect
             * Fired after a task record is deselected
             * @param {Ext.selection.DataViewModel} this
             * @param  {Kanban.model.Task} record The deselected record
             */
            'deselect',

            /**
             * @event select
             * Fired after a task record is selected
             * @param {Ext.selection.DataViewModel} this
             * @param  {Kanban.model.Task} record The selected record
             */
            'select'
        ]);

        return selModel;
    }
}, function () {

    Ext.apply(Kanban, {
        /*PKGVERSION*/VERSION : '2.0.9'
    });

});

