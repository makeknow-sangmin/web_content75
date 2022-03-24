//출고실행
Ext.define('Rfx2.view.company.bioprotech.stockMgmt.GoodsOutView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'goods-out-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField({
            type: 'combo',
            width: 120
            , field_id: 'status'
            , emptyText: '구분'
            , store: "CommonCodeStore"
            , params: {parentCode: 'QGR6_STATE'}
            , displayField: 'code_name_kr'
            , valueField: 'system_code'
            , value: 'code_name_kr'
            , innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>'
        });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'create_date',
            text: '등록일',
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.addSearchField('user_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.bioprotech.GoodsOutNStock',
            pageSize: gm.pageSize,
            sorters: [{
                property: 'parent_code',
                direction: 'asc'
            }],
            byReplacer: {},
            deleteClass: ['cartmap']

        }, {});

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var option = {};

        //grid 생성.
        this.createGridCore(arr, option);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.removeAction.setText('반려');

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 3) {
                buttonToolbar.items.remove(item);
            }
        });

        //출고확인 Action 생성
        this.createBoutAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '출고처리',
            tooltip: '출고처리',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('createBoutAction'),
            handler: function () {

                var lotStockStore = Ext.create('Rfx2.store.company.bioprotech.DetailStockStore', {});

                var releaseCatStore = Ext.create('Mplm.store.CommonCodeExStore', {parentCode: 'MAT_RELEASE_CATEGORY'});
                var prQuan = gm.me().grid.getSelectionModel().getSelection()[0].get('quan');
                var grQuan = gm.me().grid.getSelectionModel().getSelection()[0].get('gr_quan');
                var remainQuan = prQuan - grQuan;
                var releaseCat = gm.me().grid.getSelectionModel().getSelection()[0].get('reserved_varchar4');

                var addLotItemAction = Ext.create('Ext.Action', {
                    iconCls: 'af-plus',
                    text: 'LOT추가',
                    tooltip: '임의 LOT를 추가합니다',
                    handler: function () {
                        var store = gu.getCmp('lotStockGrid').getStore();
                        store.insert(store.getCount(),
                            new Ext.data.Record({
                                'wh_code': null,
                                'wh_name': '',
                                'lot_no': '',
                                'dtl_qty': 0,
                                'gr_quan_confirm': 0,
                                'gr_quan_adj': 0,
                                'is_new_row': true,
                                'unique_id_long': -1
                            }));
                    }
                });

                var whouseStore = Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {});
                whouseStore.load();

                var lotStockGrid = Ext.create('Ext.grid.Panel', {
                    store: lotStockStore,
                    cls: 'rfx-panel',
                    id: gu.id('lotStockGrid'),
                    collapsible: false,
                    multiSelect: false,
                    width: 550,
                    height: 270,
                    margin: '0 0 10 0',
                    features: [{
                        ftype: 'summary',
                        dock: 'bottom'
                    }],
                    viewConfig: {
                        markDirty: false
                    },
                    autoHeight: true,
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 1,
                        listeners: {
                            beforeedit: function (e, context) {
                                var rec = context.record;
                                switch (context.colIdx) {
                                    case 0:
                                    case 1:
                                        if (rec.get('is_new_row')) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    default:
                                        return true;
                                }
                            }
                        }
                    },
                    dockedItems: [
                        {
                            dock: 'top',
                            xtype: 'toolbar',
                            cls: 'my-x-toolbar-default3',
                            items: [
                                '->',
                                addLotItemAction
                            ]
                        }
                    ],
                    frame: false,
                    border: false,
                    forceFit: true,
                    columns: [
                        {
                            text: '창고명', width: 180, dataIndex: 'wh_name',
                            style: 'text-align:center',
                            sortable: false,
                            editor: {
                                xtype: 'combo',
                                store: whouseStore,
                                displayField: 'wh_name',
                                valueField: 'wh_name',
                                editable: false,
                                selectOnFocus: true,
                                listeners: {
                                    focus: function () {
                                        var combo = this;
                                        combo.expand();
                                    },
                                    select: function (combo, record) {
                                        var rowIdx = combo.ownerCt.context.rowIdx;
                                        var storeIdx = gu.getCmp('lotStockGrid').getStore().getAt(rowIdx);
                                        storeIdx.set('wh_code', record.get('wh_code'));
                                        storeIdx.set('whouse_uid', record.get('unique_id_long'));
                                        this.blur();
                                    }
                                }
                            }
                        },
                        {
                            text: 'LOT 번호',
                            editor: 'textfield',
                            width: 130, dataIndex: 'lot_no', style: 'text-align:center',
                            sortable: false
                        },
                        {
                            text: 'MES 재고', width: 100, dataIndex: /*'gr_quan'*/'dtl_qty', sortable: false,
                            style: 'text-align:center',
                            align: 'right',
                            renderer: renderDecimalNumber,
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return renderDecimalNumber(value);
                            }
                        },
                        {
                            text: '출고수량', width: 100, dataIndex: 'gr_quan_confirm', sortable: false,
                            editor: 'numberfield',
                            style: 'text-align:center',
                            align: 'right',
                            css: 'edit-cell',
                            renderer: renderDecimalNumber,
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return renderDecimalNumber(value);
                            }
                        },
                        {
                            text: '조정수량', width: 100, dataIndex: 'gr_quan_adj', sortable: false,
                            editor: 'numberfield',
                            style: 'text-align:center',
                            align: 'right',
                            css: 'edit-cell',
                            renderer: function (value) {
                                return renderDecimalNumber(value);
                            },
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return renderDecimalNumber(value);
                            }
                        }
                    ],
                    listeners: {
                        edit: function (editor, e, eOpts) {

                            if (e.field == 'gr_quan_confirm') {

                                var rowIdx = e.rowIdx;
                                var storeIdx = gu.getCmp('lotStockGrid').getStore().getAt(rowIdx);
                                var dtlQty = e.record.get('dtl_qty');
                                var gr_quan_confirm = e.value;

                                if (dtlQty < gr_quan_confirm) {
                                    storeIdx.set('gr_quan_adj', gr_quan_confirm - dtlQty);
                                }
                            }


                        }
                    }
                });

                var rec = gm.me().grid.getSelectionModel().getSelection()[0];

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    bodyPadding: 10,
                    width: '100%',
                    items: [
                        {
                            xtype: 'label',
                            margin: '10 10 10 10',
                            text: '출고 되는 LOT 수량에 따라 순차적으로 출고 됩니다.'
                        },
                        {
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
                                            fieldLabel: '출고 유형',
                                            xtype: 'combo',
                                            width: 550,
                                            id: gu.id('release_cat'),
                                            name: 'release_cat',
                                            displayField: 'code_name_kr',
                                            valueField: 'system_code',
                                            store: releaseCatStore,
                                            value: releaseCat,
                                            readOnly: releaseCat != null
                                        },
                                        {
                                            fieldLabel: '출고 날짜',
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
                            id: gu.id('lblGridPrQuan'),
                            dock: 'top',
                            xtype: 'label',
                            width: 550,
                            html: '<p style="text-align: right;font-weight: bold">' +
                                '요청 수량 : ' + renderDecimalNumber(remainQuan) + '</p>',
                            result: false
                        },
                        {
                            xtype: 'fieldset',
                            frame: true,
                            title: 'LOT 리스트',
                            width: '100%',
                            height: '100%',
                            layout: 'fit',
                            bodyPadding: 10,
                            items: [
                                lotStockGrid
                            ]
                        }
                    ]
                });

                var myWidth = 600;
                var myHeight = 600;

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '출고 실행',
                    width: myWidth,
                    height: myHeight,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: '출고 실행',
                        handler: function (btn) {

                            var grid = gu.getCmp('lotStockGrid');
                            var store = grid.getStore();

                            if (store.count() == 0) {
                                Ext.Msg.alert('경고', '출고 할 대상이 없습니다.');
                                return;
                            }

                            var recM = gm.me().grid.getSelectionModel().getSelection()[0];

                            var adjSum = 0;
                            var confirmSum = 0;

                            var gr_quan_confirms = [];
                            var gr_quan_adjs = [];
                            var whouse_uids = [];
                            var lot_nos = [];
                            var stodtl_uids = [];

                            for (var i = 0; i < store.count(); i++) {
                                var gr_quan_confirm = store.getAt(i).get('gr_quan_confirm');
                                var gr_quan_adj = store.getAt(i).get('gr_quan_adj');
                                var whouse_uid = store.getAt(i).get('whouse_uid');
                                var stodtl_uid = store.getAt(i).get('unique_id_long');
                                var lot_no = store.getAt(i).get('lot_no');

                                adjSum += gr_quan_adj;
                                confirmSum += gr_quan_confirm;

                                gr_quan_confirms.push(gr_quan_confirm);
                                gr_quan_adjs.push(gr_quan_adj);
                                whouse_uids.push(whouse_uid);
                                stodtl_uids.push(stodtl_uid);
                                lot_nos.push(lot_no);
                            }

                            if (adjSum !== 0) {
                                Ext.Msg.alert('경고', '조정수량은 0이어야 합니다.');
                                return;
                            }

                            prWin.setLoading(true);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales/delivery.do?method=releaseMtrlInLotOrd',
                                params: {
                                    releaseCat: recM.get('reserved_varchar4'),
                                    lot_nos: lot_nos,
                                    gr_quan_confirms: gr_quan_confirms,
                                    gr_quan_adjs: gr_quan_adjs,
                                    whouse_uids: whouse_uids,
                                    stodtl_uids: stodtl_uids,
                                    cartmapUid: recM.get('unique_uid'),
                                    rtgastUid: recM.get('rtgast_uid'),
                                    reserved_timestamp1: gu.getCmp('reserved_timestamp1').getValue(),
                                    comcstUid: comcst_uid,
                                    srcahdUid: recM.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    prWin.setLoading(false);
                                    prWin.close();
                                    gm.me().store.load();
                                },
                                failure: function (batch, opt) {
                                    prWin.setLoading(false);
                                    Ext.Msg.alert('오류', '출고 처리 중 문제가 발생하였습니다.');
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

                var rec = gm.me().grid.getSelectionModel().getSelection()[0];

                var child = rec.get('child'); // 출고 하는 품목
                var goCategory = rec.get('reserved_varchar4'); //출고 유형
                var comcst_uid = rec.get('uid_comcst'); //SITE

                lotStockStore.getProxy().setExtraParam('srcahd_uid', child);
                lotStockStore.getProxy().setExtraParam('comcst_uid', comcst_uid);
                lotStockStore.getProxy().setExtraParam('not_wh_category_list', 'ST,OU');
                lotStockStore.load(function (record) {

                    for (var i = 0; i < record.length; i++) {
                        record[i].set('gr_quan_adj', 0);
                        record[i].set('gr_quan_confirm', 0);
                        record[i].set('is_new_row', false);
                    }
                });
            }
        });

        //출고확인 Action 생성
        this.createGoutAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '일반 출고',
            tooltip: '출고 확인',
            disabled: true,
            handler: function () {

                var uids = [];
                var quanArr = [];
                var priceArr = [];
                var childArr = [];
                var stoqArr = [];
                var whArr = [];
                var usefulArr = [];
                var stocArr = [];
                var acUids = [];
                var stockPosArr = [];
                var selections = gm.me().grid.getSelectionModel().getSelection();

                if (selections.length) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];

                        var cartmapuids = rec.get('id');
                        var quans = rec.get('quan');
                        var sales_prices = rec.get('sales_price');
                        var childs = rec.get('child');
                        var stoqty_uids = rec.get('stoqty_uid');
                        var wh_qtys = rec.get('wh_qty');
                        var stock_qty_usefuls = rec.get('stock_qty_useful');
                        var stock_qtys = rec.get('stock_qty');
                        var ac_uid = rec.get('ac_uid');
                        var stock_pos = rec.get('stock_pos');
                        uids.push(cartmapuids);
                        quanArr.push(quans);
                        priceArr.push(sales_prices);
                        childArr.push(childs);
                        stoqArr.push(stoqty_uids);
                        whArr.push(wh_qtys);
                        usefulArr.push(stock_qty_usefuls);
                        stocArr.push(stock_qtys);
                        acUids.push(ac_uid);
                        stockPosArr.push(stock_pos);
                        console_logs("quanArr>>>>>>>>>>>>>출고확인 여러개" + quanArr);
                        console_logs("uids>>>>>>>>>>>>>출고확인 여러개" + uids);

                    }

                    if (uids == undefined || uids < 0) {
                        Ext.Msg.alert("알 림", "선택선택된 자재가 없습니다.");
                    } else {

                        var form = Ext.create('Ext.form.Panel', {
                            id: gu.id('formPanel'),
                            xtype: 'form',
                            frame: false,
                            border: false,
                            bodyPadding: 15,
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
                                    fieldLabel: '창고',
                                    xtype: 'combo',
                                    anchor: '100%',
                                    id: gu.id('stock_pos'),
                                    name: 'wh_code',
                                    store: Ext.create('Mplm.store.WareHouseStore'),
                                    displayField: 'wh_name',
                                    valueField: 'wh_code',
                                    emptyText: '선택',
                                    allowBlank: false,
                                    sortInfo: {field: 'create_date', direction: 'DESC'},
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig: {
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">{wh_code} - {wh_name}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {

                                        }
                                    }
                                },
                                {
                                    fieldLabel: '출고 날짜',
                                    xtype: 'datefield',
                                    id: gu.id('reserved_timestamp1'),
                                    name: 'reserved_timestamp1',
                                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                    fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                    format: 'Y-m-d',
                                    value: new Date()
                                }
                            ]//item end..

                        });//Panel end...
                        myHeight = 150;

                        prWin = Ext.create('Ext.Window', {
                            modal: true,
                            title: '출고 확인',
                            width: 400,
                            height: myHeight,
                            plain: true,
                            items: form,
                            buttons: [{
                                text: CMD_OK,
                                handler: function (btn) {
                                    var msg = '출고 확인하시겠습니까?'
                                    var myTitle = '출고 확인';
                                    Ext.MessageBox.show({
                                        title: myTitle,
                                        msg: msg,

                                        buttons: Ext.MessageBox.YESNO,
                                        icon: Ext.MessageBox.QUESTION,
                                        fn: function (btn) {

                                            if (btn == 'yes') {
                                                var form = gu.getCmp('formPanel').getForm();

                                                var val = form.getValues(false);
                                                prWin.setLoading(true);
                                                form.submit({
                                                    url: CONTEXT_PATH + '/purchase/request.do?method=createOutDtl',
                                                    params: {
                                                        cartmap_uids: uids,
                                                        quans: quanArr,
                                                        childs: childArr,
                                                        stoqty_uids: stoqArr,
                                                        wh_qtys: whArr,
                                                        stock_qty_usefuls: usefulArr,
                                                        stock_qtys: stocArr,
                                                        ac_uids: acUids,
                                                        stock_positions: stockPosArr
                                                    },
                                                    success: function () {
                                                        Ext.Msg.alert('안내', '출고 확인하였습니다.');
                                                        gm.me().storeLoad();
                                                        prWin.close();
                                                    },
                                                    failure: function () {
                                                        Ext.Msg.alert('안내', '출고 확인하였습니다.');
                                                        gm.me().storeLoad();
                                                        prWin.close();
                                                    }
                                                });
                                            } else {
                                                prWin.close();
                                            }

                                        }//fn function(btn)

                                    });//show
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
                    }
                }
            }//handler end...
        });

        //출고 마감 Action 생성
        this.closeGoAction = Ext.create('Ext.Action', {
            iconCls: 'dabp-close',
            text: '출고 마감',
            tooltip: '출고 마감',
            hidden: gu.setCustomBtnHiddenProp('closeGoAction'),
            disabled: true,
            // hidden: gu.setCustomBtnHiddenProp('closeGoAction'),
            handler: function () {
                gm.me().treatCloseGo();
            }
        });

        //입고 마감 Action 생성
        this.cancelCloseGoAction = Ext.create('Ext.Action', {
            iconCls: 'dabp-close',
            text: '출고마감 취소',
            tooltip: '출고마감 취소',
            hidden: gu.setCustomBtnHiddenProp('cancelCloseGoAction'),
            disabled: true,
            // hidden: gu.setCustomBtnHiddenProp('cancelCloseGoAction'),
            handler: function () {
                gm.me().treatCancelCloseGo();
            }
        });

        //버튼 추가.

        if (this.userType.includes('MAT')) {
            buttonToolbar.insert(3, this.createBoutAction);
            buttonToolbar.insert(4, this.closeGoAction);
            buttonToolbar.insert(5, this.cancelCloseGoAction);
        }

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length > 0) {
                if (gm.me().userType.includes('MAT')) {
                    gm.me().createGoutAction.enable();
                    gm.me().createBoutAction.enable();
                    gm.me().closeGoAction.enable();
                    gm.me().cancelCloseGoAction.enable();
                }
            } else {
                gm.me().createGoutAction.disable();
                gm.me().createBoutAction.disable();
                gm.me().closeGoAction.disable();
                gm.me().cancelCloseGoAction.disable();
            }
        })

        //디폴트 로드
        gm.setCenterLoading(false);
        this.store.getProxy().setExtraParam('orderBy', 'cartmap.unique_id desc');
        this.store.getProxy().setExtraParam('parent_code', this.link);
        this.store.getProxy().setExtraParam('route_type', 'G');
        this.store.getProxy().setExtraParam('status_cr', 'Y');
        this.store.load();
    },

    treatCloseGo: function () {

        var selections = gm.me().grid.getSelectionModel().getSelection();

        for (var i = 0; i < selections.length; i++) {
            var status = selections[i].get('status');

            if (status !== 'CR') {
                Ext.Msg.alert('', '접수완료 상태에서만 마감 처리 가능합니다.');
                return;
            }
        }

        Ext.MessageBox.show({
            title: '마감',
            msg: '해당 주문의 출고를 마감하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {

                    var cartmapUids = [];

                    for (var i = 0; i < selections.length; i++) {
                        cartmapUids.push(selections[i].get('unique_uid'));
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=closeGo',
                        params: {
                            cartmapUids: cartmapUids
                        },
                        success: function () {
                            Ext.Msg.alert('알림', '출고 마감이 완료 되었습니다.');
                            gm.me().store.load();
                        },
                        failure: function () {
                            Ext.Msg.alert('알림', '출고 마감이 실패 되었습니다.');
                        }
                    });
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    treatCancelCloseGo: function () {

        var selections = gm.me().grid.getSelectionModel().getSelection();

        for (var i = 0; i < selections.length; i++) {
            var status = selections[i].get('status');

            if (status !== 'G') {
                Ext.Msg.alert('', '처리완료 상태에서만 마감처리취소 가능합니다.');
                return;
            }
        }

        Ext.MessageBox.show({
            title: '마감',
            msg: '해당 주문의 출고를 마감 취소 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {

                    var cartmapUids = [];

                    for (var i = 0; i < selections.length; i++) {
                        cartmapUids.push(selections[i].get('unique_uid'));
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=cancelCloseGo',
                        params: {
                            cartmapUids: cartmapUids
                        },
                        success: function () {
                            Ext.Msg.alert('알림', '출고 마감취소가 완료 되었습니다.');
                            gm.me().store.load();
                        },
                        failure: function () {
                            Ext.Msg.alert('알림', '출고 마감취소가 실패 되었습니다.');
                        }
                    });
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    items: [],
    poviewType: 'ALL',
    cartmap_uids: [],
    deleteClass: ['cartmap'],
    userType: vCUR_USERTYPE_STR.split(','),
    selCheckOnly: vCompanyReserved4 == 'SKNH01KR' ? true : false,
    selAllowDeselect: vCompanyReserved4 == 'SKNH01KR' ? false : true
});
