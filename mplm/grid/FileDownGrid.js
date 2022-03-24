//Context Popup Menu
//var contextMenuFile = Ext.create('Ext.menu.Menu', {
//    items: [ removeActionFile  ]
//});

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

Ext.define('Mplm.grid.FileDownGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'fileDownGridGrid',
    uses: [
        'Ext.data.ArrayStore'
    ],

    constructor: function(params){
    	console_log('FileDownGrid - initComponent');
    	console_log(params);

    	var fileDownStore = Ext.create('Mplm.store.AttachedFileStore', params );
		
        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: fileDownStore,
            stripeRows: true,
            columnLines: true,
            
            columns: [{
                text   : '파일명',
                flex: 1,
                sortable : true,
                dataIndex: 'object_name'
            },{
                text   : '크기',
                width    : 100,
                sortable : true,
                dataIndex: 'file_size'
            }]
        });
		fileDownStore.load(function(records){
			for(var i=0; i<records.length; i++) {
				console_log(records[i]);
			}
		});
        
        this.callParent(arguments);
    },
    //height: 300,
	border: false,
//	viewConfig: {
//        markDirty: false,
//        stripeRows: true,
//        enableTextSelection: true,
//        listeners: {
//            itemcontextmenu: function(view, rec, node, index, e) {
//                e.stopEvent();
//                contextMenuFile.showAt(e.getXY());
//                return false;
//            },
//            itemdblclick: function(dv, fRecord, item, index, e) {
//                //alert('working');
//            } 
//
//        }
//    },
	selModel: selModelFile,
    dockedItems: [{
		dock: 'top',
		    xtype: 'toolbar',
		    items:  [
		    '->', {
		    	itemId: 'removeButtonFile',
		    	    iconCls: 'remove',
    				text: gm.getMC('CMD_DELETE', '삭제'),
		    	handler: function(widget, event) {

			    	 	var selections = this.selModelFile.getSelection();
			    	    if (selections) {
			
				        	for(var i=0; i< selections.length; i++) {
				        		var rec = this.selModelFile.getSelection()[i];
				        		var fileobject_uid = rec.get('fileobject_uid');
								Ext.Ajax.request({
									url: CONTEXT_PATH + '/fileObject.do?method=destroy',
									params:{
										fileobject_uid : fileobject_uid
									},
									success : function(result, request) {
										
									},
									failure: extjsUtil.failureMessage
					           	
					        	});
				        	}//endoffor
			        		this.store.remove(selections);
			    	   }//ifselection
			    	   
		    	}//handler
		    }//remove Action
		    ]
     }]
	
});
