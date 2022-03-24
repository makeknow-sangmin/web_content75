/**
 * EMC1: Machine
 */
// global var.
var grid = null;
var store = null;

searchField = 
[
	{
		field_id: 'pcs_code'
		,store: 'ProcessNameStore'
		,displayField: 'systemCode'
		,valueField: 'systemCode'
		,width: 230
		,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName}</div>'
	},
	{
		field_id: 'group_code'
		,store: 'WorkGroupStore'
		,displayField: 'systemCode'
		,valueField: 'systemCode'
		,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName}</div>'
	}
];

var processNameStore = Ext.create('Mplm.store.ProcessNameStore', {} );

var workGroupStore = Ext.create('Mplm.store.WorkGroupStore', {} );

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

var viewHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	PcsMchn.load(unique_id, {
		success : function(pcsmchn) {

			var unique_id = pcsmchn.get('unique_id');
			var mchn_code = pcsmchn.get('mchn_code');
			var name_cn = pcsmchn.get('name_cn');
			var name_en = pcsmchn.get('name_en');
			var mchn_type = pcsmchn.get('mchn_type');
			var maker = pcsmchn.get('maker');
			var make_date = pcsmchn.get('make_date');
			var operator_uid = pcsmchn.get('operator_uid');

			var lineGap = 30;
			var form = Ext.create('Ext.form.Panel', {
				id : 'formPanel',
				layout : 'absolute',
				defaultType : 'displayfield',
				border : false,
				bodyPadding : 15,
				defaults : {
					anchor : '100%',
					//allowBlank : false,
					msgTarget : 'side',
					labelWidth : 100
				},
				items : [ {
					fieldLabel: getColName('unique_id'),
					value : unique_id,
					x : 5,
					y : 5 + 1 * lineGap,
					name : 'unique_id',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel: getColName('mchn_code'),
					value : mchn_code,
					x : 5,
					y : 5 + 2 * lineGap,
					name : 'mchn_code',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel: getColName('name_cn'),
					value : name_cn,
					x : 5,
					y : 5 + 3 * lineGap,
					name : 'name_cn',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel: getColName('name_en'),
					value : name_en,
					x : 5,
					y : 5 + 4 * lineGap,
					name : 'name_en',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel: getColName('mchn_type'),
					value : mchn_type,
					x : 5,
					y : 5 + 5 * lineGap,
					name : 'mchn_type',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel: getColName('maker'),
					value : maker,
					x : 5,
					y : 5 + 6 * lineGap,
					name : 'maker',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel: getColName('make_date'),
//					xtype : 'datefield',
					value : make_date,
					x : 5,
					y : 5 + 7 * lineGap,
					format: 'Y-m-d',
					submitFormat: 'Y-m-d',
					dateFormat:'Y-m-d',
					name : 'make_date',
					anchor : '-5' // anchor width by percentage
				}, {
					fieldLabel: getColName('operator_uid'),
					value : operator_uid,
					x : 5,
					y : 5 + 8 * lineGap,
					name : 'operator_uid',
					anchor : '-5' // anchor width by percentage
				} ]
			}); // endof form

			var win = Ext.create('ModalWindow', {
				title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
				width : 500,
				height : 400,
				minWidth : 250,
				minHeight : 180,
				layout : 'fit',
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
			win.show();
			// endofwin
		}// endofsuccess
	});// emdofload

};

var workerHandler =  function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	console_log(unique_id);

	PcsMchn.load(unique_id, {
						success : function(pcsmchn) {

							var unique_id = pcsmchn.get('unique_id');
							var mchn_code = pcsmchn.get('mchn_code');
							var lineGap = 30;

							var form = Ext.create(
											'Ext.form.Panel',
											{
												id : 'formPanel',
												layout : 'absolute',
												defaultType : 'textfield',
												border : false,
												bodyPadding : 15,
												defaults : {
													anchor : '100%',
													//allowBlank : false,
													msgTarget : 'side',
													labelWidth : 100
												},
												items : [
														{
															fieldLabel: getColName('unique_id'),
															value : unique_id,
															x : 5,
															y : 5 + 1 * lineGap,
															id : 'unique_id',
															name : 'unique_id',
															readOnly : true,
															fieldStyle : 'background-color: #ddd; background-image: none;',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel: getColName('mchn_code'),
															value : mchn_code,
															x : 5,
															y : 5 + 2 * lineGap,
															name : 'mchn_code',
															readOnly : true,
															fieldStyle : 'background-color: #ddd; background-image: none;',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														}
														,{
															fieldLabel: getColName('operator_name_day'),
															x : 5,
															y : 5 + 3 * lineGap,
															name : 'operator_uid_day',
															anchor : '-5', // anchor width by percentage
												            xtype: 'combo',
												            store: userStore,
												            displayField: 'user_name',
												            valueField:     'unique_id',
												            typeAhead: false,
										    	            listConfig: {
										     	                loadingText: 'Searching...',
										     	                emptyText: 'No matching posts found.',
										     	                // Custom rendering template for each item
										     	                getInnerTpl: function() {
										     	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
										     	                }
												            },
												            pageSize: 500
												        }
														,{
															fieldLabel: getColName('operator_name_night'),
															x : 5,
															y : 5 + 4 * lineGap,
															name : 'operator_uid_night',
															anchor : '-5', // anchor width by percentage
												            xtype: 'combo',
												            store: userStore,
												            displayField: 'user_name',
												            valueField:     'unique_id',
												            typeAhead: false,
										    	            listConfig: {
										     	                loadingText: 'Searching...',
										     	                emptyText: 'No matching posts found.',
										     	                // Custom rendering template for each item
										     	                getInnerTpl: function() {
										     	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
										     	                }
												            },
												            pageSize: 500
												        }
														,{
															fieldLabel: getColName('operator_name_mid'),
															x : 5,
															y : 5 + 5* lineGap,
															name : 'operator_uid_mid',
															anchor : '-5', // anchor width by percentage
												            xtype: 'combo',
												            store: userStore,
												            displayField: 'user_name',
												            valueField:     'unique_id',
												            typeAhead: false,
										    	            listConfig: {
										     	                loadingText: 'Searching...',
										     	                emptyText: 'No matching posts found.',
										     	                // Custom rendering template for each item
										     	                getInnerTpl: function() {
										     	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
										     	                }
												            },
												            pageSize: 500
												        }
														]
											}); // endof form

							var win = Ext.create('ModalWindow', {
								title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
								width : 500,
								height : 400,
								minWidth : 250,
								minHeight : 180,
								layout : 'fit',
								plain : true,
								items : form,
								buttons : [
										{
											text : CMD_OK,
											handler : function() {
												var form = Ext
														.getCmp(
																'formPanel')
														.getForm();
												if (form
														.isValid()) {
													var val = form
															.getValues(false);
													var pcsmchn = Ext.ModelManager
															.create(
																	val,
																	'PcsMchn');

													// 저장 수정
													pcsmchn.save({
																success : function() {
																	if (win) {
																		win
																				.close();
																		store
																				.load(function() {
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
																	error_msg_prompt,
																	 error_msg_content);
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
var editHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');

	console_log(unique_id);

	PcsMchn.load(unique_id, {
						success : function(pcsmchn) {

							var unique_id = pcsmchn.get('unique_id');
							var mchn_code = pcsmchn.get('mchn_code');
							var name_cn = pcsmchn.get('name_cn');
							var name_en = pcsmchn.get('name_en');
							var mchn_type = pcsmchn.get('mchn_type');
							var maker = pcsmchn.get('maker');
							var make_date = pcsmchn.get('make_date');
							var group_code = pcsmchn.get('group_code');
							var group_name = pcsmchn.get('group_name');
							var pcs_code = pcsmchn.get('pcs_code');
							var operator_uid_day = pcsmchn.get('operator_uid_day');
							var operator_uid_night = pcsmchn.get('operator_uid_night');
							var operator_uid_mid = pcsmchn.get('operator_uid_mid');
							var owner_name = pcsmchn.get('owner_name');
						   	 var formGroup_code = new Ext.form.Hidden({
								    id: 'group_code',
								   name: 'group_code',
								   value: group_code
								});
						   	var formOwner_name = new Ext.form.Hidden({
							    id: 'owner_name',
								   name: 'owner_name',
								   value: owner_name
								});
						   	
							var lineGap = 30;
							
							if(make_date!=null & make_date.length>10) {
								make_date = make_date.substring(0,10);
							}

							var form = Ext
									.create(
											'Ext.form.Panel',
											{
												id : 'formPanel',
												layout : 'absolute',
												url : 'aaaa',
												defaultType : 'textfield',
												border : false,
												bodyPadding : 15,
												defaults : {
													anchor : '100%',
													//allowBlank : false,
													msgTarget : 'side',
													labelWidth : 100
												},
												items : [
														{
															fieldLabel: getColName('unique_id'),
															value : unique_id,
															x : 5,
															y : 5 + 1 * lineGap,
															id : 'unique_id',
															name : 'unique_id',
															readOnly : true,
															fieldStyle : 'background-color: #ddd; background-image: none;',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel: getColName('mchn_code'),
															value : mchn_code,
															x : 5,
															y : 5 + 2 * lineGap,
															readOnly : true,
															name : 'mchn_code',
															fieldStyle : 'background-color: #ddd; background-image: none;',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														
														{
											                fieldLabel: getColName('pcs_code'),
															x : 5,
															y : 5 + 4 * lineGap,
												                id :'pcs_code',
												                name : 'pcs_code',
												                value: pcs_code,
												                   xtype: 'combo',
												                   mode: 'local',
												                   editable:false,
												                   //allowBlank: false,
												                   queryMode: 'remote',
												                   displayField:   'systemCode',
												                   valueField:     'systemCode',
												                   store: processNameStore,
													                listConfig:{
													                	getInnerTpl: function(){
													                		return '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName} / {codeNameEn}</div>';
													                	}			                	
													                },
													               triggerAction: 'all',
										         	               listeners: {
										         	                    select: function (combo, record) {
										         	                    	console_log('Selected Value : ' + combo.getValue());
										         	                    	var systemCode = record[0].get('systemCode');
										         	                    	var codeNameEn  = record[0].get('codeNameEn');
										         	                    	var codeName  = record[0].get('codeName');
										         	                    	console_log('systemCode : ' + systemCode 
										         	                    			+ ', codeNameEn=' + codeNameEn
										         	                    			+ ', codeName=' + codeName	);
										         	     
										         	                    	Ext.getCmp('name_cn').setValue(codeName);
										         	                    	Ext.getCmp('name_en').setValue(codeNameEn);
										         	                    	
										         	                    }
										         	               },
												                   anchor: '-5'  // anchor width by percentage
												            },
												            
												            {
																fieldLabel: getColName('name_cn'),
																value : name_cn,
																x : 5,
																y : 5 + 3 * lineGap,
																name : 'name_cn',
																id:  'name_cn',
																anchor : '-5' // anchor
																				// width
																				// by
																				// percentage
															},
														{
															fieldLabel: getColName('name_en'),
															value : name_en,
															x : 5,
															y : 5 + 5 * lineGap,
															name : 'name_en',
															id:  'name_en',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel: getColName('mchn_type'),
															value : mchn_type,
															x : 5,
															y : 5 + 6 * lineGap,
															name : 'mchn_type',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel: getColName('maker'),
															value : maker,
															x : 5,
															y : 5 + 7 * lineGap,
															name : 'maker',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														{
															fieldLabel: getColName('make_date'),
															xtype : 'datefield',
															value : make_date,
															x : 5,
															y : 5 + 8 * lineGap,
															name : 'make_date',
															format: 'Y-m-d',
														    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
															dateFormat: 'Y-m-d',// 'Y-m-d H:i:s',
															anchor : '-5' // anchor
																			// width
																			// by
																			// percentage
														},
														formGroup_code, formOwner_name,
														{
															fieldLabel: getColName('owner_name'),
															x : 5,
															y : 5 + 9 * lineGap,
															name : 'owner_uid',
															value : owner_name,
															anchor : '-5', // anchor width by percentage
												            xtype: 'combo',
												            store: userStore,
												            queryMode: 'remote',
												            displayField: 'user_name',
												            valueField:     'unique_id',
												            typeAhead: false,
												               triggerAction: 'all',
												               listeners: {
												                    select: function (combo, record) {
												                    	console_log('Selected Value : ' + combo.getValue());
												                    	var user_name = record[0].get('user_name');
												                    	console_log('user_name : ' + user_name);
												                    	formOwner_name.setValue(user_name);
												                    	
												                    }
												               },

											    	            listConfig: {
											     	                loadingText: 'Searching...',
											     	                emptyText: 'No matching posts found.',
											     	                // Custom rendering template for each item
											     	                getInnerTpl: function() {
											     	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
											     	                }
												            },
												            pageSize: 500
												        },
														{
															fieldLabel: getColName('group_name'),
															x : 5,
															y : 5 + 10 * lineGap,
															value: group_name,
															name : 'group_name',
															anchor : '-5',
															 xtype: 'combo',
											                 mode: 'local',
											                 editable:false,
											                 //allowBlank: false,
											                 queryMode: 'remote',
											                 displayField:   'codeName',
											                 valueField:     'codeName',
											                 store: workGroupStore,
												                listConfig:{
												                	getInnerTpl: function(){
												                		return '<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>';
												                	}			                	
												                },
												               triggerAction: 'all',
												               listeners: {
												                    select: function (combo, record) {
												                    	console_log('Selected Value : ' + combo.getValue());
												                    	var systemCode = record[0].get('systemCode');
												                    	var codeName  = record[0].get('codeName');
												                    	console_log('systemCode : ' + systemCode 
												                    			+ ', codeName=' + codeName	);
												                    	formGroup_code.setValue(systemCode);
												                    	
												                    }
												               }
														}
												        ,{
															fieldLabel: getColName('operator_name_day'),
															x : 5,
															y : 5 + 11 * lineGap,
															name : 'operator_uid_day',
															value : operator_uid_day,
															anchor : '-5', // anchor width by percentage
												            xtype: 'combo',
												            store: userStore,
												            displayField: 'user_name',
												            valueField:     'unique_id',
												            typeAhead: false,
										    	            listConfig: {
										     	                loadingText: 'Searching...',
										     	                emptyText: 'No matching posts found.',
										     	                // Custom rendering template for each item
										     	                getInnerTpl: function() {
										     	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
										     	                }
												            },
												            pageSize: 500
												        }
														,{
															fieldLabel: getColName('operator_name_night'),
															x : 5,
															y : 5 + 12 * lineGap,
															name : 'operator_uid_night',
															value : operator_uid_night,
															anchor : '-5', // anchor width by percentage
												            xtype: 'combo',
												            store: userStore,
												            displayField: 'user_name',
												            valueField:     'unique_id',
												            typeAhead: false,
										    	            listConfig: {
										     	                loadingText: 'Searching...',
										     	                emptyText: 'No matching posts found.',
										     	                // Custom rendering template for each item
										     	                getInnerTpl: function() {
										     	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
										     	                }
												            },
												            pageSize: 500
												        }
														,{
															fieldLabel: getColName('operator_name_mid'),
															x : 5,
															y : 5 + 13* lineGap,
															name : 'operator_uid_mid',
															value : operator_uid_mid,
															anchor : '-5', // anchor width by percentage
												            xtype: 'combo',
												            store: userStore,
												            displayField: 'user_name',
												            valueField:     'unique_id',
												            typeAhead: false,
										    	            listConfig: {
										     	                loadingText: 'Searching...',
										     	                emptyText: 'No matching posts found.',
										     	                // Custom rendering template for each item
										     	                getInnerTpl: function() {
										     	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
										     	                }
												            },
												            pageSize: 500
												        }
												        ]
											}); // endof form

							var win = Ext.create('ModalWindow', {
								title: CMD_MODIFY  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
								width : 500,
								height : 560,
								minWidth : 250,
								minHeight : 180,
								layout : 'fit',
								plain : true,
								items : form,
								buttons : [
										{
											text : CMD_OK,
											handler : function() {
												var form = Ext
														.getCmp(
																'formPanel')
														.getForm();
												if (form
														.isValid()) {
													var val = form
															.getValues(false);
													var pcsmchn = Ext.ModelManager
															.create(
																	val,
																	'PcsMchn');

													// 저장 수정
													pcsmchn.save({
																success : function() {
																	if (win) {
																		win
																				.close();
																		store
																				.load(function() {
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
																	error_msg_prompt,
																	 error_msg_content);
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


function deleteConfirm(btn) {

	var selections = grid.getSelectionModel().getSelection();
	if (selections) {
		var result = MessageBox.msg('{0}', btn);
		if (result == 'yes') {
			for ( var i = 0; i < selections.length; i++) {
				var rec = selections[i];
				var unique_id = rec.get('unique_id');
				var pcsmchn = Ext.ModelManager.create({
					unique_id : unique_id
				}, 'PcsMchn');

				pcsmchn.destroy({
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
	text : CMD_DELETE,
	disabled : fPERM_DISABLING(),
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

// Define Remove Action
var addAction = Ext.create('Ext.Action', {
	iconCls : 'add',
	text : CMD_ADD,
	disabled: fPERM_DISABLING(),
	handler : function(widget, event) {
		
   	 var formGroup_code = new Ext.form.Hidden({
		    id: 'group_code',
		   name: 'group_code'
		});
   	var formOwner_name = new Ext.form.Hidden({
	    id: 'owner_name',
		   name: 'owner_name'
		});
		var lineGap = 30;
		var form = Ext.create('Ext.form.Panel', {
			id : 'formPanel',
			layout : 'absolute',
			defaultType : 'textfield',
			border : false,
			bodyPadding : 15,
			defaults : {
				anchor : '100%',
				allowBlank : true,
				msgTarget : 'side',
				labelWidth : 100
			},
			items : [ {
	                fieldLabel: getColName('pcs_code'),
					x : 5,
					y : 5,
		                id :'pcs_code',
		                name : 'pcs_code',
		                   xtype: 'combo',
		                   mode: 'local',
		                   editable:false,
		                   //allowBlank: false,
		                   queryMode: 'remote',
		                   displayField:   'systemCode',
		                   valueField:     'systemCode',
		                   store: processNameStore,
			                listConfig:{
			                	getInnerTpl: function(){
			                		return '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName} / {codeNameEn}</div>';
			                	}			                	
			                },
			               triggerAction: 'all',
         	               listeners: {
         	                    select: function (combo, record) {
         	                    	console_log('Selected Value : ' + combo.getValue());
         	                    	var systemCode = record[0].get('systemCode');
         	                    	var codeNameEn  = record[0].get('codeNameEn');
         	                    	var codeName  = record[0].get('codeName');
         	                    	console_log('systemCode : ' + systemCode 
         	                    			+ ', codeNameEn=' + codeNameEn
         	                    			+ ', codeName=' + codeName	);
         	     
         	                    	Ext.getCmp('name_cn').setValue(codeName);
         	                    	Ext.getCmp('name_en').setValue(codeNameEn);
         	                    	
         	                    }
         	               },
		                   anchor: '-5'  // anchor width by percentage
		            },
		     {
				fieldLabel: getColName('name_cn'),
				x : 5,
				y : 5 + 1 * lineGap,
				name : 'name_cn',
				id : 'name_cn',
				anchor : '-5' // anchor width by percentage
			}, {
				fieldLabel: getColName('name_en'),
				x : 5,
				y : 5 + 2 * lineGap,
				name : 'name_en',
				id : 'name_en',
				anchor : '-5' // anchor width by percentage
			}, 		            {
				fieldLabel: getColName('mchn_code'),
				x : 5,
				y : 5 + 3 * lineGap,
				name : 'mchn_code',
				id : 'mchn_code',
				anchor : '-5' // anchor width by percentage
			},{
				fieldLabel: getColName('mchn_type'),
				x : 5,
				y : 5 + 4 * lineGap,
				name : 'mchn_type',
				anchor : '-5' // anchor width by percentage
			}, {
				fieldLabel: getColName('maker'),
				x : 5,
				y : 5 + 5 * lineGap,
				name : 'maker',
				anchor : '-5' // anchor width by percentage
			}, {
				fieldLabel: getColName('make_date'),
				xtype : 'datefield',
				x : 5,
				y : 5 + 6 * lineGap,
				name : 'make_date',
				format: 'Y-m-d',
			    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				dateFormat: 'Y-m-d',// 'Y-m-d H:i:s',
				anchor : '-5' // anchor width by percentage
			}, 
			formGroup_code, formOwner_name
			,{
				fieldLabel: getColName('owner_name'),
				x : 5,
				y : 5 + 7 * lineGap,
				name : 'owner_uid',
				anchor : '-5', // anchor width by percentage
	            xtype: 'combo',
	            store: userStore,
	            displayField: 'user_name',
	            valueField:     'unique_id',
	            typeAhead: false,
	               triggerAction: 'all',
	               listeners: {
	                    select: function (combo, record) {
	                    	console_log('Selected Value : ' + combo.getValue());
	                    	var user_name = record[0].get('user_name');
	                    	console_log('user_name : ' + user_name);
	                    	formOwner_name.setValue(user_name);
	                    	
	                    }
	               },

   	            listConfig: {
 	                loadingText: 'Searching...',
 	                emptyText: 'No matching posts found.',
 	                // Custom rendering template for each item
 	                getInnerTpl: function() {
 	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
 	                }
	            },
	            pageSize: 500
	        },
			{
				fieldLabel: getColName('group_name'),
				x : 5,
				y : 5 + 8 * lineGap,
				name : 'group_name',
				anchor : '-5',
				 xtype: 'combo',
                 mode: 'local',
                 editable:false,
                 //allowBlank: false,
                 queryMode: 'remote',
                 displayField:   'codeName',
                 valueField:     'codeName',
                 store: workGroupStore,
	                listConfig:{
	                	getInnerTpl: function(){
	                		return '<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>';
	                	}			                	
	                },
	               triggerAction: 'all',
	               listeners: {
	                    select: function (combo, record) {
	                    	console_log('Selected Value : ' + combo.getValue());
	                    	var systemCode = record[0].get('systemCode');
	                    	var codeName  = record[0].get('codeName');
	                    	console_log('systemCode : ' + systemCode 
	                    			+ ', codeName=' + codeName	);
	                    	formGroup_code.setValue(systemCode);
	                    	
	                    }
	               }
			}
			,{
				fieldLabel: getColName('operator_name_day'),
				x : 5,
				y : 5 + 9 * lineGap,
				name : 'operator_uid_day',
				anchor : '-5', // anchor width by percentage
	            xtype: 'combo',
	            store: userStore,
	            displayField: 'user_name',
	            valueField:     'unique_id',
	            typeAhead: false,
	            listConfig: {
 	                loadingText: 'Searching...',
 	                emptyText: 'No matching posts found.',
 	                // Custom rendering template for each item
 	                getInnerTpl: function() {
 	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
 	                }
	            },
	            pageSize: 500
	        }
			,{
				fieldLabel: getColName('operator_name_night'),
				x : 5,
				y : 5 + 10 * lineGap,
				name : 'operator_uid_night',
				anchor : '-5', // anchor width by percentage
	            xtype: 'combo',
	            store: userStore,
	            displayField: 'user_name',
	            valueField:     'unique_id',
	            typeAhead: false,
	            listConfig: {
 	                loadingText: 'Searching...',
 	                emptyText: 'No matching posts found.',
 	                // Custom rendering template for each item
 	                getInnerTpl: function() {
 	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
 	                }
	            },
	            pageSize: 500
	        }
			,{
				fieldLabel: getColName('operator_name_mid'),
				x : 5,
				y : 5 + 11* lineGap,
				name : 'operator_uid_mid',
				anchor : '-5', // anchor width by percentage
	            xtype: 'combo',
	            store: userStore,
	            displayField: 'user_name',
	            valueField:     'unique_id',
	            typeAhead: false,
	            listConfig: {
 	                loadingText: 'Searching...',
 	                emptyText: 'No matching posts found.',
 	                // Custom rendering template for each item
 	                getInnerTpl: function() {
 	                    return '<div data-qtip="{dept_code}">[{dept_name}] {user_name}</div>';
 	                }
	            },
	            pageSize: 500
	        }
			]
		});

		var win = Ext.create('ModalWindow', {
			title : 'Add ' + ' :: ' + /*(G)*/vCUR_MENU_NAME,
			width : 500,
			height : 430,
			minWidth : 250,
			minHeight : 180,
			layout : 'fit',
			plain : true,
			items : form,
			buttons : [ {
				text : CMD_OK,
				handler : function() {
					
					var form = Ext.getCmp('formPanel').getForm();
					if (form.isValid()) {
						var val = form.getValues(false);
						var pcsmchn = Ext.ModelManager.create(val, 'PcsMchn');
						
						var code = Ext.getCmp('mchn_code').getValue();
						console_log('mchn_code=' + code);
						
						//중복 코드 체크
    					Ext.Ajax.request({
       						url: CONTEXT_PATH + '/production/machine.do?method=checkCode',				
            				params:{
            					code : code
            				},
       						
       						success : function(result, request) {
       							
       							var ret = result.responseText;
       							console_log(ret);
       							
       							if(ret == 0 ||  ret  == '0') {
       								// 저장 수정
       								pcsmchn.save({
       									success : function() {
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
       								Ext.MessageBox.alert('Duplicated Code', 'check ' + getColName('mchn_code') + ' value.'); 
       							}
       							console_log('requested ajax...');
       						},
       						failure: extjsUtil.failureMessage
       					}); 
       					 

					} else {
						Ext.MessageBox.alert(error_msg_prompt,  error_msg_content);
					}

				}
			}, {
				text : CMD_CANCEL,
				handler : function() {
					if (win) {
						win.close();
					}
				}
			} ]
		});
		win.show(this, function() {
		});
	}
});

// Define Delete Action
var editAction = Ext.create('Ext.Action', {
	itemId : 'editButton',
	iconCls : 'pencil',
	text : CMD_MODIFY,
	disabled : true,
	handler : editHandler
});

//작업자 지정
var workerAction = Ext.create('Ext.Action', {
	itemId : 'workerButton',
	iconCls : 'Role',
	text : CMD_WORKER,
	disabled : true,
	handler : workerHandler
});

var searchAction = Ext.create('Ext.Action', {
	itemId : 'searchButton',
	iconCls : 'search',
	text: CMD_SEARCH,
	disabled : false,
	handler : searchHandler
});

// Define Detail Action
var detailAction = Ext.create('Ext.Action', {
	itemId : 'detailButton',
	iconCls : 'application_view_detail',
	text : CMD_VIEW,
	disabled : true,
	handler : viewHandler
});

// Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
	items : [ detailAction, editAction, removeAction ]
});

Ext.define('PcsMchn', {
	extend: 'Ext.data.Model',
	fields: /*(G)*/vCENTER_FIELDS,
	proxy: {
		type : 'ajax',
		api : {
			read : CONTEXT_PATH + '/production/machine.do?method=read',
			create : CONTEXT_PATH + '/production/machine.do?method=create',
			update : CONTEXT_PATH + '/production/machine.do?method=update',
			destroy : CONTEXT_PATH + '/production/machine.do?method=destroy'
		},
		reader : {
			type : 'json',
			root : 'datas',
			 totalProperty: 'count',
			successProperty : 'success'
		},
		writer : {
			type : 'singlepost',
			writeAllFields : false,
			root : 'datas'
		}
	}
});

Ext.onReady(function() {

	//create combo for search
	console_log('makeSrchToolbar');
	makeSrchToolbar(searchField);
	
	// PcsMchn Store 정의
	store = new Ext.data.Store({
		pageSize : getPageSize(),
		model : 'PcsMchn',
		sorters : [ {
			property : 'unique_id',
			direction : 'DESC'
		} ]
	});

store.load(function() {


		var selModel = Ext.create('Ext.selection.CheckboxModel', {
			listeners : {
				selectionchange : function(sm, selections) {
					grid.down('#removeButton').setDisabled(
							selections.length == 0);
				}
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

			dockedItems : [
               {
            	   dock : 'top',
            	   xtype : 'toolbar',
            	   items : [ searchAction, '-', addAction, '-',
            	            removeAction, '->', {
            		   iconCls : 'tasks-show-all',
            		   tooltip : 'All',
            		   toggleGroup : 'status'
            	   }, {
            		   iconCls : 'tasks-show-active',
            		   tooltip : 'Current',
            		   toggleGroup : 'status'
            	   }, {
            		   iconCls : 'tasks-show-complete',
            		   tooltip : 'Past',
            		   toggleGroup : 'status'
            	   }

            	   ]
               }
//               , {
//            	   xtype : 'toolbar',
//            	   items : /*(G)*/vSRCH_TOOLBAR
//               }

			],
			columns : /*(G)*/vCENTER_COLUMNS,
			viewConfig : {
				stripeRows : true,
				enableTextSelection : true,
				listeners : {
					'afterrender' : function(grid) {
						var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
						elments.each(function(el) {
									}, this);
							
						}
	            		,
					itemcontextmenu : function(view, rec, node, index, e) {
						e.stopEvent();
						contextMenu.showAt(e.getXY());
						return false;
					},
					itemdblclick : viewHandler

				}
			},
			title : getMenuTitle()//,
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
						
					}else{
						removeAction.enable();
						editAction.enable();
					}
					detailAction.enable();
				} else {
					if(fPERM_DISABLING()==true) {
						collapseProperty();//uncheck no displayProperty
						removeAction.disable();
						editAction.disable();
						
					}else{
						collapseProperty();//uncheck no displayProperty
						removeAction.disable();
						editAction.disable();
						
					}
					detailAction.enable();
				}
			}
		});
		
	    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
	        Ext.create('Ext.tip.ToolTip', config);
	    });
		// callback for finishing.
		cenerFinishCallback();
		}); //store load

});//OnReady
