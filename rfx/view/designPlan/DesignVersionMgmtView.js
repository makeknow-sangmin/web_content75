Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);


Ext.define('Rfx.view.designPlan.DesignVersionMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'desing-version-mgmt-view',
    selected_product : null,
    bom_store: null,
    initComponent: function(){
    	
    	this.multiSortHidden = true;
    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
		this.addSearchField('pj_name');
		
        // this.createStore('Rfx.model.PartLine', [{
	    //         property: 'pl_no',
	    //         direction: 'ASC'
	    //     }],
	    //    gMain.pageSize/*pageSize*/
	   
	    //    ,{
	    //    	creator: 'a.creator',
	        	unique_id: 'a.unique_uid'
	    //    }
//        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        // 	, ['bomver']
		//    );
		
		var buttonToolbar = Ext.create('widget.toolbar', {
    		cls: 'my-x-toolbar-default2',
    		items: [
					{
						id: 'target-routeTitlename-DBM7',
					    xtype:'component',
					    html: "Assembly를 선택하세요.",
					    width: 370,
					    style: ''
					    
					 }
    		        ]
    	});
       
        
        this.createGrid([ buttonToolbar ], {width: '60%'});
    	
        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter(), this.createEast()]
        });
    	
        
	    
    	
    	this.callParent(arguments);
    	
    },
    setRelationship: function (relationship) {},
	
	cloudprojectStore: Ext.create('Mplm.store.cloudProjectStore', { hasNull:true}),
	buyerStore: Ext.create('Mplm.store.BuyerStore', {}),
	conditionStore: Ext.create('Mplm.store.ConditionComboStore', {}),
	compareVersionStore:Ext.create('Mplm.store.CompareVersionStore', {}),
	compareVersionStoreTo:Ext.create('Mplm.store.CompareVersionStoreTo', {}),

	getCompareVersionList:function(chkVal){
		var tableType = null;
		for(var i=0; i<chkVal.length; i++){
			var strVer = chkVal[i];

			if(strVer == gm.me().bomversionCnt){
				tableType = "assymap";
			}else{
				tableType = "bomdtl";
			};

			if(i==0){
				gm.me().compareVersionStore.getProxy().setExtraParam('ac_uid', this.ac_uid);
				gm.me().compareVersionStore.getProxy().setExtraParam('parent', this.parent);
				gm.me().compareVersionStore.getProxy().setExtraParam('parent_uid', this.parent_uid);
				gm.me().compareVersionStore.getProxy().setExtraParam('tableType', tableType);
				gm.me().compareVersionStore.getProxy().setExtraParam('ver', strVer);
				
				gm.me().compareVersionStore.load(function() {
					gm.me().compareGridFrom.setLoading(false);
				});
			}else{
				
				gm.me().compareVersionStoreTo.getProxy().setExtraParam('ac_uid', this.ac_uid);
				gm.me().compareVersionStoreTo.getProxy().setExtraParam('parent', this.parent);
				gm.me().compareVersionStoreTo.getProxy().setExtraParam('parent_uid', this.parent_uid);
				gm.me().compareVersionStoreTo.getProxy().setExtraParam('tableType', tableType);
				gm.me().compareVersionStoreTo.getProxy().setExtraParam('ver', strVer);
				gm.me().compareVersionStoreTo.load(function() {
					gm.me().compareGrid.setLoading(false);
				});
			}
		}
	},

	showVersionSelect:function(){
		
		var chkVal;
		var verCnt = this.bomversionCnt;
		var subItem = [];
		for(i=1 ; i<= verCnt ; i++){
			var sub = 'V'+i;
			subItem.push({
				boxLabel: sub,
				name: 'rb',
				inputValue: i
			});
		};
		
		var verSel = Ext.define('KitchenSink.view.binding.ComponentState', {
			extend: 'Ext.panel.Panel',
			xtype: 'binding-component-state',
			width: 300,
			layout: 'anchor',
			viewModel: true,
			title: 'Choose Version',
			bodyPadding: 10,
		
			items: [{
				xtype: 'checkboxgroup',
				fieldLabel: 'Version',
				columns: 1,
				listeners: {
					scope: this,
					change: function(field, newValue, oldValue, eOpts){
						
						chkVal = newValue.rb;

					}
				 },
				items:subItem
			}],
			
		  
		});


		var winPart = Ext.create('ModalWindow', {
			title: 'Version 선택',
			width: 300,
			height: 300,
			items:
				[{
					region: 'center',
					xtype: 'tabpanel',
					items: [verSel]
				}],
			buttons: [{
				text: CMD_OK,
				handler: function() {
					
					if(chkVal.length ==2){
						
						gm.me().getCompareVersionList(chkVal);
						
						if (winPart) {
							winPart.close();
						}
					}else{
						Ext.MessageBox.alert(error_msg_prompt, '두개의 버전을 선택해주세요');
					}
					

				}
			}, {
				text: CMD_CANCEL,
				handler: function() {
					if (winPart) {
						winPart.close();
					}
				}
			}]
		});
		winPart.show( /* this, function(){} */ );
	},

	onAssemblyGridSelection: function(selections) {

		if (selections != null && selections.length > 0) {
			
			var rec = selections[0];
			gm.me().selectAssy(rec);

		} else {
			gm.me().selected_tree_record = null;
			//gUtil.disable(gm.me().addAssyAction);

		}
	},

	selectAssy: function(record) {
		console_logs("selectAssy  record", record);
		this.compareVersionAction.enable();
        this.depth = record.get('depth');
		var myLink = gu.link;
        
        if (this.depth == 1) {
			this.compareVersionAction.disable();
			this.bomversionCnt = record.get('bomversion');            
        } else {
			this.compareVersionAction.enable();
		}
		
		var pjuid = record.get('unique_id');
		var pj_name = record.get('pj_name');
		var pj_code = record.get('pj_code');
		this.assy_name = record.get('assy_name');
		this.parent = record.get('child');
		this.parent_uid = record.get('unique_uid');

    },

    unselectAssy: function(record) {
        this.compareVersionAction.disable(); 

    },
	

	srchTreeHandler: function(my_treepanel, cloudProjectTreeStore, widName, parmName, b) {

				var val = gu.getCmp(widName).getValue();
				
				if(val == null || val == undefined || val.length < 1) {
					if(widName == 'projectcombo') {
						val = gm.me().selectedPjUid;
					}
				}
				this.cloudProjectTreeStore.getProxy().setExtraParam(parmName, val);
				this.cloudProjectTreeStore.load({
					callback: function(records, operation, success) {
						console_logs('======> records', records);
						gm.me().bomVersionGrid.setLoading(false);
						//gm.me().valve_nos = [];
						//gm.me().selectTree();
						gm.me().bomVersionGrid.getSelectionModel().select(0);
						gm.me().bomVersionGrid.expandAll();
		
					}
				});
		
			},

	selectProjectCombo: function(record) {
		
		var pjuid = record.get('unique_id');
		var pj_name = record.get('pj_name');
		var pj_code = record.get('pj_code');
		
		this.ac_uid = pjuid;
		this.assy_pj_code = '';
		this.selectedAssyCode = '';
		this.selectedPjCode = pj_code;
		this.selectedPjName = pj_name;
		this.selectedPjUid = pjuid;
		this.puchaseReqTitle = '[' + pj_code + '] ' + pj_name;
		
		// this.parent = record.get('parent');
		// this.parent_uid = record.get('parent_uid');
		//gu.getCmp('target-projectcode').update(pj_code);
		
		this.srchTreeHandler(this.bomVersionGrid, this.cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
		//this.store.removeAll();
		//this.unselectAssy(record);
		// Default Set
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
				params: {
						paramName: 'CommonProjectAssy',
						paramValue: pjuid + ';' + '-1'
					},
		
				success: function(result, request) {
					console_log('success defaultSet');
					},
				failure: function(result, request) {
					console_log('fail defaultSet');
					}
			});
		
				//gm.me().refreshValve();
		},
	
    createCenter: function() {
	    
		this.compareGridFrom =
		Ext.create('Ext.grid.Panel', {
	    	 id:'compareGridFrom',
			 title: 'CompareFrom',// cloud_product_class,
			 border: true,
	         resizable: true,
	         scroll: true,
	         collapsible: false,
	         store: this.compareVersionStore,
	         layout          :'fit',
			 forceFit: true,
			 columns : [{
				text: '품번',
				width: 120,
				dataIndex: 'pl_no',
				sortable: true
			 },
			 {
				text: '품명',
				width: 120,
				dataIndex: 'item_name',
				sortable: true
			 },
			 {
				text: '품목코드',
				width: 120,
				dataIndex: 'item_code',
				sortable: true
			 },
			 {
				text: '수량',
				width: 120,
				dataIndex: 'bm_quan',
				sortable: true
			 }
			
			
			],
			viewConfig: {
                stripeRows: true,
                markDirty:false,
                enableTextSelection: true,
                getRowClass: function(record, index) {

                    // console_logs('record', record);
                    var c = record.get('change_type');
                    console_logs('status', c);

                    switch(c) {
                        case 'U':
                            return 'yellow-row';
                        case 'D':
                            return 'red-row';
                        case 'C':
                            return 'green-row';
                        default:
                            return 'black-row';
                    }

                }
            }
		});//compareGridFrom of End


			this.center =  Ext.widget('tabpanel', {
				layout:'border',
			    border: true,
			    region: 'center',
	            width: '35%',
			    items: [this.compareGridFrom]
			});
			
			return this.center;

    },
    
    //----------------------- END OF CENTER --------------------
    
    createWest: function() {
    	
    	this.compareVersionAction = Ext.create('Ext.Action', {
    		itemId: 'removeAssyAction',
    	    iconCls: 'af-search',
    	    text: 'Version 비교',
    	    disabled: true,
    	    handler: function(widget, event) {
    	    	gm.me().showVersionSelect();
    	    }
		});
		
		this.cloudProjectTreeStore = Ext.create('Mplm.store.cloudProjectTreeStore', {});

		this.bomVersionGrid = Ext.create('Ext.tree.Panel', {
            title: 'Assembly',
            collapsible: true,
            useArrows: true,
            rootVisible: false,
            store: this.cloudProjectTreeStore,
			multiSelect: true,
			layout:'fit',
	        forceFit: true,
            dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
						this.compareVersionAction
					]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [{
                        id: gu.id('wa_name'),
                        xtype: 'combo',
                        cls: 'my-x-toolbar-default1',
                        mode: 'local',
                        editable: true,
                        flex: 0.8,
                        margin:'2 2 2 2',
                        queryMode: 'remote',
                        emptyText: '고객사',
                        displayField: 'wa_name',
                        valueField: 'unique_id',
                        store: this.buyerStore,
                        listConfig: {
                            getInnerTpl: function() {
                                return '<div data-qtip="{unique_id}"><small>{wa_name}</small></div>';
                            }
                        },
                        triggerAction: 'all',
                        listeners: {
                            select: function(combo, record) {
                                console_logs('combo', combo);
                                order_com_unique = combo.value;
                                gm.me().cloudprojectStore.getProxy().setExtraParam('order_com_unique', combo.value);
                                gm.me().conditionStore.getProxy().setExtraParam('parentCode', gm.me().link);
                                gm.me().conditionStore.getProxy().setExtraParam('tableName', 'project');
                                gm.me().conditionStore.getProxy().setExtraParam('fieldName', 'pj_name');
                                gm.me().conditionStore.getProxy().setExtraParam('limit', 1000);
                                gm.me().conditionStore.getProxy().setExtraParam('sqlName', 'partLineItemDetail');/*cartmap 에서 Assymap으로 변경*/
                                gm.me().conditionStore.getProxy().setExtraParam('wherelist',
                                    'order_com_unique:' + combo.value
                                );
                                gm.me().cloudprojectStore.load();
                                
                                console_logs('pj_name', 'clear');
                                gu.getCmp('pj_name').clearValue();

                            },
                            change: function(combo, record) {
                                gu.getCmp('pj_name').clearValue();

                                order_com_unique = combo.value;
                                gm.me().cloudprojectStore.getProxy().setExtraParam('order_com_unique', combo.value);
                                gm.me().conditionStore.getProxy().setExtraParam('parentCode', gm.me().link);
                                gm.me().conditionStore.getProxy().setExtraParam('tableName', 'project');
                                gm.me().conditionStore.getProxy().setExtraParam('fieldName', 'pj_name');
                                gm.me().conditionStore.getProxy().setExtraParam('limit', 1000);
                                gm.me().conditionStore.getProxy().setExtraParam('sqlName', 'partLineItemDetail');/*cartmap 에서 Assymap으로 변경*/
                                gm.me().conditionStore.getProxy().setExtraParam('wherelist',
                                    'order_com_unique:' + combo.value
                                );
                                gm.me().cloudprojectStore.load();
                                gm.me().conditionStore.load();
                            }
                        }
                    },
                        {
                            id: gu.id('pj_name'),
                            xtype: 'combo',
                            cls: 'my-x-toolbar-default1',
                            // fieldStyle: 'background-color: #FBF8E6;
                            // background-image: none;',
                            mode: 'local',
                            editable: true,
                            flex: 0.8,
                            margin:'2 2 2 2',
                            queryMode: 'remote',
                            emptyText: '호선',
                            hidden: (vCompanyReserved4 ==  'HSGC01KR' ) ? false : false,
                            displayField: 'value',
                            valueField: 'value',
                            store: this.conditionStore,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{value}"><small>{value}</small></div>';
                                }
                            },
                            triggerAction: 'all',
                            listeners: {
                                select: function(combo, record) {
                                    console_logs('combo', combo);
                                    order_com_unique = combo.value;
                                    gm.me().cloudprojectStore.getProxy().setExtraParam('pj_name', combo.value);
                                    gm.me().cloudprojectStore.load();

                                },
                                change: function(combo, record) {
                                    order_com_unique = combo.value;
                                    gm.me().cloudprojectStore.getProxy().setExtraParam('pj_name', combo.value);
                                    gm.me().cloudprojectStore.load();
                                }
                            }
                        },
                        {
                            id: gu.id('target-projectcode'),
                            xtype: 'component',
                            html: "미지정",
                            width: 1,
                            style: 'color:white;text-align:right;visibility:hidden'

                        },
                        {
                            id: gu.id('projectcombo'),
                            xtype: 'combo',
                            cls: 'my-x-toolbar-default1',
                            mode: 'local',
                            editable: true,
                            flex: 1,
                            queryMode: 'remote',
                            emptyText: '프로젝트',
                            displayField: 'pj_code',
                            valueField: 'unique_id',
                            store: this.cloudprojectStore,
                            listConfig: {
                                getInnerTpl: function() {
                                    return '<div data-qtip="{pj_name}"><small><font color=blue>{reserved_varchar3}</font> {wa_name}</small></div>';
                                }
                            }	,
                            triggerAction: 'all',
                            listeners: {
                                select: function(combo, record) {
                                    //console_logs('===record', record);
                                    gm.me().selectProjectCombo(record);
                                                                      
                                }
                            }
                        }
                    ]
                }
            ], // dockedItems of End
            columns: [{
                        xtype: 'treecolumn', // this is so we know which column
                        // will show the tree
                        text: '계층',
                        width: 250,
                        sortable: true,
                        dataIndex: 'text',
                        locked: true
                    }
                    
            ]
        	,listeners: {
                'afterrender': function(grid) {
                    var elments = Ext.select(".x-column-header", true);
                    elments.each(function(el) {

                    }, this);

                },
                activate: function(tab){
                    setTimeout(function() {
                    	// gu.getCmp('main-panel-center').setActiveTab(0);
                        // alert(tab.title + ' was activated.');
                    }, 1);
                },
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().assyContextMenu.showAt(e.getXY());
                    return false;
                }
            }
		});
		
		this.bomVersionGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
            	gm.me().onAssemblyGridSelection(selections);
            }
        });		
		
		 this.west =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
			    layout:'border',
			    border: true,
			    region: 'west',
	            width: '30%',
			    layoutConfig: {columns: 2, rows:1},

			    items: [this.bomVersionGrid]
			});
    	
    	return this.west;
	},
	
	createEast: function() {
    	var selValveNo =   Ext.create("Ext.selection.CheckboxModel", {} );
	    
		this.compareGrid =
		Ext.create('Ext.grid.Panel', {
	    	 id:'compareGrid',
			 title: 'CompareTo',// cloud_product_class,
			 border: true,
	         resizable: true,
	         scroll: true,
			 collapsible: false,
			 multiSelect: true,
			 //selModel: selValveNo,
	         store: this.compareVersionStoreTo,
	         layout          :'fit',
			 forceFit: true,
			 columns : [{
				text: '품번',
				width: 120,
				dataIndex: 'pl_no',
				sortable: true
			 },
			 {
				text: '품명',
				width: 120,
				dataIndex: 'item_name',
				sortable: true
			 },
			 {
				text: '규격',
				width: 120,
				dataIndex: 'item_code',
				sortable: true
			 },
			 {
				text: '수량',
				width: 120,
				dataIndex: 'bm_quan',
				sortable: true
			 }
			
			
			],
			viewConfig: {
                stripeRows: true,
                markDirty:false,
                enableTextSelection: true,
                getRowClass: function(record, index) {

                    // console_logs('record', record);
                    var c = record.get('change_type');
                    console_logs('status', c);

                    switch(c) {
                        case 'U':
                            return 'yellow-row';
                        case 'D':
                            return 'red-row';
                        case 'C':
                            return 'green-row';
                        default:
                            return 'black-row';
                    }

                }
            }
		});//productGrid of End
    	
		
		
		 this.east =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
			    layout:'border',
			    border: true,
			    region: 'east',
	            width: '35%',
			    layoutConfig: {columns: 2, rows:1},

			    items: [this.compareGrid /*, myFormPanel*/]
			});
    	
    	return this.east;
	},
	
	// *****************************GLOBAL VARIABLE**************************/
	bomversionCnt: null
    	
    	
});
