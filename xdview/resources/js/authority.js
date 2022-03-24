var authority = {
		checked: false,
		listView: function() {
			$.ajax({
				type: "POST",
				url: "/authority/listView.do",
//				data: {"lev":lev, "code":code},
				dataType : 'json',
				contentType:"application/json; charset=UTF-8",
				beforeSend : function() {
					//$("#tableId1 > tbody").html("<tr class=\"txt-center\"><td colspan=\"3\">조회 중...</td></tr>");
				},
				success:function(result){				
					var _html = "";
					list_user_auth = new Array();
					if (result.data.length > 0) {
						$(result.data).each(function(i) {
							if(i==0) selected="select-row"; else selected=""; //첫행 자동선택
							
							_html += "<tr class='txt-center "+selected+"' value='"+this.id+"'  status='"+this.status+"'>";
      						_html += "<td>"+this.authorityName+"</td>";
      						_html += "<td>"+this.description+"</td>";
      						_html += "<td>"+( (this.status == 'N') ? '미사용' : '사용' )+"</td>";
      						_html += "</tr>";
							
							list_t_grid[i] = this.id;
						});
					}
					else {
						html = "<tr><td colspan='3'>조회결과가 없습니다.</td></tr>";
					}

					$("#tableId1 > tbody").html(_html);
					tableScrollling("divHeader1", "divContent1", "tableId1");
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td colspan='3'>조회결과가 없습니다.</td></tr>";
					$("#tableId1 > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},
		
		validate: function() {
			return true;
		}
};

/* init dialog */
function initInpDialog() {
	$("#inp_dialog").dialog({
		autoOpen : false,
		width : 340,
		modal : true,
		show: {effect: "blind",duration: 250},
		buttons : { },
		open : function(){
			
			//$(".ui-state-error").removeClass("ui-state-error");

			var _t = $(this).data("type");
			
			if(_t=="I"){
				//$('#inp_position').removeOption(/./).ajaxAddOption("/code/combo/position.do",{},false,setOpt,[]);
			} else {	
				var _id = $("#tableId1 .select-row").attr("value");
				var _status = $("#tableId1 .select-row").attr("status");
				if(_id){
					$('#authorityName').val($("#tableId1 .select-row td:nth-child(1)").text());
					$('#description').val($("#tableId1 .select-row td:nth-child(2)").text());
					$('#status').val(_status);

				} else {
					alert("대상이 선택되지 않았습니다.");
					$(this).dialog("close");
				}
			}
			
			if(_t=="I") { 
				$(this).dialog({ title: "신규등록" }); $("#btn_insert").show(); $("#btn_update").hide(); 
			} else if(_t=="U") {
				$(this).dialog({ title: "수정" }); $("#btn_insert").hide(); $("#btn_update").show(); 
			} 
				
		},
		close : function(){ 
			$("#btn_insert").hide(); $("#btn_update").hide(); $("#btn_revise").hide();
			$("#inp_form :input").each(function (){ $(this).val(""); });
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

function initField(){

	$( "#tableId1 tbody" ).on( "click", "tr", function() { $(".select-row", $("#tableId1") ).removeClass("select-row"); $(this).addClass("select-row"); return true; });
	
	$("#btn_dialog_open_insert").click(function() { $("#inp_dialog").data("type","I").dialog( "open" ); return false; });
	$("#btn_dialog_open_update").click(function() { $("#inp_dialog").data("type","U").dialog( "open" ); return false; });
	$("#btn_dialog_open_delete").click(function() { 
		var _code = $("#tableId1 .select-row").attr("value");
		if(_code && _code.length>0) $("#delete_dialog").data("fn",deleteCode).dialog( "open" ); 
		return false; 
	});
	
	// 다이얼로그 버튼 
	
	$("#btn_insert").click(function() { 
		if($("#authorityName").val().length == 0){
			alert("권한명을 입력하세요.");
			$("#authorityName").focus();
			return false;
		}
		insertCode(); return false; 
	});
	$("#btn_update").click(function() { 
		if($("#authorityName").val().length == 0){
			alert("권한명을 입력하세요.");
			$("#authorityName").focus();
			return false;
		}
		updateCode(); return false; });
	$("#btn_dialog_cancel").click(function() { $("#inp_dialog").dialog( "close" ); return false; }); 
	
}

function initDialog() {
	initInpDialog();
	initDelDialog();
}

// 등록
function insertCode(){
		
		$.ajax({
			type: "POST"
			,url: "/authority/regist.do"
			,data: { "authorityName":$("#authorityName").val()
			        ,"description":$("#description").val()
			        ,"status":$("#status").val()
			        }
			,success:function(result){
				if(result) {
					alert("등록 되었습니다.");
					$("#inp_dialog").dialog( "close" );
					authority.listView();
				} else {
					alert("등록 오류.");
				}
				//return true;
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
}
// 수정
function updateCode(){
	
	var id = $("#tableId1 .select-row").attr("value");
		
		$.ajax({
			type: "POST"
			,url: "/authority/modify.do"
			,data: { "authorityName":$("#authorityName").val()
			        ,"description":$("#description").val()
			        ,"status":$("#status").val()
			        ,"id":id
			        }
			,success:function(result){
				if(result) {
					alert("수정 되었습니다.");
					$("#inp_dialog").dialog( "close" );
					authority.listView();
				} else {
					alert("수정오류");
				}
				//return true;
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
}
// 삭제
function deleteCode(){
	
	var id = $("#tableId1 .select-row").attr("value");

	if(id && id.length>0){
		$.ajax({
			type: "POST"
			,url: "/authority/delete.do"
			,data:{"id":id}
			,success:function(result){
				if(result) {
					alert("삭제 되었습니다.");
					$("#delete_dialog").dialog( "close" );
					authority.listView();
				} else {
					alert("삭제오류");
				}
				//return true;
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	}	
}


