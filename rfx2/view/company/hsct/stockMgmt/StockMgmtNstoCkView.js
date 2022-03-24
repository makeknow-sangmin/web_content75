Ext.define('Rfx2.view.company.hsct.stockMgmt.StockMgmtNstoCkView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'Stock-pending-view',
    inputBuyer: null,
    preValue: 0,
    selectedWhouseName: null,
    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        this.addSearchField({
            field_id: 'whouse_uid'
            , emptyText: '창고명'
            , width: 200
            , store: "Rfx2.store.company.bioprotech.WarehouseStore"
            , displayField: 'wh_name'
            , valueField: 'unique_id'
            , autoLoad: true
            , innerTpl: '<div data-qtip="{unique_id}">{wh_name}</div>'
        });

        this.addSearchField({
            field_id: 'sg_code'
            , store: "ClaastStorePD"
            , displayField: 'class_name'
            , valueField: 'class_code'
            , params: {level1: 1, identification_code: "MT"}
            , innerTpl: '<div data-qtip="{system_code}">[{class_code}] {class_name}</div>'
        });


        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');

        this.addCallback('CHECK_SP_CODE', function (combo, record) {

            gm.me().refreshStandard_flag(record);

        });

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var myCartModel = Ext.create('Rfx.model.MyCartLineSrcahdGo', {
            fields: this.fields
        });

        this.warehouseStore = Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {});

        this.warehouseStore.load();

        /** 바코드 재발행 버튼 **/
        this.barcodeReissueAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '재발행',
            tooltip: '바코드 재발행',
            disabled: true,
            handler: function () {
                var selections = gm.me().detailStockGrid.getSelection();
                var rec = selections[0];

                gm.me().barcodeListStore.getProxy().setExtraParam('srcahd_uid', rec.get('uid_srcahd'));
                gm.me().barcodeListStore.getProxy().setExtraParam('lot_no', rec.get('lot_no'));
                gm.me().barcodeListStore.getProxy().setExtraParam('stodtl_uid', rec.get('unique_id_long'));
                gm.me().barcodeListStore.load();

                var barcodeListForm = Ext.create('Ext.grid.Panel', {
                    cls: 'rfx-panel',
                    store: gm.me().barcodeListStore,
                    autoScroll: true,
                    autoHeight: true,
                    collapsible: false,
                    overflowY: 'scroll',
                    multiSelect: false,
                    width: '99%',
                    title: '재발행할 바코드를 선택하십시오.',
                    autoScroll: true,
                    margin: '0 0 0 0',
                    autoHeight: true,
                    frame: false,
                    border: false,
                    id: gu.id('barcodeList'),
                    layout: 'fit',
                    forceFit: true,
                    selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                    viewConfig: {
                        markDirty: false
                    },
                    columns: [
                        {
                            text: 'Barcode',
                            width: '50%',
                            dataIndex: 'barcode',
                            style: 'text-align:center',
                            valueField: 'no',
                            typeAhead: false,
                            allowBlank: false,
                            sortable: true,
                        },
                        {
                            text: 'LOT NO',
                            width: '50%',
                            dataIndex: 'lot_no',
                            style: 'text-align:center',
                            valueField: 'no',
                            typeAhead: false,
                            allowBlank: false,
                            sortable: true,
                        },
                        {
                            text: '포장수량',
                            width: '50%',
                            dataIndex: 'packing_quan',
                            style: 'text-align:center',
                            valueField: 'no',
                            typeAhead: false,
                            allowBlank: false,
                            sortable: true,
                        }

                    ],
                    listeners: {},
                    autoScroll: true,
                });

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: 500,
                    height: 300,
                    overflowY: 'scroll',
                    multiSelect: false,
                    bodyPadding: '3 3 0',
                    region: 'center',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    defaults: {
                        anchor: '100%',
                        labelWidth: 60,
                        margins: 10,
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            broder: false,
                            collapsible: false,
                            defaults: {
                                labelWidth: 60,
                                anchor: '100%',
                                layout: {
                                    type: 'hbox',
                                    defaultMargins: {top: 100, right: 5, bottom: 0, left: 0}
                                }
                            },
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    combineErrors: true,
                                    msgTarget: 'side',
                                    layout: 'vbox',
                                    items: [
                                        {
                                            fieldLabel: '프린터',
                                            labelWidth: 150,
                                            xtype: 'combo',
                                            margin: '5 5 5 5',
                                            id: gu.id('printer'),
                                            name: 'printIpAddress',
                                            store: Ext.create('Mplm.store.PrinterStore'),
                                            displayField: 'code_name_kr',
                                            valueField: 'system_code',
                                            emptyText: '프린터 선택',
                                            allowBlank: false
                                        },
                                        {
                                            fieldLabel: '프린트 라벨',
                                            labelWidth: 150,
                                            xtype: 'combo',
                                            margin: '5 5 5 5',
                                            id: gu.id('print_label'),
                                            name: 'labelSize',
                                            store: Ext.create('Mplm.store.PrintLabelStore'),
                                            displayField: 'code_name_kr',
                                            valueField: 'system_code',
                                            emptyText: '라벨 선택',
                                            allowBlank: false
                                        }
                                    ]
                                }
                            ]
                        }, barcodeListForm
                    ]
                });

                var comboPrinter = gu.getCmp('printer');
                comboPrinter.store.load(
                    function () {
                        this.each(function (record) {
                            var system_code = record.get('system_code');
                            if (system_code == '192.168.20.11') {
                                comboPrinter.select(record);
                            }
                        });
                    }
                );

                var comboLabel = gu.getCmp('print_label');
                comboLabel.store.load(
                    function () {
                        this.each(function (record) {
                            var system_code = record.get('system_code');
                            if (system_code == 'L100x80') {
                                comboLabel.select(record);
                            }
                        });
                    }
                );


                prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '바코드 출력  ',
                    width: 500,
                    height: 380,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: '바코드 출력',

                        handler: function (btn) {

                            var barcodeSelection = gu.getCmp('barcodeList').getSelectionModel().getSelected().items;

                            var barcode_list = [];

                            for (var i = 0; i < barcodeSelection.length; i++) {
                                var rec = barcodeSelection[i];
                                var barcode = rec.get('barcode');

                                barcode_list.push(barcode);
                            }

                            if (btn == 'no') {
                                prWin.close();
                            } else {
                                prWin.setLoading(true);

                                var printIpAddress = gu.getCmp('printer').getValue();
                                var labelSize = gu.getCmp('print_label').getValue();

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBiotNewVer',
                                    params: {
                                        barcode_type: 'WGRAST',
                                        printIpAddress: printIpAddress,
                                        labelSize: labelSize,
                                        barcode_list: barcode_list,
                                        gr_date_list: " ",
                                        ischeck: 'Y',
                                    },

                                    success: function (result, request) {
                                        Ext.Msg.alert('', '바코드 프린터 출력 요청을 성공하였습니다.');
                                        prWin.setLoading(false);
                                        prWin.close();
                                    },

                                    failure: function (result, request) {
                                        Ext.Msg.alert('오류', '바코드 프린터 출력 요청을 실패하였습니다.</br>바코드 프린터 상태를 확인하시기 바랍니다.');
                                        prWin.setLoading(false);
                                    }
                                });

                            }
                        }
                    }, {
                        text: '취소',
                        handler: function () {
                            if (prWin) {
                                prWin.close();
                            }
                        }
                    }
                    ]
                });
                prWin.show();


            }
        });

        this.addGoodsMoveAction = Ext.create('Ext.Action', {
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '창고이동요청',
            tooltip: '자재의 창고를 이동 요청합니다',
            hidden: gu.setCustomBtnHiddenProp('addGoodsMoveAction'),
            disabled: true,
            handler: function () {

                var barcodeStore = Ext.create('Rfx2.store.company.bioprotech.BarcodeStockStore', {});

                var barcodeGrid = Ext.create('Ext.grid.Panel', {
                    store: barcodeStore,
                    cls: 'rfx-panel',
                    id: gu.id('barcodeGrid'),
                    collapsible: false,
                    multiSelect: false,
                    width: 550,
                    height: 300,
                    margin: '0 0 20 0',
                    viewConfig: {
                        markDirty: false
                    },
                    autoHeight: true,
                    selModel: 'checkboxmodel',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 1
                    },
                    frame: false,
                    border: true,
                    forceFit: true,
                    columns: [
                        {text: '바코드번호', width: 120, dataIndex: 'barcode', style: 'text-align:center', sortable: false},
                        {text: 'LOT No.', width: 130, dataIndex: 'lot_no', style: 'text-align:center', sortable: false},
                        {
                            text: '포장수량', width: 120, dataIndex: 'gr_quan', sortable: false,
                            style: 'text-align:center',
                            align: 'right',
                            renderer: renderDecimalNumber
                        }
                    ],
                    listeners: {
                        selectionchange: function (grid, selected, eOpts) {

                            var quan = 0;
                            var lblGridResult = gu.getCmp('lblGridResult');

                            for (var i = 0; i < selected.length; i++) {
                                var grQuan = selected[i].get('gr_quan');
                                quan += grQuan;
                            }

                            if (selected.length == 0) {
                                lblGridResult.setHtml('<b>바코드를 선택하시기 바랍니다.</b>');
                            } else {
                                lblGridResult.setHtml('<b>출고 수량 : ' + renderDecimalNumber(quan) + '</b>');
                            }
                        },
                        edit: function (editor, e, eOpts) {

                            var selection = gu.getCmp('barcodeGrid').getSelectionModel().getSelection();

                            var quan = 0;
                            var lblGridResult = gu.getCmp('lblGridResult');

                            for (var i = 0; i < selection.length; i++) {
                                var grQuan = selection[i].get('gr_quan');
                                quan += grQuan;
                            }

                            if (selection.length == 0) {
                                lblGridResult.setHtml('<b>바코드를 선택하시기 바랍니다.</b>');
                            } else {
                                lblGridResult.setHtml('<b>출고 수량 : ' + renderDecimalNumber(quan) + '</b>');
                            }
                        }
                    }
                });

                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var rec_second = gm.me().detailStockGrid.getSelectionModel().getSelection()[0];

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    bodyPadding: 10,
                    width: '100%',
                    items: [{
                        xtype: 'fieldset',
                        collapsible: false,
                        title: gm.me().getMC('msg_order_dia_header_title', '공통정보'),
                        width: '100%',
                        style: 'padding:10px',
                        defaults: {
                            labelStyle: 'padding:10px',
                            anchor: '100%',
                            layout: {
                                type: 'column'
                            }
                        },
                        items: [
                            {
                                xtype: 'container',
                                width: '100%',
                                border: true,
                                layout: {
                                    type: 'vbox'
                                },
                                defaultMargins: {
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 10
                                },
                                items: [
                                    {
                                        xtype: 'hiddenfield',
                                        id: gu.id('unique_id_long'),
                                        name: 'unique_id_long',
                                        hidden: true,
                                        value: rec_second.get('unique_id_long')
                                    },
                                    {
                                        fieldLabel: '현재창고',
                                        xtype: 'textfield',
                                        id: gu.id('wh_name'),
                                        width: 550,
                                        name: 'wh_name',
                                        value: rec.get('wh_name'),
                                        flex: 1,
                                        readOnly: true,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                    },
                                    {
                                        fieldLabel: '대상창고',
                                        xtype: 'combo',
                                        width: 550,
                                        name: 'whouse_uid',
                                        mode: 'local',
                                        store: Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {}),
                                        displayField: 'wh_name',
                                        valueField: 'unique_id_long',
                                        emptyText: '선택',
                                        sortInfo: {field: 'systemCode', direction: 'DESC'},
                                        typeAhead: false,
                                        minChars: 1,
                                        listConfig: {
                                            loadingText: '검색중...',
                                            emptyText: '일치하는 항목 없음.',
                                            getInnerTpl: function () {
                                                return '<div>[{wh_code}] {wh_name}</div>';
                                            }
                                        },
                                        listeners: {
                                            select: function (combo, record) {
                                                gm.me().selectedWhouseName = record.get('wh_name');
                                            }
                                        }
                                    },
                                    {
                                        fieldLabel: '이동요청 날짜',
                                        xtype: 'datefield',
                                        width: 550,
                                        id: gu.id('reserved_timestamp1'),
                                        name: 'reserved_timestamp1',
                                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        format: 'Y-m-d',
                                        value: new Date()
                                    }
                                ]
                            }
                        ]
                    },
                        {
                            xtype: 'fieldset',
                            frame: true,
                            width: '100%',
                            height: '100%',
                            layout: 'fit',
                            bodyPadding: 10,
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items: [
                                {
                                    id: gu.id('lblGridResult'),
                                    xtype: 'label',
                                    html: '',
                                    result: false
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            frame: true,
                            title: '바코드 리스트',
                            width: '100%',
                            height: '100%',
                            layout: 'fit',
                            bodyPadding: 10,
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items: [
                                barcodeGrid
                            ]
                        }
                    ]
                });

                var myWidth = 600;
                var myHeight = 620;

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '바코드로 창고이동요청을 실행합니다.',
                    width: myWidth,
                    height: myHeight,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: '출고 실행',
                        handler: function (btn) {

                            if (form.isValid()) {
                                var val = form.getValues(false);
                                console_logs('form val', val);

                                if (val['wh_name'] === gm.me().selectedWhouseName) {
                                    Ext.Msg.alert('경고', '창고가 동일하여 요청할 수 없습니다.');
                                } else {
                                    gm.me().addStockMove(prWin, val);
                                }

                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }
                    },
                        {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }]
                });
                prWin.show();

                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var stodtlRec = gm.me().detailStockGrid.getSelectionModel().getSelection()[0];

                var srcahd_uid = rec.get('uid_srcahd'); // 이동하려는 품목
                var goCategory = rec.get('reserved_varchar4'); //출고 유형
                var comcst_uid = rec.get('whouse_comcst_uid'); //SITE
                var stodtl_uid = stodtlRec.get('unique_id_long');

                barcodeStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                barcodeStore.getProxy().setExtraParam('stodtl_uid', stodtl_uid);
                barcodeStore.getProxy().setExtraParam('comcst_uid', comcst_uid);
                barcodeStore.load(function (record) {

                    var lblGridResult = gu.getCmp('lblGridResult');
                    if (record.length == 0) {
                        lblGridResult.setHtml('<b>바코드가 존재하지 않습니다.</b>');
                        lblGridResult.result = false;
                    } else {
                        lblGridResult.setHtml('<b>바코드를 선택하시기 바랍니다.</b>');

                        for (var i = 0; i < record.length; i++) {
                            record[i].set('gr_quan_confirm', /*record[i].get('gr_quan')*/0);
                        }
                    }
                });
            }
        });


        this.addGoodsinAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '임의입고 ',
            tooltip: '자재를 임의로 입고합니다',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('addGoodsinAction'),
            handler: function () {

                var selections = gm.me().grid.getSelectionModel().getSelection();
                var boxPacking = null;
                var printQuan = null;

                console_logs('selections', selections);


                if (selections.length > 0) {

                    var rec = selections[0];
                    var finance_rate = rec.get('finance_rate');
                    var locationStore = Ext.create('Rfx2.store.company.bioprotech.WhouseLocationStore', {pageSize: 100});
                    locationStore.getProxy().setExtraParam('whouse_uid', rec.get('whouse_uid'));
                    locationStore.load();


                    var barcodeGridTwo = Ext.create('Ext.grid.Panel', {
                        store: new Ext.data.Store(),
                        cls: 'rfx-panel',
                        id: gu.id('barcodeWareTwoGrid'),
                        collapsible: false,
                        multiSelect: false,
                        width: 450,
                        height: 200,
                        autoScroll: true,
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
                                text: 'LOT No',
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
                                renderer: function (val, meta, record, rowIndex) {
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
                        autoScroll: true,
                        dockedItems: [
                            Ext.create('widget.toolbar', {
                                plugins: {
                                    boxreorderer: false
                                },
                                cls: 'my-x-toolbar-default2',
                                margin: '0 0 0 0',
                                items: [
                                    '->',
                                    {
                                        text: '추가',
                                        listeners: [{
                                            click: function () {
                                                var grQuan = gu.getCmp('wh_qty').getValue();
                                                console_logs('>>>> grQuan', grQuan);
                                                if (grQuan === null || grQuan <= 0) {
                                                    Ext.MessageBox.alert('알림', '총 입고수량이 입력되지 않았습니다.')
                                                } else {
                                                    if (finance_rate == 0 || finance_rate == 1 || finance_rate < 0) {
                                                        gu.getCmp('barcodeWareTwoGrid').getStore().insert(0, new Ext.data.Record({
                                                            'each': 1,
                                                            'packing': grQuan,
                                                            'multiple': grQuan,
                                                            'totalQuan': grQuan
                                                        }));
                                                    } else {

                                                        var divNum = parseInt(grQuan / finance_rate); //몫
                                                        var resNum = grQuan - divNum * finance_rate;
                                                        console_logs('grQuan', grQuan);
                                                        console_logs('divNum', divNum);
                                                        console_logs('resNum', resNum);
                                                        if (divNum > 0) {
                                                            gu.getCmp('barcodeWareTwoGrid').getStore().insert(0, new Ext.data.Record({
                                                                'each': divNum,
                                                                'packing': finance_rate,
                                                                'multiple': divNum * finance_rate,
                                                                'totalQuan': divNum * finance_rate
                                                            }));
                                                        }


                                                        if (resNum > 0) {
                                                            gu.getCmp('barcodeWareTwoGrid').getStore().insert(1, new Ext.data.Record({
                                                                'each': 1,
                                                                'packing': resNum,
                                                                'multiple': grQuan - (divNum * finance_rate),
                                                                'totalQuan': grQuan - (divNum * finance_rate)
                                                            }));
                                                        }
                                                    }
                                                }

                                            }
                                        }]
                                    },
                                    {
                                        text: '삭제',
                                        listeners: [{
                                            click: function () {
                                                var record = gu.getCmp('barcodeWareTwoGrid').getSelectionModel().getSelected().items[0];
                                                gu.getCmp('barcodeWareTwoGrid').getStore().removeAt(gu.getCmp('barcodeWareTwoGrid').getStore().indexOf(record));
                                            }
                                        }]
                                    }

                                ]
                            })
                        ]
                    });

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 60
                        },
                        items: [
                            {
                                fieldLabel: gm.me().getColName('whouse_uid'),
                                xtype: 'textfield',
                                id: gu.id('whouse_uid'),
                                name: 'whouse_uid',
                                emptyText: '창고UID',
                                hidden: true,
                                value: rec.get('whouse_uid'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                hidden: true,
                                value: rec.get('uid_srcahd'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                value: rec.get('item_code'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                value: rec.get('item_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'item_name',
                                value: rec.get('specification'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('maker_name'),
                                xtype: 'textfield',
                                id: gu.id('maker_name'),
                                name: 'maker_name',
                                value: rec.get('maker_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('wh_name'),
                                xtype: 'textfield',
                                id: gu.id('wh_name'),
                                name: 'wh_name',
                                value: rec.get('wh_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                id: gu.id('location'),
                                name: 'location',
                                fieldLabel: 'Location 지정',
                                xtype: 'combo',
                                width: '99%',
                                allowBlank: false,
                                store: locationStore,
                                emptyText: '선택해주세요.',
                                displayField: 'class_name',
                                valueField: 'unique_id',
                                value: rec.get('basic_location_uid'),
                                typeAhead: false,
                                minChars: 1,
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{class_name}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {

                                    }// endofselect
                                }
                            },
                            {
                                fieldLabel: '입고수량',
                                xtype: 'numberfield',
                                minValue: 0,
                                width: 100,
                                id: gu.id('wh_qty'),
                                name: 'wh_qty',
                                allowBlank: false,
                                value: '1',
                                margins: '5'
                            },
                            {
                                xtype: 'fieldset',
                                border: false,
                                title: '<b>입고수량을 입력 후 아래 추가 버튼을 클릭하여<br>LOT번호, 포장단위, 박스수량을 입력하여 입고처리를 실행하십시오.</b>',
                                items: [
                                    barcodeGridTwo
                                ]
                            }
                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '자재 입고',
                        width: 500,
                        height: 600,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    var store = gu.getCmp('barcodeWareTwoGrid').getStore();

                                    Ext.MessageBox.show({
                                        title: '창고 반입',
                                        msg: '창고로 반입하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (btn) {
                                            if (btn == 'yes') {
                                                var isEmptyLot = false;
                                                var whouse_uid = val['whouse_uid'];
                                                var in_qty = val['wh_qty'];
                                                var location = val['location'];
                                                var uid_srcahd = rec.get('uid_srcahd');
                                                if (uid_srcahd === -1) {
                                                    Ext.MessageBox.alert('알림', '자재가 선택되지 않았습니다.');

                                                } else {
                                                    var totalIndex = store.getCount();
                                                    console_logs('>>>> totalIndex', totalIndex);

                                                    if (totalIndex > 0) {

                                                        var packingCount = 0;
                                                        var printCount = 0;
                                                        var multiple = 0;

                                                        var lotArray = [];
                                                        var quanArray = []; //포장수량 배열
                                                        var printQuanArray = [];   //출력 매수 배열

                                                        for (var i = 0; i < totalIndex; i++) {
                                                            var vo = store.data.items[i];
                                                            var packing = vo.get('packing');
                                                            var each = vo.get('each');
                                                            var input_lot = vo.get('input_lot');
                                                            if (input_lot == undefined || input_lot == null || (input_lot.replace(/(\s*)/g, "")).length === 0) {
                                                                isEmptyLot = true;
                                                                console_logs('isEmptyLot', isEmptyLot);
                                                                break;
                                                            } else {
                                                                lotArray.push(input_lot);
                                                                quanArray.push(packing);
                                                                printQuanArray.push(each);
                                                            }

                                                            packingCount = packingCount + packing;
                                                            printCount = printCount + each;
                                                            multiple = multiple + packing * each;
                                                        }

                                                        if (isEmptyLot == true) {
                                                            Ext.MessageBox.alert('알림', 'LOT 번호가 공란인 항목이 있습니다.');

                                                        } else if (multiple < in_qty || multiple > in_qty) {
                                                            Ext.MessageBox.alert('알림', '입고 예정 수량 보다 크거나 작습니다.');

                                                        } else {
                                                            Ext.Ajax.request({
                                                                url: CONTEXT_PATH + '/inventory/prchStock.do?method=noNstockMaterialStockWhouse',
                                                                params: {
                                                                    whouse_uid: whouse_uid,
                                                                    in_qty: in_qty,
                                                                    srcahd_uid: uid_srcahd,
                                                                    location: location,
                                                                    lotArray: lotArray,
                                                                    quanArray: quanArray,
                                                                    printQuanArray: printQuanArray
                                                                },
                                                                success: function (result, request) {
                                                                    var resultText = result.responseText;
                                                                    console_log('result:' + resultText);
                                                                    if (winPart) {
                                                                        if (resultText === 'dupplicate') {
                                                                            Ext.MessageBox.alert('알림', '입력한 LOT번호가 중복이 발생되었습니다.<br>다시 확인해주세요.');
                                                                        } else if (resultText === 'fail') {
                                                                            Ext.MessageBox.alert('알림', '입고요청을 실시했으나 실패처리 되었습니다.');
                                                                        } else if (resultText === 'success') {
                                                                            Ext.MessageBox.alert('알림', '완료처리 되었습니다.');
                                                                        }
                                                                        winPart.close();
                                                                    }
                                                                    gm.me().getStore().load(function () {
                                                                    });
                                                                },
                                                                failure: extjsUtil.failureMessage
                                                            });//endof ajax request
                                                        }
                                                    } else {
                                                        Ext.MessageBox.alert('알림', '바코드를 생성하는 정보가 입력되지 않았습니다.');

                                                    }
                                                }
                                            }
                                        },
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                } // endofhandler
            }
        });

        // 창고 출고
        this.addGoodOutAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '임의출고',
            hidden: gu.setCustomBtnHiddenProp('addGoodOutAction'),
            tooltip: '자재를 임의로 출고합니다',
            disabled: true,
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var selections_two = gm.me().detailStockGrid.getSelectionModel().getSelection();
                console_logs('selections', selections);
                if (selections.length > 0) {
                    var rec = selections[0];
                    var rec_two = selections_two[0];
                    if (rec.get('whouse_uid') == 1) {
                        Ext.MessageBox.alert('알림', '이동중인 재고는 출고처리가 불가합니다.');

                    } else {
                        var form = Ext.create('Ext.form.Panel', {
                            xtype: 'form',
                            width: 500,
                            bodyPadding: 15,
                            layout: {
                                type: 'vbox',
                                align: 'stretch' // Child items are stretched to full width
                            },
                            defaults: {
                                allowBlank: true,
                                msgTarget: 'side',
                                labelWidth: 60
                            },
                            items: [

                                {
                                    fieldLabel: gm.me().getColName('unique_id'),
                                    xtype: 'textfield',
                                    id: gu.id('unique_id_out'),
                                    name: 'unique_id',
                                    emptyText: '자재 UID',
                                    hidden: true,
                                    value: rec_two.get('unique_id'),
                                    flex: 1,
                                    readOnly: true,
                                    fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                },
                                {
                                    fieldLabel: gm.me().getColName('item_code'),
                                    xtype: 'textfield',
                                    id: gu.id('item_code_out'),
                                    name: 'item_code',
                                    value: rec.get('item_code'),
                                    flex: 1,
                                    readOnly: true,
                                    fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                },
                                {
                                    fieldLabel: gm.me().getColName('item_name'),
                                    xtype: 'textfield',
                                    id: gu.id('item_name_out'),
                                    name: 'item_name',
                                    value: rec.get('item_name'),
                                    flex: 1,
                                    readOnly: true,
                                    fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                }, {
                                    fieldLabel: gm.me().getColName('specification'),
                                    xtype: 'textfield',
                                    id: gu.id('specification_out'),
                                    name: 'item_name',
                                    value: rec.get('specification'),
                                    flex: 1,
                                    readOnly: true,
                                    fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                }, {
                                    fieldLabel: gm.me().getColName('maker_name'),
                                    xtype: 'textfield',
                                    id: gu.id('maker_name_out'),
                                    name: 'maker_name',
                                    value: rec.get('maker_name'),
                                    flex: 1,
                                    readOnly: true,
                                    fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                },
                                {
                                    fieldLabel: '사유',
                                    xtype: 'combo',
                                    anchor: '100%',
                                    name: 'reason_text',
                                    mode: 'local',
                                    store: Ext.create('Rfx.store.GeneralCodeStore', {
                                        hasNull: false,
                                        parentCode: 'RELEASE_CODE'
                                    }),
                                    displayField: 'codeName',
                                    valueField: 'systemCode',
                                    emptyText: '선택',
                                    sortInfo: {field: 'systemCode', direction: 'DESC'},
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig: {
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음.',
                                        getInnerTpl: function () {
                                            return '<div>[{systemCode}] {codeName}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {

                                        }
                                    }
                                },
                                {
                                    xtype: 'datefield',
                                    anchor: '100%',
                                    fieldLabel: '일자',
                                    name: 'gr_date',
                                    format: 'Y-m-d',
                                    allowBlank: false,
                                    value: ''
                                },
                                {
                                    fieldLabel: '수량',
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    width: 100,
                                    id: gu.id('wh_qty_out'),
                                    name: 'wh_qty',
                                    allowBlank: true,
                                    value: '1',
                                    margins: '5'
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: '비고',
                                    name: 'etc',
                                    allowBlank: true,
                                    value: ''
                                }
                            ]
                        });

                        var loadMask = new Ext.LoadMask({
                            msg: '데이터를 처리중입니다.',
                            target: form
                        });

                        var winPart = Ext.create('ModalWindow', {
                            title: '임의출고를 시행합니다.',
                            width: 500,
                            height: 400,
                            items: form,
                            buttons: [{
                                text: CMD_OK,
                                handler: function () {
                                    if (form.isValid()) {

                                        var out_qty = gu.getCmp('wh_qty_out').getValue();

                                        loadMask.show();
                                        form.submit({
                                            url: CONTEXT_PATH + '/index/process.do?method=releaseProductDirectBarcodefifo',
                                            params: {
                                                srcahd_uid: rec.get('uid_srcahd'),
                                                stodtl_uid: rec_two.get('unique_id'),
                                                gr_quan: out_qty
                                            },
                                            success: function (val, action) {
                                                winPart.close();
                                                gm.me().store.load();
                                                gm.me().detailStockGrid.getStore().load();
                                            },
                                            failure: function (val, action) {
                                                winPart.close();
                                                gm.me().store.load();
                                            }
                                        });
                                    }
                                }
                            }, {
                                text: CMD_CANCEL,
                                handler: function () {
                                    if (winPart) {
                                        winPart.close();
                                    }
                                }
                            }]
                        });
                        winPart.show(/* this, function(){} */);
                    }
                } // endofhandler
            }
        });

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    buttonToolbar.items.remove(item);
                    break;
                default:
                    break;
            }
        });

        this.createStore('Rfx2.model.company.bioprotech.NstoCkMgmt', [{
                property: 'item_code',
                direction: 'ASC'
            }],
            gm.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['srcahd']
        );

        var arr = [];
        buttonToolbar.insert(1, this.addGoodsinAction);
        buttonToolbar.insert(1, '-');

        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdDetailForShipmentStore', {});

        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractCompany'),
            store: this.poPrdDetailStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            margin: '0 0 0 0',

            columns: [
                {text: '일자', width: 100, style: 'text-align:center', dataIndex: 'pl_no', sortable: false},
                {
                    text: this.getMC('msg_order_grid_prd_fam', '구분'),
                    width: 65,
                    style: 'text-align:center',
                    dataIndex: 'class_code',
                    sortable: false
                },
                {
                    text: this.getMC('msg_order_grid_prd_name', '계획번호'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'item_name',
                    sortable: false
                },
                {
                    text: this.getMC('msg_order_grid_prd_desc', '소요/입고량'),
                    width: 95,
                    style: 'text-align:center',
                    dataIndex: 'description',
                    sortable: false
                },
                {
                    text: '가용수량', width: 95, style: 'text-align:center', dataIndex: 'ap_Wquan', align: 'right',
                    editor: 'numberfield',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '비고', width: 120, style: 'text-align:center', dataIndex: 'ap_quan', align: 'right',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                }
            ],
            title: this.getMC('mes_reg_prd_info_msg', '소요량 정보'),
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                }
            }
        });

        Ext.each(this.gridContractCompany.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {

            }
            switch (dataIndex) {

            }
        });

        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {

                } else {

                }
            }
        });

        this.setRowClass(function (record, index) {
            var stock_qty = record.get('stock_qty');
            var stock_qty_safe = record.get('stock_qty_safe');
            if (stock_qty <= stock_qty_safe) {
                return 'red-row';
            }
        });

        //grid 생성.
        this.createGrid(arr);

        // 재고상세
        this.detailStockGrid = Ext.create('Ext.grid.Panel', {
            store: Ext.create('Rfx2.store.company.bioprotech.DetailStockStore'),
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            layout: 'fit',
            height: 300,
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    style: 'background-color: #EFEFEF;',
                    items: [
                        '->',
                        this.addGoodsMoveAction,
                        this.addGoodOutAction,
                        this.barcodeReissueAction,
                    ]
                }
            ],
            columns: [
                {
                    text: 'UID',
                    width: 100,
                    align: 'center',
                    style: 'text-align:center',
                    dataIndex: 'unique_id',
                    hidden: true
                },
                {text: 'LOT NO', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'lot_no'},
                {
                    text: '수량',
                    width: 150,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'dtl_qty',
                    sortable: false,
                    renderer: function (value, meta) {
                        return value == null ? 0 : Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {text: '단위', width: 80, align: 'left', style: 'text-align:center', dataIndex: 'unit_code'},
                {text: '위치', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'location'},
            ],
            name: 'detailStock',
            autoScroll: true,
            listeners: {
                select: function (dv, record) {
                    var rec = record.data;
                    gm.me().readOptionfactor(rec.unique_id);
                }
            }

        });

        this.detailStockGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                console_logs('>>>>>>> rec', selections);
                if (selections.length) {
                    gm.me().addGoodsMoveAction.enable();
                    gm.me().addGoodOutAction.enable();
                    gm.me().barcodeReissueAction.enable();
                } else {
                    gm.me().addGoodsMoveAction.disable();
                    gm.me().addGoodOutAction.disable();
                    gm.me().barcodeReissueAction.disable();
                }
            }
        });

        // 이동현황 정병준
        this.propProduceStore = Ext.create('Rfx2.store.company.bioprotech.PropProduceStore'/*, { pageSize: 100 }*/);
        this.moveStockGrid = Ext.create('Ext.grid.Panel', {
            store: this.propProduceStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            // region: 'center',
            layout: 'fit',
            flex: 0,
            forceFit: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {text: '투입수량', width: 140, align: 'right', style: 'text-align:center', dataIndex: 'move_qty'},
                {text: '작업지시번호', width: 140, align: 'right', style: 'text-align:center', dataIndex: 'po_no'},
                {text: '생산지시번호', width: 140, align: 'right', style: 'text-align:center', dataIndex: 'pr_no'},
                {text: '고객사이름', width: 140, align: 'center', style: 'text-align:center', dataIndex: 'wa_name'},
            ],
            name: 'capa',
            autoScroll: true,
        });
        // 이동현황 정병준


        var myPanel = Ext.create('Ext.form.Panel', {
            title: '재고상세',
            layout: {type: 'vbox', pack: 'start', align: 'stretch'},
            border: true,
            frame: true,
            width: "50%",
            minWidth: 200,
            height: "100%",
            region: 'east',
            resizable: true,
            scroll: false,
            tabPosition: 'top',
            collapsible: false,
            autoScroll: true,
            items: [
                this.detailStockGrid,
                this.moveStockGrid
            ]
        });


        //라인투입
        //this.allocStockStore = Ext.create('Rfx2.store.company.bioprotech.AllocStockStore');
        this.allocStockGrid = Ext.create('Ext.grid.Panel', {
            store: Ext.create('Rfx2.store.company.bioprotech.AllocStockStore'),
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {text: '수주번호', width: 120, align: 'right', style: 'text-align:center', dataIndex: 'pj_code'},
                {text: '단위', width: 80, align: 'center', style: 'text-align:center', dataIndex: 'unit_code'},
                {
                    text: '투입수량',
                    width: 120,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'alloc_qty',
                    sortable: false,
                    renderer: function (value, meta) {
                        if (value != null) {
                            value = Ext.util.Format.number(value, '0,00/i');
                        } else {
                            value = 0;
                        }
                        return value;
                    }
                }
            ],
            name: 'allocStock',
            autoScroll: true
        });

        // 입고현황
        this.inStockGrid = Ext.create('Ext.grid.Panel', {
            store: Ext.create('Rfx2.model.company.bioprotech.DeliveryInfoStore', {pageSize: 100}),
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {text: '입고시간', width: 150, align: 'center', style: 'text-align:center', dataIndex: 'create_date'},
                {text: '입고수량', width: 150, align: 'right', style: 'text-align:center', dataIndex: 'in_qty'},
                {text: '바코드', width: 150, align: 'right', style: 'text-align:center', dataIndex: 'barcode'}
            ],
            name: 'deliveryInfo',
            autoScroll: true
        });

        // 출고현황
        this.productInfoStore = Ext.create('Rfx2.model.company.bioprotech.ProductInfoStore', {pageSize: 100});
        this.outStockGrid = Ext.create('Ext.grid.Panel', {
            store: this.productInfoStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {text: '출고시간', width: 150, align: 'center', style: 'text-align:center', dataIndex: 'create_date'},
                {text: '출고수량', width: 150, align: 'right', style: 'text-align:center', dataIndex: 'out_qty'}
            ],
            name: 'productInfo',
            autoScroll: true
        });

        this.detailInfo = Ext.create('Ext.form.Panel', {
            title: '상세정보',
            layout: 'fit',
            border: true,
            frame: true,
            width: "45%",
            minWidth: 200,
            height: "100%",
            region: 'east',
            resizable: true,
            scroll: false,
            tabPosition: 'top',
            collapsible: false,
            autoScroll: true,
            items: {
                xtype: 'tabpanel',
                border: false,
                fullscreen: true,
                items: [
                    {
                        title: '재고상세',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: this.detailStockGrid
                    }
                ]
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.detailInfo] /*tabPanel*//*this.crudTab*/
        });

        //버튼 추가.
        this.callParent(arguments);

        //grid를 선택했을 때 Callback(기존)
        this.setGridOnCallback(function (selections) {
            console_logs('=====> selections', selections.length);
            if (selections.length) {
                rec = selections[0];
                console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>', rec.get('request_comment'));
                gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
                gm.me().vSELECTED_STOCK_UID = rec.get('stoqty_uid');
                gm.me().addGoodsinAction.enable();
            } else {
                gm.me().printBarcodeAction.disable();
            }

            if (selections.length) {
                var rec = selections[0];
                var wh_code = rec.get('wh_code');
                var item_code = rec.get('item_code');
                var unique_id = rec.get('unique_id');
                var wh_qty = rec.get('wh_qty');
                var unit_mass = rec.get('unit_mass');
                var unit_code = rec.get('unit_code');
                gm.me().detailStockGrid.getStore().getProxy().setExtraParam('nstock_uid', unique_id);
                gm.me().detailStockGrid.getStore().load(function (records) {
                    var sum = 0;
                    if (records != null && records.length > 0) {

                        for (var i = 0; i < records.length; i++) {
                            var r = records[i];
                            sum = sum + r.get('dtl_qty');
                        }
                    }

                    var gap = wh_qty - sum;
                    console_logs('sum', sum);
                    console_logs('wh_qty', wh_qty);
                    console_logs('gap', gap);

                    if (gap != 0) {
                        gm.me().detailStockGrid.getStore().insert(0, new Ext.data.Model({
                            id: -1,
                            unique_id: '-1',
                            unique_id_long: -1,
                            dtl_qty: gap,
                            unit_mass: unit_mass,
                            std_amount: unit_mass * gap,
                            unit_code: unit_code,
                            stock_pos: '<미지정>',
                            lot_no: '<미지정>',
                            barcode: '<미지정>',
                            po_no_od: '<미지정>',
                            po_no_pr: '<미지정>'
                        }));
                    }

                });
                gm.me().propProduceStore.removeAll();

            }

        });


        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('not_sg_code_list', 'CS');
        this.store.load(function (records) {

        });
    },

    // 바코드 목록 불러오는 form
    barcodeListForm: function () {
        var selections = gm.me().detailStockGrid.getSelection();
        var rec = selections[0];

        gm.me().barcodeListStore.getProxy().setExtraParam('srcahd_uid', rec.get('uid_srcahd'));
        gm.me().barcodeListStore.getProxy().setExtraParam('lot_no', rec.get('lot_no'));
        gm.me().barcodeListStore.load();
    },

    // 정병준 
    readOptionfactor: function (unique_id) {
        gm.me().propProduceStore.getProxy().setExtraParam('stodtl_uid', unique_id);
        gm.me().propProduceStore.load();
    },
    // 정병준 

    items: [],
    matType: 'RAW',
    stockviewType: "ALL",
    refreshStandard_flag: function (record) {
        console_logs('val', record);
        var spcode = record.get('systemCode');
        var s_flag = spcode.substring(0, 1);
        console_logs('spcode', s_flag);


        var target = this.getInputTarget('standard_flag');
        target.setValue(s_flag);

    },
    isExistMyCart: function (inId) {
        console_logs('inId--------------------------------', inId);
        //        	 STOQTY_UID == INID
        var bEx = false; // Not Exist
        console_logs('inId 직후--------------------------------');
        Ext.Ajax.request({
            async: false, 
            url: CONTEXT_PATH + '/purchase/request.do?method=getMycartByStoqtyUid',
            params: {
                stoqty_uid: inId
            },
            success: function (result, request) {
                console_logs('ajax 안 --------------------------------');
                var result = result.responseText;
                var jsonData = Ext.JSON.decode(result);
                console_logs('jsonData++++++++++++++', jsonData);
                bEx = jsonData.result;
                console_logs('bEx++++++++++++++', bEx);
            },//endofsuccess

        });//endofajax
        return bEx;
    },
    loadStore: function (child) {
        this.store.getProxy().setExtraParam('child', child);
        this.store.load(function (records) {
            console_logs('==== storeLoadCallback records', records);
            console_logs('==== storeLoadCallback store', store);
        });

    },

    prbarcodeopen: function (form) {
        var comboPrinter = gu.getCmp('printer');
        comboPrinter.store.load(
            function () {
                this.each(function (record) {
                    var system_code = record.get('system_code');
                    if (system_code == '192.168.20.11') {
                        comboPrinter.select(record);
                    }
                });
            }
        );

        var comboLabel = gu.getCmp('print_label');
        comboLabel.store.load(
            function () {
                this.each(function (record) {
                    var system_code = record.get('system_code');
                    if (system_code == 'L100x80') {
                        comboLabel.select(record);
                    }
                });
            }
        );
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 출력 매수',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var selections = gm.me().grid.getSelectionModel().getSelection();

                    var uniqueIdArr = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('uid_srcahd');  //Material unique_id
                        uniqueIdArr.push(uid);
                    }

                    var form = gu.getCmp('formPanel').getForm();
                    form.submit({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBioT',
                        params: {
                            unique_ids: uniqueIdArr,
                            labelType: 'carton'
                        },
                        success: function (val, action) {
                            prWin.close();
                            gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                            gm.me().store.load(function () {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            gm.me().store.load(function () {
                            });
                        }
                    });


                }//btn handler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },

    assginMaterial: function () {

        var form = null;
        var mStore = Ext.create('Mplm.store.ProjectStore');

        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            width: 600,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                margins: 10,
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [
                        {
                            fieldLabel: '할당프로젝트',
                            labelWidth: 80,
                            xtype: 'combo',
                            anchor: '100%',
                            name: 'ac_uid_to',
                            mode: 'local',
                            displayField: 'pj_name',
                            store: mStore,
                            sortInfo: {field: 'pj_name', direction: 'DESC'},
                            valueField: 'unique_id',
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{pj_code}] {pj_name}</div>';
                                }
                            }
                        },
                        {
                            fieldLabel: '할당수량',
                            labelWidth: 80,
                            xtype: 'numberfield',
                            name: 'target_qty',
                            width: 150,
                            allowBlank: false
                        }
                    ]
                }
            ]

        });//Panel end...

        var selections = gm.me().grid.getSelectionModel().getSelection();
        var counts = 0;

        var uniqueIdArr = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');  //Srcahd unique_id
            uniqueIdArr.push(uid);
        }

        if (uniqueIdArr.length > 0) {
            prwin = gm.me().assginmaterialopen(form);
        }
    },

    assginmaterialopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '할당 할 프로젝트를 지정하십시오',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var selections = gm.me().grid.getSelectionModel().getSelection();
                    var rec = selections[0];

                    var stoqty_uid = rec.get('unique_id');  //Product unique_id
                    var uid_srcahd = rec.get('uid_srcahd');

                    var form = gu.getCmp('formPanel').getForm();

                    form.submit({
                        url: CONTEXT_PATH + '/purchase/material.do?method=assginMaterial',
                        params: {
                            uid_srcahd: uid_srcahd,
                            stoqty_uid: stoqty_uid
                        },
                        success: function (val, action) {
                            prWin.close();
                            gm.me().showToast('결과', '할당 프로젝트를 지정하였습니다.');
                            gm.me().store.load(function () {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '할당 프로젝트 지정에 실패하였습니다.');
                            gm.me().store.load(function () {
                            });
                        }
                    });


                }//btn handler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }]
        });
        prWin.show();
    },

    withdrawMaterial: function () {
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var rec = selections[0];
        var stoqty_uid = rec.get('unique_id');  //Product unique_id
        //var project_uid = rec.get('pj_uid');
        var uid_srcahd = rec.get('uid_srcahd');
        var target_qty = rec.get('wh_qty');
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=assginMaterial',
            params: {
                stoqty_uid: stoqty_uid,
                ac_uid_to: -1,
                target_qty: target_qty,
                uid_srcahd: uid_srcahd
            },
            success: function (val, action) {
                Ext.Msg.alert('완료', '프로젝트 할당을 해제하였습니다.');
                gm.me().store.load(function () {
                });
            },
            failure: function (val, action) {

            }
        });
    },

    addTabCartLineGridPanel: function (title, menuCode, arg, fc, id) {

        gm.extFieldColumnStore.load({
            params: {menuCode: menuCode},
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                //		    	 setEditPanelTitle();
                if (success == true) {
                    try {
                        this.callBackWorkListCHNG(title, records, arg, fc, id);
                    } catch (e) {
                        console_logs('callBackWorkListCHNG error', e);
                    }
                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });

    },
    callBackWorkListCHNG: function (title, records, arg, fc, id) {
        var gridId = id == null ? this.getGridId() : id;

        var o = gm.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];

        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});
        this.cartLineStore = Ext.create('Rfx.store.StockMtrlStore');
        //this.cartLineStore.getProxy().setExtraParam('rtgastuid', gm.me().vSELECTED_UNIQUE_ID);

        var ClaastStore = Ext.create('Mplm.store.ClaastStore', {});
        ClaastStore.getProxy().setExtraParam('stock_pos', 'ND');

        try {
            Ext.FocusManager.enable({focusFrame: true});
        } catch (e) {
            console_logs('FocusError', e);
        }
        this.cartLineGrid = Ext.create('Ext.grid.Panel', {
            store: this.cartLineStore,
            title: title,
            cls: 'rfx-panel',
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            collapsible: false,
            layout: 'fit',
            //forceFit: true,
            dockedItems: dockedItems,
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            plugins: [cellEditing],
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        id: gu.id('stock_pos'),
                        fieldLabel: '재고선택',
                        width: 200,
                        field_id: 'unique_id_long',
                        allowBlank: true,
                        name: 'stock_pos',
                        xtype: 'combo',
                        emptyText: '재고 위치 검색',
                        anchor: '-5',
                        store: ClaastStore,
                        displayField: 'class_code',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        sortInfo: {
                            field: 'item_code',
                            direction: 'ASC'
                        },
                        minChars: 1,
                        typeAhead: false,
                        hideLabel: true,
                        hideTrigger: true,
                        anchor: '100%',
                        valueField: 'class_code',
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 결과가 없습니다.',
                            // Custom rendering template for each item
                            getInnerTpl: function () {
                                return '<div><a class="search-item">' +
                                    '<font color=#999><small>{unique_id}</small></font> <font color=#333>{class_code}</font><br />' +
                                    '</a></div>';
                            }
                        }//,
                        //pageSize: 10
                    },
                    {
                        xtype: 'button',
                        text: '추가',
                        iconCls: 'af-plus-circle',
                        style: 'margin-left: 3px;',
                        handler: function () {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/index/process.do?method=copystockqty',
                                params: {
                                    stoqty_uid: gm.me().cartLineGrid.getStore().data.items[0].id,
                                    class_code: gu.getCmp('stock_pos').value
                                },
                                success: function (result, request) {
                                    gm.me().cartLineGrid.getStore().load();
                                },
                                failure: function (val, action) {

                                }
                            });
                        }
                    },
                    {
                        xtype: 'button',
                        text: '변경',
                        iconCls: 'af-refresh',
                        style: 'margin-left: 3px;',
                        handler: function () {

                            var cartLineGrid_t = gm.me().cartLineGrid.getStore().data.items;
                            var is_duplicated = false;
                            var selected_stock_pos = gu.getCmp('stock_pos').getValue();
                            var selectionModel = gm.me().cartLineGrid.getSelectionModel().getSelection()[0];

                            if (selected_stock_pos == selectionModel.get('stock_pos')) {
                                is_duplicated = true;
                            } else {
                                for (var i = 0; i < cartLineGrid_t.length; i++) {
                                    if (selected_stock_pos == cartLineGrid_t[i].data.stock_pos) {
                                        is_duplicated = true;
                                    }
                                }
                            }

                            if (is_duplicated) {
                                Ext.Msg.alert('경고', '선택하신 재고 위치는 이미 할당 되어 있습니다.');
                            } else {
                                gm.editAjax('stoqty', 'stock_pos', selected_stock_pos, 'unique_id', selectionModel.getId(), {type: ''});
                                gm.me().cartLineGrid.getStore().load();
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: '삭제',
                        iconCls: 'af-remove',
                        style: 'margin-left: 3px;',
                        handler: function () {
                            var stoqty_uids = [];

                            if (gm.me().selected_rec != null && gm.me().selected_rec.length > 0) {
                                for (var i = 0; i < gm.me().selected_rec.length; i++) {
                                    stoqty_uids.push(gm.me().selected_rec[i].data.id);
                                }
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                                    params: {
                                        DELETE_CLASS: 'stoqty',
                                        uids: stoqty_uids
                                    },
                                    success: function (result, request) {
                                        gm.me().cartLineGrid.getStore().load();
                                    },
                                    failure: function (val, action) {

                                    }
                                });
                            }
                        }
                    }
                ]
            }],
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
                select: function (selModel, record, index, options) {

                },
                itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                    gm.me().downListRecord(record);
                }, //endof itemdblclick
                cellkeydown: function (cartLineGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {

                    }


                }
            },//endof listeners
            columns: columns
        });
        this.cartLineGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gm.me().selected_rec = selections;
            }
        });
        var view = this.cartLineGrid.getView();

        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function (e) {
                var selectionModel = this.cartLineGrid.getSelectionModel();
                var select = 0; // select first if no record is selected
                if (selectionModel.hasSelection()) {
                    select = this.cartLineGrid.getSelectionModel().getSelection()[0].index + 1;
                }
                view.select(select);

            },
            up: function (e) {
                var selectionModel = this.cartLineGrid.getSelectionModel();
                var select = this.cartLineGrid.store.totalCount - 1; // select last element if no record is selected
                if (selectionModel.hasSelection()) {
                    select = this.cartLineGrid.getSelectionModel().getSelection()[0].index - 1;
                }
                view.select(select);

            }
        });

        var tabPanel = Ext.getCmp(gm.geTabPanelId());

        tabPanel.add(this.cartLineGrid);
    },
    prwinopen2: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '재고조사표 작성',
            width: 400,
            height: 100,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var form = gu.getCmp('formPanel').getForm();
                    var result_length = gm.me().store.data.length;
                    var val = form.getValues(false);
                    if (result_length > 0) {
                        var rec = gm.me().grid.getSelectionModel().getSelection();
                        var srcahd_uids = [];

                        for (var i = 0; i < rec.length; i++) {
                            srcahd_uids.push(rec[i].get('uid_srcahd'));
                        }

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/pdf.do?method=printSi',
                            params: {
                                srcahd_uids: srcahd_uids,
                                req_date: val['req_date'],
                                pdfPrint: 'pdfPrint',
                                is_rotate: 'N'
                            },
                            reader: {
                                pdfPath: 'pdfPath'
                            },
                            success: function (result, request) {
                                var jsonData = Ext.JSON.decode(result.responseText);
                                var pdfPath = jsonData.pdfPath;
                                console_log(pdfPath);
                                if (pdfPath.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                                    top.location.href = url;
                                }
                            },
                            failure: extjsUtil.failureMessage
                        });
                    } else {
                        Ext.Msg.alert('경고', '검색 결과가 없는 상태에서 PDF를 출력 할 수 없습니다.');
                    }

                    if (prWin) {
                        prWin.close();
                    }

                }//btn handler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }]
        });
        prWin.show();
    },
    selMode: 'MULTI',
    // selCheckOnly: true, // 그리드에서 데이터만 클릭해도 체크 안되게 하기
    selAllowDeselect: true,
    selected_rec: null,

    addStockIn: function (val) {
        Ext.MessageBox.show({
            title: '창고 반입',
            msg: '창고로 반입하시겠습니까?' + '\r\n 수량: ' + gu.getCmp('wh_qty').getValue(),
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/inventory/prchStock.do?method=optionalPlusMaterialStockWhouse',
                        params: {
                            unique_id: val['unique_id'],
                            barcode: val['unique_id'],
                            stock_pos: '', /*NULL을 넣어야 V2에서 유효재고*/
                            innout_desc: val['innout_desc'],
                            wh_qty: val['wh_qty'],
                            whouse_uid: val['whouse_uid']
                        },

                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().getStore().load(function () {
                            });
                            //alert('finished..');
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    },

    addStockOut: function (val) {
        var wh_qty_out = gu.getCmp('wh_qty_out').getValue();
        console_logs('>>>>> wh_qty_out', wh_qty_out);
        Ext.MessageBox.show({
            title: '창고 반출',
            msg: '창고에서 반출하시겠습니까?' + '\r\n 수량: ' + gu.getCmp('wh_qty_out').getValue(),
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/index/process.do?method=releaseProductDirectByLot',
                        params: {
                            stodtl_uid: val['unique_id'],
                            gr_quan: wh_qty_out,
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().getStore().load(function () {
                            });
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request

                    // Ext.Ajax.request({
                    //     url: CONTEXT_PATH + '/inventory/prchStock.do?method=addQty',
                    //     params: {
                    //         unique_id: val['unique_id'],
                    //         barcode: val['unique_id'],
                    //         stock_pos: val['stock_pos'],
                    //         innout_desc: val['innout_desc'],
                    //         wh_qty: val['wh_qty'] * (-1),
                    //         whouse_uid: 100
                    //     },
                    //     success: function (result, request) {
                    //         var resultText = result.responseText;
                    //         console_log('result:' + resultText);
                    //         gm.me().getStore().load(function () {
                    //         });
                    //     },
                    //     failure: extjsUtil.failureMessage
                    // });//endof ajax request
                }
            },
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    },

    addStockMove: function (winPart, val) {
        Ext.MessageBox.show({
            title: '창고 이동',
            msg: '해당 창고로 이동 요청 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {

                    winPart.setLoading(true);

                    var rec = gu.getCmp('barcodeGrid').getSelectionModel().getSelection();

                    var request_qty_list = [];
                    var barcode_list = [];

                    for (var i = 0; i < rec.length; i++) {
                        request_qty_list.push(rec[i].get('gr_quan'));
                        barcode_list.push(rec[i].get('barcode'));
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/inventory/prchStock.do?method=requestMoveQty',
                        params: {
                            stodtl_uid: val['unique_id_long'],
                            request_qty_list: request_qty_list,
                            whouse_uid: val['whouse_uid'],
                            barcode_list: barcode_list
                        },

                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().getStore().load(function () {
                            });
                            //alert('finished..');
                            if (winPart) {
                                winPart.close();
                            }
                        },
                        failure: function () {
                            extjsUtil.failureMessage();
                            if (winPart) {
                                winPart.close();
                            }
                        }
                    });//endof ajax request
                }
            },
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    },

    barcodeListStore: Ext.create('Rfx2.store.company.bioprotech.BarcodeReissueStore'),
    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchExepOrderStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),
    prdStore: Ext.create('Mplm.store.RecvPoDsmfPoPRD', {}),
    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    PmUserStore: Ext.create('Mplm.store.UserStore', {}),
    payTermsStore: Ext.create('Mplm.store.PaytermStore', {}),
    incotermsStore: Ext.create('Mplm.store.IncotermsStore', {}),
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_NEW_DIVISION'}),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_CONDITION'}),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_TYPE'}),

    searchPrdStore: Ext.create('Mplm.store.MaterialSearchStore', {type: 'PRD'}),
    searchAssyStore: Ext.create('Mplm.store.MaterialSearchStore', {type: 'ASSY'}),

    searchItemStore: Ext.create('Mplm.store.ProductStore', {}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SAMPLE_TYPE'})
});