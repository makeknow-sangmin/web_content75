/**************************************************************************************
 *  
 * PackageName : resources/js
 * FileName    : research2.js
 * 
 * @Title		: 기안함 js
 * @Description : 기안함 및 프로젝트 경력관리-상신 js
 * @Version     : 
 * @Author      : 오영재
 * @Date        : 2015.11.19
**************************************************************************************/		
// 기안함 js파일
var progress = {
// 리서치 헤더 검색 start
		ProgressList: function(aYear_pc) {
		var researchYN =  $("#researchYN").val();
		var progress = new Progress();
		$.ajax({
			type : "POST",
			//url : "/approval/progressListJikmu.do",
			url : "/approval/progressList.do",
			data : {
				"aYear_pc": aYear_pc
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
							///////////////
							// 헤더검색
							///////////////
							if ( preJobStartDate != this.jobStartDate ){
								//alert(preJobStartDate);
								if (  temp_class == "class='tr-case1'"){
									temp_class = "class='codeDetailChkbox'";
								}else{
									temp_class = "class='tr-case1'";
								}
							}
							
							console_logs("dd", this);
							
							html_R +="<tr " + temp_class + " onclick='progress.ProgressListde(this)'>";
							html_R += "	<td style=display:none;>"+linkName(this.id)+"</td>";// research_id
							html_R += "   <td class='txt-center'  >";
							html_R += "   	<input type='checkbox' name='reAppId' ' value='"+this.id+"' />";   
							html_R += "   </td>";    //체크박스
							html_R += "	<td class='txt-center'>"+linkName(this.jobday)+"</td>";	//2. 작성월
							html_R += "	<td class='txt-right'>"+linkName(this.cntg)+"</td>";	//2. 일반 / 건수
							html_R += "	<td class='txt-right'>"+linkName(this.jobtimeg)+"</td>";// 일반 /투입비중
							html_R += "	<td class='txt-right'>"+linkName(this.cntc)+"</td>";// 공통 / 건수
							html_R += "	<td class='txt-right'>"+linkName(this.jobtimec)+"</td>";// 공통 / 투입비중
							if(this.appMemo == ""){  
								html_R += "	<td class='txt-center'>"+ "-" + "</a></td>";
							} else {
								html_R += "	<td class='txt-center'> <a href=javascript:MemoViewApproval('" + this.id + "','"+ this.weeklyJobStartDate +"') >"+ '상신 메모'+"</a></td>";   // 8.프로젝트
							}
							html_R += "</tr>";
							
							 
							preJobStartDate = this.weeklyJobStartDate;
						});					
				}  
				
				if ( html_R == "" ){
					html_R = "<tr><td class='txt-center' colspan='11'>현재 상신 중인 프로젝트가 없습니다.</td></tr>";
				}
				
				/* 연구 */
				$("#research_header > tbody").html(html_R);
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			},
			beforeSend : function() {
				progress.show();
			},
			complete : function() {
				progress.hide();				

				tableScrollling("divHeader1", "divContent1", "research");
			}
		});
		
	},	
// 리서치 헤더 검색 end	
// 연구원/비연구원 상세정보 검색 start	
	ProgressListde: function(o) {

	if(o != null){
			var researchId = o.children[0].innerHTML;
		}
		var researchYN =  $("#researchYN").val();
		//var researchYN =  true;
		
		var progress = new Progress();
		$.ajax({
			type : "POST",
			url : "/approval/progressListde.do",
			data : {
				"researchId": researchId
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

						
						if ( preJobStartDate != this.jobStartDate ){ 
								if (  temp_class == "class='tr-case1'"){
									temp_class = "class='codeDetailChkbox'";
								}else{
									temp_class = "class='tr-case1'";
								}
							}
							//프로젝트 코드가 'N00000'인경우 구분=공통, 그외 = 일반
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
							var ratio = this.ratio;
							///////////////
							// 연구원
							///////////////							
							if ( researchYN == 'Y'){ 
							html_R +="<tr " + temp_class + ">";
							html_R += "	<td class='txt-center'>"+gubun+"</td>";	//2. 구분
							html_R += "	<td class='txt-center'>"+linkName(this.pmscode)+"</td>";	//2. 프로젝트 코드
							 
							html_R += "	<td class='txt-left' title='" +linkName(this.title)+ "'>"+linkName(this.title)+"</td>";//4.프로젝트 네임
							html_R += "	<td class='txt-center'>"+linkName(this.wbs4Code)+"</td>";//5.wbs 코드
							html_R += "	<td class='txt-left' title='" +linkName(this.wbs4Name)+ "'>"+linkName(this.wbs4Name)+"</td>";//4.wbs 네임
							//html_R += "	<td class='txt-center'>"+linkName(this.productDivName2)+"</td>";//5.wbs 상태
							html_R += "	<td class='txt-center'>"+sunYang+"</td>";//6.선행/양산
							html_R += "	<td class='txt-left' title='" +linkName(this.modelName)+ "'>"+linkName(this.modelName)+"</td>";//4.차종
							html_R += "	<td class='txt-right'>"+ratio+"%</td>";//6.ratio
							html_R += "	<td class='txt-left' title='" +linkName(this.productDivName1)+ "'>"+linkName(this.productDivName1)+"</td>";//5.제품L1
							html_R += "	<td class='txt-left' title='" +linkName(this.productDivName2)+ "'>"+linkName(this.productDivName2)+"</td>";//6.제품L2
							html_R += "	<td class='txt-left' title='" +linkName(this.productDivName3)+ "'>"+linkName(this.productDivName3)+"</td>";//6.제품L3
							html_R += "	<td class='txt-left' title='" +linkName(this.techDivName1)+ "'>"+linkName(this.techDivName1)+"</td>";//6.기술분류1
							html_R += "	<td class='txt-left' title='" +linkName(this.techDivName2)+ "'>"+linkName(this.techDivName2)+"</td>";//6.기술분류2
							html_R += "	<td class='txt-left' title='" +linkName(this.techDivName3)+ "'>"+linkName(this.techDivName3)+"</td>";//6.기술분류3
							html_R += "	<td class='txt-left' title='" +linkName(this.taskDivName1)+ "'>"+linkName(this.taskDivName1)+"</td>";//6.task분류1
							html_R += "	<td class='txt-left' title='" +linkName(this.taskDivName2)+ "'>"+linkName(this.taskDivName2)+"</td>";//6.task분류2
							html_R += "	<td class='txt-left' title='" +linkName(this.taskDivName3)+ "'>"+linkName(this.taskDivName3)+"</td>";//6.task분류3
							
							if(this.detailmemo == ""){  
									html_R += "	<td class='txt-center'>"+ "-" + "</a></td>";
								} else {
									html_R += "	<td class='txt-center'> <a href=javascript:MemoViewDetail('" + this.id + "') >"+ '조회'+"</a></td>";   // 8.프로젝트
								}	
							
							html_R += "</tr>";
							 
							preJobStartDate = this.weeklyJobStartDate;							
							}
							///////////////
							// 비연구원
							///////////////	
							else{
								html_R +="<tr " + temp_class + ">";
								html_R += "	<td class='txt-center'>"+gubun+"</td>";	//2. 구분
								html_R += "	<td class='txt-center'>"+linkName(this.pmscode)+"</td>";	//2. 프로젝트 코드
								html_R += "	<td class='txt-left' title='" +linkName(this.title)+ "'>"+linkName(this.title)+"</td>";//4.프로젝트 네임
								html_R += "	<td class='txt-center'>"+sunYang+"</td>";//6.선행/양산
								html_R += "	<td class='txt-left' title='" +linkName(this.modelName)+ "'>"+linkName(this.modelName)+"</td>";//4.차종
								html_R += "	<td class='txt-right'>"+ratio+"%</td>";//6.ratio
								html_R += "	<td class='txt-left' title='" +linkName(this.productDivName1)+ "'>"+linkName(this.productDivName1)+"</td>";//5.제품L1
								html_R += "	<td class='txt-left' title='" +linkName(this.productDivName2)+ "'>"+linkName(this.productDivName2)+"</td>";//6.제품L2
								html_R += "	<td class='txt-left' title='" +linkName(this.productDivName3)+ "'>"+linkName(this.productDivName3)+"</td>";//6.제품L3
								html_R += "</tr>";
								 
								preJobStartDate = this.weeklyJobStartDate;										
							}
						});		
				}  
				
				if ( html_R == "" ){
					html_R = "<tr><td class='txt-center' colspan='11'>상세 내용을 확인하려면 프로젝트를 선택해주세요</td></tr>";
				}				
				
				/*상세화면에 붙이기 */
				$("#research > tbody").html(html_R);
				
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			},
			beforeSend : function() {
				progress.show();
			},
			complete : function() {
				progress.hide();
				
				tableScrollling("divHeader1", "divContent1", "research");
			}
		});		
	},
	// 연구원/비연구원 상세정보 검색 end
	
	ProgressListDisable: function() {
		var html_R = "";
		$("#research > tbody").html(html_R);
	},
	// 상신 
	submitapproval: function() {

		
		var progress = new Progress();
		progress.show();
			var f = document.pjtListForm;
			var tYearapp = $("#tYear").val();
			var tMonthapp = $("#tMonth").val();
			var yearVal = $("#targetYearApp").val(tYearapp);
			var monthVal = $("#targetMonthApp").val(tMonthapp);
			var ss = $("#targetYearApp").val(tYearapp);
			
			console_logs('f', f);
			
			var tablePostteamid = $("#tablePostteamid").val();
			console_logs('tablePostteamid', tablePostteamid);
			f.postteamid.value = tablePostteamid;
			f.targetYearApp.val = tYearapp;
			f.targetMonthApp.val = monthVal;
			f.method = "POST";
			f.action = "/approval/submitapproval.do";
			f.submit();
	
	},
	// 상신 modal 결재자 정보 조회
	approverList: function(targetId) {
		var progress = new Progress();
		var postteamid=$("#tablePostteamid").val();
		console_logs("modat_teamid", postteamid);
		$.ajax({
			type : "POST",
			url : "/approval/approver/list.do",
			data : {
				"teamid": $("#tablePostteamid").val()
			},
			dataType : 'json',
			success : function(result) {
				var html = "";
				
				if (result.success) {
				
					console_logs('result.data', result.data);
					
					if(result.data.length==0) {
						alert('결재자 정보를 확인할 수 없습니다. 시스템 운영자에게 문의하세요.');
					} else {
					
						$(result.data).each(function(i) {
							console_logs("approver", this.localname);
							if(this.zzijkch != 'B03'){
								html += "<td style=display:none; id=approverId1 >"+this.userId+"</td>";	//결재자 정보
								html += "<td class='txt-center'  value='"+this.userId+"'>대행결재자 : "+this.localname+"</td>";	//결재자 정보
							}else{
								html += "<td style=display:none; id=approverId1 >"+this.userId+"</td>";	//결재자 정보
								html += "<td class='txt-center'  value='"+this.userId+"'>"+this.localname+"</td>";	//결재자 정보
							}//endofelse
						});//endofeach
					
						$("#"+targetId).html(html);
						$("#"+targetId).show();
						
						dialogOpen('submit');
					}

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
	// 상신 취소 
	cancelApprovalSelf: function() {
		if(confirm("상신취소 하시겠습니까?")) {
			var progress = new Progress();
			progress.show();
			
		
			var f = document.ApprovalListForm;
		
			f.method = "POST";
			f.action = "/approval/cancelApp.do";
			f.submit();
		}
		
	},
	// 자가승인 
	submitapprovalSelf: function() {
		if(confirm("승인 하시겠습니까?")) {
			var progress = new Progress();
			progress.show();
			
			var f = document.pjtListForm;
			var tYearapp = $("#tYear").val();
			var tMonthapp = $("#tMonth").val();
			var yearVal = $("#targetYearApp").val(tYearapp);
			var monthVal = $("#targetMonthApp").val(tMonthapp);
			var ss = $("#targetYearApp").val(tYearapp);
			
			f.method = "POST";
			f.targetYearApp.val = tYearapp;
			f.targetMonthApp.val = monthVal;
			f.action = "/approval/submitapprovalSelf.do";
			f.submit();
		}
	},
	
 
	
};
