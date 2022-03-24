//var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
//	clicksToEdit: 1
//});
//var cellEditing1 = Ext.create('Ext.grid.plugin.CellEditing', {
//	clicksToEdit: 1
//});
// *****************************GLOBAL VARIABLE**************************/
var grid = null;
var gridMycart = null;
var store = null;
var myCartStore = null;
var agrid = null;

var ahid_userlist = new Array();
var ahid_userlist_role = new Array();

var sales_price = '';
var quan = '';
var selectedAssyRecord = null;
var lineGap = 35;
var selectedMoldUid = '';
var selectedPjUid = '';
var selectedAssyUid = '';
//var selectedAssyhier_pos = '';
//var selectedAssyhier_posfull = '';
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

var assy_pj_code='';
var assy_code='';
var combo_pj_code='';
var combo_pj_name='';
var selectedAssyCode = '';

var selectedAssyName ='';
var selectedparent ='';
var ac_uid = '';

var addpj_code = '';
var is_complished = false;

var routeTitlename = '';
var puchaseReqTitle = '';

var CHECK_DUP = '-copied-';

var cloudprojectStore = Ext.create('Mplm.store.complishedProjectStore', {} );
var cloudProjectTreeStore = Ext.create('Mplm.store.cloudProjectTreeStore', {});
var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {} );
var routeGubunTypeStore_W = Ext.create('Mplm.store.RouteGubunTypeStore_W', {} );

var standard_flag_datas = [];
var commonStandardStore  = Ext.create('Mplm.store.CommonStandardStore', {hasNull: true} );
commonStandardStore.load(function(records) {
	for (var i=0; i<records.length; i++){ 
       	var obj = records[i];
       	//console_logs('commonStandardStore2['+i+']=', obj);
       	standard_flag_datas.push(obj);
	}
});

function getPosStandard(id){
	for (var i=0; i<standard_flag_datas.length; i++){ 
		if(standard_flag_datas[i].get('systemCode') == id){
			return standard_flag_datas[i];
		}
	}
	return null;
}
function selectAssy(routeTitlename) {
	//addAction.enable();
	//addAssyAction.enable();
	//editAssyAction.enable();
	//Ext.getCmp('addPartForm').enable();
	Ext.getCmp('tabBom').setTitle(routeTitlename); 
}

function unselectAssy() {
	//addAction.disable();
	addAssyAction.disable();
	editAssyAction.disable();
	Ext.getCmp('addPartForm').disable();
	Ext.getCmp('tabBom').setTitle('-'); 
}


function item_code_dash(item_code){
	if(item_code==null || item_code.length<13) {
		return item_code;
	}else {
		return item_code.substring(0,12);
	}
}

function setReadOnlyName(name, readonly) {
	setReadOnly(Ext.getCmp(name), readonly);
}

function setReadOnly(o, readonly) {
    o.setReadOnly(readonly);
    if (readonly) {
        o.setFieldStyle('background-color: #E7EEF6; background-image: none;');
    } else {
        o.setFieldStyle('background-color: #FFFFFF; background-image: none;');
    }

}

function getPl_no(systemCode) {
 	var prefix = systemCode;
 	if(systemCode=='S') {
 		prefix = 'K';
 	} else if(systemCode=='O') {
 		prefix = 'A';
 	}
	   Ext.Ajax.request({
		url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
		params:{
			first:prefix,
			parent_uid:selectedparent
		},
		success : function(result, request) {   
			var result = result.responseText;
			var str = result;	// var str = '293';
			Ext.getCmp('pl_no').setValue(str);

			
		},
		failure: extjsUtil.failureMessage
	});
}



function fPERM_DISABLING_Complished() {
	// 1. 권한있음.
	if (fPERM_DISABLING() == false && is_complished == false) {
		return false;
	} else { // 2.권한 없음.
		return true;
	}
}

//Define reset Action
var resetAction = Ext.create('Ext.Action', {
	 itemId: 'resetButton',
	 iconCls: 'search',
	 text: CMD_INIT,
	 handler: function(widget, event) {
		 resetPartForm();
		 Ext.getCmp('addPartForm').getForm().reset();
		 //console_logs('getForm().reset()', 'ok');
	 }
});

function pasteConfirm(btn){

    var selections = gridMycart.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	var uids = [];
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
        		uids.push(unique_id);
        	}
           //console_logs('uids', uids);
        	
      	   Ext.Ajax.request({
      			url: CONTEXT_PATH + '/design/bom.do?method=addBomcopyAssymap',
      			params:{
      				project_uid: selectedPjUid,
      				parent_uid:  selectedparent,
      				unique_uids: uids,
      				resetQty: 'false',
      				resetPlno: 'false'
      				
      			},
      			success : function(result, request) {   
      				var result = result.responseText;
      				Ext.MessageBox.alert('결과','총 ' + result + '건을 복사하였습니다.');
                    store.load(function() { });
      			},
      			failure: extjsUtil.failureMessage
      		});
        }

    }
};
var pasteAction = Ext.create('Ext.Action', {
	 itemId: 'pasteActionButton',
	 iconCls: 'paste_plain',
	 text: '현재 Assy에 붙여넣기',
	 disabled: true,
	 handler: function(widget, event) {
	    	if(selectedparent==null || selectedparent=='' || selectedPjUid==null || selectedPjUid=='') {
	    		Ext.MessageBox.alert('오류','먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
	    	} else {
	        	Ext.MessageBox.show({
	                title:'BOM 복사',
	                msg: '선택한 자재를 현 Assembly로 붙여넣으시겠습니까?',
	                buttons: Ext.MessageBox.YESNO,
	                fn: pasteConfirm,
	                icon: Ext.MessageBox.QUESTION
	            });    		
	    	}
	 }
});



//수정등록
var modRegAction = Ext.create('Ext.Action', {
	 itemId: 'modRegAction',
	 iconCls: 'page_copy',
	 text: '값 복사',
	 disabled: true,
	 handler: function(widget, event) {
		 unselectForm();
		 grid.getSelectionModel().deselectAll();
	 }
});
//var copyRevAction = Ext.create('Ext.Action', {
//	 itemId: 'copyRevAction',
//	 iconCls: 'application_form_edit',
//	 text: '버전생성',
//	 disabled: true,
//	 handler: function(widget, event) {
//		 //unselectForm();
//	 }
//});

function cleanComboStore(cmpName)
{
    var component = Ext.getCmp(cmpName); 
    
    component.setValue('');
    component.setDisabled(false);
	component.getStore().removeAll();
	component.setValue(null)
	component.getStore().commitChanges();
	component.getStore().totalLength = 0;
}

function resetParam() {
	store.getProxy().setExtraParam('unique_id', '');
	store.getProxy().setExtraParam('item_code', '');
	store.getProxy().setExtraParam('item_name', '');
	store.getProxy().setExtraParam('specification', '');
}

function srchTreeHandler (treepanel, store, widName, parmName) {
	
	//console_info("srchSingleHandler");
	treepanel.setLoading(true);
	
	resetParam(store, searchField);
	var val = Ext.getCmp(widName).getValue();
	console_log('val'+val);

	store.getProxy().setExtraParam(parmName, val);
	
	store.load({
	    callback: function(records, operation, success) {

	    	treepanel.setLoading(false);
	        // treepanel.expandAll();
	    }                               
	});
};

function setBomData(id) {
	//console_logs('setBomData(id)', id);
	modRegAction.enable();
	//copyRevAction.enable();
	resetPartForm();
	
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/purchase/material.do?method=read',
		params:{
			id :id
		},
		success : function(result, request) {   
       		
			var jsonData = Ext.decode(result.responseText);
			//console_logs('jsonData', jsonData);
			var records = jsonData.datas;
			//console_logs('records', records);
			//console_logs('records[0]', records[0]);
			setPartFormObj(records[0]);
		},
		failure: extjsUtil.failureMessage
	});
	
}
function setPartFormObj(o) {
	//console_logs('o', o);

	Ext.getCmp('unique_id').setValue( o['unique_id']);
	Ext.getCmp('unique_uid').setValue( o['unique_uid']);
	Ext.getCmp('item_code').setValue( o['item_code']);
	Ext.getCmp('item_name').setValue( o['item_name']);
	Ext.getCmp('specification').setValue( o['specification']);
	
	var standard_flag =  o['standard_flag'];
	//console_logs('standard_flag', standard_flag);
	Ext.getCmp('standard_flag').setValue(standard_flag);
	Ext.getCmp('standard_flag_disp').select(getPosStandard(standard_flag));
	Ext.getCmp('model_no').setValue( o['model_no']);	
	Ext.getCmp('description').setValue( o['description']);
	
	Ext.getCmp('comment').setValue( o['comment']);
	Ext.getCmp('maker_name').setValue( o['maker_name']);
	Ext.getCmp('bm_quan').setValue('1');
	Ext.getCmp('unit_code').setValue( o['unit_code']);
	Ext.getCmp('sales_price').setValue( o['sales_price']);
	
	
	getPl_no(standard_flag);
	
	var currency =  o['currency'];
	if(currency==null || currency=='') {
		currency = 'KRW';
	}
	Ext.getCmp('currency').setValue(currency);
	readOnlyPartForm(true);
}
function setPartForm(record) {
	//console_logs('record', record);

	Ext.getCmp('unique_id').setValue( record.get('unique_id'));
	Ext.getCmp('unique_uid').setValue( record.get('unique_uid'));
	Ext.getCmp('item_code').setValue( record.get('item_code'));
	Ext.getCmp('item_name').setValue( record.get('item_name'));
	Ext.getCmp('specification').setValue( record.get('specification'));
	
	var standard_flag =  record.get('standard_flag');
	//console_logs('standard_flag', standard_flag);
	Ext.getCmp('standard_flag').setValue(standard_flag);
	
	//Ext.getCmp('standard_flag_disp').setValue( record.get('standard_flag'));
	
	Ext.getCmp('standard_flag_disp').select(getPosStandard(standard_flag));
	Ext.getCmp('model_no').setValue( record.get('model_no'));	
	Ext.getCmp('description').setValue( record.get('description'));
	Ext.getCmp('pl_no').setValue( record.get('pl_no'));
	Ext.getCmp('comment').setValue( record.get('comment'));
	Ext.getCmp('maker_name').setValue( record.get('maker_name'));
	Ext.getCmp('bm_quan').setValue( record.get('bm_quan'));
	Ext.getCmp('unit_code').setValue( record.get('unit_code'));
	Ext.getCmp('sales_price').setValue( record.get('sales_price'));
	
	
	var currency =  record.get('currency');
	if(currency==null || currency=='') {
		currency = 'KRW';
	}
	Ext.getCmp('currency').setValue(currency);
	
	var ref_quan = record.get('ref_quan');
	//console_logs('ref_quan', ref_quan);
	if(ref_quan>1) {
		readOnlyPartForm(true);
		Ext.getCmp('isUpdateSpec').setValue('false');
	} else {
		readOnlyPartForm(false);
		setReadOnlyName('item_code', true);
		setReadOnlyName('standard_flag_disp', true);
		Ext.getCmp('isUpdateSpec').setValue('true');
	}

}

function resetPartForm() {

	Ext.getCmp('unique_id').setValue( '');
	Ext.getCmp('unique_uid').setValue( '');
	Ext.getCmp('item_code').setValue( '');
	Ext.getCmp('item_name').setValue( '');
	Ext.getCmp('specification').setValue('');
	Ext.getCmp('standard_flag').setValue('');
	Ext.getCmp('standard_flag_disp').setValue('');

	Ext.getCmp('model_no').setValue('');
	Ext.getCmp('description').setValue('');
	Ext.getCmp('pl_no').setValue('');
	Ext.getCmp('comment').setValue('');
	Ext.getCmp('maker_name').setValue('');
	Ext.getCmp('bm_quan').setValue('1');
	Ext.getCmp('unit_code').setValue('');
	Ext.getCmp('sales_price').setValue( '0');

	Ext.getCmp('currency').setValue('KRW');
	Ext.getCmp('unit_code').setValue('PC');
	readOnlyPartForm(false);
}

function unselectForm() {

	Ext.getCmp('unique_id').setValue('');
	Ext.getCmp('unique_uid').setValue('');
	Ext.getCmp('item_code').setValue('');
	
	var cur_val = Ext.getCmp('specification').getValue();
	Ext.getCmp('specification').setValue(cur_val + ' ' + CHECK_DUP);
	
	Ext.getCmp('currency').setValue('KRW');
	
	getPl_no(Ext.getCmp('standard_flag').getValue());
	readOnlyPartForm(false);
}

function readOnlyPartForm(b) {

	setReadOnlyName('item_code', b);
	setReadOnlyName('item_name', b);
	setReadOnlyName('specification', b);
	setReadOnlyName('standard_flag', b);
	setReadOnlyName('standard_flag_disp', b);

	setReadOnlyName('model_no', b);
	setReadOnlyName('description', b);
	//setReadOnlyName('pl_no', b);
	setReadOnlyName('comment', b);
	setReadOnlyName('maker_name', b);

	setReadOnlyName('currency', b);
	setReadOnlyName('unit_code', b);
	
	Ext.getCmp('search_information').setValue('');
	
}

function addNewAction() {

	var form = Ext.getCmp('addPartForm').getForm();
    if(form.isValid()) {
    	var val = form.getValues(false);
    	var partline = Ext.ModelManager.create( val,  'PartLine');

    	//console_logs('partline', partline);

       	partline.save({
               success: function() {
                  store.load(function() {
                	  unselectForm();
                  });
              },
                failure: extjsUtil.failureMessage
           });   	

    }
}



var excel_sample = Ext.create('Ext.Action', {
	iconCls : 'MSExcelTemplateX',
	text : GET_MULTILANG('dbm1_template'),
	disabled : fPERM_DISABLING_Complished(),
	// disabled: true,
	handler : function(widget, event) {
		var lang = vLANG;
		switch (lang) {
		case 'ko':
			path = 'cab/BOM_Excel_Format_ko.xlsx'; // 상대경로 사용
			break;
		case 'zh':
			path = 'cab/BOM_Excel_Format_zh.xlsx';
			break;
		case 'en':
			path = 'cab/BOM_Excel_Format_en.xlsx';
			break;
		}
		window.location = CONTEXT_PATH + '/filedown.do?method=direct&path=' + path;
	}
});

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


var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: '새로 고침',
    disabled: false ,
    handler: function ()
    {
    	myCartStore.load(function() {});
    }
});

//var editAction = Ext.create('Ext.Action', {
//	itemId: 'editButton',
//    iconCls: 'pencil',
//    text: edit_text,
//    disabled: true ,
//    handler: editHandler
//});

//var addElecAction = Ext.create('Ext.Action', {
//	itemId: 'addElecButton',
//    iconCls: 'lightbulb_add',
//    text: dbm1_add_electrode,
//    disabled: true ,
//    handler: addElecHandler
//});

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
	            read: CONTEXT_PATH + '/design/bom.do?method=cloudread', //&with_parent=T', 
	            create: CONTEXT_PATH + '/design/bom.do?method=createNew', 
	            update: CONTEXT_PATH + '/design/bom.do?method=createNew',
	            destroy: CONTEXT_PATH + '/design/bom.do?method=destroy'
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

Ext.define('MyCartLine', {
	 extend: 'Ext.data.Model',
	 fields: /* (G) */vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/design/bom.do?method=readMycart', //&with_parent=T', 
	            destroy: CONTEXT_PATH + '/design/bom.do?method=destroyMycart'
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
	            create: CONTEXT_PATH + '/production/pcsrequest.do?method=reqMake'			/*
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


function deleteCartConfirm(btn){

    var selections = gridMycart.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	
        	var targetUid = [];
        	for(var i=0; i< selections.length; i++) {
        		var unique_uid = selections[i].get('unique_uid');
        		targetUid.push(unique_uid);
        	}
        	
        	gridMycart.setLoading(true);
        	Ext.Ajax.request({
     			url: CONTEXT_PATH + '/design/bom.do?method=deleteMyCart',
     			params:{
     				assymap_uids : targetUid
     			},
     			success : function(result, request) {   
     				myCartStore.load(function() {
     					
     					gridMycart.setLoading(false);
     				});
     			}
       	    });
        	
        	
        }
    }
};





function process_requestConfirm(btn){

    var selections = gridMycart.getSelectionModel().getSelection();
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

var removeCartAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: 'Cart' + CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteCartConfirm,
            // animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

// Define process_request Action 
var process_requestAction = Ext.create('Ext.Action', {
	itemId: 'process_requestButton',
    iconCls: 'production',
    text: '제작요청',
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title: '제작요청',
            msg: '제작요청 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: process_requestConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});



var prWin = null;
var unique_uids = null
var new_pr_quans = null;


function deleteRtgappConfirm(btn){

    var selections = agrid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
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

//Mycart
var addMyCatAction = Ext.create('Ext.Action', {
	
	itemId: 'addMyCatAction',
	iconCls:'my_purchase',
    text: '카트 담기',
    disabled: true,
    handler: function(widget, event) {
    	var my_child = new Array();
    	var my_assymap_uid = new Array();
    	var my_pl_no = new Array();
    	var my_pr_quan = new Array();
    	var my_item_code = new Array();
    	
    	var selections = grid.getSelectionModel().getSelection();
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		//console_logs('rec', rec);
    		my_child[i] = rec.get('unique_id');
    		my_assymap_uid[i] = rec.get('unique_uid');
    		my_pl_no[i] = rec.get('pl_no');
    		my_pr_quan[i] = rec.get('new_pr_quan');
    		my_item_code[i] = rec.get('item_code');
    	}
    	
    	var tab = Ext.getCmp("tabBom");
    	tab.setLoading(true);
    	Ext.Ajax.request({
 			url: CONTEXT_PATH + '/design/bom.do?method=addMyCart',
 			params:{
 				childs : my_child,
 				assymap_uids : my_assymap_uid,
 				pl_nos : my_pl_no,
 				pr_quans : my_pr_quan,
 				item_codes: my_item_code
 			},
 			success : function(result, request) {   
 				myCartStore.load(function() {
 					var tab = Ext.getCmp("tabBom");
 					tab.setActiveTab(Ext.getCmp("gridMycart"));
 					tab.setLoading(false);
 				});
 			}
   	    });
        	
	}//endofhandler

});

// 구매요청
var purchase_requestAction = Ext.create('Ext.Action', {
	
	itemId: 'purchaseButton',
	iconCls:'cart_go',
    text: PURCHASE_REQUEST,
    disabled: true,
    handler: function(widget, event) {
    	
    	unique_uids = new Array();
    	new_pr_quans = new Array();
    	
    	var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
    	
    	var lineGap = 30;
    	
    	var canContinue = true;

    	var selections = gridMycart.getSelectionModel().getSelection();
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		//console_logs('rec', rec);
    		unique_uids[i] = rec.get('unique_uid');
    		new_pr_quans[i] = rec.get('reserved_double1');
    		
    		var ac_uid = rec.get('ac_uid');
    		if(ac_uid+'' != selectedPjUid+'') {
    			canContinue = false;
    		}
    		
    	}
    	
    	if(canContinue==false) {
    		Ext.MessageBox.alert(error_msg_prompt, '작업중인 [' + combo_pj_name + '] 프로젝트에 속한 자재만 구매요청할 수 있습니다.');
    		return;
    	}
    	
    	var item_name = rec.get('item_name');
    	var item_code = rec.get('item_code');
    	var item_qty = selections.length;

    	var rtgapp_store = new Ext.data.Store({  
    		pageSize: getPageSize(),
    		model: 'RtgApp'});
    	
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
	         				unique_id:unique_id
	         			},
	         			success : function(result, request) {   
	         				rtgapp_store.load(function() {});
	         			}
	           	    });
    	            	
    				}


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
	         				unique_id:unique_id
	         			},
	         			success : function(result, request) {   
	         				rtgapp_store.load(function() {});
	         			}
	           	    });


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
               
                if (value!="W"  && value!='기안') {
                      
                       if ('gubun' == dataIndex) {
                             
                              var combo = null ;
                              // the renderer. You should define it within a
								// namespace
                              var comboBoxRenderer = function (value, p, record) {
                                    
// console_log('##########3' + value);
// console_log(p);
// console_log(record);
// console_log(combo);
                                    
                                     if (value=='W' || value=='기안' ) {

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

    		    border: false,
    		    multiSelect: true,
    		    frame: false 

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
	                                   	obj['seq'] = record.get('seq_no');
	                                   	obj['updown'] = 0;
	                                   	modifiend.push(obj);
	                                }

	                               
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
                              

                        }
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
    		        new Ext.form.Hidden({
		        	id: 'new_pr_quans',
		        	name: 'new_pr_quans',
		        	value: new_pr_quans
    		        }),
    		        new Ext.form.Hidden({
    		        	id: 'unique_uids',
    		        	name: 'unique_uids',
    		        	value: unique_uids
    		        }),
    		        new Ext.form.Hidden({
    		        	id: 'req_date',
    		        	name: 'req_date'
    		        }),
//    		        new Ext.form.Hidden({
//    	            	id: 'ac_uid',
//    	            	name: 'ac_uid',
//    	            	value: selectedPjUid
//    		        }),
//    		        new Ext.form.Hidden({
//    		        	id: 'supplier_uid',
//    		        	name: 'supplier_uid'
//    		        }),
//                	new Ext.form.Hidden({
//                		id: 'supplier_name',
//                		name: 'supplier_name'
//                	}),
                	agrid,
                	
                	{
	                	xtype: 'component',
	                	html: '<br/><hr/><br/>',
	                	anchor: '100%'
	                },
	                
                	{
    	                	xtype: 'textfield',
    	                	fieldLabel: dbm1_txt_name,
    	                	id: 'txt_name',
    	                	name: 'txt_name',
    	                	value: puchaseReqTitle,
    	                	anchor: '100%'
    	                },{
    	                	xtype: 'textarea',
    	                	fieldLabel: dbm1_txt_content,
    	                	id: 'txt_content',
    	                	name: 'txt_content',
    	                	value:  item_name+' 外 ' + (item_qty-1) + '건',
    	                	anchor: '100%'  
    	                },{
    	                	xtype: 'textarea',
    	                	fieldLabel: dbm1_req_info,
    	                	id: 'req_info',
    	                	name: 'req_info',
    	                	 allowBlank: true,
    	                	anchor: '100%'  
    	                },{
    	                	xtype: 'datefield',
    	                	id: 'request_date',
    	                	name: 'request_date',
    		            	fieldLabel: toolbar_pj_req_date,
    		            	format: 'Y-m-d',
    				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		            	value: Ext.Date.add (new Date(),Ext.Date.DAY,14),
    	            		anchor: '100%'
    		            }
    	                ]
        	});// endof createform
        	
        	// window create

        	prWin = Ext.create('ModalWindow', {
        		title: '결재' + ' :: ' + /* (G) */vCUR_MENU_NAME,
                width: 850,
                height: 500,
                plain:true,
                items: [ form
         ],
                buttons: [{
                	text: CMD_OK,
                	handler: function(btn){
                		var form = Ext.getCmp('formPanel').getForm();
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
                		    
                		    var rtgast = Ext.ModelManager.create(val, 'RtgAst');
                		    
                			rtgast.save({
    	                		success : function() {
    	                			console_log('updated');
    	                           	if(prWin) 
    	                           	{
    	                           		prWin.close();
    	                           		myCartStore.load(function() {});
    	                           	} 
    	                		} 
    	                	 });

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

var editAssyAction = Ext.create('Ext.Action', {
	itemId:'editAssyAction',
    iconCls: 'pencil',
	disabled: true,
    text: 'Assy 수정',
    handler: function(widget, event) {
    	
    	
    	if(selectedAssyCode==null || selectedAssyCode=='') {
    		Ext.MessageBox.alert('Error','수정할 Assembly를 선택하세요.', callBack);  
            function callBack(id){  
                return
            } 
            return;
    	}

    	
    	
				var lineGap = 30;
				var bHeight = 200;
				
		    	var inputItem= [];
		    	inputItem.push(
		    	{
					xtype: 'textfield',
					name: 'unique_id',
					fieldLabel: 'UID',
					allowBlank:false,
					value: selectedparent,
					anchor: '-5',
					readOnly : true,
					fieldStyle : 'background-color: #ddd; background-image: none;'
				});
		    	
		    	inputItem.push(
		    	{
					xtype: 'textfield',
					fieldLabel: 'Assembly 코드',
					allowBlank:false,
					value: selectedAssyCode,
					anchor: '-5',
					readOnly : true,
					fieldStyle : 'background-color: #ddd; background-image: none;'
				});
		    	
		    	inputItem.push(
		    			{
		                    fieldLabel: 'Assembly 명',
		                    x: 5,
		                    y: 0 + 3*lineGap,
		                    name: 'item_name',
		                    value: selectedAssyName,
		                    anchor: '-5'  // anchor width by percentage
		                }/*,{
                            xtype: 'numberfield',
                            minValue: 0,
                            width : 365,
                            name : 'bm_quan',
                            editable:true,
                            fieldLabel: getColName('bm_quan'),
                            allowBlank: true,
                            value: '1',
                            margins: '0'
                        }*/);
		
		    	
		    	var form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		            defaultType: 'textfield',
		            border: false,
		            bodyPadding: 15,
		            width: 400,
		            height: bHeight,
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
		            title: 'Assy 수정',
		            width: 400,
		            height: bHeight,
		            minWidth: 250,
		            minHeight: 180,
		            items: form,
		            buttons: [{
		                text: CMD_OK,
		            	handler: function(){
		                    var form = Ext.getCmp('formPanel').getForm();
		                    if(form.isValid())
		                    {
		                	var val = form.getValues(false);

		                	Ext.Ajax.request({
		            			url: CONTEXT_PATH + '/design/bom.do?method=updateAssyName',
		            			params:{
		            				unique_id : val['unique_id'],
		            				item_name : val['item_name']

		            			},
		            			success : function(result, request) {   
		            				cloudProjectTreeStore.load({
	                           		    callback: function(records, operation, success) {
	                           		    	console_log('load tree store');
	                           		    	console_log('ok');
	                           		    	pjTreeGrid.setLoading(false);
	                           		        // treepanel.expandAll();
	                           		    }                               
	                           		});
		            			},
		            			failure: extjsUtil.failureMessage
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
		            	}
		            }]
		        });
		        win.show(/* this, function(){} */);
    } //endofhandler
});

var addAssyAction =	 Ext.create('Ext.Action', {
	itemId:'addAssyAction',
	iconCls:'add',
	disabled: true,
    text: 'Assy 등록',
    handler: function(widget, event) {
    	
    	console_log('assy_pj_code Value : '+ assy_pj_code);
    	
    	if(assy_pj_code==null || assy_pj_code=='') {
    		Ext.MessageBox.alert('Error','추가할 모 Assembly를 선택하세요.', callBack);  
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
					Ext.getCmp('assy_pl_no').setValue("A"+num);
			},
			failure: extjsUtil.failureMessage
		});
    	
    	
    	
				var lineGap = 30;
				var bHeight = 300;
				
		    	var inputItem= [];
		    	
		    	inputItem.push(new Ext.form.Hidden({
      		       name: 'parent',
      		       value: selectedparent
      		    }));
		    	
		    	inputItem.push(new Ext.form.Hidden({
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
					flex : 1,
					readOnly : true,
					fieldStyle : 'background-color: #ddd; background-image: none;',
					name:'pj_code'
					},
					{
						xtype: 'textfield',
						allowBlank:false,
						value:combo_pj_name,
						readOnly : true,
						fieldStyle : 'background-color: #ddd; background-image: none;',
						flex : 1,
						name: 'pj_name'
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
							value:assy_pj_code+ '-',
							flex : 1,
							readOnly : true,
							fieldStyle : 'background-color: #ddd; background-image: none;'
						},
						{
							xtype: 'textfield',
							allowBlank:false,
							flex : 1,
							name: 'pl_no',
							id:'assy_pl_no'
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
                            name : 'bm_quan',
                            editable:true,
                            fieldLabel: getColName('bm_quan'),
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
		            	}
		            }]
		        });
		        win.show(/* this, function(){} */);
     }
});



// Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ /* addElecAction, editAction,  removeAction */ ]
});

var contextMenuCart = Ext.create('Ext.menu.Menu', {
    items: [ /* addElecAction, editAction, */ removeCartAction  ]
});


// Excel Upload from NX
var addNxExcel = Ext.create('Ext.Action', {
	itemId: 'addNxExcel',
    iconCls: 'MSExcelTemplateX',
    text: 'Upload',
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
            title: 'Upload ' + 'NX Excel',
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
	commonModelStore = Ext.create('Mplm.store.CommonModelStore', {hasNull: false} );
	commonDescriptionStore = Ext.create('Mplm.store.CommonDescriptionStore', {hasNull: false} );
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
		    title: getMenuTitle(),
		    border: true,
		    region: 'west',
            width: '30%',
		 //title: 'Project/Assembly',// cloud_product_class,
		 //region: 'center',
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

				    	//Pat Form 초기화
				    	resetPartForm();
				    	Ext.getCmp('addPartForm').getForm().reset();
				    	var name = record.data.text;
				    	var id = record.data.id;
				    	var depth = record.data.depth;
//				    	var leaf = record.data.leaf;
				    	

				    	
				    	var context = record.data.context;
				    	//selectedAssyhier_posfull = context;
				    	assy_code = name.substring(0,5).trim();
				    	//console_logs("assy_code", "(" +assy_code + ")");
				    	var sname = name.split('>');
				    	console_log(sname[1]);
				    	sname = sname[1].split('<');
				    	console_log(sname[0]);
				    	selectedAssyName = sname[0];
				    	
				    	
				    	if(depth>0) {
				    		selectedparent = id;
				    		//selectedAssyhier_pos = '';
				    		console_log('selectedparent='+selectedparent);

				    		assy_pj_code = combo_pj_code;
				    		
				    		selectedAssyCode = combo_pj_code + '-' + assy_code;			    		
				    		store.getProxy().setExtraParam('parent', selectedparent);
				    		store.getProxy().setExtraParam('ac_uid', selectedPjUid);
			            	store.load(function(){
			            		//console_logs('combo_pj_name', combo_pj_name);
			            		routeTitlename = '[' + selectedAssyCode  + '] ' + selectedAssyName;
			            		//puchaseReqTitle = '[' + selectedAssyCode  + '] ' + combo_pj_name;
			            		selectAssy(routeTitlename);
			                 	
			            	});
			            	
			            	//button disabling
			            	selectAssy();
			            	
			            	//tab select
		 					var tab = Ext.getCmp("tabBom");
		 					tab.setActiveTab(Ext.getCmp("gridBom"));
				    	}
				    		
				    }// end itemclick
		    	}// end listeners
			},
	        // border: 0,
            dockedItems: [
//            {
//			    dock: 'top',
//			    xtype: 'toolbar',
//				items: [addAssyAction, '-', editAssyAction]
//			},       
            {
                dock: 'top',
                xtype: 'toolbar',
                items: [
							{
								id:'projectcombo',
							    	xtype: 'combo',
							    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
							           mode: 'local',
							           editable:false,
							           // allowBlank: false,
							           width: '100%',
							           queryMode: 'remote',
							           emptyText:'완료된 프로젝트를 선택하세요.',
							           displayField:   'pj_name',
							           valueField:     'unique_id',
							           store: cloudprojectStore,
							           listConfig:{
							            	getInnerTpl: function(){
							            		return '<div data-qtip="{pj_name}">{pj_code} <small><font color=blue>{pj_name}</font></small></div>';
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

						                 	assy_pj_code ='';
						                 	selectedAssyCode = '';
						                 	combo_pj_code = pj_code;
						                 	combo_pj_name = pj_name;
						                 	selectedPjUid = pjuid;
						                 	
						                 	puchaseReqTitle = '[' + pj_code + '] ' + pj_name;
						            	 
						                 	srchTreeHandler (pjTreeGrid, cloudProjectTreeStore, 'projectcombo', 'pjuid', true);
						                 	store.removeAll();
						                 	unselectAssy();
						                 	//Default Set
							 				Ext.Ajax.request({
							 					url: CONTEXT_PATH + '/admin/menu.do?method=defaultSet',			
							 					params:{
							 						paramName : 'CommonProjectAssy',
							 						paramValue : pjuid + ';' + '-1'
							 					},
							 					
							 					success : function(result, request) {
							 						console_log('success defaultSet');
							 					},
							   	 				failure: function(result, request){
							   	 					console_log('fail defaultSet');
							   	 				}
							 				});

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
		                property: 'standard_flag',
		                direction: 'ASC'
		            },
		            {
		                property: 'pl_no',
		                direction: 'ASC'
		            }
		            
		            ]
		    	});
		    	// PartLine Store 정의
		    	myCartStore = new Ext.data.Store({  
		    		pageSize: getPageSize(),
		    		model: 'MyCartLine',
		    		// remoteSort: true,
		    		sorters: [
		            {
		                property: 'create_date',
		                direction: 'desc'
		            }
		            
		            ]
		    	});
		    	
		    	store.load(function() {

		    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

		    		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
		    			var dataIndex = columnObj["dataIndex"];
		    			
//		    			switch(dataIndex) {
//		    			case 'req_info':
//		    			case 'new_pr_quan':
//		    			case 'reserved_double1':
//		    				columnObj["editor"] = {}; columnObj["css"] = 'edit-cell';
//		    				columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
//		    		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
//		    		        	return value;
//		    	        	};		    				
//		    				break;
//		    			}
//		    			
//		    			if('req_info' == dataIndex) {
//
//		    			}

		    		});
		    		
/*********************************************************************************
 * Grid Start
 */
			    	var myGridColumn = [];
			    	
			    	for(var i=0; i<vCENTER_COLUMNS.length; i++) {
			    		
			    		switch(vCENTER_COLUMNS[i]['dataIndex']) {
			    			case 'new_pr_quan':
			    			case 'parent_item_code':
			    			case 'reserved_double1': //mycart의 pr_quan이다
			    				break;
			    			default:
			    				myGridColumn.push(vCENTER_COLUMNS[i]);
			    		}


			    	}
			    	
				    grid = Ext.create('Ext.grid.Panel', {
				    		id: "gridBom",
				    		title: 'BOM',
					        store: store,
					        // /COOKIE//stateful: true,
					        collapsible: true,
					        multiSelect: true,
					        selModel: selModel,
					        stateId: 'stateGridBom'+ /* (G) */vCUR_MENU_CODE,
					        height: getCenterPanelHeight(),
					        bbar: getPageToolbar(store),	        
					        
					        dockedItems: [
	    		      				{
	    		      					dock: 'top',
	    		      				    xtype: 'toolbar',
	    		      				    items: [
//	    		      				           removeAction, '-', 
	    		      				           addMyCatAction
	    		      				           //, 
//	    		      				           '-',
//	    		      				         '->', addNxExcel,
//	    		      				           '-',excel_sample
	    		      				         ]
	    		      				},{
	    		      		        	xtype: 'toolbar',
	    		      		        	items: [{
	    		      			        	x: 5,
	    		      			            y: 20 + 4*lineGap,
	    		      		                width:          140,
	    		      		                id:           'standard_flag_combo',
	    		      		                name:           'standard_flag_combo',
	    		      		                xtype:          'combo',
	    		      		                mode:           'local',
	    		      		                editable:       false,
	    		      		                allowBlank: false,
	    		      		                queryMode: 'remote',
	    		      		                displayField:   'codeName',
	    		      		                emptyText:  pms1_gubun,
	    		      		                valueField:     'systemCode',
	    		      		                triggerAction:  'all',
	    		      		                store: commonStandardStore,
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
	    		      		 	                    	
	    		      		                			var gubun_flag = Ext.getCmp('standard_flag_combo').getValue();
	    		      		                			store.getProxy().setExtraParam('standard_flag', gubun_flag);
	    		      				     				store.load({});
	    		      		 	                    }
	    		      		 	               }
	    		      		        }]
	    		      		        }
	    		              
	    		              ],
			        columns: /* (G) */myGridColumn,
			        //plugins: [cellEditing],
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            getRowClass: function(record) { 
	   			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
			            } ,
			            listeners: {
			        		'afterrender' : function(grid) {
								var elments = Ext.select(".x-column-header",true);
								elments.each(function(el) {
												
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
			    });
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	selectionLength = selections.length;
		            if (selections.length) {
		            	// grid info 켜기
		            	displayProperty(selections[0]);
		            	setPartForm(selections[0]);
		            	if(fPERM_DISABLING()==true) {
			            	removeAction.disable();
			            	addMyCatAction.disable();
			            	modRegAction.enable();
		            	}else{
		            		removeAction.enable();
			            	addMyCatAction.enable();
			            	
			            	//copyRevAction.enable();
			            	modRegAction.enable();
		            	}
		            } else {
		            	collapseProperty();
		            	removeAction.disable();
		            	addMyCatAction.disable();

		            }
		        }
		    });
		    
		    
		    grid.on('edit', function(editor, e) {     
			  // commit the changes right after editing finished
		    	
	          var rec = e.record;
	          //console_logs('rec', rec);
	          var unique_uid = rec.get('unique_uid');
	          var req_info = rec.get('req_info');
	          
		      	Ext.Ajax.request({
					url: CONTEXT_PATH + '/design/bom.do?method=updateDesinComment',
					params:{
						id: unique_uid,
						req_info:req_info
					},
					success : function(result, request) {   

						var result = result.responseText;
						//console_logs("", result);

					},
					failure: extjsUtil.failureMessage
				});
		      	
			  rec.commit();
			});
		    
/**
 * grid End
 *******************************************************************************/
		   
    		
			    	var myCartColumn = [];
			    	
			    	for(var i=0; i<vCENTER_COLUMNS.length; i++) {
			    		
			    		switch(vCENTER_COLUMNS[i]['dataIndex']) {
			    			case 'req_info':
			    			case 'statusHangul':
			    			//case 'standard_flag':
			    			case 'sales_price':
			    				break;
			    			default:
			    				myCartColumn.push(vCENTER_COLUMNS[i]);
			    		}
			    	}
		
			    	
			    	var selModelMycart = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			    	
				    gridMycart = Ext.create('Ext.grid.Panel', {
			    		id: 'gridMycart',
			    		title: 'My Cart',
				        store: myCartStore,
				        // /COOKIE//stateful: true,
				        collapsible: true,
				        multiSelect: true,
				        selModel: selModelMycart,
				        stateId: 'gridMycart'+ /* (G) */vCUR_MENU_CODE,
				        height: getCenterPanelHeight(),       
				        
				        dockedItems: [
			      				{
			      					dock: 'top',
			      				    xtype: 'toolbar',
			      				    items: [
			      				           searchAction, '-', removeCartAction, '-',
			      				         '->'
			      				         ]
			      				}
			              
			              ],
		        columns: /* (G) */myCartColumn
		        ,
//		        plugins: [cellEditing1]
//		        ,
		        viewConfig: {
		            stripeRows: true,
		            enableTextSelection: true,
		            getRowClass: function(record) { 
				              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
		            } ,
		            listeners: {
		        		'afterrender' : function(gridMycart) {
							var elments = Ext.select(".x-column-header",true);
							elments.each(function(el) {
											
										}, this);
								
							}
		            		,
		                itemcontextmenu: function(view, rec, node, index, e) {
		                    e.stopEvent();
		                    contextMenuCart.showAt(e.getXY());
		                    return false;
		                }
		            }
		        }
		    });
			gridMycart.getSelectionModel().on({
			    selectionchange: function(sm, selections) {
			    	selectionLength = selections.length;
			        if (selections.length) {
			        	// gridMycart info 켜기
			        	displayProperty(selections[0]);
			        	if(fPERM_DISABLING()==true) {
			        		removeCartAction.disable();
			        		pasteAction.disable();
			            	process_requestAction.disable();
			            	purchase_requestAction.disable();
			        	}else{
			        		removeCartAction.enable();
			        		pasteAction.enable();
			            	process_requestAction.enable();
			            	purchase_requestAction.enable();

			        	}
			        } else {
			        	collapseProperty();
			        	removeCartAction.disable();
			        	pasteAction.disable();
			        	process_requestAction.disable();
			        	purchase_requestAction.disable();
			
			        }
			    }
			});
			
			
			gridMycart.on('edit', function(editor, e) {     
			  // commit the changes right after editing finished
				
			  var rec = e.record;
			  //console_logs('rec', rec);
			  var unique_uid = rec.get('unique_uid');
			  var reserved_double1 = rec.get('reserved_double1');
			  
			  	Ext.Ajax.request({
					url: CONTEXT_PATH + '/design/bom.do?method=updateMyCartQty',
					params:{
						assymap_uid: unique_uid,
						pr_qty: reserved_double1
					},
					success : function(result, request) {   
			
						var result = result.responseText;
						//console_logs("", result);
			
					},
					failure: extjsUtil.failureMessage
				});
			  	
			  rec.commit();
			});
	    		
	    	myCartStore.load(function() { });
/*****************************************************************************88
 * Mycart Grid End
 */
		    Ext.define('SrcAhd', {
		   	 extend: 'Ext.data.Model',
		   	 fields: [     
		       		 { name: 'unique_id', type: "string" }
		     		,{ name: 'item_code', type: "string"  }
		     		,{ name: 'item_name', type: "string"  }
		     		,{ name: 'specification', type: "string"  }
		     		,{ name: 'maker_name', type: "string"  }
		     		,{ name: 'description', type: "string"  }
		     		,{ name: 'specification_query', type: "string"  }
		     	  	  ],
		   	    proxy: {
		   			type: 'ajax',
		   	        api: {
		   	            read: CONTEXT_PATH + '/purchase/material.do?method=searchPart'
		   	        },
		   			reader: {
		   				type: 'json',
		   				root: 'datas',
		   				totalProperty: 'count',
		   				successProperty: 'success'
		   			}
		   		}
		   });
		    
	    	var searchStore = new Ext.data.Store({  
	    		pageSize: 16,
	    		model: 'SrcAhd',
	    		// remoteSort: true,
	    		sorters: [{
	                property: 'specification',
	                direction: 'ASC'
	            },
	            {
	                property: 'item_name',
	                direction: 'ASC'
	            }]

	    	});
	    	
			var myFormPanel = Ext.create('Ext.form.Panel', {
				id: 'addPartForm',
				title: 'Part',
				xtype: 'form',
				frame: false,
		        border: false,
	            bodyPadding: 10,
	            autoScroll: true,
	            disabled: true,
		        defaults: {
		            anchor: '100%',
		            allowBlank: true,
		            msgTarget: 'side',
		            labelWidth: 60
		        },
		        // border: 0,
	            dockedItems: [
	              {
				      dock: 'top',
				    xtype: 'toolbar',
					items: [resetAction, '-', modRegAction/*, '-', copyRevAction*/]
				  }],
		        items: [{
					id :'search_information',
					field_id :'search_information',
			        name : 'search_information',
		            xtype: 'combo',
		            emptyText: '규격으로 검색',
		            store: searchStore,
		            displayField: 'specification',
		            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		            sortInfo: { field: 'specification', direction: 'ASC' },
		            minChars: 1,
		            typeAhead: false,
		            hideLabel: true,
		            hideTrigger:true,
		            anchor: '100%',

		            listConfig: {
		                loadingText: '검색중...',
		                emptyText: '일치하는 결과가 없습니다.',

		                // Custom rendering template for each item
		                getInnerTpl: function() {
		                    return '<div><a class="search-item" href="javascript:setBomData({id});">' +
		                        '<span style="color:#999;"><small>{item_code}</small></span> <span style="color:#999;">{item_name}</span><br />{specification_query} <span style="color:#999;"><small>{maker_name}</small></span>' +
		                    '</a></div>';
		                }
		            },
		            pageSize: 10
		        }, {
		            xtype: 'component',
		            style: 'margin-top:10px',
		            html: '먼저, 등록된 자재인지 검색하세요.<hr>'
		        }
		        ,
		        new Ext.form.Hidden({
            		id: 'parent',
            		name: 'parent'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'ac_uid',
	        		name: 'ac_uid'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'pj_code',
	        		name: 'pj_code'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'coord_key2',
	        		name: 'coord_key2'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'standard_flag',
	        		name: 'standard_flag'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'child',
	        		name: 'child'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'sg_code',
	        		name: 'sg_code',
	        		value:'NSD'
	        	}),
	        	new Ext.form.Hidden({
	        		id: 'hier_pos',
	        		name: 'hier_pos'
	        	}),
				new Ext.form.Hidden({
					id: 'assy_name',
					name: 'assy_name',
					value:selectedAssyName
					
				}),
				new Ext.form.Hidden({
					id: 'pj_name',
					name: 'pj_name',
					value:combo_pj_name
				}),
				new Ext.form.Hidden({
					id: 'isUpdateSpec',
					name: 'isUpdateSpec',
					value: 'false'
				}),
    	        {
              	   xtype: 'container',
              	   layout: 'hbox',
              	   margin: '10 0 5 0',
	   		        defaults: {
			            allowBlank: true,
			            msgTarget: 'side',
			            labelWidth: 60
			        },
                   items: [
            				{	
            					fieldLabel:    getColName('unique_id'),
            		   			xtype:  'textfield', 
            					id:   'unique_id',
            					name: 'unique_id',
            					emptyText: '자재 UID', 
            					flex:1,
            					readOnly: true,
            					width: 300,
            					fieldStyle: 'background-color: #EAEAEA; background-image: none;'
            		        },
            				{	
            		   			xtype:  'textfield',
            					id:   'unique_uid',
            					name: 'unique_uid',
            					emptyText: 'BOM UID', 
            					flex:1,
            					readOnly: true,
            					fieldStyle: 'background-color: #EAEAEA; background-image: none;'
            		        }
                   ]
    	        },
		        {	
		        	xtype:  'triggerfield',
					fieldLabel:    getColName('item_code'),
					id:  'item_code',
					name: 'item_code',
					emptyText: '자동 생성',
					listeners : {
		          		specialkey : function(field, e) {
		          		if (e.getKey() == Ext.EventObject.ENTER) {
		          		}
		          	}
			      	},
			          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger', 'onTrigger1Click': function() {
			          	
			        	  
			        	  var val = Ext.getCmp('item_code').getValue();
			        	  if(val!=null && val!='') {
			        	  

			        		Ext.Ajax.request({
			        			url: CONTEXT_PATH + '/design/bom.do?method=getMaterialByItemcode',
			        			params:{
			        				item_code :val
			        			},
			        			success : function(result, request) {  
			        				var jsonData = Ext.decode(result.responseText);
			        				var records = jsonData.datas;
			        				if(records!=null && records.length>0) {
						        		modRegAction.enable();
						        		resetPartForm();
				        				setPartFormObj(records[0]);
			        				} else {
			        					Ext.MessageBox.alert('알림','알 수없는 자재번호입니다.');
			        				}

			        			},
			        			failure: extjsUtil.failureMessage
			        		});  
			        	  
			        	  
			        	  
			        	  
			        	  
			        	  }//endofif
			        	  
			        	  
			        	  
			        	  
			        	  
			        	  
			        	  
			        	  
			      	}
					//readOnly: true,
					//fieldStyle: 'background-color: #EAEAEA; background-image: none;'
		        },
		        {

	                id:           'standard_flag_disp',
	                name:           'standard_flag_disp',
	                xtype:          'combo',
	                mode:           'local',
	                editable:       false,
	                allowBlank: false,
	                queryMode: 'remote',
	                displayField:   'codeName',
	                value:          '',
	                triggerAction:  'all',
	                fieldLabel: getColName('standard_flag')+'*',
	                store: commonStandardStore2,
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
	     	                    	Ext.getCmp('standard_flag').setValue(systemCode);
	     	                    	
	     	                    	getPl_no(systemCode);
//								 	var prefix = systemCode;
//								 	if(systemCode=='S') {
//								 		prefix = 'K';
//								 	} else if(systemCode=='O') {
//								 		prefix = 'A';
//								 	}
//	     	                    	
//	                         	   Ext.Ajax.request({
//	                       			url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
//	                       			params:{
//	                       				first:prefix,
//	                       				parent_uid:selectedparent
//	                       			},
//	                       			success : function(result, request) {   
//	                       				var result = result.responseText;
//	                       				var str = result;	// var str = '293';
//	                       				Ext.getCmp('pl_no').setValue(str);
//
//	                       				
//	                       			},
//	                       			failure: extjsUtil.failureMessage
//	                       		});
	     	                    	
	     	                    	
	     	                    	
	     	                    	
	     	                    }
	     	               }
	            },
	            {
		            xtype: 'fieldset',
		            title: '품번* | 품명*', //panelSRO1139,
		            collapsible: false,
		            defaults: {
		                labelWidth: 40,
		                anchor: '100%',
		                layout: {
		                    type: 'hbox',
		                    defaultMargins: {top: 0, right: 3, bottom: 0, left: 0}
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
		                    items : [     
			                {
			                    xtype: 'textfield',
			                    width:      50,
			                    emptyText: '품번*', 
			                    name : 'pl_no',
			                    id : 'pl_no',
			                    fieldLabel: '품번',
			                    readOnly : false,
			                    allowBlank: false
			                },
			                {
			                    xtype: 'textfield',
			                    flex : 1,
			                    emptyText: '품명'+'*', 
			                    name : 'item_name',
			                    id : 'item_name',
			                    fieldLabel: getColName('item_name'),
			                    readOnly : false,
			                    allowBlank: false
			                }
			            ]
				        }
				    ]
				},
	        {
	        	xtype:  'textfield',
	       	 	fieldLabel: getColName('specification')+'*',
	       	 	id: 'specification',
	       	 	name: 'specification',
	            allowBlank: false
	       }
            ,{
            	xtype:  'textfield', 
            	fieldLabel: getColName('maker_name'),
                id: 'maker_name',
                name: 'maker_name',
                allowBlank: true
			},{
			    id:           'model_no',
			    name:           'model_no',
			    xtype:          'combo',
			    mode:           'local',
			    editable:       true,
			    allowBlank: true,
			    queryMode: 'remote',
			    displayField:   'codeName',
			    valueField:     'codeName',
			    triggerAction:  'all',
			    fieldLabel: getColName('model_no'),
			    store: commonModelStore,
			    listConfig:{
			    	getInnerTpl: function(){
			    		return '<div data-qtip="{systemCode}">{codeName}</div>';
			    	}			                	
			    },
			    listeners: {			load: function(store, records, successful,operation, options) {
					if(this.hasNull) {
						var blank ={
								systemCode:'',
								codeNameEn: '',
								codeName: ''
						};
						
						this.add(blank);
					}
			
				    },
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
			,{
			    id:           'description',
			    name:           'description',
			    xtype:          'combo',
			    mode:           'local',
			    editable:       true,
			    allowBlank: true,
			    queryMode: 'remote',
			    displayField:   'codeName',
			    valueField:     'codeName',
			    triggerAction:  'all',
			    fieldLabel: getColName('description'),
			    store: commonDescriptionStore,
			    listConfig:{
			    	getInnerTpl: function(){
			    		return '<div data-qtip="{systemCode}">{codeName}</div>';
			    	}			                	
			    },
			    listeners: {			load: function(store, records, successful,operation, options) {
					if(this.hasNull) {
						var blank ={
								systemCode:'',
								codeNameEn: '',
								codeName: ''
						};
						
						this.add(blank);
					}
			
				    },
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
            ,{
				xtype:  'textfield', 
				fieldLabel: getColName('comment'),
			    id: 'comment',
			    name: 'comment',
			    allowBlank: true
			}
			,{
			    xtype: 'fieldset',
			    border: true,
			    // style: 'border-width: 0px',
			    title: panelSRO1186+' | '+panelSRO1187+' | '+panelSRO1188+' | 통화',//panelSRO1174,
			    collapsible: false,
			    defaults: {
			        labelWidth: 40,
			        anchor: '100%',
			        layout: {
			            type: 'hbox',
			            defaultMargins: {top: 0, right: 0, bottom: 0, left: 0}
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
			            items : [
                     {
                         xtype: 'numberfield',
                         minValue: 0,
                         width : 50,
                         id: 'bm_quan',
                         name : 'bm_quan',
                         fieldLabel: getColName('bm_quan'),
                         allowBlank: true,
                         value: '1',
                         margins: '0'
                     },{
                        width:          50,
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
                },
                {
                    xtype: 'numberfield',
                    minValue: 0,
                    flex: 1,
                    id : 'sales_price',
                    name : 'sales_price',
                    fieldLabel: getColName('sales_price'),
                    allowBlank: true,
                    value: '0',
                    margins: '0'
                }, {
                    width:         50,
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
            }
            ]
	        }
		    ]
		}
			,{
	            xtype: 'container',
	                                        type: 'hbox',
	                                        padding:'5',
	                                        pack:'end',
	                                        align:'left',
	            defaults: {
	            },
	            margin: '0 0 0 0',
	            border:false,
	            items: [
			        {
	                    xtype:'button',
	                    id: 'ok_btn_id',
	                    text: CMD_OK,
			            handler: function() {
			            	
			            	var item_code = Ext.getCmp('item_code').getValue();
				    		if(item_code==null || item_code.length==0) {
				    			item_code = combo_pj_code + assy_code + Ext.getCmp('pl_no').getValue();
				    			Ext.getCmp('item_code').setValue(item_code);
				    		}
				    		
				    		Ext.getCmp('parent').setValue(selectedparent);
				    		Ext.getCmp('ac_uid').setValue(selectedPjUid);
				    		Ext.getCmp('pj_code').setValue(combo_pj_code);
			            	
			                this.up('form').getForm().isValid();


			            	var isUpdateSpec = Ext.getCmp('isUpdateSpec').getValue();
			            	var specification = Ext.getCmp('specification').getValue();
			            	var unique_id = Ext.getCmp('unique_id').getValue();
			            	
			            	var idx = specification.search(CHECK_DUP);
			            	if(idx>-1) {
			            		Ext.MessageBox.alert('경고','규격 수정이 필요합니다. 다시 한번 확인하세요.');
			            	} else {
				            	if(isUpdateSpec=='true' || unique_id.length < 3) {//자재를 수정하는 경우 이다. 중복체크 필요.
				            		Ext.Ajax.request({
				            			url: CONTEXT_PATH + '/design/bom.do?method=getMaterialBySpecification',				
				            			params:{
				            				specification : specification
				            			},
				            			success : function(result, request) {
				            				var jsonData = Ext.decode(result.responseText);
				             				var found = jsonData['result'];
				             				var exist = Ext.getCmp('unique_id').getValue();
				             				
				             				if(found.length>2 && exist != found ) {// 다른 중목자재 있음.
				             					Ext.MessageBox.alert('경고','이미 동일한 규격의 자재가 등록되어 있습니다.');
				             				} else {
				             					addNewAction();
				    			                //resetPartForm();
				    			                //this.up('form').getForm().reset();
				             				}
				            			},// endof success for ajax
				            			failure: extjsUtil.failureMessage
				            		}); // endof Ajax
				            	} else {
				            		addNewAction();
					                //resetPartForm();
					                //this.up('form').getForm().reset();	
				            	}
			            	}
			            }
			        },{
			            xtype:'button',
			            id: 'init_btn_id',
			            text: '초기화',
			            handler: function() {
			            	resetPartForm();
			                this.up('form').getForm().reset();
			            }
			        }
	    		]
	         }
//		,
//		{
//        	id: 'partSaveBtn',
//            text: CMD_OK,
//            xtype: 'button',
//            //disabled: true,
//            width:50,
//            handler: function(btn){
//    			
//            }//endofhandler
//        } //endofbutton
			
		//		{xtype: 'container',flex: 1,                                     
//				layout: {
//	                type:'vbox',
//	                align:'stretch'
//	            },  
//	            items: [
//		            {
//		            	id: 'partSaveBtn',
//		                text: CMD_OK,
//		                xtype: 'button',
//		                disabled: true,
//		                handler: function(btn){
//			    			
//		                }//endofhandler
//		            } //endofbutton
//		  ]}       
		        ]
			});
			
//		 var main1 =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
//				//height: getCenterPanelHeight(),
//			    layout:'border',
//			    title: getMenuTitle(),
//			    border: true,
//			    region: 'west',
//	            width: '30%',
//			    layoutConfig: {columns: 2, rows:1},
//
//			    items: [pjTreeGrid/*, myFormPanel*/]
//			});
			
		 var main2 =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
				//height: getCenterPanelHeight(),
			    layout:'border',
			    id: "tabBom",
			    title: '-',
			    border: true,
			    region: 'center',
	            width: '70%',
//			    layoutConfig: {columns: 2, rows:1},

			    items: [grid, gridMycart]
			});
			
			var main =  Ext.create('Ext.panel.Panel', {
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
			    items: [  pjTreeGrid, main2  ]
			});
			
		
		main2.setLoading(true);
//			
//		Ext.Ajax.request({
//		url: CONTEXT_PATH + '/admin/menu.do?method=defaultGet',			
//		params:{
//			paramName : 'CommonProjectAssy'
//		},
//		success : function(result, request) {
//			console_log('success defaultGet');
//			var id = result.responseText;
//			
//			console_log('id:'+id);
//			var arr = id.split(';');
//			var ac_uid = arr[0];
//
//			cloudprojectStore.load(function(records) { 
//				
//				var rec = null;
//				for(var i=0; i<records.length; i++) {
//					var id = records[i].get('id');
//					console_log('ac_uid=' + ac_uid);
//					console_log('id=' + id);
//					if(Number(ac_uid) == Number(id)) {
//						rec = records[i];
//					}
//				}
//				
//	     		if(rec!=null) {
//		     		var pj_code = rec.get('pj_code');
//					var pj_name = rec.get('pj_name');
//		     		var projectcombo = Ext.getCmp('projectcombo');
//		     		projectcombo.setValue('[' + pj_code + '] ' + pj_name);
//					var record = [];
//					record[0] = rec;
//		     		projectcombo.fireEvent('select', projectcombo, record);
//					projectcombo['forceSelection'] = true;
//					console_log('-------------------------------------------srchTreeHandler');
//					
//					
//					cloudProjectTreeStore.getProxy().setExtraParam('pjuid', ac_uid);
//					
//					
//					cloudProjectTreeStore.load({
//					    callback: function(records, operation, success) {
//				
//					    	main2.setLoading(false);
//							console_log('ok');
//					    }                               
//					});
//					
//	     		}
//			});
//    		
//		},
//		failure: function(result, request){
//			console_log('fail defaultGet');
//		} /*extjsUtil.failureMessage*/
//	});

		fLAYOUT_CONTENT(main);
		
//		//데이타타입 추가
//		vCENTER_FIELDS.push({ name: 'isUpdateSpec', type: 'string'});
		
		cenerFinishCallback();// Load Ok Finish Callback
 	});
});	// OnReady

