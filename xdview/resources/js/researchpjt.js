
/**************************************************************************************
 *  
 * PackageName : resources/js
 * FileName    : researchpjt.js
 * 
 * @Title		: 프로젝트 경력관리
 * @Description : 프로젝트 경력관리 js
 * @Version     : 
 * @Author      : YounghoLee
 * @Date        : 2015.11.19
**************************************************************************************/				

//wbs목록이 존재하는지 구분
var hasWbsList = false;
//코드없음인지 아닌지 구분
//var noneCode = false;
var postUserId = $("#post_userId").val();


var G_HISTORY_HISTORY = [];

function findHistory(id) {
	if(G_HISTORY_HISTORY==null && G_HISTORY_HISTORY.length==0) {
		return null;
	}
	for(var i=0; i<G_HISTORY_HISTORY.length; i++) {
		var history = G_HISTORY_HISTORY[i];
		if(history.id ==id) {
			return history;
		}
	}
	
	return null;
}

//결재상태,팀장여부에따라 버튼 controll
function refreshButtons() { // true, false
	/*
	P                  상신           없음
    R                  반려           있음
    Y                  완료           없음
    N                결재취소       있음
	*/
	//initButton(APPROVAL_STATUS);
	var thisYear = $("#tYear").val();
	var thisMonth = $("#tMonth").val();
	
	if(VAR_IS_FORCED =="" || VAR_IS_FORCED ==null){
		//작업월이 아니면 작업할수 없게 hide
		if(WORKING_YEARMONTH != (thisYear + thisMonth) && WORKING_YEARMONTH != ""){
			$(".bt").hide();
		}else{
			
			switch(APPROVAL_STATUS) {
			case 'P':
			case 'Y':
				$(".bt").hide();
				break;
			case 'R':
			case 'N':
				$(".bt").show();
				break;
			default:
				$(".bt").show();
			}//endof switch
			
			if(VAR_IS_MANAGER == true) {
				$('#pjt_send').hide();
				$("#pjt_saveself").removeAttr("disabled");
			} else {
				$('#pjt_send').show();
				$("#pjt_saveself").attr("disabled","true");	
				$("#pjt_saveself").attr("style", "background-color:rgb(133,133,133)");
			}
			if(WORKING_YEARMONTH == "" || WORKING_YEARMONTH == null){
				$(".bt").hide();
				//alert("현재 마감중이므로 입력이 불가능합니다.");
			}else{
				if(APPROVAL_STATUS != 'P' && APPROVAL_STATUS != 'Y'){
					$(".bt").show();
				}
			}
		}
	}else if(VAR_IS_FORCED !=""){
		VAR_IS_MANAGER =true;
		$('#pjt_send').hide();
		$("#pjt_saveself").removeAttr("disabled");
		switch(APPROVAL_STATUS) {
			case 'P':
			case 'Y':
				$(".bt").hide();
				break;
			case 'R':
			case 'N':
				$(".bt").show();
				break;
			default:
				$(".bt").show();
		}
		if(comboYearMonth == "" || comboYearMonth != (thisYear + thisMonth)){
			$(".bt").hide();
			
			//alert("현재 마감중이므로 입력이 불가능합니다.");
		}
	}
}

function refreshDialog() {
	
	//추가 구분
	
	// 코드없음 인 경우
		  // 업부 콤보 + 텍스트
		  // 제품 1콤보 개
		  // 기술 1콤보 개
	// 코드 없음 아닌 경우
		//콤보박스 9개
		// 업무 3개
		// 제품 3개
		// 기술 3개	
	
	// ---> 선택....
	
	//수정
	//토드없음/아니냐.
	//콤보박스만 바꾼다.

	
	
	
}

var pjtSearch = {
		//인적사항
		searchUserList: function() {
			
			
			//var year = $("#tYear").val();
			//var month = $("#tMonth").val();
			var year = workingYear;
			var month = workingMonth;
			var perprogress = new Progress();
			$.ajax({
				type : "POST",
				url : "/research/searchUserList.do",
				data : {
					"targetDate":  year+"-"+month
				},
				dataType : 'json',
				success : function(result) {
					var html_R = $("#inD1 > tbody").html();
					var temp_class = "class='tr-case1'";
					var map = new Map();
					if (result.success) {
						var preJobStartDate = "";
						$(result.list).each(function(index) {	
							
							//console_logs('this', this);
							///////////////
							// 연구원 wbs 선택시 pjt테이블
							///////////////	
							var isChecked = "";
							if(this.userId == postUserId){
								isChecked = "checked"
							}
							//parkkyungwon
							//printGlobal();
							var postteamid = this.postteamid;
							if(VAR_TARGET_USER_ID != VAR_MY_USER_ID && VAR_TARGET_USER_ID == this.userId) {
								VAR_IS_SUB_ACTION =  'YOU';
								//VAR_TARGET_USER_ID = '' + this.userId;
								VAR_IS_MANAGER = (this.zzijkch == 'B03') ? true : false;
								
								
								//printGlobal();
								
								refreshButtons();				
							}
							var line = "<td  class='txt-center'><input  type='radio' zzijkch='" + this.zzijkch + "' name='gubun' insteadYN = 'Y' value='"+this.userId+"' "+isChecked+" onclick='javascript:pjtSearch.changeUser( \""+this.userId+ "\", \""  + this.zzijkch +  "\"); pjtSearch.pjt_search();'></input></td>";
							//console_logs('line=', line);
							
							html_R +="<tr " + temp_class + " >";
							html_R += line;
							html_R += "<td class='txt-center'>대행</td>";																							//구분
							html_R += "<td >"+linkName(this.orgDesc) + "</td>";																				//소속
							html_R += "<td class='txt-center'>"+linkName(this.userId) + "</td>";                                            //사번
							html_R += "<td class='txt-center'>"+linkName(this.localname) + "</td>";														//성명
							html_R += "<td class='txt-left'>"+linkName(this.positionname) + "</td>";													//직위																					
							html_R += "<td class='txt-left'>"+linkName(this.ttoutDuty) + "</td>";															//직책
							html_R += "<td class='txt-center'>-</td>";									//교육이력
							html_R += "<input type='hidden'  id='tableInsteadYN' insteadYN='Y' />";
							html_R += "<input type='hidden'  id='tablePostteamid' value='" + this.postteamid +"' />";   // 대행자 팀아이디
							//html_R += "<input type='hidden' name='zzijkch' value='" + this.zzijkch + "' />";
							html_R += "</tr>";
						});		
					}  
					/*상세화면에 붙이기 */
					$("#inD1 > tbody").html(html_R);
					
					//$("#postteamid").html(postteamid);
					//$("#userId").val(postUserId);
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				},
				beforeSend : function() {
					perprogress.show();
				},
				complete : function() {
					perprogress.hide();
					//사용자정보 초기화
					initUserInfo();
					//검색
					pjtSearch.pjt_search(); 
					tableScrollling("divHeader4", "divContent4", "inD1");
					//팀장일경우 상신버튼 제거 및 자가승인 활성화
					$('input[type=radio][name=gubun]').on('change', function() {
					     if($(this).attr("zzijkch") == 'B03') {
							$('#pjt_send').hide();
							$("#pjt_saveself").removeAttr("disabled");
						}else {
							$('#pjt_send').show();
							$("#pjt_saveself").attr("disabled","true");	
							$("#pjt_saveself").attr("style", "background-color:rgb(133,133,133)");
						}
					});
				}
			});		
		},
		
		//인적 사항변경
		changeUser:function (id, zzijkch){
			//printGlobal();
			VAR_IS_SUB_ACTION = ( ''+ id == VAR_MY_USER_ID ) ? 'ME' : 'YOU';
			VAR_TARGET_USER_ID = '' + id;
			VAR_IS_MANAGER = zzijkch == 'B03' ? true : false;
			refreshButtons();
			//printGlobal();						
			
			$("#userId").val(id);
			
			
		},
		
//		//인적 사항변경(월마감 대행자처리용)
//		changeUserMonthEnding:function (id,zzijkch){
//			alert("VAR_SELECTED_RECH_TYPE : " + VAR_SELECTED_RECH_TYPE);
//			//printGlobal();
//			VAR_IS_SUB_ACTION = ( ''+ id == VAR_MY_USER_ID ) ? 'ME' : 'YOU';
//			VAR_TARGET_USER_ID = '' + id;
//			VAR_IS_MANAGER = zzijkch == 'B03' ? true : false;
//			alert("id : " + id);
//			$.ajax({
//				type: "POST",
//				url : "/monthending/checkUserType.do",
//				data: { 
//					"userId": id
//				},
//				dataType : 'json',
//				success:function(result){
//
//					VAR_SELECTED_RECH_TYPE = result['researchYN'];
//					redreawResearch(VAR_SELECTED_RECH_TYPE, null, null);
//					
//					refreshButtons();
//					$("#userId").val(id);
//				}
//			});
//			
//		},
		
		onClickEvent: function(userId, zzijkch,MONTH_ENDING_YN) {
			
			//printGlobal();
			VAR_IS_SUB_ACTION = ( ''+ userId == VAR_MY_USER_ID ) ? 'ME' : 'YOU';
			VAR_TARGET_USER_ID = '' + userId;
			VAR_IS_MANAGER = zzijkch == 'B03' ? true : false;
			refreshButtons();
			$.ajax({
				type: "POST",
				url : "/monthending/checkUserType.do",
				data: { 
					"userId": userId
				},
				dataType : 'json',
				success:function(result){

					VAR_SELECTED_RECH_TYPE = result['researchYN'];
					var userId = result['userId'];
					
					refreshButtons();
					$("#userId").val(userId);
					if(VAR_MONTH_ENDING_YN == "Y"){
						/*VAR_IS_MANAGER =  true;
						refreshButtons();*/
						$("#userId").val(userId);
						redreawResearch(VAR_SELECTED_RECH_TYPE, null, null);
						redreawResearchModal(VAR_SELECTED_RECH_TYPE, null, null);
						callEventMapper();
					}
					pjtSearch.changeUser( userId, zzijkch); 
					pjtSearch.pjt_search(); 
				}
			});


		},
		
		//wbs선택후 pjt 선택 -> data넘기기
	/*	wbsSetPjtData:function (id){
			alert(id);
			$("#projectId").val(id);
		},*/
		
		// 연구원/비연구원 프로젝트 경력관리 - 프로젝트 투입비중 table
		pjt_search : function() {
			var progress = new Progress();
			var selectMonth = $("#tMonth").val();
			var researchYN =  $("#researchYN").val();
			userId =  $("#userId").val();
			$.ajax({
				type: "POST",
				url : "/research/mainReseachHistory.do",
				data: { 
					"userId": userId,
					"status": status , 
					"jobStartDate": $("#tYear").val() ,
					"jobEndDate": $("#tMonth").val()
				},
				dataType : 'json',
				success:function(result){
					var html = "";
					var html_R = "";
					var preJobStartDate = "";
					var approvalStatus = "";

					var period = "";
					var temp_class = "class='tr-case1'";
					var researchSumRation = 0;
					
					var map = new Map();
					
					//console_logs('>>>>>>>>>>>>>>>>', result);
					//printGlobal();
					var tmpStatus = result['approvalStatus'];
					//console_logs('tmpStatus', tmpStatus);
					APPROVAL_STATUS = tmpStatus;//(tmpStatus==null || tmpStatus ='') ? 'N' : 'Y';
					//printGlobal();
					//결재상태에따라 alert
					/*if(APPROVAL_STATUS == "R" && VAR_MY_USER_ID == userId){
						alert("투입비율 상신한 내역이 반려되었습니다. 재상신 바랍니다.");
					}else if(APPROVAL_STATUS == "N" && VAR_MY_USER_ID == userId){
						alert("투입비율 상신한 내역이 결재취소 되었습니다. 재상신 바랍니다.");
					}*/
					
					if(APPROVAL_STATUS == "R"){
						alert("투입비율 상신한 내역이 반려되었습니다. 재상신 바랍니다.");
					}else if(APPROVAL_STATUS == "N" ){
						alert("투입비율 상신한 내역이 결재취소 되었습니다. 재상신 바랍니다.");
					}
					
					//버튼상태 제어
					refreshButtons();
					
					if (result.success) {
						G_HISTORY_HISTORY = null;
						G_HISTORY_HISTORY = [];
						$(result.list).each(function(index) {	
							
							G_HISTORY_HISTORY.push(this);
							
							/////////////////
							//  연구원
							////////////////
							//프로젝트 코드가 'N00000'인경우 구분=공통, 그외 = 일반 프로젝트
							var gubun = "프로젝트";
							var projectCode = linkName(this.pmscode);
							if(projectCode == 'N00000'){
								gubun='공통';
							}
							//프로젝트코드 첫번째자리가 1~2 : 선행 3~6 : 양산 7:기타   ※ 차종이있으면서 첫째자리가 E이면 양산,차종없으면서 E이면 선행. 첫번째자리가 S이면 양산
							var firstPjtCode = projectCode.substr(0,1);
							var sunYang="";
							if(firstPjtCode < 3){
								sunYang = '선행';
							}else if(firstPjtCode <7 || firstPjtCode =='S'){
								sunYang = '양산';
							}else if(firstPjtCode =='E' && this.modelName !=""){
								sunYang = '양산';
							}else if(firstPjtCode =='E' && this.modelName ==""){
								sunYang = '선행';		
							}else{
								sunYang = '기타';
							}
							if (researchYN == 'Y'){
								html += "<tr " + temp_class + ">";
								html += "	<td align='center'><input type='checkbox' name='chs' class='checkAll_td' approvalStatus = 'N' value='"+this.id+"' /></td>";
								html += "	<td class='txt-center' >"+gubun+"</td>";														//구분
								html += "	<td class='txt-center'>"+linkName(this.pmscode)+"</td>";										//프로젝트-Code
								html += "	<td title='" +linkName(this.title)+ "'>"+linkName(this.title)+"</td>";							//프로젝트-Name
								html += "	<td class='txt-center'>"+linkName(this.wbs4Code)+"</td>";										//WBS-Code
								html += "	<td title='WBS4 : " + linkName(this.wbs4Name) +"&#13;WBS1 : "+ linkName(this.wbs1Name) +"'>"+linkName(this.wbs4Name)+"</td>";					//WBS-Name
								//html += "	<td class='txt-center'>"+linkName(this.activeType)+"</td>";										//WBS-상태
								html += "	<td class='txt-center'>"+sunYang+"</td>";														//선행 양산
								html += "	<td title='" + linkName(this.modelName) +"'>"+linkName(this.modelName)+"</td>";					//차종
								html += "<td class='txt-center'>"
									html += "<input type='hidden' name='activeType' wbsName =\""+this.wbs4Name+"\" value='" + this.activeType + "' />"; 
								//투입비중
								html += "	 <input type='text'  name='inpRatio' isSaved='N' value='"+this.ratio+"' gubun='"+gubun+"' onChange='javascript:rationValidation(this);' style='width:29px;text-align:right;'/>% </td>";
								html += "	<td title='" + linkName(this.productDivName1) +"'>"+linkName(this.productDivName1)+"</td>";		//제품-L1
								html += "	<td title='" + linkName(this.productDivName2) +"'>"+linkName(this.productDivName2)+"</td>";		//제품-L2
								html += "	<td title='" + linkName(this.productDivName3) +"'>"+linkName(this.productDivName3)+"</td>";		//제품-L3
								html += "	<td title='" + linkName(this.techDivName1) +"'>"+linkName(this.techDivName1)+"</td>";			//기술-L1
								html += "	<td title='" + linkName(this.techDivName2) +"'>"+linkName(this.techDivName2)+"</td>";			//기술-L2
								html += "	<td title='" + linkName(this.techDivName3) +"'>"+linkName(this.techDivName3)+"</td>";			//기술-L3
								html += "	<td title='" + linkName(this.taskDivName1) +"&#13;상세내용 : "+ linkName(this.appMemo) +"'>"+linkName(this.taskDivName1)+"</td>";			//Task-L1
								html += "	<td title='" + linkName(this.taskDivName2) +"&#13;상세내용 : "+ linkName(this.appMemo) +"'>"+linkName(this.taskDivName2)+"</td>";			//Task-L2
								html += "	<td title='" + linkName(this.taskDivName3) +"&#13;상세내용 : "+ linkName(this.appMemo) +"'>"+linkName(this.taskDivName3)+"</td>";			//Task-L3
								if(this.appMemo == ""){  
									html += "	<td class='txt-center'>"+ "-" + "</a></td>";
								} else {
									html += "	<td class='txt-center'> <a href=javascript:MemoViewPjtSearchTable('" + this.id + "') >"+ '조회'+"</a></td>";   // 8.프로젝트
								}	
								html += "</tr>";
								
								//투입비중 합계
								researchSumRation += this.ratio;
								$("#sum_ratio").html(Math.round(researchSumRation) + "%");
							}else{
								/////////////
								//비연구원
								////////////
								html += "<tr " + temp_class + ">";
								html += "	<td align='center'><input type='checkbox' name='chs' class='checkAll_td' value='"+this.id+"' /></td>";
								html += "	<td>"+gubun+"</td>";										//구분
								html += "	<td class='txt-center'>"+linkName(this.pmscode)+"</td>";					//프로젝트-Code
								html += "	<td  id='trPjtName' title='" +linkName(this.title)+ "'>"+linkName(this.title)+"</td>";							//프로젝트-Name
								html += "	<td class='txt-center'>"+sunYang+"</td>";										//선행 양산
								html += "	<td title='" + linkName(this.modelName) +"'>"+linkName(this.modelName)+"</td>";				//차종
								html += "<td class='txt-right'>"
									html += "<input type='hidden' name='activeType' wbsName ="+this.wbs4Name+" value='" + this.activeType + "' />";
								//투입비중
								html += "	 <input type='text'  name='inpRatio' isSaved='N' value='"+this.ratio+"' gubun='"+gubun+"' onkeyup='javascript:rationValidation(this);' style='width:29px;text-align:right;'/>% </td>";
								html += "	<td title='" + linkName(this.productDivName1) +"'>"+linkName(this.productDivName1)+"</td>";		//제품-L1
								html += "	<td title='" + linkName(this.productDivName2) +"'>"+linkName(this.productDivName2)+"</td>";		//제품-L2
								html += "	<td title='" + linkName(this.productDivName3) +"'>"+linkName(this.productDivName3)+"</td>";		//제품-L3
								html += "</tr>";
								//투입비중 합계
								researchSumRation += this.ratio;
								$("#sum_ratio").html(Math.round(researchSumRation) + "%");
								var totalRatio = 0;
									
							}
							
						});
						$("#r_list_pjt > tbody").html(html);
						tableScrollling("j_mainDivHeader1", "j_mainDivContent1", "r_list_pjt");
					}
					else {
						html = "<tr><td class='txt-center' colspan='19' id='searchFail' >조회결과가 없습니다.</td></tr>";
						$("#r_list_pjt > tbody").html(html);
					}

					var ratioSize = 1;
					$("input[name=inpRatio]").attr("size", ratioSize)
						 .attr("maxlength", 4)
						 .css({"text-align":"right","ime-mode":"disabled"}) 
						 .numeric({max:100, min:0});
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				},
				beforeSend : function() {
					progress.show();
				},
				complete : function() {
					progress.hide();				
					//tableScrollling("r_mainDivHeader1", "r_mainDivContent1", "r_list_pjt");
					//테이블그린후 투입비중 합계 그려주기위해
					rationValidation();
				}
			});
		},
		//가져오기
		getCopyUserList: function(teamId,userId) {
			var year = $("#tYear").val();
			var month = $("#tMonth").val();
			var perprogress = new Progress();
			$.ajax({
				type : "POST",
				url : "/research/getCopyUserList.do",
				data : {
					"teamId":  teamId,
					"userId":  userId
				},
				dataType : 'json',
				success : function(result) {
					var html_R = "";
					var temp_class = "class='tr-case1'";
					if(workingMonth == '01' ){
						var lasWorkingMonth = parseInt(workingMonth) + 11;
						var lasWorkingYear = parseInt(workingYear) -1;
					}
					var map = new Map();
								html_R +="<tr class='txt-center' >";
								html_R +="	<td><input type='radio' name='getCopyUser' value='ME'  onclick='javascript:pjtSearch.setCopyUser( \""+userId+ "\", \""  + this.regDttm +  "\" );  '></input></td>";
								html_R +="	<td>(본인)</td>";
								html_R +="<td class='txt-center'>전월복사</td>";
								html_R +="</tr>";
					if (result.success) {
					var preJobStartDate = "";
								
						$(result.list).each(function(index) {	
							if(userId != this.userId){
								var isChecked = "";
								if(this.userId == postUserId){
									isChecked = "checked"
								}
								
								html_R +="<tr " + temp_class + " >";
								html_R +="	<td  class='txt-center'><input  type='radio'  name='getCopyUser'  value='YOU'  copyUserYear = '"+this.regDttm+"'onclick='javascript:pjtSearch.setCopyUser( \""+this.userId+ "\", \""  + this.regDttm +  "\" );'></input></td>";
								html_R +="	<td class='txt-center'>"+this.localName+"</td>";
								//var firstPjtCode = projectCode.substr(0,1);
								html_R +="	<td class='txt-center'>"+(this.regDttm).substr(0,4) +"년 "+(this.regDttm).substr(4,2)+"월</td>";										
								html_R +="</tr>";
							}
							
						});		
					}  
					/*상세화면에 붙이기 */
					$("#getCopyBody > tbody").html(html_R);
					tableScrollling("getCopyHeader", "getCopyDivContent", "getCopyBody");
					//$("#userId").val(postUserId);
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				},
				beforeSend : function() {
					perprogress.show();
				},
				complete : function() {
					perprogress.hide();
					//사용자정보 초기화
					/*initUserInfo();
					//검색
					pjtSearch.pjt_search(); 
					tableScrollling("divHeader4", "divContent4", "inD1");
					//팀장일경우 상신버튼 제거 및 자가승인 활성화
					$('input[type=radio][name=gubun]').on('change', function() {
					     if($(this).attr("zzijkch") == 'B03') {
							$('#pjt_send').hide();
							$("#pjt_saveself").removeAttr("disabled");
						}else {
							$('#pjt_send').show();
							$("#pjt_saveself").attr("disabled","true");	
							$("#pjt_saveself").attr("style", "background-color:rgb(133,133,133)");
						}
					});*/
				}
			});		
		},
		//가져오기에서 유져아이디 클릭시 hidden에 값담아주기
		setCopyUser : function(userId,regDttm){
			var myUserId = $("#userId").val();
			//본인 id 담아주기
			$("#getCopyUserId").val(myUserId);
			$("#getCopyTargetUserId").val(userId);
			$("#getCopyYear").val(regDttm);
		
		},
		//연구원 --- 전월복사버튼 이벤트
		pjt_search_copy : function(selectedYear,selectedMonth,userId,copyTargetUserId) {
			var html = "";
			if(confirm("복사 하시겠습니까?")) {
				
				if($("input[name=chs]").length > 0){
					alert("전월복사는 해당월에 프로젝트 내역이 없을때 가능합니다. \n\n삭제 후 다시 시도 바랍니다. \n");
					return ;
				}
				var progress = new Progress();
				var researchYN =  $("#researchYN").val();
				
				
				$.ajax({
					type: "POST",
					url : "/research/preMonthCopy.do",
					data: { 
						"userId": userId,
						"copyTargetUserId": copyTargetUserId,
						"status": status , 
						"jobStartDate": selectedYear ,
						"jobEndDate": selectedMonth,
						"workingYear": workingYear,
						"workingMonth": workingMonth
					},
					dataType : 'json',
					success:function(result){
						if(Object.keys(result).length == 0 || Object.keys(result).length ==null ){
							alert("조건에 맞는 데이터가 존재하지 않습니다.");
							return false;
						}
						var searchFail =  $("#searchFail").text();
						if(searchFail == "조회결과가 없습니다."){
							html = "";
						}
						var preJobStartDate = "";
	
						var period = "";
						var temp_class = "class='tr-case1'";
						 
						var map = new Map();
						
						if (result.success) {
							//성공시 투입비중 검색.
							
							var selectedYear = $("#tYear option:selected").val();
							var selectedMonth = $("#tMonth option:selected").val();
							
						 	if(selectedMonth == '01'){
								selectedMonth = parseInt(selectedMonth) + 11;
								selectedYear = parseInt(selectedYear) -1;
							}else{
								selectedMonth = parseInt(selectedMonth) - 1;
								 
							}
						 	if(selectedMonth < 10){
								selectedMonth = "0"+selectedMonth;
							}
							pjtSearch.pjt_search();
							//본인의 전월복사를 할때
							if(userId == copyTargetUserId){
								pjtSearch.copyMyPjtCheck(selectedYear,selectedMonth,userId,copyTargetUserId);
							}else{
								
								pjtSearch.copyTargetPjtCheck(selectedYear,selectedMonth,userId,copyTargetUserId);
							}
							
						}else {
							alert("상신완료된 전월 데이터가 존재하지 않습니다.");
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
						//tableScrollling("r_mainDivHeader1", "r_mainDivContent1", "r_list_pjt");
					}
				});
			}
		},
		//자신의 전월복사데이터중 delete_flag가 Y인 데이터조회
		copyMyPjtCheck : function(selectedYear,selectedMonth,userId,copyTargetUserId) {
			
			var html = "";
				var progress = new Progress();
				var researchYN =  $("#researchYN").val();
				$.ajax({
					type: "POST",
					url : "/research/copyPjtCheck.do",
					data: { 
						"userId": userId,
						"status": status , 
						"jobStartDate": selectedYear ,
						"jobEndDate": selectedMonth,
						"copyTargetUserId": copyTargetUserId
						
					},
					dataType : 'json',
					success:function(result){
						var preJobStartDate = "";
						var period = "";
						var temp_class = "class='tr-case1'";
						var map = new Map();
						var unDeletedPjt = 0;
						var deletedPjt = 0;
						var approvalStatus = "";
						$(result.list).each(function(index) {
							var i = 0; i<Object.keys(result.list).length; i++;
							if(this.delete_flag == 'Y'){
								deletedPjt += i;
							}else if(this.delete_flag == 'N'){
								unDeletedPjt +=i;
							}
							approvalStatus = this.approvalStatus;
						});	
						if(this.projectId != null && approvalStatus== 'Y'|| this.projectId != "" && approvalStatus== 'Y'){
							if(unDeletedPjt > 0 && deletedPjt >0){
								alert("삭제된 "+deletedPjt+"건의 프로젝트를 제외한 나머지 "+unDeletedPjt+"건의 프로젝트를 복사하였습니다.");
								dialogClose('getCopy');
							}else if(deletedPjt == 0 && unDeletedPjt >0){
								alert(unDeletedPjt +"건의 프로젝트를 복사하였습니다.");
								dialogClose('getCopy');
							}else{
								alert("전월 입력 프로젝트가 모두 삭제 되었습니다. \n 재입력 바랍니다.");
								return false;
							}
						}else if(approvalStatus != 'Y'){
							alert("상신완료된 전월 데이터가 존재하지 않습니다.");
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
						//tableScrollling("r_mainDivHeader1", "r_mainDivContent1", "r_list_pjt");
					}
				});
		},
		
		//다른사람의 전월복사데이터중 delete_flag가 Y인 데이터조회
		copyTargetPjtCheck : function(selectedYear,selectedMonth,userId,copyTargetUserId) {
			var copyUserYear = $("#getCopyYear").val(); 
			selectedYear = copyUserYear.substr(0,4);
			selectedMonth = copyUserYear.substr(4,2);
			var html = "";
				var progress = new Progress();
				var researchYN =  $("#researchYN").val();
				$.ajax({
					type: "POST",
					url : "/research/copyPjtCheck.do",
					data: { 
						"userId": userId,
						"status": status , 
						"jobStartDate": selectedYear ,
						"jobEndDate": selectedMonth,
						"copyTargetUserId": copyTargetUserId
						
					},
					dataType : 'json',
					success:function(result){
						var preJobStartDate = "";
						var period = "";
						var temp_class = "class='tr-case1'";
						var map = new Map();
						var unDeletedPjt = 0;
						var deletedPjt = 0;
						var approvalStatus = "";
						$(result.list).each(function(index) {
							var i = 0; i<Object.keys(result.list).length; i++;
							if(this.delete_flag == 'Y'){
								deletedPjt += i;
							}else if(this.delete_flag == 'N'){
								unDeletedPjt +=i;
							}
							approvalStatus = this.approvalStatus;
						});	
						if(this.projectId != null && approvalStatus== 'Y'|| this.projectId != "" && approvalStatus== 'Y'){
							if(unDeletedPjt > 0 && deletedPjt >0){
								alert("삭제된 "+deletedPjt+"건의 프로젝트를 제외한 나머지 "+unDeletedPjt+"건의 프로젝트를 복사하였습니다.");
								dialogClose('getCopy');
							}else if(deletedPjt == 0 && unDeletedPjt >0){
								alert(unDeletedPjt +"건의 프로젝트를 복사하였습니다.");
								dialogClose('getCopy');
							}else{
								alert("삭제되지 않은 해당월의 프로젝트가 존재하지 않습니다.");
								return false;
							}
						}else if(approvalStatus != 'Y'){
							alert("상신완료된 해당월의 데이터가 존재하지 않습니다.");
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
						//tableScrollling("r_mainDivHeader1", "r_mainDivContent1", "r_list_pjt");
					}
				});
		},
		
		
		//프로젝트투입비중 - 추가 modal tab01 wbsSearch
		pjt_add_wbs_search : function(searchWbsPjt, page) {
			if(page == null || page == 'undefined' || page =="") page = 1;
			var totalCount = 0;
			var pageSize = 10;
			var perprogress = new perProgress();
			$.ajax({
				type : "POST",
				url : "/research/searchWbsObjectOfFirstTab.do",
				data : {
					"searchWbsPjt": searchWbsPjt
					,"page":page
					,"pageSize":pageSize
					
				},
				dataType : 'json',
				success : function(result) {
					var pjtCode = "";
					var html_J = "";
					var html_R_L = "";
					var preJobStartDate = "";
					var jikmuGubun = "";
	
					var period = "";
					var temp_class = "class='tr-case1'";
					
					var map = new Map();
					if (result.success) {
						
						var preJobStartDate = "";
						
						$(result.list).each(function(index) {	
								///////////////
								// 헤더검색
								///////////////
							totalCount =  this.totalCount;
							if ( preJobStartDate != this.jobStartDate ){
								if (  temp_class == "class='tr-case1'"){
									temp_class = "class='codeDetailChkbox'";
								}else{
									temp_class = "class='tr-case1'";
								}
							}
							//////////////////////////
							//프로젝트추가 - w
							html_R_L +="<tr " + temp_class + ">";
							
							html_R_L += "<td class='txt-center' id='wbsCode'>"+this.wbs4Code+"</td>";		//WBS 코드
							html_R_L += "<td title='WBS4 : " + (this.wbs4Title).replace("'","") +"&#13;WBS1 : "+ (this.wbs1Title).replace("'","") +"'>"+this.wbs4Title+"</td>";		//WBS Name
							html_R_L += "<td align='center'><input type='radio' name='wbs_r_wbs'  onclick='pjtSearch.selectWbs_add_search( \""+this.wbs4Code+"\" )'></input></td>";
							html_R_L += "<td class='txt-center' style='display:none;' hidden id='gubun' value='wWbs'></td>";

							html_R_L += "</tr>";
							//preJobStartDate = this.weeklyJobStartDate;
						});					
					}
					
					if ( html_R_L == "" ){
						html_R_L = "<tr><td class='txt-center' colspan='3'>현재 진행 중인 프로젝트가 없습니다.</td></tr>";
					}
					
					/* 연구원- 프로젝트 추가 modal - wbs테이블 */
					$("#wWbs > tbody").html(html_R_L);
					
					
					if(pjtCode !=""){
						pjtSearch.selectWbs_add_search(this.wbs4Code);
					}
					// paging
					/*console.log('page', page);		
					console.log('totalCount', totalCount);	
					console.log('pageSize', pageSize);	*/
					$('#first_left_paging').paging({
						current: page,
						max: Math.ceil(totalCount/pageSize),
						first: "◀◀&nbsp;",
						prev: "&nbsp;◀&nbsp;",
						next: "&nbsp;▶&nbsp;",
						last: "&nbsp;▶▶",
						onclick:function(e,page){
							pjtSearch.pjt_add_wbs_search(searchWbsPjt ,page);
						}
					});
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				},
				beforeSend : function() {
					clearTable();
					perprogress.show();
				},
				complete : function() {
					perprogress.hide();				
					tableScrollling("divHeader3", "divContent3", "wWbs");
				}
			});
			
		},
		
		// 프로젝트 추가 modal tab01- wbs 선택시 우측 테이블의 데이터.	
			selectWbs_add_search: function(wbs4Code,page) {
				if(page == null || page == 'undefined' || page =="") page = 1;
				var totalCount = 0;
				var pageSize = 10;
				var perprogress = new Progress();
				$.ajax({
					type : "POST",
					url : "/research/searchPjtOfWbs.do",
					data : {
						"wbs4Code":wbs4Code
						,"page":page
						,"pageSize":pageSize
					},
					dataType : 'json',
					success : function(result) {
						var html_J = "";
						var html_R = "";
						var preJobStartDate = "";
						var jikmuGubun = "";

						var period = "";
						var temp_class = "class='tr-case1'";
						 
						var map = new Map();
						if (result.success) {
							
							var preJobStartDate = "";
							$(result.list).each(function(index) {	
							
								totalCount =  this.totalCount;
							
								if ( preJobStartDate != this.jobStartDate ){ 
									if (  temp_class == "class='tr-case1'"){
										temp_class = "class='codeDetailChkbox'";
									}else{
										temp_class = "class='tr-case1'";
									}
								}							
								///////////////
								// 연구원 wbs 선택시 pjt테이블
								///////////////	
								
								html_R +="<tr " + temp_class + " >";
								
								html_R += "<td class='txt-center'>"+this.pmscode+"</td>";		//3. 프로젝트코드
								html_R += "<td class='txt-left'>"+this.title+"</td>";						//4.프로젝트네임
								html_R += "<td align='center'><input type='radio' name='wbs_r_pjt'  onclick='pjtSearch.wbsSetPjtData(\""+this.id+"\"  )'></input></td>";
								html_R += "</tr>";
								 
								preJobStartDate = this.weeklyJobStartDate;
								
								$("#projectId").val(this.id);
							/*	$("#pmsCode").val(this.pmscode);
								$("#pmsTitle").val(this.title);
								$("#wbs4Title").val(wbs4Title);*/
								$("#wbs4Code").val(this.wbs4Code);
								
							});		
						}  
						
						if ( html_R == "" ){
							html_R = "<tr><td class='txt-center' colspan='3'>현재 진행 중인 프로젝트가 없습니다.</td></tr>";
						}				
						
						/*상세화면에 붙이기 */
						$("#wPjt > tbody").html(html_R);
						
						// paging
						$('#first_right_paging').paging({
							current: page,
							max: Math.ceil(totalCount/pageSize),
							first: "◀◀&nbsp;",
							prev: "&nbsp;◀&nbsp;",
							next: "&nbsp;▶&nbsp;",
							last: "&nbsp;▶▶",
							onclick:function(e,page){
								pjtSearch.pjt_add_wbs_search(searchWbsPjt ,page);
							}
						});
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					},
					beforeSend : function() {
						perprogress.show();
					},
					complete : function() {
						perprogress.hide();
						
						tableScrollling("divHeader4", "divContent4", "wPjt");
					}
				});		
			},
			// 연구원/비연구원 상세정보 검색 end
			
			selectWbsDisable: function() {
				var html_R = "";
				$("#wPjt > tbody").html(html_R);
				
			},
			
			
				//wbs선택후 pjt 선택 -> data넘기기
			wbsSetPjtData:function (id){
			
				$("#projectId").val(id);
			},
			
			//프로젝트투입비중 - 추가 modal tab02 프로젝트/WBS 목록
			pjt_add_pjt_search : function(searchWbsVal,btnMyPjtYN,page) {
				if(page == null || page == 'undefined' || page =="") page = 1;
				var totalCount = 0;
				var pageSize = 10;
				var perprogress = new perProgress();
				$.ajax({
					type : "POST",
					url : "/research/searchProjectObjectOfSecondTab.do",
					data : {
						"searchWbsVal":searchWbsVal
						,"btnMyPjtYN":btnMyPjtYN
						,"page":page
						,"pageSize":pageSize
						//"userId": this.userId
					},
					dataType : 'json',
					success : function(result) {
						var html_J = "";
						var html_R_L = "";
						var preJobStartDate = "";
						var jikmuGubun = "";
		
						var period = "";
						var temp_class = "class='tr-case1'";
						 
						var map = new Map();
						if (result.success) {
							
							var preJobStartDate = "";
							$(result.list).each(function(index) {	
								totalCount =  this.totalCount;
									///////////////
									// 헤더검색
									///////////////
									if ( preJobStartDate != this.jobStartDate ){
										if (  temp_class == "class='tr-case1'"){
											temp_class = "class='codeDetailChkbox'";
										}else{
											temp_class = "class='tr-case1'";
										}
									}

									//////////////////////////
									//프로젝트추가 - w
									html_R_L +="<tr " + temp_class + "id = 'pPjtTable'>";
									
									html_R_L += "<td class='txt-center'>"+this.pmscode+"</td>";	//3. 프로젝트코드
									html_R_L += "<td class='txt-left'>"+this.title+"</td>";//4.프로젝트네임
									//html_R_L += "<td align='center'><input type='radio'  name='pjt_r_pjt' onclick='pjtSearch.wbsSetPjtData(\""+this.id+"\")'></input></td>";
									html_R_L += "<td align='center'><input type='radio'  name='pjt_r_pjt' onclick='pjtSearch.selectPjt_add_search(\""+this.pmscode+"\")'></input></td>";
									html_R_L += "<td class='txt-center' style='display:none;' hidden id='gubun' value='pPjt'></td>";

									html_R_L += "</tr>";
									preJobStartDate = this.weeklyJobStartDate;
								});					
						}  
						if ( html_R_L == "" ){
							html_R_L = "<tr><td class='txt-center' colspan='5'>현재 진행 중인 프로젝트가 없습니다.</td></tr>";
						}
						/* 연구원- 프로젝트 추가 modal - wbs테이블 */
					
						$("#pPjt > tbody").html(html_R_L);
						// paging
						$('#second_left_paging').paging({
							current: page,
							max: Math.ceil(totalCount/pageSize),
							first: "◀◀&nbsp;",
							prev: "&nbsp;◀&nbsp;",
							next: "&nbsp;▶&nbsp;",
							last: "&nbsp;▶▶",
							onclick:function(e,page){
								pjtSearch.pjt_add_pjt_search(searchWbsVal,btnMyPjtYN ,page);
							}
						});
						
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					},
					beforeSend : function() {
						clearTable();
						perprogress.show();
					},
					complete : function() {
						perprogress.hide();				
						tableScrollling("pWbsHeader", "pWbsContent", "pPjt");
					}
				});
				
			},
			
			
			// 프로젝트 추가 modal tab02- 프로젝트 선택시 우측  WBS 테이블의 데이터.	
			selectPjt_add_search: function(pmscode,page) {
				if(page == null || page == 'undefined' || page =="") page = 1;
				var totalCount = 0;
				var pageSize = 10;
				var perprogress = new Progress();
				$.ajax({
					type : "POST",
					url : "/research/getWbsList.do",
					data : {
						"pmscode":pmscode
						,"page":page
						,"pageSize":pageSize
					},
					dataType : 'json',
					success : function(result) {
						var html_R = "";
						var temp_class = "class='tr-case1'";
						if (result.success) {
							
							$(result.list).each(function(index) {	
								totalCount =  this.totalCount;
								///////////////
								// 연구원 pjt 선택시 wbs테이블
								///////////////	
									html_R +="<tr " + temp_class + " >";
									
									html_R += "<td class='txt-center'>"+(this.wbs4Code == "" ? "-" : this.wbs4Code)+"</td>";						//1. WBS 코드
									html_R += "<td title='WBS4 : " + (this.wbs4Title).replace("'","") +"&#13;WBS1 : "+ (this.wbs1Title).replace("'","") +"'>"+(this.wbs4Title == "" ? "※ WBS 없음" : this.wbs4Title)+"</td>";		//WBS Name					//2. WBS 네임
									html_R += "<td align='center'><input type='radio' name='pjt_r_wbs'  onclick='pjtSearch.pjtSetWbsData(\""+this.id+"\"  )'></input></td>";
		
									html_R += "</tr>";
									hasWbsList = true;
									if ( totalCount == 1 && this.wbs4Code =="" ){
										hasWbsList = false;
										//console_logs("totalcount :::: ", totalCount);
										html_R = "<tr><td class='txt-center' colspan='3'>맵핑된 정보가 존재하지 않습니다.</br>※ WBS가 맵핑되어있지 않아도 프로젝트 등록이 가능합니다.</td></tr>";
									}	
								$("#projectId").val(this.id);
								$("#wbs4Code").val(this.wbs4Code);
								
							});		
						}  
						
						/*상세화면에 붙이기 */
						$("#pWbs > tbody").html(html_R);
						// paging
						$('#second_right_paging').paging({
							current: page,
							max: Math.ceil(totalCount/pageSize),
							first: "◀◀&nbsp;",
							prev: "&nbsp;◀&nbsp;",
							next: "&nbsp;▶&nbsp;",
							last: "&nbsp;▶▶",
							onclick:function(e,page){
								pjtSearch.selectPjt_add_search(pmscode ,page);
							}
						});
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					},
					beforeSend : function() {
						perprogress.show();
					},
					complete : function() {
						perprogress.hide();
						
						tableScrollling("divHeader5", "divContent5", "pWbs");
					}
				});		
			},
			// 연구원/비연구원 상세정보 검색 end
			
			selectWbsDisable: function() {
				var html_R = "";
				$("#pWbs > tbody").html(html_R);
				
			},
			
			
				//wbs선택후 pjt 선택 -> data넘기기
			pjtSetWbsData:function (id){
				
				$("#projectId").val(id);
			},
			
			// 코드없음 체크시 프로젝트 table에 N00000 	
			nonCode_add_search: function(pmscode,page) {
				if(page == null || page == 'undefined' || page =="") page = 1;
				var totalCount = 0;
				var pageSize = 10;
				var isTab1Enable = $("#tab1").hasClass('tap-on');
				var perprogress = new Progress();
				$.ajax({
					type : "POST",
					url : "/research/withOutCode.do",
					data : {
						 "pmscode":pmscode
						,"page":page
						,"pageSize":pageSize
					},
					dataType : 'json',
					success : function(result) {
						var html_pjt = "";
						var html_wbs = "";

						var temp_class = "class='tr-case1'";
						 
						if (result.success) {
							$(result.list).each(function(index) {	
								totalCount =  this.totalCount;
								///////////////
								// 코드없음 선택시 
								///////////////	
								html_pjt +="<tr " + temp_class + " >";
								html_pjt = "<tr><td class='txt-center'>N00000</td><td class='txt-center' colspan='2'>공통 프로젝트로 등록합니다.</td></tr>";
								$("#projectId").val(this.id);
								html_pjt += "</tr>";
								
								html_wbs +="<tr " + temp_class + " >";
								html_wbs = "<tr><td class='txt-center' colspan='3'>WBS를 선택하실 필요 없습니다.</td></tr>";
								html_wbs += "</tr>";
								hasWbsList = false;
								noneCode = true;
							});		
						}  
						
						var tab_BodyID = "wPjt";
						var tab_BodyID2 = "wWbs";
						//ProjectTab이 활성화 되어있으면
					   	if(!isTab1Enable) {
							tab_BodyID = "pPjt";
							tab_BodyID2 = "pWbs";
					   	}
						$("#"+tab_BodyID+" > tbody").html(html_pjt);
						$("#"+tab_BodyID2+" > tbody").html(html_wbs);
						$("#jPjt > tbody").html(html_pjt);
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					},
					beforeSend : function() {
						clearTable();
						perprogress.show();
						$("#withoutCode").prop('checked', true);
					},
					complete : function() {
						perprogress.hide();
						tableScrollling("divHeader6", "divContent6", "pWbs");
					}
				});		
			},
			// 연구원/비연구원 상세정보 검색 end
			
			selectWbsDisable: function() {
				var html_R = "";
				$("#pWbs > tbody").html(html_R);
			},
			
			pjtSetWbsData:function(id){
				$("#projectId").val(id);
			},
				
				
				
			//연구원 프로젝트투입비중 - 추가 modal tab02 MyProject 버튼 
			pjt_add_myPjtSearch : function(page) {
				if(page == null || page == 'undefined' || page =="") page = 1;
				var totalCount = 0;
				var pageSize = 10;
				var perprogress = new perProgress();
				$.ajax({
					type : "POST",
					url : "/research/searchMyProject.do",
					data : {
						"userId": $("#userId").val()
						,"page":page
						,"pageSize":pageSize
					},
					dataType : 'json',
					success : function(result) {
						var html_J = "";
						var html_R_L = "";
						var preJobStartDate = "";
						var jikmuGubun = "";
		
						var period = "";
						var temp_class = "class='tr-case1'";
						 
						var map = new Map();
						if (result.success) {
							
							var preJobStartDate = "";
							$(result.list).each(function(index) {	
								totalCount =  this.totalCount;

								//프로젝트추가 - w
								html_R_L +="<tr " + temp_class + ">";
								
								html_R_L += "<td class='txt-center'>"+this.pmscode+"</td>";	//3. 프로젝트코드
								html_R_L += "<td class='txt-left'>"+this.title+"</td>";//4.프로젝트네임
								html_R_L += "<td align='center'><input type='radio'  name='pjt_r_pjt' onclick='pjtSearch.selectPjt_add_search(\""+this.pmscode+"\")'></input></td>";
								html_R_L += "</tr>";
							});					
						}  
						if ( html_R_L == "" ){
							html_R_L = "<tr><td class='txt-center' colspan='3'>현재 진행 중인 프로젝트가 없습니다.</td></tr>";
						}
						/* 연구원- 프로젝트 추가 modal - wbs테이블 */
						$("#pPjt > tbody").html(html_R_L);
						// paging
						$('#second_left_paging').paging({
							current: page,
							max: Math.ceil(totalCount/pageSize),
							first: "◀◀&nbsp;",
							prev: "&nbsp;◀&nbsp;",
							next: "&nbsp;▶&nbsp;",
							last: "&nbsp;▶▶",
							onclick:function(e,page){
								pjtSearch.pjt_add_myPjtSearch(page);
							}
						});
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					},
					beforeSend : function() {
						clearTable();
						perprogress.show();
					},
					complete : function() {
						perprogress.hide();				
						tableScrollling("pWbsHeader", "pWbsContent", "pPjt");
					}
				});
				
			},
			
			
			//비연구원 프로젝트투입비중 - 추가 MyProject 버튼 
			pjt_add_j_myPjtSearch : function(page) {
				if(page == null || page == 'undefined' || page =="") page = 1;
				var totalCount = 0;
				var pageSize = 13;
				var perprogress = new perProgress();
				$.ajax({
					type : "POST",
					url : "/research/searchJMyProject.do",
					data : {
						 "userId": $("#userId").val()
						,"page":page
						,"pageSize":pageSize
					},
					dataType : 'json',
					success : function(result) {
						var html_J = "";
						var html_pjt = "";
						var preJobStartDate = "";
						var jikmuGubun = "";
		
						var period = "";
						var temp_class = "class='tr-case1'";
						 
						var map = new Map();
						if (result.success) {
							var temp_class = "class='tr-case1'";
							$(result.list).each(function(index) {	
								totalCount = this.totalCount;

								//////////////////////////
								//프로젝트추가 - w
								//////////////////////////
								html_pjt +="<tr " + temp_class + ">";
								
								html_pjt += "<td class='txt-center'>"+this.pmscode+"</td>";	//3. 프로젝트코드
								html_pjt += "<td class='txt-left'>"+this.title+"</td>";//4.프로젝트네임
								html_pjt += "<td align='center'><input type='radio'  name='pjt_r_pjt' onclick='pjtSearch.wbsSetPjtData(\""+this.id+"\")'></input></td>";

								html_pjt += "</tr>";
							});					
						}  
						if ( html_pjt == "" ){
							html_pjt = "<tr><td class='txt-center' colspan='3'>현재 진행 중인 프로젝트가 없습니다.</td></tr>";
						}
						
						/* 연구원- 프로젝트 추가 modal - wbs테이블 */
						$("#jPjt > tbody").html(html_pjt);
						// paging
						$('#pjt_regist_j_paging').paging({
							current: page,
							max: Math.ceil(totalCount/pageSize),
							first: "◀◀&nbsp;",
							prev: "&nbsp;◀&nbsp;",
							next: "&nbsp;▶&nbsp;",
							last: "&nbsp;▶▶",
							onclick:function(e,page){
								pjtSearch.pjt_add_j_myPjtSearch(page);
							}
						});
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					},
					beforeSend : function() {
						perprogress.show();
					},
					complete : function() {
						perprogress.hide();				
						tableScrollling("divHeader5", "divContent5", "pPjt");
					}
				});
				
			},
			
		deleteResearch: function() {
			
			if (!$("input[name=chs]").is(":checked")) {
					alert("삭제할 대상을 선택해주세요.");
			}else {
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
						var f = document.pjtListForm;
						var userId = $("#userId").val();
						$("#deleteTargetUserId").val(userId);
						
						//alert($("#deleteTargetUserId").val());
						//alert($("form[name='pjtListForm']").serialize());
						
						f.method = "POST";
						f.action = "/research/delete.do";
						f.submit();
					}
				}
			}
		},
		
		//비연구원 프로젝트투입비중 - 추가 modal 프로젝트 목록
		pjt_j_add_pjt_search : function(jSearchWbsVal,page) {
			
			if(page == null || page == 'undefined' || page =="") page = 1;
			var totalCount = 0;
			var pageSize = 13;
			var perprogress = new perProgress();
			perprogress.show();	
			$.ajax({
				type : "POST",
				url : "/research/getJProjectList.do",
				data : {
					"searchWbsVal":jSearchWbsVal
					,"page":page
					,"pageSize":pageSize
					//"userId": this.userId
				},
				dataType : 'json',
				success : function(result) {
				
					var html_R_L = "";
					var temp_class = "class='tr-case1'";
					var map = new Map();
					if (result.success) {
						$(result.list).each(function(index) {
							totalCount = this.totalCount;
							//////////////////////////
							//프로젝트추가 
							//////////////////////////
							html_R_L +="<tr " + temp_class + ">"; 
							html_R_L += "<td title='ID : " + linkName(this.id)+ "'class='txt-center'>"+this.pmscode+"</td>";	//3. 프로젝트코드
							html_R_L += "<td class='txt-left'>"+this.title+"</td>";//4.프로젝트네임
							html_R_L += "<td align='center'><input type='radio'  name='pjt_r_pjt' onclick='pjtSearch.wbsSetPjtData(\""+this.id+"\")'></input></td>";
							html_R_L += "</tr>";
						});					
					}  
					
					if ( html_R_L == "" ){
						
						html_R_L = "<tr><td class='txt-center' colspan='3'>현재 진행 중인 프로젝트가 없습니다.</td></tr>";
					}
					
					$("#jPjt > tbody").html(html_R_L);

					// paging
					$('#pjt_regist_j_paging').paging({
						current: page,
						max: Math.ceil(totalCount/pageSize),
						first: "◀◀&nbsp;",
						prev: "&nbsp;◀&nbsp;",
						next: "&nbsp;▶&nbsp;",
						last: "&nbsp;▶▶",
						onclick:function(e,page){
							pjtSearch.pjt_j_add_pjt_search(jSearchWbsVal,page,page);
						}
					});
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				},
				complete : function() {
					perprogress.hide();				
					tableScrollling("divHeader5", "divContent5", "jPjt");
				}
			});
			
		},
		
		//투입비율 저장
		saveHistory: function() {
			if(this.validate2() && confirm("저장 하시겠습니까?")) {
				var progress = new Progress();
				progress.show();
				
				var f = document.pjtListForm;
				f.method = "POST";
				f.action = "/approval/save.do";
				f.submit();
			} 
		},
};	
				