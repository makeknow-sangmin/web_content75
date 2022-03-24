Ext.define('Rfx2.view.company.hanjung.purStock.GoRequestDetailView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'goods-out-by-project-view',
    srcahdArr: [],
    initComponent: function () {

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.GoRequest', [{
			property: 'create_date',
			direction: 'DESC'
		}],
			gm.pageSize
		);
        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
		this.addSearchField({
			type: 'dateRange',
			field_id: 'create_date',
			text: gm.getMC('CMD_Order_Date', '등록일자'),
			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
			edate: new Date()
		});

		this.addSearchField({
			field_id: 'state',
			displayField: 'codeName',
			valueField: 'systemCode',
			store: 'PrchStateStore',
			innerTpl: '<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>'
		});

		this.addSearchField('name');
		this.addSearchField('content');
		this.addSearchField('user_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
		});
		
		var buttonToolbar2 = Ext.create('widget.toolbar', {
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                id: gu.id('total_price_mat'),
                style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
                text: '총 금액 : -'
            }]
        });

        var buttonToolbar3 = Ext.create('widget.toolbar', {
            style: 'background-color: transparent;',
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                id: gu.id('total_price'),
                style: 'color: #000000; font-weight: bold; font-size: 15px; margin: 5px;',
                text: '불출내역 상세보기'
            }]
        });
		
        //그리드 생성
        var arr = [];
        var assymap_uid = 0;
        var status = '';
		arr.push(buttonToolbar);
		arr.push(searchToolbar);
		arr.push(buttonToolbar2);

        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();
		
		this.cartLineStore = Ext.create('Rfx.store.CartMapStore');
        
        this.reReceiveAction = Ext.create('Ext.Action', {
			iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			text: '요청 접수',
			tooltip: '요청 접수',
			disabled: true,
			handler: function () {
				Ext.MessageBox.show({
					title: '확인',
					msg: '요청 접수 하시겠습니까?',
					buttons: Ext.MessageBox.YESNO,
					fn: function (result) {
						if (result == 'yes') {
							var gmRtgast_uids = gm.me().rtgast_uids;
							var states = gm.me().states;
							if (gmRtgast_uids == null || gmRtgast_uids.length == 0) {
								Ext.Msg.alert('안내', '선택한 항목이 없습니다.', function () { });
							} else {
								var aleady = false;
								var rtgast_uids = [];
								for (var i = 0; i < gmRtgast_uids.length; i++) {
									var state = states[i];
									if (state == 'A') {
										rtgast_uids.push(gmRtgast_uids[i]);
									} else {
										aleady = true;
									}
								}
								if (aleady == true) {
									Ext.Msg.alert('안내', '이미 진행된 항목이 포함되어 있습니다.', function () { });
								} else {
									Ext.Ajax.request({
										url: CONTEXT_PATH + '/purchase/prch.do?method=createOrder',
										params: {
											unique_id: rtgast_uids
										},

										success: function (result, request) {
											gm.me().store.load();
											Ext.Msg.alert('안내', '요청접수 되었습니다.', function () { });
										},//endofsuccess
										failure: extjsUtil.failureMessage
									});//endofajax			            	        		
								}
							}
						}
					},
					//animateTarget: 'mb4',
					icon: Ext.MessageBox.QUESTION
				});
			}
		});

		this.createPoAction = Ext.create('Ext.Action', {
			iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			text: '주문 작성',
			tooltip: '주문 작성',
			disabled: false,
			handler: function () {
				gm.me().treatPo();
			}//handler end...

		});

		var removeBActionText = '반려';
		if (this.link == 'QGR6_SKN') {
			removeBActionText = '요청취소';
		}

		//요청취소 Action 생성
		this.backBAction = Ext.create('Ext.Action', {
			iconCls: 'af-remove',
			text: removeBActionText,
			tooltip: removeBActionText,
			disabled: true,
			handler: function () {
				Ext.MessageBox.show({
					title: '확인',
					msg: '요청을 취소 하시겠습니까?',
					buttons: Ext.MessageBox.YESNO,
					fn: function (result) {
						if (result == 'yes') {

							var gmRtgast_uids = gm.me().rtgast_uids;
							var states = gm.me().states;

							if (gmRtgast_uids == null || gmRtgast_uids.length == 0) {
								Ext.Msg.alert('안내', '선택한 항목이 없습니다.', function () { });
							} else {

								var aleady = false;
								var rtgast_uids = [];
								for (var i = 0; i < gmRtgast_uids.length; i++) {
									var state = states[i];
									if (state == 'A') {
										rtgast_uids.push(gmRtgast_uids[i]);
									} else {
										aleady = true;
									}
								}

								if (aleady == true) {
									Ext.Msg.alert('안내', '이미 진행된 항목이 포함되어 있습니다.', function () { });
								} else {
									Ext.Ajax.request({
										url: CONTEXT_PATH + '/purchase/prch.do?method=backOrder',
										params: {
											unique_id: rtgast_uids,
											parent_code: gm.me().link
										},

										success: function (result, request) {
											gm.me().store.load();
											Ext.Msg.alert('안내', '요청이 취소 되었습니다.', function () { });

										},//endofsuccess
										failure: extjsUtil.failureMessage
									});//endofajax
								}
							}
						}
					},
					//animateTarget: 'mb4',
					icon: Ext.MessageBox.QUESTION
				});
			}
		});

		//반려 Action 생성
		this.removeBAction = Ext.create('Ext.Action', {
			iconCls: 'af-remove',
			text: removeBActionText,
			tooltip: removeBActionText,
			disabled: true,
			handler: function () {
				Ext.MessageBox.show({
					title: '확인',
					msg: '반려 하시겠습니까?',
					buttons: Ext.MessageBox.YESNO,
					fn: function (result) {
						if (result == 'yes') {

							var gmRtgast_uids = gm.me().rtgast_uids;
							var states = gm.me().states;

							if (gmRtgast_uids == null || gmRtgast_uids.length == 0) {
								Ext.Msg.alert('안내', '선택한 항목이 없습니다.', function () { });
							} else {

								var aleady = false;
								var rtgast_uids = [];
								for (var i = 0; i < gmRtgast_uids.length; i++) {
									var state = states[i];
									if (state == 'A') {
										rtgast_uids.push(gmRtgast_uids[i]);
									} else {
										aleady = true;
									}
								}

								if (aleady == true) {
									Ext.Msg.alert('안내', '이미 진행된 항목이 포함되어 있습니다.', function () { });
								} else {
									Ext.Ajax.request({
										url: CONTEXT_PATH + '/purchase/prch.do?method=destroyOrder',
										params: {
											unique_id: rtgast_uids,
											parent_code: gm.me().link
										},

										success: function (result, request) {
											gm.me().store.load();
											Ext.Msg.alert('안내', '반려 되었습니다.', function () { });

										},//endofsuccess
										failure: extjsUtil.failureMessage
									});//endofajax
								}
							}
						}
					},
					//animateTarget: 'mb4',
					icon: Ext.MessageBox.QUESTION
				});
			}
		});

		this.printPDFAction = Ext.create('Ext.Action', {
			iconCls: 'af-pdf',
			text: 'PDF',
			tooltip: '불출요청서 출력',
			disabled: true,

			handler: function (widget, event) {
				var rtgast_uid = gm.me().vSELECTED_UNIQUE_ID;
				var po_no = gm.me().vSELECTED_PO_NO;
				var rtg_type = gm.me().vSELECTED_RTG_TYPE;
				console_logs('rtg_type', rtg_type);
				var is_rotate = 'N';
				Ext.Ajax.request({
					url: CONTEXT_PATH + '/pdf.do?method=printPr',
					params: {
						rtgast_uid: rtgast_uid,
						po_no: po_no,
						pdfPrint: 'pdfPrint',
						is_rotate: is_rotate,
						rtg_type: rtg_type
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
					},
					failure: extjsUtil.failureMessage
				});


			}
		});

		buttonToolbar.insert(1, this.printPDFAction);
		buttonToolbar.insert(2, this.backBAction);

        this.cartLineGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: this.cartLineStore,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            // selModel: Ext.create("Ext.selection.CheckboxModel", { mode: 'multi' }),
            autoHeight: true,
            border: true,
            padding: '5 0 0 0',
            viewConfig: {
                getRowClass: function (record, index) {
                    var c = record.get('reserved_integer1');
                    if (c == '1') {
                        var standard_flag = record.get('standard_flag');
                        if (standard_flag == 'R') {
                            return 'green-row';
                        } else {
                            return 'yellow-row';
                        }
                    }
                }
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
                listeners: {
                    edit: function (e, context, eOpts) {
                        switch (context.field) {
                            default:
                                break;
                        }
                    }
                }
            },
            flex: 0.5,
            layout: 'fit',
            forceFit: false,
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: ['->', buttonToolbar3]
                }
            ],
            columns: [
                
               
                {
                    text: '품번',
                    width: 90,
                    dataIndex: 'item_code',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '품명',
                    width: 180,
                    dataIndex: 'item_name',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '규격',
                    width: 180,
                    dataIndex: 'specification',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '수량',
                    width: 100,
                    dataIndex: 'quan',
                    //xtype: "numbercolumn",
                    style: 'text-align:center',
                    renderer: function (value, meta) {
                        return Ext.util.Format.number(value, "0,000.##");
                    },
                    align: 'right'
                },
                {
                    text: '총재고',
                    width: 100,
                    dataIndex: 'stock_qty',
                    xtype: "numbercolumn",
                    format: "0,000",
                    style: 'text-align:center',
                    align: 'right'
                }
            ]
        });


        this.cartLineGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('rec', selections);
                    if (status != 'Y') {
                        gm.me().progressGoodOutAction.enable();
                        gm.me().removeGoodsOutAction.enable();
                    } else {
                        gm.me().progressGoodOutAction.disable();
                        gm.me().progressGoodOutAction.disable();
                    }
                }
            }
        });

        this.grid.forceFit = true;

        Ext.apply(this, {
            layout: 'border',
            items: [{
                //title: '제품 및 템플릿 선택',
                collapsible: false,
                frame: false,
                region: 'west',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                margin: '5 0 0 0',
                width: '60%',
                items: [{
                    region: 'west',
                    layout: 'fit',
                    margin: '0 0 0 0',
                    width: '100%',
                    items: [this.grid]
                }]
            }, this.cartLineGrid]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

        this.setGridOnCallback(function (selections) {

			if (selections.length) {
				this.rtgast_uids = [];
				this.states = [];
				for (var i = 0; i < selections.length; i++) {
					var rec1 = selections[i];
					var uids = rec1.get('id');
					var state = rec1.get('state');
					this.rtgast_uids.push(uids);
					this.states.push(state);
				}
				var rec = selections[0];

				gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //rtgast_uid
				gm.me().vSELECTED_PO_NO = rec.get('po_no'); //rtgast_uid
				gm.me().vSELECTED_RTG_TYPE = rec.get('rtg_type');
				console_logs("gm.me().vSELECTED_UNIQUE_ID>>>>>>>>>>", gm.me().vSELECTED_UNIQUE_ID);
				gm.me().reReceiveAction.enable();
				gm.me().printPDFAction.enable();
				gm.me().removeBAction.enable();
				gm.me().backBAction.enable();

				this.cartLineGrid.getStore().getProxy().setExtraParam('rtgastuid', this.rtgast_uids);
				console_logs("this.rtgast_uids>>>>>>>>>>", this.rtgast_uids);
				var totalPrice = 0;
				this.cartLineGrid.getStore().load(function(record){
                    for (var i = 0; i < record.length; i++) {
                        var t_rec = record[i]
                        totalPrice += t_rec.get('sales_price') *  t_rec.get('quan');                
                    }
                    buttonToolbar2.items.items[1].update('총 금액 : ' + gu.renderNumber(totalPrice) + ' 원');
				});

			} else {
				gm.me().vSELECTED_UNIQUE_ID = -1;
				gm.me().reReceiveAction.disable();
				gm.me().printPDFAction.disable();
				gm.me().removeBAction.disable();
				gm.me().backBAction.disable();

				this.cartLineGrid.getStore().removeAll();
				gm.me().crudTab.collapse();
			}


		})
    },
    clearSearchStore: function () {
        var store = gm.me().stockStore;

        store.getProxy().setExtraParam('start', 0);
        store.getProxy().setExtraParam('page', 1);
        store.getProxy().setExtraParam('limit', 12);

        store.getProxy().setExtraParam('item_code', '');
        store.getProxy().setExtraParam('item_name', '');
        store.getProxy().setExtraParam('specification', '');
        store.getProxy().setExtraParam('model_no', '');
    },
    redrawSearchStore: function () {

        this.clearSearchStore();

        var store = gm.me().stockStore;

        var item_code = gu.getValue('search_item_code');
        var item_name = gu.getValue('search_item_name');
        var specification = gu.getValue('search_specification');
        var model_no = gu.getValue('search_model_no');
        var supplier_name = '';
        try {
            supplier_name = gu.getValue('search_supplier_name');
        } catch (error) {

        }

        console_logs('item_code', item_code);
        console_logs('item_name', item_name);
        console_logs('specification', specification);
        console_logs('model_no', model_no);

        var bIn = false;
        if (item_code.length > 0) {
            store.getProxy().setExtraParam('item_code', '%' + item_code + '%');
            bIn = true;
        }

        if (item_name.length > 0) {
            store.getProxy().setExtraParam('item_name', '%' + item_name + '%');
            bIn = true;
        }

        if (specification.length > 0) {
            store.getProxy().setExtraParam('specification', '%' + specification + '%');
            bIn = true;
        }

        if (model_no.length > 0) {
            store.getProxy().setExtraParam('model_no', '%' + model_no + '%');
            bIn = true;
        }

        if (supplier_name.length > 0) {
            store.getProxy().setExtraParam('supplier_name', '%' + supplier_name + '%');
            bIn = true;
        } else {
            store.getProxy().setExtraParam('supplier_name', null);
        }

        store.getProxy().setExtraParam('limit', 12);

        if (bIn == true) {
            store.load();
        } else {
            store.removeAll();
        }
    },
    removeItem: function (arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }
});