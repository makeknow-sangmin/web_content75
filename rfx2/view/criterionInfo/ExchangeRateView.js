Ext.define('Rfx2.view.criterionInfo.ExchangeRateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'exchange-rate-view',
    initComponent: function() {

        this.localSize = 50000;

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'dateRange',
            field_id: 'basic_date',
            text: "기준날짜",
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        //모델 정의
        this.createStore('Rfx2.model.ExchangeRate', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            this.localSize
            ,{
            }
            //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['currency']
        );

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

        this.store.getProxy().setExtraParam('basic_date',
            this.getSearchWidget(this.link + '-' + gMain.getSearchField('basic_date')).getValue());

        this.store.load();

    }
});
