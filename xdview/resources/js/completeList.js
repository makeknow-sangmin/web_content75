/**************************************************************************************
 * <pre> 
 * PackageName : com.mobis.rhms.web
 * FileName    : completeList.js
 * </pre>
 * @Title		: 완료함(연구원/비연구원 사원,팀장)
 * @Description : 완료함 js
 * @Version     : 
 * @Author      : Copyright(C) HAE - 이신호
 * @Date        : 2015.11.23
**************************************************************************************/

	//공유체크
	function selectShareCheck (o, researchId) {
		console_logs('checkbox o', o);
		console_logs('checkbox o.checked', o.checked);
		console_logs('researchId', researchId);
		var share_flag;
		if(o.checked == true) {
			share_flag = 'T';
		} else {
			share_flag = 'F';
		}
		
		$.ajax({			
			type : "POST",
			url : "/approval/changeShareFlag.do",
			data : { 
				"researchId": researchId, 
				"share_flag": share_flag
				},
			dataType : 'json',
			success : function(result) {
				
				console_logs('result', result);
				
				if(result.share_flag == 'T') {
					alert('선택한 투입정보를 다른 팀원과 공유하였습니다.');		
				} else {
					alert('선택한 투입정보에 대하여 공유를 해제 하였습니다.');
				}
				
				
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			},
			beforeSend : function() {
				//progress.show();
			},
			complete : function() {
				//progress.hide();				
			}
	
		});
	}
	
// 완료함 js파일
var complete = {
		// 리서치 헤더 검색 start
		selectResearchheader: function() {
		var progress = new Progress();
		var totalCount = 0;
		var tt = $("#tYearCom").val();
		var pageSize   = 10;
		$.ajax({			
			type : "POST",
			url : "/approval/comListResearch.do",
			data : {  "tYearCom": $("#tYearCom").val(), 
						"page": $("#page_R").val() 
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
						
						console_logs('/approval/comListResearch.do vo', this);
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
							
							html_R +="<tr " + temp_class + " onclick='complete.selectResearchheaderde(this)'>";
							html_R += "	<td style=display:none;>"+linkName(this.id)+"</td>";// research_id
							html_R += "	<td class='txt-center'>"+linkName(this.jobday)+"</td>";	//1. 작성월
					

							html_R += "	<td class='txt-center'><input type=checkbox ";
							
							if( this.share_flag == 'T') {
								html_R += " checked ";
							}
							
							html_R += " onClick=\"selectShareCheck(this, "+ this.id + ")\" /></td>";	//1. 작성월
							
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
							 
							
						});					
				}  
				
				if ( html_R == "" ){
					html_R = "<tr><td class='txt-center' colspan='11'>현재 결재완료된 프로젝트가 없습니다.</td></tr>";
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
	selectResearchheaderde: function(o) {
		
	if(o != null){
			var researchId = o.children[0].innerHTML;
		}
		var researchYN =  $("#researchYN").val();
				
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
							html_R += "	<td class='txt-center'>"+sunYang+"</td>";//6.선행/양산
							html_R += "	<td class='txt-left' title='" +linkName(this.modelName)+ "'>"+linkName(this.modelName)+"</td>";//4.차종
							html_R += "	<td class='txt-right'>"+ratio+"%</td>";//6.ratio
							html_R += "	<td class='txt-left' title='" +linkName(this.productDivName1)+ "'>"+linkName(this.productDivName1)+"</td>";//5.제품L1
							html_R += "	<td class='txt-left' title='" +linkName(this.productDivName2)+ "'>"+linkName(this.productDivName2)+"</td>";//6.제품L2
							html_R += "	<td class='txt-left' title='" +linkName(this.productDivName3)+ "'>"+linkName(this.productDivName3)+"</td>";//6.제품L3
							html_R += "	<td class='txt-left' title='" +linkName(this.techDivName1)+ "'>"+linkName(this.techDivName1)+"</td>";//5.기술L1
							html_R += "	<td class='txt-left' title='" +linkName(this.techDivName2)+ "'>"+linkName(this.techDivName2)+"</td>";//6.기술L2
							html_R += "	<td class='txt-left' title='" +linkName(this.techDivName3)+ "'>"+linkName(this.techDivName3)+"</td>";//6.기술L3
							html_R += "	<td class='txt-left' title='" +linkName(this.taskDivName1)+ "'>"+linkName(this.taskDivName1)+"</td>";//5.taskL1
							html_R += "	<td class='txt-left' title='" +linkName(this.taskDivName2)+ "'>"+linkName(this.taskDivName2)+"</td>";//6.taskL2
							html_R += "	<td class='txt-left' title='" +linkName(this.taskDivName3)+ "'>"+linkName(this.taskDivName3)+"</td>";//6.taskL3
							
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
	selectResearchDisable: function() {
		var html_R = "";
		$("#research > tbody").html(html_R);
		
	},
	selectResearchheaderdeDisable: function() {
		var html_R = "";
		$("#research > tbody").html(html_R);
		
	}
};
