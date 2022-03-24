var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});
var gSelectedRtgast = null;
var grid = null;
var store = null;
var gridSub = null;
var storeSub = null;
var main2 = null;
var sales_person1_email_address = '';
var cloudprojectStore = Ext.create('Mplm.store.cloudProjectStore', {} );
var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchToolBarTap
});

var canclPoAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
	iconCls: 'door_out',
	text: ppo2_order_cancel,
	disabled: true,
	handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:'주문 취소',
            msg: '선택한 항목의 수량 만큼 주문취소 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: canclPoConfirm,
            //animateTarget: 'mb4',
            icon: Ext.MessageBox.QUESTION
        });
    }
});
function canclPoConfirm(btn){
	var selections = gridSub.getSelectionModel().getSelection();
	if (selections) {
	    var result = MessageBox.msg('{0}', btn);
	    if(result=='yes') {
	    	for(var i=0; i< selections.length; i++) {
	    		var rec = selections[i];
	    		//console_logs('rec', rec);
	    		var unique_id = rec.get('unique_id');
	    		
				var po_qty = rec.get('po_qty');
				var gr_qty = rec.get('gr_qty');
				var can_qty = po_qty-gr_qty;
	    		var po_blocking_qty = rec.get('po_blocking_qty');
	    		
	    		//취소수량은 취소가능수량을 넘을 수 없다.
	    		if(po_blocking_qty>can_qty) {
	    			po_blocking_qty = can_qty;
	    			//console_logs('취소수량은 취소가능수량을 넘을 수 없다. po_blocking_qty=' + po_blocking_qty);
	    		}
	    		
	    		
	    		var account_code = rec.get('account_code');
	           	var xpoast = Ext.ModelManager.create({
	           		unique_id : unique_id
	           		,po_blocking_qty : po_blocking_qty
	           		,account_code : account_code
	        	}, 'XpoAstAbst');
	    		
	           	xpoast.destroy( {
	           		 success: function() {
	           			storeSub.load(function() {
	           				Ext.MessageBox.alert('확인','선택한 항목의 수량을 주문 취소 하였습니다.');
	           			});
	           			
	           		 }
	           	});
	       	
	    	}
	    	//gridSub.store.remove(selections);
	    }
	
	}
}

function viewPoDetail (rec) {
	
	if(rec!=null) {
	
		var po_no = rec.get('po_no');
		var name = rec.get('name');
		var content = rec.get('content');
		var requester = rec.get('requester');
		var rtg_type = rec.get('rtg_type');
		var submit_date = rec.get('create_date');
		var req_date = rec.get('req_date');
		
		Ext.getCmp('disp_po_no').setValue(po_no);
		Ext.getCmp('disp_name').setValue(name);
		Ext.getCmp('disp_content').setValue(content);
//		Ext.getCmp('disp_req_date').setValue(req_date.substring(0,10));
//		Ext.getCmp('disp_requester').setValue(requester);
		Ext.getCmp('disp_submit_date').setValue(submit_date.substring(0,10));

		var rtgastUid = rec.get('unique_id');
		
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/purchase/request.do?method=getPodetail',				
			params:{
				uid_rtgast : rtgastUid
			},
			
			success : function(result) {
				//console.log('result', result);
				var text = result.responseText;
				//console.log('text', text);
				var o = JSON.parse(text, function (key, value) {
							//console.log('key,value=', key + ',' + value);
							/*
							var type;
						    if (value && typeof value === 'object') {
						        type = value.type;
						        if (typeof type === 'string' && typeof window[type] === 'function') {
						            return new (window[type])(value);
						        }
						    }
						    */
						    return value;
						});
				
				//console.log('Podetail', o);
				var delivery_address_1 = o['delivery_address_1'];
				var item_abst = o['item_abst'];
				var item_quan = o['item_quan'];
				var pay_condition = o['pay_condition'];
				var request_info = o['request_info'];
				var	supplier_code = o['supplier_code'];
				var	supplier_name = o['supplier_name'];
				var sales_amount = o['sales_amount'];
				sales_person1_email_address = o['sales_person1_email_address'];
				
				Ext.getCmp('disp_totalPrice').setValue(sales_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				
				
				Ext.getCmp('po_detail').getEl().show();
				Ext.getCmp('po_detail').setValue(
						item_abst + "\r\n" + 
						"결제조건: " + pay_condition + "\r\n" + 
						"법적고지: " + request_info + "\r\n" + 
						"납품장소: " + delivery_address_1
				);
				Ext.getCmp('po_detail').getEl().show();
				
			},
			failure: extjsUtil.failureMessage
		});

	} else {
		Ext.getCmp('disp_po_no').setValue('');
		Ext.getCmp('disp_name').setValue('');
		Ext.getCmp('disp_content').setValue('');
//		Ext.getCmp('disp_req_date').setValue('');
//		Ext.getCmp('disp_requester').setValue('');
		Ext.getCmp('disp_submit_date').setValue('');
		Ext.getCmp('disp_totalPrice').setValue('');
		Ext.getCmp('po_detail').setValue('');	

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
    		url: CONTEXT_PATH + '/pdf.do?method=printPo',
    		params:{
    			rtgast_uid : rtgast_uid,
    			po_no : po_no,
    			pdfPrint : 'pdfPrint'
    		},
    		reader: {
    			pdfPath: 'pdfPath'
    		},
    		success : function(result, request) {

        	        var jsonData = Ext.JSON.decode(result.responseText);
        	        var pdfPath = jsonData.pdfPath;       	        
        	    	if(pdfPath.length > 0) {
        	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
        	    		top.location.href=url;	
        	    	}

    		},
    		failure: extjsUtil.failureMessage
    	});//ajaxrequest
    	
    	
    }//endofhandler
});

var sendMailAction = Ext.create('Ext.Action',{
    iconCls: 'email_go',
    text: '메일전송',
    disabled: true,
    handler: function(widget, event) {

     	var rtgast_uid = gSelectedRtgast.get('unique_id');//rtgast_uid
    	var po_no = gSelectedRtgast.get('po_no');//po_no
    	var po_detail = Ext.getCmp('po_detail').getValue();
    	po_detail = po_detail.replace(/(?:\r\n|\r|\n)/g, '<br />');
    	
    	po_detail = po_detail + "<br /><br /><br />본 메일은 발신전용이오니 아래의 연락처에 문의하세요.<br /><br />";
    	po_detail = po_detail + "문의처: " + vCUR_DEPT_NAME + ', ' + vCUR_USER_NAME + ' (' + vCUR_EMAIL + ')<br />';
    	po_detail = po_detail + "별첨: 주문서";
    	
    	//console_logs('gSelectedRtgast', gSelectedRtgast);
    	//console_logs('po_no', po_no);
    	var mailForm = Ext.create('Ext.form.Panel', {
    		id: 'formPanelSendmail',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            region: 'center',
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
             items: [
				new Ext.form.Hidden({
					name: 'rtgast_uid',
					value: rtgast_uid
				    }),
				new Ext.form.Hidden({
					name: 'po_no',
					value: po_no
				    }),
    	    	 {
    	             name: 'mailTo',
    	             allowBlank: false,
    	             value: sales_person1_email_address,
    	             anchor: '100%'  // anchor width by percentage
    	         },
    	    	 {
    	             name: 'mailSubject',
    	             allowBlank: false,
    	             value: '[' + po_no + '] 주문합니다.',
    	             anchor: '100%'  // anchor width by percentage
    	         },
    	    	 {
    	             name: 'mailContents',
    	             allowBlank: false,
    	             xtype: 'htmleditor',
    	             value: po_detail,
    	             height: 240,
    	             anchor: '100%'
    	    	 }
             ]
        });
    	
    	var win = Ext.create('ModalWindow', {
            title: '공급사에 메일 전송',
            width: 600,
            height: 400,
            items: mailForm,
            buttons: [{
                text: '메일전송 ' + CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanelSendmail').getForm();
                    if(form.isValid())
                    {
                    	var val = form.getValues(false);
                    	//console_logs('val', val);

                    	Ext.Ajax.request({
                    		url: CONTEXT_PATH + '/pdf.do?method=printPo',
                    		params:{
                    			rtgast_uid : val['rtgast_uid'],
                    			po_no : val['po_no'],
                    			mailTo : val['mailTo'],
                    			mailSubject : val['mailSubject'],
                    			mailContents : val['mailContents'],
                    			pdfPrint : 'sendMail'
                    		},
                    		success : function(result, request) {
        	            		if(win) {
        	            			win.close();
        	            		}//
                            	Ext.MessageBox.alert('전송확인', '전송되었습니다.');
                    		},
                    		failure: extjsUtil.failureMessage
                    	});//ajaxrequest

                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }

                  }//endofhandler
            	},{
	                text: CMD_CANCEL,
	            	handler: function(){
	            		if(win) {
	            			win.close();
	            		}//endofwin
	            	}//endofhandler
            	}//CMD_CANCEL
            ]//buttons
        });
        win.show();
    	
    }//endofhandler
});
//var removeAction = Ext.create('Ext.Action', {
//	itemId: 'removeButton',
//    iconCls: 'remove',
//    text: CMD_DELETE,
////    disabled: true,
//    handler: function(widget, event) {
//    	Ext.MessageBox.show({
//            title:delete_msg_title,
//            msg: delete_msg_content,
//            buttons: Ext.MessageBox.YESNO,
//            fn: deleteConfirm,
//            icon: Ext.MessageBox.QUESTION
//        });
//    }
//});
var is_complished = null;
var po_no = null;
function getStatesToolBar(){
	var arrStatesToolBar = [];
	
//	arrStatesToolBar.push(
//			{
//	        	id :'is_complished',
//            	xtype:          'combo',
//                mode:           'local',
//                value:          'A',
//                triggerAction:  'all',
//                forceSelection: true,
//                editable:       false,
//                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
////	                        allowBlank: false,
//                emptyText:  ppo1_filter,
//                name:           'is_complished',
//                displayField:   'value',
//                valueField:     'name',
//                queryMode: 'local',
//                store:          Ext.create('Ext.data.Store', {
//                    fields : ['name', 'value'],
//                    data   : [
//                        {name : 'A',   value: ppo2_payment_complete}//결재완료
//                        ,{name : 'I',   value: panelSRO1209}//결재중
//                        ,{name : 'G',   value: ppo2_in_complete}//입고완료
//                        ,{name : 'D',   value: panelSRO1207}//반려
//                        ,{name : 'T',   value: ppo2_all}//모두검색
//                    ]
//                }),
//                listeners: {
//                	select: function (combo, record) {
//                	}
//                }
//			}
//	);
//		
	arrStatesToolBar.push(
			{
	        	fieldLabel: '',
	        	//labelWidth: 70,
	        	width: 148,
	        	xtype: 'triggerfield',
	        	id :'po_no',
	        	name : 'po_no',
	        	emptyText:  qgr1_po_no,
	        	labelSeparator: '',
	        	readOnly: false,
//		        	fieldStyle: 'background-color: #E7EEF6; background-image: none;',
	        	//enableKeyEvents: true,
	        	listeners: {
//	        		expand: function(){
//	        			// fromPicker = true;
//	        		},
//	        		collapse: function(){
//	        			//   fromPicker = false;  
//	        		},
//	        		change: function(d, newVal, oldVal) {
//	        			//                if (fromPicker || !d.isVisible()) {
//	        			//                    showDate(d, newVal);
//	        			//                }
//	        		},
//	        		keypress: {
//	        			buffer: 500,
//	        			fn: function(field){
//	        				var value = field.getValue();
//	        				if (value !== null && field.isValid()) {
//	        					// showDate(field, value);
//	        				}
//	        			}
//	        		},
	        		specialkey : function(fieldObj, e) {
		         		if (e.getKey() == Ext.EventObject.ENTER) {
		         			searchToolBarTap();
		         		}
			        }
	        	},
	        	trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
		         'onTrigger1Click': function() {
		         	Ext.getCmp('po_no').setValue('');
		     	}
			}
	);
	return arrStatesToolBar;
}
//var contextMenu = Ext.create('Ext.menu.Menu', {
//    items: [ detailAction ]
//});

Ext.onReady(function() {  
	console_log('now starting...');
	var statesToolBar = getStatesToolBar();
	LoadJs('/js/util/comboboxtree_cloud.js');

//	var searchField = [];
//	searchField.push('po_no');
//	searchField.push('content');
//	makeSrchToolbar(searchField);
	
	Ext.define('RtgAst', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/sales/delivery.do?method=read',
			            create: CONTEXT_PATH + '/sales/delivery.do?method=create',
			            update: CONTEXT_PATH + '/sales/delivery.do?method=create',
			            destroy: CONTEXT_PATH + '/sales/delivery.do?method=destroy'
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
	
	Ext.define('XpoAstAbst', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS_SUB,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/purchase/prch.do?method=readDetail&onlyChild=true',
//			            create: CONTEXT_PATH + '/purchase/prch.do?method=create',
//			            update: CONTEXT_PATH + '/purchase/prch.do?method=create',
			            destroy: CONTEXT_PATH + '/purchase/prch.do?method=destroy'
			        },
					reader: {
						type: 'json',
						root: 'datas',
						totalProperty: 'count',
						successProperty: 'success'
//						excelPath: 'excelPath'
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
		model: 'RtgAst',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	storeSub = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'XpoAstAbst',
		//remoteSort: true,
		sorters: [{
			property: 'unique_id',
			direction: 'DESC'
		}]
	});
	store.getProxy().setExtraParam('menu','PPO2');
	store.load(function() {

		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
//		var projectToolBar = getProjectToolbar(false/*hasPaste*/, false/*excelPrint*/) ;
		
		grid = Ext.create('Ext.grid.Panel', {
		        store: store,
		        collapsible: false,
		        multiSelect: true,
		        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
		        selModel: selModel,
		        autoScroll : true,
		        region: 'center',

		        height: getCenterPanelHeight(),
		        
		        bbar: getPageToolbar(store),
		        
		        dockedItems: [{
		        	xtype: 'toolbar',
		            items:[searchAction] 
		        },
		        
//		        {
//		        	xtype: 'toolbar',
//		        	items: [{
//						id:'projectcombo',
//					    	xtype: 'combo',
//					    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
//					           mode: 'local',
//					           editable:false,
//					           // allowBlank: false,
//					           width: 180,
//					           queryMode: 'remote',
//					           emptyText:'프로젝트',
//					           displayField:   'pj_name',
//					           valueField:     'unique_id',
//					           store: cloudprojectStore,
//					            listConfig:{
//					            	
//					            	getInnerTpl: function(){
//					            		return '<div data-qtip="{unique_id}">[{pj_code}] {pj_name}</div>';
//					            	}			                	
//					            },
//					           triggerAction: 'all',
//					            listeners: {
//					                 select: function (combo, record) {
//					                 	
//					                 	console_log('Selected Value : ' + combo.getValue());
//					                 	var pjuid = record[0].get('unique_id');
//					                 	var pj_name  = record[0].get('pj_name');
//					                 	var pj_code  = record[0].get('pj_code');
//					                 	store.getProxy().setExtraParam('pjUid', pjuid);
//				        				store.load({});
//				                 }
//				            }
//			        }]//combotree//projectToolBar
//		        },
//		        
		        {
		        	xtype: 'toolbar',
		        	items: statesToolBar
		        }],
		        columns: /*(G)*/vCENTER_COLUMNS,
//		        plugins: [cellEditing],
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
//		            		,
//		                itemcontextmenu: function(view, rec, node, index, e) {
//		                    e.stopEvent();
//		                    contextMenu.showAt(e.getXY());
//		                    return false;
//		                }
//		                itemdblclick: viewHandler
		            }
		        },
		        title: getMenuTitle()
		    });
		
		 grid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	    		if (selections.length) {
	    			var rec = grid.getSelectionModel().getSelection()[0];
	    			if(	
	    					gSelectedRtgast==null || 
	    					(gSelectedRtgast.get('unique_id') != rec.get('unique_id'))
	    			) {
		    			gSelectedRtgast = rec;
	//		    			var state = rec.get('state');
	//		    			displaygridSub(selections[0]);
	//		    			displayProperty(selections[0]);
	
	    				var rec = grid.getSelectionModel().getSelection()[0];
	//		    				var unique_id = rec.get('unique_id');
	    				var po_no = rec.get('po_no');
	    				var content = rec.get('content');
	    				var name = rec.get('name');
	//		    				storeSub.getProxy().setExtraParam('unique_id', unique_id);
	    				storeSub.getProxy().setExtraParam('po_no', po_no);
	    				storeSub.getProxy().setExtraParam('content', content);
	    				storeSub.getProxy().setExtraParam('isPoqtyNoneZero', "true");//주문수량 있는 것만
	    				
	    				
	    				storeSub.load(function(records){
							
							var totalPrice = 0;
	     					console_log(records); 
	     					if(records != undefined ) {
	     						for (var i=0; i<records.length; i++){ 
	     							var o = records[i];
	     							////console_logs('o', o);
	     							var po_qty = o.get('po_qty');
	     							var gr_qty = o.get('gr_qty');
	     							var po_blocking_qty = o.get('po_blocking_qty');
	     							//console_logs('po_qty', po_qty);
	     							//console_logs('gr_qty', gr_qty);
	     							//console_logs('po_blocking_qty', po_blocking_qty);
	     							o.set('cur_blocking_qty', po_blocking_qty);
	     							o.set('po_blocking_qty', po_qty-gr_qty);
	     						}
	     					}
	     					//Ext.getCmp('disp_totalPrice').setValue(totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	    					
	    				});
	    				
	    				if(storeSub != null){
	    					main2.setTitle('[' + po_no + '] ' + name);
	                	}

	    				printPDFAction.enable();
	    				sendMailAction.enable();
	    				
	    				viewPoDetail(rec);
			
		    		}
    			} else {
    				gSelectedRtgast = null;;
//		            	removeAction.disable();	
            		printPDFAction.disable();
            		sendMailAction.disable();
            		main2.setTitle('-');
            		storeSub.removeAll();
    				//detailAction.disable();

    				viewPoDetail(null);
	    		}
	    	}
	    });
//		fLAYOUT_CONTENT(grid);
		var selModelC = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		
		
 		Ext.each(/*(G)*/vCENTER_COLUMN_SUB, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			if('po_blocking_qty' == dataIndex) {
				columnObj["editor"] = {}; columnObj["css"] = 'edit-cell';
				columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
		        	return value;
	        	};
			}

		});
		
		
		
		gridSub = Ext.create('Ext.grid.Panel', {
			store: storeSub,
	        stateId: 'stateGrid',
	        selModel: selModelC,
	        frame: false,
	        border: false,
	        //border: true,
            //bodyPadding: 10,
            region: 'center',
            height: 400,
            autoScroll: true,
	        dockedItems: [{
	        	xtype: 'toolbar',
	            items: canclPoAction
	        }],
	        columns: /*(G)*/vCENTER_COLUMN_SUB,
            getRowClass: function(record) { 
	              return (record.get('po_qty') - record.get('gr_qty') ) > 0  ? 'my-row' : ''; 
            } ,
	        plugins: [cellEditing],
	        viewConfig: {
	            stripeRows: true,
	            markDirty:false,
	            enableTextSelection: true //,
//	            listeners: {
//	                itemcontextmenu: function(view, rec, node, index, e) {
//	                    e.stopEvent();
//	                    contextMenu.showAt(e.getXY());
//	                    return false;
//	                },
//	                itemdblclick: function(){
//	                }
//	            }
	        },
            listeners: {
    		'afterrender' : function(grid) {
				var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
				elments.each(function(el) {
							}, this);
					
				}
            },
	        title: '주문 품목'
//		        renderTo: 'MAIN_DIV_TARGET'
		});
		
	    gridSub.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	    		if (selections.length) {
					//grid info 켜기
//					displayProperty(selections[0]);
//					detailAction.enable();
					if(fPERM_DISABLING()==true) {
						canclPoAction.disable();	
					}else{
						canclPoAction.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
		            	canclPoAction.disable(); 
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
		            	canclPoAction.disable(); 
	            	}
	            }
	        }
	    });
	    
		var myFormPanel = Ext.create('Ext.form.Panel', {
			id: 'myFormPanel' + 'PPO2_CLD',
			title: '주문 요약',
			xtype: 'form',
			frame: false,
	        border: false,
            bodyPadding: 10,
            region: 'center',
            height: 400,
            autoScroll: true,
	        defaults: {
	            anchor: '100%',
	            allowBlank: false,
	            msgTarget: 'side',
	            labelWidth: 60
	        },
	        items: [
                
               
                {
                    xtype: 'container',
                    layout:'column',
                    items:[
		                
		                {
		    				fieldLabel: '주문번호',
		    				xtype:  'displayfield',
		    				id: 'disp_po_no',
		    				columnWidth: 0.5,
		    				anchor: '100%'
		    			},{
		    		    	fieldLabel: '상신일자',
		    		    	xtype:  'displayfield',
		    		    	id: 'disp_submit_date',
		    		    	columnWidth: 0.5,
		    		    	anchor: '100%'
		    		    }]
                },
                {
                    xtype: 'container',
                    layout:'column',
                    items:[
		                {
		    		    	fieldLabel: crt3_name,
		    		    	xtype:  'displayfield',
		    		    	id: 'disp_name',
		    		    	columnWidth: 1,
		    		    	anchor: '100%'
		    		    }]
                }
                ,
                {
                    xtype: 'container',
                    layout:'column',
                    items:[
		                {
		    		    	fieldLabel: crt3_content,
		    		    	xtype:  'displayfield',
		    		    	id: 'disp_content',
		    		    	columnWidth: 1,
		    		    	anchor: '100%'
		    		    }]
                }
                ,
    		    
//                {
//                    xtype: 'container',
//                    layout:'column',
//                    items:[
//		    		    {
//		    		    	fieldLabel: '요청일자',
//		    		    	xtype:  'displayfield',
//		    		    	id: 'disp_req_date',
//		    		    	columnWidth: 0.5,
//		    		    	anchor: '100%'
//		    		    },{
//		    		    	fieldLabel: '요청자',
//		    		    	xtype:  'displayfield',
//		    		    	id: 'disp_requester',
//		    		    	columnWidth: 0.5,
//		    		    	anchor: '100%'
//		    		    }
//		    		    ]
//                }
//,
    		    
                {
                    xtype: 'container',
                    layout:'column',
                    items:[
		    		    {
		    		    	fieldLabel: '합계금액',
		    		    	xtype:  'displayfield',
		    		    	id: 'disp_totalPrice',
		    		    	columnWidth: 0.5,
		    		    	anchor: '100%'
		    		    }
		    		    ]
                },
                {
					xtype: 'textarea',
					margin: '15 0 0 0',//  top, right, bottom, left
					itemId: 'po_detail_item',
					width: '100%',
					name: 'po_detail',
					id: 'po_detail',
				    rows: 7,
				    readOnly: true,
	    			fieldStyle: 'background-color: #EAEAEA; background-image: none;',
				    allowBlank: true
				}
                ]
			});
		main2 =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
			//height: getCenterPanelHeight(),
		    layout:'border',
		    title: ' - ',
		    border: true,
//		    region: 'center',
		    region: 'east',
            width: '60%',
		    layoutConfig: {columns: 2, rows:1},
//		    defaults: {
//		        collapsible: true,
//		        split: true,
//		        cmargins: '5 0 0 0',
//		        margins: '0 0 0 0'
//		    },
		    items: [myFormPanel, gridSub],
		    dockedItems: [{
	        	xtype: 'toolbar',
	            items:[printPDFAction, '-', sendMailAction] 
	        }]
		});
	    
	    var main =  Ext.create('Ext.panel.Panel', {
		    layout:'border',
	        border: false,
	        layoutConfig: {columns: 2, rows:1},
		    defaults: {
		        collapsible: true,
		        split: true,
		        cmargins: '5 0 0 0',
		        margins: '0 0 0 0'
		    },
		    items: [grid,main2]
		});

		fLAYOUT_CONTENT(main);  
		cenerFinishCallback();//Load Ok Finish Callback	
	}); //store load
 	console_log('End...');
});