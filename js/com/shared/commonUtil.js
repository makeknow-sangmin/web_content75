var COMMON_JS = 'COMMON_JS';

var keyCode = {
		ESC : 27,
		ENTER : 13,
		CAPSLOOK : 20,
		SPACE : 32,
		PAGEUP : 33,
		PAGEDN : 34 ,
		END : 35 ,
		HOME :36 ,
		INSERT : 45,
		DELETE : 46,
		TAB : 9,
		BAKSPACE : 8,
		ARROW_LEFT : 37 ,
		ARROW_UP : 38 ,
		ARROW_RIGHT : 39 ,
		ARROW_DOWN : 40 ,
		NUMLOCK : 144,
		SCROLLLOCK : 145,
		KOR_ENG : 21,
		CHINESE : 25
};

/****************************************************************
*	Function Name:	encodeURL(str)
*	Description:	url encode
*                   Function Equivalent to java.net.URLEncoder.encode(String, "UTF-8")
*   출처 :          Copyright (C) 2002, Cresc Corp.
*                   Version: 1.0
*	Return:			encode된 url 문자열
***************************************************************/
function encodeURL(str){
    var s0, i, s, u;
    s0 = "";
    for (i = 0; i < str.length; i++){
        s = str.charAt(i);
        u = str.charCodeAt(i);
        if (s == " "){s0 += "+";}
        else {
            if ( u == 0x2a || u == 0x2d || u == 0x2e || u == 0x5f ||
                    ((u >= 0x30) && (u <= 0x39)) || ((u >= 0x41) && (u <= 0x5a))
                    || ((u >= 0x61) && (u <= 0x7a))){
                s0 = s0 + s;
            }
            else {                  // escape
                if ((u >= 0x0) && (u <= 0x7f)){     // single byte format
                    s = "0"+u.toString(16);
                    s0 += "%"+ s.substr(s.length-2);
                }
                else if (u > 0x1fffff){     // quaternary byte format (extended)
                    s0 += "%" + (0xf0 + ((u & 0x1c0000) >> 18)).toString(16);
                    s0 += "%" + (0x80 + ((u & 0x3f000) >> 12)).toString(16);
                    s0 += "%" + (0x80 + ((u & 0xfc0) >> 6)).toString(16);
                    s0 += "%" + (0x80 + (u & 0x3f)).toString(16);
                }
                else if (u > 0x7ff){        // triple byte format
                    s0 += "%" + (0xe0 + ((u & 0xf000) >> 12)).toString(16);
                    s0 += "%" + (0x80 + ((u & 0xfc0) >> 6)).toString(16);
                    s0 += "%" + (0x80 + (u & 0x3f)).toString(16);
                }
                else {                      // double byte format
                    s0 += "%" + (0xc0 + ((u & 0x7c0) >> 6)).toString(16);
                    s0 += "%" + (0x80 + (u & 0x3f)).toString(16);
                }
            }
        }
    }
    return s0;
}

/****************************************************************
*	Function Name:	decodeURL(str)
*	Description:	url decode
*                   Function Equivalent to java.net.URLDecoder.decode(String, "UTF-8")
*   출처 :          Copyright (C) 2002, Cresc Corp.
*                   Version: 1.0
*	Return:			decode된 url 문자열
***************************************************************/
function decodeURL(str){
    var s0, i, j, s, ss, u, n, f;
    s0 = "";                // decoded str
    for (i = 0; i < str.length; i++){   // scan the source str
        s = str.charAt(i);
        if (s == "+"){s0 += " ";}       // "+" should be changed to SP
        else {
            if (s != "%"){s0 += s;}     // add an unescaped char
            else{               // escape sequence decoding
                u = 0;          // unicode of the character
                f = 1;          // escape flag, zero means end of this sequence
                while (true) {
                    ss = "";        // local str to parse as int
                    for (j = 0; j < 2; j++ ) {  // get two maximum hex characters for parse
                        sss = str.charAt(++i);
                        if (((sss >= "0") && (sss <= "9")) || ((sss >= "a") && (sss <= "f"))  || ((sss >= "A") && (sss <= "F"))) {
                            ss += sss;      // if hex, add the hex character
                        } else {--i; break;}    // not a hex char., exit the loop
                    }
                    n = parseInt(ss, 16);           // parse the hex str as byte
                    if (n <= 0x7f){u = n; f = 1;}   // single byte format
                    if ((n >= 0xc0) && (n <= 0xdf)){u = n & 0x1f; f = 2;}   // double byte format
                    if ((n >= 0xe0) && (n <= 0xef)){u = n & 0x0f; f = 3;}   // triple byte format
                    if ((n >= 0xf0) && (n <= 0xf7)){u = n & 0x07; f = 4;}   // quaternary byte format (extended)
                    if ((n >= 0x80) && (n <= 0xbf)){u = (u << 6) + (n & 0x3f); --f;}         // not a first, shift and add 6 lower bits
                    if (f <= 1){break;}         // end of the utf byte sequence
                    if (str.charAt(i + 1) == "%"){ i++ ;}                   // test for the next shift byte
                    else {break;}                   // abnormal, format error
                }
                s0 += String.fromCharCode(u);           // add the escaped character
            }
        }
    }
    return s0;
}

/****************************************************************
* Servlet으로 자료를 전송하기 위한 hidden object를 생성하는 함수
* 사용 예)
*     목록에서 특정 자료를 삭제할 경우 삭제된 자료의 id를 servlet으로 보내기 위해
*
* @param    frm         object가 생성될 form 이름
* @param    fldName     생성될 hidden object의 이름
* @param    fldValue    생성될 hidden object의 value값
* @return   없음
***************************************************************/
function addHiddenFld(frm, fldName, fldValue) {
	if ((fldValue == null) || (fldValue == '')) return;

	var delInput = document.createElement("INPUT");
	delInput.type = "hidden";
	delInput.id = fldName+"_Unique_Id";
	delInput.name = fldName;
	delInput.value = fldValue;
	frm.appendChild(delInput);
}


/****************************************************************
* 특정 Table Object의 Row Class를 reset하는 함수
* 사용 예)
*     해당 Table에서 row를 삭제하거나 삽입하는 경우
*
* @param    srcTbl      대상 Table Object or Table Name
* @param    headRows    해당 Table에서 Header에 해당하는 row수
* @param    classType   변경할 row Class type(ex bgListTableRow)
* @return   없음
***************************************************************/
function resetRowClass(srcTbl, headRows, classType) {
    var tbl = null;
    if (tbl == null) return;
    if (headRows == null) headRows = 1;
    if (typeof(srcTbl) != 'object')
        tbl = eval(srcTbl);
    else
        tbl = srcTbl;

    for (var i= headRows; i < tbl.rows.length; i++) {
        tbl.rows[i].className = classType + '0' + (((i+1)%2)+1);
    }
}


/****************************************************************
* 특정 table에서 check된 row를 삭제하는 함수
*  -  servlet에 삭제된 자료의 id를 전송가능(delFldName, oidFldName)
*  -  전체 row가 삭제된 경우 표시되는 message 설정 가능(msg)
* 사용 예)
*     deleteRow('mytbl', 'myform', 'chk', 1, 'bgListTableRow', 'delOid', 'oid', '항목을 추가해 주십시오')
*
* @param    tblName     대상 Table Object or Table Name
* @param    formName    checkbox등의 소속 form
* @param    chkName     checkBox 이름
* @param    headRows    해당 Table에서 Header에 해당하는 row수
* @param    classType   변경할 row Class type(ex bgListTableRow)
* @param    delFldName  삭제시 생성할 Hidden Field의 이름
* @param    oidFldName  해당 자료의 id값이 있는 field의 이름
* @param    msg         모든 자료가 삭제된 경우 표시될 message
* @return   없음
***************************************************************/
var msgRow = true;
function deleteRow(tblName, formName, chkName, headRows, classType, delFldName, oidFldName, msg) {
	var frm = eval(formName);
    var chk = eval(formName + '.' + chkName);
    var tbl = null;
    if (headRows == null) headRows = 1;
    if (typeof(tblName) != 'object')
        tbl = eval("document.all."+tblName);
    else
        tbl = tblName;

	if(typeof(chk)=='undefined') return;
	if(typeof(chk.length)=='undefined') {
		if (chk.checked)  {
		    if ((delFldName != null) && (delFldName != '') && (oidFldName != null) && (oidFldName != ''))
		        addHiddenFld(frm, delFldName,  eval(formName + '.' + oidFldName + '.value'));
			tbl.deleteRow(headRows);
		}
	}
	else {
		for(var i=chk.length-1; i>=0; i--){
			if (chk[i].checked) {
			    if ((delFldName != null) && (delFldName != '') && (oidFldName != null) && (oidFldName != '')) {
			        addHiddenFld(frm, delFldName, eval(formName + '.' + oidFldName + '['+i+'].value'));
            }
				tbl.deleteRow(i+headRows);
			}
		}
	}

	if ((msg != null) && (tbl.rows.length == headRows)) {
	    msgRow = true;
    	var row = tbl.insertRow(headRows);
	    row.className = classType + '01';
  	    var cell = row.insertCell(0);
  	    cell.innerHTML =  msg;
  	    cell.colSpan = tbl.rows[0].cells.length;
	}
    else {
        resetRowClass(tbl, headRows, classType);
    }
}



/****************************************************************
* KeyPress등의 event에서 enter key를 무시하도록 하는 함수
*
***************************************************************/
function ignoreEnter() {
    var eKey = window.event.keyCode;

    if (eKey == "13") {
	    return false;
    }
    return true;
}

/****************************************************************
*	Function Name:	enterKeyPress()
*	Description:	onKeyPress Event에 지정되는 함수로
*                   enter Key가 눌렸을 경우 callbak함수 호출
*	Return:			없음
***************************************************************/
function enterKeyPress(callback) {
	var eKey = window.event.keyCode;
	if (eKey == "13") {			// Enter Key 처리
		if (typeof(callback) == 'function') callback;
	    else {
    		var args = new Array();
    		for(i=1; i<arguments.length; i++) args[i-1] = arguments[i];

	        eval(callback + '(args)');
        }
	    event.returnValue = false;
	}
}


/****************************************************************
* 파일 확장자를 확인하여 해당 Icon Image 경로를 반환한다.
*
* @param   sFileName              파일 이름
* @return  String                 Icon Image 경로
***************************************************************/
function getFileIconPath(sFileName) {
	// 파일 이름의 확장자를 구함
	var sFileExtension = null;
	if (sFileName.indexOf(".") < 0 || sFileName.lastIndexOf(".") + 1 == sFileName.length)
		sFileExtension = "";
	else
		sFileExtension = sFileName.substring(sFileName.lastIndexOf(".") + 1).toLowerCase();

	// 확장자에 해당하는 Icon 경로 반환
	if (sFileExtension == "doc")        return "/icon/iconDoc.gif";
	else if (sFileExtension == "gul")   return "/icon/iconGul.gif";
	else if (sFileExtension == "hwp")   return "/icon/iconHwp.gif";
	else if (sFileExtension == "jpg")   return "/icon/iconPic.gif";
	else if (sFileExtension == "bmp")   return "/icon/iconPic.gif";
	else if (sFileExtension == "gif")   return "/icon/iconPic.gif";
	else if (sFileExtension == "ppt")   return "/icon/iconPpt.gif";
	else if (sFileExtension == "txt")   return "/icon/iconTxt.gif";
	else if (sFileExtension == "xls")   return "/icon/iconXls.gif";
	else if (sFileExtension == "zip")   return "/icon/iconZip.gif";
	else if (sFileExtension == "pdf")   return "/icon/iconPDF.gif";

    return "/bbs/iconEtc.gif";
}


/****************************************************************
* 목록에 있는 checkbok를 모두 check하거나, 모두 clear하는 함수
* 사용 예)
*     var curChk = false; setCheck(testform.chk, curChk ); curChk = !curChk;
*     setCheck(testform.chk);
*
* @param    checkObj    대상 check Object
* @param    check       전체 check할지 clear할지에 대한 flag, 이 값이 없으면 알아서 토글함
* @return   없음
***************************************************************/
var comChk = false;
function setCheck(checkObj, check, stopParent) {

    if (check == null) {
        comChk = !comChk;
        check = comChk;
    }

	if(typeof(checkObj)=='undefined') return;
	if(typeof(checkObj.length)=='undefined') {
		if (checkObj.disabled == false)
			checkObj.checked = check;
	}
	else {
		for(var i=checkObj.length-1; i>=0; i--){
			if ((checkObj[i].disabled == false) && ((stopParent == null) || ! isParentHidden(checkObj[i].parentNode, stopParent)))
				checkObj[i].checked = check;
		}
	}
}
function isParentHidden(curObj, stopParent) {
	if (curObj.style.display == 'none')
		return true;

	if ((curObj != stopParent)  && (curObj.parentNode != null))
		return isParentHidden(curObj.parentNode, stopParent);

	return false;
}


/****************************************************************
* check box 전체가 check 되어 있는지 검사한다.
*
* @param  obj           checkbox object
*
* @return boolean       true : check box 전체가 check되어 있다.
***************************************************************/
function isAllChecked(obj){
    if(obj[0] == null){
        if(obj.checked == false) return false;
    }else{
        for(var i=0; i<obj.length; i++){
            if(obj[i].checked == false) return false;
        }
    }
    return true;
}


/****************************************************************
* check box 중 1개이상  check 되어 있는지 검사한다.
*
* @param  obj           checkbox object
*
* @return boolean       true : check box 중 1개이상 check되어 있다.
***************************************************************/
function isChecked(obj){
    if(typeof(obj)=='undefined') return false;
    else if(obj[0] == null){
        if(obj.checked == true) return true;
    }else{
        for(var i=0; i<obj.length; i++){
            if(obj[i].checked == true) return true;
        }
    }
    return false;
}


/****************************************************************
* radio 의 선택된 값을 가져오는 함수
*
* @param  obj           radio object
*
* @return string        선택된 radio 값
***************************************************************/
function getRadioValue(obj){
    return getArraySelectedObject(obj);
}


/****************************************************************
*	Function Name:	getArraySelectedObject()
*	Description:	체크박스 또는 라디오버튼에서 선택된 값을 리턴
*	Return:			Array
***************************************************************/
function getArraySelectedObject (selectObject) {
	var arrSelectedUser = new Array();

	// 체크박스 또는 라디오버튼 객체가 없는 경우
	if (selectObject == null || typeof(selectObject) == 'undefined')
		return null;

	// 체크박스 또는 라디오버튼 객체가 1개인 경우 문자열로 처리
	if (typeof(selectObject.length) == "undefined") {
		if(selectObject.checked)
			arrSelectedUser[arrSelectedUser.length] = selectObject.value;

		return arrSelectedUser;
	}

	// 체크박스 또는 라디오버튼 객체가 2개 이상인 경우 배열로 처리
	for(i=0; i<selectObject.length; i++) {
		if(selectObject[i].checked)
			arrSelectedUser[arrSelectedUser.length] = selectObject[i].value;
	}

	return arrSelectedUser;
}

/****************************************************************
*	Function Name:	getArrayAllObject()
*	Description:	체크박스 또는 라디오버튼의 모든 값을 리턴
*	Return:			Array
***************************************************************/
function getArrayAllObject(selectObject) {
	var arrSelectedUser = new Array();

	// 체크박스 또는 라디오버튼 객체가 없는 경우
	if (selectObject == null || typeof(selectObject) == 'undefined')
		return null;

	// 체크박스 또는 라디오버튼 객체가 1개인 경우 문자열로 처리
	if (typeof(selectObject.length) == "undefined") {
		arrSelectedUser[arrSelectedUser.length] = selectObject.value;
		return arrSelectedUser;
	}

	// 체크박스 또는 라디오버튼 객체가 2개 이상인 경우 배열로 처리
	for(i=0; i<selectObject.length; i++) {
		arrSelectedUser[arrSelectedUser.length] = selectObject[i].value;
	}

	return arrSelectedUser;
}

/****************************************************************
*	Function Name:	viewToolTipHelp()
*	Description:	toolTip Help를 띄움
*	Return:			없음
***************************************************************/
var tooltipPopup;
function viewToolTipHelp(imgSource, makeHtmlFunc, winWidth, winHeight) {
    var tooltipicon;

    if (typeof(imgSource) == 'object')
	    tooltipicon = imgSource;
    else
        tooltipicon = document.all[imgSource];

    var maxLeft = screen.availWidth - self.screenLeft - winWidth;
	var maxTop = screen.availHeight - self.screenTop - winHeight;

	if (screen.availWidth < self.screenLeft)
		maxLeft = screen.availWidth - (self.screenLeft - screen.availWidth) -  winWidth;
	if (screen.availHeight < self.screenTop)
		maxTop =  screen.availHeight - (self.screenTop - screen.availHeight) -  winHeight;

    var popupXPos = getX(tooltipicon);
    var popupYPos = getY(tooltipicon) + tooltipicon.offsetHeight;
    
	
    if (popupXPos > maxLeft)
        popupXPos = getX(tooltipicon) - winWidth;
    if (popupYPos > maxTop)
        popupYPos = getY(tooltipicon) - winHeight;

    if (tooltipPopup == null)
        tooltipPopup = window.createPopup();
    
	if (window.navigator.appName == "Microsoft Internet Explorer" &&
        window.navigator.appVersion.substring(window.navigator.appVersion.indexOf("MSIE") + 5, window.navigator.appVersion.indexOf("MSIE") + 8) >= 5.5) {
		var funcStr = makeHtmlFunc  +  "(";

        for(var i=4; i<arguments.length; i++)  {
         	if (i>4) funcStr += ",";
        	funcStr += "'" + arguments[i] + "'";
        }
        funcStr += ")";
        try {
        	tooltipPopup.document.body.innerHTML = eval(funcStr);
        } catch(e) {
        	//alert(e);
        }
        
        
		var oLink = tooltipPopup.document.createElement("<link rel='stylesheet' type='text/css' href='/Common.css'>");
		tooltipPopup.document.body.appendChild(oLink);
		tooltipPopup.show(popupXPos, popupYPos, winWidth, winHeight, document.body);
	}
}

/****************************************************************
*	Function Name:	hideToolTipHelp()
*	Description:	toolTip Help를 숨김
*	Return:			없음
***************************************************************/
function hideToolTipHelp() {
	tooltipPopup.hide();
}


/****************************************************************
* Object의 X 좌료를 얻어온다.
*
* @param    obj         대상 Object
* @return   없음
***************************************************************/
function getX(obj)
{
  var x = ( obj.offsetParent==null ? obj.offsetLeft - document.body.scrollLeft  : obj.offsetLeft+getX(obj.offsetParent) );
  if(isNaN(x)) x = 0;
  return x;
}


/****************************************************************
* Object의 Y 좌료를 얻어온다.
*
* @param    obj         대상 Object
* @return   없음
***************************************************************/
function getY(obj)
{
  var y = ( obj.offsetParent==null ? obj.offsetTop - document.body.scrollTop : obj.offsetTop+getY(obj.offsetParent) );
  if(isNaN(y)) y = 0;
  return y;
}

/****************************************************************
*	Function Name:	resizeWindow()
*	Description:	Popup 혹은 frame의 size를 content크기에 맞게 resize한다.
*	Return:			없음
***************************************************************/
function resizeWindow(targetWnd, minWidth, minHeight) {
   	if (targetWnd == null)
   		targetWnd = self;


   	var width = 0;
   	var height = 0;

	var oBody=targetWnd.document.body;
    width  = oBody.scrollWidth+oBody.offsetWidth-oBody.clientWidth;
    height = oBody.scrollHeight+oBody.offsetHeight-oBody.clientHeight;

    if (height == 0) return;		// visible하지 않은경우 height가 0임

    if (targetWnd.opener != null) {		// popup일 경우
	    if (oBody.style.margin == '') {
	    	var IEVersion = getIeVersion();
	    	width += 10;
	    	var deltaY = 34;
	    	switch (IEVersion) {
		    	case 6 : deltaY = 34;
		    	case 7 : deltaY = 78;
		    	case 8 : deltaY = 38;
	    	}
	    	height += deltaY;
	    }
	    else {
	    	width += oBody.style.marginLeft + oBody.style.marginRight;
	    	height += oBody.style.marginTop + oBody.style.marginBottom;
		}
		if (width > screen.availWidth)    width = screen.availWidth;
		if (height > screen.availHeight)  height = screen.availHeight;

		if (minWidth && minWidth>width) width = minWidth;
		if (minHeight && minHeight>height) height = minHeight;
		
		targetWnd.resizeTo(width, height);
	}
	else if (targetWnd.frameElement != null) {		// IFRAME, FRAME
		if (targetWnd.frameElement.height != '100%') {
			targetWnd.frameElement.height = height;
		}
		if (targetWnd.frameElement.width != '100%') {
			targetWnd.frameElement.width = width;
		}
	}
}

/****************************************************************
* Tab을 이동한다.(모든 tab의 content를 동일 document에서 구성한 경우)
* 본 Function을 사용하기 위해서는 <div> ID를 준수해야 한다.
*
* @param    tabNumber   활성화 시킬 tab 번호
* @param    maxNumber   tab의 총 개수
* @return   없음
***************************************************************/
function tabControl(tabNumber, maxNumber){
	for(i=0; i<maxNumber; i++){
		if(i == tabNumber){
			eval('TabOn'+i).style.display = 'block';
			eval('TabOff'+i).style.display = 'none';
			eval('TabContents'+i).style.display = 'block';
		}else{
			eval('TabOn'+i).style.display = 'none';
			eval('TabOff'+i).style.display = 'block';
			eval('TabContents'+i).style.display = 'none';
		}
	}
}

/****************************************************************
* Tab을 이동한다.(tab의 Content를 url로 교체하는경우)
* 본 Function을 사용하기 위해서는 <div> ID를 준수해야 한다.
*
* @param    tabNumber   활성화 시킬 tab 번호
* @param    maxNumber   tab의 총 개수
* @param    contentUrl  tab의 content를 구성하는 url
* @return   없음
***************************************************************/
function tabControlUrl(tabNumber, maxNumber, contentUrl){
	for(i=0; i<maxNumber; i++){
		if(i == tabNumber){
			eval('TabOn'+i).style.display = 'block';
			eval('TabOff'+i).style.display = 'none';
			document.all.TabContentInfo.src = contentUrl;
		}else{
			eval('TabOn'+i).style.display = 'none';
			eval('TabOff'+i).style.display = 'block';
		}
	}
}


/****************************************************************
* Select에 Option 값을 생성하는 함수
*
* @param selObj         대상 Select Object
* @param selNameArr 	Select Option에 표시되는 문자열 배열
* @param selValArr 	    Select Option의 Value값 문자열 배열
* @param hasTotal 	    Option에 '전체' 를 넣을지 여부
* @return               없음
***************************************************************/

function makeSelectValues(selObj, selNameArr,selValArr, hasTotal) {
    if (hasTotal == null) hasTotal = false;
    var start = (hasTotal) ? 1 : 0;

	selObj.length = selNameArr.length + start;
	if (hasTotal) {
    	optionObj = new Option("전체","");
    	selObj.options[0] = optionObj;
    }

	for(i=0; i<selNameArr.length; i++) {
		optionObj = new Option(selNameArr[i],selValArr[i]);
		selObj.options[i+start] = optionObj;
	}
}


/****************************************************************
*	Function Name:	clearSelectBox(oSelectBox)
*	Description:	SelectBox의 Option을 초기화 하는 함수
*   
*	Return:			없음
***************************************************************/
function clearSelectBox(oSelectBox){
	for(a=oSelectBox.length-1;a>=0;a--) {
		oSelectBox.remove(a);
	}
}



/****************************************************************
* EI의 버전을 리턴한다.
*
* @return   없음
***************************************************************/
function getIeVersion() {
	if (isIE() == false) return 0;
	
	var appVersion = ''; 
	var iMsieStx = '';
			
	try {
		appVersion = window.navigator.appVersion;
		iMsieStx = appVersion.indexOf("MSIE");
	} catch(e) {
		//alert('in getIeVersion, '+ e);
	}
	appVersion = appVersion.substring(iMsieStx + 5, iMsieStx + 8);
	//alert('appVersion is '+ appVersion);
	return Number(appVersion);
}
function isIE() {
	var appName = '';
	try {
		appName = window.navigator.appName;
	} catch(e) {
		//alert('in isIE, '+ e);
	}
	//alert('appName is '+ appName);
	return (appName == "Microsoft Internet Explorer")
}


/****************************************************************
* 화면을 종료한다.
*
* @param    url         종료후 이동할 url(default :"/Windchill/ext/cpcex/common/jsp/worklist.jsp")
* @param    confirmMsg  종료여부를 다시 확인할 경우 message 내용
* @return   없음
***************************************************************/
function closeWin(url, confirmMsg){
    if (confirmMsg != null) {
        if(! confirm(confirmMsg)) return;
    }

	if (url==null || url=='') url="/Windchill/ext/cpcex/common/jsp/worklist.jsp";
	if(String(opener)=="undefined"){
		self.location = url;
	}else{
		self.close();
	}
}

/****************************************************************
* 화면을 종료한다.
*
* @param    confirmMsg  종료여부를 다시 확인할 경우 message 내용
* @param    toGo        종료후 이동할 history
* @return   없음
***************************************************************/
function closeBack(confirmMsg, toGo){
    if (confirmMsg != null) {
        if(! confirm(confirmMsg)) return;
    }

    if (toGo == null) toGo = '-1';
	if(String(opener)=="undefined"){
		history.go(toGo);
	}else{
		self.close();
	}
}

/****************************************************************
* Popup(child)화면의 정보를 Opener(parent)에 입력
*
* @param    formName  	폼이름
* @param    fieldName  	input 필드명
* @param    fieldValue	input 필드값
* @return   없음
***************************************************************/
function appendChildObject(formName, fieldName, fieldValue) {
	addHiddenFld(eval(formName), fieldName, fieldValue);
}

function replaceOrAppendChildObject(formName, fieldName, fieldValue){
	var tempObj = document.getElementById(fieldName+"_Unique_Id");
	if(tempObj != null){
		document.getElementById(fieldName+"_Unique_Id").value = fieldValue;
	}else{
		appendChildObject(formName, fieldName, fieldValue);
	}
}



/****************************************************************
* Window Popup, Tool Tip, Div Popup 통합 function
*
* @param    source  	표시하고자 하는 URL (필수) 또는 크기와 위치를 가지고 있는 Object
* @param    wndName  	Window 이름
* @param    wndProp	    window를 띄우는 속성값(default:width=600, height=500, scrollbars=yes, resizable=yes, draggable=true, className=name)
* @param    formName    POST방식으로 파라메타 전송시 사용될 formName
* @param    paramObj    POST방식으로 파라메타 전송시 사용될 parameter 리스트
* @param    contentType 'html'(html에서 팝업을 호출하는 경우) , 'flex'(Flex에서 팝업을 호출하는경우)
* @return   mode		'WIN-POPUP', 'TOOL-TIP', 'DIV-POPUP'
* 수정 내역
* VERSION-01 : 2010-02-05 한제호(jeho.han) TOOL_TIP의 경우 Height를 auto로 설정한 경우 자동으로 높이를 계산한다. ex)wndProp -> width:600, height:auto 
***************************************************************/
var divLayoutPopupNames = new Array(); 
function showWindow(source, wndName, wndProp, mode , contentType) {
	var smwnd = null;
	
	if(contentType == null || contentType == "undefined") {
		contentType = "html";
	}
	// CSS
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	
	var width  = '';
	var height = '';
	var left  = '';
	var top = '';
	var className = '';

	var makeHtmlFunc = '';
	var popupType = '';
	
	if (wndProp != null && wndProp != "") {
		var props = wndProp.split(',');
		for (var i=0; i < props.length; i++) {
			var prop = props[i].split('=');
			var propName = prop[0];
			var propValue = prop[1];
	
			propName = propName.replace(' ','');
			propValue = propValue.replace(' ','');

			if (propName == 'width') {
				width = propValue;
			} else if (propName == 'height') {
				height = propValue;
			} else if (propName == 'left') {
				left = propValue;
			} else if (propName == 'top') {
				top = propValue;
			} else if (propName == 'makeHtmlFunc') {
				makeHtmlFunc = propValue;
			} else if(propName == 'className') {
				className = propValue;
			}
			
		}

	}
	
	// contentType에 따라서 팝업에서 데이터 return시 분기
	if(mode != "TOOL-TIP") {
		if (source.indexOf("?") == -1) {
			source += "?contentType=" + contentType;
		} else {
			source += "&contentType=" + contentType;
		}
	}
	if (mode != null && mode == "DIV-POPUP") {
		showDivLayoutPopup(source, wndName, wndProp);
		
	} else if (mode != null && mode == "WIN-POPUP") {
		smwnd = popupInfoWnd(source, wndName, wndProp);
		
	} else if (mode != null && mode == "TOOL-TIP") {
		showToolTip(source, left, top, width, height, className);
		
	} else if(mode != null && mode == "DIV-POPUP-TOOL-TIP"){
		showDivToolLayoutPopup(source, wndName, wndProp);
		
	} else if(mode != null && mode == "USER-INFO"){
		showDivLayoutPopupUserInfo(source, wndName, wndProp);
		
	}
	
	/*else if(mode != null && (mode == "DIV-POPUP-POST" || mode == "WIN-POPUP-POST")){	
		// 공통 form 생성
		var formObj = eval("document." + formName);
		if(formObj == null || formObj == 'undefined') {
			document.appendChild(document.createElement("<form name='"+formName+"' method='post'></form>"));
			formObj = eval("document." + formName);
		} else {
			formObj.innerHTML = "";
		}
		
		// 해당 form에 element생성
		for(var iParam = 0 ; iParam < paramObj.length ; iParam++) {
			gfn_createPostElement(formObj,paramObj[iParam].key,paramObj[iParam].value);
		}
		
		if(mode != null && mode == "DIV-POPUP-POST") {
			showDivLayoutPopup("", wndName, wndProp);
			with(formObj) { 
				action = contextPath + source;
				target = "workplaceDivLayoutPopup"+ wndName;
				submit();
			}
	    } else if (mode != null && mode == "WIN-POPUP-POST") {
	    	popupInfoWnd("", wndName, wndProp);
	    	with(formObj) {
				action = contextPath + source;
				target = wndName;
				submit();
			}
	    }
	}*/
	
	return smwnd;
}
/****************************************************************
* 해당 Object의 Left Top 구하기
*
* @author   한제호(jeho.han)
* @param    oObj  오브젝트
* @return   x  Left
* @return   y  top
***************************************************************/
function gfn_getElementPos(oObj){
    var objChk = oObj;
    var iLeft  = 0;
    var iTop   = 0;
    while((objChk.tagName !== "HTML") && ( objChk.tagName != "BODY")){
    	iLeft  +=  objChk.offsetLeft;
        iTop   +=  objChk.offsetTop - objChk.scrollTop;
        objChk  =  objChk.offsetParent;
    }
    return {x:iLeft, y:iTop};
}

/****************************************************************
* input hidden 타입 동적 생성 function
*
* @author   한제호(jeho.han)
* @param    formObj  	form오프젝트
* @param    typeIdName  아이디명
* @param    typeValue	아이디 값
***************************************************************/	
function gfn_createPostElement(formObj,typeIdName,typeValue) {
	  if(formObj.item(typeIdName) == null || formObj.item(typeIdName) == 'undefined') {	
	    var inputBox	= document.createElement("input");
	    inputBox.type	= "hidden";
	    inputBox.id	    = typeIdName;
	    inputBox.name	= typeIdName;
	    inputBox.value  = typeValue;
	    formObj.appendChild(inputBox);
	  } else {
		  formObj.item(typeIdName).value = typeValue;
	  }
	  return true;
}


/****************************************************************
 * function showWindow 사용 권고
 * 
 * Div Popup
***************************************************************/
function showDivLayoutPopup(url, wndName, wndProp) {	

	// 중복창 방지
	var divLayoutPopupNamesLength = divLayoutPopupNames.length;
	for(var i=0; i < divLayoutPopupNamesLength; i++) {
		if(wndName == divLayoutPopupNames[i]) {
			return wndName;
		}
		
	}
	divLayoutPopupNames[divLayoutPopupNamesLength] = wndName;


	// CSS
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
		
	var width  = '';
	var height = '';
	var left  = '';
	var top = '';
	var zIndex =10;

	var draggable = '';
	
	if (wndProp != null && wndProp != "") {
		var props = wndProp.split(',');
		for (var i=0; i < props.length; i++) {
			var prop = props[i].split('=');
			var propName = prop[0];
			var propValue = prop[1];
	
			propName = propName.replace(' ','');
			propValue = propValue.replace(' ','');

			if (propName == 'width') {
				width = propValue;
			} else if (propName == 'height') {
				height = propValue;
			} else if (propName == 'left') {
				left = propValue;
			} else if (propName == 'top') {
				top = propValue;
			}  else if (propName == 'draggable') {
				draggable = propValue;
			}else if(propName == 'z-index'){
				zIndex = propValue;
			}
			
		}

	}
	// left, top 이 인수로 넘어오지 않았을 경우
	if (left == '') {
		left = windowWidth/2-width/2 ;
	} 
	if (top == '') {
		top = windowHeight/2-height/2;
	}


	var divLayoutPopupContents
	// 동적 생성
	

	if ($.browser.msie && ($.browser.version == 6.0)){
		divLayoutPopupContents  =   '<div id="divLayoutPopupContents'+ wndName +'" class="panel-content"> '
									+   '   <iframe src="about:blank" mce_src="about:blank" scrolling="no" frameborder="0" style="position:absolute;width:100%;height:100%;filter:alpha(opacity=0);border:none;display:block"> </iframe>'
							        ;
		//IE6의 경우 비어진 iframe 을 하나더 만들어 주어 콤보박스들과 안겹쳐 지도록 하게 한다.
	}else{
		divLayoutPopupContents  =   '<div id="divLayoutPopupContents'+ wndName +'" class="panel-content"> '
	}
	
	
	//+ 	'		<div id="ComponentHandler'+ wndName +'" class="tools" > '
	//+	'		</div> '
	divLayoutPopupContents  +=   '	<div id="divSubLayoutPopupContents'+ wndName +'" style="position:absolute;z-Index:2"> '
							    + 	'		<iframe '
								+	'				id="workplaceDivLayoutPopup'+ wndName +'" '
								+	'				name="workplaceDivLayoutPopup'+ wndName +'" '
								+	'				frameborder="0" '
								+	'				scrolling="no" '
								+	'				src="'+ url +'"> '
								+	'		</iframe> '
							    +   '	</div> '
							    +   '</div> '
							    ;
	
	// jQuery
	$('body').append(divLayoutPopupContents);
	$('#divLayoutPopupContents'+ wndName).removeClass('hideDivPopup');
	//$('#divLayoutPopupContents'+ wndName).addClass('showDivPopup');


	$('#divLayoutPopupContents'+ wndName).css("width",width);
	$('#divLayoutPopupContents'+ wndName).css("height",height);
	//$('#divLayoutPopupContentsIframe'+ wndName).css("width",parseInt(width)+4);
	//$('#divLayoutPopupContentsIframe'+ wndName).css("height",parseInt(height)+4);
	$('#divLayoutPopupContents'+ wndName).css("left",left);
	$('#divLayoutPopupContents'+ wndName).css("top",top);
	
	$('#workplaceDivLayoutPopup'+ wndName).css("width",width);
	//$('#workplaceDivLayoutPopup'+ wndName).css("height",height-$('#ComponentHandler'+ wndName).attr("offsetHeight"));
	$('#workplaceDivLayoutPopup'+ wndName).css("height",height);
	
	$('#divLayoutPopupContents'+ wndName).css("z-index",zIndex);
	$('#divLayoutPopupContents'+ wndName).css("position","absolute");
	$('#divLayoutPopupContents'+ wndName).css("visibility","visible");
	//$('#divSubLayoutPopupContents'+ wndName).css("border","2px solid gray");

	if(draggable == null || draggable == '' || draggable == 'false' || !draggable) {
		// Do nothing..!!
		
	} else {
		$('#divLayoutPopupContents'+ wndName).draggable({handle: '#ComponentHandler'+ wndName, iframeFix: true});

	}
	
	return wndName;
}

function IHideDivLayoutPopup(wndName) {
	
	var divLayoutPopupNamesLength = divLayoutPopupNames.length;
	for(var i=0; i < divLayoutPopupNamesLength; i++) {
		if(wndName == divLayoutPopupNames[i]) {
			divLayoutPopupNames[i] = '';

			//$('#divLayoutPopupContents'+ wndName).removeClass('showDivPopup');
			//$('#divLayoutPopupContents'+ wndName).addClass('hideDivPopup');
			
			$('#divLayoutPopupContents'+ wndName).attr("outerHTML","");
			
			// CSS
			$('#divLayoutPopupContents'+ wndName).css("top","0px");
			$('#divLayoutPopupContents'+ wndName).css("left","0px");
			$('#divLayoutPopupContents'+ wndName).css("width","0px");
			$('#divLayoutPopupContents'+ wndName).css("height","0px");

			$('#divLayoutPopupContents'+ wndName).css("position","absolute");
			$('#divLayoutPopupContents'+ wndName).css("z-index","1");
			$('#divLayoutPopupContents'+ wndName).css("visibility","hidden");

			
		}		
	}
	
	// modal div popup 테스트 위한 임시 데이터. 
	// 테스트 후 삭제 예정.
	$('#iFrameOverlay').hide();
	
}

function showDivToolLayoutPopup(url, wndName, wndProp) {	

	// 중복창 방지
	var divLayoutPopupNamesLength = divLayoutPopupNames.length;
	for(var i=0; i < divLayoutPopupNamesLength; i++) {
		if(wndName == divLayoutPopupNames[i]) {
			return wndName;
		}
		
	}
	divLayoutPopupNames[divLayoutPopupNamesLength] = wndName;


	// CSS
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
		
	var width  = '';
	var height = '';
	var left  = '';
	var top = '';

	var draggable = '';
	
	if (wndProp != null && wndProp != "") {
		var props = wndProp.split(',');
		for (var i=0; i < props.length; i++) {
			var prop = props[i].split('=');
			var propName = prop[0];
			var propValue = prop[1];
	
			propName = propName.replace(' ','');
			propValue = propValue.replace(' ','');

			if (propName == 'width') {
				width = propValue;
			} else if (propName == 'height') {
				height = propValue;
			} else if (propName == 'left') {
				left = propValue;
			} else if (propName == 'top') {
				top = propValue;
			}  else if (propName == 'draggable') {
				draggable = propValue;
			}
			
		}

	}
	// left, top 이 인수로 넘어오지 않았을 경우
	if (left == '') {
		left = windowWidth/2-width/2 ;
	} 
	if (top == '') {
		top = windowHeight/2-height/2;
	}


		
	// 동적 생성
	var divToolTipLayoutPopupContents  =   '<div id="divToolTipLayoutPopupContents'+ wndName +'" class="panel-content"> '
									   +   '	<iframe id="divToolTipLayoutPopupContentsIframe'+ wndName +'" frameboder="0" scrolling="no" style="position:absolute;z-Index:1"></iframe> '
									   +   '	<div id="divSubToolTipLayoutPopupContents'+ wndName +'" style="position:absolute;z-Index:2"> '
		                               +   '		<iframe '
									   +   '				id="workplaceDivToolTipLayoutPopup'+ wndName +'" '
									   +   '				name="workplaceDivToolTipLayoutPopup'+ wndName +'" '
									   +   '				frameborder="0" '
									   +   '				scrolling="auto" '
									   +   '				src="'+ url +'"> '
									   +   ' 		</iframe> '
		                               +   '	</div> '
		                               +   '</div> '
			                            ;

	// jQuery
	$('body').append(divToolTipLayoutPopupContents);
	$('#divToolTipLayoutPopupContents'+ wndName).removeClass('hideDivPopup');


	$('#divToolTipLayoutPopupContents'+ wndName).css("width",width);
	$('#divToolTipLayoutPopupContents'+ wndName).css("height",height);
	$('#divToolTipLayoutPopupContentsIframe'+ wndName).css("width",parseInt(width)+4);
	$('#divToolTipLayoutPopupContentsIframe'+ wndName).css("height",parseInt(height)+4);
	$('#divToolTipLayoutPopupContents'+ wndName).css("left",left);
	$('#divToolTipLayoutPopupContents'+ wndName).css("top",top);
	
	$('#workplaceDivToolTipLayoutPopup'+ wndName).css("width",width);
	$('#workplaceDivToolTipLayoutPopup'+ wndName).css("height",height);
	
	$('#divToolTipLayoutPopupContents'+ wndName).css("z-index",3);
	$('#divToolTipLayoutPopupContents'+ wndName).css("position","absolute");
	$('#divToolTipLayoutPopupContents'+ wndName).css("visibility","visible");
	$('#divSubToolTipLayoutPopupContents'+ wndName).css("border","2px solid gray");
	return wndName;
}

function IHideDivToolTipLayoutPopup(wndName) {
	
	var divLayoutPopupNamesLength = divLayoutPopupNames.length;
	for(var i=0; i < divLayoutPopupNamesLength; i++) {
		if(wndName == divLayoutPopupNames[i]) {
			divLayoutPopupNames[i] = '';
			
			$('#divToolTipLayoutPopupContents'+ wndName).attr("outerHTML","");
			
			// CSS
			$('#divToolTipLayoutPopupContents'+ wndName).css("top","0px");
			$('#divToolTipLayoutPopupContents'+ wndName).css("left","0px");
			$('#divToolTipLayoutPopupContents'+ wndName).css("width","0px");
			$('#divToolTipLayoutPopupContents'+ wndName).css("height","0px");

			$('#divToolTipLayoutPopupContents'+ wndName).css("position","absolute");
			$('#divToolTipLayoutPopupContents'+ wndName).css("z-index","1");
			$('#divToolTipLayoutPopupContents'+ wndName).css("visibility","hidden");

			
		}		
	}	
}

var divLayoutPopupUserInfoNames = new Array(); 
function showDivLayoutPopupUserInfo(url, wndName, wndProp) {	

	// 이미 떠있는 DIV 창 닫기
	hideDivLayoutPopupUserInfo();
	
	
	//  DIV 창 이름 등록
	var divLayoutPopupUserInfoNamesLength = divLayoutPopupUserInfoNames.length;
	for(var i=0; i < divLayoutPopupUserInfoNamesLength; i++) {
		if(wndName == divLayoutPopupUserInfoNames[i]) {
			//return wndName;
		}
		
	}
	divLayoutPopupUserInfoNames[divLayoutPopupUserInfoNamesLength] = wndName;


	// CSS
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
		
	var width  = '';
	var height = '';
	var left  = '';
	var top = '';
	var zIndex=10;

	var draggable = 'true';
	
	if (wndProp != null && wndProp != "") {
		var props = wndProp.split(',');
		for (var i=0; i < props.length; i++) {
			var prop = props[i].split('=');
			var propName = prop[0];
			var propValue = prop[1];
	
			propName = propName.replace(' ','');
			propValue = propValue.replace(' ','');

			if (propName == 'width') {
				width = propValue;
			} else if (propName == 'height') {
				height = propValue;
			} else if (propName == 'left') {
				left = propValue;
			} else if (propName == 'top') {
				top = propValue;
			}  else if (propName == 'draggable') {
				draggable = propValue;
			} else if(propName == 'z-index'){
				zIndex = propValue;
			}
			
		}

	}
	// left, top 이 인수로 넘어오지 않았을 경우
	if (left == '') {
		left = windowWidth/2-width/2 ;
	} 
	if (top == '') {
		top = windowHeight/2-height/2;
	}

	
	// 동적 생성
	var divToolTipLayoutPopupContents  =   '<div id="divLayoutPopupContentsUserInfo'+ wndName +'" class="tooltip"  style="position:absolute;width:520px;">'
									   +   '   <iframe src="about:blank" scrolling="no" frameborder="0" style="position:absolute;width:520px;height:178px;top:0;left:0;padding:0;filter:alpha(opacity=0);border:none;display:block;z-index:-1;"> </iframe>'
									   +   '	<div class="cont" style="with:490px;">'
									   +   '		<div id="ComponentHandler'+ wndName +'" class="assist" style="with:490px;">'
									   +   '			<div class="headArea" style="with:490px;"><h2>' + Message.userInfo + '</h2></div>'
									   +   '			<iframe name="" src="'+ url +'" width="100%" height="110px" frameborder="0" style="width:490px;"></iframe>'
									   +   '			<div class="popBtn fright"><span><a href="#" onclick="javasciprt:hideDivLayoutPopupUserInfo(this);return false;">' + Message.close + '</a></span></div>'		
									   +   '		</div>'
									   +   '	</div>'
									   +   '	<div class="tooltipBtm">'
									   +   '		<div class="lb"></div>'
									   +   '	</div>'
									   +   '</div>'
							           ;	   
	
	$('body').append(divToolTipLayoutPopupContents);
	
	$('#divLayoutPopupContentsUserInfo'+ wndName).css("z-index",zIndex);
	$('#divLayoutPopupContentsUserInfo'+ wndName).css("left",left);
	$('#divLayoutPopupContentsUserInfo'+ wndName).css("top",top);
	
	if(draggable == null || draggable == '' || draggable == 'false' || !draggable) {
		// Do nothing..!!
		
	} else {
		//$('#divLayoutPopupContentsUserInfo'+ wndName).draggable({handle: '#ComponentHandler'+ wndName, iframeFix: true});

	}	
	return wndName;
}

function hideDivLayoutPopupUserInfo(obj) {
	var divLayoutPopupUserInfoNamesLength = divLayoutPopupUserInfoNames.length;
	for(var i=0; i < divLayoutPopupUserInfoNamesLength; i++) {
		var wndName = divLayoutPopupUserInfoNames[i];
		divLayoutPopupUserInfoNames[i] = '';
		
		$('#divLayoutPopupContentsUserInfo'+ wndName).attr("outerHTML","");
		
		// CSS
		$('#divLayoutPopupContentsUserInfo'+ wndName).css("top","0px");
		$('#divLayoutPopupContentsUserInfo'+ wndName).css("left","0px");
		$('#divLayoutPopupContentsUserInfo'+ wndName).css("width","0px");
		$('#divLayoutPopupContentsUserInfo'+ wndName).css("height","0px");

		$('#divLayoutPopupContentsUserInfo'+ wndName).css("position","absolute");
		$('#divLayoutPopupContentsUserInfo'+ wndName).css("z-index","1");
		$('#divLayoutPopupContentsUserInfo'+ wndName).css("visibility","hidden");

	}
	
	
}

/****************************************************************
 * function showWindow 사용 권고
 * 
 * Tool Tip
 * function showWindow 사용 권고
***************************************************************/
var flag = false;
function showToolTip(source, left, top, width, height, className){   
   	if (tooltipPopup == null){
        
   		tooltipPopup = window.createPopup();
        tooltipPopup.document.createStyleSheet(contextPath + '/ui/css/plm.core.css');
   	}
   	var  oPopBody  =  tooltipPopup.document.body;   

   	if(className != null && className != "" && className != undefined) {
   		oPopBody.className = className;
   	} else {
   		oPopBody.style.backgroundColor  =  "white";   
   	    oPopBody.style.border  =  "solid  #dddddd 1px"; 
   	}
   	
    oPopBody.innerHTML  = source;  
    // 높이 자동 계산 로직 추가
    if(height == "auto") {
    	
//    	var tempWidth;
        tooltipPopup.show(0, 0, 300, 0); // 높이 계산을 위해 높이를 0 으로 해서 띄운다 - 안보임
        height = oPopBody.scrollHeight; // 높이 자동 계산
        tooltipPopup.hide(); // 높이 계산 후 숨김
        tooltipPopup.show(0, 0, 0, height); // 넓이 계산을 위해 넓이를 0 으로 해서 띄운다 - 안보임
        tempWidth = oPopBody.scrollWidth;
        tooltipPopup.hide(); // 넓이 계산 후 숨김
        
        if ((!flag)&&(className == "ddmultisel-optlist")){ 
        	//운영서버 화면 깨짐 때문에 주석처리
        	//height -= 12;
        	if (height == 207){
        		height -= 7;
        	}
        	flag = true;
        }
        if ((!flag)&&(className == "requestSearchToolTip")){
        	height += 15;
        	flag = true;
        }
    }
    tooltipPopup.show(left,  top,  width,  height,  document.body);
}  

/****************************************************************
*	Function Name:	hideToolTipHelp()
*	Description:	toolTip Help를 숨김
*	Return:			없음
***************************************************************/
function hideToolTip() {
	tooltipPopup.hide();
}

/****************************************************************
 * * function showWindow 사용 권고
 * 
 * 특정 URL을 popup으로 띄우는 함수
 *
 * @param sUrl      	    표시하고자 하는 URL (필수)
 * @param width   	    가로 폭 (default : Screen 폭 /2)
 * @param height  	    높이 (default : Screen 높이 /2)
 * @param wndName 	    Window 이름
 * @param scroll         scroll 여부 (default : no)
 * @param resize         resize 여부 (default : yes)
 * @param x              popup window의 x위치
 * @param y              popup window의 y위치
 * @param toolbar        toolbar 표시 여부 (default : no)
 * @return               생성된 window object
***************************************************************/
function openPopupWnd(sUrl,width,height,wndName, scroll, resize, x, y, toolbar) {

	var newWin;

	// Default 설정
	if (!wndName)  wndName = '';
	if(!width)	width = screen.availWidth / 2;
	if(!height)	height = screen.availHeight / 2;
	if(!x)	x = (screen.availWidth - width ) / 2;
	if(!y)	y = (screen.availHeight - height) / 2;
	if(!scroll)	scroll = 'no';
	if(resize==null)resize = 'yes';
	if(!resize)	resize = 'no';
	if(!toolbar) toolbar = 'no';

	sUrl = makePopUpUrl(sUrl);

	if(opener=="undefined"){
		newWin = top.open(sUrl, wndName,
			"left="+x+",top="+y+",width="+width+",height="+height+",scrollbars="+scroll+",resizable="+resize+",toolbar="+toolbar+",status=no,menubar=no");
		focusWnd(newWin);
	}else{
		newWin =  window.open(sUrl, wndName,
	 		"left="+x+",top="+y+",width="+width+",height="+height+",scrollbars="+scroll+",resizable="+resize+",toolbar="+toolbar+ ",status=no,menubar=no");
		focusWnd(newWin);
	}

	return newWin;
}

/****************************************************************
 * function showWindow 사용 권고
 * 
 * 특정 URL을 popup으로 띄우는 함수
 *
 * @param url      	    표시하고자 하는 URL (필수)
 * @param width   	    가로 폭 (default : Screen 폭 /2)
 * @param height  	    높이 (default : Screen 높이 /2)
 * @param wndName 	    Window 이름
 * @param scroll         scroll 여부 (default : no)
 * @param resize         resize 여부 (default : no)
 * @param x              popup window의 x위치
 * @param y              popup window의 y위치
 * @param toolbar        toolbar 표시 여부 (default : no)
 * @return               없음
***************************************************************/
function openPopup(url,width,height,wndName, scroll, resize, x, y, toolbar) {

    var newWid = openPopupWnd(url,width,height,wndName, scroll, resize, x, y, toolbar);

	if (newWid != null && newWid.opener == null)
	{
		newWid.opener = self
	}
}

/****************************************************************
 * function showWindow 사용 권고
 * 
 * 특정 URL을 popup으로 띄우는 함수 (scroll=no, resize=yes)
 *
 * @param url      	    표시하고자 하는 URL (필수)
 * @param width   	    가로 폭 (default : Screen 폭 /2)
 * @param height  	    높이 (default : Screen 높이 /2)
 * @param wndName 	    Window 이름
 * @return               없음
***************************************************************/
function openPopupResize(url,width,height,wndName) {
    openPopup(url,width,height,wndName, 'no', 'yes');
}

/****************************************************************
 * function showWindow 사용 권고
 * 
 * 특정 URL을 popup으로 띄우는 함수 (scroll=yes, resize=yes)
 *
 * @param url      	    표시하고자 하는 URL (필수)
 * @param width   	    가로 폭 (default : Screen 폭 /2)
 * @param height  	    높이 (default : Screen 높이 /2)
 * @param wndName 	    Window 이름
 * @return               없음
***************************************************************/
function openPopupScroll(url,width,height,wndName) {
    openPopup(url,width,height,wndName, 'yes', 'yes');
}


/****************************************************************
 * function showWindow 사용 권고
 * 
 * 특정 URL을 popup으로 띄우는 함수 (property 문자열을 받아서 띄우며, 위치는 화면중앙)
 *
 * @param actionUrl      표시하고자 하는 URL (필수)
 * @param wndName 	    Window 이름
 * @param wndProp 	    window를 띄우는 속성값(default:width=600, height=500, scrollbars=yes, resizable=yes)
 * @return               없음
***************************************************************/
function popupInfoWnd(actionUrl, wndName, wndProp) {
	if (wndProp == null || wndProp == "")
		wndProp = "width=600, height=500, scrollbars=yes, resizable=yes";

	var width = '';
	var height = '';
	var top = '';
	var left = '';
	var title = '';
	var resizable ='';

	var props = wndProp.split(',');
	for (var i=0; i < props.length; i++) {
		var prop = props[i].split('=');
		var propName = prop[0];
		var propValue = prop[1];

		propName = propName.replace(' ','');
		propValue = propValue.replace(' ','');

		if (propName == 'width') {
			width = propValue;
		} else if (propName == 'height') {
			height = propValue;
		} else if (propName == 'top') {
			top = propValue;
		} else if (propName == 'left') {
			left = propValue;
		}else if (propName == 'resizable') {
			resizable = propValue;
		}
	}

	if (width == '') {
		width = '600';
		wndProp += ',width='+width;
	}

	if (height == '') {
		height = '500';
		wndProp += ',height='+height;
	}

	if (top == '') {
		top = (screen.height) ? (screen.height-height)/2 : 0;
		wndProp += ',top='+top;
	}

	if (left == '') {
		left = (screen.width) ? (screen.width-width)/2 : 0;
		wndProp += ',left='+left;
	}
	
	if(actionUrl != null && actionUrl != "") {
		actionUrl = makePopUpUrl(actionUrl);
	}

	var smwnd = window.open(actionUrl, wndName, wndProp);
	focusWnd(smwnd);
	return smwnd;
}





function showWindow_mhinput(source, wndName, wndProp, mode , contentType) {
	var smwnd = null;
	
	if(contentType == null || contentType == "undefined") {
		contentType = "html";
	}
	// CSS
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	
	var width  = '';
	var height = '';
	var left  = '';
	var top = '';
	var className = '';

	var makeHtmlFunc = '';
	var popupType = '';
	
	if (wndProp != null && wndProp != "") {
		var props = wndProp.split(',');
		for (var i=0; i < props.length; i++) {
			var prop = props[i].split('=');
			var propName = prop[0];
			var propValue = prop[1];
	
			propName = propName.replace(' ','');
			propValue = propValue.replace(' ','');

			if (propName == 'width') {
				width = propValue;
			} else if (propName == 'height') {
				height = propValue;
			} else if (propName == 'left') {
				left = propValue;
			} else if (propName == 'top') {
				top = propValue;
			} else if (propName == 'makeHtmlFunc') {
				makeHtmlFunc = propValue;
			} else if(propName == 'className') {
				className = propValue;
			}
			
		}

	}
	
	if (mode != null && mode == "WIN-POPUP") {
		smwnd = popupInfoWnd_mhinoput(source, wndName, wndProp);
		
	}
	
	return smwnd;
}

function popupInfoWnd_mhinoput(actionUrl, wndName, wndProp) {
	if (wndProp == null || wndProp == "")
		wndProp = "width=600, height=500, scrollbars=yes, resizable=yes";

	var width = '';
	var height = '';
	var top = '';
	var left = '';
	var title = '';
	var resizable ='';

	var props = wndProp.split(',');
	for (var i=0; i < props.length; i++) {
		var prop = props[i].split('=');
		var propName = prop[0];
		var propValue = prop[1];

		propName = propName.replace(' ','');
		propValue = propValue.replace(' ','');

		if (propName == 'width') {
			width = propValue;
		} else if (propName == 'height') {
			height = propValue;
		} else if (propName == 'top') {
			top = propValue;
		} else if (propName == 'left') {
			left = propValue;
		}else if (propName == 'resizable') {
			resizable = propValue;
		}
	}

	if (width == '') {
		width = '600';
		wndProp += ',width='+width;
	}

	if (height == '') {
		height = '500';
		wndProp += ',height='+height;
	}

	if (top == '') {
		top = (screen.height) ? (screen.height-height)/2 : 0;
		wndProp += ',top='+top;
	}

	if (left == '') {
		left = (screen.width) ? (screen.width-width)/2 : 0;
		wndProp += ',left='+left;
	}
	
	
	var smwnd = window.open(actionUrl, wndName, wndProp);
	focusWnd(smwnd);
	return smwnd;
}

function focusWnd(wnd)
{
	if (typeof(wnd) != 'undefined' && wnd != null && !wnd.closed)
	{
		wnd.focus();
	}
}


function openDialog(u, w, h, type, s){
	
	var height=h;
	var width =w;
	var url = u;
	var ret;
	
	if(navigator.appName.indexOf("Microsoft Internet Explorer") > -1 && navigator.appVersion.indexOf("IE 6") > -1)
	{
		height = height+30;
		width = width+7;
	}
	
	var status = "dialogHeight:"+height+"px;dialogWidth:"+width+"px;edge:Raised; center:Yes; help:no; scroll:no; resizable:no; status:no;";
	
	if(typeof(s)!= 'undefined' && s !="" && s != null)
		status = s;
	
	if(type == "MODAL")
	{
		ret = window.showModalDialog(url, window, status);
	}
	else{
		
		ret = window.showModelessDialog(url, window, status);
	}
	return ret;
	
}

/****************************************************************
* 팝업 Url에 isPopUp 파라미터를 추가한다.
*
* @param sUrl      	    표시하고자 하는 URL (필수)
* @return               변경된 Url
***************************************************************/
function makePopUpUrl(sUrl) {
	if (sUrl.indexOf("?isPopUp=") < 0 && sUrl.indexOf("&isPopUp=")  < 0 )
		sUrl = sUrl + ( sUrl.indexOf("?") < 0 ? "?" : "&") + "isPopUp=Y";
	return sUrl;
}



/****************************************************************
* Form.submit() 시 공통처리 로직을 담고 있는 function
*
* @param    formObj  	Submit 할 Form 객체
* @return   void		
***************************************************************/
function gfnFormSubmit(formObj) {
	
	// 선택된 언어설정
	var languageSelectedElement = top.document.getElementById('languageSelected');
	if(languageSelectedElement == null || typeof(languageSelectedElement) == 'undefined') {
		languageSelectedElement = opener.top.document.getElementById('languageSelected');

	}
	if(languageSelectedElement != null && typeof(languageSelectedElement) != 'undefined') {
		var languageSelected = languageSelectedElement.value;
		//alert(languageSelected);
		gfn_createPostElement(formObj,'languageSelected',languageSelected);
	}
	
	
	// 선택된 사업부 코드
	var divisionCodeSelectedElement = top.document.getElementById('divisionCodeSelected');
	if(divisionCodeSelectedElement == null || typeof(divisionCodeSelectedElement) == 'undefined') {
		divisionCodeSelectedElement = opener.top.document.getElementById('divisionCodeSelected');

	}
	if(divisionCodeSelectedElement != null && typeof(divisionCodeSelectedElement) != 'undefined') {
		var divisionCodeSelected = divisionCodeSelectedElement.value;
		//alert(divisionCodeSelected);
		gfn_createPostElement(formObj,'divisionCodeSelected',divisionCodeSelected);
	}
	
	
	// 선택된 메뉴 아이디
	var menuIdSelectedElement = top.document.getElementById('menuIdSelected');
	if(menuIdSelectedElement == null || typeof(menuIdSelectedElement) == 'undefined') {
		menuIdSelectedElement = opener.top.document.getElementById('menuIdSelected');

	}
	if(menuIdSelectedElement != null && typeof(menuIdSelectedElement) != 'undefined') {
		var menuIdSelected = menuIdSelectedElement.value;
		//alert(menuIdSelected);
		gfn_createPostElement(formObj,'menuIdSelected',menuIdSelected);
	}
	
	
	
	formObj.submit();
}

/****************************************************************
* 좌측 여백 삭제
*
* @param    str  	문자
* @return   str		
***************************************************************/
function gfn_ltrim(str){ 
	var s = new String(str); 
	return (s.substr(0,1) == " ") ? gfn_ltrim(s.substr(1)) : s ; 
}

/****************************************************************
* 우측 여백 삭제
*
* @param    str  	문자
* @return   str		
***************************************************************/
function gfn_rtrim(str){ 
	var s = new String(str); 
	return (s.substr(s.length-1,1) == " ") ? gfn_rtrim(s.substring(0, s.length-1)) : s ; 
}

/****************************************************************
* 좌우측 여백 삭제
*
* @param    str  	문자
* @return   str		
***************************************************************/
function gfn_trim(str){ 
	return gfn_ltrim(gfn_rtrim(str)); 
}

/****************************************************************
* 숫자를 포멧이 갖추어진 문자열로 바꿈
*
* @param    value  	숫자형 문자
* @return   format	변환할 포멧
* 예) gfn_formattedVal(value , "###3.#####") : 천 자리수 마다 콤마를 찍고 소숫점 5자리 까지 표현 
***************************************************************/
function gfn_formattedVal(value,format) {
    value = ""+value;

    if(!format)
      return value;

    var sp = parseInt(format.charAt(3));

    if(!sp)
      return value;

    var pos = 0;
    var ret = "";
    var vSplit = value.split('.');
    var fSplit = format.split('.');
    var fp = fSplit[1];
    var fv = vSplit[1];
    var lv = vSplit[0];
    var len = lv.length;

    for(var i = len % sp; i < len; i += sp){
        if(i == 0 || lv.charAt(i-1) == '-')
            ret += lv.substring(pos,i);
        else
            ret += lv.substring(pos,i)+',';
        pos = i;
    }

    ret += lv.substring(pos,len);

    if(!fv)
        fv = "";
    if(!fp)
        fp = "";

    var len1 = fp.length;
    var len2 = fv.length;

    if(len1)
      ret += '.' + fv.substring(0,len1) + fp.substring(len1,len2);

    if(ret.indexOf("#") != -1) {
    	ret = ret.substring(0, ret.indexOf("#"));
    	var vTemp = ret.substring(ret.indexOf(".")+1, ret.length);
    	if(vTemp == null || vTemp == "") {
    		ret = ret.substring(0, ret.indexOf("."));
    	}
    }			
    
    return ret;
}


/****************************************************************
* 주어진 문자열이 수치data인지 검사
*
* @param    src  	문자
* @return   boolean	
***************************************************************/
function gfn_isNum(src){
	var dst = src.replace(",","");
	dst = gfn_trim(dst, ' ');
	return !isNaN(Number(dst));
}

/****************************************************************
* html 출력
* 
* @param    src  	문자
***************************************************************/
function printHTML(str){
 	document.write(str);
}

var ComSharedFlexCommon = {

		callAlert : function(msg, title, height, width) {
					setTimeout("ComSharedFlexCommon.showAlert('"+msg+"','"+title+"','"+height+"','"+width+"')",100);
					return null;
					}, 
					
		showAlert : function(msg, title, height, width){ComSharedShowMessage.showAlert(msg, title, height, width);},
					
		callConfirm: function(msg,objName,callback, title, type, height, width){ 
			setTimeout("ComSharedFlexCommon.showConfirm('"+msg+"','"+objName+"','"+callback+"','"+title+"','"+type+"','"+height+"','"+width+"')",100);
		},
		
		showConfirm: function(msg,objName,callback, title, type, height, width){			
			var result = ComSharedShowMessage.showConfirm(msg, title, type, height, width);
			
			if(typeof(result)=="undefined"){
				if(type =="CONFIRM")
					result = false;
				else if(type =="MULTI_CONFIRM")
					result ="C";
				else
					result ="N";
			}
			
			if(typeof(result)=="boolean"){
				eval("document.getElementById('"+ objName+"')."+callback+"("+result+");");
			}
			else{
				eval("document.getElementById('"+ objName+"')."+callback+"('"+result+"');");
			}
					
		
			return null;
		},
		
		userInfoLayerPopup: function (userId, x, y, zIndex){
			var top = y + 10;
			var left = x + 10;
			var zidx=3;
			
			if(zIndex != null && zIndex != "undefined" && zIndex !='') {
				zidx = zIndex;
			}
			
	     
			showWindow(rootPath+"/com/ums/getUmsUserInfo.do?umsUserVO.userId="+userId,"userInfo","top="+top+",left="+left+",z-index="+zidx, "USER-INFO");				
		},
		
		getLocale: function(){
			return langType;
		},
		
		/**
		 * 로그인시 설정되는 roothPath
		 */
		getContextRoot:function(){
			return contextPath;
		},
		
		/**
		 * 메뉴 클릭시 설정되는 rootPath
		 */
		getRootPath:function(){
			return rootPath;
		},
		
		getHostUrl:function(){
			return hostUrl;
		},
		
		openModelessDialog:function(url, w, h){
			
			return openDialog(encodeURI(url), w, h, "MODELESS");
			
		}, 
		
		openProductAbbrMultiSel:function(callbackFunc, count, x, y){
			
			var zidx = 1000;
			
			var itemHeight = 20;
			var w = 385;
			
			var heigthPix = 0;
			if(typeof(count) != 'undefined' && count != 0) {
				heigthPix= 80 * (count / 3) + 10;
			}else heigthPix = 70 
			var h = (itemHeight * 7) + heigthPix;
			
			var top = y + 10;
			var left = x - w;
			
			showWindow(rootPath+"/pjt/shared/getProdAbbrMultiSel.do?callback="+callbackFunc,"proAbbr","top="+top+",left="+left+",width="+w+",height="+h+",z-index="+zidx, "DIV-POPUP");
		}
		
	};


	/****************************************************************
	* Flex->Html 팝업 호출
	*
	* @param    args[0]  팝업 settion 객체
	* @param    args[1]  파라메타 객체
	***************************************************************/	
	function gfn_flexPopupCall() {
		var args = gfn_flexPopupCall.arguments;
		if(args != null && args.length > 0) {
			if(args[0] != null && args[0] != 'undefined') {
				var popupObj = args[0];
				showWindow(rootPath + gfn_paramUtf8Encoding(popupObj.hrefStr),popupObj.popupName,popupObj.size,popupObj.type,"flex");
			}  
		}
	}

	/****************************************************************
	* Flex->Html 팝업 호출 MHINPUT
	*
	* @param    args[0]  팝업 settion 객체
	* @param    args[1]  파라메타 객체
	***************************************************************/	
	function gfn_flexPopupCall_MHinput() {
		var args = gfn_flexPopupCall_MHinput.arguments;
		
		if(args != null && args.length > 0) {
			if(args[0] != null && args[0] != 'undefined') {
				var popupObj = args[0];
				document.charset='euc-kr';	
				window.open("http://itams.sec.rfxsoft.com"+ popupObj.hrefStr, "iTams", "width=1100, height=600, scrollbars=yes");
				document.charset='utf-8'; 

				//showWindow_mhinput("http://itams.sec.rfxsoft.com"+ gfn_paramUtf8Encoding(popupObj.hrefStr),popupObj.popupName,popupObj.size,popupObj.type,"flex");
			}  
		}
	}
	
	
	/****************************************************************
	* Get방식 UTF-8 Encoding
	*
	* @param    args[0]  팝업 settion 객체
	* @param    args[1]  파라메타 객체
	***************************************************************/
	function gfn_paramUtf8Encoding(sStr) {
		var returnParam = "";
		if(sStr.indexOf("?") > -1) {
			returnParam = sStr.substring(0,sStr.indexOf("?")+1);
			var param = sStr.substring(sStr.indexOf("?")+1,sStr.length).split("&");
			for(var iParam = 0 ; iParam < param.length ; iParam++) {
				if(param[iParam] != "") {
					var subParam = param[iParam].split("=");
					returnParam += subParam[0];
					if(subParam.length == 2) {
						returnParam += "=" + encodeURL(subParam[1]);
					}

					if(iParam < param.length-1) {
						returnParam += "&";
					}
				}
			}			
		} else {
			returnParam = sStr;
		}
		return returnParam;
	}

	/****************************************************************
	* Html -> Flex 호출
	*
	* @param    args[0]  Flex 오프젝트 ID
	* @param    args[1]  Flex function name
	* @param    args[2]  파라메타 객체
	***************************************************************/	
	function gfn_flexReturnFunction() {
		
		var args = gfn_flexReturnFunction.arguments;
		if(args.length < 2) {
			return;
		}
		
		var obj = document.getElementById(args[0]);
		
		if(obj != null &&  obj != 'undefined') {
			if(args.length == 2) {
				with(obj) {
					eval(args[1])();
				}
			} else {	
				with(obj) {
					
					eval(args[1])(args[2]);
				}
			}
		}	
	}
	
var CommonUtil={
	
	 discardElement : function(element) { 
			var garbageBin = document.getElementById('IELeakGarbageBin'); 
			if (!garbageBin) { garbageBin = document.createElement('DIV'); 
			garbageBin.id = 'IELeakGarbageBin'; 
			garbageBin.style.display = 'none'; 
			document.body.appendChild(garbageBin); 
	} 	// move the element to the garbage bin 
		garbageBin.appendChild(element); 
		garbageBin.innerHTML = ''; 
	},
	
	purge : function (d) {
	    var a = d.attributes, i, l, n;
	    if (a) {
	        l = a.length;
	        for (i = 0; i < l; i += 1) {
	            n = a[i].name;
	            if (typeof d[n] === 'function') {
	                d[n] = null;
	            }
	        }
	    }
	     a = d.childNodes;
	    if (a) {
	        l = a.length;
	        for (i = 0; i < l; i += 1) {
	            purge(d.childNodes[i]);
	        }
	     }
	}
	
};	



var ComSharedCkLen ={
		getByteLength:function(s)
		{
			 if (s == null || s.length == 0) {
			       return 0;
			     }
			     var size = 0;

			     for (var i = 0; i < s.length; i++) {
			       size += this.charByteSize(s.charAt(i));
			     }    
			
			return size;	
		},

		charByteSize:function(ch) {
		    if (ch == null || ch.length == 0) {
		      return 0;
		    }

		    var charCode = ch.charCodeAt(0);

		    if (charCode <= 0x00007F) {
		      return 1;
		    } else if (charCode <= 0x0007FF) {
		      return 2;
		    } else if (charCode <= 0x00FFFF) {
		      return 3;
		    } else {
		      return 4;
		    }
		  }
		
};

var ComSharedShowMessage = {
			checkLength : function(msg){
				var ckmsg = msg;
				if(ComSharedCkLen.getByteLength(msg) == msg.length){
					if(msg.length > 2900)
						return msg.substring(0,2900)+'...';
					else
						return msg;
				}
				if(parseInt(ComSharedCkLen.getByteLength(msg)) > 330){				
					ckmsg = msg.substring(0,330)+'...';
				}
				return ckmsg;
			},
			
			showAlert : function(msg, title, height, width) {
				if(msg != null && typeof(msg)!='undefined' && msg !="" && msg !='null'){
					var winTitle ="IPMS";
					if(title != null && typeof(title)!='undefined' && title !=""){
						winTitle = title;
					}
					//msg = this.checkLength(msg);
					return this.showMessageBox(encodeURIComponent(msg), encodeURIComponent(winTitle), "ALERT", height, width);
				}else{
					return null;
				}
			},

			showConfirm : function(msg, title, type, height, width){
				var msgType  = "CONFIRM";
				var winTitle = "IPMS";
				if(type != null && typeof(type)!='undefined' && type !="" && type !='undefined'){
					msgType = type;
				}
				if(title != null && typeof(title)!='undefined' && title !="" && title!='undefined'){
					winTitle = title;
				}
				msg = this.checkLength(msg);
				return this.showMessageBox(encodeURIComponent(msg), encodeURIComponent(winTitle), encodeURIComponent(msgType), height, width);
			},

			showMessageBox : function(msg, title, msgType, height, width){
				var defaultHeight = 145;
				var defaultWidth  = 353; 
				var contentHeight;
				var contentWidth;
				if(height != null && typeof(height)!='undefined' && height !="" && height !='undefined'){
					if(height > 400){
						defaultHeight = 400;
					}
					else if(height < 145){
						defaultHeight = 145;
					}
					else{						
						defaultHeight = height;
					}
				}
				if(width != null && typeof(width)!='undefined' && width !="" && width !='undefined'){
					if(width < 353){
						defaultWidth = 353;
					}
					else if(width > 1000){
						defaultWidth = 1000;
					}
					else{						
						defaultWidth = width;
					}
				}
				contentHeight = defaultHeight-15;
				contentWidth  = defaultWidth;
				var	url = contextPath+"/com/shared/ShowMessage.do?message="+msg+"&msgType="+msgType+"&title="+title+"&height="+contentHeight+"&width="+contentWidth;				
				return openDialog(url, parseInt(defaultWidth), parseInt(defaultHeight), "MODAL");
			}
			
	};	

var ComSharedShowLongMsg = {
		alertMsg : "",
		getMsg : function(){	
			return this.alertMsg;
		},
		
		showAlert : function(title, height, width) {
			if(this.alertMsg !=""){
				var winTitle = "IPMS";
				if(title != null && typeof(title)!='undefined' && title !=""){
					winTitle = title;
				}
				return this.showMessageBox(encodeURIComponent(winTitle), "ALERT", height, width);
			}else{
				return null;
			}
		},

		showConfirm : function(title, type, height, width){
			var msgType  = "CONFIRM";
			var winTitle = "IPMS";
			if(type != null && typeof(type)!='undefined' && type !="" && type !='undefined'){
				msgType = type;
			}
			if(title != null && typeof(title)!='undefined' && title !="" && title!='undefined'){
				winTitle = title;
			}			
			return this.showMessageBox(encodeURIComponent(winTitle), encodeURIComponent(msgType), height, width);
		},

		showMessageBox : function( title, msgType, height, width){
			var defaultHeight = 145;
			var defaultWidth  = 353; 
			var contentHeight;
			var contentWidth;
			if(height != null && typeof(height)!='undefined' && height !="" && height !='undefined'){
				if(height > 400){
					defaultHeight = 400;
				}
				else if(height < 145){
					defaultHeight = 145;
				}
				else{						
					defaultHeight = height;
				}
			}
			if(width != null && typeof(width)!='undefined' && width !="" && width !='undefined'){
				if(width < 353){
					defaultWidth = 353;
				}
				else if(width > 1000){
					defaultWidth = 1000;
				}
				else{						
					defaultWidth = width;
				}
			}
			contentHeight = defaultHeight-15;
			contentWidth  = defaultWidth;
			var	url = contextPath+"/com/shared/ShowLongMessage.do?&msgType="+msgType+"&title="+title+"&height="+contentHeight+"&width="+contentWidth;
			return openDialog(url, parseInt(defaultWidth), parseInt(defaultHeight), "MODAL");
		}
};	

	
	var ComSharedLoading = {
			
			showLoadingBar : function(type) {
				if(loadingBar != null && typeof(loadingBar) != "undefined"){
					if($(loadingBar).css("display") == "none"){
						if(type =="iframe"){
							loadingType="iframe";
						}
						else{
							loadingType="Layout";
						}						

						if(loadingBar.length > 1){
							loadingBar[0].style.display="block";
						}else{
							if(loadingBar.style.left.indexOf("-")<0)
								loadingBar.style.display = "block";
						}
					}
				}
			},
			
			hideLoadingBar : function(){
				if (typeof(loadingBar) != "undefined" && loadingBar != null)
				{
					if(loadingBar.length > 1){
						loadingBar[0].style.display="none";
					}
					else{
						loadingBar.style.display = "none";
					}
				}
			},
			
			showIframeLoadingBar : function(){
				try {
					var ploadingbar = parent.document.getElementById("loadingBar");
					if(typeof(ploadingbar) != "undefined" && ploadingbar != null){
						if($(ploadingbar).css("display") == "none"){
							parent.loadingType="iframe";
							ploadingbar.style.display = "block";
						}
					}
				} catch (e) {
				}
			},

			hideIframeLoadingBar : function(){
				try {
					var ploadingbar = parent.document.getElementById("loadingBar");
					if(typeof(ploadingbar) != "undefined" && ploadingbar != null){
						if(parent.loadingType !="Layout"){
							ploadingbar.style.display = "none";
						}
					}
				} catch (e) {
				}
			},
			
			hideLayoutLoadingBar : function(){
				// G-TMP 등 타시스템에서 사용될 경우, 프레임 구조에 의해 에러가 나는 것을 방지
				try {
					var ploadingbar = parent.document.getElementById("loadingBar");
					if(typeof(ploadingbar) != "undefined" && ploadingbar != null){
						ploadingbar.style.display = "none";
					}
				} catch (err) {
					
				}
			},
			
			ipmsShowIframeLoadingBar : function(){
				try {
					var ploadingbar = document.getElementById("loadingBar");
					if(typeof(ploadingbar) != "undefined" && ploadingbar != null){
						if($(ploadingbar).css("display") == "none"){
							loadingType="iframe";
							ploadingbar.style.display = "block";
						}
					}
				} catch (e) {
				}
			},
			
			ipmsHideIframeLoadingBar : function(){
				try {
					var ploadingbar = document.getElementById("loadingBar");
					if(typeof(ploadingbar) != "undefined" && ploadingbar != null){
						if(loadingType !="Layout"){
							ploadingbar.style.display = "none";
						}
					}
				} catch (e) {
				}
			},
			
			ipmsHideLayoutLoadingBar : function(){
				try {
					var ploadingbar = document.getElementById("loadingBar");
					if(typeof(ploadingbar) != "undefined" && ploadingbar != null){
						ploadingbar.style.display = "none";
					}
				} catch (err) {
					
				}
			},

			adjustBarPosition : function(){				
				try {
			        var width  = document.getElementById("loadingBar").style.width;
			        var height = document.getElementById("loadingBar").style.height;
			        	width  = width.replace('px','');
			        	height = height.replace('px','');
			        var left   = Math.ceil((document.body.offsetWidth-width)/2);  // screen.availWidth, body는 로딩뒤 계산됨
			        var top    = Math.ceil((document.body.offsetHeight-height)/2);
			        document.getElementById("loadingBar").style.left = left;
			        document.getElementById("loadingBar").style.top  = top;
				} catch (e) {
				}
		    },
			
			// ********************************************** Loaidng Ring Info / loadingRing
			showLoadingRing : function(type) {
				if(loadingRing != null && typeof(loadingRing) != "undefined"){
					if($(loadingRing).css("display") == "none"){
						if(type =="iframe"){
							loadingType="iframe";
						}
						else{
							loadingType="Layout";
						}						

						if(loadingRing.length > 1){
							loadingRing[0].style.display="block";
						}else{
							if(loadingRing.style.left.indexOf("-")<0)
								loadingRing.style.display = "block";
						}
					}
				}
			},
			
			hideLoadingRing : function(){
				if (typeof(loadingRing) != "undefined" && loadingRing != null)
				{
					if(loadingRing.length > 1){
						loadingRing[0].style.display="none";
					}
					else{
						loadingRing.style.display = "none";
					}
				}
			},
			
			showIframeLoadingRing : function(){
				try {
					var ploadingRing = parent.document.getElementById("loadingRing");
					if(typeof(ploadingRing) != "undefined" && ploadingRing != null){
						if($(ploadingRing).css("display") == "none"){
							parent.loadingType="iframe";
							ploadingRing.style.display = "block";
						}
					}
				} catch (e) {
				}
			},

			hideIframeLoadingRing : function(){
				try {
					var ploadingRing = parent.document.getElementById("loadingRing");
					if(typeof(ploadingRing) != "undefined" && ploadingRing != null){
						if(parent.loadingType !="Layout"){
							ploadingRing.style.display = "none";
						}
					}
				} catch (e) {
				}
			},
			
			hideLayoutLoadingRing : function(){
				// G-TMP 등 타시스템에서 사용될 경우, 프레임 구조에 의해 에러가 나는 것을 방지
				try {
					var ploadingRing = parent.document.getElementById("loadingRing");
					if(typeof(ploadingRing) != "undefined" && ploadingRing != null){
						ploadingRing.style.display = "none";
					}
				} catch (err) {
					
				}
			},
			
			ipmsShowIframeLoadingRing : function(){
				try {
					var ploadingRing = document.getElementById("loadingRing");
					if(typeof(ploadingRing) != "undefined" && ploadingRing != null){
						if($(ploadingRing).css("display") == "none"){
							loadingType="iframe";
							ploadingRing.style.display = "block";
						}
					}
				} catch (e) {
				}
			},
			
			ipmsHideIframeLoadingRing : function(){
				try {
					var ploadingRing = document.getElementById("loadingRing");
					if(typeof(ploadingRing) != "undefined" && ploadingRing != null){
						if(loadingType !="Layout"){
							ploadingRing.style.display = "none";
						}
					}
				} catch (e) {
				}
			},
			
			ipmsHideLayoutLoadingRing : function(){
				try {
					var ploadingRing = document.getElementById("loadingRing");
					if(typeof(ploadingRing) != "undefined" && ploadingRing != null){
						ploadingRing.style.display = "none";
					}
				} catch (err) {
					
				}
			},

			adjustRingPosition : function(){				
				try {
			        var width  = document.getElementById("loadingRing").style.width;
			        var height = document.getElementById("loadingRing").style.height;
			        	width  = width.replace('px','');
			        	height = height.replace('px','');
			        var left   = Math.ceil((document.body.offsetWidth-width)/2);  // screen.availWidth, body는 로딩뒤 계산됨
			        var top    = Math.ceil((document.body.offsetHeight-height)/2);
			        document.getElementById("loadingRing").style.left = left;
			        document.getElementById("loadingRing").style.top  = top;
				} catch (e) {
				}
		    }			

	};
	
	var PjtShowMessage = {	                                                                                                                                                           
            
			showAlert : function(msg, title, height, width) {                                                                                                                              
				if(msg != null && typeof(msg)!='undefined' && msg !="" && msg !='null'){                                                                                                     
					var winTitle ="SIPMS";                                                                                                                                                       
					                                                                                                                                                                           
					if(title != null && typeof(title)!='undefined' && title !=""){                                                                                                             
						winTitle = title;                                                                                                                                                        
					}                                                                                                                                                                          
					                                                                                                                                                                           
					return this.showMessageBox(encodeURIComponent(msg), encodeURIComponent(winTitle), "ALERT", height, width);                                                                 
				}else{                                                                                                                                                                       
					return null;                                                                                                                                                               
				}                                                                                                                                                                            
			},                                                                                                                                                                             
			                                                                                                                                                                               
			                                                                                                                                                                               
			                                                                                                                                                                               
			showConfirm : function(msg, title, type, height, width){                                                                                                                       
				var msgType = "CONFIRM";                                                                                                                                                     
				var winTitle ="SIPMS";                                                                                                                                                         
				                                                                                                                                                                             
				if(type != null && typeof(type)!='undefined' && type !="" && type !='undefined'){                                                                                            
					msgType = type;                                                                                                                                                            
				}                                                                                                                                                                            
				if(title != null && typeof(title)!='undefined' && title !="" && title!='undefined'){                                                                                         
					winTitle = title;                                                                                                                                                          
				}                                                                                                                                                                            
				return this.showMessageBox(encodeURIComponent(msg), encodeURIComponent(winTitle), encodeURIComponent(msgType), height, width);                                               
			},                                                                                                                                                                             
			                                                                                                                                                                               
			                                                                                                                                                                               
			                                                                                                                                                                               
			showMessageBox : function(msg, title, msgType, height, width){                                                                                                                 
				var defaultHeight =145 ;                                                                                                                                                     
				var defaultWidth =353;                                                                                                                                                       
				var contentHeight;                                                                                                                                                           
				var contentWidth;                                                                                                                                                            
				                                                                                                                                                                             
				if(height != null && typeof(height)!='undefined' && height !="" && height !='undefined'){                                                                                    
					if(height > 400){                                                                                                                                                          
						defaultHeight = 400;                                                                                                                                                     
					}                                                                                                                                                                          
					else if(height < 145){                                                                                                                                                     
						defaultHeight = 145;                                                                                                                                                     
					}                                                                                                                                                                          
					else{						                                                                                                                                                           
						defaultHeight = height;                                                                                                                                                  
					}                                                                                                                                                                          
				}                                                                                                                                                                            
				                                                                                                                                                                             
				if(width != null && typeof(width)!='undefined' && width !="" && width !='undefined'){                                                                                        
					if(width < 353){                                                                                                                                                           
						defaultHeight = 353;                                                                                                                                                     
					}                                                                                                                                                                          
					else if(width > 1000){                                                                                                                                                     
						defaultWidth = 1000;                                                                                                                                                     
					}                                                                                                                                                                          
					else{						                                                                                                                                                           
						defaultWidth = width;                                                                                                                                                    
					}                                                                                                                                                                          
				}                                                                                                                                                                            
				                                                                                                                                                                             
				contentHeight = defaultHeight-15;                                                                                                                                            
				contentWidth = defaultWidth;                                                                                                                                                 
				                                                                                                                                                                             
				var	url = contextPath+"/com/shared/ShowMessage.do?openLoginType=NOTMNINPUT&message="+msg+"&msgType="+msgType+"&title="+title+"&height="+contentHeight+"&width="+contentWidth;
			//	showWindow(url, "a", "width="+defaultWidth+",height="+defaultHeight, "WIN-POPUP");                                                                                         
				return openDialog(url, parseInt(defaultWidth), parseInt(defaultHeight), "MODAL");                                                                                            
			}                                                                                                                                                                              
			                                                                                                                                                                               
	};                                                                                                                                                                                 
	
	// 과제 수정메뉴 포커스
	var PjtCommonUtil = {
			
			focusLock : function() {
				$(".frameOverlay").remove();
				if($(".frameOverlay", parent.document).length <= 0) {
					$(".container", parent.document).before("<div id='frameOverlay' class='frameOverlay'></div>");
					$(".tabCont iframe:first", parent.document)
					.addClass("focused")
					.parent().addClass("tabContFocused").append("<div class='shadowBottom'></div><div class='rt'></div><div class='lb'></div><div class='rb'></div>");
					
					if($(parent.document.body).height() > parent.document.body.scrollHeight){
						$(".frameOverlay", parent.document).css("height", $(parent.document.body).height() +"px");
					}else {
						$(".frameOverlay", parent.document).css("height", parent.document.body.scrollHeight +"px");
					}
				}
				$(".container").addClass("containerFocused");

			},
	
			focusUnlock : function(tabId, subTabId) {
				$(".frameOverlay, .tabContFocused .shadowBottom, .tabContFocused .rt, .tabContFocused .lb, .tabContFocused .rb", parent.document).remove();
				$(".container").removeClass("containerFocused");
				$(".tabCont iframe:first", parent.document)
					.removeClass("focused")
					.parent().removeClass("tabContFocused");
				if(subTabId == null) subTabId = "";
				parent.lfn_tabControl(tabId, subTabId);
			}
				
	};
	
	function isDefinedVariable(vari) {
		var defined = false;
		try {
			defined =  vari != null && eval('typeof ' + vari) != 'undefined';
		}catch(e){
		}
		return defined;
	}
	
	// css 및 script 중복요청 방지
	if(isDefinedVariable('_plmjs') === false) {_plmjs = {};}
	var ImportUtil = {
			isLinked : function (url, type, rel) {
				var srr = document.getElementsByTagName("link");
				for(var i = 0; i<srr.length; i++) {
					if(srr[i].href == url) {
						return true;
					}
				}
				return false;
			},

			linkCss : function(urlArr) {
				var head = document.getElementsByTagName("head")[0] || document.documentElement;
				for(var i=0; i<urlArr.length; i++) {
					var url = urlArr[i];
					if(this.isLinked(url) === false){
						var link = document.createElement("link");
						link.type = "text/css";
						link.rel = "stylesheet";
						link.href = url;
						//link.text = xhr.responseText;
						try {
							head.insertBefore( link, head.firstChild );
							//head.removeChild(link);
							this.markLinkedCss(url);
							success = true;
						}catch(e){
							//alert(e.description);
						}
					}
				}
			},

			importScripts : function (urlArr) {
				var xhr = null;
				if(window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
					xhr = new XMLHttpRequest();
				}else{// code for IE6, IE5
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
				var failedUrls = [];
				var head = document.getElementsByTagName("head")[0] || document.documentElement;
				for(var i=0; i<urlArr.length; i++) {
					var url = urlArr[i];
					if(this.isImportedScript(url) === false){
						var success = false;
						xhr.open("GET",url,false);
						xhr.send(null);
						
						if ( xhr.readyState == 4) {
							var httpSuccess = false;
							try {
								// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
								httpSuccess = !xhr.status && location.protocol == "file:" ||
									( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 || xhr.status == 1223;
							} catch(e){}
							
							if(httpSuccess) {
								var script = document.createElement("script");
								script.type = "text/javascript";
								script.text = xhr.responseText;
								try {
									head.insertBefore( script, head.firstChild );
									head.removeChild(script);
									this.markImportedJs(url);
									success = true;
								}catch(e){
									//alert(e.description);
								}
							}
						}
						if(success === false) {
							failedUrls.push(url);
						}
					}
				}
				xhr = null;
				return failedUrls;
			},
			
			isImportedScript : function (url) {
				if(_plmjs[url] === true) {
					return true;
				}
				var srr = document.getElementsByTagName("script");
				for(var i = 0; i<srr.length; i++) {
					if(srr[i].src == url) {
						return true;
					}
				}
				return false;
			},
			
			markImportedJs : function (url) {
				_plmjs[url] = true;
			},

			importCompressedScript : function (fileArr, cname, byForce) {
				if(byForce === true || this.importScripts([cname]).length > 0) {
					if(this.compressResource(fileArr, cname) === true) {
						if(this.importScripts([cname]).length > 0){
							this.importScripts(fileArr);
						}
					}
				}
			}, 
			compressResource : function (fileArr, cname) {
				var bool = false;
				$.ajax({
					async : false,
					type: "POST",
					url: contextPath+'/doc/shared/invoke.do?method=compress',
					data: {'file':fileArr, 'newName':cname},
					dataType: "json",
					success: function(data) {
						bool = (data.result > 0);
					}
				});
				return bool;
			}
	};
	
