Ext.define('Rfx2.view.gongbang.equipState.WPMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-po-ver-view',

    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //this.addSearchField('unique_id');
        // this.setDefComboValue('standard_flag', 'valueField', 'R');

        // this.addSearchField ({
        //     type: 'checkbox',
        //     field_id: 'existSalesPrice',
        //     items: [
        //         {
        //             boxLabel: '단가 있는 품목만',
        //             checked: true
        //         },
        //     ],
        // });

        // this.addSearchField('item_code');
        // this.addSearchField('item_name');
        //this.addSearchField('supplier_name');
        // this.addSearchField('specification');

        // this.addCallback('CHECK_SP_CODE', function (combo, record) {

        //     gMain.selPanel.refreshStandard_flag(record);

        // });

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
                    buttonToolbar.items.remove(item);
                    break;
                default:
                    break;
            }
        });

        this.addPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: this.getMC('mes_order_recv_btn', '목형등록'),
            tooltip: this.getMC('mes_order_recv_btn_msg', '목형등록'),
            disable: true,
            handler: function () {
                // gm.me().payTermsStore.load();
                // gm.me().incotermsStore.load();

                // 첨부파일 임시 파일업로드 그룹코드 지정을 위한 랜덤 문자를 생성.
                // var ranNum = gm.me().tempoaryFileGroupcode(10000000000000, 20000000000000);
                // console_logs('랜덤파일코드 생성여부 확인???', ranNum);
                // gm.me().combstStore.getProxy().setExtraParam('pr_active_flag_final','Y|E');
                // var productGrid = Ext.create('Ext.grid.Panel', {
                //     store: new Ext.data.Store(),
                //     cls: 'rfx-panel',
                //     id: gu.id('productGrid'),
                //     collapsible: false,
                //     multiSelect: false,
                //     width: 1150,
                //     // overflowY: 'scroll',
                //     margin: '0 0 20 0',
                //     autoHeight: true,
                //     frame: false,
                //     border: true,
                //     // layout: 'fit',
                //     forceFit: true,
                //     columns: [
                //         {
                //             text: gm.me().getMC('msg_order_grid_prd_fam', gm.getMC('CMD_Product', '제품군')),
                //             width: '10%',
                //             dataIndex: 'class_name',
                //             style: 'text-align:center',
                //             sortable: false
                //         },
                //         {
                //             text: gm.me().getMC('msg_order_grid_prd_name', '제품명'),
                //             width: '25%',
                //             dataIndex: 'item_name',
                //             style: 'text-align:center',
                //             sortable: false
                //         },
                //         {
                //             text: gm.me().getMC('msg_order_grid_prd_desc', '기준모델'),
                //             width: '15%',
                //             dataIndex: 'description',
                //             style: 'text-align:center',
                //             sortable: false
                //         },
                //         {
                //             text: 'Site',
                //             width: '8%',
                //             dataIndex: 'reserved_varcharg',
                //             style: 'text-align:center',
                //             // editor: 'textfield',
                //             sortable: false
                //         },
                //         {
                //             text: gm.me().getMC('msg_order_grid_quan_desc', '수량'),
                //             width: '10%',
                //             dataIndex: 'sales_amount',
                //             editor: 'numberfield',
                //             style: 'text-align:center',
                //             align: 'right',
                //             css: 'edit-cell',
                //             sortable: false,
                //             renderer: function (value, context, tmeta) {
                //                 if (context.field == 'sales_amount') {
                //                     context.record.set('sales_amount', Ext.util.Format.number(value, '0,00/i'));
                //                 }
                //                 return Ext.util.Format.number(value, '0,00/i');
                //             },
                //         },
                //         {
                //             text: 'Unit',
                //             width: '8%',
                //             dataIndex: 'reserved_varchar9',
                //             style: 'text-align:center',
                //             // editor: 'textfield',
                //             sortable: false
                //         },
                //         {
                //             text: gm.me().getMC('msg_order_grid_quan_desc', '단가'),
                //             width: '10%',
                //             decimalPrecision: 5,
                //             dataIndex: 'sales_price',
                //             style: 'text-align:center',
                //             align: 'right',
                //             // editor: 'numberfield',
                //             sortable: false
                //         },
                //         {
                //             text: gm.me().getMC('msg_order_grid_prd_currency', '통화'),
                //             width: '8%',
                //             dataIndex: 'reserved_varchar8',
                //             style: 'text-align:center',
                //             // editor: 'textfield',
                //             sortable: false
                //         },
                //         {
                //             text: gm.me().getMC('msg_order_grid_prd_delivery_date', '납기일'),
                //             width: '20%',
                //             dataIndex: 'delivery_plan',
                //             style: 'text-align:center',
                //             css: 'edit-cell',
                //             editor: {
                //                 xtype: 'datefield',
                //                 format: 'Y-m-d'
                //             },
                //             format: 'Y-m-d',
                //             dateFormat: 'Y-m-d',
                //             sortable: false,

                //             renderer: Ext.util.Format.dateRenderer('Y-m-d')
                //         },
                //         {
                //             text: 'incoterms',
                //             width: '15%',
                //             dataIndex: 'item_incoterms',
                //             style: 'text-align:center',
                //             editor: {
                //                 xtype: 'combobox',
                //                 displayField: 'codeName',
                //                 editable: false,
                //                 forceSelection: true,
                //                 // mode: 'local',
                //                 store: gm.me().incotermsStore,

                //                 triggerAction: 'all',
                //                 valueField: 'codeName'
                //             },

                //             sortable: false
                //         },
                //         {
                //             text: gm.me().getMC('msg_order_grid_prd_pay_terms', '결제방법'),
                //             width: '35%',
                //             css: 'edit-cell',
                //             dataIndex: 'item_pancond_kr',
                //             style: 'text-align:center',
                //             editor: {
                //                 xtype: 'combobox',
                //                 id: gu.id('item_paycond_combo'),
                //                 displayField: 'codeName',
                //                 editable: false,
                //                 forceSelection: true,
                //                 // mode: 'local',
                //                 store: gm.me().payTermsStore,
                //                 triggerAction: 'all',
                //                 valueField: 'codeName'
                //             },
                //             sortable: false
                //         },
                //         {
                //             text: 'Commment',
                //             width: '20%',
                //             css: 'edit-cell',
                //             dataIndex: 'item_comment',
                //             style: 'text-align:center',
                //             editor: 'textfield',
                //             sortable: false
                //         },
                //     ],
                //     selModel: 'cellmodel',
                //     plugins: {
                //         ptype: 'cellediting',
                //         clicksToEdit: 2,
                //     },
                //     listeners: {
                //         edit: function (editor, e, eOpts) {
                //             var store = gu.getCmp('productGrid').getStore();
                //             var previous_store = store.data.items;
                //             var total_quan = 0.0;
                //             var total_price = 0.0;
                //             console_logs('All Store Contents ??? ', previous_store);
                //             for (var j = 0; j < previous_store.length; j++) {
                //                 var item = previous_store[j];
                //                 console_logs('sales_amount_EDIT', Number(item.get('sales_amount')));
                //                 console_logs('sales_price_EIDT', Number(item.get('sales_price')));
                //                 total_quan = Number(total_quan) + Number(item.get('sales_amount'));
                //                 total_price = Number(total_price) + (Number(item.get('sales_price')) * Number(item.get('sales_amount')));
                //             }
                //             gu.getCmp('po_total').setValue(total_quan);
                //             gu.getCmp('po_price').setValue(total_price);
                //         }
                //     },
                //     dockedItems: [
                //         Ext.create('widget.toolbar', {
                //             plugins: {
                //                 boxreorderer: false
                //             },
                //             cls: 'my-x-toolbar-default2',
                //             margin: '0 0 0 0',
                //             items: [
                //                 '->',
                //                 gm.me().getPrdAdd(),
                //                 {
                //                     text: CMD_DELETE,
                //                     iconCls: 'af-remove',
                //                     listeners: [{
                //                         click: function () {
                //                             var record = gu.getCmp('productGrid').getSelectionModel().getSelected().items[0];
                //                             gu.getCmp('productGrid').getStore().removeAt(gu.getCmp('productGrid').getStore().indexOf(record));
                //                         }
                //                     }]
                //                 },
                //                 {
                //                     text: '▲',
                //                     listeners: [{
                //                         click: function () {
                //                             var direction = -1;
                //                             var record = gu.getCmp('productGrid').getSelectionModel().getSelected().items[0];
                //                             if (!record) {
                //                                 return;
                //                             }

                //                             var index = gu.getCmp('productGrid').getStore().indexOf(record);
                //                             if (direction < 0) {
                //                                 index--;
                //                                 if (index < 0) {
                //                                     return;
                //                                 }
                //                             } else {
                //                                 index++;
                //                                 if (index >= gu.getCmp('productGrid').getStore().getCount()) {
                //                                     return;
                //                                 }
                //                             }
                //                             gu.getCmp('productGrid').getStore().remove(record);
                //                             gu.getCmp('productGrid').getStore().insert(index, record);
                //                             gu.getCmp('productGrid').getSelectionModel().select(index, true);
                //                         }
                //                     }]
                //                 },
                //                 {
                //                     text: '▼',
                //                     listeners: [{
                //                         click: function () {
                //                             var direction = 1;
                //                             var record = gu.getCmp('productGrid').getSelectionModel().getSelected().items[0];
                //                             if (!record) {
                //                                 return;
                //                             }

                //                             var index = gu.getCmp('productGrid').getStore().indexOf(record);
                //                             if (direction < 0) {
                //                                 index--;
                //                                 if (index < 0) {
                //                                     return;
                //                                 }
                //                             } else {
                //                                 index++;
                //                                 if (index >= gu.getCmp('productGrid').getStore().getCount()) {
                //                                     return;
                //                                 }
                //                             }
                //                             gu.getCmp('productGrid').getStore().remove(record);
                //                             gu.getCmp('productGrid').getStore().insert(index, record);
                //                             gu.getCmp('productGrid').getSelectionModel().select(index, true);
                //                         }
                //                     }]
                //                 }
                //             ]
                //         })
                //     ]
                // });

                var form = Ext.create('Ext.form.Panel', {
                    id: 'addPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'vbox',
                    // overflowY: 'scroll',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('msg_order_dia_header_title', '기본 목형정보를 입력하십시오.'),
                            width: '99%',
                            style: 'padding:10px',
                            defaults: {
                                labelStyle: 'padding:10px',
                                anchor: '100%',
                                layout: {
                                    type: 'vbox'
                                }
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: '100%',
                                    border: false,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [

                                        {
                                            xtype: 'textfield',
                                            id: 'item_code',
                                            name: 'item_code',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '목형번호',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'add_mtrl',
                                            name: 'add_mtrl',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '사용재료',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'specification',
                                            name: 'specification',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '규격',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'item_name',
                                            name: 'item_name',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '목형명',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'maker',
                                            name: 'maker',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '제작처',
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'make_date',
                                            name: 'make_date',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '제작연도',
                                            format: 'Y-m-d',
                                            // value: new Date()
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'cavity',
                                            name: 'cavity',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + 'Cavity',
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'quan',
                                            name: 'quan',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '벌수',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'division',
                                            name: 'division',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '구분',
                                        },
                                        // {
                                        //     id: gu.id('rack_uid'),
                                        //     name: 'rack_uid',
                                        //     fieldLabel:'Rack',
                                        //     xtype: 'combo',
                                        //     width: '99%',
                                        //     padding: '0 0 5px 30px',
                                        //     allowBlank: false,
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().rackStore,
                                        //     emptyText: '선택해주세요.',
                                        //     displayField: 'class_code',
                                        //     valueField: 'unique_id',
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{unique_id}">{class_code}</div>';
                                        //         }
                                        //    },
                                        //     listeners: {
                                        //         select: function (combo, record) {

                                        //         }// endofselect
                                        //     }
                                        // },
                                        {
                                            xtype: 'numberfield',
                                            id: 'core',
                                            name: 'core',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '코어갯수',
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'limit_press',
                                            name: 'limit_press',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '한계타발수',
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'punc_cnt',
                                            name: 'punc_cnt',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '타발횟수',
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'item_price',
                                            name: 'item_price',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: false,
                                            minValue: 0,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '목형금액',
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'fix_date',
                                            name: 'fix_date',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            format: 'Y-m-d',
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '수리일자',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'description',
                                            name: 'description',
                                            padding: '0 0 5px 30px',
                                            width: '99%',
                                            allowBlank: true,
                                            fieldLabel: '비고',
                                        },
                                    ]
                                },

                            ]
                        }
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_recv_btn', '목형등록'),
                    width: 600,
                    height: 650,
                    plain: true,
                    items: form,
                    // overflowY: 'scroll',
                    // overflowY: 'scroll',
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
                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/index/process.do?method=addMoldInfo',
                                        success: function (val, action) {
                                            console_logs('val >>>>', val);
                                            win.setLoading(false);
                                            gm.me().store.load();
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                            gm.me().store.load();
                                        }
                                    });
                                } else {

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
            text: this.getMC('mes_order_edit_btn', '목형수정'),
            tooltip: this.getMC('mes_order_edit_btn_msg', '목형수정'),
            disabled: true,
            handler: function () {
                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                gm.me().rackStore.load();
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
                            title: gm.me().getMC('mes_order_edit_btn', '공통정보 수정'),
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
                                        //     id: gu.id('order_com_unique'),
                                        //     name: 'order_com_unique',
                                        //     fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객명'),
                                        //     allowBlank: false,
                                        //     editable: false,
                                        //     readOnly: false,
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     // fieldStyle: 'background-color: #ddd; background-image: none;',
                                        //     store: gm.me().combstStore,
                                        //     emptyText: gm.me().getMC('msg_order_dia_prd_empty_msg', '선택해주세요'),
                                        //     displayField: 'wa_name',
                                        //     valueField: 'unique_id',
                                        //     value: select.get('order_com_unique'),
                                        //     sortInfo: { field: 'wa_name', direction: 'ASC' },
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{unique_id}">{wa_name} [{nation_code}]</div>';
                                        //         }
                                        //     },
                                        //     listeners: {
                                        //         select: function (combo, record) {
                                        //             console_logs('들어갈 값 >>>>>>', gu.getCmp('order_com_unique').getValue());
                                        //             gu.getCmp('final_buyer').setValue(gu.getCmp('order_com_unique').getValue());
                                        //         }// endofselect
                                        //     }
                                        // },
                                        // {
                                        //     id: gu.id('final_buyer'),
                                        //     name: 'reserved_number3',
                                        //     fieldLabel: gm.me().getMC('msg_order_dia_order_end_customer', '최종고객사'),
                                        //     allowBlank: false,
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().combstStore,
                                        //     emptyText: '선택해주세요.',
                                        //     displayField: 'wa_name',
                                        //     valueField: 'unique_id',
                                        //     value: select.get('reserved_number3'),
                                        //     sortInfo: { field: 'wa_name', direction: 'ASC' },
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{unique_id}">[{nation_code}] {wa_name}</div>';
                                        //         }
                                        //     },
                                        //     listeners: {
                                        //         select: function (combo, record) {
                                        //             //Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
                                        //         }// endofselect
                                        //     }
                                        // },
                                        // {
                                        //     id: 'deal_type',
                                        //     name: 'reserved_varcharb',
                                        //     fieldLabel: gm.me().getMC('msg_order_dia_order_transaction', '거래구분'),
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     allowBlank: true,
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().sampleTypeStore,
                                        //     emptyText: '선택해주세요.',
                                        //     displayField: 'codeName',
                                        //     valueField: 'systemCode',
                                        //     value: select.get('reserved_varcharb'),
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
                                        //     xtype: 'datefield',
                                        //     id: 'regist_date',
                                        //     name: 'regist_date',
                                        //     padding: '0 0 5px 30px',
                                        //     width: '45%',
                                        //     allowBlank: true,
                                        //     format: 'Y-m-d',
                                        //     dateFormat: 'Y-m-d',
                                        //     submitformat: 'Y-m-d',
                                        //     value: select.get('regist_date_str'),
                                        //     fieldLabel: 'Po Date',
                                        // },
                                        {
                                            xtype: 'textfield',
                                            id: 'item_code',
                                            name: 'item_code',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            value: select.get('item_code'),
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '목형번호',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'used_mtrl',
                                            name: 'used_mtrl',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            value: select.get('used_mtrl'),
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '사용재료',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'specification',
                                            name: 'specification',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            value: select.get('specification'),
                                            allowBlank: false,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '규격',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'item_name',
                                            name: 'item_name',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            value: select.get('item_name'),
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '목형명',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'maker',
                                            name: 'maker',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            value: select.get('maker'),
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '제작처',
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'make_date',
                                            name: 'make_date',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            format: 'Y-m-d',
                                            value: select.get('make_date'),
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '제작연도',
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'cavity',
                                            name: 'cavity',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            value: select.get('cavity'),
                                            minValue: 0,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + 'Cavity',
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'quan',
                                            name: 'quan',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            value: select.get('quan'),
                                            minValue: 0,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '벌수',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'division',
                                            name: 'division',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            value: select.get('division'),
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '구분'
                                        },
                                        // {
                                        //     id: gu.id('rack_uid'),
                                        //     name: 'rack_uid',
                                        //     fieldLabel:'Rack',
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     allowBlank: true,
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().rackStore,
                                        //     emptyText: '선택해주세요.',
                                        //     displayField: 'class_code',
                                        //     valueField: 'unique_id',
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     value : select.get('rack_uid'),
                                        //     fieldLabel: 'rack',
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{unique_id}">{class_code}</div>';
                                        //         }
                                        //     },
                                        //     listeners: {
                                        //         select: function (combo, record) {

                                        //         }// endofselect
                                        //     }
                                        // },
                                        {
                                            xtype: 'numberfield',
                                            id: 'limit_press',
                                            name: 'limit_press',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            value: select.get('limit_press'),
                                            minValue: 0,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '한계타발수',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'core',
                                            name: 'core',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            value: select.get('core'),
                                            minValue: 0,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '코어갯수'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'punc_cnt',
                                            name: 'punc_cnt',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            value: select.get('punc_cnt'),
                                            minValue: 0,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '타발횟수',
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'item_price',
                                            name: 'item_price',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            value: select.get('item_price'),
                                            minValue: 0,
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '목형금액'
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'fix_date',
                                            name: 'fix_date',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: false,
                                            format: 'Y-m-d',
                                            value: select.get('fix_date'),
                                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '수리일자'
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'description',
                                            name: 'description',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            value: select.get('description'),
                                            fieldLabel: '비고',
                                        }

                                    ]
                                },

                            ]
                        },

                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_edit_btn', '목형수정'),
                    width: 650,
                    height: 350,
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
                                        url: CONTEXT_PATH + '/index/process.do?method=editMoldInfo',
                                        params: {
                                            unique_id: select.get('unique_id_long')
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
                                    Ext.MessageBox.alert('알림', '목형 수정 원인을 확인해주세요.');
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


        // this.fileattachAction = Ext.create('Ext.Action', {
        //     iconCls: 'af-download',
        //     itemId: 'fileattachAction',
        //     disabled: true,
        //     text: this.getMC('mes_order_file_btn', '파일다운로드'),
        //     handler: function (widget, event) {
        //         gm.me().attachFile();
        //     }
        // });

        this.excelUploadAction = Ext.create('Ext.Action', {
            iconCls: 'af-upload-white',
            disabled: true,
            text: '파일업로드',
            tooltip: this.getMC('목형등록시 필요문서를 일괄 업로드 합니다.'),
            handler: function () {
                var gridContent = Ext.create('Ext.panel.Panel', {
                    cls: 'rfx-panel',
                    id: gu.id('gridContent2'),
                    collapsible: false,
                    region: 'east',
                    multiSelect: false,
                    //autoScroll: true,
                    autoHeight: true,
                    frame: false,
                    layout: 'vbox',
                    forceFit: true,
                    flex: 1,
                    items: [gm.me().createMsTab('SIZE', 'SI')]
                });
                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('CMD_FILE_UPLOAD', '파일 업로드'),
                    id: gu.id('uploadPrWin'),
                    width: 500,
                    height: 500,
                    items: {
                        collapsible: false,
                        frame: false,
                        region: 'center',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        margin: '0 0 5 0',
                        flex: 1,
                        items: [gridContent]
                    }
                });

                prWin.show();
            }
        });


        //console_logs('this.fields', this.fields);
        this.createStore('Rfx2.model.company.mjcm.Mold', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['mold']
        );

        buttonToolbar.insert(1, this.addPoAction);
        buttonToolbar.insert(2, this.editPoAction);
        // buttonToolbar.insert(3, this.excelUploadAction);
        // buttonToolbar.insert(4, this.fileattachAction);
        // buttonToolbar.insert(5, this.completeAction);

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        // this.salesPriceListStore = Ext.create('Rfx2.store.company.bioprotech.SalesPriceListStore', {});
        this.poPrdDetailStore = Ext.create('Rfx2.store.company.mjcm.ProductStoreByMold', {});

        this.addPoPrdPlus = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: CMD_ADD,
            tooltip: this.getMC('msg_btn_prd_add', '제품추가'),
            disabled: true,
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                console_logs('top_srcahd_uid', selections.get('srcahd_uid'));
                console_logs('assymap_uid', selections.get('unique_uid'));
                console_logs('ac_uid', selections.get('ac_uid'));
                // 추가 제품을 등록하기 위한 기본 uid를 미리 구해놓는다.
                // var parent = selections.get('srcahd_uid');
                // var parent_uid = selections.get('unique_uid');
                var pj_uid = selections.get('unique_uid');

                var productGridExtra = Ext.create('Ext.grid.Panel', {
                    store: new Ext.data.Store(),
                    cls: 'rfx-panel',
                    id: gu.id('productGridExtra'),
                    collapsible: false,
                    multiSelect: false,
                    width: 750,
                    autoScroll: true,
                    margin: '0 0 20 0',
                    autoHeight: true,
                    frame: false,
                    border: true,
                    layout: 'fit',
                    forceFit: true,
                    columns: [
                        {
                            text: gm.me().getMC('msg_order_grid_prd_name', '품목코드'),
                            width: '25%',
                            dataIndex: 'item_code',
                            style: 'text-align:center',
                            sortable: false
                        },
                        {
                            text: gm.me().getMC('msg_order_grid_prd_name', '제품명'),
                            width: '25%',
                            dataIndex: 'item_name',
                            style: 'text-align:center',
                            sortable: false
                        },
                        {
                            text: gm.me().getMC('msg_order_grid_prd_desc', '규격'),
                            width: '15%',
                            dataIndex: 'specification',
                            style: 'text-align:center',
                            sortable: false
                        },

                    ],
                    selModel: 'cellmodel',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    listeners: {
                        // edit: function (editor, e, eOpts) {
                        //     var store = gu.getCmp('productGridExtra').getStore();
                        //     var previous_store = store.data.items;
                        //     var total_quan = 0.0;
                        //     var total_price = 0.0;
                        //     console_logs("상민",store);
                        //     console_logs('All Store Contents ??? ', previous_store);
                        //     for (var j = 0; j < previous_store.length; j++) {
                        //         var item = previous_store[j];
                        //         console_logs('sales_amount_EDIT', Number(item.get('sales_amount')));
                        //         console_logs('sales_price_EIDT', Number(item.get('sales_price')));
                        //         total_quan = Number(total_quan) + Number(item.get('sales_amount'));
                        //         total_price = Number(total_price) + (Number(item.get('sales_price')) * Number(item.get('sales_amount')));
                        //     }
                        //     gu.getCmp('po_total').setValue(total_quan);
                        //     gu.getCmp('po_price').setValue(total_price);
                        // }
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
                                gm.me().getPrdExtraAdd(),
                                {
                                    text: CMD_DELETE,
                                    iconCls: 'af-remove',
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('productGridExtra').getSelectionModel().getSelected().items[0];
                                            gu.getCmp('productGridExtra').getStore().removeAt(gu.getCmp('productGridExtra').getStore().indexOf(record));
                                        }
                                    }]
                                },
                                {
                                    text: '▲',
                                    listeners: [{
                                        click: function () {
                                            var direction = -1;
                                            var record = gu.getCmp('productGridExtra').getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = gu.getCmp('productGridExtra').getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= gu.getCmp('productGridExtra').getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            gu.getCmp('productGridExtra').getStore().remove(record);
                                            gu.getCmp('productGridExtra').getStore().insert(index, record);
                                            gu.getCmp('productGridExtra').getSelectionModel().select(index, true);
                                        }
                                    }]
                                },
                                {
                                    text: '▼',
                                    listeners: [{
                                        click: function () {
                                            var direction = 1;
                                            var record = gu.getCmp('productGridExtra').getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = gu.getCmp('productGridExtra').getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= gu.getCmp('productGridExtra').getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            gu.getCmp('productGridExtra').getStore().remove(record);
                                            gu.getCmp('productGridExtra').getStore().insert(index, record);
                                            gu.getCmp('productGridExtra').getSelectionModel().select(index, true);
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
                            frame: true,
                            title: gm.me().getMC('msg_btn_prd_extra_add', '추가제품등록'),
                            width: '100%',
                            height: '100%',
                            layout: 'fit',
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items: [
                                productGridExtra
                            ]
                        },
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('msg_btn_prd_extra_add', '추가 제품등록'),
                    width: 800,
                    height: 500,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var storeData = gu.getCmp('productGridExtra').getStore();
                                var srcahdUids = [];
                                for (var j = 0; j < storeData.data.items.length; j++) {
                                    var item = storeData.data.items[j];
                                    srcahdUids.push(item.get('srcahd_uid'))
                                }
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=addMoldMap',
                                    params: {
                                        srcahdUids: srcahdUids,
                                        moldUid: selections.get('unique_id_long')
                                    },
                                    success: function (result, request) {
                                        var resultTxt = result.responseText;
                                        console_logs('result >>>', resultTxt);
                                        form.setLoading(false);
                                        var resultText = result.responseText;
                                        console_log('result:' + resultText);
                                        if (resultText === 'success') {
                                            Ext.MessageBox.alert('알림', '등록처리 되었습니다.');
                                        } else if (resultText === 'false') {
                                            Ext.MessageBox.alert('알림', '등록처리가 실패되었습니다<br>같은 증상 지속 시 시스템 관리자에게 문의하세요.');
                                        } else if (resultText === 'duplicate') {
                                            Ext.MessageBox.alert('알림', '중복제품이 등록되었습니다.<br>다시 확인해주세요.');
                                        }
                                        win.setLoading(false);
                                        gm.me().store.load();
                                        gm.me().poPrdDetailStore.load();
                                        win.close();

                                    },//endofsuccess
                                    failure: extjsUtil.failureMessage
                                });//endofajax
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


        this.deletePrdAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: CMD_DELETE,
            tooltip: '제품삭제',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: gm.me().getMC('msg_btn_prd_delete_title', '제품삭제'),
                    msg: gm.me().getMC('msg_btn_prd_delete_msg', '선택한 제품을 삭제하시겠습니까?'),
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            var grid = gu.getCmp('gridContractCompany');
                            var record = grid.getSelectionModel().getSelected().items[0];
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/index/process.do?method=deleteMoldMap',
                                params: {
                                    unique_id: record.get('unique_id_long'),
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

        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractCompany'),
            store: this.poPrdDetailStore,
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
            bbar: getPageToolbar(this.poPrdDetailStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
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
                            html: this.getMC('msg_reg_prd_info_detail', '등록된 목형정보를 선택하십시오.'),
                            // html: "등록된 수주건을 선택하십시오.",
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addPoPrdPlus,
                        this.deletePrdAction
                    ]
                }
            ],
            columns: [
                {
                    text: this.getMC('msg_order_grid_prd_fam', '제품코드'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'item_code',
                    sortable: false
                },
                {
                    text: this.getMC('msg_order_grid_prd_name', '제품명'),
                    width: 150,
                    style: 'text-align:center',
                    dataIndex: 'item_name',
                    sortable: false
                },
                {
                    text: this.getMC('msg_order_grid_prd_name', '규격'),
                    width: 150,
                    style: 'text-align:center',
                    dataIndex: 'specification',
                    sortable: false
                },
            ],
            title: this.getMC('mes_reg_prd_info_msg', '해당 목형을 사용하는 제품'),
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {
                    var columnName = e.field;
                    var tableName = 'sloast';
                    console_logs('e.record >>>>>>> ', e.record);
                    var unique_id = e.record.get('assymap_uid');
                    var ac_uid = e.record.get('ac_uid');
                    // var unique_id = e.record.getId();
                    var value = e.value;
                    if (columnName === 'payment_condition') {
                        columnName = 'reserved3';
                    }

                    if (columnName === 'reserved_timestamp1_str') {
                        columnName = 'gr_date';
                    }
                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                    gm.me().poPrdDetailStore.load();
                    var store = gm.me().poPrdDetailStore;
                    var item = store.data.items;
                    console_logs('item >>>>', item);
                    var pj_total_price = 0.0;
                    for (var i = 0; i < item.length; i++) {
                        var item_desc = item[i];
                        var sales_amount = item_desc.get('sales_amount');
                        var sales_price = item_desc.get('sales_price');
                        pj_total_price = Number(pj_total_price) + (Number(sales_amount) * Number(sales_price));
                    }
                    gm.me().editAssytopPrice(pj_total_price, ac_uid);
                    gm.me().store.load();
                }
            }
        });

        Ext.each(this.gridContractCompany.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'sales_amount':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'reserved_timestamp1_str':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'reserved1':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'reserved2':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'payment_condition':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'sales_amount':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                        // return value;
                    };
                    break;
                case 'reserved_timestamp1_str':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    };
                    break;
                case 'reserved1':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    };
                    break;
                case 'reserved2':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    };
                    break;
                case 'payment_condition':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    };
                    break;
                default:
                    break;
            }

        });

        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                console_logs('>>>>>>> rec', selections);
                if (selections) {
                    // gm.me().addPoPrdPlus.enable();
                    gm.me().deletePrdAction.enable();
                } else {
                    // gm.me().addPoPrdPlus.disable();
                    gm.me().deletePrdAction.disable();
                }
                // if (selections) {
                //     gm.me().modifySalesPriceAction.enable();
                //     gm.me().removeContractMatAction.enable();
                // } else {
                //     gm.me().modifySalesPriceAction.disable();
                //     gm.me().removeContractMatAction.disable();
                // }
            }
        });

        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
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
                    width: '73%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, this.gridContractCompany
            ]
        });

        //버튼 추가.
        buttonToolbar.insert(6, '-');
        buttonToolbar.insert(6, this.setAllMatView);

        buttonToolbar.insert(6, '-');

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
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
                gm.me().addPoPrdPlus.enable();
                gm.me().vSELECTED_ASSYMAP_UID = rec.get('unique_uid');
                gm.me().vSELECTED_PJ_UID = rec.get('pj_uid');
                gUtil.enable(gMain.selPanel.completeAction);
                gUtil.enable(gMain.selPanel.editPoAction);
                gUtil.enable(gMain.selPanel.removeAction);
                gUtil.disable(gMain.selPanel.modifyAction);
                gUtil.enable(gMain.selPanel.fileattachAction);
                gUtil.enable(gMain.selPanel.excelUploadAction);

                var item_code = rec.get('item_code');
                var item_name = rec.get('item_name');
                gu.getCmp('selectedMtrl').setHtml('[' + item_code + '] ' + item_name);
                this.poPrdDetailStore.getProxy().setExtraParam('mold_uid', rec.get('unique_id_long'));
                this.poPrdDetailStore.load();

            } else {
                gUtil.disable(gMain.selPanel.completeAction);
                gUtil.disable(gMain.selPanel.editPoAction);
                gUtil.disable(gMain.selPanel.fileattachAction);
                gUtil.disable(gMain.selPanel.excelUploadAction);
                gm.me().addPoPrdPlus.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.getProxy().setExtraParam('having_not_status', 'CR,I,N,P,R,S,W,Y,DC,BR');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('multi_prd', true);

        this.store.load(function (records) {

        });

    },

    getPrdExtraAdd: function () {
        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'addItemAction',
            disabled: false,
            text: gm.me().getMC('msg_btn_prd_extra_add', '제품추가'),
            handler: function (widget, event) {

                var rec = gm.me().grid.getSelectionModel().getSelected().items[0];

                gm.me().searchProductStore.load();

                var partGridWidth = '20%';
                var searchItemGrid = Ext.create('Ext.grid.Panel', {
                    store: gm.me().searchProductStore,
                    layout: 'fit',
                    title: gm.me().getMC('msg_product_add_dia_header_title1', '제품검색'),
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    columns: [
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '품묵코드'),
                            flex: 1.5,
                            style: 'text-align:center',
                            dataIndex: 'item_code',
                            sortable: true
                        },
                        // { text: gm.me().getMC('msg_product_add_dia_div', '사업부'), flex: 0.5, style: 'text-align:center', dataIndex: 'division_code', sortable: true },
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '품명'),
                            flex: 1.5,
                            style: 'text-align:center',
                            dataIndex: 'item_name',
                            sortable: true
                        },
                        // { text: gm.me().getMC('msg_order_grid_prd_desc', '기준모델'), flex: 1.0, style: 'text-align:center', dataIndex: 'description', sortable: true },
                        {
                            text: gm.me().getMC('msg_product_add_search_field3', '규격'),
                            flex: 1.8,
                            style: 'text-align:center',
                            dataIndex: 'specification',
                            sortable: true
                        },
                        // { text: gm.me().getMC('msg_product_add_dia_price', '판매단가'), flex: 1, align: 'right', style: 'text-align:center', dataIndex: 'sales_price', sortable: true },
                        // { text: gm.me().getMC('msg_order_grid_prd_currency', '통화'), flex: 0.5, style: 'text-align:center', dataIndex: 'currency', sortable: true },
                        // {
                        //     text: gm.me().getMC('msg_order_grid_quan_desc', '수량'),
                        //     flex: 0.5,
                        //     dataIndex: 'sales_amount',
                        //     sortable: false,
                        //     align: 'right',
                        //     style: 'text-align:center',
                        //     renderer: function (value, context, tmeta) {
                        //         if (context.field == 'sales_amount') {
                        //             context.record.set('sales_amount', Ext.util.Format.number(value, '0,00/i'));
                        //         }
                        //         if (value == null || value.length < 1) {
                        //             value = 0;
                        //         }
                        //         return Ext.util.Format.number(value, '0,00/i');
                        //     },
                        // }
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 700,
                    height: 526,
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: gm.me().searchProductStore,
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
                                    emptyText: gm.me().getMC('msg_product_add_search_field1', '품목코드'),
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
                                    emptyText: gm.me().getMC('msg_product_add_search_field2', '품명'),
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
                                    emptyText: gm.me().getMC('msg_product_add_search_field3', '규격'),
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
                    title: gm.me().getMC('msg_product_add_dia_header_title2', '저장목록'),
                    region: 'east',
                    style: 'padding-left:10px;',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    columns: [
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '품목코드'),
                            flex: 1,
                            style: 'text-align:center',
                            dataIndex: 'item_code',
                            sortable: true
                        },
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '품명'),
                            flex: 2,
                            style: 'text-align:center',
                            dataIndex: 'item_name',
                            sortable: true
                        },
                        // { text: gm.me().getMC('msg_order_grid_prd_desc', '기준모델'), flex: 1, dataIndex: 'description', style: 'text-align:center', sortable: true },
                        {
                            text: gm.me().getMC('msg_product_add_search_field3', '규격'),
                            flex: 1,
                            dataIndex: 'specification',
                            style: 'text-align:center',
                            sortable: true
                        },
                        // {
                        //     text: gm.me().getMC('msg_order_grid_quan_desc', '수량'),
                        //     flex: 1,
                        //     dataIndex: 'sales_amount',
                        //     editor: {},
                        //     align: 'right',
                        //     style: 'text-align:center',
                        //     sortable: true,

                        //     renderer: function (value, context, tmeta) {
                        //         if (context.field == 'sales_amount') {
                        //             context.record.set('sales_amount', Ext.util.Format.number(value, '0,00/i'));
                        //         }
                        //         if (value == null || value.length < 1) {
                        //             value = 0;
                        //         }
                        //         return Ext.util.Format.number(value, '0,00/i');
                        //     },
                        // }
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
                    title: gm.me().getMC('msg_btn_prd_add', '제품추가'),
                    width: 1100,
                    height: 600,
                    minWidth: 600,
                    minHeight: 300,
                    items: [
                        searchItemGrid, saveForm
                    ],
                    buttons: [{
                        text: CMD_ADD,
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
                            winProduct.setLoading(true);
                            if (btn == "no") {
                                winProduct.setLoading(false);
                                winProduct.close();
                            } else {
                                var items = saveStore.data.items;
                                console_logs('items >>>>> ', items);
                                var store = gu.getCmp('productGridExtra').getStore();

                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];
                                    var id = item.get('unique_id_long');
                                    var item_code = item.get('item_code');
                                    var item_name = item.get('item_name');
                                    var specification = item.get('specification');

                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'srcahd_uid': id,
                                        'item_code': item_code,
                                        'item_name': item_name,
                                        'specification': specification
                                    }));
                                    // gu.getCmp('item_paycond_combo').setValue(ao_name);
                                }

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

    getPrdAdd: function () {
        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'addItemAction',
            disabled: false,
            text: gm.me().getMC('msg_btn_prd_add', '제품등록'),
            handler: function (widget, event) {
                if (gu.getCmp('reserved_varcharb').getValue() == null) {
                    Ext.MessageBox.alert(gm.me().getMC('msg_message_box_alert', '알림'), gm.me().getMC('msg_message_box_poadd_alert1', '거래구분이 입력되지 않았습니다.'));
                    return;
                }

                /*
                * Store는 거래구분과 고객명이 입력될 떄 미리 돌아야 하며.
                * 무상샘플은 전체 제품 리스트를 나열해야 한다.
                * 정상거래와 유상샘플은 지정된 고객에 등록된 제품만 나열해야 한다.
                * */
                gm.me().searchDetailStoreOnlySrcMap.getProxy().setExtraParam('fix_type', 'SE');
                if (gu.getCmp('reserved_varcharb').getValue() === 'N' || gu.getCmp('reserved_varcharb').getValue() === 'P') {
                    if (gu.getCmp('order_com_unique').getValue() == null) {
                        Ext.MessageBox.alert(gm.me().getMC('msg_message_box_alert', '알림'), gm.me().getMC('msg_message_box_poadd_alert2', '거래구분이 정상거래, 유상샘플이 선택 되었을 경우 고객명이 반드시 입력되어야 합니다'));
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
                    title: gm.me().getMC('msg_product_add_dia_header_title1', '제품검색'),
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    columns: [
                        // { text: gm.me().getMC('msg_product_add_dia_div', '사업부'), flex: 0.5, style: 'text-align:center', dataIndex: 'division_code', sortable: true },
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '모델명'),
                            flex: 1.5,
                            style: 'text-align:center',
                            dataIndex: 'item_name',
                            sortable: true
                        },
                        // { text: gm.me().getMC('msg_order_grid_prd_desc', '기준모델'), flex: 1.0, style: 'text-align:center', dataIndex: 'description', sortable: true },
                        {
                            text: gm.me().getMC('msg_product_add_search_field3', '규격'),
                            flex: 1.8,
                            style: 'text-align:center',
                            dataIndex: 'specification',
                            sortable: true
                        },
                        // { text: gm.me().getMC('msg_product_add_dia_price', '판매단가'), flex: 1, align: 'right', style: 'text-align:center', dataIndex: 'sales_price', sortable: true },
                        // { text: gm.me().getMC('msg_order_grid_prd_currency', '통화'), flex: 0.5, style: 'text-align:center', dataIndex: 'currency', sortable: true },
                        // {
                        //     text: gm.me().getMC('msg_order_grid_quan_desc', '수량'),
                        //     flex: 0.5,
                        //     dataIndex: 'sales_amount',
                        //     sortable: false,
                        //     align: 'right',
                        //     style: 'text-align:center',
                        //     renderer: function (value, context, tmeta) {
                        //         if (context.field == 'sales_amount') {
                        //             context.record.set('sales_amount', Ext.util.Format.number(value, '0,00/i'));
                        //         }
                        //         if (value == null || value.length < 1) {
                        //             value = 0;
                        //         }
                        //         return Ext.util.Format.number(value, '0,00/i');
                        //     },
                        // }
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
                                    emptyText: gm.me().getMC('msg_product_add_search_field1', '품목코드'),
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
                                    emptyText: gm.me().getMC('msg_product_add_search_field2', '품명'),
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
                                    emptyText: gm.me().getMC('msg_product_add_search_field3', '규격'),
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
                    title: gm.me().getMC('msg_product_add_dia_header_title2', '저장목록'),
                    region: 'east',
                    style: 'padding-left:10px;',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    columns: [
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '모델명'),
                            flex: 1,
                            style: 'text-align:center',
                            dataIndex: 'item_name',
                            sortable: true
                        },
                        {
                            text: gm.me().getMC('msg_order_grid_prd_desc', '기준모델'),
                            flex: 1,
                            dataIndex: 'description',
                            style: 'text-align:center',
                            sortable: true
                        },
                        {
                            text: gm.me().getMC('msg_product_add_search_field3', '규격'),
                            flex: 2,
                            dataIndex: 'specification',
                            style: 'text-align:center',
                            sortable: true
                        },
                        {
                            text: gm.me().getMC('msg_order_grid_quan_desc', '수량'),
                            flex: 1,
                            dataIndex: 'sales_amount',
                            editor: {},
                            align: 'right',
                            style: 'text-align:center',
                            sortable: true,

                            renderer: function (value, context, tmeta) {
                                if (context.field == 'sales_amount') {
                                    context.record.set('sales_amount', Ext.util.Format.number(value, '0,00/i'));
                                }
                                if (value == null || value.length < 1) {
                                    value = 0;
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            },
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
                                    text: gm.me().getMC('msg_product_add_save_list_delete', '저장목록 삭제'),
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
                        text: CMD_ADD,
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
                            var sales_amount_total_disp = 0.0;
                            if (btn == "no") {
                                winProduct.setLoading(false);
                                winProduct.close();
                            } else {
                                if (saveStore.data.items !== null && saveStore.data.items.length > 0) {
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
                                        var class_name = item.get('class_code');
                                        var item_code = item.get('item_code');
                                        var item_name = item.get('item_name');
                                        var ao_name = item.get('ao_name');
                                        var ao_name_kr = item.get('payment_condition');
                                        var po_comment = item.get('po_comment');
                                        var site = item.get('division_code');
                                        var description = item.get('description');
                                        var quan = item.get('sales_amount');
                                        if (quan == null || quan == undefined || quan.length < 1) {
                                            quan = 1;
                                        }
                                        sales_amount_total_disp = Number(sales_amount_total_disp) + Number(quan);
                                        var unit = item.get('unit_code');
                                        var currency = item.get('currency');
                                        var po_date = new Date();
                                        var present_date = new Date();
                                        var delivery_plan = present_date.setMonth(present_date.getMonth() + 2);
                                        var delivery_plan_parse = new Date(delivery_plan);
                                        var sales_price = item.get('sales_price');
                                        if (gu.getCmp('reserved_varcharb').getValue() === 'F') {
                                            Ext.MessageBox.alert(gm.me().getMC('msg_message_box_alert', '단가조정'), gm.me().getMC('msg_message_box_poadd_alert3', '무상샘플인 경우 단가가 자동으로 0으로 지정됩니다.'));
                                            // Ext.MessageBox.alert('단가조정', '무상샘플인 경우 단가가 자동으로 0으로 지정됩니다.');
                                            sales_price = 0.0;
                                        }
                                        sales_price_total_disp = Number(sales_price_total_disp) + (Number(sales_price) * Number(quan));
                                        console_logs('>>>>>>>>>', sales_amount_total_disp);
                                        console_logs('>>>>>>>>> sales_price_total_disp', sales_price_total_disp);
                                        store.insert(store.getCount(), new Ext.data.Record({
                                            'srcahd_uid': id,
                                            'sg_code': sg_code,
                                            'class_name': class_name,
                                            'reserved_varcharg': site,
                                            'sales_price': sales_price,
                                            'item_code': item_code,
                                            'item_name': item_name,
                                            'regist_date': po_date,
                                            'reserved_varchar8': currency,
                                            'reserved_varchar9': unit,
                                            'delivery_plan': delivery_plan_parse,
                                            'description': description,
                                            'sales_amount': quan,
                                            'item_incoterms': po_comment,
                                            'item_paycond': ao_name,
                                            'item_pancond_kr': ao_name_kr
                                        }));
                                    }
                                    // 사전에 제품이 추가가 되지 않았을 떄
                                    if (store_cnt === 0) {
                                        gu.getCmp('po_total').setValue(sales_amount_total_disp);
                                        gu.getCmp('po_price').setValue(sales_price_total_disp);
                                        gu.getCmp('po_currency').setValue(currency_abst);
                                    } else {
                                        var previous_store = store.data.items;
                                        var total_quan = 0.0;
                                        var total_price = 0.0;
                                        for (var j = 0; j < previous_store.length; j++) {
                                            var item = previous_store[j];
                                            console_logs('sales_amount_????', Number(item.get('sales_amount')));
                                            console_logs('sales_price_????', Number(item.get('sales_price')));
                                            total_quan = Number(total_quan) + Number(item.get('sales_amount'));
                                            total_price = Number(total_price) + (Number(item.get('sales_price')) * Number(item.get('sales_amount')));
                                        }
                                        console_logs('??????????', total_quan);
                                        console_logs('>|>|>|>|>|>', total_price);
                                        gu.getCmp('po_total').setValue(total_quan);
                                        gu.getCmp('po_price').setValue(total_price);
                                        gu.getCmp('po_currency').setValue(currency_abst);
                                    }
                                    winProduct.setLoading(false);
                                    winProduct.close();
                                } else {
                                    Ext.MessageBox.alert('알림', '저장목록에 저장된 내역이 없습니다.');
                                    winProduct.setLoading(false);
                                    return;
                                }
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

        var store = gm.me().searchProductStore;
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
                Ext.MessageBox.alert('알림', '목형를 지정해주세요.');
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

    loding_msg: function () {
        Ext.MessageBox.wait('데이터를 처리중입니다.<br>잠시만 기다려주세요.', '알림');
    },

    stop_msg: function () {
        Ext.MessageBox.hide();
    },


    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchExepOrderStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),

    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    PmUserStore: Ext.create('Mplm.store.UserStore', {}),
    payTermsStore: Ext.create('Mplm.store.PaytermStore', {}),
    incotermsStore: Ext.create('Mplm.store.IncotermsStore', {}),
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_NEW_DIVISION'}),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_CONDITION'}),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_TYPE'}),
    searchPrdStore: Ext.create('Mplm.store.MaterialSearchStore', {type: 'PRD'}),
    searchAssyStore: Ext.create('Mplm.store.MaterialSearchStore', {type: 'ASSY'}),
    searchItemStore: Ext.create('Mplm.store.ProductStore', {}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SAMPLE_TYPE'}),

    searchProductStore: Ext.create('Mplm.store.ProductForMoldStore', {}),
    rackStore: Ext.create('Rfx.store.RackSelectStore', {}),
    stores: [],
    ingredientList: [],
    storecount: 0,
    // gridContent2: null,
    fields: []
});



