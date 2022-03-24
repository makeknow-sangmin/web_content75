/**
 * SQT1: Ouatation
 */
//global var.
var grid = null;
var store = null;
var partStore = null;

var gRf_uid ='';// regastUid
var gContract_uid = '';
var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

var viewHandler = function() {
	
};

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});


function sendConfirm(btn){

        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
            
        	//견적전송.
    		Ext.Ajax.request({
    				url: CONTEXT_PATH + '/sales/quota.do?method=sendQuota',				
    			params:{
    				contract_uid : gContract_uid,
    				rf_uid : gRf_uid
    			},
    				success : function(result, request) {
    					//var ret = result.responseText;
    					//console_log('requested ajax...' + ret);
    					store.load(function() {
                        	partStore.getProxy().setExtraParam('contract_uid', -1);
                        	partStore.load(function(){});
    						
    					});

    				},
    				failure: extjsUtil.failureMessage
    			}); 
        }

};

var sendAction = Ext.create('Ext.Action', {
	itemId: 'sendAction',
      text: sqt1_submit_quota,
      iconCls: 'email_go',
      disabled: true,
      handler: function ()
      {
      	console_log('gRf_uid:' + gRf_uid);
      	console_log('gContract_uid:' + gContract_uid);
      	
      	var mustSave = [];
        for (var i = 0; i <partStore.data.items.length; i++)
        {
              var record = partStore.data.items [i];
              if (record.dirty) {
              	mustSave.push(record);
              }
             
        }//endof for
   
        var totalQuan = mustSave.length;
        var sucessQuan = 0;
        var failQuan = 0;
        var endProcess = function() {
  			if(totalQuan==0) {
  			 	partStore.load(function() {
  			 		console_log('save result:....');
  			 		console_log('totalQuan=' + totalQuan);
  			 		console_log('sucessQuan=' + sucessQuan);
  			 		console_log('failQuan=' + failQuan);

  			 		//sales price validate.
  			 		var canSend = true;
  			        for (var i = 0; i <partStore.data.items.length; i++)
  			        {
  			              var record = partStore.data.items [i];

  			              console_log(record);
  			              var strSource_price = record.get('source_price');
  			              console_log('strSource_price=' + strSource_price);
  			              var source_price = parseFloat(strSource_price);
  			              console_log('source_price=' + source_price);
  			              if(isNaN(source_price) ||  source_price<0.000000001) {
  			            	canSend = false;
  			              }
  			             
  			        }//endof for

  			 		if(canSend) {
  	  			    	Ext.MessageBox.show({
  	  			            title:'send quota',
  	  			            msg: vmf1_quotation_msg,
  	  			            buttons: Ext.MessageBox.YESNO,
  	  			            fn: sendConfirm,
  	  			            icon: Ext.MessageBox.QUESTION
  	  			        });

  			 		} else {
  			 			Ext.MessageBox.alert(error_msg_prompt, error_msg_content + ' '+sqt_price);
  			 		}
  			 		
	  			 	});
  			}
        };
        
        if(totalQuan==0) {
        	endProcess();
        } else {
        	for(var j=0; j<mustSave.length; j++) {
            	  var rec = mustSave [j];
            	  rec.save({
                		success : function() {
                			totalQuan--;
                			sucessQuan++;
                			endProcess();
                		},
                		failure: function() {
                			totalQuan--;
                			failQuan++;
                			endProcess();
                		}	
            	 });
              }	
        }
        
      	
      }
  });
  var denyAction = Ext.create('Ext.Action', {
		itemId: 'denyAction',
      text: sqt1_giveup_quota,
      iconCls: 'cross',
      disabled: true,
      handler: function ()
      {
        	console_log('gRf_uid:' + gRf_uid);
          	console_log('gContract_uid:' + gContract_uid);
      }
  });
  



Ext.onReady(function() {  

	var searchField = [];
	
	searchField.push('unique_id');
	searchField.push('po_no');
	searchField.push('name');
	searchField.push('content');
	
	makeSrchToolbar(searchField);
	
	Ext.define('CartLine', {
		 extend: 'Ext.data.Model',
		 fields: /*(G)*/vCENTER_FIELDS_SUB,
		    proxy: {
				type: 'ajax',
				//url: CONTEXT_PATH + '/production/machine.do?method=getUserList',
		        api: {
		            read: CONTEXT_PATH + '/production/pcsstart.do?method=read',
		            create: CONTEXT_PATH + '/production/pcsstart.do?method=create',
		            update: CONTEXT_PATH + '/production/pcsstart.do?method=update',
		            destroy: CONTEXT_PATH + '/production/pcsstart.do?method=destroy'
		        },
				reader: {
					type: 'json',
					root: 'datas',
					totalProperty: 'count',
					successProperty: 'success'
				},
				writer: {
		            type: 'singlepost',
		            writeAllFields: false,
		            root: 'datas'
		        }
			}
	});
	
	Ext.define('RtgAstRfq', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/sales/quota.do?method=read&state=A',
		            create: CONTEXT_PATH + '/sales/quota.do?method=create',
		            update: CONTEXT_PATH + '/sales/quota.do?method=create',
		            destroy: CONTEXT_PATH + '/sales/quota.do?method=destroy'
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
				model: 'RtgAstRfq',
				//remoteSort: true,
				sorters: [{
		            property: 'unique_id',
		            direction: 'DESC'
		        }]
			});
			
		 	store.load(function() {

		 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		 		
					grid = Ext.create('Ext.grid.Panel', {
					        store: store,
					        selModel: selModel,
					        height: getCenterPanelHeight()/2, 
					        bbar: getPageToolbar(store),
					        region: 'center',
					        dockedItems: [{
					            dock: 'top',
					            xtype: 'toolbar',
					            items: [
					                    searchAction
					                    , '->'
			      				          ]
					        },
					        {
					            xtype: 'toolbar',
					            items: /*(G)*/vSRCH_TOOLBAR/*vSRCH_TOOLBAR*/
					        }
					        
					        ],
					        columns: /*(G)*/vCENTER_COLUMNS,
					        viewConfig: {
					            stripeRows: true,
					            enableTextSelection: true,
	     			            getRowClass: function(record) { 
		     			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
	     			            } ,
					            listeners: {
					                itemcontextmenu: function(view, rec, node, index, e) {
					                    e.stopEvent();
					                    contextMenu.showAt(e.getXY());
					                    return false;
					                }
	     			            	//,itemdblclick: viewHandler
					            }
					        },
					        title: getMenuTitle()
					        //,renderTo: Ext.getCmp('mainview-content-panel').body  //'MAIN_DIV_TARGET'

					    });
				    grid.getSelectionModel().on({
				        selectionchange: function(sm, selections) {
				        	
				        	console_log(selections.length);
				        	if (selections.length) {
								collapseProperty();//uncheck no displayProperty
				        		////grid info 켜기
				        		displayProperty(selections[0]);
				        		
				        		
				        		var rec = grid.getSelectionModel().getSelection()[0];
				        		
				        		gRf_uid = rec.get('reserved_number4');
				        		gContract_uid = rec.get('unique_id');
				        		
			                	console_info('gRf_uid: ' + gRf_uid);
			                	console_info('gContract_uid: ' + gContract_uid);
			                	partStore.getProxy().setExtraParam('contract_uid', gContract_uid);

			                	partStore.load(function(){});
			                	
			                	sendAction.enable();
			                	denyAction.enable();
			                	
				        	}else {
			                	sendAction.disable();
			                	denyAction.disable();
				        	}
				        	
				        }

				    });

					Ext.define('RfqMapPartLine', {
					   	 extend: 'Ext.data.Model',
					   	 fields: /*(G)*/vCENTER_FIELDS_SUB,
					   	    proxy: {
									type: 'ajax',
							        api: {
							            read: CONTEXT_PATH + '/sales/quota.do?method=readDetail', /*1recoed, search by cond, search */
							            create: CONTEXT_PATH + '/sales/quota.do?method=createDetail', /*create record, update*/
							            update: CONTEXT_PATH + '/sales/quota.do?method=createDetail'
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
					
				    partStore = new Ext.data.Store({  
						pageSize: 1000,
						model: 'RfqMapPartLine',
						//remoteSort: true,
						sorters: [{
				            property: 'unique_id',
				            direction: 'DESC'
				        }]
					});

					Ext.each(/*(G)*/vCENTER_COLUMN_SUB, function(columnObj, index) {
						
						var dataIndex = columnObj["dataIndex"];

						columnObj["flex"] =1;
						
						switch(dataIndex) {
							case 'source_price':
							case 'delivery_date': 
							case 'tax_ratio100':
							case 'comment':
								columnObj["editor"] = {}; columnObj["css"] = 'edit-cell';
								columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
						        	p.tdAttr = 'style="background-color: #FFE4E4;"';
						        	return value;
					        	};
								break;
						}

		
					});
					
				    var myGrid = Ext.create('Ext.grid.Panel', {
				        region: 'south',
				        height: getCenterPanelHeight()/2, 
				        store: partStore,
				        
				        dockedItems: [{
				            dock: 'top',
				            xtype: 'toolbar',
				            items: [
				                    sendAction,
			      				     /* '-',
			      				     denyAction,*/
		      				        '->',/*"단가와 세율을 변경 후 저장버튼을 눌러주세요"*//*"单价和税率变更后请点击保存按钮"*/{text:Estimates_Management_Description},'-',
		      				      {
				                        text: panelSRO1133,
				                        iconCls: 'save',
				                        disabled: false,
				                        handler: function ()
				                        {
				                        	  var mustSave = [];
				                              for (var i = 0; i <partStore.data.items.length; i++)
				                              {
					                                var record = partStore.data.items [i];
					                                if (record.dirty) {
					                                	mustSave.push(record);
					                                }
					                               
					                          }//endof for
				                         
				                              var totalQuan = mustSave.length;
				                              var sucessQuan = 0;
				                              var failQuan = 0;
				                              var endProcess = function() {
		        		                			if(totalQuan==0) {
		        		                			 	partStore.load(function() {
		        		                			 		console_log('save result:....');
		        		                			 		console_log('totalQuan=' + totalQuan);
		        		                			 		console_log('sucessQuan=' + sucessQuan);
		        		                			 		console_log('failQuan=' + failQuan);
		        		                			 	});
		        		                			}
				                              };
				                              
				                              for(var j=0; j<mustSave.length; j++) {
				                            	  var rec = mustSave [j];
				                            	  rec.save({
				        		                		success : function() {
				        		                			totalQuan--;
				        		                			sucessQuan++;
				        		                			endProcess();
				        		                		},
				        		                		failure: function() {
				        		                			totalQuan--;
				        		                			failQuan++;
				        		                			endProcess();
				        		                		}	
			        		                	 });
				                              }
				                              
				                              
				                        }
				                    }
		      				     ]
				        	}
				        
				        ],
				        columns: /*(G)*/vCENTER_COLUMN_SUB,
				        plugins: [cellEditing],
				        viewConfig: {
				            stripeRows: true,
				            enableTextSelection: true,
//				            getRowClass: function(record, index) { 
//				            	console_log(record);
//				            	return index == 1 ? 'my-row' : ''; 
//		   			           //   return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
//				            } ,
				            listeners: {
								'afterrender' : function(grid) {
									var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
									elments.each(function(el) {
													//el.setStyle("color", 'black');
													//el.setStyle("background", '#ff0000');
													//el.setStyle("font-size", '12px');
													//el.setStyle("font-weight", 'bold');
							
												}, this);
										
									}
				            		,
				                itemcontextmenu: function(view, rec, node, index, e) {
				                    e.stopEvent();
				                    contextMenu.showAt(e.getXY());
				                    return false;
				                },
				                itemdblclick: viewHandler 
	
				            }
				        }
				    });


				    myGrid.getSelectionModel().on({
				        selectionchange: function(sm, selections) {
				        	
				        	console_log(selections.length);
				        	if (selections.length) {
								collapseProperty();//uncheck no displayProperty
				        		////grid info 켜기
				        		displayProperty(selections[0], vCENTER_FIELDS_SUB);
				        	}
				        	
				        }

				    });
				    
				    var main =  Ext.create('Ext.panel.Panel', {
					    layout:'border',
				        border: false,
				        layoutConfig: {columns: 1, rows:2},
					    defaults: {
					        collapsible: true,
					        split: true,
					        cmargins: '5 0 0 0',
					        margins: '0 0 0 0'
					    },
					    items: [grid, myGrid]
					});
				  	fLAYOUT_CONTENT(main);
				    //callback for finishing.
				    cenerFinishCallback();
				
			}); //store load

		 	

});//OnReady

