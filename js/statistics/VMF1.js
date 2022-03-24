var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': CONTEXT_PATH + '/extjs/ux'
    }
});
 
Ext.require(['Ext.ux.CheckColumn']);

//*****************************GLOBAL VARIABLE**************************/

var grid = null;
var store = null;
var agrid = null;

var ahid_userlist = new Array();
var ahid_userlist_role = new Array();

var sales_price = '';
var quan = '';

var lineGap = 35;
var selectedMoldUid = '';
var selectedAssyUid = '';
var selectedMoldCode = '';
var selectedMoldCoord = '';
var selectedMoldName = '';
var toPjUidAssy = '';	//parent
var toPjUid = '';	//ac_uid

var lineGap = 35;
var selectionLength = 0;



var purchase_requestAction2 = Ext.create('Ext.Action', {
	itemId: 'purchaseButton2',
	iconCls:'my_purchase',
    text: '시간저장',
    disabled: false,
    handler: function(widget, event) {
    	

    	var modifiend = [];

    	//console_log('store.data.items.length=' + store.data.items.length);
        for (var j = 0; j < grid.store.data.items.length; j++)
        {
              var record = grid.store.data.items [j];
              if (record.dirty) {
	              //console_log(record);
		    	  for(var i = 0 ; i<20; i++) {
		    			var str = '' + (i+1);
		    			if(str.length<2) {
		    				str = '0' + str;
		    			}
		    			var obj = {};
                       	if(record.get('ast_uid' + str)>0){
                       	obj['unique_id'] = record.get('ast_uid' + str);// //pcs_code, pcs_name...
                       	obj['complish_plan'] = record.get('complish_plan'+str);
                       	obj['complished_date'] = record.get('complished_date'+str);
                       	
                       	//obj['std_mh'] = record.get('std_mh');
                       	//obj['description'] = record.get('description');
                       	modifiend.push(obj);
                       	}
		    			var checked = record.get('checked' + str);
		    			var ast_uid = record.get('ast_uid' + str);
		    			//var process = record.get('process' + str);
//		    			if(ast_uid!='-1') {
//		    				console_log(ast_uid + ':' + checked);
//		    			}
//		    			if(record.dirty) {
//		    				modified.push(ast_uid);	
//		    			}
		    	 }
              }
              
              
             
              

             
        }
        if(modifiend.length>0) {
          	
      	  console_log(modifiend);
      	  var strmod =  Ext.encode(modifiend);
      	  console_log(strmod);
      	  
     	    Ext.Ajax.request({
   			url: CONTEXT_PATH + '/production/pending.do?method=modifyStdList',
   			params:{
   				modifyIno: strmod//,
   				//srcahd_uid:unique_id
   			},
   			success : function(result, request) {   
   				store.load(function() {});
   			}
     	    });
        }
        
        //printSelected(modifiend);
    	
    }//endof handlwe
});//endof define action

var addAction = Ext.create('Ext.Action', {
	itemId: 'saveButton',
	iconCls:'Save',
    text: panelSRO1133,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {
    	

    	
    	var finish_plan ='';
    	var finish_plan_date ='';
    	var finish_plan_time ='';
    	var pcsmapuid ='';

    	//console_log('store.data.items.length=' + store.data.items.length);
        for (var j = 0; j < store.data.items.length; j++)
        {
        	var modifiend = [];
              var record = store.data.items [j];
              if (record.dirty) {
            	  for(var i = 0 ; i<20; i++) {		    			
            		  var str = '' + (i+1);		    			
            		  if(str.length<2) {		    			
            			  str = '0' + str;		    			
            		  }
	              //console_log(record);
//            		  finish_plan = record.get('finish_plan');
//            		  finish_plan = record.get('finish_plan_date')record.get('finish_plan_time');
            		  finish_plan_date = record.get('finish_plan_date');
            		
            		  finish_plan_time = record.get('finish_plan_time'); 
            		  //finish_plan = finish_plan_date.substring(0,10)+' '+finish_plan_time.substring(12,17);
            		  pcsmapuid = record.get('unique_uid');
		              if( record.get('ast_uid' + str)>0){		    						    	
		            	  var obj = {};                
		            	  obj['unique_id'] = record.get('ast_uid' + str);// //pcs_code, pcs_name...                
		            	  obj['complish_plan'] = record.get('complish_plan'+str);
		            	  obj['complished_date'] = record.get('complished_date'+str);
		            	  obj['std_mh'] = record.get('std_mh'+str);                  
		            	  //obj['std_mh'] = record.get('std_mh');                  
		            	  //obj['description'] = record.get('description');
		            	  modifiend.push(obj);	    			
		              }
            	  }
	        }
              if(modifiend.length>0) {
                	
            	  console_log(modifiend);
            	  var strmod =  Ext.encode(modifiend);
            	  console_log(strmod);
            	  
           	    Ext.Ajax.request({
         			url: CONTEXT_PATH + '/production/pending.do?method=autosetdate',
         			params:{
         				modifyIno: strmod,
         				finish_plan: finish_plan,
         				finish_plan_date:finish_plan_date,
         				finish_plan_time:finish_plan_time,
         				pcsmapuid:pcsmapuid
         			},
         			success : function(result, request) {   
         				store.load(function() {});
         			}
           	    });
              }
        }
        
        
        
//        
//       	    Ext.Ajax.request({
//     			url: CONTEXT_PATH + '/production/pending.do?method=autosetdate',
//     			params:{
//     				modifyIno: strmod,
//     				finish_plan : finish_plan
//     				//srcahd_uid:unique_id
//     			},
//     			success : function(result, request) {   
//     				store.load(function() {});
//     			}
//       	    });

		    		   	
    	
    }//endof handlwe
});//endof define action

var updown =
{
	text: Position,
    menuDisabled: true,
    sortable: false,
    xtype: 'actioncolumn',
    width: 60,
    items: [{
        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_up.png',  // Use a URL in the icon config
        tooltip: 'Up',
        handler: function(grid, rowIndex, colIndex) {

//        	var record = grid.getStore().getAt(rowIndex);
//        	var unique_id = record.get('unique_id');
//			if(unique_id!='') {
//	        	var command ='up:' + unique_id;
//	        	console_log('srcahd_uid:' +selectedUid + " ::: " + command);
//	        	
//	        	//storePcsStd.getProxy().setExtraParam('srcahd_uid', '');
//            	storePcsStd.getProxy().setExtraParam('srcahd_uid', selectedUid);
//            	storePcsStd.getProxy().setExtraParam('command', command);
//            	storePcsStd.load(function(){});
//            	
//			}
			 	

        }
    },{
        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_down.png',   // Use a URL in the icon config
        tooltip: 'Down',
        handler: function(grid, rowIndex, colIndex) {

//        	var record = grid.getStore().getAt(rowIndex);
//        	var unique_id = record.get('unique_id');
//			if(unique_id!='') {
//	        	var command ='down:' + unique_id;
//	        	console_log('srcahd_uid:' +selectedUid + " ::: " + command);
//	        	
//	        	//storePcsStd.getProxy().setExtraParam('srcahd_uid', '');
//            	storePcsStd.getProxy().setExtraParam('srcahd_uid', selectedUid);
//            	storePcsStd.getProxy().setExtraParam('command', command);
//            	storePcsStd.load(function(){});
//            	
//			}
        }
    }]
};

function printSelected(modifiend) {
//	console_log('count is : ' + modified.length);
//	for(var i=0; i<modified.length; i++) {
//		var o = modified[i];
//		console_log(o);
//
//	}
	if(modifiend.length>0) {
    	
  	  console_log(modifiend);
  	  var  modstr=  Ext.encode(modifiend);
  	  console_log(modstr);
	}
}
function checkVal(rec, col, val, row) {

	for(var i = 0 ; i<20; i++) {
		var str = '' + (i+1);
		if(str.length<2) {
			str = '0' + str;
		}
		var process = rec.get('process' + str);
		var inout_type = rec.get('inout_type' + str);
		if(process=='' && col == (i+1)*2+4) {
			return '';
		} else if(inout_type!=''  && col == (i+1)*2+4) {
			if(inout_type=='OUT') {
				return inout_type;
			} else {
				return (new Ext.ux.CheckColumn()).renderer(val);	
			}
		}
	}
	return 'WAIT';
	//return (new Ext.ux.CheckColumn()).renderer(val);	
}


function item_code_dash(item_code){
	if(item_code==null || item_code.length<13) {
		return item_code;
	}else {
		return item_code.substring(0,12);
	}
}


function resetParam() {
	store.getProxy().setExtraParam('unique_id', '');
	store.getProxy().setExtraParam('item_code', '');
	store.getProxy().setExtraParam('item_name', '');
	store.getProxy().setExtraParam('specification', '');
}
 
var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

//var printExcel = Ext.create('Ext.Action', {
//	itemId: 'printExcelButton',
//    iconCls: 'MSExcelX',
//    text: 'Excel Print',
//    disabled: false ,
//    handler: printExcelHandlerDbm1
//});


function Item_code_dash(item_code){
		return item_code.substring(0,5) + "-" + item_code.substring(5, 9) + "-" +
				item_code.substring(9, 12);
}


//*****************************MODEL**************************/
vCENTER_FIELDS.push({ name: 'finish_plan_date', type: 'date', dateFormat:'Y-m-d'});
vCENTER_FIELDS.push({ name: 'finish_plan_time', type: 'date', dateFormat:'H:i'});
for(var i=0; i<20; i ++) {
	
	var str = '' + (i+1);
	if(str.length<2) {
		str = '0' + str;
	}
	
	vCENTER_FIELDS.push({ name: 'checked' + str, type: 'boolean'});
	vCENTER_FIELDS.push({ name: 'process' + str, type: 'string'});
	vCENTER_FIELDS.push({ name: 'std_mh' + str, type: 'string'});
	vCENTER_FIELDS.push({ name: 'real_mh' + str, type: 'string'});
	vCENTER_FIELDS.push({ name: 'complish_plan' + str, type: 'date', dateFormat:'m-d H:i'});
	vCENTER_FIELDS.push({ name: 'complished_date' + str, type: 'date', dateFormat:'m-d H:i'});
	vCENTER_FIELDS.push({ name: 'inout_type' + str, type: 'string'});
	vCENTER_FIELDS.push({ name: 'ast_uid' + str, type: 'string'});
	
}

Ext.define('CartLineProcessPlan', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/production/pending.do?method=read', 					/*1recoed, search by cond, search */
	            create: CONTEXT_PATH + '/production/pending.do?method=create', 			/*create record, update*/
	            update: CONTEXT_PATH + '/production/pending.do?method=create'
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

Ext.define('Processing', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            create: CONTEXT_PATH + '/production/pcsrequest.do?method=create'			/*create record, update*/
	        },
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        } 
		}
});

Ext.define('RtgAst', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            create: CONTEXT_PATH + '/design/bom.do?method=createPurchasing'
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




function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_uid = rec.get('unique_uid');
	           	 var partline = Ext.ModelManager.create({
	           		unique_uid : unique_uid
	        	 }, 'CartLineProcessPlan');
        		
	           	partline.destroy( {
	           		 success: function() {}
	           	});  	
        	}
        	grid.store.remove(selections);
        }
    }
};

function process_requestConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	
        	var unique_ids = [];
        	
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_uid = rec.get('unique_uid');
        		unique_ids.push(unique_uid);
	           	 
        	}//enoffor
        	
        	console_log(unique_ids);
        	var process = Ext.ModelManager.create({
           		unique_uid : unique_ids
        	 }, 'Processing');
           	 
           	process.save( {
           		 success: function() {
//           			alert('process');
           		 }//endofsuccess
           	});//endofsave
        	
        	
        }//endofif yes
    }//endofselection
};

var prWin = null;
var unique_uid = new Array();






searchField = [];

Ext.onReady(function() {  
	LoadJs('/js/util/comboboxtree.js');
	//LoadJsMessage(); --> main으로 이동
	Ext.define('RtgApp', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS_SUB,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=readRtgapp',
//			            create: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgapp',
			            destroy: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp'
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
	
	console_log('now starting...');
	   
		     
		    	//PartLine Store 정의
		    	store = new Ext.data.Store({  
		    		pageSize: getPageSize(),
		    		model: 'CartLineProcessPlan',
		    		//remoteSort: true,
		    		sorters: [{
		                property: 'unique_id',
		                direction: 'DESC'
		            }]
		    	});
		    	
		    	
		    	store.load(function(records) {
		    		console_log('-----------------------------------------------------------------------------------'); 
 					console_log(records); 
 					console_log('-----------------------------------------------------------------------------------'); 
 					
 					var len = -1;
 					if(records != undefined && records != null) {
 						 for (var i=0; i<records.length; i++){ 
	   	   	                	var line = records[i];
	   	   	                	//console_log(line.get('lineQty'));
	   	   	                	var lineQty = Number( line.get('lineQty'));
	   	   	                	
	   	   	                	console_log('lineQty=' + lineQty);      	
	   	   	                	if(lineQty>len) {
	   	   	                		len = lineQty;
	   	   	                	}
 						 }
 					}
 					if(len<0) {
 						len = 20;
 					}
 					var finish_plan = '완료계획';
 					vCENTER_COLUMNS.push({header:vmf1_finish_plan,
 						columns:[{header:'日期', dataIndex: 'finish_plan_date',	
 							width : 80,  align: 'center',resizable:false,sortable : false,
 							summaryType: 'max',
 							renderer: Ext.util.Format.dateRenderer('Y-m-d'),
 							summaryRenderer: Ext.util.Format.dateRenderer('Y-m-d'),
 							field: {
 			                    xtype: 'datefield',
 			                    format: 'Y-m-d'
 			                }
 						},
 						{header:'时间', dataIndex: 'finish_plan_time', 
 							width : 50,  align: 'center',resizable:false,sortable : false,
 							summaryType: 'max',
 							renderer: Ext.util.Format.dateRenderer('H:i'),
 							summaryRenderer: Ext.util.Format.dateRenderer('H:i'),
 						        field:{
 						        	xtype: 'timefield',
 						        	format: 'H:i',
// 						        submitFormat: 'H:i',
// 						       renderer: Ext.util.Format.dateRenderer('H:i'),
// 						       minValue: '6:00 AM',
// 						        maxValue: '8:00 PM',
 						        	increment: 15}
 						    		}
 						         ]
 						 						
 					}
 							);

		    		for(var i=0; i<len; i ++) {
		    			
		    			var str = '' + (i+1);
		    			if(str.length<2) {
		    				str = '0' + str;
		    			}
		    			
		    			
		    			
		    			
		    			vCENTER_COLUMNS.push(
		    					{ header: str,
		    						columns: [
										{ header:'工序', dataIndex: 'process' + str, width : 40,  align: 'center',resizable:false,sortable : false},
										{ header:'标准工时', dataIndex: 'std_mh' + str, width : 40,  align: 'center',resizable:false,sortable : false},
										{ header:'实际工时', dataIndex: 'real_mh' + str, width : 40,  align: 'center',resizable:false,sortable : false},
										{ header:'计划完成时间', dataIndex: 'complish_plan' + str,
											width : 100,  align: 'center',resizable:false,sortable : false,
				 							summaryType: 'max',
				 							renderer: Ext.util.Format.dateRenderer('m-d H:i'),
				 							summaryRenderer: Ext.util.Format.dateRenderer('m-d H:i')
//				 							field: {
//				 			                    xtype: 'datecolumn',
//				 			                    format: 'm-d H:i'
//				 			                }
				 							},
										{ header:'实际完成时间', dataIndex: 'complished_date' + str,
				 			                	width : 100,  align: 'center',resizable:false,sortable : false,
					 							summaryType: 'max',
					 							renderer: Ext.util.Format.dateRenderer('m-d H:i'),
					 							summaryRenderer: Ext.util.Format.dateRenderer('m-d H:i')
//					 							field: {
//					 			                    xtype: 'datecolumn',
//					 			                    format: 'm-d H:i'
//					 			                }
				 			                }
		    						]
		    					});
		    		}
		    		
		    		
		    		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
						
						var dataIndex = columnObj["dataIndex"];
						
						
//						if('finish_plan_date'== dataIndex){
//							columnObj["renderer"] = renderSimpleDate({ dataIndex: dataIndex });
//							}
//						if('finish_plan_time'== dataIndex){
//							columnObj["renderer"] = renderDetailDate({ dataIndex: dataIndex });
//						}
//						console_log(dataIndex);
//						
//						var columnObj = {};
//						columnObj["header"] = inColumn["text"];
////						columnObj["width"] = inColumn["width"];
////						columnObj["sortable"] = inColumn["sortable"];
//						columnObj["dataIndex"] = dataIndex;
						columnObj["flex"] =1;
						
						if(dataIndex!='no') {
							
							
							if('finish_plan' == dataIndex) {
						        columnObj["editor"] = {
						        	summaryType: 'max',
						        	renderer: Ext.util.Format.dateRenderer('Y-m-d H:i'),
						            summaryRenderer: Ext.util.Format.dateRenderer('Y-m-d H:i'),
				                    xtype: 'datefield',
				                    format: 'Y-m-d H:i',
				                    allowBlank:false
				                };
							} /*else if('description' == dataIndex) {
						        columnObj["editor"] = new Ext.form.field.ComboBox({
						            typeAhead: true,
						            triggerAction: 'all',
						            selectOnTab: true,
						            mode: 'remote',
						            queryMode: 'remote',
		                            editable:true,
		                            allowBlank: false,
					                displayField:   'systemCode',
					                valueField:     'systemCode',
					                store: stdProcessNameStore,
						            listClass: 'x-combo-list-small',
			   	   	               	listeners: {	}
						        });
							}*/
//							
//							
//							else {
//								columnObj["editor"] = {
//				                };	
//							}
							
						}
		
					});
		    		
		    		
		    		

		    grid = Ext.create('Ext.grid.Panel', {
		    		id: 'gridBom',
			        title: '',
			        store: store,
			        ///COOKIE//stateful: true,
			        collapsible: true,
			        multiSelect: true,
			        //selModel: selModel,
			        stateId: 'stateGridBom'+ /*(G)*/vCUR_MENU_CODE,
	                region: 'center',
	                width:'60%',
			        //layout: 'fit',
			        height: getCenterPanelHeight(),
			        
			        bbar: getPageToolbar(store),	        
			        
			        dockedItems: [
	    		      				{
	    		      					dock: 'top',
	    		      				    xtype: 'toolbar',
	    		      				    items: [
	    		      				           addAction, '-', //purchase_requestAction2, '-',
	    		      				         '->'
	    		      				         ]
	    		      				},
	    		      				{
	    		      					xtype: 'toolbar',
	    		      					items: //projectToolBar
	    		      						getProjectTreeToolbar()
	    		      				}
	    		              ],
			        columns: /*(G)*/vCENTER_COLUMNS,
			        plugins: [cellEditing],
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            listeners: {
			            	'afterrender' : function(grid){
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
			            }
			        },

		    		title: getMenuTitle()
			    });
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	selectionLength = selections.length;

		            if (selections.length) {
		            	//grid info 켜기
		            	//displayProperty(selections[0]);
		            	
		            	if(fPERM_DISABLING()==true) {
			            	addAction.disable();
			            	purchase_requestAction2.disable();
		            	}else{
			            	addAction.enable();
			            	purchase_requestAction2.enable();
		            	}
		            } else {
		            	if(fPERM_DISABLING()==true) {
			            	collapseProperty();
			            	addAction.disable();
			            	purchase_requestAction2.disable();
		            	}else{
		            		collapseProperty();

			            	addAction.disable();
			            	purchase_requestAction2.disable();

		            	}
		            }
		        }
		    });
		    
		    
		    
		    
			var main =  Ext.create('Ext.panel.Panel', {
					 height: getCenterPanelHeight(),

			            layoutConfig: {columns: 2},
			            split: true,
				    layout:'border',
				    border: false,
				    defaults: {
				        collapsible: true,
				        split: true,
				        cmargins: '5 0 0 0',
				        margins: '0 0 0 0'
				    },
				
				    items: [  /*gridProjectMold,*/
				              grid
		           ]

				});
			fLAYOUT_CONTENT(main);
//			console_log('end create');   
		    
//		}//endof else
 	});
		cenerFinishCallback();//Load Ok Finish Callback
//		}
//		}); 
});	//OnReady

