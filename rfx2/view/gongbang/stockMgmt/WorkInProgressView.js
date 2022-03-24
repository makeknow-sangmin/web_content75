Ext.define('Rfx2.view.gongbang.stockMgmt.WorkInProgressView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'work-in-progress-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        let buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function (item, index) {
            if (index >= 1 && index <= 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //모델 정의
        this.createStore('Rfx2.model.company.ynju.ProductStock',
            [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        //grid 생성.
        this.createGrid([buttonToolbar, searchToolbar]);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.getProxy().setExtraParam('standard_flag', 'B');

        this.store.load(function (records) {

        });
    }
});
