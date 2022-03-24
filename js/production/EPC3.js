//*****************************GLOBAL VARIABLE**************************/
var grid = null;
var store = null;
var agrid = null;
var lineGap = 35;
var uidList = ''; 
Ext.define('PcsLine', {
	extend: 'Ext.data.Model',
	fields: vCENTER_FIELDS,
	proxy: {
		type : 'ajax',
		api : {
			read : CONTEXT_PATH + '/production/pcsline.do?method=read'
		},
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty: 'count',
			successProperty : 'success'
		}
	}
});


Ext.onReady(function() {  
	
	Ext.override(Ext.dd.DragSource,{
        handleMouseDown: function(e) {
            
            if(Ext.get(e.target).hasCls('x-grid-row-checker')){
                return false;
            }

            if (this.dragging) {
                return;
            }
            var data = this.getDragData(e);
            if (data && this.onBeforeDrag(data, e) !== false) {
                this.dragData = data;
                this.proxy.stop();
                this.callParent(arguments);
            }
        }
    });


    Ext.override(Ext.view.DragZone,{
        onItemMouseDown: function(view, record, item, index, e) {

            if (!this.isPreventDrag(e, record, item, index)) {
                this.handleMouseDown(e);

                // If we want to allow dragging of multi-selections, then veto the following handlers (which, in the absence of ctrlKey, would deselect)
                // if the mousedowned record is selected

                 if (view.getSelectionModel().selectionMode == 'MULTI' && !e.ctrlKey && view.getSelectionModel().isSelected(record)) {
                     return Ext.get(e.target).hasCls('x-grid-row-checker');
                 }
            }
        }
    });
	
	LoadJs('/js/util/comboboxtree.js');
	LoadJs('/js/util/processpaneltree.js');
	console_log('now starting...');

	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PcsLine',
		sorters: [{
	        property: 'unique_id',
	        direction: 'DESC'
	    }]
	});
	store.proxy.extraParams.menu = 'EPC3';
	store.load(function() {


	    
		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );    			
		    			
		    grid = Ext.create('Ext.grid.Panel', {
		    		title: 'Detail Work List',
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        selModel: selModel,
			        stateId: 'stateGridBom'+ /*(G)*/vCUR_MENU_CODE,
	                region: 'east',
	                width:'80%',
			        height: getCenterPanelHeight(),
			        
			        bbar: getPageToolbar(store),	        
			        
			        dockedItems: [{
			        	xtype: 'toolbar',
				      	items:  getProjectToolbarSimple(true)
			        }],

			        columns: /*(G)*/vCENTER_COLUMNS,
			        viewConfig: {
			            plugins: {
			                ptype: 'gridviewdragdrop',
			                dragGroup: 'moveWork'
			            },
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
			                	console_log('deselection start');
			                	grid.getSelectionModel().deselectAll()
			                    console_log('deselection end');
			                    //contextMenu.showAt(e.getXY());
			                    return false;
			                }
			            }
			        }
			    });
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	selectionLength = selections.length;
		            if (selections.length) {
		            	//grid info 켜기 
		    	    	//make uidlist
		            	
		            	uidList = "";
		    	        var selections = grid.getSelectionModel().getSelection();
		    	        if (selections) {
		    	            	for(var i=0; i< selections.length; i++) {
		    	            		var rec = selections[i];
		    	            		var unique_uid = rec.get('unique_id');
		    	            		if(uidList=='') {
		    	            			uidList = unique_uid;
		    	            		} else {
		    	            			uidList = uidList + ',' + unique_uid;
		    	            		}
		    	            	}	
		    	            
		    	        }

		            	displayProperty(selections[0]);
		    	        //alert('clicked');
		            	
		            	if(fPERM_DISABLING()==true) {
		            	}else{
		            	}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            	}else{
		            	}
		            }
		        }
		    });
//		    grid.on('beforeitemdblclick',function(view,record){
//		        if(view.getSelectionModel().getSelection().length > 1){
//		            view.select(record);
//		        }
//		    });
		    
			/*var main =  Ext.create('Ext.panel.Panel', {
				height: getCenterPanelHeight(),
			    layout:'border',
			    border: false,
			    layoutConfig: {columns: 2, rows:1},
			    defaults: {
			        collapsible: true,
			        split: true,
			        cmargins: '5 0 0 0',
			        margins: '0 0 0 0'
			    },
			    items: [  grid, psTreeGrid
	           ]
			});
		fLAYOUT_CONTENT(main);*/
		fLAYOUT_CONTENTMulti([grid,psTreeGrid]);  
		cenerFinishCallback();//Load Ok Finish Callback
		});
	
});	//OnReady



