var jikmumanage = {
	
		asyncYN:true,
		checked: false,
		category_object:null,
		
		selectBox: function(code, target, callback) {
			$.ajax({
				type : "POST",
				url : "/jikmucode/json/list.do",
				data : { "code": code },
				dataType : 'json',
				async: jikmumanage.asyncYN,
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
					
				},
				complete : function() {
					//hideSelectBox();
					
				},
			
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				},
				
			});
		},
		//////////
		
		selectList: function(lev,id,gridLev, id_nm) {
			if(id == "")
				return
				$.ajax({
					type: "POST",
					url: "/jikmumanage/listbylev.do",
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

						if(gridLev != 4){
						
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
						else if(lev == 3 && $("#In_Code5").val() !=""   && t_stat_clean == false) {
							$("#list_lv4").val($("#In_Code5").val());
							$("#list_lv4").change();
							t_stat_clean = true;							
						}	
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
					},
					complete : function() {
						
						//$("#mo_parentCodeNm").html($("#list_lv1 option").clone());
						
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
				url: "/jikmumanage/listbylev.do",
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
							
							html += "<tr >";
							html += "	<td><center><input type='checkbox' name='chs' class='checkbox' value='"+this.id+"'/></center></td>";
							html += "	<td><a href=\"javascript:fnUpdateCode('"+this.id+"')\">"+this.name+"</td>";
							if($("#In_Lev0").val() == "4"){
								document.getElementById("cateXtitle").style.display="none";
								document.getElementById("cateXtitle2").style.display="";
								html += "	<td>"+this.catename+"</td>";
							}else{
								document.getElementById("cateXtitle").style.display="";
								document.getElementById("cateXtitle2").style.display="none";
								html += "	<td style='display:none;'>"+this.catename+"</td>";
							}
							html += "	<td>"+this.description+"<input type='hidden' name='sortSequence' value='"+this.id+"/"+this.sortSequence +"'/></td>";
							html += "	<td>"+( (this.status == 'N') ? '미사용' : '사용' )+"</td>";
							html += "	<td align='center'><a href=\"javascript:fnViewHistory('"+this.id+"')\">이력조회</td>";
							
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

					$("#tab_jikmumanageDtl > tbody").html(html);
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td colspan='5'>조회결과가 없습니다.</td></tr>";
					$("#tab_jikmumanageDtl > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},

		selectJikgunCate: function(lev) {

			var j = 0;

			$.ajax({
				type: "POST",
				url: "/jikmumanage/jikguncate.do",
				data: {},
				dataType : 'json',
				success:function(result){
					
					var html = "";
					if (result.data.length > 0) {
						listObj = document.getElementById("catecode");
						listObj.options.length = 0;

						if(result != null) {
							if(result.data.length == 0) {
								listObj.add(new Option("조회 데이터 없음", ""));
							}

							listObj.add(new Option("", ""));
							$(result.data).each(function(i) {
								listObj.add(new Option(this.catename, this.catecode));
							});
						}
						else {
							listObj.add(new Option("조회 데이터 없음", ""));
						}				

						listObj = document.getElementById("mo_catecode");
						listObj.options.length = 0;

						if(result != null) {
							if(result.data.length == 0) {
								listObj.add(new Option("조회 데이터 없음", ""));
							}

							listObj.add(new Option("", ""));
							$(result.data).each(function(i) {
								listObj.add(new Option(this.catename, this.catecode));
							});
						}
						else {
							listObj.add(new Option("조회 데이터 없음", ""));
						}				
					
					}
					else {
					}
				},
				error : function(x, t, e) {
					handleErrorMessage();
				}
			});
		},
		
		selectDtlOne: function(id) {
			
			$.ajax({
				type: "POST",
				url: "/jikmumanage/view.do",
				data: {"id":id },
				dataType : 'json',
				success:function(result){
					$("#id").val(result.id);
					$("#name").val(result.name);              // 화면명
					$("#status").val(result.status);
					$("#url").val(result.url);
					$("#catecode").val(result.catecode);      // 설명
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
				url: "/jikmumanage/regist.do",
				data: {"name":$("#mo_codeName").val()
					//,"parentId":$("#mo_parentCodeNm2").val()
					,"parentId":$("#mo_parentId").val()
					,"lev":$("#mo_lev").val()
					,"url":$("#mo_url").val()
					,"catecode":$("#mo_catecode").val()
					,"description":$("#mo_description").val()
					,"status":$("#mo_status").val()},
				success:function(result){
					dialogClose('saveManager');

					//jikmumanage.selectList(0,1,1,"최상위");
					
					jikmumanage.selectDtlList(1);
					
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});				
		},
		
		updateCategory: function(varx) {
			var chsLength = $("input[name=chs]:checked").length;
			var code;
			var _varx = varx;
			//alert(varx);
			$.ajax({
				type: "POST",
				url: "/jikmumanage/view.do",
				data: {"id":varx },
				dataType : 'json',
				success:function(result){
					
					$("#id").val(result.id);
					$("#lev").val(result.lev);
					//$("#lev").text(result.lev);
					$("#sortSequence").val(result.sortSequence);
					
					/*
					$("#id").val(result.id);
					$("#name").val(result.name);              // 화면명
					$("#status").val(result.status);
					$("#url").val(result.url);
					$("#catecode").val(result.catecode);      // 설명
					$("#description").val(result.description);
					$("#lev").val(result.lev);
					$("#lev").text(result.lev);
					$("#parentId").val(result.parentId);
					$("#sortSequence").val(result.sortSequence);
					$("#parentIdName").val(result.parentName);
					*/
					$("#mo_codeName").val(result.name);
					$("#mo_description").val(result.description);

					selectChange("#mo_catecode", result.catecode);
					selectChange("#mo_status",result.status);
					
					//alert($("#list_lv1 option:selected").val());
					//selectChange("#mo_parentCodeNm",$("#list_lv1 option:selected").val());
					selectChange("#mo_parentCodeNm2",result.parentId);
					
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
				
			});

//			if ( chsLength == 0 ) {
//				alert("수정할 구분을 선택해 주세요.");
//				return ;
//			} else if ( chsLength > 1) {
//				alert("수정할 구분 하나만 선택해 주세요.");
//				return ;
//			} else { 
			
			dialogOpen('saveManager');
			$("#mo_chk_lev").attr('disabled', 'true');  // 최상위 비활성
			
//			}
			
		},
		
		modify: function() {
						
			var parentId = 1;
			
			if($("#mo_parentCodeNm2").val() != null){
				parentId = $("#mo_parentCodeNm2").val();
			}else {
				parentId = $("#mo_parentCodeNm").val();
			}
						
			
			//alert(parentId);
			
			if(xx == 1 || xx =='') parentId = 1;
			
			$.ajax({
				type: "POST",
				url: "/jikmumanage/modify.do",
				data: {
					 "id":$("#id").val()
					,"name":$("#mo_codeName").val()
					,"parentId":parentId
					,"sortSequence":$("#sortSequence").val()
					,"lev":$("#lev").val()
					,"catecode":$("#mo_catecode").val()
					,"description":$("#mo_description").val()
					,"status":$("#mo_status").val()
				},

				success:function(result){
					
					dialogClose('saveManager');
					alert("저장 되었습니다.");
					//alert($("#id").val());
					//alert($("#lev").val());
					//jikmumanage.selectDtlList('2');
					jikmumanage.selectDtlOne($("#id").val());
					jikmumanage.selectDtlList($("#lev").val()-1);
					//jikmumanage.selectList(0,1,1,"최상위");
					
					//jikmumanage.selectDtlList(3);						
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

			if (confirm("해당 코드를 삭제하시겠습니까?")) {

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
					url: "/jikmumanage/delete.do",
					data: {"li_chs":li_chs},
					success:function(result){
						jikmumanage.selectList(0,1,1,"최상위");
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
				url: "/jikmumanage/modify_sort.do",
				data: {"t_sortSequence": t_sortSequence},
					
				success:function(result){
					if($("#id").val() != "") {
						jikmumanage.selectDtlOne($("#id").val());
					}
					if($("#lev").val() != "") {
						jikmumanage.selectDtlList($("#lev").val());
					}
					jikmumanage.selectList(0,1,1,"최상위");					
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});						
		},
		
		selectMainHistoryList: function() {   
			var progress = new Progress();

			$.ajax({
				type : "POST",
				url : "/jikmumanage/jikmuHistory.do",
				data : { "id": $("#Idx").val() },
				dataType : 'json',
				success : function(result) {
					
					var html = "";
					var preJobStartDate = "";
					var temp_class = "class='tr-case1'";

					if (result.success) {
						
						$(result.data).each(function(index) {

							if(index%2==1) {
								html += "<tr class='tr-case1'>";
							} else {
								html += "<tr>";
							}
							
							html += "   <td class='txt-center' >"+this.name+"</td>";
							html += "   <td class='txt-center' >"+this.catename+"</td>";
							html += "   <td class='txt-center' >"+this.description+"</td>";
							html += "   <td class='txt-center' >"+this.start_date+"</td>";
							html += "   <td class='txt-center' >"+this.end_date+"</td>";

							html += "</tr>";
							
						});
					} else {
						html = "<tr><td class='txt-center' colspan='5'>조회결과가 없습니다.</td></tr>";
					}

						$("#tableId2 > tbody").html(html);
						tableScrollling("divHeader2", "divContent2", "tableId2");
					
					
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
		
		clear: function() {
			$("#mo_codeName").val("");
			$("#mo_url").val("");
			$("#mo_description").val("");
			$("#catecode").val("")
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
				html += "<tr onclick='jikmumanage.selectDtlOne("+list_t_grid_id[i]+")'>";
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

			$("#tab_jikmumanageDtl > tbody").html(html);
		},
		validate: function() {
			return true;
		}
};

function selectChange(nm,val){ 
	$(nm).val(val);
	$(nm).change();
}

function delay(gap){ /* gap is in millisecs */ 
	  var then,now; 
	  then=new Date().getTime(); 
	  now=then; 
	  while((now-then)<gap){ 
	    now=new Date().getTime();  // 현재시간을 읽어 함수를 불러들인 시간과의 차를 이용하여 처리 
	  } 
}


function hideSelectBox() {
	$("#mo_parentCodeNm2").each(function(i) {
		//console.log(">>> "+$(this).attr("id")+":"+$(this).children("option").length);
		if($(this).children("option").size() == 0) {
			//$(this).hide();
		} else {
			$(this).show();
		}
	});
}

function clearSelect(id) {
	$("#"+id).html("");
	//hideSelectBox();
}

