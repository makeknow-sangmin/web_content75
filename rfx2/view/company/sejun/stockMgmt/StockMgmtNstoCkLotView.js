//생산완료 현황
Ext.define('Rfx2.view.company.sejun.stockMgmt.StockMgmtNstoCkLotView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'Stock-mgmt-nstock-lot-view',
    inputBuyer: null,
    preValue: 0,
    selectedWhouseName:null,
    selectedWhouseName1:null,
    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        // this.addSearchField({
        //     field_id: 'standard_flag'
        //     , store: "CommonCodeStore"
        //     , displayField: 'codeName'
        //     , valueField: 'systemCode'
        //     , params: { parentCode: 'PRODUCT_TYPE', hasNull: true  }
        //     , innerTpl: '<div data-qtip="{system_code}">{codeName}</div>'
        // });

        this.addSearchField({
            field_id: 'whouse_uid'
            , emptyText: '창고명'
            , width: 100
            , store: "Rfx2.store.company.bioprotech.WarehouseStore"
            , displayField: 'wh_name'
            , valueField: 'unique_id'
            //, defaultValue: '11030245000001'
            , autoLoad: true
            , innerTpl: '<div data-qtip="{unique_id}">{wh_name}</div>'
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        //this.addSearchField('specification');

        this.addCallback('CHECK_SP_CODE', function (combo, record) {

            gm.me().refreshStandard_flag(record);

        });

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var myCartModel = Ext.create('Rfx.model.MyCartLineSrcahdGo', {
            fields: this.fields
        });

        this.myCartStore = new Ext.data.Store({
            pageSize: 100,
            model: myCartModel,
            sorters: [{
                property: 'create_date',
                direction: 'desc'
            }

            ]
        });


        this.addGoCart = Ext.create('Ext.Action', {
            // xtype: 'button',
            // iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
            // text: gm.getMC('CMD_Out_cart_in', '불출카트 담기'),
            // tooltip: '불출요청용 카트 담기',
            // disabled: true,
            handler: function (widget, event) {
                var srcahd_uids = new Array();
                var stoqty_uids = new Array();
                var item_codes = new Array();
                var lot_nos = new Array();
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var detailStock = gm.me().detailStockGrid.getSelectionModel().getSelection();

                
                console_logs('selections', selections);
                //				    if (selections) {
                var arrExist = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var det = detailStock[i];
                    var stoqty_uid = rec.get('unique_id_long');
                    var srcahd_uid = rec.get('uid_srcahd');
                    var item_name = rec.get('item_name');
                    var item_code = rec.get('item_code');
                    var lot_no = det.get('lot_no');
                    var delete_flag = rec.get('delete_flag');
                    console_logs('delete_flag----------------', delete_flag);
                    arrExist.push(srcahd_uid);
                    console_logs('stoqty_uid----------------', stoqty_uid);
                    console_logs('isExistMyCart 전----------------');
                    var bEx = gm.me().isExistMyCart(stoqty_uid);
                    console_logs('isExistMyCart 후----------------');
                    console_logs('bEx----------------결과', bEx);
                    console_logs('lot_no12313--------------------',lot_no);
                    console_logs('lot_no12313--------------------',srcahd_uid);
                    if (bEx == 'false') {
                        console_logs('stoqty_uid----------------false안', stoqty_uid);
                        srcahd_uids.push(srcahd_uid);
                        stoqty_uids.push(stoqty_uid);
                        item_codes.push(item_code);
                        lot_nos.push(lot_no);
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/purchase/request.do?method=addMyCartGo',
                            params: {
                                srcahd_uids: srcahd_uids,
                                item_codes: item_codes,
                                stoqty_uids: stoqty_uids,
                                lot_nos: lot_nos,
                                reserved1: 'N'
                            },
                            success: function (result, request) {
                                gm.me().myCartStore.load(function () {
                                    var resultText = result.responseText;
                                    Ext.Msg.alert('안내', '카트 담기 완료.', function () {
                                    });
                                });
                            },
                        }); //end of ajax

                    } else {
                        arrExist.push('[' + item_code + '] \'' + item_name + '\'');
                        Ext.MessageBox.alert('경고', arrExist[1] + ' 파트 포함 ' + arrExist.length + '건은 이미 불출요청 카트에 담겨져 있습니다.<br/> 불출 요청 후 다시 불출요청 카트에 담아주세요.');
                    }

                }
            }
        });

        
        //구매자재 입고 포장별 바코드 출력 생성
        this.createGoodsIn = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '자재 입고 바코드',
            tooltip: '자재 입고 바코드',
            disabled: true,
            handler: function () {

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
                var date_stamps = [];

                var countPlus = 0;

                var lotNoSelect = [];

                var specArr = [];
                //포장수량(바코드 수량과 1대1)
                var gr_Qty = null;
                var areaCode = null;
                var selections = gm.me().detailStockGrid.getSelectionModel().getSelection();

                var lot_no = selections[0].get('lot_no');


                for (var i = 0; i < selections.length; i++) {

                    var rec = selections[i];
                    console_logs('rec', rec);
                    var uid = rec.get('unique_id');  //rtgast unique_id???
                    var item_code = rec.get('item_code');
                    var item_name = rec.get('item_name');
                    var specification = rec.get('specification');
                    var gr_date = rec.get('gr_date');
                    var date_stamp = rec.get('exp_date');

                    specArr.push(specification);


                    var bar_spec = rec.get('unique_id_long');

                    // var bar_spec = item_code + '|' + item_name + '|' + specification;
                    var srcahd_uid = rec.get('uid_srcahd');

                    var GrQuan = rec.get('dtl_qty');
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

                    date_stamps.push(date_stamp);

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

                            var selection = gm.me().detailStockGrid.getSelectionModel().getSelection();

                            var totalIndex = selection.length;

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
                            var srcahd_uids = [];


                            for (i = 0; i < totalIndex; i++) {

                                var rec = selection[i];

                                var dtl_qty = rec.get('dtl_qty');
                                var printQuan = 1;
                                var lot_no = rec.get('lot_no');
                                var srcahd_uid = rec.get('uid_srcahd');
                                quanArray.push(dtl_qty);
                                printQuanArray.push(printQuan);
                                lotArray.push(lot_no);
                                srcahd_uids.push(srcahd_uid);
                            }

                            if (btn == 'no') {
                                prWin.close();

                            } else {

                                if (printQuanArray == null || printQuanArray.length == 0) {
                                    gm.me().showToast('오류', "출력할 항목을 추가하세요.");
                                    return;
                                }

                                prWin.setLoading(true);
                                // 이게 출력

                                var printIpAddress = gu.getCmp('printer').getValue();
                                var labelSize = gu.getCmp('print_label').getValue();

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=printSjBarcode',
                                    // url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBioT',
                                    params: {
                                        date_stamps: date_stamps,
                                        print_type: 'EACH',
                                        countPlus: printQuan,
                                        print_qty: printQuan,
                                        printIpAddress: printIpAddress,
                                        label_size: labelSize,
                                        lotrtgastUids: uniqueIdArr,
                                        barcodes: bararr,
                                        lot_no: lot_no,
                                        cartmap_uid_list: cartmap_uid_array,
                                        srcahd_uids: srcahd_uid_array,
                                        item_codes: item_code_uid_array,
                                        item_names: item_name_uid_array,
                                        packing_qty: gr_quan_arr,
                                        gr_quan: gr_quan_arr,
                                        srcahd_uids : srcahd_uids,
                                        // gr_quan_list: gr_quan_arr,
                                        pcs_desc_list: pcs_desc_arr,
                                        barcode_type: 'lot',
                                        quanArray: quanArray,
                                        printQuanArray: printQuanArray,
                                        // lotArray: lotArray,
                                        lots: lotArray,
                                        specArr: specArr,
                                        gr_date: gr_date
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
            },

            //gm.me().printBarcode();

        });


        this.printBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '카톤바코드 출력',
            tooltip: '바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gm.me().printBarcode();
            }
        });

        this.warehouseStore = Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {});

        this.warehouseStore.load( 
            );
        
        var addGoodsMoveAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            // text: '불량창고이동',
            text: '창고이동',
            tooltip: '자재의 불량창고 이동 요청합니다',
            disabled: true,
            handler: function () {

                var selections = gm.me().grid.getSelectionModel().getSelection();
                var selections2 = gm.me().detailStockGrid.getSelectionModel().getSelection();
                console_logs('selections', selections);
                console_logs('selections2', selections2);

                if (selections.length > 0) {
                    var rec = selections[0];
                    var rec1 = selections2[0];
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
                            // {
                            //     xtype: 'hiddenfield',
                            //     id: gu.id('uid_srcahd'),
                            //     name: 'uid_srcahd',
                            //     hidden: true,
                            //     value: rec.get('uid_srcahd')
                            // },
                            {
                                xtype: 'hiddenfield',
                                id: gu.id('stodtl_uid'),
                                name: 'stodtl_uid',
                                hidden: true,
                                value: rec1.get('unique_id')
                            },
                            // {
                            //     xtype: 'hiddenfield',
                            //     id: gu.id('unique_id_long'),
                            //     name: 'unique_id_long',
                            //     hidden: true,
                            //     value: rec.get('unique_id_long')
                            // },
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
                                fieldLabel: '일부인',
                                xtype: 'datefield',
                                id: gu.id('exp_date'),
                                name: 'exp_date',
                                format: 'Y-m-d',
                                value: rec1.get('exp_date_str'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',

                            },  
                            // {
                            //     fieldLabel: gm.me().getColName('specification'),
                            //     xtype: 'textfield',
                            //     id: gu.id('specification'),
                            //     name: 'specification',
                            //     value: rec.get('specification'),
                            //     flex: 1,
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // }, {
                            //     fieldLabel: gm.me().getColName('maker_name'),
                            //     xtype: 'textfield',
                            //     id: gu.id('maker_name'),
                            //     name: 'maker_name',
                            //     value: rec.get('maker_name'),
                            //     flex: 1,
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // },
                             {
                                fieldLabel: '현재창고',
                                xtype: 'textfield',
                                id: gu.id('wh_name'),
                                name: 'wh_name',
                                value: rec.get('wh_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                            }, {
                                fieldLabel: '대상창고',
                                xtype: 'combo',
                                anchor: '100%',
                                name: 'whouse_uid',
                                mode: 'local',
                                store: Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {}),
                                displayField: 'wh_name',
                                valueField: 'unique_id_long',
                                emptyText: '선택',
                                sortInfo: { field: 'systemCode', direction: 'DESC' },
                                typeAhead: false,
                                minChars: 1,
                                listConfig:{
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function(){
                                        return '<div>[{wh_code}] {wh_name}</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {
                                        gm.me().selectedWhouseName = record.get('whouse_uid');
                                    }
                                }
                            },
                            {
                                fieldLabel: '요청수량',
                                xtype: 'numberfield',
                                minValue: 0,
                                width: 100,
                                id: gu.id('wh_qty'),
                                name: 'wh_qty',
                                allowBlank: true,
                                value: '1',
                                margins: '5'
                            },
                            {
                                fieldLabel: '사유',
                                xtype: 'textfield',
                                minValue: 0,
                                width: 100,
                                id: gu.id('reason_text'),
                                name: 'reason_text',
                                allowBlank: true,
                                margins: '5'
                            },
                        ]
                    }); 

                    var winPart = Ext.create('ModalWindow', {
                        title: '자재 이동 요청',
                        width: 500,
                        height: 300,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                      

                                    
                                    if (val['whouse_uid'] === rec.get('whouse_uid')) {
                                      
                                        Ext.Msg.alert('경고', '창고가 동일하여 요청할 수 없습니다.');
                                    }else if(val['wh_qty'] > rec1.get('dtl_qty') ){
                                        Ext.Msg.alert('경고', '이동하려는 자재의 양이 재고보다 많습니다.');
                                    } else {
                                        gm.me().addStockMove(winPart, val);
                                    }

                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                    if (winPart) {
                                        winPart.close();
                                    }
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
        }
        );

        this.addGoodsinAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: gm.getMC('CMD_Wearing', '입고'),
            tooltip: '자재를 임의로 입고합니다',
            disabled: true,
            handler: function () {

                var selections = gm.me().grid.getSelectionModel().getSelection();

                console_logs('selections', selections);


                if (selections.length > 0) {
                    var rec = selections[0];
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
                            // {
                            //     fieldLabel: gm.me().getColName('specification'),
                            //     xtype: 'textfield',
                            //     id: gu.id('specification'),
                            //     name: 'item_name',
                            //     value: rec.get('specification'),
                            //     flex: 1,
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // }, 
                            // {
                            //     fieldLabel: gm.me().getColName('maker_name'),
                            //     xtype: 'textfield',
                            //     id: gu.id('maker_name'),
                            //     name: 'maker_name',
                            //     value: rec.get('maker_name'),
                            //     flex: 1,
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // },
                            {
                                fieldLabel: '이동수량',
                                xtype: 'numberfield',
                                minValue: 0,
                                width: 100,
                                id: gu.id('wh_qty'),
                                name: 'wh_qty',
                                allowBlank: true,
                                value: '1',
                                margins: '5'
                            }
                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '자재 입고',
                        width: 500,
                        height: 250,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);

                                    gm.me().addStockIn(val);

                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                                if (winPart) {
                                    winPart.close();
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
        var addGoodOutAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: gm.getMC('CMD_Release', '임의출고'),
            tooltip: '자재를 임의로 불출합니다',
            disabled: true,
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var selections2 = gm.me().detailStockGrid.getSelectionModel().getSelection();
                console_logs('selectionsqweqwe', selections2);
                if (selections.length > 0) {
                    var rec = selections[0];
                    var rec1 = selections2[0];

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
                                value: rec1.get('unique_id'),
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
                            }, 
                            
                            {
                                fieldLabel: gm.me().getColName('wh_qty'),
                                xtype: 'numberfield',
                                id: gu.id('wh_qty'),
                                name: 'wh_qty',
                                value: rec.get('wh_qty'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, 
                            // {
                            //     fieldLabel: gm.me().getColName('specification'),
                            //     xtype: 'textfield',
                            //     id: gu.id('specification_out'),
                            //     name: 'item_name',
                            //     value: rec.get('specification'),
                            //     flex: 1,
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // }, 
                            // {
                            //     fieldLabel: gm.me().getColName('maker_name'),
                            //     xtype: 'textfield',
                            //     id: gu.id('maker_name_out'),
                            //     name: 'maker_name',
                            //     value: rec.get('maker_name'),
                            //     flex: 1,
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // },
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
                            }
                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '자재 불출',
                        width: 500,
                        height: 250,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().addStockOut(val);
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                                if (winPart) {
                                    winPart.close();
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

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1: case 2: case 3: case 4: case 5:
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
        // buttonToolbar.insert(1, this.addGoodsMoveAction);
        buttonToolbar.insert(1, this.addGoodOutAction);
        // buttonToolbar.insert(1, this.addGoodsinAction);
        // buttonToolbar.insert(1, this.printBarcodeAction);
        // buttonToolbar.insert(1, this.addGoCart);
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
            // bbar: getPageToolbar(this.poPrdDetailStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            // selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            
            columns: [
                { text: '일자', width: 100, style: 'text-align:center', dataIndex: 'pl_no', sortable: false },
                { text:  this.getMC('msg_order_grid_prd_fam', '구분'), width: 65, style: 'text-align:center', dataIndex: 'class_code', sortable: false },
                { text:  this.getMC('msg_order_grid_prd_name', '계획번호'), width: 100, style: 'text-align:center', dataIndex: 'item_name', sortable: false },
                { text:  this.getMC('msg_order_grid_prd_desc', '소요/입고량'), width: 95, style: 'text-align:center', dataIndex: 'description', sortable: false },
                { text: '가용수량', width: 95, style: 'text-align:center', dataIndex: 'ap_Wquan', align: 'right',
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

    
        this.setRowClass(function (record, index) {
            console_logs('record>>>', record);
            var expiry_flag = record.get('expiry_flag');
            if(expiry_flag == 'Y') {
                return 'red-row';
            }
        });

        //grid 생성.
        this.createGrid(arr);
      
        // 재고상세 정병준
        this.detailStockGrid = Ext.create('Ext.grid.Panel', {
            store: Ext.create('Rfx2.store.company.bioprotech.DetailStockStore'),
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            // region: 'center',
            layout: 'fit',
            height: 300,
            forceFit: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            features: [{
                ftype: 'summary'
            }],
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'single'}),
            margin: '5 0 0 0',
            columns: [
                { text: 'UID', width: 100, align: 'center', style: 'text-align:center', dataIndex: 'unique_id', hidden:true },
                {
                    text: '개별수량', width: 50, align: 'right', style: 'text-align:center', dataIndex: 'dtl_qty', sortable: false,
                    renderer: function (value, meta) {
                        return value==null ? 0 : Ext.util.Format.number(value, '0,00/i');
                    }
                    ,
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '합계: ' + Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: 'BOX수량', width: 50, align: 'right', style: 'text-align:center', dataIndex: 'dtl_box_qty', sortable: false,
                    renderer: function (value, meta) {
                        return value==null ? 0 : Ext.util.Format.number(value, '0,00/i');
                    }
                    ,
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '합계: ' + Ext.util.Format.number(value, '0,00/i');
                    }
                },

                // { text: '단위', width: 30, align: 'center', style: 'text-align:center', dataIndex: 'unit_code' },
                { text: '일부인', width: 50, align: 'right', style: 'text-align:center', dataIndex: 'exp_date',
                renderer: function (value) {
                    return Ext.util.Format.date(value, 'Y-m-d');
                },
              
            } ,
            { text: 'LOT_NO', width: 130, align: 'right', style: 'text-align:center', dataIndex: 'lot_no'},
            { text: 'PALLET', width: 130, align: 'right', style: 'text-align:center', dataIndex: 'stock_pos'},
            { text: '입고시간', width: 130, align: 'right', style: 'text-align:center', dataIndex: 'create_date'}
               
            ],
            // dockedItems: [
            //     {
            //         dock: 'top',
            //         xtype: 'toolbar',
            //         cls: 'my-x-toolbar-default2',
            //         items: [addGoodOutAction]
            //     }
            // ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [addGoodsMoveAction, this.createGoodsIn]
                },
            ],
            name: 'detailStock',
            autoScroll: true,
            viewConfig : {
                forceFit:true,
                getRowClass : function ( record , index ) {
                    var expiry_flag = record.get('expiry_flag');
                    if(expiry_flag == 'Y') {
                        return 'red-row';
                    }
                }
            },
            listeners : {
                select: function (dv, record) {
                  var rec = record.data;
                  gm.me().readOptionfactor(rec.unique_id);
                }
            }
            
        });


        this.detailStockGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections) {
                    gm.me().createGoodsIn.enable();
                } else {
                    gm.me().createGoodsIn.disable();
                }
            }
        });
        // 재고상세 정병준
        
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
                { text: '투입수량', width: 140, align: 'right', style: 'text-align:center', dataIndex: 'move_qty' },
                { text: '작업지시번호', width: 140, align: 'right', style: 'text-align:center', dataIndex: 'po_no' },
                { text: '생산지시번호', width: 140, align: 'right', style: 'text-align:center', dataIndex: 'pr_no' },
                { text: '고객사이름', width: 140, align: 'center', style: 'text-align:center', dataIndex: 'wa_name' },
            ],
            name: 'capa',
            autoScroll: true,
        });
        // 이동현황 정병준


        var myPanel = Ext.create('Ext.form.Panel', {
            title: '재고상세',
            layout: { type: 'vbox', pack: 'start', align: 'stretch' },
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
                // this.moveStockGrid
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
                { text: '수주번호', width: 120, align: 'right', style: 'text-align:center', dataIndex: 'pj_code' },
                { text: '단위', width: 80, align: 'center', style: 'text-align:center', dataIndex: 'unit_code' },
                {
                    text: '투입수량', width: 120, align: 'right', style: 'text-align:center', dataIndex: 'alloc_qty', sortable: false,
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
        //this.deliveryInfoStore = Ext.create('Rfx2.model.company.bioprotech.DeliveryInfoStore', { pageSize: 100 });
        this.inStockGrid = Ext.create('Ext.grid.Panel', {
            store: Ext.create('Rfx2.model.company.bioprotech.DeliveryInfoStore', { pageSize: 100 }),
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
                // { text: '출하요청번호', width: 150, style: 'text-align:center', align: 'left', dataIndex: 'request_no' },
                // { text: '수주번호', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'order_number' },
                // { text: '고객사', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'buyer_name' },
                // { text: '최종고객사', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'final_wa_name' },
                // { text: '품번', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'item_code' },
                // { text: '품명', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'item_name' },
                // { text: '단위', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'unit_code' },
                // { text: '규격', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'specification' },
                // { text: '기준모델', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'description' },
                // { text: '단가', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'sales_price' },
                // { text: '통화', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'assymap_reserved4' },
                // { text: '요청일자', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'req_date' },
                // { text: '납기일자', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'rtgastdl_timestamp1' },
                // { text: '실제출하일자', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'real_req_date' },
                // { text: '출하특이사항', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'sledel_description' },
                // { text: '출하수량', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'transit_type' },
                // { text: '물류방법', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'pr_quan' }
                { text: '입고시간', width: 150, align: 'center', style: 'text-align:center', dataIndex: 'create_date' },
                { text: '입고수량', width: 150, align: 'right', style: 'text-align:center', dataIndex: 'in_qty' },
                { text: '바코드', width: 150, align: 'right', style: 'text-align:center', dataIndex: 'barcode' }
            ],
            name: 'deliveryInfo',
            autoScroll: true
        });

        // 출고현황
        this.productInfoStore = Ext.create('Rfx2.model.company.bioprotech.ProductInfoStore', { pageSize: 100 });
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
                // { text: '생산일자', width: 150, style: 'text-align:center', align: 'left', dataIndex: 'start_date' },
                // { text: '생산라인', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'name_ko' },
                // { text: '작업조', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'work_type' },
                // { text: '작업자명', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'mchn_code' },
                // { text: '생산수(양품수)', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'work_qty' },
                // { text: '불량수', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'defect_quan' },
                // { text: '불량률', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'defect_ratio' }
                { text: '출고시간', width: 150, align: 'center', style: 'text-align:center', dataIndex: 'create_date' },
                { text: '출고수량', width: 150, align: 'right', style: 'text-align:center', dataIndex: 'out_qty' }
            ],
            name: 'productInfo',
            autoScroll: true
        });
        
    
        this.detailInfo = Ext.create('Ext.form.Panel', {
            title: '상세정보',
            layout: 'fit',
            border: true,
            frame: true,
            width: "60%",
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
                    // myPanel,
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
                gm.me().addGoCart.enable();
                gm.me().addGoodsinAction.enable();
                addGoodOutAction.enable();
                gm.me().printBarcodeAction.enable();
                addGoodsMoveAction.enable();
                // 여기서 소요량 정보 Store Load
                //this.cartLineGrid.getStore().getProxy().setExtraParam('item_code', rec.get('item_code'));
                //this.cartLineGrid.getStore().getProxy().setExtraParam('is_combined', 'N');
                //this.cartLineGrid.getStore().load();
            } else {
                gm.me().addGoCart.disable();
                gm.me().printBarcodeAction.disable();
                gm.me().addGoodsinAction.disable();
                addGoodOutAction.disable();
                addGoodsMoveAction.disable();
            }
            
            if (selections.length) {
                var rec = selections[0];
                var wh_code = rec.get('wh_code');
                var item_code = rec.get('item_code');
                var unique_id = rec.get('unique_id');
                var wh_qty = rec.get('wh_qty');
                var unit_mass = rec.get('unit_mass');
                var unit_code = rec.get('unit_code');
                var exp_date = rec.get('exp_date');
                // gm.me().detailStockGrid.getStore().getProxy().setExtraParam('wh_code', wh_code);
                // gm.me().detailStockGrid.getStore().getProxy().setExtraParam('item_code', item_code);
                gm.me().detailStockGrid.getStore().getProxy().setExtraParam('nstock_uid', unique_id);
                gm.me().detailStockGrid.getStore().load(function (records) {
                    var sum = 0;
                    
                        console_logs("테스트",records);
                     
                    if(records!=null && records.length>0) {

                        for(var i=0; i<records.length; i++ ) {
                            var r = records[i];
                            sum = sum + r.get('dtl_qty');
                        }
                    }

                    var gap = wh_qty - sum; 
                    console_logs('sum', sum);
                    console_logs('wh_qty', wh_qty);
                    console_logs('gap', gap);

                    // if(gap!=0) {
                    //     gm.me().detailStockGrid.getStore().insert(0, new Ext.data.Model({ 
                    //         id: -1,
                    //         unique_id: '-1',
                    //         unique_id_long: -1,
                    //         dtl_qty: gap, 
                    //         unit_mass: unit_mass, 
                    //         std_amount: unit_mass*gap, 
                    //         unit_code: unit_code, 
                    //         stock_pos: '<미지정>',
                    //         lot_no : '<미지정>',
                    //         barcode : '<미지정>',
                    //         po_no_od : '<미지정>',
                    //         po_no_pr : '<미지정>'
                    //     }));
                    // }

                });
                gm.me().propProduceStore.removeAll();
                // gm.me().allocStockGrid.getStore().getProxy().setExtraParam('wh_code', wh_code);
                // gm.me().allocStockGrid.getStore().getProxy().setExtraParam('item_code', item_code);

                /**
                 * 다음 스토어는 현재 사용하지 않는 것으로 보임
                 */

                // gm.me().allocStockGrid.getStore().getProxy().setExtraParam('nstock_uid', unique_id);
                // gm.me().allocStockGrid.getStore().load(function (records) {
                // });
                //
                // gm.me().inStockGrid.getStore().getProxy().setExtraParam('nstock_uid', unique_id);
                // gm.me().inStockGrid.getStore().load(function (records) {
                // });
                //
                // gm.me().outStockGrid.getStore().getProxy().setExtraParam('nstock_uid', unique_id);
                // gm.me().outStockGrid.getStore().load(function (records) {
                // });

                /**
                 * end
                 */

                // gm.me().moveStockGrid.getStore().getProxy().setExtraParam('target_uid', target_uid);
                // gm.me().moveStockGrid.getStore().load(function (records) {
                // });
            } else {
            }

            // if (selections.length) {
            //     rec = selections[0];
            //     console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>', rec.get('request_comment'));
            //     console_logs('rec.get("item_name") = ', rec.get('item_name'));
            //     gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
            //     gm.me().vSELECTED_STOCK_UID = rec.get('stoqty_uid');
            //     gm.me().addGoCart.enable();
            //     gm.me().addGoodsinAction.enable();
            //     gm.me().addGoodOutAction.enable();
            //     gm.me().printBarcodeAction.enable();
            //     gm.me().addGoodsMoveAction.enable();
            //     // 여기서 소요량 정보 Store Load
            //     //this.cartLineGrid.getStore().getProxy().setExtraParam('item_code', rec.get('item_code'));
            //     //this.cartLineGrid.getStore().getProxy().setExtraParam('is_combined', 'N');
            //     //this.cartLineGrid.getStore().load();
            // } else {
            //     gm.me().addGoCart.disable();
            //     gm.me().printBarcodeAction.disable();
            //     gm.me().addGoodsinAction.disable();
            //     gm.me().addGoodOutAction.disable();
            //     gm.me().addGoodsMoveAction.disable();
            // }
        });
        
        
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('existStockAll', 'true');
        this.store.getProxy().setExtraParam('having_not_status', 'BM,P0,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('multi_prd', true);
        this.store.load(function (records) {
        });
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

    printBarcode: function () {
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
                   // title: '입력',
                    //collapsible: true,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: { top: 0, right: 5, bottom: 0, left: 0 }
                        }
                    },
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
                        // {
                        //     xtype: 'fieldcontainer',
                        //     fieldLabel: '출력매수',
                        //     combineErrors: true,
                        //     msgTarget: 'side',
                        //     layout: 'hbox',
                        //     defaults: {
                        //         flex: 1,
                        //         hideLabel: true,
                        //     },
                        //     items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'print_qty',
                                    fieldLabel: '출력매수',
                                    labelWidth: 80,
                                    margin: '5 5 5 5',
                                    allowBlank: false,
                                    value: 1,
                                    maxlength: '1',
                                }  // end of xtype
                        //     ]  // end of itmes
                        // }  // end of fieldcontainer
                    ]
                }
            ]

        });//Panel end...

        var selections = gm.me().grid.getSelectionModel().getSelection();
        var counts = 0;

        var uniqueIdArr = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('pj_barcode');  //Srcahd unique_id
            uniqueIdArr.push(uid);
        }

        if (uniqueIdArr.length > 0) {
            prwin = gm.me().prbarcodeopen(form);
        }
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
                            defaultMargins: { top: 0, right: 5, bottom: 0, left: 0 }
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
                            sortInfo: { field: 'pj_name', direction: 'DESC' },
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
                        url: CONTEXT_PATH + '/inventory/prchStock.do?method=addQty',
                        params: {
                            unique_id: val['unique_id'],
                            barcode: val['unique_id'],
                            stock_pos: '', /*NULL을 넣어야 V2에서 유효재고*/
                            innout_desc: val['innout_desc'],
                            wh_qty: val['wh_qty'],
                            whouse_uid: 100
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
        Ext.MessageBox.show({
            title: '창고 반출',
            msg: '창고에서 반출하시겠습니까?' + '\r\n 수량: ' + gu.getCmp('wh_qty_out').getValue(),
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/inventory/prchStock.do?method=addQty',
                        params: {
                            stodtl_uid: val['unique_id'],
                            barcode: val['unique_id'],
                            stock_pos: val['stock_pos'],
                            innout_desc: val['innout_desc'],
                            wh_qty: val['wh_qty'],
                            exp_date: val['exp_date'],
                            whouse_uid: 100
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().getStore().load(function () {
                            });
                            //alert('finished.ㅈ.');
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    },

    addStockMove: function (winPart, val) {
        Ext.MessageBox.show({
            title: '창고 이동',
            msg: '해당 창고로 이동 요청 하시겠습니까?' + '\r\n 수량: ' + gu.getCmp('wh_qty').getValue(),
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    console.log('벨류값 확인 :' ,val);
                    winPart.setLoading(true);
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/inventory/prchStock.do?method=requestMoveQty',
                        params: {
                            stoqty_uid: val['unique_id_long'],
                            stodtl_uid: val['stodtl_uid'],
                            //srcahd_uid: val['uid_srcahd'],
                            request_qty: val['wh_qty'],
                            whouse_uid: val['whouse_uid'],
                            reason_text: val['reason_text'],
                            item_code: val['item_code'],
                            exp_date: val['exp_date'],
                            old_whouse_uid: val['old_whouse_uid']
                        },
                        
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().getStore().load(function () {
                            });
                            gm.me().detailStockGrid.getStore().load(function () {
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
    // 정렬 툴바 사용 여부
    useValueCopyCombo: false, //값복사 사용
    useDivisionCombo: false,  //사업부 콤보 시용
    selectedSortComboCount: 0, //정렬 콤보 갯수

    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchExepOrderStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),
    prdStore: Ext.create('Mplm.store.RecvPoDsmfPoPRD', {}),
    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    PmUserStore: Ext.create('Mplm.store.UserStore', {}),
    payTermsStore: Ext.create('Mplm.store.PaytermStore', {}),
    incotermsStore: Ext.create('Mplm.store.IncotermsStore', {}),
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_NEW_DIVISION' }),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_CONDITION' }),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_TYPE' }),

    searchPrdStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'PRD' }),
    searchAssyStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'ASSY' }),

    searchItemStore: Ext.create('Mplm.store.ProductStore', {}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SAMPLE_TYPE' })
});