function redrawTotalChartAll() {
	redrawMainTable2();
	redrawTotalChart1();
	redrawTotalChart2();
	redrawTotalChart3();
	
}

function redrawTotalChart1() {
	
	TOTAL_PARAMS['cubeCode'] = 'PJ_ORG';
	switch(vCompanyReserved4){
		case 'DABP01KR' :
			TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL1_DABP';
			break;
		default:
			TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL1';
	}
	
	TOTAL_PARAMS['projectTotal-SearchType'] = '인원수';
	TOTAL_PARAMS['projectTotal-Month-arr'] = null;
	TOTAL_PARAMS['projectTotal-SearchOrg'] = null;
	TOTAL_PARAMS['projectTotal-Month'] = Ext.getCmp('projectTotal-Month').getValue();
	
	
	Ext.getCmp('project-total').setLoading(true);
	

	 	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
			params:TOTAL_PARAMS,
			success : function(response, request) {
				Ext.getCmp('project-total').setLoading(false);

				var val = Ext.JSON.decode(response.responseText);
				var cat = val['aXis'];
				var aXis = [];
				for(var i=0; i<cat.length; i++) {
					var res = cat[i].split(":");
					var name = res[1];
					aXis.push("'"+name.substring(2,4) + '/' + name.substring(6,8)) ;
					
				}
				//
				var series = val['series'];
				arrangeColor(series);	
					
       var sProjectTotalEastNorth = gColumnChartStyle;
        sProjectTotalEastNorth['renderTo'] ='projecttotal-east-north-graph';
         ocProjectTotalEastNorth = new Highcharts.Chart({

			    chart: sProjectTotalEastNorth,
			    
				title: {
	    	            text: '<div class="title02">프로젝트<span> 인원추이</span>(명)</div>',
	    	            margin: 5,
	    	            align: 'left',
	    	            useHTML: true
	    	        },
	       	        exporting: {
					         enabled: false
					},
	    	        subtitle: {
	    	        },
	    	        xAxis: {
	    	        		 labels: {
	    	        			 rotation: 0,
					            style: {
					                fontSize: '0.9em'
					            }
					        },
	    	            categories: aXis
	    	        },
	    	        yAxis: {
	    	            min: 0,
	    	            visible: false,
	    	            title: {
	    	                //text: '투입인원'
	    	            },
	    	            stackLabels: {
	    	                enabled: true,
	    	                style: {
	    	                    //fontWeight: 'bold',
	    	                    //color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
	    	                }
	    	            }
	    	        },
	    	        legend: {
	    	            align: 'right',
	    	            x: 0,
	    	            verticalAlign: 'top',
	    	            y: 0,
	    	            floating: true,
	    	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
	    	            borderColor: '#CCC',
	    	            borderWidth: 0,
	    	            shadow: false,
	    	            enabled:true
	    	        },
	    	        tooltip: {
	    	            headerFormat: '<b>{point.x}</b><br/>',
	    	            pointFormat: '{series.name}: {point.y:,.1f}<br />합계: {point.stackTotal:,.1f}'
	    	        },
	    	        plotOptions: {
	    	        	series: {animation: { duration: 200  },
					        pointPadding: 0, // Defaults to 0.1
					        groupPadding: 0.05 // Defaults to 0.2
					    },
	    	            column: {
	    	            	
	    	                stacking: 'normal',
	    	                dataLabels: {
	    	                	format: '{y:,.0f}',
	    	                    enabled: true,
	    	                    color:  'white',
	    	                    style: {
	    	                        textShadow: '0 0 3px black'
	    	                    }
	    	                }
	    	            }
	    	        },
	    	       series: series
	    	    });

	        	ocProjectTotalEastNorth.setSize(  eastCenterWidth,   eastCenterHeight,  false    );   
				ocProjectTotalEastNorth.reflow();
					
			},// endof success for ajax
			failure:function(result, request) {
				Ext.getCmp('project-total').setLoading(false);
			}
		}); // endof Ajax
	
}

function redrawTotalChart2() {

	TOTAL_PARAMS['cubeCode'] = 'PJ_PRODUCT';
	TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL2';
	TOTAL_PARAMS['projectTotal-SearchType'] = '인원수';
	TOTAL_PARAMS['projectTotal-Month-arr'] = null;
	TOTAL_PARAMS['projectTotal-SearchOrg'] = null;
	TOTAL_PARAMS['projectTotal-Month'] = Ext.getCmp('projectTotal-Month').getValue();
	
	//Ext.getCmp('project-total').setLoading(true);
	
 	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
			params:TOTAL_PARAMS,
			success : function(response, request) {
				
//				console_logs('response.responseText', response.responseText);
				Ext.getCmp('project-total').setLoading(false);
				
				var val = Ext.JSON.decode(response.responseText);
				//console_logs("val['series']", val['series']);
				//console_logs("val['aXis']", val['aXis']);
				var cat = val['aXis'];
				
//				console_logs('cat', cat);
//				console_logs('inSeries', inSeries);
				
				var arr = [];
				var aXis = [];
				
				var series = val['series'];
				arrangeColor(series);
				
				moveNullPos(cat, series, aXis,arr);


	   
       var sProjectTotalEastCenter = gColumnChartStyle;
        sProjectTotalEastCenter['renderTo'] ='projecttotal-east-center-graph';
        ocProjectTotalEastCenter = new Highcharts.Chart({

			    chart: sProjectTotalEastCenter,
			    
				title: {
	    	            text: '<div class="title02">제품별<span> 투입인원</span>(명)</div>',
	    	            margin: 5,
	    	            align: 'left',
	    	            useHTML: true
	    	        },
	       	        exporting: {
					         enabled: false
					},
	    	        subtitle: {
	    	            //text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
	    	        },
	    	        xAxis: {
	    	        		 labels: {
	    	        			 rotation: 0,
					            style: {
					                fontSize: '0.9em'
					            }
					        },
	    	            categories: aXis
	    	        },
	    	        yAxis: {
	    	            min: 0,
	    	            visible: false,
	    	            title: {
	    	                //text: '투입인원'
	    	            },
	    	            stackLabels: {
	    	                enabled: true,
	    	                style: {
	    	                    //fontWeight: 'bold',
	    	                    //color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
	    	                }
	    	            }
	    	        },
	    	        legend: {
	    	            align: 'right',
	    	            x: 0,
	    	            verticalAlign: 'top',
	    	            y: 0,
	    	            floating: true,
	    	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
	    	            borderColor: '#CCC',
	    	            borderWidth: 0,
	    	            shadow: false,
	    	            enabled:true
	    	        },
	    	        tooltip: {
	    	            headerFormat: '<b>{point.x}</b><br/>',
	    	            pointFormat: '{series.name}: {point.y:,.1f}<br />합계: {point.stackTotal:,.1f}'
	    	        },
	    	        plotOptions: {
	    	        	series: {animation: { duration: 200  },
					        pointPadding: 0, // Defaults to 0.1
					        groupPadding: 0.05 // Defaults to 0.2
					    },
	    	            column: {
	    	            	
	    	                stacking: 'normal',
	    	                dataLabels: {
	    	                	format: '{y:,.0f}',
	    	                    enabled: true,
	    	                    color:  'white',
	    	                    style: {
	    	                        textShadow: '0 0 3px black'
	    	                    }
	    	                }
	    	            }
	    	        },
	    	       series: series
	    	    });

	        	ocProjectTotalEastCenter.setSize(  eastCenterWidth,   eastCenterHeight,  false    );   
				ocProjectTotalEastCenter.reflow();
	
			},// endof success for ajax
			failure:function(result, request) {
				Ext.MessageBox.show({
		            title: '연결 종료',
		            msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
		            buttons: Ext.MessageBox.OK,
		            //animateTarget: btn,
		            scope: this,
		            icon: Ext.MessageBox['ERROR'],
		            fn: function() {
		            	Ext.getCmp('project-total').setLoading(false);
		            	//$(window.document.location).attr("href", "/xdview/index.do?method=main");
		            }
		        });
			}
		}); // endof Ajax			
			
}

var oSumMainTab1_pre = 0;
var oSumMainTab1_mass = 0;
var oSumMainTab1_common = 0;
var oSumMainTab1_etc = 0;
var oSumMainTab1_total = 0;

function redrawMainTable1(col, arrS, posTable1) {

console_logs('col', col);
console_logs('arrS', arrS);
console_logs('posTable1', posTable1);
	
	if(col=='research') { //첫 column
		oSumMainTab1_pre = 0;
		oSumMainTab1_mass = 0;
		oSumMainTab1_common = 0;
		oSumMainTab1_etc = 0;
		oSumMainTab1_total = 0;
	}
	
	//초기화
	document.getElementById('td1-' + col + '-' + 'pre').innerHTML = '-';
	document.getElementById('td1-' + col + '-' + 'mass').innerHTML = '-';
	document.getElementById('td1-' + col + '-' + 'common').innerHTML = '-';
	document.getElementById('td1-' + col + '-' + 'etc').innerHTML = '-';
	document.getElementById('td1-' + col + '-' + 'total').innerHTML = '-';
	
	var sum = 0;
	for(var i=0; i<arrS.length; i++) {
		var o = arrS[i];
		var name = o['name'];
		var data = o['data'];

//console_logs(col + ' name' + i, name);
//console_logs(col + ' data' + i, data);
		var v1 =0;
		
		if(data!=null && data.length>0 && posTable1>-1) {
//console_logs('-------------------');
			v1 = data[posTable1];
		}
//console_logs(col + ' v1', v1);
		
		var pos ='etc';
		switch(name) {
		case '선행':
			pos = 'pre';
			if(v1!=undefined) {
				oSumMainTab1_pre = oSumMainTab1_pre + v1;
			}
			break;
		case '양산':
			pos = 'mass';
			if(v1!=undefined) {
				oSumMainTab1_mass = oSumMainTab1_mass + v1;
			}
			break;
		case '공통':
			if(v1!=undefined) {
				oSumMainTab1_common = oSumMainTab1_common + v1;
			}
			pos = 'common';
			break;
		default:
			if(v1!=undefined) {
				oSumMainTab1_etc = oSumMainTab1_etc + v1;
			}
			pos ='etc';
		}
		setNumberById('td1-' + col + '-' + pos, v1);
		if(v1!=undefined) {
			sum = sum + v1;
		}
	}
	setNumberById('td1-' + col + '-' + 'total', sum);
	oSumMainTab1_total = oSumMainTab1_total + sum;
	
	if(col=='etc') {
		setNumberById('td1-' + 'total' + '-' + 'pre', 	oSumMainTab1_pre);
		setNumberById('td1-' + 'total' + '-' + 'mass', 	oSumMainTab1_mass);
		setNumberById('td1-' + 'total' + '-' + 'common',oSumMainTab1_common);
		setNumberById('td1-' + 'total' + '-' + 'etc', 	oSumMainTab1_etc);
		setNumberById('td1-' + 'total' + '-' + 'total', oSumMainTab1_total);
	}
	
	
}


function redrawMainTable2() {
	
	TOTAL_PARAMS['projectTotal-SearchType'] = null;
	TOTAL_PARAMS['projectTotal-Month-arr'] = null;
	TOTAL_PARAMS['projectTotal-SearchOrg'] = null;
	
	
	TOTAL_PARAMS['cubeCode'] = 'PJ_COST';
	TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL_MAIN2';
	TOTAL_PARAMS['projectTotal-Month'] = Ext.getCmp('projectTotal-Month').getValue();
	
	 	Ext.Ajax.request({
				url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
				params:TOTAL_PARAMS,
				success : function(response, request) {
					
					var val = Ext.JSON.decode(response.responseText);
					var records = val['records'];
						
					for(var i=0; i<records.length; i++) {
							
							var rec = records[i];
							
							setStringById('td2-' + 'car' + '-' + (i+1), rec[0]);
							setStringById('td2-' + 'step' + '-' + (i+1), rec[1]);
							setNumberById('td2-' + 'human' + '-' + (i+1), rec[2]);
							stampNumberById('td2-' + 'cost' + '-' + (i+1), rec[4]/100000000, '0,000.0');
									
					}//endof for
					
				},// endof success for ajax
				failure:function(result, request) {
					Ext.MessageBox.show({
			            title: '연결 종료',
			            msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
			            buttons: Ext.MessageBox.OK,
			            //animateTarget: btn,
			            scope: this,
			            icon: Ext.MessageBox['ERROR'],
			            fn: function() {
			            	//$(window.document.location).attr("href", "/xdview/index.do?method=main");
			            }
			        });
				}
			}); //

	
}

function redrawTotalChart31() {
	//console_logs('start', 'redrawTotalChart31');
	
		TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL31';
		TOTAL_PARAMS['projectTotal-SearchOrg'] = '연구';
		
	 	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
			params:TOTAL_PARAMS,
			success : function(response, request) {
				Ext.getCmp('project-total').setLoading(false);
				var val = Ext.JSON.decode(response.responseText);
				var cat = val['aXis'];
				var arr = [];
				var aXis = [];
				
				var posTable1 = -1;
				
				for(var i=0; i<cat.length; i++) {
					var res = cat[i].split(":");
					var code = res[0];
					var name = res[1];
					var o = { code : code,
							  name : name
							};
					arr.push(o);
					aXis.push(name);
					
					if(name=='당월') {
					 	posTable1 = i;
					}
				}
			var arrS = val['series'];
			//console_logs('arrS research', arrS);
			if(arrS!=null && arrS!=undefined) {
				
				redrawMainTable1('research', arrS, posTable1);
			
			}		
			
				var series = val['series'];
				arrangeColor(series);
			
				redrawTotalChart32();

        var sProjectTotalEastSouth1 = gColumnChartStyleSmall;
        sProjectTotalEastSouth1['renderTo'] ='projecttotal-south-east-center1-graph';
        ocProjectTotalEastSouth1 = new Highcharts.Chart({
        	chart: sProjectTotalEastSouth1,
        	spacingTop:50,
        	title: {
	    	            text: '',
	    	            margin: 0,
	    	            align: 'left',
	    	            useHTML: true
	    	        },
	    	        exporting: {
					         enabled: false
					},
	    	        subtitle: {
	    	            //text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
	    	        },
	    	        xAxis: {
	    	        		 labels: {
	    	        			 rotation: 0,
					            style: {
					                fontSize: '0.9em'
					            }
					        },
	    	            categories: aXis
	    	        },
	    	        yAxis: {
	    	        	visible: false,
	    	            min: 0,
	    	            title: {
	    	                text: '투입인원'
	    	            },
	    	            stackLabels: {
	    	                enabled: true,
	    	                style: {
	    	                    fontWeight: 'bold',
	    	                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
	    	                }
	    	            }
	    	        },
	    	        legend: {
	    	        	itemStyle: {
				            fontSize: '0.9em'
				        },
	    	            align: 'center',
	    	            x: 0,
	    	            verticalAlign: 'top',
	    	            padding:0,
	    	            margin:0,
	    	            y: 5,
	    	            floating: true,
	    	            backgroundColor: null,
	    	            borderColor: '#CCC',
	    	            borderWidth: 0,
	    	            shadow: false,
	    	            enabled:false,
	    	            itemDistance: 8
	    	        },
	    	        tooltip: {
	    	            headerFormat: '<b>{point.x}</b><br/>',
	    	            pointFormat: '{series.name}: {point.y:,.1f}<br />합계: {point.stackTotal:,.1f}'
	    	        },
	    	        plotOptions: {
	    	        	series: {animation: { duration: 200  },
					        pointPadding: 0, // Defaults to 0.1
					        groupPadding: 0.05 // Defaults to 0.2
					    },
	    	            column: {
	    	            	
	    	                stacking: 'normal',
	    	                dataLabels: {
	    	                	format: '{y:,.0f}',
	    	                    enabled: true,
	    	                    color:  'white',
	    	                    style: {
	    	                        textShadow: '0 0 3px black'
	    	                    }
	    	                }
	    	            }
	    	        },
	    	        series: series
	    	    });

	        ocProjectTotalEastSouth1.setSize(  eastSouth1Width,   eastSouth1Height,  false    );   
			ocProjectTotalEastSouth1.reflow();
			
			},// endof success for ajax
			failure:function(result, request) {
				Ext.getCmp('project-total').setLoading(false);
			}
		}); // endof Ajax
		
}
function redrawTotalChart32() {
	
	//console_logs('start', 'redrawTotalChart32');
	
	TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL32';
	TOTAL_PARAMS['projectTotal-SearchOrg'] = '품질';
		
		
	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
			params:TOTAL_PARAMS,
			success : function(response, request) {
				Ext.getCmp('project-total').setLoading(false);

				var val = Ext.JSON.decode(response.responseText);
				var cat = val['aXis'];
				var arr = [];
				var aXis = [];
				var posTable1 = -1;
				
				for(var i=0; i<cat.length; i++) {
					var res = cat[i].split(":");
					var code = res[0];
					var name = res[1];
					var o = { code : code,
							  name : name
							};
					arr.push(o);
					aXis.push(name);
					
					//console_logs('arrS quality name', name);
					//console_logs('arrS quality code', code);
					
					if(name=='당월') {
					 	posTable1 = i;
					}
				}
				var arrS = val['series'];
				//console_logs('arrS quality', arrS);
				//console_logs('posTable1 quality', posTable1);
				if(arrS!=null && arrS!=undefined) {
					
					redrawMainTable1('quality', arrS, posTable1);
				
				}		
	redrawTotalChart33();

					var series = val['series'];
				arrangeColor(series);
				
        var sProjectTotalEastSouth2 = gColumnChartStyleSmall;
        sProjectTotalEastSouth2['renderTo'] ='projecttotal-south-east-center2-graph';
        ocProjectTotalEastSouth2 = new Highcharts.Chart({
        	chart: sProjectTotalEastSouth2,
        	spacingTop:50,
        	title: {
	    	            text: '',//'<div class="title02"><span>연구개발본부</span> 투입인원</div>',
	    	            margin: 0,
	    	            align: 'left',
	    	            useHTML: true
	    	        },
	    	        exporting: {
					         enabled: false
					},
	    	        subtitle: {
	    	            //text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
	    	        },
	    	        xAxis: {
	    	        		 labels: {
	    	        			 rotation: 0,
					            style: {
					                fontSize: '0.9em'
					            }
					        },
	    	            categories: aXis
	    	        },
	    	        yAxis: {
	    	        	visible: false,
	    	            min: 0,
	    	            title: {
	    	                text: '투입인원'
	    	            },
	    	            stackLabels: {
	    	                enabled: true,
	    	                style: {
	    	                    fontWeight: 'bold',
	    	                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
	    	                }
	    	            }
	    	        },
						itemStyle: {
				            fontSize: '0.9em'
				        },
	    	        legend: {
	    	        	itemStyle: {
				            fontSize: '0.9em'
				        },
	    	            align: 'center',
	    	            x: 0,
	    	            verticalAlign: 'top',
	    	            padding:0,
	    	            margin:0,
	    	            y: 5,
	    	            floating: true,
	    	            backgroundColor: null,
	    	            borderColor: '#CCC',
	    	            borderWidth: 0,
	    	            shadow: false,
	    	            enabled:false,
	    	            itemDistance: 8
	    	        },
	    	        tooltip: {
	    	            headerFormat: '<b>{point.x}</b><br/>',
	    	            pointFormat: '{series.name}: {point.y:,.1f}<br />합계: {point.stackTotal:,.1f}'
	    	        },
	    	        plotOptions: {
	    	        	series: {animation: { duration: 200  },
					        pointPadding: 0, // Defaults to 0.1
					        groupPadding: 0.05 // Defaults to 0.2
					    },
	    	            column: {
	    	            	
	    	                stacking: 'normal',
	    	                dataLabels: {
	    	                	format: '{y:,.0f}',
	    	                    enabled: true,
	    	                    color:  'white',
	    	                    style: {
	    	                        textShadow: '0 0 3px black'
	    	                    }
	    	                }
	    	            }
	    	        },
	    	        series: series
	    	    });

	        ocProjectTotalEastSouth2.setSize(  eastSouth2Width,   eastSouth2Height,  false    );   
			ocProjectTotalEastSouth2.reflow();
			
			},// endof success for ajax
			failure:function(result, request) {
				Ext.getCmp('project-total').setLoading(false);
			}
		}); // endof Ajax
		
}
function redrawTotalChart33() {
	
	//console_logs('start', 'redrawTotalChart33');
	
	TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL33';
	TOTAL_PARAMS['projectTotal-SearchOrg'] = '생기';
		
			
		
	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
			params:TOTAL_PARAMS,
			success : function(response, request) {
				Ext.getCmp('project-total').setLoading(false);
				var val = Ext.JSON.decode(response.responseText);
				var cat = val['aXis'];
				var arr = [];
				var aXis = [];
				var posTable1 = -1;
				for(var i=0; i<cat.length; i++) {
					var res = cat[i].split(":");
					var code = res[0];
					var name = res[1];
					var o = { code : code,
							  name : name
							};
					arr.push(o);
					aXis.push(name);
					if(name=='당월') {
					 	posTable1 = i;
					}
				}
				var arrS = val['series'];
				//console_logs('arrS production', arrS);
				if(arrS!=null && arrS!=undefined) {
					
					redrawMainTable1('production', arrS, posTable1);
				
				}		
		redrawTotalChart34();
		
		
				var series = val['series'];
				arrangeColor(series);
				
        var sProjectTotalEastSouth3 = gColumnChartStyleSmall;
        sProjectTotalEastSouth3['renderTo'] ='projecttotal-south-east-center3-graph';
        ocProjectTotalEastSouth3 = new Highcharts.Chart({
        	chart: sProjectTotalEastSouth3,
        	spacingTop:50,
        	title: {
	    	            text: '',//'<div class="title03"><span>연구개발본부</span> 투입인원</div>',
	    	            margin: 0,
	    	            align: 'left',
	    	            useHTML: true
	    	        },
	    	        exporting: {
					         enabled: false
					},
	    	        subtitle: {
	    	            //text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
	    	        },
	    	        xAxis: {
	    	        		 labels: {
	    	        			 rotation: 0,
					            style: {
					                fontSize: '0.9em'
					            }
					        },
	    	            categories: aXis
	    	        },
	    	        yAxis: {
	    	        	visible: false,
	    	            min: 0,
	    	            title: {
	    	                text: '투입인원'
	    	            },
	    	            stackLabels: {
	    	                enabled: true,
	    	                style: {
	    	                    fontWeight: 'bold',
	    	                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
	    	                }
	    	            }
	    	        },
	    	      	itemStyle: {
				            fontSize: '0.9em'
				        },
	    	        legend: {
	    	        	itemStyle: {
				            fontSize: '0.9em'
				        },
	    	            align: 'center',
	    	            x: 0,
	    	            verticalAlign: 'top',
	    	            padding:0,
	    	            margin:0,
	    	            y: 5,
	    	            floating: true,
	    	            backgroundColor: null,
	    	            borderColor: '#CCC',
	    	            borderWidth: 0,
	    	            shadow: false,
	    	            enabled:false,
	    	            itemDistance: 8
	    	        },
	    	        tooltip: {
	    	            headerFormat: '<b>{point.x}</b><br/>',
	    	            pointFormat: '{series.name}: {point.y:,.1f}<br />합계: {point.stackTotal:,.1f}'
	    	        },
	    	        plotOptions: {
	    	        	series: {animation: { duration: 200  },
					        pointPadding: 0, // Defaults to 0.1
					        groupPadding: 0.05 // Defaults to 0.2
					    },
	    	            column: {
	    	            	
	    	                stacking: 'normal',
	    	                dataLabels: {
	    	                	format: '{y:,.0f}',
	    	                    enabled: true,
	    	                    color:  'white',
	    	                    style: {
	    	                        textShadow: '0 0 3px black'
	    	                    }
	    	                }
	    	            }
	    	        },
	    	        series: series
	    	    });

	        ocProjectTotalEastSouth3.setSize(  eastSouth3Width,   eastSouth3Height,  false    );   
			ocProjectTotalEastSouth3.reflow();
			
			},// endof success for ajax
			failure:function(result, request) {
				Ext.getCmp('project-total').setLoading(false);
			}
		}); // endof Ajax
		
}
function redrawTotalChart34() {
	
	//console_logs('start', 'redrawTotalChart34');
	
	TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL34';
	TOTAL_PARAMS['projectTotal-SearchOrg'] = '기타';
			
			
		
	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
			params:TOTAL_PARAMS,
			success : function(response, request) {
				Ext.getCmp('project-total').setLoading(false);
				var val = Ext.JSON.decode(response.responseText);
				var cat = val['aXis'];
				var arr = [];
				var aXis = [];
				var posTable1 = -1;
				for(var i=0; i<cat.length; i++) {
					var res = cat[i].split(":");
					var code = res[0];
					var name = res[1];
					var o = { code : code,
							  name : name
							};
					arr.push(o);
					aXis.push(name);
					
					if(name=='당월') {
					 	posTable1 = i;
					}
					
				}
				var arrS = val['series'];
				//console_logs('arrS etc', arrS);
				if(arrS!=null && arrS!=undefined) {
					
					redrawMainTable1('etc', arrS, posTable1);
				
				}
				var series = val['series'];
				arrangeColor(series);
				
        var sProjectTotalEastSouth4 = gColumnChartStyleSmall;
        sProjectTotalEastSouth4['renderTo'] ='projecttotal-south-east-center4-graph';
        ocProjectTotalEastSouth4 = new Highcharts.Chart({
        	chart: sProjectTotalEastSouth4,
        	spacingTop:50,
        	title: {
	    	            text: '',//'<div class="title03"><span>연구개발본부</span> 투입인원</div>',
	    	            margin: 30,
	    	            align: 'left',
	    	            useHTML: true
	    	        },
	    	        exporting: {
					         enabled: false
					},
	    	        subtitle: {
	    	            //text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
	    	        },
	    	        xAxis: {
	    	        		 labels: {
	    	        			 rotation: 0,
					            style: {
					                fontSize: '0.9em'
					            }
					        },
	    	            categories: aXis
	    	        },
	    	        yAxis: {
	    	        	visible: false,
	    	            min: 0,
	    	            title: {
	    	                text: '투입인원'
	    	            },
	    	            stackLabels: {
	    	                enabled: true,
	    	                style: {
	    	                    fontWeight: 'bold',
	    	                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
	    	                }
	    	            }
	    	        },
						itemStyle: {
				            fontSize: '0.9em'
				        },
	    	        legend: {
	    	        	itemStyle: {
				            fontSize: '0.9em'
				        },
	    	            align: 'center',
	    	            x: 0,
	    	            verticalAlign: 'top',
	    	            padding:0,
	    	            margin:0,
	    	            y: 5,
	    	            floating: true,
	    	            backgroundColor: null,
	    	            borderColor: '#CCC',
	    	            borderWidth: 0,
	    	            shadow: false,
	    	            enabled:false,
	    	            itemDistance: 8
	    	        },
	    	        tooltip: {
	    	            headerFormat: '<b>{point.x}</b><br/>',
	    	            pointFormat: '{series.name}: {point.y:,.1f}<br />합계: {point.stackTotal:,.1f}'
	    	        },
	    	        plotOptions: {
	    	        	series: {animation: { duration: 200  },
					        pointPadding: 0, // Defaults to 0.1
					        groupPadding: 0.05 // Defaults to 0.2
					    },
	    	            column: {
	    	            	
	    	                stacking: 'normal',
	    	                dataLabels: {
	    	                	format: '{y:,.0f}',
	    	                    enabled: true,
	    	                    color:  'white',
	    	                    style: {
	    	                        textShadow: '0 0 3px black'
	    	                    }
	    	                }
	    	            }
	    	        },
	    	        series: series
	    	    });

	        ocProjectTotalEastSouth4.setSize(  eastSouth4Width,   eastSouth4Height,  false    );   
			ocProjectTotalEastSouth4.reflow();
			
			},// endof success for ajax
			failure:function(result, request) {
				Ext.getCmp('project-total').setLoading(false);
			}
		}); // endof Ajax
		
}

function redrawTotalChart3() {

	
	//console_logs('start', 'redrawTotalChart3');
	
	var thisMon = Ext.getCmp('projectTotal-Month').getValue();
	//console_logs('thisMon', thisMon);
		
	var y = thisMon.substring(0,4);
	var m = thisMon.substring(6,8);
	
	//var l = y + '/' + m + '/' + '01';
	//console_logs('l', l);
	
	var myDate = Ext.Date.parse(y + '/' + m + '/' + '01', 'Y/m/d');
	//console_logs('myDate', myDate);
    myDate.setMonth(myDate.getMonth()-1);
    var prevMonth = Ext.Date.format(myDate, 'Y년 m월');
    
    myDate.setMonth(myDate.getMonth()-11);
    var prevYear = Ext.Date.format(myDate, 'Y년 m월');
    
    //console_logs('prevMonth', prevMonth);
	//console_logs('prevYear', prevYear);

	var monthList = [];
	monthList.push(prevYear);
	monthList.push(prevMonth);
	monthList.push(thisMon);
	
	TOTAL_PARAMS['projectTotal-Month-arr'] = monthList;
	TOTAL_PARAMS['cubeCode'] = 'PJ_ORG';
	TOTAL_PARAMS['projectTotal-SearchType'] = '인원수';


	redrawTotalChart31();

}

/**
 * @class FeedViewer.FeedDetail
 * @extends Ext.panel.Panel
 *
 * Shows the details of a particular feed
 * 
 * @constructor
 * Create a new Feed Detail
 * @param {Object} config The config object
 */
Ext.define('FeedViewer.ProjectTotal', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.projectTotal',
	frame   : false,
    border: false,
	split: true,
	bodyPadding: '1 0 0 0',
	createToolbar: function(){

        var items = [],
            config = {};
        if (!this.inTab) {
         
			items.push({
			       emptyText: '',
	               xtype:          'combo',
	               id: 'projectTotal-Month',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          TOTAL_PARAMS['projectTotal-Month'],
	               triggerAction:  'all',
	               store: Ext.create('Xdview.store.CmmCodeStore', {parentCode:'592', hasNull:false}),
	               width: 120,
	               cls : 'newCSS',
	               listConfig:{
	               getInnerTpl: function(){
	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
	                	}			                	
	                },
	 	            listeners: {
     	                    select: function (combo, record) {
     	                    	var systemCode = record.get('systemCode');
     	                    	TOTAL_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				                //output.setBodyStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');
			
	        items.push({
	        	xtype: 'component',
	            html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawTotalChartAll();"></button></span></div>'
	        });
	        items.push('->');
    	
	        items.push({
				xtype : 'checkbox',
				id : 'chkAutorefresh1',
				boxLabel : 'Auto Refresh',
				tip: '탭 변경 시 차트 다시그리기',
				checked: true,
				listeners: {
			            change: function(field, newValue, oldValue, eOpts){
			            	AUTO_REFRESH = newValue;
			            	refreshCheckBoxAll();
			            },
			            render: function(c) {
				            Ext.create('Ext.tip.ToolTip', {
				                target: c.getEl(),
				                html: c.tip
				            });
				        }
	               }
			}, '-');
	        
	        items.push({
	        	xtype: 'component',
	            html: '<div class="searchcon" onClick="openNewWindow();"><span class="newwinBT"><button type="button" ></button></span></div>'
	        });
	        config.items = items;
            
        }
        else {
            config.cls = 'x-docked-border-bottom';
        }
        config.cls = 'my-x-toolbar-default';
        return Ext.create('widget.toolbar', config);

    },
	bodyPadding: 10,
    initComponent: function(){
       // this.display = Ext.create('widget.feedpost', {});
        this.dockedItems = [this.createToolbar()];
        Ext.apply(this, {
        	contentEl: 'costPagelayout'
        });
        this.callParent(arguments);
    },
           
    /**
     * Loads a feed.
     * @param {String} url
     */
    loadFeed: function(url){   },


    /**
     * Fires when a grid row is selected
     * @private
     * @param {FeedViewer.FeedGrid} grid
     * @param {Ext.data.Model} rec
     */
    onSelect: function(grid, rec) {   },

    
    /**
     * Reacts to the open all being clicked
     * @private
     */
    onOpenAllClick: function(){
        this.fireEvent('openall', this);
    },

    createEast: function(){
    
    	
     var eastNorth = Ext.create('Ext.panel.Panel', {
         id: 'projecttotal-east-north' +'id',   
//    	 minHeight: 200,
//            minWidth: 150,
            height: "35%",
            resizable: false,
            width: "100%",
            region: 'north',
            contentEl: 'projecttotal-east-north',
            collapsible: false,
            listeners: {
//            	afterrender:function(){
//            		console_logs( 'eastNorth afterrender ', this.getHeight());
//            	},
//            	boxready:function(){
//            		 console_logs( 'eastNorthboxready ', this.getHeight());
//               },
				'resize' : function(win,width,height,opt){
					//console_logs( 'eastNorth resize ', height);
//					eastNorthWidth = width;
//					eastNorthHeight = height;
                 	if(ocProjectTotalEastNorth!=null && ocProjectTotalEastNorth!=undefined && ocProjectTotalEastNorth!='undefined') {
		               ocProjectTotalEastNorth.setSize(  width,   height,  false    );   
					   ocProjectTotalEastNorth.reflow();
                 	}
                 	
                 }
            }
        });

        var eastCenter = Ext.create('Ext.panel.Panel', {
            id: 'projecttotal-east-center' +'id', 
            height: "35%",
            resizable: false,
            width: "100%",
            region: 'center',
            collapsible: false,
            contentEl: 'projecttotal-east-center',
            listeners: {
				'resize' : function(win,width,height,opt){
					eastCenterWidth = width;
					eastCenterHeight = height;
                 	if(ocProjectTotalEastCenter!=null && ocProjectTotalEastCenter!=undefined && ocProjectTotalEastCenter!='undefined') {
		               ocProjectTotalEastCenter.setSize(  width,   height,  false    );   
					   ocProjectTotalEastCenter.reflow();
					   //console_logs('resize ok', width + ',' + height);
                 	}
                 	
                 }
            }
        });
        
        
        var eastSouth = Ext.create('Ext.panel.Panel', {
//            minHeight: 200,
//            minWidth: 150,
            height: "30%",
            resizable: false,
            width: "100%",
            region: 'south',
            collapsible: false,
            cls : 'mobis-panel',
         layout: 'column',
            listeners: {
				'resize' : function(win,width,height,opt){
					//console_logs('Width = ', width);
					//console_logs('Height =',  height);
                 }
            },
		items: [{
        			height:'100%',
        			id: 'projecttotal-south-east-center1' +'id', 
        			xtype: 'component',
        			columnWidth: 0.25,
	         		contentEl: 'projecttotal-south-east-center1'
	         		, listeners: {
							'resize' : function(win,width,height,opt){
								//console_logs('projecttotal-south-east-center1 Width = ', width);
								//console_logs('projecttotal-south-east-center1 Height =',  height);
			                 }
			            }
        		}, {
        			height:'100%',
        			id: 'projecttotal-south-east-center2' +'id', 
        			xtype: 'component',
					columnWidth: 0.25,
	         		contentEl: 'projecttotal-south-east-center2'
					, listeners: {
							'resize' : function(win,width,height,opt){
								//console_logs('projecttotal-south-east-center2 Width = ', width);
								//console_logs('projecttotal-south-east-center2 Height =',  height);
			                 }
			            }
        		},{
        			height:'100%',
        			id: 'projecttotal-south-east-center3' +'id', 
        			xtype: 'component',
					columnWidth: 0.25,
		         	contentEl: 'projecttotal-south-east-center3'
					, listeners: {
							'resize' : function(win,width,height,opt){
								//console_logs('projecttotal-south-east-center3 Width = ', width);
								//console_logs('projecttotal-south-east-center3 Height =',  height);
			                 }
			            }
    			},{
    				id: 'projecttotal-south-east-center41' +'id', 
        			height:'100%',
        			xtype: 'component',
					columnWidth: 0.25,
		         	contentEl: 'projecttotal-south-east-center4'
					, listeners: {
							'resize' : function(win,width,height,opt){
			                 }
			            }
    			}],
     		listeners: {
				'resize' : function(win,width,height,opt){
					
					eastSouth1Width =  width/4;
					eastSouth1Height = height;
					eastSouth2Width =  width/4;
					eastSouth2Height = height;
					eastSouth3Width =  width/4;
					eastSouth3Height = height;
					eastSouth4Width =  width/4;
					eastSouth4Height = height;
					
                 	if(ocProjectTotalEastSouth1!=null && ocProjectTotalEastSouth1!=undefined && ocProjectTotalEastSouth1!='undefined') {
		                ocProjectTotalEastSouth1.setSize(  width/4,   height,  false    );   
                 	}
                 	if(ocProjectTotalEastSouth2!=null && ocProjectTotalEastSouth2!=undefined && ocProjectTotalEastSouth2!='undefined') {
		                ocProjectTotalEastSouth2.setSize(  width/4,   height,  false    );   
                 	}
                 	if(ocProjectTotalEastSouth3!=null && ocProjectTotalEastSouth3!=undefined && ocProjectTotalEastSouth3!='undefined') {
		                ocProjectTotalEastSouth3.setSize(  width/4,   height,  false    );   
                 	}
                 	if(ocProjectTotalEastSouth4!=null && ocProjectTotalEastSouth4!=undefined && ocProjectTotalEastSouth4!='undefined') {
		                ocProjectTotalEastSouth4.setSize(  width/4,   height,  false    );   
                 	}
                 }
            }
        });

        this.east =  Ext.create('Ext.panel.Panel', {
           layout:'border',
           region: 'east',
           flex:1,
           resizable: true,
           resizeHandles: 's',
           layoutConfig: {columns: 1, rows:3},
		   defaults: {
			        //collapsible: true,
			        split: true,
			        cmargins: '2 0 0 0',
			        margins: '0 0 0 0'
           },    
           items: [eastNorth, eastCenter, eastSouth]
        });
    
        return this.east;
       
    },
    /**
     * Create the center region container
     * @private
     * @return {Ext.panel.Panel} center
     */
    createCenter: function(){
        this.center =  Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: false,
            region: 'center',
            contentEl: 'costPagelayout'
        });
        return this.center;
    }
    
});


