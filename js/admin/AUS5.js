//Ext.onReady(function() {  fDEF_CONTENT(); });
//표준공수코드 standard code 
//global var.
var grid = null;
var store = null;

var roleFields = [
             	    { name: 'role_code', type: "string"    }           
                   ,{ name: 'role_name', type: "string"    }           
];

function getCheckVal(arrUserType, value) {
	 for(var i=0; i<arrUserType.length; i++) {
		 if(value==arrUserType[i]) {
			 return true;
		 }
	 }
	 
	 return false;
}

var checkboxArray = new Array();  

var roleStore = new Ext.create('Ext.data.Store', {
 	fields:roleFields,
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/userMgmt/user.do?method=readRole',
         reader: {
         	type:'json',
             root: 'comboRole',
             totalProperty: 'count',
             successProperty: 'success'
         },
         autoLoad:false  
     }
 });


var roleCheckbox = [];








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
            	xtype: 'textarea',
            	fieldLabel: getColName('user_id'),
            	id: 'user_id',
            	name: 'user_id',
            	rows: 1
            },{
            	xtype: 'textarea',
            	fieldLabel: getColName('authority'),
            	id: 'authority',
            	name: 'authority',
            	rows: 1
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
                	var val = form.getValues(false);
                	var menumap = Ext.ModelManager.create(val, 'MenuMap');
            		//저장 수정
                   	menumap.save({
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


//function createEditForm(menumap/*, attachedFileStore*/) {
//	var unique_id = menumap.get('unique_id');
//	var struct = menumap.get('struct');
//	var child = menumap.get('child');
//	var menu_perm = menumap.get('menu_perm');
//	var arrmenu_perm = menu_perm.split('|');
//	var menu_parm1 = arrmenu_perm[0];
//		menu_parm1 = menu_parm1.replace('A:');
//	var menu_parm2 = arrmenu_perm[1];
//	if()
//		menu_parm2 = menu_parm1.replace('R:');
//	var arrmenu_perm1 = menu_parm1.split(',');
//	var arrmenu_perm2 = menu_parm2.split(',');
//	var roleItems = [];
//	roleStore.load(function(records) {
//    for(var i = 0; i < records.length; i++)
//    {
//    	roleItems.push ( { 
//        	checked: getCheckVal(arrmenu_perm1, records[i].data.role_code),
//             boxLabel: records[i].data.role_name,
//             name: 'menu_perm',
//             inputValue: records[i].data.role_code
//         });
//    }
//	
//	
//	
//	
//	var myItems = [];
//	
//	myItems.push({
//		fieldLabel: getColName('unique_id'),
//	    value: unique_id,
//	    //y: 0 + 1*lineGap,
//	    name: 'unique_id',
//       readOnly: true,
//		fieldStyle: 'background-color: #E7EEF6; background-image: none;',
//		anchor: '100%'  // anchor width by perce
//	});
//
//	myItems.push({
//		fieldLabel: '대메뉴',
//	    value: struct,
//	    //y: 0 + 1*lineGap,
//	    name: 'struct',
//       readOnly: true,
//		fieldStyle: 'background-color: #E7EEF6; background-image: none;',
//		anchor: '100%'  // anchor width by perce
//	});
//   
//	myItems.push({
//		fieldLabel: '그룹코드',
//		value: child,
//		//y: 0 + 1*lineGap,
//		name: 'child',
//		
//		readOnly: true,
//		fieldStyle: 'background-color: #E7EEF6; background-image: none;',
//		anchor: '100%'  // anchor width by perce
//	});
//	myItems.push({
//         xtype: 'container',
//          margin: '0 0 0',
////              x: 5,
////	             y: 0 + 3*lineGap,
//	             anchor: '-5',  // anchor width by percentage
//                 items: [{
//                 xtype: 'fieldset',
//                  flex: 1,
//                  title: aus1_user_type,
//                  defaultType: 'checkbox', // each item will be a checkbox
//                  layout: 'anchor',
//		             collapsible: true,
//                  defaults: {
//                      hideEmptyLabel: false
//                  },
//                  items: [	{
//                     xtype: 'checkboxgroup',
//                     columns: 2,
//                     items: roleItems
//              }]
//              }]	
//
//	});
//	
//
//	var form = Ext.create('Ext.form.Panel', {
//		id: 'formPanel',
//       defaultType:  'textfield',
//       border: false,
//       height: 500,
//       bodyPadding: 15,
//       defaults: {
//           anchor: '100%',
//           allowBlank: false,
//           msgTarget: 'side',
//           labelWidth: 100
//       },
//       items: myItems
//   }); //endof form
//	
//	return form;
//    });
//}

var viewHandler = function() {
			var rec = grid.getSelectionModel().getSelection()[0];
			var unique_id = rec.get('unique_id');
			
			MenuMap.load(unique_id ,{
				 success: function(menumap) {
					 

					 
					 
					 
					 
					 
					 
					 

				        var win = Ext.create('ModalWindow', {
				            title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 700,
				            height: 530,
				            minWidth: 250,
				            minHeight: 180,
				            layout: 'absolute',
				            plain:true,
				            items: createViewForm(menumap),
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
		var unique_id = rec.get('unique_id');
		
//		var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {group_code: unique_id} );
//		attachedFileStore.load(function() {
//			console_log('attachedFileStore.load ok');
			
			MenuMap.load(unique_id ,{
				 success: function(menumap) {
					 

						var unique_id = menumap.get('unique_id');
						var struct = menumap.get('struct');
						var child = menumap.get('child');
						var menu_perm = menumap.get('menu_perm');
						var arrmenu_perm = menu_perm.split('|');
						var menu_parm1 = arrmenu_perm[0];
						menu_parm1 = menu_parm1.replace('A:','');
						var menu_parm2 = arrmenu_perm[1];
						console_log('Selected menu_parm2 : ' + menu_parm2);
						if(menu_parm2!=undefined){
							menu_parm2 = menu_parm2.replace('R:','');
						}
						var arrmenu_perm1 = menu_parm1.split(',');
						var arrmenu_perm2 = '';
						if(menu_parm2!=undefined){
							arrmenu_perm2 = menu_parm2.split(',');
						}
						
						console_log('Selected arrmenu_perm1 : ' + arrmenu_perm1);
						console_log('Selected arrmenu_perm2 : ' + arrmenu_perm2);
						var roleItems = [];
						var roleItems2 = [];
						roleStore.load(function(records) {
					    for(var i = 0; i < records.length; i++)
					    {
					    	roleItems.push ( { 
					        	checked: getCheckVal(arrmenu_perm1, records[i].data.role_code),
					             boxLabel: records[i].data.role_name,
					             name: 'menu_perm',
					             inputValue: records[i].data.role_code
					         });
					    	roleItems2.push ( { 
					    		checked: getCheckVal(arrmenu_perm2, records[i].data.role_code),
					    		boxLabel: records[i].data.role_name,
					    		name: 'menu_perm2',
					    		inputValue: records[i].data.role_code
					    	});
					    }
						
						
						
						
						var myItems = [];
						
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
							fieldLabel: '대메뉴',
						    value: struct,
						    //y: 0 + 1*lineGap,
						    name: 'struct',
					       readOnly: true,
							fieldStyle: 'background-color: #E7EEF6; background-image: none;',
							anchor: '100%'  // anchor width by perce
						});
					   
						myItems.push({
							fieldLabel: '그룹코드',
							value: child,
							//y: 0 + 1*lineGap,
							name: 'child',
							
							readOnly: true,
							fieldStyle: 'background-color: #E7EEF6; background-image: none;',
							anchor: '100%'  // anchor width by perce
						});
						myItems.push({
					         xtype: 'container',
					          margin: '0 0 0',
//					              x: 5,
//						             y: 0 + 3*lineGap,
						             anchor: '-5',  // anchor width by percentage
					                 items: [{
					                 xtype: 'fieldset',
					                  flex: 1,
					                  title: '메뉴사용권한',
					                  defaultType: 'checkbox', // each item will be a checkbox
					                  layout: 'anchor',
							             collapsible: true,
					                  defaults: {
					                      hideEmptyLabel: false
					                  },
					                  items: [	{
					                     xtype: 'checkboxgroup',
					                     columns: 2,
					                     items: roleItems
					              }]
					              }]	

						});
						myItems.push({
							xtype: 'container',
							margin: '0 0 0',
//					              x: 5,
//						             y: 0 + 3*lineGap,
							anchor: '-5',  // anchor width by percentage
							items: [{
								xtype: 'fieldset',
								flex: 1,
								title: '읽기전용권한',
								defaultType: 'checkbox', // each item will be a checkbox
								layout: 'anchor',
								collapsible: true,
								defaults: {
									hideEmptyLabel: false
								},
								items: [	{
									xtype: 'checkboxgroup',
									columns: 2,
									items: roleItems2
								}]
							}]	
						
						});
						

						var form = Ext.create('Ext.form.Panel', {
							id: 'formPanel',
					       defaultType:  'textfield',
					       border: false,
					       height: 500,
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
				            width: 700,
				            height: 500,
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
					                	var menumap = Ext.ModelManager.create(val, 'MenuMap');
//					                   	form.submit({
//					                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
//					                        waitMsg: 'Uploading Files...',
//					                        success: function(fp, o) {
								            		//저장 수정
								                   	menumap.save({
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
						
					});

				 }//endofsuccess
			 });//endofpcsmcfixload
			
//		});//endofattachedFileStore.load


	
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
	           	 var menumap = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'MenuMap');
       		
	           	menumap.destroy( {
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
   items: [/* detailAction,*/ editAction/*, removeAction */ ]
});


Ext.onReady(function() {  

	Ext.define('MenuMap', {
  	 extend: 'Ext.data.Model',
  	 fields: /*(G)*/vCENTER_FIELDS,
  	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/admnMgmt/auth.do?method=read',
		            create: CONTEXT_PATH + '/admnMgmt/auth.do?method=create',
		            update: CONTEXT_PATH + '/admnMgmt/auth.do?method=create',
		            destroy: CONTEXT_PATH + '/production/mcfix.do?method=destroy'
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
				model: 'MenuMap',
				//remoteSort: true,
				sorters: [{
		            property: 'o.display_name_ko',
		            direction: 'ASC'
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
					                    , '-',  /*addAction,  '-',*/ editAction
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
//	         		            	removeAction.disable();
	         		            	editAction.disable();
//	         		            	resetAction.disable();
         						}else{
//         							removeAction.enable();
             		            	editAction.enable();
//             		            	resetAction.enable();
         						}
//         						detailAction.enable();
         		            } else {
         		            	if(fPERM_DISABLING()==true) {
         		            		collapseProperty();//uncheck no displayProperty
//	         		            	removeAction.disable();
	         		            	editAction.disable();
//	         		            	resetAction.disable();
         		            	}else{
         		            		collapseProperty();//uncheck no displayProperty
//         		            		removeAction.disable();
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
				    
				    roleStore.load(function(records) {
                        for(var i = 0; i < records.length; i++) {
                        	roleCheckbox.push(
                        		 {  name: 'menu_perm',
                                  inputValue: records[i].data.role_code,
                                  boxLabel : records[i].data.role_name}
                        		);
                        } 
                    }); 
				    //callback for finishing.
				    cenerFinishCallback();
			}); //store load
});//OnReady