Ext.define('Rfx.view.criterionInfo.ProductClassificationCodeView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'product-classification-code-view',
    //items: [{html: 'Rfx.view.criterionInfo.ProductClassificationCodeView'}],
    initComponent: function(){
    	
    	//this.initDefValue();
		
		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가

		this.addSearchField('unique_id');
		this.addSearchField('class_name');

		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델 정의
        this.createStore('Rfx.model.ProductClassificationCode', [{
            property: 'unique_id',
            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
        	,['claast']
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
    },
    items : []
});
