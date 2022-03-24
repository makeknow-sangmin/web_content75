
/**************************************************************************************
 *  
 * PackageName : resources/js
 * FileName    : approval.js
 * 
 * @Title		: 결재
 * @Description : 결재 js
 * @Version     : 
 * @Author      : YounghoLee
 * @Date        : 2015.11.19
**************************************************************************************/				

var approval = {
	last : false,
	// 결재-미결재조회(팀장)
	selectList: function(status, page) {
		if(page == null || page == 'undefined' || page =="") page = 1;

		var progress = new Progress();
		var totalCount = 0;
		var pageSize = 10;
		
		
		var jobStartDate = "";
		var jobEndDate   = "";
		var userName     = "";
		
		if ( status == "S" ){
			// 
			jobStartDate = $("#jobStartDate_S").val().replace(/-/g, '');
			jobEndDate   = $("#jobEndDate_S").val().replace(/-/g, '');
			
			userName     = $("#userName_S").val() ;
		}else{
			// java 단에서 replace 함  
			jobStartDate = $("#jobStartDate").val();
			jobEndDate   = $("#jobEndDate").val();
			
			userName     = $("#userName").val() ;
		}
		
		 
		
		$.ajax({
			type : "POST",
			url : "/approval/list.do",
			data : { "approvalStatus": status
				   , "fromDate":jobStartDate 
				   , "toDate":jobEndDate 
				   , "userName":userName
				   , "page": page 
				   },
			dataType : 'json',
			success : function(result) {
				var html = "";
				
				var preJobStartDate = "";
				var temp_class = "class='tr-case1'";
				var bListView = true;
				
				if (result.success) {
					//console.log(">"+result);
					$(result.list).each(function(index) {
						bListView = true;
						
						if ( status == "Y" ){
							

							if(index==0) {
								totalCount = this.totalCount;
								$("#total").html(totalCount);
							}
							
						}else{
							// 미결재 리스트 일때만 날짜 조건 검색함  
							if ( (jobStartDate != "" && jobStartDate.length  > 7) && (jobEndDate != "" && jobEndDate.length  > 7)){
								 
								if ( this.jobStartDate >= jobStartDate && this.jobEndDate <= jobEndDate ){
									bListView = true;
								}else{
									bListView = false;
								}
							}else if (jobStartDate != "" && jobStartDate.length  > 7) {
								if ( this.jobStartDate >= jobStartDate ){
									bListView = true;
								}else{
									bListView = false;
								}
							}else if (jobEndDate != "" && jobEndDate.length > 7) {
								if ( this.jobEndDate <= jobEndDate ){
									bListView = true;
								}else{
									bListView = false;
								}
							}
							
							if ( userName != "" ){
								if ( this.research.userName == this.research.userName.replace(userName,"") ){
									bListView = false;
								}
							} 
							
						}
						
						
						
						if ( bListView ){
							if ( preJobStartDate != this.jobStartDate ){
								
								if (  temp_class == "class='tr-case1'"){
									temp_class = "";
								}else{
									temp_class = "class='tr-case1'";
								}
							}
							
							html +="<tr " +  temp_class + "  >";
	
	
							/*
							if(index%2==1) {
								html += "<tr class='tr-case1'>";
							} else {
								html += "<tr>";
							}
							*/
							if("S"==status) {
								html += "	<td class='txt-center'>";
								html += "  <input type='checkbox' name='historyId'  userId='"+this.research.userId+"' start='"+this.jobStartDate+"' end='"+this.jobEndDate+"' class='checkbox' value='"+this.id+"' />";
								html += "  <input type='checkbox' name='approvalId' value='"+this.approvalId     + "'/>";
								html += "  <input type='checkbox' name='once'       value='"+this.research.once  + "'/>";
								html += "  <input type='checkbox' name='researchId' value='"+this.research.id    + "'/>";
								html += " </td>";
							} else {
								if(this.approvalStatus=="Y") {	
									html += "	<td class='txt-center'>";
									html += "  <input type='checkbox' name='historyId'      userId='"+this.research.userId+"' start='"+this.jobStartDate+"' end='"+this.jobEndDate+"' class='checkbox' value='"+this.id+"' />";
									html += "  <input type='checkbox' name='approvalInfoId' value='"+this.approvalInfoId     + "'/>";
									html += "  <input type='checkbox' name='once'           value='"+this.research.once  + "'/>";
									html += "  <input type='checkbox' name='researchId'     value='"+this.research.id    + "'/>";
									html += " </td>";
								}else{
									html += "	<td class='txt-center'></td>";	
								}
								//html += "	<td class='txt-center'>"+((page-1)*pageSize+(index+1))+"</td>";
								
							}
							html += "	<td class='txt-center'>"+this.research.userName+"</td>";
							html += "	<td class='txt-center'>"+formatDate(this.jobStartDate)+" ~ "+formatDate(this.jobEndDate)+"</td>";
							html += "	<td class='txt-center'>"+this.workDay+"</td>";
							html += "	<td class='txt-center'>"+this.ratio+" %</td>";
							html += "	<td>"+linkName(this.research.workDivName1, this.research.workDivName2)+"</td>";
							html += "	<td>"+nvl(this.research.title,"(공통 프로젝트)")+"</td>";
							html += "	<td>"+linkName(this.research.productDivName2, this.research.productDivName3)+"</td>";
							html += "	<td>"+linkName(this.research.techDivName1, this.research.techDivName2, this.research.techDivName3)+"</td>";
							html += "	<td>"+linkName(this.research.taskDivName1, this.research.taskDivName2)+"</td>";
							if("S"==status) {
								html += "	<td class='txt-center'>"+this.submitDate+"</td>";
							} else {
								html += "	<td class='txt-center'>"+this.finalCompleteDate+"</td>";
								html += "	<td class='txt-center'>";
								if(this.approvalStatus=="P") {
									html += "<img src='/resources/images/btn_07.png' alt='진행' />";
								} else if(this.approvalStatus=="C") {
									html += "<img src='/resources/images/btn_05.png' alt='완료' />";
								} else if(this.approvalStatus=="R") {
									html += "<img src='/resources/images/btn_03.png' alt='반려' />";
								} else {
									html += "<img src='/resources/images/btn_09.png' alt='' />";
								}
								html += " </td>";
							}
							html += "</tr>";
						}
						
						
						preJobStartDate = this.jobStartDate;
						
					});
					
				} else {
					if("S"==status) {
						html = "<tr><td class='txt-center' colspan='11'>조회결과가 없습니다.</td></tr>";
					} else {
						html = "<tr><td class='txt-center' colspan='12'>조회결과가 없습니다.</td></tr>";
					}
				}
				
				if(status == "S") {
					$("#research_submit > tbody").html(html);
				} else {
					$("#research_finish > tbody").html(html);
				}
				
				// set hidden checkbox
				$("input[name=approvalId]").hide();
				$("input[name=approvalInfoId]").hide();
				$("input[name=once]").hide();
				$("input[name=researchId]").hide();

				// 이벤트 설정
				$("input[name=historyId]").click(function() {
					$(this).parent().children().prop('checked',$(this).is(":checked"));

					var thisUserId = $(this).attr("userId");
					var thisStartDate = $(this).attr("start");
					var thisEndDate = $(this).attr("end");
					var checked = $(this).is(":checked");
					
					$("input:checkbox[userId="+thisUserId+"][start="+thisStartDate+"][end="+thisEndDate+"]").each(function() {
						$(this).prop('checked', checked);
						$(this).parent().children().prop('checked',$(this).is(":checked"));
					});
					
				});
				
				// paging
				$('#paging').paging({
					current: page,
					max: Math.ceil(totalCount/pageSize),
					first: "&lt;&lt;",
					prev: "&lt;",
					next: "&gt;",
					last: "&gt;&gt;",
					onclick:function(e,page){
						approval.selectList(status, page);
					}
				});
				
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			},
			beforeSend : function() {
				progress.show();
			},
			complete : function() {
				progress.hide();
			}
		});
	},
	reporter: function(targetId) {
		$.ajax({
			type : "POST",
			url : "/approval/approver/reporter.do",
			data : { },
			dataType : 'json',
			success : function(result) {
				var html = "";
				if (result.success) {
					$(result.data).each(function(i) {
						html += "<option value='"+this.userId+"'>"+this.localname+"</option>";
					});
				}
				
				$("#"+targetId).html(html);
				$("#"+targetId).show();
				
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			}
		});
	},
	approve: function() {
		if ($("input[name=historyId]").length == 0) return;
		
		if(!$("input[name=historyId]").is(":checked")) {
			alert("승인 대상을 선택해주세요.");
		} else {
			if(confirm("승인처리 하시겠습니까?")) {
				var progress = new Progress();
				progress.show();
				
				var f = document.approvalForm;
				f.method = "POST";
				f.action = "/approval/approve.do";
				f.submit();
			}
		}
	},
	approvalCancel: function() {
		if ($("input[name=historyId]").length == 0) return;
		
		if(!$("input[name=historyId]").is(":checked")) {
			alert("결재취소 대상을 선택해주세요.");
		} else {
			if(confirm("결재취소 하시겠습니까?")) {
				var progress = new Progress();
				progress.show();
				
				var f = document.approvalForm;
				f.method = "POST";
				f.flag.value = "C";
				f.action = "/approval/approvalCancel.do";
				f.submit();
			}
		}
	},
	
	
	
	reject: function() {
		if ($("input[name=historyId]").length == 0) return;
		
		if(!$("input[name=historyId]").is(":checked")) {
			alert("반려 대상을 선택해주세요.");
		} else {
			if(confirm("반려처리 하시겠습니까?")) {
				var progress = new Progress();
				progress.show();
				
				var f = document.approvalForm;
				f.method = "POST";
				f.action = "/approval/reject.do";
				f.submit();
			}
		}
	},
	approverList: function(targetId) {
		$.ajax({
			type : "POST",
			url : "/approval/approver/list.do",
			data : { },
			dataType : 'json',
			success : function(result) {
				var html = "";
				if (result.success) {
					$(result.data).each(function(i) {
						html += "<option value='"+this.userId+"'>"+this.localname+"</option>";
					});
				}
				
				$("#"+targetId).html(html);
				$("#"+targetId).show();
				
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			}
		});
	}

};
