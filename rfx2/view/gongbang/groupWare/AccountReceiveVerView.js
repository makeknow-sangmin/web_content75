Ext.define('Rfx2.view.gongbang.groupWare.AccountReceiveVerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'account-receive-ver-view',


    initComponent: function () {

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL', 'VIEW']
        });


        this.initSearchField();

        this.addSearchField({
            // type: 'combo',
            field_id: 'year',
            emptyText: '연도'
            , store: 'YearStore'
            , displayField: 'view'
            , valueField: 'year'
            , innerTpl: '{view}'
        });

        this.addSearchField({
            type: 'text',
            field_id: 'wa_name',
            emptyText: '고객사'
        });

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.ReceivableByCompanyList', [{
            property: 'unique_id',
            direction: 'ASC'
        }],
            gm.pageSize
            , {}
            , ['']
        );

        var arr = [];
        arr.push(buttonToolbar);

        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        // CAPAMAP 스토어
        this.curingState = Ext.create('Rfx2.store.MoneyInStore', { pageSize: 100 });
        
        
        
        this.purListSrch = Ext.create('Ext.Action', {
			itemId: 'putListSrch',
			iconCls: 'af-search',
			text: CMD_SEARCH/*'검색'*/,
			disabled: false,
			handler: function (widget, event) {
                var year = gu.getCmp('year').getValue();

                if(year !== null) {
                    gm.me().curingState.getProxy().setExtraParam('year', year);
                }

                gm.me().curingState.load();
			}
		});

        
        
        let modifyDefectAction = Ext.create('Ext.Action',{
            iconCls : 'af-edit',
            text : '입금 수정',
            tooltip : '해당 입금 내역을 수정합니다',
            handler : function(){
                var rec = gm.me().gridCuring.getSelectionModel().getSelection()[0];
                console_logs('rec 확인 >>>>>>>>>>>>>>>>>>>>>>',rec);

                var myWidth = 600;
				var myHeight = 360;

                var money = rec.get('money');
                var moneyin_uid = rec.get('unique_id');

                var paytype = Ext.create('Ext.data.Store', {
					fields: ['var_value', 'var_name'],
					data: [
						{ "var_value": "현금", "var_name": "현금" },
						{ "var_value": "어음", "var_name": "어음" }
					]
				});

                var selection = gm.me().grid.getSelectionModel().getSelection();
                var combst_uid = selection[0]['data']['unique_id_long'];
                var projectStore = Ext.create('Rfx2.store.company.chmr.ClosalStoreByProject', { pageSize: 100 });
                projectStore.getProxy().setExtraParam('order_com_unique',combst_uid);
                projectStore.load();

                var formItems = [
                    {
						xtype: 'numberfield',
						id: gu.id('money_edit'),
						name: 'money_edit',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
                        value : money,
						fieldLabel: '입금금액',
					},
					{
						xtype: 'datefield',
						id: gu.id('in_date_edit'),
						name: 'in_date_edit',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						value : new Date(),
						fieldLabel: '입금일',
						format: 'Y-m-d',
					},
					{
						xtype: 'combo',
						fieldLabel: '결제방법',
						id: gu.id('pay_type_edit'),
						padding: '0 0 5px 10px',
						store: paytype,
						width: '99%',
						name: 'pay_type_edit',
						style: 'width: 99%',
						valueField: 'var_value',
						displayField: 'var_name',
                        emptyText: '선택해주세요.',
						selectOnFocus: true,
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
                    {
						xtype: 'textfield',
						id: gu.id('bill_number_edit'),
						name: 'bill_number_edit',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						fieldLabel: '어음번호',
                        value : rec.get('bill_number')
					},
                    {
						xtype: 'textfield',
						id: gu.id('bill_issuer_edit'),
						name: 'bill_issuer_edit',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						fieldLabel: '어음발행인',
                        value : rec.get('bill_issuer')
					},
                    {
						xtype: 'datefield',
						id: gu.id('bill_expiration_edit'),
						name: 'bill_expiration_edit',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						value : rec.get('bill_expiration'),
						fieldLabel: '어음만기일',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
						format: 'Y-m-d',
					},
                    {
						xtype: 'textfield',
						id: gu.id('description_edit'),
						name: 'description_edit',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						fieldLabel: '비고',
                        value : rec.get('description'),
					},
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
					items: [
						{
							xtype: 'container',
							width: '100%',
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

                var item = [form];

                var prWin = Ext.create('Ext.Window', {
                    modal: true, 
                    title: '입금수정',
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
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/account/arap.do?method=ModifyMoneyIn',
                                        params: {
                                            moneyin_uid : moneyin_uid,
                                            money : gu.getCmp('money_edit').getValue(),
											in_date : gu.getCmp('in_date_edit').getValue(),
                                            pay_type : gu.getCmp('pay_type_edit').getValue(),
                                            bill_number : gu.getCmp('bill_number_edit').getValue(),
                                            bill_issuer : gu.getCmp('bill_issuer_edit').getValue(),
                                            bill_expiration : gu.getCmp('bill_expiration_edit').getValue(),
                                            description : gu.getCmp('description_edit').getValue(),
                                        },
                                        success: function (result, request) {
                                            gm.me().store.load();
                                            gm.me().gridCuring.store.load();
                                            Ext.Msg.alert('안내', '입금 내역을 수정하였습니다.', function () { });
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

        let removeDefectAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '입금 삭제',
            tooltip: '해당 입금 내역을 삭제합니다.',
            handler: function () {
                var rec = gm.me().gridCuring.getSelectionModel().getSelection()[0];
                console_logs('rec 확인 >>>>>>>>>>>>>>>>>>>>>>',rec);

                var moneyin_uid = rec.get('unique_id');

                Ext.MessageBox.show({
                    title: '확인',
                    msg: '입금내역을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/account/arap.do?method=RemoveMoneyIn',
                                params: {
                                    moneyin_uid : moneyin_uid
                                },
                                success: function (result, request) {
                                    gm.me().store.load();
                                    gm.me().gridCuring.store.load();
                                    Ext.Msg.alert('안내', '삭제 되었습니다.', function () { });
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.gridCuring = Ext.create('Ext.grid.Panel', {
            store: this.curingState,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            viewConfig: {
                emptyText: '<div style="text-align:center; padding-top:30% ">조회된 데이터가 없습니다.</div>'
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            listeners : {
            },
            dockedItems: [
				{
					dock: 'top',
					xtype: 'toolbar',
					cls: 'my-x-toolbar-default1',
					items: [
                        {
                            width: 150,
                            field_id: 'year',
                            id: gu.id('year'),
                            name: 'year',
                            xtype: 'combo',
                            store : this.yearStore,
                            emptyText: '연도',
                            displayField: 'view',
                            valueField: 'year',
                            value : new Date().getFullYear(),
                            listeners: {
                                change: function (fieldObj, e) {  
                                },
                                specialkey : function(field, e) {
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },
						this.purListSrch
					]
				},
			],
            margin: '5 0 0 0',
            columns: [
                { 
                    text: '입금일', 
                    width: 80, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'in_date',
                    format: 'Y-m-d',
                    dateFormat: 'Y-m-d',
                    sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text : '결제방법',
                    width : 80, 
                    style : 'text-align:center', 
                    align : 'left', 
                    dataIndex : 'pay_type'
                },
                { 
                    text: '입금금액',
                    width: 100, 
                    style: 'text-align:center', 
                    dataIndex: 'money',
                    align : 'right',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text : '어음번호',
                    width : 100, 
                    style : 'text-align:center', 
                    align : 'left', 
                    dataIndex : 'bill_number'
                },
                {
                    text : '어음발행인',
                    width : 90, 
                    style : 'text-align:center', 
                    align : 'left', 
                    dataIndex : 'bill_issuer'
                },
                {
                    text : '어음만기일',
                    width : 80, 
                    style : 'text-align:center', 
                    align : 'left', 
                    dataIndex : 'bill_expiration',
                    format: 'Y-m-d',
                    dateFormat: 'Y-m-d',
                    sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text : '비고',
                    width : 188, 
                    style : 'text-align:center', 
                    align : 'left', 
                    dataIndex : 'description'
                }
            ],
            title: '입금내역',
            tbar :[modifyDefectAction,removeDefectAction],
            name: 'capa',
            autoScroll: true,
        });

        this.receiveAction = Ext.create('Ext.Action',{
            itemId : 'receiveAction',
            iconCls : 'af-plus-circle',
            text : '입금',
            handler: function (widget, event) {
                var selectedUid = [];
                var selection = gm.me().grid.getSelectionModel().getSelection();
            
                selectedUid.push(selection[0]['data']['unique_id_long']);

                var wa_name = selection[0]['data']['wa_name'];
                var combst_uid = selection[0]['data']['unique_id_long'];
                var myWidth = 600;
				var myHeight = 380;

                var projectStore = Ext.create('Rfx2.store.company.chmr.ClosalStoreByProject', { pageSize: 100 });
                projectStore.getProxy().setExtraParam('order_com_unique',combst_uid);
                projectStore.load();

                var paytype = Ext.create('Ext.data.Store', {
					fields: ['var_value', 'var_name'],
					data: [
						{ "var_value": "현금", "var_name": "현금" },
						{ "var_value": "어음", "var_name": "어음" }
					]
				});

                var formItems = [
                    {
						xtype: 'textfield',
						id: gu.id('wa_name'),
                        readonly : true,
						name: 'wa_name',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						fieldLabel: '공급사',
						value : wa_name
					},
                    {
						xtype: 'numberfield',
						id: gu.id('money'),
						name: 'money',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						fieldLabel: '입금금액',
					},
					{
						xtype: 'datefield',
						id: gu.id('in_date'),
						name: 'in_date',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						value : new Date(),
						fieldLabel: '입금일',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
						format: 'Y-m-d',
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
                    {
						xtype: 'textfield',
						id: gu.id('bill_number'),
						name: 'bill_number',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						fieldLabel: '어음번호',
					},
                    {
						xtype: 'textfield',
						id: gu.id('bill_issuer'),
						name: 'bill_issuer',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						fieldLabel: '어음발행인',
					},
                    {
						xtype: 'datefield',
						id: gu.id('bill_expiration'),
						name: 'bill_expiration',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						value : new Date(),
						fieldLabel: '어음만기일',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
						format: 'Y-m-d',
					},
                    {
						xtype: 'textfield',
						id: gu.id('description'),
						name: 'description',
						padding: '0 0 5px 10px',
						style: 'width: 99%',
						allowBlank: true,
						fieldLabel: '비고',
					},
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
					items: [
						{
							xtype: 'container',
							width: '100%',
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

                var item = [form];

                var prWin = Ext.create('Ext.Window', {
                    modal: true, 
                    title: '입금실행',
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
                                    var val = form.getValues(false);
                                    var rtg_type = "AD";
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/account/arap.do?method=insertMoneyInVer',
                                        params: {
                                            combst_uid : combst_uid,
                                            money : gu.getCmp('money').getValue(),
											in_date : val['in_date'],
                                            pay_type : gu.getCmp('pay_type').getValue(),
                                            bill_number : gu.getCmp('bill_number').getValue(),
                                            bill_issuer : gu.getCmp('bill_issuer').getValue(),
                                            bill_expiration : val['bill_expiration'],
                                            description : gu.getCmp('description').getValue(),
                                            rtg_type : rtg_type
                                        },
                                        success: function (result, request) {
                                            gm.me().store.load();
                                            gm.me().gridCuring.store.load();
                                            Ext.Msg.alert('안내', '입금을 완료하였습니다.', function () { });
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

        buttonToolbar.insert(1, this.receiveAction);

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '55%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.grid]
                    }]
                }, this.gridCuring
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);
        
        this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                console_logs('rec ??????', selections);
                var rec = selections[0];
                var combst_uid = rec.get('unique_id_long');
                this.gridCuring.getStore().getProxy().setExtraParam('combst_uid', combst_uid);
                this.gridCuring.getStore().getProxy().setExtraParam('rtg_type', 'AD');
                this.gridCuring.getStore().load(function (record) {
                });
            } else {
            }
        });

        this.gridCuring.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections) {
                    console_logs('curing ??????', selections);
                } else {
                }
            }
        });
    },

    yearStore: Ext.create('Mplm.store.YearStore', {}),


});