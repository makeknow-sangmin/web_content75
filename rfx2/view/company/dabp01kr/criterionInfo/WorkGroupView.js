Ext.define('Rfx2.view.company.dabp01kr.criterionInfo.WorkGroupView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'workgroup-view',
    initComponent: function(){
    
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
		//Readonly Field 정의
		this.initReadonlyField();
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델정의
        this.createStore('Rfx.model.WorkGroup', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
	        , ['pcsmember']
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
        this.store.load(function(records){});
    	
    }
});
