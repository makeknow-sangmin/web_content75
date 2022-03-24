//창고 관리
Ext.define('Rfx2.view.company.kbtech.stockMgmt.WhouseMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'wh-mgmt-view',


    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //this.addSearchField('unique_id');
//        this.setDefComboValue('standard_flag', 'valueField', 'R');

        /*this.addSearchField (
         {
         field_id: 'standard_flag'
         ,store: "StandardFlagStore"
         ,displayField:   'code_name_kr'
         ,valueField:   'system_code'
         ,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>'
         });	*/

        /*this.addSearchField (
         {
         field_id: 'stock_check'
         ,store: "CodeYnStore"
         ,displayField: 'codeName'
         ,valueField: 'systemCode'
         ,innerTpl	: '{codeName}'
         });*/


        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx2.model.WhouseMgmt', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
            //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            , {
//                item_code_dash: 's.item_code',
//                comment: 's.comment1'
            },
            ['whouse']
        );


        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);


        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                rec = selections[0];


            } else {
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
        });

    }
});



