//주문작성

Ext.define('Rfx.view.purStock.HEAVY4_CreatePoView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'create-po-view',
    initComponent: function(){

    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
    /*	Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch (dataIndex) {
            	case 'reserved_double5':
            		id:gu.id(this.link+'reserved_double5'),
            		columnObj['style'] = 'text-align:right';
            		columnObj['align'] = 'right';
            		columnObj['editor'] = {
						allowBlank : false,
						xtype : 'textfield',
						allowBlank : false,
						minValue : '',
						renderer : function(quan, sales_price){
							 console_logs('quan+++++++++++', quan);
		                    return calcAge(quan,sales_price);
		                }
					};
					
					break;*/
				
             /*   case 'quan':
                case 'static_sales_price':
                case 'sales_price':
                case 'req_date':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
            }
        });*/
    	
    	this.addSearchField ({
            type: 'dateRange',
            field_id: 'gr_date',
            text: "요청기간" ,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
    	});    

//		this.addSearchField('maker_name');
		this.addSearchField('item_code');
		this.addSearchField('pj_name');
		this.addSearchField('supplier_name');
		this.addSearchField('remark');
		this.addSearchField('item_name');
		this.addSearchField('specification');
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

        switch(vCompanyReserved4) {
        case "HAEW01KR":
        case "DAEH01KR":
        	this.createStoreSimple({
        		modelClass: 'Rfx.model.HEAVY4CreatePoHW',
    	        pageSize: 500,/*pageSize*/
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
	        default:
	        this.createStoreSimple({
	    		modelClass: 'Rfx.model.HEAVY4CreatePo',
		        pageSize: 500,/*pageSize*/
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
	        
	        if(vCompanyReserved4=='SKNH01KR' || vCompanyReserved4=='KWLM01KR') {
	            this.setRowClass(function(record, index) {
	            	
	            	// console_logs('record', record);
	                var contract_supplier = record.get('contract_supplier');
	                var supplier_name = record.get('supplier_name');
	                
	                if(contract_supplier==supplier_name) {
	                	return 'green-row';
	                }
	                

	            });
	        }
	        
	        break;
        }
        
      
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
	        	groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 구매 ({rows.length})</div>'
		}); 
        
		var option = {
				features: [groupingFeature]
		};
        
        //grid 생성.
		this.createGridCore(arr, option);
        this.createCrudTab();

		
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        
        //this.editAction.setText('주문작성');
        this.removeAction.setText('반려');
        
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==3) {
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
 				gm.me().createAddPoAction.disable();
 				gm.me().vSELECTED_UNIQUE_ID='';
 				gm.me().poviewType = 'ALL';
 				gm.me().store.getProxy().setExtraParam('standard_flag', '');
 				gm.me().store.getProxy().setExtraParam('sp_code', '');
				gm.me().store.load(function(){});
				 
 			 }
 		});
        
        this.setRawPoView = Ext.create('Ext.Action', {
         	 xtype : 'button',
  			 text: '원자재',
  			 tooltip: '원자재',
  			 //ctCls: 'x-toolbar-grey-btn',
  			 toggleGroup: 'poViewType',
  			 handler: function() {
  				gm.me().createAddPoAction.disable();
  				gm.me().createPoAction.enable();
  				gm.me().createInPoAction.enable();
  				gm.me().updateCartmapContract.enable();
  				gm.me().vSELECTED_UNIQUE_ID='';
  				gm.me().poviewType = 'RAW';
  				gm.me().store.getProxy().setExtraParam('standard_flag', 'R');
  				gm.me().store.getProxy().setExtraParam('sp_code', '');
  				gm.me().store.getProxy().setExtraParam('storeType', '');
				gm.me().store.load(function(){});
				 
  			 }
  		});
       this.setSubPoView = Ext.create('Ext.Action', {
        	 xtype : 'button',
 			 text: '공구류',
 			 tooltip: '공구류 주문',
 			 //ctCls: 'x-toolbar-grey-btn',
 			 toggleGroup: 'poViewType',
 			 handler: function() {
 				gm.me().createAddPoAction.disable();
 				gm.me().createPoAction.enable();
 				gm.me().updateCartmapContract.disable();
 				gm.me().vSELECTED_UNIQUE_ID='';
 				gm.me().poviewType = 'SUB';
 				gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
 				gm.me().store.getProxy().setExtraParam('storeType', '');
 				gm.me().store.getProxy().setExtraParam('sp_code', 'K1');
				gm.me().store.load(function(){});
				
 			 }
 		});
       this.setMroPoView = Ext.create('Ext.Action', {
      	 xtype : 'button',
			 text: '기타 소모품',
			 tooltip: '기타 소모품',
			 //ctCls: 'x-toolbar-grey-btn',
			 toggleGroup: 'poViewType',
			 handler: function() {
				 gm.me().createAddPoAction.disable();
				 gm.me().createPoAction.enable();
				 gm.me().updateCartmapContract.enable();
				 gm.me().vSELECTED_UNIQUE_ID='';
				 gm.me().poviewType = 'PAPER';
				 gm.me().store.getProxy().setExtraParam('standard_flag', 'K');
				 gm.me().store.getProxy().setExtraParam('storeType', '');
				 gm.me().store.getProxy().setExtraParam('sp_code', 'K3');
				 gm.me().store.load(function(){});
				 
				 
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
  				 gm.me().poviewType = 'ADDPO';
  				 gm.me().vSELECTED_UNIQUE_ID='';
  				 gm.me().store.getProxy().setExtraParam('standard_flag', '');
  				 gm.me().store.getProxy().setExtraParam('storeType', 'Y');
  				 gm.me().store.load(function(){});
  				
  			 }
  		});
     
       //사내발주 Action 생성
       this.createInPoAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '사내 발주',
			 tooltip: '사내 발주',
			 disabled: true,
			 handler: function() {
				 gm.me().treatInPo();
			 }//handler end...
		 
		});
     //주문작성 Action 생성
       this.createPoAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '주문 작성',
			 tooltip: '주문 작성',
			 disabled: true,
			 handler: function() {
				 
		        	//OR17060001
					var fullYear = gUtil.getFullYear()+'';
					var month = gUtil.getMonth()+'';
					if(month.length==1) {
						month = '0' + month;
					}
					
					var first = "OR" + fullYear.substring(2,4) + month;
					console_logs('first', first);
					
					// 마지막 수주번호 가져오기
				   Ext.Ajax.request({
						url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPono',
						params:{
							first: first,
							codeLength: 4
						},
						success : function(result, request) {   	
							var po_no = result.responseText;
							
							 gm.me().treatPo(po_no);
							
						},// endofsuccess
						failure: extjsUtil.failureMessage
					});// endofajax
				   
				 
			 }//handler end...
			 
		});
       
       //계약 갱신/
       this.updateCartmapContract = Ext.create('Ext.Action', {
			 iconCls: 'fa-retweet_14_0_5395c4_none',
			 text: '계약 갱신',
			 tooltip: '계약 갱신',
			 disabled: true,
			 handler: function() {
				 gm.me().treatCartmapContract();
				 
			 }//handler end...
			 
		});
       
     //추가 주문작성 Action 생성
       this.createAddPoAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '복사 하기',
			 tooltip: '복사 하기',
			 disabled: true,
			 handler: function() {
				
				 var sp_code = gm.me().vSELECTED_SP_CODE;
				 switch(sp_code) {
				 case 'R':
					 gm.me().purCopyAction();
					 break;
				 case 'O':
					 gm.me().purCopyAction();
					 break;
				 case 'K':
					 gm.me().purCopyAction();
				 	break;
				 default:
					 
				 }
				 
			 }//handler end...
			 
		});
       
       buttonToolbar.insert(3, this.createPoAction);
//       buttonToolbar.insert(3, '-');
       buttonToolbar.insert(2, this.createInPoAction);

		 switch(vCompanyReserved4){
			case 'SKNH01KR':
			case 'KWLM01KR':
				buttonToolbar.insert(5, this.updateCartmapContract);
				
				break;
			default:
		       //버튼 추가.
		       buttonToolbar.insert(5, '-');
		       /*buttonToolbar.insert(5, this.setAddPoView);*/
		       buttonToolbar.insert(5, this.setMisPoView);
		       buttonToolbar.insert(5, this.setMroPoView);
		       buttonToolbar.insert(5, this.setSubPoView);
		       buttonToolbar.insert(5, this.setRawPoView);
		       buttonToolbar.insert(5, this.setAllPoView);
		       /*buttonToolbar.insert(3, this.createAddPoAction);*/
		
		//       buttonToolbar.insert(2, '-');
       break;
	    	}
       

       this.callParent(arguments);
       
     //grid를 선택했을 때 Callback
       this.setGridOnCallback( function(selections) {
     	
           if (selections.length) {
        	  
        	   var rec = selections[0];
        	   gm.me().rec = rec;
        	   console_logs('rec 데이터', rec);
        	   this.checkEqualPjNames(rec);
           	var standard_flag = rec.get('standard_flag');
           	standard_flag = gUtil.stripHighlight(standard_flag);  //하이라이트 삭제 
           	
           	console_logs('그리드온 데이터', rec);
           	gm.me().request_date = rec.get('req_date'); // 납기일
           	gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //cartmap_uid
           	gm.me().vSELECTED_PJ_UID = rec.get('ac_uid'); //프로젝트아이디
           	gm.me().vSELECTED_SP_CODE = rec.get('sp_code');
           	gm.me().vSELECTED_CURRENCY = rec.get('currency'); //스카나 통화
           	gm.me().vSELECTED_STANDARD = rec.get('standard_flag');
           	gm.me().vSELECTED_MYCARTQUAN = rec.get('mycart_quan');
           	gm.me().vSELECTED_coord_key3 = rec.get('coord_key3');   // pj_uid
           	gm.me().vSELECTED_coord_key2 = rec.get('coord_key2');
           	gm.me().vSELECTED_coord_key1 = rec.get('coord_key1');   // 공급사
           	gm.me().vSELECTED_po_user_uid = rec.get('po_user_uid');
           	gm.me().vSELECTED_item_name = rec.get('item_name');    // 품명
           	gm.me().vSELECTED_item_code = rec.get('item_code');    // 품번
           	gm.me().vSELECTED_specification = rec.get('specification');    // 규격
           	//gm.me().vSELECTED_description = rec.get('description');   // 평량
           	//gm.me().vSELECTED_remark = rec.get('remark');    // 장
           	gm.me().vSELECTED_pj_name = rec.get('pj_name'); 
           	gm.me().vSELECTED_req_date = rec.get('delivery_plan');
           	gm.me().vSELECTED_quan = rec.get('pr_quan');
           	gm.me().vSELECTED_QUAN = rec.get('quan');
         	gm.me().vSELECTED_PRICE = rec.get('sales_price');
         	gm.me().vSELECTED_STOCK_USEFUL = rec.get('stock_qty_useful');
         	var pj_name = gm.me().vSELECTED_pj_name
         	
           	console_logs('유니크아이디', gm.me().vSELECTED_UNIQUE_ID );
        	this.cartmap_uids.push(gm.me().vSELECTED_UNIQUE_ID);

        	//this.cartmap_uids.push(gm.me().vSELECTED_UNIQUE_ID);
            /*for(var i=0; i<selections.length; i++){
        		   var rec1 = selections[i];
        		 var uids = rec1.get('id');
        		this.cartmap_uids.push(uids);
        		console_logs('rec1', rec1);
        	   }*/
            console_logs('선택된 uid', this.cartmap_uids);
        	console_logs('pj_name++++++', pj_name);
            if(pj_name == undefined || pj_name == "" || pj_name == null){
            	gm.me().createInPoAction.disable();
            }else{
            		gm.me().createInPoAction.enable();
            		
            	
            }
    			
           	if(gm.me().poviewType == 'ADDPO'){
           		
           		gm.me().createAddPoAction.enable();
           		gm.me().createPoAction.disable();
           		gm.me().createInPoAction.disable();
           		gm.me().updateCartmapContract.disable();
           		
           		
           	}else{
           		gm.me().createPoAction.enable();
           		gm.me().createInPoAction.enable();
           		gm.me().updateCartmapContract.enable();
           		
           	}
           	
            } else {
	           	gm.me().vSELECTED_UNIQUE_ID = -1;
	           	gm.me().vSELECTED_PJ_UID = -1;
	           	
	           	if(gm.me().poviewType == 'ADDPO'){
	           		gm.me().createAddPoAction.disable();
	           		gm.me().createPoAction.enable();
	           		gm.me().createInPoAction.enable();
	           		gm.me().updateCartmapContract.disable();
	           	}else{
	           		gm.me().createPoAction.disable();
	           		gm.me().createInPoAction.disable();
	           		gm.me().updateCartmapContract.disable();
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
    	var uniqueId = gm.me().vSELECTED_PJ_UID;
    	
    	if(uniqueId.length < 0){
    		alert('선택된 데이터가 없습니다.');
    	}else{
    	
    	Ext.Ajax.request({
    		url : CONTEXT_PATH + '/purchase/request.do?method=purcopycartmap',
			params:{
				cartmapUids: this.cartmap_uids
			},
			
			success : function(result, request) { 
				gm.me().store.load();
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
		 var selections = gm.me().grid.getSelectionModel().getSelection();
		 
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
	            		id: 'in_supplier',
	            		name: 'in_supplier',
	            		value: '스카나코리아',
//	            		emptyText: '스카나코리아',
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
            	      id:   'reserved_varchar1',
            	      name: 'reserved_varchar1',
            	      value : '사내'
                    },
                    
                    { fieldLabel: '비고',
            	      xtype: 'textarea',
            	      rows: 4,
            	      anchor: '100%',
            	      id:   'reserved_varchar2',
            	      name: 'reserved_varchar2',
            	      
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
    	 var arrSales_price= [];
		 var selections = gm.me().grid.getSelectionModel().getSelection();
		 
//		    if (selections) {
//		    	var uids = [];
		 
		 		var total = 0;
	        	for(var i=0; i< selections.length; i++) {
	        		var rec = selections[i];
	        		var unique_id = rec.get('unique_id');
	        		var child = rec.get('child');
	        		var item_name = rec.get('item_name');
	        		var currency = rec.get('cart_currency');
	        		var pj_name = rec.get('pj_name');
	        		var sales_price = rec.get('static_sales_price');
	        		//var total_price = gm.me().vSELECTED_QUAN * gm.me().vSELECTED_PRICE;
	        		var total_price =rec.get('total_price');
//	        		var total_price = rec.get('reserved_double5');
//	        		console_logs('reserved_double5----------------', reserved_double5);
//	        		uids.push(unique_id);
//	        		uids.push(child);
//	        		arrExist.push(unique_id);
	        		total = total+total_price;
					arrExist.push(item_name);
					arrCurrency.push(currency);
					arrSales_price.push(currency);
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
					{ fieldLabel: '프로젝트',
					    xtype: 'textfield',
					    rows: 4,
					    anchor: '100%',
					    id:   'pj_name',
					    name: 'pj_name',
			    	    value : pj_name,
			    	    fieldStyle:'background-color: #ddd; background-image: none;',
	                    readOnly: true
					  },
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
            	      id:   'reserved_varchar1',
            	      name: 'reserved_varchar1',
            	      value : '사내'
                    },
                    
                    { fieldLabel: '비고',
            	      xtype: 'textarea',
            	      rows: 4,
            	      anchor: '100%',
            	      id:   'reserved_varchar2',
            	      name: 'reserved_varchar2',
            	      
                    },
                    { fieldLabel: '품명',
                        xtype : 'textfield',
                        id : 'item_name',
                        name : 'item_name',
                        value : arrExist,
                        fieldStyle:'background-color: #ddd; background-image: none;',
                        readOnly: true

                      },
                      { fieldLabel: '통화',
                          xtype : 'textfield',
                          id : 'currency',
                          name : 'currency',
                          value : arrCurrency,
                          fieldStyle:'background-color: #ddd; background-image: none;',
                          readOnly: true

                        },
                        { fieldLabel: '합계금액',
                            xtype : 'textfield',
                            id : 'reserved_double5',
                            name : 'reserved_double5',
                            fieldStyle:'background-color: #ddd; background-image: none;',
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
    treatCartmapContract: function() {
    	var selections = gm.me().grid.getSelectionModel().getSelection();
    	var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
    	if(uniqueId == undefined || uniqueId < 0){
    		Ext.Msg.alert("알 림","선택된 자재가 없습니다.");
    	}else{
    		
    		var cartmapUids = [];
	       	for(var i=0; i<selections.length; i++){
	    		 var rec = selections[i];
	    		 cartmapUids.push(rec.get('id'));
	       	}
	       	
	        Ext.Ajax.request({
	            url: CONTEXT_PATH + '/purchase/request.do?method=updateCartmapContract',
	            params: {
	                unique_ids: cartmapUids
	            },
	            success: function(result, request) {

	                var result = result.responseText;
	                console_logs("success", result);
	                gm.me().store.load(function(){});

	            },
	            failure: extjsUtil.failureMessage
	        });
    	}
    	
    },
    treatPo: function(po_no) {
    	console_logs('여기로 와라!+++++++++++++++', po_no);
    	var selections = gm.me().grid.getSelectionModel().getSelection();
	   	var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
    	var next = gUtil.getNextday(0);
    	var request_date = gm.me().request_date;
    
    	
    	if(uniqueId == undefined || uniqueId < 0){
    		Ext.Msg.alert("알 림","선택된 자재가 없습니다.");
    	}else{
    		
        	var form = null;
        	var pjArr = [];
        	var supArr = [];
        	var cartmapUids = [];
        	var notDefinedSup = false;
    		
		       	for(var i=0; i<selections.length; i++){
		    		 var rec = selections[i];
		    		 console_logs('rec', rec);
		    		 var coord_key1 = rec.get('coord_key1');
		    		 if(coord_key1==undefined || coord_key1==null || coord_key1=='' || coord_key1<0) {
		    			 notDefinedSup = true;
		    		 }
		    		 pjArr.push(rec.get('pj_code'));
		    		 supArr.push(coord_key1);
		    		 cartmapUids.push(rec.get('id'));
		       	}
		       	
		       	pjArr = gu.removeDupArray(pjArr);
		       	supArr = gu.removeDupArray(supArr);
		       	console_logs('pjArr', pjArr);
		       	console_logs('supArr', supArr);
		       	console_logs('cartmapUids', cartmapUids);
		       	
		       	if(pjArr.length>1) {
		       		Ext.Msg.alert('알림', '같은 프로젝트를  선택해주세요.', function() {});
		       	} else if(supArr.length>1) {
		       		Ext.Msg.alert('알림', '같은 공급사를 지정해 주세요.', function() {});
		       	} else if(notDefinedSup==true) {
		       		Ext.Msg.alert('알림', '공급사를 지정하지 않은 항목이 있습니다. 먼저 계약 갱신을 실행하세요.', function() {});
		       	} else {
		       	   	var next = gUtil.getNextday(0);
		   		 
		   		 		var total = 0;
		   	        	for(var i=0; i< selections.length; i++) {
		   	        		var rec = selections[i];
		   	        		var total_price =rec.get('total_price');
		   	        		total = total+total_price;
		   	        		
		   	        	}
		   	 
		       	 var form = Ext.create('Ext.form.Panel', {
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
		   					{ fieldLabel: '프로젝트',
		   					    xtype: 'textfield',
		   					    rows: 4,
		   					    anchor: '100%',
		   			    	    value : selections[0].get('pj_name'),
		   			    	    fieldStyle:'background-color: #ddd; background-image: none;',
		   	                    readOnly: true
		   					  },
		                       { fieldLabel: '주문처',
		   						 xtype: 'textfield',
			   					    rows: 4,
			   					    anchor: '100%',
			   					 value : selections[0].get('supplier_name'),
			   			    	    fieldStyle:'background-color: #ddd; background-image: none;',
			   	                    readOnly: true
		                       }, { fieldLabel: '합계금액',
	                               xtype : 'textfield',
	                               fieldStyle:'background-color: #ddd; background-image: none;',
	                               value : Ext.util.Format.number(total, '0,00/i') + ' ' + selections[0].get('cart_currency'),
	                               readOnly: true

	                             },
		                           { fieldLabel: '요약',
		                               xtype : 'textfield',
		                               name : 'item_abst',
		                               fieldStyle:'background-color: #ddd; background-image: none;',
		                               value : selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length-1, '0,00/i') + '건',
		                               readOnly: true

		                             },
		                       { fieldLabel: '주문번호',
			               	      xtype: 'textfield',
			               	      rows: 4,
			               	      anchor: '100%',
			               	      name: 'po_no',
			               	      value : po_no
		                       },
		                       { fieldLabel: '납품장소',
			               	      xtype: 'textfield',
			               	      rows: 4,
			               	      anchor: '100%',
			               	      name: 'reserved_varchar1',
			               	      value : '사내'
		                       },
		                       
		                       { fieldLabel: '요청사항',
			               	      xtype: 'textarea',
			               	      rows: 4,
			               	      anchor: '100%',
			               	      name: 'reserved_varchar2',
			               	      
		                       },{
			     		            		fieldLabel: '결제 조건',
			    			            		xtype: 'combo',    
			    			            		anchor: '100%',
			    			            		name: 'pay_condition',
			    			            		store: gm.me().payConditionStore,
			    			            		displayField:   'codeName',
			    			            		valueField: 'codeName',
			    			            		emptyText: '선택',
			    			            		allowBlank: true,
			    			            	    typeAhead: false,
			    			            	    minChars: 1,
			    			            		listConfig:{
			    			            			loadingText: '검색중...',
			    			            	        emptyText: '일치하는 항목 없음.',
			    			            	      	getInnerTpl: function(){
			    			            	      		return '<div data-qtip="{systemCode}">{codeName}</div>';
			    			            	      	}
			    			            		},
			    			            		listeners: {
			    			            	           select: function (combo, record) {
			    			            	           }
			    			            	      }		
			    			            		
			    			            		
			    			            		
			    			      },  new Ext.form.Hidden({
					        	            name: 'unique_uids',
					        	            value: cartmapUids
				        		        }),  new Ext.form.Hidden({
					        	            name: 'coord_key1',
					        	            value: selections[0].get('coord_key1')
				        		        }),  new Ext.form.Hidden({
					        	            name: 'coord_key3',
					        	            value: selections[0].get('coord_key3')
				        		        }),  new Ext.form.Hidden({
					        	            name: 'ac_uid',
					        	            value: selections[0].get('ac_uid')
				        		        }),  new Ext.form.Hidden({
					        	            name: 'req_date',
					        	            value: selections[0].get('req_date')
				        		        }),  new Ext.form.Hidden({
					        	            name: 'sales_price',
					        	            value: total
				        		        })
			                             
			    			            
		                 
		                      
		                   ]
		   	            }]
		   		 })
		   		var myHeight = 420;
		   		var	myWidth = 420;

		   		var prWin =  Ext.create('Ext.Window', {
					modal : true,
			        title: '주문 작성',
			        width: myWidth,
			        height: myHeight,	
			        plain:true,
			        items: form,
			        buttons: [{
			            text: CMD_OK,
			        	handler: function(btn){
			        		
	                    	if(btn == "no"){
	                    		prWin.close();
	                    	}else{
			        		
		                    	if(form.isValid()){	
		                        	var val = form.getValues(false);
		                        	
		                        	console_logs('val', val);
		                        	form.submit({
		                    			url : CONTEXT_PATH + '/purchase/request.do?method=createheavycontract',
		                    			params: val,
		                    			success: function(val, action){
		                    				prWin.close();
		                    				gm.me().store.load(function(){});
		                    			},
		                    			failure: function(val, action){
		                    				
		                    				 prWin.close();
		                    				 gm.me().store.load(function(){});
		                    				 
		                    			}
		                    		})
	                        	}  // end of formvalid 
	                    	}//else
			        	}
			        }]
		       	});
		   		prWin.show();
		     }

    	}
 	   
    },
    treatInPo: function() {
    	
       	var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        	
        	var next = gUtil.getNextday(0);
        	 
        	var request_date = gm.me().request_date;
        	var pj_name = gm.me().vSELECTED_pj_name;
        	var stock_qty_useful = gm.me().vSELECTED_STOCK_USEFUL;
        	
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
        		var msg = '발주하시겠습니까?';
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
                    	var po_user_uid = gm.me().vSELECTED_po_user_uid;
                    	var srcahdArr =[];
                    	var cartmapArr =[];
                    	var nameArr =[];
                    	var priceArr =[];
                    	var curArr =[];
                    	var quanArr =[];
                    	var coordArr =[];
                    	var selections = gm.me().grid.getSelectionModel().getSelection();
                    	for(var i=0; i< selections.length; i++) {
                    		var rec = selections[i];
                    		
                    		var uid = rec.get('id');
                    		var srcahd_uid = rec.get('unique_id');
                    		var coord_key3 = rec.get('coord_key3');
                    		var currency = rec.get('cart_currency');
                    		var item_name = rec.get('item_name');
                    		var static_sales_price = rec.get('static_sales_price');
                    		var request_info = rec.get('request_info');
                    		var quan = rec.get('quan');
                    		quanArr.push(quan);
                    		cartmapArr.push(uid);
                    		srcahdArr.push(srcahd_uid);
                    		curArr.push(currency);
                    		priceArr.push(static_sales_price);
                    		nameArr.push(item_name);
                    		coordArr.push(coord_key3);
                    		
                    	}
                    	var mycart_quan = rec.get('mycart_quan');
                    	var static_sales_price = rec.get('static_sales_price'); //cartmap.sales_price
                    	
                    	if(form.isValid()){	
                    	var val = form.getValues(false);
                    	
                    	console_logs('val', val);
                    	form.submit({
                			url : CONTEXT_PATH + '/purchase/request.do?method=createheavy',
                			params:{
                				sancType:'YES',
                				reserved_varchar2:reserved_varchar2,
                				reserved_varchar1:reserved_varchar1,
                				supplier_information:supplier_information,
                				cartmaparr: cartmapArr,
                				srcahdarr: srcahdArr,
                				quans: quanArr,
                				currencies: curArr,
                				names:nameArr,
                				coord_key3s:coordArr,
                				sales_prices:priceArr
                			},
                			success: function(val, action){
                				prWin.close();
                				Ext.Msg.alert('안내', '발주 완료 되었습니다.', function() {});
                				gm.me().store.load(function(){});
                				
                				//this.store.load();
                				//gm.me().store.load();
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
    
    editRedord: function(field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        switch (field) {
	        case 'quan':
	        case 'static_sales_price':
	        case 'req_date':
	        case 'cart_currency':
                this.updateDesinComment(rec);
                break;
        }
    },
    updateDesinComment: function(rec) {
    	
    	var child = rec.get('child');
    	console_logs('child>>>', child);
        var quan = rec.get('quan');
        var static_sales_price = rec.get('static_sales_price');
        var req_date = rec.get('req_date');
        var cart_currency = rec.get('cart_currency');
        var unique_id = rec.get('unique_uid');
        console_logs('====> unique_id', unique_id);
        
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updateCreatePo',
            params: {
            	quan: quan,
            	child:child,
                static_sales_price: static_sales_price,
                cart_currency:cart_currency,
                req_date: req_date,
                unique_id: unique_id
            },
            success: function(result, request) {

                var result = result.responseText;
                //console_logs("", result);

            },
            failure: extjsUtil.failureMessage
        });
    },
    
    
	calcAge :function(quan,sales_price) {
	return quan*sales_price;
	

	},
	getPrice:function(total_price){
		console_logs('total_price++++++++', total_price);
		var uniqueId = gm.me().vSELECTED_PJ_UID;
		Ext.Ajax.request({
    		url : CONTEXT_PATH + '/purchase/request.do?method=updatePrice',
			params:{
				cartmapUids: this.cartmap_uids,
				total_price: total_price
			},
			
			success : function(result, request) { 
				gm.me().store.load();
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
		 
		checkEqualPjNames: function(rec){
			console_logs('rec+++++++++++++in check'+rec);
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
                        		var po_user_uid = gm.me().vSELECTED_po_user_uid;
                            	var srcahdArr =[];
                            	var cartmapArr =[];
                            	var nameArr =[];
                            	var priceArr =[];
                            	var curArr =[];
                            	var quanArr =[];
                            	var coordArr =[];
                            	var selections = gm.me().grid.getSelectionModel().getSelection();
                            	for(var i=0; i< selections.length; i++) {
                            		var rec = selections[i];
                            		
                            		var uid = rec.get('id');
                            		var srcahd_uid = rec.get('unique_id');
                            		var coord_key3 = rec.get('coord_key3');
                            		var currency = rec.get('cart_currency');
                            		var item_name = rec.get('item_name');
                            		var static_sales_price = rec.get('static_sales_price');
                            		var request_info = rec.get('request_info');
                            		var quan = rec.get('quan');
                            		quanArr.push(quan);
                            		cartmapArr.push(uid);
                            		srcahdArr.push(srcahd_uid);
                            		curArr.push(currency);
                            		priceArr.push(static_sales_price);
                            		nameArr.push(item_name);
                            		coordArr.push(coord_key3);
                            		
                            	}
                            	var pj_name = rec.get('pj_name');
                            	var static_sales_price = rec.get('static_sales_price'); //cartmap.sales_price
                        	
                        	if(form.isValid()){	
                        	var val = form.getValues(false);
                        	
                        	console_logs('val', val);
                        	                    	
                        	form.submit({
                    			url : CONTEXT_PATH + '/purchase/request.do?method=createGo',
                    			params:{
                    				sancType : 'YES',
                    				reserved_varchar2:reserved_varchar2,
                    				reserved_varchar1:reserved_varchar1,
                    				item_name:item_name,
                    				cartmaparr: cartmapArr,
                    				srcahdarr: srcahdArr,
                    				quans: quanArr,
                    				currencies: curArr,
                    				names:nameArr,
                    				coord_key3s:coordArr,
                    				sales_prices:priceArr,
                    				pj_name:pj_name,
                    				mp_status:'GR'
                    			},
                    			success: function(val, action){
                    				prWin.close();
                    				Ext.Msg.alert('안내', '발주 완료 되었습니다.', function() {});
                    				gm.me().store.load(function(){});
                    				
                    				//this.store.load();
                    				//gm.me().store.load();
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
        
        payConditionStore : Ext.create('Mplm.store.PayConditionStore', {hasNull:false} )
//		,
//        //Page toolbar 사용
//        usePagingToolbar: false,
//        //goto page
//        useGotoToolbar: true,
//        //FullPage Buffering
//        bufferingStore: true
});
