Ext.define('Rfx.view.produceMgmt.HEAVY3_InspectHistoryView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'inspect-history-view',
    initComponent: function(){

        //this.initDefValue();

        //생성시 디폴트 값.
        this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
        this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
        this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
        this.setDefValue('board_count', 0); //Hidden Value임.
        switch(vSYSTEM_TYPE) {
            case 'MES':
                this.setDefComboValue('gubun', 'valueField', '0');//ComboBOX의 ValueField 기준으로 디폴트 설정.
                break;
            case 'PLACE':
                this.setDefComboValue('gubun', 'valueField', 'notice');//ComboBOX의 ValueField 기준으로 디폴트 설정.
        }


        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField ({
            type: 'dateRange',
            field_id: 'create_date',
            text: "검사일자",
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        switch(vCompanyReserved4) {
            case 'HSGC01KR':
                this.addSearchField('pj_name');
                this.addSearchField('reserved_varchar2');
                this.addSearchField('reserved_varchar3');
                this.addSearchField('wa_name');
                break;
            case 'KYNL01KR':
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'pcswork-history',
                    tableName: 'itemdetail',
                    field_id: 'h_reserved2',
                    fieldName: 'h_reserved2',
                    params: {
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'pcswork-history',
                    tableName: 'srcahd',
                    field_id: 'area_code',
                    fieldName: 'area_code',
                    params: {
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'pcswork-history',
                    tableName: 'pcstpl',
                    field_id: 'pcs_name',
                    fieldName: 'pcs_name',
                    params: {
                    }
                });
                /*this.addSearchField('h_reserved2');
                this.addSearchField('area_code');
                this.addSearchField('pcs_name');*/
                break;
            default:
                break;
        }

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4||index==5) {
                buttonToolbar.items.remove(item);
            }

        });

        //모델 정의
        this.createStoreSimple({
            modelClass: 'Rfx.model.InspectHistoryViewModel',
            pageSize: gMain.pageSize,
            sorters: [{
                //property: 'pcs_code',
                property: 'pj_name',
                direction: 'asc'
            }],
            byReplacer: {
                /*'item_code': 'srcahd.item_code',
                'step': 'step.pcs_code'*/
            },
            deleteClass: ['pcsstep']

        }, {
            //groupField: groupField
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

    },
    items : []
});




