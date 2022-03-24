/*

SPS1 - 래현	상품재고현황
*/
Ext.require([
    'Ext.grid.*',
    'Ext.data.*'
]);

var sps1Fields = [
 	    { name: 'unique_id', 	type: "string"    }           
        ,{ name: 'item_code', 		type: "string"    }	//품목코드
        ,{ name: 'item_name', type: "string"    }		//품목명
        ,{ name: 'specification', type: "string"    }	//규격
        ,{ name: 'stock_qty', type: "double" }			//총재고
        ,{ name: 'maker_name', type: "string"}			//회사코드
        ,{ name: 'model_no', type: 'string'}			//모델명
        ,{ name: 'comment', type: 'string'}				//설명
        ,{ name: 'stock_type', type: 'string'}			//구분 M: 원자재, O:불용자재, S:고정자산, R:소모성, B:악성재고
        ,{ name: 'wh_code', type: 'string'}				//창고코드
        ,{ name: 'wh_name', type: 'string'}				//창고이름
        ,{ name: 'wh_qty', type: 'double'}				//창고재고
        //검색옵션
        ,{ name: 'srch_type', type: "string"    }//multi, single
  
];

var sps1Column =  [
        { text     : 'unique_id', 		width : 80,  sortable : true, dataIndex: 'unique_id' },
        { text	   : 'wh_code', 		width : 80,	 sortable : true, dataIndex: 'wh_code'},
        { text     : 'item_code',  		width : 80,  sortable : true, dataIndex: 'item_code'  },
        { text     : 'item_name', 	width : 80,  sortable : true, dataIndex: 'item_name'  },
        { text     : 'specification',  	width : 80,  sortable : true, dataIndex: 'specification'    },
        { text     : 'model_no',  width : 80,  sortable : true, dataIndex: 'model_no'  },
        { text     : 'comment',  width : 80,  sortable : true, dataIndex: 'comment'  },
        { text     : 'stock_qty',width : 80,  sortable : true, dataIndex: 'stock_qty'   },
        { text     : 'wh_qty',  	width : 80,  sortable : true, dataIndex: 'wh_qty'   }		            
 ];

var /*(G)*/vSRCH_TOOLTIP = [{
	    target: 'srchUnique_id',
	    html: 'unique_id'
    	,anchor: 'bottom',
    	trackMouse: true,
        anchorOffset: 10
	}, {
	    target: 'srchItem_code',
	    html: 'item_code'
    	,anchor: 'bottom',
    	trackMouse: true,
        anchorOffset: 10
	}, {
	    target: 'srchItem_name',
	    html: 'item_name'
    	,anchor: 'bottom',
    	trackMouse: true,
        anchorOffset: 10
	}, {
	    target: 'srchSpecification',
	    html: 'specification'
    	,anchor: 'bottom',
    	trackMouse: true,
        anchorOffset: 10
	}, {
	    target: 'srchMaker_name',
	    html: 'maker_name'
    	,anchor: 'bottom',
    	trackMouse: true,
        anchorOffset: 10
	},  {
	    target: 'srchModel_no',
	    html: 'model_no'
    	,anchor: 'bottom',
    	trackMouse: true,
        anchorOffset: 10
	},  {
	    target: 'srchComment',
	    html: 'comment'
    	,anchor: 'bottom',
    	trackMouse: true,
        anchorOffset: 10
	},  {
	    target: 'srchStock_type',
	    html: 'stock_type'
    	,anchor: 'bottom',
    	trackMouse: true,
        anchorOffset: 10
	}
];

//global var.
var grid = null;
var store = null;


var viewHandler = function() {
        			var rec = grid.getSelectionModel().getSelection()[0];
        			var unique_id = rec.get('unique_id');

        			Sps1.load(unique_id ,{
        				 success: function(sps1) {
        					 	var unique_id = sps1.get('unique_id');
        					 	var wh_code = sps1.get('wh_code');
        						var item_code = sps1.get('item_code');
        						var item_name = sps1.get('item_name');
        						var specification = sps1.get('specification');
        						var model_no = sps1.get('model_no');
        						var comment = sps1.get('comment');
        						var stock_qty = sps1.get('stock_qty');
        						var wh_qty = sps1.get('wh_qty');
        				        
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
        				    	fieldLabel: 'wh_code.',
        				    	value: wh_code,
        				    	x: 5,
        				    	y: 0 + 2*lineGap,
        				    	name: 'wh_code',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
								fieldLabel: 'item_code',
								value: item_code,
								x: 5,
								y: 0 + 3*lineGap,
								name: 'item_code',
								anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'item_name.',
        				    	value: item_name,
        				    	x: 5,
        				    	y: 0 + 4*lineGap,
        				    	name: 'item_name',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'specification.',
        				    	value: specification,
        				    	x: 5,
        				    	y: 0 + 5*lineGap,
        				    	name: 'specification',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'model_no.',
        				    	value: model_no,
        				    	x: 5,
        				    	y: 0 + 6*lineGap,
        				    	name: 'model_no',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'comment.',
        				    	value: comment,
        				    	x: 5,
        				    	y: 0 + 7*lineGap,
        				    	name: 'comment',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'stock_qty.',
        				    	value: stock_qty,
        				    	x: 5,
        				    	y: 0 + 8*lineGap,
        				    	name: 'stock_qty',
        				    	anchor: '-5'  // anchor width by percentage
        				    },{
        				    	fieldLabel: 'wh_qty.',
        				    	value: wh_qty,
        				    	x: 5,
        				    	y: 0 + 9*lineGap,
        				    	name: 'wh_qty',
        				    	anchor: '-5'  // anchor width by percentage
        				    }]
        				        }); //endof form

        				        var win = Ext.create('ModalWindow', {
        				            title: CMD_VIEW,
        				            width: 700,
        				            height: 350,
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
        				        //store.load(function() {});
        				        win.show();
        						//endofwin
        				 }//endofsuccess
        			 });//emdofload
        	
        };

var editHandler = function() {
                			var rec = grid.getSelectionModel().getSelection()[0];
                			var unique_id = rec.get('unique_id');

                			Sps1.load(unique_id ,{
                				 success: function(sps1) {
                					 var unique_id = sps1.get('unique_id');
                					 var wh_code = sps1.get('wh_code');
                					 var item_code = sps1.get('item_code');
                					 var item_name = sps1.get('item_name');
                					 var specification = sps1.get('specification');
                					 var model_no = sps1.get('model_no');
                					 var comment = sps1.get('comment');
                					 var stock_qty = sps1.get('stock_qty');
                					 var wh_qty = sps1.get('wh_qty');
                				     
                					 	var lineGap = 30;
                						
                				    	var form = Ext.create('Ext.form.Panel', {
                				    		id: 'formPanel',
                				            layout: 'absolute',
                				            url: 'save-form.php',
                				            defaultType:  'textfield',
                				            border: false,
                				            bodyPadding: 15,
                				            defaults: {
                				                anchor: '100%',
                				                allowBlank: false,
                				                msgTarget: 'side',
                				                labelWidth: 100
                				            },
                				            items: [ 
											{
											    fieldLabel: 'unique_id',
											    value: unique_id,
											    x: 5,
											    y: 0 + 1*lineGap,
											    name: 'unique_id',
								                readOnly: true,
								    			fieldStyle: 'background-color: #E7EEF6; background-image: none;',
											    anchor: '-5'  // anchor width by percentage
											},{
	            				                fieldLabel: 'wh_code',
	            				                value: wh_code,
	            				                x: 5,
	            				                y: 0 + 2*lineGap,
	            				                name: 'wh_code',
	            				                anchor: '-5'  // anchor width by percentage
	                				        },{
	                				        	fieldLabel: 'item_code',
	                				        	value: item_code,
	                				        	x: 5,
	                				        	y: 0 + 3*lineGap,
	                				        	name: 'item_code',
	                				        	anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: 'item_name',
                				                value: item_name,
                				                x: 5,
                				                y: 0 + 4*lineGap,
                				                name: 'item_name',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: 'specification',
                				                value: specification,
                				                x: 5,
                				                y: 0 + 5*lineGap,
                				                name: 'specification',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: 'model_no',
                				                value: model_no,
                				                x: 5,
                				                y: 0 + 6*lineGap,
                				                name: 'model_no',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: 'comment',
                				                value: comment,
                				                x: 5,
                				                y: 0 + 7*lineGap,
                				                name: 'comment',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: 'stock_qty',
                				                value: stock_qty,
                				                x: 5,
                				                y: 0 + 8*lineGap,
                				                name: 'stock_qty',
                				                anchor: '-5'  // anchor width by percentage
                				            },{
                				                fieldLabel: 'wh_qty',
                				                value: wh_qty,
                				                x: 5,
                				                y: 0 + 9*lineGap,
                				                name: 'wh_qty',
                				                anchor: '-5'  // anchor width by percentage
                				            }
                				            ]
                				        }); //endof form

                				        var win = Ext.create('ModalWindow', {
                				            title: CMD_MODIFY,
                				            width: 700,
                				            height: 350,
                				            minWidth: 250,
                				            minHeight: 180,
                				            layout: 'fit',
                				            plain:true,
                				            items: form,
                				            buttons: [{
                				                text: CMD_OK,
                				            	handler: function(){
                				                    var form = Ext.getCmp('formPanel').getForm();
                				                    if(form.isValid())
                				                    {
                				                	var val = form.getValues(false);
                				                	var sps1 = Ext.ModelManager.create(val, 'Sps1');
                				                	
                				            		//저장 수정
                				                	sps1.save({
                				                		success : function() {
                				                			//console_log('updated');
                				                           	if(win) 
                				                           	{
                				                           		win.close();
                				                           		store.load(function() {});
                				                           	} 
                				                		} 
                				                	 });
                				                	
                				                       	if(win) 
                				                       	{
                				                       		win.close();
                				                       	} 
                				                    } else {
                				                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                				                    }
                				                    


                				                  }
                				            },{
                				                text: CMD_CANCEL,
                				            	handler: function(){
                				            		if(win) {win.close();} }
                				            }]
                				        });
                				        win.show();
                						//endofwin
                				 }//endofsuccess
                			 });//emdofload
                	
                };

//writer define
Ext.define('Sps1.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	//console_info(data);
    	//console_info(data[0]);
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
        		var unique_id = rec.get('unique_id');
	           	 var sps1 = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'Sps1');
        		
	           	sps1.destroy( {
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

//Define Add Action
var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: CMD_ADD,
    disabled: fPERM_DISABLING(),
    handler: function(widget, event) {

		var lineGap = 30;
    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            layout: 'absolute',
            url: 'save-form.php',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
             items: [ 
            {
                fieldLabel: 'wh_code',
                x: 5,
                y: 0 + 1*lineGap,
                name: 'wh_code',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: 'item_code',
                x: 5,
                y: 0 + 2*lineGap,
                name: 'item_code',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: 'item_name',
                x: 5,
                y: 0 + 3*lineGap,
                name: 'item_name',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: 'specification',
                x: 5,
                y: 0 + 4*lineGap,
                name: 'specification',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: 'model_no',
                x: 5,
                y: 0 + 5*lineGap,
                name: 'model_no',
                anchor: '-5'  // anchor width by percentage
            },{
                fieldLabel: 'comment',
                x: 5,
                y: 0 + 6*lineGap,
                name: 'comment',
                anchor: '-5'  // anchor width by percentage
            },{
            	 xtype: 'numberfield',
                fieldLabel: 'stock_qty.',
                x: 5,
                y: 0 + 7*lineGap,
                name: 'stock_qty'
            },{
           	 xtype: 'numberfield',
             fieldLabel: 'wh_qty.',
             x: 5,
             y: 0 + 8*lineGap,
             name: 'wh1_qty'
         }]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + ' Sales',
            width: 700,
            height: 350,
            minWidth: 250,
            minHeight: 180,
            layout: 'fit',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
                	var val = form.getValues(false);
                   	 var sps1 = Ext.ModelManager.create(val, 'Sps1');
            		//저장 수정
                   	sps1.save({
                		success : function() {
                			//console_log('updated');
                           	if(win) 
                           	{
                           		win.close();
                           		store.load(function() {});
                           	}   	
                		} 
                	 });
                	 
                       	if(win) 
                       	{
                       		win.close();
                       	} 
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }

                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {win.close();} }
            }]
        });
		win.show(this, function() {
		    //button.dom.disabled = false;
		});
     }
});

//Define Edit Action
var editAction = Ext.create('Ext.Action', {
	itemId: 'editButton',
    iconCls: 'pencil',
    text: edit_text,
    disabled: true ,
    handler: editHandler
});

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
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
    items: [ detailAction, editAction, removeAction  ]
});


Ext.define('Sps1', {
    	 extend: 'Ext.data.Model',
    	 fields: sps1Fields,
    	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/sales/sps1.do?method=read', /*1recoed, search by cond, search */
		            create: CONTEXT_PATH + '/sales/sps1.do?method=create', /*create record, update*/
		            update: CONTEXT_PATH + '/sales/sps1.do?method=update',
		            destroy: CONTEXT_PATH + '/sales/sps1.do?method=destroy' /*delete*/
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
	//alert("ok");
	console_log('now starting...');

	 //ComBst Store 정의
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'Sps1',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});

 	store.load(function() {
 		//Ext.get('MAIN_DIV_TARGET').update('');
		if(store.getCount()==0) {
			//alert('count==0');
			//Ext.MessageBox.alert("Check!!!!", "Check your login state. (로그인 했나요?)");
		} else {
			var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			/*var selModel = Ext.create('Ext.selection.CheckboxModel', {
			    listeners: {
			        selectionchange: function(sm, selections) {
			        	grid.down('#removeButton').setDisabled(selections.length == 0);
			        }
			    }
			});*/
			
			grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        ///COOKIE//stateful: true,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			        selModel: selModel,
			        autoScroll : true,
			        autoHeight : true,
			        //layout: 'fit',
			        height: getCenterPanelHeight(), 
			     // paging bar on the bottom
			        
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			            dock: 'top',
			            xtype: 'toolbar',
			            items: [
			                    searchAction
			                    , '-',  addAction,  '-', removeAction,
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
			        {
			            xtype: 'toolbar',
			            items: [
								{
			                        xtype: 'triggerfield',
			                        emptyText: 'unique_id',
			                        id: 'srchUnique_id',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchUnique_id', 'unique_id', false);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchUnique_id').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchUnique_id', 'unique_id', false);
			                    	}
								},
								'-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'item_code',
			                        id: 'srchItem_code',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchItem_code', 'item_code', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchItem_code').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchItem_code', 'item_code', true);
			                    	}
			                    },
			                    '-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'item_name',
			                        id: 'srchItem_name',
			                        listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchItem_name', 'item_name', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchItem_name').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchItem_name', 'item_name', true);
			                    	}
			                    	
			                    },
								'-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'specification',
			                        id: 'srchSpecification',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchSpecification', 'specification', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchSpecification').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchSpecification', 'specification', true);
			                    	}
			                    }
			                    ]
			        },
			        {
			        	xtype: 'toolbar',
			            items: [
								
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'maker_name',
			                        id: 'srchMaker_name',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchMaker_name', 'maker_name', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchMaker_name').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchMaker_name', 'maker_name', true);
			                    	}
			                    },
								'-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'model_no',
			                        id: 'srchModel_no',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchModel_no', 'model_no', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchModel_no').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchModel_no', 'model_no', true);
			                    	}
			                    },
								'-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'comment',
			                        id: 'srchComment',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchComment', 'comment', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchComment').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchComment', 'comment', true);
			                    	}
			                    },
								'-',
			                    {
			                        xtype: 'triggerfield',
			                        emptyText: 'stock_type',
			                        id: 'srchStock_type',
			                    	listeners : {
				    	            		specialkey : function(field, e) {
				    	            		if (e.getKey() == Ext.EventObject.ENTER) {
				    	            			srchSingleHandler ('srchStock_type', 'stock_type', true);
				    	            		}
				    	            	}
				                	},
			                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			                        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
			                        'onTrigger1Click': function() {
			                        	Ext.getCmp('srchStock_type').setValue('');
			                    	},
			                        'onTrigger2Click': function() {
			                        	srchSingleHandler ('srchStock_type', 'stock_type', true);
			                    	}
			                    }
			                    
			                    ,
			                    '->', 

			                    {
			                        text: 'First Division',
			                        iconCls: 'number01',
			                        menu: {
			                            items: [
			                                {
			                                    text: 'First Division',
			                                    iconCls: 'number01'
			                                },
			                                {
			                                    text:  'Second Division',
			                                    iconCls: 'number02'
			                                },
			                                {
			                                    text:  'Third Division',
			                                   iconCls: 'number03'
			                                },
			                                {
			                                    text:  'Fourth Division',
			                                   iconCls: 'number04'
			                                }
			                            ]
			                        }
			                    }

			                 ]
			        }
			        
			        ],
			        columns: sps1Column,
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
			                itemdblclick: viewHandler /* function(dv, record, item, index, e) {
			                    alert('working');
			                }*/

			            }
			        },
			        title: getMenuTitle()
			        //renderTo: 'MAIN_DIV_TARGET'
			    });
			fLAYOUT_CONTENT(grid);
			
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		            if (selections.length) {
						//grid info 켜기
						displayProperty(selections[0]);
						
						if(fPERM_DISABLING()==true) {
			            	removeAction.disable();
			            	editAction.disable();
						}else{
							removeAction.enable();
			            	editAction.enable();
						}
						detailAction.enable();
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		collapseProperty();//uncheck no displayProperty
			            	removeAction.disable();
			            	editAction.disable();
		            	}else{
		            		collapseProperty();//uncheck no displayProperty
		            		removeAction.disable();
			            	editAction.disable();
		            	}
		            	detailAction.enable();
		            }
		        }
		    });

		    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		    });
		    
		}//endof else
		
		cenerFinishCallback();//Load Ok Finish Callback
	}); //store load
 	 	
});	//OnReady
     
