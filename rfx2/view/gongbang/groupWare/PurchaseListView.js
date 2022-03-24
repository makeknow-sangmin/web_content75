//주문작성

Ext.define('Rfx2.view.gongbang.groupWare.PurchaseListView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'purchase-list-view',
    initComponent: function () {


        //검색툴바 필드 초기화
        this.initSearchField();

        // this.addSearchField({
        //     field_id: 'wa_code',
        //     store: 'ComCstStore',
        //     displayField: 'division_name',
        //     valueField: 'wa_code',
        //     emptyText: '사업부',
        //     innerTpl: '<div data-qtip="{wa_code}">{division_name}</div>'
        // });

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        // '/purchase/prch.do?method=readGoodsReceipt'

        this.createStoreSimple({
            modelClass: 'Rfx.model.AccountsPayable',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            pageSize: gMain.pageSize,/*pageSize*/
        }, {
            groupField: 'po_no',
            groupDir: 'DESC'
        });

        var arr = [];
        var total_price = 0;
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        for (var i = 0; i < this.columns.length; i++) {

            var o = this.columns[i];
            //console_logs('this.columns' + i, o);

            var dataIndex = o['dataIndex'];

            switch (dataIndex) {
                case 'gr_amount_Hj':
                case 'sales_price':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        value = Ext.util.Format.number(value, '0,00.##/i');
                        value = '<font style="font-weight: bold; font-size:10pt; color:#000000;">' + value + '</font>'
                        return value;
                    };
                    break;
                default:
                    break;
            }

        }

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '<div><b>주문번호:<font color=#003471>{name}</b></font> ({rows.length}건)</div>'
        });

        var option = {
            // features: {
            //     ftype: 'groupingsummary',
            //     groupHeaderTpl: '<div>주문번호 :: <font color=#003471><b>{[values.rows[0].data.po_no]}</b></font> ({rows.length})</div>'
            // }
        };
        this.createGridCore(arr, option);

        switch (vCompanyReserved4) {
            case 'SKNH01KR':
            case 'KWLM01KR':
            case 'KBTC01KR':
            case 'HJSV01KR':
                arr.push(this.buttonToolbar3);
                break;
            default:
                break;
        }


        //grid 생성.
        //this.createGridCore(arr, option);

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        // buttonToolbar.insert(1, this.writeBillHistory);
        //buttonToolbar.insert(2, this.execApAction);
        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var s_date = gu.getCmp('s_date_arv').getValue();
                    var e_date = gu.getCmp('e_date_arv').getValue();
                    var seller_code = gu.getCmp('seller_code').getValue();
                } catch (e) {
                }
                var seller_name = gu.getCmp('query').getValue();
                gm.me().supplierStore.getProxy().setExtraParam('s_date', Ext.Date.format(s_date, 'Y-m-d'));
                gm.me().supplierStore.getProxy().setExtraParam('e_date', Ext.Date.format(e_date, 'Y-m-d'));
                gm.me().supplierStore.getProxy().setExtraParam('seller_code', seller_code);
                gm.me().supplierStore.getProxy().setExtraParam('query', seller_name);
                gm.me().supplierStore.load();
            }
        });


        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()]
        });

        this.callParent(arguments);

        this.setGridOnCallback(function (selections) {
            var total_price_sum = 0;
            var total_qty = 0;
            for (var i = 0; i < selections.length; i++) {
                var t_rec = selections[i];
                total_price_sum += t_rec.get('sales_amount');
                total_qty += t_rec.get('gr_qty');
            }
            total_price = total_price_sum;
            this.buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
        })
    },

    //    rtgast_uid_arr : [],
    setRelationship: function (relationship) {
    },
    createCenter: function () {/*자재목록 그리드*/
        this.grid.setTitle('입고목록');
        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            width: '55%',
            items: [this.grid]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections != null && selections.length > 0) {
                    gUtil.enable(gm.me().writeBillHistory);
                    gUtil.enable(gm.me().execApAction);
                    var store = this.store;
                    var total_price_sum = 0;
                    var total_qty = 0;
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        console_logs('>>>>>>>>>********store', rec);
                        total_qty += rec.get('gr_qty');
                        total_price_sum += rec.get('sales_amount');
                    }
                    gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty)
                } else {
                    gUtil.disable(gm.me().execApAction);
                    var store = this.store;
                    var total_price_sum = 0;
                    var total_qty = 0;
                    for (var i = 0; i < store.data.items.length; i++) {
                        var rec = store.data.items[i];
                        total_qty += rec.get('gr_qty');
                        total_price_sum += rec.get('sales_amount');
                    }
                    gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
                }
            }
        })

        return this.center;
    },
    createWest: function () {/*요청서 목록*/
        this.removeAssyAction = Ext.create('Ext.Action', {
            itemId: 'removeAssyAction',
            iconCls: 'af-remove',
            text: 'Assy' + CMD_DELETE,
            disabled: true,
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: delete_msg_title,
                    msg: delete_msg_content,
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().deleteAssyConfirm,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.supplierStore = Ext.create('Mplm.store.SupastPurchaseStore');
        this.supplierStore.getProxy().setExtraParam('only_date', 'T');

        var valSdate = Ext.Date.getFirstDateOfMonth(new Date());
        var valEdate = Ext.Date.getLastDateOfMonth(new Date());

        this.supplierGrid =
            Ext.create('Rfx.view.grid.AccountPayableGrid', {
                title: '구매 공급사',// cloud_product_class,
                border: true,
                resizable: true,
                scroll: true,
                collapsible: false,
                store: this.supplierStore,
                multiSelect: true,
                selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: this.supplierStore,
                    displayInfo: true,
                    displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                    emptyMsg: "표시할 항목이 없습니다."
                    , listeners: {
                        beforechange: function (page, currentPage) {

                        }
                    }

                }),
                dockedItems: [
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default2',
                        items: [
                            this.purListSrch
                        ]
                    },
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default1',
                        items: [{
                            xtype: 'label',
                            width: 40,
                            text: '기간',
                            style: 'color:white;'

                        }, {
                            id: gu.id('s_date_arv'),
                            name: 's_date',
                            format: 'Y-m-d',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            xtype: 'datefield',
                            value: valSdate,
                            width: 98

                        }, {
                            xtype: 'label',
                            text: "~",
                            style: 'color:white;'
                        }, {
                            id: gu.id('e_date_arv'),
                            name: 'e_date',
                            format: 'Y-m-d',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            xtype: 'datefield',
                            value: valEdate,
                            width: 98

                        },
                            {
                                xtype: 'button',
                                iconCls: 'af-arrow-left',
                                // text: "<",
                                style: 'color:white;',
                                //hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                listeners: {
                                    click: function () {
                                        console_logs('>>s_date', s_date);
                                        var s = gu.getCmp(gu.id('s_date_arv')).getValue();
                                        var e = gu.getCmp(gu.id('e_date_arv')).getValue();
                                        var s_value = Ext.Date.add(s, Ext.Date.MONTH, -1);
                                        var e_value = Ext.Date.add(e, Ext.Date.MONTH, -1);
                                        valSdate = Ext.Date.getFirstDateOfMonth(s_value);
                                        valEdate = Ext.Date.getLastDateOfMonth(e_value);
                                        gu.getCmp(gu.id('s_date_arv')).setValue(Ext.Date.format(valSdate, 'Y-m-d'));
                                        gu.getCmp(gu.id('e_date_arv')).setValue(Ext.Date.format(valEdate, 'Y-m-d'));
                                    },
                                }
                            },
                            {
                                xtype: 'button',
                                iconCls: 'af-arrow-right',
                                style: 'color:white;',
                                //hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                listeners: {
                                    click: function () {
                                        var s = gu.getCmp(gu.id('s_date_arv')).getValue();
                                        var e = gu.getCmp(gu.id('e_date_arv')).getValue();
                                        var s_value = Ext.Date.add(s, Ext.Date.MONTH, 1);
                                        var e_value = Ext.Date.add(e, Ext.Date.MONTH, 1);
                                        valSdate = Ext.Date.getFirstDateOfMonth(s_value);
                                        valEdate = Ext.Date.getLastDateOfMonth(e_value);
                                        gu.getCmp(gu.id('s_date_arv')).setValue(Ext.Date.format(valSdate, 'Y-m-d'));
                                        gu.getCmp(gu.id('e_date_arv')).setValue(Ext.Date.format(valEdate, 'Y-m-d'));
                                    },
                                }
                            },
                            {
                                xtype: 'triggerfield',
                                emptyText: '공급사 명',
                                fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                                id: gu.id('query'),
                                name: 'query',
                                listeners: {
                                    specialkey: function (field, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().supplierStore.getProxy().setExtraParam('query', gu.getCmp('query').getValue());
                                            gm.me().supplierStore.load(function () {
                                            });
                                        }
                                    }
                                },
                                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                'onTrigger1Click': function () {
                                    gu.getCmp('query').setValue('');
                                    gm.me().supplierStore.getProxy().setExtraParam('query', gu.getCmp('query').getValue());
                                    gm.me().supplierStore.load(function () {
                                    });
                                }
                            }
                        ]
                    }
                ] //dockedItems of End


            });//supplierGrid of End

        //미정산 항목
        // this.store.getProxy().setExtraParam('is_final', 'N');

        var s_date = gu.getCmp('s_date_arv').getValue();
        var e_date = gu.getCmp('e_date_arv').getValue();
        this.supplierStore.getProxy().setExtraParam('s_date', s_date);
        this.supplierStore.getProxy().setExtraParam('e_date', e_date);

        this.supplierGrid.store.load();
        this.supplierGrid.store.on('load', function (store, records, successful, eOpts) {

        });

        this.supplierGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {

                gUtil.enable(gm.me().editAssyAction);
                try {
                    if (selections.length > 0) {
                        gUtil.enable(gm.me().execApActionAll);

                        var rec = selections[0];
                        console_logs('rec>>>>>>>>>>>>>', rec)
                        gm.me().SELECTED_UID = rec.get('unique_id');
                        gm.me().SELECTED_RECORD = rec;
                        var unique_id = rec.get('unique_id');
                        var seller_code = rec['data']['supplier_code'];
                        gm.me().store.getProxy().setExtraParam('pr_uid', unique_id);
                        var s_date = gu.getCmp('s_date_arv').getValue();
                        var e_date = gu.getCmp('e_date_arv').getValue();

                        gm.me().store.getProxy().setExtraParam('seller_code', seller_code);
                        gm.me().store.getProxy().setExtraParam('s_date', s_date);
                        gm.me().store.getProxy().setExtraParam('e_date', e_date);
                        gm.me().store.load(
                            function () {
                                if (vCompanyReserved4 == 'KWLM01KR') {
                                    var data = gm.me().store.data.items;
                                    console_logs('==data', data);

                                    var total_price_sum = 0;
                                    var total_qty = 0;

                                    for (var i = 0; i < data.length; i++) {
                                        var t_rec = data[i];
                                        // total_price_sum += t_rec.get('sales_price') * t_rec.get('gr_qty');
                                        total_price_sum += t_rec.get('sales_amount');
                                        total_qty += t_rec.get('gr_qty');
                                    }

                                    gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
                                }
                            }
                        );


                    } else {
                        gUtil.disable(gm.me().execApActionAll);
                    }
                } catch (e) {
                    console_logs('e', e);
                }
            }
        });

        this.west = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: true,
            region: 'west',
            width: '45%',
            layoutConfig: {columns: 2, rows: 1},

            items: [this.supplierGrid /*, myFormPanel*/]
        });

        return this.west;
    },
    rtgapp_store: null,
    useRouting: (vCompanyReserved4 == null) ? true : false,

    buttonToolbar3: Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '발행금액 : 0 / 총 수량 : 0'
        }]
    }),

    comcstStore: Ext.create('Mplm.store.ComCstStore', {}),

    accountsWayStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'ACCOUNTS_WAY'}),
});