/**
 * 
 * FileName    : userStatistic
 * 
 *
 * @Description : 
 * @Version     : 
 * @Author      : Copyright(C) c.broad - 정원식
 * @Date        : 2015. 4. 24
 */
var userStatistic = {         
	unRegisteredUserListAjax: function() { 
		//var progress = new Progress(); 
		$.ajax({
			type : "POST",
			url : "/userstatistic/unRegisteredUserList.do",  
			data : {"teamDesc":$("#teamDesc").val()
				,"fromDate":$("#fromDate").val().replace(/-/g, '')
				,"toDate":$("#toDate").val().replace(/-/g, '')
				},
			dataType : 'json',
			success : function(result) {  
				var html = "";
				var len  = 0;
				if (result.success) {
							 
					len = result.list.length;
					$(result.list).each(function(index) {
						html +="<tr    >";
						html +=  "<td class='txt-center'>" + (len-index)   + "</td>";
						html +=  "<td class='txt-center'>" + this.userName + "</td>";
						html +=  "<td class='txt-center'>" + this.teamDesc + "</td>"; 
						html +=  "<td class='txt-center'>"+formatDate(this.jobStartDate)+" ~ "+formatDate(this.jobEndDate)+"</td>"; 
						html +="</tr>";
					});
					$("#unRegisteredUserList > tbody").html(html);
				}  	
			},
			error      : function(x, t, e){ handleErrorMessage(x, t, e); },
			beforeSend : function() { 
				//progress.show();
			},
			complete   : function() {  
				//progress.hide(); 
			}
		});
	}
	,unRegisteredUserList: function() {
		var f1 = document.forms[0];
		f1.action      = "unRegisteredUserList.do"; 
		f1.page.value  = "1";
		f1.excel.value = "";
		f1.target      = "";
		f1.submit();
	}
	,unRegisteredUserListExcel: function() {  
		var f1 = document.forms[0];
		f1.action      = "unRegisteredUserList.do";
		f1.excel.value = "true";
		f1.target      = "ifr";
		f1.submit(); 

		f1.excel.value = "";
		f1.target      = "";
	}
	
	/**************************
	 * 팀별 기간별 등록율
	 **************************/ 
	,teamPeriodRegistRatioList: function() {
		var f1 = document.forms[0];
		f1.action      = "teamPeriodRegistRatioList.do"; 
		f1.page.value  = "1";
		f1.excel.value = "";
		f1.target      = "";
		f1.submit();
	}
	,teamPeriodRegistRatioListExcel: function() {  
		var f1 = document.forms[0];
		f1.action      = "teamPeriodRegistRatioList.do";
		f1.excel.value = "true";
		f1.target      = "ifr";
		f1.submit();
		
		f1.excel.value = "";
		f1.target      = "";
	}
	
	/**************************
	 * 프로젝트별 인원리스트
	 **************************/ 
	,researchHistoryList: function() {
		var f1 = document.forms[0];
		f1.action      = "researchHistoryList.do";
		f1.page.value  = "1";
		f1.excel.value = "";
		f1.target      = "";
		f1.submit();
	}
	,researchHistoryListExcel: function() {  
		var f1 = document.forms[0];
		f1.action      = "researchHistoryList.do";
		f1.excel.value = "true";
		f1.target      = "ifr";
		f1.submit();
		
		f1.excel.value = "";
		f1.target      = "";
	}
	, selectMainListViewApproval: function(sumRation,startDate,id) {
		/** research.selectMainListViewApproval 거의 동일  */
		
		var url = "";
		var winName = "popPJ";
		var w = 640;  // 가로길이 
		var h = 360;  // 세로길이
		
		var approvalStatus ;
		if ( sumRation != "" ){
			approvalStatus = "Y";
		}else{
			approvalStatus = "N";
		} 
		
		if(approvalStatus == "Y" || approvalStatus == "P"){  
			url = "/research/product_projectApproval.do";  // 상신 후
			url += "?id="+id+"&approvalStatus="+approvalStatus+"&startDate="+startDate;
			
		}else{	
			url = "/research/product_project.do";  // 상신 전
			url += "?id="+id;
		}
			
		popupWindow(url, winName, w, h);
	   	//p.focus();
	}
	/** 직무별 리스트 */
	,jikmuUserList: function() {
		var f1 = document.forms[0];
		f1.action      = "jikmuUserList.do";
		f1.page.value  = "1";
		f1.excel.value = "";
		f1.target      = "";
		f1.submit();
	}
	,jikmuUserListExcel: function() {  
		var f1 = document.forms[0];
		f1.action      = "jikmuUserList.do";
		f1.excel.value = "true";
		f1.target      = "ifr";
		f1.submit();
		
		f1.excel.value = "";
		f1.target      = "";
	}
, MemoViewApproval: function(sumRation,startDate,id) {

		
		var url = "";
		var winName = "popPJ";
		var w = 640;  // 가로길이 
		var h = 360;  // 세로길이
		
		var approvalStatus = 'P' ;
		
		
			url = "/research/product_project.do";  // 상신 전
			url += "?id="+id;
			
			popupWindow(url, winName, w, h);
		   	//p.focus();
		}
			
		

};
