var grid = null;
var store = null;

var var_item_code = null;
var po_no = null;
var gr_no = null;
var item_name = null;
var seller_name = null;

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchToolBarTap
});

Ext.onReady(function() { 
	console_log('now starting...');
	var comboToolBar = getComboToolBar();
	var searchToolBar = getSearchToolBar();
	
	Ext.define('WgrAst', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/quality/wgrast.do?method=readCancel'
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
		model: 'WgrAst',
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
	        stateId: 'stateGrid',
	        selModel: selModel,
	        autoScroll : true,
	        autoHeight: true,
	        height: getCenterPanelHeight(),
	     // paging bar on the bottom
	        
	        bbar: getPageToolbar(store),
	        
	        dockedItems: [{
	        	xtype: 'toolbar',
	        	items: searchAction
	        },{
	        	xtype: 'toolbar',
	        	items: searchToolBar
	        },{
	        	xtype: 'toolbar',
	        	items: comboToolBar
	        }],
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
							
						},
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
	            if (selections.length) {
					displayProperty(selections[0]);
					if(fPERM_DISABLING()==true) {
					}else{
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
	            	}
	            }
	        }
	    });
		cenerFinishCallback();//Load Ok Finish Callback
	});
	console_log('End...');
});