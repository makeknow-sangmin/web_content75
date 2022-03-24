
// *****************************GLOBAL VARIABLE**************************/
var grid = null;
var store = null;

var selectedAssyRecord = null;
var selectedBomRecord = null;

var selectedPjUid = '';
var selectedAssyUid = '';
var selectedMoldCode = '';
var selectedMoldCoord = '';
var selectedMoldName = '';
var toPjUidAssy = '';	// parent
var toPjUid = '';	// ac_uid
var selectionLength = 0;


var assy_pj_code='';
var assy_code='';
var combo_pj_code='';
var combo_pj_name='';
var selectedAssyCode = '';

var selectedAssyName ='';
var selectedparent ='';
var ac_uid = '';

var is_complished = false;

var routeTitlename = '';
var puchaseReqTitle = '';


var cloudprojectStore = Ext.create('Mplm.store.cloudProjectStore', {} );
var cloudProjectTreeStore = Ext.create('Mplm.store.cloudProjectTreeStore', {});
var stockStore = null;

var arrSearchObj=[];

var selectedPartRecord = null;

function resetSelectPart() {
	selectedPartRecord = null;
	Ext.getCmp(getSearchField('maker_name')).setValue('');
	Ext.getCmp(getSearchField('specification')).setValue('');
}

var searchWords;
function mySearch(){
	stockStore.removeAll();
	//param reset
	for(var i=0; i<arrSearchObj.length; i++) {
		var index = arrSearchObj[i];
		stockStore.getProxy().setExtraParam(index, '');
	}
	searchWords = [];
	for(var i=0; i<arrSearchObj.length; i++) {
		var index = arrSearchObj[i];
		var val = Ext.getCmp(getSearchField(index)).getValue();
		var enValue = Ext.JSON.encode(val);
		console_logs('index', index);
		console_logs('val', val);
		console_logs('enValue', enValue);
		if(val.length>1) {
			if(index=='spec_cond') {
				stockStore.getProxy().setExtraParam(index, val);
			} else if(index=='maker_name') {
				stockStore.getProxy().setExtraParam(index, enValue);
			} else {
				stockStore.getProxy().setExtraParam(index, enValue);
			}
			
			if(index!='spec_cond' && index!='maker_name') {
				searchWords.push(val);	
			}			
		}

	}
	stockStore.getProxy().setExtraParam('has_stock', "Y");
	stockStore.getProxy().setExtraParam('has_stock_useful', "Y");
	stockStore.getProxy().setExtraParam('start', 0);
	stockStore.getProxy().setExtraParam('limit', 50);
	stockStore.getProxy().setExtraParam('page', 1);
	stockStore.load( function(records) {
		
		for(var i=0; i<records.length; i++) {
			var rec = records[i];
			console_logs('rec', rec);
			var specification = rec.get('specification');
			
			for(var j=0; j<searchWords.length; j++) {
				var from = searchWords[j];
				console_logs('from', from);
				if(from!=null && from.length> 1) {
					console_logs('replacing', from);
					specification = specification.replace(new RegExp(from, 'g'), '<font color=red>' + from + '</font>');	
				}
			}
			console_logs('specification', specification);
			rec.set('specification', specification);
		}
	});
}
//
//function getSearchObj(index, label) {
//	arrSearchObj.push(index);
//	return 		{
//	    xtype: 'container',
//	    layout:'hbox',
//	    items:[ 
//			{
//			    xtype:'label',
//			    text: label + ':',
//			    width: 50,
//			    labelAlign: 'right',
//			    align:'right',
//			    margin: '5 6 2 10',
//			    fieldStyle: 'text-align:right;'
//			},	
//			{
//				    xtype: 'triggerfield',
//				    width: 130,
//				    emptyText: label, //getTextName(/*(G)*/vCENTER_FIELDS, index),
//				    id: getSearchField(index),
//			    	listeners : {
//			        		specialkey : function(fieldObj, e) {
//			        		if (e.getKey() == Ext.EventObject.ENTER) {
//			        			mySearch();
//			        		}
//			        	}
//			    	},
//				    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
//				    'onTrigger1Click': function() {
//				    	Ext.getCmp(getSearchField(index)).setValue('');
//					}
//				
//			}
//			]};
//}


var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: function() {
    	mySearch();
    }
    //handler: searchHandler
});

var replaceAction = Ext.create('Ext.Action', {
	itemId: 'replaceAction',
    iconCls: 'Orange_Loop',
    text: '자재 대체',
    disabled: true ,
    handler: function() {
    	Ext.MessageBox.show({
            title:'자재 대체',
            msg: 'BOM을 선택한 재고 자재로 변경하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function(btn) {
                var result = MessageBox.msg('{0}', btn);
                console_logs('result', result);
                if(result=='yes') {
                	console_logs('selectedBomRecord', selectedBomRecord);
                	
                    var stockSel = gridReplacer.getSelectionModel().getSelection();
                    if (stockSel) {
                    	var selectedMaterial = stockSel[0];
                    	console_logs('selectedMaterial', selectedMaterial);
                    	
                    	var unique_uid = selectedBomRecord.get('unique_uid');
                    	var child = selectedMaterial.get('unique_id');
                    	
                 	   Ext.Ajax.request({
                 			url: CONTEXT_PATH + '/design/bom.do?method=replaceBomMaterial',
                 			params:{
                 				assymap_uid: unique_uid,
                 				child: child
                 			},
                 			success : function(result, request) {   
                 				var result = result.responseText;
                 				
                 				store.load(function(records){
                 					
                 				});
                 			},
                 			failure: extjsUtil.failureMessage
                 		});
                    	
                    } else {
                    	Ext.MessageBox.alert('오류','선택한 재고 자재를 찾을 수 없습니다.');
                    }
                	
                	
                }else {

                }
            },
            icon: Ext.MessageBox.QUESTION
        });  
    }
    //handler: searchHandler
});





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
     				store.load( function(records) {
	     					
	     				});
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

function srchTreeHandler (treepanel, cloudProjectTreeStore, widName, parmName) {
	
	//console_info("srchSingleHandler");
	treepanel.setLoading(true);
	
	resetParam(cloudProjectTreeStore, searchField);
	var val = Ext.getCmp(widName).getValue();
	console_log('val'+val);

	cloudProjectTreeStore.getProxy().setExtraParam(parmName, val);
	cloudProjectTreeStore.load( {
				
		callback: function(records, operation, success) {
				treepanel.setLoading(false);
		}
	});

};

function eliminateDuplicates(arr) {
  var i,
      len=arr.length,
      out=[],
      obj={};

  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

function setPartForm(record) {
	console_logs('record:', record);
	
	selectedBomRecord = record;
	
	var maker_name = record.get('maker_name');
	var specification = record.get('specification');
	
	Ext.getCmp(getSearchField('maker_name')).setValue(maker_name);
	Ext.getCmp(getSearchField('specification')).setValue(specification);

	selectedPartRecord = record;
	
	var ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
	var ALPHAONLY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var specs = [];
	var alphanumVal = "";
	var alphaonlyVal = "";
	
	//console_logs('split specs', specification);
	for(var i=0; i<specification.length; i++) {
		var c = specification.charAt(i);
		//console_logs('c', c);
		if(ALPHANUM.indexOf(c)==-1) {
			if(alphanumVal.length > 0) {
				specs.push(alphanumVal);
				//console_logs('pushed', alphanumVal);
				alphanumVal ="";
			}
		} else {
			alphanumVal = alphanumVal + c;
			//console_logs('concated to', alphanumVal);
		}
		
		if(ALPHAONLY.indexOf(c)==-1) {
			if(alphaonlyVal.length > 0) {
				specs.push(alphaonlyVal);
				//console_logs('pushed', alphanumVal);
				alphaonlyVal ="";
			}
		} else {
			alphaonlyVal = alphaonlyVal + c;
			//console_logs('concated to', alphanumVal);
		}
		
		
	}
	if(alphanumVal.length > 1) {
		specs.push(alphanumVal);
		//console_logs('pushed', alphanumVal);
	}
	if(alphaonlyVal.length > 1) {
		specs.push(alphaonlyVal);
		//console_logs('pushed', alphanumVal);
	}
	
	console_logs('specs', specs);
	specs=eliminateDuplicates(specs);
	console_logs('specs', specs);
	
	console_logs('pre', specs);
	//길이로 소트
	specs.sort(function(a, b){
	  return b.length - a.length; // ASC -> a - b; DESC -> b - a
	});
	console_logs('after', specs);
	
	
	for(var i=0; i<10; i++) {
		Ext.getCmp(getSearchField('spec' + (i+1))).setValue('');
	}
	
	for(var i=0; i<specs.length && i<10; i++) {
		Ext.getCmp(getSearchField('spec' + (i+1))).setValue(specs[i]);	
	}
	
	mySearch();
}


function unselectForm() {

}

function readOnlyPartForm(b) {

	
	
}



function Item_code_dash(item_code){
		return item_code.substring(0,5) + "-" + item_code.substring(5, 9) + "-" +
				item_code.substring(9, 12);
}

var materialClassStore = new Ext.create('Ext.data.Store', {

	fields:[     
	        { name: 'class_code', type: "string"  }
	        ,{ name: 'class_name', type: "string" }
	        ,{ name: 'level', type: "string"  } 
    ],
	sorters: [{
        property: 'display_order',
        direction: 'ASC'
    }],
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
    		level: '2',
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
	            read: CONTEXT_PATH + '/design/bom.do?method=cloudread&statusList=RM:DE&stock_qty_useful_is_zero=true', //&with_parent=T', 
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


Ext.define('ExcelWithProject', {
	 extend: 'Ext.data.Model',
	 fields:  [ { name: 'file_itemcode', 	type: "string"    }     ],
	    proxy: {
			type: 'ajax',
	        api: {
	        	create: CONTEXT_PATH + '/design/upload.do?method=excelBomWithProject' /*
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




var prWin = null;
var unique_uids = null
var new_pr_quans = null;



searchField = [];

Ext.onReady(function() {  
	
	
	arrSearchObj.push('maker_name');
	arrSearchObj.push('spec_cond');
	for(var i =0; i<10; i++) {
		arrSearchObj.push('spec' + (i+1));
	}
	
	
	LoadJs('/js/util/projectpaneltree.js');
	
	

	
	var pjTreeGrid =
    	Ext.create('Ext.tree.Panel', {
		    layout:'border',
		    title: getMenuTitle(),
		    border: true,
		    region: 'west',
            width: '20%',
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

				    itemclick: function(view, record, item, index, e, eOpts) {  
				    	
				    	//SelectedPartReset
				    	resetSelectPart();
				    	
				    	
				    	selectedAssyRecord = record;

				    	var name = record.data.text;
				    	var id = record.data.id;
				    	var depth = record.data.depth;
			    	
				    	var context = record.data.context;
				    	assy_code = gfn_trim(name.substring(0,5) );

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
			            	store.load(function(records){

			            		routeTitlename = '[' + selectedAssyCode  + '] ' + selectedAssyName;
			            		Ext.getCmp('gridBom').setTitle(routeTitlename); 
			            	});
			            	
			            	
			           
				    	}
				    		
				    }// end itemclick
		    	}// end listeners
			},
	        // border: 0,
            dockedItems: [     
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
							           emptyText:'프로젝트',
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
		    		groupField: 'standard_flag',
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
		    	
		    	store.load(function(records) {
		    		
		    		
		    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		    		
/*********************************************************************************
 * Grid Start
 */
		    		 var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
		    		        groupHeaderTpl: '{name} ({rows.length} 종{[values.rows.length > 1 ? "" : ""]})'
		    		    });
		    		 
			    	var myGridColumn = [];
			    	
			    	for(var i=0; i<vCENTER_COLUMNS.length; i++) {
			    		
			    		switch(vCENTER_COLUMNS[i]['dataIndex']) {
			    			//case 'new_pr_quan':
			    			case 'parent_item_code':
			    			case 'reserved_double1': //mycart의 pr_quan이다					
			    				break;
			    			default:
			    				myGridColumn.push(vCENTER_COLUMNS[i]);
			    		}


			    	}
			    	
				    grid = Ext.create('Ext.grid.Panel', {
			    		id: "gridBom",
			    		title: '대상 BOM',
				        store: store,
					    border: true,
					    region: 'center',
			            width: '40%',
				        collapsible: true,
				        multiSelect: true,
				        selModel: selModel,
				        stateId: 'stateGridBom'+ /* (G) */vCUR_MENU_CODE,
				        height: getCenterPanelHeight(),
		    		    features: [groupingFeature],
				        columns: /* (G) */myGridColumn,
				        viewConfig: {
				            stripeRows: true,
				            enableTextSelection: true,
				            getRowClass: function(record, index) {
				                
				            },
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

		            	}else{

		            	}
		            } else {
		            	resetSelectPart();
		            	collapseProperty();
		            }
		        }
		    });
		    
			
		    (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
			    params: {
			    	menuCode: 'DBM10_SUB'
			    },
			    callback: function(records, operation, success) {
			    	var fieldPms1 = [];
			    	var columnPms1 = [];
			    	var tooltipPms1 = [];
			    	if(success ==true) {
			    		for (var i=0; i<records.length; i++){
			    			inRec2Col(records[i], fieldPms1, columnPms1, tooltipPms1);
				        }//endoffor
		    		 	
						Ext.define('SrcAhd', {
						   	 extend: 'Ext.data.Model',
						   	 fields: /*(G)*/fieldPms1,
						   	    proxy: {
										type: 'ajax',
								        api: {
								            read: CONTEXT_PATH + '/inventory/prchStock.do?method=read'
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
						
					    stockStore = new Ext.data.Store({  
							pageSize: getPageSize(),
							model: 'SrcAhd',
							sorters: [{
					            property: 'unique_id',
					            direction: 'DESC'
					        }]
						});
					    
			    		var selModelReplacer = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

					    gridReplacer = Ext.create('Ext.grid.Panel', {
				    		id: "gridReplacer",
				    		title: '재고현황',
						    border: true,
						    region: 'east',
				            width: '40%',
				            store: stockStore,
					        multiSelect: false,
					        selModel: selModelReplacer,
					        stateId: 'gridReplacer'+ /* (G) */vCUR_MENU_CODE,
					        height: getCenterPanelHeight(),
					        columns: /* (G) */columnPms1,
					        viewConfig: {
					            stripeRows: true,
					            enableTextSelection: true,
					            markDirty:false,
					            getRowClass: function(record, index) {
				                
					            }
					        },
				            dockedItems: [{
					        	dock : 'top',
					        	xtype: 'toolbar',
					        	items:[searchAction,'-', 
					        	       replaceAction, '-',
					        	       {
						   				    xtype: 'textfield',
						   				    flex : 1,
						   				    emptyText: '규격', //getTextName(/*(G)*/vCENTER_FIELDS, index),
						   				    id: getSearchField('specification'),
						   				    readOnly: true,
											fieldStyle: 'background-color: #E7EEF6; background-image: none;',
						   			    	listeners : {
						   			        		specialkey : function(fieldObj, e) {
						   			        		if (e.getKey() == Ext.EventObject.ENTER) {
						   			        			mySearch();
						   			        		}
						   			        	}
						   			    	}/*,
					   				    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
					   				    'onTrigger1Click': function() {
					   				    	Ext.getCmp(getSearchField('specification')).setValue('');
					   					}*/
					        	       },
					        	       {
						   				    xtype: 'triggerfield',
						   				    width : 110,
						   				    emptyText: '제조원', //getTextName(/*(G)*/vCENTER_FIELDS, index),
						   				    id: getSearchField('maker_name'),
						   			    	listeners : {
						   			        		specialkey : function(fieldObj, e) {
						   			        		if (e.getKey() == Ext.EventObject.ENTER) {
						   			        			mySearch();
						   			        		}
						   			        	}
						   			    	},
						   				    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
						   				    'onTrigger1Click': function() {
						   				    	Ext.getCmp(getSearchField('maker_name')).setValue('');
						   					}
						        	    },{
				      						fieldLabel: '',
											id:getSearchField('spec_cond'),
									    	xtype: 'combo',
									    	fieldStyle: 'background-image: none;background:#FBF8E6;',
								           editable:true,
								           typeAhead: false,
								           allowBlank: false,
								           width: 50,
								           value:'AND',
								           store:['AND','OR' ]
			    		                    ,listeners: {
			    		 	                    select: function (combo, record) {
											           mySearch();		    		 	                    	
			    		 	                    }
			    		                    }
								           

										}
					   				]
					   			},
				            {
					        	dock : 'top',
					        	xtype: 'toolbar',
					        	items:[
					        	       {
										    xtype: 'triggerfield',
										    flex : 1,
										    emptyText: '규격1', //getTextName(/*(G)*/vCENTER_FIELDS, index),
										    id: getSearchField('spec1'),
									    	listeners : {
									        		specialkey : function(fieldObj, e) {
									        		if (e.getKey() == Ext.EventObject.ENTER) {
									        			mySearch();
									        		}
									        	}
									    	},
										    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
										    'onTrigger1Click': function() {
										    	Ext.getCmp(getSearchField('spec1')).setValue('');
										    	mySearch();
											}
										
							        	},
						        	       {
										    xtype: 'triggerfield',
										    flex : 1,
										    emptyText: '규격2', //getTextName(/*(G)*/vCENTER_FIELDS, index),
										    id: getSearchField('spec2'),
									    	listeners : {
									        		specialkey : function(fieldObj, e) {
									        		if (e.getKey() == Ext.EventObject.ENTER) {
									        			mySearch();
									        		}
									        	}
									    	},
										    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
										    'onTrigger1Click': function() {
										    	Ext.getCmp(getSearchField('spec2')).setValue('');
										    	mySearch();
											}
										
							        	},
						        	       {
										    xtype: 'triggerfield',
										    flex : 1,
										    emptyText: '규격3', //getTextName(/*(G)*/vCENTER_FIELDS, index),
										    id: getSearchField('spec3'),
									    	listeners : {
									        		specialkey : function(fieldObj, e) {
									        		if (e.getKey() == Ext.EventObject.ENTER) {
									        			mySearch();
									        		}
									        	}
									    	},
										    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
										    'onTrigger1Click': function() {
										    	Ext.getCmp(getSearchField('spec3')).setValue('');
										    	mySearch();
											}
										
							        	},
						        	       {
										    xtype: 'triggerfield',
										    flex : 1,
										    emptyText: '규격4', //getTextName(/*(G)*/vCENTER_FIELDS, index),
										    id: getSearchField('spec4'),
									    	listeners : {
									        		specialkey : function(fieldObj, e) {
									        		if (e.getKey() == Ext.EventObject.ENTER) {
									        			mySearch();
									        		}
									        	}
									    	},
										    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
										    'onTrigger1Click': function() {
										    	Ext.getCmp(getSearchField('spec4')).setValue('');
										    	mySearch();
											}
										
							        	},
						        	       {
										    xtype: 'triggerfield',
										    flex : 1,
										    emptyText: '규격5', //getTextName(/*(G)*/vCENTER_FIELDS, index),
										    id: getSearchField('spec5'),
									    	listeners : {
									        		specialkey : function(fieldObj, e) {
									        		if (e.getKey() == Ext.EventObject.ENTER) {
									        			mySearch();
									        		}
									        	}
									    	},
										    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
										    'onTrigger1Click': function() {
										    	Ext.getCmp(getSearchField('spec5')).setValue('');
										    	mySearch();
											}
										
							        	}
					        	
					        	]
				            },
				            {
					        	dock : 'top',
					        	xtype: 'toolbar',
					        	items:[
					        	       {
										    xtype: 'triggerfield',
										    flex : 1,
										    emptyText: '규격6', //getTextName(/*(G)*/vCENTER_FIELDS, index),
										    id: getSearchField('spec6'),
									    	listeners : {
									        		specialkey : function(fieldObj, e) {
									        		if (e.getKey() == Ext.EventObject.ENTER) {
									        			mySearch();
									        		}
									        	}
									    	},
										    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
										    'onTrigger1Click': function() {
										    	Ext.getCmp(getSearchField('spec6')).setValue('');
										    	mySearch();
											}
										
							        	},
						        	       {
										    xtype: 'triggerfield',
										    flex : 1,
										    emptyText: '규격7', //getTextName(/*(G)*/vCENTER_FIELDS, index),
										    id: getSearchField('spec7'),
									    	listeners : {
									        		specialkey : function(fieldObj, e) {
									        		if (e.getKey() == Ext.EventObject.ENTER) {
									        			mySearch();
									        		}
									        	}
									    	},
										    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
										    'onTrigger1Click': function() {
										    	Ext.getCmp(getSearchField('spec7')).setValue('');
										    	mySearch();
											}
										
							        	},
						        	       {
										    xtype: 'triggerfield',
										    flex : 1,
										    emptyText: '규격8', //getTextName(/*(G)*/vCENTER_FIELDS, index),
										    id: getSearchField('spec8'),
									    	listeners : {
									        		specialkey : function(fieldObj, e) {
									        		if (e.getKey() == Ext.EventObject.ENTER) {
									        			mySearch();
									        		}
									        	}
									    	},
										    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
										    'onTrigger1Click': function() {
										    	Ext.getCmp(getSearchField('spec8')).setValue('');
										    	mySearch();
											}
										
							        	},
						        	       {
										    xtype: 'triggerfield',
										    flex : 1,
										    emptyText: '규격9', //getTextName(/*(G)*/vCENTER_FIELDS, index),
										    id: getSearchField('spec9'),
									    	listeners : {
									        		specialkey : function(fieldObj, e) {
									        		if (e.getKey() == Ext.EventObject.ENTER) {
									        			mySearch();
									        		}
									        	}
									    	},
										    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
										    'onTrigger1Click': function() {
										    	Ext.getCmp(getSearchField('spec9')).setValue('');
										    	mySearch();
											}
										
							        	},
						        	       {
										    xtype: 'triggerfield',
										    flex : 1,
										    emptyText: '규격10', //getTextName(/*(G)*/vCENTER_FIELDS, index),
										    id: getSearchField('spec10'),
									    	listeners : {
									        		specialkey : function(fieldObj, e) {
									        		if (e.getKey() == Ext.EventObject.ENTER) {
									        			mySearch();
									        		}
									        	}
									    	},
										    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
										    'onTrigger1Click': function() {
										    	Ext.getCmp(getSearchField('spec10')).setValue('');
										    	mySearch();
											}
										
							        	}
					        	
					        	]
				            }
				            
				            ]
			            
				    });
					    gridReplacer.getSelectionModel().on({
			    			selectionchange: function(sm, selections) {
					            if (selections.length) {
									if(fPERM_DISABLING()==true) {
										replaceAction.disable();
									}else{
										replaceAction.enable();
									}
					            } else {
					            	if(fPERM_DISABLING()==true) {
					            		replaceAction.disable();
					            	}else{
					            		replaceAction.disable();
					            	}
					            }
					        }
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
						    items: [  pjTreeGrid, grid, gridReplacer ]
						});
						
					
						grid.setLoading(true);
						
						fLAYOUT_CONTENT(main);
						
//						//데이타타입 추가
//						vCENTER_FIELDS.push({ name: 'isUpdateSpec', type: 'string'});
						
						cenerFinishCallback();// Load Ok Finish Callback
						
			    	}//endof if(success..
			    },//callback
			    scope: this
			});			    

			
		Ext.Ajax.request({
		url: CONTEXT_PATH + '/admin/menu.do?method=defaultGet',			
		params:{
			paramName : 'CommonProjectAssy'
		},
		success : function(result, request) {
			console_log('success defaultGet');
			var id = result.responseText;
			
			console_log('id:'+id);
			var arr = id.split(';');
			var ac_uid = arr[0];

			cloudprojectStore.load(function(records) { 
				
				var rec = null;
				for(var i=0; i<records.length; i++) {
					var id = records[i].get('id');
					console_log('ac_uid=' + ac_uid);
					console_log('id=' + id);
					if(Number(ac_uid) == Number(id)) {
						rec = records[i];
					}
				}
				
	     		if(rec!=null) {
		     		var pj_code = rec.get('pj_code');
					var pj_name = rec.get('pj_name');
		     		var projectcombo = Ext.getCmp('projectcombo');
		     		projectcombo.setValue('[' + pj_code + '] ' + pj_name);
					var record = [];
					record[0] = rec;
		     		projectcombo.fireEvent('select', projectcombo, record);
					projectcombo['forceSelection'] = true;
					console_log('-------------------------------------------srchTreeHandler');
					
					
					cloudProjectTreeStore.getProxy().setExtraParam('pjuid', ac_uid);
					
					
					cloudProjectTreeStore.load({
					    callback: function(records, operation, success) {
				
					    	grid.setLoading(false);

					    }                               
					});
					
	     		}
			});
    		
		},
		failure: function(result, request){
			console_log('fail defaultGet');
		} /*extjsUtil.failureMessage*/
	});
		
		
 	});
});	// OnReady

