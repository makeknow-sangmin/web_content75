//출하 관리
Ext.define('Rfx2.view.company.bioprotech.salesDelivery.ProductStockVerView', {
    extend         : 'Rfx2.base.BaseView',
    xtype          : 'product-stock-view',
    initComponent  : function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.setDefValue('create_date', new Date());

        var next7 = gu.getNextday(7);
        this.setDefValue('change_date', next7);

        this.addSearchField({
            type    : 'checkbox',
            field_id: 'existStock',
            items   : [
                {
                    boxLabel: gm.getMC('CMD_Only_items_in_stock', '재고 있는 품목만'),
                    checked : true
                },
            ],
        });

        this.addSearchField({
            field_id      : 'whouse_uid',
            id            : gu.id('whouse_uid_combo')
            , emptyText   : '창고명'
            , width       : 200
            , store       : "Rfx2.store.company.bioprotech.WarehouseProductStore"
            , displayField: 'wh_name'
            , valueField  : 'unique_id'
            , defaultValue: '11030245000001'
            , autoLoad    : true
            , innerTpl    : '<div data-qtip="{unique_id}">{wh_name}</div>'
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.addSearchField('class_name');
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.printBarcodeAction = Ext.create('Ext.Action', {
            iconCls : 'barcode',
            text    : gm.getMC('CMD_Inventory_Barcode', '재고조사 바코드'),
            tooltip : '제품의 바코드를 출력합니다.',
            hidden  : gu.setCustomBtnHiddenProp('printBarcodeAction'),
            disabled: true,
            handler : function () {
                gm.me().printBarcode();
            }
        });

        this.warehousingAction = Ext.create('Ext.Action', {
            iconCls : 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text    : gm.getMC('CMD_Wearing', '입고'),
            tooltip : '제품을 입고합니다.',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('warehousingAction'),
            handler : function () {
                gm.me().doWarehousing();
            }
        });

        this.releaseAction = Ext.create('Ext.Action', {
            iconCls : 'font-awesome_4-7-0_sign-out_14_0_5395c4_none',
            text    : gm.getMC('CMD_Release', '출고'),
            tooltip : '제품을 출고합니다.',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('releaseAction'),
            handler : function () {
                gm.me().doRelease();
            }
        });

        this.addGoodsMoveAction = Ext.create('Ext.Action', {
            iconCls : 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text    : '창고이동요청',
            tooltip : '자재의 창고를 이동 요청합니다',
            hidden  : gu.setCustomBtnHiddenProp('addGoodsMoveAction'),
            disabled: true,
            handler : function () {

                let barcodeStore = Ext.create('Rfx2.store.company.bioprotech.BarcodeStockStore', {});

                let barcodeGrid = Ext.create('Ext.grid.Panel', {
                    store      : barcodeStore,
                    cls        : 'rfx-panel',
                    id         : gu.id('barcodeGrid'),
                    collapsible: false,
                    multiSelect: false,
                    width      : 550,
                    height     : 300,
                    margin     : '0 0 20 0',
                    viewConfig : {
                        markDirty: false
                    },
                    autoHeight : true,
                    selModel   : 'checkboxmodel',
                    plugins    : {
                        ptype       : 'cellediting',
                        clicksToEdit: 1
                    },
                    frame      : false,
                    border     : true,
                    forceFit   : true,
                    columns    : [
                        {text: '바코드번호', width: 120, dataIndex: 'barcode', style: 'text-align:center', sortable: false},
                        {text: 'LOT No.', width: 130, dataIndex: 'lot_no', style: 'text-align:center', sortable: false},
                        {
                            text: '포장수량', width: 120, dataIndex: 'packing_quan', sortable: false,
                            // editor: 'textfield',
                            style   : 'text-align:center',
                            align   : 'right',
                            renderer: renderDecimalNumber
                        }
                    ],
                    listeners  : {
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
                        edit           : function () {

                            let selection = gu.getCmp('barcodeGrid').getSelectionModel().getSelection();

                            let quan = 0;
                            let lblGridResult = gu.getCmp('lblGridResult');

                            for (let i = 0; i < selection.length; i++) {
                                let grQuan = selection[i].get('gr_quan');
                                quan += grQuan;
                            }

                            if (selection.length === 0) {
                                lblGridResult.setHtml('<b>바코드를 선택하시기 바랍니다.</b>');
                            } else {
                                lblGridResult.setHtml('<b>출고 수량 : ' + renderDecimalNumber(quan) + '</b>');
                            }
                        }
                    }
                });

                let recSub = gm.me().grid.getSelectionModel().getSelection()[0];
                let rec_second = gm.me().productDetailGrid.getSelectionModel().getSelection()[0];

                let form = Ext.create('Ext.form.Panel', {
                    id         : gu.id('formPanel'),
                    xtype      : 'form',
                    frame      : false,
                    border     : false,
                    width      : '100%',
                    layout     : 'column',
                    bodyPadding: 10,
                    items      : [{
                        xtype      : 'fieldset',
                        collapsible: false,
                        title      : gm.me().getMC('msg_order_dia_header_title', '공통정보'),
                        width      : '100%',
                        style      : 'padding:10px',
                        defaults   : {
                            labelStyle: 'padding:10px',
                            anchor    : '100%',
                            layout    : {
                                type: 'column'
                            }
                        },
                        items      : [
                            {
                                xtype         : 'container',
                                width         : '100%',
                                border        : true,
                                layout        : {
                                    type: 'vbox'
                                },
                                defaultMargins: {
                                    top   : 0,
                                    right : 0,
                                    bottom: 0,
                                    left  : 10
                                },
                                items         : [
                                    {
                                        xtype : 'hiddenfield',
                                        id    : gu.id('unique_id_long'),
                                        name  : 'unique_id_long',
                                        hidden: true,
                                        value : rec_second.get('unique_id_long')
                                    },
                                    {
                                        fieldLabel: '현재창고',
                                        xtype     : 'textfield',
                                        id        : gu.id('wh_name'),
                                        width     : 550,
                                        name      : 'wh_name',
                                        value     : recSub.get('wh_name'),
                                        flex      : 1,
                                        readOnly  : true,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                    },
                                    {
                                        fieldLabel  : '대상창고',
                                        xtype       : 'combo',
                                        width       : 550,
                                        name        : 'whouse_uid',
                                        mode        : 'local',
                                        store       : Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {}),
                                        displayField: 'wh_name',
                                        valueField  : 'unique_id_long',
                                        emptyText   : '선택',
                                        sortInfo    : {field: 'systemCode', direction: 'DESC'},
                                        typeAhead   : false,
                                        minChars    : 1,
                                        listConfig  : {
                                            loadingText: '검색중...',
                                            emptyText  : '일치하는 항목 없음.',
                                            getInnerTpl: function () {
                                                return '<div>[{wh_code}] {wh_name}</div>';
                                            }
                                        },
                                        listeners   : {
                                            select: function (combo, record) {
                                                gm.me().selectedWhouseName = record.get('wh_name');
                                            }
                                        }
                                    },
                                    {
                                        fieldLabel  : '이동요청 날짜',
                                        xtype       : 'datefield',
                                        width       : 550,
                                        id          : gu.id('reserved_timestamp1'),
                                        name        : 'reserved_timestamp1',
                                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                        dateFormat  : 'Y-m-d',// 'Y-m-d H:i:s'
                                        fieldStyle  : 'background-color: #D6E8F6; background-image: none;',
                                        format      : 'Y-m-d',
                                        value       : new Date()
                                    }
                                ]
                            }
                        ]
                    },
                        {
                            xtype      : 'fieldset',
                            frame      : true,
                            width      : '100%',
                            height     : '100%',
                            layout     : 'fit',
                            bodyPadding: 10,
                            defaults   : {
                                margin: '2 2 2 2'
                            },
                            items      : [
                                {
                                    id    : gu.id('lblGridResult'),
                                    xtype : 'label',
                                    html  : '',
                                    result: false
                                }
                            ]
                        },
                        {
                            xtype      : 'fieldset',
                            frame      : true,
                            title      : '바코드 리스트',
                            width      : '100%',
                            height     : '100%',
                            layout     : 'fit',
                            bodyPadding: 10,
                            defaults   : {
                                margin: '2 2 2 2'
                            },
                            items      : [
                                barcodeGrid
                            ]
                        }
                    ]
                });

                let myWidth = 600;
                let myHeight = 620;

                let prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '바코드로 창고이동요청을 실행합니다.',
                    width  : myWidth,
                    height : myHeight,
                    plain  : true,
                    items  : form,
                    buttons: [{
                        text   : '출고 실행',
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
                            text   : CMD_CANCEL,
                            handler: function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }]
                });
                prWin.show();

                let recMain = gm.me().grid.getSelectionModel().getSelection()[0];
                let stodtlRec = gm.me().productDetailGrid.getSelectionModel().getSelection()[0];

                let srcahd_uid = recMain.get('uid_srcahd'); // 이동하려는 품목
                let comcst_uid = recMain.get('whouse_comcst_uid'); //SITE
                let stodtl_uid = stodtlRec.get('unique_id');

                barcodeStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                barcodeStore.getProxy().setExtraParam('stodtl_uid', stodtl_uid);
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

        this.createStore('Rfx2.model.company.bioprotech.ProductStock',
            [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                item_code_dash: 's.item_code',
                comment       : 's.comment1'
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

        buttonToolbar.insert(1, this.printBarcodeAction);
        buttonToolbar.insert(1, '-');
        // buttonToolbar.insert(1, this.releaseAction);
        buttonToolbar.insert(1, this.warehousingAction);

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.cancelStockAction = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-step_forward_14_0_5395c4_none',
            text    : gm.getMC('CMD_Goods_receipt_cancellation', '입고 취소'),
            tooltip : '입고 취소',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('cancelStockAction'),
            handler : function () {

                var rec = gm.me().productDetailGrid.getSelectionModel().getSelection()[0];
                console_logs('rec >>', rec);
                var nstock_uid = rec.get('nstock_uid');
                var cartmap_uid = rec.get('cartmap_uid');
                var stodtl_uid = rec.get('unique_id');
                var lot_no = rec.get('lot_no');

                var barcodeListStore = Ext.create('Rfx2.store.company.bioprotech.BarcodeListStore');
                barcodeListStore.getProxy().setExtraParam('stodtl_uid', stodtl_uid);
                barcodeListStore.getProxy().setExtraParam('lot_no', lot_no);
                barcodeListStore.load();

                var barcodeSelGrid = Ext.create('Ext.grid.Panel', {
                    store      : barcodeListStore,
                    cls        : 'rfx-panel',
                    id         : gu.id('productGrid'),
                    collapsible: false,
                    multiSelect: false,
                    width      : 100,
                    // overflowY: 'scroll',
                    margin    : '0 0 20 0',
                    autoHeight: true,
                    frame     : false,
                    border    : true,
                    // layout: 'fit',
                    forceFit: true,
                    columns : [
                        {
                            text     : '바코드 일련번호',
                            width    : '15%',
                            dataIndex: 'barcode',
                            style    : 'text-align:center',
                            sortable : true
                        },
                        // {
                        //     text     : '바코드종류',
                        //     width    : '10%',
                        //     dataIndex: 'prdbarcode_type',
                        //     style    : 'text-align:center',
                        //     sortable : true
                        // },
                        {
                            text     : '포장수량',
                            width    : '15%',
                            dataIndex: 'packing_quan',
                            style    : 'text-align:center',
                            sortable : true,
                            align    : 'right',
                            renderer : function (value, context, tmeta) {
                                if (context.field == 'packing_quan') {
                                    context.record.set('packing_quan', Ext.util.Format.number(value, '0,00/i'));
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            }
                        }
                    ],
                    selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                });

                var form = Ext.create('Ext.form.Panel', {
                    xtype        : 'form',
                    frame        : false,
                    border       : false,
                    bodyPadding  : 10,
                    region       : 'center',
                    layout       : 'form',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },
                    items        : [
                        {
                            xtype: 'fieldset',
                            title: '입고 취소 수량과 취소할 바코드를 선택하십시오.',
                            items: [
                                {
                                    xtype     : 'numberfield',
                                    id        : gu.id('cancel_quan'),
                                    name      : 'cancel_quan',
                                    fieldLabel: '취소수량',
                                    margin    : '0 5 0 0',
                                    anchor    : '97%',
                                    allowBlank: false,
                                    value     : 1,
                                    maxlength : '10',
                                },

                            ]
                        },
                        {
                            xtype: 'fieldset',
                            frame: true,
                            // overflowY: 'scroll',
                            title: '취소 바코드 선택',
                            // width: '100%',
                            // height: '100%',
                            layout: 'fit',
                            // bodyPadding: 10,
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items   : [
                                barcodeSelGrid
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal    : true,
                    title    : '입고 취소',
                    width    : 600,
                    height   : 600,
                    overflowY: 'scroll',
                    items    : form,
                    buttons  : [
                        {
                            text   : CMD_OK,
                            scope  : this,
                            handler: function () {
                                var val = form.getValues(false);
                                var barcodeSelection = barcodeSelGrid.getSelectionModel().getSelection();
                                var cancelBarcodeArr = [];
                                var cancelBarcodePacking = 0;
                                for (var i = 0; i < barcodeSelection.length; i++) {
                                    var rec = barcodeSelection[i];
                                    cancelBarcodeArr.push(rec.get('barcode'));
                                    cancelBarcodePacking = cancelBarcodePacking + Number(rec.get('packing_quan'));
                                }
                                var real_cancel_qty = Number((val['cancel_quan']).replace(/,/g, ""));
                                console_logs('>>>> cancelBarcodePacking', cancelBarcodePacking);
                                console_logs('>>>> real_cancel_qty', real_cancel_qty);

                                if (real_cancel_qty != cancelBarcodePacking) {
                                    Ext.MessageBox.alert('알림', ' 입고 취소수량과 바코드 포장수량과 일치하지 않습니다.');
                                    return;
                                } else {
                                    Ext.MessageBox.show({
                                        title  : '입고 취소',
                                        msg    : '선택 한 건을 입고 취소 하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        icon   : Ext.MessageBox.QUESTION,
                                        fn     : function (btn) {
                                            if (btn == "no") {
                                                return;
                                            } else {
                                                Ext.Ajax.request({
                                                    url    : CONTEXT_PATH + '/sales/productStock.do?method=cancelStock',
                                                    params : {
                                                        nstock_uid : nstock_uid,
                                                        cartmap_uid: cartmap_uid,
                                                        stodtl_uid : stodtl_uid,
                                                        cancel_quan: val['cancel_quan']
                                                    },
                                                    success: function (val, action) {
                                                        Ext.Ajax.request({
                                                            url    : CONTEXT_PATH + '/sales/productStock.do?method=stockBarcodeCancel',
                                                            params : {
                                                                cancelBarcodeArr: cancelBarcodeArr
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
                                                        gm.me().productDetailGrid.getStore().load();
                                                    },
                                                    failure: function (val, action) {

                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        },
                        {
                            text   : CMD_CANCEL,
                            scope  : this,
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


        this.productDetailStore = Ext.create('Rfx2.store.company.bioprotech.PStockOfProdStore');

        this.productDetailGrid = Ext.create('Ext.grid.Panel', {
            cls        : 'rfx-panel',
            id         : gu.id('productDetailGrid'),
            store      : this.productDetailStore,
            viewConfig : {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region     : 'center',
            autoScroll : true,
            autoHeight : true,
            flex       : 0.5,
            frame      : true,
            bbar       : Ext.create('Ext.PagingToolbar', {
                store      : this.productDetailStore,
                displayInfo: true,
                displayMsg : '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg   : "표시할 항목이 없습니다.",
                listeners  : {
                    beforechange: function (page, currentPage) {
                        this.getStore().getProxy().setExtraParam('start', (currentPage - 1) * 100);
                        this.getStore().getProxy().setExtraParam('page', currentPage);
                        this.getStore().getProxy().setExtraParam('limit', 100);
                    }
                }
            }),
            border     : true,
            layout     : 'fit',
            forceFit   : false,
            plugins    : {
                ptype       : 'cellediting',
                clicksToEdit: 1
            },
            selModel   : Ext.create("Ext.selection.CheckboxModel", {}),
            margin     : '0 0 0 0',
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                        this.cancelStockAction,
                        this.releaseAction,
                        this.addGoodsMoveAction,
                    ]
                }
            ],
            columns    : [
                {text: '수주번호', width: 100, style: 'text-align:center', dataIndex: 'orderNumber'},
                {text: '고객사', width: 100, style: 'text-align:center', dataIndex: 'wa_name'},
                {text: '생산로트번호', width: 85, style: 'text-align:center', dataIndex: 'lot_no'},
                {
                    text     : '생산수량',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'production_qty_sum',
                    align    : 'right',
                    renderer : function (value, context, tmeta) {
                        if (context.field == 'production_qty_sum') {
                            context.record.set('production_qty_sum', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text     : '현재재고',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'real_wh_qty',
                    align    : 'right',
                    renderer : function (value, context, tmeta) {
                        if (context.field == 'wh_qty') {
                            context.record.set('wh_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },

            ],
            title      : gm.getMC('CMD_Detailed_list', '상세 리스트'),
            name       : 'po',
            autoScroll : true,
            listeners  : {
                edit: function (editor, e, eOpts) {

                }
            }
        });

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
            items : [{
                //title: '제품 및 템플릿 선택',
                collapsible: false,
                frame      : false,
                region     : 'west',
                layout     : {
                    type : 'hbox',
                    pack : 'start',
                    align: 'stretch'
                },
                margin     : '5 0 0 0',
                width      : '65%',
                items      : [{
                    region: 'west',
                    layout: 'fit',
                    margin: '0 0 0 0',
                    width : '100%',
                    items : [this.grid]
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
                console_logs('>>> whouse_uid', whouseUid);
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

                    // this.releaseAction.enable();
                } else {
                    this.warehousingAction.disable();
                    // this.releaseAction.disable();
                }

            } else {

                this.warehousingAction.disable();
                this.releaseAction.disable();

                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().vSELECTED_PO_NO = '';
            }

        });

        this.productDetailGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                console_logs('>>>>>>> rec', selections);
                if (selections.length === 1) {
                    gm.me().releaseAction.enable();
                    gm.me().cancelStockAction.enable();
                    gm.me().addGoodsMoveAction.enable();
                    // gm.me().addPoPrdPlus.enable();
                    // gm.me().deletePrdAction.enable();
                } else {
                    gm.me().releaseAction.disable();
                    gm.me().cancelStockAction.disable();
                    gm.me().addGoodsMoveAction.disable();
                    // gm.me().addPoPrdPlus.disable();
                    // gm.me().deletePrdAction.disable();
                }
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

        this.store.getProxy().setExtraParam('existStock', 'true');

        this.store.load(function (records) {

        });

    },
    items          : [],
    productviewType: "ALL",
    potype         : 'PRD',
    records        : [],
    cnt            : 0,
    po_no_records  : [],


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
            id           : gu.id('formPanel'),
            xtype        : 'form',
            frame        : false,
            border       : false,
            bodyPadding  : '3 3 0',
            region       : 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget : 'side'
            },
            defaults     : {
                anchor    : '100%',
                labelWidth: 60,
                margins   : 10,
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


            store      : new Ext.data.Store(),
            cls        : 'rfx-panel',
            id         : gu.id('etc_grid'),
            collapsible: false,
            multiSelect: false,
            width      : 750,
            height     : 500,
            autoScroll : true,
            margin     : '0 0 20 0',
            autoHeight : true,
            frame      : false,
            border     : true,
            layout     : 'fit',
            forceFit   : true,

            columns: [
                {
                    id: gu.id('countVale'),

                    //text: item_code,
                    text: '포장수량 설정',

                    width    : '20%',
                    dataIndex: 'packing',
                    editor   : 'numberfield',
                    //value : this.value,

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
                    //text: '품명(' + item_name + ') 입고 수량 :' + gr_quan_arr,
                    text: '출력 매수',
                    //value : gu.id('countVale') * gr_quan_arr,
                    width    : '20%',
                    dataIndex: 'each',
                    //editor: 'textfield',
                    editor  : 'numberfield',
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
                    text : '출력 자재 총 수량  ',
                    width: '30%',

                    dataIndex: 'each',
                    editor   : 'numberfield',
                    sortable : false,

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


            selModel   : 'cellmodel',
            plugins    : {
                ptype: 'cellediting',
                //clicksToEdit: 2,
                clicksToEdit: 6,
            },
            listeners  : {

                click: function () {

                }
            },
            autoScroll : true,
            dockedItems: [


                Ext.create('widget.toolbar', {

                    plugins: {
                        boxreorderer: false
                    },
                    cls    : 'my-x-toolbar-default2',
                    margin : '0 0 0 0',
                    items  : [
                        '->',

                        {
                            xtype     : 'textfield',
                            name      : 'print_qty',
                            fieldLabel: '품명',
                            margin    : '0 7 0 7',
                            editable  : false,
                            width     : 200,
                            allowBlank: false,
                            value     : item_name,
                            maxlength : '1',
                        },

                        {
                            text     : '+',
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
                            text     : '-',
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
            modal : true,
            title : '자재 입고 바코드 출력  ',
            width : 770,
            height: 350,
            plain : true,
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

                                    lotrtgastUids     : uniqueIdArr,
                                    barcodes          : bararr,
                                    lot_no            : lot_no,
                                    cartmap_uid_list  : cartmap_uid_array,
                                    srcahd_uid_list   : srcahd_uid_array,
                                    item_code_uid_list: item_code_uid_array,
                                    item_name_uid_list: item_name_uid_array,
                                    //gr_quan_arr : gr_quan_list
                                    gr_quan_list : gr_quan_arr,
                                    pcs_desc_list: pcs_desc_arr,
                                    input_lot    : LotValue,
                                    //Boolean : Boolean,
                                    labelType: 'order',


                                    quanArray     : quanArray,
                                    printQuanArray: printQuanArray,
                                    lotArray      : lotArray
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
                    text   : '취소',
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


    doRelease: function () {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        var selection = gm.me().productDetailGrid.getSelectionModel().getSelection()[0];
        var form = Ext.create('Ext.form.Panel', {
            id           : gu.id('releaseForm'),
            xtype        : 'form',
            frame        : false,
            border       : false,
            bodyPadding  : '3 3 0',
            region       : 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget : 'side'
            },
            items        : [
                {
                    xtype: 'fieldset',
                    title: '입력사항',
                    items: [
                        {
                            fieldLabel  : '사유',
                            xtype       : 'combo',
                            anchor      : '100%',
                            name        : 'reason_text',
                            mode        : 'local',
                            store       : Ext.create('Rfx.store.GeneralCodeStore', {
                                hasNull   : false,
                                parentCode: 'RELEASE_CODE'
                            }),
                            displayField: 'codeName',
                            valueField  : 'systemCode',
                            emptyText   : '선택',
                            sortInfo    : {field: 'systemCode', direction: 'DESC'},
                            typeAhead   : false,
                            minChars    : 1,
                            listConfig  : {
                                loadingText: '검색중...',
                                emptyText  : '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div>[{systemCode}] {codeName}</div>';
                                }
                            },
                            listeners   : {
                                select: function (combo, record) {

                                }
                            }
                        },
                        {
                            xtype     : 'datefield',
                            anchor    : '100%',
                            fieldLabel: '일자',
                            name      : 'gr_date',
                            format    : 'Y-m-d',
                            allowBlank: false,
                            value     : ''
                        },
                        {
                            xtype     : 'textfield',
                            anchor    : '100%',
                            fieldLabel: '품번',
                            name      : 'item_code',
                            allowBlank: false,
                            editable  : false,
                            value     : rec.get('item_code')
                        },
                        {
                            xtype     : 'numberfield',
                            anchor    : '100%',
                            fieldLabel: '수량',
                            id        : gu.id('gr_quan'),
                            name      : 'gr_quan',
                            allowBlank: false,
                            value     : 0
                        },
                        {
                            xtype     : 'textfield',
                            anchor    : '100%',
                            fieldLabel: '비고',
                            name      : 'etc',
                            allowBlank: true,
                            value     : ''
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal    : true,
            title    : '임의출고',
            width    : 500,
            overflowY: 'scroll',
            height   : 300,
            plain    : true,
            items    : form,
            buttons  : [{
                text   : CMD_OK,
                handler: function (btn) {
                    var selection = gm.me().productDetailGrid.getSelectionModel().getSelection();
                    if (selection.length > 0) {
                        var rec = selection[0];
                        console_logs('>>>. rec', rec);
                        var main_rec = gm.me().grid.getSelectionModel().getSelection()[0];
                        var out_qty = gu.getCmp('gr_quan').getValue();
                        form.submit({
                            url    : CONTEXT_PATH + '/index/process.do?method=releaseProductDirectBarcodefifo',
                            params : {
                                srcahd_uid: main_rec.get('unique_id'),
                                stodtl_uid: rec.get('unique_id'),
                                gr_quan   : gu.getCmp('gr_quan').getValue()
                            },
                            success: function (val, action) {
                                prWin.close();
                                gm.me().store.load();
                                gm.me().productDetailStore.load();
                            },
                            failure: function (val, action) {
                                prWin.close();
                                gm.me().store.load();
                            }
                        });
                    }
                }
            }, {
                text   : CMD_CANCEL,
                handler: function (btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    },

    doWarehousing: function () {


        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        var whouseStore =  Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {});
        whouseStore.load();
        var ware_grid = Ext.create('Ext.grid.Panel', {
            store      : new Ext.data.Store(),
            cls        : 'rfx-panel',
            id         : gu.id('ware_grid'),
            collapsible: false,
            multiSelect: false,
            width      : 570,
            height     : 270,
            autoScroll : true,
            margin     : '0 0 0 0',
            autoHeight : true,
            frame      : false,
            border     : true,
            layout     : 'fit',
            forceFit   : true,

            columns: [
                {
                    id       : gu.id('box_packing'),
                    text     : 'BOX 포장수',
                    style    : 'text-align:center',
                    dataIndex: 'packing',
                    align    : 'right',
                    editor   : 'numberfield',
                    renderer : function (value) {
                        gm.me().vEachValueee = value;
                        boxPacking = gm.me().vEachValueee;
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    sortable : false
                },
                {
                    text     : 'BOX 수량',
                    id       : gu.id('box_qty'),
                    dataIndex: 'box_qty',
                    style    : 'text-align:center',
                    align    : 'right',
                    editor   : 'numberfield',
                    sortable : false,
                    renderer : function (value) {
                        printQuan = gm.me().vprintQuan;
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text     : '합계',
                    id       : gu.id('total_qty'),
                    dataIndex: 'total_qty',
                    align    : 'right',
                    style    : 'text-align:center',
                    // editor   : 'numberfield',
                    sortable : false,
                    renderer : function (value) {
                        printQuan = gm.me().vprintQuan;
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
            ],

            selModel   : 'cellmodel',
            plugins    : {
                ptype       : 'cellediting',
                clicksToEdit: 2,
            },
            listeners  : {
                edit: function (value, context, ditor, e, eOpts) {
                    var record = gu.getCmp('ware_grid').getSelectionModel().getSelected().items[0];
                    if (context.field === 'packing') {
                        var packing = Number(record.get('packing'));
                        var box_qty = Number(record.get('box_qty'));
                        var total_qty = packing * box_qty;
                        secondRecord = gu.getCmp('ware_grid').getStore().getAt(gu.getCmp('ware_grid').getStore().indexOf(record));
                        secondRecord.set('total_qty', total_qty);
                    }
                    if (context.field === 'box_qty') {
                        var packing = Number(record.get('packing'));
                        var box_qty = Number(record.get('box_qty'));
                        var total_qty = packing * box_qty;
                        secondRecord = gu.getCmp('ware_grid').getStore().getAt(gu.getCmp('ware_grid').getStore().indexOf(record));
                        secondRecord.set('total_qty', total_qty);
                    }

                    var remain_qty = 0;
                    var total_qty = 0;
                    var store = gu.getCmp('ware_grid').getStore();
                    var previous_store = store.data.items;
                    for (var i = 0; i < previous_store.length; i++) {
                        var recc = previous_store[i];
                        total_qty = total_qty + recc.get('total_qty');
                    }
                    console_logs('total_qty >>>>', total_qty);
                    remain_qty = gu.getCmp('gr_quan').getValue() - total_qty;

                    gu.getCmp('remain_disp').setHtml('잔여수량 : ' + gUtil.renderNumber(Number(remain_qty)));
                    remainQty = Number(remain_qty);
                },
            },
            autoScroll : true,
            dockedItems: [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls    : 'my-x-toolbar-default2',
                    margin : '0 0 0 0',
                    items  : [
                        {
                            xtype : 'label',
                            width : 200,
                            height: 20,
                            id    : gu.id('remain_disp'),
                            html  : '잔여수량 : 0',
                            style : 'color:red; align:left'
                        },
                        '->',
                        {
                            text     : '+',
                            listeners: [{
                                click: function () {
                                    var store = gu.getCmp('ware_grid').getStore();
                                    var gr_quan = gu.getCmp('gr_quan').getValue();
                                    var packing = rec.get('finance_rate');
                                    if (gr_quan > 0) {
                                        var getCount = store.getCount();
                                        console_logs('item index >> ', getCount);

                                        var total_qty_calc = 0.0;

                                        for (var j = 0; j < store.data.items.length; j++) {
                                            var item = store.data.items[j];
                                            total_qty_calc = total_qty_calc + item.get('total_qty');
                                        }

                                        var total = gr_quan - total_qty_calc;
                                        var box_qty = Math.floor(total / packing);
                                        if (box_qty === Infinity) {
                                            box_qty = 1.0;
                                        }
                                        console_logs('1. packing', packing);
                                        console_logs('2. box_qty', box_qty);
                                        console_logs('2. total', total);
                                        if (packing > total || packing === 0.0) {
                                            packing = total * Math.round(box_qty);
                                        }

                                        if (getCount == 0) {
                                            total = packing * box_qty;
                                        }

                                        store.insert(store.getCount(), new Ext.data.Record({
                                            'packing'  : packing,
                                            'box_qty'  : box_qty,
                                            'total_qty': total
                                        }));

                                        var total_qty_final = 0.0;
                                        for (var j = 0; j < store.data.items.length; j++) {
                                            var item = store.data.items[j];
                                            total_qty_final = total_qty_calc + item.get('total_qty');
                                        }

                                        remainQty = Number(gu.getCmp('gr_quan').getValue() - total_qty_final);
                                        console_logs('>>>>> REMAIN', remainQty);
                                        gu.getCmp('remain_disp').setHtml('잔여수량 : ' + gUtil.renderNumber(Number((remainQty))));

                                    } else {
                                        Ext.MessageBox.alert('알림', '입고수량을 입력하세요');
                                        return;
                                    }
                                }
                            }]
                        },
                        {
                            text     : '-',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('ware_grid').getSelectionModel().getSelected().items[0];
                                    var store = gu.getCmp('ware_grid').getStore();
                                    if (record == null) {
                                        gu.getCmp('ware_grid').getStore().remove(store.last());
                                    } else {
                                        gu.getCmp('ware_grid').getStore().removeAt(gu.getCmp('ware_grid').getStore().indexOf(record));
                                    }
                                }
                            }]
                        },


                    ]
                }),

                //여기부터
                Ext.create('Ext.form.Panel', {
                    xtype        : 'form',
                    frame        : false,
                    border       : false,
                    bodyPadding  : 0,
                    region       : 'center',
                    layout       : 'form',
                    autoScroll   : true,
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },

                }),
            ]
        });
        var store = gu.getCmp('ware_grid').getStore();
        var form = Ext.create('Ext.form.Panel', {
            id           : gu.id('warehousingForm'),
            xtype        : 'form',
            frame        : false,
            border       : false,
            bodyPadding  : '3 3 0',
            region       : 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget : 'side'
            },
            items        : [
                {
                    xtype: 'fieldset',
                    title: '기본정보 입력',
                    items: [
                        {
                            fieldLabel  : '사유',
                            xtype       : 'combo',
                            anchor      : '100%',
                            name        : 'reason_text',
                            mode        : 'local',
                            store       : Ext.create('Rfx.store.GeneralCodeStore', {
                                hasNull   : false,
                                parentCode: 'WAREHOUSING_CODE'
                            }),
                            displayField: 'codeName',
                            valueField  : 'systemCode',
                            emptyText   : '사유를 선택하십시오.',
                            sortInfo    : {field: 'systemCode', direction: 'DESC'},
                            typeAhead   : false,
                            minChars    : 1,
                            listConfig  : {
                                loadingText: '검색중...',
                                emptyText  : '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div>[{systemCode}] {codeName}</div>';
                                }
                            },
                            listeners   : {
                                select: function (combo, record) {

                                }
                            }
                        },
                        {
                            xtype     : 'datefield',
                            anchor    : '100%',
                            fieldLabel: '일자',
                            name      : 'gr_date',
                            format    : 'Y-m-d',
                            allowBlank: false,
                            value     : ''
                        },
                        {
                            xtype     : 'textfield',
                            anchor    : '100%',
                            fieldLabel: '품번',
                            name      : 'item_code',
                            allowBlank: false,
                            editable  : false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value     : rec.get('item_code')
                        },
                        {
                            xtype     : 'numberfield',
                            anchor    : '100%',
                            fieldLabel: '수량',
                            id        : gu.id('gr_quan'),
                            name      : 'gr_quan',
                            allowBlank: false,
                            value     : 0
                        },
                        {
                            xtype     : 'textfield',
                            anchor    : '100%',
                            fieldLabel: '비고',
                            name      : 'etc',
                            allowBlank: true,
                            value     : ''
                        },
                        {
                            fieldLabel  : '창고지정',
                            xtype       : 'combo',
                            id          : gu.id('whouse_uid'),
                            anchor      : '100%',
                            name        : 'whouse_uid',
                            mode        : 'local',
                            store       : whouseStore,
                            displayField: 'wh_name',
                            value : rec.get('whouse_uid'),
                            valueField  : 'unique_id_long',
                            emptyText   : '선택',
                            sortInfo    : {field: 'systemCode', direction: 'DESC'},
                            typeAhead   : false,
                            minChars    : 1,
                            listConfig  : {
                                loadingText: '검색중...',
                                emptyText  : '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div>[{wh_code}] {wh_name}</div>';
                                }
                            },
                        },
                        // {
                        //     xtype     : 'datefield',
                        //     name      : 'in_date',
                        //     anchor      : '100%',
                        //     id        : gu.id('in_date'),
                        //     fieldLabel: '입고일자',
                        //     allowBlank: false,
                        //     format : 'Y-m-d',
                        //     value : new Date()
                        // },
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '생산 LOT 정보 입력',
                    items: [
                        {
                            fieldLabel  : '생산지',
                            xtype       : 'combo',
                            anchor      : '100%',
                            name        : 'product_site',
                            mode        : 'local',
                            store       : Ext.create('Rfx.store.GeneralCodeStore', {
                                hasNull   : false,
                                parentCode: 'PROUDCT_SITE'
                            }),
                            displayField: 'codeName',
                            valueField  : 'systemCode',
                            emptyText   : '생산지를 선택하십시오.',
                            sortInfo    : {field: 'systemCode', direction: 'DESC'},
                            typeAhead   : false,
                            allowBlank  : false,
                            minChars    : 1,
                            listConfig  : {
                                loadingText: '검색중...',
                                emptyText  : '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div>{codeName}</div>';
                                }
                            },
                            listeners   : {
                                select: function (combo, record) {

                                }
                            }
                        },
                        {
                            xtype     : 'textfield',
                            anchor    : '100%',
                            id        : gu.id('lotNo'),
                            fieldLabel: 'LOT NO',
                            name      : 'lotNo',
                            allowBlank: false,
                            value     : '',
                            editable  : true,
                            emptyText : 'ex) HCE0FAZC > OFAZC로 입력'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'BOX포장수, BOX수량을 조정하여 제품바코드를 생성합니다.<br>입고 수량을 입력 후 해당 값을 조정하시기 바랍니다.',
                    items: [
                        ware_grid
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal  : true,
            title  : gm.getMC('CMD_Wearing', '입고'),
            width  : 600,
            height : 700,
            plain  : true,
            items  : form,
            buttons: [{
                text   : CMD_OK,
                handler: function (btn) {
                    var packingArr = [];
                    var boxqtyArr = [];
                    var totalqtyArr = [];

                    var selection = gm.me().grid.getSelectionModel().getSelection();
                    var lotNo = gu.getCmp('lotNo').getValue();
                    if (lotNo.length === 0) {
                        Ext.MessageBox.alert('알림', 'LOT No 를 입력해 주십시오.');
                        return;
                    } else {
                        if (lotNo.length < 5) {
                            Ext.MessageBox.alert('알림', 'LOT번호 형식이 일치하지 않습니다.');
                            return;
                        }
                    }
                    if (selection.length > 0) {
                        var storeData = gu.getCmp('ware_grid').getStore();
                        var rec = selection[0];
                        console_logs('>>>>>>>> ', gm.me().store.getProxy().getExtraParams()['whouse_uid']);
                        var whouse_uid = gu.getCmp('whouse_uid').getValue();
                        // let indate = gu.getCmp('in_date').getValue();
                        // var whouse_uid = gm.me().store.getProxy().getExtraParams()['whouse_uid'];
                        // if (whouse_uid === null) {
                        //     whouse_uid = 11030245000001;
                        // }
                        console_logs('>>>>>>>> whouse_uid ', whouse_uid);
                        var jsonData = '';
                        var length = storeData.data.items.length;
                        if (length > 0) {
                            var objs = [];
                            var columns = [];
                            var obj = {};
                            for (var j = 0; j < storeData.data.items.length; j++) {
                                var item = storeData.data.items[j];
                                var objv = {};
                                objv['packing'] = item.get('packing');
                                objv['box_qty'] = item.get('box_qty');
                                objv['total_qty'] = item.get('total_qty');
                                columns.push(objv);

                                packingArr.push(item.get('packing'));
                                boxqtyArr.push(item.get('box_qty'));
                                totalqtyArr.push(item.get('total_qty'));
                            }
                            obj['datas'] = columns;
                            objs.push(obj);
                            jsonData = Ext.util.JSON.encode(objs);
                        }

                        // 입고대상의 품목이 아닌 LOT가 중복되는 것이 있는지 점검.
                        Ext.Ajax.request({
                            url    : CONTEXT_PATH + '/index/process.do?method=checkingDuplicateLotNo',
                            params : {
                                srcahd_uid: rec.get('unique_id_long'),
                                lot_no    : gu.getCmp('lotNo').getValue()
                            },
                            success: function (result, request) {
                                var result = result.responseText;
                                if (result === 'OK') {
                                    form.submit({
                                        submitEmptyText: false,
                                        waitMsg        : '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                        url            : CONTEXT_PATH + '/index/process.do?method=makeProjectToWarehouse',
                                        params         : {
                                            srcahd_uid: rec.get('unique_id_long'),
                                            whouse_uid: whouse_uid,
                                            jsonData  : jsonData
                                        },
                                        success        : function (val, action) {
                                            prWin.close();
                                            gm.me().store.load();
                                            gm.me().productDetailStore.load();
                                        },
                                        failure        : function (val, action) {
                                            prWin.close();
                                            gm.me().store.load();
                                            gm.me().productDetailStore.load();
                                            Ext.MessageBox.alert('알림', '입고 프로세스를 실시했으나 실패했습니다.')
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림', '동일한 LOT No가 다른 품목에 이미 있습니다.');
                                }
                            },
                            failure: function (val, action) {
                                Ext.MessageBox.alert('알림', '임의 입고요청을 하였으나 실패하였습니다.');
                            }
                        });
                    }
                }
            }, {
                text   : CMD_CANCEL,
                handler: function (btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    },

    searchStore: Ext.create('Mplm.store.MaterialSearchStore', {}),

    projectStore: Ext.create('Mplm.store.ProjectStore', {})
});
