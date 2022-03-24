var orgSearchTypeStore= Ext.create('Xdview.store.CmmCodeStore', {parentCode:'588', hasNull:false});

var ocProjectProductCenterEast = null;
var ocProjectProductCenterCenter = null;

var selectedL1 = null;
var selectedL1Name = null;
var selectedL2 = null;
//차트에서 이름으로 코드를 가져오는 버퍼.
var SERIES_BUFFER_PRODUCT_MAP = new Ext.util.HashMap();


Ext.define('ProductTable1', {
    extend: 'Ext.data.Model',
    fields: [
       {    name: 'type'  },
       {    name: 'bonbu1',    type: 'float' },
       {    name: 'bonbu2',    type: 'float' },
       {    name: 'bonbu3',    type: 'float' },
       {    name: 'bonbu4',    type: 'float' }
   ]
});

Ext.define('ProductTable2', {
    extend: 'Ext.data.Model',
    fields: [ 
              'org1', 
              'org2', 
              'org3', 
              'org4',  'team_code', 
              {    name: 'v1',   type: 'float' },
              {    name: 'v2',   type: 'float' },
              {    name: 'v3',   type: 'float' },
              'auxInfo'
              ]
});

var storeProductTable1 = new Ext.data.Store({  
	model: 'ProductTable1'
});

var storeProductTable2 = new Ext.data.Store({  
	model: 'ProductTable2',
	    groupField: 'org1'
});


var gridProductTable1 = Ext.create('Ext.grid.Panel', {
	cls : 'mobis-panel',
	title: makeGridTitle('소분류 제품별 투입현황'),
	border: true,
	resizable: true,
	store: storeProductTable1,
	scroll: false,
    minWidth: 200,
    //width: "50%",
    region: 'center',
    collapsible: false,    
    columns: [{
    	dataIndex: 'id', text: 'ID',
    	hidden:true
    },{
        header: '단위제품',
        dataIndex: 'type',
        flex: 60 / 100,
        cls:'mobis-grid-header', 
        style: 'text-align:center',     align:'left'
    }, 
    {
        header: '구분',
        sortable: false,
        cls:'mobis-grid-header', 
        //flex: 40 / 100,
        columns: [
            {
                text: '연구',
                dataIndex: 'bonbu1',
                width: 100,
                cls:'mobis-grid-header', 
                style: 'background-color:#6ABDF6;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
            }, {
                text: '품질',
                dataIndex: 'bonbu2',
                width: 100,
                cls:'mobis-grid-header', 
                style: 'background-color:#EBB462;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
            }, {
            	text: '생기',
                dataIndex: 'bonbu3',
                width: 100,
                cls:'mobis-grid-header', 
                style: 'background-color:#084695;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
            }, {
				text: '기타',
                dataIndex: 'bonbu4',
                width: 100,
                cls:'mobis-grid-header', 
                style: 'background-color:#979797;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
            }
        ]
    }]//columns
//	,bbar: getPageToolbar(storeProductTable1, true, null, function () {
//                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                        })
});

//var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
//        groupHeaderTpl: ' {name} 본부: ({rows.length} 건)'
//    });
var gridProductTable2 = Ext.create('Ext.grid.Panel', {
	cls : 'mobis-panel',
	title: makeGridTitle('<span style="color:#003471">조직별</span> 투입현황'),
	border: true,
	resizable: true,
	store: storeProductTable2,
	scroll: true,
    minWidth: 200,
    width: "50%",
    region: 'east',
    collapsible: false,
//	features: [groupingFeature],
//	features: [
//	  {
//		   ftype: 'grouping',
//		   groupHeaderTpl: [
//		    ' {name}  {columnName} : ({rows.length})'
//		   ],
//		   hideGroupedHeader: false,
//		   startCollapsed: false
//		  }
//	 ],

    columns: [{
            	dataIndex: 'id', text: 'ID',
            	hidden:true
            },{
		                text: '본부',
		                dataIndex: 'org1',
		                width: 60,
		                cls:'mobis-grid-header', 
		                style: 'text-align:center',     align:'center',
		                hidden: true
		            }, {
		                text: '사업부/센터',
		                dataIndex: 'org2',
		                flex: 25 / 100,
		                cls:'mobis-grid-header', 
		                style: 'text-align:center',     align:'left'
		            }, {
		            	text: '실',
		                dataIndex: 'org3',
		               flex: 25 / 100,
		               cls:'mobis-grid-header', 
		                style: 'text-align:center',     align:'left'
		            }, {
						text: '팀',
		                dataIndex: 'org4',
		               flex: 25 / 100,
		               cls:'mobis-grid-header', 
		                style: 'text-align:center',     align:'left'
		            }, 
            {
	            header: '투입현황',
	            sortable: false,
	            cls:'mobis-grid-header', 
	            flex: 40 / 100,
	            columns: [
		            {
		                text: '인원수',
		                dataIndex: 'v1',
		                flex: 33 / 100,
		                cls:'mobis-grid-header', 
		                style: 'text-align:center',     align:'right',
		                renderer : Util.thousandsRenderer()
		            }, {
		                text: '공수',
		                dataIndex: 'v2',
		                flex: 33 / 100,
		                cls:'mobis-grid-header', 
		                style: 'text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '인건비',
		                dataIndex: 'v3',
		                flex: 34 / 100,
		                cls:'mobis-grid-header', 
		                style: 'text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }
	            ]}
            
            ],
		listeners: {
		   itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
			   
			   var title = '[<span style="color:#003471">' + Ext.getCmp('projectProduct-Month').getValue() + '</span>] 현황';
//					console_logs('view', view);
//					console_logs('record', record);
//					console_logs('htmlItem', htmlItem);
//					console_logs('index', index);
//					console_logs('eventObject', eventObject);
//					console_logs('opts', opts);
			
			   var level = Number(document.getElementById('SELECTED_PRODUCT_LEVEL').value );
			   	var titleName='';
				switch(level) {
				case 1:
					titleName = document.getElementById('SELECTED_PRODUCT_L1_NAME').value;
					break;
				case 2:
					titleName = document.getElementById('SELECTED_PRODUCT_L1_NAME').value + ' - ' +
									 document.getElementById('SELECTED_PRODUCT_L2_NAME').value;
					break;
				case 3:
					titleName = document.getElementById('SELECTED_PRODUCT_L1_NAME').value + ' - ' +
									 document.getElementById('SELECTED_PRODUCT_L2_NAME').value + ' - ' +
									 document.getElementById('SELECTED_PRODUCT_L3_NAME').value;
					break;
				}
				
					popupUserProjectDetail(title, record, 'gridProductTable2', this, titleName);
			 }
		}
//	,bbar: getPageToolbar(storeProductTable2, true, null, function () {
//                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                        })
});

 gridProductTable1.getSelectionModel().on({
    selectionchange: function(sm, selections) {
    	
    	//console_logs(selections.length);
    	if (selections.length) {
    		//console_logs(selections[0]);
    		var o = selections[0];
    		//console_logs('id', o.get('id') );
			//redrawProductTable2('projectProduct-L3', o.get('id'), o.get('type'));
			
    		
    		document.getElementById('SELECTED_PRODUCT_L3').value =o.get('id');
			document.getElementById('SELECTED_PRODUCT_L3_NAME').value =o.get('type');
			if( o.get('id') !='NULL') {
    			redrawProductTable2(null, null, o.get('id'), o.get('type'), 3);
			}
			
    	}
    	
    }

});

function redrawProductTable2(l1,l2,l3,name, level) {

	console_logs('log','-------------------------------');
	//console_logs('product redrawProductTable2', l1 + ',' + l2 + ',' + l3 + ',' + name +  ' :  ' + level);
	
	gridProductTable2.setLoading(true);
	
	document.getElementById('SELECTED_PRODUCT_LEVEL').value = ''+level;
	var myO = {};
	myO['cubeCode'] = 'PJ_PRODUCT';
	myO['projectChartType'] = 'PJ_TABLE2';
	myO['projectProduct-Month'] = PRODUCT_PARAMS['projectProduct-Month'];
	myO['projectProduct-SearchType'] = PRODUCT_PARAMS['projectProduct-SearchType'];
	myO['projectProduct-SearchOrg'] = PRODUCT_PARAMS['projectProduct-SearchOrg'];
	
	
	var titleName='';
	switch(level) {
	case 1:
		titleName = document.getElementById('SELECTED_PRODUCT_L1_NAME').value;
		myO['projectProduct-L1'] = document.getElementById('SELECTED_PRODUCT_L1').value;
		break;
	case 2:
		titleName = document.getElementById('SELECTED_PRODUCT_L1_NAME').value + ' - ' +
						 document.getElementById('SELECTED_PRODUCT_L2_NAME').value;
		myO['projectProduct-L1'] = document.getElementById('SELECTED_PRODUCT_L1').value;
		myO['projectProduct-L2'] = document.getElementById('SELECTED_PRODUCT_L2').value;
		break;
	case 3:
		titleName = document.getElementById('SELECTED_PRODUCT_L1_NAME').value + ' - ' +
						 document.getElementById('SELECTED_PRODUCT_L2_NAME').value + ' - ' +
						 document.getElementById('SELECTED_PRODUCT_L3_NAME').value;
		myO['projectProduct-L1'] = document.getElementById('SELECTED_PRODUCT_L1').value;
		myO['projectProduct-L2'] = document.getElementById('SELECTED_PRODUCT_L2').value;
		myO['projectProduct-L3'] = document.getElementById('SELECTED_PRODUCT_L3').value;
		break;
	}
	

	console_logs('myO', myO);
	
	gridProductTable2.setTitle(makeGridTitle('<span style="color:#003471">'+ titleName + '</span> 조직별 투입현황'));
		
 	Ext.Ajax.request({
				url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
				params: myO,
				success : function(response, request) {
					//console_logs('response.responseText', response.responseText);
					var val = Ext.JSON.decode(response.responseText);
					var records = val['records'];
					storeProductTable2.removeAll(true);
					for(var i=0; i<records.length; i++) {
						
						var rec = records[i];

						//console_logs('product table2 rec', rec);
						storeProductTable2.add({
							org1: rec[0]=='NULL' ? '' : rec[0],
					        org2: rec[1]=='NULL' ? '' : rec[1],
					        org3: rec[2]=='NULL' ? '' : rec[2],
					        org4: rec[3]=='NULL' ? '' : rec[3],
					        team_code: rec[4],
					        v1: rec[5],
					        v2: rec[6],
					        v3: rec[7],
					        auxInfo: rec[rec.length-1]
					    });
						
						gridProductTable2.setLoading(false);
					
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

function redrawProductTable1(l1, code, name) {
	
	//console_logs('redrawProductTable1', l1 + ':' + code + ':' + name);

	gridProductTable1.setLoading(true);
	
	selectedL2 = code;
	
	
	PRODUCT_PARAMS['projectProduct-L1'] = null;
	PRODUCT_PARAMS['projectProduct-L2'] = null;
	PRODUCT_PARAMS['projectProduct-L3'] = null;
	
	PRODUCT_PARAMS['cubeCode'] = 'PJ_PRODUCT';
	PRODUCT_PARAMS['projectChartType'] = 'PJ_TABLE1';
	PRODUCT_PARAMS['projectProduct-L1'] = l1;
	PRODUCT_PARAMS['projectProduct-L2'] = code;

	var title_name = document.getElementById('SELECTED_PRODUCT_L1_NAME').value + ' - ' + name;
	gridProductTable1.setTitle(makeGridTitle('<span style="color:#003471">'+ title_name + '</span> 제품 투입현황'));

 	Ext.Ajax.request({
				url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
				params:PRODUCT_PARAMS,
				success : function(response, request) {
					//console_logs('response.responseText', response.responseText);
					var val = Ext.JSON.decode(response.responseText);
					var records = val['records'];

					storeProductTable1.removeAll(true);
					for(var i=0; i<records.length; i++) {
						var rec = records[i];
						
						storeProductTable1.add({
							id: rec[0],
					        type: rec[1]=='NULL' ? '( ' + '없음' + ' )' :  rec[1],
					        bonbu1: rec[5],
					        bonbu2: rec[8],
					        bonbu3: rec[11],
					        bonbu4: rec[14]
					    });
					
					}//endof for

					gridProductTable1.setLoading(false);
	
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

function redrawProductChart1() {
					
	storeProductTable2.removeAll();
				
	PRODUCT_PARAMS['cubeCode'] = 'PJ_PRODUCT';
	PRODUCT_PARAMS['projectChartType'] = 'PJ_PRODUCT1';
	
	Ext.getCmp('projectproduct-center-center' +'id').setLoading(true);
	
 	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
			params:PRODUCT_PARAMS,
			success : function(response, request) {

				Ext.getCmp('projectproduct-center-center' +'id').setLoading(false);
				
				var val = Ext.JSON.decode(response.responseText);
				var cat = val['aXis'];
				var arr = [];
				var aXis = [];
				moveNullPos(cat, val['series'], aXis,arr);
				
				var firstCode = arr[0]['code'];
				var firstName = arr[0]['name'];

				SERIES_BUFFER_PRODUCT_MAP.add('redrawProductChart1', arr);

				var series = val['series'];
				arrangeColorOrg(series);
				
				var unitDisp = '';
				var format = '';
		        switch(PRODUCT_PARAMS['projectProduct-SearchType']) {
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
  					format = '{y:,.1f}';
		        	break;
		        }	
		   	
		        document.getElementById('SELECTED_PRODUCT_L1').value =firstCode;
				document.getElementById('SELECTED_PRODUCT_L1_NAME').value =firstName;
				
				redrawProductChart2(firstCode, firstName);
					    	   		
				var sProjectProductCenterCenter = gColumnChartStyle;
		        sProjectProductCenterCenter['renderTo'] ='projectproduct-center-center-graph';

		        ocProjectProductCenterCenter = new Highcharts.Chart({

			    chart: sProjectProductCenterCenter,
			    title: {
	    	            text: '<div class="title02"><span>제품분야 별</span> 투입현황 ' + unitDisp + '</div>',
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
					        ,cursor: 'pointer',
			                point: {
			                    events: {
			                        click: function () {
			                        	
//			                        	        for (var i = 0; i < this.series.data.length; i++) {
//					                                this.series.data[i].update({ 
//					                                	borderWidth: 0,
//					                            		borderColor: '#FFFFFF'
//					                                }, true, false);
//					                            }
//					                            this.update({ 
//					                            	borderWidth: 2,
//					                            	borderColor: '#FF0000'
//					                            }, true, false);
			                        	
			                        	
			                            //console_logs('this', this);
			                            var arr = SERIES_BUFFER_PRODUCT_MAP.get('redrawProductChart1');
			                            for(var i=0; i<arr.length; i++) {
			                            	var o = arr[i];
			                            	//console_logs('o', o);

			                            	if(o['name']==this.category) {
			                            		
			                            		document.getElementById('SELECTED_PRODUCT_L1').value = o['code'];
			                            		document.getElementById('SELECTED_PRODUCT_L1_NAME').value = o['name'];
			                            		
			                            		redrawProductChart2(o['code'], this.category);
												if(o['code'] !='NULL') {
			                            			redrawProductTable2(o['code'], null, null, this.category, 1);
												}
			                            		
			                            	
			                            	}
			                            }
			                            
			                            
			                            //var res = this.category.split("(");
			                            //redrawProductChart2(res[0]);
			                        	//alert('Category: ' + this.category + ', value: ' + this.y);
			                        }
			                    }
			                }
					    },
	    	            column: {
	    	                stacking: 'normal',
	    	                dataLabels: {
	    	                    enabled: true,
	    	                    color:  'white',
	    	                    style: {
	    	                        textShadow: '0 0 3px black'
	    	                    },
	    	                    format: format
	    	                }
	    	            }
	    	        },
	    	        series: series
	    	    });
        
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
			}); // endof Ajax
}


function redrawProductChart2(code, name) {
	
	selectedL1 = code;
	selectedL1Name = name;
	PRODUCT_PARAMS['cubeCode'] = 'PJ_PRODUCT';
	PRODUCT_PARAMS['projectChartType'] = 'PJ_PRODUCT2';
	PRODUCT_PARAMS['projectProduct-L1'] = code;
	
	
	//console_logs('PRODUCT_PARAMS', PRODUCT_PARAMS);
	
	Ext.getCmp('projectproduct-center-east' +'id').setLoading(true);
	
 	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
			params:PRODUCT_PARAMS,
			success : function(response, request) {
				Ext.getCmp('projectproduct-center-east' +'id').setLoading(false);
				//console_logs('response.responseText', response.responseText);
				var val = Ext.JSON.decode(response.responseText);
				//console_logs("val['series']", val['series']);
				//console_logs("val['aXis']", val['aXis']);
				var cat = val['aXis'];
				var arr = [];
				var aXis = [];
				var firstCode = null;
				var firstName = null;
				for(var i=0; i<cat.length; i++) {
					var res = cat[i].split(":");
					var code = res[0];
					var name = res[1];
					var o = { code : code,
							  name : name
							};
					arr.push(o);
					aXis.push(name);
					
					if(i==0) {
						firstCode = code;
						firstName = name;
					}
				}

				SERIES_BUFFER_PRODUCT_MAP.add('redrawProductChart2', arr);

				var series = val['series'];
				arrangeColorOrg(series);
				
				var unitDisp = '';
				var format = '';
		        switch(PRODUCT_PARAMS['projectProduct-SearchType']) {
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
  					format = '{y:,.1f}';
		        	break;
		        }				
				
				document.getElementById('SELECTED_PRODUCT_L2').value = firstCode;
				document.getElementById('SELECTED_PRODUCT_L2_NAME').value = firstName;
				redrawProductTable1(selectedL1, firstCode, firstName);
					
					
       var s1 = gColumnChartStyle;
        s1['renderTo'] ='projectproduct-center-east-graph';
        ocProjectProductCenterEast = new Highcharts.Chart({

			    chart: s1,
			    
	    	 title: {
	    	            text: '<div class="title02"><span>' + selectedL1Name + '</span> 제품분야 투입현황'+ unitDisp +'</div>',
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
	    	            pointFormat: '{series.name}: {point.y:,.1f}<br/>합계: {point.stackTotal:,.1f}'
	    	        },
	    	        plotOptions: {
	    	        	series: {animation: { duration: 200  },
					        pointPadding: 0, // Defaults to 0.1
					        groupPadding: 0.05 // Defaults to 0.2
					        ,cursor: 'pointer',
			                point: {
			                    events: {
			                        click: function () {
			                            //console_logs('this', this);
			                            
			                            var arr = SERIES_BUFFER_PRODUCT_MAP.get('redrawProductChart2');
			                            for(var i=0; i<arr.length; i++) {
			                            	var o = arr[i];
			                            	//console_logs('o', o);

			                            	if(o['name']==this.category) {
			                            		document.getElementById('SELECTED_PRODUCT_L2').value =o['code'];
			                            		document.getElementById('SELECTED_PRODUCT_L2_NAME').value = o['name'];
			                            		
			                            		redrawProductTable1(document.getElementById('SELECTED_PRODUCT_L1').value, o['code'], this.category);
			                            		if( o['code'] !='NULL') {
			                            			redrawProductTable2(document.getElementById('SELECTED_PRODUCT_L1').value, o['code'], null,  this.category, 2);
			                            		}
			                            		

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
	    	                    color:  'white',
	    	                    style: {
	    	                        textShadow: '0 0 3px black'
	    	                    },
	    	                    format: format
	    	                }
	    	            }
	    	        },
	    	        series: series
	    	    });
        
					
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
Ext.define('FeedViewer.ProjectProduct', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.projectProduct',
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
	               id: 'projectProduct-SearchType',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          PRODUCT_PARAMS['projectProduct-SearchType'],
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
     	                    	PRODUCT_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				                //output.setBodyStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');
        	
			items.push({
			       emptyText: '조직구분',
	               xtype:          'combo',
	               id: 'projectProduct-SearchOrg',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          '',
	               triggerAction:  'all',
	               store: Ext.create('Xdview.store.CmmCodeStore', {parentCode:'531'}),
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
     	                    	PRODUCT_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');
            
			items.push({
			       emptyText: '',
	               xtype:          'combo',
	               id: 'projectProduct-Month',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          PRODUCT_PARAMS['projectProduct-Month'],
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
     	                    	PRODUCT_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				                //output.setBodyStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');
			
	        items.push({
	        	xtype: 'component',
	           // html: //'<div class="inputBT"><button type="button" onClick="redrawProductChart1();"><span class="search">검색</span></button></div>'
				html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawProductChart1();"></button></span></div>'
	        });
	        items.push('->');
	        
	        items.push({
				xtype : 'checkbox',
				id : 'chkAutorefresh2',
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
    	
//        var southCenter = Ext.create('widget.feedgrid3', {
//            minWidth: 200,
//            width: "40%",
//            html: 'south-center',
//            region: 'center',
//            collapsible: false,
//            layout: 'fit'
//        });
    	
//        var southEast = Ext.create('widget.feedgrid4', {
//            minWidth: 200,
//            width: "50%",
//            html: 'south-east',
//            region: 'east',
//            collapsible: false,
//            layout: 'fit'
//        });
        
       
        
        var southItems = [];
        
        if(VIEW_ALL_POWER==true) {
        	southItems.push(gridProductTable2);
        }
        southItems.push(gridProductTable1);
        
        this.south =  Ext.create('Ext.panel.Panel', {
           layout:'border',
            region: 'south',
            height: "50%",
            minHeight: 300,
            layoutConfig: {columns: 2, rows:1},
			    defaults: {
			        //collapsible: true,
			        split: true,
			        cmargins: '2 0 0 0',
			        margins: '0 0 0 0'
			    },
            items: southItems
        });
        
        //초기값 설정

//		for(var i=0; i<5; i++) {
//		
//			var type = '';
//			var bonbu1='';
//			var bonbu2='';
//			var bonbu3='';
//			var bonbu4='';
//
//			storeProductTable1.add({
//		        type: type,
//		        bonbu1: bonbu1,
//		        bonbu2: bonbu2,
//		        bonbu3: bonbu3,
//		        bonbu4: bonbu4
//		    });
//		
//		}//endof for
					
        return this.south;

    },

    /**
     * Fires when a grid row is selected
     * @private
     * @param {FeedViewer.FeedGrid} grid
     * @param {Ext.data.Model} rec
     */
    onSelect: function(grid, rec) {
    	//console_logs('onSelect', rec);
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
    	
    	var centerCenter = Ext.create('Ext.panel.Panel', {
    		id: 'projectproduct-center-center' +'id',
            minHeight: 200,
            minWidth: 150,
            height: "50%",
            region: 'center',
            collapsible: false,
            contentEl: 'projectproduct-center-center',
            listeners: {
				'resize' : function(win,width,height,opt){
                 	if(ocProjectProductCenterCenter!=null && ocProjectProductCenterCenter!=undefined && ocProjectProductCenterCenter!='undefined') {
		               ocProjectProductCenterCenter.setSize(  width,   height,  false    );   
					   ocProjectProductCenterCenter.reflow();
                 	}
                 	
                 }
            }
        });

		//redrawProductChart1();

		var centerEast = Ext.create('Ext.panel.Panel', {
			id: 'projectproduct-center-east' +'id',
            minHeight: 200,
            minWidth: 150,
            width: "50%",
            region: 'east',
            contentEl: 'projectproduct-center-east',
            collapsible: false,
            listeners: {
				'resize' : function(win,width,height,opt){

                 	if(ocProjectProductCenterEast!=null && ocProjectProductCenterEast!=undefined && ocProjectProductCenterEast!='undefined') {
		               ocProjectProductCenterEast.setSize(  width,   height,  false    );   
					   ocProjectProductCenterEast.reflow();
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
            items: [centerEast, centerCenter]
        });
        return this.center;
    }
});