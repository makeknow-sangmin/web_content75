Ext.define('Rfx2.view.company.dsmaref.purStock.HEAVY4_WearingWaitView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'wearing-wait-view',
    //items: [{html: 'Rfx.view.purStock.WearingWaitView'}]}
    initComponent: function(){
    	
    	//order by 에서 자동 테이블명 붙이기 켜기. 
    	this.orderbyAutoTable = true;
    	useMultitoolbar = true;
    	
    	//검색툴바 필드 초기화
        this.initSearchField();

        if(vCompanyReserved4 == 'DSMF01KR') {
                this.addSearchField({
                type: 'radio',
                field_id :'date_check',
                items: [
                    {
                        text :  '포함',
                        name : 'date_check',
                        value: 'N',
                        checked: true
                    },
                    {
                        text :  '미포함',
                        name : 'date_check',
                        value: 'Y'
                    }
                ]
            });
        }
        
        Ext.each(this.columns, function(columnObj, index) {
        var dataIndex = columnObj["dataIndex"];
		// console_logs('===columnObj', columnObj);
		var qty = 0;
		switch (dataIndex) {
            case 'sales_price':
            case 'curGr_qty':
            case 'sales_amount': 
                columnObj["css"] = 'edit-cell';
                columnObj["editor"] = {
                    xtype : 'numberfield'
                };
                columnObj["renderer"] = function(value, meta) {
                    console_logs('===dataIndex', dataIndex);
                    meta.css = 'custom-column';
                    value = Math.floor(value);
                    return value;
                }
            break;
            case 'req_info':
                columnObj["css"] = 'edit-cell';
                columnObj["editor"] = {
                    xtype : 'textfield'
                };
                columnObj["renderer"] = function(value, meta) {
                    meta.css = 'custom-column';
                    return value;
                }
            break;
            default:
            break;
		}
    });

                    
    	        // this.addSearchField({
                //     type : 'checkbox',
                //     id:'check',
                //     name:'check',
                //     field_id: 'check',
                //     boxLabel : '여부',
                //     checked:true,
                //     items: function() {
                //         alert('a');
                //     },
                //     handler: function() {
                //         alert('a')
                //     }
                // });

                // this.addSearchField(
                //     {
                //         type: 'checkbox',
                //         field_id: 'podate_check',
                //         items: [
                //             {
                //                 // boxLabel:'예정일여부',
                //                 pressed:true
                //             }
                //         ]
                //     }
                // );
    	
        //검색툴바 추가
        		this.addSearchField ({
					type: 'dateRange',
					field_id: 'listpodate',
					text: "입고예정일",
					labelWidth: 70,
					sdate: new Date(),
					edate: Ext.Date.add(new Date(), Ext.Date.MONTH, 1)
                });	  
                
                var userStore = Ext.create('Mplm.store.UserStore');
                userStore.getProxy().setExtraParam('user_type', 'PUR');

        		switch(vCompanyReserved4){
        		case 'SKNH01KR':
                    this.addSearchField ('project_varchar3');
                    this.addSearchField ('po_no');
                    this.addSearchField ('barcode');
                    this.addSearchField('item_code');
                    this.addSearchField('item_name');
                    this.addSearchField ('specification');
                    break;
                case 'DSMF01KR':
                    this.addSearchField ('pj_name');
        			this.addSearchField ('po_no');
//        			this.addSearchField ('barcode');
                    this.addSearchField ('seller_name');
                    this.addSearchField ('specification');
                    this.addSearchField ('item_name');
                    this.addSearchField ('model_no');
                    this.addSearchField ('reserved_varcharb');
                    this.addSearchField ('po_creator_name');
					this.addSearchField({
					 field_id: 'wa_code'
					,store: 'ComCstStore'
					,displayField:   'division_name'
					,valueField:   'wa_code'
					,innerTpl	: '<div data-qtip="{wa_code}">{division_name}</div>'
                });
        		break;
				case 'KYNL01KR':
                    this.addSearchField({
                        type: 'condition',
                        width: 140,
                        sqlName: 'xpoast-abst-po-row-heavy',
                        tableName: 'src',
                        field_id: 'seller_name',
                        fieldName: 'seller_name',
                        params: {
                            delete_flag:'N',
                            po_type:'MN',
                            mp_status:'PO'

                        }
                    });
                    this.addSearchField({
                        type: 'condition',
                        width: 200,
                        sqlName: 'xpoast-abst-po-row-heavy',
                        tableName: 'src',
                        field_id: 'specification',
                        fieldName: 'specification',
                        params: {
                            delete_flag:'N',
                            po_type:'MN',
                            mp_status:'PO'

                        }
                    });
                    this.addSearchField({
                        type: 'condition',
                        width: 200,
                        sqlName: 'xpoast-abst-po-row-heavy',
                        tableName: 'src',
                        field_id: 'item_name',
                        fieldName: 'item_name',
                        params: {
                            delete_flag:'N',
                            po_type:'MN',
                            mp_status:'PO'

                        }
                    });
                    this.addSearchField({
                        type: 'condition',
                        width: 140,
                        sqlName: 'xpoast-abst-po-row-heavy',
                        tableName: 'src',
                        field_id: 'item_code',
                        fieldName: 'item_code',
                        params: {
                            delete_flag:'N',
                            po_type:'MN',
                            mp_status:'PO'

                        }
                    });
                    break;
        		default:
        			break;
        		}
        	/*	this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'project',
        			field_id: 'pj_code',     
        			fieldName: 'pj_code'
            	}); 
        		this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
        			field_id: 'seller_name',     
        			fieldName: 'seller_name'
            	}); 
        		this.addSearchField ({
                    type: 'distinct',
                    width: 140,
                    tableName: 'xpoast',
        			field_id: 'item_code',     
        			fieldName: 'item_code'
            	}); */
        		
//        		this.addSearchField('pj_code' );
//        		this.addSearchField('seller_name' );
//                this.addSearchField('wa_name' );
                switch(vCompanyReserved4){
                case 'DDNG01KR':
                this.addSearchField('product_name_dabp' );
                this.addSearchField('product_code' );
                break;
                default:
                break;
                }
//                this.addSearchField('item_code' );                
                
                
            	
    
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        if(vCompanyReserved4 == 'DSMF01KR') {
            gMain.pageSize = 500;
        }

        //모델 정의
        this.createStore('Rfx.model.Heavy4WearingWait', [{
	            property: 'po_no',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        ,{}
        	, ['xpoast-abst']
	        );

//        arr.push(dateToolbar);
//        arr.push(searchToolbar);
        
   	 //그리드 생성
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

        switch(vCompanyReserved4) {
            case 'SKNH01KR':
            case 'DSMF01KR':
                arr.push(this.buttonToolbar3);
                break;
            default:
                break;
        }

        var option = {
            listeners: {
                itemdblclick: this.attachFileView
            }
        };
        
        console_logs('=>push', arr);
        
        //grid 생성.
        this.createGridCore(arr, option);
        // this.createGrid(arr);


        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        

        
        //this.editAction.setText('입고확인' );
        
        
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
				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K1');
				 gMain.selPanel.store.load(function(){});
			 }
		});
        
        this.RsetPaperGrView = Ext.create('Ext.Action', {
         	 xtype : 'button',
   			 text: '원자재',
   			 tooltip: '원자재',
   			 //ctCls: 'x-toolbar-grey-btn',
   			 toggleGroup: 'poViewType',
   			 handler: function() {
   				 gMain.selPanel.poviewType = 'ROLL';
   				 gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
   				 gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
   				 gMain.selPanel.store.load(function(){});
   			 }
   		});
        this.SsetMroGrView = Ext.create('Ext.Action', {
        	 xtype : 'button',
  			 text: '소모품',
  			 tooltip: '소모품',
  			 //ctCls: 'x-toolbar-grey-btn',
  			 toggleGroup: 'poViewType',
  			 handler: function() {
  				 gMain.selPanel.poviewType = 'SHEET';
  				 gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
  				 gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K3');
  				 gMain.selPanel.store.load(function(){});
  			 }
  		});
        
        this.MsetMisGrView = Ext.create('Ext.Action', {
       	 xtype : 'button',
 			 text: '잡자재',
 			 tooltip: '잡자재',
 			 //ctCls: 'x-toolbar-grey-btn',
 			 toggleGroup: 'poViewType',
 			 handler: function() {
 				 gMain.selPanel.poviewType = 'SHEET';
 				 gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
 				 gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K2');
 				 gMain.selPanel.store.load(function(){});
 			 }
         });
            
         //합계금액 계산 변경 Action 생성
        this.massAmountAction = Ext.create('Ext.Action', {
            // iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '중량계산',
            tooltip: '중량계산',
            disabled: true,
            handler: function() {

                Ext.MessageBox.show({
                    title: '확인',
                    msg: '금액 계산식을 <br/>중량<예><br/>수량<아니오><br/> 로 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                        var selections = gm.me().grid.getSelectionModel().getSelection();
                        var unique_ids = [];
                        for(var i=0; i<selections.length; i++) {
                            var unique_id = selections[i].get('unique_id_long');
                            unique_ids.push(unique_id);
                        }

                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=updateAmountCtrflag',
                                params: {
                                    unique_ids:unique_ids,
                                    ctr_flag:'M',
                                    unit_code:'Kg'
                                },
                                success: function(result, request) {
                                    gm.me().showToast('결과', '합계금액 계산식이 총중량*단가 로 변경 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        } else {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=updateAmountCtrflag',
                                params: {
                                    unique_ids:unique_ids,
                                    ctr_flag:'N',
                                    unit_code:'EA'
                                },
                                success: function(result, request) {
                                    gm.me().showToast('결과', '합계금액 계산식이 수량*단가 로 변경 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                });
                
            } //handler end...

        });
        
        // remove the items
        (buttonToolbar.items).each( function(item,index,length){
         if(index==1||index==2||index==3||index==4||index==5) {
              buttonToolbar.items.remove(item);
         }
        });
        
        buttonToolbar.insert(5, '-');
        switch(vCompanyReserved4){
		case 'SKNH01KR':
			break;
		case 'KYNL01KR':

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

            //PO Type View Type
            this.setAllPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '전체',
                tooltip: '전체목록',
                pressed: true,
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'ALL';
                    gm.me().store.getProxy().setExtraParam('standard_flag', '');
                    gm.me().store.getProxy().setExtraParam('sp_code', '');
                    gm.me().store.load(function() {});

                }
            });

            buttonToolbar.insert(7, this.setSubMatView);
            buttonToolbar.insert(7, this.setSaMatView);

            buttonToolbar.insert(7, this.setPaintMatView);

            buttonToolbar.insert(7, this.setRawMatView);
            buttonToolbar.insert(7, this.setAllMatView);
			break;
		default:
			
		
        
        //버튼 추가.
        buttonToolbar.insert(5, '-');
        buttonToolbar.insert(5, this.MsetMisGrView);
        buttonToolbar.insert(5, this.SsetMroGrView);
        buttonToolbar.insert(5, this.setSubGrView);
        buttonToolbar.insert(5, this.RsetPaperGrView);
        buttonToolbar.insert(5, this.setAllGrView);
        buttonToolbar.insert(3, '-');
        break;
        }
        
        this.printBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '바코드 출력',
            tooltip: '바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gMain.selPanel.printBarcode();
            }
        });

        //입고 확인 Action 생성
        this.createGoAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '입고 확인',
			 tooltip: '입고 확인',
			 disabled: true,
			 handler: function() {
				 gMain.selPanel.treatPaperGoRoll();
				 /*var sp_code = gMain.selPanel.vSELECTED_SP_CODE;
				 
				 switch(gMain.selPanel.poviewType) {
				 case 'ALL':
					 gMain.selPanel.treatPaperGoRoll();
					 //alert("자재를 먼저 선택해 주세요");
					 break;
				 case 'ROLL':
					 gMain.selPanel.treatPaperGoRoll();
					 break;
				 default: 
				 	gMain.selPanel.treatPaperGoSheet();
				 }*/
				 
			 }//handler end...
			 
		});
        
        buttonToolbar.insert(1, '-');
        buttonToolbar.insert(1, this.createGoAction);
        buttonToolbar.insert(2, this.printBarcodeAction);
        // switch(vCompanyReserved4) {
        //     case 'DSMF01KR':
        // buttonToolbar.insert(2, this.divisionChangeAction);
        // buttonToolbar.insert(3, this.massAmountAction);
        //     break;
        // }
        

        this.callParent(arguments);

        this.grid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections == null || selections.length < 1) {
                    if(vCompanyReserved4 == 'DSMF01KR') {

                        var store = this.store;
                        var total_price_sum = 0;
                        var total_qty = 0;

                        console_logs('>>>>>>>>>********store', store.data);
                        for(var i=0; i<store.data.items.length; i++) {
                            var rec = store.data.items[i];
                            total_qty += rec.get('curGr_qty');
                            var ctr_flag = rec.get('ctr_flag');
                            total_price_sum += rec.get('sales_amount');
                            
                        }

                        gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
                    }
                    
                }
            }
        });

		//grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {

            if(vCompanyReserved4 == 'SKNH01KR' || vCompanyReserved4 == 'DSMF01KR') {
                var total_price_sum = 0;
                var total_qty = 0;


                for(var i = 0; i < selections.length; i++) {
                    var t_rec = selections[i];
                    if(vCompanyReserved4 == 'DSMF01KR') {
                        var ctr_flag = t_rec.get('ctr_flag');
                        total_price_sum += t_rec.get('sales_amount');
                    } else {
                        total_price_sum += t_rec.get('curGr_qty') * t_rec.get('sales_price');
                    }
                    
                    total_qty += t_rec.get('curGr_qty');
                }

                this.buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
            }

        	if (selections.length) {
	    	  this.cartmap_uids=[];
	    	  this.gr_qtys=[];
	    	  for(var i=0; i<selections.length; i++){
	    		  var rec1 = selections[i];
	    		  var uids = rec1.get('id');
	    		  var curGr_qty = rec1.get('curGr_qty');
	    		  this.cartmap_uids.push(uids);
	    		  this.gr_qtys.push(curGr_qty);
	    	  }//endoffor
	    	  console_logs('그리드온 uid', this.cartmap_uids);
	    	  console_logs('그리드온 curGr_qty', this.gr_qtys);

	    	  var rec = selections[0];
				//console_logs('rec', rec);
	    	  gMain.selPanel.cartmapuids=this.cartmap_uids;
	    	  gMain.selPanel.gr_qtys=this.gr_qtys;
	    	  console_logs('gMain.selPanel.cartmapuids>>>>>>>>>>>', gMain.selPanel.cartmapuids);
	    	  gMain.selPanel.cartmapuid = rec.get('id');
	    	  gMain.selPanel.gr_qty = rec.get('curGr_qty');
	    	  gMain.selPanel.item_name = rec.get('item_name');
	    	  gMain.selPanel.vSELECTED_description = rec.get('description');   // 평량
	    	  gMain.selPanel.vSELECTED_remark = rec.get('remark');    // 장
	    	  gMain.selPanel.vSELECTED_comment = rec.get('comment1');   // 폭
	    	  gMain.selPanel.vSELECTED_quan = rec.get('po_qty');
	    	  gMain.selPanel.vSELECTED_spcode = rec.get('sp_code');

	    	  console_logs('그리드 데이터', rec);
  
                  gMain.selPanel.createGoAction.enable();
                  gMain.selPanel.printBarcodeAction.enable();
                  
            } else {
              	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
                gMain.selPanel.createGoAction.disable();
                gMain.selPanel.printBarcodeAction.disable();
            }
          	
          });

          this.grid.on('edit', function(editor, e) {     

            var field = e.field;
            var gr_qty = gm.me().grid.getSelectionModel().getSelection()[0].get('curGr_qty');

            switch (field) {
                case 'curGr_qty':
                    if(gr_qty.length == 1) {
                        gr_qty = rec.get(field);
                    }
                    var selection = gm.me().grid.getSelectionModel().getSelection();
                    var rec = selection[0];
                    selection[0].set('curGr_qty', rec.get(field));
                    if(ctr_flag == 'M') {
                        selection[0].set('sales_amount', Math.floor(selection[0].get('sales_price') * selection[0].get('mass')));
                    } else {
                        selection[0].set('sales_amount', Math.floor(rec.get(field) * selection[0].get('sales_price')));
                    }
                    // selection[0].set('sales_amount', rec.get(field) * selection[0].get('sales_price'));
                    gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(rec.get(field) * selection[0].get('sales_price')) + ' / 총 수량 : ' + rec.get(field));
                    break;
                case 'sales_price':
                    if(gr_qty.length == 1) {
                        gr_qty = rec.get(field);
                    }
                    var selection = gm.me().grid.getSelectionModel().getSelection();
                    var rec = selection[0];
                    selection[0].set('sales_price', rec.get(field));
                    var ctr_flag = selection[0].get('ctr_flag');
                    if(ctr_flag == 'M') {
                        selection[0].set('sales_amount', Math.floor(rec.get(field) * selection[0].get('mass')));
                    } else {
                        selection[0].set('sales_amount', Math.floor(rec.get(field) * selection[0].get('curGr_qty')));
                    }
                    
                    gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(rec.get(field) * selection[0].get('curGr_qty')) + ' / 총 수량 : ' + rec.get('curGr_qty'));
                    break;
            }

	          var rec = e.record;
			  var request_qty = rec.get('request_qty');
              var sales_price = rec.get('sales_price');
              var po_no = rec.get('po_no');
              var item_name = rec.get('item_name');
              var unique_id = rec.get('unique_id_long');
              var pj_code = rec.get('pj_code');
            
              var unit_code = rec.get('unit_code');
              var sales_amount = rec.get('sales_amount');

              console_logs('==unit_code', unit_code);

            //   if(e['field'] == 'sales_amount' && unit_code != 'Kg') {
            //       Ext.MessageBox.alert('경고', '중량 관련 구매만 합계금액 수정이 가능합니다.');
            //       return;
            //   }

            //   if(e['field'] != 'sales_amount') {
            //       sales_amount = -1;
            //   }
                
              Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/prch.do?method=grWaitChange',
                params:{
                    sales_price:sales_price,
                    sales_amount:sales_amount,
                    unique_id:unique_id  // xpoast_uid
                },
                success : function(result, request) { 
                    //취소수량은 취소가능수량(주문가능수량)을 넘을 수 없다.
                    // gm.me().store.load(function() {});
                    gm.me().showToast('결과', po_no + '의 ' + item_name  + '의 단가 ' + sales_price + '으로 수정되었습니다.');
                        
                },//endofsuccess
                
            });//endofajax

			//   gm.me().showToast('결과', po_no + '의 ' + item_name  + '의 단가 ' + sales_price + '으로 수정되었습니다.');

			});
        
        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.load(function(records){
            if(vCompanyReserved4 == 'DSMF01KR') {
                console_logs('>>>>>>>>>********records', records);

                var total_price_sum = 0;
                var total_qty = 0;

                for(var i = 0; i < gm.me().store.data.items.length; i++) {
                    var t_rec = gm.me().store.data.items[i];
                    total_price_sum += t_rec.get('sales_amount');
                    total_qty += t_rec.get('curGr_qty');
                }

                gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
            }
        });

    },
    items : [],
    cartmap_uids : [],
    gr_qtys : [],
    poviewType: 'ALL',
    
    onRenderCell : function(value, metaData, record, rowIndex,colIndex, store, view){
    	   Ext.util.Format.number(1.23456,'0.000');
    	   return value;            
    },
    	
    treatPaperGoRoll: function() {
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
	            items: [{
					fieldLabel: '입고 의견',//ppo1_request,
				 	xtype: 'textarea',
					rows: 4,
					anchor: '100%',
					name: 'gr_reason',
					//value: '',
					emptyText: '입고의견을 입력해주세요'
				},
					{
						fieldLabel: '입고 날짜',
						xtype:'datefield',
						name:'gr_date',
                        format: 'Y-m-d',
						value: new Date()
                    }
                    // , {
                    //     xtype:'button',
                    //     text:'성적서 첨부',
                    //     name:'fileattach',
                    //     id:'fileattach',
                    //     hidden:(vCompanyReserved4 == 'DSMF01KR') ? false : true,
                    //     handler: function() {
                    //         gm.me().attachFile();
                    //     }
                    // }

				]//item end..
			
	        });//Panel end...
			prwin = gMain.selPanel.prwinopen(form);
    },
  
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
			title: '입고 확인',
			width: 400,
			height: (vCompanyReserved4 == 'DSMF01KR') ? 220 : 180,
			plain:true,
			items: form,
			buttons: [{
				text: CMD_OK,
				handler: function(btn){
                    btn.disable(true);

	            	var form = gu.getCmp('formPanel').getForm();
	            	var cartmapuids = gMain.selPanel.cartmap_uids;
                    // var gr_qtys = gMain.selPanel.gr_qtys;
                    var selections = gm.me().grid.getSelectionModel().getSelection();
                    var gr_qtys = [];
                    for(var i=0; i<selections.length; i++) {
                        gr_qtys.push(selections[i].get('curGr_qty'));
                    }
					var item_name = gMain.selPanel.item_name;
					var item_abst =  item_name + ' 外';
					var val = form.getValues(false);

                    var reserved_number2 = null;
                    var wa_code = null;
					var selections = gm.me().grid.getSelectionModel().getSelection();

					switch(vCompanyReserved4) {
						case 'DSMF01KR':
                            reserved_number2 = selections[0].get('reserved_number2');
                            wa_code = selections[0].get('wa_code');
						break;
					}

					console_logs('form', form);
                    prWin.setLoading(true);

					Ext.Ajax.request({
	        			url: CONTEXT_PATH + '/quality/wgrast.do?method=createGrMes',
						params:{
							cartmap_uids: cartmapuids,
							gr_qty : gr_qtys,
							item_abst : item_abst,
							gr_reason: val['gr_reason'],
                            gr_date : val['gr_date'],
                            reserved_number2: reserved_number2,
                            wa_code:wa_code
						},
	        			success: function(){
	        				gm.me().showToast('결과', item_name + ' 등' + gr_qtys.length + ' 건이 입고되었습니다.' );
	        				gm.me().getStore().load(function() { });
                            if(prWin) {
                                prWin.close();
                            }
	        			},
	        			failure: function(){
                            gm.me().showToast('결과', '입고실패' );
                            // console.log('>>>> item_name',item_name);
                            // console.log('>>>> cartmap_uid',cartmapuids);
                            // console.log('>>>> item_abst',item_abst);
                            // console.log('>>>> gr_reason',gr_reason);
                            // console.log('>>>> gr_date',gr_date);
                            // console.log('>>>> reserved_number2',reserved_number2);
                            // console.log('>>>> wa_code',wa_code);
                            prWin.setLoading(false);
                            if(prWin) {
                                prWin.close();
                            }
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

    // editRedord: function (field, rec) {
    //     console_logs('====> edited field', field);
    //     console_logs('====> edited record', rec);

    //     switch (field) {
    //         case 'curGr_qty':
    //             if(gm.me().gr_qtys.length == 1) {
    //                 gm.me().gr_qtys[0] = rec.get(field);
    //             }
    //             var selection = this.grid.getSelectionModel().getSelection();
    //             selection[0].set('curGr_qty', rec.get(field));
    //             selection[0].set('total_price', rec.get(field) * selection[0].get('sales_price'));
    //             this.buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(rec.get(field) * selection[0].get('sales_price')) + ' / 총 수량 : ' + rec.get(field));
    //             break;
    //         case 'sales_price':
    //             if(gm.me().gr_qtys.length == 1) {
    //                 gm.me().gr_qtys[0] = rec.get(field);
    //             }
    //             var selection = this.grid.getSelectionModel().getSelection();
    //             selection[0].set('sales_price', rec.get(field));
    //             selection[0].set('total_price', rec.get(field) * selection[0].get('curGr_qty'));
    //             this.buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(rec.get(field) * selection[0].get('curGr_qty')) + ' / 총 수량 : ' + rec.get('curGr_qty'));
    //             break;
    //     }
    // },

    buttonToolbar3 : Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        },{
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '총 금액 : 0 / 총 수량 : 0'
        }]
    }),

    attachFile: function() {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('==>zzz', record);

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        this.attachedFileStore.load(function(records) {
            if(records!=null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update( '총수량 : ' + records.length);
                }
                
            }
        });

        var selFilegrid =   Ext.create("Ext.selection.CheckboxModel", {} );
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부',
            store: this.attachedFileStore,
            collapsible: true,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype : 'button',
                        text : '파일 첨부',
                        scale: 'small',
                        glyph: 'xf0c6@FontAwesome',
                        scope : this.fileGrid,
                        handler : function() {


                            var url =  CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long') + '&change_reason=' + 'G';

                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader : 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions : {
                                    url : url
                                },
                                synchronous : true
                            });
                                var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                    dialogTitle : '파일 첨부',
                                    panel : uploadPanel
                                });

                                this.mon(uploadDialog, 'uploadcomplete', function(uploadPanel, manager, items, errorCount) {
                                	
                                	console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                	console_logs('this.mon uploadcomplete manager', manager);
                                	console_logs('this.mon uploadcomplete items', items);
                                	console_logs('this.mon uploadcomplete errorCount', errorCount);
                                	
                                	gm.me().uploadComplete(items);
                                    //if (!errorCount) {
                                        uploadDialog.close();
                                    //}
                                }, this);

                                uploadDialog.show();
                            }
                        },
                        this.removeActionFile, 
                        '-',
                        this.sendFileAction,
                        '->',
                        {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

            ],
            columns: [
            	{
                    text     : 'UID',
                    width     : 100,
                    sortable : true,
                    dataIndex: 'id'
                },
            	{
                    text     : '파일명',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'object_name'
                },
                {
                    text     : '파일유형',
                    width     : 70,
                    sortable : true,
                    dataIndex: 'file_ext'
                },
                {
                    text     : '날짜',
                    width     : 160,
                    sortable : true,
                    dataIndex: 'create_date'
                },
                {
                    text     : 'size',
                    width     : 100,
                    sortable : true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:right',
                    align: 'right',
                    dataIndex: 'file_size'
                }]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/' 첨부파일',
            width: 1300,
            height: 600,
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
                this.fileGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function() {
                    if(win) {win.close();}
                }
            }]
        });
	    win.show();
        
        
        // this.fileGrid.getSelectionModel().on({
	    // 	selectionchange: function(sm, selections) {

	    // 		if(selections!=null && selections.length>0) {
		//     		gm.me().removeActionFile.enable();
		//     		gm.me().sendFileAction.enable();
	    // 		} else {
	    // 			gm.me().removeActionFile.disable();
	    // 			gm.me().sendFileAction.disable();
	    // 		}

	    // 	}
        // });
    },
    
    attachedFileStore : Ext.create('Mplm.store.AttachedFileStore', {group_code: null} ),

    // editRedord: function(field, rec) {
    //     console_logs('====> edited field', field);
    //     console_logs('====> edited record', rec);

    //     var record = gm.me().grid.getSelectionModel().getSelection()[0];

    //    switch (field) {
    //        case 'reserved_varcharb':
    //            gm.editAjax('rtgast', 'reserved_varcharb', rec.data.reserved_varcharb, 'unique_id', record.data.po_group_uid, {type:''});
    //            gm.me().storeLoad();
    //            break;
    //        case 'sales_price':
    //        case 'curGr_qty':
    //             if(gm.me().gr_qtys.length == 1) {
    //                 gm.me().gr_qtys[0] = rec.get('curGr_qty');
    //             }
    //             var selection = this.grid.getSelectionModel().getSelection();
    //             selection[0].set('curGr_qty', rec.get('curGr_qty'));
    //             if(vCompanyReserved4 == 'DSMF01KR') {
    //                 selection[0].set('sales_amount', rec.get('curGr_qty') * selection[0].get('sales_price'));
    //                 gm.editRedord(field, rec);
    //             } else {
    //                 selection[0].set('total_price', rec.get('curGr_qty') * selection[0].get('sales_price'));
    //             }
                
    //             this.buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(rec.get('curGr_qty') * selection[0].get('sales_price')) + ' / 총 수량 : ' + rec.get('curGr_qty'));
    //        break;
    //        default:
    //        	gm.editRedord(field, rec);

    //    }


    // },

    uploadComplete : function(items) {
    	
    	console_logs('uploadComplete items', items);
    	
        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function(item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });
        
        console_logs('파일업로드 결과', output);
        
        this.attachedFileStore.load(function(records) {
            if(records!=null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update( '총수량 : ' + records.length);
                }
                
            }
        });
        
        
        
    },

    buttonToolbar3 : Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        },{
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '총 금액 : 0 / 총 수량 : 0'
        }]
    }),

    divisionChangeAction : Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '사업부 변경',
            tooltip: '사업부 변경',
            disabled: true,
            handler: function() {
                var selections = gm.me().grid.getSelectionModel().getSelection();

                var po_no = selections[0].get('po_no');

                var form = Ext.create('Ext.form.Panel', {
                        id: 'formDivision',
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
                            //labelWidth: 60,
                            //margins: 10,
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                id: 'po_no',
                                name: 'po_no',
                                value: po_no,
                                editable: false,
                                fieldLabel:'주문번호',
                                fieldStyle: 'background-color: #ddd; background-image: none;',
                                anchor:'100%',
                            }, {
                                xtype: 'combo',
                                fieldLabel:'사업부',
                                name:'wa_code',
                                id: 'wa_code',
                                anchor:'100%',
                                store: gm.me().comcstStore,
                                displayField: 'division_name',
                                valueField:'wa_code',
                                minChars : 1,
                                allowBlank: true,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function() {
                                        return '<div data-qtip="{wa_code}">{division_name}</div>';
                                    }
                                },
                            }
                        ]
                });

                var win = Ext.create('ModalWindow', {
                    title: '사업부 수정',
                    width: 400,
                    height: 250,
                    minWidth: 250,
                    minHeight: 180,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function(btn){
                            if(btn == 'no') {
                                win.close();
                            } else {
                                var po_no = Ext.getCmp('po_no').getValue();
                                var wa_code = Ext.getCmp('wa_code').getValue();
                                console_logs('==po_no', po_no);
                                console_logs('==wa_code', wa_code);
                                // return;
                                Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/prch.do?method=changeDivision',
                                params: {
                                    po_no: po_no,
                                    wa_code: wa_code
                                },
                                success: function(result, request) {
                                    gm.me().store.load();
                                    if(win) {
                                        win.close();
                                    }
                                }, // endofsuccess
                                failure: extjsUtil.failureMessage
                            }); // endofajax
                            }
                            
                        }
                    }, {
                            text: CMD_CANCEL,
                            handler: function(btn) {
                                win.close();
                            }
                        }]
                });
                win.show();
            }//handler end...
            
    }),

    attachFileView: function() {
        var fieldPohistory = [
            { name: 'account_code', type: "string" },
            { name: 'account_name', type: "string" },
            { name: 'po_no', type: "string" },
            { name: 'po_date', type: "string" },
            { name: 'seller_code', type: "string" },
            { name: 'seller_name', type: "string" },
            { name: 'sales_price', type: "string" },
            { name: 'pr_qty', type: "string" }
        ];



        var selections = gm.me().grid.getSelectionModel().getSelection();
        console_logs('===>attachFileView', selections);
        if(selections != null && selections.length > 0) {
            var unique_id_long = selections[0].get('coord_key3');

            gm.me().attachedFileStore.getProxy().setExtraParam('group_code', unique_id_long);
            gm.me().attachedFileStore.load(function(records) {

                console_logs('attachedFileStore records', records);
                if(records!=null) {
                    var o = gu.getCmp('file_quan');
                    if (o != null) {
                        o.update( '총수량 : ' + records.length);
                    }

                }
            });

            var selFilegrid =   Ext.create("Ext.selection.CheckboxModel", {} );

            var fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부',
            store: gm.me().attachedFileStore,
            collapsible: true,
            layout:'fit',
            multiSelect: true,
            selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                       {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

            ],
            columns: [
            	{
                    text     : 'UID',
                    width     : 100,
                    sortable : true,
                    dataIndex: 'id'
                },
            	{
                    text     : '파일명',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'object_name'
                },
                {
                    text     : '파일유형',
                    width     : 70,
                    sortable : true,
                    dataIndex: 'file_ext'
                },
                {
                    text     : '날짜',
                    width     : 160,
                    sortable : true,
                    dataIndex: 'create_date'
                },
                {
                    text     : 'size',
                    width     : 100,
                    sortable : true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:right',
                    align: 'right',
                    dataIndex: 'file_size'
                }]
        });

            var prWin =	Ext.create('Ext.Window', {
                modal : true,
                title: '첨부파일',
                width: 1200,
                height: 600,
                items: fileGrid,
                buttons: [
                    {text: CMD_OK,
                        //scope:this,
                        handler:function(){
                            if(prWin) {
                                prWin.close();
                            }
                        }
                    }
                ]
            })
            prWin.show();
        }
    },

    uploadComplete : function(items) {
    	
    	console_logs('uploadComplete items', items);
    	
        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function(item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });
        
        console_logs('파일업로드 결과', output);
        
        this.attachedFileStore.load(function(records) {
            if(records!=null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update( '총수량 : ' + records.length);
                }
                
            }
        });
        
        
        
    },

    attachFile: function() {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('==>zzz', record);

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        this.attachedFileStore.load(function(records) {
            if(records!=null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update( '총수량 : ' + records.length);
                }
                
            }
        });

        var selFilegrid =   Ext.create("Ext.selection.CheckboxModel", {} );
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부',
            store: this.attachedFileStore,
            collapsible: true,
            multiSelect: true,
            // hidden : ! this.useDocument,
            selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype : 'button',
                        text : '파일 첨부',
                        scale: 'small',
                        glyph: 'xf0c6@FontAwesome',
                        scope : this.fileGrid,
                        handler : function() {


                            var url =  CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long') + '&change_reason=' + 'G';

                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader : 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions : {
                                    url : url
                                },
                                synchronous : true
                            });
                                var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                    dialogTitle : '파일 첨부',
                                    panel : uploadPanel
                                });

                                this.mon(uploadDialog, 'uploadcomplete', function(uploadPanel, manager, items, errorCount) {
                                	
                                	console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                	console_logs('this.mon uploadcomplete manager', manager);
                                	console_logs('this.mon uploadcomplete items', items);
                                	console_logs('this.mon uploadcomplete errorCount', errorCount);
                                	
                                	gm.me().uploadComplete(items);
                                    //if (!errorCount) {
                                        uploadDialog.close();
                                    //}
                                }, this);

                                uploadDialog.show();
                            }
                        },
                        this.removeActionFile, 
                        '-',
                        this.sendFileAction,
                        '-',
                        this.fileRemoveAction,
                        '->',
                        {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

            ],
            columns: [
            	{
                    text     : 'UID',
                    width     : 100,
                    sortable : true,
                    dataIndex: 'id'
                },
            	{
                    text     : '파일명',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'object_name'
                },
                {
                    text     : '파일유형',
                    width     : 70,
                    sortable : true,
                    dataIndex: 'file_ext'
                },
                {
                    text     : '날짜',
                    width     : 160,
                    sortable : true,
                    dataIndex: 'create_date'
                },
                {
                    text     : 'size',
                    width     : 100,
                    sortable : true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:right',
                    align: 'right',
                    dataIndex: 'file_size'
                }]
        });

        this.fileGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections != null && selections.length > 0) {
                    gm.me().fileRemoveAction.enable();
                } else {
                    gm.me().fileRemoveAction.disable();
                }
            }
        })

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/' 첨부파일',
            width: 1300,
            height: 600,
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
                this.fileGrid
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

    fileRemoveAction: Ext.create('Ext.Action',{
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        disabled: true,
        handler: function(widget, event) {
            var selections = gm.me().fileGrid.getSelectionModel().getSelection();
            console_logs('===selections', selections);

            var srccst_uids = [];
            for(var i=0; i<selections.length; i++) {
                var rec = selections[i];
                srccst_uids.push(rec.get('unique_id'));
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/uploader.do?method=assyMatchFile',
                params:{
                    srcahd_uid:-1,
                    srccst_uids:srccst_uids,
                    type:'remove'
                },
                success: function(){
                    gm.me().showToast('결과', '성공' );
                    gm.me().attachedFileStore.load();
                },
                failure: function(){
                    gm.me().showToast('결과', '실패' );
                }
            });
        }
    }),

    printBarcode: function () {

        var form = null;

        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
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
            items: [
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
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '출력매수',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'print_qty',
                                    fieldLabel: '출력매수',
                                    margin: '0 5 0 0',
                                    width: 200,
                                    allowBlank: false,
                                    value: 1,
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

        var uniqueIdArr = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('pj_barcode');  //Srcahd unique_id
            uniqueIdArr.push(uid);
        }

        if (uniqueIdArr.length > 0) {
            prwin = gMain.selPanel.prbarcodeopen(form);
        }
    },

    prbarcodeopen: function (form) {

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 출력 매수',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                    var uniqueIdArr = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('uid_srcahd');  //Material unique_id
                        uniqueIdArr.push(uid);
                    }

                    var form = gu.getCmp('formPanel').getForm();

                    form.submit({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeSrcahd',
                        params: {
                            unique_ids: uniqueIdArr
                        },
                        success: function (val, action) {
                            prWin.close();
                            gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                            gMain.selPanel.store.load(function () {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            gMain.selPanel.store.load(function () {
                            });
                        }
                    });


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

    attachedFileStore : Ext.create('Mplm.store.AttachedFileStore', {group_code: null} ),

    comcstStore: Ext.create('Mplm.store.ComCstStore', {
        hasNull: false
    }),

    selCheckOnly: vCompanyReserved4 == 'SKNH01KR' ? true : false,
    selAllowDeselect: vCompanyReserved4 == 'SKNH01KR' ? false : true,
    nextRow: vCompanyReserved4 == 'DSMF01KR' ? true : false,
    
});
