//자재 관리
Ext.define('Rfx2.view.company.dabp01kr.designPlan.ManagementStandardView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'material-mgmt-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    	//this.addSearchField('unique_id');
    	this.setDefComboValue('standard_flag', 'valueField', 'R');
    	
    	this.addSearchField (
				{
						field_id: 'standard_flag'
						,store: "StandardFlagStore"
	    			    ,displayField:   'code_name_kr'
	    			    ,valueField:   'system_code'
						,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>'
				});	
    	
    	this.addSearchField (
    			{
    				field_id: 'stock_check'
    				,store: "CodeYnStore"
    				,displayField: 'codeName'
    				,valueField: 'systemCode'
    				,innerTpl	: '{codeName}'
    					});
    	
    	 switch(vCompanyReserved4){
	         case 'DABP01KR' :
	        	this.addSearchField('item_name');
				this.addSearchField('description');
				this.addSearchField('comment');
				this.addSearchField('remark');
	        	break;
	        default:
				this.addSearchField('item_code');
				this.addSearchField('item_name');
				this.addSearchField('specification');
				this.addSearchField('maker_name');
				break;
    	 }
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.MaterialMgmt', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
	        ,{
	        	item_code_dash: 's.item_code',
	        	comment: 's.comment1'
	        },
	        ['srcahd']
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

        switch(vCompanyReserved4){
        case 'DABP01KR' :
	        this.setRawMatView = Ext.create('Ext.Action', {
	          	 xtype : 'button',
	   			 text: '원지',
	   			 tooltip: '원지 재고',
	   			pressed: true,
	   			toggleGroup: 'stockviewType',
	   			 handler: function() {
	//   				 this.matType = 'RAW';
	   				gm.me().store.getProxy().setExtraParam('standard_flag', 'R');
	   				gm.me().store.load();
	   				 
	   			 }
	   		});
	        this.setSubMatView = Ext.create('Ext.Action', {
	         	 xtype : 'button',
	   			 text: '원단',
	   			 tooltip: '원단 재고',
	   			toggleGroup: 'stockviewType',
	   			 handler: function() {
	//   				 this.matType = 'SUB';
	   				gm.me().store.getProxy().setExtraParam('standard_flag', 'O');
	   				gm.me().store.load();
	   			 }
	   		});
	        	break;
        	default:
        		this.setRawMatView = Ext.create('Ext.Action', {
                	 xtype : 'button',
         			 text: '원자재',
         			 tooltip: '원자재 재고',
         			pressed: true,
         			toggleGroup: 'stockviewType',
         			 handler: function() {
         				 this.matType = 'RAW';
         			 }
         		});
              this.setSubMatView = Ext.create('Ext.Action', {
               	 xtype : 'button',
        			 text: '부자재',
        			 tooltip: '부자재 재고',
        			toggleGroup: 'stockviewType',
        			 handler: function() {
        				 this.matType = 'SUB';
        			 }
        		});
        }
        
       
       
       
      
     
     
       //버튼 추가.
       buttonToolbar.insert(7, '-');
       buttonToolbar.insert(7, this.setSubMatView);
       buttonToolbar.insert(7, this.setRawMatView);
       
        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : [],
    matType: 'RAW'
});

