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

function message_info(msg) {
	var uploadMsg = Ext.getCmp('uploadMsg');
	uploadMsg.update(msg);
}

function renderFiledownload(value, p, record) {
	
	console_logs(record);
	var group_code = record.get('group_code');
	var fileobject_uid = record.get('fileobject_uid');

    return Ext.String.format(
        '<a href="#" onclick="javascript:fileDownload(\'{0}\', \'{1}\')">{2}</a>',
        group_code, fileobject_uid, value
    );
}

var crEditColumns =  [
                 {
                     header: 'No',     dataIndex: 'id',     width: 0,
                     renderer: function (v) { 
                    	 if(v>-1) {
                    		 return v + 1; 
                    	 } else {
                    		 return '#' + v*(-1);
                    	 }
                    	 
                    }
                 },
                 { header: '파일명', dataIndex: 'object_name', width: 180 ,
                	 renderer : renderFiledownload
                 },
                 { header: '크기', dataIndex: 'file_size', width: 60, renderer: Ext.util.Format.fileSize },
                 { header: '경과',   dataIndex: 'progress', width: 100,
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
    	console_log(uploadPanel);
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
    //autoScroll : true,
    style: 'margin:0;padding:0',
    selModel: selModelFile,
    initComponent: function () {
  		
        this.addEvents('fileuploadcomplete');

        var columns = null;
        if(this.mode=='VIEW') {
        	columns =  crEditColumns;
        } else {
        	 columns = crEditColumns;
        var this_tbar = [
          {
        	 xtype:'component',
        	 html:'추가'
         },
         {
            xtype: 'uploader',
		    style: 'margin-top:1px;',
            uploadConfig: this.uploadConfig, 
            listeners:
            {

                'fileadded': function (source, file) {
                console.info('fileadded');
                console.log('file', file);
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
                        group_code: vGROUP_UID,
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
                	console_logs('uploaddatacomplete');
                    //var fGrid = this.up('grid');
                    var fRecord = this.up('grid').store.getById(file.fileIndex);
                    if (fRecord) {
                    	console.log('fRecord', fRecord);
                    	var fileobject_uid = file.data;
                    	var object_name = fRecord.get('object_name');
                    	var link = '<a href="" onClick="javascript:fileDownload(' + fileobject_uid + ')">' + object_name + '</a>';
                        fRecord.set('status', 'completed');
                        fRecord.set('fileobject_uid', fileobject_uid);
                       
                       console_log(fRecord);
                        
                       console_log(file.data + ' is saving...');
                        fRecord.save({
	                		success : function() {
	                		console_log(file.data + ' is saved');
	                			fRecord.set('progress', -1);
	                			
	                			parent.setLoadingFilePanel(true);
	                			//reload
	                			uploadStore.load(function(records){
	                				parent.setLoadingFilePanel(false);
	                			});
	                			//fRecord.set('object_name', link);
	                		} 
	                	 });
                    }
                    this.fireEvent('fileuploadcomplete', file.data);
                },
                'queuedatacomplete': function (source, data) {
                console_info('queuedatacomplete');
              
                message_info(data.files + ' file(s) uploaded.');
                
                /*
                parent.uploadFinished();
                this.up('grid').store.removeAll();
                */
                
                //alert(Ext.JSON.encode(data) );
                //    Ext.Msg.show({
                //        title: 'Info',
                //        msg: 'Queue upload end. ' + data.files + ' file(s) uploaded.',
                //        buttons: Ext.Msg.OK,
                //        icon: Ext.Msg.INFO
                //    });

                },
                'uploaderror': function (src, data) {
                
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
                    message_info(msg);
                    Ext.Msg.show({
                        title: 'Upload Error',
                        msg: msg,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
               }
            }
        },
         '->', removeActionFile
         
        ];
        
        
        this.dockedItems = [
//                            {
//                            	dock: 'top',
//            			    xtype: 'toolbar',
//            			    items:  ['->',
//            			             {
//            			            	 xtype:'component',
//            			            	 id: 'uploadMsg',
//            			            	 height: 14,
//            			            	 style: 'margin:4px;',
//            			            	 html:'<font color=#55555><i>Select files to upload by clicking by below button.</i></font>'
//            			             }
//            			             
//            			          ]
//                            },
                {
                	dock: 'top',
			    xtype: 'toolbar',
			    items:  this_tbar
                },{
  					xtype: 'toolbar',
  					items:[{
			        	 xtype:'component',
			        	 id: 'uploadMsg',
			        	 style: 'margin:5px;',
			        	 html:DEF_FILE_MSG
			         }]
  				}
        
        
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



