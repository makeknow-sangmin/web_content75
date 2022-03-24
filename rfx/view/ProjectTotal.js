function redrawTotalChartAll() {
//	Ext.getBody().mask("잠시만 기다려주세요.");
	gUtil.redrawTotalChartAll();
}

Ext.define('Rfx.view.ProjectTotal', {
    extend: (vSYSTEM_TYPE == 'HANARO') ? 'Hanaro.base.HanaroBasePanel' : 'Rfx.base.BasePanel',
    alias: 'widget.projectTotal',
    
    oSumMainTab1_pre: 0,
    oSumMainTab1_mass: 0,
    oSumMainTab1_common: 0,
    oSumMainTab1_etc: 0,
	oSumMainTab1_total: 0,

    
    createToolbar: function(){

        var items = [],
            config = {};
        if (!this.inTab) {
         
			items.push({
			       emptyText: '',
			       hidden: true,
			       fieldStyle: 'background-color: #D6E8F6; background-image: none;',
	               xtype:          'combo',
	               id: 'projectTotal-Month',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          TOTAL_PARAMS['projectTotal-Month'],
	               triggerAction:  'all',
	               store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'592', hasNull:false}),
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
				                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
				                //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
				            }
     	               }
	            }, 
				{
				    xtype:'tbtext',
				    text: "조회기간:",
				    style: 'color:white;'
				    
				 },
				{ 
					 id: 'projectTotal-s_date',
		                name: 's_date',
		                format: 'Y-m-d',
		              fieldStyle: 'background-color: #D6E8F6; background-image: none;',
				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
					    	allowBlank: true,
					    	xtype: 'datefield',
					    	value: gUtil.getNextday(-6),
					    	width: 100,
							listeners: {
					            change: {
					                fn:function(field, newValue, oldValue){
					                	console_logs('change v', field);
					                	console_logs('change newValue', newValue);
					                	console_logs('change oldValue', oldValue);
					                }
					            }
					        }
					},
					{
						xtype:'label',
					    text: "~",
					    style: 'color:white;'
					    
					 },
					{ 
						 id: 'projectTotal-e_date',
		                name: 'e_date',
		                format: 'Y-m-d',
		                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
					    	allowBlank: true,
					    	xtype: 'datefield',
					    	value: new Date(),
					    	width: 99,
							listeners: {
					            change: {
					                fn:function(field, newValue, oldValue){
					                	console_logs('change v', field);
					                	console_logs('change newValue', newValue);
					                	console_logs('change oldValue', oldValue);
					                }
					            }
					        }
					}, '-');

	        items.push({
	        	xtype: 'component',
	            html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawTotalChartAll();"></button></span></div>'
	        });
			items.push('->');
			
			
			if(vSYSTEM_TYPE != 'HANARO') {
	        items.push({
					xtype : 'checkbox',
					id : 'chkAuto-project-total',
					boxLabel : '<font color=white>화면유지</font>',
					tip: '작업화면을 유지하면 편리하지만 메모리를 많이 소모합니다.',
					checked: gMain.getSaveAutoRefresh(),
					listeners: {
							change: function(field, newValue, oldValue, eOpts){
								gMain.checkRefresh(newValue);
							},
							render: function(c) {
								Ext.create('Ext.tip.ToolTip', {
									target: c.getEl(),
									html: c.tip
								});
							}
					}
				},
				
				'-');
			}

	        items.push({
				xtype : 'checkbox',
				id : 'chkOpenCrud-project-total',
				boxLabel : '<font color=white>자동 창열기</font>',
				tip: '상세보기 창을 자동으로 엽니다.',
				checked: gMain.getOpenCrudWindow(),
				listeners: {
			            change: function(field, newValue, oldValue, eOpts){
			            	console_logs('field', field);
			            	console_logs('oldValue', oldValue);
			            	console_logs('newValue', newValue);
			            	console_logs('eOpts', eOpts);
			            	
			            	gMain.checkOpenCrudWindow(newValue);
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
	            html: '<div class="searchcon" onClick="openNewWindow();" title="새로운 탭화면 열기"><span class="newwinBT"></span></div>'
	        });
	        config.items = items;
            
        }
        else {
            config.cls = 'x-docked-border-bottom';
        }
        config.cls = 'my-x-toolbar-default';
        return Ext.create('widget.toolbar', config);

    },
    initComponent: function(){
        Ext.apply(this, {
        	contentEl: 'costPagelayout'
        });
        this.callParent(arguments);
        
        this.redrawTotalChartAll();
	},
    redrawTotalChartAll: function() {
		start_date = new Date();
		console.log('>>>>>>>> start_date',start_date);

    	//this.redrawMainTable2();
    	this.redrawTotalChart1();
    	this.redrawTotalChart2();
    	this.redrawTotalChart3();
    	
    },
    getMonthDay: function(d) {
    	var m = (d.getMonth()+1) + '';
    	var d = (d.getDate()) + '';
    	
    	return m + '/' + d;
    },
    
    redrawTotalChart1: function () {
    	    	
    	TOTAL_PARAMS['cubeCode'] = 'MES_PRECESS';
    	TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL1_DABP';
    	
    	console_logs('redrawTotalChart1', TOTAL_PARAMS);
    	
    	
    	var s_date = Ext.getCmp('projectTotal-s_date').getValue();
    	var e_date = Ext.getCmp('projectTotal-e_date').getValue();
    	
    	
    	console_logs('s_date', s_date);
    	console_logs('e_date', e_date);
    	
    	TOTAL_PARAMS['projectTotal-s_date'] = gUtil.yyyymmdd(s_date, '');
    	TOTAL_PARAMS['projectTotal-e_date'] = gUtil.yyyymmdd(e_date, '');
    	
    	//this.setLoading(true);
	 	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
			params:TOTAL_PARAMS,
			success : function(response, request) {
		    	
				//this.setLoading(false);
				//console_logs('redrawTotalChart1', response.responseText);
				var s = response.responseText;
				var val = null;
				try {
					val = Ext.JSON.decode(response.responseText);
				} catch(e) {'/xdview/chart.do?method=getChart response decode', e}

				if(val==null) {
					return;
				}

				var cat = val['aXis'];
				
				console_logs('redrawTotalChart1 cat',cat);
				
				var aXis = [];
				var aXis1 = [];
				for(var i=0; i<cat.length; i++) {
					var res = cat[i].split(":");
					var name = res[1];
					aXis.push( name.substring(4,6) + '월 ' + name.substring(6,8) + '일') ;
					aXis1.push( name.substring(4,6) + '/' + name.substring(6,8)) ;
					
				}
				//
				var series = val['series'];
				console_logs('redrawTotalChart1 series', series);
				
		    	gUtil.setTable1Date1(aXis1);
				gUtil.setMainTable1Value(series);
				
    					
				var sProjectTotalEastNorth = gColumnChartStyle;
	            sProjectTotalEastNorth['renderTo'] ='projecttotal-east-north-graph';
	            sProjectTotalEastNorth['type'] = 'column';
	             ocProjectTotalEastNorth = new Highcharts.Chart({

    			    chart: sProjectTotalEastNorth,
    			    
    				title: {
    	    	            text: '<div class="title02"><span>제품 별</span> 생산추이(만 건)</div>',
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
//    	    	    	   [{
//    	    	               name: '10-치킨',
//    	    	               data: [17.0, 26.9, 39.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3,
//    	    	                      17.0, 1.9, 1.5, 14.5, 1.4, 21.5, 25.2, 2.5, 2.3, 18.3,
//    	    	                      17.0, 26.9, 39.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3
//    	    	                      ]
//    	    	           }, {
//    	    	               name: '20-피자',
//    	    	               data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
//    	    	           }, {
//    	    	               name: '30-농수산물',
//    	    	               data: [0,0,0,0,0,0,0,0,0,0,0,3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
//    	    	           }, {
//    	    	               name: '40-공산품',
//    	    	               data: [0,0,3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
//    	    	           }, {
//    	    	               name: '50-기타',
//    	    	               data: [0,0,0,0,0,0,0,0,3.9,0, 4.2,0, 5.7, 8.5, 0,11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
//    	    	           }]
    	    	    });

    	        	ocProjectTotalEastNorth.setSize(  eastCenterWidth,   eastCenterHeight,  false    );   
    				ocProjectTotalEastNorth.reflow();
    					
    			},// endof success for ajax
    			failure:function(result, request) {
    				//this.setLoading(false);
    			}
    		}); // endof Ajax
    	
    },

    redrawTotalChart2: function() {

    	TOTAL_PARAMS['cubeCode'] = 'MES_PRECESS';
    	TOTAL_PARAMS['projectChartType'] = 'PJ_TOTAL2';
//    	TOTAL_PARAMS['projectTotal-SearchType'] = '인원수';
//    	TOTAL_PARAMS['projectTotal-Month-arr'] = null;
//    	TOTAL_PARAMS['projectTotal-SearchOrg'] = null;
//    	TOTAL_PARAMS['projectTotal-Month'] = Ext.getCmp('projectTotal-Month').getValue();
    	var s_date = Ext.getCmp('projectTotal-s_date').getValue();
    	var e_date = Ext.getCmp('projectTotal-e_date').getValue();
    	
//    	console_logs('s_date', s_date);
//    	console_logs('e_date', e_date);
    	
    	TOTAL_PARAMS['projectTotal-s_date'] = gUtil.yyyymmdd(s_date, '');
    	TOTAL_PARAMS['projectTotal-e_date'] = gUtil.yyyymmdd(e_date, '');   	
    	////this.setLoading(true);
    	
     	Ext.Ajax.request({
    			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
    			params:TOTAL_PARAMS,
    			success : function(response, request) {
    				
    				console_logs('redrawTotalChart2', response.responseText);
					var s = response.responseText;
					var val = null;
					try {
						val = Ext.JSON.decode(response.responseText);
					} catch(e) {'redrawTotalChart2 /xdview/chart.do?method=getChart response decode', e}
					if(val==null) {
						return;
					}
    				
    				//var val = Ext.JSON.decode(response.responseText);
    				//console_logs("val['series']", val['series']);
    				//console_logs("val['aXis']", val['aXis']);
    				var cat = val['aXis'];
    				var aXis = [];
    				for(var i=0; i<cat.length; i++) {
    					var res = cat[i].split(":");
    					var name = res[1];
    					aXis.push( name.substring(4,6) + '월 ' + name.substring(6,8) + '일') ;
    					
    				}
    				
    				//console_logs('redrawTotalChart2 cat', cat);
    				//console_logs('redrawTotalChart2 aXis', aXis);
    				
    				//var arr = [];
    				//var aXis = [];
    				
    				var series = val['series'];
    				
    				gUtil.setTable2Value(val['sorted']);
    				
    				//console_logs('redrawTotalChart2 series', series);
    				//arrangeColor(series);
    				
    				//moveNullPos(cat, series, aXis,arr);


    	   
           var sProjectTotalEastCenter = gColumnChartStyle;
            sProjectTotalEastCenter['renderTo'] ='projecttotal-east-center-graph';
            
            //sProjectTotalEastCenter['type'] = 'line';
            ocProjectTotalEastCenter = new Highcharts.Chart({

    			    chart: sProjectTotalEastCenter,
    			    
    				title: {
	    	            text: '<div class="title02"><span>' + '공정별' + '</span> 생산지표 ' + '</div>',    	    	            margin: 5,
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
       	        			 rotation: 0
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
    	    	            align: 'right',
    	    	            x: -30,
    	    	            verticalAlign: 'top',
    	    	            y: 15,
    	    	            floating: true,
    	    	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
    	    	            borderColor: '#CCC',
    	    	            borderWidth: 0,
    	    	            shadow: false
    	    	        },
    	    	        tooltip: {
    	    	            headerFormat: '<b>{point.x}</b><br/>',
    	    	            pointFormat: '{series.name}: {point.y:,.1f}<br />합계: {point.stackTotal:,.1f}'
    	    	        },
    	    	        plotOptions: {
    	    	            column: {
    	    	            	  pointPadding: 0.1,
    	    	                  borderWidth: 0,
    	    	                  groupPadding: 0,
    	    	                  shadow: false
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
    		            	//this.setLoading(false);
    		            	//$(window.document.location).attr("href", "/xdview/index.do?method=main");
    		            }
    		        });
    			}
    		}); // endof Ajax			
    			
    },
    redrawMainTable1: function(col, arrS, posTable1) {

    console_logs('redrawMainTable1 col', col);
    console_logs('redrawMainTable1 arrS', arrS);
    console_logs('redrawMainTable1 posTable1', posTable1);
    	
    	if(col=='research') { //첫 column
    		this.oSumMainTab1_pre = 0;
    		this.oSumMainTab1_mass = 0;
    		this.oSumMainTab1_common = 0;
    		this.oSumMainTab1_etc = 0;
    		this.oSumMainTab1_total = 0;
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
    	
    	
    	TOTAL_PARAMS['cubeCode'] = 'MES_PRECESS';
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
    					
    					Ext.getBody().unmask();
    					
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

    	
    },

    redrawRealChart: function(c, c1, c2, pos) {

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
                type: 'datetime',
                tickPixelInterval: 100
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
	                fillOpacity: 0.5,
	                linecap: 'square',
                    lineWidth:3,
                    marker:{
                        enabled:false
                    }
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
	            data: gUtil.createRandDataReal(pos),
	            color: c1,
	            type: 'column'
	        }, {
	            name: '목표',
	            data: gUtil.createRandDataTarget(pos),
	            type: 'area',
	            color: c2
	        }]
	    });

		return o;
    },
    
    redrawTotalChart31: function() {

    	var s = gColumnChartStyleSmall;
        s['renderTo'] ='projecttotal-south-east-center1-graph';
        s['type'] = 'column';
        s['events'] = {
            load: function() {
            	gUtil.startFc();
            	gUtil.loadFc(this, 0);
            }
        };
        ocProjectTotalEastSouth1 = this.redrawRealChart(s, '#B0D698', '#3493DF', 0);
        ocProjectTotalEastSouth1.setSize( eastSouth1Width,   eastSouth1Height, false);   
        ocProjectTotalEastSouth1.reflow();
		gUtil.sleep(1250);
		
		this.redrawTotalChart32();
    },
    
    redrawTotalChart32: function () {
    	
    	var s = gColumnChartStyleSmall;
        s['renderTo'] ='projecttotal-south-east-center2-graph';
        s['type'] = 'column';
        s['events'] = {
            load: function() {
            	gUtil.loadFc(this, 1);
            }
        };
        
        ocProjectTotalEastSouth2 = this.redrawRealChart(s, '#FF9655', '#FFF263', 1);
        ocProjectTotalEastSouth2.setSize( eastSouth2Width,   eastSouth2Height, false);   
        ocProjectTotalEastSouth2.reflow();
		gUtil.sleep(1250);
		
		this.redrawTotalChart33();
    		
    },
    redrawTotalChart33: function() {
    	
    	var s = gColumnChartStyleSmall;
        s['renderTo'] ='projecttotal-south-east-center3-graph';
        s['type'] = 'column';
        s['events'] = {
            load: function() {
            	gUtil.loadFc(this, 2);
            }
        };
        
        ocProjectTotalEastSouth3 = this.redrawRealChart(s, '#979797', '#AA4643', 2);
        ocProjectTotalEastSouth3.setSize( eastSouth3Width,   eastSouth3Height, false);   
        ocProjectTotalEastSouth3.reflow();
		gUtil.sleep(1250);
		
		this.redrawTotalChart34();
    },
    
    redrawTotalChart34: function() {
    	
    	var s = gColumnChartStyleSmall;
        s['renderTo'] ='projecttotal-south-east-center4-graph';
        s['type'] = 'column';
        s['events'] = {
            load: function() {
            	gUtil.loadFc(this, 3);
            }
        };
        
        ocProjectTotalEastSouth4 = this.redrawRealChart(s, '#084695', '#D39324', 3);
        ocProjectTotalEastSouth4.setSize( eastSouth4Width,   eastSouth4Height, false);   
        ocProjectTotalEastSouth4.reflow();
	
    		
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
        
        //console_logs('prevMonth', prevMonth);
    	//console_logs('prevYear', prevYear);

    	var monthList = [];
    	monthList.push(prevYear);
    	monthList.push(prevMonth);
    	monthList.push(thisMon);
    	
    	TOTAL_PARAMS['projectTotal-Month-arr'] = monthList;
    	TOTAL_PARAMS['cubeCode'] = 'MES_PRECESS';
    	TOTAL_PARAMS['projectTotal-SearchType'] = '인원수';


		this.redrawTotalChart31();
		end_date = new Date();
		console.log('>>>> end_date',end_date);
		var elapsedTime = end_date - start_date;
		console.log('>>>> elapsed_time(ms)',elapsedTime);
    }


});