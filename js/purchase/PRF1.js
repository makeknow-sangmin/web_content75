var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});
//global var.
var grid = null;
var receiverGrid = null;
var store = null;
var supastStore = null;
var togIsNew = true;

var payCondition = ''; //결재조건
var delivertAddress = ''; //견적조건

var netDay15;
var netDay5;
Ext.define('SupAst', {
    extend: 'Ext.data.Model',
    fields:  vCENTER_FIELDS_SUB
});

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

var prWin = null;
var selModelSup = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

var selectedPjUid = -1;

var addAction = Ext.create('Ext.Action', {
	itemId: 'createButton',	
	iconCls:'add',
    text: '견적업체지정',
    disabled: true,
    handler: function(widget, event) {

    	var selections = grid.getSelectionModel().getSelection();
    	console_logs('selections', selections);
    	var po_user_uid = vCUR_USER_UID;
    	if(selections.length<1) {
    		Ext.MessageBox.alert('오류', '선택한 자재가 없습니다.');
    		return;
    	} else {
    	}
 
    	selectedPjUid = selections[0].get('ac_uid');
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/purchase/rfq.do?method=getRequestInfo',
    		params:{
    			po_user_uid: po_user_uid,
    			pj_uid: selectedPjUid
    		},
    		success : function(result, request) {
    			var o = Ext.JSON.decode(result.responseText);
    			
    			var requestInfo = o['purchaser'] + ", " + o['email'] + ", " + o['tel_no'] ;
    			var buyerInfo = '사업자번호:' + o['biz_no'] + ", 발주사: " + o['wa_name'] + ", 대표: " + o['president_name'] ;
    			delivertAddress = o['address_1'];
    			
    			console_logs('requestInfo', requestInfo);
    			var item_name = '';
    	    	var item_abst = '';
    	    	var cartmapUids = new Array();

    	    	var selections = grid.getSelectionModel().getSelection();
    	    	for(var i=0; i< selections.length; i++) {
    	    		var rec = selections[i];
    	    		if(i==0) {
    	    	    	item_name = rec.get('item_name');
    	    	    	var item_code = rec.get('item_code');
    	    	    	item_abst = item_code + ' 외' + (selections.length-1) + 'Pcs';
    	    		}
    	    		cartmapUids[i] = rec.get('unique_uid');
    	    	}
    	        // Column Model shortcut array
    	        var columns = vCENTER_COLUMN_SUB;
    	        var receiverStore = Ext.create('Ext.data.Store', {
    	            model: 'SupAst'
    	        });

    	        // create the destination Grid
    	        receiverGrid = Ext.create('Ext.grid.Panel', {
    	            viewConfig: {
    	                listeners: {
    	                }
    	            },
    	            selModel: selModelSup,
//    	            bodyStyle: 'border: red 1px dashed;',
    	            store            : receiverStore,
    	            columns          : columns,
    	            stripeRows       : true,
    	            //title            : pf1_to,
    	            margins          : '0 0 0 3',
    	            autoHeight: true,
    	            layout: 'fit',
    	           border: false
    	        });

    	    	receiverGrid.getSelectionModel().on({
    	    		selectionchange: function(sm, selections) {
    	    			if (selections.length) {
    	    				removeAction.enable();
    	    			} else {
    	    				removeAction.disable();
    	    			}
    	    		}
    	    	});
    	        
    	        var txt_name =null;
    	        if(selections.length-1<1) {
    	        	  txt_name = item_name;
    	        } else {
    	        	  txt_name = item_name + pf1_extra + ' ' + (selections.length-1) + pf1_pcs;
    	        }
    	        
    	      	var DeliveryAddressStore  = Ext.create('Mplm.store.DeliveryAddressStore', {hasNull: false} );
    	    	var form = Ext.create('Ext.form.Panel', {
    	    		id: 'formPanel',
    	    		xtype: 'form',
    	    		frame: false ,
    	    		border: false,
    	    		bodyPadding: 15,
    	    		region: 'center',
    	         flex:1,
    	          fieldDefaults: {
    	              labelAlign: 'middle',
    	              msgTarget: 'side'
    	              	 ,flex: 1
    	          },
    	          defaults: {
    	              anchor: '100%',
    	              labelWidth: 80
    	          },
    	          items: [
    			        new Ext.form.Hidden({
    			        	id: 'unique_uid',
    			        	name: 'cartmapUids',
    			        	value: cartmapUids
    			        }),
    			        new Ext.form.Hidden({
    			        	id: 'ac_uid',
    			        	name: 'ac_uid',
    			        	value: selectedPjUid
    			        }),
    			        new Ext.form.Hidden({
    			        	id: 'item_abst',
    			        	name: 'item_abst',
    			        	value: item_abst
    			        }),
    			        new Ext.form.Hidden({
    			        	id: 'supplierUids',
    			        	name: 'supplierUids'
    			        })
    			        ,
    			        {
    	          		fieldLabel: ppo1_request_date,
    	          		value : netDay15,
    	              	format: 'Y-m-d',
    				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    	              	allowBlank: false,
    	              	xtype: 'datefield',    
    	          		anchor: '100%',
    	          		id: 'req_delivery_date',
    	          		name: 'req_delivery_date'
    	              },
    			        {
    	          		fieldLabel: prf1_end_of_receiving,
    	          		value : netDay5,
    	              	format: 'Y-m-d',
    				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    	              	allowBlank: false,
    	              	xtype: 'datefield',    
    	          		anchor: '100%',
    	          		id: 'to_date',
    	          		name: 'to_date'
    	              }
    	              ,{
    	                  xtype:          'textfield',
    	                  value:          payCondition,
    	                  fieldLabel:     prf1_pay_cond,
    	                  name:           'pay_condition',
    	                  id:           'pay_condition',
    	                  anchor:'100%'
    	              }
    	              ,{
    	                  xtype:          'combo',
    	                  mode:           'local',
    	                  value:          'ADV',
    	                  triggerAction:  'all',
    	                  forceSelection: true,
    	                  editable:       false,
    	                  fieldLabel:     prf1_pay_type,
    	                  name:           'pay_type',
    	                  id:           'pay_type',
    	                  displayField:   'name',
    	                  valueField:     'value',
    	                  queryMode: 'local',
    	                  anchor:'100%',
    	                  store:          Ext.create('Ext.data.Store', {
    	                      fields : ['name', 'value'],
    	                      data   : [
    	                          {name : prf1_advanced,   value:  'ADV'}
    	                          ,{name : prf1_tt,   value: 'TT'}
    	                          ,{name : prf1_commerial,   value: 'C_BILL'}
    	                          ,{name : prf1_bank,   value: 'B_BILL'}
    	                      ]
    	                  })
    	              },{
    	          		fieldLabel: '요청 품목',
    		            	xtype: 'textfield',
    		            	anchor: '100%',
    		            	value: txt_name,
    		            	id: 'txt_name',
    		            	name: 'txt_name'
    	          },
    	          
    	          {
    	              	fieldLabel:pf1_delivery_address,
    		            	xtype: 'textfield',
    		            	anchor: '100%',
    		            	value: delivertAddress,
    		            	id: 'delivery_address_1',
    		            	name: 'delivery_address_1'
    	              },
	    	          

	              {
			            	fieldLabel: pf1_inquire_info,
			             	xtype: 'textfield',
			            	hideLabel: false,
			            	anchor: '100%',
			            	id: 'inquire_info',
			            	name: 'inquire_info',
			            	value: requestInfo
    		            },{
	    	          		fieldLabel: ppo1_request,
	    	          		xtype: 'textarea',
	    	          		hideLabel: false,
	    	          		anchor: '100%',
	    	          		id: 'txt_content',
	    	          		name: 'txt_content',
	    	          		value: '견적요청 합니다.',
	    	          		rows: 3
    		            },{
	    	          		fieldLabel: '발주사 정보',
	    	          		xtype: 'textarea',
	    	          		hideLabel: false,
	    	          		anchor: '100%',
	    	          		value: buyerInfo,
	    	          		readOnly: true,
	    	          		fieldStyle: 'background-color: #E7EEF6; background-image: none;',
	    	          		rows: 2
    		            }
    		            
    		            
    		            
    		            
    		            ]//item end..
    			});//Panel end...
    	 	
    	    	var removeAction = Ext.create('Ext.Action', {
    	    		itemId: 'removeAction',
    	    	    iconCls: 'remove',
    	    	    text: CMD_DELETE,
    	    	    disabled: true,
    	    	    handler: function(widget, event) {
    	    	    	var selections = receiverGrid.getSelectionModel().getSelection();
    	    	        if (selections) {
    	    	            receiverGrid.store.remove(selections);
    	    	        }
    	    	    }
    	    	});

    			prWin = Ext.create('ModalWindow', {
    	        title:CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
    	        width: 600,
    	        height: 560,
    	        plain:true,        
    	        items: [{
    				region: 'center',
    				border: false,
    				split: true,
    				collapsible: false,
    				floatable: false,
  	              	title : pf1_to,
    				items: [ 
    				         {
    				        	 region: 'north',
    				        	 height:120,
    				        	 border: true,
    				        	 //bodyStyle: 'border: red 1px dashed;',
    			   	             autoHeight: true,
    				             layout: 'fit',
    						     dockedItems: [{
    						            xtype: 'toolbar',
    						            items:[
												{
													id :'supplier_information',
													field_id :'supplier_information',
												    name : 'supplier_information',
												    xtype: 'combo',
												    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
												    store: supastStore,
												    emptyText:   '수신처 검색', //getColName('buyer_name'),
												    displayField:   'supplier_name',
												    valueField:   'supplier_name',
												    sortInfo: { field: 'create_date', direction: 'DESC' },
												    typeAhead: false,
												    hideLabel: true,
												    border: false,
												    minChars: 1,
												    //hideTrigger:true,
												    width: 200,
												    minChars: 1,
												    listConfig:{
												        loadingText: '검색중...',
												        emptyText: '일치하는 항목 없음.',
												        getInnerTpl: function() {
												            return '<div data-qtip="{unique_id}">[{supplier_code}] {supplier_name}</div>';
												        }			                	
												    },
												    listeners: {
												    	select: function (combo, records) {
												    		var data = records[0].data;
												    		var check = false;
									    	        		
												    		receiverStore.each(function(item) {
									    	                  var unique_id = item.get('unique_id');
									    	                  if(unique_id+'' == data['unique_id']+'') {
									    	                  	check = true;
									    	                  }
									    	              });
												    		if(check==true) {
												    			Ext.MessageBox.alert('오류', '이미 지정된 수신처입니다.');		
												    		} else {
													    		var supAst = Ext.ModelManager.create( data, 'SupAst');
													    		receiverStore.add(supAst);  		
												    		}

													    }//endofselect
														,afterrender: function(combo) {
													    	//callbackToolbarRenderrer('CommonSupplier', 'not-use', combo);
												    }
											    }
											},
											,'-',
										removeAction
					                   ]
    						        }],
    				        	 items: receiverGrid
    				         },{
    				        	 region: 'center',
    				        	 border: false,
    				        	 items: form
    				         }
    				         
    				      ]
    				}

    	        ],
    	        buttons: [{
    	          text: CMD_OK,
    	        	handler: function(btn){
    	        		var supastUids = [];
    	        		receiverStore.each(function(item) {
    	                  console_logs('item', item);
    	                  supastUids.push(item.get('unique_id'));
    	              });
    	        		
    	        		if(supastUids.length==0) {
    	        			Ext.MessageBox.alert('오류', '수신처가 지정되지 않았습니다.');
    	        		} else {
    	        		
		        	    	//selected suppliers
		        	    	Ext.getCmp('supplierUids').setValue(supastUids);    
		                	
			        		var form = Ext.getCmp('formPanel').getForm();
			                if(form.isValid())
			                {
			                	var val = form.getValues(false);
			                	var rtgast = Ext.ModelManager.create(val, 'RtgAstRfq');
	
			                		rtgast.save({
				                		success : function() {
				                           	if(prWin) 
				                           	{
				                           		prWin.close();
				                           		store.load(function() {});
				                           	} 
				                		} 
				                	 });
			                }
			                else {
			                	Ext.MessageBox.alert(prf1_error, prf1_valid_msg);
			                }
	    	        		
	    	        	}


    	        	}
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
    			
    			

    		},//endofsuccess
    		failure: extjsUtil.failureMessage
    	});	//endof Ext.Ajax.request({
    	

    }//handler end...
});

Ext.onReady(function() {  
	
	netDay15 = new Date();
	netDay15.setDate(netDay15.getDate() + 15); 
	
	netDay5 = new Date();
	netDay5.setDate(netDay5.getDate() + 5); 
	//회사정보 일기
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',				
		success : function(result) {
			//console.log('result', result);
			var text = result.responseText;
			//console.log('text', text);
			var o = JSON.parse(text, function (key, value) {
						//console.log('key,value=', key + ',' + value);
						/*
						var type;
					    if (value && typeof value === 'object') {
					        type = value.type;
					        if (typeof type === 'string' && typeof window[type] === 'function') {
					            return new (window[type])(value);
					        }
					    }
					    */
					    return value;
					});
			
			//console.log('o', o);
			payCondition = o['payCondition']; //결재조건
			//delivertAddress = o['delivertAddress']; //견적조건 ==> 프로젝트 가업부 주소로 대체
		},
		failure: extjsUtil.failureMessage
	});
	supastStore = Ext.create('Mplm.store.SupastStore', {hasNull: false} );
	
	//supastStore.load(function() {});

	LoadJs('/js/util/comboboxtree.js');
	
	Ext.define('RtgAstRfq', {
	   	 extend: 'Ext.data.Model',
	   	 fields: [
	   	          'txt_name',
	   	          'txt_content',
	   	          'item_abst',
	   	          'ac_uid',
	   	          'to_date',
	   	          'req_delivery_date',
	   	          'supplierUids',
	   	          'cartmapUids',
				'pay_condition',
				'pay_type',
				'delivery_address_1',
				'inquire_info'
	   	          ],
   	       proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/purchase/rfq.do?method=read',
		            create: CONTEXT_PATH + '/purchase/rfq.do?method=create',
		            update: CONTEXT_PATH + '/purchase/rfq.do?method=update',
		            destroy: CONTEXT_PATH + '/purchase/rfq.do?method=destroy'
		        },
				reader: {
					type: 'json',
					root: 'datas',
					totalProperty: 'count',
					successProperty: 'success',					
				},
				writer: {
		            type: 'singlepost',
		            writeAllFields: false,
		            root: 'datas'
		        } 
			}
	});

	
	Ext.define('CartLine', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/purchase/request.do?method=read&route_type=P',
		            create: CONTEXT_PATH + '/purchase/request.do?method=create',
		            update: CONTEXT_PATH + '/purchase/request.do?method=update',
		            destroy: CONTEXT_PATH + '/purchase/request.do?method=destroy'
		        },
				reader: {
					type: 'json',
					root: 'datas',
					totalProperty: 'count',
					successProperty: 'success',
					excelPath: 'excelPath'
				},
				writer: {
		            type: 'singlepost',
		            writeAllFields: false,
		            root: 'datas'
		        } 
			}
	});
	
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'CartLine',
		groupField :'pr_no',
		sorters: [{
            property: 'item_code',
            direction: 'ASC'
        }]
	});
	
 	store.load(function() {

 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
 		
 		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			if(dataIndex!='no') {
				if('static_sales_price' == dataIndex || 'quan' == dataIndex) {
					columnObj["editor"] = {
	                };	
				}
			}
		});
 		
		grid = Ext.create('Ext.grid.Panel', {
		        store: store,
		        collapsible: true,
		        multiSelect: true,
		        stateId: 'stateGrid',
		        selModel: selModel,
		        autoScroll : true,
		        autoHeight: true,
		        height: getCenterPanelHeight(),
		        bbar: getPageToolbar(store),
		        features: [{ ftype: 'grouping' }],
		        dockedItems: [{
		            xtype: 'toolbar',
		            items:[
		                    searchAction
		                    , '-',
		                   addAction, 
		                   '->',
		                    {
		                        text: panelSRO1133,
		                        iconCls: 'save',
		                        disabled: false,
		                        handler: function ()
		                        {
		                              for (var i = 0; i <grid.store.data.items.length; i++)
		                              {
			                                var record = grid.store.data.items [i];
			                                var unique_uid = record.get('unique_uid');
			                                if (record.dirty) {
			                                	record.set('id',unique_uid);
			                                	console_log(record);
			        		            		//저장 수정
			                                	record.save({
			        		                		success : function() {
			        		                			 store.load(function() {});
			        		                		}
			        		                	 });
			                                }
			                               
			                          }
		                        }
		                    }
		            ]
		        }/*,{
		        	xtype: 'toolbar',
		        	items: getProjectTreeToolbar()
		        }*/],
		        columns: /*(G)*/vCENTER_COLUMNS,
		        plugins: [cellEditing],//필드 에디트
		        viewConfig: {
		            stripeRows: true,
		            enableTextSelection: true,
		            getRowClass: function(record) { 
		              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
		            } ,
		            listeners: {
		            	'afterrender' : function(grid) {
							var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
							elments.each(function(el) {
										}, this);
								
							}
		            		,
		                itemcontextmenu: function(view, rec, node, index, e) {
		                    e.stopEvent();
		                    return false;
		                }
		            }
		        },
		        title: getMenuTitle()
		    });
		fLAYOUT_CONTENT(grid);
		
	    grid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	            if (selections.length) {
					//grid info 켜기
					displayProperty(selections[0]);
					
					if(fPERM_DISABLING()==true) {
						addAction.disable();
					}else{
						addAction.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
	            		addAction.disable();
	            	}
	            }
	        }
	    });

	    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
	        Ext.create('Ext.tip.ToolTip', config);
	    });
	cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
 	console_log('End...');

});	//OnReady

