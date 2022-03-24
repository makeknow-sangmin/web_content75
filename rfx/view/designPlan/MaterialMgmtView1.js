//자재 관리
Ext.define('Rfx.view.designPlan.MaterialMgmtView1', {
    extend: 'Rfx.base.BaseView',
    xtype: 'material-mgmt-view1',
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
    	 switch(vCompanyReserved4){
    	 	case 'DABP01KR':
    	 		this.addSearchField('item_code');
	 			this.addSearchField('item_name');
	 			this.addSearchField('specification');
	 			break;
    	 	
    	 	default:
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
					 this.addSearchField('remark');
					// this.addSearchField('notify_flag'); //품목사용유무확인메뉴
					 this.addSearchField (
						{
							field_id: 'notify_flag'
							,store: "CodeYnStore"
							,displayField: 'codeName'
							,valueField: 'systemCode'
							,innerTpl	: '{codeName}'
								});
					
					// this.addSearchField ({
					// 	type: 'distinct',
					// 	width: 140,
					// 	tableName: 'srcahd',
					// 	field_id: 'remark',     
					// 	fieldName: 'remark'
					// 			}); 
//    	 			this.addSearchField('maker_name');
    	 			
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
		
        
		this.addCallback('GET-SG-CODE', function(combo, record){
			
			// console_logs('GET-CODE-HEAD record', record);
			// console_logs('combo', combo);
			
			gMain.selPanel.inputClassCode = record;

			var target_item_code = gMain.selPanel.getInputTarget('item_code');
			var class_code = gMain.selPanel.inputClassCode.get('system_code');
			target_item_code.setValue(target_item_code.getValue() + class_code.substring(0,1)+'-');

		});
		
		
		this.addCallback('GET-CODE-HEAD', function(combo, record){
			
			// console_logs('GET-CODE-HEAD record', record);
			// console_logs('combo', combo);
			
			gMain.selPanel.inputBuyer = record;
			// gMain.selPanel.doReset();
			
			var target_item_code = gMain.selPanel.getInputTarget('item_code');
			var wa_code = record.get('wa_code');
			if(target_item_code!=null && wa_code!=null && wa_code.length>2) {
				target_item_code.setValue(wa_code.substring(0,1));
			}
			
			// var target_bmquan = gMain.selPanel.getInputTarget('bm_quan');
			// target_bmquan.setValue(0);
			
				
			var address_1 = record.get('address_1');
			var target_address_1 = gMain.selPanel.getInputTarget('delivery_info');
			target_address_1.setValue(address_1);
			
			combo.select(record);
			// gMain.selPanel.computeProduceQty(50000);
		});

		// 품목번호 자동생성
		this.addCallback('AUTO_ITEMCODE', function(o){
			if(this.crudMode=='EDIT') { // EDIT
	    		console_logs('preCreateCallback', 'IN EDIT');
	    	} else {// CREATE,COPY
				// 마지막 자재번호 가져오기
			   var target2 = gMain.selPanel.getInputTarget('item_code');
			   
			   var class_code = gMain.selPanel.inputClassCode.get('system_code');
			   var wa_code = gMain.selPanel.inputBuyer.get('wa_code');
			   
			   var item_first = wa_code.substring(0,1)+ class_code.substring(0,1)+'-';
			   
			   Ext.Ajax.request({
					url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
					params:{
						item_first: item_first,
						codeLength: 3
					},
					success : function(result, request) {   	
						var result = result.responseText;
						
						
						console_logs('result 2', result);
						
						target2.setValue(result);
						
					},// endofsuccess
					failure: extjsUtil.failureMessage
				});// endofajax
	    		
	    		
	    		
	    	}

		});
		//////////////////////////////////////////////////////////////////////////////////////////////////////////중복확인추가TEST
		this.addCallback('CHECK_CODE', function (o) {
			
			//var class_type = gMain.selPanel.getInputJust('claast|class_type').getValue();
            var target = gMain.selPanel.getInputJust('srcahd|specification');

			var specification = target.getValue();
	
			//alert(specification);
			
            var upperSpecification = specification.toUpperCase();

            //if(code == null || code == ""){
            if (specification.length < 1) {
		
                Ext.Msg.alert('안내', '규격은 한자리 이상 영문으로 입력해주세요', function () {
                });
            } else {
				//alert("else탐");
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/admin/Series.do?method=checkSpec',
                    params: {
						specification: specification
                        // code: code,
                        // identification_code: 'MT'
                    },
                    success: function (result, request) {
						//alert("컨트롤러 타고 나옴");
                        var resultText = result.responseText;
                        console_logs('upperSpecification', upperSpecification)
                        if (resultText == '0') {
                            Ext.Msg.alert('안내', '사용가능한 코드입니다', function () {
                            });
//	            				gMain.selPanel.getInputTarget('checkCode').setValue(uppercode);
                            target.setValue(uppercode);
                        } else {
                            Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () {
                            });
//	        					gMain.selPanel.getInputTarget('checkCode').setValue('');
                            target.setValue('');
                        }
                    },
                    failure: extjsUtil.failureMessage
                }); //end of ajax
            }


        });  // end of addCallback

////////////////////////////////////////////////////////////////////////////////////////////////////

        switch(vCompanyReserved4){
        	case 'SWON01KR':
        	case 'SKNH01KR':
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
        	 	                 	gm.me().reflashClassCode(class_code);
        	 		           }
        	 	        },
        	             canCreate:   true,
        	             canEdit:     true,
        	             canView:     true,
						 tableName: 'srcahd',
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
        	 	                 	gm.me().reflashClassCode(class_code);

        	 		           }
        	 	        },
        	              canCreate:   true,
        	              canEdit:     true,
        	              canView:     true,
						  tableName: 'srcahd',
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
        			           select: function (combo, record) {
        			        	   var class_code = record.get('class_code');
        		                 	gm.me().reflashClassCode(class_code);

        			           }
        	              },
        	              canCreate:   true,
        	              canEdit:     true,
        	              canView:     true,
						  tableName: 'srcahd',
        	              position: 'center',
        	              setNumber:1, 
        	              setName:"분류코드", 
        	              setCols:2
        	          });        
        		break;
        		
        		default:
        			
        			break;
        
        }
        
       
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function(o){
        	console_logs('addCallback>>>>>>>>>', o);
        });
        
        
        // 분류코드로 품번 HEAD 만들기
		this.addCallback('GET-CLASS-CODE', function(combo,record){
			
			console_logs('GET-CLASS-CODE record>>>>>>>>>>>>>>>', record);
			gm.me().inputClassCode = record;
			console_logs('gm.me().inputClassCode>>>>>>>>>>>>>>>', gm.me().inputClassCode);
			var target_item_code = gm.me().getInputJust('srcahd|item_code');


			if(target_item_code!=null) {
				target_item_code.setValue(gm.me().inputSpCode.data.system_code + gm.me().inputClassCode);
			}

			});
		
		this.addCallback('GET-SP-CODE', function(combo, record){
			console_logs('GET-SP-CODE record>>>>>>>>>>>>>>>', record);
			gm.me().inputSpCode = record;
			gm.me().refreshItemCode();
//				gm.me().inputSpCode = record;
//			console_logs('gm.me().inputSpCode>>>>>>>>>>>>>>>', gm.me().inputSpCode);
//
//				var target_item_code = gm.me().getInputJust('srcahd|item_code');
//				var target_class_code = gm.me().getInputJust('srcahd|class_code');
//				var sp_code = gm.me().inputSpCode.get('systemCode');
//				
//				var cuClass_Code = target_class_code.getValue();
//				
//				var item_code_pre = sp_code;x
//				
//				if(cuClass_Code!=null && cuClass_Code.length>0) {
//					item_code_pre = item_code_pre + cuClass_Code;
//				}
//				
//				target_item_code.setValue(item_code_pre);
			});
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('MTRL_FLAG_SEW', function(o){
        	console_logs('addCallback_MTRL_FLAG_SEW>>>>>>>>>', o);
        });

        //console_logs('this.fields', this.fields);
        
        
        switch(vCompanyReserved4){
		 	case 'DABP01KR':
		        this.createStore('Rfx.model.MtrlbuyMgmtK', [{
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
				break;
			case 'SKNH01KR':
				this.createStore('Rfx.model.Heavy4MaterialMgmt', [{
					property: 'unique_id',
					direction: 'DESC'
				}],
				gMain.pageSize/*pageSize*/
				//order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
				,{
					comment: 's.comment1'
				},
				['srcahd']
				);
				break;
		 	default:
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
		}

		Ext.define('AssyMap', {
            extend: 'Ext.data.Model',
            fields: [
						{name: 'sp_code', 	type: "string" },
						{name: 'item_code', 	type: "string" },
						{name: 'item_name', 	type: "string" },
						{name: 'specification', 	type: "string" },
						{name: 'maker_name', 	type: "string" },
						{name: 'quan', 	type: "string" },
						{name: 'sales_price', 	type: "string" },
						{name: 'model_no', 	type: "string" },
						{name: 'comment', 	type: "string" },
						{name: 'creator', 	type: "string" },
                ],
            proxy: {
                type: 'ajax',
                api: {
                    read: CONTEXT_PATH + '/purchase/material.do?method=bomlistAssyMap',
                },
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success',
                    excelPath: 'excelPath'
                }
            }
		});
		
		bom_store = new Ext.data.Store({  
			pageSize: getPageSize(),
			model: 'AssyMap',
			sorters: [{
				property: 'unique_id',
				direction: 'DESC'
			}]
	    });
				
		var option = {
			listeners: {
				itemdblclick: this.bomlistView
			}
		}
        
        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar, option);

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
 				gm.me().stockviewType = 'ALL';
 				gm.me().store.getProxy().setExtraParam('standard_flag', '');
 				gm.me().store.getProxy().setExtraParam('sg_code', '');
 				gm.me().store.load(function(){});
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
  				gm.me().store.getProxy().setExtraParams({});
  				gm.me().store.getProxy().setExtraParam('standard_flag', 'R');
  				gm.me().store.getProxy().setExtraParam('sg_code', 'DG');
  				gm.me().store.load(function(){});
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
   				gm.me().store.getProxy().setExtraParams({});
   				gm.me().store.getProxy().setExtraParam('standard_flag', 'R');
   				gm.me().store.getProxy().setExtraParam('sg_code', 'SG');
   				gm.me().store.load(function(){});
   			 }
   		});
       this.setSubMatView = Ext.create('Ext.Action', {
        	 xtype : 'button',
 			 text: '소모품(MRO)',
 			 tooltip: '부자재 재고',
 			toggleGroup: 'stockviewType',
 			 handler: function() {
 				 this.matType = 'SUB';
 				gm.me().store.getProxy().setExtraParams({});
 				gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
 				gm.me().store.getProxy().setExtraParam('sg_code', '');
 				gm.me().store.load(function(){});
 			 }
 		});
      
       //DABP 버튼 분류
       this.setAllSubMatView = Ext.create('Ext.Action', {
      	 xtype : 'button',
			 text: '전체',
			 tooltip: '전체',
			//pressed: true,
			toggleGroup: 'stockviewType',
			 handler: function() {
				gm.me().store.getProxy().setExtraParams({});
//				gm.me().stockviewType = 'ALL';
				gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
				gm.me().store.load(function(){});
			 }
		});
       this.setSubMtrlView = Ext.create('Ext.Action', {
      	 xtype : 'button',
			 text: '부자재',
			 tooltip: '부자재',
			//pressed: true,
			toggleGroup: 'stockviewType',
			 handler: function() {
				gm.me().store.getProxy().setExtraParams({});
				gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
				gm.me().store.getProxy().setExtraParam('outbound_flag', 'N');
				gm.me().store.getProxy().setExtraParam('class_code_is_null', 'Y');
				gm.me().store.load(function(){});
			 }
		});
//       this.setPkgCatonView = Ext.create('Ext.Action', {
//        	 xtype : 'button',
//  			 text: '카톤박스(사내용)',
//  			 tooltip: '카톤박스(사내용)',
//  			//pressed: true,
//  			toggleGroup: 'stockviewType',
//  			 handler: function() {
//  				gm.me().store.getProxy().setExtraParams({});
//  				gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
//  				gm.me().store.getProxy().setExtraParam('outbound_flag', 'N');
//  				gm.me().store.getProxy().setExtraParam('class_code', 'B');
//  				gm.me().store.load(function(){});
//  			 }
//  		});
//       this.setPrchCatonView = Ext.create('Ext.Action', {
//      	 xtype : 'button',
//			 text: '카톤박스(판매용)',
//			 tooltip: '카톤박스(판매용)',
//			//pressed: true,
//			toggleGroup: 'stockviewType',
//			 handler: function() {
//				 gm.me().store.getProxy().setExtraParams({});
////				 this.matType = 'PRCH';
//				gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
//				gm.me().store.getProxy().setExtraParam('class_code', 'B');
//				gm.me().store.getProxy().setExtraParam('outbound_flag', 'Y');
////				gm.me().store.load(function(){});
//				gm.me().store.load();
//			 }
//		});
       
       this.createPoAction = Ext.create('Ext.Action', {
      	 xtype : 'button',
      	 	 iconCls:'fa-cart-arrow-down_14_0_5395c4_none',
			 text: '주문카트 ',
			 tooltip: '주문카트 담기',
			 disabled: true,
			 handler: function() {
				 
				 var selections = gm.me().grid.getSelectionModel().getSelection();
				 
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
				 
				 
//				 switch(gm.me().stockviewType) {
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
  				 
  				 var selections = gm.me().grid.getSelectionModel().getSelection();
  				 
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
  				 
  				 
//  				 switch(gm.me().stockviewType) {
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
  				 
  				 var selections = gm.me().grid.getSelectionModel().getSelection();
  				 
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
		  
		  this.itemUseNotAction = Ext.create('Ext.Action', {
			xtype : 'button',
			iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			text: '품목체크',
			tooltip: '품목 사용 유무',
			disabled: true,
			handler:function(){
				var selections = gm.me().grid.getSelectionModel().getSelection();

				if (selections) {
					var uids = [];
					var names =[];
					for(var i=0; i< selections.length; i++) {
						var rec = selections[i];
						var unique_id = rec.get('unique_id');
						uids.push(unique_id);
						var item_name = rec.get('item_name');
						names.push(item_name);
					}
				}

				gm.me().updateUseYNAction(uids, names);
			}
		  });

       
       //버튼 추가.
       buttonToolbar.insert(7, '-');
       switch(vCompanyReserved4){
	       case "SKNH01KR":
				buttonToolbar.insert(6, this.itemUseNotAction);
	           //buttonToolbar.insert(6, this.outGoAction);
	           //buttonToolbar.insert(6, this.createPoAction);
	    	   //buttonToolbar.insert(8, this.barcodePrintAction);
	  		 break;
	       case "DABP01KR":
case "DJEP01KR":
//	    	   buttonToolbar.insert(7, this.setPrchCatonView);
//		       buttonToolbar.insert(7, this.setPkgCatonView);
//		       buttonToolbar.insert(7, this.setSubMtrlView);
//		       buttonToolbar.insert(7, this.setAllSubMatView);
		       buttonToolbar.insert(6, this.outGoAction);
		       buttonToolbar.insert(6, this.createPoAction);
		         
	  		 break;
	  		 default:
	  			 buttonToolbar.insert(7, this.setSubMatView);
		         buttonToolbar.insert(7, this.setSaMatView);
		         buttonToolbar.insert(7, this.setRawMatView);
		         buttonToolbar.insert(7, this.setAllMatView);
		         buttonToolbar.insert(6, this.outGoAction);
				 buttonToolbar.insert(6, this.createPoAction);
				 buttonToolbar.insert(8, this.readHistoryAction);
	         break;
       }
       
       buttonToolbar.insert(6, '-');
        
        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
           		gm.me().createPoAction.enable();
				gm.me().readHistoryAction.enable();
				gm.me().itemUseNotAction.enable();
             } else {
				gm.me().createPoAction.disable();
				gm.me().readHistoryAction.disable();
				gm.me().itemUseNotAction.enable();
             }
             })	

        //디폴트 로드
        gMain.setCenterLoading(false);
        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');
        
        switch(vCompanyReserved4){
        	case 'HSGC01KR':
        		 this.store.getProxy().setExtraParam('hsg_link_n', 'Y');
        	break;
        	case 'DABP01KR':
       		 this.store.getProxy().setExtraParam('standard_flag', 'K');
       		break;
        		 
        }
        this.store.load(function(records){});
    },
    
	selectedClassCode: '',
	
	updateUseYNAction: function(uids, names){
			  console_logs("useyn names   :  ", names);

			  var htm = "";
			  var chkVal;

			  for(var i=0; i<names.length; i++){
				  htm += names[i] + "\r\n";
			  }

			  var form = Ext.create('Ext.form.Panel', {
				id: gu.id('modalUpdateUseYN'),
				defaultType: 'textfield',
				border: false,
				bodyPadding: 15,
				width: '100%',
				height: '100%',
				region: 'center',
				defaults: {
					// anchor: '100%',
					editable: true,
					allowBlank: false,
					msgTarget: 'side',
					labelWidth: 100
				},
				items: [{
					xtype: 'textarea',
					fieldLabel: '선택한 품목',
					width: '100%',
					readOnly: true,
					value: htm
					},{
						//xtype: 'checkboxgroup',
						xtype: 'radiogroup',
						fieldLabel: '사용유무',
						id: 'itemUseYN',
						columns: 1,
						listeners: {
							scope: this,
							change: function(item, value){
								var checkedItems = item.getChecked()[0].getValue();
							},
							select : function(item, value){
								var checkedItems = item.getChecked();
							}
						 },
						items:[{
							boxLabel: "사용안함",
							name: 'rb',
							checked: true,
							inputValue: "N"
						},{
							boxLabel: "사용",
							name: 'rb',
							inputValue: "Y"
						}]
					}
				]
			});

			var win = Ext.create('Ext.window.Window',{
				autoShow : true,
				title: "품목 사용 유무 체크",
				width : 500,
				height : 200,
				modal: true,
				items: [form],
				buttons: [{
                    text: CMD_OK,
                    handler: function() {
						var form = gu.getCmp('modalUpdateUseYN').getForm();
						var radioCheckVal = Ext.getCmp('itemUseYN').getChecked();
						// var whereval = [];
						// var uidsplit = uids.split(',');
						// for(var i in uidsplit){
						// 	whereval.add(uidsplit[i]);
						// }	

						var whereval = uids.toString();

                        if (form.isValid()) {
                            
                             Ext.Ajax.request({
                                 url: CONTEXT_PATH + '/index/generalData.do?method=updateGeneralOne',
                                 params: {
									whereField : 'unique_id',
									setField: 'notify_flag',
									setValue: radioCheckVal[0].inputValue,
									valueType: 'string',
									whereValue: whereval,
									tableName: 'srcahd'
                                 },
                                 success: function(result, request) {
									gm.me().store.load(function(){

									});
                                 },
                                 failure: extjsUtil.failureMessage
                             });

                            if (win) {
                                win.close();
                            }
                        } else {
                            Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                        }

                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function() {
                        if (win) {
                            win.close();
                        }
                    }
                }]
			})


	},
    
    reflashClassCode : function(class_code){
    	console_logs('reflashClassCode class_code', class_code);
    	this.selectedClassCode = class_code;
		var target_class_code = gm.me().getInputJust('srcahd|class_code');
		console_logs('target_class_code', target_class_code);
    	target_class_code.setValue(class_code);
    	
    	gm.me().refreshItemCode();
    	
    },
    
//    refreshItemCode : function() {
//    	
//		console_logs('gm.me().inputSpCode>>>>>>>>>>>>>>>', gm.me().inputSpCode);
//
//		var target_item_code = gm.me().getInputJust('srcahd|item_code');
//		var target_class_code = gm.me().getInputJust('srcahd|class_code');
//		var sp_code = gm.me().inputSpCode.get('systemCode');
//		
//		var cuClass_Code = target_class_code.getValue();
//		
//		var item_code_pre = sp_code;
//		
//		if(cuClass_Code!=null && cuClass_Code.length>0) {
//			item_code_pre = item_code_pre + cuClass_Code;
//		}
//		
//		target_item_code.setValue(item_code_pre);
//    },
    

    
    refreshItemCode : function() {
    	var sp_code = null;
    	
		//console_logs('gm.me().inputSpCode>>>>>>>>>>>>>>>', gm.me().inputSpCode);
    	var o = gm.me().inputSpCode;
    	
    	if(o!=null) {
    		sp_code = o.get('systemCode');
    	} else {
    		var o1 = gm.me().getInputJust('srcahd|sp_code');
    		sp_code = o1.getValue();
    	}

		var target_class_code = gm.me().getInputJust('srcahd|class_code');
		var cuClass_Code = target_class_code.getValue();
		
		this.refreshItemCodeInner(sp_code, cuClass_Code);
		
	},
	
	refreshItemCodeInner : function(sp_code, cuClass_Code) {
    	var target_item_code = gm.me().getInputJust('srcahd|item_code');
    	console_logs("상민",target_item_code);
    	var item_code_pre = sp_code==null? '' : sp_code;
		if(cuClass_Code!=null && cuClass_Code.length>0) {
			item_code_pre = item_code_pre + cuClass_Code;
		}
    	
    	target_item_code.setValue(item_code_pre);
    	
    },
    
	copyCallback: function() {
		this.refreshItemCode();
	},

	bomlistView: function() {
		if(vCompanyReserved4 != 'APM01KR') {
			return null;
		}
		var selection = gm.me().grid.getSelectionModel().getSelection();
		var rec = selection[0];

		console_logs('===rec', rec);

		var srcahd_uid = rec.get('unique_id_long');

		var win = Ext.create('ModalWindow', {
			title: CMD_VIEW + '::' + /*(G)*/'BOM LIST',
			width: 1400,
			height: 700,
			minWidth: 250,
			minHeight: 180,
			autoScroll: true,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			xtype:'container',
			plain: true,
			items: [
				{
					xtype: 'panel',
					id: 'First Grid',
					autoScroll: true,
					autoWidth: true,
					flex: 3,
					padding: '5',
					items:gm.me().bomlistViewForm(srcahd_uid)
				}
			],
			buttons: [{
				text: CMD_OK,
				handler: function() {
					if(win) {win.close();}
				}
			}]
		});
		win.show();
	},

	bomlistViewForm: function(srcahd_uid) {
	var BOM_COLUMN = [];
	
	BOM_COLUMN.push(
			{
				header:'구분', dataIndex: 'sp_code',	
				width : 40,  align: 'left',resizable:true,sortable : true,
			},{
				header:'품목코드', dataIndex: 'item_code',	
				width : 100,  align: 'left',resizable:true,sortable : true,
			},{
				header:'품명', dataIndex: 'item_name',	
                width : 180,  align: 'left',resizable:true,sortable : true,
                flex:1
			},{
				header:'규격', dataIndex: 'specification',	
				width : 130,  align: 'left',resizable:true,sortable : true,
			},{
				header:'제조원', dataIndex: 'maker_name',	
				width : 130,  align: 'left',resizable:true,sortable : true,
			},{
				header:'블록', dataIndex: 'area_code',	
				width : 80,  align: 'left',resizable:true,sortable : true,
			},{
				header:'수량', dataIndex: 'quan',	
				width : 50,  align: 'left',resizable:true,sortable : true,
			},{
				header:'단위', dataIndex: 'unit_code',	
				width : 40,  align: 'left',resizable:true,sortable : true,
			},{
				header:'단가', dataIndex: 'static_sales_price',	
				width : 70,  align: 'left',resizable:true,sortable : true,
            },{
				header:'재질', dataIndex: 'model_no',	
				width : 130,  align: 'left',resizable:true,sortable : true,
			},{
				header:'등록자', dataIndex: 'creator',	
				width : 80,  align: 'left',resizable:true,sortable : true,
			}
	);
	
	bom_store.getProxy().setExtraParam('unique_id', srcahd_uid);
	bom_store.load(function(){});

	console_logs('==dasdasd', bom_store);
	
	bom_grid = Ext.create('Ext.grid.Panel', {
		id: 'bom_grid_panel',
        store: bom_store,
        multiSelect: true,
        stateId: 'stateGridsub',
//        selModel: selModel,
        autoScroll : true,
        autoHeight: true,
        height: 400,  // (getCenterPanelHeight()/5) * 4
//        bbar: getPageToolbar(store),
        region: 'center',
        columns: /*(G)*/BOM_COLUMN,
        viewConfig: {
            stripeRows: true,
			enableTextSelection: true,
		},
		listeners: {
			itemdblclick: function() {
				gm.me().renderMoveBom();
			}
		}
	});
	
	return bom_grid;
},

renderMoveBom: function() {
		// console_logs('=====wwww', Ext.getCmp('bom_grid_panel').getSelectionModel().getSelection()[0]);
		var rec = Ext.getCmp('bom_grid_panel').getSelectionModel().getSelection()[0];

        if(rec != null) {
            
            // var wa_name  = rec.get('wa_name');
            // var pj_name  = rec.get('pj_name');
            // var pj_code  = rec.get('pj_code');
            var pj_uid  = rec.get('ac_uid');
            var parent_uid  = rec.get('parent_uid');
            var child = rec.get('unique_uid');

            return gm.me().renderBom(null, null, null, pj_uid, parent_uid, child);
        }
},

	readHistoryAction: Ext.create('Ext.Action', {
        iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
        text: '이력조회',
        tooltip: '이력조회',
        disabled: true,
        handler: function(widget, event) {
            gm.me().readHistroyView();
        }
    }),
	
	readHistroyView:function() {
        Ext.define('XpoAstHistory', {
            extend: 'Ext.data.Model',
            fields: /*(G)fieldPohistory*/'',
            proxy: {
                type: 'ajax',
                api: {
                    read: CONTEXT_PATH + '/purchase/request.do?method=readPohistory'
                },
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success',
                    excelPath: 'excelPath'
                },
                writer: {
                    type: 'singlepost',
                    writeAllFields: false,
                    root: 'datas'
                }
            }
        });

        var poHistoryStore = new Ext.data.Store({
            pageSize: 50,
            model: 'XpoAstHistory',
            sorters: [{
                property: 'po_date',
                direction: 'DESC'
            }]
        });

        var selection = gm.me().grid.getSelectionModel().getSelection()[0];
        var uid_srcahd = selection.get('unique_id_long');

        poHistoryStore.getProxy().setExtraParam('uid_srcahd', uid_srcahd);
        poHistoryStore.load();

        var bomHistoryGrid = Ext.create('Ext.grid.Panel', {
            store: poHistoryStore,
            stateId: 'bomHistoryGrid',
            layout:'fit',
            border: false,
            frame : false,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            sortable: false,
            multiSelect : false,
            autoScroll: true,
            heigth: 300,
            columns: [
                {text: '프로젝트 코드', dataIndex: 'account_code',width:100},
                {text: '프로젝트 명', dataIndex: 'account_name',width:80},
                {text: 'Assembly', dataIndex: 'pl_no',width:80},
                {text: '발주번호', dataIndex: 'po_no',width:120},
                {text: '주문일자', dataIndex: 'po_date',width:120},
                {text: '공급사 코드', dataIndex: 'seller_code',width:80},
                {text: '공급사 명', dataIndex: 'seller_name',width:120},
                {text: '주문단가', dataIndex: 'sales_price',width:80},
                {text: '주문수량', dataIndex: 'po_qty',width:80},
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/'주문 P/O 이력',
            width: 900,
            height: 700,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype:'container',
            plain: true,
            items: [
                bomHistoryGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function() {
                    if(win) {win.close();}
                }
            }]
        });
        win.show();
    },
	
    items : [],
    matType: 'RAW',
    stockviewType: "ALL"
});

