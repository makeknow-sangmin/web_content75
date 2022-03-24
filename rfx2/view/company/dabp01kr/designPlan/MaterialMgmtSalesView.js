//자재 관리
Ext.define('Rfx2.view.company.dabp01kr.designPlan.MaterialMgmtSalesView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'material-mgmt-sales',
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
    	 			this.addSearchField('notify_flag'); //품목사용유무확인메뉴
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
		        this.createStore('Rfx.model.MtrlSalesMgmt', [{
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

	
		this.store.getProxy().setExtraParam('outbound_flag', 'Y');
		this.store.getProxy().setExtraParam('stock_check', 'Y');
		
		Ext.each(this.columns, function(columnObj, index) {
		var dataIndex = columnObj["dataIndex"];
		// console_logs('===columnObj', columnObj);
		var qty = 0;
		switch (dataIndex) {
			case 'stock_qty':
				columnObj["renderer"] = function(value, meta) {
					this.qty = value;
					return value;
				};
				break;
			case 'request_qty':
				columnObj["editor"] = {};
				columnObj["css"] = 'edit-cell';
				columnObj["renderer"] = function(value, meta, record) {
					meta.css = 'custom-column';
					if(value == null || value == '' || value == undefined) {
						return this.qty;
					} else if(value > this.qty) {
						Ext.Msg.alert('경고', '실수량보다 많습니다.', function() {});
						gm.me().store.load(function() {
							record.set('request_qty', this.qty);
						});
						return this.qty;
					}	
					return value;
				};
				// columnObj["dataIndex"] = 'stock_qty';
				break;
		}
	});
		
        
        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);

        this.createCrudTab();

		(buttonToolbar.items).each(function(item, index, length) {
            if (index == 1 || index == 2 || index == 3) {
                buttonToolbar.items.remove(item);
            }
		});
		

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
//        this.setAllSubMatView = Ext.create('Ext.Action', {
//       	 xtype : 'button',
// 			 text: '전체',
// 			 tooltip: '전체',
// 			//pressed: true,
// 			toggleGroup: 'stockviewType',
// 			 handler: function() {
// 				gm.me().store.getProxy().setExtraParams({});
// //				gm.me().stockviewType = 'ALL';
// 				gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
// 				gm.me().store.load(function(){});
// 			 }
// 		});
       this.setPrchCatonView = Ext.create('Ext.Action', {
      	 xtype : 'button',
			 text: '전체',
			 tooltip: '전체',
			//pressed: true,
			toggleGroup: 'stockviewType',
			 handler: function() {
				 gm.me().store.getProxy().setExtraParams({});
//				 this.matType = 'PRCH';
				gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
				gm.me().store.getProxy().setExtraParam('class_code', 'B');
				gm.me().store.getProxy().setExtraParam('outbound_flag', 'Y');
//				gm.me().store.load(function(){});
				gm.me().store.load();
			 }
		});
       
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
  			 text: '납품생성 ',
  			 tooltip: '납품생성',
  			 disabled: true,
  			 handler: function() {
				var selections = gm.me().grid.getSelectionModel().getSelection();
				console_logs('===>selections', selections);

				var buyer_uid = selections[0].get('buyer_uid');
				for(var i=0; i<selections.length; i++) {
					var buyer_uid_compare = selections[i].get('buyer_uid');
					if(buyer_uid != buyer_uid_compare) {
						Ext.Msg.alert('안내', '다른 고객사가 포함되어 있습니다.', function() {});
						return;
					}
				}

				var request_qtys = [];
				var item_names = [];
				var product_uids = [];
				var pj_uids = [];
				var reserved_varchar6s = [];
				var reserved_double1s = [];
				var sales_prices = [];
				var srcahd_uids = [];
				var descriptions = [];

				var total_price = 0;

				for(var i=0; i<selections.length; i++) {
					var rec = selections[i];
					var cur_qty = rec.get('request_qty') == undefined || rec.get('request_qty') == null ? rec.get('stock_qty') : rec.get('request_qty');
					request_qtys.push(cur_qty);
					item_names.push(rec.get('item_name'));
					product_uids.push(rec.get('product_uid'));
					pj_uids.push(rec.get('pj_uid'));
					reserved_varchar6s.push(rec.get('reserved_varchar6'));
					reserved_double1s.push(rec.get('reserved_double1'));
					sales_prices.push(rec.get('product_sales_price'));
					srcahd_uids.push(rec.get('unique_id'));
					descriptions.push(rec.get('description'));
					console_logs('======s',rec.get('product_sales_price'));
					
					console_logs('======q',cur_qty);
					total_price = total_price + (cur_qty * rec.get('product_sales_price'));
				}
				var stock_qty = selections[0].get('stock_qty');

				var delivery_info = selections[0].get('delivery_info');
				var delivery_plan = selections[0].get('delivery_plan');
				var supplier_name = selections[0].get('supplier_name');
				var buyer_name = selections[0].get('buyer_name');
				var buyer_uid = selections[0].get('buyer_uid');

				var delivery_address = null;
				var address_1 = selections[0].get('address_1');
				var address_2 = selections[0].get('address_2');

				var reserved_varchar6 = selections[0].get('reserved_varchar6');
				var reserved_double1 = selections[0].get('reserved_double1');

				// var sales_price = selections[0].get('sales_price');

				if(address_2 == null || address_2.length < 0 || address_2 == undefined || address_2 == '') {
					delivery_address = address_1;
				} else {
					delivery_address = address_2;
				}

				if(stock_qty < 1) {
					Ext.MessageBox.alert('알림', '실수량을 확인해주세요.');
					return;
				}
				

				var buyerStore = Ext.create('Mplm.store.BuyerStore', {
                    // supplierType: gm.me().suplier_type
                });

				var form =  Ext.create('Ext.form.Panel', {
							id: gu.id('formPanel'),
							xtype: 'form',
							frame: false ,
							border: false,
							bodyPadding: '3 3 0',
							region: 'center',
							fieldDefaults: {
								labelAlign: 'right',
								msgTarget: 'side'
							},
							defaults: {
								anchor: '100%',
								labelWidth: 60,
								margins: 10,
							},
							items   : [
								new Ext.form.Hidden({
									name: 'srcahd_uids',
									value: srcahd_uids
								}),
								new Ext.form.Hidden({
									name: 'product_uids',
									value: product_uids
								}),
								new Ext.form.Hidden({
									name: 'pj_uids',
									value: pj_uids
								}),
								new Ext.form.Hidden({
									name: 'request_qtys',
									value: request_qtys
								}),
								new Ext.form.Hidden({
									name: 'item_names',
									value: item_names
								}),
								new Ext.form.Hidden({
									name: 'reserved_varchar6s',
									value: reserved_varchar6s
								}),
								new Ext.form.Hidden({
									name: 'reserved_double1s',
									value: reserved_double1s
								}),
								new Ext.form.Hidden({
									name: 'sales_prices',
									value: sales_prices
								}),
								new Ext.form.Hidden({
									name: 'descriptions',
									value: descriptions
								}),
								{
                                    fieldLabel: '고객사',
                                    xtype: 'combo',
                                    id: 'coord_key1',
                                    anchor: '100%',
                                    name: 'coord_key1',
                                    store: buyerStore,
                                    displayField: 'wa_name',
                                    valueField: 'unique_id',
									emptyText: buyer_name,
									allowBlank: true,
                                    sortInfo: {
                                        field: 'wa_name',
                                        direction: 'ASC'
                                    },
									typeAhead: false,
                                    fieldStyle: 
                                        'background-color: #ddd; background-image: none;'
                                    ,
                                    //hideLabel: true,
									minChars: 2,
									selectOnFocus: true,
                                    listConfig: {
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{unique_id}">{wa_name}|{wa_code}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function(combo, record) {
											console_logs('=>combo', combo);
											console_logs('=>record', record);
                                            //    			            	        	   var reccode = record.get('area_code');
											coord_key1 = record.get('unique_id');
											var address = record.get('address_2');

											if(address == null || address == undefined || address == '') {
												address = record.get('address_1');
											}
											
											Ext.getCmp('delivery_info').setValue(address);
                                            //    			            	        	   Ext.getCmp('maker_code').setValue(reccode);
										},
										afterrender: function(t,o) {
											Ext.getCmp('coord_key1').setValue(buyer_uid);
										}
									}
								}, 
								// {
								// 	xtype: 'textfield',
								// 	fieldLabel: '제품명',
								// 	name: 'item_name',
								// 	value:  item_name,
								// 	anchor: '100%',
					            //     fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
					            //     readOnly: true
								// },{
								// 	xtype: 'textarea',
								// 	fieldLabel: '상세설명',
								// 	name: 'description',
								// 	value:  description,
								// 	anchor: '100%',
								// 	grow: true,
					            //     growMax: 150,
					            //     maxLength:10000,
					            //     anchor: '100%',
					            //     fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
					            //     readOnly: true
								// },
								{
									xtype: 'textfield',
									fieldLabel: '배송지',
									name: 'delivery_info',
									id: 'delivery_info',
									value:  delivery_address,
									anchor: '100%'
								},{
									xtype: 'datefield',
									fieldLabel: '배송일시',
									name: 'delivery_plan',
									value:  delivery_plan,
									anchor: '100%'
								},{
						            xtype: 'timefield',
//						            labelWidth: 0,
						            fieldLabel: '배송시간',
						            name: 'delivery_time',
						            anchor: '100%',
//						            hideLabel: true,
						            width: 110,
						            minValue: '7:00 AM',
						            maxValue: '11:00 PM',
						            value: '7:00 AM',
						            increment: 30,
						            format: 'H:i'
								},{
									xtype: 'combo',
									fieldLabel: '차량지정',
									name: 'noti_flag',
									// value:  noti_flag,
									anchor: '100%',
									store: Ext.create('Mplm.store.CarMgntStore',{})
									,displayField: 'reserved_varchar1'
									,valueField: 'unique_id'
									,innerTpl	: '<div data-qtip="{unique_id}">{reserved_varchar1}</div>',
					                triggerAction: 'all',
					                listeners: {
					                    select: function(combo, record) {
					                        var horizon = record.get('reserved_double1'); //가로
					                        var vertical = record.get('reserved_double2'); //세로
					                        var height = record.get('reserved_double3'); //높이
					                        var allow_weight = record.get('reserved_double4'); //허용하중
			                                
					                        var car_vol = Number(horizon*vertical*height);
					                        var weight_percent = 0;
					                        
					                        if(car_vol>0&&prd_vol>0){
					                        	weight_percent = Number(prd_vol/car_vol);
					                        }
					                        
					                        // Ext.getCmp('car_vol').setValue(car_vol);
					                        // Ext.getCmp('weight_percent').setValue(weight_percent);

					                    }
					                }
								},
								
								// {
								// 	fieldLabel: '수량',
								// 	id:'request_qty',
								// 	name:'request_qty',
								// 	xtype: 'numberfield',
								// 	value: stock_qty,
								// 	minValue:0,
								// 	listeners: {
								// 		change: function(store,qty) {
								// 			if(qty > stock_qty) {
								// 				Ext.MessageBox.alert('알림', '실수량보다 요청수량이 많습니다.');
								// 				Ext.getCmp('request_qty').setValue(stock_qty);
								// 				Ext.getCmp('cur_qty').setValue(0);
								// 				Ext.getCmp('cur_total').setValue(stock_qty * sales_price);
								// 			} else {
								// 				Ext.getCmp('request_qty').setValue(qty);
								// 				Ext.getCmp('cur_qty').setValue(stock_qty - qty);
								// 				Ext.getCmp('cur_total').setValue(qty * sales_price);
								// 			}
								// 		}
								// 	}
								// }
								// , {
								// 	fieldLabel: '실수량',
								// 	id:'cur_qty',
								// 	name:'cur_qty',
								// 	xtype: 'textfield',
								// 	value: 0,
								// 	editable: false,
								// 	fieldStyle: 'background-color: #D6E8F6; background-image: none;'
								// }
								, {
									fieldLabel: '납품금액',
									id:'cur_total',
									xtype: 'textfield',
									value: total_price,
									editable: false,
									fieldStyle: 'background-color: #D6E8F6; background-image: none;',
								}
								// , {
								// 	fieldLabel: '물류비',
								// 	id:'reserved_varchar6',
								// 	name:'reserved_varchar6',
								// 	editable:false,
								// 	xtype: 'textfield',
								// 	value: reserved_varchar6,
								// 	// editable: false,
								// 	// fieldStyle: 'background-color: #D6E8F6; background-image: none;'
								// }, {
								// 	fieldLabel: '개발비',
								// 	id:'reserved_double1',
								// 	name:'reserved_double1',
								// 	editable:false,
								// 	xtype: 'textfield',
								// 	value: reserved_double1,
								// 	// editable: false,
								// 	// fieldStyle: 'background-color: #D6E8F6; background-image: none;'
								// }
							]
				});

				var prWin = Ext.create('Ext.Window', {
							modal: true,
							title: '납품 생성',
							width: 600,
							height: 500,
							plain: true,
							items: form,
							buttons: [{
								text: CMD_OK,
								handler: function(btn) {
									if (btn == 'no') {
										prWin.close();
									} else {

										if(form.isValid()) {
											var val = form.getValues(false);

											Ext.MessageBox.show({
											title: 'Please wait',
											msg: '납품생성 중...',
											progressText: 'Initializing...',
											width:300,
											progress:true,
											closable:false,
											animateTarget: 'mb6'
										});

										// this hideous block creates the bogus progress
										var f = function(v){
												return function(){
													if(v == 12){
														// Ext.MessageBox.hide();
													}else{
														var i = v/11;
														Ext.MessageBox.updateProgress(i, Math.round(100*i)+'% 완료');
													}
											};
										};
										for(var i = 1; i < 13; i++){
											setTimeout(f(i), i*1200);
										}

										
											Ext.Ajax.request({
												url: CONTEXT_PATH + '/sales/delivery.do?method=addDeliveryConfirmBySrcAhd',
												params: val,
												success : function(result, request){
													Ext.MessageBox.hide();
													Ext.Msg.alert('안내', '납품생성 완료.', function() {});
													prWin.close();
													gm.me().store.load();
												},
												failure: extjsUtil.failureMessage
											})

											// form.submit({
											// 	url: CONTEXT_PATH + '/sales/delivery.do?method=addDeliveryConfirmBySrcAhd',
											// 	params: val,
											// 	success : function(result, request){
											// 		Ext.Msg.alert('안내', '납품생성 완료.', function() {});
											// 		prWin.close();
											// 		gm.me().store.load();
											// 	},
											// 	failure: extjsUtil.failureMessage
											// })
										}
									}
								}
							},{
								text: CMD_CANCEL,
								handler:function(btn) {
									prWin.close();
								}
							}]
				}); prWin.show();
  			 }
		  });
			
		  this.grid.on('edit', function(editor, e) {     
			  // commit the changes right after editing finished

	          var rec = e.record;
			  var request_qty = rec.get('request_qty');
			  var stock_qty = rec.get('stock_qty');

			  var val = 0;

			  if(request_qty > stock_qty || request_qty == undefined || request_qty == null) {
				  val = stock_qty;
			  } else {
				  val = request_qty
			  }

			  console_logs('==>gmg', gm.me().store);

			  gm.me().showToast('안내', val + '개로 수정되었습니다.');

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
       
       //버튼 추가.
       buttonToolbar.insert(7, '-');
       switch(vCompanyReserved4){
	       case "SKNH01KR":
	           //buttonToolbar.insert(6, this.outGoAction);
	           //buttonToolbar.insert(6, this.createPoAction);
	    	   //buttonToolbar.insert(8, this.barcodePrintAction);
	  		 break;
	       case "DABP01KR":
case "DJEP01KR":
	    	   buttonToolbar.insert(7, this.setPrchCatonView);
		       buttonToolbar.insert(7, this.setPkgCatonView);
		       buttonToolbar.insert(7, this.setSubMtrlView);
		       buttonToolbar.insert(7, this.setAllSubMatView);
		       buttonToolbar.insert(1, this.outGoAction);
		    //    buttonToolbar.insert(6, this.createPoAction);
		         
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
				   gm.me().createPoAction.enable();
				   gm.me().outGoAction.enable();
            	
             } else {
				 gm.me().createPoAction.disable();
				  gm.me().outGoAction.disable();
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
    
    refreshItemCodeInner : function(sp_code, cuClass_Code) {
    	var target_item_code = gm.me().getInputJust('srcahd|item_code');
    	
    	var item_code_pre = sp_code==null? '' : sp_code;
		if(cuClass_Code!=null && cuClass_Code.length>0) {
			item_code_pre = item_code_pre + cuClass_Code;
		}
    	
    	target_item_code.setValue(item_code_pre);
    	
    },
    
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
    
	copyCallback: function() {
		this.refreshItemCode();
	},
    
    items : [],
    matType: 'RAW',
    stockviewType: "ALL"
});

