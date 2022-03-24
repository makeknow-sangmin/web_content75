//출하 관리
Ext.define('Rfx2.view.company.dabp01kr.salesDelivery.ProductStockView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-mgmt-view',
    initComponent: function(){
    
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	/*
    	this.addSearchField (
    			{
    					field_id: 'exclusive_flag'
    					,store: 'CodeYnStore'
    					,displayField: 'codeName'
    					,valueField: 'systemCode'
    					,innerTpl	: '{codeName}'
    			});	
    switch(vCompanyReserved4){	
    case 'SHNH01KR' :
		this.addSearchField (
				{
					type: 'combo'
					,field_id: 'lot_no'
					,store: "RtgastPonoStore"
					,displayField: 'lot_no'
					,valueField: 'lot_no'
					,innerTpl	:'<div data-qtip="{lot_no}">{lot_no}</div>'
				});
		break;
		default : 
			break;
	}
    	
    	this.addSearchField('wa_name');
		this.addSearchField('specification');
		this.addSearchField('item_name');
		
		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
    	
    	*/
        switch(vCompanyReserved4){	
        case 'DABP01KR' :
        	this.addSearchField (
    				{
    					type: 'combo'
    					,field_id: 'user_name'
    					,store: 'UserDeptStoreOnly'
    					,params: {hasNull:true, dept_code: '02'}
    					,displayField:   'user_name'
    					,valueField:   'user_name'
    					,innerTpl	:'<div data-qtip="{user_name}">{user_name}</div>'
    				});
    		this.addSearchField('wa_name');
    		this.addSearchField('item_code');
    		this.addSearchField('name_spec');
    		
    		break;
    		default : 
    			break;
        }
    	
    	this.setDefValue('create_date', new Date());
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('change_date', next7);
    	
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

    	
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        
        if(vCompanyReserved4 == 'DABP01KR'){
        	this.editAction.setText('상세보기');
        }
        
        switch(vCompanyReserved4){
        	case "DABP01KR":
case "DJEP01KR":
			case "SHNH01KR":
		        (buttonToolbar.items).each(function(item,index,length){
		      	  if(index==1/*||index==2*/ ||index==3 ||index==4 ||index==5) {
		            	buttonToolbar.items.remove(item);
		      	  }
		        });
			break;
			case "KWLM01KR":
				(buttonToolbar.items).each(function(item,index,length){
		      	  if(index==1) {
		            	buttonToolbar.items.remove(item);
		      	  }
				});
			break;
	        default :
	        	
	        break;
        }


        if(vSYSTEM_TYPE_SUB == 'HEAVY4'){
        	var groupType = '';
        	switch(vCompanyReserved4){
        	 case "DDNG01KR":
        		 groupType = 'sgroup_item_code';
        		 break;
             case "SHNH01KR":
            	 groupType = 'po_no';
            	 break;
             case "DAEH01KR":
            	 break;
             case "HAEW01KR":
				 break;
			 case 'SWON01KR':
			  break;
             default :
            	 groupType = 'item_code';
             	 break;
        	}
	        this.createStoreSimple({
	    		modelClass: 'Rfx.model.ProductStock',
		        //pageSize: gMain.pageSize,
	    		pageSize : 500,
		        sorters: [{
		        	property: 'pcs_code',
		        	direction: 'asc'
		        }],
		        deleteClass: ['stoqty']
		    }, {
		    	//groupField: 'sgroup_item_code'
		    	groupField: groupType
		    });
        }else{
            //모델 정의
            this.createStore('Rfx.model.ProductStock', [{
    	            property: 'create_date',
    	            direction: 'DESC'
    	        }],
    	        gMain.pageSize,{
    	        	create_date: 'create_date'
    	        },{
    	        	groupField: 'po_no'	
    	        }
    	        
    	        );
		}

		this.store.getProxy().setExtraParam('standard_flag', 'A');
			
		this.setRowClass(function(record, index) {
        	
        	console_logs('>>>>record', record);
            var c = record.get('stock_pos');
            console_logs('>>>>c', c);
            if(c != null && c != undefined && c != '') {
				return 'green-row';
			}

        });
        
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
           
       this.setPrdView = Ext.create('Ext.Action', {
             	 xtype : 'button',
      			 text: '제작',
      			 tooltip: '제작',
      			//pressed: true,
      			 handler: function() {
      				gMain.selPanel.productviewType = 'PRD';
      				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'PRD');
      				gMain.selPanel.store.load(function(){});
      			 }
      		});
           
        this.setPntView = Ext.create('Ext.Action', {
             	 xtype : 'button',
      			 text: '도장',
      			 tooltip: '도장',
      			//pressed: true,
      			 handler: function() {
      				gMain.selPanel.productviewType = 'PNT';
      				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'PNT');
      				gMain.selPanel.store.load(function(){});
      			 }
      		});
        
        

   /*     
        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip:'납품서 출력',
            disabled: true,
            
            handler: function(widget, event) {
            	var rtgast_uid = gMain.selPanel.vSELECTED_UNIQUE_ID;
            	var po_no = gMain.selPanel.vSELECTED_PO_NO;
            	
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printDl',
            		params:{
            			rtgast_uid : rtgast_uid,
            			po_no : po_no,
            			pdfPrint : 'pdfPrint'
            		},
            		reader: {
            			pdfPath: 'pdfPath'
            		},
            		success : function(result, request) {
                	        var jsonData = Ext.JSON.decode(result.responseText);
                	        var pdfPath = jsonData.pdfPath;
                	        console_log(pdfPath);      	        
                	    	if(pdfPath.length > 0) {
                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                	    		top.location.href=url;	
                	    	}
            		},
            		failure: extjsUtil.failureMessage
            	});
            	
            	
            }
        });
        
        //버튼 추가.
        buttonToolbar.insert(6, this.printPDFAction);
        buttonToolbar.insert(6, '-');*/
        
        // 중공업에서 Rack 지정으로 사용
        if(vSYSTEM_TYPE_SUB == 'HEAVY4'){
        	switch(vCompanyReserved4){
       	 
            case "SHNH01KR":
	        	buttonToolbar.insert(3, '-');
	        	buttonToolbar.insert(3, this.setPntView);
	            buttonToolbar.insert(3, this.setPrdView);
	            buttonToolbar.insert(2, this.assignRackAction);
		        buttonToolbar.insert(2, '-');
	        	/*buttonToolbar.insert(7, this.setAllView);*/
	        
	        break;
            case 'HAEW01KR':
            	buttonToolbar.insert(6, this.assignRackAction);
            	buttonToolbar.insert(6, '-');
				break;
			case 'KWLM01KR':
				buttonToolbar.insert(5, this.addProductAction);
				buttonToolbar.insert(6, this.assignRackAction);
	       		// buttonToolbar.insert(7, this.printBarcodeAction);
	        	buttonToolbar.insert(6, '-');
				break;
			default :
	        	buttonToolbar.insert(6, this.assignRackAction);
	       		buttonToolbar.insert(7, this.printBarcodeAction);
	        	buttonToolbar.insert(6, '-');
	        break;
        	}
        	
        }
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
	        	/*groupHeaderTpl: '<div><font color=#003471>{name} :: </font></div>'*/
	       	//groupHeaderTpl: '<input type="checkbox" id={name}_gr_chk onClick="gMain.selPanel.groupSelect(this.id, this.checked);" />&nbsp;&nbsp;{name}',
        	//ftype: 'grouping',
        	//startCollapsed: false,
        	
        	//groupHeaderTpl: '<input type="checkbox"/>&nbsp;&nbsp;{name}' //,
        	groupHeaderTpl: '{name}' //,
	       	
	       	/*['<span class="gridHeaderCheckbox"><input class="group-checkbox" type="checkbox" role="checkbox" id={name}_gr_chk value=checked onClick="gMain.selPanel.groupSelect(this.id, this.checked);">&nbsp;&nbsp;{name}</span>', {
                checked: function(name) {
                	console_logs('checked');
                  //  return groupFeature.isExpanded(name) ? 'checked=true' : 'checked=false';
                    return groupFeature.onGroupClick ? checked=true : checked=false;
                }
            }],*/
            
//            onGroupClick: function(view, group, idx, foo, e) {
//            	//startCollapsed: false
//            	try{
//            		this.groupFeature.isExpanded();
//            	}catch(e){
//            		console_logs('e', e);
//            	}
//            	
//            	
//	       		//return groupHeaderTpl='<input type="checkbox"/>111';
//			   }
        
	       	
		}); 
        
		var option = {
				features: [groupingFeature],
				listeners: {
			        groupclick: function (view, node, group, e, eOpts) {
			        	console_logs('groupclick', gMain.selPanel.po_no_records);
			        	
			        	var arr = '';
			        	
			        	var chk = true;
			        	
			        	
			        	
			        	for(var i=0; i<gMain.selPanel.po_no_records.length ; i++){
			        		arr = gMain.selPanel.po_no_records[i];
			        		console_logs('arr', arr);
			        		if(arr == group){
			        			chk = false;
			        			break;
			        		}else{
			        			chk = true;
			        		}
			        	};
			        	
			        	gMain.selPanel.groupSelect(group, chk);
			        	
			        	view.features[0].expand(group);
			            
			        }
			    },
		};
        
      //grid 생성.
        //this.createGrid(searchToolbar, buttonToolbar);
		this.createGridCore(arr, option);
        
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
        		
            	/*[광림]
            	 * 영업,출하 > 완제품현황 > 제품 체크 > Pallet 지정 활성화 안됨 증상 원인
            	 * 404 , 405 줄
            	 */ 
     	 
//        		//console_logs('workListStore>>>>>>>>>>');
        	//this.workOrderGrid.getStore().getProxy().setExtraParam('item_code', gMain.selPanel.vSELECTED_ITEM_CODE);
        	//this.workOrderGrid.getStore().load();
            	
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
        switch(vCompanyReserved4){
      	 
        case "SHNH01KR":
        case "DDNG01KR":
        	this.store.getProxy().setExtraParam('sp_code', 'PRD');
        	break;
        default:
        	break;
        }
        
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
    
    prbarcodeopen: function(form) {

    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: '바코드 출력 매수',
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(){
        		
        		var productarr =[];
               	var requestqtys = [];
               	var stoqtyarr= [];
               	var bararr=[];
               	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
               	var counts = 0;
               	
               	for(var i=0; i< selections.length; i++) {
            		var rec = selections[i];
            		var uid =  rec.get('unique_id');  //Product unique_id
            		console_logs('==rec==', rec);
            		console_logs('==uid==', uid);
            		var stoqty_uid = rec.get('stoqty_uid');
//            		var qty = rec.get('request_qty');
//            		var stock_qty = rec.get('stock_qty');
            		var bar_spec = rec.get('specification');
            		//if(qty > 0) {
                		productarr.push(uid);
//                		requestqtys.push(qty);
                		stoqtyarr.push(stoqty_uid);
                		bararr.push(bar_spec);
            		//}
                }
        		
               	var form = gu.getCmp('formPanel').getForm();
               	var stoqtyarr =[];
               	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                  	for(var i=0; i< selections.length; i++) {
                    		var rec = selections[i];
                    		var uid =  rec.get('unique_id');  //STOQTY unique_id
                    		console_logs('==uid==', uid);
                    		stoqtyarr.push(uid);
                    	}
                  	
      					form.submit({
                             url : CONTEXT_PATH + '/sales/productStock.do?method=printBarcode',
                             params:{
                 				productUids: productarr,
//                    	 		requestQtys: requestqtys,
//                    	 		stoqtyUids: stoqtyarr,
                    	 		barcodes: bararr,
                             		   },
                                	success: function(val, action){
                                		prWin.close();
                                		Ext.Msg.alert('메시지', '바코드 출력 요청을 완료하였습니다.');
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
    
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: 'Pallet 지정',
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(){
               	var form = Ext.getCmp('formPanel').getForm();
               	var stoqtyarr =[];
               	var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                  	for(var i=0; i< selections.length; i++) {
                    		var rec = selections[i];
                    		var uid =  rec.get('unique_id');  //STOQTY unique_id
                    		stoqtyarr.push(uid);
                    	}
                  	
      					form.submit({
                             url : CONTEXT_PATH + '/sales/productStock.do?method=assignRackByPallet',
                             params:{
                            	 		stoqtyUids: stoqtyarr,
                             		   },
                                	success: function(val, action){
                                		prWin.close();
                                		gMain.selPanel.store.load(function(){});
                                	    	},
                               			failure: function(val, action){
                               				 prWin.close();
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
    
    groupSelect : function(id, checked) {
    	
    	var arr = id.split('_');
    	var chk = checked;
    	
    	var po_no = arr[0];
    	console_logs('unchk', chk);
    	
    	if(chk==true) {
    		gMain.selPanel.po_no_records.push(po_no);
    		for(var i=0; i<this.store.data.items.length; i++) {
    			var rec = this.store.data.items[i];
    			
    			var currec = rec.get('po_no');

    			if(po_no==rec.get('po_no')) {
    				gMain.selPanel.records.push(rec);
    				}
    			} //end for
    		
    		
    		this.grid.getSelectionModel().select(gMain.selPanel.records);	
    	
    		} else {
    			//gMain.selPanel.po_no_records = Ext.Array.difference(gMain.selPanel.po_no_records, po_no);
    			
    			gMain.selPanel.po_no_records.splice(gMain.selPanel.po_no_records.indexOf(po_no),1);
    			
    			var new_arr = [];
    			for(var i=0; i<this.store.data.items.length; i++) {
    				var rec = this.store.data.items[i];
    				if(po_no==rec.get('po_no')) {
    					
    					new_arr.push(rec);
    				}
    	 	
    		}
    			
    			
    		this.grid.getSelectionModel().deselect(new_arr);
    		
    		gMain.selPanel.records = Ext.Array.difference(gMain.selPanel.records, new_arr);
    		
    		this.grid.getSelectionModel().deselect(new_arr);	
    		
    		new_arr=[]; 
    		
    	}
    	
    		
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
		 //console_logs('workListStore>>>>>>>>>>');
//		gMain.selPanel.workListStore.getProxy().setExtraParam('item_code', gMain.selPanel.vSELECTED_ITEM_CODE);
//		 gMain.selPanel.workListStore.load();
		//console_logs('rtgastuid >>>>>>>>>>>>>>>', gMain.selPanel.vSELECTED_RTGAST_UID);
//		workListStore.load( function(records) {
//			console_log('작업리스트>>>>>>>>>>', records); 
//			if(records != undefined ) {
//
//                 for (var i=0; i<records.length; i++){ 
//	                	var obj = records[i];
//
//	                	var system_code = obj.get('systemCode');
//	                	
//                   }
//			 }
//	    });
		
		//var workOrderGrid =null;
		
		
		// try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
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
        
        // var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
        //     down: function(e) {
        //         var selectionModel = this.workOrderGrid.getSelectionModel();
        //         var select = 0; // select first if no record is selected
        //         if ( selectionModel.hasSelection() ) {
        //             select = this.workOrderGrid.getSelectionModel().getSelection()[0].index + 1;
        //         }
        //         view.select(select);
               
        //     },
        //     up: function(e) {
        //         var selectionModel = this.workOrderGrid.getSelectionModel();
        //         var select = this.workOrderGrid.store.totalCount - 1; // select last element if no record is selected
        //         if ( selectionModel.hasSelection() ) {
        //             select = this.workOrderGrid.getSelectionModel().getSelection()[0].index - 1;
        //         }
        //         view.select(select);
             
        //     }
        // });
        
        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
        
        tabPanel.add(this.workOrderGrid);
	},

	addProduct: function() {
		gm.me().addSrcahdForm = Ext.create('Ext.form.Panel', {
			title: '제품등록',
			xtype:'form',
			width:500,
			height:500,
			bodyPadding:15,
			layout: {
				type:'vbox',
				align:'stretch'
			},
			default: {
				allowBlank: true,
				msgTarget:'side',
				labelWidth:60
			},
			items: [
				{
					id: gu.id('information'),
					fieldLabel: '종전자재',
					field_id:  'information',
					name: 'information',
					xtype: 'combo',
					emptyText: '코드나 규격으로 검색',
					store: gm.me().searchStore,
					displayField: 'specification',
					fieldStyle: 'background-color: #FBF8E6; background-image: none;',
					sortInfo: {
						field: 'specification',
						direction: 'ASC'
					},
					minChars: 1,
					typeAhead: false,
					hideLabel: true,
					hideTrigger: true,
					anchor: '100%',

					listConfig: {
						loadingText: '검색중...',
						emptyText: '일치하는 결과가 없습니다.',

						// Custom rendering template for each item
						getInnerTpl: function() {
							return '<div onclick="gm.me().setBomData({id});" ><a class="search-item" href="javascript:gm.me().setBomData({id});">' +
								'<font color=#999><small>{item_code}</small></font> <font color=#999>{item_name}</font><br />{specification_query} <font color=#999><small>{maker_name}</small></font>' +
								'</a></div>';
						}
					},
					pageSize: 10
				}, {
					xtype: 'textfield',
					fieldLabel: gm.me().getColName('item_code'),
					id: gu.id('item_code'),
					name: 'item_code',
					allowBlank: true
				}, {
					xtype: 'textfield',
					fieldLabel: gm.me().getColName('item_name'),
					id: gu.id('item_name'),
					name: 'item_name',
					allowBlank: true
				}, {
					xtype: 'textfield',
					fieldLabel: gm.me().getColName('specification'),
					id: gu.id('specification'),
					name: 'specification',
					allowBlank: true
				}, {
					xtype: 'textfield',
					fieldLabel: gm.me().getColName('wh_qty'),
					id: gu.id('wh_qty'),
					name: 'wh_qty',
					allowBlank: true
				},{
					id: gu.id('pj_info'),
					fieldLabel: '호선',
					field_id:  'pj_info',
					name: 'pj_info',
					xtype: 'combo',
					emptyText: '호선으로 검색',
					store: gm.me().projectStore,
					displayField: 'specification',
					fieldStyle: 'background-color: #FBF8E6; background-image: none;',
					sortInfo: {
						field: 'specification',
						direction: 'ASC'
					},
					minChars: 1,
					anchor: '100%',

					listConfig: {
						loadingText: '검색중...',
						emptyText: '일치하는 결과가 없습니다.',

						// Custom rendering template for each item
						getInnerTpl: function() {
							return '<div onclick="gm.me().setBomData({id});" ><a class="search-item" href="javascript:gm.me().setBomData({id});">' +
								'<font color=#999><small>{pj_name}</small></font> <font color=#999>{pj_name}</font><br /></font>' +
								'</a></div>';
						}
					},
					pageSize: 10
				}
			]
		});

		var winForm = Ext.create('ModalWindow', {
			title: '신규등록',
			width: 500,
			height: 500,
			minWidth: 250,
			minHeight: 180,
			items:
				[{
					region: 'center',
					xtype: 'tabpanel',
					items: gm.me().addSrcahdForm
				}],
			buttons: [{
				text: CMD_OK,
				handler: function() {
					// var form = gm.me().createPartForm;
					// if (form.isValid()) {
					// 	var val = form.getValues(false);
					// 	console_logs('form val', val);

					// 	gm.me().registPartFc(val);

					// 	if (winPart) {
					// 		winPart.close();
					// 	}
					// } else {
					// 	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
					// }

				}
			}, {
				text: CMD_CANCEL,
				handler: function() {
					if (winForm) {
						winForm.close();
					}
				}
			}]
		});
		winForm.show( /* this, function(){} */ );
	},

	setBomData: function(id) {

        gm.me().addSrcahdForm.setLoading(true);


        console_logs('setBomData id=', id);
        //        this.modRegAction.enable();
        //        this.resetPartForm();


        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=read',
            params: {
                id: id

            },
            success: function(result, request) {

                var jsonData = Ext.decode(result.responseText);
                // console_logs('jsonData', jsonData);
                var records = jsonData.datas;
                // console_logs('records', records);
                // console_logs('records[0]', records[0]);
                gm.me().setPartFormObj(records[0]);

                gm.me().addSrcahdForm.setLoading(false);
            },
            failure: extjsUtil.failureMessage
        });

	},

	setPartFormObj: function(o) {
		console_logs('setPartFormObj o', o);

		// gu.getCmp('unique_id').setValue(o['unique_id_long']);
		gu.getCmp('item_code').setValue(o['item_code']);
        gu.getCmp('item_name').setValue(o['item_name']);
        gu.getCmp('specification').setValue(o['specification']);
	},
	
    searchStore : Ext.create('Mplm.store.MaterialSearchStore', {

	}),
	
	projectStore: Ext.create('Mplm.store.ProjectStore', {

	})
});
