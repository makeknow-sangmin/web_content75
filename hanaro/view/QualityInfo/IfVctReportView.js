//자재 품질관리
Ext.define('Hanaro.view.qualityInfo.IfVctReportView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'if-test-view',
    initComponent: function(){

        //모델을 통한 스토어 생성
        this.createStore('Hanaro.model.IfVctReport', [{
                property: 'seq',
                direction: 'ASC'
            }],
            gm.pageSize
            ,{}
            , ['if_mes_delv_ulv']
        );

        //검색툴바 필드 초기화
        this.initSearchField();
        this.addSearchField('UkWorkNo');
        this.addSearchField('ItemNo');
        this.addSearchField('CustNm');
        
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4||index==5) {
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

        this.store.load(function(record){});
    }
});
