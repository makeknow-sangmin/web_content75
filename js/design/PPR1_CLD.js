//global var.
var grid = null;
var store = null;

//검색필드정의: define search field
searchField = 
	[
	'unique_id',
	'parent',
	'ac_uid',
	'pj_code',
	'class_code1',
	'class_code',
	'pl_no',
	'item_name',
	'description',
	'specification',
	'model_no',
	'comment',
	'maker_name',
	'quan',
	'unit_code',
	'sales_price',
	'currency'	
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
	store.getProxy().setExtraParam('parent', '');
	store.getProxy().setExtraParam('ac_uid', '');
	store.getProxy().setExtraParam('pl_no', '');
	store.getProxy().setExtraParam('item_name', '');
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

Ext.define('PartLine', {
  	 extend: 'Ext.data.Model',
  	 fields: /*(G)*/vCENTER_FIELDS,
  	    proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/production/pcsrequest.do?method=cloudread',
		            create: CONTEXT_PATH + '/production/pcsrequest.do?method=create', /*create record, update*/
		            destroy: CONTEXT_PATH + '/production/pcsrequest.do?method=destroy' /*delete*/
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

var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');

        			PartLine.load(unique_id ,{
        				 success: function(srcahd) {
        					 	var unique_id = srcahd.get('unique_id');
        						var parent = srcahd.get('parent');
        						var ac_uid = srcahd.get('ac_uid');
        						var pj_code = srcahd.get('pj_code' );
        						var class_code1 = srcahd.get('class_code1'  );
        						var class_code = srcahd.get('class_code' );
        						var pl_no = srcahd.get('pl_no');
        						var item_name = srcahd.get('item_name');
        						var description = srcahd.get('description');
        						var specification = srcahd.get('specification');
        						var model_no = srcahd.get('model_no');
        						var comment = srcahd.get('comment');
        						var specification = srcahd.get('specification');
        						var maker_name = srcahd.get('maker_name');
        						var quan = srcahd.get('quan');
        						var unit_code = srcahd.get('unit_code');
        						var sales_price = srcahd.get('sales_price');
        						var currency = srcahd.get('currency');
        				        
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
								fieldLabel: 'parent',
								value: parent,
								x: 5,
								y: 0 + 2*lineGap,
								name: 'parent',
								anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'ac_uid.',
        				    	value: ac_uid,
        				    	x: 5,
        				    	y: 0 + 3*lineGap,
        				    	name: 'ac_uid',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'pj_code.',
        				    	value: pj_code,
        				    	x: 5,
        				    	y: 0 + 4*lineGap,
        				    	name: 'pj_code',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'class_code1.',
        				    	value: class_code1,
        				    	x: 5,
        				    	y: 0 + 5*lineGap,
        				    	name: 'class_code1',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'class_code.',
        				    	value: class_code,
        				    	x: 5,
        				    	y: 0 + 6*lineGap,
        				    	name: 'class_code',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'pl_no.',
        				    	value: pl_no,
        				    	x: 5,
        				    	y: 0 + 7*lineGap,
        				    	name: 'pl_no',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'item_name.',
        				    	value: item_name,
        				    	x: 5,
        				    	y: 0 + 8*lineGap,
        				    	name: 'item_name',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'description.',
        				    	value: description,
        				    	x: 5,
        				    	y: 0 + 9*lineGap,
        				    	name: 'description',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'specification.',
        				    	value: specification,
        				    	x: 5,
        				    	y: 0 + 10*lineGap,
        				    	name: 'specification',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'model_no.',
        				    	value: comment,
        				    	x: 5,
        				    	y: 0 + 11*lineGap,
        				    	name: 'comment',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'comment.',
        				    	value: comment,
        				    	x: 5,
        				    	y: 0 + 12*lineGap,
        				    	name: 'comment',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'specification.',
        				    	value: maker_name,
        				    	x: 5,
        				    	y: 0 + 13*lineGap,
        				    	name: 'maker_name',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'maker_name.',
        				    	value: maker_name,
        				    	x: 5,
        				    	y: 0 + 14*lineGap,
        				    	name: 'maker_name',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'quan.',
        				    	value: quan,
        				    	x: 5,
        				    	y: 0 + 15*lineGap,
        				    	name: 'quan',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'unit_code.',
        				    	value: unit_code,
        				    	x: 5,
        				    	y: 0 + 16*lineGap,
        				    	name: 'unit_code',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'sales_price.',
        				    	value: sales_price,
        				    	x: 5,
        				    	y: 0 + 17*lineGap,
        				    	name: 'sales_price',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'currency.',
        				    	value: currency,
        				    	x: 5,
        				    	y: 0 + 18*lineGap,
        				    	name: 'currency',
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
Ext.define('PartLine.writer.SinglePost', {
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
	           	var partline = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'PartLine');
        		
	           	partline.destroy( {
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
            icon: Ext.MessageBox.QUESTION
        });
    }
});
//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ removeAction, ]
});

Ext.onReady(function() {  
	 //ComBst Store 정의
	
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'PartLine',
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
			                   removeAction, 
	      				        '->', 
	      				            {
	      				                iconCls: 'tasks-show-all',
	      				                tooltip: 'All',
	      				                toggleGroup: 'status'
	      				            },
	      				            {
	      				                iconCls: 'tasks-show-active',
	      				                tooltip: 'Current',
	      				                toggleGroup: 'status'
	      				            },
	      				            {
	      				                iconCls: 'tasks-show-complete',
	      				                tooltip: 'Past',
	      				                toggleGroup: 'status'
	      				            }
	      				          
	      				          ]
			        },
			        
			        ],
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
		            	displayProperty(selections[0]);
		            	
		            	if(fPERM_DISABLING()==true) {
		            		removeAction.disable();
		            	}else{
		            		removeAction.enable();
		            	}
		            } else {
		            	if(fPERM_DISABLING()==true) {
			            	collapseProperty();
			            	removeAction.disable();
		            	}else{
		            		collapseProperty();
			            	removeAction.disable();
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
     
