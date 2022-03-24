Ext.define('Rfx2.view.company.sejun.designPlan.RequireStockOutView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'inspect-category-def-view',



    counsumeRateMtrl: Ext.create('Rfx2.store.company.sejun.PartLineNpStore', {
        sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
    }),

    consumeRateAssy: Ext.create('Rfx2.model.company.sejun.ProduceWorkDefect', {
        sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
    }),

    storeCubeDim: Ext.create('Rfx2.store.company.sejun.PartLineAssignMaterialStore', {}),
    isYnStore: Ext.create('Mplm.store.YnFlagStore', {}),
    // storeViewProp: Ext.create('Rfx2.store.company.bioprotech.MaterialPurchaseRateStore', {}),

    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var arr = [];

        arr.push(buttonToolbar);
        arr.push(searchToolbar);


        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: '검색',
            disabled: false,
            handler: function (widget, event) {

            }
        });

        this.expDateAssign = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            itemId: 'expDateAssign',
            text: '일부인 지정',
            disabled: true,
            handler: function (widget, event) {
                var selections = gm.me().gridDimension.getSelectionModel().getSelected().items[0];
                var reserved4 = selections.get('reserved4');
                if (reserved4 === 'Y') {
                    Ext.MessageBox.alert('알림', '이미 자재 할당처리가 된 건입니다.');
                    return;
                } else {
                    gm.me().makePalletEl();
                }
            }
        });

        this.requestProduceAssy = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            itemId: 'requestProduceAssy',
            text: '자재소모',
            disabled: true,
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: '자재소모',
                    msg: '입력한 실 사용수량에 따라 자재 소모를 실시합니다.<br><b>실 사용수량이 0이 입력된 항목에 대하여는 소모가 처리되지 않습니다.</b>',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            gMain.setCenterLoading(true);
                            var record = gm.me().oneGrid.getSelectionModel().getSelection()[0];
                            console_logs('>>> record', record)
                            console_logs('>>>>', record.get('unique_id_long'));
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/material.do?method=decraseStockMaterialByAssignList',
                                params: {
                                    prdplan_uid: record.get('pr_uid')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    gMain.setCenterLoading(false);
                                    Ext.MessageBox.alert('알림', '처리 되었습니다.');
                                    gm.me().storeCubeDim.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION,
                });
            }
        });

        // 소모가 되지 않는 상태에서 실제 할당을 취소한다.
        this.backAssignAction = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            itemId: 'backProduceAssy',
            text: '배분취소',
            disabled: true,
            handler: function (widget, event) {
                var selections = gm.me().gridDimension.getSelectionModel().getSelected().items[0];
                var alloc_use_yn = selections.get('alloc_use_yn');
                if (alloc_use_yn !== 'Y') {
                    Ext.MessageBox.show({
                        title: '배분취소',
                        msg: '해당 일부인의 배분을 취소합니다.',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (btn) {
                            if (btn == 'yes') {
                                gMain.setCenterLoading(true);
                                var record = gm.me().gridDimension.getSelectionModel().getSelected().items[0];
                                console_logs('>>> record', record)
                                console_logs('>>>>', record.get('unique_id_long'));
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/material.do?method=rejectMaterialAssign',
                                    params: {
                                        stomov_uid: record.get('unique_id_long')
                                    },
                                    success: function (result, request) {
                                        var resultText = result.responseText;
                                        gMain.setCenterLoading(false);
                                        Ext.MessageBox.alert('알림', '처리 되었습니다.');
                                        gm.me().storeCubeDim.load();
                                    },
                                    failure: extjsUtil.failureMessage
                                });

                            }
                        },
                        icon: Ext.MessageBox.QUESTION,
                    });
                } else {
                    Ext.MessageBox.alert('알림', '이미 소모처리가 완료된 건 입니다.')
                }

            }
        });

        // 전체 출고기능
        this.cancelOutAll = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            itemId: 'cancelOutMaterial',
            text: '전체 출고취소',
            disabled: true,
            handler: function (widget, event) {
                var record = gm.me().oneGrid.getSelectionModel().getSelection()[0];
                Ext.MessageBox.show({
                    title: '출고취소',
                    msg: '출고된 전체 반제품/자재의 소모처리를 해제와 재고수량을 원복처리 합니다.<br><b>이미 소모처리가 되었거나 소모처리가 진행되지 않는 건은 처리되지 않습니다.</b><br>계속 진행하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            gMain.setCenterLoading(true);
                            var record = gm.me().oneGrid.getSelectionModel().getSelection()[0];
                            console_logs('>>> record', record)
                            console_logs('>>>>', record.get('pr_uid'));
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/material.do?method=cancelOutMaterial',
                                params: {
                                    prdplan_uid: record.get('pr_uid')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    gMain.setCenterLoading(false);
                                    Ext.MessageBox.alert('알림', '처리 되었습니다.');
                                    gm.me().storeCubeDim.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION,
                });
            }
        });

        // 소모가 된 상태에서 실제 사용되지 않은 자재에 대한
        // 자재 수량 원복처리 기능
        this.returnMaterial = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            itemId: 'returnMaterialAction',
            text: '반납처리',
            disabled: true,
            handler: function (widget, event) {
                var selections = gm.me().gridDimension.getSelectionModel().getSelected().items[0];
                var alloc_use_yn = selections.get('alloc_use_yn');
                if (alloc_use_yn == 'Y') {
                    var form = Ext.create('Ext.form.Panel', {
                        id: 'editPoForm',
                        xtype: 'form',
                        frame: false,
                        border: false,
                        width: '100%',
                        layout: 'column',
                        bodyPadding: 10,
                        items: [
                            {
                                xtype: 'fieldset',
                                collapsible: false,
                                title: '선택한 자재/반제품에 대한 반납수량을 입력해주세요.',
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
                                                id: gu.id('final_buyer'),
                                                name: 'return_qty',
                                                fieldLabel: '반납수량',
                                                id : gu.id('return_qty'),
                                                allowBlank: false,
                                                xtype: 'numberfield',
                                                width: '95%',
                                                padding: '0 0 5px 20px',
                                            },
                                        ]
                                    },
    
                                ]
                            },
                        ]
                    });
    
                    var win = Ext.create('Ext.Window', {
                        modal: true,
                        title: '반납처리',
                        width: 500,
                        height: 200,
                        plain: true,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function (btn) {
                                if (btn == "no") {
                                    win.close();
                                } else {
                                    var form = Ext.getCmp('editPoForm').getForm();
                                    if (form.isValid()) {
                                        var return_qty = gu.getCmp('return_qty').getValue();
                                        var alloc_use_qty = selections.get('alloc_use_qty');
                                        console_logs('>>>>>> alloc_use_qty', alloc_use_qty);
                                        console_logs('>>>>>> return_qty', return_qty);
                                        if(return_qty < alloc_use_qty) {
                                            win.setLoading(true);
                                            var val = form.getValues(false);
                                            form.submit({
                                                url: CONTEXT_PATH + '/purchase/material.do?method=returnMaterial',
                                                params: {
                                                    stomov_uid: selections.get('unique_id_long')
                                                },
                                                success: function (val, action) {
                                                    gm.me().storeCubeDim.load();
                                                    Ext.MessageBox.alert('알림','반품처리가 완료되었습니다.');
                                                    win.setLoading(false);
                                                    win.close();
                                                },
                                                failure: function () {
                                                    win.setLoading(false);
                                                    extjsUtil.failureMessage();
                                                }
                                            });
                                        } else {
                                            Ext.MessageBox.alert('알림','반납수량은 실 사용수량보다 클 수 없습니다.');
                                            return;
                                        }
                                        
    
                                    } else {
                                        Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
                                    }
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function (btn) {
                                win.close();
                            }
                        }]
                    });
                    win.show();
                    // Ext.MessageBox.show({
                    //     title: '배분취소',
                    //     msg: '해당 일부인의 배분을 취소합니다.',
                    //     buttons: Ext.MessageBox.YESNO,
                    //     fn: function (btn) {
                    //         if (btn == 'yes') {
                    //             gMain.setCenterLoading(true);
                    //             var record = gm.me().gridDimension.getSelectionModel().getSelected().items[0];
                    //             console_logs('>>> record', record)
                    //             console_logs('>>>>', record.get('unique_id_long'));
                    //             Ext.Ajax.request({
                    //                 url: CONTEXT_PATH + '/purchase/material.do?method=rejectMaterialAssign',
                    //                 params: {
                    //                     stomov_uid: record.get('unique_id_long')
                    //                 },
                    //                 success: function (result, request) {
                    //                     var resultText = result.responseText;
                    //                     gMain.setCenterLoading(false);
                    //                     Ext.MessageBox.alert('알림', '처리 되었습니다.');
                    //                     gm.me().storeCubeDim.load();
                    //                 },
                    //                 failure: extjsUtil.failureMessage
                    //             });

                    //         }
                    //     },
                    //     icon: Ext.MessageBox.QUESTION,
                    // });
                } else {
                    Ext.MessageBox.alert('알림', '소모처리가 진행된 건에 대하여 반납처리가 가능합니다.')
                }

            }
        });



        this.oneGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('oneGrid'),
            selModel: 'checkboxmodel',
            width: '50%',
            store: this.consumeRateAssy,
            style: 'padding-left:0px;',
            columns: [
                {
                    text: this.getMC('msg_order_dia_order_customer', '품목코드'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_code'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '품목명'),
                    width: 200,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '생산요청수량'),
                    width: 110,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'bm_quan',

                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '생산지시일자'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'rtgast_od_create_date',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                }
            ],
            // plugins: {
            //     ptype: 'cellediting',
            //     clicksToEdit: 2,
            // },
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.consumeRateAssy,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {
                    }
                }

            }),
            width: 915,
            height: 720,
            listeners: {

            }
        });

        this.oneGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('selections >>>', selections[0]);
                    var rec = selections[0];
                    // gu.getCmp('order_description').setHtml('[' + rec.get('item_code') + '] ' + rec.get('item_name'));
                    gm.me().storeCubeDim.getProxy().setExtraParam('prdplan_uid', rec.get('pr_uid'));
                    gm.me().storeCubeDim.getProxy().setExtraParam('child', rec.get('srcahd_uid'));
                    gm.me().storeCubeDim.getProxy().setExtraParam('reserved_integer4', 1.0);
                    gm.me().storeCubeDim.load();
                    gm.me().requestProduceAssy.enable();
                    gm.me().cancelOutAll.enable();
                } else {
                    gm.me().requestProduceAssy.disable();
                }
            }
        });



        this.twoGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('twoGrid'),
            layout: 'fit',
            selModel: 'checkboxmodel',
            width: '100%',
            // height : '100%',
            autoHeight: true,
            style: 'padding-left:0px;',
            store: this.counsumeRateMtrl,
            columns: [
                {
                    text: this.getMC('msg_order_dia_order_customer', '품목코드'),
                    width: '8%',
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_code'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '품목명'),
                    width: '13%',
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },

                {
                    text: this.getMC('msg_sales_price_oem', '재고수량'),
                    width: '8%',
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'stock_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '총소요량'),
                    width: '8%',
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'total_need_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '입고예정수량'),
                    width: '12%',
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'total_warehouse_plan_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '과부족'),
                    width: '8%',
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'total_shortage_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '구매요청수량'),
                    width: '12%',
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'produce_request_qty',
                    editor: {
                        xtype: 'numberfield',
                        editable: true,
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '구매납기일'),
                    width: '10%',
                    sortable: true,
                    align: "left",
                    format: 'Y-m-d',
                    style: 'text-align:center',
                    dataIndex: 'prd_ware_plan_date',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                }
            ],
            // selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        '->',
                        this.requestPurchase,
                    ]
                }

            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                // store: this.produceStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {
                    }
                }

            }),
            viewConfig: {
                markDirty: false,
                stripeRows: true,
                enableTextSelection: false,
                preserveScrollOnReload: true,

            },
            width: 915,
            height: 661,
            listeners: {

            }
        });

        this.twoGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('selections >>>', selections[0]);
                    var rec = selections[0];
                    // gu.getCmp('order_description').setHtml('[' + rec.get('item_code') + '] ' + rec.get('item_name'));
                    gm.me().storeCubeDim.getProxy().setExtraParam('srcahd_uid', rec.get('srcahd_uid'));
                    gm.me().storeCubeDim.load();
                    gm.me().requestPurchase.enable();
                } else {
                    gm.me().requestPurchase.disable();
                }
            }
        });

        this.poStatusTemplate = Ext.create('Ext.tab.Panel', {
            cls: 'rfx-panel',
            layout: 'fit',
            width: '100%',
            height: '100%',
            plain: true,
            items: [{
                title: '생산계획',
                items: [this.oneGrid]
            }]
        });

        this.consumeRateAssy.getProxy().setExtraParam('orderBy', 'rtgast_od_create_date');
        this.consumeRateAssy.getProxy().setExtraParam('ascDesc', 'DESC');
        this.consumeRateAssy.load();

        var temp = {
            collapsible: false,
            frame: true,
            region: 'west',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 0.5,

            items: [this.poStatusTemplate],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        // this.purListSrch,
                        // this.requestProduceAssy,
                        // this.requestPurchase,
                        '->',
                        // this.analysisPsi
                    ]
                },
            ]
        };

        this.gridDimension = Ext.create('Ext.grid.Panel', {
            store: this.storeCubeDim,
            cls: 'rfx-panel',
            id: gu.id('description'),
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            reigon: 'center',
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            layout: 'fit',
            forceFit: false,
            flex: 0.5,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            columns: [

                // {
                //     text: '구분',
                //     width: 80,
                //     align: 'left',
                //     style: 'text-align:center',
                //     dataIndex: 'product_gubun'
                // },
                {
                    text: '진행상태',
                    width: 75,
                    align: 'center',
                    style: 'text-align:center',
                    dataIndex: 'alloc_use_finish',
                    renderer: function (value, meta) {
                        if (value === '소모완료') {
                            meta.style = "background-color:#3f51b5;color:white;text-align:center;";     
                        } else if(value === '대기') {
                            meta.style = "background-color:#00695f;color:white;text-align:center;";
                        } else if(value === '반납') {
                            meta.style = "background-color:#ef5350;color:white;text-align:center;";
                        }
                        return value;
                    },
                },
                {
                    text: '품명',
                    width: 200,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: '지정 일부인',
                    width: 100,
                    align: 'left',
                    style: 'text-align:center',
                    xtype: 'datecolumn',
                    dataIndex: 'exp_date',
                    format: 'Y-m-d'
                },
                {
                    text: '지정 LOT_NO',
                    width: 100,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'lot_no',
                },
                {
                    text: '소요량',
                    width: 90,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'plan_quan_trans',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '현재고',
                    width: 90,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'stock_qty_ton_kilo',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '사용예정수량',
                    width: 110,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'move_qty_ton_kilo',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '실 사용수량',
                    width: 100,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'alloc_use_qty',
                    editor: {
                        xtype: 'numberfield',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var store = gu.getCmp('description').getStore();
                                var record = gu.getCmp('description').getSelectionModel().getSelected().items[0];
                                console_logs('>>>> record', record);
                                var index = store.indexOf(record);
                                var alloc_use_finish = record.get('alloc_use_yn');
                                if (alloc_use_finish === 'N') {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/index/process.do?method=updateDivideResource',
                                        waitMsg: '데이터를 처리중입니다.',
                                        params: {
                                            unique_id_long: record.get('unique_id_long'),
                                            alloc_use_qty: newValue
                                        },
                                        success: function (result, request) {
                                            // gm.me().storeCubeDim.load()
                                        }, //endofsuccess
                                        failure: function (result, request) {
                                            var result = result.responseText;
                                            Ext.MessageBox.alert('알림', result);
                                        },
                                    });
                                }

                            }
                        }
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '추가사용수량',
                    width: 105,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'over_use_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '반납수량',
                    width: 105,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'return_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },

            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        // this.expDateAssign,
                        this.requestProduceAssy,
                        this.backAssignAction,
                        this.cancelOutAll,
                        this.returnMaterial
                    ]
                }
            ]
        });

        Ext.each(this.gridDimension.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'alloc_use_qty':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'alloc_use_qty':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                        // return value;
                    };
                    break;
                default:
                    break;
            }

        });

        this.gridDimension.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('selections >>>', selections[0]);
                    var rec = selections[0];
                    gm.me().backAssignAction.enable();
                    gm.me().returnMaterial.enable();
                } else {
                    gm.me().backAssignAction.disable();
                    gm.me().returnMaterial.disable();
                }
            }
        });



        var temp2 = {
            collapsible: false,
            frame: false,
            region: 'center',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 0.8,
            items: [this.gridDimension/** /, gridViewprop**/]
        };

        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: true
            },
            items: [temp, temp2, arr]
        });
        this.callParent(arguments);
    },

    bodyPadding: 10,

    defaults: {
        frame: true,
        bodyPadding: 10
    },

    autoScroll: true,
    fieldDefaults: {
        labelWidth: 300
    },
    items: null,
    makePalletEl: function () {
        var saveStore = null;
        var tempBoxQuan = 0;
        var tempBoxWeight = 0;
        var selections = gm.me().gridDimension.getSelectionModel().getSelected().items[0];
        var srcahd_uid = selections.get('srcahd_uid');
        gm.me().expdateStoreByMaterial.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
        gm.me().expdateStoreByMaterial.load();

        var lotList = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: gm.me().expdateStoreByMaterial,
            id: gu.id('prodUnitGrid'),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '99%',
            title: '일부인 별 재고 List',
            autoScroll: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            autoHeight: true,
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false
            },
            columns: [

                {
                    text: '일부인',
                    xtype: 'datecolumn',
                    width: '15%',
                    dataIndex: 'exp_date',
                    style: 'text-align:center',
                    typeAhead: false,
                    format: 'Y-m-d',
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '재고수량',
                    width: '18%',
                    xtype: 'numbercolumn',
                    dataIndex: 'stock_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '기 배분수량',
                    width: '18%',
                    xtype: 'numbercolumn',
                    dataIndex: 'move_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '배분 가능한 수량',
                    width: '18%',
                    xtype: 'numbercolumn',
                    dataIndex: 'move_positive_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                }
            ],
            listeners: {
                'itemClick': function (view, record) {
                    console_logs('>>> ddd', record);
                }
            },
            autoScroll: true,
        });

        var savelist = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('savelist'),
            store: new Ext.data.Store(),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '100%',
            title: '저장목록',
            autoScroll: true,
            margin: '10 0 0 5',
            autoHeight: true,
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false
            },
            columns: [

                {
                    text: '일부인',
                    width: '12%',
                    xtype: 'datecolumn',
                    dataIndex: 'exp_date',
                    format: 'Y-m-d',
                    style: 'text-align:center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '배분수량',
                    width: '12%',
                    editor: 'numberfield',
                    dataIndex: 'real_out_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'box_quan') {
                            context.record.set('box_quan', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },

                },
            ],
            listeners: {
                beforeedit: function (editor, context) {
                    var record = gu.getCmp('savelist').getSelectionModel().getSelected().items[0];
                    var store = gu.getCmp('savelist').getStore();
                },

                edit: function (value, context, ditor, e, eOpts) {
                    var record = gu.getCmp('savelist').getSelectionModel().getSelected().items[0];
                    var store = gu.getCmp('savelist').getStore();
                    var loadList = gu.getCmp('prodUnitGrid').getSelectionModel().getSelected().items[0];
                    console_logs('>>>>>> context', context);
                    console_logs('>>>>>> value', value);
                    var store = gu.getCmp('savelist').getStore();
                    console_logs('record edit >>> ', record);

                    if (context.field === 'real_out_qty') {
                        var load_qty = Number(record.get('item_quan'));
                        var total_load = 0;
                        var previous_store = store.data.items;
                        for (var i = 0; i < previous_store.length; i++) {
                            total_load = total_load + Number(previous_store[i].get('real_out_qty'));
                        }
                        gu.getCmp('total_load_disp').setHtml('<b>총 배분 수량 : ' + gUtil.renderNumber(Number(total_load)));
                    }
                }
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
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
                        {
                            xtype: 'label',
                            width: 200,
                            height: 20,
                            id: gu.id('total_load_disp'),
                            html: '<b>총 배분수량 : 0</b>',
                            style: 'color:blue;'
                        },
                        '->',
                        {
                            text: '추가',
                            iconCls: 'af-plus',
                            listeners: [{
                                click: function () {
                                    var isInsert = true;
                                    var store = gu.getCmp('savelist').getStore();
                                    var lotListSel = lotList.getSelectionModel().getSelected().items[0];
                                    if (isInsert == true) {
                                        store.insert(store.getCount(), new Ext.data.Record({
                                            'exp_date': lotListSel.get('exp_date'),
                                            'stodtl_uid': lotListSel.get('unique_id'),
                                            'item_code': lotListSel.get('item_code'),
                                            'stock_qty': lotListSel.get('stock_qty'),
                                            'real_out_qty': selections.get('plan_quan_trans')
                                        }));
                                        var total_load = 0;
                                        var previous_store = store.data.items;
                                        for (var i = 0; i < previous_store.length; i++) {
                                            total_load = total_load + Number(previous_store[i].get('real_out_qty'));
                                        }
                                    }
                                    gu.getCmp('total_load_disp').setHtml('<b>총 배분수량 : ' + gUtil.renderNumber(Number(total_load)));
                                }
                            }]
                        },
                        {
                            text: '삭제',
                            iconCls: 'af-remove',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('savelist').getSelectionModel().getSelected().items[0];
                                    if (record == null) {
                                        Ext.MessageBox.alert('알림', '삭제할 항목을 선택하십시오.')
                                        return;
                                    } else {
                                        var store = gu.getCmp('savelist').getStore();
                                        gu.getCmp('savelist').getStore().removeAt(gu.getCmp('savelist').getStore().indexOf(record));
                                        var total_load = 0;
                                        console_logs('store Length', store.getCount());
                                        var previous_store = store.data.items;
                                        for (var i = 0; i < previous_store.length; i++) {
                                            total_load = total_load + Number(previous_store[i].get('item_quan'));
                                        }
                                        gu.getCmp('total_load_disp').setHtml('<b>총 배분수량 : ' + gUtil.renderNumber(Number(total_load)));
                                    }
                                }
                            }]
                        },
                    ]
                })
            ],
        });

        var form = Ext.create('Ext.form.Panel', {
            id: 'addDlForm',
            xtype: 'form',
            title: '아래 리스트를 선택 후 추가하여 사용할 반제품/자재의 일부인을 지정하십시오.',
            frame: false,
            border: false,
            region: 'center',
            width: '100%',
            layout: 'vbox',
            bodyPadding: 10,
            items: [
                {
                    xtype: 'label',
                    width: 750,
                    height: 80,
                    html: '<font size=100><p style="text-align:left;">&nbsp&nbsp품명 : ' + selections.get('item_name') + '<br>&nbsp&nbsp품번 : ' + selections.get('item_code') + '<br>&nbsp&nbsp소요량 : ' + gUtil.renderNumber(Number(selections.get('plan_quan_trans'))) + '</p></font>',
                    style: 'color:black;'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '99%',
                    margin: '3 3 3 3',
                    items: [
                        lotList
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '99%',
                    margin: '20 3 3 3',
                    items: [
                        savelist
                    ]
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: true,
            title: '일부인 지정',
            width: 800,
            height: 700,
            plain: true,
            overflowY: 'scroll',
            items: form,
            buttons: [
                {
                    text: '일부인 지정',
                    handler: function (btn) {
                        if (btn == "no" || btn == "cancel") {
                            win.close();
                        } else {
                            var form = Ext.getCmp('addDlForm').getForm();
                            if (form.isValid()) {
                                win.setLoading(true);
                                var val = form.getValues(false);
                                var mainGrid = gm.me().gridDimension.getSelectionModel().getSelected().items[0];
                                console_logs('>>>> mainGrid', mainGrid);
                                var storeData = gu.getCmp('savelist').getStore();
                                var length = storeData.data.items.length;
                                if (length > 0) {
                                    var stodtl_uids = [];
                                    var real_out_qtys = [];
                                    for (var j = 0; j < storeData.data.items.length; j++) {
                                        var item = storeData.data.items[j];
                                        stodtl_uids.push(item.get('stodtl_uid'));
                                        real_out_qtys.push(item.get('real_out_qty'));
                                    }

                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/index/process.do?method=assignStodtlAtEBom',
                                        params: {
                                            assymap_uid: mainGrid.get('id'),
                                            stodtl_uids: stodtl_uids,
                                            real_out_qtys: real_out_qtys
                                        },
                                        success: function (val, action) {
                                            win.setLoading(false);
                                            // gm.me().store.load();
                                            gm.me().storeCubeDim.load();
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림', '저장목록에 추가된 지정내역이 없습니다.');
                                    return;
                                }
                            }
                        }
                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function (btn) {
                        win.close();
                    }
                }]
        });
        win.show();
    },

    expdateStoreByMaterial: Ext.create('Rfx2.store.company.sejun.PStockOfProdMovQtyStore'),

});