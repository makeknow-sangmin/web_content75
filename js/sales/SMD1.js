//global var.
var grid = null;
var store = null;
var queryHistoryGrid = null;
var group_uid_str = '';

MessageBox = function(){
    return {
        msg : function(format){
            return Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
        }
    };
}();


var productCodeStore = new Ext.create('Ext.data.Store', {
 	fields:[     
  	       { name: 'systemCode', type: "string" }
  	      ,{ name: 'codeName', type: "string"  }
  	     ,{ name: 'codeNameEn', type: "string"  }
  	     
  	  ],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/sales/poreceipt.do?method=productCode',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: false
     	}
 });

Ext.define('UsrAst.Combo', {
	 extend: 'Ext.data.Model',
	 fields: [     
		{ name: 'unique_id', type: "string" }
		,{ name: 'user_id', type: "string"  }
		,{ name: 'user_name', type: "string"  }
		,{ name: 'dept_name', type: "string"  }
		,{ name: 'dept_code', type: "string"  }
		,{ name: 'email', type: "string"  }
		,{ name: 'hp_no', type: "string"  }
	  	  ],
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/userMgmt/user.do?method=query'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				successProperty: 'success'
			},
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        }
		}
});

var userStore = new Ext.data.Store({  
	pageSize: 5,
	model: 'UsrAst.Combo',
	sorters: [{
        property: 'user_name',
        direction: 'ASC'
    }]
}); 


var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');

        			BuyerModel.load(unique_id ,{
        				 success: function(buyerModel) {
        					 	var unique_id = buyerModel.get('unique_id');
        					 	var combst_uid = buyerModel.get("combst_uid");
        					 	var customer_code = buyerModel.get("customer_code");
        					 	var customer_name = buyerModel.get("customer_name");
        						var model_code = buyerModel.get('model_code'  );
        						var model_name = buyerModel.get('model_name' );
        						var pj_code = buyerModel.get('pj_code' );
        						var pj_name = buyerModel.get('pj_name');
        						var model_type = buyerModel.get('model_type' );
        						var class_name = buyerModel.get('class_name');
        						var create_date = buyerModel.get('create_date');
        						var owner_uid = buyerModel.get('owner_uid');
        						var user_id = buyerModel.get('user_id');
        						var user_name = buyerModel.get('user_name');
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
							fieldLabel: getColName('unique_id'),
							value: unique_id,
							x: 5,
							y: 0 + 1*lineGap,
							name: 'unique_id',
							anchor: '-5'  // anchor width by percentage
							},{
        				    	fieldLabel: getColName('customer_code'),
        				    	value: customer_code,
        				    	x: 5,
        				    	y: 0 + 2*lineGap,
        				    	name: 'customer_code',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('customer_name'),
        				    	value: customer_name,
        				    	x: 5,
        				    	y: 0 + 3*lineGap,
        				    	name: 'customer_name',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('model_name'),
        				    	value: model_name,
        				    	x: 5,
        				    	y: 0 + 4*lineGap,
        				    	name: 'create_date',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('class_name'),
        				    	value: class_name,
        				    	x: 5,
        				    	y: 0 + 5*lineGap,
        				    	name: 'class_name',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('create_date'),
        				    	value: create_date,
        				    	x: 5,
        				    	y: 0 + 6*lineGap,
        				    	name: 'create_date',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('user_id'),
        				    	value: user_id,
        				    	x: 5,
        				    	y: 0 + 7*lineGap,
        				    	name: 'user_id',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('user_name'),
        				    	value: user_name,
        				    	x: 5,
        				    	y: 0 + 7*lineGap,
        				    	name: 'user_name',
        				    	anchor: '-5'  // anchor width by percentage
        				    }
        				    ]
        				        }); //endof form

        				        var win = Ext.create('ModalWindow', {
        				            title: CMD_VIEW,
        				            width: 600,
        				            height: 430,
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

var editHandler = function() {
							buyerStore['cmpName'] = 'combst_uid'; //combo name
						    	
                			var rec = grid.getSelectionModel().getSelection()[0];
                			var unique_id = rec.get('unique_id');

                			BuyerModel.load(unique_id ,{
                				 success: function(buyerModel) {
                					 	var unique_id = buyerModel.get('unique_id');
                						var customer_code = buyerModel.get('customer_code');
                						var customer_name = buyerModel.get('customer_name');
                						var model_code = buyerModel.get('model_code');
                						var model_name = buyerModel.get('model_name');
                						var pj_code = buyerModel.get('pj_code');
                						var pj_name = buyerModel.get('pj_name');
                						var model_type = buyerModel.get('model_type');
                						var class_name = buyerModel.get('class_name');
                						var owner_uid = buyerModel.get('owner_uid');
                						var combst_uid = buyerModel.get('combst_uid');
                						var user_id = buyerModel.get('user_id');
                						var user_name = buyerModel.get('user_name');

                						var lineGap = 30;
                						
                						console_log(user_name);
                						
                					   	 var formCombstUid = new Ext.form.Hidden({
                							   id: 'combst_uid',
                							   name: 'combst_uid',
                							   value: combst_uid
                							});
                					   	 
                					  	 var formOwnerUid = new Ext.form.Hidden({
                					  		   id: 'owner_uid',
                					  		   name: 'owner_uid',
                					  		   value: owner_uid
              							 });
                					  	 
                				    	var form = Ext.create('Ext.form.Panel', {
                				    		id: 'formPanel',
                				            layout: 'absolute',
                				            url: 'save-form.php',
                				            defaultType:  'textfield',
                				            border: false,
                				            bodyPadding: 15,
                				            defaults: {
                				                anchor: '100%',
                				                allowBlank: false,
                				                msgTarget: 'side',
                				                labelWidth: 100
                				            },
                				            items: [ 
											{
											    fieldLabel: getColName('unique_id'),
											    value: unique_id,
											    x: 5,
											    y: 0 + 1*lineGap,
											    name: 'unique_id',
								                readOnly: true,
								    			fieldStyle: 'background-color: #E7EEF6; background-image: none;',
											    anchor: '-5'  // anchor width by percentage
											},formCombstUid,
											{
											    fieldLabel: getColName('combst_uid'),
								                x: 5,
								                y: 0 + 2*lineGap,
											    xtype: 'combo',
											    value: customer_name,
											    mode: 'local',
							                    queryMode: 'remote',  									   
											    displayField:   'wa_name',
											    valueField:     'wa_name',
											    store: buyerStore,
											    readOnly: true,
											    fieldStyle: 'background-color: #E7EEF6; background-image: none;',
											    editable:false,
											    allowBlank: false,
											    listConfig:{
							      	                	getInnerTpl: function(){
							      	                		return '<div data-qtip="{wa_name}">[{wa_code}] {wa_name} </div>';
							      	                	}//endofgetInnerTpl
							      	                }//endoflistConfig
												,listeners: {
					   	   	                    	select: function (combo, record) {	
  				   	   	                    		    value = this.getValue();
					   	   	                    		console_log("value1>>>>>>"+value);
					   	   	                    		var combst_uid = record[0].get('unique_id');
					   	   	                    		Ext.getCmp('combst_uid').setValue(combst_uid);
					   	   	                    		
					   	   	                    		console_log("combst_uid>>>>>"+combst_uid);
					   	   	                    	}//endofselect
												}
											},
							                {
							         		    fieldLabel: getColName('class_name'),
							         		    x: 5,
								                y: 0 + 3*lineGap,
							         		    id: 'class_name',
							         		    name: 'class_name',
							                 	xtype: 'combo',
							                 	value:	class_name,
							                    mode: 'local',
							                    editable:false,
							                    queryMode: 'remote',
							                    displayField:   'codeName',
							                    valueField:     'systemCode',
							                    store: productCodeStore,
							                    readOnly: true,
								    			fieldStyle: 'background-color: #E7EEF6; background-image: none;',
							 	                listConfig:{
							 	                	getInnerTpl: function(){
							 	                		return '<div data-qtip="{codeName}">[{systemCode}] {codeName} / {codeNameEn}</div>';
							 	                	}			                	
							 	                }
							                }, formOwnerUid,

							                { 
								   
							                  	fieldLabel: getColName('owner_uid'),
							                    x: 5,
								                y: 0 + 4*lineGap,
							      	            xtype: 'combo',
							      	            value: user_name,
							      	            mode: 'local',
							      	            store: userStore,
							      	            queryMode: 'remote',  
							      	            displayField: 'user_name',
							      	            valueField:     'user_name',
							      	            typeAhead: false,
							                    allowBlank: false,
							      	            listConfig: {
							      	                loadingText: 'Searching...',
							      	                emptyText: 'No matching posts found.',
							      	                // Custom rendering template for each item
							      	                getInnerTpl: function() {
							      	                	return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
							      	                }
							      	            },
							      	      	    listeners: {
				   	   	                    	select: function (combo, record) {	
				   	   	                    		var owner_uid = record[0].get('unique_id');
				   	   	                    		Ext.getCmp('owner_uid').setValue(owner_uid);
				   	   	                    		console_log("owner_uid>>>>>"+owner_uid);
				   	   	                    	}//endofselect
											}
							          	},
							            {
							                fieldLabel: getColName('model_name'),
							                x: 5,
							                y: 0 + 5*lineGap,
							                name: 'model_name',
							                value: model_name,
							                anchor: '-5'
							            }
                				            ]
                				        }); //endof form

                				        var win = Ext.create('ModalWindow', {
                				            title: CMD_MODIFY,
                				            width: 700,
                				            height: 380,
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
                				                	var val = form.getValues(false);
                				                	var buyerModel = Ext.ModelManager.create(val, 'BuyerModel');
                				                	
                				            		//저장 수정
                				                	buyerModel.save({
                				                		success : function() {
                				                			//console_log('updated');
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
                				                       	} 
                				                    } else {
                				                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                				                    }
                				                  }
                				            },{
                				                text: CMD_CANCEL,
                				            	handler: function(){
                				            		if(win) {win.close();} }
                				            }]
                				        });
                				        win.show();
                						//endofwin
                				 }//endofsuccess
                			 });//emdofload
                	
                };

   var queryHistoryHandler = function() {
	   group_uid_str = '';
	  	var selections = grid.getSelectionModel().getSelection();

		for(var i=0; i< selections.length; i++) {
			var rec = selections[i];
			var group_uid = rec.get('group_uid');
			   
			console_log('requested ajax...'+group_uid);
			group_uid_str += group_uid+",";	

		}
	   
		var queryHistoryStore = Ext.create('Mplm.store.BuyerModelHistoryStore', {} );
		
		queryHistoryStore.load(function() {
			 queryHistoryGrid = Ext.create('Ext.grid.Panel', {
			        store: queryHistoryStore,
			        stateId: 'stateGrid-mchnGrid',
			        layout: 'fit',
			        height: 400,
					multiSelect : false,
			        columns: [
			                  { text     : getColName('unique_id'), 		width : 80,  sortable : true, dataIndex: 'unique_id'  },
			                  { text     : getColName('create_date'), 		width : 80,  sortable : true, dataIndex: 'create_date'  },
			                  { text     : getColName('customer_code'), 		width : 80,  sortable : true, dataIndex: 'customer_code'  },
			                  { text     : getColName('customer_name'), 		width : 80,  sortable : true, dataIndex: 'customer_name'  },
			                  { text     : getColName('model_name'), 		width : 80,  sortable : true, dataIndex: 'model_name'  },
			                  { text     : getColName('class_name'), 		width : 80,  sortable : true, dataIndex: 'class_name'  },
			                  { text     : getColName('user_name'), 		width : 80,  sortable : true, dataIndex: 'user_name'  },
			                  ],
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: false,
			            getRowClass: function(record) { 
			            	console_log('unique_id=' + record.get('unique_id'));
			            } ,
			            listeners: {
			                itemdblclick:  function(dv, record, item, index, e) {
			                    alert('working');
			                }

			            }
			        }
			    });
				

				
				win = Ext.create('widget.window', {
					title: panelSMD1001,
					modal:true,
					plain:true,
					closable: true,
					closeAction: 'hide',
					width: 750,
					minWidth: 700,
					height: 450,
					layout: {
					type: 'border',
					padding: 5
					},
					items: [{
					region: 'west',
					title: '',
					width: 580,
					split: true,
					collapsible: false,
					floatable: false,
					items: [queryHistoryGrid]
					}
					, {
					region: 'center',
					xtype: 'tabpanel',
					items: [{
					title: 'Works',
					html: ''
					}, {
					title: 'Property',
					html: ''
					}]
					}],
		         
		         	buttons: [{
			            text: CMD_CANCEL,
	         			handler: function(){
	         				if(win) {win.close();} 
	         			}
			         }]
				});

				win.show();
		});
   };
   
//writer define
Ext.define('BuyerModel.writer.SinglePost', {
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
        		var unique_id = rec.get('unique_id');
	           	 var buyerModel = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'BuyerModel');
        		
	           	buyerModel.destroy( {
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
            icon: Ext.MessageBox.QUESTION
        });
    }
});

//Define Add Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: CMD_ADD,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {

		buyerStore['cmpName'] = 'combst_uid'; //combo name
	    	
		var lineGap = 30;
    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            layout: 'absolute',
            url: 'save-form.php',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
             items: [ {
				    fieldLabel: getColName('combst_uid'),
	                x: 5,
	                y: 0 + 1*lineGap,
				    id :'combst_uid',
				    name : 'combst_uid',
				    xtype: 'combo',
				    store: buyerStore,
				    minChars: 2,
				    displayField:   'wa_name',
				    valueField:     'unique_id',
				    typeAhead: false,
				    allowBlank: false,
				    width: 200,
				    listConfig:{
				        loadingText: 'Searching...',
		                emptyText: 'No matching posts found.',
		                // Custom rendering template for each item
		                getInnerTpl: function() {
		                	return '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
		                }
				    }			
               },
                {
         		    fieldLabel: getColName('class_name'),
	                x: 5,
	                y: 0 + 2*lineGap,
	                name: 'class_name',
	                anchor: '-5'
                },
                
                { 
	   
                  	fieldLabel: getColName('owner_uid'),
                    x: 5,
	                y: 0 + 3*lineGap,
      				name : 'owner_uid',
      	            xtype: 'combo',
      	            store: userStore,
      	            displayField: 'user_name',
      	            valueField:     'unique_id',
      	            typeAhead: false,
                    allowBlank: false,
                    listConfig: {
     	                loadingText: 'Searching...',
     	                emptyText: 'No matching posts found.',
     	                // Custom rendering template for each item
     	                getInnerTpl: function() {
     	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
     	                }
     	            }
          	},
            {
                fieldLabel: getColName('model_name'),
                x: 5,
                y: 0 + 4*lineGap,
                name: 'model_name',
                anchor: '-5'
            }
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + ' Sales',
            width: 500,
            height: 350,
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
                	var val = form.getValues(false);
                   	 var buyerModel = Ext.ModelManager.create(val, 'BuyerModel');
            		//저장 수정
                   	buyerModel.save({
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
                       	} 
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {win.close();} }
            }]
        });
		win.show(this, function() {
		});
     }
});


//Define Edit Action
var editAction = Ext.create('Ext.Action', {
	itemId: 'editButton',
    iconCls: 'pencil',
    text: edit_text,
    disabled: true ,
    handler: editHandler
});

var queryHistoryAction =  Ext.create('Ext.Action',{
	itemId: 'queryButton',
	iconCls: 'pencil',
	text: panelSMD1001,
	disabled: true,
	handler: queryHistoryHandler
	
});

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

/******** move to handler**********
var printExcel = Ext.create('Ext.Action', {
	itemId: 'printExcelButton',
    iconCls: 'MSExcelX',
    text: 'Excel Print',
    disabled: false ,
    handler: printExcelHandler
});
**********************************/

//Define Detail Action
var detailAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: viewHandler
});
//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ detailAction, editAction, removeAction ]
});


Ext.define('BuyerModel', {
    	 extend: 'Ext.data.Model',
    	 fields: /*(G)*/vCENTER_FIELDS,
    	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/sales/buyerModel.do?method=read', /*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/sales/buyerModel.do?method=create', /*create record, update*/
		            update: CONTEXT_PATH + '/sales/buyerModel.do?method=update',
		            destroy: CONTEXT_PATH + '/sales/buyerModel.do?method=destroy' /*delete*/
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


var searchField = [];
Ext.onReady(function() {  
	searchField.push(
			{
				field_id :'combst_uid',
		        store: 'BuyerStore',
		        displayField:   'wa_name',
		        valueField:     'unique_id',
		        innerTpl	: '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>'
			});
	//console_log('now starting...');
	makeSrchToolbar(searchField);
	LoadJs('/js/util/buyerStore.js');
	 //BuyerModel Store 정의
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'BuyerModel',
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
			                    searchAction
			                    , '-',  addAction,  '-', removeAction,  '-', queryHistoryAction ,
	      				        '->'
			                    ,
	      				            {
	      				                iconCls: 'tasks-show-all',
	      				                tooltip: 'All',
	      				                toggleGroup: 'status'
	      				            },
	      				            {
	      				                iconCls: 'tasks-show-active',
	      				                tooltip: 'Current',
	      				                toggleGroup: 'status'
	      				            },
	      				            {
	      				                iconCls: 'tasks-show-complete',
	      				                tooltip: 'Past',
	      				                toggleGroup: 'status'
	      				            }
	      				          
	      				          ]
			        },

			        {
			            xtype: 'toolbar',
			            items: /*(G)*/vSRCH_TOOLBAR
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
									
								}
			            		,
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    contextMenu.showAt(e.getXY());
			                    return false;
			                },
			                itemdblclick: viewHandler  
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
			            	queryHistoryAction.disable();
			            	editAction.disable();
						}else{
							removeAction.enable();
							queryHistoryAction.enable();
			            	editAction.enable();
						}
						detailAction.enable();
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	queryHistoryAction.disable();
			            	editAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
		            		removeAction.disable();
		            		queryHistoryAction.disable();
			            	editAction.disable();
		            	}
		            	detailAction.enable();
		            }
		        }
		    });

		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
});	//OnReady
     
