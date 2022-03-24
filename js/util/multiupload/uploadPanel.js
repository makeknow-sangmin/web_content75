/*
Ext.require([
    'Ext.grid.*',
    'Ext.data.*'
]);
*/

//var fileId= 0;
//function getFileId() {
//	console_log('cur fileId: ' + fileId);
//	var id = fileId;
//	fileId++;
//	return id;
//}

var uploadPanel = null;
var uploadStore = null;

var selModelFile = Ext.create('Ext.selection.CheckboxModel', {
    listeners: {
        selectionchange: function(sm, selections) {
	        console_info('sm:'+sm);
	        console_info('selections:'+selections);
	        console_info('grid:'+uploadPanel);
	        try {
	        	uploadPanel.down('#removeButtonFile').setDisabled(selections.length == 0);
	        } catch (e){}
        
        }
    }
});

var crEditColumns =  [
                 {
                     header: 'No',     dataIndex: 'id',     width: 38,
                     renderer: function (v) { 
                    	 if(v>-1) {
                    		 return v + 1; 
                    	 } else {
                    		 return '#' + v*(-1);
                    	 }
                    	 
                    }
                 },
                 { header: 'object_name', dataIndex: 'object_name', width: 220 },
                 { header: 'file_size', dataIndex: 'file_size', width: 80, renderer: Ext.util.Format.fileSize },
                 { header: 'Progress',   dataIndex: 'progress', width: 170,
                     //renderer: function (v) { return v + '%'; }
                	 renderer: function (v, m, r) {
                		 if(v<0) {
                			 return '';
                		 }
                		 var id = Ext.id();
                		 var div = Ext.String.format('<div id="{0}"></div>', id);
                		 if(v==-1) {
                			 return 'Completed';
                		 } 
                		 else if( v>99){
                			 v=100;
                		 } else if(v<2) {
                			 v=1;
                		 }
                		 //alert(id);
                		 try {
                			 Ext.defer(function () {                        
                				 try {
                    				 Ext.widget('progressbar', {                            
                    					 renderTo: id,
                    					 constrain: true,
                    					 value: v / 100,                            
                    					 width: 140,
                    					 height: 12
                    					 });         
                    				 } catch(e){}
                				 }, 5);
                			
                		 } catch(e){}
                		 
                		 return div;
                	 }
                 
                 }
//                 ,{ header: 'fileobject_uid', dataIndex: 'fileobject_uid' }
//                 ,{ header: 'item_code', dataIndex: 'item_code' }
//                 ,{ header: 'group_code', dataIndex: 'group_code' }
                 
                ];

var viewColumns =  [
                      { header: 'object_name', dataIndex: 'object_name', width: 400 },
                      { header: 'file_size', dataIndex: 'file_size', width: 150, renderer: Ext.util.Format.fileSize }
                     ];

//Define Remove Action
var removeActionFile = Ext.create('Ext.Action', {
	itemId: 'removeButtonFile',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	 var selections = uploadPanel.getSelectionModel().getSelection();
    	    if (selections) {

        	for(var i=0; i< selections.length; i++) {
        		var rec = uploadPanel.getSelectionModel().getSelection()[i];
        		var fileobject_uid = rec.get('fileobject_uid');
	           	 var srccst = Ext.ModelManager.create({
	           		fileobject_uid : fileobject_uid
	        	 }, 'SrcCst');
        		
	           	srccst.destroy( {
	           		 success: function() {}
	           	});
           	
        	}
        	uploadPanel.store.remove(selections);
    	    }
    }
});


//Context Popup Menu
var contextMenuFile = Ext.create('Ext.menu.Menu', {
    items: [ removeActionFile  ]
});


Ext.define('Ext.ux.multiupload.Panel', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.ux.multiupload.Upload'
    ],
    mode: 'NOT-DEFINED',
    groupUid: '',
    viewConfig: {
        markDirty: false,
        stripeRows: true,
        enableTextSelection: true,
        listeners: {
            itemcontextmenu: function(view, rec, node, index, e) {
                e.stopEvent();
                contextMenuFile.showAt(e.getXY());
                return false;
            },
            itemdblclick: function(dv, fRecord, item, index, e) {
                //alert('working');
            } 

        }
    },
    layout: {
        type: 'border',
        padding: 0,
        border: 0
    },
    multiSelect: true,
    stateId: 'stateGridFile',
    selModel: selModelFile,
    autoScroll : true,
    style: 'margin:0;padding:0',
    initComponent: function () {

//    	if(this.store!=null) {	
//    		fileId = this.store.getCount();
//    		console_log('id set: ' + fileId);
//    	}else {
//    		fileId = 0;
//    		console_log('not found id');
//    	}
//    		
        this.addEvents('fileuploadcomplete');

        var columns = null;
        if(this.mode=='VIEW') {
        	columns =  crEditColumns;
        } else {
        	 columns = crEditColumns;
        this.tbar = [{
            xtype: 'uploader',
            uploadConfig: this.uploadConfig, 
            listeners:
            {

                'fileadded': function (source, file) {
                console_info('fileadded');
                console_info('id: ' + file.fileIndex);
                   console_info('object_name: ' +file.fileName);
                   console_info('file_size: ' +file.fileSize);
                   console_info('file_ext: ' +file.fileType);
                   console_info('item_code: ' +/*(G)*/vFILE_ITEM_CODE);

                   this.up('grid').store.add({
                        id: file.fileIndex,
                        object_name: file.fileName,
                        file_size: file.fileSize,
                        file_ext: file.fileType,
                        item_code: /*(G)*/vFILE_ITEM_CODE,
                        status: 'waiting...',
                        progress: 0
                    });

                   this.up('grid').store.sort();
					
                },
                'uploadstart': function (source, file) {
                console_info('uploadstart');
                    //var fGrid = this.up('grid');
                    var fRecord = this.up('grid').store.getById(file.fileIndex);

                    if (fRecord) {
                    	fRecord.set('status', 'uploading...');
                    }
                },
                'uploadprogress': function (source, file) {
                console_info('uploadprogress');
                    //var fGrid = this.up('grid');
                    var fRecord = this.up('grid').store.getById(file.fileIndex);
                    if (fRecord) {
                        var p = Math.round(file.fileProgress / file.fileSize * 100);
                        if(p>100) {
                        	p=100;
                        }
                        fRecord.set('progress', p);
                    }
                },
                'uploaddatacomplete': function (source, file) {
                console_info('uploaddatacomplete');
                    //var fGrid = this.up('grid');
                    var fRecord = this.up('grid').store.getById(file.fileIndex);
                    if (fRecord) {
                    	var fileobject_uid = file.data;
                    	var object_name = fRecord.get('object_name');
                    	var link = '<a href="' + CONTEXT_PATH + '/filedown.do?method=fileobject&fileobject_uid='+ fileobject_uid + '">' + object_name + '</a>';
                        fRecord.set('status', 'completed');
                        fRecord.set('fileobject_uid', fileobject_uid);
                       
                       console_log(fRecord);
                        
                       console_log(file.data + ' is saving...');
                        fRecord.save({
	                		success : function() {
	                		console_log(file.data + ' is saved');
	                			fRecord.set('progress', -1);
	                			fRecord.set('object_name', link);
	                			if(vCUR_MENU_CODE=='DBM1_ELE'){
	                				upload=false;	
	                			}
	                		} 
	                	 });
                    }
                    this.fireEvent('fileuploadcomplete', file.data);
                },
                'queuedatacomplete': function (source, data) {
                console_info('queuedatacomplete');
                	//alert(Ext.JSON.encode(data) );

                //    Ext.Msg.show({
                //        title: 'Info',
                //        msg: 'Queue upload end. ' + data.files + ' file(s) uploaded.',
                //        buttons: Ext.Msg.OK,
                //        icon: Ext.Msg.INFO
                //    });

                },
                'uploaderror': function (src, data) {
                console_info('uploaderror');
                    var msg = 'ErrorType: ' + data.errorType;

                    switch (data.errorType) {
                        case 'FileSize':
                            msg = 'This file is too big: ' + Ext.util.Format.fileSize(data.fileSize) +
                            '. The maximum upload size is ' + Ext.util.Format.fileSize(data.maxFileSize) + '.';
                            break;

                        case 'QueueLength':
                            msg = 'Queue length is too long: ' + data.queueLength +
                            '. The maximum queue length is ' + data.maxQueueLength + '.';
                            break;
                    }

                    Ext.Msg.show({
                        title: 'Upload Error',
                        msg: msg,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
               }
            }
        }, '->', removeActionFile
        
        ];
        }
        this.columns =  columns,
        this.callParent(arguments),
        this.getSelectionModel().on({
	        selectionchange: function(sm, selections) {
	            if (selections.length) {
	            	removeActionFile.enable();
	            } else {
	            	removeActionFile.disable();
	            }
	        }
	    });
    }
});



Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': CONTEXT_PATH + '/js/util'
    }
});

var srccstFields =
	 ['id', 'object_name', 'file_size', 'status', 'progress', 'fileobject_uid', 'file_ext', 'item_code', 'group_code'];
	
//writer define
Ext.define('Board.writer.SinglePost', {
  extend: 'Ext.data.writer.Writer',
  alternateClassName: 'Ext.data.SinglePostWriter',
  alias: 'writer.singlepost',

  writeRecords: function(request, data) {
  console_info(data);
  console_info(data[0]);
  	data[0].cmdType = 'create';
      request.params = data[0];
      return request;
  }
});

Ext.define('SrcCst', {
  	 extend: 'Ext.data.Model',
  	 fields: srccstFields,
  	    proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/fileObject.do?method=readFileList',
		            create: CONTEXT_PATH + '/fileObject.do?method=create',
		            update: CONTEXT_PATH + '/fileObject.do?method=create',
		            destroy: CONTEXT_PATH + '/fileObject.do?method=destroy'
		        },
				reader: {
					type: 'json',
					root: 'datas',
					totalProperty: 'count',
					successProperty: 'success'
				},
				writer: {
		            type: 'singlepost',
		            writeAllFields: true,
		            root: 'datas'
		        } ,
	            listeners: {
	                exception: function(proxy, response, operation){
	                	console_log('fileUpload SrcCst Model listen..');
	                    Ext.MessageBox.show({
	                        title: 'REMOTE EXCEPTION',
	                        msg: operation.getError(),
	                        icon: Ext.MessageBox.ERROR,
	                        buttons: Ext.Msg.OK
	                    });
	                }
	            }
			}
});

function getUploadStore(groupUid) {
	var uploadStore =
		new Ext.data.Store({  
    	fields: srccstFields,
    	model: 'SrcCst',
    	sorters: [{
            property: 'id',
            direction: 'ASC'
        }] 
 	});
	if(groupUid!=null) {
		uploadStore.getProxy().setExtraParam('unique_id', groupUid);
	}
	
	return uploadStore;
}
/**
 * 
 * @param mode
 * 		CREATE/EDIT/VIEW
 */
function getCommonFilePanel(mode, x, y, width, height, maxFile, groupUid) {
	console_info('getCommonFilePanel:' + mode + ':' +  width + ':' + height + ':' + groupUid);

	uploadStore = getUploadStore(null);

	uploadPanel = Ext.create('Ext.ux.multiupload.Panel', {
        frame: true,
        store: uploadStore,
        mode: mode,
        groupUid: groupUid,
        width: width,
        height: height,
        x: x,
        y: y,
        uploadConfig: {
            uploadUrl: CONTEXT_PATH + '/uploader.do?method=upload',
            maxFileSize: 4000 * 1024 * 1024,
            maxQueueLength: maxFile
        }
    });
		
    return uploadPanel;
}

/*
upload.store.add({
    id: 0,
    object_name: 'AAA',
    file_size: 123,
    file_ext: '.ppt',
    item_code: 'fwefewe',
    status: 'waiting...',
    progress: 0
});
*/

