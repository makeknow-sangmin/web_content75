function redrawTotalChartAll() {
//	Ext.getBody().mask("잠시만 기다려주세요.");
	gUtil.redrawTotalChartAll();
}

Ext.define('Rfx.view.ProjectTotalHsg', {
    extend: 'Rfx.view.ProjectTotalHeavy',
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
					    	value: gUtil.getNextday(-31),
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
    	this.redrawMainTable2();
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
    	TOTAL_PARAMS['projectChartType'] = 'KY_PO_DAY_CNT';
//    	TOTAL_PARAMS['projectTotal-Month'] = '2017년 04월';
//    	TOTAL_PARAMS['serial_no'] = 1;
    	console_logs('redrawTotalChart1', TOTAL_PARAMS);

//    	
//    	TOTAL_PARAMS['projectTotal-s_date'] = '';
//    	TOTAL_PARAMS['projectTotal-e_date'] = '';
/*    	var s_date = Ext.getCmp('projectTotal-s_date').getValue();
    	var e_date = Ext.getCmp('projectTotal-e_date').getValue();
    	var today = new Date();
    	
    	s_date = Ext.Date.format(new Date(), 'Ymd');
    	s_date = s_date.substring(0,6) + '01';
    	e_date = new Date(today.getFullYear(), today.getMonth()+1, 0);
    	e_date = Ext.Date.format(e_date, 'Ymd');*/

		var today = new Date();

        var s_date = new Date(today - (105 + today.getDay()) * 1000 * 60 * 60 * 24);
        var e_date = new Date(today - (today.getDay() + 1) * 1000 * 60 * 60 * 24);

        TOTAL_PARAMS['projectTotal-s_date'] = gUtil.yyyymmdd(s_date, '');
    	TOTAL_PARAMS['projectTotal-e_date'] = gUtil.yyyymmdd(e_date, '');
    	
    	//this.setLoading(true);
	 	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart&serial_no=1',				
			params:TOTAL_PARAMS,
			success : function(response, request) {
				
				console_logs('==redrawTotalChart1', response.responseText);
		    	var arr = TOTAL_PARAMS['projectTotal-Day-arr']
		    	console_logs('==arr', arr.length);
		    	
		    	var val = null;
		    	try {
		    		val = Ext.JSON.decode(response.responseText);
		    	} catch(e) {} 

		    	if(val==null) {
		    		return;
		    	}
			
				console_logs("val['series']11", val['series']);
				console_logs("val['aXis']", val['aXis']);
				var cat = val['aXis'];
				var aXis = [];
				var aXis1 = [];
				var r = [];
				for(var i = 0; i < cat.length; i++) {
					var res = cat[i].split(":");
					var name = res[1];
					var l = name.length;
					res = res[0].substring(4,8);
					r.push(res);
				}
				
				var today = new Date();
				var last = new Date(today.getFullYear(), today.getMonth()+1, 0);

			    for(var i = 0; i < 15; i++) {
                    var d = gu.getNextday(today.getDay() - 16 + i);
                    d = Ext.Date.format(d, 'm/d');
                    aXis.push(d);
                }
				
				var series = val['series'];
				var s = [];
				for(var i = 0; i < r.length; i++) {
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
							data.push(Math.random() * 10 + 90);
						}
					
				}
				var datas = [{
						
						data: data,
						name: 'value'
							
				}];
				
				console_logs('redrawTotalChart1 series', series);
				
				gUtil.setTable1Date1(aXis);
				gUtil.setMainTable1Value(datas);
				
				var sProjectTotalEastNorth = gColumnChartStyle;
	            sProjectTotalEastNorth['renderTo'] ='projecttotal-east-north-graph';
	            sProjectTotalEastNorth['type'] = 'line';
	             ocProjectTotalEastNorth = new Highcharts.Chart({

    			    chart: sProjectTotalEastNorth,
    			    
    				title: {
    						text: '<div class="title02"><span>' + '납기달성율' + '</span>' + '</div>',
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
    	    	            min: 80,
                            max: 100,
    	    	            visible: true,
    	    	            title: {
    	    	                text: '달성율'
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
    		                enabled: false
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
                            pointFormat: '달성율: {point.y:,.1f}<br />중량: ' + Math.round(Math.random() * 10000 + 100) +
                            '<!--{point.stackTotal:,.1f}--><br />수량: ' + Math.round(Math.random() * 10 + 5)  + '<!--{point.stackTotal:,.1f}-->'
							/*'{series.name}: {point.y:,.1f}<br />합계: {point.stackTotal:,.1f}'*/
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
    	    	            },
							 line: {
								 color: '#29598b',
								 lineWidth: 2
							 }
    	    	        },
    	    	       series: datas
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

    	TOTAL_PARAMS['cubeCode'] = 'MES_PO';
    	TOTAL_PARAMS['projectChartType'] = 'KY_PO_DAY_CNT';
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
    	
     	Ext.Ajax.request({
    			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
    			params:TOTAL_PARAMS,
    			success : function(response, request) {
    				
    				console_logs('redrawTotalChart2', response.responseText);
    				//this.setLoading(false);
    				
    		    	var val = null;
    		    	try {
    		    		val = Ext.JSON.decode(response.responseText);
    		    	} catch(e) {} 

    		    	if(val==null) {
    		    		return;
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

                    for(var i = 0; i < 15; i++) {
                        var d = gu.getNextday(today.getDay() - 16 + i);
                        d = Ext.Date.format(d, 'm/d');
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
    							data.push(Math.random() * 10 + 90);
    						}
    					
    				}
    				var datas = [{
    						
    						data: data,
    						name: 'value'
    							
    				}];
    				
    				console_logs('redrawTotalChart1 series', series);
    				
    				gUtil.setTable1Date1(aXis);
    				gUtil.setMainTable1Value(datas);
    				
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
	    	            text: '<div class="title02"><span>' + '생산량' + '</span>' + '</div>',
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
    	    	            min: 80,
							max: 100,
    	    	            visible: true,
    	    	            title: {
    	    	                text: '달성율'
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
							pointFormat: '달성율: {point.y:,.1f}<br />중량: ' + Math.round(Math.random() * 10000 + 100) +
							'<!--{point.stackTotal:,.1f}--><br />수량: ' + Math.round(Math.random() * 10 + 5)  + '<!--{point.stackTotal:,.1f}-->'
    	    	            //pointFormat: '{series.name}: {point.y:,f}'
    	    	        },
    	    	        plotOptions: {
    	    	            column: {
    	    	            	  pointPadding: 0.1,
    	    	                  borderWidth: 0,
    	    	                  groupPadding: 0,
    	    	                  shadow: false
    	    	            },
							line: {
    	    	            	color: '#29598b',
    	    	            	lineWidth: 2
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
    	 			url: CONTEXT_PATH + '/userMgmt/user.do?method=readgrids',				
    				params: 'joint=joint',
    				success : function(response, request) {
    					
    					var val = Ext.JSON.decode(response.responseText);
    					var records = val['datas'];
    					console_logs('===>records', records.length);
    					for(var i=0; i<records.length; i++) {
    							
    							var rec = records[i];  // 
    							console_logs('===>rec', rec);
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
    							console_logs('user_name==>', user_name_5);
    							
    							var ep_suborg_code_1 = rec['ep_suborg_code_1'];
    							var ep_suborg_code_2 = rec['ep_suborg_code_2'];
    							var ep_suborg_code_3 = rec['ep_suborg_code_3'];
//    							var ep_suborg_code_4 = rec['ep_suborg_code_4'];
    							var ep_suborg_code_5 = rec['ep_suborg_code_5'];
    							console_logs('ep_suborg_code_5==>', ep_suborg_code_5);
    							
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

    redrawRealChart: function(c, c1, c2, dataReal, dataTarget, categories) {

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
    	TOTAL_PARAMS['projectChartType'] = 'KY_PO_DAY_CNT';
    	console_logs('redrawTotalChart31', TOTAL_PARAMS);
    	var date_e = Ext.Date.format(new Date,'Ymd');
    	var date_s = Ext.Date.add(new Date(), Ext.Date.DAY, -5);
    	date_s = Ext.Date.format(date_s, 'Ymd');
    	TOTAL_PARAMS['projectTotal-s_date'] = date_s;
    	TOTAL_PARAMS['projectTotal-e_date'] = date_e;
    	var s = gColumnChartStyleSmall;
    	var me = this;
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',
    		params:TOTAL_PARAMS,
    		
    		success: function(response, request) {
		    	var val = null;
		    	try {
		    		val = Ext.JSON.decode(response.responseText);
		    	} catch(e) {} 

		    	if(val==null) {
		    		return;
		    	}
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

    			var today = new Date();

    			var categories = [];
    			for(var i = 0; i < 6; i++) {
    				var date = gu.getNextday(today.getDay() - 7 + i);
    				date = Ext.Date.format(date, 'm/d');
    				console_logs('=asdas=>d',date);
    				categories.push(date);
    			}
    			console_logs('=====dd', categories);
    	    	var toDate = new Date();
    	    	var real = [];
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
    	    			real.push(Math.random() * 5);
    	    		}
    	    	}
    	    	ocProjectTotalEastSouth1 = me.redrawRealChart(s, '#B0D698', '#3493DF', real, '', categories);
    	    	ocProjectTotalEastSouth1.setSize( eastSouth1Width,   eastSouth1Height, false);   
    			ocProjectTotalEastSouth1.reflow();
    			gUtil.sleep(1250);
//    			ocProjectTotalEastSouth1 = this.redrawRealChart(s, '#B0D698', '#3493DF', [val['series']], [500], categories);
    		},
	    	failure:function(result, request) {
				//this.setLoading(false);
			}
    });
		this.redrawTotalChart32();
    },
    
    redrawTotalChart32: function () {
    	TOTAL_PARAMS['cubeCode'] = 'MES_PRECESS';
    	TOTAL_PARAMS['projectChartType'] = 'KY_PO_DAY_CNT';
//    	TOTAL_PARAMS['serial_no'] = 1;
    	
    	console_logs('redrawTotalChart32', TOTAL_PARAMS);
    	var date_e = Ext.Date.format(new Date,'Ymd');
    	var date_s = Ext.Date.add(new Date(), Ext.Date.DAY, -5);
    	date_s = Ext.Date.format(date_s, 'Ymd');
    	TOTAL_PARAMS['projectTotal-s_date'] = date_s;
    	TOTAL_PARAMS['projectTotal-e_date'] = date_e;
    	var me = this;
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/xdview/chart.do?method=getChart&serial_no=1',
    		params: TOTAL_PARAMS,
    		success: function(response, request) {
		    	var val = null;
		    	try {
		    		val = Ext.JSON.decode(response.responseText);
		    	} catch(e) {} 

		    	if(val==null) {
		    		return;
		    	}
    			console_logs("val['series']", val['series']);
    			console_logs("val['aXis']", val['aXis']);
    			var arr = [];
    			for(var i=0; i<val['aXis'].length; i++) {
    				var b = val['aXis'][i].split(':');
    				var c = b[0].substring(4,6) + '/' + b[0].substring(6,8);
    				arr.push(c);
    			}
    			console_logs('arr', arr);
    			var s = gColumnChartStyleSmall;
    			s['renderTo'] ='projecttotal-south-east-center2-graph';
    			s['type'] = 'column';

                var today = new Date();

    			var categories = [];
    			for(var i=0; i<6; i++) {
                    var date = gu.getNextday(today.getDay() - 7 + i);
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
    	    			real.push(Math.random() * 5);
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
	    		console_logs('failure32', 'failure32');
				//this.setLoading(false);
			}
    });
		this.redrawTotalChart33();
    		
    },
    redrawTotalChart33: function() {
    	TOTAL_PARAMS['cubeCode'] = 'MES_PRECESS';
    	TOTAL_PARAMS['projectChartType'] = 'KY_PO_DAY_CNT';
//    	TOTAL_PARAMS['serial_no'] = 2;
    	console_logs('redrawTotalChart33', TOTAL_PARAMS);
    	var date_e = Ext.Date.format(new Date,'Ymd');
    	var date_s = Ext.Date.add(new Date(), Ext.Date.DAY, -5);
    	date_s = Ext.Date.format(date_s, 'Ymd');
    	TOTAL_PARAMS['projectTotal-s_date'] = date_s;
    	TOTAL_PARAMS['projectTotal-e_date'] = date_e;
    	var me = this;
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/xdview/chart.do?method=getChart&serial_no=2',
    		params:	TOTAL_PARAMS,
    		success: function(response, request) {
		    	var val = null;
		    	try {
		    		val = Ext.JSON.decode(response.responseText);
		    	} catch(e) {} 

		    	if(val==null) {
		    		return;
		    	}
    			console_logs("val['series']", val['series']);
    			console_logs("val['aXis']", val['aXis']);
    			var arr = [];
    			for(var i=0; i<val['aXis'].length; i++) {
    				var b = val['aXis'][i].split(':');
    				var c = b[0].substring(4,6) + '/' + b[0].substring(6,8);
    				arr.push(c);
    			}
    			console_logs('arr33', arr);
    			var s = gColumnChartStyleSmall;
    	        s['renderTo'] ='projecttotal-south-east-center3-graph';
    	        s['type'] = 'column';
    	        var categories = [];

                var today = new Date();

                var cat_p = ['PRD001', 'PRD002', 'PRD003', 'PRD004', 'PRD005', 'PRD006', 'PRD007'];

                for(var i=0; i < cat_p.length ; i++) {
                    /*var date = gu.getNextday(7 * i - today.getDay() - 43);
    				date = '~' + Ext.Date.format(date, 'm/d');
    				console_logs('=asdas=>d',date);*/
                    categories.push(cat_p[i]);
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
    	    			real.push(Math.floor(Math.random() * 4));
    	    		}
    	    	}
    	    	console_logs('check1 33', categories);
    	    	console_logs('check2 33', real);
    	    	ocProjectTotalEastSouth3 = me.redrawRealChart(s, '#979797', '#AA4643', real, '', categories);
    	        ocProjectTotalEastSouth3.setSize( eastSouth3Width,   eastSouth3Height, false);   
    	        ocProjectTotalEastSouth3.reflow();
    			gUtil.sleep(1250);
    		},
    		failure:function(result, request) {
	    		console_logs('failure33', 'failure33');
				//this.setLoading(false);
			}
    	});
    	
		this.redrawTotalChart34();
    },
    
    redrawTotalChart34: function() {
    	TOTAL_PARAMS['cubeCode'] = 'MES_PRECESS';
    	TOTAL_PARAMS['projectChartType'] = 'KY_PO_DAY_CNT';
//    	TOTAL_PARAMS['serial_no'] = 3;
    	console_logs('redrawTotalChart34', TOTAL_PARAMS);
    	var date_e = Ext.Date.format(new Date,'Ymd');
    	var date_s = Ext.Date.add(new Date(), Ext.Date.DAY, -5);
    	date_s = Ext.Date.format(date_s, 'Ymd');
    	TOTAL_PARAMS['projectTotal-s_date'] = date_s;
    	TOTAL_PARAMS['projectTotal-e_date'] = date_e;
    	var me = this;
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/xdview/chart.do?method=getChart&serial_no=3',
    		params: TOTAL_PARAMS,
    		success: function(response, request) {
		    	var val = null;
		    	try {
		    		val = Ext.JSON.decode(response.responseText);
		    	} catch(e) {} 

		    	if(val==null) {
		    		return;
		    	}
    			console_logs("val['series']34", val['series']);
    			console_logs("val['aXis']", val['aXis']);
    			var arr = [];
    			for(var i=0; i<val['aXis'].length; i++) {
    				var b = val['aXis'][i].split(':');
    				var c = b[0].substring(4,6) + '/' + b[0].substring(6,8);
    				arr.push(c);
    			}
    			console_logs('arr', arr);
    			var s = gColumnChartStyleSmall;
    	        s['renderTo'] ='projecttotal-south-east-center4-graph';
    	        s['type'] = 'column';
    	        var categories = [];

                var today = new Date();

                var cat_p = ['PNT001', 'PNT002', 'PNT003', 'PNT004', 'PNT005', 'PNT006', 'PNT007'];

    			for(var i=0; i < cat_p.length ; i++) {
                    /*var date = gu.getNextday(7 * i - today.getDay() - 43);
    				date = '~' + Ext.Date.format(date, 'm/d');
    				console_logs('=asdas=>d',date);*/
    				categories.push(cat_p[i]);
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
    	    			real.push(Math.floor(Math.random() * 4));
    	    		}
    	    	}
    	    	ocProjectTotalEastSouth4 = me.redrawRealChart(s, '#084695', '#D39324', real, '', categories);
    	        ocProjectTotalEastSouth4.setSize( eastSouth4Width,   eastSouth4Height, false);   
    	        ocProjectTotalEastSouth4.reflow();
    			gUtil.sleep(1250);
    		},
    		failure:function(result, request) {
	    		console_logs('failure34', 'failure34');
				//this.setLoading(false);
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
    	TOTAL_PARAMS['cubeCode'] = 'MES_PRECESS';
    	TOTAL_PARAMS['projectTotal-SearchType'] = '인원수';


    	this.redrawTotalChart31();

    },
});