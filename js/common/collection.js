	
$(function(){
	$(".ddmultisel").mouseover(function(){
		$(this).addClass("ddmultisel-over");
		$(this).children(".val").addClass("val-over");
	}).mouseout(function(){
		$(this).removeClass("ddmultisel-over");
		$(this).children(".val").removeClass("val-over");
	});
	$(".ddmultisel-optlist label").mouseover(function(){
		$(this).addClass("hover");
	}).mouseout(function(){
		$(this).removeClass("hover");
	});
});
	
	
function allCheck(idName){
	var checkObj = eval("tooltipPopup.document."+idName+"Form");
	var allChecked = !$("#"+idName+"Div input:first").attr("checked");	
	
	if(typeof(checkObj)=='undefined') return;
	if(typeof(checkObj.length)=='undefined') {
		checkObj.checked = allChecked;
	}
	else {
		for(var i=checkObj.length-1; i>=0; i--){
			checkObj[i].checked = allChecked; 
		}
	}
	var obj = $("#"+idName+"Div input");
	for(var j=0 ; j<obj.length ; j++){
		(allChecked == true)?  obj[j].checked = true : obj[j].checked = false;
	}
	displayCheckValue(idName);
}

function checkItem(valueStr, inputId){
	var checkedObject = $("#"+inputId+" input:checked");
	for(var i=0 ; i < checkedObject.length ; i++){
		if(checkedObject[i].value == valueStr) return "checked"; 
	}
	return "";
}

function changeReturnValues(paramObj){
	var obj = $("#"+paramObj.id+"Div input");
	var allCheckedFlag = true;
	for(var i=0 ; i<obj.length ; i++){
		if(paramObj.value == obj[i].value){
			(obj[i].checked == true)?  obj[i].checked = false : obj[i].checked = true;
		}
		if(i!=0 && obj[i].checked == false) allCheckedFlag = false; 
	}
	var checkObj = eval("tooltipPopup.document."+paramObj.id+"Form");
	if(allCheckedFlag == true) {
		$("#"+paramObj.id+"Div input:first").attr("checked","true");
		checkObj[0].checked = true;
	}else{
		$("#"+paramObj.id+"Div input:first").removeAttr("checked");
		checkObj[0].checked = false;
	}
	displayCheckValue(paramObj.id);
}

function initSetMultiCheck(paramObjId){
	var obj = $("#"+paramObjId+"Div input");
	var checkedObject = $("#"+paramObjId+"Div input:checked");
	if(obj.length - 1 == checkedObject.length){
		$("#"+paramObjId+"Div input:first").attr("checked","true");
	}
	displayCheckValue(paramObjId);
}

function displayCheckValue(paramObjId){
	var obj = $("#"+paramObjId+"Div input");
	var checkedObject = $("#"+paramObjId+"Div input:checked");
	if(obj.length == checkedObject.length){
		$("#"+paramObjId+"Text").text(Message.total);
	}
	else if(checkedObject.length>1)	{
		$("#"+paramObjId+"Text").text(checkedObject[0].label + " " + Message.except + " " + (checkedObject.length -1)  + Message.count);
	}
	else if(checkedObject.length==1){
		$("#"+paramObjId+"Text").text(checkedObject[0].label);
	}
	else $("#"+paramObjId+"Text").text("");
}

function get_obj_left(oDiv){
	if ($.browser.msie && ($.browser.version == 8.0)){
	   if(oDiv.offsetParent==document.body || oDiv.offsetParent==null || oDiv.offsetParent==document.documentElement)     
		   return oDiv.offsetLeft - oDiv.scrollLeft;
	   else
		   return oDiv.offsetLeft+get_obj_left(oDiv.offsetParent);
	}else{
	   if(oDiv.offsetParent==document.body || oDiv.offsetParent==null || oDiv.offsetParent==document.documentElement)     
		   return oDiv.offsetLeft;
	   else
		   return oDiv.offsetLeft+get_obj_left(oDiv.offsetParent);
	}

}

function get_obj_top(oDiv){
	if ($.browser.msie && ($.browser.version == 8.0)){
		if(oDiv.offsetParent==document.body || oDiv.offsetParent==null || oDiv.offsetParent==document.documentElement)
		   return oDiv.offsetTop - oDiv.scrollTop;
	   else
		   return oDiv.offsetTop+get_obj_top(oDiv.offsetParent) - oDiv.scrollTop;

	}else{
		   if(oDiv.offsetParent==document.body || oDiv.offsetParent==null || oDiv.offsetParent==document.documentElement)
			   return oDiv.offsetTop;
		   else
			   return oDiv.offsetTop+get_obj_top(oDiv.offsetParent);
	}
}

function get_parent_obj_top(id){
    return $("." + id).offset().top;
}


var multiSelectTooltipPopup = null;

/**
 * Multiple select createPopup 
 * - createPopup open(By AJAX)
 * 
 * @param id		: 실제로 submit 할 input(type=hidden) tag 의 id
 * @param spanId	: display 할 값을 들어갈 span tag 의 id
 * @param top		: createPopup top 
 * @param left		: createPopup left 
 * @param ddwidth	: createPopup 에서 한개의 dd가 차지하는 width 
 * @param height	: createPopup height 
 * @param ddNames	: 출력할 DD의 ddName을 comma(,)로 연결한 값 ex) DD_FUNCTION,ISSUE_MEETING_STATUS,COM_ADDRESS_RANGE
 * @return
 * 
 * @author 한석규(sukkyu.han)
 * @since 2010.04.15 
 */
function showMultiSetSelect(ddNames, id, spanId, top, left, ddwidth){
	var numOfDd 	 = 0;
	var numOfDdValue = 0;
	var ddContents   = "";
	var allCheckStr  = "checked";
	// ajax로 contents를 받아옴.
	// sample data : /com/dd/getDDByAjax.do?DD_NAMES=PJT_MKT_PROJECT_STATE,ISSUE_MEETING_STATUS
	var sUrl = contextPath + "/com/dd/getDDByAjax.do";
	$.ajax({
	    url: sUrl,
	    type: 'POST',
	    data: 'DD_NAMES='+ddNames,
	    dataType: 'json',
		success: function(json){
		    $.each(json, function(){
		    	ddContents += 
		    		'<ul class="fir" style="width:'+ddwidth+'px;">'+
			    	'<li class="part"><label>'+this.name+'</label></li>';
		    	var tempNumOfDdValue = 0;
		    	$.each(this.valueList, function(){
		    		var inputValue = this.ddName + ':' + this.ddValue;
		    		var checkedStr = isCheckedMultiSetValue(inputValue,id);
		    		if(allCheckStr=="checked" && "" == checkedStr) {
		    			allCheckStr="";
		    		}
		    		ddContents += '<li><label onclick="javascript:parent.multiSetCheckValue(document.getElementsByTagName(\'input\'));"><input type="checkbox" class="chk" value="'+inputValue+'" '+ checkedStr +' label="'+this.valueName+'"/>'+this.valueName+'</label></li>';
		    		tempNumOfDdValue++;
		    	});
		    	ddContents += '</ul>';
		    	numOfDd++;
		    	if(tempNumOfDdValue > numOfDdValue) numOfDdValue = tempNumOfDdValue;
		    });
	    },
	    complete:function(){
	    	var contents =
	    		'<div class="multiselGroup">	'+			
	    		'	<div class="multiselGroup01">	'+		
	    		'		<div class="multiselGroup02">	'+			
	    		'			<div class="ddmultisel-optlist xb">	'+		
	    		'				<div class="sel-all">	'+			
	    		'					<label>	<input type="checkbox"  class="chk" value="ALL_CHECK_MULTI_SET_VALUES" '+ allCheckStr +' onclick="javascript:parent.checkAllMultiSetValues(document.getElementsByTagName(\'input\'));"/>' + Message.total + '</label>	'+
	    		'				</div>	'+			
	    		'				<div class="multiselGroupList">	'+									
	    		ddContents	+
	    		'				</div>	'+	
	    		'				<div class="btnArea">	'+	
	    		'					<div class="popBtn">	'+	
	    		'					<span><a href="#" onclick="javascript:parent.confirmMultiSetValues(document.getElementsByTagName(\'input\'),\''+id+'\',\''+spanId+'\');return false;">' + Message.ok + '</a></span>	'+	
	    		'					<span><a href="#" onclick="javascript:parent.multiSelectTooltipPopup.hide();return false;">'+Message.cancel+'</a></span>	'+	
	    		'					</div>	'+	
	    		'				</div>	'+	
	    		'			</div>	'+	
	    		'		</div>	'+	
	    		'	</div>	'+	
	    		'</div>	';
	    	var itemHeight = 20;
	    	var width = ddwidth*numOfDd+6;
	    	numOfDdValue++
	    	//var height = (itemHeight * numOfDdValue) + 69;
	    	var height = (itemHeight * numOfDdValue) + 81;
	    	
	    	//showWindow(contents,"MultiSetPop", "left=" + left + ", top=" + top + ", width=" + width + ", height=" + height + ", className=ddmultisel-optlist", "TOOL-TIP","HTML");
	    	
	    	if(multiSelectTooltipPopup == null) {
	    		multiSelectTooltipPopup = window.createPopup();
	    		multiSelectTooltipPopup.document.createStyleSheet(contextPath + '/ui/css/plm.core.css');
			}
			var  oPopBody  =  multiSelectTooltipPopup.document.body; 
	   	 	oPopBody.innerHTML  = contents;
	   	 	multiSelectTooltipPopup.show(left,  top,  width,  height,  document.body);
	    }   
	});
}

function multiSetCheckValue(paramObj){
	var multiSetAllCheckFlag = true;
	for(var i=1 ; i<paramObj.length ; i++){
		if(!paramObj[i].checked){
			multiSetAllCheckFlag = false;
			break;
		}
	}
	(multiSetAllCheckFlag)? paramObj[0].checked = true : paramObj[0].checked = false; 
}

/**
 * Multiple select createPopup
 * - 화면 로딩시 Multiple select 의 초기값에 해당하는 값을 display 함.
 * 
 * @author 한석규(sukkyu.han)
 * @since 2010.04.15 
 */
function initMutilSetValue(ddNames, id, spanId){
	var value = $("#"+id).val();
	if(value != "" && value != null){
		var arrayValue = value.split("↔");
		var numOfVal   = arrayValue.length;
		var returnVal  = "";
		var sUrl = contextPath + "/com/dd/getDdValueByAjax.do";
		$.ajax({
		    url: sUrl,
		    type: 'POST',
		    data: 'DD_INFO='+arrayValue[0]+'&DD_NAMES='+ddNames,
		    dataType: 'text',
			success: function(text){
				returnVal = text;
		    },
		    complete:function(){
		    	var returnValArr = returnVal.split('↔');
		    	if(numOfVal == returnValArr[1]) $("#"+spanId).text(Message.total);
		    	else if(numOfVal>1)  $("#"+spanId).text(returnValArr[0]+" " + Message.except + " "+(numOfVal-1)+Message.count);
		    	else if(numOfVal==1) $("#"+spanId).text(returnValArr[0]);
		    }   
		});
	}else{
		$("#"+spanId).text("");
	}
}

/**
 * Multiple select createPopup
 * - create popup 생성시에 해당 row가 checked 여부
 * 
 * @author 한석규(sukkyu.han)
 * @since 2010.04.15 
 */
function isCheckedMultiSetValue(value, id){
	var valueArray = new Array();
	valueArray = $("#"+id).val().split('↔');
	for(var i=0 ; i<valueArray.length ; i++){
		if(valueArray[i] == value) return "checked=\"checked\"";
	}
	return "";
}

/**
 * Multiple select createPopup
 * - createPopup내용 반영(확인버튼 click!)
 * 
 * @author 한석규(sukkyu.han)
 * @since 2010.04.15 
 */
function confirmMultiSetValues(paramObj,id,spanId){
	var i=0;
	var lengthOfParam = paramObj.length;
	if(paramObj[0].value == "ALL_CHECK_MULTI_SET_VALUES") {
		i++;
		lengthOfParam--;
	}
	var valueArray = new Array();
	var diplayStr = "";
	for( i ; i<paramObj.length ; i++){
		if(paramObj[i].checked){
			valueArray.push(paramObj[i].value);
			if(""==diplayStr) diplayStr = paramObj[i].label;
		}
	}
	$("#"+id).val(valueArray.join('↔'));

	if(lengthOfParam == valueArray.length) $("#"+spanId).text(Message.total);
	else if(valueArray.length>1)  $("#"+spanId).text(diplayStr+" " + Message.except + " "+(valueArray.length-1)+Message.count);
	else if(valueArray.length==1) $("#"+spanId).text(diplayStr);
	else diplayStr = $("#"+spanId).text("");
	
	multiSelectTooltipPopup.hide();
}

/**
 * Multiple select createPopup
 * - 전체선택/해제
 * 
 * @author 한석규(sukkyu.han)
 * @since 2010.04.15 
 */
function checkAllMultiSetValues(paramObj){
	var checked = paramObj[0].checked;
	for(var i=0 ; i<paramObj.length ; i++){
		(checked)? paramObj[i].checked = true : paramObj[i].checked = false; 
	}
}
