

var basicquery = {

		checked: false,
		com_status: function(){
			var html = "";

			html += "<option value='%'>전체</option>";
			html += "<option value='R'>진행중</option>";
			html += "<option value='F'>완료</option>";
			
			$("#com_status").html(html);			
			
		},
		com_gubun: function(){
			var html = "";
			if(user_admin == "true") {
				html += "<option value='1'>전체</option>";
				html += "<option value='2'>양산-차종별</option>";
				html += "<option value='3'>양산-제품별</option>";
//				html += "<option value='4'>양산-프로젝트별</option>";
//				html += "<option value='5'>선행-과제별</option>";
				html += "<option value='6'>공통-기술별</option>";
				html += "<option value='7'>조직별</option>";
			}
			else if(user_zzijkch == "B03") {	// 팀장
				html += "<option value='1'>전체</option>";
				html += "<option value='2'>양산-차종별</option>";
				html += "<option value='3'>양산-제품별</option>";
//				html += "<option value='4'>양산-프로젝트별</option>";
//				html += "<option value='5'>선행-과제별</option>";
				html += "<option value='6'>공통-기술별</option>";
			}
			else if(user_zzijkch == "A08") {	// 실장
				html += "<option value='2'>양산-차종별</option>";
//				html += "<option value='5'>선행-과제별</option>";
				html += "<option value='7'>조직별</option>";
			}
			else if(user_zzijkch == "B05" || user_zzijkch == "A07") {	// 센터장 (B05 파트장/ A07담당중역)
				html += "<option value='2'>양산-차종별</option>";
//				html += "<option value='4'>양산-프로젝트별</option>";
//				html += "<option value='5'>선행-과제별</option>";
				html += "<option value='7'>조직별</option>";
			}
			else if(user_zzijkch == "A05") {	// 본부장
//				html += "<option value='4'>양산-프로젝트별</option>";
//				html += "<option value='5'>선행-과제별</option>";
				html += "<option value='6'>공통-기술별</option>";
				html += "<option value='7'>조직별</option>";
			}
			else {
				html += "<option value='0'>조회권한없음</option>";
			}
			$("#com_gubun").html(html);
		},
		com_printVal: function() {
			var html = "";
			html += "<option value='1'>시간</option>";
			html += "<option value='2'>인원</option>";
			$("#com_printVal").html(html);
		},
		auth_team: function(orgId) {
			bl_Basic_Set = true;
			if(bl_Basic_Set) {
				
				if(user_admin == "true")
					bl_Basic_Set = false;
				
				$.ajax({
					type: "POST",
					url: "/basicquery/authTeamList.do",
					data: {"orgId":orgId},
					dataType : 'json',
					success:function(result) {
	
						if(result != null) {
							$(result.data).each(function(i) {
								v_Auth_Team_List[i] = this.orgId;
							});
						}
						basicquery.com_team(1);						
					},
					error:function(result) {
						alert("데이터 통신간 문제가 발생하였습니다.");
					}
				});			
			}
		},
		auth_team_set: function() {
			if($("#com_org_lv1").val() == "%" && v_Auth_Team_List.length > 2) {
				$("#com_org_lv1").val(v_Auth_Team_List[2]);
				basicquery.com_team(2);
				if(v_Auth_Team_List.length == 3) {
					bl_Basic_Set = false;
				} 
				$("[id=com_org_lv1]").attr("disabled", true);
			}
			else if($("#com_org_lv2").val() == "%" && v_Auth_Team_List.length > 3) {
				$("#com_org_lv2").val(v_Auth_Team_List[3]);
				basicquery.com_team(3);
				if(v_Auth_Team_List.length == 4) {
					bl_Basic_Set = false;
				}				
				$("[id=com_org_lv2]").attr("disabled", true);
			}
			else if($("#com_org_lv3").val() == "%" && v_Auth_Team_List.length > 4) {
				$("#com_org_lv3").val(v_Auth_Team_List[4]);
				if(v_Auth_Team_List.length == 5) {
					bl_Basic_Set = false;
				}
				$("[id=com_org_lv3]").attr("disabled", true);
			}
			else {
				bl_Basic_Set = false;
			}
		},
		com_team: function(comboNum) {
			
			var highOrgId = "";
			var listObj;
			
			if(Number(comboNum) == 1) {
				highOrgId = "10110003";
			}
			else {
				highOrgId = $("#com_org_lv"+(comboNum-1)).val();
			}
			
			for (var i=comboNum; i<4; i++){
				elementName = "com_org_lv" + i;
				
				listObj = document.getElementById(elementName);
				listObj.options.length = 0;
				listObj.add(new Option("전체", "%"));
				
			}
			
			elementName = "com_org_lv" + comboNum;
				
			/* 조회조건이 전체가 아닐경우에만 조회 */
			if(highOrgId != "%") {
				$.ajax({
					type: "POST",
					url: "/basicquery/teamCombo.do",
					data: {"highOrgId":highOrgId},
					dataType : 'json',
					success:function(result){

						listObj = document.getElementById(elementName);

						listObj.options.length = 0;

						if(result != null) {
							if(result.data.length == 0) {
								listObj.add(new Option("전체", "%"));
								return;
							}

							listObj.add(new Option("전체", "%"));
							$(result.data).each(function(i) {
								listObj.add(new Option(this.orgDesc, this.orgId));
							});
							if(bl_Basic_Set) {
								basicquery.auth_team_set();
							}
						}
						else {
							listObj.add(new Option("조회 데이터 없음", ""));
						}

					},
					error:function() {
						alert("데이터 통신간 문제가 발생하였습니다.");

						var listObj;

						listObj = document.getElementById(elementName);
						listObj.options.length = 0;				
						listObj.add(new Option("조회 데이터 없음", ""));
					}
				});
			}				
		},			
		basicquery: function() {
			gubun1 = new Array();
			var1 = new Array();
			var2 = new Array();
			var3 = new Array();
			var4 = new Array();
			
			if(user_admin != "true" && user_zzijkch != "B03" && user_zzijkch != "A08" && user_zzijkch != "B05" && user_zzijkch != "A07" && user_zzijkch != "A05" ) {
				alert("조회권한이 없습니다");
				return ;
			}
			$.ajax({
				type: "POST",
				url: "/basicquery/basicquery.do",
				data: {"startDate":$("#inp_startDate").val().replace(/-/g, '')
			    ,"endDate":$("#inp_endDate").val().replace(/-/g, '')
			    ,"orgIdLv1":$("#com_org_lv1").val()
			    ,"orgIdLv2":$("#com_org_lv2").val()
			    ,"orgIdLv3":$("#com_org_lv3").val()
			    ,"status":$("#com_status").val()
			    ,"gubun":$("#com_gubun").val()
					},
				dataType : 'json',
				success:function(result){
					var html = "";
					var tot_val1 = 0;
					var tot_val2 = 0;
					if (result.data.length > 0) {
						gubun1 = new Array();						
						val1 = new Array();
						val2 = new Array();
						$(result.data).each(function(i) {
							html += "<tr>";
							html += "	<td>"+this.gubun1+"</td>";
							html += " <td style='text-align: right;padding-right:5px;'>"+formatDateDecimal(this.val1)+"</td>";
							html += "	<td style='text-align: right;padding-right:5px;'>"+formatDateDecimal(this.val2)+"</td>";
							html += "</tr>";
							
							gubun1[i] = this.gubun1;
							val1[i] = this.val1;
							val2[i] = this.val2;
							val3[i] = this.val3;
							val4[i] = this.val4;
							tot_val1 += val1[i];
							tot_val2 += val2[i];
						});
					}
					else {
						html = "<tr><td colspan='4' align='center'>조회결과가 없습니다.</td></tr>";
					}

					$("#tab_data_body > tbody").html(html);
					
					html = "";
					html +="<tr>";
					html +=" <td style='text-align: center; background-color:#eef3fd'>"+"합계"+"</td>";
					html +=" <td style='text-align: right; background-color:#eef3fd;'>"+formatDateDecimal(tot_val1)+"</td>";
					html +=" <td style='text-align: center; background-color:#eef3fd;'>"+"-"+"</td>";
					html +=" <td style='background:#ffffff; border:none'></td>";
					html +="</tr>";
					$("#tab_data_foot > tfoot").html(html);
					
					basicquery.chart_draw();
				},
				error : function(x, t, e) {
					var html = "";
					html = "<tr><td colspan='3' align='center'>조회결과가 없습니다.</td></tr>";
					$("#tab_data > tbody").html(html);
					handleErrorMessage(x, t, e);
				}
			});
		},			

		chart_draw: function() {
			clickProductAnalysisTitle();
		},

		validate: function() {
			return true;
		}
};


function clickProductAnalysisTitle(){
	renderBasciChartChart();
}

function renderBasciChartChart(){
	var w = $("#div_chart_basic").width();
	var h =  $("#div_chart_basic").height();
	var gridW = w ; //- (w/100*5);
	var gridH = h ; //- 25;
	
	var visifireXml = getBasicChartXml(gridW, gridH);
	
	chart_Basic.setDataXml(visifireXml);
	chart_Basic.preLoad = function(args) {
        var chart = args[0];
        chart.Series[0].MouseLeftButtonUp= function(e) {
        	/* 임시 */
         } ;
	};
	chart_Basic.render("div_chart_basic");
}

function getBasicChartXml(chart_width, chart_height){
	//var year = getCurrentYear();
	var t_XLabel = 0;
	var t_YValue = 0;
	var t_Title = "";
	var visiFireXml ='<vc:Chart xmlns:vc="clr-namespace:Visifire.Charts;assembly=SLVisifire.Charts" Width=\"'+chart_width+'\" Height=\"'+chart_height+'\" BorderThickness="0.5" Padding="15" View3D="False" BorderBrush="Gray" ScrollingEnabled="true"  Watermark=\"False\">';
	
	if ($("#com_org_lv3 option:selected").text() != "전체") {
		t_Title = $("#com_org_lv3 option:selected").text();
	}
	else if ($("#com_org_lv2 option:selected").text() != "전체") {
		t_Title = $("#com_org_lv2 option:selected").text();
	}
	else if ($("#com_org_lv1 option:selected").text() != "전체") {
		t_Title = $("#com_org_lv1 option:selected").text();
	}
	else {
		t_Title = "연구개발본부";
	}
	
	t_Title += "\\n" + $("#com_gubun option:selected").text();
		
		
	
	visiFireXml += '<vc:Chart.Titles>';
	visiFireXml += '     <vc:Title Text="'+t_Title+'" FontSize="14" FontWeight="Bold" HorizontalAlignment="Left"/>';
	visiFireXml += '</vc:Chart.Titles>';
	
	//var visiFireXml = "<vc:Chart Theme=\"Theme1\" BorderThickness=\"0\" Watermark=\"False\" >";
	visiFireXml += "<vc:Chart.Legends><vc:Legend FontSize=\"12\" FontWeight=\"Bold\" /></vc:Chart.Legends>";
	
	visiFireXml += '     <vc:Chart.Series>'
        + '         <vc:DataSeries RenderAs="Pie" LegendText="" AxisYType="Primary" Bevel="True">'
        + '             <vc:DataSeries.DataPoints>';
        
    for ( var i=0 ; i < gubun1.length ; i++) {
    	if(i <= 10) {
    		//visiFireXml = visiFireXml + '                 <vc:DataPoint LabelText=\"#AxisXLabel(#YValue), #Percentage%\" AxisXLabel=\"'+gubun1[i]+'\" YValue=\"'+eval("val"+$("#com_printVal").val()+"[i]")+'\"';
//    		visiFireXml += " Cursor=\""+"Hand"+"\"";
//    		visiFireXml += '/>';    		
    		visiFireXml = visiFireXml + '                 <vc:DataPoint LabelFontSize=\"12\" LabelText="#AxisXLabel(#YValue명), '+val2[i]+'%\n '+ formatDateDecimal(val3[i])+' 건" AxisXLabel="'+this.gubun1[i]+'" XValue ="'+val1[i]+'" YValue="'+formatDateDecimal(val1[i])+'" Cursor="Hand"/>';

    	}
    	else {
    		t_YValue += val1[i];
    		t_XLabel++;
    	}
    }    
	if ( t_XLabel > 0 )
		visiFireXml = visiFireXml + '                 <vc:DataPoint LabelText=\"#AxisXLabel(#YValue), #Percentage%\" AxisXLabel=\"'+"그 외 "+formatDateDecimal(t_XLabel)+"개"+'\"  YValue=\"'+t_YValue+'\"/>';
    
	visiFireXml = visiFireXml + '             </vc:DataSeries.DataPoints>'
        + '         </vc:DataSeries>'
        + '     </vc:Chart.Series>'
        + ' </vc:Chart>';

	return visiFireXml;
}


