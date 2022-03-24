//주문작성

Ext.define('Rfx.view.purStock.HEAVY5_MatView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'create-po-view',
    initComponent: function(){

    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    	this.addSearchField ({
            type: 'dateRange',
            field_id: 'gr_date',
            text: "요청기간" ,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
    	});    

//		this.addSearchField('maker_name');
		this.addSearchField('pj_code');
		this.addSearchField('pj_name');
		this.addSearchField('creator');
		
//		//Readonly Field 정의
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');
//		this.addReadonlyField('create_date');
//		this.addReadonlyField('creator');
//		this.addReadonlyField('creator_uid');
//		this.addReadonlyField('user_id');
//		this.addReadonlyField('board_count');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);


   	 this.createStore('Rfx.model.HEAVY5_MatViewModel', [{
            property: 'specification',
            direction: 'asc'
        }],
        //gMain.pageSize
        [100]  //pageSize
        , this.sortBy
    	//삭제테이블 지정. 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	, ['cartmap']
        );
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        
        //this.editAction.setText('주문작성');
//        this.removeAction.setText('반려');
        
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==3||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        
        
        //PO Type View Type
        this.setAllPoView = Ext.create('Ext.Action', {
        	 xtype : 'button',
 			 text: '전체',
 			 tooltip: '전체목록',
 			 pressed: true,
 			 //ctCls: 'x-toolbar-grey-btn',
 			 toggleGroup: 'poViewType',
 			 handler: function() {
 				gMain.selPanel.createAddPoAction.disable();
 				gMain.selPanel.vSELECTED_UNIQUE_ID='';
 				gMain.selPanel.poviewType = 'ALL';
 				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
 				gMain.selPanel.store.getProxy().setExtraParam('sg_code', '');
				gMain.selPanel.store.load(function(){});
				 
 			 }
 		});
        
        this.setRawPoView = Ext.create('Ext.Action', {
         	 xtype : 'button',
  			 text: '원자재',
  			 tooltip: '원자재',
  			 //ctCls: 'x-toolbar-grey-btn',
  			 toggleGroup: 'poViewType',
  			 handler: function() {
  				gMain.selPanel.createAddPoAction.disable();
  				gMain.selPanel.createPoAction.enable();
  				gMain.selPanel.vSELECTED_UNIQUE_ID='';
  				gMain.selPanel.poviewType = 'RAW';
  				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
  				gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
  				gMain.selPanel.store.getProxy().setExtraParam('storeType', '');
				gMain.selPanel.store.load(function(){});
				 
  			 }
  		});
       this.setSubPoView = Ext.create('Ext.Action', {
        	 xtype : 'button',
 			 text: '부자재',
 			 tooltip: '부자재 주문',
 			 //ctCls: 'x-toolbar-grey-btn',
 			 toggleGroup: 'poViewType',
 			 handler: function() {
 				gMain.selPanel.createAddPoAction.disable();
 				gMain.selPanel.createPoAction.enable();
 				gMain.selPanel.vSELECTED_UNIQUE_ID='';
 				gMain.selPanel.poviewType = 'SUB';
 				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
 				gMain.selPanel.store.getProxy().setExtraParam('storeType', '');
 				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K1');
				 gMain.selPanel.store.load(function(){});
				
 			 }
 		});
       this.setMroPoView = Ext.create('Ext.Action', {
      	 xtype : 'button',
			 text: '소모품',
			 tooltip: '소모품',
			 //ctCls: 'x-toolbar-grey-btn',
			 toggleGroup: 'poViewType',
			 handler: function() {
				 gMain.selPanel.createAddPoAction.disable();
				 gMain.selPanel.createPoAction.enable();
				 gMain.selPanel.vSELECTED_UNIQUE_ID='';
				 gMain.selPanel.poviewType = 'PAPER';
				 gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
				 gMain.selPanel.store.getProxy().setExtraParam('storeType', '');
				 gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K3');
				 gMain.selPanel.store.load(function(){});
				 
				 
			 }
		});
       
       this.setMisPoView = Ext.create('Ext.Action', {
        	 xtype : 'button',
  			 text: '잡자재',
  			 tooltip: '잡자재',
  			 //ctCls: 'x-toolbar-grey-btn',
  			 toggleGroup: 'poViewType',
  			 handler: function() {
  				 gMain.selPanel.createAddPoAction.disable();
  				 gMain.selPanel.createPoAction.enable();
  				 gMain.selPanel.vSELECTED_UNIQUE_ID='';
  				 gMain.selPanel.poviewType = 'PAPER';
  				 gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
  				 gMain.selPanel.store.getProxy().setExtraParam('storeType', '');
  				 gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K2');
  				 gMain.selPanel.store.load(function(){});
  				 
  				 
  			 }
  		});
       
       this.setAddPoView = Ext.create('Ext.Action', {
        	 xtype : 'button',
  			 text: '주문이력',
  			 tooltip: '주문 이력',
  			 multiSelect: false,
  			 //ctCls: 'x-toolbar-grey-btn',
  			 toggleGroup: 'poViewType',
  			 handler: function() {
  				 gMain.selPanel.poviewType = 'ADDPO';
  				 gMain.selPanel.vSELECTED_UNIQUE_ID='';
  				 gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
  				 gMain.selPanel.store.getProxy().setExtraParam('storeType', 'Y');
  				 gMain.selPanel.store.load(function(){});
  				
  			 }
  		});
       
     //주문작성 Action 생성
       this.createPoAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '주문 작성',
			 tooltip: '주문 작성',
			 disabled: false,
			 handler: function() {
				 gMain.selPanel.treatPo();
				 /*switch(gMain.selPanel.poviewType) {
				 case 'ALL':
					 alert("자재를 먼저 선택해 주세요");
					 break;
				 case 'RAW':
					 gMain.selPanel.treatPo();
					 //gMain.selPanel.treatRawPo();
					 break;
				 case 'SUB':
					 gMain.selPanel.treatPo();
					 //gMain.selPanel.treatSubPo();
				 	break;
				 case 'ADDPO':
					 alert("복사 하기 버튼을 누르세요");
				 	break;
				 case 'PAPER':
					 gMain.selPanel.treatPo();
					 break;
				 default:
					 
				 }*/
				 
			 }//handler end...
			 
		});
       
     //추가 주문작성 Action 생성
       this.createAddPoAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '복사 하기',
			 tooltip: '복사 하기',
			 disabled: true,
			 handler: function() {
				
				 var sp_code = gMain.selPanel.vSELECTED_SP_CODE;
				 switch(sp_code) {
				 case 'R':
					 gMain.selPanel.purCopyAction();
					 break;
				 case 'O':
					 gMain.selPanel.purCopyAction();
					 break;
				 case 'K':
					 gMain.selPanel.purCopyAction();
				 	break;
				 default:
					 
				 }
				 
			 }//handler end...
			 
		});
       
       if(vCompanyReserved4 == 'DAEH01KR') {
    	 //버튼 추가.
//           buttonToolbar.insert(5, '-');
//           buttonToolbar.insert(5, this.setMisPoView);
//           buttonToolbar.insert(5, this.setMroPoView);
//           buttonToolbar.insert(5, this.setSubPoView);
//           buttonToolbar.insert(5, this.setRawPoView);
//           buttonToolbar.insert(5, this.setAllPoView);
       } else {
       
       //버튼 추가.
       buttonToolbar.insert(5, '-');
       /*buttonToolbar.insert(5, this.setAddPoView);*/
       buttonToolbar.insert(5, this.setMisPoView);
       buttonToolbar.insert(5, this.setMroPoView);
       buttonToolbar.insert(5, this.setSubPoView);
       buttonToolbar.insert(5, this.setRawPoView);
       buttonToolbar.insert(5, this.setAllPoView);
       /*buttonToolbar.insert(3, this.createAddPoAction);*/
       buttonToolbar.insert(3, this.createPoAction);
       buttonToolbar.insert(3, '-');
       }
       
       

       this.callParent(arguments);
       
     //grid를 선택했을 때 Callback
       this.setGridOnCallback(function(selections) {
           if (selections.length) {
           	
        	   var rec = selections[0];
        	   gMain.selPanel.rec = rec;
        	   console_logs('rec 데이터', rec);
           	var standard_flag = rec.get('standard_flag');
           	standard_flag = gUtil.stripHighlight(standard_flag);  //하이라이트 삭제 
           	
           	console_logs('그리드온 데이터', rec);
           	gMain.selPanel.request_date = rec.get('req_date'); // 납기일
           	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //cartmap_uid
           	gMain.selPanel.vSELECTED_PJ_UID = rec.get('ac_uid'); //프로젝트아이디
           	gMain.selPanel.vSELECTED_SP_CODE = rec.get('sp_code');
           	gMain.selPanel.vSELECTED_STANDARD = rec.get('standard_flag');
           	gMain.selPanel.vSELECTED_coord_key3 = rec.get('coord_key3');   // pj_uid
           	gMain.selPanel.vSELECTED_coord_key2 = rec.get('coord_key2');
           	gMain.selPanel.vSELECTED_coord_key1 = rec.get('coord_key1');   // 공급사
           	gMain.selPanel.vSELECTED_po_user_uid = rec.get('po_user_uid');
           	gMain.selPanel.vSELECTED_item_name = rec.get('item_name');    // 품명
           	gMain.selPanel.vSELECTED_item_code = rec.get('item_code');    // 품번
           	gMain.selPanel.vSELECTED_specification = rec.get('specification');    // 규격
           	//gMain.selPanel.vSELECTED_description = rec.get('description');   // 평량
           	//gMain.selPanel.vSELECTED_remark = rec.get('remark');    // 장
           	gMain.selPanel.vSELECTED_req_date = rec.get('delivery_plan');
           	gMain.selPanel.vSELECTED_quan = rec.get('pr_quan');
       	console_logs('유니크아이디', gMain.selPanel.vSELECTED_UNIQUE_ID );
        	this.cartmap_uids.push(gMain.selPanel.vSELECTED_UNIQUE_ID);
        	//this.cartmap_uids.push(gMain.selPanel.vSELECTED_UNIQUE_ID);
            /*for(var i=0; i<selections.length; i++){
        		   var rec1 = selections[i];
        		 var uids = rec1.get('id');
        		this.cartmap_uids.push(uids);
        		console_logs('rec1', rec1);
        	   }*/
            console_logs('선택된 uid', this.cartmap_uids);
           	if(gMain.selPanel.poviewType == 'ADDPO'){
           		
           		gMain.selPanel.createAddPoAction.enable();
           		gMain.selPanel.createPoAction.disable();
           	}else{
           		gMain.selPanel.createPoAction.enable();
           	}
           	
            } else {
           	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
           	gMain.selPanel.vSELECTED_PJ_UID = -1;
           	
           	if(gMain.selPanel.poviewType == 'ADDPO'){
           		gMain.selPanel.createAddPoAction.disable();
           		gMain.selPanel.createPoAction.enable();
           	}else{
           		//gMain.selPanel.createPoAction.disable();
           	}
           	
           	//this.store.removeAll();
           	this.cartmap_uids = [];
           	for(var i=0; i<selections.length; i++){
        		   var rec1 = selections[i];
        		 var uids = rec1.get('id');
        		this.cartmap_uids.push(uids);
        	   }
           	
           //	console_logs('유니크아이디', gMain.selPanel.vSELECTED_UNIQUE_ID );
           //	console_logs('언체크', this.cartmap_uids);
           }
       	
       })

        //디폴트 로드
       gMain.setCenterLoading(false);
       this.store.load(function(records){
    	   console_logs('디폴트 데이터', records);
    	   
       });
    },
    items : [],
    poviewType: 'ALL',
    cartmap_uids : [],
    deleteClass: ['cartmap'],
    
    purCopyAction: function () {
    	var uniqueId = gMain.selPanel.vSELECTED_PJ_UID;
    	
    	if(uniqueId.length < 0){
    		alert('선택된 데이터가 없습니다.');
    	}else{
    	
    	Ext.Ajax.request({
    		url : CONTEXT_PATH + '/purchase/request.do?method=purcopycartmap',
			params:{
				cartmapUids: this.cartmap_uids
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '복사가 완료 되었습니다.', function() {});
				
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax
    	} // end of if uniqueid
    },
    
    
    
   
    
    //주문 작성 폼
    treatPaperAddPoRoll: function() {
    	var next = gUtil.getNextday(0);
    	 form = Ext.create('Ext.form.Panel', {
			 id: gu.id('formPanel'),
			 xtype: 'form',
			 frame: true ,
	    		border: false,
	    		bodyPadding: 10,
	    		region: 'center',
	    		layout: 'column',
	            fieldDefaults: {
	                labelAlign: 'right',
	                msgTarget: 'side'
	            },
	            defaults: {
	                layout: 'form',
	                xtype: 'container',
	                defaultType: 'textfield',
	                style: 'width: 50%'
	            },
	            items:[{
	            	xtype: 'fieldset',
                 title: '구매',
                 width : 400,
                 height : 400,
                 margins: '0 20 0 0',
                 collapsible: true,
                 anchor: '100%',
                 defaults: {
                     labelWidth: 89,
                     anchor: '100%',
                     layout: {
                         type: 'hbox',
                         defaultMargins: {top: 0, right: 100, bottom: 0, left: 10}
                     }
                 },
                items: [
                    { fieldLabel: '주문처',
	            		xtype: 'combo',    
	            		anchor: '100%',
	            		/*id: 'stcok_pur_supplier_info',
	            		name: 'stcok_pur_supplier_info',*/
	            		id: 'supplier_information',
	            		name: 'supplier_information',
	            		store: Ext.create('Mplm.store.SupastStore'),
	            		displayField:   'supplier_name',
	            		valueField: 'unique_id',
	            		emptyText: '선택',
	            		allowBlank: false,
	            		sortInfo: { field: 'create_date', direction: 'DESC' },
	            	    typeAhead: false,
	            	    //hideLabel: true,
	            	    minChars: 1,
	            		listConfig:{
	            			loadingText: '검색중...',
	            	        emptyText: '일치하는 항목 없음.',
	            	      	getInnerTpl: function(){
	            	      		return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
	            	      	}
	            		},
	            		listeners: {
	            	           select: function (combo, record) {
	            	        	   var reccode = record.get('area_code');
	            	        	   Ext.getCmp('maker_code').setValue(reccode);
	            	           }
	            	      }	
                    },
                    { fieldLabel: '납품장소',
            	      xtype: 'textfield',
            	      rows: 4,
            	      anchor: '100%',
            	      id:   'delivery_address1',
            	      name: 'delivery_address1',
            	      value : '사내'
                    },
                    
                    { fieldLabel: '비고',
            	      xtype: 'textarea',
            	      rows: 4,
            	      anchor: '100%',
            	      id:   'item_abst',
            	      name: 'item_abst',
            	      
                    },
                    { fieldLabel: '품명',
                        xtype : 'textfield',
                        id : 'item_name',
                        name : 'item_name',
                        value : gMain.selPanel.vSELECTED_item_name,
                        readOnly: true
                      }
                   
                    /*{ fieldLabel: '품번',
	                      xtype : 'textfield',
	                      id : 'item_code',
	                      name : 'item_code',
	                      useThousandSeparator: false,
	                      minValue : 1,
	                      value : gMain.selPanel.vSELECTED_item_code,
	                      readOnly: true
	                      
	                },
                    { fieldLabel: '품명',
                      xtype : 'textfield',
                      id : 'item_name',
                      name : 'item_name',
                      value : gMain.selPanel.vSELECTED_item_name,
                      readOnly: true
                    },
                    { fieldLabel: '규격',
                      xtype : 'textfield',
                      id : 'specification',
                      name : 'specification',
                      value : gMain.selPanel.vSELECTED_specification,
                      readOnly: true
                      
                    },
                    { fieldLabel: '수량',
                      xtype : 'numberfield',
                      id : 'quan',
                      name : 'quan',
                      useThousandSeparator: false,
                      allowBlank: false
                     
                    },{ fieldLabel: '주문금액',
                        xtype : 'numberfield',
                        id : 'sales_price',
                        name : 'sales_price',
                        allowBlank: false
                       
                      },
                    { fieldLabel: '납품기한',
                    	id: 'request_date',
					    name: 'request_date',
					    xtype: 'datefield',
					    //value: gMain.selPanel.request_date,
					    format: 'Y-m-d',
	    		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'	
	    		    	value : next
                    }*/
                   
                ]
	            }]
		 })
		 myHeight = 500;
			myWidth = 420;

		prwin = this.prwinopen(form);
    },
    
    treatPo: function() {
    	
    	
    	var uniqueId = gMain.selPanel.vSELECTED_UNIQUE_ID;
    	console_logs('uniqueId>>>', uniqueId);
    	
    	var next = gUtil.getNextday(0);
    	 
    	var request_date = gMain.selPanel.request_date;
    	var form = null;
    	
    	if(uniqueId == undefined || uniqueId < 0){
    		alert("선택된 자재가 없습니다.");
    	}else{
    		this.treatPaperAddPoRoll();
    	}
 	   
    },
   
    
    // 주문 submit
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: '주문 작성',
        width: myWidth,
        
        height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
        		var msg = '발주하시겠습니까?'
        		var myTitle = '주문 작성 확인';
        		Ext.MessageBox.show({
                    title: myTitle,
                    msg: msg,
                    
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                    	
                    	if(btn == "no"){
                    		prWin.close();
                    	}else{
                    	var form = gu.getCmp('formPanel').getForm();
                    	//var form = gMain.selPanel.up('form').getForm();
                    	var po_user_uid = gMain.selPanel.vSELECTED_po_user_uid;
                    	//var catmapuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                    	var cartmaparr = [];
                    	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    	for(var i=0; i< selections.length; i++) {
                    		var rec = selections[i];
                    		var uid = rec.get('id');
                    		cartmaparr.push(uid);
                    		
                    	}
                    	
                    	
                    	if(form.isValid()){	
                    	var val = form.getValues(false);
                    	
                    	console_logs('val', val);
                    	                    	
                    	form.submit({
                			url : CONTEXT_PATH + '/purchase/request.do?method=createheavy',
                			params:{
                				sancType : 'YES',
                				//cartmapUid: catmapuid,
                				cartmaparr: cartmaparr
                			},
                			success: function(val, action){
                				prWin.close();
                				gMain.selPanel.store.load(function(){});
                				
                			},
                			failure: function(val, action){
                				
                				 prWin.close();
                				 
                			}
                		})
                    	}  // end of formvalid 
                    	} // btnIf of end
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
   
});
