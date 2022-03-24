var orgSearchTypeStore= Ext.create('Xdview.store.CmmCodeStore', {parentCode:'588', hasNull:false});

var ocProjectOrgCenterEast = null;
var ocProjectOrgCenterCenter = null;

var selectedO1 = null;
var SERIES_BUFFER_ORG_MAP = new Ext.util.HashMap();

Ext.define('OrgTable', {
    extend: 'Ext.data.Model',
    fields: [ 
              'org1', 
              'org2', 
              'org3', 
              'org4', 
              'team_code',
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
              {    name: 'v12',   type: 'float' }
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

var storeOrgTable = new Ext.data.Store({  
	pageSize: 15,
	model: 'OrgTable'
});



var gridOrgTable = Ext.create('Ext.grid.Panel', {
	cls : 'mobis-panel',
	title: makeGridTitle('<span>팀별</span> 프로젝트 투입현황'),
	border: true,
	resizable: true,
	scroll: true,
	store: storeOrgTable,
    minWidth: 200,
    height: "50%",
    region: 'south',
    collapsible: false,
    columns: [{
            	dataIndex: 'id', text: 'ID',
            	hidden:true
            },{
		                text: '본부',
		                dataIndex: 'org1',
		                width:60,
		                cls:'mobis-grid-header', 
		                style: 'text-align:center',     align:'center'
		            }, {
		                text: '사업부/센터',
		                dataIndex: 'org2',
		                cls:'mobis-grid-header', 
		                style: 'text-align:center',     align:'center'
		            }, {
		            	text: '실',
		                dataIndex: 'org3',
		               cls:'mobis-grid-header', 
		                style: 'text-align:center',     align:'center'
		            }, {
						text: '팀',
		                dataIndex: 'org4',

		               cls:'mobis-grid-header', 
		                style: 'text-align:center',     align:'center'
		            }, 
            {
	            header: '선행 프로젝트',
	            sortable: false,
	            cls:'mobis-grid-header',
                style: 'background-color:#6ABDF6;',
	            columns: [
		            {
		                text: '인원수',
		                dataIndex: 'v1',
		                cls:'mobis-grid-header', 
		                style: 'background-color:#6ABDF6;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		                text: '공수',
		                dataIndex: 'v2',
		                cls:'mobis-grid-header', 
		                style: 'background-color:#6ABDF6;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '인건비',
		                dataIndex: 'v3',
		                cls:'mobis-grid-header', 
		                style: 'background-color:#6ABDF6;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }
	            ]
		      },
			{
	            header: '양산 프로젝트',
	            sortable: false,
	            cls:'mobis-grid-header',
	            style: 'background-color:#EBB462;',
	            columns: [
		            {
		                text: '인원수',
		                dataIndex: 'v4',
		                cls:'mobis-grid-header', 
		                style: 'background-color:#EBB462;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		                text: '공수',
		                dataIndex: 'v5',
		                cls:'mobis-grid-header', 
		                style: 'background-color:#EBB462;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '인건비',
		                dataIndex: 'v6',
		                cls:'mobis-grid-header', 
		                style: 'background-color:#EBB462;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }
	            ]
		      },
			{
	            header: '기타 프로젝트',
	            sortable: false,
	            cls:'mobis-grid-header',
	            style: 'background-color:#084695;',
	            columns: [
		            {
		                text: '인원수',
		                dataIndex: 'v7',
		                cls:'mobis-grid-header', 
		                style: 'background-color:#084695;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		                text: '공수',
		                dataIndex: 'v8',
		                cls:'mobis-grid-header', 
		                style: 'background-color:#084695;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '인건비',
		                dataIndex: 'v9',
		                cls:'mobis-grid-header', 
		                style: 'background-color:#084695;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }
	            ]
		      },
			{
	            header: '공통업무',
	            sortable: false,
	            cls:'mobis-grid-header',
	            style: 'background-color:#979797;',
	            columns: [
		            {
		                text: '인원수',
		                dataIndex: 'v10',
		                cls:'mobis-grid-header', 
		                style: 'background-color:#979797;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		                text: '공수',
		                dataIndex: 'v11',
		                cls:'mobis-grid-header', 
		                style: 'background-color:#979797;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '인건비',
		                dataIndex: 'v12',
		                cls:'mobis-grid-header', 
		                style: 'background-color:#979797;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }
	            ]
		      }
            
            ],
          bbar: getPageToolbar(storeOrgTable, true, null, function () {
                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
                        }),
		  listeners: {
		     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
			   //console_logs('record', record);
			   var title = '[<span style="color:#003471">' + ORG_PARAMS['projectOrg-Month'] + '</span>] 현황';
					popupUserProjectDetail(title, record, 'gridOrgTable', this, record.get('org4'));
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


function redrawOrgAll() {
	
	console_logs('redrawOrgAll()');

	redrawOrgChart1();
	redrawOrgChart2('RESEARCH', '연구');
	redrawOrgTable('RESEARCH', null);
}

function redrawOrgTable(o1, name_in) { //RESEARCH, 201502, 2015년 02월
	
		console_logs('redrawOrgTable -------------------- name_in ', name_in);
	
	
	
	var name = Ext.getCmp('projectOrg-Month').getValue();
	
	if(name_in!=null) {
		name = '20' + name_in.substring(1,3) + '년 ' + name_in.substring(4,7) + '월';
	}
	
	
	gridOrgTable.setTitle(makeGridTitle('<span style="color:#003471">'+ name + '</span> 팀별 프로젝트별 투입현황'));
	
	ORG_PARAMS['cubeCode'] = 'PJ_ORG';
	ORG_PARAMS['projectChartType'] = 'PJ_ORG_TABLE';
	ORG_PARAMS['projectOrg-Month'] = name;

	storeOrgTable.removeAll(true);

	storeOrgTable.getProxy().setExtraParam('cubeCode', ORG_PARAMS['cubeCode']);
	storeOrgTable.getProxy().setExtraParam('projectChartType', ORG_PARAMS['projectChartType']);
	storeOrgTable.getProxy().setExtraParam('projectOrg-Month', ORG_PARAMS['projectOrg-Month']);
	
	gridOrgTable.setLoading(true);				
	storeOrgTable.load(function(records){
		console_logs('redrawOrgTable records', records);
		gridOrgTable.setLoading(false);
	});

	/*
Ext.Ajax.request({
				url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
				params:ORG_PARAMS,
				success : function(response, request) {
					//console_logs('response.responseText', response.responseText);
					var val = Ext.JSON.decode(response.responseText);
					var records = val['records'];

					storeOrgTable.removeAll(true);
					for(var i=0; i<records.length; i++) {
						
						var rec = records[i];
						
						//console_logs('redrawOrgTable rec', rec);

						storeOrgTable.add({
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

					gridOrgTable.setLoading(false);
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

function redrawOrgChart1() {
	ORG_PARAMS['cubeCode'] = 'PJ_ORG';
	ORG_PARAMS['projectChartType'] = 'PJ_ORG1';
	
	
	
	//console_logs('------------------> projectOrg-Month', Ext.getCmp('projectOrg-Month').getValue());
	ORG_PARAMS['projectOrg-Month'] = Ext.getCmp('projectOrg-Month').getValue();
	
	
	
	
	Ext.getCmp('projectorg-center-center' +'id').setLoading(true);

 	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
			params:ORG_PARAMS,
			success : function(response, request) {
				
				Ext.getCmp('projectorg-center-center' +'id').setLoading(false);

				var val = Ext.JSON.decode(response.responseText);

				var cat = val['aXis'];
				var arr = [];
				var aXis = [];
				var firstCode = null;
				var firstName = null;
				for(var i=0; i<cat.length; i++) {
					var res = cat[i].split(":");
					var code = res[0];
					var name = res[1];
					//name = "'"+name.substring(2,4) + '/' + name.substring(6,8);
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

				SERIES_BUFFER_ORG_MAP.add('redrawOrgChart1', arr);
				//console_logs('redrawOrgChart1 aXis', aXis);
				
				
				console_logs('redrawOrgChart2 firstCode', firstCode);
				console_logs('redrawOrgChart2 firstName', firstName);
					    	   		
				var series = val['series'];
				arrangeColor(series);
				
				var unitDisp = '';
				var format = '';
		        switch(ORG_PARAMS['projectOrg-SearchType']) {
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
				
				var sProjectOrgCenterCenter = gColumnChartStyle;
		        sProjectOrgCenterCenter['renderTo'] ='projectorg-center-center-graph';
				
		        ocProjectOrgCenterCenter = new Highcharts.Chart({

			    chart: sProjectOrgCenterCenter,
			    title: {
	    	            text: '<div class="title02"><span>본부별</span> 프로젝트 투입추이 ' + unitDisp + '</div>',
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
			                            console_logs('this', this);
			                            var arr = SERIES_BUFFER_ORG_MAP.get('redrawOrgChart1');
			                            for(var i=0; i<arr.length; i++) {
			                            	var o = arr[i];
			                            	console_logs('o', o);

			                            	if(o['name']==this.category) {
			                            		redrawOrgChart2(o['code'], this.category);
			                            	}
			                            }
			                            
			                            
			                            //var res = this.category.split("(");
			                            //redrawOrgChart2(res[0]);
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


function redrawOrgChart2(code, inName) {
	
	Ext.getCmp('projectorg-center-east' +'id').setLoading(true);
	
	//console_logs('redrawOrgChart2 -- ' + code, inName);
	selectedO1 = code;
	
	ORG_PARAMS['cubeCode'] = 'PJ_ORG';
	ORG_PARAMS['projectChartType'] = 'PJ_ORG2';
	ORG_PARAMS['projectOrg-O1'] = code;
	ORG_PARAMS['projectOrg-Month'] = Ext.getCmp('projectOrg-Month').getValue();

 	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
			params:ORG_PARAMS,
			success : function(response, request) {
				Ext.getCmp('projectorg-center-east' +'id').setLoading(false);
				
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
					name = "'"+name.substring(2,4) + '/' + name.substring(6,8); 
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

				SERIES_BUFFER_ORG_MAP.add('redrawOrgChart2', arr);


				//redrawOrgTable(selectedO1, firstCode, firstName);
				
				var series = val['series'];
				arrangeColor(series);

				var unitDisp = '';
				var format = '';
		        switch(ORG_PARAMS['projectOrg-SearchType']) {
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
					
		       if(inName=='연구') {
		       	inName = '연구개발본부';
		       }
		       if(inName=='품질') {
		       	inName = '품질연구소';
		       }
		        if(inName=='생산') {
		       	inName = '생산개발센터';
		       }
		       if(inName=='기타') {
		       	inName = '기타조직';
		       }
		       
       var s1 = gColumnChartStyle;
        s1['renderTo'] ='projectorg-center-east-graph';
        ocProjectOrgCenterEast = new Highcharts.Chart({

			    chart: s1,
			    
	    	 title: {
	    	            text: '<div class="title02"><span>' + inName + '</span> 프로젝트 투입 추이 ' + unitDisp + '</div>',
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
					        ,cursor: 'pointer',
			                point: {
			                    events: {
			                        click: function () {
			                            console_logs('this', this);
			                            
			                            var arr = SERIES_BUFFER_ORG_MAP.get('redrawOrgChart2');
			                            for(var i=0; i<arr.length; i++) {
			                            	var o = arr[i];
			                            	//console_logs("o['name']==this.category", o['name']+ ":" + this.category);

			                            	if(o['name']==this.category) {
			                            		redrawOrgTable(selectedO1,  this.category);
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
	    	                    style: { textShadow: '0 0 3px black'/*, fontFamily: '"현대하모니 L", Malgun Gothic' , lineHeight: '18px', fontSize: '17px' */},
	    	                    format: format
	    	                }
	    	            }
	    	        },
	    	        series: series
	    	    });
        
					
				},// endof success for ajax
				failure:function(result, request) {
					Ext.getCmp('projectorg-center-east' +'id').setLoading(false);
				}
			}); // endof Ajax
	

        
}

Ext.define('FeedViewer.ProjectOrg', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.projectOrg',
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
	               id: 'projectOrg-SearchType',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          ORG_PARAMS['projectOrg-SearchType'],
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
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');
        	
           
			items.push({
			       emptyText: '',
	               xtype:          'combo',
	               id: 'projectOrg-Month',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          ORG_PARAMS['projectOrg-Month'],
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
     	                    	ORG_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');
	        items.push({
	        	xtype: 'component',
	            //html: '<div class="inputBT"><button type="button" onClick="redrawOrgChart1();"><span class="search">검색</span></button></div>'
	        	html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawOrgAll();"></button></span></div>'
	        });
	        items.push('->');
	        
	    	items.push({
				xtype : 'checkbox',
				id : 'chkAutorefresh3',
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
    	
    	this.south = gridOrgTable;

/*                
        this.south =  Ext.create('widget.gridOrgTeam', {
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
    	
    	var centerCenter = Ext.create('Ext.panel.Panel', {
    		id: 'projectorg-center-center' +'id',
            minHeight: 200,
            minWidth: 150,
            height: "50%",
            region: 'center',
            collapsible: false,
            contentEl: 'projectorg-center-center',
            listeners: {
				'resize' : function(win,width,height,opt){
					console_logs( 'projectorg-center-center resize ', height);
					
                 	if(ocProjectOrgCenterCenter!=null && ocProjectOrgCenterCenter!=undefined && ocProjectOrgCenterCenter!='undefined') {
		               ocProjectOrgCenterCenter.setSize(  width,   height,  false    );   
					   ocProjectOrgCenterCenter.reflow();
                 	}
                 	
                 }
            }
        });
        
    		    	
		var centerEast = Ext.create('Ext.panel.Panel', {
			id: 'projectorg-center-east' +'id',
            minHeight: 200,
            minWidth: 150,
            width: "60%",
            region: 'east',
            contentEl: 'projectorg-center-east',
            collapsible: false,
            listeners: {
				'resize' : function(win,width,height,opt){

                 	if(ocProjectOrgCenterEast!=null && ocProjectOrgCenterEast!=undefined && ocProjectOrgCenterEast!='undefined') {
		               ocProjectOrgCenterEast.setSize(  width,   height,  false    );   
					   ocProjectOrgCenterEast.reflow();
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