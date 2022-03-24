/**************************************************************************************
 *  
 * PackageName : resources/js
 * FileName    : userauthority.js
 * 
 * @Title		: 시스템관리 - 권한관리
 * @Description : 권한관리 js
 * @Version     : 
 * @Author      : YounghoLee
 * @Date        : 2015.11.19
**************************************************************************************/	
var userauthority = {
		checked: false,
	
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
			
			console_logs('comboNum', comboNum);
			console_logs('highOrgId', highOrgId);
			
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

		list_authority: function() {
			$.ajax({
				type: "POST",
				url: "/authority/listView.do",
				//data: {"lev":lev, "code":code},
				dataType : 'json',
				success:function(result){
					var html = "";
					var _html = "";
					
					if (result.data.length > 0) {
						_html += "<option value=''>::선택::</option>";
						$(result.data).each(function(i) {
							html += "<tr onclick='userauthority.reg_auth(\""+this.id+"\",\""+this.authorityName+"\");'>";
							html += "	<td>"+this.id+"</td>"; 
							html += "	<td>"+this.authorityName+"</td>";
							html += "</tr>";
							
							// selectbox
							_html += "<option value='"+this.id+"'>"+this.authorityName+"</option>";
											
						});
					}
					else {
						html = "<tr><td colspan='2'>조회결과가 없습니다.</td></tr>";
					}

					$("#list_authority > tbody").html(html);
					$("#authorityId2").html(_html);
					$("#sel_authority").html(_html);
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td colspan='2'>조회결과가 없습니다.</td></tr>";
					$("#list_authority > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},

		// 사용자리스트
		//list_user: function(orgId, userId, authorityId, localName) {
		list_user: function(orgId, userId, localName) {
			//alert("검색 - list_user()");
			$.ajax({
				type: "POST",
				url: "/userauthority/userlist.do",
				data: {
					"orgId":orgId
				   ,"userId":userId
				   //,"authorityId":authorityId
				   ,"localName":localName
				},
				dataType : 'json',
				beforeSend : function() {
					//var html = "";
					//html = "<tr><td class='txt-center' colspan='5'>조회중 입니다.</td></tr>";
					//$("#list_user > tbody").html(html);
				},
				success:function(result){
					var html = "";
					var tmpuserid = "";
					if (result.data.length > 0) {
						$(result.data).each(function(i) {
							if(i==0) selected="select-row"; else selected=""; //첫행 자동선택
							if(i == 0){
								tmpuserid = this.userId;
							}
							html += "<tr class='txt-center "+selected+"' value='"+this.userId+"' onclick='userauthority.reg_user(\""+this.userId+"\""+","+"\""+this.localname+"\");'>";
							//html += "   <td>" + (i+1) +    "</td>"; 
							html += "	<td>"+this.orgDesc+"</td>";
							html += "	<td>"+this.userId+"</td>";
							html += "	<td>"+this.localname+"</td>";
							html += "	<td>"+this.userStatus+"</td>";
							html += "	<td>"+this.positionname+"</td>";
						    /*
							if(this.authorities.length > 0) {
								$(this.authorities).each(function(){
									html += " <td>"+this.authorityName+"</td>";
								});
							}
							*/
							html += "</tr>";
						});
					}
					else {
						html = "<tr><td class='txt-center' colspan='5'>조회결과가 없습니다.</td></tr>";
					}

					$("#list_user > tbody").html(html);

					if(tmpuserid !=""){
						userauthority.reg_user(tmpuserid,'');	
					}
					//document.getElementById('divHeader1').style.margin = "0 0 0 0";
					initHeader("divHeader1");
					tableScrollling("divHeader1", "divContent1", "list_user");
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td class='txt-center' colspan='5'>조회결과가 없습니다.</td></tr>";
					$("#list_user > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},

		// 사용자리스트
		list_user2: function(orgId, userId, localName, fromDate, toDate) {

			$.ajax({
				type: "POST",
				url: "/userauthority/userlist2.do",
				data: {"orgId":orgId, "userId":userId, "localName":localName, "fromDate":fromDate, "toDate":toDate},
				dataType : 'json',
				success:function(result){
					var html = "";
					var tmpuserid = "";
					if (result.data.length > 0) {
						$(result.data).each(function(i) {
							if(i==0) selected="select-row"; else selected=""; //첫행 자동선택
							if(i == 0){
								tmpuserid = this.userId;
							}

							html += "<tr class='txt-center "+selected+"' value='"+this.userId+"' onclick='userauthority.reg_user(\""+this.userId+"\""+","+"\""+this.localname+"\");'>";
							//html += "<td>" +(i+1) + "</td>";
							//html += "	<td><input type='checkbox' name='chsuser' class='checkbox' value='"+this.userId+"'/></td>";

							html += "<tr class='txt-center "+selected+"' value='"+this.userId+"' onclick='userauthority.reg_userex(\""+this.userId+"\""+","+"\""+this.localname+"\");'>";

							html += "	<td>"+this.orgDesc+"</td>";
							html += "	<td>"+this.userId+"</td>";
							html += "	<td>"+this.localname+"</td>";
							html += "	<td>"+this.userStatus+"</td>";
							html += "	<td>"+this.positionname+"</td>";
							html += "</tr>";
						});
					}
					else {
						html = "<tr><td class='txt-center' colspan='5'>조회결과가 없습니다.</td></tr>";
					}

					$("#list_user > tbody").html(html);

					if(tmpuserid !=""){
						userauthority.reg_userex(tmpuserid,'');	
					}
					
					tableScrollling("divHeader1", "divContent1", "list_user");
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td class='txt-center' colspan='5'>조회결과가 없습니다.</td></tr>";
					$("#list_user > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},
		
		// 외부직원검색 
		outerlist_user: function(orgId, userId, localName) {
			$.ajax({
				type: "POST",
				url: "/userauthority/outeruserlist.do",
				data: {"orgId":orgId, "userId":userId, "localName":localName},
				dataType : 'json',
				beforeSend : function() {
					
				},
				success:function(result){
					var html = "";
					var tmpuserid = "";
					if (result.data.length > 0) {
						$(result.data).each(function(i) {
							if(i==0) selected="select-row"; else selected=""; //첫행 자동선택
							if(i == 0){
								tmpuserid = this.userId;
							}
							html += "<tr class='txt-center "+selected+"' value='"+this.userId+"' onclick='userauthority.reg_outeruser(\""+this.userId+"\""+","+"\""+this.localname+"\");'>";
							html += "	<td><input type='checkbox' name='chsuser' class='checkbox' value='"+this.userId+"'/></td>";
							html += "	<td>"+this.orgDesc+"</td>";
							html += "	<td>"+this.userId+"</td>";
							html += "	<td>"+this.localname+"</td>";
							html += "	<td>"+this.userStatus+"</td>";
							html += "	<td>"+this.positionname+"</td>";
							html += "</tr>";
						});
					}
					else {
						html = "<tr><td class='txt-center' colspan='6'>조회결과가 없습니다.</td></tr>";
					}

					$("#list_user > tbody").html(html);

					if(tmpuserid !=""){
						userauthority.reg_outeruser(tmpuserid,'');	
					}
					
					tableScrollling("divHeader1", "divContent1", "list_user");
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td class='txt-center' colspan='5'>조회결과가 없습니다.</td></tr>";
					$("#list_user > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},
		
		// 사용자리스트
		exlist_user: function(orgId, userId, localName) {

			$.ajax({
				type: "POST",
				url: "/userauthority/exceptionuserlist.do",
				data: {"orgId":orgId, "userId":userId, "localName":localName},
				dataType : 'json',
				success:function(result){
					var html = "";
					var tmpuserid = "";
					if (result.data.length > 0) {
						$(result.data).each(function(i) {
							if(i==0) selected=""; else selected=""; //첫행 자동선택
							if(i == 0){
								tmpuserid = this.userId;
							}
							html += "<tr class='txt-center "+selected+"' value='"+this.userId+"' >";
							html += "	<td><input type='checkbox' name='chsuser' class='checkbox' value='"+this.userId+"'/></td>";
							html += "	<td>"+this.orgDesc+"</td>";
							html += "	<td>"+this.userId+"</td>";
							html += "	<td>"+this.localname+"</td>";
							html += "	<td>"+this.positionname+"</td>";
							html += "	<td>"+this.issue+"</td>";
							html += "	<td>"+this.fromDate+" ~ "+this.toDate+"</td>";
							html += "</tr>";
						});
					}
					else {
						html = "<tr><td class='txt-center' colspan='5'>조회결과가 없습니다.</td></tr>";
					}

					$("#list_authorityByUser > tbody").html(html);

					tableScrollling("divHeader1", "divContent1", "list_user");
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td class='txt-center' colspan='5'>조회결과가 없습니다.</td></tr>";
					$("#list_authorityByUser > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},
		
		// 사용자권한관리
		list_user_auth: function(orgId, userId, localName) {
			$.ajax({
				type: "POST",
				url: "/userauthority/userlistauth.do",
				data: {"orgId":orgId, "userId":userId, "localName":localName},
				dataType : 'json',
				success:function(result){
					var html = "";
					var html_sub = "";
					if (result.data.length > 0) {
						list_t_grid = new Array();
						var v_str_userId = "";
						var v = 0;
						$(result.data).each(function(i) {
							//html += "<tr onclick=''>";
							//html += "	<td><input type='checkbox' name='chs' class='checkbox' value='"+this.userId+"/"+this.authorityId+"'/></td>";
							v_str_userId = this.userId;
							html_sub = "";
							html_sub += "	<td>"+this.orgDesc+"</td>";
							html_sub += "	<td>"+this.userId+"</td>";
							html_sub += "	<td>"+this.localname+"</td>";
							html_sub += "	<td>"+this.userStatus+"</td>";
							html_sub += "	<td>"+this.positionname+"</td>";

							
							
							if(this.authorities.length > 0) {
								$(this.authorities).each(function(j){
									html += "<tr class='txt-center' onclick=''>";
									html += "	<td><input type='checkbox' name='chs' class='checkbox' value='"+v_str_userId+"/"+this.id+"'/></td>";
									html += html_sub;
									html += " <td>"+this.id+"</td>"; 
									html += " <td>"+this.authorityName+"</td>";
									html += "</tr>";
									list_t_grid[v] = v_str_userId+"/"+this.id;
									v++;
								});
							}
						});
					}
					else {
						html = "<tr><td class='txt-center' colspan='8'>조회결과가 없습니다.</td></tr>";
					}

					$("#list_authorityByUser > tbody").html(html);
					tableScrollling("divHeader2", "divContent2", "list_authorityByUser");
					
					var_t_state = true;
					
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td class='txt-center' colspan='8'>조회결과가 없습니다.</td></tr>";
					
					$("#list_authorityByUser > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
			//userauthority.clear();
		},	
		
		// 사용자권한관리
		list_outeruser_auth: function(orgId, userId, localName) {
			$.ajax({
				type: "POST",
				url: "/userauthority/outeruserlistauth.do",
				data: {"orgId":orgId, "userId":userId, "localName":localName},
				dataType : 'json',
				success:function(result){
					var html = "";
					var html_sub = "";
					if (result.data.length > 0) {
						list_t_grid = new Array();
						var v_str_userId = "";
						var v = 0;
						$(result.data).each(function(i) {
							//html += "<tr onclick=''>";
							//html += "	<td><input type='checkbox' name='chs' class='checkbox' value='"+this.userId+"/"+this.authorityId+"'/></td>";
							v_str_userId = this.userId;
							html_sub = "";
							html_sub += "	<td>"+this.orgDesc+"</td>";
							html_sub += "	<td>"+this.userId+"</td>";
							html_sub += "	<td>"+this.localname+"</td>";
							html_sub += "	<td>"+this.userStatus+"</td>";
							html_sub += "	<td>"+this.positionname+"</td>";

							
							
							if(this.authorities.length > 0) {
								$(this.authorities).each(function(j){
									html += "<tr class='txt-center' onclick=''>";
									html += "	<td><input type='checkbox' name='chs' class='checkbox' value='"+v_str_userId+"/"+this.id+"'/></td>";
									html += html_sub;
									html += " <td>"+this.id+"</td>"; 
									html += " <td>"+this.authorityName+"</td>";
									html += "</tr>";
									list_t_grid[v] = v_str_userId+"/"+this.id;
									v++;
								});
							}
						});
					}
					else {
						html = "<tr><td class='txt-center' colspan='8'>조회결과가 없습니다.</td></tr>";
					}

					$("#list_authorityByUser > tbody").html(html);
					tableScrollling("divHeader2", "divContent2", "list_authorityByUser");
					
					var_t_state = true;
					
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td class='txt-center' colspan='8'>조회결과가 없습니다.</td></tr>";
					
					$("#list_authorityByUser > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
			//userauthority.clear();
		},	
		
		// 대행자관리
		list_instead: function(instead_Mon) {
			var progress = new Progress();
			$.ajax({
				type: "POST",
				url: "/research/RegistrarAdmin.do",
				data : {"instead_Mon": instead_Mon },
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
								html_R += "	<td class='txt-center'>"+linkName(this.requesterId)+"</td>";	//								
								html_R += "	<td class='txt-center'>"+linkName(this.localName2)+"</td>";	
								html_R += "	<td class='txt-center'>"+linkName(this.teamDesc2)+"</td>";//
								html_R += "	<td class='txt-center'>"+linkName(this.receiverId)+"</td>";//
								html_R += "	<td class='txt-center'>"+linkName(this.localName)+"</td>";	
								html_R += "	<td class='txt-center'>"+linkName(this.teamDesc)+"</td>";//
								html_R += "	<td class='txt-center'>"+linkName(this.insteadMonth)+"</td>";//
													
								html_R += "</tr>";
								 
								preJobStartDate = this.weeklyJobStartDate;
							});					
					}  
					
					if ( html_R == "" ){
						html_R = "<tr><td class='txt-center' colspan='11'>대행자 정보가 없습니다.</td></tr>";
					}
					
					$("#list_insteadByUser > tbody").html(html_R);
					tableScrollling("divHeader2", "divContent2", "list_insteadByUser");
					
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
		
		reg_user: function(userId, userName) {
			$("#userId").val(userId);
			$("#userName").val(userName);
			
			//userauthority.list_user_auth("%", userId, "%");
		},
		
		/*
		reg_user2: function(orgId, userId, userName) {
			
			$("#userId").val(userId);
			$("#userName").val(userName);
			
			alert(orgId +"  " + userId + "   " + userName);
			
			userauthority.outerlist_user(orgId, userId, userName);
			userauthority.list_user_auth("%", userId, "%");
		},
		*/
		reg_userex: function(userId, userName) {
			$("#userid").val(userId);
			$("#userId").val(userId);
			$("#exuserid").val(userId);
			$("#exlocalname").val(userName);
			userauthority.usergetlist("registrarer",userId);
		},

		// 외부직원검색 처음호출, 대상자 클릭했을시 호출 - kss
		reg_outeruser: function(userId, userName) {
			$("#userId").val(userId);
			$("#userName").val(userName);
			
			userauthority.list_outeruser_auth("%", userId, "%");
		},
		
		reg_auth: function(authId, authName){ 
			$("#authorityId").val(authId);
			$("#authorityName").val(authName);
		},
					
		regist: function() {
			
			$.ajax({
				type: "POST",
				url: "/userauthority/regist.do",
				data: {"userId":$("#userId2").val(), 
					   "authorityId":$("#authorityId2").val()
					  },
//				dataType : 'json',
				success:function(result){
					//userauthority.list_user_auth("%", $("#userId2").val(), "%");
					userauthority.list_user_auth();
					$("#inp_dialog").dialog( "close" );
				},

				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});			
		},
		
		regist2: function() {
			
			$.ajax({
				type: "POST",
				url: "/userauthority/regist.do",
				data: {"userId":$("#userId2").val(), 
					   "authorityId":$("#authorityId2").val()
					  },
//				dataType : 'json',
				success:function(result){
					//userauthority.list_user_auth("%", $("#userId2").val(), "%");
					userauthority.list_outeruser_auth("%", $("#userId2").val(), "%");
					$("#inp_dialog").dialog( "close" );
				},

				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});			
		},
		
		registuser: function() {
			
			$.ajax({
				type: "POST",
				url: "/userauthority/registuser.do",
				data: {
						"userId":$("#exuserId").val(), 
						"localname":$("#exlocalname").val(),
						"exemail":$("#exemail").val(),
						"exteam":$("#exteam").val()
					  },
//				dataType : 'json',
				success:function(result){
					userauthority.outerlist_user($("#exlocalname").val(),"%","");
					userauthority.reg_outeruser($("#exuserId").val(),'');	
					$("#user_dialog").dialog( "close" );
				},

				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});			
		},
		
		insertexuser: function() {
			
			$.ajax({
				type: "POST",
				url: "/userauthority/registexuser.do",
				data: {
						"userId":$("#exuserid").val(), 
						"fromDate":$("#exfromDate").val(), 
						"toDate":$("#extoDate").val(), 
						"issue":$("#issue").val()
					  },
//				dataType : 'json',
				success:function(result){
					$("#exuserid").val("");
					$("#exlocalname").val("");
					$("#issue").val("");
					userauthority.exlist_user();
				},

				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});			
		},
		
		clear: function() {
			$("#userId").val("");
			$("#userName").val("");
			$("#authorityId").val("");
			$("#authorityName").val("");
		
		},
		
		 insertinstead: function() {
			var perprogress = new Progress();
			$.ajax({
				type: "POST",
				url: "/research/checkRegistrarInsert.do",
				data: {
					 "tYear" : $("#tYear").val()
					,"tMonth" : $("#tMonth").val()
					,"userId" : $("#userid").val()
					,"registrarer" : $("#registrarer").val()
					  },
				dataType : 'json',
				success:function(result){
					if (result.success) { 
						var f = document.registrarForm;
						f.method = "POST";
						f.action = "/research/insertRegistrarAdmin.do";
						f.submit();
						//userauthority.list_instead();
					} else {
						alert("해당월에 이미 대행자가 지정되어 있습니다.");
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
		
		clear: function() {
			$("#userId").val("");
			$("#userName").val("");
			$("#authorityId").val("");
			$("#authorityName").val("");
		
		},
		
		deleteAll: function() {
			
			if (confirm("해당 사용자를 삭제하시겠습니까?")) {	
				var userId = $("#list_user .select-row").attr("value");
				
				$.ajax({
					type: "POST",
					url: "/userauthority/deleteUser.do",
					data: {"userId":userId},
					success:function(result){
					},
					complete: function() { 
						userauthority.outerlist_user($("#exlocalname").val(),"%","");
						userauthority.reg_outeruser($("#exuserId").val(),'');
					},
					error : function(x, t, e) {
						handleErrorMessage(x, t, e);
					}
				});
			}
		},
		
		deleteAll2: function() {
	//		alert("삭제");
	//		alert($("#userId2").val());
		
			if (!$("input[name=chs]").is(":checked")) {
				alert("삭제할 권한을 선택해주세요.");
				return;
			}

			if(confirm("해당 권한을 삭제하시겠습니까?")) {
				var li_chs = new Array();
				var v = 0;
				var i = 0;
				
				for(v=0; v<$("input[name=chs]").length; v++) {
					if($("input[name=chs]")[v].checked) {
						li_chs[i] = list_t_grid[v];
						//alert(list_t_grid[v]);
						i++;
					}
				}
				$.ajax({
					type: "POST",
					url: "/userauthority/delete.do",
					data:{"chs":li_chs},
					
					success:function(result){

						userauthority.list_user_auth();

					},
					error : function(x, t, e) {
						handleErrorMessage(x, t, e);
					}
				});
			}
		},
		
		deleteAll3: function() {
	//		alert("삭제");
	//		alert($("#userId2").val());
		
			if (!$("input[name=chs]").is(":checked")) {
				alert("삭제할 권한을 선택해주세요.");
				return;
			}

			if(confirm("해당 권한을 삭제하시겠습니까?")) {
				var li_chs = new Array();
				var v = 0;
				var i = 0;
				
				for(v=0; v<$("input[name=chs]").length; v++) {
					if($("input[name=chs]")[v].checked) {
						li_chs[i] = list_t_grid[v];
						//alert(list_t_grid[v]);
						i++;
					}
				}
				$.ajax({
					type: "POST",
					url: "/userauthority/delete.do",
					data:{"chs":li_chs},
					
					success:function(result){

						userauthority.list_outeruser_auth("%", $("#userId2").val(), "%");

					},
					error : function(x, t, e) {
						handleErrorMessage(x, t, e);
					}
				});
			}
		},
		
	usergetlist: function(target, userid) {
			$.ajax({
				type : "POST",
				url : "/jikmucode/json/teamuserlist.do",
				data : { "userid": userid },
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
					
		deleteexuser: function() {

				var li_chs = new Array();
				var v = 0;
				var i = 0;
				
				for (v=0 ; v < $("input[name=chsuser]").length ; v++) {
					if ($("input[name=chsuser]")[v].checked) {
						
						li_chs[i] = $("input[name=chsuser]")[v].value;
						//alert(li_chs[i]);
						i++;
					}
				}

				$.ajax({
					type: "POST",
					url: "/userauthority/deleteexuser.do",
					data: {"chs":li_chs},
					success:function(result){

					},
					complete: function() {
						userauthority.exlist_user();
					},
					error : function(x, t, e) {
						handleErrorMessage(x, t, e);
					}
				});
			
		},
		
			deleteinstead: function() {

				var li_chs = new Array();
				var v = 0;
				var i = 0;
				
				for (v=0 ; v < $("input[name=chs]").length ; v++) {
					if ($("input[name=chs]")[v].checked) {
						
						li_chs[i] = $("input[name=chs]")[v].value;
						//alert(li_chs[i]);
						i++;
					}
				}

				$.ajax({
					type: "POST",
					url: "/research/deleteRegistrarAdmin.do",
					data: {"chs":li_chs},
					success:function(result){
					var instead_Mon=$("#tYear2").val()+"-"+$("#tMonth2").val();
					userauthority.list_instead(instead_Mon);
					},
					complete: function() {
						//userauthority.exlist_user();
					},
					error : function(x, t, e) {
						handleErrorMessage(x, t, e);
					}
				});
			
		},
		
		validate: function() {
			return true;
		}
};


		



function initField(){

	//$( "#list_user tbody" ).on( "click", "tr", function() { $(".select-row", $("#list_user") ).removeClass("select-row"); $(this).addClass("select-row"); return true; });
	//$( "#list_authorityByUser tbody" ).on( "click", "tr", function() { $(".select-row", $("#list_authorityByUser") ).removeClass("select-row"); $(this).addClass("select-row"); return true; });
	
	$("#btn_dialog_open_delete_user_list").click(function() { 
		
		userauthority.deleteAll2();
	});
	
	$("#btn_dialog_open_delete_outer_authority").click(function() { 
		
		userauthority.deleteAll3();
	});
	
	$("#btn_dialog_open_insert").click(function() {
		$("#authorityId2").val("");
		$("#inp_dialog").data("type","I").dialog( "open" ); 
		return false; 
	});
	
	
	
	
	
	
	
	
	$("#btn_dialog_open_update").click(function() { $("#inp_dialog").data("type","U").dialog( "open" ); return false; });
	
	/*
	$("#btn_dialog_open_delete").click(function() { 
		var _code = $("#tableId1 .select-row").attr("value");
		if(_code && _code.length>0) $("#delete_dialog").data("fn",deleteCode).dialog( "open" ); 
		return false; 
	});
	*/
	
	$("#btn_insert_user_list").click(function() {
		if($("#authorityId2").val() == ""){
			alert("권한을 입력하여 주세요");
			return false;
		}
		userauthority.regist();
	}); 
	
		$("#btn_insert_outer_authority").click(function() {
		if($("#authorityId2").val() == ""){
			alert("권한을 입력하여 주세요");
			return false;
		}
		userauthority.regist2();
	}); 

	$("#btn_dialog_cancel").click(function() {
		$("#inp_dialog").dialog( "close" ); 
		return false; 
	}); 
	
}


/* init dialog */
function initInpDialog() {
	$("#inp_dialog").dialog({
		autoOpen : false,
		width : 300,
		modal : true,
		show: {effect: "blind",duration: 250},
		buttons : { },
		open : function(){
				var _id = $("#list_user .select-row").attr("value");
				if(_id){
					$('#orgId2').val($("#list_user .select-row td:nth-child(1)").text());
					$('#userId2').val($("#list_user .select-row td:nth-child(2)").text());
					$('#localname2').val($("#list_user .select-row td:nth-child(3)").text());
				}
				else{
					
					alert("사용자를 먼저 검색 하세요.");
					$("#inp_dialog").dialog( "close" );
					searchFocus();		
				}
		},
		close : function(){ 
			//$("#btn_insert").hide(); $("#btn_update").hide(); $("#btn_revise").hide();
			//$("#inp_form :input").each(function (){ $(this).val(""); });
			
		}
	});
}

function initInpDialog2() {
	$("#inp_dialog").dialog({
		autoOpen : false,
		width : 300,
		modal : true,
		show: {effect: "blind",duration: 250},
		buttons : { },
		open : function(){
				var _id = $("#list_user .select-row").attr("value");
				if(_id){
					$('#orgId2').val($("#list_user .select-row td:nth-child(2)").text());
					$('#userId2').val($("#list_user .select-row td:nth-child(3)").text());
					$('#localname2').val($("#list_user .select-row td:nth-child(4)").text());
				}
				else{
					
					alert("사용자를 먼저 검색 하세요.");
					$("#inp_dialog").dialog( "close" );
					searchFocus();		
				}
		},
		close : function(){ 
			//$("#btn_insert").hide(); $("#btn_update").hide(); $("#btn_revise").hide();
			//$("#inp_form :input").each(function (){ $(this).val(""); });
			
		}
	});
}

/* init delete dialog */
function initDelDialog() {
	$("#delete_dialog").dialog({ 
		autoOpen : false,
		resizable: false,      
		height:140,      
		modal: true,      
		buttons: {        
			"삭제": function() {
				var fn = $(this).data("fn"); 
				if(typeof fn == "function"){ fn.call(); }
				$(this).dialog("close");        
			},        
			"취소": function() { $( this ).dialog( "close" ); }
		},
		open : function(){
			var _msg = $(this).data("msg");
			if(_msg){
				$("#delete_dialog_message").html(_msg);
			} else {
				$("#delete_dialog_message").html("삭제 하시겠습니까?");
			}
		}
	});
}

/*
function deleteCode(){
	var _id = $("#tableId1 .select-row").attr("value");
	
	var param = new Object();
	param.id = _id;
	
	if(param.id && param.id.length>0){
		$.ajax({
			type: "POST"
			,url: "/code/position/query/deleteCode.do"
			,data: JSON.stringify(param)
			,dataType : 'json'
			,contentType:"application/json; charset=UTF-8"
			,beforeSend : function() { }
			,complete: function() { }
			,success:function(result){
				if(result.success) {
					alert("삭제 되었습니다.");
					$("#delete_dialog").dialog( "close" );
					//getPositionList();
				} else {
					alert(result.errorMsg);
				}
				return true;
			},
			error: ajaxError.setting
		});
	}	
}
*/

function initDialog() {
	initInpDialog();
	initDelDialog();
}
function initDialog2() {
	initInpDialog2();
	initDelDialog();
}

function searchFocus() {
	$("#inp_localname").focus();
}

function initHeader(headerId) {
	document.getElementById(headerId).style.margin = "0 0 0 0";
}
	
