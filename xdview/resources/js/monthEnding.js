
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
var monthEnding = {
	//월마감관리 헤더 테이블 조회
	searchMonthEndingHeader: function(){
		var perprogress = new Progress();
			$.ajax({
				type : "POST",
				url : "/monthending/searchMEHeader.do",
				data : {
				},
				dataType : 'json',
				success : function(result) {
					var html = "";
					var temp_class = "class='tr-case1'";
					var map = new Map();
					//상태값
					if (result.success) {
						var preJobStartDate = "";
						$(result.list).each(function(index) {
							//집계유효성검사가 성공이면
							if(this.xdViewResult ==  'SUCCESS!!'){
								$("#totalValidate").val('Y');		
							}else{
								$("#totalValidate").val('');
							}
							//집계데이터생성 성공이면
							var totalizeResult = (this.totalize).indexOf('XDM_VALUE FINISHED');
							if(totalizeResult != -1){
								$('#totalizeSuccessYN').val('Y');
							}else{
								$('#totalizeSuccessYN').val('');
							}
							if(index==result.list.length-1) {						
								html +="<tr>";
								html +="	<th>상태</th>";
								html +="	<th>마감수행자</th>";
								html +="	<th>입력시작시간</th>";
								//html +="	<th>마감완료시간</th>";
								html +="	<th >ERP 마감전송</th>";
								html +="	<th colspan=2>메일전송 결과</th>";
								html +="	<th colspan=2>집계데이타생성 결과</th>";
								
								html +="</tr>";
								html +="<tr " + temp_class + " >";
								var endingState = "";
								if(this.state == "WORKING"){
									endingState = "작업";
								}else if(this.state == "INPUT_END"){
									endingState = "마감";
								}else if(this.state =="FINISHED"){
									endingState = "마감종료";
								}
								
								html +="	<td class='txt-center'>"+endingState+ ' (' + this.state +")</td>";														//상태
								html +="	<td class='txt-center' title='" + this.performerId + "'>"+ this.performerName + ' ' + this.performerPosition +"</td>";   		//마감수행자
								html +="	<td class='txt-center'>"+linkName(this.created)+"</td>";			//시작시간
								html +="	<td class='txt-left' >"+this.erpResult+"</td>";			//ERP I/F	
								//html +="	<td class='txt-center'>"+linkName(this.endingDate) + "</td>";			//마감완료 시간	
								html +="	<td colspan=2 class='txt-left' title='"+ this.sendMailResult+ "' >"+this.sendMailResult+"</td>";  	//메일전송  결과 
								html +="	<td colspan=2 rowspan=3 style='padding:0px;'><div style='background:#F0F0F0;overflow-y:scroll; width:100%;height:70px;'>"+linkName(this.totalize)+"</div></td>";		//총마감결과//소속
								html +="</tr>";
								//html +="<tr><td colspan=6 height=3></td></tr>";
								html +="	<tr>";
								html +="	<th>총대상자 수</th>";
								html +="	<th>미입력자 수</th>";
								html +="	<th>미승인자 수</th>";
								html +="	<th>대행처리 건수</th>";
								html +="	<th colspan=2>집계유효성검사 결과</th>";
								html +="</tr>		";
								html +="<tr " + temp_class + " >";																	//소속
								html +="	<td class='txt-right'>"+linkName(this.normalCnt)+"</td>";			//정상입력건수
								html +="	<td class='txt-right'>"+linkName(this.notInputCnt)  +"</td>";		//미입력,미승인건수//직위																					
								html +="	<td class='txt-right'>"+ linkName(this.abnormalCnt) +"</td>";		//미입력,미승인건수//직위
								html +="	<td class='txt-right'>"+linkName(this.tryCnt)+"</td>";		//대행처리		
                         		html +="	<td class='txt-left' colspan=2>"+linkName(this.xdViewResult)+"</td>";			//집계데이터생성
								
								html +="</tr>";

							}
						});		
					}  
					/*상세화면에 붙이기 */
					$("#MEHTable > tbody").html(html);
					
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
				}
			});	
	},
		
	//월마감관리 - 대상자 조회
	searchSubjectUser: function(cidYear,cidMonth,bonbuCode,teamCode, userId, localName,btn_YN,page){
		//alert("cidYear : " + cidYear + "  cidMonth : " + cidMonth + "  bonbuCode : " + bonbuCode + " teamCode : " + teamCode + "  userId : " + userId + "  localName : " +localName + " btn_YN : " + btn_YN);
		if(page == null || page == 'undefined' || page =="") page = 1;
		var totalCount = 0;
		var pageSize = 100;
		var perprogress = new Progress();
		//alert(" 본부 : " + bonbuCode +  " 팀 : " + teamCode);
	 	//본부가 없는 사용자 검색하기위해
		/*if(bonbuCode =="" &&  ){
			bonbuCode = "";
		}*/
		/*if(cidMonth == '01'){
			cidMonth = parseInt(cidMonth) + 11;
			cidYear = parseInt(cidYear) -1;
		}else{
			cidMonth = parseInt(cidMonth) - 1;
		}
	 	if(cidMonth < 10){
			cidMonth = "0"+cidMonth;
		}*/
		//임시 하드코딩
		/*cidYear = "2016";
		cidMonth = "02";*/
	 	//alert("cidYear+cidMonth : " +cidYear+cidMonth);
			$.ajax({
				type : "POST",
				url : "/monthending/searchSubjectUser.do",
				data : {
					"bonbuCode": bonbuCode
				   ,"teamCode": teamCode	
				   ,"sabun":userId
				   //,"authorityId":authorityId
				   ,"localName":localName
				   ,"cidYearMonth" : cidYear+cidMonth
				   ,"page":page
				   ,"pageSize":pageSize
				   ,"btn_YN":btn_YN
				},
				dataType : 'json',
				success : function(result) {
					var html = "";
					var temp_class = "class='tr-case1'";
					var map = new Map();
					if (result.success) {
						var preJobStartDate = "";
						$(result.list).each(function(index) {	
							totalCount = this.totalCount;
							html +="<tr " + temp_class + " >";
							html +="	<td align='center'><input type='checkbox' name='chs' class='checkAll_td' approvalStatus = 'N' value='"+this.id+"'  /></td>";														//상태
							html +="	<td class='txt-center'>"+linkName(this.orgBonbu)+"</td>";   		//팀명
							html +="	<td class='txt-center'>"+linkName(this.teamDesc)+"</td>";   		//팀명
							html +="	<td class='txt-center'>"+linkName(this.userId)+"</td>";				//사번
							html +="	<td class='txt-left'>"+linkName(this.positionName)+"</td>";			//직급																			
							html +="	<td class='txt-left'>"+linkName(this.localName)+"</td>";			//성명
							html +="</tr>";
						});
						
						/*상세화면에 붙이기 */
						$("#SJUserContentTable > tbody").html(html);
					} else {
						html = "<tr><td class='txt-center' colspan='6'  >조회결과가 없습니다.</td></tr>";
						$("#SJUserContentTable > tbody").html(html);
					} 
					
					if(btn_YN != 'Y'){
						$("#subjectCount").val(totalCount);
						//헤더테이블 조회시 m2_month_ending 테이블에 normal_cnt 컬럼값 대상자 조회 total값으로 update
						//monthEnding.updateTotalSubjectUser(totalCount);
						//alert($("#subjectCount").val());
					}
					console_logs('page', page);		
					console_logs('totalCount', totalCount);	
					console_logs('pageSize', pageSize);	
					$('#subjectUserPaging').paging({
							current: page,
							max: Math.ceil(totalCount/pageSize),
							first: "◀◀&nbsp;",
							prev: "&nbsp;◀&nbsp;",
							next: "&nbsp;▶&nbsp;",
							last: "&nbsp;▶▶",
							onclick:function(e,page){
								monthEnding.searchSubjectUser(cidYear,cidMonth,bonbuCode,teamCode, userId, localName,btn_YN,page);
							}
						});
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
				}
			});
	},
	//대행입력시 list.jsp 팝업	
	popForcedURL : function (forcedId) {
		//var url = "http://campus.mobis.co.kr/frt/idp2/report/selectCmptncDvlpmntPlnList.do";
		var url = "/research/list.do?menu_id=2&FORCED_INPUT="+forcedId+"";
		var p = window.open(url, "pop", "width=1024, height=768, location=0, scrollbars=1");
		p.focus();
	},
	//미입력자 조회
	searchNonInputUser: function(cidYear,cidMonth,bonbuCode,teamCode, userId, localName,btn_YN){
		//alert("cidYear : " + cidYear + "  cidMonth : " + cidMonth + "  bonbuCode : " + bonbuCode + " teamCode : " + teamCode + "  userId : " + userId + "  localName : " +localName + " btn_YN : " + btn_YN);
		var perprogress = new Progress();
		var forcedLink = "http://localhost:5050/research/list.do?menu_id=2&FORCED_INPUT=";
		//본부가 없는 사용자 검색하기위해
	 	/*if(bonbuCode =="%"){
			bonbuCode = "";
			
		}*/
		
		//임시 하드코딩
		/*cidYear = "2016";
		cidMonth = "02";*/
		var jobStartDate = cidYear + cidMonth + "01";
	 	//alert("cidYear+cidMonth : " +cidYear+cidMonth);
			$.ajax({
				type : "POST",
				url : "/monthending/searchNonInputUser.do",
				data : {
					"bonbuCode": bonbuCode
				   ,"teamCode": teamCode	
				   ,"sabun":userId
				   //,"authorityId":authorityId
				   ,"localName":localName
				   ,"cidYearMonth" : cidYear+cidMonth
				   ,"jobStartDate" : jobStartDate
				   ,"btn_YN":btn_YN
				},
				dataType : 'json',
				success : function(result) {
					var html = "";
					var temp_class = "class='tr-case1'";
					var map = new Map();
					if (result.success) {
						var preJobStartDate = "";
						$(result.list).each(function(index) {	
							html +="<tr " + temp_class + " >";
							html += "	<td align='center'><input type='checkbox' name='chs' class='checkAll_td'  deleteId = '"+this.id+"' approvalStatus = 'N' value='"+this.userId+"' /></td>";														//상태
							html +="	<td class='txt-center'>"+linkName(this.orgBonbu)+"</td>";   		//팀명
							html +="	<td class='txt-center'>"+linkName(this.teamDesc)+"</td>";   		//팀명
							html +="	<td class='txt-center'>"+linkName(this.userId)+"</td>";				//사번
							html +="	<td class='txt-left'>"+linkName(this.positionName)+"</td>";			//직급																			
							html +="	<td class='txt-left'>"+linkName(this.localName)+"(<a href='javascript:monthEnding.popForcedURL("+this.userId+ ");'>대행처리</a>)</td>";			//성명
							html +="</tr>";
						});	
						
						/*상세화면에 붙이기 */
						$("#nonInputUserContentTable > tbody").html(html);
					} else {
						html = "<tr><td class='txt-center' colspan='6'  >조회결과가 없습니다.</td></tr>";
						$("#nonInputUserContentTable > tbody").html(html);
					} 
					
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
				}
			});
	},
	//미승인자 조회
	searchNoApprover: function(cidYear,cidMonth,bonbuCode,teamCode, userId, localName,btn_YN){
		//alert("cidYear : " + cidYear + "  cidMonth : " + cidMonth + "  bonbuCode : " + bonbuCode + " teamCode : " + teamCode + "  userId : " + userId + "  localName : " +localName + " btn_YN : " + btn_YN);
		var perprogress = new Progress();
	 	//본부가 없는 사용자 검색하기위해
		/*if(bonbuCode =="%"){
			bonbuCode = "";
			
		}*/
		//alert("본부 : " + bonbuCode + " 팀 : " + teamCode);
		//임시 하드코딩
		/*cidYear = "2016";
		cidMonth = "01";*/
		var jobStartDate = cidYear + cidMonth + "01";
	 	//alert("cidYear+cidMonth : " +cidYear+cidMonth);
			$.ajax({
				type : "POST",
				url : "/monthending/searchNoApprover.do",
				data : {
					"bonbuCode": bonbuCode
				   ,"teamCode": teamCode	
				   ,"sabun":userId
				   //,"authorityId":authorityId
				   ,"localName":localName
				   ,"cidYearMonth" : cidYear+cidMonth
				   ,"jobStartDate" : jobStartDate
				   ,"btn_YN":btn_YN
				},
				dataType : 'json',
				success : function(result) {
					var html = "";
					var temp_class = "class='tr-case1'";
					var map = new Map();
					if (result.success) {
						var preJobStartDate = "";
						$(result.list).each(function(index) {	
							html +="<tr " + temp_class + " >";
							html += "	<td align='center'><input type='checkbox' name='chs' class='checkAll_td' approvalStatus = 'N' value='"+this.userId+"' )' /></td>";														//상태
							html +="	<td class='txt-center'>"+linkName(this.orgBonbu)+"</td>";   		//팀명
							html +="	<td class='txt-center'>"+linkName(this.teamDesc)+"</td>";   		//팀명
							html +="	<td class='txt-center'>"+linkName(this.userId)+"</td>";				//사번
							html +="	<td class='txt-left'>"+linkName(this.positionName)+"</td>";			//직급																			
							html +="	<td class='txt-left'>"+linkName(this.localName)+"</td>";			//성명
							html +="</tr>";
						});	
						/*상세화면에 붙이기 */
						$("#noApproverContentTable > tbody").html(html);
					} else {
						html = "<tr><td class='txt-center' colspan='6'  >조회결과가 없습니다.</td></tr>";
						$("#noApproverContentTable > tbody").html(html);
					} 
					
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
				}
			});
	},
	
	//대상자생성
	createSubjectUser: function(WORKING_YEARMONTH){
		
		console_logs('js createSubjectUser WORKING_YEARMONTH', WORKING_YEARMONTH);
		var perprogress = new Progress();
		var subjectUserCount = $("#subjectCount").val();
		//임시 하드코딩
//		cidYear = "2016";
//		cidMonth = "02";
//		var WORKING_YEARMONTH = cidYear + cidMonth;
	 	//alert("cidYear+cidMonth : " +cidYear+cidMonth);
		//monthEnding.selectSubjectUserCount(WORKING_YEARMONTH);
		//alert("대상자 생성전 count : " + subjectUserCount);
		
		console_logs('subjectUserCount', subjectUserCount);
		var msg ="현재 대상자는 " +subjectUserCount + " 명입니다. \n 대상자생성을 진행 하시겠습니까?"; 
		console_logs('msg', msg);
		//var r = confirm(msg);
		//console_logs('r', r);
		if(confirm(msg)) {
			$.ajax({
				type : "POST",
				url : "/monthending/createSubjectUser.do",
				data : {
						"WORKING_YEARMONTH" : WORKING_YEARMONTH
				},
				dataType : 'json',
				success : function(result) {
					var html = "";
					var temp_class = "class='tr-case1'";
					var map = new Map();
					console_logs('result : ' , result);
					
					//alert("대상자수는 " + result.count + "명 입니다.");
					
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
					monthEnding.searchSubjectUser(workingYear,workingMonth);
					alert("대상자 생성 완료.");
					location.reload();
				}
			});
		}
	},
	
//	selectSubjectUserCount: function(WORKING_YEARMONTH){
//		var perprogress = new Progress();
//
//			$.ajax({
//				type : "POST",
//				url : "/monthending/selectSubjectUserCount.do",
//				data : {
//						"WORKING_YEARMONTH" : WORKING_YEARMONTH
//				},
//				dataType : 'json',
//				success : function(result) {
//					var html = "";
//					var temp_class = "class='tr-case1'";
//					var map = new Map();
//					console_logs('result.count : ' , result.count);
//					$("#subjectCount").val(result.count);
//					
//				},
//				error : function(x, t, e){
//					handleErrorMessage(x, t, e);
//				},
//				beforeSend : function() {
//					perprogress.show();
//				},
//				complete : function() {
//					perprogress.hide();
//				}
//			});
//		//}
//	},
	
	//본부,팀 콤보박스 조회
	com_team: function(comboNum) {
			
			var highOrgId = "";
			var listObj;
			
			if(Number(comboNum) == 1) {
				//highOrgId = "10110003"; 기존 RCIS 
				highOrgId = "10001259";
			}
			else {
				highOrgId = $("#com_org_lv"+(comboNum-1)).val();
			}
			
			
			for (var i=comboNum; i<4; i++){
				elementName = "com_org_lv" + i;
				
				listObj = document.getElementById(elementName);
				if(listObj!=null) {
					listObj.options.length = 0;
					if(i == 1 || highOrgId == "10001259") //if(i == 1 || highOrgId == "10110003") 기존 RCIS 
						listObj.add(new Option("전체", "%"));
					else
						listObj.add(new Option("-", "%"));
				}
				
			}
			
			elementName = "com_org_lv" + comboNum;
			
			var url = ''; //  "/basicquery/teamCombo.do"; //사용 안함.
			var data = {}; //  {"highOrgId":highOrgId}; //사용안함.
			
//			console_logs('comboNum', comboNum);
//			console_logs('highOrgId', highOrgId);
			
			switch(comboNum) {
			case 1:
				url =  "/basicquery/orgBonbuCombo.do"; 
				data =  {};
				break;
			case 2:
				url =  "/basicquery/orgTeamCombo.do"; 
				data =  {"bonbuOrgId":highOrgId};
				break;
			}
			if(comboNum==0) {
				//url = 
			}
				
			console_logs('elementName', elementName);
			/* 조회조건이 전체가 아닐경우에만 조회 */
			if(highOrgId != "%") {
				$.ajax({
					type: "POST",
					url: url,
					data: data,
					dataType : 'json',
					success:function(result){

						listObj = document.getElementById(elementName);

						listObj.options.length = 0;

						if(result != null) {
							if(result.data.length == 0) {
								if	(comboNum == 1)
									listObj.add(new Option("전체", "%"));
								else
									listObj.add(new Option("-", "%"));
									return;
							}
							if	(comboNum == 1)
								listObj.add(new Option("전체", "%"));
							else
								listObj.add(new Option("-", "%"));
							
							$(result.data).each(function(i) {
								listObj.add(new Option(this.orgDesc, this.orgId));
							});
						}
						else {
							listObj.add(new Option("조회 데이터 없음", ""));
						}

					},
					error:function() {
						alert("데이터 통신간 문제가 발생하였습니다.");

						var listObj;

						listObj = document.getElementById(elementName);
						listObj.options.length = 0;				
						listObj.add(new Option("조회 데이터 없음", ""));
					}
				});
			}
			else {
				for (var i=comboNum; i<4; i++){
					elementName = "com_org_lv" + i;
					
					listObj = document.getElementById(elementName);
					listObj.options.length = 0;
					listObj.add(new Option("전체", "%"));
				}
			}
		},
		
		
		refreshMailModal : function(userId){
			$("input.knob").val("0");
			$("input.knob").trigger('change');
			$("#mailToAbs").empty();
	       	$("#mailSubject").empty();
	       	$("#mailContent").empty();
	       	$("#receiverQty").empty();
	       	$('#btnSendmailConfirm').prop('disabled', false);
		
		},
		//대상자 삭제
		deleteSubjectUser: function() {
			$("#noInputDeleteId").val();
			if(!$("input[name=chs]").is(":checked")) {
				alert("대상을 선택해주세요.");
				return;
			}else {
				if(confirm("삭제하시겠습니까?")) {
					//console_logs('폼 : ',$("form[name='subjectUserForm']").serialize());
					var f = document.subjectUserForm;
					f.method = "POST";
					f.action = "/monthending/deleteSubjectUser.do";
					f.submit();
				}
			}
		},
		//전체 대상자 조회할때 m2_month_ending 테이블 normal_cnt 컬럼에 전체대상자 조회수 update
		updateTotalSubjectUser: function(totalCount) {
			/*var f = document.subjectUserForm;
				
			f.method = "POST";
			f.action = "/monthending/updateTotalSubjectUser.do";
			f.submit();*/
			
			$.ajax({
				type : "POST",
				url : "/monthending/updateTotalSubjectUser.do",
				data : {
						"WORKING_YEARMONTH" : WORKING_YEARMONTH,
						"totalCount" : totalCount
						
				},
				dataType : 'json',
				success : function(result) {
					var html = "";
					var temp_class = "class='tr-case1'";
					var map = new Map();
					console_logs('result : ' , result);
					
					
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				},
				beforeSend : function() {
				},
				complete : function() {
					alert("대상자 수정 완료.");
				}
				
			});
		},
		//미입력자 대행자처리
		insertRegistrar: function(tYear,tMonth,userId,registrarer){
			//alert("tYear : " + tYear + "  tMonth : " + tMonth + "  userId : " + userId + "  registrarer : " + registrarer);
			var perprogress = new Progress();
			$.ajax({
				type : "POST",
				url : "/research/checkRegistrarInsert.do",
				data : {
					 "tYear" : tYear
					,"tMonth" : tMonth
					,"userId" : userId
					,"registrarer" : registrarer
				},
				dataType : 'json',
				success : function(result) {
					if (result.success) { 
						$("#userId").val(userId);
						var f = document.subjectUserForm;
						f.method = "POST";
						f.action = "/research/insertRegistrar.do";
						f.submit();
					} else {
						alert("해당월에 이미 대행자를 지정하셨습니다. \n삭제 후 재지정 또는 수정해야 합니다.");
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
	
		},
		//마감테이블 상태값 update
		updateMonthEndingState: function(endingName){
			var perprogress = new Progress();
			var subjectUserCount = $("#subjectCount").val();
			var confirmMsg = "";
			var completeMsg = "";
			if(endingName == "INPUT_END"){
				confirmMsg = "이번달 마감을 완료하고 사용자에게 다음달 입력을 허용합니다. 이작업은 취소할수 없습니다. 계속하시겠습니까? ";
				completeMsg= "입력마감 완료.";
			}
				if(confirm(confirmMsg)) {
					$.ajax({
						type : "POST",
						url : "/monthending/updateMonthEndingState.do",
						data : {
								"endingName" : endingName
								,"userId" : USER_ID
								,"workingYearmonth" :WORKING_YEARMONTH
						},
						dataType : 'json',
						success : function(result) {
							var map = new Map();
							//console_logs('result : ' , result);
						},
						error : function(x, t, e){
							handleErrorMessage(x, t, e);
						},
						beforeSend : function() {
							perprogress.show();
						},
						complete : function() {
							perprogress.hide();
							//monthEnding.searchSubjectUser(workingYear,workingMonth);
							alert(completeMsg);
							location.reload();
						}
					});
				}
			},
			
		sendForErp: function(endingName){
			var perprogress = new Progress();
			
				if(confirm("ERP로 전송을 시작합니다. 이작업은 취소할 수 없습니다. 진행하시겠습니까?")) {
					$.ajax({
						type : "POST",
						url : "/monthending/sendForErp.do",
						data : {
								"workingYearmonth" :WORKING_YEARMONTH
						},
						dataType : 'json',
						success : function(result) {
							var map = new Map();
							//console_logs('result : ' , result);
						},
						error : function(x, t, e){
							handleErrorMessage(x, t, e);
						},
						beforeSend : function() {
							perprogress.show();
						},
						complete : function() {
							perprogress.hide();
							//monthEnding.searchSubjectUser(workingYear,workingMonth);
							alert("전송 완료.");
							location.reload();
						}
					});
				}
			},
		startInput: function(endingName){
			if($("#totalizeSuccessYN").val() != "Y"){
				alert("집계데이터생성 후 진행하실 수 있습니다.");
				return;
			}
			var perprogress = new Progress();
			if(workingMonth == '12'){
				workingMonth = parseInt(workingMonth) - 11;
				workingYear = parseInt(workingYear) +1;
			}else{
				workingMonth = parseInt(workingMonth) + 1;
							 
			}
		 	if(workingMonth < 10){
				workingMonth = "0"+workingMonth;
			}
		 	var nextMonthEnding = workingYear + workingMonth;
				if(confirm("이번달 마감을 완료하고 사용자에게 다음달 입력을 허용합니다. 이작업은 취소할수 없습니다. 계속하시겠습니까? ")) {
					$.ajax({
						type : "POST",
						url : "/monthending/startInput.do",
						data : {
								"workingYearmonth" : nextMonthEnding,
								"endingName" : endingName
						},
						dataType : 'json',
						success : function(result) {
							var map = new Map();
							//console_logs('result : ' , result);
						},
						error : function(x, t, e){
							handleErrorMessage(x, t, e);
						},
						beforeSend : function() {
							perprogress.show();
						},
						complete : function() {
							perprogress.hide();
							//monthEnding.searchSubjectUser(workingYear,workingMonth);
							alert("마감종료. 다음달 입력을 시작합니다.");
							location.reload();
						}
					});
				}
			},
		//마감이력 검색
		searchMonthEndingHistory : function(){
			var selectedYear = $('#tYear').val();
			var perprogress = new Progress();
			$.ajax({
				type : "POST",
				url : "/monthending/searchMonthEndingHistory.do",
				data : {
					"workingYear": selectedYear+"%"
				},
				dataType : 'json',
				success : function(result) {
					
					var html = "";
					var temp_class = "class='tr-case1'";
					var map = new Map();
					//상태값
					if (result.success) {
						var preJobStartDate = "";
						$(result.list).each(function(index) {
								var endingYear = (this.endingMonth).substr(0,4);
								var endingMonth = (this.endingMonth).substr(5,2);
								var endingState = "";
								
								if(this.state == "WORKING"){
									endingState = "작업";
								}else if(this.state == "INPUT_END"){
									endingState = "마감";
								}else if(this.state =="FINISHED"){
									endingState = "마감종료";
								}
								html +="<tr " + temp_class + " >";
								html +="	<td class='txt-center'>"+endingYear+"년 " + endingMonth + "월" + "</td>";																	//마감월
								html +="	<td title='"+this.state+"' class='txt-center'>"+endingState+ ' (' + this.state +")</td>";																//마감상태
								html +="	<td class='txt-center' title='" + this.performerId + "'>"+ this.performerName + ' ' + this.performerPosition +"</td>";   		//마감수행자
								html +="	<td title='"+linkName(this.created)+"' class='txt-center'>"+linkName(this.created)+"</td>";																		//마감시작시간
								html +="	<td title='"+linkName(this.endingDate)+"' class='txt-center'>"+linkName(this.endingDate)+"</td>";																		//마감완료시간
								html +="	<td title='"+this.erpResult+"' class='txt-left' >"+this.erpResult+"</td>";																					//ERP전송결과	
								html +="	<td  class='txt-left' title='"+ this.sendMailResult+ "' >"+this.sendMailResult+"</td>";  										//메일전송  결과 
								html +="	<td class='txt-right'>"+linkName(this.normalCnt)+"</td>";																		//총 대상자수
								html +="	<td class='txt-right'>"+linkName(this.notInputCnt)  +"</td>";																	//미입력																					
								html +="	<td class='txt-right'>"+ linkName(this.abnormalCnt) +"</td>";																	//미승인건수																				
								html +="	<td class='txt-right'>"+linkName(this.tryCnt)+"</td>";																			//대행입력건수	
								//html +="	<td colspan=2 rowspan=3 style='padding:0px;'><div style='background:#F0F0F0;overflow-y:scroll; width:100%;height:141px;'>"+linkName(this.totalize)+"</div></td>";		//집계데이타생성결과
								html += "	<td class='txt-center'> <a href=javascript:MemoViewMonthEndingDataSearchTable('" + this.id + "') >"+ '조회'+"</a></td>";   // 8.프로젝트
								html +="</tr>";

						});		
					}  
					/*상세화면에 붙이기 */
					$("#inD1 > tbody").html(html);
					
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
				}
			});	
		}
			
	
}