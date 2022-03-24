Ext.define('Rfx2.view.qualManage.QualDocuSet', {
    extend: 'Ext.panel.Panel',
    xtype: 'qual-docu-set',
    initComponent: function(){
		// this.docuTreeStore = Ext.create('Mplm.store.docuTreeStore', {});

        Ext.apply(this, {
        layout: 'border',
            bodyBorder: false,

            defaults: {
                collapsible: false,
                split: true
            },
            items: [this.createWest(), this.createCenter(), this.createEast()]
        });

        this.callParent(arguments);

    },
    addAction: Ext.create('Ext.Action', {
        iconCls: 'af-plus-circle',
        text: '템플릿 추가',
        tooltip: '신규등록',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            gm.me().addStandardDocu();
        }
    }),

    editAction: Ext.create('Ext.Action', {
        iconCls: 'af-edit',
        text: gm.getMC('CMD_MODIFY', '수정'),
        tooltip: '수정',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            gm.me().editStandardDocu();
        }
    }),

    removeTempAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: '삭제',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {

         Ext.MessageBox.show({
                title: '삭제',
                msg: '템플릿을 삭제 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn) {
                    if(btn == "no") {
                        if(prWin) {
                            prWin.close();
                        }
                    } else {
                        gm.me().removeStandardDocu();
                    }
                }
            });
        
        }
    }),

    fiedlAddAction: Ext.create('Ext.Action', {
        iconCls: 'af-plus-circle',
        text: '필드 추가',
        tooltip: '필드 추가',
        disabled: false,
        handler: function() {		 	
            gMain.selPanel.fiedlAddActionHandler();
        }
    }),

    fiedlRemoveAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: '필드 삭제',
        tooltip: '필드 삭제',
        disabled: true,
        handler: function() {		 	
            gMain.selPanel.fiedlRemoveActionHandler();
        }
    }),
    
    fiedlAddActionHandler: function() {
		var docuTpl_uid = gm.me().gridDocuTpl.getSelectionModel().getSelection()[0].get('unique_id_long');
		if(docuTpl_uid == null || docuTpl_uid == '' || docuTpl_uid == undefined) {
			Ext.Msg.alert('알림','문서 템블릿을 선택해 주세요.');
			return;
		} 

		// 선택된 메뉴코드에 대한 Row 추가(J3_DOCUPROP)
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/document/manage.do?method=addDocuTempSetRow',
			params:{
				docuTpl_uid:docuTpl_uid
			},
			
			success : function(result, request) { 
				gm.me().docuPropStore.load();
				
			},// endofsuccess
			failure: extjsUtil.failureMessage
		});// endofajax
    },
    
    UserAuthStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'USER_AUTH'} ),

    DocuTypeStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'DOCU_TYPE'} ),

    InputTypeStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'INPUT_TYPE'} ),

    addStandardDocu: function() {

        var form = Ext.create('Ext.form.Panel', {
	    	id: gu.id('formPanel'),
	    	xtype: 'form',
    		frame: false ,
    		border: false,
    		bodyPadding: '3 3 0',
    		region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 100,
                margins: 10,
			},
			items: [
                {
                    fieldLabel: '문서그룹',
                    xtype:'textfield',
                    id:'docu_name',
                    name: 'docu_name',
                    anchor: '60%',
                    value: gm.me().docu_group_name,
                    editable: false
                }, new Ext.form.Hidden({
                    name : 'class_code',
                    value: gm.me().docu_group_code
                }),
                {
                    fieldLabel: '문서명',
                    xtype: 'textfield',
                    anchor: '60%',
                    id: 'temp_name',
                    name: 'temp_name'
                },{
                    fieldLabel: '권한유형',
                    xtype:'combo',
                    store: gm.me().UserAuthStore,
                    id:'docu_auth',
                    name: 'docu_auth',
                    anchor: '60%',
                    valueField: 'systemCode',
                    displayField: 'codeName',
                    emptyText: '선택해주세요.',
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음',
                        getInnerTpl: function() {
                            return '<div data-qtip="{}">{codeName}</div>';
                        }
                    }
                },{
                    fieldLabel: '문서유형',
                    xtype:'combo',
                    store: gm.me().DocuTypeStore,
                    id:'docu_type',
                    name: 'docu_type',
                    anchor: '60%',
                    valueField: 'systemCode',
                    displayField: 'codeName',
                    emptyText: '선택해주세요.',
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음',
                        getInnerTpl: function() {
                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                        }
                    }
                }
            ]
        });

        myHeight = 450;
        myWidth = 600;
            
        var prWin =	Ext.create('Ext.Window', {
			modal : true,
			title: '추가',
			width: myWidth,
			height: myHeight,	
			plain:true,
			items: form,
			buttons: [{
				text: CMD_OK,
				handler: function(btn){
                    if(btn == "no") {
                        prWin.close();
                    } else {
                        if(form.isValid()) {
                            var val = form.getValues(false);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/document/manage.do?method=addDocuTpl',
                                params: val,
                                success: function (result, request) {
                                    gm.me().storeDocuTpl.load();
                                    if(prWin) {
                                        prWin.close();
                                    }
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                }
            },{
				text: CMD_CANCEL,
				handler: function(){
					if(prWin) {
						
						prWin.close();
						
					}
				}
			}]
        });
        prWin.show();
    },

    editStandardDocu: function() {

        var selection = gm.me().gridDocuTpl.getSelectionModel().getSelection()[0];
        console_logs('===rec', selection);

        var temp_name = selection.get('temp_name');
        var docu_auth = selection.get('docu_auth');
        var docu_type = selection.get('docu_type');

        var unique_id = selection.get('unique_id_long');

        var form = Ext.create('Ext.form.Panel', {
	    	id: gu.id('formPanel'),
	    	xtype: 'form',
    		frame: false ,
    		border: false,
    		bodyPadding: '3 3 0',
    		region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 100,
                margins: 10,
			},
			items: [
                new Ext.form.Hidden({
                    name : 'unique_id',
                    value: unique_id
                }),new Ext.form.Hidden({
                    name : 'class_code',
                    value: gm.me().docu_group_code
                }),
                {
                    fieldLabel: '문서그룹',
                    xtype:'textfield',
                    id:'docu_name',
                    name: 'docu_name',
                    anchor: '60%',
                    value: gm.me().docu_group_name,
                    editable: false
                }, 
                {
                    fieldLabel: '문서명',
                    xtype: 'textfield',
                    anchor: '60%',
                    id: 'temp_name',
                    name: 'temp_name',
                    value: temp_name
                },{
                    fieldLabel: '권한유형',
                    xtype:'combo',
                    store: gm.me().UserAuthStore,
                    id:'docu_auth',
                    name: 'docu_auth',
                    anchor: '60%',
                    valueField: 'systemCode',
                    displayField: 'codeName',
                    emptyText: '선택해주세요.',
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음',
                        getInnerTpl: function() {
                            return '<div data-qtip="{}">{codeName}</div>';
                        }
                    },
                    value:docu_auth
                },{
                    fieldLabel: '문서유형',
                    xtype:'combo',
                    store: gm.me().DocuTypeStore,
                    id:'docu_type',
                    name: 'docu_type',
                    anchor: '60%',
                    valueField: 'systemCode',
                    displayField: 'codeName',
                    emptyText: '선택해주세요.',
                    value: docu_type,
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음',
                        getInnerTpl: function() {
                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                        }
                    }
                }
            ]
        });

        myHeight = 450;
        myWidth = 600;
            
        var prWin =	Ext.create('Ext.Window', {
			modal : true,
			title: '수정',
			width: myWidth,
			height: myHeight,	
			plain:true,
			items: form,
			buttons: [{
				text: CMD_OK,
				handler: function(btn){
                    if(btn == "no") {
                        prWin.close();
                    } else {
                        if(form.isValid()) {
                            var val = form.getValues(false);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/document/manage.do?method=addDocuTpl',
                                params: val,
                                success: function (result, request) {
                                    gm.me().storeDocuTpl.load();
                                    if(prWin) {
                                        prWin.close();
                                    }
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                }
            },{
				text: CMD_CANCEL,
				handler: function(){
					if(prWin) {
						
						prWin.close();
						
					}
				}
			}]
        });
        prWin.show();
    },

    fiedlRemoveActionHandler: function() {
        var rec = gm.me().gridDocuField.getSelectionModel().getSelection()[0];
        var unique_id = rec.get('unique_id_long');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/document/manage.do?method=editDocuField',
            params: {
                unique_id:unique_id,
                type:'REMOVE'
            },
            success: function(result, request) {
                gm.me().docuPropStore.load();

            }, // endofsuccess
            failure: extjsUtil.failureMessage
        }); // endofajax
    },

    removeStandardDocu: function() {
        var rec = gm.me().gridDocuTpl.getSelectionModel().getSelection()[0];
        var unique_id = rec.get('unique_id_long');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/document/manage.do?method=removeDocuTpl',
            params: {
                unique_id:unique_id
            },
            success: function(result, request) {
                gm.me().storeDocuTpl.load();

            }, // endofsuccess
            failure: extjsUtil.failureMessage
        }); // endofajax
    },

    docu_group_name: '',
    docu_group_code: '',
    
    createWest: function() {
        Ext.tip.QuickTipManager.init();
    
        this.docuTreeStore = Ext.create('Mplm.store.docuTreeStore', {});
    
        this.docuGroup = Ext.create('Ext.tree.Panel', {
            title: '문서그룹',
            collapsible: true,
            useArrows: true,
            rootVisible: false,
            width: 300,
            // plugins: 'gridexporter',
            store: this.docuTreeStore,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            multiSelect: true,
            dockedItems: [
                    {
                        dock : 'top',
                        xtype: 'toolbar',
                        items: [
                        
                        ]
                    }
            ],
            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: '계층',
                dataIndex: 'class_name',
                flex: 2,
                sortable: true
            }
        ]
        });

        this.docuTreeStore.load({
                callback: function(records, operation, success) {
                    gm.me().docuGroup.setLoading(false);
                    gm.me().selectTree();
                }
            });

        this.docuGroup.getSelectionModel().on({
            selectionchange: function(sm, selections) {
				if(selections.length) {
                    gm.me().addAction.enable();

                    var class_code = selections[0].get('class_code');
                    var class_name = selections[0].get('class_name');
                    gm.me().storeDocuTpl.getProxy().setExtraParam('class_code', class_code);
                    gm.me().storeDocuTpl.load();
                    gm.me().docu_group_name = class_name;
                    gm.me().docu_group_code = class_code;
				} else {
					gm.me().addAction.disable();
				}
			}
        });

        this.west = Ext.widget('tabpanel', {
            layout:'border',
            border: true,
            region: 'west',
            width: '25%',
            layoutConfig: {columns: 2, rows:1},
            items: [this.docuGroup /*, myFormPanel*/]
        });

        return this.west;
    },

    createCenter: function() {
        
        this.storeDocuTpl = Ext.create('Mplm.store.DocuTplStore', {});

        this.gridDocuTpl = Ext.create('Ext.grid.Panel', {
            store: this.storeDocuTpl,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
			autoHeight: true,
			selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
            // bbar: getPageToolbar(storeTemplate),
            frame: true,
            layout :'fit',
            forceFit: true,
            margin: '0 10 0 0',
			width: 700,
			dockedItems: [
				{
					dock : 'top',
					xtype: 'toolbar',
					items: [				 
                        this.addAction, this.editAction, this.removeTempAction
					]
				}
			],
            columns: [{
                text: '문서명',
                dataIndex: 'temp_name',
				width: 120
            },{
                text: '권한',
                dataIndex: 'docu_auth',
                width: 40
            },{
                text: '타입',
                dataIndex: 'docu_type',
                width: 40
            }],
            title: '문서 템플릿'
		});

		this.gridDocuTpl.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				if(selections.length) {
                    gm.me().removeTempAction.enable();
                    gm.me().editAction.enable();
                    
                    console_logs('==selec', selections);
                    var docuTpl_uid = selections[0].get('unique_id_long');
                    console_logs('==dasd', docuTpl_uid);

                    gm.me().docuPropStore.getProxy().setExtraParam('temp_uid', docuTpl_uid);
                    gm.me().docuPropStore.load();
				} else {
                    gm.me().removeTempAction.disable();
                    gm.me().editAction.disable();
				}
			}
        });
        
        this.center = Ext.widget('tabpanel', {
            layout:'border',
            border: true,
            region: 'center',
            width: '40%',
            layoutConfig: {columns: 2, rows:1},
            items: [this.gridDocuTpl /*, myFormPanel*/]
        });

        return this.center;
    },

    createEast: function() {
        
        this.docuPropStore = Ext.create('Mplm.store.DocuPropStore', {});

        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        var docuTpl_select = this.gridDocuTpl.getSelectionModel().getSelection()[0];
        console_logs('==docuTpl_select', docuTpl_select);

        this.gridDocuField = Ext.create('Ext.grid.Panel', {
            store: this.docuPropStore,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
			autoHeight: true,
			selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            // bbar: getPageToolbar(storeTemplate),
            frame: true,
            layout :'fit',
            forceFit: true,
            margin: '0 10 0 0',
            width: 650,
            plugins:cellEditing,
			dockedItems: [
				{
					dock : 'top',
					xtype: 'toolbar',
					items: [				 
                        this.fiedlAddAction, this.fiedlRemoveAction
					]
				}
			],
            columns: [
            //     {
            //     text: '문서명',
			// 	dataIndex: 'docu_name',
			// 	width: 120
            // },
            {
                text: '컬렴코드',
                dataIndex: 'system_code',
                width: 80
            },{
                text: '컬럼명',
                dataIndex: 'code_name',
                renderer: function(value, p, record, rowIndex, colIndex, store) {
                    p.tdAttr = 'style="background-color: #FFE4E4;"';
                    return value;
                },editor: {}
            },{
                text: '컬럼타입',
                dataIndex: 'code_type',
                renderer: function(value, p, record, rowIndex, colIndex, store) {
                    p.tdAttr = 'style="background-color: #FFE4E4;"';
                    switch(value) {
                        case 'textfield':
                        value = 'TEXT';
                        break;
                        case 'datefield':
                        value = 'DATE';
                        break;
                        case 'numberfield':
                        value = 'NUMBER';
                        break;
                        case 'textarea':
                        value = 'TEXTAREA';
                        default:
                        break;
  
                    }
                    return value;
                },
                width: 80,
                editor: {
                    xtype: 'combo',
                    store: this.InputTypeStore,
                    displayField: 'codeName',
                    valueField: 'systemCode',
                    id: 'code_type',
                    listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                        }
                    }
                }
            },{
                text: '순서',
                dataIndex: 'code_order',
                renderer: function(value, p, record, rowIndex, colIndex, store) {
                    p.tdAttr = 'style="background-color: #FFE4E4;"';
                    return value;
                },
                width: 40,
                editor: {}
            },{
                text: '길이',
                dataIndex: 'code_length',
                renderer: function(value, p, record, rowIndex, colIndex, store) {
                    p.tdAttr = 'style="background-color: #FFE4E4;"';
                    return value;
                },
                width: 40,
                editor: {}
            },{
                text: '높이',
                dataIndex: 'code_height',
                renderer: function(value, p, record, rowIndex, colIndex, store) {
                    p.tdAttr = 'style="background-color: #FFE4E4;"';
                    return value;
                },
                width: 40,
                // hidden: (docuTpl_select != undefined && docuTpl_select.get('docu_type').toUpperCase() == 'FORM') ? false : true,
                editor: {}
            }],
            title: '문서필드 정의'
        });

		this.gridDocuField.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				if(selections.length) {
                    gm.me().fiedlRemoveAction.enable();
				} else {
                    gm.me().fiedlRemoveAction.disable();
				}
			}
        });

        this.gridDocuField.on('edit', function(editor, e) {
            var rec = e.record;
            var field = e['field'];

            console_logs('>>>>>>>>>>>aa', e['field']);
            
            var unique_id = rec.get('unique_id_long');
            var field = e['field'];
            var value = rec.get(field);
            console_logs('====field', field);
            console_logs('====value', value);
            // return;
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/document/manage.do?method=editDocuField',
                params: {
                    unique_id:unique_id,
                    type:'EDIT',
                    field:field,
                    value:value
                },
                success: function(result, request) {
					gm.me().docuPropStore.load();

                },
                failure: extjsUtil.failureMessage
            });
        });
        
        this.east = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
            // {
            layout: 'border',
            border: true,
            region: 'east',
            width: '35%',
            layoutConfig: {
                columns: 2,
                rows: 1
            },

            items: [this.gridDocuField]
        });

        return this.east;
    },

    selectTree: function() {
        this.docuGroup.expandAll();

    },
});
