Ext.define('Rfx2.view.company.dabp01kr.purStock.SubCreatePoView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'subcreate-po-view',
    items: [{html: 'Rfx.view.purStock.SubCreatePoView'}],
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField (
				{
						field_id: 'gubun'
						,store: "PurchaseRequestGubunStore"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
				});	
		this.addSearchField('maker_name');

		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');
		this.addReadonlyField('creator');
		this.addReadonlyField('creator_uid');
		this.addReadonlyField('user_id');
		this.addReadonlyField('board_count');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.CreatePo', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );
        var dateToolbar = Ext.create('Ext.toolbar.Toolbar', {
    		cls: 'my-x-toolbar-default1',
        	items: [
	        	        //searchAction, '-',
					 '-','-',{
		      					
	      					    xtype:'label',
								width:88,
	      					    text: "요청기간 : ",
	      					    style: 'color:white;'
		      					 
					        },
	      					{ 
	      		                name: 's_date',
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
	      					},
	      					{
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
	      					},
        	        ]
        });       
        
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

        this.editAction.setText('주문상신');
        this.removeAction.setText('반려');
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==3) {
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
