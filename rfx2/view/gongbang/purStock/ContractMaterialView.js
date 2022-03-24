Ext.define('Rfx2.view.gongbang.purStock.ContractMaterialView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'contract-material-view',


    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //this.addSearchField('unique_id');
        this.setDefComboValue('standard_flag', 'valueField', 'R');

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        //this.addSearchField('supplier_name');
        this.addSearchField('specification');

        this.addCallback('CHECK_SP_CODE', function (combo, record) {

            gMain.selPanel.refreshStandard_flag(record);

        });

        /* 임시로 모든 제품/자재로 늘림 */
        //this.searchStore.getProxy().setExtraParam('standard_flag', 'R');

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    buttonToolbar.items.remove(item);
                    break;
                default:
                    break;
            }
        });

        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        //console_logs('this.fields', this.fields);
        this.createStore('Rfx2.model.StockMgmtGHDetail', [{
                property: 'unique_id',
                direction: 'DESC'
            }], gm.pageSize
            , {},
            ['srcahd']
        );

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.contractMaterialStore = Ext.create('Rfx2.store.company.kbtech.ContractMaterialStore', {pageSize: 100000});
        this.contractMaterialByCompanyListStore = Ext.create('Rfx2.store.company.kbtech.ContractMaterialStore', {pageSize: 100000});

        // 자재 계약
        this.addContractMatAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: '계약사 추가',
            tooltip: '자재 계약',
            disabled: true,
            handler: function () {
                var mStore = Ext.create('Mplm.store.SupastStore');
                var selections = gm.me().grid.getSelectionModel().getSelection();

                console_logs('selections', selections);


                if (selections.length > 0) {
                    var rec = selections[0];

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [

                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                value: rec.get('unique_id'),
                                flex: 1,
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                value: rec.get('item_code'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                value: rec.get('item_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'item_name',
                                value: rec.get('specification'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('maker_name'),
                                xtype: 'textfield',
                                id: gu.id('maker_name'),
                                name: 'maker_name',
                                value: rec.get('maker_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: '공급사',
                                labelWidth: 80,
                                xtype: 'combo',
                                anchor: '100%',
                                name: 'supast_uid',
                                //id: 'mola',
                                mode: 'local',
                                displayField: 'supplier_name',
                                store: mStore,
                                sortInfo: {field: 'pj_name', direction: 'DESC'},
                                valueField: 'unique_id',
                                typeAhead: false,
                                minChars: 1,
                                flex: 1,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">[{supplier_code}] {supplier_name}</div>';
                                    }
                                }
                            }, {
                                fieldLabel: '통화',
                                xtype: 'textfield',
                                id: gu.id('currency'),
                                name: 'currency',
                                value: 'KRW',
                                flex: 1
                            }, {
                                fieldLabel: '단가',
                                xtype: 'textfield',
                                id: gu.id('sales_price'),
                                name: 'sales_price',
                                flex: 1
                            }, {
                                fieldLabel: '계약시작일',
                                xtype: 'datefield',
                                id: gu.id('start_date'),
                                name: 'start_date',
                                value: new Date(),
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',
                                dateFormat: 'Y-m-d',
                                flex: 1
                            }, {
                                fieldLabel: '계약종료일',
                                xtype: 'datefield',
                                id: gu.id('end_date'),
                                name: 'end_date',
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',
                                dateFormat: 'Y-m-d',
                                flex: 1
                            }

                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '계약',
                        width: 500,
                        height: 350,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().addContractMat(val, winPart);
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                } // endofhandler
            }
        });

        // 자재 계약
        this.removeContractMatAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: '계약사 삭제',
            tooltip: '계약 삭제',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '계약 삭제',
                    msg: '계약사를 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {

                            var grid = gu.getCmp('gridContractCompany');
                            var record = grid.getSelectionModel().getSelected().items[0];

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/material.do?method=removeContractMat',
                                params: {
                                    srcmapUid: record.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gu.getCmp('gridContractCompany').getStore().load();
                                },
                                failure: extjsUtil.failureMessage
                            });//endof ajax request
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.addContractMatByCompanyAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: CMD_ADD,
            tooltip: '단가 추가',
            disabled: true,
            handler: function () {
                var mStore = Ext.create('Mplm.store.CombstStore', {pageSize: 2000});
                var cStore = Ext.create('Mplm.store.ComCstStore', {pageSize: 2000});
                var currencyStore = Ext.create('Mplm.store.CommonCodeExStore', {parentCode: "CURRENCY_GROUP"})
                var selections = gm.me().twoGrid.getSelectionModel().getSelection();

                console_logs('selections', selections);


                if (selections.length > 0) {
                    var rec = selections[0];

                    this.itemSearchAction = Ext.create('Ext.Action', {
                        iconCls: 'af-search',
                        text: CMD_SEARCH/*'검색'*/,
                        tooltip: CMD_SEARCH/*'검색'*/,
                        disabled: false,
                        handler: function () {
                            var extraParams = gm.me().searchStore.getProxy().getExtraParams();
                            if (Object.keys(extraParams).length == 0) {
                                Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                            } else {
                                gm.me().searchStore.load();
                            }
                        }
                    });

                    this.gridViewTable = Ext.create('Ext.grid.Panel', {
                        store: gm.me().searchStore,
                        cls: 'rfx-panel',
                        multiSelect: false,
                        autoScroll: true,
                        border: false,
                        height: 320,
                        padding: '0 0 5 0',
                        layout: 'fit',
                        forceFit: false,
                        listeners: {
                            select: function (selModel, record, index, options) {
                                gu.getCmp('unique_id').setValue(record.get('unique_id_long'));
                                gu.getCmp('item_code').setValue(record.get('item_code'));
                                gu.getCmp('item_name').setValue(record.get('item_name'));
                                gu.getCmp('specification').setValue(record.get('specification'));
                            }
                        },
                        dockedItems: [
                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                style: 'background-color: #EFEFEF;',
                                items: [
                                    {
                                        field_id: 'search_item_code',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_item_code_part'),
                                        name: 'search_item_code',
                                        margin: '3 3 3 3',
                                        xtype: 'triggerfield',
                                        emptyText: gm.me().getMC('msg_product_add_search_field1', '품번'),
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');

                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('item_code', '%' + e + '%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.item_code;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        field_id: 'search_item_name',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_item_name_part'),
                                        name: 'search_item_name',
                                        xtype: 'triggerfield',
                                        margin: '3 3 3 3',
                                        emptyText: gm.me().getMC('msg_product_add_search_field2', '품명'),
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('item_name', '%' + e + '%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.item_name;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        field_id: 'search_specification',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_specification_part'),
                                        name: 'search_specification',
                                        xtype: 'triggerfield',
                                        margin: '3 3 3 3',
                                        emptyText: gm.me().getMC('msg_product_add_search_field3', '규격'),
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('specification', '%' + e + '%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.specification;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    '->',
                                    this.itemSearchAction
                                ]
                            }
                        ],
                        columns: [
                            {
                                text: gm.me().getMC('msg_product_add_search_field1', '품번'),
                                width: 120,
                                dataIndex: 'item_code'
                            },
                            {
                                text: gm.me().getMC('msg_product_add_search_field2', '품명'),
                                width: 270,
                                dataIndex: 'item_name',
                                renderer: function (value) {
                                    return value.replace(/</gi, "&lt;");
                                }
                            },
                            {
                                text: gm.me().getMC('msg_product_add_search_field3', '규격'),
                                width: 270,
                                dataIndex: 'specification'
                            }
                        ]
                    });

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 690,
                        height: 740,
                        bodyPadding: 10,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 100
                        },
                        items: [
                            this.gridViewTable,
                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'hiddenfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                flex: 1,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            // {
                            //     fieldLabel: gm.me().getMC('msg_sales_price_contractname', '계약명'),
                            //     xtype: 'textfield',
                            //     id: gu.id('c_name'),
                            //     name: 'c_name'
                            // },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'specification',
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객사'),
                                xtype: 'textfield',
                                id: gu.id('wa_name_kr'),
                                name: 'wa_name',
                                value: rec.get('wa_name'),
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: '공급사',
                                xtype: 'hiddenfield',
                                id: gu.id('supast_uid'),
                                name: 'supast_uid',
                                value: rec.get('unique_id_long')
                            },
                            // {
                            //     fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>'+gm.me().getMC('msg_product_add_dia_div', '사업부'),
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'comcst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'division_name',
                            //     store: cStore,
                            //     sortInfo: {field: 'unique_id', direction: 'ASC'},
                            //     valueField: 'unique_id',
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">{division_code}</div>';
                            //         }
                            //     }
                            // },
                            {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_order_grid_prd_currency', '통화'),
                                xtype: 'combo',
                                anchor: '100%',
                                name: 'currency',
                                mode: 'local',
                                displayField: 'system_code',
                                store: currencyStore,
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                valueField: 'system_code',
                                typeAhead: false,
                                allowBlank: false,
                                minChars: 1,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{code_name}">{system_code}</div>';
                                    }
                                }
                            }, {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_product_add_dia_price', '단가'),
                                xtype: 'textfield',
                                id: gu.id('sales_price'),
                                allowBlank: false,
                                name: 'sales_price'
                            }, {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_sales_price_contractstart', '계약시작일'),
                                xtype: 'datefield',
                                id: gu.id('start_date'),
                                name: 'start_date',
                                format: 'Y-m-d',
                                allowBlank: false,
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                value: new Date()
                            }, {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractend', '계약종료일'),
                                xtype: 'datefield',
                                id: gu.id('end_date'),
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                name: 'end_date'
                            }/*, {
                                fieldLabel: 'Comment',
                                xtype: 'textfield',
                                id: gu.id('buyer_item_code'),
                                name: 'buyer_item_code'
                            }*/
                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '자재추가',
                        width: 690,
                        height: 740,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().addContractMatByCompany(val, winPart, 'company');
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                } // endofhandler
            }
        });

        // 자재 계약
        this.modifySalesPriceByCompanyAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: CMD_MODIFY,
            tooltip: '단가 수정',
            disabled: true,
            handler: function () {
                var mStore = Ext.create('Mplm.store.CombstStore', {pageSize: 2000});
                var cStore = Ext.create('Mplm.store.ComCstStore', {pageSize: 2000});
                var currencyStore = Ext.create('Mplm.store.CommonCodeExStore', {parentCode: "CURRENCY_GROUP"})
                var selections = gm.me().twoGrid.getSelectionModel().getSelection();
                var salesPriceSelection = gm.me().gridContractMaterial.getSelectionModel().getSelection()[0];

                mStore.load();
                cStore.load();
                console_logs('selections', selections);
                console_logs('selections >>>>> ', salesPriceSelection);
                if (selections.length > 0) {
                    var rec = selections[0];

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [
                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                value: salesPriceSelection.get('srcahd_uid'),
                                flex: 1,
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'hiddenfield',
                                id: gu.id('unique_id_long'),
                                name: 'unique_id_long',
                                value: salesPriceSelection.get('unique_id_long')
                            },
                            // {
                            //     fieldLabel: gm.me().getMC('msg_sales_price_contractname', '계약명'),
                            //     xtype: 'textfield',
                            //     id: gu.id('c_name'),
                            //     name: 'c_name',
                            //     value: salesPriceSelection.get('supplier_name'),
                            //     flex: 1
                            // },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                value: salesPriceSelection.get('item_code'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                value: salesPriceSelection.get('item_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'item_name',
                                value: salesPriceSelection.get('specification'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객사'),
                                labelWidth: 80,
                                xtype: 'combo',
                                anchor: '100%',
                                name: 'combst_uid',
                                //id: 'mola',
                                mode: 'local',
                                displayField: 'wa_name',
                                value: salesPriceSelection.get('combst_uid'),
                                store: mStore,
                                sortInfo: {field: 'unique_id', direction: 'DESC'},
                                valueField: 'unique_id',
                                typeAhead: false,
                                allowBlank: false,
                                minChars: 1,
                                flex: 1,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
                                    }
                                }
                            },

                            // {
                            //     fieldLabel: gm.me().getMC('msg_product_add_dia_div', '사업부'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'comcst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'division_name',
                            //     store: cStore,
                            //     sortInfo: {field: 'unique_id', direction: 'ASC'},
                            //     valueField: 'unique_id',
                            //     value: salesPriceSelection.get('comcst_uid'),
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">{division_code}</div>';
                            //         }
                            //     }
                            // },
                            {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_order_grid_prd_currency', '통화'),
                                labelWidth: 80,
                                xtype: 'combo',
                                anchor: '100%',
                                name: 'currency',
                                mode: 'local',
                                displayField: 'system_code',
                                store: currencyStore,
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                valueField: 'system_code',
                                typeAhead: false,
                                allowBlank: false,
                                value: salesPriceSelection.get('currency'),
                                minChars: 1,
                                flex: 1,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{code_name}">{system_code}</div>';
                                    }
                                }
                            },
                            /*{
                             fieldLabel: '통화',
                             xtype: 'textfield',
                             id: gu.id('currency'),
                             name: 'currency',
                             value: salesPriceSelection.get('currency'),
                             flex: 1
                             },*/ {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_product_add_dia_price', '단가'),
                                xtype: 'textfield',
                                id: gu.id('sales_price'),
                                name: 'sales_price',
                                allowBlank: false,
                                value: salesPriceSelection.get('sales_price'),
                                flex: 1
                            }, {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_sales_price_contractstart', '계약시작일'),
                                xtype: 'datefield',
                                id: gu.id('start_date'),
                                name: 'start_date',
                                format: 'Y-m-d',
                                allowBlank: false,
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                value: salesPriceSelection.get('start_date') == null ? null : new Date(salesPriceSelection.get('start_date')),
                                flex: 1
                            }, {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractend', '계약종료일'),
                                xtype: 'datefield',
                                id: gu.id('end_date'),
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                value: salesPriceSelection.get('end_date') == null ? null : new Date(salesPriceSelection.get('end_date')),
                                name: 'end_date',
                                flex: 1
                            }/*, {
                                fieldLabel: 'Comment',
                                xtype: 'textfield',
                                id: gu.id('buyer_item_code'),
                                value: salesPriceSelection.get('comment'),
                                name: 'buyer_item_code',
                                flex: 1
                            }*/

                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '수정',
                        width: 500,
                        height: 420,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().modifyContractMatByCompany(val, winPart);
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                } // endofhandler
            }
        });

        // 자재 계약
        this.removeContractMatByCompanyAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: CMD_DELETE,
            tooltip: '계약 삭제',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '계약 삭제',
                    msg: '계약사를 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {

                            var grid = gu.getCmp('gridContractMaterial');
                            var record = grid.getSelectionModel().getSelected().items[0];

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/material.do?method=removeContractMat',
                                params: {
                                    srcmapUid: record.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gu.getCmp('gridContractMaterial').getStore().load();
                                },
                                failure: extjsUtil.failureMessage
                            });//endof ajax request
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractCompany'),
            store: this.contractMaterialStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            frame: true,
            //bbar: getPageToolbar(this.poCartListStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            //selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('selectedMtrl'),
                            html: "자재를 선택하시기 바랍니다",
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addContractMatAction,
                        {
                            text: '▲',
                            listeners: [{
                                click: function () {
                                    var direction = -1;
                                    var grid = gu.getCmp('gridContractCompany');
                                    var record = grid.getSelectionModel().getSelected().items[0];
                                    if (!record) {
                                        return;
                                    }

                                    var index = grid.getStore().indexOf(record);
                                    if (direction < 0) {
                                        index--;
                                        if (index < 0) {
                                            return;
                                        }
                                    } else {
                                        index++;
                                        if (index >= grid.getStore().getCount()) {
                                            return;
                                        }
                                    }

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/purchase/material.do?method=updateSortOrder',
                                        params: {
                                            srcmap_uid: record.get('unique_id'),
                                            srcahd_uid: record.get('srcahd_uid'),
                                            sort_order: record.get('sort_order') - 1
                                        },
                                        success: function (result, request) {
                                            var resultText = result.responseText;
                                            console_log('result:' + resultText);
                                        },
                                        failure: extjsUtil.failureMessage
                                    });//endof ajax request

                                    grid.getStore().remove(record);
                                    grid.getStore().insert(index, record);
                                    grid.getSelectionModel().select(index, true);

                                    var cnt = grid.getStore().getCount();
                                    var p_price = 0;
                                    for (var i = 0; i < cnt; i++) {
                                        var record = grid.getStore().getAt(i);
                                        record.set('sort_order', i + 1);
                                    }
                                }
                            }]
                        },
                        {
                            text: '▼',
                            listeners: [{
                                click: function () {
                                    var direction = 1;
                                    var grid = gu.getCmp('gridContractCompany');
                                    var record = grid.getSelectionModel().getSelected().items[0];
                                    if (!record) {
                                        return;
                                    }

                                    var index = grid.getStore().indexOf(record);
                                    if (direction < 0) {
                                        index--;
                                        if (index < 0) {
                                            return;
                                        }
                                    } else {
                                        index++;
                                        if (index >= grid.getStore().getCount()) {
                                            return;
                                        }
                                    }

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/purchase/material.do?method=updateSortOrder',
                                        params: {
                                            srcmap_uid: record.get('unique_id'),
                                            srcahd_uid: record.get('srcahd_uid'),
                                            sort_order: record.get('sort_order') + 1
                                        },
                                        success: function (result, request) {
                                            var resultText = result.responseText;
                                            console_log('result:' + resultText);
                                        },
                                        failure: extjsUtil.failureMessage
                                    });//endof ajax request

                                    grid.getStore().remove(record);
                                    grid.getStore().insert(index, record);
                                    grid.getSelectionModel().select(index, true);

                                    var cnt = grid.getStore().getCount();
                                    var p_price = 0;
                                    for (var i = 0; i < cnt; i++) {
                                        var record = grid.getStore().getAt(i);
                                        record.set('sort_order', i + 1);
                                    }
                                }
                            }]
                        },
                        this.removeContractMatAction
                    ]
                }
            ],
            columns: [
                {text: '순위', width: 50, style: 'text-align:center', dataIndex: 'sort_order', sortable: false},
                {text: '계약업체', width: 250, style: 'text-align:center', dataIndex: 'supplier_name', sortable: false},
                {
                    text: '계약단가',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'sales_price',
                    align: 'right',
                    sortable: false,
                    editor: 'textfield',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sales_price') {
                            context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {text: '통화', width: 100, style: 'text-align:center', dataIndex: 'currency', sortable: false},
                {
                    text: '계약시작일', width: 100, style: 'text-align:center', dataIndex: 'start_date', sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: '계약종료일', width: 100, style: 'text-align:center', dataIndex: 'end_date', sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
            ],
            title: '계약 업체 리스트',
            name: 'po',
            autoScroll: true,
            listeners: {
                cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                        var tempTextArea = document.createElement("textarea");
                        document.body.appendChild(tempTextArea);
                        tempTextArea.value = eOpts.target.innerText;
                        tempTextArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempTextArea);
                    }
                },
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'srcmap';
                    var unique_id = e.record.getId();
                    var srcahd_uid = e.record.get('srcahd_uid');
                    var value = e.value;

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});

                    if (columnName === 'sales_price') {
                        gm.editAjax('srcahd', columnName, value, 'unique_id', srcahd_uid, {type: ''});
                    }

                    gm.me().store.load();
                }
            }
        });

        this.gridContractMaterial = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractMaterial'),
            store: this.contractMaterialByCompanyListStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            frame: true,
            //bbar: getPageToolbar(this.poCartListStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            //selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('selectedCompany'),
                            html: '공급사를 선택하시기 바랍니다.',
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addContractMatByCompanyAction,
                        //this.copySalesPriceByCompanyAction,
                        //this.modifySalesPriceByCompanyAction,
                        this.removeContractMatByCompanyAction
                    ]
                }
            ],
            columns: [
                {
                    text: this.getMC('msg_product_add_search_field1', '품번'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'item_code',
                    sortable: true
                },
                {
                    text: this.getMC('msg_product_add_search_field2', '품명'),
                    width: 150,
                    style: 'text-align:center',
                    dataIndex: 'item_name',
                    sortable: true
                },
                {
                    text: this.getMC('msg_product_add_search_field3', '규격'),
                    width: 150,
                    style: 'text-align:center',
                    dataIndex: 'specification',
                    sortable: false
                },
                {
                    text: '계약단가',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'sales_price',
                    align: 'right',
                    sortable: false,
                    editor: 'textfield',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sales_price') {
                            context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '계약시작일', width: 100, style: 'text-align:center', dataIndex: 'start_date', sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: '계약종료일', width: 100, style: 'text-align:center', dataIndex: 'end_date', sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: this.getMC('msg_order_grid_prd_currency', '통화'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'currency',
                    sortable: false,
                }
            ],
            title: this.getMC('msg_sales_price_description', '계약 자재 리스트'),
            name: 'po',
            autoScroll: true,
            listeners: {
                cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                        var tempTextArea = document.createElement("textarea");
                        document.body.appendChild(tempTextArea);
                        tempTextArea.value = eOpts.target.innerText;
                        tempTextArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempTextArea);
                    }
                },
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'srcmap';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                    gm.me().store.load();
                }
            }
        });

        Ext.each(this.gridContractCompany.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'sales_price':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'sales_price':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00.#####');
                    };
                    break;
                default:
                    break;
            }

        });

        Ext.each(this.gridContractMaterial.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'sales_price':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'sales_price':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00.#####');
                    };
                    break;
                default:
                    break;
            }
        });

        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {
                    gm.me().removeContractMatAction.enable();
                } else {
                    gm.me().removeContractMatAction.disable();
                }
            }
        });

        this.gridContractMaterial.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {
                    gm.me().modifySalesPriceByCompanyAction.enable();
                    gm.me().removeContractMatByCompanyAction.enable();
                } else {
                    gm.me().modifySalesPriceByCompanyAction.disable();
                    gm.me().removeContractMatByCompanyAction.disable();
                }
            }
        });

        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        this.grid.flex = 1;

        // Ext.apply(this, {
        //     layout: 'border',
        //     items: [
        //         {
        //             //title: '제품 및 템플릿 선택',
        //             collapsible: false,
        //             frame: false,
        //             region: 'west',
        //             layout: {
        //                 type: 'hbox',
        //                 pack: 'start',
        //                 align: 'stretch'
        //             },
        //             margin: '5 0 0 0',
        //             width: '60%',
        //             items: [{
        //                 region: 'west',
        //                 layout: 'fit',
        //                 margin: '0 0 0 0',
        //                 width: '100%',
        //                 items: [this.grid]
        //             }]
        //         },this.gridContractCompany
        //     ]
        // });

        this.newButtonToolBar = buttonToolbar;
        this.newSearchToolBar = searchToolbar;

        this.supastStore = Ext.create('Rfx2.store.company.bioprotech.SupastStore', {pageSize: 100});
        //this.supastStore = Ext.create('Mplm.store.supastStore', {pageSize: 100});
        //this.supastStore.sorters.removeAll();

        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var wa_name = '';

                    if (Ext.getCmp('supplier_name').getValue().length > 0) {
                        reserved_varcharh = Ext.getCmp('supplier_name').getValue();
                    }
                } catch (e) {

                }
                gm.me().supastStore.getProxy().setExtraParam('supplier_name', '%' + wa_name + '%');
                gm.me().supastStore.load();
            }
        });

        this.twoGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('twoGrid'),
            selModel: 'checkboxmodel',
            store: this.supastStore,
            columns: [
                {
                    text: '공급사',
                    width: 200,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'supplier_name'
                },
                {
                    text: '업태',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'business_condition'
                },
                {
                    text: '종목',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'business_category'
                },
                {
                    text: '주소',
                    width: 250,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'address_1'
                }
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.purListSrch,
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    layout: 'column',
                    defaults: {
                        style: 'margin-top: 1px; margin-bottom: 1px;'
                    },
                    items: [{
                        xtype: 'triggerfield',
                        emptyText: '공급사',
                        id: gu.id('supplier_name'),
                        width: 130,
                        fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                        name: 'query_sup',
                        listeners: {
                            specialkey: function (field, e) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().supastStore.getProxy().setExtraParam('supplier_name', '%' + gu.getCmp('supplier_name').getValue() + '%');
                                    gm.me().supastStore.load(function () {
                                    });
                                }
                            }
                        },
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        'onTrigger1Click': function () {
                            gu.getCmp('supplier_name').setValue('');
                            this.supastStore.getProxy().setExtraParam('supplier_name', gu.getCmp('supplier_name').getValue());
                            this.supastStore.load(function () {
                            });
                        }
                    }]
                }
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.supastStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {
                        // console_logs('여기++++++++++++++++++++++++++++++++++++++++ : ', record);
                    }
                }

            }),
            viewConfig: {
                markDirty: false,
                stripeRows: true,
                enableTextSelection: false,
                preserveScrollOnReload: true,
                getRowClass: function (record, index) {
                    var recv_flag = record.get('recv_flag');
                    switch (recv_flag) {
                        case 'EM' :
                            return 'yellow-row';
                            break;
                        case 'SE':
                            return 'red-row';
                            break;
                    }
                }
            },
            listeners: {
                afterrender: function (grid) {
                    var elments = Ext.select(".x-column-header", true);
                    elments.each(function (el) {
                    }, this);
                },
                cellclick: function (iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent) {
                    this.selColIdx = iColIdx;
                    console_logs('iColIdx', this.selColIdx);
                },
                edit: function (editor, e, eOpts) {
                    console_logs('record', e.record);
                    var idx = this.selColIdx;
                    var pos = Math.trunc(idx / 2);
                    var type = idx % 2 == 1 ? 'time' : 'human';
                    var name = type + (pos + 1);
                    var val = e.record.get(name);
                    console.log(name, val);
                }
            }
        });

        this.supastStore.load();

        var leftContainer = new Ext.container.Container({
            title: gm.getMC('CMD_Item_Standard', '품목기준'),
            region: 'center',
            layout: {
                type: 'border'
            },
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 0.85,
                    items: [this.grid]
                },
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [this.gridContractCompany]
                }
            ]
        });

        this.twoGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gm.me().removeContractMatAction.disable();
                if (selections.length) {
                    var rec = selections[0];

                    var supName = rec.get('supplier_name');

                    gu.getCmp('selectedCompany').setHtml(supName);
                    gm.me().contractMaterialByCompanyListStore.getProxy().setExtraParam('supast_uid', rec.get('unique_id_long'));
                    gm.me().contractMaterialByCompanyListStore.getProxy().setExtraParam('fix_type', 'PR');    // 판매용 단가 리스트 구분
                    gm.me().contractMaterialByCompanyListStore.load();
                    gm.me().addContractMatByCompanyAction.enable();
                } else {
                    gm.me().addContractMatByCompanyAction.disable();
                }
            }
        });

        var rightContainer = new Ext.container.Container({
            title: '공급사 기준',
            region: 'center',
            layout: {
                type: 'border'
            },
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 0.6,
                    items: [this.twoGrid]
                },
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [this.gridContractMaterial]
                }
            ]
        });

        var mainTab = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [leftContainer, rightContainer]
        });

        Ext.apply(this, {
            layout: 'border',
            items: mainTab
        });

        // this.setAllMatView = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     text: '전체',
        //     tooltip: '전체',
        //     toggleGroup: 'matType',
        //     handler: function () {
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.load(function () {
        //         });
        //     }
        // });

        // this.setSaMatView = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     text: '원자재',
        //     tooltip: '원자재',
        //     toggleGroup: 'matType',
        //     handler: function () {
        //         this.matType = 'RAW';
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sp_code', 'S');
        //         gm.me().store.load(function () {
        //         });
        //     }
        // });
        // this.setMROView = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     text: 'MRO',
        //     tooltip: '소모성',
        //     toggleGroup: 'matType',
        //     handler: function () {
        //         this.matType = 'SUB';
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sp_code', 'M');
        //         gm.me().store.load(function () {
        //         });
        //     }
        // });
        // this.setSubMatView = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     text: '부자재',
        //     tooltip: '부자재',
        //     toggleGroup: 'matType',
        //     handler: function () {
        //         this.matType = 'SUB';
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sp_code', 'B');
        //         gm.me().store.load(function () {
        //         });
        //     }
        // });
        // this.setUsedMatView = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     text: '상품',
        //     tooltip: '상품',
        //     toggleGroup: 'matType',
        //     handler: function () {
        //         this.matType = 'SUB';
        //         gm.me().store.getProxy().setExtraParams({});
        //         gm.me().store.getProxy().setExtraParam('sp_code', 'P');
        //         gm.me().store.load(function () {
        //         });
        //     }
        // });

        //버튼 추가.
        buttonToolbar.insert(6, '-');
        buttonToolbar.insert(6, this.setUsedMatView);
        buttonToolbar.insert(6, this.setMROView);
        buttonToolbar.insert(6, this.setSubMatView);
        buttonToolbar.insert(6, this.setSaMatView);
        // buttonToolbar.insert(6, this.setSetMatView);
        // buttonToolbar.insert(6, this.setAssyMatView);
        buttonToolbar.insert(6, this.setAllMatView);

        buttonToolbar.insert(6, '-');

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            this.removeContractMatAction.disable();
            if (selections.length) {
                var rec = selections[0];

                var itemCode = rec.get('item_code');
                var itemName = rec.get('item_name');
                var specification = rec.get('specification');

                gu.getCmp('selectedMtrl').setHtml('[' + itemCode + '] ' + itemName + ' / ' + specification);
                this.contractMaterialStore.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                this.contractMaterialStore.getProxy().setExtraParam('fix_type', 'PR');
                this.contractMaterialStore.load();
                this.addContractMatAction.enable();
            } else {
                this.addContractMatAction.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        /* 임시로 모든 제품/자재로 늘림 */
        //this.store.getProxy().setExtraParam('standard_flag', 'R');
        this.store.load(function (records) {

        });
    },

    addContractMat: function (val, win) {
        Ext.MessageBox.show({
            title: '계약',
            msg: '이 회사와 자재를 계약 처리 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/material.do?method=addContractMat',
                        params: {
                            currency: val['currency'],
                            sales_price: val['sales_price'],
                            srcahd_uid: val['unique_id'],
                            supast_uid: val['supast_uid'],
                            start_date: val['start_date'],
                            end_date: val['end_date']
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gu.getCmp('gridContractCompany').getStore().load();
                            gm.me().store.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    addContractMatByCompany: function (val, win) {
        Ext.MessageBox.show({
            title: '추가',
            msg: '자재가격을 설정 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/material.do?method=addContractMat',
                        params: {
                            currency: val['currency'],
                            sales_price: val['sales_price'],
                            srcahd_uid: val['unique_id'],
                            supast_uid: val['supast_uid'],
                            start_date: val['start_date'],
                            end_date: val['end_date']
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gu.getCmp('gridContractMaterial').getStore().load();
                            gm.me().store.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                    // Ext.Ajax.request({
                    //     url: CONTEXT_PATH + '/purchase/material.do?method=addSalesPrice',
                    //     params:{
                    //         currency: val['currency'],
                    //         sales_price: val['sales_price'],
                    //         srcahd_uid: val['unique_id'],
                    //         combst_uid: val['combst_uid'],
                    //         comcst_uid: val['comcst_uid'],
                    //         start_date: val['start_date'],
                    //         end_date: val['end_date'],
                    //         c_name: val['c_name'],
                    //         buyer_item_code: val['buyer_item_code']
                    //     },
                    //     success : function(result, request) {
                    //         var resultText = result.responseText;
                    //         console_log('result:' + resultText);
                    //         gu.getCmp('gridContractMaterial').getStore().load();
                    //         if(win) {
                    //             win.close();
                    //         }
                    //     },
                    //     failure : extjsUtil.failureMessage
                    // });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    editRedord: function (field, rec) {

        switch (field) {
            case 'sort_order':
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=updateSortOrder',
                    params: {
                        srcmap_uid: rec.get('unique_id'),
                        srcahd_uid: rec.get('srcahd_uid'),
                        sort_order: rec.get('sort_order')
                    },
                    success: function (result, request) {
                        var resultText = result.responseText;
                        console_log('result:' + resultText);
                        gm.me().getStore().load(function () {
                        });
                        //alert('finished..');
                    },
                    failure: extjsUtil.failureMessage
                });//endof ajax request
                break;
            default:
                gm.editRedord(field, rec);
        }
    },

    searchStore: Ext.create('Rfx2.store.company.kbtech.MaterialStore', {})
});



