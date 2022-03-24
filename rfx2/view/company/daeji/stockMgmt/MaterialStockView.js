//생산완료 현황
Ext.define('Rfx2.view.company.daeji.stockMgmt.MaterialStockView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-pending-view',
    inputBuyer: null,
    preValue: 0,
    selectedWhouseName: null,
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

        this.addSearchField({
            type: 'checkbox',
            field_id: 'existStock',
            items: [
                {
                    boxLabel: gm.getMC('CMD_Only_items_in_stock', '재고 있는 품목만'),
                    checked: true
                },
            ],
        });

        var buttonToolbar3 = Ext.create('widget.toolbar', {
            style: 'background-color: transparent;',
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                id: gu.id('total_price'),
                style: 'color: #000000; font-weight: bold; font-size: 15px; margin: 5px;',
                text: '소모를 실행할 건을 선택하세요.'
            }]
        });

        this.addSearchField({
            type: 'checkbox',
            field_id: 'noExistStock',
            items: [
                {
                    boxLabel: '재고 없는 품목만',
                    checked: false
                },
            ],
        });
        if (this.flag1 === 'Y') {
            this.addSearchField('item_code');
            this.addSearchField('item_name');
        } else {
            this.addSearchField({
                field_id: 'whouse_uid'
                , emptyText: '창고명'
                , width: 200
                , store: "Rfx2.store.company.bioprotech.WarehouseStore"
                , displayField: 'wh_name'
                , valueField: 'unique_id'
                //, defaultValue: '11030245000001'
                , autoLoad: true
                , innerTpl: '<div data-qtip="{unique_id}">{wh_name}</div>'
            });
            /*
                    this.addSearchField({
                        field_id: 'sp_code'
                        , store: 'CommonCodeStore'
                        , displayField: 'codeName'
                        , valueField: 'systemCode'
                        , params: { parentCode: 'MTRL_FLAG_PMS1', hasNull: true }
                        , innerTpl: '<div data-qtip="{system_code}">{codeName}</div>'
                    });
            */
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

            this.addCallback('CHECK_SP_CODE', function (combo, record) {

                gm.me().refreshStandard_flag(record);

            });

        }

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

        this.createPoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
            text: gm.getMC('CMD_Out_cart_in', '불출카트 담기'),
            tooltip: '불출요청용 카트 담기',
            disabled: true,
            handler: function (widget, event) {
                var srcahd_uids = new Array();
                var stoqty_uids = new Array();
                var item_codes = new Array();
                var selections = gm.me().grid.getSelectionModel().getSelection();
                console_logs('selections', selections);
                //				    if (selections) {
                var arrExist = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var stoqty_uid = rec.get('unique_id_long');
                    var srcahd_uid = rec.get('uid_srcahd');
                    var item_name = rec.get('item_name');
                    var item_code = rec.get('item_code');
                    var delete_flag = rec.get('delete_flag');
                    console_logs('delete_flag----------------', delete_flag);
                    arrExist.push(srcahd_uid);
                    console_logs('stoqty_uid----------------', stoqty_uid);
                    console_logs('isExistMyCart 전----------------');
                    var bEx = gm.me().isExistMyCart(stoqty_uid);
                    console_logs('isExistMyCart 후----------------');
                    console_logs('bEx----------------결과', bEx);
                    if (bEx == 'false') {
                        console_logs('stoqty_uid----------------false안', stoqty_uid);
                        srcahd_uids.push(srcahd_uid);
                        stoqty_uids.push(stoqty_uid);
                        item_codes.push(item_code);
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/purchase/request.do?method=addMyCartGo',
                            params: {
                                srcahd_uids: srcahd_uids,
                                item_codes: item_codes,
                                stoqty_uids: stoqty_uids,
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

        this.warehouseStore.load();

        this.addGoodsMoveAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: '창고이동요청',
            tooltip: '자재의 창고를 이동 요청합니다',
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
                                xtype: 'hiddenfield',
                                id: gu.id('uid_srcahd'),
                                name: 'uid_srcahd',
                                hidden: true,
                                value: rec.get('uid_srcahd')
                            },
                            {
                                xtype: 'hiddenfield',
                                id: gu.id('unique_id_long'),
                                name: 'unique_id_long',
                                hidden: true,
                                value: rec.get('unique_id_long')
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
                            }, {
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'specification',
                                value: rec.get('specification'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
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
                                fieldLabel: '요청수량',
                                xtype: 'numberfield',
                                minValue: 0,
                                width: 100,
                                id: gu.id('wh_qty'),
                                name: 'wh_qty',
                                allowBlank: true,
                                value: '1',
                                margins: '5'
                            }, {
                                fieldLabel: '현재창고',
                                xtype: 'textfield',
                                id: gu.id('wh_name'),
                                name: 'wh_name',
                                value: rec.get('wh_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
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
                            }
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
                                    console_logs('form val', val);

                                    if (val['wh_name'] === gm.me().selectedWhouseName) {
                                        Ext.Msg.alert('경고', '창고가 동일하여 요청할 수 없습니다.');
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
        });

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
                                fieldLabel: '창고',
                                xtype: 'combo',
                                anchor: '100%',
                                id: gu.id('wh_code'),
                                name: 'whouse_uid',
                                store: Ext.create('Mplm.store.WareHouseStore'),
                                displayField: 'wh_name',
                                valueField: 'unique_id',
                                emptyText: '선택',
                                allowBlank: false,
                                value: '100',
                                //sortInfo: {field: 'wh_code', direction: 'ASC'},
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
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                hidden: true,
                                value: rec.get('unique_id'),
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
                            }, {
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'item_name',
                                value: rec.get('specification'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
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
                                fieldLabel: '입고수량',
                                xtype: 'textfield',
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

                    var combo = gu.getCmp('wh_code');
                    combo.store.load(
                        function () {
                            this.each(function (record) {
                                var wh_code = record.get('wh_code');
                                if (wh_code == '100') {
                                    combo.select(record);
                                }
                            });
                        }
                    );
                    var winPart = Ext.create('ModalWindow', {
                        title: '자재 입고',
                        width: 500,
                        height: 300,
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
        this.addGoodOutAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: gm.getMC('CMD_Release', '출고'),
            tooltip: '자재를 임의로 불출합니다',
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
                                id: gu.id('unique_id_out'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                hidden: true,
                                value: rec.get('unique_id'),
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
                                fieldLabel: '수량',
                                xtype: 'textfield',
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
        this.createStore('Rfx2.model.company.hanjung.ContractMaterial', [{
                property: 'unique_id',
                direction: 'DESC'
            }], gm.pageSize
            , {},
            ['srcahd']
        );
        // this.createStore('Rfx2.model.company.bioprotech.StoqtyLine', [{
        //         property: 'item_code',
        //         direction: 'ASC'
        //     }],
        //     gm.pageSize
        //     , {
        //         creator: 'a.creator',
        //         unique_id: 'a.unique_id'
        //     }
        //     , ['srcahd']
        // );

        var arr = [];
        // buttonToolbar.insert(1, this.addGoodsMoveAction);
        buttonToolbar.insert(1, this.addGoodOutAction);
        buttonToolbar.insert(1, this.addGoodsinAction);
        // buttonToolbar.insert(1, this.printBarcodeAction);
        // buttonToolbar.insert(1, this.createPoAction);
        //buttonToolbar.insert(1, '-');

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
                {text: '일자', width: 100, style: 'text-align:center', dataIndex: 'pl_no', sortable: false},
                {
                    text: this.getMC('msg_order_grid_prd_fam', '구분'),
                    width: 65,
                    style: 'text-align:center',
                    dataIndex: 'class_code',
                    sortable: false
                },
                {
                    text: this.getMC('msg_order_grid_prd_name', '계획번호'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'item_name',
                    sortable: false
                },
                {
                    text: this.getMC('msg_order_grid_prd_desc', '소요/입고량'),
                    width: 95,
                    style: 'text-align:center',
                    dataIndex: 'description',
                    sortable: false
                },
                {
                    text: '가용수량', width: 95, style: 'text-align:center', dataIndex: 'ap_Wquan', align: 'right',
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

        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {

                } else {

                }
            }
        });

        this.setRowClass(function (record, index) {
            console_logs('record>>>', record);
            var stock_qty = record.get('stock_qty');
            var stock_qty_safe = record.get('stock_qty_safe');
            if (stock_qty > 0 && stock_qty <= stock_qty_safe) {
                return 'red-row';
            }
        });

        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        // Ext.apply(this, {
        //     layout: 'border',
        //     items: [
        //         {
        //             collapsible: false,
        //             frame: false,
        //             region: 'west',
        //             layout: {
        //                 type: 'hbox',
        //                 pack: 'start',
        //                 align: 'stretch'
        //             },
        //             margin: '5 0 0 0',
        //             width: '65%',
        //             items: [{
        //                 region: 'west',
        //                 layout: 'fit',
        //                 margin: '0 0 0 0',
        //                 width: '100%',
        //                 items: [this.grid]
        //             }]
        //         }, this.gridContractCompany
        //     ]
        // });
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        //버튼 추가.

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                rec = selections[0];
                console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>', rec.get('request_comment'));
                gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
                gm.me().vSELECTED_STOCK_UID = rec.get('stoqty_uid');
                gm.me().createPoAction.enable();
                gm.me().addGoodsinAction.enable();
                gm.me().addGoodOutAction.enable();
                gm.me().printBarcodeAction.enable();
                gm.me().addGoodsMoveAction.enable();
                // 여기서 소요량 정보 Store Load
                //this.cartLineGrid.getStore().getProxy().setExtraParam('item_code', rec.get('item_code'));
                //this.cartLineGrid.getStore().getProxy().setExtraParam('is_combined', 'N');
                //this.cartLineGrid.getStore().load();
            } else {
                gm.me().createPoAction.disable();
                gm.me().printBarcodeAction.disable();
                gm.me().addGoodsinAction.disable();
                gm.me().addGoodOutAction.disable();
                gm.me().addGoodsMoveAction.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('existStock', 'true');
        this.store.getProxy().setExtraParam('having_not_status', 'BM,P0,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('multi_prd', true);
        this.store.getProxy().setExtraParam('not_standard_flag', 'A');
        this.store.load(function (records) {
        });
    },


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
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
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

    prbarcodeopen: function (form) {
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
            title: '바코드 출력 매수',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var selections = gm.me().grid.getSelectionModel().getSelection();

                    var uniqueIdArr = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('uid_srcahd');  //Material unique_id
                        uniqueIdArr.push(uid);
                    }

                    var form = gu.getCmp('formPanel').getForm();

                    form.submit({
                        //바이오 카툰박스
                        //url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeSrcahd',
                        //바이오 카툰박스
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBioT',

                        params: {
                            unique_ids: uniqueIdArr,
                            labelType: 'carton'

                        },
                        success: function (val, action) {
                            prWin.close();
                            gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                            gm.me().store.load(function () {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
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

    addTabCartLineGridPanel: function (title, menuCode, arg, fc, id) {

        gm.extFieldColumnStore.load({
            params: {menuCode: menuCode},
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                //		    	 setEditPanelTitle();
                if (success == true) {
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
        var gridId = id == null ? this.getGridId() : id;

        var o = gm.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];

        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});
        this.cartLineStore = Ext.create('Rfx.store.StockMtrlStore');
        //this.cartLineStore.getProxy().setExtraParam('rtgastuid', gm.me().vSELECTED_UNIQUE_ID);

        var ClaastStore = Ext.create('Mplm.store.ClaastStore', {});
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
            //forceFit: true,
            dockedItems: dockedItems,
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
                        anchor: '-5',
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
                                    '<font color=#999><small>{unique_id}</small></font> <font color=#333>{class_code}</font><br />' +
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
                                success: function (result, request) {
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

                            var cartLineGrid_t = gm.me().cartLineGrid.getStore().data.items;
                            var is_duplicated = false;
                            var selected_stock_pos = gu.getCmp('stock_pos').getValue();
                            var selectionModel = gm.me().cartLineGrid.getSelectionModel().getSelection()[0];

                            if (selected_stock_pos == selectionModel.get('stock_pos')) {
                                is_duplicated = true;
                            } else {
                                for (var i = 0; i < cartLineGrid_t.length; i++) {
                                    if (selected_stock_pos == cartLineGrid_t[i].data.stock_pos) {
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
                        text: gm.getMC('CMD_DELETE', '삭제'),
                        iconCls: 'af-remove',
                        style: 'margin-left: 3px;',
                        handler: function () {
                            var stoqty_uids = [];

                            if (gm.me().selected_rec != null && gm.me().selected_rec.length > 0) {
                                for (var i = 0; i < gm.me().selected_rec.length; i++) {
                                    stoqty_uids.push(gm.me().selected_rec[i].data.id);
                                }
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                                    params: {
                                        DELETE_CLASS: 'stoqty',
                                        uids: stoqty_uids
                                    },
                                    success: function (result, request) {
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
                itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                    gm.me().downListRecord(record);
                }, //endof itemdblclick
                cellkeydown: function (cartLineGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {

                    }


                }
            },//endof listeners
            columns: columns
        });
        this.cartLineGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gm.me().selected_rec = selections;
            }
        });
        var view = this.cartLineGrid.getView();

        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function (e) {
                var selectionModel = this.cartLineGrid.getSelectionModel();
                var select = 0; // select first if no record is selected
                if (selectionModel.hasSelection()) {
                    select = this.cartLineGrid.getSelectionModel().getSelection()[0].index + 1;
                }
                view.select(select);

            },
            up: function (e) {
                var selectionModel = this.cartLineGrid.getSelectionModel();
                var select = this.cartLineGrid.store.totalCount - 1; // select last element if no record is selected
                if (selectionModel.hasSelection()) {
                    select = this.cartLineGrid.getSelectionModel().getSelection()[0].index - 1;
                }
                view.select(select);

            }
        });

        var tabPanel = Ext.getCmp(gm.geTabPanelId());

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
                handler: function (btn) {
                    var form = gu.getCmp('formPanel').getForm();
                    var result_length = gm.me().store.data.length;
                    var val = form.getValues(false);
                    if (result_length > 0) {
                        var rec = gm.me().grid.getSelectionModel().getSelection();
                        var srcahd_uids = [];

                        for (var i = 0; i < rec.length; i++) {
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
    selCheckOnly: true,
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
                            whouse_uid: val['whouse_uid']
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
                            unique_id: val['unique_id'],
                            barcode: val['unique_id'],
                            stock_pos: val['stock_pos'],
                            innout_desc: val['innout_desc'],
                            wh_qty: val['wh_qty'] * (-1),
                            whouse_uid: val['whouse_uid']
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

                    winPart.setLoading(true);

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/inventory/prchStock.do?method=requestMoveQty',
                        params: {
                            stoqty_uid: val['unique_id_long'],
                            //srcahd_uid: val['uid_srcahd'],
                            request_qty: val['wh_qty'],
                            whouse_uid: val['whouse_uid']
                        },

                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().getStore().load(function () {
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
