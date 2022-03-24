Ext.define('Rfx2.view.company.chmr.purStock.WearingCancelStateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'wearing-cancel-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('seller_name');
        //this.addSearchField('project_varchar6');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.WarehousingCancelState', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
        );


        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });


        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();


        this.setAllMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.load(function () {
                });
            }
        });
        this.setSaMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '원자재',
            tooltip: '원자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'RAW';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'S');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSubMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '부자재',
            tooltip: '부자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'B');
                gm.me().store.load(function () {
                });
            }
        });
        this.setMROView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'MRO',
            tooltip: 'MRO',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'M');
                gm.me().store.load(function () {
                });
            }
        });
        this.setUsedMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '상품',
            tooltip: '상품',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'P');
                gm.me().store.load(function () {
                });
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        //버튼 추가.
        buttonToolbar.insert(5, '-');
        buttonToolbar.insert(5, this.setUsedMatView);
        buttonToolbar.insert(5, this.setMROView);
        buttonToolbar.insert(5, this.setSubMatView);
        buttonToolbar.insert(5, this.setSaMatView);
        buttonToolbar.insert(5, this.setAllMatView)


        this.callParent(arguments);
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });
    },
    items: []
});
