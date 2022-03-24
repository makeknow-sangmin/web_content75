Ext.define('Rfx2.view.company.bioprotech.stockMgmt.StockMgmtNstoCkView', {
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
            , defaultValue: '0'
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
        let buttonToolbar = this.createCommandToolbar();

        this.warehouseStore = Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {});

        this.warehouseStore.load();

        this.splitMtrlAction = Ext.create('Ext.Action', {
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '자재분할',
            tooltip: 'SPLIT자재의 부모자재를 자식자재로 분할합니다.',
            hidden: gu.setCustomBtnHiddenProp('splitMtrlAction'),
            disabled: true,
            handler: function () {
                /*
                    너무 길어지면 함수 따로 뺄 예정
                 */
                let selection = gm.me().grid.getSelectionModel().getSelection();
                let rec = selection[0];
                let exchange_flag = rec.get('exchange_flag');

                if (exchange_flag === 'M') {

                    let barcodeStore = Ext.create('Rfx2.store.company.bioprotech.BarcodeStockStore', {});
                    let childSplitStore = Ext.create('Rfx2.store.company.bioprotech.ChildSplitMtrlStore', {});

                    let barcodeGrid = Ext.create('Ext.grid.Panel', {
                        store: barcodeStore,
                        cls: 'rfx-panel',
                        id: gu.id('barcodeGrid'),
                        collapsible: false,
                        multiSelect: false,
                        width: 550,
                        height: 250,
                        margin: '0 0 0 0',
                        viewConfig: {
                            markDirty: false
                        },
                        autoScroll: true,
                        selModel: 'checkboxmodel',
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 1
                        },
                        frame: false,
                        border: true,
                        forceFit: false,
                        columns: [
                            {
                                text: '바코드번호',
                                width: 300,
                                dataIndex: 'barcode',
                                style: 'text-align:center',
                                sortable: false
                            },
                            {
                                text: '포장수량', width: 200, dataIndex: 'packing_quan', sortable: false,
                                style: 'text-align:center',
                                align: 'right',
                                renderer: renderDecimalNumber
                            }
                        ],
                        items:[
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
                                        id: gu.id('GridResult'),
                                        xtype: 'label',
                                        html: '',
                                        result: false
                                    }
                                ]
                            } 
                        ],
                        listeners: {
                            selectionchange: function (grid, selected) {
    
                                let quan = 0;
                                let lblGridResult = gu.getCmp('GridResult');
    
                                for (let i = 0; i < selected.length; i++) {
                                    let grQuan = selected[i].get('packing_quan');
                                    quan += grQuan;
                                }
    
                                if (selected.length === 0) {
                                    lblGridResult.setHtml('<b>바코드를 선택하시기 바랍니다.</b>');
                                } else {
                                    lblGridResult.setHtml('<b>수량 합계 : ' + renderDecimalNumber(quan) + '</b>');
                                }
    
                            } 
                        }

                    });

                    let childSplitGrid = Ext.create('Ext.grid.Panel', {
                        store: childSplitStore,
                        cls: 'rfx-panel',
                        id: gu.id('childSplitGrid'),
                        collapsible: false,
                        multiSelect: false,
                        width: 550,
                        height: 300,
                        margin: '0 0 0 0',
                        viewConfig: {
                            markDirty: false
                        },
                        autoScroll: true,
                        selModel: 'checkboxmodel',
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 1
                        },
                        frame: false,
                        border: true,
                        forceFit: false,
                        columns: [
                            {
                                text: '품번',
                                width: 90,
                                dataIndex: 'item_code',
                                style: 'text-align:center',
                                sortable: false
                            },
                            {
                                text: '품명',
                                width: 200,
                                dataIndex: 'item_name',
                                style: 'text-align:center',
                                sortable: false
                            },
                            {
                                text: '규격',
                                width: 150,
                                dataIndex: 'specificaiton',
                                style: 'text-align:center',
                                sortable: false
                            },
                            {
                                text: '분할단위',
                                width: 80,
                                dataIndex: 'bm_quan',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: false
                            }
                        ],
                        listeners: {}
                    });

                    let recSub = gm.me().grid.getSelectionModel().getSelection()[0];
                    let rec_second = gm.me().detailStockGrid.getSelectionModel().getSelection()[0];

                    let form = Ext.create('Ext.form.Panel', {
                        id: gu.id('formPanel'),
                        xtype: 'form',
                        frame: false,
                        border: false,
                        width: '100%',
                        layout: 'column',
                        bodyPadding: 10,
                        items: [
                            {
                                xtype: 'fieldset',
                                frame: true,
                                title: '바코드 리스트',
                                layout: 'fit',
                                items: [
                                    barcodeGrid
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
                                        id: gu.id('GridResult'),
                                        xtype: 'label',
                                        html: '',
                                        result: false
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                frame: true,
                                title: '자식자재 리스트',
                                layout: 'fit',
                                items: [
                                    childSplitGrid
                                ]
                            }
                            
                        ]
                    });

                    let myWidth = 600;
                    let myHeight = 620;

                    let prWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: '부모자재를 자식자재로 분할합니다.',
                        width: myWidth,
                        height: myHeight,
                        plain: true,
                        items: form,
                        buttons: [{
                            text: '분할 실행',
                            handler: function () {

                                let oBarcodeArr = [];
                                let oldQuanArr = [];
                                let childSplitRec = childSplitGrid.getSelectionModel().getSelection()[0];
                                let barcodeSelections = barcodeGrid.getSelectionModel().getSelection();
                                // let oBarcdoeSp = '';
                                let lotNo = '';

                                for (let i = 0; i < barcodeSelections.length; i++) {
                                    let barcodeRec = barcodeSelections[i];
                                    let oBarcode = barcodeRec.get('barcode');
                                    if (i === 0) {
                                        lotNo = barcodeRec.get('lot_no');
                                    }
                                    let oldQuan = barcodeRec.get('packing_quan');

                                    oBarcodeArr.push(oBarcode);
                                    oldQuanArr.push(oldQuan);
                                }


                                let itemCode = childSplitRec.get('item_code');
                                let splitQuan = childSplitRec.get('bm_quan');

                                let nBarcode = '03' + itemCode + lotNo;

                                let msgHeader = '다음과 같은 사항이 변경 됩니다.';
                                let line = '──────────────────────────────────────────';
                                let msgBodyMtrlNo = '변경되는 바코드번호: ' + nBarcode;
                                let msgBodySplitQuan = '분할되는 바코드 수: ' + splitQuan;
                                let msgFooter = '기존 바코드는 폐기 됩니다. 계속 진행하시겠습니까?';

                                let newSrcahdUid = childSplitRec.get('unique_id_long');
                                let whouseUid = recSub.get('whouse_uid');
                                let oldSrcahdUid = recSub.get('uid_srcahd');
                                let oldStodtlUid = rec_second.get('unique_id_long');

                                Ext.MessageBox.show({
                                    title: '확인',
                                    msg: msgHeader + '<br/>' + line + '<br/>' + msgBodyMtrlNo + '<br/>'
                                        + msgBodySplitQuan + '<br/>' + line + '<br/>' + msgFooter,
                                    buttons: Ext.MessageBox.YESNO,
                                    fn: function (result) {
                                        if (result === 'yes') {

                                            prWin.setLoading(true);

                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/purchase/material.do?method=splitMtrlByBarcode',
                                                params: {
                                                    lotNo: lotNo,
                                                    splitQuan: splitQuan,
                                                    oldQuanArr: oldQuanArr,
                                                    oldBarcodeArr: oBarcodeArr,
                                                    newBarcode: nBarcode,
                                                    oldSrcahdUid: oldSrcahdUid,
                                                    newSrcahdUid: newSrcahdUid,
                                                    whouseUid: whouseUid,
                                                    oldStodtlUid: oldStodtlUid
                                                },
                                                success: function () {
                                                    prWin.setLoading(false);
                                                    gm.me().detailStockGrid.getStore().load();
                                                    gm.me().grid.getStore().load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                },
                                                failure: function (result, request) {
                                                    extjsUtil.failureMessage(result, request);
                                                    prWin.setLoading(false);
                                                    gm.me().detailStockGrid.getStore().load();
                                                    gm.me().grid.getStore().load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                }
                                            }); //end of ajax
                                        }
                                    },
                                    icon: Ext.MessageBox.QUESTION
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

                    let rec = gm.me().grid.getSelectionModel().getSelection()[0];
                    let stodtlRec = gm.me().detailStockGrid.getSelectionModel().getSelection()[0];

                    let srcahd_uid = rec.get('uid_srcahd'); // 이동하려는 품목
                    let comcst_uid = rec.get('whouse_comcst_uid'); //SITE
                    let stodtl_uid = stodtlRec.get('unique_id_long');

                    childSplitStore.getProxy().setExtraParam('parent', srcahd_uid);
                    childSplitStore.load();

                    barcodeStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                    barcodeStore.getProxy().setExtraParam('stodtl_uid', stodtl_uid);
                    barcodeStore.getProxy().setExtraParam('comcst_uid', comcst_uid);
                    barcodeStore.load(function (record) {

                    });
                } else {
                    Ext.Msg.alert('알림', 'SPLIT 가능한 품목이 아닙니다.');
                }
            }
        });

        /** 바코드 분할 버튼**/
        this.divisionBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '분할',
            tooltip: '바코드 분할',
            disabled: true,
            handler: function () {
                // let selections = gm.me().detailStockGrid.getSelection();
                // let rec = selections[0];

                // let lotNoArr = [];
                // let srcahdUidArr = [];
                // for (let i = 0; i < selections.length; i++) {
                //     let lot_no = selections[i].get('lot_no');
                //     let srcahd_uid = selections[i].get('uid_srcahd');

                //     lotNoArr.push(lot_no);
                //     srcahdUidArr.push(srcahd_uid);
                // }
                // gm.me().barcodeListStore.removeAll();
                // gm.me().barcodeListStore.getProxy().setExtraParam('srcahdUidArr', srcahdUidArr);
                // gm.me().barcodeListStore.getProxy().setExtraParam('lotNoArr', lotNoArr);
                // gm.me().barcodeListStore.getProxy().setExtraParam('stodtl_uid', rec.get('unique_id_long'));
                // gm.me().barcodeListStore.load();

                let barcodeStore = Ext.create('Rfx2.store.company.bioprotech.BarcodeStockStore', {});

                let recMain = gm.me().grid.getSelectionModel().getSelection()[0];
                let stodtlRec = gm.me().detailStockGrid.getSelectionModel().getSelection();

                let srcahd_uid = recMain.get('uid_srcahd'); // 이동하려는 품목
                let comcst_uid = recMain.get('whouse_comcst_uid'); //SITE

                let stodtl_uids = [];

                for (let i = 0; i < stodtlRec.length; i++) {
                    stodtl_uids.push(stodtlRec[i].get('unique_id_long'));
                }

                barcodeStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                barcodeStore.getProxy().setExtraParam('stodtl_uids', stodtl_uids);
                barcodeStore.getProxy().setExtraParam('comcst_uid', comcst_uid);
                barcodeStore.load(function (record) {});

           

                let barcodeListForm = Ext.create('Ext.grid.Panel', {
                    cls: 'rfx-panel',
                    store: barcodeStore,
                    autoScroll: true,
                    autoHeight: true,
                    collapsible: false,
                    overflowY: 'scroll',
                    multiSelect: false,
                    width: '99%',
                    title: '분할할 바코드를 선택하십시오.',
                    margin: '0 0 0 0',
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
                            align: 'right',
                            renderer: function (value) {
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        }
                    ],
                    listeners: {
                        selectionchange: function (grid, selected) {

                            let quan = 0;
                            let lblGridResult = gu.getCmp('GridResult');

                            for (let i = 0; i < selected.length; i++) {
                                let grQuan = selected[i].get('packing_quan');
                                quan += grQuan;
                            }

                            if (selected.length === 0) {
                                lblGridResult.setHtml('<b>바코드를 선택하시기 바랍니다.</b>');
                            } else {
                                lblGridResult.setHtml('<b>수량 합계 : ' + renderDecimalNumber(quan) + '</b>');
                            }

                        }
                        
                    }
                });

                let form = Ext.create('Ext.form.Panel', {
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
                                    ],

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
                                            id: gu.id('GridResult'),
                                            xtype: 'label',
                                            html: '',
                                            result: false
                                        }
                                    ]
                                }
                            ]
                        }, barcodeListForm,
                        
                    ]

                });

                prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '바코드 분할',
                    width: 500,
                    height: 400,
                    plain: true,
                    items: form,
                    overflowY: 'scroll',
                    buttons: [{
                        text: '바코드 분할',
                        handler: function (btn) {
                            if (btn === 'no') {
                                prWin.close();

                            } else {
                                let barcodeSelection = gu.getCmp('barcodeList').getSelectionModel().getSelected().items;
                                let rec = barcodeSelection[0];

                                let srcahd_uid = rec.get('srcahd_uid');
                                let cartmap_uid = rec.get('cartmap_uid');
                                let lot_no = rec.get('lot_no');
                                let barcode = rec.get('barcode');

                                let val = form.getValues(false);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=barcodeActionByBioT',
                                    params: {
                                        srcahd_uid: srcahd_uid,
                                        cartmap_uid: cartmap_uid,
                                        lot_no: lot_no,
                                        barcode: barcode,
                                        division_qty: val.division_qty,
                                        action_type: "DIVISION"
                                    },

                                    success: function () {

                                        Ext.Msg.alert('', '바코드 분할이 완료되었습니다.');

                                        prWin.setLoading(false);
                                        prWin.close();

                                    },

                                    failure: function () {

                                        Ext.Msg.alert('오류', '바코드 분할에 실패하였습니다.</br>바코드 정보를 확인하시기 바랍니다.');

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

        /** 바코드 병합 버튼**/
        this.mergeBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '병합',
            tooltip: '바코드 병합',
            disabled: true,
            handler: function () {
                let barcodeStore = Ext.create('Rfx2.store.company.bioprotech.BarcodeStockStore', {});

                let recMain = gm.me().grid.getSelectionModel().getSelection()[0];
                let stodtlRec = gm.me().detailStockGrid.getSelectionModel().getSelection();

                let srcahd_uid = recMain.get('uid_srcahd'); // 이동하려는 품목
                let comcst_uid = recMain.get('whouse_comcst_uid'); //SITE

                let stodtl_uids = [];

                for (let i = 0; i < stodtlRec.length; i++) {
                    stodtl_uids.push(stodtlRec[i].get('unique_id_long'));
                }

                barcodeStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                barcodeStore.getProxy().setExtraParam('stodtl_uids', stodtl_uids);
                barcodeStore.getProxy().setExtraParam('comcst_uid', comcst_uid);
                barcodeStore.load(function (record) {});
                // let selections = gm.me().detailStockGrid.getSelection();
                // let rec = selections[0];

                // let lotNoArr = [];
                // let srcahdUidArr = [];
                // for (let i = 0; i < selections.length; i++) {
                //     let lot_no = selections[i].get('lot_no');
                //     let srcahd_uid = selections[i].get('uid_srcahd');

                //     lotNoArr.push(lot_no);
                //     srcahdUidArr.push(srcahd_uid);
                // }
                // gm.me().barcodeListStore.removeAll();
                // gm.me().barcodeListStore.getProxy().setExtraParam('srcahdUidArr', srcahdUidArr);
                // gm.me().barcodeListStore.getProxy().setExtraParam('lotNoArr', lotNoArr);
                // gm.me().barcodeListStore.getProxy().setExtraParam('stodtl_uid', rec.get('unique_id_long'));
                // gm.me().barcodeListStore.load();


                let barcodeListForm = Ext.create('Ext.grid.Panel', {
                    cls: 'rfx-panel',
                    store: barcodeStore,
                    autoScroll: true,
                    autoHeight: true,
                    collapsible: false,
                    overflowY: 'scroll',
                    multiSelect: false,
                    width: '99%',
                    title: '병합할 바코드를 선택해주세요.',
                    margin: '0 0 0 0',
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
                            align: 'right',
                            renderer: function (value) {
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        }
                    ],
                    items:[
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
                                        id: gu.id('GridResult'),
                                        xtype: 'label',
                                        html: '',
                                        result: false
                                    }
                                ]
                            },  
                    ],
                    listeners: {
                        selectionchange: function (grid, selected) {

                            let quan = 0;
                            let lblGridResult = gu.getCmp('GridResult');

                            for (let i = 0; i < selected.length; i++) {
                                let grQuan = selected[i].get('packing_quan');
                                quan += grQuan;
                            }

                            if (selected.length === 0) {
                                lblGridResult.setHtml('<b>바코드를 선택하시기 바랍니다.</b>');
                            } else {
                                lblGridResult.setHtml('<b>수량 합계 : ' + renderDecimalNumber(quan) + '</b>');
                            }

                        }
                        
                    }
                });

                let form = Ext.create('Ext.form.Panel', {
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
                    items:[
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
                                    id: gu.id('GridResult'),
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
                            items: [barcodeListForm]
                        }
                      
                        
                    ]
                   
                });

                prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '바코드 병합',
                    width: 500,
                    height: 400,
                    plain: true,
                    items: form,
                    overflowY: 'scroll',
                    buttons: [{
                        text: '바코드 병합',
                        handler: function (btn) {
                            if (btn === 'no') {
                                prWin.close();

                            } else {
                                let barcodeSelection = gu.getCmp('barcodeList').getSelectionModel().getSelected().items;
                                let rec = barcodeSelection[0];

                                let cartmap_uid = rec.get('cartmap_uid');
                                let barcode = rec.get('barcode');

                                let mergeBarcodes = [];
                                let packing_quan_sum = 0;

                                let temp_arr = [];

                                for (let i = 0; i < barcodeSelection.length; i++) {
                                    let barcode = barcodeSelection[i].get('barcode');
                                    let sum = barcodeSelection[i].get('packing_quan');

                                    packing_quan_sum += sum;

                                    let temp_str = barcode.substring(barcode.indexOf('-')+1, barcode.length);

                                    temp_arr.push(temp_str);
                                    mergeBarcodes.push(barcode);
                                }

                                let min = Math.min(...temp_arr);
                                
                                let barcode_num = '';
                                if(min < 10) {
                                    barcode_num = '000' + min;
                                } else if(min < 100) {
                                    barcode_num = '00' + min; 
                                } else {
                                    barcode_num = '0' + min; 
                                }
                                // 선택된 바코드들 중에서 가장 먼저 입고/생산되 바코드를 찾기 위해
                                // 바코드 일련번호만 따로 배열에 담아서 그 중에서 숫자가 작은 것을 찾는 것

                                let barcode_str = barcode.substring(0, barcode.indexOf('-')+1);

                                barcode = barcode_str + barcode_num;

                                let barcode_index = mergeBarcodes.indexOf(barcode);
         
                                mergeBarcodes.splice(barcode_index, 1);


                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=barcodeActionByBioT',
                                    params: {
                                        cartmap_uid: cartmap_uid,
                                        barcode: barcode,  // 기준바코드
                                        mergeBarcodes: mergeBarcodes,
                                        packing_quan_sum: packing_quan_sum,
                                        action_type: "MERGE"
                                    },

                                    success: function () {

                                        Ext.Msg.alert('', '바코드 병합이 완료되었습니다.');

                                        prWin.setLoading(false);
                                        prWin.close();

                                    },

                                    failure: function () {

                                        Ext.Msg.alert('오류', '바코드 병합에 실패하였습니다.</br>바코드 정보를 확인하시기 바랍니다.');

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

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin/menu.do?method=defaultGet',
            params: {
                paramName: 'PRINTER_INFO'
            },
            success: function (result) {
                gm.me().printerStore.getProxy().setExtraParam('query', result.responseText);
                gm.me().printerStore.load();
            },
            failure: function () {
                console_log('fail defaultGet');
            }
        });

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin/menu.do?method=defaultGet',
            params: {
                paramName: 'LABEL_INFO'
            },
            success: function (result) {
                gm.me().printLabelStore.getProxy().setExtraParam('query', result.responseText);
                gm.me().printLabelStore.load();
            },
            failure: function () {
                console_log('fail defaultGet');
            }
        });

        /** 바코드 재발행 버튼 **/
        this.barcodeReissueAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '재발행',
            tooltip: '바코드 재발행',
            disabled: true,
            handler: function () {

                // let selections = gm.me().detailStockGrid.getSelection();
                // let rec = selections[0];

                // let lotNoArr = [];
                // let srcahdUidArr = [];
                // for (let i = 0; i < selections.length; i++) {
                //     let lot_no = selections[i].get('lot_no');
                //     let srcahd_uid = selections[i].get('uid_srcahd');

                //     lotNoArr.push(lot_no);
                //     srcahdUidArr.push(srcahd_uid);
                // }
                // gm.me().barcodeListStore.removeAll();
                // gm.me().barcodeListStore.getProxy().setExtraParam('srcahdUidArr', srcahdUidArr);
                // gm.me().barcodeListStore.getProxy().setExtraParam('lotNoArr', lotNoArr);
                // gm.me().barcodeListStore.getProxy().setExtraParam('stodtl_uid', rec.get('unique_id_long'));
                // gm.me().barcodeListStore.load();

                let barcodeStore = Ext.create('Rfx2.store.company.bioprotech.BarcodeStockStore', {});

                let recMain = gm.me().grid.getSelectionModel().getSelection()[0];
                let stodtlRec = gm.me().detailStockGrid.getSelectionModel().getSelection();

                let srcahd_uid = recMain.get('uid_srcahd'); // 이동하려는 품목
                let comcst_uid = recMain.get('whouse_comcst_uid'); //SITE

                let stodtl_uids = [];

                for (let i = 0; i < stodtlRec.length; i++) {
                    stodtl_uids.push(stodtlRec[i].get('unique_id_long'));
                }

                barcodeStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                barcodeStore.getProxy().setExtraParam('stodtl_uids', stodtl_uids);
                barcodeStore.getProxy().setExtraParam('comcst_uid', comcst_uid);
                barcodeStore.load(function (record) {});

                let barcodeListForm = Ext.create('Ext.grid.Panel', {
                    cls: 'rfx-panel',
                    store: barcodeStore,
                    // store: gm.me().barcodeListStore,
                    autoScroll: true,
                    autoHeight: true,
                    collapsible: false,
                    overflowY: 'scroll',
                    multiSelect: false,
                    width: '99%',
                    title: '재발행할 바코드를 선택하십시오.',
                    margin: '0 0 0 0',
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
                            align: 'right',
                            typeAhead: false,
                            allowBlank: false,
                            sortable: true,
                            renderer: function (value) {
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        }
                    ],
                    items:[
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
                                    id: gu.id('GridResult'),
                                    xtype: 'label',
                                    html: '',
                                    result: false
                                }
                            ]
                        },  
                    ],
                    listeners: {
                        selectionchange: function (grid, selected) {

                            let quan = 0;
                            let lblGridResult = gu.getCmp('GridResult');

                            for (let i = 0; i < selected.length; i++) {
                                let grQuan = selected[i].get('packing_quan');
                                quan += grQuan;
                            }

                            if (selected.length === 0) {
                                lblGridResult.setHtml('<b>바코드를 선택하시기 바랍니다.</b>');
                            } else {
                                lblGridResult.setHtml('<b>수량 합계 : ' + renderDecimalNumber(quan) + '</b>');
                            }

                        },
                  
                        
                    }

                });

                let form = Ext.create('Ext.form.Panel', {
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
                                            store: gm.me().printerStore,
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
                                            store: gm.me().printLabelStore,
                                            displayField: 'code_name_kr',
                                            valueField: 'system_code',
                                            emptyText: '라벨 선택',
                                            allowBlank: false
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
                                                    id: gu.id('GridResult'),
                                                    xtype: 'label',
                                                    html: '',
                                                    result: false
                                                }
                                            ]
                                        },
                                        barcodeListForm
                                        
                                    ]
                                }
                            ]
                        }, 
                    ]
                });

                let comboPrinter = gu.getCmp('printer');
                comboPrinter.store.load(
                    function () {
                        this.each(function (record) {
                            comboPrinter.select(record);
                        });
                    }
                );

                let comboLabel = gu.getCmp('print_label');
                comboLabel.store.load(
                    function () {
                        this.each(function (record) {
                            comboLabel.select(record);
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

                            let barcodeSelection = gu.getCmp('barcodeList').getSelectionModel().getSelected().items;

                            let barcode_list = [];

                            for (let i = 0; i < barcodeSelection.length; i++) {
                                let rec = barcodeSelection[i];
                                let barcode = rec.get('barcode');

                                barcode_list.push(barcode);
                            }

                            if (btn === 'no') {
                                prWin.close();
                            } else {

                                prWin.setLoading(true);

                                let printIpAddress = gu.getCmp('printer').getValue();
                                let printer_info = gu.getCmp('printer').getRawValue();
                                let labelSize = gu.getCmp('print_label').getValue();
                                let label_info = gu.getCmp('print_label').getRawValue();

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
                                    params: {
                                        paramName: 'PRINTER_INFO',
                                        paramValue: printer_info
                                    },

                                    success: function () {
                                        console_log('success defaultSet');
                                    },
                                    failure: function () {
                                        console_log('fail defaultSet');
                                    }
                                });

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',
                                    params: {
                                        paramName: 'LABEL_INFO',
                                        paramValue: label_info
                                    },

                                    success: function () {
                                        console_log('success defaultSet');
                                    },
                                    failure: function () {
                                        console_log('fail defaultSet');
                                    }
                                });

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBiotNewVer',
                                    params: {
                                        barcode_type: 'WGRAST',
                                        printIpAddress: printIpAddress,
                                        labelSize: labelSize,
                                        barcode_list: barcode_list,
                                        gr_date_list: "",
                                        ischeck: 'Y',
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



     

        this.addGoodsMoveAction = Ext.create('Ext.Action', {
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '창고이동요청',
            tooltip: '자재의 창고를 이동 요청합니다',
            hidden: gu.setCustomBtnHiddenProp('addGoodsMoveAction'),
            disabled: true,
            handler: function () {

                let barcodeStore = Ext.create('Rfx2.store.company.bioprotech.BarcodeStockStore', {});

                let barcodeGrid = Ext.create('Ext.grid.Panel', {
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
                            text: '포장수량', width: 120, dataIndex: 'packing_quan', sortable: false,
                            style: 'text-align:center',
                            align: 'right',
                            renderer: renderDecimalNumber
                        }
                    ],
                    listeners: {
                        selectionchange: function (grid, selected) {

                            let quan = 0;
                            let lblGridResult = gu.getCmp('lblGridResult');

                            for (let i = 0; i < selected.length; i++) {
                                let grQuan = selected[i].get('packing_quan');
                                quan += grQuan;
                            }

                            if (selected.length === 0) {
                                lblGridResult.setHtml('<b>바코드를 선택하시기 바랍니다.</b>');
                            } else {
                                lblGridResult.setHtml('<b>출고 수량 : ' + renderDecimalNumber(quan) + '</b>');
                            }

                        },
                        edit: function () {
    
                            let selection = gu.getCmp('barcodeGrid').getSelectionModel().getSelection();

                            let quan = 0;
                            let lblGridResult = gu.getCmp('GridResult');

                            for (let i = 0; i < selection.length; i++) {
                                let grQuan = selection[i].get('packing_quan');
                                quan += grQuan;
                            }

                            if (selection.length === 0) {
                                lblGridResult.setHtml('<b>바코드를 선택하시기 바랍니다.</b>');
                            } else {
                                lblGridResult.setHtml('<b>수량 합계 : ' + renderDecimalNumber(quan) + '</b>');
                            }
                        }
                        
                    }
                });

                let recSub = gm.me().grid.getSelectionModel().getSelection()[0];
                let rec_second = gm.me().detailStockGrid.getSelectionModel().getSelection()[0];

                let form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    bodyPadding: 10,
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
                                        value: recSub.get('wh_name'),
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

                let myWidth = 600;
                let myHeight = 620;

                let prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '바코드로 창고이동요청을 실행합니다.',
                    width: myWidth,
                    height: myHeight,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: '출고 실행',
                        handler: function () {

                            if (form.isValid()) {
                                let val = form.getValues(false);
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

                let recMain = gm.me().grid.getSelectionModel().getSelection()[0];
                let stodtlRec = gm.me().detailStockGrid.getSelectionModel().getSelection();

                let srcahd_uid = recMain.get('uid_srcahd'); // 이동하려는 품목
                let comcst_uid = recMain.get('whouse_comcst_uid'); //SITE

                let stodtl_uids = [];

                for (let i = 0; i < stodtlRec.length; i++) {
                    stodtl_uids.push(stodtlRec[i].get('unique_id_long'));
                }

                barcodeStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                barcodeStore.getProxy().setExtraParam('stodtl_uids', stodtl_uids);
                barcodeStore.getProxy().setExtraParam('comcst_uid', comcst_uid);
                barcodeStore.load(function (record) {

                    let lblGridResult = gu.getCmp('lblGridResult');
                    if (record.length === 0) {
                        lblGridResult.setHtml('<b>바코드가 존재하지 않습니다.</b>');
                        lblGridResult.result = false;
                    } else {
                        lblGridResult.setHtml('<b>바코드를 선택하시기 바랍니다.</b>');

                        for (let i = 0; i < record.length; i++) {
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

                let selections = gm.me().grid.getSelectionModel().getSelection();
                let boxPacking = null;
                let printQuan = null;

                if (selections.length > 0) {

                    let rec = selections[0];
                    let finance_rate = rec.get('finance_rate');

                    let locationStoreGi = Ext.create('Rfx2.store.company.bioprotech.WhouseLocationStore', {pageSize: 100});
                    locationStoreGi.getProxy().setExtraParam('whouse_uid', rec.get('whouse_uid'));
                    locationStoreGi.load();

                    let barcodeGridTwo = Ext.create('Ext.grid.Panel', {
                        store: new Ext.data.Store(),
                        cls: 'rfx-panel',
                        id: gu.id('barcodeWareTwoGrid'),
                        collapsible: false,
                        multiSelect: false,
                        width: 450,
                        height: 200,
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
                                // value: printQuan,
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
                                                let grQuan = gu.getCmp('wh_qty').getValue();

                                                if (grQuan === null || grQuan <= 0) {
                                                    Ext.MessageBox.alert('알림', '총 입고수량이 입력되지 않았습니다.')
                                                } else {
                                                    let store_cnt = gu.getCmp('barcodeWareTwoGrid').getStore().getCount();
                                                    if (store_cnt > 0) {
                                                        if (finance_rate === 0 || finance_rate === 1 || finance_rate < 0) {
                                                            gu.getCmp('barcodeWareTwoGrid').getStore().insert(store_cnt + 1, new Ext.data.Record({
                                                                'each': 1,
                                                                'packing': grQuan,
                                                                'multiple': grQuan,
                                                                'totalQuan': grQuan
                                                            }));
                                                        } else {
                                                            let divNum = parseInt(grQuan / finance_rate); //몫
                                                            let resNum = grQuan - divNum * finance_rate;
                                                            if (divNum > 0) {
                                                                gu.getCmp('barcodeWareTwoGrid').getStore().insert(store_cnt + 1, new Ext.data.Record({
                                                                    'each': divNum,
                                                                    'packing': finance_rate,
                                                                    'multiple': divNum * finance_rate,
                                                                    'totalQuan': divNum * finance_rate
                                                                }));
                                                            }

                                                            if (resNum > 0) {
                                                                gu.getCmp('barcodeWareTwoGrid').getStore().insert(store_cnt + 2, new Ext.data.Record({
                                                                    'each': 1,
                                                                    'packing': resNum,
                                                                    'multiple': grQuan - (divNum * finance_rate),
                                                                    'totalQuan': grQuan - (divNum * finance_rate)
                                                                }));
                                                            }
                                                        }
                                                    } else {
                                                        if (finance_rate === 0 || finance_rate === 1 || finance_rate < 0) {
                                                            gu.getCmp('barcodeWareTwoGrid').getStore().insert(0, new Ext.data.Record({
                                                                'each': 1,
                                                                'packing': grQuan,
                                                                'multiple': grQuan,
                                                                'totalQuan': grQuan
                                                            }));
                                                        } else {

                                                            let divNum = parseInt(grQuan / finance_rate); //몫
                                                            let resNum = grQuan - divNum * finance_rate;
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
                                            }
                                        }]
                                    },
                                    {
                                        text: '삭제',
                                        listeners: [{
                                            click: function () {
                                                let record = gu.getCmp('barcodeWareTwoGrid').getSelectionModel().getSelected().items[0];
                                                gu.getCmp('barcodeWareTwoGrid').getStore().removeAt(gu.getCmp('barcodeWareTwoGrid').getStore().indexOf(record));
                                            }
                                        }]
                                    }

                                ]
                            })
                        ]
                    });

                    let form = Ext.create('Ext.form.Panel', {
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
                            // {
                            //     fieldLabel  : '창고지정',
                            //     xtype       : 'combo',
                            //     id          : gu.id('whouse_uid'),
                            //     anchor      : '100%',
                            //     name        : 'whouse_uid',
                            //     mode        : 'local',
                            //     store       : Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {}),
                            //     displayField: 'wh_name',
                            //     valueField  : 'unique_id_long',
                            //     emptyText   : '선택',
                            //     sortInfo    : {field: 'systemCode', direction: 'DESC'},
                            //     typeAhead   : false,
                            //     minChars    : 1,
                            //     listConfig  : {
                            //         loadingText: '검색중...',
                            //         emptyText  : '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div>[{wh_code}] {wh_name}</div>';
                            //         }
                            //     },
                            // },
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
                            // {
                            //     fieldLabel: 'LOT NO',
                            //     xtype     : 'textfield',
                            //     id        : gu.id('lot_no'),
                            //     name      : 'lot_no',
                            //     flex      : 1,
                            //     allowBlank: false,
                            // },
                            {
                                id: gu.id('location'),
                                name: 'location',
                                fieldLabel: 'Location 지정',
                                xtype: 'combo',
                                width: '99%',
                                allowBlank: false,
                                store: locationStoreGi,
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
                                xtype: 'datefield',
                                name: 'in_date',
                                id: gu.id('in_date'),
                                fieldLabel: '입고일자',
                                allowBlank: false,
                                format: 'Y-m-d',
                                value: new Date()
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

                    let winPart = Ext.create('ModalWindow', {
                        title: '자재 입고',
                        width: 500,
                        height: 600,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    let val = form.getValues(false);
                                    let store = gu.getCmp('barcodeWareTwoGrid').getStore();
                                    let indate = gu.getCmp('in_date').getValue();
                                    Ext.MessageBox.show({
                                        title: '창고 반입',
                                        msg: '창고로 반입하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (btn) {
                                            if (btn === 'yes') {
                                                let isEmptyLot = false;
                                                let whouse_uid = val['whouse_uid'];
                                                let in_qty = val['wh_qty'];
                                                let location = val['location'];
                                                let uid_srcahd = rec.get('uid_srcahd');
                                                if (uid_srcahd === -1) {
                                                    Ext.MessageBox.alert('알림', '자재가 선택되지 않았습니다.');

                                                } else {
                                                    let totalIndex = store.getCount();

                                                    if (totalIndex > 0) {

                                                        let packingCount = 0;
                                                        let printCount = 0;
                                                        let multiple = 0;

                                                        let lotArray = [];
                                                        let quanArray = []; //포장수량 배열
                                                        let printQuanArray = [];   //출력 매수 배열

                                                        for (let i = 0; i < totalIndex; i++) {
                                                            let vo = store.data.items[i];
                                                            let packing = vo.get('packing');
                                                            let each = vo.get('each');
                                                            let input_lot = vo.get('input_lot');
                                                            if (input_lot === undefined || input_lot === null || (input_lot.replace(/(\s*)/g, "")).length === 0) {
                                                                isEmptyLot = true;
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

                                                        if (isEmptyLot === true) {
                                                            Ext.MessageBox.alert('알림', 'LOT 번호가 공란인 항목이 있습니다.');

                                                        } else if (multiple < in_qty || multiple > in_qty) {
                                                            Ext.MessageBox.alert('알림', '입고 예정 수량 보다 크거나 작습니다.');

                                                        } else {
                                                            winPart.setLoading(true);
                                                            Ext.Ajax.request({
                                                                url: CONTEXT_PATH + '/inventory/prchStock.do?method=noNstockMaterialStockWhouse',
                                                                params: {
                                                                    whouse_uid: whouse_uid,
                                                                    in_qty: in_qty,
                                                                    srcahd_uid: uid_srcahd,
                                                                    location: location,
                                                                    lotArray: lotArray,
                                                                    quanArray: quanArray,
                                                                    printQuanArray: printQuanArray,
                                                                    indate: indate
                                                                },
                                                                success: function (result) {
                                                                    let resultText = result.responseText;
                                                                    winPart.setLoading(false);
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
                                                        winPart.setLoading(false);
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

        this.addGoodsinActionNoStock = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '무재고 품목 입고 ',
            tooltip: '재고가 없는 품목에 대하여 임의 입고를 실시합니다.',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('addGoodsinActionNoStock'),
            handler: function () {
                let bHeight = 700;
                let bWidth = 700;
                let noStockMaterialStore = Ext.create('Rfx2.store.company.bioprotech.NoStockMaterialStore');
                let locationStore = Ext.create('Rfx2.store.company.bioprotech.WhouseLocationStore', {pageSize: 100});
                noStockMaterialStore.load();
                let uid_srcahd = -1;
                let location_uid = '';
                let finance_rate = 0.0;
                let boxPacking = null;
                let printQuan = null;


                this.itemSearchAction = Ext.create('Ext.Action', {
                    iconCls: 'af-search',
                    text: CMD_SEARCH/*'검색'*/,
                    tooltip: CMD_SEARCH/*'검색'*/,
                    disabled: false,
                    handler: function () {
                        let extraParams = noStockMaterialStore.getProxy().getExtraParams();
                        if (Object.keys(extraParams).length === 0) {
                            noStockMaterialStore.load();
                        } else {
                            noStockMaterialStore.load();
                        }
                    }
                });

                this.gridViewTable = Ext.create('Ext.grid.Panel', {
                    store: noStockMaterialStore,
                    cls: 'rfx-panel',
                    multiSelect: false,
                    autoScroll: true,
                    border: false,
                    height: 300,
                    title: '입고할 자재 / 제품을 선택하십시오.',
                    padding: '0 0 5 0',
                    flex: 1,
                    layout: 'fit',
                    forceFit: false,
                    listeners: {
                        select: function (selModel, record) {
                            uid_srcahd = record.get('unique_id_long');
                            finance_rate = record.get('finance_rate');

                            let barcodeStore = gu.getCmp('barcodeGrid').getStore();
                            barcodeStore.removeAll();
                        }
                    },
                    bbar: getPageToolbar(noStockMaterialStore),
                    dockedItems: [
                        {
                            dock: 'top',
                            xtype: 'toolbar',
                            style: 'background-color: #EFEFEF;',
                            items: [
                                {
                                    field_id: 'search_item_code',
                                    width: 190,
                                    fieldStyle: 'background-color: #D6E8F6; background-image: none; ',
                                    id: gu.id('search_item_code_part'),
                                    name: 'search_item_code',
                                    margin: '3 3 3 3',
                                    xtype: 'triggerfield',
                                    emptyText: '품번',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');

                                    },
                                    listeners: {
                                        specialkey: function (fieldObj, e) {
                                            if (e.getKey() === Ext.EventObject.ENTER) {
                                                noStockMaterialStore.load();
                                            }
                                        },
                                        change: function (fieldObj, e) {
                                            if (e.trim().length > 0) {
                                                noStockMaterialStore.getProxy().setExtraParam('item_code', '%' + e + '%');
                                            } else {
                                                delete noStockMaterialStore.proxy.extraParams.item_code;
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
                                    width: 190,
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
                                        specialkey: function (fieldObj, e) {
                                            if (e.getKey() === Ext.EventObject.ENTER) {
                                                noStockMaterialStore.load();
                                            }
                                        },
                                        change: function (fieldObj, e) {
                                            if (e.trim().length > 0) {
                                                noStockMaterialStore.getProxy().setExtraParam('item_name', '%' + e + '%');
                                            } else {
                                                delete noStockMaterialStore.proxy.extraParams.item_name;
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
                                    width: 190,
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
                                        specialkey: function (fieldObj, e) {
                                            if (e.getKey() === Ext.EventObject.ENTER) {
                                                noStockMaterialStore.load();
                                            }
                                        },
                                        change: function (fieldObj, e) {
                                            if (e.trim().length > 0) {
                                                noStockMaterialStore.getProxy().setExtraParam('specification', '%' + e + '%');
                                            } else {
                                                delete noStockMaterialStore.proxy.extraParams.specification;
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
                            style: 'text-align:center',
                            dataIndex: 'item_code'
                        },
                        {
                            text: '품명',
                            width: 270,
                            style: 'text-align:center',
                            dataIndex: 'item_name',
                            renderer: function (value) {
                                return value.replace(/</gi, "&lt;");
                            }
                        },
                        {
                            text: '규격',
                            width: 270,
                            style: 'text-align:center',
                            dataIndex: 'specification'
                        }
                    ],

                });

                let barcodeGrid = Ext.create('Ext.grid.Panel', {
                    store: new Ext.data.Store(),
                    cls: 'rfx-panel',
                    id: gu.id('barcodeGrid'),
                    collapsible: false,
                    multiSelect: false,
                    width: 650,
                    height: 200,
                    overflowY: 'scroll',
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
                            // value: printQuan,
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
                                '->',
                                {
                                    text: '추가',
                                    listeners: [{
                                        click: function () {
                                            let grQuan = gu.getCmp('in_qty').getValue();
                                            if (grQuan === null || grQuan <= 0) {
                                                Ext.MessageBox.alert('알림', '총 입고수량이 입력되지 않았습니다.')
                                            } else {
                                                let store_cnt = gu.getCmp('barcodeGrid').getStore().getCount();
                                                if (store_cnt > 0) {
                                                    if (finance_rate === 0 || finance_rate === 1 || finance_rate < 0) {
                                                        gu.getCmp('barcodeGrid').getStore().insert(store_cnt + 1, new Ext.data.Record({
                                                            'each': 1,
                                                            'packing': grQuan,
                                                            'multiple': grQuan,
                                                            'totalQuan': grQuan
                                                        }));
                                                    } else {

                                                        let divNum = parseInt(grQuan / finance_rate); //몫
                                                        let resNum = grQuan - divNum * finance_rate;
                                                        if (divNum > 0) {
                                                            gu.getCmp('barcodeGrid').getStore().insert(store_cnt + 1, new Ext.data.Record({
                                                                'each': divNum,
                                                                'packing': finance_rate,
                                                                'multiple': divNum * finance_rate,
                                                                'totalQuan': divNum * finance_rate
                                                            }));
                                                        }


                                                        if (resNum > 0) {
                                                            gu.getCmp('barcodeGrid').getStore().insert(store_cnt + 2, new Ext.data.Record({
                                                                'each': 1,
                                                                'packing': resNum,
                                                                'multiple': grQuan - (divNum * finance_rate),
                                                                'totalQuan': grQuan - (divNum * finance_rate)
                                                            }));
                                                        }
                                                    }
                                                } else {
                                                    if (finance_rate === 0 || finance_rate === 1 || finance_rate < 0) {
                                                        gu.getCmp('barcodeGrid').getStore().insert(0, new Ext.data.Record({
                                                            'each': 1,
                                                            'packing': grQuan,
                                                            'multiple': grQuan,
                                                            'totalQuan': grQuan
                                                        }));
                                                    } else {

                                                        let divNum = parseInt(grQuan / finance_rate); //몫
                                                        let resNum = grQuan - divNum * finance_rate;
                                                        if (divNum > 0) {
                                                            gu.getCmp('barcodeGrid').getStore().insert(0, new Ext.data.Record({
                                                                'each': divNum,
                                                                'packing': finance_rate,
                                                                'multiple': divNum * finance_rate,
                                                                'totalQuan': divNum * finance_rate
                                                            }));
                                                        }


                                                        if (resNum > 0) {
                                                            gu.getCmp('barcodeGrid').getStore().insert(1, new Ext.data.Record({
                                                                'each': 1,
                                                                'packing': resNum,
                                                                'multiple': grQuan - (divNum * finance_rate),
                                                                'totalQuan': grQuan - (divNum * finance_rate)
                                                            }));
                                                        }
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
                                            let record = gu.getCmp('barcodeGrid').getSelectionModel().getSelected().items[0];
                                            gu.getCmp('barcodeGrid').getStore().removeAt(gu.getCmp('barcodeGrid').getStore().indexOf(record));
                                        }
                                    }]
                                }

                            ]
                        })
                    ]
                });

                gm.me().createPartForm = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    width: bWidth,
                    height: bHeight,
                    bodyPadding: 10,
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
                        this.gridViewTable,
                        {
                            fieldLabel: '창고지정',
                            xtype: 'combo',
                            id: gu.id('whouse_uid'),
                            anchor: '100%',
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
                                    let value;
                                    locationStore.getProxy().setExtraParam('whouse_uid', record.get('unique_id_long'));
                                    value = locationStore.load();

                                    let location_id = value.data.items;
                                    for (let i = 0; i < location_id.length; i++) {
                                        let rec = value.data.items[i];
                                        if (i === 0) {
                                            location_uid = rec.get('id');
                                        }
                                    }
                                    locationStore.load();

                                    noStockMaterialStore.getProxy().setExtraParam('select_whouse_uid', record.get('unique_id_long'));
                                    noStockMaterialStore.load();
                                }
                            }
                        },
                        {
                            fieldLabel: 'Location 지정',
                            xtype: 'combo',
                            id: gu.id('location'),
                            name: 'location',
                            store: locationStore,
                            displayField: 'class_name',
                            valueField: 'unique_id',
                            value: location_uid,
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
                            xtype: 'numberfield',
                            name: 'in_qty',
                            id: gu.id('in_qty'),
                            fieldLabel: '총<br>입고수량',
                            allowBlank: false,
                        },
                        {
                            xtype: 'datefield',
                            name: 'in_date',
                            id: gu.id('in_date'),
                            fieldLabel: '입고일자',
                            allowBlank: false,
                            format: 'Y-m-d',
                            value: new Date()
                        },
                        {
                            xtype: 'fieldset',
                            border: false,
                            title: '<b>자재 / 제품 선택, 총 입고수량을 입력 후 아래 추가 버튼을 클릭하여<br>LOT번호, 포장단위, 박스수량을 입력하여 입고처리를 시행하시기 바랍니다.</b>',
                            items: [
                                barcodeGrid
                            ]
                        }
                    ],
                });

                let myMask = new Ext.LoadMask({
                    msg: 'Please wait...',
                    target: gm.me().createPartForm
                });

                let winPart = Ext.create('ModalWindow', {
                    title: '무재고 품목입고',
                    width: bWidth,
                    height: 800,
                    minWidth: 250,
                    minHeight: 180,
                    overflowY: true,
                    items: [gm.me().createPartForm
                    ],
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            let form = gm.me().createPartForm;
                            if (form.isValid()) {
                                let isEmptyLot = false;
                                let whouse_uid = gu.getCmp('whouse_uid').getValue();
                                let in_qty = gu.getCmp('in_qty').getValue();
                                let location = gu.getCmp('location').getValue();
                                if (uid_srcahd === -1) {
                                    Ext.MessageBox.alert('알림', '자재가 선택되지 않았습니다.');

                                } else {
                                    let store = gu.getCmp('barcodeGrid').getStore();
                                    let totalIndex = store.getCount();
                                    if (totalIndex > 0) {
                                        Ext.MessageBox.show({
                                            title: '창고 반입',
                                            msg: '선택 자재를 창고로 반입하시겠습니까?',
                                            buttons: Ext.MessageBox.YESNO,
                                            fn: function (btn) {
                                                if (btn === 'yes') {
                                                    let packingCount = 0;
                                                    let printCount = 0;
                                                    let multiple = 0;

                                                    let lotArray = [];
                                                    let quanArray = []; //포장수량 배열
                                                    let printQuanArray = [];   //출력 매수 배열

                                                    let in_date = gu.getCmp('in_date').getValue();

                                                    for (let i = 0; i < totalIndex; i++) {
                                                        let vo = store.data.items[i];
                                                        let packing = vo.get('packing');
                                                        let each = vo.get('each');
                                                        let input_lot = vo.get('input_lot');
                                                        if (input_lot === undefined || input_lot === null || (input_lot.replace(/(\s*)/g, "")).length === 0) {
                                                            isEmptyLot = true;
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

                                                    if (isEmptyLot === true) {
                                                        Ext.MessageBox.alert('알림', 'LOT 번호가 공란인 항목이 있습니다.');

                                                    } else if (multiple < in_qty || multiple > in_qty) {
                                                        Ext.MessageBox.alert('알림', '입고 예정 수량 보다 크거나 작습니다.');

                                                    } else {
                                                        myMask.show();
                                                        Ext.Ajax.request({
                                                            url: CONTEXT_PATH + '/inventory/prchStock.do?method=noNstockMaterialStockWhouse',
                                                            params: {
                                                                whouse_uid: whouse_uid,
                                                                in_qty: in_qty,
                                                                srcahd_uid: uid_srcahd,
                                                                location: location,
                                                                lotArray: lotArray,
                                                                quanArray: quanArray,
                                                                printQuanArray: printQuanArray,
                                                                inDate: in_date
                                                            },
                                                            success: function (result) {
                                                                let resultText = result.responseText;
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
                                                }
                                            },
                                            icon: Ext.MessageBox.QUESTION
                                        });
                                        // winPart.loadMask(false);
                                    } else {
                                        Ext.MessageBox.alert('알림', '바코드를 생성하는 정보가 입력되지 않았습니다.');

                                    }
                                }
                            } else {
                                Ext.MessageBox.alert('알림', '입고 자재가 선택되지 않았습니다.');
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
                winPart.show();
            } // endofhandler
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
                let selections = gm.me().grid.getSelectionModel().getSelection();
                let selections_two = gm.me().detailStockGrid.getSelectionModel().getSelection();
                if (selections.length > 0) {
                    let rec = selections[0];
                    let rec_two = selections_two[0];
                    if (rec.get('whouse_uid') === 1) {
                        Ext.MessageBox.alert('알림', '이동중인 재고는 출고처리가 불가합니다.');

                    } else {
                        let form = Ext.create('Ext.form.Panel', {
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

                        let loadMask = new Ext.LoadMask({
                            msg: '데이터를 처리중입니다.',
                            target: form
                        });

                        let winPart = Ext.create('ModalWindow', {
                            title: '임의출고를 시행합니다.',
                            width: 500,
                            height: 400,
                            items: form,
                            buttons: [{
                                text: CMD_OK,
                                handler: function () {
                                    if (form.isValid()) {
                                        let out_qty = gu.getCmp('wh_qty_out').getValue();
                                        loadMask.show();
                                        form.submit({
                                            url: CONTEXT_PATH + '/index/process.do?method=releaseProductDirectBarcodefifo',
                                            params: {
                                                srcahd_uid: rec.get('uid_srcahd'),
                                                stodtl_uid: rec_two.get('unique_id'),
                                                gr_quan: out_qty,
                                            },
                                            success: function () {
                                                winPart.close();
                                                gm.me().store.load();
                                                gm.me().detailStockGrid.getStore().load();
                                            },
                                            failure: function () {
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
        (buttonToolbar.items).each(function (item, index) {
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
        this.localSize = gm.unlimitedPageSize;
        this.createStore('Rfx2.model.company.bioprotech.NstoCkMgmt', [{
                property: 'item_code',
                direction: 'ASC'
            }],
            this.localSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['srcahd']
        );

        let arr = [];
        buttonToolbar.insert(1, this.addGoodsinAction);
        buttonToolbar.insert(1, this.addGoodsinActionNoStock);
        buttonToolbar.insert(1, '-');

        arr.push(buttonToolbar);

        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.setRowClass(function (record) {
            let stock_qty = record.get('stock_qty');
            let stock_qty_safe = record.get('stock_qty_safe');
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

                        this.addGoodsMoveAction,
                        this.addGoodOutAction,
                        this.splitMtrlAction,
                        this.barcodeReissueAction,
                        this.divisionBarcodeAction,
                        this.mergeBarcodeAction,
                        
              
                       
                    ]

                },
              
               

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
                    renderer: function (value) {
                        return value == null ? 0 : Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {text: '단위', width: 80, align: 'left', style: 'text-align:center', dataIndex: 'unit_code'},
                {text: '위치', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'location'},
                
            ],
            name: 'detailStock',
            listeners: {
                select: function (dv, record) {
                    let rec = record.data;
                    gm.me().readOptionfactor(rec.unique_id);
                }
            }

        });
        // 재고상세 정병준
        

        this.detailStockGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    gm.me().addGoodsMoveAction.enable();
                    gm.me().addGoodOutAction.enable();
                    gm.me().splitMtrlAction.enable();
                    gm.me().barcodeReissueAction.enable();
                    gm.me().divisionBarcodeAction.enable();
                    gm.me().mergeBarcodeAction.enable();
        
                    //수량합계
                    let quan =[];
                    let sum = 0;
                    for(let i=0;i<selections.length;i++){
                        let re =selections[i];
                        quan.push(re.get('dtl_qty'));
                    }
                    for(let j=0;j<quan.length;j++){
                        sum +=quan[j];
                    }
                    // Ext.getCmp('dtl_qty_sum').setValue(sum);

                    
            
                } else {
                    gm.me().addGoodsMoveAction.disable();
                    gm.me().addGoodOutAction.disable();
                    gm.me().splitMtrlAction.disable();
                    gm.me().barcodeReissueAction.disable();
                    gm.me().divisionBarcodeAction.disable();
                    gm.me().mergeBarcodeAction.disable();
                    // Ext.getCmp('dtl_qty_sum').setValue();
                  
                  
              
                }
            }
        });



        this.propProduceStore = Ext.create('Rfx2.store.company.bioprotech.PropProduceStore'/*, { pageSize: 100 }*/);

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
            items: [this.grid, this.detailInfo]
        });

        //버튼 추가.
        this.callParent(arguments);

        //grid를 선택했을 때 Callback(기존)
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                rec = selections[0];
                gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
                gm.me().addGoodsinAction.enable();
            } else {
                gm.me().addGoodsinAction.disable();
            }

            if (selections.length) {
                let rec = selections[0];
                let unique_id = rec.get('unique_id');
                let wh_qty = rec.get('wh_qty');
                let unit_mass = rec.get('unit_mass');
                let unit_code = rec.get('unit_code');
                gm.me().detailStockGrid.getStore().getProxy().setExtraParam('nstock_uid', unique_id);
                gm.me().detailStockGrid.getStore().load(function (records) {
                    // let sum = 0;
                    // if (records != null && records.length > 0) {
                    //
                    //     for (let i = 0; i < records.length; i++) {
                    //         let r = records[i];
                    //         sum = sum + r.get('dtl_qty');
                    //     }
                    // }
                    //
                    // let gap = wh_qty - sum;
                    //
                    // if (gap !== 0) {
                    //     gm.me().detailStockGrid.getStore().insert(0, new Ext.data.Model({
                    //         id: -1,
                    //         unique_id: '-1',
                    //         unique_id_long: -1,
                    //         dtl_qty: gap,
                    //         unit_mass: unit_mass,
                    //         std_amount: unit_mass * gap,
                    //         unit_code: unit_code,
                    //         stock_pos: '<미지정>',
                    //         lot_no: '<미지정>',
                    //         barcode: '<미지정>',
                    //         po_no_od: '<미지정>',
                    //         po_no_pr: '<미지정>'
                    //     }));
                    // }

                });
                gm.me().propProduceStore.removeAll();

            }

        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('not_sg_code_list', 'CS');
        this.store.load();
    },

    // 바코드 목록 불러오는 form
    barcodeListForm: function () {
        let selections = gm.me().detailStockGrid.getSelection();
        let rec = selections[0];

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
        let spcode = record.get('systemCode');
        let s_flag = spcode.substring(0, 1);
        console_logs('spcode', s_flag);


        let target = this.getInputTarget('standard_flag');
        target.setValue(s_flag);

    },

    assginMaterial: function () {
        let mStore = Ext.create('Mplm.store.ProjectStore');

        let form = Ext.create('Ext.form.Panel', {
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

        let selections = gm.me().grid.getSelectionModel().getSelection();

        let uniqueIdArr = [];

        for (let i = 0; i < selections.length; i++) {
            let rec = selections[i];
            let uid = rec.get('unique_id');  //Srcahd unique_id
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

                    let selections = gm.me().grid.getSelectionModel().getSelection();
                    let rec = selections[0];

                    let stoqty_uid = rec.get('unique_id');  //Product unique_id
                    let uid_srcahd = rec.get('uid_srcahd');

                    let form = gu.getCmp('formPanel').getForm();

                    form.submit({
                        url: CONTEXT_PATH + '/purchase/material.do?method=assginMaterial',
                        params: {
                            uid_srcahd: uid_srcahd,
                            stoqty_uid: stoqty_uid
                        },
                        success: function () {
                            prWin.close();
                            gm.me().showToast('결과', '할당 프로젝트를 지정하였습니다.');
                            gm.me().store.load(function () {
                            });
                        },
                        failure: function () {
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
    addTabCartLineGridPanel: function (title, menuCode, arg, fc, id) {

        gm.extFieldColumnStore.load({
            params: {menuCode: menuCode},
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                //		    	 setEditPanelTitle();
                if (success === true) {
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
        let gridId = id == null ? this.getGridId() : id;

        gm.parseGridRecord(records, gridId);

        let cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});
        this.cartLineStore = Ext.create('Rfx.store.StockMtrlStore');
        let ClaastStore = Ext.create('Mplm.store.ClaastStore', {});
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
                                    '<span style="color: #999; "><small>{unique_id}</small></span> <span style="color: #333; ">{class_code}</span><br />' +
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
                                success: function () {
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

                            let cartLineGrid_t = gm.me().cartLineGrid.getStore().data.items;
                            let is_duplicated = false;
                            let selected_stock_pos = gu.getCmp('stock_pos').getValue();
                            let selectionModel = gm.me().cartLineGrid.getSelectionModel().getSelection()[0];

                            if (selected_stock_pos === selectionModel.get('stock_pos')) {
                                is_duplicated = true;
                            } else {
                                for (let i = 0; i < cartLineGrid_t.length; i++) {
                                    if (selected_stock_pos === cartLineGrid_t[i].data.stock_pos) {
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
                            let stoqty_uids = [];

                            if (gm.me().selected_rec != null && gm.me().selected_rec.length > 0) {
                                for (let i = 0; i < gm.me().selected_rec.length; i++) {
                                    stoqty_uids.push(gm.me().selected_rec[i].data.id);
                                }
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                                    params: {
                                        DELETE_CLASS: 'stoqty',
                                        uids: stoqty_uids
                                    },
                                    success: function () {
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
                itemdblclick: function (view, record) {

                    gm.me().downListRecord(record);
                }
            },//endof listeners
            columns: columns
        });
        this.cartLineGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gm.me().selected_rec = selections;
            }
        });
        let tabPanel = Ext.getCmp(gm.geTabPanelId());

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
                handler: function () {
                    let form = gu.getCmp('formPanel').getForm();
                    let result_length = gm.me().store.data.length;
                    let val = form.getValues(false);
                    if (result_length > 0) {
                        let rec = gm.me().grid.getSelectionModel().getSelection();
                        let srcahd_uids = [];

                        for (let i = 0; i < rec.length; i++) {
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
                if (btn === 'yes') {
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

                        success: function (result) {
                            let resultText = result.responseText;
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
        let wh_qty_out = gu.getCmp('wh_qty_out').getValue();
        console_logs('>>>>> wh_qty_out', wh_qty_out);
        Ext.MessageBox.show({
            title: '창고 반출',
            msg: '창고에서 반출하시겠습니까?' + '\r\n 수량: ' + gu.getCmp('wh_qty_out').getValue(),
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn === 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/index/process.do?method=releaseProductDirectByLot',
                        params: {
                            stodtl_uid: val['unique_id'],
                            gr_quan: wh_qty_out,
                        },
                        success: function (result) {
                            let resultText = result.responseText;
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
                    //         let resultText = result.responseText;
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
                if (btn === 'yes') {

                    winPart.setLoading(true);

                    let rec = gu.getCmp('barcodeGrid').getSelectionModel().getSelection();

                    let request_qty_list = [];
                    let barcode_list = [];
                    let stodtl_uid_list = [];

                    for (let i = 0; i < rec.length; i++) {
                        request_qty_list.push(rec[i].get('packing_quan'));
                        barcode_list.push(rec[i].get('barcode'));
                        stodtl_uid_list.push(rec[i].get('stodtl_uid'));
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/inventory/prchStock.do?method=requestMoveQtyMulti',
                        params: {
                            stodtl_uid_list: stodtl_uid_list,
                            request_qty_list: request_qty_list,
                            whouse_uid: val['whouse_uid'],
                            req_date: val['reserved_timestamp1'],
                            barcode_list: barcode_list
                        },

                        success: function (result) {
                            let resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().getStore().load(function () {
                            });
                            if (winPart) {
                                winPart.close();
                            }
                        },
                        failure: function (result, request) {
                            extjsUtil.failureMessage(result, request);
                            if (winPart) {
                                winPart.close();
                            }
                        }
                    });
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    printerStore: Ext.create('Mplm.store.PrinterStore', {}),
    printLabelStore: Ext.create('Mplm.store.PrintLabelStore', {}),
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