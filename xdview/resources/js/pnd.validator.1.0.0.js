var validateSpec = {
	email_pattern : "/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i",
	email_v_msg : "eg. xxx@mobis.co.kr",
	date_pattern : "/[0-9]{4}.[0-9]{2}.[0-9]{2}/",
	callback:function(data){},
	parser:function jsonParser(data){return data;}
};

/**
 * 
 */
var validator = (function(validateSpec){
	// private
	var dataCache={};
	var id=0;
	
	// valuable
	var email_pattern = validateSpec.email_pattern || "/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i";
	var email_v_msg = validateSpec.email_v_msg || "eg. xxx@mobis.co.kr";
	var date_pattern = validateSpec.date_pattern || "/[0-9]{4}.[0-9]{2}.[0-9]{2}/";
	var o;
	
	var showTip = function(txt){
		tip = $('<div><p id="validateTips" class="validateTips" onclick="removeTips();">&nbsp;</p></div>').appendTo($('body'));
		
		if(o){
			var _top = o.offset().top + o.outerHeight(true) + 5;
			var _left = o.offset().left; 
			$(".validateTips").offset({top:_top,left:_left});
			o.addClass( "field_warning" );
			o.one("mouseover",function(){
				hideTip();
			});
		}else{
			var _top = $('body').height()/2 - tip.height()/2;
			var _left = $('body').width()/2;
			
			$(".validateTips").offset({top:_top,left:_left});
		}
		
		$(".validateTips").text(txt).addClass( "tips_warning" );
		
//		setTimeout(function() {$(".validateTips").removeClass( "tips_warning");},2000);
//		setTimeout(function() {$(".validateTips").text("");},2000);
		setTimeout(function() {$(".field_warning").removeClass( "field_warning");},2000);
		setTimeout(function() {tip.remove();},2000);
		
	};
	
	var hideTip = function(){
		$(".validateTips").removeClass("tips_warning");
		$(".field_warning").removeClass("field_warning");
		$(".validateTips").text("");
	};
	
	var checkNull = function(fname){      
		if ( !(o.val().length > 0) ) 
		{        
			showTip(fname + "는(은) 필수 입력항 입니다." );        
			return false;      
		} 
		else
		{
			return true;      
		}
	};

	var checkSelected = function(fname){
		if (!o || !o.val() || !(o.val().length > 0) ) {        
			showTip(fname + "는(은) 반드시 선택하셔야 합니다." );        
			return false;      
		} else {
			return true;      
		}    
	};
	
	var checkRadio = function(name, fname)
	{
		if (!$("input[name='"+name+"']:checked").val())  {
			showTip(fname + "는(은) 반드시 선택하셔야 합니다." );
			return false; 
		} else {
			return true;
		}
	};

	var checkLength = function(fname, min, max )  {
		if(min && max){
			if (  o.val().length < min || max && o.val().length > max ){        
//				showTip("Length of " + fname + " must be between " + min + " and " + max + "." );
				showTip("\""+ fname + "\"의 허용 문자열 길이는 최소 " + min + " ~ " + max + "\"\"자 입니다." );
				return false;      
			}else{
				return true;      
			}
		}else if(min){
			if ( o.val().length < min ){        
				showTip("\""+ fname + "\"은(는) 최소 " + min + "자 이상입니다." );        
				return false;      
			}else{
				return true;      
			}
		}else if(max){
			if ( o.val().length > max ){        
				showTip("\""+ fname + "\"은(는) 최대 " + min + "자 이하입니다." );
				return false;      
			}else{
				return true;      
			}
		}else{
			return true;
		}
	};
	
	var checkDate = function (n) 
	{
		if(!isDate(o.val())){
			showTip( n + "가(이) Date 형식(yyyy.MM.dd)에 맞지 않습니다." );       
			o.val(d);
			return false;   
		}else{
			return true; 
		}
	};
	
	var isDate = function (d) {
		if(d == ""){
			return true;
		}
		
		// 포맷에 안맞으면 false리턴
		if(d.match(date_pattern)) {
			return false;
		}

		var month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		var dateToken = d.split('.');
		var year = Number(dateToken[0]);
		var month = Number(dateToken[1]);
		var day = Number(dateToken[2]);

		// 날짜가 0이면 false
		if(day == 0) {
			return false;
		}

		var isValid = false;

		// 윤년일때
		if(isLeaf(year)) {
			if(month == 2) {
				if(day <= month_day[month-1] + 1) {
					isValid = true;
				}
			} else {
				if(day <= month_day[month-1]) {
					isValid = true;
				}
			}
		} else {
			if(day <= month_day[month-1]) {
				isValid = true;
			}
		}

		return isValid;
	};
	
	var callback = validateSpec.callback || function(data){};
	var parseData = validateSpec.parser || function(data){};
	
	return {
		hideTip:function(){
			var tip = hideTip(); 
			dataCache[id++] = tip;
			return parseData(tip, callback);
		},
		checkNull:function(obj,fname){
			o=obj;
			var tip = checkNull(fname); 
			dataCache[id++] = tip;
			return parseData(tip, callback);
		},
		checkSelected:function(obj,fname){
			o=obj;
			var tip = checkSelected(fname); 
			dataCache[id++] = tip;
			return parseData(tip, callback);
		},
		checkRadio:function(name, fname){
			var tip = checkRadio(name,fname); 
			dataCache[id++] = tip;
			return parseData(tip, callback);
		},
		checkCBox:function(name, fname){
			var tip = checkRadio(name,fname); 
			dataCache[id++] = tip;
			return parseData(tip, callback);
		},
		checkLength:function(obj, fname, min, max ){      
			o=obj;
			var tip = checkLength(fname, min, max ); 
			dataCache[id++] = tip;
			return parseData(tip, callback);  
		},
		checkDate:function ( obj, fname){      
			o=obj;
			var tip = checkDate(fname); 
			dataCache[id++] = tip;
			return parseData(tip, callback); 
		},
		cache: function(id){ return dataCache[id];},
		getLastCacheId : function() { return id;}
	};
	
})(validateSpec);