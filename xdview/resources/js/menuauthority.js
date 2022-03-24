var menuauthority = {

		checked: false,

		list_authority: function() {
			$.ajax({
				type: "POST",
				url: "/authority/listView.do",
				dataType : 'json',
				success:function(result){
					var html = "";
					if (result.data.length > 0) {
						$(result.data).each(function(i) {
							html += "<tr onclick='menuauthority.reg_auth(\""+this.id+"\",\""+this.authorityName+"\");'>";
							html += "	<td>"+this.id+"</td>";
							html += "	<td>"+this.authorityName+"</td>";
							html += "</tr>";
						
							document.getElementById("authorityId").add(new Option(this.authorityName, this.id))
						});
					}
					else {
						html = "<tr><td colspan='2'>조회결과가 없습니다.</td></tr>";
					}

					//$("#list_authority > tbody").html(html);
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td colspan='2'>조회결과가 없습니다.</td></tr>";
					//$("#list_authority > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},


		list_menu: function(menuName) {
			$.ajax({
				type: "POST",
				url: "/menuauthority/menulist.do",
				data: {"menuName":menuName},
				dataType : 'json',
				success:function(result){
					var html = "";
					if (result.data.length > 0) {
						$(result.data).each(function(i) {
							html += "<tr onclick='menuauthority.reg_menu(\""+this.id+"\""+","+"\""+this.name+"\");'>";
							html += "	<td>"+this.name+"</td>";
							html += "	<td>"+this.description+"</td>";
							html += "</tr>";

							$("#menuId").val(this.id);
							$("#menuName").val(this.name);
							menuauthority.list_menu_auth(this.id, "%");
						});
					}
					else {
						html = "<tr><td colspan='5'>조회결과가 없습니다.</td></tr>";
					}

					$("#list_menu > tbody").html(html);
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td colspan='5'>조회결과가 없습니다.</td></tr>";
					$("#list_menu > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},		
		list_menu_auth: function(menuId) {
			$.ajax({
				type: "POST",
				url: "/menuauthority/menulistauth.do",
				data: {"menuId": menuId},
				dataType : 'json',
				success:function(result){
					var html = "";
					if (result.data.length > 0) {
						
						list_t_grid = new Array();
						
						$(result.data).each(function(i) {
							html += "<tr onclick=''>";
							html += "	<td><input type='checkbox' name='chs' class='checkbox' value='"+this.id+"/"+this.authorityId+"'/></td>";
							html += "	<td align='center'>"+this.name+"</td>";
							html += "	<td align='center'>"+this.description+"</td>";							
							//html += "	<td>"+this.authorityId+"</td>";
							html += "	<td align='center'>"+this.authorityName+"</td>";
							html += "</tr>";
							
							list_t_grid[i] = this.id+"/"+this.authorityId;
						});
					}
					else {
						html = "<tr><td colspan='7'>조회결과가 없습니다.</td></tr>";
					}

					$("#list_authorityBymenu > tbody").html(html);
					
					var_t_state = true;
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td colspan='7'>조회결과가 없습니다.</td></tr>";
					$("#list_authorityBymenu > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},				
		reg_menu: function(menuId, menuName) {
			$("#menuId").val(menuId);
			$("#menuName").val(menuName);
			menuauthority.list_menu_auth(menuId, "%");
		},
		reg_auth: function(authId, authName){ 
			$("#authorityId").val(authId);
			$("#authorityName").val(authName);
		},
		deleteAll: function() {
//			if (!$("input[name=chs]").is(":checked")) {
//				alert("삭제할 대상을 선택해주세요.");
//				return;
//			}
//
//			if (confirm("해당 사용자를 삭제하시겠습니까?")) {
//				var fa = document.authorityBymenuForm;
//				fa.method = "POST";
//				fa.action = "/menuauthority/delete.do";
//				fa.submit();
//			}
			if (!$("input[name=chs]").is(":checked")) {
				alert("삭제할 권한을 선택해주세요.");
				return;
			}

			if (confirm("해당 권한을 삭제하시겠습니까?")) {

				var li_chs = new Array();
				var v = 0;
				var i = 0;
				
				for (v=0 ; v < $("input[name=chs]").length ; v++) {
					if ($("input[name=chs]")[v].checked) {
						li_chs[i] = list_t_grid[v];
						i++;
					}
				}

				$.ajax({
					type: "POST",
					url: "/menuauthority/delete.do",
					data: {"chs":li_chs,
						   "code":document.getElementById("code").value
					      },
					success:function(result){
						menuauthority.list_menu_auth($("#menuId").val(), "%");
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
				url: "/menuauthority/regist.do",
				data: {"menuId":$("#menuId").val(), "authorityId":$("#authorityId").val()},
				success:function(result){
					menuauthority.list_menu_auth($("#menuId").val(), "%");
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
