var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

var grid = null;
var store = null;

var  searchHandler = function() {
	console_info('searchHandler');
	
	var unique_id =  Ext.getCmp('unique_id').getValue();
	var po_no = Ext.getCmp('po_no').getValue();
	
	Ext.Ajax.request({
			url: CONTEXT_PATH + '/sales/delivery.do?method=read',
			params:{
				unique_id : unique_id,
				srch_type : 'multi'
			},
			method: 'POST',
			success : function(result, request) {
				var obj = Ext.decode(result.responseText);
				console_log(obj);
				var aprv_date = obj.datas[0].aprv_date;
				var item_quan = obj.datas[0].item_quan;
				var supplier_name = obj.datas[0].supplier_name;
				Ext.getCmp('aprv_date').setValue(aprv_date);
				Ext.getCmp('supplier_name').setValue(supplier_name);

				store.getProxy().setExtraParam('unique_id', unique_id);
				store.getProxy().setExtraParam('po_no', po_no);
				store.load({});
				
			},
			failure: extjsUtil.failureMessage
		});
};

function getXpoAstToolBar() {
	var arrXpoAstToolBar = [];
	
	arrXpoAstToolBar.push(
			{
				fieldLabel: '',
			    width: 148,
			    xtype: 'triggerfield',
				id :'unique_id',
			    name : 'unique_id',
			    emptyText:  qgr1_barcode,
			    labelSeparator: '',
			    readOnly: false,
			    listeners: {
			        expand: function(){
			        },
			        collapse: function(){
			        },
			        change: function(d, newVal, oldVal) {
			        },
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
		         			searchHandler();
		         		}
			        }
			    },
			    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
		         'onTrigger1Click': function() {
		         	Ext.getCmp('unique_id').setValue('');
		     	}
			}
	);
	
	arrXpoAstToolBar.push(
			{
	        	fieldLabel: '',
	        	width: 148,
	        	xtype: 'triggerfield',
	        	id :'po_no',
	        	name : 'po_no',
	        	emptyText:  qgr1_po_no,
	        	labelSeparator: '',
	        	readOnly: false,
	        	listeners: {
	        		expand: function(){
	        		},
	        		collapse: function(){
	        		},
	        		change: function(d, newVal, oldVal) {
	        		},
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
		         			searchHandler();
		         		}
			        }
	        	},
	        	trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
		         'onTrigger1Click': function() {
		         	Ext.getCmp('po_no').setValue('');
		     	}
			}
	);
	
	arrXpoAstToolBar.push(
			{
	        	fieldLabel: '',
	        	width: 148,
	        	xtype: 'textfield',
	        	id :'supplier_name',
	        	name : 'supplier_name',
	        	emptyText:  qgr1_supplier_name,
	        	labelSeparator: '',
	        	readOnly: true,
	        	fieldStyle: 'background-color: #E7EEF6; background-image: none;',
	        	listeners: {
	        		expand: function(){
	        		},
	        		collapse: function(){
	        		},
	        		change: function(d, newVal, oldVal) {
	        		},
	        		keypress: {
	        			buffer: 500,
	        			fn: function(field){
	        				var value = field.getValue();
	        				if (value !== null && field.isValid()) {
	        				}
	        			}
	        		}
	        	}
			}
	);
	
	arrXpoAstToolBar.push(
			{
	        	fieldLabel: '',
	        	width: 148,
	        	xtype: 'textfield',
	        	id :'aprv_date',
	        	name : 'aprv_date',
	        	emptyText:  qgr1_aprv_date,
	        	labelSeparator: '',
	        	readOnly: true,
	        	fieldStyle: 'background-color: #E7EEF6; background-image: none;',
	        	listeners: {
	        		expand: function(){
	        		},
	        		collapse: function(){
	        		},
	        		change: function(d, newVal, oldVal) {
	        		},
	        		keypress: {
	        			buffer: 500,
	        			fn: function(field){
	        				var value = field.getValue();
	        				if (value !== null && field.isValid()) {
	        				}
	        			}
	        		}
	        	}
			}
	);
	
	return arrXpoAstToolBar;
}

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

var printBarcode = Ext.create('Ext.Action', {
	itemId: 'printBarcode',
    iconCls: 'barcode',
    text: barcode_print,
    disabled: true,
    handler: printMyBarcode
});

function printMyBarcode() {
	 var selections = grid.getSelectionModel().getSelection();
     if (selections) {
     	console_log(selections);
     	var batchParam = '';
         	for(var i=0; i< selections.length; i++) {
         		var rec = selections[i];
         		var barcode = rec.get('srcahd_uid');
        		var spec = rec.get('specification');
        		var qty = '1';
        		var item_code = rec.get('item_code');
        		var item_name = rec.get('item_name');
        		var maker_name = rec.get('maker_name');
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
         	crossDomainPost(batchParam);console_logs('batchParam', batchParam);
         	
     }
}
var printPDFAction = Ext.create('Ext.Action',{
    iconCls: 'PDF',
    text: 'PDF',
    disabled: true,
    handler: function(widget, event) {
    	var rec = grid.getSelectionModel().getSelection()[0];
     	var rtgast_uid = rec.get('unique_id');//rtgast_uid
    	var po_no = rec.get('po_no');//po_no
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/pdf.do?method=printAC',
    		params:{
    			rtgast_uid : rtgast_uid,
    			po_no : po_no,
    			pdfPrint : 'pdfPrint'
    		},
    		reader: {
    			pdfPath: 'pdfPath'
    		},
    		success : function(result, request) {
    			store.load({
        	    scope: this,
        	    callback: function(records, operation, success) {
        	        var jsonData = Ext.JSON.decode(result.responseText);
        	        var pdfPath = jsonData.pdfPath;
        	        console_log(pdfPath);
//        	        
        	    	if(pdfPath.length > 0) {
        	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
        	    		top.location.href=url;	
        	    	}
        	    }
        	});
    		},
    		failure: extjsUtil.failureMessage
    	});
    	
    	
    }
});
var printBarcodeCheck = Ext.create('Ext.Action', {
	itemId: 'printBarcodeCheck',
	iconCls: 'door_in',
	text: ppo2_checkin,
	disabled: true, 
	handler: function(widget, event) {
		var ok = true;
		var selections = grid.getSelectionModel().getSelection();
		console_log(selections);
		if(selections.length==0) {
      	  ok = false;
    	  Ext.MessageBox.alert('No','not selected items.');
    	  return;
		}
		var arrGrqty = [];
		var item_abst = null;
		var cartmap_uids=[];
		for(var i=0; i< selections.length; i++) {
			  var rec = selections[i];
              var strpo_qty = rec.get('notGr_qty');//string
              var strgr_qty = rec.get('curGr_qty');//string
              var notGr_qty = Number(strpo_qty); 
              var gr_qty = Number(strgr_qty); 
              if(i==0) {
                  var item_name = rec.get('item_name');
    			  item_abst = item_name + ' 外';            	  
              }
			  var unique_id = rec.get('unique_id');
			  cartmap_uids.push(unique_id);
				
              
              if(notGr_qty < gr_qty){
            	  ok = false;
            	  Ext.MessageBox.alert('No','gr_qty is greater than the po_qty.');
            	  return;
              }
              if(gr_qty==0) {
            	  ok = false;
            	  Ext.MessageBox.alert('No','gr_qty is 0.');
            	  return;
              }
              arrGrqty[i] = strgr_qty;
        }//enof for
		
		if(ok == true) {
			
			var checkboxWidget = '<input type="checkbox" id="chkPrint" />'
            	+qgr1_print_barcode+'<br/><br/>'
            	+qgr1_comment;
			
			
		  	  Ext.MessageBox.show({
		            title:delete_msg_title,
		            multiline: true,
		            width: 400,
		            msg: checkboxWidget,
		            buttons: Ext.MessageBox.YESNO,
		            fn: function (btn, gr_reason, opt) {
                        if(btn == 'yes' ) {
            				//print barcode
            				if (document.getElementById('chkPrint').checked) {
            					printMyBarcode();
            				}
            				
            				//GR Action
                        	var whouse_uid=Ext.getCmp('whouse_uid').getValue();
            				Ext.Ajax.request({
            					url: CONTEXT_PATH + '/quality/wgrast.do?method=createGr',
            					params:{
            						whouse_uid : whouse_uid
            						,gr_qty : arrGrqty
            						,gr_reason : gr_reason
            						,item_abst : item_abst
            						,cartmap_uids: cartmap_uids
            						
            					},
            					success : function(result, request) {
            				               store.load(function(){});
            					},
            					failure: extjsUtil.failureMessage
            				});
            				
            				
            			}
                        

		            } ,   // printBarcodeCheckConfirm,
		            icon: Ext.MessageBox.QUESTION
		        });
		}
		
	}//endof handler
});

function crossDomainPost(batchParamnIn) {
	  var batchParam = MyUtf8.encode(batchParamnIn);
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
}



Ext.onReady(function() {  

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
	
	
	
	
	
	var xpoAstToolBar = getXpoAstToolBar();

	
	Ext.define('XpoAst', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/purchase/prch.do?method=readrtgast&rtg_type=A'
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
		model: 'XpoAst',
		sorters: [{
			property: 'unique_id',
			direction: 'DESC'
		}]
	});
	store.getProxy().setExtraParam('is_closed', "Y");
	
	store.load(function() {
		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		
		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			//console_log('editor.dataIndex:'+dataIndex);
			if('curGr_qty' == dataIndex){
				columnObj["editor"] = {
                };	
		        columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
					return value;
	        	};
			}
		});
		
		grid = Ext.create('Ext.grid.Panel', {
			store : store,
			stateful : true,
			collapsible : true,
			multiSelect : true,
			selModel : selModel,
			height : getCenterPanelHeight(),
			stateId : 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			autoScroll : true,
			autoHeight : true,
	        bbar: getPageToolbar(store),
	        
	        dockedItems: [{
	        	dock : 'top',
	        	xtype: 'toolbar',
	        	items: [/*searchAction,'-',*/ printPDFAction/*,'-',printBarcode*/]
	        }
/*	        ,
	        {
	        	xtype: 'toolbar',
	        	items: xpoAstToolBar
	        }*/
	        ,    
	        {
	        	xtype: 'toolbar',
	        	items: [
//	        	        {
//					id :'whouse_uid',
//	                name:           'whouse_uid',
//					xtype:          'combo',
//	                mode:           'local',
//	                triggerAction:  'all',
//	                forceSelection: true,
//	                editable:       false,
//	                allowBlank: false,
//	                emptyText:  qgr1_whouse_choice,
//	                displayField:   'wh_code',
//	                valueField:     'unique_id',
//	                queryMode: 'local',
//	                value: defWhouseUid,
//	                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
//	                store: wHouseStore
//	        	}
					{
                    xtype: 'triggerfield',
                    emptyText: getColName('supplier_code'),
                    id: 'srch_supplier_code',
                    fieldStyle: 'text-transform:uppercase',
                	listeners : {
                    		specialkey : function(field, e) {
                    		if (e.getKey() == Ext.EventObject.ENTER) {
          	    				store.getProxy().setExtraParam('supplier_code', Ext.getCmp('srch_supplier_code').getValue());
          	    				store.load(function() {});
//          	    				console_log(Ext.getCmp('srchUnique_id').getValue());
//          	    				productStore.load(function() {});
                    			//srchSingleHandler (productStore,'srchUnique_id', 'item_code', false);
                    		}
                    	}
                	},
                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                    'onTrigger1Click': function() {
                    	Ext.getCmp('srch_supplier_code').setValue('');
                    	store.getProxy().setExtraParam('supplier_code', Ext.getCmp('srch_supplier_code').getValue());
  	    				store.load(function() {});
                    	//srchSingleHandler (productStore,'srchUnique_id', 'item_code', false);
//                    	productStore.getProxy().setExtraParam('item_code', Ext.getCmp('srchUnique_id').getValue());
//                    	productStore.load(function() {});
                	}

          		},'-'
                ,{

  		          xtype: 'triggerfield',
  		          emptyText: getColName('supplier_name'),
  		          id: 'srch_supplier_name',
  		      	listeners : {
  		          		specialkey : function(field, e) {
  		          		if (e.getKey() == Ext.EventObject.ENTER) {
  		          			store.getProxy().setExtraParam('supplier_name', Ext.getCmp('srch_supplier_name').getValue());
  		          			store.load(function() {});
//  			    				productStore.getProxy().setExtraParam('item_code', Ext.getCmp('srchUnique_id').getValue());
//  			    				console_log(Ext.getCmp('srchUnique_id').getValue());
//  			    				productStore.load(function() {});
  		          			//srchSingleHandler (productStore,'srchUnique_id', 'item_code', false);
  		          		}
  		          	}
  		      	},
  		          trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
  		          'onTrigger1Click': function() {
  		          	Ext.getCmp('srch_supplier_name').setValue('');
  		          	store.getProxy().setExtraParam('supplier_name', Ext.getCmp('srch_supplier_name').getValue());
          			store.load(function() {});
//  		          	srchSingleHandler (productStore,'srchUnique_id', 'item_code', false);
//  		          	productStore.getProxy().setExtraParam('item_code', Ext.getCmp('srchUnique_id').getValue());
//  		          	productStore.load(function() {});
  		      	}

  						                    	
                }
	        	        ]
	        }],
	        columns: /*(G)*/vCENTER_COLUMNS,
	        plugins: [cellEditing],
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
	                },
	                itemdblclick: function(){
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
					//displayProperty(selections[0]);
					if(fPERM_DISABLING()==true) {
						printPDFAction.disable();
//						printBarcode.disable();
					}else{
						printPDFAction.enable();
//						printBarcode.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
		            	printPDFAction.disable(); 
//		            	printBarcode.disable();
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
	            		printPDFAction.disable(); 
//		            	printBarcode.disable();
	            	}
	            }
	        }
	    });
		console_log('end create');   
		
		Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		});
		cenerFinishCallback();//Load Ok Finish Callback	
	}); //store load
 	console_log('End...');
 	
	});//endof load
});

