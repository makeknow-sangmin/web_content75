/**
 * 
 * FileName    : jikmu.js
 * 
 *
 * @Description : 직무코드 조회, 등록
 * @Version     : 
 * @Author      : Copyright(C) c.broad - KIM_SANG_SU
 * @Date        : 2015. 2. 12. 오후 4:22:06
 */
var jikmu = {
	jikmuFINISH:false
	,asyncYN:true
	,research_object:null
		,selectBox: function(code, target, callback) {
			$.ajax({
				type : "POST",
				url : "/jikmucode/json/list.do",
				data : { "code": code },
				dataType : 'json',
				async: jikmu.asyncYN,
				success : function(result) {
					
					var html = "";
					if (result.success) {
						if(result.data.length>0) html += "<option value=''>선택</option>";
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
					jikmu.clear(target);
					
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
			alert("init()");
		},
		clear: function(id) {
			$("#"+id).html("");
			hideSelectBox();
			
		},
		
		// 직무종료
		regist: function() {  
			if (this.validate()) {
				var f = document.jikmuForm;
				f.method = "POST";                 
				f.action = "/" + f.gubun.value + "/finish.do";
				f.submit();
			}
		},
			
		// 직무등록
		regist: function() {  
			if (this.validate()) {
				var f = document.jikmuForm;
				f.method = "POST";                 
				f.action = "/" + f.gubun.value + "/regist.do";
				f.submit();
			}
		},
		
		// 직무수정 
		update: function() {
			if (this.validate()) {
				
				$("#major_yn").removeAttr('disabled');
				$("#jikmuDiv1").removeAttr('disabled');
				$("#jikmuDiv2").removeAttr('disabled');
				$("#jikmuDiv3").removeAttr('disabled');
				$("#jikmu_start").datepicker( "option", "disabled", false );
							
				var f = document.jikmuForm;	
				f.method = "POST"; 
				f.action = "/" + f.gubun.value + "/update.do";
				f.submit();
			}
		},
		
		//직무삭제
		deleteResearch: function() {
			if (!$("input[name=chk]").is(":checked")) {
				alert("삭제할 직무를 선택해주세요.");
			}else {
				
				var count = 0;
				$("input[name=chk]:checked").each(function() {
					if($(this).attr("status") == "P") {
						alert("결재 진행중인 건은 삭제 할 수 없습니다.");
						count++;
						return ;
					} else if($(this).attr("status") == "Y") {
						alert("결재 완료된 건은 삭제 할 수 없습니다.");
						count++;
						return ;
					}
				});
				
				if(count == 0) {
					if(confirm("삭제하시겠습니까?")) {
						var f = document.jikmuListForm;
						f.method = "POST";
						f.action = "/jikmucode/delete.do";
						f.submit();
					}
				}
				
			}
		},
		
		// 직무수정전 검증
		updateResearch: function() {
			var today2 = new Date();
			var Today = today2.getFullYear().toString() + "/" + comRight("0" + (today2.getMonth()+1).toString(),2) + "/" + comRight("0" + today2.getDate().toString(),2);
			var count = 0;
			var chsLength =  $("input[name=chk]:checked").length;
			var jikmu_id =  0;
			
			if ( chsLength == 0 ){
				alert("수정할 직무를 선택해 주세요.");
				return ;
			}else if ( chsLength == 1){
				jikmu_id = $("input[name=chk]:checked").val();
				$("#jikmu_id").val(jikmu_id);
			}else{
				alert("수정할 직무를 하나만 선택해 주세요.");
				return ;
			}
			
			$("input[name=chk]:checked").each(function() {
				
				if($(this).attr("status") == "P") {
					alert("결재 진행중인 건은 수정 할 수 없습니다.");
					count++;
					return ;				
				} 
				
				else if( $(this).attr("status") == "Y" && $(this).attr("jikmu_EndDate")!="9999/12/31" && $(this).attr("jikmu_EndDate")  <= Today ) {
					alert("결재 완료후 종료일이 지난 건은 수정 할 수 없습니다.");
					count++;
					return ;
				}
				
			});
				
			if(count == 0) {
				$.ajax({
				type : "POST",
				url : "/jikmucode/selectResearchNotApproval.do", 
				data : { 
					"id": jikmu_id
				},
				dataType : 'json',
				success : function(result) {
					if (result.success) { 
						dialogOpen('jikmu');						
						jikmu.research_object = result.list; 
						 
					} else {
						alert("수정할 수 없습니다.\n다시 확인해 주세요.");
					}
				}
				,error : function(x, t, e){}
				,complete : function() {
					jikmu.updateForm();
				}
				
			   });
			}
			
		},
		
		updateForm: function() { 
						
			list = jikmu.research_object; 
			
			//selectbox 동기로 바꿈
			jikmu.asyncYN = false;
			
			//alert($("input:checkbox[name='chk']:checked").attr("status"));
			
			researchChange("#major_yn",list.majorYn) ;
			researchChange("#jikmuDiv1",list.jikmuDiv1) ;
			researchChange("#jikmuDiv2",list.jikmuDiv2) ;
			researchChange("#jikmuDiv3",list.jikmuDiv3) ;
			
			$("#jikmu_start").val(list.strjikmuStart);
			
			if(list.strjikmuEnd == "9999-12-31"){
				$("#jikmu_end").val("");
			}else{
				$("#jikmu_end").val(list.strjikmuEnd);
			}
			
					
			// 직무승인상태가 완료:Y
			if($("input:checkbox[name='chk']:checked").attr("status") == "Y"){
				
				$("#major_yn").attr('disabled', 'true');
				$("#jikmuDiv1").attr('disabled', 'true');
				$("#jikmuDiv2").attr('disabled', 'true');
				$("#jikmuDiv3").attr('disabled', 'true');
				$("#jikmu_start").datepicker( "option", "disabled", true );	
				
			}else{
				$("#major_yn").removeAttr('disabled');
				$("#jikmuDiv1").removeAttr('disabled');
				$("#jikmuDiv2").removeAttr('disabled');
				$("#jikmuDiv3").removeAttr('disabled');
				$("#jikmu_start").datepicker( "option", "disabled", false );
				
			}
			
			$("#major_yn").attr('disabled', 'true'); // 주직무 부직무 수정은 불가
			$("#jikmu_modalCloseBtn").focus();
			// selectbox 비동기로 바꿈
			jikmu.asyncYN = true;
		
		},
		
		duplicateChk: function() {
		   // 주직무 
			if($("#major_yn").val() == "Y") {
				if($("#jikmu_end").val()==""){
					$("#jikmu_end").val("9999-12-31");
				}
			 jikmu.duplicate();  // 주직무만 중복체크 
			
			}else{
				// 부직무 일때 체크 
				if($("#jikmu_end").val()==""){
					$("#jikmu_end").val("9999-12-31");
				}
				
				//부직무중복검증 
				$.ajax({				
					type : "POST",
					url : "/jikmucode/duplicate2.do",
					data : { 				
						"jikmu_updateYn": $("#jikmu_updateYn").val(),
						"jikmu_id": $("input[name=chk]:checked").val(),
						"user_id": $("#userId").val(),
						"jikmuDiv1": $("#jikmuDiv1").val(),
						"jikmuDiv2": $("#jikmuDiv2").val(),
						"jikmuDiv3": $("#jikmuDiv3").val(),
						"jikmu_start":$("#jikmu_start").val().replace(/-/g, ''),
						"jikmu_end": $("#jikmu_end").val().replace(/-/g, '')
					},				
					dataType : 'json',
					
					success : function(result) {
					
						if (result.success) {
							$("#jikmu_end").val("");
							alert("동일한 직무가 입력되었습니다.\n확인해 주세요.");
						} else {
							
							// 부직무 입력시 주직무에 직군 직렬 직무 검증체크   
							$.ajax({				
							type : "POST",
							url : "/jikmucode/duplicate3.do",
							data : { 				
								"user_id": $("#userId").val(),
								"jikmuDiv1": $("#jikmuDiv1").val(),
								"jikmuDiv2": $("#jikmuDiv2").val(),
								"jikmuDiv3": $("#jikmuDiv3").val()
							},				
							
							dataType : 'json',				
							
							success : function(result) {
								 if (result.success) {
									 $("#jikmu_end").val("");
									 alert("주직무에 동일한 직군 직렬 직무가 입력되었습니다.\n확인해 주세요.");
								 } else {
									 if ( $("#jikmu_updateYn").val() == "Y"){  	// 수정구분 Y 이면 수정프로세스
										 jikmu.update(); 					  	               
									 }else{
										 jikmu.regist();  					  	// 수정구분이 Y가 아니면 등록프로세스
									 }
								 }							
							},
							error : function(x, t, e){
								handleErrorMessage(x, t, e);
							}
						});
						// 부직무 입력시 주직무에 직군 직렬 직무 검증체크	
					  }
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					}
				});				
			}
		},

		// 직무중복 체크 프로세스
		duplicate: function() {
			
				$.ajax({				
					type : "POST",
					url : "/jikmucode/duplicate.do",
					
					data : { 				
						"jikmu_updateYn": $("#jikmu_updateYn").val(),
						"jikmu_id": $("input[name=chk]:checked").val(),
						"user_id": $("#userId").val(),
						"major_yn": $("#major_yn").val(),
						"jikmu_start":$("#jikmu_start").val().replace(/-/g, ''),
						"jikmu_end": $("#jikmu_end").val().replace(/-/g, '')
					},				
					dataType : 'json',	
					
					success : function(result) {
						
						if (result.success) {
							
							// 승인완료된 현재직무중에 종료일이 없는 직무는 종료일 입력
							//alert($("input[name=jikmuApprovalStatus]").val());
							$("#jikmu_end").val("");
							alert("주직무기간이 중복되었습니다.\n시작일과 종료일이 겹치는 기간은 등록할 수 없습니다.\n이전 주직무에 종료일자를 확인해 주세요.");
							
						} else {
							// 중복체크2
									
							$.ajax({				
								type : "POST",
								url : "/jikmucode/duplicate2.do",
								data : { 				
									"jikmu_updateYn": $("#jikmu_updateYn").val(),
									"jikmu_id": $("input[name=chk]:checked").val(),
									"user_id": $("#userId").val(),
									"jikmuDiv1": $("#jikmuDiv1").val(),
									"jikmuDiv2": $("#jikmuDiv2").val(),
									"jikmuDiv3": $("#jikmuDiv3").val(),
									"jikmu_start":$("#jikmu_start").val().replace(/-/g, ''),
									"jikmu_end": $("#jikmu_end").val().replace(/-/g, '')
								},				
								dataType : 'json',				
								success : function(result) {
									
									if (result.success) {
										alert("동일한 직무가 입력되었습니다.\n 확인해 주세요.");
										
									} else {
										// 중복체크2

										if ( $("#jikmu_updateYn").val() == "Y"){  // 수정구분 Y 이면 수정프로세스
											
											jikmu.update(); // 직무수정               
										}else{
											jikmu.regist();  			// 수정구분이 Y가 아니면 등록프로세스
										}
									}
								},
								error : function(x, t, e){
									handleErrorMessage(x, t, e);
								}
							});	
							
						}
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					}
				});				
		},
		validate: function() {
			return true;
		}
		
		// 직무경력관리 조회
		,selectMainList: function(status) {
			var progress = new Progress();
			//var backColor = "#FFFDC3";
			$.ajax({
				type : "POST",
				url : "/jikmucode/main.do",  
				data : { },
				dataType : 'json',
				success : function(result) {
					var html = "";
					var jikmuGubun = "";
					var activeGubun ="";
					var today2 = new Date();
					var ymd2 = today2.getFullYear().toString() + "/" + comRight("0" + (today2.getMonth()+1).toString(),2) + "/" + comRight("0" + today2.getDate().toString(),2);
					if (result.success) {
						var cntx1 = 1;
						var cntx2 = 1;
						var cntx3 = 1;
						$(result.list).each(function(index) {
							if(this.majorYn=="Y"){
								jikmuGubun="주직무";  
							} else {
								jikmuGubun="부직무";
							}
							
							html += "   <tr>";
							html += "   <td class='txt-center'>";
						//if(this.approvalStatus != 'Y'){
											
							html += "   <input type='checkbox' name='chk'                 jikmu_EndDate ='"+formatDate(this.jikmuEnd,'/')+"' status='"+this.approvalStatus+"' value='"+this.id+"' />";
							html += "   <input type='checkbox' name='jikmuId'             jikmuid='"+this.id+"' value='"+this.id+"' />";
							html += "   <input type='checkbox' name='jikmuApprovalStatus' jikmuid='"+this.id+"' value='"+this.approvalStatus+"' />" ;
						//}
							html += "   </td>";
							
							if( this.approvalStatus == 'Y' && formatDate(this.jikmuEnd,'/') >= ymd2 && formatDate(this.jikmuStart,'/') <= ymd2){
								
								html += "	<td class='txt-center' style='background-color:#FFFDC3'><font color='red'>현재</font></td>";
								html += "	<td class='txt-center' style='background-color:#FFFDC3'>" + jikmuGubun +"</td>";
								html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.jikmuDivNm1 +"</td>";
								html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.jikmuDivNm2 +"</td>";
								html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.jikmuDivNm3 +"</td>";
								
								if(this.changecnt1 > 1 && cntx1 != this.changecnt1){
									html += "	<td class='txt-center'>" +this.start1.substring(0,10).split("-").join("/") + " ~ ";
									cntx1 = cntx1+1;
								}else if(this.changecnt2 > 1 && cntx2 != this.changecnt2){
									html += "	<td class='txt-center'>" +this.start2.substring(0,10).split("-").join("/") + " ~ ";
									cntx2 = cntx2+1;
								}else if(this.changecnt3 > 1 && cntx3 != this.changecnt3){
									html += "	<td class='txt-center'>" +this.start3.substring(0,10).split("-").join("/") + " ~ ";
									cntx3 = cntx3+1;
								}else{
									html += "	<td class='txt-center'>" +formatDate(this.jikmuStart,'/') + " ~ ";
								}
								
								if ( formatDate(this.jikmuEnd,'/') == "9999/12/31" ){
									if( this.end1 != "9999-12-31 00:00:00" ){
										html +=  this.end1.substring(0,10).split("-").join("/");
									}else if( this.end2 != "9999-12-31 00:00:00" ){
										html +=  this.end2.substring(0,10).split("-").join("/");
									}else if( this.end3 != "9999-12-31 00:00:00" ){
										html +=  this.end3.substring(0,10).split("-").join("/");
									}else{
										html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
									}
								}
								else{
									html +=  formatDate(this.jikmuEnd,'/');
								}
								html += "    </td>";
								
								if(this.approvalStatus == 'Y') {
									html += "<td class='txt-center' style='background-color:#FFFDC3'><img src='/resources/images/btn_05.png' alt='완료' style='vertical-align:middle;'/></td>";
								}else if(this.approvalStatus == 'R') {
									html += "<td class='txt-center' style='background-color:#FFFDC3'><img src='/resources/images/btn_03.png' alt='반려' style='vertical-align:middle;'/></td>";
								}else if(this.approvalStatus == 'P') {
									html += "<td class='txt-center' style='background-color:#FFFDC3'><img src='/resources/images/btn_07.png' alt='진행' style='vertical-align:middle;'/></td>";
								}else {
									html += "<td class='txt-center' style='background-color:#FFFDC3'><img src='/resources/images/btn_09.png' alt='등록' style='vertical-align:middle;'/></td>";
								}
								
								html += "</tr>";
								
							}else{
								html += "	<td class='txt-center'>  </td>";
								html += "	<td class='txt-center'>" + jikmuGubun +"</td>";
								html += "	<td class='txt-center'>" +this.jikmuDivNm1 +"</td>";
								html += "	<td class='txt-center'>" +this.jikmuDivNm2 +"</td>";
								html += "	<td class='txt-center'>" +this.jikmuDivNm3 +"</td>";
								
								if(this.changecnt1 > 1 && cntx1 != this.changecnt1){
									html += "	<td class='txt-center'>" +this.start1.substring(0,10).split("-").join("/") + " ~ ";
									cntx1 = cntx1+1;
								}else if(this.changecnt2 > 1 && cntx2 != this.changecnt2){
									html += "	<td class='txt-center'>" +this.start2.substring(0,10).split("-").join("/") + " ~ ";
									cntx2 = cntx2+1;
								}else if(this.changecnt3 > 1 && cntx3 != this.changecnt3){
									html += "	<td class='txt-center'>" +this.start3.substring(0,10).split("-").join("/") + " ~ ";
									cntx3 = cntx3+1;
								}else{
									html += "	<td class='txt-center'>" +formatDate(this.jikmuStart,'/') + " ~ ";
								}

								if ( formatDate(this.jikmuEnd,'/') == "9999/12/31" ){
									if( this.end1 != "9999-12-31 00:00:00" ){
										html +=  this.end1.substring(0,10).split("-").join("/");
									}else if( this.end2 != "9999-12-31 00:00:00" ){
										html +=  this.end2.substring(0,10).split("-").join("/");
									}else if( this.end3 != "9999-12-31 00:00:00" ){
										html +=  this.end3.substring(0,10).split("-").join("/");
									}else{
										html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
									}
								}
								else{
									html +=  formatDate(this.jikmuEnd,'/');
								}
								html += "    </td>";
								
								if(this.approvalStatus == 'Y') {
									html += "<td class='txt-center'><img src='/resources/images/btn_05.png' alt='완료' style='vertical-align:middle;'/></td>";
								}else if(this.approvalStatus == 'R') {
									html += "<td class='txt-center'><img src='/resources/images/btn_03.png' alt='반려' style='vertical-align:middle;'/></td>";
								}else if(this.approvalStatus == 'P') {
									html += "<td class='txt-center'><img src='/resources/images/btn_07.png' alt='진행' style='vertical-align:middle;'/></td>";
								}else {
									html += "<td class='txt-center'><img src='/resources/images/btn_09.png' alt='등록' style='vertical-align:middle;'/></td>";
								}
								
								html += "</tr>";
							}
							/*
							html += "	<td class='txt-center'>" + jikmuGubun +"</td>";
							html += "	<td class='txt-center'>" +this.jikmuDivNm1 +"</td>";
							html += "	<td class='txt-center'>" +this.jikmuDivNm2 +"</td>";
							html += "	<td class='txt-center'>" +this.jikmuDivNm3 +"</td>";
							
							html += "	<td class='txt-center'>" +formatDate(this.jikmuStart,'/') + " ~ ";
							
							if ( formatDate(this.jikmuEnd,'/') == "9999/12/31" ){
								html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
							}
							else{
								html +=  formatDate(this.jikmuEnd,'/');
							}
							
							
							
							if(this.approvalStatus == 'Y') {
								html += "<td class='txt-center'><img src='/resources/images/btn_05.png' alt='완료' style='vertical-align:middle;'/></td>";
							}else if(this.approvalStatus == 'R') {
								html += "<td class='txt-center'><img src='/resources/images/btn_03.png' alt='반려' style='vertical-align:middle;'/></td>";
							}else if(this.approvalStatus == 'P') {
								html += "<td class='txt-center'><img src='/resources/images/btn_07.png' alt='진행' style='vertical-align:middle;'/></td>";
							}else {
								html += "<td class='txt-center'><img src='/resources/images/btn_09.png' alt='등록' style='vertical-align:middle;'/></td>";
							}
							
							html += "</tr>";
							*/
						});
					} else {
						html = "<tr><td class='txt-center' colspan='12'>등록된 직무가 없습니다.</td></tr>";
					}
					
					$("#tableId1 > tbody").html(html);
									

					// set hidden checkbox				  
					$("input[name=jikmuApprovalStatus]").hide();
					$("input[name=jikmuId]").hide();
					

					// 이벤트 설정
					$("input[name=chk]").click(function() {
						$(this).parent().children().prop('checked',$(this).is(":checked"));

						var jikmuId = $(this).val();
						var checked = $(this).is(":checked");
						
						$("input:checkbox[jikmuId="+jikmuId	+"]").each(function() {
							$(this).prop('checked', checked);
							$(this).parent().children().prop('checked',$(this).is(":checked"));
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
					tableScrollling("divHeader1", "divContent1", "tableId1");
					progress.hide();
				}
			});
		}
		,jikmuListPopTree: function() {
			d.clearCookie(); // 쿠키초기화
			//var progress = new Progress(); 
			$.ajax({
				type : "POST",
				url : "/jikmucode/jikmuListPopTree.do",  
				data : {"jikmuListPopSearchWord":$("#jikmuListPopSearchWord").val() },
				dataType : 'json',
				success : function(result) {  
					 if (result.success) {
						d = new dTree('d');
						d.add(1,-1,'직무표준','',1);
						$(result.data).each(function(index) {
							if ( index != 0){
							d.add(this.code ,this.parentCode ,this.codeName ,'',this.lev);
							}
						});
						$("#jikmuListPopTree").html(d.toString());
					}  	
				},
				error      : function(x, t, e){ handleErrorMessage(x, t, e); },
				beforeSend : function() { 
					//progress.show();
				},
				complete   : function() { 
					d.clearCookie(); 
					if ( $("#jikmuListPopSearchWord").val() != ""){
						d.openAll();
					}else{
						d.closeAll();
					}
					//progress.hide(); 
				}
			});
		}
		
};
