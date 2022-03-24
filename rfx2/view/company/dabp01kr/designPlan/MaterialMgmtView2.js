//자재 관리
Ext.define('Rfx2.view.company.dabp01kr.designPlan.MaterialMgmtView2', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'material-mgmt-view2',
    initComponent: function(){
    	this.orderbyAutoTable = false;
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    	//this.addSearchField('unique_id');
    	//this.setDefComboValue('standard_flag', 'valueField', 'R');
    	
    	/*this.addSearchField (
				{
						field_id: 'standard_flag'
						,store: "StandardFlagStore"
	    			    ,displayField:   'code_name_kr'
	    			    ,valueField:   'system_code'
						,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {code_name_kr}</div>'
				});	*/
    	
    	this.addSearchField (
    			{
    				field_id: 'stock_check'
    				,store: "CodeYnStore"
    				,displayField: 'codeName'
    				,valueField: 'systemCode'
    				,innerTpl	: '{codeName}'
    					});
    	this.addSearchField({
			type: 'distinct',
			width: 140,
			tableName: 'supast',
			field_id: 'seller_code',     
			fieldName: 'supplier_name' 
		});
		this.addSearchField('item_code');
		this.addSearchField('item_name');
		this.addSearchField('specification');
//		this.addSearchField('maker_name');
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        this.addFormWidget('입력항목', {
      	   tabTitle:"입력항목", 
      	   	id:	'PMT2_SEW_LV1',
             xtype: 'combo',
             text: '대분류',
             name: 'level1',
             storeClass: 'ClaastStorePD',
             params:{level1: 1, identification_code: "MT"},
             displayField: "class_name",
             valueField: "class_code", 
             innerTpl: "<div>[{class_code}] {class_name}</div>", 
             listeners: {
 		           select: function (combo, record) {
 	                 	console_log('Selected Value : ' + combo.getValue());
 	                 	console_logs('record : ', record);
 	                 	var class_code = record.get('class_code');
 	                 	var claastlevel2 = Ext.getCmp('PMT2_SEW_LV2');
 	                 	var claastlevel3 = Ext.getCmp('PMT2_SEW_LV3');
 	                 	
 	                 	claastlevel2.clearValue();
 	                 	claastlevel2.store.removeAll();
 	                 	claastlevel3.clearValue();
 	                 	claastlevel3.store.removeAll();
 	                 	
 	                 	claastlevel2.store.getProxy().setExtraParam('parent_class_code', class_code);
 	                 	claastlevel2.store.load();
 	                 	gMain.selPanel.reflashClassCode(class_code);
 		           }
 	        },
             canCreate:   true,
             canEdit:     true,
             canView:     true,
             position: 'center',
             setNumber:1, 
             setName:"분류코드", 
             setCols:2
         }); 
         
         this.addFormWidget('입력항목', {
       	   tabTitle:"입력항목", 
       	   	id:	'PMT2_SEW_LV2',
              xtype: 'combo',
              text: '중분류',
              name: 'level2',
              storeClass: 'ClaastStorePD',
              params:{level1: 2, identification_code: "MT"},
              displayField: "class_name",
              valueField: "class_code", 
              innerTpl: "<div>[{class_code}] {class_name}</div>", 
              listeners: {
 		           select: function (combo, record) {
 	                 	console_log('Selected Value : ' + combo.getValue());
 	                 	console_logs('record : ', record);
 	                 	var class_code = record.get('class_code');
 	                 	var claastlevel3 = Ext.getCmp('PMT2_SEW_LV3');
 	                 	
 	                 	claastlevel3.clearValue();
 	                 	claastlevel3.store.removeAll();
 	                 	
 	                 	claastlevel3.store.getProxy().setExtraParam('parent_class_code', class_code);
 	                 	claastlevel3.store.load();
 	                 	gMain.selPanel.reflashClassCode(class_code);

 		           }
 	        },
              canCreate:   true,
              canEdit:     true,
              canView:     true,
              position: 'center',
              setNumber:1, 
              setName:"분류코드", 
              setCols:2
          });        
         this.addFormWidget('입력항목', {
       	   tabTitle:"입력항목", 
       	   	id:	'PMT2_SEW_LV3',
              xtype: 'combo',
              text: '소분류',
              name: 'level3',
              storeClass: 'ClaastStorePD',
              params:{level1: 3, identification_code: "MT"},
              displayField: "class_name",
              valueField: "class_code", 
              innerTpl: "<div>[{class_code}] {class_name}</div>",
              listeners: {
 		           select: function (record) {
 	                 	console_log('Selected Value : ' + combo.getValue());
 	                 	console_logs('record : ', record);
 	                 	var class_code = record.get('class_code');
 	                 	gMain.selPanel.reflashClassCode(class_code);

 		           }
 	        },
              canCreate:   true,
              canEdit:     true,
              canView:     true,
              position: 'center',
              setNumber:1, 
              setName:"분류코드", 
              setCols:2
          });        
       
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function(o){
        	console_logs('addCallback>>>>>>>>>', o);
        });
        
        
        // 분류코드로 품번 HEAD 만들기
		this.addCallback('GET-CLASS-CODE', function(combo,record){
			
			console_logs('GET-CLASS-CODE record>>>>>>>>>>>>>>>', record);
			gMain.selPanel.inputClassCode = record;
			console_logs('gMain.selPanel.inputClassCode>>>>>>>>>>>>>>>', gMain.selPanel.inputClassCode);
			var target_item_code = gMain.selPanel.getInputTarget('item_code');


			if(target_item_code!=null) {
				target_item_code.setValue(gMain.selPanel.inputSpCode.data.system_code + gMain.selPanel.inputClassCode);
			}

			});
		
		this.addCallback('GET-SP-CODE', function(combo, record){
			console_logs('GET-SP-CODE record>>>>>>>>>>>>>>>', record);
				gMain.selPanel.inputSpCode = record;
			console_logs('gMain.selPanel.inputSpCode>>>>>>>>>>>>>>>', gMain.selPanel.inputSpCode);

				var target_item_code = gMain.selPanel.getInputTarget('item_code');
				var sp_code = gMain.selPanel.inputSpCode.get('systemCode');
				console_logs('sp_code>>>>>>>>>>>>>>>', sp_code);
				target_item_code.setValue(sp_code  +  
						target_item_code.getValue().substring(1, target_item_code.getValue().length));

			});
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('MTRL_FLAG_SEW', function(o){
        	console_logs('addCallback_MTRL_FLAG_SEW>>>>>>>>>', o);
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
 				gMain.selPanel.store.getProxy().setExtraParam('sg_code', '');
 				gMain.selPanel.store.load(function(){});
 			 }
 		});
        this.setRawMatView = Ext.create('Ext.Action', {
         	 xtype : 'button',
  			 text: '원자재(도급)',
  			 tooltip: '원자재 재고',
  			//pressed: true,
  			toggleGroup: 'stockviewType',
  			 handler: function() {
  				 this.matType = 'RAW';
  				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
  				gMain.selPanel.store.getProxy().setExtraParam('sg_code', 'DG');
  				gMain.selPanel.store.load(function(){});
  			 }
  		});
        this.setSaMatView = Ext.create('Ext.Action', {
          	 xtype : 'button',
   			 text: '원자재(사급)',
   			 tooltip: '원자재 재고',
   			//pressed: true,
   			toggleGroup: 'stockviewType',
   			 handler: function() {
   				 this.matType = 'RAW';
   				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
   				gMain.selPanel.store.getProxy().setExtraParam('sg_code', 'SG');
   				gMain.selPanel.store.load(function(){});
   			 }
   		});
       this.setSubMatView = Ext.create('Ext.Action', {
        	 xtype : 'button',
 			 text: '소모품(MRO)',
 			 tooltip: '부자재 재고',
 			toggleGroup: 'stockviewType',
 			 handler: function() {
 				 this.matType = 'SUB';
 				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
 				gMain.selPanel.store.getProxy().setExtraParam('sg_code', '');
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
  		        	
  		        	
  	        		Ext.Ajax.request({
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
  		        	
  			    }
  				 
  				 
//  				 switch(gMain.selPanel.stockviewType) {
//  				 case 'ALL':
//  					 alert("자재를 먼저 선택해 주세요");
//  					 break;
//  				 default:
//  					 break;
//  				 }
  			 }
  		});
       
    // 바코드 출력 버튼
       this.barcodePrintAction = Ext.create('Ext.Action', {
        	 xtype : 'button',
        	 iconCls: 'barcode',
  			 text: '바코드 출력',
  			 tooltip: '바코드를 바코드 프린터로 출력합니다',
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

  	            			Ext.Msg.alert('안내', '자재 출고 완료.', function() {});
  	            			
  	            		},
  	            		failure: extjsUtil.failureMessage
  	            	}); //end of ajax
  		        	
  			    }
  			 }

  		});
       
       //버튼 추가.
       buttonToolbar.insert(7, '-');
       switch(vCompanyReserved4){
	       case "SKNH01KR":
	           //buttonToolbar.insert(6, this.outGoAction);
	           //buttonToolbar.insert(6, this.createPoAction);
	    	   //buttonToolbar.insert(8, this.barcodePrintAction);
	  		 break;
	  		 default:
	  			 buttonToolbar.insert(7, this.setSubMatView);
		         buttonToolbar.insert(7, this.setSaMatView);
		         buttonToolbar.insert(7, this.setRawMatView);
		         buttonToolbar.insert(7, this.setAllMatView);
		         buttonToolbar.insert(6, this.outGoAction);
		         buttonToolbar.insert(6, this.createPoAction);
	         break;
       }
       
       buttonToolbar.insert(6, '-');
        
        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
           		gMain.selPanel.createPoAction.enable();
            	
             } else {
            	 gMain.selPanel.createPoAction.disable();
             }
             })	

        //디폴트 로드
        gMain.setCenterLoading(false);
		//this.store.getProxy().setExtraParam('not_standard_flag', 'O');
		this.store.getProxy().setExtraParam('standard_flag', 'O');
		this.store.getProxy().setExtraParam('class_code', null);
		this.store.getProxy().setExtraParam('POP', null);
        this.store.load(function(records){});
    },selectedClassCode: '',
    reflashClassCode : function(o){
    	this.selectedClassCode = o;
    	var target_class_code = gMain.selPanel.getInputTarget('class_code');
    	target_class_code.setValue(o);
    	
    },
    items : [],
    matType: 'RAW',
    stockviewType: "ALL"
});

