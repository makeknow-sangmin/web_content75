Ext.require([
    'Ext.ux.CustomSpinner'
]);
Ext.define('Rfx2.view.company.bioprotech.purStock.HEAVY4_WearingWaitView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'wearing-wait-view',
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField('seller_name');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('po_no');

        Ext.each(this.columns, function (columnObj) {
            let dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'curGr_qty':
                case 'sales_price_local':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    columnObj["editor"] = {
                        xtype: 'customspinner',
                        step: 1
                    };
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';

                        return Ext.util.Format.number(value, '0,00.#####');
                    }
                    break;
                case 'sales_amount':
                    columnObj["css"] = 'edit-cell';
                    columnObj["editor"] = {
                        xtype: 'numberfield'
                    };
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';

                        return Ext.util.Format.number(value, '0,00.#####');
                    }
                    break;
                case 'req_info':
                    columnObj["css"] = 'edit-cell';
                    columnObj["editor"] = {
                        xtype: 'textfield'
                    };
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    break;
                default:
                    break;
            }
        });

        //명령툴바 생성
        let buttonToolbar = this.createCommandToolbar();

        let buttonToolbar3 = Ext.create('widget.toolbar', {
            // style: 'background-color: #000069;',
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                id: gu.id('total_price'),
                style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
                //style: 'color: yellow; font-size: 15px; margin: 5px;',
                text: '총 입고금액 : '
            }]
        });

        Ext.each(this.columns, function (columnObj) {
            let o = columnObj;
            let dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'stock_qty_safe':
                case 'totalPrice':
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        if (gm.me().store.data.items.length > 0) {
                            let summary = gm.me().store.data.items[0].get('summary');
                            if (summary.length > 0) {
                                let objSummary = Ext.decode(summary);
                                return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                            } else {
                                return 0;
                            }
                        } else {
                            return 0;
                        }
                    };
                    break;
                default:
                    break;
            }
        });

        this.localSize = gm.unlimitedPageSize;

        this.createStoreSimple({
            modelClass: 'Rfx.model.Heavy4WearingWait',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            pageSize: this.localSize, /*pageSize*/
        }, {
            groupField: 'po_no',
            groupDir: 'DESC'
        });

        for (let i = 0; i < this.columns.length; i++) {
            let o = this.columns[i];
            let dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'gr_qty':
                case 'notGr_qty':
                case 'curGr_qty':
                case 'sales_price':
                case 'sales_price_local':
                case 'total_price':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value) {
                        value = Ext.util.Format.number(value, '0,00.##/i');
                        value = '<span style="font-weight: bold; font-size:10pt; color:#000000;">' + value + '</span>'
                        return value;
                    };
                    break;
                default:
                    break;
            }

        }

        //그리드 생성
        let arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        //grid 생성.
        this.createGridCore(arr);
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        // remove the items
        (buttonToolbar.items).each(function (item, index) {
            if (index === 1 || index === 2 || index === 3 || index === 4 || index === 5) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(5, '-');

        //입고 확인 Action 생성
        this.createGrAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '입고 확인',
            tooltip: '입고 확인',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('createGrAction'),
            handler: function () {
                gm.me().treatGr();
            }
        });

        //입고 마감 Action 생성
        this.closeGrAction = Ext.create('Ext.Action', {
            iconCls: 'dabp-close',
            text: '입고 마감',
            tooltip: '입고 마감',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('closeGrAction'),
            handler: function () {
                gm.me().treatCloseGr();
            }
        });

        //입고 마감 Action 생성
        this.cancelCloseGrAction = Ext.create('Ext.Action', {
            iconCls: 'dabp-close',
            text: '입고마감 취소',
            tooltip: '입고마감 취소',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('cancelCloseGrAction'),
            handler: function () {
                gm.me().treatCancelCloseGr();
            }
        });

        buttonToolbar.insert(1, '-');
        buttonToolbar.insert(1, this.cancelCloseGrAction);
        buttonToolbar.insert(1, this.closeGrAction);
        buttonToolbar.insert(1, this.createGrAction);

        this.callParent(arguments);

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {

            }
        });

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length) {
                this.gr_qtys = [];
                for (let i = 0; i < selections.length; i++) {
                    let rec1 = selections[i];
                    let uids = rec1.get('id');
                    let curGr_qty = rec1.get('curGr_qty');
                    this.gr_qtys.push(curGr_qty);
                }//endoffor

                let rec = selections[0];
                gm.me().gr_qtys = this.gr_qtys;

                gm.me().cartmapuid = rec.get('id');
                gm.me().gr_qty = rec.get('curGr_qty');
                gm.me().item_name = rec.get('item_name');

                gm.me().closeGrAction.enable();
                gm.me().createGrAction.enable();
            } else {
                gm.me().closeGrAction.disable();
                gm.me().createGrAction.disable();
            }

        });

        this.grid.on('edit', function (editor, e) {

            let field = e.field;

            switch (field) {
                case 'curGr_qty':
                case 'sales_price_local':
                    let selection = gm.me().grid.getSelectionModel().getSelection();
                    let rec = selection[0];

                    selection[0].set('total_price_local', +Number(rec.get('curGr_qty')) * Number(selection[0].get('sales_price_local')).toFixed(5));
                    break;
                default:
                    break;
            }
        });

        //디폴트 로드
        gm.setCenterLoading(false);

        this.store.getProxy().setExtraParam('po_types', 'MN,P,OU');

        this.store.load(function (records) {

            let total_price_sum = 0;
            let total_qty = 0;

            for (let i = 0; i < gm.me().store.data.items.length; i++) {
                let t_rec = gm.me().store.data.items[i];
                total_price_sum += t_rec.get('sales_amount');
                total_qty += t_rec.get('curGr_qty');
            }

            buttonToolbar3.items.items[1].update('총 입고금액 : ' + gu.renderNumber(total_price_sum));
        });

    },
    items: [],
    gr_qtys: [],
    poviewType: 'ALL',

    treatCancelCloseGr: function () {

        this.cancelCloseGrStore = Ext.create('Rfx2.store.CancelCloseGrStore', {});

        this.cancelCloseGrGrid = Ext.create('Ext.grid.Panel', {
            store: this.cancelCloseGrStore,
            id: gu.id('goGrid'),
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            selModel: 'checkboxmodel',
            bbar: getPageToolbar(this.cancelCloseGrStore),
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: false,
            height: '100%',
            columns: [
                {text: '주문번호', width: 90, style: 'text-align:center', dataIndex: 'po_no', sortable: false},
                {text: '품번', width: 120, style: 'text-align:center', dataIndex: 'item_code', sortable: false},
                {text: '품명', width: 180, style: 'text-align:center', dataIndex: 'item_name', sortable: false},
                {text: '규격', width: 200, style: 'text-align:center', dataIndex: 'specification', sortable: false},
                {text: '공급사', width: 150, style: 'text-align:center', dataIndex: 'seller_name', sortable: false},
                {text: '단위', width: 60, style: 'text-align:center', dataIndex: 'unit_code', sortable: false},
                {
                    text: '주문수량', width: 75, style: 'text-align:center', dataIndex: 'po_qty', sortable: false,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '기입고', width: 80, style: 'text-align:center', dataIndex: 'gr_qty', sortable: false,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '마감수량', width: 80, style: 'text-align:center', dataIndex: 'gr_blocking_qty', sortable: false,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                }
            ],
            dockedItems: []
        });

        this.cancelCloseGrStore.getProxy().setExtraParam('exist_close_gr', 'Y');
        this.cancelCloseGrStore.load();

        let prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '마감 취소',
            width: 1100,
            height: 650,
            plain: true,
            layout: 'fit',
            items: [
                this.cancelCloseGrGrid
            ],
            overflowY: 'scroll',
            buttons: [{
                text: '마감 취소',

                handler: function (btn) {

                    if (btn === 'no') {
                        prWin.close();

                    } else {
                        Ext.MessageBox.show({
                            title: '마감취소',
                            msg: '마감을 취소하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            fn: function (btn) {
                                if (btn === 'yes') {

                                    let xpoastUids = [];

                                    let selections = gm.me().cancelCloseGrGrid.getSelectionModel().getSelection();

                                    for (let i = 0; i < selections.length; i++) {
                                        xpoastUids.push(selections[i].get('unique_id_long'));
                                    }

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/quality/wgrast.do?method=cancelCloseGr',
                                        params: {
                                            xpoastUids: xpoastUids
                                        },
                                        success: function () {
                                            Ext.Msg.alert('알림', '입고 마감이 취소 되었습니다.');
                                            gm.me().store.load();
                                            if (prWin) {
                                                prWin.close();
                                            }
                                        },
                                        failure: function () {
                                            Ext.Msg.alert('알림', '입고 마감 취소가 실패 되었습니다.');
                                            if (prWin) {
                                                prWin.close();
                                            }
                                        }
                                    });
                                }
                            },
                            icon: Ext.MessageBox.QUESTION
                        });
                    }
                }
            },
                {
                    text: '취소',
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    }
                }]
        });
        prWin.show();
    },

    treatCloseGr: function () {
        Ext.MessageBox.show({
            title: '마감',
            msg: '해당 주문의 입고를 마감하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn === 'yes') {

                    let xpoastUids = [];

                    let selections = gm.me().grid.getSelectionModel().getSelection();

                    for (let i = 0; i < selections.length; i++) {
                        xpoastUids.push(selections[i].get('unique_id_long'));
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/quality/wgrast.do?method=closeGr',
                        params: {
                            xpoastUids: xpoastUids
                        },
                        success: function () {
                            Ext.Msg.alert('알림', '입고 마감이 완료 되었습니다.');
                            gm.me().store.load();
                        },
                        failure: function () {
                            Ext.Msg.alert('알림', '입고 마감이 실패 되었습니다.');
                        }
                    });
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    treatGr: function () {

        let selections = gm.me().grid.getSelectionModel().getSelection();

        if (selections.length > 1) {
            Ext.Msg.alert('경고', '한개의 자재를 선택하시기 바랍니다.');
            return;
        }
        let rec = selections[0];

        let workingArea = rec.get('working_area');

        switch (workingArea) {
            case 'OUT':
                this.treatGrOuter(rec);
                break;
            default:
                this.treatGrNormal(rec);
                break;
        }
    },

    treatGrOuter: function(rec) {

        let whouseStore = Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {});
        let srcahdUid = rec.get('srcahd_uid');
        let cartmapUid = rec.get('unique_id_long');
        let item_name = rec.get('item_name');
        let grQuan = rec.get('curGr_qty');
        let finance_rate = rec.get('finance_rate');
        let supastUid = rec.get('sms_cnt');
        let working_area = rec.get('working_area');

        //셀렉션 붙임 끝
        let boxPacking = null;
        let printQuan = null;

        let bomListStore = Ext.create('Rfx2.store.company.bioprotech.BomDtlStore', {});
        bomListStore.getProxy().setExtraParam('ver_child', srcahdUid);
        bomListStore.getProxy().setExtraParam('supastUid', supastUid);

        this.bomListGrid = Ext.create('Ext.grid.Panel', {
            store: bomListStore,
            id: gu.id('bomListGrid'),
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: false,
            height: 250,
            columns: [
                {text: '품번', width: 80, style: 'text-align:center', dataIndex: 'item_code', sortable: false},
                {text: '품명', width: 180, style: 'text-align:center', dataIndex: 'item_name', sortable: false},
                {text: '규격', width: 180, style: 'text-align:center', dataIndex: 'specification', sortable: false},
                {text: '단위', width: 50, style: 'text-align:center', dataIndex: 'unit_code', sortable: false},
                {
                    text: '필요수량', width: 85, style: 'text-align:center',
                    dataIndex: 'quan', align: 'right', sortable: false,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '외주재고', width: 85, style: 'text-align:center',
                    dataIndex: 'wh_qty', align: 'right', sortable: false,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '잔여재고', width: 85, style: 'text-align:center',
                    dataIndex: 're_quan', align: 'right', sortable: false,
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                }
            ],
            dockedItems: [
                Ext.create('widget.toolbar', {
                plugins: {
                    boxreorderer: false
                },
                cls: 'my-x-toolbar-default2',
                margin: '0 0 0 0',
                padding: '10 10 10 10',
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        xtype: 'component',
                        html: '사급 주문에 대한 입고는 외주 창고의 재고를 감소시킵니다.'
                    }
                ]
                })
            ]
        });

        let form = Ext.create('Ext.form.Panel', {
                xtype: 'form',
                frame: false,
                border: false,
                bodyPadding: 10,
                region: 'center',
                layout: 'column',
                autoScroll: true,
                fieldDefaults: {
                    margin: '3 3 3 3',
                    width: 350,
                    labelAlign: 'right',
                    msgTarget: 'side'
                },
                items: [
                    {
                        fieldLabel: '프린터',
                        //labelWidth: 80,
                        xtype: 'combo',
                        id: gu.id('printer'),
                        name: 'printIpAddress',
                        store: Ext.create('Mplm.store.PrinterStore'),
                        displayField: 'code_name_kr',
                        valueField: 'system_code',
                        emptyText: '프린터 선택',
                        allowBlank: false,
                        hidden: true
                    },
                    {
                        fieldLabel: '프린트 라벨',
                        xtype: 'combo',
                        id: gu.id('print_label'),
                        name: 'labelSize',
                        store: Ext.create('Mplm.store.PrintLabelStore'),
                        displayField: 'code_name_kr',
                        valueField: 'system_code',
                        emptyText: '라벨 선택',
                        allowBlank: false,
                        hidden: true
                    },
                    {
                        fieldLabel: '입고 의견',
                        xtype: 'textarea',
                        rows: 2,
                        name: 'gr_reason',
                        id: gu.id('grReason'),
                        fieldStyle: 'min-height: 40px !important',
                        emptyText: '입고의견을 입력해주세요'
                    },
                    {
                        fieldLabel: '입고 날짜',
                        xtype: 'datefield',
                        name: 'gr_date',
                        id: gu.id('grDate'),
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        value: new Date()
                    },
                    {
                        fieldLabel: '입고창고',
                        name: 'whouse_code',
                        xtype: 'combo',
                        displayField: 'wh_name',
                        valueField: 'unique_id_long',
                        editable: false,
                        allowBlank: true,
                        autoWidth: true,
                        id: gu.id('whouseUid'),
                        store: whouseStore,
                        listConfig: {
                            loadingText: 'Searching...',
                            emptyText: 'No matching posts found.',
                            getInnerTpl: function () {
                                return '<div data-qtip="{wh_code}">[{wh_code}] {wh_name}</div>';
                            }
                        },
                        listeners: {
                            select: function (combo, record) {
                            }//endofselect
                        }
                    },
                ]
            }
        );

        let etc_grid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('etc_grid'),
            collapsible: false,
            multiSelect: false,
            width: 750,
            height: 300,
            autoScroll: true,
            margin: '0 0 20 0',
            autoHeight: true,
            frame: false,
            border: true,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false
            },
            columns: [
                {
                    text: 'LOT 번호',
                    width: '30%',
                    style: 'text-align:center',
                    dataIndex: 'input_lot',
                    name: 'input_lot',
                    editor: 'textfield',
                    sortable: false
                },
                {
                    text: '포장단위',
                    width: '20%',
                    dataIndex: 'packing',
                    editor: 'numberfield',
                    style: 'text-align:center',
                    align: 'right',
                    value: boxPacking,
                    listeners: {},
                    renderer: function (value) {
                        boxPacking = value;
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    sortable: false
                },
                {
                    text: '박스 수량',
                    width: '20%',
                    dataIndex: 'each',
                    editor: 'numberfield',
                    sortable: false,
                    style: 'text-align:center',
                    align: 'right',
                    value: printQuan,
                    renderer: function (value) {
                        printQuan = value;
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '자재 총 수량  ',
                    width: '30%',
                    dataIndex: 'totalQuan',
                    style: 'text-align:center',
                    align: 'right',
                    sortable: false,
                    renderer: function (val, meta, record) {
                        gm.me().setQuanBoxValue(gm.me().bomListGrid);
                        return Ext.util.Format.number(record.get('packing') * record.get('each'), '0,00/i');
                    }
                }
            ],
            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2
            },
            listeners: {},
            dockedItems: [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [

                        {
                            xtype: 'textfield',
                            name: 'item_name',
                            fieldLabel: '품명',
                            margin: '0 7 0 7',
                            editable: false,
                            labelWidth: 70,
                            width: 400,
                            allowBlank: false,
                            value: item_name
                        },
                        {
                            text: '+',
                            listeners: [{
                                click: function () {

                                    let store = gu.getCmp('etc_grid').getStore();
                                    let getCount = store.getCount();

                                    store.insert(getCount, new Ext.data.Record({
                                        'packing': store.getAt(getCount - 1).get('packing'),
                                        'each': 1,
                                        'multiple': grQuan,
                                        'totalQuan': grQuan * 1
                                    }));
                                }
                            }]
                        },
                        {
                            text: '-',
                            listeners: [{
                                click: function () {
                                    let record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                                    gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));
                                    gm.me().setQuanBoxValue();
                                }
                            }]
                        },
                        '->',
                        {
                            xtype: 'component',
                            html: '총 입고예정: ' + Ext.util.Format.number(grQuan, '0,00/i')
                        },
                        '-',
                        {
                            xtype: 'component',
                            html: '포장단위: ' + Ext.util.Format.number(finance_rate, '0,00/i')
                        }

                    ]
                }),
                form,
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    padding: '10 10 10 10',
                    layout: {
                        type: 'hbox',
                        pack: 'end'
                    },
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('totalQuanSum'),
                            html: '총 입고수량: ' + Ext.util.Format.number(0, '0,00/i') + ' / ' +
                                '총 박스수량: ' + Ext.util.Format.number(0, '0,00/i')
                        }

                    ]
                })

            ]
        });

        let comboPrinter = gu.getCmp('printer');
        comboPrinter.store.load(
            function () {
                this.each(function (record) {
                    let system_code = record.get('system_code');
                    if (system_code === '192.168.20.12') {
                        comboPrinter.select(record);
                    }
                });
            }
        );

        let comboLabel = gu.getCmp('print_label');
        comboLabel.store.load(
            function () {
                this.each(function (record) {
                    let system_code = record.get('system_code');
                    if (system_code === 'L100x80') {
                        comboLabel.select(record);
                    }
                });
            }
        );

        let comboWhouse = gu.getCmp('whouseUid');
        comboWhouse.store.load(
            function () {
                this.each(function (record) {
                    let unique_id_long = record.get('unique_id_long');
                    if (unique_id_long === gm.me().grid.getSelectionModel()
                        .getSelection()[0].get('reserved_number1')) {
                        comboWhouse.select(record);
                    }
                });
            }
        );

        if (finance_rate === 0 || finance_rate === 1 || finance_rate < 0) {
            gu.getCmp('etc_grid').getStore().insert(0, new Ext.data.Record({
                'each': 1, 'packing': grQuan, 'multiple': grQuan, 'totalQuan': grQuan
            }));
        } else {

            let divNum = parseInt(grQuan / finance_rate); //몫
            let resNum = grQuan - divNum * finance_rate;

            if (divNum > 0) {
                gu.getCmp('etc_grid').getStore().insert(0, new Ext.data.Record({
                    'each': divNum,
                    'packing': finance_rate,
                    'multiple': divNum * finance_rate,
                    'totalQuan': divNum * finance_rate
                }));
            }

            if (resNum > 0) {
                gu.getCmp('etc_grid').getStore().insert(1, new Ext.data.Record({
                    'each': 1,
                    'packing': resNum,
                    'multiple': grQuan - (divNum * finance_rate),
                    'totalQuan': grQuan - (divNum * finance_rate)
                }));
            }
        }

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '입고확인',
            width: 770,
            height: 650,
            plain: true,
            items: [etc_grid, this.bomListGrid],
            overflowY: 'scroll',
            buttons: [{
                text: '입고확인',

                handler: function (btn) {

                    prWin.setLoading(true);

                    let quanArray = []; //포장수량 배열
                    let lotArray = []; //로트 배열
                    let printQuanArray = [];   //출력 매수 배열

                    let isEmptyLot = false;

                    let packingCount = 0;
                    let printCount = 0;
                    let multiple = 0;

                    let store = gu.getCmp('etc_grid').getStore();
                    let totalIndex = store.getCount();

                    for (let i = 0; i < totalIndex; i++) {

                        let vo = store.data.items[i];

                        let packing = vo.get('packing');
                        let each = vo.get('each');
                        let input_lot = vo.get('input_lot');

                        if (input_lot === undefined || input_lot === null || input_lot.length === 0) {
                            isEmptyLot = true;
                            break;
                        }

                        packingCount = packingCount + packing;
                        printCount = printCount + each;
                        multiple = multiple + packing * each;

                        quanArray.push(packing);
                        printQuanArray.push(each);
                        lotArray.push(input_lot);

                    }

                    if (isEmptyLot === true) {
                        Ext.Msg.alert('알림', 'LOT 번호가 공란인 항목이 있습니다.');
                        prWin.setLoading(false);
                    } else if (multiple < grQuan) {
                        Ext.Msg.alert('알림', '입고 예정 수량 보다 적습니다.');
                        prWin.setLoading(false);

                    } else {

                        if (btn === 'no') {
                            prWin.close();

                        } else {

                            let grDate = gu.getCmp('grDate').getValue();

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/quality/wgrast.do?method=createGrIndividual',
                                timeout: 120000,
                                params: {
                                    cartmapUid: cartmapUid,
                                    grReason: gu.getCmp('grReason').getValue(),
                                    printIpAddress: gu.getCmp('printer').getValue(),
                                    labelSize: gu.getCmp('print_label').getValue(),
                                    grDate: grDate,
                                    whouseUid: gu.getCmp('whouseUid').getValue(),
                                    quanArray: quanArray,
                                    lotArray: lotArray,
                                    printQuanArray: printQuanArray,
                                    supastUid: supastUid,
                                    working_area: working_area,
                                    srcahdUid: srcahdUid
                                },
                                success: function () {
                                    //Ext.Msg.alert('알림', '입고가 완료 되었습니다.');
                                    gm.me().store.load();

                                    if (prWin) {
                                        prWin.close();
                                    }
                                },
                                failure: function () {

                                    gm.me().store.load();

                                    if (prWin) {
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }   //else 끝
                }
            },
                {
                    text: '취소',
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    }
                }]
        });
        prWin.show();
    },

    treatGrNormal: function(rec) {

        let whouseStore = Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {});
        let cartmapUid = rec.get('unique_id_long');
        let item_name = rec.get('item_name');
        let grQuan = rec.get('curGr_qty');
        let finance_rate = rec.get('finance_rate');

        //셀렉션 붙임 끝
        let boxPacking = null;
        let printQuan = null;

        let form = Ext.create('Ext.form.Panel', {
                xtype: 'form',
                frame: false,
                border: false,
                bodyPadding: 10,
                region: 'center',
                layout: 'column',
                autoScroll: true,
                fieldDefaults: {
                    margin: '3 3 3 3',
                    width: 350,
                    labelAlign: 'right',
                    msgTarget: 'side'
                },
                items: [
                    {
                        fieldLabel: '프린터',
                        //labelWidth: 80,
                        xtype: 'combo',
                        id: gu.id('printer'),
                        name: 'printIpAddress',
                        store: Ext.create('Mplm.store.PrinterStore'),
                        displayField: 'code_name_kr',
                        valueField: 'system_code',
                        emptyText: '프린터 선택',
                        allowBlank: false,
                        hidden: true
                    },
                    {
                        fieldLabel: '프린트 라벨',
                        xtype: 'combo',
                        id: gu.id('print_label'),
                        name: 'labelSize',
                        store: Ext.create('Mplm.store.PrintLabelStore'),
                        displayField: 'code_name_kr',
                        valueField: 'system_code',
                        emptyText: '라벨 선택',
                        allowBlank: false,
                        hidden: true
                    },
                    {
                        fieldLabel: '입고 의견',
                        xtype: 'textarea',
                        rows: 2,
                        name: 'gr_reason',
                        id: gu.id('grReason'),
                        fieldStyle: 'min-height: 40px !important',
                        emptyText: '입고의견을 입력해주세요'
                    },
                    {
                        fieldLabel: '입고 날짜',
                        xtype: 'datefield',
                        name: 'gr_date',
                        id: gu.id('grDate'),
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        value: new Date()
                    },
                    {
                        fieldLabel: '입고창고',
                        name: 'whouse_code',
                        xtype: 'combo',
                        displayField: 'wh_name',
                        valueField: 'unique_id_long',
                        editable: false,
                        allowBlank: true,
                        autoWidth: true,
                        id: gu.id('whouseUid'),
                        store: whouseStore,
                        listConfig: {
                            loadingText: 'Searching...',
                            emptyText: 'No matching posts found.',
                            getInnerTpl: function () {
                                return '<div data-qtip="{wh_code}">[{wh_code}] {wh_name}</div>';
                            }
                        },
                        listeners: {
                            select: function (combo, record) {
                            }//endofselect
                        }
                    },
                ]
            }
        );

        let etc_grid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('etc_grid'),
            collapsible: false,
            multiSelect: false,
            width: 750,
            height: 500,
            autoScroll: true,
            margin: '0 0 20 0',
            autoHeight: true,
            frame: false,
            border: true,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false
            },
            columns: [
                {
                    text: 'LOT 번호',
                    width: '30%',
                    style: 'text-align:center',
                    dataIndex: 'input_lot',
                    name: 'input_lot',
                    editor: 'textfield',
                    sortable: false
                },
                {
                    text: '포장단위',
                    width: '20%',
                    dataIndex: 'packing',
                    editor: 'numberfield',
                    style: 'text-align:center',
                    align: 'right',
                    value: boxPacking,
                    listeners: {},
                    renderer: function (value) {
                        boxPacking = value;
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    sortable: false
                },
                {
                    text: '박스 수량',
                    width: '20%',
                    dataIndex: 'each',
                    editor: 'numberfield',
                    sortable: false,
                    style: 'text-align:center',
                    align: 'right',
                    value: printQuan,
                    renderer: function (value) {
                        printQuan = value;
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '자재 총 수량  ',
                    width: '30%',
                    dataIndex: 'totalQuan',
                    style: 'text-align:center',
                    align: 'right',
                    sortable: false,
                    renderer: function (val, meta, record) {
                        gm.me().setQuanBoxValue();
                        return Ext.util.Format.number(record.get('packing') * record.get('each'), '0,00/i');
                    }
                }
            ],
            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2
            },
            listeners: {},
            dockedItems: [

                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [

                        {
                            xtype: 'textfield',
                            name: 'item_name',
                            fieldLabel: '품명',
                            margin: '0 7 0 7',
                            editable: false,
                            labelWidth: 70,
                            width: 400,
                            allowBlank: false,
                            value: item_name
                        },
                        {
                            text: '+',
                            listeners: [{
                                click: function () {

                                    let store = gu.getCmp('etc_grid').getStore();
                                    let getCount = store.getCount();

                                    store.insert(getCount, new Ext.data.Record({
                                        'packing': store.getAt(getCount - 1).get('packing'),
                                        'each': 1,
                                        'multiple': grQuan,
                                        'totalQuan': grQuan * 1
                                    }));
                                }
                            }]
                        },
                        {
                            text: '-',
                            listeners: [{
                                click: function () {
                                    let record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                                    gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));
                                    gm.me().setQuanBoxValue();
                                }
                            }]
                        },
                        '->',
                        {
                            xtype: 'component',
                            html: '총 입고예정: ' + Ext.util.Format.number(grQuan, '0,00/i')
                        },
                        '-',
                        {
                            xtype: 'component',
                            html: '포장단위: ' + Ext.util.Format.number(finance_rate, '0,00/i')
                        }

                    ]
                }),
                form,

                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    padding: '10 10 10 10',
                    layout: {
                        type: 'hbox',
                        pack: 'end'
                    },
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('totalQuanSum'),
                            html: '총 입고수량: ' + Ext.util.Format.number(0, '0,00/i') + ' / ' +
                                '총 박스수량: ' + Ext.util.Format.number(0, '0,00/i')
                        }

                    ]
                })

            ]
        });

        let comboPrinter = gu.getCmp('printer');
        comboPrinter.store.load(
            function () {
                this.each(function (record) {
                    let system_code = record.get('system_code');
                    if (system_code === '192.168.20.12') {
                        comboPrinter.select(record);
                    }
                });
            }
        );

        let comboLabel = gu.getCmp('print_label');
        comboLabel.store.load(
            function () {
                this.each(function (record) {
                    let system_code = record.get('system_code');
                    if (system_code === 'L100x80') {
                        comboLabel.select(record);
                    }
                });
            }
        );

        let comboWhouse = gu.getCmp('whouseUid');
        comboWhouse.store.load(
            function () {
                this.each(function (record) {
                    let unique_id_long = record.get('unique_id_long');
                    if (unique_id_long === gm.me().grid.getSelectionModel()
                        .getSelection()[0].get('reserved_number1')) {
                        comboWhouse.select(record);
                    }
                });
            }
        );

        if (finance_rate === 0 || finance_rate === 1 || finance_rate < 0) {
            gu.getCmp('etc_grid').getStore().insert(0, new Ext.data.Record({
                'each': 1, 'packing': grQuan, 'multiple': grQuan, 'totalQuan': grQuan
            }));
        } else {

            let divNum = parseInt(grQuan / finance_rate); //몫
            let resNum = grQuan - divNum * finance_rate;

            if (divNum > 0) {
                gu.getCmp('etc_grid').getStore().insert(0, new Ext.data.Record({
                    'each': divNum,
                    'packing': finance_rate,
                    'multiple': divNum * finance_rate,
                    'totalQuan': divNum * finance_rate
                }));
            }

            if (resNum > 0) {
                gu.getCmp('etc_grid').getStore().insert(1, new Ext.data.Record({
                    'each': 1,
                    'packing': resNum,
                    'multiple': grQuan - (divNum * finance_rate),
                    'totalQuan': grQuan - (divNum * finance_rate)
                }));
            }
        }

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '입고확인',
            width: 770,
            height: 500,
            plain: true,
            items: [etc_grid],
            overflowY: 'scroll',
            buttons: [{
                text: '입고확인',

                handler: function (btn) {

                    prWin.setLoading(true);

                    let quanArray = []; //포장수량 배열
                    let lotArray = []; //로트 배열
                    let printQuanArray = [];   //출력 매수 배열

                    let isEmptyLot = false;

                    let packingCount = 0;
                    let printCount = 0;
                    let multiple = 0;

                    let store = gu.getCmp('etc_grid').getStore();
                    let totalIndex = store.getCount();

                    for (let i = 0; i < totalIndex; i++) {

                        let vo = store.data.items[i];

                        let packing = vo.get('packing');
                        let each = vo.get('each');
                        let input_lot = vo.get('input_lot');

                        if (input_lot === undefined || input_lot === null || input_lot.length === 0) {
                            isEmptyLot = true;
                            break;
                        }

                        packingCount = packingCount + packing;
                        printCount = printCount + each;
                        multiple = multiple + packing * each;

                        quanArray.push(packing);
                        printQuanArray.push(each);
                        lotArray.push(input_lot);

                    }

                    if (isEmptyLot === true) {
                        Ext.Msg.alert('알림', 'LOT 번호가 공란인 항목이 있습니다.');
                        prWin.setLoading(false);
                    } else if (multiple < grQuan) {
                        Ext.Msg.alert('알림', '입고 예정 수량 보다 적습니다.');
                        prWin.setLoading(false);

                    } else {

                        if (btn === 'no') {
                            prWin.close();

                        } else {

                            let grDate = gu.getCmp('grDate').getValue();

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/quality/wgrast.do?method=createGrIndividual',
                                timeout: 120000,
                                params: {
                                    cartmapUid: cartmapUid,
                                    grReason: gu.getCmp('grReason').getValue(),
                                    printIpAddress: gu.getCmp('printer').getValue(),
                                    labelSize: gu.getCmp('print_label').getValue(),
                                    grDate: grDate,
                                    whouseUid: gu.getCmp('whouseUid').getValue(),
                                    quanArray: quanArray,
                                    lotArray: lotArray,
                                    printQuanArray: printQuanArray
                                },
                                success: function () {
                                    //Ext.Msg.alert('알림', '입고가 완료 되었습니다.');
                                    gm.me().store.load();

                                    if (prWin) {
                                        prWin.close();
                                    }
                                },
                                failure: function () {

                                    gm.me().store.load();

                                    if (prWin) {
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }   //else 끝
                }
            },
                {
                    text: '취소',
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    }
                }]
        });
        prWin.show();
    },

    setQuanBoxValue: function (grid) {

        let totalQuanSum = gu.getCmp('totalQuanSum');

        let store = gu.getCmp('etc_grid').getStore();

        let sumQuan = 0;
        let sumBox = 0;

        for (let i = 0; i < store.getCount(); i++) {
            let packing = store.getAt(i).get('packing');
            let each = store.getAt(i).get('each');

            sumQuan += packing * each;
            sumBox += each;
        }

        totalQuanSum.setHtml('총 입고수량: ' + Ext.util.Format.number(sumQuan, '0,00/i') + ' / ' +
            '총 박스수량: ' + Ext.util.Format.number(sumBox, '0,00/i'));

        if (grid != null) {
            grid.getStore().getProxy().setExtraParam('grQuan', sumQuan);
            grid.getStore().load();
        }
    },
    selCheckOnly: false,
    selAllowDeselect: true,
    nextRow: false
});
