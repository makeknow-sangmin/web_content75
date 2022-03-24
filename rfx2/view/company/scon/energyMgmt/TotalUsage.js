Ext.define('Rfx2.view.company.scon.energyMgmt.TotalUsage', {
    extend : 'Rfx2.base.BaseView',
    xtype : 'energy-view',
    initComponent: function () {
        this.initDefValue();
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar2({
            REMOVE_BUTTONS: ['INSERT','COPY', 'INITIAL', 'UTYPE', 'REMOVE']
        });

        this.createStore('Rfx.model.Energy', [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            10000/*pageSize*/
            , {}
            , ['energy']
        );
        this.createGrid(/**searchToolbar, **/buttonToolbar);
        this.createCrudTab();

        this.twoGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('twoGrid'),
            selModel: 'checkboxmodel',
            // store: this.combstStore,
            columns: [
                {
                    text: '종류',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys01'
                },
                {
                    text: '일자',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys02'
                },
                {
                    text: '사용량',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys03'
                },
                {
                    text: '단위',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys04'
                },
                {
                    text: '금액',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys05'
                },
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        // this.purListSrch,
                    ]
                },
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                // store: this.combstStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }

            }),
        });

        this.threeGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('threeGrid'),
            selModel: 'checkboxmodel',
            // store: this.combstStore,
            columns: [
                {
                    text: '종류',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys01'
                },
                {
                    text: '일자',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys02'
                },
                {
                    text: '사용량',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys03'
                },
                {
                    text: '단위',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys04'
                },
                {
                    text: '금액',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys05'
                },
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        // this.purListSrch,
                    ]
                },
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                // store: this.combstStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }

            }),
        });

        this.fourGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('threeGrid'),
            selModel: 'checkboxmodel',
            // store: this.combstStore,
            columns: [
                {
                    text: '종류',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys01'
                },
                {
                    text: '일자',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys02'
                },
                {
                    text: '사용량',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys03'
                },
                {
                    text: '단위',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys04'
                },
                {
                    text: '금액',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys05'
                },
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        // this.purListSrch,
                    ]
                },
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                // store: this.combstStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }

            }),
        });

        this.fiveGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('threeGrid'),
            selModel: 'checkboxmodel',
            // store: this.combstStore,
            columns: [
                {
                    text: '종류',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys01'
                },
                {
                    text: '일자',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys02'
                },
                {
                    text: '사용량',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys03'
                },
                {
                    text: '단위',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys04'
                },
                {
                    text: '금액',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys05'
                },
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        // this.purListSrch,
                    ]
                },
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                // store: this.combstStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }

            }),
        });

        this.sixGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('threeGrid'),
            selModel: 'checkboxmodel',
            // store: this.combstStore,
            columns: [
                {
                    text: '종류',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys01'
                },
                {
                    text: '일자',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys02'
                },
                {
                    text: '사용량',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys03'
                },
                {
                    text: '단위',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys04'
                },
                {
                    text: '금액',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys05'
                },
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        // this.purListSrch,
                    ]
                },
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                // store: this.combstStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }

            }),
        });


        this.sevenGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('threeGrid'),
            selModel: 'checkboxmodel',
            // store: this.combstStore,
            columns: [
                {
                    text: '종류',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys01'
                },
                {
                    text: '일자',
                    width: 80,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys02'
                },
                {
                    text: '사용량',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys03'
                },
                {
                    text: '단위',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys04'
                },
                {
                    text: '금액',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'sys05'
                },
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        // this.purListSrch,
                    ]
                },
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                // store: this.combstStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }

            }),
        });

        var electricOne = new Ext.container.Container({
            title: '1공장 전기',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                this.grid
            ]
        });

        var electricTwo = new Ext.container.Container({
            title: '2공장 전기',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                this.twoGrid
            ]
        });

        var electricSubTab = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [electricOne, electricTwo]
        });

        var electric = new Ext.container.Container({
            title: '전기',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                electricSubTab
            ]
        });

        var leftContainer = new Ext.container.Container({
            title: '전기',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                electric
            ]
        });


        var gasOne = new Ext.container.Container({
            title: '1공장 가스',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                this.threeGrid
            ]
        });

        var gasTwo = new Ext.container.Container({
            title: '2공장 가스',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                this.fourGrid
            ]
        });

        var gasSubTab = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [gasOne, gasTwo]
        });


        var gas = new Ext.container.Container({
            title: '가스',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                gasSubTab
            ]
        });

        var centerContainer = new Ext.container.Container({
            title: '가스',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                gas
            ]
        });

        var syntheOne = new Ext.container.Container({
            title: '1공장',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                this.fiveGrid
            ]
        });

        var syntheTwo = new Ext.container.Container({
            title: '2공장',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                this.sixGrid
            ]
        });

        var syntheThree = new Ext.container.Container({
            title: '종합에너지',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                this.sevenGrid
            ]
        });

        var syntheTab = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [syntheOne, syntheTwo, syntheThree]
        });

        var synthe = new Ext.container.Container({
            title: '종합에너지',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                syntheTab
            ]
        });

        var syntheInfo = new Ext.container.Container({
            title: '종합에너지',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                synthe
            ]
        });

        var rightContainer = new Ext.container.Container({
            title: '종합에너지',
            region: 'center',
            layout: {
                type: 'border'
            },
            items: [
                syntheInfo
            ]
        });

        var mainTab = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [leftContainer, centerContainer, rightContainer]
        });

        Ext.apply(this, {
            layout: 'border',
            items: mainTab
        });

        buttonToolbar.items.each(function (item, index, length) {
            if (index == 1 || index == 2) {
                buttonToolbar.items.remove(item);
            }
        })

        this.callParent(arguments);
        this.store.getProxy().setExtraParam('delete_flag', 'N');
        this.setGridOnCallback(function (selections) {
            if (selections != null && selections.length > 0) {

            } else {
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },
    items : [],

    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'ENERGY_TYPE'}),

    comcstStore: Ext.create('Mplm.store.ComCstStore', {}),

    roleCodeStore: Ext.create('Mplm.store.UserRoleCodeStore', {}),

    ynStore: Ext.create('Mplm.store.YesnoStore', {})
});