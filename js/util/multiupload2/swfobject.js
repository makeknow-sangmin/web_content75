/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();

///*!	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
//	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
//*/
//
//var swfobject = function() {
//	
//	var UNDEF = "undefined",
//		OBJECT = "object",
//		SHOCKWAVE_FLASH = "Shockwave Flash",
//		SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
//		FLASH_MIME_TYPE = "application/x-shockwave-flash",
//		EXPRESS_INSTALL_ID = "SWFObjectExprInst",
//		ON_READY_STATE_CHANGE = "onreadystatechange",
//		
//		win = window,
//		doc = document,
//		nav = navigator,
//		
//		plugin = false,
//		domLoadFnArr = [main],
//		regObjArr = [],
//		objIdArr = [],
//		listenersArr = [],
//		storedAltContent,
//		storedAltContentId,
//		storedCallbackFn,
//		storedCallbackObj,
//		isDomLoaded = false,
//		isExpressInstallActive = false,
//		dynamicStylesheet,
//		dynamicStylesheetMedia,
//		autoHideShow = true,
//	
//	/* Centralized function for browser feature detection
//		- User agent string detection is only used when no good alternative is possible
//		- Is executed directly for optimal performance
//	*/	
//	ua = function() {
//		var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
//			u = nav.userAgent.toLowerCase(),
//			p = nav.platform.toLowerCase(),
//			windows = p ? /win/.test(p) : /win/.test(u),
//			mac = p ? /mac/.test(p) : /mac/.test(u),
//			webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
//			ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
//			playerVersion = [0,0,0],
//			d = null;
//		if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
//			d = nav.plugins[SHOCKWAVE_FLASH].description;
//			if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
//				plugin = true;
//				ie = false; // cascaded feature detection for Internet Explorer
//				d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
//				playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
//				playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
//				playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
//			}
//		}
//		else if (typeof win.ActiveXObject != UNDEF) {
//			try {
//				var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
//				if (a) { // a will return null when ActiveX is disabled
//					d = a.GetVariable("$version");
//					if (d) {
//						ie = true; // cascaded feature detection for Internet Explorer
//						d = d.split(" ")[1].split(",");
//						playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
//					}
//				}
//			}
//			catch(e) {}
//		}
//		return { w3:w3cdom, pv:playerVersion, wk:webkit, ie:ie, win:windows, mac:mac };
//	}(),
//	
//	/* Cross-browser onDomLoad
//		- Will fire an event as soon as the DOM of a web page is loaded
//		- Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
//		- Regular onload serves as fallback
//	*/ 
//	onDomLoad = function() {
//		if (!ua.w3) { return; }
//		if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically 
//			callDomLoadFunctions();
//		}
//		if (!isDomLoaded) {
//			if (typeof doc.addEventListener != UNDEF) {
//				doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
//			}		
//			if (ua.ie && ua.win) {
//				doc.attachEvent(ON_READY_STATE_CHANGE, function() {
//					if (doc.readyState == "complete") {
//						doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
//						callDomLoadFunctions();
//					}
//				});
//				if (win == top) { // if not inside an iframe
//					(function(){
//						if (isDomLoaded) { return; }
//						try {
//							doc.documentElement.doScroll("left");
//						}
//						catch(e) {
//							setTimeout(arguments.callee, 0);
//							return;
//						}
//						callDomLoadFunctions();
//					})();
//				}
//			}
//			if (ua.wk) {
//				(function(){
//					if (isDomLoaded) { return; }
//					if (!/loaded|complete/.test(doc.readyState)) {
//						setTimeout(arguments.callee, 0);
//						return;
//					}
//					callDomLoadFunctions();
//				})();
//			}
//			addLoadEvent(callDomLoadFunctions);
//		}
//	}();
//	
//	function callDomLoadFunctions() {
//		if (isDomLoaded) { return; }
//		try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
//			var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
//			t.parentNode.removeChild(t);
//		}
//		catch (e) { return; }
//		isDomLoaded = true;
//		var dl = domLoadFnArr.length;
//		for (var i = 0; i < dl; i++) {
//			domLoadFnArr[i]();
//		}
//	}
//	
//	function addDomLoadEvent(fn) {
//		if (isDomLoaded) {
//			fn();
//		}
//		else { 
//			domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
//		}
//	}
//	
//	/* Cross-browser onload
//		- Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
//		- Will fire an event as soon as a web page including all of its assets are loaded 
//	 */
//	function addLoadEvent(fn) {
//		if (typeof win.addEventListener != UNDEF) {
//			win.addEventListener("load", fn, false);
//		}
//		else if (typeof doc.addEventListener != UNDEF) {
//			doc.addEventListener("load", fn, false);
//		}
//		else if (typeof win.attachEvent != UNDEF) {
//			addListener(win, "onload", fn);
//		}
//		else if (typeof win.onload == "function") {
//			var fnOld = win.onload;
//			win.onload = function() {
//				fnOld();
//				fn();
//			};
//		}
//		else {
//			win.onload = fn;
//		}
//	}
//	
//	/* Main function
//		- Will preferably execute onDomLoad, otherwise onload (as a fallback)
//	*/
//	function main() { 
//		if (plugin) {
//			testPlayerVersion();
//		}
//		else {
//			matchVersions();
//		}
//	}
//	
//	/* Detect the Flash Player version for non-Internet Explorer browsers
//		- Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
//		  a. Both release and build numbers can be detected
//		  b. Avoid wrong descriptions by corrupt installers provided by Adobe
//		  c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
//		- Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
//	*/
//	function testPlayerVersion() {
//		var b = doc.getElementsByTagName("body")[0];
//		var o = createElement(OBJECT);
//		o.setAttribute("type", FLASH_MIME_TYPE);
//		var t = b.appendChild(o);
//		if (t) {
//			var counter = 0;
//			(function(){
//				if (typeof t.GetVariable != UNDEF) {
//					var d = t.GetVariable("$version");
//					if (d) {
//						d = d.split(" ")[1].split(",");
//						ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
//					}
//				}
//				else if (counter < 10) {
//					counter++;
//					setTimeout(arguments.callee, 10);
//					return;
//				}
//				b.removeChild(o);
//				t = null;
//				matchVersions();
//			})();
//		}
//		else {
//			matchVersions();
//		}
//	}
//	
//	/* Perform Flash Player and SWF version matching; static publishing only
//	*/
//	function matchVersions() {
//		var rl = regObjArr.length;
//		if (rl > 0) {
//			for (var i = 0; i < rl; i++) { // for each registered object element
//				var id = regObjArr[i].id;
//				var cb = regObjArr[i].callbackFn;
//				var cbObj = {success:false, id:id};
//				if (ua.pv[0] > 0) {
//					var obj = getElementById(id);
//					if (obj) {
//						if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
//							setVisibility(id, true);
//							if (cb) {
//								cbObj.success = true;
//								cbObj.ref = getObjectById(id);
//								cb(cbObj);
//							}
//						}
//						else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
//							var att = {};
//							att.data = regObjArr[i].expressInstall;
//							att.width = obj.getAttribute("width") || "0";
//							att.height = obj.getAttribute("height") || "0";
//							if (obj.getAttribute("class")) { att.styleclass = obj.getAttribute("class"); }
//							if (obj.getAttribute("align")) { att.align = obj.getAttribute("align"); }
//							// parse HTML object param element's name-value pairs
//							var par = {};
//							var p = obj.getElementsByTagName("param");
//							var pl = p.length;
//							for (var j = 0; j < pl; j++) {
//								if (p[j].getAttribute("name").toLowerCase() != "movie") {
//									par[p[j].getAttribute("name")] = p[j].getAttribute("value");
//								}
//							}
//							showExpressInstall(att, par, id, cb);
//						}
//						else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
//							displayAltContent(obj);
//							if (cb) { cb(cbObj); }
//						}
//					}
//				}
//				else {	// if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
//					setVisibility(id, true);
//					if (cb) {
//						var o = getObjectById(id); // test whether there is an HTML object element or not
//						if (o && typeof o.SetVariable != UNDEF) { 
//							cbObj.success = true;
//							cbObj.ref = o;
//						}
//						cb(cbObj);
//					}
//				}
//			}
//		}
//	}
//	
//	function getObjectById(objectIdStr) {
//		var r = null;
//		var o = getElementById(objectIdStr);
//		if (o && o.nodeName == "OBJECT") {
//			if (typeof o.SetVariable != UNDEF) {
//				r = o;
//			}
//			else {
//				var n = o.getElementsByTagName(OBJECT)[0];
//				if (n) {
//					r = n;
//				}
//			}
//		}
//		return r;
//	}
//	
//	/* Requirements for Adobe Express Install
//		- only one instance can be active at a time
//		- fp 6.0.65 or higher
//		- Win/Mac OS only
//		- no Webkit engines older than version 312
//	*/
//	function canExpressInstall() {
//		return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
//	}
//	
//	/* Show the Adobe Express Install dialog
//		- Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
//	*/
//	function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
//		isExpressInstallActive = true;
//		storedCallbackFn = callbackFn || null;
//		storedCallbackObj = {success:false, id:replaceElemIdStr};
//		var obj = getElementById(replaceElemIdStr);
//		if (obj) {
//			if (obj.nodeName == "OBJECT") { // static publishing
//				storedAltContent = abstractAltContent(obj);
//				storedAltContentId = null;
//			}
//			else { // dynamic publishing
//				storedAltContent = obj;
//				storedAltContentId = replaceElemIdStr;
//			}
//			att.id = EXPRESS_INSTALL_ID;
//			if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) { att.width = "310"; }
//			if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) { att.height = "137"; }
//			doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
//			var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
//				fv = "MMredirectURL=" + win.location.toString().replace(/&/g,"%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
//			if (typeof par.flashvars != UNDEF) {
//				par.flashvars += "&" + fv;
//			}
//			else {
//				par.flashvars = fv;
//			}
//			// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
//			// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
//			if (ua.ie && ua.win && obj.readyState != 4) {
//				var newObj = createElement("div");
//				replaceElemIdStr += "SWFObjectNew";
//				newObj.setAttribute("id", replaceElemIdStr);
//				obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
//				obj.style.display = "none";
//				(function(){
//					if (obj.readyState == 4) {
//						obj.parentNode.removeChild(obj);
//					}
//					else {
//						setTimeout(arguments.callee, 10);
//					}
//				})();
//			}
//			createSWF(att, par, replaceElemIdStr);
//		}
//	}
//	
//	/* Functions to abstract and display alternative content
//	*/
//	function displayAltContent(obj) {
//		if (ua.ie && ua.win && obj.readyState != 4) {
//			// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
//			// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
//			var el = createElement("div");
//			obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
//			el.parentNode.replaceChild(abstractAltContent(obj), el);
//			obj.style.display = "none";
//			(function(){
//				if (obj.readyState == 4) {
//					obj.parentNode.removeChild(obj);
//				}
//				else {
//					setTimeout(arguments.callee, 10);
//				}
//			})();
//		}
//		else {
//			obj.parentNode.replaceChild(abstractAltContent(obj), obj);
//		}
//	} 
//
//	function abstractAltContent(obj) {
//		var ac = createElement("div");
//		if (ua.win && ua.ie) {
//			ac.innerHTML = obj.innerHTML;
//		}
//		else {
//			var nestedObj = obj.getElementsByTagName(OBJECT)[0];
//			if (nestedObj) {
//				var c = nestedObj.childNodes;
//				if (c) {
//					var cl = c.length;
//					for (var i = 0; i < cl; i++) {
//						if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
//							ac.appendChild(c[i].cloneNode(true));
//						}
//					}
//				}
//			}
//		}
//		return ac;
//	}
//	
//	/* Cross-browser dynamic SWF creation
//	*/
//	function createSWF(attObj, parObj, id) {
//		var r, el = getElementById(id);
//		if (ua.wk && ua.wk < 312) { return r; }
//		if (el) {
//			if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
//				attObj.id = id;
//			}
//			if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
//				var att = "";
//				for (var i in attObj) {
//					if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
//						if (i.toLowerCase() == "data") {
//							parObj.movie = attObj[i];
//						}
//						else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
//							att += ' class="' + attObj[i] + '"';
//						}
//						else if (i.toLowerCase() != "classid") {
//							att += ' ' + i + '="' + attObj[i] + '"';
//						}
//					}
//				}
//				var par = "";
//				for (var j in parObj) {
//					if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
//						par += '<param name="' + j + '" value="' + parObj[j] + '" />';
//					}
//				}
//				el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
//				objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
//				r = getElementById(attObj.id);	
//			}
//			else { // well-behaving browsers
//				var o = createElement(OBJECT);
//				o.setAttribute("type", FLASH_MIME_TYPE);
//				for (var m in attObj) {
//					if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
//						if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
//							o.setAttribute("class", attObj[m]);
//						}
//						else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
//							o.setAttribute(m, attObj[m]);
//						}
//					}
//				}
//				for (var n in parObj) {
//					if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
//						createObjParam(o, n, parObj[n]);
//					}
//				}
//				el.parentNode.replaceChild(o, el);
//				r = o;
//			}
//		}
//		return r;
//	}
//	
//	function createObjParam(el, pName, pValue) {
//		var p = createElement("param");
//		p.setAttribute("name", pName);	
//		p.setAttribute("value", pValue);
//		el.appendChild(p);
//	}
//	
//	/* Cross-browser SWF removal
//		- Especially needed to safely and completely remove a SWF in Internet Explorer
//	*/
//	function removeSWF(id) {
//		var obj = getElementById(id);
//		if (obj && obj.nodeName == "OBJECT") {
//			if (ua.ie && ua.win) {
//				obj.style.display = "none";
//				(function(){
//					if (obj.readyState == 4) {
//						removeObjectInIE(id);
//					}
//					else {
//						setTimeout(arguments.callee, 10);
//					}
//				})();
//			}
//			else {
//				obj.parentNode.removeChild(obj);
//			}
//		}
//	}
//	
//	function removeObjectInIE(id) {
//		var obj = getElementById(id);
//		if (obj) {
//			for (var i in obj) {
//				if (typeof obj[i] == "function") {
//					obj[i] = null;
//				}
//			}
//			obj.parentNode.removeChild(obj);
//		}
//	}
//	
//	/* Functions to optimize JavaScript compression
//	*/
//	function getElementById(id) {
//		var el = null;
//		try {
//			el = doc.getElementById(id);
//		}
//		catch (e) {}
//		return el;
//	}
//	
//	function createElement(el) {
//		return doc.createElement(el);
//	}
//	
//	/* Updated attachEvent function for Internet Explorer
//		- Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
//	*/	
//	function addListener(target, eventType, fn) {
//		target.attachEvent(eventType, fn);
//		listenersArr[listenersArr.length] = [target, eventType, fn];
//	}
//	
//	/* Flash Player and SWF content version matching
//	*/
//	function hasPlayerVersion(rv) {
//		var pv = ua.pv, v = rv.split(".");
//		v[0] = parseInt(v[0], 10);
//		v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
//		v[2] = parseInt(v[2], 10) || 0;
//		return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
//	}
//	
//	/* Cross-browser dynamic CSS creation
//		- Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
//	*/	
//	function createCSS(sel, decl, media, newStyle) {
//		if (ua.ie && ua.mac) { return; }
//		var h = doc.getElementsByTagName("head")[0];
//		if (!h) { return; } // to also support badly authored HTML pages that lack a head element
//		var m = (media && typeof media == "string") ? media : "screen";
//		if (newStyle) {
//			dynamicStylesheet = null;
//			dynamicStylesheetMedia = null;
//		}
//		if (!dynamicStylesheet || dynamicStylesheetMedia != m) { 
//			// create dynamic stylesheet + get a global reference to it
//			var s = createElement("style");
//			s.setAttribute("type", "text/css");
//			s.setAttribute("media", m);
//			dynamicStylesheet = h.appendChild(s);
//			if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
//				dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
//			}
//			dynamicStylesheetMedia = m;
//		}
//		// add style rule
//		if (ua.ie && ua.win) {
//			if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
//				dynamicStylesheet.addRule(sel, decl);
//			}
//		}
//		else {
//			if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
//				dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
//			}
//		}
//	}
//	
//	function setVisibility(id, isVisible) {
//		if (!autoHideShow) { return; }
//		var v = isVisible ? "visible" : "hidden";
//		if (isDomLoaded && getElementById(id)) {
//			getElementById(id).style.visibility = v;
//		}
//		else {
//			createCSS("#" + id, "visibility:" + v);
//		}
//	}
//
//	/* Filter to avoid XSS attacks
//	*/
//	function urlEncodeIfNecessary(s) {
//		var regex = /[\\\"<>\.;]/;
//		var hasBadChars = regex.exec(s) != null;
//		return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
//	}
//	
//	/* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
//	*/
//	var cleanup = function() {
//		if (ua.ie && ua.win) {
//			window.attachEvent("onunload", function() {
//				// remove listeners to avoid memory leaks
//				var ll = listenersArr.length;
//				for (var i = 0; i < ll; i++) {
//					listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
//				}
//				// cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
//				var il = objIdArr.length;
//				for (var j = 0; j < il; j++) {
//					removeSWF(objIdArr[j]);
//				}
//				// cleanup library's main closures to avoid memory leaks
//				for (var k in ua) {
//					ua[k] = null;
//				}
//				ua = null;
//				for (var l in swfobject) {
//					swfobject[l] = null;
//				}
//				swfobject = null;
//			});
//		}
//	}();
//	
//	return {
//		/* Public API
//			- Reference: http://code.google.com/p/swfobject/wiki/documentation
//		*/ 
//		registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
//			if (ua.w3 && objectIdStr && swfVersionStr) {
//				var regObj = {};
//				regObj.id = objectIdStr;
//				regObj.swfVersion = swfVersionStr;
//				regObj.expressInstall = xiSwfUrlStr;
//				regObj.callbackFn = callbackFn;
//				regObjArr[regObjArr.length] = regObj;
//				setVisibility(objectIdStr, false);
//			}
//			else if (callbackFn) {
//				callbackFn({success:false, id:objectIdStr});
//			}
//		},
//		
//		getObjectById: function(objectIdStr) {
//			if (ua.w3) {
//				return getObjectById(objectIdStr);
//			}
//		},
//		
//		embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
//			var callbackObj = {success:false, id:replaceElemIdStr};
//			if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
//				setVisibility(replaceElemIdStr, false);
//				addDomLoadEvent(function() {
//					widthStr += ""; // auto-convert to string
//					heightStr += "";
//					var att = {};
//					if (attObj && typeof attObj === OBJECT) {
//						for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
//							att[i] = attObj[i];
//						}
//					}
//					att.data = swfUrlStr;
//					att.width = widthStr;
//					att.height = heightStr;
//					var par = {}; 
//					if (parObj && typeof parObj === OBJECT) {
//						for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
//							par[j] = parObj[j];
//						}
//					}
//					if (flashvarsObj && typeof flashvarsObj === OBJECT) {
//						for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
//							if (typeof par.flashvars != UNDEF) {
//								par.flashvars += "&" + k + "=" + flashvarsObj[k];
//							}
//							else {
//								par.flashvars = k + "=" + flashvarsObj[k];
//							}
//						}
//					}
//					if (hasPlayerVersion(swfVersionStr)) { // create SWF
//						var obj = createSWF(att, par, replaceElemIdStr);
//						if (att.id == replaceElemIdStr) {
//							setVisibility(replaceElemIdStr, true);
//						}
//						callbackObj.success = true;
//						callbackObj.ref = obj;
//					}
//					else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
//						att.data = xiSwfUrlStr;
//						showExpressInstall(att, par, replaceElemIdStr, callbackFn);
//						return;
//					}
//					else { // show alternative content
//						setVisibility(replaceElemIdStr, true);
//					}
//					if (callbackFn) { callbackFn(callbackObj); }
//				});
//			}
//			else if (callbackFn) { callbackFn(callbackObj);	}
//		},
//		
//		switchOffAutoHideShow: function() {
//			autoHideShow = false;
//		},
//		
//		ua: ua,
//		
//		getFlashPlayerVersion: function() {
//			return { major:ua.pv[0], minor:ua.pv[1], release:ua.pv[2] };
//		},
//		
//		hasFlashPlayerVersion: hasPlayerVersion,
//		
//		createSWF: function(attObj, parObj, replaceElemIdStr) {
//			if (ua.w3) {
//				return createSWF(attObj, parObj, replaceElemIdStr);
//			}
//			else {
//				return undefined;
//			}
//		},
//		
//		showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
//			if (ua.w3 && canExpressInstall()) {
//				showExpressInstall(att, par, replaceElemIdStr, callbackFn);
//			}
//		},
//		
//		removeSWF: function(objElemIdStr) {
//			if (ua.w3) {
//				removeSWF(objElemIdStr);
//			}
//		},
//		
//		createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
//			if (ua.w3) {
//				createCSS(selStr, declStr, mediaStr, newStyleBoolean);
//			}
//		},
//		
//		addDomLoadEvent: addDomLoadEvent,
//		
//		addLoadEvent: addLoadEvent,
//		
//		getQueryParamValue: function(param) {
//			var q = doc.location.search || doc.location.hash;
//			if (q) {
//				if (/\?/.test(q)) { q = q.split("?")[1]; } // strip question mark
//				if (param == null) {
//					return urlEncodeIfNecessary(q);
//				}
//				var pairs = q.split("&");
//				for (var i = 0; i < pairs.length; i++) {
//					if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
//						return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
//					}
//				}
//			}
//			return "";
//		},
//		
//		// For internal usage only
//		expressInstallCallback: function() {
//			if (isExpressInstallActive) {
//				var obj = getElementById(EXPRESS_INSTALL_ID);
//				if (obj && storedAltContent) {
//					obj.parentNode.replaceChild(storedAltContent, obj);
//					if (storedAltContentId) {
//						setVisibility(storedAltContentId, true);
//						if (ua.ie && ua.win) { storedAltContent.style.display = "block"; }
//					}
//					if (storedCallbackFn) { storedCallbackFn(storedCallbackObj); }
//				}
//				isExpressInstallActive = false;
//			} 
//		}
//	};
//}();
