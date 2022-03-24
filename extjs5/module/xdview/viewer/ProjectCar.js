var carSearchTypeStore= Ext.create('Rfx.store.CmmCodeStore', {parentCode:'588', hasNull:false});

var ocProjectCarCenter = null;

var SERIES_BUFFER_CAR_MAP = new Ext.util.HashMap();

var selectedC1 = null;

var center = null;

Ext.define('CarTable', {
    extend: 'Ext.data.Model',
    fields: [ 
              'producttitle', 
              'pj_code', 
              'pj_name', 
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
              ]
});

var storeCarTable = new Ext.data.Store({  
	model: 'CarTable'
});

var gridCarTable = Ext.create('Ext.grid.Panel', {
	cls : 'rfx-panel',
	title: makeGridTitle('프로젝트별 투입현황'),
	border: true,
	resizable: true,
	scroll: true,
	store: storeCarTable,
    minWidth: 200,
    height: "50%",
    region: 'south',
    collapsible: false,    
    columns: [{
            	dataIndex: 'id', text: 'ID',
            	hidden:true
            }, {
                text: '코드',
                width:60,
                hidden: true,
                dataIndex: 'pj_code',
                cls:'rfx-grid-header', 
                style: 'text-align:center',     align:'center'
            },{
            	text: '프로젝트',
                dataIndex: 'pj_name',
                width:180,
               cls:'rfx-grid-header', 
                style: 'text-align:center',     align:'left'
            },{
                text: '제품',
                dataIndex: 'producttitle',
                width:100,
                cls:'rfx-grid-header', 
                style: 'text-align:center',     align:'center'
            }, 
            {
	            header: '연구',
	            sortable: false,
	            cls:'rfx-grid-header',
	            style: 'background-color:#B0D698;',
	            columns: [
		            {
		                text: '인원수',
		                dataIndex: 'v1',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#B0D698;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		                text: '공수',
		                dataIndex: 'v2',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#B0D698;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '인건비',
		                dataIndex: 'v3',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#B0D698;text-align:center',    align:'right', renderer : Util.thousandsRenderer()
		            }
	            ]
		      },
			{
	            header: '품질',
	            sortable: false,
	            cls:'rfx-grid-header',
	            style: 'background-color:#EBB462;',
	            columns: [
		            {
		                text: '인원수',
		                dataIndex: 'v4',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#EBB462;text-align:center',      align:'right', renderer : Util.thousandsRenderer()
		            }, {
		                text: '공수',
		                dataIndex: 'v5',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#EBB462;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '인건비',
		                dataIndex: 'v6',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#EBB462;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }
	            ]
		      },
			{
	            header: '생기',
	            sortable: false,
	            cls:'rfx-grid-header',
	            style: 'background-color:#084695;',
	            columns: [
		            {
		                text: '인원수',
		                dataIndex: 'v7',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#084695;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		                text: '공수',
		                dataIndex: 'v8',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#084695;text-align:center',      align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '인건비',
		                dataIndex: 'v9',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#084695;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }
	            ]
		      },
			{
	            header: '기타',
	            sortable: false,
	            cls:'rfx-grid-header',
	             style: 'background-color:#979797;',
	            columns: [
		            {
		                text: '인원수',
		                dataIndex: 'v10',
		                cls:'rfx-grid-header', 
		               style: 'background-color:#979797;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		                text: '공수',
		                dataIndex: 'v11',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#979797;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }, {
		            	text: '인건비',
		                dataIndex: 'v12',
		                cls:'rfx-grid-header', 
		                style: 'background-color:#979797;text-align:center',     align:'right', renderer : Util.thousandsRenderer()
		            }
	            ]
		      }
            
            ],
			listeners: {
		   		itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
			   
			  	 	console_logs('car record', record);
			  	 	var title = '[<span style="color:#003471">' + Ext.getCmp('projectCar-Month').getValue() + '</span>] 현황';
					popupUserProjectDetail(title, record, 'gridCarTable', this, record.get('pj_name'));
			 }
		}
});

function redrawCarTable(code, name) {
	
	
	
	console_logs('redrawCarTable -------------------- ', code + ':' + name);
	
	CAR_PARAMS['cubeCode'] = 'PJ_TEAM';
	CAR_PARAMS['projectChartType'] = 'PJ_CAR_TABLE';
	CAR_PARAMS['projectCar-Carmodel'] = code;
	console_logs('------- redrawCarTable CAR_PARAMS', CAR_PARAMS);
	
	storeCarTable.removeAll();
	if(name==null) {
		gridCarTable.setTitle(makeGridTitle('프로젝트별 투입현황'));
								storeCarTable.add({
					        pj_name: '해당 사항 없음'
					        
					    });
	} else {
		gridCarTable.setLoading(true);
		gridCarTable.setTitle(makeGridTitle('<span style="color:#003471">'+ name + '</span> 프로젝트 투입현황'));
			 	Ext.Ajax.request({
				url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
				params:CAR_PARAMS,
				success : function(response, request) {
					var val = Ext.JSON.decode(response.responseText);
					var records = val['records'];

					
					
					for(var i=0; i<records.length; i++) {
						
						var rec = records[i];

						//console_logs('rec', rec);
						
						storeCarTable.add({
							producttitle: rec[0],
					        pj_code: rec[1],
					        pj_name: rec[2],
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
					        v12: rec[16]
					    });
					
					}//endof for

					gridCarTable.setLoading(false);
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


	
}


function redrawCarChart1() {
	
	selectedC1 = true;
	
	CAR_PARAMS['cubeCode'] = 'PJ_TEAM';
	CAR_PARAMS['projectChartType'] = 'PJ_CAR1';
	
	console_logs('------- redrawCarTable CAR_PARAMS', CAR_PARAMS);
	
	Ext.getCmp('projectcar-center' +'id').setLoading(true);

 	Ext.Ajax.request({
			url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
			params:CAR_PARAMS,
			success : function(response, request) {
				
				var oem = CAR_PARAMS['projectCar-SearchOem'];

				var divProjectcarCenter = document.getElementById('projectcar-center');
				
				var align =  'left';
				var pos = 200;
				if(oem == 'HMC' || oem == 'KMC') {
					divProjectcarCenter.style.width = "5000px";
				} else {
					pos = 0;
					align =  'right';
					divProjectcarCenter.style.width = "100%";
				}
				
				
				Ext.getCmp('projectcar-center' +'id').setLoading(false);
				//console_logs('response.responseText', response.responseText);
				var val = Ext.JSON.decode(response.responseText);
				//console_logs("redrawCarChart1 val['series']", val['series']);
				//console_logs("redrawCarChart1 val['aXis']", val['aXis']);
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
				
				SERIES_BUFFER_CAR_MAP.add('redrawCarChart1', arr);
				
				var series = val['series'];
				arrangeColorOrg(series);
				
				var unitDisp = '';
				var format = '';
		        switch(CAR_PARAMS['projectCar-SearchType'] ) {
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
		        
				redrawCarTable(firstCode, firstName);
					    	   		
				var sProjectCarCenter = gColumnChartStyle;
		        sProjectCarCenter['renderTo'] ='projectcar-center-graph';
				
		        ocProjectCarCenter = new Highcharts.Chart({

			    chart: sProjectCarCenter,
			    title: {
	    	            text: '<div class="title02"><span>차종별</span> 투입현황</div>',
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
	    	            align: align,
	    	            x: pos,
	    	            verticalAlign: 'top',
	    	            y: 25,
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
			                            var arr = SERIES_BUFFER_CAR_MAP.get('redrawCarChart1');
			                            for(var i=0; i<arr.length; i++) {
			                            	var o = arr[i];
			                            	console_logs('o', o);

			                            	if(o['name']==this.category) {
			                            		redrawCarTable(o['code'], this.category);
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
Ext.define('FeedViewer.ProjectCar', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.projectCar',
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
	               id: 'projectCar-SearchType',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          CAR_PARAMS['projectCar-SearchType'],
	               triggerAction:  'all',
	               store: carSearchTypeStore,
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
     	                    	CAR_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
				                //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
				            }
     	               }
	            }, '-');
        	
            
			items.push({
			       emptyText: '고객구분',
	               xtype:          'combo',
	               id: 'projectCar-SearchOem',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          CAR_PARAMS['projectCar-SearchOem'],
	               triggerAction:  'all',
	               store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'652'}),
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
     	                    	CAR_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
				            }
     	               }
	            }, '-');

            
			items.push({
			       emptyText: '조직구분',
	               xtype:          'combo',
	               id: 'projectCar-SearchOrg',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          '',
	               triggerAction:  'all',
	               store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'531'}),
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
     	                    	CAR_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
				            }
     	               }
	            }, '-');
                   	
			items.push({
			       emptyText: '',
	               xtype:          'combo',
	               id: 'projectCar-Month',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          CAR_PARAMS['projectCar-Month'],
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
     	                    	CAR_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
				            }
     	               }
	            }, '-');
	        items.push({
	        	xtype: 'component',
	            //html: '<div class="inputBT"><button type="button" onClick="redrawCarChart1();"><span class="search">검색</span></button></div>'
	            html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawCarChart1();"></button></span></div>'
	        });
	        items.push('->');
			if(vSYSTEM_TYPE != 'HANARO') {
				items.push({
				xtype : 'checkbox',
				id : 'chkAutorefresh4',
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
    	
    	this.south = gridCarTable;
                
//        this.south =  Ext.create('widget.gridInput', {
//           layout:'border',
//            region: 'south',
//            minHeight: 300,
//			collapsible: false,
//			height: '50%',
//            layout: 'fit'
//        });
//        
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
    	
	    	
		this.center = Ext.create('Ext.panel.Panel', {
			id: 'projectcar-center' +'id',
            minHeight: 200,
            minWidth: 150,
            //width: '8000',
            height: "50%",
            region: 'center',
            contentEl: 'projectcar-center',
            collapsible: false,
            //autoScroll: true,
            overflowX: 'auto',
            listeners: {
				'resize' : function(win,width,height,opt){

                 	if(ocProjectCarCenter!=null && ocProjectCarCenter!=undefined && ocProjectCarCenter!='undefined') {
                 		
//                 		 var myLen = 8000;
//                 		 var arr = SERIES_BUFFER_CAR_MAP.get('redrawCarChart1');
//			             if( arr!=null && arr!=undefined && arr.length>0) {
//			             	myLen = 5*arr.length;
//			             }
//			             if(myLen<width) {
//			             	myLen = width;
//			             } 
                 		
                 	   //this.width = 	myLen;
		               ocProjectCarCenter.setSize( ocProjectCarCenter.chartWidth,   height,  false    );   
					   ocProjectCarCenter.reflow();
                 	}
                 	
                 }
            }
        });

		center = this.center;
        return this.center;
    }
});