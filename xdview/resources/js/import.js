/* 원천데이타 */
var imported = {
		last : false,
		// 원천데이타 조회
		selectList: function(page) {
			if(page == null || page == 'undefined') page = 1;
			
			var progress = new Progress();
			$.ajax({
				type : "POST",
				url : "/research/import.do",
				data : { "page": page },
				dataType : 'json',
				success : function(result) {
					var html = "";
					var preJobStartDate = "";
					var temp_class = "class='tr-case1'";
					
					if (result.success) {
						$("#page").val(result.page);
						imported.last = result.last;
						
						$(result.list).each(function(index) {
							
							if ( preJobStartDate != this.jobStartDate ){ 
								if (  temp_class == "class='tr-case1'"){
									temp_class = "";
								}else{
									temp_class = "class='tr-case1'";
								}
							}
							html +="<tr " +  temp_class + ">";									
							
							html += "	<td class='txt-center'>"+this.id+"</td>";
							html += "	<td class='txt-center'>"+this.research.userName+"</td>";
							
							if(this.jobStartDate=="" && this.jobEndDate=="") {
								html += "	<td class='txt-center'><font color='blue'>프로젝트 미생성</font></td>";
							} else {
								html += "	<td class='txt-center'>"+formatDate(this.jobStartDate)+" ~ "+formatDate(this.jobEndDate)+"</td>";
							}
							html += "</tr>";
							
							preJobStartDate = this.jobStartDate;
							
						});
						$("#total").html(result.total);
					} else {
						html = "<tr><td colspan='11' class='txt-center' >조회결과가 없습니다.</td></tr>";
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
