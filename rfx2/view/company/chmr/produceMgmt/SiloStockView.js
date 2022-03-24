Ext.define('Rfx2.view.company.chmr.produceMgmt.SiloStockView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'inspect-category-def-view',
    //부서명store
    sliagStore: Ext.create('Rfx2.store.company.chmr.SlioSCStore', {}),
    potStore: Ext.create('Rfx2.store.company.chmr.SlioPCStore', {}),
    
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

        this.refreshInfo = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '새로고침',
            tooltip: '새로고침',
            disabled: false,
            handler: function () {
                gm.me().sliagStore.load();
                gm.me().potStore.load();
            }
        });

        var gridDeptName = Ext.create('Ext.grid.Panel', {
            store: this.sliagStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: false,
            id: gu.id('gridDeptGrid'),
            autoHeight: false,
            // bbar: getPageToolbar(this.deptStore),
            frame: false,
            layout: 'fit',
            forceFit: true,
            width: '100%',
            columns: [{
                text: '항목',
                width: 50,
                sortable: true,
                style: 'text-align:center',
                align: "left",
                dataIndex: 'properties_name'
            }, {
                text: '값',
                width: 50,
                sortable: true,
                style: 'text-align:center',
                align: "center",
                dataIndex: 'properties_value'
            }
            ],
            
        });

        this.sliagStore.load();
        this.potStore.load();

        gridDeptName.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                console_logs('>?>?>?>?>?>', selections[0].get('unique_id_long'));
            }
        });

        var temp = {
            title: '슬래그시멘트',
            collapsible: false,
            frame: true,
            region: 'west',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1.0,
            items: [gridDeptName]

        };

        var gridDisposition = Ext.create('Ext.grid.Panel', {
            store: this.potStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            id: gu.id('grid_position'),
            autoHeight: true,
            frame: false,
            reigon: 'center',
            layout: 'fit',
            forceFit: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            flex: 1,
            columns: [{
                text: '항목',
                width: 50,
                sortable: true,
                style: 'text-align:center',
                align: "left",
                dataIndex: 'properties_name'
            }, {
                text: '값',
                width: 50,
                sortable: true,
                style: 'text-align:center',
                align: "center",
                dataIndex: 'properties_value'
            }
            ]
        });

        gridDisposition.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    var rec = selections[0];
                    console_logs('>>>> rec', rec);
                    // gm.me().deletePerson.enable();
                }
            }
        });



        var temp2 = {
            title: '포틀랜트시멘트',
            collapsible: false,
            frame: true,
            region: 'center',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [gridDisposition],
            dockedItems: [
                
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'rfx-panel',
                    items: ['->',this.refreshInfo]
                }
            ]
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
});