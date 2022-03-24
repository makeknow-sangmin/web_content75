

//global var.
var grid = null;
var store = null;

//검색필드정의: define search field
searchField = 
	[
	'unique_id',
	'item_code',
	'item_name',
	'specification',
	'uid_comast'
	];

MessageBox = function(){
    return {
        msg : function(format){
            return Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
        }
    };
}();

function resetParam() {
	store.getProxy().setExtraParam('unique_id', '');
	store.getProxy().setExtraParam('item_code', '');
	store.getProxy().setExtraParam('item_name', '');
	store.getProxy().setExtraParam('specification', '');
	store.getProxy().setExtraParam('unique_uid', '');
}

function srchSingleHandler (widName, parmName, isWild) {

	resetParam();
	var val = Ext.getCmp(widName).getValue();
	var enValue = Ext.JSON.encode(val);
	store.getProxy().setExtraParam("srch_type", 'single');
	if(isWild) {
		val = '%' + enValue + '%';
	}

	store.getProxy().setExtraParam(parmName, val);
	store.load(function() {});
};

var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');

        			SrcAhd.load(unique_id ,{
        				 success: function(srcahd) {
        					 	var unique_id = srcahd.get('unique_id');
//        					 	var unique_id_long = srcahd.get('unique_id_long');
        						var item_code = srcahd.get('item_code');
        						var item_name = srcahd.get('item_name');
        						var specification = srcahd.get('specification'  );
        						var description = srcahd.get('description' );
        						var stock_qty = srcahd.get('stock_qty' );
        						var sales_price = srcahd.get('sales_price');
        						var lead_time = srcahd.get('lead_time');
        						var create_date = srcahd.get('create_date');
        						
        						var lineGap = 30;
        				    	var form = Ext.create('Ext.form.Panel', {
        				    		id: 'formPanel',
        				            layout: 'absolute',
        				            url: 'save-form.php',
        				            defaultType: 'displayfield',
        				            border: false,
        				            bodyPadding: 15,
        				            defaults: {
        				                anchor: '100%',
        				                allowBlank: false,
        				                msgTarget: 'side',
        				                labelWidth: 100
        				            },
        				            items: [{
        				        fieldLabel: 'unique_id',
							    value: unique_id,
							    x: 5,
							    y: 0 + 1*lineGap,
							    name: 'unique_id',
							    anchor: '-5'  // anchor width by percentage
							},{
								fieldLabel: 'item_code',
								value: item_code,
								x: 5,
								y: 0 + 2*lineGap,
								name: 'item_code',
								anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'item_name.',
        				    	value: item_name,
        				    	x: 5,
        				    	y: 0 + 3*lineGap,
        				    	name: 'item_name',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'specification.',
        				    	value: specification,
        				    	x: 5,
        				    	y: 0 + 4*lineGap,
        				    	name: 'specification',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'description.',
        				    	value: description,
        				    	x: 5,
        				    	y: 0 + 5*lineGap,
        				    	name: 'description',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'stock_qty.',
        				    	value: stock_qty,
        				    	x: 5,
        				    	y: 0 + 6*lineGap,
        				    	name: 'stock_qty',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'sales_price.',
        				    	value: sales_price,
        				    	x: 5,
        				    	y: 0 + 7*lineGap,
        				    	name: 'sales_price',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'lead_time.',
        				    	value: lead_time,
        				    	x: 5,
        				    	y: 0 + 8*lineGap,
        				    	name: 'lead_time',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'create_date.',
        				    	value: create_date,
        				    	x: 5,
        				    	y: 0 + 9*lineGap,
        				    	name: 'create_date',
        				    	anchor: '-5'  // anchor width by percentage
        				    }
        				    ]
        				        }); //endof form

        				        var win = Ext.create('ModalWindow', {
        				            title: CMD_VIEW,
        				            width: 700,
        				            height: 400,
        				            minWidth: 250,
        				            minHeight: 180,
        				            layout: 'fit',
        				            plain:true,
        				            items: form,
        				            buttons: [{
        				                text: CMD_OK,
        				            	handler: function(){
        				                       	if(win) 
        				                       	{
        				                       		win.close();
        				                       	} 
        				                  }
        				            }]
        				        });
        				        win.show();
        						//endofwin
        				 }//endofsuccess
        			 });//emdofload
        	
        };

//writer define
Ext.define('SrcAhd.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	data[0].cmdType = 'update';
        request.params = data[0];
        return request;
    }
});



function deleteConfirm(btn){

    var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_uid');
	           	var srcahd = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'SrcAhd');
        		
	           	srcahd.destroy( {
	           		 success: function() {}
	           	});
           	
        	}
        	grid.store.remove(selections);
        }

    }
};

//Define Remove Action
var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: CMD_DELETE,
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: delete_msg_content,
            buttons: Ext.MessageBox.YESNO,
            fn: deleteConfirm,
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});

//Define Detail Action
var detailAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: viewHandler
});

//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ removeAction]
});





Ext.onReady(function() {  
	Ext.define('SrcAhd', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/purchase/material.do?method=readMypart', /*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/purchase/material.do?method=createMypart', /*create record, update*/
//		            update: CONTEXT_PATH + '/purchase/material.do?method=update',
		            destroy: CONTEXT_PATH + '/purchase/material.do?method=destroyMypart' /*delete*/
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
	
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'SrcAhd',
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
			     // paging bar on the bottom
			        
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                   removeAction, '->'
	      				       ]
			        }
			        ],
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
						//grid info 켜기
						displayProperty(selections[0]);
						if(fPERM_DISABLING()==true) {
			            	removeAction.disable();
			            	detailAction.disable();
						}else{
							removeAction.enable();
			            	detailAction.enable();
						}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	detailAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	detailAction.disable();
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
     
