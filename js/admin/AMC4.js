/**
 * AMC4 : 분류체계
 */
//global var.
var grid = null;
var store = null;

function func_replaceall(val,sorc1,sorc2){
	while (1)
	{
	if(val.indexOf(sorc1) != -1)
	val = val.replace(sorc1,sorc2);
	else
	break;
	}
	return val;
	}



//Define Remove Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
	disabled: fPERM_DISABLING(),
    text: CMD_ADD,
    handler: function(widget, event) {    	
		var lineGap = 30;
		var bHeight = 30;
    	var uploadPanel = getCommonFilePanel('CREATE', 0, 5, '100%', 140, 50, '');
		
    	var inputItem= [];    	
    	inputItem.push(    	
   	    	 {
   	             y: 0 + 1*lineGap,
   	             name: 'class_code',
   	             anchor: '100%'  // anchor width by percentage
   	         }
       	 );
    	
    	inputItem.push(    	
   	    	 {
   	             y: 0 + 1*lineGap,
   	             name: 'class_name',
   	             anchor: '100%'  // anchor width by percentage
   	         }
       	 );
    	
    	inputItem.push(    	
   	    	 {
   	             y: 0 + 1*lineGap,
   	             name: 'level',
   	             anchor: '100%'  // anchor width by percentage
   	         }
       	 );
    	 	
    	inputItem.push(    	
      	    	 {
      	             y: 0 + 1*lineGap,
      	             name: 'parent_class_code',
      	             anchor: '100%'  // anchor width by percentage
      	         }
          	 );
    	
    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
    		xtype: 'form',
            frame: false ,
            bodyPadding: '3 3 0',
            width: 300,
            fieldDefaults: {
                labelAlign: 'middle',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
    		items: [{
    	            	name: 'level',
    	            	id : 'level',
    	            	xtype: 'hiddenfield'
                		},{   			
        	            name: 'parent_class_code',
        	            xtype: 'hiddenfield',
        	            id : 'parent_class_code'
                    	},{   			
                    	xtype:  'textfield',
                    	fieldLabel: getColName('class_code'),
                    	y: 0 + 1*lineGap,
                    	name: 'class_code',
                    	id :  'class_code',
                    	readOnly: false,
                    	anchor: '100%'  // anchor width by perce
                    	},{
                    		xtype:  'textfield',
                    		fieldLabel: getColName('class_name'),
                    		y: 0 + 2*lineGap,
                    		name: 'class_name',
                    		id :  'class_name',
                    		readOnly: false,
                    		anchor: '100%'  // anchor width by perce    			
                    	}]
        }); //endof form

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 320,
            height: bHeight,
	        autoScroll : true,
            minWidth: 250,
	        minHeight: 130,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
                	var val = form.getValues(false);

                	var b_class_code =form.findField('class_code').getValue();
      				var class_code_full = "";	
      				var parent_class_code ="";
      				
      				if (b_class_code.length!=2&&b_class_code.length!=4&&b_class_code.length!=6&&b_class_code.length!=8){
      					Ext.MessageBox.alert(error_msg_prompt, error_msg_content+' class_code');	
      				}else{
      				
	 					if(b_class_code.length==2){
	 						form.findField('level').setValue(1);
	 						class_code_full  =b_class_code+"000000";
	 						form.findField('class_code').setValue(class_code_full); 			
	     				}else if(b_class_code.length==4){
	     					form.findField('level').setValue(2);     				
	 						parent_class_code= b_class_code.substring(0,2)+"000000";
	 						
	 						form.findField('parent_class_code').setValue(parent_class_code);
	 						class_code_full  =b_class_code+"0000";
	 						form.findField('class_code').setValue(class_code_full); 						
	     				
	     				}else if(b_class_code.length==6){
	     					form.findField('level').setValue(3);     			
	 						parent_class_code= b_class_code.substring(0,4)+"0000";
	 						form.findField('parent_class_code').setValue(parent_class_code);
	 						class_code_full  =b_class_code+"00";
	 						form.findField('class_code').setValue(class_code_full); 						
	     				}else if(b_class_code.length==8){
	     					form.findField('level').setValue(4);
	 						parent_class_code= b_class_code.substring(0,6)+"00";
	 						form.findField('parent_class_code').setValue(parent_class_code);
	 						class_code_full  =b_class_code;
	 						form.findField('class_code').setValue(class_code_full); 						
	     				}
                	 
///********************파일첨부시 추가(Only for FileAttachment)**************
   	           	 var classification = Ext.ModelManager.create({
 	           		class_code : form.findField('class_code').getValue(),
 	           		class_name:form.findField('class_name').getValue(),
 	           		level : form.findField('level').getValue(),
 	           		parent_class_code : form.findField('parent_class_code').getValue()
 		        	 }, 'Classification');
            		//저장 수정
                   	classification.save({
                		success : function() {
                           	if(win) 
                           	{
                           		win.close();
                           		store.load(function() {
    		            			if(uploadPanel!=null) {
    		            				uploadPanel.destroy();
    		            			}lfn_gotoHome();
                           		});
                           		
                           	} 

                		},
                   	failure : function(){
                   	}
                	 });
      				}
                   	if(win) 
                   	{
                   		win.close();
            			if(uploadPanel!=null) {
            				uploadPanel.destroy();
            			}
                   	} 
                	
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);

            			if(uploadPanel!=null) {
            				uploadPanel.destroy();
            			}
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {
            			win.close();
            		}

        			if(uploadPanel!=null) {
        				uploadPanel.destroy();
        			}
            	}
            }]
        });
        win.show();
     }
});

function createViewForm(classification, uploadPanel) {
	
	var lineGap = 30;
	
	var unique_id = classification.get('unique_id');
 	var class_code = classification.get('class_code');
	var class_name = classification.get('class_name' );
	var level = classification.get('level' );
	var parent_class_code = classification.get('parent_class_code');
	var form = Ext.create('Ext.form.Panel', {
		id: 'formPanel',
		xtype: 'form',
        frame: false ,
        bodyPadding: '3 3 0',
        width: 280,
        autoScroll : true,
        autoHeight: true,
        fieldDefaults: {
            labelAlign: 'middle',
            msgTarget: 'side'
        },
        defaultType: 'displayfield',        
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },
		items: [{				
		    fieldLabel: getColName('class_code'),
		    value: class_code,
		    name: 'class_code',
		    anchor: '100%'  // anchor width by percentage
            },{
		    fieldLabel: getColName('class_name'),
		    value: class_name,
		    name: 'class_name',
		    anchor: '100%'  // anchor width by percentage
            },{
		    fieldLabel: getColName('parent_class_code'),
		    value: parent_class_code,
		    name: 'parent_class_code',
		    anchor: '100%'  // anchor width by percentage
            },{
		    fieldLabel: getColName('level'),
		    value: level,
		    name: 'level',
		    anchor: '100%'  // anchor width by percentage
		}
		    ]
    }); //endof form
	
	return form;
}

function createEditForm(classification, uploadPanel) {
	
	var lineGap = 30;
	var unique_id = classification.get('unique_id');
 	var class_code = classification.get('class_code');
	var class_name = classification.get('class_name' );
	var level = classification.get('level' );
	var parent_class_code = classification.get('parent_class_code');

	
	var form = Ext.create('Ext.form.Panel', {
		id: 'formPanel',
		xtype: 'form',
        frame: false ,
        bodyPadding: '3 3 0',
        width: 300,
        fieldDefaults: {
            labelAlign: 'middle',
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },
		items: [{
			xtype:  'textfield',
			fieldLabel: getColName('unique_id'),
			value: unique_id,
		    y: 0 + 1*lineGap,
		    name: 'unique_id',
            readOnly: true,
			fieldStyle: 'background-color: #E7EEF6; background-image: none;',
			anchor: '100%'  // anchor width by perce
		},{
			xtype:  'textfield',
			fieldLabel: getColName('parent_class_code'),
			value: parent_class_code,
		    y: 0 + 2*lineGap,
		    name: 'parent_class_code',
            readOnly: true,
            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
			anchor: '100%'  // anchor width by perce
		},{
			xtype:  'textfield',
			fieldLabel: getColName('level'),
			value: level,
		    y: 0 + 3*lineGap,
		    name: 'level',
            readOnly: true,
            fieldStyle: 'background-color: #E7EEF6; background-image: none;',
			anchor: '100%'  // anchor width by perce
		},{
			xtype:  'textfield',
			fieldLabel: getColName('class_code'),
			value: class_code,
		    y: 0 + 4*lineGap,
		    name: 'class_code',
            readOnly: false,
			anchor: '100%'  // anchor width by perce
		},{
			xtype:  'textfield',
			fieldLabel: getColName('class_name'),
			value: class_name,
		    y: 0 + 5*lineGap,
		    name: 'class_name',
            readOnly: false,
			anchor: '100%'  // anchor width by perce
			
		}
        ]
    }); //endof form
	
	return form;
}

var viewHandler = function() {
			var rec = grid.getSelectionModel().getSelection()[0];
			var unique_id = rec.get('unique_id');
			Classification.load(unique_id ,{
				 success: function(classification) {
						console_log('classification.load ok');
						console_log(classification);

				        var win = Ext.create('ModalWindow', {
				            title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 300,
				            height: 230,
				            minWidth: 250,
				            minHeight: 180,
				            layout: 'absolute',
				            plain:true,
				            autoScroll : true,
				            items: createViewForm(classification, uploadPanel),
				            buttons: [{
				                text: CMD_OK,
				            	handler: function(){
				                       	if(win) 
				                       	{
				                       		if(uploadPanel!=null) {
				                       			uploadPanel.destroy();
				                       		}
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

		
		Classification.load(unique_id ,{
			 success: function(classification) {
					uploadStore = getUploadStore(unique_id);
					uploadStore.load(function() {
						console_log('uploadStore.load ok');
						console_log(uploadStore);
						uploadStore.each(function(record){
							console_log(record.get('object_name'));
						});
						uploadPanel = Ext.create('Ext.ux.multiupload.Panel', {
					        frame: true,
					        store: uploadStore,
					        mode: edit_text,
					        groupUid: unique_id,
					        width: 200,
					        height: 140,
					        x: 0,
					        y: 5,
					        uploadConfig: {
					            uploadUrl:  CONTEXT_PATH + '/uploader.do?method=upload',
					            maxFileSize: 4000 * 1024 * 1024,
					            maxQueueLength: 50
					        }
					    });

			        var win = Ext.create('ModalWindow', {
			            title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
			            width: 350,
			            height: 230,
			            minWidth: 250,
			            minHeight: 180,
			            modal:true,
			            layout: 'absolute',
			            plain:true,
			            items: createEditForm(classification, uploadPanel),
			            buttons: [{
			                text: CMD_OK,
			            	handler: function(){
			                    
			            		var form = Ext.getCmp('formPanel').getForm();
			                                    	
			                    if(form.isValid())
			                    {
			                	var val = form.getValues(false);
			                	///********************파일첨부시 추가(Only for FileAttachment)**************
			                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
			                	///********************파일첨부시 추가(Only for FileAttachment)**************
			                	var classification = Ext.ModelManager.create(val, 'Classification');
			                	
			            		//저장 수정
			                	classification.save({
			                		success : function() {
			                           	if(win) 
			                           	{
					            			if(uploadPanel!=null) {
					            				uploadPanel.destroy();
					    			            lfn_gotoHome();
					            			}
			                           		win.close();
			                           		store.load(function() {});
			                           	} 
			                		} 
			                	 });
			                	
			                       	if(win) 
			                       	{
				            			if(uploadPanel!=null) {
				            				uploadPanel.destroy();
				            			}
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
			            			if(uploadPanel!=null) {
			            				uploadPanel.destroy();
			            			}
			            			
			            			win.close();} }
			            }]
			        });
					win.show();
				});
			 }//endofsuccess
		 });//emdofload
	
};



function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	var records = getMyRecordFromSel(selections);
        	for(var i=0; i< records.length; i++) {
        		var rec = records[i];
        		var unique_id = rec.get('unique_id');
	           	 var classification = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'Classification');
        		
	           	classification.destroy( {
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

	
	var searchField = [];
	
	
	searchField.push('unique_id');
	searchField.push('class_name');
	
	makeSrchToolbar(searchField);
	
	Ext.define('Classification', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/admin/stdClass.do?method=read',
		            create: CONTEXT_PATH + '/admin/stdClass.do?method=create',
		            update: CONTEXT_PATH + '/admin/stdClass.do?method=create',
		            destroy: CONTEXT_PATH + '/admin/stdClass.do?method=destroy'
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
				model: 'Classification',
				sorters: [{
		            property: 'unique_id',
		            direction: 'DESC'
		        }]
			});
			
		 	store.load(function() {

		 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: true} );
					grid = Ext.create('Ext.grid.Panel', {
					        store: store,
					        collapsible: true,
					        multiSelect: true,
					        selModel: selModel,
					        height: getCenterPanelHeight(), 
					        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
					        autoScroll : true,
					        autoHeight: true,
					        
					        bbar: getPageToolbar(store),
					        
					        dockedItems: [{
					            dock: 'top',
					            xtype: 'toolbar',
					            items: [
					                    searchAction
					                    , '-',  addAction,  '-', removeAction
					                    , '->',
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
					            items: /*(G)*/vSRCH_TOOLBAR/*vSRCH_TOOLBAR*/
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
				        	
				        	console_log(selections.length);
				        	if (selections.length) {
								collapseProperty();//uncheck no displayProperty
				        		////grid info 켜기
				        		displayProperty(selections[0]);
				        	}
				        	
				        	detailAction.enable();
				        	var records = getMyRecordFromSel(selections);
				        	console_log(records.length);
				        	
							if(fPERM_DISABLING()==true) {//수정권한이 없으면.			            		
								removeAction.disable();
				            	editAction.disable();
							} else if(records.length>0) {			            		
								removeAction.enable();
				            	editAction.enable();
							}else {
								removeAction.enable();
				            	editAction.enable();
			            	}
				        	
				        }

				    });

				    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
				        Ext.create('Ext.tip.ToolTip', config);
				    });
				    //callback for finishing.
				    cenerFinishCallback();
			}); //store load
});//OnReady

     
