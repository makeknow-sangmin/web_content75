//고객사 관리 메뉴
Ext.define('Rfx2.view.company.hsct.salesDelivery.BuyerListView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'buyer-list-view',
    initComponent: function () {
        //검색툴바 필드 초기화
        this.initSearchField();

        switch (vCompanyReserved4) {
            case 'DOOS01KR':
            case 'KYNL01KR':
            case 'HSGC01KR':
            
            case 'SKNH01KR':
                this.addSearchField({
                    field_id: 'pr_active_flag'
                    , store: 'PrActiveFlagStore'
                    , displayField: 'codeName'
                    , valueField: 'systemCode'
                    , innerTpl: '{codeName}'
                });
                break;
            case 'SJFB01KR':
                // this.addSearchField('wa_name');
                // this.addSearchField('president_name');
                break;
            default:
                this.addSearchField({
                    field_id: 'pr_active_flag'
                    , store: 'PrActiveFlagStore'
                    , displayField: 'codeName'
                    , valueField: 'systemCode'
                    , innerTpl: '{codeName}'
                });
                break;
        }

        //    	this.addSearchField('pr_active_flag');
        this.addSearchField('wa_name');
        // this.addSearchField('biz_no');
        this.addSearchField('president_name');
        
        //		this.addSearchField('wa_name_en');
        //1) 회사명 2) 사업자번호 3) 대표자명 4) 영업담당자
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        console_logs('this.fields', this.fields);
        this.createStore('Rfx.model.BuyerList', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/, {}
            , ['combst']
        );
        this.addCallback('CHECK_CODE', function (o) {
            var target = gMain.selPanel.getInputTarget('wa_code');
            var code = target.getValue();
            var uppercode = code.toUpperCase();
            //if(code == null || code == ""){
            //        	if(code.length < 2){
            //        		Ext.Msg.alert('안내', '코드는 두자리 영문으로 입력해주세요', function() {});
            //        	}else {
            console_logs('===cc', 'cc');
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/userMgmt/combst.do?method=checkWaCode',
                params: {
                    code: code
                },
                success: function (result, request) {
                    var resultText = result.responseText;
                    if (resultText == '0') {
                        Ext.Msg.alert('안내', '사용가능한 코드입니다', function () { });
                        gMain.selPanel.getInputTarget('wa_code').setValue(uppercode);
                    } else {
                        Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () { });
                        gMain.selPanel.getInputTarget('wa_code').setValue('');
                    }
                },
                failure: extjsUtil.failureMessage
            }); //end of ajax
        });  // end of addCallback
        //grid 생성.
        // var selModel = Ext.create('Ext.selection.CheckboxModel', {
        //     selType: 'checkboxmodel',
        //     mode: 'SINGLE',
        //     checkOnly: false,
        //     allowDeselect: true
        // })

        this.createGrid(searchToolbar, buttonToolbar, {selModel:{
            selType: 'checkboxmodel',
            mode: 'SINGLE'}
        });
        this.createCrudTab('buyer-list-view');
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        this.callParent(arguments);
        


        //디폴트 로드
        this.store.load(function (records) { });
    },
    items: []
});
