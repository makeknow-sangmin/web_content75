//var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
//	clicksToEdit: 1
//});
//var cellEditing1 = Ext.create('Ext.grid.plugin.CellEditing', {
//	clicksToEdit: 1
//});
var cellEditing2 = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});
// *****************************GLOBAL VARIABLE**************************/
var grid = null;

var pjGrid = null;

var i = 0;

var store = null;

var stockStore = null;

var agrid = null;

var ahid_userlist = new Array();
var ahid_userlist_role = new Array();

var selectedPjCode='';

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

var cloudprojectStore = Ext.create('Mplm.store.cloudProjectStore', {} );
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





function fPERM_DISABLING_Complished() {
	// 1. 권한있음.
	if (fPERM_DISABLING() == false && is_complished == false) {
		return false;
	} else { // 2.권한 없음.
		return true;
	}
}










function resetParam() {
	store.getProxy().setExtraParam('unique_id', '');
	store.getProxy().setExtraParam('item_code', '');
	store.getProxy().setExtraParam('item_name', '');
	store.getProxy().setExtraParam('specification', '');
}



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
	console_logs('o', o);

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
	console_logs('record', record);

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

}

function unselectForm() {

}

function readOnlyPartForm(b) {

}

function addNewAction() {

}

var goodsout_requestAction = Ext.create('Ext.Action', {
	
	itemId: 'goodsoutButton',
	iconCls:'nxsession',
    text: '반출요청',
    disabled: true,
    handler: function(widget, event) {
    	doRequestAction(true);
    
    }// endof handler
});// endof define action

function insertStockStoreRecord(records) {
	
}

function renderCarthistoryPlno(value, p, record) {
	var unique_uid = record.get('unique_uid');
	
    return Ext.String.format(
            '<a href="#" onclick="popupCarthistoryPlno(\'{0}\', \'{1}\')" >{1}</a>',
           unique_uid, value
        );
}



var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchToolBarTap
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

Ext.define('PartLineStock', {
	 extend: 'Ext.data.Model',
	 fields: /* (G) */vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/design/bom.do?method=cloudread&stock_qty_useful_not_zero=true&only_goodsout_quan=true',
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


var prWin = null;
var unique_uids = null;
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




// Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ /* addElecAction, editAction,  removeAction */ ]
});


function treeSelectHandler(record) {
	console_logs('record', record);
	var menu_code = 'QGR5';
	var id = record.data.id;
	var not_standard_flag = 'A';
	selectedparent = id;

	
	stockStore.getProxy().setExtraParam('ac_uid', selectedparent);
	stockStore.getProxy().setExtraParam('menu_code', menu_code);
	stockStore.getProxy().setExtraParam('not_standard_flag', not_standard_flag);
	
	
	console_logs('ac_uid', selectedparent);
	console_logs('menu_code', menu_code);
	console_logs('not_standard_flag', not_standard_flag);

		stockStore.load(function(records){
    		insertStockStoreRecord(records);
    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

    		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
    			var dataIndex = columnObj["dataIndex"];
    			
    			switch(dataIndex) {
    			case 'req_info':
    			case 'goodsout_quan':
    			case 'reserved_double1':
    				columnObj["editor"] = {}; columnObj["css"] = 'edit-cell';
    				columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
    		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
    		        	return value;
    	        	};		    				
    				break;
    			case 'statusHangul':
    				columnObj["tdCls"] =  'x-change-cell';
    				break;
				case 'item_code':
					columnObj["renderer"] = renderPohistoryItemCode;
					break;
				case 'pl_no':
					columnObj["renderer"] = renderCarthistoryPlno;
					break;
    			}

    		});
			
    		
    	});
		
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
	
    Ext.define('ProjectMold', {
      	 extend: 'Ext.data.Model',
      	 fields: /*(G)*/vCENTER_FIELDS,
      	    proxy: {
   				type: 'ajax',
   		        api: {
   		            read: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudread&menu_code=QGR5', /*1recoed, search by cond, search */
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
   		model: 'ProjectMold',
   		//remoteSort: true,
   		sorters: [{
               property: 'unique_id',
               direction: 'DESC'
           }]
   	});
    
   	
    console_logs('now starting...');
	
    store.load(function() {
  //  var gridSelModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false, singleSelect:true} );
	 pjGrid =
    	Ext.create('Ext.grid.Panel', {
		    title: getMenuTitle(),
		    store: store,
		    stateId: 'stateGrid',
		   // selModel: gridSelModel,
		    border: true,
		    autoScroll : true,
		    height: getCenterPanelHeight()-53,
		    region: 'west',
            width: '30%',
            border: false,
	        bbar: getPageToolbar(store),
	       
	        columns: /*(G)*/vCENTER_COLUMNS,
	        viewConfig: {
	        	 stripeRows: true,
		         enableTextSelection: true,
		    	listeners: {
		    		
		    		
		    		
		    		
		    		itemclick: function(grid, record, item, index, e, eOpts) {                      

		    			treeSelectHandler(record);
		    		
				    		
				    }// end itemclick
		    	}// end listeners
			},
	
		 
		// rootVisible: false,
		// cls: 'examples-list',
		// lines: true,
		// useArrows: true,
		 // margins: '0 0 0 5',

		} );

	//pjstore.load(function(records) {
	
		
//	});
	
	

	
	
	
	
	
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
		    	stockStore = new Ext.data.Store({  
		    		pageSize: getPageSize(),
		    		model: 'PartLineStock'
		    	});
		    	
		    	var stockGridColumn = [];
	    		
	    		for(var i=0; i<vCENTER_COLUMNS.length; i++) {
	    			

	    			switch(vCENTER_COLUMNS[i]['dataIndex']) {
	    			//case 'new_pr_quan':
	    			//case 'parent_item_code':
	    			case 'reserved_double1':
	    			case 'standard_flag':	
	    			case 'sp_code':
	    			case 'req_info':
	    			case 'route_type':
	    			case 'statusHangul':
	    				break;
	    			default:
	    				stockGridColumn.push(vCENTER_COLUMNS[i]);
	    		}


	    		}
	    		
	    		var selModelStock = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
	    		gridStock = Ext.create('Ext.grid.Panel', {
	    			id: 'gridStock',
	    			title: '반출요청',
	    	        store: stockStore,
	    	        region: 'center',
	    	        width: '70%',
	    	        // /COOKIE//stateful: true,
	    	        collapsible: false,
	    	        multiSelect: true,
	    	        boder: false,
	    	        selModel: selModelStock,
	    	        stateId: 'gridStock'+ /* (G) */vCUR_MENU_CODE,
	    	        height: getCenterPanelHeight(),       
	    	        
	    	        dockedItems: [
	    	  				{
	    	  					dock: 'top',
	    	  				    xtype: 'toolbar',
	    	  				    items: [
	    	  				            goodsout_requestAction
	    	  				           ]
	    	  				}
	    	          
	    	          ],
	    		        columns: stockGridColumn,
	    		        plugins: [cellEditing2],		
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
	    			    	
	    		gridStock.getSelectionModel().on({
	    		    selectionchange: function(sm, selections) {
	    		    	selectionLength = selections.length;
	    		        if (selections.length) {
	    		        	goodsout_requestAction.enable();
	    		        } else {
	    		        	goodsout_requestAction.disable();
	    		        }
	    		    }
	    		});
		    	
		    	
		    	stockStore.load(function() {

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
			    items: [  pjGrid, gridStock  ]
			});
			
		
//		grid.setLoading(true);


		fLAYOUT_CONTENT(main);
		
//		//데이타타입 추가
//		vCENTER_FIELDS.push({ name: 'isUpdateSpec', type: 'string'});
		
		cenerFinishCallback();// Load Ok Finish Callback
 	});
	});//pjstore.load end
});	// OnReady

