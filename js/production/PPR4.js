
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
var upno = true;
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
var commonUnitStore = null;
var commonCurrencyStore = null;
var commonModelStore = null;
var commonStandardStore =null;

var prWin = null;
var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {} );

var purchase_requestAction = Ext.create('Ext.Action', {
	
	itemId: 'purchaseButton',
	iconCls:'my_purchase',
    text: SENDOUT_REQUEST,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {
    	var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
    	var pl_no = '';
    	var specification = '';
    	var process = '';
    	var unique_uid = new Array();
    	
        for (var j = 0; j < store.data.items.length; j++)
        {
              var record = store.data.items [j];
              if (record.dirty) {
		    	  for(var i = 0 ; i<20; i++) {
		    			var str = '' + (i+1);
		    			if(str.length<2) {
		    				str = '0' + str;
		    			}
		    			var checked = record.get('checked' + str);
		    			var ast_uid = record.get('ast_uid' + str);
		    			var inout_type = record.get('inout_type' + str);
		    			if(checked==true && inout_type.length==0) {
		    				unique_uid.push(ast_uid);	
		    			}
		    			
		    			if(i==0) {
		    				pl_no = record.get('pl_no');
		    				process = record.get('process' + str);
		    				specification = record.get('specification');
		    			}
		    			
		    	 }
              }
        }
    	
        if(unique_uid.length==0) {
        	Ext.MessageBox.alert(ppr4_warning, ppr4_warning_msg);
        	return;
        }
    	
        
        var title = '[OUT]' + pl_no + ' - ' + process;
        var content = specification;
        
    	var lineGap = 30;
    	var rtgapp_store = new Ext.data.Store({  
    		pageSize: getPageSize(),
    		model: 'RtgApp'    	});
    	
    	
    	
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
    	            icon: Ext.MessageBox.QUESTION
    	        });
    	    }
    	});
    	
    	var updown =
    	{
    	    menuDisabled: true,
    	    sortable: false,
    	    xtype: 'actioncolumn',
    	    width: 60,
    	    items: [{
    	        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_up.png',  // Use a URL in the icon config
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
    	        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_down.png',   // Use a URL in the icon config
    	        tooltip: 'Down',
    	        handler: function(agrid, rowIndex, colIndex) {

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
    	rtgapp_store.load(function() {
    		Ext.each( /*(G)*/tempColumn, function (columnObj, index,value) {
                var dataIndex = columnObj["dataIndex" ];
               columnObj[ "flex" ] =1;
                if (value!="W" && value!='기안') {
                       if ('gubun' == dataIndex) {
                             
                              var combo = null ;
                              // the renderer. You should define it  within a namespace
                              var comboBoxRenderer = function (value, p, record) {
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
                         valueField:     'systemCode' ,
                         store: routeGubunTypeStore,
                           listClass: 'x-combo-list-small' ,
                              listeners: {  }
                       });
                       columnObj[ "editor" ] = combo;
                       columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
				        	p.tdAttr = 'style="background-color: #FFE4E4;"';
				        	return value;
			        	};
                      }
                      
               }

         });

    		
    		//grid create
    		agrid = Ext.create('Ext.grid.Panel', {
    			title: routing_path,
    		    store: rtgapp_store,
    		    layout: 'fit',
    		    columns : tempColumn,
    		    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
    		    	clicksToEdit: 1
    		    })],
    		    border: false,
    		    multiSelect: true,
    		    frame: false,
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
                         				useruid : unique_id
                         				,userid : user_id
                         				,gubun    : 'D'
                         			},
                         			success : function(result, request) {   
                         				var result = result.responseText;
                						console_log('result:' + result);
                						if(result == 'false'){
                							Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                						}else{
                							rtgapp_store.load(function() {});
                						}
                         			},
                         			failure: extjsUtil.failureMessage
                         		});
    			        	}//endofselect
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
	                                   	
	                                   	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
	                                   	obj['gubun'] = record.get('gubun');
	                                   	obj['owner'] = record.get('owner');
	                                   	obj['change_type'] = record.get('change_type');
	                                   	obj['app_type'] = record.get('app_type');
	                                   	obj['usrast_unique_id'] = record.get('usrast_unique_id');
	                                   	obj['seq'] = record.get('seq');
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
			        ]//endofitems
    			}] //endofdockeditems
    		}); //endof Ext.create('Ext.grid.Panel', 
    		
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
		            		collapseProperty();//uncheck no displayProperty
		            		removeRtgapp.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
		            		removeRtgapp.disable();
		            	}
		            }
		        }
    		});
    		
    		//form create
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
    		        	id: 'unique_uid',
    		        	name: 'unique_uid',
    		        	value: unique_uid
    		        }),
    		        new Ext.form.Hidden({
    		        	id: 'req_date',
    		        	name: 'req_date'
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
    	                	fieldLabel: dbm1_txt_name,
    	                	id: 'txt_name',
    	                	name: 'txt_name',
    	                	value: title,
    	                	anchor: '100%'
    	                },{
    	                	xtype: 'textarea',
    	                	fieldLabel: dbm1_txt_content,
    	                	id: 'txt_content',
    	                	name: 'txt_content',
    	                	value:  content,
    	                	anchor: '100%'  
    	                },{
    	                	xtype: 'textarea',
    	                	fieldLabel: dbm1_req_info,
    	                	id: 'req_info',
    	                	name: 'req_info',
    	                	anchor: '100%'  
    	                },{
    	                	xtype: 'datefield',
    	                	id: 'request_date',
    	                	name: 'request_date',
    		            	fieldLabel: dbm1_request_date,
    		            	format: 'Y-m-d',
    				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		            	value: Ext.Date.add (new Date(),Ext.Date.DAY,14),
    	            		anchor: '100%'
    		            }
    	                ]
        	});//endof createform
        	//window create
        	prWin = Ext.create('ModalWindow', {
        		title: CMD_ADD + ' :: ' + /*(G)*/vCUR_MENU_NAME,
                width: 850,
                height: 500,
                plain:true,
                items: [ form ],
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
                        		ahid_userlist_role[i] = rec.get('gubun');
                        	}
                        	Ext.getCmp('hid_userlist').setValue(ahid_userlist);                    	
                			Ext.getCmp('hid_userlist_role').setValue(ahid_userlist_role);
                			console_log('hid_userlist_role' + ahid_userlist);
                			console_log('hid_userlist_role'+ ahid_userlist_role);
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
    	                           		store.load(function() {});
    	                           	} 
    	                		} 
    	                	 });
//                		}
                		}else {
                			Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                		}
                	}
                },{
                	text: CMD_CANCEL,
                	handler: function(){
                		if(prWin) {
                			prWin.close();
                		} }            	
                }]
        	});
        	prWin.show();
    	});//enof load
    }//endof handlwe
});//endof define action

function printSelected(modified) {
	console_log('count is : ' + modified.length);
	for(var i=0; i<modified.length; i++) {
		var o = modified[i];
		console_log(o);

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
			return inout_type;
		}
	}
	return (new Ext.ux.CheckColumn()).renderer(val);	
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

function Item_code_dash(item_code){
		return item_code.substring(0,5) + "-" + item_code.substring(5, 9) + "-" +
				item_code.substring(9, 12);
}


//*****************************MODEL**************************/

for(var i=0; i<20; i ++) {
	
	var str = '' + (i+1);
	if(str.length<2) {
		str = '0' + str;
	}
	
	vCENTER_FIELDS.push({ name: 'checked' + str, type: 'boolean'});
	vCENTER_FIELDS.push({ name: 'process' + str, type: 'string'});
	vCENTER_FIELDS.push({ name: 'inout_type' + str, type: 'string'});
	vCENTER_FIELDS.push({ name: 'ast_uid' + str, type: 'string'});
}

Ext.define('CartLineProcess', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS,
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/production/out.do?method=read', 					/*1recoed, search by cond, search */
	            create: CONTEXT_PATH + '/production/out.do?method=create', 			/*create record, update*/
	            update: CONTEXT_PATH + '/production/out.do?method=create'
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
	            create: CONTEXT_PATH + '/production/out.do?method=create'
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
	        	 }, 'CartLineProcess');
        		
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
           		 }//endofsuccess
           	});//endofsave
        }//endofif yes
    }//endofselection
};

searchField = [];

Ext.onReady(function() {  
	LoadJs('/js/util/comboboxtree.js');
	Ext.define('RtgApp', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS_SUB,
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
	
	console_log('now starting...');
	   
		    //************************ BOM *********
		     
		    	//PartLine Store 정의
		    	store = new Ext.data.Store({  
		    		pageSize: getPageSize(),
		    		model: 'CartLineProcess',
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
		    		

		    		
		    		for(var i=0; i<len; i ++) {
		    			
		    			var str = '' + (i+1);
		    			if(str.length<2) {
		    				str = '0' + str;
		    			}
		    			
			    		var chkColH = new Ext.ux.CheckColumn({
			    		    header: header_check,
			    		    dataIndex: 'checked' + str,
			    		    resizable:false,
			    		    width: 40,
			    		    align: 'center',
			    		    renderer: function(val, m, rec, rowNum, colNum) {
			    		    	return checkVal(rec, colNum, val, rowNum);
				    		}
			    		});
		    			
		    			vCENTER_COLUMNS.push(
		    					{ header: str,
		    						columns: [
										chkColH,
										{ header: header_pcs, dataIndex: 'process' + str, width : 80,  sortable : false}
		    						]
		    					});
		    		}

		    grid = Ext.create('Ext.grid.Panel', {
		    		id: 'gridBom',
			        title: '',
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGridBom'+ /*(G)*/vCUR_MENU_CODE,
	                region: 'center',
	                width:'60%',
			        height: getCenterPanelHeight(),
			        
			        bbar: getPageToolbar(store),	        
			        
			        dockedItems: [
	    		      				{
	    		      					dock: 'top',
	    		      				    xtype: 'toolbar',
	    		      				    items: [
	    		      				           purchase_requestAction, '-', 
	    		      				         '->'
	    		      				         ]
	    		      				},
	    		      				{
	    		      					xtype: 'toolbar',
	    		      					items: getProjectTreeToolbar()
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
			            	'afterrender' : function(grid) {
								var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
								elments.each(function(el) {
											}, this);
									
								},
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
		            	if(fPERM_DISABLING()==true) {
		            	}else{
		            	}
		            } else {
		            	if(fPERM_DISABLING()==true) {
			            	collapseProperty();
		            	}else{
		            		collapseProperty();
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
				
				    items: [  grid
		           ]

				});
			fLAYOUT_CONTENT(main);
 	});
		cenerFinishCallback();//Load Ok Finish Callback
});	//OnReady

