Ext.define('Rfx2.view.company.bioprotech.produceMgmt.ProduceMgmtAssyDetailView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'contract-material-view',


    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //this.addSearchField('unique_id');
        this.setDefComboValue('standard_flag', 'valueField', 'R');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        (buttonToolbar.items).each(function (item, index, length) {
            if (index !== 0) {
                buttonToolbar.remove(item);
            }
        });


        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        this.createStore('Rfx2.model.company.bioprotech.ProductMgmtAssy', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );
        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.salesPriceListStore = Ext.create('Rfx2.store.company.bioprotech.SalesPriceMgmtStore', {pageSize: 100000});
        // this.salesPriceByCompanyListStore = Ext.create('Rfx2.store.company.bioprotech.SalesPriceMgmtStore', { pageSize: 100000 });
        this.salesPriceByCompanyListStore = Ext.create('Rfx2.store.company.bioprotech.AanalysisBomStore', {pageSize: 100000});


        this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('prEstablishAction'),
            handler: function () {
                gm.me().producePlanOp();
            }
        });

        this.packageEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Repackaging_Order', '재포장계획수립'),
            tooltip: '재포장 계획을 수립합니다',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('packageEstablishAction'),
            handler: function () {
                gm.me().packagePlanOp();
            }
        });


        this.prEstablishActionOrder = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('prEstablishActionOrder'),
            handler: function () {
                var rec = gm.me().gridContractMaterial.getSelection()[0];
                // var bm_quan = rec.get('produce_request_quan');
                // var status = rec.get('reserved2');
                // var bm_quan_percent = bm_quan * 0.05;
                // var compareQuan = bm_quan + bm_quan_percent;
                // var pr_quan = rec.get('pr_quan');
                // console_logs('compareQuan', compareQuan);
                // console_logs('pr_quan', pr_quan);
                // if (status === 'Y') {
                //     Ext.MessageBox.show({
                //         title: '알림',
                //         msg: '이미 생산요청이 되었습니다.<br>그래도 진행하시겠습니까?',
                //         buttons: Ext.MessageBox.YESNO,
                //         icon: Ext.MessageBox.QUESTION,
                //         fn: function (btn) {
                //             if (btn == "no") {
                //                 return;
                //             } else {
                //                 gm.me().producePlanOpByOrder();
                //             }
                //         }
                //     });
                // } else if (compareQuan < pr_quan) {
                // Ext.MessageBox.show({
                //     title: '알림',
                //     msg: '요청잔량보다 큰 수량이 입력되었습니다<br>그래도 진행하시겠습니까?',
                //     buttons: Ext.MessageBox.YESNO,
                //     icon: Ext.MessageBox.QUESTION,
                //     fn: function (btn) {
                //         if (btn == "no") {
                //             return;
                //         } else {
                //             gm.me().producePlanOpByOrder();
                //         }
                //     }
                // });
                // Ext.MessageBox.alert('zzzzz','zzzzzz');
                // } else if (pr_quan === 0) {
                //     Ext.MessageBox.alert('알림', '요청수량이 0이 입력되었습니다.');
                // } else {
                gm.me().producePlanOpByOrder();
                // }

            }
        });


        this.packageEstablishOrder = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Repackaging_Order', '재포장계획수립'),
            tooltip: '재포장 계획을 수립합니다',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('packageEstablishOrder'),
            handler: function () {
                var rec = gm.me().gridContractMaterial.getSelection()[0];
                // var bm_quan = rec.get('produce_request_quan');
                // var status = rec.get('reserved2');
                // var bm_quan_percent = bm_quan * 0.05;
                // var compareQuan = bm_quan + bm_quan_percent;
                // var pr_quan = rec.get('pr_quan');
                // console_logs('compareQuan', compareQuan);
                // console_logs('pr_quan', pr_quan);
                // if (status === 'Y') {
                //     Ext.MessageBox.show({
                //         title: '알림',
                //         msg: '이미 요청이 되었습니다.<br>그래도 진행하시겠습니까?',
                //         buttons: Ext.MessageBox.YESNO,
                //         icon: Ext.MessageBox.QUESTION,
                //         fn: function (btn) {
                //             if (btn == "no") {
                //                 return;
                //             } else {
                //                 gm.me().packagePlanOpByOrder();
                //             }
                //         }
                //     });
                // } else if (compareQuan < pr_quan) {
                //     Ext.MessageBox.show({
                //         title: '알림',
                //         msg: '요청잔량보다 큰 수량이 입력되었습니다<br>그래도 진행하시겠습니까?',
                //         buttons: Ext.MessageBox.YESNO,
                //         icon: Ext.MessageBox.QUESTION,
                //         fn: function (btn) {
                //             if (btn == "no") {
                //                 return;
                //             } else {
                //                 gm.me().packagePlanOpByOrder();
                //             }
                //         }
                //     });
                //     // Ext.MessageBox.alert('zzzzz','zzzzzz');
                // } else if (pr_quan === 0) {
                //     Ext.MessageBox.alert('알림', '요청수량이 0이 입력되었습니다.');
                // } else {
                gm.me().packagePlanOpByOrder();
                //     }
            }
        });


        this.gridContractMaterial = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractMaterial'),
            store: this.salesPriceByCompanyListStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            frame: true,
            //bbar: getPageToolbar(this.poCartListStore),
            border: true,
            layout: 'fit',
            forceFit: false,
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
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('selectedCompany'),
                            html: this.getMC('msg_sales_price_description2', '해당 수주번호를 선택하십시오.'),
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.prEstablishActionOrder,
                        this.packageEstablishOrder
                    ]
                }
            ],
            columns: [
                // { text: this.getMC('msg_product_add_search_field1', '요청여부'), width: 80, style: 'text-align:center', dataIndex: 'assyProduct_request', sortable: true },
                {
                    text: this.getMC('msg_product_add_search_field1', '품번'),
                    width: 150,
                    style: 'text-align:center',
                    dataIndex: 'item_code',
                    sortable: true
                },
                {
                    text: this.getMC('msg_product_add_search_field2', '품명'),
                    width: 200,
                    style: 'text-align:center',
                    dataIndex: 'item_name',
                    sortable: true
                },
                // { 
                //     text: this.getMC('msg_order_grid_prd_desc', '요청잔량'), 
                //     width: 100, 
                //     style: 'text-align:center', 
                //     align: 'right',
                //     dataIndex: 'produce_request_quan', 
                //     sortable: true,
                //     renderer: function (value, context, tmeta) {
                //         return Ext.util.Format.number(value, '0,00/i');
                //     },
                // },
                {
                    text: '요청수량',
                    width: 100,
                    dataIndex: 'pr_quan',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    editor: 'numberfield',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },

            ],
            title: this.getMC('msg_sales_price_description', '반제품 리스트'),
            name: 'po',
            autoScroll: true,
            listeners: {}
        });


        Ext.each(this.gridContractMaterial.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'pr_quan':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }
            switch (dataIndex) {
                case 'pr_quan':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    };
                    break;
                default:
                    break;
            }
        });


        this.gridContractMaterial.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {
                    console_logs('selections', selections);
                    gm.me().prEstablishActionOrder.enable();
                    gm.me().packageEstablishOrder.enable();
                } else {
                    gm.me().prEstablishActionOrder.disable();
                    gm.me().packageEstablishOrder.disable();
                }
            }
        });

        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        this.grid.flex = 1;

        this.newButtonToolBar = buttonToolbar;
        this.newSearchToolBar = searchToolbar;

        this.produceStore = Ext.create('Mplm.store.ProduceMgmtStore', {pageSize: 100});
        this.produceStore.sorters.removeAll();

        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var wa_name = '';

                    if (Ext.getCmp('wa_name').getValue().length > 0) {
                        reserved_varcharh = Ext.getCmp('wa_name').getValue();
                    }
                } catch (e) {

                }
                gm.me().produceStore.getProxy().setExtraParam('wa_name', '%' + wa_name + '%');
                gm.me().produceStore.load();
            }
        });

        this.twoGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('twoGrid'),
            selModel: 'checkboxmodel',
            store: this.produceStore,
            columns: [
                {
                    text: this.getMC('msg_order_dia_order_customer', '수주번호'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'orderNo'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '고객사'),
                    width: 150,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'wa_name'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '최종고객사'),
                    width: 150,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'final_wa_name'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '품번'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_code'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '품명'),
                    width: 150,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '생산요청량'),
                    width: 100,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'assymap_bm_quan',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                }
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.purListSrch,
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
                    items: [{
                        xtype: 'triggerfield',
                        emptyText: this.getMC('msg_order_dia_order_customer', '고객사'),
                        id: gu.id('wa_name'),
                        width: 130,
                        fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                        name: 'query_sup',
                        listeners: {
                            specialkey: function (field, e) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().produceStore.getProxy().setExtraParam('wa_name', '%' + gu.getCmp('wa_name').getValue() + '%');
                                    gm.me().produceStore.load(function () {
                                    });
                                }
                            }
                        },
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        'onTrigger1Click': function () {
                            gu.getCmp('wa_name').setValue('');
                            this.produceStore.getProxy().setExtraParam('wa_name', gu.getCmp('wa_name').getValue());
                            this.produceStore.load(function () {
                            });
                        }
                    }]
                }
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.produceStore,
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
            listeners: {}
        });

        this.produceStore.load();

        var leftContainer = new Ext.container.Container({
            title: this.getMC('msg_sales_price_tab1', '자재기준'),
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                this.grid
            ]
        });


        this.twoGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                // gm.me().removeContractMatAction.disable();
                if (selections.length) {
                    var rec = selections[0];
                    console_logs('rec >>', rec);
                    var ac_uid = rec.get('ac_uid');
                    var child = rec.get('child');
                    // gm.me().salesPriceByCompanyListStore.getProxy().setExtraParam('ac_uid', ac_uid);
                    gm.me().salesPriceByCompanyListStore.getProxy().setExtraParam('ver_child', child);
                    gm.me().salesPriceByCompanyListStore.getProxy().setExtraParam('standard_flag', 'A');
                    gm.me().salesPriceByCompanyListStore.load(function (record) {
                    });
                    gu.getCmp('selectedCompany').setHtml('<font color=yellow>[' + rec.get('pj_code') + '-' + rec.get('pl_no') + '  ' + '(' + rec.get('wa_name') + ')]</font> ' + rec.get('item_code') + ' / ' + rec.get('item_name'));
                } else {

                }
            }
        });

        var rightContainer = new Ext.container.Container({
            title: this.getMC('msg_sales_price_tab2', '수주기준'),
            region: 'center',
            layout: {
                type: 'border'
            },
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [this.twoGrid]
                },
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [this.gridContractMaterial]
                }
            ]
        });

        var mainTab = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [leftContainer, rightContainer]
        });

        Ext.apply(this, {
            layout: 'border',
            items: mainTab
        });

        //버튼 추가.

        this.callParent(arguments);
        buttonToolbar.insert(1, this.prEstablishAction);
        buttonToolbar.insert(2, this.packageEstablishAction);
        // buttonToolbar.insert('->', this.downloadSheetAction);
        // buttonToolbar.insert(5, this.downloadSheetAction);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                this.prEstablishAction.enable();
                this.packageEstablishAction.enable();
            } else {
                this.prEstablishAction.disable();
                this.packageEstablishAction.disable();
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('existSalesPrice', 'true');
        this.store.load(function (records) {

        });
    },


    editRedord: function (field, rec) {

        switch (field) {
            case 'sort_order':
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=updateSortOrder',
                    params: {
                        srcmap_uid: rec.get('unique_id'),
                        srcahd_uid: rec.get('srcahd_uid'),
                        sort_order: rec.get('sort_order')
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
                break;
            default:
                gm.editRedord(field, rec);
        }
    },


    producePlanOp: function () {

        var selection = this.grid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);

        var myWidth = 1100;
        var myHeight = 600;
        var isCalc = false;

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
                                var selection = gm.me().grid.getSelectionModel().getSelection();
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
                                        var selectionRec = gm.me().grid.getSelectionModel().getSelection();
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
                                            srcahd_uid: selection.get('unique_id_long'),
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
                                                gm.me().store.load();
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
    },


    producePlanOpByOrder: function () {

        var selection = gm.me().gridContractMaterial.getSelectionModel().getSelection()[0];
        var twoGridSelection = gm.me().twoGrid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);

        var myWidth = 1100;
        var myHeight = 600;
        var isCalc = false;


        var prodUnitGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: new Ext.data.Store(),
            id: gu.id('prodUnitGridOrder'),
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
                    var store = gu.getCmp('prodUnitGridOrder').getStore();
                    var previous_store = store.data.items;
                    var total_quan = 0;
                    console_logs('All Store Contents ??? ', previous_store);
                    for (var j = 0; j < previous_store.length; j++) {
                        var item = previous_store[j];
                        total_quan = Number(total_quan) + Number(item.get('proQuan'));
                    }
                    if (gu.getCmp('bm_quan_order').getValue() < total_quan) {
                        Ext.MessageBox.alert('', '생산수량은 생산요청량을 초과할 수 없습니다.');
                        for (var k = 0; k < previous_store.length; k++) {
                            secondRecord = gu.getCmp('prodUnitGridOrder').getStore().getAt(k);
                            secondRecord.set('proQuan', '');
                        }
                        gu.getCmp('capaValueOrder').setValue(selection.get('unit_mass'));
                        return;
                    } else {
                        gu.getCmp('capaValueOrder').setValue(total_quan);
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
                                    console_logs('bm_quan >>>', gu.getCmp('bm_quan_order').getValue());
                                    if (gu.getCmp('bm_quan_order').getValue() === null || gu.getCmp('bm_quan_order').getValue() === 0) {
                                        Ext.MessageBox.alert('알림', '생산요청량을 입력해주시기 바랍니다.')
                                        return;
                                    } else {
                                        gm.me().addProUnitOrder();
                                    }
                                }
                            }]
                        },
                        {
                            text: gm.getMC('CMD_DELETE', '삭제'),
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('prodUnitGridOrder').getSelectionModel().getSelected().items[0];
                                    var store = gu.getCmp('prodUnitGridOrder').getStore();
                                    var workStore = gu.getCmp('workGridOrder').getStore();
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
            id: gu.id('workGridOrder'),
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
                                var store = gu.getCmp('workGridOrder').getStore();
                                var record = gu.getCmp('workGridOrder').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var selection = gm.me().gridContractMaterial.getSelectionModel().getSelection();
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
                                var store = gu.getCmp('workGridOrder').getStore();
                                var record = gu.getCmp('workGridOrder').getSelectionModel().getSelected().items[0];
                                // var twoGrid = gm.me().twoGrid.getSelectionModel().getSelection()[0];
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
                                        var selectionRec = gm.me().gridContractMaterial.getSelectionModel().getSelection();
                                        var recOther = selectionRec[0];
                                        var unit = gu.getCmp('prodUnitGridOrder').getStore().getAt(record.get('workNumber') - 1);

                                        console_logs('recOther', recOther);
                                        console_logs('bm_quan >>>>', recOther.get('pr_quan'));
                                        console_logs('start_date >>>>', result);
                                        console_logs('mchn_code', rec.get('mchn_code'));
                                        console_logs('item_code', recOther.get('item_code'));

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                            waitMsg: '데이터를 처리중입니다.',
                                            params: {
                                                item_code: recOther.get('item_code'),
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
                                                    Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
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
                                        srcahd_uid: selection.get('srcahd_uid')
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
                                var store = gu.getCmp('workGridOrder').getStore();
                                var record = gu.getCmp('workGridOrder').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var unitStore = gu.getCmp('prodUnitGridOrder').getStore().getAt(record.get('workNumber') - 1);
                                console_logs('unitStore ???', unitStore);
                                var selectionRec = gm.me().gridContractMaterial.getSelectionModel().getSelection();
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
                                                    store.getAt(index).set('end_time', me.getSubmitValue());
                                                }
                                            } else {
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
            ],
            listeners: {},
            autoScroll: true
        });

        var formOrder = Ext.create('Ext.form.Panel', {
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
                            id: gu.id('bm_quan_order'),
                            value: selection.get('pr_quan'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '생산요청량',
                            hideTrigger: false,
                            // fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            editable: false,
                            listeners: {
                                change: function () {
                                    // gu.getCmp('capaValue').setValue(gu.getCmp('bm_quan').getValue());
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            id: gu.id('capaValueOrder'),
                            name: 'capaValue',
                            // value : selection.get('pr_quan'),
                            fieldLabel: '총 수량',
                            hideTrigger: true,
                            fieldStyle: 'background-color: #ddd; background-image: none;font-align:right',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            allowBlank: false,
                            editable: false
                        }
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
            items: formOrder,
            buttons: [
                {
                    text: '확인',
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            // if (formOrder.isValid()) {
                            console_logs('zzzzzzOK')
                            // 생산단위 JSON 
                            var siteArr = [];
                            var mchnCodeArr = [];
                            var startDateArr = [];
                            var storeData1 = gu.getCmp('prodUnitGridOrder').getStore();
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
                            var storeData2 = gu.getCmp('workGridOrder').getStore();
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
                                gm.me().loding_msg();
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=addAssemblyProductionManualOrder',
                                    waitMsg: '데이터를 처리중입니다.',
                                    params: {
                                        bm_quan: gu.getCmp('bm_quan_order').getValue(),
                                        prd_group: selection.get('product_group'),
                                        assymap_uid: -1,
                                        project_uid: selection.get('ac_uid'),
                                        srcahd_uid: selection.get('child'),
                                        item_code: selection.get('item_code'),
                                        jsonData1: jsonData1,
                                        jsonData2: jsonData2,
                                        pcs_group: pcs_group,
                                        siteArr: siteArr,
                                        mchnCodeArr: mchnCodeArr,
                                        project_code: twoGridSelection.get('pj_code'),
                                        pl_no: twoGridSelection.get('pl_no'),
                                        final_buyer_uid: twoGridSelection.get('reserved_number3'),
                                        startDateArr: startDateArr
                                    },
                                    success: function (result, request) {
                                        console_logs('OK', 'PROCESS OK');
                                        if (prWin) {
                                            Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                            prWin.close();
                                            gm.me().store.load();
                                            gm.me().salesPriceByCompanyListStore.load();
                                        }
                                    },//endofsuccess
                                    failure: function (result, request) {
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

        gm.me().addProUnitFirstOrder();

        prWin.show();
    },


    packagePlanOpByOrder: function () {

        var selection = gm.me().gridContractMaterial.getSelectionModel().getSelection()[0];
        var twoGridSelection = gm.me().twoGrid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);

        var myWidth = 1100;
        var myHeight = 600;
        var isCalc = false;


        var prodUnitGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: new Ext.data.Store(),
            id: gu.id('packageUnitGridOrder'),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '30%',
            autoScroll: true,
            title: '포장단위',
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
                    var store = gu.getCmp('packageUnitGridOrder').getStore();
                    var previous_store = store.data.items;
                    var total_quan = 0;
                    console_logs('All Store Contents ??? ', previous_store);
                    for (var j = 0; j < previous_store.length; j++) {
                        var item = previous_store[j];
                        total_quan = Number(total_quan) + Number(item.get('proQuan'));
                    }
                    if (gu.getCmp('bm_quan_order').getValue() < total_quan) {
                        Ext.MessageBox.alert('', '작업수량은 작업요청량을 초과할 수 없습니다.');
                        for (var k = 0; k < previous_store.length; k++) {
                            secondRecord = gu.getCmp('prodUnitGridOrder').getStore().getAt(k);
                            secondRecord.set('proQuan', '');
                        }
                        gu.getCmp('capaValueOrder').setValue(selection.get('unit_mass'));
                        return;
                    } else {
                        gu.getCmp('capaValueOrder').setValue(total_quan);
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
                                    console_logs('bm_quan >>>', gu.getCmp('bm_quan_order').getValue());
                                    if (gu.getCmp('bm_quan_order').getValue() === null || gu.getCmp('bm_quan_order').getValue() === 0) {
                                        Ext.MessageBox.alert('알림', '작업요청량을 입력해주시기 바랍니다.')
                                        return;
                                    } else {
                                        gm.me().addPackageUnitOrder();
                                    }
                                }
                            }]
                        },
                        {
                            text: gm.getMC('CMD_DELETE', '삭제'),
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('packageUnitGridOrder').getSelectionModel().getSelected().items[0];
                                    var store = gu.getCmp('packageUnitGridOrder').getStore();
                                    var workStore = gu.getCmp('packageWorkGridOrder').getStore();
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
            id: gu.id('packageWorkGridOrder'),
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
                                var store = gu.getCmp('packageWorkGridOrder').getStore();
                                var record = gu.getCmp('packageWorkGridOrder').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var selection = gm.me().gridContractMaterial.getSelectionModel().getSelection();
                                var rec = selection[0];
                                console_logs('rec >>>>', rec);
                                this.store.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');

                                this.store.getProxy().setExtraParam('pcs_code', rec.get('product_group'));

                                delete this.store.getProxy().getExtraParams()['parameter_name'];
                                this.store.getProxy().setExtraParam('reserved_varchar3', 'PKG');
                                this.store.load();
                            },
                            select: function (combo, rec) {
                                // 이 부분에 CAPA와 시작예정일을 산출해야 함
                                var store = gu.getCmp('packageWorkGridOrder').getStore();
                                var record = gu.getCmp('packageWorkGridOrder').getSelectionModel().getSelected().items[0];
                                // var twoGrid = gm.me().twoGrid.getSelectionModel().getSelection()[0];
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
                                        var selectionRec = gm.me().gridContractMaterial.getSelectionModel().getSelection();
                                        var recOther = selectionRec[0];
                                        var unit = gu.getCmp('packageUnitGridOrder').getStore().getAt(record.get('workNumber') - 1);

                                        console_logs('recOther', recOther);
                                        console_logs('bm_quan >>>>', recOther.get('pr_quan'));
                                        console_logs('start_date >>>>', result);
                                        console_logs('mchn_code', rec.get('mchn_code'));
                                        console_logs('item_code', recOther.get('item_code'));

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                            waitMsg: '데이터를 처리중입니다.',
                                            params: {
                                                item_code: recOther.get('item_code'),
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
                                                    Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
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
                                        srcahd_uid: selection.get('srcahd_uid')
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
                                var store = gu.getCmp('packageWorkGridOrder').getStore();
                                var record = gu.getCmp('packageWorkGridOrder').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var unitStore = gu.getCmp('packageUnitGridOrder').getStore().getAt(record.get('workNumber') - 1);
                                console_logs('unitStore ???', unitStore);
                                var selectionRec = gm.me().gridContractMaterial.getSelectionModel().getSelection();
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
                                                    store.getAt(index).set('end_time', me.getSubmitValue());
                                                }
                                            } else {
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
                    editor: {
                        xtype: 'combo',
                        store: timeStore,
                        displayField: 'view',
                        valueField: 'time',
                        // format: 'H:i',
                        // increment: 60,
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

        var formOrder = Ext.create('Ext.form.Panel', {
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
                            id: gu.id('bm_quan_order'),
                            value: selection.get('pr_quan'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '작업요청량',
                            hideTrigger: false,
                            // fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            editable: false,
                            listeners: {
                                change: function () {
                                    // gu.getCmp('capaValue').setValue(gu.getCmp('bm_quan').getValue());
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            id: gu.id('capaValueOrder'),
                            name: 'capaValue',
                            // value : selection.get('pr_quan'),
                            fieldLabel: '총 수량',
                            hideTrigger: true,
                            fieldStyle: 'background-color: #ddd; background-image: none;font-align:right',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            allowBlank: false,
                            editable: false
                        }
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
            title: gm.getMC('CMD_Repackaging_Order', '재포장계획수립'),
            width: myWidth,
            height: myHeight,
            items: formOrder,
            buttons: [
                {
                    text: '확인',
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            // if (formOrder.isValid()) {
                            // 생산단위 JSON 
                            var siteArr = [];
                            var mchnCodeArr = [];
                            var startDateArr = [];
                            var storeData1 = gu.getCmp('packageUnitGridOrder').getStore();
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
                            var storeData2 = gu.getCmp('packageWorkGridOrder').getStore();
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
                                gm.me().loding_msg();
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=addAssemblyPackageManualOrder',
                                    waitMsg: '데이터를 처리중입니다.',
                                    params: {
                                        bm_quan: gu.getCmp('bm_quan_order').getValue(),
                                        prd_group: selection.get('product_group'),
                                        assymap_uid: -1,
                                        project_uid: selection.get('ac_uid'),
                                        srcahd_uid: selection.get('child'),
                                        item_code: selection.get('item_code'),
                                        jsonData1: jsonData1,
                                        jsonData2: jsonData2,
                                        pcs_group: pcs_group,
                                        siteArr: siteArr,
                                        mchnCodeArr: mchnCodeArr,
                                        project_code: twoGridSelection.get('pj_code'),
                                        pl_no: twoGridSelection.get('pl_no'),
                                        final_buyer_uid: twoGridSelection.get('reserved_number3'),
                                        startDateArr: startDateArr
                                    },
                                    success: function (result, request) {
                                        console_logs('OK', 'PROCESS OK');
                                        if (prWin) {
                                            Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                            prWin.close();
                                            gm.me().store.load();
                                            gm.me().salesPriceByCompanyListStore.load();
                                        }
                                    },//endofsuccess
                                    failure: function (result, request) {
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

        gm.me().addPackageUnitFirstOrder();

        prWin.show();
    },


    packagePlanOp: function () {
        var selection = this.grid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);
        var myWidth = 1100;
        var myHeight = 600;
        var isCalc = false;
        var prodUnitGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: new Ext.data.Store(),
            id: gu.id('packageUnitGrid'),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '30%',
            autoScroll: true,
            title: '포장단위',
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
                    text: '작업수량',
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
                    var store = gu.getCmp('packageUnitGrid').getStore();
                    var previous_store = store.data.items;
                    var total_quan = 0;
                    console_logs('All Store Contents ??? ', previous_store);
                    for (var j = 0; j < previous_store.length; j++) {
                        var item = previous_store[j];
                        total_quan = Number(total_quan) + Number(item.get('proQuan'));
                    }
                    if (gu.getCmp('bm_quan').getValue() < total_quan) {
                        Ext.MessageBox.alert('', '작업수량은 작업요청량을 초과할 수 없습니다.');
                        for (var k = 0; k < previous_store.length; k++) {
                            secondRecord = gu.getCmp('packageUnitGrid').getStore().getAt(k);
                            secondRecord.set('proQuan', '');
                        }
                        return;
                    } else {
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
                                        Ext.MessageBox.alert('알림', '작업요청량을 입력해주시기 바랍니다.')
                                        return;
                                    } else {
                                        gm.me().addPackageUnit();
                                    }
                                }
                            }]
                        },
                        {
                            text: gm.getMC('CMD_DELETE', '삭제'),
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('packageUnitGrid').getSelectionModel().getSelected().items[0];
                                    var store = gu.getCmp('packageUnitGrid').getStore();
                                    var workStore = gu.getCmp('packageWorkGrid').getStore();
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
            id: gu.id('packageWorkGrid'),
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
                                var store = gu.getCmp('packageWorkGrid').getStore();
                                var record = gu.getCmp('packageWorkGrid').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var selection = gm.me().grid.getSelectionModel().getSelection();
                                var rec = selection[0];
                                console_logs('rec >>>>', rec);
                                this.store.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');
                                this.store.getProxy().setExtraParam('pcs_code', rec.get('product_group'));
                                delete this.store.getProxy().getExtraParams()['parameter_name'];
                                this.store.getProxy().setExtraParam('reserved_varchar3', 'PKG');
                                this.store.load();
                            },
                            select: function (combo, rec) {
                                // 이 부분에 CAPA와 시작예정일을 산출해야 함
                                var store = gu.getCmp('packageWorkGrid').getStore();
                                var record = gu.getCmp('packageWorkGrid').getSelectionModel().getSelected().items[0];
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
                                        var selectionRec = gm.me().grid.getSelectionModel().getSelection();
                                        var recOther = selectionRec[0];
                                        var unit = gu.getCmp('packageUnitGrid').getStore().getAt(record.get('workNumber') - 1);

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
                                                    Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
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
                                var store = gu.getCmp('packageWorkGrid').getStore();
                                var record = gu.getCmp('packageWorkGrid').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var unitStore = gu.getCmp('packageUnitGrid').getStore().getAt(record.get('workNumber') - 1);
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
                                                    store.getAt(index).set('end_time', me.getSubmitValue());
                                                }
                                            } else {
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
                    dataIndex: 'start_time',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    editor: {
                        xtype: 'combo',
                        store: timeStore,
                        displayField: 'view',
                        valueField: 'time',
                        anchor: '50%',
                        listeners: {
                            change: function (field, newValue, oldValue) {
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
                    dataIndex: 'end_time',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    editor: {
                        xtype: 'combo',
                        store: timeStore,
                        displayField: 'view',
                        valueField: 'time',
                        format: 'H:i',
                        increment: 60,
                        anchor: '50%',
                        increment: 60,
                        anchor: '50%',
                        listeners: {
                            change: function (field, newValue, oldValue) {
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
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '작업요청량',
                            hideTrigger: false,
                            // fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {
                                change: function () {
                                    var store = gu.getCmp('packageUnitGrid').getStore();
                                    store.getAt(0).set('proQuan', gu.getCmp('bm_quan').getValue());
                                    // gu.getCmp('capaValue').setValue(gu.getCmp('bm_quan').getValue());
                                }
                            }
                        },
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
            title: gm.getMC('CMD_Repackaging_Order', '재포장계획수립'),
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
                                var storeData1 = gu.getCmp('packageUnitGrid').getStore();
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
                                var storeData2 = gu.getCmp('packageWorkGrid').getStore();
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
                                        url: CONTEXT_PATH + '/index/process.do?method=addAssemblyPackageManual',
                                        waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                        params: {
                                            bm_quan: gu.getCmp('bm_quan').getValue(),
                                            prd_group: selection.get('product_group'),
                                            assymap_uid: selection.get('assymap_uid'),
                                            srcahd_uid: selection.get('unique_id_long'),
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
                                                gm.me().store.load();
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
        gm.me().addProUnitPackageFirstOrder();
        prWin.show();
    },

    renderNumber: function (value, p, record) {
        var isNumber = true;
        if (value == null) {
            value = 0;
        }
        for (var i = 0; i < value.length; i++) {
            var charValue = value.charCodeAt(i);
            if (charValue < 48 || charValue > 57) {
                isNumber = false;
            }
        }

        if (typeof value == 'number' || isNumber) {
            return Ext.util.Format.number(value, '0,00/i');
        } else {
            return value;
        }
    },
    loding_msg: function () {
        Ext.MessageBox.wait('데이터를 처리중입니다.<br>잠시만 기다려주세요.', '알림');
    },
    stop_msg: function () {
        Ext.MessageBox.hide();
    },
    addProUnitFirst: function () {
        var store = gu.getCmp('prodUnitGrid').getStore();
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var cnt = store.getCount() + 1;

        store.insert(store.getCount(), new Ext.data.Record({
            'proNumber': cnt,
            'proQuan': rec.get('unit_mass')
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

    addProUnit: function () {
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var bm_quan = gu.getCmp('bm_quan').getValue();
        // var bm_quan  = rec.get('unit_mass');
        var store = gu.getCmp('prodUnitGrid').getStore();
        var previous_store = store.data.items;
        var total_quan = 0;

        for (var j = 0; j < previous_store.length; j++) {
            var item = previous_store[j];
            total_quan = Number(total_quan) + Number(item.get('proQuan'));
        }
        console_logs('등록된 total_quan ??? ', total_quan);
        console_logs('차액 ???', Number(bm_quan) - Number(total_quan))
        var diff_price = Number(bm_quan) - Number(total_quan);
        var cnt = store.getCount() + 1;

        // gu.getCmp('capaValue').setValue(Number(bm_quan) - Number(total_quan) + Number(total_quan))

        store.insert(store.getCount(), new Ext.data.Record({
            'proNumber': cnt,
            'proQuan': diff_price
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

    addPackageOrderUnit: function () {
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var bm_quan = gu.getCmp('bm_quan').getValue();
        // var bm_quan  = rec.get('unit_mass');
        var store = gu.getCmp('packageUnitGrid').getStore();
        var previous_store = store.data.items;
        var total_quan = 0;

        for (var j = 0; j < previous_store.length; j++) {
            var item = previous_store[j];
            total_quan = Number(total_quan) + Number(item.get('proQuan'));
        }
        console_logs('등록된 total_quan ??? ', total_quan);
        console_logs('차액 ???', Number(bm_quan) - Number(total_quan))
        var diff_price = Number(bm_quan) - Number(total_quan);
        var cnt = store.getCount() + 1;

        // gu.getCmp('capaValue').setValue(Number(bm_quan) - Number(total_quan) + Number(total_quan))

        store.insert(store.getCount(), new Ext.data.Record({
            'proNumber': cnt,
            'proQuan': diff_price
        }));

        var workStore = gu.getCmp('packageWorkGrid').getStore();

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


    addProUnitFirstOrder: function () {
        var store = gu.getCmp('prodUnitGridOrder').getStore();
        var selection = gm.me().gridContractMaterial.getSelectionModel().getSelection();
        var rec = selection[0];
        var cnt = store.getCount() + 1;

        store.insert(store.getCount(), new Ext.data.Record({
            'proNumber': cnt,
            'proQuan': rec.get('pr_quan')
        }));

        var workStore = gu.getCmp('workGridOrder').getStore();

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

    addPackageUnitFirstOrder: function () {
        var store = gu.getCmp('packageUnitGridOrder').getStore();
        var selection = gm.me().gridContractMaterial.getSelectionModel().getSelection();
        var rec = selection[0];
        var cnt = store.getCount() + 1;

        store.insert(store.getCount(), new Ext.data.Record({
            'proNumber': cnt,
            'proQuan': rec.get('pr_quan')
        }));

        var workStore = gu.getCmp('packageWorkGridOrder').getStore();

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
    },

    addProUnitPackageFirstOrder: function () {
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var bm_quan = gu.getCmp('bm_quan').getValue();
        // var bm_quan  = rec.get('unit_mass');
        var store = gu.getCmp('packageUnitGrid').getStore();
        var previous_store = store.data.items;
        var total_quan = 0;

        for (var j = 0; j < previous_store.length; j++) {
            var item = previous_store[j];
            total_quan = Number(total_quan) + Number(item.get('proQuan'));
        }
        console_logs('등록된 total_quan ??? ', total_quan);
        console_logs('차액 ???', Number(bm_quan) - Number(total_quan))
        var diff_price = Number(bm_quan) - Number(total_quan);
        var cnt = store.getCount() + 1;

        // gu.getCmp('capaValue').setValue(Number(bm_quan) - Number(total_quan) + Number(total_quan))

        store.insert(store.getCount(), new Ext.data.Record({
            'proNumber': cnt,
            'proQuan': diff_price
        }));

        var workStore = gu.getCmp('packageWorkGrid').getStore();

        workStore.insert(workStore.getCount(), new Ext.data.Record({
            'workNumber': cnt,
            'workCapa': 0,
            'startDate': null,
            'endDate': null,
            'start_time': null,
            'end_time': null,
            'pcsmchn_uid': null,
            'mchn_code': null
        }));
    },

    addProUnitOrder: function () {
        var selection = gm.me().gridContractMaterial.getSelectionModel().getSelection();
        var rec = selection[0];
        var bm_quan = gu.getCmp('bm_quan_order').getValue();
        // var bm_quan  = rec.get('unit_mass');
        var store = gu.getCmp('prodUnitGridOrder').getStore();
        var previous_store = store.data.items;
        var total_quan = 0;

        for (var j = 0; j < previous_store.length; j++) {
            var item = previous_store[j];
            total_quan = Number(total_quan) + Number(item.get('proQuan'));
        }
        console_logs('등록된 total_quan ??? ', total_quan);
        console_logs('차액 ???', Number(bm_quan) - Number(total_quan))
        var diff_price = Number(bm_quan) - Number(total_quan);
        var cnt = store.getCount() + 1;

        gu.getCmp('capaValueOrder').setValue(Number(bm_quan) - Number(total_quan) + Number(total_quan))

        store.insert(store.getCount(), new Ext.data.Record({
            'proNumber': cnt,
            'proQuan': diff_price
        }));

        var workStore = gu.getCmp('workGridOrder').getStore();

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

    addPackageUnitOrder: function () {
        var selection = gm.me().gridContractMaterial.getSelectionModel().getSelection();
        var rec = selection[0];
        var bm_quan = gu.getCmp('bm_quan_order').getValue();
        // var bm_quan  = rec.get('unit_mass');
        var store = gu.getCmp('packageUnitGridOrder').getStore();
        var previous_store = store.data.items;
        var total_quan = 0;

        for (var j = 0; j < previous_store.length; j++) {
            var item = previous_store[j];
            total_quan = Number(total_quan) + Number(item.get('proQuan'));
        }
        console_logs('등록된 total_quan ??? ', total_quan);
        console_logs('차액 ???', Number(bm_quan) - Number(total_quan))
        var diff_price = Number(bm_quan) - Number(total_quan);
        var cnt = store.getCount() + 1;

        gu.getCmp('capaValueOrder').setValue(Number(bm_quan) - Number(total_quan) + Number(total_quan))

        store.insert(store.getCount(), new Ext.data.Record({
            'proNumber': cnt,
            'proQuan': diff_price
        }));

        var workStore = gu.getCmp('packageWorkGridOrder').getStore();

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
    searchStore: Ext.create('Rfx2.store.company.kbtech.MaterialStore', {})
});