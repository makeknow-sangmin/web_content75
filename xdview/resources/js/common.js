$(function(){
//	if(!window.console){ window.console = {log: function(){} }; }
	
	$("#wrap").css("height", $(document).height()-3);
	
	$.datepicker.regional['ko'] = {
		closeText: '닫기',
		prevText: '이전달',
		nextText: '다음달',
		currentText: '오늘',
		monthNames: ['1월(JAN)','2월(FEB)','3월(MAR)','4월(APR)','5월(MAY)','6월(JUN)','7월(JUL)','8월(AUG)','9월(SEP)','10월(OCT)','11월(NOV)','12월(DEC)'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		dayNames: ['일','월','화','수','목','금','토'],
		dayNamesShort: ['일','월','화','수','목','금','토'],
		dayNamesMin: ['일','월','화','수','목','금','토'],
		weekHeader: 'Wk',
		dateFormat: 'yy-mm-dd',
		firstDay: 0,
		isRTL: false,
		duration:200,
		showAnim:'show',
		showMonthAfterYear: true,
		yearSuffix: '',
		changeMonth : true,
		changeYear : true,
		//showButtonPanel: true,
		//showOtherMonths : false,
		//selectOtherMonths : true,
		showOn: "both",
		//buttonImage: "/resources/images/admin/ico_calendar.gif",
		buttonImage: "/resources/images/icon_calendar.gif",
		buttonText: "",
		buttonImageOnly: true,
		beforeShowDay: onlySpecialDay
	};
	$.datepicker.setDefaults($.datepicker.regional['ko']);
	
	//$("img.ui-datepicker-trigger").attr("style", "margin-left:2px; vertical-align:middle; cursor: Pointer;"); 
	
	$(".datepicker").datepicker();
	
	
	$.timepicker.regional['ko'] = {
		controlType: 'select',
		currentText: '오늘',
		closeText: '닫기',
		timeText: '시간',
		hourText: '시',
		minuteText: '분',
		hourMin: 8,
		hourMax: 18,
		stepMinute: 30
	};
	$.timepicker.setDefaults($.timepicker.regional['ko']);

	$(".datetimepicker").datetimepicker();

	// pnotify
	$.pnotify.defaults.styling = "jqueryui";
	$.pnotify.defaults.history = false;
	$.pnotify.defaults.width = "320px";
	
});

function onlySpecialDay(date) {
	return [(date.getDay() == 1 || date.getDay() == 5), ''];
}

function onlyWeekDay(date) {
	return [(date.getDay() >= 1 && date.getDay() <= 5), ''];
}

function handleErrorMessage(x, t, e) {
	if(t=='timeout') {
		if(confirm('요청시간이 초과되었습니다.\n재시도 하시겠습니까?')) {
			location.reload();
		}
	} else if(t=='parsererror') {
//		$.pnotify({
//		    text: '결과데이터 처리중에 오류가 발생했습니다.'+x.responseText,
//		    type: 'error'
//		});
		alert('결과데이터 처리중에 오류가 발생했습니다.');
	} else if(x.status==0) {
//		$.pnotify({
//		    text: '서버가 중지되었거나, 오프라인 상태입니다.<br>네트워크 상태를 확인해 주세요.',
//		    type: 'error'
//		});
    } else if(x.status==401) {
    	x.responseText&&(location.href=x.responseText);
    } else if(x.status==404 || x.status==500) {
//		$.pnotify({
//		    text: x.responseText,
//		    type: 'error'
//		});
		alert('결과데이터 처리중에 오류가 발생했습니다. \n다시 시도해 주세요.');
    } else {
//		$.pnotify({
//		    text: '알 수 없는 에러가 발생했습니다.<br>'+x.responseText,
//		    type: 'error'
//		});
    	if(x.status == 12017) {	// Operation cancelledl.
    		alert("요청이 취소되었습니다. [세션종료]");
    	} else {
    		alert('알 수 없는 에러가 발생했습니다. - '+x.responseText);
    	}
    }
    window.alert = function() { return false; };
}

function formatDate(dt) {
	var format = "yy-mm-dd";
	var delimiter = ".";
	if(arguments.length>1) {
		delimiter = arguments[1];
		format = "yy" + delimiter + "mm" + delimiter + "dd";
	}
	if(dt==null || dt=="") return $.datepicker.formatDate(format, new Date());
	
	if(typeof(dt) == 'string') {
		var rtnStr = "";
		if(dt.length == 4) {
			rtnStr = $.Format("{0}"+delimiter+"{1}",dt.substr(0,4),dt.substr(4,2));
		} else {
			rtnStr = $.Format("{0}"+delimiter+"{1}"+delimiter+"{2}",dt.substr(0,4),dt.substr(4,2),dt.substr(6,2));
		}
		return rtnStr;
	} else if(typeof(dt) == 'number') {
		return $.datepicker.formatDate(format, new Date(dt));
	} else {
		return dt;
	}
}

function formatTime(dt) {
	var date = new Date(dt);
	return $.Format("{0}:{1}",("0"+date.getHours()).substr(-2,2),("0"+date.getMinutes()).substr(-2,2));
}

function formatDateTime(dt) {
	var delimiter = ".";
	if(arguments.length>1) {
		delimiter = arguments[1];
	}
	
	var date = new Date(dt);
	return $.Format("{0}"+delimiter+"{1}"+delimiter+"{2} {3}:{4}"
			,date.getFullYear()
			,("0"+(date.getMonth()+1)).substr(-2,2)
			,("0"+date.getDate()).substr(-2,2)
			,("0"+date.getHours()).substr(-2,2)
			,("0"+date.getMinutes()).substr(-2,2));
}

function formatDateDecimal(num) {
	
	var rgx = /(^[+-]?\d+)(\d{3})/;
	var n = (num+'');
	
	if(rgx.test(num)) {		
		if(Number(num) == 0) {
			return num;
		}
		else {
			while(rgx.test(n)) {
				n = n.replace(rgx, '$1'+','+'$2');
			}
		}
	}
	
	return n;
	//alert(x1 + x2);
	
}

function isValidPassword(password) {
	var validLength = /.{6,12}/.test(password);
	var hasAlpha = /[A-Z|a-z]/.test(password);
	var hasNums = /\d/.test(password);
	var hasSpecials = /[~!,@#%&_\$\^\*\?\-]/.test(password);

	//return validLength && hasAlpha && hasNums && hasSpecials;
	return true;
}

function navSubmit(val, func) {
	$("#page").val(val);
    func.call();
}
function goPage(){
	$("form").submit();
};

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

//layerpopup by dialog
function dialogOpen(className){
	var openEle = $("."+className);
	openEle.dialog({
		
		open: function(event, ui) { 
			$('input:first', $(this)).blur(); 
		},
		
		draggable: true, 
		closeText: "닫기",
		width: "auto",
		resizable : false,
		modal:true,
		/*
		focus: function(event, ui) { 
	        $('input:visible:first-child' , $(this)).blur(); 
	    }
	    */
		beforeClose: function(event) {
	        if (event.keyCode === $.ui.keyCode.ESCAPE) {
	            return false;
	        }
	    }
	     
	});
	$('img.ui-datepicker-trigger').css({'cursor':'pointer', 'margin-left':'1px'}); // 달력아이콘 핸드포인터
	return false;
}

function dialogClose(className){
	var closeEle = $("."+className);
	closeEle.dialog( "close" );
}

//check date format : yyyy-MM-dd
function checkDateFormat(date){
	if(date=="") return false;
	
	var pattern = /[2]{1}[0]{1}[1-2]{1}[0-9]{1}-[0-1]{1}[0-9]{1}-[0-3]{1}[0-9]{1}/;
	return pattern.test(date);
}

var perProgress = function () {
	this.id = 'loadingLayer';
	this.init.apply(this);
};
perProgress.prototype = {
	init: function() {
		var html = "<div id='"+this.id+"' class='loadingLayer' style='display:none;'>";
		html += "		<div class='ui-widget-overlay2'></div>";
		html += "		<div class='loadingBox'>";
		html += "			<img src='/resources/images/admin/loading_webbar.gif' alt='처리중' />";
		html += "		</div>";
		html += "	</div>";
		
		$("body").append(html);
		
		var w = $(window).width()/2-$("#"+this.id+" .loadingBox").width()/2;
		var h = $(window).height()/2-$("#"+this.id+" .loadingBox").height()/2+$("#"+this.id).scrollTop();
		$("#"+this.id+" .loadingBox").css("position","fixed");
		$("#"+this.id+" .loadingBox").css("left", w);
		$("#"+this.id+" .loadingBox").css("top", h);
		$("#"+this.id+" .loadingBox").css("z-index", 10000);
		
		$(".ui-widget-overlay2").css({
			"opacity": "0.2", 
			"z-index": "9999"
		});
	},
	show : function() {
		$("#"+this.id).show();
	},
	hide : function() {
		$("#"+this.id).hide();
	}
};


var Progress = function () {
	this.id = 'loadingLayer';
	this.init.apply(this);
};
Progress.prototype = {
	init: function() {
		var html = "<div id='"+this.id+"' class='loadingLayer' style='display:none;'>";
		html += "		<div class='ui-widget-overlay2'></div>";
		html += "		<div class='loadingBox'>";
		html += "			<img src='/resources/images/admin/loading_webbar.gif' alt='처리중' />";
		html += "		</div>";
		html += "	</div>";
		
		$("body").append(html);
		
		var w = $(window).width()/2-$("#"+this.id+" .loadingBox").width()/2;
		var h = $(window).height()/2-$("#"+this.id+" .loadingBox").height()/2+$("#"+this.id).scrollTop();
		$("#"+this.id+" .loadingBox").css("position","fixed");
		$("#"+this.id+" .loadingBox").css("left", w);
		$("#"+this.id+" .loadingBox").css("top", h);
		$("#"+this.id+" .loadingBox").css("z-index", 10000);
		
		$(".ui-widget-overlay2").css({
			"opacity": "0.2", 
			"z-index": "9999"
		});
	},
	show : function() {
		$("#"+this.id).show();
	},
	hide : function() {
		$("#"+this.id).hide();
	}
};


function linkName() {
	var nameArr = [];
	for(var i=0; i<arguments.length; i++) {
		if(arguments[i] != "") {
			nameArr.push(arguments[i]);
		} 
	};
	return (nameArr.length > 0) ? nameArr.join("_") : "-";
}

function nvl(str, repl) {
	return (str != null && str != 'undefined' && str == '') ? repl : str;
}

/**
 * 두 날짜의 차이를 일자로 구한다.(조회 종료일 - 조회 시작일)
 *
 * @param val1 - 조회 시작일(날짜 ex.2002-01-01)
 * @param val2 - 조회 종료일(날짜 ex.2002-01-01)
 * @return 기간에 해당하는 일자
 */
function calDateRange(val1, val2)
{
    var FORMAT = "-";

    // FORMAT을 포함한 길이 체크
    if (val1.length != 10 || val2.length != 10)
        return -1;

    // FORMAT이 있는지 체크
    if (val1.indexOf(FORMAT) < 0 || val2.indexOf(FORMAT) < 0)
        return -1;

    // 년도, 월, 일로 분리
    var start_dt = val1.split(FORMAT);
    var end_dt = val2.split(FORMAT);

    // 월 - 1(자바스크립트는 월이 0부터 시작하기 때문에...)
    // Number()를 이용하여 08, 09월을 10진수로 인식하게 함.
    start_dt[1] = (Number(start_dt[1]) - 1) + "";
    end_dt[1] = (Number(end_dt[1]) - 1) + "";

    var from_dt = new Date(start_dt[0], start_dt[1], start_dt[2]);
    var to_dt = new Date(end_dt[0], end_dt[1], end_dt[2]);

    return (to_dt.getTime() - from_dt.getTime()) / 1000 / 60 / 60 / 24;
}


/* 날짜 변경 */
function calDateUpdate(val1, num)
{
    var FORMAT = "-";

    // FORMAT을 포함한 길이 체크
    if (val1.length != 10 )
        return -1;

    // FORMAT이 있는지 체크
    if (val1.indexOf(FORMAT) < 0 )
        return -1;

    // 년도, 월, 일로 분리
    var start_dt = val1.split(FORMAT); 

    // 월 - 1(자바스크립트는 월이 0부터 시작하기 때문에...)
    // Number()를 이용하여 08, 09월을 10진수로 인식하게 함.
    start_dt[1] = (Number(start_dt[1]) - 1) + ""; 

    var from_dt = new Date(start_dt[0], start_dt[1], start_dt[2]);
    var dayOfMonth = from_dt.getDate();
    from_dt.setDate(dayOfMonth + num); 
    
    var str_date = from_dt.getFullYear() + "-" 
                  + comRight("0" + (from_dt.getMonth()+1),2) + "-"   /* 자바스크립트 월 + 1 해줌 */ 
                  + comRight("0" + from_dt.getDate()     ,2);
    return str_date;
}

/* 날짜 변경 */
function calDateUpdate2(val1, num)
{ 

    // FORMAT을 포함한 길이 체크
    if (val1.length != 8 )
        return -1;
 

    // 년도, 월, 일로 분리
    var start_dt = new Array(3);
    start_dt[0] = val1.substr(0,4); 
    start_dt[1] = val1.substr(4,2); 
    start_dt[2] = val1.substr(6,2); 

    // 월 - 1(자바스크립트는 월이 0부터 시작하기 때문에...)
    // Number()를 이용하여 08, 09월을 10진수로 인식하게 함.
    start_dt[1] = (Number(start_dt[1]) - 1) + ""; 

    var from_dt = new Date(start_dt[0], start_dt[1], start_dt[2]);
    var dayOfMonth = from_dt.getDate();
    from_dt.setDate(dayOfMonth + num); 
    
    var str_date = from_dt.getFullYear() + "" 
                  + comRight("0" + (from_dt.getMonth()+1),2) + ""   /* 자바스크립트 월 + 1 해줌 */ 
                  + comRight("0" + from_dt.getDate()     ,2);
    return str_date;
}

function comRight(str,num){
	return str.substr(str.length-num ,str.length);
}

// (금액)콤마찍기
function comma(str) {
	str = String(str);
	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

// 엑셀파일여부 확인
function isExcelFile(path_value){
	var result = false;
	
	if(path_value != "") {
		var arr = path_value.split(".");
		var ext = (arr.length>0) ? arr[arr.length-1] : "";
	    switch (ext.toLowerCase()) {
	        case 'xls':
	        case 'xlsx':
	        case 'excel':
	        	result = true;
	            break;
	        default:
	        	result = false;
	    }
	}
	
	return result;
}

/*
 * Map 객체구현
 */
//linking the key-value-pairs is optional
//if no argument is provided, linkItems === undefined, i.e. !== false
//--> linking will be enabled
function Map(linkItems) {
 this.current = undefined;
 this.size = 0;

 if(linkItems === false)
     this.disableLinking();
}

Map.noop = function() {
 return this;
};

Map.illegal = function() {
 throw new Error("illegal operation for maps without linking");
};

//map initialisation from existing object
//doesn't add inherited properties if not explicitly instructed to:
//omitting foreignKeys means foreignKeys === undefined, i.e. == false
//--> inherited properties won't be added
Map.from = function(obj, foreignKeys) {
 var map = new Map;

 for(var prop in obj) {
     if(foreignKeys || obj.hasOwnProperty(prop))
         map.put(prop, obj[prop]);
 }

 return map;
};

Map.prototype.disableLinking = function() {
 this.link = Map.noop;
 this.unlink = Map.noop;
 this.disableLinking = Map.noop;
 this.next = Map.illegal;
 this.key = Map.illegal;
 this.value = Map.illegal;
 this.removeAll = Map.illegal;

 return this;
};

//overwrite in Map instance if necessary
Map.prototype.hash = function(value) {
 return (typeof value) + ' ' + (value instanceof Object ?
     (value.__hash || (value.__hash = ++arguments.callee.current)) :
     value.toString());
};

Map.prototype.hash.current = 0;

//--- mapping functions

Map.prototype.get = function(key) {
 var item = this[this.hash(key)];
 return item === undefined ? undefined : item.value;
};

Map.prototype.put = function(key, value) {
 var hash = this.hash(key);

 if(this[hash] === undefined) {
     var item = { key : key, value : value };
     this[hash] = item;

     this.link(item);
     ++this.size;
 }
 else this[hash].value = value;

 return this;
};

Map.prototype.remove = function(key) {
 var hash = this.hash(key);
 var item = this[hash];

 if(item !== undefined) {
     --this.size;
     this.unlink(item);

     delete this[hash];
 }

 return this;
};

//only works if linked
Map.prototype.removeAll = function() {
 while(this.size)
     this.remove(this.key());

 return this;
};

//--- linked list helper functions

Map.prototype.link = function(item) {
 if(this.size == 0) {
     item.prev = item;
     item.next = item;
     this.current = item;
 }
 else {
     item.prev = this.current.prev;
     item.prev.next = item;
     item.next = this.current;
     this.current.prev = item;
 }
};

Map.prototype.unlink = function(item) {
 if(this.size == 0)
     this.current = undefined;
 else {
     item.prev.next = item.next;
     item.next.prev = item.prev;
     if(item === this.current)
         this.current = item.next;
 }
};

//--- iterator functions - only work if map is linked

Map.prototype.next = function() {
 this.current = this.current.next;
};

Map.prototype.key = function() {
 return this.current.key;
};

Map.prototype.value = function() {
 return this.current.value;
};

	

//chrome 로그 보기 
function fn_consoleLog(msg){
	var agt = navigator.userAgent.toLowerCase();
	if ( agt.indexOf("chrome") != -1 ){
		console.log(msg);
	}
}


// 팝업창 중앙 띄우기
function popupWindow(popUrl, popWinName, ScreenWidth, ScreenHeight){
	
	var url          = popUrl;
	var winName      = popWinName;
	var w            = ScreenWidth;
	var h            = ScreenHeight;
	var LeftPosition = (screen.width-w)/2;
	var TopPosition  = (screen.height-h)/2;
	var popOption    = "width=" + w + ", height=" +h+ ", top=" +TopPosition+ " ,left=" + LeftPosition + ",resizable=no , location=no";
	
	window.open(url, winName, popOption);
}

// 결재함 - 프로젝트 팝업
function selectMainListViewApproval(id,startDate){ 
	var url = "";
	var winName = "popPJ";
	var w = 760;  // 가로길이 
	var h = 360;  // 세로길이
	   
	url = "/research/product_projectApproval.do";  // 상신 후
	url += "?id="+id+"&approvalStatus=Y&startDate="+startDate;

	popupWindow(url, winName, w, h);
   	
}

//기안함 - 상신 메모 팝업
function MemoViewApproval(id,startDate){ 
	var url = "";
	var winName = "popPJ";
	var w = 410;  // 가로길이 
	var h = 250;  // 세로길이
	   
	url = "/approval/memoApproval.do";  // 상신 메모
	url += "?id="+id+"&approvalStatus=Y&startDate="+startDate;

	popupWindow(url, winName, w, h);
   	
}

//기안함 - 반려 메모 팝업
function MemoViewReject(id,startDate){ 
	var url = "";
	var winName = "popPJ";
	var w = 410;  // 가로길이 
	var h = 250;  // 세로길이
	   
	url = "/approval/memoApprovalReject.do";  // 반려 메모
	url += "?id="+id+"&approvalStatus=Y&startDate="+startDate;

	popupWindow(url, winName, w, h);
   	
}
//프로젝트 투입비중 - 세부내용 메모 팝업
function MemoViewPjtSearchTable(id){ 
	var url = "";
	var winName = "popPJ";
	var w = 410;  // 가로길이 
	var h = 250;  // 세로길이
	   
	url = "/research/memoPjtTable.do";  // 상신 메모
	url += "?id="+id;

	popupWindow(url, winName, w, h);
   	
}

//결재 - 세부내용 메모 팝업
function MemoViewDetail(id){ 
	var url = "";
	var winName = "popPJ";
	var w = 410;  // 가로길이 
	var h = 250;  // 세로길이
	   
	url = "/approval/memoDetail.do";  // 상신 메모
	url += "?id="+id;

	popupWindow(url, winName, w, h);
   	
}
function MemoViewMonthEndingDataSearchTable(id){ 
	var url = "";
	var winName = "popPJ";
	var w = 410;  // 가로길이 
	var h = 250;  // 세로길이
	   
	url = "/monthending/memoDataResult.do";  // 상신 메모
	url += "?id="+id;

	popupWindow(url, winName, w, h);
   	
}
