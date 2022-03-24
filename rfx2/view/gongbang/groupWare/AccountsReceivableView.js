//주문작성

Ext.define('Rfx2.view.gongbang.groupWare.AccountsReceivableView', {
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
				var supply_price = 0;
				var supply_price_total = 0;
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
						supply_price_total += supply_price;
					}
				}
				var wa_code = selections[0]['data']['wa_code'];
                var wa_name = selections[0]['data']['wa_name'];
				var txt_name = '[' + wa_code + '] ' + wa_name + ' - ' + (new Date()).getFullYear() + '년' + ((new Date()).getMonth() + 1) + '월';
				var myWidth = 700;
				var myHeight = 250;

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
						fieldLabel: '합계금액',
						xtype: 'numberfield',
						anchor: '100%',
						padding: '0 0 5px 10px',
						labelWidth: 80,
						id: gu.id('supply_price_total'),
						name: 'supply_price_total',
						readOnly : false,
						style : 'width: 95%',
						value: supply_price_total
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
									var pj_uid = "";
									var pj_uids = [];
									var srcahd_uid = "";
									var srcahd_uids = [];
									var sledel_uid = "";
									var sledel_uids = [];
									var sales_price = "";
									var sales_prices = [];
									var gr_qty = "";
									var gr_qtys = [];
									var combst_uid = "";
									var rtgast_uid = "";
									var rtgast_uids = [];

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
											combst_uid = selection.get('combst_uid');
											rtgast_uid = selection.get('rtgast_uid');
											rtgast_uids.push(rtgast_uid);
									 }

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/account/arap.do?method=addSalesSettleVer',
                                        params: {
											item_abst : item_abst,
											sales_prices : sales_prices,
											gr_qtys : gr_qtys,
											total_price : supply_price_total,
											wa_code : wa_code,
											pj_uids : pj_uids,
											srcahd_uids : srcahd_uids,
											sledel_uids : sledel_uids,
											combst_uid : combst_uid,
											rtgast_uids : rtgast_uids,
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

		buttonToolbar.insert(0, this.salessettleAction);

		Ext.apply(this, {
			layout: 'border',
			items: [this.createWest(), this.createCenter()]
		});

		this.setGridOnCallback(function (selections) {
			if (selections.length) {
				gUtil.enable(gm.me().salessettleAction);
			} else {
				gUtil.disable(gm.me().salessettleAction);
			}
		});

		this.store.getProxy().setExtraParam('state', 'A');

		this.callParent(arguments);
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
				multiSelect: true,
				selModel: Ext.create("Ext.selection.CheckboxModel", {}),

				dockedItems: [
					{
						dock: 'top',
						xtype: 'toolbar',
						cls: 'my-x-toolbar-default2',
						items: [
							this.purListSrch
						]
					},
					{
						dock: 'top',
						xtype: 'toolbar',
						cls: 'my-x-toolbar-default1',
						items: [
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
				try {
					if (selections != null) {

						var rec = selections[0];
						var start_delbuyergrid_date = new Date();
						console.log('start_delbuyergrid_date', start_delbuyergrid_date);

						console_logs('rec>>>>>>>>>>>>>', rec)

						gm.me().SELECTED_UID = rec.get('unique_id');
						gm.me().SELECTED_RECORD = rec;
						gm.me().store.getProxy().setExtraParam('reserved_number4', gm.me().SELECTED_UID);
						gm.me().store.load();
						console_logs('---ssss', gm.me().store);
						var end_date_delbuyergrid_date = new Date();
						console.log('>> end_date_delbuyergrid_date', end_date_delbuyergrid_date);
						var elapsed_time_delbuyergrid_date = end_date_delbuyergrid_date - start_delbuyergrid_date;
						console.log('>>> elapsed_time_delbuyergrid_date', elapsed_time_delbuyergrid_date);

					} else {

					}
				} catch (e) {
					console_logs('e', e);
				}
			}
		});

		this.west = Ext.widget('tabpanel', { 
			layout: 'border',
			border: true,
			region: 'west',
			width: '45%',
			layoutConfig: { columns: 2, rows: 1 },

			items: [this.delBuyerGrid]
		});

		return this.west;
	},
	rtgapp_store: null,
	useRouting: false,

	comcstStore: Ext.create('Mplm.store.ComCstStore', {}),

});
