//구매요청
Ext.define('Rfx2.view.company.dabp01kr.purStock.GoodsStockView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'goods-stock-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    	this.addSearchField (
    			{
    				type: 'combo'
    				,field_id: 'stock_check'
    				,store: "CodeYnStore"
    				,displayField: 'codeName'
    				,valueField: 'systemCode'
    				,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
    			});	
    	
		this.addSearchField('item_name');
		this.addSearchField('spec_model_desc');
		this.addSearchField('alter_reason');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.GoodsStock', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );
        
        
//        var dateToolbar = Ext.create('Ext.toolbar.Toolbar', {
//    		cls: 'my-x-toolbar-default1',
//        	items: [
//	        	        //searchAction, '-',
//	        	        	,{
//		      					
//	      					    xtype:'label',
//								width: 48,
//	      					    text: "납기일 : ",
//	      					    style: 'color:white;'
//		      					 
//					        },
//	      					{ 
//	      		                name: 'date',
//	      		                format: 'Y-m-d',
//	      		              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
//	      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
//	      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
//	      					    	allowBlank: true,
//	      					    	xtype: 'datefield',
//	      					    	value: new Date(),
//	      					    	width: 100,
//	      						handler: function(){
//	      						}
//	      					}
//					    ]});
        var arr=[];
        arr.push(buttonToolbar);
//        arr.push(dateToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        
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

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	console_logs('setGridOnCallback selections', selections);
        	var rec = selections[0];
        	if(rec!=undefined && rec!=null) {
            	gMain.loadGeneralgrid(rec.get('unique_id'), gMain.selectedMenuId + 'innoutGrid');        		
        	}

        });
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        
        
        
        //반출입이력 Tab 추가.
		gMain.addTabGeneralGridPanel('반출입 이력', 'QGR4_SUB', {  
				pageSize: 100,
				model: 'Rfx.model.InnoutLine',
				checkbox: false,
				sorters: [{
					property: 'create_date',
					direction: 'DESC'
				}]
			}, 
			function(selections) {
	            if (selections.length) {
	            	var rec = selections[0];
	            	//console_logs(rec);
	            	//gMain.selPanel.selectPcsRecord = rec;
	            } else {
	            	
	            }
	        },
			gMain.selectedMenuId + 'innoutGrid'//toolbar
		);
        
        
        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});

      },
    items : []
    //stockType: 'PRODUCT'
});
