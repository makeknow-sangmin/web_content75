//Ext.onReady(function() {  fDEF_CONTENT(); });
//표준공수코드 standard code 
//global var.
var grid = null;
var store = null;


///Define Add Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: CMD_ADD,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {


    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            
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
				fieldLabel: getColName('role_code'),
//			    value: systemCode,
//			    readOnly: true,
				fieldStyle: 'text-transform:uppercase',
			    name: 'role_code',
			    xtype: 'textfield',
//				fieldStyle: 'background-color: #E7EEF6; background-image: none;',
				anchor: '100%'  // anchor width by perce
			},{
				fieldLabel: getColName('role_name'),
//				value: codeNameKr,
				//y: 0 + 1*lineGap,
				name: 'role_name',
				xtype: 'textfield',
//				fieldStyle: 'background-color: #E7EEF6; background-image: none;',
				anchor: '100%'  // anchor width by perce
			},{
				fieldLabel: getColName('role_name_en'),
//				value: codeNameEn,
				//y: 0 + 1*lineGap,
				name: 'role_name_en',
				xtype: 'textfield',
//				fieldStyle: 'background-color: #E7EEF6; background-image: none;',
				anchor: '100%'  // anchor width by perce
			}
            
            
         
    		
    		
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + ' Sales',
            width: 350,
            height: 250,
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
                	var authorities = Ext.ModelManager.create(val, 'Authorities');
            		//저장 수정
                   	authorities.save({
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

var viewHandler = function() {
			var rec = grid.getSelectionModel().getSelection()[0];
			var unique_id = rec.get('unique_id');
			
			Authorities.load(unique_id ,{
				 success: function(authorities) {	
					 

					 
					 
					 
					 
					 
					 
					 

				        var win = Ext.create('ModalWindow', {
				            title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 700,
				            height: 530,
				            minWidth: 250,
				            minHeight: 180,
				            layout: 'absolute',
				            plain:true,
				            items: createViewForm(authorities),
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
				        //store.load(function() {});
						win.show();
						//endofwin
						
//					});
	

				 }//endofsuccess
			 });//emdofload
	
};

var editHandler = function() {
		var rec = grid.getSelectionModel().getSelection()[0];
		var selectsystemcode = rec.get('role_code');
		var unique_id = rec.get('unique_id');
		console_log('Load success:' + selectsystemcode);
//		var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {group_code: unique_id} );
//		attachedFileStore.load(function() {
//			console_log('attachedFileStore.load ok');
		
//		Authorities.getProxy().setExtraParam('systemcode', systemcode);
			
			Authorities.load(selectsystemcode,{
				 success: function(authorities) {
					 
//					 	console_log('Load success:');
//						var unique_id = authorities.get('unique_id');
//						var unique_id = authorities.get('unique_id');
						var role_code = authorities.get('role_code');
						var role_name = authorities.get('role_name');
						var role_name_en = authorities.get('role_name_en');

						
						var myItems = [];
						
						myItems.push({
							value: selectsystemcode,
							//y: 0 + 1*lineGap,
							name: 'selectsystemcode',
							readOnly: true,
							 hidden: true,
							anchor: '100%'  // anchor width by perce
						});
						myItems.push({
							fieldLabel: getColName('unique_id'),
						    value: unique_id,
						    //y: 0 + 1*lineGap,
						    name: 'unique_id',
					       readOnly: true,
							fieldStyle: 'background-color: #E7EEF6; background-image: none;',
							anchor: '100%'  // anchor width by perce
						});

						myItems.push({
							fieldLabel: getColName('role_code'),
						    value: role_code,
						    readOnly: true,
						    name: 'role_code',
						    xtype: 'textfield',
							fieldStyle: 'background-color: #E7EEF6; background-image: none;',
							anchor: '100%'  // anchor width by perce
						});
						myItems.push({
							fieldLabel: getColName('role_name'),
							value: role_name,
							//y: 0 + 1*lineGap,
							name: 'role_name',
							xtype: 'textfield',
//							fieldStyle: 'background-color: #E7EEF6; background-image: none;',
							anchor: '100%'  // anchor width by perce
						});
						myItems.push({
							fieldLabel: getColName('role_name_en'),
							value: role_name_en,
							//y: 0 + 1*lineGap,
							name: 'role_name_en',
							xtype: 'textfield',
//							fieldStyle: 'background-color: #E7EEF6; background-image: none;',
							anchor: '100%'  // anchor width by perce
						});
					   

						

						var form = Ext.create('Ext.form.Panel', {
							id: 'formPanel',
					       defaultType:  'textfield',
					       border: false,
					       height: 250,
					       bodyPadding: 15,
					       defaults: {
					           anchor: '100%',
					           allowBlank: false,
					           msgTarget: 'side',
					           labelWidth: 100
					       },
					       items: myItems
					   }); //endof form


					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
				        var win = Ext.create('ModalWindow', {
				            title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 350,
				            height: 250,
				            minWidth: 250,
				            minHeight: 180,
				            modal:true,
				            layout: 'absolute',
				            plain:true,
				            items: form,
				            buttons: [{
				                text: CMD_OK,
				            	handler: function(){
				                    
				            		var form = Ext.getCmp('formPanel').getForm();
				                                    	
				                    if(form.isValid())
				                    {
					                	var val = form.getValues(false);
					                	///********************파일첨부시 추가(Only for FileAttachment)**************
//					                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
					                	///********************파일첨부시 추가(Only for FileAttachment)**************
					                	var authorities = Ext.ModelManager.create(val, 'Authorities');
//					                   	form.submit({
//					                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
//					                        waitMsg: 'Uploading Files...',
//					                        success: function(fp, o) {
								            		//저장 수정
								                   	authorities.save({
								                		success : function() {
								                           	if(win) {	
								                           		win.close();
								                           		store.load(function() {});
								                           	} 
								                		}, failure : function(){
								                			win.close();
								                		}
								                	}); //endof save
//					                        },
//					                    	failure : function(){
//					                    		console_log('failure');
//					                    		Ext.MessageBox.alert(error_msg_prompt,'Failed');
//					                    	}
//					                 });
					                   	
				                    } else {//form is not valid
				                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
				                    }
				                    


				                  }
				            },{
				                text: CMD_CANCEL,
				            	handler: function(){
				            		if(win) { win.close();} 
				            	}

				            }]
				        });
						win.show();
						

				 }//endofsuccess
			 });//endofpcsmcfixload
			
//		});//endofattachedFileStore.load


	
};


function deleteConfirm(btn){

   var selections = grid.getSelectionModel().getSelection();
   if (selections) {
       var result = MessageBox.msg('{0}', btn);
       if(result=='yes') {
       	for(var i=0; i< selections.length; i++) {
       		var rec = selections[i];
       		var unique_id = rec.get('unique_id');
       		var role_code = rec.get('role_code');
       		console_log('role_code:' + role_code);
	           	 var authorities = Ext.ModelManager.create({
	           		role_code : role_code
	        	 }, 'Authorities');
       		
	           	authorities.destroy( {
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
//   disabled: fPERM_DISABLING() ,
   disabled: fPERM_DISABLING(),
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
   items: [/* detailAction,*/ editAction, removeAction]
});


Ext.onReady(function() {  

	Ext.define('Authorities', {
  	 extend: 'Ext.data.Model',
  	 fields: /*(G)*/vCENTER_FIELDS,
  	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/admnMgmt/auth.do?method=authread',
		            create: CONTEXT_PATH + '/admnMgmt/auth.do?method=authcreate',
		            update: CONTEXT_PATH + '/admnMgmt/auth.do?method=authcreate',
		            destroy: CONTEXT_PATH + '/admnMgmt/auth.do?method=authdestroy'
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
				model: 'Authorities',
				//remoteSort: true,
				sorters: [{
		            property: 'unique_id',
		            direction: 'DESC'
		        }]
			});
			
		 	store.load(function() {

		 		var selModel = Ext.create('Ext.selection.CheckboxModel', {
     			    listeners: {
     			        selectionchange: function(sm, selections) {
//     			        	grid.down('#removeButton').setDisabled(selections.length == 0);
     			        }
     			    }
     			} );
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
					        	//검색추가 삭제바.
					            dock: 'top',
					            xtype: 'toolbar',
					            items: [
					                    searchAction
					                    , '-',  addAction,  '-', editAction,'-',removeAction
					                    , '->'
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
					
				    grid.getSelectionModel().on({ // 체크박스 선택시 옆에 보이기
				        selectionchange: function(sm, selections) {
         		            if (selections.length) {
         						//grid info 켜기
         						displayProperty(selections[0]);
         						if(fPERM_DISABLING()==true) {
	         		            	removeAction.disable();
	         		            	editAction.disable();
//	         		            	resetAction.disable();
         						}else{
         							removeAction.enable();
             		            	editAction.enable();
//             		            	resetAction.enable();
         						}
//         						detailAction.enable();
         		            } else {
         		            	if(fPERM_DISABLING()==true) {
         		            		collapseProperty();//uncheck no displayProperty
	         		            	removeAction.disable();
	         		            	editAction.disable();
//	         		            	resetAction.disable();
         		            	}else{
         		            		collapseProperty();//uncheck no displayProperty
         		            		removeAction.disable();
             		            	editAction.disable();
//             		            	resetAction.disable();
         		            	}
//         		            	detailAction.enable();
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