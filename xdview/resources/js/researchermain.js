/* 연구이력 */
var strUserId;
var strSeq;

var research = {
	last : false,	
	// 메인화면
	selectMainList: function(status) {

		var progress = new Progress();
		//alert(opener.parent.tmpUserId);
		strUserId = opener.parent.tmpUserId;		
		$.ajax({
			type : "POST",
			url : "/research/researchermain.do",
			data : { "status": status , "userId": strUserId },			 
			dataType : 'json',
			success : function(result) {
				var html = "";
				if (result.success) {
					$(result.list).each(function(index) {
						
						if(index%2==1) {
							html += "<tr class='tr-case1'>";
						} else {
							html += "<tr>";
						}

						/*if("Y"==status) {
							html += "	<td class='txt-center'>";
							html += "  <input type='checkbox' name='chs' class='checkbox' approvalCount='"+this.approvalCount+"' value='"+this.id+"' />";
							html += " </td>";
						} else {
							html += "	<td class='txt-center'>"+(index+1)+"</td>";
						}*/
						html += "	<td class='txt-center'>"+nvl(this.workDivName1,"-")+"</td>";
						html += "	<td class='txt-center'>"+nvl(this.workDivName2,"-")+"</td>";
						html += "	<td class='ellipsis' title='"+nvl(this.title,"-")+"'><a href=javascript:research.selectMainListView('"+this.encryptedId+"');>"+nvl(this.title,"-")+"</a></td>";
						html += "	<td class='ellipsis' title='"+linkName(this.productDivName2, this.productDivName3)+"'>"+linkName(this.productDivName2, this.productDivName3)+"</td>";
						html += "	<td class='ellipsis' title='"+linkName(this.techDivName1, this.techDivName2, this.techDivName3)+"'>"+linkName(this.techDivName1, this.techDivName2, this.techDivName3)+"</td>";
						html += "	<td class='ellipsis' title='"+linkName(this.taskDivName1, this.taskDivName2)+"'>"+linkName(this.taskDivName1, this.taskDivName2)+"</td>";
						html += "	<td class='txt-center'>"+this.workDay+"</td>";
						
						html += "	<td class='txt-center'>"+this.ratio+"</td>";
						html += "	<td class='txt-center'>"+formatDate(this.jobStartDate,'/')+" ~ "+formatDate(this.jobEndDate,'/')+"</td>";
						html += "</tr>";
						
					});
				} else {
					html = "<tr><td class='txt-center' colspan='12'>조회결과가 없습니다.</td></tr>";
				}
				
				if(status == "Y") {
					$("#research_progress > tbody").html(html);
				} else {
					$("#research_finish > tbody").html(html);
				}
				
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

	selectMainListRCIS: function(status) {

		var progress = new Progress();
		//alert(opener.parent.tmpUserId);
		strUserId = opener.parent.tmpUserId;		
		$.ajax({
			type : "POST",
			url : "/research/researchermainRCIS.do",
			data : { "status": status , "userId": strUserId },			 
			dataType : 'json',
			success : function(result) {
				var html = "";
				if (result.success) {
					$(result.list).each(function(index) {
						
						if(index%2==1) {
							html += "<tr class='tr-case1'>";
						} else {
							html += "<tr>";
						}

						/*if("Y"==status) {
							html += "	<td class='txt-center'>";
							html += "  <input type='checkbox' name='chs' class='checkbox' approvalCount='"+this.approvalCount+"' value='"+this.id+"' />";
							html += " </td>";
						} else {
							html += "	<td class='txt-center'>"+(index+1)+"</td>";
						}*/
						html += "	<td class='txt-center'>"+nvl(this.workDivName1,"-")+"</td>";
						html += "	<td class='txt-center'>"+nvl(this.workDivName2,"-")+"</td>";
						html += "	<td class='ellipsis' title='"+nvl(this.title,"-")+"'><a href=javascript:research.selectMainListViewRCIS('"+this.encryptedId+"');>"+nvl(this.title,"-")+"</a></td>";
						html += "	<td class='ellipsis' title='"+linkName(this.productDivName2, this.productDivName3)+"'>"+linkName(this.productDivName2, this.productDivName3)+"</td>";
						html += "	<td class='ellipsis' title='"+linkName(this.techDivName1, this.techDivName2, this.techDivName3)+"'>"+linkName(this.techDivName1, this.techDivName2, this.techDivName3)+"</td>";
						html += "	<td class='ellipsis' title='"+linkName(this.taskDivName1, this.taskDivName2)+"'>"+linkName(this.taskDivName1, this.taskDivName2)+"</td>";
						html += "	<td class='txt-center'>"+this.workDay+"</td>";
						
						html += "	<td class='txt-center'>"+this.ratio+"</td>";
						html += "	<td class='txt-center'>"+formatDate(this.jobStartDate,'/')+" ~ "+formatDate(this.jobEndDate,'/')+"</td>";
						html += "</tr>";
						
					});
				} else {
					html = "<tr><td class='txt-center' colspan='9'>조회결과가 없습니다.</td></tr>";
				}
				
				if(status == "Y") {
					$("#research_progress > tbody").html(html);
				} else {
					$("#research_finish > tbody").html(html);
				}
				
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
	
	// 프로젝트명 클릭시 상세보기 화면이동 현재 오류
	selectMainListView: function(id) {
		listForm.method = "POST";
		listForm.action = "/research/researcherview.do";
		listForm.id.value=id;
		listForm.submit();
	},
	
	selectMainListViewRCIS: function(id) {
		listForm.method = "POST";
		listForm.action = "/research/researcherviewRCIS.do";
		listForm.id.value=id;
		listForm.submit();
	},
	
	// 연구이력종합 조회
	selectTotalInfo: function(status) {
		strUserId = parent.tmpUserId;
		$.ajax({
			type : "POST",
			url : "/research/researchertotal.do",
			data : { "userId": strUserId },
			dataType : 'json',
			success : function(result) {
				var html = "";
				if (result.success) {
					$(result.list).each(function(index) {
						var year = 0;
						var month = 0;
						
						if(this.jobTime >= 12) {
							year = parseInt(this.jobTime/12);
							month = parseFloat((this.jobTime%12).toFixed(1));
						} else {
							month = parseFloat(this.jobTime.toFixed(1));
						}
												
//						console.log("jobTime:"+this.jobTime);
//						console.log("year:"+year);
//						console.log("month:"+month);
						
						html += "<tr>";
						html += "	<td class='txt-center'>"+this.research.productDivName1+"</td>";
						html += "	<td class='txt-center'>"+this.research.techDivName1+"</td>";
						html += "	<td class='txt-center'>"+( (year>0) ? (year+"년 "+month+"개월") : (month+"개월") )+"</td>";
						html += "	<td>"+linkName(this.research.productDivName2, this.research.productDivName3)+"</td>";
						html += "	<td>"+linkName(this.research.techDivName1, this.research.techDivName2, this.research.techDivName3)+"</td>";
						html += "	<td class='txt-center'>"+formatDate(this.jobStartDate.substring(0,6))+" ~ "+formatDate(this.jobEndDate.substring(0,6))+"</td>";
						html += "</tr>";
					});
				} else {
					html = "<tr><td class='txt-center' colspan='12'>조회결과가 없습니다.</td></tr>";
				}
				
				$("#research_total > tbody").html(html);
				
				// 셀병합
				$('#research_total').rowspan(0);
				$('#research_total').rowspan(1, true);
				
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			}
		});
	},

	selectTotalInfoMCIS: function(status) {
		strUserId = parent.tmpUserId;
		$.ajax({
			type : "POST",
			url : "/research/researchertotalMCIS.do",
			data : { "userId": strUserId },
			dataType : 'json',
			success : function(result) {
				var html = "";
				if (result.success) {
					$(result.list).each(function(index) {
						var year = 0;
						var month = 0;
						
						if(this.jobTime >= 12) {
							year = parseInt(this.jobTime/12);
							month = parseFloat((this.jobTime%12).toFixed(1));
						} else {
							month = parseFloat(this.jobTime.toFixed(1));
						}
												
//						console.log("jobTime:"+this.jobTime);
//						console.log("year:"+year);
//						console.log("month:"+month);
						
						html += "<tr>";
						if(this.research.nonProjectGb =='Y'){
							html += "	<td class='txt-center'>비프로젝트</td>";
						}else{
							html += "	<td class='txt-center'>"+this.research.productDivName1+"</td>";
						}
						html += "	<td class='txt-center'>"+this.research.productDivName2+"</td>";
						html += "	<td class='txt-center'><a href=javascript:research.selectMainListView2('"+this.research_id+"');>"+this.research.productDivName3+"</a></td>";

						html += "	<td class='txt-center'>"+( (year>0) ? (year+"년 "+month+"개월") : (month+"개월") )+"</td>";
						html += "	<td class='txt-center'>"+formatDate(this.jobStartDate.substring(0,6))+" ~ "+formatDate(this.jobEndDate.substring(0,6))+"</td>";
						html += "</tr>";
					});
				} else {
					html = "<tr><td class='txt-center' colspan='12'>조회결과가 없습니다.</td></tr>";
				}
				
				$("#research_total > tbody").html(html);
				
				// 셀병합
				$('#research_total').rowspan(0);
				$('#research_total').rowspan(1, true);
				
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			}
		});
	},	

	selectTotalInfoMCISJIKMU: function(status) {
		strUserId = parent.tmpUserId;

		$.ajax({
			type : "POST",
			url : "/research/researchermainMCIS2.do",
			data : { "userId": strUserId },
			dataType : 'json',
			success : function(result) {
				var html = "";
				if (result.success) {
					$(result.list).each(function(index) {
						
						var today2 = new Date();
						var ymd2 = today2.getFullYear().toString() + "/" + comRight("0" + (today2.getMonth()+1).toString(),2) + "/" + comRight("0" + today2.getDate().toString(),2);
						
						if(this.majorYn=="Y"){
							jikmuGubun="주직무";  
						} else {
							jikmuGubun="부직무";
						}
						
						if(this.approvalStatus == 'Y'){
						html += "   <tr>";

						
						if( this.approvalStatus == 'Y' && formatDate(this.jikmuEnd,'/') >= ymd2 && formatDate(this.jikmuStart,'/') <= ymd2){
							
							html += "	<td class='txt-center' style='background-color:#FFFDC3'><font color='red'>현재</font></td>";
							html += "	<td class='txt-center' style='background-color:#FFFDC3'>" + jikmuGubun +"</td>";
							html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.jikmuDivNm1 +"</td>";
							html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.jikmuDivNm2 +"</td>";
							html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.jikmuDivNm3 +"</td>";
							
							if(this.changecnt1 > 1 && cntx1 != this.changecnt1){
								html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.start1.substring(0,10).split("-").join("/") + " ~ ";
								cntx1 = cntx1+1;
							}else if(this.changecnt2 > 1 && cntx2 != this.changecnt2){
								html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.start2.substring(0,10).split("-").join("/") + " ~ ";
								cntx2 = cntx2+1;
							}else if(this.changecnt3 > 1 && cntx3 != this.changecnt3){
								html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.start3.substring(0,10).split("-").join("/") + " ~ ";
								cntx3 = cntx3+1;
							}else{
								html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +formatDate(this.jikmuStart,'/') + " ~ ";
							}
							
							if ( formatDate(this.jikmuEnd,'/') == "9999/12/31" ){
								if( this.end1 != "9999-12-31 00:00:00" ){
									html +=  this.end1.substring(0,10).split("-").join("/");
								}else if( this.end2 != "9999-12-31 00:00:00" ){
									html +=  this.end2.substring(0,10).split("-").join("/");
								}else if( this.end3 != "9999-12-31 00:00:00" ){
									html +=  this.end3.substring(0,10).split("-").join("/");
								}else{
									html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
								}
							}
							else{
								html +=  formatDate(this.jikmuEnd,'/');
							}
							html += "    </td>";
							html += "</tr>";
							
						}else{
							html += "	<td class='txt-center'>  </td>";
							html += "	<td class='txt-center'>" + jikmuGubun +"</td>";
							html += "	<td class='txt-center'>" +this.jikmuDivNm1 +"</td>";
							html += "	<td class='txt-center'>" +this.jikmuDivNm2 +"</td>";
							html += "	<td class='txt-center'>" +this.jikmuDivNm3 +"</td>";
							
							if(this.changecnt1 > 1 && cntx1 != this.changecnt1){
								html += "	<td class='txt-center'>" +this.start1.substring(0,10).split("-").join("/") + " ~ ";
								cntx1 = cntx1+1;
							}else if(this.changecnt2 > 1 && cntx2 != this.changecnt2){
								html += "	<td class='txt-center'>" +this.start2.substring(0,10).split("-").join("/") + " ~ ";
								cntx2 = cntx2+1;
							}else if(this.changecnt3 > 1 && cntx3 != this.changecnt3){
								html += "	<td class='txt-center'>" +this.start3.substring(0,10).split("-").join("/") + " ~ ";
								cntx3 = cntx3+1;
							}else{
								html += "	<td class='txt-center'>" +formatDate(this.jikmuStart,'/') + " ~ ";
							}

							if ( formatDate(this.jikmuEnd,'/') == "9999/12/31" ){
								if( this.end1 != "9999-12-31 00:00:00" ){
									html +=  this.end1.substring(0,10).split("-").join("/");
								}else if( this.end2 != "9999-12-31 00:00:00" ){
									html +=  this.end2.substring(0,10).split("-").join("/");
								}else if( this.end3 != "9999-12-31 00:00:00" ){
									html +=  this.end3.substring(0,10).split("-").join("/");
								}else{
									html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
								}
							}
							else{
								html +=  formatDate(this.jikmuEnd,'/');
							}
							html += "    </td>";
							html += "</tr>";
						}
						}

					});
				} else {
					html = "<tr><td class='txt-center' colspan='12'>조회결과가 없습니다.</td></tr>";
				}

				$("#research_total > tbody").html(html);
				
				// 셀병합
				//$('#research_total').rowspan(0);
				//$('#research_total').rowspan(1, true);
				
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			}
		});
	},	

	selectTotalInfoMCISJIKMU2: function(strUserId) {
		//strUserId = parent.tmpUserId;

		$.ajax({
			type : "POST",
			url : "/research/researchermainMCIS2.do",
			data : { "userId": strUserId },
			dataType : 'json',
			success : function(result) {
				var html = "";
				if (result.success) {
					$(result.list).each(function(index) {
						
						var today2 = new Date();
						var ymd2 = today2.getFullYear().toString() + "/" + comRight("0" + (today2.getMonth()+1).toString(),2) + "/" + comRight("0" + today2.getDate().toString(),2);
						
						if(this.majorYn=="Y"){
							jikmuGubun="주직무";  
						} else {
							jikmuGubun="부직무";
						}
						
						if(this.approvalStatus == 'Y'){
						html += "   <tr>";

						
						if( this.approvalStatus == 'Y' && formatDate(this.jikmuEnd,'/') >= ymd2 && formatDate(this.jikmuStart,'/') <= ymd2){
							
							html += "	<td class='txt-center' style='background-color:#FFFDC3'><font color='red'>현재</font></td>";
							html += "	<td class='txt-center' style='background-color:#FFFDC3'>" + jikmuGubun +"</td>";
							html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.jikmuDivNm1 +"</td>";
							html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.jikmuDivNm2 +"</td>";
							html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.jikmuDivNm3 +"</td>";
							
							if(this.changecnt1 > 1 && cntx1 != this.changecnt1){
								html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.start1.substring(0,10).split("-").join("/") + " ~ ";
								cntx1 = cntx1+1;
							}else if(this.changecnt2 > 1 && cntx2 != this.changecnt2){
								html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.start2.substring(0,10).split("-").join("/") + " ~ ";
								cntx2 = cntx2+1;
							}else if(this.changecnt3 > 1 && cntx3 != this.changecnt3){
								html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +this.start3.substring(0,10).split("-").join("/") + " ~ ";
								cntx3 = cntx3+1;
							}else{
								html += "	<td class='txt-center' style='background-color:#FFFDC3'>" +formatDate(this.jikmuStart,'/') + " ~ ";
							}
							
							if ( formatDate(this.jikmuEnd,'/') == "9999/12/31" ){
								if( this.end1 != "9999-12-31 00:00:00" ){
									html +=  this.end1.substring(0,10).split("-").join("/");
								}else if( this.end2 != "9999-12-31 00:00:00" ){
									html +=  this.end2.substring(0,10).split("-").join("/");
								}else if( this.end3 != "9999-12-31 00:00:00" ){
									html +=  this.end3.substring(0,10).split("-").join("/");
								}else{
									html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
								}
							}
							else{
								html +=  formatDate(this.jikmuEnd,'/');
							}
							html += "    </td>";
							html += "</tr>";
							
						}else{
							html += "	<td class='txt-center'>  </td>";
							html += "	<td class='txt-center'>" + jikmuGubun +"</td>";
							html += "	<td class='txt-center'>" +this.jikmuDivNm1 +"</td>";
							html += "	<td class='txt-center'>" +this.jikmuDivNm2 +"</td>";
							html += "	<td class='txt-center'>" +this.jikmuDivNm3 +"</td>";
							
							if(this.changecnt1 > 1 && cntx1 != this.changecnt1){
								html += "	<td class='txt-center'>" +this.start1.substring(0,10).split("-").join("/") + " ~ ";
								cntx1 = cntx1+1;
							}else if(this.changecnt2 > 1 && cntx2 != this.changecnt2){
								html += "	<td class='txt-center'>" +this.start2.substring(0,10).split("-").join("/") + " ~ ";
								cntx2 = cntx2+1;
							}else if(this.changecnt3 > 1 && cntx3 != this.changecnt3){
								html += "	<td class='txt-center'>" +this.start3.substring(0,10).split("-").join("/") + " ~ ";
								cntx3 = cntx3+1;
							}else{
								html += "	<td class='txt-center'>" +formatDate(this.jikmuStart,'/') + " ~ ";
							}

							if ( formatDate(this.jikmuEnd,'/') == "9999/12/31" ){
								if( this.end1 != "9999-12-31 00:00:00" ){
									html +=  this.end1.substring(0,10).split("-").join("/");
								}else if( this.end2 != "9999-12-31 00:00:00" ){
									html +=  this.end2.substring(0,10).split("-").join("/");
								}else if( this.end3 != "9999-12-31 00:00:00" ){
									html +=  this.end3.substring(0,10).split("-").join("/");
								}else{
									html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
								}
							}
							else{
								html +=  formatDate(this.jikmuEnd,'/');
							}
							html += "    </td>";
							html += "</tr>";
						}
						}

					});
				} else {
					html = "<tr><td class='txt-center' colspan='12'>조회결과가 없습니다.</td></tr>";
				}

				$("#research_total > tbody").html(html);
				
				// 셀병합
				//$('#research_total').rowspan(0);
				//$('#research_total').rowspan(1, true);
				
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			}
		});
	},	
		
	
	// 연구이력종합 조회 IDP
	selectIdpInfo: function(status) {	
		strUserId = opener.parent.tmpUserId;
		$.ajax({
			type : "POST",
			url : "/statisticquery/query.do",
			data : {
				 "startDate":""
				,"endDate":""				
				,"userId": strUserId 
				,"gubun":"researcherHistoryIDP_list"
				},
			success : function(result) {
				//var html = "";				
				var html="<table id=\"table_S\" style=\"width:100%\">";
				html+="<colgroup>";
				html+="<col width=\"100\" />";
				html+="<col width=\"250\" />";
				html+="<col width=\"400\" />";
				html+="<col width=\"250\" />";
				html+="</colgroup>";
				html+="<thred>";
				html+="<tr class=\"thead\">";
				html+="<th></th>";
				html+="<th>구분</th>";
				html+="<th>상세</th>";
				html+="<th>레벨</th>";
				html+="</tr>";
				html+="</thred>";
				
				//alert(result.data.length);
				if (result.data.length > 0) {
					$(result.data).each(function(i) {			
						html += "<tr>";
						html += "	<td class='txt-center'>"+ eval(i+1) +"</td>";
						html += "	<td class='txt-center'>"+this.idp_gubun+"</td>";
						html += "	<td class='txt-center'>"+this.idp_ability+"</td>";
						html += "	<td class='txt-center'>"+this.idp_lvl+"</td>";
						html += "</tr>";
					});
				} else {				
					html += "<tr><td class='txt-center' colspan='4'>조회결과가 없습니다.</td></tr>";
				}
				
				html+="</table>";
				
				$("#idpData_list").html(html);
			},
			error : function(x, t, e){
				handleErrorMessage(x, t, e);
			}
		});
	},
	
	// 사용자정보 상위데이테에서 가져와서 해당화면에 셋팅함
	setUserInfoList: function() {
		try{
			strSeq = parent.tmpSeq;
			userListData = parent.eachUserList[strSeq].split("^");

			document.getElementById("data0").innerText =userListData[0];
			document.getElementById("data1").innerText =userListData[1];
			document.getElementById("data2").innerText =userListData[2];
			document.getElementById("data3").innerText =userListData[3];
			document.getElementById("data4").innerText =userListData[4];
			document.getElementById("data5").innerText ="";
			/*if ( userListData[5] != "" ) {
				document.getElementById("data5").innerText =userListData[5] + " Lv " + userListData[7];
			} else {
				document.getElementById("data5").innerText ="";
			}*/
						
			strUserId = parent.tmpUserId;
			$.ajax({
				type : "POST",
				url : "/statisticquery/query.do",
				data : {
					 "startDate":""
					,"endDate":""				
					,"userId": strUserId 
					,"gubun":"researcherHistoryUserTopIDP_list"
					},
				success : function(result) {
					var html = "";				
					if (result.data.length > 0) {
						$(result.data).each(function(i) {			
							html += this.idp_gubun+ " Lv " + this.idp_lvl;
						});
					} else {				
						html += "";
					}
					
					$("#data5").html(html);
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
			
		}catch(e){
			alert(e);
		}
	}, 
	
	// 이력등록
	saveHistory: function() {
		if(this.validate()) {
			$.ajax({
				type : "POST",
				url : "/research/history/save.do",
				data : { 
					"historyId": $("input[name=historyId]").val(),
					"jobStartDate": $("#jobStartDate").val(),
					"jobEndDate": $("#jobEndDate").val(),
					"jobTime": $("#jobTime").val(),
					"researchId": $("input[name=researchId]").val()
				},
				dataType : 'json',
				success : function(result) {
					research.renderHistory(result);
				},
				beforeSend : function() {
					research.clearHistory();
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		}
	},
	// 이력삭제
	deleteHistory: function() {
		//console.log($(document.saveForm).serialize());
		if (!$("input[name=chs]").is(":checked")) {
			alert("삭제할 대상을 선택해주세요.");
		} else {
			if(confirm("선택한 연구이력에 대해 삭제하시겠습니까?")) {
				$.ajax({
					type : "POST",
					url : "/research/history/delete.do",
					data : $(document.saveForm).serialize(),
					dataType : 'json',
					success : function(result) {
						research.renderHistory(result);
					},
					beforeSend : function() {
						research.clearHistory();
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					}
				});
			}
		}
	},
	renderHistory: function(result) {
		var html = "";
		if (result.success) {
			$(result.list).each(function(i) {
				html += "<tr onmouseover=\"this.style.cursor='pointer'\" onclick=\"javascript:research.selectHistory('"+this.id+"','"+this.jobStartDate+"','"+this.jobEndDate+"','"+this.jobTime+"','"+this.approvalStatus+"')\">";
				if(this.approvalStatus=="N") {
					html += "	<td><input type='checkbox' name='chs' class='checkbox' value='"+this.id+"' /></td>";
				} else {
					html += "	<td><input type='checkbox' name='chs' class='checkbox' value='"+this.id+"' disabled /></td>";
				}
				html += "	<td>"+formatDate(this.jobStartDate)+" ~ "+formatDate(this.jobEndDate)+"</td>";
				html += "	<td>"+this.jobTime+"</td>";
				if("C" == this.approvalStatus) {
					html += "	<td>승인완료</td>";
				} else if("R" == this.approvalStatus) {
					html += "	<td>반려</td>";
				} else if("P" == this.approvalStatus) {
					html += "	<td>상신</td>";
				} else {
					html += "	<td>-</td>";
				}
				html += "</tr>";
			});
		}
		$("#research_history > tbody").html(html);
	},
	// 초기화
	clearHistory: function() {
		$("#jobStartDate").prop("disabled", false);
		$("#jobEndDate").prop("disabled", false);
		$("#jobTime").prop("disabled", false);

		$("input[name=historyId]").val("");
		$("#jobStartDate").val("");
		$("#jobEndDate").val("");
		$("#jobTime").val("0.0");
	},
	selectHistory: function(historyId,jobStartDate,jobEndDate,jobTime,approvalStatus) {
		$("input[name=historyId]").val(historyId);
		$("#jobStartDate").val(formatDate(jobStartDate,"-"));
		$("#jobEndDate").val(formatDate(jobEndDate,"-"));
		$("#jobTime").val(jobTime);
		
		//console.log("approvalStatus:"+approvalStatus);
		if(approvalStatus == "C" || approvalStatus == "P") {
			$("#jobStartDate").prop("disabled", true);
			$("#jobEndDate").prop("disabled", true);
			$("#jobTime").prop("disabled", true);
		} else {
			$("#jobStartDate").prop("disabled", false);
			$("#jobEndDate").prop("disabled", false);
			$("#jobTime").prop("disabled", false);
		}
	},
	modify: function() {
		if (this.validate()) {
			var f = document.saveForm;
			f.method = "POST";
			f.action = "/research/modify.do";
			f.submit();
		}
	},
	regist: function() {
		if (this.validate()) {
			var f = document.researchForm;
			f.method = "POST";
			f.action = "/" + f.gubun.value + "/regist.do";
			f.submit();
		}
	},
	stopResearch: function() {
		if(confirm("종료처리 하시겠습니까?")) {
			var id = $("input[name=researchId]").val();
			$.ajax({
				type : "POST",
				url : "/research/stop.do",
				data : { 
					"researchId": id
				},
				dataType : 'json',
				success : function(result) {
					if (result.success) {
						alert("해당 프로젝트가 정상적으로 종료처리 되었습니다.");
						alert("하뵤2");
						location.href = "/research/view.do";
						//location.href = "/research/" + id +"/view.do";
					} else {
						alert(result.message);
					}
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		}
	},
	deleteResearch: function() {
		if (!$("input[name=chs]").is(":checked")) {
			alert("삭제할 대상을 선택해주세요..");
		} else {
			var flag = true;
			$("input[name=chs]:checked").each(function() {
				if($(this).attr("approvalCount") > 0) {
				
					flag = false;
				}
			});
			if (!flag) {
				alert("승인완료된 연구이력이 존재하는 프로젝트에 대해서는 삭제할 수 없습니다.\n다시 확인해 주세요.");
			} else {
				if(confirm("삭제하시겠습니까?")) {
					var f = document.listForm;
					f.method = "POST";
					f.action = "/research/delete.do";
					f.submit();
				}
			}
		}
	},
	duplicate: function() {
		if (this.validate()) {
			// 공통인 경우 Key-In 프로젝트 구성하므로, skip!
			if($("#workDiv1").val() != null && $("#workDiv1").val() == "33") {
				research.regist();
			} else {
				$.ajax({
					type : "POST",
					url : "/research/duplicate.do",
					data : { 
						"pmscode": $("#pmscode").val(),
						"title": $("#title").val(),
						"workDiv1": $("#workDiv1").val(),
						"workDiv2": $("#workDiv2").val(),
						"productDiv1": $("#productDiv1").val(),
						"productDiv2": $("#productDiv2").val(),
						"productDiv3": $("#productDiv3").val(),
						"techDiv1": $("#techDiv1").val(),
						"techDiv2": $("#techDiv2").val(),
						"techDiv3": $("#techDiv3").val(),
						"taskDiv1": $("#taskDiv1").val(),
						"taskDiv2": $("#taskDiv2").val()
					},
					dataType : 'json',
					success : function(result) {
						//console.log("duplicate ? "+result.success);
						if (result.success) {
							alert("입력하신 프로젝트가 이미 존재합니다.\n동일한 프로젝트에 대해서는 생성할 수 없습니다.\n다시 확인해 주세요.");
						} else {
							research.regist();
						}
					},
					error : function(x, t, e){
						handleErrorMessage(x, t, e);
					}
				});
			}
		}
	},

	// 프로젝트 클릭시 팝업호출 
	selectMainListView2: function(id) {
		
		var url_gubun = status;
		var url = "";
		var winName = "popPJ";
		var w = 760;  // 가로길이 
		var h = 360;  // 세로길이
		
		url = "/research/product_project_tot.do";
		
		url += "?id="+id;
		//url += "?id="+id+"&status="+status;
		popupWindow(url, winName, w, h);
	   	//p.focus();
	},
	
	
	selectMainHistoryList: function(status) {   
		var progress = new Progress();
		strUserId = opener.parent.tmpUserId;

		$.ajax({
			type : "POST",
			url : "/research/mainHistory.do",
			data : { 
				"status": status , 
				"userId": strUserId , 
				"jobStartDate": $("#jobStartDate1").val() ,
				"jobEndDate": $("#jobEndDate1").val()

			},
			dataType : 'json',
			success : function(result) {
				var html = "";
				var preJobStartDate = "";
				var temp_class = "class='tr-case1'";

				var cnt = 0;
				var rowspanx = "";
				var cntidx = 0;
				
				if (result.success) {
					$(result.list).each(function(index) {

				        if(cnt == 0){
				        	cnt =  this.cnt;
				        	cntx = "pre";
				        	cntidx = cntidx +1;
				        	rowspanx = "rowspan='"+ this.cnt +"'";
				        }else{
				        	rowspanx = "";
				        }
						
						if(index%2==1) {
							html += "<tr class='tr-case1'>";
						} else {
							html += "<tr>";
						}
						
						if(cntx == "pre"){
						html += "	<td class='txt-center' "+rowspanx+">"+cntidx+"</td>";
						if("Y"==this.status) {   		// 진행
							html += "	<td class='txt-center' "+rowspanx+">진행</td>";
						}else{              		// 종료
							html += "	<td class='txt-center' "+rowspanx+">종료</td>";
						}
				
						html += "   <td class='txt-center' "+rowspanx+">"+( (this.non_project_gb == "N") ? ("프로젝트"):("비프로젝트"))+"</td>";
						html += "	<td class='txt-center' "+rowspanx+">"+nvl(this.workDivName1,"-")+"/"+nvl(this.workDivName2,"-")+"</td>";
						
						html += "	<td class='txt-center' "+rowspanx+">"+nvl(this.productDivName1,"-")+"</td>";
						html += "	<td class='txt-center' "+rowspanx+">"+nvl(this.productDivName2,"-")+"</td>";
						
						if(this.non_project_gb == "N"){ // 프로젝트 
							if("Y"==this.status) {   		// 진행
								html += "	<td class='txt-center' "+rowspanx+">"+ this.productDivName3 +"</a></td>";
							}else{              		// 종료
								html += "	<td class='txt-center' "+rowspanx+">"+ this.productDivName3 +"</a></td>";
							}
						} else {                    	// 비프로젝트 
							if("Y"==this.status) {   		// 진행	
								html += "	<td class='txt-center' "+rowspanx+">"+ "비프로젝트" +"</td>";
							}else{                 // 종료
								html += "	<td class='txt-center' "+rowspanx+">"+ "비프로젝트" +"</td>";
							}
						}
						if(this.jobStartDate == "" || this.jobEndDate == ""){
							html += "	<td class='txt-center' "+rowspanx+"> 승인후 반영예정 </td>";
						} else { 
							html += "	<td class='txt-center' "+rowspanx+">"+ formatDate(this.jobStartDate,'/') +" ~ "+formatDate(this.jobEndDate,'/')+"</td>";  // 수행기간
						}
						}
						html += "	<td class='txt-center'>"+ this.title+"</td>";   // 프로젝트 수
						html += "	<td class='txt-center'>"+ this.ratio+"%</td>";   // 프로젝트 수
						html += "</tr>";
						
						preJobStartDate = this.jobStartDate;

						cnt = cnt - 1;	
						cntx = "";
						
						
					});
				} else {
					html = "<tr><td class='txt-center' colspan='11'>조회결과가 없습니다.</td></tr>";
				}
				
					$("#tableId2 > tbody").html(html);
					//tableScrollling("divHeader2", "divContent2", "tableId2");
				
				
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
	validate: function() {
		return true;
	}

};

/* 미입력자 */
var unregistered = {
		last : false,
		// 미입력자 조회
		selectList: function(page) {
			if(page == null || page == 'undefined') page = 1;
			
			var progress = new Progress();
			$.ajax({
				type : "POST",
				url : "/research/unregistered.do",
				data : { "page": page },
				dataType : 'json',
				success : function(result) {
					var html = "";
					if (result.success) {
						$("#page").val(result.page);
						unregistered.last = result.last;
						
						$(result.list).each(function(index) {
							if(index%2==1) {
								html += "<tr class='tr-case1'>";
							} else {
								html += "<tr>";
							}
							html += "	<td class='txt-center'>"+this.id+"</td>";
							html += "	<td class='txt-center'>"+this.research.userName+"</td>";
							html += "	<td class='txt-center'>"+this.research.positionName+"</td>";
							
							if(this.jobStartDate=="" && this.jobEndDate=="") {
								html += "	<td class='txt-center'><font color='blue'>프로젝트 미생성</font></td>";
							} else {
								html += "	<td class='txt-center'>"+formatDate(this.jobStartDate)+" ~ "+formatDate(this.jobEndDate)+"</td>";
							}
							html += "</tr>";
						});
						$("#total").html(result.total);
					} else {
						html = "<tr><td colspan='12'>조회결과가 없습니다..</td></tr>";
					}
					
					$("#research_list > tbody").append(html);
					
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
		}
};




//common.selectBox(1, "techDiv1");     기술표준
//common.selectBox(2, "taskDiv1");     task표준
//common.selectBox(3, "productDiv1");  제품표준
//common.selectBox(4, "workDiv1");     업무표준

/* 공통 */
var common = {
		selectBox: function(code, target, callback) {
			$.ajax({
				type : "POST",
				url : "/cmmcode/json/list.do",   // CmmCodeController.java 컨트롤러 맵핑
				data : { "code": code },         // "code:1" 
				dataType : 'json',
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
					common.clear(target);
				},
				complete : function() {
					hideSelectBox();
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		},
		init: function(id) {
			$("#"+id).val("").trigger("change");
			hideSelectBox();
		},
		clear: function(id) {
			$("#"+id).html("");
			hideSelectBox();
		}

};

/* 프로젝트 */
var project = {
		selectBox: function(target, callback) {
			$.ajax({
				type : "POST",
				url : "/research/project/list.do",
				data : { "workDiv2": $("#workDiv2").val()  },
				dataType : 'json',
				success : function(result) {
					var html = "";
					if (result.success) {
						html += "<option value=''>-선택-</option>";
						$(result.list).each(function(i) {
							html += "<option value='"+this.pmscode+"' carType='"+this.modelname+"'>"+this.title+"</option>";
						});
					}
					
					$("#"+target).html(html);
					
					if(html != "" && callback != null && callback != 'undefined') {
						callback.call();
					}
					
				},
				beforeSend : function() {
					$("#"+target).html("");
				},
				complete : function() {
					hideSelectBox();
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		}
};

function hideSelectBox() {
	$("select").each(function(i) {
//		console.log(">>> "+$(this).attr("id")+":"+$(this).children("option").length);
		if($(this).children("option").size() == 0) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
} 
