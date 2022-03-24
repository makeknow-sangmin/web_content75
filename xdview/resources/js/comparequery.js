var v_QueryData = new Array();

var comparequery = {

		checked: false,
		
		queryByType: function(chart_id, type, yearFrom, yearTo, lev_p, lev_org, input_value1, input_value2, pop_yn) {
			gubun1 = new Array();
			gubun2 = new Array();
			var1 = new Array();
			var2 = new Array();
			var3 = new Array();
			var4 = new Array();
			
			//console.log("rrrrrrrrrrrrrrrrrrrr"+chart_id+"//"+type+"//"+year+"//"+ lev_p+"//"+ lev_org+"//"+ input_value1+"//"+ input_value2+"//"+ pop_yn);
			
			$.ajax({
				type: "POST",
				url: "/comparequery/queryByType.do",
				data: {"type":type
				    ,"yearFrom":yearFrom
				    ,"yearTo":yearTo
				    ,"lev_p":lev_p
				    ,"lev_org":lev_org
				    ,"input_p":input_value1
				    ,"input_org":input_value2
					},
				dataType : 'json',
				success:function(result){
					var tot_val1 = 0;
					var tot_val2 = 0;
					var v_chart_width = 0;
					var v_chart_height = 0;
					var v_chart_font = Number(screen.width) / 134;
					v_chart_font = 10;
					
					if(pop_yn == "N") {

						var v_width = ((Number(screen.width) - 200) / 3) - 20; 
						var v_height = v_width * 0.87;
						
						if(Number(screen.width) < 1024) {
							v_chart_width = 513;
							v_chart_height = 405;
						}
						else {
							v_chart_width = v_width - 16;
							v_chart_height = (v_height * 0.95) - 20;							
						}
					}
					else {
						v_chart_width = 939;
						v_chart_height = 648;
					}
					
					// 공통 조회의 경우 차트가 1개이므로 사이즈를 1.5배 키움
					if(type == "70" && pop_yn == "N") {
						v_chart_width = v_chart_width * 1.5;
						v_chart_height = v_chart_height * 1.5;
					}
			        var chartXmlString = ''
						+ '<vc:Chart xmlns:vc="clr-namespace:Visifire.Charts;assembly=SLVisifire.Charts" Width="'+v_chart_width+'" Height="'+v_chart_height+'" BorderThickness="0" Padding="10" View3D="False" BorderBrush="Gray" ScrollingEnabled="true"  Watermark="False">'
						+ '<vc:Chart.Legends>'
						//+ '<vc:Legend FontSize="'+v_chart_font+'" FontWeight="Bold" />'
						+'<vc:Legend Enabled="False" />'
						+ '</vc:Chart.Legends>'
						+ '     <vc:Chart.Series>'
						+ '         <vc:DataSeries RenderAs="Pie" AxisYType="Primary" Bevel="True">'
						+ '             <vc:DataSeries.DataPoints>';

			        
					if (result.data.length > 0) {
						gubun1 = new Array();						
						gubun2 = new Array();
						val1 = new Array();
						val2 = new Array();
						
						$(result.data).each(function(i) {
							//chartXmlString += '                 <vc:DataPoint LabelText="#AxisXLabel(#YValue명), #Percentage%\\n '+ formatDateDecimal(this.val1)+' 시간('+formatDateDecimal(this.val3)+'시간)" AxisXLabel="'+this.gubun2+'" XValue ="'+this.gubun1+'" YValue="'+formatDateDecimal(this.val2)+'" Cursor="Hand"/>';
							chartXmlString += '                 <vc:DataPoint LabelFontSize=\"'+(v_chart_font)+'\" LabelText="#AxisXLabel(#YValue명), '+ this.val2 +'%\\n '+ formatDateDecimal(this.val3)+' 건" AxisXLabel="'+this.gubun2+'" XValue ="'+this.gubun1+'" YValue="'+formatDateDecimal(this.val1)+'" Cursor="Hand"/>';
							
							gubun1[i] = this.gubun1;
							gubun2[i] = this.gubun2;
							val1[i] = this.val1;
							val2[i] = this.val2;
							tot_val1 += val1[i];
							tot_val2 += val2[i];
						});
					}
					else {
						html = "<tr><td colspan='4'>조회결과가 없습니다.</td></tr>";
					}
					chartXmlString += '             </vc:DataSeries.DataPoints>'
						+ '         </vc:DataSeries>'
						+ '     </vc:Chart.Series>'
						+ ' </vc:Chart>' ;
     
					var vChart = new Visifire2("/chart/SL.Visifire.Charts.xap " , v_chart_width , v_chart_height );
					vChart.setWindowlessState(true);
					vChart.setDataXml(chartXmlString);
					
					if(pop_yn == "N") {
						vChart.preLoad = function(args){
							var chart = args[0];
	
							//for(var j=0 ; j < chart.Series[0].DataPoints.length ; j++) {
								//chart.Series[0].DataPoints[0].MouseLeftButtonUp=function(e){
									//alert(chart_id+"="+0+"/"+gubun1[0]+"/"+gubun2[0]);
								//};
								//chart.Series[0].DataPoints[1].MouseLeftButtonUp=function(e){
									//alert(chart_id+"="+1+"/"+gubun1[1]+"/"+gubun2[1]);
							//	};
								//chart.Series[0].DataPoints[j].MouseLeftButtonUp=function(e){
									//alert(chart_id+"="+j+"/"+gubun1[j]+"/"+gubun2[j]);
								//};							
							//}
							chart.Series[0].MouseLeftButtonUp = function(sender, eventArgs) {
								$("#pop_val1").val(v_QueryData[Number(chart_id.replace(/[a-zA-Z]/g, ''))].input2+"-"+sender.AxisXLabel);
								$("#pop_val2").val(sender.XValue);

								$("#pop_val4").val(v_QueryData[Number(chart_id.replace(/[a-zA-Z]/g, ''))].input1);
								$("#pop_val5").val(v_QueryData[Number(chart_id.replace(/[a-zA-Z]/g, ''))].input2);

								if(v_QueryData[0].input1 == +$("#pop_val4").val()) {
									$("#pop_val3").val(Number($("#pop_val3").val())-1);
								}

								if(sender.XValue != "33") {
									var pop = window.open('/comparequery/queryPiePop.do','pop','width=1030,height=760,location=0 resizable=yes');
									pop.focus();
								}
								else {
									var popGong = window.open('/comparequery/queryTablePop.do','popGongTab','width=520,height=700,location=0');
									popGong.focus();									
								}
							};
						};
					}
					else if(pop_yn = "Y") {
						
						if(type != "10" && type != "40" && type != "70" && lev_p != "4") {
							vChart.preLoad = function(args){

								var chart = args[0];

								chart.Series[0].MouseLeftButtonUp = function(sender, eventArgs) {
									var pop1 = window.open('/comparequery/queryPiePopSub.do','popSub','width=1030,height=760,location=0 resizable=yes');

									$("#pop_val1").val(sender.AxisXLabel);
									$("#pop_val2").val(sender.XValue);

									pop1.focus();
								};
							};
						}
						else {
							vChart.preLoad = function(args){

								var chart = args[0];

								chart.Series[0].MouseLeftButtonUp = function(sender, eventArgs) {
									var pop1 = window.open('/comparequery/queryTablePop.do','popTab','width=520,height=700,location=0');

									$("#pop_val1").val(sender.AxisXLabel);
									$("#pop_val2").val(sender.XValue);

									pop1.focus();
								};
							};							
						}
					}
					
					vChart.render(chart_id);

/////////////////////////////////////////////////////// 미입력자 조회
					$.ajax({
						type: "POST",
						url: "/comparequery/getInputUserCnt.do",
						data: {"type":type
						    ,"yearFrom":yearFrom
						    ,"yearTo":yearTo
						    ,"lev_p":lev_p
						    ,"lev_org":lev_org
						    ,"input_p":input_value1
						    ,"input_org":input_value2
							},
						dataType : 'json',
						success:function(result){
							if (result.data.length > 0) {
								
								$(result.data).each(function(i) {
									//console.log("div_etc_write :" + "#div_etc_"+chart_id.replace(/[a-zA-Z]/g, '') + "//"+"※ 중복인원 " +formatDateDecimal(this.val1)+"명, 미입력자 "+formatDateDecimal(this.val2) +"명");
									$("#div_etc_"+chart_id.replace(/[a-zA-Z]/g, '')).text("※ 중복인원 " +formatDateDecimal(this.val1)+"명, 미입력자 "+formatDateDecimal(this.val2) +"명");
								});
							}
							else {
//								console.log("조회데이터가 없습니다");
							}
						},
						error : function(x, t, e) {
						}
					});			
					
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});
		},			
		queryByMonth: function (chart_id, type, yearFrom, yearTo, lev_p, lev_org, input_value1, input_value2, pop_yn){
			$.ajax({
				type: "POST",
				url: "/comparequery/queryByMonth.do",
				data: {"type":type
				    ,"yearFrom":yearFrom
				    ,"yearTo":yearTo
				    ,"lev_p":lev_p
				    ,"lev_org":lev_org
				    ,"input_p":input_value1
				    ,"input_org":input_value2
					},
				dataType : 'json',
				success:function(result){
					var html = "";
					var tot_cnt = 0;
					var tot_val = 0;
					if (result.data.length > 0) {
					
						$(result.data).each(function(i) {
							html += "<tr'>";
							html += "	<td>"+this.gubun2+"</td>";
							html += "	<td>"+formatDateDecimal(this.val1)+"</td>";							
							html += "	<td>"+formatDateDecimal(this.val2)+"</td>";
							html += "	<td>"+formatDateDecimal(this.val3)+"</td>";
							html += "	<td>"+formatDateDecimal(this.val4)+"</td>";
							html += "	<td>"+formatDateDecimal(this.val5)+"</td>";
							html += "	<td>"+formatDateDecimal(this.val6)+"</td>";
							html += "	<td>"+formatDateDecimal(this.val7)+"</td>";
							html += "	<td>"+formatDateDecimal(this.val8)+"</td>";
							html += "	<td>"+formatDateDecimal(this.val9)+"</td>";
							html += "	<td>"+formatDateDecimal(this.val10)+"</td>";
							html += "	<td>"+formatDateDecimal(this.val11)+"</td>";
							html += "	<td>"+formatDateDecimal(this.val12)+"</td>";
							html += "</tr>";
							tot_val += this.val2;
							tot_cnt = i + 1;
						});
					}
					else {
						html = "<tr><td colspan='3'>조회결과가 없습니다.</td></tr>";
					}
					
					$("#tab_data > tbody").html(html);
					
					html = "";
					html = "<tr><td>합계("+formatDateDecimal(tot_cnt) +")</td><td>"+formatDateDecimal(tot_val)+"</td><td>-</td></tr>";
					
					$("#tab_data > tfoot").html(html);
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});
		},			
		popByMonth: function(type, value) {
			
			$("#pop_val4").val(v_QueryData[value].input1);
			$("#pop_val5").val(v_QueryData[value].input2);
			
			var popByMon = window.open('/comparequery/queryBarPop.do','popByMon','width=640,height=460,location=0');
			 
			popByMon.focus();
			
		},
		chart_draw: function() {
			for(var i=0 ; i < v_QueryData.length ; i++) {
			//for(var i=0 ; i < 2 ; i++) {
				//console.log("["+i+"]"+v_QueryData[i].input1+"/"+v_QueryData[i].input2+"/"+v_QueryData[i].val2);
				//if(Number($("#com_type").val()) < 40){

					comparequery.queryByType("VisifireChart"+i, $("#com_type").val(),  $("#com_year").val()+$("#com_mon").val(),  $("#com_toyear").val()+$("#com_tomon").val(), "2",v_QueryData[i].val2, "%",v_QueryData[i].input1,"N");
				//}
				//else{
					//comparequery.queryByType("VisifireChart"+i, $("#com_type").val(), $("#com_year").val()+$("#com_mon").val(),  $("#com_toyear").val()+$("#com_tomon").val(), v_QueryData[i].val2 ,"2",v_QueryData[i].input1, "%","N");
				//}
			}	
		},

		board_draw: function() {

			var v_width = 0; 
			var v_height = 0;
			var v_chart_font = Number(screen.width) / 134;
			v_chart_font = 10;
			
			if(Number(screen.width) < 1024) {
				v_width = 529;
				v_height = 426;
			}
			else {
				v_width = ((Number(screen.width) - 200) / 3) - 20;
				v_height = v_width * 0.87;
			}
			
			if($("#com_type option:selected").val() == "70") {
				v_width = v_width * 1.5;
				v_height = v_height *1.5;
			}
			var html = "";
			for(var i=0 ; i < v_QueryData.length ; i++) {
			//for(var i=0 ; i < 2 ; i++) {
//				console.log("["+i+"]"+v_QueryData[i].input1+"/"+v_QueryData[i].input2+"/"+v_QueryData[i].input3+"/"+v_QueryData[i].val1+"/"+v_QueryData[i].val2);
				if(($("#com_type option:selected").val() == "70" && i != 0) || $("#com_type option:selected").val() != "70") { 
					html = html + '<div class="graph-area" style="width:' + v_width +'px; height: '+ (v_height+(v_height*0.05))  +'px;">';
					html = html +'<h4>';
					
					//console.log("["+i+"]"+v_QueryData[i].input3+"/"+v_QueryData[i].val2);

					if(v_QueryData[i].input3 == 'Y' && i == 0 && Number(v_QueryData[i].val2) != 4 ) {
						html = html + '<a href="#" onClick=\"comparequery.dtlQueryUp(\''+v_QueryData[i].input1+'\',\''+v_QueryData[i].input2+'\',\''+v_QueryData[i].val2+'\');\">'+v_QueryData[i].input2+"("+ formatDateDecimal(v_QueryData[i].val1)+")"+'</a>';
					}
					else if(i == 0 && Number(v_QueryData[i].val2) != 1) {
						html = html + '<a href="#" onClick=\"comparequery.dtlQueryUp(\''+v_QueryData[i].input1+'\',\''+v_QueryData[i].input2+'\',\''+v_QueryData[i].val2+'\');\">'+v_QueryData[i].input2+"("+ formatDateDecimal(v_QueryData[i].val1)+")"+'</a>';
					}					
					else if(v_QueryData[i].input3 == 'Y'  && Number(v_QueryData[i].val2) !=  4) {
						html = html + '<a href="#" onClick=\"comparequery.dtlQuery(\''+v_QueryData[i].input1+'\',\''+v_QueryData[i].input2+'\',\''+v_QueryData[i].val2+'\');\">'+v_QueryData[i].input2+"("+ formatDateDecimal(v_QueryData[i].val1)+")"+'</a>';
					}
					else {
						html = html + v_QueryData[i].input2+"("+ formatDateDecimal(v_QueryData[i].val1)+")";
					}

					$("#pop_val3").val(v_QueryData[i].val2);
					//html = html + '<div class="txt-link">[ <a href="#" onclick="comparequery.popByMonth('+Number($("#com_type").val())+','+i+');">기간추이 현황</a> ]</div>';
					html = html + '<div class="txt-link">[ 기간추이현황 ]</div>';
					html = html + '</h4>';
					html = html + '<div class="graph-box"  style="height: '+v_height+'px;padding-top: 20px;" align="center">';
					html = html + '    <div id="VisifireChart'+i+'"></div>';
					html = html +	'     <div id="div_etc_'+i+'"style="color: blue;padding-left: 15px;font-size: '+(v_chart_font+2)+'px;" align="left"></div>';
					html = html + '</div>';

					html = html + '</div>';						  
				}
			}
			$("#div_chartArea").html(html);
			comparequery.chart_draw();
		},
		dtlQuery: function(input1, input2, lev) {
			
			$("#pop_val4").val(input1);
			$("#pop_val5").val(input2);

			$("#in_input"+(Number(lev))).val(input1);
			$("#in_name"+(Number(lev))).val(input2);
			$("#in_lev"+(Number(lev))).val(lev);
			comparequery.getQueryData(input1,input2,Number(lev));
		},
		dtlQueryUp: function(input1, input2, lev) {
			
			$("#pop_val4").val(input1);
			$("#pop_val5").val(input2);

			comparequery.getQueryData($("#in_input"+(Number(lev)-1)).val(),$("#in_name"+(Number(lev)-1)).val(),$("#in_lev"+(Number(lev)-1)).val());
		},
		getQueryData: function(input_value, input_name, lev) {
			type = $("#com_type").val();
			year = $("#com_year").val();
			
			if(Number(type) < 40) {
				input_value1 = null;
				input_value2 = input_value;
			}
			else {
				input_value1 = input_value ;
				input_value2 = null;				
			}
			$.ajax({
				type: "POST",
				url: "/comparequery/queryData.do",
				data: {"type":type
				    ,"year":year
				    ,"lev_p":lev
				    ,"lev_org":lev
				    ,"input_p":input_value1
				    ,"input_org":input_value2
					},
				dataType : 'json',
				success:function(result){
					if (result.data.length > 0) {
						v_QueryData = new Array();
						v_tot = 0;
						var t_QueryDataObj = new Object();
						
						t_QueryDataObj.input1 = input_value;
						t_QueryDataObj.input2 = input_name;
						t_QueryDataObj.input3 = 'N';
						$(result.data).each(function(i) {
							v_tot += this.val1;
							t_QueryDataObj.val2 = Number(this.val2) - 1;
						});
						
						if((Number(t_QueryDataObj.val2)-1) != 0) {
							t_QueryDataObj.input3 = 'Y';
						}
						t_QueryDataObj.val1  = v_tot;
						v_QueryData.push(t_QueryDataObj);

						$(result.data).each(function(i) {
							t_QueryDataObj = new Object();
							t_QueryDataObj.input1 = this.gubun1;
							t_QueryDataObj.input2 = this.gubun2;
							t_QueryDataObj.input3 = this.gubun3;
							t_QueryDataObj.val1 = this.val1;
							t_QueryDataObj.val2 = this.val2;
							
							v_QueryData.push(t_QueryDataObj);
						});
					}
					else {
						/* 조회결과 없음 */
					}
					comparequery.board_draw();
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});
		},
		queryByDataList: function(chart_id, type, yearFrom, yearTo, lev_p, lev_org, input_value1, input_value2, pop_yn) {

			$.ajax({
				type: "POST",
				url: "/comparequery/getTableData.do",
				data: {"type":type
				    ,"yearFrom":yearFrom
				    ,"yearTo":yearTo
				    ,"lev_p":lev_p
				    ,"lev_org":lev_org
				    ,"input_p":input_value1
				    ,"input_org":input_value2
					},
				dataType : 'json',
				success:function(result){
					var html = "";
					var tot_cnt = 0;
					var tot_val = 0;
					if (result.data.length > 0) {
					
						$(result.data).each(function(i) {
							html += "<tr'>";
							html += "	<td style='text-align: left;'>"+this.gubun2+"</td>";
							html += "	<td><a href='#' onclick='popDtlData(\""+this.gubun1+'\",\"'+this.gubun2+"\")'>"+formatDateDecimal(this.val1)+"</a></td>";								
							html += "</tr>";
							tot_val += this.val1;
							tot_cnt = i + 1;
						});
					}
					else {
						html = "<tr><td colspan='3'>조회결과가 없습니다.</td></tr>";
					}
					
					$("#tab_data > tbody").html(html);
					
					html = "";
					html = "<tr><td>합계("+formatDateDecimal(tot_cnt) +")</td><td>"+formatDateDecimal(tot_val)+"</td></tr>";
					
					$("#tab_data > tfoot").html(html);
				},
				error : function(x, t, e) {
					handleErrorMessage(x, t, e);
				}
			});
		},
		queryByDtlDataList: function(chart_id, type, yearFrom, yearTo, lev_p, lev_org, input_value1, input_value2, pop_yn, pmscode) {

			$.ajax({
				type: "POST",
				url: "/comparequery/getDtlTableData.do",
				data: {"type":type
				    ,"yearFrom":yearFrom
				    ,"yearTo":yearTo
				    ,"lev_p":lev_p
				    ,"lev_org":lev_org
				    ,"input_p":input_value1
				    ,"input_org":input_value2
				    ,"pmscode":pmscode
					},
				dataType : 'json',
				success:function(result){
					var html = "";
					var tot_cnt = 0;
					var tot_val = 0;
					if (result.data.length > 0) {
					
						$(result.data).each(function(i) {
							html += "<tr'>";
							html += "	<td>"+this.gubun4+"</td>";
							html += "	<td>"+formatDateDecimal(this.val2)+"</td>";							
							html += "	<td>"+formatDateDecimal(this.val1)+"</td>";
							html += "</tr>";
							tot_val += this.val2;
							tot_cnt = i + 1;
						});
					}
					else {
						html = "<tr><td colspan='3'>조회결과가 없습니다.</td></tr>";
					}
					
					$("#tab_data > tbody").html(html);
					
					html = "";
					html = "<tr><td>합계("+formatDateDecimal(tot_cnt) +")</td><td>"+formatDateDecimal(tot_val)+"</td><td>-</td></tr>";
					
					$("#tab_data > tfoot").html(html);
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