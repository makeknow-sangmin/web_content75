var groupMgmt = {
		
	checked: false,

	selectList: function(code,gridLev,id_nm) {
		/*if(id == "") 
			return*/
		var params = {
			type: "POST",
			url: "/code/group/selectGroupMgmt.do",
			dataType : 'json',
			success:function(result){
				var listObj;
				var strObj;
				
				/*$("#In_Lev0").val(Number(lev)+1);
				$("#In_Code0").val(id);
				$("#In_CodeName0").val(id_nm);*/
				
				strObj = "list_lv" + gridLev;
				listObj = document.getElementById(strObj);
				
				console_logs('result list : ',result.list);
				console_logs('gridLev : ',gridLev);
				console_logs('strObj : ',strObj);
				console_logs('listObj : ',listObj);
				//console_logs('result.data.length : ',result.data.length);
				
				//listObj.options.length = 0;
				if(result != null) {
					if(result.list == "") {
						listObj.add(new Option("조회 데이터 없음", ""));
					}
	
					$(result.list).each(function(i) {
						if(gridLev ==2){
							listObj.add(new Option(this.orgCenter, this.orgCenterCode));
						}else if(gridLev ==3){
							listObj.add(new Option(this.orgSil, this.orgSilCode));
						}else if(gridLev ==4){
							listObj.add(new Option(this.orgTeam, this.orgTeamCode));
						}else{
							listObj.add(new Option(this.orgBonbu, this.orgBonbuCode));
						}
					});
					if(gridLev == 2){
						listObj.add(new Option("-",""));
					}
				}
				else {
					listObj.add(new Option("조회 데이터 없음", ""));
				}
			},
			error:function() {
				alert("데이터 통신간 문제가 발생하였습니다.");
	
				/*var listObj;
	
				listObj = document.getElementById(strObj);
				listObj.options.length = 0;				
				listObj.add(new Option("조회 데이터 없음", ""));*/
			}
				
		}
					
		if(gridLev == 3){
			params.data ={  
				"orgCenterCode" : code,
				"lev": gridLev
			}
		}else if(gridLev == 4){
			params.data = {
				"orgSilCode" : code,
				"lev": gridLev
			}
		}else{
			params.data = {
				"orgBonbuCode" : code,
				"lev": gridLev
			}
		}
		$.ajax(params);		
	},
	selectNullList: function(code,gridLev,id_nm,bonbuCode,centerCode) {
		/*var orgCode = "orgBonbuCode";
		if(gridLev == 3){
			orgCode = "orgCenterCode";
		}else if(gridLev == 4){
			orgCode = "orgSilCode";
		}*/
			
		var params = {
			type: "POST",
			url: "/code/group/selectNullGroupMgmt.do",
			dataType : 'json',
			success:function(result){
				var listObj;
				var strObj;
				console_logs('code : ', code);
				strObj = "list_lv" + gridLev;
				listObj = document.getElementById(strObj);
				
				console_logs('result list : ',result.list);
				console_logs('gridLev : ',gridLev);
				console_logs('strObj : ',strObj);
				console_logs('listObj : ',listObj);
				//console_logs('result.data.length : ',result.data.length);
				
				//listObj.options.length = 0;
				if(result != null) {
					if(result.list == "") {
						listObj.add(new Option("조회 데이터 없음", ""));
					}
	
					$(result.list).each(function(i) {
						/*if(gridLev ==2){
							listObj.add(new Option(this.orgCenter, this.orgCenterCode));
						}else if(gridLev ==3){
							listObj.add(new Option(this.orgSil, this.orgSilCode));
						}else if(gridLev ==4){
							listObj.add(new Option(this.orgTeam, this.orgTeamCode));
						}else{
							listObj.add(new Option(this.orgBonbu, this.orgBonbuCode));
						}*/
						if(gridLev ==3){
							listObj.add(new Option(this.orgSil, this.orgSilCode));
						}else{
							listObj.add(new Option(this.orgTeam, this.orgTeamCode));
						}
					});
					if(gridLev == 2 ){
						listObj.add(new Option("-",""));
					}
				}
				else {
					listObj.add(new Option("조회 데이터 없음", ""));
				}
	
									
			},
			error:function() {
				alert("데이터 통신간 문제가 발생하였습니다.");

				/*var listObj;

				listObj = document.getElementById(strObj);
				listObj.options.length = 0;				
				listObj.add(new Option("조회 데이터 없음", ""));*/
			}
				
		}
					
		if(gridLev == 3){
			params.data ={  
				"orgBonbuCode" : code,
				"lev": gridLev
			}
		}else if(gridLev == 4){
			params.data = {
				"orgSilCode" : code,
				"orgCenterCode" : centerCode,
				"orgBonbuCode" : bonbuCode,
				"lev": gridLev
			}
		}else{
			params.data = {
				"orgBonbuCode" : code,
				"lev": gridLev
			}
		}
		$.ajax(params);		
	},
	
	selectDtlList: function(lev,code) {
			
			var tmp_code = document.getElementById("In_Code"+lev);
			var tmp_lev = document.getElementById("In_Lev"+lev);
			var j = 0;

			id = tmp_code.getAttribute("value");
			//lev = tmp_lev.getAttribute("value");
			console_logs('id : ', id);
			console_logs('lev @@@@ : ', lev);
			
			var params = {
				type: "POST",
				url: "/code/group/listbylev.do",
				dataType : 'json',
				success:function(result){
					
					var html = "";
					if (result.data.length > 0) {
						
						list_t_grid_id =  new Array();
						list_t_grid_code =  new Array();
						list_t_grid_name =  new Array();
						list_t_grid_researchYN =  new Array();
						list_t_grid_created =  new Array();
						list_t_grid_change =  new Array();						
						
						$(result.data).each(function(i) {
							console_logs('this.orgTeam : ', this.orgTeamCode);
							html += "<tr class='txt-center'>";
							html += "	<td><center><input type='checkbox' name='chs' researchYN = '"+this.researchYN+"' class='checkbox' value='"+this.orgTeamCode+"'/></center></td>";
							/*switch(lev){
								case 1 :
									html += "	<td>"+this.orgBonbuCode+"</td>";
									html += "	<td>"+this.orgBonbu+"</td>";
								break;
								
								case 2 :
									html += "	<td>"+this.orgCenterCode+"</td>";
									html += "	<td>"+this.orgCenter+"</td>";
								break;
								
								case 3 :
									html += "	<td>"+this.orgSilCode+"</td>";
									html += "	<td>"+this.orgSil+"</td>";
								break;
								
								case 4 :
									html += "	<td>"+this.orgTeamCode+"</td>";
									html += "	<td>"+this.orgTeam+"</td>";
								break;
							}*/
							html += "	<td>"+this.orgTeamCode+"</td>";
							html += "	<td class='txt-left'>"+this.orgTeam+"</td>";
							if(this.researchYN == 'Y'){
								html += "	<td>연구소</td>";
							}else if(this.researchYN == 'N'){
								html += "	<td>비연구소</td>";
							}else{
								html += "	<td>-</td>";
							}
							//html += "	<td>"+( (this.researchYN == 'Y') ? '연구소' : '비연구소' )+"</td>";
							html += "	<td>"+this.created +"</td>";
							html += "	<td>"+this.change +"</td>";
							html += "</tr>";
							
							//list_t_grid_id[i] =  this.id;
							/*switch(lev){
								case 1 :
									list_t_grid_code[i] =  this.orgBonbuCode;
									list_t_grid_name[i] =  this.orgBonbu;
								break;
								case 2 :
									list_t_grid_code[i] =  this.orgCenterCode;
									list_t_grid_name[i] =  this.orgCenter;
								break;
								case 3 :
									list_t_grid_code[i] =  this.orgSilCode;
									list_t_grid_name[i] =  this.orgSil;
								break;
								case 4 :
									list_t_grid_code[i] =  this.orgTeamCode;
									list_t_grid_name[i] =  this.orgTeam;
								break;
							}*/
							list_t_grid_code[i] =  this.orgTeamCode;
							list_t_grid_name[i] =  this.orgTeam;
							list_t_grid_researchYN[i] =  this.researchYN;
							list_t_grid_created[i] =  this.created;
							list_t_grid_change[i] =  this.change;
							
							j++;
						});
					}
					else {
						html = "<tr><td colspan='6'>조회결과가 없습니다.</td></tr>";
					}

					$("#tab_jikmumanageDtl > tbody").html(html);
					tableScrollling("divHeader", "divContent", "tab_jikmumanageDtl");
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td colspan='6'>조회결과가 없습니다.</td></tr>";
					$("#tab_jikmumanageDtl > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			}	
			
			if(lev == 1){
				params.data ={  
					"orgBonbuCode" : code,
					"lev": lev
				}
			}else if(lev == 2){
				params.data = {
					"orgCenterCode" : code,
					"lev": lev
				}
			}else{
				params.data = {
					"orgSilCode" : code,
					"lev": lev
				}
			}
			$.ajax(params);
	},
	changeResearch : function() {
		if(!$("input[name=chs]").is(":checked")){
			alert("선택된 항목이 없습니다.");
			return;
		}
		$("#orgTeamCode").val($("input[name='chs']:checked").val());
		$("#researchYN").val($("input[name='chs']:checked").attr("researchYN"));
		
		/*$("input[name='chs']:checked").each(function(i) {
		});*/
		if($("#researchYN").val() == 'Y'){
			alert("이미 연구소로 지정되어 있습니다.");
			return;
		}
		
		$("input[name=chs]:checked").each(function() {
			if($(this).attr("researchYN") == 'N') {
				$("#researchYN").val('N');
			}
		});
		
		var f = document.listForm;
		f.method = "POST";
		f.action = "/code/group/change.do";
		f.submit();
	},
	unCheck : function() {
		if(!$("input[name=chs]").is(":checked")){
			alert("선택된 항목이 없습니다.");
			return;
		}
		$("#orgTeamCode").val($("input[name='chs']:checked").val());
		$("#researchYN").val($("input[name='chs']:checked").attr("researchYN"));
		
		/*$("input[name='chs']:checked").each(function(i) {
		});*/
		$("input[name=chs]:checked").each(function() {
			if($(this).attr("researchYN") == 'Y') {
				$("#researchYN").val('Y');
			}
		});
		if($("#researchYN").val() == 'N'){
			alert("이미 비연구소로 지정되어 있습니다.");
			return;
		}
		
		var f = document.listForm;
		f.method = "POST";
		f.action = "/code/group/change.do";
		f.submit();
	}
	
	
		
		
}