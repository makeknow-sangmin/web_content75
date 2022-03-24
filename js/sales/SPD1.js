//global var.
var grid = null;
var store = null;

var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');

        			Product.load(unique_id ,{
        				 success: function(product) {
        					 	var unique_id = product.get('unique_id');
        					 	var unique_id_long = product.get('unique_id_long');
        						var item_code = product.get('item_code');
        						var item_name = product.get('item_name');
        						var specification = product.get('specification'  );
        						var description = product.get('description' );
        						var stock_qty = product.get('stock_qty' );
        						var sales_price = product.get('sales_price');
        						var lead_time = product.get('lead_time');
        						var create_date = product.get('create_date');
        				        
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
								fieldLabel: getColName('item_code'),
								value: item_code,
								x: 5,
								y: 0 + 2*lineGap,
								name: 'item_code',
								anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('item_name'),
        				    	value: item_name,
        				    	x: 5,
        				    	y: 0 + 3*lineGap,
        				    	name: 'item_name',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('specification'),
        				    	value: specification,
        				    	x: 5,
        				    	y: 0 + 4*lineGap,
        				    	name: 'specification',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('description'),
        				    	value: description,
        				    	x: 5,
        				    	y: 0 + 5*lineGap,
        				    	name: 'description',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('stock_qty'),
        				    	value: stock_qty,
        				    	x: 5,
        				    	y: 0 + 6*lineGap,
        				    	name: 'stock_qty',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('sales_price'),
        				    	value: sales_price,
        				    	x: 5,
        				    	y: 0 + 7*lineGap,
        				    	name: 'sales_price',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('lead_time'),
        				    	value: lead_time,
        				    	x: 5,
        				    	y: 0 + 8*lineGap,
        				    	name: 'lead_time',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: getColName('create_date'),
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
        				            height: 350,
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
                			var rec = grid.getSelectionModel().getSelection()[0];
                			var unique_id = rec.get('unique_id');

                			Product.load(unique_id ,{
                				 success: function(product) {
                					 	var unique_id = product.get('unique_id');
                					 	var unique_id_long = product.get('unique_id_long');
                						var item_code = product.get('item_code');
                						var item_name = product.get('item_name');
                						var specification = product.get('specification');
                						var description = product.get('description');
                						var stock_qty = product.get('stock_qty');                						
                						var sales_price = product.get('sales_price');
                						var lead_time = product.get('lead_time');
                				        
                						var lineGap = 30;
                						
                						
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
											},
											{
            				                fieldLabel: getColName('item_code'),
            				                value: item_code,
            				                x: 5,
            				                y: 0 + 2*lineGap,
            				                name: 'item_code',
            				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('item_name'),
                				                value: item_name,
                				                x: 5,
                				                y: 0 + 3*lineGap,
                				                name: 'item_name',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('specification'),
                				                value: specification,
                				                x: 5,
                				                y: 0 + 4*lineGap,
                				                name: 'specification',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('description'),
                				                value: description,
                				                x: 5,
                				                y: 0 + 5*lineGap,
                				                name: 'description',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('stock_qty'),
                				                xtype: 'numberfield',
                				            	minValue: 0,
                				                value: stock_qty,
                				                x: 5,
                				                y: 0 + 6*lineGap,
                				                name: 'stock_qty',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('sales_price'),
                				                value: sales_price,
                				                xtype: 'numberfield',
                				            	minValue: 0,
                				                x: 5,
                				                y: 0 + 7*lineGap,
                				                name: 'sales_price',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('lead_time'),
                				                value: lead_time,
                				                xtype: 'numberfield',
                				            	minValue: 0,
                				                x: 5,
                				                y: 0 + 8*lineGap,
                				                name: 'lead_time',
                				                anchor: '-5'  // anchor width by percentage
                				            }
                				            ]
                				        }); //endof form

                				        var win = Ext.create('ModalWindow', {
                				            title: CMD_MODIFY,
                				            width: 700,
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
                				                	var product = Ext.ModelManager.create(val, 'Product');
                				                	
                				            		//저장 수정
                				                	product.save({
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

//writer define
Ext.define('Product.writer.SinglePost', {
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
        	var records = getMyRecordFromSel(selections);
        	for(var i=0; i< records.length; i++) {
        		var rec = records[i];
        		var unique_id = rec.get('unique_id');
	           	 var product = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'Product');
        		
	           	product.destroy( {
	           		 success: function() {}
	           	});
           	
        	}
        	grid.store.remove(selections);
        }

    }
};

function deliveryConfirm(btn){
	
	var selections = grid.getSelectionModel().getSelection();
	if (selections) {
		var result = MessageBox.msg('{0}', btn);
		if(result=='yes') {
		   var unique_id = new Array();
			var records = getMyRecordFromSel(selections);
			for(var i=0; i< records.length; i++) {
				var rec = records[i];
				unique_id[i] = rec.get('unique_id');
			}
				var specification = rec.get('specification');
				var txt_name = "[" + spd1_delivery_action + "]" + specification;
				var txt_content = rec.get('item_name');
				var req_info = spd1_delivery_action;
				var hid_req_date = new Date();
				var sales_price = rec.get('sales_price');
				var item_code = rec.get('item_code');
				Ext.Ajax.request({
					url: CONTEXT_PATH + '/sales/product.do?method=delivery',
					params:{
						unique_id : unique_id,
						txt_name : txt_name,
						txt_content : txt_content,
						req_info : req_info,
						hid_req_date : hid_req_date,
						sales_price : sales_price,
						item_code : item_code
					},
					success : function(result, request) {
						store.load({});
					},
					failure: extjsUtil.failureMessage
				});	
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

var deliveryAction = Ext.create('Ext.Action', {
	itemId: 'deliveryButton',
	iconCls: 'my_purchase',
	text: spd1_delivery_action,
	disabled: true,
	handler: function(widget, event) {
		Ext.MessageBox.show({
			title:spd1_msg_delivery,
			msg: spd1_msg_delivery_content,
			buttons: Ext.MessageBox.YESNO,
			fn: deliveryConfirm,
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
             items: [ 
            {
                fieldLabel: getColName('item_code'),
                x: 5,
                y: 0 + 1*lineGap,
                name: 'item_code',
                id:'item_code',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('item_name'),
                x: 5,
                y: 0 + 2*lineGap,
                name: 'item_name',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('specification'),
                x: 5,
                y: 0 + 3*lineGap,
                name: 'specification',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('description'),
                x: 5,
                y: 0 + 4*lineGap,
                name: 'description',
                anchor: '-5'  // anchor width by percentage
            },{
            	 xtype: 'numberfield',
            	 minValue: 0,
            	 maxValue:99999999999,
                fieldLabel: getColName('stock_qty'),
                x: 5,
                y: 0 + 5*lineGap,
                name: 'stock_qty'
            },{
            	 xtype: 'numberfield',
            	 minValue: 0,
            	 maxValue:99999999999,
                fieldLabel:getColName('sales_price'),
                x: 5,
                y: 0 + 6*lineGap,
                name: 'sales_price'

            },{
            	 xtype: 'numberfield',
            	 minValue: 0,
            	 maxValue:99999999999,
                fieldLabel: getColName('lead_time'),
                x: 5,
                y: 0 + 7*lineGap,
                name: 'lead_time'
            }
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + ' Sales',
            width: 700,
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
                    var item_code = Ext.getCmp('item_code').getValue();
                	var val = form.getValues(false);
                   	 var product = Ext.ModelManager.create(val, 'Product');
            		//저장 수정
                   	Ext.Ajax.request({
						url: CONTEXT_PATH + '/sales/product.do?method=checkCode',				
     				params:{
     					item_code : item_code
     				},
						
						success : function(result, request) {
							
							var result = result.responseText;
    						console_log('result:' + result);
    						if(result != 'false'){
								//저장 수정
								
			                   	product.save({
			                		success : function(result,request) {
			                			
			                			var result = result.responseText;
			    						console_log(result);
			    						if(result == 'false'){
			    							Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
			    						}else{
			    							win.close();
			    							store.load(function() {});
			    						}  	
			                		},failure: extjsUtil.failureMessage
			                	 });
                         	 
                                	if(win) 
                                	{
                                		win.close();
                                	} 
								
							} else {
								Ext.MessageBox.alert('Duplicated Code', 'check ' + getColName('item_code') + ' value.'); 
							}
							console_log('requested ajax...');
						}
					});
                   	 

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
		    //button.dom.disabled = false;
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

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

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
    items: [ detailAction, editAction, removeAction  ]
});

Ext.onReady(function() {  
	console_log('now starting...');

	makeSrchToolbar(searchField);
	
	ReleaseFlagStore  = Ext.create('Mplm.store.ReleaseFlagStore', {hasNull: false} );
	
	Ext.define('Product', {
	    	 extend: 'Ext.data.Model',
	    	 fields: /*(G)*/vCENTER_FIELDS,
	    	    proxy: {
					type: 'ajax',
			        api: {
			            read: CONTEXT_PATH + '/sales/product.do?method=read', /*1recoed, search by cond, search */
			            create: CONTEXT_PATH + '/sales/product.do?method=create', /*create record, update*/
			            update: CONTEXT_PATH + '/sales/product.do?method=update',
			            destroy: CONTEXT_PATH + '/sales/product.do?method=destroy' /*delete*/
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
	
	
	 //ComBst Store 정의
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'Product',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});

 	store.load(function() {
 		var selModel = Ext.create("Mplm.util.ReleaseFlag", {onlyCheckOwner: true} );
			
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
			                    , '-',  addAction,  '-', removeAction, '-', deliveryAction,
	      				        '->',
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
      		        	items: [{
      						id :'releaseflag',
      		                name:           'releaseflag',
      						xtype:          'combo',
      		                mode:           'local',
      		                triggerAction:  'all',
      		                value: spd1_gubun,
      		                emptyText:  spd1_delivery_action,
      		                displayField:   'codeName',
      		                valueField:     'systemCode',
      		                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
      		                queryMode: 'remote',
      		                store: ReleaseFlagStore,
      		                listConfig:{
      		                	getInnerTpl: function(){
      		                		return '<div data-qtip="{systemCode}">{codeName}</div>';
      		                	}			                	
      		                },
      		                	listeners: {
      		                		select: function (combo, record) {
      		                			var releaseflag = Ext.getCmp('releaseflag').getValue();
      		                			store.getProxy().setExtraParam('release_flag', releaseflag);
      				     				store.load({});
      		                		}//endofselect
      		                	}
      		        	}]
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
		            }
		            	detailAction.enable();
		            	var records = getMyRecordFromSel(selections);
		            	console_log("records.length :" + records.length);
		            	
		            	if(fPERM_DISABLING()==true) {//수정권한이 없으면.
		            		removeAction.disable();
		            		editAction.disable();
		            		deliveryAction.disable();
		            	} else if(records.length>0) {
		            		removeAction.enable();
		            		editAction.enable();
		            		deliveryAction.enable();
		            	}else {
		            		removeAction.disable();
		            		editAction.disable();
		            		deliveryAction.disable();
		            	}
		            }
		    });
		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
});	//OnReady
     
