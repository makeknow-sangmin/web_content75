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
		
	} else if(mode != null && mode == "MDWCAE-INFO"){
		showDivLayoutPopupMdwCaeInfo(source, wndName, wndProp);
		
	} else if(mode != null && mode == "SUPPORT-INFO"){
		showDivLayoutPopupSupportInfo(source, wndName, wndProp);
		
	} else if(mode != null && mode == "RECEIVER-LIST"){
		showDivLayoutPopupReceiverList(source, wndName, wndProp);
		
	} else if(mode != null && mode == "FILE-INFO"){
		showDivLayoutPopupFileInfo(source, wndName, wndProp);
		
	} else if(mode != null && mode == "COMMAND-INFO"){
		showDivLayoutPopupCommandInfo(source, wndName, wndProp);
		
	} else if(mode != null && mode == "SUPERCOM-FILE"){ //keionep.park 박경원
		showDivLayoutPopupSupercom(source, wndName, wndProp);
	
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
	
	if(height != ''){
		$('#divLayoutPopupContents'+ wndName).css("height",height);
	}
	//$('#divLayoutPopupContentsIframe'+ wndName).css("width",parseInt(width)+4);
	//$('#divLayoutPopupContentsIframe'+ wndName).css("height",parseInt(height)+4);
	$('#divLayoutPopupContents'+ wndName).css("left",left);
	$('#divLayoutPopupContents'+ wndName).css("top",top);
	
	$('#workplaceDivLayoutPopup'+ wndName).css("width",width);
	//$('#workplaceDivLayoutPopup'+ wndName).css("height",height-$('#ComponentHandler'+ wndName).attr("offsetHeight"));
	
	if(height != ''){
		$('#workplaceDivLayoutPopup'+ wndName).css("height",height);
	}
	
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

var divLayoutPopupCommandInfoNames = new Array(); 
function showDivLayoutPopupCommandInfo(url, wndName, wndProp) {
	// 이미 떠있는 DIV 창 닫기
	hideDivLayoutPopupCommandInfo();
	
	//  DIV 창 이름 등록
	var divLayoutPopupCommandInfoNamesLength = divLayoutPopupCommandInfoNames.length;
	for(var i=0; i < divLayoutPopupCommandInfoNamesLength; i++) {
		if(wndName == divLayoutPopupCommandInfoNames[i]) {
			//return wndName;
		}
	}
	divLayoutPopupCommandInfoNames[divLayoutPopupCommandInfoNamesLength] = wndName;
	
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
	var divToolTipLayoutPopupContents  =   '<div id="divLayoutPopupContentsCommandInfo'+ wndName +'" class="tooltip"  style="position:absolute;width:420px;">'
										   +   '   <iframe src="about:blank" scrolling="no" frameborder="0" style="position:absolute;width:420px;height:178px;top:0;left:0;padding:0;filter:alpha(opacity=0);border:none;display:block;z-index:-1;"> </iframe>'
										   +   '	<div class="cont" style="with:390px;">'
										   +   '		<div id="ComponentHandler'+ wndName +'" class="assist" style="with:390px;">'
										   +   '			<div class="headArea" style="with:390px;"><h2>' + Message.commandInfo + '</h2></div>'
										   +   '			<iframe name="" src="'+ url +'" width="100%" height="110px" frameborder="0" style="width:390px;"></iframe>'
										   +   '			<div class="popBtn fright"><span><a href="#" onclick="javasciprt:hideDivLayoutPopupCommandInfo(this);return false;">' + Message.close + '</a></span></div>'		
										   +   '		</div>'
										   +   '	</div>'
										   +   '	<div class="tooltipBtm">'
										   +   '		<div class="lb"></div>'
										   +   '	</div>'
										   +   '</div>'
										   ;	   
	$('body').append(divToolTipLayoutPopupContents);
	
	$('#divLayoutPopupContentsCommandInfo'+ wndName).css("z-index",zIndex);
	$('#divLayoutPopupContentsCommandInfo'+ wndName).css("left",left);
	$('#divLayoutPopupContentsCommandInfo'+ wndName).css("top",top);
	
	if(draggable == null || draggable == '' || draggable == 'false' || !draggable) {
		// Do nothing..!!
	} else {
		//$('#divLayoutPopupContentsUserInfo'+ wndName).draggable({handle: '#ComponentHandler'+ wndName, iframeFix: true});
	}
	
	return wndName;	
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

var divLayoutPopupMdwCaeInfoNames = new Array(); 
function showDivLayoutPopupMdwCaeInfo(url, wndName, wndProp) {	

	// 이미 떠있는 DIV 창 닫기
	hideDivLayoutPopupUserInfo();
	
	
	//  DIV 창 이름 등록
	var divLayoutPopupMdwCaeInfoNamesLength = divLayoutPopupMdwCaeInfoNames.length;
	for(var i=0; i < divLayoutPopupMdwCaeInfoNamesLength; i++) {
		if(wndName == divLayoutPopupMdwCaeInfoNames[i]) {
			//return wndName;
		}
		
	}
	divLayoutPopupMdwCaeInfoNames[divLayoutPopupMdwCaeInfoNamesLength] = wndName;


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
	var divToolTipLayoutPopupContents  =   '<div id="divLayoutPopupContentsUserInfo'+ wndName +'" class="tooltip"  style="position:absolute;width:180px;">'
									   +   '	<div class="cont" style="with:180px;">'
									   +   '		<div id="ComponentHandler'+ wndName +'" class="assist" style="with:150px;">'
									   +   '			<div class="headArea" style="with:150px;"><h2>' + Message.mdwCaeInfo + '</h2></div>'
									   +   '			<iframe name="" src="'+ url +'" width="150px" frameborder="0"></iframe>'
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

function hideDivLayoutPopupMdwCaeInfo(obj) {
	var divLayoutPopupMdwCaeInfoNamesLength = divLayoutPopupMdwCaeInfoNames.length;
	for(var i=0; i < divLayoutPopupMdwCaeInfoNamesLength; i++) {
		var wndName = divLayoutPopupMdwCaeInfoNames[i];
		divLayoutPopupMdwCaeInfoNames[i] = '';
		
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

var divLayoutPopupSupportInfoNames = new Array(); 
function showDivLayoutPopupSupportInfo(url, wndName, wndProp) {	

	// 이미 떠있는 DIV 창 닫기
	hideDivLayoutPopupUserInfo();
	
	
	//  DIV 창 이름 등록
	var divLayoutPopupMdwCaeInfoNamesLength = divLayoutPopupMdwCaeInfoNames.length;
	for(var i=0; i < divLayoutPopupMdwCaeInfoNamesLength; i++) {
		if(wndName == divLayoutPopupMdwCaeInfoNames[i]) {
			//return wndName;
		}
		
	}
	divLayoutPopupMdwCaeInfoNames[divLayoutPopupMdwCaeInfoNamesLength] = wndName;


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
	var divToolTipLayoutPopupContents  =   '<div id="divLayoutPopupContentsUserInfo'+ wndName +'" class="tooltip"  style="position:absolute;width:180px;">'
									   +   '	<div class="cont" style="with:180px;">'
									   +   '		<div id="ComponentHandler'+ wndName +'" class="assist" style="with:150px;">'
									   +   '			<div class="headArea" style="with:150px;"><h2>' + Message.supportInfo + '</h2></div>'
									   +   '			<iframe name="" src="'+ url +'" width="150px" frameborder="0"></iframe>'
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

function hideDivLayoutPopupSupportInfo(obj) {
	var divLayoutPopupMdwCaeInfoNamesLength = divLayoutPopupMdwCaeInfoNames.length;
	for(var i=0; i < divLayoutPopupMdwCaeInfoNamesLength; i++) {
		var wndName = divLayoutPopupMdwCaeInfoNames[i];
		divLayoutPopupMdwCaeInfoNames[i] = '';
		
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

var divLayoutPopupSupercomNames = new Array(); 
function showDivLayoutPopupSupercom(url, wndName, wndProp) {	

	// 이미 떠있는 DIV 창 닫기
	hideDivLayoutPopupSupercom();
	
	
	//  DIV 창 이름 등록
	var divLayoutPopupSupercomNamesLength = divLayoutPopupSupercomNames.length;
	for(var i=0; i < divLayoutPopupSupercomNamesLength; i++) {
		if(wndName == divLayoutPopupSupercomNames[i]) {
			//return wndName;
		}
		
	}
	divLayoutPopupSupercomNames[divLayoutPopupSupercomNamesLength] = wndName;


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
	var divToolTipLayoutPopupContents  =   '<div id="divLayoutPopupContentsSupercom'+ wndName +'" class="tooltip"  style="position:absolute;width:620px;">'
									   +   '   <iframe src="about:blank" scrolling="no" frameborder="0" style="position:absolute;width:520px;height:253px;top:0;left:0;padding:0;filter:alpha(opacity=0);border:none;display:block;z-index:-1;"> </iframe>'
									   +   '	<div class="cont" style="with:590px;">'
									   +   '		<div id="ComponentHandler'+ wndName +'" class="assist" style="with:490px;">'
									   +   '			<div class="headArea" style="with:550px;"><h2>' + Message.supercomFile + '</h2></div>'
									   +   '			<iframe name="" src="'+ url +'" width="100%" height="350px" frameborder="0" style="width:590px;"></iframe>'
									   +   '			<div class="popBtn fright">'
									   +               '<span><a href="#" onclick="javasciprt:selectFileDone(this);return false;">' + Message.ok + '</a></span>'
									   +               '<span><a href="#" onclick="javasciprt:hideDivLayoutPopupSupercom();return false;">' + Message.cancel + '</a></span>'
									   +'</div>'		
									   +   '		</div>'
									   +   '	</div>'
									   +   '	<div class="tooltipBtm">'
									   +   '		<div class="lb"></div>'
									   +   '	</div>'
									   +   '</div>'
							           ;	   
	
	$('body').append(divToolTipLayoutPopupContents);
	
	$('#divLayoutPopupContentsSupercom'+ wndName).css("z-index",zIndex);
	$('#divLayoutPopupContentsSupercom'+ wndName).css("left",left);
	$('#divLayoutPopupContentsSupercom'+ wndName).css("top",top);
	
	if(draggable == null || draggable == '' || draggable == 'false' || !draggable) {
		// Do nothing..!!
		
	} else {
		//$('#divLayoutPopupContentsSupercom'+ wndName).draggable({handle: '#ComponentHandler'+ wndName, iframeFix: true});

	}
	return wndName;
}

var divLayoutPopupFileInfoNames = new Array(); 
function showDivLayoutPopupFileInfo(url, wndName, wndProp) {	

	// 이미 떠있는 DIV 창 닫기
	hideDivLayoutPopupFileInfo();
	
	
	//  DIV 창 이름 등록
	var divLayoutPopupFileInfoNamesLength = divLayoutPopupFileInfoNames.length;
	for(var i=0; i < divLayoutPopupFileInfoNamesLength; i++) {
		if(wndName == divLayoutPopupFileInfoNames[i]) {
			//return wndName;
		}
		
	}
	divLayoutPopupFileInfoNames[divLayoutPopupFileInfoNamesLength] = wndName;


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
	var divToolTipLayoutPopupContents  =   '<div id="divLayoutPopupContentsFileInfo'+ wndName +'" class="tooltip"  style="position:absolute;width:620px;">'
									   +   '   <iframe src="about:blank" scrolling="no" frameborder="0" style="position:absolute;width:520px;height:253px;top:0;left:0;padding:0;filter:alpha(opacity=0);border:none;display:block;z-index:-1;"> </iframe>'
									   +   '	<div class="cont" style="with:590px;">'
									   +   '		<div id="ComponentHandler'+ wndName +'" class="assist" style="with:490px;">'
									   +   '			<div class="headArea" style="with:550px;"><h2>' + Message.fileInfo + '</h2></div>'
									   +   '			<iframe name="" src="'+ url +'" width="100%" height="180px" frameborder="0" style="width:590px;"></iframe>'
									   +   '			<div class="popBtn fright"><span><a href="#" onclick="javasciprt:hideDivLayoutPopupFileInfo(this);return false;">' + Message.close + '</a></span></div>'		
									   +   '		</div>'
									   +   '	</div>'
									   +   '	<div class="tooltipBtm">'
									   +   '		<div class="lb"></div>'
									   +   '	</div>'
									   +   '</div>'
							           ;	   
	
	$('body').append(divToolTipLayoutPopupContents);
	
	$('#divLayoutPopupContentsFileInfo'+ wndName).css("z-index",zIndex);
	$('#divLayoutPopupContentsFileInfo'+ wndName).css("left",left);
	$('#divLayoutPopupContentsFileInfo'+ wndName).css("top",top);
	
	if(draggable == null || draggable == '' || draggable == 'false' || !draggable) {
		// Do nothing..!!
		
	} else {
		//$('#divLayoutPopupContentsFileInfo'+ wndName).draggable({handle: '#ComponentHandler'+ wndName, iframeFix: true});

	}
	return wndName;
}

function hideDivLayoutPopupCommandInfo(obj) {
	var divLayoutPopupCommandInfoNamesLength = divLayoutPopupCommandInfoNames.length;
	for(var i=0; i < divLayoutPopupCommandInfoNamesLength; i++) {
		var wndName = divLayoutPopupCommandInfoNames[i];
		divLayoutPopupCommandInfoNames[i] = '';
		
		$('#divLayoutPopupContentsCommandInfo'+ wndName).attr("outerHTML","");
		
		// CSS
		$('#divLayoutPopupContentsCommandInfo'+ wndName).css("top","0px");
		$('#divLayoutPopupContentsCommandInfo'+ wndName).css("left","0px");
		$('#divLayoutPopupContentsCommandInfo'+ wndName).css("width","0px");
		$('#divLayoutPopupContentsCommandInfo'+ wndName).css("height","0px");

		$('#divLayoutPopupContentsCommandInfo'+ wndName).css("position","absolute");
		$('#divLayoutPopupContentsCommandInfo'+ wndName).css("z-index","1");
		$('#divLayoutPopupContentsCommandInfo'+ wndName).css("visibility","hidden");
	}	
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
var divLayoutPopupReceiverListNames = []; 
function showDivLayoutPopupReceiverList(url, wndName, wndProp){
	// 이미 떠있는 DIV 창 닫기
	hideDivLayoutPopupReceiverList();
	//  DIV 창 이름 등록
	var divLayoutPopupReceiverListNamesLength = divLayoutPopupReceiverListNames.length;
	for(var i=0; i < divLayoutPopupReceiverListNamesLength; i++) {
		if(wndName == divLayoutPopupReceiverListNames[i]) {
			//return wndName;
		}
	}
	divLayoutPopupReceiverListNames[divLayoutPopupReceiverListNamesLength] = wndName;
	// CSS
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	var width  = '';
	var height = '';
	var left  = '';
	var title = '';
	var top = '';
	var zIndex=10;
	var draggable = 'true';
	var peopleSection = '';
	
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
			} else if(propName == 'peopleSection'){
				peopleSection = propValue;
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
	
	
	if(peopleSection == 'M')
		title = Message.managerList;
	else
		title = Message.receiverList;
	
	// 동적 생성
	var divToolTipLayoutPopupContents  =   '<div id="divLayoutPopupContentsReceiverList'+ wndName +'" class="tooltip"  style="position:absolute;width:520px;">'
//									   +   '   <iframe src="about:blank" scrolling="no" frameborder="0" style="position:absolute;width:520px;height:178px;top:0;left:0;padding:0;filter:alpha(opacity=0);border:none;display:block;z-index:-1;"> </iframe>'
									   +   '	<div class="cont" style="with:490px;">'
									   +   '		<div id="ComponentHandler'+ wndName +'" class="assist" style="with:490px;">'
									   +   '			<div class="headArea" style="with:490px;"><h2>' + title + '</h2></div>'
									   +   '			<iframe name="" src="'+ url +'" class="parentFrame" frameborder="0" scrolling="no" style="width:100%; height:100%;"></iframe>'
									   +   '			<div class="popBtn fright"><span><a href="#" onclick="hideDivLayoutPopupReceiverList(this)">' + Message.close + '</a></span></div>'		
									   +   '		</div>'
									   +   '	</div>'
									   +   '	<div class="tooltipBtm">'
									   +   '		<div class="lb"></div>'
									   +   '	</div>'
									   +   '</div>'
							           ;	   
	$('body').append(divToolTipLayoutPopupContents);
	$('#divLayoutPopupContentsReceiverList'+ wndName).css("z-index",zIndex);
	$('#divLayoutPopupContentsReceiverList'+ wndName).css("left",left);
	$('#divLayoutPopupContentsReceiverList'+ wndName).css("top",top);
	
	if(draggable == null || draggable == '' || draggable == 'false' || !draggable) {
		// Do nothing..!!
		
	} else {
		//$('#divLayoutPopupContentsReceiverList'+ wndName).draggable({handle: '#ComponentHandler'+ wndName, iframeFix: true});
	}	
	return wndName;
}
function hideDivLayoutPopupReceiverList(obj) {
	var divLayoutPopupReceiverListNamesLength = divLayoutPopupReceiverListNames.length;
	for(var i=0; i < divLayoutPopupReceiverListNamesLength; i++) {
		var wndName = divLayoutPopupReceiverListNames[i];
		divLayoutPopupReceiverListNames[i] = '';
		$('#divLayoutPopupContentsReceiverList'+ wndName).attr("outerHTML","");
		$('#divLayoutPopupContentsReceiverList'+ wndName).css("top","0px");
		$('#divLayoutPopupContentsReceiverList'+ wndName).css("left","0px");
		$('#divLayoutPopupContentsReceiverList'+ wndName).css("width","0px");
		$('#divLayoutPopupContentsReceiverList'+ wndName).css("height","0px");
		$('#divLayoutPopupContentsReceiverList'+ wndName).css("position","absolute");
		$('#divLayoutPopupContentsReceiverList'+ wndName).css("z-index","1");
		$('#divLayoutPopupContentsReceiverList'+ wndName).css("visibility","hidden");
	}
}


function hideDivLayoutPopupFileInfo(obj) {
	var divLayoutPopupFileInfoNamesLength = divLayoutPopupFileInfoNames.length;
	for(var i=0; i < divLayoutPopupFileInfoNamesLength; i++) {
		var wndName = divLayoutPopupFileInfoNames[i];
		divLayoutPopupFileInfoNames[i] = '';
		
		$('#divLayoutPopupContentsFileInfo'+ wndName).attr("outerHTML","");
		
		// CSS
		$('#divLayoutPopupContentsFileInfo'+ wndName).css("top","0px");
		$('#divLayoutPopupContentsFileInfo'+ wndName).css("left","0px");
		$('#divLayoutPopupContentsFileInfo'+ wndName).css("width","0px");
		$('#divLayoutPopupContentsFileInfo'+ wndName).css("height","0px");

		$('#divLayoutPopupContentsFileInfo'+ wndName).css("position","absolute");
		$('#divLayoutPopupContentsFileInfo'+ wndName).css("z-index","1");
		$('#divLayoutPopupContentsFileInfo'+ wndName).css("visibility","hidden");

	}
	
	
}

function hideDivLayoutPopupSupercom(obj) {
	var divLayoutPopupSupercomNamesLength = divLayoutPopupSupercomNames.length;
	for(var i=0; i < divLayoutPopupSupercomNamesLength; i++) {
		var wndName = divLayoutPopupSupercomNames[i];
		divLayoutPopupSupercomNames[i] = '';
		
		$('#divLayoutPopupContentsSupercom'+ wndName).attr("outerHTML","");
		
		// CSS
		$('#divLayoutPopupContentsSupercom'+ wndName).css("top","0px");
		$('#divLayoutPopupContentsSupercom'+ wndName).css("left","0px");
		$('#divLayoutPopupContentsSupercom'+ wndName).css("width","0px");
		$('#divLayoutPopupContentsSupercom'+ wndName).css("height","0px");

		$('#divLayoutPopupContentsSupercom'+ wndName).css("position","absolute");
		$('#divLayoutPopupContentsSupercom'+ wndName).css("z-index","1");
		$('#divLayoutPopupContentsSupercom'+ wndName).css("visibility","hidden");

	}
	
	
}

/****************************************************************
*	Function Name:	isNull
*	Description:	text 공백 체크
*	Return:			boolean
***************************************************************/
function isNull(obj){
    if (obj.value == null || obj.value == ""){
          return true;
    }else{
          return false;
    }
}

/****************************************************************
*	Function Name:	isUpperAlpha
*	Description:	대문자 알파펫 체크
*	Return:			containsCharsOnly(obj, chars)
***************************************************************/
function isUpperAlpha(obj){
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return containsCharsOnly(obj, chars);
}

/****************************************************************
*	Function Name:	containsCharsOnly
*	Description:	입력값이 특정 문자로 되어 있는지 체크
*	Return:			boolean
***************************************************************/
function containsCharsOnly(obj, chars){
    for (var i=0; i < obj.value.length; i++){
          if (chars.indexOf(obj.value.charAt(i)) == -1){
                 return false;
          }
    }
    return true;
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
        tooltipPopup.document.createStyleSheet(contextPath + '/css/dfx_core.css');
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

//	var width = '';
//	var height = '';
//	var top = '';
//	var left = '';
//	var title = '';
//	var resizable ='';
//
//	var props = wndProp.split(',');
//	for (var i=0; i < props.length; i++) {
//		var prop = props[i].split('=');
//		var propName = prop[0];
//		var propValue = prop[1];
//
//		propName = propName.replace(' ','');
//		propValue = propValue.replace(' ','');
//
//		if (propName == 'width') {
//			width = propValue;
//		} else if (propName == 'height') {
//			height = propValue;
//		} else if (propName == 'top') {
//			top = propValue;
//		} else if (propName == 'left') {
//			left = propValue;
//		}else if (propName == 'resizable') {
//			resizable = propValue;
//		}
//	}
//
//	if (width == '') {
//		width = '600';
//		wndProp += ',width='+width;
//	}
//
//	if (height == '') {
//		height = '500';
//		wndProp += ',height='+height;
//	}
//
//	if (top == '') {
//		top = (screen.height) ? (screen.height-height)/2 : 0;
//		wndProp += ',top='+top;
//	}
//
//	if (left == '') {
//		left = (screen.width) ? (screen.width-width)/2 : 0;
//		wndProp += ',left='+left;
//	}
//	
//	if(actionUrl != null && actionUrl != "") {
//		actionUrl = makePopUpUrl(actionUrl);
//	}

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
				eval(objName+'.'+callback+'('+result+');');
			}
			else{
				eval(objName+'.'+callback+'("'+result+'");');
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
			
		}
		
	};


	/****************************************************************
	* Flex 다국어 처리
	* @author 	민혜영()
	* @return   args[0]  팝업 settion 객체
	***************************************************************/	


	/****************************************************************
	* Flex->Html 팝업 호출
	*
	* @author 	한제호(jeho.han)
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
	* @author 	박은중(eunjung77.park)
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
	* @author 	한제호(jeho.han)
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
	* @author 	한제호(jeho.han)
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
					var winTitle ="PLM";
					
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
				var msgType = "CONFIRM";
				var winTitle ="PLM";
				
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
				contentWidth = defaultWidth;
				
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
				var winTitle ="PLM";
				
				if(title != null && typeof(title)!='undefined' && title !=""){
					winTitle = title;
				}
				
				return this.showMessageBox(encodeURIComponent(winTitle), "ALERT", height, width);
			}else{
				return null;
			}
		},
		
		
		
		showConfirm : function(title, type, height, width){
			var msgType = "CONFIRM";
			var winTitle ="PLM";
			
			if(type != null && typeof(type)!='undefined' && type !="" && type !='undefined'){
				msgType = type;
			}
			if(title != null && typeof(title)!='undefined' && title !="" && title!='undefined'){
				winTitle = title;
			}			
			return this.showMessageBox(encodeURIComponent(winTitle), encodeURIComponent(msgType), height, width);
		},
		
		
		
		showMessageBox : function( title, msgType, height, width){
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
			contentWidth = defaultWidth;
			
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
				var ploadingbar = parent.document.getElementById("loadingBar");
				if(typeof(ploadingbar) != "undefined" && ploadingbar != null){
					if($(ploadingbar).css("display") == "none"){
						parent.loadingType="iframe";
						ploadingbar.style.display = "block";
					}
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
			}
	};
	
	var PjtShowMessage = {	                                                                                                                                                           
            
			showAlert : function(msg, title, height, width) {                                                                                                                              
				if(msg != null && typeof(msg)!='undefined' && msg !="" && msg !='null'){                                                                                                     
					var winTitle ="PLM";                                                                                                                                                       
					                                                                                                                                                                           
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
				var winTitle ="PLM";                                                                                                                                                         
				                                                                                                                                                                             
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
	
	//TC 데이터 추가 
	//2011.02.08 jaesuk.jung CallbackFn, fileType 추가
	function gfn_tcDataAddPop(callBackFn, fileType, section){
		var w  = 800;
		var h  = 565;
		var url = contextPath + "/common/tcIF/tcIF.do?method=getTcDataSearch&callBackFn="+callBackFn+"&fileType="+fileType+"&section="+section;
		var properties = "width=" + w + ", height=" + h + ", scrollbars=no, status=yes";	
			
		showWindow(url, "TcDataSearchPop", properties, "WIN-POPUP");	
	}
	
	//TC 데이터 추가 Callback function
	//obj         : TC 검색 트리에서 선택된 아이템
	//fileType    : 파일 유형(ALL, 3D, 2D, DOC, 3DSCAN, REQUEST,공백)
	//section     : 호출 섹션
	//excludeNode : 검증에서 제외할 아이템
	function lfn_tcDataAddCB(obj, fileType, section, excludeNode){
		var tcData       = new Array();
		var excludeItems = null;

		if(fileType != ''){			
			for(var i=0;i<obj.length;i++){
				tcData[i] = obj[i].itemPuid+
				','+obj[i].itemId+
				','+obj[i].itemName+
				','+obj[i].revPuid+
				','+obj[i].revId+
				','+obj[i].itemType+
				','+obj[i].className+'\n';
			}
			
			if(excludeNode && excludeNode.length > 0){
				excludeItems = new Array();
				
				for(var i=0;i<excludeNode.length;i++){
					excludeItems[i] = excludeNode[i].itemPuid;
					//','+excludeNode[i].itemId+
					//','+excludeNode[i].itemName+
					//','+excludeNode[i].revPuid+
					//','+excludeNode[i].revId+
					//','+excludeNode[i].itemType+
					//','+excludeNode[i].className+'\n';
				}
			}else {
				excludeItems = '';
			}
			
			/*
			var w  = 800;
			var h  = 565;
			var url = contextPath + "/common/tcIF/tcIF.do?method=getDataset&fileType="+fileType+"&itemLength="+obj.length+"&tcData="+tcData+"&excludeItems="+excludeItems;
			var properties = "width=" + w + ", height=" + h + ", scrollbars=no, status=yes, resizable=no";	
			
			showWindow(url, "TcDataListPop", properties, "WIN-POPUP");
			*/
			
			with(document.forms[0]){
		        action = contextPath + "/common/tcIF/tcIF.do?method=getDataset&fileType="+fileType+"&itemLength="+obj.length+"&tcData="+tcData+"&excludeItems="+excludeItems;
		        target = "TcDataSearchPop";
		        submit();	
			}
		}else{
			for(var i=0;i<obj.length;i++){
				dataJson = {
					opTcId : ''
					,section : section
					,itemPuid : obj[i].itemPuid
					,itemId : obj[i].itemId
					,itemName : obj[i].itemName
					,revPuid : obj[i].revPuid
					,revId : obj[i].revId
					,itemType : obj[i].itemType
					,itemObjectType : ''
					,selected : ''
					,selectedStyle : ''
					,datasetPuid : ''
					,datasetObjectType : ''
					,sourceCadSystem : ''
					,sourceDataType : ''
					,fileName : ''
					,creationDate : ''
					,lastModDate : ''
					,lastModifier : ''
				};
				
				ins_row_tc('new', dataJson, '', '');
			}
		}
	}
	//아이템 선택시 하위 rev item이 적용
	function addTcDataCallBackFn(obj, fileType, section){
	    var isAssy = false;
		var tcData = new Array();
		for(var i=0;i<obj.length;i++){
			tcData[i] = obj[i].itemPuid+
					','+obj[i].itemId+
					','+obj[i].itemName+
					','+obj[i].revPuid+
					','+obj[i].revId+
					','+obj[i].itemType+
					','+obj[i].className+'\n';
			if (obj[i].itemType == 'ASSY') {
				isAssy = true;
			}
		}
		
		var itemList      = null;
		var selectedItems = null;
		var selectedItem  = null;
		var idx           = 0;

		$.ajax({
	        type: 'post',
	        async: true,
	        url :contextPath + "/common/tcIF/tcIF.do?method=getDatasetJson&itemLength="+obj.length+'&fileType='+fileType+"&tcData="+tcData,
	        dataType: "json",
	        success: function(response) {
	            var obj = response;

	            if(obj){
	            	selectedItems = new Array();
                    itemList = obj.partList;
                    
                    if(itemList != null && itemList != "undefined" && itemList != "" ){
	                    for(var i = 0; i < itemList.length; i++){ 
	                    	//alert(section + " , " + itemList[i].itemPuid + " , "+ itemList[i].itemId+" , "+ itemList[i].itemName+" , "+ itemList[i].revPuid+ " , "+itemList[i].revId +  " , "+itemList[i].itemType);
	                    	selectedItem = {
                    			opTcId 				: '',
                    			section 			: section,
								itemPuid   			: itemList[i].itemPuid,
								itemId     			: itemList[i].itemId,
								itemName   			: itemList[i].itemName,
								revPuid    			: itemList[i].revPuid,
								revId      			: itemList[i].revId,    
								itemType   			: itemList[i].itemType, 							
								itemObjectType 		: '',
								selected 			: '',
								selectedStyle		: '',
								datasetPuid 		: '',
								datasetObjectType 	: '',
								sourceCadSystem 	: '',
								sourceDataType 		: '',
								fileName 			: '',
								creationDate 		: '',
								lastModDate 		: '',
								lastModifier 		: ''
							}; 						
	                    	ins_row_tc('new', selectedItem, '', '');			
						}
                    }else{
						alert(Message.confirmUnusualTcData);
					}
	            }
	        },
	        error: function(response, status, err) {
	            alert(response);
	        }
	    });
	}
	
	var isEdited  = false;
	var showAlert = true;
	var unloadMsg;
	var exceptEleName = [];

	//페이지 전환시 경고 메세지
	function unload() {
		if (gfn_checkEdited(document.forms[0])) {
			event.returnValue = unloadMsg;
		} else {
			showAlert = true;
		}
	}
	
	//폼의 수정데이터 여부 체크
	//textarea 에 type 을 주어야 합니다.
	function gfn_checkEdited(form){ 
		var len = form.elements.length;
		var ele = null;
		
		//showAlert이 false 되었을 때는 페이지 전환 경고 메시지를 보여주지 않는다.2011.03.28 jaesuk.jung
		if(!showAlert) return false;
		
		//isEdited가 true 되었을 때는 페이지 전환 경고 메시지를 보여준다.2011.03.29 jaesuk.jung
		if(isEdited) return true;
		
		for (var i = 0 ; i < len ; i++) {
			ele = form.elements[i];
			if(!isExceptEleName(ele.name)) {
				if (ele.tagName == 'SELECT') {
					var optLen = ele.options.length;
					for (var j = 0 ; j < optLen ; j++) {
						if (ele.options[j].defaultSelected != ele.options[j].selected)
							//alert(ele.name + "  , " + ele.options[j].value + " : " + ele.options[j].defaultSelected + " / " + ele.options[j].selected);
							return true;
					}
				} else if (((ele.type == "radio" || ele.type == 'checkbox') && ele.defaultChecked != ele.checked)
						|| ( (ele.type == "text" || ele.type == 'textarea' ) && ele.defaultValue != ele.value)){
					//alert(ele.name +  " : " + ele.defaultValue + " / " + ele.value);
					return true;
				}
			}
		}
		return false;
	}

	// 제외 element name이 존재하는지 체크
	function isExceptEleName(eleName) {
		for (var i = 0; i < exceptEleName.length; i++) {
			if (exceptEleName[i] == eleName) {
				return true;
			}
		}

		return false;
	}

	//PDQ Viewer 설치 및 실행
	function runPdqViewer(moduleId, openFilePath) {
		var w  = 400;
		var h  = 150;
		var url = contextPath + "/common/pdqviewer/pdqviewer.do?method=checkPdqViewer&moduleId="+moduleId+"&openFilePath="+openFilePath;
		var properties = "width=" + w + ", height=" + h + ", scrollbars=no, status=no";	

		showWindow(url, "CheckPDQViewer", properties, "WIN-POPUP");	
	}

	//문자열 길이만큼 자르는 함수
	function gfn_substring(str, maximum) {
	 	var inc = 0;
	 	var nbytes = 0;
	 	var msg = "";
	 	var msglen = str.length;

	 	for (var i=0; i<msglen; i++){
	 		var ch = str.charAt(i);
	 		if (escape(ch).length > 4){
	 			inc = 3;
	 		}else if (ch == '\n'){
	 			if (str.charAt(i-1) != '\r'){
	 				inc = 1;
	 			}
	 		}else if (ch == '<' || ch == '>'){
	 			inc = 4;
	 		}else{
	 			inc = 1;
	 		}

	 		if ((nbytes + inc) > maximum){
	 			break;
	 		}
	 		nbytes += inc;
	 		msg += ch;
	 	}
	 	return msg;
	}
	//UTF-8 데이터 byte로 길이 체크(3bytes)
	function gfn_byteLengthUTF8(bstr){
		var len = getLength(bstr);
		var value = getOrginalValue(bstr);
		for (ii=0; ii<len; ii++){
			xx = value.substr(ii,1).charCodeAt(0);
			if (xx > 127)	len += 2;
		}
		return len;
	}
	//ascii 데이터 byte로 길이 체크(2bytes)
	function gfn_byteLengthASCII(bstr){
		var len = getLength(bstr);
		var value = getOrginalValue(bstr);
		for (ii=0; ii<len; ii++){
			xx = value.substr(ii,1).charCodeAt(0);
			if (xx > 127)	len ++;
		}
		return len;
	}
	//문자열 길이 체크
	function getLength(inFld) {
	    var str = '';
	    
	    if (typeof(inFld) == 'object')
	        str = inFld.value;
	    else str = inFld;
	    
	    return str.length;	
	}
	//value
	function getOrginalValue(inFld) {
		var str = '';
		
		if (typeof(inFld) == 'object')
			str = inFld.value;
		else str = inFld;
		
		return str;	
	}
	//maximum check
	//단순 길이로 체크
	function gfn_strLengthMsg(obj, maximum){
		if(getLength(obj) > maximum){
			alert(maximum + Message.letter + " " + Message.exceed);
			obj.value = obj.value.substr(0, maximum);
		}
	}
	//byte로 체크
	function gfn_strByteLengthMsg(obj, maximum){
		if(gfn_byteLengthASCII(obj) > maximum){
			alert(maximum + "bytes " + Message.exceed);
			obj.value = obj.value.substr(0, obj.value.length-1);
		}
	}
	//byte로 체크(삭제하지 않는 함수)
	function gfn_strByteLengthMsgNamo(obj, maximum){
		if(gfn_byteLengthASCII(obj) > maximum){
			//object가 아닌 경우도 있으므로 추가 wonseok.lee 2011.04.05
			if (typeof(obj) == 'object'){
				//textarea의 Title 명시 jaesuk.jung 2011.04.05
				if(obj.getAttribute("title") && obj.getAttribute("title") != ''){
					alert(obj.getAttribute("title") + " : " + maximum / 1000 + "KB " + Message.exceed);
				}else {
					alert(maximum / 1000 + "KB " + Message.exceed);
				}
			}else{
				alert(maximum / 1000 + "KB " + Message.exceed);
			}
			return false;
		}
		return true;
	}
	
	//Section별 URL을 가져온다.
	function gfn_getSectionUrl(vSection){
		if(!vSection || vSection == '') return;
		
		switch(vSection){
			case "DEX":
				return "/dex/dex.do?method=dexInit&callMenu=T";
			case "REQUEST":
				return "/request/request.do?method=requestInit&callMenu=T";
			case "PDQ":
				return "/pdq/pdq.do?method=pdqInit&callMenu=T";
			case "AUTODMU":
				return "/autodmu/autodmu.do?method=autodmuInit&callMenu=T";
			case "3DSCAN":
				return "/scan3d/scan3d.do?method=3DScanInit&callMenu=T";
		}	
	}
	//XSS tag 제거
	function escapeTagStr(src) {
		if (src == "") return "";
		
		var out = "";
		
		var len = src.length;
		
		for (var i = 0; i < len; i++)
		{
			switch (src.charAt(i)) {
			case '<' :
				out += "&lt;";
				break;
			case '>' :
				out += "&gt;";
				break;
			default :
				out += src.charAt(i);
			}
		}
		return out;
	}
	
	//공지사항 팝업 호출 
	//2012.04.06 jw84.jeon
	function gfn_popupNotic(){
		var Notice = getCookie('Notice');
		if (Notice != 'done')			//done = '오늘 이 창을 다시 열지 않음'
		{
			$.ajax({
				async : false,
				type: "GET",
				url: contextPath+"/dfx/helpdesk/helpdeskBoard.do?method=getPopUpYnReturnJson",
				dataType: 'text',
				success: function(text) {
					if(text == "SUCCESS") {
						var w  = 450;
						var h  = 450;
						var url = contextPath + "/dfx/helpdesk/helpdeskBoard.do?method=getPopupNotice";
						var properties = "width=" + w + ", height=" + h + ", scrollbars=no, status=yes, resize=no";	
						
						showWindow(url, "popupNotice", properties, "WIN-POPUP");
					}
				}
			});
		}
	}

	function getCookie(name) {
	   var from_idx = document.cookie.indexOf(name+'=');
	   if (from_idx != -1) { 
	      from_idx += name.length + 1;
	      to_idx = document.cookie.indexOf(';', from_idx) ;

	      if (to_idx == -1) {
	            to_idx = document.cookie.length;
	      }
	      return unescape(document.cookie.substring(from_idx, to_idx));
	   }
	}
	
	function setCookie (name, value, expires) 
	{
		document.cookie = name + "=" + escape (value) + "; path=/; expires=" + expires.toGMTString();
	}
	
	
	var arrLine = new Array();
	function selectedFile(line)
	{
		arrLine.push(line);
	}
	
	function selectFileDone() {
		parent.selectedSupercom(arrLine);
		hideDivLayoutPopupSupercom();
	}