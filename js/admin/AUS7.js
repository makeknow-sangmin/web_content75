var grid = null;
var store = null;
var appType = 'PR';

var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});
function getStateToolBar() {
	var arrStateToolBar = [];
	
	arrStateToolBar.push(
			{
				id :'appType',
	        	xtype:          'combo',
	            value:          'PR',
	            editable:       false,
	            name : 'appType',
	            displayField:   'value',
	            valueField:     'name',
	            emptyText: ppo1_filter,
	            width: 100,
	            queryMode: 'local',
	            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		        store:          Ext.create('Ext.data.Store', {
	                fields : ['name', 'value'],
	                data   : [
	                    {name : 'PR',   value: 'PR'}
	                   ,{name : 'PO',   value: 'PO'}
	                ]
	            }),
		        listeners: {
		        	select: function (combo, record) {
		        		appType = Ext.getCmp('appType').getValue();
		        		store.getProxy().setExtraParam('appType',appType);
		        		store.load(function() {});
		        	}//endofselect
		        }
        	}
	);
	
	arrStateToolBar.push('-');
	arrStateToolBar.push(
			{
				fieldLabel: dbm1_array_add,
				labelWidth: 60,
				width: 150,
				labelSeparator: ' :',
				id :'gubun',
		        name : 'gubun',
		        xtype: 'combo',
		        mode: 'local',
                triggerAction: 'all',
                queryMode: 'remote',
                editable:false,
                allowBlank: false,
                value: 'D',
                displayField:   'name',
                valueField:     'value',
		        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		        store:  Ext.create('Ext.data.Store',{
		        	fields : ['name','value'],
		        	data   :[
		        	         {name : aus7_approval,   value: 'D'}
		        	         ,{name : aus7_notify,   value: 'T'}
		        	         ,{name : aus7_agreement,   value: 'S'}
		 	                ]      
		        }),
		        listeners: {
		        	select: function (combo, record) {
		        	}//endofselect
		        }
			}
	);
	
	arrStateToolBar.push('-');
	arrStateToolBar.push(
			{
				id :'user_name',
		        name : 'user_name',
		        xtype: 'combo',
		        emptyText:   dbm1_name_input,
		        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		        displayField:   'user_name',
		        valueField:   'unique_id',
		        editable:false,
                allowBlank: true,
                displayField:   'class_name' ,		       
                sortInfo: { field: 'user_name', direction: 'ASC' },
		        autoWidth: true,
		        store : userStore,
		        listConfig:{
		            loadingText: 'Searching...',
		            emptyText: 'No matching posts found.',
		            getInnerTpl: function() {
		                return '<div data-qtip="{unique_id}">{user_name}|{dept_name}</div>';
		            }			                	
		        },
		        listeners: {
		        	select: function (combo, record) {
		        		console_log('Selected Value : ' + record[0].get('unique_id'));
		        		var gubun = Ext.getCmp('gubun').getValue();
		        		var unique_id = record[0].get('unique_id');
		        		Ext.Ajax.request({
                 			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgapp',
                 			params:{
                 				useruid : unique_id
                 				,appType  : appType
                 				,gubun    : gubun
                 			},
                 			success : function(result, request) {   
                 				var result = result.responseText;
        						console_log('result:' + result);
        						if(result == 'false'){
        							Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
        						}else{
        							store.getProxy().setExtraParam('appType',appType);
        							store.load(function() {});
        						}
                 			},
                 			failure: extjsUtil.failureMessage
                 		});
		        	}//endofselect
		        }
			}
	);
	return arrStateToolBar;
}

var removeRtgapp = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteRtgappConfirm,
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

function deleteRtgappConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
	           	 var rtgapp = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'RtgApp');
        		
	           	rtgapp.destroy( {
	           		 success: function() {
	           			store.getProxy().setExtraParam('appType',appType);
	           			 store.load(function() {});
	           		}
	           	});  	
        	}
        }
    }
};

var contextMenu = Ext.create('Ext.menu.Menu', {
    items: removeRtgapp
});

Ext.onReady(function() { 
	console_log('now starting...');
	
	var stateToolBar = getStateToolBar();
	
	Ext.define('RtgApp', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=readRtgapp&addMe=false',
			            destroy: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp'
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
		model: 'RtgApp'	});
	store.getProxy().setExtraParam('appType',appType);
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
	            items: [searchAction,'->',removeRtgapp]
	        },{
	        	xtype: 'toolbar',
	        	items: stateToolBar
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
					displayProperty(selections[0]);
					if(fPERM_DISABLING()==true) {
						removeRtgapp.disable();
					}else{
						removeRtgapp.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
		            	removeRtgapp.disable();
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
	            		removeRtgapp.disable();
	            	}
	            }
	        }
	    });
		cenerFinishCallback();//Load Ok Finish Callback
	});
	console_log('End...');
});