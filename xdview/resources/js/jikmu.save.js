/**
 * FileName    : jikmu.save.js
 *  
 * @Description : 직무입력 폼검증
 * @Version     : 
 * @Author      : Copyright(C) c.broad - KIM_SANG_SU
 * @Date        : 2015. 2. 15. 오후 2:22:06
 */

$(document).ready(function() {  

	// 직무입력값 검증.
	jikmu.validate = function(){
		
		if($("#major_yn").val() != null && $("#major_yn").val().length == 0)	{
			alert("직무구분을 선택해 주세요.");	$("#major_yn").focus();	return false;	
		}
		
		if($("#jikmuDiv1").val() != null && $("#jikmuDiv1").val().length == 0)	{	
			alert("직무이력(대분류)을 선택해 주세요.");	$("#jikmuDiv1").focus();	return false;	
		}
		if($("#jikmuDiv2").val() != null && $("#jikmuDiv2 option").val() != null && $("#jikmuDiv2").val().length == 0) {	
			alert("직무이력(중분류)을 선택해 주세요.");	$("#jikmuDiv2").focus();	return false;	
		}
		if($("#jikmuDiv3").val() != null && $("#jikmuDiv3 option").val() != null && $("#jikmuDiv3").val().length == 0) {	
			alert("직무이력(소분류)을 선택해 주세요.");	$("#jikmuDiv3").focus();	return false;	
		}
		
		if($("#jikmu_start").val() == "") {
			alert("시작일을 입력해 주세요.");	$("#jikmu_start").focus();	return false;
		}

		if($("#jikmu_start").val().length != 10) {
			alert("시작일 날짜 형식이 부정확합니다.\n다시 입력해주세요.");	$("#jikmu_start").focus();	return false;	
		}
		
		/*
		if($("#jikmu_end").val()=="현재진행중") {
			alert("종료일을 입력해 주세요.");	$("#jikmu_end").focus();	return false;	
		}
		*/
		
		/*	
		if($("#jikmu_end").val() == "") {
			alert("종료일을 입력해 주세요.");	$("#jikmu_end").focus();	return false;
		}
		
		
		if($("#jikmu_end").val().length != 10)	{
			alert("종료일 날짜 형식이 부정확합니다.\n다시 입력해주세요.");	$("#jikmu_end").focus();	return false;	
		}
		*/
	
	   if($("#jikmu_start").val().length == 10 && $("#jikmu_end").val().length == 10) {
		  if( $("#jikmu_start").val() >= $("#jikmu_end").val()) {
			  alert("종료일이 시작일보다 이전입니다. \n확인 후 다시 입력해 주세요."); 
			  $("#jikmu_end").val("");
			  return false;
		  }   
	   }
		

		return true;
	};
	
});