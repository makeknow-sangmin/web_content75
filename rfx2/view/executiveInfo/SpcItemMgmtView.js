Ext.define('Rfx2.view.executiveInfo.SpcItemMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'spc-item-mgmt-view',
    initComponent: function() {

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.SpcItemMgmt', [{
                property: 'create_date',
                direction: 'ASC'
            }],
            /*pageSize*/
            gMain.pageSize
            ,{}
            , ['spccolumn']
        );


        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.storeLoad();
    }
});
