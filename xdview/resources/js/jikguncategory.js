positionCodelist = new Array();
var upChk ;
var jikguncategory = {
		asyncYN:true,
		checked: false,
		category_object:null,
		
		listView: function() {
			$.ajax({
				type: "POST",
				url: "/jikguncategory/listView.do",
//				data: {"lev":lev, "code":code},
				dataType : 'json',
				success:function(result){
					var html = "";
					
					if (result.data.length > 0) {
						
						list_t_grid_code         =  new Array();  
						list_t_grid_codeName 	 =  new Array();
						list_t_grid_description  =  new Array();
						list_t_grid_status 		 =  new Array();
						list_t_grid_sortSequence =  new Array();
						
						$(result.data).each(function(i) {

							html += "<tr class='codeDetailChkbox' onclick=\"jikguncategory.selectDtlOne('"+i+"','"+this.code+"','"+this.codeName+"','"+this.description+"','"+this.sortSequence+"','"+this.status+"')\">";
							html += "	<td><center><input type='checkbox' name='chs' class='checkbox' value='"+this.code+"'/></center></td>";
							html += "	<td><a href=\"javascript:fnUpdateCode('"+this.code+"')\">"+this.codeName+"</td>";
							html += "	<td>"+this.description+"</td>";
							html += "	<td>"+( (this.status == 'N') ? '미사용' : '사용' )+"</td>";
							html += "</tr>";
							
							//list_t_grid[i] = this.code;
							//positionCodelist[i] = this.codeName;
							
							list_t_grid_code[i]         =  this.code;
							list_t_grid_codeName[i]     =  this.codeName;
							list_t_grid_description[i]  =  this.description;
							list_t_grid_status[i]       =  this.status;
							list_t_grid_sortSequence[i] =  this.sortSequence;									
							
						});
					}
					else {
						html = "<tr><td colspan='4'>조회결과가 없습니다.</td></tr>";
					}

					$("#tableId1 > tbody").html(html);
					tableScrollling("divHeader1", "divContent1", "tableId1");
					jikguncategory.insertInit();
					
					upChk = "";
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td colspan='4'>조회결과가 없습니다.</td></tr>";
					
					$("#tableId1 > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},

		selectDtlOne: function(seq, code, codeName, description, sortSequence, status) {
			upChk = seq;
						
			$("#code").val(code);
			$("#codeName").val(codeName);
			$("#description").val(description);
			if(sortSequence == "")	
				$("#sortSequence").val(sortSequence);
			else	
				$("#sortSequence").val(sortSequence);	
			$("#reg_status").val(status);
		},
		
		
		deleteAll: function() {
			if (!$("input[name=chs]").is(":checked")) {
				alert("삭제할 대상을 선택해주세요.");
				return;
			}

			if (confirm("해당 카테고리를 삭제하시겠습니까?")) {

				var li_chs = new Array();
				var v = 0;
				var i = 0;
				
				for (v=0 ; v < $("input[name=chs]").length ; v++) {
					if ($("input[name=chs]")[v].checked) {
						//li_chs[i] = list_t_grid[v];
						li_chs[i] = list_t_grid_code[v];
						i++;
					}
				}
				$.ajax({
					type: "POST",
					url: "/jikguncategory/delete.do",
					data: {"chs":li_chs},
					success:function(result){
						jikguncategory.listView();
					},
					error : function(x, t, e) {
						handleErrorMessage(x, t, e);
					}
				});
			}
		},
		
		regist: function() {
			$.ajax({
				type: "POST",
				url: "/jikguncategory/regist.do",
				data: {
						"codeName":$("#reg_codeName").val()
					   ,"description":$("#reg_description").val()
					   ,"sortSequence":$("#reg_sortSequence").val()
					   ,"status":$("#reg_status").val()
				},
				success:function(result){
					dialogClose('saveManager');
					jikguncategory.listView();
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});						
		},
		
		updateCategory: function(varx) {
			var chsLength = $("input[name=chs]:checked").length;
			var code =  0;
			
//			if ( chsLength == 0 ) {
//				alert("수정할 카테고리를 선택해 주세요.");
//				return ;
//			} else if ( chsLength == 1) {
//				code = $("input[name=chs]:checked").val();
//				$("#code").val(code);
//			} else {
//				alert("수정할 카테고리를 하나만 선택해 주세요.");
//				return ;
//			}
			
			$.ajax({
				type : "POST",
				url : "/jikguncategory/updateCheckeCode.do",  
				data : { 
					"code": varx
				},
				dataType : 'json',
				success : function(result) {
					if (result.success) { 
						dialogOpen('saveManager');
						jikguncategory.category_object = result.list; 
						 
					} else {
						alert("수정할 수 없습니다.\n다시 확인해 주세요.");
					}
				}
				,error : function(x, t, e){}
				,complete : function() {
					jikguncategory.updateForm();
				}
				
			   });
		},
		
		updateForm: function() { 
			
			list = jikguncategory.category_object; 
			
			//selectbox 동기로 바꿈
			jikguncategory.asyncYN = false;
			
			$("#reg_codeName").val(list.codeName);
			$("#reg_description").val(list.description);
			$("#reg_sortSequence").val(list.sortSequence);
			selectChange("#reg_status",list.status);
			
			jikguncategory.asyncYN = true;
			
			//$("#reg_status").val(list.status);
			
			
			// selectbox 비동기로 바꿈
						
			//selectChange("#jikmuDiv1",list.jikmuDiv1) ;
			//selectChange("#jikmuDiv2",list.jikmuDiv2) ;
			//selectChange("#jikmuDiv3",list.jikmuDiv3) ;
					
			/*
			if(list.strjikmuEnd == "9999-12-31"){
				$("#jikmu_end").val("");
			}else{
				$("#jikmu_end").val(list.strjikmuEnd);
			}
			*/
					
			// 직무승인상태가 완료:Y
			/*
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
			*/
		},		
		
		modify: function() {
			$.ajax({
				type: "POST",
				url: "/jikguncategory/modify.do",
				data: {     "code":$("#code").val()
						  , "codeName":$("#reg_codeName").val()
					      , "description":$("#reg_description").val()
					//      , "sortSequence":$("#sortSequence").val()
					      , "status":$("#reg_status").val()
			    },
				success:function(result){
					dialogClose('saveManager');
					jikguncategory.listView();
					
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
				url: "/jikguncategory/modify_sort.do",
				data: {"t_sortSequence": t_sortSequence},
					
				success:function(result){
					
					jikguncategory.listView();
					/*
					if($("#code").val() != "") {
						cmmcode.selectDtlOne($("#code").val());
					}
					if($("#lev").val() != "") {
						cmmcode.selectDtlList($("#lev").val());
					}
					cmmcode.selectList(0,0,1,"최상위");
					*/					
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});			
		},		
		
		numCheck: function(str) {
			regexp=/[^0-9]/gi;
			if(regexp.test(str)){
				alert("순서에는 숫자(정수) 만 입력가능합니다.");				
			//	$("#sortSequence").focus();
			//	$("#reg_sortSequence").focus();
				return true;
			} else {
				return false;
			}
		},
		
		numCheckCost: function(str) {
			regexp=/[^0-9]/gi;
			if(regexp.test(str)){
				alert("비용에는 숫자만 입력가능합니다.");				
				$("#status").focus();
				$("#reg_status").focus();
				return true;
			} else {
				return false;
			}
		},
		
		codeCheck: function(str, gubun) {
			var rechk = false;
			var tmpValue = "";
			if(gubun == "up"){
				tmpValue = positionCodelist[upChk];
				positionCodelist[upChk] = "";
			}
			for(var k=0; k < positionCodelist.length; k++)
			{
				if(positionCodelist[k] == str){
					rechk = true;;
				}
			}
			positionCodelist[upChk] = tmpValue;
			
			if(rechk){
				alert("직군코드가 중복되었습니다. \n코드 확인 후 다시 입력해 주세요.");
				$("#codeName").val(tmpValue);
				$("#codeName").focus();
			}
			
			return rechk;
		},
		
		insertInit: function() {
			
			$("#code").val("");
			$("#codeName").val("");
			$("#description").val("");
			$("#sortSequence").val("");
			$("#status").val("");
	
			$("#reg_codeName").val("");
			$("#reg_description").val("");
			$("#reg_sortSequence").val("");
			$("#reg_status").val("");
			
			//$("#show_insert").css("display", "");			
			//$("#show_update").css("display", "none");
			
			$(".codeDetailChkbox").removeClass("tr-point");			
		},
		
		createHtml: function() {
			var i =  list_t_grid_code.length;
			var html = "";			
			
			for (i = 0 ; i < list_t_grid_code.length ; i++ ) {
				
				//html += "<tr onclick='cmmcode.selectDtlOne("+list_t_grid_code[i]+")'>";
				//html += "	<td><input type='checkbox' name='chs' class='checkbox' value='"+list_t_grid_code[i]+"'";
				//html += "<tr onclick=''>";
				html += "<tr class='codeDetailChkbox' onclick=\"jikguncategory.selectDtlOne('"+i+"','"+list_t_grid_code[i]+"','"+list_t_grid_codeName[i]+"','"+list_t_grid_description[i]+"','"+list_t_grid_sortSequence[i]+"','"+list_t_grid_status[i]+"')\">";
				html += "	<td><center><input type='checkbox' name='chs' class='checkbox' value='"+list_t_grid_code[i]+"'";
				if(list_t_grid_check[i]) {
					html += " checked='checked' ";
				}
				html += "/></center></td>";
				html += "	<td>"+list_t_grid_codeName[i]+"</td>";
				html += "	<td>"+list_t_grid_description[i]+"<input type='hidden' name='sortSequence' value='"+list_t_grid_code[i]+"/"+(i+1) +"'/></td>";
				html += "	<td>"+( (list_t_grid_status[i] == 'N') ? '미사용' : '사용' )+"</td>";
				html += "</tr>";

			}
	
			$("#tableId1 > tbody").html(html);
			
		},
		validate: function() {
			return true;
		}
};

function selectChange(nm,val){ 
	$(nm).val(val);
	$(nm).change();
}
