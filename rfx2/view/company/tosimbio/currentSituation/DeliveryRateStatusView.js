Ext.define('Rfx2.view.company.bioprotech.currentSituation.DeliveryRateStatusView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'board-view',
    initComponent: function () {

        this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
        this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
        this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
        this.setDefValue('board_count', 0); //Hidden Value임.
        this.setDefComboValue('gubun', 'valueField', '0');//ComboBOX의 ValueField 기준으로 디폴트 설정.

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        // this.addSearchField(
        //     {
        //         field_id: 'site_code'
        //         , store: 'ComCstStore'
        //         , displayField: 'division_name'
        //         , valueField: 'division_code'
        //         , emptyText: 'Site'
        //         , innerTpl: '<div data-qtip="{division_code}">[{division_code}] {division_name}</div>'
        //     });

        // this.addSearchField(
        //     {
        //         xtype: 'combo'
        //         , field_id: 'year_field'
        //         , store: "MonthStore"
        //         , params: {parentCode: 'YEAR'}
        //         , displayField: 'codeName'
        //         , valueField: 'systemCode'
        //         , emptyText: '연도'
        //         , innerTpl: '<div data-qtip="{systemCode}">{codeName}</div>'
        //         , minChars: 2
        //     });

        // this.addSearchField(
        //     {
        //         xtype: 'combo'
        //         , field_id: 'month_field'
        //         , store: "MonthStore"
        //         , params: {parentCode: 'MONTH'}
        //         , displayField: 'codeName'
        //         , valueField: 'systemCode'
        //         , emptyText: '적용월'
        //         , innerTpl: '<div data-qtip="{systemCode}">{codeName}</div>'
        //         , minChars: 2
        //     });
        // this.addSearchField('item_name');
        // this.addSearchField('board_title');
        // this.addSearchField('board_content');
        // this.addSearchField('board_name');
        // this.addSearchField('user_id');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

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

        //모델 정의
        this.createStore('Rfx.model.ProdSales', [{
            property: 'create_date',
            direction: 'DESC'
        }],
            /*pageSize*/
            gMain.pageSize
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            //Orderby list key change
            //ordery create_date -> p.create로 변경.
            , {
                board_content: 'b.board_content',
                board_count: 'b.board_count',
                board_email: 'b.board_email',
                board_title: 'b.board_title',
                create_date: 'b.create_date',
                creator: 'b.creator',
                gubun: 'b.gubun',
                unique_id: 'b.unique_id',
                user_id: 'b.user_id'
            }
            //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['']
        );

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        this.mainPanelState = Ext.create('Rfx2.store.company.bioprotech.DeliveryRateStateStore');
        this.purListSrchMain = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                var search_date = gu.getCmp('search_date').getValue();
                if (search_date !== null) {
                    gm.me().mainPanelState.getProxy().setExtraParam('search_date', search_date);
                }
                gm.me().mainPanelState.load();
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
            // bbar: getPageToolbar(this.mainPanelState),
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            features: [{
                ftype: 'summary',
                dock: 'bottom'
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
                            width: 200,
                            field_id: 'search_date',
                            id: gu.id('search_date'),
                            name: 'search_date',
                            xtype: 'datefield',
                            emptyText: '기준일자',
                            format: 'Y-m-d',
                            value: Ext.Date.add(new Date(), Ext.Date.DAY, -1),
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    // gm.me().curingState.load();

                                },

                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        // gm.me().curingState.getProxy().setExtraParam('route_code', 'GO');
                                        // gm.me().curingState.getProxy().setExtraParam('reserved_varchard', gu.getCmp('reserved_varchard').getValue());
                                        // gm.me().curingState.load();
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
                        /**{
                            width: 150,
                            field_id: 'year',
                            id: gu.id('year_main'),
                            name: 'year',
                            xtype: 'combo',
                            store : this.yearStore,
                            emptyText: '연도',
                            displayField: 'view',
                            valueField: 'year',
                            value : new Date().getFullYear(),
                            listeners: {
                                change: function (fieldObj, e) {
                                    // gm.me().curingState.load();
                                    
                                },

                                specialkey : function(field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        // gm.me().curingState.getProxy().setExtraParam('route_code', 'GO');
                                        // gm.me().curingState.getProxy().setExtraParam('reserved_varchard', gu.getCmp('reserved_varchard').getValue());
                                        // gm.me().curingState.load();
                                        // gm.me().cloudProjectTreeStore.getProxy().setExtraParam('pl_no1', gu.getCmp('pl_no1').getValue());
                                        // gm.me().cloudProjectTreeStore.load(function() {});
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
                                // gm.me().redrawSearchStore();
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    // gm.me().curingState.load();
                                    
                                },

                                specialkey : function(field, e) {
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
                        },**/
                        this.purListSrchMain
                    ]
                },
            ],
            margin: '5 0 0 0',
            columns: [
                {
                    text: '제품군',
                    width: 80,
                    style: 'text-align:center',
                    align: 'left',
                    dataIndex: 'class_name',
                },
                {
                    text: '수주',
                    flex: 1,
                    columns: [
                        {
                            // flex: 1,
                            width: 150,
                            sortable: false,
                            text: '잔량',
                            style: 'text-align:center;',
                            align: 'right',
                            dataIndex: 'remain_order_qty',
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return renderDecimalNumber(value);
                            },
                            renderer: function (value, context, tmeta) {
                                return Ext.util.Format.number(value, '0,00/i');

                            }
                        },
                        {
                            // flex: 1,
                            width: 150,
                            sortable: false,
                            text: '잔액',
                            align: 'right',
                            style: 'text-align:center;',
                            dataIndex: 'remain_order_price',
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return renderDecimalNumber(value);
                            },
                            renderer: function (value, context, tmeta) {

                                value = Ext.util.Format.number(value, '0,000.####');
                                return value;
                            }
                        }
                    ]
                },
                {
                    text: '생산',
                    flex: 1,
                    columns: [
                        {
                            // flex: 1,
                            width: 150,
                            sortable: false,
                            text: '잔량',
                            style: 'text-align:center;',
                            align: 'right',
                            dataIndex: 'remain_produce_qty',
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return renderDecimalNumber(value);
                            },
                            renderer: function (value, context, tmeta) {
                                return Ext.util.Format.number(value, '0,00/i');

                            }
                        },
                        {
                            // flex: 1,
                            width: 150,
                            sortable: false,
                            text: '잔액',
                            align: 'right',
                            style: 'text-align:center;',
                            dataIndex: 'remain_produce_price',
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return renderDecimalNumber(value);
                            },
                            renderer: function (value, context, tmeta) {

                                value = Ext.util.Format.number(value, '0,000.####');
                                return value;
                            }
                        },
                        {
                            // flex: 1,
                            width: 150,
                            sortable: false,
                            text: '평균생산량',
                            align: 'right',
                            style: 'text-align:center;',
                            dataIndex: 'avg_produce_rate',
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return renderDecimalNumber(value);
                            },
                            renderer: function (value, meta) {
                                value = Ext.util.Format.number(value, '0,000');
                                return value;
                            },
                        },
                        {
                            // flex: 1,
                            width: 150,
                            sortable: false,
                            text: '잔여일수',
                            align: 'right',
                            style: 'text-align:center;',
                            dataIndex: 'remain_day',
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return renderDecimalNumber(value);
                            },
                            renderer: function (value, meta) {
                                value = Ext.util.Format.number(value, '0,000');
                                return value;
                            },
                        },
                    ]
                },
                {
                    text: '평균L/T',
                    width: 80,
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'avg_lead_time',
                    renderer: function (value, meta) {
                        value = Ext.util.Format.number(value, '0,000');
                        return value;
                    },
                },
                {
                    text: '납기준수율(%)',
                    width: 110,
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'delivery_complete_rate',
                    renderer: function (value, meta) {
                        value = Ext.util.Format.number(value, '0,000');
                        return value;
                    },
                },
                {
                    text: '납기지연일수',
                    width: 100,
                    style: 'text-align:center',
                    align: 'right',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return renderDecimalNumber(value);
                    },
                    dataIndex: 'delay_delivery_day',
                    renderer: function (value, meta) {
                        value = Ext.util.Format.number(value, '0,000');
                        return value;
                    },
                },
            ],
            name: 'capa',
            autoScroll: true,
        });

        this.mainPanel.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('rec ??????', selections);
                }
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.mainPanel/** , this.crudTab**/]
        });


        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.mainPanelState.load();
        // this.store.load(function (records) {
        // });
        this.loadStoreAlways = true;

    },
    items: [],
});
