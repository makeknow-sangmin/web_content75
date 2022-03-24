var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

var grid = null;
var store = null;

var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});

var arrSearchObj=[];

function mySearch(){
	for(var i=0; i<arrSearchObj.length; i++) {
		var index = arrSearchObj[i];
		var val = Ext.getCmp(getSearchField(index)).getValue();
		var enValue = Ext.JSON.encode(val);
		store.getProxy().setExtraParam(index, enValue);
	}
	var date_type = Ext.getCmp('date_type').getValue();
	var s_date = Ext.getCmp('s_date').getValue();
	var e_date = Ext.getCmp('e_date').getValue();
	store.getProxy().setExtraParam('date_type', date_type);
	store.getProxy().setExtraParam('s_date', yyyymmdd(s_date, '-')/*s_date.toISOString().split('T')[0]*/);
	store.getProxy().setExtraParam('e_date', yyyymmdd(e_date, '-')/*e_date.toISOString().split('T')[0]*/);
	
	store.load({
		params: {start: 0, limit:100, page:1}	
	});
	
}


function getSearchObj(index, label) {
	arrSearchObj.push(index);
	return 		{
	    xtype: 'container',
	    layout:'hbox',
	    items:[ 
			{
			    xtype:'label',
			    text: label + ':',
			    width: 70,
			    labelAlign: 'right',
			    align:'right',
			    margin: '5 6 2 10',
			    fieldStyle: 'text-align:right;'
			},	
			{
				    xtype: 'triggerfield',
				    width: 130,
				    emptyText: label, //getTextName(/*(G)*/vCENTER_FIELDS, index),
				    id: getSearchField(index),
			    	listeners : {
			        		specialkey : function(fieldObj, e) {
			        		if (e.getKey() == Ext.EventObject.ENTER) {
			        			mySearch();
			        		}
			        	}
			    	},
				    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
				    'onTrigger1Click': function() {
				    	Ext.getCmp(getSearchField(index)).setValue('');
					}
			}
			]};
}

//function getXpoAstToolBar() {
//	var arrXpoAstToolBar = [];
//	
//	arrXpoAstToolBar.push(
//			{
//				fieldLabel: '',
//			    width: 148,
//			    xtype: 'triggerfield',
//				id :'unique_id',
//			    name : 'unique_id',
//			    emptyText:  qgr1_barcode,
//			    labelSeparator: '',
//			    readOnly: false,
//			    listeners: {
//			        expand: function(){
//			        },
//			        collapse: function(){
//			        },
//			        change: function(d, newVal, oldVal) {
//			        },
//			        keypress: {
//			            buffer: 500,
//			            fn: function(field){
//			                var value = field.getValue();
//			                if (value !== null && field.isValid()) {
//			                }
//			            }
//			        },
//			        specialkey : function(fieldObj, e) {
//		         		if (e.getKey() == Ext.EventObject.ENTER) {
//		         			searchHandler();
//		         		}
//			        }
//			    },
//			    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
//		         'onTrigger1Click': function() {
//		         	Ext.getCmp('unique_id').setValue('');
//		     	}
//			}
//	);
//	
//	arrXpoAstToolBar.push(
//			{
//	        	fieldLabel: '',
//	        	width: 148,
//	        	xtype: 'triggerfield',
//	        	id :'po_no',
//	        	name : 'po_no',
//	        	emptyText:  qgr1_po_no,
//	        	labelSeparator: '',
//	        	readOnly: false,
//	        	listeners: {
//	        		expand: function(){
//	        		},
//	        		collapse: function(){
//	        		},
//	        		change: function(d, newVal, oldVal) {
//	        		},
//	        		keypress: {
//	        			buffer: 500,
//	        			fn: function(field){
//	        				var value = field.getValue();
//	        				if (value !== null && field.isValid()) {
//	        				}
//	        			}
//	        		},
//	        		specialkey : function(fieldObj, e) {
//		         		if (e.getKey() == Ext.EventObject.ENTER) {
//		         			searchHandler();
//		         		}
//			        }
//	        	},
//	        	trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
//		         'onTrigger1Click': function() {
//		         	Ext.getCmp('po_no').setValue('');
//		     	}
//			}
//	);
//	
//	arrXpoAstToolBar.push(
//			{
//	        	fieldLabel: '',
//	        	width: 148,
//	        	xtype: 'textfield',
//	        	id :'supplier_name',
//	        	name : 'supplier_name',
//	        	emptyText:  qgr1_supplier_name,
//	        	labelSeparator: '',
//	        	readOnly: true,
//	        	fieldStyle: 'background-color: #E7EEF6; background-image: none;',
//	        	listeners: {
//	        		expand: function(){
//	        		},
//	        		collapse: function(){
//	        		},
//	        		change: function(d, newVal, oldVal) {
//	        		},
//	        		keypress: {
//	        			buffer: 500,
//	        			fn: function(field){
//	        				var value = field.getValue();
//	        				if (value !== null && field.isValid()) {
//	        				}
//	        			}
//	        		}
//	        	}
//			}
//	);
//	
//	arrXpoAstToolBar.push(
//			{
//	        	fieldLabel: '',
//	        	width: 148,
//	        	xtype: 'textfield',
//	        	id :'aprv_date',
//	        	name : 'aprv_date',
//	        	emptyText:  qgr1_aprv_date,
//	        	labelSeparator: '',
//	        	readOnly: true,
//	        	fieldStyle: 'background-color: #E7EEF6; background-image: none;',
//	        	listeners: {
//	        		expand: function(){
//	        		},
//	        		collapse: function(){
//	        		},
//	        		change: function(d, newVal, oldVal) {
//	        		},
//	        		keypress: {
//	        			buffer: 500,
//	        			fn: function(field){
//	        				var value = field.getValue();
//	        				if (value !== null && field.isValid()) {
//	        				}
//	        			}
//	        		}
//	        	}
//			}
//	);
//	
//	return arrXpoAstToolBar;
//}

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: function() {
    	mySearch();
    }
    //handler: searchHandler
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
			  //console_logs('rec', rec);
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
		            title:'입고검사 확인',
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
                        	
                            mask.show();
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
            				               store.load(function(){mask.hide();});
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
	
	
	
	
	
	//var xpoAstToolBar = getXpoAstToolBar();

	var searchDatetypeStore  = Ext.create('Mplm.store.SearchDatetypeStore', {hasNull: true} );
//	var dataType_datas = [];
//	function getPosDatatype(id){
//		for (var i=0; i<dataType_datas.length; i++){
//			if(dataType_datas[i].get('systemCode') == id){
//				return dataType_datas[i];
//			}
//		}
//		return null;
//	}
	
	Ext.define('XpoAst', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/purchase/prch.do?method=readDetail&isPoqtyZero='+true
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
		model: 'XpoAst',
		groupField :'po_no'/*,
		sorters: [{
			property: 'a.po_no',
			direction: 'DESC'
		}]*/
	});
	store.getProxy().setExtraParam('is_closed', "N");
	
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
	        features: [{ ftype: 'grouping' }],
	        dockedItems: [{
	        	dock : 'top',
	        	xtype: 'toolbar',
	        	items: [searchAction,'-', printBarcodeCheck,'-',printBarcode, '-',
	        	        {
		                width:90,
						id :'date_type',
		                name:           'date_type',
						xtype:          'combo',
		                mode:           'local',
		                allowBlank: false,
		                emptyText:  '-미지정-',
		                value: '',

		                forceSelection: true,
		                editable:       false,
		               
		               
		                displayField:   'codeName',
		                valueField:     'systemCode',
  		                triggerAction:  'all',
		                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
		                queryMode: 'remote',
		                store: searchDatetypeStore,
		                listConfig:{
		                	getInnerTpl: function(){
		                		return '<div data-qtip="{systemCode}">{codeName}</div>';
		                	}			                	
		                }
//		        ,
//		                	listeners: {
//		                		select: function (combo, record) {
//		                			var isComplished = Ext.getCmp('date_type').getValue();
//		                			store.getProxy().setExtraParam('date_type', isComplished);
//				     				store.load({});
//		                		}//endofselect
//		                	}
		        	},
					{ 
		                name: 's_date',
		                id:'s_date',
		                format: 'Y-m-d',
				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
					    	allowBlank: true,
					    	xtype: 'datefield',
					    	value: new Date(),
					    	width: 100,
						handler: function(){
						}
					},
					{
					    xtype:'label',
					    text: " ~ ",
					    name: 'label2'
					 },
					{ 
		                name: 'e_date',
		                id:'e_date',
		                format: 'Y-m-d',
				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
					    	allowBlank: true,
					    	xtype: 'datefield',
					    	value: new Date(),
					    	width: 100,
						handler: function(){
						}
					},'-']
	        },
	        
//	        {
//	        	xtype: 'toolbar',
//	        	items: xpoAstToolBar
//	        },
		      {
				xtype: 'toolbar',
				items: [
				        getSearchObj('var_item_code', '품목코드'),
				        getSearchObj('seller_code', '공급사코드'),
				        getSearchObj('seller_name', '공급사이름'),
				        getSearchObj('pr_no', '요청번호'),
				        getSearchObj('po_no', '주문번호')
				        
				        ]
				},
		      {
					xtype: 'toolbar',
					items: [
					        getSearchObj('account_code', '프로젝트코드'),
					        getSearchObj('po_user_name', '주문자'),
					        getSearchObj('pr_user_name', '요청자'),
					        getSearchObj('item_name', '품명'),
					        
					        
					        
					        
					        {
					            xtype: 'container',
					            layout:'hbox',
					            items:[ 
					        		{
					        		    xtype:'label',
					        		    text: '창고' + ':',
					        		    width: 70,
					        		    labelAlign: 'right',
					        		    align:'right',
					        		    margin: '5 6 2 10',
					        		    fieldStyle: 'text-align:right;'
					        		},	
							        {
										id :'whouse_uid',
						                name:           'whouse_uid',
										xtype:          'combo',
						                mode:           'local',
						                triggerAction:  'all',
						                forceSelection: true,
						                editable:       false,
						                allowBlank: false,
						                emptyText:  qgr1_whouse_choice,
						                displayField:   'wh_code',
						                valueField:     'unique_id',
						                queryMode: 'local',
						                value: defWhouseUid,
						                width: 130,
						                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
						                store: wHouseStore
						        	}
					        		]}
					        
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
		searchDatetypeStore.load(function(records) {
//			for (var i=0; i<records.length; i++){
//		       	//searchDatetypeStore.push(records[i]);
//			}
//			Ext.getCmp('date_type').select(records[0]);
		});
	    grid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	    		if (selections.length) {
					//grid info 켜기
					displayProperty(selections[0]);
					if(fPERM_DISABLING()==true) {
						printBarcodeCheck.disable();
						printBarcode.disable();
					}else{
						printBarcodeCheck.enable();
						printBarcode.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
		            	printBarcodeCheck.disable(); 
		            	printBarcode.disable();
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
		            	printBarcodeCheck.disable(); 
		            	printBarcode.disable();
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

