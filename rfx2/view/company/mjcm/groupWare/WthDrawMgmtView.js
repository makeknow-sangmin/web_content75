Ext.define('Rfx2.view.company.mjcm.groupWare.WthDrawMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'inspect-category-def-view',

    poStore: Ext.create('Rfx2.store.company.hanjung.PoStore', {
        sorters: [{
            property: 'reserved_varcharh',
            direction: 'DESC'
        }]
    }),
    storeCubeDim: Ext.create('Rfx2.store.company.hanjung.WthInTypeStore', {}),
    storeViewProp: Ext.create('Rfx2.store.company.hanjung.WthOutTypeAllStore', {}),

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
        

        var coord_key3;
        var pj_uid;
        var unique_id;
        var reserved_timestamp1_str;
        var requestor;
        var total_price;
        var description;
        var reserved_varcharc;
        var reserved_varchard;
        var taxPrice;
        var supPrice;

        var out_wth_uid;
        var out_date;
        var out_requestor;
        var out_price;
        var out_description;

        var addWdOutHistory = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '출금내역 작성',
            tooltip: '출금내역 작성',
            disabled: true,
            handler: function () {
                console_logs('>>>> pj_uid >>>', pj_uid);
                gm.me().addWthOutWindow(pj_uid);
            }
        });

        
        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var s_date = gu.getCmp('s_date_arv').getValue();
                    var e_date = gu.getCmp('e_date_arv').getValue();
                    var reserved_varcharh = '';
                    var project_varchar2 = '';
                    var project_varchar3 = '';

                    if(Ext.getCmp('reserved_varcharh').getValue().length > 0){
                        reserved_varcharh = Ext.getCmp('reserved_varcharh').getValue();
                    }

                    if(Ext.getCmp('project_varchar2').getValue().length > 0){
                        project_varchar2 = Ext.getCmp('project_varchar2').getValue();
                    }

                    if(Ext.getCmp('project_varchar3').getValue().length > 0){
                        project_varchar3 = Ext.getCmp('project_varchar3').getValue();
                    }
                } catch (e) { 

                }
                gm.me().poStore.getProxy().setExtraParam('s_date', Ext.Date.format(s_date, 'Y-m-d'));
                gm.me().poStore.getProxy().setExtraParam('e_date', Ext.Date.format(e_date, 'Y-m-d'));
                gm.me().poStore.getProxy().setExtraParam('reserved_varcharh', '%'+reserved_varcharh+'%');
                gm.me().poStore.getProxy().setExtraParam('project_varchar2', '%'+project_varchar2+'%');
                gm.me().poStore.getProxy().setExtraParam('project_varchar3', '%'+project_varchar3+'%');
                gm.me().poStore.load();
            }
        });
        
        


        var poStatusTemplate = Ext.create('Ext.grid.Panel', {
            store: this.poStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            //selModel: Ext.create("Ext.selection.CheckboxModel", { mode: 'SINGLE'}),
            bbar: getPageToolbar(this.poStore),
            frame: false,
            layout: 'fit',
            forceFit: true,
            width: '100%',
            columns: [{
                text: '고객명/지입사',
                width: 198,
                sortable: true,
                align: "left",
                style: 'text-align:center',
                dataIndex: 'project_varchar2_Only_WithDrawVariable'
            }, {
                text: '차명',
                width: 180,
                sortable: true,
                align: "left",
                style: 'text-align:center',
                dataIndex: 'reserved_varchar3'
            }, {
                text: '영업사원',
                width: 85,
                sortable: true,
                align: "left",
                style: 'text-align:center',
                dataIndex: 'pmWithCount'
            }, {
                text: '실견적가(VAT)',
                style: 'text-align:center',
                width: 120,
                sortable: true,
                xtype: "numbercolumn",
                format: "0,000",
                align: "right",
                dataIndex: 'realEstiTotalPrice'
            },{
                text: '입금액',
                style: 'text-align:center',
                width: 120,
                xtype: "numbercolumn",
                format: "0,000",
                align: "right",
                dataIndex: 'deposit_price'
            }, {
                text: '출금액',
                style: 'text-align:center',
                width: 120,
                xtype: "numbercolumn",
                format: "0,000",
                align: "right",
                dataIndex: 'withdraw_price'
            },{
                text: '작업비',
                style: 'text-align:center',
                width: 120,
                xtype: "numbercolumn",
                format: "0,000",
                align: "right",
                dataIndex: 'work_exp'
            },{
                text: '환급금',
                style: 'text-align:center',
                xtype: "numbercolumn",
                width: 120,
                format: "0,000",
                align: "right",
                dataIndex: 'up_refund'
            },{
                text: '미수금',
                style: 'text-align:center',
                xtype: "numbercolumn",
                format: "0,000",
                width: 120,
                align: "right",
                renderer: function (value, meta) {
                    if (value > 0) {
                        meta.style = "background-color:red;color:#ffffff;text-align:right;text-format:0,000";
                    }
                    value = Ext.util.Format.number(value, '0,000');
                    return value;
                },
                dataIndex: 'receivables'
            },{
                text: '이익금',
                style: 'text-align:center',
                xtype: "numbercolumn",
                format: "0,000",
                width: 120,
                align: "right",
                dataIndex: 'profit'
            } ]
        });
        this.poStore.getProxy().setExtraParam('detail_flag', 'Y');
        this.poStore.getProxy().setExtraParam('not_pj_type', 'NP');
        this.poStore.load();
        // this.crudMode = 'CREATE';

        poStatusTemplate.getSelectionModel().on({
            selectionchange: function (sm, selections) {

                if (selections.length > 0) {
                    gm.me().storeCubeDim.getProxy().setExtraParam('pj_uid', selections[0].get('ac_uid'));
                    gm.me().storeCubeDim.load();
                    gm.me().storeViewProp.getProxy().setExtraParam('pj_uid', selections[0].get('ac_uid'));
                    gm.me().storeViewProp.load();
                    //addIssueBillHistory.enable();
                    pj_uid = selections[0].get('ac_uid');
                    reserved_varcharc = selections[0].get('reserved_varcharc');
                    reserved_varchard = selections[0].get('reserved_varchard');
                }
            }
        });

        var temp = {
            title: '입/출금현황',
            collapsible: true,
            frame: true,
            region: 'west',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 2.0,
            items: [poStatusTemplate],
            dockedItems: [
                {
				    dock: 'top',
				    xtype: 'toolbar',
				    cls: 'my-x-toolbar-default2',
					items: [
						this.purListSrch//, 
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
                        value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
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
                        value: new Date(),
                        width: 98
                    }, {
                        xtype:'triggerfield',
                        emptyText: '수주번호',
                        id: gu.id('reserved_varcharh'),
                        fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                        name: 'query_sup',
                        listeners : {
                            specialkey : function(field, e) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().poStore.getProxy().setExtraParam('reserved_varcharh', '%'+gu.getCmp('reserved_varcharh').getValue()+'%');
                                    gm.me().poStore.load(function() {});
                                }
                            }
                        },
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        'onTrigger1Click': function() {
                            Ext.getCmp('reserved_varcharh').setValue('');
                            this.poStore.getProxy().setExtraParam('reserved_varcharh', gu.getCmp('reserved_varcharh').getValue());
                            this.poStore.load(function() {});
                        }
                    },{
                        xtype:'triggerfield',
                        emptyText: '고객명',
                        id: gu.id('project_varchar2'),
                        fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                        name: 'query_sup',
                        listeners : {
                            specialkey : function(field, e) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().poStore.getProxy().setExtraParam('project_varchar2', '%'+gu.getCmp('project_varchar2').getValue()+'%');
                                    gm.me().poStore.load(function() {});
                                }
                            }
                        },
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        'onTrigger1Click': function() {
                            Ext.getCmp('project_varchar2').setValue('');
                            this.poStore.getProxy().setExtraParam('project_varchar2', gu.getCmp('project_varchar2').getValue());
                            this.poStore.load(function() {});
                        }
                    },{
                        xtype:'triggerfield',
                        emptyText: '차명',
                        id: gu.id('project_varchar3'),
                        fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                        name: 'query_sup',
                        listeners : {
                            specialkey : function(field, e) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().poStore.getProxy().setExtraParam('project_varchar3', '%'+gu.getCmp('project_varchar3').getValue()+'%');
                                    gm.me().poStore.load(function() {});
                                }
                            }
                        },
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        'onTrigger1Click': function() {
                            Ext.getCmp('project_varchar3').setValue('');
                            this.poStore.getProxy().setExtraParam('project_varchar3', gu.getCmp('project_varchar3').getValue());
                            this.poStore.load(function() {});
                        }
                    }]
                }
            ]
        };

        var gridDimension = Ext.create('Ext.grid.Panel', {
            store: this.storeCubeDim,
            cls: 'rfx-panel',
            collapsible: true,
            multiSelect: false,
            autoScroll: true,
            title: '입금내역 상세현황',
            autoHeight: true,
            frame: true,
            reigon: 'center',
            layout: 'fit',
            forceFit: true,
            flex: 0.5,
            columns: [{
                text: '요청일',
                xtype: 'datecolumn',
                format: 'Y-m-d',
                align: 'left',
                width: 25,
                style: 'text-align:center',
                dataIndex: 'request_date'
            }, {
                text: '구분',
                width: 60,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'sub_type_kr'
            }, {
                text: '입금액',
                width: 25,
                align: 'right',
                xtype: "numbercolumn",
                format: "0,000",
                style: 'text-align:center',
                dataIndex: 'price'
            }, {
                text: '입금자',
                width: 30,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'requestor'
            },{
                text: '비고',
                width: 30,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'description'
            }],
            dockedItems: [
            {
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2'
            }
        ]
        });

        gridDimension.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    var rec = selections[0];
                    console_logs('>>>> rec', rec);
                    pj_uid = selections[0].get('ac_uid');
                    out_wth_uid = selections[0].get('unique_id');
                    out_date = selections[0].get('requestDateStr');
                    out_requestor = selections[0].get('requestor');
                    out_price = selections[0].get('price');
                    out_description = selections[0].get('description');
                    sub_type = selections[0].get('sub_type_kr');
                    editWdOutHistory.enable();
                    deleteWdInAction.enable();
                }
            }
        });

        var gridViewprop = Ext.create('Ext.grid.Panel', {
            title: '출금내역 상세현황',
            cls: 'rfx-panel',
            collapsible: true,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            store: this.storeViewProp,

            reigon: 'south',
            layout: 'fit',
            forceFit: true,
            flex: 0.5,
            columns: [{
                text: '요청일',
                xtype: 'datecolumn',
                format: 'Y-m-d',
                align: 'left',
                width: 25,
                style: 'text-align:center',
                dataIndex: 'request_date'
            }, {
                text: '구분',
                width: 25,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'sub_type_kr'
            }, {
                text: '출금액',
                width: 23,
                align: 'right',
                xtype: "numbercolumn",
                format: "0,000",
                style: 'text-align:center',
                dataIndex: 'price'
            }, {
                text: '계좌번호',
                width: 30,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'acc_no'
            },{
                text: '예금주',
                width: 30,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'requestor'
            }, {
                text: '비고',
                width: 30,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'description'
            }
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2'
                }
            ]
        });


        gridViewprop.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    var rec = selections[0];
                    console_logs('>>>> rec', rec);
                    coord_key3 = selections[0].get('coordkey_3');
                    bill_date = selections[0].get('reserved_timestamp1_str');
                    requestor = selections[0].get('reserved_varchar1');
                    description = selections[0].get('reserved_varchar2');
                    total_price = selections[0].get('total_price');
                    reserved_timestamp1_str = selections[0].get('reserved_timestamp1_str');
                    supPrice = selections[0].get('reserved_double1');
                    taxPrice = selections[0].get('reserved_double2');
                    unique_id = selections[0].get('unique_id');
                    editWdOutHistory.enable();
                    deleteWdOutAction.enable();
                    // checkedIssueBillOut.enable();
                }
            }
        });

        var temp2 = {
            //title: '출금관리',
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

    addWthInWindow: function (pj_uid) {

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
                    title: '입금내역',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '구분',
                            xtype: 'combo',
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            store: Ext.create('Rfx2.store.company.hanjung.WithdrawGubunInTypeStore', {}),
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            anchor: '100%',
                            width: '99%',
                            name: 'sub_type',
                        },
                        {
                            fieldLabel: '입금일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'request_date',
                            value: new Date()
                        }, {
                            fieldLabel: '담당자',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'requestor',
                            value: vCUR_USER_NAME
                        }, {
                            fieldLabel: '금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'total_price'
                        }, {
                            fieldLabel: '비고',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'description'
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '입금내역 작성',
            width: 500,
            height: 270,
            plain: true,
            items: form,
            buttons: [{
                text: '저장',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var sub_type = val['sub_type'];
                            var request_date = val['request_date'];
                            var requestor = val['requestor'];
                            var total_price = val['total_price'];
                            var description = val['description'];
                            form.submit({
                                url: CONTEXT_PATH + '/account/arap.do?method=insertWdHistory&type=I',
                                waitMsg: '입금내역을 저장중입니다.',
                                params: {
                                    sub_type: sub_type,
                                    request_date: request_date,
                                    requestor: requestor,
                                    total_price: total_price,
                                    description: description,
                                    pj_uid: pj_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }
                }
            }, {
                text: '취소',
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

    addBillList: function (pj_uid) {
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
                    title: '내역작성',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '발행일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'request_date',
                            value: new Date()
                        }, {
                            fieldLabel: '상호',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'requestor',
                        }, {
                            fieldLabel: '품목',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'description'
                        }, {
                            layout: {
                                type: 'hbox',
                                align: 'left'
                            },
                            items: [
                                {
                                    fieldLabel: '공급가액',
                                    xtype: 'numberfield',
                                    margin: '0 3 0 0',
                                    width: 600,
                                    name: 'supplier_price',
                                    id: gu.id('supplier_price_field')
                                },
                                {
                                    xtype: 'button',
                                    width: 160,
                                    text: '세액/합계금액 계산',
                                    listeners: {
                                        click: function () {
                                            var target1 = gu.getCmp('tax_price_field');
                                            var target2 = gu.getCmp('total_price_field');
                                            var sup = gu.getCmp('supplier_price_field').getValue();
                                            var tax = sup * 0.1;
                                            var total = sup + tax;
                                            target1.setValue(tax);
                                            target2.setValue(total);
                                        }
                                    }
                                }
                            ]

                        }, {
                            fieldLabel: '세액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'tax_price',
                            id: gu.id('tax_price_field')
                        },{
                            fieldLabel: '합계금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'total_price',
                            id: gu.id('total_price_field'),
                            listeners: {
                                specialkey: function (f, e) {
                                    if (e.getKey() == e.ENTER) {
                                        var target1 = gu.getCmp('supplier_price_field');
                                        var ratio = 11/10;
                                        var includeTaxPrice = gu.getCmp('total_price_field').getValue();
                                        var exceptTaxPrice =  includeTaxPrice / ratio;
                                        target1.setValue(exceptTaxPrice);

                                        var target2 = gu.getCmp('tax_price_field');
                                        var taxPrice = includeTaxPrice - exceptTaxPrice ;
                                        target2.setValue(taxPrice);
                                    }
                                }
                            }
                        }, {
                            xtype: 'label',
                            width: 500,
                            height: 20,
                            text: '☞ 합계금액(부가세 포함) 금액을 입력 후 Enter를 누르면 공급가, 세액을 자동계산합니다.',
                            style: 'color:blue; align:right'
                        }
                    ]
                }
            ]


        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '매입계산서 내역 작성',
            width: 800,
            height: 300,
            plain: true,
            items: form,
            buttons: [{
                text: '저장',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var request_date = val['request_date'];
                            var requestor = val['requestor'];
                            var total_price = val['total_price'];
                            var sup_price = val['supplier_price'];
                            var tax_price = val['tax_price'];
                            var description = val['description'];
                            form.submit({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=insertPurBillList',
                                waitMsg: '내역을 저장중입니다.',
                                params: {
                                    request_date: request_date,
                                    requestor: requestor,
                                    total_price: total_price,
                                    description: description,
                                    sup_price: sup_price,
                                    tax_price: tax_price,
                                    pj_uid: pj_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }
                }
            }, {
                text: '취소',
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



    editWthInWindow: function (in_wth_uid, in_date, in_requestor, in_description, in_price, sub_type) {
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
                    title: '입금내역',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '구분',
                            xtype: 'combo',
                            displayField: 'code_name_kr',
                            valueField: 'code_name_kr',
                            store: Ext.create('Rfx2.store.company.hanjung.WithdrawGubunInTypeStore', {}),
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            anchor: '100%',
                            width: '99%',
                            name: 'sub_type',
                            value: sub_type
                        },
                        {
                            fieldLabel: '입금일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'request_date',
                            value: in_date
                        }, {
                            fieldLabel: '입/출금자',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'requestor',
                            value: in_requestor
                        }, {
                            fieldLabel: '금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'total_price',
                            value: in_price
                        }, {
                            fieldLabel: '비고',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'description',
                            value: in_description
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '입금내역 수정',
            width: 500,
            height: 270,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_MODIFY', '수정'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var sub_type = val['sub_type'];
                            var request_date = val['request_date'];
                            var requestor = val['requestor'];
                            var total_price = val['total_price'];
                            var description = val['description'];
                            form.submit({
                                url: CONTEXT_PATH + '/account/arap.do?method=editWdHistory&type=I',
                                waitMsg: '입금내역을 수정중입니다.',
                                params: {
                                    sub_type: sub_type,
                                    request_date: request_date,
                                    requestor: requestor,
                                    total_price: total_price,
                                    description: description,
                                    unique_id: in_wth_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '수정 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }
                }
            }, {
                text: '취소',
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
    editBillHistoryWindow: function (requestor, description, reserved_timestamp1_str, total_price, supPrice, taxPrice, unique_id, pj_uid) {
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
                    title: '내역수정',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '발행일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'request_date',
                            value: reserved_timestamp1_str
                        }, {
                            fieldLabel: '상호',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'requestor',
                            value: requestor
                        }, {
                            fieldLabel: '품목',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'description',
                            value: description
                        }, {
                            layout: {
                                type: 'hbox',
                                align: 'left'
                            },
                            items: [
                                {
                                    fieldLabel: '공급가액',
                                    xtype: 'numberfield',
                                    margin: '0 3 0 0',
                                    width: 600,
                                    name: 'supplier_price',
                                    id: gu.id('supplier_price_field_edit'),
                                    value: supPrice
                                },
                                {
                                    xtype: 'button',
                                    width: 160,
                                    text: '세액/합계금액 계산',
                                    listeners: {
                                        click: function () {
                                            var target1 = gu.getCmp('tax_price_field_edit');
                                            var target2 = gu.getCmp('total_price_field_edit');
                                            var sup = gu.getCmp('supplier_price_field_edit').getValue();
                                            var tax = sup * 0.1;
                                            var total = sup + tax;
                                            target1.setValue(tax);
                                            target2.setValue(total);
                                        }
                                    }
                                }
                            ]

                        }, {
                            fieldLabel: '세액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'tax_price',
                            id: gu.id('tax_price_field_edit'),
                            value: taxPrice
                        }, {
                            fieldLabel: '합계금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'total_price',
                            value: total_price,
                            id: gu.id('total_price_field_edit')
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '계산서내역 수정',
            width: 800,
            height: 300,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_MODIFY', '수정'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var request_date = val['request_date'];
                            var requestor = val['requestor'];
                            var total_price = val['total_price'];
                            var description = val['description'];
                            var taxPrice = val['tax_price'];
                            var supplier_price = val['supplier_price'];
                            form.submit({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=modifyBillList',
                                waitMsg: '수정중입니다.',
                                params: {
                                    request_date: request_date,
                                    requestor: requestor,
                                    total_price: total_price,
                                    description: description,
                                    pj_uid: pj_uid,
                                    unique_id: unique_id,
                                    tax_price: taxPrice,
                                    sup_price: supplier_price,
                                    coord_key3: pj_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '수정 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }
                }
            }, {
                text: '취소',
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

    addBillDate: function (wth_uid, pj_uid) {
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
                    title: '계산서 발행일을 입력하세요.',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '발행일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'bill_reg_date',
                            value: new Date()
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '계산서발행일 등록',
            width: 400,
            height: 150,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_Enrollment', '등록'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var bill_reg_date = val['bill_reg_date'];

                            form.submit({
                                url: CONTEXT_PATH + '/account/arap.do?method=addBillDate',
                                waitMsg: '계산서 발행일을 등록중입니다.',
                                params: {
                                    bill_reg_date: bill_reg_date,
                                    pj_uid: pj_uid,
                                    unique_id: wth_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '등록되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }
                }
            }, {
                text: '취소',
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

    addWthOutWindow: function (pj_uid) {
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
                    title: '출금내역',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '구분',
                            xtype: 'combo',
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            store: Ext.create('Rfx2.store.company.hanjung.WithdrawGubunStore', {}),
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            anchor: '100%',
                            width: '99%',
                            name: 'sub_type',
                        },
                        {
                            fieldLabel: '출금일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'request_date',
                            value: new Date()
                        },{
                            fieldLabel: '금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'total_price'
                        },{
                            fieldLabel: '계좌번호',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'account_no'
                        },{
                            fieldLabel: '예금주',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'requestor'
                        }, {
                            fieldLabel: '비고',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'description'
                        },{
                            xtype: 'checkbox',
                            anchor: '100%',
                            width: '99%',
                            id: gu.id('incomeReportYn'),
                            field_id: 'incomeReportYn',
                            boxLabel: '소득신고여부',
                            checked: true
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '출금내역 작성',
            width: 500,
            height: 300,
            plain: true,
            items: form,
            buttons: [{
                text: '저장',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var sub_type = val['sub_type'];
                            var request_date = val['request_date'];
                            var requestor = val['requestor'];
                            var total_price = val['total_price'];
                            var description = val['description'];
                            var reportYn = 'N'
                            if(gu.getCmp('incomeReportYn').checked) {
                                reportYn = 'Y';
                            }
                            form.submit({
                                url: CONTEXT_PATH + '/account/arap.do?method=insertWdHistory&type=O',
                                waitMsg: '출금내역을 저장중입니다.',
                                params: {
                                    sub_type: sub_type,
                                    request_date: request_date,
                                    requestor: requestor,
                                    total_price: total_price,
                                    description: description,
                                    pj_uid: pj_uid,
                                    reportYn : reportYn
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }
                }
            }, {
                text: '취소',
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

    editWthOutWindow: function (out_wth_uid, out_date, out_requestor, out_description, out_price, sub_type) {
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
                    title: '출금내역 수정',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '구분',
                            xtype: 'combo',
                            displayField: 'code_name_kr',
                            valueField: 'code_name_kr',
                            store: Ext.create('Rfx2.store.company.hanjung.WithdrawGubunStore', {}),
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            anchor: '100%',
                            width: '99%',
                            name: 'sub_type',
                            value: sub_type
                        },
                        {
                            fieldLabel: '출금일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'request_date',
                            value: out_date
                        }, {
                            fieldLabel: '출금자',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'requestor',
                            value: out_requestor
                        }, {
                            fieldLabel: '금액',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'total_price',
                            value: out_price
                        }, {
                            fieldLabel: '비고',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'description',
                            value: out_description
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '출금내역 수정',
            width: 500,
            height: 270,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_MODIFY', '수정'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var sub_type = val['sub_type'];
                            var request_date = val['request_date'];
                            var requestor = val['requestor'];
                            var total_price = val['total_price'];
                            var description = val['description'];
                            form.submit({
                                url: CONTEXT_PATH + '/account/arap.do?method=editWdHistory&type=O',
                                waitMsg: '출금내역을 수정중입니다.',
                                params: {
                                    sub_type: sub_type,
                                    request_date: request_date,
                                    requestor: requestor,
                                    total_price: total_price,
                                    description: description,
                                    unique_id: out_wth_uid
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '수정 되었습니다.');
                                    gm.me().poStore.load(function () {
                                    });
                                    gm.me().storeCubeDim.load(function () {
                                    });
                                    gm.me().storeViewProp.load(function () {
                                    });
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }
                }
            }, {
                text: '취소',
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

    attachedCertificate: function (pj_uid, type) {
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
                    title: '첨부할 사업자 등록증 파일을 첨부하세요.',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '파일첨부',
                            xtype: 'filefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'fileupload',
                            buttonText: '찾아보기',
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '사업자등록증 첨부',
            width: 400,
            height: 150,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_Enrollment', '등록'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            form.submit({
                                url: CONTEXT_PATH + '/uploader.do?method=uploadCertiHj',
                                waitMsg: '파일 첨부중 입니다.',
                                params: {
                                    pj_uid: pj_uid,
                                    pj_code: type
                                },
                                success: function (val, action) {
                                    var loadPage = new Ext.LoadMask({
                                        msg: 'Loading',
                                        visible: true,
                                        target: prWin
                                    });
                                    loadPage.show();
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=updateUploadCertiStatus',
                                        params: {
                                            type: 'CERTI',
                                            pj_uid: pj_uid,
                                        },
                                        success: function (result, request) {
                                            if (prWin) {
                                                prWin.close();
                                            }
                                            Ext.MessageBox.alert('확인', '첨부 되었습니다.');
                                        }
                                    });
                                    gm.me().poStore.load(function () {
                                    });
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }
                }
            }, {
                text: '취소',
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

    attachedIdCard: function (pj_uid, type) {
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
                    title: '첨부할 신분증 파일을 첨부하세요.',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '파일첨부',
                            xtype: 'filefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'fileupload',
                            buttonText: '찾아보기',
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '신분증 첨부',
            width: 400,
            height: 150,
            plain: true,
            items: form,
            buttons: [{
                text: gm.getMC('CMD_Enrollment', '등록'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            form.submit({
                                url: CONTEXT_PATH + '/uploader.do?method=uploadCertiHj',
                                waitMsg: '파일 첨부중 입니다.',
                                params: {
                                    pj_uid: pj_uid,
                                    pj_code: type
                                },
                                success: function (val, action) {
                                    var loadPage = new Ext.LoadMask({
                                        msg: 'Loading',
                                        visible: true,
                                        target: prWin
                                    });
                                    loadPage.show();
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=updateUploadCertiStatus',
                                        params: {
                                            type: 'ID',
                                            pj_uid: pj_uid,
                                        },
                                        success: function (result, request) {
                                            if (prWin) {
                                                prWin.close();
                                            }
                                            Ext.MessageBox.alert('확인', '첨부 되었습니다.');
                                        }
                                    });
                                    gm.me().poStore.load(function () {
                                    });
                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                    }
                                }
                            });
                        }
                    }
                }
            }, {
                text: '취소',
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