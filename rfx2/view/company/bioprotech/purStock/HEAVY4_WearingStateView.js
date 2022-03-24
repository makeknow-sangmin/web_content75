Ext.require([
    'Ext.ux.CustomSpinner'
]);
Ext.define('Rfx2.view.company.bioprotech.purStock.HEAVY4_WearingStateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'wearing-view',
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;

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
        let buttonToolbar = this.createCommandToolbar();
        let searchToolbar = this.createSearchToolbar();

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

        let option = {
            features: {
                ftype: 'groupingsummary',
                groupHeaderTpl: '<div>입고번호 :: <span style="color: #003471; "><b>{[values.rows[0].data.gr_no]}</b></span> ({rows.length})</div>'
            }
        };
        this.localSize = gm.unlimitedPageSize;
        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.bioprotech.WearingState',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            pageSize: this.localSize, /*pageSize*/
        }, {
            //groupField: 'gr_no',
            groupDir: 'DESC'
        });

        for (let i = 0; i < this.columns.length; i++) {
            let o = this.columns[i];
            //console_logs('this.columns' + i, o);
            let dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'po_qty':
                case 'gr_qty':
                case 'sales_price':
                case 'gr_amount_Hj':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value) {
                        value = Ext.util.Format.number(value, '0,00/i');
                        value = '<span style="font-weight: bold; font-size:10pt; color:#000000;">' + value + '</span>'
                        return value;
                    };
                    break;
                default:
                    break;
            }

        }

        // remove the items
        (buttonToolbar.items).each(function (item, index) {
            if (index === 1 || index === 2 || index === 3 || index === 4 || index === 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.setRowClass(function (record) {
            let uid_srccst = record.get('uid_srccst');
            let change_reason = record.get('change_reason');
            console_logs('===dasdas', change_reason);
            if (uid_srccst !== undefined && uid_srccst !== null && uid_srccst > 1) {
                if (change_reason === '') {
                    return 'green-row';
                }
                let len = change_reason.split(',').length;

                if (len > 0) {
                    let s = change_reason.split(',')[0];
                    if (s === 'G') {
                        return 'yellow-row';
                    } else {
                        return 'green-row';
                    }
                }
            }
        });

        //그리드 생성
        let arr = [];

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

                let isPossible = true;
                let selections = gm.me().grid.getSelectionModel().getSelection();

                let isSameSellerName = true;
                let lastSeller = '';

                for (let i = 0; i < selections.length; i++) {
                    let seller_name = selections[i].get('seller_name');
                    let recv_flag = selections[i].get('recv_flag');

                    if (recv_flag != null && recv_flag !== '' && recv_flag !== 'D') {
                        isPossible = false;
                        break;
                    }

                    if (i === 0) {
                        lastSeller = seller_name;
                    } else {
                        if (lastSeller !== seller_name) {
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

                let height = 200;

                let requestText = '입고 내용을 수정합니다.';

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
                        renderer: function (value) {
                            if (value != null) {
                                value = Ext.util.Format.number(value, '0,00.#####');
                            } else {
                                value = 0;
                            }
                            return value;
                        }
                    }
                );

                let prWin = Ext.create('Ext.Window', {
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

                                let tableName = 'wgrast';
                                let whereField = 'gr_no';
                                let whereValue = gm.me().grid.getSelectionModel().getSelection()[0].get('gr_no');

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

        //구매자재 입고 포장별 바코드 출력 생성
        this.createGoodsIn = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '바코드 발행',
            tooltip: '자재 입고 바코드',
            disabled: true,
            handler: function () {

                // selections 교체
                let selections = gm.me().gridWearingState.getSelection();
                let barcode_list = [];

                //포장수량(바코드 수량과 1대1)
                let gr_Qty = null;
                let areaCode = null;
                let item_name = '';

                for (let i = 0; i < selections.length; i++) {
                    let rec = selections[i];

                    if (i === 0) {
                        item_name = rec.get('item_name');
                    }

                    console_logs('rec', rec);
                    let barcode = rec.get('barcode');
                    let srcahd_uid = rec.get('srcahd_uid');
                    barcode_list.push(barcode);

                    console_logs('srcahd_uid 출력 >>> ' + srcahd_uid);

                    gr_Qty = rec.get(('gr_qty'));
                    areaCode = rec.get(('area_code'));
                }
                //셀렉션 붙임 끝

                let barcodeForm = Ext.create('Ext.form.Panel', {
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

                let comboPrinter = gu.getCmp('printer');
                comboPrinter.store.load(
                    function () {
                        this.each(function (record) {
                            let system_code = record.get('system_code');
                            if (system_code === '192.168.20.11') {
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

                let prWin = Ext.create('Ext.Window', {
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

                            let wdSelection = gm.me().gridWearingState.getSelectionModel().getSelection();
                            let totalIndex = wdSelection.length;
                            let printQuanArray = [];   //출력 매수 배열

                            for (let i = 0; i < totalIndex; i++) {
                                printQuanArray.push(1);
                            }

                            if (btn === 'no') {
                                prWin.close();

                            } else {

                                if (printQuanArray.length === 0) {
                                    gm.me().showToast('오류', "출력할 항목을 추가하세요.");
                                    return;
                                }

                                prWin.setLoading(true);
                                // 이게 출력

                                let printIpAddress = gu.getCmp('printer').getValue();
                                let labelSize = gu.getCmp('print_label').getValue();

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBiotNewVer',
                                    params: {
                                        barcode_type: 'WGRAST',
                                        printIpAddress: printIpAddress,
                                        labelSize: labelSize,
                                        barcode_list: barcode_list,
                                        gr_date_list: "",
                                        ischeck: 'Y'
                                    },

                                    success: function () {

                                        Ext.Msg.alert('', '바코드 프린터 출력 요청을 성공하였습니다.');
                                        prWin.setLoading(false);
                                        prWin.close();
                                    },
                                    failure: function () {

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
                        this.removeGoAction
                    ]
                }
            ],
            columns: [
                {text: 'LOT NO', width: 80, style: 'text-align:center', dataIndex: 'area_code', sortable: false},
                {
                    text: '입고수량', width: 80, style: 'text-align:center', dataIndex: 'gr_qty', sortable: false,
                    renderer: function (value) {
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
            handler: function () {
                let rec = gm.me().grid.getSelectionModel().getSelection();

                let wgrast_uids = [];

                for (let i = 0; i < rec.length; i++) {
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
                    success: function (result) {
                        let jsonData = Ext.JSON.decode(result.responseText);
                        let pdfPath = jsonData.pdfPath;
                        console_log(pdfPath);
                        if (pdfPath.length > 0) {
                            top.location.href = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
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
            handler: function () {
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
                if (selections.length > 0) {

                    gm.me().wgrastUids = [];
                    gm.me().cancelQuans = [];
                    gm.me().lotNos = [];
                    gm.me().barcodes = [];

                    for (let i = 0; i < selections.length; i++) {
                        let recSub = selections[i];
                        gm.me().wgrastUids.push(recSub.get('id'));
                        gm.me().cancelQuans.push(recSub.get('gr_qty'));
                        gm.me().lotNos.push(recSub.get('area_code'));
                        gm.me().barcodes.push(recSub.get('barcode'));
                    }

                    gm.me().rec = selections[0];

                    gm.me().removeGoAction.enable();
                    gm.me().createGoodsIn.enable();
                } else {

                    gm.me().wgrastUids = [];
                    gm.me().cancelQuans = [];
                    gm.me().lotNos = [];
                    gm.me().barcodes = [];

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
                let rec = selections[0];
                let gr_no = rec.get('gr_no');
                gm.me().gridWearingState.getStore().getProxy().setExtraParam('gr_no', gr_no);
                gm.me().gridWearingState.getStore().getProxy().setExtraParam('barcode_state_list', 'P,G');
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

        let s_date = Ext.Date.add(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
        s_date = Ext.Date.format(s_date, 'Y-m-d');
        let e_date = new Date();
        e_date = Ext.Date.format(e_date, 'Y-m-d');

        this.store.getProxy().setExtraParam('gr_date', s_date + ':' + e_date);

        this.store.load(function () {
            let total_price_sum = 0;
            let total_qty = 0;
            for (let i = 0; i < gm.me().store.data.items.length; i++) {
                let t_rec = gm.me().store.data.items[i];
                total_price_sum += t_rec.get('gr_amount_Hj');
                total_qty += t_rec.get('curGr_qty');
            }
        });

    },
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
    deleteConfirm: function (btn, cancelContent) {

        if (btn !== 'yes') {
            return;
        }

        gm.me().setLoading(true);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/quality/wgrast.do?method=cancelGRRemoveBarcode',
            params: {
                cancelQuans: gm.me().cancelQuans,
                cancelContent: cancelContent,
                wgrastUids: gm.me().wgrastUids,
                lotNos: gm.me().lotNos,
                barcodes: gm.me().barcodes
            },
            success: function () {
                gm.me().showToast('결과', gm.me().wgrastUids.length + ' 건을 입고 취소하었습니다.');
                gm.me().getStore().load();
                gm.me().gridWearingState.getStore().load();
                gm.me().setLoading(false);
            },
            failure: extjsUtil.failureMessage
        });
    },

    //바코드 출력
    printBarcode: function () {

        let selections = gm.me().gridWearingState.getSelectionModel().getSelection();
        let item_name = '';

        let item_name_Arr = [];
        let compare_Arr = [];
        let uniqueIdArr = [];

        for (let selPos = 0; selPos < selections.length; selPos++) {
            let rec = selections[selPos];
            let uid = rec.get('unique_id');  //Srcahd unique_id
            item_name = rec.get('item_name');
            uniqueIdArr.push(uid);
            item_name_Arr.push(item_name);
            compare_Arr.push(item_name);
        }

        let checkCompare = 0;

        for (let i = 0; i < item_name_Arr.length; i++) {
            for (let j = 0; j < compare_Arr.length; j++) {
                if (item_name_Arr[i] === compare_Arr[j]) {
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
        }

    },

    uploadComplete: function (items) {

        console_logs('uploadComplete items', items);

        let output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });

        console_logs('파일업로드 결과', output);

        this.attachedFileStore.load(function (records) {
            if (records != null) {
                let o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('총수량 : ' + records.length);
                }

            }
        });
    },

    doCertOfCarryIn: function () {

        let selections = gm.me().grid.getSelectionModel().getSelection();

        let productGrid = Ext.create('Ext.grid.Panel', {
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
                edit: function (editor, e) {

                    gm.me().editRedord(e.field, e.record);
                }
            },
            dockedItems: []
        });

        for (let i = 0; i < selections.length; i++) {
            productGrid.getStore().add(selections[i]);
        }

        this.rtgapp_store = Ext.create('Rfx2.store.RtgappStore', {});
        this.rtgapp_store.getProxy().setExtraParam('change_type', 'D');
        this.rtgapp_store.getProxy().setExtraParam('app_type', 'CI');

        this.rtgapp_store.load();
        let userStore = Ext.create('Rfx2.store.company.bioprotech.UsrAstStore', {});
        userStore.getProxy().setExtraParam('email', '%protechsite.com%');
        userStore.getProxy().setExtraParam('limit', 1000);
        userStore.load();

        let removeRtgapp = Ext.create('Ext.Action', {
            itemId: 'removeRtgapp',
            iconCls: 'af-remove',
            text: CMD_DELETE,
            disabled: true,
            handler: function () {
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

        let updown =
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
                    handler: function (agridV, rowIndex) {
                        let record = gm.me().agrid.getStore().getAt(rowIndex);

                        let unique_id = record.get('unique_id');

                        let direcition = -15;

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappWithType',
                            params: {
                                direcition: direcition,
                                unique_id: unique_id,
                                appType: 'CI'
                            },
                            success: function () {
                                gm.me().rtgapp_store.load(function () {
                                });
                            }
                        });

                    }


                }, '-',
                    {
                        icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/down.png',
                        tooltip: 'Down',
                        handler: function (agridV, rowIndex) {

                            let record = gm.me().agrid.getStore().getAt(rowIndex);

                            let unique_id = record.get('unique_id');

                            let direcition = 15;
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappWithType',
                                params: {
                                    direcition: direcition,
                                    unique_id: unique_id,
                                    appType: 'CI'
                                },
                                success: function () {
                                    gm.me().rtgapp_store.load(function () {
                                    });
                                }
                            });
                        }

                    }]
            };

        let selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false});

        this.agrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('rtgAppGrid'),
            collapsible: false,
            viewConfig: {
                markDirty: false
            },
            width: 1050,
            height: 200,
            margin: '0 0 20 0',
            autoHeight: true,
            forceFit: false,
            store: this.rtgapp_store,
            selModel: selModel,
            columns: [
                {dataIndex: 'seq_no', text: '순서', width: 70, sortable: false},
                {
                    dataIndex: 'groupware_id', text: '아이디(그룹웨어)', width: 150, sortable: false,
                    renderer: function (value, metaData, record) {
                        let email = record.get('email');
                        let emailSplit = email.split('@');
                        let groupwareId = emailSplit[0];

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

                                let unique_id = record.get('unique_id');
                                let user_id = record.get('user_id');

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappWithType',
                                    params: {
                                        useruid: unique_id,
                                        userid: user_id,
                                        gubun: 'S',
                                        appType: 'CI'
                                    },
                                    success: function (result) {

                                        if (result.responseText === 'false') {
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

                                let unique_id = record.get('unique_id');
                                let user_id = record.get('user_id');

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappWithType',
                                    params: {
                                        useruid: unique_id,
                                        userid: user_id,
                                        gubun: 'D',
                                        appType: 'CI'
                                    },
                                    success: function (result) {
                                        if (result.responseText === 'false') {
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

        let form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
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
                                        let store = gm.me().readAndPublicStore;
                                        for (let i = 0; i < store.count(); i++) {
                                            let rec = store.getAt(i);
                                            let v000 = rec.get('v000');
                                            if (v000 === 'READ') {
                                                let values = [];
                                                for (let j = 2; j < 30; j++) {
                                                    let value = rec.get('v' + (j > 9 ? (j > 99 ? j : "0" + j) : "00" + j));
                                                    if (value == null || value.length === 0) {
                                                        break;
                                                    }
                                                    values.push(value);
                                                }
                                                this.setValue(values);
                                            }
                                        }
                                    },
                                    select: function (combo) {
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
                                        let store = gm.me().readAndPublicStore;
                                        for (let i = 0; i < store.count(); i++) {
                                            let rec = store.getAt(i);
                                            let v000 = rec.get('v000');
                                            if (v000 === 'PUBLIC') {
                                                let values = [];
                                                for (let j = 2; j < 30; j++) {
                                                    let value = rec.get('v' + (j > 9 ? (j > 99 ? j : "0" + j) : "00" + j));
                                                    if (value == null || value.length === 0) {
                                                        break;
                                                    }
                                                    values.push(value);
                                                }
                                                this.setValue(values);
                                            }
                                        }
                                    },
                                    select: function (combo) {
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

        let myWidth = 1100;
        let myHeight = 880;

        let prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '반입증 작성',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    prWin.setLoading(true);

                    let val = form.getValues(false);

                    let items = gm.me().rtgapp_store.data.items;

                    if (items.length < 2) {
                        Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                        return;
                    }

                    let ahid_userlist = [];
                    let ahid_userlist_role = [];
                    let ahid_userlist_id = [];

                    for (let aHidPos = 0; aHidPos < items.length; aHidPos++) {
                        let recAHidsUser = items[aHidPos];

                        ahid_userlist.push(recAHidsUser.get('usrast_unique_id'));
                        ahid_userlist_role.push(recAHidsUser.get('gubun'));
                        ahid_userlist_id.push(recAHidsUser.get('groupware_id'));
                    }
                    val['hid_userlist'] = ahid_userlist;
                    val['hid_userlist_role'] = ahid_userlist_role;
                    val['hid_userlist_id'] = ahid_userlist_id;

                    let reader = val['reader_list'];
                    let inspector = val['p_inspector_list'];

                    let newReader = [];
                    let newInspector = [];
                    let grNoList = [];

                    for (let rPos = 0; rPos < reader.length; rPos++) {

                        if (reader[rPos] !== '') {
                            let emailSplitR = reader[rPos].split('@');
                            newReader.push(emailSplitR[0]);
                        }
                    }

                    for (let insPos = 0; insPos < inspector.length; insPos++) {
                        if (inspector[insPos] !== '') {
                            let emailSplit = inspector[insPos].split('@');
                            newInspector.push(emailSplit[0]);
                        }
                    }

                    val['readerList'] = newReader;
                    val['pInspectorList'] = newInspector;

                    let selections = gm.me().grid.getSelectionModel().getSelection();
                    let ctTemplate = Ext.create('Rfx2.view.company.bioprotech.template.CertOfCarryInTemplate');

                    let tempObj = {};

                    tempObj['gr_date'] = selections[0].get('gr_date').substring(0, 10);
                    tempObj['seller_name'] = selections[0].get('seller_name');

                    let tempPos = 1;
                    let tempObjsSub = [];
                    let rowSize = selections.length > 10 ? selections.length : 10;

                    for (let i = 0; i < rowSize; i++) {

                        let tempObjvSub = {};

                        if (i < selections.length) {
                            let rec = selections[i];

                            let lotGroupQty = rec.get('lot_group_qty');
                            let lotGroupQtySplit = lotGroupQty.split(',');
                            let lotNoStr = '';

                            for (let j = 0; j < lotGroupQtySplit.length; j++) {
                                let lotNo = lotGroupQtySplit[j];
                                let lotNoSplit = lotNo.split(':');
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
                    let result = ctTemplate.apply(tempObj);

                    result = result.replace(/"/g, '\\"').replace(/\n/g, '').replace(/\t/g, '').replace(/ {2}/g, '');

                    val['carryInHtml'] = result;
                    val['grNoList'] = grNoList;
                    val['seller_name'] = selections[0].get('seller_name');
                    val['gr_date'] = selections[0].get('gr_date').substring(0, 10);


                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/quality/wgrast.do?method=sendCertOfCarryIn',
                        params: val,
                        success: function () {
                            prWin.setLoading(false);
                            prWin.close();
                            gm.me().store.load(function () {
                            });
                        },
                        failure: function () {
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
        let selections = gm.me().agrid.getSelectionModel().getSelection();
        if (selections) {
            if (result === 'yes') {

                for (let rtgAppPos = 0; rtgAppPos < selections.length; rtgAppPos++) {
                    let recRtgApp = selections[rtgAppPos];
                    let user_id = recRtgApp.get('user_id');

                    if (user_id === vCUR_USER_ID) {
                        Ext.Msg.alert('안내', '본인은 결재경로에서 삭제할 수 없습니다.', function () {
                        });
                        return;
                    }
                }

                for (let i = 0; i < selections.length; i++) {
                    let rec = selections[i];
                    let unique_id = rec.get('unique_id');

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgappWithType',
                        params: {
                            unique_id: unique_id,
                            appType: 'CI'
                        },
                        success: function () {
                            gm.me().agrid.store.load();
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    }); // endofajax
                }
                gm.me().agrid.store.remove(selections);
            }
        }
    },

    updateReadAndPublic: function (combo, category) {
        let store = gm.me().readAndPublicStore;
        let isExist = false;

        for (let i = 0; i < store.count(); i++) {
            let rec = store.getAt(i);
            let v000 = rec.get('v000');
            if (v000 === category) {
                let unique_id_long = rec.get('unique_id_long');
                let obj = {};
                obj['v000'] = category;
                obj['v001'] = 'CI';
                let pos = 2;
                for (let j = 0; j < combo.getValue().length; j++) {
                    let key = 'v' + (pos > 9 ? (pos > 99 ? pos : "0" + pos) : "00" + pos);
                    obj[key] = combo.getValue()[j];
                    pos++;
                }

                let bufValues = Ext.JSON.encode(obj);

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/buffer.do?method=editBufferForce',
                    params: {
                        unique_id_long: unique_id_long,
                        bufValues: bufValues
                    },
                    success: function () {
                        store.load();
                    },
                    failure: function (result, request) {

                    }
                });
                isExist = true;
                break;
            }
        }

        if (!isExist) {
            let objRP = {};
            objRP['v000'] = category;
            objRP['v001'] = 'CI';
            objRP['v002'] = combo.getValue()[0];
            let group_uid = vCUR_USER_UID;
            let type = 'READ_AND_PUBLIC';
            let bufValuesRP = Ext.JSON.encode(objRP);

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/buffer.do?method=createBuffer',
                params: {
                    group_uid: group_uid,
                    type: type,
                    bufValues: bufValuesRP
                },
                success: function () {
                    store.load();
                },
                failure: function (result, request) {

                }
            });

        }
    },
    items: [],
    cancelQuans: [],
    wgrastUids: [],
    lotNos: [],
    barcodes: [],
    poviewType: 'ALL'
});