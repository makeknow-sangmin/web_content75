
/*
 현황 구성
  
  TABLE1                         CHART1
  
                                 CHART2
  TABLE2 
                         CHART31  CHART32   CHART33  CHART34
                     
  
 */

Ext.define('Rfx.view.projectTotal.ProjectTotalBase224', {
    extend: 'Rfx.view.projectTotal.ProjectTotalBase',

    URL_PATH: '',
    //표 제목
    titles : [
        'mainTitle1',
        'mainTitle2',
        'mainTitle3',
        'mainTitle4',
        'mainTitle5',
        'mainTitle6',
        'mainTitle7',
        'mainTitle8',
    ],
    
    sub_titles : {
    	
    },
    
    //Table1의 필드명
    titleTable1_fields: [
        'th1-1',
        'th1-2',
        'th1-3',
        'th1-4',
        'th1-5'
    ],

    //Table2의 필드명
    titleTable2_fields: [
        'th2-1',
        'th2-2',
        'th2-3',
        'th2-4',
        'th2-5'
    ],
    
    callInfo: {
    	TABLE1: {
    		cubeCode: '',
    		projectChartType: '',
    		url:''
    	},
    	TABLE2: {
    		cubeCode: '',
    		projectChartType: '',
    		url:''
    	},
    	CHART1: {
    		cubeCode: '',
    		projectChartType: '',
    		url:''
    	},
    	CHART3: {
    		cubeCode: '',
    		projectChartType: '',
    		url:''
    	},
    	CHART31: {
    		cubeCode: '',
    		projectChartType: '',
    		url:''
    	},
    	CHART32: {
    		cubeCode: '',
    		projectChartType: '',
    		url:''
    	},
    	CHART33: {
    		cubeCode: '',
    		projectChartType: '',
    		url:''
    	},
    	CHART34: {
    		cubeCode: '',
    		projectChartType: '',
    		url:''
    	}
    	
    },
    
    initComponent: function(){
        this.callParent(arguments);
        this.redrawTotalChartAll();
        
        for(var i=0; i<this.titleTable1_fields.length; i++) {
            $('#th1-' + (i+1) ).html(this.titleTable1_fields[i]);	
        }
        for(var i=0; i<this.titleTable2_fields.length; i++) {
            $('#th2-' + (i+1) ).html(this.titleTable2_fields[i]);	
        }
        
        for(var i=0; i<this.titles.length; i++) {
            $('#mainTitle' + (i+1) ).html(this.titles[i]);	
        }
        
        
    },
    
    //차트 모두 다시그리기
    redrawTotalChartAll: function() {
    	this.redrawMainTable1();
    	this.redrawMainTable2();
    	this.redrawTotalChart1();
    	this.redrawTotalChart2();
    	this.redrawTotalChart3();
    },
    
    redrawTotalChart1: function () {
    	    	
    	TOTAL_PARAMS['cubeCode'] = 'PURCHASE_ORDER'; //'MES_PRECESS';
    	TOTAL_PARAMS['projectChartType'] = 'DAY_PO_CNT_KWLM'; //'DAY_PO_CNT';
    	console_logs('redrawTotalChart1', TOTAL_PARAMS);

    	var s_date = Ext.getCmp('projectTotal-s_date').getValue();
    	var e_date = Ext.getCmp('projectTotal-e_date').getValue();
    	var today = new Date();
    	
    	s_date = Ext.Date.format(new Date(), 'Ymd');
    	s_date = s_date.substring(0,6) + '01';
    	e_date = new Date(today.getFullYear(), today.getMonth()+1, 0);
    	e_date = Ext.Date.format(e_date, 'Ymd');
    	
    	TOTAL_PARAMS['projectTotal-s_date'] = gUtil.yyyymmdd(s_date, '');
    	TOTAL_PARAMS['projectTotal-e_date'] = gUtil.yyyymmdd(e_date, ''); 
    	
    	//this.setLoading(true);
    	var me = this;
    	me.beforerequest();
	 	Ext.Ajax.request({
			url: CONTEXT_PATH + /*'http://1.214.212.140:7080*/'/xdview/chart.do?method=getChart&serial_no=1',				
			params:TOTAL_PARAMS,
			success : function(response, request) {
				me.requestcomplete();
				console_logs('==redrawTotalChart1', response.responseText);
		    	var arr = TOTAL_PARAMS['projectTotal-Day-arr']
		    	console_logs('==arr', arr.length);
		    	
		    	var val = null;
		    	try {
		    		val = Ext.JSON.decode(response.responseText);
		    	} catch(e) {} 

		    	if(val==null) {
			    	return;
		    	} else {
				
					console_logs("val['series']", val['series']);
					console_logs("val['aXis']", val['aXis']);
					var cat = val['aXis'];
					var aXis = [];
					var aXis1 = [];
					var r = [];
					for(var i=0; i<cat.length; i++) {
						var res = cat[i].split(":");
						var name = res[1];
						var l = name.length;
						res = res[0].substring(4,8);
						r.push(res);
					}
					
					var today = new Date();
					var last = new Date(today.getFullYear(), today.getMonth()+1, 0);
					
					today = Ext.Date.format(today, 'md');
					
					var day = today.substring(0,2);
					last_day = Ext.Date.format(last, 'd');
					
				    var i = last_day;
				    
				    for(var i=0; i<last_day; i++) {
				    	if(i<9) {
				    		var d = day + '/' + ('0'+(i+1));
				    	} else {
				    		var d = day + '/' + (i+1);
				    	}
				    	aXis.push(d);
				    }
					
					
					var series = val['series'];
					var s = [];
					for(var i=0; i<r.length; i++) {
						var f = r[i].substring(0,2) + '/' + r[i].substring(2,4);
						s.push(f);
					}
					var data = [];
					var p = 0;
					var t = 0;
					for(var i=0; i<aXis.length; i++) {
							if(aXis[i] == s[t]) {
								data.push(series[0].data[p]);
								p++;
								t++;
							} else {
								data.push(0);
							}
						
					}
					var datas = [{
							
							data: data,
							name: 'value'
								
					}];
					
					console_logs('redrawTotalChart1 series', series);
		    	}
				
				
		    	if( vCompanyReserved4 !=  'KWLM01KR') {
					gUtil.setTable1Date1(aXis);
					gUtil.setMainTable1Value(datas);
		    	}
				
				var sProjectTotalEastNorth = gColumnChartStyle;
	            sProjectTotalEastNorth['renderTo'] ='projecttotal-east-north-graph';
	            sProjectTotalEastNorth['type'] = 'column';
	            
	            ocProjectTotalEastNorth = new Highcharts.Chart({

    			    chart: sProjectTotalEastNorth,
    			    
    				title: {
    						text: me.titles[2],
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
//    	    	            	[	'1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
//    	    	            	 	'11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
//    	    	            	 	'21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
//    	    	            	 ]
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
    		                enabled: true
    		            },
//    	    	        legend: {
//    	    	            align: 'right',
//    	    	            x: 0,
//    	    	            verticalAlign: 'top',
//    	    	            y: 0,
//    	    	            floating: true,
//    	    	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
//    	    	            borderColor: '#CCC',
//    	    	            borderWidth: 0,
//    	    	            shadow: false,
//    	    	            enabled:true
//    	    	        },
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
    	    	       series: datas
    	    	    });

    	        	ocProjectTotalEastNorth.setSize(  eastCenterWidth,   eastCenterHeight,  false    );   
    				ocProjectTotalEastNorth.reflow();
    					
    			},// endof success for ajax
    			failure:function(result, request) {
    				me.requestcomplete();
    				//me.setLoading(false);
    			}
    		}); // endof Ajax
    	
    },

    redrawTotalChart2: function() {

    	TOTAL_PARAMS['cubeCode'] = 'MES_PO';
    	TOTAL_PARAMS['projectChartType'] = 'DAY_PO_CNT_KWLM'; //'DAY_PO_CNT';
    	var s_date = Ext.getCmp('projectTotal-s_date').getValue();
    	var e_date = Ext.getCmp('projectTotal-e_date').getValue();
    	
    	console_logs('222s_date', s_date);
    	console_logs('e_date', e_date);
    	var today = new Date();
    	s_date = Ext.Date.format(new Date(), 'Ymd');
    	e_date = new Date(today.getFullYear(), today.getMonth()+1, 0);
    	e_date = Ext.Date.format(e_date, 'Ymd');
    	
    	s_date = s_date.substring(0,6) + '01';
    	
    	console_logs('333s_date', s_date);
    	console_logs('333e_date', e_date);
    	
    	TOTAL_PARAMS['projectTotal-s_date'] = gUtil.yyyymmdd(s_date, '');
    	TOTAL_PARAMS['projectTotal-e_date'] = gUtil.yyyymmdd(e_date, '');   	
    	////this.setLoading(true);
    	var me = this;
    	me.beforerequest();
     	Ext.Ajax.request({
    			url: CONTEXT_PATH + /*'http://1.214.212.140:7080*/'/xdview/chart.do?method=getChart',				
    			params:TOTAL_PARAMS,
    			success : function(response, request) {
    				me.requestcomplete();
    				console_logs('redrawTotalChart2', response.responseText);
    				//me.setLoading(false);
    				
    		    	var val = null;
    		    	try {
    		    		val = Ext.JSON.decode(response.responseText);
    		    	} catch(e) {} 

    		    	if(val==null) {
    		    		val = {"sorted":[{"value1":160000,"name":"톰슨","value":450667,"ratio":2.81666875},{"value1":175000,"name":"인쇄","value":489855,"ratio":2.7991714285714284},{"value1":280000,"name":"포장","value":557479,"ratio":1.9909964285714286},{"value1":175000,"name":"합지","value":244183,"ratio":1.3953314285714287},{"value1":80000,"name":"트레이","value":1,"ratio":1.373325},{"value1":80000,"name":"기타가공","value":20000,"ratio":0.25},{"value1":90000,"name":"코팅-1","value":9020,"ratio":0.10022222222222223},{"value1":1600000,"name":"접합(철)","value":5506,"ratio":0.00344125}],"series":[{"data":[0,0,1,0,0],"name":"접합(철):계획"},{"data":[0,0,1506,0,4000],"name":"접합(철):실적"},{"data":[30000,30000,30000,30000,40000],"name":"톰슨:계획"},{"data":[112625,30184,114418,93796,99644],"name":"톰슨:실적"},{"data":[30000,0,30000,30000,0],"name":"코팅-1:계획"},{"data":[2070,0,1340,5610,0],"name":"코팅-1:실적"},{"data":[80000,0,80000,40000,80000],"name":"포장:계획"},{"data":[164710,0,129957,201552,61260],"name":"포장:실적"},{"data":[35000,35000,35000,35000,35000],"name":"인쇄:계획"},{"data":[0,0,0,0,0],"name":"인쇄:실적"},{"data":[0,0,80000,0,0],"name":"기타가공:계획"},{"data":[0,0,20000,0,0],"name":"기타가공:실적"},{"data":[40000,0,0,0,40000],"name":"트레이:계획"},{"data":[22400,0,0,0,87466],"name":"트레이:실적"},{"data":[35000,35000,35000,35000,35000],"name":"합지:계획"},{"data":[57616,18911,44052,75802,47802],"name":"합지:실적"}],"aXis":["20171013:20171013","20171014:20171014","20171016:20171016","20171017:20171017","20171018:20171018"]};
    		    		//return;
    		    	}
    				console_logs("val['series']", val['series']);
    				console_logs("val['aXis']", val['aXis']);
    				var cat = val['aXis'];
    				var aXis = [];
    				var aXis1 = [];
    				var r = [];
    				for(var i=0; i<cat.length; i++) {
    					var res = cat[i].split(":");
    					var name = res[1];
    					var l = name.length;
    					res = res[0].substring(4,8);
    					r.push(res);
    				}
    				var today = new Date();
    				var last = new Date(today.getFullYear(), today.getMonth()+1, 0);
    				
    				today = Ext.Date.format(today, 'md');
    				
    				var day = today.substring(0,2);
    				last_day = Ext.Date.format(last, 'd');
    				
    			    var i = last_day;
    			    
    			    for(var i=0; i<last_day; i++) {
    			    	if(i<9) {
    			    		var d = day + '/' + ('0'+(i+1));
    			    	} else {
    			    		var d = day + '/' + (i+1);
    			    	}
    			    	aXis.push(d);
    			    }
    			    
    				var series = val['series'];
    				var s = [];
    				for(var i=0; i<r.length; i++) {
    					var f = r[i].substring(0,2) + '/' + r[i].substring(2,4);
    					s.push(f);
    				}
    				var data = [];
    				var p = 0;
    				var t = 0;
    				for(var i=0; i<aXis.length; i++) {
//    						if(aXis[i] == s[t]) {
//    							console_logs('series[0].data[p]', series[0].data[p]);
//    							data.push(series[0].data[p]);
//    							p++;
//    							t++;
//    						} else {
    							data.push(0);
    						//}
    					
    				}
    				var datas = [{
    						
    						data: data,
    						name: 'value'
    							
    				}];
    				
    				console_logs('redrawTotalChart1 series', series);
    				if( vCompanyReserved4 !=  'KWLM01KR') {
	    				gUtil.setTable1Date1(aXis);
	    				gUtil.setMainTable1Value(datas);
    				}
    				//gUtil.setTable2Value(val['sorted']);
    				
    				//console_logs('redrawTotalChart2 series', series);
    				//arrangeColor(series);
    				
    				//moveNullPos(cat, series, aXis,arr);


    	   
           var sProjectTotalEastCenter = gColumnChartStyle;
            sProjectTotalEastCenter['renderTo'] ='projecttotal-east-center-graph';
            
            sProjectTotalEastCenter['type'] = 'line';
            ocProjectTotalEastCenter = new Highcharts.Chart({

    			    chart: sProjectTotalEastCenter,
    			    
    				title: {
	    	            text: me.titles[3],
	    	            margin: 5,
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
    	    	                text: '투입인원'
    	    	            }
    	    	        },
    	    	        scrollbar: {
    				        enabled: true
    				    },
    		            legend: {
    		                enabled: false
    		            },
    		            /*
    	    	        legend: {
    	    	            align: 'right',
    	    	            x: -30,
    	    	            verticalAlign: 'top',
    	    	            y: 15,
    	    	            floating: true,
    	    	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
    	    	            borderColor: '#CCC',
    	    	            borderWidth: 0,
    	    	            shadow: false
    	    	        },*/
    	    	        tooltip: {
    	    	            headerFormat: '<b>{point.x}</b><br/>',
    	    	            pointFormat: '{series.name}: {point.y:,f}'
    	    	        },
    	    	        plotOptions: {
    	    	            column: {
    	    	            	  pointPadding: 0.1,
    	    	                  borderWidth: 0,
    	    	                  groupPadding: 0,
    	    	                  shadow: false
    	    	            }
    	    	        },
       	    	        series: datas
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
    		            	//me.setLoading(false);
    		            	//$(window.document.location).attr("href", "/xdview/index.do?method=main");
    		            }
    		        });
    				me.requestcomplete();
    			}
    		}); // endof Ajax			
    			
    },
    
    /**
     * 좌측상단 테이블
     */
    redrawMainTable1: function() {
    	 console_logs('redrawMainTable1');
     	switch(vCompanyReserved4) {
    	case 'KWLM01KR':

	    	TOTAL_PARAMS['cubeCode'] = 'PURCHASE_ORDER';
	    	TOTAL_PARAMS['projectChartType'] = 'RECEIPT_PO_TABLE';
	    	
	    	var me = this;
	    	console_logs('redrawTotalChart1', TOTAL_PARAMS);
	    	me.beforerequest();
		 	Ext.Ajax.request({
				url: CONTEXT_PATH + /*'http://1.214.212.140:7080*/'/xdview/chart.do?method=getChart',				
				params:TOTAL_PARAMS,
				success : function(response, request) {
					me.requestcomplete();
					console_logs('================== redrawMainTable1 response.responseText', response.responseText);
					var val = Ext.JSON.decode(response.responseText);
					console_logs('redrawMainTable1 val', val);
					if(val!=null) {
						var records = val.records;
						
						//합계구하기
						var sum2 = sum3 = sum4 = sum5 = sum6 = 0;
						
						for(var i=0; i<records.length; i++) {
							var rec = records[i];
							sum2 = sum2 + rec[2];
							sum3 = sum3 + rec[3];
							sum4 = sum4 + rec[4];
							sum5 = sum5 + rec[5];
							sum6 = sum6 + rec[6];					
						}
						
						//헤더정보
						$('#mainTable1 > tbody:last-child').append(
					    '<tr>'
						+'<th class="thbg1">합계</th>'
						+'<th><span class="bluetxt" id="td1-total-1">' + Ext.util.Format.number(sum2/1000, '0,00/i') + '</span></th>'
						+'<th><span class="bluetxt" id="td1-total-2">' + Ext.util.Format.number(sum3/1000, '0,00/i') + '</span></th>'
						+'<th><span class="bluetxt" id="td1-total-3">' + Ext.util.Format.number(sum4/1000, '0,00/i') + '</span></th>'
						+'<th><span class="bluetxt" id="td1-total-4">' + Ext.util.Format.number(sum5/1000, '0,00/i') + '</span></th>'
						+'<th><span class="redtxt" id="td1-total-total">' +Ext.util.Format.number(sum6/1000, '0,00/i') + '</span></th>'
						+'</tr>' );
						
						//레코드
						for(var i=0; i<records.length; i++) {
							var rec = records[i];
							var line = '<tr>'
							    +'<td class="thbg2" title="' +  rec[0] + '">' + rec[1] + '</td>'
							    +'<td>' + Ext.util.Format.number(rec[2]/1000, '0,00/i') + '</td>'
							    +'<td>' + Ext.util.Format.number(rec[3]/1000, '0,00/i') + '</td>'
							    +'<td>' + Ext.util.Format.number(rec[4]/1000, '0,00/i') + '</td>'
							    +'<td>' + Ext.util.Format.number(rec[5]/1000, '0,00/i') + '</td>'
							    +'<td>' + Ext.util.Format.number(rec[6]/1000, '0,00/i') + '</td>'
							    +'</tr>';
					       	$('#mainTable1 > tbody:last-child').append( line );							
						}
						
						
					}
					
		       	 
		       	 
		       	 
				},// endof success for ajax
    			failure:function(result, request) {
    				me.requestcomplete();
    			}
    		}); // endof Ajax
	       	
    		default:
    			
    	}
     	

    },
    redrawMainTable1Sub: function(col, arrS, posTable1) {

    console_logs('redrawMainTable1 col', col);
    console_logs('redrawMainTable1 arrS', arrS);
    console_logs('redrawMainTable1 posTable1', posTable1);
    	
//    	if(col=='research') { //첫 column
//    		this.oSumMainTab1_pre = 0;
//    		this.oSumMainTab1_mass = 0;
//    		this.oSumMainTab1_common = 0;
//    		this.oSumMainTab1_etc = 0;
//    		this.oSumMainTab1_total = 0;
//    	}
    	
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
    				this.MainTab1_pre = this.MainTab1_pre + v1;
    			}
    			break;
    		case '양산':
    			pos = 'mass';
    			if(v1!=undefined) {
    				this.MainTab1_mass = this.MainTab1_mass + v1;
    			}
    			break;
    		case '공통':
    			if(v1!=undefined) {
    				this.MainTab1_common = this.MainTab1_common + v1;
    			}
    			pos = 'common';
    			break;
    		default:
    			if(v1!=undefined) {
    				this.MainTab1_etc = this.MainTab1_etc + v1;
    			}
    			pos ='etc';
    		}
    		setNumberById('td1-' + col + '-' + pos, v1);
    		if(v1!=undefined) {
    			sum = sum + v1;
    		}
    	}
    	setNumberById('td1-' + col + '-' + 'total', sum);
    	this.oSumMainTab1_total = this.oSumMainTab1_total + sum;
    	
    	if(col=='etc') {
    		setNumberById('td1-' + 'total' + '-' + 'pre', 	this.MainTab1_pre);
    		setNumberById('td1-' + 'total' + '-' + 'mass', 	this.MainTab1_mass);
    		setNumberById('td1-' + 'total' + '-' + 'common',this.MainTab1_common);
    		setNumberById('td1-' + 'total' + '-' + 'etc', 	this.MainTab1_etc);
    		setNumberById('td1-' + 'total' + '-' + 'total', this.MainTab1_total);
    	}
    	
    	
    },
    redrawMainTable2: function () {
    	
    	TOTAL_PARAMS['projectTotal-SearchType'] = null;
    	TOTAL_PARAMS['projectTotal-Month-arr'] = null;
    	TOTAL_PARAMS['projectTotal-SearchOrg'] = null;
    	
    	
    	TOTAL_PARAMS['cubeCode'] = 'PURCHASE_ORDER'; //'MES_PRECESS';
    	TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL_MAIN2';
    	//TOTAL_PARAMS['projectTotal-Month'] = Ext.getCmp('projectTotal-Month').getValue();
    	
    	var me = this;
    	me.beforerequest();
    	 	Ext.Ajax.request({
    	 			url: CONTEXT_PATH + '/userMgmt/user.do?method=readgrids',				
    				params: 'joint=joint',
    				success : function(response, request) {
    					me.requestcomplete();
    					var val = Ext.JSON.decode(response.responseText);
    					var records = val['datas'];
    					console_logs('===>records', records.length);
    					for(var i=0; i<records.length; i++) {
    							
    							var rec = records[i];  // 
    							//console_logs('===>rec', rec);
//    							var user_name_1 = '';
//    							var user_name_2 = '';
//    							var user_name_3 = '';
//    							var user_name_4 = '';
//    							if(rec['user_name_1'] == null) {
//    								user_name_1 = ''
//    							} else {
//    								user_name_1 = rec['user_name_1'];
//    							}
//    							if(rec['user_name_2'] == null) {
//    								user_name_2 = ''
//    							} else {
//    								user_name_2 = rec['user_name_2'];
//    							}
//    							if(rec['user_name_3'] == null) {
//    								user_name_3 = ''
//    							} else {
//    								user_name_3 = rec['user_name_3'];
//    							}
//    							if(rec['user_name_4'] == null) {
//    								user_name_4 = ''
//    							} else {
//    								user_name_4 = rec['user_name_4'];
//    							}
    							var user_name_1 = rec['user_name_1'];
    							var user_name_2 = rec['user_name_2'];
    							var user_name_3 = rec['user_name_3'];
    							var user_name_4 = rec['user_name_4'];
    							var user_name_5 = rec['user_name_5'];
    							//console_logs('user_name==>', user_name_5);
    							
    							var ep_suborg_code_1 = rec['ep_suborg_code_1'];
    							var ep_suborg_code_2 = rec['ep_suborg_code_2'];
    							var ep_suborg_code_3 = rec['ep_suborg_code_3'];
//    							var ep_suborg_code_4 = rec['ep_suborg_code_4'];
    							var ep_suborg_code_5 = rec['ep_suborg_code_5'];
    							//console_logs('ep_suborg_code_5==>', ep_suborg_code_5);
    							
    							var value_1 = '';
    							var value_2 = '';
    							var value_3 = '';
//    							var value_4 = '';
    							var value_5 = '';
    							
    							if(user_name_1 == null || user_name_1 == '') {
    								value_1 = user_name_1 + '' ;
    							} else {
    								value_1 = user_name_1 + '\n' + '[' + ep_suborg_code_1 + ']'; 
    							}
    							if(user_name_2 == null || user_name_2 == '') {
    								value_2 = user_name_2 + '' ;
    							} else {
    								value_2 = user_name_2 + '\n' +'[' + ep_suborg_code_2 + ']'; 
    							}
    							if(user_name_3 == null || user_name_3 == '') {
    								value_3 = user_name_3 + '' ;
    							} else {
    								value_3 = user_name_3 + '\n' +'[' + ep_suborg_code_3 + ']'; 
    							}
//    							if(user_name_4 == null || user_name_4 == '') {
//    								value_4 = user_name_4 + '' ;
//    							} else {
//    								value_4 = user_name_4 + '\n' +'[' + ep_suborg_code_4 + ']'; 
//    							}
    							if(user_name_5 == null || user_name_5 == '') {
    								value_5 = '' ;
    							} else {
    								value_5 = user_name_5 + '\n' +'[' + ep_suborg_code_5 + ']'; 
    							}
    							
    							if(user_name_1 != null && user_name_1 != '') {
    								setStringById('td2-' + 'user_name_1' + '-' + (i+1), value_1);
    							}
    							if(user_name_2 != null && user_name_2 != '') {
    								setStringById('td2-' + 'user_name_2' + '-' + (i+1), value_2);
    							}
    							if(user_name_3 != null && user_name_3 != '') {
    								setStringById('td2-' + 'user_name_3' + '-' + (i+1), value_3);
    							}
//    							if(user_name_4 != null && user_name_4 != '') {
//    								setStringById('td2-' + 'user_name_4' + '-' + (i+1), value_4);
//    							}
    							if(user_name_5 != null && user_name_5 != '') {
    								setStringById('td2-' + 'user_name_5' + '-' + (i+1), value_5);
    							}
//    							setStringById('td2-' + 'user_name_1' + '-' + (i+1), user_name_1);
//    							setStringById('td2-' + 'user_name_2' + '-' + (i+1), user_name_2);
//    							setStringById('td2-' + 'user_name_3' + '-' + (i+1), user_name_3);
//    							setStringById('td2-' + 'user_name_4' + '-' + (i+1), user_name_4);
//    							setStringById('td2-' + 'ep_suborg_code_1' + '-' + (i+1), ep_suborg_code_1);
//    							setStringById('td2-' + 'ep_suborg_code_2' + '-' + (i+1), ep_suborg_code_2);
//    							setStringById('td2-' + 'ep_suborg_code_3' + '-' + (i+1), ep_suborg_code_3);
//    							setStringById('td2-' + 'ep_suborg_code_4' + '-' + (i+1), ep_suborg_code_4);
//    							stampNumberById('td2-' + 'cost' + '-' + (i+1), rec[4]/100000000, '0,000.0');
    									
    					}//endof for
    					 
    					//Ext.getBody().unmask();
    					
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
    					
    					me.requestcomplete();
    				}
    			}); //

    	
    },

    redrawRealChart: function(c, c1, c2, dataReal, dataTarget, categories) {
    	
    	console_logs('redrawRealChart c', c);
    	console_logs('redrawRealChart c1', c1);
    	console_logs('redrawRealChart c2', c2);
    	console_logs('redrawRealChart dataReal', dataReal);
    	console_logs('redrawRealChart dataTarget', dataTarget);
    	console_logs('redrawRealChart categories', categories);

    	var o = new Highcharts.Chart({
        	chart: c,
        	spacingTop:50,
        	animation: Highcharts.svg, // don't animate in old IE
        	title: {
	    	            text: ''
	    	},
	        subtitle: {
	            //text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
	        },
	        xAxis: {
	        	labels: {
       			 rotation: 0
		        },
	                categories: categories
	        },
            yAxis: {
            	visible: false,
                title: {
                    text: '생산량'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
	        plotOptions: {
	        	series: {
	        		fillOpacity: 0.1,
	        		animation: { duration: 200  },
			        pointPadding: 0, // Defaults to 0.1
			        groupPadding: 0.05 // Defaults to 0.2
			    },
			    area: {
	                fillOpacity: 0.5
	            },
	            column: {
	            	colors: [],
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
	        //series: series
	        series: [{
	            name: '실적',
	            data: dataReal,
	            color: c1,
	            type: 'column'
	        }, {
	            name: '목표',
	            data: dataTarget,
	            type: 'area',
	            color: c2
	        }]
	    });

		return o;
    },
    // W/O
    redrawTotalChart31: function() {
    	TOTAL_PARAMS['cubeCode'] = 'MES_PO';
    	TOTAL_PARAMS['projectChartType'] = 'DAY_PO_CNT_KWLM'; //'DAY_PO_CNT';
    	console_logs('redrawTotalChart31', TOTAL_PARAMS);
    	var date_e = Ext.Date.format(new Date,'Ymd');
    	var date_s = Ext.Date.add(new Date(), Ext.Date.DAY, -5);
    	date_s = Ext.Date.format(date_s, 'Ymd');
    	TOTAL_PARAMS['projectTotal-s_date'] = date_s;
    	TOTAL_PARAMS['projectTotal-e_date'] = date_e;
    	var s = gColumnChartStyleSmall;
    	var me = this;
    	me.beforerequest();
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + /*'http://1.214.212.140:7080*/'/xdview/chart.do?method=getChart',
    		params:TOTAL_PARAMS,
    		
    		success: function(response, request) {
    			
    			me.requestcomplete();
    			
		    	var val = null;
    			var categories = null;
    	    	var real = null;
		    	try {
		    		val = Ext.JSON.decode(response.responseText);
		    	} catch(e) {} 

		    	if(val==null) {
		    		categories = ["10-13","10-14","10-15", "10-16", "10-17"];
		    		real = [0,0,0,0,0];
	    			s['renderTo'] ='projecttotal-south-east-center1-graph';
	    			s['type'] = 'column';
		    		//return;
		    	} else {
		    		categories = [];
		    		real = [];
	    			console_logs("val['series']", val['series']);
	    			console_logs("val['aXis']", val['aXis']);
	    			var arr = [];
	    			for(var i=0; i<val['aXis'].length; i++) {
	    				var b = val['aXis'][i].split(':');
	    				var c = b[0].substring(4,6) + '/' + b[0].substring(6,8);
	    				arr.push(c);
	    			}
	    			console_logs('arr', arr);
	    			s['renderTo'] ='projecttotal-south-east-center1-graph';
	    			s['type'] = 'column';

	    			for(var i=0; i<6; i++) {
	    				var date = gu.getNextday(-1 * 5 + i);
	    				date = Ext.Date.format(date, 'm/d');
	    				console_logs('=asdas=>d',date);
	    				categories.push(date);
	    			}
	    			console_logs('=====dd', categories);
	    	    	var toDate = new Date();
	    	    	console_logs('=====series31', val['series'][0]);
	    	    	console_logs('=====aXis31', val['aXis']);
	    	    	console_logs('=====arr31', arr);
	    	    	var q=0;
	    	    	for(var i=0; i<categories.length; i++) {
	    	    		if(arr[q] == categories[i]) {
	    	    			console_logs('arr-ca', arr[q] + ',' + categories[i]);
	    	    			real.push(val['series'][0].data[q]);
	    	    			q++;
	    	    		} else {
	    	    			console_logs('nos', categories[i]);
	    	    			real.push(0);
	    	    		}
	    	    	}
		    	}
		    	
    	    	ocProjectTotalEastSouth1 = me.redrawRealChart(s, '#B0D698', '#3493DF', real, '', categories);
    	    	ocProjectTotalEastSouth1.setSize( eastSouth1Width,   eastSouth1Height, false);   
    			ocProjectTotalEastSouth1.reflow();
    			gUtil.sleep(1250);
//    			ocProjectTotalEastSouth1 = this.redrawRealChart(s, '#B0D698', '#3493DF', [val['series']], [500], categories);
    		},
	    	failure:function(result, request) {
	    		me.requestcomplete();
			}
    });
		this.redrawTotalChart32();
    },
    
    redrawTotalChart32: function () {
    	TOTAL_PARAMS['cubeCode'] = 'PURCHASE_ORDER'; //'MES_PRECESS';
    	TOTAL_PARAMS['projectChartType'] = 'DAY_PO_CNT_KWLM'; //'DAY_PO_CNT';
//    	TOTAL_PARAMS['serial_no'] = 1;
    	
    	console_logs('redrawTotalChart32', TOTAL_PARAMS);
    	var date_e = Ext.Date.format(new Date,'Ymd');
    	var date_s = Ext.Date.add(new Date(), Ext.Date.DAY, -5);
    	date_s = Ext.Date.format(date_s, 'Ymd');
    	TOTAL_PARAMS['projectTotal-s_date'] = date_s;
    	TOTAL_PARAMS['projectTotal-e_date'] = date_e;
    	var s = gColumnChartStyleSmall;
    	var me = this;
    	me.beforerequest();
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + /*'http://1.214.212.140:7080*/'/xdview/chart.do?method=getChart&serial_no=1',
    		params: TOTAL_PARAMS,
    		success: function(response, request) {
    			me.requestcomplete();
		    	var val = null;
		    	try {
		    		val = Ext.JSON.decode(response.responseText);
		    	} catch(e) {} 

		    	if(val==null) {
//		    		categories = ["10-13","10-14","10-15", "10-16", "10-17"];
//		    		real = [0,0,0,1,0];
//	    			s['renderTo'] ='projecttotal-south-east-center2-graph';
//	    			s['type'] = 'column';
		    		return null;
		    	} else {
		    		console_logs("val['series']", val['series']);
	    			console_logs("val['aXis']", val['aXis']);
	    			var arr = [];
	    			for(var i=0; i<val['aXis'].length; i++) {
	    				var b = val['aXis'][i].split(':');
	    				var c = b[0].substring(4,6) + '/' + b[0].substring(6,8);
	    				arr.push(c);
	    			}
	    			console_logs('arr', arr);
	    			
	    			s['renderTo'] ='projecttotal-south-east-center2-graph';
	    			s['type'] = 'column';
	    			var categories = [];
	    			for(var i=0; i<6; i++) {
	    				var date = gu.getNextday(-1 * 5 + i);
	    				date = Ext.Date.format(date, 'm/d');
	    				console_logs('=asdas=>d',date);
	    				categories.push(date);
	    			}
	    			console_logs('=====dd', categories);
	    	    	var toDate = new Date();
	    	    	var real = [];
	    	    	console_logs('=====series', val['series'][0]);
	    	    	console_logs('=====aXis', val['aXis']);
	    	    	console_logs('=====arr', arr);
	    	    	var q=0;
	    	    	for(var i=0; i<categories.length; i++) {
	    	    		if(arr[q] == categories[i]) {
	    	    			console_logs('arr-ca', arr[q] + ',' + categories[i]);
	    	    			real.push(val['series'][0].data[q]);
	    	    			q++;
	    	    		} else {
	    	    			console_logs('nos', categories[i]);
	    	    			real.push(0);
	    	    		}
	    	    	}
	    	    	
		    	}
    			
    	    	ocProjectTotalEastSouth2 = me.redrawRealChart(s, '#FF9655', '#FFF263', real, '', categories);
    	    	ocProjectTotalEastSouth2.setSize( eastSouth2Width,   eastSouth2Height, false);   
    	        ocProjectTotalEastSouth2.reflow();
    			gUtil.sleep(1250);
    			var realValue = [];
//    			ocProjectTotalEastSouth1 = this.redrawRealChart(s, '#B0D698', '#3493DF', [val['series']], [500], categories);
    		},
	    	failure:function(result, request) {
	    		me.requestcomplete();
				//me.setLoading(false);
			}
    });
		this.redrawTotalChart33();
    		
    },
    redrawTotalChart33: function() {
    	TOTAL_PARAMS['cubeCode'] = 'PURCHASE_ORDER'; //'MES_PRECESS';
    	TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL33';
//    	TOTAL_PARAMS['serial_no'] = 2;
    	console_logs('redrawTotalChart33', TOTAL_PARAMS);
    	var date_e = Ext.Date.format(new Date,'Ymd');
    	var date_s = Ext.Date.add(new Date(), Ext.Date.DAY, -5);
    	date_s = Ext.Date.format(date_s, 'Ymd');
    	TOTAL_PARAMS['projectTotal-s_date'] = date_s;
    	TOTAL_PARAMS['projectTotal-e_date'] = date_e;
    	var s = gColumnChartStyleSmall;
    	var me = this;
    	me.beforerequest();
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + /*'http://1.214.212.140:7080*/'/xdview/chart.do?method=getChart&serial_no=2',
    		params:	TOTAL_PARAMS,
    		success: function(response, request) {
    			me.requestcomplete();
		    	var val = null;
		    	try {
		    		val = Ext.JSON.decode(response.responseText);
		    	} catch(e) {} 

		    	if(val==null) {
//		    		categories = ["10-13","10-14","10-15", "10-16", "10-17"];
//		    		real = [45,22,33,22,30];
	    			s['renderTo'] ='projecttotal-south-east-center3-graph';
	    			s['type'] = 'column';
		    		//return null;
		    	} else {
	    			console_logs("val['series']", val['series']);
	    			console_logs("val['aXis']", val['aXis']);
	    			var arr = [];
	    			for(var i=0; i<val['aXis'].length; i++) {
	    				var b = val['aXis'][i].split(':');
	    				var c = b[0].substring(4,6) + '/' + b[0].substring(6,8);
	    				arr.push(c);
	    			}
	    			console_logs('arr33', arr);
	    			
	    	        s['renderTo'] ='projecttotal-south-east-center3-graph';
	    	        s['type'] = 'column';
	    	        var categories = [];
	    			for(var i=0; i<6; i++) {
	    				var date = gu.getNextday(-1 * 5 + i);
	    				date = Ext.Date.format(date, 'm/d');
	    				console_logs('=asdas=>d',date);
	    				categories.push(date);
	    			}
	    			console_logs('=====dd', categories);
	    	    	var toDate = new Date();
	    	    	var real = [];
	    	    	console_logs('=====series33', val['series'][0]);
	    	    	console_logs('=====aXis33', val['aXis']);
	    	    	console_logs('=====arr33', arr);
	    	    	var q=0;
	    	    	for(var i=0; i<categories.length; i++) {
	    	    		if(arr[q] == categories[i]) {
	    	    			console_logs('arr-ca33', arr[q] + ',' + categories[i]);
	    	    			console_logs('arr-se33', val['series'][0].data[q]);
	    	    			real.push(val['series'][0].data[q]);
	    	    			q++;
	    	    		} else {
	    	    			console_logs('nos', categories[i]);
	    	    			real.push(0);
	    	    		}
	    	    	}
	    	    	console_logs('check1 33', categories);
	    	    	console_logs('check2 33', real);
		    	}
    	    	ocProjectTotalEastSouth3 = me.redrawRealChart(s, '#979797', '#AA4643', real, '', categories);
    	        ocProjectTotalEastSouth3.setSize( eastSouth3Width,   eastSouth3Height, false);   
    	        ocProjectTotalEastSouth3.reflow();
    			gUtil.sleep(1250);
    		},
    		failure:function(result, request) {
    			me.requestcomplete();
			}
    	});
    	
		this.redrawTotalChart34();
    },
    
    redrawTotalChart34: function() {
    	TOTAL_PARAMS['cubeCode'] = 'PURCHASE_ORDER'; //'MES_PRECESS';
    	TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL34';
//    	TOTAL_PARAMS['serial_no'] = 3;
    	console_logs('redrawTotalChart34', TOTAL_PARAMS);
    	var date_e = Ext.Date.format(new Date,'Ymd');
    	var date_s = Ext.Date.add(new Date(), Ext.Date.DAY, -5);
    	date_s = Ext.Date.format(date_s, 'Ymd');
    	TOTAL_PARAMS['projectTotal-s_date'] = date_s;
    	TOTAL_PARAMS['projectTotal-e_date'] = date_e;
    	var s = gColumnChartStyleSmall;
    	var me = this;
    	me.beforerequest();
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + /*'http://1.214.212.140:7080*/'/xdview/chart.do?method=getChart&serial_no=3',
    		params: TOTAL_PARAMS,
    		success: function(response, request) {
    			me.requestcomplete();
		    	var val = null;
		    	try {
		    		val = Ext.JSON.decode(response.responseText);
		    	} catch(e) {} 

		    	if(val==null) {
//		    		categories = ["10-13","10-14","10-15", "10-16", "10-17"];
//		    		real = [344,32,33,100,120];
	    			s['renderTo'] ='projecttotal-south-east-center4-graph';
	    			s['type'] = 'column';
		    	} else {
		    		console_logs("val['series']34", val['series']);
	    			console_logs("val['aXis']", val['aXis']);
	    			var arr = [];
	    			for(var i=0; i<val['aXis'].length; i++) {
	    				var b = val['aXis'][i].split(':');
	    				var c = b[0].substring(4,6) + '/' + b[0].substring(6,8);
	    				arr.push(c);
	    			}
	    			console_logs('arr', arr);
	    			
	    	        s['renderTo'] ='projecttotal-south-east-center4-graph';
	    	        s['type'] = 'column';
	    	        var categories = [];
	    			for(var i=0; i<6; i++) {
	    				var date = gu.getNextday(-1 * 5 + i);
	    				date = Ext.Date.format(date, 'm/d');
	    				console_logs('=asdas=>d',date);
	    				categories.push(date);
	    			}
	    			console_logs('=====dd', categories);
	    	    	var toDate = new Date();
	    	    	var real = [];
	    	    	console_logs('=====series', val['series'][0]);
	    	    	console_logs('=====aXis', val['aXis']);
	    	    	console_logs('=====arr', arr);
	    	    	var q=0;
	    	    	for(var i=0; i<categories.length; i++) {
	    	    		if(arr[q] == categories[i]) {
	    	    			console_logs('arr-ca', arr[q] + ',' + categories[i]);
	    	    			real.push(val['series'][0].data[q]);
	    	    			q++;
	    	    		} else {
	    	    			console_logs('nos', categories[i]);
	    	    			real.push(0);
	    	    		}
	    	    	}
		    	}
    			
    	    	ocProjectTotalEastSouth4 = me.redrawRealChart(s, '#084695', '#D39324', real, '', categories);
    	        ocProjectTotalEastSouth4.setSize( eastSouth4Width,   eastSouth4Height, false);   
    	        ocProjectTotalEastSouth4.reflow();
    			gUtil.sleep(1250);
    		},
    		failure:function(result, request) {
    			me.requestcomplete();
			}
    	});
    },
    redrawTotalChart3: function() {

    	
    	//console_logs('start', 'redrawTotalChart3');
    	
    	var thisMon = Ext.getCmp('projectTotal-Month').getValue();
    	console_logs('thisMon', thisMon);
    		
    	var y = thisMon.substring(0,4);
    	var m = thisMon.substring(6,8);
    	
    	var l = y + '-' + m + '-' + '01';
    	console_logs('l', l);
    	
    	var myDate = Ext.Date.parse(l, 'Y-m-d');
    	console_logs('myDate', myDate);
        myDate.setMonth(myDate.getMonth()-1);
        var prevMonth = Ext.Date.format(myDate, 'Y년 m월');
        
        myDate.setMonth(myDate.getMonth()-11);
        var prevYear = Ext.Date.format(myDate, 'Y년 m월');
        
        var currentDate = Ext.Date.format(new Date(), 'Y-m-d');
        console_logs('currentDate', currentDate);
        //console_logs('prevMonth', prevMonth);
    	//console_logs('prevYear', prevYear);
        
    	var monthList = [];
    	var dayList = [];
    	
    	for(var i=0; i<6; i++) {
    		var yesterday = Ext.Date.add(new Date(), Ext.Date.DAY, -5+i);
    		var currentDate = Ext.Date.format(yesterday, 'Y-m-d');
    		dayList.push(currentDate);
    	};
    	monthList.push(prevYear);
    	monthList.push(prevMonth);
    	monthList.push(thisMon);
    	
    	
    	TOTAL_PARAMS['projectTotal-Day-arr'] = dayList;
    	TOTAL_PARAMS['cubeCode'] = 'PURCHASE_ORDER'; //'MES_PRECESS';
    	TOTAL_PARAMS['projectTotal-SearchType'] = '인원수';


    	this.redrawTotalChart31();

    },
});