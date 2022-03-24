//*****************************GLOBAL VARIABLE**************************/

var grid = null;
var store = null;
var winFileUpload = null;
var gPath='/';
var gSelectedPjCode = 'root';

var mydeptStore = Ext.create('Mplm.store.MyDeptStore', {} );

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

var openAction  = Ext.create('Ext.Action', {
	itemId: 'openActionButton',
	iconCls: 'upload-icon',
    text: 'Upload',
    disabled: false ,
    handler: function(widget, event) {
    	winFileUpload.show();
    }
});




function doCreateFolder(btn, text){
	
	if(btn=='ok' && text!=null) {
		var folderName = Ext.util.Format.trim(text);
		if(folderName!='') {
			store.getProxy().setExtraParam('path', Ext.JSON.encode(gPath));
			store.getProxy().setExtraParam('newFolder', Ext.JSON.encode(folderName));
			
			store.load({});
		}
		
	}

};

var addFolderAction = Ext.create('Ext.Action', {
	iconCls:'add',
    text: 'New Folder',
    disabled:fPERM_DISABLING(),
    handler: function(widget, event) {
    	Ext.MessageBox.prompt('New Folder', 'Enter Folder Name:', doCreateFolder);
    }
});

var removeFolderAction = Ext.create('Ext.Action', {
	iconCls: 'remove',
    text: 'Folder ' + CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteFolderConfirm,
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});
var backupAction = Ext.create('Ext.Action', {
	
	itemId: 'backupAction',
	iconCls:'star',
    text: 'FileBackUp',
    disabled: false,
    handler: function(widget, event) {
    	
    	var rec = grid.getSelectionModel().getSelection()[0];
    	
    	var name = rec.get('name');
    	
    	console_log("name   :  "+name);
    	console_log("gPath   :  "+gPath);
    	
    	var fname = Ext.JSON.encode(gPath+'/'+name);
//    	console_log("ccccccc   :  ");	
    	
    	

    	
    	var backup_store = new Ext.data.Store({  
    		pageSize: getPageSize(),
    		model: 'BackUp'
 
    	});

    	
    	var tempColumn = [];
    	

    	
    	for(var i=0; i<vCENTER_COLUMN_SUB.length; i++) {
    		tempColumn.push(vCENTER_COLUMN_SUB[i]);
    	}

	
    	backup_store.getProxy().setExtraParam('filepath', fname);

    	backup_store.load(function() {
    		
    		
    		Ext.each( /* (G) */tempColumn, function (columnObj, index,value) {
                
                var dataIndex = columnObj["dataIndex" ];

               columnObj[ "flex" ] =1;
              

         });

    		
    		// grid create
    		backupgrid = Ext.create('Ext.grid.Panel', {
    			title: routing_path,
    			// layout: 'form',
    		    store: backup_store,
    		    layout: 'fit',
    		    columns : tempColumn,
    		    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
    		    	clicksToEdit: 1
    		    })],

    		    border: false,
    		    multiSelect: true,
    		    frame: false 
    		    ,			        
    		    viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
			            listeners: {
			                itemcontextmenu: function(view, rec, node, index, e) {
			                    e.stopEvent();
			                    bcontextMenu.showAt(e.getXY());
			                    return false;
			                }
			            }
			        },
    		    dockedItems: [] // endofdockeditems
    		}); // endof Ext.create('Ext.grid.Panel',
    		
    		backupgrid.getSelectionModel().on({
    			selectionchange: function(sm, selections) {
		            if (selections.length) {
						if(fPERM_DISABLING()==true) {
//							removeRtgapp.disable();
						}else{
//							removeRtgapp.enable();
						}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();// uncheck no displayProperty
//		            		removeRtgapp.disable();
		            	}else{
		            		collapseProperty();// uncheck no displayProperty
//		            		removeRtgapp.disable();
		            	}
		            }
		        }
    		});
    		
    		// form create
        	var form = Ext.create('Ext.form.Panel', {
    			id : 'formPanel',
    			xtype: 'form',
// layout: 'absolute',
    			frame: false,
    	        border: false,
                bodyPadding: 15,
                region: 'center',
    	        defaults: {
    	            anchor: '100%',
    	            allowBlank: false,
    	            msgTarget: 'side',
    	            labelWidth: 60
    	        },
    	        items: [

                	backupgrid
    	                ]
        	});// endof createform
        	
        	// window create

        	prWin = Ext.create('ModalWindow', {
        		title: CMD_ADD + ' :: ' + /* (G) */vCUR_MENU_NAME,
                width: 550,
                height: 250,
// // minWidth: 250,
// // minHeight: 180,
// layout: {
// type: 'fix',
// padding: 5
// },
                plain:true,
                items: [ form
         ],
                buttons: [{
                	text: '종료',
                	handler: function(){
                		if(prWin) {prWin.close();} }            	
                }]
        	});
        	prWin.show();
    	});// enof load
    }// endof handlwe
});


var uploadFileAction = Ext.create('Ext.Action', {
	iconCls: 'upload-icon',
    text: 'Upload',
    disabled:fPERM_DISABLING(),
    handler: function(widget, event) {
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
             items: [{
 	            //y: 0 + 4*lineGap,
 	            xtype: 'filefield',
 	            emptyText: panelSRO1149,
 	            buttonText: 'upload',
 	            allowBlank: true,
 	            buttonConfig: {
 	                iconCls: 'upload-icon'
 	            },
 	            anchor: '100%'
 	        }]
        });//endofform
        var win = Ext.create('ModalWindow', {
            title: CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 500,
            height: 130,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid()) {
                    	
		                   	form.submit({
		                        url: CONTEXT_PATH + '/supercom.do?method=ftpUpload&remotepath=' + gPath,
		                        waitMsg: 'Uploading Files...',
		                        success: function(fp, o) {
		                        	win.close();
	                           		store.load(function() { });
		                        }
		                   	});
	                   	
	                   }
                  }//endof handler
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {win.close();}
            	}//endof hanler
            }//endofcancel
            ]//endofbuttons
        });//endofwin
        win.show();
    }//endof handler
});

//
//
//var uploadAction = Ext.create('Ext.Action', {
//	iconCls:'add',
//    text: 'Upload',
//    disabled:fPERM_DISABLING(),
//    handler: function(widget, event) {
//    	
//    }
//});

function lfn_setFolderCall(folder){
	store.getProxy().setExtraParam('path', Ext.JSON.encode(folder));
	
	store.load({});
}

function deleteFolderConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        var count = 0;
        if(result=='yes') {
        	var fileNames = [];
        	
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var name = Ext.JSON.encode(rec.get('name') );
        		fileNames.push(name);
        		count++;
        	}
        	Ext.Ajax.request({
    			url: CONTEXT_PATH +  '/supercom.do?method=deleteFolder',
    			params:{
    				path : Ext.JSON.encode(gPath),
    				fileNames : fileNames
    			},
    			success : function(result, request) {
    	        	store.load(function() {});
    			},
    			failure: extjsUtil.failureMessage
    		});

        }
    }
};

function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        var count = 0;
        if(result=='yes') {
        	var fileNames = [];
        	
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var name = Ext.JSON.encode(rec.get('name') );
        		fileNames.push(name);
        		count++;
        	}
        	Ext.Ajax.request({
    			url: CONTEXT_PATH +  '/supercom.do?method=delete',
    			params:{
    				path : Ext.JSON.encode(gPath),
    				fileNames : fileNames
    			},
    			success : function(result, request) {
    	        	store.load(function() {});
    			},
    			failure: extjsUtil.failureMessage
    		});

        }
    }
};


function backupConfirm(btn){

    var selections = backupgrid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        var count = 0;
        if(result=='yes') {
        	var fileNames = [];
        		var rec = backupgrid.getSelectionModel().getSelection()[0];
        		var name = Ext.JSON.encode(rec.get('fname') );
        		console_log('name: '+name);
        		var fid = rec.get('fid');
        		console_log('fid: '+fid);
        		var uniqueid = rec.get('unique_id');
        		console_log('uniqueid: '+uniqueid);
        	Ext.Ajax.request({
    			url: CONTEXT_PATH +  '/supercom.do?method=rollback&rptype=dept',
    			params:{
//    				bpath : Ext.JSON.encode(gPath),
    				fid:fid,
    				path : name,
    				id : uniqueid
    			},
    			success : function(result, request) {
    				var result = result.responseText;
    				var str = result;
    				console_log('strasdasd: '+str);
    				if(str=='true'){
    					Ext.MessageBox.alert('성공','성공적으로 파일이 롤백되었습니다.');
    				}else{
    					Ext.MessageBox.alert('실패','파일을 롤백할수없습니다.');
    				}
    				 				
    	        	store.load(function() {});
    			},
    			failure: extjsUtil.failureMessage
    		});

        }
    }
};

function lfn_Download(fileName) {
	
	var file_name = Ext.JSON.encode(fileName);
	
	window.location = CONTEXT_PATH + '/supercom.do?method=download&path='
	+ Ext.JSON.encode(gPath) + "&fileName=" + file_name
	;


}

function getMenuPath(path) {

	var pathArray = path.split("/");
	
	//var linkStr = '<span><a class=btn href="#" onclick="javascript:lfn_setFolderCall(\'/\'); return false;">' + gSelectedPjCode + '</a></span> / ';
	var linkStr = ' / ';

	var pathStr = "/";
	for(var i=0; i<pathArray.length; i++) {
		if( pathArray[i].length>0)
			{
				if(i>0) {
					pathStr = pathStr +  pathArray[i] + "/";
				}
				var link = '<span><a class=btn href="#" onclick="javascript:lfn_setFolderCall(\''   + pathStr +   '\'); return false;">' + pathArray[i]  + '</a></span>';

				if(i<2) {
					link = pathArray[i];
				}
				
				if(i>0) {
					linkStr = linkStr + link + ' / ';
				}
				
			}
	}
	return linkStr;
}

//*****************************MODEL**************************/

Ext.define('FtpFile', {
	 extend: 'Ext.data.Model',
	 fields: /*(G)*/vCENTER_FIELDS
	 ,
	    proxy: {
			type: 'ajax',
	        api: {
	        	read: CONTEXT_PATH + '/supercom.do?method=projectRepo&repo_type=dept', 					/*1recoed, search by cond, search */
	            create: CONTEXT_PATH + '/supercom.do?method=createFolder', 			/*create record, update*/
	            update: CONTEXT_PATH + '/supercom.do?method=updateFile',
	            destroy: CONTEXT_PATH + '/supercom.do?method=destroyFile' 			/*delete*/
	        },
			reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success',
				metaProperty: 'metaData'
			},
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        } 
		}
});

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


var rollbackAction = Ext.create('Ext.Action', {
	itemId: 'rollbackButton',
    iconCls: 'remove',
    text: 'RollBack',
    disabled: false,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:'RollBack',
            msg: '선택하신 파일로 롤백하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: backupConfirm,
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ removeAction, removeFolderAction , backupAction]
});
var bcontextMenu = Ext.create('Ext.menu.Menu', {
    items: [rollbackAction]
});

function uploadFinished() {
	//store.load(function() {});
}
Ext.onReady(function() {  

	
	Ext.define('BackUp', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /* (G) */vCENTER_FIELDS_SUB,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/supercom.do?method=backupread'
//			            create: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
//			            destroy: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp'
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

	LoadJs('/js/util/comboboxtree.js');

	var fileuploadObj = 
    {
		id : 'tempport',
		region: 'east',
        width: '30%',
	    height: '100%',
        xtype : "component",
        autoEl : {
            tag : "iframe",
            height: '100%',
    	    width: '100%',
    	    border: 0,
            src : CONTEXT_PATH + '/test/multiFileUpload.jsp',
            //src : CONTEXT_PATH + '/test/uploadpanel.jsp',
	        frameBorder: 0
	     }
};
	
    	//FtpFile Store 정의
    store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'FtpFile',
		//remoteSort: true,
		sorters: [{
            property: 'name',
            direction: 'DESC'
        }]
    	,listeners: 
    	{
//	            beforeload: function (store, operation, eOpts) {
//	                    //console_log('FtpFile store fn beforeload');
//	            },
//	            load: function (store, records, successful, eOpts) {
//	                    //self.getProxy().setExtraParam('depChange', 0);
//	                	//console_log('FtpFile store fn load');
//	                	store.getProxy().setExtraParam('newFolder', null);
//	            },
    		metachange: function (store, meta, eOpts) {
                 	//console_log('###################################');
                    //console_log(
                    //		"logonDir: " + meta.logonDir
                   // 		+ ", pjUid: " + meta.pjUid
                   // 		+ ", path: " + meta.path
                   // );   
    			store.getProxy().setExtraParam('newFolder', null);
    			store.getProxy().setExtraParam('fileName', null);
    			
                    gPath = meta.path;
        			var linkStr =getMenuPath(gPath);
        			var callPath = Ext.getCmp('callPath');
        			callPath.update(linkStr);
             }
             
    	}

	});

	Ext.each(vCENTER_COLUMNS, function(obj, index) {
		//console_log(obj);
		//var text = obj['text'];
		var dataIndex = obj['dataIndex'];
		
		if(dataIndex=='name') {
			obj["renderer"] =function(value, p, record, rowIndex, colIndex, store) {
				
				var retVal = value;
        		var path = gPath;
        		if(path[path.length-1] != '/') {
        			path = path + '/';
        		}
        		path = path+value;
        		
				var folder = record.get('folder');
	        	if(folder=='0') {
	        		retVal = '<span><a class=btn href="#" onclick="javascript:lfn_setFolderCall(\'' + path + '\'); return false;">' + value + '</a></span>';
	        	} else {
	        		retVal =
	        		'<img style="cursor: pointer;" onclick="javascript:lfn_Download(\'' + value + '\'); return false;" src="' + CONTEXT_PATH + '/extjs/shared/icons/w_task_icon_down.gif" align="left" />' + retVal;
	        	}
				
	        	return retVal;
	        	

        	};
		}
		
	});
	
    
    
    	store.load(function(records) {
    		console_log(records);

    		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );    
    		
    		 var arrFileMnu = [];
    		 
    		 
    		 arrFileMnu.push({
									id:'mydeptcombo',
								// name:'fix_mchn',
								    	xtype: 'combo',
								    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
								           mode: 'local',
								           editable:false,
								           // allowBlank: false,
								           width: 200,
								           queryMode: 'remote',
								           emptyText:'부서',
								           value: vCUR_DEPT_NAME,
								           displayField:   'dept_name',
								           valueField:     'unique_id',
								           store: mydeptStore,
								            listConfig:{
								            	getInnerTpl: function(){
								            		return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
								            	}			                	
								            },
								           triggerAction: 'all',
								            listeners: {
								                 select: function (combo, record) {
								                 	
								                 	console_log('Selected Value : ' + combo.getValue());
								                 	var deptuid = record[0].get('unique_id');
								                 	
//								                 	ac_uid = pjuid;
								                 	var dept_name  = record[0].get('dept_name');
								                 	var dept_code  = record[0].get('dept_code');
								                 	
								                 	store.getProxy().setExtraParam('dept_code', dept_code);
	    		      				     			store.load({});
							                 }
							            }
						        })
    		 
    		 arrFileMnu.push({
					xtype: 'component',
					//fieldStyle: 'background-color: #E3E9EF; background-image: none; color:#5F6DA3;',
					//emptyText:  'Path',
					//height: 20,
					style: 'margin:5px;',
					//textAlign:'right',
			 		id: 'callPath',
			 		html: ''
			        //readOnly: true
			      });
//    		 arrFileMnu.push('->');
//    		 arrFileMnu.push(		 uploadAction );
//    		 arrFileMnu.push({
//    	            //y: 0 + 4*lineGap,
//    	            xtype: 'filefield',
//    	            emptyText: 'Click Select Button for Upload...',
//    	            buttonText: 'Select',
//    	            allowBlank: true,
//    	            buttonConfig: {
//    	                iconCls: 'upload-icon'
//    	            },
//    	            width:300
//    	            
//    	            //anchor: '100%'
//    	        });			

    		 
		    grid = Ext.create('Ext.grid.Panel', {
		    		id: 'gridFilelist',
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        selModel: selModel,
			        stateId: 'stateGridBom'+ /*(G)*/vCUR_MENU_CODE,
	                region: 'center',
			        height: getCenterPanelHeight(),
			        
			        dockedItems: [{
	    		      					dock: 'top',
	    		      				    xtype: 'toolbar',
	    		      				    items: [ searchAction,  '-', /* uploadFileAction, */removeAction, '-', addFolderAction,removeFolderAction, '-' ,
	    		      				          /* fileuploadObj, */ '->' /*, openAction*/]
	    		      				},{
	    		      					xtype: 'toolbar',
	    		      					items: arrFileMnu
	    		      				}],
			        columns: /*(G)*/vCENTER_COLUMNS,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
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
		    
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	selectionLength = selections.length;

		            if (selections.length) {

			            	//displayProperty(selections[0]);
			            	if(fPERM_DISABLING()==true) {
				            	removeAction.disable();
				            	removeFolderAction.disable();
			            	}else{
		            			removeAction.enable();
		            			removeFolderAction.enable();
			            	}

		            } else {
			            	if(fPERM_DISABLING()==true) {
				            	collapseProperty();
				            	removeAction.disable();
				            	removeFolderAction.disable();
			            	}else{
			            		collapseProperty();
				            	removeAction.disable();
				            	removeFolderAction.disable();
			            	}
		            }
		        }
		    });
		    
		    
			
			fLAYOUT_CONTENTMulti([grid, fileuploadObj]);  
/*
	
			var winWidth = 500;
			var winHeight = 200;
		    winFileUpload = Ext.create('Ext.Window', {
		    	id: 'multifileDia',
		        title: 'File Upload',
		        closable: false,
		        width: winWidth,
		        height: winHeight,
		        x: getWestPanelWidth()+ getCenterPanelWidth()-winWidth-20,
		        y: Ext.getCmp('mainview-head-panel').getEl().getHeight()+120,
		        plain: true,
		        headerPosition: 'top',
		        layout: 'fit',
		        items: [fileuploadObj]
		    }).show();
*/	

			
			var linkStr =getMenuPath(gPath);
			var callPath = Ext.getCmp('callPath');
			callPath.update(linkStr);
			cenerFinishCallback();//Load Ok Finish Callback
			
 	});


});	//OnReady

