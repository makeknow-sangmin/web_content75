Ext.define('Rfx2.view.qualManage.DocuManage', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'docu-manage',
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.tip.*',
        'Ext.ux.CheckColumn',
        'Ext.grid.column.Check'
        /*'Ext.grid.plugin.Exporter'*/
    ],    
    
    initComponent: function(){

    Ext.apply(this, {
        layout: 'border',
            bodyBorder: false,

            defaults: {
                collapsible: false,
                split: true
            },
        items: [
            {
                title: '문서 선택',
                collapsible: true,
                frame: true,
                region: 'west',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                width: '60%',
                items: [this.createWest(), this.createCenter()]  
            }, {
                title: '문서 정보',
                collapsible: false,
                frame: true,
                region: 'center',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                width: '40%',
                items: [this.createEast()]  
            }
        ]
    });


    this.callParent(arguments);
    
    },

    addDocuMapAction: Ext.create('Ext.Action', {
        iconCls: 'af-plus-circle',
        text: '추가',
        tooltip: '추가',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            gm.me().addDocuMap();
        }
    }),

    comfirmAction: Ext.create('Ext.Action', {
        // iconCls: 'af-plus-circle',
        text: '리비전',
        tooltip: '리비전',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            Ext.MessageBox.show({
                title: '리비전 관리',
                msg: '리비전 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn) {
                    if(btn == "no") {
                        return;
                    } else if(btn == "yes"){
                        gm.me().comfirmHandler('revision');
                    }
                }
            });
            
        }
    }),

    editFormAction: Ext.create('Ext.Action', {
        // iconCls: 'af-plus-circle',
        text: '저장',
        tooltip: '저장',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            gm.me().comfirmHandler('update');
        }
    }),

    docuExcelAction: Ext.create('Ext.Action', {
        // iconCls: 'af-plus-circle',
        text: '파일 다운',
        tooltip: '파일 다운',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            gm.me().docuExcelDownHandler();
        }
    }),

    reverseRevisionAction: Ext.create('Ext.Action', {
        // iconCls: 'af-plus-circle',
        text: '리비전 변경',
        tooltip: '리비전 변경',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            gm.me().reverseRevision();
        }
    }),
    
    addAction: Ext.create('Ext.Action', {
        iconCls: 'af-plus-circle',
        text: '신규등록',
        tooltip: '신규등록',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            gm.me().addDocuTpl();
        }
    }),

    editAction: Ext.create('Ext.Action', {
        iconCls: 'af-edit',
        text: gm.getMC('CMD_MODIFY', '수정'),
        tooltip: '수정',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            // gm.me().addStandardDocu();
        }
    }),

    removeAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: '삭제',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            gm.me().deleteRpInfo();
        }
    }),

    revisionAction: Ext.create('Ext.Action', {
        iconCls: 'af-plus-circle',
        text: '개정',
        tooltip: '개정',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            gm.me().amendment();
        }
    }),

    westSearchAction: Ext.create('Ext.Action', {
        iconCls: 'af-search',
        text: CMD_SEARCH/*'검색'*/,
        disabled: false,
        handler: function(widget, event) {
            console_logs('>>>>>search', gm.me().docuTplStore);
            var temp_name = Ext.getCmp('search_tempName').getValue();
            console_logs('>>>tempName', temp_name);
            gm.me().docuTplStore.getProxy().setExtraParam('temp_name', temp_name);
            gm.me().docuTplStore.load();
        }
    }),

    createWest: function() {
        Ext.tip.QuickTipManager.init();

        this.docuTplStore = Ext.create('Mplm.store.DocuTplStore', {});
        this.docuTplStore.getProxy().setExtraParam('empty_temp_type', 'Y');
        this.docuTplStore.getProxy().setExtraParam('not_multi', 'Y');
        this.docuTplStore.load();
        
        this.docuGroup = Ext.create('Ext.grid.Panel', {
            // title: 'DocuMent',
            collapsible: false,
            cls : 'rfx-panel',
            width: '100%',
            autoScroll : true,
            autoHeight: true,
            border: true,
            layout          :'fit',
            forceFit: true,
            // margin: -5,
            // plugins: 'gridexporter',
            store: this.docuTplStore,
            bbar: getPageToolbar(this.docuTplStore),
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
            multiSelect: true,
            dockedItems: [ 
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        this.westSearchAction
                    ],
                },{
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'textfield',
                            // fieldLabel: '템플릿명',
                            emptyText: '템플릿명',
                            id:'search_tempName',
                            name:'search_tempName',
                            listeners: {
                                specialkey: function(f,e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().docuTplStore.getProxy().setExtraParam('temp_name', f.value);
                                        gm.me().docuTplStore.load();
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                'onTrigger1Click': function() {
                                    Ext.getCmp('search_tempName').setValue('');
                                    gm.me().docuTplStore.getProxy().setExtraParam('temp_name', null);
                                    gm.me().docuTplStore.load();
                            }
                        }
                    ],
                }
            ],
            columns: [
            {   
                text: '템플릿명',
                dataIndex: 'temp_name',
                flex: 1,
                sortable: true,
            },{   
                text: '타입',
                dataIndex: 'docu_type',
                flex: 1,
                sortable: true,
            },{   
                text: '경로',
                dataIndex: 'docu_path',
                flex: 1,
                sortable: true,
            }
            
        ],
            title: '문서 템플릿',  
            // margin: '25 0 0 0'          
        });

        // var panel = Ext.create('Ext.panel.Panel', {
		// 	id: "groupTab",
		//     layout:'border',
		//     title: '문서그룹 목록',
		//     border: false,
		//     tabPosition: 'bottom',
		//     layoutConfig: {columns: 2, rows:1},
		//     items: [this.docuGroup]
        // });
        
        this.docuGroup.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length) {
                    console_logs('====selections', selections);
                    var parent_uid = selections[0].get('unique_id_long');
                    gm.me().storeDocuInfo.getProxy().setExtraParam('parent', parent_uid);
                    gm.me().storeDocuInfo.getProxy().setExtraParam('last_revision', true);
                    gm.me().storeDocuInfo.load();
                    gm.me().storeDocuField.getProxy().setExtraParam('temp_uid', parent_uid);
                    var docu_type = selections[0].get('docu_type');
                        docu_type = docu_type.toUpperCase();
                        console_logs('>>>>>>docu_type', docu_type);
                    gm.me().storeDocuField.load(function(data, id){
                        console_logs('>>>>>>data', data);
                        console_logs('>>>>>>id', id);
                        switch(docu_type) {
                            case 'FORM':
                                gm.me().east.child('#docuForm').tab.show();
                                gm.me().east.child('#gridDocuDetail').tab.hide();
                                gm.me().formFields = [];
                                for(var i=0; i<data.length; i++) {
                                    var rows = data[i].get('code_type').toUpperCase() == 'TEXTAREA' ? 50 : 0;
                                    gm.me().formFields.push(
                                        {
                                            fieldLabel: data[i].get('code_name'),
                                            xtype: data[i].get('code_type'),
                                            width: data[i].get('code_length'),
                                            height: rows,
                                            name: data[i].get('system_code')
                                        }
                                    )
                                }
                                gm.me().docuForm.removeAll();
                                gm.me().docuForm.add(gm.me().formFields);
                                gm.me().east.setActiveItem(Ext.getCmp('docuForm'));
                            break;
                            case 'SHEET':
                                gm.me().east.child('#gridDocuDetail').tab.show();
                                gm.me().east.child('#docuForm').tab.hide();
                                gm.me().docuFields = [];
                                for(var i=0; i<data.length; i++) {
                                    gm.me().docuFields.push(
                                        {
                                            text: data[i].get('code_name'),
                                            width: data[i].get('code_length'),
                                            sortable: true,
                                            dataIndex: data[i].get('system_code'),
                                            // renderer: function(value, p, record, rowIndex, colIndex, store) {
                                            //     p.tdAttr = 'style="background-color: #FFE4E4;"';
                                            //     return value;
                                            // },
                                            editor: {}
                                        }
                                    )
                                }
                                gm.me().gridDocuDetail.reconfigure(undefined, gm.me().docuFields);
                                gm.me().east.setActiveItem(Ext.getCmp('gridDocuDetail'));
                            break;
                            default:
                            break;
                        }
                        
                        // switch(docu_type) {
                        //     case 'FORM':
                        //         gm.me().east.setActiveItem(Ext.getCmp('docuForm'));

                        //     break;
                        //     case 'SHEET':
                        //         gm.me().east.setActiveItem(null);
                        //         gm.me().east.setActiveItem(Ext.getCmp('gridDocuDetail'));
                        //     break;
                        //     default:
                        //     break;
                        // }
                        
                        // Ext.resumeLayouts(true);
                    });

                    gm.me().addAction.enable();
                    
                } else {
                    gm.me().addAction.disable();
                }
            }
        });

        this.west = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
            // {
            layout: 'border',
            border: true,
            region: 'west',
            width: '50%',
            // collapsible: true,
            layoutConfig: {
                columns: 2,
                rows: 1,
            },

            items: [this.docuGroup]
        });

        return this.west;
    },

    createCenter: function() {
            this.storeDocuInfo = Ext.create('Mplm.store.DocuInfoStore', {});

            var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            });
            
        this.gridDocuInfo = Ext.create('Ext.grid.Panel', {
            store: this.storeDocuInfo,
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
            // margin: '0 10 0 0',
            width: 650,
            plugins:cellEditing,
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addAction, this.removeAction, this.revisionAction
                    ]
                }
            ],
            columns: [{
                text: '제목',
                dataIndex: 'fname',
                width: 80,
                renderer: function(value, p, record, rowIndex, colIndex, store) {
                    // console_logs('===p', p);
                    // p.tdAttr = 'style="background-color: #FFE4E4;"';
                    // console_logs('===p2', p);
                    return value;
                },
                // editor: {}
            },{
                text: '버전',
                dataIndex: 'major',
                width: 40
            },{
                text: '리비전',
                dataIndex: 'minor',
                width: 40
            },{
                text: '생성자',
                dataIndex: 'rpinfo_creator',
                width: 40
            },{
                text: '생성날짜',
                dataIndex: 'create_date',
                width: 80,
                renderer: Ext.util.Format.dateRenderer('Y-m-d')
            }],
            // title: '문서정보'
        });

        this.gridDocuInfo.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length) {
                    console_logs('======<<<<>', selections);
                    var unique_uid = selections[0].get('unique_id_long');
                    var rpinfo_uid = selections[0].get('rpinfo_uid');

                    var docu_type = gm.me().docuGroup.getSelectionModel().getSelection()[0].get('docu_type');
                        docu_type = docu_type.toUpperCase();

                    switch(docu_type) {
                        case 'FORM':
                        gm.me().east.setActiveItem(Ext.getCmp('docuForm'));
                        gm.me().storeDocuMap.getProxy().setExtraParam('target_uid', unique_uid);
                        gm.me().storeDocuMap.load(function() {
                            var form = Ext.getCmp('docuForm');
                            console_logs('======qqq', gm.me().storeDocuMap);
                            if(gm.me().storeDocuMap.getAt(0) != null) {
                                form.loadRecord(gm.me().storeDocuMap.getAt(0));
                            }     
                        });
                        break;
                        case 'SHEET':
                        gm.me().east.setActiveItem(Ext.getCmp('gridDocuDetail'));
                        gm.me().storeDocuMap.getProxy().setExtraParam('target_uid', unique_uid);
                        gm.me().storeDocuMap.load();
                        break;
                        default:
                        break;
                    }

                    // gm.me().storeDocuMap.getProxy().setExtraParam('target_uid', unique_uid);
                    // gm.me().storeDocuMap.load();
                    gm.me().DocuRevisionStore.getProxy().setExtraParam('child', rpinfo_uid);
                    gm.me().DocuRevisionStore.load();
                    // gm.me().addAction.enable();
                    gm.me().removeAction.enable();
                    gm.me().revisionAction.enable();
                    gm.me().addDocuMapAction.enable();
                    gm.me().comfirmAction.enable();
                    gm.me().editFormAction.enable();
                    gm.me().docuExcelAction.enable();
                } else {    
                    // gm.me().addAction.disable();
                    gm.me().removeAction.disable();
                    gm.me().revisionAction.disable();
                    gm.me().addDocuMapAction.disable();
                    gm.me().comfirmAction.disable();
                    gm.me().editFormAction.disable();
                    gm.me().docuExcelAction.disable();

                    gm.me().east.child('#docuForm').tab.hide();
                    gm.me().east.child('#gridDocuDetail').tab.hide();
                }
            }
        });

        this.gridDocuInfo.on('edit', function(editor, e) {
            var rec = e.record;
            var field = e['field'];

            console_logs('>>>>>>>>>>>aa', e['field']);
            
            var unique_id = rec.get('unique_id_long');
            var field = e['field'];
            var value = rec.get(field);
            console_logs('====field', field);
            console_logs('====value', value);

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/document/manage.do?method=editToken',
                params: {
                    rptoken_uid:unique_id,
                    type:'EDIT',
                    field:field,
                    value:value
                },
                success: function(result, request) {
					gm.me().storeDocuInfo.load();

                },
                failure: extjsUtil.failureMessage
            });
        });

        this.DocuRevisionStore = Ext.create('Mplm.store.DocuInfoStore', {});

        this.gridDocuRevision = Ext.create('Ext.grid.Panel', {
            store: this.DocuRevisionStore,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            titleCollapsed: false,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
            // bbar: getPageToolbar(storeTemplate),
            frame: true,
            layout :'fit',
            forceFit: true,
            // margin: '0 10 0 0',
            width: 650,
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [this.reverseRevisionAction]
                }
            ],
            columns: [{
                text: '제목',
                dataIndex: 'fname',
                width: 70
            },{
                text: '버전',
                dataIndex: 'major',
                width: 40
            },{
                text: '리비전',
                dataIndex: 'minor',
                width: 40
            },{
                text: '생성자',
                dataIndex: 'rpinfo_creator',
                width: 40
            },{
                text: '생성날짜',
                dataIndex: 'create_date',
                width: 50,
                renderer: Ext.util.Format.dateRenderer('Y-m-d')
            }],
            title: '문서이력'
        });

        this.revisioneTab = Ext.widget('tabpanel', {
			collapsible: true,
			title: '문서 이력',
		    layout: 'border',
            region: 'south',
            height: '50%',
            titleCollapsed: false,
            collapsed: true,
            animate: true,
            style: {
                border: '1px solid #133160'//,
                //borderStyle: 'dotted'
             },
		    // tabPosition: 'top',
		    layoutConfig: {
		        columns: 1,
		        rows: 1
		    },
		    items: [this.gridDocuRevision]
		});

        this.gridDocuRevision.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length) {
                    var unique_uid = selections[0].get('unique_id_long');
                    var rpinfo_uid = selections[0].get('rpinfo_uid');
                    var type = gm.me().docuGroup.getSelectionModel().getSelection()[0].get('docu_type').toUpperCase();
                    if(type == 'FORM') {
                        gm.me().storeDocuMap.getProxy().setExtraParam('target_uid', unique_uid);
                        gm.me().storeDocuMap.load(function() {
                            var form = Ext.getCmp('docuForm');
                            if(gm.me().storeDocuMap.getAt(0) != null) {
                                form.loadRecord(gm.me().storeDocuMap.getAt(0));
                            } else {
                                form.reset(true);
                            }
                        });
                    } else {
                        gm.me().storeDocuMap.getProxy().setExtraParam('target_uid', unique_uid);
                        gm.me().storeDocuMap.load();
                    }
                    
                    gm.me().reverseRevisionAction.enable();
                    gm.me().comfirmAction.disable();
                    gm.me().editFormAction.disable();
                } else {
                    gm.me().reverseRevisionAction.disable();
                }
            }
        });

        var panel = Ext.create('Ext.panel.Panel', {
			id: "docuinfoTab",
		    layout:'border',
		    title: '문서정보',
		    border: false,
		    tabPosition: 'bottom',
		    layoutConfig: {columns: 2, rows:1},
		    items: [this.gridDocuInfo, this.revisioneTab]
		}); 

        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'west',
            width: '50%',
            tabPosition: 'top',
            // collapsible: true,
            items: [panel]
        })

        return this.center;
    },

    createEast: function() {
        this.storeDocuField = Ext.create('Mplm.store.DocuPropStore', {});

        this.storeDocuMap = Ext.create('Mplm.store.DocuStore');

        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: true,
            listeners: {
                'edit': function(e) {
                    gm.me().comfirmHandler('update');
                }
            }
        });

        this.gridDocuDetail = Ext.create('Ext.grid.Panel', {
            id:'gridDocuDetail',
            store: this.storeDocuMap,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            title: 'Sheet',
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
            // bbar: getPageToolbar(storeTemplate),
            frame: true,
            layout :'fit',
            forceFit: true,
            margin: '0 10 0 0',
            width: '100%',
            plugins:rowEditing,
            // bbar: getPageToolbar(this.storeDocuMap),
            tabConfig: {
                    itemId: 'sheetTab',
                    hidden: true
                },
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addDocuMapAction, this.comfirmAction, this.docuExcelAction
                    ]
                }
            ],
            columns: this.docuFields,
            bbar: getPageToolbar(this.storeDocuMap),
            // title: '문서정보'
        });

        this.docuForm = Ext.create('Ext.form.Panel', {
                // renderTo: document.body,
                id: 'docuForm',
                title: 'Form',
                // height: 350,
                width: '100%',
                bodyPadding: 10,
                defaultType: 'textfield',
                tabConfig: {
                    itemId: 'formTab',
                    hidden: true
                },
                dockedItems: [
                    {
                        dock : 'top',
                        xtype: 'toolbar',
                        items: [				 
                            this.comfirmAction, /*this.editFormAction,*/ this.docuExcelAction
                        ]
                    }
                ],
                store: this.storeDocuMap,
                items: this.formFields
            });

        this.gridDocuDetail.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length) {
                    // gm.me().comfirmAction.enable();
                } else {
                    // gm.me().comfirmAction.disable();
                }
            }
        });

        // this.docutypeTab = Ext.widget('tabpanel', {
		// 	collapsible: true,
		// 	title: '문서타입',
		//     layout: 'border',
        //     region: 'south',
        //     height: '40%',
        //     titleCollapsed: true,
        //     collapsed: true,
        //     animate: true,
        //     style: {
        //         border: '1px solid #133160'//,
        //         //borderStyle: 'dotted'
        //      },
		//     tabPosition: 'top',
		//     layoutConfig: {
		//         columns: 1,
		//         rows: 1
		//     },
		//     items: [this.gridDocuDetail]
		// });

        // var panel = Ext.create('Ext.panel.Panel', {
		// 	id: "mapTab",
		//     layout:'border',
		//     title: '내용정보',
		//     border: false,
		//     tabPosition: 'bottom',
		//     layoutConfig: {columns: 2, rows:1},
		//     items: [this.docutypeTab]
		// });

        this.east = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
            // {
            layout: 'border',
            border: true,
            region: 'east',
            width: '100%',
            layoutConfig: {
                columns: 2,
                rows: 1
            },

            items: [this.gridDocuDetail, this.docuForm]
        });

        return this.east;
    },

    docuFields: [],

    formFields: [],

    addDocuTpl: function() {

        var selection = gm.me().docuGroup.getSelectionModel().getSelection()[0];

        var form = Ext.create('Ext.form.Panel', {
	    	id: gu.id('formRpfile'),
	    	xtype: 'form',
    		frame: false ,
    		border: false,
    		bodyPadding: '3 3 0',
            region: 'center',
            layout:'column',
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
                    name : 'parent',
                    value: selection.get('unique_id_long')
                }),
                new Ext.form.Hidden({
                    name : 'docu_type',
                    value: selection.get('docu_type')
                }),
                {
                    fieldLabel: '문서 제목',
                    xtype:'textfield',
                    id:'temp_name',
                    name: 'temp_name',
                    anchor: '100%'
                },{
                    xtype:'button',
                    width: 80,
                    text:'중복확인',
                    handler: function(){
                        gm.me().checkAddName();
                    }
                }
            ]
        });

        myHeight = 120;
        myWidth = 500;

        var prWin =	Ext.create('Ext.Window', {
			modal : true,
			title: '추가',
			width: myWidth,
			height: myHeight,	
			plain:true,
			items: form,
			buttons: [{
                text: CMD_OK,
                id:'addBtnOk',
                disabled: true,
				handler: function(btn){
                    if(btn == "no") {
                        prWin.close();
                    } else {
                        if(form.isValid()) {
                            var val = form.getValues(false);
                            var parent = selection.get('unique_id_long');
                            // var temp_name = selection.get('temp_name');
                            var docu_type = selection.get('docu_type');

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/document/manage.do?method=addRpInfoRecord',
                                params: val,
                                success: function (result, request) {
                                    if(prWin) {
                                        prWin.close();
                                    }
                                    gm.me().storeDocuInfo.load();
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

        // var selection = gm.me().docuGroup.getSelectionModel().getSelection()[0];
        // var parent = selection.get('unique_id_long');
        // var temp_name = selection.get('temp_name');
        // var docu_type = selection.get('docu_type');

        // Ext.Ajax.request({
        //     url: CONTEXT_PATH + '/document/manage.do?method=addRpInfoRecord',
        //     params: {
        //         parent:parent,
        //         temp_name: temp_name,
        //         docu_type: docu_type
        //     },
        //     success: function (result, request) {
        //         gm.me().storeDocuInfo.load();
        //     },
        //     failure: extjsUtil.failureMessage
        // });
    },

    addDocuMap: function() {
        var rpfileToken_uid = gm.me().gridDocuInfo.getSelectionModel().getSelection()[0].get('unique_id_long');
        if(rpfileToken_uid == null || rpfileToken_uid == '' || rpfileToken_uid == undefined) {
            Ext.Msg.alert('알림','문서를 선택해 주세요.');
			return;
        }
        Ext.Ajax.request({
			url: CONTEXT_PATH + '/document/manage.do?method=addDocuMapSetRow',
			params:{
				rpfileToken_uid:rpfileToken_uid
			},
			
			success : function(result, request) { 
				gm.me().storeDocuMap.load();
				
			},// endofsuccess
			failure: extjsUtil.failureMessage
		});// endofajax
    },

    // 개정 : Major 버전을 올림
    amendment:function() {
        Ext.MessageBox.show({
                title: '개정',
                msg: '문서 버전을 올리시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn) {
                    if(btn == "no") {
                     
                    } else if(btn == "yes"){

                        var selection = gm.me().gridDocuInfo.getSelectionModel().getSelection()[0];

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/document/manage.do?method=rpinfoRevision',
                            params: {
                                rpinfo_uid: selection.get('rpinfo_uid'),
                                rptoken_uid: selection.get('unique_id_long'),
                                major: selection.get('major')
                            },
                            success: function (result, request) {
                                gm.me().storeDocuInfo.load();
                            },
                            failure: extjsUtil.failureMessage
                        });
                    }
                }
            });
    },

    deleteRpInfo: function() {
        Ext.MessageBox.show({
                title: '삭제',
                msg: '문서를 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn) {
                    if(btn == "no") {
                        
                    } else if(btn == "yes"){

                        var selection = gm.me().gridDocuInfo.getSelectionModel().getSelection()[0];

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/document/manage.do?method=rpinfoDelete',
                            params: {
                                unique_id: selection.get('rpinfo_uid')
                            },
                            success: function (result, request) {
                                gm.me().storeDocuInfo.load();
                            },
                            failure: extjsUtil.failureMessage
                        });
                    }
                }
            });
    },

    reverseRevision:function() {
        Ext.MessageBox.show({
                title: '변경',
                msg: '선택하신 데이터로 변경하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn) {
                    if(btn == "no") {
                        
                    } else if(btn == "yes"){
                        var selection = gm.me().gridDocuInfo.getSelectionModel().getSelection()[0];
                        var select_revision = gm.me().gridDocuRevision.getSelectionModel().getSelection()[0];

                        var rpInfo_uid = selection.get('rpinfo_uid');
                        var rptoken_uid = select_revision.get('unique_id_long');

                        console_logs('=====rpInfo_uid', rpInfo_uid);
                        console_logs('=====rptoken_uid', rptoken_uid);

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/document/manage.do?method=reverseRevision',
                            params: {
                                rpinfo_uid: rpInfo_uid,
                                rptoken_uid: rptoken_uid
                            },  
                            success: function (result, request) {
                                gm.me().storeDocuInfo.load();
                            },
                            failure: extjsUtil.failureMessage
                        });
                    }
                }
        });
    },

    docuExcelDownHandler: function() {

        var docu_temp = gm.me().docuGroup.getSelectionModel().getSelection()[0];
        var docu_info = gm.me().gridDocuInfo.getSelectionModel().getSelection()[0];

        var temp_uid = docu_temp.get('unique_id_long');
        var child = docu_info.get('rpinfo_uid');
        var target_uid = docu_info.get('unique_id_long');

        console_logs('=======child', child);
        console_logs('=======docuiNFO', docu_info);

        // return;
        
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/document/manage.do?method=docuExcelFileDown',
            params: {
                temp_uid:temp_uid,
                last_revision: true,
                child:child,
                target_uid:target_uid
            },  
            success: function (result, request) {
                var jsonData = Ext.decode(result.responseText);
				var excelPath = jsonData.excelPath;
				if(excelPath!=null && excelPath.length > 0) {
                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
                    // console_logs('>>>url', url);
                    top.location.href=url;
                } else {
                    alert('다운로드 경로를 찾을 수 없습니다.');
                }
            },
            failure: extjsUtil.failureMessage
        });
    },

    comfirmHandler: function(gubun) {
        var selection = gm.me().gridDocuInfo.getSelectionModel().getSelection()[0];
        var select_documap = gm.me().gridDocuDetail.store.data.items;
        var select_docuForm = gm.me().docuForm.items.items;
        
        switch(gubun) {
            case 'revision':
                var jsonData = [];
                var jsonDatas = '';
                var values = null;

                var type = gm.me().docuGroup.getSelectionModel().getSelection()[0].get('docu_type').toUpperCase();

                var select = select_documap;
                var fields = gm.me().docuFields;
                var total_length = gm.me().gridDocuDetail.store.data.length;

                switch(type) {
                    case 'FORM':
                    select = select_docuForm;
                    fields = gm.me().formFields;
                    total_length = gm.me().docuForm.items.items.length;
                    break;
                    case 'SHEET':
                    select = select_documap;
                    fields = gm.me().docuFields;
                    total_length = gm.me().gridDocuDetail.store.data.length;
                    break;
                }

                if(type == 'FORM') {
                    total_length = 1;
                }

                for(var j=0; j<total_length; j++) {
                        for(var i=0; i<fields.length; i++) {
                            var docuField = fields[i];
                            var dataIndex = '';
                            var value = null;
                            if(type == 'SHEET') {
                                dataIndex = docuField.dataIndex;
                                value = select[j].get(dataIndex);
                            } else {
                                    dataIndex = docuField.name;
                                    value = select[i].value;
                            }

                            if(value == null || value == '') {
                                value = '\"\"';
                            }
                            var a = '';
                            if(value != null && value.length > 0) {
                                a = dataIndex + ':' + '\'' + value + '\'';
                            } else {
                                a = dataIndex + ':' +  value;
                            }
                            
                            console_logs('>>>a', a);
                            values = values == null ? a : values + ', ' + a;

                    }
                    jsonDatas = jsonDatas == '' ? '{' + values + '}' : jsonDatas + ', ' + '{' + values + '}' ;
                    values = null;
                }
                jsonData = '[' + jsonDatas + ']';

                console_logs('===data', jsonData);
                // return;
                    Ext.Ajax.request({
                    url: CONTEXT_PATH + '/document/manage.do?method=docuEditComfirm',
                    params: {
                        rpinfo_uid: selection.get('rpinfo_uid'),
                        rptoken_uid: selection.get('unique_id_long'),
                        major: selection.get('major'),
                        minor: selection.get('minor'),
                        jsonDatas : jsonData,
                        gubun:gubun
                    },  
                    success: function (result, request) {
                        var docu_type = gm.me().docuGroup.getSelectionModel().getSelection()[0].get('docu_type');
                            docu_type = docu_type.toUpperCase();
                            gm.me().storeDocuInfo.load();
                            switch(docu_type) {
                                case 'FORM':
                                gm.me().east.setActiveItem(Ext.getCmp('docuForm'));
                                gm.me().storeDocuMap.load(function() {
                                    var form = Ext.getCmp('docuForm');
                                    if(gm.me().storeDocuMap.getAt(0) != null) {
                                        form.loadRecord(gm.me().storeDocuMap.getAt(0));
                                    }     
                                });
                                break;
                                case 'SHEET':
                                gm.me().east.setActiveItem(Ext.getCmp('gridDocuDetail'));
                                gm.me().storeDocuMap.load();
                                break;
                                default:
                                break;
                            }
                    },
                    failure: extjsUtil.failureMessage
                });
            break;
            case 'update':
                var jsonData = [];
                var jsonDatas = '';
                var values = null;

                var type = gm.me().docuGroup.getSelectionModel().getSelection()[0].get('docu_type').toUpperCase();

                var select = select_documap;
                var fields = gm.me().docuFields;
                var total_length = gm.me().gridDocuDetail.store.data.length;
                var sheet_store = null;
                var form_store = null;
                
                var gubun_uid = null;
                switch(type) {
                    case 'FORM':
                    fields = gm.me().formFields;
                    total_length = gm.me().docuForm.items.items.length;
                    form_store = gm.me().docuForm.items.items;
                    console_logs('>>>>aaa', gm.me().docuForm.store.data.items[0]);
                    // return;
                    select = form_store;
                    gubun_uid = gm.me().docuForm.store.data.items[0].get('unique_id_long');
                    console_logs('>>>>gubun_uid', gubun_uid);
                    break;
                    case 'SHEET':
                    fields = gm.me().docuFields;
                    total_length = gm.me().gridDocuDetail.store.data.length;
                    sheet_store = gm.me().gridDocuDetail.getSelectionModel().getSelection()[0];
                    select = sheet_store;
                    gubun_uid = sheet_store.get('unique_id_long');
                    break;
                }

                if(type == 'FORM') {
                    total_length = 1;
                }
                for(var j=0; j<1; j++) {
                        for(var i=0; i<fields.length; i++) {
                            var docuField = fields[i];
                            var dataIndex = '';
                            var value = null;
                            if(type == 'SHEET') {
                                dataIndex = docuField.dataIndex;
                                value = select.get(dataIndex);
                            } else {
                                dataIndex = docuField.name;
                                value = select[i].value;
                            }

                            if(value == null || value == '') {
                                value = '\"\"';
                            }
                            var a = '';
                            if(value != null && value.length > 0) {
                                a = dataIndex + ':' + '\'' + value + '\'';
                            } else {
                                a = dataIndex + ':' +  value;
                            }
                            
                            console_logs('>>>a', a);
                            values = values == null ? a : values + ', ' + a;

                    }
                    jsonDatas = jsonDatas == '' ? '{' + values + '}' : jsonDatas + ', ' + '{' + values + '}' ;
                    values = null;
                }
                jsonData = '[' + jsonDatas + ']';

                console_logs('===data', jsonData);

                    Ext.Ajax.request({
                    url: CONTEXT_PATH + '/document/manage.do?method=docuEditComfirm',
                    params: {
                        rpinfo_uid: selection.get('rpinfo_uid'),
                        rptoken_uid: selection.get('unique_id_long'),
                        major: selection.get('major'),
                        minor: selection.get('minor'),
                        jsonDatas : jsonData,
                        gubun:gubun,
                        documap_uid:gubun_uid
                    },  
                    success: function (result, request) {
                        var docu_type = gm.me().docuGroup.getSelectionModel().getSelection()[0].get('docu_type');
                            docu_type = docu_type.toUpperCase();

                            switch(docu_type) {
                                case 'FORM':
                                gm.me().east.setActiveItem(Ext.getCmp('docuForm'));
                                gm.me().storeDocuMap.load(function() {
                                    var form = Ext.getCmp('docuForm');
                                    if(gm.me().storeDocuMap.getAt(0) != null) {
                                        form.loadRecord(gm.me().storeDocuMap.getAt(0));
                                    }     
                                    gm.me().showToast('결과', 'FORM 수정되었습니다.');
                                });
                                break;
                                case 'SHEET':
                                gm.me().east.setActiveItem(Ext.getCmp('gridDocuDetail'));
                                gm.me().storeDocuMap.load(function() {
                                    gm.me().showToast('결과', 'SHEET 수정되었습니다.');
                                });
                                break;
                                default:
                                break;
                            }
                    },
                    failure: extjsUtil.failureMessage
                });
            break;
        }

        
    },

    checkAddName: function() {
        var temp_name = Ext.getCmp('temp_name').getValue();
        var docuTpl_uid = gm.me().docuGroup.getSelectionModel().getSelection()[0].get('unique_id_long');
        
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/document/manage.do?method=checkInfoName',
            params: {
                temp_name:temp_name,
                docuTpl_uid:docuTpl_uid
            },  
            success: function (result, request) {
               var jsonData = Ext.decode(result.responseText);
               console_logs('>>>>>jsonData', jsonData);
               var cnt = jsonData.count;
               if(cnt > 0) {
                  Ext.getCmp('addBtnOk').setDisabled(true);
                  Ext.MessageBox.alert('알림', '동일한 제목의 문서가 있습니다.');  
               } else {
                  Ext.getCmp('addBtnOk').setDisabled(false);
                  Ext.MessageBox.alert('알림', '등록 가능합니다.');  
               }
            },
            failure: extjsUtil.failureMessage
        });
    }
});
