Ext.define('Rfx2.view.company.bioprotech.designPlan.RequirementAanalysisView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'inspect-category-def-view',

    consumeRateAssy: Ext.create('Rfx2.store.company.bioprotech.ConsumeRateTotalAssyResultStore', {
        sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
    }),

    counsumeRateMtrl: Ext.create('Rfx2.store.company.bioprotech.ConsumeRateTotalMaterialResultStore', {
        sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
    }),

    storeCubeDim: Ext.create('Rfx2.store.company.bioprotech.PsiInfoStore', {}),
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
                gm.me().consumeRateAssy.load();
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
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
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
                            var planmap_uids = [];
                            var srcahd_uids = [];
                            var req_quans = [];
                            var assymap_uids = [];
                            var record = gm.me().oneGrid.getSelectionModel().getSelection();
                            console_logs('>>> record', record);
                            for (var i = 0; i < record.length; i++) {
                                var selections = record[i];
                                var produce_request_qty = selections.get('produce_request_qty');
                                if (produce_request_qty > 0) {
                                    var srcahd_uid = selections.get('srcahd_uid');
                                    srcahd_uids.push(srcahd_uid);
                                    assymap_uids.push(selections.get('assymap_uid'));
                                    req_quans.push(produce_request_qty);
                                    planmap_uids.push(selections.get('unique_id_long'));
                                } else {
                                    Ext.MessageBox.alert('알림', '생산요청수량이 0인 건이 있습니다.<br>다시 확인해주세요.')
                                }
                            }
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
                                    Ext.MessageBox.alert('알림', '요청처리 되었습니다.');
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
            hidden: gu.setCustomBtnHiddenProp('requestPurchase'),
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
                            var record = gm.me().oneGrid.getSelectionModel().getSelection();
                            // var selections = gu.getCmp('gridViewProp').getSelectionModel().getSelection();
                            console_logs('>>>> ', record);
                            var assymapUids = [];
                            var srcahdUids = [];
                            var prQuans = [];

                            var item_name = '';

                            var acUid = -1;
                            var req_date = Ext.Date.format(new Date(), 'Y-m-d');

                            for (var i = 0; i < record.length; i++) {
                                var rec = record[i];
                                console_logs('>>>>>>>>', rec);
                                if (rec.get('produce_order_qty') > 0) {
                                    assymapUids.push(-1);
                                    srcahdUids.push(rec.get('srcahd_uid'));
                                    prQuans.push(Math.round(rec.get('produce_order_qty')));
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
                                    type: 'MRP',
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


        this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            hidden: gu.setCustomBtnHiddenProp('prEstablishAction'),
            disabled: true,
            handler: function () {
                gm.me().producePlanOp();
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

        this.popUpExcelHandler = function (MAINorSUB) {

            var myWidth = 600;
            var myHeight = 80;

            // var store = this.storeCubeDim;;
            // var menuCode = gm.me().link + '_SUB';
            // var columnList = [];

            var store = null;
            var menuCode = null;
            var columnList = [];

            function subExcelCallback() {
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("menuCode", menuCode);

                var checkboxItems = [];
                for (var i = 0; i < columnList.length; i++) {
                    if (i % 4 == 0) {
                        myHeight += 30;
                    }
                    checkboxItems.push({
                        xtype: 'checkbox',
                        // checked: gm.me().columns[i]['excel_set'] === 'Y' ? true : false,
                        checked: true,
                        fieldLabel: columnList[i]['text'],
                        name: columnList[i]['id'],
                        margin: '5 20 0 5',
                        allowBlank: false,
                        codeName: columnList[i]['codeName'],
                        stateId: columnList[i]['stateId'],
                        listeners: {
                            change: function (checkbox, newVal, oldVal) {
                                for (var i = 0; i < columnList.length; i++) {
                                    if (checkbox.name === columnList[i]['id']) {
                                        columnList[i]['excel_set'] = newVal ? 'Y' : 'N';
                                    }
                                }
                            }
                        }
                    });
                }
                var formPanel = Ext.create('Ext.form.Panel', {
                    bodyPadding: 5,
                    width: myWidth,
                    vertical: false,
                    layout: 'column',
                    defaults: {
                        anchor: '100%'
                    },
                    defaultType: 'textfield',
                    items: checkboxItems
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '엑셀을 출력할 항목을 선택하세요',
                    width: myWidth,
                    height: myHeight,
                    items: formPanel,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                var formItems = formPanel.items.items;
                                var code_uids = [];
                                var system_codes = [];


                                for (var i = 0; i < formItems.length; i++) {
                                    var formItem = formItems[i];

                                    if (formItem['name'] === undefined) {
                                        continue;
                                    }

                                    var formUidArr = formItem['name'].split('-');
                                    var formUid = formUidArr[1];
                                    if (formItem.checked) {
                                        var system_code = formItem['codeName'];
                                        var stateId = formItem['stateId'];
                                        if (system_code !== undefined && system_code !== null) {
                                            system_codes.push(system_code + ':' + stateId);
                                        }
                                        code_uids.push(formUid);
                                    }
                                }

                                store.getProxy().setExtraParam("code_uids", code_uids);
                                store.getProxy().setExtraParam("system_codes", system_codes);
                                prWin.setLoading(true);
                                store.load({
                                    scope: this,
                                    callback: function (records, operation, success) {
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                                            success: function (response, request) {
                                                store.getProxy().setExtraParam("srch_type", null);
                                                var excelPath = response.responseText;
                                                if (excelPath != null && excelPath.length > 0) {
                                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                                    top.location.href = url;

                                                } else {
                                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                                }
                                                prWin.setLoading(false);

                                                if (prWin) {
                                                    prWin.close();
                                                }
                                            }
                                        });
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

            switch (MAINorSUB) {
                case 'MAIN':
                    store = this.consumeRateAssy;
                    menuCode = gm.me().link;
                    columnList = gm.me().columns;
                    // console.log('동명columnList', columnList);
                    subExcelCallback();
                    break;
                case 'SUB':
                    store = this.storeCubeDim;
                    menuCode = gm.me().link + '_SUB';
                    var subCodeStore = Ext.create('Rfx.store.ExtFieldColumnStore', {});
                    subCodeStore.getProxy().setExtraParam('menuCode', menuCode);
                    // subCodeStore.load(function (data) {
                    //     console.log('동명data', data);
                    //     data.forEach(element => {
                    //         subColumnList.push(element.data);
                    //     });
                    //     columnList = subColumnList
                    //     console.log('동명columnList', columnList);
                    // });
                    subCodeStore.load(function (data) {
                        // console.log('동명data', data);
                        data.forEach(element => {
                            if (!!element.data['text']) {
                                element.data['id'] = 'uid-' + element.data['unique_id_long'];
                                columnList.push(element.data);
                            }
                        });
                        // console.log('동명columnList', columnList);
                        subExcelCallback();
                    });
                    break;
                default:
                    store = this.consumeRateAssy;
                    menuCode = gm.me().link;
                    break;
            }


        };
        this.excelAction = Ext.create('Ext.Action', {
            iconCls: 'af-excel',
            text: 'Excel',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('excelAction'),
            handler: function () {
                gm.me().popUpExcelHandler('MAIN');
            }
        });

        this.subExcelAction = Ext.create('Ext.Action', {
            iconCls: 'af-excel',
            text: 'Excel',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('subExcelAction'),
            handler: function () {
                gm.me().popUpExcelHandler('SUB');
            }
        });

        var materialTypeStore = Ext.create('Ext.data.Store', {
            fields: ['id', 'show'], 
            data: [
                { id: 'BPH', show: 'BPH' }, 
                { id: 'BPC', show: 'BPC' }, 
                { id: 'PUR', show: '구매' },
                { id: 'SPL', show: 'SPLIT'},
                { id: 'OUT', show: '외주'}
            ] 
        });

        // this.oneGrid = Ext.create('Rfx2.view.grid.Exporter', {
        this.oneGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('oneGrid'),
            layout: 'fit',
            selModel: Ext.create("Ext.selection.CheckboxModel"),
            // width: '100%',
            height: '100%',
            store: this.consumeRateAssy,
            // style: 'padding-left:0px;',
            columns: [
                {
                    text: this.getMC('msg_order_dia_order_customer', '품목코드'),
                    width: 70,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_code'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '품목명'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '기준모델'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'description'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '규격'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'specification'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '조달구분'),
                    width: 80,
                    sortable: true,
                    // align: "right",
                    style: 'text-align:center',
                    dataIndex: 'material_type',
                    // renderer: function (value, context, tmeta) {
                    //     return Ext.util.Format.number(value, '0,00/i');
                    // },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '소요량'),
                    width: 80,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'total_need_qty',
                    renderer: function (value, context, tmeta) {
                        value = value >= 0 ? Math.ceil(value) : Math.floor(value)
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '현장재고'),
                    width: 80,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'spot_warehouse_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '제품창고재고'),
                    width: 80,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'product_warehouse_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '자재창고 재고'),
                    width: 80,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'material_warehouse_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '외주창고 재고'),
                    width: 80,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'out_warehouse_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '입고잔량'),
                    width: 80,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'warehouse_plan_qty',
                    renderer: function (value, context, tmeta) {
                        value = value >= 0 ? Math.ceil(value) : Math.floor(value)
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '과부족'),
                    width: 80,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'shortage_qty',
                    renderer: function (value, context, tmeta) {
                        value = value >= 0 ? Math.ceil(value) : Math.floor(value)
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '추가생산'),
                    width: 80,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'system_production',
                    renderer: function (value, context, tmeta) {
                        value = value >= 0 ? Math.ceil(value) : Math.floor(value)
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '계획/발주수량'),
                    width: 130,
                    sortable: true,
                    align: "right",
                    editor : 'numberfield',
                    style: 'text-align:center',
                    dataIndex: 'produce_order_qty',
                    renderer: function (value, context, tmeta) {
                        value = value >= 0 ? Math.ceil(value) : Math.floor(value)
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '계산시각',
                    width: 90,
                    sortable: true,
                    // align: "right",
                    style: 'text-align:center',
                    dataIndex: 'create_date',
                    // renderer: function (value, context, tmeta) {
                    //     return Ext.util.Format.number(value, '0,00/i');
                    // },
                },

            ],
            // selModel: 'cellmodel',
            plugins: [
                {
                    ptype: 'cellediting',
                    clicksToEdit: 2,
                },
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.purListSrch,
                        '->',
                        this.requestPurchase,
                        this.prEstablishAction,
                        // this.requestProduceAssy,
                        // createExcelAction(gu.getCmp('oneGrid'))
                        this.excelAction,
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    layout: 'column',
                    defaults: {
                        style: 'margin-top: 1px; margin-bottom: 1px;'
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            id: gu.id('is_minus_material'),
                            // fieldLabel: '<font color=white>부족자재만</font>',
                            width: '1%',
                            // width : '100px',
                            labelStyle: 'width: 0px',
                            // style: 'background-color : #FFFFFF',
                            listeners: {
                                change: function (cb, newValue, oldValue, eOpts) {
                                    // console_logs('cb>>>>>', newValue);
                                    if (newValue === true) {
                                        gm.me().consumeRateAssy.getProxy().setExtraParam('is_minus_material', 'true');
                                        // gm.me().salesPriceListStore.getProxy().setExtraParam('end_date_not_view', 'N');
                                    } else {
                                        gm.me().consumeRateAssy.getProxy().setExtraParam('is_minus_material', 'false');
                                        // gm.me().salesPriceListStore.getProxy().setExtraParam('end_date_not_view', 'Y');
                                    }
                                    gm.me().consumeRateAssy.load();
                                }

                            }
                        }, 
                        {
                            xtype: 'label',
                            // id: gu.id('is_minus_material'),
                            text: '부족자재',
                            width: 60,
                            style: 'color:white;width:10px;height:10px;display:block; padding:5px 10px 0px 0px',
                            renderTo: document.body
                            // labelStyle: 'width: 5px',
                            // style: 'background-color : #FFFFFF',
                            // listeners: {
                            //     change: function (cb, newValue, oldValue, eOpts) {
                            //         // console_logs('cb>>>>>', newValue);
                            //         if (newValue === true) {
                            //             gm.me().consumeRateAssy.getProxy().setExtraParam('is_minus_material', 'true');
                            //             // gm.me().salesPriceListStore.getProxy().setExtraParam('end_date_not_view', 'N');
                            //         } else {
                            //             gm.me().consumeRateAssy.getProxy().setExtraParam('is_minus_material', 'false');
                            //             // gm.me().salesPriceListStore.getProxy().setExtraParam('end_date_not_view', 'Y');
                            //         }
                            //         gm.me().consumeRateAssy.load();
                            //     }

                            // }
                        },
                        {
                            xtype: 'tagfield', 
                            store: materialTypeStore, 
                            displayField: 'show', 
                            valueField: 'id', 
                            queryMode: 'local', 
                            filterPickList: true ,
                            emptyText: '구분',
                            // grow: false,
                            growMax: 24, // 최대 확장 height
                            maxWidth: 310,
                            listeners: {
                                change: function(a, val, c) {
                                    gm.me().consumeRateAssy.getProxy().setExtraParam('material_type', val);
                                }
                            }
                        },
                        {
                            xtype: 'triggerfield',
                            emptyText: '품목코드',
                            id: gu.id('item_code_search'),
                            width: 130,
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            name: 'item_code_query',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().consumeRateAssy.getProxy().setExtraParam('item_code', '%' + gu.getCmp('item_code_search').getValue() + '%');
                                        gm.me().consumeRateAssy.load(function () {
                                        });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                gu.getCmp('item_code').setValue('');
                                gm.me().consumeRateAssy.getProxy().setExtraParam('item_code', gu.getCmp('item_code_search').getValue());
                                gm.me().consumeRateAssy.load(function () {
                                });
                            }
                        },
                        {
                            xtype: 'triggerfield',
                            emptyText: '품명',
                            id: gu.id('item_name_search'),
                            width: 130,
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            name: 'item_name_query',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().consumeRateAssy.getProxy().setExtraParam('item_name', '%' + gu.getCmp('item_name_search').getValue() + '%');
                                        gm.me().consumeRateAssy.load(function () {
                                        });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                gu.getCmp('item_name').setValue('');
                                gm.me().consumeRateAssy.getProxy().setExtraParam('item_name', gu.getCmp('item_name_search').getValue());
                                gm.me().consumeRateAssy.load(function () {
                                });
                            }
                        },
                        {

                            xtype: 'triggerfield',
                            emptyText: '기준모델',
                            id: gu.id('description_search'),
                            width: 130,
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            name: 'description_query',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().consumeRateAssy.getProxy().setExtraParam('description', '%' + gu.getCmp('description_search').getValue() + '%');
                                        gm.me().consumeRateAssy.load(function () {
                                        });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                gu.getCmp('description').setValue('');
                                gm.me().consumeRateAssy.getProxy().setExtraParam('description', gu.getCmp('description_search').getValue());
                                gm.me().consumeRateAssy.load(function () {
                                });
                            }
                        },

                        {

                            xtype: 'triggerfield',
                            emptyText: '규격',
                            id: gu.id('specification_search'),
                            width: 130,
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            name: 'specification_query',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().consumeRateAssy.getProxy().setExtraParam('specification', '%' + gu.getCmp('specification_search').getValue() + '%');
                                        gm.me().consumeRateAssy.load(function () {
                                        });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                gu.getCmp('specification').setValue('');
                                gm.me().consumeRateAssy.getProxy().setExtraParam('specification', gu.getCmp('specification_search').getValue());
                                gm.me().consumeRateAssy.load(function () {
                                });
                            }

                        },
                    ]
                },
            ],
            scrollable: true,
            flex: 1,
            width: '100%',
            height: 690,
            listeners: {}
        });
        this.oneGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('selections >>>', selections[0]);
                    var rec = selections[0];
                    var material_type = rec.get('material_type');
                    var material_type_out = null;
                    var plan_type = null;
                    switch(rec.get('material_type')) {
                        case 'OUT':
                        case 'SPL':
                            material_type_out = rec.get('material_type');
                            plan_type = "STOSUM";
                        case 'PUR':
                            material_type = null;
                            break;
                        default:
                            material_type_out = null;
                            plan_type = null;
                    }
                    gu.getCmp('order_description').setHtml('[' + rec.get('item_code') + '] ' + rec.get('item_name'));
                    gm.me().storeCubeDim.getProxy().setExtraParams({
                        'material_type': material_type,
                        'srcahd_uid': rec.get('srcahd_uid'),
                        'material_type_out' : material_type_out,
                        'plan_type' : plan_type
                    });
                    gm.me().storeCubeDim.load();
                    // gm.me().storeViewProp.getProxy().setExtraParam('rtgast_uid', rec.get('unique_id_long'));
                    // gm.me().storeViewProp.load();
                    if(selections.length ==  1) {
                        gm.me().prEstablishAction.enable();
                    } else {
                        gm.me().prEstablishAction.disable();
                    }
                    gm.me().requestPurchase.enable();
                    // gm.me().analysisPsi.enable();

                    
                    // gm.me().requestProduceAssy.enable();
                } else {
                    gm.me().requestPurchase.disable();
                    // gm.me().requestProduceAssy.disable();
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
                    text: this.getMC('msg_sales_price_oem', '기준모델'),
                    width: '13%',
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'description'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '규격'),
                    width: '15%',
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'specification'
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
                        return Ext.util.Format.number(Math.ceil(value), '0,00/i');
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
                        return Ext.util.Format.number(Math.ceil(value), '0,00/i');
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
            listeners: {}
        });

        this.twoGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('selections >>>', selections[0]);
                    var rec = selections[0];
                    gu.getCmp('order_description').setHtml('[' + rec.get('item_code') + '] ' + rec.get('item_name'));
                    gm.me().storeCubeDim.getProxy().setExtraParam('srcahd_uid', rec.get('srcahd_uid'));
                    gm.me().storeCubeDim.load();
                    // var rec = selections[0];
                    // if (rec.get('rtg_type') === 'OP') {
                    //     gu.getCmp('order_description').setHtml('해당수주 : ' + rec.get('order_desc'));
                    // } else {
                    //     Ext.Ajax.request({
                    //         url: CONTEXT_PATH + '/index/process.do?method=getSloastInfoBySrcahd',
                    //         params: {
                    //             srcahd_uid: rec.get('reserved_number1'),
                    //         },
                    //         success: function (result, request) {
                    //             gu.getCmp('order_description').setHtml('해당수주 : ' + result.responseText);
                    //         },
                    //     });
                    // }
                    // gm.me().storeCubeDim.getProxy().setExtraParam('rtgast_uid', rec.get('unique_id_long'));
                    // gm.me().storeCubeDim.load();
                    // gm.me().storeViewProp.getProxy().setExtraParam('rtgast_uid', rec.get('unique_id_long'));
                    // gm.me().storeViewProp.load();
                    // gm.me().requestPurchase.enable();
                    // gm.me().analysisPsi.enable();

                    gm.me().requestPurchase.enable();
                } else {
                    gm.me().requestPurchase.disable();
                }
            }
        });

        this.poStatusTemplate = Ext.create('Ext.tab.Panel', {
            // store: this.poStore,
            cls: 'rfx-panel',
            // frame: false,
            layout: 'fit',
            width: '100%',
            height: '100%',
            tabPosition: 'top',
            plain: true,
            selModel: Ext.create("Ext.selection.CheckboxModel"),
            items: [{
                title: '소요량계산결과',
                items: [this.oneGrid]
            }/**, {
                title: '구매',
                items: [this.twoGrid]
            }**/]
            // columns: [
            //     {
            //         text: '실행번호',
            //         width: 60,
            //         sortable: true,
            //         align: "left",
            //         style: 'text-align:center',
            //         dataIndex: 'po_no'
            //     },
            //     {
            //         text: 'LOT NO',
            //         width: 60,
            //         sortable: true,
            //         align: "left",
            //         style: 'text-align:center',
            //         dataIndex: 'pcs_desc'
            //     },
            //     {
            //         text: '품번',
            //         width: 80,
            //         sortable: true,
            //         align: "left",
            //         style: 'text-align:center',
            //         dataIndex: 'item_code'
            //     },
            //     {
            //         text: '품명',
            //         width: 70,
            //         sortable: true,
            //         align: "left",
            //         style: 'text-align:center',
            //         dataIndex: 'item_name'
            //     },
            //     {
            //         text: '규격',
            //         width: 70,
            //         sortable: true,
            //         align: "left",
            //         style: 'text-align:center',
            //         dataIndex: 'specification'
            //     },
            //     {
            //         text: '기준모델',
            //         width: 70,
            //         sortable: true,
            //         xtype: "numbercolumn",
            //         format: "0,000",
            //         align: "right",
            //         style: 'text-align:center',
            //         dataIndex: 'description'
            //     },
            //     {
            //         text: '구매요청일',
            //         width: 70,
            //         sortable: true,
            //         align: "left",
            //         style: 'text-align:center',
            //         dataIndex: 'reserved_timestamp3'
            //     },
            //     {
            //         text: '생산요청일',
            //         width: 70,
            //         sortable: true,
            //         align: "left",
            //         style: 'text-align:center',
            //         dataIndex: 'reserved_timestamp4'
            //     }
            // ]
        });

        this.consumeRateAssy.load();
        this.counsumeRateMtrl.load();

        // this.poStatusTemplate.getSelectionModel().on({
        //     selectionchange: function (sm, selections) {
        //         if (selections.length > 0) {
        //             console_logs('selections >>>', selections[0]);
        //             var rec = selections[0];
        //             if (rec.get('rtg_type') === 'OP') {
        //                 gu.getCmp('order_description').setHtml('해당수주 : ' + rec.get('order_desc'));
        //             } else {
        //                 Ext.Ajax.request({
        //                     url: CONTEXT_PATH + '/index/process.do?method=getSloastInfoBySrcahd',
        //                     params: {
        //                         srcahd_uid: rec.get('reserved_number1'),
        //                     },
        //                     success: function (result, request) {
        //                         gu.getCmp('order_description').setHtml('해당수주 : ' + result.responseText);
        //                     },
        //                 });
        //             }
        //             gm.me().storeCubeDim.getProxy().setExtraParam('rtgast_uid', rec.get('unique_id_long'));
        //             gm.me().storeCubeDim.load();
        //             gm.me().storeViewProp.getProxy().setExtraParam('rtgast_uid', rec.get('unique_id_long'));
        //             gm.me().storeViewProp.load();
        //             gm.me().requestPurchase.enable();
        //             gm.me().analysisPsi.enable();

        //             gm.me().requestProduceAssy.enable();
        //         }
        //     }
        // });


        var temp = {
            // title: '소요량계산결과',
            collapsible: false,
            // frame: true,
            region: 'west',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 20 0',
            flex: 1.5,
            height : '100%',

            items: [this.poStatusTemplate],
            // dockedItems: [
            //     {
            //         dock: 'top',
            //         xtype: 'toolbar',
            //         cls: 'my-x-toolbar-default2',
            //         items: [
            //             // this.purListSrch,
            //             // this.requestProduceAssy,
            //             // this.requestPurchase,
            //             // '->',
            //             // this.analysisPsi
            //         ]
            //     },
            //     // {
            //     //     dock: 'top',
            //     //     xtype: 'toolbar',
            //     //     cls: 'my-x-toolbar-default1',
            //     //     items: [


            //     //         {
            //     //             xtype: 'triggerfield',
            //     //             emptyText: '품번',
            //     //             id: gu.id('reserved_varcharh'),
            //     //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
            //     //             name: 'query_sup',
            //     //             listeners: {
            //     //                 specialkey: function (field, e) {
            //     //                     if (e.getKey() == Ext.EventObject.ENTER) {
            //     //                         gm.me().poStore.getProxy().setExtraParam('reserved_varcharh', '%' + gu.getCmp('reserved_varcharh').getValue() + '%');
            //     //                         gm.me().poStore.load(function () { });
            //     //                     }
            //     //                 }
            //     //             },
            //     //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            //     //             'onTrigger1Click': function () {
            //     //                 gu.getCmp('reserved_varcharh').setValue('');
            //     //                 this.poStore.getProxy().setExtraParam('reserved_varcharh', gu.getCmp('reserved_varcharh').getValue());
            //     //                 this.poStore.load(function () { });
            //     //             }
            //     //         },
            //     //         {
            //     //             xtype: 'triggerfield',
            //     //             emptyText: '품명',
            //     //             id: gu.id('project_varchar2'),
            //     //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
            //     //             name: 'query_sup',
            //     //             listeners: {
            //     //                 specialkey: function (field, e) {
            //     //                     if (e.getKey() == Ext.EventObject.ENTER) {
            //     //                         gm.me().poStore.getProxy().setExtraParam('project_varchar2', '%' + gu.getCmp('project_varchar2').getValue() + '%');
            //     //                         gm.me().poStore.load(function () { });
            //     //                     }
            //     //                 }
            //     //             },
            //     //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            //     //             'onTrigger1Click': function () {
            //     //                 gu.getCmp('project_varchar2').setValue('');
            //     //                 this.poStore.getProxy().setExtraParam('project_varchar2', gu.getCmp('project_varchar2').getValue());
            //     //                 this.poStore.load(function () { });
            //     //             }
            //     //         }
            //     //     ]
            //     // }
            // ]
        };

        var gridDimension = Ext.create('Ext.grid.Panel', {
            title: '재고 / 입고 / 소요량 세부',
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
                    text: '일자',
                    width: 18,
                    align: 'left',
                    format: 'Y-m-d',
                    style: 'text-align:center',
                    dataIndex: 'plan_date',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: '소요구분',
                    width: 20,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'plan_type_kr'
                },
                {
                    text: '요청번호',
                    width: 30,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'plan_no'
                },
                {
                    text: '고객사 / 공급사',
                    width: 30,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'plan_target'
                },
                {
                    text: '입고/소요수',
                    width: 25,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'psi_qty',
                    renderer: function (value, context, tmeta) {
                        value = value >= 0 ? Math.ceil(value) : Math.floor(value)
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '예상재고',
                    width: 25,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'predicted_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },

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
                            width: '80%',
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
                                    html: '품목을 선택하십시오.',
                                    style: 'color:#FFFFFF;'
                                },
                            ]
                        },
                        '->',
                        this.subExcelAction

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
            // columns: [
            //     {
            //         text: 'LEVEL',
            //         width: 20,
            //         align: 'center',
            //         style: 'text-align:center',
            //         dataIndex: 'bom_level'
            //     },
            //     {
            //         text: '품번',
            //         width: 30,
            //         style: 'text-align:center',
            //         dataIndex: 'prod_item_code'
            //     },
            //     {
            //         text: '품명',
            //         width: 30,
            //         align: 'left',
            //         style: 'text-align:center',
            //         dataIndex: 'item_name'
            //     },
            //     {
            //         text: '모품번',
            //         width: 30,
            //         align: 'left',
            //         style: 'text-align:center',
            //         dataIndex: 'parent_item_code'
            //     },
            //     {
            //         text: '소요수량',
            //         width: 25,
            //         align: 'right',
            //         style: 'text-align:center',
            //         dataIndex: 'bm_quan'
            //     },
            //     {
            //         text: '요청수량',
            //         width: 25,
            //         align: 'right',
            //         style: 'text-align:center',
            //         dataIndex: 'plan_quan'
            //     },
            //     {
            //         text: '주문수량',
            //         width: 25,
            //         align: 'right',
            //         style: 'text-align:center',
            //         dataIndex: 'purchase_req_qty'
            //     },
            //     {
            //         text: '재고수량',
            //         width: 25,
            //         align: 'right',
            //         style: 'text-align:center',
            //         dataIndex: 'stock_qty'
            //     }
            // ],
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
            margin: '0 0 20 0',
            flex: 0.8,
            items: [gridDimension/** /, gridViewprop**/]
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

    producePlanOp: function () {

        var selection = gm.me().oneGrid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);

        var myWidth = 1100;
        var myHeight = 600;
        var isCalc = false;
        var standard_flag = selection.get('standard_flag');
        if(standard_flag === 'A') {
            var prodUnitGrid = Ext.create('Ext.grid.Panel', {
                cls: 'rfx-panel',
                store: new Ext.data.Store(),
                id: gu.id('prodUnitGrid'),
                autoScroll: true,
                autoHeight: true,
                collapsible: false,
                overflowY: 'scroll',
                multiSelect: false,
                width: '30%',
                autoScroll: true,
                title: '생산단위',
                plugins: {
                    ptype: 'cellediting',
                    clicksToEdit: 1,
                },
                margin: '10 0 0 0',
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
                        text: 'NO',
                        width: '15%',
                        dataIndex: 'proNumber',
                        style: 'text-align:center',
                        valueField: 'no',
                        align: 'center',
                        typeAhead: false,
                        allowBlank: false,
                        sortable: true,
                    },
                    {
                        text: '생산수량',
                        width: '40%',
                        xtype: 'numbercolumn',
                        dataIndex: 'proQuan',
                        style: 'text-align:center',
                        format: '0,000',
                        align: 'right',
                        typeAhead: false,
                        allowBlank: false,
                        sortable: true,
                        editor: {
                            xtype: 'numberfield',
                        }
                    }
                ],
                listeners: {
                    edit: function (editor, e, eOpts) {
                        var store = gu.getCmp('prodUnitGrid').getStore();
                        var previous_store = store.data.items;
                        var total_quan = 0;
                        console_logs('All Store Contents ??? ', previous_store);
                        for (var j = 0; j < previous_store.length; j++) {
                            var item = previous_store[j];
                            total_quan = Number(total_quan) + Number(item.get('proQuan'));
                        }
                        if (gu.getCmp('bm_quan').getValue() < total_quan) {
                            Ext.MessageBox.alert('', '생산수량은 생산요청량을 초과할 수 없습니다.');
                            for (var k = 0; k < previous_store.length; k++) {
                                secondRecord = gu.getCmp('prodUnitGrid').getStore().getAt(k);
                                secondRecord.set('proQuan', '');
                            }
                            // gu.getCmp('capaValue').setValue(selection.get('unit_mass'));
                            return;
                        } else {
                            // gu.getCmp('capaValue').setValue(total_quan);
                            isCalc = true;
                        }
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
                                text: '추가',
                                listeners: [{
                                    click: function () {
                                        console_logs('bm_quan >>>', gu.getCmp('bm_quan').getValue());
                                        if (gu.getCmp('bm_quan').getValue() === null || gu.getCmp('bm_quan').getValue() === 0) {
                                            Ext.MessageBox.alert('알림', '생산요청량을 입력해주시기 바랍니다.')
                                            return;
                                        } else {
                                            gm.me().addProUnit();
                                        }
                                    }
                                }]
                            },
                            {
                                text: gm.getMC('CMD_DELETE', '삭제'),
                                listeners: [{
                                    click: function () {
                                        var record = gu.getCmp('prodUnitGrid').getSelectionModel().getSelected().items[0];
                                        var store = gu.getCmp('prodUnitGrid').getStore();
                                        var workStore = gu.getCmp('workGrid').getStore();
                                        var proNumber = record.get('proNumber');
                                        var cnt = workStore.getCount();
                                        for (var i = cnt - 1; i >= 0; i--) {
                                            var rec = workStore.getAt(i);
                                            if (rec.get('workNumber') === proNumber) {
                                                workStore.removeAt(workStore.indexOf(rec));
                                            }
                                        }
                                        if (record == null) {
                                            store.remove(store.last());
                                        } else {
                                            store.removeAt(store.indexOf(record));
                                        }
                                        cnt = workStore.getCount();
                                        var cnt2 = store.getCount();
                                        for (var i = cnt2 - 1; i >= 0; i--) {
                                            var rec = store.getAt(i);
                                            if (rec.get('proNumber') > proNumber) {
                                                rec.set('proNumber', rec.get('proNumber') - 1);
                                            }
                                        }
                                        for (var i = cnt - 1; i >= 0; i--) {
                                            var rec = workStore.getAt(i);
                                            if (rec.get('workNumber') > proNumber) {
                                                rec.set('workNumber', rec.get('workNumber') - 1);
                                            }
                                        }
                                    }
                                }]
                            }
                        ]
                    })
                ]
            });
    
            var site = '';
            var pcs_group = '';
    
            var timeStore = Ext.create('Ext.data.Store', {
                fields: ['time', 'view'],
                data: [
                    {"time": "00:00", "view": "00:00"},
                    {"time": "01:00", "view": "01:00"},
                    {"time": "02:00", "view": "02:00"},
                    {"time": "03:00", "view": "03:00"},
                    {"time": "04:00", "view": "04:00"},
                    {"time": "05:00", "view": "05:00"},
                    {"time": "06:00", "view": "06:00"},
                    {"time": "07:00", "view": "07:00"},
                    {"time": "08:00", "view": "08:00"},
                    {"time": "09:00", "view": "09:00"},
                    {"time": "10:00", "view": "10:00"},
                    {"time": "11:00", "view": "11:00"},
                    {"time": "12:00", "view": "12:00"},
                    {"time": "13:00", "view": "13:00"},
                    {"time": "14:00", "view": "14:00"},
                    {"time": "15:00", "view": "15:00"},
                    {"time": "16:00", "view": "16:00"},
                    {"time": "17:00", "view": "17:00"},
                    {"time": "18:00", "view": "18:00"},
                    {"time": "19:00", "view": "19:00"},
                    {"time": "20:00", "view": "20:00"},
                    {"time": "21:00", "view": "21:00"},
                    {"time": "22:00", "view": "22:00"},
                    {"time": "23:00", "view": "23:00"},
                ]
            });
    
    
            var workGrid = Ext.create('Ext.grid.Panel', {
                store: new Ext.data.Store(),
                cls: 'rfx-panel',
                id: gu.id('workGrid'),
                collapsible: false,
                overflowY: 'scroll',
                multiSelect: false,
                width: '69%',
                autoScroll: true,
                plugins: {
                    ptype: 'cellediting',
                    clicksToEdit: 1,
                },
                margin: '10 0 0 40',
                autoHeight: true,
                frame: false,
                title: '작업반',
                border: false,
                layout: 'fit',
                forceFit: true,
                viewConfig: {
                    markDirty: false
                },
                columns: [
                    {
                        text: 'NO',
                        width: '15%',
                        dataIndex: 'workNumber',
                        style: 'text-align:center',
                        valueField: 'no',
                        align: 'center',
                        typeAhead: false,
                        allowBlank: false,
                        sortable: false
                    },
                    {
                        text: '라인',
                        width: '60%',
                        dataIndex: 'workGroup',
                        style: 'text-align:center',
                        typeAhead: false,
                        allowBlank: false,
                        sortable: false,
                        editor: {
                            xtype: 'combo',
                            store: Ext.create('Mplm.store.MachineStore', {}),
                            displayField: 'site_name',
                            valueField: 'name_ko',
                            editable: false,
                            listeners: {
                                expand: function () {
                                    var store = gu.getCmp('workGrid').getStore();
                                    var record = gu.getCmp('workGrid').getSelectionModel().getSelected().items[0];
                                    var index = store.indexOf(record);
                                    var selection = gm.me().oneGrid.getSelectionModel().getSelection();
                                    var rec = selection[0];
                                    console_logs('rec >>>>', rec);
                                    this.store.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');
    
                                    this.store.getProxy().setExtraParam('pcs_code', rec.get('product_group'));
    
                                    delete this.store.getProxy().getExtraParams()['parameter_name'];
                                    this.store.getProxy().setExtraParam('reserved_varchar3', 'PROD');
                                    this.store.load();
                                },
                                select: function (combo, rec) {
                                    // 이 부분에 CAPA와 시작예정일을 산출해야 함
                                    var store = gu.getCmp('workGrid').getStore();
                                    var record = gu.getCmp('workGrid').getSelectionModel().getSelected().items[0];
    
                                    site = rec.get('reserved_varchar2');
                                    pcs_group = rec.get('pcs_code');
    
                                    // 시작예정일과 종료일 산출
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=getCalcStartPlanBIOT',
                                        params: {
                                            line_code: rec.get('mchn_code')
                                        },
                                        success: function (result, request) {
                                            var result = result.responseText;
                                            var result_split = result.split("|", 2);
                                            var date = '';
                                            var time = '';
    
                                            var date_e = '';
                                            var time_e = '';
                                            if (result.length > 0) {
                                                console_logs('result ????', result);
                                                console_logs('date >>>>', result_split[0]);
                                                date = result_split[0];
                                                console_logs('time >>>>', result_split[1]);
                                                time = result_split[1];
                                                store.getAt(index).set('startDate', date);
                                                store.getAt(index).set('start_time', /**date + ' ' + **/time);
                                            } else {
                                                Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                            }
                                            var selectionRec = gm.me().oneGrid.getSelectionModel().getSelection();
                                            var recOther = selectionRec[0];
                                            var unit = gu.getCmp('prodUnitGrid').getStore().getAt(record.get('workNumber') - 1);
    
                                            console_logs('recOther', recOther);
                                            console_logs('bm_quan >>>>', recOther.get('unit_mass'));
                                            console_logs('start_date >>>>', result);
                                            console_logs('mchn_code', rec.get('mchn_code'));
                                            console_logs('item_code', selection.get('item_code'));
    
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                                waitMsg: '데이터를 처리중입니다.',
                                                params: {
                                                    item_code: selection.get('item_code'),
                                                    line_code: rec.get('mchn_code'),
                                                    bm_quan: unit.get('proQuan'),
                                                    start_date: date
                                                },
                                                success: function (result, request) {
                                                    var result = result.responseText;
                                                    console_logs('end_time_full >>>>', result);
                                                    var result_split_e = result.split("|", 2);
                                                    var date_e = result_split_e[0];
                                                    var time_e = result_split_e[1];
                                                    console_logs('end_time >>>>', time_e);
                                                    if (result.length > 0) {
                                                        store.getAt(index).set('endDate', date_e);
                                                        store.getAt(index).set('end_time', /**date_e + ' ' + **/time_e);
                                                    } else {
                                                        store.getAt(index).set('endDate', date);
                                                        store.getAt(index).set('end_time', /**date_e + ' ' + **/time);
                                                        // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                    }
    
                                                },//endofsuccess
                                                failure: function (result, request) {
                                                    var result = result.responseText;
                                                    Ext.MessageBox.alert('알림', result);
                                                }
                                            });
                                        },//endofsuccess
                                        failure: function (result, request) {
                                            var result = result.responseText;
                                            Ext.MessageBox.alert('알림', result);
                                        }
                                    });
    
                                    // CAPA 산출
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=getWorkCapa',
                                        params: {
                                            mchn_uid: rec.get('unique_id'),
                                            srcahd_uid: selection.get('unique_id_long')
                                        },
                                        success: function (result, request) {
                                            var result = result.responseText;
                                            if (result.length > 0) {
                                                console_logs('capa ????', result);
                                                if (result === 'N') {
                                                    store.getAt(index).set('workCapa', rec.get('target_qty'));
                                                } else {
                                                    store.getAt(index).set('workCapa', Number(result));
                                                }
                                            }
                                        },//endofsuccess
                                        failure: function (result, request) {
                                            var result = result.responseText;
                                            Ext.MessageBox.alert('알림', result);
                                        }
                                    });
    
                                    var index = store.indexOf(record);
                                    store.getAt(index).set('name_ko', rec.get('name_ko'));
                                    store.getAt(index).set('pcsmchn_uid', rec.get('unique_id_long'));
                                    // store.getAt(index).set('workCapa', rec.get('target_qty')); // Capa 산출
                                    store.getAt(index).set('mchn_code', rec.get('mchn_code'));
                                    store.getAt(index).set('work_site', site);
                                }
                            }
                        }
                    },
                    {
                        text: 'CAPA',
                        width: '40%',
                        id: gu.id('workCapa'),
                        xtype: 'numbercolumn',
                        dataIndex: 'workCapa',
                        style: 'text-align:center',
                        format: '0,000',
                        align: 'right',
                        typeAhead: false,
                        allowBlank: false,
                        sortable: true
                    },
                    {
                        text: '시작예정일',
                        width: '40%',
                        dataIndex: 'startDate',
                        style: 'text-align:center',
                        align: 'left',
                        typeAhead: false,
                        allowBlank: false,
                        sortable: true,
                        renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                        editor: {
                            xtype: 'datefield',
                            submitFormat: 'Y-m-d',
                            dateFormat: 'Y-m-d',
                            format: 'Y-m-d',
                            renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                            listeners: {
                                select: function (me) {
                                    var store = gu.getCmp('workGrid').getStore();
                                    var record = gu.getCmp('workGrid').getSelectionModel().getSelected().items[0];
                                    var index = store.indexOf(record);
                                    var unitStore = gu.getCmp('prodUnitGrid').getStore().getAt(record.get('workNumber') - 1);
                                    console_logs('unitStore ???', unitStore);
                                    var selectionRec = gm.me().grid.getSelectionModel().getSelection();
                                    var recOther = selectionRec[0];
                                    if (record.get('mchn_code') !== null) {
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                            waitMsg: '데이터를 처리중입니다.',
                                            params: {
                                                item_code: recOther.get('item_code'),
                                                line_code: record.get('mchn_code'),
                                                bm_quan: unitStore.get('proQuan'),
                                                start_date: me.getSubmitValue()
                                            },
                                            success: function (result, request) {
                                                var result = result.responseText;
                                                if (result.length > 0) {
                                                    var result_split_e = result.split('|', 2);
                                                    var date_e = result_split_e[0];
                                                    var time_e = result_split_e[1];
                                                    if (result.length > 0) {
                                                        store.getAt(index).set('endDate', date_e);
                                                        store.getAt(index).set('end_time', /**date_e + ' ' + **/time_e);
                                                    } else {
                                                        // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                        store.getAt(index).set('end_time', me.getSubmitValue());
                                                    }
                                                } else {
                                                    // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                    store.getAt(index).set('endDate', me.getSubmitValue());
                                                }
                                            },//endofsuccess
                                            failure: function (result, request) {
                                                var result = result.responseText;
                                                Ext.MessageBox.alert('알림', result);
                                            }
                                        });
                                    } else {
                                        Ext.MessageBox.alert('알림', '완료예정일을 계산하기 위한 값이 부적절하거나 정확히 입력되지 않았습니다.')
                                        store.removeAt(store.indexOf(record));
                                    }
                                }
                            }
                        },
                    },
                    {
                        text: '시작시간',
                        width: '40%',
                        // xtype: 'datecolumn',
                        // format: 'H:i',
                        dataIndex: 'start_time',
                        style: 'text-align:center',
                        align: 'left',
                        typeAhead: false,
                        allowBlank: false,
                        sortable: true,
                        // renderer: Ext.util.Format.dateRenderer('H:i:s'),
                        editor: {
                            xtype: 'combo',
                            store: timeStore,
                            displayField: 'view',
                            valueField: 'time',
                            // format: 'H:i',
                            // increment: 60,
                            anchor: '50%',
                            // value: gm.me().getThirtyMinites(new Date()),
                            // increment: 60,
                            // anchor: '50%',
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    // gm.me().setRefDate();
                                }
                            }
                        }
                    },
                    {
                        text: '완료예정일',
                        width: '40%',
                        dataIndex: 'endDate',
                        style: 'text-align:center',
                        align: 'left',
                        typeAhead: false,
                        allowBlank: false,
                        sortable: true,
                        renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                        listeners: {}
                    },
                    {
                        text: '완료시간',
                        width: '40%',
                        // xtype: 'datecolumn',
                        // format: 'H:i',
                        dataIndex: 'end_time',
                        style: 'text-align:center',
                        align: 'left',
                        typeAhead: false,
                        allowBlank: false,
                        sortable: true,
                        // renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                        editor: {
                            xtype: 'combo',
                            store: timeStore,
                            displayField: 'view',
                            valueField: 'time',
                            format: 'H:i',
                            increment: 60,
                            anchor: '50%',
                            // value: gm.me().getThirtyMinites(new Date()),
                            increment: 60,
                            anchor: '50%',
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    // gm.me().setRefDate();
                                }
                            }
                        }
                    },
                ],
                listeners: {},
                autoScroll: true
            });
    
            var form = Ext.create('Ext.form.Panel', {
                xtype: 'form',
                frame: false,
                border: false,
                autoScroll: true,
                bodyPadding: 10,
                region: 'center',
                layout: 'vbox',
                width: myWidth,
                height: myHeight - 10,
                items: [
                    {
                        xtype: 'container',
                        width: '100%',
                        defaults: {
                            width: '47%',
                            padding: '3 3 3 20'
                        },
                        border: true,
                        layout: 'column',
                        items: [
                            {
                                fieldLabel: '품번',
                                xtype: 'textfield',
                                name: 'line_item_code',
                                allowBlank: false,
                                fieldStyle: 'background-color: #ddd; background-image: none;',
                                id: gu.id('item_code'),
                                editable: false,
                                value: selection.get('item_code')
                            },
                            {
                                fieldLabel: '품명',
                                xtype: 'textfield',
                                name: 'line_code',
                                allowBlank: false,
                                fieldStyle: 'background-color: #ddd; background-image: none;',
                                id: gu.id('line_code'),
                                editable: false,
                                value: selection.get('item_name')
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        width: '100%',
                        defaults: {
                            width: '47%',
                            padding: '3 3 3 20'
                        },
                        border: true,
                        layout: 'column',
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'bm_quan_disp',
                                id: gu.id('bm_quan'),
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '생산요청량',
                                hideTrigger: false,
                                // fieldStyle: 'background-color: #ddd; background-image: none;',
                                keyNavEnabled: true,
                                mouseWheelEnabled: true,
                                editable: true,
                                value : selection.get('produce_order_qty'),
                                listeners: {
                                    change: function () {
                                        var store = gu.getCmp('prodUnitGrid').getStore();
                                        store.getAt(0).set('proQuan', gu.getCmp('bm_quan').getValue());
                                        // gu.getCmp('capaValue').setValue(gu.getCmp('bm_quan').getValue());
                                    }
                                }
                            },
                            // {
                            //     xtype: 'numberfield',
                            //     id: gu.id('capaValue'),
                            //     name: 'capaValue',
                            //     fieldLabel: '총 수량',
                            //     hideTrigger: true,
                            //     fieldStyle: 'background-color: #ddd; background-image: none;font-align:right',
                            //     keyNavEnabled: false,
                            //     mouseWheelEnabled: false,
                            //     allowBlank: false,
                            //     editable: false
                            // }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        width: '99%',
                        margin: '3 3 3 3',
                        items: [
                            prodUnitGrid,
                            workGrid
                        ]
                    }
                ]
            });
    
            var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: '반제품 생산계획수립',
                width: myWidth,
                height: myHeight,
                items: form,
                buttons: [
                    {
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == 'no') {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    // 생산단위 JSON 
                                    var siteArr = [];
                                    var mchnCodeArr = [];
                                    var startDateArr = [];
                                    var storeData1 = gu.getCmp('prodUnitGrid').getStore();
                                    var objs = [];
                                    var columns = [];
                                    var obj = {};
                                    for (var i = 0; i < storeData1.data.items.length; i++) {
                                        var item = storeData1.data.items[i];
                                        var objv = {};
                                        objv['proNumber'] = item.get('proNumber');
                                        objv['proQuan'] = item.get('proQuan');
                                        columns.push(objv);
                                    }
    
                                    obj['units'] = columns;
                                    objs.push(obj);
                                    var jsonData1 = Ext.util.JSON.encode(objs);
    
                                    // 작업반 JSON
                                    var storeData2 = gu.getCmp('workGrid').getStore();
                                    var objs1 = [];
                                    var columns1 = [];
                                    var obj1 = {};
                                    for (var i = 0; i < storeData2.data.items.length; i++) {
                                        var item = storeData2.data.items[i];
                                        var objv1 = {};
                                        objv1['workNumber'] = item.get('workNumber');
                                        objv1['workGroup'] = item.get('workGroup');
                                        objv1['workCapa'] = item.get('workCapa');
                                        objv1['startDate'] = item.get('startDate');
                                        objv1['startTime'] = item.get('start_time');
                                        objv1['endDate'] = item.get('endDate');
                                        objv1['endTime'] = item.get('end_time');
                                        objv1['pcsmchn_uid'] = item.get('pcsmchn_uid');
                                        columns1.push(objv1);
                                        siteArr.push(item.get('work_site'));
                                        mchnCodeArr.push(item.get('mchn_code'));
                                        startDateArr.push(item.get('startDate'));
                                    }
    
                                    obj1['plan'] = columns1;
                                    objs1.push(obj1);
                                    var jsonData2 = Ext.util.JSON.encode(objs1);
                                    console_logs('jsonData2', jsonData2);
    
                                    console_logs('json1.length...', jsonData1.lenth);
                                    console_logs('json2.length...', jsonData2.lenth);
    
                                    if (jsonData1 != null && jsonData2 != null) {
                                        form.submit({
                                            submitEmptyText: false,
                                            url: CONTEXT_PATH + '/index/process.do?method=addAssemblyProductionManual',
                                            waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                            params: {
                                                bm_quan: gu.getCmp('bm_quan').getValue(),
                                                prd_group: selection.get('product_group'),
                                                assymap_uid: selection.get('assymap_uid'),
                                                srcahd_uid: selection.get('srcahd_uid'),
                                                item_code: selection.get('item_code'),
                                                jsonData1: jsonData1,
                                                jsonData2: jsonData2,
                                                pcs_group: pcs_group,
                                                siteArr: siteArr,
                                                mchnCodeArr: mchnCodeArr,
                                                startDateArr: startDateArr
                                            },
                                            success: function (val, action) {
                                                console_logs('OK', 'PROCESS OK');
                                                if (prWin) {
                                                    Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                                    prWin.close();
                                                    gm.me().consumeRateAssy.load();
                                                }
                                            },
                                            failure: function () {
                                                // console_logs('결과 ???', action);
                                                prWin.setLoading(false);
                                                Ext.MessageBox.alert('에러', '데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.')
                                                // extjsUtil.failureMessage();
                                                if (prWin) {
                                                    // Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                                    prWin.close();
                                                    gm.me().store.load();
                                                }
                                            }
                                        });
                                    } else {
                                        Ext.MessageBox.alert('', '생산수량 또는 작업반이 정확히 입력되지 않았습니다.')
                                    }
                                }
                            }
                        }
                    },
                    {
                        text: CMD_CANCEL,
                        scope: this,
                        handler: function () {
                            Ext.MessageBox.alert(
                                '알림',
                                '취소 할 시 입력한 모든정보가 저장되지 않습니다.<br>그래도 취소하시겠습니까?',
                                function () {
                                    console_logs('취소', '취소');
                                    if (prWin) {
                                        prWin.close();
                                    }
                                }
                            )
                        }
                    }
                ]
            });
    
            gm.me().addProUnitFirst();
    
            prWin.show();
        } else {
            Ext.MessageBox.alert('알림','제품이 아닌 자재가 선택되었습니다.<br>다시 확인해주세요.')
        }
        
    },

    addProUnitFirst: function () {
        var store = gu.getCmp('prodUnitGrid').getStore();
        var selection = gm.me().oneGrid.getSelectionModel().getSelection();
        var rec = selection[0];
        var cnt = store.getCount() + 1;

        store.insert(store.getCount(), new Ext.data.Record({
            'proNumber': cnt,
            'proQuan': rec.get('produce_order_qty')
        }));

        var workStore = gu.getCmp('workGrid').getStore();

        workStore.insert(workStore.getCount(), new Ext.data.Record({
            'workNumber': cnt,
            'workCapa': 0,
            'startDate': null,
            'endDate': null,
            'start_time': null,
            'end_time': null,
            'pcsmchn_uid': null,
            'mchn_code': null,
            'work_site': null
        }));

        // workStore.insert(workStore.getCount(), new Ext.data.Record({
        //     'workNumber': cnt,
        //     'workCapa': 0,
        //     'startDate': null,
        //     'endDate': null,
        //     'start_time' : null,
        //     'end_time' : null,
        //     'pcsmchn_uid': null,
        //     'mchn_code' : null
        // }));
    },



});