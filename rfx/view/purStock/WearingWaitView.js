Ext.define('Rfx.view.purStock.WearingWaitView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'wearing-wait-view',
    //items: [{html: 'Rfx.view.purStock.WearingWaitView'}]}
    initComponent: function(){
 
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	
        //검색툴바 추가
        		this.addSearchField ({
					type: 'dateRange',
					field_id: 'listpodate',
					text: "입고예정일",
					labelWidth: 70,
					sdate: new Date(),
					edate: Ext.Date.add(new Date(), Ext.Date.MONTH, 1)
        		});	  

        		this.addSearchField('pj_code' );
        		this.addSearchField('seller_name' );
                this.addSearchField('wa_name' );
                this.addSearchField('product_name_dabp' );
                this.addSearchField('item_type' );
//                this.addSearchField('item_code' );                
                this.addSearchField('specification_dabp' );
                


                   
                
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델 정의
        this.createStore('Rfx.model.WearingWait', [{
	            property: 'po_no',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        ,{}
        	, ['xpoast-abst']
			);
				
        
//        var dateToolbar = Ext.create('Ext.toolbar.Toolbar' , {
//            cls: 'my-x-toolbar-default1',
//            items: [
//                    //searchAction, '-',
//                    '-', '-',{
//                               xtype:'label',
//                               width:88,
//                               text: "입고예정일 : " ,
//                               style: 'color:white;'
//                              },{
//                                name: 's_date',
//                                format: 'Y-m-d',
//                                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
//                                submitFormat: 'Y-m-d', // 'Y-m-d H:i:s',
//                                dateFormat: 'Y-m-d', // 'Y-m-d H:i:s'
//                                allowBlank: true ,
//                                xtype: 'datefield' ,
//                                value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
//                                width: 100,
//                                handler: function(){}
//                              },{
//                                  xtype:'label',
//                                  text: " ~ ",
//                                  style: 'color:white;'
//                              },{
//                                 name: 'e_date',
//                                 format: 'Y-m-d',
//                                 fieldStyle: 'background-color: #FBF8E6; background-image: none;',
//                                 submitFormat: 'Y-m-d', // 'Y-m-d H:i:s',
//                                 dateFormat: 'Y-m-d', // 'Y-m-d H:i:s'
//                                 allowBlank: true ,
//                                 xtype: 'datefield' ,
//                                 value: new Date(),
//                                 width: 99,
//                                 handler: function(){}
//                             },
//                    ]
//      }); 


        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
//        arr.push(dateToolbar);
        arr.push(searchToolbar);
        
        
        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


		//this.editAction.setText('입고확인' );
		
		this.store.getProxy().setExtraParam('is_gr', 'Y');
        
        
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
				gMain.selPanel.store.getProxy().setExtraParam('catalog_id', null);
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
				gMain.selPanel.store.getProxy().setExtraParam('catalog_id', '');
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
				  gMain.selPanel.store.getProxy().setExtraParam('catalog_id', '');
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
//   				 gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R');
				   gMain.selPanel.store.getProxy().setExtraParam('catalog_id', 'ROLL');
				   
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
//  				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R');
				gMain.selPanel.store.getProxy().setExtraParam('catalog_id', 'SHEET');
  				 gMain.selPanel.store.load(function(){});
  			 }
  		});
        
        // remove the items
        (buttonToolbar.items).each( function(item,index,length){
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
        
        //입고 확인 Action 생성
        this.createGoAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '입고 확인',
			 tooltip: '입고 확인',
			 disabled: true,
			 handler: function() {
				 
				 var sp_code = gMain.selPanel.vSELECTED_SP_CODE;
				 console_logs('여기 sp 타입 ------>', gMain.selPanel.vSELECTED_SP_CODE);
				 switch(gMain.selPanel.poviewType) {
				 case 'ALL':
					 alert("자재를 먼저 선택해 주세요");
					 break;
				 case 'ROLL':
					 gm.me().showToast('주의', '자재가 롤인 경우 입고가 하나씩 가능합니다.');
					 gMain.selPanel.treatPaperGoRoll();
					 break;
				 default: 
				 	gMain.selPanel.treatPaperGoSheet();
				 }
				 
			 }//handler end...
			 
		});
        
        //주문 취소 Action 생성
        this.cancleGoAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '주문 취소',
			 tooltip: '주문 취소',
			 disabled: true,
			 handler: function() {
				 Ext.MessageBox.show({
			            title:'확인',
			            msg: '선택된 자재의 주문을 취소하시겠습니까?',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	 gMain.selPanel.cancleMatePo();
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
				
			 
			 }//handler end...
			 
		});
        
      //일괄 입고 Action 생성
        this.createGoAllAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '일괄입고',
			 tooltip: '일괄 입고',
			 disabled: true,
			 handler: function() {
				 Ext.MessageBox.show({
			            title:'확인',
			            msg: '일괄 입고 하시겠습니까?',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.multyGoAll();
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
				
			 
			 }//handler end...
			 
		});
        
        buttonToolbar.insert(1, '-');
        buttonToolbar.insert(1, this.createGoAllAction);
        buttonToolbar.insert(1, this.createGoAction);
        /*buttonToolbar.insert(1, this.cancleGoAction);*/
        

        this.callParent(arguments);
        
        
        
        //grid를 선택했을 때 Callback
          this.setGridOnCallback(function(selections) {
              if (selections.length) {
            	  this.cartmap_uids=[];
           	   for(var i=0; i<selections.length; i++){
           		   var rec1 = selections[i];
           		 var uids = rec1.get('id');
           		this.cartmap_uids.push(uids);
           	   }
           	console_logs('그리드온 uid', this.cartmap_uids);
           	
           		var rec = selections[0];
           		//console_logs('rec', rec);
           		gMain.selPanel.cartmapuid = rec.get('id');
           		gMain.selPanel.gr_qty = rec.get('curGr_qty');
           		gMain.selPanel.item_name = rec.get('item_name');
           		gMain.selPanel.vSELECTED_description = rec.get('description');   // 평량
               	gMain.selPanel.vSELECTED_remark = rec.get('remark');    // 장
            	gMain.selPanel.vSELECTED_comment = rec.get('comment1');   // 폭
            	gMain.selPanel.vSELECTED_quan = rec.get('po_qty');
            	gMain.selPanel.vSELECTED_spcode = rec.get('sp_code');
            	gMain.selPanel.vSELECTED_standard = rec.get('standard_flag');
           		
           		if(gMain.selPanel.vSELECTED_standard =='O'){
           			gMain.selPanel.createGoAllAction.enable();
           		}
  
              	gMain.selPanel.createGoAction.enable();
              	gMain.selPanel.cancleGoAction.enable();
              	
               } else {
              	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
              	gMain.selPanel.createGoAction.disable();
              	gMain.selPanel.createGoAllAction.disable();
              	gMain.selPanel.cancleGoAction.disable();
              }
          	
          })
        
        //디폴트 로드
          gMain.setCenterLoading(false);
        this.store.load(function(){});

    },
    items : [],
    cartmap_uids : [],
    poviewType: 'ALL',
    
    onRenderCell : function(value, metaData, record, rowIndex,colIndex, store, view){
    	   Ext.util.Format.number(1.23456,'0.000');
    	   return value;            
    	},
    	
    cancleMatePo: function(){
    	alert('주문 취소 기능 준비중입니다.');
    	/*Ext.Ajax.request({
    		url: CONTEXT_PATH + '/purchase/prch.do?method=canclePoRequest',
			params:{
				xpoastUid: xpoastUid,
				rtgastUid: po_group_uid
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '주문 취소 완료.', function() {});
				
			},//endofsuccess
			failure: function(){
				Ext.Msg.alert('안내', '주문 취소를 실패하였습니다.', function() {});
			}
    	});*/
    },
    	
    treatPaperGoRoll: function() {
		var form = null;

		var selections = this.grid.getSelectionModel().getSelection();

		var gr_qtys = selections[0].get('curGr_qty');
		var cartmap_uids = selections[0].get('unique_id_long');

		// for(var i=0; i<selections.length; i++) {
		// 	var rec = selections[i];

		// 	gr_qtys.push(rec.get('curGr_qty'));
		// }
		 
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
	            items: [/*{
           		xtype: 'fieldLabel',
           		value : ''
	            	},*/
	            	{
	            		xtype: 'fieldset',
	                    title: 'Information',
	                    defaultType: 'textfield',
	                    /*boder : true,
	                    defaults: {
	                        width: 280
	                    },*/
	                    items: [
							new Ext.form.Hidden({
								name: 'gr_qty',
								value: gr_qtys
							}),
							new Ext.form.Hidden({
								name: 'cartmap_uids',
								value: cartmap_uids
                        	}),
							{
								fieldLabel: '입고 의견',//ppo1_request,
							 	xtype: 'textarea',
								rows: 4,
								anchor: '100%',
								id:   'gr_reason',
								name: 'gr_reason',
								//value: '',
								emptyText: '입고의견을 입력해주세요'
							},
							// {
							// fieldLabel: '입고 수량',
							// xtype: 'numberfield',
							// emptyText : 'm',
							// value : gMain.selPanel.vSELECTED_quan,
							// anchor: '100%',
							// //value: '',
							// id: 'gr_qty',
							// name: 'gr_qty'
							// },
							{
							fieldLabel: '무게(Kg)',
							xtype: 'numberfield',
							emptyText : 'kg',
							anchor: '100%',
							useThousandSeparator: false,
							//renderer : this.onRednderCell,
							decimalPrecision:2,
							alwaysDisplayDecimals: false,
							//value: '',
							id: 'item_weight',
							name: 'item_weight',
							 listeners: {
							      change: function(field, value) {
							    	  var desc = gMain.selPanel.vSELECTED_description;   // 평량
							    	  var remark = gMain.selPanel.vSELECTED_remark;     // 폭
							      	  var comment = gMain.selPanel.vSELECTED_comment; //장
							      	console_logs('평량', desc);
							      	console_logs('폭', remark);
							      	console_logs('장', comment);
							      	remark = 750;
							      	desc = 305;
							      	  var len = (value * 1000) / (remark) / (desc);
							      	  //len = Math.round(len);
							      	  //len = len * 1000;
							      	  len = len.toFixed(4)*1000;
							      	  len = Math.round(len);
							      	  console_logs('길이', len);
							      	  
							      	Ext.getCmp('item_length').setValue(len);
							    	  
							      }
							  }
							},
							
							{
							fieldLabel: '길이(M)',
							xtype: 'numberfield',
							emptyText : '자동계산',
							anchor: '100%',
							useThousandSeparator: false,
							readOnly : true,
							//value: '',
							id: 'item_length',
							name: 'item_length'
							}
	                    ]
	            	},
	            					      
				   
		          
		          
		            ]//item end..
			
	                    });//Panel end...
			myHeight = 320;
			
			prwin = gMain.selPanel.prwinopen(form);
    },
    
    treatPaperGoSheet: function() {
		var form = null;
		
		var gr_qtys = [];

		var selections = this.grid.getSelectionModel().getSelection();

		for(var i=0; i<selections.length; i++) {
			var rec = selections[i];

			gr_qtys.push(rec.get('curGr_qty'));
		}
		 
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
	            items: [/*{
           		xtype: 'fieldLabel',
           		value : ''
	            	},*/
	            	{
	            		xtype: 'fieldset',
	                    title: 'Information',
	                    defaultType: 'textfield',
	                    /*boder : true,
	                    defaults: {
	                        width: 280
	                    },*/
	                    items: [
							new Ext.form.Hidden({
								name: 'gr_qty',
								value: gr_qtys
							}),
							{
								fieldLabel: '입고 날짜',
								xtype:'datefield',
								id: gu.id('gr_date'),
								name:'gr_date',
								submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
								dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
								fieldStyle: 'background-color: #D6E8F6; background-image: none;',
								format: 'Y-m-d',
								value: new Date()
							},
							{
								fieldLabel: '입고 의견',//ppo1_request,
							 	xtype: 'textarea',
								rows: 4,
								anchor: '100%',
								id:   'gr_reason',
								name: 'gr_reason',
								//value: '',
								emptyText: '입고의견을 입력해주세요'
							}
							// ,{
							// fieldLabel: '입고 수량',
							// xtype: 'numberfield',
							// emptyText : 'm',
							// value : gMain.selPanel.vSELECTED_quan,
							// anchor: '100%',
							// //value: '',
							// id: 'gr_qty',
							// name: 'gr_qty'
							// }
	                    ]
	            	},
	            					      
				   
		          
		          
		            ]//item end..
			
	                    });//Panel end...
			myHeight = 230;
			
			prwin = gMain.selPanel.prwinopen(form);
    },
    
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: '입고 확인',
        width: 530,
        height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
        		var msg = ' 입고하시겠습니까?'
        		var myTitle = '입고 확인';
        		Ext.MessageBox.show({
                    title: myTitle,
                    msg: msg,
                    
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                    	var form = gu.getCmp('formPanel').getForm();
                    	 var cartmapuid = gMain.selPanel.cartmap_uids;
						 var gr_qty = gMain.selPanel.gr_qty;
        				 var item_name = gMain.selPanel.item_name;
        				 var item_abst =  item_name + ' 外';
						 var sp_code = gMain.selPanel.vSELECTED_spcode;                    	
                    	
                    		var val = form.getValues(false);
                    		form.submit({
                    			url: CONTEXT_PATH + '/quality/wgrast.do?method=createGrMes',
            					params:{
									gr_reason : gr_reason,
            						cartmap_uids: cartmapuid,
            						gr_qty : gr_qty,
            						item_abst : item_abst,
            						//item_length : item_length,
            						sp_code : sp_code
            						
								},
                    			success: function(val, action){
									alert('val : ' + val);
									window.location.reload();
									// gMain.selPanel.store.load(function(){});

									prWin.close();
                    			},
                    			failure: function(val, action){
                    				 prWin.close();
                    			}
                    		})
                    	
                    		
                    
                       
                    }//fn function(btn)
                    
                });//show
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
    
    multyGoAll: function(){
    	
    	var xpoastarr = [];
    	var selections = this.grid.getSelectionModel().getSelection();
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		var uid =  rec.get('unique_id');
    		xpoastarr.push(uid);
    	}
    	
    	Ext.Ajax.request({
			url: CONTEXT_PATH + '/quality/wgrast.do?method=createGrMulti',
			params : {
				xpoastarr : xpoastarr
			},
		    method: 'POST',
			success: function(rec, op) {
				Ext.Msg.alert('안내', '입고가 처리 되었습니다.', function() {});
				gMain.selPanel.store.load();

        	},
           failure: function (rec, op)  {
        	   Ext.Msg.alert('안내', '입고 처리가 실패하였습니다.', function() {});
           	
           }/*,
           callback: function(record, operation, success){	// #3
           	 console_logs('record', record);
           	 console_logs('operation', operation);
           	 console_logs('success', success);
            }*/
    	 });
    }
    
});
