var menu = {
	checked: false,
	view: function(menu_id) { //사용안함. ==> /WEB-INF/views/include/page.jsp 로 교체.
		var auth = $("#loginId").val();

			var year = $('#tYearUP').val();
 		var month = $('#tMonthUP').val();
 		var  u_term = year + month; 

 		if(u_term ='NaN'){
 			u_term="";
 		}
 
 		var  uName = $("#user_team option:selected").val();
		
	/*$.ajax({
			type : "POST",
			url : "/approval/unprogressListcnt.do",
			data : {
				"uName": uName,
				"u_term": u_term
			},
			dataType : 'json',
			success : function(result) {
				
				var cnt =0;
				
				var temp_class = "class='tr-case1'";
				 
				var map = new Map();
				if (result.success) {
					
					
					var approver = "";
					$(result.list).each(function(index) { 
						approver = this.approverId;
						
					}); 
					
					if(approver != auth){
						cnt = 0;
					}else {
					
						
					$(result.list).each(function(index) {	
							cnt++;
					
						});		
					}
				}
									
				
			
				$('#targetNotAppCount').html("(" + cnt +")");
			*/
			

		
	
		
		
		//-->
		$.ajax({
			type : "POST",
			url : "/menu/list_auth.do",
			data : {  },
			dataType : 'json',
			success : function(result) {
				if (result.success) {

					// 로그인 후, 초기 메뉴 화면 설정
					if(menu_id == 'undefined' || menu_id.length == 0) {
						menu_id = 2;
					}

					var topHtml = "";
					var html = "";
					var t_url = "";
					var current_level = 1;
					var lev1flag = false;
					var lev1parentId = 0;
					var initMenuUrl = "";
					
					if (result.data.length > 0) {

						// 왼쪽(lev=3) 메뉴 선택 시에 상단(lev=2) 메뉴의 parentId를 가져옴
						$(result.data).each(function(i){
							if(lev1parentId == 0)
							{
								if(this.lev == 1 && this.id == menu_id)
								{
									lev1parentId = this.id;
									lev1flag = true;
									return false;
								}
								else if(this.lev == 2 && this.id == menu_id)
								{
									lev1parentId = this.parentId;
									return false;
								}
							}
						});

						$(result.data).each(function(i) {
							// 상단 메뉴 Render
							//alert(this.id);
							
							if(this.lev == 1)
							{
								if(this.authorityStatus == "Y")
								{
									//topHtml += "<li><a href='/research/main.do?menu_id=" + this.id + "'>" + this.name + "</a></li>";//yps
									
									if(this.id=="7" || this.id=="59" || this.id=="75"){
										//현황관리
										topHtml += "<li><a href='/xdview/index.do?method=main' target='_blank'>" + this.name + "</a></li>";
										//"<li><a id='"+this.id+"' onclick='OpenInNewTab(\""+this.parentId+"\",\""+this.id+"\",\""+ this.name + "\");' href='/xdview/index.do?method=main'"+"\");'>"+this.name+"</a></li>";
										//topHtml += "<li><a href='javascript:OpenInNewTab('/xdview/index.do?method=main')'>" + this.name + "</a></li>";
										//topHtml += "<li><a href='javascript:OpenInNewTab(/xdview/index.do?method=main)'>" + this.name + "</a></li>";
									}else if(this.id=="85"){
										// 결재함
										//topHtml += "<li><a href='/approval/progress.do?menu_id=" + this.id + "'>" + this.name + "</a></li>";
										topHtml += "<li><a href='/approval/progress.do?menu_id=69'>" + this.name + "</a></li>";
									}else if(this.id=="3"){
										// 시스템관리
										//topHtml += "<li><a href='/menumanage/list.do?menu_id=" + this.id + "'>" + this.name + "</a></li>";
										topHtml += "<li><a href='/userauthority/main.do?menu_id=15'>" + this.name + "</a></li>";
									}else if(this.id=="114"){
										// 게시판
										topHtml += "<li><a href='/board/list.do?menu_id=114'>" + this.name + "</a></li>";
									}else if(this.id=="2"){
										// 등록조회
										topHtml += "<li><a href='/research/list.do?menu_id=" + this.id + "'>" + this.name + "</a></li>";
									}
									
								}
								else
								{
									topHtml += "<!--<li><a class='a-dis'>" + this.name + "</a></li>-->";
								}
								
							}

							if((this.id == lev1parentId || this.parentId == lev1parentId) && this.authorityStatus == "Y")
							{
								if (this.url == "") {
									t_url = "#";
								} 
								else {
									if(this.url.indexOf("?") != -1) {
										t_url = this.url + "&menu_id=" + this.id;
									} else {
										t_url = this.url + "?menu_id=" + this.id;
									}

									// 상단(lev=1) 메뉴 클릭 시에, 기본으로 보여주는 메뉴 URL 설정
									if(lev1flag && initMenuUrl.length == 0 && t_url.length > 1)
									{
										initMenuUrl = t_url;
									}
								}

								if ( this.lev == 1 ) {
									if(current_level == 3) {
										
										html += "</ul>";
										html += "</li>";
										html += "</ul>";
										html += "</li>";
										
									} else if(current_level == 2) {
										html += "</ul>";
										html += "</li>";
									} 
									
									html += "<h1>"+this.name+"</h1>";
									
									current_level = 1;
								}
								else if ( this.lev == 2 ) {
									if(current_level == 3) {
										html += "</ul>";
										html += "<ul>";
									} else if(current_level == 1) {
										html += "<ul>";
									}
									//html += "<li>";	
									if(this.id=="59" || this.id=="75"){
										//메인현황
										html += "<li><a id='"+this.id+"' onclick='menu.usage_regist(\""+this.parentId+"\",\""+this.id+"\",\""+ this.name + "\");' href='javascript:menu.popup(\""+t_url+"\",\""+this.id+"\");'>"+this.name+"</a></li>";
									}else{
										//if(this.id=="67"){
										/*if(this.name=="미결함"){
										html += "<li><a id='"+this.id+"' onclick='menu.usage_regist(\""+this.parentId+"\",\""+this.id+"\",\""+ this.name + "\")' href='"+t_url+"'>"+this.name+"</a> <span id='targetNotAppCount' style=color:white></span></li>";
										}else{
										html += "<li><a id='"+this.id+"' onclick='menu.usage_regist(\""+this.parentId+"\",\""+this.id+"\",\""+ this.name + "\")' href='"+t_url+"'>"+this.name+"</a></li>";
										//html += "</li>";
										}*/
										var url = location.search;
										
										/*if(this.id=="67"){
												if(url == "?menu_id=67"){
													html += "<li><a id='"+this.id+"' onclick='menu.usage_regist(\""+this.parentId+"\",\""+this.id+"\",\""+ this.name + "\")' href='"+t_url+"'>"+this.name+"</a> <span id='targetNotAppCount' style=color:white></span></li>";
												}else{
													html += 	"<li><a id='"+this.id+"' onclick='menu.usage_regist(\""+this.parentId+"\",\""+this.id+"\",\""+ this.name + "\")' href='"+t_url+"'>"+this.name+""+'('+""+cnt+""+')'+"</a>";	
													html += "</li>";
												}
											}else{
										html += "<li><a id='"+this.id+"' onclick='menu.usage_regist(\""+this.parentId+"\",\""+this.id+"\",\""+ this.name + "\")' href='"+t_url+"'>"+this.name+"</a></li>";
									
										}*/
											//if(this.id=="67"){
													html += "<li><a id='"+this.id+"' onclick='menu.usage_regist(\""+this.parentId+"\",\""+this.id+"\",\""+ this.name + "\")' href='"+t_url+"'>"+this.name+"</a></li>";
									
									//	}
									
									}
									//html += "<a id='"+this.id+"' href='"+t_url+"'>"+this.name+"</a>";
									current_level = 2;
								}
								else if (this.lev == 3 ) {
									if(current_level == 2) {
										//
									}
									
									html += "<li><a id='"+this.id+"' onclick='menu.usage_regist(\""+this.parentId+"\",\""+this.id+"\",\""+ this.name + "\")' href='"+t_url+"'>"+this.name+"</a></li>";
																	
									current_level = 3;
								}
	
								if(i == (result.data.length-1)) {
									if(current_level == 2) {
										html += "</ul>";
									} else if(current_level == 3) {
										html += "	   </ul>";
										html += "	 </li>";
										html += "</ul>";
									}
									
									html += "</li>";
								}
							}
						});
					}
//					else
//					{
//						html = "<li>조회결과가 없습니다</li>";
//					}

					$("#menu").html(topHtml);
					$(".leftArea").html(html);

					$("#"+menu_id).parent().addClass("selectM");
				

					// '경력관리'는 기본 화면이기 때문에 '등록조회' 메뉴 선택 시에는 '경력관리' 메뉴로 재이동 안함
					if(menu_id == "2")
					{
						$("#4").parent().addClass("selectM");
					}
					// 상단(lev=1) 메뉴 클릭 시, 초기 이동 메뉴
					else if(lev1flag && initMenuUrl.length > 0)
					{
						$(location).attr("href", initMenuUrl);
					}
				};
			},
			error : function(x, t, e){
//				var html = "";
//				html = "<li>조회결과가 없습니다</li>";
//				$("#sm > ul").html(html);
				handleErrorMessage(x, t, e);
			}
		});
		
		
		
		
	//				}
	//			});
		
		
		
		
		
		
		
	},
		
	usage_regist: function(parentId, menuId, menuName) {
		$.ajax({
			type : "POST",
			url : "/menu/regist.do",
			data : { "parentId": parentId , "menuId":menuId,"menuName":menuName },
			success : function(result) {
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			}
		});
	},
	popup: function(win_url, win_name){
		var win_option = "";
		win_option += "width=1117,";
		win_option += "height=775,";
		win_option += "resizable=yes,";

		//var cont_win = window.open(win_url,win_name,win_option);
		//alert(win_url);
//		var cont_win = window.open(win_url,'메인현황','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1117,height=775');
//		var cont_win = window.open(win_url,win_name,'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1500,height=1100');
		var cont_win = window.open(win_url,win_name,'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=1117,height=775');
		
		cont_win.focus();
	},
	validate: function() {
		return true;
	}

};
