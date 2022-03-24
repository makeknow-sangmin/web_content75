//주문작성

Ext.define('Rfx2.view.company.scon.groupWare.AccountsReceivableView', {
	extend: 'Rfx2.base.BaseView',
	xtype: 'account-receivable-view',
	initComponent: function () {


		//검색툴바 필드 초기화
		this.initSearchField();


		//명령툴바 생성
		var buttonToolbar = this.createCommandToolbar();

		console_logs('this.fields', this.fields);

		this.createStore('Rfx.model.AccountsPayableOut', [{
			property: 'unique_id',
			direction: 'DESC'
		}],
			gMain.pageSize/*pageSize*/
		);


		var arr = [];
		arr.push(buttonToolbar);
		//        arr.push(searchToolbar);

		var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
			/*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
			groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 구매 ({rows.length})</div>'
		});

		var option = {
			features: [groupingFeature]
		};



		//grid 생성.
		this.createGridCore(arr, option);

		// remove the items
		(buttonToolbar.items).each(function (item, index, length) {
			if (index == 0 || index == 1 || index == 2 || index == 3 || index == 4 || index == 5 || index == 11) {
				buttonToolbar.items.remove(item);
			}
		});

		this.salessettleAction = Ext.create('Ext.Action', {
			itemId: 'salessettleAction',
			iconCls: 'af-plus-circle',
			disabled: true,
			text: '매출정산',
			plain: true,
			handler: function (widget, event) {
				var selectedUids = [];
				var selections = gm.me().grid.getSelectionModel().getSelection();
				var item_abst = '';
				var pj_name = '';
				var sales_price_display = 0;
				if (selections.length > 0) {
					for (var i = 0; i < selections.length; i++) {
						var rec = selections[i];
						selectedUids.push(rec.get('unique_id_long'));
						if (i == 0) {
							item_abst = rec.get('pj_name') + ' 외 ' + (selections.length - 1) + '건';
							pj_name = rec.get('pj_name');
						}

						var supply_price = rec.get('supply_price');
						if(supply_price === 0) {
							Ext.MessageBox.alert('알림','공급가액이 입력이 되지 않는 항목이 있습니다.<br>다시 확인해주세요.');
							return;
						}
						sales_price_display = sales_price_display + rec.get('total_price');
					}
				}
				var wa_code = selections[0]['data']['wa_code'];
                var wa_name = selections[0]['data']['wa_name'];
				var txt_name = '[' + wa_code + '] ' + wa_name + ' - ' + (new Date()).getFullYear() + '년' + ((new Date()).getMonth() + 1) + '월';
				var myWidth = 700;
				var myHeight = 300;

				var formItem = [
					{
						fieldLabel: '정산 구분',
                        xtype: 'textarea',
                        anchor: '100%',
						padding: '0 0 5px 10px',
                        labelWidth: 80,
                        name: 'txt_name',
                        style: 'width: 95%',
                        value: txt_name
					},
					{
						xtype: 'datefield',
						id: gu.id('tax_bill_date'),
						name: 'tax_bill_date',
						padding: '0 0 5px 10px',
						labelWidth: 80,
						style: 'width: 95%',
						allowBlank: true,
						value : new Date(),
						fieldLabel: '세금 계산서',
						format: 'Y-m-d',
					},
					{
						fieldLabel: '현장명',
						xtype: 'textfield',
						anchor: '100%',
						padding: '0 0 5px 10px',
						labelWidth: 80,
						name: 'pj_name',
						readOnly : true,
						style : 'width: 95%',
						fieldStyle: 'width: 95%; background-color: #ebe8e8; background-image: none; text-align:left',
						value: pj_name
					},
					{
						fieldLabel: '합계금액',
						xtype: 'numberfield',
						anchor: '100%',
						padding: '0 0 5px 10px',
						labelWidth: 80,
						id: gu.id('sales_price_display'),
						name: 'sales_price_display',
						readOnly : false,
						style : 'width: 95%',
						// fieldStyle: 'background-color: #ebe8e8; text-align: right',
						value: sales_price_display
					},
					{
						xtype: 'checkbox',
						name: 'is_sep_yn',
						padding: '0 0 5px 10px',
						id: gu.id('is_sep_yn'),
						fieldLabel: '분할청구여부',
						checked: false
					}
				];
				
				var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: formItem
                })

				var item = [form];

				var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '매출정산작성',
                    width: myWidth,
                    height: myHeight,
                    items: item,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    var selections = gm.me().grid.getSelectionModel().getSelection();
                                    var isCheck = gu.getCmp('is_sep_yn').getValue();
									var isSep = '';
									console_logs('>>> isCheck', isCheck);
									if(isCheck === true) {
										isSep = 'Y';
									} else {
										isSep = 'N';
									}
									var pj_uid = "";
									var pj_uids = [];
									var srcahd_uid = "";
									var srcahd_uids = [];
									var sledel_uid = "";
									var sledel_uids = [];
									// var pj_name = "";
									// var pj_names = [];
									// var item_name = "";
                                    // var item_names = [];
									// var specification = "";
                                    // var specifications = [];
									var sales_price = "";
									var sales_prices = [];
									var gr_qty = "";
									var gr_qtys = [];
									var total_price = "";
									var total_prices = [];
									var combst_uid = "";
									var dl_uid = "";

									for(var i=0; i<selections.length; i++) {
										var selection = selections[i];
											pj_uid = selection.get('pj_uid');
											pj_uids.push(pj_uid);
											srcahd_uid = selection.get('srcahd_uid');
											srcahd_uids.push(srcahd_uid);
											sledel_uid = selection.get('sledel_uid');
											sledel_uids.push(sledel_uid);
											sales_price = selection.get('sales_price');
											sales_prices.push(sales_price);
											gr_qty = selection.get('gr_qty');
											gr_qtys.push(gr_qty);
											total_price = selection.get('total_price');
											total_prices.push(total_price);
											combst_uid = selection.get('combst_uid');
											rtgast_uid = selection.get('rtgast_uid');
									 }

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/account/arap.do?method=addSalesSettle',
                                        params: {
											item_abst : item_abst,
											sales_prices : sales_prices,
											gr_qtys : gr_qtys,
											total_price : gu.getCmp('sales_price_display').getValue(),
											wa_code : wa_code,
											pj_uids : pj_uids,
											srcahd_uids : srcahd_uids,
											sledel_uids : sledel_uids,
											combst_uid : combst_uid,
											rtgast_uid : rtgast_uid,
											isSep : isSep,
											tax_bill_date : gu.getCmp('tax_bill_date').getValue(),
                                        },
                                        success: function (result, request) {
                                            gm.me().store.load();
											gm.me().delBuyerGrid.store.load();
                                            Ext.Msg.alert('안내', '정산을 요청하였습니다.', function () { });
                                            prWin.close();
                                        },// endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });// endofajax
                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show();
			}
		});

		this.addArAction = Ext.create('Ext.Action', {
			itemId: 'addArAction',
			iconCls: 'af-plus-circle',
			disabled: true,
			text: '합계발행',
			handler: function (widget, event) {

				/*
				1. buyer_uid : 선택한 고객사의 UID
				2. 선택한 project uid 목록
				3. 사용자 입력한 정보(고객사 + 연월 )

				*/
				//결재사용인 경우 결재 경로 store 생성
				if (gm.me().useRouting == true) {
					gm.me().rtgapp_store = Ext.create('Mplm.store.RtgappStore', {});
				}

				var buyer_uid = gm.me().SELECTED_UID;
				console_logs('buyer_uid++++++++++++++++++++', buyer_uid);

				var selectedPjUid = [];
				var selectedUids = [];
				var selections = gm.me().grid.getSelectionModel().getSelection();
				console_logs('addArAction selections+++++++++++++++', selections);
				var item_abst = '';
				var total_price = 0;
				if (selections) {
					for (var i = 0; i < selections.length; i++) {
						var rec = selections[i];
						console_logs('rec', rec);
						selectedPjUid.push(rec.get('pj_uid'));
						selectedUids.push(rec.get('unique_id_long'));
						total_price = total_price + rec.get('total_price');
						if (i == 0) {
							item_abst = rec.get('pj_name') + ' 외 ' + (selections.length - 1) + '건';
						}
					}
				}

				var myHeight = (gm.me().useRouting == true) ? 500 : 320;
				var myWidth = 600;

				var buyer_name = gm.me().SELECTED_RECORD.get('wa_name');
				var text = buyer_name + ' - ' + (new Date()).getFullYear() + '년' + ((new Date()).getMonth() + 1) + '월' + (new Date().getDate()) + '일' + ' / ' + item_abst;
				// var records =  ;
				var paytype = Ext.create('Ext.data.Store', {
					fields: ['var_value', 'var_name'],
					data: [
						{ "var_value": "MONEY", "var_name": "현금" },
						{ "var_value": "CARD", "var_name": "카드" },
						{ "var_value": "NOTE", "var_name": "어음" }
					]
				});

				var formItems = [
					{
						fieldLabel: '합계구분',
						xtype: 'textarea',
						rows: 5,
						padding: '0 0 5px 10px',
						name: 'text',
						style: 'width: 99%',
						value: text
					},
					{
						xtype: 'datefield',
						id: gu.id('bill_date'),
						name: 'bill_date',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						value : new Date(),
						fieldLabel: '계산서 발행일',
						format: 'Y-m-d',
					},
					{
						xtype: 'datefield',
						id: gu.id('withdraw_date'),
						name: 'withdraw_date',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						value : new Date(),
						fieldLabel: '입금일',
						format: 'Y-m-d',
					},
					{
						xtype: 'numberfield',
						id: gu.id('process_price'),
						name: 'pay_price',
						padding: '0 0 5px 10px',
						// anchor: '100%',
						style: 'width: 99%',
						allowBlank: true,
						fieldLabel: '정산액',
						value : total_price
					},
					{
						xtype: 'combo',
						fieldLabel: '결제방법',
						id: gu.id('pay_type'),
						padding: '0 0 5px 10px',
						store: paytype,
						width: '99%',
						name: 'pay_type',
						style: 'width: 99%',
						valueField: 'var_value',
						displayField: 'var_name',
						selectOnFocus: true,
						emptyText: '선택해주세요.',
						listConfig: {
							loadingText: '검색중...',
							emptyText: '일치하는 항목 없음',
							getInnerTpl: function () {
								return '<div data-qtip="{var_value}">{var_name}</div>';
							}
						},
						listeners: {
							afterrender: function (combo) {

							}
						}

					},
					new Ext.form.Hidden({
						name: 'unique_uids',
						value: selectedUids
					}),
					new Ext.form.Hidden({
						name: 'pj_uids',
						value: selectedPjUid
					})
				];

				var form = Ext.create('Ext.form.Panel', {
					id: gu.id('formPanel'),
					xtype: 'form',
					frame: false,
					border: false,
					width: '100%',
					bodyPadding: 10,
					region: 'center',
					layout: 'column',
					fieldDefaults: {
						labelAlign: 'right',
						msgTarget: 'side'
					},
					// items: formItems
					items: [
						{
							xtype: 'container',
							width: '100%',
							// margin: '0 10 10 1',
							border: true,
							defaultMargins: {
								top: 0,
								right: 0,
								bottom: 0,
								left: 10
							},
							items: formItems

						}
					]
				})

				var items = [form];

				if (gm.me().useRouting == true) {

					gm.me().rtgapp_store.load();
					var userStore = Ext.create('Mplm.store.UserStore', { hasNull: false });
					var removeRtgapp = Ext.create('Ext.Action', {
						itemId: 'removeRtgapp',
						glyph: 'xf00d@FontAwesome',
						text: CMD_DELETE,
						disabled: true,
						handler: function (widget, event) {
							Ext.MessageBox.show({
								title: delete_msg_title,
								msg: delete_msg_content,
								buttons: Ext.MessageBox.YESNO,
								fn: gm.me().deleteRtgappConfirm,
								icon: Ext.MessageBox.QUESTION
							});
						}
					});

					var updown =
					{
						text: '이동',
						menuDisabled: true,
						sortable: false,
						xtype: 'actioncolumn',
						width: 70,
						align: 'center',
						items: [{
							icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/up.png',
							tooltip: 'Up',
							handler: function (agridV, rowIndex, colIndex) {
								var record = gm.me().agrid.getStore().getAt(rowIndex);
								console_log(record);
								var unique_id = record.get('unique_id');
								console_log(unique_id);
								var direcition = -15;
								Ext.Ajax.request({
									url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
									params: {
										direcition: direcition,
										unique_id: unique_id
									},
									success: function (result, request) {
										gm.me().rtgapp_store.load(function () { });
									}
								});

							}


						}, '-',
						{
							icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/down.png',
							tooltip: 'Down',
							handler: function (agridV, rowIndex, colIndex) {

								var record = gm.me().agrid.getStore().getAt(rowIndex);
								console_log(record);
								var unique_id = record.get('unique_id');
								console_log(unique_id);
								var direcition = 15;
								Ext.Ajax.request({
									url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
									params: {
										direcition: direcition,
										unique_id: unique_id
									},
									success: function (result, request) {
										gm.me().rtgapp_store.load(function () { });
									}
								});
							}

						}]
					};

					var selModel = Ext.create("Mplm.util.SelModelCheckbox", { onlyCheckOwner: false });

					this.agrid = Ext.create('Ext.grid.Panel', {
						//title: '결재경로',
						store: gm.me().rtgapp_store,
						border: true,
						frame: true,
						style: 'padding-left:10px;padding-right:10px;',
						width: '100%',
						//layout: 'fit',
						scroll: true,
						selModel: selModel,
						columns: [
							{ dataIndex: 'seq_no', text: '순서', width: 70, sortable: false }
							, { dataIndex: 'user_id', text: '아이디', sortable: false }
							, { dataIndex: 'user_name', text: '이름', flex: 1, sortable: false }
							, { dataIndex: 'dept_name', text: '부서 명', width: 90, sortable: false }
							, { dataIndex: 'gubun', text: '구분', width: 50, sortable: false }
							, updown
						],
						border: false,
						multiSelect: true,
						frame: false,
						dockedItems: [{
							xtype: 'toolbar',
							cls: 'my-x-toolbar-default2',
							items: [
								{
									xtype: 'label',
									labelWidth: 20,
									text: '결재 권한자 추가'//,
									//style: 'color:white;'

								}, {
									id: 'user_name',
									name: 'user_name',
									xtype: 'combo',
									fieldStyle: 'background-color: #FBF8E6; background-image: none;',
									store: userStore,
									labelSeparator: ':',
									emptyText: dbm1_name_input,
									displayField: 'user_name',
									valueField: 'unique_id',
									sortInfo: { field: 'user_name', direction: 'ASC' },
									typeAhead: false,
									hideLabel: true,
									minChars: 2,
									width: 200,
									listConfig: {
										loadingText: 'Searching...',
										emptyText: 'No matching posts found.',
										getInnerTpl: function () {
											return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
										}
									},
									listeners: {
										select: function (combo, record) {
											console_logs('Selected combo : ', combo);
											console_logs('Selected record : ', record);
											console_logs('Selected Value : ', record.get('unique_id'));

											var unique_id = record.get('unique_id');
											var user_id = record.get('user_id');
											Ext.Ajax.request({
												url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
												params: {
													useruid: unique_id,
													userid: user_id
													, gubun: 'D'
												},
												success: function (result, request) {
													var result = result.responseText;
													console_log('result:' + result);
													if (result == 'false') {
														Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
													} else {
														gm.me().rtgapp_store.load(function () { });
													}
												},
												failure: extjsUtil.failureMessage
											});
										}// endofselect
									}
								},
								'->', removeRtgapp

							]// endofitems
						}] // endofdockeditems 

					}); // endof Ext.create('Ext.grid.Panel',

					this.agrid.getSelectionModel().on({
						selectionchange: function (sm, selections) {
							if (selections.length) {
								removeRtgapp.enable();
							} else {
								removeRtgapp.disable();
							}
						}
					});

					items.push(this.agrid);
				}

				var prWin = Ext.create('Ext.Window', {
					modal: true,
					title: '정산실행',
					width: myWidth,
					height: myHeight,
					plain: true,
					items: items,
					buttons: [{
						text: CMD_OK,
						handler: function (btn) {
							if (btn == "no") {
								prWin.close();
							} else {
								if (form.isValid()) {
									var val = form.getValues(false);
									//결재사용인 경우 결재 경로 확인
									if (gm.me().useRouting == true) {

										var items = gm.me().rtgapp_store.data.items;
										console_logs('items.length', items.length);
										if (items.length < 2) {
											Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
											return;
										}

										var ahid_userlist = new Array();
										var ahid_userlist_role = new Array();

										for (var i = 0; i < items.length; i++) {
											var rec = items[i];
											console_logs('items rec', rec);
											ahid_userlist.push(rec.get('usrast_unique_id'));
											ahid_userlist_role.push(rec.get('gubun'));
										}
										val['hid_userlist'] = ahid_userlist;
										val['hid_userlist_role'] = ahid_userlist_role;
									}

									var selections = gm.me().grid.getSelectionModel().getSelection();

									var supplier_code = selections[0].get('seller_code');
									var supplierUid = selections[0].get('sms_cnt');
									var item_name = selections[0].get('item_name');

									Ext.Ajax.request({
										url: CONTEXT_PATH + '/account/arap.do?method=addNewAr',
										params: {
											buyer_uid: gm.me().SELECTED_UID,
											sledel_uids: selectedUids,
											// rtgast_uids: selectedUids,
											text: text,
											item_abst: item_abst,
											hid_userlist: ahid_userlist,
											hid_userlist_role: ahid_userlist_role,
											
											total_price : gu.getCmp('process_price').getValue(),
											bill_date : gu.getCmp('bill_date').getValue(),
											withdraw_date : gu.getCmp('withdraw_date').getValue(),
											pay_type : gu.getCmp('pay_type').getValue()
										},

										success: function (result, request) {
											gm.me().store.load();
											gm.me().delBuyerGrid.store.load();
											Ext.Msg.alert('안내', '모든 수주목록을 발행하였습니다.', function () { });
											prWin.close();
										},// endofsuccess
										failure: extjsUtil.failureMessage
									});// endofajax
								}
							}
						}
					}, {
						text: CMD_CANCEL,
						handler: function (btn) {
							prWin.close();
						}
					}]
				});
				prWin.show();

				// Ext.MessageBox.show({
				// 	title:'확인',
				// 	multiline:true,
				// 	msg: '정산 하시겠습니까?',
				// 	value: text,
				//     buttons: Ext.MessageBox.YESNO,
				//     fn:  function(result) {
				//         if(result=='yes') {
				//         	gm.me().doArProcess(selectedUids, text, item_abst);
				//         }

				//     },
				//     // animateTarget: 'mb4',
				//     icon: Ext.MessageBox.QUESTION
				// });
			}
		});

		this.printProduceResult = Ext.create('Ext.Action', {
			iconCls: 'af-pdf',
			text: '외상매출리스트 출력',
			tooltip: '외상매출리스트를 출력합니다.',
			disabled: true,
			handler: function () {
				var sel = gm.me().delBuyerGrid.getSelectionModel().getSelection()[0];
				var selections = gm.me().grid.getSelectionModel().getSelection();
				var unique_ids = '';
				if (selections.length > 0) {
					for (var i = 0; i < selections.length; i++) {
						var rec = selections[i];
						unique_ids += rec.get('sledel_uid') +',';
					}
				}
				var sel = gm.me().delBuyerGrid.getSelectionModel().getSelection()[0];

				if(unique_ids.length > 0) {
					unique_ids = unique_ids.substr(0, unique_ids.length -1);
				}

				Ext.Ajax.request({
					waitMsg: '다운로드 요청중입니다.<br> 잠시만 기다려주세요.',
					url: CONTEXT_PATH + '/pdf.do?method=printAr',
					params: {
						pdfPrint: 'pdfPrint',
						is_rotate: 'N',
						type : 'GEN',
						combst_uid : sel.get('unique_id_long'),
						unique_ids : unique_ids
					},
					reader: {
						pdfPath: 'pdfPath'
					},
					success: function (result, request) {
						var jsonData = Ext.JSON.decode(result.responseText);
						var pdfPath = jsonData.pdfPath;
						console_log(pdfPath);
						if (pdfPath.length > 0) {
							var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
							top.location.href = url;
						}
						gm.me().pdfDownload(size, reportSelection, ++pos);
					},
	
				});
			}
		});

		buttonToolbar.insert(0, this.salessettleAction);
		buttonToolbar.insert(1, this.printProduceResult);
		
		this.purListSrch = Ext.create('Ext.Action', {
			itemId: 'putListSrch',
			iconCls: 'af-search',
			text: CMD_SEARCH/*'검색'*/,
			disabled: false,
			handler: function (widget, event) {
				try {
					var s_date = Ext.getCmp('s_date_arv').getValue();
					var e_date = Ext.getCmp('s_date_arv').getValue();
					var lot_no = Ext.getCmp('lot_no').getValue();
				} catch (e) { }

				//    	    	var wa_code = Ext.getCmp('wa_code_PPO1TURN').getValue();
				gm.me().buyerStore.getProxy().setExtraParam('s_date', Ext.Date.format(s_date, 'Y-m-d'));
				gm.me().buyerStore.getProxy().setExtraParam('e_date', Ext.Date.format(e_date, 'Y-m-d'));
				//    	    	gm.me().productStore.getProxy().setExtraParam('req_date', s_date+":"+e_date);
				gm.me().buyerStore.getProxy().setExtraParam('name', lot_no);
				//    	    	gm.me().productStore.getProxy().setExtraParam('wa_code', wa_code);
				gm.me().buyerStore.load();
			}
		});


		Ext.apply(this, {
			layout: 'border',
			items: [this.createWest(), this.createCenter()]
		});

		this.setGridOnCallback(function (selections) {
			if (selections.length) {
				gUtil.enable(gm.me().addArAction);
				gUtil.enable(gm.me().salessettleAction);
			} else {
				gUtil.disable(gm.me().addArAction);
				gUtil.disable(gm.me().salessettleAction);
			}
		});

		this.store.getProxy().setExtraParam('state', 'A');

		this.callParent(arguments);
	},


	doArProcess: function (selectedUids, text, item_abst) {
		var pj_uids = selectedUids;
		// selectedPjUid

		Ext.Ajax.request({
			url: CONTEXT_PATH + '/account/arap.do?method=addNewAr',
			params: {
				buyer_uid: gm.me().SELECTED_UID,
				rtgast_uids: selectedUids,
				text: text,
				item_abst: item_abst
			},

			success: function (result, request) {
				gm.me().store.load();
				gm.me().delBuyerGrid.store.load();
				Ext.Msg.alert('안내', '모든 수주목록을 발행하였습니다.', function () { });

			},// endofsuccess
			failure: extjsUtil.failureMessage
		});// endofajax

	},

	//   rtgast_uid_arr : [],
	setRelationship: function (relationship) { },
	createCenter: function () {/*자재목록 그리드*/
		this.grid.setTitle('납품목록');
		this.center = Ext.widget('tabpanel', {
			layout: 'border',
			border: true,
			region: 'center',
			width: '55%',
			items: [this.grid]
		});


		return this.center;
	},
	createWest: function () {/*요청서 목록*/

		this.removeAssyAction = Ext.create('Ext.Action', {
			itemId: 'removeAssyAction',
			iconCls: 'af-remove',
			text: 'Assy' + CMD_DELETE,
			disabled: true,
			handler: function (widget, event) {
				Ext.MessageBox.show({
					title: delete_msg_title,
					msg: delete_msg_content,
					buttons: Ext.MessageBox.YESNO,
					fn: gm.me().deleteAssyConfirm,
					// animateTarget: 'mb4',
					icon: Ext.MessageBox.QUESTION
				});
			}
		});


		this.buyerStore = Ext.create('Mplm.store.BuyerStore');
		this.buyerStore.getProxy().setExtraParam('project_del_finished', 'T');


		this.delBuyerGrid =
			Ext.create('Rfx.view.grid.AccountsReceivableVerGrid', {

				title: '납품 고객사',// cloud_product_class,
				border: true,
				resizable: true,
				scroll: true,
				collapsible: false,
				store: this.buyerStore,
				//layout          :'fit',
				//forceFit: true,
				multiSelect: true,
				selModel: Ext.create("Ext.selection.CheckboxModel", {}),
				// bbar: Ext.create('Ext.PagingToolbar', {
				// 	store: this.buyerStore,
				// 	displayInfo: true,
				// 	displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
				// 	emptyMsg: "표시할 항목이 없습니다."
				// 	, listeners: {
				// 		beforechange: function (page, currentPage) {

				// 		}
				// 	}

				// }),
				dockedItems: [
					{
						dock: 'top',
						xtype: 'toolbar',
						cls: 'my-x-toolbar-default2',
						items: [
							this.purListSrch//, 
							//this.removeAssyAction, 
							//'->', 
							//this.expandAllTreeAction 
						]
					},
					{
						dock: 'top',
						xtype: 'toolbar',
						cls: 'my-x-toolbar-default1',
						items: [
						// {
						// 	xtype: 'label',
						// 	width: 40,
						// 	text: '기간',
						// 	style: 'color:white;'

						// }, {
						// 	id: 's_date_arv',
						// 	name: 's_date',
						// 	format: 'Y-m-d',
						// 	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
						// 	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
						// 	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						// 	xtype: 'datefield',
						// 	value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
						// 	width: 98

						// }, {
						// 	xtype: 'label',
						// 	text: "~",
						// 	style: 'color:white;'
						// }, {
						// 	id: 'e_date_arv',
						// 	name: 'e_date',
						// 	format: 'Y-m-d',
						// 	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
						// 	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
						// 	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
						// 	xtype: 'datefield',
						// 	value: new Date(),
						// 	width: 98

						// }, 
						{
							xtype: 'triggerfield',
							emptyText: '고객사 명',
							id: 'src_wa_name',
							name: 'wa_name',
							listeners: {
								specialkey: function (field, e) {
									if (e.getKey() == Ext.EventObject.ENTER) {
										gm.me().buyerStore.getProxy().setExtraParam('query', Ext.getCmp('src_wa_name').getValue());
										gm.me().buyerStore.load(function () { });
									}
								}
							},
							trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
							'onTrigger1Click': function () {
								Ext.getCmp('src_wa_name').setValue('');
								gm.me().buyerStore.getProxy().setExtraParam('query', Ext.getCmp('src_wa_name').getValue());
								gm.me().buyerStore.load(function () { });
							}
						}
						]
					},
				] //dockedItems of End


			});//delBuyerGrid of End



		this.delBuyerGrid.store.load();

		this.delBuyerGrid.store.on('load', function (store, records, successful, eOpts) {
			var start_date = new Date();
			console.log('>> start_date', start_date);

			var arr = [];
			var prev_rec = null;
			for (var i = 0; i < records.length; i++) {
				var cur = records[i];
				prev_rec = {};
				for (var key in cur['data']) {
					prev_rec[key] = cur.get(key);
				}
				var unique_id = cur.get('unique_id');
				prev_rec['unique_id'] = unique_id;


				var po_no = cur.get('po_no');
				prev_rec['po_no'] = po_no;

				var name = cur.get('name');
				prev_rec['name'] = name;

				var item_quan = cur.get('item_quan');
				prev_rec['item_quan'] = item_quan;

				var creator = cur.get('creator');
				prev_rec['creator'] = creator;

				var create_date = cur.get('create_date');
				prev_rec['create_date'] = create_date;



				arr.push(prev_rec);
			}
			records = arr;
			console_logs('==== storeLoadCallback arr', arr);

			store.removeAll();
			store.add(arr);

			var end_date = new Date();
			console.log('end_date', end_date);

			var elapsed_time = end_date - start_date;
			console.log('>> elapsed_time', elapsed_time);
		});
		this.delBuyerGrid.getSelectionModel().on({
			selectionchange: function (sm, selections) {
				// gUtil.enable(gm.me().addArAction);
				// gUtil.enable(gm.me().editAssyAction);
				try {
					if (selections != null) {

						var rec = selections[0];
						var start_delbuyergrid_date = new Date();
						console.log('start_delbuyergrid_date', start_delbuyergrid_date);

						console_logs('rec>>>>>>>>>>>>>', rec)

						gm.me().SELECTED_UID = rec.get('unique_id');
						gm.me().SELECTED_RECORD = rec;
						//var unique_id = rec.get('unique_id');
						//gm.me().buyer_uid = rec.get('unique_id');
						//	        		 gm.me().rtgast_uid_arr = rec.get('unique_id');
						//	        		 console_logs('rec>>>>>>>>>>>>>',gm.me().rtgast_uid_arr)
						//					 var s_date = Ext.getCmp('s_date_arv').getValue();
						//					 var e_date = Ext.getCmp('e_date_arv').getValue();

						gm.me().store.getProxy().setExtraParam('reserved_number4', gm.me().SELECTED_UID);
						//					 gm.me().store.getProxy().setExtraParam('date_month', 'date_month');
						//					 gm.me().store.getProxy().setExtraParam('s_date', s_date);
						//		             gm.me().store.getProxy().setExtraParam('e_date', e_date);
						gm.me().store.load();
						console_logs('---ssss', gm.me().store);
						var end_date_delbuyergrid_date = new Date();
						console.log('>> end_date_delbuyergrid_date', end_date_delbuyergrid_date);
						var elapsed_time_delbuyergrid_date = end_date_delbuyergrid_date - start_delbuyergrid_date;
						console.log('>>> elapsed_time_delbuyergrid_date', elapsed_time_delbuyergrid_date);

						gm.me().printProduceResult.enable();

					} else {
						gm.me().printProduceResult.disable();
					}
				} catch (e) {
					console_logs('e', e);
				}
			}
		});

		this.west = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
			layout: 'border',
			border: true,
			region: 'west',
			width: '45%',
			layoutConfig: { columns: 2, rows: 1 },

			items: [this.delBuyerGrid /*, myFormPanel*/]
		});

		return this.west;
	},
	rtgapp_store: null,
	useRouting: false,

	comcstStore: Ext.create('Mplm.store.ComCstStore', {}),
	// getFirstDay: function() {
	// 	return new Date();
	// }
});
