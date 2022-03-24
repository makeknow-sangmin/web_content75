/**************************************************************************************
 * <pre> 
 * PackageName : views/system
 * FileName    : menu_manage.jsp
 * </pre>
 * @Title		: 시스템관리 - 메뉴관리 
 * @Description : 시스템관리 - 메뉴관리 js
 * @Version     : 
 * @Author      : YounghoLee
 * @Date        : 2015.11.19
**************************************************************************************/		

var menumanage = {
	
		checked: false,

		selectList: function(lev,id,gridLev, id_nm) {
			if(id == "")
				return
				$.ajax({
					type: "POST",
					url: "/menumanage/listbylev.do",
					data: {"lev":lev, "id":id},
					dataType : 'json',
					success:function(result){
						var listObj;
						var strObj;

						$("#In_Lev0").val(Number(lev)+1);
						$("#In_Code0").val(id);
						$("#In_CodeName0").val(id_nm);
						
						var tmp_lev = document.getElementById("In_Lev"+gridLev);
						var tmp_code = document.getElementById("In_Code"+gridLev);

						tmp_lev.setAttribute("value",lev);
						tmp_code.setAttribute("value",id);				

						strObj = "list_lv" + gridLev;

						listObj = document.getElementById(strObj);

						listObj.options.length = 0;

						if(result != null) {
							if(result.data.length == 0) {
								listObj.add(new Option("조회 데이터 없음", ""));
							}

							$(result.data).each(function(i) {
								listObj.add(new Option(this.name, this.id));
							});
						}
						else {
							listObj.add(new Option("조회 데이터 없음", ""));
						}

						var i = 0;
						for(i=(gridLev + 1); i<4 ; i++)  {
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
						listObj.add(new Option("조회 데이터 없음", ""));
					}
				});
		},

		selectDtlList: function(lev) {
			
			var tmp_code = document.getElementById("In_Code"+lev);
			var tmp_lev = document.getElementById("In_Lev"+lev);
			var j = 0;

			id = tmp_code.getAttribute("value");
			lev = tmp_lev.getAttribute("value");

			$.ajax({
				type: "POST",
				url: "/menumanage/listbylev.do",
				data: {"lev":lev, "id":id},
				dataType : 'json',
				success:function(result){
					var html = "";
					if (result.data.length > 0) {
						
						list_t_grid_id =  new Array();
						list_t_grid_name =  new Array();
						list_t_grid_url =  new Array();
						list_t_grid_description =  new Array();
						list_t_grid_status =  new Array();
						list_t_grid_sortSequence =  new Array();						
						
						$(result.data).each(function(i) {
							
							html += "<tr onclick='menumanage.selectDtlOne("+this.id+")'>";
							html += "	<td><center><input type='checkbox' name='chs' class='checkbox' value='"+this.id+"'/></center></td>";
							html += "	<td>"+this.name+"</td>";
							html += "	<td>"+this.url+"</td>";
							html += "	<td>"+this.description+"<input type='hidden' name='sortSequence' value='"+this.id+"/"+this.sortSequence +"'/></td>";
							html += "	<td>"+( (this.status == 'N') ? '미사용' : '사용' )+"</td>";
							html += "</tr>";
							
							list_t_grid_id[i] =  this.id;
							list_t_grid_name[i] =  this.name;
							list_t_grid_url[i] =  this.url;
							list_t_grid_description[i] =  this.description;
							list_t_grid_status[i] =  this.status;
							list_t_grid_sortSequence[i] =  this.sortSequence;
							
							j++;
						});
					}
					else {
						html = "<tr><td colspan='5'>조회결과가 없습니다.</td></tr>";
					}

					$("#tab_menuManageDtl > tbody").html(html);
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td colspan='5'>조회결과가 없습니다.</td></tr>";
					$("#tab_menuManageDtl > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},
		
		selectDtlOne: function(id) {
			$.ajax({
				type: "POST",
				url: "/menumanage/view.do",
				data: {"id":id },
				dataType : 'json',
				success:function(result){
					$("#id").val(result.id);
					$("#name").val(result.name);
					$("#status").val(result.status);
					$("#url").val(result.url);
					$("#description").val(result.description);
					$("#lev").val(result.lev);
					$("#lev").text(result.lev);
					$("#parentId").val(result.parentId);
					$("#sortSequence").val(result.sortSequence);
					$("#parentIdName").val(result.parentName);
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});
		},

		regist: function() {
			$.ajax({
				type: "POST",
				url: "/menumanage/regist.do",
				data: {"name":$("#mo_codeName").val()
					,"parentId":$("#mo_parentId").val()
					,"lev":$("#mo_lev").val()
					,"url":$("#mo_url").val()
					,"description":$("#mo_description").val()
					,"status":$("#mo_status").val()},
				success:function(result){
					dialogClose('saveManager');

					menumanage.selectList(0,1,1,"최상위");
					
					menumanage.selectDtlList(1);
					
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});				
		},
		
		updateCategory: function() {
			var chsLength = $("input[name=chs]:checked").length;
			//var code;
			
			if ( chsLength == 0 ) {
				alert("수정할 카테고리를 선택해 주세요.");
				return ;
			} else if ( chsLength == 1) {
				// code = $("input[name=chs]:checked").val();
				//alert(code);
				//$("#code").val(code);
			} else {
				alert("수정할 카테고리를 하나만 선택해 주세요.");
				return ;
			}
			
			dialogOpen('saveManager');
			
			$("#mo_codeName").val($("#name").val());
			$("#mo_url").val($("#url").val());
			$("#mo_description").val($("#description").val());
			//$("#mo_parentCodeNm").val($("#parentId").val());
			$("#mo_parentCodeNm").val($("#parentIdName").val());
			selectChange("#mo_status",$("#status").val());
			//selectChange("#mo_catecode", $("#catecode").val());
			
		
			$("#mo_chk_lev").attr('disabled', 'true');  // 최상위 비활성
			
			/*
			직무코드명		mo_codeName
			설명            mo_description
			상위코드        mo_parentCodeNm
			
			Category		mo_catecode       select
			상태            mo_status         select
			최상위          mo_chk_lev        checkbox    checked="false"
			*/
			
		},
		
		modify: function() {
			$.ajax({
				type: "POST",
				url: "/menumanage/modify.do",
				data: {
					 "id":$("#id").val()
					,"name":$("#mo_codeName").val()
					,"parentId":$("#parentId").val()
					,"sortSequence":$("#sortSequence").val()
					,"lev":$("#lev").val()
					,"url":$("#mo_url").val()
					,"description":$("#mo_description").val()
					,"status":$("#mo_status").val()},
				success:function(result){
					//alert($("#id").val() + " " + $("#lev").val());
					dialogClose('saveManager');
					menumanage.selectDtlOne($("#id").val());
					menumanage.selectDtlList($("#lev").val());
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});			
		},

		deleteAll: function() {
			if (!$("input[name=chs]").is(":checked")) {
				alert("삭제할 대상을 선택해주세요.");
				return;
			}

			if (confirm("해당 메뉴를 삭제하시겠습니까?")) {

				var li_chs = new Array();
				var v = 0;
				var i = 0;
				
				for (v=0 ; v < $("input[name=chs]").length ; v++) {
					if ($("input[name=chs]")[v].checked) {
						li_chs[i] = list_t_grid_id[v];
						i++;
					}
				}
				$.ajax({
					type: "POST",
					url: "/menumanage/delete.do",
					data: {"li_chs":li_chs},
					success:function(result){
						
						//alert($("#lev").val());
						menumanage.selectList(0,1,1,"최상위");
						menumanage.selectDtlList($("#lev").val());
					},
					error : function(x, t, e) {
						handleErrorMessage(x, t, e);
					}
				});
			}			
		},

		modify_sort: function() {

			var t_sortSequence = new Array();
			var i = 0;
			
			for(i  = 0 ; i < list_t_grid_id.length ; i++) {
				t_sortSequence[i] = list_t_grid_id[i]+"/"+(i+1);
			}
			
			$.ajax({
				type: "POST",
				url: "/menumanage/modify_sort.do",
				data: {"t_sortSequence": t_sortSequence},
					
				success:function(result){
					if($("#id").val() != "") {
						menumanage.selectDtlOne($("#id").val());
					}
					if($("#lev").val() != "") {
						menumanage.selectDtlList($("#lev").val());
					}
					
					
					menumanage.selectList(0,1,1,"최상위");					
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});						
		},
		
		clear: function() {
			$("#mo_codeName").val("");
			$("#mo_url").val("");
			$("#mo_description").val("");
			$("#mo_parentCodeNm").val("");
			$("#mo_status").val("Y");
			$("#mo_chk_lev").defaultchecked = false ;
			$("input:checkbox[name=chk_lev]").prop("checked", false);
			$("#mo_parentId").val("");
			$("#mo_lev").val("");
		},
		createHtml: function() {
			var i =  list_t_grid_id.length;
			var html = "";			
			for (i = 0 ; i < list_t_grid_id.length ; i++ ) {
				html += "<tr onclick='menumanage.selectDtlOne("+list_t_grid_id[i]+")'>";
				html += "	<td><center><input type='checkbox' name='chs' class='checkbox' value='"+list_t_grid_id[i]+"'";
				if(list_t_grid_check[i]) {
					html += " checked='checked' ";
				}
				html += "/></center></td>";
				html += "	<td>"+list_t_grid_name[i]+"</td>";
				html += "	<td>"+list_t_grid_url[i]+"</td>";
				html += "	<td>"+list_t_grid_description[i]+"<input type='hidden' name='sortSequence' value='"+list_t_grid_id[i]+"/"+(i+1) +"'/></td>";
				html += "	<td>"+( (list_t_grid_status[i] == 'N') ? '미사용' : '사용' )+"</td>";
				html += "</tr>";
			}

			$("#tab_menuManageDtl > tbody").html(html);
		},
		validate: function() {
			return true;
		}
};

function selectChange(nm,val){ 
	$(nm).val(val);
	$(nm).change();
}
