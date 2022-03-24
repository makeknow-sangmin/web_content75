var grid = null;
var store = null;

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

Ext.onReady(function() {  
	makeSrchToolbar(searchField);
	
	var pjmemberStore = Ext.create('Mplm.store.PjMemberStore', {hasNull: false} );
	
	Ext.define('PjMemberLine', {
		 extend: 'Ext.data.Model',
		 fields: /*(G)*/vCENTER_FIELDS_SUB,
		    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/production/pcsstart.do?method=read'
//		            create: CONTEXT_PATH + '/production/pcsstart.do?method=create',
//		            update: CONTEXT_PATH + '/production/pcsstart.do?method=update',
//		            destroy: CONTEXT_PATH + '/production/pcsstart.do?method=destroy'
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
	
	var PjMember_store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PjMemberLine',
		sorters: [{
            property: 'unique_id',
            direction: 'ASC'
        }]
	});
	
	Ext.define('PjtTsk', {
	    	 extend: 'Ext.data.Model',
	    	 fields: /*(G)*/vCENTER_FIELDS,
	    	    proxy: {
					type: 'ajax',
			        api: {
			            read: CONTEXT_PATH + '/admin/comdst.do?method=read'
//			            create: CONTEXT_PATH + '/admin/comdst.do?method=create',
//			            update: CONTEXT_PATH + '/admin/comdst.do?method=update',
//			            destroy: CONTEXT_PATH + '/admin/comdst.do?method=destroy'
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
		model: 'PjtTsk',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	

 	store.load(function() {
 		
 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
 		
 		var projectToolBar = getProjectToolbar(false/*hasPaste*/, false/*excelPrint*/) ;
 		
		grid = Ext.create('Ext.grid.Panel', {
		        store: store,
		        ///COOKIE//stateful: true,
		        collapsible: true,
		        multiSelect: true,
		        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
		        selModel: selModel,
		        autoScroll : true,
		        autoHeight : true,
		        height: getCenterPanelHeight(),
		        
		        bbar: getPageToolbar(store),
		        
		        dockedItems: [{
		            dock: 'top',
		            xtype: 'toolbar',
		            items: [
		                    searchAction,
      				        '->'
		                    ,{
  				                iconCls: 'tasks-show-all',
  				                tooltip: 'All',
  				                toggleGroup: 'status'
  				            },{
  				                iconCls: 'tasks-show-active',
  				                tooltip: 'Current',
  				                toggleGroup: 'status'
  				            },{
  				                iconCls: 'tasks-show-complete',
  				                tooltip: 'Past',
  				                toggleGroup: 'status'
  				            }]
		        },{
		        	xtype: 'toolbar',
  					items: projectToolBar//combotree
		        },{
		        	xtype: 'toolbar',
		        	items: [{
		        		id :'user_name',
				        name : 'user_name',
				        xtype: 'combo',
				        emptyText:   dbm1_name_input,
				        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				        displayField:   'user_name',
				        valueField:   'unique_id',
				        editable:false,
		                allowBlank: true,
		                sortInfo: { field: 'user_name', direction: 'ASC' },
				        autoWidth: true,
				        store : pjmemberStore,
		//		        width: 230,
				        listConfig:{
				            loadingText: 'Searching...',
				            emptyText: 'No matching posts found.',
				            getInnerTpl: function() {
				                return '<div data-qtip="{user_id}">{user_name}</div>';
				            }			                	
				        },
				        listeners: {
				        	select: function (combo, record) {
				        	}//endofselect
				        }
		        	}]
		        }
		        
		        ],
		        columns: /*(G)*/vCENTER_COLUMNS,
		        viewConfig: {
		            stripeRows: true,
		            enableTextSelection: true,
		            listeners: {
		            	'afterrender' : function(grid) {
							var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
							elments.each(function(el) {
											//el.setStyle("color", 'black');
											//el.setStyle("background", '#ff0000');
											//el.setStyle("font-size", '12px');
											//el.setStyle("font-weight", 'bold');
					
										}, this);
								
							}
		            		,
		                itemcontextmenu: function(view, rec, node, index, e) {
		                    e.stopEvent();
		                    contextMenu.showAt(e.getXY());
		                    return false;
		                },
		                itemdblclick: function(){
		                }

		            }
		        },
		        title: getMenuTitle()//,
		        //renderTo: 'MAIN_DIV_TARGET'
		    });
		fLAYOUT_CONTENT(grid);
	    grid.getSelectionModel().on({
	        selectionchange: function(sm, selections) {
	            if (selections.length) {
					//grid info 켜기
					displayProperty(selections[0]);
					if(fPERM_DISABLING() == true){
					}else{
					}
	            } else {
	            	if(fPERM_DISABLING() == true){
	            		collapseProperty();//uncheck no displayProperty
	            	}else{
	            	}
	            }
	        }
	    });
	    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config){
	    	Ext.create('Ext.tip.ToolTip', config);
	    });
	    cenerFinishCallback();//Load Ok Finish Callback
	});
});
     
