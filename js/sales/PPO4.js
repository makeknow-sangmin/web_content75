var grid = null;
var store = null;	

var printPDFAction = Ext.create('Ext.Action',{
    iconCls: 'PDF',
    text: 'PDF',
    disabled: true,
    handler: function(widget, event) {
    	var rec = grid.getSelectionModel().getSelection()[0];
     	var rtgast_uid = rec.get('unique_id');//rtgast_uid
    	var po_no = rec.get('po_no');//po_no
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/pdf.do?method=printPo',
    		params:{
    			rtgast_uid : rtgast_uid,
    			po_no : po_no,
    			pdfPrint : 'pdfPrint'
    		},
    		reader: {
    			pdfPath: 'pdfPath'
    		},
    		success : function(result, request) {
    			store.load({
        	    scope: this,
        	    callback: function(records, operation, success) {
        	        var jsonData = Ext.JSON.decode(result.responseText);
        	        var pdfPath = jsonData.pdfPath;
        	        console_log(pdfPath);
//        	        
        	    	if(pdfPath.length > 0) {
        	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
        	    		top.location.href=url;	
        	    	}
        	    }
        	});
    		},
    		failure: extjsUtil.failureMessage
    	});
    	
    	
    }
});

var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ printPDFAction  ]
});

Ext.define('RtgAst', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
   	     proxy: {
			 type: 'ajax',
	         api: {
	        	 read: CONTEXT_PATH + '/sales/delivery.do?method=read&menu='+vCUR_MENU_CODE
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

Ext.onReady(function() {  
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'RtgAst',
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
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModel,
			        height: getCenterPanelHeight(), 
			        bbar: getPageToolbar(store),
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [printPDFAction]
			        }],
			        columns: /*(G)*/vCENTER_COLUMNS,
			        viewConfig: {
			            stripeRows: true,
			            enableTextSelection: true,
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
			                }
			            }
			        },
			        title: getMenuTitle()//,
			    });
			fLAYOUT_CONTENT(grid);
			
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		            if (selections.length) {
		            	if(fPERM_DISABLING()==true) {
		            		printPDFAction.disable();
		            	}else{
		            		printPDFAction.enable();
		            	}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		printPDFAction.disable();
		            	}else{
		            		printPDFAction.disable();
		            	}
		            }
		        }
		    });

		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
	}); //store load
 	cenerFinishCallback();//Load Ok Finish Callback
});	//OnReady