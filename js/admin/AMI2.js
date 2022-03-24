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
            	xtype: 'textarea',
            	fieldLabel: getColName('var_name'),
            	id: 'var_name',
            	name: 'var_name',
            	rows: 1
            },{
            	xtype: 'textarea',
            	fieldLabel: getColName('var_value'),
            	id: 'var_value',
            	name: 'var_value',
            	rows: 10
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
                	var pcsmcfix = Ext.ModelManager.create(val, 'PcsMcfix');
            		//저장 수정
                   	pcsmcfix.save({
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


function createEditForm(pcsmcfix, attachedFileStore) {
	var unique_id = pcsmcfix.get('unique_id');
	
	var myItems = [];
	
	myItems.push({
	    value: unique_id,
	    name: 'unique_id',
       readOnly: true,
		fieldStyle: 'background-color: #E7EEF6; background-image: none;',
		anchor: '100%'  // anchor width by perce
	});

	
	var checkboxItem =[];
	attachedFileStore.each(function(record){
		console_log(record);
		console_log('----------------------------------------------');
		console_log(record.get('object_name'));
		console_log(record.get('id'));


		checkboxItem.push({
           xtype: 'checkboxfield',
           name: 'deleteFiles',
           boxLabel: record.get('object_name') + '(' + record.get('file_size') +')',
           checked: false,
           inputValue: record.get('id')
		});
	});
	
	if(checkboxItem.length > 0) {
	
		myItems.push({
	        xtype: 'checkboxgroup',
	        allowBlank: true,
	        fieldLabel: 'Check to Delete',
	        items:checkboxItem
	    });
	}
	
	
	myItems.push({
       xtype: 'filefield',
       emptyText: panelSRO1149,
       buttonText: 'upload',
       allowBlank: true,
       buttonConfig: {
           iconCls: 'upload-icon'
       },
       anchor: '100%'
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
	
	return form;
}

var viewHandler = function() {
			var rec = grid.getSelectionModel().getSelection()[0];
			var unique_id = rec.get('unique_id');
			
			PcsMcfix.load(unique_id ,{
				 success: function(pcsmcfix) {

				        var win = Ext.create('ModalWindow', {
				            title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 700,
				            height: 530,
				            minWidth: 250,
				            minHeight: 180,
				            layout: 'absolute',
				            plain:true,
				            items: createViewForm(pcsmcfix),
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
		
		var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {group_code: unique_id} );
		attachedFileStore.load(function() {
			console_log('attachedFileStore.load ok');
			
			PcsMcfix.load(unique_id ,{
				 success: function(pcsmcfix) {
				        var win = Ext.create('ModalWindow', {
				            title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 700,
				            height: 500,
				            minWidth: 250,
				            minHeight: 180,
				            modal:true,
				            layout: 'absolute',
				            plain:true,
				            items: createEditForm(pcsmcfix, attachedFileStore ),
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
					                	var pcsmcfix = Ext.ModelManager.create(val, 'PcsMcfix');
					                   	form.submit({
					                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
					                        waitMsg: 'Uploading Files...',
					                        success: function(fp, o) {
								            		//저장 수정
								                   	pcsmcfix.save({
								                		success : function() {
								                           	if(win) {	
								                           		win.close();
								                           		store.load(function() {});
								                           	} 
								                		}, failure : function(){
								                			win.close();
								                		}
								                	}); //endof save
					                        },
					                    	failure : function(){
					                    		console_log('failure');
					                    		Ext.MessageBox.alert(error_msg_prompt,'Failed');
					                    	}
					                 });
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
			
		});//endofattachedFileStore.load


	
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
	           	 var pcsmcfix = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'PcsMcfix');
       		
	           	pcsmcfix.destroy( {
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
   disabled: fPERM_DISABLING(),
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
   text: 'Detail',
   disabled: true,
   handler: viewHandler
});
//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
   items: [ detailAction, editAction, removeAction  ]
});


Ext.onReady(function() {  

	Ext.define('PcsMcfix', {
  	 extend: 'Ext.data.Model',
  	 fields: /*(G)*/vCENTER_FIELDS,
  	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/production/mcfix.do?method=read',
		            create: CONTEXT_PATH + '/production/mcfix.do?method=create',
		            update: CONTEXT_PATH + '/production/mcfix.do?method=create',
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
				model: 'PcsMcfix',
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
			            		removeAction.disable();
				            	editAction.disable();
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
