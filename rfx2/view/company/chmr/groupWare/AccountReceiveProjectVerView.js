Ext.define('Rfx2.view.company.chmr.groupWare.AccountReceiveProjectVerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'account-receive-project-ver-view',


    initComponent: function () {

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL', 'VIEW']
        });

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            // type: 'combo',
            field_id: 'year',
            emptyText: '연도'
            , store: 'YearStore'
            , displayField: 'view'
            , valueField: 'year'
            , innerTpl: '{view}'
        });


        this.addSearchField({
            type: 'text',
            field_id: 'wa_name',
            emptyText: '고객사'
        });

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.ReceivableByCompanyProjectList', [{
            property: 'unique_id',
            direction: 'ASC'
        }],
            gm.pageSize
            , {}
            , ['']
        );

        var arr = [];
        arr.push(buttonToolbar);

        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);


        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        // CAPAMAP 스토어
        this.curingState = Ext.create('Rfx2.store.company.chmr.MoneyInStoreByBill', { pageSize: 100 });
        this.mainPanelState = Ext.create('Rfx2.store.company.chmr.ReceivableByCompanyProjectListStore');


        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                var reserved_varchard = gu.getCmp('reserved_varchard').getValue();
                var pj_name = gu.getCmp('pj_name').getValue();
                var year = gu.getCmp('year_main').getValue();
                if (reserved_varchard !== null) {
                    gm.me().curingState.getProxy().setExtraParam('reserved_varchard', reserved_varchard);
                }
                if (pj_name !== null) {
                    gm.me().curingState.getProxy().setExtraParam('pj_name', pj_name);
                }
                if (year !== null) {
                    gm.me().curingState.getProxy().setExtraParam('year', year);
                }
                gm.me().curingState.getProxy().setExtraParam('route_code', 'GO');
                gm.me().curingState.load();
            }
        });

        this.purListSrchMain = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                var wa_name = gu.getCmp('wa_name').getValue();
                var year = gu.getCmp('year_main').getValue();
                if (wa_name !== null) {
                    gm.me().mainPanelState.getProxy().setExtraParam('wa_name', wa_name);
                }
                if (year !== null) {
                    gm.me().mainPanelState.getProxy().setExtraParam('year', year);
                }
                gm.me().mainPanelState.getProxy().setExtraParam('route_code', 'GO');
                gm.me().mainPanelState.load();
            }
        });


        this.modifyDefectAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '입금 수정',
            tooltip: '해당 입금 내역을 수정합니다',
            disabled: true,
            handler: function () {
                var rec = gm.me().gridCuring.getSelectionModel().getSelection()[0];
                var myWidth = 600;
                var myHeight = 300;
                var money = rec.get('money');
                var moneyin_uid = rec.get('unique_id');
                var paytype = Ext.create('Ext.data.Store', {
                    fields: ['var_value', 'var_name'],
                    data: [
                        { "var_value": "현금", "var_name": "현금" },
                        { "var_value": "카드", "var_name": "카드" },
                        { "var_value": "어음", "var_name": "어음" }
                    ]
                });
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var combst_uid = selection[0]['data']['unique_id_long'];
                var projectStore = Ext.create('Rfx2.store.company.chmr.ClosalStore', { pageSize: 100 });
                projectStore.getProxy().setExtraParam('order_com_unique', combst_uid);
                projectStore.load();
                var formItems = [
                    {
                        xtype: 'numberfield',
                        id: gu.id('money'),
                        name: 'money',
                        padding: '0 0 5px 10px',
                        style: 'width: 99%',
                        allowBlank: true,
                        value: money,
                        fieldLabel: '입금금액',
                    },
                    {
                        xtype: 'datefield',
                        id: gu.id('in_date'),
                        name: 'in_date',
                        padding: '0 0 5px 10px',
                        style: 'width: 99%',
                        allowBlank: true,
                        value: new Date(),
                        fieldLabel: '입금일',
                        format: 'Y-m-d',
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '현장명',
                        id: gu.id('project_uid_edit'),
                        padding: '0 0 5px 10px',
                        store: projectStore,
                        value: rec.get('project_uid'),
                        width: '99%',
                        name: 'project_uid',
                        style: 'width: 99%',
                        valueField: 'pj_uid',
                        displayField: 'pj_name',
                        selectOnFocus: true,
                        allowBlank: false,
                        emptyText: '선택해주세요.',
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음',
                            getInnerTpl: function () {
                                return '<div data-qtip="{pj_uid}">{pj_name}</div>';
                            }
                        },
                        listeners: {
                            afterrender: function (combo) {

                            }
                        }

                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '결제방법',
                        id: gu.id('pay_type'),
                        padding: '0 0 5px 10px',
                        store: paytype,
                        width: '99%',
                        name: 'pay_type',
                        style: 'width: 99%',
                        valueField: 'var_value',
                        displayField: 'var_name',
                        emptyText: '선택해주세요.',
                        selectOnFocus: true,
                        value: rec.get('pay_type'),
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음',
                            getInnerTpl: function () {
                                return '<div data-qtip="{var_value}">{var_name}</div>';
                            }
                        },
                        listeners: {
                            afterrender: function (combo) {

                            }
                        }

                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('desc_edit'),
                        name: 'desc',
                        padding: '0 0 5px 10px',
                        style: 'width: 99%',
                        allowBlank: true,
                        fieldLabel: '비고',
                        value: rec.get('description'),
                    },
                ];

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
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
                            items: formItems

                        }
                    ]
                })

                var item = [form];

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '입금수정',
                    width: myWidth,
                    height: myHeight,
                    items: item,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/account/arap.do?method=ModifyMoneyIn',
                                        params: {
                                            money: gu.getCmp('money').getValue(),
                                            in_date: gu.getCmp('in_date').getValue(),
                                            pay_type: gu.getCmp('pay_type').getValue(),
                                            moneyin_uid: moneyin_uid,
                                            project_uid: gu.getCmp('project_uid_edit').getValue(),
                                            description: gu.getCmp('desc_edit').getValue()
                                        },
                                        success: function (result, request) {
                                            gm.me().store.load();
                                            gm.me().gridCuring.store.load();
                                            Ext.Msg.alert('안내', '입금 내역을 수정하였습니다.', function () { });
                                            prWin.close();
                                        },// endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });// endofajax
                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show();
            }
        });

        this.removeDefectAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '입금 삭제',
            disabled: true,
            tooltip: '해당 입금 내역을 삭제합니다.',
            handler: function () {
                var rec = gm.me().gridCuring.getSelectionModel().getSelection()[0];
                console_logs('rec 확인 >>>>>>>>>>>>>>>>>>>>>>', rec);

                var moneyin_uid = rec.get('unique_id');

                Ext.MessageBox.show({
                    title: '확인',
                    msg: '입금내역을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/account/arap.do?method=RemoveMoneyIn',
                                params: {
                                    moneyin_uid: moneyin_uid
                                },
                                success: function (result, request) {
                                    gm.me().store.load();
                                    gm.me().gridCuring.store.load();
                                    Ext.Msg.alert('안내', '삭제 되었습니다.', function () { });
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.mainPanel = Ext.create('Ext.grid.Panel', {
            store: this.mainPanelState,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            features: [{
                ftype: 'summary',
                dock: 'top'
            }],
            listeners: {

            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            width: 150,
                            field_id: 'year',
                            id: gu.id('year_main'),
                            name: 'year',
                            xtype: 'combo',
                            store: this.yearStore,
                            emptyText: '연도',
                            displayField: 'view',
                            valueField: 'year',
                            value: new Date().getFullYear(),
                            listeners: {
                                change: function (fieldObj, e) {

                                },
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {

                                    }
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },
                        {
                            width: 150,
                            field_id: 'wa_name',
                            id: gu.id('wa_name'),
                            name: 'wa_name',
                            xtype: 'triggerfield',
                            emptyText: '고객사',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().curingState.getProxy().setExtraParam('route_code', 'GO');
                                gm.me().curingState.getProxy().setExtraParam('reserved_varchard', '');
                                gm.me().curingState.load();
                            },
                            listeners: {
                                change: function (fieldObj, e) {

                                },

                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().curingState.getProxy().setExtraParam('route_code', 'GO');
                                        gm.me().curingState.getProxy().setExtraParam('reserved_varchard', gu.getCmp('reserved_varchard').getValue());
                                        gm.me().curingState.load();
                                    }
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },
                        this.purListSrchMain
                    ]
                },
            ],
            margin: '5 0 0 0',
            columns: [
                {
                    text: '고객사',
                    width: 150,
                    locked: true,
                    style: 'text-align:center',
                    align: 'left',
                    dataIndex: 'wa_name',
                },
                {
                    text: '정산금액',
                    width: 110,
                    locked: true,
                    style: 'text-align:center',
                    dataIndex: 'settlement_money',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '입금금액',
                    width: 110,
                    style: 'text-align:center',
                    dataIndex: 'money',
                    locked: true,
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },

                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '미수금 금액',
                    width: 100,
                    locked: true,
                    style: 'text-align:center',
                    dataIndex: 'receivable_money',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },

                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '1월',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'january',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },

                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '2월',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'february',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '3월',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'march',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '4월',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'april',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '5월',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'may',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '6월',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'june',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '7월',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'july',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '8월',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'august',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '9월',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'september',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '10월',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'october',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '11월',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'november',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '12월',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'december',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                }
            ],
            name: 'capa',
            autoScroll: true,
        });

        this.mainPanel.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('rec ??????', selections);
                    var rec = selections[0];
                    var combst_uid = rec.get('unique_id_long');
                    var year = gu.getCmp('year_main').getValue();
                    gm.me().gridCuring.getStore().getProxy().setExtraParam('year', year);
                    gm.me().gridCuring.getStore().getProxy().setExtraParam('combst_uid', combst_uid);
                    gm.me().gridCuring.getStore().getProxy().setExtraParam('rtg_type', 'GS');
                    gm.me().gridCuring.getStore().load(function (record) {
                    });
                }
            }
        });

        this.gridCuring = Ext.create('Ext.grid.Panel', {
            store: this.curingState,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            features: [{
                ftype: 'summary',
                dock: 'top'
            }],
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            viewConfig: {
                emptyText: '<div style="text-align:center; padding-top:30% ">조회된 데이터가 없습니다.</div>'
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            listeners: {
                itemdblclick: function (dv, record, item, index, e) {
                    var selections = gm.me().gridCuring.getSelectionModel().getSelection();
                    var rec = selections[0];
                    console_logs('>>>> rec dbclick', rec);
                    var detailStore = Ext.create('Rfx2.store.company.chmr.ClosalStore', {});
                    detailStore.getProxy().setExtraParam('rtgast_uid', rec.get('rtgast_uid'));
                    detailStore.load();
                    var loadForm = Ext.create('Ext.grid.Panel', {
                        store: detailStore,
                        selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                        id: gu.id('loadForm'),
                        layout: 'fit',
                        title: '납품요구번호 : ' + rec.get('reserved_varchard') + '<br>' + '현장명 : ' + rec.get('pj_name'),
                        region: 'center',
                        style: 'padding-left:0px;',
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 2,
                        },
                        columns: [
                            {
                                text: "계산서번호",
                                flex: 0.8,
                                style: 'text-align:center',
                                dataIndex: 'po_no',
                                sortable: true,
                            },
                            {
                                text: "내역",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'rtgast_name',
                                sortable: true,
                            },
                            {
                                text: "계산서발행일",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'aprv_date',
                                sortable: true,
                                renderer: Ext.util.Format.dateRenderer('Y-m-d')
                            },
                            {
                                text: "품명",
                                flex: 1,
                                style: 'text-align:center',
                                dataIndex: 'item_name',
                                sortable: true,
                            },
                            {
                                text: "규격",
                                flex: 1.8,
                                style: 'text-align:center',
                                dataIndex: 'concat_spec_desc',
                                sortable: true,
                            },
                            {
                                text: "수량",
                                flex: 1,
                                dataIndex: 'gr_qty',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: true,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'price') {
                                        context.record.set('price', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                            {
                                text: "단가",
                                flex: 1,
                                dataIndex: 'sales_price',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: true,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'price') {
                                        context.record.set('price', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                            {
                                text: "금액",
                                flex: 1,
                                dataIndex: 'total_price',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: true,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'total_price') {
                                        context.record.set('total_price', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    if (value == null || value.length < 1) {
                                        value = 0;
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                            {
                                text: "비고",
                                flex: 1,
                                dataIndex: 'moneyin_desc',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: true,
                            },
                        ],
                        renderTo: Ext.getBody(),
                        autoScroll: true,
                        multiSelect: true,
                        pageSize: 100,
                        width: 600,
                        height: 300,
                    });

                    loadForm.getSelectionModel().on({
                        selectionchange: function (sm, selections) {
                            if (selections.length) {
                                var rec = selections[0];
                            } else {

                            }
                        }
                    });

                    var winProduct = Ext.create('ModalWindow', {
                        title: '상세정보',
                        width: 1000,
                        height: 600,
                        minWidth: 600,
                        minHeight: 300,
                        items: [
                            loadForm
                        ],
                        buttons: [{
                            text: CMD_OK,
                            handler: function (btn) {
                                winProduct.setLoading(false);
                                winProduct.close();
                            }
                        }]
                    });
                    winProduct.show();
                }
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [

                        {
                            width: 150,
                            field_id: 'reserved_varchard',
                            id: gu.id('reserved_varchard'),
                            name: 'reserved_varchard',
                            xtype: 'triggerfield',
                            emptyText: '납품요구번호',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().curingState.getProxy().setExtraParam('route_code', 'GO');
                                gm.me().curingState.getProxy().setExtraParam('reserved_varchard', '');
                                gm.me().curingState.load();
                            },
                            listeners: {
                                change: function (fieldObj, e) {

                                },
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().curingState.getProxy().setExtraParam('route_code', 'GO');
                                        gm.me().curingState.getProxy().setExtraParam('reserved_varchard', gu.getCmp('reserved_varchard').getValue());
                                        gm.me().curingState.getProxy().setExtraParam('year', gu.getCmp('year_main').getValue());
                                        gm.me().curingState.load();
                                    }
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },
                        {
                            width: 150,
                            field_id: 'pj_name',
                            id: gu.id('pj_name'),
                            name: 'pj_name',
                            xtype: 'triggerfield',
                            emptyText: '현장명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().curingState.getProxy().setExtraParam('route_code', 'GO');
                                gm.me().curingState.getProxy().setExtraParam('pj_name', '');
                                gm.me().curingState.load();
                            },
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().curingState.getProxy().setExtraParam('route_code', 'GO');
                                        gm.me().curingState.getProxy().setExtraParam('pj_name', gu.getCmp('pj_name').getValue());
                                        gm.me().curingState.getProxy().setExtraParam('year', gu.getCmp('year_main').getValue());
                                        gm.me().curingState.load();
                                    }
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },
                        this.purListSrch
                    ]
                },
            ],
            margin: '5 0 0 0',
            columns: [
                {
                    text: '납품요구번호',
                    width: 100,
                    style: 'text-align:center',
                    align: 'left',
                    dataIndex: 'reserved_varchard',
                },
                {
                    text: '현장명',
                    width: 120,
                    style: 'text-align:center',
                    align: 'left',
                    dataIndex: 'pj_name',
                },
                {
                    text: '정산금액',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'total_price',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '세금계산서 발행일',
                    width: 120,
                    style: 'text-align:center',
                    align: 'left',
                    dataIndex: 'aprv_date',
                    format: 'Y-m-d',
                    dateFormat: 'Y-m-d',
                    sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },

                {
                    text: '입금금액',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'money_summary',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: '입금일',
                    width: 100,
                    style: 'text-align:center',
                    align: 'left',
                    dataIndex: 'in_date',
                    format: 'Y-m-d',
                    dateFormat: 'Y-m-d',
                    sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
            ],
            title: '입금내역',
            name: 'capa',
            autoScroll: true,
        });

        this.receiveAction = Ext.create('Ext.Action', {
            itemId: 'receiveAction',
            iconCls: 'af-plus-circle',
            text: '입금',
            handler: function (widget, event) {
                var selectedUid = [];
                var selection = gm.me().grid.getSelectionModel().getSelection();
                selectedUid.push(selection[0]['data']['unique_id_long']);

                var wa_name = selection[0]['data']['wa_name'];
                var combst_uid = selection[0]['data']['unique_id_long'];
                var myWidth = 600;
                var myHeight = 300;

                var projectStore = Ext.create('Rfx2.store.company.chmr.ClosalStoreByProject', { pageSize: 100 });
                projectStore.getProxy().setExtraParam('order_com_unique', combst_uid);
                projectStore.load();

                var paytype = Ext.create('Ext.data.Store', {
                    fields: ['var_value', 'var_name'],
                    data: [
                        { "var_value": "현금", "var_name": "현금" },
                        { "var_value": "카드", "var_name": "카드" },
                        { "var_value": "어음", "var_name": "어음" }
                    ]
                });

                paytype.load();

                var formItems = [
                    {
                        xtype: 'textfield',
                        id: gu.id('wa_name'),
                        readonly: true,
                        name: 'wa_name',
                        padding: '0 0 5px 10px',
                        style: 'width: 99%',
                        allowBlank: true,
                        fieldLabel: '고객사',
                        value: wa_name
                    },
                    {
                        xtype: 'numberfield',
                        id: gu.id('money'),
                        name: 'money',
                        padding: '0 0 5px 10px',
                        style: 'width: 99%',
                        allowBlank: true,
                        fieldLabel: '입금금액',
                    },
                    {
                        xtype: 'datefield',
                        id: gu.id('in_date'),
                        name: 'in_date',
                        padding: '0 0 5px 10px',
                        style: 'width: 99%',
                        allowBlank: false,
                        value: new Date(),
                        fieldLabel: '입금일',
                        format: 'Y-m-d',
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '현장명',
                        id: gu.id('project_uid'),
                        padding: '0 0 5px 10px',
                        store: projectStore,
                        width: '99%',
                        name: 'project_uid',
                        style: 'width: 99%',
                        valueField: 'pj_uid',
                        displayField: 'pj_name',
                        selectOnFocus: true,
                        allowBlank: false,
                        emptyText: '선택해주세요.',
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음',
                            getInnerTpl: function () {
                                return '<div data-qtip="{pj_uid}">{pj_name}</div>';
                            }
                        },
                        listeners: {
                            afterrender: function (combo) {

                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '결제방법',
                        id: gu.id('pay_type'),
                        padding: '0 0 5px 10px',
                        store: paytype,
                        width: '99%',
                        name: 'pay_type',
                        style: 'width: 99%',
                        valueField: 'var_value',
                        displayField: 'var_name',
                        selectOnFocus: true,
                        emptyText: '선택해주세요.',
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음',
                            getInnerTpl: function () {
                                return '<div data-qtip="{var_value}">{var_name}</div>';
                            }
                        },
                        listeners: {
                            afterrender: function (combo) {

                            }
                        }

                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('desc'),
                        name: 'desc',
                        padding: '0 0 5px 10px',
                        style: 'width: 99%',
                        allowBlank: true,
                        fieldLabel: '비고',
                    },
                ];

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'left',
                        msgTarget: 'side'
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
                            items: formItems
                        }
                    ]
                })

                var item = [form];

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '입금실행',
                    width: myWidth,
                    height: myHeight,
                    items: item,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    var rtg_type = "GS";
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/account/arap.do?method=insertMoneyIn',
                                        params: {
                                            money: gu.getCmp('money').getValue(),
                                            in_date: gu.getCmp('in_date').getValue(),
                                            pay_type: gu.getCmp('pay_type').getValue(),
                                            pj_uid: gu.getCmp('project_uid').getValue(),
                                            desc: gu.getCmp('desc').getValue(),
                                            combst_uid: combst_uid,
                                            rtg_type: rtg_type
                                        },
                                        success: function (result, request) {
                                            gm.me().store.load();
                                            gm.me().gridCuring.store.load();
                                            Ext.Msg.alert('안내', '입금을 완료하였습니다.', function () { });
                                            prWin.close();
                                        },// endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });// endofajax
                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show();
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '55%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.mainPanel]
                    }]
                }, this.gridCuring
            ]
        });
        this.callParent(arguments);
        //디폴트 로드
        gm.setCenterLoading(false);
        this.mainPanelState.getProxy().setExtraParam('route_code', 'GO');
        this.mainPanelState.load();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                console_logs('rec ??????', selections);
                var rec = selections[0];
                var combst_uid = rec.get('unique_id_long');
                this.gridCuring.getStore().getProxy().setExtraParam('combst_uid', combst_uid);
                this.gridCuring.getStore().getProxy().setExtraParam('rtg_type', 'GS');
                this.gridCuring.getStore().load(function (record) {
                });
            } else {

            }
        });
        this.gridCuring.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    console_logs('curing ??????', selections);
                    gm.me().modifyDefectAction.enable();
                    gm.me().removeDefectAction.enable();
                } else {
                    gm.me().modifyDefectAction.disable();
                    gm.me().removeDefectAction.disable();
                }
            }
        });
    },
    yearStore: Ext.create('Mplm.store.YearStore', {}),
});
