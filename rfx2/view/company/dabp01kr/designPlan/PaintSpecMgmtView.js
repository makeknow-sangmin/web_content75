Ext.define('Rfx2.view.company.dabp01kr.designPlan.PaintSpecMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'paintspec-mgmt-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField('member_type');


		this.addSearchField (
		{
			type: 'combo'
			//,width:175
			,field_id: 'code_name_en'
			,store: "BuyerStore"
//			,emptyText:"발주업체"
			,displayField: 'wa_name'
			,valueField: 'wa_code'
			,innerTpl	: '<div data-qtip="{wa_code}">[{wa_code}]{wa_name}</div>'
		});
		
		this.setDefValue('use_yn','Y');
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');
		this.addReadonlyField('creator');
		this.addReadonlyField('creator_uid');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.PaintSpecMgmt', [{
	            property: 'input_type',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
	        , ['code']
	        );
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	console_logs('selections', selections);
            if (selections.length) {
            	
            	var rec = selections[0];
            	
            }
        });
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);

        //디폴트 로드
        this.store.getProxy().setExtraParam('orderBy', "input_type");
    	this.store.getProxy().setExtraParam('ascDesc', "DESC");  
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : []
});
