/**************************************************************************************
 *  
 * PackageName : resources/js
 * FileName    : perprogress.js
 * 
 * @Title		: 프로젝트경력관리 js
 * @Description : 프로젝트경력관리 - 프로젝트 추가 - 저장 등 js
 * @Version     : 
 * @Author      : 이영호
 * @Date        : 2015.11.19
**************************************************************************************/		

function getXpos(aXis, inS) {
	for(var i=0; i<aXis.length; i++) {
		
		var s = aXis[i];
		var arr = s.split(":");
	
		if(arr.length >1 && arr[0] == inS) {
			return i;		
		}
	}

	return -1;
}

function getValueFromSeries(series, aXis, pos)
{
	for(var i=0; i<aXis.length; i++) {
		var s = aXis[i];
		var arr = s.split(":");
		}			
	
	for(var i=0; i<series.length; i++) {
		
		var o = series[i];
		
		if( o['name'] == arr[1]) {
			var data = o['data'];
			console_logs("data", data);
			return data[pos];
			
		}
	}
	return '';
}
// 개인현황 조회 js파일
var perprogress = {
		// 리서치 헤더 검색 start
		selectResearchheader: function() {
		var researchYN =  $("#researchYN").val();
		var year = $("#tYear").val();
		var perprogress = new perProgress();
		//var projectChartType = 'MODULE_PRIVATE_HISTORY';
		var user = $("#usermain").val();
		$.ajax({
			type : "POST",
			url : "/xdview/chart.do?method=getChart",
			data : {
				cubeCode: 'PJ_MEMBER',
				projectChartType : 'MODULE_PRIVATE_HISTORY',
				projectTotalMonth : $("#tYear").val(),
				oem : $("#tOem option:selected").val(),
				CARMODELNAME : $("#tCars option:selected").val(),
				user :  $("#usermain").val()
			},
			dataType : 'json',
			success : function(result) {
				var html_J = "";
				var html_R = "";
				var preJobStartDate = "";
				var jikmuGubun = "";

				var period = "";
				var temp_class = "class='tr-case1'";
				 
				var map = new Map();
				
				
				var aXis = result['aXis'];
				var aYis = result['aYis'];
				var series = result['series'];
				var valtotal = 0;
				/*console_logs("aXis", aXis);
				console_logs("aYis", aYis);
				console_logs("series", series);*/
				
				var list = [];
				for(var y=0; y<aYis.length; y++) {
					
					var oY = aYis[y];
					var is_val=0;
					var pmscode = oY['pmscode'];
					var title = oY['title'];
					
					
					var pjinit = oY['productcategory'];   // 선행, 양산
					var oem = oY['Modelname'];    // oem
					var model = oY['modeldesc'];   // 차종
					if(model == "NULL"){
						model = '-';
					}
					var swork = oY['taskActualStartDate'];   // 작업 시작일
					var isval = oY['tot_cnt'];   // 투입 공수 합계
					//var o = series[y];
									
					
						for(var num in series){
							var o = series[num];
									if( o['name'] == title) {
										var val = o['data'];
										
										
									}
						}
									//var total_val =0;
									
			
							if ( preJobStartDate != this.jobStartDate ){ 
								if (  temp_class == "class='tr-case1'"){
									temp_class = "class='codeDetailChkbox'";
								}else{
									temp_class = "class='tr-case1'";
								}
							}//endofif							
					
								html_R +="<tr " + temp_class + "onclick='perprogress.selectResearchDetailResearch(this)'>";
								
								html_R += "	<td class='txt-center'>"+pjinit+"</td>";	//1. 선행/양산
								html_R += "	<td class='txt-center' title='" +model+ "'>"+model+"</td>";	//2. 차종
								html_R += "	<td class='txt-center' title='" +pmscode+ "'>"+pmscode+"</td>";	//3. 프로젝트코드
								html_R += "	<td class='txt-center' title='" +title+ "'>"+title+"</td>";	//4. 프로젝트 네임
								html_R += "	<td class='txt-center' title='" +swork+ "'>"+swork+"</td>";	//5. 투입기간
								
								
								
								for ( var num in val ){
														
								
								 var total_val =  parseFloat(parseFloat(val[num]).toFixed(1));
								 	html_R += "<td class='txt-center' title='" +total_val+ "'>"+total_val+"</td>";//6. 1월
								
							
								//html_R += "<td class='txt-center'>"+total_val+"</td>";//7.1월
							
									 //is_val += total_val;
									//is_val = is_val + total_val;
									
								} // in for end
								
								 isval =  parseFloat(parseFloat(isval).toFixed(1));
								console_logs('isval', isval);
								html_R += "	<td class='txt-center' title='" +isval+ "'>"+isval+"</td>";//7.1월
							
								html_R += "</tr>";
					
								valtotal = valtotal + isval;
								 
							
				
			}// out for end
				if ( html_R == "" ){
						html_R = "<tr><td class='txt-center' colspan='18'>검색된 프로젝트가 없습니다.</td></tr>";
					} //if end
				
				valtotal =  parseFloat(parseFloat(valtotal).toFixed(1));
			
				$("#research_header > tbody").html(html_R);
				
				$("#humancost").html(valtotal);
				
			}//endofseccess

		});//endofajax
		
	},	
// 개인별현황 end	
// 개인별현황 상세정보 검색 start	
	selectResearchDetailResearch: function(o) {

		var pcode = o.children[2].innerHTML;
		var researchYN =  $("#researchYN").val();

		var perprogress = new perProgress();
		$.ajax({
			type : "POST",
			url : "/xdview/chart.do?method=getChart",
			data : {
				cubeCode: 'PJ_MEMBER',
				projectChartType : 'MODULE_PRIVATE_HISTORYDE',
				projectTotalMonth : $("#tYear").val(),
				user :  $("#usermain").val(),
				"pcode": pcode
				},
			dataType : 'json',
			success : function(result) {
				var html_R = "";
				var preJobStartDate = "";
				var temp_class = "class='tr-case1'";
				var aXis = result['aXis'];
				var aYis = result['aYis'];
				var series = result['series'];
				var cnt = 0;
				var valtotal = 0;
				console_logs("cnt_out",cnt);
				//var list = [];
				
				for(var y=0; y<aYis.length; y++) {
					var oY = aYis[y];
					
					var productcode1 = oY['productcode1'];
					if(productcode1 == "NULL"){
						productcode1 = '-';
					}
					var productcode2 = oY['productcode2'];
					if(productcode2 == "NULL"){
						productcode2 = '-';
					}
					var productcode3 = oY['productcode3'];
					if(productcode3 == "NULL"){
						productcode3 = '-';
					}
					var tech1 = oY['tech1'];
					if(tech1 == "NULL"){
						tech1 = '-';
					}
					var tech2 = oY['tech2'];
					if(tech2 == "NULL"){
						tech2 = '-';
					}
					var tech3 = oY['tech3'];
					if(tech3 == "NULL"){
						tech3 = '-';
					}
					var task1 = oY['task1'];
					if(task1 == "NULL"){
						task1 = '-';
					}
					var task2 = oY['task2'];
					if(task2 == "NULL"){
						task2 = '-';
					}
					var task3 = oY['task3'];
					if(task3 == "NULL"){
						task3 = '-';
					}
					var title = oY['title'];
					
					//var o = series[y];
								
					for(var num in series){
							var o = series[num];
									if( o['name'] == title) {
										var val = o['data'];
									}
						}				
					//var val = o['data'];
									
					var total_val =0;
					var is_val=0;
					if ( researchYN == 'Y'){ 
								html_R +="<tr " + temp_class + ">";
								html_R += "	<td class='txt-center' title='" +productcode1+ "'>"+productcode1+"</td>";	//1. 제품1
								html_R += "	<td class='txt-center' title='" +productcode2+ "'>"+productcode2+"</td>";	//1. 제품2
								html_R += "	<td class='txt-center' title='" +productcode3+ "'>"+productcode3+"</td>";	//1. 제품3
								html_R += "	<td class='txt-center' title='" +tech1+ "'>"+tech1+"</td>";	//2. 기술1
								html_R += "	<td class='txt-center' title='" +tech2+ "'>"+tech2+"</td>";	//2. 기술2
								html_R += "	<td class='txt-center' title='" +tech3+ "'>"+tech3+"</td>";	//2. 기술3
								html_R += "	<td class='txt-center' title='" +task1+ "'>"+task1+"</td>";	//3. task1
								html_R += "	<td class='txt-center' title='" +task2+ "'>"+task2+"</td>";	//3. task2
								html_R += "	<td class='txt-center' title='" +task3+ "'>"+task3+"</td>";	//3. task3
															
								for ( var num in val ){
									
								total_val =  parseFloat(parseFloat(val[num]).toFixed(1));
							
								html_R += "	<td class='txt-center' title='" +total_val+ "'>"+ total_val +"</td>";//7.1월
							
									 is_val += total_val;
									
								} // in for end
								is_val =  parseFloat(parseFloat(is_val).toFixed(1));
								html_R += "	<td class='txt-center' title='" +is_val+ "'>"+ is_val +"</td>";//7.1월
							
								html_R += "</tr>";
					}
					///////////////
							// 비연구원
							///////////////	
							else{
								html_R +="<tr " + temp_class + ">";
								
								html_R += "	<td class='txt-center' title='" +productcode1+ "'>"+productcode1+"</td>";	//1. 제품1
								html_R += "	<td class='txt-center' title='" +productcode2+ "'>"+productcode2+"</td>";	//1. 제품2
								html_R += "	<td class='txt-center' title='" +productcode3+ "'>"+productcode3+"</td>";	//1. 제품3
								
															
								for ( var num in val ){
									
								total_val =  parseFloat(parseFloat(val[num]).toFixed(1));
							
								html_R += "	<td class='txt-center' title='" +total_val+ "'>"+ total_val +"</td>";//7.1월
							
									 is_val += total_val;
									
								} // in for end
								is_val =  parseFloat(parseFloat(is_val).toFixed(1));
								html_R += "	<td class='txt-center' title='" +is_val+ "'>"+ is_val +"</td>";//7.1월
							
								html_R += "</tr>";
							}
								
						valtotal = valtotal + is_val;
				
					}// out for end
			
				if ( html_R == "" ){
						html_R = "<tr><td class='txt-center' colspan='18'>검색된 프로젝트가 없습니다.</td></tr>";
					} //if end
			$("#humancostde").html(valtotal);
				$("#research > tbody").html(html_R);
			},// result success end
				error : function(x, t, e){
					handleErrorMessage(x, t, e);
				},
				beforeSend : function() {
					perprogress.show();
				},
				complete : function() {
					perprogress.hide();				

					tableScrollling("divHeader1", "divContent1", "research");
				}
		});// ajax end		
		
	},
	// 개인별현황 상세정보 검색 end
	
	
	/*unique:	function(array) {
		
		var result = [];
		$.each(array, function(index, element) {             //배열의 원소수만큼 반복
			if ($.inArray(element, result) == -1) {  //result 에서 값을 찾는다.  //값이 없을경우(-1)
				result.push(element);                       //result 배열에 값을 넣는다.
			}
		});
		return result;
	},*/
	
	// 차종 검색
	selectBox: function(code, target, callback) {
		
		$.ajax({
			type : "POST",
			url : "/cmmcode/json/carslist.do",       // 서버에 요청
			data : { "Code": code },
			dataType : 'json',
			async: research.asyncYN,             // 비동기 동기 구분
			success : function(result) {
				console_logs('result', result);
				var html = "";
				if (result.success) {
					if(result.data.length>0) html += "<option value=''>선택</option>";
					$(result.data).each(function(i) {
						html += "<option value='"+this.modelname+"'>"+this.modelname+"</option>";
					});
				}
				
				$("#"+target).html(html);
				
				if(html != "" && callback != null && callback != 'undefined') {
					callback.call();
				}
				
			},
			beforeSend : function() {
				perprogress.clear(target);
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
	},
	selectResearchDisable: function() {
			var html_R = "";
			$("#research_header > tbody").html(html_R);
		},
	selectResearchDisablede: function() {
			var html_R = "";
			$("#research > tbody").html(html_R);
		}
	
};
function hideSelectBox() {
	$("select").each(function(i) {
		//console.log(">>> "+$(this).attr("id")+":"+$(this).children("option").length);
		if($(this).children("option").size() == 0) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
} 


