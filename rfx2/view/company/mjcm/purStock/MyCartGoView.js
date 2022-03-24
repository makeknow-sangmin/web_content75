Ext.require([
	'Ext.data.*',
	'Ext.grid.*',
	'Ext.tree.*',
	'Ext.tip.*',
	'Ext.ux.CheckColumn'
]);

//불출요청 카트
Ext.define('Rfx2.view.company.mjcm.purStock.MyCartGoView', {
	extend: 'Rfx2.base.BaseView',
	xtype: 'my-cart-go-view',


	initComponent: function () {

		//검색툴바 필드 초기화
		this.initSearchField();
		//검색툴바 추가
		//this.addSearchField('unique_id');
		this.setDefComboValue('standard_flag', 'valueField', 'R');

		Ext.each(this.columns, function (columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			console_logs('dataIndex', dataIndex);
			switch (dataIndex) {
				case 'pr_quan':
					columnObj["editor"] = {};
					columnObj["css"] = 'edit-cell';
					columnObj["renderer"] = function (value, meta) {
						meta.css = 'custom-column';

						return value;
					};
					break;
			}

		});

		this.addSearchField('item_code');
		this.addSearchField('item_name');
		this.addSearchField('specification');
		this.addSearchField(
			{
				type: 'combo'
				, width: 175
				, field_id: 'supplier_information'
				, store: "SupastStore"
				, displayField: 'supplier_name'
				, valueField: 'supplier_code'
				, emptyText: '공급사'
				, innerTpl: '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>'

			});

		this.addCallback('CHECK_SP_CODE', function (combo, record) {
			gm.me().refreshStandard_flag(record);
		});

		//Readonly Field 정의
		this.initReadonlyField();
		this.addReadonlyField('unique_id');
		this.addReadonlyField('create_date');

		//검색툴바 생성
		var searchToolbar = this.createSearchToolbar();

		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();

		// remove the items
		(buttonToolbar.items).each(function (item, index, length) {
			if (index == 3 || index == 1 || index == 2) {
				buttonToolbar.items.remove(item);
			}

		});

		//부자재 선택시 구분(sg_code) disabled로 이벤트처리
		this.addCallback('GET_OLD_VALUE', function (record) {

			console_logs('addCallback GET_OLD_VALUE>>>>>>>>>', record);

			gm.me().getValue = record; // 이전 값
			var old_value = record.value;
			gm.me().getValue = old_value;

			console_logs('old_value>>>>>>>>>>>>>>>', old_value);
			console_logs('gm.me().getValue>>>>>>>>>>>>>>>', gm.me().getValue);


		});

		//console_logs('this.fields', this.fields);

		this.createStore('Rfx.model.MyCartLineSrcahdGo', [{
			property: 'unique_id',
			direction: 'DESC'
		}],
			gm.pageSize/*pageSize*/
			//order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
			, {
				item_code_dash: 's.item_code',
				comment: 's.comment1'
			},
			['mycart']
		);

		//grid 생성.
		this.createGrid(searchToolbar, buttonToolbar);

		this.createCrudTab();

		Ext.apply(this, {
			layout: 'border',
			items: [this.grid, this.crudTab]
		});


		this.reReceiveAction = Ext.create('Ext.Action', {
			iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			text: '불출요청',
			disabled: true,
			handler: function () {
				var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
				var rec = selections[0];
				var email = rec.get('board_email');

				var reciveForm = Ext.create('Ext.form.Panel', {
					id: 'formPanelRecive',
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
						{
							fieldLabel: '불출요청일',
							name: 'req_date',
							allowBlank: false,
							xtype: 'datefield',
							value: new Date(),
                            format: 'Y-m-d',// 'Y-m-d H:i:s',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
							anchor: '100%'
						}
					]
				});

				var win = Ext.create('ModalWindow', {
					title: '',
					width: 350,
					height: 120,
					items: reciveForm,
					buttons: [{
						text: CMD_OK,
						handler: function () {
							var form = Ext.getCmp('formPanelRecive').getForm();
							if (form.isValid()) {
								var val = form.getValues(false);
								var my_child = new Array();
								var selections = gm.me().grid.getSelectionModel().getSelection();
								if (selections.length) {
									var rec = selections[0];
									gm.me().rec = rec;
									var stoqty_uids = [];
									var pr_quans = [];
									var req_date = val['req_date'];
									var whs = [];
									var item_names = [];
									var childs = [];
									var mycart_uids = [];
									for (var i = 0; i < selections.length; i++) {
										var o = selections[i];
										mycart_uids.push(o.get('id'));
										stoqty_uids.push(o.get('stoqty_uid'));
										childs.push(o.get('child'));
										whs.push(o.get('wh_qty'));
										pr_quans.push(o.get('pr_quan'));
										item_names.push(o.get('item_name'));
										console_logs("stoqty_uids>>>" + stoqty_uids);
										console_logs("pr_quans>>>>>>>" + pr_quans);
									}

									Ext.MessageBox.show({
										title: '확인',
										msg: '요청 하시겠습니까?',
										buttons: Ext.MessageBox.YESNO,
										fn: function (result) {
											if (result == 'yes') {
												if (pr_quans.length > 0) {

													Ext.Ajax.request({
														url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequestGo',
														params: {
															mycart_uids: mycart_uids,
															stoqty_uids: stoqty_uids,
															child: childs,
															pr_quan: pr_quans,
															item_name: item_names[0],
															wh_qtys: whs,
															reserved1: 'Y',
															req_date: req_date
														},
														success: function (result, request) {
															gm.me().store.load();
															if (win) {
																win.close();
															}
															Ext.Msg.alert('안내', '요청하었습니다.', function () { });
														},//endofsuccess
														failure: extjsUtil.failureMessage
													});//endofajax
												} else {
													Ext.Msg.alert('다시 입력', '요청수량을 입력해주세요.');
												}
											}
										},
										//animateTarget: 'mb4',
										icon: Ext.MessageBox.QUESTION
									});
								}//endof if selectios
							} else {
								Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
							}
						}//endofhandler
					}, {
						text: CMD_CANCEL,
						handler: function () {
							if (win) {
								win.close();
							}
						}
					}
					],
					icon: Ext.MessageBox.QUESTION
				});
				win.show();
			}
		});

		//구매요청 Action 생성
		// this.reReceiveAction = Ext.create('Ext.Action', {
		// 	iconCls: 'mfglabs-retweet_14_0_5395c4_none',
		// 	text: '불출 요청',
		// 	tooltip: '불출 요청',
		// 	disabled: true,
		// 	handler: function () {
		// 		var my_child = new Array();

		// 		var selections = gm.me().grid.getSelectionModel().getSelection();

		// 		console_logs('selections>>불출요청 in', selections);
		// 		if (selections.length) {
		// 			var rec = selections[0];
		// 			gm.me().rec = rec;
		// 			var stoqty_uids = [];
		// 			var pr_quans = [];
		// 			var whs = [];
		// 			var item_names = [];
		// 			var childs = [];
		// 			var mycart_uids = [];
		// 			for (var i = 0; i < selections.length; i++) {
		// 				var o = selections[i];
		// 				mycart_uids.push(o.get('id'));
		// 				stoqty_uids.push(o.get('stoqty_uid'));
		// 				childs.push(o.get('child'));
		// 				whs.push(o.get('wh_qty'));
		// 				pr_quans.push(o.get('pr_quan'));
		// 				item_names.push(o.get('item_name'));
		// 				console_logs("stoqty_uids>>>" + stoqty_uids);
		// 				console_logs("pr_quans>>>>>>>" + pr_quans);
		// 			}

		// 			Ext.MessageBox.show({
		// 				title: '확인',
		// 				msg: '요청 하시겠습니까?',
		// 				buttons: Ext.MessageBox.YESNO,
		// 				fn: function (result) {
		// 					if (result == 'yes') {
		// 						if (pr_quans.length > 0) {
		//         	        		/*if(pr_quans = 1){
		//             	        		var stock_qty = gm.me().vSELECTED_WH_QTYS;
		// 		          	    		gm.me().getUsefulQty(pr_quans,stock_qty);
		//             	        	}*/
		// 							Ext.Ajax.request({
		// 								url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequestGo',
		// 								params: {
		// 									mycart_uids: mycart_uids,
		// 									stoqty_uids: stoqty_uids,
		// 									child: childs,
		// 									pr_quan: pr_quans,
		// 									item_name: item_names[0],
		// 									wh_qtys: whs,
		// 									reserved1: 'Y'
		// 								},

		// 								success: function (result, request) {
		// 									gm.me().store.load();
		// 									Ext.Msg.alert('안내', '요청하었습니다.', function () { });

		// 								},//endofsuccess
		// 								failure: extjsUtil.failureMessage
		// 							});//endofajax
		// 						} else {
		// 							Ext.Msg.alert('다시 입력', '요청수량을 입력해주세요.');
		// 						}

		// 					}
		// 				},
		// 				//animateTarget: 'mb4',
		// 				icon: Ext.MessageBox.QUESTION
		// 			});

		// 		}//endof if selectios
		// 	}
		// });





		//버튼 추가.
		// buttonToolbar.insert(6, this.outGoAction);
		//buttonToolbar.insert(6, this.createPoAction);
		//buttonToolbar.insert(6, '-');
		buttonToolbar.insert(3, this.reReceiveAction);
		buttonToolbar.insert(3, '-');
		this.callParent(arguments);


		//grid를 선택했을 때 Callback
		this.setGridOnCallback(function (selections) {
			if (selections.length) {
				var rec = selections[0];
				gm.me().rec = rec;
				console_logs('rec data------------------', rec);
				uids = [];
				var q = [];
				var q1 = [];
				var my_child = [];
				var whArr = [];
				for (var i = 0; i < selections.length; i++) {
					var o = selections[i];

					var srcahd_uid = o.get('unique_id');
					var pr_quans = o.get('pr_quan');
					var item_name = o.get('item_name');
					var child = o.get('child');
					var wh_qty = o.get('wh_qty');
					uids.push(srcahd_uid);
					q.push(pr_quans);
					q1.push(item_name);
					my_child.push(child);
					whArr.push(wh_qty);
					gm.me().vSELECTED_WH_QTYS = whArr;
					gm.me().vSELECTED_PR_QUANS = q;
					console_logs('q------------------', q);
					console_logs('q1------------------', q1);
					console_logs('uids------------------', uids);
				}
				gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
				gm.me().vSELECTED_item_code = rec.get('item_code');    // 품번
				gm.me().vSELECTED_item_name = rec.get('item_name');    // 품명
				gm.me().vSELECTED_SRCAHD_UID = rec.get('child');
				gm.me().vSELECTED_STOQTY_UID = rec.get('stoqty_uid');
				gm.me().vSELECTED_STOCK_QTY = rec.get('stock_qty');

				gm.me().reReceiveAction.enable();
			} else {

				gm.me().reReceiveAction.disable();
			}
		})

		//디폴트 로드
		gMain.setCenterLoading(false);
		this.store.load(function (records) { });
	},
	items: [],
	matType: 'RAW',
	stockviewType: "ALL",
	refreshStandard_flag: function (record) {
		console_logs('val', record);
		var spcode = record.get('systemCode');
		var s_flag = spcode.substring(0, 1);
		console_logs('spcode', s_flag);


		var target = this.getInputTarget('standard_flag');
		target.setValue(s_flag);

	},
	treatPo: function () {
		var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
		console_logs('uniqueId>>>', uniqueId);

		var next = gUtil.getNextday(0);

		var request_date = gm.me().request_date;
		var form = null;

		if (uniqueId == undefined || uniqueId < 0) {
			alert("선택된 자재가 없습니다.");
		} else {
			this.treatPaperAddPoRoll();
		}
	},
	editRedord: function (field, rec) {
		console_logs('====> 요기요??');
		console_logs('====> edited field', field);
		console_logs('====> edited record', rec);
		var old_value = 0;
		switch (field) {
			case 'pr_quan':
				this.updateDesinComment(rec);
				break;
		}
	},

	getUsefulQty: function (pr_quan, stock_qty, reserved1) {
		console_logs('reserved1++++++++++++++(재수정은 Y)', reserved1);
		console_logs('pr_quan 받은 값', pr_quan);
		console_logs('stock_qty 받은 값', stock_qty);
		var stoqty_uid = gm.me().vSELECTED_STOQTY_UID;
		var Rest_qty = 0.0;
		/*if(reserved1 == 'Y'){ 
		var Rest_qty = stock_qty;	
		}else{*/
		var Rest_qty = stock_qty - pr_quan;
		//    		}
		console_logs('Rest_qty 계산 중', Rest_qty);
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/purchase/request.do?method=updateUsefulQty', //stoqty의 wh_qty를 수정한다.
			params: {
				stoqty_uid: stoqty_uid,
				Rest_qty: Rest_qty,
				reserved1: 'Y'
			},

			success: function (result, request) {


				gm.me().store.load(function () {
					gm.me().vSELECTED_AFTER_QTY = Rest_qty;
					console_logs('gm.me().vSELECTED_AFTER_QTY 계산 후 값', gm.me().vSELECTED_AFTER_QTY);
					gm.me().store.load();
					//    					gm.me().store.getProxy().setExtraParam('stock_qty', gm.me().vSELECTED_AFTER_QTY);
				});
			},//endofsuccess
			failure: extjsUtil.failureMessage
		});//endofajax
	},
	updateDesinComment: function (rec) {
		var stock_qty = 0;
		console_logs('rec>>>', rec);
		console_logs('gm.me().getValue 이전 수량>>>', gm.me().getValue);//이전 수량
		var old_value = gm.me().getValue;
		var child = gm.me().vSELECTED_UNIQUE_ID;
		var item_name = rec.get('item_name');
		var reserved1 = rec.get('reserved1');
		console_logs('reserved1>>>', reserved1);
		console_logs('child>>>', child);
		var child = rec.get('child');
		var pr_quan = rec.get('pr_quan');//새로 입력된 수량
		console_logs('pr_quan 새로 입력된 수량>>>', pr_quan);
		var assymap_uid = rec.get('assymap_uid');
		var wh_qty = rec.get('stoqty_stock_qty_useful');
		console_logs('stock_qty >>>> ', stock_qty);

		if (reserved1 == 'Y') {
			stock_qty = wh_qty + old_value;
		} else {
			stock_qty = wh_qty;
		}
		console_logs('====> 올드값이 더해진 stock_qty', stock_qty);
		console_logs('====> assymap_uid', assymap_uid);

		if (pr_quan > wh_qty) {
			Ext.Msg.alert('다시 입력', '요청수량은 가용재고를 초과할 수 없습니다.');
			pr_quan = rec.get('pr_quan');
			gm.me().store.load();
		} else {
			Ext.Ajax.request({
				url: CONTEXT_PATH + '/purchase/request.do?method=updateMyCartQty',
				params: {
					child: child,
					assymap_uid: assymap_uid,
					pr_quan: pr_quan
				},
				success: function (result, request) {
					var result = result.responseText;
					//console_logs("", result);
					// gm.me().showToast('결과', '[ ' + item_name + ' ]' + ' 의 요청 수량이  ' + pr_quan + ' 으로 변경되었습니다.');
					// console_logs('pr_quan 넘겨주는 값', pr_quan);
					// console_logs('stock_qty 넘겨주는 값', stock_qty);
					//gm.me().getUsefulQty(pr_quan, stock_qty, reserved1);
					//                   var after = gm.me().vSELECTED_AFTER_QTY;
					//                   console_logs("after 후", after);
					// gm.me().store.load();
					//                    	gm.me().store.getProxy().setExtraParam('stock_qty', Rest_qty);

				},
				failure: extjsUtil.failureMessage
			});
		}
	},
	treatPaperAddPoRoll: function () {
		form = Ext.create('Ext.form.Panel', {
			id: gu.id('formPanel'),
			xtype: 'form',
			frame: true,
			border: false,
			bodyPadding: 10,
			region: 'center',
			layout: 'column',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			defaults: {
				layout: 'form',
				xtype: 'container',
				defaultType: 'textfield',
				style: 'width: 50%'
			},
			items: [{
				xtype: 'fieldset',
				title: '마이 카트',
				width: 400,
				height: 400,
				margins: '0 20 0 0',
				collapsible: true,
				anchor: '100%',
				defaults: {
					labelWidth: 89,
					anchor: '100%',
					layout: {
						type: 'hbox',
						defaultMargins: { top: 0, right: 100, bottom: 0, left: 10 }
					}
				},
				items: [{
					fieldLabel: '품번',
					xtype: 'textfield',
					id: 'item_code',
					name: 'item_code',
					value: gm.me().vSELECTED_item_code,
					readOnly: true


				},
				{
					fieldLabel: '품명',
					xtype: 'textfield',
					id: 'item_code',
					name: 'item_code',
					value: gm.me().vSELECTED_item_name,
					readOnly: true


				}

				]




			}]
		})

		myHeight = 500;
		myWidth = 420;

		prwin = this.prwinopen(form);
	},
	// 구매요청 submit
	prwinopen: function (form) {
		prWin = Ext.create('Ext.Window', {
			modal: true,
			title: '구매요청',
			width: myWidth,
			height: myHeight,
			plain: true,
			items: form,
			buttons: [{
				text: CMD_OK,
				handler: function (btn) {
					var msg = '구매 요청하시겠습니까?'
					var myTitle = '구매요청 확인';
					Ext.MessageBox.show({
						title: myTitle,
						msg: msg,

						buttons: Ext.MessageBox.YESNO,
						icon: Ext.MessageBox.QUESTION,
						fn: function (btn) {
							if (btn == "yes") {
								var form = gu.getCmp('formPanel').getForm();
								//var form = gm.me().up('form').getForm();
								var po_user_uid = gm.me().vSELECTED_po_user_uid;
								console_logs('po_user_uid>>>>>>>>>>>>>', po_user_uid);
								//var catmapuid = gm.me().vSELECTED_UNIQUE_ID;
								var cartmaparr = [];
								var selections = gm.me().grid.getSelectionModel().getSelection();
								for (var i = 0; i < selections.length; i++) {
									var rec = selections[i];
									var uid = rec.get('id');
									console_logs('uid>>>>>>>>>>>>>', uid);
									cartmaparr.push(uid);
									console_logs('cartmaparr>>>>>>>>>>>>>', cartmaparr);
								}
								if (form.isValid()) {
									var val = form.getValues(false);

									console_logs('val', val);
									form.submit({
										url: CONTEXT_PATH + '/purchase/request.do?method=createheavy',
										params: {
											sancType: 'YES',
											//cartmapUid: catmapuid,
											cartmaparr: cartmaparr
										},
										success: function (val, action) {
											prWin.close();
											gm.me().store.load(function () { });

										},
										failure: function (val, action) {

											prWin.close();

										}
									})
								}  // end of formvalid 
							} else {

								prWin.close();
							} // btnIf of end
						}//fn function(btn)
					});//show
				}//btn handler
			}, {
				text: CMD_CANCEL,
				handler: function () {
					if (prWin) {

						prWin.close();

					}
				}
			}]
		});
		prWin.show();
	},
});



