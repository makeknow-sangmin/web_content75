Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);

//자재 관리
Ext.define('Rfx2.view.company.dabp01kr.purStock.StockMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'stock-mgmt-view',
    
    
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
    	switch(vCompanyReserved4){
		case 'SKNH01KR':
//			this.addSearchField({
//			    type: 'condition', 
//			    width: 140, 
//			    sqlName: 'stocklinesrcahd',
//			    tableName: 's',
//			    field_id: 'special_spec_flag', 
//			    fieldName: 'special_spec_flag',
//			    params: { 
//			    	delete_flag:'N'
//			    	
//			    }
//	    	});
	 	    this.addSearchField('item_code');
	 	    this.addSearchField('item_name');
	 	    this.addSearchField('specification');
			break;
		default:
	    	this.addSearchField({
			    type: 'condition', 
			    width: 140, 
			    sqlName: 'stocklinesrcahd',
			    tableName: 's',
			    field_id: 'item_code', 
			    fieldName: 'item_code',
			    params: { 
			    	delete_flag:'N'
			    	
			    }
	    	});
		this.addSearchField({
		    type: 'condition', 
		    width: 140, 
		    sqlName: 'stocklinesrcahd',
		    tableName: 's',
		    field_id: 'item_name', 
		    fieldName: 'item_name',
		    params: { 
		    	delete_flag:'N'
		    	
		    }
		});
			
			break;
	}

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

        this.createStore('Rfx.model.StockLine', [{
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
        
        (buttonToolbar.items).each(function(item,index,length){
        	  if(index==1||index==2||index==3||index==4||index==5) {
              	buttonToolbar.items.remove(item);
        	  }
          });
        var myCartModel = Ext.create('Rfx.model.MyCartLineSrcahdGo', {
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
       
       this.createPoAction = Ext.create('Ext.Action', {
      	 xtype : 'button',
      	iconCls:'fa-cart-arrow-down_14_0_5395c4_none',
			 text: gm.getMC('CMD_Out_cart_in', '불출카트 담기'),
			 tooltip: '불출요청용 카트 담기',
			 disabled: true,
			 handler: function(widget, event) {
				 	
				 	var srcahd_uids = new Array();
				 	var stoqty_uids = new Array();
	            	var item_codes = new Array();
					 var selections = gm.me().grid.getSelectionModel().getSelection();
					 
					 console_logs('selections', selections);
//				    if (selections) {
				    	var arrExist = [];
			        	for(var i=0; i< selections.length; i++) {
			        		var rec = selections[i];
			        		var stoqty_uid = rec.get('unique_id');
			        		var srcahd_uid = rec.get('uid_srcahd');
			        		var item_name = rec.get('item_name');
			        		var item_code = rec.get('item_code');
			        		var delete_flag = rec.get('delete_flag');
			        		console_logs('delete_flag----------------', delete_flag);
			        		arrExist.push(srcahd_uid);
			        		
			        		console_logs('stoqty_uid----------------', stoqty_uid);
			        		console_logs('isExistMyCart 전----------------');
			        		var bEx = gm.me().isExistMyCart(stoqty_uid);
			        		console_logs('isExistMyCart 후----------------');
		            		 console_logs('bEx----------------결과',bEx);
		            		 
		            		if(bEx == 'false') {
		            			console_logs('stoqty_uid----------------false안', stoqty_uid);
		            			srcahd_uids.push(srcahd_uid);
		            			stoqty_uids.push(stoqty_uid);
		            			item_codes.push(item_code);
		            			
		            			Ext.Ajax.request({
		    	            		url: CONTEXT_PATH + '/purchase/request.do?method=addMyCartGo',
		    	            		params: {
		    	            			srcahd_uids: srcahd_uids,
		    	            			item_codes: item_codes,
		    	            			stoqty_uids: stoqty_uids,
		    	            			reserved1: 'N'
		    	            		},
		    	            		success : function(result, request){
		    	            			gm.me().myCartStore.load(function() {
		    	            			var resultText = result.responseText;
		    	            			Ext.Msg.alert('안내', '카트 담기 완료.', function() {});
		    	            			});
		    	            		},
		    	            		
		    	            	}); //end of ajax
		            			
		            		} else {
		            			arrExist.push('[' +item_code + '] \''+ item_name + '\'');
		            			
		                    	Ext.MessageBox.alert('경고', arrExist[1] + ' 파트 포함 ' + arrExist.length + '건은 이미 불출요청 카트에 담겨져 있습니다.<br/> 불출 요청 후 다시 불출요청 카트에 담아주세요.');    		

		            		}
		 
			        	}

            /*	if(stoqty_uids.length>0) {
	        		Ext.Ajax.request({
	            		url: CONTEXT_PATH + '/purchase/request.do?method=addMyCartGo',
	            		params: {
	            			srcahd_uids: srcahd_uids,
	            			item_codes: item_codes,
	            			stoqty_uids: stoqty_uids
	            		},
	            		success : function(result, request){
	            			gm.me().myCartStore.load(function() {
	            			var resultText = result.responseText;
	            			Ext.Msg.alert('안내', '카트 담기 완료.', function() {});
	            			});
	            		},
	            		
	            	}); //end of ajax
            	}else{
            		
                	Ext.MessageBox.alert('경고', arrExist[1] + ' 파트 포함 ' + arrExist.length + '건은 이미 불출요청 카트에 담겨져 있습니다.<br/> 불출 요청 후 다시 불출요청 카트에 담아주세요.');    		
        	}*/
			    
		        	
				    
           
				 
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
       	tooltip: '바코드를 출력합니다.',
       	disabled: true,
       	handler: function() {		 	
			 	gMain.selPanel.printBarcode();
       	}
       });
       
       this.assignMaterialAction = Ext.create('Ext.Action', {
    	  iconCls: 'mfglabs-retweet_14_0_5395c4_none',
    	  text: '할당',
    	  tooltip: '할당',
    	  disabled: true,
    	  handler: function() {
    		  gMain.selPanel.assginMaterial();
    	  }
       });
       
       this.withdrawMaterialAction = Ext.create('Ext.Action', {
    	     iconCls: 'af-remove',
      	     text: '할당해제',
      	     tooltip: '할당해제',
			 disabled: true,
			 handler: function() {		 
				 var win = Ext.create('ModalWindow', {
		            title: '메시지',
		            html: '<br><p style="text-align:center;">프로젝트 할당을 해제 하시겠습니까?</p>',
		            width: 300,
		            height: 120,
		            buttons: [{
		                text: '예',
		            	handler: function(){
		   				 	gMain.selPanel.withdrawMaterial();
		            		if(win) {
		            			win.close();
		            		}
		            	}
		            },
		            {
		            	text: '아니오',
		            	handler: function(){
		            		if(win) {
		            			win.close();
		            		}
		            	}
		            }]
		        });
		        win.show();
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
			            title:'확인',
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
       buttonToolbar.insert(2, '-');
//       buttonToolbar.insert(7, this.setMisMatView);
//       buttonToolbar.insert(7, this.setSubMatView);
//       buttonToolbar.insert(7, this.setSaMatView);
//       buttonToolbar.insert(7, this.setRawMatView);
//       buttonToolbar.insert(7, this.setAllMatView);
		if(vCompanyReserved4 != 'HSGC01KR') {
            buttonToolbar.insert(1, this.withdrawMaterialAction);
            buttonToolbar.insert(1, this.assignMaterialAction);
            buttonToolbar.insert(1, this.printBarcodeAction);
		}
       buttonToolbar.insert(1, this.createPoAction);
       buttonToolbar.insert(1, '-');
      // buttonToolbar.insert(8,'-');
       //buttonToolbar.insert(8,this.reReceiveAction);
        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	rec = selections[0];
                console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>', rec.get('request_comment'));
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_id');
            	gMain.selPanel.vSELECTED_STOCK_UID = rec.get('stoqty_uid');
               	gMain.selPanel.createPoAction.enable();
           		gMain.selPanel.printBarcodeAction.enable();
           		if(rec.get('pj_uid') < 0) {
               		gMain.selPanel.assignMaterialAction.enable();
               		gMain.selPanel.withdrawMaterialAction.disable();
           		} else {
           			gMain.selPanel.withdrawMaterialAction.enable();
           			gMain.selPanel.assignMaterialAction.disable();
           		}
             } else {
            	 gMain.selPanel.createPoAction.disable();
            	 gMain.selPanel.printBarcodeAction.disable();
            	 gMain.selPanel.assignMaterialAction.disable();
            	 gMain.selPanel.withdrawMaterialAction.disable();
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
        isExistMyCart: function(inId) {
        	 console_logs('inId--------------------------------', inId);
//        	 STOQTY_UID == INID
    	    var bEx = false; // Not Exist
    	    console_logs('inId 직후--------------------------------');
    	   
            Ext.Ajax.request({
            	async: false, 
        		url : CONTEXT_PATH + '/purchase/request.do?method=getMycartByStoqtyUid',
    			params:{
    				stoqty_uid: inId
    			},
    			
    			success : function(result, request) { 
    				console_logs('ajax 안 --------------------------------');
    				var result = result.responseText;
    				var jsonData = Ext.JSON.decode(result);
    				console_logs('jsonData++++++++++++++',jsonData);
    				bEx = jsonData.result;
    				console_logs('bEx++++++++++++++',bEx);
    				
    			},//endofsuccess
    			 
    		});//endofajax
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
           		var uid =  rec.get('pj_barcode');  //Srcahd unique_id
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
                		var uid =  rec.get('pj_barcode');  //Product unique_id
                		uniqueIdArr.push(uid);
                    }
            		
                   	var form = gu.getCmp('formPanel').getForm();
                      	
  					form.submit({
                         url : CONTEXT_PATH + '/sales/productStock.do?method=printAutoBarcode',
                         params:{
                        	 barcodes: uniqueIdArr
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
        
        assginMaterial: function() {
        	
        	var form = null;
        	var mStore = Ext.create('Mplm.store.ProjectStore');
    		
    		 form = Ext.create('Ext.form.Panel', {
    	    		id: gu.id('formPanel'),
    	    		xtype: 'form',
    	    		frame: false ,
    	    		width: 600,
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
    	                    	fieldLabel: '할당프로젝트',
    	                    	labelWidth: 80,
    	           			 	xtype: 'combo',
    	           				anchor: '100%',
    	           				name: 'ac_uid_to',
    	           				mode: 'local',
    	           				displayField:   'pj_name',
    	           				store: mStore,
    	           				sortInfo: { field: 'pj_name', direction: 'DESC' },
    	           				valueField : 'unique_id',
    	                   	    typeAhead: false,
    	                   	    minChars: 1,
    	                   	    listConfig:{
    	                   			loadingText: '검색중...',
    	                   	        emptyText: '일치하는 항목 없음.',
    	                   	      	getInnerTpl: function(){
    	                   	      		return '<div data-qtip="{unique_id}">[{pj_code}] {pj_name}</div>';
    	                   	      	}
    	                   		}
    	                       },
    	                       {
    	                    	   fieldLabel: '할당수량',
    	                    	   labelWidth: 80,
                                   xtype     : 'numberfield',
                                   name      : 'target_qty',
                                   width: 150,
                                   allowBlank: false
                               }
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
        		prwin = gMain.selPanel.assginmaterialopen(form);       	
           	}
        },
        
        assginmaterialopen: function(form) {

        	prWin =	Ext.create('Ext.Window', {
    			modal : true,
            title: '할당 할 프로젝트를 지정하십시오',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
            		
                   	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                   	var rec = selections[0];
                   	
            		var stoqty_uid = rec.get('unique_id');  //Product unique_id
            		var uid_srcahd = rec.get('uid_srcahd');
                   	
                   	var form = gu.getCmp('formPanel').getForm();
                   	
  					form.submit({
                        url : CONTEXT_PATH + '/purchase/material.do?method=assginMaterial',
                        params:{
                    	    uid_srcahd: uid_srcahd,
                    	    stoqty_uid: stoqty_uid
                        },
                    	success: function(val, action) {
                    		prWin.close();
                    		gm.me().showToast('결과', '할당 프로젝트를 지정하였습니다.');
                    		gMain.selPanel.store.load(function(){});
                    	},
               			failure: function(val, action) {
               				prWin.close();
               				Ext.Msg.alert('메시지', '할당 프로젝트 지정에 실패하였습니다.');
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
        
        withdrawMaterial: function() {

           	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
           	var rec = selections[0];
           	
    		var stoqty_uid = rec.get('unique_id');  //Product unique_id
    		//var project_uid = rec.get('pj_uid');
    		var uid_srcahd = rec.get('uid_srcahd');
    		var target_qty = rec.get('wh_qty');
           	
    		Ext.Ajax.request({
            	url : CONTEXT_PATH + '/purchase/material.do?method=assginMaterial',
    			params:{
    				stoqty_uid: stoqty_uid,
    				ac_uid_to: -1,
    				target_qty:target_qty,
    				uid_srcahd: uid_srcahd
         		},
            	success: function(val, action){
            		Ext.Msg.alert('완료', '프로젝트 할당을 해제하였습니다.');
            		gMain.selPanel.store.load(function(){});
            	},
           		failure: function(val, action){
           			
            	}
        	});
        }, 
		//selMode : 'SINGLE',
        //selCheckOnly: false,
        //selAllowDeselect: true
});



