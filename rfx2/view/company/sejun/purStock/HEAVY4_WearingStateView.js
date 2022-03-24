Ext.require([
    'Ext.ux.CustomSpinner'
]);
Ext.define('Rfx2.view.company.sejun.purStock.HEAVY4_WearingStateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'wearing-view',
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = true;

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            field_id: 'date_type',
            store: 'DatetypeStore',
            displayField: 'codeName',
            valueField: 'systemCode',
            innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'listpodate',
            labelWidth: 0,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        // this.addSearchField('seller_name');
        // this.addSearchField('specification');
        // this.addSearchField('gr_no');
        // this.addSearchField('po_no');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        var searchToolbar = this.createSearchToolbar();

        // searchToolbar.insert(0, {
        //     xtype: 'checkbox',
        //     boxLabel: '묶어서 보기',
        //     cls: 'searchLabel',
        //     style: 'margin-right: 50px;',
        //     value: '0',
        //     handler: function (field, value) {
        //         gm.me().store.setConfig({
        //             groupField: value ? 'gr_no' : null
        //         });
        //     }
        // });

        var option = {
            features: {
                ftype: 'groupingsummary',
                groupHeaderTpl: '<div>입고번호 :: <font color=#003471><b>{[values.rows[0].data.gr_no]}</b></font> ({rows.length})</div>'
            }
        };
        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.bioprotech.WearingState',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            pageSize: gMain.pageSize, /*pageSize*/
        }, {
            //groupField: 'gr_no',
            groupDir: 'DESC'
        });

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
        arr.push(this.buttonToolbar3);
        arr.push(searchToolbar);

        this.readAndPublicStore = Ext.create('Rfx2.store.BufferStore', {});
        this.readAndPublicStore.getProxy().setExtraParam('group_uid', vCUR_USER_UID);
        this.readAndPublicStore.getProxy().setExtraParam('type', 'READ_AND_PUBLIC');
        this.readAndPublicStore.getProxy().setExtraParam('v001', 'CI');
        this.readAndPublicStore.getProxy().setExtraParam('target_uid', -1);
        this.readAndPublicStore.load();



        

        //입고 취소 Action 생성
       this.removeGoAction = Ext.create('Ext.Action', {
        iconCls: 'mfglabs-retweet_14_0_5395c4_none',
        // text: gm.getMC('CMD_Goods_receipt_cancellation', '입고 취소'),
        text: '반품처리',
        tooltip: '반품 처리',
        disabled: true,
        handler: function () {
            gm.me().treatremoveGo();
        }//handler end...

    });

        //구매자재 입고 포장별 바코드 출력 생성
        // this.createGoodsIn = Ext.create('Ext.Action', {
        //     iconCls: 'barcode',
        //     text: '자재 입고 바코드',
        //     tooltip: '자재 입고 바코드',
        //     disabled: true,
        //     handler: function () {

        //         var uniqueIdArr = [];
        //         var bararr = [];

        //         var cartmap_uid_array = [];
        //         var srcahd_uid_array = [];
        //         var item_code_uid_array = [];
        //         var item_name_uid_array = [];
        //         var po_no_arr = [];
        //         var pj_uids = [];
        //         var gr_quan_arr = [];
        //         var pcs_desc_arr = [];
        //         var date_stamps = [];

        //         var countPlus = 0;

        //         var lotNoSelect = [];

        //         var specArr = [];
        //         //포장수량(바코드 수량과 1대1)
        //         var gr_Qty = null;
        //         var areaCode = null;
        //         var selections = gm.me().gridWearingState.getSelectionModel().getSelection();

        //         var lot_no = selections[0].get('area_code');


        //         for (var i = 0; i < selections.length; i++) {

        //             var rec = selections[i];
        //             console_logs('rec', rec);
        //             var uid = rec.get('unique_id');  //rtgast unique_id???
        //             var item_code = rec.get('item_code');
        //             var item_name = rec.get('item_name');
        //             var specification = rec.get('specification');
        //             var gr_date = rec.get('gr_date');
        //             var date_stamp = rec.get('ar_date');

        //             specArr.push(specification);


        //             var bar_spec = rec.get('barcode');

        //             // var bar_spec = item_code + '|' + item_name + '|' + specification;
        //             var srcahd_uid = rec.get('srcahd_uid');

        //             var GrQuan = rec.get('gr_qty');
        //             var pcs_desc_group_assy = rec.get('pcs_desc_group_assy');

        //             pcs_desc_arr.push(pcs_desc_group_assy);
        //             gr_quan_arr.push(GrQuan);

        //             uniqueIdArr.push(uid);
        //             bararr.push(bar_spec);
        //             cartmap_uid_array.push(uid);
        //             srcahd_uid_array.push(srcahd_uid);

        //             console_logs('srcahd_uid 출력 >>> ' + srcahd_uid);

        //             gr_Qty = rec.get(('gr_qty'));
        //             console_logs('입고수량 gr_Qty 출력 >>> ' + gr_Qty);
        //             areaCode = rec.get(('area_code'));

        //             console_logs('areaCode 출력 >>> ' + areaCode);

        //             item_code_uid_array.push(item_code);
        //             item_name_uid_array.push(item_name);

        //             date_stamps.push(date_stamp);

        //         }
        //         //셀렉션 붙임 끝

        //         var boxPacking = null;

        //         var printQuan = null;

        //         var barcodeForm = Ext.create('Ext.form.Panel', {
        //             xtype: 'form',
        //             frame: false,
        //             border: false,
        //             autoScroll: true,
        //             bodyPadding: 10,
        //             region: 'center',
        //             layout: 'vbox',
        //             width: 500,
        //             height: 250,
        //             items: [
        //                 {
        //                     xtype: 'container',
        //                     width: '100%',
        //                     defaults: {
        //                         width: '90%',
        //                         padding: '3 3 3 3',
        //                     },
        //                     border: true,
        //                     layout: 'column',
        //                     items: [
        //                         {
        //                             fieldLabel: '프린터',
        //                             labelWidth: 80,
        //                             xtype: 'combo',
        //                             margin: '5 5 5 5',
        //                             id: gu.id('printer'),
        //                             name: 'printIpAddress',
        //                             store: Ext.create('Mplm.store.PrinterStore'),
        //                             displayField: 'code_name_kr',
        //                             valueField: 'system_code',
        //                             emptyText: '프린터 선택',
        //                             allowBlank: false
        //                         },
        //                         {
        //                             fieldLabel: '프린트 라벨',
        //                             labelWidth: 80,
        //                             xtype: 'combo',
        //                             margin: '5 5 5 5',
        //                             id: gu.id('print_label'),
        //                             name: 'labelSize',
        //                             store: Ext.create('Mplm.store.PrintLabelStore'),
        //                             displayField: 'code_name_kr',
        //                             valueField: 'system_code',
        //                             emptyText: '라벨 선택',
        //                             allowBlank: false
        //                         },
        //                         {
        //                             xtype: 'textfield',
        //                             name: 'print_qty',
        //                             fieldLabel: '품명',
        //                             margin: '5 5 5 5',
        //                             editable: false,
        //                             labelWidth: 80,
        //                             allowBlank: false,
        //                             value: item_name,
        //                             maxlength: '1',
        //                         }
        //                     ],
        //                 }
        //             ]
        //         });

        //         var comboPrinter = gu.getCmp('printer');
        //         comboPrinter.store.load(
        //             function () {
        //                 this.each(function (record) {
        //                     var system_code = record.get('system_code');
        //                     if (system_code == '192.168.20.11') {
        //                         comboPrinter.select(record);
        //                     }
        //                 });
        //             }
        //         );

        //         var comboLabel = gu.getCmp('print_label');
        //         comboLabel.store.load(
        //             function () {
        //                 this.each(function (record) {
        //                     var system_code = record.get('system_code');
        //                     if (system_code == 'L100x80') {
        //                         comboLabel.select(record);
        //                     }
        //                 });
        //             }
        //         );

        //         prWin = Ext.create('Ext.Window', {
        //             modal: true,
        //             title: '제품 바코드 출력  ',
        //             width: 500,
        //             height: 250,
        //             plain: true,
        //             items: barcodeForm,
        //             // overflowY: 'scroll',
        //             buttons: [{
        //                 text: '바코드 출력',

        //                 handler: function (btn) {

        //                     var selection = gm.me().gridWearingState.getSelectionModel().getSelection();

        //                     var totalIndex = selection.length;

        //                     var packingTotal = [];
        //                     var printTotal = [];

        //                     var packingCount = 0;
        //                     var printCount = 0;
        //                     var multiple = 0;

        //                     var intputLotno = [];

        //                     var quanArray = []; //포장수량 배열
        //                     var lotArray = []; //로트 배열
        //                     var printQuanArray = [];   //출력 매수 배열
        //                     var packingArray = [];
        //                     var srcahd_uids = [];


        //                     for (i = 0; i < totalIndex; i++) {

        //                         var rec = selection[i];

        //                         var packing = rec.get('gr_qty');
        //                         var printQuan = 1;
        //                         var input_lot = rec.get('area_code');
        //                         var srcahd_uid = rec.get('srcahd_uid');
        //                         quanArray.push(packing);
        //                         printQuanArray.push(printQuan);
        //                         lotArray.push(input_lot);
        //                         srcahd_uids.push(srcahd_uid);
        //                     }

        //                     if (btn == 'no') {
        //                         prWin.close();

        //                     } else {

        //                         if (printQuanArray == null || printQuanArray.length == 0) {
        //                             gm.me().showToast('오류', "출력할 항목을 추가하세요.");
        //                             return;
        //                         }

        //                         prWin.setLoading(true);
        //                         // 이게 출력

        //                         var printIpAddress = gu.getCmp('printer').getValue();
        //                         var labelSize = gu.getCmp('print_label').getValue();

        //                         Ext.Ajax.request({
        //                             url: CONTEXT_PATH + '/sales/productStock.do?method=printSjBarcode',
        //                             // url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBioT',
        //                             params: {
        //                                 date_stamps: date_stamps,
        //                                 print_type: 'EACH',
        //                                 countPlus: printQuan,
        //                                 print_qty: printQuan,
        //                                 printIpAddress: printIpAddress,
        //                                 label_size: labelSize,
        //                                 lotrtgastUids: uniqueIdArr,
        //                                 barcodes: bararr,
        //                                 lot_no: lot_no,
        //                                 cartmap_uid_list: cartmap_uid_array,
        //                                 srcahd_uids: srcahd_uid_array,
        //                                 item_codes: item_code_uid_array,
        //                                 item_names: item_name_uid_array,
        //                                 packing_qty: gr_quan_arr,
        //                                 gr_quan: gr_quan_arr,
        //                                 srcahd_uids : srcahd_uids,
        //                                 // gr_quan_list: gr_quan_arr,
        //                                 pcs_desc_list: pcs_desc_arr,
        //                                 barcode_type: 'warehousing',
        //                                 quanArray: quanArray,
        //                                 printQuanArray: printQuanArray,
        //                                 // lotArray: lotArray,
        //                                 lots: lotArray,
        //                                 specArr: specArr,
        //                                 gr_date: gr_date
        //                             },


        //                             success: function (result, request) {

        //                                 Ext.Msg.alert('', '바코드 프린터 출력 요청을 성공하였습니다.');

        //                                 prWin.setLoading(false);
        //                                 prWin.close();

        //                             },

        //                             failure: function (result, request) {

        //                                 Ext.Msg.alert('오류', '바코드 프린터 출력 요청을 실패하였습니다.</br>바코드 프린터 상태를 확인하시기 바랍니다.');

        //                                 prWin.setLoading(false);

        //                             }
        //                         });

        //                     }
        //                 }
        //             }, {
        //                 text: '취소',
        //                 handler: function () {
        //                     if (prWin) {
        //                         prWin.close();
        //                     }
        //                 }
        //             }
        //             ]
        //         });
        //         prWin.show();
        //     },

        //     //gm.me().printBarcode();

        // });

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
            //frame: true,
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
                        // this.createGoodsIn,
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
                {text: '바코드', width: 150, style: 'text-align:center', dataIndex: 'barcode', sortable: false}
            ],
            //title: '상세',
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                }
            }
        });


        //grid 생성.
        this.createGridCore(arr, option);
        //this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    //title: '제품 및 템플릿 선택',
                    collapsible: false,
                    frame: false,
                    region: 'center',
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
                }, {
                    title: '상세정보',
                    collapsible: true,
                    collapsed: true,
                    region: 'east',
                    layout: 'fit',
                    margin: '5 0 0 0',
                    width: '40%',
                    items: [this.gridWearingState]
                }
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
                gm.me().store.getProxy().setExtraParam('sp_code', 'K');
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




        //버튼 추가.

        buttonToolbar.insert(1, '-');

        buttonToolbar.insert(5, '-');
        buttonToolbar.insert(5, this.setSubMatView);
        buttonToolbar.insert(5, this.setSaMatView);
        buttonToolbar.insert(5, this.setAllMatView);

      



        this.callParent(arguments);

        this.gridWearingState.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections != null && selections.length > 0) {

                    gm.me().wgrast_uids = [];
                    gm.me().arrGrqty = [];
                    gm.me().lot_nos = [];

                    for (var i = 0; i < selections.length; i++) {
                        var rec1 = selections[i];
                        var uids = rec1.get('id');
                        var gr_qty = rec1.get('gr_qty');
                        var project_varchar6 = rec1.get('project_varchar6');
                        gm.me().arrGrqty.push(gr_qty);
                        gm.me().wgrast_uids.push(uids);
                        gm.me().lot_nos.push(project_varchar6);
                    }

                    var rec = selections[0];
                    //console_logs('rec', rec);
                    gm.me().rec = rec;
                    gm.me().cartmapuid = rec.get('id');

                    gm.me().removeGoAction.enable();
                    // gm.me().createGoodsIn.enable();
                    gm.me().mergeBarcodeAction.enable();
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
                    // gm.me().createGoodsIn.disable();
                    gm.me().mergeBarcodeAction.disable();
                }
            }
        });

        // this.setGridOnCallback(function (selections) {

        //     if (vCompanyReserved4 == 'SKNH01KR' || vCompanyReserved4 == 'KWLM01KR') {
        //         var total_price_sum = 0;
        //         var total_qty = 0;


        //         for (var i = 0; i < selections.length; i++) {
        //             var t_rec = selections[i];
        //             if (vCompanyReserved4 == 'KWLM01KR') {
        //                 var ctr_flag = t_rec.get('ctr_flag');
        //                 total_price_sum += t_rec.get('sales_amount');
        //             } else {
        //                 total_price_sum += t_rec.get('po_qty') * t_rec.get('sales_price');
        //             }

        //             total_qty += t_rec.get('po_qty');
        //         }

        //         this.buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
        //     }
        // });

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length) {
                var total_price_sum = 0;
                var total_qty = 0;

                gm.me().printPDFAction.enable();
                var rec = selections[0];
                var srcahd_uid = rec.get('srcahd_uid');
                var uid_xpoast =  rec.get('uid_xpoast');
                gm.me().gridWearingState.getStore().getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                gm.me().gridWearingState.getStore().getProxy().setExtraParam('uid_xpoast', uid_xpoast);

                gm.me().gridWearingState.getStore().loadPage(1);
            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;

                gm.me().printPDFAction.disable();
            }

            for (var i = 0; i < selections.length; i++) {
                var t_rec = selections[i];
                
                // total_price_sum += t_rec.get('po_qty') * t_rec.get('sales_price');
                total_price_sum += t_rec.get('gr_amount');
                

                total_qty += t_rec.get('gr_qty');
            }

            this.buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);


        })

        
        //디폴트 로드
        gm.setCenterLoading(false);

        var s_date = Ext.Date.add(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
        s_date = Ext.Date.format(s_date, 'Y-m-d');
        var e_date = new Date();
        e_date = Ext.Date.format(e_date, 'Y-m-d');

        this.store.getProxy().setExtraParam('gr_date', s_date + ':' + e_date);

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

    divisionBarcode: function () {
        var form = null;

        form = Ext.create('Ext.form.Panel', {
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
                            xtype: 'fieldcontainer',
                            fieldLabel: '분할 수량',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'division_qty',
                                    fieldLabel: '분할 수량',
                                    margin: '0 5 0 0',
                                    width: 200,
                                    allowBlank: false,
                                    value: 1,
                                    maxlength: '1',
                                }
                            ]
                        }
                    ]
                },
            ]


        });

        prwin = gMain.selPanel.prdivisionBarcode(form);

    },



    items: [],
    arrGrqty: [],
    wgrast_uids: [],
    lot_nos: [],
    poviewType: 'ALL',

    deleteConfirm: function (btn, text) {

        if (btn != 'yes') {
            return;
        }
        var unique_ids = gm.me().wgrast_uids;
        var arrGrqty = gm.me().arrGrqty;
        var lot_nos = gm.me().lot_nos;
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
                , lot_nos: lot_nos

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



    buttonToolbar3: Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '총 금액 : 0 / 총 수량 : 0'
        }]
    }),




    // 바코드 모달


    

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

    

   
    treatremoveGo: function () {

        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: 10,
            region: 'center',
            layout: 'form',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '입고 취소 수량을 입력하시기 바랍니다.</br>취소 수량은 우선 반품창고로 들어가고, 반품이 완료되면 재고가 감소됩니다.',
                    items: [
                        {
                            xtype: 'numberfield',
                            id: gu.id('cancel_quan'),
                            name: 'cancel_quan',
                            fieldLabel: '취소 수량',
                            margin: '3 3 3 3',
                            anchor: '97%',
                            allowBlank: false,
                            value: gm.me().gridWearingState.getSelectionModel().getSelection()[0].get('gr_qty')
                            // gm.me().grid.getSelectionModel().getSelection()[0].get('gr_qty')
                        },
                        {
                            fieldLabel: '취소 날짜',
                            xtype: 'datefield',
                            name: 'cancel_date',
                            id: gu.id('cancel_date'),
                            format: 'Y-m-d',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            margin: '3 3 3 3',
                            value: new Date()
                        },
                        {
                            fieldLabel: '취소 사유',
                            xtype: 'textfield',
                            id: gu.id('cancel_reason'),
                            name: 'cancel_reason',
                            margin: '3 3 3 3',
                            anchor: '97%',
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '입고취소',
            width: 450,
            height: 270,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    scope: this,
                    handler: function () {



                        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

                        var wgrastUid = rec.get('unique_id_long');
                        var cancelQuan = gu.getCmp('cancel_quan').getValue();
                        var cancelContent = gu.getCmp('cancel_reason').getValue();
                        var lotNo = rec.get('area_code');
                        var cancelDate = Ext.Date.format(gu.getCmp('cancel_date').getValue(), 'Y-m-d');
                        var expDate = rec.get('ar_date');

                        gm.me().setLoading(true);
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/quality/wgrast.do?method=cancelGoodsReceipt',
                            params: {
                                wgrastUid: wgrastUid,
                                cancelQuan: cancelQuan,
                                lotNo: lotNo,
                                expDate: expDate,
                                cancelDate: cancelDate,
                                cancelContent: cancelContent
                            },
                            success: function (result, request) {
                                gm.me().showToast('결과', '입고 취소하었습니다.');
                                gm.me().getStore().load(function () {
                                });
                                gm.me().setLoading(false);
                                if (prWin) {
                                    prWin.close();
                                }

                            },
                            failure: extjsUtil.failureMessage
                        });
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
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





