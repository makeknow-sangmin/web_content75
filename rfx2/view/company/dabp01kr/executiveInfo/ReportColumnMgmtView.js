Ext.define('Rfx.view.executiveInfo.ReportColumnMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'report-column-mgmt-view',

    initComponent: function(){

        this.storeViewTable = Ext.create('Mplm.store.DocuTplStore', {});
        this.storeViewTable.getProxy().setExtraParam('not_temp_type', 'DOC');
        this.storeViewTable.getProxy().setExtraParam('product_type', 'B/W');
        this.storeViewTable.load();

        var storeViewProperty = Ext.create('Mplm.store.ViewPropStore', {});
        storeViewProperty.getProxy().setExtraParam('prop_type', 'MES,POP');
        storeViewProperty.getProxy().setExtraParam('group_name', 'BW');
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
                emptyText: 'Item',
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
            },{
                xtype: 'combo',
                // name: 'temp_type',
                emptyText: '제품',
                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                width: 80,
                store: this.TempTypeStore,
                // id:'temp_type',
                name: 'temp_type',
                anchor: '80%',
                valueField: 'systemCode',
                displayField: 'codeName',
                //emptyText: '선택해주세요.',
                listConfig: {
                    loadingText: '검색중...',
                    emptyText: '일치하는 항목 없음',
                    getInnerTpl: function() {
                        return '<div data-qtip="{}">{codeName}</div>';
                    }
                }
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
                //     gm.me().storeViewTable.getProxy().setExtraParam('temp_type', null);
                //     gm.me().storeViewTable.load();
                // }
            }
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
            //     //     gm.me().storeViewTable.getProxy().setExtraParam('product_type', null);
            //     //     gm.me().storeViewTable.load();
            //     // }
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
            disabled: true,
            handler: function() {
                gm.me().copyAddDocuTpl(gridViewTable);
            }
        });
  
        var gridViewTable = Ext.create('Ext.grid.Panel', {
            //title: '품목',
            store: this.storeViewTable,
            cls : 'rfx-panel',
            region:'west',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            bbar: getPageToolbar(this.storeViewTable),
            frame: false,
            layout          :'fit',
            forceFit: true,
            margin: '5 5 0 0',
            width: 500,
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
                text: 'Item',
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
                var panel = Ext.getCmp('widgetTab');
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

                    storeSampleProperty.getProxy().setExtraParam('docutpl_uid', unique_id);
                    storeSampleProperty.load(function() {
                        if(storeSampleProperty.getAt(0) != null) {
                            // Ext.getCmp('sampleForm').loadRecord(storeSampleProperty.getAt(0));
                            // Ext.getCmp('sampleForm2').loadRecord(storeSampleProperty.getAt(0));
                            Ext.getCmp('sampleForm3').loadRecord(storeSampleProperty.getAt(0));
                            // Ext.getCmp('sampleForm4').loadRecord(storeSampleProperty.getAt(0));
                            // Ext.getCmp('sampleForm5').loadRecord(storeSampleProperty.getAt(0));
                            Ext.getCmp('sampleForm6').loadRecord(storeSampleProperty.getAt(0));
                            Ext.getCmp('sampleForm7').loadRecord(storeSampleProperty.getAt(0));
                            Ext.getCmp('sampleForm8').loadRecord(storeSampleProperty.getAt(0));
                        } else {
                            // Ext.getCmp('sampleForm').getForm().reset(true);
                            // Ext.getCmp('sampleForm2').getForm().reset(true);
                            Ext.getCmp('sampleForm3').getForm().reset(true);
                            // Ext.getCmp('sampleForm4').getForm().reset(true);
                            // Ext.getCmp('sampleForm5').getForm().reset(true);
                            Ext.getCmp('sampleForm6').getForm().reset(true);
                            Ext.getCmp('sampleForm7').getForm().reset(true);
                            Ext.getCmp('sampleForm8').getForm().reset(true);
                        }
                    });
                } else {
                    saveAction.disable();
                    removeAction.disable();
                    editAction.disable();
                    copyAddAction.disable();
                    saveSampleAction.disable();
                    panel.setTitle('성적서 정보');
                    storeSampleProperty.getProxy().setExtraParam('docutpl_uid', null);
                    storeSampleProperty.load();
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
            disabled: true,
            handler: function() {
                gm.me().saveDocEntity(gridViewProperty, gridViewTable);
            }
        });

        var saveSampleAction = Ext.create('Ext.Action', {
            iconCls: 'af-save',
            text: '기준 저장',
            tooltip: '저장',
            toggleGroup: 'toolbarcmd',
            disabled: true,
            handler: function() {
                gm.me().saveSample(gridViewTable, FormSampleInfo3, FormSampleInfo6,FormSampleInfo7,FormSampleInfo8);
            }
        });


        var selModel = Ext.create("Ext.selection.CheckboxModel", {
            mode: 'multi',
            checkOnly:  true,
            allowDeselect: true

        });

        var gridViewProperty = Ext.create('Ext.grid.Panel', {
            id: gu.id('gridViewProperty'),
            enableDragDrop: true,
            store: storeViewProperty,
            selModel: selModel,
            region: 'center',
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: true,
            autoScroll : true,
            autoHeight: true,
            frame: false,
            layout: 'fit',
            forceFit: true,
            //margin: '5 10 0 0',
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
                dataIndex: 'prop_key',
                hidden: true
            },{
                text: '속성 이름',
                dataIndex: 'title'
            },{
                text: '최대 개수',
                dataIndex: 'max_cnt'
            },{
                text: '그룹',
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
        })

        var sampleSelModel = Ext.create("Ext.selection.CheckboxModel", {
            mode: 'multi',
            checkOnly:  false,
            allowDeselect: true

        });

        var sampleColumn = [
            {
                text: 'B/L 1',
                dataIndex: 'bl01'
            },{
                text: 'B/L 2',
                dataIndex: 'bl02'
            },{
                text: 'B/L 3',
                dataIndex: 'bl03'
            },{
                text: 'B/L 4',
                dataIndex: 'bl04'
            },{
                text: 'B/L 5',
                dataIndex: 'bl05'
            },{
                text: 'B/L 6',
                dataIndex: 'bl06'
            },{
                text: 'B/L 7',
                dataIndex: 'bl07'
            },{
                text: 'B/L 8',
                dataIndex: 'bl08'
            },{
                text: 'B/L 9',
                dataIndex: 'bl09'
            },{
                text: 'B/L 10',
                dataIndex: 'bl10'
            },{
                text: 'Diameter 1',
                dataIndex: 'dia01'
            },{
                text: 'Diameter 2',
                dataIndex: 'dia02'
            },{
                text: 'Diameter 3',
                dataIndex: 'dia03'
            },{
                text: 'Diameter 4',
                dataIndex: 'dia04'
            },{
                text: 'Diameter 5',
                dataIndex: 'dia05'
            },{
                text: 'Diameter 6',
                dataIndex: 'dia06'
            },{
                text: 'Diameter 7',
                dataIndex: 'dia07'
            },{
                text: 'Diameter 8',
                dataIndex: 'dia08'
            },{
                text: 'Diameter 9',
                dataIndex: 'dia09'
            },{
                text: 'Diameter 10',
                dataIndex: 'dia10'
            },{
                text: 'B/L Max',
                dataIndex: 'bl_max'
            },{
                text: 'B/L Min',
                dataIndex: 'bl_min'
            },{
                text: 'E/L Max',
                dataIndex: 'el_max'
            },{
                text: 'E/L Min',
                dataIndex: 'el_min'
            },{
                text: 'B/L 250 Max',
                dataIndex: 'bl250_max'
            },{
                text: 'B/L 250 Min',
                dataIndex: 'bl250_min'
            },{
                text: 'E/L 250 Max',
                dataIndex: 'el250_max'
            },{
                text: 'E/L 250 Min',
                dataIndex: 'el250_min'
            },{
                text: 'Au함량 Min',
                dataIndex: 'au_min'
            },{
                text: 'Au함량 Max',
                dataIndex: 'au_max'
            },{
                text: 'B/L 1구간 Min',
                dataIndex: 'bl01_min'
            },{
                text: 'B/L 1구간 Max',
                dataIndex: 'bl01_max'
            },{
                text: 'B/L 2구간 Min',
                dataIndex: 'bl02_min'
            },{
                text: 'B/L 2구간 Max',
                dataIndex: 'bl02_max'
            },{
                text: 'B/L 3구간 Min',
                dataIndex: 'bl03_min'
            },{
                text: 'B/L 3구간 Max',
                dataIndex: 'bl03_max'
            },{
                text: 'B/L 4구간 Min',
                dataIndex: 'bl04_min'
            },{
                text: 'B/L 4구간 Max',
                dataIndex: 'bl04_max'
            },{
                text: 'B/L 5구간 Min',
                dataIndex: 'bl05_min'
            },{
                text: 'B/L 5구간 Max',
                dataIndex: 'bl04_max'
            },{
                text: 'B/L 6구간 Min',
                dataIndex: 'bl06_min'
            },{
                text: 'B/L 6구간 Max',
                dataIndex: 'bl06_max'
            },{
                text: 'B/L 7구간 Min',
                dataIndex: 'bl07_min'
            },{
                text: 'B/L 7구간 Max',
                dataIndex: 'bl07_max'
            },{
                text: 'B/L 8구간 Min',
                dataIndex: 'bl08_min'
            },{
                text: 'B/L 8구간 Max',
                dataIndex: 'bl08_max'
            },{
                text: 'B/L 9구간 Min',
                dataIndex: 'bl09_min'
            },{
                text: 'B/L 9구간 Max',
                dataIndex: 'bl09_max'
            },{
                text: 'B/L 10구간 Min',
                dataIndex: 'bl10_min'
            },{
                text: 'B/L 10구간 Max',
                dataIndex: 'bl10_max'
            },{
                text: 'Diameter 1구간 Min',
                dataIndex: 'dia01_min'
            },{
                text: 'Diameter 1구간 Max',
                dataIndex: 'dia01_max'
            },{
                text: 'Diameter 2구간 Min',
                dataIndex: 'dia02_min'
            },{
                text: 'Diameter 2구간 Max',
                dataIndex: 'dia02_max'
            },{
                text: 'Diameter 3구간 Min',
                dataIndex: 'dia03_min'
            },{
                text: 'Diameter 3구간 Max',
                dataIndex: 'dia03_max'
            },{
                text: 'Diameter 4구간 Min',
                dataIndex: 'dia04_min'
            },{
                text: 'Diameter 4구간 Max',
                dataIndex: 'dia04_max'
            },{
                text: 'Diameter 5구간 Min',
                dataIndex: 'dia05_min'
            },{
                text: 'Diameter 5구간 Max',
                dataIndex: 'dia05_max'
            },{
                text: 'Diameter 6구간 Min',
                dataIndex: 'dia06_min'
            },{
                text: 'Diameter 6구간 Max',
                dataIndex: 'dia06_max'
            },{
                text: 'Diameter 7구간 Min',
                dataIndex: 'dia07_min'
            },{
                text: 'Diameter 7구간 Max',
                dataIndex: 'dia07_max'
            },{
                text: 'Diameter 8구간 Min',
                dataIndex: 'dia08_min'
            },{
                text: 'Diameter 8구간 Max',
                dataIndex: 'dia08_max'
            },{
                text: 'Diameter 9구간 Min',
                dataIndex: 'dia09_min'
            },{
                text: 'Diameter 9구간 Max',
                dataIndex: 'dia09_max'
            },{
                text: 'Diameter 10구간 Min',
                dataIndex: 'dia10_min'
            },{
                text: 'Diameter 10구간 Max',
                dataIndex: 'dia10_max'
            },
        ];

        var storeSampleProperty = Ext.create('Mplm.store.SamplePropStore', {});
        storeSampleProperty.load();

        var FormSampleInfo = Ext.create('Ext.form.Panel', {
                // renderTo: document.body,
                id: 'sampleForm',
                title: 'B/L 구간',
                // frame: true,
                width: '100%',
                bodyPadding: 10,
                defaultType: 'textfield',
                store: storeSampleProperty,
                layout:'column',
                items: [
                    {
                        fieldLabel: 'B/L 1',
                        width:300,
                        name: 'bl01',
                        dataIndex:'bl01'
                    },{
                        fieldLabel: 'B/L 2',
                        width:300,
                        name: 'bl02'
                    },{
                        fieldLabel: 'B/L 3',
                        width:300,
                        name: 'bl03'
                    },{
                        fieldLabel: 'B/L 4',
                        width:300,
                        name: 'bl04'
                    },{
                        fieldLabel: 'B/L 5',
                        width:300,
                        name: 'bl05'
                    },{
                        fieldLabel: 'B/L 6',
                        width:300,
                        name: 'bl06'
                    },{
                        fieldLabel: 'B/L 7',
                        width:300,
                        name: 'bl07'
                    },{
                        fieldLabel: 'B/L 8',
                        width:300,
                        name: 'bl08'
                    },{
                        fieldLabel: 'B/L 9',
                        width:300,
                        name: 'bl09'
                    },{
                        fieldLabel: 'B/L 10',
                        width:300,
                        name: 'bl10'
                    }
                ]
            });

         var FormSampleInfo3 = Ext.create('Ext.form.Panel', {
            // renderTo: document.body,
            id: 'sampleForm3',
            // height: 350,
            width: '100%',
            bodyPadding: 10,
            defaultType: 'textfield',
            store: storeSampleProperty,
            fieldDefaults: {
                labelWidth: 60,
            },
            items: [
                {
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 30',
                     items:[
                         {xtype: 'tbtext', text: 'B/L' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'bl_min',
                            decimalPrecision : 2
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'bl_max',
                            decimalPrecision : 2
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 30',
                     items:[
                         {xtype: 'tbtext', text: 'E/L' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'el_min',
                            decimalPrecision : 2
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'el_max',
                            decimalPrecision : 2
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                         {xtype: 'tbtext', text: 'B/L 250' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'bl250_min',
                            decimalPrecision : 2
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'bl250_max',
                            decimalPrecision : 2
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 4',
                     items:[
                         {xtype: 'tbtext', text: 'E/L 250' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'el250_min',
                            decimalPrecision : 2
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'el250_max',
                            decimalPrecision : 2
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 6',
                     items:[
                         {xtype: 'tbtext', text: 'Au함량' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'au_min',
                            decimalPrecision : 2
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'au_max',
                            decimalPrecision : 2
                        }
                    ]
                }
            ],
            title: 'B/L E/L 성분 Min/Max'
        });

        var FormSampleInfo4 = Ext.create('Ext.form.Panel', {
            // renderTo: document.body,
            id: 'sampleForm4',
            // height: 350,
            width: '100%',
            bodyPadding: 10,
            defaultType: 'textfield',
            store: storeSampleProperty,
            items: [
                {
                    fieldLabel: 'B/L 250 Min',
                    width:300,
                    name: 'bl250_min'
                },{
                fieldLabel: 'B/L 250 Max',
                width:300,
                name: 'bl250_max'
            },{
                fieldLabel: 'E/L 250 Min',
                width:300,
                name: 'el250_min'
            },{
                fieldLabel: 'E/L 250 Max',
                width:300,
                name: 'el250_max'
            }
            ],
            title: 'B/EL 250 Min/Max',
        });

        var FormSampleInfo5 = Ext.create('Ext.form.Panel', {
            // renderTo: document.body,
            id: 'sampleForm5',
            // height: 350,
            width: '100%',
            bodyPadding: 10,
            defaultType: 'textfield',
            store: storeSampleProperty,
            items: [
                {
                    fieldLabel: 'Au함량 Min',
                    width:300,
                    name: 'au_min'
                },{
                    fieldLabel: 'Au함량 Max',
                    width:300,
                    name: 'au_max'
                }
            ],
            title: 'Au 함량',
        });

        var FormSampleInfo6 = Ext.create('Ext.form.Panel', {
            // renderTo: document.body,
            id: 'sampleForm6',
            // height: 350,
            width: '100%',
            bodyPadding: 10,
            defaultType: 'textfield',
            layout:'column',
            store: storeSampleProperty,
            fieldDefaults: {
                labelWidth: 60,
            },
            items: [
                {
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 10',
                     items:[
                        {xtype: 'tbtext', text: 'B/L 1구간' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'bl01_min',
                            value: 1,
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none;'

                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'bl01_max',
                            listeners:{
                                change: function(field, value) {
                                    console_logs('value', value);
                                    gu.getCmp('bl02_min').setValue(value+1);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            //width:300,
                            //margin: '0 20 0 0',
                            name: 'bl01'
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 10',
                     items:[
                         {xtype: 'tbtext', text: 'B/L 2구간' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'bl02_min',
                            id: gu.id('bl02_min'),
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                            listeners:{
                                change: function(field, value) {
                                    //gu.getCmp('bl02_max').setValue(value);
                                    gu.getCmp('bl02_max').setMinValue(value);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'bl02_max',
                            id: gu.id('bl02_max'),
                            listeners:{
                                change: function(field, value) {
                                    console_logs('value', value);
                                    gu.getCmp('bl03_min').setValue(value+1);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'bl02'
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 10',
                     items:[
                         {xtype: 'tbtext', text: 'B/L 3구간' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'bl03_min',
                            id: gu.id('bl03_min'),
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                            listeners:{
                                change: function(field, value) {
                                    //gu.getCmp('bl03_max').setValue(value);
                                    gu.getCmp('bl03_max').setMinValue(value);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'bl03_max',
                            id: gu.id('bl03_max'),
                            listeners:{
                                change: function(field, value) {
                                    console_logs('value', value);
                                    gu.getCmp('bl04_min').setValue(value+1);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'bl03'
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 10',
                     items:[
                         {xtype: 'tbtext', text: 'B/L 4구간' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'bl04_min',
                            id: gu.id('bl04_min'),
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                            listeners:{
                                change: function(field, value) {
                                    //gu.getCmp('bl04_max').setValue(value);
                                    gu.getCmp('bl04_max').setMinValue(value);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'bl04_max',
                            id: gu.id('bl04_max'),
                            listeners:{
                                change: function(field, value) {
                                    console_logs('value', value);
                                    gu.getCmp('bl05_min').setValue(value+1);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'bl04'
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 10',
                     items:[
                         {xtype: 'tbtext', text: 'B/L 5구간' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'bl05_min',
                            id: gu.id('bl05_min'),
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                            listeners:{
                                change: function(field, value) {
                                    //gu.getCmp('bl05_max').setValue(value);
                                    gu.getCmp('bl05_max').setMinValue(value);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'bl05_max',
                            id: gu.id('bl05_max'),
                            listeners:{
                                change: function(field, value) {
                                    console_logs('value', value);
                                    gu.getCmp('bl06_min').setValue(value+1);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'bl05'
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 10',
                     items:[
                         {xtype: 'tbtext', text: 'B/L 6구간' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'bl06_min',
                            id: gu.id('bl06_min'),
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                            listeners:{
                                change: function(field, value) {
                                    //gu.getCmp('bl06_max').setValue(value);
                                    gu.getCmp('bl06_max').setMinValue(value);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'bl06_max',
                            id: gu.id('bl06_max'),
                            listeners:{
                                change: function(field, value) {
                                    console_logs('value', value);
                                    gu.getCmp('bl07_min').setValue(value+1);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'bl06'
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 10',
                     items:[
                         {xtype: 'tbtext', text: 'B/L 7구간' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'bl07_min',
                            id: gu.id('bl07_min'),
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                            listeners:{
                                change: function(field, value) {
                                    //gu.getCmp('bl07_max').setValue(value);
                                    gu.getCmp('bl07_max').setMinValue(value);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'bl07_max',
                            id: gu.id('bl07_max'),
                            listeners:{
                                change: function(field, value) {
                                    console_logs('value', value);
                                    gu.getCmp('bl08_min').setValue(value+1);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'bl07'
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 10',
                     items:[
                         {xtype: 'tbtext', text: 'B/L 8구간' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'bl08_min',
                            id: gu.id('bl08_min'),
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                            listeners:{
                                change: function(field, value) {
                                    //gu.getCmp('bl08_max').setValue(value);
                                    gu.getCmp('bl08_max').setMinValue(value);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'bl08_max',
                            id: gu.id('bl08_max'),
                            listeners:{
                                change: function(field, value) {
                                    console_logs('value', value);
                                    gu.getCmp('bl09_min').setValue(value+1);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'bl08'
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 10',
                     items:[
                         {xtype: 'tbtext', text: 'B/L 9구간' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'bl09_min',
                            id: gu.id('bl09_min'),
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                            listeners:{
                                change: function(field, value) {
                                    //gu.getCmp('bl09_max').setValue(value);
                                    gu.getCmp('bl09_max').setMinValue(value);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'bl09_max',
                            id: gu.id('bl09_max'),
                            listeners:{
                                change: function(field, value) {
                                    console_logs('value', value);
                                    gu.getCmp('bl10_min').setValue(value+1);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'bl09'
                        }
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                         {xtype: 'tbtext', text: 'B/L 10구간' , style: {'text-align': 'center'}},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'bl10_min',
                            id: gu.id('bl10_min'),
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none;',
                            listeners:{
                                change: function(field, value) {
                                    //gu.getCmp('bl10_max').setValue(value);
                                    gu.getCmp('bl10_max').setMinValue(value);
                                }
                            }
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'bl10_max',
                            id: gu.id('bl10_max'),
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'bl10'
                        }
                    ]
                }
            ],
            title: 'B/L 구간',
        });

       var FormSampleInfo7 = Ext.create('Ext.form.Panel', {
            // renderTo: document.body,
            id: 'sampleForm7',
            // height: 350,
            width: '100%',
            bodyPadding: 10,
            defaultType: 'textfield',
            store: storeSampleProperty,
            fieldDefaults: {
                labelWidth: 60,
                width:200
            },
            items: [

                {
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: 'Diameter 1구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'dia01_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'dia01_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'dia01'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: 'Diameter 2구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'dia02_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'dia02_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'dia02'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: 'Diameter 3구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'dia03_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'dia03_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'dia03'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: 'Diameter 4구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'dia04_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'dia04_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'dia04'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: 'Diameter 5구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'dia05_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'dia05_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'dia05'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: 'Diameter 6구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'dia06_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'dia06_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'dia06'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: 'Diameter 7구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'dia07_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'dia07_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'dia07'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: 'Diameter 8구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'dia08_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'dia08_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'dia08'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: 'Diameter 9구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'dia09_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'dia09_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'dia09'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: 'Diameter 10구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'dia10_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'dia10_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'dia10'
                        },
                    ]
                }
            ],
            title: 'Diameter 구간',
        });

        var FormSampleInfo8 = Ext.create('Ext.form.Panel', {
            // renderTo: document.body,
            id: 'sampleForm8',
            // height: 350,
            width: '100%',
            bodyPadding: 10,
            defaultType: 'textfield',
            store: storeSampleProperty,
            fieldDefaults: {
                labelWidth: 60,
                width:200
            },
            items: [
                {
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: '20Cm 1구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'weight01_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'weight01_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'weight01'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: '20Cm 2구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'weight02_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'weight02_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'weight02'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: '20Cm 3구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'weight03_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'weight03_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'weight03'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: '20Cm 4구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'weight04_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'weight04_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'weight04'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: '20Cm 5구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'weight05_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'weight05_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'weight05'
                        },
                    ]
                },{
                     xtype: 'container',
                     layout:'hbox',
                     margin: '3 3 3 3',
                     items:[
                        {xtype: 'tbtext', text: '20Cm 6구간' , style: {'text-align': 'center'}, width:100},
                        {
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Min',
                            xtype:'numberfield',
                            name: 'weight06_min'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: 'Max',
                            xtype:'numberfield',
                            name: 'weight06_max'
                        },{
                            style: {'text-align': 'right'},minValue: 1,
                            fieldLabel: '수량',
                            xtype:'numberfield',
                            name: 'weight06'
                        },
                    ]
                }
            ],
            title: '20Cm Weight 구간',
        });

        this.widgetSample = Ext.widget('tabpanel', {
            layout:'border',
            border: false,
			region: 'center',
            title: '샘플링 상세정보',
            id:'widgetSampleTab',
            width:'100%',
            // height:'100%',
            tabPosition: 'top',
            dockedItems:[
                {
                    dock:'top',
                    xtype:'toolbar',
                    items: [
                        saveSampleAction
                    ]
                }
            ],
            // flex: 8,
            items: [
                // B/L, E/L
                FormSampleInfo6,
                // FormSampleInfo,
                FormSampleInfo3,
                // FormSampleInfo4,

                //Diameter
                FormSampleInfo7,
                FormSampleInfo8
                // FormSampleInfo2,
                //A/U 함량
                // FormSampleInfo5,

                
            ],

        })

        this.widget = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            title: '성적서 정보',
            id:'widgetTab',
            width:'100%',
            items: [
                gridViewProperty,
                this.widgetSample
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

    saveSample:function(gridViewTable, form3, form6, form7, form8) {
        var view_selection = gridViewTable.getSelectionModel().getSelection();
        var docuTpl_uid = view_selection[0].get('unique_id_long');

        var forms = [form3, form6, form7, form8];
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
                    value: 'B/W'
                }),
                {
                    fieldLabel: 'ITEM 명',
                    xtype: 'textfield',
                    anchor: '80%',  
                    id: 'temp_name',
                    name: 'temp_name',
                    allowBlank:false,
                },
                {
                    fieldLabel: '제품그룹',
                    xtype:'combo',
                    store: gm.me().TempTypeStore,
                    id:'temp_type',
                    name: 'temp_type',
                    anchor: '80%',
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
                //     }
                // }
            ]
        });

        myHeight = 200;
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
                    value: 'B/W'
                }),
                {
                    fieldLabel: 'ITEM 명',
                    xtype: 'textfield',
                    anchor: '80%',  
                    id: 'temp_name',
                    name: 'temp_name',
                    allowBlank:false,
                    value:selection.get('temp_name')
                },
                {
                    fieldLabel: '제품그룹',
                    xtype:'combo',
                    store: gm.me().TempTypeStore,
                    id:'temp_type',
                    name: 'temp_type',
                    anchor: '80%',
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
                    value:selection.get('temp_type')
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

        myHeight = 200;
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
                    value: 'B/W'
                }),
                {
                    fieldLabel: 'ITEM 명',
                    xtype: 'textfield',
                    anchor: '80%',  
                    id: 'temp_name',
                    name: 'temp_name',
                    allowBlank:false
                },
                {
                    fieldLabel: '제품그룹',
                    xtype:'combo',
                    store: gm.me().TempTypeStore,
                    id:'temp_type',
                    name: 'temp_type',
                    anchor: '80%',
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
                    value:selection.get('temp_type')
                    
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

        myHeight = 200;
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
