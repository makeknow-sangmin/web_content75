//자재 관리
Ext.define('Rfx.view.purStock.HEAVY4_MaterialMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'material-mgmt-view',
    
    
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    	//this.addSearchField('unique_id');
    	this.setDefComboValue('standard_flag', 'valueField', 'R');
    	
    	/*this.addSearchField (
				{
						field_id: 'standard_flag'
						,store: "StandardFlagStore"
	    			    ,displayField:   'code_name_kr'
	    			    ,valueField:   'system_code'
						,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>'
				});	*/
    	
    	/*this.addSearchField (
    			{
    				field_id: 'stock_check'
    				,store: "CodeYnStore"
    				,displayField: 'codeName'
    				,valueField: 'systemCode'
    				,innerTpl	: '{codeName}'
    					});*/
		this.addSearchField('item_code');
		this.addSearchField('item_name');
		this.addSearchField('specification');
		this.addSearchField('maker_name');
		
		this.addCallback('CHECK_SP_CODE', function(combo, record){
			
			gMain.selPanel.refreshStandard_flag(record);
			
		});
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function(o){
        	console_logs('addCallback>>>>>>>>>', o);
        });

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.Heavy4MaterialMgmt', [{
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

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.setAllMatView = Ext.create('Ext.Action', {
        	 xtype : 'button',
 			 text: '전체',
 			 tooltip: '전체',
 			//pressed: true,
 			toggleGroup: 'stockviewType',
 			 handler: function() {
 				gMain.selPanel.stockviewType = 'ALL';
 				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
 				gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
 				gMain.selPanel.store.load(function(){});
 			 }
 		});
        

        this.setRawMatView = Ext.create('Ext.Action', {
         	 xtype : 'button',
  			 text: '원자재',
  			 tooltip: '원자재 재고',
  			//pressed: true,
  			toggleGroup: 'stockviewType',
  			 handler: function() {
  				 this.matType = 'RAW';
  				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
  				gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
  				gMain.selPanel.store.load(function(){});
  			 }
  		});
        this.setSaMatView = Ext.create('Ext.Action', {
          	 xtype : 'button',
   			 text: '부자재',
   			 tooltip: '부자재 재고',
   			//pressed: true,
   			toggleGroup: 'stockviewType',
   			 handler: function() {
   				 this.matType = 'SUB';
   				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
   				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K1');
   				gMain.selPanel.store.load(function(){});
   			 }
   		});
       this.setSubMatView = Ext.create('Ext.Action', {
        	 xtype : 'button',
 			 text: '소모품',
 			 tooltip: '소모품 재고',
 			toggleGroup: 'stockviewType',
 			 handler: function() {
 				 this.matType = 'MRO';
 				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
 				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K3');
 				gMain.selPanel.store.load(function(){});
 			 }
 		});
       
       this.setMisMatView = Ext.create('Ext.Action', {
      	 xtype : 'button',
			 text: '잡자재',
			 tooltip: '잡자재 재고',
			toggleGroup: 'stockviewType',
			 handler: function() {
				 this.matType = 'MIS';
				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K2');
				gMain.selPanel.store.load(function(){});
			 }
		});

       this.createPoAction = Ext.create('Ext.Action', {
      	 xtype : 'button',
      	iconCls:'fa-cart-arrow-down_14_0_5395c4_none',
			 text: '주문카트 ',
			 tooltip: '주문카트 담기',
			 disabled: true,
			 handler: function() {
				 
				 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
				 
				 console_logs('selections', selections);
			    if (selections) {
			    	var uids = [];
		        	for(var i=0; i< selections.length; i++) {
		        		var rec = selections[i];
		        		var unique_id = rec.get('unique_id');
		        		uids.push(unique_id);
		        	}
		        	
		        	
	        		Ext.Ajax.request({
	            		url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
	            		params: {
	            			srcahd_uids: uids
	            		},
	            		success : function(result, request){
	            			var resultText = result.responseText;

	            			Ext.Msg.alert('안내', '카트 담기 완료.', function() {});
	            			
	            		},
	            		failure: extjsUtil.failureMessage
	            	}); //end of ajax
		        	
			    }
				 
				 
//				 switch(gMain.selPanel.stockviewType) {
//				 case 'ALL':
//					 alert("자재를 먼저 선택해 주세요");
//					 break;
//				 default:
//					 break;
//				 }
			 }
		});
       
       // 출고 버튼
       this.outGoAction = Ext.create('Ext.Action', {
        	 xtype : 'button',
        	 	 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
  			 text: '자재출고 ',
  			 tooltip: '자재출고',
  			 disabled: true,
  			 handler: function() {
  				 
  				 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
  				 
  				 console_logs('selections', selections);
  			    if (selections) {
  			    	var uids = [];
  		        	for(var i=0; i< selections.length; i++) {
  		        		var rec = selections[i];
  		        		var unique_id = rec.get('unique_id');
  		        		uids.push(unique_id);
  		        	}
  		        	
  		        	
  	        		/*Ext.Ajax.request({
  	            		url: CONTEXT_PATH + '/purchase/request.do?method=addCart',
  	            		params: {
  	            			srcahd_uids: uids
  	            		},
  	            		success : function(result, request){
  	            			var resultText = result.responseText;

  	            			Ext.Msg.alert('안내', '자재 출고 완료.', function() {});
  	            			
  	            		},
  	            		failure: extjsUtil.failureMessage
  	            	}); //end of ajax
*/  		        	
  			    }
  				 
  				 
  			 }
  		});
       
       //버튼 추가.
       buttonToolbar.insert(7, '-');
       buttonToolbar.insert(7, this.setMisMatView);
       buttonToolbar.insert(7, this.setSubMatView);
       buttonToolbar.insert(7, this.setSaMatView);
       buttonToolbar.insert(7, this.setRawMatView);
       buttonToolbar.insert(7, this.setAllMatView);
       buttonToolbar.insert(6, this.outGoAction);
       buttonToolbar.insert(6, this.createPoAction);
       buttonToolbar.insert(6, '-');
        
        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
				gMain.selPanel.createPoAction.enable();
				gMain.selPanel.outGoAction.enable();
             } else {
				gMain.selPanel.createPoAction.disable();
				gMain.selPanel.outGoAction.disable();
             }
             })	

        //디폴트 로드
        gMain.setCenterLoading(false);
        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');
        this.store.load(function(records){});
    },
    items : [],
    matType: 'RAW',
    stockviewType: "ALL",
    refreshStandard_flag: function(record) {
    	console_logs('val', record);
    		var spcode = record.get('systemCode');
    		var s_flag = spcode.substring(0,1);
    		console_logs('spcode', s_flag);
    	
    	
    		var target = this.getInputTarget('standard_flag');
    		target.setValue(s_flag);
    		
        },
});



