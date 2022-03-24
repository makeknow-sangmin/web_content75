
//global var.
var grid = null;
var store = null;

var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');

        			ComDst.load(unique_id ,{
        				 success: function(comdst) {
        					 	var unique_id = comdst.get('unique_id');
        						var dept_code = comdst.get('dept_code');
        						var dept_name = comdst.get('dept_name');
        						var company_code = comdst.get('company_code');
        						var company_name = comdst.get('company_name');
        						var wa_code = comdst.get('wa_code');
        						var wa_name = comdst.get('wa_name');
        						var division_code = comdst.get('division_code');
        						var division_name = comdst.get('division_name');
        				        
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
							y: -15 + 1*lineGap,
							name: 'unique_id',
							anchor: '-5'  // anchor width by percentage
							},{
							fieldLabel: getColName('dept_code'),
							value: dept_code,
							x: 5,
							y: -15 + 2*lineGap,
							 name: 'dept_code',
							anchor: '-5'  // anchor width by percentage
							},{
							 fieldLabel: getColName('dept_name'),
							 value: dept_name,
							 x: 5,
							 y: -15 + 3*lineGap,
							 name: 'dept_name',
							 anchor: '-5'  // anchor width by percentage
        				    },{
    						 fieldLabel: getColName('company_code'),
    						 value: company_code,
    						 x: 5,
    						 y: -15 + 4*lineGap,
    						 name: 'company_code',
    						 anchor: '-5'  // anchor width by percentage
    						},{
    						 fieldLabel: getColName('company_name'),
    						 value: company_name,
    						 x: 5,
    						 y: -15 + 5*lineGap,
    						 name: 'company_name',
    						 anchor: '-5'  // anchor width by percentage
    						},{
    						 fieldLabel: getColName('wa_code'),
    						 value: wa_code,
    						 x: 5,
    						 y: -15 + 6*lineGap,
    						 name: 'wa_code',
    						 anchor: '-5'  // anchor width by percentage
    						},{
    						 fieldLabel: getColName('wa_name'),
    						 value: wa_name,
    						 x: 5,
    						 y: -15 + 7*lineGap,
    						 name: 'wa_name',
    						 anchor: '-5'  // anchor width by percentage
    						},{
    						 fieldLabel: getColName('division_code'),
    						 value: division_code,
    						 x: 5,
    						 y: -15 + 8*lineGap,
    						 name: 'division_code',
    						 anchor: '-5'  // anchor width by percentage
    						},{
    						 fieldLabel: getColName('division_name'),
    						 value: division_name,
    						 x: 5,
    						 y: -15 + 9*lineGap,
    						 name: 'division_name',
    						 anchor: '-5'  // anchor width by percentage
    						}
        				    ]
        				        }); //endof form

        				        var win = Ext.create('ModalWindow', {
        				            title: CMD_VIEW,
        				            width: 500,
        				            height: 350,
        				            minWidth: 250,
        				            minHeight: 180,
        				            layout: 'absolute',
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

                			ComDst.load(unique_id ,{
                				 success: function(comdst) {
                					 var unique_id = comdst.get('unique_id');
                						var dept_code = comdst.get('dept_code');
                						var dept_name = comdst.get('dept_name');
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
                				                y: -15 + 1*lineGap,
                			                    name : 'unique_id',
                			                    id : 'unique_id',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('dept_code'),
                				                value: dept_code,
                				                x: 5,
                				                y: -15 + 2*lineGap,
                				                name: 'dept_code',
                				                id : 'dept_code',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: getColName('dept_name'),
                				                value: dept_name,
                				                x: 5,
                				                y: -15 + 3*lineGap,
                				                name: 'dept_name',
                				                id : 'dept_name',
                				                anchor: '-5'  // anchor width by percentage
                				            }
                				            ]
                				        }); //endof form

                				        var win = Ext.create('ModalWindow', {
                				            title: CMD_MODIFY,
                				            width: 500,
                				            height: 200,
                				            minWidth: 250,
                				            minHeight: 180,
                				            layout: 'absolute',
                				            plain: true,
                				            items: form,
                				            buttons: [{
                				                text: CMD_OK,
                				            	handler: function(){
                				                    var form = Ext.getCmp('formPanel').getForm();
                				                    if(form.isValid())
                				                    {
                				                	var val = form.getValues(false);
                				                	var comdst = Ext.ModelManager.create(val, 'ComDst');
                				            		//저장 수정
                				                   	comdst.save({
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
                				        win.show();
                						//endofwin
                				 }//endofsuccess
                			 });//emdofload
                	
                };



function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
	           	 var comdst = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'ComDst');
        		
	           	comdst.destroy( {
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

//Define Remove Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: CMD_ADD,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {

		var lineGap = 30;
    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            region: 'center',
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
             items: [ 
            {
                fieldLabel: getColName('dept_code'),
                x: 5,
                y: 0 + 1*lineGap,
                name: 'dept_code',
                id: 'dept_code',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: getColName('dept_name'),
                x: 5,
                y: 0 + 2*lineGap,
                name: 'dept_name',
                anchor: '-5'  // anchor width by percentage
            }
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 500,
            height: 200,
            minWidth: 250,
            minHeight: 180,
            layout: {
            	type: 'border',
            	padding: 0
            },
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
                	var val = form.getValues(false);
                   	var comdst = Ext.ModelManager.create(val, 'ComDst');
                   	var dept_code = Ext.getCmp('dept_code').getValue();
                  //중복 코드 체크
					Ext.Ajax.request({
   						url: CONTEXT_PATH + '/admin/comdst.do?method=checkCode',				
        				params:{
        					dept_code : dept_code
        				},
   						
   						success : function(result, request) {
   							
   							var ret = result.responseText;
   							console_log(ret);
   							
   							if(ret == 0 ||  ret  == '0') {
   							//저장 수정
   			                   	comdst.save({
   			                		success : function() {
   			                           	if(win) 
   			                           	{
   			                           		upload = null;
   			                           		win.close();
   			                           		store.load(function() {
   			                           			lfn_gotoHome();
   			                           		});
   			                           	} 
   			                		} 
   			                	 });
   			                	 
   			                       	if(win) 
   			                       	{
   			                       		upload = null;
   			                       		/*(G)*/vFILE_ITEM_CODE = RandomString(10);
   			                       		win.close();
   			                       		lfn_gotoHome();
   			                       	} 
   							} else {
   								Ext.MessageBox.alert('Duplicated Code', 'check ' + getColName('dept_code') + ' value.'); 
   							}
   							console_log('requested ajax...');
   						},
   						failure: extjsUtil.failureMessage
   					}); 
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    	lfn_gotoHome();
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {win.close();} }
            }]
        });
		win.show(this, function() {
			console_log('FileExtonReady');
		});
     }
});

//Define Delete Action
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
    items: [ detailAction, editAction, removeAction  ]
});

Ext.onReady(function() {  
	
	makeSrchToolbar(searchField);
	
Ext.define('ComDst', {
    	 extend: 'Ext.data.Model',
    	 fields: /*(G)*/vCENTER_FIELDS,
    	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/admin/comdst.do?method=read',
		            create: CONTEXT_PATH + '/admin/comdst.do?method=create',
		            update: CONTEXT_PATH + '/admin/comdst.do?method=update',
		            destroy: CONTEXT_PATH + '/admin/comdst.do?method=destroy'
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
		model: 'ComDst',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	

 	store.load(function() {
			var selModel = Ext.create('Ext.selection.CheckboxModel', {
			    listeners: {
			        selectionchange: function(sm, selections) {
			        	grid.down('#removeButton').setDisabled(selections.length == 0);
			        }
			    }
			});
			
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModel,
			        autoScroll : true,
			        autoHeight : true,
			        height: getCenterPanelHeight(),
			        
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                     addAction,  '-', removeAction,
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
			            items: /*(G)*/vSRCH_TOOLBAR
			        }
			        
			        ],
			        columns: /*(G)*/vCENTER_COLUMNS,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
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
			        title: getMenuTitle()//,
			    });
			fLAYOUT_CONTENT(grid);
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		            if (selections.length) {
						//grid info 켜기
						displayProperty(selections[0]);
						if(fPERM_DISABLING() == true){
			            	removeAction.disable();
			            	editAction.disable();
						}else{
							removeAction.enable();
			            	editAction.enable();			            	
						}
						detailAction.enable();
		            } else {
		            	if(fPERM_DISABLING() == true){
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	editAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
		            		removeAction.disable();
			            	editAction.disable();			            	
		            	}
		            	detailAction.enable();
		            }
		        }
		    });
		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config){
		    	Ext.create('Ext.tip.ToolTip', config);
		    });

		 cenerFinishCallback();//Load Ok Finish Callback
	});
 	 	
     });
     
