Ext.define('Rfx2.view.gongbang.groupWare.FinancialLedgerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'user-view',

    initComponent: function () {
        this.initDefValue();

        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField({
            field_id: 'division'
            , store: "CommonCodeStore"
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , params: {parentCode: 'ACCOUNT_TYPE', hasNull: true}
            , innerTpl: '<div data-qtip="{system_code}">{codeName}</div>'
        });

        this.addSearchField('wa_name');

        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: "거래일",
            sdate: new Date(year, month, 1),
            edate: new Date()
        });

        Ext.each(this.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];

            switch (dataIndex) {
                case 'reg_no':
                    columnObj['renderer'] = function (value) {
                        if (value != null && value.length > 0) {
                            try {
                                value = value.split('-')[0] + '-*******';
                            } catch (error) {
                                value = '';
                            }
                        }
                        return value;
                    }
                    break;
            }
        });

        var removeButtons = ['INITIAL', 'UTYPE', 'COPY', 'REMOVE'];
        var toolbarOptions = {'REMOVE_BUTTONS': removeButtons};

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        //var buttonToolbar = this.createCommandToolbar2(toolbarOptions);
        var buttonToolbar = this.createCommandToolbar(toolbarOptions);
        this.createStore('Rfx.model.WthdRaw', [{
                property: 'unique_id',
                direction: 'DESC',
            }],
            10000/*pageSize*/
            , {}
            , ['wthdRaw']
        );

        this.store.load();

        this.createGrid(searchToolbar, buttonToolbar);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.addUserButton = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '신규등록',
            tooltip: '신규등록',
            disabled: false,
            handler: function () {
                gm.me().addSaleBook();
            }
        });

        // this.modifyUserButton = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     iconCls: 'af-edit',
        //     text: gm.getMC('CMD_MODIFY', '수정'),
        //     tooltip: '수정하기',
        //     disabled: true,
        //     handler: function () {
        //         // gm.me().deptStore.load();
        //         // gm.me().roleCodeStore.load();
        //         gm.me().modifySaleBook();
        //     }
        // });

        buttonToolbar.items.each(function (item, index, length) {
            if (index == 1 || index == 2) {
                buttonToolbar.items.remove(item);
            }
        })

        buttonToolbar.insert(1, this.addUserButton);
        buttonToolbar.insert(2, this.modifyUserButton);

        this.callParent(arguments);
        this.store.getProxy().setExtraParam('delete_flag', 'N');

        this.setGridOnCallback(function (selections) {
            console_logs('>>>>callback', selections);
            if (selections != null && selections.length > 0) {
                this.modifyUserButton.enable();
            } else {
                this.modifyUserButton.disable();
            }
        });
    },

    items: [],

    combstStore: Ext.create('Mplm.store.CombstStore', {}),

    Pre_TransactionStore: Ext.create('Mplm.store.CommonCodeExStore', {}),

    addSaleBook: function () {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '매입장부',
                    id: gu.id('registration'),
                    frame: true,
                    width: '200%',
                    height: '80%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        new Ext.form.Hidden({
                            name: 'dept_code',
                            id: gu.id('dept_code'),
                        }),
                        new Ext.form.Hidden({
                            name: 'dept_name',
                            id: gu.id('dept_name'),
                        }),
                        {
                            fieldLabel: '구분',
                            xtype: 'combo',
                            anchor: '100%',
                            id: gu.id('division'),
                            name: 'division',
                            displayField: 'name',
                            valueField: 'code',
                            store: {
                                fields: ['name', 'code'],
                                data: [
                                    {name: '매입', code: '매입'},
                                    {name: '매출', code: '매출'},
                                    {name: '부가세', code: '부가세'},
                                ]
                            },
                            listeners: {
                                select: function (combo, record) {
                                    if (gu.getCmp('division').getValue() == "매입") {
                                        gu.getCmp('expenditure').setEditable(false);

                                    } else if (gu.getCmp('division').getValue() == "매출") {
                                        gu.getCmp('price').setEditable(false);
                                    } else {
                                        gu.getCmp('expenditure').setEditable(false);
                                        gu.getCmp('price').setEditable(false);
                                    }
                                    console_logs('테스트', gu.getCmp('division').getValue());
                                }
                            }
                        },
                        {
                            id: gu.id('account_name'),
                            name: 'account_name',
                            fieldLabel: gm.me().getMC('account_name', '고객명'),
                            allowBlank: false,
                            xtype: 'combo',
                            width: '36%',
                            padding: '0 0 5px 30px',
                            fieldStyle: 'background-image: none;',
                            store: gm.me().combstStore,
                            emptyText: gm.me().getMC('msg_order_dia_prd_empty_msg', '선택해주세요'),
                            displayField: 'wa_name',
                            valueField: 'unique_id',
                            sortInfo: {field: 'account_name', direction: 'ASC'},
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{wa_name}</div>';
                                }
                            },

                        },
                        {
                            fieldLabel: '거래일자',
                            xtype: 'datefield',
                            width: '36%',
                            dataIndex: 'delivery_plan',
                            style: 'text-align:center',
                            css: 'edit-cell',
                            name: 'bill_reg_date',
                            id: gu.id('bill_reg_date'),
                            editor: {
                                xtype: 'datefield',
                                format: 'Y-m-d'
                            },
                            format: 'Y-m-d',
                            dateFormat: 'Y-m-d',
                            sortable: false,
                            value: new Date(),
                            renderer: Ext.util.Format.dateRenderer('Y-m-d')
                        },
                        {
                            fieldLabel: '금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '35%',
                            allowBlank: true,
                            id: gu.id('price'),
                            name: 'price',
                            value: 0,
                            listeners: {
                                change: function (sender, newValue, oldValue, opts, result, request) {
                                    var price = gu.getCmp('price').getValue();
                                    console_logs("price", price);
                                    // var vat = Number(price) / 10;
                                    // gu.getCmp('surtax').setValue(vat.toFixed(0));

                                    var price = gu.getCmp('price').getValue();

                                    var jsonData = Ext.decode(result.responseText);
                                    console_logs("price", price);
                                    if (price == null || price < 1) {
                                        gu.getCmp('balance').setValue(jsonData.datas[0].balance);

                                    }
                                },
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'price') {
                                        context.record.set('price', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                }

                            }
                        }, {
                            fieldLabel: 'VAT',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '35%',
                            allowBlank: true,
                            value: 0,
                            id: gu.id('surtax'),
                            name: 'surtax',
                            listeners: {
                                change: function (sender, newValue, oldValue, opts) {
                                    var price = gu.getCmp('price').getValue();
                                    var vat = gu.getCmp('surtax').getValue();

                                    var deposit = Number(price) + Number(vat);

                                    gu.getCmp('deposit').setValue(deposit.toFixed(0));

                                },
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'surtax') {
                                        context.record.set('surtax', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                }

                            }

                        },
                        // {
                        //     fieldLabel: '합계',
                        //     xtype: 'numberfield',
                        //     anchor: '100%',
                        //     width: '35%',
                        //     fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: right',
                        //     value: 0,
                        //     editable: false,
                        //     allowBlank: true,
                        //     id: gu.id('deposit'),
                        //     name: 'deposit',

                        // },
                        {
                            fieldLabel: '매출액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '35%',
                            allowBlank: true,
                            id: gu.id('expenditure'),
                            name: 'expenditure',

                        },
                        {
                            fieldLabel: '거래내용',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '35%',
                            allowBlank: true,
                            id: gu.id('description'),
                            name: 'description'
                        }
                    ]
                },

            ]
        });

        var myWidth = 500;
        var myHeight = 400;

        switch (vCompanyReserved4) {
            case 'KWLM01KR':
                gu.getCmp('registration').add(
                    {
                        fieldLabel: '급여산출여부',
                        xtype: 'combo',
                        anchor: '100%',
                        store: this.ynStore,
                        id: gu.id('budget_admin_flag'),
                        name: 'budget_admin_flag',
                        displayField: 'code_name_kr',
                        valueField: 'system_code',
                        allowBlank: true,
                        value: 'Y',
                        listConfig: {
                            getInnerTpl: function () {
                                return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                            }
                        }
                    }
                );
                myHeight += 45;
                break;
            default:
                break;
        }

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신규등록',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {

                            prWin.setLoading(true);

                            var val = form.getValues(false);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/account/arap.do?method=insertWdHistory',
                                params: {
                                    account_name: val['account_name'],
                                    description: val['description'],
                                    total_price: val['price'],
                                    surtax: val['surtax'],
                                    deposit: val['deposit'],
                                    balance: val['balance'],
                                    bill_reg_date: val['bill_reg_date'],
                                    division: val['division'],
                                    expenditure: val['expenditure']
                                },
                                success: function (result, request) {
                                    if (prWin) {
                                        prWin.setLoading(false);
                                        prWin.close();
                                    }
                                    gm.me().store.load();
                                    Ext.MessageBox.alert('확인', '매입장부 작성이 완료 되었습니다.');

                                }, //endofsuccess
                                failure: function () {
                                    prWin.setLoading(false);
                                    extjsUtil.failureMessage();
                                }
                            }); //endofajax
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
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

    modifySaleBook: function () {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('>>>>>rrr', rec);

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanelModify'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    id: gu.id('modification'),
                    title: '매입장부 수정',
                    frame: true,
                    width: '200%',
                    height: '80%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        new Ext.form.Hidden({
                            name: 'unique_id',
                            id: gu.id('unique_id'),
                            value: rec.get('unique_id_long')
                        }),
                        new Ext.form.Hidden({
                            name: 'dept_code',
                            id: gu.id('dept_code'),
                        }),
                        new Ext.form.Hidden({
                            name: 'dept_name',
                            id: gu.id('dept_name'),
                        }),
                        {
                            id: gu.id('account_name'),
                            name: 'account_name',
                            fieldLabel: gm.me().getMC('account_name', '고객명'),
                            allowBlank: false,
                            xtype: 'combo',
                            width: '36%',
                            padding: '0 0 5px 30px',
                            fieldStyle: 'background-image: none;',
                            store: gm.me().combstStore,
                            emptyText: gm.me().getMC('msg_order_dia_prd_empty_msg', '선택해주세요'),
                            displayField: 'wa_name',
                            valueField: 'unique_id',
                            sortInfo: {field: 'account_name', direction: 'ASC'},
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{wa_name}</div>';
                                }
                            },

                        },
                        {
                            fieldLabel: '거래일자',
                            xtype: 'datefield',
                            width: '36%',
                            dataIndex: 'delivery_plan',
                            style: 'text-align:center',
                            css: 'edit-cell',
                            name: 'bill_reg_date',
                            id: gu.id('bill_reg_date'),
                            value: rec.get('bill_reg_date'),
                            editor: {
                                xtype: 'datefield',
                                format: 'Y-m-d'
                            },
                            format: 'Y-m-d',
                            dateFormat: 'Y-m-d',
                            sortable: false,

                            renderer: Ext.util.Format.dateRenderer('Y-m-d')
                        },
                        {
                            fieldLabel: '금액',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '35%',
                            allowBlank: true,
                            id: gu.id('price'),
                            name: 'price',
                            fieldStyle: 'text-align:right',
                            value: rec.get('price'),
                            listeners: {
                                change: function (sender, newValue, oldValue, opts) {
                                    var price = gu.getCmp('price').getValue();
                                    var vat = Number(price) / 10;
                                    var deposit = Number(price) + Number(vat);

                                    gu.getCmp('surtax').setValue(vat.toFixed(0));
                                    gu.getCmp('deposit').setValue(deposit);

                                }
                            }
                        }, {
                            fieldLabel: 'VAT',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '35%',
                            allowBlank: true,
                            fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: right',
                            value: 0,
                            editable: false,
                            id: gu.id('surtax'),
                            name: 'surtax',
                            value: rec.get('surtax'),
                        }, {
                            fieldLabel: '합계',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '35%',
                            fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: right',
                            value: 0,
                            editable: false,
                            allowBlank: true,
                            id: gu.id('deposit'),
                            name: 'deposit',
                            value: rec.get('deposit'),
                        },
                        // {
                        //     fieldLabel: '잔액',
                        //     xtype: 'textfield',
                        //     anchor: '100%',
                        //     id: gu.id('balance'),
                        //     name: 'balance',
                        //     width: '35%',
                        //     fieldStyle: 'text-align:right',
                        //     id: gu.id('balance'),
                        //     value: rec.get('balance'),
                        // },
                        {
                            fieldLabel: '거래내용',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '35%',
                            allowBlank: false,
                            id: gu.id('description'),
                            name: 'description',
                            value: rec.get('description')
                        }
                    ]
                },

            ]
        });

        var myWidth = 500;
        var myHeight = 330;

        var storeCodeList = Ext.create('Ext.data.Store', {
            fields: ['code', 'code_nm', 'b_cate', 's_cate'],
            data: [
                {code: '01', code_nm: '신축', b_cate: 1, s_cate: '1101'},
                {code: '02', code_nm: '보수', b_cate: 2, s_cate: '1202'},
                {code: '03', code_nm: '증축', b_cate: 3, s_cate: '1301'}
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {

                        if (form.isValid()) {
                            var val = form.getValues(false);
                            prWin.setLoading(true);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/account/arap.do?method=editWdHistory',
                                params: {
                                    account_name: val['account_name'],
                                    description: val['description'],
                                    total_price: val['price'],
                                    surtax: val['surtax'],
                                    deposit: val['deposit'],
                                    balance: val['balance'],
                                    bill_reg_date: val['bill_reg_date'],
                                    unique_id: val['unique_id']
                                },
                                success: function (result, request) {
                                    if (prWin) {
                                        prWin.setLoading(false);
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '수정 되었습니다.');
                                    gm.me().store.load();
                                }, //endofsuccess
                                failure: function () {
                                    prWin.setLoading(false);
                                    extjsUtil.failureMessage();
                                }
                            }); //endofajax
                        }
                    }
                }
            }, {
                text: CMD_CANCEL,
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


});