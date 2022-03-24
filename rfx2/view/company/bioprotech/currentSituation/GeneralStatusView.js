Ext.define('Rfx2.view.company.bioprotech.currentSituation.GeneralStatusView', {
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

        this.comcstStore.load();
        this.statusType.load();

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

        this.mainPanelState = Ext.create('Rfx2.store.company.bioprotech.GeneralStateStore');
        this.purListSrchMain = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                var search_date = gu.getCmp('search_date').getValue();
                var site = gu.getCmp('site').getValue();
                var type = gu.getCmp('type').getValue();
                if (search_date !== null) {
                    gm.me().mainPanelState.getProxy().setExtraParam('search_date', search_date);
                }
                if (site !== null) {
                    gm.me().mainPanelState.getProxy().setExtraParam('site', site);
                }
                if (type !== null) {
                    gm.me().mainPanelState.getProxy().setExtraParam('type', type);
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
                            id: gu.id('site'),
                            name: 'site',
                            xtype: 'combo',
                            width: 200,
                            allowBlank: false,
                            fieldStyle: 'background-image: none;',
                            store: this.comcstStore,
                            emptyText: '선택해주세요.',
                            displayField: 'codeName',
                            valueField: 'code_name_en',
                            value: 'All',
                            // sortInfo: { field: 'codeName', direction: 'ASC' },
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{codeNameEn}">{codeName}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }// endofselect
                            }
                        },
                        {
                            xtype: 'combo',
                            id: gu.id('type'),
                            name: 'type',
                            displayField: 'code_name_kr',
                            store: this.statusType,
                            valueField: 'system_code',
                            allowBlank: false,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false,
                            width: 200,
                            emptyText: '종류',
                            allowBlank: true,
                            value: 'ORDER'
                        },
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
                    text: '어제수량',
                    width: 110,
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'yester_qty',
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
                    text: '어제금액',
                    width: 120,
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'yester_price',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return renderDecimalNumber(value);
                    },
                    renderer: function (value, meta) {
                        value = Ext.util.Format.number(value, '0,000.####');
                        return value;
                    },
                },
                {
                    text: '주별수량',
                    width: 110,
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'week_qty',
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
                    text: '주별금액',
                    width: 120,
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'week_price',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return renderDecimalNumber(value);
                    },
                    renderer: function (value, meta) {
                        value = Ext.util.Format.number(value, '0,000.####');
                        return value;
                    },
                },
                {
                    text: '월수량',
                    width: 110,
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'month_qty',
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
                    text: '월금액',
                    width: 120,
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'month_price',
                    summaryType: 'sum',
                    summaryRenderer: function (value, summaryData, dataIndex) {
                        return renderDecimalNumber(value);
                    },
                    renderer: function (value, meta) {
                        value = Ext.util.Format.number(value, '0,000.####');
                        return value;
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
    comcstStore: Ext.create('Mplm.store.ProductionSiteStore'),
    statusType: Ext.create('Mplm.store.StatusType', {}),
});
