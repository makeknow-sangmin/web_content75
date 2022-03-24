Ext.define('Rfx2.view.gongbang.purStock.EjaculationMtrlConsumptionView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'row-mtrl-consumption-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        //모델 정의
        this.createStore('Rfx2.model.company.gongbang.RowMtrlConsumption', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gm.pageSize
            , {}
            //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['board']
        );

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        this.addMtrlConsAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '추가',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('addMtrlConsAction'),
            handler: function (widget, event) {
                gm.me().addMtrl();
            }
        });

        this.modifyMtrlConsAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: '수정',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('modifyMtrlConsAction'),
            handler: function (widget, event) {
            }
        });

        this.removeMtrlConsAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '삭제',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('removeMtrlConsAction'),
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '해당 계획에 입력되어 있는 자재를 삭제 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn : gm.me().removeMaterial,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });
        
        this.consumeMtrlAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '자재소모',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('removeMtrlConsAction'),
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: '자재소모',
                    msg: '해당 계획에 입력되어 있는 자재를 소모처리 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().consumeMaterial,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.mtrlStore = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: CONTEXT_PATH + '/design/bom.do?method=cloudread',
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success'
                }
            },
            autoLoad: false
        });

        this.gridMtrl = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridMtrl'),
            store: this.mtrlStore,
            viewConfig: {
                markDirty: false
            },
            selModel: 'checkboxmodel',
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: false,
            bbar: getPageToolbar(this.mtrlStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
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
                        this.addMtrlConsAction,
                        // this.modifyMtrlConsAction,
                        this.removeMtrlConsAction,
                        this.consumeMtrlAction
                    ]
                }
            ]
        });

        gm.extFieldColumnStore.load({
            params: {menuCode: 'PMS6_SUB'},
            callback: function (records, operation, success) {
                if (success) {
                    var obj = gm.parseGridRecord(records, gu.id('gridMtrl'));
                    gm.me().gridMtrl.reconfigure(gm.me().mtrlStore, obj['columns']);
                }
            },
            scope: this
        });

        this.setGridOnCallback(function (selections) {

            if (selections.length > 0) {

                gm.me().mtrlStore.getProxy().setExtraParams({
                    parent_uid: selections[0].get('assymap_uid'),
                    reserved_integer4: 2,
                    is_new: 'Y',
                    orderBy: 'reserved_integer3',
                    ascDesc: 'ASC',
                    ac_uid: selections[0].get('ac_uid'),
                    limit: 10000,
                    prdplan_uid: selections[0].get('assymap_uid')
                });
                gm.me().mtrlStore.load();
                gm.me().removeMtrlConsAction.enable();
                gm.me().consumeMtrlAction.enable();
            } else {
                gm.me().removeMtrlConsAction.disable();
                gm.me().consumeMtrlAction.disable();
            }
        });

        this.gridMtrl.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    // gm.me().addCartAction.enable();
                } else {
                    // gm.me().addCartAction.disable();
                }
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '50%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                },
                this.gridMtrl
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
        this.loadStoreAlways = true;

    },
    addMtrl: function () {

        this.searchStore = Ext.create('Rfx2.store.MaterialStore', {});

        this.removeMtrlConsActionSub = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '삭제',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('removeMtrlConsAction'),
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: '소요량계산',
                    msg: '해당 자재를 삭제하시겠습니까?',
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

        this.mtrlStoreSub = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: CONTEXT_PATH + '/design/bom.do?method=cloudread',
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success'
                }
            },
            autoLoad: false
        });

        this.gridMtrlSub = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridMtrlSub'),
            width: 630,
            height: 590,
            store: /*new Ext.data.Store(),*/this.mtrlStoreSub,
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

        this.mtrlStoreSub.getProxy().setExtraParams({
            parent_uid: selections[0].get('assymap_uid'),
            reserved_integer4: 2,
            is_new: 'Y',
            orderBy: 'reserved_integer3',
            ascDesc: 'ASC',
            ac_uid: selections[0].get('ac_uid'),
            limit: 10000,
            prdplan_uid: selections[0].get('assymap_uid')
        });
        this.mtrlStoreSub.load();

        gm.extFieldColumnStore.load({
            params: {menuCode: 'PMS6_POP'},
            callback: function (records, operation, success) {
                if (success) {
                    var obj = gm.parseGridRecord(records, gu.id('gridMtrlSub'));

                    Ext.each(obj['columns'], function (columnObj) {

                        var dataIndex = columnObj['dataIndex'];

                        switch (dataIndex) {
                            case 'bm_quan':
                            case 'sales_price':
                                columnObj["editor"] = {};
                                columnObj["css"] = 'edit-cell';
                                columnObj["editor"] = {
                                    allowBlank: false,
                                    xtype: 'numberfield'
                                };
                                columnObj["renderer"] = function (value, meta) {
                                    meta.css = 'custom-column';
                                    return value;
                                };
                                break;
                        }

                    });

                    gm.me().gridMtrlSub.reconfigure(gu.getCmp('gridMtrlSub').getStore(), obj['columns']);
                }
            },
            scope: this
        });

        var receiveForm = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanelReceive'),
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
                            emptyText: '품번',
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
                    text: '품번',
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
                            'id': Math.random() * (1000000000 - 1) + 1,
                            'unique_id_long': -1,
                            'child': rec[i].get('unique_id_long'),
                            'item_name': rec[i].get('item_name'),
                            'unit_code': rec[i].get('unit_code'),
                            'sales_price': rec[i].get('sales_price'),
                            'bm_quan': 0
                        });
                    }
                }
            }
        });

        var win = Ext.create('ModalWindow', {
            title: '소모할 자재를 입력합니다.',
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
                    var assymapUids = [];
                    var bmQuans = [];
                    var salesPrices = [];
                    var childs = [];

                    for (var i = 0; i < store.count(); i++) {
                        var record = store.getAt(i);
                        assymapUids.push(record.get('unique_id_long'));
                        bmQuans.push(record.get('bm_quan'));
                        salesPrices.push(record.get('sales_price'));
                        childs.push(record.get('child'));
                    }

                    var selections = gm.me().grid.getSelectionModel().getSelection();

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=addMtrlConsumption',
                        params: {
                            parent: selections[0].get('unique_id_long'),
                            parentUid: selections[0].get('assymap_uid'),
                            childs: childs,
                            assymapUids: assymapUids,
                            bmQuans: bmQuans,
                            salesPrices: salesPrices,
                            acUid: selections[0].get('ac_uid')
                        },
                        success: function(result, request) {
                            gm.me().store.load();
                            gm.me().mtrlStore.load();
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
    consumeMaterial: function (result) {
        if (result == 'yes') {
            var select = gm.me().grid.getSelectionModel().getSelection();
            console_logs('selects >>>>>>', select);
            var selection = select[0];
            gMain.setCenterLoading(true);
            gm.me().loding_msg();
            Ext.Ajax.request({
                waitMsg: '처리중입니다.<br> 잠시만 기다려주세요.',
                url: CONTEXT_PATH + '/index/process.do?method=consumeMaterialDirect',
                params: {
                    prdplan_uid : selection.get('assymap_uid'),
                },
                success: function (result, request) {
                    gMain.setCenterLoading(false);
                    gm.me().stop_msg();
                    gm.me().store.load();
                    Ext.MessageBox.alert('알림', '처리 되었습니다.');
                },
                failure: extjsUtil.failureMessage
            });
            gMain.setCenterLoading(false);
        }
    },
    removeMaterial : function(result){
        if (result == 'yes') {
            var select = gm.me().gridMtrl.getSelectionModel().getSelection();
            console_logs('selects >>>>>>', select);
            var selection = select[0];
            gMain.setCenterLoading(true);
            gm.me().loding_msg();
            Ext.Ajax.request({
                waitMsg: '처리중입니다.<br> 잠시만 기다려주세요.',
                url: CONTEXT_PATH + '/index/process.do?method=removeMaterialDirect',
                params: {
                    assymap_uid : selection.get('po_sec'),
                },
                success: function (result, request) {
                    gMain.setCenterLoading(false);
                    gm.me().stop_msg();
                    gm.me().store.load();
                    gm.me().mtrlStore.load();
                    Ext.MessageBox.alert('알림', '처리 되었습니다.');
                },
                failure: extjsUtil.failureMessage
            });
            gMain.setCenterLoading(false);
        }
    },
    loding_msg: function () {
        Ext.MessageBox.wait('데이터를 처리중입니다.<br>잠시만 기다려주세요.', '알림');
    },

    stop_msg: function () {
        Ext.MessageBox.hide();
    },
});
