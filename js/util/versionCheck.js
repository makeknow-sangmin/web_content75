 // InternetVersion
function getInternetVersion(ver) { 
     var rv = -1; // Return value assumes failure.      
     var ua = navigator.userAgent;  
     var re = null;
     if(ver == "MSIE"){
      re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
     }else{
      re = new RegExp(ver+"/([0-9]{1,}[\.0-9]{0,})");
     }
     if (re.exec(ua) != null){ 
      rv = parseFloat(RegExp.$1);
     } 
     return rv;  
} 
    
//브라우저 종류 및 버전확인  
function browserCheck(){ 
     var ver = 0; // 브라우저  버전정보 
     if(navigator.appName.charAt(0) == "N"){ 
      if(navigator.userAgent.indexOf("Chrome") != -1){
       ver = getInternetVersion("Chrome");
       //alert("Chrome"+ver+"입니다."); 
      }else if(navigator.userAgent.indexOf("Firefox") != -1){
       ver = getInternetVersion("Firefox");
       //alert("Firefox"+ver+"입니다.");
      }else if(navigator.userAgent.indexOf("Safari") != -1){
       ver = getInternetVersion("Safari");
       //alert("Safari"+ver+"입니다.");
      }
     }else if(navigator.appName.charAt(0) == "M"){
      ver = getInternetVersion("MSIE");
      //alert("MSIE"+ver+"입니다.");
     }
     
    return ver;
} 
function consoleCheck()
{
	if(navigator.appName.charAt(0) == "M" ) {
		if(getInternetVersion("MSIE") <  9) {
			return false;
		}
	}
		
    return true;
    
}