var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

// *****************************GLOBAL VARIABLE**************************/
var grid = null;
var store = null;
var agrid = null;

var ahid_userlist = new Array();
var ahid_userlist_role = new Array();

var sales_price = '';
var quan = '';

var lineGap = 35;
var selectedMoldUid = '';
var selectedPjUid = '';
var selectedAssyUid = '';
var selectedAssyhier_pos = '';
var selectedAssyhier_posfull = '';
var createAssyhier_pos = '';
var selectedMoldCode = '';
var selectedMoldCoord = '';
var selectedMoldName = '';
var toPjUidAssy = '';	// parent
var toPjUid = '';	// ac_uid
var lineGap = 35;
var selectionLength = 0;

var commonUnitStore = null;
var commonCurrencyStore = null;
var commonModelStore = null;
var commonStandardStore =null;
var assy_pj_code='';
var assy_code='';
var combo_pj_code='';
var combo_pj_name='';
var assy_level='';
var assyname ='';
var selectedparent ='';
var ac_uid = '';

var addpj_code = '';

var cloudprojectStore = Ext.create('Mplm.store.cloudProjectStore', {} );
var cloudProjectTreeStore = Ext.create('Mplm.store.cloudProjectTreeStore', {});
var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {} );
var routeGubunTypeStore_W = Ext.create('Mplm.store.RouteGubunTypeStore_W', {} );
function item_code_dash(item_code){
	if(item_code==null || item_code.length<13) {
		return item_code;
	}else {
		return item_code.substring(0,12);
	}
}

function 
cleanComboStore(cmpName)
{
    var component = Ext.getCmp(cmpName); 
    
    component.setValue('');
    component.setDisabled(false);
	console_log('     cleanComboStore.....');
	component.getStore().removeAll();
	console_log('     removeAll ok');
	component.setValue(null);
	console_log('     setValue null ok');
	component.getStore().commitChanges();
	console_log('     commitChanges ok');
	component.getStore().totalLength = 0;
	console_log('     totalLength=0 ok');

}

function resetParam() {
	store.getProxy().setExtraParam('unique_id', '');
	store.getProxy().setExtraParam('item_code', '');
	store.getProxy().setExtraParam('item_name', '');
	store.getProxy().setExtraParam('specification', '');
}

function srchTreeHandler (treepanel, store, widName, parmName) {
	
	console_info("srchSingleHandler");
	treepanel.setLoading(true);
	
	resetParam(store, searchField);
	var val = Ext.getCmp(widName).getValue();
	console_log('val'+val);

// var enValue = null;
// if(val!=null && val != '') {
// enValue = Ext.JSON.encode(val);
// console_log(enValue);
// } else { }
	store.getProxy().setExtraParam(parmName, val);
	
	store.load({
	    callback: function(records, operation, success) {
	    	console_log('load tree store');
	    	console_log('ok');
	    	treepanel.setLoading(false);
	        // treepanel.expandAll();
	    }                               
	});
};




var addElecHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_uid = rec.get('unique_uid');
	var standard_flag = rec.get('standard_flag');
	if(standard_flag=='E') {
		Ext.MessageBox.alert(error_msg_prompt,'Electrod can not be a parent of a Electrod.');
		return;
	}
	
	PartLine.load(unique_uid ,{
		 success: function(partline) {
			 
			var unique_uid =  partline.get('unique_uid');
			Ext.Ajax.request({
				url: CONTEXT_PATH + '/design/bom.do?method=addElectrod',				
				params:{
					unique_uid : unique_uid
				},
				success : function(result, request) {
					store.load(function() {});
				},// endof success for ajax
				failure: extjsUtil.failureMessage
			}); // endof Ajax
            	
		 }// endofsuccess
	 });// emdofload
};


 var editHandler = function() {
		var rec = grid.getSelectionModel().getSelection()[0];
		var unique_uid = rec.get('unique_uid');

		PartLine.load(unique_uid ,{
			 success: function(partline) {
			        var win = Ext.create('ModalWindow', {
			        	title: CMD_MODIFY  + ' :: ' + /* (G) */vCUR_MENU_NAME,
			            width: 700,
			            height: 550,
			            minWidth: 250,
			            minHeight: 180,
			            layout: 'fit',
			            plain:true,
			            items: createEditForm(partline),
			            buttons: [{
			                text: CMD_OK,
			            	handler: function(){
			                    var form = Ext.getCmp('formPanel').getForm();
			                    if(form.isValid())
			                    {
			                	var val = form.getValues(false);
			                	console_info(Ext.JSON.encode(val));
			                	val["file_itemcode"] = /* (G) */vFILE_ITEM_CODE;
			                	console_info(Ext.JSON.encode(val));
			                	var partline = Ext.ModelManager.create(val, 'PartLine');
			            		// 저장 수정
			                	partline.save({
			                		success : function() {
			                           	if(win) 
			                           	{
			                           		win.close();
			                           		store.load(function() {});
			                           	} 
			                		} 
			                	 });
			                	
			                       	if(win) 
			                       	{
			                       		win.close();
			                       		// lfn_gotoHome();
			                       	} 
			                    } else {
			                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
			                    }
			                  }
			            },{
			                text: CMD_CANCEL,
			            	handler: function(){
			            		if(win) {
			            			win.close();}
			            			// lfn_gotoHome();
			            		}
			            }]
			        });
			        win.show();
					// endofwin
			 }// endofsuccess
		 });// emdofload
};

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

var editAction = Ext.create('Ext.Action', {
	itemId: 'editButton',
    iconCls: 'pencil',
    text: edit_text,
    disabled: true ,
    handler: editHandler
});

var addElecAction = Ext.create('Ext.Action', {
	itemId: 'addElecButton',
    iconCls: 'lightbulb_add',
    text: dbm1_add_electrode,
    disabled: true ,
    handler: addElecHandler
});

function Item_code_dash(item_code){
		return item_code.substring(0,5) + "-" + item_code.substring(5, 9) + "-" +
				item_code.substring(9, 12);
}

var PmaterialStore = new Ext.create('Ext.data.Store', {
 	fields:[     
 	  	      { name: 'parent_class_code', type: "string"  }
 	  	      ,{ name: 'class_name', type: "string" }
 	  	      ,{ name: 'class_code_full', type: "string"  }  
 	  	      ,{ name: 'level', type: "string"  } 
  	  ],	
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/design/class.do?method=read',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         },
         extraParams : {
        	 level: '',
        	 parent_class_code: ''
         }
         ,autoLoad: true
     	}
 });

var CmaterialStore = new Ext.create('Ext.data.Store', {

	fields:[     
	        { name: 'parent_class_code', type: "string"  }
	        ,{ name: 'class_name', type: "string" }
	        ,{ name: 'class_code_full', type: "string"  }  
	        ],	
	        proxy: {
	        	type: 'ajax',
	        	url: CONTEXT_PATH + '/design/class.do?method=read',
	        	reader: {
	        		type:'json',
	        		root: 'datas',
	        		totalProperty: 'count',
	        		successProperty: 'success'
	        	},
	        	extraParams : {
	        		level: '',
	        		parent_class_code: ''
	        	}
	        	,autoLoad: true
	        }
});

// *****************************MODEL**************************/


Ext.define('AssyLine', {
	 extend: 'Ext.data.Model',
	 fields: /* (G) */vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            // read: CONTEXT_PATH + '/design/bom.do?method=read', /*1recoed,
				// search by cond, search */
	            create: CONTEXT_PATH + '/design/bom.do?method=cloudAssycreate' 			/*
																						 * create
																						 * record,
																						 * update
																						 */
// update: CONTEXT_PATH + '/design/bom.do?method=update',
// destroy: CONTEXT_PATH + '/design/bom.do?method=destroy' /*delete*/
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

Ext.define('PartLine', {
	 extend: 'Ext.data.Model',
	 fields: /* (G) */vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/design/bom.do?method=cloudread&menu_code=PPO5_CLD', 					/*
																							 * 1recoed,
																							 * search
																							 * by
																							 * cond,
																							 * search
																							 */
	            create: CONTEXT_PATH + '/design/bom.do?method=create', 			/*
																				 * create
																				 * record,
																				 * update
																				 */
	            update: CONTEXT_PATH + '/design/bom.do?method=create',
	            destroy: CONTEXT_PATH + '/design/bom.do?method=destroy' 			/* delete */
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
	 fields: /* (G) */vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            create: CONTEXT_PATH + '/production/pcsrequest.do?method=create'			/*
																							 * create
																							 * record,
																							 * update
																							 */
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
	 fields: /* (G) */vCENTER_FIELDS,
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


Ext.define('NxExcel', {
	 extend: 'Ext.data.Model',
	 fields:  [ { name: 'file_itemcode', 	type: "string"    }     ],
	    proxy: {
			type: 'ajax',
	        api: {
	        	create: CONTEXT_PATH + '/design/upload.do?method=excelBom' /*
																			 * 1recoed,
																			 * search
																			 * by
																			 * cond,
																			 * search
																			 */
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
	        	 }, 'PartLine');
        		
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
	           	 
        	}// enoffor
        	
        	console_log(unique_ids);
        	var process = Ext.ModelManager.create({
           		unique_uid : unique_ids
        	 }, 'Processing');
           	 
           	process.save( {
           		 success: function() {
// alert('process');
           		 }// endofsuccess
           	});// endofsave
        	
        	
        }// endofif yes
    }// endofselection
};

// Define Remove Action
var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteConfirm,
            // animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

// Define process_request Action
var process_requestAction = Ext.create('Ext.Action', {
	itemId: 'process_requestButton',
    iconCls: 'production',
    text: PROCESS_REQUEST,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: epc1_process_msg,
            buttons: Ext.MessageBox.YESNO,
            fn: process_requestConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});


var prWin = null;
var unique_uid = new Array();
// 구매요청
var purchase_requestAction = Ext.create('Ext.Action', {
	
	itemId: 'purchaseButton',
	iconCls:'my_purchase',
    text: PURCHASE_REQUEST,
    disabled: true,
    handler: function(widget, event) {
    	var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
    	
    	var lineGap = 30;
// var rec = grid.getSelectionModel().getSelection()[0];
    	var selections = grid.getSelectionModel().getSelection();
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		unique_uid[i] = rec.get('unique_uid');
// alert(unique_uid[i]);
    	}
    	
    	var item_name = rec.get('item_name');
    	var item_code = rec.get('item_code');
// var sales_price = selections.get('sales_price');
// var quan = selections.get('quan');
// var ac_uid = selections.get('ac_uid');
    	
    	var rtgapp_store = new Ext.data.Store({  
    		pageSize: getPageSize(),
    		model: 'RtgApp'});
    	
    	function deleteRtgappConfirm(btn){

    	    var selections = agrid.getSelectionModel().getSelection();
    	    if (selections) {
    	        var result = MessageBox.msg('{0}', btn);
    	        if(result=='yes') {
    	        	for(var i=0; i< selections.length; i++) {
    	        		var rec = agrid.getSelectionModel().getSelection()[i];
    	        		var unique_id = rec.get('unique_id');
    		           	 var rtgapp = Ext.ModelManager.create({
    		           		unique_id : unique_id
    		        	 }, 'RtgApp');
    	        		
    		           	rtgapp.destroy( {
    		           		 success: function() {}
    		           	});  	
    	        	}
    	        	agrid.store.remove(selections);
    	        }
    	    }
    	};
    	
    	var removeRtgapp = Ext.create('Ext.Action', {
    		itemId: 'removeButton',
    	    iconCls: 'remove',
    	    text: CMD_DELETE,
    	    disabled: true,
    	    handler: function(widget, event) {
    	    	Ext.MessageBox.show({
    	            title:delete_msg_title,
    	            msg: delete_msg_content,
    	            buttons: Ext.MessageBox.YESNO,
    	            fn: deleteRtgappConfirm,
    	            // animateTarget: 'mb4',
    	            icon: Ext.MessageBox.QUESTION
    	        });
    	    }
    	});
    	
    	var updown =
    	{
    		text: Position,
    	    menuDisabled: true,
    	    sortable: false,
    	    xtype: 'actioncolumn',
    	    width: 60,
    	    items: [{
    	        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_up.png',  // Use
																					// a
																					// URL
																					// in
																					// the
																					// icon
																					// config
    	        tooltip: 'Up',
    	        handler: function(agridV, rowIndex, colIndex) {


    	        	var record = agrid.getStore().getAt(rowIndex);
    	        	console_log(record);
    	        	var unique_id = record.get('unique_id');
    	        	console_log(unique_id);
    	        	var direcition = -15;
    	        	Ext.Ajax.request({
	         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
	         			params:{
	         				direcition:direcition,
// modifyIno: str,
	         				unique_id:unique_id
	         			},
	         			success : function(result, request) {   
	         				rtgapp_store.load(function() {});
	         			}
	           	    });


// for (var i = 0; i <agrid.store.data.items.length; i++)
// {
// var record = agrid.store.data.items [i];
// //
// if (i==rowIndex) {
// rtgapp_store.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
// var obj = {};
// obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
// obj['gubun'] = record.get('gubun');
// obj['owner'] = record.get('owner');
// obj['change_type'] = record.get('change_type');
// obj['app_type'] = record.get('app_type');
// obj['usrast_unique_id'] = record.get('usrast_unique_id');
// obj['seq'] = record.get('seq');
// obj['updown'] = -14;
//    	                       	
// modifiend.push(obj);
// }
    	              
// if(modifiend.length>0) {
//    	            	
// console_log(modifiend);
// var str = Ext.encode(modifiend);
// console_log(str);
//    	            	  

// }
    	            	
    				}
    				 	

// }

    	    },{
    	        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_down.png',   // Use
																					// a
																					// URL
																					// in
																					// the
																					// icon
																					// config
    	        tooltip: 'Down',
    	        handler: function(agridV, rowIndex, colIndex) {

    	        	var record = agrid.getStore().getAt(rowIndex);
    	        	console_log(record);
    	        	var unique_id = record.get('unique_id');
    	        	console_log(unique_id);
    	        	var direcition = 15;
    	        	Ext.Ajax.request({
	         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
	         			params:{
	         				direcition:direcition,
// modifyIno: str,
	         				unique_id:unique_id
	         			},
	         			success : function(result, request) {   
	         				rtgapp_store.load(function() {});
	         			}
	           	    });

//
// for (var i = 0; i <agrid.store.data.items.length; i++)
// {
// var record = agrid.store.data.items [i];
// //
// if (i==rowIndex) {
// rtgapp_store.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
// // var obj = {};
// // obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
// // obj['gubun'] = record.get('gubun');
// // obj['owner'] = record.get('owner');
// // obj['change_type'] = record.get('change_type');
// // obj['app_type'] = record.get('app_type');
// // obj['usrast_unique_id'] = record.get('usrast_unique_id');
// // obj['seq'] = record.get('seq');
// // obj['updown'] = 16;
// //
// // modifiend.push(obj);
// }
//    	              
// if(modifiend.length>0) {
//    	            	
// console_log(modifiend);
// var str = Ext.encode(modifiend);
// console_log(str);
//    	            	  
// Ext.Ajax.request({
// url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
// params:{
// direcition:direcition,
// // modifyIno: str,
// unique_id:unique_id
// },
// success : function(result, request) {
// rtgapp_store.load(function() {});
// }
// });
// // }
//    	            	
// }
//    				 	

    	        }

    	    }]
    	};
    	
    	var tempColumn = [];
    	
    	tempColumn.push(updown);
    	
    	for(var i=0; i<vCENTER_COLUMN_SUB.length; i++) {
    		tempColumn.push(vCENTER_COLUMN_SUB[i]);
    	}

//    	
// if(upno == true){
// /*(G)*/vCENTER_COLUMN_SUB.splice(0, 0, updown);
// upno=false;
// }
    	
    	rtgapp_store.load(function() {
    		
    		
    		Ext.each( /* (G) */tempColumn, function (columnObj, index,value) {
                
                var dataIndex = columnObj["dataIndex" ];
// console_log(dataIndex);
//             
// var columnObj = {};
// columnObj["header"] = inColumn["text"];
// // columnObj["width"] = inColumn["width"];
// // columnObj["sortable"] = inColumn["sortable"];
// columnObj["dataIndex"] = dataIndex;
               columnObj[ "flex" ] =1;
               
                if (value!="W" && value!='기안') {
                      
                       if ('gubun' == dataIndex) {
                             
                              var combo = null ;
                              // the renderer. You should define it within a
								// namespace
                              var comboBoxRenderer = function (value, p, record) {
                                    
// console_log('##########3' + value);
// console_log(p);
// console_log(record);
// console_log(combo);
                                    
                                     if (value=='W' || value=='기안') {

                                    } else {
                                       console_log('combo.valueField = ' + combo.valueField + ', value=' + value);
                                       console_log(combo.store);
                                       var idx = combo.store.find(combo.valueField, value);
                                       console_log(idx);
                                       var rec = combo.store.getAt(idx);
                                       console_log(rec);
                                       return (rec === null ? '' :  rec.get(combo.displayField) );
                                    }

                             };
                             
                             combo = new Ext.form.field.ComboBox({
                           typeAhead: true ,
                           triggerAction: 'all',
                           selectOnTab: true ,
                           mode: 'local',
                           queryMode: 'remote',
                editable: false ,
                allowBlank: false ,
                         displayField:   'codeName' ,
                         valueField:     'codeName' ,
                         store: routeGubunTypeStore_W,
                           listClass: 'x-combo-list-small' ,
                              listeners: {  }
                       });
                       columnObj[ "editor" ] = combo;
// columnObj["renderer"] = comboBoxRenderer;
                       columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
				        	p.tdAttr = 'style="background-color: #FFE4E4;"';
				        	return value;
			        	};
                      
                
                      }
                      
               }

         });

    		
    		// grid create
    		agrid = Ext.create('Ext.grid.Panel', {
    			title: routing_path,
    			// layout: 'form',
    		    store: rtgapp_store,
    		    layout: 'fit',
    		    columns : tempColumn,
    		    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
    		    	clicksToEdit: 1
    		    })],
// viewConfig: {
// stripeRows: true,
// enableTextSelection: true,
// listeners: {
// itemcontextmenu: function(view, rec, node, index, e) {
// e.stopEvent();
// contextMenu.showAt(e.getXY());
// return false;
// }
//
// }
// },
// // width: 700,
// height: 100,
// autoHeight: true,
// autoWidth: true,
    		    border: false,
    		    multiSelect: true,
    		    frame: false 
// fieldDefaults: {
// labelAlign: 'middle',
// msgTarget: 'side'
// },
// defaults: {
// anchor: '100%',
// labelWidth: 100
// }
    		    ,
    		    dockedItems: [{
    				xtype: 'toolbar',
    				items: [{
    					fieldLabel: dbm1_array_add,
    					labelWidth: 42,
    					id :'user_name',
    			        name : 'user_name',
    			        xtype: 'combo',
    			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
    			        store: userStore,
    			        labelSeparator: ':',
    			        emptyText:   dbm1_name_input,
    			        displayField:   'user_name',
    			        valueField:   'unique_id',
    			        sortInfo: { field: 'user_name', direction: 'ASC' },
    			        typeAhead: false,
    		            hideLabel: true,
    			        minChars: 2,
    			        width: 230,
    			        listConfig:{
    			            loadingText: 'Searching...',
    			            emptyText: 'No matching posts found.',
    			            getInnerTpl: function() {
    			                return '<div data-qtip="{unique_id}">{user_name}|{dept_name}</div>';
    			            }			                	
    			        },
    			        listeners: {
    			        	select: function (combo, record) {
    			        		
    			        		console_log('Selected Value : ' + record[0].get('unique_id'));
    			        		
    			        		var unique_id = record[0].get('unique_id');
    			        		var user_id = record[0].get('user_id');
    			        		Ext.Ajax.request({
                         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
                         			params:{
                         				useruid : unique_id,
                         				userid : user_id
                         				,gubun    : 'D'
                         			},
                         			success : function(result, request) {   
                         				var result = result.responseText;
                						console_log('result:' + result);
                						if(result == 'false'){
                							Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
                						}else{
                							rtgapp_store.load(function() {});
                						}
                         			},
                         			failure: extjsUtil.failureMessage
                         		});
    			        	}// endofselect
    			        }
    				},
			        '->',removeRtgapp,
			        
			        {
                        text: panelSRO1133,
                        iconCls: 'save',
                        disabled: false,
                        handler: function ()
                        {
               /*
				 * var recordList = ''; var record = null;
				 */
                        	var modifiend =[];
                        	var rec = grid.getSelectionModel().getSelection()[0];
                        	var unique_id = rec.get('unique_id');


                              for (var i = 0; i <agrid.store.data.items.length; i++)
                              {
	                                var record = agrid.store.data.items [i];
	                                
	                                if (record.dirty) {
	                                	rtgapp_store.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
	                                   	console_log(record);
	                                   	var obj = {};
	                                   	
	                                   	obj['unique_id'] = record.get('unique_id');// //pcs_code,
																					// pcs_name...
	                                   	obj['gubun'] = record.get('gubun');
	                                   	obj['owner'] = record.get('owner');
	                                   	obj['change_type'] = record.get('change_type');
	                                   	obj['app_type'] = record.get('app_type');
	                                   	obj['usrast_unique_id'] = record.get('usrast_unique_id');
	                                   	obj['seq'] = record.get('seq');
	                                   	obj['updown'] = 0;
// obj['dept_name'] = record.get('description');
// obj['email'] = record.get('description');
	                                   	
	                                   	
	                                   	modifiend.push(obj);
	                                   	/*
										 * //저장 수정 record.save(uidList,{ success :
										 * function() {
										 * storePcsStd.load(function() {}); }
										 * });
										 */
	                                }
	                             /*
									 * if(recordList==''){ recordList = record;
									 * }else{ recordList = recordList + ';' +
									 * recordList; }
									 */

	                               
	                          }
                              
                              if(modifiend.length>0) {
                            	
                            	  console_log(modifiend);
                            	  var str =  Ext.encode(modifiend);
                            	  console_log(str);
                            	  
                           	    Ext.Ajax.request({
                         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=modifyRtgapp',
                         			params:{
                         				modifyIno: str,
                         				srcahd_uid:unique_id
                         			},
                         			success : function(result, request) {   
                         				rtgapp_store.load(function() {});
                         			}
                           	    });
                              }
                              
// storePcsStd.getProxy().setExtraParam('recordList', recordList);
// record.save(/*uidList,*/{
// success : function() {
// storePcsStd.load(function() {});
// }
// });
/*
 * for (var i = 0; i <gridPcsStd.store.data.items.length; i++) { var record =
 * gridPcsStd.store.data.items [i]; if (record.dirty) {
 * storePcsStd.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
 * console_log(record); //저장 수정 record.save(uidList,{ success : function() {
 * storePcsStd.load(function() {}); } }); }
 *  }
 */

                        }
// ,
// listeners: {
// console_log('');
// beforeedit: function(editor, e) {
// var btn = e.gridPcsStd.down('button');
// btn.enable();
// btn.editor = editor;
// },//endofbreforeedit
// edit: function(editor, e) {
// var btn = e.gridPcsStd.down('button');
// e.gridPcsStd.store.sync();
// btn.disable();
// btn.editor.cancelEdit();
// btn.editor = null;
// }//endofedit
// }//endoflistener
                    }
			        ]// endofitems
    			}] // endofdockeditems
    		}); // endof Ext.create('Ext.grid.Panel',
    		
    		agrid.getSelectionModel().on({
    			selectionchange: function(sm, selections) {
		            if (selections.length) {
						if(fPERM_DISABLING()==true) {
							removeRtgapp.disable();
						}else{
							removeRtgapp.enable();
						}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();// uncheck no displayProperty
		            		removeRtgapp.disable();
		            	}else{
		            		collapseProperty();// uncheck no displayProperty
		            		removeRtgapp.disable();
		            	}
		            }
		        }
    		});
    		
    		// form create
        	var form = Ext.create('Ext.form.Panel', {
    			id : 'formPanel',
    			xtype: 'form',
// layout: 'absolute',
    			frame: false,
    	        border: false,
                bodyPadding: 15,
                region: 'center',
    	        defaults: {
    	            anchor: '100%',
    	            allowBlank: false,
    	            msgTarget: 'side',
    	            labelWidth: 60
    	        },
    	        items: [
    	            new Ext.form.Hidden({
    	            id: 'hid_userlist_role',
    	            name: 'hid_userlist_role'
    		        }),
    		        new Ext.form.Hidden({
    		        	id: 'hid_userlist',
    		        	name: 'hid_userlist'
    		        }),
// new Ext.form.Hidden({
// id: 'sales_price',
// name: 'sales_price',
// value: sales_price
// }),
    		        new Ext.form.Hidden({
    		        	id: 'unique_uid',
    		        	name: 'unique_uid',
    		        	value: unique_uid
    		        }),
// new Ext.form.Hidden({
// id: 'unique_id',
// name: 'unique_id',
// value: unique_id
// }),
// new Ext.form.Hidden({
// id: 'ac_uid',
// name: 'ac_uid',
// value: ac_uid
// }),
    		        new Ext.form.Hidden({
    		        	id: 'req_date',
    		        	name: 'req_date'
    		        }),
// new Ext.form.Hidden({
// id: 'quan',
// name: 'quan',
// value: quan
// }),
    		        new Ext.form.Hidden({
    	            	id: 'parent',
    	            	name: 'parent',
    	            	value: selectedparent
    		        }),
    		        new Ext.form.Hidden({
    		        	id: 'supplier_uid',
    		        	name: 'supplier_uid'
    		        }),
                	new Ext.form.Hidden({
                		id: 'supplier_name',
                		name: 'supplier_name'
                	}),
                	agrid,
                	
                	{
	                	xtype: 'component',
	                	html: '<br/><hr/><br/>',
	                	anchor: '100%'
	                },
	                
                	{
    	                	xtype: 'textfield',
// x: 5,
// y: 3 + 1*lineGap,
    	                	fieldLabel: dbm1_txt_name,
    	                	id: 'txt_name',
    	                	name: 'txt_name',
    	                	value: '[PR]' + item_code_dash(item_code),
    	                	anchor: '100%'
    	                },{
    	                	xtype: 'textarea',
// x: 5,
// y: 3 + 2*lineGap,
    	                	fieldLabel: dbm1_txt_content,
    	                	id: 'txt_content',
    	                	name: 'txt_content',
    	                	value:  item_name+' 外',
    	                	anchor: '100%'  
    	                },{
    	                	xtype: 'textarea',
// x: 5,
// y: 3 + 3*lineGap,
    	                	fieldLabel: dbm1_req_info,
    	                	id: 'req_info',
    	                	name: 'req_info',
    	                	anchor: '100%'  
    	                },{
    	                	xtype: 'datefield',
    	                	id: 'request_date',
    	                	name: 'request_date',
    		            	fieldLabel: toolbar_pj_req_date,
    		            	format: 'Y-m-d',
    				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
// readOnly : true,
    		            	value: Ext.Date.add (new Date(),Ext.Date.DAY,14),
    	            		anchor: '100%'
    		            }
    	                ]
        	});// endof createform
        	
        	// window create

        	prWin = Ext.create('ModalWindow', {
        		title: CMD_ADD + ' :: ' + /* (G) */vCUR_MENU_NAME,
                width: 850,
                height: 500,
// // minWidth: 250,
// // minHeight: 180,
// layout: {
// type: 'fix',
// padding: 5
// },
                plain:true,
                items: [ form
         ],
                buttons: [{
                	text: CMD_OK,
                	handler: function(btn){
                		var form = Ext.getCmp('formPanel').getForm();
// var selections = grid.getSelectionModel().getSelection();
                		agrid.getSelectionModel().selectAll();
                		var aselections = agrid.getSelectionModel().getSelection();
                		
                		if (aselections) {
                        	for(var i=0; i< aselections.length; i++) {
                        		var rec = agrid.getSelectionModel().getSelection()[i];
                        		ahid_userlist[i] = rec.get('usrast_unique_id');
                        		console_log("ahid_userlist   :  "+ahid_userlist);
                        		console_log("ahid_userlist_role   :  "+ahid_userlist);
                        		ahid_userlist_role[i] = rec.get('gubun');
                        		console_log("ahid_userlist_role"+ahid_userlist_role);
                        	}
                        	Ext.getCmp('hid_userlist').setValue(ahid_userlist);                    	
                			Ext.getCmp('hid_userlist_role').setValue(ahid_userlist_role);
                        }
                		if(form.isValid()){
                			var val = form.getValues(false);
// var purchasing = Ext.ModelManager.create(val, 'Purchasing');
// for(var i=0; i< aselections.length; i++) {
// var rec = selections[i];
// var unique_id = rec.get('unique_id');
                		
                			
// var selections = grid.getSelectionModel().getSelection();
// if (selections) {
// for(var i=0; i< selections.length; i++) {
// var rec = selections[i];
// var unique_uid = rec.get('unique_uid');
// arrUid.push(unique_uid);
// }
// }
                		    
                		    var rtgast = Ext.ModelManager.create(val, 'RtgAst');
                	
// rtgast.proxy.extraParams.unique_uid = arrUid;
// console_log("arrUid = " + arrUid);
// console_log(rtgast.proxy.extraParams.unique_uid);
                		    
                			rtgast.save({
    	                		success : function() {
    	                			console_log('updated');
    	                           	if(prWin) 
    	                           	{
    	                           		prWin.close();
    	                           		store.load(function() {});
    	                           	} 
    	                		} 
    	                	 });
// }
                		}else {
                			Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                		}
                	}
                },{
                	text: CMD_CANCEL,
                	handler: function(){
                		if(prWin) {prWin.close();} }            	
                }]
        	});
        	prWin.show();
    	});// enof load
    }// endof handlwe
});// endof define action

// Define Add Action
var comboClass1= [];
var comboClass2= [];
var Class_code=[];

var isAssFromMyPart = false;





var addAssyAction =	 Ext.create('Ext.Action', {
	itemId:'addAssyAction',
	iconCls:'add',
// disabled: fPERM_DISABLING(),
    text: 'Assy 등록',
    handler: function(widget, event) {
    	
    	console_log('assy_pj_code Value : '+ assy_pj_code);
    	
    	if(assy_pj_code==null || assy_pj_code=='') {
    		Ext.MessageBox.alert('Error','프로젝트를 선택해주세요', callBack);  
            function callBack(id){  
                return
            } 
            return;
    	}
    	if(assy_level>5) {
    		Ext.MessageBox.alert('Error','ASSY는 최대 5단계까지만 등록 가능합니다.', callBack);  
    		function callBack(id){  
    			return
    		} 
    		return;
    	}

    	Ext.Ajax.request({
			url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoCloudAssy',
			params:{
				pj_code:assy_pj_code
				// pj_first:assy_pj_code.substring(0,1)
			},
			success : function(result, request) {   
// var from_type = Ext.getCmp('from_type').getValue();
// var Version = Ext.getCmp('version').getValue();
				var result = result.responseText;
				var str = result;	// var str = '293';
				var num = Number(str); 	

				if(str.length==3){
					num = num; 
				}else if(str.length==2){
					num = '0' + num;
				}else if(str.length==1){
					num = '00' + num;
				}else{
					num = num%1000;
				}
// if(checkflag == 0) {
					Ext.getCmp('pl_no').setValue("A"+num);
// }
				
			},
			failure: extjsUtil.failureMessage
		});
    	
    	
    	Ext.Ajax.request({
			url: CONTEXT_PATH + '/sales/poreceipt.do?method=createCloudAssyHierPos',
			params:{
				ac_uid:selectedPjUid,
				assy_level:assy_level,
				hier_pos:selectedAssyhier_pos
				
				// pj_first:assy_pj_code.substring(0,1)
			},
			success : function(result, request) {   
// var from_type = Ext.getCmp('from_type').getValue();
// var Version = Ext.getCmp('version').getValue();
				var result = result.responseText;
				var str = result;	// var str = '293';
				var num = Number(str); 	

				if(str.length==3){
					num = num; 
				}else if(str.length==2){
					num = '0' + num;
				}else if(str.length==1){
					num = '00' + num;
				}else{
					num = num%1000;
				}
// if(checkflag == 0) {
				if(assy_level==1){
					createAssyhier_pos = num+'000000000000';
					
				}else if(assy_level==2){
					createAssyhier_pos = selectedAssyhier_pos+''+num+'000000000';
					
				}else if(assy_level==3){
					createAssyhier_pos = selectedAssyhier_pos+''+num+'000000';
					
				}else if(assy_level==4){
					createAssyhier_pos = selectedAssyhier_pos+''+num+'000';
					
				}else if(assy_level==5){
					createAssyhier_pos = selectedAssyhier_pos+''+num;
					
				}
				Ext.getCmp('hier_pos').setValue(createAssyhier_pos);
				console_log('createAssyhier_pos Value : '+ createAssyhier_pos);
				
				
// }
				
			},
			failure: extjsUtil.failureMessage
		});
    	
    	
    	
				var lineGap = 30;
				var bHeight = 300;
				
		    	var inputItem= [];
		    	
		    	inputItem.push(new Ext.form.Hidden({
    		    	id: 'assy_level',
      		       name: 'assy_level',
      		       value: assy_level
      		    }));
		    	
		    	inputItem.push(new Ext.form.Hidden({
    		    	id: 'hier_pos',
      		       name: 'hier_pos'
      		    }));
		    	
		    	inputItem.push(new Ext.form.Hidden({
    		    	id: 'parent',
      		       name: 'parent',
      		       value: selectedparent
      		    }));
		    	
		    	inputItem.push(new Ext.form.Hidden({
    		    	id: 'ac_uid',
      		       name: 'ac_uid',
      		       value: selectedPjUid
      		    }));
		    	
		    	inputItem.push({
				    xtype : 'container',
				    combineErrors: true,
				    layout:{
				    	type:'hbox',
				    	defaultMargins: {top: 0, right: 5, bottom: 5, left: 0}
				},
				    msgTarget: 'side',
				    fieldLabel: panelSRO1144,
				    defaults: {
				    	// anchor:'100%'
				        // hideLabel: true
				    },
				    items : [
				{
					xtype: 'textfield',
					fieldLabel: '프로젝트',
					allowBlank:false,
					value:assy_pj_code,
// width: 20,
					flex : 1,
					readOnly : true,
					fieldStyle : 'background-color: #ddd; background-image: none;',
					name:'pj_code'
					},
					{
						xtype: 'textfield',
						allowBlank:false,
// width: 200,
						value:combo_pj_name,
						readOnly : true,
						fieldStyle : 'background-color: #ddd; background-image: none;',
						flex : 1,
						name: 'pj_name',
						id:'pj_name'
					}
					]
				});
		    	
		    	
		    	inputItem.push({
				    xtype : 'container',
				    combineErrors: true,
				    layout:{
				    	type:'hbox',
				    	defaultMargins: {top: 0, right: 5, bottom: 5, left: 0}
				},
				    msgTarget: 'side',
				    fieldLabel: panelSRO1144,
				    defaults: {
				    	// anchor:'100%'
				        // hideLabel: true
				    },
				    items : [
				{
					xtype: 'textfield',
					fieldLabel: 'Assembly 코드',
					allowBlank:false,
					value:assy_pj_code,
// width: 20,
					flex : 1,
					readOnly : true,
					fieldStyle : 'background-color: #ddd; background-image: none;'
					},
					{
						xtype: 'textfield',
						allowBlank:false,
// width: 200,
						flex : 1,
						name: 'pl_no',
						id:'pl_no'
					}
					]
				});
		    	
		    	inputItem.push(
		    			{
		                    fieldLabel: 'Assembly 명',
		                    x: 5,
		                    y: 0 + 3*lineGap,
		                    name: 'item_name',
		                    anchor: '-5'  // anchor width by percentage
		                },{
                            xtype: 'numberfield',
                            minValue: 0,
                            width : 365,
                            name : 'quan',
                            editable:true,
                            fieldLabel: getColName('quan'),
                            allowBlank: true,
                            value: '1',
                            margins: '0'
                        });
		
		    	
		    	var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            defaultType: 'textfield',
		            border: false,
		            bodyPadding: 15,
		            width: 400,
		            height: bHeight,
// region: 'center',
// encType: 'multipart/form-data',
		            defaults: {
		                // anchor: '100%',
		                editable:false,
		                allowBlank: false,
		                msgTarget: 'side',
		                labelWidth: 100
		            },
		             items: inputItem
		        });
		
		        var win = Ext.create('ModalWindow', {
		            title: CMD_ADD  + ' :: ' + /* (G) */vCUR_MENU_NAME,
		            width: 400,
		            height: bHeight,
		            minWidth: 250,
		            minHeight: 180,
		            items: form,
// plain:true,
		            buttons: [{
		                text: CMD_OK,
		            	handler: function(){
		                    var form = Ext.getCmp('formPanel').getForm();
		                    if(form.isValid())
		                    {
		                	var val = form.getValues(false);
		                	var assyline = Ext.ModelManager.create(val, 'AssyLine');
		            		// 저장 수정
		                	assyline.save({
		                		success : function() {
		                           	if(win) 
		                           	{
		                           		win.close();
		                           		// pjTreeGrid.setLoading(true);
		                           		cloudProjectTreeStore.load({
		                           		    callback: function(records, operation, success) {
		                           		    	console_log('load tree store');
		                           		    	console_log('ok');
		                           		    	pjTreeGrid.setLoading(false);
		                           		        // treepanel.expandAll();
		                           		    }                               
		                           		});
		                           	}   	
		                		} 
		                	 });
		                	 
		                       	if(win) 
		                       	{
		                       		win.close();
		                       	} 
		                    } else {
		                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
		                    }

		                  }
		            },{
		                text: CMD_CANCEL,
		            	handler: function(){
		            		if(win) {
		            			win.close();
		            		}
		// lfn_gotoHome();
		 
		
		            	}
		            }]
		        });
		        win.show(/* this, function(){} */);
     }
});











// Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ /* addElecAction, */ /*editAction, */ removeAction  ]
});


// Excel Upload from NX
var addNxExcel = Ext.create('Ext.Action', {
	itemId: 'addNxExcel',
    iconCls: 'MSExcelTemplateX',
    text: panelSRO1193,
    disabled: false,
    handler: function(widget, event) {
    	var uploadPanel = getCommonFilePanel('CREATE', 10, 10, '100%', 140, 50, '');

    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            layout: 'absolute',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
             items: [ uploadPanel
            
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + 'NX Excel',
            width: 600,
            height: 230,
            minWidth: 250,
            minHeight: 180,
            layout: 'fit',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {   	
                           	if(win) 
                           	{
                           		
                           		var val = form.getValues(false);
           	                	val["file_itemcode"] = /* (G) */vFILE_ITEM_CODE;
           	                	var nxExcel = Ext.ModelManager.create(val, 'NxExcel');
           	                	nxExcel.save( {	             	                	
	           	           		 success: function() {
		           	           		 }
		           	           	});
                           		win.close();
                           	}                           
                    }
                    lfn_gotoHome();
                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {win.close();} 
                    lfn_gotoHome();
            	}
            		
            }]
        });
		win.show(this, function() {
// console_log('win.show');
// LoadJs('/js/util/multiupload/app.js');
// console_log('end');
// console_log(/*(G)*/vFILE_ITEM_CODE);
			
			
			
		});
    }
});

var actionBomCopy = null;

function checkCopyAction() {

		if( (selectionLength>0) && toPjUidAssy !='' && toPjUidAssy !=null) {
			actionBomCopy.enable();
		} else{
			actionBomCopy.disable();
		}	
	
}

searchField = [];

Ext.onReady(function() {  
	
	// LoadJsMessage(); --> main으로 이동
	Ext.define('RtgApp', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /* (G) */vCENTER_FIELDS_SUB,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=readRtgappDyna&change_type=D',
			            create: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
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
	
	
	commonUnitStore = Ext.create('Mplm.store.CommonUnitStore', {hasNull: false} );
	commonCurrencyStore = Ext.create('Mplm.store.CommonCurrencyStore', {hasNull: false} );
	commonModelStore = Ext.create('Mplm.store.CommonModelStore', {hasNull: true} );
	commonStandardStore  = Ext.create('Mplm.store.CommonStandardStore', {hasNull: true} );
	commonStandardStore2  = Ext.create('Mplm.store.CommonStandardStore', {hasNull: false} );
	GubunStore  = Ext.create('Mplm.store.GubunStore', {hasNull: false} );

	LoadJs('/js/util/myPartStore.js');
	LoadJs('/js/util/projectpaneltree.js');
    PmaterialStore.proxy.extraParams.level = '1';
    PmaterialStore.load( function(records) {
        for (var i=0; i<records.length; i++){
        	var classObj = records[i];
        	var class_code = classObj.get('class_code_full');
        	var class_name =  classObj.get('class_name');
        	
        	var obj = {};
        	obj['name'] = '[' + class_code + ']' + class_name;
        	obj['value'] = class_code;
        	comboClass1.push(obj);
        }
    });
	
	console_log('now starting...');
	
	
	
	
	

	
	
	
	var pjTreeGrid =
    	Ext.create('Ext.tree.Panel', {
		// border: false,
		 title: getMenuTitle(),// cloud_product_class,
		 region: 'center',
		 listeners: {
             activate: function(tab){
                 setTimeout(function() {
                 	// Ext.getCmp('main-panel-center').setActiveTab(0);
                     // alert(tab.title + ' was activated.');
                 }, 1);
             }
         },

         viewConfig: {
		    	listeners: {
// itemcontextmenu: function(view, rec, node, index, e) {
// selectedNodeId = rec.getId();
// e.stopEvent();
// contextMenu.showAt(e.getXY());
// return false;
// },
				    itemclick: function(view, record, item, index, e, eOpts) {                      
// rec.get('leaf'); // 이렇게 데이터 가져올 수 있음

			    	
				    	var name = record.data.text;
				    	var id = record.data.id;
				    	var depth = record.data.depth;
//				    	var leaf = record.data.leaf;
				    	

				    	
				    	var context = record.data.context;
//				    	console_log("record.data.text "+name);
//				    	console_log("record.data.context "+context);
				    	selectedAssyhier_posfull = context;
//				    	console_log("leaf "+leaf);
				    	assy_code = name.substring(0,5);
				    	console_log("assy_code "+assy_code);
				    	var sname = name.split('>');
				    	console_log(sname[1]);
				    	sname = sname[1].split('<');
				    	console_log(sname[0]);
				    	assyname = sname[0];
				    	console_log("id "+id);
//				    	console_log("id.substring68 "+id.substring(6,8));
				    	console_log("depth "+depth);
				    	
				    	
				    	
				    	
				    	if(depth>0) {
				    		selectedparent = id;
				    		selectedAssyhier_pos = '';
				    		console_log('selectedparent='+selectedparent);
// Ext.getCmp('assy_pj_code').setValue(name.substring(0,5));
				    		assy_pj_code = combo_pj_code;
				    		assy_level = depth;
				    		
				    		if(depth==2){
				    			
					    		selectedAssyhier_pos = context.substring(0,3);
					    	}
					    	if(depth==3){
					    		selectedAssyhier_pos = context.substring(0,6);
					    	}
					    	if(depth==4){
					    		selectedAssyhier_pos = context.substring(0,9);
					    	}
					    	if(depth==5){
					    		selectedAssyhier_pos = context.substring(0,12);
					    	}
					    	console_log("selectedAssyhier_pos : "+selectedAssyhier_pos);
					    	console_log("selectedAssyhier_posfull : "+selectedAssyhier_posfull);
				    		
				    		store.getProxy().setExtraParam('parent', selectedparent);
			            	store.load(function(){});

				    	}
				    	
				    	
				    	
				    		
// else if(id.substring(6,8)!='00') {
// selectedparent = id;
// Ext.getCmp('srchClass_code').setValue(id);
// Ext.Ajax.request({
// url: CONTEXT_PATH + '/b2b/lounge.do?method=unspscPath',
// params:{
// class_code : id,
// lang: vLANG
// },
//				    			
// success : function(result, request) {
// var resultText = result.responseText;
// productDesc = resultText;
// Ext.getCmp('classDesc').setValue(resultText);
// productStore.getProxy().setExtraParam('class_code', id);
// productStore.getProxy().setExtraParam('limit', getPageSize());
// productStore.load(function() {});
// },
// failure: function(result, request) {
// alert('call error');
// }
// });
//
// }
				    	
				    }// end itemclick
		    	}// end listeners
			},
		        // border: 0,
	            dockedItems: [{
	                dock: 'top',
	                xtype: 'toolbar',
	                items: [
								{
									id:'projectcombo',
								// name:'fix_mchn',
								    	xtype: 'combo',
								    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
								           mode: 'local',
								           editable:false,
								           // allowBlank: false,
								           width: '100%',
								           queryMode: 'remote',
								           emptyText:'프로젝트',
								           displayField:   'pj_name',
								           valueField:     'unique_id',
								           store: cloudprojectStore,
								            listConfig:{
								            	
								            	getInnerTpl: function(){
								            		return '<div data-qtip="{unique_id}">[{pj_code}] {pj_name}</div>';
								            	}			                	
								            },
								           triggerAction: 'all',
								            listeners: {
								                 select: function (combo, record) {
								                 	
								                 	console_log('Selected Value : ' + combo.getValue());
								                 	var pjuid = record[0].get('unique_id');
								                 	ac_uid = pjuid;
								                 	var pj_name  = record[0].get('pj_name');
								                 	var pj_code  = record[0].get('pj_code');
// cloudProjectTreeStore.getProxy().setExtraParam('pjuid', pjuid);
								                 	assy_pj_code ='';
								                 	combo_pj_code = pj_code;
								                 	combo_pj_name = pj_name;
								                 	selectedPjUid = pjuid;
								                 	console_log('selectedPjUid:' +selectedPjUid);
								                 	
								                 	Ext.getCmp('parent').setValue(pjuid);
								                 	Ext.getCmp('parent2').setValue(pjuid);
								                 	Ext.getCmp('ac_uid').setValue(pjuid);
								                 	Ext.getCmp('ac_uid2').setValue(pjuid);
								                 	Ext.getCmp('pj_name').setValue(pj_name);
								                 	Ext.getCmp('pj_code').setValue(pj_code);
//								                 	srchTreeHandler (pjTreeGrid, cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
								                 	console_log('systemCode : ' + pjuid 
								                 			+ ', codeNameEn=' + pj_name
								                 			+ ', codeName=' + pj_code	);
										    		store.getProxy().setExtraParam('parent', selectedPjUid);
									            	store.load(function(){});

							                 }
							            }
						        }
	                 	                   
	                
	                ]
	            }]
			 ,
		 
		 rootVisible: false,
		// cls: 'examples-list',
		 lines: true,
		 useArrows: true,
		 // margins: '0 0 0 5',
		 store: cloudProjectTreeStore
		} );
	
	
	
	
    var simpleadd =  Ext.create('Ext.panel.Panel', {
//    	height: getCenterPanelHeight() - 200,
    	height: '50%',
    	bodyPadding: 5,
        border: false,
        collapsible: false,
        floatable: false,
        split: true,
        autoScroll : true,
        autoHeight: true,
//        width:800,
        defaults: {
            anchor: '100%',
            allowBlank: true,
            msgTarget: 'side',
            labelWidth: 80
        },
        fieldDefaults: {
        	 labelWidth: 90, labelAlign: 'right', anchor:'95%' 
        },
        defaultType: 'textfield',

        items: [new Ext.form.Hidden({
			id: 'parent',
			name: 'parent'
		}),new Ext.form.Hidden({
			id: 'ac_uid',
			name: 'ac_uid'
		}),new Ext.form.Hidden({
			id: 'pj_code',
			name: 'pj_code'
		}),new Ext.form.Hidden({
			id: 'item_code',
			name: 'item_code'
		}),
		new Ext.form.Hidden({
			id: 'sg_code',
			name: 'sg_code',
			value:'NSD'
		}),
		new Ext.form.Hidden({
			id: 'pj_name',
			name: 'pj_name'
		}),new Ext.form.Hidden({
			id: 'standard_flag',
			name: 'standard_flag',
			value: 'Q'
		}),
		new Ext.form.Hidden({
//			xtype:  'textfield',
			 id: 'unique_id',
			 name: 'unique_id',
			 value: -1
		}),
		
		
		{
			fieldLabel: getColName('specification'),
			flex: 1,
//			x: 5,
//			y: 10,
			name: 'specification',
			id: 'specification',
			allowBlank: true,
			anchor: '-5'  // anchor width by percentage
		},{
			fieldLabel: getColName('item_name'),
			flex: 1,
			name: 'item_name',
			id: 'item_name',
			allowBlank: true,
			anchor: '-5'  // anchor width by percentage
		},{
			xtype: 'fieldset',
			flex: 1,
			border: true,
			// style: 'border-width: 0px',
			title: panelSRO1174,
			collapsible: false,
			defaults: {
				labelWidth: 40,
				anchor: '100%',
				layout: {
					type: 'hbox',
					defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
				}
			},
			items: [
			        
			        {
			        	xtype : 'fieldcontainer',
			        	combineErrors: true,
			        	msgTarget: 'side',
			        	defaults: {
			        		hideLabel: true
			        	},
			        	items : [{
			        		xtype: 'displayfield',
			        		width:60,
			        		value: ' '+panelSRO1186+':'
			        	}, 
			        	{
			        		xtype: 'numberfield',
			        		minValue: 0,
			        		width : 70,
			        		id:'quan',
			        		name : 'quan',
			        		fieldLabel: getColName('quan'),
			        		allowBlank: true,
			        		value: '1',
			        		margins: '0'
			        	},{
			        		xtype: 'displayfield',
			        		value: '&nbsp;&nbsp;'+panelSRO1187+':'
			        	}, {
			        		// the width of this field in the HBox layout is
			        		// set directly
			        		// the other 2 items are given flex: 1, so
			        		// will share the rest of the space
			        		width:          80,
			        		id:           'unit_code',
			        		name:           'unit_code',
			        		xtype:          'combo',
			        		mode:           'local',
			        		editable:       false,
			        		allowBlank: false,
			        		queryMode: 'remote',
			        		displayField:   'codeName',
			        		valueField:     'codeName',
			        		value:          'PC',
			        		triggerAction:  'all',
			        		fieldLabel: getColName('unit_code'),
			        		store: commonUnitStore,
			        		listConfig:{
			        			getInnerTpl: function(){
			        				return '<div data-qtip="{systemCode}">{codeName}</div>';
			        			}			                	
			        		},
			        		listeners: {
			        			select: function (combo, record) {
			        				console_log('Selected Value : ' + combo.getValue());
			        				var systemCode = record[0].get('systemCode');
			        				var codeNameEn  = record[0].get('codeNameEn');
			        				var codeName  = record[0].get('codeName');
			        				console_log('systemCode : ' + systemCode 
			        						+ ', codeNameEn=' + codeNameEn
			        						+ ', codeName=' + codeName	);
			        			}
			        		}
			        	}
			        	]
			        },
			        {
			        	xtype : 'fieldcontainer',
			        	combineErrors: true,
			        	msgTarget: 'side',
			        	defaults: {
			        		hideLabel: true
			        	},
			        	items : [{
			        		xtype: 'displayfield',
			        		width:60,
			        		value: ' '+panelSRO1188+':'
			        	},
			        	{
			        		xtype: 'numberfield',
			        		minValue: 0,
			        		flex: 1,
			        		name : 'sales_price',
			        		id : 'sales_price',
			        		fieldLabel: getColName('sales_price'),
			        		allowBlank: true,
			        		value: '0',
			        		margins: '0'
			        	}, {
			        		// the width of this field in the HBox layout is
			        		// set directly
			        		// the other 2 items are given flex: 1, so will
			        		// share the rest of the space
			        		width:          80,
			        		id:           'currency',
			        		name:           'currency',
			        		xtype:          'combo',
			        		mode:           'local',
			        		editable:       false,
			        		allowBlank: false,
			        		queryMode: 'remote',
			        		displayField:   'codeName',
			        		valueField:     'codeName',
			        		value:          'KRW',
			        		triggerAction:  'all',
			        		fieldLabel: getColName('currency'),
			        		store: commonCurrencyStore,
			        		listConfig:{
			        			getInnerTpl: function(){
			        				return '<div data-qtip="{systemCode}">{codeName}</div>';
			        			}			                	
			        		},
			        		listeners: {
			        			select: function (combo, record) {
			        				console_log('Selected Value : ' + combo.getValue());
			        				var systemCode = record[0].get('systemCode');
			        				var codeNameEn  = record[0].get('codeNameEn');
			        				var codeName  = record[0].get('codeName');
			        				console_log('systemCode : ' + systemCode 
			        						+ ', codeNameEn=' + codeNameEn
			        						+ ', codeName=' + codeName	);
			        			}
			        		}
			        	}]
			        }
			        ]
		},
		{xtype: 'container',flex: 1,                                     
		layout: {
            type:'vbox',
            padding:'5',
            align:'stretch'
        },  items: [
            {
                text: CMD_OK,
                xtype: 'button',
                anchor: '100%' ,
                handler: function(btn){
                	
            		if(selectedPjUid==null || selectedPjUid=='') {
            			Ext.MessageBox.alert('Error','프로젝트를 선택해주세요', callBack);  
            			function callBack(id){  
            				return
            			} 
            			return;
            		}
            		
            		
            		
            		
            		
			    	   console_log(btn);
//		    			var barcode = Ext.getCmp('barcode').getValue();
//		    			var unique_id = Ext.getCmp('unique_id').getValue();
//		    			var isNewPart = true;
//		    			if(unique_id==null || unique_id=='') {
//		    				isNewPart = true;
//		    			};
			    			var parent = Ext.getCmp('parent').getValue();
			    			var ac_uid = Ext.getCmp('ac_uid').getValue();
			    			var pj_code = Ext.getCmp('pj_code').getValue();
			    			var item_code = Ext.getCmp('item_code').getValue();
			    			var sg_code = Ext.getCmp('sg_code').getValue();
			    			var pj_name = Ext.getCmp('pj_name').getValue();
			    			var standard_flag = Ext.getCmp('standard_flag').getValue();
//			    			var pl_no = Ext.getCmp('pl_no').getValue();
			    			var specification = Ext.getCmp('specification').getValue();
			    			var item_name = Ext.getCmp('item_name').getValue();
			    			var quan = Ext.getCmp('quan').getValue();
			    			var unit_code = Ext.getCmp('unit_code').getValue();
			    			var sales_price = Ext.getCmp('sales_price').getValue();
			    			var currency = Ext.getCmp('currency').getValue();
			    			var unique_id = Ext.getCmp('unique_id').getValue();
			    			
			    			
			    			console_log('unique_id:'+ unique_id+
									'parent :'+ parent+
									'ac_uid :'+ ac_uid+
									'pj_code :'+ pj_code+
									'item_code :'+ item_code+
									'sg_code :'+ sg_code+
									'pj_name :'+ pj_name+
									'standard_flag :'+ standard_flag+
//									'pl_no :'+ pl_no+
									'specification :'+ specification+
									'item_name :'+ item_name+
									'quan :'+ quan+
									'unit_code :'+ unit_code+
									'sales_price :'+ sales_price);
			    			

							Ext.Ajax.request({
								url: CONTEXT_PATH + '/design/bom.do?method=create',				
								params:{
									unique_id: unique_id,
									parent : parent,
									ac_uid : ac_uid,
									pj_code : pj_code,
									item_code : item_code,
									sg_code : sg_code,
									pj_name : pj_name,
									standard_flag : standard_flag,
									menu_code:'PPO5_CLD',
									specification : specification,
									item_name : item_name,
									quan : quan,
									unit_code : unit_code,
									currency : currency,
									sales_price : sales_price									
								},
								
								success : function(result, request) {
									store.load(function() {});
									
									//alert('finished..');
									
								},
								failure: extjsUtil.failureMessage
							});
							
		    			
		    			
                }
            }
            
        ]}],
        title: '입력'
	});
    
    
    var simpleedit =  Ext.create('Ext.panel.Panel', {
//    	height: getCenterPanelHeight() - 200,
    	height: '50%',
    	bodyPadding: 5,
        border: false,
        collapsible: false,
        floatable: false,
        split: true,
        autoScroll : true,
        autoHeight: true,
//        width:800,
        defaults: {
            anchor: '100%',
            allowBlank: true,
            msgTarget: 'side',
            labelWidth: 80
        },
        fieldDefaults: {
        	 labelWidth: 90, labelAlign: 'right', anchor:'95%' 
        },
        defaultType: 'textfield',

        items: [new Ext.form.Hidden({
			id: 'parent2',
			name: 'parent'
		}),new Ext.form.Hidden({
			id: 'ac_uid2',
			name: 'ac_uid'
		}),new Ext.form.Hidden({
			id: 'child2',
			name: 'child'
		}),new Ext.form.Hidden({
			id: 'pj_code2',
			name: 'pj_code'
		}),new Ext.form.Hidden({
			id: 'item_code2',
			name: 'item_code'
		}),
		new Ext.form.Hidden({
			id: 'sg_code2',
			name: 'sg_code',
			value:'NSD'
		}),
		new Ext.form.Hidden({
			id: 'pj_name2',
			name: 'pj_name'
		}),new Ext.form.Hidden({
			id: 'standard_flag2',
			name: 'standard_flag',
			value: 'Q'
		}),
		new Ext.form.Hidden({
//			xtype:  'textfield',
			 id: 'unique_id2',
			 name: 'unique_id',
			 value: -1
		}),
		
		
		{
			fieldLabel: getColName('specification'),
			flex: 1,
//			x: 5,
//			y: 10,
			name: 'specification',
			id: 'specification2',
			disabled:true,
			fieldStyle : 'background-color: #ddd; background-image: none;',
			allowBlank: true,
			anchor: '-5'  // anchor width by percentage
		},{
			fieldLabel: getColName('item_name'),
			flex: 1,
			name: 'item_name',
			id: 'item_name2',
			disabled:true,
			fieldStyle : 'background-color: #ddd; background-image: none;',
			allowBlank: true,
			anchor: '-5'  // anchor width by percentage
		},{
			xtype: 'fieldset',
			flex: 1,
			border: true,
			// style: 'border-width: 0px',
			title: panelSRO1174,
			collapsible: false,
			defaults: {
				labelWidth: 40,
				anchor: '100%',
				layout: {
					type: 'hbox',
					defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
				}
			},
			items: [
			        
			        {
			        	xtype : 'fieldcontainer',
			        	combineErrors: true,
			        	msgTarget: 'side',
			        	defaults: {
			        		hideLabel: true
			        	},
			        	items : [{
			        		xtype: 'displayfield',
			        		width:60,
			        		value: ' '+panelSRO1186+':'
			        	}, 
			        	{
			        		xtype: 'numberfield',
			        		minValue: 0,
			        		width : 70,
			        		id:'quan2',
			        		name : 'quan',
			        		disabled:true,
			    			fieldStyle : 'background-color: #ddd; background-image: none;',
			        		fieldLabel: getColName('quan'),
			        		allowBlank: true,
			        		value: '1',
			        		margins: '0'
			        	},{
			        		xtype: 'displayfield',
			        		value: '&nbsp;&nbsp;'+panelSRO1187+':'
			        	}, {
			        		// the width of this field in the HBox layout is
			        		// set directly
			        		// the other 2 items are given flex: 1, so
			        		// will share the rest of the space
			        		width:          80,
			        		id:           'unit_code2',
			        		name:           'unit_code',
			        		xtype:          'combo',
			        		mode:           'local',
			        		editable:       false,
			        		allowBlank: false,
			        		queryMode: 'remote',
			        		disabled:true,
			    			fieldStyle : 'background-color: #ddd; background-image: none;',
			        		displayField:   'codeName',
			        		valueField:     'codeName',
			        		value:          'PC',
			        		triggerAction:  'all',
			        		fieldLabel: getColName('unit_code'),
			        		store: commonUnitStore,
			        		listConfig:{
			        			getInnerTpl: function(){
			        				return '<div data-qtip="{systemCode}">{codeName}</div>';
			        			}			                	
			        		},
			        		listeners: {
			        			select: function (combo, record) {
			        				console_log('Selected Value : ' + combo.getValue());
			        				var systemCode = record[0].get('systemCode');
			        				var codeNameEn  = record[0].get('codeNameEn');
			        				var codeName  = record[0].get('codeName');
			        				console_log('systemCode : ' + systemCode 
			        						+ ', codeNameEn=' + codeNameEn
			        						+ ', codeName=' + codeName	);
			        			}
			        		}
			        	}
			        	]
			        },
			        {
			        	xtype : 'fieldcontainer',
			        	combineErrors: true,
			        	msgTarget: 'side',
			        	defaults: {
			        		hideLabel: true
			        	},
			        	items : [{
			        		xtype: 'displayfield',
			        		width:60,
			        		value: ' '+panelSRO1188+':'
			        	},
			        	{
			        		xtype: 'numberfield',
			        		minValue: 0,
			        		flex: 1,
			        		disabled:true,
			    			fieldStyle : 'background-color: #ddd; background-image: none;',
			        		name : 'sales_price',
			        		id : 'sales_price2',
			        		fieldLabel: getColName('sales_price'),
			        		allowBlank: true,
			        		value: '0',
			        		margins: '0'
			        	}, {
			        		// the width of this field in the HBox layout is
			        		// set directly
			        		// the other 2 items are given flex: 1, so will
			        		// share the rest of the space
			        		width:          80,
			        		id:           'currency2',
			        		name:           'currency',
			        		xtype:          'combo',
			        		mode:           'local',
			        		editable:       false,
			        		allowBlank: false,
			        		queryMode: 'remote',
			        		disabled:true,
			    			fieldStyle : 'background-color: #ddd; background-image: none;',
			        		displayField:   'codeName',
			        		valueField:     'codeName',
			        		value:          'KRW',
			        		triggerAction:  'all',
			        		fieldLabel: getColName('currency'),
			        		store: commonCurrencyStore,
			        		listConfig:{
			        			getInnerTpl: function(){
			        				return '<div data-qtip="{systemCode}">{codeName}</div>';
			        			}			                	
			        		},
			        		listeners: {
			        			select: function (combo, record) {
			        				console_log('Selected Value : ' + combo.getValue());
			        				var systemCode = record[0].get('systemCode');
			        				var codeNameEn  = record[0].get('codeNameEn');
			        				var codeName  = record[0].get('codeName');
			        				console_log('systemCode : ' + systemCode 
			        						+ ', codeNameEn=' + codeNameEn
			        						+ ', codeName=' + codeName	);
			        			}
			        		}
			        	}]
			        }
			        ]
		},
		{xtype: 'container',flex: 1,                                     
		layout: {
            type:'vbox',
            padding:'5',
            align:'stretch'
        },  items: [
            {
                text: CMD_OK,
                xtype: 'button',
                id:'editbutton',
                anchor: '100%' ,
                disabled:true,
                handler: function(btn){
                	
            		if(selectedPjUid==null || selectedPjUid=='') {
            			Ext.MessageBox.alert('Error','프로젝트를 선택해주세요', callBack);  
            			function callBack(id){  
            				return
            			} 
            			return;
            		}
            		
            		
            		
            		
            		
			    	   console_log(btn);
//		    			var barcode = Ext.getCmp('barcode').getValue();
//		    			var unique_id = Ext.getCmp('unique_id').getValue();
//		    			var isNewPart = true;
//		    			if(unique_id==null || unique_id=='') {
//		    				isNewPart = true;
//		    			};
			    			var parent = Ext.getCmp('parent2').getValue();
			    			var ac_uid = Ext.getCmp('ac_uid2').getValue();
			    			var pj_code = Ext.getCmp('pj_code2').getValue();
			    			var item_code = Ext.getCmp('item_code2').getValue();
			    			var sg_code = Ext.getCmp('sg_code2').getValue();
			    			var pj_name = Ext.getCmp('pj_name2').getValue();
			    			var standard_flag = Ext.getCmp('standard_flag2').getValue();
			    			var child = Ext.getCmp('child2').getValue();
			    			var specification = Ext.getCmp('specification2').getValue();
			    			var item_name = Ext.getCmp('item_name2').getValue();
			    			var quan = Ext.getCmp('quan2').getValue();
			    			var unit_code = Ext.getCmp('unit_code2').getValue();
			    			var sales_price = Ext.getCmp('sales_price2').getValue();
			    			var currency = Ext.getCmp('currency2').getValue();
			    			var unique_id = Ext.getCmp('unique_id2').getValue();
			    			
			    			
			    			console_log('unique_id:'+ unique_id+
									'parent :'+ parent+
									'ac_uid :'+ ac_uid+
									'pj_code :'+ pj_code+
									'item_code :'+ item_code+
									'sg_code :'+ sg_code+
									'pj_name :'+ pj_name+
									'standard_flag :'+ standard_flag+
//									'pl_no :'+ pl_no+
									'specification :'+ specification+
									'item_name :'+ item_name+
									'quan :'+ quan+
									'unit_code :'+ unit_code+
									'sales_price :'+ sales_price);
			    			

							Ext.Ajax.request({
								url: CONTEXT_PATH + '/design/bom.do?method=create',				
								params:{
									unique_id: unique_id,
									parent : parent,
									ac_uid : ac_uid,
									pj_code : pj_code,
									item_code : item_code,
									sg_code : sg_code,
									pj_name : pj_name,
									standard_flag : standard_flag,
									menu_code:'PPO5_CLD',
									specification : specification,
									currency : currency,
									item_name : item_name,
									quan : quan,
									unit_code : unit_code,
									child : child,
									sales_price : sales_price									
								},
								
								success : function(result, request) {
									store.load(function() {});
									
									//alert('finished..');
									
								},
								failure: extjsUtil.failureMessage
							});
							
		    			
		    			
                }
            }
            
        ]}],
        title: '수정'
	});
    var tabPanel = {
            collapsible: false,
            floatable: false,
            split: true,
			xtype: 'tabpanel',
	        region: 'south',
            height: '50%',		
	        activeTab: 0,
	        tabPosition: 'top',
	        items: [ simpleadd, simpleedit ]
    };
// var projectToolBar = getProjectToolbar(false/*hasPaste*/,
// false/*excelPrint*/) ;
	
	actionBomCopy = Ext.create('Ext.Action', {
		iconCls:'PSBOMView',
	    text: 'Copy To',
	    disabled: true,
	    handler: function(widget, event) {
	    	
	    	// make uidlist
	    	var uidList = '';
	        var selections = grid.getSelectionModel().getSelection();
	        if (selections) {
	            	for(var i=0; i< selections.length; i++) {
	            		var rec = selections[i];
	            		var unique_uid = rec.get('unique_uid');
	            		if(uidList=='') {
	            			uidList = unique_uid;
	            		}else {
	            			uidList = uidList + ';' + unique_uid;
	            		}
	            	}
	        }
	    	
           	Ext.Ajax.request({
					url: CONTEXT_PATH + '/design/bom.do?method=copyBom',				
				params:{
	        		toPjUidAssy: toPjUidAssy,
	        		toPjUid: toPjUid,
	        		uidList: uidList
				},
				success : function(result, request) {
					Ext.MessageBox.alert('Info','Bom Copy is done.');

				},// endof success for ajax
				failure: extjsUtil.failureMessage
           	}); // endof Ajax
	    	
	    	
	    	
	    }
	});
	
	var projectStore = Ext.create('Mplm.store.ProjectStore', {hasNull: false} );
	var projectCombo  =
	{
			id :'toPjUidAssy',
	        name : 'toPjUidAssy',
	        xtype: 'combo',
	        fieldStyle: 'background-color: #E7EEF6; background-image: none;',
	        store: projectStore,
	        emptyText:   dbm1_mold_no,
	        displayField:   'pj_code',
	        valueField:     'uid_srcahd',
	        sortInfo: { field: 'create_date', direction: 'DESC' },
	        typeAhead: false,
	        hideLabel: true,
	        minChars: 2,
	        // hideTrigger:true,
	        // width: 200,
	        listConfig:{
	            loadingText: 'Searching...',
	            emptyText: 'No matching posts found.',
	            // Custom rendering template for each item
	            getInnerTpl: function() {
	                return '<div data-qtip="{unique_id}">{pj_code}</div>';
	            }			                	
	        },
	        listeners: {
	        	select: function (combo, record) {
	        		toPjUidAssy = combo.getValue();
	        		toPjUid = record[0].get('unique_id'); // ac_uid
	        		console_log('toPjUidAssy='+toPjUidAssy + ', toPjUid=' + toPjUid);
	        		checkCopyAction();
	        	}
	        }
		};
		    
		    // ************************ BOM *********
		     
		    	// PartLine Store 정의
		    	store = new Ext.data.Store({  
		    		pageSize: getPageSize(),
		    		model: 'PartLine',
		    		// remoteSort: true,
		    		sorters: [{
		                property: 'unique_id',
		                direction: 'DESC'
		            }]
		    	});
		    	
		    	store.load(function() {

		    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );    			
		    			
		    		
		    		
		    		
		    grid = Ext.create('Ext.grid.Panel', {
		    		id: 'gridBom',
			        store: store,
			        // /COOKIE//stateful: true,
			        collapsible: true,
			        multiSelect: true,
			        selModel: selModel,
			        title: getMenuTitle(),
			        stateId: 'stateGridBom'+ /* (G) */vCUR_MENU_CODE,
	                region: 'center',
//	                width:'70%',
			        // layout: 'fit',
			        height: getCenterPanelHeight(),
			        
			        bbar: getPageToolbar(store),	        
			        
			        dockedItems: [
	    		      				{
	    		      					dock: 'top',
	    		      				    xtype: 'toolbar',
	    		      				    items: [
	    		      				           /*addAction, '-',addAssyAction, '-',*/ /*
																					 * addElecAction,
																					 * '-',
																					 */ removeAction, '-', purchase_requestAction, 
	    		      				  /*         '-',*/
	    		      				           /* process_requestAction,'-', *//*addNxExcel,*/
	    		      				           /*'-',*/
	    		      				          /* addsimpleAction,*/
//	    		      				           actionBomCopy,
//	    		      				           projectCombo,
	    		      				         '->'
	    		      				         ]
// },
// {
// xtype: 'toolbar',
// items: projectToolBar//combotree
	    		      				}
//	    		      				
	    		              ],
			        columns: /* (G) */vCENTER_COLUMNS,
			        plugins: [cellEditing],
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            getRowClass: function(record) { 
	   			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
			            } ,
			            listeners: {
			        		'afterrender' : function(grid) {
								var elments = Ext.select(".x-column-header",true);// .x-grid3-hd
								elments.each(function(el) {
												// el.setStyle("color",
												// 'black');
												// el.setStyle("background",
												// '#ff0000');
												// el.setStyle("font-size",
												// '12px');
												// el.setStyle("font-weight",
												// 'bold');
						
											}, this);
									
								}
			            		,
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextMenu.showAt(e.getXY());
			                    return false;
			                }
			            }
			        }
// title: getMenuTitle()
			    });
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	selectionLength = selections.length;
//		        	checkCopyAction();
		        	
		        	var oSpecification = Ext.getCmp('specification2');
	    			var oItem_name = Ext.getCmp('item_name2');
	    			var oQuan = Ext.getCmp('quan2');
	    			var oUnit_code = Ext.getCmp('unit_code2');
	    			var oSales_price = Ext.getCmp('sales_price2');
	    			var oCurrency = Ext.getCmp('currency2');
	    			var oUnique_id = Ext.getCmp('unique_id2');
	    			var oChild = Ext.getCmp('child2');
	    			var oEditbutton = Ext.getCmp('editbutton');
		        	
		        	
		        	if (selections.length) {
		        		
		        		var rec = grid.getSelectionModel().getSelection()[0];
		        		var unique_id = rec.get('unique_id');
		        		var specification = rec.get('specification');        		
		        		var item_name = rec.get('item_name');
		        		var quan = rec.get('quan');
		        		var unit_code = rec.get('unit_code');
		        		var sales_price = rec.get('sales_price');
		        		var currency = rec.get('currency');
		        		var child = rec.get('child');
		        		console_log("select_unique_id : "+unique_id);
		        		console_log("select_specification : "+specification);
		        		console_log("select_item_name : "+item_name);
		        		console_log("select_quan : "+quan);
		        		console_log("select_unit_code : "+unit_code);
		        		console_log("select_sales_price : "+sales_price);
		        		console_log("select_currency : "+currency);
//		        		console_log("child : "+child);
		        		
		        		
			        	oSpecification.setValue(specification);
		    			oItem_name.setValue(item_name);
		    			oQuan.setValue(quan);
		    			oUnit_code.setValue(unit_code);
		    			oSales_price.setValue(sales_price);
		    			oCurrency.setValue(currency);
		    			oUnique_id.setValue(unique_id);	
		    			oChild.setValue(unique_id);	
		        		
		        		
		        		
		        		
        		
		        		
		    			
		    			
		    			
		            	
		            	
		    			
		            	// grid info 켜기
//		            	displayProperty(selections[0]);
		            	
		            	if(fPERM_DISABLING()==true) {
		            		// addAction.disable();
		            		
			            	removeAction.disable();
			            	process_requestAction.disable();
			            	purchase_requestAction.disable();
			            	editAction.disable();
			            	addElecAction.disable();
			            	


		            	}else{
		            		// addAction.enable();
		            		removeAction.enable();
			            	process_requestAction.enable();
			            	purchase_requestAction.enable();
			            	editAction.enable();
			            	addElecAction.enable();
			            	checkCopyAction(true);
			            	
			            	oSpecification.setDisabled(false);
			            	oItem_name.setDisabled(false);
			            	oQuan.setDisabled(false);
			            	oUnit_code.setDisabled(false);
			    			oSales_price.setDisabled(false);
			    			oCurrency.setDisabled(false);
			    			oUnique_id.setDisabled(false);
			    			oEditbutton.setDisabled(false);
			    			
			    			oSpecification.setFieldStyle('background-color: #FFFFFF; background-image: none; font-weight:bold; font-size: 11px;');
			    			oItem_name.setFieldStyle('background-color: #FFFFFF; background-image: none; font-weight:bold; font-size: 11px;');
			    			oQuan.setFieldStyle('background-color: #FFFFFF; background-image: none; font-weight:bold; font-size: 11px;');
			    			oUnit_code.setFieldStyle('background-color: #FFFFFF; background-image: none; font-weight:bold; font-size: 11px;');
			    			oSales_price.setFieldStyle('background-color: #FFFFFF; background-image: none; font-weight:bold; font-size: 11px;');
			    			oCurrency.setFieldStyle('background-color: #FFFFFF; background-image: none; font-weight:bold; font-size: 11px;');
			    			
			    			
			    			
			    			
		            	}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		// addAction.disable();
			            	collapseProperty();
			            	removeAction.disable();
			            	process_requestAction.disable();
			            	purchase_requestAction.disable();
			            	editAction.disable();
			            	addElecAction.disable();
			            	checkCopyAction(false);
			            	
			            	oSpecification.setDisabled(true);
			            	oItem_name.setDisabled(true);
			            	oQuan.setDisabled(true);
			            	oUnit_code.setDisabled(true);
			    			oSales_price.setDisabled(true);
			    			oCurrency.setDisabled(true);
			    			oUnique_id.setDisabled(true);
			    			oEditbutton.setDisabled(true);
			    			
			    			oSpecification.setFieldStyle('background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;');
			    			oItem_name.setFieldStyle('background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;');
			    			oQuan.setFieldStyle('background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;');
			    			oUnit_code.setFieldStyle('background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;');
			    			oSales_price.setFieldStyle('background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;');
			    			oCurrency.setFieldStyle('background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;');
			    			
		            	}else{
		            		// addAction.disable();
		            		collapseProperty();
			            	removeAction.disable();
			            	process_requestAction.disable();
			            	purchase_requestAction.disable();
			            	editAction.disable();
			            	addElecAction.disable();
			            	checkCopyAction(false);
			            	
			            	oSpecification.setDisabled(true);
			            	oItem_name.setDisabled(true);
			            	oQuan.setDisabled(true);
			            	oUnit_code.setDisabled(true);
			    			oSales_price.setDisabled(true);
			    			oCurrency.setDisabled(true);
			    			oUnique_id.setDisabled(true);
			    			oEditbutton.setDisabled(true);
		            	}
		            }
		        }
		    });
		    
			var main2 =  Ext.create('Ext.panel.Panel', {
				height: getCenterPanelHeight(),
			    layout:'border',
			    border: false,
//			    region: 'center',
			    region: 'east',
	            width: '35%',
			    layoutConfig: {columns: 2, rows:1},
			    defaults: {
			        collapsible: true,
			        split: true,
			        cmargins: '5 0 0 0',
			        margins: '0 0 0 0'
			    },
			    items: [pjTreeGrid,tabPanel]
			});
		    
			var main =  Ext.create('Ext.panel.Panel', {
				height: getCenterPanelHeight(),
			    layout:'border',
			    border: false,
//			    region: 'center',
//			    region: 'east',
//	            width: '30%',
			    layoutConfig: {columns: 2, rows:1},
			    defaults: {
			        collapsible: true,
			        split: true,
			        cmargins: '5 0 0 0',
			        margins: '0 0 0 0'
			    },
			    items: [grid,main2]
			});
			fLAYOUT_CONTENT(main);
//		fLAYOUT_CONTENTMulti([grid, main]);  
		cenerFinishCallback();// Load Ok Finish Callback
 	});
});	// OnReady

