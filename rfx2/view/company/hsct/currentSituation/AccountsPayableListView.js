Ext.define('Rfx2.view.company.hsct.currentSituation.AccountsPayableListView', {
    extend: 'Rfx2.base.BaseView',
    xtype : 'recv-po-ver-view',

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

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

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

        this.addSearchField({
            type: 'dateRange',
            field_id: 'reserved_timestamp1',
            text: "신고월",
            sdate: Ext.Date.add(new Date(new Date().getFullYear(), new Date().getMonth() - 12, 1)),
            edate: new Date()
        });

        this.addSearchField({
            type: 'combo',
            field_id: 'state'
            , emptyText: '상태'
            , store: "CommonCodeStore"
            , params: {parentCode: 'BILL_STATE_COMBO'}
            , displayField: 'code_name_kr'
            , valueField: 'system_code'
            , value: 'code_name_kr'
            , innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>'
        });

        this.addSearchField('supplier_name');

        this.toogleBillRegistatorState = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-step_forward_14_0_5395c4_none',
            text    : '계산서 접수/취소',
            tooltip : '상태를 계산서 접수 상태로 변경 또는 취소합니다.',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('toogleBillRegistatorState'),
            handler : function () {
                //  gMain.selPanel.doRequestProduce();
                var select = gm.me().grid.getSelectionModel().getSelection();
                var selects = select[0];
                var state = selects.get('state');
                var currency = selects.get('reserved_varchar3');
                var msg = '';
                if (state === 'A') {
                    msg = '상태를 접수 상태로 변경하시겠습니까?';
                } else if (state === 'R') {
                    msg = '상태를 마감전 상태로 변경하시겠습니까?';
                } else if (state === 'C') {
                    Ext.MessageBox.alert('알림', '최종확정 상태에서는 실행이 불가합니다.');
                    return;
                }
                var myWidth = 0;
                var myHeight =  0;
                var shipmentTypeStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'GR_FINAL_GUBUN'});
                shipmentTypeStore.load();


                if(state === 'A') {
                    // form 형태로 변경되어 정보입력 상태로 변경
                    if(currency !== 'KRW') {
                        // 환율이 KRW가 아닌 것도 내수마감을 해야 하는 경우도 있다고 함.
                        // 따라서 해당 항목에 적용환율도 입력해줘야 함.
                        myWidth = 500;
                        myHeight =  330;


                        var formItems = Ext.create('Ext.form.Panel', {
                            id           : gu.id('aprvForms'),
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
                                    title   : '계산서 접수에 필요한 정보를 입력합니다.',
                                    defaults: {
                                        margin: '2 2 2 2'
                                    },
                                    items   : [
                                        {
                                            fieldLabel: '신고일자',
                                            xtype     : 'datefield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            name      : 'reserved_timestamp1',
                                            format : 'Y-m-d',
                                            editable  : true,
                                            allowBlank :  false,
                                            value : new Date(),
                                            listeners: {
                                                change : function () {
                                                    console_logs('Date selected: ', this.getValue());
                                                    var selDate = this.getValue();
                                                    var year = selDate.getFullYear();
                                                    var month = ((selDate).getMonth() + 1) < 10 ? '0' + ((selDate).getMonth() + 1) : ((selDate).getMonth() + 1);
                                                    var day = (selDate.getDate()) < 10 ? '0' + selDate.getDate() : selDate.getDate();
                                                    var fullDate = year + '-' + month + '-' + day;

                                                    Ext.Ajax.request({
                                                        url: CONTEXT_PATH + '/account/arap.do?method=getExchangeRateByRepDate',
                                                        params: {
                                                            report_date: fullDate,
                                                            currency: currency,
                                                        },
                                                        success: function (result, request) {
                                                            var result2 = result.responseText;
                                                            console_logs('result2 ???', result2);
                                                            gu.getCmp('apply_price').setValue(result2);
                                                            if(Number(result2) === 0) {
                                                                Ext.MessageBox.alert('알림','해당 일자에 해당하는 환율정보가 존재하지 않습니다.<br>적용환율은 1로 정의됩니다.');
                                                                gu.getCmp('apply_price').setValue(1.0);
                                                            }
                                                        },
                                                        failure: extjsUtil.failureMessage,
                                                    });

                                                }
                                            }
                                        },
                                        {
                                            fieldLabel: '증빙번호',
                                            xtype     : 'textfield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            name      : 'reserved_varchar5',
                                            editable  : true,
                                            allowBlank :  true
                                        },
                                        {
                                            fieldLabel: '구분',
                                            xtype     : 'combo',
                                            store: shipmentTypeStore,
                                            anchor    : '100%',
                                            width     : '99%',
                                            name      : 'reserved_varchar4',
                                            editable  : true,
                                            allowBlank :  true,
                                            valueField: 'systemCode',
                                            value : 'B',
                                            displayField: 'codeName',
                                            emptyText: '선택해주세요.',
                                            listConfig: {
                                                loadingText: '검색중...',
                                                emptyText: '일치하는 항목 없음',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{}">{codeName}</div>';
                                                }
                                            }
                                        },
                                    ]
                                },
                                {
                                    xtype   : 'fieldset',
                                    frame   : true,
                                    width   : '100%',
                                    height  : '100%',
                                    layout  : 'fit',
                                    title   : '환율이 KRW가 아닌경우 내수마감을 실행 시<br>기준환율을 기입하여 주시기 바랍니다.<br><b>내수마감이 선택되지 않은 경우 아래 적용환율은 적용되지 않습니다.</b>',
                                    defaults: {
                                        margin: '2 2 2 2'
                                    },
                                    items   : [
                                        {
                                            fieldLabel: '적용환율',
                                            id        : gu.id('apply_price'),
                                            xtype     : 'numberfield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            editable  : true,
                                            name      : 'attach_price',
                                            decimalPrecision: 4,
                                            value : 0,
                                            allowBlank :  true
                                        },
                                    ]
                                },
                            ]
                        });
                    } else {
                        myWidth = 500;
                        myHeight =  230;
                        var formItems = Ext.create('Ext.form.Panel', {
                            id           : gu.id('aprvForms'),
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
                                    title   : '계산서 접수에 필요한 정보를 입력합니다.',
                                    defaults: {
                                        margin: '2 2 2 2'
                                    },
                                    items   : [
                                        {
                                            fieldLabel: '신고일자',
                                            xtype     : 'datefield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            format : 'Y-m-d',
                                            name      : 'reserved_timestamp1',
                                            editable  : true,
                                            allowBlank : false,
                                            value : new Date()
                                        },
                                        {
                                            fieldLabel: '증빙번호',
                                            xtype     : 'textfield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            name      : 'reserved_varchar5',
                                            editable  : true,
                                            allowBlank : true,
                                        },

                                        {
                                            fieldLabel: '구분',
                                            xtype     : 'combo',
                                            anchor    : '100%',
                                            width     : '99%',
                                            store: shipmentTypeStore,
                                            value : 'A',
                                            name      : 'reserved_varchar4',
                                            valueField: 'systemCode',
                                            displayField: 'codeName',
                                            emptyText: '선택해주세요.',
                                            listConfig: {
                                                loadingText: '검색중...',
                                                emptyText: '일치하는 항목 없음',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{}">{codeName}</div>';
                                                }
                                            }
                                        },
                                    ]
                                },
                            ]
                        });
                    }


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
                        title  : '계산서 접수',
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
                                        Ext.MessageBox.show({
                                            title  : '추가',
                                            msg    : '입력한 항목을 추가하시겠습니까?',
                                            buttons: Ext.MessageBox.YESNO,
                                            fn     : function (btn) {
                                                if (btn == 'yes') {
                                                    // 여기서 동작 Action
                                                    form.submit({
                                                        submitEmptyText: false,
                                                        url            : CONTEXT_PATH + '/account/arap.do?method=billRegisterCheckAddInfo',
                                                        params         : {
                                                            unique_id_long : selects.get('unique_id_long')
                                                        },
                                                        success        : function (val, action) {
                                                            prWin.setLoading(false);
                                                            gm.me().store.load();
                                                            gm.me().poPrdDetailStore.load();
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
                    // 마감전 상태로 돌려놓을 때는 입력한 정보에 대한 초기화 상태가 필수.
                    Ext.MessageBox.show({
                        title  : '계산서 접수/취소',
                        msg    : msg,
                        buttons: Ext.MessageBox.YESNO,
                        fn     : gm.me().toogleBillRegistatorStateAction,
                        icon   : Ext.MessageBox.QUESTION
                    });
                }
            }
        });

        this.toogleBillCompleteState = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-step_forward_14_0_5395c4_none',
            text    : '최종확정/취소',
            tooltip : '상태를 최종확정 상태로 변경 또는 취소합니다.',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('toogleBillCompleteState'),
            handler : function () {
                //  gMain.selPanel.doRequestProduce();
                var select = gm.me().grid.getSelectionModel().getSelection();
                var selects = select[0];
                var state = selects.get('state');
                var msg = '';

                if (state === 'A') {
                    Ext.MessageBox.alert('알림', '계산서 접수상태에서만 실행 가능합니다.');
                    return;
                } else {
                    if (state === 'R') {
                        msg = '상태를 최종확정으로 변경하시겠습니까?';
                    } else if (state === 'C') {
                        msg = '상태를 계산서 접수 상태로 변경하시겠습니까?';
                    }
                    Ext.MessageBox.show({
                        title  : '최종확정 / 취소',
                        msg    : msg,
                        buttons: Ext.MessageBox.YESNO,
                        fn     : gm.me().toogleBillCompleteAction,
                        icon   : Ext.MessageBox.QUESTION
                    });
                }
            }
        });

        this.addExtraBillDescription = Ext.create('Ext.Action', {
            itemId  : 'addExtraBillDescription',
            iconCls : 'af-plus',
            disabled: true,
            text    : '추가',
            hidden  : gu.setCustomBtnHiddenProp('addExtraBillDescription'),
            handler : function (widget, event) {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var state = rec.get('state');
                if (state === 'A') {
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
                                title   : '선택한 계산서에 대하여 추가 내역을 입력합니다.',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                items   : [
                                    {
                                        fieldLabel: '품명',
                                        xtype     : 'textfield',
                                        anchor    : '100%',
                                        width     : '99%',
                                        name      : 'extra_description',
                                        editable  : true,
                                    },
                                    {
                                        fieldLabel: '계산서 발행액',
                                        id        : gu.id('close_price'),
                                        xtype     : 'numberfield',
                                        anchor    : '100%',
                                        width     : '99%',
                                        decimalPrecision : 4,
                                        editable  : true,
                                        name      : 'close_price',
                                    },
                                    {
                                        fieldLabel: '특이사항',
                                        xtype     : 'textfield',
                                        anchor    : '100%',
                                        width     : '99%',
                                        editable  : true,
                                        name      : 'comment',
                                    },
                                ]
                            },
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
                        title  : '추가',
                        width  : 500,
                        height : 230,
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
                                            title  : '추가',
                                            msg    : '입력한 항목을 추가하시겠습니까?',
                                            buttons: Ext.MessageBox.YESNO,
                                            fn     : function (btn) {
                                                if (btn == 'yes') {

                                                    form.submit({
                                                        submitEmptyText: false,
                                                        url            : CONTEXT_PATH + '/account/arap.do?method=addGrBillExtraContent',
                                                        params         : {
                                                            rtgast_uid: rec.get('unique_id_long')
                                                        },
                                                        success        : function (val, action) {
                                                            prWin.setLoading(false);
                                                            gm.me().store.load();
                                                            gm.me().poPrdDetailStore.load();
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
                    Ext.MessageBox.alert('알림', '마감 전 상태만 추가 기능이 가능합니다.');
                    return;
                }

            }
        });


        this.editExtraBillDescription = Ext.create('Ext.Action', {
            itemId  : 'editExtraBillDescription',
            iconCls : 'af-edit',
            disabled: true,
            text    : '수정',
            hidden  : gu.setCustomBtnHiddenProp('editExtraBillDescription'),
            handler : function (widget, event) {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var state = rec.get('state');

                var selections_two = gm.me().gridContractCompany.getSelectionModel().getSelection();
                var rec_two = selections_two[0];
                var wgrast_uid = rec_two.get('wgrast_uid');
                if (state === 'A') {
                    var width = 0;
                    var height = 0;
                    if(wgrast_uid > -1) {
                        var width = 500;
                        var height = 300;
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
                                    title : '정산 상세내역 정보를 수정합니다.<br><b>선택한 건은 마감수량과 특이사항만 수정 가능합니다.</b>',
                                    defaults: {
                                        margin: '2 2 2 2'
                                    },
                                    items   : [
                                        {
                                            fieldLabel: '품번',
                                            xtype     : 'textfield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            name      : 'item_name',
                                            editable  : false,
                                            fieldStyle: 'background-color: #ddd; background-image: none;',
                                            value : rec_two.get('item_code')
                                        },
                                        {
                                            fieldLabel: '품명',
                                            id        : gu.id('item_name'),
                                            xtype     : 'textfield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            editable  : false,
                                            name      : 'item_name',
                                            fieldStyle: 'background-color: #ddd; background-image: none;',
                                            value : rec_two.get('item_name')
                                        },
                                        {
                                            fieldLabel: '매입가',
                                            id        : gu.id('sales_price_trans_currency'),
                                            xtype     : 'numberfield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            decimalPrecision: 4,
                                            editable  : false,
                                            hideTrigger     : true,
                                            name      : 'sales_price_trans_currency',
                                            fieldStyle: 'background-color: #ddd; background-image: none;',
                                            value : rec_two.get('supply_price')
                                        },
                                        {
                                            fieldLabel: '마감수량',
                                            id        : gu.id('close_qty'),
                                            xtype     : 'numberfield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            editable  : true,
                                            name      : 'close_qty',
                                            value : rec_two.get('close_qty')
                                        },
                                        {
                                            fieldLabel: '특이사항',
                                            xtype     : 'textfield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            editable  : true,
                                            name      : 'comment',
                                            value : rec_two.get('comment')
                                        },
                                    ]
                                },
                            ]
                        });
                    } else {
                        width = 500;
                        height = 280;
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
                                    title : '정산 상세내역 정보를 수정합니다.<br><b>선택한 건은 품명,마감수량, 매입가,특이사항 수정 가능합니다.</b>',
                                    defaults: {
                                        margin: '2 2 2 2'
                                    },
                                    items   : [
                                        {
                                            fieldLabel: '품명',
                                            xtype     : 'textfield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            name      : 'extra_description',
                                            editable  : true,
                                            value : rec_two.get('item_name')
                                        },
                                        {
                                            fieldLabel: '매입가',
                                            id        : gu.id('close_price'),
                                            xtype     : 'numberfield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            editable  : true,
                                            name      : 'close_price',
                                            decimalPrecision : 4,
                                            value : rec_two.get('supply_price')
                                        },
                                        {
                                            fieldLabel: '특이사항',
                                            xtype     : 'textfield',
                                            anchor    : '100%',
                                            width     : '99%',
                                            editable  : true,
                                            name      : 'comment',
                                            value : rec_two.get('comment')
                                        },
                                    ]
                                },
                            ]
                        });
                    }

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
                        title  : '수정',
                        width  : width,
                        height : height,
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
                                            title  : '수정',
                                            msg    : '선택 항목을 수정하시겠습니까?',
                                            buttons: Ext.MessageBox.YESNO,
                                            fn     : function (btn) {
                                                if (btn == 'yes') {
                                                    if(wgrast_uid > -1) {
                                                        // 마감수량 판별 후 수정해야 함.
                                                        Ext.Ajax.request({
                                                            url    : CONTEXT_PATH + '/account/arap.do?method=determineCloseQty',
                                                            params : {
                                                                gr_no: rec_two.get('gr_no'),
                                                                srcahd_uid: rec_two.get('srcahd_uid'),
                                                                close_qty : gu.getCmp('close_qty').getValue()
                                                            },
                                                            success: function (result, request) {
                                                                var determine = result.responseText;
                                                                if(determine === 'true') {
                                                                    form.submit({
                                                                        submitEmptyText: false,
                                                                        url            : CONTEXT_PATH + '/account/arap.do?method=editGrBillExtraContent',
                                                                        params         : {
                                                                            unique_id : rec_two.get('unique_id_long'),
                                                                            rtgast_uid : rec.get('unique_id_long'),
                                                                            edit_type : 'WGR'
                                                                        },
                                                                        success        : function (val, action) {
                                                                            prWin.setLoading(false);
                                                                            gm.me().store.load();
                                                                            gm.me().poPrdDetailStore.load();
                                                                            prWin.close();
                                                                        },
                                                                        failure        : function () {
                                                                            prWin.setLoading(false);
                                                                            extjsUtil.failureMessage();
                                                                        }
                                                                    });
                                                                } else {
                                                                    Ext.MessageBox.alert('알림', '기존 입고수량보다 큰 수가 마감수량으로 입력되었습니다.<br>다시 확인해 주십시오.')
                                                                }
                                                            }
                                                        });
                                                    } else {
                                                        // 추가 품목을 수정할 경우
                                                        form.submit({
                                                            submitEmptyText: false,
                                                            url            : CONTEXT_PATH + '/account/arap.do?method=editGrBillExtraContent',
                                                            params         : {
                                                                unique_id : rec_two.get('unique_id_long'),
                                                                rtgast_uid : rec.get('unique_id_long'),
                                                                edit_type : 'GEN'
                                                            },
                                                            success        : function (val, action) {
                                                                prWin.setLoading(false);
                                                                gm.me().store.load();
                                                                gm.me().poPrdDetailStore.load();
                                                                prWin.close();
                                                            },
                                                            failure        : function () {
                                                                prWin.setLoading(false);
                                                                extjsUtil.failureMessage();
                                                            }
                                                        });
                                                    }

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
                    Ext.MessageBox.alert('알림', '마감 전 상태만 수정 기능이 가능합니다.');
                    return;
                }
            }
        });


        this.deleteExtraBillDescription = Ext.create('Ext.Action', {
            iconCls : 'af-remove',
            text    : '삭제',
            disabled: true,
            hidden  : gu.setCustomBtnHiddenProp('deleteExtraBillDescription'),
            handler : function () {
                //  gMain.selPanel.doRequestProduce();
                var select = gm.me().grid.getSelectionModel().getSelection();
                var selects = select[0];
                var state = selects.get('state');
                var msg = '';

                var select_two = gm.me().gridContractCompany.getSelectionModel().getSelection();
                var rec_two = select_two[0];

                if (state === 'A') {
                    Ext.MessageBox.show({
                        title  : '삭제',
                        msg    : '선택된 항목을 삭제하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn     : gm.me().deleteExtraBillDescriptionAction,
                        icon   : Ext.MessageBox.QUESTION
                    });
                } else {
                    Ext.MessageBox.alert('알림','마감 전 상태에서만 실행 가능합니다.')
                }
            }
        });


        //console_logs('this.fields', this.fields);
        this.createStore('Rfx2.model.company.bioprotech.RtgAstAc', [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                creator  : 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['project']
        );

        var arr = [];
        arr.push(buttonToolbar);
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);
        this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.ClosedGrListStore', {});


        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls        : 'rfx-panel',
            id         : gu.id('gridContractCompany'),
            store      : this.poPrdDetailStore,
            viewConfig : {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region     : 'center',
            autoScroll : true,
            autoHeight : true,
            flex       : 0.5,
            frame      : true,
            // bbar       : getPageToolbar(this.poPrdDetailStore),
            border     : true,
            layout     : 'fit',
            forceFit   : false,
            plugins    : {
                ptype       : 'cellediting',
                clicksToEdit: 1
            },
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            selModel   : Ext.create("Ext.selection.CheckboxModel", {}),
            margin     : '0 0 0 0',
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    cls  : 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype: 'component',
                            id   : gu.id('selectedMtrl'),
                            html : '등록된 정산내역서를 선택하십시오.',
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addExtraBillDescription,
                        // 수정
                        this.editExtraBillDescription,
                        // 삭제
                        this.deleteExtraBillDescription
                    ]
                }
            ],
            columns    : [
                {
                    text     : '주문번호',
                    width    : 80,
                    style    : 'text-align:center',
                    dataIndex: 'po_no',
                    sortable : false
                },
                {
                    text     : '입고번호',
                    width    : 80,
                    style    : 'text-align:center',
                    dataIndex: 'gr_no',
                    sortable : false
                },
                {
                    text     : '품번',
                    width    : 75,
                    style    : 'text-align:center',
                    dataIndex: 'item_code',
                    sortable : false
                },
                {
                    text     : '품명',
                    width    : 90,
                    style    : 'text-align:center',
                    dataIndex: 'item_name',
                    sortable : false
                },
                {
                    text     : '통화',
                    width    : 60,
                    style    : 'text-align:center',
                    dataIndex: 'sales_currency',
                    sortable : false
                },
                {
                    text            : '수량',
                    width           : 80,
                    style           : 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex       : 'close_qty',
                    sortable        : false,
                    align           : 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return renderDecimalNumber(value);
                    },
                    renderer        : function (value, context, tmeta) {
                        // if (context.field == 'close_qty') {
                        //     context.record.set('close_qty', Ext.util.Format.number(value, '0,00/i'));
                        // }
                        return Ext.util.Format.number(value, '0,000.####');
                    },
                },
                {
                    text     : '단가',
                    width    : 80,
                    style    : 'text-align:center',
                    dataIndex: 'sales_price',
                    sortable : false,
                    align    : 'right',
                    // summaryType: 'sum',
                    // summaryRenderer: function (value, summaryData, dataIndex) {
                    //     return renderDecimalNumber(value);
                    // },
                    renderer : function (value, context, tmeta) {
                        // if (context.field == 'sales_price') {
                        //     context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                        // }
                        return Ext.util.Format.number(value, '0,000.####');
                    },
                },
                {
                    text            : '공급가액',
                    width           : 80,
                    style           : 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex       : 'supply_price',
                    sortable        : false,
                    align           : 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return renderDecimalNumber(value);
                    },
                    renderer        : function (value, context, tmeta) {
                        // if (context.field == 'supply_price') {
                        //     context.record.set('supply_price', Ext.util.Format.number(value, '0,00/i'));
                        // }
                        return Ext.util.Format.number(value, '0,000.####');
                    },
                },
                {
                    text            : '부가세',
                    width           : 90,
                    style           : 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex       : 'tax_rate',
                    sortable        : false,
                    align           : 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return renderDecimalNumber(value);
                    },
                    renderer        : function (value, context, tmeta) {
                        // if (context.field == 'tax_rate') {
                        //     context.record.set('tax_rate', Ext.util.Format.number(value, '0,00/i'));
                        // }
                        return Ext.util.Format.number(value, '0,000.####');
                    },
                },
                {
                    text     : '특이사항',
                    width    : 100,
                    style    : 'text-align:center',
                    dataIndex: 'comment',
                    sortable : false
                },
            ],
            title      : '정산내역리스트',
            name       : 'po',
            autoScroll : true
        });


        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                console_logs('>>>>>>> rec', selections);
                if (selections.length) {
                    gm.me().deleteExtraBillDescription.enable();
                    gm.me().editExtraBillDescription.enable();
                } else {
                    gm.me().deleteExtraBillDescription.disable();
                    gm.me().editExtraBillDescription.disable();
                }
            }
        });
        //grid 생성.
        this.usePagingToolbar = false;
        this.createGrid(arr);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items : [
                {
                    //title: '제품 및 템플릿 선택',
                    collapsible: false,
                    frame      : false,
                    region     : 'west',
                    layout     : {
                        type : 'hbox',
                        pack : 'start',
                        align: 'stretch'
                    },
                    margin     : '5 0 0 0',
                    width      : '50%',
                    items      : [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width : '100%',
                        items : [this.grid]
                    }]
                }, this.gridContractCompany
            ]
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.toogleBillRegistatorState);
        buttonToolbar.insert(2, this.toogleBillCompleteState);
        buttonToolbar.insert(6, '-');


        buttonToolbar.insert(6, '-');

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                var rtgast_uid = rec.get('unique_id_long');
                this.poPrdDetailStore.getProxy().setExtraParam('rtgast_uid', rtgast_uid);
                this.poPrdDetailStore.load();
                gm.me().toogleBillRegistatorState.enable();
                gm.me().toogleBillCompleteState.enable();
                gm.me().addExtraBillDescription.enable();
                gu.getCmp('selectedMtrl').setHtml('<font color=yellow>[' + rec.get('po_no') + ' / ' + rec.get('content') + ']  ' + '</font>' + rec.get('supplier_name'));
            } else {
                gm.me().toogleBillRegistatorState.disable();
                gm.me().toogleBillCompleteState.disable();
                gm.me().addExtraBillDescription.disable();
            }
        })
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },

    toogleBillRegistatorStateAction: function (result) {
        if (result == 'yes') {
            var select = gm.me().grid.getSelectionModel().getSelection();
            if (select == null || select == undefined || select.length < 1) {
                Ext.MessageBox.alert('알림', '계산서가 선택되지 않았습니다.');
                return null;
            }
            var rec = select[0];
            var state = rec.get('state');
            var rtgast_uid = rec.get('unique_id_long');
            var change_state = '';
            if (state === 'A') {
                change_state = 'R';
            } else if (state === 'R') {
                change_state = 'A';
            }
            gMain.setCenterLoading(true);
            Ext.Ajax.request({
                waitMsg: '처리중입니다.<br> 잠시만 기다려주세요.',
                url    : CONTEXT_PATH + '/account/arap.do?method=billRegisterCheck',
                params : {
                    rtgast_uid  : rtgast_uid,
                    change_state: change_state
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

    toogleBillCompleteAction: function (result) {
        if (result == 'yes') {
            var select = gm.me().grid.getSelectionModel().getSelection();
            if (select == null || select == undefined || select.length < 1) {
                Ext.MessageBox.alert('알림', '계산서가 선택되지 않았습니다.');
                return null;
            }
            var rec = select[0];
            var state = rec.get('state');
            var rtgast_uid = rec.get('unique_id_long');
            var change_state = '';
            if (state === 'R') {
                change_state = 'C';
            } else if (state === 'C') {
                change_state = 'R';
            }
            gMain.setCenterLoading(true);
            Ext.Ajax.request({
                waitMsg: '처리중입니다.<br> 잠시만 기다려주세요.',
                url    : CONTEXT_PATH + '/account/arap.do?method=billRegisterCheck',
                params : {
                    rtgast_uid  : rtgast_uid,
                    change_state: change_state
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

    deleteExtraBillDescriptionAction: function (result) {
        if (result == 'yes') {
            gMain.setCenterLoading(true);
            var select = gm.me().grid.getSelectionModel().getSelection();
            var selects = select[0];
            var select_two = gm.me().gridContractCompany.getSelectionModel().getSelection();
            var moneyout_uids = [];
            for(var i = 0; i<select_two.length; i++) {
                var rec_two = select_two[i];
                moneyout_uids.push(rec_two.get('unique_id_long'));
            }
            Ext.Ajax.request({
                waitMsg: '처리중입니다.<br> 잠시만 기다려주세요.',
                url    : CONTEXT_PATH + '/account/arap.do?method=deleteExtraBillDescription',
                params : {
                    rtgast_uid  : selects.get('unique_id_long'),
                    moneyout_uids: moneyout_uids
                },
                success: function (result, request) {
                    gMain.setCenterLoading(false);
                    gm.me().store.load();
                    gm.me().poPrdDetailStore.load();
                    Ext.MessageBox.alert('알림', '처리 되었습니다.');
                },
                failure: extjsUtil.failureMessage
            });
            gMain.setCenterLoading(false);
        }
    }
});
