Ext.define('Rfx2.view.company.mke.executiveInfo.SpcAnalysisRealTimeAdminView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'spc-analysis-realtime-admin-view-mke',
    tabSize: 0,
    initComponent: function () {

        //this.initDefValue();

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가


        this.createStore('Rfx.model.SpcAnalysisRealTimeAdmin', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/* pageSize */
            ,{
                creator: 'creator',
                unique_id: 'unique_id'
            }
            // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['claast']
        );

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||/*index==2||*/index==3||index==4||index==5) {
                buttonToolbar.items.remove(item);
            }
        });
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
