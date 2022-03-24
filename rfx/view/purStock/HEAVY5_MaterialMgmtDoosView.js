Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);

//자재 관리
Ext.define('Rfx.view.purStock.HEAVY5_MaterialMgmtDoosView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'material-mgmt-doos-view',
    
    
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

    	switch(vCompanyReserved4) {
			case 'KYNL01KR':
                this.addSearchField({
                    type: 'condition',
                    width: 200,
                    sqlName: 'srcahd',
                    tableName: 's',
                    emptyText: '품명',
                    field_id: 'item_name',
                    fieldName: 'item_name',
                    params: {
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 200,
                    sqlName: 'srcahd',
                    tableName: 's',
                    emptyText: '규격',
                    field_id: 'specification',
                    fieldName: 'specification',
                    params: {
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 150,
                    sqlName: 'srcahd',
                    tableName: 's',
                    emptyText: '제조원',
                    field_id: 'maker_name',
                    fieldName: 'maker_name',
                    params: {
                    }
                });
				break;
			default:
                this.addSearchField('item_code');
                this.addSearchField('item_name');
                this.addSearchField('specification');
                this.addSearchField('maker_name');
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

        this.createStore('Rfx.model.Heavy4MaterialMgmtPnl', [{
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
     				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R');
     				gMain.selPanel.store.load(function(){});
     			 }
     		});
            if(vCompanyReserved4 == 'KYNL01KR') {
                this.setPaintMatView = Ext.create('Ext.Action', {
                    xtype : 'button',
                    text: 'PAINT자재',
                    tooltip: 'PAINT자재 재고',
                    //pressed: true,
                    toggleGroup: 'stockviewType',
                    handler: function() {
                        this.matType = 'PNT';
                        gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                        gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R2');
                        gMain.selPanel.store.load(function(){});
                    }
                });
			}
            this.setSaMatView = Ext.create('Ext.Action', {
             	 xtype : 'button',
      			 text: '공구',
      			 tooltip: '공구 재고',
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
     			 text: vCompanyReserved4 == 'KYNL01KR' ? '기계공구류' : '기타소모품',
     			 tooltip: vCompanyReserved4 == 'KYNL01KR' ? '기계공구류 재고' : '기타소모품 재고',
     			//pressed: true,
     			toggleGroup: 'stockviewType',
     			 handler: function() {
     				 this.matType = 'MRO';
     				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
     				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K2');
     				gMain.selPanel.store.load(function(){});
     			 }
     		});

       this.myCartStore.load(function() {});

       this.createPoAction = Ext.create('Ext.Action', {
      	 xtype : 'button',
      	iconCls:'fa-cart-arrow-down_14_0_5395c4_none',
			 text: '카트 담기 ',
			 tooltip: '주문카트 담기',
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
			        		//arrExist.push(unique_id);
			        		
			        		console_logs('unique_id----------------', unique_id);
			        		var bEx = gm.me().isExistMyCart(unique_id);
		            		
		            		 console_logs('bEx----------------', bEx);
		            		 
		            		if(bEx == false ) {
	            			my_child.push(unique_id);
	            			my_childs.push(child);
			        		my_item_code.push(item_code);
			        		my_pl_no.push(pl_no);
		            		} else {
		            			arrExist.push('[' +item_code + '] \''+ item_name + '\'');
		            		}
		 
			        	}
		            	if(arrExist.length>0) {
		                	Ext.MessageBox.alert('경고', arrExist[1] + ' 파트 포함 ' + arrExist.length + '건은 이미 카트에 담겨져 있습니다.<br/>추가구매가 필요한 경우 요청수량을 조정하세요.');    		
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

		switch(vCompanyReserved4) {
			case 'KYNL01KR':
                buttonToolbar.insert(8, '-');
                buttonToolbar.insert(8, this.setSubMatView);
                buttonToolbar.insert(8, this.setSaMatView);
				buttonToolbar.insert(8, this.setPaintMatView);
                buttonToolbar.insert(8, this.setRawMatView);
                buttonToolbar.insert(8, this.setAllMatView);
                buttonToolbar.insert(6, this.createPoAction);
                buttonToolbar.insert(6, '-');
				break;
			default:
                buttonToolbar.insert(7, '-');
                buttonToolbar.insert(7, this.setMisMatView);
                buttonToolbar.insert(7, this.setSubMatView);
                buttonToolbar.insert(7, this.setSaMatView);
                buttonToolbar.insert(7, this.setRawMatView);
                buttonToolbar.insert(7, this.setAllMatView);
                buttonToolbar.insert(6, this.createPoAction);
                buttonToolbar.insert(6, '-');
				break;
		}

        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	rec = selections[0];
                console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>', rec.get('request_comment'));
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_id');
               	gMain.selPanel.createPoAction.enable();
           		//gMain.selPanel.reReceiveAction.enable();
             } else {

            	 gMain.selPanel.createPoAction.disable();
            	 //gMain.selPanel.reReceiveAction.disable();
             }
             })	

        //디폴트 로드
        gMain.setCenterLoading(false);
        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');
        this.store.getProxy().setExtraParam('parent_code', this.link);
        if(vCompanyReserved4 == 'HSGC01KR' && this.link == 'PMT1_DS') {
            this.store.getProxy().setExtraParam('hsg_link', 'Y');
		}
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
});



