/**
 * 메인화면 차트
 */

//var v_QueryData = new Array();
var statisticquery = {
	checked: false,  
	/* 전체인원 팝업  */
	popUpAllUser :function(tr_id,org_cd){

		var pop_gubun    = $("#" + tr_id).children().get(0).innerText;
		
		 
		var work_div1    = $("#" + tr_id).children().get(1).innerText; 
		
		$("#pop_gubun").val(pop_gubun);
		$("#param1").val(work_div1); 
		
		$("#param2").val('');
		$("#param3").val('');
		$("#param4").val('');
		
		// 미입력 팝업때만 
		var pop_flag  = window.opener.$("#pop_flag").val(); 
		if ( pop_flag == "no_work"){
			$("#pop_gubun").val("main_all_user_no_work");
		}else if ( pop_flag == "total"){
			$("#pop_gubun").val("main_all_user_total");
		}else{
			$("#pop_gubun").val("main_all_user");
		}
 
			
		if ( org_cd == 1){
			$("#param2").val($("#" + tr_id).children().get(2).innerText);
		}else if ( org_cd == 2){
			$("#param3").val($("#" + tr_id).children().get(3).innerText);
		}else if ( org_cd == 3){
			$("#param4").val($("#" + tr_id).children().get(4).innerText);
		}
		
		
		
		var win_option = "";
		win_option += "width=1117,";
		win_option += "height=775,";
		win_option += "resizable=yes,";

		var cont_win = window.open('/statisticquery/pop.do','popStatisticqueryAllUser',win_option);
		cont_win.focus();
	}
	,
	popUp: function(tr_id) {   
		if ( $("#pop_gubun").val() == undefined ){ 
			 
			var inputHidden = "";
			inputHidden += "<input type=hidden name=pop_gubun    id=pop_gubun   value='' />";
			inputHidden += "<input type=hidden name=pop_gubun_sub    id=pop_gubun_sub value=''    />";
			
			inputHidden += "<input type=hidden name=gubun        id=gubun    value=''    />";
			inputHidden += "<input type=hidden name=org_id       id=org_id   value=''    />";
			inputHidden += "<input type=hidden name=center_id    id=center_id   value=''    />";
			inputHidden += "<input type=hidden name=sil_id       id=sil_id      value=''    />";
			inputHidden += "<input type=hidden name=team_id      id=team_id     value=''    />";
			
			inputHidden += "<input type=hidden name=level    id=level value=''   />";
			
			inputHidden += "<input type=hidden name=ins_from    id=ins_from  value=''  />";
			inputHidden += "<input type=hidden name=ins_to id=ins_to  value=''  />";
			
			inputHidden += "<input type=hidden name=work_div1    id=work_div1   value='' />";
			inputHidden += "<input type=hidden name=work_div2    id=work_div2   value='' />";
			inputHidden += "<input type=hidden name=product_div1 id=product_div1 value='' />";
			inputHidden += "<input type=hidden name=product_div2 id=product_div2 value=''/>";
			inputHidden += "<input type=hidden name=product_div3 id=product_div3 value=''/>";
			inputHidden += "<input type=hidden name=tech_div1    id=tech_div1    value=''/>";
			inputHidden += "<input type=hidden name=tech_div2    id=tech_div2    value=''/>";
			inputHidden += "<input type=hidden name=tech_div3    id=tech_div3    value=''/>";
			inputHidden += "<input type=hidden name=task_div1    id=task_div1    value=''/>";
			inputHidden += "<input type=hidden name=task_div2    id=task_div2    value=''/>";
			 
			 $('body').append(inputHidden);
		}

 
		var pop_gubun    = $("#" + tr_id).children().get(0).innerText;
		//var org_id       =  '';
		$("#pop_gubun").val(pop_gubun); 
		var sil_id = '';
		var team_id = '';
		
		if( pop_gubun == 'org_work'){ 
			sil_id  = $("#" + tr_id).children().get(1).innerText;
			team_id = $("#" + tr_id).children().get(2).innerText; 
			var work_div1    = $("#" + tr_id).children().get(3).innerText;
			var work_div2    = $("#" + tr_id).children().get(4).innerText; 


			var from  = $("#inp_startDate").val();
			var to    = $("#inp_endDate").val();
			$("#ins_from").val(from);
			$("#ins_to").val(to);
			
			$("#work_div1").val(work_div1);
			$("#work_div2").val(work_div2);
			
			if ( team_id == "" ){
				//alert('sil');
				$("#sil_id" ).val(sil_id);
				$("#team_id").val('');
			}else{
				//alert('team' + team_id);
				$("#sil_id" ).val('');
				$("#team_id").val(team_id);
			}  
		}
		else if( pop_gubun=='product_tab')
		{
			var pop_gubun_sub    = $("#" + tr_id).children().get(1).innerText;
			var level    = $("#" + tr_id).children().get(2).innerText;
			var work_div1    = $("#" + tr_id).children().get(3).innerText;
			var product_div1    = $("#" + tr_id).children().get(4).innerText;
			var from    = $("#" + tr_id).children().get(5).innerText;
			var to    = $("#" + tr_id).children().get(6).innerText;
			var product_div2    = $("#" + tr_id).children().get(7).innerText;
			var product_div3    = $("#" + tr_id).children().get(8).innerText;
			
			$("#pop_gubun_sub").val(pop_gubun_sub);
			$("#level").val(level);
			$("#work_div1").val(work_div1);
			$("#product_div1").val(product_div1);
			$("#ins_from").val(from);
			$("#ins_to").val(to);
			$("#product_div2").val(product_div2);
			$("#product_div3").val(product_div3);
			
			if(pop_gubun_sub == 'product_level2_org' )
			{
				sil_id  = $("#" + tr_id).children().get(10).innerText;
				team_id = $("#" + tr_id).children().get(11).innerText;
				 
				if ( team_id == "" ){
					//alert('sil');
					$("#sil_id" ).val(sil_id);
					$("#team_id").val('');
				}else{
					//alert('team' + team_id);
					$("#sil_id" ).val('');
					$("#team_id").val(team_id);
				}
				
			}
			else if( pop_gubun_sub == 'product_level2_tech')
			{
				var tech_div1 = $("#" + tr_id).children().get(9).innerText;
				var tech_div2 = $("#" + tr_id).children().get(10).innerText;
				var tech_div3 = $("#" + tr_id).children().get(11).innerText;
				$("#tech_div1").val(tech_div1);
				$("#tech_div2").val(tech_div2);
				$("#tech_div3").val(tech_div3);
			}
			else if( pop_gubun_sub == 'product_level2_task')
			{
				var task_div1 = $("#" + tr_id).children().get(9).innerText;
				var task_div2 = $("#" + tr_id).children().get(10).innerText;
				$("#task_div1").val(task_div1);
				$("#task_div2").val(task_div2);
			}
		}
		else if( pop_gubun=='tech_tab')
		{
			var pop_gubun_sub    = $("#" + tr_id).children().get(1).innerText;
			var level    = $("#" + tr_id).children().get(2).innerText;
			var work_div1    = $("#" + tr_id).children().get(3).innerText;
			var tech_div1    = $("#" + tr_id).children().get(4).innerText;
			var from    = $("#" + tr_id).children().get(5).innerText;
			var to    = $("#" + tr_id).children().get(6).innerText;
			var tech_div2    = $("#" + tr_id).children().get(7).innerText;
			var tech_div3    = $("#" + tr_id).children().get(8).innerText;
			
			$("#pop_gubun_sub").val(pop_gubun_sub);
			$("#level").val(level);
			$("#work_div1").val(work_div1);
			$("#tech_div1").val(tech_div1);
			$("#ins_from").val(from);
			$("#ins_to").val(to);
			$("#tech_div2").val(tech_div2);
			$("#tech_div3").val(tech_div3);
			
			if(pop_gubun_sub == 'tech_level2_org' )
			{
				sil_id  = $("#" + tr_id).children().get(10).innerText;
				team_id = $("#" + tr_id).children().get(11).innerText;
				 
				if ( team_id == "" ){
					//alert('sil');
					$("#sil_id" ).val(sil_id);
					$("#team_id").val('');
				}else{
					//alert('team' + team_id);
					$("#sil_id" ).val('');
					$("#team_id").val(team_id);
				}
			}
			else if( pop_gubun_sub == 'tech_level2_product')
			{
				var product_div1 = $("#" + tr_id).children().get(9).innerText;
				var product_div2 = $("#" + tr_id).children().get(10).innerText;
				var product_div3 = $("#" + tr_id).children().get(11).innerText;
				$("#product_div1").val(product_div1);
				$("#product_div2").val(product_div2);
				$("#product_div3").val(product_div3);
			}
			else if( pop_gubun_sub == 'tech_level2_task')
			{
				var task_div1 = $("#" + tr_id).children().get(9).innerText;
				var task_div2 = $("#" + tr_id).children().get(10).innerText;
				$("#task_div1").val(task_div1);
				$("#task_div2").val(task_div2);
			}
		} 
		
		var popByMon = window.open('/statisticquery/pop.do','popStatisticqueryUserList','');
		popByMon.focus();
		
	}
	,
	contributionPopUp: function(tr_id) {   
		if ( $("#pop_gubun").val() == undefined ){ 
			 
			var inputHidden = "";
			inputHidden += "<input type=hidden name=pop_gubun    id=pop_gubun   value='' />";
			inputHidden += "<input type=hidden name=pop_gubun_sub    id=pop_gubun_sub value=''    />";
			
			inputHidden += "<input type=hidden name=gubun        id=gubun    value=''    />";
			inputHidden += "<input type=hidden name=org_id       id=org_id   value=''    />";
			inputHidden += "<input type=hidden name=center_id    id=center_id   value=''    />";
			inputHidden += "<input type=hidden name=sil_id       id=sil_id      value=''    />";
			inputHidden += "<input type=hidden name=team_id      id=team_id     value=''    />";
			
			inputHidden += "<input type=hidden name=level        id=level value=''   />"; 
			 $('body').append(inputHidden);
		}

 
		var pop_gubun    = $("#" + tr_id).children().get(0).innerText; 
		$("#pop_gubun").val(pop_gubun); 
		var sil_id  = '';
		var team_id = '';
		 
		sil_id  = $("#" + tr_id).children().get(1).innerText;
		team_id = $("#" + tr_id).children().get(2).innerText;

		var from  = $("#inp_startDate").val();
		var to    = $("#inp_endDate").val();
		$("#ins_from").val(from);
		$("#ins_to").val(to); 

		if ( team_id == "" ){ 
			$("#sil_id" ).val(sil_id);
			$("#team_id").val('');
		}else{
			$("#sil_id" ).val('');
			$("#team_id").val(team_id);
		}


		var popByMon = window.open('/statisticquery/popContribution.do','popStatisticqueryUserListContribution','');
		popByMon.focus();
		
	},
	queryUserList: function(_sDate, _eDate, _w, _h,_org_id,gubun,pop_gubun,pop_gubun_sub,param1,param2,param3,param4,param5,param6,param7) {
		var progress = new Progress();
		
		$.ajax({
			type: "POST",
			url: "/statisticquery/query.do",
			data: {"startDate":_sDate.replace(/-/g, '')
				,"endDate":_eDate.replace(/-/g, '')
				,"org_id":_org_id
				,"gubun":gubun
				,"pop_gubun":pop_gubun
				,"pop_gubun_sub":pop_gubun_sub
				,"param1":param1
				,"param2":param2
				,"param3":param3
				,"param4":param4
				,"param5":param5
				,"param6":param6
				,"param7":param7
			},
			dataType : 'json',
			beforeSend : function() {
				if(!_w) _w=1050;
				if(!_h) _h=150;
				progress.show();
			},
			complete: function() {
				progress.hide();
			},
			success:function(result){
				 
				var html = "";
				var one_tr_point = "";
				if (result.data.length > 0) {
					$(result.data).each(function(i) {
						one_tr_point = "";
						if(pop_gubun == "main_all_user_no_work") {
							html += "<tr  id='tr_project_" + i + "'>";
						} else {
							if ( i == 0 ){
								one_tr_point = " tr-point";
							}
							
							html += "<tr class='codeDetailChkbox" + one_tr_point + "'  id='tr_project_" + i + "' onclick=statisticquery.queryUserProjectList('tr_project_" + i +"') style='cursor:pointer;' >";
						}
						html += "	<td style='display:none'      >"+this.user_id    +"</td>";  
						html += "	<td class='txt-center ellipsis' title='"+this.center_nm +"'>"+this.center_nm  +"</td>";
						html += "	<td class='txt-center ellipsis' title='"+this.sil_nm    +"'>"+this.sil_nm     +"</td>";
						html += "	<td class='txt-center ellipsis' title='"+this.team_nm   +"'>"+this.team_nm    +"</td>";
						html += "	<td class='txt-center' >"+this.localname  +"</td>";
						html += "	<td class='txt-center' >"+this.work_day   +"</td>"; 
						html += "</tr>"; 
					});
				}
				else {
					html = "<tr><td colspan='3' class='txt-center' >조회결과가 없습니다.</td></tr>";
				}

				$("#tab_userlist > tbody").html(html);
				
				if (result.data.length > 0) {
					if(pop_gubun == "main_all_user_no_work") {
					}else{
						statisticquery.queryUserProjectList('tr_project_0');
					}
				}
				    
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	},		
	queryUserProjectList: function(tr_project_id) {
		var progress = new Progress();
		
		var pop_gubun = $("#pop_gubun",window.opener.document).val();
		var pop_gubun_sub = $("#pop_gubun_sub",window.opener.document).val();
		var org_id    = $("#org_id"   ,window.opener.document).val();
		var _sDate    = $("#ins_from" ,window.opener.document).val();
		var _eDate    = $("#ins_to"   ,window.opener.document).val();
		var gubun     = "user_projectList"; 
		
		 
		var user_id    = $("#" + tr_project_id).children().get(0).innerText;
		 
		_sDate = _sDate.replace(/-/g, "");
		_eDate = _eDate.replace(/-/g, "");
		
		
		$.ajax({
			type: "POST",
			url: "/statisticquery/query.do",
			data: {"startDate":_sDate 
				,"endDate":_eDate
				,"org_id":org_id
				,"user_id":user_id
				,"gubun":gubun
				,"pop_gubun":pop_gubun
				,"pop_gubun_sub":pop_gubun_sub
				,"param1":$("#param1").val()
				,"param2":$("#param2").val()
				,"param3":$("#param3").val()
				,"param4":$("#param4").val()
				,"param5":$("#param5").val()
				,"param6":$("#param6").val()
				,"param7":$("#param7").val()
				,"center_id":$("#center_id").val()
				,"sil_id":$("#sil_id").val()
				,"team_id":$("#team_id").val()
				
			},
			dataType : 'json',
			beforeSend : function() {  	
				progress.show();
			},
			complete: function() {
				progress.hide();
			},
			success:function(result){
				 
				var html = "";
				if (result.data.length > 0) {
					 					
					
					$(result.data).each(function(i) {
						
						html += "<tr  id='tr_id_" + i + "'>";
						html += "	<td class='txt-center' >"+this.work_div1_nm +"</td>";
						html += "	<td class='txt-center' >"+this.work_div2_nm +"</td>";
						html += "	<td class='ellipsis' title='"+this.project_nm                                                             +"'   >"+this.project_nm   +"</td>";
						html += "	<td class='ellipsis' title='"+ linkName(this.product_div1_nm,this.product_div2_nm,this.product_div3_nm)   +"'   >"+ linkName(this.product_div1_nm,this.product_div2_nm,this.product_div3_nm)   +"</td>";
						html += "	<td class='ellipsis' title='"+ linkName(this.tech_div1_nm   ,this.tech_div2_nm   ,this.tech_div3_nm   )   +"'   >"+ linkName(this.tech_div1_nm   ,this.tech_div2_nm   ,this.tech_div3_nm   )   +"</td>";
						html += "	<td class='ellipsis' title='"+ linkName(this.task_div1_nm   ,this.task_div2_nm                        )   +"'   >"+ linkName(this.task_div1_nm   ,this.task_div2_nm                        )   +"</td>";
						html += "	<td class='ellipsis txt-right3' >"+ this.ratio +"</td>";
						
						html += "	<td class='ellipsis txt-center'>"+formatDate(this.start_date,'/')+" ~ "+formatDate(this.end_date,'/')+"</td>";
						 
						html += "</tr>"; 
					});
				}
				else {
					html = "<tr><td colspan='7' class='txt-center' >조회결과가 없습니다.</td></tr>";
				}

				$("#tab_userpojectlist > tbody").html(html);
				    
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	},		 
	
	/* 기여도 팝업 */
	queryUserListContribution: function(_sDate, _eDate, _w, _h,gubun,pop_gubun ) {
		var progress = new Progress();
		
		$.ajax({
			type: "POST",
			url: "/statisticquery/query.do",
			data: {"startDate":_sDate.replace(/-/g, '')
				,"endDate":_eDate.replace(/-/g, '') 
				,"gubun":gubun
				,"pop_gubun":pop_gubun 
				,"level0": $("select[name=div_level0]",opener.document).val()
				,"level1": $("select[name=div_level1]",opener.document).val()
				,"level2": $("select[name=div_level2]",opener.document).val()
				,"level3": $("select[name=div_level3]",opener.document).val() 
				,"pmscode":$("select[name=div_project_nm]",opener.document).val() 
				,"sil_id":$("#sil_id").val()
				,"team_id":$("#team_id").val()
			},
			dataType : 'json',
			beforeSend : function() {
				if(!_w) _w=1050;
				if(!_h) _h=150;
				progress.show();
			},
			complete: function() {
				progress.hide();
				
			},
			success:function(result){
				 
				var html = "";
				if (result.data.length > 0) {
					$(result.data).each(function(i) { 
						html += "<tr  class='codeDetailChkbox' id='tr_project_" + i + "' onclick=statisticquery.queryUserListContributionPeriod('tr_project_" + i +"') style='cursor:pointer;' >";
						 
						html += "	<td style='display:none'      >"+this.user_id    +"</td>"; 
						html += "	<td style='display:none'      >"+this.sil_id     +"</td>"; 
						html += "	<td style='display:none'      >"+this.team_id    +"</td>"; 
						
						html += "	<td class='txt-center' >"+this.center_nm  +"</td>";
						html += "	<td class='txt-center' >"+this.sil_nm     +"</td>";
						html += "	<td class='txt-center' >"+this.team_nm    +"</td>";
						html += "	<td class='txt-center' >"+this.localname  +"</td>";
						html += "	<td class='txt-right3' >"+  Math.round( ((this.user_weight/opener.sum_weight)*1000))/10 +"</td>"; 
						html += "</tr>"; 
					});
				}
				else {
					html = "<tr><td colspan='3' class='txt-center' >조회결과가 없습니다.</td></tr>";
				}

				$("#tab_userlist > tbody").html(html);
				
				if (result.data.length > 0) {
					statisticquery.queryUserListContributionPeriod('tr_project_0');
				}
				    
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	},		
	
	/** 기여도 팝업 - 우측리스트 (기간 표시) */
	queryUserListContributionPeriod: function(tr_id) {
		var progress = new Progress();
		 
		var _sDate    = $("#inp_startDate" ,window.opener.document).val();
		var _eDate    = $("#inp_endDate"   ,window.opener.document).val();
		var gubun     = "contribution_list_pop_period";
		 
		var user_id    = $("#" + tr_id).children().get(0).innerText;
		 
		_sDate = _sDate.replace(/-/g, "");
		_eDate = _eDate.replace(/-/g, ""); 
		
		$.ajax({
			type: "POST",
			url: "/statisticquery/query.do",
			data: {"startDate":_sDate 
				,"endDate":_eDate 
				,"user_id":user_id
				,"gubun":gubun
				,"level0": $("select[name=div_level0]",opener.document).val()
				,"level1": $("select[name=div_level1]",opener.document).val()
				,"level2": $("select[name=div_level2]",opener.document).val()
				,"level3": $("select[name=div_level3]",opener.document).val() 
				,"pmscode":$("select[name=div_project_nm]",opener.document).val() 
				,"sil_id":$("#sil_id").val()
				,"team_id":$("#team_id").val()
				,"sum_weight":opener.sum_weight 
			},
			dataType : 'json',
			beforeSend : function() {  	
				progress.show();
			},
			complete: function() {
				progress.hide();
			},
			success:function(result){
				 
				var html = "";
				if (result.data.length > 0) {
					 					
					
					$(result.data).each(function(i) {
						
						html += "<tr  id='tr_id_" + i + "'>"; 
						html += "	<td class='ellipsis' class='txt-center'>"+formatDate(this.start_date,'/')+" ~ "+formatDate(this.end_date,'/')+"</td>";
						html += "	<td class='ellipsis' class='txt-right3'>"+ this.ratio       +"</td>";
						html += "	<td class='ellipsis' class='txt-right3'>"+ this.user_weight +"</td>";
						html += "</tr>"; 
					});
				}
				else {
					html = "<tr><td colspan='7' class='txt-center' >조회결과가 없습니다.</td></tr>";
				}

				$("#tab_userpojectlist > tbody").html(html);
				    
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	},		 
	 
	queryMainAllUserPopList: function(_sDate, _eDate, _w, _h,_org_id,work_div1) {

		$.ajax({
			type: "POST",
			url: "/statisticquery/query.do",
			data: {"startDate":_sDate.replace(/-/g, '')
				,"endDate":_eDate.replace(/-/g, '')
				,"org_id":_org_id
				,"gubun":"main_all_user" 
			    ,"work_div1":work_div1
			},
			dataType : 'json',
			beforeSend : function() {
				if(!_w) _w=1050;
				if(!_h) _h=150;
			},
			complete: function() {
				
			},
			success:function(result){
				 
				var html = "";
				if (result.data.length > 0) {
					
					var preCenterNm = "";
					var preSilNm    = "";
					$(result.data).each(function(i) {
						
						html += "<tr  id='tr_id_" + i + "' >";
						html += "	<td style='display:none'>main_all_user</td>";		//  ★  pop_gubun 
						html += "	<td style='display:none'>"+ work_div1  +"</td>";
						html += "	<td style='display:none'>"+ this.center_id  +"</td>";
						html += "	<td style='display:none'>"+ this.sil_id  +"</td>";
						html += "	<td style='display:none'>"+ this.team_id  +"</td>";
						
						if( preCenterNm != this.center_nm ){
							html += "	<td rowspan='" + this.center_group_cnt + "' >" + this.center_nm  + "<a href='#' onclick=statisticquery.popUpAllUser('tr_id_" + i +"',1) >[" + this.center_cnt  + "]</a></td>";
						}
						
						if( preSilNm != this.sil_nm ){
							html += "	<td rowspan='" + this.sil_group_cnt + "'    >" + this.sil_nm     + "<a href='#' onclick=statisticquery.popUpAllUser('tr_id_" + i +"',2) >[" + this.sil_cnt     + "]</a></td>";
						}
						
						if ( this.team_id != '' ){
							html += "	<td >"+this.team_nm    + "<a href='#' onclick=statisticquery.popUpAllUser('tr_id_" + i +"',3) >[" + this.team_cnt    + "]</a></td>";
						}else{
							html += "	<td ></td>"	;
						}
						//onclick=statisticquery.popUpMainAllUser('tr_id_" + i +"')
						html += "</tr>";
						
						
						preCenterNm = this.center_nm;
						preSilNm    = this.sil_nm;
						
						
					});
				}
				else {
					html = "<tr><td colspan='3' class='txt-center' >조회결과가 없습니다.</td></tr>";
				}

				$("#tab_userlist > tbody").html(html);
				    
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	}, 
	queryMainAllUserPopTotalList: function(_sDate, _eDate, _w, _h ) {

		$.ajax({
			type: "POST",
			url: "/statisticquery/query.do",
			data: {"startDate":_sDate.replace(/-/g, '')
				,"endDate":_eDate.replace(/-/g, '') 
				,"gubun":"main_all_user_total"  
			},
			async:false,
			dataType : 'json',
			beforeSend : function() {
				if(!_w) _w=1050;
				if(!_h) _h=150;
			},
			complete: function() {
				
			},
			success:function(result){
				 
				var html = "";
				if (result.data.length > 0) {
					
					var preCenterNm = "";
					var preSilNm    = "";
					var centerTdNum = 0;
					var silTdNum    = 0;
					var teamTdNum   = 0;
					
					$(result.data).each(function(i) {
						
						html += "<tr  id='tr_id_" + i + "' >";
						html += "	<td style='display:none'>main_all_user_total</td>";		//  ★  pop_gubun 
						html += "	<td style='display:none'></td>";
						html += "	<td style='display:none'>"+ this.center_id  +"</td>";
						html += "	<td style='display:none'>"+ this.sil_id     +"</td>";
						html += "	<td style='display:none'>"+ this.team_id    +"</td>";
						
						if( preCenterNm != this.center_nm ){
							++centerTdNum; 
							html += "	<td rowspan='" + this.center_group_cnt + "' >";
							html += "" + this.center_nm  + "<a href='#' onclick=statisticquery.popUpAllUser('tr_id_" + i +"',1) >[";
							html += "<span id='t_" + this.center_id + "'></span>";
							html += "<span id='center" + centerTdNum +"' >" + this.center_cnt  + "</span>"; 
							html += "]</a></td>";
							//html += this.center_cnt  +"</td>";
						}
						
						if( preSilNm != this.sil_nm ){
							if( preCenterNm != this.center_nm ){
								silTdNum=0; 
							}
							++silTdNum;
							html += "	<td rowspan='" + this.sil_group_cnt + "' >";
							html += "" + this.sil_nm     + "<a href='#' onclick=statisticquery.popUpAllUser('tr_id_" + i +"',2) >[";
							html += "<span id='t_" + this.sil_id + "'></span>";
							html += "<span id='center" + centerTdNum +"_sil" + silTdNum + "' >" + this.sil_cnt  + "</span>";
							html += "]</a></td>";
							//html +=  this.sil_cnt + "</td>";
						}
						
						if ( this.team_id != '' ){
							if( preSilNm != this.sil_nm ){
								teamTdNum=0; 
							}
							++teamTdNum;
							html += "	<td >";
							html += "" + this.team_nm     + "<a href='#' onclick=statisticquery.popUpAllUser('tr_id_" + i +"',3) >[" ;
							html += "<span id='t_" + this.team_id + "'></span>";
							html += "<span id='center" + centerTdNum +"_sil" + silTdNum + "_team" + teamTdNum + "' >" + this.team_cnt  + "</span>";
							html += "]</a></td>";
							//html += this.team_cnt +"</td>";
							 
						}else{
							html += "	<td ></td>"	;
						} 
						html += "</tr>";
						
						
						preCenterNm = this.center_nm;
						preSilNm    = this.sil_nm; 
					}); 
				}
				else {
					html = "<tr><td colspan='3' class='txt-center' >조회결과가 없습니다.</td></tr>";
				}

				$("#tab_userlist > tbody").html(html);
				 
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	},
	queryMainAllUserPopWorkList: function(_sDate, _eDate, _w, _h ) {

		$.ajax({
			type: "POST",
			url: "/statisticquery/query.do",
			data: {"startDate":calDateUpdate(_sDate,-1).replace(/-/g, '')
				,"endDate":_eDate.replace(/-/g, '') 
				,"gubun":"main_all_user_work"  
			},
			async:false,
			dataType : 'json',
			beforeSend : function() {
				if(!_w) _w=1050;
				if(!_h) _h=150;
			},
			complete: function() {
				
			},
			success:function(result){ 
				if (result.data.length > 0) {
					 
					$(result.data).each(function(i) {
						var team_id = this.team_id;
						
						var span_team_cnt = $("#t_" + team_id ).next().text();
						
						$("#t_" + team_id ).next().text(parseInt(span_team_cnt) - parseInt(this.team_cnt)  );
						//$("#t_" + team_id).text( parseInt($("#" + team_id).text())  + parseInt($("#" + team_id).text()) );
						
					}); 
					
				}   
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	}, 
	
	/** tab6 프로젝트 투입비율 산출 팝업 */ 
	popProjectCost: function(tr_id) {    
		var pop_gubun      = $("#" + tr_id).children().get(0).innerText; 
		var pmscode        = $("#" + tr_id).children().get(1).innerText; 
		var pmsname_select = $("#" + tr_id).children().get(2).innerText; 
		$("#pop_gubun").val(pop_gubun);
		$("#pmscode").val(pmscode);
		$("#pmsname_select").val(pmsname_select);


		var win_option = "";
		win_option += "width=1100,";
		win_option += "height=775,";
		win_option += "resizable=yes,";
		
		var popByMon = window.open('/statisticquery/popProjectCost.do','popStatisticqueryProjectCost',win_option);
		popByMon.focus();
		
	}, 
	/** tab6 프로젝트 투입비율 산출 - 프로젝트 상세조회(화면) */ 
	popProjectCostDetailSearch: function(tr_id) { 

		var win_option = "";
		win_option += "width=800,";
		win_option += "height=600,";
		win_option += "resizable=yes,";


		var popByMon = window.open('/statisticquery/popProjectCostDetailSearch.do','popStatisticqueryProjectCostSearchDetail',win_option);
		popByMon.focus();
		
	}, 
	/** 프로젝트 투입비용 산출 (tab6) - 프로젝트 상세(검색)   */
	queryProjectCostDetailSearch: function(_sDate, _eDate ) {

		$.ajax({
			type: "POST",
			url: "/statisticquery/query.do",
			data: {"startDate":calDateUpdate(_sDate,-1).replace(/-/g, '')  
				,"endDate":_eDate.replace(/-/g, '') 
				,"pmscode":$('#pmscode').val()
				,"sum_cost":$('#sum_cost').val()
				,"sum_cost1":$('#sum_cost1').val()
				,"sum_cost2":$('#sum_cost2').val()
				,"sum_man":$('#sum_man').val()
				,"sum_man1":$('#sum_man1').val()
				,"sum_man2":$('#sum_man2').val()
				,"pmsname":$('#pmsname').val()
				,"gubun":"projectcost_detailsearch"  
			},
			async:false,
			dataType : 'json',
			beforeSend : function() { 
			},
			complete: function() {
				
			},
			success:function(result){  
				
				var html = "";
				if (result.data.length > 0) {
					$(result.data).each(function(i) { 
						html += "<tr  class='codeDetailChkbox' id='tr_right_" + i + "'  style='cursor:pointer;' >";
						
						html += "	<td class='txt-center'><input type=checkbox   name='chs' id='tr_check_" + i + "' ></td>";
						html += "	<td class='txt-center'>"+this.pmscode       +"</td>";
						html += "	<td style='padding-left:5px' >"+this.title         +"</td>"; 
						html += "	<td class='txt-center'>"+this.state         +"</td>";
						html += "	<td class='txt-right3' >"+comma(this.sum_pms_cost)  +"</td>";
						html += "	<td class='txt-right3' >"+Math.round(this.sum_job_time)  +"</td>";
						html += "	<td class='txt-right3' >"+this.sum_user_cnt  +"</td>";
						 
						html += "</tr>"; 
					});
				}
				else {
					html = "<tr><td colspan='7' class='txt-center' >조회결과가 없습니다.</td></tr>";
				}

				$("#tab_userlist > tbody").html(html);
				
				if ( result.data.length == project_detailSearchCount ){
					alert("최대 " + project_detailSearchCount + " 건까지만 검색됩니다.\n\n더 상세하게 검색해 주세요.");
				}  
				
				
				
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	},
	/** 프로젝트 투입비용 산출 (tab6) - 팝업 좌측 리스트  */
	queryProjectCostPopLeft: function(_sDate, _eDate) {

		$.ajax({
			type: "POST",
			url: "/statisticquery/query.do",
			data: {"startDate":calDateUpdate(_sDate,-1).replace(/-/g, '')  
				,"endDate":_eDate.replace(/-/g, '') 
				,"pmscode":$('#pmscode'  ,window.opener.document).val()
				,"gubun":"projectcost_pop_left"  
			},
			async:false,
			dataType : 'json',
			beforeSend : function() {
			},
			complete: function() {
				
			},
			success:function(result){ 
				
				var html = "";
				if (result.data.length > 0) {
					$(result.data).each(function(i) { 
						html += "<tr  class='codeDetailChkbox' id='tr_left_" + i + "' onclick=statisticquery.queryProjectCostPopRight('tr_left_" + i +"') style='cursor:pointer;' >";
						
						html += "	<td style='display:none' >"+this.user_id  +"</td>";
						html += "	<td style='padding-left:5px' >"+this.center_nm  +"</td>";
						html += "	<td style='padding-left:5px' >"+this.sil_nm     +"</td>";
						html += "	<td style='padding-left:5px' >"+this.team_nm    +"</td>";
						html += "	<td class='txt-center' >"+this.localname  +"</td>";
						html += "	<td style='padding-left:5px' >"+this.positionname +"(" +this.positioncode  +")</td>";
						 
						html += "</tr>"; 
					});
				}
				else {
					html = "<tr><td colspan='5' class='txt-center' >조회결과가 없습니다.</td></tr>";
				}

				$("#tab_userlist > tbody").html(html);
				
				if (result.data.length > 0) {
					statisticquery.queryProjectCostPopRight('tr_left_0');
				}
				
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	},
	
	/** 프로젝트 투입비용 산출 (tab6) - 팝업 - 좌측 TOP : 조직별(센터별) 투입비용  */
	queryProjectCostPopLeftTop: function(_sDate, _eDate ) {

		$.ajax({
			type: "POST",
			url: "/statisticquery/query.do",
			data: {"startDate":calDateUpdate(_sDate,-1).replace(/-/g, '')  
				,"endDate":_eDate.replace(/-/g, '') 
				,"pmscode":$('#pmscode'  ,window.opener.document).val()
				,"gubun":"projectcost_pop_left_top"  
			},
			async:false,
			dataType : 'json',
			beforeSend : function() {
			},
			complete: function() {
				
			},
			success:function(result){ 
				
				var html = "";
				if (result.data.length > 0) {
					$(result.data).each(function(i) { 
						html += "<tr   >";
						
						html += "	<td class='txt-center' >"+this.center_nm  +"</td>";
						html += "	<td class='txt-right3' >"+comma(this.sum_pms_cost)  +"</td>";
						html += "	<td class='txt-center' >"+this.sum_user_cnt  +"명</td>";
						html += "	<td class='txt-right3' >"+this.sum_job_time  +"</td>";

						html += "</tr>"; 
					});
				}
				else {
					html = "<tr><td colspan='4' class='txt-center' >조회결과가 없습니다.</td></tr>";
				}

				$("#tab_userlist_left_top > tbody").html(html);
				 
				
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	},

	/** 프로젝트 투입비용 산출 (tab6) - 팝업 - 우측 TOP : 직급별 투입비용  */
	queryProjectCostPopRightTop: function(_sDate, _eDate ) {

		$.ajax({
			type: "POST",
			url: "/statisticquery/query.do",
			data: {"startDate":calDateUpdate(_sDate,-1).replace(/-/g, '')  
				,"endDate":_eDate.replace(/-/g, '') 
				,"pmscode":$('#pmscode'  ,window.opener.document).val()
				,"gubun":"projectcost_pop_right_top"  
			},
			async:false,
			dataType : 'json',
			beforeSend : function() {
			},
			complete: function() {
				
			},
			success:function(result){ 
				
				var html = "";
				if (result.data.length > 0) {
					$(result.data).each(function(i) { 
						html += "<tr  >";
						 
						html += "	<td class='txt-center' >"+this.positionname  +"</td>";
						html += "	<td class='txt-center' >"+this.positioncode  +"</td>";
						html += "	<td class='txt-right3' >"+comma(this.sum_pms_cost)  +"</td>";
						html += "	<td class='txt-center' >"+this.sum_user_cnt  +"명</td>";
						html += "	<td class='txt-right3' >"+this.sum_job_time  +"</td>";
						
						 
						html += "</tr>"; 
					});
				}
				else {
					html = "<tr><td colspan='5' class='txt-center' >조회결과가 없습니다.</td></tr>";
				}

				$("#tab_userlist_right_top > tbody").html(html);
				 
				
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	},
	
	 
	/** 프로젝트 투입비용 산출 (tab6) - 팝업 우측 리스트   */
	queryProjectCostPopRight: function(tr_id) {    
		var user_id  = $("#" + tr_id).children().get(0).innerText; 

		$.ajax({
			type: "POST",
			url: "/statisticquery/query.do",
			data: {"startDate":calDateUpdate($("#inp_startDate" ,window.opener.document).val(),-1).replace(/-/g, '')  
				,"endDate":$("#inp_endDate" ,window.opener.document).val().replace(/-/g, '') 
				,"user_id":user_id
				,"pmscode":$('#pmscode'  ,window.opener.document).val()
				,"gubun":"projectcost_pop_right"  
			},
			async:false,
			dataType : 'json',
			beforeSend : function() { 
			},
			complete: function() {
				
			},
			success:function(result){ 
				
				var html = "";
				if (result.data.length > 0) {
					$(result.data).each(function(i) { 
						html += "<tr   id='tr_right_" + i + "' >";
						
						html += "	<td class='txt-center'>"+formatDate(this.start_date,'/')+" ~ "+formatDate(this.end_date,'/')+"</td>";
						html += "	<td class='txt-right3' >"+this.ratio  +"</td>"; 
						html += "	<td class='txt-right3' >"+comma(this.user_cost)    +"</td>";
						 
						html += "</tr>"; 
					});
				}
				else {
					html = "<tr><td colspan='3' class='txt-center' >조회결과가 없습니다.</td></tr>";
				}

				$("#tab_userlist_right > tbody").html(html);
				 
				
			},
			error : function(x, t, e) {
				handleErrorMessage(x, t, e);
			}
		});
	}
	,
	draw_chart: function() {
		
	},

	validate: function() {
		return true;
	}
};

/**
 * 
 * @param chart_id
 * @param _w
 * @param _h
 * @param _t
 * @param _x
 * @param _y
 * @param result
 * @param lv
 */
function drawStackedBarChart(chart_id, _w, _h, _t, _x, _y, result, lv)
{
	var chartXmlString = ''
		+ "<vc:Chart xmlns:vc=\"clr-namespace:Visifire.Charts;assembly=SLVisifire.Charts\"" 
		+ " Width=\""+_w+"\" Height=\""+_h+"\" Theme=\"Theme1\"" 
		+ " BorderThickness=\"0\" Watermark=\"False\" ScrollingEnabled=\"False\">";
		
	/* chart title,axes */
	if(_t && _t.length>0){
		chartXmlString += 	
			"<vc:Chart.Titles>"
			+	"<vc:Title Text=\""+_t+"\" />"
			+"</vc:Chart.Titles>";
	}
	if(_x && _x.length>0){
		chartXmlString += 	
			"<vc:Chart.AxesX>"
			+	"<vc:Axis Title=\""+_x+"\" />"
			+"</vc:Chart.AxesX>";
	}
	if(_y && _y.length>0){
		chartXmlString += 	
			"<vc:Chart.AxesY>"
			+	"<vc:Axis Title=\""+_y+"\" Suffix=\"%\" />"
			+"</vc:Chart.AxesY>";
	}
	else
	{
		chartXmlString += 	
			"<vc:Chart.AxesY>"
			+	"<vc:Axis Suffix=\"%\"/>"
			+"</vc:Chart.AxesY>";
	}
	
	if (result.data.length > 0) 
	{
		chartXmlString += 
			"<vc:Chart.Series>"
			+	"<vc:DataSeries RenderAs=\"StackedColumn\" AxisYType=\"Primary\" ShowInLegend=\"FALSE\" LabelEnabled=\"True\" >"
			+       "<vc:DataSeries.DataPoints>";
		
		switch (Number(lv)) 
		{
			case 1: /* lv1 */
				$(result.data).each(function(i) {
					chartXmlString +=  "<vc:DataPoint LabelStyle=\"Inside\" LabelText=\"#AxisXLabel\" AxisXLabel=\""+this.lv1txt+"\" XValue=\""+this.lv2+"\" YValue=\""+this.val2+"\" />";
				});
			break;
			case 2: /* lv2 */
				$(result.data).each(function(i) {
					chartXmlString +=  "<vc:DataPoint LabelStyle=\"Inside\" LabelText=\"#AxisXLabel\" AxisXLabel=\""+this.lv2txt+"\" XValue=\""+this.lv1+"\" YValue=\""+this.val5+"\" />";
				});
			break;
			case 3: /* lv3 */
				var oldlv2Txt = "";
				var xValue = 1;
				var resultLen = result.data.length;
				var lv2TotalPer = 0;
				var toolTipArray = new Array();
				var toolTipText = "";
				$(result.data).each(function(i) {
					if(this.lv3txt == null || this.lv3txt == 'null' || this.lv3txt == '')
					{
						this.lv3txt = this.lv2txt;
					}
					
					if(this.lv2txt != oldlv2Txt)
					{
						if(oldlv2Txt != "")
						{
							toolTipText = ("\\n"+oldlv2Txt + ":" + lv2TotalPer+"%") +toolTipText;
							toolTipArray[xValue] = toolTipText;
							toolTipText = "";
							xValue++;
							lv2TotalPer = 0;
						}
						oldlv2Txt = this.lv2txt;
						toolTipText = ("\\n   "+this.lv3txt + ":" + this.val8+"%") +toolTipText; 
						lv2TotalPer += parseInt(this.val8);
					}
					else
					{
						if((resultLen-1) == i)
						{
							toolTipText = ("\\n   "+this.lv3txt + ":" + this.val8+"%") +toolTipText;
							lv2TotalPer += parseInt(this.val8);
							toolTipText = ("\\n"+oldlv2Txt + ":" + lv2TotalPer+"%") +toolTipText;
							toolTipArray[xValue] = toolTipText;
						}
						else
						{
							toolTipText = ("\\n   "+this.lv3txt + ":" + this.val8+"%") +toolTipText;
							lv2TotalPer += parseInt(this.val8);
						}
					}
				});

				oldlv2Txt = "";
				xValue = 1; // 초기화
				$(result.data).each(function(i) {
					if(this.lv3txt == null || this.lv3txt == 'null' || this.lv3txt == '')
					{
						this.lv3txt = this.lv2txt;
					}
					
					if(this.lv2txt != oldlv2Txt)
					{
						if(oldlv2Txt == "")
						{
							chartXmlString +=  "<vc:DataPoint LabelText=\" \" ToolTipText=\""+toolTipArray[xValue]+"\" LegendText=\""+this.id+"\" AxisXLabel=\""+this.lv3txt+"\" XValue=\""+xValue+"\" YValue=\""+this.val8+"\" />";
						}
						else
						{
							chartXmlString +=  "<vc:DataPoint LabelStyle=\"Outside\" LabelText=\"#Sum\" ToolTipText=\""+toolTipArray[xValue]+"\" LegendText=\""+this.id+"\" AxisXLabel=\""+oldlv2Txt+"\" XValue=\""+xValue+"\" YValue=\""+0+"\" />";
							xValue++;
							chartXmlString +=  "<vc:DataPoint LabelText=\" \" ToolTipText=\""+toolTipArray[xValue]+"\" LegendText=\""+this.id+"\"  AxisXLabel=\""+this.lv3txt+"\" XValue=\""+(xValue)+"\" YValue=\""+this.val8+"\" />";
						}
						oldlv2Txt = this.lv2txt;
					}
					else
					{
						if((resultLen -1) == i)
						{ 
							chartXmlString +=  "<vc:DataPoint LabelText=\" \" ToolTipText=\""+toolTipArray[xValue]+"\" LegendText=\""+this.id+"\" AxisXLabel=\""+this.lv3txt+"\" XValue=\""+xValue+"\" YValue=\""+this.val8+"\" />";
							chartXmlString +=  "<vc:DataPoint LabelStyle=\"Outside\" ToolTipText=\""+toolTipArray[xValue]+"\" LabelText=\"#Sum\" LegendText=\""+this.id+"\" AxisXLabel=\""+oldlv2Txt+"\" XValue=\""+xValue+"\" YValue=\""+0+"\" />";
						}
						else
						{
							chartXmlString +=  "<vc:DataPoint LabelText=\" \" ToolTipText=\""+toolTipArray[xValue]+"\" LegendText=\""+this.id+"\" AxisXLabel=\""+this.lv3txt+"\" XValue=\""+xValue+"\" YValue=\""+this.val8+"\" />";
						}
					}
				});
			break;
			default :  
				break;
		}
		
		chartXmlString += 
			"</vc:DataSeries.DataPoints>"
			+ 	"</vc:DataSeries>"
			+"</vc:Chart.Series>";
	}
	
	chartXmlString += "</vc:Chart>"; 

	var vChart = new Visifire2("/chart/SL.Visifire.Charts.xap " , _w , _h );
	vChart.setWindowlessState(true);
	vChart.setDataXml(chartXmlString);
	
	/* click event */
	vChart.preLoad = function(args){
		var chart = args[0];
		for(var i = 0 ; i < chart.Series.length; i++)
		{
			for(var j = 0; j < chart.Series[i].DataPoints.length; j++)
			{
				chart.Series[i].DataPoints[j].MouseLeftButtonUp=function(sender, eventArgs){ 
//					alert("\nL-Text:"+sender.LegendText+"\nXValue:"+sender.XValue);
					if(chart_id == 'chart_tech_level2')
					{
						chartLevel2Table('3',sender.LegendText);
					}
					else if(chart_id == 'chart_org_level3')
					{ 
						orgDetailList(sender.LegendText,sender.AxisXLabel);
					}
				};
				 
			}
		}
	};
	vChart.render(chart_id);
}

/**
 * 
 * @param chart_id
 * @param _w
 * @param _h
 * @param _f
 * @param result
 */
function drawPieChart(chart_id, _w, _h, _f, result)
{
	var chartXmlString = ''
		+ '<vc:Chart xmlns:vc="clr-namespace:Visifire.Charts;assembly=SLVisifire.Charts" Width="'+_w+'" Height="'+_h+'" BorderThickness="0" Padding="10" View3D="True" BorderBrush="Gray" ScrollingEnabled="true"  Watermark="False">'
		+ '<vc:Chart.Legends>'
		+ 	'<vc:Legend FontSize=\"12\" FontWeight=\"Bold\" />'
		+ '</vc:Chart.Legends>'
		+ 	'<vc:Chart.Series>'
		+ 		'<vc:DataSeries RenderAs="Pie" AxisYType="Primary" Bevel="True">'
		+ 			'<vc:DataSeries.DataPoints>';

	if (result && result.data.length > 0) {
		
		$(result.data).each(function(i) {
			chartXmlString += 
					'<vc:DataPoint LabelFontSize=\"10\" LabelStyle="Inside" LabelText="#AxisXLabel(#YValue명)"'
				+ ' AxisXLabel="'+this.gubun2+'" XValue ="'+this.gubun1+'" YValue="'+formatDateDecimal(this.val1)+'" Cursor="Hand"/>';
		});
	}
	
	chartXmlString += 
		  			'</vc:DataSeries.DataPoints>'
		+ 		'</vc:DataSeries>'
		+	'</vc:Chart.Series>'
		+ '</vc:Chart>' ;

	var vChart = new Visifire2("/chart/SL.Visifire.Charts.xap " , _w , _h );
	vChart.setWindowlessState(true);
	vChart.setDataXml(chartXmlString);
	
	/* click event */
	vChart.preLoad = function(args){
		var chart = args[0];
		for(var i = 0 ; i < chart.Series.length; i++)
		{
			for(var j = 0; j < chart.Series[i].DataPoints.length; j++)
			{
				chart.Series[i].DataPoints[j].MouseLeftButtonUp=function(sender, eventArgs){ 
					alert("\nL-Text:"+sender.LegendText+"\nXValue:"+sender.XValue  );
					if(chart_id == 'chart_tot'){
						popMainOverlap();
					}
				};
			}
		}
	};
	
	vChart.render(chart_id);
}

/**
 * 
 * @param chart_id
 * @param _w
 * @param _h
 * @param _t
 * @param _x
 * @param _y
 * @param result
 */
function drawBarChart(chart_id, _w, _h, _t, _x, _y, result)
{
	var chartXmlString = ''
		+ "<vc:Chart xmlns:vc=\"clr-namespace:Visifire.Charts;assembly=SLVisifire.Charts\"" 
		+ " Width=\""+_w+"\" Height=\""+_h+"\" Theme=\"Theme1\"" 
		+ " BorderThickness=\"0\" Watermark=\"False\" ScrollingEnabled=\"False\">";
		
	/* chart title,axes */
	if(_t && _t.length>0){
		chartXmlString += 	
			"<vc:Chart.Titles>"
			+	"<vc:Title Text=\""+_t+"\" />"
			+"</vc:Chart.Titles>";
	}
	if(_x && _x.length>0){
		chartXmlString += 	
			"<vc:Chart.AxesX>"
			+	"<vc:Axis Title=\""+_x+"\" />"
			+"</vc:Chart.AxesX>";
	}
	if(_y && _y.length>0){
		chartXmlString += 	
			"<vc:Chart.AxesY>"
			+	"<vc:Axis Title=\""+_y+"\" />"
			+"</vc:Chart.AxesY>";
	}
	
	if (result.data.length > 0) 
	{
		chartXmlString += 
			"<vc:Chart.Series>";
		
		/* dataseries 1 - 선행*/
    	chartXmlString +=
    			"<vc:DataSeries LegendText=\"선행\" RenderAs=\"Column\">"
    		+		"<vc:DataSeries.DataPoints>";
		$(result.data).each(function(i) { +this.val1+"\" />";
			chartXmlString +=  "<vc:DataPoint LabelStyle=\"Inside\" LabelText=\"#AxisXLabel\" AxisXLabel=\""+this.lv1txt+"\" XValue=\""+(i+1)+"\" YValue=\""+this.val1+"\" />";
		});
    	chartXmlString +=
	    			"</vc:DataSeries.DataPoints>"
	        +	"</vc:DataSeries>";

    	/* dataseries 2 - 양산 */
    	chartXmlString +=
    			"<vc:DataSeries LegendText=\"양산\" RenderAs=\"Column\">"
    		+		"<vc:DataSeries.DataPoints>";
    	$(result.data).each(function(i) {
    		chartXmlString +=  "<vc:DataPoint LabelStyle=\"Inside\" LabelText=\"#AxisXLabel\" AxisXLabel=\""+this.lv1txt+"\" XValue=\""+(i+1)+"\" YValue=\""+this.val2+"\" />";
    	});
    	chartXmlString +=
    				"</vc:DataSeries.DataPoints>"
    			+"</vc:DataSeries>";

    	/* dataseries 2 - 공통 */
    	chartXmlString +=
    			"<vc:DataSeries LegendText=\"공통\" RenderAs=\"Column\">"
    		+		"<vc:DataSeries.DataPoints>";
    	$(result.data).each(function(i) {
    		chartXmlString +=  "<vc:DataPoint LabelStyle=\"Inside\" LabelText=\"#AxisXLabel\" AxisXLabel=\""+this.lv1txt+"\" XValue=\""+(i+1)+"\" YValue=\""+this.val3+"\" />";
    	});
    	chartXmlString +=
	    			"</vc:DataSeries.DataPoints>"
	        +	"</vc:DataSeries>";
    	
		chartXmlString += 
			"</vc:Chart.Series>";
	}
	
	chartXmlString += 
		"</vc:Chart>"; 
	
	var vChart = new Visifire2("/chart/SL.Visifire.Charts.xap " , _w , _h );
	vChart.setWindowlessState(true);
	vChart.setDataXml(chartXmlString);
	
	/* click event */
	vChart.preLoad = function(args){
		var chart = args[0];
		for(var i = 0 ; i < chart.Series.length; i++)
		{
			for(var j = 0; j < chart.Series[i].DataPoints.length; j++)
			{

				chart.Series[i].DataPoints[j].MouseLeftButtonUp=function(sender, eventArgs){ 
					//alert("\nL-Text:"+sender.LegendText+"\nXValue:"+sender.AxisXLabel  );
					if (chart_id == "chart_org"){
						goTab4Detail(sender.LegendText,sender.AxisXLabel);
					}else{
						
					}
					 
				};
			}
		}
	};
	
	vChart.render(chart_id);
}