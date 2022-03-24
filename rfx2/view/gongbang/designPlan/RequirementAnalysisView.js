Ext.define('Rfx2.view.gongbang.designPlan.RequirementAnalysisView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'requirement-analysis-view',


    poStore: Ext.create('Rfx2.store.company.bioprotech.ConsumeRateResultStore', {
        sorters: [{
            property: 'po_no',
            direction: 'DESC'
        }]
    }),

    storeCubeDim: Ext.create('Rfx2.store.company.bioprotech.AssemblyProdRateStore', {}),
    storeViewProp: Ext.create('Rfx2.store.company.bioprotech.MaterialPurchaseRateStore', {}),

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
                // try {
                //     var s_date = gu.getCmp('s_date_arv').getValue();
                //     var e_date = gu.getCmp('e_date_arv').getValue();
                //     var reserved_varcharh = '';
                //     var project_varchar2 = '';
                //     var project_varchar3 = '';

                //     if (Ext.getCmp('reserved_varcharh').getValue().length > 0) {
                //         reserved_varcharh = Ext.getCmp('reserved_varcharh').getValue();
                //     }

                //     if (Ext.getCmp('project_varchar2').getValue().length > 0) {
                //         project_varchar2 = Ext.getCmp('project_varchar2').getValue();
                //     }

                //     if (Ext.getCmp('project_varchar3').getValue().length > 0) {
                //         project_varchar3 = Ext.getCmp('project_varchar3').getValue();
                //     }
                // } catch (e) {

                // }
                // gm.me().poStore.getProxy().setExtraParam('s_date', Ext.Date.format(s_date, 'Y-m-d'));
                // gm.me().poStore.getProxy().setExtraParam('e_date', Ext.Date.format(e_date, 'Y-m-d'));
                // gm.me().poStore.getProxy().setExtraParam('reserved_varcharh', '%' + reserved_varcharh + '%');
                // gm.me().poStore.getProxy().setExtraParam('project_varchar2', '%' + project_varchar2 + '%');
                // gm.me().poStore.getProxy().setExtraParam('project_varchar3', '%' + project_varchar3 + '%');
                // gm.me().poStore.load();
            }
        });

        this.requestProduceAssy = Ext.create('Ext.Action', {
            itemId: 'requestProduceAssy',
            text: '생산요청',
            disabled: true,
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: '생산요청',
                    msg: '생산요청을 진행하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            gMain.setCenterLoading(true);
                            // var selections = gm.me().grid.getSelectionModel().getSelection();
                            var selectionsBom = gm.me().storeCubeDim.getData().items;
                            var rec = selectionsBom[0];
                            var planmap_uids = [];
                            var srcahd_uids = [];
                            var req_quans = [];
                            var assymap_uids = [];
                            for (var i = 0; i < selectionsBom.length; i++) {
                                var rec1 = selectionsBom[i];
                                if (rec1.get('produce_req_qty') > 0) {
                                    var planmapuid = rec1.get('unique_id_long');
                                    planmap_uids.push(planmapuid);
                                    var srcahd_uid = rec1.get('srcahd_uid');
                                    srcahd_uids.push(srcahd_uid);
                                    assymap_uids.push(rec1.get('assymap_uid'));
                                    req_quans.push(rec1.get('produce_req_qty'));
                                }
                            }
                            console_logs('>>>>> srcahd_uids', srcahd_uids)
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/production/ra.do?method=requestAssembly',
                                params: {
                                    planmap_uids: planmap_uids,
                                    srcahd_uids: srcahd_uids,
                                    req_quans: req_quans,
                                    assymap_uids: assymap_uids
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    gMain.setCenterLoading(false);
                                    Ext.MessageBox.alert('알림', '확정처리 되었습니다.');
                                    // console_log('result:' + resultText);
                                    // var jsonData = Ext.JSON.decode(result.responseText);
                                    // var datas = jsonData.datas;
                                    // if (document.getElementById ('purchaseYn'). checked) {
                                    //     if (datas === 0) {
                                    //         gm.me().purchaseRequest();
                                    //     } else {
                                    //         gm.me().store.load();
                                    //         gm.me().pdBomStore.load();
                                    //         gMain.setCenterLoading(false);
                                    //         Ext.MessageBox.alert('알림', '확정처리 되었습니다.');
                                    //     }
                                    // } else {
                                    //     gm.me().store.load();
                                    //     gm.me().pdBomStore.load();
                                    //     gMain.setCenterLoading(false);
                                    //     Ext.MessageBox.alert('알림', '확정처리 되었습니다.');
                                    // }
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION,
                });
            }
        });

        this.requestPurchase = Ext.create('Ext.Action', {
            itemId: 'requestPurcahse',
            iconCls: 'af-dollar',
            text: '구매요청',
            disabled: true,
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: '구매요청',
                    msg: '해당 건에 대하여 자재 구매요청을 실시합니다.<br>단, 구매요청 계획이 0이상인 자재에 대하여 실행됩니다.',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == "no" || btn == "cancel") {
                            return;
                        } else {
                            var selections = gm.me().storeViewProp.getData().items;
                            // var selections = gu.getCmp('gridViewProp').getSelectionModel().getSelection();
                            var assymapUids = [];
                            var srcahdUids = [];
                            var prQuans = [];

                            var item_name = '';

                            var acUid = selections[0].get('ac_uid');
                            var req_date = Ext.Date.format(new Date(), 'Y-m-d');

                            for (var i = 0; i < selections.length; i++) {
                                var rec = selections[i];
                                if (rec.get('purchase_req_qty') > 0) {
                                    assymapUids.push(rec.get('assymap_uid'));
                                    srcahdUids.push(rec.get('srcahd_uid'));
                                    prQuans.push(rec.get('purchase_req_qty'));
                                }
                                if (i == 0) {
                                    item_name = rec.get('item_name');
                                }

                            }
                            console_logs('>>>> assymapUids', assymapUids);
                            console_logs('>>>> srcahdUids', srcahdUids);
                            console_logs('>>>> prQuans', prQuans);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequest',
                                params: {
                                    type: 'BOM',
                                    unique_uids: assymapUids,
                                    child: srcahdUids,
                                    pr_quan: prQuans,
                                    pj_uid: acUid,
                                    item_name: item_name,
                                    route_type: 'P'
                                },
                                success: function (result, request) {
                                    // gm.
                                    // gMain.selPanel.store.load();
                                    Ext.Msg.alert('안내', '요청접수 되었습니다.', function () {
                                    });
                                },//endofsuccess
                                failure: extjsUtil.failureMessage
                            });//endofajax
                        }
                    }
                });
            }
        });

        this.analysisPsi = Ext.create('Ext.Action', {
            itemId: 'analysisPsi',
            text: '입출고예정 조회',
            disabled: true,
            handler: function (widget, event) {
                var selections = gm.me().poStatusTemplate.getSelectionModel().getSelection();
                if (selections.length > 0) {
                    var rec = selections[0];
                    console_logs('rec', rec);
                    var item_code = rec.get('item_code');
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/admin/psi.do?method=read',
                        params: {
                            start_date: '2020-10-01',
                            end_date: '2020-12-31',
                            search_value: item_code
                        },
                        success: function (result, request) {
                            var o = Ext.JSON.decode(result.responseText);
                            console_logs('o', o);
                            var datas = o.datas;
                            console_logs('items', datas);
                            var rec = datas[0];
                            var qty = rec['qty'];
                            var oQty = Ext.JSON.decode(qty);
                            console_logs('oQty', oQty);
                            var arr = Object.keys(oQty);
                            console_logs('arr', arr);


                            var html = '';


                            html = html + '<table>'; /*   '<table><tr>'
                                    + '<td>' + rec['dataType'] + '</td>' 
                                    + '<td>' + rec['sum'] + '</td>' 
                                    + '<tr></table><table>';*/
                            for (var i = 0; i < arr.length; i++) {
                                var key = arr[i];
                                html = html + '<tr><td>' + key + '</td>' + '<td>' + oQty[key] + '</td></tr>';
                            }
                            html = html + '</table>';

                            Ext.MessageBox.alert('알림', html);

                        },
                    });
                }
            }
        });


        this.poStatusTemplate = Ext.create('Ext.grid.Panel', {
            store: this.poStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'SINGLE'}),
            bbar: getPageToolbar(this.poStore),
            frame: false,
            layout: 'fit',
            forceFit: true,
            width: '100%',
            columns: [
                {
                    text: '실행번호',
                    width: 60,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'po_no'
                },
                {
                    text: 'LOT NO',
                    width: 60,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'pcs_desc'
                },
                {
                    text: '품번',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_code'
                },
                {
                    text: '품명',
                    width: 70,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: '규격',
                    width: 70,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'specification'
                },
                {
                    text: '기준모델',
                    width: 70,
                    sortable: true,
                    xtype: "numbercolumn",
                    format: "0,000",
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'description'
                },
                {
                    text: '구매요청일',
                    width: 70,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'reserved_timestamp3'
                },
                {
                    text: '생산요청일',
                    width: 70,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'reserved_timestamp4'
                }
            ]
        });

        this.poStore.load();

        this.poStatusTemplate.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('selections >>>', selections[0]);
                    var rec = selections[0];
                    if (rec.get('rtg_type') === 'OP') {
                        gu.getCmp('order_description').setHtml('해당수주 : ' + rec.get('order_desc'));
                    } else {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/index/process.do?method=getSloastInfoBySrcahd',
                            params: {
                                srcahd_uid: rec.get('reserved_number1'),
                            },
                            success: function (result, request) {
                                gu.getCmp('order_description').setHtml('해당수주 : ' + result.responseText);
                            },
                        });
                    }
                    gm.me().storeCubeDim.getProxy().setExtraParam('rtgast_uid', rec.get('unique_id_long'));
                    gm.me().storeCubeDim.load();
                    gm.me().storeViewProp.getProxy().setExtraParam('rtgast_uid', rec.get('unique_id_long'));
                    gm.me().storeViewProp.load();
                    gm.me().requestPurchase.enable();
                    gm.me().analysisPsi.enable();

                    gm.me().requestProduceAssy.enable();
                }
            }
        });


        var temp = {
            title: '소요량계산 실행내역',
            collapsible: false,
            frame: true,
            region: 'west',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1,

            items: [this.poStatusTemplate],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.purListSrch,
                        this.requestProduceAssy,
                        this.requestPurchase,
                        '->',
                        this.analysisPsi
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [


                        {
                            xtype: 'triggerfield',
                            emptyText: '품번',
                            id: gu.id('reserved_varcharh'),
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            name: 'query_sup',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().poStore.getProxy().setExtraParam('reserved_varcharh', '%' + gu.getCmp('reserved_varcharh').getValue() + '%');
                                        gm.me().poStore.load(function () {
                                        });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                gu.getCmp('reserved_varcharh').setValue('');
                                this.poStore.getProxy().setExtraParam('reserved_varcharh', gu.getCmp('reserved_varcharh').getValue());
                                this.poStore.load(function () {
                                });
                            }
                        },
                        {
                            xtype: 'triggerfield',
                            emptyText: '품명',
                            id: gu.id('project_varchar2'),
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            name: 'query_sup',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().poStore.getProxy().setExtraParam('project_varchar2', '%' + gu.getCmp('project_varchar2').getValue() + '%');
                                        gm.me().poStore.load(function () {
                                        });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                gu.getCmp('project_varchar2').setValue('');
                                this.poStore.getProxy().setExtraParam('project_varchar2', gu.getCmp('project_varchar2').getValue());
                                this.poStore.load(function () {
                                });
                            }
                        }
                    ]
                }
            ]
        };

        var gridDimension = Ext.create('Ext.grid.Panel', {
            title: '생산 소요량',
            store: this.storeCubeDim,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            reigon: 'center',
            layout: 'fit',
            forceFit: true,
            flex: 0.5,
            columns: [
                {
                    text: 'LEVEL',
                    width: 20,
                    align: 'center',
                    style: 'text-align:center',
                    dataIndex: 'bom_level'
                },
                {
                    text: '품번',
                    width: 30,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'prod_item_code'
                },
                {
                    text: '품번',
                    width: 30,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: '모품번',
                    width: 30,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'parent_item_code'
                },
                {
                    text: '소요수량',
                    width: 25,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'bm_quan'
                },
                {
                    text: '요청수량',
                    width: 25,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'plan_quan'
                },
                {
                    text: '생산계획',
                    width: 25,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'produce_req_qty'
                },
                {
                    text: '재고수량',
                    width: 25,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'stock_qty'
                }

            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'rfx-panel',
                    style: {
                        background: '#002266'
                    },
                    items: [
                        {
                            xtype: 'container',
                            width: '100%',
                            height: 20,
                            margin: '0 0 5 1',
                            border: true,
                            defaultMargins: {
                                top: 10,
                                right: 0,
                                bottom: 0,
                                left: 0
                            },

                            items: [
                                {
                                    xtype: 'label',
                                    id: gu.id('order_description'),
                                    width: 400,
                                    height: 50,
                                    html: '실행번호를 선택하십시오.',
                                    style: 'color:#FFFFFF;'
                                }
                            ]
                        },

                    ]
                }
            ]
        });

        // gridDimension.getSelectionModel().on({
        //     selectionchange: function (sm, selections) {
        //         if (selections.length > 0) {
        //             var rec = selections[0];
        //             console_logs('>>>> rec', rec);
        //             pj_uid = selections[0].get('ac_uid');
        //             in_wth_uid = selections[0].get('unique_id');
        //             in_date = selections[0].get('requestDateStr');
        //             in_requestor = selections[0].get('requestor');
        //             in_price = selections[0].get('price');
        //             in_description = selections[0].get('description');
        //             sub_type = selections[0].get('sub_type_kr');

        //             editWdInHistory.enable();
        //             deleteWdInAction.enable();
        //             downloadFiles.enable();
        //         }
        //     }
        // });

        var gridViewprop = Ext.create('Ext.grid.Panel', {
            title: '구매 소요량',
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            store: this.storeViewProp,

            reigon: 'south',
            layout: 'fit',
            forceFit: true,
            flex: 0.5,
            columns: [
                {
                    text: 'LEVEL',
                    width: 20,
                    align: 'center',
                    style: 'text-align:center',
                    dataIndex: 'bom_level'
                },
                {
                    text: '품번',
                    width: 30,
                    style: 'text-align:center',
                    dataIndex: 'prod_item_code'
                },
                {
                    text: '품명',
                    width: 30,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: '모품번',
                    width: 30,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'parent_item_code'
                },
                {
                    text: '소요수량',
                    width: 25,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'bm_quan'
                },
                {
                    text: '요청수량',
                    width: 25,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'plan_quan'
                },
                {
                    text: '주문수량',
                    width: 25,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'purchase_req_qty'
                },
                {
                    text: '재고수량',
                    width: 25,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'stock_qty'
                }
            ],
            // dockedItems: [
            //     {
            //         dock: 'top',
            //         xtype: 'toolbar',
            //         cls: 'my-x-toolbar-default2',
            //         items: [addWdOutHistory, editWdOutHistory ,deleteWdOutAction /**checkedIssueBillOut,downloadFiles**/]
            //     }
            // ]
        });


        // gridViewprop.getSelectionModel().on({
        //     selectionchange: function (sm, selections) {
        //         if (selections.length > 0) {
        //             var rec = selections[0];
        //             console_logs('>>>> rec', rec);
        //             out_wth_uid = selections[0].get('unique_id');
        //             out_date = selections[0].get('requestDateStr');
        //             out_requestor = selections[0].get('requestor');
        //             out_price = selections[0].get('price');
        //             out_description = selections[0].get('description');
        //             sub_type = selections[0].get('sub_type_kr');
        //             // coord_key3 = selections[0].get('coordkey_3');
        //             // bill_date = selections[0].get('reserved_timestamp1_str');
        //             // requestor = selections[0].get('reserved_varchar1');
        //             // description = selections[0].get('reserved_varchar2');
        //             // total_price = selections[0].get('total_price');
        //             // supPrice = selections[0].get('reserved_double1');
        //             // taxPrice = selections[0].get('reserved_double2');
        //             // reserved_timestamp1_str = selections[0].get('reserved_timestamp1_str');
        //             // unique_id = selections[0].get('unique_id');
        //             editWdOutHistory.enable();
        //             deleteWdOutAction.enable();
        //             // gm.me().fileContentStore.getProxy().setExtraParam('file_code', unique_id + '_SAL_COP');
        //             // gm.me().fileContentStore.load(function (record) {
        //             //     objs = [];
        //             //     gm.me().fileContentRecords = record;
        //             //     var obj = {};
        //             //     console_logs(gm.me().fileContentRecords);
        //             //     var rec = gm.me().fileContentRecords;
        //             //     var columns = [];
        //             //     for (var i = 0; i < rec.length; i++) {
        //             //         var sel = rec[i];
        //             //         var objv = {};
        //             //         console_logs('>>> sel', sel);
        //             //         var file_path = sel.get('file_path');
        //             //         var object_name = sel.get('object_name');
        //             //         var file_ext = sel.get('file_ext');
        //             //         objv['file_path'] = file_path;
        //             //         objv['object_name'] = object_name;
        //             //         objv['file_ext'] = file_ext;
        //             //         columns.push(objv);
        //             //     }
        //         //     obj['datas'] = columns;
        //         //     objs.push(obj);
        //         //     console_logs('>>>> objs >>>>> ', objs);
        //         // })

        //             // downloadFiles.enable();
        //             // checkedIssueBillOut.enable();
        //         }
        //     }
        // });

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
            flex: 1,
            items: [gridDimension, gridViewprop]
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


});