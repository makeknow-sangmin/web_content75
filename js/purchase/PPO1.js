var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});
//global var.
var togIsNew = true;
var grid = null;
var store = null;
var agrid = null;

var ahid_userlist = new Array();
var ahid_userlist_role = new Array();
var unique_uid = new Array();
var selectedAssyUid = '';

var selectionLength = 0;

var isCTStatus = true;
var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {} );
function checkAction(status) {
	var supplier_information = Ext.getCmp('supplier_information').getValue();
	
	if( (selectionLength>0) && supplier_information !='' && supplier_information !=null) {
		addAction.enable();
	} else{
		addAction.disable();
	}
	if(status == 'CT'){
		addAction.enable();
	}
}

function deleteConfirm(btn){

	var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
	           	var cartline = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'CartLine');
        		
	           	cartline.destroy( {
	           		 success: function() {
	           			Ext.MessageBox.alert('OK',ppo1_delete_msg);
	           			store.load(function() {});
	           		 }
	           	});
        	}
        	grid.store.remove(selections);
        }
    }
};

function routingConfirm(selections){
	var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
//	var selections = grid.getSelectionModel().getSelection();
	var sales_amount = 0;
	for(var i=0; i< selections.length; i++) {
		var sales_prices = selections[i].get('sales_amount_str');
		unique_uid[i] = selections[i].get('unique_uid');
		sales_amount += sales_prices;
	}
	var grid_supplier_uid = selections[0].get('coord_key1');
	var item_name  = selections[0].get('item_name');
	var item_code  = selections[0].get('item_code');
	console_log('grid_supplier_uid= ' +grid_supplier_uid);
	
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
	        	var unique_id = record.get('unique_id');
	        	console_log(unique_id);
	        	var direcition = -15;
	        	Ext.Ajax.request({
         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
         			params:{
         				direcition:direcition,
//         				modifyIno: str,
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
			        minChars: 1,
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
	            		//collapseProperty();//uncheck no displayProperty
	            		removeRtgapp.disable();
	            	}else{
	            		//collapseProperty();//uncheck no displayProperty
	            		removeRtgapp.disable();
	            	}
	            }
	        }
		}); //endof Ext.create('Ext.grid.Panel', 

		var DeliveryAddressStore  = Ext.create('Mplm.store.DeliveryAddressStore', {hasNull: false} );
		var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
    		xtype: 'form',
    		frame: false ,
    		border: false,
    		bodyPadding: '3 3 0',
    		region: 'center',
            fieldDefaults: {
                labelAlign: 'middle',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 100
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
		        	id: 'supplier_uid',
		        	name: 'supplier_uid'
		        }),
            	new Ext.form.Hidden({
            		id: 'supplier_name',
            		name: 'supplier_name'
            	}),
            	new Ext.form.Hidden({
            		id: 'sales_amount',
            		name: 'sales_amount'
            	}),
            	agrid,
            	{
                	xtype: 'component',
                	html: '<br/><hr/><br/>',
                	anchor: '100%'
            	},{
            		fieldLabel: ppo1_request_date,
            		value : new Date(),
                    endDateField: 'todate',
                	xtype: 'datefield',    
            		anchor: '100%',
            		id: 'request_date',
            		name: 'request_date'
                },
//                
//               {
//                	fieldLabel: ppo1_address,
//	            	xtype: 'textarea',
//	            	anchor: '100%',
//	            	value: 'JANUS COMPANY ADDESS',
//	            	id: 'delivery_address_1',
//	            	name: 'delivery_address_1'
//                },
 	        	{
	            	fieldLabel:ppo1_address,
					id :'DELIVERY_ADDRESS',
					name:           'DELIVERY_ADDRESS',
					xtype:          'combo',
					mode:           'local',
					triggerAction:  'all',
					forceSelection: true,
//					editable:       false,
//					allowBlank: false,
					anchor:'100%',
					emptyText:  prf1_warehouse_address,
					displayField:   'codeName',
					valueField:     'systemCode',
					fieldStyle: 'background-color: #FBF8E6; background-image: none;',
					queryMode: 'remote',
					store: DeliveryAddressStore,
					listConfig:{
						getInnerTpl: function(){
							return '<div data-qtip="{systemCode}">{codeName}</div>';
						}			                	
					},
					listeners: {
						select: function (combo, record) {
							var DELIVERY_ADDRESS = Ext.getCmp('DELIVERY_ADDRESS').getValue();
//							storeCartLine.getProxy().setExtraParam('DELIVERY_ADDRESS', DELIVERY_ADDRESS);
//							storeCartLine.load({});
						}//endofselect
					}
				},
                {
		            	fieldLabel: ppo1_request,
		             	xtype: 'textarea',
		            	hideLabel: false,
		            	anchor: '100%',
		            	id: 'cood_del_info',
		            	name: 'cood_del_info'
	            },{
	            		fieldLabel: dbm1_txt_name,
		            	xtype: 'textfield',
		            	anchor: '100%',
		            	value: '[PO]'+item_code,
		            	id: 'txt_name',
		            	name: 'txt_name'
	            },{
	            		fieldLabel: dbm1_txt_content,
	            		xtype: 'textarea',
	            		hideLabel: false,
	            		value: item_name+' 外',
	            		anchor: '100%',
	            		id: 'txt_content',
	            		name: 'txt_content'
                }]//item end..
		});//Panel end...
 	

		prWin = Ext.create('ModalWindow', {
        title:CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
        width: 830,
        height: 530,//480,
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
                var form = Ext.getCmp('formPanel').getForm();
                agrid.getSelectionModel().selectAll();
                var aselections = agrid.getSelectionModel().getSelection();
                var supplier_uid = Ext.getCmp('sp_srchSupplier_uid').getValue();
                console_log(supplier_uid);
                if(supplier_uid<1){
                	supplier_uid = grid_supplier_uid;
                }
                Ext.getCmp('supplier_uid').setValue(supplier_uid);
                Ext.getCmp('sales_amount').setValue(sales_amount);
                if (aselections) {
                	for(var i=0; i< aselections.length; i++) {
                		var rec = agrid.getSelectionModel().getSelection()[i];
                		
                		ahid_userlist[i] = rec.get('usrast_unique_id');
                		ahid_userlist_role[i] = rec.get('gubun');
                		
                	}
                	Ext.getCmp('hid_userlist').setValue(ahid_userlist);                    	
                	Ext.getCmp('hid_userlist_role').setValue(ahid_userlist_role);
                }//end if 
                
                if(form.isValid())
                {
                	var val = form.getValues(false);
                	var cartLine = Ext.ModelManager.create(val, 'CartLine');
						cartLine.save({
	                		success : function() {
	                			//console_log('updated');
	                           	if(prWin) 
	                           	{
	                           		prWin.close();
	                           		store.load(function() {});
	                           	} 
	                		} 
	                	 });
                }
                else {
                	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
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
	});
}

function checkQtyAndPrice(record){
	var status = record.get('status');
	if(status == 'CT'){
		return false;
	}
	return true;
}


var prWin = null;
//var allocAction = Ext.create('Ext.Action', {
//	itemId: 'allocButton',	
//	iconCls:'database_link',
//    text: GET_MULTILANG('ppo1_ALLOCSTOCK'),
//    disabled: true,
//    handler: function(widget, event) {
//    	
//    }
//});

var addAction = Ext.create('Ext.Action', {
	itemId: 'createButton',	
	iconCls:'add',
    text: ppo1_order_create,
    disabled: true,
    handler: function(widget, event) {
    	var mustSave = [];
    	var selections = grid.getSelectionModel().getSelection();
    	
        for (var i = 0; i <grid.store.data.items.length; i++)
        {
              var record = store.data.items [i];
              if (record.dirty) {
              	mustSave.push(record);
              }
             
        }//endof for
        if(mustSave.length>0) {
        	Ext.MessageBox.alert(error_msg_prompt, ppo1_save_msg);
	 			return;
        }
        
 		if(selections.length==0) {
 			Ext.MessageBox.alert(error_msg_prompt, ppo1_error_msg);
 			return;
 		}
  			 		
 		//sales price validate.
 		var canSend_price = true;
 		var canSend_quan = true;
        for (var i = 0; i <selections.length; i++)
        {
              var record = selections[i];
              var strSales_price = record.get('static_sales_price');
              console_log('strSource_price=' + strSales_price);
              var strQuan = record.get('po_qty');
	          var sales_price = parseFloat(strSales_price);
	          var quan = parseFloat(strQuan);
	          console_log('sales_price=' + sales_price);
	          console_log('quan=' + quan);
	          
	          if(isNaN(sales_price) ||  sales_price<0.000000001) {
	        	canSend_price = false;
	          }
	          if(isNaN(quan) ||  quan<0.000000001) {
	        	canSend_quan = false;
	          }
	    }//endof for
    if(canSend_price == false) {
    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content + ' '+ppo1_price_msg);
    } else if( canSend_quan == false) {
    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content + ' '+ppo1_quantity_msg);
	} else {
		routingConfirm(selections);
	}
  			 		

    }//handler end...
});

var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: panelSRO1143,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

var contextMenu = Ext.create('Ext.menu.Menu', {
    items: removeAction
});

var searchField = [];
Ext.onReady(function() {  
	console_log('now starting...');
	LoadJs('/js/util/comboboxtree.js');
	LoadJs('/js/util/getSupplierToolbar.js');
	GenCodeStore  = Ext.create('Mplm.store.GenCodeStore', {hasNull: false, gubunType: 'PPO1_STATUS'} );
	Ext.define('CartLine', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/purchase/request.do?method=read',
		            create: CONTEXT_PATH + '/purchase/request.do?method=create',
		            update: CONTEXT_PATH + '/purchase/request.do?method=update',
		            destroy: CONTEXT_PATH + '/purchase/request.do?method=destroy'
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
		model: 'CartLine',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
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
	store.getProxy().setExtraParam('reserved_varchar2', 'N');
	store.getProxy().setExtraParam('status', 'CT');
 	store.load(function() {
 		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			
			if(dataIndex!='no') {
				if('static_sales_price' == dataIndex 
						|| 'po_qty' == dataIndex) {
					columnObj["editor"] = {
					};	
					columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
						p.tdAttr = 'style="background-color: #FFE4E4;"';
						return value;
					};
				}
			}
		});
 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		grid = Ext.create('Ext.grid.Panel', {
		        store: store,
		        collapsible: true,
		        multiSelect: true,
		        stateId: 'stateGrid',
		        selModel: selModel,
		        autoScroll : true,
		        autoHeight: true,
		        height: getCenterPanelHeight(),
		     // paging bar on the bottom
		        
		        bbar: getPageToolbar(store),
		        
		        dockedItems: [{
		            xtype: 'toolbar',
		            items:[
		                   /*allocAction, '-', */addAction, '-', removeAction,
		                   '->',
		                    {
		                        text: panelSRO1133,
		                        iconCls: 'save',
		                        disabled: false,
		                        handler: function ()
		                        {
		                        	var mustSave = [];
	                                for (var i = 0; i <grid.store.data.items.length; i++)
	                                {
	                            	    var record = store.data.items [i];
	                            	    var status = store.data.items[i].get('status');
		                                  if (record.dirty) {
		                                	  if(status == 'CT'){
		                                		  Ext.MessageBox.alert(error_msg_prompt, ppo1_supplier_msg);
		                                		  store.load({});
		                                	  }else{
		                                		  mustSave.push(record);
		                                	  }
		                                }
		                            }
	                                var totalQuan = mustSave.length;
	                                var sucessQuan = 0;
	                                var failQuan = 0;
	                                var endProcess1 = function() {
	  		                			if(totalQuan==0) {
	  		                			 	store.load(function() {
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
		        		                			endProcess1();
		        		                			
		        		                		},
		        		                		failure: function() {
		        		                			totalQuan--;
		        		                			failQuan++;
		        		                			endProcess1();
		        		                		}	
		                            	  });
		                              }
		                        }
		                    }
		            ]
		        },{
		        	xtype: 'toolbar',
		        	items: getProjectTreeToolbar()//combotree
		        	       
		        },{
		        	xtype: 'toolbar',
		        	items: getSupplierToolbar()
		        }],
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
	    		selectionLength = selections.length;
	    		
	            if (selections.length) {
					//grid info 켜기
					displayProperty(selections[0]);
					var status = selections[0].get('status');
					checkAction(status);
					if(fPERM_DISABLING()==true) {
						addAction.disable();
		            	removeAction.disable();	
					}else{
		            	removeAction.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
		            	removeAction.disable(); 
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
	            		addAction.disable();
		            	removeAction.disable();
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

