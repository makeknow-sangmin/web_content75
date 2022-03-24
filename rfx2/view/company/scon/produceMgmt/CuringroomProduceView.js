Ext.define('Rfx2.view.company.scon.produceMgmt.CuringroomProduceView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'capa-view',
    initComponent: function () {
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();




        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL']
        });

        buttonToolbar.insert(3, this.downloadSheetAction);

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.OpenCuringRoom', [{
            property: 'unique_id',
            direction: 'ASC'
        }],
            gm.pageSize
            , {}
            , ['']
        );

        var arr = [];
        arr.push(buttonToolbar);
        // arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        this.curingState = Ext.create('Rfx2.store.company.chmr.CuringStateStore', { pageSize: 100 });

        this.addUseMold = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '사용 금형 추가',
            disabled: true,
            handler: function (widget, event) {
                gm.me().addMtrl();
            }
        });



        this.gridCuring = Ext.create('Ext.grid.Panel', {
            store: this.curingState,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            bbar: getPageToolbar(this.curingState),
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            viewConfig: {
                emptyText: '<div style="text-align:center; padding-top:30% ">조회된 데이터가 없습니다.</div>'
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {
                    text: '품명',
                    width: 140,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'concat_item_desc'
                },
                {
                    text: '규격',
                    width: 140,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'specification'
                },
                {
                    text: '계획수량',
                    width: 110,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'process_qty',
                    renderer: function (value, meta) {

                        value = Ext.util.Format.number(value, '0,000');
                        return value;
                    },
                },
                {
                    text: '양생 예정수량',
                    width: 110,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'curing_plan',
                    renderer: function (value, meta) {

                        value = Ext.util.Format.number(value, '0,000');
                        return value;
                    },
                },
                {
                    text: '오늘 생산수량',
                    width: 110,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'work_qty_present',
                    renderer: function (value, meta) {
                        if (value <= 0) {
                            meta.style = "background-color:red;color:#ffffff;text-align:right;text-format:0,000";
                        }
                        value = Ext.util.Format.number(value, '0,000');
                        return value;
                    },
                },
                {
                    text: '금형 Tag',
                    width: 150,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'pcs_desc',
                },
                {
                    text: '회전수',
                    width: 110,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'target_qty',
                },
                {
                    text: '계획-현생산수량',
                    width: 150,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'diff_plan_work_present',
                    renderer: function (value, meta) {

                        value = Ext.util.Format.number(value, '0,000');
                        return value;
                    },
                },

            ],
            title: '양생실 생산진행현황',
            name: 'capa',
            autoScroll: true,
            // TODO:  추후 기능 개선.
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.addUseMold,
                    ]
                }
            ]
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '40%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.grid]
                    }]
                }, this.gridCuring
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                console_logs('rec ??????', selections);
                var rec = selections[0];
                var pcsmchn_uid = rec.get('unique_id_long');
                this.gridCuring.getStore().getProxy().setExtraParam('pcsmchn_uid', pcsmchn_uid);
                this.gridCuring.getStore().load(function (record) {
                });
            } else {
            }
        });
        this.gridCuring.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    console_logs('curing ??????', selections);
                    gm.me().addUseMold.enable();
                } else {
                    gm.me().addUseMold.disable();
                }
            }
        });
    },
    addMtrl: function () {
        this.searchStore = Ext.create('Rfx2.store.company.chmr.MoldDetailByUidStore', {pageSize : 100});
        this.removeMtrlConsActionSub = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '삭제',
            disabled: true,
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '입력된 금형을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == "no" || btn == "cancel") {
                            return;
                        } else {
                            var records = gu.getCmp('gridMtrlSub').getSelectionModel().getSelection();

                            for (var i = 0; i < records.length; i++) {
                                gu.getCmp('gridMtrlSub').getStore().remove(records[i]);
                            }
                        }
                    }
                });
            }
        });

        this.gridMtrlSub = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridMtrlSub'),
            width: 630,
            height: 590,
            store: new Ext.data.Store(),
            viewConfig: {
                markDirty: false
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2
            },
            selModel: 'checkboxmodel',
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            frame: true,
            flex: 0.5,
            layout: 'fit',
            forceFit: false,
            margin: '0 0 0 0',
            columns: [],
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                }
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.removeMtrlConsActionSub
                    ]
                }
            ]
        });

        var selections = gm.me().grid.getSelectionModel().getSelection();

        gm.extFieldColumnStore.load({
            params: {menuCode: 'CURING_MOLD'},
            callback: function (records, operation, success) {
                if (success) {
                    var obj = gm.parseGridRecord(records, gu.id('gridMtrlSub'));
                    Ext.each(obj['columns'], function (columnObj) {
                        var dataIndex = columnObj['dataIndex'];
                    });
                    gm.me().gridMtrlSub.reconfigure(gu.getCmp('gridMtrlSub').getStore(), obj['columns']);
                }
            },
            scope: this
        });

        var receiveForm = Ext.create('Ext.form.Panel', {
            defaultType: 'textfield',
            border: false,
            bodyPadding: 5,
            region: 'center',
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
            items: [
                this.gridMtrlSub
            ]
        });

        this.searchStore.removeAll();
        this.searchStore.load();

        this.itemSearchAction = Ext.create('Ext.Action', {
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            tooltip: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function () {
                var extraParams = gm.me().searchStore.getProxy().getExtraParams();
                if (Object.keys(extraParams).length == 0) {
                    Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                } else {
                    gm.me().searchStore.load();
                }
            }
        });

        this.gridViewTable = Ext.create('Ext.grid.Panel', {
            store: this.searchStore,
            cls: 'rfx-panel',
            multiSelect: false,
            autoScroll: true,
            frame: true,
            border: false,
            bbar: getPageToolbar(this.searchStore),
            height: 200,
            padding: '0 0 5 0',
            flex: 1,
            layout: 'fit',
            forceFit: true,
            listeners: {
                select: function (selModel, record, index, options) {

                }
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    style: 'background-color: #EFEFEF;',
                    items: [
                        {
                            field_id: 'search_item_code',
                            width: 150,
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_item_code_part'),
                            name: 'search_item_code ',
                            margin: '3 3 3 3',
                            xtype: 'triggerfield',
                            emptyText: 'TAG번호',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');

                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    if (e.trim().length > 0) {
                                        gm.me().searchStore.getProxy().setExtraParam('item_code', '%' + e + '%');
                                    } else {
                                        delete gm.me().searchStore.proxy.extraParams.item_code;
                                    }
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },
                        {
                            field_id: 'search_item_name',
                            width: 150,
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_item_name_part'),
                            name: 'search_item_name',
                            xtype: 'triggerfield',
                            margin: '3 3 3 3',
                            emptyText: '품명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    if (e.trim().length > 0) {
                                        gm.me().searchStore.getProxy().setExtraParam('item_name', '%' + e + '%');
                                    } else {
                                        delete gm.me().searchStore.proxy.extraParams.item_name;
                                    }
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },
                        {
                            field_id: 'search_specification',
                            width: 150,
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_specification_part'),
                            name: 'search_specification',
                            xtype: 'triggerfield',
                            margin: '3 3 3 3',
                            emptyText: '규격',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    if (e.trim().length > 0) {
                                        gm.me().searchStore.getProxy().setExtraParam('specification', '%' + e + '%');
                                    } else {
                                        delete gm.me().searchStore.proxy.extraParams.specification;
                                    }
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },
                        '->',
                        this.itemSearchAction
                    ]
                }
            ],
            columns: [
                {
                    text: 'TAG 번호',
                    width: 120,
                    dataIndex: 'item_code',
                    style: 'text-align:center'
                },
                {
                    text: '품명',
                    width: 250,
                    dataIndex: 'item_name',
                    renderer: function (value) {
                        return value.replace(/</gi, "&lt;");
                    },
                    style: 'text-align:center'
                },
                {
                    text: '규격',
                    width: 250,
                    dataIndex: 'specification',
                    style: 'text-align:center'
                }
            ]
        });

        this.gridMtrlSub.getSelectionModel().on({
            selectionchange: function (sm, records) {
                if (records.length > 0) {
                    gm.me().removeMtrlConsActionSub.enable();
                } else {
                    gm.me().removeMtrlConsActionSub.disable();
                }
            }
        })

        this.createPartForm = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            width: 620,
            height: 600,
            bodyPadding: 5,
            layout: {
                type: 'vbox',
                align: 'stretch' // Child items are stretched to full width
            },
            defaults: {
                allowBlank: true,
                msgTarget: 'side',
                labelWidth: 80
            },
            items: [
                this.gridViewTable
            ]
        });

        var rightBtn = Ext.create('Ext.Button', {
            width: 50,
            height: 100,
            margin: '5 5 5 5',
            text: '▶',
            enableToggle: true,
            listeners: {
                click: function () {
                    var grid = gm.me().gridViewTable;
                    var rec = grid.getSelectionModel().getSelection();
                    for (var i = 0; i < rec.length; i++) {
                        gu.getCmp('gridMtrlSub').getStore().add({
                            'unique_id_long': rec[i].get('unique_id_long'),
                            'item_code': rec[i].get('item_code'),
                            'item_name': rec[i].get('item_name'),
                            'specification': rec[i].get('specification'),
                        });
                    }
                }
            }
        });

        var win = Ext.create('ModalWindow', {
            title: '사용할 금형을 입력합니다.',
            width: 1320,
            height: 673,
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'center'
                    },
                    defaults: {
                        margin: '0,3,3,0'
                    },
                    items: [
                        this.createPartForm,
                        rightBtn,
                        receiveForm
                    ]
                }
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    var store = gm.me().gridMtrlSub.getStore();
                    var mold_uids = [];
                    for (var i = 0; i < store.count(); i++) {
                        var record = store.getAt(i);
                        mold_uids.push(record.get('unique_id_long'));
                    }
                    var selections = gm.me().gridCuring.getSelectionModel().getSelection();
                    var rec = selections[0];

                    var mainSelection = gm.me().grid.getSelectionModel().getSelection();
                    var recMain = mainSelection[0];
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/machine.do?method=addUseMachineAtStep',
                        params: {
                            mold_uids  : mold_uids,
                            step_uid : rec.get('unique_id_long'),
                            curingroom_uid :  recMain.get('unique_id_long'),
                        },
                        success: function(result, request) {
                            gm.me().store.load();
                            gm.me().curingState.load();
                            if (win) {
                                win.close();
                            }
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                }//endofhandler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }
            ],
            // icon: Ext.MessageBox.QUESTION
        });
        win.show();
    },
});