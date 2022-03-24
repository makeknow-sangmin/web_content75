//출하 관리
Ext.define('Rfx2.view.company.chmr.salesDelivery.ProductStockVerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'product-stock-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.setDefValue('create_date', new Date());

        var next7 = gu.getNextday(7);
        this.setDefValue('change_date', next7);

        this.addSearchField(
            {
                // type: 'combo',
                field_id: 'sp_code'
                , store: 'SpCodeFlagStore'
                , displayField: 'code_name_kr'
                , valueField: 'system_code'
                , emptyText: '제품분류'
                , innerTpl: '{code_name_kr}'

            });

        // this.addSearchField({
        //     type: 'checkbox',
        //     field_id: 'existStock',
        //     items: [
        //         {
        //             boxLabel: gm.getMC('CMD_Only_items_in_stock','재고 있는 품목만'),
        //             checked: true
        //         },
        //     ],
        // });

        // this.addSearchField({
        //     field_id: 'whouse_uid'
        //     , emptyText: '창고명'
        //     , width: 200
        //     , store: "Rfx2.store.company.bioprotech.WarehouseProductStore"
        //     , displayField: 'wh_name'
        //     , valueField: 'unique_id'
        //     , defaultValue: '11030245000001'
        //     , autoLoad: true
        //     , innerTpl: '<div data-qtip="{unique_id}">{wh_name}</div>'
        // });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'basis_date',
            text: "기준일자",
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH),
            edate: new Date()
        });

        this.addSearchField('item_code');
        // this.addSearchField('item_name');
        this.addSearchField({
            type: 'text',
            field_id: 'item_name',
            emptyText: '품명'
        });

        this.addSearchField({
            type: 'text',
            field_id: 'description',
            emptyText: '규격'
        });

        // this.addSearchField('specification');
        // this.addSearchField('class_name');
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        // 상세내역 Detail 검색
        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();''
                var rec = selections[0];

                var selections_two = gm.me().productDetailGrid.getSelectionModel().getSelection();
                console_logs('>>> selections_two', selections_two);
                var rec_two = selections_two[0];

                var whouse_parameter = gu.getCmp('warehouse_uid').getValue();
                console_logs('>>>> whouse', whouse_parameter);
                // var basic_sdate = gu.getCmp('basis_sdate').getValue();
                // var basic_edate = gu.getCmp('basis_edate').getValue();
                // console_logs('>>>> basic_sdate', basic_sdate);
                // console_logs('>>>> basic_edate', basic_edate);

                // var basic_sdate_str = basic_sdate.getFullYear() + '-' + ((basic_sdate.getMonth() + 1) < 10 ? '0' + (basic_sdate.getMonth() + 1) : (basic_sdate.getMonth() + 1)) + '-' + ((basic_sdate.getDate()) < 10 ? '0' + (basic_sdate.getDate()) : (basic_sdate.getDate()));
                // var basic_edate_str = basic_edate.getFullYear() + '-' + ((basic_edate.getMonth() + 1) < 10 ? '0' + (basic_edate.getMonth() + 1) : (basic_edate.getMonth() + 1)) + '-' + ((basic_edate.getDate()) < 10 ? '0' + (basic_edate.getDate()) : (basic_edate.getDate()));

                gm.me().produceHistoryByProduct.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                gm.me().produceHistoryByProduct.getProxy().setExtraParam('basic_date_single', rec_two.get('stock_date_format'));
                gm.me().produceHistoryByProduct.load();

                gm.me().deliveryOutHistoryByProduct.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                gm.me().deliveryOutHistoryByProduct.getProxy().setExtraParam('whouse_uid', whouse_parameter);
                gm.me().deliveryOutHistoryByProduct.getProxy().setExtraParam('basic_date_single', rec_two.get('stock_date_format'));
                // gm.me().deliveryOutHistoryByProduct.getProxy().setExtraParam('basic_date', basic_sdate_str + ':' + basic_edate_str);
                gm.me().deliveryOutHistoryByProduct.load();

                gm.me().grHistoryByProduct.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                gm.me().grHistoryByProduct.getProxy().setExtraParam('whouse_uid', whouse_parameter);
                gm.me().grHistoryByProduct.getProxy().setExtraParam('basic_date_single', rec_two.get('stock_date_format'));
                // gm.me().grHistoryByProduct.getProxy().setExtraParam('basic_date', basic_sdate_str + ':' + basic_edate_str);
                gm.me().grHistoryByProduct.load();

                gm.me().warehouseMove.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                gm.me().warehouseMove.getProxy().setExtraParam('whouse_uid', whouse_parameter);
                gm.me().warehouseMove.getProxy().setExtraParam('basic_date_single', rec_two.get('stock_date_format'));
                // gm.me().warehouseMove.getProxy().setExtraParam('basic_date', basic_sdate_str + ':' + basic_edate_str);
                gm.me().warehouseMove.load();
            }
        });

        this.printBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: gm.getMC('CMD_Inventory_Barcode', '재고조사 바코드'),
            tooltip: '제품의 바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gm.me().printBarcode();
            }
        });

        this.warehousingAction = Ext.create('Ext.Action', {
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: gm.getMC('CMD_Wearing', '입고'),
            tooltip: '제품을 입고합니다.',
            disabled: true,
            handler: function () {
                gm.me().doWarehousing();
            }
        });

        this.releaseAction = Ext.create('Ext.Action', {
            iconCls: 'font-awesome_4-7-0_sign-out_14_0_5395c4_none',
            text: gm.getMC('CMD_Release', '출고'),
            tooltip: '제품을 출고합니다.',
            disabled: true,
            handler: function () {
                gm.me().doRelease();
            }
        });

        this.forcePrevStockAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '이월재고 변경',
            tooltip: '전일 이월재고 변경 및 현재재고를 변경수량으로 조절합니다.',
            disabled: true,
            handler: function () {
                gm.me().doForcePrevStockChange();
            }
        });

        this.moveWarehouseStock = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '창고이동',
            // tooltip: '전일 이월재고 변경 및 현재재고를 변경수량으로 조절합니다.',
            disabled: true,
            handler: function () {
                gm.me().moveWareHouse();
            }
        });

        this.createStore('Rfx2.model.company.chmr.ProductStock',
            [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        this.setRowClass(function (record, index) {

            console_logs('>>>>record', record);
            var c = record.get('stock_pos');
            console_logs('>>>>c', c);
            if (c != null && c != undefined && c != '') {
                return 'green-row';
            }

        });


        buttonToolbar.insert(1, this.releaseAction);
        buttonToolbar.insert(1, this.warehousingAction);
        buttonToolbar.insert(3, '-');
        buttonToolbar.insert(4, this.forcePrevStockAction);
        buttonToolbar.insert(5, this.moveWarehouseStock);

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.cancelStockAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Goods_receipt_cancellation', '입고 취소'),
            tooltip: '입고 취소',
            disabled: false,
            handler: function () {
                var rec = gm.me().productDetailGrid.getSelectionModel().getSelection()[0];

                var stoqty_uid = rec.get('unique_id_long');

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
                            title: '입고 취소 수량을 입력하시기 바랍니다',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    id: gu.id('cancel_quan'),
                                    name: 'cancel_quan',
                                    fieldLabel: '취소수량',
                                    margin: '0 5 0 0',
                                    anchor: '97%',
                                    allowBlank: false,
                                    value: 1,
                                    maxlength: '10',
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '입고 취소',
                    width: 450,
                    height: 180,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: '입고 취소',
                                    msg: '선택 한 건을 입고 취소 하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            var val = form.getValues(false);
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/sales/productStock.do?method=cancelStock',
                                                params: {
                                                    stoqty_uid: stoqty_uid,
                                                    cancel_quan: val['cancel_quan']
                                                },
                                                success: function (val, action) {
                                                    Ext.Msg.alert('완료', '입고가 취소되었습니다.');
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                    gm.me().productDetailGrid.getStore().load();
                                                },
                                                failure: function (val, action) {

                                                }
                                            });
                                        }
                                    }
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


        this.productDetailStore = Ext.create('Rfx2.store.company.chmr.MaterialStockMoveStore', { pageSize: 100 });
        this.productDetailGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('productDetailGrid'),
            store: this.productDetailStore,
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
                store: this.productDetailStore,
            }),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            columns: [
                { text: '일자', width: 80, style: 'text-align:center', dataIndex: 'stock_date_format' },
                { text: '전일재고', width: 80, style: 'text-align:center', align: 'right', dataIndex: 'pre_stock_new' },
                { text: '생산', width: 80, style: 'text-align:center', align: 'right', dataIndex: 'work_qty' },
                { text: '출하', width: 80, style: 'text-align:center', align: 'right', dataIndex: 'delivery_qty' },
                { text: '매입', width: 80, style: 'text-align:center', align: 'right', dataIndex: 'purchase_qty_sum' },
                { text: '기록재고', width: 80, style: 'text-align:center', align: 'right', dataIndex: 'stock_qty' },

            ],
            title: '재고변동 현황',
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                },
                itemdblclick: function (dv, record, item, index, e) {
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    var rec = selections[0];
                    gm.me().warehouseStore.load();
                    console_logs('>>>> two record', record);
                    
                    gm.me().produceHistoryByProduct.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                    gm.me().produceHistoryByProduct.getProxy().setExtraParam('basic_date_single', record.get('stock_date_format'));
                    gm.me().produceHistoryByProduct.load();

                    gm.me().deliveryOutHistoryByProduct.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                    // gm.me().deliveryOutHistoryByProduct.getProxy().setExtraParam('whouse_uid', 101);
                    gm.me().deliveryOutHistoryByProduct.getProxy().setExtraParam('basic_date_single', record.get('stock_date_format'));
                    gm.me().deliveryOutHistoryByProduct.load();

                    gm.me().grHistoryByProduct.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                    // gm.me().grHistoryByProduct.getProxy().setExtraParam('whouse_uid', 101);
                    gm.me().grHistoryByProduct.getProxy().setExtraParam('basic_date_single',  record.get('stock_date_format'));
                    gm.me().grHistoryByProduct.load();

                    gm.me().warehouseMove.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                    // gm.me().warehouseMove.getProxy().setExtraParam('whouse_uid', 101);
                    gm.me().warehouseMove.getProxy().setExtraParam('basic_date_single', record.get('stock_date_format'));
                    gm.me().warehouseMove.load();


                    var produceForm = Ext.create('Ext.grid.Panel', {
                        store: gm.me().produceHistoryByProduct,
                        selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                        id: gu.id('produceForm'),
                        layout: 'fit',
                        overflowY: 'scroll',
                        region: 'center',
                        width: '50%',
                        height: '99%',
                        bbar: getPageToolbar(gm.me().produceHistoryByProduct),
                        style: 'padding-left:0px;',
                        title: '생산내역',
                        columns: [
                            {
                                text: "생산수량",
                                flex: 1,
                                dataIndex: 'total_qty',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: true,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'total_qty') {
                                        context.record.set('total_qty', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                            // {
                            //     text: "일자",
                            //     flex: 1,
                            //     style: 'text-align:center',
                            //     dataIndex: 'start_date',
                            //     sortable: true,
                            //     renderer: Ext.util.Format.dateRenderer('Y-m-d')
                            // },
                            {
                                text: "양생실",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'machine_name',
                                sortable: true,
                                // renderer: Ext.util.Format.dateRenderer('Y-m-d')
                            },
                            
                        ],
                        renderTo: Ext.getBody(),
                        autoScroll: true,
                        multiSelect: true,
                        pageSize: 100,
                        // width: '50%',
                        // height: '35%',
                        // height: 400,
                    });

                    var deliveryForm = Ext.create('Ext.grid.Panel', {
                        store: gm.me().deliveryOutHistoryByProduct,
                        title: '출하내역',
                        overflowY: 'scroll',
                        selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                        id: gu.id('deliveryForm'),
                        layout: 'fit',
                        region: 'center',
                        width: '48%',
                        bbar: getPageToolbar(gm.me().deliveryOutHistoryByProduct),
                        height: '99%',
                        margin: '0 0 0 5',
                        style: 'padding-left:0px;',
                        // plugins: {
                        //     ptype: 'cellediting',
                        //     clicksToEdit: 2,
                        // },
                        columns: [
                            // {
                            //     text: "일자",
                            //     flex: 0.5,
                            //     style: 'text-align:center',
                            //     dataIndex: 'create_date',
                            //     sortable: true,
                            //     renderer: Ext.util.Format.dateRenderer('Y-m-d')
                            // },
                            {
                                text: "고객사",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'wa_name',
                                sortable: true,
                            },
                            {
                                text: "출하수량",
                                flex: 0.8,
                                dataIndex: 'out_qty',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: true,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'out_qty') {
                                        context.record.set('out_qty', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                            {
                                text: "본사",
                                flex: 0.5,
                                dataIndex: 'head_quarter_out',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: true,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'head_quarter_out') {
                                        context.record.set('head_quarter_out', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                            {
                                text: "야적1",
                                flex: 0.5,
                                dataIndex: 'first_yard_out',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: true,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'first_yard_out') {
                                        context.record.set('first_yard_out', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                            {
                                text: "야적2",
                                flex: 0.5,
                                dataIndex: 'second_yard_out',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: true,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'second_yard_out') {
                                        context.record.set('second_yard_out', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                        ],
                        renderTo: Ext.getBody(),
                        autoScroll: true,
                        multiSelect: true,
                        pageSize: 100,
                    });


                    var moveForm = Ext.create('Ext.grid.Panel', {
                        store: gm.me().warehouseMove,
                        title: '창고이동',
                        overflowY: 'scroll',
                        selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                        id: gu.id('moveForm'),
                        layout: 'fit',
                        region: 'center',
                        width: '48%',
                        bbar: getPageToolbar(gm.me().warehouseMove),
                        height: '99%',
                        margin: '0 0 0 5',
                        style: 'padding-left:0px;',
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 2,
                        },
                        columns: [
                            {
                                text: "일자",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'create_date',
                                sortable: true,
                                renderer: Ext.util.Format.dateRenderer('Y-m-d')
                            },
                            {
                                text: "출발창고",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'wh_start',
                                sortable: true,
                            },
                            {
                                text: "도착창고",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'wh_end',
                                sortable: true,
                            },
                            {
                                text: "이동수량",
                                flex: 1,
                                dataIndex: 'move_qty',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: true,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'move_qty') {
                                        context.record.set('move_qty', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                        ],
                        renderTo: Ext.getBody(),
                        autoScroll: true,
                        multiSelect: true,
                        pageSize: 100,
                    });

                    var grForm = Ext.create('Ext.grid.Panel', {
                        store: gm.me().grHistoryByProduct,
                        title: '매입내역',
                        overflowY: 'scroll',
                        selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                        id: gu.id('grForm'),
                        layout: 'fit',
                        region: 'center',
                        width: '50%',
                        height: '99%',
                        bbar: getPageToolbar(gm.me().grHistoryByProduct),
                        style: 'padding-left:0px;',
                        columns: [
                            {
                                text: "일자",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'gr_date',
                                sortable: true,
                                renderer: Ext.util.Format.dateRenderer('Y-m-d')
                            },
                            {
                                text: "공급사",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'supplier_name',
                                sortable: true,
                            },
                            {
                                text: "수량",
                                flex: 1,
                                dataIndex: 'gr_qty_sum',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: true,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'gr_qty_sum') {
                                        context.record.set('gr_qty_sum', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                        ],
                        renderTo: Ext.getBody(),
                        autoScroll: true,
                        multiSelect: true,
                        pageSize: 100,
                    });

                    var loadForm = Ext.create('Ext.form.Panel', {
                        id: gu.id('loadForm'),
                        layout: 'fit',
                        region: 'center',
                        style: 'padding-left:0px;',
                        dockedItems: [
                            /**{
                                dock: 'top',
                                xtype: 'toolbar',
                                cls: 'my-x-toolbar-default1',
                                items: [
                                    {
                                        id: gu.id('warehouse_uid'),
                                        labelStyle: 'width:60px; color: #ffffff;',
                                        fieldLabel: '창고선택',
                                        // allowBlank: false,
                                        xtype: 'combo',
                                        width: '35%',
                                        // padding: '0 0 5px 30px',
                                        fieldStyle: 'background-image: none;',
                                        store: gm.me().warehouseStore,
                                        emptyText: '선택해주세요',
                                        displayField: 'wh_name',
                                        valueField: 'unique_id_long',
                                        sortInfo: { field: 'wh_name', direction: 'ASC' },
                                        typeAhead: false,
                                        value: 101,
                                        minChars: 1,
                                        listConfig: {
                                            loadingText: 'Searching...',
                                            emptyText: 'No matching posts found.',
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{unique_id_long}">{wh_name}</div>';
                                            }
                                        },
                                        listeners: {
                                            select: function (combo, record) {

                                            }// endofselect
                                        }
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: gu.id('basis_sdate'),
                                        padding: '0 0 5px 5px',
                                        width: '28%',
                                        labelStyle: 'width:60px; color: #ffffff;',
                                        fieldLabel: '기준일자',
                                        format: 'Y-m-d',
                                        value: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                    },
                                    {
                                        xtype: 'label',
                                        text: '-',
                                        margin: '0 0 0 0'
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: gu.id('basis_edate'),
                                        padding: '0 0 5px 5px',
                                        width: '20%',
                                        labelStyle: 'width:60px; color: #ffffff;',
                                        format: 'Y-m-d',
                                        value: new Date(),
                                    },
                                    gm.me().purListSrch
                                ]
                            },**/
                        ],
                        items: [

                            {
                                xtype: 'container',
                                layout: 'hbox',
                                width: '99%',
                                height: '10%',
                                margin: '3 3 3 3',
                                flex: 0.5,
                                items: [
                                    produceForm,
                                    deliveryForm
                                ]
                            },
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                width: '99%',
                                height: '50%',
                                flex: 1,
                                margin: '0 0 0 0',
                                items: [
                                    grForm,
                                    moveForm
                                ]
                            }
                        ],
                        renderTo: Ext.getBody(),
                        autoScroll: true,
                        multiSelect: true,
                        pageSize: 100,
                    });


                    var winProduct = Ext.create('ModalWindow', {
                        title: rec.get('item_concat_desc') + ' 상세내역 (' + record.get('stock_date_format') + ')',
                        width: 900,
                        height: 700,
                        items: [
                            loadForm
                        ],
                        /**buttons: [{
                            text: CMD_OK,
                            handler: function (btn) {
                                winProduct.setLoading(false);
                                winProduct.close();
                            }
                        }]**/
                    });
                    winProduct.show();

                }
            }
        });





        // this.grForm = Ext.create('Ext.grid.Panel', {
        //     // store: detailStore,
        //     selModel: Ext.create("Ext.selection.CheckboxModel", {}),
        //     id: gu.id('grForm'),
        //     layout: 'fit',
        //     region: 'center',
        //     style: 'padding-left:0px;',
        //     plugins: {
        //         ptype: 'cellediting',
        //         clicksToEdit: 2,
        //     },
        //     columns: [
        //         {
        //             text: "일자",
        //             flex: 1,
        //             style: 'text-align:center',
        //             // dataIndex: 'aprv_date',
        //             sortable: true,
        //             renderer: Ext.util.Format.dateRenderer('Y-m-d')
        //         },
        //         {
        //             text: "공급사",
        //             flex: 1,
        //             style: 'text-align:center',
        //             dataIndex: 'aprv_date',
        //             sortable: true,
        //             renderer: Ext.util.Format.dateRenderer('Y-m-d')
        //         },
        //         {
        //             text: "수량",
        //             flex: 1,
        //             // dataIndex: 'money_summary',
        //             align: 'right',
        //             style: 'text-align:center',
        //             sortable: true,
        //             renderer: function (value, context, tmeta) {
        //                 if (context.field == 'price') {
        //                     context.record.set('price', Ext.util.Format.number(value, '0,00/i'));
        //                 }
        //                 if (value == null || value.length < 1) {
        //                     value = 0;
        //                 }
        //                 return Ext.util.Format.number(value, '0,00/i');
        //             },
        //         },
        //     ],
        //     renderTo: Ext.getBody(),
        //     autoScroll: true,
        //     multiSelect: true,
        //     pageSize: 100,
        //     width: 550,
        //     height: 450,
        // });

        //grid 생성.
        this.createGridCore(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        //        this.editAction.setText('상세정보');

        this.grid.on("headerclick", function (iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent) {
            gm.me().store.load();
        });

        Ext.apply(this, {
            layout: 'border',
            items: [{
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
                width: '68%',
                items: [{
                    region: 'west',
                    layout: 'fit',
                    margin: '0 0 0 0',
                    width: '100%',
                    items: [this.grid]
                }]
            }, this.productDetailGrid
            ]
        });

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];

                gm.me().productDetailStore.getProxy().setExtraParam('srcahdUid', selections[0].get('unique_id_long'));
                //this.workOrderGrid.getStore().getProxy().setExtraParam('range_date', '1999-01-01:2099-12-31');

                var whouseUid = gm.me().store.getProxy().getExtraParams()['whouse_uid'];

                gm.me().productDetailStore.getProxy().setExtraParam('whouseUid', whouseUid);
                gm.me().productDetailStore.getProxy().setExtraParam('is_stock_yn', 'Y');
                gm.me().productDetailStore.load(function (record) {
                });

                gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //stoqty_uid
                gm.me().vSELECTED_PO_NO = rec.get('po_no'); //stoqty_uid
                var stock_pos = rec.get('stock_pos'); //stoqty_uid
                console_logs('stock_pos', stock_pos);
                gm.me().vSELECTED_ITEM_CODE = rec.get('item_code');

                if (stock_pos != null && stock_pos.length > 0) {
                    this.printBarcodeAction.disable();
                } else {
                    this.printBarcodeAction.enable();
                }

                if (selections.length == 1) {
                    this.warehousingAction.enable();
                    this.releaseAction.enable();
                    this.forcePrevStockAction.enable();
                    this.moveWarehouseStock.enable();
                } else {
                    this.warehousingAction.disable();
                    this.releaseAction.disable();
                    this.forcePrevStockAction.disable();
                    this.moveWarehouseStock.disable();
                }

            } else {

                this.warehousingAction.disable();
                this.releaseAction.disable();
                this.forcePrevStockAction.disable();
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().vSELECTED_PO_NO = '';
            }

        });

        //디폴트 로드

        gm.setCenterLoading(false);

        for (var i = 0; i < this.searchField.length; i++) {
            var type = 'text';
            var key = this.searchField[i];
            //console_logs('==>key', key);
            if (typeof key == 'string') {

            } else if (typeof key == 'object') {
                var myO = key;
                key = myO['field_id'];
                type = myO['type'];
            }

            var srchId = this.link + '-' + gMain.getSearchField(key);

            var value = null;
            var value1 = null;
            try {
                var o = this.getSearchWidget(srchId);
                if (o == null) {

                } else {
                    value = o.getValue();
                }
                //console_logs('value', value);
                var o1 = this.getSearchWidget(srchId + '_')
                //console_logs('o1', o1);
                if (o1 == null) {

                } else {
                    value1 = o1.getValue();
                }
            } catch (e) {

            }

            if (value1 != null && value1 != '') {//콤보박스 히든밸류
                this.store.getProxy().setExtraParam(key, value1);
            } else {

                if (key != null && key != '' && value != null && value.length > 0) {
                    if (type == 'area' || key == 'unique_id' || key == 'whouse_uid'
                        || key == 'barcode' || typeof key == 'object') {
                        this.store.getProxy().setExtraParam(key, value);
                    } else {
                        //console_logs('key', key);
                        //console_logs('value', value);
                        var enValue = Ext.JSON.encode('%' + value + '%');
                        this.store.getProxy().setExtraParam(key, enValue);
                    }//endofelse

                } else {//endofif
                    this.store.getProxy().setExtraParam(key, null);
                }

            }
        }

        // this.store.getProxy().setExtraParam('existStock', 'true');

        this.store.load(function (records) {

        });

    },
    items: [],
    productviewType: "ALL",
    potype: 'PRD',
    records: [],
    cnt: 0,
    po_no_records: [],


    //바코드 출력

    printBarcode: function () {

        //var selections = selected_rec;
        var selections = gm.me().grid.getSelectionModel().getSelection();

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
                Ext.Msg.alert('안내', '동일한 품명을 선택해주세요', function () { });

            } if (checkCompare == 0) {
                //prwin = gMain.selPanel.prbarcodeopen(form);
                prwin = gMain.selPanel.barcodeModal(form);

            }
        }

    },

    // 바코드 모달



    barcodeModal: function (form) {

        //셀렉션붙임 시작
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

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


        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            console_logs('rec', rec);
            var uid = rec.get('unique_id');  //rtgast unique_id???
            var item_code = rec.get('item_code');
            var item_name = rec.get('item_name');
            var specification = rec.get('specification');
            var lot_no = rec.get('lot_no');
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

                    //text: item_code,
                    text: '포장수량 설정',

                    width: '20%',
                    dataIndex: 'packing',
                    editor: 'numberfield',
                    //value : this.value,

                    listeners: {

                    },

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
                    //text: '품명(' + item_name + ') 입고 수량 :' + gr_quan_arr,
                    text: '출력 매수',
                    //value : gu.id('countVale') * gr_quan_arr,
                    width: '20%',
                    dataIndex: 'each',
                    //editor: 'textfield',
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

                // {
                //     text: 'Lot 입력 ',
                //     width: '30%',
                //     //id 중복 xxxx
                //     id: gu.id('OrderGoodsLotInputForm'),

                //     //dataIndex: 'supplyerLot',
                //     dataIndex: 'input_lot',
                //     name: 'input_lot',

                //     editor: 'textfield',
                //     sortable: false,

                //     // renderer : function(value) {
                //     //     return printQuan * boxPacking;

                //     // }
                // },



            ],




            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                //clicksToEdit: 2,
                clicksToEdit: 6,
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


                                    //+ 버튼은 한번만 입력되도록

                                    // if(getCount==0 ) {

                                    //     console_log('item index >> null ');
                                    //     store.insert(store.getCount(), new Ext.data.Record({
                                    //         'packing': '0', 'each': '0'
                                    //     }));

                                    //  };

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

            ]
        });


        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '자재 입고 바코드 출력  ',
            width: 770,
            height: 350,
            plain: true,
            //items: poEditForm,
            //items: form,

            items: etc_grid,

            overflowY: 'scroll',

            buttons: [{
                text: '바코드 출력',

                handler: function (btn) {

                    var store = gu.getCmp('etc_grid').getStore();
                    var totalIndex = store.getCount();

                    //     store.insert(store.getCount(), new Ext.data.Record({
                    //     'packing': '0', 'each': '0'
                    //  }));

                    //      var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                    //                 gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));

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
                        //packingTotal.push(packingCount);
                        //printTotal.push(printCount);
                        intputLotno = multiple + store.data.items[i].get('input_lot');


                        var packing = store.data.items[i].get('packing');
                        var each = store.data.items[i].get('each');
                        var input_lot = store.data.items[i].get('input_lot');

                        quanArray.push(packing);
                        printQuanArray.push(each);
                        lotArray.push(input_lot);

                    }




                    // var testLot = gu.getCmp('OrderGoodsLotInputForm');
                    // var LotValue = testLot['value'];


                    var LotValue = intputLotno

                    //원본 (+ 0번째만)
                    //var checkValue = printQuan * boxPacking;

                    //prwin = gm.me().checkSumOpen(form);

                    console_logs('GrQuan 출력 >>', GrQuan);
                    console_logs('LotValue 출력 >>', LotValue);

                    if (multiple < GrQuan) {
                        // console_log('총 수량 보다 적습니다'  );
                        // prwin = gm.me().checkSumOpen(form);

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



                        for (var x = 0; x < sumQty; x++) {
                            //리스트별로 포장수량 입력
                            packingArray.push(boxPacking);
                        }

                        if (btn == 'no') {
                            prWin.close();

                        } else {


                            Ext.Ajax.request({
                                //url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=sanction',
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
                                    //gr_quan_arr : gr_quan_list
                                    gr_quan_list: gr_quan_arr,
                                    pcs_desc_list: pcs_desc_arr,
                                    input_lot: LotValue,
                                    //Boolean : Boolean,
                                    labelType: 'order',


                                    quanArray: quanArray,
                                    printQuanArray: printQuanArray,
                                    lotArray: lotArray
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

    doForcePrevStockChange: function () {

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('releaseForm'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '<b>전일 이월재고와 현재 재고를 변경합니다.<br><font color=red>이 작업을 시행할 시 취소할 수 없습니다.</font></b>',
                    items: [
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            fieldLabel: '품명',
                            name: 'item_code',
                            allowBlank: false,
                            editable: false,
                            value: rec.get('item_concat_desc')
                        },
                        {
                            fieldLabel: '사유',
                            xtype: 'textfield',
                            anchor: '100%',
                            name: 'reason_text'
                        },
                        {
                            xtype: 'numberfield',
                            anchor: '100%',
                            fieldLabel: '변경수량',
                            name: 'change_quan',
                            allowBlank: false,
                            value: 0
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '제품 이월재고 변경',
            width: 500,
            height: 250,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var selection = gm.me().grid.getSelectionModel().getSelection();
                    if (selection.length > 0) {
                        var rec = selection[0];
                        form.submit({
                            url: CONTEXT_PATH + '/index/process.do?method=forceMaterialPrevStock',
                            params: {
                                srcahd_uid: rec.get('unique_id_long'),
                                pre_stock: rec.get('pre_stock')
                            },
                            success: function (val, action) {
                                prWin.close();
                                gm.me().store.load();
                            },
                            failure: function (val, action) {
                                prWin.close();
                                gm.me().store.load();
                            }
                        });
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function (btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    },

    moveWareHouse: function () {

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('moveForm'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '선택 제품에 대한 창고이동을 실시합니다.<br><b>출발창고와 도착창고 이동수량을 정확하게 입력해주시기 바랍니다.</b>',
                    items: [
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            fieldLabel: '품명',
                            name: 'item_code',
                            allowBlank: false,
                            editable: false,
                            value: rec.get('item_concat_desc')
                        },
                        {
                            fieldLabel: '출발창고',
                            xtype: 'combo',
                            anchor: '100%',
                            id: gu.id('from_warehouse'),
                            name: 'from_warehouse',
                            mode: 'local',
                            store: Ext.create('Mplm.store.WareHouseStore', { hasNull: false, parentCode: 'RELEASE_CODE' }),
                            displayField: 'wh_name',
                            valueField: 'unique_id_long',
                            emptyText: '선택',
                            sortInfo: { field: 'wh_name', direction: 'DESC' },
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div>{wh_name}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
                        },
                        {
                            fieldLabel: '도착창고',
                            xtype: 'combo',
                            anchor: '100%',
                            id: gu.id('to_warehouse'),
                            name: 'to_warehouse',
                            mode: 'local',
                            store: Ext.create('Mplm.store.WareHouseStore', { hasNull: false, parentCode: 'RELEASE_CODE' }),
                            displayField: 'wh_name',
                            valueField: 'unique_id_long',
                            emptyText: '선택',
                            sortInfo: { field: 'systemCode', direction: 'DESC' },
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div>{wh_name}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
                        },
                        // {
                        //     fieldLabel: '사유',
                        //     xtype: 'textfield',
                        //     anchor: '100%',
                        //     name: 'reason_text'
                        // },
                        {
                            xtype: 'numberfield',
                            anchor: '100%',
                            fieldLabel: '이동수량',
                            id: gu.id('move_qty'),
                            name: 'move_qty',
                            allowBlank: false,
                            value: 0
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '창고이동',
            width: 500,
            height: 270,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var selection = gm.me().grid.getSelectionModel().getSelection();
                    if (selection.length > 0) {
                        var rec = selection[0];
                        var move_qty = gu.getCmp('move_qty').getValue();
                        var to_warehouse = gu.getCmp('to_warehouse').getValue();
                        var from_warehouse = gu.getCmp('from_warehouse').getValue();
                        var is_move = true;
                        if (to_warehouse == from_warehouse) {
                            is_move = false;
                            Ext.MessageBox.alert('알림', '출발창고와 도착창고가 일치합니다.');
                            return false;
                        } else {
                            is_move = true;
                        }

                        if (move_qty === 0) {
                            is_move = false;
                            Ext.MessageBox.alert('알림', '이동수량이 0이 입력되었습니다.');
                            return false;
                        } else {
                            is_move = true;
                        }

                        if (is_move === true) {
                            console_logs('>> status', 'OK...');
                            form.submit({
                                url: CONTEXT_PATH + '/index/process.do?method=moveWarehouseQty',
                                params: {
                                    srcahd_uid: rec.get('unique_id_long'),
                                },
                                success: function (val, action) {
                                    prWin.close();
                                    gm.me().store.load();
                                },
                                failure: function (val, action) {
                                    prWin.close();
                                    gm.me().store.load();
                                }
                            });
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function (btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    },


    doRelease: function () {

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('releaseForm'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '입력사항',
                    items: [
                        {
                            fieldLabel: '사유',
                            xtype: 'combo',
                            anchor: '100%',
                            name: 'reason_text',
                            mode: 'local',
                            store: Ext.create('Rfx.store.GeneralCodeStore', { hasNull: false, parentCode: 'RELEASE_CODE' }),
                            displayField: 'codeName',
                            valueField: 'systemCode',
                            emptyText: '선택',
                            sortInfo: { field: 'systemCode', direction: 'DESC' },
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
                            allowBlank: false,
                            value: '',
                            format: 'Y-m-d'
                        },
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            fieldLabel: '품번',
                            name: 'item_code',
                            allowBlank: false,
                            editable: false,
                            value: rec.get('item_code')
                        },
                        {
                            xtype: 'numberfield',
                            anchor: '100%',
                            fieldLabel: '수량',
                            name: 'gr_quan',
                            allowBlank: false,
                            value: 0
                        },
                        {
                            fieldLabel: '출고창고',
                            xtype: 'combo',
                            anchor: '100%',
                            id: gu.id('out_warehouse'),
                            name: 'out_warehouse',
                            mode: 'local',
                            store: Ext.create('Mplm.store.WareHouseStore', { hasNull: false, parentCode: 'RELEASE_CODE' }),
                            displayField: 'wh_name',
                            valueField: 'unique_id_long',
                            emptyText: '선택',
                            sortInfo: { field: 'wh_name', direction: 'DESC' },
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div>{wh_name}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
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
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: gm.getMC('CMD_Release', '출고'),
            width: 350,
            height: 270,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var selection = gm.me().grid.getSelectionModel().getSelection();

                    if (selection.length > 0) {
                        var rec = selection[0];

                        form.submit({
                            url: CONTEXT_PATH + '/index/process.do?method=releaseProductDirectVersion',
                            params: {
                                srcahd_uid: rec.get('unique_id_long'),
                                warehouse_uid: gu.getCmp('out_warehouse').getValue()
                            },
                            success: function (val, action) {
                                prWin.close();
                                gm.me().store.load();
                            },
                            failure: function (val, action) {
                                prWin.close();
                                gm.me().store.load();
                            }
                        });
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function (btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    },

    doWarehousing: function () {

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];


        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('warehousingForm'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '기본정보 입력',
                    items: [
                        {
                            fieldLabel: gm.me().getColName('unique_id'),
                            xtype: 'textfield',
                            id: gu.id('unique_id'),
                            name: 'unique_id',
                            emptyText: '자재 UID',
                            hidden: true,
                            value: rec.get('unique_id_long'),
                            flex: 1,
                            width: '99%',
                            readOnly: true,
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        },
                        {
                            fieldLabel: '품번',
                            xtype: 'textfield',
                            id: gu.id('item_code'),
                            name: 'item_code',
                            value: rec.get('item_code'),
                            flex: 1,
                            width: '99%',
                            readOnly: true,
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        },
                        {
                            fieldLabel: '품명',
                            xtype: 'textfield',
                            id: gu.id('item_name'),
                            name: 'item_name',
                            value: rec.get('item_concat_desc'),
                            flex: 1,
                            width: '99%',
                            readOnly: true,
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        }, {
                            fieldLabel: '규격',
                            xtype: 'textfield',
                            id: gu.id('specification'),
                            name: 'item_name',
                            value: rec.get('specification'),
                            flex: 1,
                            width: '99%',
                            readOnly: true,
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        },
                        {
                            fieldLabel: '입고수량',
                            xtype: 'numberfield',
                            minValue: 0,
                            width: '99%',
                            id: gu.id('wh_qty'),
                            name: 'wh_qty',
                            allowBlank: true,
                            value: '1',
                            margins: '5'
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '입고창고 선택',
                            id: gu.id('whouse_uid'),
                            width: '99%',
                            // anchor: '97%',
                            store: gm.me().warehouseStore,
                            name: 'whouse_uid',
                            valueField: 'unique_id_long',
                            minChars: 1,
                            allowBlank: false,
                            displayField: 'wh_name',
                            emptyText: '선택해주세요.',
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id_long}">{wh_name}</div>';
                                }
                            }
                        },
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '제품 입고',
            width: 500,
            height: 270,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var selection = gm.me().grid.getSelectionModel().getSelection();
                    if (selection.length > 0) {
                        var rec = selection[0];
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/inventory/prchStock.do?method=addQty',
                            params: {
                                unique_id: rec.get('unique_id_long'),
                                barcode: rec.get('unique_id_long'),
                                stock_pos: '', /*NULL을 넣어야 V2에서 유효재고*/
                                innout_desc: '',
                                wh_qty: gu.getCmp('wh_qty').getValue(),
                                whouse_uid: gu.getCmp('whouse_uid').getValue()
                            },

                            success: function (result, request) {
                                var resultText = result.responseText;
                                console_log('result:' + resultText);
                                gm.me().getStore().load(function () {
                                });
                                if (prWin) {
                                    prWin.close();
                                }
                                //alert('finished..');
                            },
                            failure: extjsUtil.failureMessage
                        });//endof ajax request
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function (btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    },

    // itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
    //     var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
    //     var rec = selections[0];
    //     gm.me().warehouseStore.load();

    //     var basic_sdate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    //     var basic_edate = new Date();

    //     var basic_sdate_str = basic_sdate.getFullYear() + '-' + ((basic_sdate.getMonth() + 1) < 10 ? '0' + (basic_sdate.getMonth() + 1) : (basic_sdate.getMonth() + 1)) + '-' + ((basic_sdate.getDate()) < 10 ? '0' + (basic_sdate.getDate()) : (basic_sdate.getDate()));
    //     var basic_edate_str = basic_edate.getFullYear() + '-' + ((basic_edate.getMonth() + 1) < 10 ? '0' + (basic_edate.getMonth() + 1) : (basic_edate.getMonth() + 1)) + '-' + ((basic_edate.getDate()) < 10 ? '0' + (basic_edate.getDate()) : (basic_edate.getDate()));

    //     gm.me().produceHistoryByProduct.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
    //     gm.me().produceHistoryByProduct.getProxy().setExtraParam('basic_date', basic_sdate_str + ':' + basic_edate_str);
    //     gm.me().produceHistoryByProduct.load();

    //     gm.me().deliveryOutHistoryByProduct.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
    //     gm.me().deliveryOutHistoryByProduct.getProxy().setExtraParam('whouse_uid', 101);
    //     gm.me().deliveryOutHistoryByProduct.getProxy().setExtraParam('basic_date', basic_sdate_str + ':' + basic_edate_str);
    //     gm.me().deliveryOutHistoryByProduct.load();

    //     gm.me().grHistoryByProduct.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
    //     gm.me().grHistoryByProduct.getProxy().setExtraParam('whouse_uid', 101);
    //     gm.me().grHistoryByProduct.getProxy().setExtraParam('basic_date', basic_sdate_str + ':' + basic_edate_str);
    //     gm.me().grHistoryByProduct.load();

    //     gm.me().warehouseMove.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
    //     gm.me().warehouseMove.getProxy().setExtraParam('whouse_uid', 101);
    //     gm.me().warehouseMove.getProxy().setExtraParam('basic_date', basic_sdate_str + ':' + basic_edate_str);
    //     gm.me().warehouseMove.load();

    //     var produceForm = Ext.create('Ext.grid.Panel', {
    //         store: gm.me().produceHistoryByProduct,
    //         selModel: Ext.create("Ext.selection.CheckboxModel", {}),
    //         id: gu.id('produceForm'),
    //         layout: 'fit',
    //         overflowY: 'scroll',
    //         region: 'center',
    //         width: '50%',
    //         height: '99%',
    //         bbar: getPageToolbar(gm.me().produceHistoryByProduct),
    //         style: 'padding-left:0px;',
    //         title: '생산내역',
    //         columns: [
    //             {
    //                 text: "일자",
    //                 flex: 1,
    //                 style: 'text-align:center',
    //                 dataIndex: 'start_date',
    //                 sortable: true,
    //                 renderer: Ext.util.Format.dateRenderer('Y-m-d')
    //             },
    //             {
    //                 text: "생산수량",
    //                 flex: 1,
    //                 dataIndex: 'total_qty',
    //                 align: 'right',
    //                 style: 'text-align:center',
    //                 sortable: true,
    //                 renderer: function (value, context, tmeta) {
    //                     if (context.field == 'total_qty') {
    //                         context.record.set('total_qty', Ext.util.Format.number(value, '0,00/i'));
    //                     }
    //                     if (value == null || value.length < 1) {
    //                         value = 0;
    //                     }
    //                     return Ext.util.Format.number(value, '0,00/i');
    //                 },
    //             },
    //         ],
    //         renderTo: Ext.getBody(),
    //         autoScroll: true,
    //         multiSelect: true,
    //         pageSize: 100,
    //         // width: '50%',
    //         // height: '35%',
    //         // height: 400,
    //     });

    //     var deliveryForm = Ext.create('Ext.grid.Panel', {
    //         store: gm.me().deliveryOutHistoryByProduct,
    //         title: '출하내역',
    //         overflowY: 'scroll',
    //         selModel: Ext.create("Ext.selection.CheckboxModel", {}),
    //         id: gu.id('deliveryForm'),
    //         layout: 'fit',
    //         region: 'center',
    //         width: '48%',
    //         bbar: getPageToolbar(gm.me().deliveryOutHistoryByProduct),
    //         height: '99%',
    //         margin: '0 0 0 5',
    //         style: 'padding-left:0px;',
    //         // plugins: {
    //         //     ptype: 'cellediting',
    //         //     clicksToEdit: 2,
    //         // },
    //         columns: [
    //             {
    //                 text: "일자",
    //                 flex: 0.5,
    //                 style: 'text-align:center',
    //                 dataIndex: 'create_date',
    //                 sortable: true,
    //                 renderer: Ext.util.Format.dateRenderer('Y-m-d')
    //             },
    //             {
    //                 text: "고객사",
    //                 flex: 1,
    //                 style: 'text-align:center',
    //                 dataIndex: 'wa_name',
    //                 sortable: true,
    //             },
    //             {
    //                 text: "출하수량",
    //                 flex: 0.5,
    //                 dataIndex: 'out_qty',
    //                 align: 'right',
    //                 style: 'text-align:center',
    //                 sortable: true,
    //                 renderer: function (value, context, tmeta) {
    //                     if (context.field == 'out_qty') {
    //                         context.record.set('out_qty', Ext.util.Format.number(value, '0,00/i'));
    //                     }
    //                     if (value == null || value.length < 1) {
    //                         value = 0;
    //                     }
    //                     return Ext.util.Format.number(value, '0,00/i');
    //                 },
    //             },
    //         ],
    //         renderTo: Ext.getBody(),
    //         autoScroll: true,
    //         multiSelect: true,
    //         pageSize: 100,
    //         // width: '50%',
    //         // height: '35%',
    //         // width: 200,
    //         // height: 200,
    //     });


    //     var moveForm = Ext.create('Ext.grid.Panel', {
    //         store: gm.me().warehouseMove,
    //         title: '창고이동',
    //         overflowY: 'scroll',
    //         selModel: Ext.create("Ext.selection.CheckboxModel", {}),
    //         id: gu.id('moveForm'),
    //         layout: 'fit',
    //         region: 'center',
    //         width: '48%',
    //         bbar: getPageToolbar(gm.me().warehouseMove),
    //         height: '99%',
    //         margin: '0 0 0 5',
    //         style: 'padding-left:0px;',
    //         plugins: {
    //             ptype: 'cellediting',
    //             clicksToEdit: 2,
    //         },
    //         columns: [
    //             {
    //                 text: "일자",
    //                 flex: 1,
    //                 style: 'text-align:center',
    //                 dataIndex: 'create_date',
    //                 sortable: true,
    //                 renderer: Ext.util.Format.dateRenderer('Y-m-d')
    //             },
    //             {
    //                 text: "출발창고",
    //                 flex: 1,
    //                 style: 'text-align:center',
    //                 dataIndex: 'wh_start',
    //                 sortable: true,
    //                 // renderer: Ext.util.Format.dateRenderer('Y-m-d')
    //             },
    //             {
    //                 text: "도착창고",
    //                 flex: 1,
    //                 style: 'text-align:center',
    //                 dataIndex: 'wh_end',
    //                 sortable: true,
    //                 // renderer: Ext.util.Format.dateRenderer('Y-m-d')
    //             },
    //             {
    //                 text: "이동수량",
    //                 flex: 1,
    //                 dataIndex: 'move_qty',
    //                 align: 'right',
    //                 style: 'text-align:center',
    //                 sortable: true,
    //                 renderer: function (value, context, tmeta) {
    //                     if (context.field == 'move_qty') {
    //                         context.record.set('move_qty', Ext.util.Format.number(value, '0,00/i'));
    //                     }
    //                     if (value == null || value.length < 1) {
    //                         value = 0;
    //                     }
    //                     return Ext.util.Format.number(value, '0,00/i');
    //                 },
    //             },
    //         ],
    //         renderTo: Ext.getBody(),
    //         autoScroll: true,
    //         multiSelect: true,
    //         pageSize: 100,
    //         // width: '50%',
    //         // height: '35%',
    //         // width: 200,
    //         // height: 200,
    //     });

    //     var grForm = Ext.create('Ext.grid.Panel', {
    //         store: gm.me().grHistoryByProduct,
    //         title: '매입내역',
    //         overflowY: 'scroll',
    //         selModel: Ext.create("Ext.selection.CheckboxModel", {}),
    //         id: gu.id('grForm'),
    //         layout: 'fit',
    //         region: 'center',
    //         width: '50%',
    //         height: '99%',
    //         bbar: getPageToolbar(gm.me().grHistoryByProduct),
    //         // margin: '0 0 0 10',
    //         style: 'padding-left:0px;',
    //         columns: [
    //             {
    //                 text: "일자",
    //                 flex: 1,
    //                 style: 'text-align:center',
    //                 dataIndex: 'gr_date',
    //                 sortable: true,
    //                 renderer: Ext.util.Format.dateRenderer('Y-m-d')
    //             },
    //             {
    //                 text: "공급사",
    //                 flex: 1,
    //                 style: 'text-align:center',
    //                 dataIndex: 'supplier_name',
    //                 sortable: true,
    //                 // renderer: Ext.util.Format.dateRenderer('Y-m-d')
    //             },
    //             {
    //                 text: "수량",
    //                 flex: 1,
    //                 dataIndex: 'gr_qty_sum',
    //                 align: 'right',
    //                 style: 'text-align:center',
    //                 sortable: true,
    //                 renderer: function (value, context, tmeta) {
    //                     if (context.field == 'gr_qty_sum') {
    //                         context.record.set('gr_qty_sum', Ext.util.Format.number(value, '0,00/i'));
    //                     }
    //                     if (value == null || value.length < 1) {
    //                         value = 0;
    //                     }
    //                     return Ext.util.Format.number(value, '0,00/i');
    //                 },
    //             },
    //         ],
    //         renderTo: Ext.getBody(),
    //         autoScroll: true,
    //         multiSelect: true,
    //         pageSize: 100,
    //         // width: '50%',
    //         // height: '35%',
    //         // width: 200,
    //         // height: 200,
    //     });

    //     var loadForm = Ext.create('Ext.form.Panel', {
    //         id: gu.id('loadForm'),
    //         layout: 'fit',
    //         region: 'center',
    //         style: 'padding-left:0px;',
    //         dockedItems: [
    //             {
    //                 dock: 'top',
    //                 xtype: 'toolbar',
    //                 cls: 'my-x-toolbar-default1',
    //                 items: [
    //                     {
    //                         id: gu.id('warehouse_uid'),
    //                         labelStyle: 'width:60px; color: #ffffff;',
    //                         fieldLabel: '창고선택',
    //                         // allowBlank: false,
    //                         xtype: 'combo',
    //                         width: '35%',
    //                         // padding: '0 0 5px 30px',
    //                         fieldStyle: 'background-image: none;',
    //                         store: gm.me().warehouseStore,
    //                         emptyText: '선택해주세요',
    //                         displayField: 'wh_name',
    //                         valueField: 'unique_id_long',
    //                         sortInfo: { field: 'wh_name', direction: 'ASC' },
    //                         typeAhead: false,
    //                         value: 101,
    //                         minChars: 1,
    //                         listConfig: {
    //                             loadingText: 'Searching...',
    //                             emptyText: 'No matching posts found.',
    //                             getInnerTpl: function () {
    //                                 return '<div data-qtip="{unique_id_long}">{wh_name}</div>';
    //                             }
    //                         },
    //                         listeners: {
    //                             select: function (combo, record) {
    //                                 // gu.getCmp('final_order_com_unique').setValue(gu.getCmp('order_com_unique').getValue());
    //                                 // Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
    //                             }// endofselect
    //                         }
    //                     },
    //                     {
    //                         xtype: 'datefield',
    //                         id: gu.id('basis_sdate'),
    //                         padding: '0 0 5px 5px',
    //                         width: '28%',
    //                         labelStyle: 'width:60px; color: #ffffff;',
    //                         fieldLabel: '기준일자',
    //                         format: 'Y-m-d',
    //                         value: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    //                     },
    //                     {
    //                         xtype: 'label',
    //                         text: '-',
    //                         margin: '0 0 0 0'
    //                     },
    //                     {
    //                         xtype: 'datefield',
    //                         id: gu.id('basis_edate'),
    //                         padding: '0 0 5px 5px',
    //                         width: '20%',
    //                         // fieldLabel: '~',
    //                         labelStyle: 'width:60px; color: #ffffff;',
    //                         // labelStyle: 'width:60px; color: #ffffff;',
    //                         // fieldLabel: '기준일자',
    //                         format: 'Y-m-d',
    //                         value: new Date(),
    //                     },
    //                     this.purListSrch
    //                 ]
    //             },
    //         ],
    //         items: [

    //             {
    //                 xtype: 'container',
    //                 layout: 'hbox',
    //                 width: '99%',
    //                 height: '10%',
    //                 margin: '3 3 3 3',
    //                 flex: 0.5,
    //                 items: [
    //                     produceForm,
    //                     deliveryForm
    //                 ]
    //             },
    //             {
    //                 xtype: 'container',
    //                 layout: 'hbox',
    //                 width: '99%',
    //                 height: '50%',
    //                 flex: 1,
    //                 margin: '0 0 0 0',
    //                 items: [
    //                     grForm,
    //                     moveForm
    //                 ]
    //             }
    //         ],
    //         renderTo: Ext.getBody(),
    //         autoScroll: true,
    //         multiSelect: true,
    //         pageSize: 100,
    //     });


    //     var winProduct = Ext.create('ModalWindow', {
    //         title: rec.get('item_concat_desc') + ' 상세내역',
    //         width: 900,
    //         height: 700,
    //         items: [ 
    //             loadForm
    //         ],
    //         /**buttons: [{
    //             text: CMD_OK,
    //             handler: function (btn) {
    //                 winProduct.setLoading(false);
    //                 winProduct.close();
    //             }
    //         }]**/
    //     });
    //     winProduct.show();
    // },


    searchStore: Ext.create('Mplm.store.MaterialSearchStore', {}),
    warehouseStore: Ext.create('Mplm.store.WareHouseStore'),
    projectStore: Ext.create('Mplm.store.ProjectStore', {}),
    produceHistoryByProduct: Ext.create('Rfx2.store.company.chmr.ProduceHistoryByProduct'),
    deliveryOutHistoryByProduct: Ext.create('Rfx2.store.company.chmr.DeliveryOutHistoryByProduct'),
    grHistoryByProduct: Ext.create('Rfx2.store.company.chmr.GrHistoryByProductStore'),
    warehouseMove: Ext.create('Rfx2.store.company.chmr.WarehouseMoveHistoryStore'),
});
