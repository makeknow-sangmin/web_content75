Ext.define('Rfx.view.criterionInfo.ProcessCodeView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'processCode-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField('system_code');
		this.addSearchField('code_name_kr');

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

        this.createStore('Rfx.model.ProcessCode', [{
	            property: 'description',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
	        , ['code']
	        );
        
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
        this.store.getProxy().setExtraParam('orderBy', "description");
    	this.store.getProxy().setExtraParam('ascDesc', "DESC");  
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : []
});
