var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});
//global var.
var togIsNew = true;
var grid = null;
var gridContract = null;
var store = null;
var agrid = null;
var storeQuota = null;
var storeContract = null;

var ahid_userlist = new Array();
var ahid_userlist_role = new Array();
var unique_uid = new Array();
var catmapUids = null;
var catmapObj = null;
var selectedAssyUid = '';
var selectedSupast = null;
var selectionLength = 0;

var firstCartline =null; // 선택된 첫번째 자재.

var payCondition = ''; //결재조건
var regalConditionPo = ''; //주문조건
var delivertAddress = ''; //견적조건

var addBtnText = ppo1_order_create;

var gSelectedTab = 'pr-div';
var gSelectedRfq = null;

var gGridSelects=[];
function copyArrayGrid(from) {

	gGridSelects = [];
	if(from!=null && from.length>0) {	
		for(var i=0; i<from.length; i++) {
			gGridSelects[i] = from[i];
		}
	}
}

function refreshButton() {
	if(gSelectedTab=='pr-div') {
		var selections = grid.getSelectionModel().getSelection();
	    if (selections.length>0) {
	    	checkAction();
	    }else {
	    	addAction.disable();
	    }
	} else if(gSelectedTab=='contract-div') {
		var selections = gridContract.getSelectionModel().getSelection();
	    if (selections.length>0) {
	    	addAction.enable();
	    }else {
	    	addAction.disable();
	    }
	}
	
}

function displayQuota(oRfq) {
	console_logs('oRfq', oRfq);
	
	gSelectedRfq = oRfq;
	var quota_content = Ext.getCmp('quota_content');
	
	
	if(oRfq!=null) {
		var rf_uid = oRfq.get('id');
		var supastUid = oRfq.get('coord_key');
		var rfq_no = oRfq.get('po_no');
		
		var supplier_code = oRfq.get('supplier_code');
		var	supplier_name = oRfq.get('supplier_name');
		
		var oStatus = Ext.getCmp('status');
		
		var oSel = {};
		oSel['systemCode'] = 'CT';
		oSel['systemName'] = '계약완료';
		oSel['systemNameEn'] = 'CT';
		oStatus.setValue('CT');
		oStatus.fireEvent('select', oStatus, oSel);
		
		store.getProxy().setExtraParam('status', status);
		store.getProxy().setExtraParam('rf_uid', rf_uid);
		store.load(function(){});
		
		var oSupplier = Ext.getCmp('supplier_information');
		
		oSupplier.store.getProxy().setExtraParam('supplier_code', supplier_code);
		oSupplier.store.getProxy().setExtraParam('supplier_name', '');
		oSupplier.store.load(function(record){
			
    		var unique_id = record[0].get('unique_id');
			var supplier_name = record[0].get('supplier_name');
			var sales_person1_name = record[0].get('sales_person1_name');
			var sales_person1_telephone_no = record[0].get('sales_person1_telephone_no');
			var sales_person1_fax_no = record[0].get('sales_person1_fax_no');
			var sales_person1_mobilephone_no = record[0].get('sales_person1_mobilephone_no');
			var sales_person1_email_address = record[0].get('sales_person1_email_address');
			var address_1 = record[0].get('address_1');
				
			selectedSupast = record[0];
			selectedSupplierHandler(selectedSupast);
			oSupplier.setValue(supplier_name);

			Ext.getCmp('sp_srchSupplier_uid').setValue(unique_id);
			Ext.getCmp('sp_srchSupplier_name').setValue(supplier_name+' : '+sales_person1_name+' : '+sales_person1_mobilephone_no+' : '+sales_person1_email_address);
			
			checkAction();
		
		});
		
		//supplier 검색
		
		
		quota_content.setLoading(true);	
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/sales/quota.do?method=getSelectedQutaHtml',
			params:{
				rfq_no: rfq_no,
				reserved_number4: rf_uid,
				coord_key: supastUid,
				buyer_view: 'true'
			},
			success : function(result, request) {   
				var val = result.responseText;

				quota_content.setValue(val);
				quota_content.setHeight('100%');
				

				quota_content.setLoading(false);
	
			},
			failure: extjsUtil.failureMessage
		});
		
			
	} else {
		var oStatus = Ext.getCmp('status');
		var oSel = {};
		oSel['systemCode'] = '-1';
		oSel['systemName'] = '-미지정-';
		oSel['systemNameEn'] = 'NOT-DEFINED';
		oStatus.setValue('');
		oStatus.fireEvent('select', oStatus, oSel);
		
		store.getProxy().setExtraParam('status', '');
		store.getProxy().setExtraParam('rf_uid', '');
		store.load(function(){});
		
		quota_content.setValue('계약체결된 견적 요청서를 선택하세요.');
		quota_content.setHeight('100%');
	}
   	
}



var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {} );
function checkAction() {
	var supplier_information = Ext.getCmp('supplier_information').getValue();
	if( (selectionLength>0) && supplier_information !='' && supplier_information !=null) {
		addAction.enable();
	} else{
		addAction.disable();
	}	
}

function isInnerPo() {
	if(gSelectedTab=='contract-div') {
		return false;
	}
	return vCompanyReserved4==selectedSupast.get('supplier_code') ? true : false;
}
function deleteConfirm(btn){

	var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {
        	for(var i=0; i< selections.length; i++) {
        		var rec = selections[i];
        		var unique_id = rec.get('unique_id');
	           	var cartline = Ext.ModelManager.create({
	           		unique_id : unique_id
	        	 }, 'CartLine');
        		
	           	cartline.destroy( {
	           		 success: function() {
	           			Ext.MessageBox.alert('확인','선택한 항목을 삭제하였습니다.');
	           			store.load(function() {});
	           		 }
	           	});
        	}
        	grid.store.remove(selections);
        }
    } else {
    	Ext.MessageBox.alert('확인','선택한 항목이 없습니다.');
    }
};


function setDelConfirm(btn){

	var selections = grid.getSelectionModel().getSelection();
    if (selections) {
        var result = MessageBox.msg('{0}', btn);
        if(result=='yes') {

        	var req_date = Ext.getCmp('setDeliveryDate').getValue();

        	var unique_uids = [];
        	for(var i=0; i< selections.length; i++) {
        		var record = grid.getSelectionModel().getSelection()[i];
        		//console_log(record);
        		var unique_uid = record.get('unique_uid');
        		unique_uids.push(unique_uid);
        	}
        		
    		Ext.Ajax.request({
				url: CONTEXT_PATH + '/purchase/request.do?method=updateReqsate',				
				params:{
					req_date : req_date,
					unique_uids : unique_uids
				},
				
				success : function(result, request) {
					var result = result.responseText;
					//console_log('result:' + result);
					store.load(function() {});
				},
				failure: extjsUtil.failureMessage
			});

        }
    } else {
    	Ext.MessageBox.alert('확인','선택한 항목이 없습니다.');
    }
};



var prWin = null;


var addAction = Ext.create('Ext.Action', {
	itemId: 'createButton',	
	iconCls:'add',
    text: addBtnText,
    disabled: true,
    handler: function(widget, event) {
    	
    	var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
    	var sales_amount = 0;
    	//unique_uid = [];
    	catmapUids = [];
    	catmapObj = [];
    	reservedDouble4s = [];
    	
    	var item_name = '';
    	var item_code = '';
    	var pj_code = '';
    	var pj_name = '';
    	
    	
    	var selections = grid.getSelectionModel().getSelection();
		if(selections.length==0) {
			Ext.MessageBox.alert('입력 확인', '선택한 항목이 없습니다.');
			return;
		}
    	
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		
    		var static_sales_price = rec.get('static_sales_price');
    		var po_qty = rec.get('quan');
    		var reserved_double4 = rec.get('reserved_double4');
    		var sales_prices = static_sales_price * po_qty;
    		if(reserved_double4<0.00000001 && po_qty<0.00000001) {
    			Ext.MessageBox.alert('입력 확인', '재고 소진 과 부문수량 모두  0인 항목이 있습니다.');
    			return;
    		}else if(po_qty>0.0 && static_sales_price<0.00000001) {//주문수량이 있으면 sales price 가 0이 될 수 없다.
    			Ext.MessageBox.alert('입력 확인', '주문가가 0인 항목이 있습니다.');
    			return;
    		}else {
            	//사내발주이면
            	if(isInnerPo()) {
            		if(po_qty>0.0) {
            			Ext.MessageBox.alert('입력 확인', '사내발주(재고사용)는 주문수량이 0이 아닌 경우만 가능합니다. 공급사를 지정하세요.');
            			return;
            		}
            	} else { //외부 발주
            		
            	}
    		}
    		catmapUids[i] = rec.get('unique_uid');
    		reservedDouble4s[i] = rec.get('reserved_double4');
    		catmapObj[i] = rec;
    		sales_amount += sales_prices;
    	}
    	
    	var rec0 = selections[0];
    	item_name = rec0.get('item_name');
    	item_code = rec0.get('item_code');
    	pj_code = rec0.get('pj_code');
    	pj_name = rec0.get('pj_name');
    	
    	var pj_uid = rec0.get('ac_uid')
    	Ext.Ajax.request({
    		url: CONTEXT_PATH + '/purchase/rfq.do?method=getRequestInfo',
    		params:{
    			pj_uid: pj_uid
    		},
    		success : function(result, request) {
    			var o = Ext.JSON.decode(result.responseText);
    			
    			var requestInfo = o['purchaser'] + ", " + o['email'] + ", " + o['tel_no'] ;
    			var buyerInfo = '사업자번호:' + o['biz_no'] + ", 발주사: " + o['wa_name'] + ", 대표: " + o['president_name'] ;
    			delivertAddress = o['address_1'];
    	
		var rtgapp_store = new Ext.data.Store({  
			pageSize: getPageSize(),
			model: 'RtgApp'	});
		
		function deleteRtgappConfirm(btn){

    	    var selections = agrid.getSelectionModel().getSelection();
    	    if (selections) {
    	        var result = MessageBox.msg('{0}', btn);
    	        if(result=='yes') {
    	        	for(var i=0; i< selections.length; i++) {
    	        		var rec = agrid.getSelectionModel().getSelection()[i];
    	        		var unique_id = rec.get('unique_id');
    		           	 var rtgapp = Ext.ModelManager.create({
    		           		unique_id : unique_id
    		        	 }, 'RtgApp');
    	        		
    		           	rtgapp.destroy( {
    		           		 success: function() {}
    		           	});  	
    	        	}
    	        	agrid.store.remove(selections);
    	        }
    	    }
    	};
    	
    	var removeRtgapp = Ext.create('Ext.Action', {
    		itemId: 'removeButton',
    	    iconCls: 'remove',
    	    text: CMD_DELETE,
    	    disabled: true,
    	    handler: function(widget, event) {
    	    	Ext.MessageBox.show({
    	            title:delete_msg_title,
    	            msg: delete_msg_content,
    	            buttons: Ext.MessageBox.YESNO,
    	            fn: deleteRtgappConfirm,
    	            icon: Ext.MessageBox.QUESTION
    	        });
    	    }
    	});
    	
    	var updown =
    	{
    		text: Position,
    	    menuDisabled: true,
    	    sortable: false,
    	    xtype: 'actioncolumn',
    	    width: 60,
    	    items: [{
    	        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_up.png',  // Use a URL in the icon config
    	        tooltip: 'Up',
    	        handler: function(agridV, rowIndex, colIndex) {


    	        	var record = agrid.getStore().getAt(rowIndex);
    	        	//console_log(record);
    	        	var unique_id = record.get('unique_id');
    	        	//console_log(unique_id);
    	        	var direcition = -15;
    	        	Ext.Ajax.request({
	         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
	         			params:{
	         				direcition:direcition,
//	         				modifyIno: str,
	         				unique_id:unique_id
	         			},
	         			success : function(result, request) {   
	         				rtgapp_store.load(function() {});
	         			}
	           	    });
    				}
    	    },{
    	        icon   : CONTEXT_PATH +  '/extjs/shared/icons/fam/grid_down.png',   // Use a URL in the icon config
    	        tooltip: 'Down',
    	        handler: function(agridV, rowIndex, colIndex) {

    	        	var record = agrid.getStore().getAt(rowIndex);
    	        	//console_log(record);
    	        	var unique_id = record.get('unique_id');
    	        	//console_log(unique_id);
    	        	var direcition = 15;
    	        	Ext.Ajax.request({
	         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
	         			params:{
	         				direcition:direcition,
	         				unique_id:unique_id
	         			},
	         			success : function(result, request) {   
	         				rtgapp_store.load(function() {});
	         			}
	           	    });
    	        }
    	    }]
    	};
    	var tempColumn = [];
    	
    	tempColumn.push(updown);
    	
    	for(var i=0; i<vCENTER_COLUMN_SUB.length; i++) {
    		tempColumn.push(vCENTER_COLUMN_SUB[i]);
    	}
    	rtgapp_store.load(function() {
    		Ext.each( /*(G)*/tempColumn, function (columnObj, index,value) {
                
                var dataIndex = columnObj["dataIndex" ];
               columnObj[ "flex" ] =1;
               
                if (value!="W" && value!='기안') {
                      
                       if ('gubun' == dataIndex) {
                             
                              var combo = null ;
                              // the renderer. You should define it  within a namespace
                              var comboBoxRenderer = function (value, p, record) {
                                     if (value=='W' || value=='기안') {

                                    } else {
                                       //console_log('combo.valueField = ' + combo.valueField + ', value=' + value);
                                       //console_log(combo.store);
                                       var idx = combo.store.find(combo.valueField, value);
                                       //console_log(idx);
                                       var rec = combo.store.getAt(idx);
                                       //console_log(rec);
                                       return (rec === null ? '' :  rec.get(combo.displayField) );
                                    }

                             };
                             
                             combo = new Ext.form.field.ComboBox({
	                             typeAhead: true ,
	                             triggerAction: 'all',
	                             selectOnTab: true ,
	                             mode: 'local',
	                             queryMode: 'remote',
				                 editable: false ,
				                 allowBlank: false ,
		                         displayField:   'codeName' ,
		                         valueField:     'codeName' ,
		                         store: routeGubunTypeStore,
	                             listClass: 'x-combo-list-small' ,
	                             listeners: {  }
                             });
	                       columnObj[ "editor" ] = combo;
	                       columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
	                    	   //console.log('renderer.value', value);
	                    	   ////console.log('renderer.record', record);
	                    	   //console.log('renderer.p', p);
	                    	   p.tdAttr = 'style="background-color: #FFE4E4;"';
	                    	   return value;
	                       };
                      }
                      
               }

         });
			agrid = Ext.create('Ext.grid.Panel', {
				id: 'myAgrid',
				title: routing_path,
			    store: rtgapp_store,
			    layout: 'fit',
			    columns : tempColumn,
			    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
    		    	clicksToEdit: 1
    		    })],
    		    border: false,
			    multiSelect: true,
			    frame: false,
    		    dockedItems: [{
    				xtype: 'toolbar',
    				items: [{
    					fieldLabel: dbm1_array_add,
    					labelWidth: 42,
    					id :'user_name',
    			        name : 'user_name',
    			        xtype: 'combo',
    			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
    			        store: userStore,
    			        labelSeparator: ':',
    			        emptyText:   dbm1_name_input,
    			        displayField:   'user_name',
    			        valueField:   'unique_id',
    			        sortInfo: { field: 'user_name', direction: 'ASC' },
    			        typeAhead: false,
    		            hideLabel: true,
    			        minChars: 2,
    			        width: 230,
    			        listConfig:{
    			            loadingText: 'Searching...',
    			            emptyText: 'No matching posts found.',
    			            getInnerTpl: function() {
    			                return '<div data-qtip="{unique_id}">{user_name}|{dept_name}</div>';
    			            }			                	
    			        },
    			        listeners: {
    			        	select: function (combo, record) {
    			        		//console_log('Selected Value : ' + record[0].get('unique_id'));
    			        		var unique_id = record[0].get('unique_id');
    			        		var user_id = record[0].get('user_id');
    			        		Ext.Ajax.request({
                         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
                         			params:{
                         				useruid : unique_id
                         				,userid : user_id
                         				,gubun    : 'D'
                         			},
                         			success : function(result, request) {   
                         				var result = result.responseText;
                						//console_log('result:' + result);
                						if(result == 'false'){
                							Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                						}else{
                							rtgapp_store.load(function() {});
                						}
                         			},
                         			failure: extjsUtil.failureMessage
                         		});
    			        	}//endofselect
    			        }
    				},
			        '->',removeRtgapp,
			        
			        {
                        text: panelSRO1133,
                        iconCls: 'save',
                        disabled: false,
                        handler: function ()
                        {
                        	var modifiend =[];
                        	var rec = grid.getSelectionModel().getSelection()[0];
                        	var unique_id = rec.get('unique_id');


                              for (var i = 0; i <agrid.store.data.items.length; i++)
                              {
	                                var record = agrid.store.data.items [i];
	                                
	                                if (record.dirty) {
	                                	rtgapp_store.getProxy().setExtraParam('unique_id', vSELECTED_UNIQUE_ID);
	                                   	//console_log(record);
	                                   	var obj = {};
	                                   	
	                                   	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
	                                   	obj['gubun'] = record.get('gubun');
	                                   	obj['owner'] = record.get('owner');
	                                   	obj['change_type'] = record.get('change_type');
	                                   	obj['app_type'] = record.get('app_type');
	                                   	obj['usrast_unique_id'] = record.get('usrast_unique_id');
	                                   	obj['seq'] = record.get('seq');
	                                   	obj['updown'] = 0;
	                                   	modifiend.push(obj);
	                                }
	                          }
                              
                              if(modifiend.length>0) {
                            	
                            	  //console_log(modifiend);
                            	  var str =  Ext.encode(modifiend);
                            	  //console_log(str);
                            	  
                           	    Ext.Ajax.request({
                         			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=modifyRtgapp',
                         			params:{
                         				modifyIno: str,
                         				srcahd_uid:unique_id
                         			},
                         			success : function(result, request) {   
                         				rtgapp_store.load(function() {});
                         			}
                           	    });
                              }
                        }
                    }
			        ]//endofitems
    			}] //endofdockeditems
    		}); //endof Ext.create('Ext.grid.Panel', 
    		
    		agrid.getSelectionModel().on({
    			selectionchange: function(sm, selections) {
		            if (selections.length) {
						if(fPERM_DISABLING()==true) {
							removeRtgapp.disable();
						}else{
							removeRtgapp.enable();
						}
		            } else {
		            	if(fPERM_DISABLING()==true) {
		            		//collapseProperty();//uncheck no displayProperty
		            		removeRtgapp.disable();
		            	}else{
		            		//collapseProperty();//uncheck no displayProperty
		            		removeRtgapp.disable();
		            	}
		            }
		        }
    		}); //endof Ext.create('Ext.grid.Panel', 
    		
    		var htmlItems = '<hr /><div class="x-grid-view " style="border-width: 0px; overflow: auto; margin: 0px;  tabindex="-1">';
    		htmlItems = htmlItems +	'<table class="x-grid-table " border="0" cellspacing="0" cellpadding="0" style="width:812px;"><tbody>';
    		

        	var form = null;
        	
        	//사내발주이면
        	if(isInnerPo()) {
        		
        		htmlItems = htmlItems + '<tr><th style="font-size:12;border-bottom: #999999 1px dashed;">품목코드</th><th style="font-size:12;border-bottom: #999999 1px dashed;">재고</th><th style="font-size:12;border-bottom: #999999 1px dashed;">재고사용</th><th style="font-size:12;border-bottom: #999999 1px dashed;">품명</th><th style="font-size:12;border-bottom: #999999 1px dashed;">규격</th></tr>';
            	for(var i=0; i< catmapObj.length; i++) {
            		var rec = catmapObj[i];//grid.getSelectionModel().getSelection()[i];
            		var item_code = rec.get('item_code');
            		var stock_qty_useful = rec.get('stock_qty_useful');
            		var item_name = rec.get('item_name');
            		var specification = rec.get('specification');
            		var reserved_double4 = rec.get('reserved_double4');
            		htmlItems = htmlItems + '<tr><td style="font-size:12;">'+item_code+'</td><td style="font-size:12;">'+ stock_qty_useful + '</td><td style="font-size:12;">'+ reserved_double4 + '</td><td style="font-size:12;">'+ item_name + '</td><td style="font-size:12;">'+ specification + '</td></tr>';
            	}
            	htmlItems = htmlItems + '</tbody></table><div>';
            	
        		form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		    		xtype: 'form',
		    		frame: false ,
		    		border: false,
		    		bodyPadding: '3 3 0',
		    		region: 'center',
		            fieldDefaults: {
		                labelAlign: 'middle',
		                msgTarget: 'side'
		            },
		            defaults: {
		                anchor: '100%',
		                labelWidth: 100
		            },
		            items: [{
		                	xtype: 'component',
		                	html: htmlItems,
		                	anchor: '100%'
		            	}]
        		});
        		myHeight = 300;
        	} else {
        		
        		htmlItems = htmlItems + '<tr><th style="font-size:12;border-bottom: #999999 1px dashed;">품목코드</th><th style="font-size:12;border-bottom: #999999 1px dashed;">재고사용</th><th style="font-size:12;border-bottom: #999999 1px dashed;">주문수량</th><th style="font-size:12;border-bottom: #999999 1px dashed;">품명</th><th style="font-size:12;border-bottom: #999999 1px dashed;">규격</th></tr>';
            	for(var i=0; i< catmapObj.length; i++) {
            		var rec = catmapObj[i];//grid.getSelectionModel().getSelection()[i];
            		var item_code = rec.get('item_code');
            		var quan = rec.get('quan');
            		var item_name = rec.get('item_name');
            		var specification = rec.get('specification');
            		var reserved_double4 = rec.get('reserved_double4');	
            		htmlItems = htmlItems + '<tr><td style="font-size:12;">'+item_code+'</td><td style="font-size:12;">'+ reserved_double4 + '</td><td style="font-size:12;">'+ quan + '</td><td style="font-size:12;">'+ item_name + '</td><td style="font-size:12;">'+ specification + '</td></tr>';
            	}
            	htmlItems = htmlItems + '</tbody></table><div>';
            	
				form = Ext.create('Ext.form.Panel', {
		    		id: 'formPanel',
		    		xtype: 'form',
		    		frame: false ,
		    		border: false,
		    		bodyPadding: '3 3 0',
		    		region: 'center',
		            fieldDefaults: {
		                labelAlign: 'middle',
		                msgTarget: 'side'
		            },
		            defaults: {
		                anchor: '100%',
		                labelWidth: 100
		            },
		            items: [
		                new Ext.form.Hidden({
			            id: 'hid_userlist_role',
			            name: 'hid_userlist_role'
				        }),
				        new Ext.form.Hidden({
				        	id: 'hid_userlist',
				        	name: 'hid_userlist'
				        }),
				        new Ext.form.Hidden({
				        	id: 'unique_uid',
				        	name: 'unique_uid',
				        	value: catmapUids
				        }),
				        new Ext.form.Hidden({
				        	id: 'supplier_uid',
				        	name: 'supplier_uid'
				        }),
		            	new Ext.form.Hidden({
		            		id: 'supplier_name',
		            		name: 'supplier_name'
		            	}),
		            	agrid,
		            	{
		                	xtype: 'component',
		                	html: '<hr/>',
		                	anchor: '100%'
		            	},{
		            		fieldLabel: ppo1_request_date,
		            		value : netDay15,
	                        endDateField: 'todate',
	                    	xtype: 'datefield',    
		            		anchor: '100%',
		                    format: 'Y-m-d',
		    		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
		    		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
		            		id: 'request_date',
		            		name: 'request_date'
		                },{
		                	fieldLabel: '납품장소', //ppo1_address,
			            	xtype: 'textfield',
			            	anchor: '100%',
			            	value:delivertAddress ,
			            	id: 'delivery_address_1',
			            	name: 'delivery_address_1'
		                },{
				            	fieldLabel: '공급사에 전하는 특기사항',//ppo1_request,
				             	xtype: 'textarea',
				            	rows: 4,
				            	anchor: '100%',
				            	id:   'item_abst',
				            	name: 'item_abst',
				            	value: '수신: ' + selectedSupast.get('sales_person1_name') + ' 님, ' 
					            	+ selectedSupast.get('supplier_name')+ '[' 
					            	+ selectedSupast.get('supplier_code')
					            	+']\r\n특기사항:\r\n\r\n(발주정보)'
					            	+ buyerInfo,
			            },{
		            		fieldLabel: '결제 조건',
			            	xtype: 'textfield',
			            	anchor: '100%',
			            	value: payCondition,
			            	id: 'pay_condition',
			            	name: 'pay_condition'
			            },{
		            		fieldLabel: '법적 고지사항',
			            	xtype: 'textarea',
			            	rows: 2,
			            	anchor: '100%',
			            	value: regalConditionPo,
			            	id: 'request_info',
			            	name: 'request_info'
			            },{
			            		fieldLabel: dbm1_txt_name,
				            	xtype: 'textfield',
				            	anchor: '100%',
				            	value: '[' + pj_code + ']'+ pj_name,
				            	id: 'txt_name',
				            	name: 'txt_name'
			            },{
			            		fieldLabel: dbm1_txt_content,
			            		xtype: 'textarea',
			            		hideLabel: false,
			            		value: item_name+' 外 ' + (selections.length -1) + '건',
			            		anchor: '100%',
			            		id: 'txt_content',
			            		rows: 2,
			            		name: 'txt_content'
			            }, {
			            	fieldLabel: '주문 합계금액',
			            	xtype: 'textfield',
			            	anchor: '100%',
		            		id: 'sales_amount',
		            		name: 'sales_amount',
		    	        	readOnly: true,
		    	        	value : Ext.util.Format.number(sales_amount, '0,00/i'),
		    	        	fieldStyle: 'background-color: #E7EEF6; background-image: none;',
		            	},{
		                	xtype: 'component',
		                	html: htmlItems,
		                	anchor: '100%'
		            	}]//item end..
				});//Panel end...
				myHeight = 650;
        	}//endofalse

			prWin = Ext.create('ModalWindow', {
            title: addBtnText,
            width: 830,
            height: myHeight,	
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(btn){
            		var msg = selectedSupast.get('supplier_name') + ' 로  발주하시겠습니까?'
            		var myTitle = '주문 작성 확인';
            		Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function(btn) {
                            var result = MessageBox.msg('{0}', btn);
                            if(result=='yes') {
                            	
                            	var form = Ext.getCmp('formPanel').getForm();
	                            
                            	//사내발주이면
                            	if(isInnerPo() == false) {//사내발주가 아니면                     		
    	                            var supplier_uid = Ext.getCmp('sp_srchSupplier_uid').getValue();
    	                            Ext.getCmp('supplier_uid').setValue(supplier_uid);
    	                            
                            		agrid.getSelectionModel().selectAll();
		                            var aselections = agrid.getSelectionModel().getSelection();
		                            
		                            //Ext.getCmp('sales_amount').setValue(sales_amount);
		                            if (aselections) {
		                            	for(var i=0; i< aselections.length; i++) {
		                            		var rec = agrid.getSelectionModel().getSelection()[i];
		                            		ahid_userlist[i] = rec.get('usrast_unique_id');
		                            		ahid_userlist_role[i] = rec.get('gubun');
		                            	}
		                            	Ext.getCmp('hid_userlist').setValue(ahid_userlist);                    	
		                            	Ext.getCmp('hid_userlist_role').setValue(ahid_userlist_role);
		                            }//end if
                            	}
	                            if(form.isValid())
	                            {
	        	                
	                            	var val = form.getValues(false);
	        	                	
	                            	if(isInnerPo()) {
	                            		console_logs('val', val);
	                            		//회사정보 일기
	                            		Ext.Ajax.request({
	                            			url: CONTEXT_PATH + '/purchase/request.do?method=innerPo',
	                        				params:{
	                        					catmapUids : catmapUids,
	                        					reservedDouble4s: reservedDouble4s
	                        				},
	                            			success : function(result) {
	                            				//var text = result.responseText;
	        		                			//console_log('updated');
	        		                           	if(prWin) 
	        		                           	{
	        		                           		prWin.close();
	        		                           		store.load(function() {});
	        		                           	}
	                            			},
	                            			failure: extjsUtil.failureMessage
	                            		});
	                            	} else {
		                            	var cartLine = Ext.ModelManager.create(val, 'CartLine');
	        							cartLine.save({
	        		                		success : function() {
	        		                			//console_log('updated');
	        		                           	if(prWin) 
	        		                           	{
	        		                           		prWin.close();
	        		                           		store.load(function() {});
	        		                           	} 
	        		                		} 
	        		                	 });	
	                            	}

	                            }
	                            else {
	                            	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
	                            }
                            }//endof yes
                        }//fn function(btn)
                    });//show
            	}//btn handler
			},{
                text: CMD_CANCEL,
            	handler: function(){
            		if(prWin) {
            			prWin.close();
            		}
            	}
			}]
        });
    	  prWin.show();
		});
    		} //endof success
        }); //endof getRequestInfo ajax
    }//handler end...
});

var removeAction = Ext.create('Ext.Action', {
	itemId: 'removeButton',
    iconCls: 'remove',
    text: panelSRO1143,
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

var setDelAction = Ext.create('Ext.Action', {
	itemId: 'setDelButton',
    text: '납품기한 변경',
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:'확인',
            msg: '납품기한을 변경하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: setDelConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});

//supplier가 선택됐을때 Handling
function selectedSupplierHandler(selectedSupast) {
	if(isInnerPo()) {//사내발주이면
		addBtnText = '재고사용'
		
	} else {
		addBtnText = ppo1_order_create;
	}
	addAction.setText(addBtnText);
}


var contextMenu = Ext.create('Ext.menu.Menu', {
    items: removeAction
});

var netDay15;
var searchField = [];
Ext.onReady(function() { 
	
	
	//회사정보 일기
	Ext.Ajax.request({
		url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',				
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
			
			//console.log('o', o);
			payCondition = o['payCondition']; //결재조건
			regalConditionPo = o['regalConditionPo']; //주문조건
			//delivertAddress = o['delivertAddress']; //견적조건
		},
		failure: extjsUtil.failureMessage
	});
	
	
	netDay15 = new Date();
	//console.log(netDay15);
	netDay15.setDate(netDay15.getDate() + 15); 
	
	console_log('now starting...');
	LoadJs('/js/util/comboboxtree_cloud.js');
	LoadJs('/js/util/getSupplierToolbar.js');
	LoadJs('/js/util/PartHistory.js');
	Ext.define('CartLine', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/purchase/request.do?method=read&route_type=P',
		            create: CONTEXT_PATH + '/purchase/request.do?method=create',
		            update: CONTEXT_PATH + '/purchase/request.do?method=update',
		            destroy: CONTEXT_PATH + '/purchase/request.do?method=destroy'
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
		model: 'CartLine',
		groupField :'pr_no',
		sorters: [{
            property: 'item_code',
            direction: 'ASC'
        }]
	});
	
	Ext.define('RtgApp', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS_SUB,
	   	    proxy: {
					type: 'ajax',
			        api: {
			        	read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=readRtgappDyna&change_type=D',
			            create: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
			            destroy: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp'
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
	store.getProxy().setExtraParam('reserved_varchar2', 'N');
 	store.load(function() {

 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
 		
 		
 		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			switch(dataIndex) {
			case 'static_sales_price':
				columnObj["editor"] = {xtype:  'numberfield', minValue: 1, allowBlank : false}; columnObj["css"] = 'edit-cell';
				columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
		        	return Ext.util.Format.number(value, '0,00/i');
	        	};
				break;
			case 'quan':
				columnObj["editor"] = {xtype:  'numberfield', minValue: 0, allowBlank : false}; columnObj["css"] = 'edit-cell';
				columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
		        	return Ext.util.Format.number(value, '0,00/i');
	        	};
				break;
//			case 'reserved_double4':
//				columnObj["editor"] = {xtype:  'numberfield', minValue: 0, allowBlank : false}; columnObj["css"] = 'edit-cell';
//				columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
//		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
//		        	return Ext.util.Format.number(value, '0,00/i');
//	        	};
//				break;
			case 'req_date':
				columnObj["editor"] = {xtype:  'datefield', dateFormat: 'Y-m-d', format: 'Y-m-d', allowBlank : false}; columnObj["css"] = 'edit-cell';
				columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
		        	p.tdAttr = 'style="background-color: #FFE4E4;"';
		    		
		        	//console_logs('value', value);
		     		if(value==null) {
		     			return null;
		     		} else {
		     			
		     			if (value.getMonth) {

		     				value = yyyymmdd(value, '/');
		     			}
		     			
		     			var len = value.length;
		     			if(len<11) {
		     				return value;
		     			}else {
		     				var v = value.substring(0,10);
		     				record.set(dataIndex, v);
		     				record.modified = {};
		     				return v;
		     			}
		     		}
		     		
	        	};
	        	break;
			case 'item_code_dash':
				columnObj["renderer"] = renderPohistoryItemCode;
				break;
			default:
			}
			
			

		});
 		
		grid = Ext.create('Ext.grid.Panel', {
				id: 'pr-div',
		        store: store,
		        //collapsible: true,
		        multiSelect: true,
		        stateId: 'stateGridmain',
		        selModel: selModel,
		        autoScroll : true,
		        autoHeight: true,
		        height: (getCenterPanelHeight()/5) * 4,
		        features: [{ ftype: 'grouping' }],
		        bbar: getPageToolbar(store),
		        region: 'center',
		        dockedItems: [{
		            xtype: 'toolbar',
		            items:[
		                   addAction, '-', removeAction, '-',
		                   { 
			                	fieldLabel: '',
			                    name: 'setDeliveryDate',
			                    id:'setDeliveryDate',
			                    format: 'Y-m-d',
			    		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
			    		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
			 			    	allowBlank: true,
			 			    	xtype: 'datefield',
			 			    	value: netDay15,
			 			    	//width: 100,
								handler: function(){}
							}, setDelAction,
		                   '->',
		                    {
		                        text: panelSRO1133,
		                        iconCls: 'save',
		                        disabled: false,
		                        handler: function ()
		                        {
		                              for (var i = 0; i <grid.store.data.items.length; i++)
		                              {
			                                var record = grid.store.data.items [i];
			                                var unique_uid = record.get('unique_uid');
			                                if (record.dirty) {
			                                	record.set('id',unique_uid);
			                                	//console_log(record);
			        		            		//저장 수정
			                                	record.save({
			        		                		success : function() {
			        		                			 store.load(function() {});
			        		                		}
			        		                	 });
			                                }
			                               
			                          }
		                        }
		                    }
		            ]
		        }
		        ,{
		        	xtype: 'toolbar',
		        	items: getSupplierToolbar()
		        }
		        ],
		        columns: /*(G)*/vCENTER_COLUMNS,
		        plugins: [cellEditing],//필드 에디트
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
		            }
		        },
		        title: '주문 대기'
		    });
		
	    grid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	    		selectionLength = selections.length;
	    		checkAction();
	    		console_logs('1111', selections.length);
	    		if(selections.length==1) {
	            	//callPoHistory(selections[0]);
	    		}
	            if (selections.length) {
					firstCartline = selections[0];
	            	//collapsePoHistory(true);
	            	displayPropertySpec(selections[0], null, false);
					
					if(fPERM_DISABLING()==true) {
						addAction.disable();
		            	removeAction.disable();
		            	setDelAction.disable();
		            	
					}else{
		            	removeAction.enable();
		            	setDelAction.enable();
		            	checkAction(true);
					}
	            } else {
	            	//collapsePoHistory(false);
	            	if(fPERM_DISABLING()==true) {
		            	//collapseProperty();//uncheck no displayProperty
		            	removeAction.disable(); 
		            	setDelAction.disable();
		            	checkAction(false);
	            	}else{
	            		if(gGridSelects.length>1) {
		            		grid.getView().select(gGridSelects);
		            	}
	            		//collapseProperty();//uncheck no displayProperty
	            		addAction.disable();
		            	removeAction.disable();
		            	setDelAction.disable();
		            	checkAction(false);
	            	}
	            }
	            copyArrayGrid(selections);	
	        }
	    });

	    grid.on('edit', function(editor, e) {     
		  // commit the changes right after editing finished
	    	
          var rec = e.record;
          //console_logs(rec);
          var unique_uid = rec.get('unique_uid');
          rec.set('id' ,unique_uid);
          
          var req_date = rec.get('req_date');
          if (req_date.getMonth) {
        	  var s = yyyymmdd(req_date, '/');
        	  //console_logs('s', s);
        	  rec.set('req_date', s);
          }
          //console_logs(rec);
      	  //저장 수정
          var quan = rec.get('quan');
          var static_sales_price = rec.get('static_sales_price');
          //console_logs('quan', quan);
          //console_logs('static_sales_price', static_sales_price);
          rec.set('static_sales_amount_str', quan*static_sales_price);
          rec.save({
          		success : function() {
          			console_log('modified....' + unique_uid);
          			 //////store.load(function() {});
          		}
          });
		  rec.commit();
		});
	    
	    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
	        Ext.create('Ext.tip.ToolTip', config);
	    });

	   
	    
//	    fLAYOUT_CONTENT(grid);
//	    cenerFinishCallback();//Load Ok Finish Callback

	    //===========================
		//견적요청 후 계약 체결 모곡
		var fieldItem = [], columnItem = [], tooltipItem = [];
		//아이템 필드 로드
	   (new Ext.data.Store({ model: 'ExtFieldColumn'})).load({
		    params: {
		    	menuCode: 'PPO1_CONTRACT'
		    },
		    callback: function(records, operation, success) {
		    	console_log('come IN PPO1_CONTRACT');
		    	if(success ==true) {
		    		for (var i=0; i<records.length; i++){
		    			inRec2Col(records[i], fieldItem, columnItem, tooltipItem);
			        }//endoffor
	    		 	
		    		//var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		    		Ext.each(/*(G)*/columnItem, function(columnObj, index) {
		    			var dataIndex = columnObj["dataIndex"];
		    		});//endifeach
		    		   
		    		
		    		//견적요청
		    		Ext.define('RtgAstRfq', {
		    			extend: 'Ext.data.Model',
		    			fields: /*(G)*/fieldItem,
		    		    proxy: {
		    				type: 'ajax',
		    		        api: {
		    		            read: CONTEXT_PATH + '/purchase/rfq.do?method=read&contracted=true',
		    		            create: CONTEXT_PATH + '/purchase/rfq.do?method=create',
		    		            update: CONTEXT_PATH + '/purchase/rfq.do?method=create',
		    		            destroy: CONTEXT_PATH + '/purchase/rfq.do?method=destroy'
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
		    	
		    		//견적서
		    		Ext.define('RtgAstQuota', {
		    			extend: 'Ext.data.Model',
		    			fields: /*(G)*/vCENTER_FIELDS,
		    		    proxy: {
		    				type: 'ajax',
		    		        api: {
		    		            read: CONTEXT_PATH + '/sales/quota.do?method=read'
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
		    		
		    		storeQuota = new Ext.data.Store({  
		    			pageSize: getPageSize(),
		    			model: 'RtgAstQuota',
		    			//remoteSort: true,
		    			sorters: [{
		    	            property: 'unique_id',
		    	            direction: 'DESC'
		    	        }]
		    		});
		    		
		    		storeContract = new Ext.data.Store({  
		    			pageSize: getPageSize(),
		    			model: 'RtgAstRfq',
		    			//remoteSort: true,
		    			sorters: [{
		    	            property: 'unique_id',
		    	            direction: 'DESC'
		    	        }]
		    		});
		    		
		    		storeContract.load(function() {
		    			
		    			
		    			var searchAction = Ext.create('Ext.Action', {
		    				itemId: 'searchButton',
		    			    iconCls: 'search',
		    			    text: CMD_SEARCH,
		    			    disabled: false ,
		    			    handler: function(){}
		    			});

		    	 		var selModelContract = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
		    			gridContract = Ext.create('Ext.grid.Panel', {
		    			        store: storeContract,
		    			        height: getCenterPanelHeight(), 
		    			        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
		    			        selModel: selModelContract,
		    			        autoScroll : true,
		    			        autoScroll : true,
		    					autoHeight: true,
		    			        bbar: getPageToolbar(storeContract),
		    			        region: 'center',
		    			        width: '30%',
		    			        border: false,
//		    			        dockedItems: [{
//		    			            dock: 'top',
//		    			            xtype: 'toolbar',
//		    			            items: [addAction, '-'/*, sendMailAction*/]
//		    			        }
//		    			        ], //end ofdockedItems
		    			        columns: /*(G)*/columnItem,
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
		    			                }
		    			            	//,itemdblclick: viewHandler
		    			            }//endoflistener
		    			        }//endofviewconfig
		    			       

		    			    });//endof grid create
		    			gridContract.getSelectionModel().on({
		    		        selectionchange: function(sm, selections) {
		    		        	
		    		        	if (selections.length) {
		    		        		
		    		        		var rec = gridContract.getSelectionModel().getSelection()[0];
		    		        		console_logs('gridContract.getSelectionModel().on rec', rec);
		    		        		displayProperty(rec);
		    		        		displayQuota(rec);
		    		        		
		    		        		addAction.enable();
		    		        		
		    		        	
		    		        	} else {//endofelection
		    		        		displayQuota(null);
		    		        		addAction.disable();

		    		        		
		    		        	}
		    		        	
		    		        }//endofselectionchange
		    		    });//endofgridon
		    			
		    			var myFormPanel =  Ext.widget({
		    				id: 'myFormPanel',

		    				xtype: 'form',
		        			frame: false,
		      	 	      collapsible: false,
		    	 	      border: false,
		    	 	      layout: 'fit',
		                    region: 'center',
		                    height: '100%',
		                    autoScroll: true,
		        	        defaults: {
		        	            anchor: '100%',
		        	            allowBlank: false,
		        	            msgTarget: 'side',
		        	            labelWidth: 60
		        	        },
		        	        items: [
		        	                { 
		        	                	id: 'quota_content',
		        	                	xtype: 'htmleditor',
		        			             width: '100%',
		        			             height: '100%'
		        	                	
		        	        }]
		    			});
		    			
		    			var main2 =  Ext.create('Ext.panel.Panel', {
		    				//height: getCenterPanelHeight(),
		    			    layout:'border',
		    			    border: false,
		    			    region: 'east',
		    	            width: '70%',
		    			    layoutConfig: {columns: 2, rows:1},
		    			    defaults: {
		    			        collapsible: true,
		    			        split: true,
		    			        cmargins: '5 0 0 0',
		    			        margins: '0 0 0 0'
		    			    },
		    			    items: [myFormPanel/*,myGrid*/]
		    			});
		    			
		    			var main =  Ext.create('Ext.panel.Panel', {
		    				id: 'contract-div',
		    			    layout:'border',
		    			    title: '견적완료',
		    			    border: false,
		    			    layoutConfig: {columns: 2, rows:1},
		    			    defaults: {
		    			        collapsible: true,
		    			        split: true,
		    			        cmargins: '5 0 0 0',
		    			        margins: '0 0 0 0'
		    			    },
		    			    items: [gridContract,main2]
		    			});
		    			
		    		
		    			var tabPanelListAdd = new Ext.TabPanel({
		    	    		id:'po-tab-panel',
		    	    	    collapsible: true,
		    				xtype: 'tabpanel',
		    				title:getMenuTitle(),
		    		        activeTab: 0,
		    		        tabPosition: 'top',
		    		        items: [grid,
		    		                main
		    		        ],
		    		        activeTab: 0,
		    		        listeners: {
		    		            'tabchange': function(tabPanel, tab) {
		    		            	//console_logs('gSelectedTab', gSelectedTab);
		    		            	gSelectedTab = tab.id;
		    		            	//console_logs('gSelectedTab', gSelectedTab);
		    		            	refreshButton();
		    		            	if(gSelectedTab=='contract-div') {
			    		            	var quota_content = Ext.getCmp('quota_content');
			    		            	console_logs('quota_content', quota_content);
			    		    			quota_content.getToolbar().hide();
			    		    			console_logs('hide', 'OK');		    		            		
		    		            	}


		    		            	
		    		            }
		    		        }
		    			});
		    			
//						var ptargetgridContract = Ext.getCmp('rfq-contract-panel-div');
//						ptargetgridContract.removeAll();
//						ptargetgridContract.add(main);
//						ptargetgridContract.doLayout();	

			    		fLAYOUT_CONTENT(tabPanelListAdd);
			    		cenerFinishCallback();//Load Ok Finish Callback
		    		}); //storeContract load
		    	}//endof success
		    }//endof callback
	   });//endofload
		
		//=================
	    

	    
	    
	}); //store load
 	console_log('End...');

});	//OnReady
