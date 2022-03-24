/*************************************
 * browser 버전체크
 *************************************/
var browser = {
		checkBrowser: function() {
			var N= navigator.appName, ua= navigator.userAgent, tem;
			var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
			if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
			M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
			return M;
		},

		//쿠키 생성
		setCookie: function setCookie(cName, cValue, cDay){
			var expire = new Date();
			expire.setDate(expire.getDate() + cDay);
			cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
			if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
			document.cookie = cookies;
		},

		// 쿠키 가져오기
		getCookie: function (cName) {
			cName = cName + '=';
			var cookieData = document.cookie;
			var start = cookieData.indexOf(cName);
			var cValue = '';
			if(start != -1){
				start += cName.length;
				var end = cookieData.indexOf(';', start);
				if(end == -1)end = cookieData.length;
				cValue = cookieData.substring(start, end);
			}
			return unescape(cValue);
		}
};

var ajaxError = {
		setting:function(xhr, ajaxOptions, thrownError) {
			if (xhr.status === 0) {
				alert ('Not connected.\nPlease verify your network connection.');
			} else if (xhr.status == 401) {
				alert(xhr.responseText);
				if($('.toparea', parent.document).length > 0){
					window.parent.call_login();
				}else if($('.toparea', parent.parent.document).length > 0){
					window.parent.parent.call_login();
				}else{
					call_login();
				}
			} else if (xhr.status == 403) {
				alert(xhr.responseText);
				if($('.toparea', parent.document).length > 0){
					window.parent.call_main();
				}else if($('.toparea', parent.parent.document).length > 0){
					window.parent.parent.call_main();
				}else{
					call_main();
				}
			} else if (xhr.status == 404) {
				alert ('The requested page not found. [404]');
			} else if (xhr.status == 500) {
				alert ('Internal Server Error [500].');
			} else if (thrownError === 'parsererror') {
				alert ('Requested JSON parse failed.');
			} else if (thrownError === 'timeout') {
				alert ('Time out error.');
			} else if (thrownError === 'abort') {
				alert ('Ajax request aborted.');
			} else {
				alert ('Uncaught Error.\n' + xhr.responseText);
			}
		}
};

/**
 * 
 */
var addHidden = function(_form, _key, _value) {
    // Create a hidden input element, and append it to the form:
    var input = document.createElement('input');
    input.type = 'hidden';
    input.id = _key;
    input.name = _key;
    input.value = _value;
    _form.appendChild(input);
};

/*************************************
 * 일반함수 정의
 *************************************/
(function ($) {

	/******************************************************************************************
	 *** 일반 함수
	 ******************************************************************************************/

	//숫자만 체크
	$.onlyNumber = function(event){
		if((event.keyCode < 48) || (event.keyCode > 57)) event.returnValue=false;
	};

	//Replace
	$.replaceAll = function(str, repStr, joinStr ){
		return str.split(repStr).join(joinStr);
	};

	//Replace
	$.replaceNull = function(str, joinStr ){
		if(str == null) return joinStr;
		return str;
	};

	//Replace Number
	$.replaceNumber = function(val){
		return val.replace(/[^0-9]/g,'');
	};

	//Replace Number
	$.replaceDecimalNumber = function(val){
		return val.replace(/[^0-9|\.]/g,'');
	};

	//add Comma Number
	$.addCommaNumber = function(val){
		return val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	};

	//Trim
	$.Trim = function(str){
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	};

	//LTrim
	$.LTrim = function(str) 
	{
		return str.replace(/^\s+/,"");
	};

	//RTrim
	$.RTrim = function(str) 
	{
		return str.replace(/\s+$/,"");
	};

	//Email Validation
	$.EmailValid = function(str) 
	{
		regexp = /^[a-zA-Z0-9_\.\-]+@([a-z0-9_\-]+\.){1,}[a-z0-9]+$/g;
		if(!( regexp.test( str ) )){
			return false;
		} else{
			return true;
		}
	};

	/******************************************************************************************
	 *** Ajax 함수
	 ******************************************************************************************/
	$.mcisAjax = function(url, jsonParamData, call_back_func, jsonType, async, methodType) {
		if(typeof async    === "undefined") async   = true;
		if(typeof jsonType === "undefined" || jsonType == "") jsonType = "N";
		if(typeof methodType === "undefined" || methodType == "") methodType = "POST";

		//Ajax 세팅
		var settings = {};
		settings.type        = methodType;
		settings.datatype    = "json",
		settings.cache       = false;
		settings.async       = async;
		settings.timeout     = 120*1000;	//milisecond
		settings.data        = jsonParamData;
		settings.success     = call_back_func;
		settings.complete    = function(){ };
		settings.error       = ajaxError.setting;

		if(jsonType == "Y"){
			settings.data        = jsonParamData,
			settings.contentType = "application/json; charset=UTF-8";
		}

		$.ajax(url,settings);		
	};

	$.mcisFormAjax = function(url, formID, call_back_func, async, formData)
	{
		if(typeof async    === "undefined") async   = true; 

		//Ajax 세팅
		var settings = {};
		settings.type        = "POST";
		settings.cache       = false;
		settings.async       = async;
		settings.timeout     = 120*1000;	//milisecond

		if(formData != null && formData != undefined){
			settings.data        = formData;
			settings.contentType = false;
			settings.processData = false;
		}else{
			settings.data        = $('#' +  formID ).serialize();
		}

		settings.success     = call_back_func;
		settings.complete    = function(){ };
		settings.error       = ajaxError.setting;

		$.ajax(url,settings);		
	};

	/******************************************************************************************
	 *** 첨부파일 함수
	 ******************************************************************************************/
	//첨부파일(등록) --> param1:업로드리스트ID, param2:업로드ID, param3:업로드 가능 파일갯수
	$.insAttachFileSet = function(mcisComFileList, mcisComFileUploader, maxUpdCnt){
		var multi_selector = new MultiSelector( document.getElementById( mcisComFileList ), maxUpdCnt );
		multi_selector.addElement( document.getElementById( mcisComFileUploader ) );
	};

	//첨부파일(수정) --> param1:가능ID, param2:업로드불가능ID, param3:업로드리스트ID, param4:업로드ID, param5:업로드 가능 파일갯수, param6:현재업로드된 파일갯수
	$.updAttachFileSet = function(filePosId, fileImposId, mcisComFileList, mcisComFileUploader, maxUpdCnt, existFileNum){

		if (existFileNum == "undefined" || existFileNum == null) existFileNum = 0;

		var uploadableFileNum = maxUpdCnt - existFileNum;
		if (uploadableFileNum < 0) uploadableFileNum = 0;

		if (uploadableFileNum != 0) {
			document.getElementById( filePosId ).style.display   = "block";
			document.getElementById( fileImposId ).style.display = "none";

			var multi_selector = new MultiSelector( document.getElementById( mcisComFileList ), maxUpdCnt );
			multi_selector.addElement( document.getElementById( mcisComFileUploader ) );
		} else {
			document.getElementById( filePosId ).style.display   = "none";
			document.getElementById( fileImposId ).style.display = "block";
		}
	};

	/******************************************************************************************
	 *** 날짜 함수
	 ******************************************************************************************/

	//날짜 얻어오기
	$.getCalculatedDate = function(selDate, iYear, iMonth, iDay, seperator)
	{
		var gdCurDate;

		if(selDate == ""){
			gdCurDate = new Date();
		}else{

			var tdyy = selDate.substr(0,4);
			var tdmm = parseInt(selDate.substr(4,2),10) - 1;
			var tddd = selDate.substr(6,2);
			gdCurDate = new Date(tdyy,tdmm,tddd);
		}

		gdCurDate.setYear( gdCurDate.getFullYear() + iYear );
		gdCurDate.setMonth( gdCurDate.getMonth() + iMonth );
		gdCurDate.setDate( gdCurDate.getDate() + iDay );

		var giYear = gdCurDate.getFullYear();
		var giMonth = gdCurDate.getMonth()+1;
		var giDay = gdCurDate.getDate();

		giMonth = "0" + giMonth;
		giMonth = giMonth.substring(giMonth.length-2,giMonth.length);
		giDay   = "0" + giDay;
		giDay   = giDay.substring(giDay.length-2,giDay.length);

		return giYear + seperator + giMonth + seperator +  giDay;
	};

	//날짜체크
	$.date_chk = function(str,delStr){
		str = str.split(delStr).join('');
		regExp = /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/;
		if(!regExp.test(str)) return false;
		return true;
	};

	//14자리 date 포맷
	$.date14formatter = function( val )
	{
		if(val != null && val != "" && val != undefined && val.length == 14){
			return val.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g,'$1-$2-$3 $4\:$5\:$6');
		}
		return val;
	};

	//8자리 date 포맷
	$.date8formatter = function( val )
	{
		if(val != null && val != "" && val != undefined && val.length == 8){
			return val.replace(/(\d{4})(\d{2})(\d{2})/g,'$1-$2-$3');
		}
		return val;
	};

	//6자리 time 포맷
	$.time6formatter = function( val )
	{
		if(val != null && val != "" && val != undefined && val.length == 6){
			return val.replace(/(\d{2})(\d{2})(\d{2})/g,'$1:$2:$3');
		}
		return val;
	};	

})(jQuery);


/*************************************
 * 사용자 정의 함수
 *************************************/
(function ($) {

	// 숫자 제외하고 모든 문자 삭제.
	$.fn.removeChar = function(_v){
		if (typeof(_v) === "undefined"){
			$(this).each(function(){
				this.value = this.value.replace(/[^0-9]/g,'');
			});
		}else{
			return _v.replace(/[^0-9]/g,'');
		}
	};

	// 빈값 체크
	$.fn.isNull = function(p){
		if(typeof(p) === "undefined"){
			if($(this).val().replace(/\s/g,'') == "") return true;
		}else{
			if(p.replace(/\s/g,'') == "") return true;
		}
		return false;
	};

	//form Data 직렬화(JSON 변경에 이용)
	$.fn.serializeObject = function(){
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	//실시간 comma적용
	$.fn.formatCurrencyBlur = function(){
		this.css("ime-mode", "disabled");
		this.blur(function() {
			$(this).formatCurrency({ colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: 0 });
			var asNumber = String($(this).asNumber());
			if($(this).val().replace(/[,]/g,'') != asNumber){
				$(this).val("");
			}
		})
		.keyup(function(e) {
			var e = window.event || e;
			var keyUnicode = e.charCode || e.keyCode;
			if (e !== undefined) {
				switch (keyUnicode) {
				case 16: break; // Shift
				case 27: this.value = ''; break; // Esc: clear entry
				case 35: break; // End
				case 36: break; // Home
				case 37: break; // cursor left
				case 38: break; // cursor up
				case 39: break; // cursor right
				case 40: break; // cursor down
				case 78: break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
				case 110: break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
				case 190: break; // .
				default: $(this).formatCurrency({ colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
				}
			}
		})
		.bind('decimalsEntered', function(e, cents) {
			alert('Please do not enter any cents (0.' + cents + ')');
		});
	};

	//실시간 decimal comma적용
	$.fn.formatDecimalCurrencyBlur = function(){
		this.css("ime-mode", "disabled");
		this.blur(function() {
			$(this).formatCurrency({ colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: 2 });
			var asNumber = String($(this).asNumber());			
			if($(this).val().replace(/[,]/g,'').replace(/.00/g,'') != asNumber){
				$(this).val("");
			}
		})
		.keyup(function(e) {
			var e = window.event || e;
			var keyUnicode = e.charCode || e.keyCode;
			if (e !== undefined) {
				switch (keyUnicode) {
				case 16: break; // Shift
				case 17: break; // Ctrl
				case 18: break; // Alt
				case 27: this.value = ''; break; // Esc: clear entry
				case 35: break; // End
				case 36: break; // Home
				case 37: break; // cursor left
				case 38: break; // cursor up
				case 39: break; // cursor right
				case 40: break; // cursor down
				case 78: break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
				case 110: break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
				case 190: break; // .
				default: $(this).formatCurrency({ colorize: true, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
				}
			}
		})
		.bind('decimalsEntered', function(e, cents) {
			if (String(cents).length > 2) {
				alert('Please 2 enter cents (0.' + cents + ')');
			}
		});
	};

})(jQuery);


/*************************************
 * 사용자 정의 함수(prototype)
 *************************************/
var mcis = new mcisFunc();

function mcisFunc(){};

//오늘 날짜 받아오기.
mcisFunc.prototype.today = function(){

	var _date = new Date(); 
	var month = _date.getMonth() + 1;
	var day = _date.getDate();
	if(month < 10) month = '0' + month;
	if(day < 10) day = '0' + day;

	return _date.getFullYear() + '-' + month + '-' + day;
};


mcisFunc.prototype.firstDayOfWeek = function(){
	var now = new Date();

	var day = now.getDay();
	var FromNow = new Date();
	
	//FromNow.setDate(FromNow.getDate() - (day-1));
	FromNow.setDate(FromNow.getDate() - (day-1+7));
	now.setDate(now.getDate() + (7-day-2));

	return (FromNow.getFullYear())+"-"+((FromNow.getMonth()+1) > 9 ? ''+ (FromNow.getMonth()+1) : '0'+(FromNow.getMonth()+1))+"-"+(FromNow.getDate() > 9 ? '' + FromNow.getDate() : '0'+FromNow.getDate());
	//return "2015-03-16";
};

mcisFunc.prototype.lastDayOfWeek = function(){
	var now = new Date();
	
	var day = now.getDay();
	var FromNow = new Date();
	
	FromNow.setDate(FromNow.getDate() - (day-1));
	//now.setDate(now.getDate() + (7-day-2));
	now.setDate(now.getDate() + (7-day-2-7));

	return (now.getFullYear())+"-"+((now.getMonth()+1) > 9 ? ''+ (now.getMonth()+1) : '0'+(now.getMonth()+1))+"-"+(now.getDate() > 9 ? '' + now.getDate() : '0'+now.getDate());
	//return "2015-03-20";
};

/* 파일첨부 */
mcisFunc.prototype.getFileValue = function(id1,id2){
	var nameFile = document.getElementById(id2);
	document.getElementById(id1).value = nameFile.value;
};

//텍스트 에리어 태그에 키 입력시 자동으로 사이즈를 조절하게 하는 함수를 바인드 아래 함수와 셋트로 써야함.
$(function(){ 
	$('textarea').bind('keydown', function(){
		fnautorow(this);
	}); 
	$('textarea').keydown();// trigger('keydown'); // 사용화면에 들어올시 강제로 이벤트를 발생 시켜 크기를 제대로 맞춰줌.
});

//텍스트 에리어 입력함에 따라 자동으로 사이즈 조절되는 부분, 단 텍스트 에리어의 높이는 지정해주지 않아야할듯.
function fnautorow(obj, rowsDefault){
	if(navigator.appVersion.indexOf('MSIE') > -1){
		var step = navigator.appVersion.indexOf('MSIE') > -1 ? 14 : 12;
		var default_row = navigator.appVersion.indexOf('MSIE')  > -1 ? 14 : 42;
		var scrollHeight = obj.scrollHeight;
		var strows;
		if(event == null || event.keyCode == 8 | event.keyCode == 13 | event.keyCode == 46 ){
			strows = ((scrollHeight + step - default_row) / step) + 2;
			$(obj).attr('rows', strows);
		}
	} else {
		rowsDefault = rowsDefault == undefined ? 3 : rowsDefault;
		var linesCount = 0;
		var lines = obj.value.split('\n');
		var colsDefault = obj.cols;

		for(var i = lines.length - 1; i>=0; --i){
			linesCount += Math.floor((lines[i].length / colsDefault) + 1);
		}
		if(linesCount >= rowsDefault){
			obj.rows = linesCount + 1;
		} else {
			obj.rows = rowsDefault;
		}
	}
}

//숫자만 입력 가능하게
function inputKeyUpEvent_OnlyNumber() {
	$(this).val($(this).val().replace(/[^0-9]/gi, ""));
}


//숫자만 입력 가능하게
//최소, 최대 입력 범위 체크
function inputKeyUpEvent_OnlyNumberRange(obj, min, max) {
	$(obj).val($(obj).val().replace(/[^0-9]/gi, ""));

	var n = parseInt($(obj).val());

	if (n < min) {
		$(obj).val(min);
		$(obj).select();
	} else if (n > max) {
		$(obj).val(max);
		$(obj).select();
	}
}

//-----------------------------------------------------------------------------
//global popup window
//win_url	: pupup URL
//win_name: window name
//is_fu	: maximize (0 or 1) - equal F11 Function key
//is_ma	: normal maximize (0 or 1)
//wi		: width
//he		: height
//is_re	: resizable (0 or 1)
//is_me	: show menubar (0 or 1)
//is_sc	: show scrollbar (0 or 1)
//is_st	: show statusbar (0 or 1)
//-----------------------------------------------------------------------------
function gfn_win_popup(win_url,win_name,is_fu,is_ma,wi,he,is_re,is_me,is_sc,is_st)
{
	var win_option = "";

	if(is_fu) win_option += "fullscreen,";

	win_option += "width=" + wi + ",";
	win_option += "height=" + he + ",";

	if(is_re) win_option += "resizable=yes,";
	if(is_me) win_option += "menubar=yes,";
	if(is_sc) win_option += "scrollbars=yes,";
	if(is_st) win_option += "statusbar=yes,";

	win_option += "left=" + ((screen.availWidth/2)-(wi/2)) + ",top=" + ((screen.availHeight/2)-(he/2));
	cont_win = window.open(win_url,win_name,win_option);
	if (is_ma)
	{
		cont_win.outerWidth = screen.availWidth;
		cont_win.outerHeight = screen.availHeight;
		cont_win.moveTo(0,0);
		cont_win.resizeTo(cont_win.outerWidth, cont_win.outerHeight);
	}
	cont_win.focus();
}


//현재날짜 이후인지 체크
function dateCheck(date)
{
	var now = new Date(); 
	var todayAtMidn = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	var specificDate = new Date(date);
	if (todayAtMidn.getTime() < specificDate.getTime()){
		return true;
	}
	else {
		return false;
	}
}
//date1 이 date2 이후거나 같거나
function dateCompareCheck(date1,date2){

	var befDate = makeDateFormat(date1);
	var afterDate = makeDateFormat(date2);

	if(befDate.getTime() <= afterDate.getTime()){
		return true;
	}else{
		return false;
	}
}

function makeDateFormat(pdate) 
{ 
	var yy, mm, dd, yymmdd; 
	var ar; 

	if (pdate.indexOf(".") > -1) 
	{ 
		// yyyy.mm.dd 
		ar = pdate.split("."); 
		yy = ar[0]; 
		mm = ar[1]; 
		dd = ar[2]; 

		if (mm < 10) mm = "0" + mm; 
		if (dd < 10) dd = "0" + dd; 
	} 
	else if (pdate.indexOf("-") > -1) 
	{
		// yyyy-mm-dd 
		ar = pdate.split("-"); 
		yy = ar[0]; 
		mm = ar[1]; 
		dd = ar[2]; 

		if (mm < 10) mm = "0" + mm; 
		if (dd < 10) dd = "0" + dd; 
	} 
	else if (pdate.length == 8) 
	{ 
		yy = pdate.substr(0,4); 
		mm = pdate.substr(4,2); 
		dd = pdate.substr(6,2); 
	} 

	yymmdd = yy+"/"+mm+"/"+dd; 
	yymmdd = new Date(yymmdd); 

	if (isNaN(yymmdd)) 
	{ 
		return false; 
	} 
	return yymmdd; 
}

Date.prototype.format = function(f) {
	if (!this.valueOf()) return " ";

	var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	var d = this;

	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
		case "yyyy": return d.getFullYear();
		case "yy": return (d.getFullYear() % 1000).zf(2);
		case "MM": return (d.getMonth() + 1).zf(2);
		case "dd": return d.getDate().zf(2);
		case "E": return weekName[d.getDay()];
		case "HH": return d.getHours().zf(2);
		case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
		case "mm": return d.getMinutes().zf(2);
		case "ss": return d.getSeconds().zf(2);
		case "a/p": return d.getHours() < 12 ? "오전" : "오후";
		default: return $1;
		}
	});
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};


function convertDisplayDate(pdate) 
{ 
	if(pdate==null || pdate=='')
	{
		return '';
	}

	var yy, mm, dd, yymmdd; 
	var ar; 

	if (pdate.indexOf(".") > -1) 
	{ 
		// yyyy.mm.dd 
		ar = pdate.split("."); 
		yy = ar[0]; 
		mm = ar[1]; 
		dd = ar[2]; 

		if (mm < 10) mm = "0" + mm; 
		if (dd < 10) dd = "0" + dd; 
	} 
	else if (pdate.indexOf("-") > -1) 
	{
		// yyyy-mm-dd 
		ar = pdate.split("-"); 
		yy = ar[0]; 
		mm = ar[1]; 
		dd = ar[2]; 

		if (mm < 10) mm = "0" + mm; 
		if (dd < 10) dd = "0" + dd; 
	} 
	else if (pdate.length == 8) 
	{ 
		yy = pdate.substr(0,4); 
		mm = pdate.substr(4,2); 
		dd = pdate.substr(6,2); 
	} 
	else if (pdate.length == 6) 
	{ 
		yy = "20"+pdate.substr(0,2); 
		mm = pdate.substr(2,2); 
		dd = pdate.substr(4,2); 
	} 

	yymmdd = yy+"/"+mm+"/"+dd; 
	yymmdd = new Date(yymmdd); 

	if (isNaN(yymmdd)) 
	{ 
		return false; 
	} 

	var str=yymmdd.format("yyyy.MM.dd");

	return str; 
}

function datecheck(objId)
{
	var date=$("#"+objId).val();

	var conDate=convertDisplayDate(date);
	$("#"+objId).val(conDate);
}

jQuery.fn.getCheckboxVal = function(){
	var vals = [];
	var i = 0;
	this.each(function(){
		vals[i++] = jQuery(this).val();
	});
	return vals;
}

jQuery.fn.center = function (t,l) {
	if(!t) t=0;if(!l) l=0;
	this.css("position","absolute");
	this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop() - parseInt(t) ) + "px");
	this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft() - parseInt(l) ) + "px");
	return this;
}

function isEmpty(str)
{
	if(str == '' || str == null || str == "null" || str == 'undefined')
	{
		return true;
	}
	return false;
}

function isNumber(s) 
{
	s += ''; // 문자열로 변환
	s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
	if (s == '' || isNaN(s)) return false;
	return true;
}

function dateFormat(f,fmt){
	var tmpStr = "";
	tmpStr = f.value;

	f.value = str2DateFormat(tmpStr, fmt);
}

function gfn_isStringEmpty(strValue)
{
	var bEmpty = false;

	if ((strValue === undefined) || (strValue == null) || (strValue.length <= 0))
	{
		bEmpty = true;
	}

	return bEmpty;
}

/**
 * 
 * @param decPlaces
 * @param thouSeparator
 * @param decSeparator
 * @returns
 */
Number.prototype.formatMoney = function(decPlaces, thouSeparator, decSeparator) {
    var n = this,
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSeparator = decSeparator == undefined ? "." : decSeparator,
    thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
    sign = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
};
