Ext.define('Rfx2.view.company.dabp01kr.purStock.DetailPoView1', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'detail-po-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
		this.addSearchField (
				{
						field_id: 'date_type'
						,store: "DatetypeStore"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
				});	
    	
    	this.addSearchField ({
            type: 'dateRange',
            field_id: 'listpodate',
            labelWidth: 0,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
    	});    
    	
    	this.addSearchField ('po_no');
    	this.addSearchField ('seller_name');	
    	this.addSearchField ('wa_name');
    	this.addSearchField ('product_name_dabp');//(제품명+제품규격)
    	this.addSearchField ('item_name_dabp');
    	//this.addSearchField ('item_name_dabp');//(원지는 지종 / 원단은 지종배합)
    	
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

        this.createStore('Rfx.model.DetailPo', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );

		this.store.getProxy().setExtraParam('route_type', 'U,UC');	
		this.store.getProxy().setExtraParam('po_type', 'U');	
  
        var toolbars = [];
        toolbars.push(buttonToolbar);
        toolbars.push(searchToolbar);
        this.createGrid(toolbars);
        
        this.setAllGrView = Ext.create('Ext.Action', {
         	 xtype : 'button',
  			 text: '전체',
  			 tooltip: '전체목록',
  			 pressed: true,
  			 //ctCls: 'x-toolbar-grey-btn',
  			 toggleGroup: 'poViewType',
  			 handler: function() {
  				gMain.selPanel.poviewType = 'ALL';
  				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
  				gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
  				 gMain.selPanel.store.load(function(){});
  			 }
  		});
          
          this.setSubGrView = Ext.create('Ext.Action', {
         	 xtype : 'button',
  			 text: '부자재',
  			 tooltip: '부자재 입고',
  			 //ctCls: 'x-toolbar-grey-btn',
  			 toggleGroup: 'poViewType',
  			 handler: function() {
  				gMain.selPanel.poviewType = 'SUB';
  				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
  				gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
  				 gMain.selPanel.store.load(function(){});
  			 }
  		});
          this.setRawGrView = Ext.create('Ext.Action', {
          	 xtype : 'button',
   			 text: '원단',
   			 tooltip: '원단 주문',
   			 //ctCls: 'x-toolbar-grey-btn',
   			 toggleGroup: 'poViewType',
   			 handler: function() {
   				gMain.selPanel.poviewType = 'RAW';
   				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'O');
   				gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
  				 gMain.selPanel.store.load(function(){});
   			 }
   		});
          
          this.RsetPaperGrView = Ext.create('Ext.Action', {
           	 xtype : 'button',
     			 text: '롤',
     			 tooltip: '롤',
     			 //ctCls: 'x-toolbar-grey-btn',
     			 toggleGroup: 'poViewType',
     			 handler: function() {
     				 gMain.selPanel.poviewType = 'ROLL';
     				 gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
     				 gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R');
     				 gMain.selPanel.store.load(function(){});
     			 }
     		});
          this.SsetPaperGrView = Ext.create('Ext.Action', {
          	 xtype : 'button',
    			 text: '시트',
    			 tooltip: '시트',
    			 //ctCls: 'x-toolbar-grey-btn',
    			 toggleGroup: 'poViewType',
    			 handler: function() {
    				 gMain.selPanel.poviewType = 'SHEET';
    				 gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
    				 gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'S');
    				 gMain.selPanel.store.load(function(){});
    			 }
    		});


        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        
      //버튼 추가.
        buttonToolbar.insert(5, '-');
        buttonToolbar.insert(5, this.setSubGrView);
        buttonToolbar.insert(5, this.setRawGrView);
        buttonToolbar.insert(5, this.SsetPaperGrView);
        buttonToolbar.insert(5, this.RsetPaperGrView);
        buttonToolbar.insert(5, this.setAllGrView);
        buttonToolbar.insert(3, '-');
        
        
        
        
        
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
	
    items : [],
    poviewType: 'ALL'

});


