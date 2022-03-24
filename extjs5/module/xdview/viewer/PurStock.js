Ext.define('PurStockTable1', {
    extend: 'Ext.data.Model',
    fields: [ 
              'pre_mass', 
              'car', 
              'pj_code',
              'pj_name',
              'product',
              {    name: 'v1',   type: 'float' },
              {    name: 'v2',   type: 'float' },
              {    name: 'v3',   type: 'float' }
     ]
});

Ext.define('PurStockTable2', {
    extend: 'Ext.data.Model',
    fields: [ 
              'position', 
              'name', 
              {    name: 'v1',   type: 'float' },
              {    name: 'v2',   type: 'float' },
              {    name: 'v3',   type: 'float' },
              {    name: 'v4',   type: 'float' }
     ]
});

var storePurStockTable1 = new Ext.data.Store({  
	model: 'PurStockTable1'//,
//	data: [
//	       {
//			pre_mass: 	'', 
//            car: 		'', 
//            pj_code: 	'', 
//            pj_name: 	'', 
//            product: 	'', 
//            v1: 		'',
//            v2: 		'',
//            v3: 		''
//	       }
//	       ]
});

var storePurStockTable2 = new Ext.data.Store({  
	model: 'PurStockTable2'
});

var gridPurStockTable1 = Ext.create('Ext.grid.Panel', {
	cls : 'rfx-panel',
	title: makeGridTitle('<span style="color:#003471">프로젝트별</span> 투입현황'),
	border: true,
	resizable: true,
	store: storePurStockTable1,
	scroll: true,
    minWidth: 500,
    width: "50%",
    region: 'center',
    collapsible: false,
	layout          :'fit',
			features: [{
            ftype: 'summary',
            dock: 'top'
        }],
    forceFit: true,
	columns: [{
	            	dataIndex: 'id', text: 'ID',
	            	hidden:true
	            },{
	                header: '선행/양산',
	                cls:'rfx-grid-header', 
	                dataIndex: 'pre_mass',
	               width:80,
	                resizable: true,
	                style: 'text-align:center',
		            sortable: true
	            },{
	                header: '차종',
	                cls:'rfx-grid-header', 
	                dataIndex: 'car',
	                width:80,
	                resizable: true,
	                style: 'text-align:center',
		            sortable: true
	            },
	            {
							header: '코드',
							width:80,
							cls:'rfx-grid-header', 
							dataIndex: 'pj_code',
			                resizable: true,
			                style: 'text-align:center',
			                hidden:true,
				            sortable: true
			            },{
							header: '프로젝트',
							cls:'rfx-grid-header', 
							dataIndex: 'pj_name',
							width:80,
			                resizable: true,
			                style: 'text-align:center',
				            sortable: true
			            },{
	                header: '제품',
	                cls:'rfx-grid-header', 
	                dataIndex: 'product',
	                resizable: true,
	                width:80,
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
	        header: '투입인원',
	        cls:'rfx-grid-header', 
	        resizable: true,
	        sortable: true,
	        columns: [{
	            	text: '인원수',
	            	cls:'rfx-grid-header', 
	                dataIndex: 'v1',
	               width:80,
	                 autoSizeColumn : true,
		                style: 'text-align:center',
		                align:'right',
		                summaryType: 'sum',
						summaryRenderer: function(value, summaryData, dataIndex) {
			                return '<b>' + Ext.util.Format.number(value, '0,000') + '</b>';
			            },
			            renderer: function(value, summaryData, dataIndex) {
			                return Ext.util.Format.number(value, '0,000');
			            },
		                field: {
		                    xtype: 'numberfield'
		                }
	            }, {
					text: '공수',
					cls:'rfx-grid-header', 
	                dataIndex: 'v2',
	               // resizable: true,
	                 autoSizeColumn : true,
	                 width:80,
		                style: 'text-align:center',
		                align:'right',
		                summaryType: 'sum',
						summaryRenderer: function(value, summaryData, dataIndex) {
			                return '<b>' + Ext.util.Format.number(value, '0,000') + '</b>';
			            },
			            renderer: function(value, summaryData, dataIndex) {
			                return Ext.util.Format.number(value, '0,000');
			            },
		                field: {
		                    xtype: 'numberfield'
		                }
	            }, {
					text: '인건비',
					cls:'rfx-grid-header', 
	                dataIndex: 'v3',
	                resizable: true,
	                 autoSizeColumn : true,
	                  width:80,
		                style: 'text-align:center',
		                align:'right',
		                summaryType: 'sum',
						summaryRenderer: function(value, summaryData, dataIndex) {
			                return '<b>' + Ext.util.Format.number(value, '0,000') + '</b>';
			            },
			            renderer: function(value, summaryData, dataIndex) {
			                return Ext.util.Format.number(value, '0,000');
			            },
		                field: {
		                    xtype: 'numberfield'
		                }
	            }]
	    }]
//	,bbar: getPageToolbar(storePurStockTable1, true, null, function () {
//                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                        })
});

var gridPurStockTable2 = Ext.create('Ext.grid.Panel', {
	cls : 'rfx-panel',
	title: makeGridTitle('<span style="color:#003471">개인별</span> 투입현황'),
	border: true,
	resizable: true,
	store: storePurStockTable2,
	scroll: false,
    flex: 1,
    region: 'east',
    forceFit: true,
    collapsible: false,
    scroll: true,
	layout           :'fit',
			features: [{
            ftype: 'summary',
            dock: 'top'
        }],
    columns: [{
        	dataIndex: 'id', text: 'ID',
        	hidden:true
        },
		      {
                header: '투입인원',
                cls:'rfx-grid-header', 
                resizable: true,
	            sortable: true,
	            columns: [{
		            	text: '직급',
		            	cls:'rfx-grid-header', 
		                dataIndex: 'position',
		                resizable: true,
		                width:100,
		                autoSizeColumn : true,
		                style: 'text-align:center',     
		                align:'center'
		            }, {
						text: '성명',
						cls:'rfx-grid-header', 
		                dataIndex: 'name',
		                resizable: true,
		                autoSizeColumn : true,
		                width:220,
		                style: 'text-align:center',     
		                align:'center',
		            	            summaryType: 'count',
			            summaryRenderer: function(value, summaryData, dataIndex) {
			                return '<b>합계</b>';
			            },
			            field: {
			                xtype: 'textfield'
			            }
		            }]
            }, 
		     {
                header: '투입시간',
                cls:'rfx-grid-header', 
                resizable: true,
	            sortable: true,
	            columns: [{
		            	text: '선행',
		            	cls:'rfx-grid-header', 
		                dataIndex: 'v1',
		                resizable: true,
		                width: 110,
		                autoSizeColumn : true,
		                style: 'text-align:center',     
		                align:'right',
		                renderer: function(value, summaryData, dataIndex) {
			                return Ext.util.Format.number(value, '0,000');
			            },
		                summaryType: 'sum',
						summaryRenderer: function(value, summaryData, dataIndex) {
			                return '<b>' + Ext.util.Format.number(value, '0,000') + '</b>';
			            },
			            renderer: function(value, summaryData, dataIndex) {
			                return Ext.util.Format.number(value, '0,000');
			            },
		                field: {
		                    xtype: 'numberfield'
		                }
		            }, {
						text: '양산',
						cls:'rfx-grid-header', 
		                dataIndex: 'v2',
		                resizable: true,
		                width: 110,
		                 autoSizeColumn : true,
		                style: 'text-align:center',     
		                align:'right',
						renderer: function(value, summaryData, dataIndex) {
			                return Ext.util.Format.number(value, '0,000');
			            },
		                summaryType: 'sum',
						summaryRenderer: function(value, summaryData, dataIndex) {
			                return '<b>' + Ext.util.Format.number(value, '0,000') + '</b>';
			            },
			            renderer: function(value, summaryData, dataIndex) {
			                return Ext.util.Format.number(value, '0,000');
			            },
		                field: {
		                    xtype: 'numberfield'
		                }
		            },{
		            	text: '기타',
		            	cls:'rfx-grid-header', 
		                dataIndex: 'v3',
		                resizable: true,
		                width: 110,
		                 autoSizeColumn : true,
		                style: 'text-align:center',     
		                align:'right',
						renderer: function(value, summaryData, dataIndex) {
			                return Ext.util.Format.number(value, '0,000');
			            },
		                summaryType: 'sum',
						summaryRenderer: function(value, summaryData, dataIndex) {
			                return '<b>' + Ext.util.Format.number(value, '0,000') + '</b>';
			            },
			            renderer: function(value, summaryData, dataIndex) {
			                return Ext.util.Format.number(value, '0,000');
			            },
		                field: {
		                    xtype: 'numberfield'
		                }
		            }, {
						text: '공통',
						cls:'rfx-grid-header', 
		                dataIndex: 'v4',
		                resizable: true,
		                width: 110,
		                autoSizeColumn : true,
		                style: 'text-align:center',     
		                align:'right',
						renderer: function(value, summaryData, dataIndex) {
			                return Ext.util.Format.number(value, '0,000');
			            },
		                summaryType: 'sum',
						summaryRenderer: function(value, summaryData, dataIndex) {
			                return '<b>' + Ext.util.Format.number(value, '0,000') + '</b>';
			            },
			            renderer: function(value, summaryData, dataIndex) {
			                return Ext.util.Format.number(value, '0,000');
			            },
		                field: {
		                    xtype: 'numberfield'
		                }
		            }]
            }]
//			,bbar: getPageToolbar(storePurStockTable2, true, null, function () {
//                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                        })
});


function redrawPurStockTable() {
	
	var searchPurStock = Ext.getCmp('projectPurStock-SearchPurStock').getValue();
	
	if( searchPurStock==null || searchPurStock==''	) {
		Ext.Msg.alert('안내', '먼저 검색할 팀을 지정하세요.', function() {});
	} else {
		redrawPurStockTable1();
		redrawPurStockTable2();
	}
}

function redrawPurStockTable2(/*pj_code*/) {
	
	gridPurStockTable2.setLoading(true);
	storePurStockTable2.removeAll(true);
	var searchPurStock = TEAM_PARAMS['projectPurStock-SearchPurStock'];
	if(searchPurStock==null || searchPurStock=='' || searchPurStock==undefined) {
			
			storePurStockTable2.add({
				position: '',
				name: '검색할 팀을 지정하세요.',
		        v1: '',
		        v2: '',
		        v3: '',
		        v4: ''
		    });
			
			gridPurStockTable2.setLoading(false);	
			return;
	}
	
	TEAM_PARAMS['cubeCode'] = 'PJ_TEAM';
	TEAM_PARAMS['projectChartType'] = 'PJ_TEAM_TABLE2';
	//TEAM_PARAMS['projectPurStock-SearchPjcode'] = pj_code;

	
	 	Ext.Ajax.request({
				url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
				params:TEAM_PARAMS,
				success : function(response, request) {
					var val = Ext.JSON.decode(response.responseText);
					var records = val['records'];

					for(var i=0; i<records.length; i++) {
						
						var rec = records[i];

						console_logs('rec', rec);
						
						storePurStockTable2.add({
							position: rec[0],
							name: rec[1],
					        v1: rec[5],
					        v2: rec[6],
					        v3: rec[7],
					        v4: rec[8]
					    });
												
					
					}//endof for

					gridPurStockTable2.setLoading(false);
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


function redrawPurStockTable1() {
	
	gridPurStockTable1.setLoading(true);
	
	TEAM_PARAMS['cubeCode'] = 'PJ_TEAM';
	TEAM_PARAMS['projectChartType'] = 'PJ_TEAM_TABLE1';

	
	 	Ext.Ajax.request({
				url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
				params:TEAM_PARAMS,
				success : function(response, request) {
					var val = Ext.JSON.decode(response.responseText);
					var records = val['records'];

					
					storePurStockTable1.removeAll(true);
					for(var i=0; i<records.length; i++) {
						
						var rec = records[i];

						//console_logs('rec', rec);
						
						storePurStockTable1.add({
							pre_mass: rec[0],
							car: rec[1],
					        pj_code: rec[2],
					        pj_name: rec[3],
					        product: (rec[4]=='NULL')?'-':rec[4],
					        v1: rec[5],
					        v2: rec[6],
					        v3: rec[7]
					    });
					
					}//endof for

					gridPurStockTable1.setLoading(false);
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


 gridPurStockTable1.getSelectionModel().on({
    selectionchange: function(sm, selections) {
    	
    	/*
    	//console_logs(selections.length);
    	if (selections.length) {
    		console_logs(selections[0]);
    		var o = selections[0];
    		console_logs('o', o );
    		var pj_code = o.get('pj_code');
			
    		redrawPurStockTable2(pj_code);
    	}
    	*/
    }

});

Ext.define('FeedViewer.PurStock', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.purStock',
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
         
//        		items.push({
//			       emptyText: '조회구분',
//	               xtype:          'combo',
//	               id: 'projectPurStock-SearchType',
//	               mode:           'local',
//	               editable:       false,
//	               allowBlank: false,
//	               queryMode: 'remote',
//	               displayField:   'codeName',
//	               value:          TEAM_PARAMS['projectPurStock-SearchType'],
//	               triggerAction:  'all',
//	               store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'588', hasNull:false}),
//	               width: 120,
//	               cls : 'newCSS',
//	               listConfig:{
//	               	getInnerTpl: function(){
//	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
//	                	}			                	
//	                },
//	 	            listeners: {
//     	                    select: function (combo, record) {
//		                        var systemCode = record.get('systemCode');
//		                        TEAM_PARAMS[this.id] = combo.getValue();
//     	                    },
//     	                    change: function(sender, newValue, oldValue, opts) {
//				                this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
//				                //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
//				            }
//     	               }
//	            }, '-');
//        	
//        		
//            items.push({
//                emptyText: '조직구분',
//                xtype: 'combo',
//                id: 'projectPurStock-SearchOrg',
//                mode: 'local',
//                editable: false,
//                allowBlank: false,
//                queryMode: 'remote',
//                displayField: 'codeName',
//                value: '연구',
//                triggerAction: 'all',
//                store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'531'}),
//                width: 120,
//                cls: 'newCSS',
//                listConfig: {
//                    getInnerTpl: function() {
//                        return '<div data-qtip="{systemCode}">{codeName}</div>';
//                    }
//                },
//                listeners: {
//                    select: function(combo, record) {
//                        var systemCode = record.get('systemCode');
//                        TEAM_PARAMS[this.id] = combo.getValue();
//
//                        console_logs('systemCode', systemCode);
//                        searcPurStockStore.getProxy().setExtraParam('parentCode', systemCode);
//                        searcPurStockStore.load();
//                        
//                        Ext.getCmp('projectPurStock-SearchPurStock').setValue('');
//
//                    },
//                    change: function(sender, newValue, oldValue, opts) {
//                        this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
//                        //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
//                    }
//                }
//            }, '-');
//
//            items.push({
//                emptyText: '팀',
//                xtype: 'combo',
//                id: 'projectPurStock-SearchPurStock',
//                mode: 'local',
//                editable: false,
//                allowBlank: false,
//                queryMode: 'remote',
//                displayField: 'codeName',
//                triggerAction: 'all',
//                store: searcPurStockStore,
//                width: 180,
//                cls: 'newCSS',
//                listConfig: {
//                    getInnerTpl: function() {
//                        return '<div data-qtip="{systemCode}">{codeName}</div>';
//                    }
//                },
//                listeners: {
//                    select: function(combo, record) {
//                        var systemCode = record.get('systemCode');
//                        TEAM_PARAMS[this.id] = combo.getValue();
//
//                    },
//                    change: function(sender, newValue, oldValue, opts) {
//                        this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
//                        //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
//                    }
//                }
//            }, '-');
//            
//            
//            items.push({
//                emptyText: '',
//                xtype: 'combo',
//                id: 'projectPurStock-Month',
//                mode: 'local',
//                editable: false,
//                allowBlank: false,
//                queryMode: 'remote',
//                displayField: 'codeName',
//                value: TEAM_PARAMS['projectPurStock-Month'],
//                triggerAction: 'all',
//                store: Ext.create('Rfx.store.CmmCodeStore', {parentCode:'592', hasNull:false}),
//                width: 120,
//                cls: 'newCSS',
//                listConfig: {
//                    getInnerTpl: function() {
//                        return '<div data-qtip="{systemCode}">{codeName}</div>';
//                    }
//                },
//                listeners: {
//                    select: function(combo, record) {
//                        var systemCode = record.get('systemCode');
//                        TEAM_PARAMS[this.id] = combo.getValue();
//                    },
//                    change: function(sender, newValue, oldValue, opts) {
//                        this.inputEl.setStyle('font-family', "Malgun Gothic, Tahoma");
//                        //output.setBodyStyle('font-family', "Malgun Gothic, Tahoma");
//                    }
//                }
//            }, '-');
//            
//	        items.push({
//	        	xtype: 'component',
//	            //html: '<div class="inputBT"><button type="button" onClick="redrawPurStockTable1();"><span class="search">검색</span></button></div>'
//	        	html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawPurStockTable();"></button></span></div>'
//	        });
	        items.push('->');
		
			if(vSYSTEM_TYPE != 'HANARO') {
				items.push({
					xtype : 'checkbox',
	//				id : 'chkAutorefresh6',
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

	
	layoutConfig: {columns: 1, rows:1},
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
            items: [this.createWest(), this.createCenter()]
        });
       // this.relayEvents(this.display, ['opentab']);
       // this.relayEvents(this.east, ['rowdblclick']);
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
    createWest: function(){
    	
    	Ext.define('ImageModel', {
    	    extend: 'Ext.data.Model',
    	    fields: [
    	       {name: 'name'},
    	       {name: 'link'}
    	    ]
    	});
    	
        var dataView =   Ext.create('Ext.Panel', {
            //id: 'images-view',
            frame: true,
            collapsible: true,
            region: 'west',
            width: 200,
            title: '구매.재고',
            items: Ext.create('Ext.view.View', {
            store: Ext.create('Ext.data.Store', {
	                model: 'ImageModel',
	                data: [
	                    { id: 1, name: '자재관리', link: '' },
	                    { id: 2, name: '구매요청', link: '' },
	                    { id: 3, name: '주문작성', link: '' },
	                    { id: 4, name: '주문서별현황',  link: '' },
	                    { id: 5, name: '주문상세현황', link: ''},
	                    { id: 6, name: '공급사현황', link: ''},
	                    { id: 7, name: '재고현황', link: ''}
	 
	                ]
	            }),
                tpl: '<tpl for="."><div class="feed-list-item">{name}</div></tpl>',
                multiSelect: false,
                //height: 310,
                trackOver: true,
                itemSelector: '.feed-list-item',
                overItemCls: 'feed-list-item-hover',
                emptyText: 'No images to display',
//                plugins: [
//                    Ext.create('Ext.ux.DataView.DragSelector', {}),
//                    Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'name'})
//                ],
                prepareData: function(data) {
                    Ext.apply(data, {
                        shortName: Ext.util.Format.ellipsis(data.name, 15),
                        sizeString: Ext.util.Format.fileSize(data.size),
                        dateString: Ext.util.Format.date(data.lastmod, "m/d/Y g:i a")
                    });
                    return data;
                },
                listeners: {
//                    selectionchange: function(dv, nodes ){
//                        var l = nodes.length,
//                            s = l !== 1 ? 's' : '';
//                        this.up('panel').setTitle('Simple DataView (' + l + ' item' + s + ' selected)');
//                    }
                }
            })
        });
        
        //this.east =  gridPurStockTable2;
        this.west = dataView;
        //redrawPurStockTable1();
        
//        Ext.create('widget.gridPurStock2', {
//           layout:'border',
//            region: 'west',
//            minWidth: 400,
//			collapsible: false,
//			width: '40%',
//            layout: 'fit'
//        });
        
        return this.west;

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

    /**
     * Create the center region container
     * @private
     * @return {Ext.panel.Panel} center
     */
    createCenter: function(){
    	this.center = gridPurStockTable1;
    	/*
		this.center = Ext.create('widget.gridPurStock1', {
           layout:'border',
           region: 'center',
           minWidth: 700,
		   collapsible: false,
		   width: '60%',
           layout: 'fit'
        });
        */
        return this.center;
    }
});