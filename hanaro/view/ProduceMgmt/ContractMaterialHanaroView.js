// Ext.require([
//     'Ext.data.*',
//     'Ext.grid.*',
//     'Ext.tree.*',
//     'Ext.tip.*',
//     'Ext.ux.CheckColumn'
// ]);

//자재 관리
Ext.define('Hanaro.view.produceMgmt.ContractMaterialHanaroView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'contract-material-view',
    
    
    initComponent: function(){
    	//order by 에서 자동 테이블명 붙이기 켜기. 
    	this.orderbyAutoTable = true;
    	useMultitoolbar = false;
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
		this.addSearchField('supplier_name');
		this.addSearchField('specification');
		//this.addSearchField('maker_name');
		//switch(vCompanyReserved4){
	//	case 'SKNH01KR':
		/*this.addSearchField({
		    type: 'condition', 
		    width: 140, 
		    sqlName: 'srcahd',
		    tableName: 's',
		    field_id: 'item_name', 
		    fieldName: 'item_name',
		    params: { 
		    	uid_comast:uid_comast,
		    	distint_flag:'SKNH'
		    }
		});	
		break;
		}*/
		this.addCallback('CHECK_SP_CODE', function(combo, record){
			
			gMain.selPanel.refreshStandard_flag(record);
			
		});
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');
		
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==3||index==1||index==2) {
            	buttonToolbar.items.remove(item);        		
        	}
        });
        
        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function(o){
        	console_logs('addCallback>>>>>>>>>', o);
        });

        //console_logs('this.fields', this.fields);
        	this.createStore('Rfx.model.HEAVY5_ContractMaterial', [{
        		property: 'unique_id',
        		direction: 'DESC'
        	}],300
        	/*gMain.pageSize*//*pageSize*/
        	//order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	,{
        		item_code_dash: 's.item_code',
        		comment: 's.comment1'
        	},
        	['srcmap']
        	);
        
        var arr=[];
	     arr.push(buttonToolbar);     
		
	 	 //검색툴바 생성
	   	if(	useMultitoolbar == true ) {
	   		var multiToolbar =  this.createMultiSearchToolbar({first:9, length:11});
	   		console_logs('multiToolbar', multiToolbar);
	           for(var i=0; i<multiToolbar.length; i++) {
	       		arr.push(multiToolbar[i]);
	           }
	   	} else {
	   		var searchToolbar =  this.createSearchToolbar();
	   		arr.push(searchToolbar);
	   	}   
        var myCartModel = Ext.create('Rfx.model.MyCartLineSrcahd', {
            fields: this.fields
        });

        this.myCartStore = new Ext.data.Store({
            pageSize: 100,
            model: myCartModel,
            sorters: [{
                    property: 'create_date',
                    direction: 'desc'
                }

            ]
        });
        //grid 생성.
        this.createGrid(arr);

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
     				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
     				gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
     				gMain.selPanel.store.load(function(){});
     			 }
     		});
            this.setSaMatView = Ext.create('Ext.Action', {
             	 xtype : 'button',
      			 text: '공구',
      			 tooltip: '공구 재고',
      			//pressed: true,
      			toggleGroup: 'stockviewType',
      			 handler: function() {
      				 this.matType = 'SUB';
      				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
      				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R1');
      				gMain.selPanel.store.load(function(){});
      			 }
      		});
            this.setSubMatView = Ext.create('Ext.Action', {
            	 xtype : 'button',
     			 text: '기타소모품',
     			 tooltip: '기타소모품 재고',
     			//pressed: true,
     			toggleGroup: 'stockviewType',
     			 handler: function() {
     				 this.matType = 'MRO';
     				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
     				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R2');
     				gMain.selPanel.store.load(function(){});
     			 }
     		});

       this.myCartStore.load(function() {});
       
       this.addMyCart = Ext.create('Ext.Action', {
      	 xtype : 'button',
      	iconCls:'fa-cart-arrow-down_14_0_5395c4_none',
			 text: '구매카트 담기 ',
			 tooltip: '구매를 위한 마이카트 담기',
			 disabled: true,
			 handler: function(widget, event) {
				 	var my_child = new Array();
				 	var my_childs = new Array();
	            	var my_assymap_uid = new Array();
	            	var my_pl_no = new Array();
	            	var my_pr_quan = new Array();
	            	var my_item_code = new Array();
	            	

					 var selections = gm.me().grid.getSelectionModel().getSelection();
					 
					 console_logs('selections', selections);
//				    if (selections) {
				    	var arrExist = [];
			        	for(var i=0; i< selections.length; i++) {
			        		var rec = selections[i];
			        		var unique_id = rec.get('unique_id');
			        		var child = rec.get('child');
//			        		var unique_id = rec.get('unique_id');
			        		var item_code = rec.get('item_code');
		            		var item_name = rec.get('item_name');
			        		var pl_no = rec.get('pl_no');
			        		arrExist.push(unique_id);
			        		
			        		console_logs('unique_id----------------', unique_id);
//			        		var bEx = gm.me().isExistMyCart(unique_id);
		            		
//		            		 console_logs('bEx----------------', bEx);
		            		 
//		            		if(bEx == false ) {
	            			my_child.push(unique_id);
	            			my_childs.push(child);
			        		my_item_code.push(item_code);
			        		my_pl_no.push(pl_no);
//		            		} else {
//		            			arrExist.push('[' +item_code + '] \''+ item_name + '\'');
//		            		}
		 
			        	}

            	if(my_child.length>0) {
	        		Ext.Ajax.request({
	            		url: CONTEXT_PATH + '/purchase/request.do?method=addMyCart',
	            		params: {
	            			childs : my_child,
	            			srcahd_uids: my_child,
	            			item_codes: my_item_code
	            		},
	            		success : function(result, request){
	            			gm.me().myCartStore.load(function() {
	            			var resultText = result.responseText;
	            			Ext.Msg.alert('안내', '카트 담기 완료.', function() {});
	            			});
	            		},
	            		
	            	}); //end of ajax
            	}else{
            		
//                	Ext.MessageBox.alert('경고', arrExist[1] + ' 파트 포함 ' + arrExist.length + '건은 이미 카트에 담겨져 있습니다.<br/>추가구매가 필요한 경우 요청수량을 조정하세요.');    		
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


       this.printBarcodeAction = Ext.create('Ext.Action', {
       	iconCls: 'barcode',
       	text: '바코드 출력',
       	tooltip: '제품의 바코드를 출력합니다.',
       	disabled: true,
       	handler: function() {		 	
			 	gMain.selPanel.printBarcode();
       	}
       });
       
       //요청접수 Action 생성
       this.reReceiveAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '구매 요청',
			 tooltip: '구매 요청',
			 disabled: true,
			 handler: function() {
				 
				 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
				 
				 console_logs('selections', selections);
			    if (selections) {
			    	
			    	var uids = [];
		        	for(var i=0; i< selections.length; i++) {
		        		var rec = selections[i];
		        		var unique_id = rec.get('unique_id');
		        		var child = rec.get('child');
		        		uids.push(unique_id);
		        		uids.push(child);
		        	}
			    	
			    	Ext.MessageBox.show({
			            title:CMD_OK,
			            msg: '요청 하시겠습니까?',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {

	            	        	Ext.Ajax.request({
//	            					url: CONTEXT_PATH + '/purchase/prch.do?method=create',
	            					url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequest',
	            					params:{
	            						unique_uids: uids,
	            						child: uids
	            					},
	            					
	            					success : function(result, request) { 
	            						gMain.selPanel.store.load();
	            						Ext.Msg.alert('안내', '요청접수 되었습니다.', function() {});
	            						
	            					},//endofsuccess
	            					failure: extjsUtil.failureMessage
	            				});//endofajax
	            	        	
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			    	
			    }//endof if selectios
			 }
		});
       // 창고 입고
       this.addGoodsinAction = Ext.create('Ext.Action', {
        	 xtype : 'button',
        	 	 iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
  			 text: '자재입고 ',
  			 tooltip: '자재 입고',
  			 disabled: true,
  			 handler: function() {
  				 
  				 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
  				 
  				 console_logs('selections', selections);
  				 
  				 
  				if (selections.length>0) {
  	            	var rec = selections[0];
  	            	
  	            	var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 60
                        },
                        //                    		        // border: 0,
                        //                    	            dockedItems: [
                        //                    	              {
                        //                    				      dock: 'top',
                        //                    				    xtype: 'toolbar',
                        //                    					items: [this.resetAction, '-', this.modRegAction/*, '-', copyRevAction*/]
                        //                    				  }],
                        items: [

                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                value: rec.get('unique_id'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                value: rec.get('item_code'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                value: rec.get('item_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },{
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'item_name',
                                value: rec.get('specification'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },{
                                fieldLabel: gm.me().getColName('maker_name'),
                                xtype: 'textfield',
                                id: gu.id('maker_name'),
                                name: 'maker_name',
                                value: rec.get('maker_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },{
                                fieldLabel: gm.me().getColName('model_no'),
                                xtype: 'textfield',
                                id: gu.id('model_no'),
                                name: 'model_no',
                                value: rec.get('model_no'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('description'),
                                xtype: 'textfield',
                                id: gu.id('description'),
                                name: 'description',
                                value: rec.get('description'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'

                            }, {
                                fieldLabel: gm.me().getColName('comment'),
                                xtype: 'textfield',
                                id: gu.id('comment'),
                                name: 'comment',
                                value: rec.get('comment'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'

                            }, {
                                xtype: 'fieldset',
                                border: true,
                                // style: 'border-width: 0px',
                                title: panelSRO1186 + ' | ' + '적재 위치',
                                collapsible: false,
                                defaults: {
                                    labelWidth: 100,
                                    anchor: '100%',
                                    layout: {
                                        type: 'hbox',
                                        defaultMargins: {
                                            top: 0,
                                            right: 0,
                                            bottom: 0,
                                            left: 0
                                        }
                                    }
                                },
                                items: [

                                    {
                                        xtype: 'fieldcontainer',
                                        combineErrors: true,
                                        msgTarget: 'side',
                                        defaults: {
                                            hideLabel: true
                                        },
                                        items: [{
                                                xtype: 'numberfield',
                                                minValue: 0,
                                                width: 100,
                                                id: gu.id('wh_qty'),
                                                name: 'wh_qty',
                                                fieldLabel: gm.me().getColName('bm_quan'),
                                                allowBlank: true,
                                                value: '1',
                                                margins: '5'
                                            }, {
                                            	 flex: 1, 
                                                name: 'stock_pos',
                                                xtype: 'textfield',
                                                fieldLabel: '위치'
                                                
                                            }
                                        ]
                                    }
                                ]
                            }, {
                            	
                            
                            fieldLabel: '입고사유',
                            xtype: 'textfield',
                            name: 'innout_desc',
                            flex: 1
                        }
                       
                        ]
                    });
  	            	
                    var winPart = Ext.create('ModalWindow', {
                        title: '자재 입고',
                        width: 500,
                        height: 430,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function() {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);

                                    gm.me().addStockIn(val);

                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function() {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show( /* this, function(){} */ );
                } // endofhandler
            }
  		});
       
    // 자재 계약
       this.addContractMatAction = Ext.create('Ext.Action', {
        	 xtype : 'button',
        	 	 iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
  			 text: '업체 추가 계약',
  			 tooltip: '자재 계약',
  			 disabled: true,
  			 handler: function() {
  				var mStore = Ext.create('Mplm.store.SupastStore');
  				 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
  				 
  				 console_logs('selections', selections);
  				 
  				 
  				if (selections.length>0) {
  	            	var rec = selections[0];
  	            	
  	            	var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        //                    		        // border: 0,
                        //                    	            dockedItems: [
                        //                    	              {
                        //                    				      dock: 'top',
                        //                    				    xtype: 'toolbar',
                        //                    					items: [this.resetAction, '-', this.modRegAction/*, '-', copyRevAction*/]
                        //                    				  }],
                        items: [

                            {
                                fieldLabel: gm.me().getColName('srcahd_uid'),
                                xtype: 'textfield',
                                id: gu.id('srcahd_uid'),
                                name: 'srcahd_uid',
                                emptyText: '자재 UID',
                                value: rec.get('srcahd_uid'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                value: rec.get('item_code'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                value: rec.get('item_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },{
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'item_name',
                                value: rec.get('specification'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },{
                                fieldLabel: gm.me().getColName('maker_name'),
                                xtype: 'textfield',
                                id: gu.id('maker_name'),
                                name: 'maker_name',
                                value: rec.get('maker_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },{
                                fieldLabel: gm.me().getColName('model_no'),
                                xtype: 'textfield',
                                id: gu.id('model_no'),
                                name: 'model_no',
                                value: rec.get('model_no'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('description'),
                                xtype: 'textfield',
                                id: gu.id('description'),
                                name: 'description',
                                value: rec.get('description'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'

                            },{
                                fieldLabel: gm.me().getColName('comment'),
                                xtype: 'textfield',
                                id: gu.id('comment'),
                                name: 'comment',
                                value: rec.get('comment'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'

                            },{
                            	fieldLabel: '공급사',
    	                    	labelWidth: 80,
    	           			 	xtype: 'combo',
    	           				anchor: '100%',
    	           				name: 'supast_uid',
    	           				mode: 'local',
    	           				displayField: 'supplier_name',
    	           				store: mStore,
    	           				sortInfo: { field: 'supplier_name', direction: 'ASC' },
    	           				valueField : 'unique_id',
    	                   	    typeAhead: false,
    	                   	    minChars: 1,
    	                   	    flex: 1,
    	                   	    listConfig:{
    	                   			loadingText: '검색중...',
    	                   	        emptyText: '일치하는 항목 없음.',
    	                   	      	getInnerTpl: function(){
    	                   	      		return '<div data-qtip="{unique_id}">[{supplier_code}] {supplier_name}</div>';
    	                   	      	}
    	                   		}
                            },{
                                fieldLabel: '통화',
                                xtype: 'textfield',
                                id: gu.id('currency'),
                                name: 'currency',
                                value: 'KRW',
                                flex: 1
                            },{
                                fieldLabel: '단가',
                                xtype: 'textfield',
                                id: gu.id('sales_price'),
                                name: 'sales_price',
                                flex: 1
                            },{
                                fieldLabel: '계약시작일',
                                xtype: 'datefield',
                                id: gu.id('start_date'),
                                name: 'start_date',
                                value: new Date(),
                                flex: 1
                            },{
                                fieldLabel: '계약종료일',
                                xtype: 'datefield',
                                id: gu.id('end_date'),
                                name: 'end_date',
                                flex: 1
                            }
                       
                        ]
                    });
  	            	
                    var winPart = Ext.create('ModalWindow', {
                        title: '계약',
                        width: 500,
                        height: 600,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function() {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().addContractMat(val);
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function() {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show( /* this, function(){} */ );
                } // endofhandler
            }
  		});
       
       //버튼 추가.
       buttonToolbar.insert(7, '-');
       if(vCompanyReserved4 != 'SKNH01KR' && vCompanyReserved4 != 'KWLM01KR' ) {
           buttonToolbar.insert(7, this.setMisMatView);
           buttonToolbar.insert(7, this.setSubMatView);
           buttonToolbar.insert(7, this.setSaMatView);
           buttonToolbar.insert(7, this.setRawMatView);
           buttonToolbar.insert(7, this.setAllMatView);
       }

       if(vCompanyReserved4 == 'SKNH01KR' || vCompanyReserved4 == 'APM01KR') {
    	   buttonToolbar.insert(3, this.addContractMatAction);
       }
       
      /* buttonToolbar.insert(6, this.printBarcodeAction);
       buttonToolbar.insert(6, this.addMyCart);
       buttonToolbar.insert(6, this.addGoodsinAction);
       */
       buttonToolbar.insert(6, '-');
      // buttonToolbar.insert(8,'-');
       //buttonToolbar.insert(8,this.reReceiveAction);
        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	rec = selections[0];
                console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>', rec.get('request_comment'));
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_id');
               	gMain.selPanel.addMyCart.enable();
           		gMain.selPanel.printBarcodeAction.enable();
           		gMain.selPanel.addContractMatAction.enable();
           		gMain.selPanel.addGoodsinAction.enable();    		
             } else {
            	 gMain.selPanel.addContractMatAction.disable();
            	 gMain.selPanel.addMyCart.disable();
            	 gMain.selPanel.printBarcodeAction.disable();
            	 gMain.selPanel.addGoodsinAction.disable();
             }
             })	

        //디폴트 로드
        gMain.setCenterLoading(false);
        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');
        this.store.load(function(records){
            gm.me().storeLoadCallback(records, gm.me().store);
        });
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
        isExistMyCart: function(inId) {
        	 console_logs('inId--------------------------------', inId);
            var bEx = false; // Not Exist
            this.myCartStore.data.each(function(item, index, totalItems) {
                console_logs('item: @@@@@@@@@@@@@@@@@@@@@@@@', item);
                console_logs('index: @@@@@@@@@@@@@@@@@@@@@@@@', index);
                console_logs('totalItems: @@@@@@@@@@@@@@@@@@@@@@@@', totalItems);
                var uid = item.data['child'];
                console_logs('uid----------------------------', uid);
                console_logs('inId--------------------------------', inId);
                if (inId == uid) {
                    bEx = true; // Found
                }
            });

            return bEx;
        },
        loadStore: function(child) {

            this.store.getProxy().setExtraParam('child', child);

            this.store.load(function(records) {
                console_logs('==== storeLoadCallback records', records);
                console_logs('==== storeLoadCallback store', store);

            });

        },
        
        printBarcode: function() {
        	
        	var form = null;
    		
    		 form = Ext.create('Ext.form.Panel', {
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
    	            {
    	                xtype: 'fieldset',
    	                title: '입력',
    	                collapsible: true,
    	                defaults: {
    	                    labelWidth: 60,
    	                    anchor: '100%',
    	                    layout: {
    	                        type: 'hbox',
    	                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
    	                    }
    	                },
    	            items   : [
    	                       {
    	                           xtype: 'fieldcontainer',
    	                           fieldLabel: '출력매수',
    	                           combineErrors: true,
    	                           msgTarget : 'side',
    	                           layout: 'hbox',
    	                           defaults: {
    	                               flex: 1,
    	                               hideLabel: true,
    	                           },
    	                           items: [
    	                               {
    	                                   xtype     : 'numberfield',
    	                                   name      : 'print_qty',
    	                                   fieldLabel: '출력매수',
    	                                   margin: '0 5 0 0',
    	                                   width: 200,
    	                                   allowBlank: false,
    	                                   value : 1,
    	                                   maxlength: '1',
    	                               }  // end of xtype
    	                           ]  // end of itmes
    	                       }  // end of fieldcontainer
    	                    ]
    	            }
    	   ]
    			
    	});//Panel end...

           	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
           	var counts = 0;
           	
           	var uniqueIdArr =[];
           	
           	for(var i=0; i< selections.length; i++) {
           		var rec = selections[i];
           		var uid =  rec.get('unique_id');  //Srcahd unique_id
           		uniqueIdArr.push(uid);
            }
           	
           	if(uniqueIdArr.length > 0) {
        		prwin = gMain.selPanel.prbarcodeopen(form);       	
           	}
        },
        
        prbarcodeopen: function(form) {

        	prWin =	Ext.create('Ext.Window', {
    			modal : true,
            title: '바코드 출력 매수',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
            		
                   	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                   	
                   	var uniqueIdArr =[];
                   	for(var i=0; i< selections.length; i++) {
                		var rec = selections[i];
                		var uid =  rec.get('unique_id');  //Product unique_id
                		uniqueIdArr.push(uid);
                    }
            		
                   	var form = gu.getCmp('formPanel').getForm();
                      	
  					form.submit({
                         url : CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeSrcahd',
                         params:{
                        	 unique_ids: uniqueIdArr
                         		   },
                            	success: function(val, action){
                            		prWin.close();
                            		gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                            		gMain.selPanel.store.load(function(){});
                            	    	},
                           			failure: function(val, action){
                           				 prWin.close();
                           				Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                           				gMain.selPanel.store.load(function(){});
                            			}
                		}); 
        			
            	
            	}//btn handler
    		},{
                text: CMD_CANCEL,
            	handler: function(){
            		if(prWin) {
            			
            			prWin.close();
            			
            		}
            	}
    		}]
        });
    	  prWin.show();
        },
        
        addStockIn: function(val) {
        	Ext.MessageBox.show({
	            title:'창고 반입',
	            msg: '창고로 반입하시겠습니까?' + '\r\n 수량: ' + gu.getCmp('wh_qty').getValue(),
	            buttons: Ext.MessageBox.YESNO,
	            fn: function(btn) {
	                if(btn=='yes') {
						Ext.Ajax.request({
							url: CONTEXT_PATH + '/inventory/prchStock.do?method=addQty',				
							params:{
								unique_id: val['unique_id'],
								barcode:  val['unique_id'],
				    			stock_pos :  val['stock_pos'],
				    			innout_desc :  val['innout_desc'],
				    			wh_qty :  val['wh_qty'],
				    			whouse_uid : 100
							},
							
							success : function(result, request) {
								var resultText = result.responseText;
								console_log('result:' + resultText);
								
								
								gm.me().getStore().load(function() {});
								//alert('finished..');
								
							},
							failure: extjsUtil.failureMessage
							
						});//endof ajax request
	                }
	                
	                
	            },
	            //animateTarget: 'mb4',
	            icon: Ext.MessageBox.QUESTION
	        });
        },
        
        addContractMat: function(val) {
        	Ext.MessageBox.show({
	            title:'계약',
	            msg: '이 회사와 자재를 계약 처리 하시겠습니까?',
	            buttons: Ext.MessageBox.YESNO,
	            fn: function(btn) {
	                if(btn=='yes') {
						Ext.Ajax.request({
							url: CONTEXT_PATH + '/purchase/material.do?method=addContractMat',				
							params:{
								currency: val['currency'],
								sales_price: val['sales_price'],
								srcahd_uid: val['srcahd_uid'],
								supast_uid: val['supast_uid'],
								start_date: val['start_date'],
								end_date: val['end_date']
							},
							
							success : function(result, request) {
								var resultText = result.responseText;
								console_log('result:' + resultText);
								gm.me().getStore().load(function() {});
								//alert('finished..');
								
							},
							failure: extjsUtil.failureMessage
							
						});//endof ajax request
	                }
	                
	                
	            },
	            //animateTarget: 'mb4',
	            icon: Ext.MessageBox.QUESTION
	        });
        },
        
        editRedord: function(field, rec) {

        	switch(field) {
        	case 'sort_order':
        		Ext.Ajax.request({
        			url: CONTEXT_PATH + '/purchase/material.do?method=updateSortOrder',				
    				params:{
    					srcmap_uid: rec.get('unique_id'),
    					srcahd_uid: rec.get('srcahd_uid'),
    					sort_order: rec.get('sort_order')
    				},
    				success : function(result, request) {
						var resultText = result.responseText;
						console_log('result:' + resultText);
						gm.me().getStore().load(function() {});
						//alert('finished..');
					},
					failure: extjsUtil.failureMessage
    			});//endof ajax request
        		break;
        	default:
        		gm.editRedord(field, rec);
        	}
        }		
        ,
        //Page toolbar 사용
       /* usePagingToolbar: false,
        //goto page
        /!*useGotoToolbar: true/!*,
        //FullPage Buffering
        bufferingStore: true*!/*/
});


