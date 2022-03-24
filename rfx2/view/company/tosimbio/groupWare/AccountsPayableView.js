//주문작성

Ext.define('Rfx2.view.company.bioprotech.groupWare.AccountsPayableView', {
    extend       : 'Rfx2.base.BaseView',
    xtype        : 'account-pay-view',
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
            sorters   : [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            pageSize  : gMain.pageSize,/*pageSize*/
        }, {
            groupField: 'po_no',
            groupDir  : 'DESC'
        });

        var arr = [];
        var total_price = 0;
        arr.push(buttonToolbar);
        // arr.push(searchToolbar);

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

        var option = {
            features: {
                ftype         : 'groupingsummary',
                groupHeaderTpl: '<div>주문번호 :: <font color=#003471><b>{[values.rows[0].data.po_no]}</b></font> ({rows.length})</div>'
            }
        };
        // this.createGridCore(arr, option);
        this.usePagingToolbar = false;
        this.createGrid(arr);

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

        this.toogleVatYnAction = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-step_forward_14_0_5395c4_none',
            text    : 'VAT 적용여부 변경',
            tooltip : 'VAT 적용 여부를 변경합니다. 적용된 건에는 N으로 미적용건에는 Y로 변경합니다.',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('toogleVatYnAction'),
            handler : function () {
                //  gMain.selPanel.doRequestProduce();
                Ext.MessageBox.show({
                    title  : 'VAT 적용여부 변경',
                    msg    : '선택한 건에 대하여 VAT 적용여부를 변경하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn     : gm.me().toogleVatYn,
                    icon   : Ext.MessageBox.QUESTION
                });
            }
        });

        this.writeBillHistory = Ext.create('Ext.Action', {
            itemId  : 'writeBillHistory',
            iconCls : 'af-check',
            disabled: true,
            text    : '입고마감',
            hidden  : gu.setCustomBtnHiddenProp('writeBillHistory'),
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
                        closed_prices.push(rec.get('due_qty') * rec.get('sales_price_trans_currency'));
                        if (rec.get('description').length > 0) {
                            comments.push(rec.get('description'));
                        } else {
                            comments.push('-');
                        }

                        var close_qty = rec.get('due_qty');
                        var gr_qty = rec.get('gr_qty');
                        var sales_price_trans_currency = rec.get('sales_price_trans_currency');
                        close_price = close_price + (close_qty * sales_price_trans_currency);

                        if (close_qty <= 0) {
                            Ext.MessageBox.alert('알림', '마감수량이 입력되지 않는 항목이 있습니다.');
                            return;
                        }
                        if (close_qty > gr_qty) {
                            Ext.MessageBox.alert('알림', '입력한 마감수량이 입고수량보다 큰 항목이 있습니다.');
                            return;
                        }

                        if (i > 0) {
                            before_is_vat = before_rec.get('is_vat');
                            if (before_is_vat !== rec.get('is_vat')) {
                                Ext.MessageBox.alert('알림', 'VAT 적용 여부가 동일한 품목에 대하여<br>입고 마감을 실행할 수 있습니다.');
                                return;
                            }
                        }

                        vat_value = rec.get('is_vat') == 'Y' ? (close_price * 0.1) : 0.0;
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
                                editor: 'numberfield',
                                sortable: false,
                                renderer: function (value) {
                                    printQuan = gm.me().vprintQuan;
                                    return Ext.util.Format.number(value, '0,00/i');
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
                                title   : '선택한 품목들에 대하여 정산 마감을 시행합니다.',
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
                                        decimalPrecision: 4,
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
                                        decimalPrecision: 4,
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
                                        decimalPrecision: 4,
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
                        title  : '입고마감',
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
                                                            extra_prices : extra_prices
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

        this.execApAction = Ext.create('Ext.Action', {
            itemId  : 'execApAction',
            iconCls : 'af-plus-circle',
            disabled: true,
            text    : '정산 실행',
            handler : function (widget, event) {
                //결재사용인 경우 결재 경로 store 생성
                if (gm.me().useRouting == true) {
                    gm.me().rtgapp_store = Ext.create('Mplm.store.RtgappStore', {});
                }
                var pr_uid = gm.me().SELECTED_UID;
                var selectUids = [];
                var selections = gm.me().grid.getSelectionModel().getSelection();
                if (selections) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        console_logs('rec', rec);
                        selectUids.push(rec.get('unique_id_long'));
                    }
                }
                var seller_code = selections[0]['data']['seller_code'];
                var seller_name = selections[0]['data']['seller_name'];
                var txt_name = '[' + seller_code + '] ' + seller_name + ' - ' + (new Date()).getFullYear() + '년' + ((new Date()).getMonth() + 1) + '월';
                var myHeight = (gm.me().useRouting == true) ? 500 : 200;
                var myWidth = 600;

                var formItems = [
                    {
                        fieldLabel: '정산 구분',
                        xtype     : 'textarea',
                        rows      : 4,
                        anchor    : '100%',
                        labelWidth: 70,
                        //id: 'text_content',
                        name : 'txt_name',
                        style: 'width: 100%',
                        value: txt_name
                    }, {
                        fieldLabel  : '정산 방식',
                        xtype       : 'combo',
                        labelWidth  : 70,
                        store       : gm.me().accountsWayStore,
                        id          : 'ac_way',
                        name        : 'ac_way',
                        anchor      : '100%',
                        valueField  : 'systemCode',
                        displayField: 'codeName',
                        value       : 'CASH', // 현금이 기본
                        listConfig  : {
                            loadingText: '검색중...',
                            emptyText  : '일치하는 항목 없음',
                            getInnerTpl: function () {
                                return '<div data-qtip="{}">{codeName}</div>';
                            }
                        }
                    }, new Ext.form.Hidden({
                        name : 'unique_uids',
                        value: selectUids
                    })
                ];

                var form = Ext.create('Ext.form.Panel', {
                    id           : gu.id('formPanel'),
                    xtype        : 'form',
                    frame        : false,
                    border       : false,
                    width        : '100%',
                    bodyPadding  : 10,
                    region       : 'center',
                    layout       : 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },
                    items        : formItems
                })

                var items = [form];

                if (gm.me().useRouting == true) {

                    gm.me().rtgapp_store.load();
                    var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false});
                    var removeRtgapp = Ext.create('Ext.Action', {
                        itemId  : 'removeRtgapp',
                        glyph   : 'xf00d@FontAwesome',
                        text    : CMD_DELETE,
                        disabled: true,
                        handler : function (widget, event) {
                            Ext.MessageBox.show({
                                title  : delete_msg_title,
                                msg    : delete_msg_content,
                                buttons: Ext.MessageBox.YESNO,
                                fn     : gm.me().deleteRtgappConfirm,
                                // animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    });

                    var updown =
                        {
                            text        : '이동',
                            menuDisabled: true,
                            sortable    : false,
                            xtype       : 'actioncolumn',
                            width       : 70,
                            align       : 'center',
                            items       : [{
                                icon   : 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/up.png',
                                tooltip: 'Up',
                                handler: function (agridV, rowIndex, colIndex) {
                                    var record = gm.me().agrid.getStore().getAt(rowIndex);
                                    console_log(record);
                                    var unique_id = record.get('unique_id');
                                    console_log(unique_id);
                                    var direcition = -15;
                                    Ext.Ajax.request({
                                        url    : CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                        params : {
                                            direcition: direcition,
                                            unique_id : unique_id
                                        },
                                        success: function (result, request) {
                                            gm.me().rtgapp_store.load(function () {
                                            });
                                        }
                                    });

                                }
                            }, '-',
                                {
                                    icon   : 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/down.png',
                                    tooltip: 'Down',
                                    handler: function (agridV, rowIndex, colIndex) {

                                        var record = gm.me().agrid.getStore().getAt(rowIndex);
                                        console_log(record);
                                        var unique_id = record.get('unique_id');
                                        console_log(unique_id);
                                        var direcition = 15;
                                        Ext.Ajax.request({
                                            url    : CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                            params : {
                                                direcition: direcition,
                                                unique_id : unique_id
                                            },
                                            success: function (result, request) {
                                                gm.me().rtgapp_store.load(function () {
                                                });
                                            }
                                        });
                                    }

                                }]
                        };

                    var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false});
                    this.agrid = Ext.create('Ext.grid.Panel', {
                        //title: '결재경로',
                        store      : gm.me().rtgapp_store,
                        border     : true,
                        frame      : true,
                        style      : 'padding-left:10px;padding-right:10px;',
                        width      : '100%',
                        scroll     : true,
                        selModel   : selModel,
                        columns    : [
                            {dataIndex: 'seq_no', text: '순서', width: 70, sortable: false}
                            , {dataIndex: 'user_id', text: '아이디', sortable: false}
                            , {dataIndex: 'user_name', text: '이름', flex: 1, sortable: false}
                            , {dataIndex: 'dept_name', text: '부서 명', width: 90, sortable: false}
                            , {dataIndex: 'gubun', text: '구분', width: 50, sortable: false}
                            , updown
                        ],
                        border     : false,
                        multiSelect: true,
                        frame      : false,
                        dockedItems: [{
                            xtype: 'toolbar',
                            cls  : 'my-x-toolbar-default2',
                            items: [
                                {
                                    xtype     : 'label',
                                    labelWidth: 20,
                                    text      : '결재 권한자 추가'//,
                                    //style: 'color:white;'

                                }, {
                                    id            : 'user_name',
                                    name          : 'user_name',
                                    xtype         : 'combo',
                                    fieldStyle    : 'background-color: #FBF8E6; background-image: none;',
                                    store         : userStore,
                                    labelSeparator: ':',
                                    emptyText     : dbm1_name_input,
                                    displayField  : 'user_name',
                                    valueField    : 'unique_id',
                                    sortInfo      : {field: 'user_name', direction: 'ASC'},
                                    typeAhead     : false,
                                    hideLabel     : true,
                                    minChars      : 2,
                                    width         : 200,
                                    listConfig    : {
                                        loadingText: 'Searching...',
                                        emptyText  : 'No matching posts found.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                        }
                                    },
                                    listeners     : {
                                        select: function (combo, record) {
                                            console_logs('Selected combo : ', combo);
                                            console_logs('Selected record : ', record);
                                            console_logs('Selected Value : ', record.get('unique_id'));

                                            var unique_id = record.get('unique_id');
                                            var user_id = record.get('user_id');
                                            Ext.Ajax.request({
                                                url    : CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
                                                params : {
                                                    useruid: unique_id,
                                                    userid : user_id
                                                    , gubun: 'D'
                                                },
                                                success: function (result, request) {
                                                    var result = result.responseText;
                                                    console_log('result:' + result);
                                                    if (result == 'false') {
                                                        Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
                                                    } else {
                                                        gm.me().rtgapp_store.load(function () {
                                                        });
                                                    }
                                                },
                                                failure: extjsUtil.failureMessage
                                            });
                                        }// endofselect
                                    }
                                },
                                '->', removeRtgapp

                            ]// endofitems
                        }] // endofdockeditems
                    }); // endof Ext.create('Ext.grid.Panel',

                    this.agrid.getSelectionModel().on({
                        selectionchange: function (sm, selections) {
                            if (selections.length) {
                                removeRtgapp.enable();
                            } else {
                                removeRtgapp.disable();
                            }
                        }
                    });

                    items.push(this.agrid);
                }

                var prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '정산실행',
                    width  : myWidth,
                    height : myHeight,
                    plain  : true,
                    items  : items,
                    buttons: [{
                        text   : CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    //결재사용인 경우 결재 경로 확인
                                    if (gm.me().useRouting == true) {

                                        var items = gm.me().rtgapp_store.data.items;
                                        console_logs('items.length', items.length);
                                        if (items.length < 2) {
                                            Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                                            return;
                                        }

                                        var ahid_userlist = new Array();
                                        var ahid_userlist_role = new Array();

                                        for (var i = 0; i < items.length; i++) {
                                            var rec = items[i];
                                            console_logs('items rec', rec);
                                            ahid_userlist.push(rec.get('usrast_unique_id'));
                                            ahid_userlist_role.push(rec.get('gubun'));
                                        }
                                        val['hid_userlist'] = ahid_userlist;
                                        val['hid_userlist_role'] = ahid_userlist_role;
                                    } else {
                                        val['hid_userlist'] = null;
                                        val['hid_userlist_role'] = null;
                                        ahid_userlist = null;
                                        ahid_userlist_role = null;
                                    }

                                    var selections = gm.me().grid.getSelectionModel().getSelection();
                                    var supple_select = gm.me().supplierGrid.getSelectionModel().getSelection();

                                    var supplier_code = selections[0].get('seller_code');
                                    var supplierUid = supple_select[0].get('unique_id_long');
                                    var item_name = selections[0].get('item_name');
                                    var wa_code = null;
                                    if (vCompanyReserved4 == 'KWLM01KR') {
                                        wa_code = selections[0].get('wa_code');
                                    }
                                    var ac_way = Ext.getCmp('ac_way').getValue();

                                    Ext.Ajax.request({
                                        url   : CONTEXT_PATH + '/account/arap.do?method=addPaymentComplete',
                                        params: {
                                            wgrast_uids      : selectUids,
                                            txt_name         : txt_name,
                                            txt_content      : item_name + ' 외 ' + selections.length + '건',
                                            supplier_code    : supplier_code,
                                            supplierUid      : supplierUid,
                                            reserved_varchar2: (new Date()).getFullYear() + '년' + ((new Date()).getMonth() + 1) + '월',
                                            // hid_userlist : ahid_userlist,
                                            // hid_userlist_role : ahid_userlist_role,
                                            wa_code          : wa_code,
                                            reserved_varchar5: ac_way
                                        },

                                        success: function (result, request) {
                                            gm.me().store.load();
                                            gm.me().supplierGrid.store.load();
                                            Ext.Msg.alert('안내', '정산을 요청하였습니다.', function () {
                                            });

                                            prWin.close();
                                        },// endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });// endofajax
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

            }
        });

        this.execApActionAll = Ext.create('Ext.Action', {
            itemId  : 'execApActionAll',
            iconCls : 'af-plus-circle',
            disabled: true,
            text    : '정산 실행',
            handler : function (widget, event) {
                //결재사용인 경우 결재 경로 store 생성
                if (gm.me().useRouting == true) {
                    gm.me().rtgapp_store = Ext.create('Mplm.store.RtgappStore', {});
                }
                var pr_uid = gm.me().SELECTED_UID;
                var selectUids = [];
                var selections = gm.me().store.data.items;
                if (selections) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        console_logs('rec', rec);
                        selectUids.push(rec.get('unique_id_long'));
                    }
                }
                var seller_code = selections[0]['data']['seller_code'];
                var seller_name = selections[0]['data']['seller_name'];
                var txt_name = '[' + seller_code + '] ' + seller_name + ' - ' + (new Date()).getFullYear() + '년' + ((new Date()).getMonth() + 1) + '월';
                var myHeight = (gm.me().useRouting == true) ? 500 : 200;
                var myWidth = 600;

                var formItems = [
                    {
                        fieldLabel: '정산 구분',
                        xtype     : 'textarea',
                        rows      : 4,
                        anchor    : '100%',
                        labelWidth: 70,
                        //id: 'text_content',
                        name : 'txt_name',
                        style: 'width: 100%',
                        value: txt_name
                    }, new Ext.form.Hidden({
                        name : 'unique_uids',
                        value: selectUids
                    })
                ];

                var form = Ext.create('Ext.form.Panel', {
                    id           : gu.id('formPanel'),
                    xtype        : 'form',
                    frame        : false,
                    border       : false,
                    width        : '100%',
                    bodyPadding  : 10,
                    region       : 'center',
                    layout       : 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },
                    items        : formItems
                })

                var items = [form];

                if (gm.me().useRouting == true) {

                    gm.me().rtgapp_store.load();
                    var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false});
                    var removeRtgapp = Ext.create('Ext.Action', {
                        itemId  : 'removeRtgapp',
                        glyph   : 'xf00d@FontAwesome',
                        text    : CMD_DELETE,
                        disabled: true,
                        handler : function (widget, event) {
                            Ext.MessageBox.show({
                                title  : delete_msg_title,
                                msg    : delete_msg_content,
                                buttons: Ext.MessageBox.YESNO,
                                fn     : gm.me().deleteRtgappConfirm,
                                // animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    });

                    var updown =
                        {
                            text        : '이동',
                            menuDisabled: true,
                            sortable    : false,
                            xtype       : 'actioncolumn',
                            width       : 70,
                            align       : 'center',
                            items       : [{
                                icon   : 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/up.png',
                                tooltip: 'Up',
                                handler: function (agridV, rowIndex, colIndex) {
                                    var record = gm.me().agrid.getStore().getAt(rowIndex);
                                    console_log(record);
                                    var unique_id = record.get('unique_id');
                                    console_log(unique_id);
                                    var direcition = -15;
                                    Ext.Ajax.request({
                                        url    : CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                        params : {
                                            direcition: direcition,
                                            unique_id : unique_id
                                        },
                                        success: function (result, request) {
                                            gm.me().rtgapp_store.load(function () {
                                            });
                                        }
                                    });

                                }


                            }, '-',
                                {
                                    icon   : 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/down.png',
                                    tooltip: 'Down',
                                    handler: function (agridV, rowIndex, colIndex) {

                                        var record = gm.me().agrid.getStore().getAt(rowIndex);
                                        console_log(record);
                                        var unique_id = record.get('unique_id');
                                        console_log(unique_id);
                                        var direcition = 15;
                                        Ext.Ajax.request({
                                            url    : CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                            params : {
                                                direcition: direcition,
                                                unique_id : unique_id
                                            },
                                            success: function (result, request) {
                                                gm.me().rtgapp_store.load(function () {
                                                });
                                            }
                                        });
                                    }

                                }]
                        };

                    var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false});

                    this.agrid = Ext.create('Ext.grid.Panel', {
                        //title: '결재경로',
                        store : gm.me().rtgapp_store,
                        border: true,
                        frame : true,
                        style : 'padding-left:10px;padding-right:10px;',
                        width : '100%',
                        //layout: 'fit',
                        scroll     : true,
                        selModel   : selModel,
                        columns    : [
                            {dataIndex: 'seq_no', text: '순서', width: 70, sortable: false}
                            , {dataIndex: 'user_id', text: '아이디', sortable: false}
                            , {dataIndex: 'user_name', text: '이름', flex: 1, sortable: false}
                            , {dataIndex: 'dept_name', text: '부서 명', width: 90, sortable: false}
                            , {dataIndex: 'gubun', text: '구분', width: 50, sortable: false}
                            , updown
                        ],
                        border     : false,
                        multiSelect: true,
                        frame      : false,
                        dockedItems: [{
                            xtype: 'toolbar',
                            cls  : 'my-x-toolbar-default2',
                            items: [
                                {
                                    xtype     : 'label',
                                    labelWidth: 20,
                                    text      : '결재 권한자 추가'//,
                                    //style: 'color:white;'

                                }, {
                                    id            : 'user_name',
                                    name          : 'user_name',
                                    xtype         : 'combo',
                                    fieldStyle    : 'background-color: #FBF8E6; background-image: none;',
                                    store         : userStore,
                                    labelSeparator: ':',
                                    emptyText     : dbm1_name_input,
                                    displayField  : 'user_name',
                                    valueField    : 'unique_id',
                                    sortInfo      : {field: 'user_name', direction: 'ASC'},
                                    typeAhead     : false,
                                    hideLabel     : true,
                                    minChars      : 2,
                                    width         : 200,
                                    listConfig    : {
                                        loadingText: 'Searching...',
                                        emptyText  : 'No matching posts found.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                        }
                                    },
                                    listeners     : {
                                        select: function (combo, record) {
                                            console_logs('Selected combo : ', combo);
                                            console_logs('Selected record : ', record);
                                            console_logs('Selected Value : ', record.get('unique_id'));

                                            var unique_id = record.get('unique_id');
                                            var user_id = record.get('user_id');
                                            Ext.Ajax.request({
                                                url    : CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
                                                params : {
                                                    useruid: unique_id,
                                                    userid : user_id
                                                    , gubun: 'D'
                                                },
                                                success: function (result, request) {
                                                    var result = result.responseText;
                                                    console_log('result:' + result);
                                                    if (result == 'false') {
                                                        Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
                                                    } else {
                                                        gm.me().rtgapp_store.load(function () {
                                                        });
                                                    }
                                                },
                                                failure: extjsUtil.failureMessage
                                            });
                                        }// endofselect
                                    }
                                },
                                '->', removeRtgapp

                            ]// endofitems
                        }] // endofdockeditems

                    }); // endof Ext.create('Ext.grid.Panel',

                    this.agrid.getSelectionModel().on({
                        selectionchange: function (sm, selections) {
                            if (selections.length) {
                                removeRtgapp.enable();
                            } else {
                                removeRtgapp.disable();
                            }
                        }
                    });

                    items.push(this.agrid);
                }

                var prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '정산실행',
                    width  : myWidth,
                    height : myHeight,
                    plain  : true,
                    items  : items,
                    buttons: [{
                        text   : CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    //결재사용인 경우 결재 경로 확인
                                    if (gm.me().useRouting == true) {
                                        var items = gm.me().rtgapp_store.data.items;
                                        console_logs('items.length', items.length);
                                        if (items.length < 2) {
                                            Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                                            return;
                                        }

                                        var ahid_userlist = new Array();
                                        var ahid_userlist_role = new Array();

                                        for (var i = 0; i < items.length; i++) {
                                            var rec = items[i];
                                            console_logs('items rec', rec);
                                            ahid_userlist.push(rec.get('usrast_unique_id'));
                                            ahid_userlist_role.push(rec.get('gubun'));
                                        }
                                        val['hid_userlist'] = ahid_userlist;
                                        val['hid_userlist_role'] = ahid_userlist_role;
                                    }

                                    var selections = gm.me().store.data.items;

                                    var supplier_code = selections[0].get('seller_code');
                                    var supplierUid = selections[0].get('sms_cnt');
                                    var item_name = selections[0].get('item_name');

                                    Ext.Ajax.request({
                                        url   : CONTEXT_PATH + '/account/arap.do?method=addPaymentComplete',
                                        params: {
                                            wgrast_uids      : selectUids,
                                            txt_name         : txt_name,
                                            txt_content      : item_name + ' 외 ' + selections.length + '건',
                                            supplier_code    : supplier_code,
                                            supplierUid      : supplierUid,
                                            reserved_varchar2: (new Date()).getFullYear() + '년' + ((new Date()).getMonth() + 1) + '월',
                                        },

                                        success: function (result, request) {
                                            gm.me().store.load();
                                            gm.me().supplierGrid.store.load();
                                            Ext.Msg.alert('안내', '정산을 요청하였습니다.', function () {
                                            });

                                            prWin.close();
                                        },// endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });// endofajax
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

            }
        });
        buttonToolbar.insert(1, this.writeBillHistory);
        buttonToolbar.insert(2, this.toogleVatYnAction);
        //buttonToolbar.insert(2, this.execApAction);
        this.purListSrch = Ext.create('Ext.Action', {
            itemId  : 'putListSrch',
            iconCls : 'af-search',
            text    : CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler : function (widget, event) {
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
            items : [this.createWest(), this.createCenter()]
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
    createCenter   : function () {/*자재목록 그리드*/
        this.grid.setTitle('입고목록');
        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            width : '55%',
            items : [this.grid]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections != null && selections.length > 0) {
                    gUtil.enable(gm.me().writeBillHistory);
                    gUtil.enable(gm.me().execApAction);
                    gUtil.enable(gm.me().toogleVatYnAction);
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
                    gUtil.disable(gm.me().writeBillHistory);
                    gUtil.disable(gm.me().toogleVatYnAction);
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
    createWest     : function () {/*요청서 목록*/
        this.removeAssyAction = Ext.create('Ext.Action', {
            itemId  : 'removeAssyAction',
            iconCls : 'af-remove',
            text    : 'Assy' + CMD_DELETE,
            disabled: true,
            handler : function (widget, event) {
                Ext.MessageBox.show({
                    title  : delete_msg_title,
                    msg    : delete_msg_content,
                    buttons: Ext.MessageBox.YESNO,
                    fn     : gm.me().deleteAssyConfirm,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.supplierStore = Ext.create('Mplm.store.SupastStore');
        this.supplierStore.getProxy().setExtraParam('only_date', 'T');

        var present = new Date();
        var day = present.getDate();
        var sdate;
        var edate;
        if(day < 15) {
            var syear = present.getFullYear();
            var smonth = present.getMonth() - 1;

            var eday_calc = new Date(syear, present.getMonth(), 0);
            var eday = eday_calc.getDate();
            sdate = new Date(syear, smonth, 1);
            edate = new Date(syear, smonth, eday);
        } else {
            var syear = present.getFullYear();
            var smonth = present.getMonth();

            var eday_calc = new Date(syear, present.getMonth() + 1, 0);
            var eday = eday_calc.getDate();

            sdate = new Date(syear, smonth, 1);
            edate = new Date(syear, smonth, eday);
        }

        var valSdate = Ext.Date.getFirstDateOfMonth(new Date());
        var valEdate = Ext.Date.getLastDateOfMonth(new Date());

        this.supplierGrid =
            Ext.create('Rfx.view.grid.AccountPayableGrid', {
                title      : '구매 공급사',// cloud_product_class,
                border     : true,
                resizable  : true,
                scroll     : true,
                collapsible: false,
                store      : this.supplierStore,
                multiSelect: true,
                selModel   : Ext.create("Ext.selection.CheckboxModel", {}),
                bbar       : Ext.create('Ext.PagingToolbar', {
                    store      : this.supplierStore,
                    displayInfo: true,
                    displayMsg : '범위: {0} - {1} [ 전체:{2} ]',
                    emptyMsg   : "표시할 항목이 없습니다."
                    , listeners: {
                        beforechange: function (page, currentPage) {

                        }
                    }

                }),
                dockedItems: [
                    {
                        dock : 'top',
                        xtype: 'toolbar',
                        cls  : 'my-x-toolbar-default2',
                        items: [
                            this.purListSrch
                        ]
                    },
                    {
                        dock : 'top',
                        xtype: 'toolbar',
                        cls  : 'my-x-toolbar-default1',
                        items: [{
                            xtype: 'label',
                            width: 40,
                            text : '기간',
                            style: 'color:white;'

                        }, {
                            id          : gu.id('s_date_arv'),
                            name        : 's_date',
                            format      : 'Y-m-d',
                            fieldStyle  : 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat  : 'Y-m-d',// 'Y-m-d H:i:s'
                            xtype       : 'datefield',
                            value       : sdate,
                            width       : 98

                        }, {
                            xtype: 'label',
                            text : "~",
                            style: 'color:white;'
                        }, {
                            id          : gu.id('e_date_arv'),
                            name        : 'e_date',
                            format      : 'Y-m-d',
                            fieldStyle  : 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat  : 'Y-m-d',// 'Y-m-d H:i:s'
                            xtype       : 'datefield',
                            value       : edate,
                            width       : 98

                        },
                            {
                                xtype  : 'button',
                                iconCls: 'af-arrow-left',
                                // text: "<",
                                style: 'color:white;',
                                //hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
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
                                xtype  : 'button',
                                iconCls: 'af-arrow-right',
                                style  : 'color:white;',
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
                                xtype            : 'triggerfield',
                                emptyText        : '공급사 명',
                                fieldStyle       : 'background-color: #d6e8f6; background-image: none;',
                                id               : 'query',
                                name             : 'query',
                                listeners        : {
                                    specialkey: function (field, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().supplierStore.getProxy().setExtraParam('query', Ext.getCmp('query').getValue());
                                            gm.me().supplierStore.load(function () {
                                            });
                                        }
                                    }
                                },
                                trigger1Cls      : Ext.baseCSSPrefix + 'form-clear-trigger',
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

        this.supplierStore.getProxy().setExtraParam('s_date', Ext.Date.format(s_date, 'Y-m-d'));
        this.supplierStore.getProxy().setExtraParam('e_date', Ext.Date.format(e_date, 'Y-m-d'));

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
            layout      : 'border',
            border      : true,
            region      : 'west',
            width       : '45%',
            layoutConfig: {columns: 2, rows: 1},

            items: [this.supplierGrid /*, myFormPanel*/]
        });

        return this.west;
    },
    rtgapp_store   : null,
    useRouting     : (vCompanyReserved4 == null) ? true : false,

    buttonToolbar3: Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text : '발행금액 : 0 / 총 수량 : 0'
        }]
    }),

    comcstStore: Ext.create('Mplm.store.ComCstStore', {}),

    accountsWayStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'ACCOUNTS_WAY'}),

    toogleVatYn: function (result) {
        if (result == 'yes') {
            var select = gm.me().grid.getSelectionModel().getSelection();
            console_logs('selects >>>>>>', select);
            if (select == null || select == undefined || select.length < 1) {
                Ext.MessageBox.alert('알림', '변경할 입고내역이 지정되지 않았습니다.');
                return null;
            }
            var wgrast_uids = [];
            for (var i = 0; i < select.length; i++) {
                var selects = select[i];
                wgrast_uids.push(selects.get('unique_id_long'));
            }
            gMain.setCenterLoading(true);
            // gm.me().loding_msg();
            Ext.Ajax.request({
                waitMsg: '처리중입니다.<br> 잠시만 기다려주세요.',
                url    : CONTEXT_PATH + '/account/arap.do?method=toogleVatYn',
                params : {
                    wgrast_uids: wgrast_uids
                },
                success: function (result, request) {
                    gMain.setCenterLoading(false);
                    // gm.me().stop_msg();
                    gm.me().store.load();
                    Ext.MessageBox.alert('알림', '처리 되었습니다.');
                },
                failure: extjsUtil.failureMessage
            });
            gMain.setCenterLoading(false);
        }
    },
});