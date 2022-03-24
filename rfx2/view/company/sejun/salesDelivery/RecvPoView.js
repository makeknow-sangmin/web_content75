//수주관리 메뉴
Ext.define('Rfx2.view.company.sejun.salesDelivery.RecvPoView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-po-view',
    initComponent: function () {

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        var BuyerStore = Ext.create('Mplm.store.BuyerStore', {});

        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx2.model.company.bioprotech.RecvPo', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            gm.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['project']
        );

        this.setRowClass(function (record, index) {
            var c = record.get('status');
            switch (c) {
                case 'P0':
                    return 'yellow-row';
                    break;
                case 'DE':
                    return 'red-row';
                    break;
                case 'CR':
                    return 'green-row';
                    break;
                default:
            }
        });

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);

        this.PmUserStore.getProxy().setExtraParam('user_type', 'SLM');
        // 수주검토
        this.addPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '수주등록',
            tooltip: '수주등록',
            disable: true,
            handler: function () {
                // gm.me().payTermsStore.load();
                // gm.me().incotermsStore.load();

                var productGrid = Ext.create('Ext.grid.Panel', {
                    store: new Ext.data.Store(),
                    cls: 'rfx-panel',
                    id: gu.id('productGrid'),
                    collapsible: false,
                    multiSelect: false,
                    width: 1150,
                    autoScroll: true,
                    margin: '0 0 20 0',
                    autoHeight: true,
                    frame: false,
                    border: true,
                    layout: 'fit',
                    forceFit: true,
                    columns: [
                        {
                            text: gm.getMC('CMD_Product', '제품군'),
                            width: '15%',
                            dataIndex: 'class_name',
                            style: 'text-align:center',
                            sortable: false
                        },
                        {
                            text: '제품명',
                            width: '10%',
                            dataIndex: 'item_name',
                            style: 'text-align:center',
                            sortable: false
                        },
                        {
                            text: '기준모델',
                            width: '10%',
                            dataIndex: 'description',
                            style: 'text-align:center',
                            sortable: false
                        },
                        {
                            text: 'Site',
                            width: '10%',
                            dataIndex: 'reserved_varcharg',
                            style: 'text-align:center',
                            // editor: 'textfield',
                            sortable: false
                        },
                        {
                            text: '수량',
                            width: '10%',
                            dataIndex: 'bm_quan',
                            editor: 'numberfield',
                            style: 'text-align:center',
                            align: 'right',
                            css: 'edit-cell',
                            sortable: false
                        },
                        {
                            text: 'Unit',
                            width: '10%',
                            dataIndex: 'reserved_varchar9',
                            style: 'text-align:center',
                            // editor: 'textfield',
                            sortable: false
                        },
                        {
                            text: '단가',
                            width: '10%',
                            decimalPrecision: 5,
                            dataIndex: 'sales_price',
                            style: 'text-align:center',
                            align: 'right',
                            // editor: 'numberfield',
                            sortable: false
                        },
                        {
                            text: '통화',
                            width: '10%',
                            dataIndex: 'reserved_varchar8',
                            style: 'text-align:center',
                            // editor: 'textfield',
                            sortable: false
                        },


                        // {
                        //     text: 'PO date',
                        //     width: '10%',
                        //     dataIndex: 'regist_date',
                        //     style: 'text-align:center',
                        //     // editor: {
                        //     //     xtype: 'datefield',
                        //     //     format: 'Y-m-d'
                        //     // },
                        //     format: 'Y-m-d',
                        //     dateFormat: 'Y-m-d',
                        //     sortable: false,
                        //     renderer: Ext.util.Format.dateRenderer('Y-m-d')
                        // },
                        {
                            text: '납기일',
                            width: '10%',
                            dataIndex: 'delivery_plan',
                            style: 'text-align:center',
                            css: 'edit-cell',
                            editor: {
                                xtype: 'datefield',
                                format: 'Y-m-d'
                            },
                            format: 'Y-m-d',
                            dateFormat: 'Y-m-d',
                            sortable: false,
                            // renderer: function (value, meta) {
                            // meta.css = 'custom-column';
                            // if(value != null) {
                            // Ext.util.Format.dateRenderer('Y-m-d');
                            // }

                            // }
                            renderer: Ext.util.Format.dateRenderer('Y-m-d')
                        },
                        {
                            text: 'Commment',
                            width: '20%',
                            css: 'edit-cell',
                            dataIndex: 'item_comment',
                            style: 'text-align:center',
                            editor: 'textfield',
                            sortable: false
                        },
                        {
                            text: 'incoterms',
                            width: '20%',
                            dataIndex: 'item_incoterms',
                            style: 'text-align:center',
                            editor: {
                                xtype: 'combobox',
                                displayField: 'codeName',
                                editable: false,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().incotermsStore,
                                
                                triggerAction: 'all',
                                valueField: 'codeName'                            
                            },
                            
                            sortable: false
                        },
                        {
                            text: '결제방법',
                            width: '20%',
                            css: 'edit-cell',
                            dataIndex: 'item_pancond_kr',
                            style: 'text-align:center',
                            editor: {
                                xtype: 'combobox',
                                id : gu.id('item_paycond_combo'),
                                displayField: 'codeName',
                                editable: false,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().payTermsStore,
                                triggerAction: 'all',
                                valueField: 'codeName'
                            },
                            sortable: false
                        }
                    ],
                    selModel: 'cellmodel',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    listeners: {
                        edit: function (editor, e, eOpts) {
                            var store = gu.getCmp('productGrid').getStore();
                            var previous_store = store.data.items;
                            var total_quan = 0.0;
                            var total_price = 0.0;
                            console_logs('All Store Contents ??? ', previous_store);
                            for (var j = 0; j < previous_store.length; j++) {
                                var item = previous_store[j];
                                console_logs('bm_quan_EDIT', Number(item.get('bm_quan')));
                                console_logs('sales_price_EIDT', Number(item.get('sales_price')));
                                total_quan = Number(total_quan) + Number(item.get('bm_quan'));
                                total_price = Number(total_price) + (Number(item.get('sales_price')) * Number(item.get('bm_quan')));
                            }
                            gu.getCmp('po_total').setValue(total_quan);
                            gu.getCmp('po_price').setValue(total_price);
                        }
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
                                '->',
                                gm.me().getPrdAdd(),
                                {
                                    text: gm.getMC('CMD_DELETE', '삭제'),
                                    iconCls: 'af-remove',
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('productGrid').getSelectionModel().getSelected().items[0];
                                            gu.getCmp('productGrid').getStore().removeAt(gu.getCmp('productGrid').getStore().indexOf(record));
                                        }
                                    }]
                                },
                                {
                                    text: '▲',
                                    listeners: [{
                                        click: function () {
                                            var direction = -1;
                                            var record = gu.getCmp('productGrid').getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = gu.getCmp('productGrid').getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= gu.getCmp('productGrid').getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            gu.getCmp('productGrid').getStore().remove(record);
                                            gu.getCmp('productGrid').getStore().insert(index, record);
                                            gu.getCmp('productGrid').getSelectionModel().select(index, true);
                                        }
                                    }]
                                },
                                {
                                    text: '▼',
                                    listeners: [{
                                        click: function () {
                                            var direction = 1;
                                            var record = gu.getCmp('productGrid').getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = gu.getCmp('productGrid').getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= gu.getCmp('productGrid').getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            gu.getCmp('productGrid').getStore().remove(record);
                                            gu.getCmp('productGrid').getStore().insert(index, record);
                                            gu.getCmp('productGrid').getSelectionModel().select(index, true);
                                        }
                                    }]
                                }
                            ]
                        })
                    ]
                });

                var form = Ext.create('Ext.form.Panel', {
                    id: 'addPoForm',
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
                            title: '공통정보',
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
                                    // margin: '0 10 10 1',
                                    border: true,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [
                                        // {
                                        //     id: 'reserved_varchar1',
                                        //     name: 'reserved_varchar1',
                                        //     fieldLabel: '신규구분',
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     allowBlank: false,
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().poNewDivisionStore,
                                        //     emptyText: '선택해주세요.',
                                        //     displayField: 'codeName',
                                        //     valueField: 'systemCode',
                                        //     // sortInfo: { field: 'codeName', direction: 'ASC' },
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        //         }
                                        //     },
                                        //     listeners: {
                                        //         select: function (combo, record) {

                                        //         }// endofselect
                                        //     }
                                        // }, 
                                        // {
                                        //     id: 'reserved_varchar2',
                                        //     name: 'reserved_varchar2',
                                        //     fieldLabel: '영업상태',
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     allowBlank: false,
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().poSalesConditionStore,
                                        //     emptyText: '선택해주세요.',
                                        //     displayField: 'codeName',
                                        //     valueField: 'systemCode',
                                        //     // sortInfo: { field: 'codeName', direction: 'ASC' },
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        //         }
                                        //     },
                                        //     listeners: {
                                        //         select: function (combo, record) {

                                        //         }
                                        //     }
                                        // }, 
                                        // {
                                        //     id: 'reserved_varchar3',
                                        //     name: 'reserved_varchar3',
                                        //     fieldLabel: '영업구분',
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     allowBlank: false,
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().poSalesTypeStore,
                                        //     emptyText: '선택해주세요.',
                                        //     displayField: 'codeName',
                                        //     valueField: 'systemCode',
                                        //     // sortInfo: { field: 'codeName', direction: 'ASC' },
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        //         }
                                        //     },
                                        //     listeners: {
                                        //         select: function (combo, record) {

                                        //         }// endofselect
                                        //     }
                                        // }, 
                                        {
                                            id: gu.id('reserved_varcharb'),
                                            name: 'reserved_varcharb',
                                            fieldLabel: '거래구분',
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().sampleTypeStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            value : 'N',
                                            // sortInfo: { field: 'codeName', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },
                                        // {
                                        //     xtype: 'textfield',
                                        //     id: 'reserved_varchar4',
                                        //     name: 'reserved_varchar4',
                                        //     padding: '0 0 5px 30px',
                                        //     width: '45%',
                                        //     allowBlank: false,
                                        //     fieldLabel: '지역'
                                        // }, 
                                        // {
                                        //     xtype: 'textfield',
                                        //     id: 'reserved_varchar5',
                                        //     name: 'reserved_varchar5',
                                        //     padding: '0 0 5px 30px',
                                        //     width: '45%',
                                        //     allowBlank: false,
                                        //     fieldLabel: '국가'
                                        // }, 
                                        {
                                            id: gu.id('order_com_unique'),
                                            name: 'order_com_unique',
                                            fieldLabel: '고객명',
                                            allowBlank: false,
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().combstStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'wa_name',
                                            valueField: 'unique_id',
                                            sortInfo: { field: 'wa_name', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{unique_id}">{wa_name} [{nation_code}]</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    gu.getCmp('final_order_com_unique').setValue(gu.getCmp('order_com_unique').getValue());
                                                    // Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
                                                }// endofselect
                                            }
                                        },
                                        {
                                            id: gu.id('final_order_com_unique'),
                                            name: 'final_order_com_unique',
                                            fieldLabel: '최종고객명',
                                            allowBlank: true,
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().combstStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'wa_name',
                                            valueField: 'unique_id',
                                            sortInfo: { field: 'wa_name', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{unique_id}">{wa_name} [{nation_code}]</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    //Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
                                                }// endofselect
                                            }
                                        },
                                        // {
                                        //     id: 'pj_type',
                                        //     name: 'pj_type',
                                        //     fieldLabel: '구분',
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     allowBlank: false,
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().ProjectTypeStore,
                                        //     emptyText: '선택해주세요.',
                                        //     displayField: 'codeName',
                                        //     valueField: 'systemCode',
                                        //     // sortInfo: { field: 'codeName', direction: 'ASC' },
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        //         }
                                        //     },
                                        //     listeners: {
                                        //         select: function (combo, record) {

                                        //         }// endofselect
                                        //     }
                                        // },
                                        {
                                            xtype: 'textfield',
                                            id: 'reserved_varchard',
                                            name: 'reserved_varchard',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            fieldLabel: '고객 PO번호'
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'po_date',
                                            name: 'po_date',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            fieldLabel: 'Po Date',
                                            format: 'Y-m-d',
                                            value: new Date()
                                        },
                                    ]
                                },

                            ]
                        },
                        {
                            xtype: 'fieldset',
                            frame: true,
                            title: '제품목록',
                            width: '100%',
                            height: '100%',
                            layout: 'fit',
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items: [
                                productGrid,
                                {
                                    xtype: 'fieldset',
                                    frame: true,
                                    border: false,
                                    width: '100%',
                                    height: '50%',
                                    layout: 'column',
                                    align: 'center',
                                    defaults: {
                                        width: '60%',
                                        margin: '2 2 2 2'
                                    },
                                    items: [
                                        {
                                            fieldLabel: '총계 수량',
                                            xtype: 'numberfield',
                                            width: '30%',
                                            labelAlign: 'right',
                                            editable: false,
                                            fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: right',
                                            value: 0,
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            id: gu.id('po_total'),
                                        },
                                        {
                                            fieldLabel: '금액',
                                            xtype: 'numberfield',
                                            width: '30%',
                                            labelAlign: 'right',
                                            fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: right',
                                            editable: false,
                                            decimalPrecision: 5,
                                            value: 0,
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            id: gu.id('po_price'),
                                        },
                                        {
                                            fieldLabel: '통화',
                                            xtype: 'textfield',
                                            width: '20%',
                                            labelAlign: 'right',
                                            fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: left',
                                            editable: false,
                                            decimalPrecision: 5,
                                            value: '',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            id: gu.id('po_currency'),
                                        }
                                    ]

                                }
                            ]
                        },
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: '수주등록',
                    width: 1200,
                    height: 650,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('addPoForm').getForm();
                                if (form.isValid()) {

                                    win.setLoading(true);

                                    var val = form.getValues(false);

                                    var storeData = gu.getCmp('productGrid').getStore();
                                    var objs = [];

                                    for (var j = 0; j < storeData.data.items.length; j++) {
                                        var item = storeData.data.items[j];
                                        var objv = {};
                                        objv['srcahd_uid'] = item.get('srcahd_uid');
                                        objv['reserved_varcharg'] = item.get('reserved_varcharg');
                                        objv['sales_price'] = item.get('sales_price');
                                        objv['reserved_varchar8'] = item.get('reserved_varchar8');
                                        objv['reserved_varchar9'] = item.get('reserved_varchar9');
                                        // objv['regist_date'] = item.get('regist_date');
                                        objv['delivery_plan'] = item.get('delivery_plan');
                                        objv['bm_quan'] = item.get('bm_quan');
                                        objv['item_comment'] = item.get('item_comment');
                                        objv['item_incoterms'] = item.get('item_incoterms');
                                        objv['item_paycond'] = item.get('item_pancond_kr');
                                        objs.push(objv);
                                    }
                                    var jsonData = Ext.util.JSON.encode(objs);

                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=addRecvPoMulti',
                                        params: {
                                            productJson: jsonData
                                        },
                                        success: function (val, action) {
                                            win.setLoading(false);
                                            gm.me().store.load();
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                        }
                                    });

                                } else {
                                    // Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
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

        this.editPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수주수정',
            tooltip: '수주수정',
            // disabled: true,
            handler: function () {
                var select = gm.me().grid.getSelectionModel().getSelection()[0];

                var assymapUid = select.get('unique_uid');
                var projectUid = select.get('ac_uid');

                gm.me().ProjectTypeStore.load();
                gm.me().combstStore.load();
                gm.me().payTermsStore.load();
                gm.me().incotermsStore.load();

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
                            title: '공통정보',
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
                                        // {
                                        //     id: 'reserved_varchar1',
                                        //     name: 'reserved_varchar1',
                                        //     fieldLabel: '신규구분',
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     allowBlank: false,
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().poNewDivisionStore,
                                        //     emptyText: '선택해주세요.',
                                        //     displayField: 'codeName',
                                        //     valueField: 'systemCode',
                                        //     value: select.get('reserved_varchar1'),
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        //         }
                                        //     },
                                        //     listeners: {
                                        //         select: function (combo, record) {

                                        //         }// endofselect
                                        //     }
                                        // }, 
                                        // {
                                        //     id: 'reserved_varchar2',
                                        //     name: 'reserved_varchar2',
                                        //     fieldLabel: '영업상태',
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     allowBlank: false,
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().poSalesConditionStore,
                                        //     emptyText: '선택해주세요.',
                                        //     displayField: 'codeName',
                                        //     valueField: 'systemCode',
                                        //     value: select.get('reserved_varchar2'),
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        //         }
                                        //     },
                                        //     listeners: {
                                        //         select: function (combo, record) {

                                        //         }
                                        //     }
                                        // }, 
                                        // {
                                        //     id: 'reserved_varchar3',
                                        //     name: 'reserved_varchar3',
                                        //     fieldLabel: '영업구분',
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     allowBlank: false,
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().poSalesTypeStore,
                                        //     emptyText: '선택해주세요.',
                                        //     displayField: 'codeName',
                                        //     valueField: 'systemCode',
                                        //     value: select.get('reserved_varchar3'),
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        //         }
                                        //     },
                                        //     listeners: {
                                        //         select: function (combo, record) {

                                        //         }// endofselect
                                        //     }
                                        // }, 
                                        // {
                                        //     xtype: 'textfield',
                                        //     id: 'reserved_varchar4',
                                        //     name: 'reserved_varchar4',
                                        //     padding: '0 0 5px 30px',
                                        //     width: '45%',
                                        //     allowBlank: false,
                                        //     value: select.get('reserved_varchar4'),
                                        //     fieldLabel: '지역'
                                        // }, 
                                        // {
                                        //     xtype: 'textfield',
                                        //     id: 'reserved_varchar5',
                                        //     name: 'reserved_varchar5',
                                        //     padding: '0 0 5px 30px',
                                        //     width: '45%',
                                        //     allowBlank: false,
                                        //     value: select.get('reserved_varchar5'),
                                        //     fieldLabel: '국가'
                                        // }, 
                                        {
                                            id: gu.id('order_com_unique'),
                                            name: 'order_com_unique',
                                            fieldLabel: '고객명',
                                            allowBlank: false,
                                            editable : false,
                                            readOnly : true,
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            fieldStyle: 'background-color: #ddd; background-image: none;',
                                            store: gm.me().combstStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'wa_name',
                                            valueField: 'unique_id',
                                            value: select.get('order_com_unique'),
                                            sortInfo: { field: 'wa_name', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{unique_id}">{wa_name} [{nation_code}]</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    console_logs('들어갈 값 >>>>>>', gu.getCmp('order_com_unique').getValue());
                                                    gu.getCmp('final_buyer').setValue(gu.getCmp('order_com_unique').getValue());
                                                }// endofselect
                                            }
                                        },
                                        {
                                            id: gu.id('final_buyer'),
                                            name: 'reserved_number3',
                                            fieldLabel: '최종 고객사',
                                            allowBlank: false,
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().combstStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'wa_name',
                                            valueField: 'unique_id',
                                            value: select.get('reserved_number3'),
                                            sortInfo: { field: 'wa_name', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{unique_id}">[{nation_code}] {wa_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    //Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
                                                }// endofselect
                                            }
                                        },
                                        {
                                            id: 'deal_type',
                                            name: 'reserved_varcharb',
                                            fieldLabel: '거래구분',
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().sampleTypeStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            value: select.get('reserved_varcharb'),
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },
                                        // {
                                        //     id: 'pj_type',
                                        //     name: 'pj_type',
                                        //     fieldLabel: '구분',
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     allowBlank: false,
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().ProjectTypeStore,
                                        //     emptyText: '선택해주세요.',
                                        //     displayField: 'codeName',
                                        //     valueField: 'systemCode',
                                        //     value: select.get('pj_type'),
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        //         }
                                        //     },
                                        //     listeners: {
                                        //         select: function (combo, record) {

                                        //         }// endofselect
                                        //     }
                                        // },
                                        {
                                            id: 'incoterms',
                                            name: 'reserved_varcharc',
                                            fieldLabel: 'incoterms',
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: true,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().incotermsStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            value: select.get('reserved_varcharc'),
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        },
                                        {
                                            xtype: 'combo',
                                            id: 'pay_cond',
                                            name: 'reserved_varchara',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            store: gm.me().payTermsStore,
                                            allowBlank: true,
                                            editable: true,
                                            value: select.get('reserved_varchara'),
                                            fieldLabel: '결제구분',
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }

                                        }


                                    ]
                                },

                            ]
                        },
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: '제품정보',
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
                                            xtype: 'textfield',
                                            id: 'item_name',
                                            name: 'item_name',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            editable: false,
                                            value: select.get('item_name'),
                                            fieldLabel: '품명',
                                            fieldStyle: 'background-color: #ddd; background-image: none;'
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'reserved_varcharg',
                                            name: 'reserved_varcharg',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            editable: false,
                                            value: select.get('reserved_varcharg'),
                                            fieldLabel: 'Site',
                                            fieldStyle: 'background-color: #ddd; background-image: none;'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'sales_price',
                                            name: 'sales_price',
                                            decimalPrecision: 5,
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            editable: false,
                                            value: select.get('sales_price'),
                                            fieldLabel: '단가',
                                            fieldStyle: 'background-color: #ddd; background-image: none;'
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'reserved_varchar8',
                                            name: 'reserved_varchar8',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            editable: false,
                                            value: select.get('reserved_varchar8'),
                                            fieldLabel: '통화',
                                            fieldStyle: 'background-color: #ddd; background-image: none;'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'bm_quan',
                                            name: 'bm_quan',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            value: select.get('bm_quan'),
                                            fieldLabel: '수량'
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'regist_date',
                                            name: 'regist_date',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            format: 'Y-m-d',
                                            dateFormat: 'Y-m-d',
                                            submitformat: 'Y-m-d',
                                            value: select.get('regist_date_str'),
                                            fieldLabel: 'PO Date'
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'delivery_plan',
                                            name: 'delivery_plan',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            format: 'Y-m-d',
                                            dateFormat: 'Y-m-d',
                                            submitformat: 'Y-m-d',
                                            value: select.get('delivery_plan_str'),
                                            fieldLabel: '납기일'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: '수주수정',
                    width: 800,
                    height: 450,
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
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=modifyRecvPoSingle',
                                        params: {
                                            assymapUid: assymapUid,
                                            projectUid: projectUid
                                        },
                                        success: function (val, action) {
                                            gm.me().store.load();
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

        // 수주검토
        this.reviewAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '수주검토',
            tooltip: '수주검토',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '수주 검토를 완료하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            gMain.selPanel.reviewAction.disable();
                            gMain.selPanel.doRequest('P0');
                        }
                    },
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 반려
        this.reviewCancleAction = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            text: '검토취소',
            tooltip: '검토취소',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '수주를 검토 취소하시겠습니까?<br>확인 후 반려상태로 수주가 진행됩니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            gMain.selPanel.reviewCancleAction.disable();
                            gMain.selPanel.doRequest('DE');
                        }
                    },
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 수주확정
        this.completeAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_ORDER_CONFIRM','수주확정'),
            tooltip: '수주확정 및 설계요청',
            disabled: true,
            handler: function () {
                //  gMain.selPanel.doRequestProduce();
                Ext.MessageBox.show({
                    title: gm.getMC('CMD_ORDER_CONFIRM','수주확정'),
                    msg: '해당 수주를 확정하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().confirmPjAndGoPrd,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            itemId: 'fileattachAction',
            disabled: true,
            text: '파일첨부/다운로드',
            handler: function (widget, event) {
                gm.me().attachFile();
            }
        });

        // 버튼 추가.
        buttonToolbar.insert(4, this.addPoAction);
        buttonToolbar.insert(5, this.editPoAction);
        buttonToolbar.insert(6, this.fileattachAction);
        buttonToolbar.insert(7, this.completeAction);
        buttonToolbar.insert(8, '-');
        //buttonToolbar.insert(15, '->');
        //buttonToolbar.insert(16, this.fileattachAction);


        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (this.crudMode == 'EDIT') { // EDIT

            } else {// CREATE,COPY
                this.copyCallback();
            }

            gUtil.disable(gMain.selPanel.removeAction);
            gUtil.disable(gMain.selPanel.modifyAction);

            if (selections.length) {
                console_logs('>>>> selections', selections);
                var rec = selections[0];
                var status = rec.get('status');

                gm.me().vSELECTED_ASSYMAP_UID = rec.get('unique_uid');
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');

                this.prdStore.getProxy().setExtraParam('assytop_uid', rec.get('unique_uid'));
                this.prdStore.getProxy().setExtraParam('child_cnt', true);
                this.prdStore.load();

                switch (status) {
                    case 'BM':
                        gUtil.enable(gMain.selPanel.completeAction);
                        gUtil.enable(gMain.selPanel.editPoAction);
                        gUtil.enable(gMain.selPanel.removeAction);
                        gUtil.disable(gMain.selPanel.modifyAction);
                        gUtil.enable(gMain.selPanel.fileattachAction);
                        // case 'DE':
                        //     gUtil.enable(gMain.selPanel.reviewAction);
                        //     break;
                        // case 'P0':
                        // gUtil.enable(gMain.selPanel.completeAction);
                        // gUtil.enable(gMain.selPanel.reviewCancleAction);
                        break;
                }
            } else {
                // gUtil.disable(gMain.selPanel.reviewAction);
                gUtil.disable(gMain.selPanel.completeAction);
                gUtil.disable(gMain.selPanel.editPoAction);
                gUtil.disable(gMain.selPanel.fileattachAction);
                // gUtil.disable(gMain.selPanel.reviewCancleAction);
            }
        });

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3) {
                buttonToolbar.items.remove(item);
            }
        });

        this.callParent(arguments);


        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.

        this.store.getProxy().setExtraParam('having_not_status', 'CR,I,N,P,R,S,W,Y,DC,BR');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('multi_prd', true);

        this.store.load(function (records) {
        });


    },

    getPrdAdd: function () {
      

        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'addItemAction',
            disabled: false,
            text: '제품추가',
            handler: function (widget, event) {
                

                if (gu.getCmp('reserved_varcharb').getValue() == null) {
                    Ext.MessageBox.alert('알림', '거래구분이 입력되지 않았습니다.');
                    return;
                }
                /*
                * Store는 거래구분과 고객명이 입력될 떄 미리 돌아야 하며.
                * 무상샘플은 전체 제품 리스트를 나열해야 한다.
                * 정상거래와 유상샘플은 지정된 고객에 등록된 제품만 나열해야 한다.
                * */
                if (gu.getCmp('reserved_varcharb').getValue() === 'N' || gu.getCmp('reserved_varcharb').getValue() === 'P') {
                    if (gu.getCmp('order_com_unique').getValue() == null) {
                        Ext.MessageBox.alert('알림', '거래구분이 정상거래, 유상샘플이 선택 되었을 경우 고객명이 반드시 입력되어야 합니다');
                        return;
                    } else {
                        gm.me().searchDetailStoreOnlySrcMap.getProxy().setExtraParam('srcmap_comastUid', gu.getCmp('order_com_unique').getValue());
                        gm.me().searchDetailStoreOnlySrcMap.pageSize = 100;
                        gm.me().searchDetailStoreOnlySrcMap.load();
                    }
                } else if (gu.getCmp('reserved_varcharb').getValue() === 'F') { // 무상샘플일 경우
                    gm.me().searchDetailStoreOnlySrcMap.getProxy().setExtraParam('srcmap_comastUid', -1);
                    gm.me().searchDetailStoreOnlySrcMap.pageSize = 100;
                    gm.me().searchDetailStoreOnlySrcMap.load();
                }

                var partGridWidth = '20%';
                var searchItemGrid = Ext.create('Ext.grid.Panel', {
                    store: gm.me().searchDetailStoreOnlySrcMap,
                    layout: 'fit',
                    title: '제품검색',
                    plugins: [gm.me().cellEditing],
                    columns: [
                        { text: "사업부", flex: 0.5, style: 'text-align:center', dataIndex: 'supplier_code', sortable: true },
                        { text: "모델명", flex: 1.5, style: 'text-align:center', dataIndex: 'item_name', sortable: true },
                        { text: "기준모델", flex: 1.0, style: 'text-align:center', dataIndex: 'description', sortable: true },
                        { text: "규격", flex: 1.8, style: 'text-align:center', dataIndex: 'specification', sortable: true },
                        { text: "판매단가", flex: 1, align: 'right', style: 'text-align:center', dataIndex: 'sales_price', sortable: true },
                        { text: "통화", flex: 0.5, style: 'text-align:center', dataIndex: 'currency', sortable: true },
                        {
                            text: "수량",
                            flex: 0.5,
                            dataIndex: 'bm_quan',
                            sortable: false,
                            align: 'right',
                            style: 'text-align:center',
                            renderer: function (value, meta) {
                                if (value == null || value.length < 1) {
                                    value = 0;
                                }
                                return value;
                            }
                        }
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 700,
                    height: 526,
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: gm.me().searchDetailStoreOnlySrcMap,
                        displayInfo: true,
                        displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                        emptyMsg: "표시할 항목이 없습니다."
                        , listeners: {
                            beforechange: function (page, currentPage) {

                            }
                        }

                    }),
                    viewConfig: {
                        listeners: {
                            'itemdblClick': function (view, record) {
                                record.commit();
                                console_logs('>>> ddd', record);
                                saveStore.add(record);
                            }
                        },
                        emptyText: '<div style="text-align:center; padding-top:20% ">No Data..</div>'
                        // emptyText: 'No data...'
                    },
                    dockedItems: [
                        {
                            dock: 'top',
                            xtype: 'toolbar',
                            cls: 'my-x-toolbar-default1',
                            items: [
                                {
                                    width: partGridWidth,
                                    field_id: 'search_item_code',
                                    id: gu.id('search_item_code'),
                                    name: 'search_item_code',
                                    xtype: 'triggerfield',
                                    emptyText: '품목코드',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            //if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().redrawSearchStore();
                                            //srchSingleHandler (store, srchId, fieldObj, isWild);
                                            //}
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
                                    width: partGridWidth,
                                    field_id: 'search_item_name',
                                    id: gu.id('search_item_name'),
                                    name: 'search_item_name',
                                    xtype: 'triggerfield',
                                    emptyText: '품명',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            //if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().redrawSearchStore();
                                            //srchSingleHandler (store, srchId, fieldObj, isWild);
                                            //}
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
                                    width: partGridWidth,
                                    field_id: 'search_specification',
                                    id: gu.id('search_specification'),
                                    name: 'search_specification',
                                    xtype: 'triggerfield',
                                    emptyText: '규격',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                        gm.me().redrawSearchStore();
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            //if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().redrawSearchStore();
                                            //srchSingleHandler (store, srchId, fieldObj, isWild);
                                            //}
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                // {
                                //     width: partGridWidth,
                                //     field_id: 'search_model_no',
                                //     id: gu.id('search_model_no'),
                                //     name: 'search_model_no',
                                //     xtype: 'triggerfield',
                                //     emptyText: '재질',
                                //     trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                //     onTrigger1Click: function () {
                                //         this.setValue('');
                                //         gm.me().redrawSearchStore();
                                //     },
                                //     listeners: {
                                //         change: function (fieldObj, e) {
                                //             //if (e.getKey() == Ext.EventObject.ENTER) {
                                //             gm.me().redrawSearchStore();
                                //             //srchSingleHandler (store, srchId, fieldObj, isWild);
                                //             //}
                                //         },
                                //         render: function (c) {
                                //             Ext.create('Ext.tip.ToolTip', {
                                //                 target: c.getEl(),
                                //                 html: c.emptyText
                                //             });
                                //         }
                                //     }
                                // }
                            ]
                        }] // endofdockeditems
                }); // endof Ext.create('Ext.grid.Panel',

                searchItemGrid.getSelectionModel().on({
                    selectionchange: function (sm, selections) {
                    }
                });

                searchItemGrid.on('edit', function (editor, e) {
                    var rec = e.record;
                    var field = e['field'];

                    rec.set(field, rec.get(field));

                });

                var saveStore = null;

                var saveStore = new Ext.data.Store({
                    model: gm.me().searchDetailStoreOnlySrcMap
                });

                var saveForm = Ext.create('Ext.grid.Panel', {
                    store: saveStore,
                    id: gu.id('saveFormGrid'),
                    layout: 'fit',
                    title: '저장목록',
                    region: 'east',
                    style: 'padding-left:10px;',
                    plugins: [gm.me().cellEditing_save],
                    columns: [
                        { text: "모델명", flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true },
                        { text: "기준모델", flex: 1, dataIndex: 'description', style: 'text-align:center', sortable: true },
                        { text: "규격", flex: 2, dataIndex: 'specification', style: 'text-align:center', sortable: true },
                        {
                            text: "수량",
                            flex: 1,
                            dataIndex: 'bm_quan',
                            editor: {},
                            align: 'right',
                            style: 'text-align:center',
                            sortable: true,

                            renderer: function (value, meta) {
                                if (value == null) {
                                    value = 0;
                                }
                                return value;
                            }
                        }
                    ],
                    renderTo: Ext.getBody(),
                    autoScroll: true,
                    dockedItems: [
                        Ext.create('widget.toolbar', {
                            plugins: {
                                boxreorderer: false
                            },
                            cls: 'my-x-toolbar-default2',
                            margin: '0 0 0 0',
                            items: [
                                '->',
                                {
                                    text: '저장목록 삭제',
                                    iconCls: 'af-remove',
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('saveFormGrid').getSelectionModel().getSelected().items[0];
                                            if (record == null) {
                                                Ext.MessageBox.alert('알림', '삭제할 항목을 선택하십시오.')
                                                return;
                                            } else {
                                                gu.getCmp('saveFormGrid').getStore().removeAt(gu.getCmp('saveFormGrid').getStore().indexOf(record));
                                            }
                                        }
                                    }]
                                },
                            ]
                        })
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 400,
                    height: 600
                }); // endof Ext.create('Ext.grid.Panel',

                saveForm.on('edit', function (editor, e) {
                    var rec = e.record;
                    var field = e['field'];
                    rec.set(field, rec.get(field));
                });

                var winProduct = Ext.create('ModalWindow', {
                    title: '제품추가',
                    width: 1100,
                    height: 600,
                    minWidth: 600,
                    minHeight: 300,
                    items: [
                        searchItemGrid, saveForm
                    ],
                    buttons: [{
                        text: '추가',
                        handler: function (btn) {
                            var selects = searchItemGrid.getSelectionModel().getSelection();
                            for (var i = 0; i < selects.length; i++) {
                                var record = selects[i];
                                saveStore.add(record);
                            }
                        }
                    }, {
                        text: CMD_OK,
                        handler: function (btn) {
                            gm.me().incotermsStore.load();
                            gm.me().payTermsStore.load();

                            winProduct.setLoading(true);
                            var sales_price_total_disp = 0;
                            var bm_quan_total_disp = 0.0;
                            if (btn == "no") {
                                winProduct.setLoading(false);
                                winProduct.close();
                            } else {
                                var items = saveStore.data.items;
                                console_logs('items >>>>> ', items);
                                var store = gu.getCmp('productGrid').getStore();
                                console_logs('store.length ????', store.getCount());
                                var store_cnt = store.getCount();
                                var currency_abst = items[0].get('currency');
                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];
                                    var id = item.get('srcahd_uid'); // srcahd uid
                                    var sg_code = item.get('sg_code');
                                    var class_name = item.get('middel_type_full');
                                    var item_code = item.get('item_code');
                                    var item_name = item.get('item_name');
                                    var ao_name = item.get('ao_name');
                                    var ao_name_kr = item.get('payment_condition');

                                    var po_comment = item.get('po_comment');
                                    
                                    var site = item.get('supplier_code');
                                    var description = item.get('description');
                                    var quan = item.get('bm_quan');
                                    if (quan == null || quan == undefined || quan.length < 1) {
                                        quan = 1;
                                    }
                                    bm_quan_total_disp = Number(bm_quan_total_disp) + Number(quan);
                                    var unit = item.get('unit_code');
                                    var currency = item.get('currency');
                                    var po_date = new Date();
                                    var present_date = new Date();
                                    var delivery_plan = present_date.setMonth(present_date.getMonth() + 2);
                                    var delivery_plan_parse = new Date(delivery_plan);
                                    var sales_price = item.get('sales_price');


                                    if (gu.getCmp('reserved_varcharb').getValue() === 'F') {
                                        Ext.MessageBox.alert('단가조정', '무상샘플인 경우 단가가 자동으로 0으로 지정됩니다.');
                                        sales_price = 0.0;
                                    }

                                    sales_price_total_disp = Number(sales_price_total_disp) + (Number(sales_price) * Number(quan));
                                    console_logs('>>>>>>>>>', bm_quan_total_disp);
                                    console_logs('>>>>>>>>> sales_price_total_disp', sales_price_total_disp);

                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'srcahd_uid': id,
                                        'sg_code': sg_code,
                                        'class_name': class_name,
                                        'reserved_varcharg': site,
                                        'sales_price': sales_price,
                                        'item_code': item_code,
                                        'item_name' : item_name,
                                        'regist_date': po_date,
                                        'reserved_varchar8': currency,
                                        'reserved_varchar9': unit,
                                        'delivery_plan': delivery_plan_parse,
                                        'description': description,
                                        'bm_quan': quan,
                                        'item_incoterms' : po_comment,
                                        'item_paycond' : ao_name,
                                        'item_pancond_kr' : ao_name_kr
                                    }));
                                    // gu.getCmp('item_paycond_combo').setValue(ao_name);
                                }
                                // 사전에 제품이 추가가 되지 않았을 떄
                                if (store_cnt === 0) {
                                    gu.getCmp('po_total').setValue(bm_quan_total_disp);
                                    gu.getCmp('po_price').setValue(sales_price_total_disp);
                                    gu.getCmp('po_currency').setValue(currency_abst);

                                } else {
                                    var previous_store = store.data.items;
                                    var total_quan = 0.0;
                                    var total_price = 0.0;
                                    for (var j = 0; j < previous_store.length; j++) {
                                        var item = previous_store[j];
                                        console_logs('bm_quan_????', Number(item.get('bm_quan')));
                                        console_logs('sales_price_????', Number(item.get('sales_price')));
                                        total_quan = Number(total_quan) + Number(item.get('bm_quan'));
                                        total_price = Number(total_price) + (Number(item.get('sales_price')) * Number(item.get('bm_quan')));
                                    }
                                    console_logs('??????????', total_quan);
                                    console_logs('>|>|>|>|>|>', total_price);
                                    gu.getCmp('po_total').setValue(total_quan);
                                    gu.getCmp('po_price').setValue(total_price);
                                    gu.getCmp('po_currency').setValue(currency_abst);
                                }


                                // gm.me().searchDetailStore.removeAll();
                                // gm.me().searchDetailStoreSrcMap.removeAll();
                                winProduct.setLoading(false);
                                winProduct.close();
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            winProduct.close();
                        }
                    }]
                });
                winProduct.show();
            }
        });

        return action;
    },

    getAttachAdd: function () {
        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'addAttachAction',
            disabled: false,
            text: '첨부',
            handler: function (widget, event) {

            }
        });

        return action;
    },

    getRequestMake: function () {
        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'requestMakeAction',
            disabled: false,
            text: '제작요청',
            handler: function (widget, event) {

            }
        });

        return action;
    },

    removePrdAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: '삭제',
        disabled: true,
        handler: function () {
            Ext.MessageBox.show({
                title: '삭제',
                msg: '선택하신 항목들을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: function (btn) {
                    if (btn == 'yes') {
                        var selects = gm.me().prdGrid.getSelectionModel().getSelection();
                        console_logs('>>>>>>>>>>removeFn selects : ', selects);
                        var uids = [];
                        var ac_uid = gm.me().prdGrid.getSelectionModel().getSelection()[0].get('ac_uid');
                        for (var i = 0; i < selects.length; i++) {
                            var select = selects[i];
                            var id = select.get('unique_uid');
                            console_logs('>>>>>>>>>>removeFn id : ', id);
                            uids.push(id);
                        }
                        ;
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/production/schdule.do?method=removePrds',
                            params: {
                                unique_ids: uids,
                                pj_uid: ac_uid
                            },
                            success: function () {
                                gm.me().showToast('결과', uids.length + ' 건 삭제완료.');
                                gm.me().store.load();
                                gm.me().prdStore.load();
                            },
                            failure: function () {
                                gm.me().showToast('결과', '삭제실패');
                            }
                        });
                    }
                },
                //animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    createCenter: function () {
        // console_logs('>>> gm.me().prdStore', gm.me().prdStore);
        console_logs('>>> gm.me().prdStore 22', this.prdStore);
        var requestMakeAction = this.getRequestMake();
        var addAttachAction = this.getAttachAdd();

        this.prdGrid = Ext.create('Ext.grid.Panel', {
            collapsible: false,
            cls: 'rfx-panel',
            width: '100%',
            autoScroll: true,
            autoHeight: true,
            border: true,
            layout: 'fit',
            forceFit: true,
            store: this.prdStore,
            // bbar: getPageToolbar(this.prdStore),
            selModel: Ext.create("Ext.selection.CheckboxModel", { mode: 'multi' }),
            multiSelect: true,
            plugins: [this.cellEditing_prd],
            viewConfig: {
                getRowClass: function (record, index) {
                    var child_cnt = record.get('child_cnt');
                    if (child_cnt < 1) {
                        return 'red-row';
                    }
                }
            },
            dockedItems: [{

                dock: 'top',
                xtype: 'toolbar',
                items: [
                    this.removePrdAction, '->', addAttachAction
                    // this.printFinalPDFAction
                ],

            }],
            columns: [
                {
                    text: '진행상태',
                    dataIndex: 'status',
                    width: 70,
                    align: 'left',
                    sortable: true,
                    renderer: function (value) {
                        switch (value) {
                            case 'BM':
                                return '수주등록';
                            case 'R':
                                return '생산대기';
                            case 'I':
                                return '작업정지';
                            case 'W':
                                return '생산중';
                            case 'Y':
                                return '생산완료';
                            case 'DE':
                                return '반려';
                            case 'CR':
                                return '수주확정(설계)';
                            default:
                                return value;
                        }
                    }
                }, {
                    text: '품번',
                    dataIndex: 'item_code',
                    width: 100,
                    sortable: true,
                    align: 'left',
                    // style:'text-align:left'
                }, {
                    text: '품명',
                    dataIndex: 'item_name',
                    width: 100,
                    sortable: true,
                    align: 'left',
                    // style:'text-align:left'
                }, {
                    text: '규격',
                    dataIndex: 'specification',
                    width: 120,
                    sortable: true,
                    align: 'left',
                    // style:'text-align:left'
                }, {
                    text: '납품단가',
                    dataIndex: 'sales_price',
                    width: 40,
                    sortable: true,
                    align: 'right',
                    editor: {},
                    renderer: function (value, meta) {
                        meta.css = 'custom-column';
                        if (value != null && value.length > 0) {
                            value = Ext.util.Format.number(value, '0,00/i');
                        } else {
                            value = 0;
                        }
                        return value;
                    }
                    // style:'text-align:left'
                }, {
                    text: '수주수량',
                    dataIndex: 'quan',
                    width: 40,
                    sortable: true,
                    align: 'right',
                    editor: {},
                    renderer: function (value, meta) {
                        meta.css = 'custom-column';
                        if (value != null && value.length > 0) {
                            value = Ext.util.Format.number(value, '0,00/i');
                        } else {
                            value = 0;
                        }
                        return value;
                    }
                    // style:'text-align:left'
                }, {
                    text: '가용재고',
                    dataIndex: 'stock_qty_useful',
                    width: 40,
                    sortable: true,
                    align: 'right',
                    renderer: function (value, meta) {
                        if (value != null && value.length > 0) {
                            value = Ext.util.Format.number(value, '0,00/i');
                        } else {
                            value = 0;
                        }
                        return value;
                    }
                    // style:'text-align:left'
                }, {
                    text: '생산요청량',
                    dataIndex: 'bm_quan',
                    width: 50,
                    sortable: true,
                    align: 'right',
                    editor: {},
                    css: 'edit-cell',

                    // style:'text-align:left'
                }, {
                    text: '특이사항',
                    dataIndex: 'reserved6',
                    // dataIndex: 'comment',
                    width: 120,
                    sortable: true,
                    align: 'center',
                    editor: {},
                    css: 'edit-cell',
                    renderer: function (value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    // style:'text-align:left'
                }
            ]
        });

        this.prdGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    gUtil.enable(gMain.selPanel.removePrdAction);
                } else {
                    gUtil.disable(gMain.selPanel.removePrdAction);
                }
            }
        });

        this.prdGrid.on('edit', function (editor, e) {
            var rec = e.record;

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/production/schdule.do?method=updateAssyMapMakeInfo',
                params: {
                    quan: rec.get('quan'),
                    reserved1: rec.get('reserved1'),
                    reserved2: rec.get('reserved2'),
                    reserved3: rec.get('reserved3'),
                    reserved4: rec.get('reserved4'),
                    reserved5: rec.get('reserved5'),
                    reserved6: rec.get('reserved6'),
                    unique_id: rec.get('unique_uid'),
                    sales_price: rec.get('sales_price'),
                    pj_uid: rec.get('ac_uid')
                },
                success: function (result, request) {
                    var result = result.responseText;
                    gm.me().prdStore.load();
                    gm.me().store.load();
                },
                failure: extjsUtil.failureMessage
            });
        })

        return this.prdGrid;
    },

    //assymap STATUS 변경
    doRequest: function (status) {

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/production/schdule.do?method=updateAssyMapStatus',
            params: {
                assymap_uid: gm.me().vSELECTED_ASSYMAP_UID,
                status: status
            },

            success: function (result, request) {
                gMain.selPanel.store.load();
                //Ext.Msg.alert('안내', '요청하였습니다.', function() {});
            },//endofsuccess

            failure: extjsUtil.failureMessage
        });//endofajax

    },

    // 수주확정 LOT_NO/CARTMAP 생성
    // 바이오프로테크의 경우에는 Lot No를 여기서 생성하지 않는걸로 처리를 한다.
    doRequestProduce: function () {
        var form = null;
        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        labelWidth: 50,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: { top: 0, right: 5, bottom: 0, left: 0 }
                        }
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Lot 명',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                // {
                                //     xtype: 'textfield',
                                //     id: 'lot_no',
                                //     name: 'po_no',
                                //     fieldLabel: 'LOT 명',
                                //     margin: '0 5 0 0',
                                //     width: 300,
                                //     allowBlank: false,
                                //     maxlength: '1',
                                //     listeners: {
                                //         change: function (sender, newValue, oldValue, opts) {
                                //             gm.me().checkButtonClicked = false;
                                //         }
                                //     }
                                // },
                                //                                 {
                                //                                     id: 'AutoLotCreateButton',
                                //                                     xtype: 'button',
                                //                                     style: 'margin-left: 3px;',
                                //                                     text: '자동생성',
                                //                                     handler: function () {

                                //                                         var lot_no = Ext.getCmp('lot_no');

                                //                                         //자동생성 쿼리
                                //                                         //프로젝트 코드 자동생성 비슷하게 만들면됨. 테이블은 project Lot_no 컬럼 reserved_varchar6
                                //                                         var target = gMain.selPanel.getInputTarget('pj_code');
                                //                                         var date = new Date();
                                //                                         var fullYear = gUtil.getFullYear() + '';
                                //                                         var month = gUtil.getMonth() + '';
                                //                                         var day = date.getDate() + '';
                                //                                         if (month.length == 1) {
                                //                                             month = '0' + month;
                                //                                         }

                                //                                         var pj_code = fullYear.substring(2, 4) + month + '-';

                                //                                         // 마지막 수주번호 가져오기
                                //                                         Ext.Ajax.request({
                                //                                             url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastlotnoMes',
                                //                                             params: {
                                //                                                 pj_first: pj_code,
                                //                                                 codeLength: 3
                                //                                             },
                                //                                             success: function (result, request) {
                                // //	                       						console_logs('마지막 수주번호 가져오기', 'success');
                                //                                                 var result = result.responseText;
                                // //	                       						result = result.substring(0,6)+'-'+result.substring(6,9);
                                //                                                 lot_no.setValue(result);
                                //                                                 gm.me().checkButtonClicked = false;
                                //                                             },// endofsuccess
                                //                                             failure: extjsUtil.failureMessage
                                //                                         });// endofajax
                                //                                     }//endofhandler
                                //                                 },
                                // {
                                //     id: 'isDuplicatedButton',
                                //     xtype: 'button',
                                //     style: 'margin-left: 3px;',
                                //     text: '중복확인',
                                //     handler: function () {
                                //         var lot_no = Ext.getCmp('lot_no').getValue();

                                //         if (lot_no.length === 1) {
                                //             Ext.Msg.alert('', 'LOT 번호를 입력하시기 바랍니다.');
                                //         } else {
                                //             var projectStore = Ext.create('Rfx2.store.company.kbtech.ProjectStore', {});
                                //             projectStore.getProxy().setExtraParam('reserved_varchar6', lot_no);

                                //             projectStore.load(function (record) {

                                //                 gm.me().checkButtonClicked = true;

                                //                 if (record.length > 0) {
                                //                     Ext.Msg.alert('', 'LOT 번호가 중복 되었습니다.');
                                //                     gm.me().isDuplicated = true;
                                //                 } else {
                                //                     Ext.Msg.alert('', '이용 가능한 LOT 번호입니다.');
                                //                     gm.me().isDuplicated = false;
                                //                 }
                                //             });
                                //         }

                                //     }//endofhandler
                                // }
                            ]
                        },


                    ]
                }
            ]

        });//Panel end...
        myHeight = 120;
        myWidth = 390;


        prwin = gMain.selPanel.prwinrequest(form);


    },

    prwinrequest: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: 'LOT 명',
            width: myWidth,
            //height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (!gm.me().checkButtonClicked) {
                        Ext.Msg.alert('', '먼저 LOT 번호 중복 검사를 하시기 바랍니다.');
                    } else {
                        if (gm.me().isDuplicated) {
                            Ext.Msg.alert('', 'LOT 번호가 중복 되었습니다.');
                        } else {
                            Ext.MessageBox.show({
                                title: gm.getMC('CMD_ORDER_CONFIRM','수주확정'),
                                msg: 'LOT번호 : ' + Ext.getCmp('lot_no').getValue() + '의 <br> ' +
                                    '수주를 확정하겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (result) {
                                    if (result == 'yes') {
                                        var form = gu.getCmp('formPanel').getForm();
                                        var assymap_uid = gMain.selPanel.vSELECTED_ASSYMAP_UID;
                                        var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                                        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                                        prWin.setLoading(true);

                                        form.submit({
                                            url: CONTEXT_PATH + '/index/process.do?method=addCartCopyPart',
                                            params: {
                                                ac_uid: ac_uid,
                                                assymap_uid: assymap_uid,
                                                lot_no: Ext.getCmp('lot_no').getValue()
                                            },
                                            success: function (val, action) {
                                                prWin.setLoading(false);
                                                prWin.close();
                                                gMain.selPanel.store.load(function () {
                                                });
                                            },
                                            failure: function (val, action) {
                                                prWin.setLoading(false);
                                                prWin.close();
                                            }
                                        });
                                    } else {
                                        prWin.close();
                                    }
                                },
                                // animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    }

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
    clearSearchStore: function () {
        var store = gm.me().searchDetailStoreOnlySrcMap;

        store.getProxy().setExtraParam('start', 0);
        store.getProxy().setExtraParam('page', 1);
        store.getProxy().setExtraParam('limit', 100);

        store.getProxy().setExtraParam('item_code', '');
        store.getProxy().setExtraParam('item_name', '');
        store.getProxy().setExtraParam('specification', '');
        store.getProxy().setExtraParam('model_no', '');
    },
    redrawSearchStore: function () {

        this.clearSearchStore();

        var item_code = null;
        var item_name = null;
        var specification = null;
        var model_no = null;

        var store = gm.me().searchDetailStoreOnlySrcMap;
        if (vCompanyReserved4 == 'SKNH01KR') {
            item_code = gu.getValue('search_item_code_sk');
            item_name = gu.getValue('search_item_name_sk');
            specification = gu.getValue('search_specification_sk');
            model_no = gu.getValue('search_model_no_sk');
        } else {
            item_code = gu.getValue('search_item_code');
            item_name = gu.getValue('search_item_name');
            specification = gu.getValue('search_specification');
            model_no = gu.getValue('search_model_no');
        }

        var supplier_name = '';
        try {
            supplier_name = gu.getValue('search_supplier_name');
        } catch (error) {

        }

        //var field_id = fieldObj['field_id'];
        console_logs('item_code', item_code);
        console_logs('item_name', item_name);
        console_logs('specification', specification);
        console_logs('model_no', model_no);

        var bIn = false;
        if (item_code.length > 0) {
            store.getProxy().setExtraParam('item_code', item_code);
            bIn = true;
        }

        if (item_name.length > 0) {
            store.getProxy().setExtraParam('item_name', item_name);
            bIn = true;
        }

        if (specification.length > 0) {
            store.getProxy().setExtraParam('specification', specification);
            bIn = true;
        }

        if (model_no.length > 0) {
            store.getProxy().setExtraParam('model_no', model_no);
            bIn = true;
        }

        if (supplier_name.length > 0) {
            store.getProxy().setExtraParam('supplier_name', supplier_name);
            bIn = true;
        } else {
            store.getProxy().setExtraParam('supplier_name', null);
        }

        store.getProxy().setExtraParam('limit', 250);

        if (bIn == true) {
            store.load();
        } else {
            store.removeAll();
        }
    },

    confirmPjGoDesign: function (result) {
        if (result == 'yes') {
            var select = gm.me().grid.getSelectionModel().getSelection()[0];
            if (select == null || select == undefined || select.length < 1) {
                Ext.MessageBox.alert('알림', '수주를 지정해주세요.');
                return null;
            }
            var id = select.get('unique_id');
            var assy_uid = select.get('unique_uid');
            var pj_type = select.get('pj_type');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/production/schdule.do?method=comfirmPjRequestDesign',
                params: {
                    unique_id: id,
                    assy_uid: assy_uid,
                    pj_type: pj_type
                },
                success: function (result, request) {
                    gm.me().store.load();
                    gm.me().prdStore.removeAll();
                },
                failure: extjsUtil.failureMessage
            });
        }
    },

    confirmPjAndGoPrd: function (result) {
        if (result == 'yes') {
            var select = gm.me().grid.getSelectionModel().getSelection()[0];
            if (select == null || select == undefined || select.length < 1) {
                Ext.MessageBox.alert('알림', '수주를 지정해주세요.');
                return null;
            }
            var ac_uid = select.get('ac_uid');
            var assy_uid = select.get('unique_uid');
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/index/process.do?method=addCartCopyPart',
                params: {
                    ac_uid: ac_uid,
                    assymap_uid: assy_uid,
                },
                success: function (result, request) {
                    gm.me().store.load();
                },
                failure: extjsUtil.failureMessage
            });
        }
    },

    attachFile: function () {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });


        var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부된 파일 리스트',
            store: this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype: 'button',
                        text: '파일 업로드',
                        scale: 'small',
                        iconCls: 'af-upload-white',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('=====aaa', record);
                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous: true
                            });

                            var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일첨부',
                                panel: uploadPanel
                            });

                            this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
                                console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                console_logs('this.mon uploadcomplete manager', manager);
                                console_logs('this.mon uploadcomplete items', items);
                                console_logs('this.mon uploadcomplete errorCount', errorCount);
                                gm.me().uploadComplete(items);
                                uploadDialog.close();
                            }, this);
                            uploadDialog.show();
                        }
                    },
                    {
                        xtype: 'button',
                        text: '파일삭제',
                        scale: 'small',
                        iconCls: 'af-remove',
                        scope: this.fileGrid,
                        handler: function () {
                            console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
                            if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                                var unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                                var file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                                if (unique_id != null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params: {
                                            file_path: file_path,
                                            unique_id: unique_id
                                        },
                                        success: function (result, request) {
                                            Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                                            gm.me().attachedFileStore.load(function (records) {
                                                if (records != null) {
                                                    var o = gu.getCmp('file_quan');
                                                    if (o != null) {
                                                        o.update('파일 수 : ' + records.length);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
                            }
                        }
                    },
                    this.removeActionFile,
                    '-',
                    this.sendFileAction,
                    '->',
                    {
                        xtype: 'component',
                        id: gu.id('file_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html: '파일 수 : 0'
                    },

                ]
            }

            ],
            columns: [
                {
                    text: '파일 일련번호',
                    width: 100,
                    style: 'text-align:center',
                    sortable: true,
                    dataIndex: 'id'
                },
                {
                    text: '파일명',
                    style: 'text-align:center',
                    flex: 0.7,
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '파일유형',
                    style: 'text-align:center',
                    width: 70,
                    sortable: true,
                    dataIndex: 'file_ext'
                },
                {
                    text: '업로드 날짜',
                    style: 'text-align:center',
                    width: 160,
                    sortable: true,
                    dataIndex: 'create_date'
                },
                {
                    text: 'size',
                    width: 100,
                    sortable: true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'file_size'
                },
                {
                    text: '등록자',
                    style: 'text-align:center',
                    width: 70,
                    sortable: true,
                    dataIndex: 'creator'
                },
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: '첨부파일',
            width: 1300,
            height: 600,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype: 'container',
            plain: true,
            items: [
                this.fileGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            },{
                text: CMD_CANCEL,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }]

        });
        win.show();
    },


    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', { group_code: null }),

    uploadComplete: function (items) {

        console_logs('uploadComplete items', items);

        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });

        console_logs('파일업로드 결과', output);
        Ext.MessageBox.show({
            title: '파일업로드 완료',
            icon: Ext.MessageBox['INFO'],
            msg: '파일첨부가 완료되었습니다.',
            buttons: Ext.MessageBox.OK,
            width: 450
        });

        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });
    },

    cellEditing: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    cellEditing_save: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    cellEditing_prd: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),

    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchExepOrderStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),
    prdStore: Ext.create('Mplm.store.RecvPoDsmfPoPRD', {}),
    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    PmUserStore: Ext.create('Mplm.store.UserStore', {}),
    payTermsStore : Ext.create('Mplm.store.PaytermStore', {}),
    incotermsStore : Ext.create('Mplm.store.IncotermsStore', {}),
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_NEW_DIVISION' }),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_CONDITION' }),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_TYPE' }),

    searchPrdStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'PRD' }),
    searchAssyStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'ASSY' }),

    searchItemStore: Ext.create('Mplm.store.ProductStore', {}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SAMPLE_TYPE' })
});
