var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	clicksToEdit: 1
});

var grid = null;
var store = null;
Ext.define('UsrAst.Combo', {
	 extend: 'Ext.data.Model',
	 fields: [     
		{ name: 'unique_id', type: "string" }
		,{ name: 'user_id', type: "string"  }
		,{ name: 'user_name', type: "string"  }
		,{ name: 'dept_name', type: "string"  }
		,{ name: 'dept_code', type: "string"  }
		,{ name: 'email', type: "string"  }
		,{ name: 'hp_no', type: "string"  }
	  	  ],
	    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/userMgmt/user.do?method=query'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				successProperty: 'success'
			},
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        }
		}
});
var userStore = new Ext.data.Store({  
	pageSize: 5,
	model: 'UsrAst.Combo',
	sorters: [{
         property: 'user_name',
         direction: 'ASC'
     }]
}); 

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

var addAction =	 Ext.create('Ext.Action', {
	iconCls:'add',
    text: '경비입력',
    disabled: false,
    handler: function(widget, event) {
    	
		

    	var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            defaultType: 'textfield',
            border: false,
            width:450,
            bodyPadding: 15,
            height: 400,
            defaults: {
                anchor: '100%',
                editable:false,
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
             items: [ new Ext.form.Hidden({
				    	id: 'user_id',
				    	name: 'user_id'
				    }),
				    new Ext.form.Hidden({
					    id: 'user_name',
					    name: 'user_name'
					}),{
					xtype: 'textfield',
					fieldLabel: getColName('name'),
					allowBlank:false,
					flex : 1,
					value: '',
//					readOnly : true,
//					fieldStyle : 'background-color: #ddd; background-image: none;',
					name: 'name'
				},{
                 	   xtype: 'container',
                       //width: 280,
                       layout: 'hbox',
                       margin: '5 5 5 0',
                    items: [{//식대비
                    		xtype: 'textfield',
                    		labelWidth: 100, 
//                    		labelAlign: 'right',
                    		value:'',
                    		width: 250,
                    		anchor:'95%',
                			fieldLabel: '식대비',
                			name: 'cost_breakdown1'
//                			id:'cost_breakdown1'
                		},{
                			 value: 0,
                			 width: 150,
                			 name: 'cost_price1',
                			 allowBlank: false,
                			 editable:true,
                			 minValue:0,
                			xtype:  'numberfield'
                       }]
                  },{
                 	   xtype: 'container',
                       //width: 280,
                       layout: 'hbox',
                       margin: '5 5 5 0',
                    items: [{//숙박비
                    		xtype: 'textfield',
                    		labelWidth: 100, 
//                    		labelAlign: 'right',
                    		value:'',
                    		width: 250,
                    		anchor:'95%',
                			fieldLabel: '숙박비',
                			name: 'cost_breakdown2'
//                			id:'cost_breakdown2'
                		},{
                			 value: 0,
                			 width: 150,
                			 name: 'cost_price2',
                			 allowBlank: false,
                			 editable:true,
                			 minValue:0,
                			xtype:  'numberfield'
                       }]
                  },{
                 	   xtype: 'container',
                       //width: 280,
                       layout: 'hbox',
                       margin: '5 5 5 0',
                    items: [{//교통비
                    		xtype: 'textfield',
                    		labelWidth: 100, 
//                    		labelAlign: 'right',
                    		value:'',
                    		width: 250,
                    		anchor:'95%',
                			fieldLabel: '교통비',
                			name: 'cost_breakdown3'
//                			id:'cost_breakdown3'
                		},{
                			 value: 0,
                			 width: 150,
                			 name: 'cost_price3',
                			 allowBlank: false,
                			 editable:true,
                			 minValue:0,
                			xtype:  'numberfield'
                       }]
                  },{
                 	   xtype: 'container',
                       //width: 280,
                       layout: 'hbox',
                       margin: '5 5 5 0',
                    items: [{//기타비용
                    		xtype: 'textfield',
                    		labelWidth: 100, 
//                    		labelAlign: 'right',
                    		value:'',
                    		width: 250,
                    		anchor:'95%',
                			fieldLabel: '기타비용',
                			name: 'cost_breakdown4'
//                			id:'cost_breakdown4'
                		},{
                			 value: 0,
                			 width: 150,
                			 name: 'cost_price4',
                			 allowBlank: false,
                			 editable:true,
                			 minValue:0,
                			xtype:  'numberfield'
                       }]
                  },{
                 	   xtype: 'container',
                       //width: 280,
                       layout: 'hbox',
                       margin: '5 5 5 0',
                    items: [{    
                       	fieldLabel: '영수인',
           				name : 'coord_key1',
           	            xtype: 'combo',
           	            store: userStore,
           	            width:225,
           	            displayField: 'user_name',
           	            valueField:     'unique_id',
           	            typeAhead: false,
//    	                 	                    editable:false,
    	                    allowBlank: false,
           	            //hideLabel: true,
           	            //hideTrigger:true,
           	            listConfig: {
           	                loadingText: 'Searching...',
           	                emptyText: 'No matching posts found.',
           	                // Custom rendering template for each item
           	                getInnerTpl: function() {
           	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
           	                }
           	            },
           	         listeners: {
 			        	select: function (combo, record) {
 			        		
 			        		console_log('Selected Value : ' + record[0].get('unique_id'));
 			        		
// 			        		var unique_id = record[0].get('unique_id');
 			        		var user_id = record[0].get('user_id');
 			        		var user_name = record[0].get('user_name');
 			        		Ext.getCmp('user_id').setValue(user_id);                    	
                        	Ext.getCmp('user_name').setValue(user_name);
 			        	}// endofselect
 			        }
    				   },
      					{ 
      		                name: 'aprv_date',
//      		                id:'end_date',
      		                format: 'Y-m-d',
      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
      					    	allowBlank: true,
      					    	editable:false,
      					    	xtype: 'datefield',
      					    	value: new Date(),
      					    	width: 225,
      						handler: function(){
      						}
      					}]
                  },{
                 	   xtype: 'container',
                       //width: 280,
                       layout: 'hbox',
                       margin: '5 5 5 0',
                    items: [{ 
      		                name: 'end_date',
      		                fieldLabel: '출장기간',
      		                labelWidth: 100, 
//      		                id:'end_date',
      		                format: 'Y-m-d',
      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
      					    	allowBlank: true,
      					    	xtype: 'datefield',
      					    	editable:false,
      					    	value: new Date(),
      					    	width:245,
      						handler: function(){
      						}
      					},
      					{
      					    xtype:'label',
      					    text: " ~ ",
      					    width:10,
      					    name: 'label2'
      					 },
      					{ 
      		                name: 'end_date',
//      		                id:'end_date',
      		                format: 'Y-m-d',
      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
      					    	allowBlank: true,
      					    	editable:false,
      					    	xtype: 'datefield',
      					    	value: new Date(),
      					    	width: 145,
      						handler: function(){
      						}
      					}]
                  }
           
                     ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_ADD + ' :: ' + ' Sales',
            width: 450,
            height: 400,
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
                	var rtgast = Ext.ModelManager.create(val, 'XpoAst');
            		//저장 수정
                	rtgast.save({
                		success : function() {
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
		win.show(/*this, function() {}*/);
     }
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
			        	read: CONTEXT_PATH + '/purchase/prch.do?method=readrtgast&rtg_type=TR',
			        	create: CONTEXT_PATH + '/purchase/prch.do?method=creatertgastTR'
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
	        	items: [/*searchAction,'-',*/ printPDFAction,'-',addAction]
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
//						addAction.disable();
					}else{
						printPDFAction.enable();
//						addAction.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
		            	printPDFAction.disable(); 
//		            	addAction.disable();
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
	            		printPDFAction.disable(); 
//		            	addAction.disable();
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

