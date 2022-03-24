/****
 *  USE document/DDW2.js
 */
////*****************************GLOBAL VARIABLE**************************/
//
//var grid = null;
//var store = null;
//
//var gPath='/';
//var gSelectedPjCode = 'root';
//
//var searchAction = Ext.create('Ext.Action', {
//	itemId: 'searchButton',
//    iconCls: 'search',
//    text: CMD_SEARCH,
//    disabled: false ,
//    handler: searchHandler
//});
//
//function doCreateFolder(btn, text){
//	
//	if(btn=='ok' && text!=null) {
//		var folderName = Ext.util.Format.trim(text);
//		if(folderName!='') {
//			store.getProxy().setExtraParam('path', Ext.JSON.encode(gPath));
//			store.getProxy().setExtraParam('newFolder', Ext.JSON.encode(folderName));
//			
//			store.load({});
//		}
//		
//	}
//
//};
//
//var addFolderAction = Ext.create('Ext.Action', {
//	iconCls:'add',
//    text: 'New Folder',
//    disabled:fPERM_DISABLING(),
//    handler: function(widget, event) {
//    	Ext.MessageBox.prompt('New Folder', 'Enter Folder Name:', doCreateFolder);
//    }
//});
//
//var removeFolderAction = Ext.create('Ext.Action', {
//	iconCls: 'remove',
//    text: 'Folder ' + CMD_DELETE,
//    disabled: true,
//    handler: function(widget, event) {
//    	Ext.MessageBox.show({
//            title:delete_msg_title,
//            msg: delete_msg_content,
//            buttons: Ext.MessageBox.YESNO,
//            fn: deleteFolderConfirm,
//            //animateTarget: 'mb4',
//            icon: Ext.MessageBox.QUESTION
//        });
//    }
//});
//
//var uploadFileAction = Ext.create('Ext.Action', {
//	iconCls: 'upload-icon',
//    text: 'Upload',
//    disabled:fPERM_DISABLING(),
//    handler: function(widget, event) {
//    	var form = Ext.create('Ext.form.Panel', {
//    		id: 'formPanel',
//            defaultType: 'textfield',
//            border: false,
//            bodyPadding: 15,
//            region: 'center',
//            defaults: {
//                anchor: '100%',
//                allowBlank: false,
//                msgTarget: 'side',
//                labelWidth: 100
//            },
//             items: [{
// 	            //y: 0 + 4*lineGap,
// 	            xtype: 'filefield',
// 	            emptyText: panelSRO1149,
// 	            buttonText: 'upload',
// 	            allowBlank: true,
// 	            buttonConfig: {
// 	                iconCls: 'upload-icon'
// 	            },
// 	            anchor: '100%'
// 	        }]
//        });//endofform
//        var win = Ext.create('ModalWindow', {
//            title: CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
//            width: 500,
//            height: 130,
//            items: form,
//            buttons: [{
//                text: CMD_OK,
//            	handler: function(){
//                    var form = Ext.getCmp('formPanel').getForm();
//                    if(form.isValid()) {
//                    	
//		                   	form.submit({
//		                        url: CONTEXT_PATH + '/supercom.do?method=ftpUpload&remotepath=' + gPath,
//		                        waitMsg: 'Uploading Files...',
//		                        success: function(fp, o) {
//		                        	win.close();
//	                           		store.load(function() { });
//		                        }
//		                   	});
//	                   	
//	                   }
//                  }//endof handler
//            },{
//                text: CMD_CANCEL,
//            	handler: function(){
//            		if(win) {win.close();}
//            	}//endof hanler
//            }//endofcancel
//            ]//endofbuttons
//        });//endofwin
//        win.show();
//    }//endof handler
//});
//
////
////
////var uploadAction = Ext.create('Ext.Action', {
////	iconCls:'add',
////    text: 'Upload',
////    disabled:fPERM_DISABLING(),
////    handler: function(widget, event) {
////    	
////    }
////});
//
//function lfn_setFolderCall(folder){
//	store.getProxy().setExtraParam('path', Ext.JSON.encode(folder));
//	
//	store.load({});
//}
//
//function deleteFolderConfirm(btn){
//
//    var selections = grid.getSelectionModel().getSelection();
//    if (selections) {
//        var result = MessageBox.msg('{0}', btn);
//        var count = 0;
//        if(result=='yes') {
//        	var fileNames = [];
//        	
//        	for(var i=0; i< selections.length; i++) {
//        		var rec = selections[i];
//        		var name = Ext.JSON.encode(rec.get('name') );
//        		fileNames.push(name);
//        		count++;
//        	}
//        	Ext.Ajax.request({
//    			url: CONTEXT_PATH +  '/supercom.do?method=deleteFolder',
//    			params:{
//    				path : Ext.JSON.encode(gPath),
//    				fileNames : fileNames
//    			},
//    			success : function(result, request) {
//    	        	store.load(function() {});
//    			},
//    			failure: extjsUtil.failureMessage
//    		});
//
//        }
//    }
//};
//
//function deleteConfirm(btn){
//
//    var selections = grid.getSelectionModel().getSelection();
//    if (selections) {
//        var result = MessageBox.msg('{0}', btn);
//        var count = 0;
//        if(result=='yes') {
//        	var fileNames = [];
//        	
//        	for(var i=0; i< selections.length; i++) {
//        		var rec = selections[i];
//        		var name = Ext.JSON.encode(rec.get('name') );
//        		fileNames.push(name);
//        		count++;
//        	}
//        	Ext.Ajax.request({
//    			url: CONTEXT_PATH +  '/supercom.do?method=delete',
//    			params:{
//    				path : Ext.JSON.encode(gPath),
//    				fileNames : fileNames
//    			},
//    			success : function(result, request) {
//    	        	store.load(function() {});
//    			},
//    			failure: extjsUtil.failureMessage
//    		});
//
//        }
//    }
//};
//
//
//function lfn_Download(fileName) {
//	
//	var file_name = Ext.JSON.encode(fileName);
//	
//	window.location = CONTEXT_PATH + '/supercom.do?method=download&path='
//	+ Ext.JSON.encode(gPath) + "&fileName=" + file_name
//	;
//
//
//}
//
//function getMenuPath(path) {
//
//	var pathArray = path.split("/");
//	
//	//var linkStr = '<span><a class=btn href="#" onclick="javascript:lfn_setFolderCall(\'/\'); return false;">' + gSelectedPjCode + '</a></span> / ';
//	var linkStr = ' / ';
//
//	var pathStr = "/";
//	for(var i=0; i<pathArray.length; i++) {
//		if( pathArray[i].length>0)
//			{
//				if(i>0) {
//					pathStr = pathStr +  pathArray[i] + "/";
//				}
//				var link = '<span><a class=btn href="#" onclick="javascript:lfn_setFolderCall(\''   + pathStr +   '\'); return false;">' + pathArray[i]  + '</a></span>';
//
//				if(i<3) {
//					link = pathArray[i];
//				}
//				
//				if(i>0) {
//					linkStr = linkStr + link + ' / ';
//				}
//				
//			}
//	}
//	return linkStr;
//}
//
////*****************************MODEL**************************/
//
//Ext.define('FtpFile', {
//	 extend: 'Ext.data.Model',
//	 fields: /*(G)*/vCENTER_FIELDS
//	 ,
//	    proxy: {
//			type: 'ajax',
//	        api: {
//	        	read: CONTEXT_PATH + '/supercom.do?method=projectRepo', 					/*1recoed, search by cond, search */
//	            create: CONTEXT_PATH + '/supercom.do?method=createFolder', 			/*create record, update*/
//	            update: CONTEXT_PATH + '/supercom.do?method=updateFile',
//	            destroy: CONTEXT_PATH + '/supercom.do?method=destroyFile' 			/*delete*/
//	        },
//			reader: {
//				type: 'json',
//				root: 'datas',
//				totalProperty: 'count',
//				successProperty: 'success',
//				metaProperty: 'metaData'
//			},
//			writer: {
//	            type: 'singlepost',
//	            writeAllFields: false,
//	            root: 'datas'
//	        } 
//		}
//});
//
////Define Remove Action
//var removeAction = Ext.create('Ext.Action', {
//	itemId: 'removeButton',
//    iconCls: 'remove',
//    text: CMD_DELETE,
//    disabled: true,
//    handler: function(widget, event) {
//    	Ext.MessageBox.show({
//            title:delete_msg_title,
//            msg: delete_msg_content,
//            buttons: Ext.MessageBox.YESNO,
//            fn: deleteConfirm,
//            //animateTarget: 'mb4',
//            icon: Ext.MessageBox.QUESTION
//        });
//    }
//});
//
//
////Context Popup Menu
//var contextMenu = Ext.create('Ext.menu.Menu', {
//    items: [ removeAction, removeFolderAction ]
//});
//
//
//Ext.onReady(function() {  
//
//
//	LoadJs('/js/util/comboboxtree.js');
//		    
//    	//FtpFile Store 정의
//    store = new Ext.data.Store({  
//    		pageSize: getPageSize(),
//    		model: 'FtpFile',
//    		//remoteSort: true,
//    		sorters: [{
//                property: 'name',
//                direction: 'DESC'
//            }]
//	    	,listeners: 
//	    	{
////	            beforeload: function (store, operation, eOpts) {
////	                    //console_log('FtpFile store fn beforeload');
////	            },
////	            load: function (store, records, successful, eOpts) {
////	                    //self.getProxy().setExtraParam('depChange', 0);
////	                	//console_log('FtpFile store fn load');
////	                	store.getProxy().setExtraParam('newFolder', null);
////	            },
//	    		metachange: function (store, meta, eOpts) {
//	                 	//console_log('###################################');
//	                    //console_log(
//	                    //		"logonDir: " + meta.logonDir
//	                   // 		+ ", pjUid: " + meta.pjUid
//	                   // 		+ ", path: " + meta.path
//	                   // );   
//	    			store.getProxy().setExtraParam('newFolder', null);
//	    			store.getProxy().setExtraParam('fileName', null);
//	    			
//	                    gPath = meta.path;
//	        			var linkStr =getMenuPath(gPath);
//	        			var callPath = Ext.getCmp('callPath');
//	        			callPath.update(linkStr);
//	             }
//	             
//	    	}
//
//    	});
//
//	Ext.each(vCENTER_COLUMNS, function(obj, index) {
//		//console_log(obj);
//		//var text = obj['text'];
//		var dataIndex = obj['dataIndex'];
//		
//		if(dataIndex=='name') {
//			obj["renderer"] =function(value, p, record, rowIndex, colIndex, store) {
//				
//				var retVal = value;
//        		var path = gPath;
//        		if(path[path.length-1] != '/') {
//        			path = path + '/';
//        		}
//        		path = path+value;
//        		
//				var folder = record.get('folder');
//	        	if(folder=='0') {
//	        		retVal = '<span><a class=btn href="#" onclick="javascript:lfn_setFolderCall(\'' + path + '\'); return false;">' + value + '</a></span>';
//	        	} else {
//	        		retVal =
//	        		'<img style="cursor: pointer;" onclick="javascript:lfn_Download(\'' + value + '\'); return false;" src="' + CONTEXT_PATH + '/extjs/shared/icons/w_task_icon_down.gif" align="left" />' + retVal;
//	        	}
//				
//	        	return retVal;
//	        	
//
//        	};
//		}
//		
//	});
//	
//    
//    
//    	store.load(function(records) {
//    		console_log(records);
//
//    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );    
//    		
//    		 var arrFileMnu = getProjectTreeToolbar();
//    		 arrFileMnu.push({
//					xtype: 'component',
//					//fieldStyle: 'background-color: #E3E9EF; background-image: none; color:#5F6DA3;',
//					//emptyText:  'Path',
//					//height: 20,
//					style: 'margin:5px;',
//					//textAlign:'right',
//			 		id: 'callPath',
//			 		html: ''
//			        //readOnly: true
//			      });
////    		 arrFileMnu.push('->');
////    		 arrFileMnu.push(		 uploadAction );
////    		 arrFileMnu.push({
////    	            //y: 0 + 4*lineGap,
////    	            xtype: 'filefield',
////    	            emptyText: 'Click Select Button for Upload...',
////    	            buttonText: 'Select',
////    	            allowBlank: true,
////    	            buttonConfig: {
////    	                iconCls: 'upload-icon'
////    	            },
////    	            width:300
////    	            
////    	            //anchor: '100%'
////    	        });			
//
//    		 
//		    grid = Ext.create('Ext.grid.Panel', {
//		    		id: 'gridFilelist',
//			        store: store,
//			        collapsible: true,
//			        multiSelect: true,
//			        selModel: selModel,
//			        stateId: 'stateGridBom'+ /*(G)*/vCUR_MENU_CODE,
//	                region: 'center',
//			        height: getCenterPanelHeight(),
//			        
//			        dockedItems: [{
//	    		      					dock: 'top',
//	    		      				    xtype: 'toolbar',
//	    		      				    items: [ searchAction,  '-',  uploadFileAction, removeAction, '-', addFolderAction,removeFolderAction, '-',    '->' ]
//	    		      				},{
//	    		      					xtype: 'toolbar',
//	    		      					items: arrFileMnu
//	    		      				}],
//			        columns: /*(G)*/vCENTER_COLUMNS,
//			        viewConfig: {
//			            stripeRows: true,
//			            enableTextSelection: true,
//			            listeners: {
//			                itemcontextmenu: function(view, rec, node, index, e) {
//			                    e.stopEvent();
//			                    contextMenu.showAt(e.getXY());
//			                    return false;
//			                }
//			            }
//			        },
//		    		title: getMenuTitle()
//			    });
//		    
//		    grid.getSelectionModel().on({
//		        selectionchange: function(sm, selections) {
//		        	selectionLength = selections.length;
//
//		            if (selections.length) {
//
//			            	displayProperty(selections[0]);
//			            	if(fPERM_DISABLING()==true) {
//				            	removeAction.disable();
//				            	removeFolderAction.disable();
//			            	}else{
//		            			removeAction.enable();
//		            			removeFolderAction.enable();
//			            	}
//
//		            } else {
//			            	if(fPERM_DISABLING()==true) {
//				            	collapseProperty();
//				            	removeAction.disable();
//				            	removeFolderAction.disable();
//			            	}else{
//			            		collapseProperty();
//				            	removeAction.disable();
//				            	removeFolderAction.disable();
//			            	}
//		            }
//		        }
//		    });
//		    
//			fLAYOUT_CONTENT(grid);
//			
//			
//			var linkStr =getMenuPath(gPath);
//			var callPath = Ext.getCmp('callPath');
//			callPath.update(linkStr);
//			
//			store.load(function() {});
//			
// 	});
//	cenerFinishCallback();//Load Ok Finish Callback
//
//});	//OnReady
//
