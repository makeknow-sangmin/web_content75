Ext.define('Rfx2.view.company.chmr.purStock.UnlimitResourceGrView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'capa-view',


    initComponent: function () {

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.UnlimitMaterialGr', [{
            property: 'unique_id',
            direction: 'ASC'
        }],
            gm.pageSize
            , {}
            , ['']
        );

        // 상세내역 Detail 검색
        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];

                var basic_sdate = gu.getCmp('s_date').getValue();
                var basic_edate = gu.getCmp('e_date').getValue();
                console_logs('>>>> basic_sdate', basic_sdate);
                console_logs('>>>> basic_edate', basic_edate);

                var basic_sdate_str = basic_sdate.getFullYear() + '-' + ((basic_sdate.getMonth() + 1) < 10 ? '0' + (basic_sdate.getMonth() + 1) : (basic_sdate.getMonth() + 1)) + '-' + ((basic_sdate.getDate()) < 10 ? '0' + (basic_sdate.getDate()) : (basic_sdate.getDate()));
                var basic_edate_str = basic_edate.getFullYear() + '-' + ((basic_edate.getMonth() + 1) < 10 ? '0' + (basic_edate.getMonth() + 1) : (basic_edate.getMonth() + 1)) + '-' + ((basic_edate.getDate()) < 10 ? '0' + (basic_edate.getDate()) : (basic_edate.getDate()));

                gm.me().curingState.getProxy().setExtraParam('gr_date', basic_sdate_str + ':' + basic_edate_str);
                gm.me().curingState.load();
            }
        });

        this.unlimitMatGr = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: this.getMC('mes_order_edit_btn', '자재입고'),
            tooltip: this.getMC('mes_order_edit_btn_msg', '자재입고'),
            disabled: true,
            handler: function () {
                var select = gm.me().grid.getSelectionModel().getSelection()[0];

                var form = Ext.create('Ext.form.Panel', {
                    id: 'editPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('mes_order_edit_btn', select.get('item_name')+' 입고를 시행합니다.'),
                            width: '100%',
                            style: 'padding:10px',
                            defaults: {
                                labelStyle: 'padding:10px',
                                anchor: '100%',
                                layout: {
                                    type: 'column'
                                }
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
                                    items: [
                                        {
                                            fieldLabel: '수량',
                                            xtype: 'numberfield',
                                            //anchor: '100%',\
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            name: 'gr_qty',
                                            allowBlank: false
                                            //value: new Date(),
                                        },
                                        
                                        {
                                            fieldLabel: '차량번호 ',
                                            xtype: 'textfield',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            name: 'car_no',
                                            allowBlank: true
                                        },
                                        {
                                            fieldLabel: '입고일자',
                                            xtype: 'datefield',
                                            //anchor: '100%',\
                                            padding: '0 0 5px 30px',
                                            width: '95%',
                                            format: 'Y-m-d',
                                            name: 'input_date',
                                            allowBlank: false
                                            //value: new Date(),
                                        },
                                    ]
                                },

                            ]
                        },

                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_edit_btn', '자재입고'),
                    width: 650,
                    height: 200,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('editPoForm').getForm();
                                if (form.isValid()) {

                                    win.setLoading(true);

                                    var val = form.getValues(false);

                                    form.submit({
                                        url: CONTEXT_PATH + '/quality/wgrast.do?method=goodsReceiptNopo',
                                        params: {
                                            cartmap_uid: select.get('unique_id_long'),
                                            item_name : select.get('item_name'),
                                            comast_uid : vCOMAST_UID
                                        },
                                        success: function (val, action) {
                                            gm.me().store.load();
                                            gm.me().curingState.load();
                                            win.setLoading(false);
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                        }
                                    });

                                } else {
                                    Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            win.close();
                        }
                    }]
                });
                win.show();
            }
        });

        var arr = [];
        arr.push(buttonToolbar);
        buttonToolbar.insert(1, this.unlimitMatGr);
        // arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        // CAPAMAP 스토어
        this.curingState = Ext.create('Rfx2.store.company.chmr.UnlimitInnListStore', { pageSize: 100 });

        

       
        this.gridCuring = Ext.create('Ext.grid.Panel', {
            store: this.curingState,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            // bbar: getPageToolbar(this.curingState),
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            viewConfig: {
                
                emptyText: '<div style="text-align:center; padding-top:30% ">조회된 데이터가 없습니다.</div>'
                // emptyText: 'No data...'
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            dockedItems: [
				{
					dock: 'top',
					xtype: 'toolbar',
					cls: 'my-x-toolbar-default1',
					items: [
						{
							xtype: 'datefield',
							id: gu.id('s_date'),
							// name: 'stock_date',
							// padding: '0 0 5px 5px',
							width: '20%',
							labelStyle: 'width:60px; color: #ffffff;',
							// allowBlank: true,
							fieldLabel: '입고일자',
							format: 'Y-m-d',
							value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
						},
                        {
                            xtype: 'label',
                            text: '-',
                            margin: '0 0 0 0'
                        },
                        {
							xtype: 'datefield',
							id: gu.id('e_date'),
							// name: 'stock_date',
							padding: '0 0 5px 5px',
							width: '13%',
							labelStyle: 'width:60px; color: #ffffff;',
							format: 'Y-m-d',
							value: new Date(),
						},
                        this.purListSrch
					]
				},
			],
            // selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                { 
                    text: '입고일', 
                    width: 130, 
                    style: 'text-align:center', 
                    align: 'left', 
                    dataIndex: 'gr_date',
                    renderer: function (value, context, tmeta) {
                        if (value !== null && value.length > 0) {
                            return value.substring(0, 10);
                        }
                    },
                },
                { 
                    text: '입고수량',
                    width: 140, 
                    align: 'left',
                    style: 'text-align:center', 
                    dataIndex: 'gr_qty',
                    align : 'right',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                { 
                    text: '차량번호', 
                    width: 140, 
                    align: 'left',
                    style: 'text-align:center', 
                    align : 'center',
                    dataIndex: 'gr_reason'
                }
            ],
            title: '원자재 입고내역',
            name: 'capa',
            autoScroll: true,
           
        });


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
                    width: '50%',
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
                var xpoast_uid = rec.get('unique_id_long');
                this.unlimitMatGr.enable();
                this.gridCuring.getStore().getProxy().setExtraParam('xpoast_uid', xpoast_uid);
                this.gridCuring.getStore().load(function (record) {
                });
            } else {
                this.unlimitMatGr.disable();
            }
        });

        this.gridCuring.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections) {
                    console_logs('curing ??????', selections);
                    // gm.me().updateCapaMap.enable();
                    // gm.me().deleteCapaMap.enable();
                    // gm.me().gridCapaList.getStore().load(function (record) {
                    // });
                } else {
                    // gm.me().updateCapaMap.disable();
                    // gm.me().deleteCapaMap.disable();
                }
            }
        });
    },




});