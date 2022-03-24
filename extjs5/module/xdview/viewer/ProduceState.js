var orgSearchTypeStore= Ext.create('Rfx.store.CmmCodeStore', {parentCode:'588', hasNull:false});

var ocProduceStateCenterEast = null;
var ocProduceStateCenterCenter = null;

var selectedO1 = null;
var SERIES_BUFFER_ORG_MAP = new Ext.util.HashMap();

Ext.define('ProduceTable', {
    extend: 'Ext.data.Model',
    fields: [ 
              'c1', 
              'c2', 
              {    name: 'v1',   type: 'float' },
              {    name: 'v2',   type: 'float' },
              {    name: 'v3',   type: 'float' },
              {    name: 'v4',   type: 'float' },
              {    name: 'v5',   type: 'float' },
              {    name: 'v6',   type: 'float' },
              {    name: 'v7',   type: 'float' },
              {    name: 'v8',   type: 'float' },
              {    name: 'v9',   type: 'float' },
              {    name: 'v10',   type: 'float' },
              {    name: 'v11',   type: 'float' },
              {    name: 'v12',   type: 'float' },
              {    name: 'v13',   type: 'float' },
              {    name: 'v14',   type: 'float' },
              {    name: 'v15',   type: 'float' }
              ],
        proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/xdview/chart.do?method=getTable'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success'
			}
		}
});

Ext.define('LotTable1', {
    extend: 'Ext.data.Model',
    fields: [ 
              'customer', 
              'item_name', 
              'lot_number'
     ]
});

var storeLotTable1 = new Ext.data.Store({  
	model: 'LotTable1',
	data: [
	       {
    	   customer: 	'농협', 
            item_name: 	'성주사과(대)', 
            lot_number: 	'160302000'
	       },{
	    	   customer: 	'신세계', 
	            item_name: 	'여름선뭉셋트', 
	            lot_number: 	'160302001'
		       }
	       ]
});

var gridLotTable1 = Ext.create('Ext.grid.Panel', {
	cls : 'rfx-panel',
	title: 'LOT 선택', //makeGridTitle('<span style="color:#003471">LOT</span> 선택'),
	frame: true,
	resizable: true,
	store: storeLotTable1,
	scroll: false,
    width: '20%',
    region: 'east',
    forceFit: true,
    collapsible: true,
    scroll: true,
    border:true,
    region: 'west',
	layout           :'fit',
    columns: [{
        	dataIndex: 'id', text: 'ID',
        	hidden:true
        },
		      {
            	text: 'LOT',
            	cls:'rfx-grid-header', 
                dataIndex: 'lot_number',
                resizable: true,
                autoSizeColumn : true,
                style: 'text-align:center',     
                align:'center'
            }, {
				text: '고객사',
				cls:'rfx-grid-header', 
                dataIndex: 'customer',
                resizable: true,
                autoSizeColumn : true,
                style: 'text-align:center',     
                align:'center',
	            field: {
	                xtype: 'textfield'
	            }
            }, {
				text: '제품명',
				cls:'rfx-grid-header', 
                dataIndex: 'item_name',
                resizable: true,
                autoSizeColumn : true,
                style: 'text-align:center',     
                align:'center',
	            field: {
	                xtype: 'textfield'
	            }
            }]
//			,bbar: getPageToolbar(storeTeamTable2, true, null, function () {
//                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                        })
});


var storeProduceTable = new Ext.data.Store({  
	pageSize: 15,
	model: 'ProduceTable',
	data: [
    {
    	c1: 	'LOT', 
    	c2: 		'계획LOT수', 
    	v1: 	7, 
    	v2: 	3, 
     v3: 	220400, 
     v4: 		220400,
     v5: 		220400,
     v6: 		220400, 
     v7: 		0.5,
     v8: 		220400,
     v9: 		32, 
     v10: 		23,
     v11: 		23,
     v12: 		34, 
     v13: 		34,
     v14: 		34,
     v15: 		34
    },{
    	c1: 	'', 
    	c2: 		'완료LOT수', 
    	v1: 	7, 
    	v2: 	3, 
     v3: 	220400, 
     v4: 		220400,
     v5: 		220400,
     v6: 		220400, 
     v7: 		0.5,
     v8: 		220400,
     v9: 		32, 
     v10: 		23,
     v11: 		23,
     v12: 		34, 
     v13: 		34,
     v14: 		34,
     v15: 		34
    },{
    	c1: 	'생산수량', 
    	c2: 		'계획수량', 
    	v1: 	7, 
    	v2: 	3, 
     v3: 	220400, 
     v4: 		220400,
     v5: 		220400,
     v6: 		220400, 
     v7: 		0.5,
     v8: 		220400,
     v9: 		32, 
     v10: 		23,
     v11: 		23,
     v12: 		34, 
     v13: 		34,
     v14: 		34,
     v15: 		34
    },{
    	c1: 	'', 
    	c2: 		'투입실적', 
    	v1: 	7, 
    	v2: 	3, 
     v3: 	220400, 
     v4: 		220400,
     v5: 		220400,
     v6: 		220400, 
     v7: 		0.5,
     v8: 		220400,
     v9: 		32, 
     v10: 		23,
     v11: 		23,
     v12: 		34, 
     v13: 		34,
     v14: 		34,
     v15: 		34
    },{
    	c1: 	'', 
    	c2: 		'생산실적', 
    	v1: 	7, 
    	v2: 	3, 
     v3: 	220400, 
     v4: 		220400,
     v5: 		220400,
     v6: 		220400, 
     v7: 		0.5,
     v8: 		220400,
     v9: 		32, 
     v10: 		23,
     v11: 		23,
     v12: 		34, 
     v13: 		34,
     v14: 		34,
     v15: 		34
    },{
    	c1: 	'', 
    	c2: 		'달성률', 
    	v1: 	7, 
    	v2: 	3, 
     v3: 	220400, 
     v4: 		220400,
     v5: 		220400,
     v6: 		220400, 
     v7: 		0.5,
     v8: 		220400,
     v9: 		32, 
     v10: 		23,
     v11: 		23,
     v12: 		34, 
     v13: 		34,
     v14: 		34,
     v15: 		34
    },{
    	c1: 	'불량', 
    	c2: 		'불량수량', 
    	v1: 	7, 
    	v2: 	3, 
     v3: 	220400, 
     v4: 		220400,
     v5: 		220400,
     v6: 		220400, 
     v7: 		0.5,
     v8: 		220400,
     v9: 		32, 
     v10: 		23,
     v11: 		23,
     v12: 		34, 
     v13: 		34,
     v14: 		34,
     v15: 		34
    },{
    	c1: 	'', 
    	c2: 		'뷸량률', 
    	v1: 	7, 
    	v2: 	3, 
     v3: 	220400, 
     v4: 		220400,
     v5: 		220400,
     v6: 		220400, 
     v7: 		0.5,
     v8: 		220400,
     v9: 		32, 
     v10: 		23,
     v11: 		23,
     v12: 		34, 
     v13: 		34,
     v14: 		34,
     v15: 		34
    }
    ]
});



var gridProduceTable = Ext.create('Ext.grid.Panel', {
	cls : 'rfx-panel',
	title: makeGridTitle('<span>공정별</span> 생산현황'),
	border: true,
	resizable: true,
	scroll: true,
	store: storeProduceTable,
    minWidth: 200,
    height: "50%",
    region: 'south',
    collapsible: false,
    layout          :'fit',
    forceFit: true,
    columns: [{
            	dataIndex: 'id', text: 'ID',
            	hidden:true
            },{
		                text: '구분',
		                dataIndex: 'c1',
		                cls:'rfx-grid-header', 
		                style: 'text-align:center',     align:'left'
		            }, {
		                text: '항목',
		                dataIndex: 'c2',
		                cls:'rfx-grid-header', 
		                style: 'text-align:center',     align:'left'
		            }, {
		            	text: '롤컷팅',
		                dataIndex: 'v1',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#B0D698;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
						text: '재단',
		                dataIndex: 'v2',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#B0D698;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, 
		            {
		                text: '출력',
		                dataIndex: 'v3',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#B0D698;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		                text: '인쇄',
		                dataIndex: 'v4',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#B0D698;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '코팅',
		                dataIndex: 'v5',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#B0D698;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            },
		            {
		                text: '금박',
		                dataIndex: 'v6',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#EBB462;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		                text: '형압',
		                dataIndex: 'v7',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#EBB462;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '합지',
		                dataIndex: 'v8',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#EBB462;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            },
		            {
		                text: '톰슨',
		                dataIndex: 'v9',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#084695;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		                text: '포장',
		                dataIndex: 'v10',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#084695;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '접착',
		                dataIndex: 'v11',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#084695;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '트레이',
		                dataIndex: 'v12',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#084695;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '철박이',
		                dataIndex: 'v13',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#084695;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '합계',
		                dataIndex: 'v15',
		                cls:'rfx-grid-header', 
		                style: 'text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }
            
            ],
          bbar: getPageToolbar(storeProduceTable, true, null, function () {
                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
                        }),
		  listeners: {
		     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
			   //console_logs('record', record);
			   var title = '[<span style="color:#003471">' + ORG_PARAMS['produceState-Month'] + '</span>] 현황';
					popupUserProjectDetail(title, record, 'gridProduceTable', this, record.get('org4'));
			 }//endof itemdblclick
//				,viewready: function (grid) {
//			        	console_logs('viewready grid', grid);
//			            var view = grid.view;
//			            
//			            // record the current cellIndex
//			            grid.mon(view, {
//			                uievent: function (type, view, cell, recordIndex, cellIndex, e) {
//			                	console_logs('uievent recordIndex,cellIndex ',  recordIndex + ',' + cellIndex);
//			                    grid.cellIndex = cellIndex;
//			                    grid.recordIndex = recordIndex;
//			                    
//			                    	 grid.tip = Ext.create('Ext.tip.ToolTip', {
//						                target: view.el,
//						                delegate: '.x-grid-cell',
//						                trackMouse: true,
//						                renderTo: Ext.getBody(),
//						                listeners: {
//						                    beforeshow: function updateTipBody(tip) {
//						                    	if(grid.recordIndex>-1) {
//													var rec = grid.getStore().getAt(grid.recordIndex);
//													//if(grid.curRecord != rec) {
//							                            var s = '';
//							                            var org1 = rec.get('org1')==null ? '' : rec.get('org1');
//							                            var org2 = rec.get('org2')==null ? '' : rec.get('org2');
//							                            var org3 = rec.get('org3')==null ? '' : rec.get('org3');
//							                            var org4 = rec.get('org4')==null ? '' : rec.get('org4');
//							                            s = s +  org1+ ' - ';
//							                            s = s +  org2+ ' - ';
//							                            s = s +  org3+ ' - ';
//							                            s = s +   org4;  
//							                        	tip.update(s);
//							                        //	grid.curRecord = rec;
//													//}else {
//													//	grid.curRecord = null;
//													//}
//						                        }
//						                    }
//						                }
//						            });
//			                }
//			            });
//			            
//			
//			        }


	  }//endof listeners
});


function redrawProduceAll() {
	
	console_logs('redrawProduceAll()');

	//redrawProduceChart1();
	redrawProduceChart2('RESEARCH', '연구');
	//redrawProduceTable('RESEARCH', null);
}

function redrawProduceTable(o1, name_in) { //RESEARCH, 201502, 2015년 02월
//	
//		console_logs('redrawProduceTable -------------------- name_in ', name_in);
//	
//	
//	
//	var name = Ext.getCmp('produceState-Month').getValue();
//	
//	if(name_in!=null) {
//		name = '20' + name_in.substring(1,3) + '년 ' + name_in.substring(4,7) + '월';
//	}
//	
//	
//	gridProduceTable.setTitle(makeGridTitle('<span style="color:#003471">'+ name + '</span> 팀별 프로젝트별 투입현황'));
//	
//	ORG_PARAMS['cubeCode'] = 'PJ_ORG';
//	ORG_PARAMS['projectChartType'] = 'PJ_ORG_TABLE';
//	ORG_PARAMS['produceState-Month'] = name;
//
//	storeProduceTable.removeAll(true);
//
//	storeProduceTable.getProxy().setExtraParam('cubeCode', ORG_PARAMS['cubeCode']);
//	storeProduceTable.getProxy().setExtraParam('projectChartType', ORG_PARAMS['projectChartType']);
//	storeProduceTable.getProxy().setExtraParam('produceState-Month', ORG_PARAMS['produceState-Month']);
//	
//	gridProduceTable.setLoading(true);				
//	storeProduceTable.load(function(records){
//		console_logs('redrawProduceTable records', records);
//		gridProduceTable.setLoading(false);
//	});

	/*
Ext.Ajax.request({
				url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
				params:ORG_PARAMS,
				success : function(response, request) {
					//console_logs('response.responseText', response.responseText);
					var val = Ext.JSON.decode(response.responseText);
					var records = val['records'];

					storeProduceTable.removeAll(true);
					for(var i=0; i<records.length; i++) {
						
						var rec = records[i];
						
						//console_logs('redrawProduceTable rec', rec);

						storeProduceTable.add({
							org1: rec[0],
					        org2: rec[1],
					        org3: rec[2],
					        org4: rec[3],
					        team_code: rec[4],
					        v1: rec[5],
					        v2: rec[6],
					        v3: rec[7],
					        v4: rec[8],
					        v5: rec[9],
					        v6: rec[10],
					        v7: rec[11],
					        v8: rec[12],
					        v9: rec[13],
					        v10: rec[14],
					        v11: rec[15],
					        v12: rec[16],
					        auxInfo: rec[rec.length-1]
					    });
					
					}//endof for

					gridProduceTable.setLoading(false);
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
*/
	
}

//function redrawProduceChart1() {
//	ORG_PARAMS['cubeCode'] = 'PJ_ORG';
//	ORG_PARAMS['projectChartType'] = 'PJ_ORG1';
//	
//	
//	
//	//console_logs('------------------> produceState-Month', Ext.getCmp('produceState-Month').getValue());
//	ORG_PARAMS['produceState-Month'] = Ext.getCmp('produceState-Month').getValue();
//	
//	
//	
//	
//	Ext.getCmp('projectorg-center-center' +'id').setLoading(true);
//
// 	Ext.Ajax.request({
//			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
//			params:ORG_PARAMS,
//			success : function(response, request) {
//				
//				Ext.getCmp('projectorg-center-center' +'id').setLoading(false);
//
//				var val = Ext.JSON.decode(response.responseText);
//
//				var cat = val['aXis'];
//				var arr = [];
//				var aXis = [];
//				var firstCode = null;
//				var firstName = null;
//				for(var i=0; i<cat.length; i++) {
//					var res = cat[i].split(":");
//					var code = res[0];
//					var name = res[1];
//					//name = "'"+name.substring(2,4) + '/' + name.substring(6,8);
//					var o = { code : code,
//							  name : name
//							};
//					arr.push(o);
//					aXis.push(name);
//					
//					if(i==0) {
//						firstCode = code;
//						firstName = name;
//					}
//				}
//
//				SERIES_BUFFER_ORG_MAP.add('redrawProduceChart1', arr);
//				//console_logs('redrawProduceChart1 aXis', aXis);
//				
//				
//				console_logs('redrawProduceChart2 firstCode', firstCode);
//				console_logs('redrawProduceChart2 firstName', firstName);
//					    	   		
//				var series = val['series'];
//				arrangeColor(series);
//				
//				var unitDisp = '';
//				var format = '';
//		        switch(ORG_PARAMS['produceState-SearchType']) {
//		        case '인원수':
//		        	unitDisp = '(명)';
//		        	format = '{y:,.0f}';
//		        	break;
//		        case '공수':
//		        	unitDisp = '(시간)';
//		        	format = '{y:,.0f}';
//		        	break;
//		        case '인건비':
//		        	unitDisp = '(억 원)';
//  					changeSeriesValue(series, 1/100000000);
//  					format = '{y:,.1f}';
//		        	break;
//		        }	
//				
//				var sProduceStateCenterCenter = gColumnChartStyle;
//		        sProduceStateCenterCenter['renderTo'] ='projectorg-center-center-graph';
//				
//		        ocProduceStateCenterCenter = new Highcharts.Chart({
//
//			    chart: sProduceStateCenterCenter,
//			    title: {
//	    	            text: '<div class="title02"><span>본부별</span> 프로젝트 투입추이 ' + unitDisp + '</div>',
//	    	            margin: 5,
//	    	            align: 'left',
//	    	            useHTML: true
//	    	        },
//	    	        subtitle: {
//	    	            //text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
//	    	        },
//	    	        xAxis: {
//					labels: {
//    	        			 rotation: 0
//				        },
//	    	            categories: aXis
//	    	        },
//	    	        yAxis: {
//	    	            min: 0,
//	    	            visible: false,
//	    	            title: {
//	    	                //text: '투입인원'
//	    	            },
//	    	            stackLabels: {
//	    	                enabled: true,
//	    	                style: {
//	    	                    //fontWeight: 'bold',
//	    	                    //color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
//	    	                }
//	    	            }
//	    	        },
//	    	        legend: {
//	    	            align: 'right',
//	    	            x: -30,
//	    	            verticalAlign: 'top',
//	    	            y: 15,
//	    	            floating: true,
//	    	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
//	    	            borderColor: '#CCC',
//	    	            borderWidth: 0,
//	    	            shadow: false
//	    	        },
//	    	        tooltip: {
//	    	            headerFormat: '<b>{point.x}</b><br/>',
//	    	            pointFormat: '{series.name}: {point.y:,.1f}<br />합계: {point.stackTotal:,.1f}'
//	    	        },
//	    	        plotOptions: {
//	    	        	series: {animation: { duration: 200  },
//					        pointPadding: 0, // Defaults to 0.1
//					        groupPadding: 0.05 // Defaults to 0.2
//					        ,cursor: 'pointer',
//			                point: {
//			                    events: {
//			                        click: function () {
//			                            console_logs('this', this);
//			                            var arr = SERIES_BUFFER_ORG_MAP.get('redrawProduceChart1');
//			                            for(var i=0; i<arr.length; i++) {
//			                            	var o = arr[i];
//			                            	console_logs('o', o);
//
//			                            	if(o['name']==this.category) {
//			                            		redrawProduceChart2(o['code'], this.category);
//			                            	}
//			                            }
//			                            
//			                            
//			                            //var res = this.category.split("(");
//			                            //redrawProduceChart2(res[0]);
//			                        	//alert('Category: ' + this.category + ', value: ' + this.y);
//			                        }
//			                    }
//			                }
//					    },
//	    	            column: {
//	    	                stacking: 'normal',
//	    	                dataLabels: {
//	    	                    enabled: true,
//	    	                    color:  'white',
//	    	                    style: {
//	    	                        textShadow: '0 0 3px black'
//	    	                    },
//	    	                    format: format
//	    	                }
//	    	            }
//	    	        },
//	    	        series: series
//	    	    });
//        
//				},// endof success for ajax
//				failure:function(result, request) {
//					Ext.MessageBox.show({
//			            title: '연결 종료',
//			            msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
//			            buttons: Ext.MessageBox.OK,
//			            //animateTarget: btn,
//			            scope: this,
//			            icon: Ext.MessageBox['ERROR'],
//			            fn: function() {
//			            	//$(window.document.location).attr("href", "/xdview/index.do?method=main");
//			            }
//			        });
//				}
//			}); // endof Ajax
//}


function redrawProduceChart2(code, inName) {
	
	Ext.getCmp('projectorg-center-east' +'id').setLoading(true);
	

       var s1 = gColumnChartStyle;
        s1['renderTo'] ='projectorg-center-east-graph';
        //s1['type'] = 'bar';
        ocProduceStateCenterEast = new Highcharts.Chart({

			    chart: s1,
			    
	    	    title: {
	    	            text: '<div class="title02"><span>' + '공정별' + '</span> 생산실적 ' + '</div>',
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

	    	                categories: [
								'롤컷팅',
								'재단',
								'출력',
								'인쇄',
								'코팅',
								'금박',
								'형압',
								'합지',
								'톰슨',
								'포장',
								'접착',
								'철박이'
								
								]

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
					        ,cursor: 'pointer',
			                point: {
			                    events: {
			                        click: function () {
			                            console_logs('this', this);
			                            
			                            var arr = SERIES_BUFFER_ORG_MAP.get('redrawProduceChart2');
			                            for(var i=0; i<arr.length; i++) {
			                            	var o = arr[i];
			                            	//console_logs("o['name']==this.category", o['name']+ ":" + this.category);

			                            	if(o['name']==this.category) {
			                            		redrawProduceTable(selectedO1,  this.category);
			                            	}
			                            }

			                            
			                            
			                            
			                        }
			                    }
			                }
					    },
	    	            column: {
	    	                //stacking: 'normal',
	    	                dataLabels: {
	    	                    enabled: true,
	    	                    color:  'white',
	    	                    style: { textShadow: '0 0 3px black'/*, fontFamily: '"맑은 고딕", Malgun Gothic' , lineHeight: '18px', fontSize: '17px' */}//,
	    	                    //format: format
	    	                }
	    	            }
	    	        },
	    	        series: [{
	    	            type: 'column',
	    	            name: '계획LOT수',
	    	            data: [342, 232, 132, 3345, 2423, 1232, 2132, 3345, 423, 232, 132, 3345, 423]
	    	        }, {
	    	            type: 'column',
	    	            name: '완료LOT수',
	    	            data: [232, 2332, 1523, 7331, 6223, 1232, 132, 3345, 1423, 232, 132, 3345, 423]
	    	        }, {
	    	            type: 'column',
	    	            name: '계획수량',
	    	            data: [4323, 2323, 35, 934, 0, 2322, 3132, 3345, 423]
	    	        }, {
	    	            type: 'column',
	    	            name: '투입실적',
	    	            data: [342, 232, 132, 3345, 423, 2321, 3132, 3345, 423, 232, 4132, 3345, 423]
	    	        }, {
	    	            type: 'column',
	    	            name: '생산실적',
	    	            data: [232, 332, 523, 733, 6223, 232, 1132, 3345, 423, 232, 8132, 3345, 423]
	    	        }, {
	    	            type: 'column',
	    	            name: '불량수량',
	    	            data: [4323, 323, 35, 2934, 10, 232, 2132, 3345, 4823]
	    	        },{
	    	            type: 'spline',
	    	            name: '목표수량',
	    	            data: [323.0, 3423.0, 454, 3600.33, 2333.33,833,923,2434,1320,1440,1343,5340,3840],
	    	            marker: {
	    	                lineWidth: 2,
	    	                lineColor: Highcharts.getOptions().colors[3],
	    	                fillColor: 'white'
	    	            }
	    	        }/*, {
	    	            type: 'pie',
	    	            name: 'Total consumption',
	    	            data: [{
	    	                name: 'Jane',
	    	                y: 13,
	    	                color: Highcharts.getOptions().colors[0] // Jane's color
	    	            }, {
	    	                name: 'John',
	    	                y: 23,
	    	                color: Highcharts.getOptions().colors[1] // John's color
	    	            }, {
	    	                name: 'Joe',
	    	                y: 19,
	    	                color: Highcharts.getOptions().colors[2] // Joe's color
	    	            }],
	    	            center: [100, 80],
	    	            size: 100,
	    	            showInLegend: false,
	    	            dataLabels: {
	    	                enabled: false
	    	            }
	    	        }*/]
	    	    });
        Ext.getCmp('projectorg-center-east' +'id').setLoading(false);
}

Ext.define('FeedViewer.ProduceState', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.produceState',
	frame        : false,
    border: false,
	split: true,
//	style: {
//		borderColor: '#EAEAEA'
//	},
	bodyPadding: '1 0 0 0',
	createToolbar: function(){
        var items = [],
            config = {};
        if (!this.inTab) {
         
        	items.push({
			       emptyText: '조회구분',
	               xtype:          'combo',
	               id: 'produceState-SearchType',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          ORG_PARAMS['produceState-SearchType'],
	               triggerAction:  'all',
	               store: orgSearchTypeStore,
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
     	                    	ORG_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
				            }
     	               }
	            }, '-');
        	
           
			items.push({
			       emptyText: '',
	               xtype:          'combo',
	               id: 'produceState-Month',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          ORG_PARAMS['produceState-Month'],
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
     	                    	ORG_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
				            }
     	               }
	            }, '-');
	        items.push({
	        	xtype: 'component',
	            //html: '<div class="inputBT"><button type="button" onClick="redrawProduceChart1();"><span class="search">검색</span></button></div>'
	        	html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawProduceAll();"></button></span></div>'
	        });
	        items.push('->');
			if(vSYSTEM_TYPE != 'HANARO') {
				items.push({
					xtype : 'checkbox',
					id : 'chkAutorefresh3',
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
        
        }
        else {
            config.cls = 'x-docked-border-bottom';
        }
        config.cls = 'my-x-toolbar-default';
        return Ext.create('widget.toolbar', config);
    },

	
	layoutConfig: {columns: 1, rows:2},
			    defaults: {
			        collapsible: false,
			        split: true,
			        cmargins: '2 0 0 0',
			        margins: '0 0 0 0'
			    },
	bodyPadding: 10,
    initComponent: function(){
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
    loadFeed: function(url){
        //this.grid.loadFeed(url);
       // this.display.loadFeed(url);
    },

    /**
     * Creates the feed grid
     * @private
     * @return {FeedViewer.FeedGrid} feedGrid
     */
    createSouth: function(){
    	
    	this.south = gridProduceTable;

/*                
        this.south =  Ext.create('widget.gridProduceTeam', {
           layout:'border',
            region: 'south',
            minHeight: 300,
			collapsible: false,
			height: '50%',
            layout: 'fit'
        });
  */      
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
    onOpenAllClick: function(){
        this.fireEvent('openall', this);
    },

    /**
     * Create the center region container
     * @private
     * @return {Ext.panel.Panel} center
     */
    createCenter: function(){
    	
//    	var centerCenter = Ext.create('Ext.panel.Panel', {
//    		id: 'projectorg-center-center' +'id',
//            minHeight: 200,
//            minWidth: 150,
//            height: "50%",
//            region: 'center',
//            collapsible: false,
//            contentEl: 'projectorg-center-center',
//            listeners: {
//				'resize' : function(win,width,height,opt){
//					console_logs( 'projectorg-center-center resize ', height);
//					
//                 	if(ocProduceStateCenterCenter!=null && ocProduceStateCenterCenter!=undefined && ocProduceStateCenterCenter!='undefined') {
//		               ocProduceStateCenterCenter.setSize(  width,   height,  false    );   
//					   ocProduceStateCenterCenter.reflow();
//                 	}
//                 	
//                 }
//            }
//        });
        
    		    	
		var centerEast = Ext.create('Ext.panel.Panel', {
			id: 'projectorg-center-east' +'id',
            minHeight: 200,
            minWidth: 150,
            width: '80%',
            region: 'center',
            contentEl: 'projectorg-center-east',
            collapsible: false,
            listeners: {
				'resize' : function(win,width,height,opt){

                 	if(ocProduceStateCenterEast!=null && ocProduceStateCenterEast!=undefined && ocProduceStateCenterEast!='undefined') {
		               ocProduceStateCenterEast.setSize(  width,   height,  false    );   
					   ocProduceStateCenterEast.reflow();
                 	}
                 	
                 }
            }
        });
		

        
        this.center =  Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: false,
            height: "50%",
            region: 'center',
            minHeight: 200,
            layoutConfig: {columns: 2, rows:1},
			    defaults: {
			        //collapsible: true,
			        split: true,
			        cmargins: '2 0 0 0',
			        margins: '0 0 0 0'
			    },
            items: [centerEast, gridLotTable1]
        });
        return this.center;
    }
});