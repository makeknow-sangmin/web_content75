var togIsNew = true;

var grid = null;
var store = null;
var rtgapp_store = null;
var lineGap = 35;

var lastNoStore = null;
var counts = null;
var moldFormTypeStore = null;
var moldAddType = 'ADD'; // ADD/MOD/VER

var selectedMoldUid = '';
var selectedMoldCode = '';
var selectedMoldCodeDash = '';
var selectedWaName = '';
var selectedWaCode = '';
var selectedDescription = ''; // 제품모델번호', 'description', '机型
var selectedPjName = ''; // 제품명', 'pj_name', '品名
var selectedPjType = ''; // 제품유형코드', 'pj_type', '产品代码
var selectedMoldType = ''; // '주물/소물', 'mold_type', '主件/小件
var selectedResine_color = '';
var selectedSurface_art = '';
var selectedCav_no = '';
var selectedFile_itemcode = '';
var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {});
var ahid_userlist = new Array();
var ahid_userlist_role = new Array();

var ahid_userlist = new Array();
var ahid_userlist_role = new Array();

var Gtoday = TODAY_GLOBAL;
var this_year = Ext.Date.format(Gtoday, 'Y');
var Towlength_year = this_year.substring(2, 4);

var routeGubunTypeStore = Ext.create('Mplm.store.RouteGubunTypeStore', {});

var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>', win;

// function Cpj_code(pj_code){
// cpj_code = pj_code.substring(0,13);
// if(cpj_code == ""){
// return cpj_code;
// }else{
// CPj_code = cpj_code+"A";
// }
// return CPj_code;
//
// }

function getLast() {
	Ext.Ajax.request({
				url : CONTEXT_PATH + '/sales/poreceipt.do?method=lastno',
				params : {},
				success : function(result, request) {
					var result = result.responseText;
					var str = result;
					var num = Number(str);
					if (str.length < 4) {
						num = '0' + num;
					} else if (str.length < 3) {
						num = '00' + num;
					} else if (str.length < 2) {
						num = '000' + num;
					} else {
						num = num % 10000;
					}
				},
				failure : extjsUtil.failureMessage
			});
}

/**
 * 공통콘드롤로 변경 LoadJs('/js/util/buyerStore.js');
 */

// Ext.define('UsrAst.Combo', {
// extend: 'Ext.data.Model',
// fields: [
// { name: 'unique_id', type: "string" }
// ,{ name: 'user_id', type: "string" }
// ,{ name: 'user_name', type: "string" }
// ,{ name: 'dept_name', type: "string" }
// ,{ name: 'dept_code', type: "string" }
// ,{ name: 'email', type: "string" }
// ,{ name: 'hp_no', type: "string" }
// ],
// proxy: {
// type: 'ajax',
// api: {
// read: CONTEXT_PATH + '/userMgmt/user.do?method=query'
// },
// reader: {
// type: 'json',
// root: 'datas',
// successProperty: 'success'
// },
// writer: {
// type: 'singlepost',
// writeAllFields: false,
// root: 'datas'
// }
// },
// listeners: {
// beforeload: function(){
// alert('come');
// var obj = Ext.getCmp('user_name');
// if(obj!=null) {
// var val = obj.getValue();
// console_log(val);
// if(val!=null) {
// var enValue = Ext.JSON.encode(val);
// console_log(enValue);
// this.getProxy().setExtraParam('queryUtf8', enValue);
// }else {
// this.getProxy().setExtraParam('queryUtf8', '');
// }
// }
// }
// }
//		
// });
// var userStore = new Ext.data.Store({
// pageSize: 5,
// model: 'UsrAst.Combo',
// sorters: [{
// property: 'user_name',
// direction: 'ASC'
// }]
// });
var productCodeStore = new Ext.create('Ext.data.Store', {
			fields : [{
						name : 'systemCode',
						type : "string"
					}, {
						name : 'codeName',
						type : "string"
					}, {
						name : 'codeNameEn',
						type : "string"
					}

			],
			proxy : {
				type : 'ajax',
				url : CONTEXT_PATH + '/sales/poreceipt.do?method=productCode',
				reader : {
					type : 'json',
					root : 'datas',
					totalProperty : 'count',
					successProperty : 'success'
				},
				autoLoad : false
			}
		});

var irrigateTypeCodeStore = new Ext.create('Ext.data.Store', {
			fields : [{
						name : 'systemCode',
						type : "string"
					}, {
						name : 'codeName',
						type : "string"
					}, {
						name : 'codeNameEn',
						type : "string"
					}

			],
			proxy : {
				type : 'ajax',
				url : CONTEXT_PATH
						+ '/sales/poreceipt.do?method=irrigateTypeCode',
				reader : {
					type : 'json',
					root : 'datas',
					totalProperty : 'count',
					successProperty : 'success'
				},
				autoLoad : false
			}
		});

Ext.define('RtgAst', {
			extend : 'Ext.data.Model',
			fields : /* (G) */vCENTER_FIELDS,
			proxy : {
				type : 'ajax',
				api : {
					create : CONTEXT_PATH
							+ '/sales/poreceipt.do?method=createComplete'
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
			}
		});

function deleteConfirm(btn) {

	var selections = grid.getSelectionModel().getSelection();
	if (selections) {
		var result = MessageBox.msg('{0}', btn);
		var count = 0;
		if (result == 'yes') {
			for (var i = 0; i < selections.length; i++) {
				var rec = selections[i];
				var parent = rec.get('uid_srcahd');
				var unique_id = rec.get('unique_id');
				var projectmold = Ext.ModelManager.create({
							unique_id : unique_id,
							uid_srcahd : parent
						}, 'ProjectMold');

				projectmold.destroy({
							success : function() {
							}
						});
				count++;
				// Ext.Ajax.request({
				// url: CONTEXT_PATH + '/sales/poreceipt.do?method=destroy',
				// /*delete*/
				// params:{
				// uid_srcahd : parent,
				// unique_id : unique_id
				// },
				// success : function(result, request) {
				// var result = result.responseText;
				// var str = result;
				// var num = Number(str);
				// if(num == '0'){
				// Ext.MessageBox.alert('No','It has children');
				// }else{
				// // for(var i=0; i< selections.length; i++) {
				// // var rec = selections[i];
				// // var unique_id = rec.get('unique_id');
				// // var projectmold = Ext.ModelManager.create({
				// // unique_id : unique_id
				// // }, 'ProjectMold');
				// // }
				// grid.store.remove(selections);
				// }
				// }
				// });
			}
			Ext.MessageBox.alert('Check', 'Delete count : ' + count);
			grid.store.remove(selections);
		}
	}
};
var prWin = null;
var unique_id = new Array();
// 완료
var completeAction = Ext.create('Ext.Action', {
	itemId : 'completeButton',
	iconCls : 'complete',
	text : GET_MULTILANG('sro1_completeAction'),
	disabled : true,
	handler : function(widget, event) {
		var lineGap = 30;
		var selections = grid.getSelectionModel().getSelection();
		for (var i = 0; i < selections.length; i++) {
			var rec = selections[i];
			unique_id[i] = rec.get('unique_id');
		}
		var pjcode = rec.get('pj_code');
		var description = rec.get('description');
		var delivery_plan = rec.get('delivery_plan');
		var reserved_double5 = rec.get('reserved_double5');// 매출금액
		var selling_price = rec.get('selling_price');// 수주금액
		function deleteRtgappConfirm(btn) {
			var selections = agrid.getSelectionModel().getSelection();
			if (selections) {
				var result = MessageBox.msg('{0}', btn);
				if (result == 'yes') {
					for (var i = 0; i < selections.length; i++) {
						var rec = agrid.getSelectionModel().getSelection()[i];
						var unique_id = rec.get('unique_id');
						var rtgapp = Ext.ModelManager.create({
									unique_id : unique_id
								}, 'RtgApp');
						rtgapp.destroy({
									success : function() {
									}
								});
					}
					agrid.store.remove(selections);
				}
			}
		};
		var removeRtgapp = Ext.create('Ext.Action', {
					itemId : 'removeButton',
					iconCls : 'remove',
					text : CMD_DELETE,
					disabled : true,
					handler : function(widget, event) {
						Ext.MessageBox.show({
									title : delete_msg_title,
									msg : delete_msg_content,
									buttons : Ext.MessageBox.YESNO,
									fn : deleteRtgappConfirm,
									// animateTarget: 'mb4',
									icon : Ext.MessageBox.QUESTION
								});
					}
				});
		var updown = {
			text : Position,
			menuDisabled : true,
			sortable : false,
			xtype : 'actioncolumn',
			width : 60,
			items : [{
				icon : CONTEXT_PATH + '/extjs/shared/icons/fam/grid_up.png', // Use
																				// a
																				// URL
																				// in
																				// the
																				// icon
																				// config
				tooltip : 'Up',
				handler : function(agridV, rowIndex, colIndex) {
					var record = agrid.getStore().getAt(rowIndex);
					console_log(record);
					var unique_id = record.get('unique_id');
					console_log(unique_id);
					var direcition = -15;
					Ext.Ajax.request({
								url : CONTEXT_PATH
										+ '/rtgMgmt/routing.do?method=moveRtgappDyna',
								params : {
									direcition : direcition,
									unique_id : unique_id
								},
								success : function(result, request) {
									rtgapp_store.load(function() {
											});
								}
							});
				}
			}, {
				icon : CONTEXT_PATH + '/extjs/shared/icons/fam/grid_down.png', // Use
																				// a
																				// URL
																				// in
																				// the
																				// icon
																				// config
				tooltip : 'Down',
				handler : function(agrid, rowIndex, colIndex) {

					var record = agrid.getStore().getAt(rowIndex);
					console_log(record);
					var unique_id = record.get('unique_id');
					console_log(unique_id);
					var direcition = 15;
					Ext.Ajax.request({
								url : CONTEXT_PATH
										+ '/rtgMgmt/routing.do?method=moveRtgappDyna',
								params : {
									direcition : direcition,
									unique_id : unique_id
								},
								success : function(result, request) {
									rtgapp_store.load(function() {
											});
								}
							});
				}
			}]
		};
		var tempColumn = [];
		tempColumn.push(updown);
		for (var i = 0; i < vCENTER_COLUMN_SUB.length; i++) {
			tempColumn.push(vCENTER_COLUMN_SUB[i]);
		}
		var storeSrch = null;
		storeSrch = Ext.create('Mplm.store.UserStore', {
					hasNull : true
				});
		storeSrch['cmpName'] = 'user';
		rtgapp_store.load(function() {
			Ext.each( /* (G) */tempColumn, function(columnObj, index, value) {
				var dataIndex = columnObj["dataIndex"];
				columnObj["flex"] = 1;
				if (value != "W") {
					if ('gubun' == dataIndex) {
						var combo = null;
						var comboBoxRenderer = function(value, p, record) {
							if (value == 'W') {
							} else {
								console_log('combo.valueField = '
										+ combo.valueField + ', value=' + value);
								console_log(combo.store);
								var idx = combo.store.find(combo.valueField,
										value);
								console_log(idx);
								var rec = combo.store.getAt(idx);
								console_log(rec);
								return (rec === null ? '' : rec
										.get(combo.displayField));
							}
						};
						combo = new Ext.form.field.ComboBox({
									typeAhead : true,
									triggerAction : 'all',
									selectOnTab : true,
									mode : 'local',
									queryMode : 'remote',
									editable : false,
									allowBlank : false,
									displayField : 'codeName',
									valueField : 'systemCode',
									store : routeGubunTypeStore,
									listClass : 'x-combo-list-small',
									listeners : {}
								});
						columnObj["editor"] = combo;
						columnObj["renderer"] = function(value, p, record,
								rowIndex, colIndex, store) {
							p.tdAttr = 'style="background-color: #FFE4E4;"';
							return value;
						};
					}
				}
			});
			// agrid create
			agrid = Ext.create('Ext.grid.Panel', {
				title : 'Routing path',
				store : rtgapp_store,
				layout : 'fit',
				columns : tempColumn,
				plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 1
						})],
				border : false,
				multiSelect : true,
				frame : false,
				dockedItems : [{
					xtype : 'toolbar',
					items : [{
						fieldLabel : dbm1_array_add,
						labelWidth : 42,
						id : 'user',
						name : 'user',
						xtype : 'combo',
						fieldStyle : 'background-color: #FBF8E6; background-image: none;',
						store : storeSrch,
						labelSeparator : ':',
						emptyText : dbm1_name_input,
						displayField : 'user_name',
						valueField : 'unique_id',
						sortInfo : {
							field : 'user_name',
							direction : 'ASC'
						},
						typeAhead : false,
						hideLabel : true,
						minChars : 1,
						width : 230,
						listConfig : {
							loadingText : 'Searching...',
							emptyText : 'No matching posts found.',
							getInnerTpl : function() {
								return '<div data-qtip="{unique_id}">{user_name}|{dept_name}</div>';
							}
						},
						listeners : {
							select : function(combo, record) {

								console_log('Selected Value : '
										+ record[0].get('unique_id'));

								var unique_id = record[0].get('unique_id');
								var user_id = record[0].get('user_id');
								Ext.Ajax.request({
									url : CONTEXT_PATH
											+ '/rtgMgmt/routing.do?method=createRtgappDyna',
									params : {
										useruid : unique_id,
										userid : user_id,
										gubun : 'D'
									},
									success : function(result, request) {
										var result = result.responseText;
										console_log('result:' + result);
										if (result == 'false') {
											Ext.MessageBox.alert(
													error_msg_prompt,
													'Dupliced User');
										} else {
											rtgapp_store.load(function() {
													});
										}
									},
									failure : extjsUtil.failureMessage
								});
							}// endofselect
						}
					}, '->', removeRtgapp,

					{
						text : panelSRO1133,
						iconCls : 'save',
						disabled : false,
						handler : function() {
							var modifiend = [];
							var rec = grid.getSelectionModel().getSelection()[0];
							var unique_id = rec.get('unique_id');
							for (var i = 0; i < agrid.store.data.items.length; i++) {
								var record = agrid.store.data.items[i];
								if (record.dirty) {
									rtgapp_store.getProxy().setExtraParam(
											'unique_id', vSELECTED_UNIQUE_ID);
									console_log(record);
									var obj = {};
									obj['unique_id'] = record.get('unique_id');// //pcs_code,
																				// pcs_name...
									obj['gubun'] = record.get('gubun');
									obj['owner'] = record.get('owner');
									obj['change_type'] = record
											.get('change_type');
									obj['app_type'] = record.get('app_type');
									obj['usrast_unique_id'] = record
											.get('usrast_unique_id');
									obj['seq'] = record.get('seq');
									obj['updown'] = 0;
									modifiend.push(obj);
								}
							}
							if (modifiend.length > 0) {
								console_log(modifiend);
								var str = Ext.encode(modifiend);
								console_log(str);
								Ext.Ajax.request({
									url : CONTEXT_PATH
											+ '/rtgMgmt/routing.do?method=modifyRtgapp',
									params : {
										modifyIno : str,
										srcahd_uid : unique_id
									},
									success : function(result, request) {
										rtgapp_store.load(function() {
												});
									}
								});
							}
						}
					}]
						// endofitems
				}]
					// endofdockeditems
			}); // endof Ext.create('Ext.grid.Panel',
			agrid.getSelectionModel().on({
						selectionchange : function(sm, selections) {
							if (selections.length) {
								if (fPERM_DISABLING() == true) {
									removeRtgapp.disable();
								} else {
									removeRtgapp.enable();
								}
							} else {
								if (fPERM_DISABLING() == true) {
									collapseProperty();// uncheck no
														// displayProperty
									removeRtgapp.disable();
								} else {
									collapseProperty();// uncheck no
														// displayProperty
									removeRtgapp.disable();
								}
							}
						}
					});
			// form create
			var form = Ext.create('Ext.form.Panel', {
				id : 'formPanel',
				xtype : 'form',
				frame : false,
				border : false,
				bodyPadding : 15,
				region : 'center',
				defaults : {
					anchor : '100%',
					allowBlank : false,
					msgTarget : 'side',
					labelWidth : 60
				},
				items : [new Ext.form.Hidden({
									id : 'hid_userlist_role',
									name : 'hid_userlist_role'
								}), new Ext.form.Hidden({
									id : 'hid_userlist',
									name : 'hid_userlist'
								}), new Ext.form.Hidden({
									id : 'unique_id',
									name : 'unique_id',
									value : unique_id
								}), new Ext.form.Hidden({
									id : 'req_date',
									name : 'req_date'
								}), new Ext.form.Hidden({
									id : 'supplier_uid',
									name : 'supplier_uid'
								}), new Ext.form.Hidden({
									id : 'supplier_name',
									name : 'supplier_name'
								}), agrid, {
							xtype : 'component',
							html : '<br/><hr/><br/>',
							anchor : '100%'
						}, {
							xtype : 'textfield',
							fieldLabel : dbm1_txt_name,
							id : 'txt_name',
							name : 'txt_name',
							value : '[PROJECT]' + pjcode,
							anchor : '100%'
						}, {
							xtype : 'textarea',
							fieldLabel : dbm1_txt_content,
							id : 'txt_content',
							name : 'txt_content',
							value : description + ' 外',
							anchor : '100%'
						}, {
							xtype : 'textarea',
							fieldLabel : sro1_complete_comment,
							id : 'req_info',
							name : 'req_info',
							anchor : '100%'
						}, {
							xtype : 'datefield',
							id : 'request_date',
							name : 'request_date',
							fieldLabel : toolbar_pj_req_date,
							readOnly : true,
							format : 'Y-m-d',
							submitFormat : 'Y-m-d',// 'Y-m-d H:i:s',
							dateFormat : 'Y-m-d',// 'Y-m-d H:i:s'
							value : delivery_plan,
							anchor : '100%'
						}, {
							xtype : 'container',
							// width: 280,
							layout : 'hbox',
							margin : '5 5 5 0',
							items : [{
								xtype : 'checkboxfield',
								id : 'switch',
								labelWidth : 60,
								checked : false,
								// labelAlign: 'right',
								inputValue : '-1',
								width : 80,
								anchor : '95%',
								fieldLabel : getColName('reserved_double5'),
								listeners : {
									change : function(checkbox, checked) {

										var oReserved_double5 = Ext
												.getCmp('reserved_double5');

										if (checked == false) {// 리드온리 세팅
											oReserved_double5.setReadOnly(true);
											oReserved_double5
													.setFieldStyle('background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;');

										} else {
											oReserved_double5
													.setReadOnly(false);
											oReserved_double5
													.setFieldStyle('background-color: #FFFFFF; background-image: none; font-weight:bold; font-size: 11px;');
										}
									}
								}
									// id:'cost_breakdown3'
							}, {
								value : reserved_double5,
								width : 723,
								name : 'reserved_double5',
								id : 'reserved_double5',
								allowBlank : false,
								editable : true,
								readOnly : true,
								fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
								minValue : 0,
								xtype : 'numberfield'
							}]

						}, {
							xtype : 'textfield',
							fieldLabel : getColName('selling_price'),
							id : 'selling_price',
							name : 'selling_price',
							value : selling_price,
							fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;',
							readOnly : true,
							anchor : '100%'

						}]
			});// endof createform
			// window create
			prWin = Ext.create('ModalWindow', {
				title : GET_MULTILANG('sro1_completeAction') + ' :: '
						+ sro1_complete_rtg,
				width : 850,
				height : 500,
				plain : true,
				items : [form],
				buttons : [{
					text : CMD_OK,
					handler : function(btn) {
						var form = Ext.getCmp('formPanel').getForm();
						agrid.getSelectionModel().selectAll();
						var aselections = agrid.getSelectionModel()
								.getSelection();

						if (aselections) {
							for (var i = 0; i < aselections.length; i++) {
								var rec = agrid.getSelectionModel()
										.getSelection()[i];
								ahid_userlist[i] = rec.get('usrast_unique_id');
								console_log("ahid_userlist   :  "
										+ ahid_userlist);
								console_log("ahid_userlist_role   :  "
										+ ahid_userlist);
								ahid_userlist_role[i] = rec.get('gubun');
								console_log("ahid_userlist_role"
										+ ahid_userlist_role);
							}
							Ext.getCmp('hid_userlist').setValue(ahid_userlist);
							Ext.getCmp('hid_userlist_role')
									.setValue(ahid_userlist_role);
						}
						if (form.isValid()) {
							var val = form.getValues(false);
							var rtgast = Ext.ModelManager.create(val, 'RtgAst');
							rtgast.save({
										success : function() {
											console_log('updated');
											if (prWin) {
												prWin.close();
												store.load(function() {
														});
											}
										}
									});
						} else {
							Ext.MessageBox.alert(error_msg_prompt,
									error_msg_content);
						}
					}
				}, {
					text : CMD_CANCEL,
					handler : function() {
						if (prWin) {
							prWin.close();
						}
					}
				}]
			});
			prWin.show();
		});// enof load
	}// endof handlwe
});

// Define Remove Action
var removeAction = Ext.create('Ext.Action', {
			itemId : 'removeButton',
			iconCls : 'remove',
			text : CMD_DELETE,
			disabled : true,
			handler : function(widget, event) {
				Ext.MessageBox.show({
							title : delete_msg_title,
							msg : delete_msg_content,
							buttons : Ext.MessageBox.YESNO,
							fn : deleteConfirm,
							icon : Ext.MessageBox.QUESTION
						});
			}
		});

function createViewForm(projectmold) {
	var pj_code = projectmold.get('pj_code');
	var pj_type = projectmold.get('pj_type');
	var pj_name = projectmold.get('pj_name');
	var pm_name = projectmold.get('pm_name');
	var description = projectmold.get('description');
	var selling_price = projectmold.get('selling_price');
	var quan = projectmold.get('quan');
	var reserved_varchar4 = projectmold.get('reserved_varchar4');
	var customer_name = projectmold.get('customer_name');
	var htmlFileNames = projectmold.get('htmlFileNames');

	var lineGap = 30;
	var form = Ext.create('Ext.form.Panel', {
				id : 'formPanel',
				defaultType : 'displayfield',
				border : false,
				bodyPadding : 15,
				height : 650,
				// bodyPadding: 5,
				defaults : {
					anchor : '100%',
					allowBlank : false,
					msgTarget : 'side',
					labelWidth : 100
				},
				items : [{
							fieldLabel : getColName('pj_code'),
							value : pj_code,
							x : 5,
							y : 0 + 1 * lineGap,
							name : 'pj_code'
						}, {
							fieldLabel : getColName('order_com_unique'),
							value : customer_name,
							x : 5,
							y : 0 + 2 * lineGap,
							name : 'order_com_unique',
							anchor : '-5' // anchor width by percentage
						}, {
							fieldLabel : getColName('pj_type'),
							value : pj_type,
							x : 5,
							y : 0 + 3 * lineGap,
							name : 'pj_type',
							anchor : '-5' // anchor width by percentage
						}, {
							fieldLabel : getColName('description'),
							value : description,
							x : 5,
							y : 0 + 4 * lineGap,
							name : 'description',
							id : 'description',
							anchor : '-5' // anchor width by percentage
						}, {
							fieldLabel : getColName('pj_name'),
							value : pj_name,
							x : 5,
							y : 0 + 5 * lineGap,
							name : 'pj_name',
							anchor : '-5' // anchor width by percentage
						}, {
							fieldLabel : getColName('selling_price'),
							value : selling_price,
							x : 5,
							y : 0 + 6 * lineGap,
							name : 'selling_price',
							anchor : '-5' // anchor width by percentage
						}, {
							fieldLabel : getColName('pm_name'),
							value : pm_name,
							x : 5,
							y : 0 + 7 * lineGap,
							name : 'pm_name',
							anchor : '-5' // anchor width by percentage
						}, {
							fieldLabel : getColName('quan'),
							value : quan,
							x : 5,
							y : 0 + 8 * lineGap,
							name : 'quan',
							anchor : '-5' // anchor width by percentage
						}, {
							fieldLabel : getColName('reserved_varchar4'),
							value : reserved_varchar4,
							x : 5,
							y : 0 + 9 * lineGap,
							name : 'reserved_varchar4',
							anchor : '-5' // anchor width by percentage
						}, {
							fieldLabel : getColName('htmlFileNames'),
							value : htmlFileNames,
							x : 5,
							y : 0 + 9 * lineGap,
							name : 'htmlFileNames',
							anchor : '-5' // anchor width by percentage
						}]
			}); // endof form

	return form;
}

function createEditForm(projectmold, attachedFileStore) {
	var unique_id = projectmold.get('unique_id');
	var order_com_unique = projectmold.get('order_com_unique');
	var pj_type = projectmold.get('pj_type');
	var pj_code = projectmold.get('pj_code');
	var pj_name = projectmold.get('pj_name');
	var pm_id = projectmold.get('pm_id');
	var regist_date = projectmold.get('regist_date');
	var delivery_plan = projectmold.get('delivery_plan');
	var description = projectmold.get('description');
	var selling_price = projectmold.get('selling_price');
	var cav_no = projectmold.get('cav_no');
	var resine_color = projectmold.get('resine_color');
	var surface_art = projectmold.get('surface_art');
	var customer_name = projectmold.get('customer_name');
	var reserved_varchar5 = projectmold.get('reserved_varchar5');
	var newmodcont = projectmold.get('newmodcont');
	var mold_type = projectmold.get('mold_type');
	var asset_number = projectmold.get('asset_number');
	var water_gap_weight = projectmold.get('water_gap_weight');
	var produce_mold_date = projectmold.get('produce_mold_date');
	var irrigate_name = projectmold.get('irrigate_name');
	var due_t1_date = projectmold.get('due_t1_date');
	var due_shaping_period = projectmold.get('due_shaping_period');

	function date(date) {
		if (date == null) {
			return '';
		}
		return date.substring(0, 10);
	}
	buyerStore['cmpName'] = 'order_com_unique'; // combo name

	var myItems = [];
	myItems.push({
		xtype : 'textfield',
		flex : 1,
		name : 'pj_code',
		id : 'pj_code',
		fieldLabel : getColName('pj_code'),
		value : pj_code,
		displayField : "title",
		readOnly : true,
		fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
	});
	myItems.push({
		fieldLabel : getColName('order_com_unique'),
		xtype : 'textfield',
		flex : 1,
		value : customer_name,
		displayField : "title",
		readOnly : true,
		fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
	});
	myItems.push({
		fieldLabel : getColName('description'),
		value : description,
		name : 'description',
		readOnly : true,
		type : 'textfield',
		fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
	});
	myItems.push({
		fieldLabel : getColName('regist_date'),
		name : 'regist_date',
		value : date(regist_date),
		dateFormat : 'Y-m-d',// 'Y-m-d H:i:s'
		readOnly : true,
		fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
	});
	myItems.push({
				fieldLabel : getColName('selling_price'),
				value : selling_price,
				name : 'selling_price',
				allowBlank : false,
				minValue : 0,
				type : 'numberfield'
			});
	myItems.push({
				fieldLabel : getColName('resine_color'),
				value : resine_color,
				name : 'resine_color',
				type : 'textfield'
			});
	myItems.push({
				fieldLabel : getColName('surface_art'),
				value : surface_art,
				name : 'surface_art',
				type : 'textfield'
			});
	myItems.push({
				xtype : 'combo',
				mode : 'local',
				value : 'JS0000CN',
				triggerAction : 'all',
				forceSelection : true,
				editable : false,
				allowBlank : false,
				fieldLabel : getColName('reserved_varchar4'),
				name : 'reserved_varchar4',
				displayField : 'name',
				valueField : 'value',
				queryMode : 'local',
				store : Ext.create('Ext.data.Store', {
							fields : ['name', 'value'],
							data : [{
										name : pp_firstBu,
										value : 'JS0000CN'
									}]
						})
			});

	myItems.push({
				fieldLabel : getColName('asset_number'),
				value : asset_number,
				name : 'asset_number',
				type : 'textfield'
			});

	myItems.push({
				fieldLabel : getColName('water_gap_weight'),
				value : water_gap_weight,
				name : 'water_gap_weight',
				type : 'textfield'
			});

	new Ext.form.Hidden({
				id : 'irrigate_name',
				name : 'irrigate_name'
			});

	myItems.push({
				fieldLabel : getColName('irrigate_type'),
				x : 5,
				y : 0 + 2 * lineGap,
				id : 'irrigate_type',
				name : 'irrigate_type',
				xtype : 'combo',
				value : irrigate_name,
				mode : 'local',
				editable : false,
				queryMode : 'remote',
				displayField : 'codeName',
				valueField : 'systemCode',
				store : irrigateTypeCodeStore,
				listConfig : {
					getInnerTpl : function() {
						return '<div data-qtip="{codeName}">{codeName}</div>';
					}
				},

				listeners : {
					select : function(combo, record) {
						console_log('Selected Value : ' + combo.getValue());
						var systemCode = record[0].get('systemCode');
						var codeNameEn = record[0].get('codeNameEn');
						var codeName = record[0].get('codeName');

						Ext.getCmp('gate_name').setValue(codeName);
						console_log('systemCode : ' + systemCode
								+ ', codeNameEn=' + codeNameEn + ', codeName='
								+ codeName);
					}
				}
			});

	myItems.push({
		xtype : 'textfield',
		fieldLabel : getColName('newmodcont'),
		name : 'newmodcont',
		id : 'newmodcont',
		value : newmodcont,
		readOnly : true,
		fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
	});

	var checkboxItem = [];
	attachedFileStore.each(function(record) {
				console_log(record);
				console_log('----------------------------------------------');
				console_log(record.get('object_name'));
				console_log(record.get('id'));
				console_log(record.get('group_code'));
				console_log(record.get('file_path'));
				console_log(record.get('file_size'));
				console_log(record.get('fileobject_uid'));
				console_log(record.get('file_ext'));

				checkboxItem.push({
							xtype : 'checkboxfield',
							name : 'deleteFiles',
							boxLabel : record.get('object_name') + '('
									+ record.get('file_size') + ')',
							checked : false,
							inputValue : record.get('id')
						});
			});

	if (checkboxItem.length > 0) {

		myItems.push({
					xtype : 'checkboxgroup',
					allowBlank : true,
					fieldLabel : 'Check to Delete',
					items : checkboxItem
				});
	}

	myItems.push({
				xtype : 'filefield',
				emptyText : panelSRO1149,
				buttonText : 'upload',
				fieldLabel : getColName('file_itemcode'),
				allowBlank : true,
				buttonConfig : {
					iconCls : 'upload-icon'
				}
			});

	var form = Ext.create('Ext.form.Panel', {
		id : 'formPanel',
		xtype : 'form',
		frame : false,
		bodyPadding : '3 3 0',
		width : 800,
		fieldDefaults : {
			labelAlign : 'middle',
			msgTarget : 'side'
		},
		defaults : {
			anchor : '100%'
		},
		items : [new Ext.form.Hidden({
							id : 'srch_type',
							name : 'srch_type',
							value : 'update'
						}), new Ext.form.Hidden({
							id : 'order_com_unique',
							name : 'order_com_unique',
							value : order_com_unique
						}), {
					xtype : 'fieldset',
					title : panelSRO1002,
					collapsible : true,
					defaultType : 'textfield',
					layout : 'anchor',
					defaults : {
						anchor : '100%'
					},
					items : [{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'container',
									flex : 1,
									border : false,
									layout : 'anchor',
									defaultType : 'textfield',
									defaults : {
										labelWidth : 90,
										labelAlign : 'right',
										anchor : '95%'
									},
									items : myItems
								}, { // ---------------------------------------------------두번째
										// 컬럼
									xtype : 'container',
									flex : 1,
									layout : 'anchor',
									defaultType : 'textfield',
									defaults : {
										labelWidth : 90,
										labelAlign : 'right',
										anchor : '95%'
									},
									items : [{

										xtype : 'textfield',
										flex : 1,
										name : 'unique_id',
										id : 'unique_id',
										fieldLabel : 'UID',
										value : unique_id,
										displayField : "title",
										readOnly : true,
										fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
									}, {
										fieldLabel : getColName('pj_type'),
										id : 'pj_type',
										name : 'pj_type',
										xtype : 'combo',
										value : pj_type,
										mode : 'local',
										editable : false,
										queryMode : 'remote',
										displayField : 'codeName',
										valueField : 'systemCode',
										store : productCodeStore,
										listConfig : {
											getInnerTpl : function() {
												return '<div data-qtip="{codeName}">[{systemCode}] {codeName} / {codeNameEn}</div>';
											}
										}
									}, {
										fieldLabel : getColName('pj_name'),
										id : 'pj_name',
										name : 'pj_name',
										value : pj_name,
										xtype : 'combo',
										mode : 'local',
										editable : false,
										allowBlank : false,
										displayField : 'item_name',
										valueField : 'unique_id',
										store : itemStore,
										listConfig : {
											getInnerTpl : function() {
												return '<div data-qtip="{unique_id}">{item_name} / {cavity} / {model_size}</div>';
											}
										},
										listeners : {
											select : function(combo, record) {
												var model_size = record[0]
														.get('model_size');
												var cavity = record[0]
														.get('cavity');
												var item_name = record[0]
														.get('item_name');
												var Rev = cavity
														.substring(0, 1);
												var Cavity = cavity.substring(
														2, 3);
												var Family = cavity.substring(
														4, 6);
												Ext.getCmp('mold_type')
														.setValue(model_size);
												Ext.getCmp('Rev').setValue(Rev);
												Ext.getCmp('Cavity')
														.setValue(Cavity);
												Ext.getCmp('Family')
														.setValue(Family);
												Ext.getCmp('pj_name')
														.setValue(item_name);
											}
										}
									}, {
										fieldLabel : getColName('delivery_plan'),
										name : 'delivery_plan',
										id : 'delivery_plan',
										format : 'Y-m-d',
										submitFormat : 'Y-m-d',// 'Y-m-d
																// H:i:s',
										dateFormat : 'Y-m-d',// 'Y-m-d H:i:s'
										allowBlank : false,
										value : date(delivery_plan),
										xtype : 'datefield'
									}, {
										fieldLabel : getColName('pm_id'),
										xtype : 'textfield',
										flex : 1,
										value : pm_id,
										name : 'pm_id',
										displayField : "title",
										readOnly : true,
										fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
									}, {
										xtype : 'fieldcontainer',
										fieldLabel : getColName('cav_no'),
										combineErrors : true,
										msgTarget : 'side',
										layout : 'hbox',
										defaults : {
											flex : 1,
											hideLabel : true
										},
										items : [{
													xtype : 'numberfield',
													name : 'Rev',
													id : 'Rev',
													fieldLabel : 'Rev',
													minValue : 1,
													margin : '0 5 0 0'
												}, {
													xtype : 'numberfield',
													name : 'Cavity',
													id : 'Cavity',
													fieldLabel : 'Cavity',
													minValue : 0
												}, {
													xtype : 'numberfield',
													name : 'Family',
													id : 'Family',
													fieldLabel : 'Family',
													minValue : 1
												}, {
													xtype : 'textfield',
													name : 'cav_no',
													id : 'cav_no',
													value : cav_no,
													readOnly : true,
													fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
												}, {
													xtype : 'button',
													name : 'button',
													style : 'background-color: green',
													width : 5,
													height : 5,
													minWidth : 20,
													minHeight : 20,
													text : CMD_OK,
													readyOnly : true,
													handler : function() {
														var rev = Ext
																.getCmp('Rev')
																.getValue();
														var cavity = Ext
																.getCmp('Cavity')
																.getValue();
														var family = Ext
																.getCmp('Family')
																.getValue();
														Ext
																.getCmp('cav_no')
																.setValue(rev
																		+ "*"
																		+ cavity
																		+ "*"
																		+ family);
														if (rev == null
																|| cavity == null
																|| family == null) {
															Ext.MessageBox
																	.alert(
																			error_msg_prompt,
																			error_msg_content);
														}
													}
												}]
									}, {
										xtype : 'combo',
										mode : 'local',
										triggerAction : 'all',
										editable : false,
										allowBlank : false,
										fieldLabel : getColName('mold_type'),
										name : 'mold_type',
										id : 'mold_type',
										value : mold_type,
										displayField : 'value',
										valueField : 'name',
										queryMode : 'local',
										store : Ext.create('Ext.data.Store', {
													fields : ['name', 'value'],
													data : [{
																name : small_size,
																value : panelSRO1202
															}, {
																name : medium_size,
																value : panelSRO1203
															}]
												})
									}, {
										fieldLabel : getColName('produce_mold_date'),
										value : date(produce_mold_date),
										name : 'produce_mold_date',
										type : 'textfield'
									},

									{
										fieldLabel : getColName('due_t1_date'),
										value : date(due_t1_date),
										name : 'due_t1_date',
										type : 'textfield'
									}, {
										fieldLabel : getColName('due_shaping_period'),
										value : due_shaping_period,
										name : 'due_shaping_period',
										type : 'textfield'
									}, {
										xtype : 'textarea',
										fieldLabel : getColName('reserved_varchar5'),
										name : 'reserved_varchar5',
										id : 'reserved_varchar5',
										value : reserved_varchar5,
										readOnly : false
									}]
								}]
					}]
				}]
	});
	return form;
}

var viewHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];

	var unique_id = rec.get('unique_id');
	ProjectMold.load(unique_id, {
				success : function(projectmold) {
					uploadStore = getUploadStore(unique_id);
					uploadStore.load(function() {
								console_log('uploadStore.load ok');
								console_log(uploadStore);
								uploadStore.each(function(record) {
											console_log(record
													.get('object_name'));
										});

								var win = Ext.create('ModalWindow', {
											title : CMD_VIEW + ' :: '
													+ /* (G) */vCUR_MENU_NAME,
											width : 500,
											height : 380,
											minWidth : 250,
											minHeight : 180,
											layout : 'absolute',
											plain : true,
											items : createViewForm(projectmold),
											buttons : [{
														text : CMD_OK,
														handler : function() {
															if (win) {
																win.close();
															}
														}
													}]
										});
								win.show();

							});
				}// endofsuccess
			});// emdofload
};

var editHandler = function() {
	/* (G) */vFILE_ITEM_CODE = RandomString(10);

	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {
				group_code : unique_id
			});
	attachedFileStore.load(function() {
		console_log('attachedFileStore.load ok');

		ProjectMold.load(unique_id, {
			success : function(projectmold) {
				var win = Ext.create('ModalWindow', {
					title : CMD_MODIFY + ' :: ' + /* (G) */vCUR_MENU_NAME,
					width : 800,
					height : 500,
					minWidth : 250,
					minHeight : 180,
					layout : 'fit',
					plain : true,
					items : createEditForm(projectmold, attachedFileStore),
					buttons : [{
						text : CMD_OK,
						handler : function() {
							var form = Ext.getCmp('formPanel').getForm();
							if (form.isValid()) {
								var val = form.getValues(false);

								var projectmold = Ext.ModelManager.create(val,
										'ProjectMold');
								projectmold.set('file_itemcode',
										vFILE_ITEM_CODE);

								form.submit({
									url : CONTEXT_PATH
											+ '/uploader.do?method=multi&file_itemcode='
											+ /* (G) */vFILE_ITEM_CODE,
									waitMsg : 'Uploading Files...',
									success : function(fp, o) {
										// 저장 수정
										projectmold.save({
													success : function() {
														if (win) {
															win.close();
															store.load(
																	function() {
																	});

														}
													}
												});

										if (win) {
											win.close();
										}
									},
									failure : function() {
										console_log('failure');
										Ext.MessageBox.alert(error_msg_prompt,
												'Failed');
									}
								});
							} else {
								Ext.MessageBox.alert(error_msg_prompt,
										error_msg_content);
							}

						}
					}, {
						text : CMD_CANCEL,
						handler : function() {
							if (win) {
								win.close();
							}
						}
					}]
				});
				win.show();
			}
		});// emdofload
	});
};

function simpleProperty(record, fields) {
	console_log('displayProperty');
	console_log(record);
	var source = {};
	var propertyNames = {};
	var sourceD = {};
	var propertyNamesD = {};
	var sourceP = {};
	var propertyNamesP = {};

	// console_log(/*(G)*/vCENTER_FIELDS)
	if (fields == null) {
		fields = vCENTER_FIELDS;
	};

	Ext.each(/* (G) */fields, function(column, index) {
				// console_log(index);
				var columnName = column['text'];
				var dataIndex = column['name'];
				var sortable = column['sort'];
				if (dataIndex != 'srch_type' && dataIndex != 'file_itemcode'
						&& dataIndex != 'htmlFileNames'
						&& dataIndex != 'fileQty'
						&& dataIndex != 'htmlUser_type'
						&& (dataIndex != 'board_name') // 예외
						&& (dataIndex != 'board_content')// 예외
				) {
					if (dataIndex == 'regist_date'
							|| dataIndex == 'delivery_plan'
							|| dataIndex == 'start_plan'
							|| dataIndex == 'reserved_timestamp1'
							|| dataIndex == 'end_plan'
							|| dataIndex == 'end_date' ||
							// dataIndex == 'start_date' ||
							dataIndex == 'delivery_date') {

						// if(dataIndex == 'dataIndex'){
						// console_log('columnName:dataIndex=' + columnName +
						// ":" + dataIndex);
						var columnValue = 'not-found';
						// try {
						columnValue = record.get(dataIndex);
						// } catch(e){ console_log(e); }
						// console_log('columnValue='+columnValue);
						if (columnValue == '1111/11/11') {
							columnValue = '';
						}
						sourceD[dataIndex] = columnValue;
						propertyNamesD[dataIndex] = columnName;

					}

					if (dataIndex == 'selling_price'
							|| dataIndex == 'reserved_double1'
							|| dataIndex == 'human_plan'
							|| dataIndex == 'total_mhplan'
							|| dataIndex == 'total_resource'
							|| dataIndex == 'left_mh'
							|| dataIndex == 'purchase_plan'
							|| dataIndex == 'purchase_cost'
							|| dataIndex == 'left_cost'
							|| dataIndex == 'human_cost'
							|| dataIndex == 'reserved_double3'
							|| dataIndex == 'reserved_double5'
							|| dataIndex == 'total_cost') {

						// if(dataIndex == 'dataIndex'){
						// console_log('columnName:dataIndex=' + columnName +
						// ":" + dataIndex);
						var columnValue = 'not-found';
						// try {
						columnValue = record.get(dataIndex);
						// } catch(e){ console_log(e); }
						// console_log('columnValue='+columnValue);

						sourceP[dataIndex] = columnValue;
						if (dataIndex == 'reserved_double3') {
							sourceP[dataIndex] = columnValue + '%';
						}
						propertyNamesP[dataIndex] = columnName;

					}
					if (dataIndex == 'order_com_unique'
							|| dataIndex == 'creator'
							|| dataIndex == 'create_date'
							|| dataIndex == 'changer'
							|| dataIndex == 'change_date'
							|| dataIndex == 'pj_code_dash'
							|| dataIndex == 'description'
							|| dataIndex == 'pj_name' || dataIndex == 'pj_type'
							|| dataIndex == 'pl_id'
							|| dataIndex == 'reserved_varchar2'
							|| dataIndex == 'pm_name' || dataIndex == 'pl_name'
							|| dataIndex == 'reserved_varchar3'
							|| dataIndex == 'wa_code' || dataIndex == 'wa_name'
							|| dataIndex == 'is_complished'
							|| dataIndex == 'newmodcont') {
						// console_log('columnName:dataIndex=' + columnName +
						// ":" + dataIndex);
						var columnValue = 'not-found';
						// try {
						columnValue = record.get(dataIndex);
						// } catch(e){ console_log(e); }
						// console_log('columnValue='+columnValue);
						source[dataIndex] = columnValue;
						propertyNames[dataIndex] = columnName;
						// groups[groupName] = 'page';

						if (dataIndex == 'unique_id') {
							vSELECTED_UNIQUE_ID = columnValue;
							// console_log('vSELECTED_UNIQUE_ID='+vSELECTED_UNIQUE_ID);
						}
					}
					// Global Setting
					// if(vCUR_MENU_CODE=='EPC8' && dataIndex=='pcs_name') {
					// vSELECTED_PCSCODE = columnValue;
					// }
					// if(vCUR_MENU_CODE=='EPC7' && dataIndex=='pcs_name') {
					// vSELECTED_PCSCODE = columnValue;
					// }
					// }
				}

			});

	// Ext.get('mainview-property-panel').set({tabIndex:0});
	setActiveTabByTitle('mainview-property-panel-div');

	// Ext.get('propertyDiv').update('');
	var propGrid = Ext.create('Ext.grid.property.Grid', {
		// renderTo: 'propertyDiv',
		propertyNames : propertyNames,
		source : source

			/*
			 * , listeners : { beforeedit : function(e) { return false; } }
			 */
		});
	var propGridD = Ext.create('Ext.grid.property.Grid', {
		// renderTo: 'propertyDiv',
		propertyNames : propertyNamesD,
		source : sourceD
			/*
			 * , listeners : { beforeedit : function(e) { return false; } }
			 */
		});
	var propGridP = Ext.create('Ext.grid.property.Grid', {
		// renderTo: 'propertyDiv',
		propertyNames : propertyNamesP,
		source : sourceP,
		sortable : false
			/*
			 * , listeners : { beforeedit : function(e) { return false; } }
			 */
		});

	var ptarget = Ext.getCmp('project-property-panel-div');
	ptarget.removeAll();
	ptarget.add(propGrid);
	ptarget.doLayout();

	var ptargetP = Ext.getCmp('projectP-property-panel-div');
	ptargetP.removeAll();
	ptargetP.add(propGridP);
	ptargetP.doLayout();

	var ptargetD = Ext.getCmp('projectD-property-panel-div');
	ptargetD.removeAll();
	ptargetD.add(propGridD);
	ptargetD.doLayout();

	var w = Ext.getCmp("project-property-panel");
	w.expand();
	// w.toggleCollapse(true);
}

function deleteRtgappConfirm(btn) {

	var selections = agrid.getSelectionModel().getSelection();
	if (selections) {
		var result = MessageBox.msg('{0}', btn);
		if (result == 'yes') {
			for (var i = 0; i < selections.length; i++) {
				var rec = agrid.getSelectionModel().getSelection()[i];
				var unique_id = rec.get('unique_id');
				var rtgapp = Ext.ModelManager.create({
							unique_id : unique_id
						}, 'RtgApp');

				rtgapp.destroy({
							success : function() {
							}
						});
			}
			agrid.store.remove(selections);
		}
	}
};

var removeRtgapp = Ext.create('Ext.Action', {
			itemId : 'removeButton',
			iconCls : 'remove',
			text : CMD_DELETE,
			disabled : true,
			handler : function(widget, event) {
				Ext.MessageBox.show({
							title : delete_msg_title,
							msg : delete_msg_content,
							buttons : Ext.MessageBox.YESNO,
							fn : deleteRtgappConfirm,
							icon : Ext.MessageBox.QUESTION
						});
			}
		});

var updown = {
	text : Position,
	menuDisabled : true,
	sortable : false,
	xtype : 'actioncolumn',
	width : 60,
	items : [{
		icon : CONTEXT_PATH + '/extjs/shared/icons/fam/grid_up.png', // Use a
																		// URL
																		// in
																		// the
																		// icon
																		// config
		tooltip : 'Up',
		handler : function(agridV, rowIndex, colIndex) {
			var record = agrid.getStore().getAt(rowIndex);
			console_log(record);
			var unique_id = record.get('unique_id');
			console_log(unique_id);
			var direcition = -15;
			Ext.Ajax.request({
						url : CONTEXT_PATH
								+ '/rtgMgmt/routing.do?method=moveRtgappDyna',
						params : {
							direcition : direcition,
							unique_id : unique_id
						},
						success : function(result, request) {
							rtgapp_store.load(function() {
									});
						}
					});
		}
	}, {
		icon : CONTEXT_PATH + '/extjs/shared/icons/fam/grid_down.png', // Use a
																		// URL
																		// in
																		// the
																		// icon
																		// config
		tooltip : 'Down',
		handler : function(agrid, rowIndex, colIndex) {

			var record = agrid.getStore().getAt(rowIndex);
			console_log(record);
			var unique_id = record.get('unique_id');
			console_log(unique_id);
			var direcition = 15;
			Ext.Ajax.request({
						url : CONTEXT_PATH
								+ '/rtgMgmt/routing.do?method=moveRtgappDyna',
						params : {
							direcition : direcition,
							unique_id : unique_id
						},
						success : function(result, request) {
							rtgapp_store.load(function() {
									});
						}
					});
		}
	}]
};

// Define Add Action - New Mold
var addActionNew = Ext.create('Ext.Action', {
	text : sro1_newmold,// 'Major Fields | Current Rows',
	iconCls : 'brick_add',
	disabled : fPERM_DISABLING(),
	handler : function(widget, event) {

		buyerStore['cmpName'] = 'order_com_unique'; // combo name
		var order_com_unique = getSearchObject_('order_com_unique').getValue();
		var pj_type = getSearchObject('pj_type').getValue();
		var model_uid = getSearchObject('model_uid').getValue();
		var from_type = getSearchObject('from_type').getValue();
		var description = getSearchObject('description').getValue();
		if (order_com_unique == null || order_com_unique == '') {
			Ext.MessageBox.alert(sro1_warning_msg, sro1_company_msg, callBack);
			function callBack(id) {
				return
			}
			return;
		}

		if (pj_type == null || pj_type == '') {
			Ext.MessageBox.alert(sro1_warning_msg, sro1_select_product,
					callBack);
			function callBack(id) {
				return
			}
			return;
		}

		if (model_uid == null || model_uid == '' || model_uid == '-1') {
			Ext.MessageBox.alert(sro1_warning_msg, sro1_select_model, callBack);
			function callBack(id) {
				return
			}
			return;
		}

		if (from_type == null || from_type == '') {
			Ext.MessageBox.alert(sro1_warning_msg, sro1_select_moldtype,
					callBack);
			function callBack(id) {
				return
			}
			return;
		}

		console_log('-----------add action---------');
		console_log(order_com_unique);
		console_log(pj_type);
		console_log(from_type);
		console_log(description);

		buyerStore['cmpName'] = 'order_com_unique'; // combo name
		var tempColumn = [];

		tempColumn.push(updown);
		for (var i = 0; i < vCENTER_COLUMN_SUB.length; i++) {
			tempColumn.push(vCENTER_COLUMN_SUB[i]);
		}

		var storeSrch = null;
		storeSrch = Ext.create('Mplm.store.UserStore', {
					hasNull : true
				});
		storeSrch['cmpName'] = 'user';
		rtgapp_store.load(function() {
			Ext.each( /* (G) */tempColumn, function(columnObj, index, value) {
				var dataIndex = columnObj["dataIndex"];
				columnObj["flex"] = 1;

				if (value != "W") {
					if ('gubun' == dataIndex) {
						var combo = null;
						var comboBoxRenderer = function(value, p, record) {
							if (value == 'W') {
							} else {
								console_log('combo.valueField = '
										+ combo.valueField + ', value=' + value);
								console_log(combo.store);
								var idx = combo.store.find(combo.valueField,
										value);
								console_log(idx);
								var rec = combo.store.getAt(idx);
								console_log(rec);
								return (rec === null ? '' : rec
										.get(combo.displayField));
							}
						};

						combo = new Ext.form.field.ComboBox({
									typeAhead : true,
									triggerAction : 'all',
									selectOnTab : true,
									mode : 'local',
									queryMode : 'remote',
									editable : false,
									allowBlank : false,
									displayField : 'codeName',
									valueField : 'systemCode',
									store : routeGubunTypeStore,
									listClass : 'x-combo-list-small',
									listeners : {}
								});
						columnObj["editor"] = combo;
						columnObj["renderer"] = function(value, p, record,
								rowIndex, colIndex, store) {
							p.tdAttr = 'style="background-color: #FFE4E4;"';
							return value;
						};
					}
				}
			});

			agrid = Ext.create('Ext.grid.Panel', {
				title : routing_path,
				store : rtgapp_store,
				layout : 'fit',
				columns : tempColumn,
				plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 1
						})],
				border : false,
				multiSelect : true,
				frame : false,
				dockedItems : [{
					xtype : 'toolbar',
					items : [{
						fieldLabel : dbm1_array_add,
						labelWidth : 42,
						id : 'user',
						name : 'user',
						xtype : 'combo',
						fieldStyle : 'background-color: #FBF8E6; background-image: none;',
						store : storeSrch,
						labelSeparator : ':',
						emptyText : dbm1_name_input,
						displayField : 'user_name',
						valueField : 'unique_id',
						sortInfo : {
							field : 'user_name',
							direction : 'ASC'
						},
						typeAhead : false,
						hideLabel : true,
						minChars : 1,
						width : 230,
						listConfig : {
							loadingText : 'Searching...',
							emptyText : 'No matching posts found.',
							getInnerTpl : function() {
								return '<div data-qtip="{unique_id}">{user_name}|{dept_name}</div>';
							}
						},
						listeners : {
							select : function(combo, record) {
								console_log('Selected Value : '
										+ record[0].get('unique_id'));
								var unique_id = record[0].get('unique_id');
								var user_id = record[0].get('user_id');
								Ext.Ajax.request({
									url : CONTEXT_PATH
											+ '/rtgMgmt/routing.do?method=createRtgappDyna',
									params : {
										useruid : unique_id,
										userid : user_id,
										gubun : 'D'
									},
									success : function(result, request) {
										var result = result.responseText;
										console_log('result:' + result);
										if (result == 'false') {
											Ext.MessageBox.alert(
													error_msg_prompt,
													error_msg_content);
										} else {
											rtgapp_store.load(function() {
													});
										}
									},
									failure : extjsUtil.failureMessage
								});
							}// endofselect
						}
					}, '->', removeRtgapp, {
						text : panelSRO1133,
						iconCls : 'save',
						disabled : false,
						handler : function() {
							var modifiend = [];
							var rec = grid.getSelectionModel().getSelection()[0];
							var unique_id = rec.get('unique_id');
							for (var i = 0; i < agrid.store.data.items.length; i++) {
								var record = agrid.store.data.items[i];
								if (record.dirty) {
									rtgapp_store.getProxy().setExtraParam(
											'unique_id', vSELECTED_UNIQUE_ID);
									console_log(record);
									var obj = {};
									obj['unique_id'] = record.get('unique_id');// //pcs_code,
																				// pcs_name...
									obj['gubun'] = record.get('gubun');
									obj['owner'] = record.get('owner');
									obj['change_type'] = record
											.get('change_type');
									obj['app_type'] = record.get('app_type');
									obj['usrast_unique_id'] = record
											.get('usrast_unique_id');
									obj['seq'] = record.get('seq');
									obj['updown'] = 0;
									modifiend.push(obj);
								}
							}

							if (modifiend.length > 0) {

								console_log(modifiend);
								var str = Ext.encode(modifiend);
								console_log(str);

								Ext.Ajax.request({
									url : CONTEXT_PATH
											+ '/rtgMgmt/routing.do?method=modifyRtgapp',
									params : {
										modifyIno : str,
										srcahd_uid : unique_id
									},
									success : function(result, request) {
										rtgapp_store.load(function() {
												});
									}
								});
							}
						}
					}]
						// endofitems
				}]
					// endofdockeditems
			}); // endof Ext.create('Ext.grid.Panel',

			agrid.getSelectionModel().on({
						selectionchange : function(sm, selections) {
							if (selections.length) {
								if (fPERM_DISABLING() == true) {
									removeRtgapp.disable();
								} else {
									removeRtgapp.enable();
								}
							} else {
								if (fPERM_DISABLING() == true) {
									collapseProperty();// uncheck no
														// displayProperty
									removeRtgapp.disable();
								} else {
									collapseProperty();// uncheck no
														// displayProperty
									removeRtgapp.disable();
								}
							}
						}
					}); // endof Ext.create('Ext.grid.Panel',

			storeSrch = Ext.create('Mplm.store.UserStore', {
						hasNull : true
					});
			storeSrch['cmpName'] = 'user_name';
			var checkflag = 0;
			var form = Ext.create('Ext.form.Panel', {
				id : 'formPanel',
				xtype : 'form',
				frame : false,
				bodyPadding : '3 3 0',
				width : 800,
				autoHeight : true,
				fieldDefaults : {
					labelAlign : 'middle',
					msgTarget : 'side'
				},
				defaults : {
					anchor : '100%',
					labelWidth : 100
				},
				items : [/* pj_name_hidden,화면두번띄우면 에러 */
						new Ext.form.Hidden({
									id : 'pj_name',
									name : 'pj_name'
								}), new Ext.form.Hidden({
									id : 'newmodcont',
									name : 'newmodcont',
									value : 'N'
								}), new Ext.form.Hidden({
									id : 'hid_userlist_role',
									name : 'hid_userlist_role'
								}), new Ext.form.Hidden({
									id : 'hid_userlist',
									name : 'hid_userlist'
								}), {
							xtype : 'fieldset',
							title : aus7_approval,
							collapsible : true,
							defaults : {
								labelWidth : 89,
								anchor : '100%',
								labelAlign : 'right',
								layout : {
									type : 'hbox',
									defaultMargins : {
										top : 0,
										right : 5,
										bottom : 0,
										left : 0
									}
								}
							},
							items : [agrid]
						}, {
							xtype : 'fieldset',
							title : panelSRO1045,
							collapsible : true,
							defaults : {
								labelWidth : 89,
								anchor : '100%',
								labelAlign : 'right',
								layout : {
									type : 'hbox',
									defaultMargins : {
										top : 0,
										right : 5,
										bottom : 0,
										left : 0
									}
								}
							},
							items : [{
								xtype : 'fieldcontainer',
								combineErrors : false,
								defaults : {
									hideLabel : true
								},
								items : [{
											xtype : 'displayfield',
											value : panelSRO1195 + ':'
										}, {
											// the width of this field in the
											// HBox layout is set directly
											// the other 2 items are given flex:
											// 1, so will share the rest of the
											// space
											width : 50,
											xtype : 'combo',
											mode : 'local',
											id : 'choice_one',
											value : 'A',
											triggerAction : 'all',
											forceSelection : true,
											editable : false,
											name : 'choice_one',
											displayField : 'name',
											valueField : 'value',
											width : 70,
											queryMode : 'local',
											handler : function() {
												Ext.getCmp("choice_one");
											},
											listeners : {
												select : function(combo, record) {
													var obj = Ext
															.getCmp('pj_code');
													obj.reset();
												}
											},
											store : Ext.create(
													'Ext.data.Store', {
														fields : ['name',
																'value'],
														data : [{
																	name : 'A:上角',
																	value : 'A'
																}, {
																	name : 'B:上沙',
																	value : 'B'
																}, {
																	name : 'C:乌沙',
																	value : 'C'
																}]
													})
										}, {
											xtype : 'displayfield',
											value : panelSRO1197
										}, {
											xtype : 'textfield',
											name : 'from_type',
											id : 'from_type',
											fieldLabel : panelSRO1172,
											width : 30,
											value : from_type,
											readOnly : true,
											fieldStyle : 'background-color: #E7EEF6; background-image: none;',
											allowBlank : false
										}, {
											xtype : 'displayfield',
											value : panelSRO1196
										}, {
											name : 'year',
											xtype : 'numberfield',
											id : 'year',
											width : 48,
											value : Towlength_year,
											minValue : 0,
											allowBlank : false
										}, {
											xtype : 'displayfield',
											value : panelSRO1198
										}, {
											xtype : 'textfield',
											name : 'version',
											fieldLabel : panelSRO1172,
											width : 30,
											id : 'version',
											value : '00',
											readOnly : true,
											fieldStyle : 'background-color: #E7EEF6; background-image: none;',
											allowBlank : false
										}, {
											xtype : 'displayfield',
											value : panelSRO1199
										}, {
											xtype : 'checkbox',
											handler : function(checkbox,
													checked) {
												if (checked) {
													/*
													 * var pj_code =
													 * Ext.getCmp('pj_code').getValue();
													 * Ext.getCmp('pj_code1').setValue(Cpj_code(pj_code));
													 */
													checkflag = 1;
													var ChoiceOne = Ext
															.getCmp('choice_one')
															.getValue();
													var Year = Ext
															.getCmp('year')
															.getValue();
													var from_type = Ext
															.getCmp('from_type')
															.getValue();

													Ext.Ajax.request({
														url : CONTEXT_PATH
																+ '/sales/poreceipt.do?method=lastno',
														params : {
															ChoiceOne : ChoiceOne,
															Year : Year,
															from_type : from_type
														},
														success : function(
																result, request) {
															var from_type = Ext
																	.getCmp('from_type')
																	.getValue();
															var Version = Ext
																	.getCmp('version')
																	.getValue();
															var result = result.responseText;
															var str = result; // var
																				// str
																				// =
																				// '293';
															var num = Number(str);

															if (str.length == 3) {
																num = '0' + num;
															} else if (str.length == 2) {
																num = '00'
																		+ num;
															} else if (str.length == 1) {
																num = '000'
																		+ num;
															} else {
																num = num
																		% 10000;
															}
															Ext
																	.getCmp('pj_code')
																	.setValue("J"
																			+ ChoiceOne
																			+ from_type
																			+ Year
																			+ "-"
																			+ num
																			+ "-"
																			+ Version
																			+ "A");
															Ext
																	.getCmp('pj_code1')
																	.setValue("J"
																			+ ChoiceOne
																			+ from_type
																			+ Year
																			+ "-"
																			+ num
																			+ "-"
																			+ Version
																			+ "B");
														},
														failure : extjsUtil.failureMessage
													});

												} else {
													Ext.getCmp('pj_code')
															.setValue("");
													Ext.getCmp('pj_code1')
															.setValue("");
												}
											}
										}, {
											items : [{
												xtype : 'container',
												width : 280,
												layout : 'hbox',
												margin : '5 5 5 0',
												items : [{
													xtype : 'button',
													text : CMD_OK,
													width : 40,
													handler : function() {
														var ChoiceOne = Ext
																.getCmp('choice_one')
																.getValue();
														var Year = Ext
																.getCmp('year')
																.getValue();
														var from_type = Ext
																.getCmp('from_type')
																.getValue();

														Ext.Ajax.request({
															url : CONTEXT_PATH
																	+ '/sales/poreceipt.do?method=lastno',
															params : {
																ChoiceOne : ChoiceOne,
																Year : Year,
																from_type : from_type
															},
															success : function(
																	result,
																	request) {
																var from_type = Ext
																		.getCmp('from_type')
																		.getValue();
																var Version = Ext
																		.getCmp('version')
																		.getValue();
																var result = result.responseText;
																var str = result; // var
																					// str
																					// =
																					// '293';
																var num = Number(str);

																if (str.length == 3) {
																	num = '0'
																			+ num;
																} else if (str.length == 2) {
																	num = '00'
																			+ num;
																} else if (str.length == 1) {
																	num = '000'
																			+ num;
																} else {
																	num = num
																			% 10000;
																}
																if (checkflag == 0) {
																	Ext
																			.getCmp('pj_code')
																			.setValue("J"
																					+ ChoiceOne
																					+ from_type
																					+ Year
																					+ "-"
																					+ num
																					+ "-"
																					+ Version
																					+ "S");
																}

															},
															failure : extjsUtil.failureMessage
														});
													}
												}, {
													xtype : 'textfield',
													anchor : '100%',
													name : 'pj_code',
													id : 'pj_code',
													width : 120,
													readOnly : true,
													allowBlank : false,
													fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
												}, {
													xtype : 'textfield',
													anchor : '100%',
													name : 'pj_code1',
													id : 'pj_code1',
													width : 120,
													readOnly : true,
													fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 11px;'
												}]
											}]
										}]

							}]
						}, {
							xtype : 'fieldset',
							title : panelSRO1002,
							collapsible : true,
							defaultType : 'textfield',
							layout : 'anchor',
							defaults : {
								anchor : '100%'
							},
							items : [{
								xtype : 'container',
								layout : 'hbox',
								items : [{
									xtype : 'container',
									flex : 1,
									border : false,
									layout : 'anchor',
									defaultType : 'textfield',
									defaults : {
										labelWidth : 90,
										labelAlign : 'right',
										anchor : '95%'
									},
									items : // inputItem1
									[		new Ext.form.Hidden({
														id : 'order_com_unique',
														name : 'order_com_unique',
														value : order_com_unique
													}),

											new Ext.form.Hidden({
														id : 'irrigate_name',
														name : 'irrigate_name'
													}),

											{
												fieldLabel : getColName('order_com_unique'),
												readOnly : true,
												value : '[' + selectedWaCode
														+ ']' + selectedWaName,
												fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
											}, {
												fieldLabel : getColName('description'),
												afterLabelTextTpl : required,
												name : 'description',
												readOnly : true,
												value : description,
												fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
											}, {
												fieldLabel : getColName('resine_color'),
												afterLabelTextTpl : required,
												name : 'resine_color',
												allowBlank : false,
												minValue : 0,
												xtype : 'textfield'
											}, {
												fieldLabel : getColName('surface_art'),
												afterLabelTextTpl : required,
												name : 'surface_art',
												allowBlank : false,
												xtype : 'textfield'

											}, {
												fieldLabel : getColName('regist_date'),
												afterLabelTextTpl : required,
												name : 'regist_date',
												format : 'Y-m-d',
												submitFormat : 'Y-m-d',// 'Y-m-d
																		// H:i:s',
												dateFormat : 'Y-m-d',// 'Y-m-d
																		// H:i:s'
												allowBlank : false,
												value : new Date(),
												xtype : 'datefield'
											}, {
												fieldLabel : getColName('selling_price'),
												name : 'selling_price',
												allowBlank : false,
												// minValue:0,
												xtype : 'textfield'
											}, {
												xtype : 'combo',
												mode : 'local',
												value : 'JS0000CN',
												triggerAction : 'all',
												forceSelection : true,
												editable : false,
												allowBlank : false,
												afterLabelTextTpl : required,
												fieldLabel : getColName('reserved_varchar4'),
												name : 'reserved_varchar4',
												displayField : 'name',
												valueField : 'value',
												queryMode : 'local',
												store : Ext.create(
														'Ext.data.Store', {
															fields : ['name',
																	'value'],
															data : [{
																name : pp_firstBu,
																value : 'JS0000CN'
															}]
														})
											}, {

												fieldLabel : getColName('asset_number'),
												id : 'asset_number',
												name : 'asset_number'
											}, {

												fieldLabel : getColName('water_gap_weight'),
												id : 'water_gap_weight',
												name : 'water_gap_weight'
											}, {
												fieldLabel : getColName('irrigate_type'),
												x : 5,
												y : 0 + 2 * lineGap,
												afterLabelTextTpl : required,
												id : 'irrigate_type',
												name : 'irrigate_type',
												xtype : 'combo',
												value : '',
												mode : 'local',
												editable : false,
												queryMode : 'remote',
												displayField : 'codeName',
												valueField : 'systemCode',
												store : irrigateTypeCodeStore,
												listConfig : {
													getInnerTpl : function() {
														return '<div data-qtip="{codeName}">{codeName}</div>';
													}
												},

												listeners : {
													select : function(combo,
															record) {
														console_log('Selected Value : '
																+ combo
																		.getValue());
														var systemCode = record[0]
																.get('systemCode');
														var codeNameEn = record[0]
																.get('codeNameEn');
														var codeName = record[0]
																.get('codeName');

														Ext
																.getCmp('irrigate_name')
																.setValue(codeName);
														console_log('systemCode : '
																+ systemCode
																+ ', codeNameEn='
																+ codeNameEn
																+ ', codeName='
																+ codeName);
													}
												}
											}, {
												xtype : 'filefield',
												emptyText : panelSRO1149,
												fieldLabel : getColName('file_itemcode'),
												buttonText : 'upload',
												allowBlank : true,
												buttonConfig : {
													iconCls : 'upload-icon'
												}
											}]
								}, {	// 두번째 컬럼
											xtype : 'container',
											flex : 1,
											layout : 'anchor',
											defaultType : 'textfield',
											defaults : {
												labelWidth : 90,
												labelAlign : 'right',
												anchor : '95%'
											},
											items : // inputItem2
											[{
												fieldLabel : getColName('pj_type'),
												afterLabelTextTpl : required,
												id : 'pj_type',
												name : 'pj_type',
												readOnly : true,
												value : pj_type,
												fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
											}, {
												fieldLabel : getColName('pj_name'),
												afterLabelTextTpl : required,
												xtype : 'combo',
												mode : 'local',
												editable : false,
												allowBlank : false,
												queryMode : 'remote',
												displayField : 'item_name',
												valueField : 'unique_id',
												store : itemStore,
												listConfig : {
													getInnerTpl : function() {
														return '<div data-qtip="{unique_id}">{item_name} / {cavity} / {model_size}</div>';
													}
												},
												listeners : {
													select : function(combo,
															record) {
														var model_size = record[0]
																.get('model_size');
														var cavity = record[0]
																.get('cavity');
														var item_name = record[0]
																.get('item_name');

														Ext
																.getCmp('mold_type')
																.setValue(model_size);
														Ext
																.getCmp('pj_name')
																.setValue(item_name);
														Ext
																.getCmp('cav_no')
																.setValue(cavity);
													}
												}
											}, {
												xtype : 'fieldcontainer',
												afterLabelTextTpl : required,
												fieldLabel : getColName('cav_no'),
												xtype : 'textfield',
												flex : 1,
												name : 'cav_no',
												id : 'cav_no'
											}, {
												xtype : 'combo',
												mode : 'local',
												triggerAction : 'all',
												editable : false,
												allowBlank : false,
												afterLabelTextTpl : required,
												fieldLabel : getColName('mold_type'),
												name : 'mold_type',
												id : 'mold_type',
												displayField : 'value',
												valueField : 'name',
												queryMode : 'local',
												store : Ext.create(
														'Ext.data.Store', {
															fields : ['name',
																	'value'],
															data : [{
																name : small_size,
																value : panelSRO1202
															}, {
																name : medium_size,
																value : panelSRO1203
															}]
														})
											}, {
												fieldLabel : getColName('delivery_plan'),
												afterLabelTextTpl : required,
												name : 'delivery_plan',
												format : 'Y-m-d',
												submitFormat : 'Y-m-d',// 'Y-m-d
																		// H:i:s',
												dateFormat : 'Y-m-d',// 'Y-m-d
																		// H:i:s'
												value : Ext.Date.add(
														new Date(),
														Ext.Date.DAY, 15),
												allowBlank : false,
												xtype : 'datefield'
											},
													// makeSrchToolbar(makeUserCombo),
													{

														fieldLabel : getColName('pm_uid'),
														name : 'pm_uid',
														id : 'user_name',
														xtype : 'combo',
														store : storeSrch,
														displayField : 'user_name',
														valueField : 'unique_id',
														typeAhead : false,
														allowBlank : false,
														minChars : 1,
														listConfig : {
															loadingText : 'Searching...',
															emptyText : 'No matching posts found.',
															getInnerTpl : function() {
																return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
															}
														}
													}, {
														xtype : 'combo',
														mode : 'local',
														value : 'N',
														triggerAction : 'all',
														forceSelection : true,
														editable : false,
														allowBlank : false,
														fieldLabel : getColName('newmodcont'),
														name : 'newmodcont',
														displayField : 'name',
														valueField : 'value',
														queryMode : 'local',
														store : Ext
																.create(
																		'Ext.data.Store',
																		{
																			fields : [
																					'name',
																					'value'],
																			data : [
																					{
																						name : panelSRO1200,
																						value : 'N'
																					}]
																		})
													}, {
														fieldLabel : getColName('produce_mold_date'),
														afterLabelTextTpl : required,
														id : 'produce_mold_date',
														name : 'produce_mold_date',
														format : 'Y-m-d',
														submitFormat : 'Y-m-d',// 'Y-m-d
																				// H:i:s',
														dateFormat : 'Y-m-d',// 'Y-m-d
																				// H:i:s'
														allowBlank : false,
														xtype : 'datefield'
													}, {
														fieldLabel : getColName('due_t1_date'),
														afterLabelTextTpl : required,
														id : 'due_t1_date',
														name : 'due_t1_date',
														format : 'Y-m-d',
														submitFormat : 'Y-m-d',// 'Y-m-d
																				// H:i:s',
														dateFormat : 'Y-m-d',// 'Y-m-d
																				// H:i:s'
														allowBlank : false,
														xtype : 'datefield'
													},

													{
														fieldLabel : getColName('due_shaping_period'),
														id : 'due_shaping_period',
														name : 'due_shaping_period'
													}, {
														xtype : 'textarea',
														fieldLabel : crt3_comment,
														id : 'req_info',
														name : 'req_info'
													}

											]
										}]
							}]
						}]
			});

			var win = Ext.create('ModalWindow', {
				title : CMD_ADD + ' :: ' + /* (G) */vCUR_MENU_NAME,
				width : 800,
				height : 750,// 480,
				minWidth : 250,
				minHeight : 180,
				layout : 'fit',
				plain : true,
				items : form,
				buttons : [{
					text : CMD_OK,
					handler : function() {
						var form = Ext.getCmp('formPanel').getForm();
						if (form.isValid()) {
							agrid.getSelectionModel().selectAll();
							var aselections = agrid.getSelectionModel()
									.getSelection();
							if (aselections) {
								// alert(aselections.length);
								for (var i = 0; i < aselections.length; i++) {
									var rec = agrid.getSelectionModel()
											.getSelection()[i];

									ahid_userlist[i] = rec
											.get('usrast_unique_id');
									ahid_userlist_role[i] = rec.get('gubun');

								}
								Ext.getCmp('hid_userlist')
										.setValue(ahid_userlist);
								Ext.getCmp('hid_userlist_role')
										.setValue(ahid_userlist_role);
							}// end if
							var val = form.getValues(false);
							var projectmold = Ext.ModelManager.create(val,
									'ProjectMold');
							console_log(projectmold);

							console_log('model_uid: ' + model_uid);
							projectmold.set('model_uid', model_uid);
							projectmold.set('file_itemcode', vFILE_ITEM_CODE);
							console_log('projectmold -------------------');
							console_log(projectmold);

							var pj_code = Ext.getCmp('pj_code').getValue();
							var pj_code1 = Ext.getCmp('pj_code1').getValue();

							// 중복 코드 체크
							Ext.Ajax.request({
								url : CONTEXT_PATH
										+ '/sales/poreceipt.do?method=checkCode',
								params : {
									pj_code : pj_code,
									pj_code1 : pj_code1
								},

								success : function(result, request) {
									form.submit({
										url : CONTEXT_PATH
												+ '/uploader.do?method=multi&file_itemcode='
												+ /* (G) */vFILE_ITEM_CODE,
										waitMsg : 'Uploading Files...',
										success : function(fp, o) {
											console_log('success');
											var ret = result.responseText;
											if (ret == 0 || ret == '0') {
												// 저장 수정
												projectmold.save({
															success : function() {
																if (win) {
																	win.close();
																	store
																			.load(
																					function() {
																					});
																}
															}
														});

												if (win) {
													win.close();
												}
											} else {
												Ext.MessageBox
														.alert(
																'Duplicated Code',
																'check '
																		+ getColName('pj_code')
																		+ ' value.');
											}
										},
										failure : function() {
											console_log('failure');
											Ext.MessageBox.alert(
													error_msg_prompt, 'Failed');
										}
									});
									console_log('requested ajax...');
								},
								failure : extjsUtil.failureMessage
							});
						} else {
							Ext.MessageBox.alert(error_msg_prompt,
									error_msg_content);
						}
					}
				}, {
					text : CMD_CANCEL,
					handler : function() {
						if (win) {
							win.close();
						}

					}
				}]
			});
			win.show();
		});
	}
});

// Define Edit Action
var searchAction = Ext.create('Ext.Action', {
			itemId : 'searchButton',
			iconCls : 'search',
			text : CMD_SEARCH,
			disabled : false,
			handler : searchHandler
		});

var detailAction = Ext.create('Ext.Action', {
			itemId : 'detailButton',
			iconCls : 'application_view_detail',
			text : detail_text,
			disabled : true,
			handler : viewHandler
		});

var editAction = Ext.create('Ext.Action', {
			itemId : 'editButton',
			iconCls : 'pencil',
			text : edit_text,
			disabled : true,
			handler : editHandler
		});

// Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
			items : [detailAction, editAction, removeAction]
		});

var searchField = [];

Ext.onReady(function() {

	console_log('now starting...');

	Ext.define('RtgApp', {
		extend : 'Ext.data.Model',
		fields : /* (G) */vCENTER_FIELDS_SUB,
		proxy : {
			type : 'ajax',
			api : {
				read : CONTEXT_PATH
						+ '/rtgMgmt/routing.do?method=readRtgappDyna&change_type=D',
				create : CONTEXT_PATH
						+ '/rtgMgmt/routing.do?method=createRtgappDyna',
				destroy : CONTEXT_PATH
						+ '/rtgMgmt/routing.do?method=destroyRtgapp'
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
		}
	});
	rtgapp_store = new Ext.data.Store({
				pageSize : getPageSize(),
				model : 'RtgApp'});
	LoadJs('/js/util/buyerStore.js');
	LoadJs('/js/util/itemStore.js');
	moldFormTypeStore = Ext.create('Mplm.store.MoldFormTypeStore', {
				hasNull : false
			});
	IsComplishedStore = Ext.create('Mplm.store.IsComplishedStore', {
				hasNull : false
			});
	userStore = Ext.create('Mplm.store.UserStore', {
				hasNull : false
			});
	searchField.push({
				field_id : 'order_com_unique',
				store : 'BuyerStore',
				displayField : 'wa_name',
				valueField : 'unique_id',
				innerTpl : '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>'
			});
	searchField.push({
				width : 160,
				field_id : 'pj_type',
				store : 'ProcuctCodeStore',
				displayField : 'codeName',
				valueField : 'systemCode',
				innerTpl : '<div data-qtip="{unique_id}">[{systemCode}] {codeName}'// /
																					// {codeNameEn}</div>'
			});
	searchField.push({
				type : 'hidden',
				field_id : 'model_uid'
			});
	searchField.push({
				width : 160,
				field_id : 'description',
				fields : ['model_name'],
				displayField : 'model_name',
				valueField : 'model_name',
				innerTpl : '<div data-qtip="{model_name}">{model_name}</div>'
			});

	searchField.push({
		width : 120,
		field_id : 'from_type',
		store : 'MoldFormTypeStore',
		displayField : 'codeName',
		valueField : 'systemCode',
		innerTpl : '<div data-qtip="{systemCode}">[{systemCode}]{codeName}</div>'
	});

	searchField.push({
				type : 'radio',
				field_id : 'newmodcont',
				items : [{
							pressed : togIsNew,
							text : GET_MULTILANG('new_mold'),
							value : 'N',
							iconCls : 'brick_add'
						}, {
							pressed : !togIsNew,
							text : GET_MULTILANG('mod_mold'),
							value : 'M',
							iconCls : 'brick_edit'
						}]
			});

	makeSrchToolbar(searchField);
	console_log('makeSrchToolbar OK');

	// newmodcont radio setting
	var hiddenFrm = Ext.getCmp(getSearchField('newmodcont'));
	if (togIsNew) {
		hiddenFrm.setValue('N');
	} else {
		hiddenFrm.setValue('M');
	}

	Ext.define('RtgApp', {
		extend : 'Ext.data.Model',
		fields : /* (G) */vCENTER_FIELDS_SUB,
		proxy : {
			type : 'ajax',
			api : {
				read : CONTEXT_PATH
						+ '/rtgMgmt/routing.do?method=readRtgappDyna&change_type=D',
				create : CONTEXT_PATH
						+ '/rtgMgmt/routing.do?method=createRtgappDyna',
				destroy : CONTEXT_PATH
						+ '/rtgMgmt/routing.do?method=destroyRtgapp'
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
		}
	});

	// ProjectMold Store 정의
	Ext.define('ProjectMold', {
				extend : 'Ext.data.Model',
				fields : /* (G) */vCENTER_FIELDS,
				proxy : {
					type : 'ajax',
					api : {
						read : CONTEXT_PATH + '/sales/poreceipt.do?method=read', /*
																					 * 1recoed,
																					 * search
																					 * by
																					 * cond,
																					 * search
																					 */
						create : CONTEXT_PATH
								+ '/sales/poreceipt.do?method=createreadroute',
						update : CONTEXT_PATH
								+ '/sales/poreceipt.do?method=update',
						destroy : CONTEXT_PATH
								+ '/sales/poreceipt.do?method=destroy' /* delete */
					},
					reader : {
						type : 'json',
						root : 'datas',
						totalProperty : 'count',
						successProperty : 'success',
						excelPath : 'excelPath'
					},
					writer : {
						type : 'singlepost',
						writeAllFields : false,
						root : 'datas'
					}
				}
			});

	store = new Ext.data.Store({
				pageSize : getPageSize(),
				model : 'ProjectMold',
				sorters : [{
							property : 'unique_id',
							direction : 'DESC'
						}]
			});

	store.load(function() {

		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {
					onlyCheckOwner : false
				});
		/*
		 * var selModel = Ext.create('Ext.selection.CheckboxModel', { listeners: {
		 * selectionchange: function(sm, selections) {
		 * grid.down('#removeButton').setDisabled(selections.length == 0); } }
		 * });
		 */
		grid = Ext.create('Ext.grid.Panel', {
			store : store,
			collapsible : true,
			multiSelect : true,
			stateId : 'stateGrid',
			selModel : selModel,
			autoScroll : true,
			region : 'center',
			autoHeight : true,
			height : getCenterPanelHeight(),
			// paging bar on the bottom

			bbar : getPageToolbar(store),

			dockedItems : [{
				dock : 'top',
				xtype : 'toolbar',
				items : [searchAction, '-'// , addActionNew
						, {
							iconCls : 'add',
							text : CMD_ADD,
							disabled : fPERM_DISABLING(),
							menu : {
								items : [addActionNew, addActionMod,
										addActionVer]
							}
						}, '-', removeAction, '-', completeAction, '->']
			}, {
				xtype : 'toolbar',
				items : /* (G) */vSRCH_TOOLBAR

			}, {
				xtype : 'toolbar',
				items : [{
					id : 'isComplished',
					name : 'isComplished',
					xtype : 'combo',
					mode : 'local',
					triggerAction : 'all',
					forceSelection : true,
					editable : false,
					allowBlank : false,
					emptyText : sro1_complete,
					displayField : 'codeName',
					valueField : 'systemCode',
					fieldStyle : 'background-color: #FBF8E6; background-image: none;',
					queryMode : 'remote',
					store : IsComplishedStore,
					listConfig : {
						getInnerTpl : function() {
							return '<div data-qtip="{systemCode}">{codeName}</div>';
						}
					},
					listeners : {
						select : function(combo, record) {
							var isComplished = Ext.getCmp('isComplished')
									.getValue();
							store.getProxy().setExtraParam('is_complished',
									isComplished);
							store.load({});
						}// endofselect
					}
				}]
			}

			],
			columns : /* (G) */vCENTER_COLUMNS,
			viewConfig : {
				stripeRows : true,
				enableTextSelection : true,
				listeners : {
					'afterrender' : function(grid) {
						var elments = Ext.select(".x-column-header", true);// .x-grid3-hd
						elments.each(function(el) {
								}, this);

					},
					itemcontextmenu : function(view, rec, node, index, e) {
						e.stopEvent();
						contextMenu.showAt(e.getXY());
						return false;
					}
				}
			},
			title : getMenuTitle()
		});

		grid.getSelectionModel().on({
					selectionchange : function(sm, selections) {
						var rec = grid.getSelectionModel().getSelection()[0];
						if (selections.length) {
							// grid info 켜기
							// displayProperty(selections[0]);

							simpleProperty(selections[0]);

							if (fPERM_DISABLING() == true) {
								editAction.disable();
								removeAction.disable();
								addActionMod.disable();
								addActionVer.disable();
								completeAction.disable();
							} else {
								if (rec.get('creator_uid') != vCUR_USER_UID) {
									removeAction.enable();
									editAction.disable();
									completeAction.enable();
								} else {
									removeAction.enable();
									editAction.enable();
									completeAction.enable();
								}
								addActionMod.enable();
								addActionVer.enable();
							}
							detailAction.enable();
						} else {
							if (fPERM_DISABLING() == true) {
								collapseProperty();// uncheck no
													// displayProperty
								editAction.disable();
								removeAction.disable();
								addActionMod.disable();
								addActionVer.disable();
								completeAction.disable();
							} else {
								collapseProperty();// uncheck no
													// displayProperty
								editAction.disable();
								removeAction.disable();
								addActionMod.disable();
								addActionVer.disable();
								completeAction.disable();
							}
							detailAction.enable();
						}

					}
				});

		var tabPanel = new Ext.TabPanel({
					id : 'project-property-panel',
					collapsible : false,
					floatable : false,
					split : true,
					xtype : 'tabpanel',
					title : panelSRO1216,
					width : '25%',
					region : 'east',
					activeTab : 0,
					tabPosition : 'bottom',
					items : [{
								id : 'project-property-panel-div',
								title : panelSRO1213,
								border : false,
								autoScroll : true
							}, {
								id : 'projectD-property-panel-div',
								title : panelSRO1215,
								border : false,
								autoScroll : true
							}, {
								id : 'projectP-property-panel-div',
								title : panelSRO1214,
								border : false,
								autoScroll : true
							}]
				});

		var main = Ext.create('Ext.panel.Panel', {
					id : 'tempport',
					region : 'east',
					width : '30%',
					height : '100%',
					layout : 'border',
					border : false,
					layoutConfig : {
						columns : 1,
						rows : 2
					},
					defaults : {
						collapsible : true,
						split : true,
						cmargins : '5 0 0 0',
						margins : '0 0 0 0'
					},
					items : [grid, tabPanel]
				});

		fLAYOUT_CONTENT(main);

		Ext.each(/* (G) */vSRCH_TOOLTIP, function(config) {
					Ext.create('Ext.tip.ToolTip', config);
				});
		cenerFinishCallback();// Load Ok Finish Callback
	}); // store load
}); // OnReady

var modelStore = Ext.create('Mplm.store.BuyerModelStore', {
			hasNull : true
		});
// refill BuyerModel
function refillBModelCombo() {

	console_log('in refillBModelCombo');
	var order_com_unique = getSearchValue_('order_com_unique');
	console_log('*********************' + order_com_unique
			+ '***********************');
	var pj_type = getSearchValue('pj_type');
	if (Number(order_com_unique) > 0) {
		modelStore.proxy.extraParams.combst_uid = order_com_unique;
	}

	modelStore.proxy.extraParams.pj_type = pj_type;

	console_log('clearSrchCombo');
	clearSrchCombo('description');

	var oBModel = getSearchObject('description');
	oBModel.setLoading(true);

	modelStore.load(function(modelRecords) {
				console_log('loaded modelStore.load: qty='
						+ modelRecords.length);
				// Model Combo Object
				oBModel.setLoading(false);
				console_log(oBModel);
				for (var i = 0; i < modelRecords.length; i++) {
					console_log(modelRecords[i]);
					oBModel.store.add(modelRecords[i]);

				}
			});
}

// Define Add Action - Modification Mold
var addActionMod = Ext.create('Ext.Action', {
	text : sro1_modmold,// 'Major Fields | Current Rows',
	iconCls : 'brick_edit',
	disabled : true,
	handler : function(widget, event) {
		var selections = grid.getSelectionModel().getSelection();
		if (selections) {
			record = selections[0];
			selectedMoldUid = record.get('unique_id');
			selectedMoldCode = record.get('pj_code');
			selectedMoldCodeDash = record.get('pj_code_dash');

			selectedWaName = record.get('wa_name');
			selectedWaCode = record.get('wa_code');
			selectedDescription = record.get('description'); // 제품모델번호',
																// 'description',
																// '机型
			selectedPjName = record.get('pj_name'); // 제품명', 'pj_name', '品名
			selectedPjType = record.get('pj_type'); // 제품유형코드', 'pj_type', '产品代码
			selectedMoldType = record.get('mold_type'); // '주물/소물', 'mold_type',
														// '主件/小件
			selectedResine_color = record.get('resine_color');
			selectedSurface_art = record.get('surface_art');
			selectedCav_no = record.get('cav_no');
			selectedFile_itemcode = record.get('file_itemcode');

			order_com_unique = record.get('order_com_unique');
			moldAddType = 'MOD';
		} else {
			return;
		}
		var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {
					group_code : selectedMoldUid
				});
		attachedFileStore.load(function() {
			var newVer = '';
			var newMoldNo = '';

			Ext.Ajax.request({
				url : CONTEXT_PATH + '/sales/poreceipt.do?method=nextMoldNo',
				params : {
					pj_code : selectedMoldCode
				},
				success : function(result, request) {
					var newVer = result.responseText;
					if (newVer.length == 1) {
						newVer = '0' + newVer;
					}
					newMoldNo = selectedMoldCodeDash.substring(0, 11) + newVer
							+ selectedMoldCode.substring(11, 12);
					var myItems = [];

					myItems.push({
						fieldLabel : getColName('order_com_unique'),
						value : '[' + selectedWaCode + ']' + selectedWaName,
						readOnly : true,
						fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
					});
					myItems.push({
						fieldLabel : getColName('description'),
						value : selectedDescription,
						readOnly : true,
						fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
					});
					myItems.push({
								fieldLabel : getColName('regist_date'),
								name : 'regist_date',
								format : 'Y-m-d',
								submitFormat : 'Y-m-d',// 'Y-m-d H:i:s',
								dateFormat : 'Y-m-d',// 'Y-m-d H:i:s'
								allowBlank : false,
								value : new Date(),
								xtype : 'datefield'
							});
					myItems.push({
								fieldLabel : getColName('selling_price'),
								name : 'selling_price',
								allowBlank : false,
								minValue : 0,
								xtype : 'numberfield'
							});
					myItems.push({
						fieldLabel : getColName('resine_color'),
						name : 'resine_color',
						value : selectedResine_color,
						readOnly : true,
						fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
					});
					myItems.push({
						fieldLabel : getColName('surface_art'),
						name : 'surface_art',
						value : selectedSurface_art,
						readOnly : true,
						fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
					});
					myItems.push({
								xtype : 'combo',
								mode : 'local',
								value : 'JS0000CN',
								triggerAction : 'all',
								forceSelection : true,
								editable : false,
								allowBlank : false,
								fieldLabel : getColName('reserved_varchar4'),
								name : 'reserved_varchar4',
								displayField : 'name',
								valueField : 'value',
								queryMode : 'local',
								store : Ext.create('Ext.data.Store', {
											fields : ['name', 'value'],
											data : [{
														name : pp_firstBu,
														value : 'JS0000CN'
													}]
										})
							});
					myItems.push({
								xtype : 'combo',
								mode : 'local',
								triggerAction : 'all',
								forceSelection : true,
								editable : false,
								allowBlank : false,
								fieldLabel : getColName('newmodcont'),
								name : 'newmodcont',
								displayField : 'name',
								valueField : 'value',
								queryMode : 'local',
								value : 'M',
								store : Ext.create('Ext.data.Store', {
											fields : ['name', 'value'],
											data : [{
														name : panelSRO1201,
														value : 'M'
													}]
										})
							});

					var checkboxItem = [];
					attachedFileStore.each(function(record) {
						console_log(record);
						console_log('----------------------------------------------');
						console_log(record.get('object_name'));
						console_log(record.get('id'));
						console_log(record.get('group_code'));
						console_log(record.get('file_path'));
						console_log(record.get('file_size'));
						console_log(record.get('fileobject_uid'));
						console_log(record.get('file_ext'));
						checkboxItem.push({
									xtype : 'checkboxfield',
									name : 'deleteFiles',
									boxLabel : record.get('object_name') + '('
											+ record.get('file_size') + ')',
									checked : false,
									inputValue : record.get('id')
								});
					});

					if (checkboxItem.length > 0) {
						myItems.push({
									xtype : 'checkboxgroup',
									allowBlank : true,
									fieldLabel : 'Check to Delete',
									items : checkboxItem
								});
					}

					myItems.push({
								xtype : 'filefield',
								emptyText : panelSRO1149,
								buttonText : 'upload',
								fieldLabel : getColName('file_itemcode'),
								allowBlank : true,
								buttonConfig : {
									iconCls : 'upload-icon'
								}
							});
					var tempColumn = [];

					tempColumn.push(updown);
					for (var i = 0; i < vCENTER_COLUMN_SUB.length; i++) {
						tempColumn.push(vCENTER_COLUMN_SUB[i]);
					}

					rtgapp_store.load(function() {
						Ext.each( /* (G) */tempColumn, function(columnObj,
								index, value) {
							var dataIndex = columnObj["dataIndex"];
							columnObj["flex"] = 1;

							if (value != "W") {
								if ('gubun' == dataIndex) {
									var combo = null;
									var comboBoxRenderer = function(value, p,
											record) {
										if (value == 'W') {
										} else {
											console_log('combo.valueField = '
													+ combo.valueField
													+ ', value=' + value);
											console_log(combo.store);
											var idx = combo.store.find(
													combo.valueField, value);
											console_log(idx);
											var rec = combo.store.getAt(idx);
											console_log(rec);
											return (rec === null ? '' : rec
													.get(combo.displayField));
										}
									};

									combo = new Ext.form.field.ComboBox({
												typeAhead : true,
												triggerAction : 'all',
												selectOnTab : true,
												mode : 'local',
												queryMode : 'remote',
												editable : false,
												allowBlank : false,
												displayField : 'codeName',
												valueField : 'systemCode',
												store : routeGubunTypeStore,
												listClass : 'x-combo-list-small',
												listeners : {}
											});
									columnObj["editor"] = combo;
									columnObj["renderer"] = function(value, p,
											record, rowIndex, colIndex, store) {
										p.tdAttr = 'style="background-color: #FFE4E4;"';
										return value;
									};
								}
							}
						});
						var storeSrch = null;
						storeSrch = Ext.create('Mplm.store.UserStore', {
									hasNull : true
								});
						storeSrch['cmpName'] = 'user';
						// agrid create
						agrid = Ext.create('Ext.grid.Panel', {
							title : routing_path,
							store : rtgapp_store,
							layout : 'fit',
							columns : tempColumn,
							plugins : [Ext.create(
									'Ext.grid.plugin.CellEditing', {
										clicksToEdit : 1
									})],
							border : false,
							multiSelect : true,
							frame : false,
							dockedItems : [{
								xtype : 'toolbar',
								items : [{
									fieldLabel : dbm1_array_add,
									labelWidth : 42,
									id : 'user',
									name : 'user',
									xtype : 'combo',
									fieldStyle : 'background-color: #FBF8E6; background-image: none;',
									store : storeSrch,
									labelSeparator : ':',
									emptyText : dbm1_name_input,
									displayField : 'user_name',
									valueField : 'unique_id',
									sortInfo : {
										field : 'user_name',
										direction : 'ASC'
									},
									typeAhead : false,
									hideLabel : true,
									minChars : 1,
									width : 230,
									listConfig : {
										loadingText : 'Searching...',
										emptyText : 'No matching posts found.',
										getInnerTpl : function() {
											return '<div data-qtip="{unique_id}">{user_name}|{dept_name}</div>';
										}
									},
									listeners : {
										select : function(combo, record) {

											console_log('Selected Value : '
													+ record[0]
															.get('unique_id'));

											var unique_id = record[0]
													.get('unique_id');
											var user_id = record[0]
													.get('user_id');
											Ext.Ajax.request({
												url : CONTEXT_PATH
														+ '/rtgMgmt/routing.do?method=createRtgappDyna',
												params : {
													useruid : unique_id,
													userid : user_id,
													gubun : 'D'
												},
												success : function(result,
														request) {
													var result = result.responseText;
													console_log('result:'
															+ result);
													if (result == 'false') {
														Ext.MessageBox
																.alert(
																		error_msg_prompt,
																		'Dupliced User');
													} else {
														rtgapp_store.load(
																function() {
																});
													}
												},
												failure : extjsUtil.failureMessage
											});
										}// endofselect
									}
								}, '->', removeRtgapp, {
									text : panelSRO1133,
									iconCls : 'save',
									disabled : false,
									handler : function() {
										var modifiend = [];
										var rec = grid.getSelectionModel()
												.getSelection()[0];
										var unique_id = rec.get('unique_id');
										for (var i = 0; i < agrid.store.data.items.length; i++) {
											var record = agrid.store.data.items[i];
											if (record.dirty) {
												rtgapp_store
														.getProxy()
														.setExtraParam(
																'unique_id',
																vSELECTED_UNIQUE_ID);
												console_log(record);
												var obj = {};
												obj['unique_id'] = record
														.get('unique_id');// //pcs_code,
																			// pcs_name...
												obj['gubun'] = record
														.get('gubun');
												obj['owner'] = record
														.get('owner');
												obj['change_type'] = record
														.get('change_type');
												obj['app_type'] = record
														.get('app_type');
												obj['usrast_unique_id'] = record
														.get('usrast_unique_id');
												obj['seq'] = record.get('seq');
												obj['updown'] = 0;
												modifiend.push(obj);
											}
										}
										if (modifiend.length > 0) {
											console_log(modifiend);
											var str = Ext.encode(modifiend);
											console_log(str);
											Ext.Ajax.request({
												url : CONTEXT_PATH
														+ '/rtgMgmt/routing.do?method=modifyRtgapp',
												params : {
													modifyIno : str,
													srcahd_uid : unique_id
												},
												success : function(result,
														request) {
													rtgapp_store.load(
															function() {
															});
												}
											});
										}
									}
								}]
									// endofitems
							}]
								// endofdockeditems
						}); // endof Ext.create('Ext.grid.Panel',
						agrid.getSelectionModel().on({
									selectionchange : function(sm, selections) {
										if (selections.length) {
											if (fPERM_DISABLING() == true) {
												removeRtgapp.disable();
											} else {
												removeRtgapp.enable();
											}
										} else {
											if (fPERM_DISABLING() == true) {
												collapseProperty();// uncheck
																	// no
																	// displayProperty
												removeRtgapp.disable();
											} else {
												collapseProperty();// uncheck
																	// no
																	// displayProperty
												removeRtgapp.disable();
											}
										}
									}
								});
						storeSrch = Ext.create('Mplm.store.UserStore', {
									hasNull : true
								});
						storeSrch['cmpName'] = 'user_name';
						var form = Ext.create('Ext.form.Panel', {
							id : 'formPanel',
							xtype : 'form',
							frame : false,
							bodyPadding : '3 3 0',
							width : 800,
							autoHeight : true,
							fieldDefaults : {
								labelAlign : 'middle',
								msgTarget : 'side'
							},
							defaults : {
								anchor : '100%',
								labelWidth : 100
							},
							items : [new Ext.form.Hidden({
												id : 'unique_id',
												name : 'unique_id',
												value : selectedMoldUid
											}), new Ext.form.Hidden({
												id : 'pj_uid',
												name : 'pj_uid',
												value : selectedMoldUid
											}), new Ext.form.Hidden({
												id : 'pj_name',
												name : 'pj_name'
											}), new Ext.form.Hidden({
												id : 'newmodcont',
												name : 'newmodcont',
												value : 'M'
											}), new Ext.form.Hidden({
												id : 'order_com_unique',
												name : 'order_com_unique',
												value : order_com_unique
											}), new Ext.form.Hidden({
												id : 'hid_userlist_role',
												name : 'hid_userlist_role'
											}), new Ext.form.Hidden({
												id : 'hid_userlist',
												name : 'hid_userlist'
											}), {
										xtype : 'fieldset',
										title : aus7_approval,
										collapsible : true,
										defaults : {
											labelWidth : 89,
											anchor : '100%',
											labelAlign : 'right',
											layout : {
												type : 'hbox',
												defaultMargins : {
													top : 0,
													right : 5,
													bottom : 0,
													left : 0
												}
											}
										},
										items : [agrid]
									}, {
										xtype : 'fieldset',
										title : panelSRO1045,
										collapsible : true,
										defaults : {
											labelWidth : 89,
											anchor : '100%',
											labelAlign : 'right',
											layout : {
												type : 'hbox',
												defaultMargins : {
													top : 0,
													right : 5,
													bottom : 0,
													left : 0
												}
											}
										},
										items : [{
											xtype : 'fieldcontainer',
											combineErrors : false,
											defaults : {
												hideLabel : true
											},
											items : [{
														xtype : 'displayfield',
														value : sro1_old_mold
													}, {
														xtype : 'textfield',
														anchor : '100%',
														value : selectedMoldCodeDash,
														width : 110,
														readOnly : true,
														allowBlank : false,
														fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
													}, {
														xtype : 'displayfield',
														value : panelSRO1198
													}, {
														xtype : 'textfield',
														name : 'ver',
														fieldLabel : panelSRO1172,
														width : 30,
														value : newVer,
														readOnly : true,
														fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
													}, {
														xtype : 'displayfield',
														value : '&nbsp; '
																+ sro1_new_mold
													}, {
														xtype : 'textfield',
														anchor : '100%',
														name : 'pj_code',
														id : 'pj_code',
														width : 200,
														value : newMoldNo,
														readOnly : true,
														allowBlank : false,
														fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:bold; font-size: 15px;'
													}]

										}]
									}, {
										xtype : 'fieldset',
										title : panelSRO1002,
										collapsible : true,
										defaultType : 'textfield',
										layout : 'anchor',
										defaults : {
											anchor : '100%'
										},
										items : [{
											xtype : 'container',
											layout : 'hbox',
											items : [{
														xtype : 'container',
														flex : 1,
														border : false,
														layout : 'anchor',
														defaultType : 'textfield',
														defaults : {
															labelWidth : 90,
															labelAlign : 'right',
															anchor : '95%'
														},
														items : myItems
													}, { // 두번째 컬럼
														xtype : 'container',
														flex : 1,
														layout : 'anchor',
														defaultType : 'textfield',
														defaults : {
															labelWidth : 90,
															labelAlign : 'right',
															anchor : '95%'
														},
														items : [{
															fieldLabel : getColName('pj_type'),
															value : selectedPjType,
															readOnly : true,
															fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
														}, {
															fieldLabel : getColName('pj_name'),
															value : selectedPjName,
															readOnly : true,
															fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'

														}, {
															fieldLabel : getColName('delivery_plan'),
															name : 'delivery_plan',
															format : 'Y-m-d',
															submitFormat : 'Y-m-d',// 'Y-m-d
																					// H:i:s',
															dateFormat : 'Y-m-d',// 'Y-m-d
																					// H:i:s'
															value : Ext.Date
																	.add(
																			new Date(),
																			Ext.Date.DAY,
																			15),
															allowBlank : false,
															xtype : 'datefield'
														}, {
															fieldLabel : getColName('pm_uid'),
															name : 'pm_uid',
															id : 'user_name',
															xtype : 'combo',
															store : storeSrch,
															displayField : 'user_name',
															valueField : 'unique_id',
															typeAhead : false,
															allowBlank : false,
															minChars : 1,
															listConfig : {
																loadingText : 'Searching...',
																emptyText : 'No matching posts found.',
																getInnerTpl : function() {
																	return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
																}
															}
														}, {
															fieldLabel : getColName('cav_no'),
															name : 'cav_no',
															value : selectedCav_no,
															readOnly : true,
															fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'

														}, {
															fieldLabel : getColName('mold_type'),
															value : selectedMoldType,
															readOnly : true,
															fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
														}, {
															xtype : 'textarea',
															fieldLabel : getColName('reserved_varchar5'),
															hideLabel : false,
															name : 'reserved_varchar5'
														}, {
															xtype : 'checkboxfield',
															id : 'checkMold',
															fieldLabel : sro1_bom_copby,
															checked : true,
															listeners : {
																change : function(
																		checkbox,
																		checked) {
																	console_log(checked);
																	if (checked == false) {
																		Ext
																				.getCmp('checkMold')
																				.setValue(false);
																	} else {
																		Ext
																				.getCmp('checkMold')
																				.setValue(true);
																	}
																}
															}
														}]
													}]
										}]
									}]
						});

						var win = Ext.create('ModalWindow', {
							title : CMD_ADD + ' :: ' + /* (G) */vCUR_MENU_NAME,
							width : 800,
							height : 600,// 480,
							minWidth : 250,
							minHeight : 180,
							layout : 'fit',
							plain : true,
							items : form,
							buttons : [{
								text : CMD_OK,
								handler : function() {
									var form = Ext.getCmp('formPanel')
											.getForm();
									if (form.isValid()) {
										var checkMold = Ext.getCmp('checkMold')
												.getValue();
										if (checkMold == true) {
											var waring = Ext.Msg.confirm(
													'Confirm Box',
													sro1_comment_true,
													function(buttonText) {
														if (buttonText == "yes") {
															agrid
																	.getSelectionModel()
																	.selectAll();
															var aselections = agrid
																	.getSelectionModel()
																	.getSelection();
															if (aselections) {
																for (var i = 0; i < aselections.length; i++) {
																	var rec = agrid
																			.getSelectionModel()
																			.getSelection()[i];

																	ahid_userlist[i] = rec
																			.get('usrast_unique_id');
																	ahid_userlist_role[i] = rec
																			.get('gubun');

																}
																Ext
																		.getCmp('hid_userlist')
																		.setValue(ahid_userlist);
																Ext
																		.getCmp('hid_userlist_role')
																		.setValue(ahid_userlist_role);
															}// end if

															var val = form
																	.getValues(false);
															var projectmold = Ext.ModelManager
																	.create(
																			val,
																			'ProjectMold');
															var pj_code = Ext
																	.getCmp('pj_code')
																	.getValue();
															projectmold
																	.set(
																			'file_itemcode',
																			vFILE_ITEM_CODE);
															projectmold
																	.set(
																			'checkMold',
																			'yes');
															// 중복 코드 체크
															Ext.Ajax.request({
																url : CONTEXT_PATH
																		+ '/sales/poreceipt.do?method=checkCode',
																params : {
																	pj_code : pj_code
																},
																success : function(
																		result,
																		request) {
																	form
																			.submit(
																					{
																						url : CONTEXT_PATH
																								+ '/uploader.do?method=multi&file_itemcode='
																								+ /* (G) */vFILE_ITEM_CODE,
																						waitMsg : 'Uploading Files...',
																						success : function(
																								fp,
																								o) {
																							var ret = result.responseText;
																							if (ret == 0
																									|| ret == '0') {
																								console_log('UUUUUUUUUU');
																								console_log(projectmold);
																								// 저장
																								// 수정
																								projectmold
																										.save(
																												{
																													success : function() {
																														if (win) {
																															win
																																	.close();
																															store
																																	.load(
																																			function() {
																																			});
																														}
																													}
																												});
																								if (win) {
																									win
																											.close();
																								}
																							} else {
																								Ext.MessageBox
																										.alert(
																												'Duplicated Code',
																												'check '
																														+ getColName('pj_code')
																														+ ' value.');
																							}
																						},
																						failure : function() {
																							console_log('failure');
																							Ext.MessageBox
																									.alert(
																											error_msg_prompt,
																											'Failed');
																						}
																					});
																	console_log('requested ajax...');
																},
																failure : extjsUtil.failureMessage
															});
														}
														if (buttonText == "no") {
															waring.close();
														}
													});
										} else {
											Ext.Msg.confirm('Confirm Box',
													sro1_comment_false,
													function(buttonText) {
														if (buttonText == "yes") {
															agrid
																	.getSelectionModel()
																	.selectAll();
															var aselections = agrid
																	.getSelectionModel()
																	.getSelection();
															if (aselections) {
																for (var i = 0; i < aselections.length; i++) {
																	var rec = agrid
																			.getSelectionModel()
																			.getSelection()[i];
																	ahid_userlist[i] = rec
																			.get('usrast_unique_id');
																	ahid_userlist_role[i] = rec
																			.get('gubun');
																}
																Ext
																		.getCmp('hid_userlist')
																		.setValue(ahid_userlist);
																Ext
																		.getCmp('hid_userlist_role')
																		.setValue(ahid_userlist_role);
															}// end if

															var val = form
																	.getValues(false);
															var projectmold = Ext.ModelManager
																	.create(
																			val,
																			'ProjectMold');
															var pj_code = Ext
																	.getCmp('pj_code')
																	.getValue();
															projectmold
																	.set(
																			'file_itemcode',
																			vFILE_ITEM_CODE);
															projectmold
																	.set(
																			'checkMold',
																			'no');
															// 중복 코드 체크
															Ext.Ajax.request({
																url : CONTEXT_PATH
																		+ '/sales/poreceipt.do?method=checkCode',
																params : {
																	pj_code : pj_code
																},
																success : function(
																		result,
																		request) {
																	form
																			.submit(
																					{
																						url : CONTEXT_PATH
																								+ '/uploader.do?method=multi&file_itemcode='
																								+ /* (G) */vFILE_ITEM_CODE,
																						waitMsg : 'Uploading Files...',
																						success : function(
																								fp,
																								o) {
																							var ret = result.responseText;
																							if (ret == 0
																									|| ret == '0') {
																								// 저장
																								// 수정
																								projectmold
																										.save(
																												{
																													success : function() {
																														if (win) {
																															win
																																	.close();
																															store
																																	.load(
																																			function() {
																																			});
																														}
																													}
																												});
																								if (win) {
																									win
																											.close();
																								}
																							} else {
																								Ext.MessageBox
																										.alert(
																												'Duplicated Code',
																												'check '
																														+ getColName('pj_code')
																														+ ' value.');
																							}
																						},
																						failure : function() {
																							console_log('failure');
																							Ext.MessageBox
																									.alert(
																											error_msg_prompt,
																											'Failed');
																						}
																					});
																	console_log('requested ajax...');
																},
																failure : extjsUtil.failureMessage
															});
														}
														if (buttonText == "no") {
															waring.close();
														}
													});
										}
									} else {
										Ext.MessageBox.alert(error_msg_prompt,
												error_msg_content);
									}
								}// endof handler
							}, {
								text : CMD_CANCEL,
								handler : function() {
									if (win) {
										win.close();
									}

								}
							}]
						});
						win.show();
					});
				},
				failure : extjsUtil.failureMessage
			});
		});
	}// endofhandler
});

// Define Add Action - Modification Mold
var addActionVer = Ext.create('Ext.Action', {
	text : sro1_revmold,// 'Major Fields | Current Rows',
	iconCls : 'brick_go',
	disabled : true,
	handler : function(widget, event) {
		var selections = grid.getSelectionModel().getSelection();// pj_code:
																	// "JA13P002006B"
		var record = selections[0];
		var Pj_uid = record.get('unique_id');
		var pj_code = record.get('pj_code');
		var choice_one = pj_code.substring(1, 2);
		var year = pj_code.substring(2, 4);
		var from_type = pj_code.substring(4, 5);
		var comment = null;
		selectedMoldCodeDash = record.get('pj_code_dash');

		wa_name = record.get('wa_name');
		wa_code = record.get('wa_code');
		description = record.get('description'); // 제품모델번호', 'description',
													// '机型
		pj_name = record.get('pj_name'); // 제품명', 'pj_name', '品名
		pj_type = record.get('pj_type'); // 제품유형코드', 'pj_type', '产品代码
		mold_type = record.get('mold_type'); // '주물/소물', 'mold_type', '主件/小件
		resine_color = record.get('resine_color');
		surface_art = record.get('surface_art');
		cav_no = record.get('cav_no');
		file_itemcode = record.get('file_itemcode');
		customer_name = record.get('customer_name');
		selling_price = record.get('selling_price');
		reserved_varchar4 = record.get('reserved_varchar4');
		mold_type = record.get('mold_type');

		order_com_unique = record.get('order_com_unique');
		buyerStore['cmpName'] = 'order_com_unique'; // combo name

		var myItems = [];
		var attachedFileStore = Ext.create('Mplm.store.AttachedFileStore', {
					group_code : Pj_uid
				});
		attachedFileStore.load(function() {
			myItems.push({
				fieldLabel : getColName('order_com_unique'),
				value : '[' + wa_code + ']' + wa_name,
				readOnly : true,
				fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
			});
			myItems.push({
				fieldLabel : getColName('description'),
				value : description,
				readOnly : true,
				fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
			});
			myItems.push({
						fieldLabel : getColName('regist_date'),
						name : 'regist_date',
						format : 'Y-m-d',
						submitFormat : 'Y-m-d',// 'Y-m-d H:i:s',
						dateFormat : 'Y-m-d',// 'Y-m-d H:i:s'
						allowBlank : false,
						value : new Date(),
						xtype : 'datefield'
					});
			myItems.push({
						fieldLabel : getColName('selling_price'),
						name : 'selling_price',
						allowBlank : false,
						value : selling_price,
						minValue : 0,
						xtype : 'numberfield'
					});
			myItems.push({
				fieldLabel : getColName('resine_color'),
				name : 'resine_color',
				value : resine_color,
				readOnly : true,
				fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
			});
			myItems.push({
				fieldLabel : getColName('surface_art'),
				name : 'surface_art',
				value : surface_art,
				readOnly : true,
				fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
			});
			myItems.push({
						xtype : 'combo',
						mode : 'local',
						value : 'JS0000CN',
						triggerAction : 'all',
						forceSelection : true,
						editable : false,
						allowBlank : false,
						fieldLabel : getColName('reserved_varchar4'),
						name : 'reserved_varchar4',
						displayField : 'name',
						valueField : 'value',
						queryMode : 'local',
						store : Ext.create('Ext.data.Store', {
									fields : ['name', 'value'],
									data : [{
												name : pp_firstBu,
												value : 'JS0000CN'
											}]
								})
					});
			myItems.push({
						xtype : 'combo',
						mode : 'local',
						triggerAction : 'all',
						forceSelection : true,
						editable : false,
						allowBlank : false,
						fieldLabel : getColName('newmodcont'),
						name : 'newmodcont',
						displayField : 'name',
						valueField : 'value',
						queryMode : 'local',
						value : 'N',
						store : Ext.create('Ext.data.Store', {
									fields : ['name', 'value'],
									data : [{
												name : panelSRO1200,
												value : 'N'
											}]
								})
					});

			var checkboxItem = [];
			attachedFileStore.each(function(record) {
						console_log(record);
						console_log('----------------------------------------------');
						console_log(record.get('object_name'));
						console_log(record.get('id'));
						console_log(record.get('group_code'));
						console_log(record.get('file_path'));
						console_log(record.get('file_size'));
						console_log(record.get('fileobject_uid'));
						console_log(record.get('file_ext'));
						checkboxItem.push({
									xtype : 'checkboxfield',
									name : 'deleteFiles',
									boxLabel : record.get('object_name') + '('
											+ record.get('file_size') + ')',
									checked : false,
									inputValue : record.get('id')
								});
					});

			if (checkboxItem.length > 0) {
				myItems.push({
							xtype : 'checkboxgroup',
							allowBlank : true,
							fieldLabel : 'Check to Delete',
							items : checkboxItem
						});
			}

			myItems.push({
						xtype : 'filefield',
						emptyText : panelSRO1149,
						buttonText : 'upload',
						fieldLabel : getColName('file_itemcode'),
						allowBlank : true,
						buttonConfig : {
							iconCls : 'upload-icon'
						}
					});

			var tempColumn = [];

			tempColumn.push(updown);
			for (var i = 0; i < vCENTER_COLUMN_SUB.length; i++) {
				tempColumn.push(vCENTER_COLUMN_SUB[i]);
			}

			rtgapp_store.load(function() {
				Ext.each( /* (G) */tempColumn,
						function(columnObj, index, value) {
							var dataIndex = columnObj["dataIndex"];
							columnObj["flex"] = 1;

							if (value != "W") {
								if ('gubun' == dataIndex) {
									var combo = null;
									var comboBoxRenderer = function(value, p,
											record) {
										if (value == 'W') {
										} else {
											console_log('combo.valueField = '
													+ combo.valueField
													+ ', value=' + value);
											console_log(combo.store);
											var idx = combo.store.find(
													combo.valueField, value);
											console_log(idx);
											var rec = combo.store.getAt(idx);
											console_log(rec);
											return (rec === null ? '' : rec
													.get(combo.displayField));
										}
									};

									combo = new Ext.form.field.ComboBox({
												typeAhead : true,
												triggerAction : 'all',
												selectOnTab : true,
												mode : 'local',
												queryMode : 'remote',
												editable : false,
												allowBlank : false,
												displayField : 'codeName',
												valueField : 'systemCode',
												store : routeGubunTypeStore,
												listClass : 'x-combo-list-small',
												listeners : {}
											});
									columnObj["editor"] = combo;
									columnObj["renderer"] = function(value, p,
											record, rowIndex, colIndex, store) {
										p.tdAttr = 'style="background-color: #FFE4E4;"';
										return value;
									};
								}
							}
						});
				var storeSrch = null;
				storeSrch = Ext.create('Mplm.store.UserStore', {
							hasNull : true
						});
				storeSrch['cmpName'] = 'user';
				// agrid create
				agrid = Ext.create('Ext.grid.Panel', {
					title : routing_path,
					store : rtgapp_store,
					layout : 'fit',
					columns : tempColumn,
					plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
								clicksToEdit : 1
							})],
					border : false,
					multiSelect : true,
					frame : false,
					dockedItems : [{
						xtype : 'toolbar',
						items : [{
							fieldLabel : dbm1_array_add,
							labelWidth : 42,
							id : 'user',
							name : 'user',
							xtype : 'combo',
							fieldStyle : 'background-color: #FBF8E6; background-image: none;',
							store : storeSrch,
							labelSeparator : ':',
							emptyText : dbm1_name_input,
							displayField : 'user_name',
							valueField : 'unique_id',
							sortInfo : {
								field : 'user_name',
								direction : 'ASC'
							},
							typeAhead : false,
							hideLabel : true,
							minChars : 1,
							width : 230,
							listConfig : {
								loadingText : 'Searching...',
								emptyText : 'No matching posts found.',
								getInnerTpl : function() {
									return '<div data-qtip="{unique_id}">{user_name}|{dept_name}</div>';
								}
							},
							listeners : {
								select : function(combo, record) {

									console_log('Selected Value : '
											+ record[0].get('unique_id'));

									var unique_id = record[0].get('unique_id');
									var user_id = record[0].get('user_id');
									Ext.Ajax.request({
										url : CONTEXT_PATH
												+ '/rtgMgmt/routing.do?method=createRtgappDyna',
										params : {
											useruid : unique_id,
											userid : user_id,
											gubun : 'D'
										},
										success : function(result, request) {
											var result = result.responseText;
											console_log('result:' + result);
											if (result == 'false') {
												Ext.MessageBox.alert(
														error_msg_prompt,
														'Dupliced User');
											} else {
												rtgapp_store.load(function() {
														});
											}
										},
										failure : extjsUtil.failureMessage
									});
								}// endofselect
							}
						}, '->', removeRtgapp,

						{
							text : panelSRO1133,
							iconCls : 'save',
							disabled : false,
							handler : function() {
								var modifiend = [];
								var rec = grid.getSelectionModel()
										.getSelection()[0];
								var unique_id = rec.get('unique_id');
								for (var i = 0; i < agrid.store.data.items.length; i++) {
									var record = agrid.store.data.items[i];
									if (record.dirty) {
										rtgapp_store.getProxy().setExtraParam(
												'unique_id',
												vSELECTED_UNIQUE_ID);
										console_log(record);
										var obj = {};
										obj['unique_id'] = record
												.get('unique_id');// //pcs_code,
																	// pcs_name...
										obj['gubun'] = record.get('gubun');
										obj['owner'] = record.get('owner');
										obj['change_type'] = record
												.get('change_type');
										obj['app_type'] = record
												.get('app_type');
										obj['usrast_unique_id'] = record
												.get('usrast_unique_id');
										obj['seq'] = record.get('seq');
										obj['updown'] = 0;
										modifiend.push(obj);
									}
								}
								if (modifiend.length > 0) {
									console_log(modifiend);
									var str = Ext.encode(modifiend);
									console_log(str);
									Ext.Ajax.request({
										url : CONTEXT_PATH
												+ '/rtgMgmt/routing.do?method=modifyRtgapp',
										params : {
											modifyIno : str,
											srcahd_uid : unique_id
										},
										success : function(result, request) {
											rtgapp_store.load(function() {
													});
										}
									});
								}
							}
						}]
							// endofitems
					}]
						// endofdockeditems
				}); // endof Ext.create('Ext.grid.Panel',
				agrid.getSelectionModel().on({
							selectionchange : function(sm, selections) {
								if (selections.length) {
									if (fPERM_DISABLING() == true) {
										removeRtgapp.disable();
									} else {
										removeRtgapp.enable();
									}
								} else {
									if (fPERM_DISABLING() == true) {
										collapseProperty();// uncheck no
															// displayProperty
										removeRtgapp.disable();
									} else {
										collapseProperty();// uncheck no
															// displayProperty
										removeRtgapp.disable();
									}
								}
							}
						});
				var storeSrch = null;
				storeSrch = Ext.create('Mplm.store.UserStore', {
							hasNull : true
						});
				storeSrch['cmpName'] = 'user_name';
				var form = Ext.create('Ext.form.Panel', {
					id : 'formPanel',
					xtype : 'form',
					frame : false,
					bodyPadding : '3 3 0',
					width : 800,
					autoHeight : true,
					fieldDefaults : {
						labelAlign : 'middle',
						msgTarget : 'side'
					},
					defaults : {
						anchor : '100%',
						labelWidth : 100
					},
					items : [/* pj_name_hidden,화면두번띄우면 에러 */
							new Ext.form.Hidden({
										id : 'unique_id',
										name : 'unique_id',
										value : Pj_uid
									}), new Ext.form.Hidden({
										id : 'pj_uid',
										name : 'pj_uid',
										value : Pj_uid
									}), new Ext.form.Hidden({
										id : 'newmodcont',
										name : 'newmodcont',
										value : 'N'
									}), new Ext.form.Hidden({
										id : 'order_com_unique',
										name : 'order_com_unique',
										value : order_com_unique
									}), new Ext.form.Hidden({
										id : 'hid_userlist_role',
										name : 'hid_userlist_role'
									}), new Ext.form.Hidden({
										id : 'hid_userlist',
										name : 'hid_userlist'
									}),
							// new Ext.form.Hidden({
							// id: 'srch_type',
							// name: 'srch_type',
							// value: 'update'
							// }),
							{
								xtype : 'fieldset',
								title : aus7_approval,
								collapsible : true,
								defaults : {
									labelWidth : 89,
									anchor : '100%',
									labelAlign : 'right',
									layout : {
										type : 'hbox',
										defaultMargins : {
											top : 0,
											right : 5,
											bottom : 0,
											left : 0
										}
									}
								},
								items : [agrid]
							}, {
								xtype : 'fieldset',
								title : panelSRO1045,
								collapsible : true,
								defaults : {
									labelWidth : 89,
									anchor : '100%',
									labelAlign : 'right',
									layout : {
										type : 'hbox',
										defaultMargins : {
											top : 0,
											right : 5,
											bottom : 0,
											left : 0
										}
									}
								},
								items : [{
									xtype : 'fieldcontainer',
									combineErrors : false,
									defaults : {
										hideLabel : true
									},
									items : [{
												xtype : 'displayfield',
												value : panelSRO1195 + ':'
											}, {
												// the width of this field in
												// the HBox layout is set
												// directly
												// the other 2 items are given
												// flex: 1, so will share the
												// rest of the space
												width : 50,
												xtype : 'combo',
												mode : 'local',
												id : 'choice_one',
												value : 'A',
												readOnly : true,
												fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
												triggerAction : 'all',
												forceSelection : true,
												editable : false,
												value : choice_one,
												name : 'choice_one',
												displayField : 'name',
												valueField : 'value',
												width : 70,
												queryMode : 'local',
												handler : function() {
													Ext.getCmp("choice_one");
												},
												listeners : {
													select : function(combo,
															record) {
														var obj = Ext
																.getCmp('pj_code');
														obj.reset();
													}
												},
												store : Ext.create(
														'Ext.data.Store', {
															fields : ['name',
																	'value'],
															data : [{
																		name : 'A:上角',
																		value : 'A'
																	}, {
																		name : 'B:上沙',
																		value : 'B'
																	}, {
																		name : 'C:乌沙',
																		value : 'C'
																	}]
														})
											}, {
												xtype : 'displayfield',
												value : panelSRO1197
											}, {
												width : 30,
												xtype : 'textfield',
												id : 'from_type',
												name : 'from_type',
												value : from_type,
												readOnly : true,
												fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
											}, {
												xtype : 'displayfield',
												value : panelSRO1196
											}, {
												name : 'year',
												xtype : 'numberfield',
												id : 'year',
												value : year,
												readOnly : true,
												fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
												width : 48,
												value : '13',
												minValue : 0
											}, {
												xtype : 'displayfield',
												value : panelSRO1198
											}, {
												xtype : 'textfield',
												name : 'version',
												fieldLabel : panelSRO1172,
												width : 30,
												id : 'version',
												value : '00',
												readOnly : true,
												fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
											}, {
												xtype : 'displayfield',
												value : panelSRO1199
											}, {
												xtype : 'button',
												text : CMD_OK,
												width : 40,
												handler : function() {
													var from_type = Ext
															.getCmp('from_type');
													if (from_type.isValid()) {
														var ChoiceOne = Ext
																.getCmp('choice_one')
																.getValue();
														var Year = Ext
																.getCmp('year')
																.getValue();
														var from_type = Ext
																.getCmp('from_type')
																.getValue();

														Ext.Ajax.request({
															url : CONTEXT_PATH
																	+ '/sales/poreceipt.do?method=lastno',
															params : {
																ChoiceOne : ChoiceOne,
																Year : Year,
																from_type : from_type
															},
															success : function(
																	result,
																	request) {
																var from_type = Ext
																		.getCmp('from_type')
																		.getValue();
																var Version = Ext
																		.getCmp('version')
																		.getValue();
																var result = result.responseText;
																var str = result;
																var num = Number(str);

																if (str.length == 3) {
																	num = '0'
																			+ num;
																} else if (str.length == 2) {
																	num = '00'
																			+ num;
																} else if (str.length == 1) {
																	num = '000'
																			+ num;
																} else {
																	num = num
																			% 10000;
																}

																Ext
																		.getCmp('pj_code')
																		.setValue("J"
																				+ ChoiceOne
																				+ from_type
																				+ Year
																				+ "-"
																				+ num
																				+ "-"
																				+ Version
																				+ "S");

															},
															failure : extjsUtil.failureMessage
														});
													} else {
														Ext.MessageBox
																.alert(
																		error_msg_prompt,
																		error_msg_content);
													}
												}
											}, {
												xtype : 'textfield',
												anchor : '100%',
												name : 'pj_code',
												id : 'pj_code',
												width : 110,
												readOnly : true,
												allowBlank : false
											}]
								}]
							}, {
								xtype : 'fieldset',
								title : panelSRO1002,
								collapsible : true,
								defaultType : 'textfield',
								layout : 'anchor',
								defaults : {
									anchor : '100%'
								},
								items : [{
									xtype : 'container',
									layout : 'hbox',
									items : [{
												xtype : 'container',
												flex : 1,
												border : false,
												layout : 'anchor',
												defaultType : 'textfield',
												defaults : {
													labelWidth : 90,
													labelAlign : 'right',
													anchor : '95%'
												},
												items : myItems
											}, { // 두번째 컬럼
												xtype : 'container',
												flex : 1,
												layout : 'anchor',
												defaultType : 'textfield',
												defaults : {
													labelWidth : 90,
													labelAlign : 'right',
													anchor : '95%'
												},
												items : [{
													fieldLabel : getColName('pj_type'),
													name : 'pj_type',
													readOnly : true,
													fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
													value : pj_type,
													xtype : 'textfield'
												}, {
													fieldLabel : getColName('pj_name'),
													name : 'pj_name',
													readOnly : true,
													fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
													value : pj_name,
													xtype : 'textfield'
												}, {
													fieldLabel : getColName('delivery_plan'),
													name : 'delivery_plan',
													format : 'Y-m-d',
													submitFormat : 'Y-m-d',// 'Y-m-d
																			// H:i:s',
													dateFormat : 'Y-m-d',// 'Y-m-d
																			// H:i:s'
													value : Ext.Date.add(
															new Date(),
															Ext.Date.DAY, 15),
													allowBlank : false,
													xtype : 'datefield'
												}, {
													fieldLabel : getColName('pm_uid'),
													id : 'user_name',
													name : 'pm_uid',
													xtype : 'combo',
													store : storeSrch,
													displayField : 'user_name',
													valueField : 'unique_id',
													typeAhead : false,
													allowBlank : false,
													minChars : 1,
													listConfig : {
														loadingText : 'Searching...',
														emptyText : 'No matching posts found.',
														getInnerTpl : function() {
															return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
														}
													}
												}, {
													fieldLabel : getColName('cav_no'),
													name : 'cav_no',
													value : cav_no,
													readOnly : true,
													fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
												}, {
													fieldLabel : getColName('mold_type'),
													name : 'mold_type',
													value : mold_type,
													readOnly : true,
													fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;'
												}, {
													xtype : 'combo',
													mode : 'local',
													triggerAction : 'all',
													forceSelection : true,
													editable : false,
													readOnly : true,
													fieldStyle : 'background-color: #F0F0F0; background-image: none; font-weight:normal; font-size: 12px;',
													fieldLabel : getColName('newmodcont'),
													name : 'newmodcont',
													displayField : 'name',
													valueField : 'value',
													queryMode : 'local',
													value : 'N',
													store : Ext.create(
															'Ext.data.Store', {
																fields : [
																		'name',
																		'value'],
																data : [{
																	name : panelSRO1200,
																	value : 'N'
																}]
															})
												}, {
													xtype : 'checkboxfield',
													id : 'checkMold',
													fieldLabel : sro1_bom_copby,
													checked : true,
													listeners : {
														change : function(
																checkbox,
																checked) {
															console_log(checked);
															if (checked == false) {
																Ext
																		.getCmp('checkMold')
																		.setValue(false);
															} else {
																Ext
																		.getCmp('checkMold')
																		.setValue(true);
															}
														}
													}
												}]
											}]
								}]
							}]
				});

				var win = Ext.create('ModalWindow', {
					title : CMD_ADD + ' :: ' + /* (G) */vCUR_MENU_NAME,
					width : 800,
					height : 600,// 480,
					minWidth : 250,
					minHeight : 180,
					layout : 'fit',
					plain : true,
					items : form,
					buttons : [{
						text : CMD_OK,
						handler : function() {
							var form = Ext.getCmp('formPanel').getForm();
							if (form.isValid()) {
								var checkMold = Ext.getCmp('checkMold')
										.getValue();
								if (checkMold == true) {
									var waring = Ext.Msg.confirm('Confirm Box',
											sro1_comment_true, function(
													buttonText) {
												if (buttonText == "yes") {
													agrid.getSelectionModel()
															.selectAll();
													var aselections = agrid
															.getSelectionModel()
															.getSelection();
													if (aselections) {
														for (var i = 0; i < aselections.length; i++) {
															var rec = agrid
																	.getSelectionModel()
																	.getSelection()[i];
															ahid_userlist[i] = rec
																	.get('usrast_unique_id');
															ahid_userlist_role[i] = rec
																	.get('gubun');
														}
														Ext
																.getCmp('hid_userlist')
																.setValue(ahid_userlist);
														Ext
																.getCmp('hid_userlist_role')
																.setValue(ahid_userlist_role);
													}// end if
													var val = form
															.getValues(false);
													var projectmold = Ext.ModelManager
															.create(val,
																	'ProjectMold');
													var pj_code = Ext
															.getCmp('pj_code')
															.getValue();
													projectmold.set(
															'file_itemcode',
															vFILE_ITEM_CODE);
													projectmold.set(
															'checkMold', 'yes');
													// 중복 코드 체크
													Ext.Ajax.request({
														url : CONTEXT_PATH
																+ '/sales/poreceipt.do?method=checkCode',
														params : {
															pj_code : pj_code
														},
														success : function(
																result, request) {
															form.submit({
																url : CONTEXT_PATH
																		+ '/uploader.do?method=multi&file_itemcode='
																		+ /* (G) */vFILE_ITEM_CODE,
																waitMsg : 'Uploading Files...',
																success : function(
																		fp, o) {
																	var ret = result.responseText;
																	if (ret == 0
																			|| ret == '0') {
																		// 저장 수정
																		projectmold
																				.save(
																						{
																							success : function() {
																								if (win) {
																									win
																											.close();
																									store
																											.load(
																													function() {
																													});
																								}
																							}
																						});
																		if (win) {
																			win
																					.close();
																		}
																	} else {
																		Ext.MessageBox
																				.alert(
																						'Duplicated Code',
																						'check '
																								+ getColName('pj_code')
																								+ ' value.');
																	}
																},
																failure : function() {
																	console_log('failure');
																	Ext.MessageBox
																			.alert(
																					error_msg_prompt,
																					'Failed');
																}
															});
															console_log('requested ajax...');
														},
														failure : extjsUtil.failureMessage
													});
												}
												if (buttonText == "no") {
													waring.close();
												}
											});
								} else {
									Ext.Msg.confirm('Confirm Box',
											sro1_comment_false, function(
													buttonText) {
												if (buttonText == "yes") {
													agrid.getSelectionModel()
															.selectAll();
													var aselections = agrid
															.getSelectionModel()
															.getSelection();
													if (aselections) {
														for (var i = 0; i < aselections.length; i++) {
															var rec = agrid
																	.getSelectionModel()
																	.getSelection()[i];
															ahid_userlist[i] = rec
																	.get('usrast_unique_id');
															ahid_userlist_role[i] = rec
																	.get('gubun');
														}
														Ext
																.getCmp('hid_userlist')
																.setValue(ahid_userlist);
														Ext
																.getCmp('hid_userlist_role')
																.setValue(ahid_userlist_role);
													}// end if

													var val = form
															.getValues(false);
													var projectmold = Ext.ModelManager
															.create(val,
																	'ProjectMold');
													var pj_code = Ext
															.getCmp('pj_code')
															.getValue();
													projectmold.set(
															'file_itemcode',
															vFILE_ITEM_CODE);
													projectmold.set(
															'checkMold', 'no');
													// 중복 코드 체크
													Ext.Ajax.request({
														url : CONTEXT_PATH
																+ '/sales/poreceipt.do?method=checkCode',
														params : {
															pj_code : pj_code
														},
														success : function(
																result, request) {
															form.submit({
																url : CONTEXT_PATH
																		+ '/uploader.do?method=multi&file_itemcode='
																		+ /* (G) */vFILE_ITEM_CODE,
																waitMsg : 'Uploading Files...',
																success : function(
																		fp, o) {
																	var ret = result.responseText;
																	if (ret == 0
																			|| ret == '0') {
																		// 저장 수정
																		projectmold
																				.save(
																						{
																							success : function() {
																								if (win) {
																									win
																											.close();
																									store
																											.load(
																													function() {
																													});
																								}
																							}
																						});
																		if (win) {
																			win
																					.close();
																		}
																	} else {
																		Ext.MessageBox
																				.alert(
																						'Duplicated Code',
																						'check '
																								+ getColName('pj_code')
																								+ ' value.');
																	}
																},
																failure : function() {
																	console_log('failure');
																	Ext.MessageBox
																			.alert(
																					error_msg_prompt,
																					'Failed');
																}
															});
															console_log('requested ajax...');
														},
														failure : extjsUtil.failureMessage
													});
												}
												if (buttonText == "no") {
													waring.close();
												}
											});
								}
							} else {
								Ext.MessageBox.alert(error_msg_prompt,
										error_msg_content);
							}
						}
					}, {
						text : CMD_CANCEL,
						handler : function() {
							if (win) {
								win.close();
							}

						}
					}]
				});
				win.show();
			});
		});
	}
});
