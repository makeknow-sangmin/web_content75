/**************************************************************************************
 *  
 * PackageName : resources/js
 * FileName    : registrar.js
 * 
 * @Title		: 대행등록관리 js
 * @Description : 대행등록관리 
 * @Version     : 
 * @Author      : 이영호
 * @Date        : 2015.11.19
**************************************************************************************/		
var registrar = {
	last : false 
	,asyncYN:true
	,research_object:null
		,selectRegistrar: function(user_Id){
			var progress = new Progress();
			$.ajax({
				type : "POST",
				url : "/research/Registrar.do",
				data : {"user_Id": user_Id },
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
									if (  temp_class == "class='tr-case1'"){
										temp_class = "class='codeDetailChkbox'";
									}else{
										temp_class = "class='tr-case1'";
									}
								}
								
								var yearMon = linkName(this.insteadMonth);
								var array_year =  yearMon.split("-");
								var year = array_year[0];
								var month = array_year[1];								
								
								html_R +="<tr " + temp_class + ">";
								html_R += "	<td class='txt-center'><input type='checkbox' name='chs' class='registCheck' value='"+this.id+"' /></td>";
								html_R += "	<td class='txt-center'>"+linkName(this.teamDesc)+"</td>";	//								
								html_R += "	<td class='txt-center'>"+linkName(this.receiverId)+"</td>";	
								html_R += "	<td class='txt-center'>"+linkName(this.localName)+"</td>";//
								html_R += "	<td class='txt-center'>"+year+"년 "+month+"월"+"</td>";//
													
								html_R += "</tr>";
								 
								preJobStartDate = this.weeklyJobStartDate;
							});					
					}  
					
					if ( html_R == "" ){
						html_R = "<tr><td class='txt-center' colspan='11'>대행자 정보가 없습니다.</td></tr>";
					}
					
					/* 연구 */
					$("#inD1 > tbody").html(html_R);
					
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				},
				beforeSend : function() {
					progress.show();
				},
				complete : function() {
					progress.hide();				

					/*tableScrollling("divHeader1", "divContent1", "research");*/
				}
			});
		},		
		updateRegistrar: function(){
				
			var f = document.registrarUpdateForm;
			
			f.method = "POST";
			f.action = "/research/updateRegistrar.do";
			f.submit();
		},
		updateRegistrarSelect: function(){		
		
		var chsLength =  $("input[name=chs]:checked").length;
		var registrar_id =  0;
		
		if ( chsLength == 0 ){
			alert("수정할 대상을 선택해 주세요.");
			return ;
		}else if ( chsLength == 1){
			registrar_id = $("input[name=chs]:checked").val();
			$("#registrar_id").val(registrar_id);
			
		}else{
			alert("수정할 대상을 하나만 선택해 주세요.");
			return ;
		} 
		
		$.ajax({
			type : "POST",
			url : "/research/selectRegistrarForUpdate.do",
			data : { 
				"id": registrar_id
			},
			dataType : 'json',
			success : function(result) {
				if (result.success) { 
					dialogOpen('registrarUpdate');
					registrar.research_object = result.list; 
					 
				} else {
					alert("상신 및 승인완료된 이력이 존재하는 프로젝트에 대해서는 수정할 수 없습니다.\n다시 확인해 주세요.");
				}
			}
			,error : function(x, t, e){}
			,complete : function() {
				registrar.updateForm();
			}
			
		});
		},
		
		updateForm: function() {
		
		function researchChange(nm,val){ 
		$(nm).val(val);
		$(nm).change();
		}
				
		list = registrar.research_object;
		$(list).each(function(i) {
			var aa = this.insteadMonth;
			$("#insteadId").val(this.id); 
			researchChange("#registrarerUpdate",this.receiverId);
		});
	},
		
			insertRegistrar: function(){
			var perprogress = new Progress();
			$.ajax({
				type : "POST",
				url : "/research/checkRegistrarInsert.do",
				data : {
					 "tYear" : $("#tYear").val()
					,"tMonth" : $("#tMonth").val()
					,"userId" : $("#userId").val()
					,"registrarer" : $("#registrarer").val()
				},
				dataType : 'json',
				success : function(result) {
					if (result.success) { 
						var f = document.registrarForm;
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
		deleteRegistrar: function() {
			
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
						var f = document.registrarFormMain;
						var userId = $("#userId").val();
						$("#deleteTargetUserId").val(userId);
						
						f.method = "POST";
						f.action = "/research/deleteRegistrar.do?";
						f.submit();
					}
				}
			}
		}
	}