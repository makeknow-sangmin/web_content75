Ext.define('Rfx2.view.company.sejun.designPlan.RequirementAanalysisView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'inspect-category-def-view',



    counsumeRateMtrl: Ext.create('Rfx2.store.company.sejun.PartLineNpStore', {
        sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
    }),

    consumeRateAssy: Ext.create('Rfx2.model.company.sejun.ProduceWorkDefect', {
        sorters: [{
            property: 'rtgast_od_create_date',
            direction: 'DESC'
        }]
    }),

    storeCubeDim: Ext.create('Rfx2.store.company.sejun.PartLineNpStore', {}),
    isYnStore: Ext.create('Mplm.store.YnFlagStore', {}),
    // storeViewProp: Ext.create('Rfx2.store.company.bioprotech.MaterialPurchaseRateStore', {}),

    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var arr = [];

        arr.push(buttonToolbar);
        arr.push(searchToolbar);


        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: '검색',
            disabled: false,
            handler: function (widget, event) {               

            }
        });

        this.expDateAssign = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            itemId: 'expDateAssign',
            text: '일부인 지정',
            disabled: true,
            handler: function (widget, event) {
                var selections = gm.me().gridDimension.getSelectionModel().getSelected().items[0];
                var reserved4 = selections.get('reserved4');
                if(reserved4 === 'Y') {
                    Ext.MessageBox.alert('알림','이미 자재 할당처리가 된 건입니다.');
                    return;
                } else {
                    gm.me().makePalletEl();
                }
            }
        });

        this.requestProduceAssy = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            itemId: 'requestProduceAssy',
            text: '자재할당',
            disabled: true,
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: '자재할당',
                    msg: '입력한 실제배분수량에 따라 할당을 실시합니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            gMain.setCenterLoading(true);
                            var record = gm.me().oneGrid.getSelectionModel().getSelection()[0];
                            console_logs('>>> record', record)
                            console_logs('>>>>', record.get('unique_id_long'));
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/index/process.do?method=assignMaterialByEbom',
                                params: {
                                   prdplan_uid : record.get('pr_uid'),
                                   cartmap_uid : record.get('unique_id_long'),
                                   pcsstep_uid : record.get('process_0|step_uid')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    gMain.setCenterLoading(false);
                                    Ext.MessageBox.alert('알림', '처리 되었습니다.');
                                    gm.me().storeCubeDim.load();
                                },
                                failure: extjsUtil.failureMessage
                            });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION,
                });
            }
        });

        // this.inputPercent = Ext.create('Ext.')
        // var items = [];
		this.inputPercent = {
			xtype: 'textfield',
			fieldStyle: 'text-transform:uppercase',
			// emptyText:  1234,
	        width: 30,
	        id: gu.id('inputPercentData'),
	        name: 'inputPercentData'
	       	// listeners : {
	    		
	    	// 	keydown: function(field, e){
	    	// 		//alert(e.keyCode);
			// 	},
	        // 		specialkey : function(field, e) {
	        // 		if (e.getKey() == 9) {
	        // 			Ext.getCmp('userId').focus(false, 200);
	        // 		}
	        // 	}
	    	// }            	
	    };

        this.percentMark = Ext.create('Ext.form.Label', {
             xtype: 'label',
            text: '%',
            style: 'font-size: 16px;',
            margin: '10 10 0 0'
        });

        this.applyFormula = Ext.create('Ext.Action', {
            itemId: 'applyFormula',
            text: '계산',
            disabled: true,
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: '계산',
                    msg: '퍼센트값 적용',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn, value) {
                        var applyFormulaData = gm.me().storeCubeDim.data.items[0].data.plan_quan_trans;
                        // var applyFormulaData = gm.me().getCmp('plan_quan_trans').getStore();
                        if (btn == 'yes') {
                            for(i=0; i<gm.me().storeCubeDim.data.items.length; i++) {
                                var abcdStore = gm.me().storeCubeDim.data.items[i];
                                gm.me().storeCubeDim.data.items[i].data.plan_quan_trans;
                                console_logs('ANSWELANSWEL', gm.me().storeCubeDim.data.items[i].data.plan_quan_trans);

                                abcdStore.set('i_wanna_qty', gm.me().storeCubeDim.data.items[i].data.plan_quan_trans*(gu.getCmp('inputPercentData').value/100+1));





                            }

                        //     gMain.setCenterLoading(true);
                        //     var record = gm.me().oneGrid.getSelectionModel().getSelection()[0];
                        //     console_logs('>>> record', record)
                        //     console_logs('>>>>', record.get('unique_id_long'));
                        //     Ext.Ajax.request({
                        //         url: CONTEXT_PATH + '/index/process.do?method=assignMaterialByEbom',
                        //         params: {
                        //            prdplan_uid : record.get('pr_uid'),
                        //            cartmap_uid : record.get('unique_id_long'),
                        //            pcsstep_uid : record.get('process_0|step_uid')
                        //         },
                        //         success: function (result, request) {
                        //             var resultText = result.responseText;
                        //             gMain.setCenterLoading(false);
                        //             Ext.MessageBox.alert('알림', '처리 되었습니다.');
                        //             gm.me().storeCubeDim.load();
                        //         },
                        //         failure: extjsUtil.failureMessage
                        //     });

                        }
                    },
                    icon: Ext.MessageBox.QUESTION,
                });
            }
        });


        this.oneGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('oneGrid'),
            selModel: 'checkboxmodel',
            width: '50%',
            store: this.consumeRateAssy,
            style: 'padding-left:0px;',
            scroll : true,

            columns: [
                {
                    text: this.getMC('msg_order_dia_order_customer', '품목코드'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_code'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '품목명'),
                    width: 200,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '생산요청수량'),
                    width: 100,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'bm_quan',
                    
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '생산지시일자'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'rtgast_od_create_date',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                }
            ],
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            // scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.consumeRateAssy,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {
                    }
                }

            }),
            width: 915,
            height: 725,
            listeners: {

            }
        });

        this.oneGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('selections >>>', selections[0]);
                    var rec = selections[0];
                    // gu.getCmp('order_description').setHtml('[' + rec.get('item_code') + '] ' + rec.get('item_name'));
                    gm.me().storeCubeDim.getProxy().setExtraParam('prdplan_uid', rec.get('pr_uid'));
                    gm.me().storeCubeDim.getProxy().setExtraParam('child', rec.get('srcahd_uid'));
                    gm.me().storeCubeDim.getProxy().setExtraParam('reserved_integer4', 1.0);
                    gm.me().storeCubeDim.load();
                    gm.me().requestProduceAssy.enable();
                    gm.me().applyFormula.enable();
                } else {
                    gm.me().requestProduceAssy.disable();
                }
            }
        });



        this.twoGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('twoGrid'),
            layout: 'fit',
            selModel: 'checkboxmodel',
            width: '100%',
            // height : '100%',
            autoHeight: true,
            style: 'padding-left:0px;',
            store: this.counsumeRateMtrl,
            columns: [
                {
                    text: this.getMC('msg_order_dia_order_customer', '품목코드'),
                    width: '8%',
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_code'
                },
                {
                    text: this.getMC('msg_sales_price_oem', '품목명'),
                    width: '13%',
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },

                {
                    text: this.getMC('msg_sales_price_oem', '재고수량'),
                    width: '8%',
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'stock_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '총소요량'),
                    width: '8%',
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'total_need_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '입고예정수량'),
                    width: '12%',
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'total_warehouse_plan_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '과부족'),
                    width: '8%',
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'total_shortage_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '구매요청수량'),
                    width: '12%',
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'produce_request_qty',
                    editor: {
                        xtype: 'numberfield',
                        editable: true,
                    },
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_sales_price_oem', '구매납기일'),
                    width: '10%',
                    sortable: true,
                    align: "left",
                    format: 'Y-m-d',
                    style: 'text-align:center',
                    dataIndex: 'prd_ware_plan_date',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                }
            ],
            // selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        '->',
                        this.requestPurchase,
                    ]
                }

            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                // store: this.produceStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {
                    }
                }

            }),
            viewConfig: {
                markDirty: false,
                stripeRows: true,
                enableTextSelection: false,
                preserveScrollOnReload: true,

            },
            width: 915,
            height: 661,
            listeners: {

            }
        });

        this.twoGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('selections >>>', selections[0]);
                    var rec = selections[0];
                    // gu.getCmp('order_description').setHtml('[' + rec.get('item_code') + '] ' + rec.get('item_name'));
                    gm.me().storeCubeDim.getProxy().setExtraParam('srcahd_uid', rec.get('srcahd_uid'));
                    gm.me().storeCubeDim.load();
                    gm.me().requestPurchase.enable();
                } else {
                    gm.me().requestPurchase.disable();
                }
            }
        });

        this.poStatusTemplate = Ext.create('Ext.tab.Panel', {
            cls: 'rfx-panel',
            layout: 'fit',
            width: '100%',
            height : '100%',
            plain: true,
            items: [{
                title: '생산계획',
                items: [this.oneGrid]
            },
        
        
        ]
        });
        this.consumeRateAssy.getProxy().setExtraParam('orderBy', 'rtgast_od_create_date');
        this.consumeRateAssy.getProxy().setExtraParam('ascDesc', 'DESC');
        this.consumeRateAssy.load();

        var temp = {
            collapsible: false,
            frame: true,
            region: 'west',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 0.5,

            items: [this.poStatusTemplate],
            // dockedItems: [
            //     {
            //         dock: 'top',
            //         xtype: 'toolbar',
            //         cls: 'my-x-toolbar-default2',
            //         items: [
            //             // this.purListSrch,
            //             // this.requestProduceAssy,
            //             // this.requestPurchase,
            //             '->',
            //             // this.analysisPsi
            //         ]
            //     },
            // ]
        };

        this.gridDimension = Ext.create('Ext.grid.Panel', {
            // title: '재고 / 입고 / 소요량 세부',
            store: this.storeCubeDim,
            cls: 'rfx-panel',
            id : gu.id('description'),
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            reigon: 'center',
            layout: 'fit',
            forceFit: false,
            flex: 0.5,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            columns: [
                
                {
                    text: '구분',
                    width: 80,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'product_gubun'
                },
                {
                    text: '품번',
                    width: 100,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'item_code'
                },
                {
                    text: '품명',
                    width: 200,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: '소요량',
                    width: 100,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'plan_quan_trans',
                    renderer: function (value, context, tmeta) {
                        // if (context.field == 'gr_qty') {
                        //     context.record.set('gr_qty', Ext.util.Format.number(value, '0,00/i'));
                        // }
                        console_logs('1111111111111111111111', value);
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '필요량',
                    width: 100,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'i_wanna_qty',
                    renderer: function (value, context, tmeta) {
                        
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '현재고',
                    width: 100,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'stock_qty_ton_kilo',
                    renderer: function (value, context, tmeta) {
                        // if (context.field == 'gr_qty') {
                        //     context.record.set('gr_qty', Ext.util.Format.number(value, '0,00/i'));
                        // }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '실제배분수량',
                    width: 100,
                    align: 'right',
                    style: 'text-align:center',
                    dataIndex: 'assy_mquan',
                    // editor: {
                    //     xtype: 'numberfield',
                    //     listeners: {
                    //         change: function (field, newValue, oldValue) {
                    //             var store = gu.getCmp('description').getStore();
                    //             var record = gu.getCmp('description').getSelectionModel().getSelected().items[0];
                    //             console_logs('>>>> record', record);
                    //             var index = store.indexOf(record);
                    //             Ext.Ajax.request({
                    //                 url: CONTEXT_PATH + '/index/process.do?method=updateDivideResource',
                    //                 waitMsg: '데이터를 처리중입니다.',
                    //                 params: {
                    //                     unique_id_long: record.get('unique_uid'),
                    //                     m_quan: newValue
                    //                 },
                    //                 success: function (result, request) {
                                        
                    //                 }, //endofsuccess
                    //                 failure: function (result, request) {
                    //                     var result = result.responseText;
                    //                     Ext.MessageBox.alert('알림', result);
                    //                 },
                    //             });

                    //         },
                    //     }
                    // },
                    renderer: function (value, context, tmeta) {
                        // if (context.field == 'gr_qty') {
                        //     context.record.set('gr_qty', Ext.util.Format.number(value, '0,00/i'));
                        // }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '지정여부',
                    width: 100,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'exp_date_assign_yn',
                    // editor: {
                    //     xtype: 'combo',
                    //     id: gu.id('role'),
                    //     displayField: 'code_name_kr',
                    //     editable: true,
                    //     forceSelection: true,
                    //     mode: 'local',
                    //     store: this.isYnStore,
                    //     triggerAction: 'all',
                    //     typeAhead: false,
                    //     minChars: 1,
                    //     valueField: 'system_code',
                    //     listConfig: {
                    //         loadingText: 'Searching...',
                    //         emptyText: 'No matching posts found.',
                    //     },
                        // listeners: {
                        //     select: function (combo, rec) {
                        //         var store = gu.getCmp('description').getStore();
                        //         var record = gu.getCmp('description').getSelectionModel().getSelected().items[0];
                        //         var index = store.indexOf(record);

                        //         Ext.Ajax.request({
                        //             url: CONTEXT_PATH + '/index/process.do?method=updateDivideResource',
                        //             waitMsg: '데이터를 처리중입니다.',
                        //             params: {
                        //                 unique_id_long: record.get('unique_uid'),
                        //                 reserved1: rec.get('system_code')
                        //             },
                        //             success: function (result, request) {
                        //                 store.load();
                        //                 gm.me().store.load();
                        //             }, //endofsuccess
                        //             failure: function (result, request) {
                        //                 var result = result.responseText;
                        //                 Ext.MessageBox.alert('알림', result);
                        //             },
                        //         });
                        //     },
                        // },
                    // },
                },

            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.expDateAssign,
                        this.requestProduceAssy,
                        // { xtype: 'textfield',  },
                        this.inputPercent,
                        this.percentMark,
                        this.applyFormula
                        // 버튼추가 2개
                        //textbox 1개
                        //동작 버튼 1개
                    ]
                }
            ]
        });

        this.gridDimension.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('selections >>>', selections[0]);
                    var rec = selections[0];
                    gm.me().expDateAssign.enable();
                } else {
                    gm.me().expDateAssign.disable();
                }
            }
        });



        var temp2 = {
            collapsible: false,
            frame: false,
            region: 'center',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 0.8,
            items: [this.gridDimension/** /, gridViewprop**/]
        };

        Ext.apply(this, {
            layout: 'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: true
            },
            items: [temp, temp2, arr]
        });
        this.callParent(arguments);
    },

    bodyPadding: 10,

    defaults: {
        frame: true,
        bodyPadding: 10
    },

    autoScroll: true,
    fieldDefaults: {
        labelWidth: 300
    },
    items: null,
    makePalletEl: function () {
        var saveStore = null;
        var tempBoxQuan = 0;
        var tempBoxWeight = 0;
        var selections = gm.me().gridDimension.getSelectionModel().getSelected().items[0];
        var srcahd_uid = selections.get('srcahd_uid');
        var mainGrid = gm.me().gridDimension.getSelectionModel().getSelected().items[0];

        gm.me().expdateStoreByMaterial.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
        gm.me().expdateStoreByMaterial.load();

        //setParam Assymap UID 로 바꾸고
        //스토어 이름바꾸고
        //배분수량 적용부분 바꾸고
        console_logs('111111111111111111111111', mainGrid.get('id'));
        console_logs('222222222222222222222222', selections.get('id'));
        
        gm.me().DistributionStore.getProxy().setExtraParam('assymap_uid', selections.get('id'));
        gm.me().DistributionStore.load({callback: function() {
            var total_load = 0;
            var previous_store = gm.me().DistributionStore.data.items;;
            console_logs('previous_store.length VALUE : ', previous_store.length);
            for (var j = 0; j < previous_store.length; j++) {
                console_logs('previous_store['+j+'].get(\'real_out_qty\') VALUE : ', previous_store[j].get('real_out_qty'));
                total_load = total_load + Number(previous_store[j].get('real_out_qty'));
            }
            
            gu.getCmp('total_load_disp').setHtml('<b>총 배분수량 : ' + gUtil.renderNumber(Number(total_load)));
        }});

        var lotList = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: gm.me().expdateStoreByMaterial,
            id: gu.id('prodUnitGrid'),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '99%',
            title: '일부인 별 재고 List',
            autoScroll: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            autoHeight: true,
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false
            },
            columns: [
                
                {
                    text: '일부인',
                    xtype: 'datecolumn',
                    width: '15%',
                    dataIndex: 'exp_date',
                    style: 'text-align:center',
                    typeAhead: false,
                    format: 'Y-m-d',
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: 'LOT_NO',
                    width: '15%',
                    dataIndex: 'lot_no',
                    style: 'text-align:center',
                    typeAhead: false,
                    allowBlank: false,
                },
                {
                    text: '재고수량',
                    width: '18%',
                    xtype: 'numbercolumn',
                    dataIndex: 'stock_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '기 배분수량',
                    width: '18%',
                    xtype: 'numbercolumn',
                    dataIndex: 'move_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '배분 가능한 수량',
                    width: '18%',
                    xtype: 'numbercolumn',
                    dataIndex: 'move_positive_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                }
            ],
            listeners: {
                'itemClick': function (view, record) {
                    console_logs('>>> ddd', record);
                }
            },
            autoScroll: true,
        });

        var savelist = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('savelist'),
            // store: new Ext.data.Store(),
            store: gm.me().DistributionStore,
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '100%',
            title: '저장목록',
            autoScroll: true,
            margin: '10 0 0 5',
            autoHeight: true,
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false
            },
            columns: [
                
                {
                    text: '일부인',
                    width: '12%',
                    xtype: 'datecolumn',
                    dataIndex: 'exp_date',
                    format: 'Y-m-d',
                    style: 'text-align:center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: 'LOT_NO',
                    width: '15%',
                    dataIndex: 'lot_no',
                    style: 'text-align:center',
                    typeAhead: false,
                    allowBlank: false,
                },{
                    text: 'PALLET',
                    width: '15%',
                    dataIndex: 'stock_pos',
                    style: 'text-align:center',
                    typeAhead: false,
                    allowBlank: false,
                },

                {
                    text: '배분수량',
                    width: '12%',
                    editor: 'numberfield',
                    dataIndex: 'real_out_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'box_quan') {
                            context.record.set('box_quan', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },

                },
            ],
            listeners: {
                beforeedit: function (editor, context) {
                    var record = gu.getCmp('savelist').getSelectionModel().getSelected().items[0];
                    var store = gu.getCmp('savelist').getStore();
                },

                edit: function (value, context, ditor, e, eOpts) {
                    var record = gu.getCmp('savelist').getSelectionModel().getSelected().items[0];
                    var store = gu.getCmp('savelist').getStore();
                    var loadList = gu.getCmp('prodUnitGrid').getSelectionModel().getSelected().items[0];
                    console_logs('>>>>>> context', context);
                    console_logs('>>>>>> value', value);
                    var store = gu.getCmp('savelist').getStore();
                    console_logs('record edit >>> ', record);

                    if (context.field === 'real_out_qty') {
                        var load_qty = Number(record.get('item_quan'));
                        var total_load = 0;
                        var previous_store = store.data.items;
                        for (var i = 0; i < previous_store.length; i++) {
                            total_load = total_load + Number(previous_store[i].get('real_out_qty'));
                        }
                        gu.getCmp('total_load_disp').setHtml('<b>총 배분수량 : ' + gUtil.renderNumber(Number(total_load)));
                    }
                }
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            autoScroll: true,
            dockedItems: [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        {
                            xtype: 'label',
                            width: 200,
                            height: 20,
                            id: gu.id('total_load_disp'),
                            html: '<b>총 배분수량 : 0</b>',
                            style: 'color:blue;'
                        },
                        '->',
                        {
                            text: '추가',
                            iconCls: 'af-plus',
                            listeners: [{
                                click: function () {
                                    var isInsert = true;
                                    var store = gu.getCmp('savelist').getStore();
                                    var lotListSel = lotList.getSelectionModel().getSelected().items[0];

                                    var duplication_flag = 0;

                                    for(var k = 0; k < store.data.items.length; k++) {
                                        if(lotListSel.get('unique_id') == store.data.items[k].get('stodtl_uid')) {
                                            duplication_flag = 1
                                            alert('이미 지정된 일부인입니다.');
                                        }
                                    }
                                    
                                        if (isInsert == true && duplication_flag == 0) {
                                            store.insert(store.getCount(), new Ext.data.Record({
                                                'exp_date': lotListSel.get('exp_date'),
                                                'stodtl_uid': lotListSel.get('unique_id'),
                                                'item_code': lotListSel.get('item_code'),
                                                'stock_qty': lotListSel.get('stock_qty'),
                                                'real_out_qty' : selections.get('plan_quan_trans'),
                                                'lot_no' : lotListSel.get('lot_no')
                                            }));
                                            var total_load = 0;
                                            var previous_store = store.data.items;
                                            for (var i = 0; i < previous_store.length; i++) {
                                                total_load = total_load + Number(previous_store[i].get('real_out_qty'));
                                            }
                                        
                                        gu.getCmp('total_load_disp').setHtml('<b>총 배분수량 : ' + gUtil.renderNumber(Number(total_load)));
                                        }
                                    } 
                            }]
                        },
                        {
                            text: '삭제',
                            iconCls: 'af-remove',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('savelist').getSelectionModel().getSelected().items[0];
                                    if (record == null) {
                                        Ext.MessageBox.alert('알림', '삭제할 항목을 선택하십시오.')
                                        return;
                                    } else {
                                        var store = gu.getCmp('savelist').getStore();
                                        gu.getCmp('savelist').getStore().removeAt(gu.getCmp('savelist').getStore().indexOf(record));
                                        var total_load = 0;
                                        console_logs('store Length', store.getCount());
                                        var previous_store = store.data.items;
                                        for (var i = 0; i < previous_store.length; i++) {
                                            total_load = total_load + Number(previous_store[i].get('item_quan'));
                                        }
                                        gu.getCmp('total_load_disp').setHtml('<b>총 배분수량 : ' + gUtil.renderNumber(Number(total_load)));
                                    }
                                }
                            }]
                        },
                    ]
                })
            ],
        });

        var form = Ext.create('Ext.form.Panel', {
            id: 'addDlForm',
            xtype: 'form',
            title: '아래 리스트를 선택 후 추가하여 사용할 반제품/자재의 일부인을 지정하십시오.',
            frame: false,
            border: false,
            region: 'center',
            width: '100%',
            layout: 'vbox',
            bodyPadding: 10,
            items: [
                {
                    xtype: 'label',
                    width: 750,
                    height: 80,
                    html: '<font size=100><p style="text-align:left;">&nbsp&nbsp품명 : ' + selections.get('item_name') + '<br>&nbsp&nbsp품번 : ' + selections.get('item_code')  + '<br>&nbsp&nbsp소요량 : ' + gUtil.renderNumber(Number(selections.get('plan_quan_trans'))) +'('+ gUtil.renderNumber(Number(selections.get('i_wanna_qty'))) +')' + '</p></font>',
                    style: 'color:black;'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '99%',
                    margin: '3 3 3 3',
                    items: [
                        lotList
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '99%',
                    margin: '20 3 3 3',
                    items: [
                        savelist
                    ]
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: true,
            title: '일부인 지정',
            width: 800,
            height: 700,
            plain: true,
            overflowY: 'scroll',
            items: form,
            buttons: [
                {
                    text: '일부인 지정',
                    handler: function (btn) {
                        if (btn == "no" || btn == "cancel") {
                            win.close();
                        } else {
                            var form = Ext.getCmp('addDlForm').getForm();
                            if (form.isValid()) {
                                win.setLoading(true);
                                var val = form.getValues(false);
                                var mainGrid = gm.me().gridDimension.getSelectionModel().getSelected().items[0];
                                console_logs('>>>> mainGrid', mainGrid);
                                var storeData = gu.getCmp('savelist').getStore();
                                var length = storeData.data.items.length;
                                if (length > 0) {
                                    var stodtl_uids = [];
                                    var real_out_qtys = [];
                                    for (var j = 0; j < storeData.data.items.length; j++) {
                                        var item = storeData.data.items[j];
                                        stodtl_uids.push(item.get('stodtl_uid'));
                                        real_out_qtys.push(item.get('real_out_qty'));
                                    }

                                    form.submit({
                                            submitEmptyText: false,
                                            url: CONTEXT_PATH + '/index/process.do?method=assignStodtlAtEBom',
                                            params: {
                                                assymap_uid: mainGrid.get('id'),
                                                stodtl_uids : stodtl_uids,
                                                real_out_qtys : real_out_qtys
                                            },
                                            success: function (val, action) {
                                                win.setLoading(false);
                                                // gm.me().store.load();
                                                gm.me().storeCubeDim.load();
                                                win.close();
                                            },
                                            failure: function () {
                                                win.setLoading(false);
                                                extjsUtil.failureMessage();
                                            }
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림','저장목록에 추가된 지정내역이 없습니다.');
                                    return;
                                }
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
    },
    DistributionStore: Ext.create('Rfx2.store.company.tosimbio.DistributionStore'),
    expdateStoreByMaterial : Ext.create('Rfx2.store.company.sejun.PStockOfProdMovQtyStore'),

});