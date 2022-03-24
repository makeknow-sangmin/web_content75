Ext.define('Rfx.view.criterionInfo.UserAuthorityKindsView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'userauthoritykinds-view',
    items: [{html: 'Rfx.view.criterionInfo.UserAuthorityKindsView'}],
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField('role_code');
		this.addSearchField('role_name');
		
		//Readonly Field 정의
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');
//		this.addReadonlyField('create_date');
//		this.addReadonlyField('creator');
//		this.addReadonlyField('creator_uid');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.UserAuthorityKinds', [{
            property: 'code_order',
            direction: 'ASC'
	        }],
	        gMain.pageSize/*pageSize*/,
	        {},
	        ['roletype']
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
        gMain.setCenterLoading(false);
        this.store.load(function(records){});

    },
    items : []
});
