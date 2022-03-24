var manager = {
	checked: false,
	view: function(id) {
		$.ajax({
			type : "POST",
			url : "/manager/view.do",
			data : { "id": id },
			dataType : 'json',
			success : function(result) {
				if (result.success) {
					var manager = result.data;
					$("#managerId").val(manager.id);
					$("#loginId").val(manager.loginId);
					$("#name").val(manager.name);
					$("#auth").val(manager.auth);
					$("input:radio[name=auth]:input[value='"+manager.auth+"']").prop("checked", true);
				}
				dialogOpen('saveManager');
				$(".saveManager").dialog("option","title","관리자 수정");
				$("#saveManager").html("수정");
			},
			beforeSend : function() {
				manager.clear();
				// 중복확인 비활성화
				$("#loginId").removeClass("member_input_style1").addClass("member_input_style3");
				$("#loginId").prop("disabled", true);
				$("#check").hide();
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			}
		});
	},
	modify: function() {
		var f = document.saveForm;
		f.method = "POST";
		f.action = "/manager/modify.do";
		f.submit();
	},
	regist: function() {
		if (this.validate()) {
			var f = document.saveForm;
			f.method = "POST";
			f.action = "/manager/regist.do";
			f.submit();
		}
	},
	deleteAll: function() {
		if (!$("input[name=chs]").is(":checked")) {
			alert("삭제할 대상을 선택해주세요.");
			return;
		}

		if (confirm("해당 사용자를 삭제하시겠습니까?")) {
			var f = document.listForm;
			f.method = "POST";
			f.action = "/manager/delete.do";
			f.submit();
		}
	},
	check: function() {
		if($("#loginId").val().length == 0)	{	alert("로그인 아이디를 입력해 주세요.");	$("#loginId").focus();	return;	}
		
		$.ajax({
			type : "POST",
			url : "/manager/checkLoginId.do",
			data : { "loginId": $("#loginId").val() },
			dataType : 'json',
			success : function(result) {
				alert(result.message);
				if (result.success == true) {
					manager.checked = true;
					$("#name").focus();
				} else {
					$("#loginId").val("").focus();
				}
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			}
		});
	},
	clear: function () {
		$("#managerId").val("");
		$("#loginId").val("");
		$("#name").val("");
		$("input:radio[name=auth]").prop("checked", false);
		manager.checked = false;
		// 중복확인 활성화
		$("#loginId").removeClass("member_input_style3").addClass("member_input_style1");
		$("#loginId").prop("disabled", false);
		$("#check").show();
	},
	validate: function() {
		return true;
	}

};
