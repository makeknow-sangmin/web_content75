Ext.define('Rfx2.view.company.mjcm.purStock.HEAVY4_WearingStateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'wearing-view',
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = true;

        //검색툴바 필드 초기화
        this.initSearchField();

        // this.addSearchField({
        //     field_id: 'date_type',
        //     store: 'DatetypeStore',
        //     displayField: 'codeName',
        //     valueField: 'systemCode',
        //     innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        // });
        //
        this.addSearchField({
            type: 'dateRange',
            field_id: 'gr_date',
            text: "입고일자",
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('seller_name');
        this.addSearchField('specification');
        this.addSearchField('gr_no');
        this.addSearchField('po_no');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        var searchToolbar = this.createSearchToolbar();

        var option = {};
        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.bioprotech.WearingState',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            pageSize: gMain.pageSize, /*pageSize*/
        }, {});

        for (var i = 0; i < this.columns.length; i++) {
            var o = this.columns[i];
            //console_logs('this.columns' + i, o);
            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'po_qty':
                case 'gr_qty':
                case 'sales_price':
                case 'gr_amount_Hj':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        value = Ext.util.Format.number(value, '0,00/i');
                        value = '<font style="font-weight: bold; font-size:10pt; color:#000000;">' + value + '</font>'
                        return value;
                    };
                    break;
                default:
                    break;
            }

        }

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.setRowClass(function (record, index) {
            var uid_srccst = record.get('uid_srccst');
            var change_reason = record.get('change_reason');
            console_logs('===dasdas', change_reason);
            if (uid_srccst != null && uid_srccst != undefined && uid_srccst > 1) {
                if (change_reason == '') {
                    return 'green-row';
                }
                var len = change_reason.split(',').length;
                for (var i = 0; i < len; i++) {
                    var s = change_reason.split(',')[i];
                    console_logs('===ss', s);
                    if (s == 'G') {
                        return 'yellow-row';
                        break;
                    } else {
                        return 'green-row';
                    }
                }

            }
        });

        //그리드 생성
        var arr = [];

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //arr.push(buttonToolbar3);


        //입고 취소 Action 생성
        this.removeGoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Goods_receipt_cancellation', '입고 취소'),
            tooltip: '입고 취소',
            disabled: true,
            handler: function () {
                gm.me().treatremoveGo();

            }//handler end...

        });


        //구매자재 입고 포장별 바코드 출력 생성
        this.createGoodsIn = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '자재 입고 바코드',
            tooltip: '자재 입고 바코드',
            disabled: true,
            handler: function () {

                // selections 교체

                var selections = gm.me().gridWearingState.getSelection();

                var uniqueIdArr = [];
                var bararr = [];

                var cartmap_uid_array = [];
                var srcahd_uid_array = [];
                var item_code_uid_array = [];
                var item_name_uid_array = [];
                var po_no_arr = [];
                var pj_uids = [];
                var gr_quan_arr = [];
                var pcs_desc_arr = [];

                var countPlus = 0;

                var productLotArray = [];
                var lotNoSelect = [];

                var specArr = [];
                var lotinPut = null;
                //포장수량(바코드 수량과 1대1)
                var gr_Qty = null;
                var areaCode = null;


                for (var i = 0; i < selections.length; i++) {

                    var rec = selections[i];
                    console_logs('rec', rec);
                    var uid = rec.get('unique_id');  //rtgast unique_id???
                    var item_code = rec.get('item_code');
                    var item_name = rec.get('item_name');
                    var specification = rec.get('specification');
                    var lot_no = rec.get('pcs_desc_group_assy');
                    var lotinPut = rec.get('pcs_desc_group_assy');

                    specArr.push(specification);


                    var bar_spec = item_code + '|' + item_name + '|' + specification;
                    var srcahd_uid = rec.get('srcahd_uid');

                    var GrQuan = rec.get('gr_qty');
                    var pcs_desc_group_assy = rec.get('pcs_desc_group_assy');

                    pcs_desc_arr.push(pcs_desc_group_assy);
                    gr_quan_arr.push(GrQuan);

                    uniqueIdArr.push(uid);
                    bararr.push(bar_spec);
                    cartmap_uid_array.push(uid);
                    srcahd_uid_array.push(srcahd_uid);

                    console_logs('srcahd_uid 출력 >>> ' + srcahd_uid);

                    gr_Qty = rec.get(('gr_qty'));
                    console_logs('입고수량 gr_Qty 출력 >>> ' + gr_Qty);
                    areaCode = rec.get(('area_code'));

                    console_logs('areaCode 출력 >>> ' + areaCode);

                    item_code_uid_array.push(item_code);
                    item_name_uid_array.push(item_name);
                    productLotArray.push(lot_no);

                }
                //셀렉션 붙임 끝

                var boxPacking = null;

                var printQuan = null;

                var barcodeForm = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    frame: false,
                    border: false,
                    autoScroll: true,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'vbox',
                    width: 500,
                    height: 250,
                    items: [
                        {
                            xtype: 'container',
                            width: '100%',
                            defaults: {
                                width: '90%',
                                padding: '3 3 3 3',
                            },
                            border: true,
                            layout: 'column',
                            items: [
                                {
                                    fieldLabel: '프린터',
                                    labelWidth: 80,
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
                                    labelWidth: 80,
                                    xtype: 'combo',
                                    margin: '5 5 5 5',
                                    id: gu.id('print_label'),
                                    name: 'labelSize',
                                    store: Ext.create('Mplm.store.PrintLabelStore'),
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    emptyText: '라벨 선택',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'print_qty',
                                    fieldLabel: '품명',
                                    margin: '5 5 5 5',
                                    editable: false,
                                    labelWidth: 80,
                                    allowBlank: false,
                                    value: item_name,
                                    maxlength: '1',
                                }
                            ],
                        }
                    ]
                });

                // var etc_grid = Ext.create('Ext.grid.Panel', {
                //     store: new Ext.data.Store(),
                //     cls: 'rfx-panel',
                //     id: gu.id('etc_grid'),
                //     collapsible: false,
                //     multiSelect: false,
                //     width: 750,
                //     height: 500,
                //     autoScroll: true,
                //     margin: '0 0 20 0',
                //     autoHeight: true,
                //     frame: false,
                //     border: true,
                //     layout: 'fit',
                //     forceFit: true,
                //     columns: [
                //         {
                //             id: gu.id('countVale'),
                //             text: '포장수량 ' + gr_Qty,
                //             width: '20%',
                //             dataIndex: 'packing',
                //             editor: 'numberfield',
                //             value: gr_Qty,
                //             editable: false,
                //             listeners: {},
                //             renderer: function (gr_Qty) {
                //                 return gr_Qty;
                //             },
                //             value: boxPacking,
                //             sortable: false
                //         },
                //         {
                //             text: '출력 매수',
                //             width: '20%',
                //             dataIndex: 'each',
                //             //editor: 'textfield',
                //             editor: 'numberfield',
                //             sortable: false,
                //
                //             renderer: function (value) {
                //
                //                 console_logs(' 렌더 value   ', value);
                //
                //                 gm.me().vprintQuan = value;
                //                 printQuan = gm.me().vprintQuan;
                //
                //                 return value;
                //             },
                //
                //             value: printQuan,
                //
                //         },
                //         {
                //             text: '출력 자재 총 수량  ',
                //             width: '30%',
                //
                //             dataIndex: 'each',
                //             editor: 'numberfield',
                //             sortable: false,
                //
                //             renderer: function (value) {
                //                 return printQuan * boxPacking;
                //             }
                //         },
                //         {
                //             text: '제품 Lot ',
                //             width: '30%',
                //             id: gu.id('SaleGoodsLotNumber'),
                //             dataIndex: 'input_lot',
                //             name: 'input_lot',
                //             editor: 'textfield',
                //             sortable: false,
                //             value: areaCode,
                //
                //             renderer: function (value) {
                //                 return areaCode;
                //
                //             }
                //         },
                //     ],
                //     selModel: 'cellmodel',
                //     plugins: {
                //         ptype: 'cellediting',
                //         clicksToEdit: 2,
                //     },
                //     listeners: {
                //
                //         click: function () {
                //
                //         }
                //     },
                //     autoScroll: true,
                //     dockedItems: [
                //         //여기부터
                //         Ext.create('Ext.form.Panel', {
                //                 xtype: 'form',
                //                 frame: false,
                //                 border: false,
                //                 bodyPadding: 10,
                //                 region: 'center',
                //                 layout: 'form',
                //                 autoScroll: true,
                //                 fieldDefaults: {
                //                     labelAlign: 'right',
                //                     msgTarget: 'side'
                //                 },
                //
                //             }
                //         ),
                //
                //
                //     ]
                // });

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
                    title: '제품 바코드 출력  ',
                    width: 500,
                    height: 250,
                    plain: true,
                    items: barcodeForm,
                    // overflowY: 'scroll',
                    buttons: [{
                        text: '바코드 출력',

                        handler: function (btn) {

                            var wdSelection = gm.me().gridWearingState.getSelectionModel().getSelection();

                            var totalIndex = wdSelection.length;

                            var packingTotal = [];
                            var printTotal = [];

                            var packingCount = 0;
                            var printCount = 0;
                            var multiple = 0;

                            var intputLotno = [];

                            var quanArray = []; //포장수량 배열
                            var lotArray = []; //로트 배열
                            var printQuanArray = [];   //출력 매수 배열
                            var packingArray = [];

                            for (i = 0; i < totalIndex; i++) {

                                var rec = wdSelection[i];

                                var packing = rec.get('gr_qty');
                                var printQuan = 1;
                                var input_lot = rec.get('area_code');

                                quanArray.push(packing);
                                printQuanArray.push(printQuan);
                                lotArray.push(input_lot);
                            }

                            if (btn == 'no') {
                                prWin.close();

                            } else {

                                if (printQuanArray == null || printQuanArray.length == 0) {
                                    gm.me().showToast('오류', "출력할 항목을 추가하세요.");
                                    return;
                                }

                                var printIpAddress = gu.getCmp('printer').getValue();
                                var labelSize = gu.getCmp('print_label').getValue();

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBioT',

                                    params: {

                                        print_type: 'EACH',
                                        countPlus: printQuan,
                                        print_qty: printQuan,
                                        printIpAddress: printIpAddress,
                                        labelSize: labelSize,
                                        lotrtgastUids: uniqueIdArr,
                                        barcodes: bararr,
                                        lot_no: lot_no,
                                        cartmap_uid_list: cartmap_uid_array,
                                        srcahd_uid_list: srcahd_uid_array,
                                        item_code_uid_list: item_code_uid_array,
                                        item_name_uid_list: item_name_uid_array,
                                        gr_quan_list: gr_quan_arr,
                                        pcs_desc_list: pcs_desc_arr,
                                        labelType: 'order',
                                        quanArray: quanArray,
                                        printQuanArray: printQuanArray,
                                        lotArray: lotArray,
                                        specArr: specArr
                                    },


                                    success: function (result, request) {

                                        var s = result.responseText;
                                        try {
                                            var jsonData = Ext.decode(s);
                                            console_logs('jsonData', jsonData);
                                            var error = jsonData.error;
                                            console_logs('error', error);
                                            if (error != null && error.length > 0) {
                                                console_logs('오류', error);
                                                gm.me().showToast('오류', error);
                                                return;
                                            }

                                        } catch (e) {
                                        }

                                        prWin.close();

                                    },
                                    failure: extjsUtil.failureMessage
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
            },

            //gm.me().printBarcode();

        });


        this.wearingDetailStore = Ext.create('Rfx2.store.company.bioprotech.WearingDetail', {});

        this.gridWearingState = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractCompany'),
            store: this.wearingDetailStore,
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
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.wearingDetailStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다."
                , listeners: {
                    beforechange: function (page, currentPage) {
                    }
                }

            }),
            border: true,
            layout: 'fit',
            forceFit: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.createGoodsIn,
                        this.removeGoAction
                    ]
                }
            ],
            columns: [
                {text: 'LOT NO', width: 80, style: 'text-align:center', dataIndex: 'area_code', sortable: false},
                {
                    text: '입고수량', width: 80, style: 'text-align:center', dataIndex: 'gr_qty', sortable: false,
                    renderer: function (value, meta) {
                        if (value != null) {
                            value = Ext.util.Format.number(value, '0,00/i');
                        } else {
                            value = 0;
                        }
                        return value;
                    }
                },
                {text: '바코드', width: 150, style: 'text-align:center', dataIndex: 'unique_id', sortable: false}
            ],
            title: '상세',
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                }
            }
        });


        //grid 생성.
        this.createGrid(arr);
        //this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    //title: '제품 및 템플릿 선택',
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '65%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, this.gridWearingState
            ]
        });


        this.setAllMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.load(function () {
                });
            }
        });
        this.setSaMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '원자재',
            tooltip: '원자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'RAW';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'S');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSubMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '부자재',
            tooltip: '부자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'B');
                gm.me().store.load(function () {
                });
            }
        });
        this.setMROView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'MRO',
            tooltip: 'MRO',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'M');
                gm.me().store.load(function () {
                });
            }
        });
        this.setUsedMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '상품',
            tooltip: '상품',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'P');
                gm.me().store.load(function () {
                });
            }
        });

        this.printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '수입검사성적서PDF',
            disabled: true,
            handler: function (widget, event) {
                var rec = gm.me().grid.getSelectionModel().getSelection();

                var wgrast_uids = [];

                for (var i = 0; i < rec.length; i++) {
                    wgrast_uids.push(rec[i].getId());
                }

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printRi',
                    params: {
                        wgrast_uids: wgrast_uids,
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'Y'
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


            }
        });

        this.fileAttach = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '성적서 첨부',
            disabled: true,
            handler: function (widget, event) {
                gm.me().attachFile();
            }
        });


        //버튼 추가.
        // buttonToolbar.insert(5, '-');
        // buttonToolbar.insert(5, this.setUsedMatView);
        // buttonToolbar.insert(5, this.setMROView);
        // buttonToolbar.insert(5, this.setSubMatView);
        // buttonToolbar.insert(5, this.setSaMatView);
        // buttonToolbar.insert(5, this.setAllMatView)


        //buttonToolbar.insert(1, this.removeGoAction);
        //buttonToolbar.insert(1, '-');

        //buttonToolbar.insert(3, this.createGoodsIn);
        //buttonToolbar.insert(3, '-');


        this.callParent(arguments);

        this.gridWearingState.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections != null && selections.length > 0) {

                    gm.me().wgrast_uids = [];
                    gm.me().arrGrqty = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec1 = selections[i];
                        var uids = rec1.get('id');
                        var gr_qty = rec1.get('gr_qty');
                        gm.me().arrGrqty.push(gr_qty);
                        gm.me().wgrast_uids.push(uids);
                    }

                    var rec = selections[0];
                    //console_logs('rec', rec);
                    gm.me().rec = rec;
                    gm.me().cartmapuid = rec.get('id');

                    gm.me().removeGoAction.enable();
                    gm.me().createGoodsIn.enable();
                } else {

                    gm.me().wgrast_uids = [];
                    gm.me().arrGrqty = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec1 = selections[i];
                        var uids = rec1.get('id');
                        var gr_qty = rec1.get('gr_qty');
                        gm.me().arrGrqty.push(gr_qty);
                        gm.me().wgrast_uids.push(uids);
                    }

                    gm.me().removeGoAction.disable();
                    gm.me().createGoodsIn.disable();
                }
            }
        });

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length) {

                gm.me().fileAttach.enable();
                gm.me().printPDFAction.enable();
                var rec = selections[0];
                var gr_no = rec.get('gr_no');
                gm.me().gridWearingState.getStore().getProxy().setExtraParam('gr_no', gr_no);
                gm.me().gridWearingState.getStore().loadPage(1);

            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;

                gm.me().fileAttach.disable();
                gm.me().printPDFAction.disable();

            }

        })
        //디폴트 로드
        gm.setCenterLoading(false);
        this.store.load(function (records) {
            var total_price_sum = 0;
            var total_qty = 0;
            for (var i = 0; i < gm.me().store.data.items.length; i++) {
                var t_rec = gm.me().store.data.items[i];
                total_price_sum += t_rec.get('gr_amount_Hj');
                total_qty += t_rec.get('curGr_qty');
            }
        });

    },
    items: [],
    arrGrqty: [],
    wgrast_uids: [],
    poviewType: 'ALL',
    treatremoveGo: function () {
        Ext.MessageBox.show({
            title: '입고 취소',
            multiline: true,
            msg: '입고 취소 사유',
            buttons: Ext.MessageBox.YESNO,
            fn: gm.me().deleteConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    },
    deleteConfirm: function (btn, text) {

        if (btn != 'yes') {
            return;
        }
        var unique_ids = gm.me().wgrast_uids;
        var arrGrqty = gm.me().arrGrqty;
        console_logs('uid', unique_ids);
        console_logs('arrGrqty', arrGrqty);
        console_logs('text', text);

        gm.me().setLoading(true);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/quality/wgrast.do?method=destroy',
            params: {
                arrGrqty: arrGrqty
                , cancel_reason: text
                , unique_ids: unique_ids
            },
            success: function (result, request) {
                gm.me().showToast('결과', unique_ids.length + ' 건을 입고 취소하었습니다.');
                gm.me().getStore().load();
                gm.me().gridWearingState.getStore().load();
                gm.me().setLoading(false);
            },
            failure: extjsUtil.failureMessage
        });
    },


    attachFileView: function () {
        var fieldPohistory = [
            {name: 'account_code', type: "string"},
            {name: 'account_name', type: "string"},
            {name: 'po_no', type: "string"},
            {name: 'po_date', type: "string"},
            {name: 'seller_code', type: "string"},
            {name: 'seller_name', type: "string"},
            {name: 'sales_price', type: "string"},
            {name: 'pr_qty', type: "string"}
        ];


        var selections = gm.me().grid.getSelectionModel().getSelection();
        console_logs('===>attachFileView', selections);
        if (selections != null && selections.length > 0) {
            var unique_id_long = selections[0].get('coord_key3');

            gm.me().attachedFileStore.getProxy().setExtraParam('group_code', unique_id_long);
            gm.me().attachedFileStore.load(function (records) {

                console_logs('attachedFileStore records', records);
                if (records != null) {
                    var o = gu.getCmp('file_quan');
                    if (o != null) {
                        o.update('총수량 : ' + records.length);
                    }

                }
            });

            var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});

            var fileGrid = Ext.create('Ext.grid.Panel', {
                title: '첨부',
                store: gm.me().attachedFileStore,
                collapsible: true,
                layout: 'fit',
                multiSelect: true,
                selModel: selFilegrid,
                stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

                ],
                columns: [
                    {
                        text: 'UID',
                        width: 100,
                        sortable: true,
                        dataIndex: 'id'
                    },
                    {
                        text: '파일명',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'object_name'
                    },
                    {
                        text: '파일유형',
                        width: 70,
                        sortable: true,
                        dataIndex: 'file_ext'
                    },
                    {
                        text: '날짜',
                        width: 160,
                        sortable: true,
                        dataIndex: 'create_date'
                    },
                    {
                        text: 'size',
                        width: 100,
                        sortable: true,
                        xtype: 'numbercolumn',
                        format: '0,000',
                        style: 'text-align:right',
                        align: 'right',
                        dataIndex: 'file_size'
                    }]
            });

            var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: '첨부파일',
                width: 1200,
                height: 600,
                items: fileGrid,
                buttons: [
                    {
                        text: CMD_OK,
                        //scope:this,
                        handler: function () {
                            if (prWin) {
                                prWin.close();
                            }
                        }
                    }
                ]
            })
            prWin.show();
        }
    },


    //바코드 출력

    printBarcode: function () {

        //var selections = selected_rec;
        var selections = gm.me().gridWearingState.getSelectionModel().getSelection();

        //var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;

        var uniqueIdArr = [];
        var item_name = '';

        var item_name_Arr = [];
        var compare_Arr = [];
        var uniqueIdArr = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');  //Srcahd unique_id
            item_name = rec.get('item_name');
            uniqueIdArr.push(uid);
            item_name_Arr.push(item_name);
            compare_Arr.push(item_name);
        }

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
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


        });//Panel end...

        //원본
        // if (uniqueIdArr.length > 0) {
        //     prwin = gMain.selPanel.prbarcodeopen(form);
        // }


        var compare = [];
        var checkCompare = 0;

        for (var i = 0; i < item_name_Arr.length; i++) {
            for (var j = 0; j < compare_Arr.length; j++) {
                if (item_name_Arr[i] == compare_Arr[j]) {
                } else {
                    checkCompare = j + j;
                }
            }
        }

        console_logs('checkCompare 비교 값   >>>', checkCompare);

        if (uniqueIdArr.length > 0) {
            if (checkCompare > 0) {
                Ext.Msg.alert('안내', '동일한 품명을 선택해주세요', function () {
                });

            }
            if (checkCompare == 0) {
                //prwin = gMain.selPanel.prbarcodeopen(form);
                //prwin = gMain.selPanel.barcodeModal(form);

            }
        }

    },

    // 바코드 모달


    barcodeModal: function (form) {

        //셀렉션붙임 시작
        //var selections = gm.me().gridWearingState.getSelectionModel().getSelection();
        var selections = gm.me().gridWearingState.getSelection();

        var uniqueIdArr = [];
        var bararr = [];

        var cartmap_uid_array = [];
        var srcahd_uid_array = [];
        var item_code_uid_array = [];
        var item_name_uid_array = [];
        var po_no_arr = [];
        var pj_uids = [];
        var gr_quan_arr = [];
        var pcs_desc_arr = [];


        var countPlus = 0;

        var productLotArray = [];
        var lotNoSelect = [];

        var specArr = [];

        var lotinPut = null;
        var area_Array = [];


        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            console_logs('rec', rec);
            var uid = rec.get('unique_id');  //rtgast unique_id???
            var item_code = rec.get('item_code');
            var item_name = rec.get('item_name');
            var specification = rec.get('specification');
            //var lot_no = rec.get('lot_no');

            //이전 로트넘버
            //var lot_no = rec.get('pcs_desc_group_assy');

            var lot_no = rec.get('area_code');

            var lotinPut = rec.get('pcs_desc_group_assy');

            var area_code = rec.get('area_code');
            specArr.push(specification);

            console_logs('area_code  >>>2346346  ', area_code);


            var bar_spec = item_code + '|' + item_name + '|' + specification;
            var srcahd_uid = rec.get('srcahd_uid');


            //var GrQuan = rec.get(('gr_quan'));
            var GrQuan = rec.get(('pr_qty'));
            var pcs_desc_group_assy = rec.get('pcs_desc_group_assy');

            // srcahd.finance_rate,
            //  srcahd.cost_qty,

            pcs_desc_arr.push(pcs_desc_group_assy);
            gr_quan_arr.push(GrQuan);

            uniqueIdArr.push(uid);
            bararr.push(bar_spec);
            cartmap_uid_array.push(uid);
            srcahd_uid_array.push(srcahd_uid);

            item_code_uid_array.push(item_code);
            item_name_uid_array.push(item_name);
            productLotArray.push(lot_no);
            area_Array.push(area_code);

        }
        //셀렉션 붙임 끝


        var boxPacking = null;

        var printQuan = null;

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
            columns: [
                {
                    id: gu.id('countVale'),
                    text: '포장수량 설정',
                    width: '20%',
                    dataIndex: 'packing',
                    editor: 'numberfield',
                    listeners: {},
                    renderer: function (value) {
                        gm.me().vEachValueee = value;
                        boxPacking = gm.me().vEachValueee;
                        console_logs('  boxPacking 첫번째 ', boxPacking);
                        return value;
                    },
                    value: boxPacking,
                    sortable: false
                },
                {
                    text: '출력 매수',
                    width: '20%',
                    dataIndex: 'each',
                    editor: 'numberfield',
                    sortable: false,
                    renderer: function (value) {

                        console_logs(' 렌더 value   ', value);

                        gm.me().vprintQuan = value;
                        printQuan = gm.me().vprintQuan;

                        return value;
                    },

                    value: printQuan,

                },
                {
                    text: '출력 자재 총 수량  ',
                    width: '30%',

                    dataIndex: 'each',
                    editor: 'numberfield',
                    sortable: false,

                    renderer: function (value) {
                        //console_logs(' ' , );

                        return printQuan * boxPacking;

                        //return value * 5;
                    }
                },

                {
                    text: '제품 Lot ',
                    width: '30%',
                    id: gu.id('SaleGoodsLotNumber'),

                    //dataIndex: 'supplyerLot',
                    dataIndex: 'input_lot',
                    name: 'input_lot',
                    editable: false,

                    editor: 'textfield',
                    sortable: false,
                    //value: lotinPut,
                    value: areaCode,

                    renderer: function (value) {
                        return areaCode;
                        //return lotinPut;

                    }
                },
            ],
            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                //clicksToEdit: 2,
                clicksToEdit: 3,
            },
            listeners: {

                click: function () {

                }
            },
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
                            xtype: 'textfield',
                            name: 'print_qty',
                            fieldLabel: '품명',
                            margin: '0 7 0 7',
                            editable: false,
                            width: 200,
                            allowBlank: false,
                            value: item_name,
                            maxlength: '1',
                        },

                        {
                            text: '+',
                            listeners: [{
                                click: function () {

                                    // var store = gu.getCmp('etc_grid').getStore();

                                    //  store.insert(store.getCount(), new Ext.data.Record({
                                    //      'packing': '0', 'each': '0'
                                    //  }));

                                    var store = gu.getCmp('etc_grid').getStore();
                                    var getCount = store.getCount();

                                    console_logs('item index >> ', getCount);

                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'packing': '0', 'each': '0'
                                    }));

                                    var obj = gu.getCmp('countVale');
                                    var grValue = obj['value'];

                                    console_logs('연산한 값 3333>>>>', grValue);

                                    countPlus = countPlus + 1;
                                    //console_logs('countPlus 출력 >>>> ', countPlus);

                                }
                            }]
                        },

                        {
                            text: '-',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                                    gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));
                                }
                            }]
                        },

                    ]
                }),

                //여기부터

                Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    frame: false,
                    border: false,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'form',
                    autoScroll: true,
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    }
                })
            ]
        });

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '제품 바코드 출력  ',
            width: 770,
            height: 500,
            plain: true,
            items: etc_grid,
            overflowY: 'scroll',
            buttons: [{
                text: '바코드 출력',

                handler: function (btn) {

                    var store = gu.getCmp('etc_grid').getStore();
                    var totalIndex = store.getCount();

                    var packingTotal = [];
                    var printTotal = [];

                    var packingCount = 0;
                    var printCount = 0;
                    var multiple = 0;

                    var intputLotno = [];


                    var quanArray = []; //포장수량 배열
                    var lotArray = []; //로트 배열
                    var printQuanArray = [];   //출력 매수 배열


                    for (i = 0; i < totalIndex; i++) {
                        packingCount = packingCount + store.data.items[i].get('packing');
                        printCount = printCount + store.data.items[i].get('each');
                        multiple = multiple + store.data.items[i].get('packing') * store.data.items[i].get('each');
                        intputLotno = multiple + store.data.items[i].get('input_lot');


                        var packing = store.data.items[i].get('packing');
                        var each = store.data.items[i].get('each');
                        var input_lot = store.data.items[i].get('input_lot');

                        printCount = printCount + store.data.items[i].get('each');

                        quanArray.push(packing);
                        printQuanArray.push(each);
                        lotArray.push(lot_no);

                    }
                    var LotValue = intputLotno;

                    console_logs('GrQuan 출력 >>', GrQuan);
                    console_logs('LotValue 출력 >>', LotValue);

                    if (multiple < GrQuan) {
                        Ext.Msg.alert('알림', '입고 예정 수량 보다 적습니다.');

                    } else {

                        var objs = [];
                        var columns = [];
                        var obj = {};
                        var store = gu.getCmp('etc_grid').getStore();

                        //cnt는 상관없음
                        //var cnt = store.getCount();

                        var packingArr = [];
                        var packingArray = [];

                        var each = 0;
                        Boolean = true;
                        var sumQty = 0;

                        sumQty = printQuan * boxPacking;

                        console_logs('printQuan  >>>>>>>>  ', printQuan);
                        console_logs('boxPacking  >>>>>>>>  ', boxPacking);

                        //console_logs(' productLotArray >>> 새로 >>>'  + productLotArray);
                        for (var x = 0; x < sumQty; x++) {
                            //리스트별로 포장수량 입력
                            packingArray.push(boxPacking);
                        }

                        if (btn == 'no') {
                            prWin.close();

                        } else {

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBioT',
                                params: {
                                    print_type: 'EACH',
                                    countPlus: printQuan,
                                    print_qty: printQuan,
                                    packingArr: packingArray,
                                    lotrtgastUids: uniqueIdArr,
                                    barcodes: bararr,
                                    lot_no: lot_no,
                                    cartmap_uid_list: cartmap_uid_array,
                                    srcahd_uid_list: srcahd_uid_array,
                                    item_code_uid_list: item_code_uid_array,
                                    item_name_uid_list: item_name_uid_array,
                                    gr_quan_list: gr_quan_arr,
                                    pcs_desc_list: pcs_desc_arr,
                                    input_lot: LotValue,
                                    labelType: 'order',
                                    quanArray: quanArray,
                                    printQuanArray: printQuanArray,
                                    lotArray: lotArray,
                                    specArr: specArr,


                                    input_lot: area_Array,
                                },
                                success: function (result, request) {
                                    prWin.close();
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }

                    }   //else 끝
                }
            },

                , {
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
    },


    uploadComplete: function (items) {

        console_logs('uploadComplete items', items);

        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });

        console_logs('파일업로드 결과', output);

        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('총수량 : ' + records.length);
                }

            }
        });


    },

    attachFile: function () {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('==>zzz', record);

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('총수량 : ' + records.length);
                }

            }
        });

        var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부',
            store: this.attachedFileStore,
            collapsible: true,
            multiSelect: true,
            // hidden : ! this.useDocument,
            selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype: 'button',
                        text: '파일 첨부',
                        scale: 'small',
                        glyph: 'xf0c6@FontAwesome',
                        scope: this.fileGrid,
                        handler: function () {

                            var group_rec = gm.me().grid.getSelectionModel().getSelection();
                            var group_code_list = [];
                            for (var i = 0; i < group_rec.length; i++) {
                                var g = group_rec[i];
                                group_code_list.push(g.get('unique_id_long'));
                            }
                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code_list=' + group_code_list + '&change_reason=' + 'G';

                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous: true
                            });
                            var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일 첨부',
                                panel: uploadPanel
                            });

                            this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {

                                console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                console_logs('this.mon uploadcomplete manager', manager);
                                console_logs('this.mon uploadcomplete items', items);
                                console_logs('this.mon uploadcomplete errorCount', errorCount);

                                gm.me().uploadComplete(items);
                                //if (!errorCount) {
                                uploadDialog.close();
                                //}
                            }, this);

                            uploadDialog.show();
                        }
                    },
                    this.removeActionFile,
                    '-',
                    this.sendFileAction,
                    '-',
                    this.fileRemoveAction,
                    '->',
                    {
                        xtype: 'component',
                        id: gu.id('file_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html: '총수량 : 0'
                    }
                ]
            }

            ],
            columns: [
                {
                    text: 'UID',
                    width: 100,
                    sortable: true,
                    dataIndex: 'id'
                },
                {
                    text: '파일명',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '파일유형',
                    width: 70,
                    sortable: true,
                    dataIndex: 'file_ext'
                },
                {
                    text: '날짜',
                    width: 160,
                    sortable: true,
                    dataIndex: 'create_date'
                },
                {
                    text: 'size',
                    width: 100,
                    sortable: true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:right',
                    align: 'right',
                    dataIndex: 'file_size'
                }]
        });

        this.fileGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections != null && selections.length > 0) {
                    gm.me().fileRemoveAction.enable();
                } else {
                    gm.me().fileRemoveAction.disable();
                }
            }
        })

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/' 첨부파일',
            width: 1300,
            height: 600,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype: 'container',
            plain: true,
            items: [
                this.fileGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }]
        });
        win.show();
    },

    fileRemoveAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        disabled: true,
        handler: function (widget, event) {
            var selections = gm.me().fileGrid.getSelectionModel().getSelection();
            console_logs('===selections', selections);

            var srccst_uids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                srccst_uids.push(rec.get('unique_id'));
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/uploader.do?method=assyMatchFile',
                params: {
                    srcahd_uid: -1,
                    srccst_uids: srccst_uids,
                    type: 'remove'
                },
                success: function () {
                    gm.me().showToast('결과', '성공');
                    gm.me().attachedFileStore.load();
                },
                failure: function () {
                    gm.me().showToast('결과', '실패');
                }
            });
        }
    }),

    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),

    excelDownBySelect: Ext.create('Ext.Action', {
        iconCls: 'mfglabs-retweet_14_0_5395c4_none',
        text: '엑셀다운',
        tooltip: '엑셀다운',
        disabled: false,
        handler: function () {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var unique_ids = [];
            for (var i = 0; i < selections.length; i++) {
                unique_ids.push(selections[i].get('unique_id_long'));
            }
            // console_logs('====ids', unique_ids);
            var excel_store = gm.me().store;
            excel_store.getProxy().setExtraParam('srch_rows', 'all');
            excel_store.getProxy().setExtraParam('srch_type', 'excelPrint');
            excel_store.getProxy().setExtraParam('srch_fields', 'major');
            excel_store.getProxy().setExtraParam('menuCode', gm.me().link);
            excel_store.getProxy().setExtraParam('is_excel', 'Y');
            excel_store.getProxy().setExtraParam('unique_ids', unique_ids);
            excel_store.load({
                callback: function () {
                    gm.me().excelPrintFc();
                }
            });

        }//handler end...

    }),
});




