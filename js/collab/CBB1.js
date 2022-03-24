/**
 * CBB1 : Board
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
		var bHeight = 470;
		
    	var inputItem= [];
    	if(vSYSTEM_TYPE=='B2B') {
    		var boardGubunStore = Ext.create('Mplm.store.BoardGubunStore', {} );
    		bHeight = 520;
    		inputItem.push(
			    		{
			    			xtype:          'combo',
			                mode:           'local',
			                triggerAction:  'all',
			                value:          'private',
			                forceSelection: true,
			                editable:       false,
			                allowBlank: false,
			                name:           'gubun',
			                displayField:   'codeName',
			                valueField:     'systemCode',
			                queryMode: 'remote',
			                store:  boardGubunStore,
			                listConfig:{
			                	getInnerTpl: function(){
			                		return '<div data-qtip="{codeName}">[{systemCode}] {codeName}</div>';
			                	}			                	
			                },
			                listeners: {
	   	   	                    select: function (combo, record) {
	   	   	                    	
	   	   	                    }
			                }
			    		}		
    		);
    	}else {
    		var boardGubunStore = Ext.create('Mplm.store.BoardGubunStore', {} );
    		bHeight = 520;
    		inputItem.push(
    				{
    					xtype:          'combo',
    					mode:           'local',
    					triggerAction:  'all',
    					value:          'private',
    					forceSelection: true,
    					editable:       false,
    					allowBlank: false,
    					name:           'gubun',
    					displayField:   'codeName',
    					valueField:     'systemCode',
    					queryMode: 'remote',
    					store:  boardGubunStore,
    					listConfig:{
    						getInnerTpl: function(){
    							return '<div data-qtip="{codeName}">[{systemCode}] {codeName}</div>';
    						}			                	
    					},
    					listeners: {
    						select: function (combo, record) {
    							
    						}
    					}
    				}		
    		);
    	}
    	
    	inputItem.push(
    	
	    	 {
	             //fieldLabel: 'board_title',
	             //x: 5,
	    		 emptyText: 'Subject',
	             y: 0 + 1*lineGap,
	             name: 'board_title',
	             anchor: '100%'  // anchor width by percentage
	         }
    	 );
    	 
    	inputItem.push(
    	 {
             //fieldLabel: 'board_content.',
             //x: 5,
             //y: 0 + 2*lineGap,
             name: 'board_content',
             xtype: 'htmleditor',
             height: 300,
             anchor: '100%'
    	 });
    	
    	inputItem.push(
        {
            //y: 0 + 3*lineGap,
            xtype: 'filefield',
            emptyText: panelSRO1149,
            buttonText: 'upload',
            allowBlank: true,
            buttonConfig: {
                iconCls: 'upload-icon'
            },
            anchor: '100%'
        });
    	inputItem.push(
    	        {
    	            //y: 0 + 4*lineGap,
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
    		id: 'formPanelCbb1',
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
             items: inputItem
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 700,
            height: bHeight,
            minWidth: 250,
            minHeight: 180,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanelCbb1').getForm();
                    if(form.isValid())
                    {
                	var val = form.getValues(false);
///********************파일첨부시 추가(Only for FileAttachment)**************
                	//alert('add Handler:' + /*(G)*/vFILE_ITEM_CODE);
                	/*(G)*/vFILE_ITEM_CODE = RandomString(10);
                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
                	var title = func_replaceall(val["board_title"], " ","");
                	var title_count = val["board_title"].length;
                	console_info('title_count : '+title_count);
                	if(title == ""){
                		Ext.MessageBox.alert(error_msg_prompt,'not valid title');
                	}else{
	
	                    var board = Ext.ModelManager.create(val, 'Board');
	                	console_log('staring');
	                   	form.submit({
	                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
	                        waitMsg: 'Uploading Files...',
	                        success: function(fp, o) {
	                        	console_log('success');
	                          	 //console_log(o.result.datas[0].first + ':' + o.result.datas[0].second);
		                       	board.save({
		                       		success: function() {
		                               	if(win) 
		                               	{
		                               		win.close();
		                               		store.load(function() { });
		                               		
		                               	} 
		    
		                    		},
	                                failure: function (rec, op)  {
	                               	 console_log(rec);
	                               	 console_log(op);
	                               	 msg('Fail', rec);
	                                }
		                    	 });
		                       	
		                            //msg('Success', 'Processed file "' + o.result.file + '" on the server');
		                        },
		                    	failure : function(){
		                    		console_log('failure');
		                    		Ext.MessageBox.alert(error_msg_prompt,'Failed');
		                    	}
		                 });
		                    
	                   	
	                	}
                	
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {
            			win.close();
            		}
 

            	}
            }]
        });
        win.show();
     }
});

function createViewForm(board) {
	//Ext.MessageBox.alert('Find Board', "unique_id : " + board.get('unique_id'));
	
	var lineGap = 30;
 	var unique_id = board.get('unique_id');
	var user_id = board.get('user_id');
	var board_email = board.get('board_email'  );
	var board_title = board.get('board_title' );
	var board_content = board.get('board_content' );
	var htmlFileNames = board.get('htmlFileNames' );
	var fileQty = board.get('fileQty' );
	//alert(fileQty);
	//alert(htmlFileNames);
	var form = Ext.create('Ext.form.Panel', {
		id: 'formPanelCbb1',
        //layout: 'absolute',
        defaultType: 'displayfield',
        border: false,
        bodyPadding: 15,
        height: 650,
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 100
        },
        items: [{
			fieldLabel: getColName('unique_id'),
			value: unique_id,
//			x: 5,
//			y: 0 + 1*lineGap,
			name: 'unique_id',
			anchor: '-5'  // anchor width by percentage
			},{
			fieldLabel: getColName('user_id'),
			value: user_id,
//			x: 5,
//			y: 0 + 2*lineGap,
			 name: 'user_id',
			anchor: '-5'  // anchor width by percentage
			},{
		    	fieldLabel: getColName('board_email'),
		    	value: board_email,
//		    	x: 5,
//		    	y: 0 + 3*lineGap,
		    	name: 'board_email',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('board_title'),
		    	value: board_title,
//		    	x: 5,
//		    	y: 0 + 4*lineGap,
		    	name: 'board_title',
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('htmlFileNames'),
		    	value: htmlFileNames,
//		    	x: 5,
//		    	y: 0 + 9*lineGap,
		    	name: 'htmlFileNames',
		    	anchor: '-5'  // anchor width by percentage
		    },{
                y: 0 + 5*lineGap,
                value: board_content,
                name: 'board_content',
                //xtype: 'htmleditor',
                fieldStyle: 'height:320; overflow:scroll ;overflow-x:hidden; background-color: #EAEAEA; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                height: 300,
                readOnly: true,
                anchor: '100%'
            }  
		    ]
    }); //endof form
	
	return form;
}

function createEditForm(board, attachedFileStore) {
 	var unique_id = board.get('unique_id');
	var board_title = board.get('board_title' );
	var board_content = board.get('board_content' );
//	var htmlFileNamesDel = '<label>[Check to Delete]</label>&nbsp;' + board.get('htmlFileNamesDel' );
	
	var myItems = [];
	
	myItems.push({
	    value: unique_id,
	    //y: 0 + 1*lineGap,
	    name: 'unique_id',
        readOnly: true,
		fieldStyle: 'background-color: #E7EEF6; background-image: none;',
		anchor: '100%'  // anchor width by perce
	});
	myItems.push({
        value: board_title,
        //y: 0 + 2*lineGap,
        name: 'board_title',
        anchor: '100%'  // anchor width by perce
	});
	myItems.push({
        value: board_content,
        name: 'board_content',
        xtype: 'htmleditor',
        height: 300,
        anchor: '100%'
	});
//	myItems.push({
//        value: htmlFileNamesDel,
//        xtype: 'displayfield',
//        anchor: '100%'
//	});
	
	var checkboxItem =[];
	attachedFileStore.each(function(record){
		console_log(record);
		console_log('----------------------------------------------');
		console_log(record.get('object_name'));
		console_log(record.get('id'));
		console_log(record.get('group_code'));
		console_log(record.get('file_path'));
		console_log(record.get('file_size'));
		console_log(record.get('fileobject_uid'));
		console_log(record.get('file_ext'));

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
	        //cls: 'x-check-group-alt',
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
		id: 'formPanelCbb1',
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
			
			Board.load(unique_id ,{
				 success: function(board) {

				        var win = Ext.create('ModalWindow', {
				            title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 700,
				            height: 530,
				            minWidth: 250,
				            minHeight: 180,
				            layout: 'absolute',
				            plain:true,
				            items: createViewForm(board),
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
	/*(G)*/vFILE_ITEM_CODE = RandomString(10);
	
		var rec = grid.getSelectionModel().getSelection()[0];
		var unique_id = rec.get('unique_id');
		
		var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {group_code: unique_id} );
		attachedFileStore.load(function() {
			console_log('attachedFileStore.load ok');
			
			Board.load(unique_id ,{
				 success: function(board) {
//						uploadStore = getUploadStore(unique_id);
//						uploadStore.load(function() {
//							console_log('uploadStore.load ok');
//							console_log(uploadStore);
//							uploadStore.each(function(record){
//								console_log(record.get('object_name'));
//							});

				        var win = Ext.create('ModalWindow', {
				            title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				            width: 700,
				            height: 500,
				            minWidth: 250,
				            minHeight: 180,
				            modal:true,
				            layout: 'absolute',
				            /*layout: {
				                type: 'border',
				                padding: 0
				            },
				            */
				            plain:true,
				            items: createEditForm(board, attachedFileStore ),
				            buttons: [{
				                text: CMD_OK,
				            	handler: function(){
				                    
				            		var form = Ext.getCmp('formPanelCbb1').getForm();
				                                    	
				                    if(form.isValid())
				                    {
					                	var val = form.getValues(false);
					                	///********************파일첨부시 추가(Only for FileAttachment)**************
					                	val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
					                	///********************파일첨부시 추가(Only for FileAttachment)**************
					                	var board = Ext.ModelManager.create(val, 'Board');
					                   	form.submit({
					                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
					                        waitMsg: 'Uploading Files...',
					                        success: function(fp, o) {
								            		//저장 수정
								                   	board.save({
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
//					});
//						

				 }//endofsuccess
			 });//endofboardload
			
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
	           	 var board = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'Board');
        		
	           	board.destroy( {
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

	
	var searchField = [];
	
	if(vSYSTEM_TYPE=='B2B') {
		searchField.push (
		{
			field_id: 'gubun'
			,store: 'BoardGubunStore'
			,displayField: 'codeName'
			,valueField: 'systemCode'
			,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName}</div>'
		});
	} else {
		searchField.push (
				{
					field_id: 'gubun'
						,store: 'BoardGubunStore'
							,displayField: 'codeName'
								,valueField: 'systemCode'
									,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName}</div>'
				});
	}
	
	searchField.push('unique_id');
	searchField.push('board_title');
	searchField.push('board_name');
	searchField.push('user_id');
	
	makeSrchToolbar(searchField);
	
	//console_info(/*(G)*/vCENTER_FIELDS);
	
	Ext.define('Board', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/admin/board.do?method=read',
		            create: CONTEXT_PATH + '/admin/board.do?method=create',
		            update: CONTEXT_PATH + '/admin/board.do?method=create',
		            destroy: CONTEXT_PATH + '/admin/board.do?method=destroy'
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
				model: 'Board',
				//remoteSort: true,
				sorters: [{
		            property: 'unique_id',
		            direction: 'DESC'
		        }]
			});
			
		 	store.load(function() {

		 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: true} );
		 		
					//alert(getCenterPanelHeight() + ':' + getPageSize() );
					
		 		
		 	// add a paging toolbar to the grid's footer
					grid = Ext.create('Ext.grid.Panel', {
					        store: store,
					        ///COOKIE//stateful: true,
					        collapsible: true,
					        multiSelect: true,
					        selModel: selModel,
					        height: getCenterPanelHeight(), 
					        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
					        autoScroll : true,
					        autoHeight: true,
					        //width: '100%',
					        
					        bbar: getPageToolbar(store),
					        
					        dockedItems: [{
					            dock: 'top',
					            xtype: 'toolbar',
					            items: [
					                    searchAction
					                    , '-',  addAction,  '-', removeAction
					                    , '->'
//			      				      ,printExcel
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
														//el.setStyle("color", 'black');
														//el.setStyle("background", '#ff0000');
														//el.setStyle("font-size", '12px');
														//el.setStyle("font-weight", 'bold');
								
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
					        //,renderTo: Ext.getCmp('mainview-content-panel').body  //'MAIN_DIV_TARGET'

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

//Ext.override(Ext.form.HtmlEditor, {
//onDisable: function(){
//	if(this.rendered){
//		this.wrap.mask();
//	}
//	Ext.form.HtmlEditor.superclass.onDisable.call(this);
//},
//onEnable: function(){
//	if(this.rendered){
//		this.wrap.unmask();
//	}
//	Ext.form.HtmlEditor.superclass.onEnable.call(this);
//}
//});
     
