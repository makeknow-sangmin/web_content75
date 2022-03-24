var $JQ = jQuery.noConflict(); 

var DEBUG_MODE=true;
function DEBUG_ALERT(msg)
{
	if(DEBUG_MODE==true) {
		alert(msg);
	}
}
//DWR 203 호환
function CommonInfo_getForward(loadforward, page_path)
{

	page_path = page_path + "&weblog_input=" + weblog_call_path_buf;
	if(this_page!=null) {
		page_path = page_path + "&this_page=" + this_page;
	}
	CommonInfo.getForward(page_path, loadforward);
}

//안전하게 값지정
function SafeSetValue(id, value)
{
	var obj = $(id);
	if(obj != null && obj!=undefined)
	{
		DWRUtil.setValue(id, value, { escapeHtml:false } );
	} else {//JQUERY 확인
		try {
			$('#'+id).val(value);
		} catch(e){}
	}
}

//안전하게 값 가져오기
function SafeGetValue(id)
{
	var getted = ''
	try {
		getted =  DWRUtil.getValue(id);
	}  catch(err) {
		getted = '';
    }
    return getted;
}
	
function NiftyCheck(){
if(!document.getElementById || !document.createElement)
    return(false);
var b=navigator.userAgent.toLowerCase();
if(b.indexOf("msie 5")>0 && b.indexOf("opera")==-1)
    return(false);
return(true);
}

function Rounded(selector,bk,color,size){
var i;
var v=getElementsBySelector(selector);
var l=v.length;
for(i=0;i<l;i++){
    AddTop(v[i],bk,color,size);
    AddBottom(v[i],bk,color,size);
    }
}

function RoundedTop(selector,bk,color,size){
var i;
var v=getElementsBySelector(selector);
for(i=0;i<v.length;i++)
    AddTop(v[i],bk,color,size);
}

function RoundedBottom(selector,bk,color,size){
var i;
var v=getElementsBySelector(selector);
for(i=0;i<v.length;i++)
    AddBottom(v[i],bk,color,size);
}

function AddTop(el,bk,color,size){
var i;
var d=document.createElement("b");
var cn="r";
var lim=4;
if(size && size=="small"){ cn="rs"; lim=2}
d.className="rtop";
d.style.backgroundColor=bk;
for(i=1;i<=lim;i++){
    var x=document.createElement("b");
    x.className=cn + i;
    x.style.backgroundColor=color;
    d.appendChild(x);
    }
el.insertBefore(d,el.firstChild);
}

function AddBottom(el,bk,color,size){
var i;
var d=document.createElement("b");
var cn="r";
var lim=4;
if(size && size=="small"){ cn="rs"; lim=2}
d.className="rbottom";
d.style.backgroundColor=bk;
for(i=lim;i>0;i--){
    var x=document.createElement("b");
    x.className=cn + i;
    x.style.backgroundColor=color;
    d.appendChild(x);
    }
el.appendChild(d,el.firstChild);
}

function getElementsBySelector(selector){
var i;
var s=[];
var selid="";
var selclass="";
var tag=selector;
var objlist=[];
if(selector.indexOf(" ")>0){  //descendant selector like "tag#id tag"
    s=selector.split(" ");
    var fs=s[0].split("#");
    if(fs.length==1) return(objlist);
    return(document.getElementById(fs[1]).getElementsByTagName(s[1]));
    }
if(selector.indexOf("#")>0){ //id selector like "tag#id"
    s=selector.split("#");
    tag=s[0];
    selid=s[1];
    }
if(selid!=""){
    objlist.push(document.getElementById(selid));
    return(objlist);
    }
if(selector.indexOf(".")>0){  //class selector like "tag.class"
    s=selector.split(".");
    tag=s[0];
    selclass=s[1];
    }
var v=document.getElementsByTagName(tag);  // tag selector like "tag"
if(selclass=="")
    return(v);
for(i=0;i<v.length;i++){
    if(v[i].className==selclass){
        objlist.push(v[i]);
        }
    }
return(objlist);
}

function addButtonMenu(id, label, java_fc )
{
	id = id + "-" + serial_no; serial_no++;

	StrButtonMenu = StrButtonMenu + "<span style='width:1;'></span>";//??
	StrButtonMenu = StrButtonMenu + "<span id=" + id;
	StrButtonMenu = StrButtonMenu + " align=center><input type=button class=main_button_small value=" +  label + " onclick='";
	StrButtonMenu = StrButtonMenu + java_fc + "()'>";
	StrButtonMenu = StrButtonMenu + "</span>";
	StrButtonMenu = StrButtonMenu + "<span style='width:1;'></span>";//??
	
	/*
	StrButtonMenu = StrButtonMenu + "<span style='width:5;'></span>";//??
	StrButtonMenu = StrButtonMenu + "<span id=" + id;
	StrButtonMenu = StrButtonMenu + " align=center><a href='javascript:";
	StrButtonMenu = StrButtonMenu + java_fc + "()'>";
	StrButtonMenu = StrButtonMenu + label + "</a></span>";
	StrButtonMenu = StrButtonMenu + "<span style='width:5;'></span>";//??
	*/
}

paramfield = new Array();
paramvalue = new Array();
function srchParse(from_search)
{
	param = from_search.split(";");
	
	for(i = 0; i < param.length; i++)
	{	
		if(z = param[i].indexOf("="))
		{
			if(z != -1)
			{
				paramfield[i] = param[i].substring(0,z); 
				paramvalue[i] = param[i].substring(z+1,param[i].length);
			}
		}
		
	}		

}



function startSearchNoForm()
{
	from_search = SafeGetValue("from_values");
	srchParse(from_search); //List에 파싱해놓음.
		
	StrSearchForm = "<div id='nifty' style='width:946;'>";
	StrSearchForm = StrSearchForm + "<input type='hidden' name = 'page' value='0'>";
	
}

function endSearchNoForm()
{
	StrSearchForm = StrSearchForm + "</div>";
}
//Server에 보낼 필드명 저장
var field_names='';
function getPrevDefValue(id)
{
	
	for(i = 0; i < paramfield.length; i++)
	{
		if(paramfield[i] == id)
		{
			return paramvalue[i];
		}
	}

	return "";

}

function startSearchForm()
{
	from_search = SafeGetValue("from_values");
	srchParse(from_search);//List에 파싱해놓음.
	
	GQuanOfSrchInput = 0;
	
	StrSearchForm = "<form name=generalSearchForm method='post' enctype='multipart/form-data'><input type=hidden name=srchViewType value=JSP><div id='nifty' style='width:990;'>"; 
	StrSearchForm = StrSearchForm + "<input type='hidden' name = 'page' value='0'>";
	StrSearchForm = StrSearchForm + "<table border=0 cellspacing=0>";
	StrSearchForm = StrSearchForm + 		"<colgroup>";
	StrSearchForm = StrSearchForm + 	"<col class=percent_33>";
	StrSearchForm = StrSearchForm + 	"<col class=percent_33><col>";
	StrSearchForm = StrSearchForm + 		"</colgroup>";
}

function resetValue(id) {
	SafeSetValue(id, '');;
}

function addSearchForm(id, label, java_fc)
{
	var def_value = getPrevDefValue(id);
	
	var residue = GQuanOfSrchInput%3;
	
	if(residue==0) {
		StrSearchForm = StrSearchForm + "<tr>";
	}
	
	StrSearchForm = StrSearchForm + "<td><table border=0 cellspacing=0>";
	StrSearchForm = StrSearchForm + 		"<colgroup>";
	StrSearchForm = StrSearchForm + 	"<col class=percent_35>";
	StrSearchForm = StrSearchForm + 	"<col>";
	StrSearchForm = StrSearchForm + 		"</colgroup>";
	StrSearchForm = StrSearchForm + 		"<tr><td><div style='vertical-align:middle;height:25;line-height: 150%;text-align:right;margin-right: 10px'>" + label + " <a title=초기화 href='javascript:resetValue(" + '"' + id+ '"' + ");' style='font-size:12px;'>*</a></div></td>";
	StrSearchForm = StrSearchForm + "<td><div style='vertical-align:middle;height:25;line-height: 150%;'><input type=text name='" + id;
    StrSearchForm = StrSearchForm + "' value = '"+def_value+"' onkeypress='DWRUtil.onReturn(event, " + java_fc + ")'";
	StrSearchForm = StrSearchForm + " class='light_input' size='33'>";
	StrSearchForm = StrSearchForm + " </div></td></tr></table></td>";
	
	if(residue==2) {
		StrSearchForm = StrSearchForm + "</tr>";
	}
	
	GQuanOfSrchInput++;
	
	
	
	//서버에 보낼 필드명 저장
	field_names += id + ";";
}

function addCalendarSetup(idIn) {
	var id1 = idIn + '1';
	var id2 = idIn + '2';
	Calendar.setup({inputField : id1, ifFormat : "%Y/%m/%d", button : id1 + "_calendar" });
	Calendar.setup({inputField : id2, ifFormat : "%Y/%m/%d", button : id2 + "_calendar" });

}

function resetPeriodValue(idIn) {
	var id1 = idIn + '1';
	var id2 = idIn + '2';
	
	SafeSetValue(id1, '');
	SafeSetValue(id2, '');
}


function addSearchDate(idIn, label, java_fc)
{
	var id1 = idIn + '1';
	var id2 = idIn + '2';
	
	var def_value1 = getPrevDefValue(id1);
	var def_value2 = getPrevDefValue(id2);
	
	var residue = GQuanOfSrchInput%3;
	
	if(residue==0) {
		StrSearchForm = StrSearchForm + "<tr>";
	}
	
	StrSearchForm = StrSearchForm + "<td><table border=0 cellspacing=0>";
	StrSearchForm = StrSearchForm + 		"<colgroup>";
	StrSearchForm = StrSearchForm + 	"<col class=percent_35>";
	StrSearchForm = StrSearchForm + 	"<col>";
	StrSearchForm = StrSearchForm + 		"</colgroup>";
	StrSearchForm = StrSearchForm + 		"<tr><td><div style='vertical-align:middle;height:25;line-height: 150%;text-align:right;margin-right: 10px'>" + label  + " <a title=초기화 href='javascript:resetPeriodValue(" + '"' + idIn + '"' + ");' style='font-size:12px;'>*</a></div></td>";
	StrSearchForm = StrSearchForm + "<td><div style='vertical-align:middle;height:25;line-height: 150%;'>";
	StrSearchForm = StrSearchForm + "<input type=text name='" + id1;
    StrSearchForm = StrSearchForm + "' value = '"+def_value1+"' onkeypress='DWRUtil.onReturn(event, " + java_fc + ")'";
	StrSearchForm = StrSearchForm + " class='light_input' size='9'>";
	StrSearchForm = StrSearchForm + '<img src="./media/calendar_imk.gif" width="16" height="15" id="' + id1 + '_calendar' + '" style="cursor: pointer;"/>';
	StrSearchForm = StrSearchForm + " ~ ";
	StrSearchForm = StrSearchForm + "<input type=text name='" + id2;
    StrSearchForm = StrSearchForm + "' value = '"+def_value2+"' onkeypress='DWRUtil.onReturn(event, " + java_fc + ")'";
	StrSearchForm = StrSearchForm + " class='light_input' size='9'>";
	StrSearchForm = StrSearchForm + '<img src="./media/calendar_imk.gif" width="16" height="15" id="' + id2 + '_calendar' + '" style="cursor: pointer;"/>';

	StrSearchForm = StrSearchForm + " </div></td></tr></table></td>";
		
	if(residue==2) {
		StrSearchForm = StrSearchForm + "</tr>";
	}
	
	GQuanOfSrchInput++;
	
	//서버에 보낼 필드명 저장
	field_names += id1 + ";";

	//서버에 보낼 필드명 저장
	field_names += id2 + ";";
}

function addBlankForm()
{

	var residue = GQuanOfSrchInput%3;
	
	if(residue==0) {
		StrSearchForm = StrSearchForm + "<tr>";
	}
	
	StrSearchForm = StrSearchForm + "<td><table border=0 cellspacing=0><tr><td><div style='vertical-align:middle;height:25;line-height: 150%;text-align:right;margin-right: 10px'>" + "&nbsp;" + "</div></td>";
	StrSearchForm = StrSearchForm + "<td><div style='vertical-align:middle;height:25;line-height: 150%;'>";
	StrSearchForm = StrSearchForm + " </div></td></tr></table></td>";
	
	if(residue==2) {
		StrSearchForm = StrSearchForm + "</tr>";
	}
	
	GQuanOfSrchInput++;
}

function endSearchForm()
{
	var residue = GQuanOfSrchInput%3;
	
	if(residue==0) {
		StrSearchForm = StrSearchForm + "</table>";
	} else if(residue==1){
		StrSearchForm = StrSearchForm + "<td></td></tr></table>";
	} else {
		StrSearchForm = StrSearchForm + "<td></td><td></td></tr></table>";
	}

	
	StrSearchForm = StrSearchForm + "</div></form>";
}

function addSearchSelect(id, label, java_fc, option_arr)
{

	var def_value = getPrevDefValue(id);
	
	var residue = GQuanOfSrchInput%3;
	
	if(residue==0) {
		StrSearchForm = StrSearchForm + "<tr>";
	}
	
	StrSearchForm = StrSearchForm + "<td ><table border=0 cellspacing=0>";
	StrSearchForm = StrSearchForm + 		"<colgroup>";
	StrSearchForm = StrSearchForm + 	"<col class=percent_35>";
	StrSearchForm = StrSearchForm + 	"<col>";
	StrSearchForm = StrSearchForm + 		"</colgroup>";
	StrSearchForm = StrSearchForm +		"<tr><td><div style='vertical-align:middle;height:25;line-height: 150%;text-align:right;margin-right: 10px'>" + label + "</div></td>";
	StrSearchForm = StrSearchForm + "<td><div style='vertical-align:middle;height:25;line-height: 150%;'><select style='width:187;' name='" + id;
    StrSearchForm = StrSearchForm + "' value = '"+def_value+"' onkeypress='DWRUtil.onReturn(event, " + java_fc + ")'";
	StrSearchForm = StrSearchForm + " class='light_input'>";
	
	for(i = 0; i < option_arr[0].length; i++)
	{
		StrSearchForm = StrSearchForm + "<option ";
		if(def_value==option_arr[1][i])
		{
			StrSearchForm = StrSearchForm + " selected ";
		}
		StrSearchForm = StrSearchForm + " value='" + option_arr[1][i] + "' title='" + option_arr[0][i] + "'>" + option_arr[0][i] + "</option>";
	}
	StrSearchForm = StrSearchForm + " </select></div></td></tr></table></td>";
	
	
	if(residue==2) {
		StrSearchForm = StrSearchForm + "</tr>";
	}
	
	GQuanOfSrchInput++;
	
	//서버에 보낼 필드명 저장
	field_names += id + ";";

}













var varTimer;

r_color = "111178871111";
g_color = "fca866668acf";
b_color = "111178871111";
function fadein(pos){

	r = r_color.charAt(pos);
	g = g_color.charAt(pos);
	b = b_color.charAt(pos);
	
	my_color = "#"  + r + r + g + g + b + b ;
	my_color1 = "#"  + r + r + b + b + g + g ;

	$("marquee").style.background = my_color;
	//$("doingbar").style.borderColor = my_color1;
	//$("marquee").style.filter = "progid:DXImageTransform.Microsoft.Gradient(GradientType=1, StartColorStr="
	//	+ my_color +", EndColorStr=white)";


}
function doingProcessInter()
{
	fadein(varTimer%12);
	varTimer++;
}

function canSubmit()
{
	can_submit = true;
}

function doingProcess()
{
	//$("border_line_range").style.visibility = "";
	//$("search_condition").style.visibility = "hidden";
	//$("body_range").style.visibility = "hidden";
	//can_submit = false;
	varTimer=0;
	//alert(GwaitingMessage);
	SafeSetValue("button_menu", GwaitingMessage	 );
	$("marquee").style.background = '#11ffcc';
	setInterval("doingProcessInter()", 100);

}

function doGeneralSearchSubmit()
{
	SafeSetValue("srchViewType", "JSP");
	var action_para= menu_group_name_dis + ".html?cmdKey=" + menu_type + "&from_search=true&fieldnames=" + field_names;
	document.generalSearchForm.action=action_para;
	doingProcess();
	document.generalSearchForm.submit();
}

function Block(nowpage)
{
	SafeSetValue("page", nowpage);
	doGeneralSearchSubmit();
}

function doGeneralSearchReset()
{
	document.generalSearchForm.reset();
}


//현석 : 검색창 만들기.

//parameter : inputbox name, inputbox size, java_fc, 처음html, 마지막html, inputbox value
function addSearchForm2(ars_name, ars_lable, ars_size, java_fc, ars_html1, ars_html2, ars_value)
{
	StrSearchForm = StrSearchForm + ars_html1;
	StrSearchForm = StrSearchForm + "<span style='vertical-align:middle;height:25;line-height: 150%;width:118;text-align:right;margin-right: 10px'>" + ars_lable + "</span>";
	StrSearchForm = StrSearchForm + "<span style='vertical-align:middle;background-color:white;height:25;line-height: 150%;width:" + ars_size + ";'>";
	StrSearchForm = StrSearchForm + "<input type=text name='" + ars_name;
	StrSearchForm = StrSearchForm + "' value='" + ars_value + "' onkeypress='DWRUtil.onReturn(event, " + java_fc + ")'";
	StrSearchForm = StrSearchForm + " class='light_input' size='" + ars_size + "'>" + "</span>";
	StrSearchForm = StrSearchForm + ars_html2;
}

//jstl로 selected 체크함.
function addSearchFormSelectBox(ars_name, ars_lable, ars_size, java_fc, ars_html1, ars_html2, ars_value, ars_array){

	StrSearchForm = StrSearchForm + ars_html1;
	StrSearchForm = StrSearchForm + "<span style='vertical-align:middle;height:25;line-height: 150%;width:118;text-align:right;margin-right: 10px'>" + ars_lable + "</span>";	
	StrSearchForm = StrSearchForm + "<span style='vertical-align:middle;height:25;line-height: 150%;width:" + ars_size + ";'>";
	StrSearchForm = StrSearchForm + "<select name='" + ars_name + "' style='width:" + ars_size + ";'>";

	for(var i=0; i<ars_array[0].length; i++){
		StrSearchForm = StrSearchForm + "<option value='" + ars_array[1][i] + "'>" + ars_array[0][i] + "</option>";
	}
	StrSearchForm = StrSearchForm + "</select>";
	StrSearchForm = StrSearchForm + "</span>";
	StrSearchForm = StrSearchForm + ars_html2;	
}



//  배열일때 와 배열이 아닐때
function chkObj(name , i){
 var objID   = document.GeneralBaseForm1.elements[name];
 return (objID.length > 0 ? objID[i] : objID);
}//end method 


 /*
 * 06.3.14 
 * hyun suk oh
 * 카트체크갯수구하기
 */

// 체크박스에 체크한 총 갯수
function checkCount(){
	var count = 0;
	var cntAll = checkCountAll();
	
	if(cntAll > 0){
		for (var i=0; i < cntAll; i++){
		  if(this.chkObj("chkBox",i).checked){
		   ++count;
		  }
		}
		return count;
	}else{
		return 0;
	}

}//end function 


 /*
 * 06.3.14 
 * hyun suk oh
 * 모든카트갯수구하기
 */

function checkCountAll()
{
	var lo_form = document.GeneralBaseForm1;
	var count = 1;
	var lo_check = lo_form.elements["chkBox"];

	if(lo_check == null)
		return count = 0;
		
	if(lo_check.length>1)
		count = lo_check.length;
	return count;
}

/*
function checkCountAll1(lo_form)
{
	var count = 0;
	for(var i = 0; i<lo_form.elements.length; i++)
	{
		if(lo_form.elements[i].type == "checkbox" && lo_form.elements[i].name == "chkBox")
		{
			count++;
		}
	}
	return count;
}
*/

//위의 함수를 개선한 것
function checkCountAll1(lo_form)
{
	var lo_check = lo_form.elements["chkBox"];

	if(lo_check == null)
		return 0;
		
	return lo_check.length;

}


 /*
 * 06.3.14 
 * hyun suk oh
 * 카트에 저장하기.
 */
function doGeneralCartSet()
{

	var lo_form = document.GeneralBaseForm1;
	var checkCnt =  checkCount();

	if(checkCnt <= 0)
	{
		alert("no item selected");
		return; 
	}

	action_para = "materialc.html?cmdKey=mtd018-add,d-result";

	lo_form.action = action_para;
	doingProcess();
	lo_form.submit();		
}


 /*
 * 06.3.16 
 * hyun suk oh 
 */
function doGeneralCartList()
{
	var lo_form = document.generalSearchForm;
	action_para = "materialc.html?cmdKey=mtd018";

	lo_form.action = action_para;
	doingProcess();
	lo_form.submit();
}


 /*
 * 06.3.14 
 * hyun suk oh
 */
function checkAll()
{
	var lo_form = document.GeneralBaseForm1;
	var check = lo_form.chkAll.checked;
	var checkCnt = checkCountAll();
	
	var retStr = '';
	
	if(check == true){
		retStr = 'Y';
		for(var i = 0; i<checkCnt; i++){
			var myObj = this.chkObj("chkBox",i);
			retStr = retStr + ':' + myObj.value;
			if(myObj.disabled == false){
				myObj.checked = true;
			}
		}
	}else {
		retStr = 'N';
		for(var i = 0; i<checkCnt; i++){
			var myObj = this.chkObj("chkBox",i);
			retStr = retStr + ':' + myObj.value;
			if(myObj.disabled == false){
				myObj.checked = false;
			}
		}
	}
	
	return retStr;
}

function checkAllN()
{
	var lo_form = document.GeneralBaseForm1;
	var check = lo_form.chkAll.checked;
	var checkCnt = checkCountAll();
	
	var retStr = '';
	
	if(check == true){
		retStr = 'N';
		for(var i = 0; i<checkCnt; i++){
			var myObj = this.chkObj("chkBox",i);
			retStr = retStr + ':' + myObj.value;
			if(myObj.disabled == false){
				myObj.checked = true;
			}
		}
	}else {
		retStr = 'Y';
		for(var i = 0; i<checkCnt; i++){
			var myObj = this.chkObj("chkBox",i);
			retStr = retStr + ':' + myObj.value;
			if(myObj.disabled == false){
				myObj.checked = false;
			}
		}
	}
	
	return retStr;
}


//06.04.11 이미지 팝업 Hwankyu.Kang
function imageview(imgPath)
{
	var windowprops = "height=350,width=450,toolbar=no,menubar=no,resizable=no,status=no";
	url = "/media/popup/image_view.jsp?image="+imgPath;
	window.open(url, "win", windowprops);
}

//06.05.15	Aram.Lee
//text/html
function edit(str)
{
	var strbuff = str;
	while(strbuff.indexOf('&lt;') != -1)
	{
		 strbuff = strbuff.replace('&lt;','<');
	}
	while(strbuff.indexOf('&gt;') != -1)
	{
		strbuff = strbuff.replace('&gt;','>');
	}
	while(strbuff.indexOf('&#039;') != -1)
	{
		strbuff = strbuff.replace("&#039;","'");
	}
	while(strbuff.indexOf('&amp;') != -1)
	{
		strbuff = strbuff.replace("&amp;","");
	}
	while(strbuff.indexOf('\r\n') != -1)
	{
		strbuff = strbuff.replace("\r\n","<br>");
	}
	while(strbuff.indexOf(' ') != -1)
	{
		strbuff = strbuff.replace(" ","&nbsp;");
	}
		
 		 
	return strbuff;
	
}

function changeCR(str)
{
	var strbuff = str;

	while(strbuff.indexOf('\r\n') != -1)
	{
		strbuff = strbuff.replace("\r\n","<br>");
	}
	while(strbuff.indexOf('\n') != -1)
	{
		strbuff = strbuff.replace("\n","<br>");
	}
 
	return strbuff;
	
}

	
function edit2(str)
{
	var strbuff = str;
	while(strbuff.indexOf('&lt;br&gt;') != -1)
	{
		strbuff = strbuff.replace("&lt;br&gt;","<br>");
	}
	while(strbuff.indexOf(' ') != -1)
	{
		strbuff = strbuff.replace(" ","&nbsp;");
	}
	return strbuff;
}

/**
 * 자바스크립트 공통함수
 *
 * 주의: 아래의 모든 메소드는 입력폼의 필드이름(myform.myfield)을
 *       파라미터로 받는다. 필드의 값(myform.myfield.value)이 아님을
 *       유념할 것.
 *
 */


/**
 * 입력값이 NULL인지 체크
 */
function isNull(input) {
    if (input.value == null || input.value == "") {
        return true;
    }
    return false;
}

/**
 * 입력값에 스페이스 이외의 의미있는 값이 있는지 체크
 */
function isEmpty(input) {
    if (input.value == null || input.value.replace(/ /gi,"") == "") {
        return true;
    }
    return false;
}

/**
 * 입력값에 특정 문자(chars)가 있는지 체크
 * 특정 문자를 허용하지 않으려 할 때 사용
 * ex) if (containsChars(form.name,"!,*&^%$#@~;")) {
 *         alert("이름 필드에는 특수 문자를 사용할 수 없습니다.");
 *     }
 */
function containsChars(input,chars) {
    for (var inx = 0; inx < input.value.length; inx++) {
       if (chars.indexOf(input.value.charAt(inx)) != -1)
           return true;
    }
    return false;
}

/**
 * 입력값이 특정 문자(chars)만으로 되어있는지 체크
 * 특정 문자만 허용하려 할 때 사용
 * ex) if (!containsCharsOnly(form.blood,"ABO")) {
 *         alert("혈액형 필드에는 A,B,O 문자만 사용할 수 있습니다.");
 *     }
 */
function containsCharsOnly(input,chars) {
    for (var inx = 0; inx < input.value.length; inx++) {
       if (chars.indexOf(input.value.charAt(inx)) == -1)
           return false;
    }
    return true;
}
function containsCharsOnlyStr(input_str,chars) {
    for (var inx = 0; inx < input_str.length; inx++) {
       if (chars.indexOf(input_str.charAt(inx)) == -1)
           return false;
    }
    return true;
}

/**
 * 입력값이 알파벳인지 체크
 * 아래 isAlphabet() 부터 isNumComma()까지의 메소드가
 * 자주 쓰이는 경우에는 var chars 변수를 
 * global 변수로 선언하고 사용하도록 한다.
 * ex) var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
 *     var lowercase = "abcdefghijklmnopqrstuvwxyz"; 
 *     var number    = "0123456789";
 *     function isAlphaNum(input) {
 *         var chars = uppercase + lowercase + number;
 *         return containsCharsOnly(input,chars);
 *     }
 */
function isAlphabet(input) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return containsCharsOnly(input,chars);
}

/**
 * 입력값이 알파벳 대문자인지 체크
 */
function isUpperCase(input) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return containsCharsOnly(input,chars);
}

/**
 * 입력값이 알파벳 소문자인지 체크
 */
function isLowerCase(input) {
    var chars = "abcdefghijklmnopqrstuvwxyz";
    return containsCharsOnly(input,chars);
}
 /*
  * 숫자만 입력가능하게 하는 함수 HwanKyu. Kang 06.04.25
  */
function numberOnly(tx) {

    var oldv = "";
    if(oldv == tx.value) return;
    oldv = tx.value;
    if (event.keyCode==37) 
    {
        return;
    }
    tx.value = numberformat(oldv);
}

function numberformat(s){
    var str  = s.replace(/\D/g,"");
    var len  = str.length;
    var tmp  = "";
    var tm2  = "";
    var i    = 0;
    //while (str.charAt(i) == '0') i++;
    str = str.substring(i,len);
    len = str.length;

    return str;
}

/**
 * 입력값이 숫자형인지 체크
 */
function isPhone(input) {
    var chars = "0123456789-+";
    return containsCharsOnly(input,chars);
}

function isNum(input) {
    var chars = "0123456789-.";
    return containsCharsOnly(input,chars);
}
function isNumStr(input_str) {
    var chars = "0123456789-.";
    return containsCharsOnlyStr(input_str,chars);
}

function isNumPercentStr(input_str) {
    var chars = "0123456789-.";
    var ret = containsCharsOnlyStr(input_str,chars);
    
    if(ret==true) {
    	var num	=	Number(input_str);
    	if(num>100.0) {
    		return false;
    	}
    	if(num<0) {
    		return false;
    	}
    }
    
    return ret;
}

function isOnlyMoneyStr(input_str) {
    var chars = "0123456789,-.";
    return containsCharsOnlyStr(input_str,chars);
}


/**
 * 입력값에 숫자만 있는지 체크
 */
function isOnlyNum(input) {
    var chars = "0123456789";
    return containsCharsOnly(input,chars);
}

function isOnlyNumStr(input_str) {
    var chars = "0123456789";
    return containsCharsOnlyStr(input_str,chars);
}
/**
 * 입력값에 통화만 있는지 체크
 */
function isOnlyMoney(input) {
    var chars = "0123456789,-.";
    return containsCharsOnly(input,chars);
}



/**
 * 입력값이 알파벳,숫자로 되어있는지 체크
 */
function isAlphaNum(input) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
    return containsCharsOnly(input,chars);
}

/**
 * 입력값이 숫자,대시(-)로 되어있는지 체크
 */
function isNumDash(input) {
    var chars = "-0123456789";
    return containsCharsOnly(input,chars);
}

/**
 * 입력값이 숫자,콤마(,)로 되어있는지 체크
 */
function isNumComma(input) {
    var chars = ",0123456789";
    return containsCharsOnly(input,chars);
}


/**
 * 입력값에서 콤마를 없앤다.
 */
function removeComma(input) {
    return input.value.replace(/,/gi,"");
}

/**
 * 입력값에 컴머 넣기
 */
function addComma( input_str_full ){

	var split_var  = input_str_full.split('.');
	var split_len	 = split_var.length;
	var input_str	 = split_var[0];

    temp = new Array();
    co=3;
    input_str_len = input_str.length;
    
    while (input_str_len>0){
            input_str_len = input_str_len - co;
            if(input_str_len<0)
            {
            	co=input_str_len + co;
            	input_str_len = 0;
            }
            temp.unshift(input_str.substr(input_str_len, co));
    }
    
    var ret = temp.join(",");
    if(split_len==2)
    {
    	ret = ret + "." + split_var[1];
    }
    return ret;
}

/**
 * 소숫점자리 없애기
 */
function removeDot( input_str_full ){
	var split_var  = input_str_full.split('.');
	var split_len	 = split_var.length;
	var input_str	 = split_var[0];
	
	if(split_len==2)
    {
    	var tail = split_var[1];
    	for(i=0; i< tail.length; i++)
    	{
    		if( tail.charAt(i) != '0' )
    			return input_str_full;
    	}
    		
    }
    return input_str;
}

/**
 * 입력값이 사용자가 정의한 포맷 형식인지 체크
 * 자세한 format 형식은 자바스크립트의 'regular expression'을 참조
 */
function isValidFormat(input,format) {
    if (input.value.search(format) != -1) {
        return true; //올바른 포맷 형식
    }
    return false;
}

/**
 * 입력값이 이메일 형식인지 체크
 */
function isValidEmail(input) {
//    var format = /^(\S+)@(\S+)\.([A-Za-z]+)$/;
    var format = /^((\w|[\-\.])+)@((\w|[\-\.])+)\.([A-Za-z]+)$/;
    return isValidFormat(input,format);
}

/**
 * 입력값이 전화번호 형식(숫자-숫자-숫자)인지 체크
 */
function isValidPhone(input) {
    var format = /^(\d+)-(\d+)-(\d+)$/;
    return isValidFormat(input,format);
}

/**
 * 선택된 라디오버튼이 있는지 체크
 */
function hasCheckedRadio(input) {
    if (input.length > 1) {
        for (var inx = 0; inx < input.length; inx++) {
            if (input[inx].checked) return true;
        }
    } else {
        if (input.checked) return true;
    }
    return false;
}

/**
 * 선택된 체크박스가 있는지 체크
 */
function hasCheckedBox(input) {
    return hasCheckedRadio(input);
}

/**
 * 입력값의 바이트 길이를 리턴
 * Author : Wonyoung Lee
 */
function getByteLength(input) {
    var byteLength = 0;
    for (var inx = 0; inx < input.value.length; inx++) {
        var oneChar = escape(input.value.charAt(inx));
        if ( oneChar.length == 1 ) {
            byteLength ++;
        } else if (oneChar.indexOf("%u") != -1) {
            byteLength += 2;
        } else if (oneChar.indexOf("%") != -1) {
            byteLength += oneChar.length/3;
        }
    }
    return byteLength;
}

function RandomInteger() {
	return Math.round(Math.random()*100000000*16);
}

function RandomString(in_size) {
	var req_size = 0;
	if( in_size > 8)
	{
		req_size=8;
	}
	else
		req_size = in_size;
		
	var rand_no = Math.round(Math.random()*100000000*16);
	var unique = rand_no.toString(16);

	var my_str = unique.substring(0, req_size).toUpperCase();
	for(i=0; my_str.length < req_size; i++)
		my_str = "0" + my_str;
		
    return my_str;
}	
 
 
function goToDetailPage1(arg1, arg2, arg3)
{
	alert("sorry for not implemented..." + arg1 + "," + arg2 + "," + arg3);
	
}

 
var DivFilelistValue;
var FileuploadWin;
var GFileGroupKey;//임의로 만든 그룹키

attachedFiles = new Array();
attachedFiles[0] = new Array();	//unique_id
attachedFiles[1] = new Array();	//group_key
attachedFiles[2] = new Array();	//file name
attachedFiles[3] = new Array();	//file size
attachedFiles[4] = new Array();	//input box


//파일업로드 창이 닫치면 불려진다.
function childClosed()
{
	FileuploadWin = null;
	if(this_page=='h10') {
		this.location.href="myenvc.html?cmdKey=nvh010";
//		var para_url = "myenvc.html?cmdKey=nvh010";
//		document.GeneralBaseForm1.action=para_url;
//		document.GeneralBaseForm1.submit();	
	}
}

//차일드가 살아있다는 것을 알린다.
function iamalive(me)
{
	FileuploadWin = me;
}

function fn_fattach_delete_group_item(funique, fkey)
{
	var id = findMatchFileNo(funique, fkey);
	if(id>-1)
		fn_fattach_delete( id );
}

function fn_fattach_delete( id, unique_id )
{
	//if( cmd_echo!=null && cmd_echo==true) {
		var ret = confirm("[" + attachedFiles[2][id] + TOKEN_jrfx_js_2);
		
		if(ret == false)
			return;
		
	//}
	
	attachedFiles[0].splice(id, 1);
	attachedFiles[1].splice(id, 1);
	attachedFiles[2].splice(id, 1);
	attachedFiles[3].splice(id, 1);
	attachedFiles[4].splice(id, 1);
	
	//DWR을 통해 첨부를 삭제한다.
	var	page_path = "/dong.html?searchType=delete-attached";
	CommonInfo_getForward(dummy_fc, page_path + "&searchKey=" + unique_id);

	
	RefreshFileList();
}

function dummy_fc() {
}

function fn_excelupload()
{
	if( FileuploadWin != null )
	{
		alert("파일 업로드 창이 열려있습니다. 확인해 보세요.");
		
		FileuploadWin.focus();
		return;
	}

	var para = "excelupload.jsp?attachKey=" + GFileGroupKey;
	
	//새창의 크기
    cw=500;
    ch=200;
    
    //스크린의 크기
    sw=screen.availWidth;
    sh=screen.availHeight;

    //열 창의 포지션
    px=(sw-cw)/2;
    py=(sh-ch)/2;

    var win_prop = 'left=' +px.toString(10)+ ',top=' +py.toString(10)+ ',width=' +cw.toString(10)+ ',height=' +ch.toString(10);
    win_prop = win_prop + ',toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=0,scrollbars=0';
  
    //창열기를 잠근다.
    //upload_lock = true;
    //창을 여는부분
	FileuploadWin = window.open(para, "FileUpLoad", win_prop);
}

function fn_fileuploadFtp(ext, path)
{
	GFileFtpUpLoad = "true";
	GFileFtpPath = path;
	var rand_no = Math.round(Math.random()*100000000*16);
	GFileGroupKey = rand_no.toString(10);
	fn_fileupload(ext);
}
function fn_fileupload(ext)
{
	if( FileuploadWin != null )
	{
		alert("파일 업로드 창이 열려있습니다. 확인해 보세요.");
		
		FileuploadWin.focus();
		return;
	}
	
	GFileFtpUpLoad = "false";
	GFileFtpPath = '';

	var para = "upload.jsp?attachKey=" + GFileGroupKey;
	para = para + "&fileExt=" + ext;
	para = para + "&FtpUpLoad=" + GFileFtpUpLoad;
	para = para + "&FileFtpPath=" + GFileFtpPath;
	
	//새창의 크기
    cw=500;
    ch=200;
    
    //스크린의 크기
    sw=screen.availWidth;
    sh=screen.availHeight;

    //열 창의 포지션
    px=(sw-cw)/2;
    py=(sh-ch)/2;

    var win_prop = 'left=' +px.toString(10)+ ',top=' +py.toString(10)+ ',width=' +cw.toString(10)+ ',height=' +ch.toString(10);
    win_prop = win_prop + ',toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=0,scrollbars=0';
  
    //창열기를 잠근다.
    //upload_lock = true;
    //창을 여는부분
	FileuploadWin = window.open(para, "FileUpLoad", win_prop);
}

function findMatchFile(funique, fkey)
{
	for(i=0;i<attachedFiles[0].length;i++)
	{
		if(attachedFiles[1][i]==fkey && attachedFiles[0][i] == funique)
		{
			return true;
		}
	}
	
	return false;

}

function findMatchFileNo(funique, fkey)
{
	for(i=0;i<attachedFiles[0].length;i++)
	{
		if(attachedFiles[1][i]==fkey && attachedFiles[0][i] == funique)
		{
			return i;
		}
	}
	
	return -1;

}

//업로드가 끝나면 불려지는 함수
function AddFileList(fname, fsize, funique, fkey)
{
	if( fname.length == 0 )
		return;

	//이미등록되었으면
	if(findMatchFile(funique, fkey) == true)
		return;
		
	attachedFiles[0].push(funique);	//unique_id
	attachedFiles[1].push(fkey);	//group_key
	attachedFiles[2].push(fname);	//file name
	attachedFiles[3].push(fsize);	//file size
	
	
	var file_text = "";
	file_text += "<input type='hidden' name='file_group_code' value='" + fkey + "'>";
	file_text += "<input type='hidden' name='file_item_code' value='" + funique + "'>";
	file_text += "<input type='hidden' size='60' name='file_f_name' value='" + fname + "'>";
	file_text += "<input type='hidden' name='file_f_size' value='" + fsize + "'>";
	
	attachedFiles[4].push(file_text);
	
	RefreshFileList();

}

function RefreshFileList()
{
	DivFilelistValue = "<table>";

	for(var i=0; i < attachedFiles[0].length; i++)
	{
		
		
		
		DivFilelistValue = DivFilelistValue + "<tr>";
		
		DivFilelistValue = DivFilelistValue + "<td>";
		DivFilelistValue = DivFilelistValue + "<a href='javascript:fn_fattach_delete(";
		DivFilelistValue = DivFilelistValue + i;
		DivFilelistValue = DivFilelistValue + "," + attachedFiles[0][i];
		DivFilelistValue = DivFilelistValue + ");'>[" + TOKEN_jrfx_js_1 + "]</a>"
		DivFilelistValue = DivFilelistValue + "</td>"
		
		DivFilelistValue = DivFilelistValue + "<td style='padding-left:10;padding-right:10;'>" + attachedFiles[2][i] + "</td>";
		DivFilelistValue = DivFilelistValue + "<td><font color='#B15910'><small>(" + addComma(attachedFiles[3][i]) + ")</small></font></td>";;
		DivFilelistValue = DivFilelistValue + "</tr>";
		
		
	}

	DivFilelistValue = DivFilelistValue + "</table>";
	SafeSetValue("file_upload_div", DivFilelistValue);
	
	var file_text_all = "";
	if(attachedFiles[4].length == 0){
		file_text_all = "";
	}	
	for(var i=0; i < attachedFiles[4].length; i++)
	{
		file_text_all += attachedFiles[4][i];	
	}
	
	document.all.file_display.innerHTML= file_text_all;
}

function showPDF(){
	w = screen.availWidth / 1.5;
	h = screen.availHeight / 1.5;
	newWin1 = window.open("rfx/view.html", "newWin1", "width="+w+",height="+h);
	newWin1.moveTo(0,0);
	
	//timer1=setTimeout('newWin1.close()', 3000);
 	//clearTimeout(timer1);
}

/******************************************************************************** 
 ** 함수설명 : SELECT 박스에 OPTION추가하는 함수
 ** 사용설명 : gf_InsertOption(arg_sbx, arg_title, arg_value);
 **                            SELECT BOX명, OPTION TITLE , OPTION VALUE
 ********************************************************************************/
function gf_InsertOption(arg_sbx, arg_title, arg_value){
   var lo_Sbx = eval("document.all." + arg_sbx);
   var lo_Option = document.createElement("OPTION");

   lo_Sbx.options.add(lo_Option);
   lo_Option.innerText = arg_title;
   lo_Option.value     = arg_value;
   lo_Option.title     = "aaa";
}

function gf_InsertOptionPosi(arg_sbx, arg_text, arg_title, arg_value, position){
   var lo_Sbx = eval("document.all." + arg_sbx);
   var lo_Option = document.createElement("OPTION");

   lo_Sbx.options.add(lo_Option, position);
   lo_Option.innerText = arg_text;
   lo_Option.value     = arg_value;
   lo_Option.title     = arg_title;
}


/******************************************************************************** 
 ** 함수설명 : SELECT 박스에 OPTION 삭제하는 함수
 ** 사용설명 : gf_DeleteOption(arg_sbx, arg_index);
 **                            SELECT BOX명, OPTION index
 ********************************************************************************/
function gf_DeleteOption(arg_sbx, arg_index){
   var lo_Sbx = eval("document.all." + arg_sbx);
   lo_Sbx.remove(arg_index);
}
 
// maxLength만큼 입력되게 하는 함수 (한글체크가능)
function gf_Maxlength(){
    var lo_object = event.srcElement;
    var ls_str    = lo_object.value;
    var maximum   = ls_str.length;
      
    if (typeof(lo_object.maxLength) != "undefined")
       maximum = lo_object.maxLength;
   	
	if (((event.keyCode >= 33 && event.keyCode <= 40) || event.keyCode == 8 || event.keyCode == 46) && event.keyCode != 13) return;

    if ((event.keyCode >= 32) && (event.keyCode <= 126)) {
      	if ( gf_Length(ls_str) >= maximum ){
           alert("최대길이 영어: " + maximum+ ", 한글: " + maximum/2 );   	   	
      	   lo_object.value = gf_substring(ls_str, maximum);
      	   event.returnValue = false;
      	   lo_object.focus();
      	}
    }else {
      	if ( gf_Length(ls_str) > maximum ){
           alert("최대길이 영어: " + maximum+ ", 한글: " + maximum/2 );   	   	
      	   lo_object.value = gf_substring(ls_str, maximum);
      	   event.returnValue = false;
      	   lo_object.focus();
      	}
    }
}
   
// 문자열 길이체크 함수
function gf_Length(str){
   	var nbytes = 0;
   
   	for (var i=0; i<str.length; i++){
   		var ch = str.charAt(i);

   		if(escape(ch).length > 4){
   			nbytes += 2;
   		}else if (ch == '\n'){
   			//if ((str.charAt(i-1) != '\r'))
  			      nbytes += 1;
   		}else if (ch == '<' || ch == '>'){
   			nbytes += 4;
   		}else{
   			nbytes += 1;
   		}
   	}

   	return nbytes;
}
   
   
// text, textarea MaxLength 체크 함수
function gf_maxLength_object(){
    var lo_object = event.srcElement;
    if(typeof(lo_object) == "undefined") return;
    if(lo_object.type != "text" && lo_object.type != "textarea") return;
      
   	var ls_str  = lo_object.value;
   	var maximum = lo_object.maxLength;
   	
    if (gf_Length(ls_str) > maximum){
        alert("maximum value over flow.\n english(" + maximum + "), asian character(" + maximum / 2 + ") is set" );
        lo_object.focus();
        return false;
    }
    else{
        return true;
    }
}
   
// 문자열 길이만큼 자르는 함수
function gf_substring(str, maximum){
   	var inc = 0;
   	var nbytes = 0;
   	var msg = "";
   	var msglen = str.length;
   
   	for (var i=0; i<msglen; i++){
   		var ch = str.charAt(i);
   		if (escape(ch).length > 4){
   			inc = 2;
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

/*
* 창을 띄우는 함수.
*/
function NWin(sUrl, sWidth, sHeight ,sScroll )
{
	var windowFocus;
	if (sScroll==false)
	{
		TempScroll = "no";
	}
	else
	{
		TempScroll = "yes";
	}
	if ( sWidth == 0)
	{
		x = screen.width ;
	}
	else
	{
		WindowWidth  = screen.width ;
		x = WindowWidth/2  - parseInt(sWidth, 10) /2
	}
	if ( sHeight == 0)
	{
		y = screen.height;
	}
	else
	{
		WindowHeight = screen.height;
		y = WindowHeight/2 - parseInt(sHeight, 10)/2
	}

	windowFocus = window.open(sUrl ,"window","toolbar=no,status=no,width="+sWidth+",height="+sHeight+",directories=no,scrollbars="+TempScroll+",location=no,resizable=no,menubar=no,screenX="+x+",left="+x+",screenY="+y+",top="+y)
	windowFocus.focus();
}
   
	//파일다운로드
//	function f_fileDownLoad(ars_fileCode,ars_fileName){
//		var lo_form = document.GeneralBaseForm1;
//		var ls_fileCode = ars_fileCode; //서버파일코드
//		var ls_fileName = ars_fileName; //서버파일이름
//		//alert(ls_fileName);
//		var ls_all_file = ars_fileCode+"|"+ars_fileName;
//		var page_path = "./routingc.html?filename=" + ls_fileName+"&filecode=" +ls_fileCode;
//		//CommonInfo_getForward(loadforward, page_path + "&searchType=fileDown&searchHandler=fileDown");
//		//lo_form.action = page_path;
//		//lo_form.submit();
//		document.location.href = page_path;
//	}
	function f_fileDownLoad(ars_fileCode,ars_fileName){
		var lo_form = document.fileDownloadForm;
		SafeSetValue('filename', ars_fileName);
		SafeSetValue('filecode', ars_fileCode);
		lo_form.action="myenvc.html?cmdKey=nvh004";
		lo_form.submit();
	}
   
   	// 그냥 n millis 동안 멈추기

function pause(numberMillis) {
     var now = new Date();
     var exitTime = now.getTime() + numberMillis;


     while (true) {
          now = new Date();
          if (now.getTime() > exitTime)
              return;
     }
}

 

// 모달창 띄우면서 n millis 동안 멈추기

function pauseWithModal(numberMillis) {
        var dialogScript = 
           'window.setTimeout(' +
           ' function () { window.close(); }, ' + numberMillis + ');';
        var result = 
        // IE
         window.showModalDialog(
           'javascript:document.writeln(' +
            '"<script>' + dialogScript + '<' + '/script> please wait")');

        // NN
        /* openDialog(
           'javascript:document.writeln(' +
            '"<script>' + dialogScript + '<' + '/script>please wait"',
           'pauseDialog', 'modal=1,width=10,height=10');
        */
}

function commandLocation(path) {
	var selecedStruct = SafeGetValue('selecedStruct');
	doingProcess();
	window.location = path + "&selecedStruct=" + selecedStruct;
}


function startBlink() {
    var objBlink = document.all.tags("BLINK")
    for (var i=0; i < objBlink.length; i++)
        objBlink[i].style.visibility = objBlink[i].style.visibility == "" ? "hidden" : ""
}

//rtgast의 갯수
function checkCountPartial(lo_form, rtgast_uid)
{
	var count = 0;
	for(var i = 0; i<lo_form.elements.length; i++)
	{
		if(lo_form.elements[i].type == "checkbox" && lo_form.elements[i].name == ("ChkBox_" + rtgast_uid) )
		{
			count++;
		}
	}
	return count;
}

function selectClick(obj)
{
	if(obj!=null) {
		obj.select();
	}
}

function gotoRoot(){
	location.href=".";
}

function gotoQa(){
	location.href="../unicorn3/board-list.do?boardId=jangbimanqa";
}

function abstString(str, len) {
	return str.substring(0,len) + '...';
}

function change_keyInt() {
	GFileGroupKey = RandomInteger(); //RandomString(8);
	SafeSetValue("file_upload_key", GFileGroupKey);
}

function change_keyStr()
{
	GFileGroupKey = RandomString(8);
	//SafeSetValue("file_upload_key", GFileGroupKey);
}

function checkNumClear(obj) {
	if( isNum(obj) != true)
	{
		alert('숫자만 입력할 수 있습니다.');
		obj.value='';
		return;
	}
}

function checkNumClearLength(obj, max) {
	if( isNum(obj) != true)
	{
		alert('숫자만 입력할 수 있습니다.');
		obj.value='';
		return false;
	}
	
	var num = Number(obj.value);
	if(num>max) {
		alert('입력할 수 있는 최대값으로 조정합니다.');
		obj.value=''+max;
	}
	
	return true;
}

function stripSpecialChar(str) {
	return str
	.replace(/[%]/g, '%%%')
	.replace(/[\t]/g, '%09')
//	.replace(/[,]/g, '%2C')
//	.replace(/[ ]/g, '%20')
	.replace(/[.]/g, '%2E')
	.replace(/[!]/g, '%21')
//	.replace(/[/]/g, '%2F')
//	.replace(/["]/g, '%22')
//	.replace(/[:]/g, '%3A')
	.replace(/[#]/g, '%23')
	.replace(/[;]/g, '%3B')
	.replace(/[<]/g, '%3C')
	.replace(/[$]/g, '%3E')
	.replace(/[&]/g, '%26')
	.replace(/[>]/g, '%3E')
	.replace(/[(]/g, '%28')
	.replace(/[=]/g, '%3D')
	.replace(/[)]/g, '%29')
	.replace(/[?]/g, '%3F')
	.replace(/[+]/g, '%2B')
	.replace(/[@]/g, '%40')
//	.replace(/[^]/g, '%5E')
	.replace(/[\\]/g, '%5C')
	.replace(/%%%/g, '%25');
	
}

//	.replace(/[^]/g, '%5E')


function downloadFileByPath(dispname, filename) {
	this.location.href="filedown.html?filename="+ filename + "&dispname=" + dispname;
}


function downloadSambaFileByPath(dispname, filename) {
	this.location.href="filedown.html?downtype=SAMBA&filename="+ filename + "&dispname=" + dispname;
}


