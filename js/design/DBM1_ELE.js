var storeL = null;
var storeR = null;
var gridL = null;
var gridR = null;
var global = false;
var uid_srcahd=0;
var upload = true;
var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

var excel_sample = Ext.create('Ext.Action', {
	iconCls:'MSExcelTemplateX',
    text: GET_MULTILANG('dbm1_template'),
    handler: function(widget, event) {
    	var lang = vLANG;
    	switch(lang) {
				case 'ko':
					path='cab/ELE_BOM_Excel_Format_ko.xlsx'; //상대경로 사용
					break;
				case 'zh':
					path='cab/ELE_BOM_Excel_Format_zh.xlsx';
					break;
				case 'en':
					path='cab/ELE_BOM_Excel_Format_en.xlsx';
				break;
			}
    	window.location = CONTEXT_PATH + '/filedown.do?method=direct&path='+path;
    }
});


var lineGap =50;
function createEditForm(partline) {

	console_log('createEditForm');
	console_log(partline);
 
	var unique_uid = partline.get('unique_uid'); // partline.get('unique_id');
	var pl_no = partline.get("pl_no");
	var description = partline.get('description');
	var specification = partline.get('specification');
	var model_no = partline.get('model_no');


	var form = null;

		form = Ext.create(
						'Ext.form.Panel',
						{
							id : 'formPanel2',
							// layout: 'absolute',
							defaultType : 'textfield',
							border : false,
							bodyPadding : 15,
							defaults : {
								anchor : '100%',
								allowBlank : true,
								msgTarget : 'side',
								labelWidth : 60
							},
							items : [
									{
										fieldLabel : getColName('unique_id'),
										name : 'unique_uid',
										xtype : 'textfield',
										x : 5,
										y : 40 + 1 * lineGap,
										value : unique_uid,
										readOnly : true,
										fieldStyle : 'background-color: #E7EEF6; background-image: none;',
										anchor : '100%'
									},
									{
										fieldLabel : getColName('pl_no'),
										name : 'pl_no',
										xtype : 'textfield',
										x : 5,
										y : 40 + 2 * lineGap,
										value : pl_no,
										readOnly : true,
										fieldStyle : 'background-color: #E7EEF6; background-image: none;',
										anchor : '100%'
									},
									{
										
										fieldLabel : getColName('description'),
										x : 5,
										y : 40 + 3 * lineGap,
										name : 'description',
										id : 'description',
										allowBlank : true,
										readOnly : false,
										value : description,
										anchor : '-5' // anchor width by
									// percentage
									},
									{
										
										fieldLabel : getColName('specification'),
										x : 5,
										y : 40 + 4 * lineGap,
										name : 'specification',
										id : 'specification',
										allowBlank : true,
										readOnly : false,
										value : specification,
										anchor : '-5' // anchor width by
									// percentage
									},
			
									{
										fieldLabel : getColName('model_no'),
										x : 5,
										y : 40 + 5 * lineGap,
										name : 'model_no',
										id : 'model_no',
										allowBlank : true,
										readOnly : false,
										value : model_no,
										anchor : '-5' // anchor width by
									} ]
						});

	return form;
}


var editHandler = function() {
	console_log('in editHandler..');
	var rec = gridR.getSelectionModel().getSelection()[0];
	console_log(rec);
	var unique_id = rec.get('unique_uid');
	console_log(unique_id);
	PartLineR.load(unique_id,
					{
						success : function(partline) {
							if(partline==null || partline == undefined) {
								alert('not found PartLine...');
								return;
							}
							console_log("load...");
							var height = 280;
							var win = Ext.create(
											'ModalWindow',
											{
												title : CMD_MODIFY
														+ ' :: '
														+ /* (G) */vCUR_MENU_NAME,
												width : 700,
												height : height,
												minWidth : 250,
												minHeight : 180,
												layout : 'fit',
												plain : true,
												items : createEditForm(partline),
												buttons : [
														{
															text : CMD_OK,
															handler : function() {
				 												var form = Ext.getCmp('formPanel2').getForm();
			                				                    if(form.isValid())
			                				                    {
				                				                	var val = form.getValues(false);
				                				                	var partline = Ext.ModelManager.create(val, 'PartLineR');
				                				                	
				                				                	console_log('---------------------');
				                				                	console_log(partline);
				                				                	console_log('---------------------');
				                				                	
//				                				                	var partline = Ext.ModelManager.create({
//																		id : unique_id
//																	}, 'PartLineR');
				                				            		//저장 수정
				                				                	partline.save({
				                				                		 success : function() {
				                				                			//console_log('updated');
					                				                           if(win) 
					                				                           	{
					                				                           		win.close();
					                				                           		storeR.load(function() {});
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
														},
														{
															text : CMD_CANCEL,
															handler : function() {
																if (win) {
																	win.close();
																}
																// lfn_gotoHome();
															}
														} ]
											});
							win.show();
							// endofwin
						}// endofsuccess
					});// emdofload
};

var editAction = Ext.create('Ext.Action', {
	itemId : 'editButton',
	iconCls : 'pencil',
	text : edit_text,
	disabled : true,
//	    handler: function(widget, event) {
//		alert('editAction');
//    }
	
	
	
	handler : editHandler
});




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

function deleteConfirm(btn){
    var selections = gridR.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = gridR.getSelectionModel().getSelection()[i];
        		var unique_uid = rec.get('unique_uid');
	           	var partline = Ext.ModelManager.create({
	           		unique_uid : unique_uid
	        	 }, 'PartLineR');
	        
	           	partline.destroy( {
	           		 success: function() {}
	           	});
           	
        	}
        	gridR.store.remove(selections);
        }

    }
};


// Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
	items : [ /* addElecAction, */editAction, removeAction ]
});


var addEleExcel = Ext.create('Ext.Action', {
	itemId: 'addNxExcel',
    iconCls: 'MSExcelTemplateX',
    text: panelSRO1193,
    disabled: false,
    handler: function(widget, event) {
		 var form = Ext.create('Ext.form.Panel', {
			 id: 'formPanel',
	//					 layout: 'absolute',
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
				 xtype: 'filefield',
				 emptyText: panelSRO1149,
				 buttonText: 'upload',
				 allowBlank: true,
				 buttonConfig: {
					 iconCls: 'upload-icon'
				 },
				 anchor: '100%'
			 }]
		 });
		 
		 var win = Ext.create('ModalWindow', {
			 title: CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
			 width: 600,
			 height: 150,
			 layout: 'fit',
			 plain:true,
			 items: form,
			 buttons: [{
				 text: CMD_OK,
				 handler: function(){
					 
					 var form = Ext.getCmp('formPanel').getForm();
					 if(form.isValid())
					 {
						 if(win)
						 {
//							 var val = form.getValues(false);
							 ///********************파일첨부시 추가(Only for FileAttachment)**************
							 //alert('add Handler:' + /*(G)*/vFILE_ITEM_CODE);
							 /*(G)*/vFILE_ITEM_CODE = RandomString(10);
//							 val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;
//							 val["parent"] = selectedAssyUid;
//							 val["ac_uid"] = selectedMoldUid;
//							 val["coord_key2"] = selectedMoldCoord;
//							 val["menu"] = vCUR_MENU_CODE;
//							 val["pj_code"] = selectedPj_code;
//							 var nxExcel = Ext.ModelManager.create(val, 'NxExcel');
							 form.submit({
								 url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
								 waitMsg: 'Uploading Files...',
								 success: function(fp, o) {
									 console_log('success');
											 
									 Ext.Ajax.request({
											url: CONTEXT_PATH + '/design/upload.do?method=excelELEBom',				
											params:{
												file_itemcode : vFILE_ITEM_CODE,
												menu : vCUR_MENU_CODE,
												pj_uid : selectedMoldUid
												
											},
											waitMsg: 'Parsing Files...',
											success : function(result, request) {
												
												var msg = result.responseText;
												console_log(msg);
//												alert(msg);
													win.close();

													Ext.MessageBox.show({
										            title: 'Result',
										            multiline: true,
										            value: msg,
										            height: 100,
										            width: 200,
										            buttons: Ext.MessageBox.YES
										        });
//												
//												storeR.getProxy().setExtraParam('not_standard_flag', 'A');
//												storeR.getProxy().setExtraParam('standard_flag', 'E');
//												storeR.getProxy().setExtraParam('excel_check','OK');
//												storeR.load(function() {});
											},
											failure: extjsUtil.failureMessage
									 });
								 },
								 failure : function(){
									 console_log('failure');
									 Ext.MessageBox.alert(error_msg_prompt,'Failed');
								 }
							 });
						 }
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


Ext.onReady(function() {
	LoadJs('/js/util/comboboxtree.js');
	
	Ext.define('PartLineL', {
		 extend: 'Ext.data.Model',
		 fields: vCENTER_FIELDS_SUB,
		    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/design/bom.do?method=read'
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
	
	storeL = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PartLineL',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
	Ext.define('PartLineR', {
		 extend: 'Ext.data.Model',
		 fields: vCENTER_FIELDS,
		    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/design/bom.do?method=read',
		            create: CONTEXT_PATH + '/design/bom.do?method=updateElectrode',
		            update: CONTEXT_PATH + '/design/bom.do?method=updateElectrode',
		            destroy: CONTEXT_PATH + '/design/bom.do?method=deleteElectorde' 		
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
	
	storeR = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PartLineR',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
	storeL.getProxy().setExtraParam('not_standard_flag', 'A');
	storeL.getProxy().setExtraParam('ele_standard_flag', 'E');
	storeL.getProxy().setExtraParam('menu_code', vCUR_MENU_CODE);
	storeL.load(function() {
		gridL = Ext.create('Ext.grid.Panel', {
			id: 'gridL',
			title: 'ELE BOM',
			store: storeL,
			collapsible: false,
			split: true,
			stateId: 'stateGrid'+ vCUR_MENU_CODE,
			region: 'west',
	        width: '42%',
	        height: getCenterPanelHeight(),
	        bbar: getPageToolbar(storeL),	        
	        dockedItems: [{
	        	xtype: 'toolbar',
		      	items: getProjectTreeToolbar() 
	        }],
	        columns: vCENTER_COLUMN_SUB,
	        viewConfig: {
	            stripeRows: true,
	            enableTextSelection: true,
	            getRowClass: function(record) { 
			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
	            } ,
	            listeners: {
	                itemcontextmenu: function(view, rec, node, index, e) {
	                    e.stopEvent();
	                    return false;
	                }
	            }
	        },
			title: getMenuTitle()
	    });
		
		gridL.getSelectionModel().on({
		    selectionchange: function(sm, selections){
		    	if(global==false){
		    		var rec = gridL.getSelectionModel().getSelection()[0];
		    		console_log(rec);
		    		if (selections.length) {
		    			addEleExcel.enable();
		    			uid_srcahd=rec.get('unique_id');
		    			storeR.getProxy().setExtraParam('uid_srcahd',uid_srcahd);
		    			storeR.getProxy().setExtraParam('standard_flag','E');
		    			storeR.load({});
		    		}else{
		    			addEleExcel.disable();
		    		}
		    	}
		    }
		});

		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false});
		Ext.each(vCENTER_COLUMNS, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			if(dataIndex!='no') {
				if('description' == dataIndex) {
					columnObj["editor"] = {
	                };	
				}
				if('specification' == dataIndex) {
					columnObj["editor"] = {
	                };	
				}
				if('model_no' == dataIndex) {
					columnObj["editor"] = {
	                };	
				}
			}
		});
		
		gridR = Ext.create('Ext.grid.Panel', {
			id : 'tempport',
			title: 'ELE BOM',
			store: storeR,
			collapsible: false,
			split: true,
			stateId: 'stateGridBom'+ vCUR_MENU_CODE,
	        selModel: selModel,
	        region: 'east',
	        width:'58%',
	        height: getCenterPanelHeight(),
	        bbar: getPageToolbar(storeR),	        
	        dockedItems: [{
	        	xtype: 'toolbar',
		      	items: [
		      	        {
		      	        	xtype: 'checkboxfield',
							id: 'all_ele',
							fieldLabel: 'All',
							labelWidth: 20,
							listeners:{
								change:function(checkbox, checked){
									global=checked;
									if(checked==true){
										console_log('in 1');
										storeR.getProxy().setExtraParam('ac_uid',selectedMoldUid);
										storeR.getProxy().setExtraParam('uid_srcahd',-1);
										storeR.getProxy().setExtraParam('standard_flag','E');
									}else{
										var rec = gridL.getSelectionModel().getSelection()[0];
								        if (rec != undefined) {
								        	console_log('in 2');
								        	addEleExcel.enable();
								        	var uid_srcahd=rec.get('unique_id');
								        	storeR.getProxy().setExtraParam('uid_srcahd',uid_srcahd);
								        }else{
								        	console_log('in 3');
								        	storeR.getProxy().setExtraParam('standard_flag','FALSE');
								        }
									}
									storeR.load({});
								}
							}
		      	        },'-', 
					addEleExcel,
					'-',
					removeAction,'-',
					
					
					'->',excel_sample
//		      	      {
//	                    text: panelSRO1133,
//	                    iconCls: 'save',
//	                    disabled: fPERM_DISABLING(),
//	                    handler: function ()
//	                    {
//	                          for (var i = 0; i <gridR.store.data.items.length; i++)
//	                          {
//	                                var record = gridR.store.data.items [i];
//	                                if (record.dirty) { 
//	                                	storeR.getProxy().setExtraParam('uid_srcahd', uid_srcahd);
//	                                	record.save({
//	        		                		success : function() {
//	        		                			storeR.getProxy().setExtraParam('id','');
//	        		                			storeR.getProxy().setExtraParam('uid_srcahd',uid_srcahd);
//	        		        		        	storeR.getProxy().setExtraParam('standard_flag','E');
//	        		                			storeR.load(function() {});
//	        		                		}
//	        		                	 });
//	                                }
//	                          }
//	                    }
//		      	      }
		      	]
	        }],
	        columns: vCENTER_COLUMNS,
//	        plugins: [cellEditing],
	        viewConfig: {
	            stripeRows: true,
	            enableTextSelection: true,
	            getRowClass: function(record) { 
			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
	            } ,
	            listeners: {
	                itemcontextmenu: function(view, rec, node, index, e) {
	                    e.stopEvent();
						contextMenu.showAt(e.getXY());
	                    return false;
	                }
	            }
	        },
			title: getMenuTitle()
	    });
		
		gridR.getSelectionModel().on({
		    selectionchange: function(sm, selections){
		        if (selections.length) {
	            	if(fPERM_DISABLING()==true){
	            		removeAction.disable();	
	            		editAction.disable();
	            	}else{
	            		removeAction.enable();	
	            		editAction.enable();
	            		
	            	}
		        }else{
	            	if(fPERM_DISABLING()==true){
	            		removeAction.disable();	
	            		editAction.disable();
	            	}else{
	            		removeAction.disable();	
	            		editAction.disable();
	            	}
		        }
		    }
		});
		
		/*var main =  Ext.create('Ext.panel.Panel', {
			height: getCenterPanelHeight(),
			layout: {
				type: 'border'
			},
			border: false,
	        layoutConfig: {columns: 2, rows:1},
		    defaults: {
		        split: false
		    },
			items: [gridL, gridR]
		});
		fLAYOUT_CONTENT(main);*/  
		fLAYOUT_CONTENTMulti([gridL,gridR]); 
	});
	cenerFinishCallback();
});