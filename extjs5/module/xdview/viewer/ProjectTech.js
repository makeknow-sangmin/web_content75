var techSearchTypeStore= Ext.create('Rfx.store.CmmCodeStore', {parentCode:'588', hasNull:false});

var ocProjectTechCenterEast = null;
var ocProjectTechCenterCenter = null;
var ocProjectTechSouthCenter = null;

var selectedT1 = null;
var selectedT2 = null;
var selectedT3 = null;
var selectedT1Name = null;
var selectedT2Name = null;
var selectedT3Name = null;
var southEastTab = null;
//차트에서 이름으로 코드를 가져오는 버퍼.
var SERIES_BUFFER_TECH_MAP = new Ext.util.HashMap();

Ext.define('TechTable1', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'org1'
    }, {
        name: 'org2'
    }, {
        name: 'org3'
    }, {
        name: 'org4'
    }, {
    	name: 'team_code'
    }, {
        name: 'v1',
        type: 'float'
    }]
});

Ext.define('TechTable2', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'l1'
        }, {
            name: 'l2'
        }, {
            name: 'l3'
        }, {
            name: 'v1',
            type: 'float'
        }

    ]
});

var storeTechTable1 = new Ext.data.Store({
    model: 'TechTable1',
    data: []
});

var storeTechTable2 = new Ext.data.Store({
    model: 'TechTable2',
    data: []
});


var gridTechTable1 = Ext.create('Ext.grid.Panel', {
    cls: 'rfx-panel',
    title: '조직',
    border: true,
    resizable: true,
    store: storeTechTable1,
    scroll: true,
    collapsible: false,
    width: '100%',
    layout: 'fit',
    columns: [{
            dataIndex: 'id', text: 'ID',
            hidden: true
        }, {
            text: '본부',
            cls: 'rfx-grid-header',
            dataIndex: 'org1',
            resizable: true,
            autoSizeColumn: true,
            width:60,
            style: 'text-align:center',
            align: 'center'
        }, {
            text: '사업부/센터',
            cls: 'rfx-grid-header',
            dataIndex: 'org2',
            resizable: true,
            autoSizeColumn: true,
            flex: 0.25,
            style: 'text-align:center',
            align: 'center'
        }, {
            text: '실',
            cls: 'rfx-grid-header',
            dataIndex: 'org3',
            resizable: true,
            flex: 0.25,
            autoSizeColumn: true,
            style: 'text-align:center',
            align: 'center'
        }, {
            text: '팀',
            cls: 'rfx-grid-header',
            dataIndex: 'org4',
            resizable: true,
            autoSizeColumn: true,
            flex: 0.25,
            style: 'text-align:center',
            align: 'center'
        }, {
            text: '인원',
            cls: 'rfx-grid-header',
            dataIndex: 'v1',
            resizable: true,
            autoSizeColumn: true,
            flex: 0.25,
            style: 'text-align:center',
            align: 'right'
        }

    ],
		listeners: {
		   itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
			   
			   var title = '[<span style="color:#003471">' + Ext.getCmp('projectTech-Month').getValue() + '</span>] 현황';

			   var level = Number(document.getElementById('SELECTED_TECH_LEVEL').value );
			   	var titleName='';
				switch(level) {
				case 1:
					titleName = document.getElementById('SELECTED_TECH_L1_NAME').value;
					break;
				case 2:
					titleName = document.getElementById('SELECTED_TECH_L1_NAME').value + ' - ' +
									 document.getElementById('SELECTED_TECH_L2_NAME').value;
					break;
				case 3:
					titleName = document.getElementById('SELECTED_TECH_L1_NAME').value + ' - ' +
									 document.getElementById('SELECTED_TECH_L2_NAME').value + ' - ' +
									 document.getElementById('SELECTED_TECH_L3_NAME').value;
					break;
				}
			   
			   popupUserProjectDetail(title, record, 'gridTechTable1', this, titleName);
			 }
		}
//	,bbar: getPageToolbar(storeTechTable1, true, null, function () {
//                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                        })
});


var gridTechTable2 = Ext.create('Ext.grid.Panel', {
    cls: 'rfx-panel',
    title: '제품',
    border: false,
    resizable: true,
    store: storeTechTable2,
    scroll: true,
    width: '100%',
    layout: 'fit',
//    viewConfig: {
//        itemId: 'view1',
//        listeners: {
//            scope: this,
//            itemdblclick: this.onRowDblClick
//        }
//    },
    forceFit: true,
    columns: [	{
		            dataIndex: 'id', text: 'ID',
		            hidden: true
		        }, {
		            text: '제품 LV1',
		            cls: 'rfx-grid-header',
		            dataIndex: 'l1',
		            autoSizeColumn: true,
		            flex: 0.25,
		            style: 'text-align:center',
		            align: 'center'
		        }, {
		            text: '제품 LV2',
		            cls: 'rfx-grid-header',
		            dataIndex: 'l2',
		            autoSizeColumn: true,
		            flex: 0.25,
		            style: 'text-align:center',
		            align: 'center'
		        }, {
		            text: '제품 LV3',
		            cls: 'rfx-grid-header',
		            dataIndex: 'l3',
		            flex: 0.25,
		            autoSizeColumn: true,
		            style: 'text-align:center',
		            align: 'center'
		        }, {
		            text: '인원',
		            cls: 'rfx-grid-header',
		            dataIndex: 'v1',
		            autoSizeColumn: true,
		            flex: 0.25,
		            style: 'text-align:center',
		            align: 'right'
		        }]
//,
//		listeners: {
//		   itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
//			   
////			   var title = '[<span style="color:#003471">' + Ext.getCmp('projectTech-Month').getValue() + '</span>] 현황';
////					popupUserProjectDetail(title, record, 'gridTechTable2', this);
//			 }
//		}
//	,bbar: getPageToolbar(storeTechTable2, true, null, function () {
//                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                        })
});

gridTechTable1.getSelectionModel().on({
    selectionchange: function(sm, selections) {

        console_logs(selections.length);
        if (selections.length) {
            console_logs(selections[0]);
            var o = selections[0];
            //console_logs('id', o.get('id'));
            //redrawTechTable2('projectTech-L3', o.get('id'), o.get('type'));   		
        }

    }

});

//
//gridTechTable2.getSelectionModel().on({
//    selectionchange: function(sm, selections) {
//
//        console_logs(selections.length);
//        if (selections.length) {
//            console_logs(selections[0]);
//            var o = selections[0];
//            console_logs('id', o.get('id'));
//            //redrawTechTable2('projectTech-L3', o.get('id'), o.get('type'));   		
//        }
//
//    }
//
//});
//
//




function redrawTechTable1(level, code, name, level) {

	console_logs('level', level);
    gridTechTable1.setLoading(true);
	
    document.getElementById('SELECTED_TECH_LEVEL').value = ''+level;
    
    TECH_PARAMS['cubeCode'] = 'PJ_TECH';
    TECH_PARAMS['projectChartType'] = 'PJ_TECH_TABLE1';
    
    console_logs('redrawTechTable1 TECH_PARAMS', TECH_PARAMS);
    var  myO= TECH_PARAMS;
     console_logs('redrawTechTable1 myO', myO);
    	
    myO['projectTech-L1'] = null;
	myO['projectTech-L2'] = null;
	myO['projectTech-L3'] = null;
	
    selectedT2 = code;

    TECH_PARAMS[level] = code;


	console_logs('redrawTechTable1 level', level);

	    var titleName='';
		switch(level) {
		case 1:
			titleName = document.getElementById('SELECTED_TECH_L1_NAME').value;
			myO['projectTech-L1'] = document.getElementById('SELECTED_TECH_L1').value;
			break;
		case 2:
			titleName = document.getElementById('SELECTED_TECH_L1_NAME').value + ' - ' +
							 document.getElementById('SELECTED_TECH_L2_NAME').value;
			myO['projectTech-L1'] = document.getElementById('SELECTED_TECH_L1').value;
			myO['projectTech-L2'] = document.getElementById('SELECTED_TECH_L2').value;
			break;
		case 3:
			titleName = document.getElementById('SELECTED_TECH_L1_NAME').value + ' - ' +
							 document.getElementById('SELECTED_TECH_L2_NAME').value + ' - ' +
							 document.getElementById('SELECTED_TECH_L3_NAME').value;
			myO['projectTech-L1'] = document.getElementById('SELECTED_TECH_L1').value;
			myO['projectTech-L2'] = document.getElementById('SELECTED_TECH_L2').value;
			myO['projectTech-L3'] = document.getElementById('SELECTED_TECH_L3').value;
			break;
		}
	
		southEastTab.setTitle(makeGridTitle('<span style="color:#003471">'+ titleName + '</span> 조직/제품별 투입현황'));

    Ext.Ajax.request({
        url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',
        params: myO,
        success: function(response, request) {
            //console_logs('response.responseText', response.responseText);
            var val = Ext.JSON.decode(response.responseText);
            var records = val['records'];

            storeTechTable1.removeAll(true);
            for (var i = 0; i < records.length; i++) {

                var rec = records[i];
//console_logs('redrawTechTable1 rec', rec);
                storeTechTable1.add({
                    org1: (rec[0]=='NULL') ? '-' : rec[0],
                    org2: (rec[1]=='NULL') ? '-' : rec[1],
                    org3: (rec[2]=='NULL') ? '-' : rec[2],
                    org4: (rec[3]=='NULL') ? '-' : rec[3],
                    team_code: rec[4],
                    v1: rec[5]
                });

                gridTechTable1.setLoading(false);

            } //endof for

        }, // endof success for ajax
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

function redrawTechTable2(level, code, name, level) {

     gridTechTable2.setLoading(true);

	 document.getElementById('SELECTED_TECH_LEVEL').value = ''+level;
    
	TECH_PARAMS['cubeCode'] = 'PJ_TECH';
    TECH_PARAMS['projectChartType'] = 'PJ_TECH_TABLE2';
     var  myO= TECH_PARAMS;
     
	myO['projectTech-L1'] = null;
	myO['projectTech-L2'] = null;
	myO['projectTech-L3'] = null;
	
    selectedT2 = code;
    TECH_PARAMS[level] = code;

	    var titleName='';
		switch(level) {
		case 1:
			myO['projectTech-L1'] = document.getElementById('SELECTED_TECH_L1').value;
			break;
		case 2:
			myO['projectTech-L1'] = document.getElementById('SELECTED_TECH_L1').value;
			myO['projectTech-L2'] = document.getElementById('SELECTED_TECH_L2').value;
			break;
		case 3:
			myO['projectTech-L1'] = document.getElementById('SELECTED_TECH_L1').value;
			myO['projectTech-L2'] = document.getElementById('SELECTED_TECH_L2').value;
			myO['projectTech-L3'] = document.getElementById('SELECTED_TECH_L3').value;
			break;
		}

    Ext.Ajax.request({
        url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',
        params: myO,
        success: function(response, request) {
            //console_logs('response.responseText', response.responseText);
            var val = Ext.JSON.decode(response.responseText);
            var records = val['records'];

            storeTechTable2.removeAll(true);
            for (var i = 0; i < records.length; i++) {

                var rec = records[i];
                
               console_logs('redrawTechTable2 rec', rec);

                storeTechTable2.add({
                    l1:  (rec[0]=='NULL') ? '-' : rec[0],
                    l2:  (rec[1]=='NULL') ? '-' : rec[1],
                    l3:  (rec[2]=='NULL') ? '-' : rec[2],
                    v1: rec[5]
                });

                gridTechTable2.setLoading(false);

            } //endof for

        }, // endof success for ajax
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

function redrawTechChart1() {
    TECH_PARAMS['cubeCode'] = 'PJ_TECH';
    TECH_PARAMS['projectChartType'] = 'PJ_TECH1';

    Ext.getCmp('projecttech-center-center' +'id').setLoading(true);
    	
    storeTechTable1.removeAll();
    storeTechTable2.removeAll();
    	
    Ext.Ajax.request({
        url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',
        params: TECH_PARAMS,
        success: function(response, request) {
			
        	Ext.getCmp('projecttech-center-center' +'id').setLoading(false);

            var val = Ext.JSON.decode(response.responseText);
            var cat = val['aXis'];
            var arr = [];
            var aXis = [];
			moveNullPos(cat, val['series'], aXis,arr);
				
			var firstCode = arr[0]['code'];
			var firstName = arr[0]['name'];

            SERIES_BUFFER_TECH_MAP.add('redrawTechChart1', arr);
            console_logs('aXis', aXis);
            var series = val['series'];
			arrangeColorOrg(series);
			
			var unitDisp = '';
			var format = '';
	        switch(TECH_PARAMS['projectTech-SearchType'] ) {
	        case '인원수':
	        	unitDisp = '(명)';
	        	format = '{y:,.0f}';
	        	break;
	        case '공수':
	        	unitDisp = '(시간)';
	        	format = '{y:,.0f}';
	        	break;
	        case '인건비':
	        	unitDisp = '(억 원)';
				changeSeriesValue(series, 1/100000000);
				format = '{y:,.2f}';
	        	break;
	        }	
		        
		    document.getElementById('SELECTED_TECH_L1').value =firstCode;
			document.getElementById('SELECTED_TECH_L1_NAME').value =firstName;
            redrawTechChart2(firstCode, firstName);

            var sProjectTechCenterCenter = gColumnChartStyle;
            sProjectTechCenterCenter['renderTo'] = 'projecttech-center-center-graph';

            ocProjectTechCenterCenter = new Highcharts.Chart({

                chart: sProjectTechCenterCenter,
                title: {
                    text: '<div class="title02"><span>기술분야 별</span> 투입현황 ' + unitDisp + '</div>',
                    margin: 5,
                    align: 'left',
                    useHTML: true
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
                    series: {animation: { duration: 200  },
                        pointPadding: 0, // Defaults to 0.1
                        groupPadding: 0.05 // Defaults to 0.2
                            ,
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                    console_logs('this', this);
                                    var arr = SERIES_BUFFER_TECH_MAP.get('redrawTechChart1');
                                    for (var i = 0; i < arr.length; i++) {
                                        var o = arr[i];
                                        console_logs('o', o);

                                        if (o['name'] == this.category) {
                                        	
                                  			document.getElementById('SELECTED_TECH_L1').value =o['code'];
											document.getElementById('SELECTED_TECH_L1_NAME').value =this.category;
                                        	
                                        	
                                            redrawTechChart2(o['code'], this.category);
                                            redrawTechTable1('projectTech-L1',o['code'], this.category, 1);
                                            redrawTechTable2('projectTech-L1',o['code'], this.category, 1);
                                        }
                                    }
                                }
                            }
                        }
                    },
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            },
                            format: format
                        }
                    }
                },
                series: series
            });

        }, // endof success for ajax
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
    }); // endof Ajax
}


function redrawTechChart2(code, name) {

    selectedT1 = code;
    selectedT1Name = name;

    TECH_PARAMS['projectTech-L1'] = null;
    TECH_PARAMS['projectTech-L2'] = null;
    TECH_PARAMS['projectTech-L3'] = null;

    TECH_PARAMS['cubeCode'] = 'PJ_TECH';
    TECH_PARAMS['projectChartType'] = 'PJ_TECH2';
    TECH_PARAMS['projectTech-L1'] = code;


    //console_logs('TECH_PARAMS', TECH_PARAMS);

    Ext.getCmp('projecttech-center-east' +'id').setLoading(true);

    Ext.Ajax.request({
        url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',
        params: TECH_PARAMS,
        success: function(response, request) {
            
        	Ext.getCmp('projecttech-center-east' +'id').setLoading(false);
        	
        	//console_logs('response.responseText', response.responseText);
            var val = Ext.JSON.decode(response.responseText);
            //console_logs("val['series']", val['series']);
            //console_logs("val['aXis']", val['aXis']);
            var cat = val['aXis'];
            var arr = [];
            var aXis = [];
            var firstCode = null;
            var firstName = null;
            for (var i = 0; i < cat.length; i++) {
                var res = cat[i].split(":");
                var code = res[0];
                var name = res[1];
                var o = {
                    code: code,
                    name: name
                };
                arr.push(o);
                aXis.push(name);

                if (i == 0) {
                    firstCode = code;
                    firstName = name;
                }
            }
			document.getElementById('SELECTED_TECH_L2').value = firstCode;
			document.getElementById('SELECTED_TECH_L2_NAME').value = firstName;
            
			SERIES_BUFFER_TECH_MAP.add('redrawTechChart2', arr);
            console_logs('aXis', aXis);
            redrawTechChart3(firstCode, firstName);

			var series = val['series'];
			arrangeColorOrg(series);
			
			var unitDisp = '';
			var format = '';
	        switch(TECH_PARAMS['projectTech-SearchType'] ) {
	        case '인원수':
	        	unitDisp = '(명)';
	        	format = '{y:,.0f}';
	        	break;
	        case '공수':
	        	unitDisp = '(시간)';
	        	format = '{y:,.0f}';
	        	break;
	        case '인건비':
	        	unitDisp = '(억 원)';
				changeSeriesValue(series, 1/100000000);
				format = '{y:,.2f}';
	        	break;
	        }	

//	        changeSeriesName(series, 'NULL', '( ' + selectedT1Name + ' )' );
//	        changeAxisName(aXis, 'NULL', '( ' + selectedT1Name + ' )' );
	        changeSeriesName(series, 'NULL', '( ' + '없음' + ' )' );
	        changeAxisName(aXis, 'NULL', '( ' + '없음' + ' )' );
	        
            var s1 = gColumnChartStyle;
            s1['renderTo'] = 'projecttech-center-east-graph';
            ocProjectTechCenterEast = new Highcharts.Chart({

                chart: s1,

                title: {
                    text: '<div class="title02"><span>' + selectedT1Name + '</span> 기술분야 투입현황 ' + unitDisp + '</div>',
                    margin: 5,
                    align: 'left',
                    useHTML: true
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
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                scrollbar: {
                    enabled: false
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
                    series: {animation: { duration: 200  },
                        pointPadding: 0, // Defaults to 0.1
                        groupPadding: 0.05 // Defaults to 0.2
                            ,
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                    console_logs('this', this);

                                    var arr = SERIES_BUFFER_TECH_MAP.get('redrawTechChart2');
                                    for (var i = 0; i < arr.length; i++) {
                                        var o = arr[i];
                                        console_logs('o', o);

                                        if (o['name'] == this.category) {
											document.getElementById('SELECTED_TECH_L2').value = o['code'];
											document.getElementById('SELECTED_TECH_L2_NAME').value = o['name'] ;
			
                                            redrawTechChart3(o['code'], this.category);
											redrawTechTable1('projectTech-L2',o['code'], this.category, 2);
                                            redrawTechTable2('projectTech-L2',o['code'], this.category, 2);
                                        }
                                    }

                                }
                            }
                        }
                    },
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: 'white',
                            style: {
                                textShadow: '0 0 3px black' /*, fontFamily: '"맑은 고딕", Malgun Gothic' , lineHeight: '18px', fontSize: '17px' */
                            },
                            format: format
                        }
                    }
                },
                series: series
            });


        }, // endof success for ajax
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
    }); // endof Ajax



}

function redrawTechChart3(code, name) {

    selectedT2 = code;
    selectedT2Name = name;

    TECH_PARAMS['projectTech-L1'] = null;
    TECH_PARAMS['projectTech-L2'] = null;
    TECH_PARAMS['projectTech-L3'] = null;

    TECH_PARAMS['cubeCode'] = 'PJ_TECH';
    TECH_PARAMS['projectChartType'] = 'PJ_TECH3';
    TECH_PARAMS['projectTech-L2'] = code;


    //console_logs('TECH_PARAMS', TECH_PARAMS);

	Ext.getCmp('projecttech-south-center' +'id').setLoading(true);
    
	Ext.Ajax.request({
        url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',
        params: TECH_PARAMS,
        success: function(response, request) {
            
        	Ext.getCmp('projecttech-south-center' +'id').setLoading(false);
        	//console_logs('response.responseText', response.responseText);
            var val = Ext.JSON.decode(response.responseText);
            //console_logs("val['series']", val['series']);
            //console_logs("val['aXis']", val['aXis']);
            var cat = val['aXis'];
            var arr = [];
            var aXis = [];
            var firstCode = null;
            var firstName = null;
            for (var i = 0; i < cat.length; i++) {
                var res = cat[i].split(":");
                var code = res[0];
                var name = res[1];
                var o = {
                    code: code,
                    name: name
                };
                arr.push(o);
                aXis.push(name);

                if (i == 0) {
                    firstCode = code;
                    firstName = name;
                }
            }

			document.getElementById('SELECTED_TECH_L3').value = firstCode;
			document.getElementById('SELECTED_TECH_L3_NAME').value = firstName;
    
			SERIES_BUFFER_TECH_MAP.add('redrawTechChart3', arr);

			var series = val['series'];
			arrangeColorOrg(series);
			
			var unitDisp = '';
			var format = '';
	        switch(TECH_PARAMS['projectTech-SearchType'] ) {
	        case '인원수':
	        	unitDisp = '(명)';
	        	format = '{y:,.0f}';
	        	break;
	        case '공수':
	        	unitDisp = '(시간)';
	        	format = '{y:,.0f}';
	        	break;
	        case '인건비':
	        	unitDisp = '(억 원)';
				changeSeriesValue(series, 1/100000000);
				format = '{y:,.2f}';
	        	break;
	        }	

//			changeSeriesName(series, 'NULL', '( ' + selectedT2Name + ' )' )
//	        changeAxisName(aXis, 'NULL', '( ' + selectedT2Name + ' )' )
			changeSeriesName(series, 'NULL', '(없음)' );
	        changeAxisName(aXis, 'NULL', '(없음)' );
	        
            var s1 = gColumnChartStyle;
            s1['renderTo'] = 'projecttech-south-center-graph';
            ocProjectTechSouthCenter = new Highcharts.Chart({

                chart: s1,

                title: {
                    text: '<div class="title02"><span>' + selectedT1Name + ' - ' + selectedT2Name + '</span> 기술 투입현황 ' + unitDisp + '</div>',
                    margin: 5,
                    align: 'left',
                    useHTML: true
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
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                scrollbar: {
                    enabled: false
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
                    series: {animation: { duration: 200  },
                        pointPadding: 0, // Defaults to 0.1
                        groupPadding: 0.05 // Defaults to 0.2
                            ,
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                    console_logs('this', this);

                                    var arr = SERIES_BUFFER_TECH_MAP.get('redrawTechChart3');
                                    for (var i = 0; i < arr.length; i++) {
                                        var o = arr[i];
                                        console_logs('o', o);
                                        console_logs('this.category', this.category);

                                        if (o['name'] == this.category) {
                                        	
											document.getElementById('SELECTED_TECH_L3').value = o['code'];
											document.getElementById('SELECTED_TECH_L3_NAME').value = this.category;
											
                                        	selectedT3 = o['code'];
                                        	selectedT3Name = o['name'];
											redrawTechTable1('projectTech-L3',o['code'], this.category, 3);
                                            redrawTechTable2('projectTech-L3',o['code'], this.category, 3);
                                        }
                                    }

                                }
                            }
                        }
                    },
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: 'white',
                            style: {
                                textShadow: '0 0 3px black' /*, fontFamily: '"맑은 고딕", Malgun Gothic' , lineHeight: '18px', fontSize: '17px' */
                            },
                            format: format
                        }
                    }
                },
                series: series
            });


        }, // endof success for ajax
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
    }); // endof Ajax



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
Ext.define('FeedViewer.ProjectTech', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.projectTech',
    frame: false,
    border: false,
    split: true,
    //	style: {
    //		borderColor: '#EAEAEA'
    //	},
    bodyPadding: '1 0 0 0',
    createToolbar: function() {
        var items = [],
            config = {};
        if (!this.inTab) {

            items.push({
                emptyText: '조회구분',
                xtype: 'combo',
                id: 'projectTech-SearchType',
                mode: 'local',
                editable: false,
                allowBlank: false,
                queryMode: 'remote',
                displayField: 'codeName',
                value:          TECH_PARAMS['projectTech-SearchType'],
                triggerAction: 'all',
                store: techSearchTypeStore,
                width: 120,
                cls: 'newCSS',
                listConfig: {
                    getInnerTpl: function() {
                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                    }
                },
                listeners: {
                    select: function(combo, record) {
                        var systemCode = record.get('systemCode');
                        TECH_PARAMS[this.id] = combo.getValue();

                    },
                    change: function(sender, newValue, oldValue, opts) {
                        this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
                        //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
                    }
                }
            }, '-');


            items.push({
                emptyText: '조직구분',
                xtype: 'combo',
                id: 'projectTech-SearchOrg',
                mode: 'local',
                editable: false,
                allowBlank: false,
                queryMode: 'remote',
                displayField: 'codeName',
                value: '',
                triggerAction: 'all',
                store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'531'}),
                width: 120,
                cls: 'newCSS',
                listConfig: {
                    getInnerTpl: function() {
                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                    }
                },
                listeners: {
                    select: function(combo, record) {
                        var systemCode = record.get('systemCode');
                        TECH_PARAMS[this.id] = combo.getValue();

                    },
                    change: function(sender, newValue, oldValue, opts) {
                        this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
                        //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
                    }
                }
            }, '-');


            items.push({
                emptyText: '',
                xtype: 'combo',
                id: 'projectTech-Month',
                mode: 'local',
                editable: false,
                allowBlank: false,
                queryMode: 'remote',
                displayField: 'codeName',
                value: TECH_PARAMS['projectTech-Month'],
                triggerAction: 'all',
                store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'592', hasNull:false}),
                width: 120,
                cls: 'newCSS',
                listConfig: {
                    getInnerTpl: function() {
                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                    }
                },
                listeners: {
                    select: function(combo, record) {
                        var systemCode = record.get('systemCode');
                        TECH_PARAMS[this.id] = combo.getValue();
                    },
                    change: function(sender, newValue, oldValue, opts) {
                        this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
                        //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
                    }
                }
            }, '-');

            items.push({
                xtype: 'component',
                //html: '<div class="inputBT"><button type="button" onClick="redrawTechChart1();"><span class="search">검색</span></button></div>'
                html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawTechChart1();"></button></span></div>'
            });
            items.push('->');
            if(vSYSTEM_TYPE != 'HANARO') {
                items.push({
                    xtype : 'checkbox',
                    id : 'chkAutorefresh5',
                    boxLabel : '<font color=white>화면유지</font>',
                    tip: '작업화면을 유지하면 편리하지만 메모리를 많이 소모합니다.',
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
            }
	        
            items.push({
                xtype: 'component',
                html: '<div class="searchcon" onClick="openNewWindow();" title="새로운 탭화면 열기"><span class="newwinBT"></span></div>'
                //html: '<div class="inputBT"><button type="button" onClick="openNewWindow();"><span class="search">새창으로 보기</span></button></div>'
            });
            config.items = items;

        } else {
            config.cls = 'x-docked-border-bottom';
        }
        config.cls = 'my-x-toolbar-default';
        return Ext.create('widget.toolbar', config);
    },



    layoutConfig: {
        columns: 1,
        rows: 2
    },
    defaults: {
        collapsible: false,
        split: true,
        cmargins: '2 0 0 0',
        margins: '0 0 0 0'
    },
	bodyPadding: 10,
    initComponent: function() {
        // this.display = Ext.create('widget.feedpost', {});
        this.dockedItems = [this.createToolbar()];
        Ext.apply(this, {
            layout: 'border',
            items: [this.createSouth(), this.createCenter()]
        });
        // this.relayEvents(this.display, ['opentab']);
        this.relayEvents(this.south, ['rowdblclick']);
        this.callParent(arguments);
    },

    /**
     * Loads a feed.
     * @param {String} url
     */
    loadFeed: function(url) {
        //this.grid.loadFeed(url);
        // this.display.loadFeed(url);
    },

    /**
     * Creates the feed grid
     * @private
     * @return {FeedViewer.FeedGrid} feedGrid
     */
    createSouth: function() {


        var southCenter = Ext.create('Ext.panel.Panel', {
        	id: 'projecttech-south-center' +'id',
            minHeight: 200,
            minWidth: 150,
            height: "50%",
            region: 'center',
            collapsible: false,
            contentEl: 'projecttech-south-center',
            listeners: {
                'resize': function(win, width, height, opt) {
                    if (ocProjectTechSouthCenter != null && ocProjectTechSouthCenter != undefined && ocProjectTechSouthCenter != 'undefined') {
                        ocProjectTechSouthCenter.setSize(width, height, false);
                        ocProjectTechSouthCenter.reflow();
                    }

                }
            }
        });

        southEastTab =
            Ext.create('Ext.tab.Panel', {
                activeTab: 0,
                width: '100%',
                title:  makeGridTitle('<span style="color:#003471">조직/제품별</span> 투입현황'),
                items: [
                    gridTechTable1, gridTechTable2
                ]
            });

		var southItems = [];
		if(VIEW_ALL_POWER == true) {
			southItems.push(southEastTab);
		}
        
		this.south = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            region: 'south',
            height: "50%",
            minHeight: 300,
            layoutConfig: {
                columns: 2,
                rows: 1
            },
            defaults: {
                //collapsible: true,
                split: true,
                cmargins: '2 0 0 0',
                margins: '0 0 0 0'
            },
            items: [southCenter, {
                minWidth: 200,
                width: "50%",
                region: 'east',
                collapsible: false,
                layout: 'fit',
                items: southItems
            }]
        });

        return this.south;

    },

    /**
     * Fires when a grid row is selected
     * @private
     * @param {FeedViewer.FeedGrid} grid
     * @param {Ext.data.Model} rec
     */
    onSelect: function(grid, rec) {
        console_logs('onSelect', rec);
        // this.display.setActive(rec);
    },


    /**
     * Reacts to the open all being clicked
     * @private
     */
    onOpenAllClick: function() {
        this.fireEvent('openall', this);
    },

    /**
     * Create the center region container
     * @private
     * @return {Ext.panel.Panel} center
     */
    createCenter: function() {

        var centerCenter = Ext.create('Ext.panel.Panel', {
        	id: 'projecttech-center-center' +'id',
            minHeight: 200,
            minWidth: 150,
            height: "50%",
            region: 'center',
            collapsible: false,
            contentEl: 'projecttech-center-center',
            listeners: {
                'resize': function(win, width, height, opt) {
                    if (ocProjectTechCenterCenter != null && ocProjectTechCenterCenter != undefined && ocProjectTechCenterCenter != 'undefined') {
                        ocProjectTechCenterCenter.setSize(width, height, false);
                        ocProjectTechCenterCenter.reflow();
                    }

                }
            }
        });


        var centerEast = Ext.create('Ext.panel.Panel', {
        	id: 'projecttech-center-east' +'id',
            minHeight: 200,
            minWidth: 150,
            width: "50%",
            region: 'east',
            contentEl: 'projecttech-center-east',
            collapsible: false,
            listeners: {
                'resize': function(win, width, height, opt) {

                    if (ocProjectTechCenterEast != null && ocProjectTechCenterEast != undefined && ocProjectTechCenterEast != 'undefined') {
                        ocProjectTechCenterEast.setSize(width, height, false);
                        ocProjectTechCenterEast.reflow();
                    }

                }
            }
        });


        this.center = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: false,
            height: "50%",
            region: 'center',
            minHeight: 200,
            layoutConfig: {
                columns: 2,
                rows: 1
            },
            defaults: {
                //collapsible: true,
                split: true,
                cmargins: '2 0 0 0',
                margins: '0 0 0 0'
            },
            items: [centerEast, centerCenter]
        });
        return this.center;
    },

    createTab: function() {

        this.tab = Ext.create('widget.tabGridTech', {
            layout: 'fit'
        });
        //this.loadFeed(this.url);
        return this.tab;
    }
});