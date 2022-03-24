/*
 * CRT4 기결함
 */

searchField = 
	[
	'unique_id',
	'name',
	'content',
	'state'
	];

//global var.
var main2 = null;
var grid = null;
var myGrid = null;
var store = null;
var gPr_uid = '';
var gRtgType = '';
var routingStore = null;
var cartstore = null;

var trayType = "DECIDED";
var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});

function INIT_TABLE_HEAD(rec){

	var unique_id = rec.get('unique_id');
	var rtg_type = rec.get('rtg_type');
	
	var po_no = rec.get('po_no');
	var name = rec.get('name');
	var content = rec.get('content');
	var requester = rec.get('requester');
	var rtg_type = rec.get('rtg_type');
	var submit_date = rec.get('create_date');
	var req_date = rec.get('req_date');

	
var a =
	'<style>'+
	' .xl65 {padding-left:2px;padding-right:2px; font-size:11px; }'+
	' .xl66 {padding-left:2px;padding-right:2px; background: blue;  font-size:11px; color:black;}' +
	' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
	' </style>' +
	'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;">' +
'<colgroup>'+
'<col width="70px">' +
'<col width="100px">' +
'<col width="70px">' +
'<col width="130px">' +
'<col width="70px">' +
'<col width="120px">' +
'<col width="60px">' +
'<col width="140px">' +
'<col width="60px">' +
'<col width="140px">' +

'</colgroup>' +
	'<tbody>' +
	'<tr  height="40" >' +
	'	  <td class="xl66" align=center>'+ getColName("unique_id") + '</td>' +
	'	  <td class="xl67" align=center>'+unique_id+'</td>' +
	'	  <td class="xl66" align=center>'+getColName("rtg_type")+'</td>' +
	'	  <td class="xl67" align=center>'+rtg_type+'</td>' +
	'	  <td class="xl66" align=center>'+getColName("name")+'</td>' +
	'	  <td class="xl67" align=center>'+name+'</td>' +
	'	  <td class="xl66" align=center>'+getColName("content")+'</td>' +
	'	  <td class="xl67" align=center>'+content+'</td>' +
	'	  <td class="xl66" align=center>'+getColName("requester")+'</td>' +
	'	  <td class="xl67" align=center>'+requester+'</td>' +
	'	 </tr>' +
	'<tr  height="40" >' +
	'	  <td class="xl66" align=center>'+ getColName("submit_date") + '</td>' +
	'	  <td class="xl67" align=center>'+submit_date+'</td>' +
	'	  <td class="xl66" align=center>'+getColName("req_date") + '</td>' +
	'	  <td class="xl67" align=center>'+req_date+'</td>' +
	'	  <td class="xl66" align=center>'+'</td>' +
	'	  <td class="xl67" align=center>'+'</td>' +
	'	  <td class="xl66" align=center>'+'</td>' +
	'	  <td class="xl67" align=center>'+'</td>' +
	'	  <td class="xl66" align=center>'+'</td>' +
	'	  <td class="xl67" align=center>'+'</td>' +
	'	 </tr>' +
'</tbody></table>' +
'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;">' +
'<colgroup>'+
	'<col width="70px">' +
	'<col width="100px">' +
	'<col width="200px">' +
	'<col width="50px">' +
	'<col width="100px">' +
	'<col width="100px">' +
	'<col width="50px">' +
	'<col width="90px">' +
	'<col width="100px">' +
	'<col width="100px">' +
'</colgroup>' +
	'<tbody>' +
	'<tr  height="25" >' +
	'	  <td class="xl66" align=center>구분</td>' +
	'	  <td class="xl66" align=center>품목코드</td>' +
	'	  <td class="xl66" align=center>규격</td>' +
	
	'	  <td class="xl66" align=center>수량</td>' +
	'	  <td class="xl66" align=center>단가</td>' +
	'	  <td class="xl66" align=center>공급가액</td>' +
	
	'	  <td class="xl66" align=center>세액</td>' +
	'	  <td class="xl66" align=center>납기</td>' +
	'	  <td class="xl66" align=center>비고</td>' +
	'	  <td class="xl66" align=center>시스템UID</td>' +
'	 </tr>'
	
	;
	
	return a;
}

function getName(value, code) {
	var lang = vLANG;
	switch(code) {
		case 'state':
		{
			switch(lang) {
			case 'ko':
//				return '한글';
				switch(value){
					case 'R':
						return '접수';  //Reception 前台
					break;
					case 'P':
						return '작성중'; //在写  In writing
					break;
					case 'I':
						return '결재중';  //批准
					break;
					case 'A':
						return '승인완료'; //Accepted 公认
					break;
					case 'D':
						return '반려';  //Companion 伙伴
					break;
					case 'C':
						return '복합';  //Complex 复杂
					break;
					case 'G':
						return '입고완료';   //Wearing complete
					break;
					case 'S':
						return '시스템삭제';  //Delete System
					break;
					case 'E':
						return '주문완료';   //Order
					break;
				}
				break;
			case 'zh':
//				return '중국어';
				switch(value){
				case 'R':
					return '挂号';
				break;
				case 'P':
					return '开具中';
				break;
				case 'I':
					return '批准';
				break;
				case 'A':
					return '承认完成';
				break;
				case 'D':
					return '返还';
				break;
				case 'C':
					return '复合';
				break;
				case 'G':
					return '入库完成';
				break;
				case 'S':
					return '系统删除';
				break;
				case 'E':
					return '订货完成';
				break;
			}
				break;
			case 'en':
//				return '영어';
				switch(value){
				case 'R':
					return 'Receipt';
				break;
				case 'P':
					return 'Drawing';
				break;
				case 'I':
					return 'Sanction';
				break;
				case 'A':
					return 'Recognition';
				break;
				case 'D':
					return 'Return';
				break;
				case 'C':
					return 'Compositeness';
				break;
				case 'G':
					return 'EnterFinish';
				break;
				case 'S':
					return 'System Delete';
				break;
				case 'E':
					return 'RequestFinish';
				break;
			}
				break;
			}
		}
		break;
		case 'result':
		{
			switch(lang) {
			case 'ko':
//				return '한글';
				switch(value){
					case 'Y':
						return '승인';
					break;
					case 'N':
						return '반려';
					break;
					case 'P':
						return '대기';
					break;
				}
			case 'zh':
				switch(value){
				case 'Y':
					return '承认';
				break;
				case 'N':
					return '返回';
				break;
				case 'P':
					return '等待';
				break;
			}
			case 'en':
				switch(value){
				case 'Y':
					return 'Acknowledgment';
				break;
				case 'N':
					return 'Return';
				break;
				case 'P':
					return 'Ready';
				break;
			}
			}
		}
		break;
		case 'role':
		{
			switch(lang) {
			case 'ko':
//				return '한글';
				switch(value){
					case 'D':
						return '결재';
					break;
					case 'I':
						return '통보';
					break;
					case 'W':
						return '상신';
					break;
				}
			case 'zh':
				switch(value){
				case 'D':
					return '批准';
				break;
				case 'I':
					return '通知';
				break;
				case 'W':
					return '提交';
				break;
			}
			case 'en':
				switch(value){
				case 'D':
					return 'Sanction';
				break;
				case 'I':
					return 'Notify';
				break;
				case 'W':
					return 'Submit';
				break;
			}
			}
		}
		break;
	}

	return '';
}

//writer define
Ext.define('Routing.writer.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	data[0].cmdType = 'update';
        request.params = data[0];
        return request;
    }
});

/**
 * 
 * @param {} sancType
 * @param {} uidRtgast
 * @param {} rtg_Type
 * @param {} comment
 * @param {} po_user_uid
 * @param {} coord_key3 - case FN: pj_uid
 */
function doSanction(sancType, uidRtgast, rtg_Type, comment, po_user_uid, coord_key3) {

    mask.show();
    
	console_log(comment);
    Ext.Ajax.request({
			url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=sanction',
			params:{
			   	sancType : sancType,
		    	comment : comment,
		    	uidRtgast : uidRtgast,
		    	rtg_Type : rtg_Type,
		    	po_user_uid : po_user_uid,
		    	coord_key3 : coord_key3
			},
			success : function(result, request) {
				Ext.getCmp('ok_btn_id').setDisabled(true);
				Ext.getCmp('deny_btn_id').setDisabled(true);
				Ext.getCmp('comment').setDisabled(true);
				
				Ext.getCmp('comment').setValue('');
				Ext.getCmp('disp_po_no').setValue('');
				Ext.getCmp('disp_name').setValue('');
				Ext.getCmp('disp_content').setValue('');
				Ext.getCmp('disp_req_date').setValue('');
				Ext.getCmp('disp_requester').setValue('');
				Ext.getCmp('disp_submit_date').setValue('');
				Ext.getCmp('disp_totalPrice').setValue('');
				if(rtg_Type=='O') {
					Ext.getCmp('po_detail').setValue('');	
				}
				
				if(routingStore!=null) {
					routingStore.removeAll();		
				}
				if(cartstore!=null) {
					cartstore.removeAll();					
				}
				store.load(function() {
					mask.hide();
				});
			},
			failure: extjsUtil.failureMessage
		});
}

var po_user_uid = -1;
var coord_key3 = -1;

//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ /*detailAction*/]
});

function setPoDetail(o) {
	
	//console.log('Podetail', o);
	var delivery_address_1 = o['delivery_address_1'];
	var item_abst = o['item_abst'];
	var item_quan = o['item_quan'];
	var pay_condition = o['pay_condition'];
	var request_info = o['request_info'];
	var	supplier_code = o['supplier_code'];
	var	supplier_name = o['supplier_name'];
	Ext.getCmp('po_detail').getEl().show();
	Ext.getCmp('po_detail').setValue(
			item_abst + "\r\n" + 
			"결제조건: " + pay_condition + "\r\n" + 
			"법적고지: " + request_info + "\r\n" + 
			"납품장소: " + delivery_address_1
	);
	Ext.getCmp('po_detail').getEl().show();
}

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchToolBarTap
});

Ext.onReady(function() {  

	 //Routing Store 정의
	Ext.define('Routing', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=read',
		            create: CONTEXT_PATH + '/rtgMgmt/routing.do?method=create',
		            update: CONTEXT_PATH + '/rtgMgmt/routing.do?method=update',
		            destroy: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroy'
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
		model: 'Routing',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
	store.getProxy().setExtraParam('trayType', trayType);
	
 	store.load(function() {
 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
			
		grid = Ext.create('Ext.grid.Panel', {
		        store: store,
		        collapsible: false,
		        multiSelect: false,
		        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
		        height: getCenterPanelHeight(),
		        
		        bbar: getPageToolbar(store),
		        region: 'center',
		        dockedItems: [{
		            dock: 'top',
		            xtype: 'toolbar',
		            items: [
		                    searchAction
		                    
      				    ]
		        },
		        {
		            xtype: 'toolbar',
		            items: [
										{
										    xtype:'label',
										    text: crt4_create_date,
										    name: 'label1'
										 },
										{ 
						                	fieldLabel: '',
						                    name: 'start_date',
						                    id:'start_date',
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
						                	fieldLabel: '',
						                    name: 'end_date',
						                    id:'end_date',
						                    format: 'Y-m-d',
						    		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
						    		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						 			    	allowBlank: true,
						 			    	xtype: 'datefield',
						 			    	value: new Date(),
						 			    	width: 100,
											handler: function(){
											}
										}
		                    ]
		        }
		        
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
		                    contextMenu.showAt(e.getXY());
		                    return false;
		                }
		            	//,itemdblclick: viewHandler
		            }
		        },
		        title: getMenuTitle()//,
		    });
		
			
		    grid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		            if (selections.length) {
						
		            	main2.setLoading(true);
		            	
						var rec = grid.getSelectionModel().getSelection()[0];
					
						console_log(rec);
		        		
						gPr_uid = rec.get('unique_id');
		        		gRtgType = rec.get('rtg_type');
		        		
		        		var po_no = rec.get('po_no');
		        		var name = rec.get('name');
		        		var content = rec.get('content');
		        		var requester = rec.get('requester');
		        		var rtg_type = rec.get('rtg_type');
		        		var submit_date = rec.get('create_date');
		        		var req_date = rec.get('req_date');
		        		coord_key3 = rec.get('coord_key3');
		        		console_logs('coord_key3', coord_key3);
		        		
		        		
		        		cartstore.getProxy().setExtraParam('unique_id', gPr_uid);
		        		cartstore.getProxy().setExtraParam('rtg_type', gRtgType);
						cartstore.load(function(records){
							
							var totalPrice = 0;
	     					console_log(records); 
	     					if(records != undefined ) {
	     						for (var i=0; i<records.length; i++){ 
	     							var o = records[i];
	     							//console.log('o', o);
	     							var sales_price = o.get('static_sales_price');
	     							var quan = o.get('quan');
	     							//coord_key3 = o.get('coord_key3');
	     							totalPrice = totalPrice + sales_price*quan;
	     						}
	     					}
	     			
							Ext.getCmp('disp_po_no').setValue(po_no);
							Ext.getCmp('disp_name').setValue(name);
							Ext.getCmp('disp_content').setValue(content);
							Ext.getCmp('disp_req_date').setValue(req_date.substring(0,10));
							Ext.getCmp('disp_requester').setValue(requester);
							Ext.getCmp('disp_submit_date').setValue(submit_date.substring(0,10));
							Ext.getCmp('disp_totalPrice').setValue(totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

							
							//var html = INIT_TABLE_HEAD(rec);							
							//console_logs(html);
							//Ext.getCmp('htmlContent').setValue(html);
							
							
							
							routingStore.getProxy().setExtraParam('unique_id',gPr_uid);
							routingStore.load(  function(records) {
								var NULL_DATE = "2001/01/01 00:00:00";
								for (var i=0; i<records.length; i++){
						        	var rtgwrk_unique_id = records[i].get('rtgwrk_unique_id');
						        	var user_id = records[i].get('user_id');
						        	var user_name = records[i].get('user_name');
						        	var submit_date = records[i].get('submit_date');
						        	var dept_name = records[i].get('dept_name');
						        	var comment = records[i].get('comment');
						        	var state = records[i].get('state');
						        	var result = records[i].get('result');
						        	var role = records[i].get('role');
						        	po_user_uid = records[i].get('po_user_uid');
						        	submit_date = NULL_DATE==submit_date.substring(0,NULL_DATE.length) ? "" : submit_date.substring(0,19);
						        	records[i].set('submit_date', submit_date);
						        	result = i==0 ? '-' : getName(result, 'result');
						        	records[i].set('result', result);
						   
								}
								
							});
							
							
							switch(po_no.substring(0,2)) {
							case 'OR':
								myGrid.getEl().show();
								Ext.Ajax.request({
									url: CONTEXT_PATH + '/purchase/request.do?method=getPodetail',				
									params:{
										uid_rtgast : gPr_uid
									},
									
									success : function(result) {
										var text = result.responseText;
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
										setPoDetail(o);
										
									},
									failure: extjsUtil.failureMessage
								});
								break;
							case 'PR':
								myGrid.getEl().show();
								Ext.getCmp('po_detail').setValue('');
								Ext.getCmp('po_detail').getEl().hide();
								break;
							default:
								myGrid.getEl().hide();
								Ext.getCmp('po_detail').setValue('');
								Ext.getCmp('po_detail').getEl().hide();
							}
							
							main2.setLoading(false);
							
				    		
						});
		            	
						
		            } else {
		            	
		            }
		        }
		    });
		    Ext.define('Cartmap', {
			   	 extend: 'Ext.data.Model',
			   	 fields: /*(G)*/vCENTER_FIELDS_SUB,
			   	    proxy: {
							type: 'ajax',
					        api: {
					            read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=readCartmap'
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

		    routingStore = Ext.create('Mplm.store.RoutingStore', {} );
		    
		    
		    
			cartstore = new Ext.data.Store({  
				pageSize: /*getPageSize()*/1000,
				model: 'Cartmap',
				sorters: [{
		            property: 'unique_id',
		            direction: 'DESC'
		        }]
			});
			
		    myGrid = Ext.create('Ext.grid.Panel', {
		        //region: 'south',
		        border: false,
			    frame: false ,
		        store: cartstore,
		        height:140,
		        dockedItems: [{
		            dock: 'top',
		            xtype: 'toolbar',
		            items: [
      				     ]
		        	}
		        
		        ],
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
		        }
		    });
		    myGrid.getSelectionModel().on({
		        selectionchange: function(sm, selections) {
		        	
		        	console_log("selections.length =" + selections.length);
		        	if (selections.length) {
						collapseProperty();//uncheck no displayProperty
		        		////grid info 켜기
		        		displayProperty(selections[0], vCENTER_FIELDS_SUB);
		        	}
		        }
		    });
		    
			var rtgwrkGrid = Ext.create('Ext.grid.Panel', {
				    store: routingStore,
				    stateId: 'stateGrid-rtgwrkGrid-111',
				    layout: 'fit',
				    border: false,
				    frame: false ,
			        sortable:false ,
			        menuDisabled:true ,
					multiSelect : false,
				    columns: [
				              {text: ppo2_user_name, dataIndex: 'user_name',width:80}
				              ,{text: ppo2_dept_name, dataIndex: 'dept_name',width:80}
				              ,{text: ppo2_submit_date, dataIndex: 'submit_date',width:100}
				              ,{text: ppo2_comment, dataIndex: 'comment', flex: 50}
				              ,{text: ppo2_result, dataIndex: 'result',width:60}
				              ,{text: ppo2_role, dataIndex: 'role',width:60}
				              ,{text: ppo2_user_id, dataIndex: 'user_id',width:80}
				              ],
					viewConfig:{
					    markDirty:false
					}
				});
			
			
			var myFormPanel = Ext.create('Ext.form.Panel', {
				id: 'myFormPanel',
				title: '결재 내용',
				xtype: 'form',
    			frame: false,
    	        border: true,
                bodyPadding: 10,
                region: 'center',
                height: 400,
                autoScroll: true,
                //layout: 'vbox',
    	        defaults: {
    	            anchor: '100%',
    	            allowBlank: false,
    	            msgTarget: 'side',
    	            labelWidth: 60
    	        },
		        items: [
	                
	                {
	                    xtype: 'container',
                        type: 'hbox',
                        padding:'5',
                        pack:'end',
                        align:'middle',
						defaults: {
						},
						margin: '0 0 5 0',//  top, right, bottom, left
						border:false,
						items: [
						]
					}
	                ,
	                rtgwrkGrid,
	                {
	                	xtype: 'component',
	                	html: '<br/><hr/><br/>',
	                	anchor: '100%'
	                },
	                /*
	                {
	                	 id: 'htmlContent',
			             xtype: 'displayfield',
			             width: '100%',
			             height: '100',
			             border: false,
			             enableColors: false,
			             enableAlignments: false,
			             anchor: '100%',
			             value: '<hr />'
	                },*/
	                {
	                    xtype: 'container',
	                    layout:'column',
	                    items:[
			                
			                {
			    				fieldLabel: '결재번호',
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
			    		    	//fieldLabel: crt3_name,
			                	fieldLabel: '제목',
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
			    		    	//fieldLabel: crt3_content,
			                	fieldLabel: '내용',
			    		    	xtype:  'displayfield',
			    		    	id: 'disp_content',
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
			    		    	fieldLabel: '요청일자',
			    		    	xtype:  'displayfield',
			    		    	id: 'disp_req_date',
			    		    	columnWidth: 0.5,
			    		    	anchor: '100%'
			    		    },{
			    		    	fieldLabel: '요청자',
			    		    	xtype:  'displayfield',
			    		    	id: 'disp_requester',
			    		    	columnWidth: 0.5,
			    		    	anchor: '100%'
			    		    }
			    		    ]
	                }
,
	    		    
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
					},
					{
		                	xtype: 'component',
		                	html: '<br/><hr/><br/>',
		                	anchor: '100%'
		                }, myGrid
	                ]
				});
		
			main2 =  Ext.create('Ext.panel.Panel', {
				//height: getCenterPanelHeight(),
			    layout:'border',
			    border: false,
//			    region: 'center',
			    region: 'east',
	            width: '70%',
			    layoutConfig: {columns: 1, rows:1},
			    defaults: {
			        collapsible: true,
			        split: true,
			        cmargins: '5 0 0 0',
			        margins: '0 0 0 0'
			    },
			    items: [myFormPanel/*,myGrid*/]
			});

			var main =  Ext.create('Ext.panel.Panel', {
				//height: getCenterPanelHeight(),
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
});	//OnReady


