var cmmcode = {

		checked: false,

		selectList: function(lev,code,gridLev,codeName) {

			cmmcode.clear();			
			
			if(code == "z") {
				return
			}

				$.ajax({
					type: "POST",
					url: "/cmmcode/listbylev.do",
					data: {"lev":lev, "code":code},
					dataType : 'json',
					success:function(result){
						
						var listObj;
						var strObj;

						var tmp_lev = document.getElementById("In_Lev0");
						var tmp_code = document.getElementById("In_Code0");
						var tmp_codeName = document.getElementById("In_CodeName0");

						tmp_lev.setAttribute("value",lev);
						tmp_code.setAttribute("value",code);
						tmp_codeName .setAttribute("value",codeName);

						tmp_lev = document.getElementById("In_Lev"+gridLev);
						tmp_code = document.getElementById("In_Code"+gridLev);

						tmp_lev.setAttribute("value",lev);
						tmp_code.setAttribute("value",code);						
						
						strObj = "list_lv" + gridLev;

						listObj = document.getElementById(strObj);

						listObj.options.length = 0;

						if(result != null) {
							if(result.data.length == 0) {
								listObj.add(new Option("조회 데이터 없음", "z"));
							}

							$(result.data).each(function(i) {
								listObj.add(new Option(this.codeName, this.code));
							});
						}
						else {
							listObj.add(new Option("조회 데이터 없음", "z"));
						}

						var i = 0;
						for(i=(gridLev + 1); i<5 ; i++)  {
							strObj = "list_lv" + i;
							listObj = document.getElementById(strObj);
							listObj.options.length = 0;
							tmp_lev = document.getElementById("In_Lev"+i);
							tmp_code = document.getElementById("In_Code"+i);
							if(t_stat_clean == true) {
								tmp_lev.setAttribute("value","");
								tmp_code.setAttribute("value","");
							}
						}
						
						if(lev == 0 && $("#In_Code2").val() !=""  && t_stat_clean == false) {
							$("#list_lv1").val($("#In_Code2").val());
							$("#list_lv1").change();
							if($("#in_Code3").val() == "")
								t_stat_clean = true;
						}
						else if(lev == 1 && $("#In_Code3").val() !=""   && t_stat_clean == false) {
							$("#list_lv2").val($("#In_Code3").val());
							$("#list_lv2").change();
							if($("#in_Code4").val() == "")
								t_stat_clean = true;							
						}
						else if(lev == 2 && $("#In_Code4").val() !=""   && t_stat_clean == false) {
							$("#list_lv3").val($("#In_Code4").val());
							$("#list_lv3").change();
							if($("#in_Code5").val() == "")
								t_stat_clean = true;							
						}
						else if(lev == 3 && $("#In_Code5").val() !=""   && t_stat_clean == false) {
							$("#list_lv4").val($("#In_Code5").val());
							$("#list_lv4").change();
							t_stat_clean = true;							
						}						
					},
					error:function() {
						alert("데이터 통신간 문제가 발생하였습니다.");

						var listObj;
						var strObj;

						strObj = "list_lv" + gridLev;

						listObj = document.getElementById(strObj);
						listObj.options.length = 0;				
						listObj.add(new Option("조회 데이터 없음", "z"));
					}
				});
		},

		selectDtlList: function(lev) {

			var tmp_code = document.getElementById("In_Code"+lev);

			code = tmp_code.getAttribute("value");
			
			lev = lev - 1;

			$.ajax({
				type: "POST",
				url: "/cmmcode/listbylev.do",
				data: {"lev":lev, "code":code},
				dataType : 'json',
				success:function(result){
					var html = "";
					if (result.data.length > 0) {
						list_t_grid_code =  new Array();
						list_t_grid_codeName =  new Array();
						list_t_grid_description =  new Array();
						list_t_grid_status =  new Array();
						list_t_grid_sortSequence =  new Array();
						
						$(result.data).each(function(i) {
							html += "<tr onclick='cmmcode.selectDtlOne("+this.code+")'>";
							html += "	<td><input type='checkbox' name='chs' class='checkbox' value='"+this.code+"'/></td>";
							html += "	<td>"+this.codeName+"</td>";
							html += "	<td>"+this.description+"<input type='hidden' name='sortSequence' value='"+this.code+"/"+this.sortSequence+"'/></td>";								
							html += "	<td>"+( (this.status == 'N') ? '미사용' : '사용' )+"</td>";
							html += "</tr>";

							list_t_grid_code[i] =  this.code;
							list_t_grid_codeName[i] =  this.codeName;
							list_t_grid_description[i] =  this.description;
							list_t_grid_status[i] =  this.status;
							list_t_grid_sortSequence[i] =  this.sortSequence;
							
						});
					}
					else {
						html = "<tr><td colspan='4'>조회결과가 없습니다.</td></tr>";
					}

					$("#tab_cmmCodeDtl > tbody").html(html);
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td colspan='4'>조회결과가 없습니다.</td></tr>";
					$("#sm > ul").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},
		
		selectDtlOne: function(code) {
			
			$.ajax({
				type: "POST",
				url: "/cmmcode/view.do",
				data: {"code":code },
				dataType : 'json',
				success:function(result){
					$("#code").val(result.code);
					$("#codeName").val(result.codeName);
					$("#status").val(result.status);
					$("#description").val(result.description);
					$("#sortSequence").val(result.sortSequence);
					$("#lev").val(result.lev);
					$("#parentCode").val(result.parentCode);
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});
		},

		regist: function() {
			$.ajax({
				type: "POST",
				url: "/cmmcode/regist.do",
				data: {"codeName":$("#mo_codeName").val()
	                    ,"parentCode":$("#mo_parentCode").val()
	                    ,"lev":$("#mo_lev").val()
	                    ,"description":$("#mo_description").val()
	                    ,"status":$("#mo_status").val()
	                    },
				success:function(result){
					dialogClose('saveManager');
					cmmcode.selectList(0,0,1,"최상위");
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});				
		},
		
		modify: function() {
			$.ajax({
				type: "POST",
				url: "/cmmcode/modify.do",
				data: {"code":$("#code").val()
					    ,"codeName":$("#codeName").val()
					    ,"sortSequence":$("#sortSequence").val()
				        ,"description":$("#description").val()
					    ,"status":$("#status").val()
				},
					
				success:function(result){
					cmmcode.selectDtlOne($("#code").val());
					cmmcode.selectDtlList($("#lev").val());
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});			
		},
		
		modify_sort: function() {
			var t_sortSequence = new Array();
			var i = 0;
			
			for(i  = 0 ; i < list_t_grid_code.length ; i++) {
				t_sortSequence[i] = list_t_grid_code[i]+"/"+(i+1);
			}
			
			$.ajax({
				type: "POST",
				url: "/cmmcode/modify_sort.do",
				data: {"t_sortSequence": t_sortSequence},
					
				success:function(result){
					if($("#code").val() != "") {
						cmmcode.selectDtlOne($("#code").val());
					}
					if($("#lev").val() != "") {
						cmmcode.selectDtlList($("#lev").val());
					}
					cmmcode.selectList(0,0,1,"최상위");					
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});			
		},

		deleteAll: function() {
			if (!$("input[name=chs]").is(":checked")) {
				alert("삭제할 코드을 선택해주세요.");
				return;
			}

			if (confirm("해당 코드를 삭제하시겠습니까?")) {

				var li_chs = new Array();
				var v = 0;
				var i = 0;
				
				for (v=0 ; v < $("input[name=chs]").length ; v++) {
					if ($("input[name=chs]")[v].checked) {
						li_chs[i] = list_t_grid_code[v];
						i++;
					}
				}
				$.ajax({
					type: "POST",
					url: "/cmmcode/delete.do",
					data: {"chs":li_chs},
					success:function(result){
						cmmcode.selectList(0,0,1,"최상위");
					},
					error : function(x, t, e) {
						handleErrorMessage(x, t, e);
					}
				});
			}			
		},
		
		clear: function() {
			$("#mo_codeName").val("");
			$("#mo_parentCodeNm").val("");
			$("#mo_description").val("");
			$("#mo_parentCode").val("");
			$("#mo_lev").val("");			
			
			$("#code").val("");
			$("#codeName").val("");
			$("#status").val("Y");
			$("#description").val("");
			$("#lev").val("");
			$("#parentCode").val("");
			
		},
		createHtml: function() {
			var i =  list_t_grid_code.length;
			var html = "";			
			
			for (i = 0 ; i < list_t_grid_code.length ; i++ ) {
				html += "<tr onclick='cmmcode.selectDtlOne("+list_t_grid_code[i]+")'>";
				html += "	<td><input type='checkbox' name='chs' class='checkbox' value='"+list_t_grid_code[i]+"'";
				if(list_t_grid_check[i]) {
					html += " checked='checked' ";
				}
				html += "/></td>";
				html += "	<td>"+list_t_grid_codeName[i]+"</td>";
				html += "	<td>"+list_t_grid_description[i]+"<input type='hidden' name='sortSequence' value='"+list_t_grid_code[i]+"/"+(i+1) +"'/></td>";
				html += "	<td>"+( (list_t_grid_status[i] == 'N') ? '미사용' : '사용' )+"</td>";
				html += "</tr>";
			}

			$("#tab_cmmCodeDtl > tbody").html(html);
		},		
		validate: function() {
			return true;
		}
};
