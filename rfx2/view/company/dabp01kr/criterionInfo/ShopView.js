
Ext.define('Rfx2.view.company.dabp01kr.criterionInfo.ShopView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'list-supplier-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();

    	this.addSearchField (
				{
					field_id: 'blocking_flag'
					,store: 'PrActiveFlagStore'
					,displayField: 'codeName'
					,valueField: 'systemCode'
					,innerTpl	: '{codeName}'
				});	
		this.addSearchField (
				{
					field_id: 'supplier_type'
					,store: 'SupplyTypeStore'
					,displayField: 'code_name_kr'
					,valueField: 'system_code'
					//,width: 230
					,innerTpl	: '[{system_code}] {code_name_kr}'
				});	

		this.addSearchField('supplier_name');
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');
		this.addReadonlyField('creator');

		
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		
		

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        var secontToolbar = 

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.ListSupplier', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
        	,['supast']
        
        );
        
        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);
//		var gridBoard = this.createGrid('Rfx.view.grid.BoardGrid');
//        this.grid = Ext.create('Rfx.base.BaseGrid', {
//            store: this.store,
//            dockedItems: [buttonToolbar, searchToolbar],
//            columns: this.columns
//        });
//        this.grid.getSelectionModel().on({
//        	selectionchange: function(sm, selections) {
//	            if (selections.length) {
//	            	console_logs(' selections[0]',  selections[0]);
//	            }
//        	}
//        });
        
//		//명령툴바 이벤트 정의
//        this.registAction.setHandler(function(){
//        	var crudTab = Ext.getCmp('board-view' +'-'+ 'crudTab');
//        	crudTab.setActiveItem(0);
//        	crudTab.expand();
//        });
//        this.editAction.setHandler(function(){
//            Ext.Msg.alert('Click','You clicked on "'+ this.text +'".');
//        });
//        this.copyAction.setHandler(function(){
//            Ext.Msg.alert('Click','You clicked on "'+ this.text +'".');
//        });
//        this.viewAction.setHandler(function(){
//        	var crudTab = Ext.getCmp('board-view' +'-'+ 'crudTab');
//        	
//        	var idx = crudTab.items.indexOf(crudTab.getLayout().getActiveItem());
//        	idx==0 ? crudTab.setActiveItem(1) : crudTab.collapsed ? crudTab.expand() : crudTab.collapse();
//        });
//        this.removeAction.setHandler(function(){
//            Ext.Msg.alert('Click','You clicked on "'+ this.text +'".');
//        });
//        this.excelAction.setHandler(function(){
//            Ext.Msg.alert('Click','You clicked on "'+ this.text +'".');
//        });
        

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
