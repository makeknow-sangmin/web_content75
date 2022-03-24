positionCodelist = new Array();
var upChk ;
var positionweight = {

		checked: false,
		
		listView: function() {
			$.ajax({
				type: "POST",
				url: "/positionweight/listView.do",
//				data: {"lev":lev, "code":code},
				dataType : 'json',
				success:function(result){
					var html = "";
					
					if (result.data.length > 0) {
						$(result.data).each(function(i) {
							//html += "<tr onclick=''>";
							html += "<tr class='codeDetailChkbox' onclick=\"positionweight.selectDtlOne('"+i+"','"+this.id+"','"+this.positionCode+"','"+this.positionName+"','"+this.weight+"','"+this.cost+"')\">";
							html += "	<td><center><input type='checkbox' name='chs' class='checkbox' value='"+this.id+"'/></center></td>";
							html += "	<td>"+this.positionCode+"</td>";
							html += "	<td>"+this.positionName+"</td>";
							html += "	<td>"+parseFloat(this.weight).toFixed(1)      +"</td>";
							html += "	<td>"+this.cost+"</td>";
							html += "</tr>";
							
							list_t_grid[i] = this.id;
							
							positionCodelist[i] = this.positionCode;
						});
					}
					else {
						html = "<tr><td colspan='5'>조회결과가 없습니다.</td></tr>";
					}

					$("#list_authority2 > tbody").html(html);
					
					positionweight.insertInit();
					
					upChk = "";
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td colspan='5'>조회결과가 없습니다.</td></tr>";
					$("#list_positionweight2 > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},

		deleteAll: function() {
//				var fa = document.listForm;
//				fa.method = "POST";
//				fa.action = "/positionweight/delete.do";
//				fa.submit();

			if (!$("input[name=chs]").is(":checked")) {
				alert("삭제할 대상을 선택해주세요.");
				return;
			}

			if (confirm("해당 코드를 삭제하시겠습니까?")) {

				var li_chs = new Array();
				var v = 0;
				var i = 0;
				alert("삭제전");
				for (v=0 ; v < $("input[name=chs]").length ; v++) {
					if ($("input[name=chs]")[v].checked) {
						li_chs[i] = list_t_grid[v];
						alert(li_chs[i]);
						i++;
					}
				}

				$.ajax({
					type: "POST",
					url: "/positionweight/delete.do",
					data: {"chs":li_chs},
					success:function(result){
						positionweight.listView();
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
				url: "/positionweight/regist.do",
				data: {  "positionCode":$("#reg_positionCode").val()
					      , "positionName":$("#reg_positionName").val()
					      , "weight":$("#reg_weight").val()
					      , "cost":$("#reg_cost").val()
					     },
//				dataType : 'json',
				success:function(result){
					dialogClose('saveManager');
					positionweight.listView();
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});						
		},
		
		validate: function() {
			return true;
		},
		
		selectDtlOne: function(seq, id, positionCode, positionName, weight, cost) {
			upChk = seq;
						
			$("#id").val(id);
			$("#positionCode").val(positionCode);
			$("#positionName").val(positionName);
			if(weight == "")	$("#weight").val(weight);
			else	$("#weight").val(parseFloat(weight).toFixed(1));	
			$("#cost").val(cost);
		},
		
		modify: function() {
			$.ajax({
				type: "POST",
				url: "/positionweight/modify.do",
				data: {  "id":$("#id").val()
						  , "positionCode":$("#positionCode").val()
					      , "positionName":$("#positionName").val()
					      , "weight":$("#weight").val()
					      , "cost":$("#cost").val()
					     },
//				dataType : 'json',
				success:function(result){
					positionweight.listView();
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});	
		},
		
		numCheck: function(str) {
			regexp=/[^0-9|.]/gi;
			if(regexp.test(str)){
				alert("가중치에는 숫자 및  . 만 입력가능합니다.");				
				$("#weight").focus();
				$("#reg_weight").focus();
				return true;
			} else {
				return false;
			}
		},
		
		numCheckCost: function(str) {
			regexp=/[^0-9]/gi;
			if(regexp.test(str)){
				alert("비용에는 숫자만 입력가능합니다.");				
				$("#cost").focus();
				$("#reg_cost").focus();
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
				alert("직급코드가 중복되었습니다. \n코드 확인 후 다시 입력해 주세요.");
				$("#positionCode").val(tmpValue);
				$("#positionCode").focus();
			}
			
			return rechk;
		},
		
		insertInit: function() {
			$("#id").val("");
			$("#positionCode").val("");
			$("#positionName").val("");
			$("#weight").val("");
			$("#cost").val("");
			
			$("#reg_positionCode").val("");
			$("#reg_positionName").val("");
			$("#reg_weight").val("");
			$("#reg_cost").val("");
			
			//$("#show_insert").css("display", "");			
			//$("#show_update").css("display", "none");
			
			$(".codeDetailChkbox").removeClass("tr-point");			
		}
};
