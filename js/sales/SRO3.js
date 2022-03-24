/*

SRO3 - 래현	금형입출현황
 */
Ext.require([ 'Ext.grid.*', 'Ext.data.*' ]);

var sroFields = [
                 {name:	'unique_id',type:"string"}
                	,{name:	'model_no',type:"string"}
                	,{name:	'pcs_code',type:"string"}
                	,{name:	'work_order',type:"string"}
                	,{name:	'pcs_no',type:"string"}
                	,{name:	'amount',type:"string"}
                	,{name:	'in_company',type:"string"}
                	,{name:	'send_pcs',type:"string"}
                	,{name:	'in_time',type:"string"}
                	,{name:	'out_time',type:"string"}
                	,{name:	'rough_grinding',type:"string"}
                	,{name:	'finishing_frinding',type:"string"}
                	,{name:	'cpin',type:"string"}
                	,{name: 'nozzle',type:"string"}
                	,{name: 'lt',type:"string"}
                   //검색옵션
                 ,{name: 'srch_type',type:"string"}//multi, single
                    
                 ];

var sroColumn = [
                 { text     : 'unique_id', 		width : 80,  sortable : true, dataIndex: 'unique_id' },
                 { text     : '모델명',  	width : 80,  sortable : true, dataIndex: 'model_no'   },
                 { text     : '품명',  	width : 80,  sortable : true, dataIndex: 'pcs_code'   },
                 { text     : 'W/O',  	width : 80,  sortable : true, dataIndex: 'work_order'   },
                 { text     : '품번',  	width : 80,  sortable : true, dataIndex: 'pcs_no'   },
                 { text     : '수량',  		width : 80,  sortable : true, dataIndex: 'amount'  },
                 { text     : '입고처', 	width : 80,  sortable : true, dataIndex: 'in_company'  },
                 { text     : '납기',  	width : 80,  sortable : true, dataIndex: 'send_pcs'    },
                 { text     : '입고시간',  	width : 80,  sortable : true, dataIndex: 'in_time'   },
                 { text     : '출고시간',width : 80,  sortable : true, dataIndex: 'out_time'   },
                 { text     : '황삭',  	width : 80,  sortable : true, dataIndex: 'rough_grinding'   },
                 { text     : '정삭',  	width : 80,  sortable : true, dataIndex: 'finishing_grinding'   },
                 { text     : 'C/PIN',  	width : 80,  sortable : true, dataIndex: 'cpin'   },
                 { text     : '노즐',  	width : 80,  sortable : true, dataIndex: 'nozzle'   },
                 { text     : 'L/T',  	width : 80,  sortable : true, dataIndex: 'lt'   }
                 ];

var /*(G)*/vSRCH_TOOLTIP = [ {
	target : 'srchUnique_id',
	html : 'unique_id',
	anchor : 'bottom',
	trackMouse : true,
	anchorOffset : 10
}, {
	target : 'srchWo',
	html : 'work_order',
	anchor : 'bottom',
	trackMouse : true,
	anchorOffset : 10
}, {
	target : 'srchDate',
	html : 'in_time',
	anchor : 'bottom',
	trackMouse : true,
	anchorOffset : 10
}, {
	target : 'srchPn',
	html : 'product_no',
	anchor : 'bottom',
	trackMouse : true,
	anchorOffset : 10
} ];

// global var.
var grid = null;
var store = null;

MessageBox = function() {
	return {
		msg : function(format) {
			return Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 0));
		}
	};
}();

function resetParam() {
	store.getProxy().setExtraParam('model_no','');
	store.getProxy().setExtraParam('pcs_code','');
	store.getProxy().setExtraParam('work_order','');
	store.getProxy().setExtraParam('pcs_no','');
}

function srchSingleHandler(widName, parmName, isWild) {

	resetParam();
	var val = Ext.getCmp(widName).getValue();
	var enValue = Ext.JSON.encode(val);
	store.getProxy().setExtraParam("srch_type", 'single');
	if (isWild) {
		val = '%' + enValue + '%';
	}
	store.getProxy().setExtraParam(parmName, val);
	store.load(function() {
	});
};

var searchHandler = function() {
	resetParam();

	var unique_id = Ext.getCmp('srchUnique_id').getValue();
	var work_order = Ext.getCmp('srchWo').getValue();
	var in_time = Ext.getCmp('srchDate').getValue();
	var product_no = Ext.getCmp('srchPn').getValue();

	store.getProxy().setExtraParam("srch_type", 'multi');

	if (unique_id != null && unique_id != '') {
		store.getProxy().setExtraParam('unique_id', unique_id);
	}

	if (work_order != null && work_order != '') {
		var enValue = Ext.JSON.encode('%' + work_order + '%');
		store.getProxy().setExtraParam('work_order', enValue);
	}

	if (in_time != null && in_time != '') {
		var enValue = Ext.JSON.encode('%' + in_time + '%');
		store.getProxy().setExtraParam('in_time', enValue);
	}
	
	if (product_no != null && product_no != '') {
		var enValue = Ext.JSON.encode('%' + product_no + '%');
		store.getProxy().setExtraParam('product_no', enValue);
	}

	store.load(function() {
	});
};

var viewHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	Sro3.load(unique_id, {
		success : function(sro) {
			// Ext.MessageBox.alert('Find Board', "unique_id : " +
			// board.get('unique_id'));
			// console_log("user: " + user.get('user_id'));
			var unique_id = sro.get('unique_id');
			var model_no = sro.get('model_no');
			var product_name = sro.get('product_name');
			var work_order = sro.get('work_order');
			var product_no = sro.get('product_no');
			var product_amount = sro.get('product_amount');
			var send_company = sro.get('send_company');
			var in_time = sro.get('in_time');
			var out_time = sro.get('out_time');
			var rough_grinding = sro.get('rough_grinding');
			var finishing_grinding = sro.get('finishing_grinding');
			var cpin = sro.get('cpin');
			var nozzle = sro.get('nozzle');
			var etc = sro.get('etc');

			var lineGap = 25;
			var form = Ext.create('Ext.form.Panel', {
				id : 'formPanel',
				layout : 'absolute',
				url : 'save-form.php',
				defaultType : 'displayfield',
				border : false,
				bodyPadding : 15,
				defaults : {
					anchor : '100%',
					allowBlank : false,
					msgTarget : 'side',
					labelWidth : 100
				},
				items : [ {
					fieldLabel : '고유번호',
					value : unique_id,
					x : 5,
					y : -15 + 1 * lineGap,
					name : 'unique_id',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : '모델명',
					value : model_no,
					x : 5,
					y : -15 + 2 * lineGap,
					name : 'model_no',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : '제품명',
					value : product_name,
					x : 5,
					y : -15 + 3 * lineGap,
					name : 'product_name',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : 'W/O',
					value : work_order,
					x : 5,
					y : -15 + 4 * lineGap,
					name : 'work_order',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : '제품번호',
					value : product_no,
					x : 5,
					y : -15 + 5 * lineGap,
					name : 'product_no',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : '수량',
					value : product_amount,
					x : 5,
					y : -15 + 6 * lineGap,
					name : 'product_amount',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : '입고처',
					value : send_company,
					x : 5,
					y : -15 + 7 * lineGap,
					name : 'send_company',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : '입고시간',
					value : in_time,
					x : 5,
					y : -15 + 8 * lineGap,
					name : 'in_time',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : '출고시간',
					value : out_time,
					x : 5,
					y : -15 + 9 * lineGap,
					name : 'out_time',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : '황삭',
					value : rough_grinding,
					x : 5,
					y : -15 + 10 * lineGap,
					name : 'rough_grinding',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : '정삭',
					value : finishing_grinding,
					x : 5,
					y : -15 + 11 * lineGap,
					name : 'finishing_grinding',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : 'C/PIN',
					value : cpin,
					x : 5,
					y : -15 + 12 * lineGap,
					name : 'cpin',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : '노즐',
					value : nozzle,
					x : 5,
					y : -15 + 13 * lineGap,
					name : 'nozzle',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel : 'etc',
					value : etc,
					x : 5,
					y : -15 + 14 * lineGap,
					name : 'etc',
					anchor : '-5' // anchor width by percentage
				} ]
			}); // endof form

			var win = Ext.create('Ext.Window', {
				title : gm.me().getMC('CMD_VIEW_DTL','상세보기'),
				width : 500,
				height : 430,
				minWidth : 250,
				minHeight : 180,
				layout : 'absolute',
				plain : true,
				items : form,
				buttons : [ {
					text : CMD_OK,
					handler : function() {
						if (win) {
							win.close();
						}
					}
				} ]
			});
			// store.load(function() {});
			win.show();
			// endofwin
		}// endofsuccess
	});// emdofload

};

var editHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	Sro3.load(unique_id,{
		success : function(sro) {
			// Ext.MessageBox.alert('Find Board', "unique_id : "
			// + board.get('unique_id'));
			// console_log("user: " + user.get('user_id'));
			var unique_id = sro.get('unique_id');
			var model_no = sro.get('model_no');
			var product_name = sro.get('product_name');
			var work_order = sro.get('work_order');
			var product_no = sro.get('product_no');
			var product_amount = sro.get('product_amount');
			var send_company = sro.get('send_company');
			var in_time = sro.get('in_time');
			var out_time = sro.get('out_time');
			var rough_grinding = sro.get('rough_grinding');
			var finishing_grinding = sro.get('finishing_grinding');
			var cpin = sro.get('cpin');
			var nozzle = sro.get('nozzle');
			var etc = sro.get('etc');

							var lineGap = 25;

							var form = Ext.create('Ext.form.Panel', {
												id : 'formPanel',
												layout : 'absolute',
												url : 'save-form.php',
												defaultType : 'textfield',
												border : false,
												bodyPadding : 15,
												defaults : {
													anchor : '100%',
													allowBlank : false,
													msgTarget : 'side',
													labelWidth : 100
												},
												items : [
														{
															fieldLabel : '고유번호',
															value : unique_id,
															x : 5,
															y : -15 + 1
																	* lineGap,
															name : 'unique_id',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : '모델명',
															value : model_no,
															x : 5,
															y : -15 + 2 * lineGap,
															name : 'model_no',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : '제품명',
															value : product_name,
															x : 5,
															y : -15 + 3 * lineGap,
															name : 'product_name',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : 'W/O',
															value : work_order,
															x : 5,
															y : -15 + 4 * lineGap,
															name : 'work_order',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : '제품번호',
															value : product_no,
															x : 5,
															y : -15 + 5 * lineGap,
															name : 'product_no',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : '수량',
															value : product_amount,
															x : 5,
															y : -15 + 6 * lineGap,
															name : 'product_amount',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : '입고처',
															value : send_company,
															x : 5,
															y : -15 + 7 * lineGap,
															name : 'send_company',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : '입고시간',
															value : in_time,
															x : 5,
															y : -15 + 8 * lineGap,
															name : 'in_time',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : '출고시간',
															value : out_time,
															x : 5,
															y : -15 + 9 * lineGap,
															name : 'out_time',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : '황삭',
															value : rough_grinding,
															x : 5,
															y : -15 + 10 * lineGap,
															name : 'rough_grinding',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : '정삭',
															value : finishing_grinding,
															x : 5,
															y : -15 + 11 * lineGap,
															name : 'finishing_grinding',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : 'C/PIN',
															value : cpin,
															x : 5,
															y : -15 + 12 * lineGap,
															name : 'cpin',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : '노즐',
															value : nozzle,
															x : 5,
															y : -15 + 13 * lineGap,
															name : 'nozzle',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel : 'etc',
															value : etc,
															x : 5,
															y : -15 + 14 * lineGap,
															name : 'etc',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														} ]
											}); // endof form

							var win = Ext.create('Ext.Window', {
												title : '내용수정',
												width : 500,
												height : 430,
												minWidth : 250,
												minHeight : 180,
												layout : 'absolute',
												plain : true,
												items : form,
												buttons : [{
															text : CMD_OK,
															handler : function() {
																var form = Ext.getCmp('formPanel').getForm();
																if (form.isValid()) {
																	var val = form.getValues(false);
																	var sro = Ext.ModelManager.create(val, 'Sro3');

																	// 저장 수정
																	sro.save({
																				success : function() {
																					// console_log('updated');
																					if (win) {
																						win.close();
																						store.load(function() {
																								});
																					}
																				}
																			});

																	if (win) {
																		win.close();
																	}
																} else {
																	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
																}

															}
														},
														{
															text : CMD_CANCEL,
															handler : function() {
																if (win) {
																	win.close();
																}
															}
														} ]
											});
							win.show();
							// endofwin
						}// endofsuccess
					});// emdofload

};

// writer define
Ext.define('Sro3.writer.SinglePost', {
	extend : 'Ext.data.writer.Writer',
	alternateClassName : 'Ext.data.SinglePostWriter',
	alias : 'writer.singlepost',

	writeRecords : function(request, data) {
		// console_info(data);
		// console_info(data[0]);
		data[0].cmdType = 'update';
		request.params = data[0];
		return request;
	}
});

function deleteConfirm(btn) {

	var selections = grid.getSelectionModel().getSelection();
	if (selections) {
		var result = MessageBox.msg('{0}', btn);
		if (result == 'yes') {
			for ( var i = 0; i < selections.length; i++) {
				var rec = selections[i];
				var unique_id = rec.get('unique_id');
				var sro = Ext.ModelManager.create({unique_id : unique_id}, 'Sro3');

				sro.destroy({
					success : function() {
					}
				});

			}
			grid.store.remove(selections);
		}

	}
};

// Define Remove Action
var removeAction = Ext.create('Ext.Action', {
	itemId : 'removeButton',
	iconCls : 'remove',
	text : '삭제',
	disabled : true,
	handler : function(widget, event) {
		Ext.MessageBox.show({
			title : delete_msg_title,
			msg : '이 제품에 대한 데이터를 삭제하시겠습니까?',
			buttons : Ext.MessageBox.YESNO,
			fn : deleteConfirm,
			// animateTarget: 'mb4',
			icon : Ext.MessageBox.QUESTION
		});
	}
});

//Define Complete Action
var completeAction = Ext.create('Ext.Action', {
	iconCls : 'accept',
	text : '출고',
	disabled : true,
	handler : function(widget, event) {
		Ext.MessageBox.show({
			title : delete_msg_title,
			msg : delete_msg_content,
			buttons : Ext.MessageBox.YESNO,
			fn : deleteConfirm,
			// animateTarget: 'mb4',
			icon : Ext.MessageBox.QUESTION
		});
	}
});

// Define Remove Action
var addAction = Ext.create('Ext.Action', {
					iconCls : 'add',
					text : '수주',
					disabled: fPERM_DISABLING(),
					handler : function(widget, event) {

						var lineGap = 25;
						var form = Ext.create('Ext.form.Panel', {
											id : 'formPanel',
											layout : 'absolute',
											url : 'save-form.php',
											defaultType : 'textfield',
											border : false,
											bodyPadding : 15,
											defaults : {
												anchor : '100%',
												allowBlank : false,
												msgTarget : 'side',
												labelWidth : 100
											},
											items : [
													{
														fieldLabel : '모델명',
														x : 5,
														y : -15 + 1 * lineGap,
														name : 'model_no',
														anchor : '-5', // anchor
																		// width
																		// by
																		// percentage
													},
													{
														fieldLabel : '제품명',
														x : 5,
														y : -15 + 2 * lineGap,
														name : 'product_name',
														anchor : '-5' // anchor
																		// width
																		// by
																		// percentage
													},
													{
														fieldLabel : 'W/O',
														x : 5,
														y : -15 + 3 * lineGap,
														name : 'work_order',
														anchor : '-5' // anchor
																		// width
																		// by
																		// percentage
													},
													{
														fieldLabel : '제품번호',
														x : 5,
														y : -15 + 4 * lineGap,
														name : 'product_no',
														anchor : '-5' // anchor
																		// width
																		// by
																		// percentage
													},
													{
														fieldLabel : '수량',
														x : 5,
														y : -15 + 5 * lineGap,
														name : 'product_amount',
														anchor : '-5' // anchor
																		// width
																		// by
																		// percentage
													},
													{
														fieldLabel : '입고처',
														x : 5,
														y : -15 + 6 * lineGap,
														name : 'send_company',
														anchor : '-5' // anchor
																		// width
																		// by
																		// percentage
													},
													{
														fieldLabel : '황삭',
														x : 5,
														y : -15 + 7 * lineGap,
														name : 'rough_grinding',
														anchor : '-5' // anchor
																		// width
																		// by
																		// percentage
													},
													{
														fieldLabel : '정삭',
														x : 5,
														y : -15 + 8 * lineGap,
														name : 'finishing_grinding',
														anchor : '-5' // anchor
																		// width
																		// by
																		// percentage
													},
													{
														fieldLabel : 'C/PIN',
														x : 5,
														y : -15 + 9 * lineGap,
														name : 'cpin',
														anchor : '-5' // anchor
																		// width
																		// by
																		// percentage
													},
													{
														fieldLabel : '노즐',
														x : 5,
														y : -15 + 10 * lineGap,
														name : 'nozzle',
														anchor : '-5' // anchor
																		// width
																		// by
																		// percentage
													},
													{
														fieldLabel : 'etc',
														x : 5,
														y : -15 + 11 * lineGap,
														name : 'etc',
														anchor : '-5' // anchor
																		// width
																		// by
																		// percentage
													} ]
										});

						var win = Ext.create('Ext.Window', {
											title : '가공 제품 수주',
											width : 500,
											height : 350,
											minWidth : 250,
											minHeight : 180,
											layout : 'absolute',
											plain : true,
											items : form,
											buttons : [
													{
														text : 'OK',
														handler : function() {
															var form = Ext.getCmp('formPanel').getForm();
															if (form.isValid()) {
																var val = form.getValues(false);
																var sro = Ext.ModelManager.create(val, 'Sro3');
																// 저장 수정
																sro.save({
																			success : function() {
																				// console_log('updated');
																				if (win) {
																					win.close();
																					store.load(function() {
																							});
																				}
																			}
																		});

																if (win) {
																	win.close();
																}
															} else {
																Ext.MessageBox.alert(error_msg_prompt,  error_msg_content);
															}

														}
													}, {
														text : 'CANCEL',
														handler : function() {
															if (win) {
																win.close();
															}
														}
													} ]
										});
						win.show(this, function() {
							// button.dom.disabled = false;
						});
					}
				});

// Define Delete Action
var editAction = Ext.create('Ext.Action', {
	itemId : 'editButton',
	iconCls : 'pencil',
	text : '수정',
	disabled : true,
	handler : editHandler
});

var searchAction = Ext.create('Ext.Action', {
	itemId : 'searchButton',
	iconCls : 'search',
	text : CMD_SEARCH/*'검색'*/,
	disabled : false,
	handler : searchHandler
});

// Define Detail Action
var detailAction = Ext.create('Ext.Action', {
	itemId : 'detailButton',
	iconCls : 'application_view_detail',
	text: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
	disabled : true,
	handler : viewHandler
});

var waitAction = Ext.create('Ext.Action', {
	itemId : 'waitButton',
	iconCls : 'deny',
	text : '보류',
	disabled : true,
	//handler : viewHandler
});

// Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
	items : [ detailAction, editAction, removeAction ]
});

Ext.define('Sro3', {
	extend : 'Ext.data.Model',
	fields : sroFields,
	proxy : {
		type : 'ajax',
		// url: CONTEXT_PATH + '/admin/board.do?method=getUserList',
		api : {
			read : CONTEXT_PATH + '/admin/comdst.do?method=read',
			create : CONTEXT_PATH + '/admin/comdst.do?method=create',
			update : CONTEXT_PATH + '/admin/comdst.do?method=update',
			destroy : CONTEXT_PATH + '/admin/comdst.do?method=destroy'
		},
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		writer : {
			type : 'singlepost',
			writeAllFields : false,
			root : 'datas'
		}
	/*
	 * , actionMethods: { create: 'POST', read: 'POST', update: 'POST', destroy:
	 * 'POST' }
	 */
	}
});

Ext.onReady(function() {

			// Board Store 정의
			store = new Ext.data.Store({
				pageSize : getPageSize(),
				model : 'Sro3',
				// remoteSort: true,
				sorters : [ {
					property : 'unique_id',
					direction : 'DESC'
				} ]
			});

			store.load(function() {
				//Ext.get('MAIN_DIV_TARGET').update('');
						if (store.getCount() == 0) {
							//Ext.MessageBox.alert("Check!!!!","Check your login state. (로그인 했나요?)");
						} else {
							var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
							/*var selModel = Ext.create('Ext.selection.CheckboxModel', {
												listeners : {
													selectionchange : function(sm, selections) {
														grid.down('#removeButton').setDisabled(selections.length == 0);
													}
												}
											});*/

							grid = Ext.create('Ext.grid.Panel', {
												store : store,
												stateful : true,
												collapsible : true,
												multiSelect : true,
												stateId : 'stateGrid',
												selModel : selModel,
												autoScroll : true,
												autoHeight : true,
												// layout: 'fit',
												height : getCenterPanelHeight(),
												// paging bar on the bottom

												bbar : Ext.create('Ext.PagingToolbar', {
																	store : store,
																	displayInfo : true,
																	displayMsg : 'Displaying topics {0} - {1} of {2}',
																	emptyMsg : "No topics to display"

																}),

												dockedItems : [
														{
															dock : 'top',
															xtype : 'toolbar',
															items : [
																	searchAction,
																	'-',
																	addAction,
																	'-',
																	completeAction,
																	'-',
																	removeAction,
																	'-',
																	waitAction,
																	'->',
																	{
																		iconCls : 'tasks-show-all',
																		tooltip : 'All',
																		toggleGroup : 'status'
																	},
																	{
																		iconCls : 'tasks-show-active',
																		tooltip : 'Current',
																		toggleGroup : 'status'
																	},
																	{
																		iconCls : 'tasks-show-complete',
																		tooltip : 'Past',
																		toggleGroup : 'status'
																	}

															]
														},
														{
															xtype : 'toolbar',
															items : [
																	{
																		xtype : 'triggerfield',
																		emptyText : '고유번호',
																		id : 'srchUnique_id',
																		listeners : {
																			specialkey : function(field, e) {
																				if (e.getKey() == Ext.EventObject.ENTER) {
																					srchSingleHandler('srchUnique_id', 'unique_id', false);
																				}
																			}
																		},
																		trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',
																		trigger2Cls : Ext.baseCSSPrefix + 'form-search-trigger',
																		'onTrigger1Click' : function() {
																			Ext.getCmp('srchUnique_id').setValue('');
																		},
																		'onTrigger2Click' : function() {
																			srchSingleHandler('srchUnique_id', 'unique_id', false);
																			/*
																			 * var
																			 * unique_id =
																			 * Ext.getCmp('srchUnique_id').getValue();
																			 * store.getProxy().setExtraParam("srch_type",
																			 * 'single');
																			 * store.getProxy().setExtraParam("unique_id",
																			 * unique_id);
																			 * store.load(function()
																			 * {});
																			 */
																		}

																	},
																	'-',
																	{
																		xtype : 'triggerfield',
																		emptyText : 'W/O',
																		id : 'srchWo',
																		listeners : {
																			specialkey : function(field, e) {
																				if (e.getKey() == Ext.EventObject.ENTER) {
																					srchSingleHandler('srchWo', 'work_order', true);
																				}
																			}
																		},
																		trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',
																		trigger2Cls : Ext.baseCSSPrefix + 'form-search-trigger',
																		'onTrigger1Click' : function() {
																			Ext.getCmp('srchWo').setValue('');
																		},
																		'onTrigger2Click' : function() {
																			srchSingleHandler('srchWo', 'work_order', true);
																			/*
																			 * var
																			 * board_name =
																			 * Ext.getCmp('srchName').getValue();
																			 * store.getProxy().setExtraParam("srch_type",
																			 * 'single');
																			 * store.getProxy().setExtraParam("board_name",
																			 * '%' +
																			 * board_name +
																			 * '%');
																			 * store.load(function()
																			 * {});
																			 */
																		}
																	},
																	'-',
																	{
																		xtype : 'triggerfield',
																		emptyText : '제품번호',
																		id : 'srchPn',
																		listeners : {
																			specialkey : function(field, e) {
																				if (e.getKey() == Ext.EventObject.ENTER) {
																					srchSingleHandler('srchPn', 'product_no', true);
																				}
																			}
																		},
																		trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',
																		trigger2Cls : Ext.baseCSSPrefix + 'form-search-trigger',
																		'onTrigger1Click' : function() {
																			Ext.getCmp('srchPn').setValue('');
																		},
																		'onTrigger2Click' : function() {
																			srchSingleHandler('srchPn', 'product_no', true);
																			/*
																			 * var
																			 * board_content =
																			 * Ext.getCmp('srchContents').getValue();
																			 * store.getProxy().setExtraParam("srch_type",
																			 * 'single');
																			 * store.getProxy().setExtraParam("board_content",
																			 * '%'
																			 * +board_content +
																			 * '%');
																			 * //store.reload();
																			 * store.load(function()
																			 * {});
																			 */
																			}
																		
																		},
																		'-',
																		{
																			xtype : 'triggerfield',
																			emptyText : '입고시간',
																			id : 'srchDate',
																			listeners : {
																				specialkey : function(field, e) {
																					if (e.getKey() == Ext.EventObject.ENTER) {
																						srchSingleHandler('srchDate', 'in_time', true);
																					}
																				}
																			},
																			trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',
																			trigger2Cls : Ext.baseCSSPrefix + 'form-search-trigger',
																			'onTrigger1Click' : function() {
																				Ext.getCmp('srchDate').setValue('');
																			},
																			'onTrigger2Click' : function() {
																				srchSingleHandler('srchDate', 'in_time', true);
																				/*
																				 * var
																				 * board_content =
																				 * Ext.getCmp('srchContents').getValue();
																				 * store.getProxy().setExtraParam("srch_type",
																				 * 'single');
																				 * store.getProxy().setExtraParam("board_content",
																				 * '%'
																				 * +board_content +
																				 * '%');
																				 * //store.reload();
																				 * store.load(function()
																				 * {});
																				 */
																			}

																	}
																	,
																	'->',

																	{
																		text : 'First Division',
																		iconCls : 'number01',
																		menu : {
																			items : [
																					{
																						text : 'First Division',
																						iconCls : 'number01'
																					},
																					{
																						text : 'Second Division',
																						iconCls : 'number02'
																					},
																					{
																						text : 'Third Division',
																						iconCls : 'number03'
																					},
																					{
																						text : 'Fourth Division',
																						iconCls : 'number04'
																					} ]
																		}
																	}

															]
														}

												],
												columns : sroColumn,
												viewConfig : {
													stripeRows : true,
													enableTextSelection : true,
													getRowClass: function(record) { 
								   			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
											            } ,
													listeners : {
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
														itemcontextmenu : function(view, rec, node, index, e) {
															e.stopEvent();
															contextMenu.showAt(e.getXY());
															return false;
														},
														itemdblclick : viewHandler
													/*
													 * function(dv, record,
													 * item, index, e) {
													 * alert('working'); }
													 */

													}
												},
												title: getMenuTitle()//,
												//renderTo : 'MAIN_DIV_TARGET'
											});
							fLAYOUT_CONTENT(grid);
							grid.getSelectionModel().on({
								selectionchange : function(sm, selections) {
									if (selections.length) {
										//grid info 켜기
										displayProperty(selections[0]);
										

										if(fPERM_DISABLING()==true) {
											removeAction.disable();
											editAction.disable();
											completeAction.disable();
											waitAction.disable();
										}else{
											removeAction.enable();
											editAction.enable();
											completeAction.enable();
											waitAction.enable();
										}
										detailAction.enable();
									} else {
										if(fPERM_DISABLING()==true) {
											collapseProperty();//uncheck no displayProperty
											removeAction.disable();
											editAction.disable();
											completeAction.disable();
											waitAction.disable();
										}else{
											collapseProperty();//uncheck no displayProperty
											removeAction.disable();
											editAction.disable();
											completeAction.disable();
											waitAction.disable();
										}
										detailAction.enable();
									}
								}
							});
							Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
								Ext.create('Ext.tip.ToolTip', config);
							});

						}
					});

		});
