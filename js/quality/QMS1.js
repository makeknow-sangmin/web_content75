
var store = null;
var grid = null;
var storePrchStock = null;
var gridPrchStock = null;

var togIsInStock = true;

var selected_unique_id = '';
var selected_barcode = '';
var selected_item_code = '';
var selected_description = '';
var selected_item_name = '';
var selected_maker_name = '';
var selected_model_no = '';
//var selected_comment = record.get('comment');
var selected_specification = '';
var selected_unit_code = '';

var selected_stoqty_uid = '';
var selected_whouse_uid = '';
var selected_pj_uid = '';

searchField = 
	[
	'barcode',
	'item_code',
	'item_name',
	'specification',
	'description'
	];

function findByBarcode(id) {
	var barcode = Ext.getCmp(id).getValue();
	   store.getProxy().setExtraParam('unique_id', barcode);
		store.load(function(records) {
			if(records==null || records.length==0) {

			}else if(records.length==1) {
				grid.getView().select(0);
			} else {

			}
		});
}

function disableGoodsoutBtn(disable) {
	var o_wh_qty_ =  Ext.getCmp('wh_qty_');
	var o_goodsOutBtn = Ext.getCmp('goodsOutBtn');
		
	o_wh_qty_.setDisabled(disable);
	o_goodsOutBtn.setDisabled(disable);
}

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchToolBarTap
});

function resetGrinField() {
	selected_unique_id = '';
	selected_barcode = '';
	selected_item_code = '';
	selected_description = '';
	selected_item_name = '';
	selected_maker_name = '';
	selected_model_no = '';
	//selected_comment = '';
	selected_specification = '';
	selected_unit_code = '';
	
	Ext.getCmp('barcode').setValue(selected_barcode);
	Ext.getCmp('unique_id').setValue(selected_unique_id);
	Ext.getCmp('item_code').setValue(selected_item_code);
	Ext.getCmp('description').setValue(selected_description);
	Ext.getCmp('item_name').setValue(selected_item_name);
	Ext.getCmp('maker_name').setValue(selected_maker_name);
	Ext.getCmp('model_no').setValue(selected_model_no);
	Ext.getCmp('unit_code').setValue(selected_unit_code);
	Ext.getCmp('specification').setValue(selected_specification);
	Ext.getCmp('wh_qty').setValue('1');
	Ext.getCmp('barcode_').setValue(selected_barcode);
	Ext.getCmp('item_code_').setValue(selected_item_code);
	Ext.getCmp('description_').setValue(selected_description);
	Ext.getCmp('item_name_').setValue(selected_item_name);
	Ext.getCmp('maker_name_').setValue(selected_maker_name);
	Ext.getCmp('model_no_').setValue(selected_model_no);
	Ext.getCmp('unit_code_').setValue(selected_unit_code);
	Ext.getCmp('specification_').setValue(selected_specification);
	Ext.getCmp('wh_qty').setValue('1');
	
	gridPrchStock.setTitle('Position');
	
	storePrchStock.getProxy().setExtraParam('uid_srcahd', '-1');
	storePrchStock.load(function() {
		var o_wh_qty_ =  Ext.getCmp('wh_qty_');
		selected_stoqty_uid = '';
		selected_whouse_uid =  '';
		selected_pj_uid =  '';
		
		disableGoodsoutBtn(true);
		o_wh_qty_.setValue(1);
	});
}

function setGridRecord(record) {
	console_log(record);
	selected_unique_id = record.get('unique_id');
	selected_barcode = record.get('barcode');
	selected_item_code = record.get('item_code');
	selected_description = record.get('description');
	
	selected_item_name = record.get('item_name');
	selected_maker_name = record.get('maker_name');
	selected_model_no = record.get('model_no');
	//selected_comment = record.get('comment');
	selected_specification = record.get('specification');
	selected_unit_code = record.get('unit_code');
	
	Ext.getCmp('barcode').setValue(selected_barcode);
	Ext.getCmp('unique_id').setValue(selected_unique_id);
	Ext.getCmp('item_code').setValue(selected_item_code);
	Ext.getCmp('description').setValue(selected_description);
	Ext.getCmp('item_name').setValue(selected_item_name);
	Ext.getCmp('maker_name').setValue(selected_maker_name);
	Ext.getCmp('model_no').setValue(selected_model_no);
	Ext.getCmp('unit_code').setValue(selected_unit_code);
	Ext.getCmp('specification').setValue(selected_specification);
	
	
	Ext.getCmp('barcode_').setValue(selected_barcode);
	Ext.getCmp('item_code_').setValue(selected_item_code);
	Ext.getCmp('description_').setValue(selected_description);
	Ext.getCmp('item_name_').setValue(selected_item_name);
	Ext.getCmp('maker_name_').setValue(selected_maker_name);
	Ext.getCmp('model_no_').setValue(selected_model_no);
	Ext.getCmp('unit_code_').setValue(selected_unit_code);
	Ext.getCmp('specification_').setValue(selected_specification);
	
	gridPrchStock.setTitle('[' + selected_barcode + '] ' + selected_item_name);
	
//	var o_maker_name = Ext.getCmp('maker_name');
//	o_maker_name.setReadOnly(true);
//	o_maker_name.setFieldStyle('background-color: #EAEAEA; background-image: none;');
//	
	storePrchStock.getProxy().setExtraParam('uid_srcahd', selected_unique_id);
	storePrchStock.load(function() {
		var o_wh_qty_ =  Ext.getCmp('wh_qty_');
		selected_stoqty_uid = '';
		selected_whouse_uid =  '';
		selected_pj_uid =  '';
		
		disableGoodsoutBtn(true);
		o_wh_qty_.setValue(1);
	});
}


Ext.onReady(function() {  
	makeSrchToolbar(searchField);

	var defWhouseUid = -1;
	//var wHouseStore = Ext.create('Mplm.store.WareHouseStore', {hasNull: false} );
	Ext.create('Mplm.store.WareHouseStore', {hasNull: false} ).load( function(records) {
		

		var datas = [];
        for (var i=0; i<records.length; i++){ 
               	var obj = records[i];
               	console_log('unique_id:' + obj.get('unique_id'));
               	var wh_code = obj.get('wh_code');
               	console_log('wh_code:' + wh_code);
               	
            	var o = {};
            	o['unique_id'] = obj.get('unique_id');
            	o['wh_code'] = obj.get('wh_code');
            	o['wh_name'] = obj.get('wh_name');
               	datas.push(o);
               	
               	if(i==0) {
               		defWhouseUid = obj.get('unique_id');
               	}
        }
	
	
	var wHouseStore = Ext.create('Ext.data.Store', {
		fields:[     
		 	      { name: 'unique_id', type: "string" }
		 	     ,{ name: 'wh_code', type: "string"  }
		 	     ,{ name: 'wh_name', type: "string"  }
		 	  ],
              data   : datas
          });
	
		
		Ext.define('StockLine', {
		   	 extend: 'Ext.data.Model',
		   	 fields: /*(G)*/vCENTER_FIELDS_SUB,
		   	    proxy: {
						type: 'ajax',
				        api: {
				        	read: CONTEXT_PATH + '/inventory/prchStock.do?method=readQty'
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
		
		Ext.define('SrcAhd', {
		   	 extend: 'Ext.data.Model',
		   	 fields: /*(G)*/vCENTER_FIELDS,
		   	    proxy: {
						type: 'ajax',
				        api: {
				            read: CONTEXT_PATH + '/inventory/prchStock.do?method=read'
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
			        stateId: 'stateGrid',
			        selModel: selModel,
			        autoScroll : true,
			        autoHeight: true,
			        height: getCenterPanelHeight(),
			     // paging bar on the bottom
			        
			        bbar: getPageToolbar(store),
			        
			        dockedItems: [{
			        	xtype: 'toolbar',
			        	items: [
									{
										xtype: 'checkboxfield',
										fieldLabel: pms1_stock_query,
									    id: 'checkboxStockOnly',
									    labelWidth: 60,
									    checked: true,
									    inputValue: '-1',
									    listeners:{
									   change:function(checkbox, checked){
										   if(checked == false){
											   store.getProxy().setExtraParam('has_stock',"N");		
										   }else{
											   store.getProxy().setExtraParam('has_stock',"Y");		
										   }
									   }
									}
									},
									'-',
									searchAction
						        	        
			        	        
			        	        ]
			        },{
			        	xtype: 'toolbar',
			        	items: /*(G)*/vSRCH_TOOLBAR
			        }
	//		        ,{
	//		        	xtype: 'toolbar',
	//		        	items: StockLineToolBarCombo
	//		        }
			        
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
			storePrchStock = new Ext.data.Store({  
				pageSize: getPageSize(),
				model: 'StockLine',
			    extraParams : {
			    	//wh_code: wh_code
			    },
				sorters: [{
		           property: 'wh_code',
		           direction: 'ASC'
		       }]
			});
	
			var selModelS = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
	
			gridPrchStock = Ext.create('Ext.grid.Panel', {
	//			id : 'tempport',
		        region: 'center',
		        store: storePrchStock,
		        multiSelect: true,
		        stateId: 'stateGrid11111' + /*(G)*/vCUR_MENU_CODE,
		        selModel: selModelS,
		        autoScroll : true,
		        autoHeight: true,
	            collapsible: false,
	            floatable: false,
	            split: false,
	            border: true,
		    	height: 200,		
		        columns: /*(G)*/vCENTER_COLUMN_SUB,
		        viewConfig: {
		            stripeRows: true,
		            enableTextSelection: true,
		            listeners: {
		                itemcontextmenu: function(view, rec, node, index, e) {
		                    e.stopEvent();
		                    contextMenu.showAt(e.getXY());
		                    return false;
		                }
	
		            }
		        },
		        title: 'Position'
	
		    });
		
		    var goodsIn =  Ext.create('Ext.panel.Panel', {
		    	height: getCenterPanelHeight() - 200,
		    	bodyPadding: 5,
		        border: false,
	            collapsible: false,
	            floatable: false,
	            split: true,
		        autoScroll : true,
		        autoHeight: true,
	            width:800,
		        defaults: {
		            anchor: '100%',
		            allowBlank: true,
		            msgTarget: 'side',
		            labelWidth: 80
		        },
	            fieldDefaults: {
	            	 labelWidth: 90, labelAlign: 'right', anchor:'95%' 
	            },
	            defaultType: 'textfield',
	
	            items: [
				{
		     		xtype: 'container',
		             flex: 1,
		             layout: 'hbox',
		             margin: 5,
				    items: [
				            {	
									xtype:  'textfield',
									flex: 1,
									 labelWidth: 80,
								   fieldLabel:    getColName('barcode'),
								    allowBlank: true,
								    id:          'barcode',
								    name:        'barcode'
							   }, {
							       text: CMD_FIND,
							       xtype: 'button',
							       listeners: {
							    	   keypress: {
						        			buffer: 500,
						        			fn: function(field){
						        				var value = field.getValue();
						        				if (value !== null && field.isValid()) {
						        				}
						        			}
						        		},
						        		specialkey : function(fieldObj, e) {
							         		if (e.getKey() == Ext.EventObject.ENTER) {
							         			 findByBarcode('barcode');
							         		}
								        }
							       },
							       handler: function(btn){
							    	   console_log(btn);
							    	   findByBarcode('barcode');
										
							       }
							   }, {
							       text: CMD_INIT,
							       xtype: 'button',
							       handler: function(btn){
							    	   console_log(btn);
							    	   resetGrinField();
							       }
							   }
					    ]
				},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [
				   {
					   xtype:'label',
					   width: 85,
					   style: 'color: #222222;',
					   text: getColNameSub('wh_code') + ':'
				   },
				   {
					id :'whouse_uid',
	                name:           'whouse_uid',
					xtype:          'combo',
	                mode:           'local',
	                triggerAction:  'all',
	                width: 80,
	                forceSelection: true,
	                editable:       false,
	                allowBlank: false,
	                emptyText:  qgr1_whouse_choice,
	                displayField:   'wh_code',
	                valueField:     'unique_id',
	                queryMode: 'local',
	                value: defWhouseUid,
	                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	                store: wHouseStore
	        	},
	        	{	
	        		xtype: 'numberfield',
					flex: 1,
					 labelWidth: 40,
					 labelAlign: 'right',
				    fieldLabel:    getColNameSub('wh_qty'),
				    allowBlank: true,
				    value: 1,
				    minValue: 1,
				    id:          'wh_qty',
				    name:        'wh_qty'
		       },
		       {	
		   			xtype:  'textfield', 
					flex: 1,
					 labelWidth: 40,
					 labelAlign: 'right',
					fieldLabel:    getColName('unit_code'),
					name: 'unit_code',
					id:  'unit_code',
					fieldStyle: 'background-color: #FBF8E6; background-image: none;',
					anchor: '100%'  // anchor width by percentage
			       }]},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
		   			xtype:  'textfield', 
					flex: 1,
					 labelWidth: 80,
	                fieldLabel:    getColNameSub('stock_pos'),
	                name: 'stock_pos',
	                id:  'stock_pos',
	                anchor:'100%'  // anchor width by percentage
			       }]},
					{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
			   			xtype:  'textfield', 
						flex: 1,
						 labelWidth: 80,
		                fieldLabel:    getColNameSub('innout_desc'),
		                name: 'innout_desc',
		                id:  'innout_desc',
		                anchor:'100%'  // anchor width by percentage
				       }]},
						{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
				   			xtype:  'textfield', 
							flex: 1,
							 labelWidth: 80,
					fieldLabel:    getColName('item_code'),
					name: 'item_code',
					id:  'item_code',
					readOnly: true,
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
					anchor: '100%'  // anchor width by percentage
					       }]},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
			   			xtype:  'textfield', 
						flex: 1,
						 labelWidth: 80,
	                fieldLabel:    getColName('item_name'),
	                name: 'item_name',
	                id:  'item_name',
	                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	                anchor: '100%'  // anchor width by percentage
				       }]},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
				   			xtype:  'textfield', 
							flex: 1,
							 labelWidth: 80,
	                fieldLabel:    getColName('specification'),
	                name: 'specification',
	                id:  'specification',
	                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	                anchor: '100%'  // anchor width by percentage
					       }]},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
					   			xtype:  'textfield', 
								flex: 1,
								 labelWidth: 80,
	                fieldLabel:    getColName('description'),
	                name: 'description',
	                id:  'description',
	                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	                anchor: '100%'  // anchor width by percentage
						       }]},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
						   			xtype:  'textfield', 
									flex: 1,
									 labelWidth: 80,
	                fieldLabel:    getColName('maker_name'),
	                name: 'maker_name',
	                id:  'maker_name',
	                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	                anchor: '100%'  // anchor width by percentage
							       }]},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
							   			xtype:  'textfield', 
										flex: 1,
										 labelWidth: 80,
	                fieldLabel:    getColName('model_no'),
	                name: 'model_no',
	                id:  'model_no',
	                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	                anchor: '100%'
								       }]},
				{xtype: 'container',flex: 1,                                     
				layout: {
	                type:'vbox',
	                padding:'5',
	                align:'stretch'
	            },  items: [
		            {
		                text: CMD_OK,
		                xtype: 'button',
		                anchor: '100%' ,
		                handler: function(btn){
					    	   console_log(btn);
				    			var barcode = Ext.getCmp('barcode').getValue();
				    			var unique_id = Ext.getCmp('unique_id').getValue();
				    			var isNewPart = false;
				    			if(barcode==null || barcode=='') {
				    				isNewPart = true;
				    			} else if(unique_id!=barcode) {
				    				alert('not valid material');
				    				return;
				    			}
				    			
				    			if(isNewPart==true) {
				    				alert('not valid material');
					    			var item_code = Ext.getCmp('item_code').getValue();
					    			var description = Ext.getCmp('description').getValue();
					    			var item_name = Ext.getCmp('item_name').getValue();
					    			var maker_name = Ext.getCmp('maker_name').getValue();
					    			var model_no = Ext.getCmp('model_no').getValue();
					    			var unit_code = Ext.getCmp('unit_code').getValue();
					    			var specification = Ext.getCmp('specification').getValue();
					    			var stock_pos = Ext.getCmp('stock_pos').getValue();
					    			var innout_desc = Ext.getCmp('innout_desc').getValue();
					    			var wh_qty = Ext.getCmp('wh_qty').getValue();
					    			var whouse_uid = Ext.getCmp('whouse_uid').getValue();
					    			
				    			} else {
				    				alert('Goods in quantity :' + Ext.getCmp('wh_qty').getValue() );	
									Ext.Ajax.request({
										url: CONTEXT_PATH + '/inventory/prchStock.do?method=addQty',				
										params:{
											unique_id: unique_id,
											barcode: barcode,
							    			stock_pos : Ext.getCmp('stock_pos').getValue(),
							    			innout_desc : Ext.getCmp('innout_desc').getValue(),
							    			wh_qty : Ext.getCmp('wh_qty').getValue(),
							    			whouse_uid : Ext.getCmp('whouse_uid').getValue()
										},
										
										success : function(result, request) {
											var resultText = result.responseText;
											console_log('result:' + resultText);
											
											
											store.load(function() {});
											storePrchStock.load(function() {
												var o_wh_qty_ =  Ext.getCmp('wh_qty_');
												selected_stoqty_uid = '';
												selected_whouse_uid =  '';
												selected_pj_uid =  '';
												
												disableGoodsoutBtn(true);
												o_wh_qty_.setValue(1);
											});
											
											//alert('finished..');
											
										},
										failure: extjsUtil.failureMessage
									});
									
				    			}
				    			
				    			
		                }
		            } 
//		            ,
//		            {
//		                xtype: 'textarea',
//		                hideLabel: true,
//		                name: 'helpMsg',
//		                readOnly: true,
//		                rows: 3,
//		                value: 'barcode를 입력하지 않고 품명/규격 등을 입력한 후 \r\n[승인]하면 신규자재로 등록됩니다.',
//		        		fieldStyle: 'margin-top:10px;padding:5px;border-color:white; background-color: #EAEAEA; background-image: none;',
//		        		anchor: '100%' 
//		            }
	            ,	new Ext.form.Hidden({
						xtype:  'textfield',
						 id: 'unique_id',
						 name: 'unique_id',
						 value: -1
					})
	            ]}],
		        title: GET_MULTILANG('pms1_GIn', vLANG)
			});
		    
		    
		    var goodsOut =  Ext.create('Ext.panel.Panel', {
		    	height: getCenterPanelHeight() - 200,
		    	bodyPadding: 5,
		        border: false,
	            collapsible: false,
	            floatable: false,
	            split: true,
		        autoScroll : true,
		        autoHeight: true,
	            width:800,
		        defaults: {
		            anchor: '100%',
		            allowBlank: true,
		            msgTarget: 'side',
		            labelWidth: 80
		        },
	            fieldDefaults: {
	            	 labelWidth: 90, labelAlign: 'right', anchor:'95%' 
	            },
	            defaultType: 'textfield',
	
	            items: [
				{
		     		xtype: 'container',
		             flex: 1,
		             layout: 'hbox',
		             margin: 5,
				    items: [
				            {	
									xtype:  'textfield',
									flex: 1,
									 labelWidth: 80,
								   fieldLabel:    getColName('barcode'),
								    allowBlank: true,
								    id:          'barcode_',
								    name:        'barcode_'
							   }, {
							       text: CMD_FIND,
							       xtype: 'button',
							       listeners: {
							    	   keypress: {
						        			buffer: 500,
						        			fn: function(field){
						        				var value = field.getValue();
						        				if (value !== null && field.isValid()) {
						        				}
						        			}
						        		},
						        		specialkey : function(fieldObj, e) {
							         		if (e.getKey() == Ext.EventObject.ENTER) {
							         			 findByBarcode('barcode_');
							         		}
								        }
							       },
							       handler: function(btn){
							    	   console_log(btn);
							    	   findByBarcode('barcode_');
										
							       }
							   }
					    ]
				},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [
				   {
					   xtype:'label',
					   width: 85,
					   style: 'color: #222222;',
					   text: getColNameSub('wh_code') + ':'
				   },
				   {
					id :'whouse_uid_',
	                name:           'whouse_uid_',
					xtype:          'combo',
	                mode:           'local',
	                triggerAction:  'all',
	                width: 80,
	                forceSelection: true,
	                editable:       false,
	                allowBlank: false,
	                emptyText:  qgr1_whouse_choice,
	                displayField:   'wh_code',
	                valueField:     'unique_id',
	                queryMode: 'local',
	                value: defWhouseUid,
	                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	                store: wHouseStore
	        	},
	        	{	
	        		xtype: 'numberfield',
					flex: 1,
					 labelWidth: 40,
					 labelAlign: 'right',
				    fieldLabel:    getColNameSub('wh_qty'),
				    allowBlank: false,
				    disabled: true,
				    value: 1,
				    minValue: 1,
				    id:          'wh_qty_',
				    name:        'wh_qty_'
		       },
		       {	
		   			xtype:  'textfield', 
					flex: 1,
					 labelWidth: 40,
					 labelAlign: 'right',
					fieldLabel:    getColName('unit_code'),
					name: 'unit_code_',
					id:  'unit_code_',
					fieldStyle: 'background-color: #FBF8E6; background-image: none;',
					anchor: '100%'  // anchor width by percentage
			       }]},
			       {xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
			   			xtype:  'textfield', 
						flex: 1,
						 labelWidth: 80,
		                fieldLabel:    getColNameSub('innout_desc'),
		                name: 'innout_desc_',
		                id:  'innout_desc_',
		                anchor:'100%'  // anchor width by percentage
				       }]},
						{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
				   			xtype:  'textfield', 
							flex: 1,
							 labelWidth: 80,
					fieldLabel:    getColName('item_code'),
					name: 'item_code_',
					id:  'item_code_',
					readOnly: true,
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
					anchor: '100%'  // anchor width by percentage
					       }]},
					{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
			   			xtype:  'textfield', 
						flex: 1,
						 labelWidth: 80,
		                fieldLabel:    getColNameSub('stock_pos'),
		                name: 'stock_pos_',
		                id:  'stock_pos_',
						readOnly: true,
						fieldStyle: 'background-color: #EAEAEA; background-image: none;',
		                anchor:'100%'  // anchor width by percentage
				       }]},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
			   			xtype:  'textfield', 
						flex: 1,
						 labelWidth: 80,
	                fieldLabel:    getColName('item_name'),
	                name: 'item_name_',
	                id:  'item_name_',
					readOnly: true,
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
	                anchor: '100%'  // anchor width by percentage
				       }]},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
				   			xtype:  'textfield', 
							flex: 1,
							 labelWidth: 80,
	                fieldLabel:    getColName('specification'),
	                name: 'specification_',
	                id:  'specification_',
					readOnly: true,
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
	                anchor: '100%'  // anchor width by percentage
					       }]},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
					   			xtype:  'textfield', 
								flex: 1,
								 labelWidth: 80,
	                fieldLabel:    getColName('description'),
	                name: 'description_',
	                id:  'description_',
					readOnly: true,
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
	                anchor: '100%'  // anchor width by percentage
						       }]},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
						   			xtype:  'textfield', 
									flex: 1,
									 labelWidth: 80,
	                fieldLabel:    getColName('maker_name'),
	                name: 'maker_name_',
	                id:  'maker_name_',
					readOnly: true,
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
	                anchor: '100%'  // anchor width by percentage
							       }]},
				{xtype: 'container',flex: 1, layout: 'hbox', margin: 5,  items: [ {	
							   			xtype:  'textfield', 
										flex: 1,
										 labelWidth: 80,
	                fieldLabel:    getColName('model_no'),
	                name: 'model_no_',
	                id:  'model_no_',
					readOnly: true,
					fieldStyle: 'background-color: #EAEAEA; background-image: none;',
	                anchor: '100%'
								       }]},
				{xtype: 'container',flex: 1,                                     
				layout: {
	                type:'vbox',
	                padding:'5',
	                align:'stretch'
	            },  items: [
		            {
		            	id: 'goodsOutBtn',
		                text: CMD_OK,
		                xtype: 'button',
		                anchor: '100%' ,
		                disabled: true,
		                handler: function(btn){
		                	

			    			if(
			    				selected_stoqty_uid==null || selected_stoqty_uid=='' ||
			    				selected_whouse_uid== null || selected_whouse_uid =='' ||
			    				selected_unique_id == null || selected_unique_id == '' ||
			    				selected_barcode == null || selected_barcode == '' ||
			    				selected_pj_uid == null || selected_pj_uid ==''
			    			) {
			    				alert('Not Defined Case');	
			    				return;
			    			} else {
			    				
			    				
				    			var innout_desc_= Ext.getCmp('innout_desc_').getValue();
				    			var wh_qty_ =  Ext.getCmp('wh_qty_').getValue();
				    			
				    			alert('Goods out quantity :' + wh_qty_ );	
				    			
								Ext.Ajax.request({
									url: CONTEXT_PATH + '/inventory/prchStock.do?method=outQty',				
									params:{
										stoqtyUid: selected_stoqty_uid,
										whouse_uid: selected_whouse_uid,
										srcahdUid: selected_unique_id,
										barcode: selected_barcode,
										pjUid : selected_pj_uid,
						    			innout_desc : innout_desc_,
						    			wh_qty : wh_qty_ 
									},
									
									success : function(result, request) {
										var resultText = result.responseText;
										console_log('result:' + resultText);
										
										
										store.load(function() {});
										storePrchStock.load(function() {
											var o_wh_qty_ =  Ext.getCmp('wh_qty_');
											selected_stoqty_uid = '';
											selected_whouse_uid =  '';
											selected_pj_uid =  '';
											
											disableGoodsoutBtn(true);
											o_wh_qty_.setValue(1);
										});
										
										//alert('finished..');
										
									},
									failure: extjsUtil.failureMessage
								});
								
			    			}
			    			
		                }
		            } 
	            ]},
				new Ext.form.Hidden({
					xtype:  'textfield',
					 id: 'stoqtyUid',
					 name: 'stoqtyUid',
					 value: -1
				}),
				new Ext.form.Hidden({
					xtype:  'textfield',
					 id: 'pjUid',
					 name: 'pjUid',
					 value: -1
				}),
	            
	            ],
		        title: GET_MULTILANG('pms1_GOut', vLANG)
		    });
		    
			var tabPanel = {
		            collapsible: false,
		            floatable: false,
		            split: true,
					xtype: 'tabpanel',
			        region: 'south',
			        activeTab: 0,
			        tabPosition: 'top',
			        items: [ goodsIn, goodsOut ]
		    };
	
		    
		    var main =  Ext.create('Ext.panel.Panel', {
				id : 'tempport',
				region: 'east',
	            width: '30%',
	            height: '100%',		
			    layout:'border',
		        border: false,
		        layoutConfig: {columns: 1, rows:2},
			    defaults: {
			        collapsible: true,
			        split: true,
			        cmargins: '5 0 0 0',
			        margins: '0 0 0 0'
			    },
			   items: [gridPrchStock, tabPanel]
			});
			
			fLAYOUT_CONTENTMulti([grid, main]);  
			
			gridPrchStock.getSelectionModel().on({
		    	selectionchange: function(sm, selections) {
		    		
		    		var o_wh_qty_ =  Ext.getCmp('wh_qty_');

		    		if (selections.length) {
		    			var record = selections[0];
		    			console_log(record);
		    			selected_stoqty_uid = record.get('unique_id');
		    			selected_whouse_uid = record.get('whouse_uid');
		    			selected_pj_uid = record.get('pj_uid');
		    			var wh_qty = record.get('wh_qty');
		    			
		    			disableGoodsoutBtn(false);
		    			o_wh_qty_.setMaxValue(wh_qty);
		    		} else {
		    			selected_stoqty_uid = '';
		    			selected_whouse_uid =  '';
		    			selected_pj_uid =  '';
		    			
		    			disableGoodsoutBtn(true);
		    			o_wh_qty_.setValue(1);
		    		}
		    	}
			});
		    grid.getSelectionModel().on({
		    	selectionchange: function(sm, selections) {
		    		if (selections.length) {
	
		    			var record = selections[0];
		    			console_log(record);
		    			setGridRecord(record);
		    		} else {
		    			resetGrinField();
		    		}
		    		
		    		
		        }
		    });
		    Ext.getCmp('barcode').focus(false, 200);
		cenerFinishCallback();//Load Ok Finish Callback
		}); //store load
		
 	console_log('End...');
	});//endof load
	
});