

//
//var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
//    clicksToEdit: 1
//});

//var gSelectedRtgast = null;
var grid = null;
var store = null;
var gridSub = null;
var storeSub = null;



var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchToolBarTap
});

var checkOutAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
	iconCls: 'door_out',
	text: ppo2_order_cancel,
	disabled: true,
	handler: checkoutConfirm
});
function checkoutConfirm(btn){
	var selections = gridSub.getSelectionModel().getSelection();
	
	var unique_ids = [];
	var po_blocking_qtys = [];
	for(var i=0; i< selections.length; i++) {
		var rec = gridSub.getSelectionModel().getSelection()[i];
		var unique_id = rec.get('unique_id');
		var gr_qty = Number(rec.get('gr_qty'));
		var po_qty = Number(rec.get('po_qty'));
		var min_qty = po_qty-gr_qty;
		if(min_qty == 0){
			Ext.MessageBox.alert(error_msg_prompt, ppo2_cancel_msg);
			return null;
		}
		unique_ids.push(unique_id);
		po_blocking_qtys.push(min_qty);
	}
	if (selections) {
		Ext.MessageBox.show({
            title:delete_msg_title,
            multiline: true,
            width: 400,
            msg: ppo2_cancel_comment,
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn, dr_info, opt) {
                if(btn == 'yes' ) {
    				//PO cancel Action
        	    	Ext.Ajax.request({
        	    		url: CONTEXT_PATH + '/purchase/prch.do?method=destroy',
        	    		params:{
        	    			unique_id : unique_ids,
        	    			po_blocking_qty : po_blocking_qtys,
        	    			dr_info : dr_info
        	    		},
        	    		success : function(result, request) {
        	    			store.load(function(){});
        	    		},
        	    		failure: extjsUtil.failureMessage
        	    	});
    			}
            }, 
            icon: Ext.MessageBox.QUESTION
        });
	}
}

var detailAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: function(widget, event) {
		var rec = grid.getSelectionModel().getSelection()[0];
     	var unique_id = rec.get('unique_id');
    	var po_no = rec.get('po_no');
    	var name = rec.get('name');
    	var content = rec.get('content');
    	var item_quan = rec.get('item_quan' );
		
		console_log('unique_id=' + unique_id);
		console_log('po_no=' + po_no);
		console_log('name=' + name);
		console_log('content=' + content);

		var routingStore = Ext.create('Mplm.store.RoutingStore', {} );
		
		routingStore.getProxy().setExtraParam('unique_id',unique_id);
		
		
		var newStoreData = [];
		routingStore.load(  function(records) {
	        for (var i=0; i<records.length; i++){
	        	var rtgwrk_unique_id = records[i].get('rtgwrk_unique_id');
	        	var user_id = records[i].get('user_id');
	        	var user_name = records[i].get('user_name');
	        	var dept_code = records[i].get('dept_code');
	        	var dept_name = records[i].get('dept_name');
	        	var serial = records[i].get('serial');
	        	var comment = records[i].get('comment');
	        	var state = records[i].get('state');
	        	var result = records[i].get('result');
	        	var role = records[i].get('role');
	  
	        	var obj = {};
	        	obj['rtgwrk_unique_id'] = rtgwrk_unique_id;
	        	obj['user_id'] = user_id;
	        	obj['user_name'] = user_name;
	        	obj['dept_code'] = dept_code;
	        	obj['dept_name'] = dept_name;
	        	obj['serial'] = serial;
	        	obj['comment'] = comment;
	        	obj['state'] = state;
	        	obj['result'] = result;
	        	obj['role'] = role;
	        	newStoreData.push(obj);
	        }
			
			var RoutingGrid = Ext.create('Ext.grid.Panel', {
			    store: Ext.create('Ext.data.Store', {
                    fields : ['rtgwrk_unique_id'
                              ,'user_id'
                              ,'user_name'
                              ,'dept_code'
                              ,'dept_name'
                              ,'serial'
                              ,'comment'
                              ,'state'
                              ,'result'
                              ,'role'
                              ],
                    data   : newStoreData
                }),
//                routingStore,
			    stateId: 'stateGrid-routingGrid-111',
			    layout: 'fit',
			    border: false,
			    frame: false ,
//		        height: 200,
				multiSelect : false,
			    columns: [
			              {text: getColName('unique_id'), dataIndex: 'rtgwrk_unique_id'}
			              ,{text: ppo2_user_id, dataIndex: 'user_id'}
			              ,{text: ppo2_user_name, dataIndex: 'user_name'}
			              ,{text: ppo2_dept_code, dataIndex: 'dept_code'}
			              ,{text: ppo2_dept_name, dataIndex: 'dept_name'}
			              ,{text: ppo2_serial, dataIndex: 'serial'}
			              ,{text: ppo2_comment, dataIndex: 'comment'}
			              ,{text: ppo2_state, dataIndex: 'state'}
			              ,{text: ppo2_result, dataIndex: 'result'}
			              ,{text: ppo2_role, dataIndex: 'role'}
			              ]
				});
			
			var form = Ext.create('Ext.form.Panel', {
				id: 'formPanel',
		        //layout: 'absolute',
		        defaultType: 'displayfield',
		        border: false,
		        height: 300,
		        defaults: {
		            anchor: '100%'
//		            labelWidth: 100
		        },
		        items: [
		                RoutingGrid,
                {
                	xtype: 'component',
                	html: '<br/><hr/><br/>',
                	anchor: '100%'
                },{
					fieldLabel: getColName('unique_id'),
					value: unique_id,
					name: 'unique_id',
					anchor: '100%'
				},{
					fieldLabel: getColName('po_no'),
					value: po_no,
				    name: 'po_no',
				    anchor: '100%'
				},{
			    	fieldLabel: getColName('name'),
			    	value: name,
			    	name: 'name',
			    	anchor: '100%'
			    },{
			    	fieldLabel: getColName('content'),
			    	value: content,
			    	name: 'content',
			    	anchor: '100%'
			    },{
			    	fieldLabel: getColName('item_quan'),
			    	value: item_quan,
			    	name: 'item_quan',
			    	anchor: '100%'
				}]
			});

			var win = Ext.create('widget.window', {
				title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				modal:true,
				plain:true,
				closable: true,
				closeAction: 'hide',
				width: 1000,
				minWidth: 750,
				height: 300,
				layout:{
					type: 'border',
					padding: 5
				},
				items: form,
	         	buttons: [{
		            text: CMD_OK,
	     			handler: function(){
	     				if(win) {win.close();} 
	     			}
		         }]
			});
			win.show();
		});
    }
});


//var viewHandler = function() {
//	var rec = grid.getSelectionModel().getSelection()[0];
// 	var unique_id = rec.get('unique_id');
//	var po_no = rec.get('po_no');
//	var name = rec.get('name');
//	var content = rec.get('content' );
////	var item_quan = rtgast.get('item_quan' );
//	var routingStore = Ext.create('Mplm.store.RoutingStore', {} );
//	
//	routingStore.load(unique_id ,{
//		 success: function(routing) {
//			 var form = Ext.create('Ext.form.Panel', {
//					id: 'formPanel',
//			        //layout: 'absolute',
//			        defaultType: 'displayfield',
//			        border: false,
//			        height: 300,
//			        defaults: {
//			            anchor: '100%',
//			            labelWidth: 100
//			        },
//			        items: [{
//						fieldLabel: getColName('unique_id'),
//						value: unique_id,
//						name: 'unique_id',
//						anchor: '100%'
//					},{
//						fieldLabel: getColName('po_no'),
//						value: po_no,
//					    name: 'po_no',
//					    anchor: '100%'
//					},{
//				    	fieldLabel: getColName('name'),
//				    	value: name,
//				    	name: 'name',
//				    	anchor: '100%'
//				    },{
//				    	fieldLabel: getColName('content'),
//				    	value: content,
//				    	name: 'content',
//				    	anchor: '100%'
////				    },{
////				    	fieldLabel: getColName('item_quan'),
////				    	value: item_quan,
////				    	name: 'item_quan',
////				    	anchor: '100%'
//					}]
//				});
//					
//				var RoutingGrid = Ext.create('Ext.grid.Panel', {
//					    store: routingStore,
//					    stateId: 'stateGrid-routingGrid',
//					    layout: 'fit',
////					    border: false,
//					    height: 200,
//						multiSelect : false,
////						split: true,
//					    columns: [
//					              { text     : getColName('unique_id'), 		width : 80,  sortable : true, dataIndex: 'unique_id'  },
//					              { text     : getColName('name'), 		width : 80,  sortable : true, dataIndex: 'name'  },
//					              { text     : getColName('content'), 		width : 80,  sortable : true, dataIndex: 'content'  },
//					              { text     : ppo2_user_id, 		width : 80,  sortable : true, dataIndex: 'user_id'  },
//					              { text     : ppo2_user_name, 		width : 80,  sortable : true, dataIndex: 'user_name'  },
//					              { text     : ppo2_dept_code, 		width : 80,  sortable : true, dataIndex: 'dept_code'  },
//					              { text     : ppo2_dept_name, 		width : 80,  sortable : true, dataIndex: 'dept_name'  },
//					              { text     : ppo2_serial, 		width : 80,  sortable : true, dataIndex: 'serial'  },
//					              { text     : ppo2_comment, 		width : 80,  sortable : true, dataIndex: 'comment'  },
//					              ],
//					    viewConfig: {
//					        stripeRows: true,
//					        enableTextSelection: false,
//					        getRowClass: function(record) { 
//					        	console_log('unique_id=' + record.get('unique_id'));
//					        } ,
//					        listeners: {
//					            itemdblclick:  function(dv, record, item, index, e) {
//					                alert('working');
//				            }
//				        }
//				    }
//				});
//				
//			 var win = Ext.create('widget.window', {
//					title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
//					modal:true,
//					plain:true,
//					closable: true,
//					closeAction: 'hide',
//					width: 750,
//					minWidth: 750,
//					height: 500,
//					layout:{
//						type: 'border',
//						padding: 5
//					},
//					items: [{
//						region: 'north',
////						title: '',
//						width: 580,
//						split: true,
//						collapsible: false,
//						floatable: false,
//						border: false,
//						items: [RoutingGrid]
//					},{
//						region: 'center',
//						height: 300,
////						split: true,
////						xtype: 'tabpanel',
//						items: [form]
//					}],
//		         	buttons: [{
//			            text: CMD_OK,
//		     			handler: function(){
//		     				if(win) {win.close();} 
//		     			}
//			         }]
//				});
//					win.show();
//		 }//endofsuccess
//	 });//emdofload
//
//};

var printPDFAction = Ext.create('Ext.Action',{
    iconCls: 'PDF',
    text: 'PDF',
    disabled: true,
    handler: function(widget, event) {
    	var rec = grid.getSelectionModel().getSelection()[0];
     	var rtgast_uid = rec.get('unique_id');//rtgast_uid
    	var po_no = rec.get('po_no');//po_no
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/pdf.do?method=printPo',
    		params:{
    			rtgast_uid : rtgast_uid,
    			po_no : po_no,
    			pdfPrint : 'pdfPrint'
    		},
    		reader: {
    			pdfPath: 'pdfPath'
    		},
    		success : function(result, request) {
    			store.load({
        	    scope: this,
        	    callback: function(records, operation, success) {
        	        var jsonData = Ext.JSON.decode(result.responseText);
        	        var pdfPath = jsonData.pdfPath;
        	        console_log(pdfPath);
//        	        
        	    	if(pdfPath.length > 0) {
        	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
        	    		top.location.href=url;	
        	    	}
        	    }
        	});
    		},
    		failure: extjsUtil.failureMessage
    	});
    	
    	
    }
});

//var removeAction = Ext.create('Ext.Action', {
//	itemId: 'removeButton',
//    iconCls: 'remove',
//    text: CMD_DELETE,
////    disabled: true,
//    handler: function(widget, event) {
//    	Ext.MessageBox.show({
//            title:delete_msg_title,
//            msg: delete_msg_content,
//            buttons: Ext.MessageBox.YESNO,
//            fn: deleteConfirm,
//            icon: Ext.MessageBox.QUESTION
//        });
//    }
//});
var is_complished = null;
var po_no = null;
function getStatesToolBar(){
	var arrStatesToolBar = [];
	
	arrStatesToolBar.push(
			{
	        	id :'is_complished',
            	xtype:          'combo',
                mode:           'local',
                value:          'A',
                triggerAction:  'all',
                forceSelection: true,
                editable:       false,
                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
//	                        allowBlank: false,
                emptyText:  ppo1_filter,
                name:           'is_complished',
                displayField:   'value',
                valueField:     'name',
                queryMode: 'local',
                store:          Ext.create('Ext.data.Store', {
                    fields : ['name', 'value'],
                    data   : [
                        {name : 'A',   value: ppo2_payment_complete}//결재완료
                        ,{name : 'I',   value: panelSRO1209}//결재중
                        ,{name : 'G',   value: ppo2_in_complete}//입고완료
                        ,{name : 'D',   value: panelSRO1207}//반려
                        ,{name : 'T',   value: ppo2_all}//모두검색
                    ]
                }),
                listeners: {
                	select: function (combo, record) {
                	}
                }
			}
	);
		
	arrStatesToolBar.push(
			{
	        	fieldLabel: '',
	        	//labelWidth: 70,
	        	width: 148,
	        	xtype: 'triggerfield',
	        	id :'po_no',
	        	name : 'po_no',
	        	emptyText:  qgr1_po_no,
	        	labelSeparator: '',
	        	readOnly: false,
//		        	fieldStyle: 'background-color: #E7EEF6; background-image: none;',
	        	//enableKeyEvents: true,
	        	listeners: {
//	        		expand: function(){
//	        			// fromPicker = true;
//	        		},
//	        		collapse: function(){
//	        			//   fromPicker = false;  
//	        		},
//	        		change: function(d, newVal, oldVal) {
//	        			//                if (fromPicker || !d.isVisible()) {
//	        			//                    showDate(d, newVal);
//	        			//                }
//	        		},
//	        		keypress: {
//	        			buffer: 500,
//	        			fn: function(field){
//	        				var value = field.getValue();
//	        				if (value !== null && field.isValid()) {
//	        					// showDate(field, value);
//	        				}
//	        			}
//	        		},
	        		specialkey : function(fieldObj, e) {
		         		if (e.getKey() == Ext.EventObject.ENTER) {
		         			searchToolBarTap();
		         		}
			        }
	        	},
	        	trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
		         'onTrigger1Click': function() {
		         	Ext.getCmp('po_no').setValue('');
		     	}
			}
	);
	return arrStatesToolBar;
}
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ detailAction, printPDFAction  ]
});

Ext.onReady(function() {  
	console_log('now starting...');
	var statesToolBar = getStatesToolBar();
	LoadJs('/js/util/comboboxtree.js');

//	var searchField = [];
//	searchField.push('po_no');
//	searchField.push('content');
//	makeSrchToolbar(searchField);
	
	Ext.define('RtgAst', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/sales/delivery.do?method=read',
			            create: CONTEXT_PATH + '/sales/delivery.do?method=create',
			            update: CONTEXT_PATH + '/sales/delivery.do?method=create',
			            destroy: CONTEXT_PATH + '/sales/delivery.do?method=destroy'
			        },
					reader: {
						type: 'json',
						root: 'datas',
						totalProperty: 'count',
						successProperty: 'success'
//						excelPath: 'excelPath'
					},
					writer: {
			            type: 'singlepost',
			            writeAllFields: false,
			            root: 'datas'
			        } 
				}
		});
	
	Ext.define('XpoAstAbst', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS_SUB,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/purchase/prch.do?method=readDetail'
//			            create: CONTEXT_PATH + '/purchase/prch.do?method=create',
//			            update: CONTEXT_PATH + '/purchase/prch.do?method=create',
			            //destroy: CONTEXT_PATH + '/purchase/prch.do?method=destroy'
			        },
					reader: {
						type: 'json',
						root: 'datas',
						totalProperty: 'count',
						successProperty: 'success'
//						excelPath: 'excelPath'
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
		model: 'RtgAst',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	storeSub = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'XpoAstAbst',
		//remoteSort: true,
		sorters: [{
			property: 'unique_id',
			direction: 'DESC'
		}]
	});
	store.getProxy().setExtraParam('menu','PPO2');
	store.load(function() {

		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
//		var projectToolBar = getProjectToolbar(false/*hasPaste*/, false/*excelPrint*/) ;
		
		grid = Ext.create('Ext.grid.Panel', {
		        store: store,
		        ///COOKIE//stateful: true,
		        collapsible: false,
//		        multiSelect: true,
		        stateId: 'stateGrid',
		        selModel: selModel,
		        autoScroll : true,
//		        autoHeight: true,
		        width: '60%',
//                height: '100%',
		        region: 'west',
//		        layout:'fit',
		        height: getCenterPanelHeight(),
		        
		        bbar: getPageToolbar(store),
		        
		        dockedItems: [{
		        	xtype: 'toolbar',
		            items:[searchAction,'-', detailAction,'-',printPDFAction] 
		        },{
		        	xtype: 'toolbar',
		        	items: getProjectTreeToolbar() //combotree//projectToolBar
		        },{
		        	xtype: 'toolbar',
		        	items: statesToolBar
		        }],
		        columns: /*(G)*/vCENTER_COLUMNS,
//		        plugins: [cellEditing],
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
		                }
//		                itemdblclick: viewHandler
		            }
		        },
		        title: getMenuTitle()
		    });
		
		 grid.getSelectionModel().on({
		    	selectionchange: function(sm, selections) {
		    		if (selections.length) {
		    			var rec = grid.getSelectionModel().getSelection()[0];
//		    			var state = rec.get('state');
//		    			displaygridSub(selections[0]);
//		    			displayProperty(selections[0]);
		    			if(fPERM_DISABLING()==true) {
//		    				removeAction.disable();	
		    				printPDFAction.disable();
		    				var rec = grid.getSelectionModel().getSelection()[0];
//		    				var unique_id = rec.get('unique_id');
		    				var po_no = rec.get('po_no');
		    				var content = rec.get('content');
		    				var name = rec.get('name');
//		    				var rec = grid.getSelectionModel().getSelection()[0];
//		    				storeSub.getProxy().setExtraParam('unique_id', unique_id);
		    				storeSub.getProxy().setExtraParam('po_no', po_no);
		    				storeSub.getProxy().setExtraParam('content', content);
		    				storeSub.load(function(){});
		    				if(storeSub != null){
		    					gridSub.setTitle('[' + po_no + '] ' + name);
		                	}
		    			}else{
//		    				removeAction.enable();	
		    				printPDFAction.enable();
		    				var rec = grid.getSelectionModel().getSelection()[0];
		    				var unique_id = rec.get('unique_id');
		    				var po_no = rec.get('po_no');
		    				var content = rec.get('content');
		    				var name = rec.get('name');
		    				storeSub.getProxy().setExtraParam('unique_id', unique_id);
		    				storeSub.getProxy().setExtraParam('po_no', po_no);
		    				storeSub.getProxy().setExtraParam('content', content);
		    				storeSub.load(function(){});
		    				if(storeSub != null){
		    					gridSub.setTitle('[' + po_no + '] ' + name);
		                	}
		    			}
		    			detailAction.enable();
	    			}else{
	    				if(fPERM_DISABLING()==true) {
//	    					removeAction.disable();	
	    					printPDFAction.disable();
	    					gridSub.setTitle('-');
		            	}else{
//		            		removeAction.disable();	
		            		printPDFAction.disable();
		            		gridSub.setTitle('-');
		            	}
	    				detailAction.enable();
	    				var unique_id = null;
	    				storeSub.getProxy().setExtraParam('unique_id', unique_id);
	    				storeSub.load(function(){});
		    		}
		    	}
		    });
//		fLAYOUT_CONTENT(grid);
		var selModelC = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		gridSub = Ext.create('Ext.grid.Panel', {
			store: storeSub,
	        ///COOKIE//stateful: true,
//	        collapsible: true,
//	        multiSelect: true,
	        stateId: 'stateGrid',
	        selModel: selModelC,
	        autoScroll : true,
//	        autoHeight: true,
	        region: 'east',
	        layout:'fit',
	        width: '40%',
//            height: '100%',
	        height: getCenterPanelHeight(),
	     // paging bar on the bottom
	        
	        bbar: getPageToolbar(store),
	        
	        dockedItems: [{
	        	xtype: 'toolbar',
	            items: checkOutAction
	        }],
	        columns: /*(G)*/vCENTER_COLUMN_SUB,
//	        plugins: [cellEditing],
	        viewConfig: {
	            stripeRows: true,
	            enableTextSelection: true,
	            listeners: {
	                itemcontextmenu: function(view, rec, node, index, e) {
	                    e.stopEvent();
	                    contextMenu.showAt(e.getXY());
	                    return false;
	                },
	                itemdblclick: function(){
	                }
	            }
	        },
	        title: '-'
//		        renderTo: 'MAIN_DIV_TARGET'
		});
		
	    gridSub.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	    		detailAction.disable();
	    		printPDFAction.disable();
	    		if (selections.length) {
					//grid info 켜기
//					displayProperty(selections[0]);
//					detailAction.enable();
					if(fPERM_DISABLING()==true) {
						checkOutAction.disable();	
					}else{
						checkOutAction.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
		            	checkOutAction.disable(); 
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
		            	checkOutAction.disable(); 
	            	}
	            }
	        }
	    });
	    
//	    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
//	        Ext.create('Ext.tip.ToolTip', config);
//	    });
	    
	    var main =  Ext.create('Ext.panel.Panel', {
	    	title: '',
	        height: getCenterPanelHeight(),
		    layout:'border',
	        border: false,
	        layoutConfig: {columns: 2, rows:1},
		    defaults: {
		        collapsible: true,
		        split: true,
		        cmargins: '5 0 0 0',
		        margins: '0 0 0 0'
		    },
		    items: [grid,gridSub]
		});
		console_log('end create');   
		fLAYOUT_CONTENT(main);  
		cenerFinishCallback();//Load Ok Finish Callback	
	}); //store load
 	console_log('End...');
});
    