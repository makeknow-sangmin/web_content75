// portal.js의 portal과 동일함.
var research4 = {
	selectList: function() {
		var progress = new Progress();
		$.ajax({
			type : "POST",
			url : "/approval/regist.do",
			data : { 
				"fromDate": $("#jobStartDate1").val()
			  , "toDate": $("#jobEndDate1").val() 
			  , "userName": $("#userName").val()
			},
			dataType : 'json',
			success : function(result) {
				var html = "";
				var period = "";
				var preJobStartDate = "";
				var temp_class = "class='tr-case1'";
				if (result.success) {
					$(result.list).each(function(index) {
						
						if ( this.research.once =='Y' &&  !(this.research.strCreated >= this.jobStartDate && this.research.strCreated <= this.jobEndDate) ){
							// 화면에 보여주지 않는다..
						}else{
							
						
							
							if ( preJobStartDate != this.jobStartDate ){ 
								if (  temp_class == "class='tr-case1'"){
									temp_class = "class='codeDetailChkbox'";
								}else{
									temp_class = "class='tr-case1'";
								}
							}
							html +="<tr " +  temp_class + " >";
							
							/*
							if(index%2==1) {
								if($("input[name=gubun]").val() == "research") {
									html += "<tr class='tr-case1'>";
								} else {
									html += "<tr class='tr-case1'>";
								}
							} else {
								html += "<tr>";
							}
							*/
							
							if(this.approvalStatus=="C") {
								html += "	<td class='txt-center'>&nbsp;</td>";
								
							} else {
								html += "	<td class='txt-center'>";
								html += "	 <input type='checkbox' name='historyId' start='"+this.jobStartDate+"' end='"+this.jobEndDate+"' status='"+this.approvalStatus+"' value='"+this.id+"' />";
								html += "	 <input type='checkbox' name='researchId' start='"+this.jobStartDate+"' end='"+this.jobEndDate+"' status='"+this.approvalStatus+"' value='"+this.research.id+"' />";
								html += "	 <input type='checkbox' name='jobStartDate' start='"+this.jobStartDate+"' end='"+this.jobEndDate+"' status='"+this.approvalStatus+"' value='"+this.jobStartDate+"' />";
								html += "	 <input type='checkbox' name='jobEndDate' start='"+this.jobStartDate+"' end='"+this.jobEndDate+"' status='"+this.approvalStatus+"' value='"+this.jobEndDate+"' />";
								html += "	 <input type='checkbox' name='approvalStatus' start='"+this.jobStartDate+"' end='"+this.jobEndDate+"' status='"+this.approvalStatus+"' value='"+this.approvalStatus+"' />";
								html += "	 <input type='checkbox' name='workDay' id='"+this.id+"' start='"+this.jobStartDate+"' end='"+this.jobEndDate+"' status='"+this.approvalStatus+"' value='"+((this.approvalStatus=="N" && this.workDay == -1)?5:this.workDay)+"' />";
								html += "	 <input type='checkbox' name='ratio' start='"+this.jobStartDate+"' end='"+this.jobEndDate+"' status='"+this.approvalStatus+"' value='"+this.ratio+"' />";
								html += "	</td>";
							}
							
							html += "	<td>"+linkName(this.research.workDivName1, this.research.workDivName2)+"</td>";
							html += "	<td>"+nvl(this.research.title,"-")+"</td>";
							html += "	<td>"+linkName(this.research.productDivName2, this.research.productDivName3)+"</td>";
							//html += "	<td>"+linkName(this.research.techDivName1, this.research.techDivName2, this.research.techDivName3)+"</td>";
							//html += "	<td>"+linkName(this.research.taskDivName1, this.research.taskDivName2)+"</td>";
							period = formatDate(this.jobStartDate,'/')+" ~ "+formatDate(this.jobEndDate,'/');
							html += "	<td class='txt-center'>"+period+"</td>";
							
							if(this.approvalStatus=="P" || this.approvalStatus=="C") {	// 진행 or 완료
								html += "	<td class='txt-center'>"+this.workDay+"</td>";
								html += "	<td class='txt-right'>"+ this.ratio;
								html += "	 <input type='hidden' name='fixRatio' value='"+this.ratio+"' />%";
								html += " </td>";
							} else {
								html += "	<td class='txt-center'>";
								html += "  <select class='time' id='"+this.id+"_sel' name='selWorkDay' start='"+this.jobStartDate+"' end='"+this.jobEndDate+"' onchange='javascript:research4.changeDay(this, \""+period+"\");'>";
								var workDay = (this.approvalStatus=="N" && this.workDay == -1) ? 5 : this.workDay;
								for(var i=10; i>=0; i--) {
									html += "   <option value='"+(i/2)+"'"+(workDay==(i/2) ? "selected" : "")+">"+(i/2)+"</option>";
								}
								html += "  </select>";
								html += " </td>";
								html += "	<td class='txt-right' nowrap>";
								html += "	 <input type='text' id='"+this.id+"_inp' name='inpRatio' start='"+this.jobStartDate+"' end='"+this.jobEndDate+"' value='"+this.ratio+"' onkeyup='javascript:research4.changeRatio(this);' style='width:25px;'/>%";
								html += "	</td>";
							}
							
	//							html += "	<td class='txt-center'>"+this.jobTime+"</td>";
							html += "	<td class='txt-center'>";
							if(this.approvalStatus=="P") {
								html += "<img src='/resources/images/btn_07.png' alt='진행' />";
							} else if(this.approvalStatus=="C") {
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
	//						html += this.approvalStatus;
							html += " </td>";
							html += "</tr>";
							
							
							preJobStartDate = this.jobStartDate;
							
						
						}
						
						
					});
					
				} else {
					html = "<tr><td class='txt-center' colspan='12'>현재 진행 중인 프로젝트가 없습니다.</td></tr>";
				}
				
				$("#research > tbody").html(html);
				
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
														 .css("text-align", "right")
														 .numeric({max:100, min:0});

				// set hidden checkbox
				 
				$("input[name=researchId]").hide();
				$("input[name=jobStartDate]").hide();
				$("input[name=jobEndDate]").hide();
				$("input[name=approvalStatus]").hide();
				$("input[name=workDay]").hide();
				$("input[name=ratio]").hide();
				 
				
			    $("input[name=historyId]").click(function () {  
					$(this).parent().children().prop('checked',$(this).is(":checked"));
					
					// 동일 기간의 경우 모두 선택
					var thisStartDate = $(this).attr("start");
					var thisEndDate = $(this).attr("end");
					var checked = $(this).is(":checked");
					
					$("input:checkbox[start="+thisStartDate+"][end="+thisEndDate+"]").each(function() {
						if($(this).attr("status") != "C") {
							$(this).prop('checked', checked); 
						}
					});
			    });   
			    
			    $("input[name=approvalStatus]").click(function () {  
			    	$(this).parent().children().prop('checked',$(this).is(":checked"));  

					// 동일 기간의 경우 모두 선택
					var thisStartDate = $(this).attr("start");
					var thisEndDate = $(this).attr("end");
					var checked = $(this).is(":checked");
					
					$("input:checkbox[start="+thisStartDate+"][end="+thisEndDate+"]").each(function() {
						if($(this).attr("status") != "C") {
							$(this).prop('checked', checked); 
						}
					});
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
	changeDay: function(obj, period) {
		var td1 = $(obj).parent().parent().children("td").first();
		td1.children("input[name=workDay]").val(obj.value);
		
		td1.children("input[name=historyId]").prop("checked", true);
		td1.children("input[name=researchId]").prop("checked", true); 
		td1.children("input[name=jobStartDate]").prop("checked", true); 
		td1.children("input[name=jobEndDate]").prop("checked", true); 
		td1.children("input[name=approvalStatus]").prop("checked", true); 
		td1.children("input[name=workDay]").prop("checked", true); 
		td1.children("input[name=ratio]").prop("checked", true); 

		$("select[name=selWorkDay]").each(function() {
			var pd = $(this).parent().prev().text();
			var td2 = $(this).parent().parent().children("td").first(); 
			
			if(period == pd) {
				$(this).val(obj.value);
				td2.children("input[name=workDay]").val(obj.value);
				
				td2.children("input[name=historyId]").prop("checked", true);
				td2.children("input[name=researchId]").prop("checked", true); 
				td2.children("input[name=jobStartDate]").prop("checked", true); 
				td2.children("input[name=jobEndDate]").prop("checked", true); 
				td2.children("input[name=approvalStatus]").prop("checked", true); 
				td2.children("input[name=workDay]").prop("checked", true); 
				td2.children("input[name=ratio]").prop("checked", true); 

			}
		});
		
		if($(obj).val() == "0") {
			var thisStartDate = $(obj).attr("start");
			var thisEndDate = $(obj).attr("end");
			
			$("input[name$=atio][start="+thisStartDate+"][end="+thisEndDate+"]").each(function() {
				$(this).val("0"); 
			});
		}
	},
	changeRatio: function(obj) {
		var td1 = $(obj).parent().parent().children("td").first();
		td1.children("input[name=ratio]").val(obj.value);

		td1.children("input[name=historyId]").prop("checked", true);
		td1.children("input[name=researchId]").prop("checked", true); 
		td1.children("input[name=jobStartDate]").prop("checked", true); 
		td1.children("input[name=jobEndDate]").prop("checked", true); 
		td1.children("input[name=approvalStatus]").prop("checked", true); 
		td1.children("input[name=workDay]").prop("checked", true); 
		td1.children("input[name=ratio]").prop("checked", true); 

		var thisStartDate = $(obj).attr("start");
		var thisEndDate = $(obj).attr("end");
		
		$("input:checkbox[start="+thisStartDate+"][end="+thisEndDate+"]").each(function() {
			$(this).prop('checked', true); 
		});
		
		// 자동 비율계산
		research4.autoRatio(thisStartDate, thisEndDate);
	},
	autoRatio: function(thisStartDate, thisEndDate) {
		var inpRatioArr = $("input[name=inpRatio][start="+thisStartDate+"][end="+thisEndDate+"]"); 
		var totalRatio = 0;
		inpRatioArr.each(function(i) {
			totalRatio += parseFloat(nvl($(this).val(),0));
		});
//		console.log("totalRatio:"+totalRatio);
		
//		var calcRatio = 100-totalRatio;
//		inpRatioArr.last().val(calcRatio);
//		inpRatioArr.last().parent().parent().children("td").first().children("input[name=ratio]").val(calcRatio);
		
		$("#sum_period").html(formatDate(thisStartDate,'/')+" ~ "+formatDate(thisEndDate,'/'));
		$("#sum_ratio").html(nvl(totalRatio,0)+" %");

	},
	// 이력등록
	saveHistory: function() {
		if(this.validate() && confirm("저장 하시겠습니까?")) {
			var progress = new Progress();
			progress.show();
			
			var f = document.saveForm;
			f.method = "POST";
			f.action = "/approval/save.do";
			f.submit();
		} 
	},
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
			f.method = "POST";
			f.action = "/approval/cancel.do";
			f.submit();
		}
	},
	
	
	// 직무이력 종합조회 start
	selectJikmuList: function(status) {
		var progress = new Progress();
		$.ajax({
			type : "POST",			 
			url : "/approval/progress.do",
			data : { },
			dataType : 'json',
			success : function(result) {
				var html = "";
				var jikmuGubun = "";
				//var temp_class = "class='tr-case1'";
				
				if (result.success) {
					$(result.list).each(function(index) {
						if(this.majorYn=="Y"){
							jikmuGubun="주직무";  // json (this.majorYn) 
						} else {
							jikmuGubun="부직무";
						}
						html += "<tr>";
						//html += "   <td class='txt-center'><input type='checkbox' name='chk' class='checkbox' value='"+this.id+"' /></td>";
						html += "	<td class='txt-center'>"  + jikmuGubun +"</td>";
						html += "	<td class='txt-center'>" +this.jikmuDivNm1 +"</td>";
						html += "	<td class='txt-center'>" +this.jikmuDivNm2 +"</td>";
						html += "	<td class='txt-center'>" +this.jikmuDivNm3 +"</td>";
						html += "	<td class='txt-center'>" +formatDate(this.jikmuStart,'/') + " ~ " + formatDate(this.jikmuEnd,'/') + "</td>";
						html += "</tr>";
					});
				} else {
					html = "<tr><td class='txt-center' colspan='5'>등록된 직무가 없습니다.</td></tr>";
				}

				$("#research_total > tbody").html(html);
				
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
	// 직무이력 종합조회 end
	
	validate: function() {
		// 해당 주의 비율의 합이 100%가 되어야 한다. (단, 근무일수가 0일일 경우, 0%가 허용된다.)
		// 1. 화면상의 week 그룹을 조회하여, 그룹별로 비율의 합을 검증한다.
		//    1-1. 100%가 안될 경우, 안내메시지 처리
		//    1-2. 근무일수 vs. 비율 검증, 안내메시지 처리
		var map = new Map();
		
		$("input[name=ratio]:checked").each(function(i) {
			var start = $(this).attr("start");
			var end = $(this).attr("end");
			var value = parseFloat(nvl($(this).val(),0));
			var workDay = $(this).prev().val();
			var tempVal;
			
			if(map.get(start+end) == undefined) {
				map.put(start+end, [workDay, value]);
			} else {
				tempVal = parseFloat(nvl(map.get(start+end)[1],0));
				map.put(start+end, [workDay, tempVal+value]);
			}
		});
		
//		console.log(map);
		
		var key = null;
		var w = 0;
		var sumRatio = 0;
		
		for(var i=0; i++<map.size; map.next()) {
			key = map.key();
			w = map.value()[0];
			sumRatio = map.value()[1];
			
			if(w > 0) {
				if(sumRatio != 100) {
					var message = "투입비율의 합이 100%가 되도록 조정해주세요.\n\n";
					message += "  * 작업기간 : "+formatDate(key.substring(0,8),'/')+" ~ "+formatDate(key.substring(8),'/')+"\n";
					message += "  * 현 합계   : "+sumRatio+"%";
					
					alert(message);
					$("input[name=inpRatio][start="+key.substring(0,8)+"][end="+key.substring(8)+"]").eq(0).focus();
					return false;
					
				} 
			} else if(w == 0 && sumRatio > 0) {
				// 비율 조정 안내
				alert("근무일수가 0일 인 경우, 비율을 0%로 입력해 주세요.");
				$("input[name=inpRatio][start="+key.substring(0,8)+"][end="+key.substring(8)+"]").each(function() {
					if($(this).val() != "0") {
						$(this).focus();
					}
				});
				return false;
				
			}
		}
		return true;
		
	}
};
