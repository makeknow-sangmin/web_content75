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
    	
    	



    	var joblevelStore = Ext.create('Mplm.store.StanCodeJobLevelStore', {hasNull: false} );
    	var jobcodeStore1 = Ext.create('Mplm.store.StanCodeJobStore1', {hasNull: false} );
    	var jobcodeStore2 = Ext.create('Mplm.store.StanCodeJobStore2', {hasNull: false} );
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
                fieldLabel: getColName('job_level'),
                name: 'job_level',
 	            xtype: 'combo',
 	            store: joblevelStore,
                displayField:   'codeName',
                valueField:     'systemCode',
 	            typeAhead: false,
                 allowBlank: false,
	                listConfig:{
		                	getInnerTpl: function(){
		                		return '<div data-qtip="{systemCode}">{codeName}</div>';
		                	}	
	                },
	                listeners: {
 	                    select: function (combo, record) {
 	                    	console_log('Selected Value : ' + combo.getValue());
 	                    	var systemCode = record[0].get('systemCode');
 	                    	var codeNameEn  = record[0].get('codeNameEn');
 	                    	var codeName  = record[0].get('codeName');
 	                    	console_log('systemCode : ' + systemCode 
 	                    			+ ', codeNameEn=' + codeNameEn
 	                    			+ ', codeName=' + codeName	);
 	                    	var oJob_code_1 = Ext.getCmp('job_code_1');
 	                    	var oJob_code_2 = Ext.getCmp('job_code_2');
 	                    	var oJob_code_3 = Ext.getCmp('job_code_3');
 	                    	
 	                    	if(combo.getValue() == '1') {
 	                    		oJob_code_1.setDisabled(false);
 	                    		oJob_code_2.setDisabled(true);
 	                    		oJob_code_3.setDisabled(true);
 	                    	}
 	                    	else if(combo.getValue() == '2') {
 	                    		oJob_code_1.setDisabled(false);
 	                    		oJob_code_2.setDisabled(false);
 	                    		oJob_code_3.setDisabled(true);
 	                    	}
 	                    	else if(combo.getValue() == '3') {
 	                    		oJob_code_1.setDisabled(false);
 	                    		oJob_code_2.setDisabled(false);
 	                    		oJob_code_3.setDisabled(false);
 	                    	}
 	                    	
 	                    	
 	                    }
 	               }
            }
            ,{
            	fieldLabel: getColName('job_code_1'),
            	id: 'job_code_1',
                name: 'job_code_1',
 	            xtype: 'combo',
 	            store: jobcodeStore2,
                displayField:   'codeName',
                valueField:     'systemCode',
 	            typeAhead: false,
 	        	disabled:true,
 	        	editable:false,
                 allowBlank: false,
	                listConfig:{
		                	getInnerTpl: function(){
		                		return '<div data-qtip="{systemCode}">{codeName}</div>';
		                	}	
	                },
	                listeners: {
 	                    select: function (combo, record) {
 	                    	console_log('Selected Value : ' + combo.getValue());
 	                    	var systemCode = record[0].get('systemCode');
 	                    	var codeNameEn  = record[0].get('codeNameEn');
 	                    	var codeName  = record[0].get('codeName');
 	                    	console_log('systemCode : ' + systemCode 
 	                    			+ ', codeNameEn=' + codeNameEn
 	                    			+ ', codeName=' + codeName	);
 	                    }
 	               }
            },{
            	fieldLabel: getColName('job_code_2'),
            	id: 'job_code_2',
                name: 'job_code_2',
 	            xtype: 'combo',
 	            store: jobcodeStore2,
                displayField:   'codeName',
                valueField:     'systemCode',
 	            typeAhead: false,
 	           disabled:true,
 	          editable:false,
                 allowBlank: false,
	                listConfig:{
		                	getInnerTpl: function(){
		                		return '<div data-qtip="{systemCode}">{codeName}</div>';
		                	}	
	                },
	                listeners: {
 	                    select: function (combo, record) {
 	                    	console_log('Selected Value : ' + combo.getValue());
 	                    	var systemCode = record[0].get('systemCode');
 	                    	var codeNameEn  = record[0].get('codeNameEn');
 	                    	var codeName  = record[0].get('codeName');
 	                    	console_log('systemCode : ' + systemCode 
 	                    			+ ', codeNameEn=' + codeNameEn
 	                    			+ ', codeName=' + codeName	);
 	                    }
 	               }
            },{
            	fieldLabel: getColName('job_code_3'),
            	id: 'job_code_3',
                name: 'job_code_3',
 	            xtype: 'combo',
 	            store: jobcodeStore2,
                displayField:   'codeName',
                valueField:     'systemCode',
 	            typeAhead: false,
 	           editable:false,
 	           disabled:true,
                 allowBlank: false,
	                listConfig:{
		                	getInnerTpl: function(){
		                		return '<div data-qtip="{systemCode}">{codeName}</div>';
		                	}	
	                },
	                listeners: {
 	                    select: function (combo, record) {
 	                    	console_log('Selected Value : ' + combo.getValue());
 	                    	var systemCode = record[0].get('systemCode');
 	                    	var codeNameEn  = record[0].get('codeNameEn');
 	                    	var codeName  = record[0].get('codeName');
 	                    	console_log('systemCode : ' + systemCode 
 	                    			+ ', codeNameEn=' + codeNameEn
 	                    			+ ', codeName=' + codeName	);
 	                    }
 	               }
            },{
            	xtype: 'textarea',
            	fieldLabel: getColName('job_name'),
            	id: 'job_name',
            	name: 'job_name',
            	rows: 1
            },{
            	xtype: 'textarea',
            	fieldLabel: getColName('description'),
            	id: 'description',
            	name: 'description',
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
                	var jobcode = Ext.ModelManager.create(val, 'JobCode');
            		//저장 수정
                   	jobcode.save({
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
			
			JobCode.load(unique_id ,{
				 success: function(jobcode) {

				        var win = Ext.create('ModalWindow', {
				            title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 700,
				            height: 530,
				            minWidth: 250,
				            minHeight: 180,
				            layout: 'absolute',
				            plain:true,
				            items: createViewForm(jobcode),
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
			JobCode.load(unique_id ,{
				 success: function(jobcode) {
				        var win = Ext.create('ModalWindow', {
				            title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 700,
				            height: 500,
				            minWidth: 250,
				            minHeight: 180,
				            modal:true,
				            layout: 'absolute',
				            plain:true,
				            items: createEditForm(jobcode),
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
					                	var jobcode = Ext.ModelManager.create(val, 'JobCode');
					                   	form.submit({
					                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
					                        waitMsg: 'Uploading Files...',
					                        success: function(fp, o) {
								            		//저장 수정
								                   	jobcode.save({
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
};


function deleteConfirm(btn){

   var selections = grid.getSelectionModel().getSelection();
   if (selections) {
       var result = MessageBox.msg('{0}', btn);
       if(result=='yes') {       	
       	for ( var i = 0; i < selections.length; i++) {
       		var rec = selections[i];
       		var unique_id = rec.get('unique_id');
	           	 var jobcode = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'JobCode');
       		
	           	jobcode.destroy( {
	           		 success: function() {}
	           	});
          	
       	}
       	grid.store.remove(selections);
       }

   }
};

function createViewForm(jobcode) {
	var form = Ext.create('Ext.form.Panel', {
		id: 'formPanel',
		scroll:true,
       defaultType: 'displayfield',
       border: false,
       bodyPadding: 15,
       height: 750,
       defaults: {
    	   anchor: '100%',
           allowBlank: false,
           msgTarget: 'side',
           labelWidth: 100
       }
   }); //endof form
	
	return form;
}



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
   text: detail_text,
   disabled: true,
   handler: viewHandler
});
//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
   items: [ detailAction, editAction, removeAction  ]
});


Ext.onReady(function() {  

	Ext.define('JobCode', {
  	 extend: 'Ext.data.Model',
  	 fields: /*(G)*/vCENTER_FIELDS,
  	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/userMgmt/jobcode.do?method=read',
		            create: CONTEXT_PATH + '/userMgmt/jobcode.do?method=create',
		            update: CONTEXT_PATH + '/userMgmt/jobcode.do?method=create',
		            destroy: CONTEXT_PATH + '/userMgmt/jobcode.do?method=destroy'
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
				model: 'JobCode',
				sorters: [{
		            property: 'job_level',
		            direction: 'ASC'
		        },{
		            property: 'job_code',
		            direction: 'ASC'
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
				        		////grid info 켜기
				        		displayProperty(selections[0]);
				        		if(fPERM_DISABLING()==true) {
									removeAction.disable();
									editAction.disable();
									
								}else{
									removeAction.enable();
									editAction.enable();
								}
								detailAction.enable();
							} else {
								if(fPERM_DISABLING()==true) {
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

				    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
				        Ext.create('Ext.tip.ToolTip', config);
				    });
				    //callback for finishing.
				    cenerFinishCallback();
			}); //store load
});//OnReady
