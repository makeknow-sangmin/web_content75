//출하 관리
Ext.define('Rfx.view.salesDelivery.ProductStockScanaView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'product-stock-skn-view',
    initComponent: function(){
    
    	//검색툴바 필드 초기화
    	this.initSearchField();
        
    	
    	this.setDefValue('create_date', new Date());
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('change_date', next7);
    	
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

    	
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        

        //모델 정의
        this.createStore('Rfx.model.ProductStock', [{
            property: 'create_date',
            direction: 'DESC'
        }],
        gMain.pageSize,{
            create_date: 'create_date'
        },['stoqty']
        
        );
        
        this.assignRackAction = Ext.create('Ext.Action',{
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: 'Pallet 지정',
            tooltip: 'Pallet 지정',
            disabled: true,
            handler: function() {
                gm.selPanel.assignRack();
            }
		});
		
		this.addProductAction = Ext.create('Ext.Action',{
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '신규등록',
            tooltip: '신규등록',
            disabled: true,
            handler: function() {
                gm.selPanel.addProduct();
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
        
        this.setAllView = Ext.create('Ext.Action', {
          	 xtype : 'button',
   			 text: '전체',
   			 tooltip: '전체',
   			 handler: function() {
   				gMain.selPanel.productviewType = 'ALL';
   				gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
   				gMain.selPanel.store.load(function(){});
   			 }
   		});
        
        

        
        //버튼 추가.
        //buttonToolbar.insert(6, this.printPDFAction);
        //buttonToolbar.insert(6, '-');
        buttonToolbar.insert(6, this.assignRackAction);
	       		buttonToolbar.insert(7, this.printBarcodeAction);
	        	buttonToolbar.insert(6, '-');
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
      //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);
		//this.createGridCore(arr, option);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        
        
        switch(vCompanyReserved4){
        case 'DABP01KR':
        this.addTabworkOrderGridPanel('상세보기', 'SPS1_SUB', {  
			pageSize: 100,
			//model: 'Rfx.model.HEAVY4WorkOrder',
			model: 'Rfx.store.DeliveryListStore',
	        dockedItems: [
		     
		        {
		            dock: 'top',
		            xtype: 'toolbar',                                                                                                                                                                                                                                                                                                                                                    
		            cls: 'my-x-toolbar-default3',
		            items: [
		                    		                    ]
			        }
		        ],
				sorters: [{
		           property: 'unique_id',
		           direction: 'ASC'
		       }]
		}, 
		function(selections) {
            if (selections.length) {
            	var rec = selections[0];
            	console_logs('정보 >>>>>>>>>>>>>', rec);
            	gMain.selPanel.selectPcsRecord = rec;
            	gMain.selPanel.selectSpecification = rec.get('specification');
            	gMain.selPanel.parent = rec.get('parent');
            	
            } else {
            	
            }
        },
        'workOrderGrid'//toolbar
	);
        break;
  }

		this.callParent(arguments);
		
		this.addProductAction.enable();
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	var rec = selections[0];
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //stoqty_uid
            	gMain.selPanel.vSELECTED_PO_NO = rec.get('po_no'); //stoqty_uid
            	var stock_pos = rec.get('stock_pos'); //stoqty_uid
            	console_logs('stock_pos', stock_pos);
            	gMain.selPanel.vSELECTED_ITEM_CODE= rec.get('item_code');
        		
            	
            	if(stock_pos != null && stock_pos.length > 0){
            		gMain.selPanel.printBarcodeAction.disable();
//            		gMain.selPanel.assignRackAction.disable();
					gMain.selPanel.assignRackAction.enable();
            	}else{
					gMain.selPanel.assignRackAction.enable();
            		gMain.selPanel.printBarcodeAction.enable();
            	}
            	
            	//gMain.selPanel.printPDFAction.enable();
            
            	
            } else {
            	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
            	gMain.selPanel.vSELECTED_PO_NO = '';
            	gMain.selPanel.assignRackAction.disable();
            	//gMain.selPanel.reReceiveAction.disable();
            	//gMain.selPanel.printPDFAction.disable();
            }
        	
        });

        //디폴트 로드
      
        gMain.setCenterLoading(false);
                
        this.store.load(function(records){
        	
        });

    },
    items : [],
    productviewType : "ALL",
    potype : 'PRD',
    records : [],
    cnt : 0,
    po_no_records : [],
    
    assignRack: function(){
    	var form = null;
		var selection = gm.me().grid.getSelectionModel().getSelection()[0];
		var po_no = selection.get('po_no');
		// if(po_no != null || po_no != undefined || po_no != '') {
		// 	Ext.MessageBox.alert('알림', '이미 Pallet가 등록된 제품입니다.');
		// 	return;
		// }
		 form = Ext.create('Ext.form.Panel', {
	    		id: 'formPanel',
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
	                           fieldLabel: 'PALLET 명',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true,
	                           },
	                           items: [
	                               {
	                                   xtype     : 'textfield',
	                                   id : 'stock_pos',
	                                   name      : 'stock_pos',
	                                   fieldLabel: 'PALLET 명',
	                                   margin: '0 5 0 0',
	                                   width: 200,
	                                   allowBlank: false,
	                                   maxlength: '1',
//	                                   emptyText: '영문대문자와 숫자만 입력',
//	                                   validator: function(v) {
//	                                       if (/[^A-Z0-9_-]/g.test(v)) {
//	                                    	   v = v.replace(/[^A-Z0-9_-]/g,'');
//	                                       }
//	                                       this.setValue(v);
//	                                       return true;
//	                                   }  // end of validator
	                               }  // end of xtype
	                           ]  // end of itmes
	                       }  // end of fieldcontainer
	                    ]
	            }
	                   ]
			
	                    });//Panel end...

				prwin = gMain.selPanel.prwinopen(form);
		
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
	                                   id : 'print_qty',
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
       	
       	var productarr =[];
       	
       	for(var i=0; i< selections.length; i++) {
       		var rec = selections[i];
       		var uid =  rec.get('unique_id');  //Product unique_id
    		var qty = rec.get('request_qty');
    		var stock_qty = rec.get('stock_qty');
    		if(qty > stock_qty) counts++;
    		/*if(qty > 0) */productarr.push(uid);
        }
       	
       	if/*(counts > 0) {
       		Ext.Msg.alert('경고', '현재 폐기 가능한 수량보다 폐기 처리 수량이 더 많은 제품이 있습니다.');
       	} else if*/(productarr.length > 0) {
    		prwin = gMain.selPanel.prbarcodeopen(form);       	
       	} /*else {
       		Ext.Msg.alert('경고', '폐기 처리 할 제품의 수량이 0 입니다.');
       	}*/
    },
    
    addTabworkOrderGridPanel: function(title, menuCode, arg, fc, id) {

		gMain.extFieldColumnStore.load({
		    params: { 	menuCode: menuCode  },
		    callback: function(records, operation, success) {
		    	console_logs('records>>>>>>>>>>', records);
		    	if(success ==true) {
		    		this.callBackWorkList(title, records, arg, fc, id);
		    	} else {//endof if(success..
					Ext.MessageBox.show({
			            title: '연결 종료',
			            msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
			            buttons: Ext.MessageBox.OK,
			            //animateTarget: btn,
			            scope: this,
			            icon: Ext.MessageBox['ERROR'],
			            fn: function() {

			            }
			        });
		    	}
		    },
		    scope: this
		});	
        	
    },
    
    
	callBackWorkList: function(title, records, arg, fc, id) {
		var gridId = id== null? this.getGridId() : id;
		
		var o = gMain.parseGridRecord(records, gridId);		
		var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];
		
		var modelClass = arg['model'];
		var pageSize = arg['pageSize'];
		var sorters = arg['sorters'];
		var dockedItems = arg['dockedItems'];

		
		
		var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
		//console_logs('cellEditing>>>>>>>>>>', cellEditing); 
		gMain.selPanel.workListStore = Ext.create('Rfx.store.DeliveryListStore');
		 		
		try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
		this.workOrderGrid = Ext.create('Ext.grid.Panel', {
        	//id: gridId,
            store: this.workListStore,
            //store: store,
            title: title,
        	cls : 'rfx-panel',
        	border: true,
        	resizable: true,
        	scroll: true,
        	multiSelect: true,
            collapsible: false,
            layout          :'fit',
//            forceFit: true,
            dockedItems: dockedItems,
            plugins: [cellEditing],
        	listeners: {
        		 itemcontextmenu: function(view, rec, node, index, e) {
	                    e.stopEvent();
	                    contextMenu.showAt(e.getXY());
	                    return false;
	                },
	                select: function(selModel, record, index, options){
	                    
	                },
        	     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        	    	 
        	    	 gMain.selPanel.downListRecord(record);
        	     }, //endof itemdblclick
        	     cellkeydown:function (workOrderGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        	    	 console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

 	                if (e.getKey() == Ext.EventObject.ENTER) { 
 	                
 	                }


 	            }
        	},//endof listeners
            columns: columns
        });
		this.workOrderGrid.getSelectionModel().on({
        	selectionchange: function(sm, selections) {
        		fc(selections);
        	}
        });
        var view = this.workOrderGrid.getView();
        
        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function(e) {
                var selectionModel = this.workOrderGrid.getSelectionModel();
                var select = 0; // select first if no record is selected
                if ( selectionModel.hasSelection() ) {
                    select = this.workOrderGrid.getSelectionModel().getSelection()[0].index + 1;
                }
                view.select(select);
               
            },
            up: function(e) {
                var selectionModel = this.workOrderGrid.getSelectionModel();
                var select = this.workOrderGrid.store.totalCount - 1; // select last element if no record is selected
                if ( selectionModel.hasSelection() ) {
                    select = this.workOrderGrid.getSelectionModel().getSelection()[0].index - 1;
                }
                view.select(select);
             
            }
        });
        
        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
        
        tabPanel.add(this.workOrderGrid);
	},

});
