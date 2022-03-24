
/* 프로젝트 */
var projectList = {
		my: function(target, callback) {
			
			$.ajax({
				type : "POST",
				url : "/research/project/list.do",
				data : { "workDiv2": $("#workDiv2").val()  },
				dataType : 'json',
				async: false,
				success : function(result) {
					var html  = "";
					
					if (result.success) {
									
						$(result.list).each(function(i) {
							
							html += "<tr>";
							html += "<td align='center'>";
							html += "<input type='checkbox' name='checkProject' id='checkProject' class='checkbox' title ='"+this.title+"' state='"+ this.state +"' startDate='" + formatDate(this.taskActualStartDate) + "' endDate='"+ formatDate(this.taskActualFinishDate) +"' value='"+this.pmscode+"' /></td>";
							html += "<td class='txt-center'>"+this.pmscode+"</td>";
							html += "<td>"+this.title+"</td>";
							html += "<td>"+this.state+"</td>";
							html += "<td>"+formatDate(this.taskActualStartDate)+"</td>";
							html += "<td>"+formatDate(this.taskActualFinishDate)+"</td>";
							html += "</tr>";
							
						});
						$("#"+target).html(html);
					}else {
						html = "<tr><td class='txt-center' colspan='6'>조회결과가 없습니다.</td></tr>";
						$("#"+target).html(html);
					}
							
					
					if(html != "" && callback != null && callback != 'undefined') {
						callback.call();
					}
					
				},
				beforeSend : function() {
					$("#"+target).html("");
				},
				complete : function() {
	
				},
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				}
			});
		}
};