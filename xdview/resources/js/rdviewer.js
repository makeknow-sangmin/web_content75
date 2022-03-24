var _os = navigator.userAgent;  
var _app = navigator.appName;
if(_os.indexOf("Linux") != -1 || _os.indexOf("Macintosh") != -1 ) {  
		document.write('<EMBED id="cxviewer" ',
		'type="application/x-java-applet" ',
		'code="m2soft.javard.gui.RDApplet" ',
		'width="100%" height="100%" ',
		'archive="' + jars + '" ',
		'separate_jvm="false" ',
		'mrd.charset="MS949" ',
		'txt.charset="MS949" ',
		'java_arguments="-Xms512m -Xmx1000m" />',
		'</EMBED>',
		'Your browser needs <a href="http://www.oracle.com/technetwork/java/javase/downloads/index.html">Java SE</a> to view projects.');

} else {
	if (_os.indexOf("MSIE") != -1 || _os.indexOf("Trident") != -1)  
	//if (_app == "Microsoft Internet Explorer") 
		{
			if(navigator.appName.indexOf("Microsoft") != -1 && navigator.appVersion.indexOf("x64") != -1){
				//alert("64bit");
				document.write('<OBJECT id="rdViewer" classid="clsid:04931AA4-5D13-442f-AEE8-0F1184002BDD"'); //classid 
				document.write('  codebase="/report/cab/cxviewer60u.cab#version=6,3,0,175"'); //������
				document.write('  name="rdViewer" width=100% height=100%>  ');
				document.write('  <PARAM NAME="WinTrust_RevocationCheck" VALUE="FALSE"> ');
				document.write('</OBJECT>');
			}else{
				document.write('<OBJECT id="rdpdf50" classid="clsid:0D0862D3-F678-48B5-876B-456457E668BC"'); //classid 
				document.write('  codebase="/report/cab/rdpdf50.cab#version=2,2,0,88"'); //������
				document.write('  name="rdpdf50" width=0% height=0%>  ');
				document.write('  <PARAM NAME="WinTrust_RevocationCheck" VALUE="FALSE"> ');
				document.write('</OBJECT>');
				
				//alert("32bit");
				document.write('<OBJECT id="rdViewer" classid="clsid:04931AA4-5D13-442f-AEE8-0F1184002BDD"'); //classid 
				document.write('  codebase="/report/cab/cxviewer60u.cab#version=6,3,0,175"'); //������
				document.write('  name="rdViewer" width=100% height=100%>  ');
				document.write('  <PARAM NAME="WinTrust_RevocationCheck" VALUE="FALSE"> ');
				document.write('</OBJECT>');
			}
		} else {

			navigator.plugins.refresh(false);
			
			if(navigator.mimeTypes["application/x-cxviewer60u"]) {

				var _cxPlugin = navigator.mimeTypes["application/x-cxviewer60u"];
				var cxPluginVersion_installed = _cxPlugin.description.substr(_cxPlugin.description.indexOf("version=")+8, 9);

				var cxPluginVersion_setup = "6,3,0,175"; //������
				
				if(checkPluginVersion(cxPluginVersion_installed, cxPluginVersion_setup)) {
					document.write('<OBJECT id="rdViewer" type="application/x-cxviewer60u" width=100% height=100%></OBJECT>');
				} else {
					window.location = "/report/plugin/CX60_Plugin_u_setup.exe"; // plugin ���
				}
			} else {
				window.location = "/report/plugin/CX60_Plugin_u_setup.exe"; // plugin ���
			}
		}
}

function checkPluginVersion(versionInstalled, versionSetup) {

	var arr_versionInstalled = versionInstalled.split(",");
	var arr_versionSetup = versionSetup.split(",");
	
	for(i=0; i<=3; i++) {

		if(Number(arr_versionInstalled[i]) > Number(arr_versionSetup[i])) {  // do not install
			return 1;
			break;
		} else if(Number(arr_versionInstalled[i]) < Number(arr_versionSetup[i])) { // install
			return 0;
			break;
		}
	}
	return 1;
}