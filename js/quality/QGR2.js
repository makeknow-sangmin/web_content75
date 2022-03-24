var grid = null;
var store = null;

var var_item_code = null;
var po_no = null;
var gr_no = null;
var item_name = null;
var gr_reason = null;
var barcode = null;
var account_name = null;
var seller_name = null;
var pr_user_name = null;

var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'arrow_rotate_clockwise',
    text: qgr2_in_cancel,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            multiline: true,
            msg: qgr2_reason,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

function deleteConfirm(btn, text){

    var result = MessageBox.msg('{0}', btn);
    if(result!='yes') {
    	return;
    }
    var selections = grid.getSelectionModel().getSelection();
	console_log(selections);
	if(selections==null || selections.length==0) {
	  Ext.MessageBox.alert('No','not selected items.');
	  return;
	}

	var arrGrqty = [];
	var unique_ids=[];
	for(var i=0; i< selections.length; i++) {
		var rec = selections[i];
		var unique_id = rec.get('unique_id');
		unique_ids.push(unique_id);
		var gr_qty = rec.get('gr_qty');
		arrGrqty.push(gr_qty);
//	           	var wgrast = Ext.ModelManager.create({
//	           		unique_id : unique_id,
//	           		gr_qty : gr_qty,
//	           		cancel_reason : text
//	           	}, 'WgrAst');
//	           	wgrast.destroy( {
//	           		 success: function() {}
//	           	});
     }
	
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/quality/wgrast.do?method=destroy',
		params:{
			arrGrqty : arrGrqty
			,cancel_reason : text
			,unique_ids: unique_ids
		},
		success : function(result, request) {
			store.load(function(){});
		},
		failure: extjsUtil.failureMessage
	});
	
//        	grid.store.remove(selections);
	

};

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
			        	read: CONTEXT_PATH + '/quality/wgrast.do?method=read&po_type=MN',
			            destroy: CONTEXT_PATH + '/quality/wgrast.do?method=destroy'
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
	        	items: [searchAction,'-',removeAction]
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
						removeAction.disable();
					}else{
						removeAction.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
		            	removeAction.disable();
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
	            		removeAction.disable();
	            	}
	            }
	        }
	    });
		cenerFinishCallback();//Load Ok Finish Callback
	});
	console_log('End...');
});



