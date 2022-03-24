
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
	var valOrigin = $("#"+paramObjId+"Text").attr("title");
	if(obj.length == checkedObject.length){
		$("#"+paramObjId+"Text").text("전체");
	}
	else if(checkedObject.length>1)	{
		$("#"+paramObjId+"Text").text(checkedObject[0].label + " 외 " + (checkedObject.length -1)  + "건");
	}
	else if(checkedObject.length==1){
		$("#"+paramObjId+"Text").text(checkedObject[0].label);
	}
	else $("#"+paramObjId+"Text").text(valOrigin);
}