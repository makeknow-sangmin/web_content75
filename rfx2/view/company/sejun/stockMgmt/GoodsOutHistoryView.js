//주문작성

Ext.define('Rfx2.view.company.sejun.stockMgmt.GoodsOutHistoryView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'goods-out-history-view',
    initComponent: function(){

    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가

		switch(vCompanyReserved4) {
            case 'SKNH01KR':
                this.addSearchField('project_varchar3');
                this.addSearchField('pr_no');
                this.addSearchField('item_code');
                this.addSearchField('item_name');
                this.addSearchField('specification');
                this.addSearchField('rtgast_uid');
            	break;            
			case 'SJFB01KR':
                this.addSearchField('item_code');
                this.addSearchField('item_name');
            	break;
			default:
                this.addSearchField('project_varchar6');
                this.addSearchField('item_code');
                this.addSearchField('item_name');
                this.addSearchField('specification');
		}

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        switch(vCompanyReserved4) {
        default:
        this.createStoreSimple({
    		modelClass: 'Rfx.model.GoodsOutHistory',
	        pageSize: gMain.pageSize,/*pageSize*/
	        sorters: [{
	        	property: 'parent_code',
	        	direction: 'asc'
	        }],
	        byReplacer: {

	        },
	        deleteClass: ['cartmap']
		        
	    }, {
	    	//groupField: 'parent_code'
        });
            break;
        }
        
      
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
	        	groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 출고 ({rows.length})</div>'
		}); 
        
		var option = {
				/*features: [groupingFeature]*/
		};
        
        //grid 생성.
		this.createGridCore(arr, option);
        this.createCrudTab();

		
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        
        //this.removeAction.setText('반려');
        
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==3||index==4||index==2||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });



        this.setAllMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.load(function () {
                });
            }
        });
        this.setAssyMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'ASSY',
            tooltip: 'ASSEMBLY',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('standard_flag', 'A');
                gm.me().store.getProxy().setExtraParam('sg_code', 'AASSY');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSetMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'SET',
            tooltip: 'SET',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('standard_flag', 'A');
                gm.me().store.getProxy().setExtraParam('sg_code', 'SET00');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSaMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '원자재',
            tooltip: '원자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'RAW';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'S');
                gm.me().store.load(function () {
                });
            }
        });
        this.setMROView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'MRO',
            tooltip: '소모성',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'M');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSubMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '부자재',
            tooltip: '부자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'B');
                gm.me().store.load(function () {
                });
            }
        });
        this.setUsedMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '상품',
            tooltip: '상품',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'P');
                gm.me().store.load(function () {
                });
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
     //사내발주 Action 생성
       this.createInPoAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '사내 발주',
			 tooltip: '사내 발주',
			 disabled: false,
			 handler: function() {
				 gMain.selPanel.treatInPo();
			 }//handler end...
		 
		});
     //주문작성 Action 생성

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
       
       //버튼 추가.
        buttonToolbar.insert(5, '-');
        buttonToolbar.insert(5, this.setUsedMatView);
        buttonToolbar.insert(5, this.setMROView);
        buttonToolbar.insert(5, this.setSubMatView);
        buttonToolbar.insert(5, this.setSaMatView);
        buttonToolbar.insert(5, this.setSetMatView);
        buttonToolbar.insert(5, this.setAssyMatView);
        buttonToolbar.insert(5, this.setAllMatView)
        buttonToolbar.insert(3, this.createGoutAction);

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
           	gMain.selPanel.vSELECTED_CURRENCY = rec.get('currency'); //스카나 통화
           	gMain.selPanel.vSELECTED_STANDARD = rec.get('standard_flag');
           	gMain.selPanel.vSELECTED_MYCARTQUAN = rec.get('mycart_quan');
           	gMain.selPanel.vSELECTED_coord_key3 = rec.get('coord_key3');   // pj_uid
           	gMain.selPanel.vSELECTED_coord_key2 = rec.get('coord_key2');
           	gMain.selPanel.vSELECTED_coord_key1 = rec.get('coord_key1');   // 공급사
           	gMain.selPanel.vSELECTED_po_user_uid = rec.get('po_user_uid');
           	gMain.selPanel.vSELECTED_item_name = rec.get('item_name');    // 품명
           	gMain.selPanel.vSELECTED_item_code = rec.get('item_code');    // 품번
           	gMain.selPanel.vSELECTED_specification = rec.get('specification');    // 규격
           	//gMain.selPanel.vSELECTED_description = rec.get('description');   // 평량
           	//gMain.selPanel.vSELECTED_remark = rec.get('remark');    // 장
           	gMain.selPanel.vSELECTED_pj_name = rec.get('pj_name'); 
           	gMain.selPanel.vSELECTED_req_date = rec.get('delivery_plan');
           	gMain.selPanel.vSELECTED_quan = rec.get('pr_quan');
        	gMain.selPanel.vSELECTED_CHILD = rec.get('child');
           	gMain.selPanel.vSELECTED_QUAN = rec.get('quan');
         	gMain.selPanel.vSELECTED_PRICE = rec.get('sales_price');
         	gMain.selPanel.vSELECTED_STOCK_USEFUL = rec.get('stock_qty_useful');
              /*
               Mplm.store.InstallStateStoreTest.getProxy().setExtraParam('srcahd_uid', gm.me().vSELECTED_CHILD);
               Mplm.store.InstallStateStoreTest.load();*/
         	var pj_name = gMain.selPanel.vSELECTED_pj_name
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
            if(pj_name == undefined || pj_name == "" || pj_name == null){
            	gMain.selPanel.createInPoAction.disable();
            }else{
            	gMain.selPanel.createInPoAction.enable();
            }
    			
           	if(gMain.selPanel.poviewType == 'ADDPO'){
           		
           		gMain.selPanel.createAddPoAction.enable();
           		gMain.selPanel.createGoutAction.disable();
           		
           	}else{
           		gMain.selPanel.createGoutAction.enable();
           		
           	}
           	
            } else {
           	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
           	gMain.selPanel.vSELECTED_PJ_UID = -1;
           	
           	if(gMain.selPanel.poviewType == 'ADDPO'){
           		gMain.selPanel.createAddPoAction.disable();
           		gMain.selPanel.createGoutAction.enable();
           		gMain.selPanel.createInPoAction.enable();
           	}else{
           		//gMain.selPanel.createGoutAction.disable();
           	}
           	
           	//this.store.removeAll();
           	this.cartmap_uids = [];
           	this.currencies = [];
           	for(var i=0; i<selections.length; i++){
        		   var rec1 = selections[i];
        		 var uids = rec1.get('id');
        		 var currencies = rec1.get('currency');
        		this.cartmap_uids.push(uids);
        		this.currencies.push(currencies);
        	   }
           	
           	console_logs('this.currencies>>>', currencies );
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
    
    
    //사내발주 폼
    treatPaperAddInPoRoll: function() {
    	var next = gUtil.getNextday(0);
    	 var arrExist = [];
    	 var arrCurrency = [];
    	 var arrTotalPrice = [];
		 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
		 
//		    if (selections) {
//		    	var uids = [];
		 
		 		var total = 0;
	        	for(var i=0; i< selections.length; i++) {
	        		var rec = selections[i];
	        		var unique_id = rec.get('unique_id');
	        		var child = rec.get('child');
	        		var item_name = rec.get('item_name');
	        		var pj_name = rec.get('pj_name');
	        		var stock_qty_useful = rec.get('stock_qty_useful');
	        		var quan = rec.get('quan');
	        		var sales_price = rec.get('sales_price');
//	        		total = total+total_price;
					arrExist.push(item_name);
					
					console_logs('arrTotalPrice----------------', arrTotalPrice);
					
					console_logs('arrExist----------------', arrExist);
					console_logs('arrCurrency----------------', arrCurrency);
	        	}
	        	
	        	
//		    }
	 
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
                 title: '사내발주',
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
	            		xtype: 'textfield',    
	            		anchor: '100%',
	            		/*id: 'stcok_pur_supplier_info',
	            		name: 'stcok_pur_supplier_info',*/
	            		id: 'in_pur_information',
	            		name: 'in_pur_information',
	            		value: '스카나코리아',
	            		allowBlank: false,
	            	    typeAhead: false,
	            	    editable:false,
                    },
                    { fieldLabel: '프로젝트',
                    	name: 'pj_name',
						fieldLabel: '프로젝트',
						anchor: '-5',
						//readOnly : true,
						//fieldStyle : 'background-color: #ddd; background-image: none;',
						allowBlank:true,
						editable:false,
						value:pj_name
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
                        value : arrExist,
//                        	arrExist[0] + ' 포함 ' + arrExist.length + '건',
                        readOnly: true

                      },
                      { fieldLabel: '가용재고',
                          xtype : 'textfield',
                          id : 'stock_qty_useful',
                          name : 'stock_qty_useful',
                          value : stock_qty_useful,
                          readOnly: true

                        },
                        { fieldLabel: '주문수량',
                            xtype : 'textfield',
                            id : 'quan',
                            name : 'quan',
                            value : quan,
                           fieldStyle : 'background-color:#FBF8E8; background-image: none;',
                            editable:true

                          }]
	            }]
		 })
		 myHeight = 500;
			myWidth = 420;

		prwin = this.Inprwinopen(form);
    },
    
    //주문 작성 폼
    treatPaperAddPoRoll: function() {
    	var next = gUtil.getNextday(0);
    	 var arrExist = [];
    	 var arrCurrency = [];
    	 var arrTotalPrice = [];
		 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
		 
//		    if (selections) {
//		    	var uids = [];
		 
		 		var total = 0;
	        	for(var i=0; i< selections.length; i++) {
	        		var rec = selections[i];
	        		var unique_id = rec.get('unique_id');
	        		var child = rec.get('child');
	        		var item_name = rec.get('item_name');
	        		var currency = rec.get('currency');
	        		var sales_price = rec.get('sales_price');
	        		//var total_price = gMain.selPanel.vSELECTED_QUAN * gMain.selPanel.vSELECTED_PRICE;
	        		var total_price =rec.get('total_price');
//	        		var total_price = rec.get('reserved_double5');
//	        		console_logs('reserved_double5----------------', reserved_double5);
//	        		uids.push(unique_id);
//	        		uids.push(child);
//	        		arrExist.push(unique_id);
	        		total = total+total_price;
					arrExist.push(item_name);
					arrCurrency.push(currency);
					console_logs('total----------------', total);
//					console_logs('arrTotalPrice----------------', arrTotalPrice);
					
					console_logs('arrExist----------------', arrExist);
					console_logs('arrCurrency----------------', arrCurrency);
	        	}
	        	
	        	
//		    }
	 
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
//	            	        	   Ext.getCmp('maker_code').setValue(reccode);
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
                        value : arrExist,
//                        	arrExist[0] + ' 포함 ' + arrExist.length + '건',
                        readOnly: true

                      },
                      { fieldLabel: '통화',
                          xtype : 'textfield',
                          id : 'currency',
                          name : 'currency',
                          value : arrCurrency,
                          readOnly: true

                        },
                        { fieldLabel: '합계금액',
                            xtype : 'textfield',
                            id : 'reserved_double5',
                            name : 'reserved_double5',
                            value : total,
                            readOnly: true

                          }
                     
                   
                   
                ]
	            }]
		 })
		 myHeight = 500;
			myWidth = 420;

		prwin = this.prwinopen(form);
    },
    
    treatGo: function() {
    	
    	var uniqueId = gMain.selPanel.vSELECTED_UNIQUE_ID;
    	
    	var next = gUtil.getNextday(0);
    	 
    	var request_date = gMain.selPanel.request_date;
    	var form = null;
    	
    	if(uniqueId == undefined || uniqueId < 0){
    		Ext.Msg.alert("알 림","선택된 자재가 없습니다.");
    	}else{
    		Ext.MessageBox.show({
    			 title:'확인',
		         msg: '요청 하시겠습니까?',
		         buttons: Ext.MessageBox.YESNO,
		         fn:  function(result) {
         	        if(result=='yes') {
    		Ext.Ajax.request({
    			url: CONTEXT_PATH + '/quality/wgrast.do?method=createGrMes',
				params:{
					cartmap_uids: cartmapuids,
					gr_qty : gr_qtys,
					item_abst : item_abst,
					gr_reason: val['gr_reason']
				},
    			success: function(){
    				gm.me().showToast('결과', item_name + ' 등' + gr_qtys.length + ' 건이 입고되었습니다.' );
    				gm.me().getStore().load(function() { });
    			},
    			failure: function(){
    			}
			 });
         	       }
		            },
    		   });
		         
    		//this.treatPaperAddPoRoll();
    	}
 	   
    },
    treatInPo: function() {
    	
       	var uniqueId = gMain.selPanel.vSELECTED_UNIQUE_ID;
        	
        	var next = gUtil.getNextday(0);
        	 
        	var request_date = gMain.selPanel.request_date;
        	var pj_name = gMain.selPanel.vSELECTED_pj_name;
        	var stock_qty_useful = gMain.selPanel.vSELECTED_STOCK_USEFUL;
        	
        	var form = null;
        	
        	if(uniqueId == undefined || uniqueId < 0){
        		Ext.Msg.alert("알 림","선택된 자재가 없습니다.");
        	}else{
        		if(stock_qty_useful == undefined || stock_qty_useful == "" || stock_qty_useful == null){
        			Ext.Msg.alert("알 림","가용재고가 없습니다. 확인해주세요.");
        		}else{
        			this.treatPaperAddInPoRoll();
        		}
        	}
     	   
        },
    
    // 주문 submit
    prwinopen: function(form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '주문 작성',
            width: myWidth,

            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var msg = '발주하시겠습니까?';
                    var myTitle = '주문 작성 확인';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,

                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                var form = gu.getCmp('formPanel').getForm();
                                //var form = gMain.selPanel.up('form').getForm();
                                var po_user_uid = gMain.selPanel.vSELECTED_po_user_uid;
                                //var catmapuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                                var cartmaparr = [];
                                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];
                                    var uid = rec.get('id');

                                    cartmaparr.push(uid);

                                }
                                var mycart_quan = rec.get('mycart_quan');
                                var sales_price = rec.get('sales_price');
                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    console_logs('val', val);

                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createheavy',
                                        params: {
                                            sancType: 'YES',
                                            //cartmapUid: catmapuid,
                                            cartmaparr: cartmaparr,
                                            mycart_quan: mycart_quan,
                                            sales_price: sales_price
                                        },
                                        success: function (val, action) {
                                            prWin.close();
                                            Ext.Msg.alert('안내', '발주 완료 되었습니다.', function () {
                                            });
                                            gMain.selPanel.store.load(function () {
                                            });

                                            //this.store.load();
                                            //gMain.selPanel.store.load();
                                        },
                                        failure: function (val, action) {

                                            prWin.close();

                                        }
                                    })
                                }  // end of formvalid
                            } // btnIf of end
                        }//fn function(btn)

                    });//show
                }//btn handler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },

    editRedord: function(field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        switch (field) {
	        case 'stock_pos':
                break;
        }
    },/*
    updateDesinComment: function(rec) {
    	
    	var child = gMain.selPanel.vSELECTED_UNIQUE_ID;
    	console_logs('child>>>', child);
        var quan = rec.get('quan');
        var static_sales_price = rec.get('static_sales_price');
        var req_date = rec.get('req_date');
        var unique_id = rec.get('unique_uid');
        console_logs('====> unique_id', unique_id);
        
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updateCreatePo',
            params: {
            	quan: quan,
                static_sales_price: static_sales_price,
                req_date: req_date,
                unique_id: unique_id
            },
            success: function(result, request) {

                var result = result.responseText;
                //console_logs("", result);

            },
            failure: extjsUtil.failureMessage
        });
    },*/
    
    getCell_edit: function(me) {
		var listLmenu = gUtil.lmenuStruct;
		var cell_edit = 'N'
		for (var i = 0; i < listLmenu.length; i++) {
			var o = listLmenu[i];
			
			//console_logs('getCell_edit o', o);
			
			if(o['menu_key'] == gm.me().link) {
				return o['cell_edit']
			}
		}
		return cell_edit;
	},
	me: function() {
		return this.selPanel;
	},
    editRedord: function(field, rec, columnType) {
    	console_logs('여기로 오나????');
		console_logs('gm ====> edited field', field);
		console_logs('gm ====> edited record', rec);
		var cell_edit = this.getCell_edit(this.me());
		console_logs('gm ====>  cell_edit', cell_edit);
		
    	if(cell_edit=='Y') {
    		var update_pcsstep = rec.get('update_pcsstep'); //공정 졀로 PCSSTEP 수정
    		
    		console_logs('update_pcsstep = ', update_pcsstep);
    		
    		//Ext.Msg.alert(value);
	    	
    		var arr = field.split('|');
    		
    		// ONLY_STEP : 단순한 PCSSTEP 수정
    		// FULL_MAKE : FULL 동정처리
    		//var columnType = this.getColumnType(field);
	    	var value=rec.get(field);
	    	var tableName = this.getTableName(field);
	    	var whereField = "unique_id";

	    	var whereValue = rec.get(tableName+'_uid');
	    	
	    	if(whereValue==null) {
	    		 whereValue = rec.get('id');
	    	}
	    	
	    	console_logs('value = ', value);
	    	console_logs('whereValue = ', whereValue);
	    	console_logs('arr = ', arr);
	    	
	    	if(update_pcsstep!=null && arr.length>1) {
    				var vo = rec.data;
    				
    				value= vo[field];
    				var uidKey = arr[0] + '|' + 'step_uid';
    				console_logs('uidKey', uidKey);
    				console_logs('vo+++++++++++++++', vo);
    				whereValue = vo[uidKey];
    				console_logs('whereValue', whereValue);
    				if(value==null) {
    					//Ext.MessageBox.alert('오류','지정된 값을 확인할 수 없습니다.');
    					gm.me().showToast('셀수정 결과', '지정된 값을 확인할 수 없습니다.');
    				}else if(whereValue==null) {
    					//Ext.MessageBox.alert('오류','작업지시 항목(PCSSTEP UID)를 확인할 수 없습니다.');
    					gm.me().showToast('셀수정 결과', '작업지시 항목(PCSSTEP UID)를 확인할 수 없습니다.');
    				}
    				else {
    					
    					var type = (update_pcsstep=='FULL_MAKE') ? 'update_pcsstep' : '';
	    				this.editAjax('pcsstep', arr[1], value, whereField, whereValue, {type: type});

	    				}
    		} else {
		    	if(value!=null) {
		    		this.editAjax(tableName, field, value, whereField, whereValue,  {type:''});

		    	}
	    	}
    	}//endof cell_edit=='Y'
    	
	},
	editAjax: function(tableName, field, value, whereField, in_whereValue, in_params, multi_grid_id) {
		console_logs('tableName', tableName);
		if(tableName==null || tableName=='') {
			//gm.me().showToast('오류', '수정할 테이블 이름이 J2_CODE에 정의되지 않았습니다.');
			return;
		}
		gm.me().recCount++;
		
//						console_logs('editAjax', 'in');
//						console_logs('in_params', in_params);
//						console_logs('in_whereValue', in_whereValue);
		
		var params = {};
		if(in_params!=null) {
			for(var key in in_params) {
				params[key] = in_params[key];
    		}
		}
		//console_logs('params', params);
		
		var whereValue = []; 
		whereValue.push(in_whereValue);
		//console_logs('in_whereValue', whereValue);
		params['tableName'] = tableName;
		params['setField'] = field;
		params['setValue'] = value;
		params['whereField'] = whereField;
		params['whereValue'] = whereValue;
		params['valueType'] =  gm.getColType(field);
//		params['reserved_double5'] = gMain.selPanel.reserved_double5;
		/*
		params['menuCode'] = this.link;*/
//		console_logs('editAjax - params', params);
		Ext.Ajax.request({
			url : CONTEXT_PATH + '/index/generalData.do?method=updateGeneralOne',
			params : params,
			success : function(result, request) {
				//console_logs('editRedord result', result);
				var result = result.responseText;
				if(result!=null) {
					var o = Ext.util.JSON.decode(result);
					if(o!=null) {
						
						var field_name = gm.getColName(o['setField']);
						var value = o['setValue'];
						var id = o['whereValue'];
						
						var msg = '';
						if(value=='') {
							msg = 'UID ' + id +'의 <' + field_name + '> 값이 ' + ' 초기화 되었습니다.'
						} else {
							msg = 'UID ' + id +'의 <' + field_name + '> 값이 ' + '"' + value + '" (으)로 수정되었습니다.'
						}
						 gm.me().showToast('셀수정 결과', msg);
						 gm.me().recCount--;
						 
						 
					}
					gMain.selPanel.store.load();
					
				/*
					if(field_name == "주문수량"){
						gMain.selPanel.vSELECTED_QUAN = value;
						console_logs('gMain.selPanel.vSELECTED_QUAN', gMain.selPanel.vSELECTED_QUAN);
					}
					if(field_name == "단가"){
						gMain.selPanel.vSELECTED_PRICE = value;
						console_logs('gMain.selPanel.vSELECTED_PRICE', gMain.selPanel.vSELECTED_PRICE);
					}
					console_logs('gMain.selPanel.vSELECTED_QUAN>후', gMain.selPanel.vSELECTED_QUAN);
					console_logs('gMain.selPanel.vSELECTED_PRICE>후', gMain.selPanel.vSELECTED_PRICE);
					
					var total_price= gMain.selPanel.vSELECTED_QUAN * gMain.selPanel.vSELECTED_PRICE;

					gm.me().getPrice(total_price);*/
				}
				
		}
		
		});	

	},
	calcAge :function(quan,sales_price) {
	return quan*sales_price;
	

	},
	getPrice:function(total_price){
		console_logs('total_price++++++++', total_price);
		var uniqueId = gMain.selPanel.vSELECTED_PJ_UID;
		Ext.Ajax.request({
    		url : CONTEXT_PATH + '/purchase/request.do?method=updatePrice',
			params:{
				cartmapUids: this.cartmap_uids,
				total_price: total_price
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
//				Ext.Msg.alert('안내', '복사가 완료 되었습니다.', function() {});
				
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax
	},
	
			getTableName: function(field_name) {
		//		console_logs('getTableName field_name', field_name);
		var fields = this.getFields();
		for(var i=0;i < fields.length; i++) {
		var o=fields[i];
		//			console_logs('getTableName o', o);
		if(field_name==o['name']) {
		return o['tableName'];
		}
		}
		return null;
		},
        // 사내발주 submit
        Inprwinopen: function(form) {
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
            		var msg = '사내 발주하시겠습니까?';
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
                        	var quan = rec.get('quan');
                        	
                        	if(form.isValid()){	
                        	var val = form.getValues(false);
                        	
                        	console_logs('val', val);
                        	                    	
                        	form.submit({
                    			url : CONTEXT_PATH + '/purchase/request.do?method=createGo',
                    			params:{
                    				sancType : 'YES',
                    				//cartmapUid: catmapuid,
                    				catmapUids: cartmaparr,
                    				quan: quan,
                    				mp_status:'GR'
                    			},
                    			success: function(val, action){
                    				prWin.close();
                    				Ext.Msg.alert('안내', '발주 완료 되었습니다.', function() {});
                    				gMain.selPanel.store.load(function(){});
                    				
                    				//this.store.load();
                    				//gMain.selPanel.store.load();
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

    Goprwinopen: function(form) {
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
                    var msg = '사내 발주하시겠습니까?';
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
                                var quan = rec.get('quan');

                                if(form.isValid()){
                                    var val = form.getValues(false);

                                    console_logs('val', val);

                                    form.submit({
                                        url : CONTEXT_PATH + '/purchase/request.do?method=createGo',
                                        params:{
                                            sancType : 'YES',
                                            //cartmapUid: catmapuid,
                                            catmapUids: cartmaparr,
                                            quan: quan,
                                            mp_status:'GR'
                                        },
                                        success: function(val, action){
                                            prWin.close();
                                            Ext.Msg.alert('안내', '발주 완료 되었습니다.', function() {});
                                            gMain.selPanel.store.load(function(){});

                                            //this.store.load();
                                            //gMain.selPanel.store.load();
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
    }
});
