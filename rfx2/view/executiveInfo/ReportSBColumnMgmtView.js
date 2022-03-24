Ext.define('Rfx2.view.executiveInfo.ReportSBColumnMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'report-column-mgmt-view-sb',

    initComponent: function(){

        this.storeViewTable = Ext.create('Mplm.store.DocuTplStore', {});
        this.storeViewTable.getProxy().setExtraParam('not_temp_type', 'DOC');
        this.storeViewTable.getProxy().setExtraParam('product_type', 'S/B');
        this.storeViewTable.load();

        var storeViewProperty = Ext.create('Mplm.store.ViewPropStore', {});
        storeViewProperty.getProxy().setExtraParam('prop_type', 'MES,POP');
        storeViewProperty.getProxy().setExtraParam('group_name', 'SB');
        storeViewProperty.load();

        var action/*this.searchAction*/ = Ext.create('Ext.Action', {
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            tooltip: '조건 검색',
            handler: function() {
                var items = searchToolbar.items.items;
                for(var i=0; i<items.length; i++) {
                    var item = items[i];
                    gm.me().storeViewTable.getProxy().setExtraParam(item.name, item.value);
                }
                gm.me().storeViewTable.load();
            }
        });

        var search = [
            {
                xtype: 'textfield',
                name: 'temp_name',
                emptyText: '템플릿명',
                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                width: 130,
                listeners: {
                    specialkey: function(f,e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            gm.me().storeViewTable.getProxy().setExtraParam(f.name, f.value);
                            gm.me().storeViewTable.load();
                        }
                    }
                },
                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                'onTrigger1Click': function() {
                    Ext.getCmp(this.id).setValue('');
                    gm.me().storeViewTable.getProxy().setExtraParam('temp_name', null);
                    gm.me().storeViewTable.load();
                }
            },
            // {
            //     xtype: 'combo',
            //     // name: 'temp_type',
            //     emptyText: '제품',
            //     fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            //     width: 80,
            //     store: this.TempTypeStore,
            //     // id:'temp_type',
            //     name: 'temp_type',
            //     anchor: '80%',
            //     valueField: 'systemCode',
            //     displayField: 'codeName',
            //     //emptyText: '선택해주세요.',
            //     listConfig: {
            //         loadingText: '검색중...',
            //         emptyText: '일치하는 항목 없음',
            //         getInnerTpl: function() {
            //             return '<div data-qtip="{}">{codeName}</div>';
            //         }
            //     }
            //     // listeners: {
            //     //     specialkey: function(f,e) {
            //     //         if (e.getKey() == Ext.EventObject.ENTER) {
            //     //             gm.me().storeViewTable.getProxy().setExtraParam(f.name, f.value);
            //     //             gm.me().storeViewTable.load();
            //     //         }
            //     //     }
            //     // },
            //     // trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            //     // 'onTrigger1Click': function() {
            //     //     Ext.getCmp(this.id).setValue('');
            //     //     gm.me().storeViewTable.getProxy().setExtraParam('temp_type', null);
            //     //     gm.me().storeViewTable.load();
            //     // }
            // }
            // ,{
            //     xtype: 'combo',
            //     // name: 'product_type',
            //     emptyText: '구분',
            //     fieldStyle: 'background-color: #D6E8F6; background-image: none;',
            //     width: 80,
            //     store: this.ProductTypeStore,
            //     // id:'product_type',
            //     name: 'product_type',
            //     anchor: '80%',
            //     valueField: 'systemCode',
            //     displayField: 'codeName',
            //     //emptyText: '선택해주세요.',
            //     listConfig: {
            //         loadingText: '검색중...',
            //         emptyText: '일치하는 항목 없음',
            //         getInnerTpl: function() {
            //             return '<div data-qtip="{}">{codeName}</div>';
            //         }
            //     }
                // listeners: {
                //     specialkey: function(f,e) {
                //         if (e.getKey() == Ext.EventObject.ENTER) {
                //             gm.me().storeViewTable.getProxy().setExtraParam(f.name, f.value);
                //             gm.me().storeViewTable.load();
                //         }
                //     }
                // },
                // trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                // 'onTrigger1Click': function() {
                //     Ext.getCmp(this.id).setValue('');
                //     gm.me().storeViewTable.getProxy().setExtraParam('product_type', null);
                //     gm.me().storeViewTable.load();
                // }
            // }
        ]

        var searchToolbar = Ext.create('widget.toolbar', {
            items:search,
            layout:'column',
            cls: 'my-x-toolbar-default1'
        });

        console_logs('>searchToolbar', searchToolbar);

        var buttonToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: action
        });
        // searchToolbar.push(search);

        var addAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '신규등록',
            tooltip: '신규등록',
            toggleGroup: 'toolbarcmd',
            hidden: gMain.menu_check == true ? false : true,
            disabled: false,
            handler: function() {
                gm.me().addDocuTpl();
            }
        });

        var editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정하기',
            toggleGroup: 'toolbarcmd',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function() {
                gm.me().editDocuTpl(gridViewTable);
            }
        });

        var removeAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '삭제하기',
            toggleGroup: 'toolbarcmd',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function() {
                gm.me().removeDocuTpl(gridViewTable);
            }
        });

        var copyAddAction = Ext.create('Ext.Action', {
            iconCls: 'af-copy',
            text: '복사등록',
            tooltip: '복사등록',
            toggleGroup: 'toolbarcmd',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function() {
                gm.me().copyAddDocuTpl(gridViewTable);
            }
        });
  
        var gridViewTable = Ext.create('Ext.grid.Panel', {
            title: '품목',
            store: this.storeViewTable,
            cls : 'rfx-panel',
            region:'west',
            collapsible: true,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            bbar: getPageToolbar(this.storeViewTable),
            frame: true,
            layout          :'fit',
            forceFit: true,
            margin: '5 5 0 0',
            width: 360,
            dockedItems: [
                buttonToolbar,
                searchToolbar,
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        addAction,
                        editAction,
                        removeAction,
                        copyAddAction
                    ]
                }
            ],
            columns: [{
                text: '템플릿명',
                flex: 1,
                dataIndex: 'temp_name'
            }, {
                text: '제품그룹',
                width: 80,
                dataIndex: 'temp_type'
            }, {
                text: '구분',
                width: 80,
                dataIndex: 'product_type'
            }]
        });

        gridViewTable.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                var rec = (selections!=null && selections.length>0) ? selections[0] : null;
                console_logs('gridViewTable selected rec', rec);
                var panel = Ext.getCmp('widgetTab2');
                if(rec!=null) {
                    saveAction.enable();
                    removeAction.enable();
                    editAction.enable();
                    copyAddAction.enable();
                    saveSampleAction.enable();
                    var product_type = rec.get('product_type');
                    var temp_name = rec.get('temp_name');
                    var unique_id = rec.get('unique_id_long');
                    panel.setTitle(temp_name);

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/document/manage.do?method=getViewPropUidFromEntity',
                        params: {
                            docuTpl_uid: unique_id
                        },
                        success: function(result, request) {
                            var result = result.responseText;
                            var data = Ext.util.JSON.decode(result);
                            var datas = data.datas;
                            var uids = [];
                            for(var i=0; i<datas.length; i++) {
                                uids.push(datas[i]);
                            }
                            var items = [];
                            storeViewProperty.data.each(function(rec) {
                                var view_uid = rec.id
                                for(var i=0; i<uids.length; i++) {
                                    var check_uid = uids[i];
                                    if(view_uid == check_uid) {
                                        var item = gridViewProperty.getStore().getById(check_uid);
                                        items.push(item);
                                    }
                                }
                            })
                            var view = gridViewProperty.getView();

                            if(items.length > 0) {
                                view.select(items);
                            } else {
                                view.getSelectionModel().deselectAll();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });

                } else {
                    saveAction.disable();
                    removeAction.disable();
                    editAction.disable();
                    copyAddAction.disable();
                    saveSampleAction.disable();
                    panel.setTitle('성적서 정보');
                }
            }
        });

        var targetListnenrs = {
            'render':function(panel){
                console_logs('panel.body', panel.body);
                // panel.el.on('click', function() {
                //     console_logs('panel.body', panel.body);
                //     panel.body.setStyle('borderColor','red');
                // });
            var body = panel.body;
            new Ext.dd.DropTarget(body, {
                ddGroup: 'grid-to-form',
    
                notifyEnter: function (ddSource, e, data) {
                    //Add some flare to invite drop.
                    body.stopAnimation();
                    body.highlight();
                },
    
                notifyDrop: function (ddSource, e, data) {
                    var records = ddSource.dragData.records;
                    for(var i=0; i<records.length; i++) {
                        var selectedRecord = ddSource.dragData.records[i];
    
                        panel.store.add({
                            field_name: selectedRecord.get('field_name'),
                            field_type: selectedRecord.get('field_type')
                        });
                        // Delete record from the source store.  not really required.
                        ddSource.view.store.remove(selectedRecord);
                    }
                    return true;
                }
            });
    
            
        }};

        var saveAction = Ext.create('Ext.Action', {
            iconCls: 'af-save',
            text: '저장',
            tooltip: '저장',
            toggleGroup: 'toolbarcmd',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function() {
                gm.me().saveDocEntity(gridViewProperty, gridViewTable);
            }
        });

        var saveSampleAction = Ext.create('Ext.Action', {
            iconCls: 'af-save',
            text: '샘플 저장',
            tooltip: '저장',
            toggleGroup: 'toolbarcmd',
            disabled: true,
            handler: function() {
                gm.me().saveSample(gridViewTable, FormSampleInfo3, FormSampleInfo6,FormSampleInfo7);
            }
        });


        var selModel = Ext.create("Ext.selection.CheckboxModel", {
            mode: 'multi',
            checkOnly:  true,
            allowDeselect: true
        });

        var gridViewProperty = Ext.create('Ext.grid.Panel', {
            id: gu.id('gridViewPropertySB'),
            enableDragDrop: true,
            store: storeViewProperty,
            selModel: selModel,
            region: 'center',
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: true,
            autoScroll : true,
            autoHeight: true,
            frame: true,
            layout: 'fit',
            forceFit: true,
            margin: '5 10 0 0',
            width: 500,
            dockedItems: [
                {
                    dock : 'top',
					xtype: 'toolbar',
					items: [				 
                        saveAction
					]
                }
            ],
            columns: [{
                text: '속성코드',
                dataIndex: 'prop_key'
            },{
                text: '최대값',
                dataIndex: 'max_cnt'
            },{
                text: '제목',
                dataIndex: 'title'
            },{
                text: '설명',
                dataIndex: 'description'
            },{
                text: '그룹명',
                dataIndex: 'group_name'
            },{
                text: '속성유형',
                dataIndex: 'prop_type'
            },{
                text: 'I/F 위치',
                dataIndex: 'buffer_pos'
            }],
            title: '성적서 속성 필드',
            viewConfig: {
                plugins: {
                    gridviewdragdrop: {
                        ddGroup: 'grid-to-form',
                        enableDrop: false
                    }
                }
            },
            listeners:{
                'render':function(panel){

                var body = panel.body;
                new Ext.dd.DropTarget(body, {
                    ddGroup: 'form-to-grid',
        
                    notifyEnter: function (ddSource, e, data) {
                        //Add some flare to invite drop.
                        body.stopAnimation();
                        body.highlight();
                    },
        
                    notifyDrop: function (ddSource, e, data) {
                        // Reference the record (single selection) for readability
                        var selectedRecord = ddSource.dragData.records[0];
        
                        // Load the record into the form
                        console_logs('selectedRecord', selectedRecord);
                        console_logs('e', e);
                        console_logs('data', data);

                        panel.store.add(
                            {
                                field_name: selectedRecord.get('field_name'),
                                field_type: selectedRecord.get('field_type')
                            });

                        //panel.store.add(selectedRecord);
                        //panel.store.load();
        
                        // Delete record from the source store.  not really required.
                        ddSource.view.store.remove(selectedRecord);
                        return true;
                    }
                });
                
            }}

        });

        gridViewProperty.getSelectionModel().on({
            selectionchange: function(sm, selections) {
				if(selections.length) {
                    // console_logs('==>asdasd', selModel.navigationModel.lastFocused.record);
				} else {
					
				}
			}
        });

        var SBselModel = Ext.create("Ext.selection.CheckboxModel", {
            mode: 'multi',
            checkOnly:  true,
            allowDeselect: true
        });

        var storeSbSpecProperty = Ext.create('Mplm.store.SbInfoStore', {});
        storeSbSpecProperty.load();

        var sbSpecGrid = Ext.create('Ext.grid.Panel', {
            id: gu.id('sbSpecGrid'),
            enableDragDrop: true,
            store: storeSbSpecProperty,
            selModel: SBselModel,
            region: 'center',
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: true,
            autoScroll : true,
            autoHeight: true,
            bbar: getPageToolbar(storeSbSpecProperty),
            frame: true,
            layout: 'fit',
            forceFit: true,
            margin: '5 10 0 0',
            width: 500,
            columns: [{
                text: '팀구분',
                dataIndex: 'gubun'
            },{
                text: 'ERP코드',
                dataIndex: 'erp_code'
            },{
                text: '고객사',
                dataIndex: 'customer'
            },{
                text: '조성',
                dataIndex: 'formation'
            },{
                text: 'Full 조성',
                dataIndex: 'full_formation'
            },{
                text: '품목번호',
                dataIndex: 'item_code'
            },{
                text: '제조 Lot',
                dataIndex: 'lot_no'
            },{
                text: 'SID#',
                dataIndex: 'sid'
            },{
                text: 'Description',
                dataIndex: 'description'
            }],
            title: 'SPEC 목록',
            viewConfig: {
                plugins: {
                    gridviewdragdrop: {
                        ddGroup: 'grid-to-form',
                        enableDrop: false
                    }
                }
            }
        });

        this.widgetSampleSB = Ext.widget('tabpanel', {
            layout:'border',
            border: false,
			region: 'center',
            title: 'S/B SPEC',
            id:'widgetSampleTabSB',
            width:'100%',
            // height:'100%',
            tabPosition: 'top',
            // flex: 8,
            items: [
                sbSpecGrid
            ],

        })

        this.widget = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            title: '성적서 정보',
            id:'widgetTab2',
            width:'100%',
            // flex: 8,
            items: [
                gridViewProperty,
                this.widgetSampleSB
            ],

        });

        var targetListnenrsFrom = {
            'render':function(panel){
                console_logs('panel.body', panel.body);
                // panel.el.on('click', function() {
                //     console_logs('panel.body', panel.body);
                //     panel.body.setStyle('borderColor','red');
                // });
            var body = panel.body;
            new Ext.dd.DropTarget(body, {
                ddGroup: 'grid-to-form',
    
                notifyEnter: function (ddSource, e, data) {
                    //Add some flare to invite drop.
                    body.stopAnimation();
                    body.highlight();
                },
    
                notifyDrop: function (ddSource, e, data) {

                    console_logs('notifyDrop e', e);
                    console_logs('notifyDrop data', data);
                    console_logs('notifyDrop e.target', e.target);
                    console_logs('notifyDrop e.target.id', e.target.id);

                    var targetId = e.target.id;
                    var tail = '-inputEl';
                    if(targetId.length>tail.length) {
                        var myId = targetId.substring(0, targetId.length - tail.length);
                        console_logs('notifyDrop myId', myId);
                        var o = Ext.getCmp(myId);
                        console_logs('notifyDrop o', o);
                        if(o!=null) {
                            var name = o.name;
                            console_logs('notifyDrop name', name);

                            if(name!=null) {
                                var target = gu.getCmp(name);
                                if(target!=null) {
                                    var records = ddSource.dragData.records;
                                    var selectedRecord = ddSource.dragData.records[0];
            
                                    console_logs('selectedRecord', selectedRecord);
                                    if(selectedRecord!=null) {
                                        // panel.store.add({
                                        //     field_name: selectedRecord.get('field_name'),
                                        //     field_type: selectedRecord.get('field_type')
                                        // });
                                        // Delete record from the source store.  not really required.
                                        selectedRecord.set('mapping_field', name);
                                        target.setValue(selectedRecord.get('field_type'));
                                        return true;
                                    }
                
                                }
                            }

                        }
                    }
                    return false;
                    

                }
            });
        }
    };

        Ext.apply(this, {
            // layout: {
            //     type: 'hbox',
            //     pack: 'start',
            //     align: 'stretch'
            // },
            layout: 'border',
            bodyBorder: false,

            defaults: {
                collapsible: false,
                split: true,
                //bodyPadding: 10
            },
            items:[
                gridViewTable,
                {
                collapsible: false,
                autoScroll: true,
                region: 'center',
                // frame: true,
                width:'100%',
                items: this.widget

                }
            ]
        });


        this.callParent(arguments);

    },

    //bodyPadding: 10,

    defaults: {
        frame: true//,
        //bodyPadding: 10
    },

    autoScroll: true,
    fieldDefaults: {
        labelWidth: 300 //Only Support this
        //labelWidth: "100"     //Doesn't render with 100 Pixel Size
        //labelWidth: "100px"	//Suffix with px won't work
        //, height:20
    },
    items: null,

    saveSample:function(gridViewTable, form3, form6, form7) {
        var view_selection = gridViewTable.getSelectionModel().getSelection();
        var docuTpl_uid = view_selection[0].get('unique_id_long');

        var forms = [form3, form6, form7];
        var vals = [];

        for(var i=0; i<forms.length; i++) {
            var form = forms[i];
            for(var j=0; j<form.items.length; j++) {
                var item = form.items.items[j];
                // console_logs('>>items', item.items.items);
                for(var k=0; k<item.items.items.length; k++) {
                    var data = item.items.items[k];
                    if(data.xtype != 'tbtext' && data.value != null) {
                        vals.splice(0,0,data.name + ':' + data.value);
                    }
                }
            }
        }
        console_logs('>>>>vals', vals);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/document/manage.do?method=saveSample',
            params: {
                value : vals,
                docutpl_uid: docuTpl_uid
            },
            success: function (result, request) {
                gm.me().showToast('결과', '수정완료');
                // storeSampleProperty.load();
            },
            failure: extjsUtil.failureMessage
        });
    },

    saveDocEntity:function(gridViewProperty, gridViewTable) {
        var selections = gridViewProperty.getSelectionModel().getSelection();
        var view_selection = gridViewTable.getSelectionModel().getSelection();
        var uids = [];
        var docuTpl_uid = view_selection[0].get('unique_id_long');

        for(var i=0; i<selections.length; i++) {
            var rec = selections[i];
            console_logs('>>>44444', rec);
            uids.push(rec.get('unique_id_long'));
        }

        if(selections.length < 1) {
            uids.push(-1);
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/document/manage.do?method=checkEntity',
            params: {
                docuTpl_uid: docuTpl_uid,
                unique_ids : uids
            },
            success: function (result, request) {
                gridViewProperty.getStore().load();
            },
            failure: extjsUtil.failureMessage
        });

    },

    addDocuTpl: function() {
        var form = Ext.create('Ext.form.Panel', {
	    	id: gu.id('TplformPanel'),
	    	xtype: 'form',
    		frame: false ,
    		border: false,
    		bodyPadding: '10',
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
                    name : 'class_code',
                    value: 'Q1REPORT'
                }),
                new Ext.form.Hidden({
                    name : 'cube_uid',
                    value: 100
                }),
                new Ext.form.Hidden({
                    name : 'docu_auth',
                    value: '*'
                }),
                new Ext.form.Hidden({
                    name : 'docu_type',
                    value: 'multi'
                }),
                new Ext.form.Hidden({
                    name : 'product_type',
                    value: 'S/B'
                }),
                new Ext.form.Hidden({
                    name : 'temp_type',
                    value: 'SB'
                }),
                {
                    fieldLabel: 'ITEM 명',
                    xtype: 'textfield',
                    anchor: '95%',
                    id: 'temp_name',
                    name: 'temp_name',
                    allowBlank:false,
                },
                // {
                //     fieldLabel: '제품그룹',
                //     xtype:'combo',
                //     store: gm.me().TempTypeStore,
                //     id:'temp_type',
                //     name: 'temp_type',
                //     anchor: '80%',
                //     valueField: 'systemCode',
                //     displayField: 'codeName',
                //     emptyText: '선택해주세요.',
                //     listConfig: {
                //         loadingText: '검색중...',
                //         emptyText: '일치하는 항목 없음',
                //         getInnerTpl: function() {
                //             return '<div data-qtip="{}">{codeName}</div>';
                //         }
                //     }
                // }
                // , {
                //     fieldLabel: '구분',
                //     xtype:'combo',
                //     store: gm.me().ProductTypeStore,
                //     id:'product_type',
                //     name: 'product_type',
                //     anchor: '80%',
                //     valueField: 'systemCode',
                //     displayField: 'codeName',
                //     emptyText: '선택해주세요.',
                //     listConfig: {
                //         loadingText: '검색중...',
                //         emptyText: '일치하는 항목 없음',
                //         getInnerTpl: function() {
                //             return '<div data-qtip="{}">{codeName}</div>';
                //         }
                //     }
                // }
            ]
        });

        myHeight = 120;
        myWidth = 450;

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
                                    gm.me().storeViewTable.load();
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

    editDocuTpl: function(grid) {
        var selection = grid.getSelectionModel().getSelection()[0];
        console_logs('>>>>>>zzz', selection);
        
        var form = Ext.create('Ext.form.Panel', {
	    	id: gu.id('TplformPanel'),
	    	xtype: 'form',
    		frame: false ,
    		border: false,
    		bodyPadding: '10',
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
                    value:selection.get('unique_id_long')
                }),
                new Ext.form.Hidden({
                    name : 'class_code',
                    value: 'Q1REPORT'
                }),
                new Ext.form.Hidden({
                    name : 'cube_uid',
                    value: 100
                }),
                new Ext.form.Hidden({
                    name : 'docu_auth',
                    value: '*'
                }),
                new Ext.form.Hidden({
                    name : 'docu_type',
                    value: 'multi'
                }),
                new Ext.form.Hidden({
                    name : 'product_type',
                    value: 'S/B'
                }),
                {
                    fieldLabel: 'ITEM 명',
                    xtype: 'textfield',
                    anchor: '95%',
                    id: 'temp_name',
                    name: 'temp_name',
                    allowBlank:false,
                    value:selection.get('temp_name')
                },
                // {
                //     fieldLabel: '제품그룹',
                //     xtype:'combo',
                //     store: gm.me().TempTypeStore,
                //     id:'temp_type',
                //     name: 'temp_type',
                //     anchor: '80%',
                //     valueField: 'systemCode',
                //     displayField: 'codeName',
                //     emptyText: '선택해주세요.',
                //     listConfig: {
                //         loadingText: '검색중...',
                //         emptyText: '일치하는 항목 없음',
                //         getInnerTpl: function() {
                //             return '<div data-qtip="{}">{codeName}</div>';
                //         }
                //     },
                //     value:selection.get('temp_type')
                // }
                // , {
                //     fieldLabel: '구분',
                //     xtype:'combo',
                //     store: gm.me().ProductTypeStore,
                //     id:'product_type',
                //     name: 'product_type',
                //     anchor: '80%',
                //     valueField: 'systemCode',
                //     displayField: 'codeName',
                //     emptyText: '선택해주세요.',
                //     listConfig: {
                //         loadingText: '검색중...',
                //         emptyText: '일치하는 항목 없음',
                //         getInnerTpl: function() {
                //             return '<div data-qtip="{}">{codeName}</div>';
                //         }
                //     },
                //     value:selection.get('product_type')
                // }
            ]
        });

        myHeight = 120;
        myWidth = 450;

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
                                    gm.me().storeViewTable.load();
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

    removeDocuTpl: function(grid) {
        var selections = grid.getSelectionModel().getSelection();
        var unique_id = selections[0].get('unique_id_long')
        Ext.MessageBox.show({
                title:'확인',
                msg: '삭제 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn:  function(result) {
                    if(result=='yes') {
                        Ext.Ajax.request({
                        url: CONTEXT_PATH + '/document/manage.do?method=removeDocuTpl',
                        params: {
                            unique_id:unique_id
                        },
                        success: function(result, request) {
                            gm.me().storeViewTable.load();
                            // gm.me().storeViewProperty.load();

                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    }); // endofajax
                    }
                }
        });
    },

    copyAddDocuTpl: function(gridViewTable) {
        var selection = gridViewTable.getSelectionModel().getSelection()[0];

        var form = Ext.create('Ext.form.Panel', {
	    	id: gu.id('TplformPanel'),
	    	xtype: 'form',
    		frame: false ,
    		border: false,
    		bodyPadding: '10',
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
                    name : 'docutpl_uid',
                    value: selection.get('unique_id_long')
                }),
                new Ext.form.Hidden({
                    name : 'class_code',
                    value: 'Q1REPORT'
                }),
                new Ext.form.Hidden({
                    name : 'cube_uid',
                    value: 100
                }),
                new Ext.form.Hidden({
                    name : 'docu_auth',
                    value: '*'
                }),
                new Ext.form.Hidden({
                    name : 'docu_type',
                    value: 'multi'
                }),
                new Ext.form.Hidden({
                    name : 'product_type',
                    value: 'S/B'
                }),
                new Ext.form.Hidden({
                    name : 'product_type',
                    value: 'S/B'
                }),
                {
                    fieldLabel: 'ITEM 명',
                    xtype: 'textfield',
                    anchor: '95%',
                    id: 'temp_name',
                    name: 'temp_name',
                    allowBlank:false
                }

                // , {
                //     fieldLabel: '구분',
                //     xtype:'combo',
                //     store: gm.me().ProductTypeStore,
                //     id:'product_type',
                //     name: 'product_type',
                //     anchor: '80%',
                //     valueField: 'systemCode',
                //     displayField: 'codeName',
                //     emptyText: '선택해주세요.',
                //     listConfig: {
                //         loadingText: '검색중...',
                //         emptyText: '일치하는 항목 없음',
                //         getInnerTpl: function() {
                //             return '<div data-qtip="{}">{codeName}</div>';
                //         }
                //     },
                //     value:selection.get('product_type')
                // }
            ]
        });

        myHeight = 120;
        myWidth = 450;

        var prWin =	Ext.create('Ext.Window', {
			modal : true,
			title: '복사등록',
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
                                url: CONTEXT_PATH + '/document/manage.do?method=copyAddDocuTpl',
                                params: val,
                                success: function (result, request) {
                                    gm.me().storeViewTable.load();
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


    TempTypeStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'TEMP_TYPE'} ),

    ProductTypeStore : Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PRODUCT_TYPE'} ),
});
