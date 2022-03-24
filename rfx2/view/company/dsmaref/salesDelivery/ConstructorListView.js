//고객사 관리 메뉴
Ext.define('Rfx2.view.company.dsmaref.salesDelivery.ConstructorListView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'constructor-list-view',
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField('division_name');
        this.initReadonlyField();
        this.addReadonlyField('unique_id');

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx2.model.company.kbtech.ConstructorList', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/,{}
            ,['comcst']
        );

        console_logs('상규===================================================================>', this.fields);

        this.addCallback('CHECK_CODE', function(o){
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
                success : function(result, request){
                    var resultText = result.responseText;

                    if(resultText=='0') {
                        Ext.Msg.alert('안내', '사용가능한 코드입니다', function() {});
                        gMain.selPanel.getInputTarget('wa_code').setValue(uppercode);
                    }else {
                        Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function() {});
                        gMain.selPanel.getInputTarget('wa_code').setValue('');
                    }
                },
                failure: extjsUtil.failureMessage
            }); //end of ajax
//       	}


        });  // end of addCallback
        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.createCrudTab('buyer-list-view');

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);

        //디폴트 로드
        this.store.load(function(records){});
    },
    items : []
});
