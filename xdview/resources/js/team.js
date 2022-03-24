//팀별 현황 조회
var team = {
// 사용자리스트
usergetlist: function(teamid, target, callback) {
	//console_logs("teamid", teamid);
			$.ajax({
				type : "POST",
				url : "/jikmucode/json/userlist.do",
				data : { "teamid": teamid },
				dataType : 'json',
				async: team.asyncYN,
				success : function(result) {
				
					var html = "";
					if (result.success) {
						if(result.data.length>0) html += "<option value=''>선택</option>";
						$(result.data).each(function(i) {
							html += "<option value='"+this.userid+"'>"+this.username+"</option>";
						});
					}
					
					$("#"+target).html(html);
					
					if(html != "" && callback != null && callback != 'undefined') {
						callback.call();
					}
					
				},
				beforeSend : function() {
					//jikmu.clear(target);
					
				},
				complete : function() {
					//hideSelectBox();
					
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		},
		
		usergetlist2: function(teamid, target, callback, userid) {
	//console_logs("teamid", teamid);
			$.ajax({
				type : "POST",
				url : "/jikmucode/json/userlist.do",
				data : { "teamid": teamid },
				dataType : 'json',
				async: team.asyncYN,
				success : function(result) {
				
					var html = "";
					if (result.success) {
						$(result.data).each(function(i) {	
							if(this.userid==userid){
							}
							else{
							html += "<option value='"+this.userid+"'>"+this.username+"</option>";
							}
						});
					}
					
					$("#"+target).html(html);
					
					/*if(html != "" && callback != null && callback != 'undefined') {
						callback.call();
					}*/
					
				},
				beforeSend : function() {
					//jikmu.clear(target);
					
				},
				complete : function() {
					//hideSelectBox();
					
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		},
		
		//  프로젝트별 투입현황
		selectTeamheader: function(user_orgId, s_term) {
			var perprogress = new perProgress();
			
			$.ajax({
				type : "POST",
			
				url : "/research/TeamProlist.do",
				data : {
					"user_orgId": user_orgId,
					"s_term": s_term
					
				},
				dataType : 'json',
				success : function(result) {
					//console_logs("user_orgId1", user_orgId);
					console_logs("s_term", s_term);
					
					var html_J = "";
					var html_R = "";
					var preJobStartDate = "";
					var jikmuGubun = "";

					var period = "";
					var temp_class = "class='tr-case1'";
					 
					var map = new Map();
					if (result.success) {
						
						var preJobStartDate = "";
						
			
						
						var total = 0;
						 var is_total =0;
						 var gongsu =0;
						 
						 var is_gongsu = 0;
						 var humancost = 0;
						 var is_humancost = 0;
						$(result.list).each(function(index) { 
							total = this.value1;
							gongsu = this.value2;
							humancost = this.value3;
							is_total = total + is_total;
							is_gongsu = gongsu + is_gongsu;
							is_humancost = humancost + is_humancost;
						}); 
						
					
					
						
						var isgong = parseFloat(parseFloat(is_gongsu).toFixed(1));
						
						var ishuman = parseFloat(parseFloat(is_humancost).toFixed(1));
						ishuman = ishuman/1000000
						var tohuman = parseFloat(parseFloat(ishuman).toFixed(1));
					
						$(result.list).each(function(index) {	
								///////////////
								// 헤더검색
								///////////////
							var model = this.dim03_name;
								if(model == "NULL"){
									model = '-';
									}
								var product = this.dim06_name;
								if(product == "NULL"){
									product = '-';
									}
								
						
								//프로젝트 목록
								html_R +="<tr " + temp_class + " >";
								//html_R += "	<td style=display:none;>"+linkName(this.pmscode)+"</td>";//7. research_id
								html_R += "	<td class='txt-center' >"+linkName(this.dim07_name)+"</td>";	//1. 선행/양산
								html_R += "	<td class='txt-left' title='" +linkName(this.dim03_name)+ "'>"+model+"</td>";	//2. 차종
								html_R += "	<td class='txt-center'>"+linkName(this.dim10_code)+"</td>";	//3. 프로젝트코드
								html_R += "	<td class='txt-left' title='" +linkName(this.dim10_name)+ "'>"+linkName(this.dim10_name)+"</td>";//4.프로젝트네임
								html_R += "	<td class='txt-left' title='" +linkName(this.dim06_name)+ "'>"+product+"</td>";//7.제품
								html_R += "	<td class='txt-right'>"+linkName(this.value1)+"</td>";//7.인원수
								
								var gong = parseFloat(parseFloat(this.value2).toFixed(1));
								html_R += "	<td class='txt-right'>"+gong+"</td>";//7.공수
							
								var human = parseFloat(parseFloat(this.value3).toFixed(1));
								var is_human = parseFloat(parseFloat(human/1000000).toFixed(1));
								html_R += "	<td class='txt-right'>"+is_human+"</td>";	// 인건비
								

								html_R += "</tr>";
								 
								$("#istotal").html(is_total);
								$("#gongsu").html(isgong);
								$("#humancost").html(tohuman);
							});					
					}  
					
					if ( html_R == "" ){
						html_R = "<tr><td class='txt-center' colspan='11'>현재 진행 중인 프로젝트가 없습니다.</td></tr>";
					}
					
					/* 연구 */
					$("#TeamList > tbody").html(html_R);
					
				
					
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				},
				beforeSend : function() {
					perprogress.show();
				},
				complete : function() {
					perprogress.hide();				

					tableScrollling("divHeader1", "divContent1", "TeamList");
				}
			});
			
		},	
	// 리서치 헤더 검색 end	
	// 연구원/비연구원 상세정보 검색 start	
		selectProjectListDetail: function(user_orgId, s_term) {

			var perprogress = new perProgress();

			$.ajax({
				type : "POST",
				url : "/research/TeamProlistde.do",
				data : {
					"user_orgId": user_orgId,
					"s_term": s_term
				},
				dataType : 'json',
				success : function(result) {
					
					var html_J = "";
					var html_R = "";
					var preJobStartDate = "";
					var jikmuGubun = "";

					var period = "";
					var temp_class = "class='tr-case1'";
					var tot = 0;
					var is_tot=0;
					var pre = 0;
					var is_pre = 0;
					var mass = 0;
					var is_mass= 0;
					var common = 0;
					var is_common = 0;
					var etc = 0;
					var is_etc=0;
					 
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
								
									html_R +="<tr " + temp_class + ">";
									
									html_R += "	<td class='txt-center'>"+linkName(this.dim11_name)+"</td>";	//1. 직급
									html_R += "	<td class='txt-center'>"+linkName(this.dim09_name)+"</td>";	//1. 이름
									var inittot =  this.value1+this.value2+this.value3+this.value4;
									tot = parseFloat(parseFloat(this.value1+this.value2+this.value3+this.value4).toFixed(1));
									console_logs("tot", tot);
									var tot1111 = parseFloat(parseFloat(inittot).toFixed(1));
									console_logs("tot1111", tot1111);
									html_R += "	<td class='txt-right'>"+tot+"</td>";	//1. 합계
									 pre = parseFloat(parseFloat(this.value1).toFixed(1));
									 
									 //console_logs("pre1",this.value1);
									// console_logs("pre2", pre);
									 
									html_R += "	<td class='txt-right'>"+pre+"</td>";	//1. 선행
									 mass = parseFloat(parseFloat(this.value2).toFixed(1));
									html_R += "	<td class='txt-right'>"+ mass+"</td>";	//2. 양산
									 etc = parseFloat(parseFloat(this.value3).toFixed(1));
									html_R += "	<td class='txt-right'>"+etc+"</td>";	//2. 기타
									 common = parseFloat(parseFloat(this.value4).toFixed(1));
									html_R += "	<td class='txt-right'>"+common+"</td>";	//2.공통
									
								//html_R += "	<td class='txt-right'>"+ projectSumRatio;	//7. 투입비율				 
								//html_R += "%</td>";

								html_R += "</tr>";
								 is_tot = is_tot+tot
								 total_tot = parseFloat(parseFloat(is_tot).toFixed(1));
								 is_pre = is_pre+pre
								 total_pre = parseFloat(parseFloat(is_pre).toFixed(1));
								
								 is_mass = is_mass+mass;
								 total_mass = parseFloat(parseFloat(is_mass).toFixed(1));
								 
								
								 is_etc = is_etc+etc;
								 total_etc = parseFloat(parseFloat(is_etc).toFixed(1));
								
								 is_common = is_common+common
								 total_common = parseFloat(parseFloat(is_common).toFixed(1));
								 $("#total").html(total_tot);
								 $("#pre").html(total_pre);
								 $("#mass").html(total_mass);
								 $("#common").html(total_etc);
								 $("#etc").html(total_common);
							});		
					}  
					
					if ( html_R == "" ){
						html_R = "<tr><td class='txt-center' colspan='11'>현재 진행 중인 프로젝트가 없습니다.</td></tr>";
					}				
					
					/*상세화면에 붙이기 */
					$("#inD1 > tbody").html(html_R);
					
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				},
				beforeSend : function() {
					perprogress.show();
				},
				complete : function() {
					perprogress.hide();
					
					tableScrollling("divHeader1", "divContent1", "inD1");
				}
			});		
		},
		// 개인별 투입현황 end
		
		selectResearchDisable: function() {
			var html_R = "";
			$("#TeamList > tbody").html(html_R);
		},
		selectResearchDisablede: function() {
			var html_R = "";
			$("#inD1 > tbody").html(html_R);
		}
	

	}

