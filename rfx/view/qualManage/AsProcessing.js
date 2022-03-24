Ext.define('Rfx.view.qualManage.AsProcessing', {
    extend: 'Rfx.base.BaseView',
    xtype: 'as-acception-view',
    selected_rec: null,
    initComponent: function () {

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.AsProcessing', [{
                property: 'user_name',
                direction: 'ASC'
            }],
            gMain.pageSize
            , {}
            , ['svcqst']
        );

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('unique_id');
        this.addSearchField('rqst_title');
        this.addSearchField('user_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

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

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.storeLoad();

        this.setGridOnCallback(function(selections) {

        });
    }
});
