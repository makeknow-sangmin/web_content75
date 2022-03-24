$(document).ready(function() {  
	
	$("input:radio[name='nonProjectGb']").click(function () {
		
		var radioValue = $("input:radio[name='nonProjectGb']:checked").val();
		
		if(radioValue == "N") {
			$("#workRow").show();      // 업무분류
			$("#productRow").show();   // 제품분류
			$("#projectRow").show();   // 프로젝트명			
		}
		// 비프로젝트
		else if(radioValue == "Y") {  
			common.init("workDiv1");
			common.init("productDiv1");			
			
			$("#workRow").hide();      // 업무분류
			$("#productRow").hide();   // 제품분류
			$("#projectRow").hide();   // 프로젝트명			
		}
			
	});
	/*	
	$("input:radio[name='nonProjectGb']").change(function () {
		
		var radioValue = $("input:radio[name='nonProjectGb']:checked").val();
		//alert("radioValue :" + radioValue);
		
		// 프로젝트 
		if(radioValue == "N") {
			$("#workRow").show();      // 업무분류
			$("#productRow").show();   // 제품분류
			$("#projectRow").show();   // 프로젝트명			
		}
		// 비프로젝트
		else if(radioValue == "Y") {  
			common.init("workDiv1");
			common.init("productDiv1");			
			
			$("#workRow").hide();      // 업무분류
			$("#productRow").hide();   // 제품분류
			$("#projectRow").hide();   // 프로젝트명			
		}
		*/
		/*
		if($("input:radio[name=nonProjectGb]")("checked",true)){  // Y:비프로젝트  N:프로젝트
			alert("비프로젝트 변경");
			fn_consoleLog($("input:radio[name='nonProjectGb']:checked").val() + "비프로젝트");
			common.init("workDiv1");
			common.init("productDiv1");
			
			$("#workRow").hide();      // 업무분류
			$("#productRow").hide();   // 제품분류
			$("#projectRow").hide();   // 프로젝트명
		} else {
			alert("프로젝트 변경");
			fn_consoleLog($("input:radio[name='nonProjectGb']:checked").val() + "프로젝트");	
			$("#workRow").show();      // 업무분류
			$("#productRow").show();   // 제품분류
			$("#projectRow").show();   // 프로젝트명
		}
		
		
	}); */
		
	// 업무구분
    $("#workDiv1").change(function () {
    	fn_consoleLog($("#workDiv1").val() + " 업무구분1");
		hideCheckProject();
		$("#searchBtn").hide();
    	if(this.value != '') {
	    	common.selectBox(this.value, "workDiv2");
    	} else {
    		common.clear("workDiv2");
    	}
    	common.clear("pmscode");
    	showProduct(true);   		
    });
    
    
    $("#workDiv2").change(function () {  
    	fn_consoleLog($("#workDiv2").val() + " 업무구분2");
		hideCheckProject();
				
		$("#searchBtn").show();
   		
		// 파생차
    	if(this.value == '179') {
    		showCheckProject();
    		showProjectOnly();
    		project.selectBox("pmscode");
    	} else if(this.value != '') {
    		// DFSS
    		if(this.value == '465' || this.value == '443') {
        		showProjectOnly();
           	// 신차
    		} else if(this.value == '178') {
    			showProjectWithCarType();
        	// 선행기획
    		} else if(this.value == '177') {
        		//hideProject();
        		common.clear("pmscode");
        		//$("#searchBtn").hide();
        	// 선행과제
    		} else if(this.value == '176') {
        		showProjectOnly();
    		}
    		project.selectBox("pmscode");
    		
    	} else {
    		showProjectOnly();
    		//common.clear("pmscode");
    		$("#searchBtn").hide();
    	}

   		common.init("productDiv1");

   		
    });
	// 프로젝트
    
    $("#pmscode").click(function () {  
    		//alert("pmscode_click");
   	if(this.value != '') {
    		//var carType = $("#pmscode option:selected").attr("carType");
			//$("#carType").html(carType);
			//$("input[name=carType]").val(carType);
   	}
	
   		
    });
    
	// 제품분류
    $("#productDiv1").change(function () { 
    	fn_consoleLog($("#productDiv1").val() + " 제품구분1");
    	if(this.value != '') {
	    	common.selectBox(this.value, "productDiv2");
    	} else {
	   		common.clear("productDiv2");
    	}
   		common.clear("productDiv3");
   		
    });
    $("#productDiv2").change(function () {
    	fn_consoleLog($("#productDiv2").val() + " 제품구분2");
    	if(this.value != '') {
	    	common.selectBox(this.value, "productDiv3");
    	} else {
	   		common.clear("productDiv3");
    	}
    });
    
	//기술분류
    $("#techDiv1").change(function () { 
    	fn_consoleLog($("#techDiv1").val() + " 기술구분1");
    	if(this.value != '') {
	    	common.selectBox(this.value, "techDiv2");
    	} else {
	   		common.clear("techDiv2");
    	}
   		common.clear("techDiv3");
   		
    });
    $("#techDiv2").change(function () {
    	fn_consoleLog($("#techDiv2").val() + " 기술구분2");
    	if(this.value != '') {
	    	common.selectBox(this.value, "techDiv3");
    	} else {
	   		common.clear("techDiv3");
    	}
    });
    
	//Task분류
    $("#taskDiv1").change(function () { 
    	fn_consoleLog($("#taskDiv1").val() + " Task구분1");
    	if(this.value != '') {
	    	common.selectBox(this.value, "taskDiv2");
    	} else {
	   		common.clear("taskDiv2");
    	}
   		common.clear("taskDiv3");
   		
    });
    $("#taskDiv2").change(function () {
    	fn_consoleLog($("#taskDiv2").val() + " Task구분2");
    	if(this.value != '') {
	    	common.selectBox(this.value, "taskDiv3");
    	} else {
	   		common.clear("taskDiv3");
    	}
    });
       
    // 직무 
    $("#jikmuDiv1").change(function () { 
    	fn_consoleLog($("#jikmuDiv1").val() + " 직무구분1");
    	if(this.value != '') {
    		jikmu.selectBox(this.value, "jikmuDiv2");
    	} else {
    		jikmu.clear("jikmuDiv2");
    	}
    	jikmu.clear("jikmuDiv3");
   		
    });
    
    $("#jikmuDiv2").change(function () {
    	fn_consoleLog($("#jikmuDiv2").val() + " 직무구분2");
    	if(this.value != '') {
    		jikmu.selectBox(this.value, "jikmuDiv3");
    	} else {
    		jikmu.clear("jikmuDiv3");
    	}
    });   
    
    /** 프로젝트 검색 */
    research.pmsValidate = function(){

		var common_title = $("#common_title").val();
		$.ajax({
			type : "POST",
			url : "/research/getProject.do",
			data : {   
				"title": common_title, 
			},
			dataType : 'json',
			async : false,
			success : function(result) {
				if (result.success) {
					var bExistPMS = false;
					
					// 동일한 프로젝트가 있으면 무조건 pmscode입력
					$(result.list).each(function(i) {
						if ( this.tot_cnt == -1 ){
							$("#common_pmscode").val(result.list[0].pmscode); 
							bExistPMS = true;
						}
					});

					if ( result.list.length == 0 ){
						$("#common_searchYn").val('Y'); 
					}else if ( result.list.length == 1 &&  bExistPMS ){
						$("#common_searchYn").val('Y'); 
					}else{
						// 유사 프로젝트 존재시
						if ( confirm("현재 유사한 프젝트가 존재합니다.\n\n팝업창을 통해 확인하시겠습니까? ") ){

						}else{
							$("#common_searchYn").val('Y'); 
						} 
					}


				} else {
					// 비슷한 프로젝트가 하나도 없을 경우 팝업창 띄우지 않는다.
					$("#common_searchYn").val('Y');
				}
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			}
		});
		
    };
    
	// 입력값 검증.
	research.validate = function(){
	 // 비프로젝트 검증
	 if($("input:radio[name='nonProjectGb']:checked").val() == "Y"){
		
		if($("#created").val() == "") {
			alert("과제생성일을 입력해 주세요."); $("#created").focus(); return false;
		}
		
		return true;
		
	 } else {
		// 프로젝트 검증
				
		if($("#workDiv1").val() != null && $("#workDiv1").val().length == 0)	{
			alert("업무구분을 선택해 주세요.");	$("#workDiv1").focus();	return false;	
		}
		if($("#workDiv2").val() != null && $("#workDiv2 option").val() != null && $("#workDiv2").val().length == 0)	{
			alert("업무구분을 선택해 주세요.");	$("#workDiv2").focus();	return false;
		}
				
		if($("#taskDiv1").val() != null && $("#taskDiv1").val().length == 0)	{	
			alert("Task분류를 선택해 주세요.");	$("#taskDiv1").focus();	return false;	
		}
		
		if($("#taskDiv2").val() != null && $("#taskDiv2 option").val() != null && $("#taskDiv2").val().length == 0) {	
			alert("Task분류를 선택해 주세요.");	$("#taskDiv2").focus();	return false;	
		}
		
		if($("#taskDiv3").val() != null && $("#taskDiv3 option").val() != null && $("#taskDiv3").val().length == 0) {	
			alert("Task분류를 선택해 주세요.");	$("#taskDiv3").focus();	return false;	
		}
	
		if($("#productDiv1").val() != null && $("#productDiv1").val().length == 0)	{	
			alert("제품분류를 선택해 주세요.");	$("#productDiv1").focus();	return false;	
		}
		
		if($("#productDiv2").val() != null && $("#productDiv2 option").val() != null && $("#productDiv2").val().length == 0) {	
			alert("제품분류를 선택해 주세요.");	$("#productDiv2").focus();	return false;	
		}
		
		if($("#productDiv3").val() != null && $("#productDiv3 option").val() != null && $("#productDiv3").val().length == 0) {	
			alert("제품분류를 선택해 주세요.");	$("#productDiv3").focus();	return false;	
		}
		
		if($("#techDiv1").val() != null && $("#techDiv1").val().length == 0)	{	
			alert("기술분류를 선택해 주세요.");	$("#techDiv1").focus();	return false;	
		}
		
		if($("#techDiv2").val() != null && $("#techDiv2 option").val() != null && $("#techDiv2").val().length == 0) {	
			alert("기술분류를 선택해 주세요.");	$("#techDiv2").focus();	return false;	
		}
		
		if($("#techDiv3").val() != null && $("#techDiv3 option").val() != null && $("#techDiv3").val().length == 0) {	
			alert("기술분류를 선택해 주세요.");	$("#techDiv3").focus();	return false;	
		}		

		//}
				
		/*	
		if($("#jobStartDate").val() != null && !checkDateFormat($("#jobStartDate").val()))	{
			alert("날짜 형식이 부정확합니다.\n다시 입력해주세요.");	$("#jobStartDate").focus();	return false;	
		}
		
		if($("#jobEndDate").val() != null && !checkDateFormat($("#jobEndDate").val()))	{
			alert("날짜 형식이 부정확합니다.\n다시 입력해주세요.");	$("#jobEndDate").focus();	return false;	
		}

		if($("#jobTime").val() != null && $("#jobTime").val() == "0.0")	{	
			alert("작업시간을 선택해 주세요.");	$("#jobTime").focus();	return false;	
		}
		*/
		
		if($("#created").val() == "") {
			alert("과제생성일을 입력해 주세요.");	$("#created").focus();	return false;
		}
		
		
		// 프로젝트 선택
		//if ($("#pmscode").children().length == 0) {
		/*if ($("#pmscode2 tr").length == 0) {
			alert("프로젝트를 조회하여 선택해주세요.");
			return false;
		}
		
		// 프로젝트 선택 
		if (!$("input[name=pmscode]").is(":checked")) {
			alert("프로젝트를 체크하여 선택해주세요.");
			return false;
		}*/
				
		return true;
		
	 } 
  };

});

// 프로젝트 입력방법
function showProjectOnly() {
	clearCombinationProject();
	$("#projectRow").show();
//	$("#carTypeRow").hide();
//	$("#combinationRow").hide();
//	$("#titleRow").hide();
}	
function showProjectWithCarType() {
	clearCombinationProject();
	$("#projectRow").show();
	$("#carTypeRow").show();
	$("#combinationRow").hide();
	$("#titleRow").hide();
}	
function hideProject() {
	$("#projectRow").hide();
	$("#carTypeRow").hide();
	$("#titleRow").hide();
}	
function hideProjectAll() {
	clearCombinationProject();
	$("#projectRow").hide();
	$("#carTypeRow").hide();
	$("#combinationRow").hide();
	$("#titleRow").hide();
}	
function showCombinationProject() {
	common.init("pmscode");
	$("#projectRow").hide();
	$("#carTypeRow").hide();
	$("#combinationRow").show();
	$("#titleRow").hide();
}	
function showCommonProject() {
	clearCombinationProject();
	$("#projectRow").hide();
	$("#carTypeRow").hide();
	$("#combinationRow").hide();
	$("#titleRow").show();
}
function clearCombinationProject() {
	$("#title").val("");
	$("#c_company").val("");
	$("#c_car_type").val("");
	$("#c_year").val("");
	$("#c_model_derive").val("");
	$("#c_product").val("");
}

// 프로젝트 입력방법 선택
function showCheckProject() {
	$("#ckProject").show();
}
function hideCheckProject() {
	$("#ckp").attr("checked", false);
	$("#ckProject").hide();
}


//제품 입력방법
function showProduct(flag) {
	common.init("productDiv1");

	if(flag == true) {
		$("#productRow").show();
	} else {
		$("#productRow").hide();
	}
}

var PMS = function() {
	this.company	= "";
	this.carType		= "";
	this.year			= "";
	this.modelDerive			= "";
	this.modelDeriveName	= "";
	this.product		= "";
};
PMS.prototype.concat = function() {
	var title = "";
	title += (this.company		== "") ? "" : this.company + " ";
	title += (this.carType			== "") ? "" : this.carType + " ";
	if(this.modelDerive=='2') {
		title += (this.year				== "") ? "" : this.year + " ";
	}
	title += (this.modelDerive	== "") ? "" : this.modelDeriveName + " ";
	title += (this.product		== "") ? "" : this.product + " ";
	
	$("#title").val( (title=="") ? " " : title + "프로젝트");
	$("input[name=carType]").val($("#c_car_type").val());
};

