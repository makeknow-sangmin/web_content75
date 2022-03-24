Ext.require([
    'Ext.ux.CustomSpinner'
]);
Ext.define('Rfx2.view.company.hsct.stockMgmt.HEAVY4_WearingStateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'wearing-view',
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = true;

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'dateRange',
            field_id: 'gr_date',
            text: "입고일자",
            //sdate: new Date(new Date().getFullYear() + '-01-01'),
            sdate: Ext.Date.add(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)),
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

        searchToolbar.insert(0, {
            xtype: 'checkbox',
            boxLabel: '묶어서 보기',
            cls: 'searchLabel',
            style: 'margin-right: 50px;',
            value: '0',
            handler: function (field, value) {
                gm.me().store.setConfig({
                    groupField: value ? 'gr_no' : null
                });
            }
        });

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
        arr.push(searchToolbar);

        this.readAndPublicStore = Ext.create('Rfx2.store.BufferStore', {});
        this.readAndPublicStore.getProxy().setExtraParam('group_uid', vCUR_USER_UID);
        this.readAndPublicStore.getProxy().setExtraParam('type', 'READ_AND_PUBLIC');
        this.readAndPublicStore.getProxy().setExtraParam('v001', 'CI');
        this.readAndPublicStore.getProxy().setExtraParam('target_uid', -1);
        this.readAndPublicStore.load();

        this.createCertOfCarryIn = Ext.create('Ext.Action', {
            iconCls: 'af-list-ul',
            text: gm.getMC('createCertOfCarryIn', '반입증작성'),
            hidden: gu.setCustomBtnHiddenProp('createCertOfCarryIn'),
            tooltip: '반입증을 작성합니다',
            disabled: true,
            handler: function () {

                var isPossible = true;
                var selections = gm.me().grid.getSelectionModel().getSelection();

                var isSameSellerName = true;
                var lastSeller = '';

                for (var i = 0; i < selections.length; i++) {
                    var seller_name = selections[i].get('seller_name');
                    var recv_flag = selections[i].get('recv_flag');

                    if (recv_flag != null && recv_flag != '' && recv_flag != 'D') {
                        isPossible = false;
                        break;
                    }

                    if (i == 0) {
                        lastSeller = seller_name;
                    } else {
                        if (lastSeller != seller_name) {
                            isSameSellerName = false;
                            break;
                        }
                    }
                }

                if (!isSameSellerName) {
                    Ext.Msg.alert('오류', '공급사가 동일하지 않습니다.');
                } else if (!isPossible) {
                    Ext.Msg.alert('오류', '반입증을 미작성했거나 반려 된 상태에서만 작성 가능합니다.')
                } else {
                    gm.me().doCertOfCarryIn();
                }
            }
        });

        //입고 처리 수정 Action 생성
        this.modifyGoAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '입고 내용을 수정합니다',
            disabled: true,
            handler: function () {

                gm.me().requestform = Ext.create('Ext.form.Panel', {

                    xtype: 'form',
                    frame: false,
                    border: false,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side',
                        margin: 10
                    },
                    items: []
                });

                var height = 200;

                var requestText = '입고 내용을 수정합니다.';

                gm.me().requestform.add(
                    {
                        xtype: 'label',
                        width: 340,
                        text: requestText
                    }
                );

                gm.me().requestform.add(
                    {
                        fieldLabel: '입고일자',
                        xtype: 'datefield',
                        value: gm.me().grid.getSelectionModel().getSelection()[0].get('gr_date'),
                        name: 'gr_date',
                        format: 'Y-m-d',
                        id: gu.id('gr_date'),
                        altFormats: 'm/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j|c',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d')
                    }
                );

                gm.me().requestform.add(
                    {
                        fieldLabel: '단가',
                        xtype: 'textfield',
                        step: 1,
                        value: gm.me().grid.getSelectionModel().getSelection()[0].get('sales_price'),
                        name: 'sales_price',
                        id: gu.id('sales_price'),
                        renderer: function (value, meta) {
                            if (value != null) {
                                value = Ext.util.Format.number(value, '0,00.#####');
                            } else {
                                value = 0;
                            }
                            return value;
                        }
                    }
                );

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '입고수정',
                    width: 380,
                    height: height,
                    items: gm.me().requestform,
                    buttons: [
                        {
                            text: CMD_OK,
                            //scope:this,
                            handler: function () {

                                var tableName = 'wgrast';
                                var whereField = 'gr_no';
                                var whereValue = gm.me().grid.getSelectionModel().getSelection()[0].get('gr_no');

                                gm.editAjax(tableName, 'gr_date', gu.getCmp('gr_date').getValue(), whereField, whereValue, {type: ''}, false);
                                gm.editAjax(tableName, 'sales_price', gu.getCmp('sales_price').getValue(), whereField, whereValue, {type: ''}, false);

                                if (prWin) {
                                    prWin.close();
                                }
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

        this.divisionBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '분할',
            tooltip: '바코드 분할',
            disabled: true,
            handler: function () {
                gm.me().divisionBarcode();
            }
        });

        this.mergeBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '병합',
            tooltip: '분할된 바코드를 하나의 바코드로 병합합니다.',
            disabled: true,
            handler: function () {

                Ext.MessageBox.show({
                    title: '바코드 병합',
                    msg: '분할된 바코드를 병합하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == 'no') {
                            return;
                        } else {

                            var selections = gm.me().gridWearingState.getSelection();

                            var barcode = selections[0].get('barcode');
                            var wgrast_uid = selections[0].get('unique_id');
                            var packing_quan = selections[0].get('packing_quan');

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales/productStock.do?method=barcodeActionByBioT',
                                params: {
                                    barcode: barcode,
                                    wgrast_uid: wgrast_uid,
                                    packing_quan: packing_quan,
                                    action_type: 'MERGE'
                                },
                                success: function (result, request) {
                                    Ext.MessageBox.alert('알림', '해당 건이 상태가 변경되었습니다.');
                                    currentTab.getStore().load();
                                }, // endofsuccess
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                });
            }
        });

        //구매자재 입고 포장별 바코드 출력 생성
        this.createGoodsIn = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '바코드 발행',
            tooltip: '자재 입고 바코드',
            disabled: true,
            handler: function () {

                // selections 교체

                var selections = gm.me().gridWearingState.getSelection();

                var ischeck = 'Y';

                if(selections.length < 0) {
                    ischeck = 'N';
                }

                var uniqueIdArr = [];
                var bararr = [];

                var barcode_list = [];

                var cartmap_uid_array = [];
                var srcahd_uid_array = [];
                var item_code_uid_array = [];
                var item_name_uid_array = [];
                var barcode_array = [];
                var item_name_zh_list = [];
                var gr_date_arr = [];
                var gr_quan_arr = [];
                var pcs_desc_arr = [];

                var productLotArray = [];

                var specArr = [];
                var lotinPut = null;
                //포장수량(바코드 수량과 1대1)
                var gr_Qty = null;
                var areaCode = null;


                for (var i = 0; i < selections.length; i++) {

                    var rec = selections[i];
                    console_logs('rec', rec);
                    var uid = rec.get('unique_id');  //wgrast_uid
                    var item_code = rec.get('srcahd_item_code');
                    var item_name = rec.get('srcahd_item_name');
                    var specification = rec.get('specification');
                    var lot_no = rec.get('area_code');
                    var lotinPut = rec.get('pcs_desc_group_assy');
                    var gr_date = rec.get('gr_date');
                    var item_name_zh = rec.get('srcahd_class_code');
                    var barcode = rec.get('barcode');
                    var barcode_cnt = rec.get('barcode_cnt');

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
                    barcode_array.push(barcode);

                    barcode_list.push(barcode);

                    console_logs('srcahd_uid 출력 >>> ' + srcahd_uid);

                    gr_Qty = rec.get(('gr_qty'));
                    areaCode = rec.get(('area_code'));


                    item_code_uid_array.push(item_code);
                    item_name_uid_array.push(item_name);
                    if(item_name_zh == null) {
                        item_name_zh == ' ';
                    }
                    item_name_zh_list.push(item_name_zh);
                    gr_date_arr.push(gr_date);
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

                                prWin.setLoading(true);
                                // 이게 출력

                                var printIpAddress = gu.getCmp('printer').getValue();
                                var labelSize = gu.getCmp('print_label').getValue();

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBiotNewVer',
                                    // url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBioT',
                                    params: {
                                            barcode_type: 'WGRAST',
                                            printIpAddress: printIpAddress,
                                            labelSize: labelSize,
                                            barcode_list: barcode_list,
                                            gr_date_list: " ",
                                            ischeck: 'Y',
                                        /*
                                        barcode_type: 'WGRAST',
                                        printIpAddress: printIpAddress,
                                        labelSize: labelSize,
                                        print_qty: printQuan,
                                        item_code_list: item_code_uid_array,
                                        item_name_list: item_name_uid_array,
                                        item_name_zh_list: item_name_zh_list,
                                        lot_no_list: productLotArray,
                                        spec_list: specArr,
                                        qaun_list: quanArray,
                                        gr_date_list: gr_date_arr,
                                        srcahd_uid_list: srcahd_uid_array,
                                        cartmap_uid_list: cartmap_uid_array,
                                        barcode_list: barcode_array,
                                        ischeck: ischeck,
                                        barcode_cnt_list: barcode_cnt_array
                                        // bm_quan_list: bm_quan_list                                        

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
                                        specArr: specArr,
                                        gr_date: gr_date
                                        */
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
                        this.createGoodsIn,
                        // this.divisionBarcodeAction,
                        // this.mergeBarcodeAction,
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
                            value = Ext.util.Format.number(value, '0,00.00/i');
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
                    collapsible: false,
                    collapsed: false,
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
        buttonToolbar.insert(1, this.createCertOfCarryIn);
        buttonToolbar.insert(1, this.modifyGoAction);
        buttonToolbar.insert(1, '-');


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
                    gm.me().createGoodsIn.enable();
                    gm.me().divisionBarcodeAction.enable();
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
                    gm.me().createGoodsIn.disable();
                    gm.me().divisionBarcodeAction.disable();
                    gm.me().mergeBarcodeAction.disable();
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
                gm.me().modifyGoAction.enable();
                gm.me().createCertOfCarryIn.enable();
            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;

                gm.me().fileAttach.disable();
                gm.me().printPDFAction.disable();
                gm.me().modifyGoAction.disable();
                gm.me().createCertOfCarryIn.disable();
            }

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

    prdivisionBarcode: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 분할 수량 입력',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var selections = gm.me().gridWearingState.getSelection();

                    var srcahd_uid = selections[0].get('srcahd_uid');
                    var wgrast_uid = selections[0].get('wgrast_uid');
                    var lot_no = selections[0].get('area_code');
                    var barcode = selections[0].get('barcode');

                    var form = gu.getCmp('formPanel').getForm();
                    var val = form.getValues(false);

                    form.submit({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=barcodeActionByBioT',

                        params: {
                            srcahd_uid: srcahd_uid,
                            wgrast_uid: wgrast_uid,
                            lot_no: lot_no,
                            barcode: barcode,
                            division_qty: val.division_qty,
                            action_type: "DIVISION"
                        },
                        success: function (val, action) {
                            prWin.close();
                            // gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                            gMain.gridWearingState.store.load(function () {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                            //    Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            gMain.gridWearingState.store.load(function () {
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

    items: [],
    arrGrqty: [],
    wgrast_uids: [],
    lot_nos: [],
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

    doCertOfCarryIn: function () {

        var selections = gm.me().grid.getSelectionModel().getSelection();

        var productGrid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('productGrid'),
            collapsible: false,
            multiSelect: false,
            width: 1050,
            height: 300,
            margin: '0 0 20 0',
            autoHeight: true,
            frame: false,
            border: true,
            forceFit: false,
            columns: [
                {text: '공급사', width: 100, dataIndex: 'seller_name', style: 'text-align:center', sortable: false},
                {text: '품번', width: 60, dataIndex: 'item_code', style: 'text-align:center', sortable: false},
                {text: '품명', width: 150, dataIndex: 'item_name', style: 'text-align:center', sortable: false},
                {
                    text: '규격',
                    width: 120,
                    dataIndex: 'specification',
                    style: 'text-align:center',
                    sortable: false
                },
                {
                    text: '주문수량', width: 75, dataIndex: 'po_qty', sortable: false,
                    style: 'text-align:center',
                    align: 'right',
                    renderer: renderDecimalNumber
                },
                {
                    text: '입고수량', width: 75, dataIndex: 'gr_qty', sortable: false,
                    style: 'text-align:center',
                    align: 'right',
                    renderer: renderDecimalNumber
                },
                {text: '단위', width: 40, dataIndex: 'unit_code', style: 'text-align:center', sortable: false},
                {
                    text: '단가',
                    width: 60,
                    dataIndex: 'sales_price',
                    style: 'text-align:center',
                    sortable: false,
                    align: 'right',
                    renderer: renderDecimalNumber
                },
                {
                    text: '통화', width: 80, dataIndex: 'sales_currency', sortable: false,
                    style: 'text-align:center'
                },
                {
                    text: '주문금액', width: 80, dataIndex: 'po_amount', sortable: false,
                    style: 'text-align:center',
                    align: 'right',
                    renderer: renderDecimalNumber
                },
                {
                    text: '입고급액',
                    width: 80,
                    dataIndex: 'gr_amount_Hj',
                    sortable: false,
                    style: 'text-align:center',
                    align: 'right',
                    renderer: renderDecimalNumber
                },
                {
                    text: '입고일자',
                    width: 80,
                    dataIndex: 'gr_date',
                    style: 'text-align:center',
                    sortable: false,
                    format: 'Y-m-d',
                    dateFormat: 'Y-m-d',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: '주문번호', width: 80, dataIndex: 'po_no', sortable: false,
                    style: 'text-align:center'
                },
                {
                    text: '입고번호', width: 80, dataIndex: 'gr_no', sortable: false,
                    style: 'text-align:center'
                }
            ],
            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            listeners: {
                edit: function (editor, e, eOpts) {

                    gm.me().editRedord(e.field, e.record);
                }
            },
            dockedItems: []
        });

        for (var i = 0; i < selections.length; i++) {
            productGrid.getStore().add(selections[i]);
        }

        this.rtgapp_store = Ext.create('Rfx2.store.RtgappStore', {});
        this.rtgapp_store.getProxy().setExtraParam('change_type', 'D');
        this.rtgapp_store.getProxy().setExtraParam('app_type', 'CI');

        this.rtgapp_store.load();
        var userStore = Ext.create('Rfx2.store.company.bioprotech.UsrAstStore', {});
        userStore.getProxy().setExtraParam('email', '%protechsite.com%');
        userStore.getProxy().setExtraParam('limit', 1000);
        userStore.load();

        var removeRtgapp = Ext.create('Ext.Action', {
            itemId: 'removeRtgapp',
            iconCls: 'af-remove',
            text: CMD_DELETE,
            disabled: true,
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: delete_msg_title,
                    msg: delete_msg_content,
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().deleteRtgappConfirm,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        var updown =
            {
                text: '이동',
                menuDisabled: true,
                sortable: false,
                xtype: 'actioncolumn',
                width: 70,
                align: 'center',
                items: [{
                    icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/up.png',
                    tooltip: 'Up',
                    handler: function (agridV, rowIndex, colIndex) {
                        var record = gm.me().agrid.getStore().getAt(rowIndex);

                        var unique_id = record.get('unique_id');

                        var direcition = -15;

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappWithType',
                            params: {
                                direcition: direcition,
                                unique_id: unique_id,
                                appType: 'CI'
                            },
                            success: function (result, request) {
                                gm.me().rtgapp_store.load(function () {
                                });
                            }
                        });

                    }


                }, '-',
                    {
                        icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/down.png',
                        tooltip: 'Down',
                        handler: function (agridV, rowIndex, colIndex) {

                            var record = gm.me().agrid.getStore().getAt(rowIndex);

                            var unique_id = record.get('unique_id');

                            var direcition = 15;
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappWithType',
                                params: {
                                    direcition: direcition,
                                    unique_id: unique_id,
                                    appType: 'CI'
                                },
                                success: function (result, request) {
                                    gm.me().rtgapp_store.load(function () {
                                    });
                                }
                            });
                        }

                    }]
            };

        var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false});

        this.agrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('rtgAppGrid'),
            collapsible: false,
            multiSelect: false,
            viewConfig: {
                markDirty: false
            },
            width: 1050,
            height: 200,
            margin: '0 0 20 0',
            autoHeight: true,
            forceFit: false,
            store: this.rtgapp_store,
            border: true,
            frame: true,
            selModel: selModel,
            columns: [
                {dataIndex: 'seq_no', text: '순서', width: 70, sortable: false},
                {
                    dataIndex: 'groupware_id', text: '아이디(그룹웨어)', width: 150, sortable: false,
                    renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                        var email = record.get('email');
                        var emailSplit = email.split('@');
                        var groupwareId = emailSplit[0];

                        record.set('groupware_id', groupwareId);

                        return groupwareId;
                    }
                }, {dataIndex: 'user_name', text: '이름', flex: 1, sortable: false}
                , {dataIndex: 'dept_name', text: '부서 명', width: 90, sortable: false}
                , {dataIndex: 'gubun', text: '구분', width: 50, sortable: false}
                , updown
            ],
            border: false,
            multiSelect: true,
            frame: false,
            dockedItems: [{
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype: 'label',
                        labelWidth: 20,
                        text: '합의'

                    }, {
                        id: gu.id('user_name_a'),
                        name: 'user_name_a',
                        xtype: 'combo',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        store: userStore,
                        labelSeparator: ':',
                        emptyText: dbm1_name_input,
                        displayField: 'user_name',
                        valueField: 'unique_id',
                        sortInfo: {field: 'user_name', direction: 'ASC'},
                        typeAhead: false,
                        hideLabel: true,
                        minChars: 2,
                        width: 250,
                        listConfig: {
                            loadingText: 'Searching...',
                            emptyText: 'No matching posts found.',
                            getInnerTpl: function () {
                                return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                            }
                        },
                        listeners: {
                            select: function (combo, record) {

                                var unique_id = record.get('unique_id');
                                var user_id = record.get('user_id');

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappWithType',
                                    params: {
                                        useruid: unique_id,
                                        userid: user_id,
                                        gubun: 'S',
                                        appType: 'CI'
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;

                                        if (result == 'false') {
                                            Ext.MessageBox.alert(error_msg_prompt, '동일한 사용자가 존재합니다.');
                                        } else {
                                            gm.me().rtgapp_store.load(function () {
                                            });
                                        }
                                    },
                                    failure: extjsUtil.failureMessage
                                });
                            }// endofselect
                        }
                    },
                    '-',
                    {
                        xtype: 'label',
                        labelWidth: 20,
                        text: '결재'

                    }, {
                        id: gu.id('user_name_b'),
                        name: 'user_name_b',
                        xtype: 'combo',
                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                        store: userStore,
                        labelSeparator: ':',
                        emptyText: dbm1_name_input,
                        displayField: 'user_name',
                        valueField: 'unique_id',
                        sortInfo: {field: 'user_name', direction: 'ASC'},
                        typeAhead: false,
                        hideLabel: true,
                        minChars: 2,
                        width: 250,
                        listConfig: {
                            loadingText: 'Searching...',
                            emptyText: 'No matching posts found.',
                            getInnerTpl: function () {
                                return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                            }
                        },
                        listeners: {
                            select: function (combo, record) {

                                var unique_id = record.get('unique_id');
                                var user_id = record.get('user_id');

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappWithType',
                                    params: {
                                        useruid: unique_id,
                                        userid: user_id,
                                        gubun: 'D',
                                        appType: 'CI'
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;

                                        if (result == 'false') {
                                            Ext.MessageBox.alert(error_msg_prompt, '동일한 사용자가 존재합니다.');
                                        } else {
                                            gm.me().rtgapp_store.load(function () {
                                            });
                                        }
                                    },
                                    failure: extjsUtil.failureMessage
                                });
                            }// endofselect
                        }
                    },
                    '->', removeRtgapp

                ]// endofitems
            }] // endofdockeditems

        }); // endof Ext.create('Ext.grid.Panel',

        this.agrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    removeRtgapp.enable();
                } else {
                    removeRtgapp.disable();
                }
            }
        });

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
                title: '공통/결재 정보',
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
                        defaultMargins: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 10
                        },
                        items: [
                            {
                                fieldLabel: '반입일자',
                                xtype: 'textfield',
                                width: '45%',
                                padding: '0 0 5px 30px',
                                value: selections[0].get('gr_date').substring(0, 10),
                                fieldStyle: 'background-color: #ddd; background-image: none;',
                                readOnly: true
                            }, {
                                fieldLabel: '반입처',
                                xtype: 'textfield',
                                width: '45%',
                                padding: '0 0 5px 30px',
                                fieldStyle: 'background-color: #ddd; background-image: none;',
                                value: selections[0].get('seller_name'),
                                readOnly: true
                            }, {
                                xtype: 'tagfield',
                                width: '92.8%',
                                padding: '0 0 5px 30px',
                                fieldLabel: '열람자',
                                name: 'reader_list',
                                id: gu.id('reader_list'),
                                store: userStore,
                                queryMode: 'local',
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                    }
                                },
                                displayField: 'user_name',
                                valueField: 'email',
                                filterPickList: true,
                                listeners: {
                                    afterrender: function () {
                                        var store = gm.me().readAndPublicStore;
                                        for (var i = 0; i < store.count(); i++) {
                                            var rec = store.getAt(i);
                                            var v000 = rec.get('v000');
                                            if (v000 == 'READ') {
                                                var values = [];
                                                for (var j = 2; j < 30; j++) {
                                                    var value = rec.get('v' + (j > 9 ? (j > 99 ? j : "0" + j) : "00" + j));
                                                    if (value == null || value.length == 0) {
                                                        break;
                                                    }
                                                    values.push(value);
                                                }
                                                this.setValue(values);
                                            }
                                        }
                                    },
                                    select: function (combo, record, eOpts) {
                                        gm.me().updateReadAndPublic(combo, 'READ');
                                    }
                                }
                            }, {
                                xtype: 'tagfield',
                                width: '92.8%',
                                padding: '0 0 5px 30px',
                                fieldLabel: '공람자',
                                name: 'p_inspector_list',
                                store: userStore,
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                    }
                                },
                                displayField: 'user_name',
                                valueField: 'email',
                                filterPickList: true,
                                listeners: {
                                    afterrender: function () {
                                        var store = gm.me().readAndPublicStore;
                                        for (var i = 0; i < store.count(); i++) {
                                            var rec = store.getAt(i);
                                            var v000 = rec.get('v000');
                                            if (v000 == 'PUBLIC') {
                                                var values = [];
                                                for (var j = 2; j < 30; j++) {
                                                    var value = rec.get('v' + (j > 9 ? (j > 99 ? j : "0" + j) : "00" + j));
                                                    if (value == null || value.length == 0) {
                                                        break;
                                                    }
                                                    values.push(value);
                                                }
                                                this.setValue(values);
                                            }
                                        }
                                    },
                                    select: function (combo, record, eOpts) {
                                        gm.me().updateReadAndPublic(combo, 'PUBLIC');
                                    }
                                }
                            },
                            this.agrid
                        ]
                    }
                ]
            }, {
                xtype: 'fieldset',
                frame: true,
                title: gm.me().getMC('msg_order_dia_prd_header_title', '상세정보'),
                width: '100%',
                height: '100%',
                layout: 'fit',
                bodyPadding: 10,
                defaults: {
                    margin: '2 2 2 2'
                },
                items: [
                    productGrid
                ]
            }
            ]
        });

        var myWidth = 1100;
        var myHeight = 880;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '반입증 작성',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {

                    prWin.setLoading(true);

                    var val = form.getValues(false);

                    var items = gm.me().rtgapp_store.data.items;

                    if (items.length < 2) {
                        Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                        return;
                    }

                    var ahid_userlist = new Array();
                    var ahid_userlist_role = new Array();
                    var ahid_userlist_id = new Array();

                    for (var i = 0; i < items.length; i++) {
                        var rec = items[i];

                        ahid_userlist.push(rec.get('usrast_unique_id'));
                        ahid_userlist_role.push(rec.get('gubun'));
                        ahid_userlist_id.push(rec.get('groupware_id'));
                    }
                    val['hid_userlist'] = ahid_userlist;
                    val['hid_userlist_role'] = ahid_userlist_role;
                    val['hid_userlist_id'] = ahid_userlist_id;

                    var reader = val['reader_list'];
                    var inspector = val['p_inspector_list'];

                    var newReader = [];
                    var newInspector = [];
                    var grNoList = [];

                    for (var i = 0; i < reader.length; i++) {

                        if (reader[i] !== '') {
                            var emailSplit = reader[i].split('@');
                            var groupwareId = emailSplit[0];
                            newReader.push(groupwareId);
                        }
                    }

                    for (var i = 0; i < inspector.length; i++) {
                        if (inspector[i] !== '') {
                            var emailSplit = inspector[i].split('@');
                            var groupwareId = emailSplit[0];
                            newInspector.push(groupwareId);
                        }
                    }

                    val['readerList'] = newReader;
                    val['pInspectorList'] = newInspector;

                    var selections = gm.me().grid.getSelectionModel().getSelection();
                    var ctTemplate = Ext.create('Rfx2.view.company.bioprotech.template.CertOfCarryInTemplate');

                    var tempObj = {};

                    tempObj['gr_date'] = selections[0].get('gr_date').substring(0, 10);
                    tempObj['seller_name'] = selections[0].get('seller_name');

                    var tempPos = 1;
                    var tempObjsSub = [];
                    var rowSize = selections.length > 10 ? selections.length : 10;

                    for (var i = 0; i < rowSize; i++) {

                        var tempObjvSub = {};

                        if (i < selections.length) {
                            var rec = selections[i];

                            var lotGroupQty = rec.get('lot_group_qty');
                            var lotGroupQtySplit = lotGroupQty.split(',');
                            var lotNoStr = '';

                            for (var j = 0; j < lotGroupQtySplit.length; j++) {
                                var lotNo = lotGroupQtySplit[j];
                                var lotNoSplit = lotNo.split(':');
                                lotNoStr += lotNoSplit[0] + '(' + Ext.util.Format.number(lotNoSplit[1], '0,00.#####') + ')';
                                if (j < lotGroupQtySplit.length - 1) {
                                    lotNoStr += ', ';
                                }
                            }

                            tempObjvSub['num'] = tempPos;
                            tempObjvSub['item_code'] = rec.get('item_code');
                            tempObjvSub['item_name'] = rec.get('item_name');
                            tempObjvSub['lot_no'] = lotNoStr;
                            tempObjvSub['gr_quan'] = rec.get('gr_qty');
                            tempObjvSub['po_no'] = rec.get('po_no');
                            tempObjvSub['unit_code'] = rec.get('unit_code');
                            tempObjvSub['specification'] = rec.get('specification');
                            grNoList.push(rec.get('gr_no'));
                        } else {
                            tempObjvSub['num'] = tempPos;
                            tempObjvSub['item_code'] = '';
                            tempObjvSub['item_name'] = '';
                            tempObjvSub['lot_no'] = '';
                            tempObjvSub['gr_quan'] = '';
                            tempObjvSub['po_no'] = '';
                            tempObjvSub['unit_code'] = '';
                            tempObjvSub['specification'] = '';
                        }

                        tempObjsSub.push(tempObjvSub);

                        tempPos++;
                    }
                    tempObj['itemValues'] = tempObjsSub;
                    var result = ctTemplate.apply(tempObj);

                    result = result.replace(/"/g, '\\"').replace(/\n/g, '').replace(/\t/g, '').replace(/  /g, '');

                    val['carryInHtml'] = result;
                    val['grNoList'] = grNoList;
                    val['seller_name'] = selections[0].get('seller_name');
                    val['gr_date'] = selections[0].get('gr_date').substring(0, 10);


                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/quality/wgrast.do?method=sendCertOfCarryIn',
                        params: val,
                        success: function (val, action) {
                            prWin.setLoading(false);
                            prWin.close();
                            gm.me().store.load(function () {
                            });
                        },
                        failure: function (val, action) {
                            prWin.setLoading(false);

                            prWin.close();
                            gm.me().store.load(function () {
                            });

                        }
                    });
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
    },
    deleteRtgappConfirm: function (result) {
        console_logs('result', result)
        var selections = gm.me().agrid.getSelectionModel().getSelection();
        if (selections) {
            //var result = MessageBox.msg('{0}', btn);
            if (result == 'yes') {

                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var user_id = rec.get('user_id');

                    if (user_id == vCUR_USER_ID) {
                        Ext.Msg.alert('안내', '본인은 결재경로에서 삭제할 수 없습니다.', function () {
                        });
                        return;
                    }
                }

                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var unique_id = rec.get('unique_id');

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgappWithType',
                        params: {
                            unique_id: unique_id,
                            appType: 'CI'
                        },
                        success: function (result, request) {
                            gm.me().agrid.store.load();
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    }); // endofajax
                }
                gm.me().agrid.store.remove(selections);
            }
        }
    },

    updateReadAndPublic: function(combo, category) {
        var store = gm.me().readAndPublicStore;
        var isExist = false;

        for (var i = 0; i < store.count(); i++) {
            var rec = store.getAt(i);
            var v000 = rec.get('v000');
            if (v000 == category) {
                var unique_id_long = rec.get('unique_id_long');
                var obj = {};
                obj['v000'] = category;
                obj['v001'] = 'CI';
                var pos = 2;
                for (var j = 0; j < combo.getValue().length; j++) {
                    var key = 'v' + (pos > 9 ? (pos > 99 ? pos : "0" + pos) : "00" + pos);
                    obj[key] = combo.getValue()[j];
                    pos++;
                }

                var bufValues = Ext.JSON.encode(obj);

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/buffer.do?method=editBufferForce',
                    params: {
                        unique_id_long: unique_id_long,
                        bufValues: bufValues
                    },
                    success : function(result, request) {
                        store.load();
                    },
                    failure: function(result, request) {

                    }
                });
                isExist = true;
                break;
            }
        }

        if (!isExist) {
            var obj = {};
            obj['v000'] = category;
            obj['v001'] = 'CI';
            obj['v002'] = combo.getValue()[0];
            var group_uid = vCUR_USER_UID;
            var type = 'READ_AND_PUBLIC';
            var bufValues = Ext.JSON.encode(obj);

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/buffer.do?method=createBuffer',
                params: {
                    group_uid: group_uid,
                    type: type,
                    bufValues: bufValues
                },
                success : function(result, request) {
                    store.load();
                },
                failure: function(result, request) {

                }
            });

        }
    }
});





