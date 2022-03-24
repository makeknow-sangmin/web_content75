//주문작성

Ext.define('Rfx2.view.company.chmr.groupWare.AccountsPayableView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'account-pay-view',
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

        this.createStore('Rfx.model.AccountsPayable', [{
                property : 'unique_id',
                direction: 'DESC2'
            }],
            gMain.pageSize/* pageSize */
            , {
                creator  : 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['wgrast']
        );

        // this.createStoreSimple({
        //     modelClass: 'Rfx.model.AccountsPayable',
        //     sorters: [{
        //         property: 'unique_id',
        //         direction: 'DESC'
        //     }],
        //     pageSize: gMain.pageSize,/*pageSize*/
        // }, {
        //     groupField: 'po_no',
        //     groupDir: 'DESC'
        // });

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
                case 'gr_qty':
                case 'gr_amount':
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

        // var option = {
        //     features: {
        //         ftype: 'groupingsummary',
        //         groupHeaderTpl: '<div>주문번호 :: <font color=#003471><b>{[values.rows[0].data.po_no]}</b></font> ({rows.length})</div>'
        //     }
        // };

        this.createGridCore(arr/**, option**/);

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

        this.writeBillHistory = Ext.create('Ext.Action', {
            itemId  : 'writeBillHistory',
            iconCls : 'af-check',
            disabled: true,
            text    : '정산처리',
            // hidden  : gu.setCustomBtnHiddenProp('writeBillHistory'),
            handler : function (widget, event) {
                //결재사용인 경우 결재 경로 store 생성
                if (gm.me().useRouting == true) {
                    gm.me().rtgapp_store = Ext.create('Mplm.store.RtgappStore', {});
                }
                var pr_uid = gm.me().SELECTED_UID;
                var selectUids = [];
                var closed_qtys = [];
                var closed_prices = [];
                var comments = [];

                var isVat = '';
                var origin_sales_price = [];
                var currency =''

                var selections = gm.me().grid.getSelectionModel().getSelection();
                if (selections.length > 0) {
                    var close_price = 0;
                    var vat_value = 0;
                    var before_is_vat = '';
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var before_rec = selections[i - 1];
                        console_logs('rec', rec);
                        selectUids.push(rec.get('unique_id_long'));
                        closed_qtys.push(rec.get('due_qty'));
                        closed_prices.push(rec.get('due_qty') * rec.get('sales_price'));
                        origin_sales_price.push(rec.get('sales_price'));

                        var close_qty = rec.get('due_qty');
                        var gr_qty = rec.get('gr_qty');
                        var sales_price_trans_currency = rec.get('due_qty') * rec.get('sales_price');
                        close_price = close_price + sales_price_trans_currency;

                        if (close_qty <= 0) {
                            Ext.MessageBox.alert('알림', '마감수량이 입력되지 않는 항목이 있습니다.');
                            return;
                        }
                        if (close_qty > gr_qty) {
                            Ext.MessageBox.alert('알림', '입력한 마감수량이 입고수량보다 큰 항목이 있습니다.');
                            return;
                        }

                        vat_value =  close_price * 0.1;
                        currency = rec.get('sales_currency');
                        isVat = rec.get('is_vat');
                    }

                    var seller_code = selections[0]['data']['seller_code'];
                    var seller_name = selections[0]['data']['seller_name'];
                    var txt_name = '[' + seller_code + '] ' + seller_name + ' - ' + (new Date()).getFullYear() + '년' + ((new Date()).getMonth() + 1) + '월';

                    var extra_price_grid = Ext.create('Ext.grid.Panel', {
                        store: new Ext.data.Store(),
                        cls: 'rfx-panel',
                        id: gu.id('extra_price_grid'),
                        collapsible: false,
                        multiSelect: false,
                        width: 450,
                        height: 270,
                        autoScroll: true,
                        margin: '0 0 0 0',
                        autoHeight: true,
                        frame: false,
                        border: true,
                        layout: 'fit',
                        forceFit: true,

                        columns: [
                            {
                                id: gu.id('extra_description'),
                                text: '기타품목',
                                style: 'text-align:center',
                                dataIndex: 'extra_description',
                                // align: 'right',
                                editor: 'textfield',
                                renderer: function (value) {
                                    gm.me().vEachValueee = value;
                                    return value;
                                },
                                sortable: false
                            },
                            {
                                text: '추가 / 공제비용',
                                id: gu.id('extra_minus_price'),
                                dataIndex: 'extra_minus_price',
                                style: 'text-align:center',
                                align: 'right',
                                editor : {
                                    xtype : 'numberfield',
                                    // decimalPrecision: 4
                                },
                                sortable: false,
                                renderer: function (value) {
                                    printQuan = gm.me().vprintQuan;
                                    return Ext.util.Format.number(value, '0,000');
                                },
                            }
                        ],

                        selModel: 'cellmodel',
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 2,
                        },
                        listeners: {
                            edit: function (value, context, ditor, e, eOpts) {
                                var extra_minus_price = 0;
                                var store = gu.getCmp('extra_price_grid').getStore();
                                var previous_store = store.data.items;
                                for (var i = 0; i < previous_store.length; i++) {
                                    var recc = previous_store[i];
                                    extra_minus_price = extra_minus_price + recc.get('extra_minus_price');
                                }
                                var edit_total_price = close_price + vat_value + extra_minus_price;
                                gu.getCmp('total_price').setValue(edit_total_price);
                            },
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
                                        text: '+',
                                        listeners: [{
                                            click: function () {
                                                var store = gu.getCmp('extra_price_grid').getStore();
                                                var getCount = store.getCount();
                                                console_logs('item index >> ', getCount);
                                                store.insert(store.getCount(), new Ext.data.Record({
                                                    'extra_description': '',
                                                    'extra_minus_price': 0
                                                }));
                                            }
                                        }]
                                    },
                                    {
                                        text: '-',
                                        listeners: [{
                                            click: function () {
                                                var record = gu.getCmp('extra_price_grid').getSelectionModel().getSelected().items[0];
                                                var store = gu.getCmp('extra_price_grid').getStore();
                                                if (record == null) {
                                                    gu.getCmp('extra_price_grid').getStore().remove(store.last());
                                                } else {
                                                    gu.getCmp('extra_price_grid').getStore().removeAt(gu.getCmp('extra_price_grid').getStore().indexOf(record));
                                                }

                                                var extra_minus_price = 0;
                                                var store_last = gu.getCmp('extra_price_grid').getStore();
                                                var last_store = store_last.data.items;
                                                for (var i = 0; i < last_store.length; i++) {
                                                    var recc = last_store[i];
                                                    extra_minus_price = extra_minus_price + recc.get('extra_minus_price');
                                                }
                                                var edit_total_price = close_price + vat_value + extra_minus_price;
                                                gu.getCmp('total_price').setValue(edit_total_price);
                                            }
                                        }]
                                    },
                                ]
                            }),

                            //여기부터
                            Ext.create('Ext.form.Panel', {
                                xtype: 'form',
                                frame: false,
                                border: false,
                                bodyPadding: 0,
                                region: 'center',
                                layout: 'form',
                                autoScroll: true,
                                fieldDefaults: {
                                    labelAlign: 'right',
                                    msgTarget: 'side'
                                },

                            }),
                        ]
                    });

                    var formItems = Ext.create('Ext.form.Panel', {
                        id           : gu.id('formitems'),
                        xtype        : 'form',
                        frame        : false,
                        border       : false,
                        width        : '100%',
                        height       : '100%',
                        bodyPadding  : '3 3 0',
                        region       : 'center',
                        layout       : 'column',
                        fieldDefaults: {
                            labelAlign: 'right',
                            msgTarget : 'side'
                        },
                        items        : [
                            {
                                xtype   : 'fieldset',
                                frame   : true,
                                width   : '100%',
                                height  : '100%',
                                layout  : 'fit',
                                title   : '선택한 품목들에 대하여 정산처리를 시행합니다.',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                items   : [
                                    {
                                        fieldLabel: '정산제목',
                                        xtype     : 'textfield',
                                        anchor    : '100%',
                                        width     : '99%',
                                        name      : 'txt_name',
                                        editable  : false,
                                        fieldStyle: 'background-color: #ddd; background-image: none;',
                                        value     : txt_name
                                    },
                                    {
                                        fieldLabel: '공급사명',
                                        xtype     : 'textfield',
                                        anchor    : '100%',
                                        width     : '99%',
                                        editable  : false,

                                        name      : 'seller_name',
                                        fieldStyle: 'background-color: #ddd; background-image: none;',
                                        value     : seller_name
                                    },
                                    {
                                        fieldLabel      : '매입가',
                                        id              : gu.id('close_price'),
                                        xtype           : 'numberfield',
                                        anchor          : '100%',
                                        width           : '99%',
                                        editable        : false,
                                        name            : 'close_price',
                                        hideTrigger     : true,
                                        align : 'right',
                                        // decimalPrecision: 4,
                                        fieldStyle      : 'background-color: #ddd; background-image: none; font-weight: bold;',
                                        value           : Ext.util.Format.number(close_price, '0.000')
                                    },
                                    {
                                        fieldLabel      : '부가세',
                                        id              : gu.id('vat_value'),
                                        xtype           : 'numberfield',
                                        anchor          : '100%',
                                        width           : '99%',
                                        editable        : false,
                                        name            : 'vat_value',
                                        hideTrigger     : true,
                                        align : 'right',
                                        // decimalPrecision: 4,
                                        fieldStyle      : 'background-color: #ddd; background-image: none; font-weight: bold;',
                                        value           : Ext.util.Format.number(vat_value, '0.000')
                                    },
                                    {
                                        fieldLabel      : '정산금액',
                                        id              : gu.id('total_price'),
                                        xtype           : 'numberfield',
                                        anchor          : '100%',
                                        width           : '99%',
                                        editable        : false,
                                        name            : 'total_price',
                                        hideTrigger     : true,
                                        align : 'right',
                                        // decimalPrecision: 4,
                                        fieldStyle      : 'background-color: #ddd; background-image: none; font-weight: bold;',
                                        value           : Ext.util.Format.number(close_price + vat_value, '0.000')
                                    },
                                    {
                                        fieldLabel: '마감일자',
                                        xtype     : 'datefield',
                                        anchor    : '100%',
                                        width     : '99%',
                                        editable  : true,
                                        name      : 'close_date',
                                        format    : 'Y-m-d',
                                        value     : new Date()
                                    }
                                ]
                            },
                            {
                                xtype   : 'fieldset',
                                frame   : true,
                                width   : '100%',
                                height  : '100%',
                                layout  : 'fit',
                                title   : '구매 입고품목외 비용추가 내용 또는 공제내역이 발생되었을 경우<br>아래 추가 입력해주시기 바랍니다.',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                items   : [
                                    extra_price_grid
                                ]
                            }
                        ]
                    });

                    var form = Ext.create('Ext.form.Panel', {
                        id           : gu.id('formPanel'),
                        xtype        : 'form',
                        frame        : false,
                        border       : false,
                        width        : '100%',
                        height       : '100%',
                        region       : 'center',
                        layout       : 'column',
                        width        : '100%',
                        bodyPadding  : '3 3 0',
                        fieldDefaults: {
                            labelAlign: 'right',
                            msgTarget : 'side'
                        },
                        items        : formItems
                    })

                    var items = [form];

                    var prWin = Ext.create('Ext.Window', {
                        modal  : true,
                        title  : '정산처리',
                        width  : 500,
                        height : 680,
                        plain  : true,
                        items  : items,
                        buttons: [{
                            text   : CMD_OK,
                            handler: function (btn) {
                                if (btn == "no") {
                                    prWin.close();
                                } else {
                                    if (form.isValid()) {
                                        Ext.MessageBox.show({
                                            title  : '입고마감',
                                            msg    : '선택한 항목에 대하여 매입마감을 실행하시겠습니까?',
                                            buttons: Ext.MessageBox.YESNO,
                                            fn     : function (btn) {
                                                if (btn == 'yes') {
                                                    var storeData = gu.getCmp('extra_price_grid').getStore();
                                                    var extra_items = [];
                                                    var extra_prices = [];
                                                    var length = storeData.data.items.length;
                                                    if (length > 0) {
                                                        for (var j = 0; j < storeData.data.items.length; j++) {
                                                            var item = storeData.data.items[j];
                                                            extra_items.push(item.get('extra_description'));
                                                            extra_prices.push(item.get('extra_minus_price'))
                                                        }
                                                    }
                                                    form.submit({
                                                        submitEmptyText: false,
                                                        url            : CONTEXT_PATH + '/account/arap.do?method=closeGr',
                                                        params         : {
                                                            seller_code  : seller_code,
                                                            wgrast_uids  : selectUids,
                                                            comment      : comments,
                                                            closed_qtys  : closed_qtys,
                                                            closed_prices: closed_prices,
                                                            extra_items : extra_items,
                                                            extra_prices : extra_prices,
                                                            origin_sales_price : origin_sales_price,
                                                            // isVat : isVat,
                                                            // currency : currency
                                                        },
                                                        success        : function (val, action) {
                                                            prWin.setLoading(false);
                                                            gm.me().store.load();
                                                            prWin.close();
                                                        },
                                                        failure        : function () {
                                                            prWin.setLoading(false);
                                                            extjsUtil.failureMessage();
                                                        }
                                                    });
                                                }
                                            },
                                            icon   : Ext.MessageBox.QUESTION
                                        });
                                    }
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
                } else {
                    Ext.MessageBox.alert('알림', '마감할 품목이 선택되지 않았습니다.')
                }
            }
        });
        buttonToolbar.insert(1, this.writeBillHistory);

        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var s_date = gu.getCmp('s_date_arv').getValue();
                    var e_date = gu.getCmp('e_date_arv').getValue();
                    var seller_code = Ext.getCmp('seller_code').getValue();
                } catch (e) {
                }
                var seller_name = Ext.getCmp('query').getValue();
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
                } else {
                    gUtil.disable(gm.me().writeBillHistory);
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

        this.supplierStore = Ext.create('Mplm.store.SupastStore');
        this.supplierStore.getProxy().setExtraParam('only_date', 'T');

        var valSdate = Ext.Date.getFirstDateOfMonth(new Date());
        var valEdate = Ext.Date.getLastDateOfMonth(new Date());

        this.supplierGrid =
            Ext.create('Rfx2.view.company.bioprotech.grid.AccountPayableGrid', {
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
                            style: 'color:white;',
                            listeners: {
                                click: function () {
                                    console_logs('>>s_date', s_date);
                                    var s = Ext.getCmp(gu.id('s_date_arv')).getValue();
                                    var e = Ext.getCmp(gu.id('e_date_arv')).getValue();
                                    var s_value = Ext.Date.add(s, Ext.Date.MONTH, -1);
                                    var e_value = Ext.Date.add(e, Ext.Date.MONTH, -1);
                                    valSdate = Ext.Date.getFirstDateOfMonth(s_value);
                                    valEdate = Ext.Date.getLastDateOfMonth(e_value);
                                    Ext.getCmp(gu.id('s_date_arv')).setValue(Ext.Date.format(valSdate, 'Y-m-d'));
                                    Ext.getCmp(gu.id('e_date_arv')).setValue(Ext.Date.format(valEdate, 'Y-m-d'));
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
                                    var s = Ext.getCmp(gu.id('s_date_arv')).getValue();
                                    var e = Ext.getCmp(gu.id('e_date_arv')).getValue();
                                    var s_value = Ext.Date.add(s, Ext.Date.MONTH, 1);
                                    var e_value = Ext.Date.add(e, Ext.Date.MONTH, 1);
                                    valSdate = Ext.Date.getFirstDateOfMonth(s_value);
                                    valEdate = Ext.Date.getLastDateOfMonth(e_value);
                                    Ext.getCmp(gu.id('s_date_arv')).setValue(Ext.Date.format(valSdate, 'Y-m-d'));
                                    Ext.getCmp(gu.id('e_date_arv')).setValue(Ext.Date.format(valEdate, 'Y-m-d'));
                                },
                            }
                        },
                        {
                            xtype: 'triggerfield',
                            emptyText: '공급사 명',
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            id: 'query',
                            name: 'query',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().supplierStore.getProxy().setExtraParam('query', Ext.getCmp('query').getValue());
                                        gm.me().supplierStore.load(function () {
                                        });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                Ext.getCmp('query').setValue('');
                                gm.me().supplierStore.getProxy().setExtraParam('query', Ext.getCmp('query').getValue());
                                gm.me().supplierStore.load(function () {
                                });
                            }
                        }
                        ]
                    }
                ] //dockedItems of End
            });//supplierGrid of End

        //미정산 항목
        this.store.getProxy().setExtraParam('is_final', 'N');

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
            width: '32%',
            layoutConfig: { columns: 2, rows: 1 },

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

    accountsWayStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'ACCOUNTS_WAY' }),

    editRedord: function (field, rec) {
        // console_logs('>>>> 여기에 들어왔니','OK')
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        switch (field) {
            case 'sales_price':
                this.updateSalesPrice(rec);
                break;
        }
    },

    updateSalesPrice: function (rec) {
        var gr_qty = rec.get('gr_qty');
        var sales_price = rec.get('sales_price');
        var unique_id = rec.get('unique_id_long');
        console_logs('====> unique_id', unique_id);
        console_logs('====> sales_price', sales_price);
        console_logs('====> gr_qty', gr_qty);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/prch.do?method=updateGrSalesPrice',
            params: {
                gr_qty : gr_qty,
                sales_price : sales_price,
                unique_id_long: unique_id,
            },
            success: function (result, request) {
                var result = result.responseText;
                gm.me().store.load();
            },
            failure: extjsUtil.failureMessage
        });
    },
});