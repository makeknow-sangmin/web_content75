/**************************************************************************************
 *  
 * PackageName : resources/js
 * FileName    : research2.js
 * 
 * @Title		: 프로젝트경력관리 js
 * @Description : 프로젝트경력관리 - 프로젝트 추가 - 저장 등 js
 * @Version     : 
 * @Author      : 이영호
 * @Date        : 2015.11.19
**************************************************************************************/		
//wbs목록이 존재하는지 구분
var hasWbsList = false;

//수정, 복사추가시 selectbox Callback 함수
var CALL_FC = {
	call : function(target, val) {
			/*console_logs('CALL_FC  target', target);
			console_logs('CALL_FC  value', val);
			console_logs('CALL_FC complete');*/
			researchChange("#"+target, val) ;
			//alert('productDiv1 called');
		}
}
//수정,복사추가시 콤보박스 값담기위해
var CALL_FC_HIDDEN_ME = {
	call : function(target, val) {
		//   1.2 SelectBox를 초기화한다.
			$("#taskDiv1").empty();
			//2. 초기화된 SelectBox에 Option을 추가한다.
			$("#taskDiv1").append("<option value=''>선택</option>");
			$("#taskDiv1").append("<option value='15'>PM/PL/공통</option>");
			$("#taskDiv1").append("<option value='685'>선행기획</option>");
			
		//선행기획인경우 task 2레벨,3레벨을 숨김
		if(val == 685){
			
			$("#taskDiv2").hide();
			$("#taskDiv3").hide();
		//pm/pl공통인경우
		}
		researchChange("#"+target, val) ;
		//$("#"+target ).hide();
	}
}
//수정,복사추가시 콤보박스 값담기위해
var CALL_FC_PMPL = {
	call : function(target, val){
			$("#techDiv1").empty();
	    	$("#techDiv2").empty();
	    	$("#techDiv3").empty();
			$("#techDiv1").append("<option value='-1'>PM/PL공통</option>");
		
	}
}

var research = {
	last : false 
	,asyncYN:true
	,research_object:null
	// 메인화면
	,refreshCombobox: function() {
	 var isCheck = $("#withoutCode").is(":checked"); 

		 if(isCheck){
			//Task 분류를 제외한 나머지 hide
			/* $("#researchProductSelect").hide();
			$("#researchTechSelect").hide(); */
			/* $('#taskDiv2').removeAttr('disabled');
			$('#taskDiv3').removeAttr('disabled'); */
			$('#taskDiv1').removeAttr('disabled');
			//appMemoClear();
			common.init("taskDiv1");
			common.init("productDiv1");
			common.init("techDiv1");
			
			$("#taskDiv1").val(15);
			//   1.1 추가대상 Option의 Value와 Title을 임시 저장해놓는다.
			var val = $("#taskDiv1").val();
			var text = $("#taskDiv1 option:selected").text();
			$("#taskDiv1").val(685);
			var val1 = $("#taskDiv1").val();
			var text1 = $("#taskDiv1 option:selected").text();
			//   1.2 SelectBox를 초기화한다.
			$("#taskDiv1").empty();
			//2. 초기화된 SelectBox에 Option을 추가한다.
			$("#taskDiv1").append("<option value=''>선택</option>");
			$("#taskDiv1").append("<option value='"+val+"'>"+text+"</option>");
			$("#taskDiv1").append("<option value='"+val1+"'>"+text1+"</option>");
		
			//프로젝트 테이블에 N00000, 공통 프로젝트를 select 해온다.
			//1.
			pjtSearch.nonCode_add_search("N00000");
			
		}else{
			research.appMemoClear();
			clearTable();
			//체크 해제할경우 제품,기술 분류 다시 show
			common.selectBox(2, "taskDiv1"); 
			common.init("taskDiv1");
			common.init("productDiv1");
			common.init("techDiv1");
			$('#taskDiv1').removeAttr('disabled');
			//코드없음 체크해제시 현재 체크되어있는 wbs에 대한 pjt그리기
			var wbsCode = $("#wbsCode").text();
			//pjtSearch.selectWbs_add_search(wbsCode);
			nonCode = false;
		}
	},
	selectMainList: function(status) {   
		var progress = new Progress();
		$.ajax({
			type : "POST",
			url : "/research/list.do",
			data : { "status": status },
			dataType : 'json',
			success : function(result) {
				var html = "";
				var preJobStartDate = "";
				var temp_class = "class='tr-case1'";
				
				if (result.success) {
					$(result.list).each(function(index) {
						
				        if(index%2==1) {
							html += "<tr class='tr-case1'>";
						} else {
							html += "<tr>";
						}
						
						if("Y"==status) { // 진행
							html += "	<td class='txt-center'>";
							if(this.non_project_gb == "N"){
								html += "  <input type='checkbox' name='chs' class='checkbox' approvalCount='"+this.approvalCount+"' approvalS='"+this.approvalStatus+"' jobStartDT='"+this.jobStartDate+"' jobEndDT='"+this.jobEndDate+"' value='"+this.id+"' />";
							}
							html += " </td>";
						} else {         // 종료 
							html += "	<td class='txt-center'>"+(index+1)+"</td>";
						}
				
						html += "   <td class='txt-center'>"+( (this.non_project_gb == "N") ? ("프로젝트"):("비프로젝트"))+"</td>";
						html += "	<td class='txt-center'>"+nvl(this.workDivName1,"-")+"</td>";
						html += "	<td class='txt-center'>"+nvl(this.workDivName2,"-")+"</td>";
						
						html += "	<td class='txt-center'>"+nvl(this.productDivName1,"-")+"</td>";
						html += "	<td class='txt-center'>"+nvl(this.productDivName2,"-")+"</td>";
						
						if(this.non_project_gb == "N"){ // 프로젝트 
							if("Y"==status) {   		// 진행
								html += "	<td class='txt-center'><a href=javascript:research.selectMainListView('"+this.encryptedId+"');>"+ this.productDivName3 +"</a></td>";
							}else{              		// 종료
								html += "	<td class='txt-center'>"+ this.productDivName3 +"</a></td>";
							}
						} else {                    	// 비프로젝트 
							if("Y"==status) {   		// 진행	
								html += "	<td class='txt-center'><a href=javascript:research.selectMainListView('"+this.encryptedId+"');>"+ "비프로젝트" +"</a></td>";
							}else{                 // 종료
								html += "	<td class='txt-center'>"+ "비프로젝트" +"</a></td>";
							}
						}
						if(this.jobStartDate == "" || this.jobEndDate == ""){
							html += "	<td class='txt-center'> 승인후 반영예정 </td>";
						} else { 
							html += "	<td class='txt-center'>"+ formatDate(this.jobStartDate,'/') +" ~ "+formatDate(this.jobEndDate,'/')+"</td>";  // 수행기간
						}
						
						html += "	<td class='txt-center'><a href=javascript:research.selectMainListView2('"+this.encryptedId+"','"+status+"');>"+ this.cnt+"</a></td>";   // 프로젝트 수
						html += "	<td class='txt-center'>"+this.workDay+"</td>"; // 근무일수
						html += "	<td class='txt-center'>"+this.ratio+"</td>";   // 투입비율
						html += "</tr>";
						
						preJobStartDate = this.jobStartDate;
					});
				} else {
					html = "<tr><td class='txt-center' colspan='11'>조회결과가 없습니다.</td></tr>";
				}
				
				if(status == "Y") {
					$("#tableId2 > tbody").html(html);
					tableScrollling("divHeader2", "divContent2", "tableId2");
				} else {
					$("#tableId3 > tbody").html(html);
					tableScrollling("divHeader3", "divContent3", "tableId3");
				}
				
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
	
	selectMainHistoryList: function(status) {   

		var progress = new Progress();
		$.ajax({
			type : "POST",
			url : "/research/mainHistory.do",
			data : { 
				"status": status , 
				"jobStartDate": $("#jobStartDate1").val() ,
				"jobEndDate": $("#jobEndDate1").val()

			},
			dataType : 'json',
			success : function(result) {
				var html = "";
				var preJobStartDate = "";
				var temp_class = "class='tr-case1'";

				var cnt = 0;
				var rowspanx = "";
				var cntidx = 0;
				
				if (result.success) {
					$(result.list).each(function(index) {

				        if(cnt == 0){
				        	cnt =  this.cnt;
				        	cntx = "pre";
				        	cntidx = cntidx +1;
				        	rowspanx = "rowspan='"+ this.cnt +"'";
				        }else{
				        	rowspanx = "";
				        }
						
						if(index%2==1) {
							html += "<tr class='tr-case1'>";
						} else {
							html += "<tr>";
						}
						
						if(cntx == "pre"){
						html += "	<td class='txt-center' "+rowspanx+">"+cntidx+"</td>";
						if("Y"==this.status) {   		// 진행
							html += "	<td class='txt-center' "+rowspanx+">진행</td>";
						}else{              		// 종료
							html += "	<td class='txt-center' "+rowspanx+">종료</td>";
						}
				
						html += "   <td class='txt-center' "+rowspanx+">"+( (this.non_project_gb == "N") ? ("프로젝트"):("비프로젝트"))+"</td>";
						html += "	<td class='txt-center' "+rowspanx+">"+nvl(this.workDivName1,"-")+"/"+nvl(this.workDivName2,"-")+"</td>";
						
						html += "	<td class='txt-center' "+rowspanx+">"+nvl(this.productDivName1,"-")+"</td>";
						html += "	<td class='txt-center' "+rowspanx+">"+nvl(this.productDivName2,"-")+"</td>";
						
						if(this.non_project_gb == "N"){ // 프로젝트 
							if("Y"==this.status) {   		// 진행
								html += "	<td class='txt-center' "+rowspanx+">"+ this.productDivName3 +"</a></td>";
							}else{              		// 종료
								html += "	<td class='txt-center' "+rowspanx+">"+ this.productDivName3 +"</a></td>";
							}
						} else {                    	// 비프로젝트 
							if("Y"==this.status) {   		// 진행	
								html += "	<td class='txt-center' "+rowspanx+">"+ "비프로젝트" +"</td>";
							}else{                 // 종료
								html += "	<td class='txt-center' "+rowspanx+">"+ "비프로젝트" +"</td>";
							}
						}
						if(this.jobStartDate == "" || this.jobEndDate == ""){
							html += "	<td class='txt-center' "+rowspanx+"> 승인후 반영예정 </td>";
						} else { 
							html += "	<td class='txt-center' "+rowspanx+">"+ formatDate(this.jobStartDate,'/') +" ~ "+formatDate(this.jobEndDate,'/')+"</td>";  // 수행기간
						}
						}
						html += "	<td class='txt-center'>"+ this.title+"</td>";   // 프로젝트 수
						html += "	<td class='txt-center'>"+ this.ratio+"%</td>";   // 프로젝트 수
						html += "</tr>";
						
						preJobStartDate = this.jobStartDate;

						cnt = cnt - 1;	
						cntx = "";
						
						
					});
				} else {
					html = "<tr><td class='txt-center' colspan='11'>조회결과가 없습니다.</td></tr>";
				}
				
					$("#tableId2 > tbody").html(html);
					//tableScrollling("divHeader2", "divContent2", "tableId2");
				
				
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
	
	// 제품명 클릭시 상세보기 화면이동
	selectMainListView: function(id) {

		var url = "/research/view.do";
		var winName = "popWin";
		var w = 630;
		var h = 440;
		url += "?id="+id;
		popupWindow(url, winName, w, h);
		//p.focus(); 
		
	},
	
	// 프로젝트 클릭시 팝업호출 
	selectMainListView2: function(id , status) {
		
		var url_gubun = status;
		var url = "";
		var winName = "popPJ";
		var w = 760;  // 가로길이 
		var h = 360;  // 세로길이
		
		if(status == "Y"){ 
			url = "/research/product_project.do";
		}else{
			url = "/research/product_projectN.do";
		}
		
		url += "?id="+id;
		//url += "?id="+id+"&status="+status;
		popupWindow(url, winName, w, h);
	   	//p.focus();
	},
	
	
	selectMainListViewApproval: function(id ) {
		
		var url = "";
		var winName = "popPJ";
		var w = 760;  // 가로길이 
		var h = 360;  // 세로길이
		
		var approvalStatus = $("input:radio[name='researchWeekly']:checked").val();
		var startDate = $("input:radio[name='researchWeekly']:checked").attr('start');
		
		if(approvalStatus == "Y" || approvalStatus == "P"){  
			url = "/research/product_projectApproval.do";  // 상신 후
			url += "?id="+id+"&approvalStatus="+approvalStatus+"&startDate="+startDate;
			
		}else{	
			url = "/research/product_project.do";  // 상신 전
			url += "?id="+id;
		}
			
		popupWindow(url, winName, w, h);
	   	//p.focus();
	},
	
	// 연구이력종합 조회
	selectTotalInfo: function(status) {
		$.ajax({
			type : "POST",
			url : "/research/total.do",
			data : {  },
			dataType : 'json',
			success : function(result) {
				var html = "";
				if (result.success) {
					$(result.list).each(function(index) {
						var year = 0;
						var month = 0;
						
						if(this.jobTime >= 12) {
							year = parseInt(this.jobTime/12);
							month = parseFloat((this.jobTime%12).toFixed(1));
						} else {
							month = parseFloat(this.jobTime.toFixed(1));
						}
						
						
						html += "<tr>";
						html += "	<td class='txt-center'>"+this.research.productDivName1+"</td>";
						html += "	<td class='txt-center'>"+this.research.techDivName1+"</td>";
						html += "	<td class='txt-center'>"+( (year>0) ? (year+"년 "+month+"개월") : (month+"개월") )+"</td>";
						html += "	<td>"+linkName(this.research.productDivName2, this.research.productDivName3)+"</td>";
						html += "	<td>"+linkName(this.research.techDivName1, this.research.techDivName2, this.research.techDivName3)+"</td>";
						html += "	<td class='txt-center'>"+formatDate(this.jobStartDate.substring(0,6))+" ~ "+formatDate(this.jobEndDate.substring(0,6))+"</td>";
						html += "</tr>";
					});
				} else {
					html = "<tr><td class='txt-center' colspan='12'>조회결과가 없습니다.</td></tr>";
				}
				
				$("#research_total > tbody").html(html);
				
				// 셀병합
				$('#research_total').rowspan(0);
				$('#research_total').rowspan(1, true);
				
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			}
		});
	},

	// 상신 직무
	submitPrjEnddate: function() {
		var f = document.prjForm;
		f.method = "POST";
		f.action = "/research/registPrjEnddate.do";
		f.submit();
	},		
	
	// 이력등록
	saveHistory: function() {
		if(this.validate()) {
			$.ajax({
				type : "POST",
				url : "/research/history/save.do",
				data : { 
					"historyId": $("input[name=historyId]").val(),
					"jobStartDate": $("#jobStartDate").val(),
					"jobEndDate": $("#jobEndDate").val(),
					"jobTime": $("#jobTime").val(),
					"researchId": $("input[name=researchId]").val()
				},
				dataType : 'json',
				success : function(result) {
					research.renderHistory(result);
				},
				beforeSend : function() {
					research.clearHistory();
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		}
	},
	// 이력삭제
	deleteHistory: function() {
		//console.log($(document.saveForm).serialize());
		if (!$("input[name=chs]").is(":checked")) {
			alert("삭제할 대상을 선택해주세요.");
		} else {
			if(confirm("선택한 연구이력에 대해 삭제하시겠습니까?")) {
				$.ajax({
					type : "POST",
					url : "/research/history/delete.do",
					data : $(document.saveForm).serialize(),  // 폼객체를 JSON 타입으로 변환
					dataType : 'json',
					success : function(result) {
						research.renderHistory(result);
					},
					beforeSend : function() {
						research.clearHistory();
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					}
				});
			}
		}
	},
	
	renderHistory: function(result) {
		var html = "";
		if (result.success) {
			$(result.list).each(function(i) {
				html += "<tr onmouseover=\"this.style.cursor='pointer'\" onclick=\"javascript:research.selectHistory('"+this.id+"','"+this.jobStartDate+"','"+this.jobEndDate+"','"+this.jobTime+"','"+this.approvalStatus+"')\">";
				if(this.approvalStatus=="N") {
					html += "	<td><input type='checkbox' name='chs' class='checkbox' value='"+this.id+"' /></td>";
				} else {
					html += "	<td><input type='checkbox' name='chs' class='checkbox' value='"+this.id+"' disabled /></td>";
				}
				html += "	<td>"+formatDate(this.jobStartDate)+" ~ "+formatDate(this.jobEndDate)+"</td>";
				html += "	<td>"+this.jobTime+"</td>";
				if("Y" == this.approvalStatus) {
					html += "	<td>승인완료</td>";
				} else if("R" == this.approvalStatus) {
					html += "	<td>반려</td>";
				} else if("P" == this.approvalStatus) {
					html += "	<td>상신</td>";
				} else {
					html += "	<td>-</td>";
				}
				html += "</tr>";
			});
		}
		$("#research_history > tbody").html(html);
	},
	
	
	// 초기화
	clearHistory: function() {
		$("#jobStartDate").prop("disabled", false);
		$("#jobEndDate").prop("disabled", false);
		$("#jobTime").prop("disabled", false);

		$("input[name=historyId]").val("");
		$("#jobStartDate").val("");
		$("#jobEndDate").val("");
		$("#jobTime").val("0.0");
	},
	selectHistory: function(historyId,jobStartDate,jobEndDate,jobTime,approvalStatus) {
		$("input[name=historyId]").val(historyId);
		$("#jobStartDate").val(formatDate(jobStartDate,"-"));
		$("#jobEndDate").val(formatDate(jobEndDate,"-"));
		$("#jobTime").val(jobTime);
		
		//console.log("approvalStatus:"+approvalStatus);
		if(approvalStatus == "Y" || approvalStatus == "P") {
			$("#jobStartDate").prop("disabled", true);
			$("#jobEndDate").prop("disabled", true);
			$("#jobTime").prop("disabled", true);
		} else {
			$("#jobStartDate").prop("disabled", false);
			$("#jobEndDate").prop("disabled", false);
			$("#jobTime").prop("disabled", false);
		}
	},
	update: function() {
		if (this.validate()) {
			
			$('#workDiv1').removeAttr('disabled');
			$('#workDiv2').removeAttr('disabled');
			$('#productDiv1').removeAttr('disabled');
			$('#productDiv2').removeAttr('disabled');
			$('#productDiv3').removeAttr('disabled');
			$('#techDiv1').removeAttr('disabled');
			$('#techDiv2').removeAttr('disabled');
			$('#techDiv3').removeAttr('disabled');
			$('#taskDiv1').removeAttr('disabled');
			$('#taskDiv2').removeAttr('disabled');
			$('#taskDiv3').removeAttr('disabled');
			$( "#created" ).datepicker( "option", "disabled", false );	
			
			var f = document.researchForm;
			f.method = "POST";
			f.action = "/" + f.gubun.value + "/update.do";
			f.submit();
		}
	},
	regist: function(non_project_gb) {
		
		//console_logs("noneCode : " , noneCode);
		
		noneCode = $("#withoutCode").is(':checked');
		if(VAR_MY_RESH_TYPE == 'N'){
			noneCode = $("#jWithoutCode").is(':checked');
		}
		//console_logs("noneCode : " , noneCode);
		
		//라디오 체크유무 validation
		//연구원 추가 modal WBS ▶ PJT
		//console_logs("###########저장 validation Start ");
		//console_logs("noneCode : " , noneCode);
		////console_logs("noneCode2 : " , noneCode2);
		//console_logs(" 탭구분 : " + $("#tabGubun").val());
		//console_logs(" 첫번째 탭 wbs checkedLength : " , $("input[name=wbs_r_wbs]:checked").length);
		//console_logs(" 첫번째 탭 pjt checkedLength : " , $("input[name=wbs_r_pjt]:checked").length);
		
		//console_logs(" 탭구분 : " + $("#tabGubun").val());
		//console_logs(" hasWbsList : " , hasWbsList);
		//console_logs(" 두번째 탭 pjt checkedLength : " , $("input[name=pjt_r_pjt]:checked").length);
		//console_logs(" 두번째 탭 wbs checkedLength : " , $("input[name=pjt_r_wbs]:checked").length);
		
		//console_logs("###########저장 validation End ");
		//alert("pause");
		if($("#tabGubun").val() == "wbsToPjt" && $("input[name=wbs_r_wbs]:checked").length < 1  && noneCode===false && hasWbsList===true){
			alert("하나 이상의 WBS를 선택해주세요.");
			return ;
		}
		if($("#tabGubun").val() == "wbsToPjt" && $("input[name=wbs_r_pjt]:checked").length < 1  && noneCode===false){
			alert("하나 이상의 프로젝트를 선택해주세요.");
			return ;
		}
		//연구원 추가 modal PJT ▶ WBS
		if($("#tabGubun").val() == "pjtToWbs" && $("input[name=pjt_r_pjt]:checked").length < 1  && noneCode===false){
			alert("하나이상의 프로젝트를 선택해주세요.");
			return ;
		}
		
		if($("#tabGubun").val() == "pjtToWbs" && $("input[name=pjt_r_wbs]:checked").length < 1 && hasWbsList===true){
			alert("하나 이상의 WBS를 선택해주세요.");
			return ;
		}
		
		//비연구원 추가 modal Check validation
		if($("#tabGubun").val() == "jPjt" &&  $("input[name=pjt_r_pjt]:checked").length < 1 && noneCode==false){
			alert("하나 이상의 프로젝트를 선택해주세요.");
			return ;
		}
		
		if (this.validate()) {
			setSelectUserValue();
			var perprogress = new Progress();
			var f = document.researchForm;
			var user_id = $("input[name='gubun']:checked").val();
			$("#researchFormUserId").val(user_id);
			
			if(user_id==null || user_id.length ==0 ) {
				alert('등록 사용자를 확인할 수 없습니다.');
			} else {
				f.method = "POST";
				f.action = "/research/regist.do";
				//selectbox 년,월 가져오기
				var tYear = $("#tYear").val();
				var tMonth = $("#tMonth").val();
				$("#targetYear").val(tYear);
				$("#targetMonth").val(tMonth);
				var appMemo = $("#appMemo").val();
				$("#formAppMemo").val(appMemo);
				$.ajax({
					type : "POST",
					url : "/research/checkDuplicate.do",
					data : { 
						 "projectId"	: $("#projectId").val()
						,"userId" 		: $("#userId").val()
						,"targetYear" 	: $("#targetYear").val()
						,"targetMonth" 	: $("#targetMonth").val()
						
						,"taskDiv1" 	: $("#taskDiv1").val()
						,"taskDiv2" 	: $("#taskDiv2").val()
						,"taskDiv3" 	: $("#taskDiv3").val()
						
						,"productDiv1" 	: $("#productDiv1").val()
						,"productDiv2"	: $("#productDiv2").val()
						,"productDiv3" 	: $("#productDiv3").val()
						
						,"techDiv1"	  	: $("#techDiv1").val()
						,"techDiv2"  	: $("#techDiv2").val()
						,"techDiv3"	 	: $("#techDiv3").val()
						,"researchYN" 	: $("#researchYN").val()
						,"updateType" 	: $("#updateType").val()	
						,"historyId" 	: $("#historyId").val()
						,"appMemo"	 	: $("#appMemo").val()
					},
					dataType : 'json',
					success : function(result) {
						if (result.success) { 
							f.submit();
						} else {
							alert("입력하신 정보로 이미 등록 되어 있습니다.");
						}
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					},
					beforeSend : function() {
						perprogress.show();
					},
					complete : function() {
						perprogress.hide();				
					}
				});
			
			
			}
			
		  }	
	},
	stopResearch: function() {
		if(confirm("종료처리 하시겠습니까?")) {
			var id = $("input[name=researchId]").val();
			
			$.ajax({
				type : "POST",
				url : "/research/stop.do",
				data : { 
					"researchId": id
				},
				dataType : 'json',
				success : function(result) {
					if (result.success) {
						alert("해당 프로젝트가 정상적으로 종료처리 되었습니다.");
						//opener.location.reload();
						var tabBtn = opener.$('.TapArea').children('ul').children('li').children('a');
						tabBtn.eq(1).click();
						
						self.close();
					} else {
						alert(result.message);
					}
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		}
	},
	//수정 대상 조회
	updateResearch: function(userId) {
		var chsLength =  $("input[name=chs]:checked").length;
		if ( chsLength == 0 ){
			if($("#updateType").val() == "copy"){
				alert("복사추가할 대상을 선택해 주세요.");
			}else{
				alert("수정할 대상을 선택해 주세요.");
			}
			return ;
		}else if ( chsLength == 1){
			var research_id = $("input[name=chs]:checked").val();
			
			$.ajax({
				type : "POST",
				url : "/research/selectResearchNotApproval.do",
				data : { 
					"id": research_id,
					"userId" : userId
				},
				dataType : 'json',
				success : function(result) {
					if (result.success) { 
						research.research_object = result.list;
						//resesrch.initAllComponemt();
						research.updateForm();
						dialogOpen('pjt_regist_r');
					} else {
						alert("상신 및 승인완료된 이력이 존재하는 프로젝트에 대해서는 수정할 수 없습니다.\n다시 확인해 주세요.");
					}
				}
				,error : function(x, t, e){
					alert('관리자에게 문의하세요.');
				}
//				,complete : function() {
//					
//				}
			});
		}else{
			if($("#updateType").val() == "copy"){
				alert("복사추가할 대상을 하나만 선택해 주세요.");
			}else{
				alert("수정할 대상을 하나만 선택해 주세요.");
			}
			return ;
		} 
	},
	//프로젝트 추가 modal Table 초기화
	clearTable: function (){
		$("#appMemo").empty();
		$("#withoutCode").prop('checked', false);
		//$("#jWithoutCode").prop('checked', false);
		$("#wWbs > tbody").empty();
		$("#wPjt > tbody").empty();
		$("#pPjt > tbody").empty();
		$("#pWbs > tbody").empty();
		$("#jPjt > tbody").empty();
		$("#first_left_paging").empty();
		$("#first_right_paging").empty();
		$("#second_left_paging").empty();
		$("#second_right_paging").empty();
		$("#pjt_regist_j_paging").empty();
		
	},
	appMemoClear: function (){
		$('#appMemo').each(function(){     
			this.value = $(this).attr('title');   
			$(this).addClass('text-label');    
			$(this).focus(function(){        
				if(this.value == $(this).attr('title')) {     
					this.value = '';           
					$(this).removeClass('text-label');        
				}    
			});     
			$(this).blur(function(){       
				if(this.value == '') {            
					this.value = $(this).attr('title');            
					$(this).addClass('text-label');        
				}   
			});
		});
	},
	checkRWbsSearch: function(){
		clearTable();
		//appMemoClear();
		//체크 해제할경우 제품,기술 분류 다시 show
		//$("#techDiv1").empty();
		//$("#taskDiv1").empty();
		
		//common.selectBox(2, "taskDiv1");
		//common.selectBox(1, "techDiv1"); 
		common.init("taskDiv1");
		common.init("productDiv1");
		common.init("techDiv1"); 
		
	},
	
	//수정대상 view
	updateForm: function() {
		
		//research.checkRWbsSearch();
		
		
		if(	VAR_MY_RESH_TYPE == 'N') {
			//common.selectBox(3, "productDiv1");
			common.init("productDiv1");
			
			$('#productDiv1').removeAttr('disabled');
		}
		
		//console_logs('VAR_MY_RESH_TYPE', VAR_MY_RESH_TYPE+ ' in------changed--');
		
		// selectbox 동기로 바꿈
		var researchYN =  VAR_MY_RESH_TYPE;//$("#researchYN").val();	
		research.asyncYN = false;
		list = research.research_object;
		
		//console_logs('research', research);
		//console_logs('list', list);
		
		//alert("updateType : " + $("#updateType").val());
		
		//var selectedResearch = list[0];
		
		//console_logs('selectedResearch', selectedResearch);
		
		$(list).each(function(i) {
			
			//console_logs('list --> this', this);
			
			var temp_class = "class='tr-case1'";
			
			if (researchYN == "Y") {
				var html_pjt = "";
				var html_wbs = "";
				//공통프로젝트인 경우
				if (this.pmscode =="N00000" ){
					html_pjt +="<tr " + temp_class + " >";
					html_pjt = "<tr><td class='txt-center' colspan='3'>프로젝트를 선택하실 필요 없습니다.</td></tr>";
					$("#projectId").val(this.id);
					html_pjt += "</tr>";
					
					$("#withoutCode").prop('checked', true);
					html_wbs +="<tr " + temp_class + " >";
					html_wbs = "<tr><td class='txt-center' colspan='3'>WBS를 선택하실 필요 없습니다.</td></tr>";
					html_wbs += "</tr>";
					
					//연구원 코드없음일경우
					$("#wPjt > tbody").html(html_pjt);
					$("#pPjt > tbody").html(html_pjt);
					
					$("#wWbs > tbody").html(html_wbs);
					$("#pWbs > tbody").html(html_wbs);
					
				}else{
					//첫번째 tab 왼쪽 table
					var html_R_L = "";
					
					html_R_L +="<tr " + temp_class + ">";
					html_R_L += "<td class='txt-center' id='wbsCode'>"+this.wbs4Code+"</td>";		//WBS 코드
					html_R_L += "<td class='txt-center'>"+this.wbs4Name+"</td>";		//WBS Name
					html_R_L += "<td align='center'><input type='radio' name='wbs_r_wbs' checked onclick='pjtSearch.selectWbs_add_search( \""+this.wbs4Code+"\" )'></input></td>";
					//html_R_L += "<td class='txt-center' hidden id='gubun' value='wWbs'></td>";
					html_R_L += "</tr>";
					$("#wWbs > tbody").html(html_R_L);
					hasWbsList = true;
					if(this.wbs4Code == ""){
					
						hasWbsList = false;
						html_R = "<tr><td class='txt-center' colspan='3'>맵핑된 정보가 존재하지 않습니다.</br>※ WBS가 맵핑되어있지 않아도 프로젝트 등록이 가능합니다.</td></tr>";
								
						$("#wWbs > tbody").html(html_R);
					}
					//첫번쨰 tab 오른쪽 table
					var html_R = "";
					
					html_R +="<tr " + temp_class + " >";
					html_R += "<td class='txt-center'>"+this.pmscode+"</td>";		//3. 프로젝트코드
					html_R += "<td class='txt-center'>"+this.title+"</td>";						//4.프로젝트네임
					html_R += "<td align='center'><input type='radio' checked name='wbs_r_pjt'  onclick='pjtSearch.wbsSetPjtData(\""+this.projectId+"\"  )'></input></td>";
					html_R += "</tr>";
					
					$("#wPjt > tbody").html(html_R);
					
				}
			} else if (researchYN == "N" || researchYN=="") {
				var html = "";
				var html_pjt = "";
				//공통프로젝트인경우 
				if (this.pmscode =="N00000" ){
					html_pjt +="<tr " + temp_class + " >";
					html_pjt = "<tr><td class='txt-center' colspan='3'>프로젝트를 선택하실 필요 없습니다.</td></tr>";
					$("#projectId").val(this.id);
					html_pjt += "</tr>";
					$('#productDiv1').html('');
					$('#productDiv1').removeAttr('disabled');
					common.init("productDiv1");
					$("#jWithoutCode").prop('checked', true);
					
				}else{
					$("#jWithoutCode").prop('checked', false);
					html +="<tr " + temp_class + ">";
					html += "<td class='txt-center'>"+this.pmscode+"</td>";	//3. 프로젝트코드
					html += "<td class='txt-center'>"+this.title+"</td>";//4.프로젝트네임
					html += "<td align='center'><input type='radio'  name='pjt_r_pjt' checked onclick='pjtSearch.wbsSetPjtData(\""+this.projectId+"\")'></input></td>";
					html += "</tr>";
					
					/*$('#productDiv1').removeAttr('disabled');
					$('#productDiv2').removeAttr('disabled');
					$('#productDiv3').removeAttr('disabled');
					researchChange("#productDiv1",this.productDivName1) ;
					researchChange("#productDiv2",this.productDivName2) ;
					researchChange("#productDiv3",this.productDivName3) ;*/
				}
				//비연구원 코드없음일경우
				$("#jPjt > tbody").html(html_pjt);
				
				$("#jPjt > tbody").html(html);
			} 
			//수정 대상 WBS 및 프로젝트의 ID
			$("#projectId").val(this.projectId);
			
			//update시 기준이 되는 History의 ID
			$("#historyId").val(this.id); 
			
			//코드없음 상태인 프로젝트를 수정,복사추가할때 Task1레벨에 PMPL공통,선행기획만 나오게하기위해
			var isCheck = $("#withoutCode").is(":checked")
			if(isCheck){
				$('#taskDiv1').removeAttr('disabled');
				common.init("taskDiv1");
				$("#taskDiv1").val(15);
				//   1.1 추가대상 Option의 Value와 Title을 임시 저장해놓는다.
				var val = $("#taskDiv1").val();
				var text = $("#taskDiv1 option:selected").text();
				$("#taskDiv1").val(685);
				var val1 = $("#taskDiv1").val();
				var text1 = $("#taskDiv1 option:selected").text();
				//   1.2 SelectBox를 초기화한다.
				$("#taskDiv1").empty();
				//2. 초기화된 SelectBox에 Option을 추가한다.
				$("#taskDiv1").append("<option value=''>선택</option>");
				$("#taskDiv1").append("<option value='"+val+"'>"+text+"</option>");
				$("#taskDiv1").append("<option value='"+val1+"'>"+text1+"</option>");
			
			}
			//연구원 복사추가 버튼 클릭시 코드없음 초기화
			if(isCheck && this.pmscode != "N00000"){
				//alert("코드없음찍혀있고,일반프로젝트인경우");
				research.checkRWbsSearch();
			}
			//console_logs('this.techDivName1', this.techDivName1);
			
			//console_logs('html', $('#techDiv1').html() );
		

			//console_logs('this.techDivName1', this.techDivName1);
			//console_logs('this.techDivName2', this.techDivName2);
			//console_logs('this.techDivName3', this.techDivName3);
			
			/*var o = $('#techDiv1');
			console_logs('o', o);*/
//			o.val(5);
//			o.change();
			//console_logs('setform is', 'techDiv1 5 and change');
			//researchChange("#techDiv1",this.techDivName1) ;
			
			//var o1 = $('#techDiv2');
			//console_logs('o1', o1);
			
			/*researchChange("#techDiv1",this.techDivName1) ;
			researchChange("#techDiv2",this.techDivName2) ;
			researchChange("#techDiv3",this.techDivName3) ;*/

			/*researchChange("#taskDiv1",this.taskDivName1) ;
			researchChange("#taskDiv2",this.taskDivName2) ;
			researchChange("#taskDiv3",this.taskDivName3) ;*/

//			var parent_p1 = 3;
//			var parent_p2 = ?;
//			var parent_p3 = ?;
//			
//			var o = findHistory(this.id);
			//console_logs('this.techDivName1', this.techDivName1);
			//console_logs('this.techDivName2', this.techDivName2);
			//console_logs('this.techDivName3', this.techDivName3);
			
			
			//수정할 프로젝트가 공통(코드없음)인 경우
			if(this.taskDivName1 == 15 && this.pmscode =='N00000'|| this.taskDivName1 == 685 && this.pmscode =='N00000'){
				//common.selectBox(2,"taskDiv1", CALL_FC, this.taskDivName1);
				common.selectBox(2,"taskDiv1", CALL_FC_HIDDEN_ME, this.taskDivName1);
			}else{
				common.selectBox(2, 	"taskDiv1", CALL_FC, this.taskDivName1);
			}
			//1레벨밖에없는 task들
			//선행기획(685),신차품질관리(689), 시작(18), 시험차구축(19)

			if(this.taskDivName1 != 685 && this.taskDivName1 !=689 && this.taskDivName1 !=18 && this.taskDivName1 !=19){
				
				common.selectBox(this.taskDivName1, 	"taskDiv2", CALL_FC, this.taskDivName2);
				common.selectBox(this.taskDivName2, 	"taskDiv3", CALL_FC, this.taskDivName3);
			}
			
			//PM/PL/공통 인 경우
			if(this.taskDivName1 == 15){
				common.selectBox(1,                     "techDiv1", CALL_FC_PMPL, this.techDivName1);
			}else{
				common.selectBox(1,                     "techDiv1", CALL_FC, this.techDivName1);
				common.selectBox(this.techDivName1, 	"techDiv2", CALL_FC, this.techDivName2);
				common.selectBox(this.techDivName2, 	"techDiv3", CALL_FC, this.techDivName3);
			}
			
			//console_logs('call select box--------------------------------------------------------------', this);
			/*console_logs('>>>>> productDiv1', this.productDivName1);
			console_logs('>>>>> productDiv2', this.productDivName2)
			console_logs('>>>>> productDiv3', this.productDivName3)*/
			if(this.pmscode == "N00000" && researchYN == "N"){
				
			}else{
				
				common.selectBoxHasnull(3,                    "productDiv1", CALL_FC, this.productDivName1);
				common.selectBox(this.productDivName1, "productDiv2", CALL_FC, this.productDivName2);
				common.selectBox(this.productDivName2, "productDiv3", CALL_FC, this.productDivName3);
			}
			//console_logs('all done------------------------------------------------------------------------');
			
			//researchChange("#productDiv2",this.productDivName2) ;
			//researchChange("#productDiv3",this.productDivName3) ;
			
			$("#appMemo").val(this.appMemo);
			
			//console_logs('setform is', true);
			//alert('pause');
			
		});
		// selectbox 비동기로 바꿈
		research.asyncYN = true;
		
		
		//TASK1레벨을 PM/PL공통(코드없음)프로젝트를 불러오는경우
		$("#taskDiv1").on('change',function () {
		
		//console_logs('VAR_MY_RESH_TYPE', VAR_MY_RESH_TYPE);

		var optionSelected = $(this);
	    var valueSelected  = optionSelected.val();
	    
	    //console_logs('optionSelected', optionSelected);
	    //console_logs('valueSelected', valueSelected);
		
			if( valueSelected + ''  == ''+ 15){
				$("#techDiv2").empty();
				$("#techDiv3").empty();
				    	
			}else {
				if(VAR_IS_CHANGED_TASK == true) {
					common.selectBox(1, "techDiv1");
				}
				VAR_IS_CHANGED_TASK = false;
			    
		    }
		});
		
		//alert('pause1');
	},
	
	
	// 프로젝트 가져오기
	selectProjectList: function(id) {
	
		var progress = new Progress();
		$.ajax({
			type : "POST",
			url : "/research/product_projectAjax.do",
			data : { "id": id },
			dataType : 'json',
			success : function(result) {
				var html = "";
				//var pmscodeArry = new Array();

				if (result.success) {
					$(result.list).each(function(index) {
						 //pmscodeArry[index] = this.pmscode; 
						 html += "<div id='" + "pms" + this.pmscode +"' style='line-height:25px'><input type=checkbox name=pmscode checked=checked  value='"+this.pmscode+"@#@"+this.title+"@#@"+this.id+"'>" + this.title + "</input><a href=javascript:deleteProject('"+ this.pmscode +"')><img src='/resources/images/btn11.png' align='right' /></a>+++</div>";
						 //alert(pmscodeArry[index]);

						html = "<tr id='pms"+ this.pmscode + "' style='height:22px'>"+
				               "  <td style=' width:10px'>&nbsp;<input type=checkbox checked=checked name=pmscode checked value='"+this.pmscode+"@#@"+this.title+"@#@"+this.id+"' style='display:none'></input></td>"+
				               "  <td style=' width:320px'>" + this.title + "</td>"+
				               "  <td style=' width:90px'>" + this.state + "</td>"+
				               "  <td style=' width:100px' class='txt-center'>" + formatDate(this.taskActualStartDate) + "</td>"+
				               "  <td style=' width:100px' class='txt-center'>" + formatDate(this.taskActualFinishDate) + "</td>"+
				               "  <td style=' width:120px' class='txt-center'><input type='text' class='inputwidth datepicker' id='end_date"+ this.pmscode +"' name='end_date' style='width:80px' value='"+this.end_date+"' onchange='onChgEnddate(this)'/></td>"+
				               "  <td style=' width:60px'  class='txt-center'><a href=javascript:deleteProject('"+ this.pmscode +"')><img src='/resources/images/btn11.png' /></a></td></tr>";
			//alert($("#input_table2").find("tr:eq(3)").find("#pmscode").html());	
						
						preJobStartDate = this.jobStartDate;
						$("#input_table2").find("tr:eq(3)").find("#pmscode2").append(html);
					});
				}
								
				//$("#pmscode").html(html);
				
				
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			},
			beforeSend : function() {
				progress.show();
			},
			complete : function() {
				progress.hide();
				$('.datepicker').each(function(){
				    $(this).datepicker();
				});
			}
		});
	},
	
	deleteResearch: function() {
		
		if (!$("input[name=chs]").is(":checked")) {
			alert("삭제할 대상을 선택해주세요.");
		}	else {
			var flag = true;
			$("input[name=chs]:checked").each(function() {
				
				if($(this).attr("approvalS") == 'Y') {
				flag = false;
				}
			});
			if (!flag) {
				alert("상신및 승인완료된 이력이 존재하는 프로젝트는\n삭제할 수 없습니다. 다시 확인해 주세요.");
			} else {
				if(confirm("삭제하시겠습니까?")) {
					var f = document.listForm;
					f.method = "POST";
					f.action = "/research/delete.do";
					f.submit();
				}
			}
		}
	},
	duplicate: function() {
		if (this.validate()) {
			// 공통인 경우 Key-In 프로젝트 구성하므로, skip!
			
			if($("#workDiv1").val() != null && $("#workDiv1").val() == "33") {
				
				if ( $("#updateYn").val() == "Y"){
					research.update();  // 수정
				}else{
					research.regist();  // 등록
				}
				
			} else {
				if ( $("#updateYn").val() == "Y"){ 
				}else{  					
					$("#id").val('');          // 신규등록일때 id 와 research_id null 셋팅
					$("#research_id").val('');
				}
				
				$.ajax({
					type : "POST",
					url : "/research/duplicate.do",
					data : { 
						"id": $("#id").val(),
						"workDiv1": $("#workDiv1").val(),
						"workDiv2": $("#workDiv2").val(),
						"productDiv1": $("#productDiv1").val(),
						"productDiv2": $("#productDiv2").val(),
						"productDiv3": $("#productDiv3").val(),
						"techDiv1": $("#techDiv1").val(),
						"techDiv2": $("#techDiv2").val(),
						"techDiv3": $("#techDiv3").val(),
						"taskDiv1": $("#taskDiv1").val(),
						"taskDiv2": $("#taskDiv2").val(),
						"taskDiv3": $("#taskDiv3").val(),
						"nonProjectGb": $("input:radio[name='nonProjectGb']:checked").val(),
						"research_id":$("#research_id").val()
					},
					dataType : 'json',
					success : function(result) {
						//console.log("duplicate ? "+result.success);
						
						if (result.success) {
							alert("입력하신 프로젝트가 이미 존재합니다.\n동일한 프로젝트에 대해서는 생성할 수 없습니다.\n다시 확인해 주세요.");
						} else { 
							if ( $("#updateYn").val() == "Y"){ // 수정
								research.update();
							}else{
								research.regist(); 			// 등록 
							}
						}
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					}
				});
			}
		}
	},	
	validate: function() {  
		return true;       
	}

};

function researchChange(nm,val){ 
	$(nm).val(val);
	$(nm).change();
}


var totalCount = 0;
var pageSize   = 10;

/* 미입력자 */
var unregistered = {
		last : false,
		// 미입력자 조회
		selectList: function(workingYear,workingMonth,orgTeamId) {
			//if(page == null || page == 'undefined') page = 1;
			var s = location.search;
			console_logs("url", s);
			var progress = new Progress();
			$.ajax({
				type : "POST",
				url : "/research/unregistered.do",
				data : { 
					
					"orgTeamId": orgTeamId
				   ,"workingYear": workingYear
				   ,"workingMonth": workingMonth
					
				},
				dataType : 'json',
				success : function(result) {
					var html = "";
					var preJobStartDate = "";
					var temp_class = "class='tr-case1'";
					
					if (result.success) {
						//$("#page").val(result.page);
						//unregistered.last = result.last;
						
						$(result.list).each(function(index) {

							if ( preJobStartDate != this.jobStartDate ){ 
								if (  temp_class == "class='tr-case1'"){
									temp_class = "";
								}else{
									temp_class = "class='tr-case1'";
								}
							}
							html +="<tr " +  temp_class + ">";					
							html += "	<td class='txt-center'>"+this.localname+"</td>";
							if( s == "?menu_id=92"){
							html += "	<td class='txt-center'>"+this.userId+"</td>";
							}
							html += "	<td class='txt-center'>"+this.positionname+"</td>";
							
							
							html += "</tr>";
							
							preJobStartDate = this.jobStartDate;
							
						});
						$("#total").html(result.total);
						totalCount = result.total;
						
					} else {
						html = "<tr><td colspan='12' class='txt-center' >조회결과가 없습니다.</td></tr>";
					}
					
						 $("#unRegisteredBody > tbody").html(html);
					
					tableScrollling("unRegisteredHeader", "unRegisteredContent", "unRegisteredBody");
					
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				},
				beforeSend : function() {
					progress.show();
				},
				complete : function() {
					progress.hide();
					
					// paging
					/*
					$('#paging_J').paging({
						current: $("#page_J").val() ,
						max: Math.ceil(totalCount/pageSize),
						first: "&lt;&lt;",
						prev: "&lt;",
						next: "&gt;",
						last: "&gt;&gt;",
						onclick:function(e,page){
							$("#page_J").val(page);
							///complete.selectResearchList();
						}
					});
					*/					
				} 
			});
		},
		selectListDisable: function() {
			var html = "";
			$("#unRegisteredBody > tbody").html(html);
		}
};

/* 공통 */
var common = {
		selectBox: function(code, target, callback, val) {
			/*console_logs('>>>> selectBox parent', code);
			console_logs('>>>> selectBox target', target);
			console_logs('>>>> selectBox callback', callback);
			console_logs('>>>> selectBox val', val);*/
			$.ajax({
				type : "POST",
				url : "/cmmcode/json/list.do",       // 서버에 요청
				data : { "code": code },
				dataType : 'json',
				async: research.asyncYN,             // 비동기 동기 구분
				success : function(result) {
					//console_logs('result', result);
					var html = "";
					if (result.success) {
						
						//console_logs('result', result);
						
						if(result.data.length>0) {
							html += "<option value=''>선택</option>";
						}
						
						$(result.data).each(function(i) {
							html += "<option value='"+this.code+"'>"+this.codeName+"</option>";
						});
					}
					
					$("#"+target).html(html);
					$("#"+target).attr('Hasnull', false);
					
					if(callback != null && callback != 'undefined') {
						//console_logs('reverse call back');

						if(val==null || val==undefined) {
							callback.call();
						} else {
							callback.call(target, val);							
						}

					}
					
				},
				beforeSend : function() {
					common.clear(target);
				},
				complete : function() {
					hideSelectBox();
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		},
		init: function(id) {
			$("#"+id).val("").trigger("change");
			hideSelectBox();
		},
		clear: function(id) {
			$("#"+id).html("");
			hideSelectBox();
		},
		selectBoxHasnull: function(code, target, callback, val) {

			$.ajax({
				type : "POST",
				url : "/cmmcode/json/list.do",       // 서버에 요청
				data : { "code": code },
				dataType : 'json',
				async: research.asyncYN,             // 비동기 동기 구분
				success : function(result) {
					//console_logs('result', result);
					var html = "";
					if (result.success) {
						
						//console_logs('result', result);
						if(result.data.length>0) {
							html += "<option value=''>선택</option>";
							html += "<option value='-1'>(해당 없음)</option>";
						}
						
						$(result.data).each(function(i) {
							html += "<option value='"+this.code+"'>"+this.codeName+"</option>";
						});
					}
					
					$("#"+target).html(html);
					$("#"+target).attr('Hasnull', true);
					
					if(callback != null && callback != 'undefined') {
						//console_logs('reverse call back');

						if(val==null || val==undefined) {
							callback.call();
						} else {
							callback.call(target, val);							
						}

					}
					
				},
				beforeSend : function() {
					common.clear(target);
				},
				complete : function() {
					hideSelectBox();
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		},
		init: function(id) {
			$("#"+id).val("").trigger("change");
			hideSelectBox();
		},
		clear: function(id) {
			$("#"+id).html("");
			hideSelectBox();
		}/*,,
		defaultSelectBox: function(code, target, callback, defValue) {
			
			$.ajax({
				type : "POST",
				url : "/cmmcode/json/list.do",       // 서버에 요청
				data : { "code": code },
				dataType : 'json',
				async: research.asyncYN,             // 비동기 동기 구분
				success : function(result) {
					//console_logs('result', result);
					var html = "";
					if (result.success) {
						
						console_logs('result', result);
						
						if(result.data.length>0) {
							html += "<option value=''>선택</option>";
						}
						
						$(result.data).each(function(i) {
							html += "<option value='"+this.code+"'>"+this.codeName+"</option>";
						});
					}
					
					$("#"+target).html(html);
					
					if(html != "" && callback != null && callback != 'undefined') {
						callback.call();
					}
					
				},
				beforeSend : function() {
					common.clear(target);
				},
				complete : function() {
					hideSelectBox();
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		},
		init: function(id) {
			$("#"+id).val("").trigger("change");
			hideSelectBox();
		},
		clear: function(id) {
			$("#"+id).html("");
			hideSelectBox();
		},
		loadSelectBox: function(code, target, callback, inStaticList) {
			
			$.ajax({
				type : "POST",
				url : "/cmmcode/json/list.do",       // 서버에 요청
				data : { "code": code },
				dataType : 'json',
				async: research.asyncYN,             // 비동기 동기 구분
				success : function(result) {
					
					inStaticList[result];
					//console_logs('result', result);
				}
			});
		},
		init: function(id) {
			$("#"+id).val("").trigger("change");
			hideSelectBox();
		},
		clear: function(id) {
			$("#"+id).html("");
			hideSelectBox();
		},
		
		staticSelectBox: function(code, target, callback, result) {
			common.clear(target);
			
				var html = "";

				console_logs('result', result);
				
				if(result.data.length>0) {
					html += "<option value=''>선택</option>";
				}
				
				$(result.data).each(function(i) {
					html += "<option value='"+this.code+"'>"+this.codeName+"</option>";
				});

				
				$("#"+target).html(html);
				
				if(html != "" && callback != null && callback != 'undefined') {
					callback.call();
				}
				
				hideSelectBox();

		},
		
		init: function(id) {
			$("#"+id).val("").trigger("change");
			hideSelectBox();
		},
		clear: function(id) {
			$("#"+id).html("");
			hideSelectBox();
		}
*/

};



/* 프로젝트 */
var project = {
		selectBox: function(target, callback) {
			$.ajax({
				type : "POST",
				url : "/research/project/list.do",
				data : { "workDiv2": $("#workDiv2").val()  },
				dataType : 'json',
				async: false,
				success : function(result) {
					var html = "";
					if (result.success) {
						
						//html += "<option value=''> 프로젝트 선택 </option>";
						$(result.list).each(function(i) {
							html += "<input type=checkbox name=pmscode value='"+this.pmscode+"@#@"+this.title+"'>"+this.title+"</input></br>";
						  //html += "<option value='"+this.pmscode+"'>"+this.title+"</option>";
						});
					}
					
					//$("#"+target).html(html);  // 프로젝트 등록 select id pmscode

					if(html != "" && callback != null && callback != 'undefined') {
						callback.call();
					}
					
				},
				beforeSend : function() {

					//$("#"+target).html("");
					
				},
				complete : function() {
					
					hideSelectBox();
					
					
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		}
};


function hideSelectBox() {
	$("select").each(function(i) {
		//console.log(">>> "+$(this).attr("id")+":"+$(this).children("option").length);
		if($(this).children("option").size() == 0) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
} 
