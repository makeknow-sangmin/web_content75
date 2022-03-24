searchField =  [];

var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});

var grid = null;
var store = null;

Ext.onReady(function() {  
	console_log('now starting...');
	makeSrchToolbar(searchField);
	
	Ext.define('RtgAst', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/sales/delivery.do?method=read',
			            create: CONTEXT_PATH + '/sales/delivery.do?method=create',
			            update: CONTEXT_PATH + '/sales/delivery.do?method=create',
			            destroy: CONTEXT_PATH + '/sales/delivery.do?method=destroy'
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
		model: 'RtgAst',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	store.getProxy().setExtraParam('menu','SDL1');
	store.load(function() {

 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
 		
		grid = Ext.create('Ext.grid.Panel', {
		        store: store,
		        collapsible: true,
		        multiSelect: true,
		        stateId: 'stateGrid',
		        selModel: selModel,
		        autoScroll : true,
		        autoHeight: true,
		        height: getCenterPanelHeight(),
		     // paging bar on the bottom
		        
		        bbar: getPageToolbar(store),
		        
		        dockedItems: [{
		        	xtype: 'toolbar',
		            items: /*(G)*/vSRCH_TOOLBAR
		        }],
		        columns: /*(G)*/vCENTER_COLUMNS,
		        plugins: [cellEditing],
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
		                    return false;
		                }
		            }
		        },
		        title: getMenuTitle()
		    });
		fLAYOUT_CONTENT(grid);
		
	    grid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	        }
	    });
	cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
 	console_log('End...');
});