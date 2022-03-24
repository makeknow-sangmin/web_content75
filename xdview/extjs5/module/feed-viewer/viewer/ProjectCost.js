var searcCartypeStore= Ext.create('Xdview.store.CmmCodeStore', {parentCode:null});//parent가 영구값이 아니고 초기값일 때 사용.
searcCartypeStore.getProxy().setExtraParam('parentCode', '1186');
searcCartypeStore.getProxy().setExtraParam('orderBy', "CODE_NAME");
searcCartypeStore.load();

Ext.define('CostTable', {
    extend: 'Ext.data.Model',
    fields: [
'id',
'customer', 'car', 'pj_code', 'pj_name', 'state', 
              {    name: 'v1',   type: 'float' },
              {    name: 'v2',   type: 'float' },
              {    name: 'v3',   type: 'float' },
              {    name: 'v4',   type: 'float' },
              {    name: 'v5',   type: 'float' },
              {    name: 'v6',   type: 'float' },
              {    name: 'v7',   type: 'float' },
              {    name: 'v8',   type: 'float' },
              {    name: 'v9',   type: 'float' },
              {    name: 'v10',  type: 'float' },
              {    name: 'v11',  type: 'float' },
              {    name: 'v12',  type: 'float' },
              {    name: 'total',type: 'float' },
              {    name: 'cur',  type: 'float' }
     ],
        proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/xdview/chart.do?method=getTable'
	        },
			reader: {
				type: 'json',
				root: 'records',
				totalProperty: 'count',
				successProperty: 'success'
			}
		}
});


var storeCostTable = new Ext.data.Store({  
	model: 'CostTable'//,
});


var gridCostTable = Ext.create('Ext.grid.Panel', {
	title:  makeGridTitle('<span style="color:#003471">프로젝트 단계 별 </span>투입인건비'),
	//cls : 'mobis-panel',
	border: true,
	//region: 'center',
	store: storeCostTable,
	//scroll: true,
    //collapsible: false,
    width: '100%',
	//layout :'border',
    //forceFit: true,
//	bbar: Ext.create('Ext.PagingToolbar', {
//                store: storeCostTable,
//                id: 'id-storeCostTable',
//                cls:'mypagetoolbar',
//                displayInfo: true//,
////                displayMsg: 'Displaying records {0} - {1} of {2}',
////                emptyMsg: "No topics to display",
////                listeners: {
////                    beforechange: function (page, currentPage) {
////                        //--- Get Proxy ------//
////                        var myProxy = this.store.getProxy();                        
////                 //--- Define Your Parameter for send to server ----//
////                        myProxy.params = {
////                            MENU_NAME: '',
////                            MENU_DETAIL: ''
////                        };
////                  //--- Set value to your parameter  ----//
////                        myProxy.setExtraParam('MENU_NAME', '222222');
////                        myProxy.setExtraParam('MENU_DETAIL', '555555');
////                    }
////                }
////            })
//        }),
//    dockedItems: [{
//        xtype: 'pagingtoolbar',
//        store: storeCostTable,   // same store GridPanel is using
//        dock: 'bottom',
//        displayInfo: true,
//        cls:'mypagetoolbar'
//    }],
	columns: [{
		            	dataIndex: 'id', text: 'ID',
		            	hidden:true
		            },{
		                header: '고객',
		                dataIndex: 'customer',
		                //width:50,
		                resizable: true,
		                cls:'mobis-grid-header', 
		                style: 'text-align:center',
			            sortable: true
		            },{
		                header: '차종',
		                dataIndex: 'car',
		                resizable: true,
		                cls:'mobis-grid-header', 
		                style: 'text-align:center',
			            sortable: true
		            },{
						header: '코드',
						dataIndex: 'pj_code',
						hidden: true,
		                resizable: true,
		                cls:'mobis-grid-header', 
		                style: 'text-align:center',
			            sortable: true
		            },{
						header: '프로젝트 명',
						dataIndex: 'pj_name',
		                resizable: true,
		                width: 200,
		                cls:'mobis-grid-header', 
		                style: 'text-align:center',
			            sortable: true
		            },{
		                header: '현단계',
		                dataIndex: 'state',
		                resizable: true,
		                cls:'mobis-grid-header', 
		                style: 'text-align:center',
			            sortable: true,
						summaryType: 'count',
			            summaryRenderer: function(value, summaryData, dataIndex) {
			                return '<b>합계</b>';
			            },
			            field: {
			                xtype: 'textfield'
			            }
		            }
		            ,
		      {
                header: '단계별 투입현황',
                cls:'mobis-grid-header',
                resizable: true,
	            sortable: true,
	            columns: [{
		            	text: 'M0',
		                dataIndex: 'v1',
		                cls:'mobis-grid-header', 
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            }, {
						text: 'ALL 출도',
		                dataIndex: 'v2',
		                cls:'mobis-grid-header', 
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            }, {
						text: '시작',
		                dataIndex: 'v3',
		                cls:'mobis-grid-header', 
		                resizable: true,
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            },{
		            	text: 'P0',
		                dataIndex: 'v4',
		                cls:'mobis-grid-header', 
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            }, {
						text: '마스터카',
		                dataIndex: 'v5',
		                cls:'mobis-grid-header', 
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            }, {
						text: 'P1',
		                dataIndex: 'v6',
		                cls:'mobis-grid-header', 
		                resizable: true,
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            },{
		            	text: 'P2',
		                dataIndex: 'v7',
		                cls:'mobis-grid-header', 
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            }, {
						text: 'SP2',
		                dataIndex: 'v8',
		                cls:'mobis-grid-header', 
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            }, {
						text: 'LP1',
		                dataIndex: 'v9',
		                cls:'mobis-grid-header', 
		                resizable: true,
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            },{
		            	text: 'LP2',
		                dataIndex: 'v10',
		                cls:'mobis-grid-header', 
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            }, {
						text: 'M',
		                dataIndex: 'v11',
		                cls:'mobis-grid-header', 
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            }, {
						text: 'SOP',
		                dataIndex: 'v12',
		                resizable: true,
		                cls:'mobis-grid-header', 
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            }, {
						text: '누적총계',
		                dataIndex: 'total',
		                resizable: true,
		                cls:'mobis-grid-header', 
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            }]
            	}, {
						text: '당월',
		                dataIndex: 'cur',
		                resizable: true,
		                cls:'mobis-grid-header', 
		                 //autoSizeColumn : true,
			                style: 'text-align:center',
			                align:'right',
			                renderer: function(value, summaryData, dataIndex) {
				                return Ext.util.Format.number(value, '0,000');
				            },
			                field: {
			                    xtype: 'numberfield'
			                }
		            }
            ]
//		,bbar: getPageToolbar(storeCostTable, true, null, function () {
//                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                        })
});

function redrawCostTable() {
	
	var searchCarmodel = Ext.getCmp('projectCost-SearchCarmodel').getValue();
	var searchPjname = Ext.getCmp('projectCost-SearchPjname').getValue();
	
	
	var searchProjectProduct = Ext.getCmp('projectCost-SearchProjectProduct').getValue();
	var searchProjectstep = Ext.getCmp('projectCost-SearchProjectstep').getValue();
	
	if( 	(searchCarmodel==null || searchCarmodel=='') &&
			(searchPjname==null || searchPjname=='') &&
			(searchProjectProduct==null || searchProjectProduct=='') &&
			(searchProjectstep==null || searchProjectstep=='') 
	) {
		Ext.Msg.alert('안내', '차종 등 상세 조건을 입력하세요.', function() {});
	} else {
	
		gridCostTable.setLoading(true);
		
		COST_PARAMS['cubeCode'] = 'PJ_COST';
		COST_PARAMS['projectChartType'] = 'PJ_COST_TABLE';
		COST_PARAMS['projectCost-SearchPjname'] = searchPjname
		COST_PARAMS['projectCost-SearchCarmodel'] = searchCarmodel;
	
	 	Ext.Ajax.request({
				url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
				params:COST_PARAMS,
				success : function(response, request) {
					
					
					storeCostTable.removeAll(true);
					var val = Ext.JSON.decode(response.responseText);
					var records = val['records'];
					
					if(records==null || records==undefined || records.length==0) {
						storeCostTable.add({
							customer: '',
							car: '',
					        pj_code: '',
					        pj_name: '해당 사항 없음',
					        state: ''
					    });
					} else {
						
						
						for(var i=0; i<records.length; i++) {
							
							var rec = records[i];
	
							console_logs('rec', rec);
							
							storeCostTable.add({
								customer: rec[0],
								car: rec[1],
						        pj_code: rec[2],
						        pj_name: rec[3],
						        state: rec[4],
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
						        total: rec[25],
						        cur: rec[26]
						    });
						
					}//endof for
					
					}

					gridCostTable.setLoading(false);
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

Ext.define('FeedViewer.ProjectCost', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.projectCost',
	frame   : false,
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
			       emptyText: '고객구분',
	               xtype:          'combo',
	               id: 'projectCost-SearchOem',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          COST_PARAMS['projectCost-SearchOem'],
	               triggerAction:  'all',
	               store: Ext.create('Xdview.store.CmmCodeStore', {parentCode:'652'}),
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
     	                    	COST_PARAMS[this.id] = combo.getValue();
     	                    	
     	                    	console_logs('systemCode', systemCode);
		                        searcCartypeStore.getProxy().setExtraParam('parentCode', systemCode);
		                        
		                        searcCartypeStore.load();
		                        
		                        Ext.getCmp('projectCost-SearchCarmodel').setValue('');

                        
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');

			items.push({
			       emptyText: '차종',
	               xtype:          'combo',
	               id: 'projectCost-SearchCarmodel',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:     '',
	               triggerAction:  'all',
	               store: searcCartypeStore,
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
     	                    	COST_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');
			           
			items.push({
			       emptyText: '현단계',
	               xtype:          'combo',
	               id: 'projectCost-SearchProjectstep',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          '',
	               triggerAction:  'all',
	               store: Ext.create('Xdview.store.CmmCodeStore', {parentCode:'1015'}),
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
     	                    	COST_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');
           
			items.push({
			       emptyText: '프로젝트 제품',
	               xtype:          'combo',
	               id: 'projectCost-SearchProjectProduct',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          '',
	               triggerAction:  'all',
	               store: Ext.create('Xdview.store.CmmCodeStore', {parentCode:'1594'}),
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
     	                    	COST_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');
			
	             items.push({
	  		          xtype: 'textfield',
	  		          emptyText: '프로젝트 명',
	  		          id: 'projectCost-SearchPjname',
					  fieldStyle: {
						  'background-color'  : '#164989',
  						  'background-image' : 'none',
						'fontFamily'   : '"현대하모니 L",Malgun Gothic'
					  },
	  		          cls : 'newCSS'
	  		      	  
	            }, '-');
            
            items.push({
                emptyText: '',
                xtype: 'combo',
                id: 'projectCost-Month',
                mode: 'local',
                editable: false,
                allowBlank: false,
                queryMode: 'remote',
                displayField: 'codeName',
                value: COST_PARAMS['projectCost-Month'],
                triggerAction: 'all',
                store: Ext.create('Xdview.store.CmmCodeStore', {parentCode:'592', hasNull:false}),
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
                        COST_PARAMS[this.id] = combo.getValue();
                    },
                    change: function(sender, newValue, oldValue, opts) {
                        this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
                        //output.setBodyStyle('font-family', "현대하모니 L,Malgun Gothic");
                    }
                }
            }, '-');
            
	        items.push({
	        	xtype: 'component',
	            //html: '<div class="inputBT"><button type="button"><span class="search">검색</span></button></div>'
	        	html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawCostTable();"></button></span></div>'
	            	
	        });
	        items.push('->');
    	
	        items.push({
				xtype : 'checkbox',
				id : 'chkAutorefresh7',
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
	            //html: '<div class="inputBT"><button type="button"><span class="search" onClick="openNewWindow();">새창으로 보기</span></button></div>'
	        });
	        config.items = items;
        
        }
        else {
            config.cls = 'x-docked-border-bottom';
        }
        config.cls = 'my-x-toolbar-default';
        return Ext.create('widget.toolbar', config);
    },

	
//	layoutConfig: {columns: 1, rows:1},
//			    defaults: {
//			        collapsible: false,
//			        split: true,
//			        cmargins: '2 0 0 0',
//			        margins: '0 0 0 0'
//			    },
	bodyPadding: 10,
    initComponent: function(){
       // this.display = Ext.create('widget.feedpost', {});
        this.dockedItems = [this.createToolbar()];
        Ext.apply(this, {
            layout: 'fit',
            width: '100%',
            items: [gridCostTable]
        });
       // this.relayEvents(this.display, ['opentab']);
       // this.relayEvents(this.south, ['rowdblclick']);
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
       // this.fireEvent('openall', this);
    },

//    /**
//     * Create the center region container
//     * @private
//     * @return {Ext.panel.Panel} center
//     */
//    createCenter: function(){
//    	
//		this.center = gridCostTable;
//			
////		Ext.create('widget.gridCost', {
////           layout:'border',
////           region: 'center',
////		   collapsible: false,
////		   width: '100%',
////           layout: 'fit'
////        });
//        return this.center;
//    }
});