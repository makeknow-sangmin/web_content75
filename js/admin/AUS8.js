var grid = null;
var store = null;

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

var addAction = Ext.create('Ext.Action', {
	itemId: 'createButton',	
	iconCls:'add',
    text: '승인',
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
    		title:delete_msg_title,
    		msg: '선택한 항목을 승인 하시겠습니까?',
    		buttons: Ext.MessageBox.YESNO,
    		fn: deleteConfirm,
    		icon: Ext.MessageBox.QUESTION
    	});
    }
});

function deleteConfirm(btn){
	var Uids = [];
	var selections = grid.getSelectionModel().getSelection();
	
	for(var i=0; i< selections.length; i++) {
		var rec = selections[i];
		var unique_id = rec.get('unique_id');
		Uids[i]= unique_id;
	}
	console_log(Uids);
	var joinrq = Ext.ModelManager.create({
		unique_ids : Uids
	}, 'JoinRq');
	
	joinrq.save( {
		success: function() {
			store.load(function() {});
		}
	});
};

Ext.onReady(function() { 
	console_log('now starting...');
	
	var searchField = [];
	searchField.push('user_id');
	searchField.push('wa_code');
	searchField.push('hp_no');
	
	makeSrchToolbar(searchField);
	
	Ext.define('JoinRq', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/userMgmt/user.do?method=readjoinrq',
			        	create: CONTEXT_PATH + '/userMgmt/user.do?method=updatejoinrq'
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
		model: 'JoinRq',
		sorters: [{
            property: 'unique_id',
            direction: 'desc'
        }]
	});
	
	store.getProxy().setExtraParam('treat_result','N');
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
	            items: [searchAction,addAction,{
	            	id :'srch_treat_result',
			        name : 'srch_treat_result',
			        xtype: 'combo',
			        width: 80,
			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
			        emptyText:   '승인여부',
			        displayField:   'name',
			        valueField:   'value',
			        typeAhead: false,
			        hideLabel: true,
			        store : Ext.create('Ext.data.Store', {
						fields : ['name', 'value'],
						data : [{
									name : '완료',
									value : 'Y'
								},{
									name : '미완료',
									value : 'N'
						}]
					}),
			        listeners: {
			        	select: function (combo, record) {
			        		store.getProxy().setExtraParam('treat_result',record[0].data.value);
			        		store.load(function() {});
			        	}//endofselect
			        }
	            }]
	        },{
	        	xtype: 'toolbar',
	            items: /*(G)*/vSRCH_TOOLBAR/*vSRCH_TOOLBAR*/
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
							
						}
	            		,
	                itemcontextmenu: function(view, rec, node, index, e) {
	                    e.stopEvent();
	                    contextMenu.showAt(e.getXY());
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
					if(fPERM_DISABLING()==true) {
						addAction.disable();
					}else{
						addAction.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
		            	addAction.disable();
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
	            		addAction.disable();
	            	}
	            }
	        }
	    });
		cenerFinishCallback();//Load Ok Finish Callback
	});
	console_log('End...');
});