Ext.require([
    'Ext.ux.CustomSpinner'
]);
Ext.define('Rfx2.view.company.hsct.stockMgmt.HEAVY4_WearingWaitView', {
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

        Ext.each(this.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('===>>>>>dataIndex', dataIndex);
            var qty = 0;
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
        var buttonToolbar = this.createCommandToolbar();

        var buttonToolbar3 = Ext.create('widget.toolbar', {
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                id: gu.id('total_price'),
                style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
                text: '총 입고금액 : '
            }]
        });

        Ext.each(this.columns, function (columnObj, index) {
            var o = columnObj;
            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'stock_qty_safe':
                case 'totalPrice':
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        if (gm.me().store.data.items.length > 0) {
                            var summary = gm.me().store.data.items[0].get('summary');
                            if (summary.length > 0) {
                                var objSummary = Ext.decode(summary);
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

        this.createStoreSimple({
            modelClass: 'Rfx.model.Heavy4WearingWait',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            pageSize: gm.unlimitedPageSize, /*pageSize*/
        }, {
            groupField: 'po_no',
            groupDir: 'DESC'
        });

        for (var i = 0; i < this.columns.length; i++) {
            var o = this.columns[i];
            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'gr_qty':
                case 'notGr_qty':
                case 'curGr_qty':
                case 'sales_price':
                case 'sales_price_local':
                case 'total_price':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        value = Ext.util.Format.number(value, '0,00.##/i');
                        value = '<font style="font-weight: bold; font-size:10pt; color:#000000;">' + value + '</font>'
                        return value;
                    };
                    break;
                default:
                    break;
            }

        }

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);
        //arr.push(buttonToolbar3);


        var option = {
        };

        console_logs('=>push', arr);

        //grid 생성.
        this.createGridCore(arr, option);
        // this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        //합계금액 계산 변경 Action 생성
        this.massAmountAction = Ext.create('Ext.Action', {
            text: '중량계산',
            tooltip: '중량계산',
            disabled: true,
            handler: function () {

                Ext.MessageBox.show({
                    title: '확인',
                    msg: '금액 계산식을 <br/>중량<예><br/>수량<아니오><br/> 로 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        var selections = gm.me().grid.getSelectionModel().getSelection();
                        var unique_ids = [];
                        for (var i = 0; i < selections.length; i++) {
                            var unique_id = selections[i].get('unique_id_long');
                            unique_ids.push(unique_id);
                        }

                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=updateAmountCtrflag',
                                params: {
                                    unique_ids: unique_ids,
                                    ctr_flag: 'M',
                                    unit_code: 'Kg'
                                },
                                success: function (result, request) {
                                    gm.me().showToast('결과', '합계금액 계산식이 총중량*단가 로 변경 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        } else {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=updateAmountCtrflag',
                                params: {
                                    unique_ids: unique_ids,
                                    ctr_flag: 'N',
                                    unit_code: 'EA'
                                },
                                success: function (result, request) {
                                    gm.me().showToast('결과', '합계금액 계산식이 수량*단가 로 변경 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                });

            } //handler end...

        });

        // remove the items

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5
            ) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(5, '-');

        //버튼 추가.

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

        buttonToolbar.insert(1, '-');
        buttonToolbar.insert(1, this.createGrAction);

        this.callParent(arguments);

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
            }
        });

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length) {
                this.cartmap_uids = [];
                this.gr_qtys = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    var curGr_qty = rec1.get('curGr_qty');
                    this.cartmap_uids.push(uids);
                    this.gr_qtys.push(curGr_qty);
                }//endoffor
                console_logs('그리드온 uid', this.cartmap_uids);
                console_logs('그리드온 curGr_qty', this.gr_qtys);

                var rec = selections[0];
                //console_logs('rec', rec);
                gm.me().cartmapuids = this.cartmap_uids;
                gm.me().gr_qtys = this.gr_qtys;
                console_logs('gm.me().cartmapuids>>>>>>>>>>>', gm.me().cartmapuids);
                gm.me().cartmapuid = rec.get('id');
                gm.me().gr_qty = rec.get('curGr_qty');
                gm.me().item_name = rec.get('item_name');
                gm.me().vSELECTED_description = rec.get('description');   // 평량
                gm.me().vSELECTED_remark = rec.get('remark');    // 장
                gm.me().vSELECTED_comment = rec.get('comment1');   // 폭
                gm.me().vSELECTED_quan = rec.get('po_qty');
                gm.me().vSELECTED_spcode = rec.get('sp_code');

                console_logs('그리드 데이터', rec);
                gm.me().createGrAction.enable();
            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().createGrAction.disable();
            }

        });

        this.grid.on('edit', function (editor, e) {

            var field = e.field;
            var gr_qty = gm.me().grid.getSelectionModel().getSelection()[0].get('curGr_qty');

            switch (field) {
                case 'curGr_qty':
                case 'sales_price_local':
                    var selection = gm.me().grid.getSelectionModel().getSelection();
                    var rec = selection[0];

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
            console_logs('>>>>>>>>>********records', records);

            var total_price_sum = 0;
            var total_qty = 0;

            for (var i = 0; i < gm.me().store.data.items.length; i++) {
                var t_rec = gm.me().store.data.items[i];
                total_price_sum += t_rec.get('sales_amount');
                total_qty += t_rec.get('curGr_qty');
            }

            buttonToolbar3.items.items[1].update('총 입고금액 : ' + gu.renderNumber(total_price_sum));
        });

    },
    items: [],
    cartmap_uids: [],
    gr_qtys: [],
    poviewType: 'ALL',

    treatGr: function () {

        var whouseStore = Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {});

        //셀렉션붙임 시작
        var selections = gm.me().grid.getSelectionModel().getSelection();

        if (selections.length > 1) {
            Ext.Msg.alert('경고', '한개의 자재를 선택하시기 바랍니다.');
            return;
        }

        var rec = selections[0];
        var cartmapUid = rec.get('unique_id_long');
        var item_name = rec.get('item_name');
        var grQuan = rec.get('curGr_qty');
        var finance_rate = rec.get('finance_rate');

        //셀렉션 붙임 끝

        var boxPacking = null;

        var printQuan = null;

        var form = Ext.create('Ext.form.Panel', {
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
                        fieldLabel: '입고 창고',
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

        var etc_grid = Ext.create('Ext.grid.Panel', {

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
                    text: '자재 총 수량  ',
                    width: '30%',
                    dataIndex: 'totalQuan',
                    style: 'text-align:center',
                    align: 'right',
                    sortable: false,
                    renderer: function (val, meta, record, rowIndex) {
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
            autoScroll: true,
            dockedItems: [
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
                            html: '총 입고수량: ' + Ext.util.Format.number(0, '0,00/i')
                        }

                    ]
                })

            ]
        });

        var comboPrinter = gu.getCmp('printer');
        comboPrinter.store.load(
            function () {
                this.each(function (record) {
                    var system_code = record.get('system_code');
                    if (system_code == '192.168.20.12') {
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

        var comboWhouse = gu.getCmp('whouseUid');
        comboWhouse.store.load(
            function () {
                this.each(function (record) {
                    var unique_id_long = record.get('unique_id_long');
                    if (unique_id_long == gm.me().grid.getSelectionModel()
                        .getSelection()[0].get('reserved_number1')) {
                        comboWhouse.select(record);
                    }
                });
            }
        );

        console_logs('finance_rate', finance_rate);
        if (finance_rate == 0 || finance_rate == 1 || finance_rate < 0) {
            gu.getCmp('etc_grid').getStore().insert(0, new Ext.data.Record({
                'each': 1, 'packing': grQuan, 'multiple': grQuan, 'totalQuan': grQuan
            }));
        } else {

            var divNum = parseInt(grQuan / finance_rate); //몫
            var resNum = grQuan - divNum * finance_rate;
            console_logs('grQuan', grQuan);
            console_logs('divNum', divNum);
            console_logs('resNum', resNum);
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
            items: etc_grid,
            overflowY: 'scroll',
            buttons: [{
                text: '입고확인',

                handler: function (btn) {

                    prWin.setLoading(true);


                    var packingTotal = [];
                    var printTotal = [];

                    var quanArray = []; //포장수량 배열
                    var lotArray = []; //로트 배열
                    var printQuanArray = [];   //출력 매수 배열

                    var isEmptyLot = false;

                    var packingCount = 0;
                    var printCount = 0;
                    var multiple = 0;

                    var store = gu.getCmp('etc_grid').getStore();
                    var totalIndex = store.getCount();

                    console_logs('totalIndex', totalIndex);

                    for (var i = 0; i < totalIndex; i++) {

                        var vo = store.data.items[i];
                        console_logs('vo', vo);
                        var packing = vo.get('packing');
                        var each = vo.get('each');
                        var input_lot = vo.get('input_lot');

                        console_logs('packing >>', packing);
                        console_logs('each >>', each);
                        console_logs('input_lot >>', input_lot);

                        if (input_lot == undefined || input_lot == null || input_lot.length == 0) {
                            isEmptyLot = true;
                            console_logs('isEmptyLot', isEmptyLot);
                            break;
                        }

                        packingCount = packingCount + packing;
                        printCount = printCount + each;
                        multiple = multiple + packing * each;

                        quanArray.push(packing);
                        printQuanArray.push(each);
                        lotArray.push(input_lot);

                    }


                    console_logs('GrQuan >>', grQuan);
                    console_logs('multiple >>', multiple);

                    if (isEmptyLot == true) {
                        Ext.Msg.alert('알림', 'LOT 번호가 공란인 항목이 있습니다.');
                        prWin.setLoading(false);
                    } else if (multiple < grQuan) {
                        Ext.Msg.alert('알림', '입고 예정 수량 보다 적습니다.');
                        prWin.setLoading(false);

                    } else {

                        var objs = [];
                        var columns = [];
                        var obj = {};
                        var store = gu.getCmp('etc_grid').getStore();

                        var packingArray = [];

                        var each = 0;
                        Boolean = true;
                        var sumQty = 0;

                        sumQty = printQuan * boxPacking;

                        console_logs('printQuan  >>>>>>>>  ', printQuan);
                        console_logs('boxPacking  >>>>>>>>  ', boxPacking);

                        for (var x = 0; x < sumQty; x++) {
                            //리스트별로 포장수량 입력
                            packingArray.push(boxPacking);
                        }

                        if (btn == 'no') {
                            prWin.close();

                        } else {

                            var grDate = gu.getCmp('grDate').getValue();

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

    setQuanBoxValue: function () {

        var totalQuanSum = gu.getCmp('totalQuanSum');

        var store = gu.getCmp('etc_grid').getStore();

        var sumQuan = 0;
        var sumBox = 0;

        for (var i = 0; i < store.getCount(); i++) {
            var packing = store.getAt(i).get('packing');
            var each = store.getAt(i).get('each');

            sumQuan += packing * each;
            sumBox += each;
        }

        totalQuanSum.setHtml('총 입고수량: ' + Ext.util.Format.number(sumQuan, '0,00/i'));

    },

    selCheckOnly: false,
    selAllowDeselect: true,
    nextRow: false

});
