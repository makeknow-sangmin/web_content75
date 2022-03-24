//구매요청
Ext.define('Rfx.view.purStock.ReWokerStockView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'rewoker-stock-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	//검색툴바 추가
		this.addSearchField('standard_flag');
		this.addSearchField('Lot_no');
		this.addSearchField('Text');
		this.addSearchField('Lot수');
		this.addSearchField('수량');
		this.addSearchField(
				{
					field_id: 'sortby'
					,store: "SortByStore"
					,displayField: 'codeName'
					,valueField: 'systemCode'
					,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
				}
		);
    	
    	

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.ReWokerStock', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );
        
        var dateToolbar = Ext.create('Ext.toolbar.Toolbar', {
    		cls: 'my-x-toolbar-default1',
        	items: [
	        	        //searchAction, '-',
	        	        	{
		      					
	      					    xtype:'label',
								width: 60,
	      					    text: "검색기간 :",
	      					    style: 'color:white;'
		      					 
					        },
	      					{ 
	      		                name: 's-date',
	      		                format: 'Y-m-d',
	      		              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
	      					    	allowBlank: true,
	      					    	xtype: 'datefield',
	      					    	value: new Date(),
	      					    	width: 100,
	      						handler: function(){
	      						}
					        },{
		      					    xtype:'label',
		      					    text: " ~ ",
		      					    style: 'color:white;'
		      					    
		      					 },
		      					{ 
		      		                name: 'e_date',
		      		                format: 'Y-m-d',
		      		              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
		      					    	allowBlank: true,
		      					    	xtype: 'datefield',
		      					    	value: new Date(),
		      					    	width: 99,
		      						handler: function(){
		      						}
		      					}
					    ]});
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(dateToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : []
});
