//출하 관리
Ext.define('Rfx2.view.company.dabp01kr.criterionInfo.ProductView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'product-view',
    initComponent: function(){
    
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	
    	this.addSearchField (
    			{
    					field_id: 'exclusive_flag'
    					,store: 'CodeYnStore'
    					,displayField: 'codeName'
    					,valueField: 'systemCode'
    					,innerTpl	: '{codeName}'
    			});	
    	
    	this.addSearchField('wa_name');
		this.addSearchField('specification');
		this.addSearchField('item_name');
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
    	
    	
    	
    	
    	this.setDefValue('create_date', new Date());
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('change_date', next7);
    	
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

    	
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델 정의
        this.createStore('Rfx.model.ProductStock', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/,{
	        	create_date: 'create_date'
	        }
	        );

      //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);
        
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
