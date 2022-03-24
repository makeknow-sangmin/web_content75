var grid = null;
var store = null;

var vApMonth = '';
var vApTitle = '';
var vSelectedSuplier = null;
var vApSum = null;

function rederApSum(arSum) {
	vApSum= arSum;
	var arAmount = Ext.getCmp('arAmount');
	if(arAmount!=null) {
		arAmount.update(Ext.util.Format.number(arSum, '0,00/i'));	
	}
}
var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: function() {
    	console_info('searchHandler');
    	
    	var s_date = Ext.getCmp(getSearchField('s_date')).getValue();
    	var e_date = Ext.getCmp(getSearchField('e_date')).getValue();
    	
    	supplierStore.getProxy().setExtraParam('s_date', s_date);
    	supplierStore.getProxy().setExtraParam('e_date', e_date);
    	
    	vApMonth = yyyymmdd(s_date, '-').substring(0,7);
    	
    	supplierStore.load( function(records) {

    	});
    }
});

var AdjustmentAction = Ext.create('Ext.Action', {
	itemId: 'AdjustmentAction',
	iconCls: 'door_in',
	text: '정산실행',
	disabled: true, 
	handler: function(widget, event) {
		var selections = grid.getSelectionModel().getSelection();

		if(selections.length==0) {
    	  Ext.MessageBox.alert('No','not selected items.');
    	  return;
		}
		
		var xpoast_uids=[];

    	var s_date = Ext.getCmp(getSearchField('s_date')).getValue();
    	var e_date = Ext.getCmp(getSearchField('e_date')).getValue();
    	
    	var s1 = yyyymmdd(s_date, '-');
    	var e1 = yyyymmdd(e_date, '-');
    	
		var reserved_varchar2 = s1 + ' - ' + e1;    	
		var txt_content = reserved_varchar2 + '\r\n';
		
		var supplier_code = vSelectedSuplier.get('supplier_code');
		var supplier_name = vSelectedSuplier.get('supplier_name');
		var supplierUid = vSelectedSuplier.get('unique_id');
		var item_abst = '';
		for(var i=0; i< selections.length; i++) {
			var rec = selections[i];
			var unique_id = rec.get('unique_id');
			xpoast_uids.push(unique_id);
			if(i==0){
				item_abst = rec.get('item_name') + ' 외 ' + (selections.length-1) + '건';
				txt_content = txt_content + item_abst;
				
			}

		}//enof for
    	

        var win = Ext.create('ModalWindow', {
        	title: '정산 확인',
            width: 400,
            height: 300,
            minWidth: 250,
            minHeight: 180,
            layout: 'fit',
            plain:true,
            items: Ext.create('Ext.form.Panel', {
		        defaultType: 'textfield',
		        border: false,
		        bodyPadding: 15,
		        id : 'formPanelAp',
	            defaults: {
	                anchor: '100%',
	                allowBlank: false,
	                msgTarget: 'side',
	                labelWidth: 100
	            },
		        items: [
				        new Ext.form.Hidden({ id: 'xpoast_uids',    	name: 'xpoast_uids',    	value: xpoast_uids  }),
				        new Ext.form.Hidden({ id: 'item_abst',    		name: 'item_abst',    		value: item_abst  }),		        
				        {
                            xtype: 'textfield',
                            flex : 1,
                            name : 'txt_name',
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
                            value:vApTitle,
                            fieldLabel: '정산 제목'
                        },
				        {
                            xtype: 'textfield',
                            flex : 1,
                            name : 'vApMonth',
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
                            value:vApMonth,
                            fieldLabel: '정산 월'
                        },
                        {
                            xtype: 'textfield',
                            flex : 1,
                            name : 'supplier_code',
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
                            value:supplier_code,
                            fieldLabel: '공급사 코드'
                        },
                        {
                            xtype: 'textfield',
                            flex : 1,
                            name : 'supplier_name',
                            readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
                            value:supplier_name,
                            fieldLabel: '공급사 명'
                        },new Ext.form.Hidden({ id: 'supplierUid',    		name: 'supplierUid',    		value: supplierUid  }),
                        {
                            xtype: 'textfield',
                            flex : 1,
                            name : 'arAmount',readOnly : true,
                            fieldStyle: 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;text-align:right;',
                            value:Ext.util.Format.number(vApSum, '0,00/i'),
                            fieldLabel: '정산금액'
                        },
                        {
                            xtype: 'textarea',
                            flex : 1,
                            rows: 3,
                            name : 'txt_content',
                            value:txt_content,
                            fieldLabel: '정산요약'
                        }
                        
                        
                        ]
            }),
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanelAp').getForm();
                    if(form.isValid())
                    {
                	var val = form.getValues(false);
                	var xpoast_uids = val['xpoast_uids'];
                	var txt_name = val['txt_name'];
                	var vApMonth = val['vApMonth'];
                	var supplier_code = val['supplier_code'];
                	var supplier_name = val['supplier_name'];
                	var supplierUid = val['supplierUid'];
                	var arAmount = val['arAmount'];
                	var txt_content = val['txt_content'];
                	var item_abst = val['item_abst'];
                	
			       	Ext.Ajax.request({
						url: CONTEXT_PATH + '/purchase/prch.do?method=addPaymentComplete',				
						params:{
							xpoast_uids   : xpoast_uids,
							txt_name      : txt_name,
							txt_content   : txt_content,
							item_abst     : item_abst,
			       			supplier_code : supplier_code,
			       			supplierUid   : supplierUid,
			       			reserved_varchar2   	  : reserved_varchar2
			       			
						},
						
						success : function(result, reserved_varchar8) {
			  					store.load();
						},//Ajax success
						failure: extjsUtil.failureMessage
					}); 
            	
                   	if(win) 
                   	{
                   		win.close();
                   		// lfn_gotoHome();
                   	} 
                } else {
                	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                }
                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {
            			win.close();}
            			// lfn_gotoHome();
            		}
            }]
        });
        win.show();


//			var checkboxWidget = '<input type="checkbox" id="chkPrint" />'
//            	+qgr1_print_barcode+'<br/><br/>'
//            	+qgr1_comment;
//			
			
//		  	  Ext.MessageBox.show({
//		            title:delete_msg_title,
//		            multiline: true,
//		            width: 400,
//		            msg: [po_nolist]+'정산하시겠습니까?',
//		            buttons: Ext.MessageBox.YESNO,
//		            fn: function (btn, gr_reason, opt) {
//                        if(btn == 'yes' ) {
//
//            				Ext.Ajax.request({
//            					url: CONTEXT_PATH + '/purchase/prch.do?method=createAdjustment',
//            					params:{
//            						xpoast_uids: xpoast_uids
//            						
//            					},
//            					success : function(result, request) {
//            				              // store.load(function(){});
//            					},
//            					failure: extjsUtil.failureMessage
//            				});
//            				
//            				
//            			}
//                        
//
//		            } , 
//		            icon: Ext.MessageBox.QUESTION
//		        });

		
	}//endof handler
});



Ext.onReady(function() {  

	var newCenterColumn = [];
	for(var i=0; i<vCENTER_COLUMNS.length; i++) {
		
		//console_logs('vCENTER_COLUMNS[' + i + ']', vCENTER_COLUMNS[i]);
		
		var o = vCENTER_COLUMNS[i];
		
		vCENTER_COLUMNS[i]['listeners'] = '';
		
		var o1 = {
				header: o['text'],
		        width: o['width'],
		        sortable: o['sortable'],
		        dataIndex: o['dataIndex']				
		};

		switch(vCENTER_COLUMNS[i]['dataIndex']) {
			case 'gr_date':
				o1['summaryType'] = 'max';
				o1['renderer'] = function(value, summaryData, dataIndex) {
		            return value.substring(0,10);
		        };
		        o1['summaryRenderer'] = function(value, summaryData, dataIndex) {
		            return value.substring(0,10);
		        };
				break;

			case 'item_name':
				o1['summaryType'] = 'count';
				o1['summaryRenderer'] = function(value, summaryData, dataIndex) {
		            return ((value === 0 || value > 1) ? '(' + value + ' 종)' : '(1 종)');
		        };
				break;
			case 'sales_price':
				o1['summaryType'] = 'average';
				o1['field'] = { xtype: 'numberfield'};
				o1["align"] = "right";
				o1["renderer"] = renderNumber
				o1['summaryRenderer'] = function(value, summaryData, dataIndex) {  return '평균:' + Ext.util.Format.number(value, '0,00/i');   };
				break;
			case 'po_qty':
			case 'gr_qty':
				o1['summaryType'] = 'sum';
				o1['field'] = { xtype: 'numberfield'};
				o1["align"] = "right";
				o1["renderer"] = renderNumber
				o1['summaryRenderer'] = function(value, summaryData, dataIndex) {  return '' + Ext.util.Format.number(value, '0,00/i');   };
				break;
			case 'gr_amount':
				o1['summaryType'] = 'sum';
				o1['field'] = { xtype: 'numberfield'};
				o1["align"] = "right";
				o1["renderer"] = renderNumber
				o1['summaryRenderer'] = function(value, summaryData, dataIndex) {  return '합계:' + Ext.util.Format.number(value, '0,00/i');   };
				break;
			default:
		}
		
		newCenterColumn.push(o1);
	}
	
	Ext.define('WgrAst', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/purchase/prch.do?method=readGoodsReceipt'
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
		pageSize: 1000,
		model: 'WgrAst',
		groupField :'gr_no',
		sorters: [{
			property: 'unique_id',
			direction: 'DESC'
		}]
	});
	store.getProxy().setExtraParam('is_closed', "Y");
	
	
	Ext.define('Supplier', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS_SUB,
	   	    proxy: {
					type: 'ajax',
			        api: {
			            read: CONTEXT_PATH + '/purchase/supplier.do?method=read'
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
	
	supplierStore = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'Supplier',
		sorters: [{
            property: 'supplier_name',
            direction: 'ASC'
        }]
	});
	supplierStore.getProxy().setExtraParam('only_ap_pending', "Y");
	
	var oneMonthAgo = new Date();
	oneMonthAgo.setMonth(oneMonthAgo.getMonth()-1);
	
	var firstDay = new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth(), 1);
	var lastDay = new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth() + 1, 0);
		
	supplierStore.getProxy().setExtraParam('s_date', firstDay);
	supplierStore.getProxy().setExtraParam('e_date', lastDay);
	
	vApMonth = yyyymmdd(firstDay, '-').substring(0,7);
	
	console_logs('vApMonth', vApMonth);
	
	supplierStore.load(function() {
		
		var supplierSelModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		supplierGrid = Ext.create('Ext.grid.Panel', {
			layout:'border',
			region: 'west',
            width: '35%',    
			store: supplierStore,
		        collapsible: false,
		        multiSelect: false,
		        selModel: supplierSelModel,
		        height: getCenterPanelHeight(), 
		        stateId: 'supplierGrid' + /*(G)*/vCUR_MENU_CODE,
		        autoScroll : true,
		        autoHeight: true,
		        //bbar: getPageToolbar(store),
		        
		        dockedItems: [{
			        	xtype: 'toolbar',
			        	items: [{ 
			        	fieldLabel:getColName('gr_date'),
			                id:getSearchField('s_date'),
			                format: 'Y-m-d',
					    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	allowBlank: true,
						    	editable:false,
						    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
						    	xtype: 'datefield',
						    	value: firstDay,
						    	width: 160,
						    	labelWidth:55
						},'~',{ 
							id:getSearchField('e_date'),
			                format: 'Y-m-d',
					    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
					    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						    	allowBlank: true,
						    	editable:false,
						    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
						    	xtype: 'datefield',
						    	value: lastDay,
						    	width: 100
						}, '-', searchAction
						]
			        }	        
		        ],
		        columns: /*(G)*/vCENTER_COLUMN_SUB,
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
		                    contextMenu.showAt(e.getXY());
		                    return false;
		                }
		            	//,
		                //itemdblclick: viewHandler
		            }
		        },
		        title: getMenuTitle()
		    });
		
			supplierGrid.getSelectionModel().on({
	        selectionchange: function(sm, selections) {
	    		if (selections.length) {
	    			console_logs('selections', selections);

	    			vSelectedSuplier = selections[0];
	    			var supplier_code = selections[0].get('supplier_code');
	    			var supplier_name = selections[0].get('supplier_name');

	    			store.getProxy().setExtraParam('seller_code', supplier_code);
	    			
	    			var s_date = Ext.getCmp(getSearchField('s_date')).getValue();
	    			var e_date = Ext.getCmp(getSearchField('e_date')).getValue();
	    			
	    			
	    			store.getProxy().setExtraParam('s_date', s_date);
	    			store.getProxy().setExtraParam('e_date', e_date);
	    			
	    			store.getProxy().setExtraParam('start', 0);
	    			store.getProxy().setExtraParam('limit', 1000);
	    			store.getProxy().setExtraParam('page', 1);
	    			
	    			
	    			
	    			store.load( function(records) {
	    				var sm = grid.getSelectionModel();
	    				
	    				var arSum = 0;
	    				Ext.each(records, function(record) {
	    						console_logs('record', record);
	    		               sm.select(record.index, true);
	    		               arSum = arSum + record.get('gr_amount');
	    				});
	    				
	    				rederApSum(arSum);
	    				
	    				vApTitle = vApMonth + ' : ['+ supplier_code +'] ' + supplier_name;
	    				grid.setTitle(vApTitle);
	    				
	    			});
	            } else {
	            	vSelectedSuplier = null;
	            	vApTitle='';
	            	grid.setTitle('입고 목록');
	            	store.removeAll();
	            } 
	        	
	        }
	    });
		
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
			layout:'border',
			region: 'center',
            width: '65%',   
			stateful : true,
			collapsible : true,
			multiSelect : true,
			selModel : selModel,
			height : getCenterPanelHeight(),
			stateId : 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			autoScroll : true,
			autoHeight : true,
	        features: [{
	            id: 'group',
	            ftype: 'groupingsummary',
	            groupHeaderTpl: '{name}',
	            hideGroupedHeader: true,
	            enableGroupingMenu: false
	        }],
	        bbar: getPageToolbar(store),
	        
	        dockedItems: [{
	        	dock : 'top',
	        	xtype: 'toolbar',
	        	items: [AdjustmentAction,'-',
	        	        {
			        	   xtype: 'component',
				           style: 'margin:5px;color:#1549A7;',
					 	   html: '정산금액:'
			           },
			           {
			        	   xtype: 'component',
				           style: 'margin:5px;color:#1549A7;font-weight:bold;',
				           id: 'arAmount',
					 	   html: '0'
			           }
		        	        
	        	        
	        	        
	        	        ]
	        }],
	        columns: newCenterColumn,
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
	        title: '입고 목록'
		});
		
		grid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	    		var arSum = 0;
	    		if (selections.length) {
		    			Ext.each(selections, function(record) {
			               arSum = arSum + record.get('gr_amount');
		    			});
	    			
					//grid info 켜기
					//displayProperty(selections[0]);
					if(fPERM_DISABLING()==true) {
						AdjustmentAction.disable();
					}else{
						AdjustmentAction.enable();
					}
	            } else {
	            	
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
		            	AdjustmentAction.disable(); 
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
	            		AdjustmentAction.disable(); 
	            	}
	            }
	    		rederApSum(arSum);
	        }
	    });

		
		Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
		        Ext.create('Ext.tip.ToolTip', config);
		});
		
		var main =  Ext.create('Ext.panel.Panel', {
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
		    items: [  supplierGrid, grid  ]
		});
		
		fLAYOUT_CONTENT(main);  
	    
		cenerFinishCallback();//Load Ok Finish Callback	
	}); //store load
 	console_log('End...');
 	
});

