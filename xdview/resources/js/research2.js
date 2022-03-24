
/**************************************************************************************
 *  
 * PackageName : resources/js
 * FileName    : research2.js
 * 
 * @Title		: 프로젝트 경력관리
 * @Description : 프로젝트 경력관리 js
 * @Version     : 
 * @Author      : YounghoLee
 * @Date        : 2015.11.19
**************************************************************************************/		
// portal.js의 portal과 동일함.
var research2 = {
		
	selectResearchWeeklyList: function() {
		var researchYN=true;	
		var progress = new Progress(); 
		var list_length = 0; 
		var v1 = $("#jobStartDate1");
		var v2 = $("#jobEndDate1");
		
		if(v1==null || v1 == undefined || v2==null || v2 == undefined ||
				v1.val()==null || v1.val()==undefined ||
				v2.val() == null || v2.val()==undefined) 
			{
			return;
			}
		
		$.ajax({
			type : "POST",
			url : "/approval/selectResearchWeeklyList.do",
			data : { 
				"fromDate": $("#jobStartDate1").val().replace(/-/g, '')
			  , "toDate": $("#jobEndDate1").val().replace(/-/g, '')  
			  
			},
			dataType : 'json',
			success : function(result) {
				var html = ""; 
				var preJobStartDate = "";
				var temp_class = "class='tr-case1'";
				if (result.success) {
				    var cntx = 0;
					// RowSpan  변수를 지정
					list_length = result.list.length;
					$(result.list).each(function(index) { 
						
						html +="<tr   >";  
						html += "<td class='txt-center'>"; 
						html += "	 <input type='radio' name='researchWeekly' start='"+this.jobStartDate+"' end='"+this.jobEndDate+"' value='"+this.approvalStatus+"' onClick='checkSortRadio(this)'/>";
						html += "</td>"; 
						      
					    html += "<td class='txt-center'>"+ formatDate(this.jobStartDate,'/')+" ~ "+formatDate(this.jobEndDate,'/') +"</td>";   		// 작업기간 
						
						html += "<td class='txt-center'>"; 
						
						if ( !(this.approvalStatus=="P" || this.approvalStatus=="Y") ){
							html += "  <select  id='researchWeeklyDay_" + this.jobStartDate + "'>"; 
							var workDay =  this.workDay < 0 ? 5 : this.workDay ;
							for(var i=10; i>=0; i--) {
								html += "   <option value='"+(i/2)+"'"+(workDay==(i/2) ? "selected" : "")+">"+(i/2)+"</option>";
							}
							html += "  </select>";
							
						}else{
							html += this.workDay;
						}
						
						html += "  </td>"; 	
						
						html += "<td class='txt-center'>";					
						 
						if(this.approvalStatus=="P") {
							html += "<img src='/resources/images/btn_07.png' alt='진행' />";
						} else if(this.approvalStatus=="Y") {
							html += "<img src='/resources/images/btn_05.png' alt='완료' />";
						} else if(this.approvalStatus=="R") {
							if(this.approvalComment!="") {
								html += "<img src='/resources/images/btn_03.png' alt='반려' title='"+this.approvalComment+"'/>";
							} else {
								html += "<img src='/resources/images/btn_03.png' alt='반려'/>";
							}
						} else {
							html += "<img src='/resources/images/btn_09.png' alt='' />";
						}
                        //html += this.approvalStatus;
						html += " <input type='hidden' id='researchWeeklyApprovalStatus_" + this.jobStartDate + "' value='" + this.approvalStatus + "' >";
						html += " </td>";
						html += "</tr>";
						
						cntx = cntx+1;

					}); 
				} 
				
				$("#research > tbody").html(html);
				
				if(cntx > 1){
					$("#research > tbody").append("<tr><td colspan='4' style='color:red;font-size:15px;font-weight:bold;'>* 미 완료업무가 "+cntx+"건 있습니다.</td></tr>");
				}
				
				// 이벤트 설정
				$("input[name=researchWeekly]").click(function() { 
					var period = ""; 
					period += formatDate($("input:radio[name='researchWeekly']:checked").attr('start'),'/');
					period += " ~ ";
					period += formatDate($("input:radio[name='researchWeekly']:checked").attr('end'),'/'); 
					$("#sum_period").html( period ); 
					
					$("#research tr").removeClass();
					$(this).parent().parent().addClass("select-row");
					research2.selectResearchHistoryWeeklyList();
				});
				
				    
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			},
			beforeSend : function() {
				progress.show();
				
				// 오른쪽화면 초기화
				$("#sum_ratio").html("");
				$("#sum_period").html(""); 
				$("#research_history > tbody").html("");
				
			},
			complete : function() {
				progress.hide();
				tableScrollling("divHeader1", "divContent1", "research");
				 
				if ( list_length > 0 ){
					$("input[name=researchWeekly]").get(0).click();
				}
			}
		});
	},
	
	selectResearchHistoryWeeklyList: function() {
		
		var progress = new Progress();
		$.ajax({
			type : "POST",
			url : "/approval/selectResearchHistoryWeeklyList.do",
			data : { 
				"fromDate": $("input:radio[name='researchWeekly']:checked").attr('start')
			  , "toDate": $("input:radio[name='researchWeekly']:checked").attr('end') 
			  , "approvalStatus": $("#researchWeeklyApprovalStatus_" + $("input:radio[name='researchWeekly']:checked").attr('start') ).val()
			  , "preFromDate" : calDateUpdate2($("input:radio[name='researchWeekly']:checked").attr('start'),-7)
			},
			dataType : 'json',
			success : function(result) {
				var html = "";
				var period = "";
				var preJobStartDate = "";
				var temp_class = "class='tr-case1'";
				var researchSumRation = 0;
				var totalProjectCnt = 0;
				if (result.success) {
				
					// RowSpan  변수를 지정
					var list_length = result.list.length;
					$(result.list).each(function(index) {
						     
							html +="<tr>";
						 
							html += "	<td class='txt-center'>" + ( list_length - index  ) + "</td>"; 

							if(this.nonProjectGb == 'N') {
								html += "<td class='txt-center'>프로젝트</td>";
							}else{
								html += "<td class='txt-center'>비프로젝트</td>"; 
							}
							$("#nonProjectx").val(this.nonProjectGb);
							
							
							html += "<td class='txt-center'>"+ this.workDivName1 + "</td>";
							html += "<td class='txt-center'>"+ this.workDivName2 + "</td>";
							html += "<td class='txt-center'>"+ this.productDivName1 + "</td>";
							html += "<td class='txt-center'>"+ this.productDivName2 + "</td>";
							html += "<td class='txt-center'>"+ this.productDivName3 + "</td>";		
							
							html += "<td class='txt-center'>";				
						    html += "<a href=javascript:research.selectMainListViewApproval('" +this.id+"');>"+this.projectCnt+"</a>";      // 프로젝트 개수
						    html += "</td>";
						   
						    html += "	<td class='txt-center'  > &nbsp; &nbsp; ";
						    var projectSumRatio = 0;
						    var research_id = this.id; 
						    var bHistoryId = true; 
							$(this.researchHistories).each(function(index) {
								//html += "this.projectId	" + this.projectId;
								//html += "this.historyId	" + this.historyId	;
								html += "	 <input type='hidden' name='ratio'       value='"+this.ratio+"'  research_id='R" + research_id+ "'  start='"+this.jobStartDate+"' style='width:25px;' />";
								html += "	 <input type='hidden' name='historyId'  value='"+this.historyId+"' />";
								html += "	 <input type='hidden' name='projectId'  value='"+this.projectId+"' />";
								html += "	 <input type='hidden' name='researchId' value='"+research_id+"' />";
								
								projectSumRatio = parseFloat(parseFloat( projectSumRatio + this.ratio).toFixed(1));
								
								if( this.historyId > 0 ){
									bHistoryId = false;
								}
								 
							});
							
							if ( bHistoryId ){
								projectSumRatio = this.preSumRatio;
							}
							
							//html += "projectSumRatio=" + projectSumRatio;
							//html += "researchSumRation=" + researchSumRation;
							html += "	<input type='text'  name='inpRatio'  value='"+projectSumRatio+"' research_id='" + research_id+ "' projectCnt='" + this.projectCnt+ "'   onkeyup='javascript:research2.changeRatio(this);' style='width:25px;'/>%<br>";
							html += "	</td>";	
							
							html += "</tr>";
							researchSumRation += projectSumRatio;
							$("#sum_ratio").html(Math.round(researchSumRation) + "%");
							//totalProjectCnt += this.projectCnt;
							//fn_consoleLog("totalProjectCnt="+ totalProjectCnt );
						 			
					});
					
				} else {
					html = "<tr><td class='txt-center' colspan='12'>현재 진행 중인 프로젝트가 없습니다.</td></tr>";
				}
				
				$("#research_history > tbody").html(html);
				
				// 투입비율
				var ratioSize = 1;
				if($("input[name=gubun]").val() == "research") {
					ratioSize = 1;
				} else {
					ratioSize = 3;
					$("input[name=inpRatio]").css("height", "16px");
				}
				
				$("input[name=inpRatio]").attr("size", ratioSize)
										 .attr("maxlength", 4)
										 .css({"text-align":"right","ime-mode":"disabled"}) 
										 .numeric({max:100, min:0});
				 
				if($("#nonProjectx").val() != 'N' || $("#checkAuthx").val() == 'AUTH_TEAM_MANAGER' ){
					if($('#checkradio').val() == "y"){
						$("#saveself").attr("style", "background-color:rgb(173,1,5)");
						$("#saveself").removeAttr("disabled");	
					}else{
						$("#saveself").attr("style", "background-color:rgb(133,133,133)");
					}
				}else{
					$("#saveself").attr("style", "background-color:rgb(133,133,133)");
					$("#saveself").attr("disabled","true");	
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
				tableScrollling("divHeader2", "divContent2", "research_history");
				rationValidation();
				//tableScrollling2("divHeader3", "divContent3", "tableId3", "footFix3");
				
			}
		});
	},
		  
	changeRatio: function(obj) {
		rationValidation(); 
	}, 
	// 이력삭제
	deleteHistory: function() {
		if(this.validate() && confirm("삭제 하시겠습니까?")) {
			var progress = new Progress();
			progress.show();
			
			var f = document.saveForm;
			f.method = "POST";
			f.action = "/approval/delete.do";
			f.submit();
		} 
	},

	// 투입비율저장 (일반저장인지 상신을통한 저장인지 check)
	saveHistory: function(approvalYN) {
		if(approvalYN =='N'){
			if(confirm("저장 하시겠습니까?")) {
				if(this.validate3()) {
					var progress = new Progress();
					progress.show();
					$("#deleteTargetUserId").val($("input[name='gubun']:checked").val());
					var f = document.pjtListForm;
					$("input[name='chs']").each(function(){
						$(this).prop("checked",true);
					});
					$("input[name='inpRatio']").each(function(){
						
						console_logs('inpRatio', this);
						if($(this).val() ==null) {
							$(this).val("0");
						}
					});
					
					f.method = "POST";
					f.action = "/approval/save.do";
					f.submit();
				}
			}
		}else if(approvalYN =='Y'){
			if(this.validate2()) {
				var progress = new Progress();
				progress.show();
				$("#userId").val($("input[name='gubun']:checked").val());
				var f = document.pjtListForm;
				$("input[name='chs']").each(function(){
					$(this).prop("checked",true);
				});
				f.method = "POST";
				f.action = "/approval/save.do";
				f.submit();
			}
		}
	},
	
	// 자가승인
	saveHistory2: function() {
		if(this.validate() && confirm("자가승인 하시겠습니까?")) {
			var progress = new Progress();
			progress.show();
			
			var f = document.saveForm;
			f.method = "POST";
			f.action = "/approval/save2.do";
			f.submit();
		} 
	},
	
	/** 상신 */
	submitHistory: function() {
		var progress = new Progress();
		progress.show();
		var f = document.saveForm;
		f.method = "POST";
		f.action = "/approval/submit.do";
		f.submit();
	},
	cancelHistory: function() {
		if(confirm("상신취소 하시겠습니까?")) {
			var progress = new Progress();
			progress.show();
			
			var f = document.saveForm;
			
			var start   = $("input:radio[name='researchWeekly']:checked").attr('start');
			var end     = $("input:radio[name='researchWeekly']:checked").attr('end');
			var workDay = $("#researchWeeklyDay_" + start ).val();
			var approvalStatus = $("#researchWeeklyApprovalStatus_" + start ).val();
			
			$("#jobStartDate").val(start);
			$("#jobEndDate").val(end);
			$("#workDay").val(workDay);
			$("#approvalStatus").val(approvalStatus); 
			
			f.method = "POST";
			f.action = "/approval/cancel.do";
			f.submit();
		}
	},
	validate: function() {
		// 해당 주의 비율의 합이 100%가 되어야 한다. (단, 근무일수가 0일일 경우, 0%가 허용된다.)
		// 1. 화면상의 week 그룹을 조회하여, 그룹별로 비율의 합을 검증한다.
		//    1-1. 100%가 안될 경우, 안내메시지 처리
		//    1-2. 근무일수 vs. 비율 검증, 안내메시지 처리
		
		var start   = $("input:radio[name='researchWeekly']:checked").attr('start');
		var end     = $("input:radio[name='researchWeekly']:checked").attr('end');
		var workDay = $("#researchWeeklyDay_" + start ).val();
		var approvalStatus = $("#researchWeeklyApprovalStatus_" + start ).val();
		
		$("#jobStartDate").val(start);
		$("#jobEndDate").val(end);
		$("#workDay").val(workDay);
		$("#approvalStatus").val(approvalStatus);
		
		var sumRatio = $("#sum_ratio").html();
		sumRatio = parseFloat(sumRatio);

		if(workDay > 0 ) {
			if(sumRatio != 100.0) {
				var message = "투입비율의 합이 100%가 되도록 조정해주세요.\n\n";
				message += "  * 작업기간 : "+formatDate(start,'/')+" ~ "+formatDate(end,'/')+"\n";
				message += "  * 현 합계  : "+ Math.round(sumRatio*10)/10 +"%";
				
				alert(message);
				//$("input[name=inpRatio][start="+key.substring(0,8)+"]").eq(0).focus();
				return false;
				
			} 
		} else if(workDay == 0 && sumRatio > 0) {
			// 비율 조정 안내
			alert("근무일수가 0일 인 경우, 비율을 0%로 입력해 주세요.");
			$("input[name=inpRatio]").each(function() {
				if($(this).val() != "0") {
					$(this).focus();
				}
			});
			return false;
		}

		// 프로젝트 저장시  
		return true;
		
	},
	validate2: function() {
		//투입비중 저장시 validate
		var retrunVal = true;
		$("input[name=activeType]").each(function() {
			if($(this).val() == "close") {
				var wbsName   = $(this).attr("wbsName"); 
				alert(wbsName+"의 상태가 close 입니다.\n해당 WBS를 삭제 후 저장 하십시오.");
				retrunVal = false;
				return retrunVal;
			}
		});
		var sumRatio = $("#sum_ratio").html();
		sumRatio = parseFloat(sumRatio);
		if(sumRatio > 100 || sumRatio < 100 ){
			alert("투입비중의 합이 "+sumRatio+"% 입니다.\n 투입비중의 합계를 100% 로 입력해 주십시오.");
			retrunVal = false;
			return retrunVal;
		}
		return retrunVal;
	},
	validate3: function() {
		var retrunVal = true;
		var sumRatio = $("#sum_ratio").html();
		sumRatio = parseFloat(sumRatio);
		if(sumRatio > 100 ){
			alert("투입비중의 합이 "+sumRatio+"% 입니다.\n 투입비중의 합계를 100% 로 입력해 주십시오.");
			retrunVal = false;
			return retrunVal;
		}
		return retrunVal;
	}	
};
