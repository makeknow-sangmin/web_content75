/**
 사용자 뷰
 */
Ext.define('Rfx2.view.company.mke.executiveInfo.SPCCritpointMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'uspc-critpoint-mgmtt-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField ({
            type: 'dateRange',
            field_id: 'occur_date',
            text: '발생일자',
            labelWidth: 50,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function(item,index,length){
            if(index==1 || index==2 || index==3 || index==4) {
                buttonToolbar.items.remove(item);
            }
        });

        //모델 정의
        this.createStore('Rfx.model.CritPoint', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gm.pageSize,
            {
                creator: 'b.creator',
                audit_type: 'b.audit_type'
            }
            //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['outlierrep']
        );

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
    },
    items: []
});
