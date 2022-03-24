//global var.
var grid = null;
var store = null;
var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {} );
var ahid_userlist = new Array();
var ahid_userlist_role = new Array();
//검색필드정의: define search field
searchField = 
	[
	'unique_id',
	'item_code',
	'item_name',
	'specification',
	'uid_comast'
	];

MessageBox = function(){
    return {
        msg : function(format){
            return Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
        }
    };
}();

function resetParam() {
	store.getProxy().setExtraParam('unique_id', '');
	store.getProxy().setExtraParam('item_code', '');
	store.getProxy().setExtraParam('item_name', '');
	store.getProxy().setExtraParam('specification', '');
	store.getProxy().setExtraParam('unique_uid', '');
}

function srchSingleHandler (widName, parmName, isWild) {

	resetParam();
	var val = Ext.getCmp(widName).getValue();
	var enValue = Ext.JSON.encode(val);
	store.getProxy().setExtraParam("srch_type", 'single');
	if(isWild) {
		val = '%' + enValue + '%';
	}

	store.getProxy().setExtraParam(parmName, val);
	store.load(function() {});
};

var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');

        			SrcAhd.load(unique_id ,{
        				 success: function(srcahd) {
        					 	var unique_id = srcahd.get('unique_id');
//        					 	var unique_id_long = srcahd.get('unique_id_long');
        						var item_code = srcahd.get('item_code');
        						var item_name = srcahd.get('item_name');
        						var specification = srcahd.get('specification'  );
        						var description = srcahd.get('description' );
        						var stock_qty = srcahd.get('stock_qty' );
        						var sales_price = srcahd.get('sales_price');
        						var lead_time = srcahd.get('lead_time');
        						var create_date = srcahd.get('create_date');
        						
        						var lineGap = 30;
        				    	var form = Ext.create('Ext.form.Panel', {
        				    		id: 'formPanel',
        				            layout: 'absolute',
        				            url: 'save-form.php',
        				            defaultType: 'displayfield',
        				            border: false,
        				            bodyPadding: 15,
        				            defaults: {
        				                anchor: '100%',
        				                allowBlank: false,
        				                msgTarget: 'side',
        				                labelWidth: 100
        				            },
        				            items: [{
        				        fieldLabel: 'unique_id',
							    value: unique_id,
							    x: 5,
							    y: 0 + 1*lineGap,
							    name: 'unique_id',
							    anchor: '-5'  // anchor width by percentage
							},{
								fieldLabel: 'item_code',
								value: item_code,
								x: 5,
								y: 0 + 2*lineGap,
								name: 'item_code',
								anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'item_name.',
        				    	value: item_name,
        				    	x: 5,
        				    	y: 0 + 3*lineGap,
        				    	name: 'item_name',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'specification.',
        				    	value: specification,
        				    	x: 5,
        				    	y: 0 + 4*lineGap,
        				    	name: 'specification',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'description.',
        				    	value: description,
        				    	x: 5,
        				    	y: 0 + 5*lineGap,
        				    	name: 'description',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'stock_qty.',
        				    	value: stock_qty,
        				    	x: 5,
        				    	y: 0 + 6*lineGap,
        				    	name: 'stock_qty',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'sales_price.',
        				    	value: sales_price,
        				    	x: 5,
        				    	y: 0 + 7*lineGap,
        				    	name: 'sales_price',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'lead_time.',
        				    	value: lead_time,
        				    	x: 5,
        				    	y: 0 + 8*lineGap,
        				    	name: 'lead_time',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'create_date.',
        				    	value: create_date,
        				    	x: 5,
        				    	y: 0 + 9*lineGap,
        				    	name: 'create_date',
        				    	anchor: '-5'  // anchor width by percentage
        				    }
        				    ]
        				        }); //endof form

        				        var win = Ext.create('ModalWindow', {
        				            title: CMD_VIEW,
        				            width: 700,
        				            height: 400,
        				            minWidth: 250,
        				            minHeight: 180,
        				            layout: 'fit',
        				            plain:true,
        				            items: form,
        				            buttons: [{
        				                text: CMD_OK,
        				            	handler: function(){
        				                       	if(win) 
        				                       	{
        				                       		win.close();
        				                       	} 
        				                  }
        				            }]
        				        });
        				        win.show();
        						//endofwin
        				 }//endofsuccess
        			 });//emdofload
        	
        };

//writer define
Ext.define('SrcAhd.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	data[0].cmdType = 'update';
        request.params = data[0];
        return request;
    }
});



function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_uid');
	           	var srcahd = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'SrcAhd');
        		
	           	srcahd.destroy( {
	           		 success: function() {}
	           	});
           	
        	}
        	grid.store.remove(selections);
        }

    }
};

//Define Remove Action
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
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

//Define Detail Action
var detailAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: viewHandler
});

//function process_requestConfirm(btn){
//
//    var selections = grid.getSelectionModel().getSelection();
//    if (selections) {
//        var result = MessageBox.msg('{0}', btn);
//        if(result=='yes') {
//    		var unique_ids = [];
//    		for(var i=0; i< selections.length; i++) {
//    			var rec = selections[i];
//    			var unique_uid = rec.get('unique_uid');
//				unique_ids.push(unique_uid);
//    		}//enoffor
//    		console_log('unique_ids : ');
//    		console_log(unique_ids);	
//    		Ext.Ajax.request({
//        		url: CONTEXT_PATH + '/production/pcsrequest.do?method=createPR&menu_code='+vCUR_MENU_CODE,
//        		params:{
//        			unique_uid : unique_ids,
//        			parent :selectedAssyUid,
//        			division : 'process',
//        			pjUid : selectedMoldUid
//        		},
//        		success : function(result, request) {
//        			var result = result.responseText;
//					console_log('result:' + result);
//					if(result != ''){
//						Ext.MessageBox.alert('Check',result);
//						store.load(function() {});
//					}else{
//						Ext.MessageBox.alert('Check','Did not request anything!');
//					}
//        		},
//        		failure: extjsUtil.failureMessage
//        	});	
//        }//endofif yes
//    }//endofselection
//};

var prWin = null;
var unique_uid = new Array();

function item_code_dash(item_code){
	if(item_code==null || item_code.length<13) {
		return item_code;
	}else {
		return item_code.substring(0,12);
	}
}
//구매요청
var purchase_requestAction = Ext.create('Ext.Action', {
	itemId: 'purchaseButton',
	iconCls:'my_purchase',
    text: PURCHASE_REQUEST,
    disabled: true,
    handler: function(widget, event) {
    	
    	var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
    	var selections = grid.getSelectionModel().getSelection();
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		unique_uid[i] = rec.get('unique_uid');//cartmap_uid
    	}
    	var item_name = rec.get('item_name');
    	var item_code = rec.get('item_code');
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
    	            //animateTarget: 'mb4',
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
//	         				modifyIno: str,
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
//	         				modifyIno: str,
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
		                         store: routeGubunTypeStore,
		                         listClass: 'x-combo-list-small'
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
    		    frame: false ,
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
                    }]//endofitems
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
//    	        layout: 'absolute',
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
    	                	value: '[PR]' + item_code_dash(item_code),
    	                	anchor: '100%'
    	                },{
    	                	xtype: 'textarea',
    	                	fieldLabel: dbm1_txt_content,
    	                	id: 'txt_content',
    	                	name: 'txt_content',
    	                	value:  item_name+' 外',
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
    		            	fieldLabel: toolbar_pj_req_date,
    		            	format: 'Y-m-d',
    				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
    		            	value: Ext.Date.add (new Date(),Ext.Date.DAY,14),
    	            		anchor: '100%'
    		            }
    	                ]
        	});//endof createform

        	prWin = Ext.create('ModalWindow', {
        		title: CMD_ADD + ' :: ' + /*(G)*/vCUR_MENU_NAME,
                width: 850,
                height: 500,
                plain:true,
                items: [form],
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
    	                           		store.load(function() {});
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
    	});//enof load
    }
});

//var process_requestAction = Ext.create('Ext.Action', {
//	itemId: 'process_requestButton',
//    iconCls: 'production',
//    text: PROCESS_REQUEST,
//    disabled: true,
//    handler: function(widget, event) {
//    	Ext.MessageBox.show({
//            title:delete_msg_title,
//            msg: epc1_request_msg,
//            buttons: Ext.MessageBox.YESNO,
//            fn: process_requestConfirm,
//            icon: Ext.MessageBox.QUESTION
//        });
//    }
//});

//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ removeAction]
});




Ext.onReady(function() {  
	
	Ext.define('RtgAst', {
		 extend: 'Ext.data.Model',
		 fields: /*(G)*/vCENTER_FIELDS,
		    proxy: {
				type: 'ajax',
		        api: {
		            create: CONTEXT_PATH + '/design/bom.do?method=createPurchasing&menu_code='+vCUR_MENU_CODE
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
	
	
	
	Ext.define('SrcAhd', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/purchase/material.do?method=readMypart', /*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/purchase/material.do?method=createMypart', /*create record, update*/
		            destroy: CONTEXT_PATH + '/purchase/material.do?method=destroyMypart' /*delete*/
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
	
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'SrcAhd',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
 	store.load(function() {

 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModel,
			        height: getCenterPanelHeight(), 
			     // paging bar on the bottom
			        
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                   purchase_requestAction, '-', 
//			                   process_requestAction, '-', 
			                   removeAction
	      				       ]
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
			fLAYOUT_CONTENT(grid);
			
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		            if (selections.length) {
						//grid info 켜기
						displayProperty(selections[0]);
						if(fPERM_DISABLING()==true) {
			            	removeAction.disable();
			            	detailAction.disable();
			            	purchase_requestAction.disable();
//			            	process_requestAction.disable();
						}else{
							removeAction.enable();
			            	detailAction.enable();
			            	purchase_requestAction.enable();
//			            	process_requestAction.enable();
						}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	detailAction.disable();
			            	purchase_requestAction.disable();
//			            	process_requestAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	detailAction.disable();
			            	purchase_requestAction.disable();
//			            	process_requestAction.disable();
		            	}
		            }
		        }
		    });

		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
	}); //store load
 	cenerFinishCallback();//Load Ok Finish Callback
 	 	
});	//OnReady
     
