
var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});
var store = null;
var grid = null;
var storePrchStock = null;
var gridPrchStock = null;

var gridHistory = null;
var storeHistory = null; 

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

var seletedTab = 'tabGoodsIn';

searchField = 
	[
	'unique_id',
	'item_code',
	'item_name',
	'specification',
	'alter_reason'
	];

function setGridHistoryRecord(record) {
	selected_unique_id = record.get('unique_id');
	selected_barcode = record.get('barcode');
	selected_item_name = record.get('item_name');
	
	//gridHistory.setTitle('[' + selected_barcode + '] ' + selected_item_name);
	
	storeHistory.getProxy().setExtraParam('uid_srcahd', selected_unique_id);
	storeHistory.load(function(records){
		console_logs('records', records);
	});
	
//	selected_unique_id = '';
//	selected_barcode = '';
//	selected_item_name = '';
}

function resetGridHistoryField() {
	selected_unique_id = '';
	selected_barcode = '';
	selected_item_name = '';
	
	//gridHistory.setTitle('프로젝트 할당');
	
	storeHistory.getProxy().setExtraParam('uid_srcahd', '-2');
	storeHistory.load(function(){});
}

function refreshBarFocus() {
	if(seletedTab=='tabGoodsIn') {
		Ext.getCmp('barcode').focus(false, 200);
	}else {
		Ext.getCmp('barcode_').focus(false, 200);
	}
}


function crossDomainPost(batchParamnIn) {
	  console_logs('batchParamnIn', batchParamnIn);
	  var batchParam = Ext.encode(batchParamnIn);
	  console_logs('batchParam', batchParam);
	  // Add the iframe with a unique name
	  var iframe = document.createElement("iframe");
	  var uniqueString = RandomString(10);
	  document.body.appendChild(iframe);
	  iframe.style.display = "none";
	  iframe.contentWindow.name = uniqueString;

	  // construct a form with hidden inputs, targeting the iframe
	  var form = document.createElement("form");
	  form.target = uniqueString;
	  form.action =  'http://' + vBARCODE_URL + '/print/BarcodePrint';
	  form.method = "POST";

	  // repeat for each parameter
	  var input = document.createElement("input");
	  input.type = "hidden";
	  input.name = "batchParam";
	  input.value = batchParam;
	  form.appendChild(input);
	  
	  document.body.appendChild(form);
	  form.submit();
	  
	  Ext.getCmp('printQty').setValue('1');
	}


var printBarcode = Ext.create('Ext.Action', {
	itemId: 'printBarcode',
    iconCls: 'barcode',
    text: '바코드 인쇄',
    disabled: false,
    handler: function(widget, event) {
    	
        var selections = grid.getSelectionModel().getSelection();
        if (selections) {
        	var batchParam = '';
            	for(var i=0; i< selections.length; i++) {
            		var rec = selections[i];
            		var barcode = rec.get('unique_id');
            		var qty = Ext.getCmp('printQty').getValue();
            		
            		var spec = rec.get('specification');
            		var item_code = rec.get('item_code');
            		var item_name = rec.get('item_name');
            		var maker_name = rec.get('maker_name');
            		
            		spec = spec.replace(/:/g, '_');
            		item_code = item_code.replace(/:/g, '_');
            		item_name = item_name.replace(/:/g, '_');
            		maker_name = maker_name.replace(/:/g, '_');
            		
            		if(i>0) {
            			batchParam = batchParam + ';';
            		}
            		batchParam = batchParam + barcode + 
            		':' + spec + 
            		':' + qty +
            		':' + item_code +
            		':' + item_name +
            		':' + maker_name
            		;
            		

            	}
            	
            	crossDomainPost(batchParam);
            	console_logs('batchParam', batchParam);
        }
    	
    }
});
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
    handler: searchHandler//searchToolBarTap
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
	
	gridPrchStock.setTitle('프로젝트 할당');
	
	storePrchStock.getProxy().setExtraParam('uid_srcahd', '-1');
	storePrchStock.load(function() {
		var o_wh_qty_ =  Ext.getCmp('wh_qty_');
		selected_stoqty_uid = '';
		selected_whouse_uid =  '';
		selected_pj_uid =  '';
		
		disableGoodsoutBtn(true);
		o_wh_qty_.setValue(1);
	});
	//refreshBarFocus();
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
	
	
	//Ext.getCmp('barcode_').setValue(selected_barcode);
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
	//refreshBarFocus();
}


Ext.onReady(function() {
	

	console_log('start Ext.onReady:PMS1');
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
	console_log('>>>>>>>>>>>>>> 1');
	
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
		
		store.getProxy().setExtraParam('has_stock',"Y");		//재고있는 체크해제시 세팅함
		store.load(function() {
	
	 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			
    		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
    			var dataIndex = columnObj["dataIndex"];
    			
    			switch(dataIndex) {
    			case 'alter_reason':
    				columnObj["editor"] = {}; columnObj["css"] = 'edit-cell';
    				columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
    		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
    		        	return value;
    	        	};		    				
    				break;
    			}
    			

    		});
	 		grid = Ext.create('Ext.grid.Panel', {
			        store: store,
			        collapsible: true,
			        multiSelect: true,
			        stateId: 'stateGrid',
			        selModel: selModel,
			        autoScroll : true,
			        autoHeight: true,
			        height: getCenterPanelHeight(),
			        region: 'center',
			     	width: '70%',
			        bbar: getPageToolbar(store),
			        dockedItems: [{
			        	xtype: 'toolbar',
			        	items: [
									{
										xtype: 'checkboxfield',
										fieldLabel: '재고있는',
									    id: 'checkboxStockOnly',
									    labelWidth: 60,

									    checked: true,        //재고 있는 default 체크
									    //checked: false,

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
									searchAction,
									'-'
									,{
			      						fieldLabel: '인쇄수량',
										id:'printQty',
								    	xtype: 'combo',
								    	fieldStyle: 'background-image: none;background:#FBF8E6;',
							           editable:true,
							           typeAhead: false,
							           allowBlank: false,
							           width: 120,
							           labelWidth:60,
							           value:'1',
							           store:[
							                  '1','2','3','4','5','6','7','8','9','10',
							                  '20', '30', '40', '50', '60', '70', '80', '90', '100'
							                  ],
									},
									printBarcode
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
			        plugins: [cellEditing],
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
		        title: Position
	
		    });
		
		    var goodsIn =  Ext.create('Ext.panel.Panel', {
		    	id: 'tabGoodsIn',
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
								    fieldStyle: {
								        'fontSize'     : '14px',
								        'fontWeight' : 'bold'
								      },
								    allowBlank: true,
								    id:          'barcode',
								    name:        'barcode',
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
								       }
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
	                store: wHouseStore,
	                listConfig:{
	                	getInnerTpl: function(){
	                		return '<div data-qtip="{wh_name}">{wh_code}</divsystemCode>';
	                	}	
	                }
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
				    			//var barcode = Ext.getCmp('barcode').getValue();
				    			var unique_id = Ext.getCmp('unique_id').getValue();
				    			barcode = unique_id;
				    			var isNewPart = false;
				    			if(barcode==null || barcode=='') {
				    				isNewPart = true;
				    			}/* else if(unique_id!=barcode) {
				    				alert('not valid material');
				    				return;
				    			}*/
				    			
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
				    				//alert('Goods in quantity :' + Ext.getCmp('wh_qty').getValue() );
				    				
							    	Ext.MessageBox.show({
							            title:'창고 반입',
							            msg: '창고로 반입하시겠습니까?' + '\r\n 수량: ' + Ext.getCmp('wh_qty').getValue(),
							            buttons: Ext.MessageBox.YESNO,
							            fn: function(btn) {
							                if(MessageBox.msg('{0}', btn)=='yes') {
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
													
												});//endof ajax request
							                }
							            },
							            //animateTarget: 'mb4',
							            icon: Ext.MessageBox.QUESTION
							        });
			
									
				    			}//endofelse
				    			
				    			
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
		    
		 /*   
		    var goodsOut =  Ext.create('Ext.panel.Panel', {
		    	id: 'tabGoodsOut',
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
								     fieldStyle: {
								        'fontSize'     : '14px',
								        'fontWeight' : 'bold'
								      },
								    allowBlank: true,
								    id:          'barcode_',
								    name:        'barcode_',
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
								       }
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
		                	
		                	if(selected_barcode == null || selected_barcode == '' ) {
			    				selected_barcode = selected_unique_id;
			    			}

			    			if( selected_stoqty_uid==null || selected_stoqty_uid==''){
			    				alert('selected_stoqty_uid is null');	
			    				return;
			    			} else if(selected_whouse_uid== null || selected_whouse_uid =='' ) {
			    				alert('selected_whouse_uid is null');	
			    				return;
			    			} else if(selected_unique_id == null || selected_unique_id == '' ) {
			    				alert('selected_unique_id is null');	
			    				return;
			    			} else if(selected_pj_uid == null || selected_pj_uid =='' ) {
			    				alert('selected_pj_uid is null');	
			    				return;
			    			} else {
			    				
			    				console_logs('ok', selected_unique_id);
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
				})
	            
	            ],
		        title: GET_MULTILANG('pms1_GOut', vLANG)
		    });*/
		    
			
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
		    			setGridRecord(record);
		    			setGridHistoryRecord(record);
		    		} else {
		    			resetGrinField();
		    			resetGridHistoryField();
		    		}
		    		
		    		
		        }
		    });
		    
		    grid.on('edit', function(editor, e) {     
				  // commit the changes right after editing finished
			    	
		          var rec = e.record;
		         //console_logs('rec', rec);
		          var srcahdUid = rec.get('unique_id');
		          var alter_reason = rec.get('alter_reason');
		          
			      	Ext.Ajax.request({
						url: CONTEXT_PATH + '/inventory/prchStock.do?method=changePosition',
						params:{
							srcahdUid: srcahdUid,
							alter_reason:alter_reason
						},
						success : function(result, request) {   

							var result = result.responseText;
							//console_logs("", result);

						},
						failure: extjsUtil.failureMessage
					});
			      	
				  rec.commit();
				});
		    
		    
		    var fieldItem = [], columnItem = [], tooltipItem = [];
			//아이템 필드 로드
		   (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
			    params: {
			    	menuCode: 'QGR4_SUB'
			    },
			    callback: function(records, operation, success) {
			    	console_log('come IN QGR4_SUB');
			    	if(success ==true) {
			    		for (var i=0; i<records.length; i++){
			    			inRec2Col(records[i], fieldItem, columnItem, tooltipItem);
				        }//endoffor
		    		 	
			    		//var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			    		Ext.each(/*(G)*/columnItem, function(columnObj, index) {
			    			var dataIndex = columnObj["dataIndex"];
			    		});//endoofeach
			    		
			

			    		Ext.define('InnoutLine', {
			    		   	 extend: 'Ext.data.Model',
			    		   	 fields: /*(G)*/fieldItem,
			    		   	 idProperty: 'create_date',
			    		   	 proxy: {
			    			 	type: 'ajax',
			    		        api: {
			    		        	read: CONTEXT_PATH + '/purchase/prch.do?method=readHistory'
			    		        },
			    				reader: {
			    					type: 'json',
			    					root: 'datas',
			    					rootProperty: 'datas',
			    					totalProperty: 'count',
			    					successProperty: 'success',
			    					excelPath: 'excelPath'
			    				}
			    		 	}
			    		});	// Ext.define InnoutLine
			    		
			    		storeHistory = new Ext.data.Store({
			    			pageSize: getPageSize(),
			    			model: 'InnoutLine',
			    			extraParams : {
			    				srcahdUid: selected_unique_id
			    			},
			    			sorters: [{
			    				property: 'create_date',
			    				direction: 'DESC'
			    			}]
			    		});
			    		
			    		gridHistory = Ext.create('Ext.grid.Panel', {
			    			title: '반출입 이력',
			    			store: storeHistory,
			    			multiSelect: true,
			    			autoScroll : true,
			    	        autoHeight: true,
			    	        collapsible: false,
			    	        floatable: false,
			    	        split: true,
			    	        border: true,
			    	        height: getCenterPanelHeight() - 200,
			    			columns: columnItem,
//			    	        viewConfig: {
//			    	        	stripeRows: true,
//			    	            enableTextSelection: true,
//			    	            listeners: {
//			    	                itemcontextmenu: function(view, rec, node, index, e) {
//			    	                    e.stopEvent();
//			    	                    contextMenu.showAt(e.getXY());
//			    	                    return false;
//			    	                }
//			    	            }
//			    	        },
			    	    });
			    		
						var tabPanel = {
					            collapsible: false,
					            floatable: false,
					            split: true,
								xtype: 'tabpanel',
						        region: 'south',
						        activeTab: 0,
						        tabPosition: 'top',
						        items: [ goodsIn, gridHistory ],
						        //items: [ goodsIn, goodsOut, gridHistory ],
						      //define all tabs, and after the ] from the tab panel JSON: 
						        listeners: {
						            'tabchange': function(tabPanel, tab) {
						                //console_logs('tab.id', tab.id);
						                //console_logs('tab', tab);
						                //tabGoodsOut
						            	seletedTab = tab.id;
						            	refreshBarFocus();
						            }
						        }
					    };
			    		
					    var mainEast =  Ext.create('Ext.panel.Panel', {
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
					    
						var main = Ext.create('Ext.panel.Panel',  {
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
						    items: [  grid, mainEast  ]
						});
						fLAYOUT_CONTENT(main);
						cenerFinishCallback();//Load Ok Finish Callback
					    Ext.getCmp('barcode').focus(false, 200);
			    		
			    		
			    	}//endofsuccess
			    }//endofcallback
		   });//endof data.store
			
		    
		    
		    
		
		}); //store load
		
 	console_log('End...');
	});//endof load
	
});