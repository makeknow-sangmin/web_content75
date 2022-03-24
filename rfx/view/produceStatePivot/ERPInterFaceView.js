Ext.define('Rfx.view.produceStatePivot.ERPInterFaceView', {
    extend: 'Ext.panel.Panel',
    xtype: 'erp-if-view',
    initComponent: function(){

        var items = [
            this.gridIFMenu,
            this.gridDataInfo
        ];

        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,

            defaults: {
                collapsible: false,
                split: true
            },
            items: [
                {
                    title: '인터페이스 선택',
                    collapsible: true,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    width: '20%',
                    items: [this.createWest()]  
                }, {
                    title: '매핑목록',
                    collapsible: false,
                    frame: true,
                    region: 'center',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    width: '80%',
                    items: [this.createCenter()]  
                }
            ]
        });

        var action = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '성적서',
                tooltip: '성적서',
                big_pcs_code: null,
                toggleGroup: this.link + 'bigPcsType',
                handler: function() {
                    
                }
        });

        var action2 = Ext.create('Ext.Action', {
                xtype : 'button',
                text: 'SPC',
                tooltip: 'SPC',
                big_pcs_code: null,
                toggleGroup: this.link + 'bigPcsType',
                handler: function() {
                    
                }
        });
        
            // buttonToolbar.insert(6, action);
            // buttonToolbar.insert(7, action2);


        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

    },

    settingColumnAction: Ext.create('Ext.Action', {
        iconCls: 'fa-typcn-th-list-outline_14_0_5395c4_none',
        text: '컬럼 설정',
        tooltip: '컬럼 설정',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            gm.me().settingColumnHandler();
        }
    }),

    callDbInterFaceAction: Ext.create('Ext.Action', {
        iconCls: 'fa-typcn-th-list-outline_14_0_5395c4_none',
        text: '인터페이스 호출',
        tooltip: '인터페이스 호출',
        toggleGroup: 'toolbarcmd',
        disabled: false,
        handler: function() {
            gm.me().callInterFaceHandler();
        }
    }),

    callInterFaceHandler: function() {
        Ext.MessageBox.show({
            title: '확인',
            msg: '호출하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/database/if.do?method=callInterFaceDb',
                        success: function(result, request) {
                            var jsonData = Ext.JSON.decode(result.responseText);
                            console_logs('>>>json', jsonData.datas);
                        },
                        failure: extjsUtil.failureMessage
                    });
                } else {
                    return;
                }
            }
        });
    },
    
    settingColumnHandler: function() {
        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/'컬럼 설정',
            width: '80%',
            height: '80%',
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype:'container',
            plain: true,
            items: [
                {
                xtype: 'panel',
                id: 'Column_Grid',
                autoScroll: true,
                autoWidth: true,
                flex: 3,
                padding: '5',
                items:gm.me().columnSettingForm()
            }
            ],
            buttons: [{
                text: CMD_OK,
                handler: function() {
                    if(win) {win.close();}
                }
            }]
        });
	win.show();
    },

    columnSettingForm: function() {
        var SETTING_COLUMN = [];
        SETTING_COLUMN.push(
            {
                header:'No.', xtype: 'rownumberer',	
                width : 100,  align: 'left',resizable:true,sortable : true,
            },
            {
				header:'POP 테이블', dataIndex: 'table_name',	
                width : 200,  align: 'left',resizable:true,sortable : true,
                css: 'edit-cell', renderer: function(value, meta) {
                    meta.css = 'custom-column';
                    return value;
                },
                editor: {}
            },
            {
				header:'POP 컬럼', dataIndex: 'column_name',	
                width : 200,  align: 'left',resizable:true,sortable : true,
                css: 'edit-cell', renderer: function(value, meta) {
                    meta.css = 'custom-column';
                    return value;
                },
                editor: {}
            },
            {
				header:'POP 컬럼', dataIndex: 'column_comment',	
                width : 200,  align: 'left',resizable:true,sortable : true,
                css: 'edit-cell', renderer: function(value, meta) {
                    meta.css = 'custom-column';
                    return value;
                },
                editor: {}
            }
        );

        this.colSettingStore = Ext.create('Mplm.store.DBColSetStore', {});
        // this.colSettingStore.load();

        setting_grid = Ext.create('Ext.grid.Panel', {
            id: 'set-div2',
            store: this.colSettingStore,
            multiSelect: true,
            stateId: 'stateGridsub',
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            autoScroll : true,
            autoHeight: true,
            height: 650,  // (getCenterPanelHeight()/5) * 4
    //        bbar: getPageToolbar(store),
            region: 'center',
            columns: /*(G)*/SETTING_COLUMN,
            // plugins:cellEditing,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
            dockedItems: [
                {

                    xtype : 'toolbar',
                    items : gm.me().getSearchToolbar()
                }
            ]
        });
        
        return setting_grid;
    },

    getSearchToolbar: function() {
        var tableCombo = [];
        this.dbInfoStore = Ext.create('Mplm.store.DBInfoStore', {});
        this.dbInfoStore.getProxy().setExtraParam('direct', 'TO');
        this.dbTableStore = Ext.create('Mplm.store.DBTableStore', {});


        tableCombo.push(
            {
                id: 'db_name',
                name: 'db_name',
                xtype:          'combobox',
				triggerAction:  'all',
				editable:       false,
				width: 200,
                emptyText:  '데이터베이스를 선택해주세요.',
				//value: ppo1_CTstatus,
				displayField:   'db_name',
				valueField:     'unique_id',
				fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				queryMode: 'remote',
				// value: '-미지정-',
				store:this.dbInfoStore,
				listConfig:{
					getInnerTpl: function(){
						return '<div data-qtip="{unique_id}">{db_name}</div>';
					}			                	
				},
				listeners: {
					select: function (combo, record) {
                        gm.me().dbTableStore.getProxy().setExtraParam('dbinfo_uid', combo.value);
                        gm.me().dbTableStore.load();
					}//endofselect
				}
            }
        )

        tableCombo.push(
            {
                id: 'table_name',
                name: 'table_name',
                xtype:          'combobox',
				triggerAction:  'all',
				editable:       false,
				width: 200,
                emptyText:  '테이블을 선택해주세요.',
				//value: ppo1_CTstatus,
				displayField:   'table_name',
				valueField:     'unique_id',
				fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				queryMode: 'remote',
				// value: '-미지정-',
				store:this.dbTableStore,
				listConfig:{
					getInnerTpl: function(){
						return '<div data-qtip="{unique_id}">{table_name}</div>';
					}			                	
				},
				listeners: {
					select: function (combo, record) {
                        var tableUid = combo.value;
                        gm.me().colSettingStore.getProxy().setExtraParam('schema_uid', tableUid);
                        gm.me().colSettingStore.load();
					}//endofselect
				}
            }
        )

        return tableCombo;
    },

    removeFieldAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: '삭제',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            gm.me().removeMappingFieldHandler();
        }
    }),

    removeMappingFieldHandler: function() {

        Ext.MessageBox.show({
            title: '확인',
            msg: '삭제하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn) {
                var grid = gm.me().gridDataInfo;
                var selections = grid.getSelectionModel().getSelection();
                var uids = [];
                for(var i=0; i<selections.length; i++) {
                    var rec = selections[i];
                    uids.push(rec.get('unique_id_long'));
                }

                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/database/if.do?method=removeDbMapping',
                        params: {
                            unique_id:uids
                        },
                        success: function(result, request) {
                            gm.me().storeDataInfo.load();
                        },
                        failure: extjsUtil.failureMessage
                    });
                }
            }
        });
    },

    addFieldAction: Ext.create('Ext.Action', {
        iconCls: 'af-plus-circle',
        text: '필드추가',
        tooltip: '필드추가',
        toggleGroup: 'toolbarcmd',
        disabled: true,
        handler: function() {
            gm.me().addMappingFieldHandler();
        }
    }),

    addMappingFieldHandler: function() {
        var grid = gm.me().gridDataInfo;
        var store = gm.me().storeDataInfo;

        var new_f = null;

        var cnt = store.getCount();

        new_f = Ext.create('Mplm.store.IFMappingStore', {
            to_table: null,
            to_columnName: null,
            to_dbName: null,
            from_table: null,
            from_columnName:null,
            from_dbName:null,
            is_fromkey:null,
        });

        gm.me().dblclickedRecord = new_f;

        try {
            store.insert(cnt, new_f);
            gm.me().selectFrom_uid = null;
            gm.me().selectTo_uid = null;
            console_logs('============== inserted record', grid.getView());
            // grid.getView().focusRow(new_f);
            gu.sleep(100);
            try {
                console_logs('==>>rowEditing', gm.me().rowEditing);
                gm.me().rowEditing.startEdit(cnt, 0);
            } catch(e1) {
                console_logs('startEdit error', e1);
            }
        } catch(e) {
            console_logs('insert error', e);
        }
    },

    dblclickedRecord : null //더블 클릭 수정레코드
    ,

    createWest: function() {
        Ext.tip.QuickTipManager.init();

        this.storeIFMenu = Ext.create('Mplm.store.IFDbInfo', {});
        this.storeIFMenu.load();

        this.gridIFMenu = Ext.create('Ext.grid.Panel', {
            store: this.storeIFMenu,
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
			width: '100%',
			dockedItems: [

			],
            columns: [{
                text: '인터페이스명',
                dataIndex: 'if_name',
				width: 120
            },{
                text: 'I/F',
                dataIndex: 'cron_name',
                width: 40
            },
            // {
            //     text: '방향',
            //     dataIndex: 'direct',
            //     width: 40
            // }
        ],
            title: '인터페이스 정보'
        });
        
        this.gridIFMenu.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length) {
                    var dbif_uid = selections[0].get('unique_id_long');
                    gm.me().storeDataInfo.getProxy().setExtraParam('dbif_uid', dbif_uid);
                    gm.me().storeDataInfo.load();
                    gm.me().addFieldAction.enable();
                    gm.me().settingColumnAction.enable();
                    gm.me().dbif_uid = dbif_uid;
                } else {
                    gm.me().storeDataInfo.getProxy().setExtraParam('dbif_uid', null);
                    gm.me().storeDataInfo.load();
                    gm.me().addFieldAction.disable();
                    gm.me().settingColumnAction.disable();
                }
            }
        });

        this.west = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
            // {
            layout: 'border',
            border: true,
            region: 'west',
            frame: true,
            // title: '인터페이스 정보',
            width: '100%',
            // collapsible: true,
            layoutConfig: {
                columns: 2,
                rows: 1,
            },

            items: [this.gridIFMenu]
        });

        return this.west;
    },

    createCenter: function() {
            var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            });
            
        this.storeDataInfo = Ext.create('Mplm.store.IFMappingStore', {});
        // this.storeDataInfo.load();

        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: true
        });

        /* RowEditing Store*/

        this.fromTableStore = Ext.create('Mplm.store.DBTableStore', {});
        this.toTableStore = Ext.create('Mplm.store.DBTableStore', {});

        this.fromColumnStore = Ext.create('Mplm.store.DBColumnStore', {});
        this.toColumnStore = Ext.create('Mplm.store.DBColumnStore', {});

        this.fromDBStore = Ext.create('Mplm.store.DBInfoStore', {});
        this.toDBStore = Ext.create('Mplm.store.DBInfoStore', {});

        this.YnStore = Ext.create('Mplm.store.CodeYnStore', {});

        this.gridDataInfo = Ext.create('Ext.grid.Panel', {
            store: this.storeDataInfo,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            plugins: [this.rowEditing],
			selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'mulit'}),
            // bbar: getPageToolbar(storeTemplate),
            frame: true,
            layout :'fit',
            forceFit: true,
            // margin: '0 10 0 0',
            width: 1100,
            autoWidth: true,
			dockedItems: [
				{
					dock : 'top',
					xtype: 'toolbar',
					items: [				 
                        this.addFieldAction, this.removeFieldAction, this.settingColumnAction
					]
				}
			],
            columns: [
                {
                text: 'POP 디비명',
                dataIndex: 'from_dbName',
                width: 40,
                editor: new Ext.form.ComboBox({
                    displayField: 'db_name',
                    editable: true,
                    forceSelection: true,
                    mode: 'local',
                    store: this.fromDBStore,
                    triggerAction: 'all',
                    valueField: 'db_name',
                    listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{db_name}</div>';
                        }, 
                    },
                    listeners: {
                        select: function(grid, data) {
                            var unique_id_long = data.get('unique_id_long');
                            gm.me().toTableStore.getProxy().setExtraParam('dbinfo_uid', unique_id_long);
                            gm.me().toTableStore.load();
                        }
                    }
                })
            },{
                text: 'POP 테이블명 ',
                dataIndex: 'from_table',
                width: 80,
                editor: new Ext.form.ComboBox({
                        displayField: 'table_name',
                        editable: true,
                        forceSelection: true,
                        mode: 'local',
                        store: this.fromTableStore,
                        triggerAction: 'all',
                        valueField: 'table_name',
                        listConfig: {
                            getInnerTpl: function() {
                                return '<div data-qtip="{unique_id}">{table_name}</div>';
                            }, 
                        },
                        listeners: {
                            select: function(grid, data) {
                                var unique_id_long = data.get('unique_id_long');
                                gm.me().toColumnStore.getProxy().setExtraParam('schema_uid', unique_id_long);
                                gm.me().toColumnStore.load();
                        }
                    }
                    })
            },{
                text: 'POP 필드명',
                dataIndex: 'from_comment',
                width: 80,
                editor: new Ext.form.ComboBox({
                    displayField: 'column_comment',
                    editable: true,
                    forceSelection: true,
                    mode: 'local',
                    store: this.fromColumnStore,
                    triggerAction: 'all',
                    valueField: 'column_comment',
                    listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{column_comment}</div>';
                        }, 
                    },
                    listeners: {
                        select: function(a,b,c) {
                            gm.me().selectTo_uid = this.selection.get('unique_id_long');
                        }
                    }
                })
            },{
                    text: 'MES 디비명',
                    dataIndex: 'to_dbName',
                    width: 40,
                    editor: new Ext.form.ComboBox({
                        displayField: 'db_name',
                        editable: true,
                        mode: 'local',
                        forceSelection: true,
                        store: this.toDBStore,
                        triggerAction: 'all',
                        valueField: 'db_name',
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function() {
                                return '<div data-qtip="{unique_id_long}">{db_name}</div>';
                            }, 
                        },
                        listeners: {
                            select: function(grid, data) {
                                console_logs('>>>>me', grid);
                                var unique_id_long = data.get('unique_id_long');
                                gm.me().fromTableStore.getProxy().setExtraParam('dbinfo_uid', unique_id_long);
                                gm.me().fromTableStore.load();
                            }
                        }
                    })
               },{
                    text: 'MES 테이블명',
                    dataIndex: 'to_table',
                    width: 80,
                    editor: new Ext.form.ComboBox({
                        displayField: 'table_name',
                        editable: true,
                        forceSelection: true,
                        mode: 'local',
                        store: this.toTableStore,
                        triggerAction: 'all',
                        valueField: 'table_name',
                        listConfig: {
                            getInnerTpl: function() {
                                return '<div data-qtip="{unique_id}">{table_name}</div>';
                            }, 
                        },
                        listeners: {
                            select: function(grid, data) {
                                var unique_id_long = data.get('unique_id_long');
                                gm.me().fromColumnStore.getProxy().setExtraParam('schema_uid', unique_id_long);
                                gm.me().fromColumnStore.load();
                            },
                            change: function(a,b) {
                                console_logs('>>23124d', a);
                                console_logs('>>D123123asd', b);
                            }
                        }
                    })
            },{
                text: 'MES 필드명',
                dataIndex: 'to_comment',
                width: 80,
                editor: new Ext.form.ComboBox({
                    displayField: 'column_comment',
                    editable: true,
                    forceSelection: true,
                    mode: 'local',
                    store: this.toColumnStore,
                    triggerAction: 'all',
                    valueField: 'column_comment',
                    listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{column_comment}</div>';
                        }, 
                    },
                    listeners: {
                        select: function() {
                            gm.me().selectFrom_uid = this.selection.get('unique_id_long');

                        },
                        beforeload: function(a,b,c) {
                            console_logs('>>ddd', a);
                            console_logs('>>ddd', b);
                            console_logs('>>ddd', c);
                        }
                    }
                })
            },{
                text: 'Key Value',
                dataIndex: 'is_fromkey',
                width: 40,
                editor: new Ext.form.ComboBox({
                    displayField: 'codeName',
                    editable: true,
                    forceSelection: true,
                    mode: 'local',
                    store: this.YnStore,
                    triggerAction: 'all',
                    valueField: 'systemCode',
                    value:'N',
                    listConfig: {
                        getInnerTpl: function() {
                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                        }, 
                    },
                })
            }],
            // title: '문서 상세정보'
        });
        
        this.gridDataInfo.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length) {
                    gm.me().removeFieldAction.enable();
                } else {
                    gm.me().removeFieldAction.disable();
                }
            }
        });

        this.gridDataInfo.on('edit', function(editor, e) {

            if(gm.me().selectTo_uid == null || gm.me().selectTo_uid == undefined) {
                     Ext.Msg.alert('경고', '필드값을 입력해주세요.', function() {});
                     return;
                 };

            // var a = gm.me().gridDataInfo.getSelectionModel().getSelection()[0];
            // console_logs('>>>a', a);

            // return;

            var rec = e.record;
            var field = e['field'];
            console_logs('===rec', rec);
            console_logs('===field', gm.me().selectTo_uid);

            var unique_id = e.record.get('unique_id_long');

            var from_uid = gm.me().selectFrom_uid;
            var to_uid = gm.me().selectTo_uid;
            var is_fromkey = e.record.get('is_fromkey');

            console_logs('>>>>>>>=unique_id', unique_id);

            var send_data = {};
            send_data['dbif_uid'] = gm.me().dbif_uid;
            if(unique_id != null && unique_id != undefined) {
                // 수정
                send_data['unique_id'] = unique_id;
                send_data['from_uid'] = from_uid;
                send_data['to_uid'] = to_uid;
                send_data['is_fromkey'] = is_fromkey;
            } else {
                // 추가
                send_data['unique_id'] = -1;
                send_data['from_uid'] = from_uid;
                send_data['to_uid'] = to_uid;
                send_data['is_fromkey'] = is_fromkey;
            }
            console_logs('>>>send', send_data);

            Ext.Ajax.request({
                url : CONTEXT_PATH + '/database/if.do?method=sendMappingData',
                params : send_data,
                success : function(result, request) {
                    gm.me().storeDataInfo.load();
                },
                failure: extjsUtil.failureMessage
            });	
        })

        var panel = Ext.create('Ext.panel.Panel', {
			id: "docuinfoTab",
		    layout:'border',
		    title: '매핑정보',
		    border: false,
		    tabPosition: 'bottom',
		    layoutConfig: {columns: 2, rows:1},
		    items: [this.gridDataInfo]
		}); 

        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'west',
            width: '100%',
            tabPosition: 'top',
            // collapsible: true,
            items: [panel]
        })

        return this.center;
    },
});
