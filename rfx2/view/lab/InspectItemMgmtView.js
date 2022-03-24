Ext.define('Rfx2.view.lab.InspectItemMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'inspect-item-mgmt-view',
    initComponent: function() {

        //검색툴바 필드 초기화
        this.initSearchField();

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.InspectItemMgmt', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            ,{}
            , ['xdmdimension']
        );

        //검색툴바 추가

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

    }
});
