var ComSharedEmbed = {

		EmbedFlex : function (appId, appSrc, bgColor, sWidth, sHeight, flashVars) {
			document.write(this.makeFlexObject(appId, appSrc, bgColor, sWidth, sHeight, flashVars));
		},

		makeFlexObject : function (appId, appSrc, bgColor, sWidth, sHeight, flashVars) {
			var cont = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" '
			         + 'id="' + appId + '" width="' + sWidth + '" height="' + sHeight + '" '
			         + 'codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab"> '
			         + '<param name="movie" value="' + appSrc + '.swf" /> '
			         + '<param name="quality" value="high" /> '
			         + '<param name="wmode" value="transparent" />'
			         + '<param name="bgcolor" value="' + bgColor + '" /> '
			         + '<param name="allowScriptAccess" value="sameDomain" /> '
			         + '<param name="flashVars" value="channelURI=http://' + channelURI + '/messagebroker/amf';
			if(flashVars != '' && typeof(flashVars) !='undefined'){
				cont = cont +  flashVars;
			}
			cont = cont + '"/> ';
			 cont = cont + '<embed src="' + appSrc + '.swf" quality="high" wmode="transparent" bgcolor="' + bgColor + '" '
			         + '	width="' + sWidth + '" height="' + sHeight + '" name="' + appId + '" align="middle" '
			         + '	play="true" '
			         + '	loop="false" '
			         + '	quality="high" '			         
			         + '	allowScriptAccess="sameDomain" '
			         + '	type="application/x-shockwave-flash" '
			         + '	pluginspage="http://www.adobe.com/go/getflashplayer"> '
			         + '</embed> '
			         + '</object> ';
			return cont;
	    },
	    
	    EmbedActiveX : function (cont){
	    	document.write(cont);
	    },
	    
	    EmbedNamo: function (sPrefixName, sDomainName, sLanguage, sHeight, sWidth, sBorder) {
	    	document.write(this.makeNamoObject(sPrefixName, sDomainName, sLanguage, sHeight, sWidth, sBorder));
	    },

	    makeNamoObject : function (sPrefixName, sDomainName, sLanguage, sHeight, sWidth, sBorder) {
	    	var cont = '<object id="' + sPrefixName + '_WebEditorActiveX" classid="CLSID:7D29654A-48EC-40BD-BA76-EB26C50A2FA7" style="border: ' + sBorder + 'px solid #d3d3d3;" height="' + sHeight + '" width="' + sWidth + '" codebase="' + sDomainName + '/cab/NamoActiveSquare7/NamoWec.cab#version=7,0,0,74">'
	    	         + '	<param name="UserLang" value="' + sLanguage + '">'
	    	         + '	<param name="InitFileURL" value="' + sDomainName + '/cab/NamoActiveSquare7/NamoWec.xml">'
	    	         + '	<param name="InstallSourceURL" value="http://help.namo.co.kr/activesquare/techlist/help/AS7_update">'
	    	         + '</object>';
	    	return cont;
	    }
};		