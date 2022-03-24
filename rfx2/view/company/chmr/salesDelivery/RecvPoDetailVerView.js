Ext.define('Rfx2.view.company.chmr.salesDelivery.RecvPoDetailVerView', {
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

        this.addSearchField({
            type: 'checkbox',
            field_id: 'isPreInput',
            items: [
                {
                    boxLabel: '선투입만 확인',
                    checked: false
                },
            ],
        });
        this.addSearchField({
            // type: 'combo',
            field_id: 'year',
            emptyText: '연도'
            , store: 'YearStore'
            , displayField: 'view'
            , valueField: 'year'
            , innerTpl: '{view}'
        });
        this.addSearchField('company_name_nation_code');
        this.addSearchField('pj_name');
        this.addSearchField('reserved_varchard');
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
                case 1: case 2: case 3: case 4:
                    buttonToolbar.items.remove(item);
                    break;
                default:
                    break;
            }
        });

        this.addCombst = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-plus',
            text: '고객사 추가',
            disabled: false,
            handler: function (widget, event) {
                var form = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    frame: false,
                    border: false,
                    autoScroll: true,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'vbox',
                    width: 500,
                    height: 500,
                    items: [
                        {
                            xtype: 'container',
                            width: '100%',
                            defaults: {
                                width: '99%',
                                padding: '1 2 2 10'
                            },
                            border: true,
                            layout: 'vbox',
                            items: [
                                {
                                    fieldLabel: '회사명',
                                    xtype: 'textfield',
                                    name: 'wa_name',
                                    allowBlank: false,
                                    // fieldStyle: 'background-color: #ddd; background-image: none;',
                                    id: gu.id('wa_name'),
                                    // editable: false,
                                    // value: selection.get('wa_name')
                                },
                                {
                                    fieldLabel: '사업자번호',
                                    xtype: 'textfield',
                                    name: 'biz_no',
                                    allowBlank: true,
                                    // fieldStyle: 'background-color: #ddd; background-image: none;',
                                    id: gu.id('biz_no'),
                                    // editable: false,
                                    // value: selection.get('item_name') + ' / ' + selection.get('concat_spec_desc') 
                                },
                                {
                                    fieldLabel: '대표자',
                                    xtype: 'textfield',
                                    name: 'president_name',
                                    allowBlank: true,
                                    // fieldStyle: 'background-color: #ddd; background-image: none;',
                                    id: gu.id('president_name'),
                                    // editable: false,
                                    // value: selection.get('item_name') + ' / ' + selection.get('concat_spec_desc') 
                                },
                                {
                                    fieldLabel: '본사주소',
                                    xtype: 'textfield',
                                    name: 'address_1',
                                    allowBlank: true,
                                    // fieldStyle: 'background-color: #ddd; background-image: none;',
                                    id: gu.id('line_code'),
                                    // editable: false,
                                    // value: selection.get('item_name') + ' / ' + selection.get('concat_spec_desc') 
                                },
                                {
                                    fieldLabel: '업태',
                                    xtype: 'textfield',
                                    name: 'biz_condition',
                                    allowBlank: true,
                                    // fieldStyle: 'background-color: #ddd; background-image: none;',
                                    id: gu.id('biz_condition'),
                                    // editable: false,
                                    // value: selection.get('item_name') + ' / ' + selection.get('concat_spec_desc') 
                                },
                                {
                                    fieldLabel: '종목',
                                    xtype: 'textfield',
                                    name: 'biz_type',
                                    allowBlank: true ,
                                    // fieldStyle: 'background-color: #ddd; background-image: none;',
                                    id: gu.id('biz_type'),
                                    // editable: false,
                                    // value: selection.get('item_name') + ' / ' + selection.get('concat_spec_desc') 
                                },
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '고객사 추가',
                    width: 550,
                    height: 300,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            handler: function (btn) {
                                if (btn == 'no') {
                                    prWin.close();
                                } else {
                                    if (form.isValid()) {
                                        var val = form.getValues(false);
                                        form.submit({
                                            submitEmptyText: false,
                                            url: CONTEXT_PATH + '/sales/buyer.do?method=addCombstManual',
                                            waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',

                                            success: function (val, action) {
                                                console_logs('OK', 'PROCESS OK');
                                                if (prWin) {
                                                    Ext.MessageBox.alert('확인', '등록 되었습니다.');
                                                    prWin.close();
                                                    // gm.me().combstStore.getProxy().setExtraParam('wa_name',  val['wa_name']);
                                                    gm.me().combstStore.load();
                                                    // gu.getCmp('wa_name_search').setValue( val['wa_name']);
                                                }
                                            },
                                            failure: function () {
                                                // console_logs('결과 ???', action);
                                                prWin.setLoading(false);
                                                // Ext.MessageBox.alert('에러', '데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.');
                                                // if (prWin) {
                                                //     prWin.close();
                                                // }
                                            }
                                        });
                                    }

                                }
                            }
                        },
                        {
                            text: CMD_CANCEL,
                            scope: this,
                            handler: function () {

                                if (prWin) {
                                    prWin.close();
                                }

                            }
                        }
                    ]
                });


                prWin.show();
            }
        });

        this.addPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: this.getMC('mes_order_recv_btn', '수주등록'),
            tooltip: this.getMC('mes_order_recv_btn_msg', '수주등록'),
            disable: true,
            handler: function () {
                // gm.me().payTermsStore.load();
                // gm.me().incotermsStore.load();

                // 첨부파일 임시 파일업로드 그룹코드 지정을 위한 랜덤 문자를 생성.
                var ranNum = gm.me().tempoaryFileGroupcode(10000000000000, 20000000000000);
                console_logs('랜덤파일코드 생성여부 확인???', ranNum);
                // gm.me().combstStore.getProxy().setExtraParam('pr_active_flag_final','Y|E');
                gm.me().combstStore.getProxy().setExtraParam('pr_active_flag', 'Y');

                var productGrid = Ext.create('Ext.grid.Panel', {
                    store: new Ext.data.Store(),
                    cls: 'rfx-panel',
                    id: gu.id('productGrid'),
                    collapsible: false,
                    multiSelect: false,
                    width: 1150,
                    // overflowY: 'scroll',
                    margin: '0 0 20 0',
                    autoHeight: true,
                    frame: false,
                    border: true,
                    // layout: 'fit',
                    forceFit: true,
                    columns: [
                        // {
                        //     text: gm.me().getMC('msg_order_grid_prd_fam', gm.getMC('CMD_Product', '제품군')),
                        //     width: '10%',
                        //     dataIndex: 'class_name',
                        //     style: 'text-align:center',
                        //     sortable: false
                        // },
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

                        {
                            text: gm.me().getMC('msg_order_grid_quan_desc', '수량'),
                            width: '10%',
                            dataIndex: 'sales_amount',
                            editor: 'numberfield',
                            style: 'text-align:center',
                            align: 'right',
                            css: 'edit-cell',
                            sortable: false,
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'sales_amount') {
                                    context.record.set('sales_amount', Ext.util.Format.number(value, '0,00/i'));
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        },
                        {
                            text: '단위',
                            width: '8%',
                            dataIndex: 'reserved_varchar9',
                            style: 'text-align:center',
                            // editor: 'textfield',
                            sortable: false
                        },
                        {
                            text: gm.me().getMC('msg_order_grid_quan_desc', '단가'),
                            width: '10%',
                            // decimalPrecision: 5,
                            dataIndex: 'sales_price',
                            editor: 'numberfield',
                            style: 'text-align:center',
                            align: 'right',
                            // editor: 'numberfield',
                            sortable: false,
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'sales_price') {
                                    context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                                }
                                if (value == null || value.length < 1) {
                                    value = 0;
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        },
                        {
                            text: gm.me().getMC('msg_order_grid_prd_delivery_date', '납기일'),
                            width: '20%',
                            dataIndex: 'delivery_plan',
                            style: 'text-align:center',
                            css: 'edit-cell',
                            editor: {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                listeners: {
                                    change: function (field, e) {

                                        var delivery_plan = new Date(field.value);

                                        field.value = delivery_plan.setHours(delivery_plan.getHours() + 9);
                                        //code to set short name cell value.
                                    }
                                }

                            },
                            format: 'Y-m-d',
                            dateFormat: 'Y-m-d',
                            sortable: false,

                            renderer: Ext.util.Format.dateRenderer('Y-m-d')
                        },
                        // {
                        //     text: '기타사항',
                        //     width: '8%',
                        //     dataIndex: 'reserved_varcharg',
                        //     style: 'text-align:center',
                        //     // editor: 'textfield',
                        //     sortable: false
                        // },
                        {
                            text: '비고',
                            width: '20%',
                            css: 'edit-cell',
                            dataIndex: 'item_comment',
                            style: 'text-align:center',
                            editor: 'textfield',
                            sortable: false
                        },
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
                                console_logs('sales_amount_EDIT', Number(item.get('sales_amount')));
                                console_logs('sales_price_EIDT', Number(item.get('sales_price')));
                                total_quan = Number(total_quan) + Number(item.get('sales_amount'));
                                total_price = Number(total_price) + (Number(item.get('sales_price')) * Number(item.get('sales_amount')));
                            }
                            gu.getCmp('po_total').setValue(total_quan);
                            gu.getCmp('po_price').setValue(total_price);
                        }
                    },
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
                                    text: CMD_DELETE,
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
                    // overflowY: 'scroll',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('msg_order_dia_header_title', '공통정보'),
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

                                        {
                                            fieldLabel: '고객사 ',
                                            xtype: 'hiddenfield',
                                            anchor: '100%',
                                            width: '99%',
                                            id: gu.id('order_com_unique'),
                                            name: 'order_com_unique',
                                            allowBlank: true,
                                        },
                                        {
                                            items: [{
                                                xtype: 'fieldcontainer',
                                                fieldLabel: '고객사',
                                                anchor: '99%',
                                                width: '99%',
                                                padding: '0 0 0px 30px',
                                                // height: '10%',
                                                layout: 'hbox',
                                                defaults: {
                                                    margin: '2 2 2 2'
                                                },
                                                // default: {
                                                //     flex: 1
                                                // },
                                                items: [
                                                    {
                                                        id: gu.id('company_name'),
                                                        name: 'company_name',
                                                        // fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객명'),
                                                        allowBlank: true,
                                                        xtype: 'textfield',
                                                        width: 300,
                                                        editable: false,
                                                        // padding: '0 0 5px 30px',
                                                        fieldStyle: 'background-color: #FFFCCC;',
                                                        // store: gm.me().combstStore,
                                                        emptyText: '우측버튼을 클릭하여 고객사를 선택 후 입력.',
                                                        displayField: 'wa_name',
                                                        valueField: 'unique_id',
                                                        sortInfo: { field: 'wa_name', direction: 'ASC' },
                                                        typeAhead: false,
                                                        minChars: 1,
                                                        listConfig: {
                                                            loadingText: 'Searching...',
                                                            emptyText: 'No matching posts found.',
                                                            getInnerTpl: function () {
                                                                return '<div data-qtip="{unique_id}">{wa_name} / {president_name} ({biz_no})</div>';
                                                            }
                                                        },
                                                        listeners: {
                                                            change: function (combo, record) {
                                                                // var buyer = gu.getCmp('order_com_unique').getValue();
                                                                // console_logs('>>> buyer', buyer);
                                                                // gu.getCmp('customer_name').setValue(buyer);
                                                            }// endofselect
                                                        }
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        text: '클릭하여 선택',
                                                        width: 100,
                                                        // margin: '0 10 10 380',
                                                        scale: 'small',
                                                        handler: function () {
                                                            gm.me().selectCombst();
                                                        }
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        id: 'reserved_varchard',
                                                        name: 'reserved_varchard',
                                                        margin: '0 10 10 30',
                                                        width: 510,
                                                        allowBlank: true,
                                                        fieldLabel: gm.me().getMC('msg_order_dia_order_po_no', '납품 요구번호'),
                                                    },
                                                ]
                                            }]
                                        },
                                        // {
                                        //     id: gu.id('order_com_unique'),
                                        //     name: 'order_com_unique',
                                        //     fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객명'),
                                        //     allowBlank: true,
                                        //     xtype: 'combo',
                                        //     width: '45%',
                                        //     padding: '0 0 5px 30px',
                                        //     fieldStyle: 'background-image: none;',
                                        //     store: gm.me().combstStore,
                                        //     emptyText: gm.me().getMC('msg_order_dia_prd_empty_msg', '선택해주세요'),
                                        //     displayField: 'wa_name',
                                        //     valueField: 'unique_id',
                                        //     sortInfo: { field: 'wa_name', direction: 'ASC' },
                                        //     typeAhead: false,
                                        //     minChars: 1,
                                        //     listConfig: {
                                        //         loadingText: 'Searching...',
                                        //         emptyText: 'No matching posts found.',
                                        //         getInnerTpl: function () {
                                        //             return '<div data-qtip="{unique_id}">{wa_name} / {president_name} ({biz_no})</div>';
                                        //         }
                                        //     },
                                        //     listeners: {
                                        //         change: function (combo, record) {
                                        //             var buyer = gu.getCmp('order_com_unique').getValue();
                                        //             console_logs('>>> buyer', buyer);
                                        //             gu.getCmp('customer_name').setValue(buyer);
                                        //             // gu.getCmp('final_order_com_unique').setValue(gu.getCmp('order_com_unique').getValue());
                                        //             // Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
                                        //         }// endofselect
                                        //     }
                                        // },

                                        // {
                                        //     xtype: 'textfield',
                                        //     id: 'reserved_varchard',
                                        //     name: 'reserved_varchard',
                                        //     padding: '0 0 5px 30px',
                                        //     width: '45%',
                                        //     allowBlank: true,
                                        //     fieldLabel: gm.me().getMC('msg_order_dia_order_po_no', '납품 요구번호'),
                                        // },
                                        {
                                            xtype: 'textfield',
                                            id: 'pj_name',
                                            name: 'pj_name',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            fieldLabel: gm.me().getMC('msg_order_dia_order_po_no', '사업명'),
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'po_date',
                                            name: 'po_date',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            fieldLabel: '납품 요구일자',
                                            format: 'Y-m-d',
                                            value: new Date()
                                        },

                                        {
                                            xtype: 'textfield',
                                            id: 'reserved_varchari',
                                            name: 'reserved_varchari',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            fieldLabel: '담당자/연락처',
                                        },

                                        {
                                            id: gu.id('route_code'),
                                            name: 'route_code',
                                            fieldLabel: ('관급/사급'),
                                            allowBlank: false,
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().routeCodeStore,
                                            emptyText: gm.me().getMC('msg_order_dia_prd_empty_msg', '선택해주세요'),
                                            displayField: 'display',
                                            valueField: 'value',
                                            sortInfo: { field: 'wa_name', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{value}">{display}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    // gu.getCmp('final_order_com_unique').setValue(gu.getCmp('order_com_unique').getValue());
                                                    // Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
                                                }// endofselect
                                            }
                                        },
                                        {
                                            fieldLabel: '납기일 ',
                                            xtype: 'datefield',
                                            //anchor: '100%',\
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            name: 'reserved_timestamp3',
                                            format: 'Y-m-d',
                                            allowBlank: false,
                                            //value: new Date(),
                                            id: gu.id('delivery_dates')
                                        },
                                        {
                                            fieldLabel: '업체명 ',
                                            xtype: 'textfield',
                                            //anchor: '100%',\
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            name: 'reserved_varchar1',
                                            format: 'Y-m-d',
                                            allowBlank: true,
                                            //value: new Date(),
                                            id: gu.id('reserved_varchar1')
                                        },
                                        {
                                            xtype: 'checkbox',
                                            padding: '0 0 5px 30px',
                                            name: 'is_already_out',
                                            id: gu.id('is_already_out'),
                                            fieldLabel: '선투입여부',
                                            name: 'is_aleady_out',
                                            checked: false
                                        },

                                    ]
                                },

                            ]
                        },
                        {
                            xtype: 'fieldset',
                            frame: true,
                            // overflowY: 'scroll',
                            title: gm.me().getMC('msg_order_dia_prd_header_title', '제품정보'),
                            width: '100%',
                            height: '100%',
                            layout: 'fit',
                            bodyPadding: 10,
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

                                            fieldLabel: gm.me().getMC('msg_order_dia_prd_total_quan', '총계수량'),
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
                                            fieldLabel: gm.me().getMC('msg_order_dia_prd_total_price', '금액'),
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
                                    ]

                                }
                            ]
                        },
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_recv_btn', '수주등록'),
                    width: 1200,
                    height: 650,
                    plain: true,
                    items: form,
                    overflowY: 'scroll',
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
                                    var storeData = gu.getCmp('productGrid').getStore();
                                    var objs = [];
                                    for (var j = 0; j < storeData.data.items.length; j++) {
                                        var item = storeData.data.items[j];
                                        var objv = {};
                                        //objv['srcahd_uid'] = item.get('unique_id');
                                        objv['srcahd_uid'] = item.get('srcahd_uid');
                                        objv['reserved_varcharg'] = item.get('reserved_varcharg');
                                        objv['sales_price'] = item.get('sales_price');
                                        objv['reserved_varchar8'] = item.get('reserved_varchar8');
                                        objv['reserved_varchar9'] = item.get('reserved_varchar9');
                                        objv['delivery_plan'] = item.get('delivery_plan');
                                        objv['sales_amount'] = item.get('sales_amount');
                                        objv['item_comment'] = item.get('item_comment');
                                        objv['item_paycond'] = item.get('item_pancond_kr');
                                        objv['reserved1'] = item.get('reserved1');
                                        objs.push(objv);
                                    }
                                    var jsonData = Ext.util.JSON.encode(objs);
                                    var is_already_check = gu.getCmp('is_already_out').getValue();

                                    var ap_finish = '';

                                    if (is_already_check === true) {
                                        ap_finish = 'Y';
                                    }
                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=addRecvPoMultiVer',
                                        waitMsg: '데이터를 저장중입니다.',
                                        params: {
                                            productJson: jsonData,
                                            tempFileNum: ranNum,
                                            ap_finish: ap_finish
                                        },
                                        success: function (val, action) {
                                            if (win) {
                                                win.close();
                                            }
                                            Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                            gm.me().store.load();
                                        },
                                        failure: function (val, action) {
                                            if (win) {
                                                console_log('failure');
                                                // Ext.MessageBox.alert(error_msg_prompt, '부적절한 값이 들어갔거나 필수 입력 항목값이 입력되지 않았습니다.');
                                                win.close();
                                            }
                                        }
                                    });

                                    // form.submit({
                                    //     submitEmptyText: false,
                                    //     url: CONTEXT_PATH + '/sales/buyer.do?method=addRecvPoMultiVer',
                                    //     params: {
                                    //         productJson: jsonData,
                                    //         tempFileNum: ranNum
                                    //     },
                                    //     success: function (val, action) {
                                    //         console_logs('val >>>>', val);
                                    //         win.setLoading(false);
                                    //         gm.me().store.load();
                                    //         win.close();
                                    //     },
                                    //     failure: function () {
                                    //         win.setLoading(false);
                                    //         // extjsUtil.failureMessage();
                                    //     }
                                    // });
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
            text: this.getMC('mes_order_edit_btn', '수주수정'),
            tooltip: this.getMC('mes_order_edit_btn_msg', '수주수정'),
            disabled: true,
            handler: function () {
                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                // var sloastUid = select.get('unique_uid');
                var projectUid = select.get('unique_uid');
                gm.me().ProjectTypeStore.load();
                // gm.me().combstStore.getProxy().setExtraParam('pr_active_flag_final','Y|E');
                // gm.me().combstStore.getProxy().setExtraParam('pr_active_flag', 'Y');
                gm.me().combstStore.load();
                gm.me().payTermsStore.load();
                gm.me().ynFlagStore.load();
                gm.me().routeCodeStore.load();
                //gm.me().incotermsStore.load();
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
                                        {
                                            id: gu.id('order_com_unique'),
                                            name: 'order_com_unique',
                                            fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객명'),
                                            allowBlank: false,
                                            editable: true,
                                            readOnly: false,
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            // fieldStyle: 'background-color: #ddd; background-image: none;',
                                            store: gm.me().combstStore,
                                            emptyText: gm.me().getMC('msg_order_dia_prd_empty_msg', '선택해주세요'),
                                            displayField: 'wa_name',
                                            valueField: 'unique_id',
                                            value: select.get('order_com_unique'),
                                            typeAhead: false,
                                            sortInfo: { field: 'wa_name', direction: 'ASC' },
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
                                                    // gu.getCmp('final_order_com_unique').setValue(gu.getCmp('order_com_unique').getValue());
                                                    // Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
                                                }// endofselect
                                            }
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'reserved_varchard',
                                            name: 'reserved_varchard',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            value: select.get('reserved_varchard'),
                                            fieldLabel: ('납품 요구번호')
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'pj_name',
                                            name: 'pj_name',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            value: select.get('pj_name'),
                                            fieldLabel: gm.me().getMC('msg_order_dia_order_po_no', '사업명'),
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
                                            fieldLabel: '납품 요구일자',
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'reserved_varchari',
                                            name: 'reserved_varchari',
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            allowBlank: true,
                                            value: select.get('reserved_varchari'),
                                            fieldLabel: '담당자/연락처',
                                        },
                                        {
                                            id: gu.id('route_code'),
                                            name: 'route_code',
                                            fieldLabel: ('관급/사급'),
                                            allowBlank: false,
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().routeCodeStore,
                                            value: select.get('route_code'),
                                            emptyText: gm.me().getMC('msg_order_dia_prd_empty_msg', '선택해주세요'),
                                            displayField: 'display',
                                            valueField: 'value',
                                            sortInfo: { field: 'wa_name', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{value}">{display}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    // gu.getCmp('final_order_com_unique').setValue(gu.getCmp('order_com_unique').getValue());
                                                    // Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
                                                }// endofselect
                                            }
                                        },
                                        {
                                            fieldLabel: '납기일 ',
                                            xtype: 'datefield',
                                            //anchor: '100%',\
                                            padding: '0 0 5px 30px',
                                            width: '45%',
                                            name: 'delivery_plan',
                                            format: 'Y-m-d',
                                            allowBlank: false,
                                            value: select.get('delivery_plan_str'),
                                            //value: new Date(),
                                        },
                                        {
                                            id: gu.id('is_def'),
                                            name: 'is_def',
                                            fieldLabel: ('선투입여부'),
                                            allowBlank: false,
                                            xtype: 'combo',
                                            width: '45%',
                                            padding: '0 0 5px 30px',
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().ynFlagStore,
                                            value: select.get('is_def'),
                                            emptyText: gm.me().getMC('msg_order_dia_prd_empty_msg', '선택해주세요'),
                                            displayField: 'code_name_kr',
                                            valueField: 'system_code',
                                            sortInfo: { field: 'wa_name', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    // gu.getCmp('final_order_com_unique').setValue(gu.getCmp('order_com_unique').getValue());
                                                    // Ext.getCmp('reserved_varchar3').setValue(record.get('address_1'));
                                                }// endofselect
                                            }
                                        },

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
                                        //     xtype: 'textfield',
                                        //     id: 'reserved_varcharj',
                                        //     name: 'reserved_varcharj',
                                        //     padding: '0 0 5px 30px',
                                        //     width: '45%',
                                        //     allowBlank: true,
                                        //     fieldLabel: '업체명',
                                        // },
                                        // {
                                        //     xtype: 'textfield',
                                        //     id: 'reserved_varchark',
                                        //     name: 'reserved_varchark',
                                        //     padding: '0 0 5px 30px',
                                        //     width: '45%',
                                        //     allowBlank: true,
                                        //     fieldLabel: '비고',
                                        // },
                                        // {
                                        //     xtype: 'datefield',
                                        //     id: 'date2',
                                        //     maxValue: new Date(),
                                        //     handler: function(picker, date) {
                                        //         processRequest();
                                        //     }
                                        // }
                                    ]
                                },

                            ]
                        },

                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_edit_btn', '수주수정'),
                    width: 650,
                    height: 260,
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
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=modifyRecvPoSingleVer',
                                        params: {
                                            // assymapUid: sloastUid,
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
                                    Ext.MessageBox.alert('알림', '필수 입력 정보가 입력되지 않았습니다.<br>다시 확인해주세요.');
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

        this.completeAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: this.getMC('mes_order_confirm', '수주확정'),
            tooltip: this.getMC('mes_order_order_confirm_btn_msg', '수주확정')/**'수주확정 및 설계요청'**/,
            disabled: true,
            handler: function () {
                //  gMain.selPanel.doRequestProduce();
                Ext.MessageBox.show({
                    title: gm.me().getMC('mes_order_confirm', '수주확정'),
                    msg: gm.me().getMC('msg_btn_prd_confirm_msg', '수주확정을 하시겠습니까?'),
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().confirmPjAndGoPrd,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.changeGoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '관급변경',
            tooltip: '관급변경'/**'수주확정 및 설계요청'**/,
            disabled: true,
            handler: function () {
                //  gMain.selPanel.doRequestProduce();
                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                var route_code = select.get('route_code');
                if (route_code === 'GO') {
                    var is_complished = select.get('project_complished');
                    if (is_complished === 'G') {
                        Ext.MessageBox.alert('알림', '이미 변경처리 되었습니다.');
                    } else {
                        Ext.MessageBox.show({
                            title: '관급변경',
                            msg: '관급변경을 실행하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            fn: gm.me().changeGo,
                            icon: Ext.MessageBox.QUESTION
                        });
                    }

                } else {
                    Ext.MessageBox.alert('알림', '해당 기능은 등록 수주가 관급인 경우에만 실행할 수 있습니다.')
                }

            }
        });

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            itemId: 'fileattachAction',
            disabled: true,
            text: this.getMC('mes_order_file_btn', '파일다운로드'),
            handler: function (widget, event) {
                gm.me().attachFile();
            }
        });

        this.excelUploadAction = Ext.create('Ext.Action', {
            iconCls: 'af-upload-white',
            disabled: true,
            text: '파일업로드',
            tooltip: this.getMC('수주등록시 필요문서를 일괄 업로드 합니다.'),
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
        this.createStore('Rfx2.model.company.bioprotech.RecvVerPo', [{
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
            var c = record.get('project_complished');
            var def = record.get('is_def');
            console_logs('>>>> c', c);
            switch (c) {
                case 'N':
                    if (def === 'Y') {
                        return 'green-row';
                        break;
                    } else {
                        return 'white-row';
                        break;
                    }
                case 'C':
                    if (def === 'Y') {
                        return 'green-row';
                        break;
                    } else {
                        return 'blue-row';
                        break;
                    }

                case 'A':
                    if (def === 'Y') {
                        return 'green-row';
                        break;
                    } else {
                        return 'yellow-row';
                        break;
                    }
                case 'G':
                    if (def === 'Y') {
                        return 'green-row';
                        break;
                    } else {
                        return 'red-row';
                        break;
                    }
                default:
                    if (def === 'Y') {
                        return 'green-row';
                        break;
                    } else {
                        return 'white-row';
                        break;
                    }

            }
        });

        buttonToolbar.insert(1, this.addPoAction);
        buttonToolbar.insert(2, this.editPoAction);
        buttonToolbar.insert(2, this.changeGoAction);
        // buttonToolbar.insert(3, this.excelUploadAction);
        // buttonToolbar.insert(4, this.fileattachAction);
        // buttonToolbar.insert(3, this.completeAction);

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        // this.salesPriceListStore = Ext.create('Rfx2.store.company.bioprotech.SalesPriceListStore', {});
        this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdDetailOrderVerStore', {});

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
                    width: 1150,
                    autoScroll: true,
                    margin: '0 0 20 0',
                    autoHeight: true,
                    frame: false,
                    border: true,
                    layout: 'fit',
                    forceFit: true,
                    columns: [
                        // {
                        //     text: gm.me().getMC('msg_order_grid_prd_fam', gm.getMC('CMD_Product', '제품군')),
                        //     width: '10%',
                        //     dataIndex: 'class_name',
                        //     style: 'text-align:center',
                        //     sortable: false
                        // },
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
                            dataIndex: 'description',
                            style: 'text-align:center',
                            sortable: false
                        },
                        // {
                        //     text: 'Site',
                        //     width: '8%',
                        //     dataIndex: 'reserved_varcharg',
                        //     style: 'text-align:center',
                        //     // editor: 'textfield',
                        //     sortable: false
                        // },
                        {
                            text: '단위',
                            width: '8%',
                            dataIndex: 'reserved_varchar9',
                            style: 'text-align:center',
                            // editor: 'textfield',
                            sortable: false
                        },
                        {
                            text: gm.me().getMC('msg_order_grid_quan_desc', '수량'),
                            width: '10%',
                            dataIndex: 'sales_amount',
                            editor: 'numberfield',
                            style: 'text-align:center',
                            align: 'right',
                            css: 'edit-cell',
                            sortable: false,
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'sales_amount') {
                                    context.record.set('sales_amount', Ext.util.Format.number(value, '0,00/i'));
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        },

                        {
                            text: gm.me().getMC('msg_order_grid_quan_desc', '단가'),
                            width: '10%',
                            decimalPrecision: 5,
                            dataIndex: 'sales_price',
                            style: 'text-align:center',
                            align: 'right',
                            // editor: 'numberfield',
                            sortable: false,
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'sales_price') {
                                    context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                                }
                                if (value == null || value.length < 1) {
                                    value = 0;
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        },
                        // {
                        //     text: gm.me().getMC('msg_order_grid_quan_desc', '공급가액'),
                        //     width: '10%',
                        //     decimalPrecision: 5,
                        //     dataIndex: 'sales_price2',
                        //     style: 'text-align:center',
                        //     align: 'right',
                        //     // editor: 'numberfield',
                        //     sortable: false,
                        //     renderer: function (value, context, tmeta) {
                        //         if (context.field == 'sales_price') {
                        //             context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                        //         }
                        //         if (value == null || value.length < 1) {
                        //             value = 0;
                        //         }
                        //         return Ext.util.Format.number(value, '0,00/i');
                        //     },
                        // },
                        // {
                        //     text: gm.me().getMC('msg_order_grid_prd_currency', '세액'),
                        //     width: '8%',
                        //     dataIndex: 'reserved_varchar8',
                        //     style: 'text-align:center',
                        //     // editor: 'textfield',
                        //     sortable: false
                        // },
                        {
                            text: gm.me().getMC('msg_order_grid_prd_delivery_date', '납기일'),
                            width: '20%',
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

                            renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                        },

                        // {
                        //     text: gm.me().getMC('msg_order_grid_prd_pay_terms', '결제방법'),
                        //     width: '35%',
                        //     css: 'edit-cell',
                        //     dataIndex: 'item_pancond_kr',
                        //     style: 'text-align:center',
                        //     editor: {
                        //         xtype: 'combobox',
                        //         id: gu.id('item_paycond_combo'),
                        //         displayField: 'codeName',
                        //         editable: false,
                        //         forceSelection: true,
                        //         // mode: 'local',
                        //         store: gm.me().payTermsStore,
                        //         triggerAction: 'all',
                        //         valueField: 'codeName'
                        //     },
                        //     sortable: false
                        // },
                        // {
                        //     text: '기타사항',
                        //     width: '8%',
                        //     dataIndex: 'reserved_varcharg',
                        //     style: 'text-align:center',
                        //     // editor: 'textfield',
                        //     sortable: false
                        // },
                        {
                            text: '비고',
                            width: '20%',
                            css: 'edit-cell',
                            dataIndex: 'item_comment',
                            style: 'text-align:center',
                            editor: 'textfield',
                            sortable: false
                        },
                    ],
                    selModel: 'cellmodel',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    listeners: {
                        edit: function (editor, e, eOpts) {
                            var store = gu.getCmp('productGridExtra').getStore();
                            var previous_store = store.data.items;
                            var total_quan = 0.0;
                            var total_price = 0.0;
                            console_logs('All Store Contents ??? ', previous_store);
                            for (var j = 0; j < previous_store.length; j++) {
                                var item = previous_store[j];
                                console_logs('sales_amount_EDIT', Number(item.get('sales_amount')));
                                console_logs('sales_price_EIDT', Number(item.get('sales_price')));
                                total_quan = Number(total_quan) + Number(item.get('sales_amount'));
                                total_price = Number(total_price) + (Number(item.get('sales_price')) * Number(item.get('sales_amount')));
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
                                productGridExtra,
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
                                            fieldLabel: gm.me().getMC('msg_order_dia_prd_total_quan', '총계수량'),
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
                                            fieldLabel: gm.me().getMC('msg_order_dia_prd_total_price', '금액'),
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
                                        // {
                                        //     fieldLabel: gm.me().getMC('msg_order_grid_prd_currency', '통화'),
                                        //     xtype: 'textfield',
                                        //     width: '20%',
                                        //     labelAlign: 'right',
                                        //     fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: left',
                                        //     editable: false,
                                        //     decimalPrecision: 5,
                                        //     value: '',
                                        //     hideTrigger: true,
                                        //     keyNavEnabled: false,
                                        //     mouseWheelEnabled: false,
                                        //     id: gu.id('po_currency'),
                                        // }
                                    ]

                                }
                            ]
                        },
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('msg_btn_prd_extra_add', '추가 제품등록'),
                    width: 1200,
                    height: 500,
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
                                    var storeData = gu.getCmp('productGridExtra').getStore();
                                    var objs = [];
                                    for (var j = 0; j < storeData.data.items.length; j++) {
                                        var item = storeData.data.items[j];
                                        var objv = {};
                                        //objv['srcahd_uid'] = item.get('unique_id');
                                        objv['srcahd_uid'] = item.get('srcahd_uid');
                                        objv['reserved_varcharg'] = item.get('reserved_varcharg');
                                        objv['sales_price'] = item.get('sales_price');
                                        objv['reserved_varchar8'] = item.get('reserved_varchar8');
                                        objv['reserved_varchar9'] = item.get('reserved_varchar9');
                                        objv['delivery_plan'] = item.get('delivery_plan');
                                        objv['sales_amount'] = item.get('sales_amount');
                                        objv['item_comment'] = item.get('item_comment');
                                        //objv['item_incoterms'] = item.get('item_incoterms');
                                        objv['item_paycond'] = item.get('item_pancond_kr');
                                        objs.push(objv);
                                    }
                                    var jsonData = Ext.util.JSON.encode(objs);
                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=addRecvPoPrdAddVer',
                                        params: {
                                            productJsonExtra: jsonData,
                                            // parent: parent,
                                            // parent_uid: parent_uid,
                                            pj_uid: pj_uid
                                        },
                                        success: function (val, action) {
                                            win.setLoading(false);
                                            gm.me().store.load();
                                            gm.me().poPrdDetailStore.load();
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                        }
                                    });
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

        this.deliveryPlanAssign = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '출하예정등록',
            tooltip: '출하예정등록',
            disabled: true,
            handler: function () {

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
                            title: gm.me().getMC('mes_order_edit_btn', '납기예정일을 지정해주세요.'),
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
                                            fieldLabel: '납기예정일',
                                            xtype: 'datefield',
                                            id: gu.id('delivery_req_date'),
                                            padding: '0 0 5px 30px',
                                            width: '90%',
                                            name: 'delivery_req_date',
                                            format: 'Y-m-d',
                                            allowBlank: false,
                                            value: new Date(),
                                        },
                                    ]
                                },

                            ]
                        },

                    ]
                });


                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_edit_btn', '출하예정등록'),
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

                                    var sloastUids = [];
                                    var grid = gu.getCmp('gridContractCompany');
                                    var record = grid.getSelectionModel().getSelection();
                                    var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                                    var project_uid = selections.get('unique_uid');
                                    win.setLoading(true);



                                    for (var i = 0; i < record.length; i++) {
                                        var selections = record[i];
                                        if (selections.get('reserved6') === 'PDR') {
                                            Ext.MessageBox.alert('알림', '이미 요청등록 상태의 건이 존재합니다.');
                                            break;

                                        } else if (selections.get('reserved6') === 'GOC') {
                                            Ext.MessageBox.alert('알림', '관급변경 처리된 건은 요청등록이 불가능 합니다.');
                                            break;
                                        } else {
                                            sloastUids.push(selections.get('assymap_uid'));
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/sales/buyer.do?method=preDeiveryPlanRegist',
                                                params: {
                                                    unique_ids: sloastUids,
                                                    project_uid: project_uid,
                                                    delivery_req_date: gu.getCmp('delivery_req_date').getValue()
                                                },
                                                success: function (result, request) {
                                                    var resultText = result.responseText;
                                                    console_log('result:' + resultText);
                                                    gu.getCmp('gridContractCompany').getStore().load();
                                                    gm.me().store.load();
                                                    Ext.MessageBox.alert('알림', '처리되었습니다.')
                                                    win.close();
                                                },
                                                failure: extjsUtil.failureMessage
                                            });//endof ajax request
                                        }
                                    }
                                    win.setLoading(false);

                                } else {
                                    Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
                                    win.setLoading(false);
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
                            var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                            var pj_uid = selections.get('unique_uid');
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=deletePrdByPoVer',
                                params: {
                                    unique_id: record.get('assymap_uid'),
                                    pj_uid: pj_uid
                                    //parent_uid : record.get('parent_uid')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gu.getCmp('gridContractCompany').getStore().load();
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });//endof ajax request
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.cancelContract = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-reject',
            text: '계약취소',
            tooltip: '계약취소',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: gm.me().getMC('msg_btn_prd_delete_title', '계약취소'),
                    msg: gm.me().getMC('msg_btn_prd_delete_msg', '선택한 건을 계약취소하시겠습니까?'),
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {
                            var grid = gu.getCmp('gridContractCompany');
                            // var record = grid.getSelectionModel().getSelected().items[0];
                            var selections = grid.getSelectionModel().getSelection();
                            var isAction = true;
                            var sloast_uids = [];
                            var sel_item = gm.me().grid.getSelectionModel().getSelected().items[0];
                            var pj_uid = sel_item.get('unique_id_long');
                            for (var i = 0; i < selections.length; i++) {
                                var rec = selections[i];
                                console_logs('>>>> rec', rec);
                                sloast_uids.push(rec.get('assymap_uid'));
                            }

                            if (isAction == true) {

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/buyer.do?method=cancelContract',
                                    params: {
                                        sloast_uids: sloast_uids,
                                        pj_uid: pj_uid
                                    },
                                    success: function (result, request) {
                                        var resultText = result.responseText;
                                        console_log('result:' + resultText);
                                        gu.getCmp('gridContractCompany').getStore().load();
                                        gm.me().store.load();
                                    },
                                    failure: extjsUtil.failureMessage
                                });//endof ajax request

                            }
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
            multiSelect: true,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
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
                            html: this.getMC('msg_reg_prd_info_detail', '등록된 수주건을 선택하십시오.'),
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
                        this.deletePrdAction,
                        this.deliveryPlanAssign,
                        this.cancelContract
                    ]
                }
            ],
            columns: [
                { text: '상태', width: 70, style: 'text-align:center', dataIndex: 'deliveryReqYn', sortable: false },
                { text: 'No', width: 50, style: 'text-align:center', dataIndex: 'pl_no', sortable: false },
                //{ text: this.getMC('msg_order_grid_prd_fam', gm.getMC('CMD_Product', '제품군')), width: 100, style: 'text-align:center', dataIndex: 'class_code', sortable: false },
                { text: this.getMC('msg_order_grid_prd_name', '제품명'), width: 100, style: 'text-align:center', dataIndex: 'item_name', sortable: false },
                { text: this.getMC('msg_order_grid_prd_desc', '규격'), width: 150, style: 'text-align:center', dataIndex: 'concat_spec_desc', sortable: false },
                //{ text: this.getMC('msg_order_grid_prd_desc', '기준모델'), width: 100, style: 'text-align:center', dataIndex: 'description', sortable: false },
                //{ text: 'Site', width: 90, style: 'text-align:center', dataIndex: 'reserved5', sortable: false },
                {
                    text: this.getMC('msg_order_grid_quan_desc', '수량'),
                    width: 95,
                    style: 'text-align:center',
                    dataIndex: 'po_qty',
                    sortable: false,
                    align: 'right',
                    editor: 'numberfield',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sales_amount') {
                            context.record.set('sales_amount', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    listeners: {
                        change: function (component, newValue, oldValue) {
                            if (newValue < 0)
                                component.setValue(0);
                        }
                    }
                },
                //{ text: 'UNIT', width: 70, style: 'text-align:center', dataIndex: 'unit_code', sortable: false },
                {
                    text: this.getMC('msg_order_grid_prd_unitprice', '단가(원)'),
                    width: 80,
                    style: 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex: 'sales_price',
                    sortable: false,
                    align: 'right',
                    editor: 'numberfield',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sales_price') {
                            context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_order_grid_prd_unitprice', '공급가액'),
                    width: 80,
                    style: 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex: 'sales_amount',
                    sortable: false,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sales_price') {
                            context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_order_grid_prd_desc', '세액'),
                    width: 80,
                    style: 'text-align:center',
                    dataIndex: 'tax_rate',
                    sortable: false,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'tax_rate') {
                            context.record.set('tax_rate', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },

                },
                {
                    text: this.getMC('msg_order_grid_prd_desc', '합계'),
                    width: 80,
                    style: 'text-align:center',
                    dataIndex: 'total_sales_amount',
                    sortable: false,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'tax_rate') {
                            context.record.set('tax_rate', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },

                },
                //{ text: this.getMC('msg_order_grid_prd_currency', '통화'), width: 80, style: 'text-align:center', dataIndex: 'reserved4', sortable: false },
                {
                    text: this.getMC('msg_order_grid_prd_delivery_date', '납기일'), xtype: 'datecolumn', width: 90, style: 'text-align:center', dataIndex: 'reserved_timestamp1_str', sortable: false,
                    format: 'Y-m-d', editor: { xtype: 'datefield', format: 'Y-m-d' },
                },
                {
                    text: this.getMC('msg_order_grid_prd_delivery_date', '납기예정일'),
                    xtype: 'datecolumn',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'req_delivery_date_str',
                    sortable: false,
                    format: 'Y-m-d'
                },
                {
                    text: this.getMC('msg_order_grid_prd_delivery_date', '요청일자'),
                    xtype: 'datecolumn',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'by_po_date_str',
                    sortable: false,
                    format: 'Y-m-d'
                },
                // {
                //     text: this.getMC('msg_order_grid_prd_pay_terms', '결제방법'),
                //     width: 150,
                //     style: 'text-align:center',
                //     dataIndex: 'payment_condition',
                //     sortable: false,
                //     editor: {
                //         xtype: 'combobox',
                //         displayField: 'codeName',
                //         editable: false,
                //         forceSelection: true,
                //         // mode: 'local',
                //         store: this.payTermsStore,
                //         triggerAction: 'all',
                //         valueField: 'system_code'
                //     }
                // },
                { text: '비고', width: 150, style: 'text-align:center', dataIndex: 'reserved1', editor: { xtype: 'textfield' }, sortable: false },
            ],
            title: gm.getMC('CMD_Registered_product_information', '상세 리스트'),
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {
                    var columnName = e.field;
                    var tableName = 'sloast';
                    console_logs('e.record >>>>>>> ', e.record);
                    var unique_id = e.record.get('assymap_uid');
                    var ac_uid = e.record.get('pj_uid');
                    // var unique_id = e.record.getId();
                    var value = e.value;
                    if (columnName === 'payment_condition') {
                        columnName = 'reserved3';
                    }

                    if (columnName === 'reserved_timestamp1_str') {
                        columnName = 'gr_date';
                    }


                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, { type: '' });
                    gm.me().poPrdDetailStore.load();
                    var store = gm.me().poPrdDetailStore;
                    var item = store.data.items;
                    console_logs('item >>>>', item);
                    var pj_total_price = 0.0;
                    for (var i = 0; i < item.length; i++) {
                        var item_desc = item[i];
                        console_logs('>>> saler_price', item_desc.get('sales_price'));
                        console_logs('>>> saler_price', item_desc.get('po_qty'));
                        pj_total_price = pj_total_price +  Number(item_desc.get('sales_price') * item_desc.get('po_qty'));
                        // pj_total_price = Number() + (Number(sales_amount) * Number(sales_price));
                    }
                    console_logs('>>>> pj_total_price', pj_total_price);
                    // gm.me().editAssytopPrice(pj_total_price, ac_uid);
                    gm.me().editUpdateProjectPrice(pj_total_price, ac_uid);
                    gm.me().store.load();
                }
            }
        });

        Ext.each(this.gridContractCompany.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'po_qty':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'sales_price':
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
                case 'po_qty':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                        return value;
                    };
                    break;
                case 'sales_price':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                        return value;
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
                    gm.me().deliveryPlanAssign.enable();
                    gm.me().cancelContract.enable();
                } else {
                    // gm.me().addPoPrdPlus.disable();
                    gm.me().deletePrdAction.disable();
                    gm.me().deliveryPlanAssign.disable();
                    gm.me().cancelContract.disable();
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
                    width: '50%',
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

                // this.prdStore.getProxy().setExtraParam('assytop_uid', rec.get('unique_uid'));
                // this.prdStore.getProxy().setExtraParam('child_cnt', true);
                // this.prdStore.load();

                gUtil.enable(gMain.selPanel.completeAction);
                gUtil.enable(gMain.selPanel.editPoAction);
                gUtil.enable(gMain.selPanel.removeAction);
                gUtil.disable(gMain.selPanel.modifyAction);
                gUtil.enable(gMain.selPanel.fileattachAction);
                gUtil.enable(gMain.selPanel.excelUploadAction);
                gUtil.enable(gMain.selPanel.changeGoAction);

            } else {

                gUtil.disable(gMain.selPanel.completeAction);
                gUtil.disable(gMain.selPanel.editPoAction);
                gUtil.disable(gMain.selPanel.fileattachAction);
                gUtil.disable(gMain.selPanel.excelUploadAction);
                gUtil.disable(gMain.selPanel.changeGoAction);
                gm.me().addPoPrdPlus.disable();
            }

            if (selections.length) {
                var rec = selections[0];

                var pj_no = rec.get('reserved_varchar7');
                var company_name_nation_code = rec.get('company_name_nation_code');
                var specification = rec.get('specification');

                if (specification.length === 0) {
                    specification = '(규격 정보 없음)';
                }

                gu.getCmp('selectedMtrl').setHtml('[' + pj_no + '] ' + company_name_nation_code);
                //this.poPrdDetailStore.getProxy().setExtraParam('ac_uid', rec.get('ac_uid'));
                this.poPrdDetailStore.getProxy().setExtraParam('pj_uid', rec.get('id'));
                //this.poPrdDetailStore.getProxy().setExtraParam('assytop_uid', rec.get('unique_uid'));
                this.poPrdDetailStore.getProxy().setExtraParam('combst_uid', rec.get('reserved_number3'));
                this.poPrdDetailStore.load();
                // this.addContractMatAction.enable();
            } else {
                // this.addContractMatAction.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.getProxy().setExtraParam('having_not_status', 'CR,I,N,P,R,S,W,Y,DC,BR');
        this.store.getProxy().setExtraParam('not_pj_type', 'PL');
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
                var reserved_varcharb = rec.get('reserved_varcharb');
                if (reserved_varcharb == null) {
                    Ext.MessageBox.alert('알림', '거래구분이 입력되지 않았습니다.');
                    return;
                }
                /*
                * Store는 거래구분과 고객명이 입력될 떄 미리 돌아야 하며.
                * 무상샘플은 전체 제품 리스트를 나열해야 한다.
                * 정상거래와 유상샘플은 지정된 고객에 등록된 제품만 나열해야 한다.
                * */
                gm.me().searchDetailStoreOnlySrcMap.getProxy().setExtraParam('fix_type', 'SE');
                gm.me().searchDetailStoreOnlySrcMap.getProxy().setExtraParam('not_sg_code', 'MIX');

                // if (reserved_varcharb === 'N' || reserved_varcharb === 'P') {
                //     if (rec.get('order_com_unique') == null) {
                //         Ext.MessageBox.alert(gm.me().getMC('msg_message_box_alert', '알림'), gm.me().getMC('msg_message_box_poadd_alert2', '고객명이 반드시 입력되어야 합니다'));
                //         return;
                //     } else {
                //         gm.me().searchDetailStoreOnlySrcMap.getProxy().setExtraParam('srcmap_comastUid', rec.get('order_com_unique'));
                //         gm.me().searchDetailStoreOnlySrcMap.pageSize = 100;
                //         gm.me().searchDetailStoreOnlySrcMap.load();
                //     }
                // } else if (reserved_varcharb === 'F') { // 무상샘플일 경우
                //     gm.me().searchDetailStoreOnlySrcMap.getProxy().setExtraParam('srcmap_comastUid', -1);
                //     gm.me().searchDetailStoreOnlySrcMap.pageSize = 100;
                //     gm.me().searchDetailStoreOnlySrcMap.load();
                // }

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
                        //{ text: gm.me().getMC('msg_product_add_dia_div', '사업부'), flex: 0.5, style: 'text-align:center', dataIndex: 'division_code', sortable: true },
                        { text: gm.me().getMC('msg_product_add_dia_model', '품명'), flex: 1.5, style: 'text-align:center', dataIndex: 'item_name', sortable: true },
                        //{ text: gm.me().getMC('msg_order_grid_prd_desc', '기준모델'), flex: 1.0, style: 'text-align:center', dataIndex: 'description', sortable: true },
                        { text: gm.me().getMC('msg_product_add_search_field3', '규격'), flex: 1.8, style: 'text-align:center', dataIndex: 'desc_concat_spec', sortable: true },
                        {
                            text: gm.me().getMC('msg_product_add_dia_price', '판매단가'), flex: 1, align: 'right', style: 'text-align:center', dataIndex: 'sales_price', sortable: true,
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'sales_price') {
                                    context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                                }
                                if (value == null || value.length < 1) {
                                    value = 0;
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        },
                        //{ text: gm.me().getMC('msg_order_grid_prd_currency', '통화'), flex: 0.5, style: 'text-align:center', dataIndex: 'currency', sortable: true },
                        {
                            text: gm.me().getMC('msg_order_grid_quan_desc', '수량'),
                            flex: 0.5,
                            dataIndex: 'sales_amount',
                            sortable: false,
                            align: 'right',
                            style: 'text-align:center',
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'sales_amount') {
                                    context.record.set('sales_amount', Ext.util.Format.number(value, '0,00/i'));
                                }
                                if (value == null || value.length < 1) {
                                    value = 0;
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        },
                        {
                            text: '현재고', flex: 1, align: 'right', style: 'text-align:center', dataIndex: 'stock_qty', sortable: true,
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'stock_qty') {
                                    context.record.set('stock_qty', Ext.util.Format.number(value, '0,00/i'));
                                }
                                if (value == null || value.length < 1) {
                                    value = 0;
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        },
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
                        { text: gm.me().getMC('msg_product_add_dia_model', '품명'), flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true },
                        //{ text: gm.me().getMC('msg_order_grid_prd_desc', '기준모델'), flex: 1, dataIndex: 'description', style: 'text-align:center', sortable: true },
                        { text: gm.me().getMC('msg_product_add_search_field3', '규격'), flex: 2, dataIndex: 'desc_concat_spec', style: 'text-align:center', sortable: true },
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
                            //gm.me().incotermsStore.load();
                            gm.me().payTermsStore.load();

                            winProduct.setLoading(true);
                            var sales_price_total_disp = 0;
                            var sales_amount_total_disp = 0.0;
                            if (btn == "no") {
                                winProduct.setLoading(false);
                                winProduct.close();
                            } else {
                                var items = saveStore.data.items;
                                console_logs('items >>>>> ', items);
                                var store = gu.getCmp('productGridExtra').getStore();
                                console_logs('store.length ????', store.getCount());
                                var store_cnt = store.getCount();
                                var currency_abst = items[0].get('currency');
                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];
                                    //var id = item.get('srcahd_uid'); // srcahd uid
                                    var id = item.get('unique_id'); // srcahd uid
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
                                    //var delivery_plan = gu.getCmp('delivery_dates').getValue();
                                    var delivery_plan_parse = new Date(delivery_plan);
                                    var sales_price = item.get('sales_price');


                                    if (reserved_varcharb === 'F') {
                                        Ext.MessageBox.alert('단가조정', '무상샘플인 경우 단가가 자동으로 0으로 지정됩니다.');
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
                                        // 'item_incoterms': po_comment,
                                        'item_paycond': ao_name,
                                        'item_pancond_kr': ao_name_kr
                                    }));
                                    // gu.getCmp('item_paycond_combo').setValue(ao_name);
                                }
                                // 사전에 제품이 추가가 되지 않았을 떄
                                if (store_cnt === 0) {
                                    gu.getCmp('po_total').setValue(sales_amount_total_disp);
                                    gu.getCmp('po_price').setValue(sales_price_total_disp);
                                    // gu.getCmp('po_currency').setValue(currency_abst);

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
                                    //  gu.getCmp('po_currency').setValue(currency_abst);
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

    getPrdAdd: function () {
        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'addItemAction',
            disabled: false,
            text: gm.me().getMC('msg_btn_prd_add', '제품등록'),
            handler: function (widget, event) {
                if (gu.getCmp('delivery_dates').getValue() == null) {
                    Ext.MessageBox.alert(gm.me().getMC('msg_message_box_alert', '알림'), gm.me().getMC('msg_message_box_poadd_alert1', '납기일이 등록되지 않았습니다.'));
                    return;
                }

                /*
                * Store는 거래구분과 고객명이 입력될 떄 미리 돌아야 하며.
                * 무상샘플은 전체 제품 리스트를 나열해야 한다.
                * 정상거래와 유상샘플은 지정된 고객에 등록된 제품만 나열해야 한다.
                * */
                gm.me().searchDetailStoreOnlySrcMap.getProxy().setExtraParam('fix_type', 'SE');
                gm.me().searchDetailStoreOnlySrcMap.getProxy().setExtraParam('not_sg_code', 'MIX');


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
                        //{ text: gm.me().getMC('msg_product_add_dia_div', '사업부'), flex: 0.5, style: 'text-align:center', dataIndex: 'division_code', sortable: true },
                        { text: gm.me().getMC('msg_product_add_dia_model', '품명'), flex: 1.5, style: 'text-align:center', dataIndex: 'item_name', sortable: true },
                        //{ text: gm.me().getMC('msg_order_grid_prd_desc', '기준모델'), flex: 1.0, style: 'text-align:center', dataIndex: 'description', sortable: true },
                        { text: gm.me().getMC('msg_product_add_search_field3', '규격'), flex: 1.8, style: 'text-align:center', dataIndex: 'desc_concat_spec', sortable: true },
                        {
                            text: gm.me().getMC('msg_product_add_dia_price', '판매단가'),
                            flex: 1,
                            align: 'right',
                            style: 'text-align:center',
                            dataIndex: 'sales_price',
                            sortable: true,
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'sales_price') {
                                    context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                                }
                                if (value == null || value.length < 1) {
                                    value = 0;
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            }
                        },
                        //{ text: gm.me().getMC('msg_order_grid_prd_currency', '통화'), flex: 0.5, style: 'text-align:center', dataIndex: 'currency', sortable: true },
                        {
                            text: gm.me().getMC('msg_order_grid_quan_desc', '수량'),
                            flex: 0.5,
                            dataIndex: 'sales_amount',
                            sortable: false,
                            align: 'right',
                            style: 'text-align:center',
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'sales_amount') {
                                    context.record.set('sales_amount', Ext.util.Format.number(value, '0,00/i'));
                                }
                                if (value == null || value.length < 1) {
                                    value = 0;
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        },
                        {
                            text: '현재고', flex: 0.5, align: 'right', style: 'text-align:center', dataIndex: 'stock_qty', sortable: true,
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'stock_qty') {
                                    context.record.set('stock_qty', Ext.util.Format.number(value, '0,00/i'));
                                }
                                if (value == null || value.length < 1) {
                                    value = 0;
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        },
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
                        { text: gm.me().getMC('msg_product_add_dia_model', '품명'), flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true },
                        //{ text: gm.me().getMC('msg_order_grid_prd_desc', '기준모델'), flex: 1, dataIndex: 'description', style: 'text-align:center', sortable: true },
                        { text: gm.me().getMC('msg_product_add_search_field3', '규격'), flex: 2, dataIndex: 'desc_concat_spec', style: 'text-align:center', sortable: true },
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
                            // gm.me().incotermsStore.load();
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
                                        //var id = item.get('srcahd_uid'); // srcahd uid
                                        var id = item.get('unique_id'); // srcahd uid
                                        var sg_code = item.get('sg_code');
                                        var class_name = item.get('class_code');
                                        var item_code = item.get('item_code');
                                        var item_name = item.get('item_name');
                                        var ao_name = item.get('ao_name');
                                        var ao_name_kr = item.get('payment_condition');
                                        var po_comment = item.get('po_comment');
                                        var site = item.get('division_code');
                                        var specification = item.get('specification');
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
                                        // var delivery_plan = present_date.setMonth(present_date.getMonth() + 2);
                                        var delivery_plan = gu.getCmp('delivery_dates').getValue();
                                        var delivery_plan_parse = new Date(delivery_plan);
                                        var sales_price = item.get('sales_price');
                                        // if (gu.getCmp('reserved_varcharb').getValue() === 'F') {
                                        //     Ext.MessageBox.alert(gm.me().getMC('msg_message_box_alert', '단가조정'), gm.me().getMC('msg_message_box_poadd_alert3', '무상샘플인 경우 단가가 자동으로 0으로 지정됩니다.'));
                                        //     // Ext.MessageBox.alert('단가조정', '무상샘플인 경우 단가가 자동으로 0으로 지정됩니다.');
                                        //     sales_price = 0.0;
                                        // }
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
                                            'specification': specification,
                                            'delivery_plan': delivery_plan_parse,
                                            'description': description,
                                            'sales_amount': quan,
                                            //'item_incoterms': po_comment,
                                            'item_paycond': ao_name,
                                            'item_pancond_kr': ao_name_kr
                                        }));
                                    }
                                    // 사전에 제품이 추가가 되지 않았을 떄
                                    if (store_cnt === 0) {
                                        gu.getCmp('po_total').setValue(sales_amount_total_disp);
                                        gu.getCmp('po_price').setValue(sales_price_total_disp);
                                        //   gu.getCmp('po_currency').setValue(currency_abst);
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
                                        //   gu.getCmp('po_currency').setValue(currency_abst);
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


    selectCombst: function () {
        // var detailStore = Ext.create('Rfx2.store.company.chmr.MoneyInStoreByBill', {});
        // detailStore.getProxy().setExtraParam('project_uid', rec.get('ac_uid'));
        // detailStore.getProxy().setExtraParam('combst_uid', rec.get('order_com_unique'));
        gm.me().combstStore.getProxy().setExtraParam('wa_name', '');
        gm.me().combstStore.getProxy().setExtraParam('biz_no', '');
        gm.me().combstStore.load();
        // gm.me().combstStore.load();

        // paytype.load();
        var loadForm = Ext.create('Ext.grid.Panel', {
            store: gm.me().combstStore,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            id: gu.id('loadForm'),
            layout: 'fit',
            title: '',
            region: 'center',
            style: 'padding-left:0px;',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            bbar: getPageToolbar(gm.me().combstStore),
            columns: [
                {
                    text: "회사명",
                    flex: 1,
                    style: 'text-align:center',
                    dataIndex: 'wa_name',
                    sortable: true,
                    // renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: "사업자번호",
                    flex: 1,
                    dataIndex: 'biz_no',
                    // align: 'right',
                    style: 'text-align:center',
                    sortable: true,

                },
                {
                    text: "대표자명",
                    flex: 1,
                    style: 'text-align:center',
                    dataIndex: 'president_name',
                    sortable: true,
                    // renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },

                {
                    text: "본사주소",
                    flex: 1,
                    style: 'text-align:center',
                    dataIndex: 'address_1',
                    sortable: true,
                },
                {
                    text: "업태",
                    flex: 1,
                    style: 'text-align:center',
                    dataIndex: 'biz_condition',
                    sortable: true,
                },
                {
                    text: "종목",
                    flex: 1,
                    style: 'text-align:center',
                    dataIndex: 'biz_type',
                    sortable: true,
                },
            ],
            listeners : {
                itemdblclick: function(dv, record, item, index, e) {
                    var selections = loadForm.getSelectionModel().getSelection();
                    var rec = selections[0];
                    console_logs('>>>> rec dbclick', rec);
                    var order_com_unique = rec.get('unique_id_long');
                    var wa_name = rec.get('wa_name');
                    gu.getCmp('order_com_unique').setValue('');
                    gu.getCmp('order_com_unique').setValue(order_com_unique);
                    gu.getCmp('company_name').setValue('');
                    gu.getCmp('company_name').setValue(wa_name);

                    winProduct.setLoading(false);
                    winProduct.close();
                    
                }
            },
            renderTo: Ext.getBody(),
            autoScroll: true,
            multiSelect: true,
            pageSize: 100,
            width: 300,
            height: 300,
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            width: 200,
                            field_id: 'wa_name',
                            id: gu.id('wa_name_search'),
                            name: 'wa_name',
                            xtype: 'triggerfield',
                            emptyText: '회사명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().combstStore.load();
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    //if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().combstStore.getProxy().setExtraParam('wa_name', gu.getCmp('wa_name_search').getValue());
                                    gm.me().combstStore.load();
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
                            width: 200,
                            field_id: 'biz_no',
                            id: gu.id('biz_no_search'),
                            name: 'biz_no',
                            xtype: 'triggerfield',
                            emptyText: '사업자번호',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().combstStore.load();
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    //if (e.getKey() == Ext.EventObject.ENTER) {

                                    gm.me().combstStore.getProxy().setExtraParam('biz_no', gu.getCmp('biz_no_search').getValue());
                                    gm.me().combstStore.load();
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
                        '->',
                        this.addCombst
                    ]
                }] // endofdockeditems
        });

        loadForm.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    var rec = selections[0];
                    // gm.me().deleteWthList.enable();
                    // gu.getCmp('loadCancel').enable();
                } else {
                    // gm.me().deleteWthList.disable();
                    // gu.getCmp('loadCancel').disable();
                }
            }
        });

        var winProduct = Ext.create('ModalWindow', {
            title: '고객사를 선택후 확인버튼을 클릭하세요.',
            width: 700,
            height: 600,
            minWidth: 600,
            minHeight: 300,
            items: [
                // searchPalletGrid, 
                loadForm
            ],
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var sel = loadForm.getSelectionModel().getSelected().items[0];
                    console_logs('>>> sel >>>>', sel);
                    if (sel !== undefined) {
                        console_logs('>>> sel', sel.get('unique_id_long'));
                        var unique_id_long = sel.get('unique_id_long');
                        var wa_name = sel.get('wa_name');
                        gu.getCmp('order_com_unique').setValue('');
                        gu.getCmp('order_com_unique').setValue(unique_id_long);
                        gu.getCmp('company_name').setValue('');
                        gu.getCmp('company_name').setValue(wa_name);

                        winProduct.setLoading(false);
                        winProduct.close();

                    } else {
                        Ext.MessageBox.alert('알림', '고객사가 선택되지 않았습니다.');
                        return;
                    }

                }
            }]
        });
        winProduct.show();
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
                                title: gm.getMC('CMD_ORDER_CONFIRM', '수주확정'),
                                msg: 'LOT번호 : ' + Ext.getCmp('lot_no').getValue() + '의 <br> ' +
                                    '수주를 확정하겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (result) {
                                    if (result == 'yes') {
                                        var form = gu.getCmp('formPanel').getForm();
                                        var assymap_uid = gMain.selPanel.vSELECTED_ASSYMAP_UID;
                                        var ac_uid = gMain.selPanel.vSELECTED_PJ_UID;
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
        console_logs('description', specification);
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
            store.getProxy().setExtraParam('description', specification);
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

    loding_msg: function () {
        Ext.MessageBox.wait('데이터를 처리중입니다.<br>잠시만 기다려주세요.', '알림');
    },

    stop_msg: function () {
        Ext.MessageBox.hide();
    },

    confirmPjAndGoPrd: function (result) {
        if (result == 'yes') {
            // var select = gm.me().grid.getSelectionModel().getSelection()[0];
            var select = gm.me().grid.getSelectionModel().getSelection();
            console_logs('selects >>>>>>', select);
            if (select == null || select == undefined || select.length < 1) {
                Ext.MessageBox.alert('알림', '수주를 지정해주세요.');
                return null;
            }
            var ac_uids = [];
            var assymap_uids = [];
            for (var i = 0; i < select.length; i++) {
                var selects = select[i];

                ac_uids.push(selects.get('unique_uid'));
                assymap_uids.push(selects.get('unique_uid'));
            }
            console_logs('ac_uids >>>>', ac_uids);
            console_logs('assymap_uids >>>>', assymap_uids);
            console_logs("테스트테스트 assymap ==", assymap_uids, "ac_uid ==", ac_uids);
            gMain.setCenterLoading(true);
            gm.me().loding_msg();
            Ext.Ajax.request({
                waitMsg: '처리중입니다.<br> 잠시만 기다려주세요.',
                url: CONTEXT_PATH + '/index/process.do?method=addCartCopyPartMultiVer',
                params: {
                    ac_uids: ac_uids,
                    assymap_uids: assymap_uids
                },
                success: function (result, request) {
                    gMain.setCenterLoading(false);
                    gm.me().stop_msg();
                    gm.me().store.load();
                    Ext.MessageBox.alert('알림', '확정처리 되었습니다.');
                },
                failure: extjsUtil.failureMessage
            });
            gMain.setCenterLoading(false);
        }
    },

    changeGo: function (result) {
        if (result == 'yes') {
            // var select = gm.me().grid.getSelectionModel().getSelection()[0];
            var select = gm.me().grid.getSelectionModel().getSelection()[0];
            var change_po = Number(select.get('reserved_varchard')) + 1
            console_logs('change_po >>>>>>', change_po);
            if (select == null || select == undefined || select.length < 1) {
                Ext.MessageBox.alert('알림', '수주를 지정해주세요.');
                return null;
            }
            Ext.Ajax.request({
                waitMsg: '변경된 관급배정통보서가 등록되었는지 확인중..',
                url: CONTEXT_PATH + '/index/process.do?method=determineChangeGov',
                params: {
                    reserved_varchard: change_po
                },
                success: function (result, request) {
                    gMain.setCenterLoading(false);
                    var res = result.responseText;
                    if (res === 'true') {
                        gMain.setCenterLoading(false);
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/index/process.do?method=changeGov',
                            params: {
                                reserved_varchard: change_po,
                                project_uid: select.get('unique_id_long')
                            },
                            success: function (result, request) {
                                gMain.setCenterLoading(false);
                                Ext.MessageBox.alert('알림', '처리 되었습니다.')
                            },
                            failure: extjsUtil.failureMessage
                        });

                    } else {
                        gMain.setCenterLoading(false);
                        Ext.MessageBox.alert('알림', '변경 후의 관급배정통보서가 등록되지 않았습니다.<br>변경 후의 관급배정통보서를 QR등록 후 시행하십시오.');
                    }
                },
                failure: extjsUtil.failureMessage
            });
        }
    },


    // 임시파일 업로드 함수
    attachFileTemp: function (group_code) {
        this.attachedFileStore.getProxy().setExtraParam('group_code', group_code);

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
                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + group_code;
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
                    // this.removeActionFile,
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
            }, {
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

    // 수주등록 그리드에서 파일 첨부했을 시 
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
                    // {
                    //     xtype: 'button',
                    //     text: '파일업로드',
                    //     scale: 'small',
                    //     iconCls: 'af-upload-white',
                    //     scope: this.fileGrid,
                    //     handler: function () {
                    //         console_logs('=====aaa', record);
                    //         var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                    //         var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                    //             uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                    //             uploaderOptions: {
                    //                 url: url
                    //             },
                    //             synchronous: true
                    //         });
                    //         var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                    //             dialogTitle: '파일첨부',
                    //             panel: uploadPanel
                    //         });
                    //         this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
                    //             console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                    //             console_logs('this.mon uploadcomplete manager', manager);
                    //             console_logs('this.mon uploadcomplete items', items);
                    //             console_logs('this.mon uploadcomplete errorCount', errorCount);
                    //             gm.me().uploadComplete(items);
                    //             uploadDialog.close();
                    //         }, this);
                    //         uploadDialog.show();
                    //     }
                    // },
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
            }, {
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

    prdDetailLoad: function () {
        gu.getCmp('selectedMtrl').setHtml(gm.me().getMC('msg_reg_prd_info_detail', '등록된 수주건을 선택하십시오.'));
        // gu.getCmp('selectedMtrl').setHtml('등록된 수주건을 선택하십시오.');
        gm.me().poPrdDetailStore.removeAll();
        gm.me().deletePrdAction.disable();
    },

    editAssytopPrice: function (pj_total_price, ac_uid) {
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/sales/buyer.do?method=updateAssytopPrice',
            params: {
                ac_uid: ac_uid,
                sales_price: pj_total_price
            },
            success: function (result, request) {
                console_logs('price setting status', 'OK');
            },
            failure: extjsUtil.failureMessage
        });
    },

    editUpdateProjectPrice: function (pj_total_price, ac_uid) {
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/sales/buyer.do?method=updateAssytopPrice',
            params: {
                project_uid: ac_uid,
                selling_price: pj_total_price
            },
            success: function (result, request) {
                console_logs('price setting status', 'OK');
            },
            failure: extjsUtil.failureMessage
        });
    },





    tempoaryFileGroupcode: function (min, max) {
        var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNum;
    },
    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchExepOrderStore', {}),
    // searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchStore', { autoLoad: true }),

    //   prdStore: Ext.create('Mplm.store.RecvPoDsmfPoPRD', {}),
    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    PmUserStore: Ext.create('Mplm.store.UserStore', {}),
    payTermsStore: Ext.create('Mplm.store.PaytermStore', {}),
    //incotermsStore: Ext.create('Mplm.store.IncotermsStore', {}),
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_NEW_DIVISION' }),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_CONDITION' }),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_TYPE' }),

    searchPrdStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'PRD' }),
    searchAssyStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'ASSY' }),

    searchItemStore: Ext.create('Mplm.store.ProductStore', {}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SAMPLE_TYPE' }),

    routeCodeStore: Ext.create('Mplm.store.RouteCodeStore', {}),
    ynFlagStore: Ext.create('Mplm.store.YnFlagStore', {}),

    createMsTab: function (title, tabname) {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        if (this.stores.length < 1) {
            this.stores.push(Ext.create('Ext.data.Store', {
                fields: ['name', 'size', 'file', 'status']
            }));
        }
        var sc = this.storecount/*++*/;
        var tabDataUpload = Ext.create('Ext.panel.Panel', {
            //title: title,
            tabPosition: 'bottom',
            plain: true,
            width: '100%',
            items: [
                {
                    xtype: 'form',
                    items: [
                        {
                            items: [{
                                multiSelect: true,
                                xtype: 'grid',
                                id: 'UploadGrid' + [sc],
                                selModel: Ext.create("Ext.selection.CheckboxModel"),
                                columns: [{
                                    header: gm.me().getMC('mes_sro5_pln_column_file_name', '파일명'),
                                    dataIndex: 'name',
                                    flex: 2
                                }, {
                                    header: gm.me().getMC('mes_sro5_pln_column_file_size', '파일크기'),
                                    dataIndex: 'size',
                                    flex: 1,
                                    renderer: Ext.util.Format.fileSize
                                }, {
                                    header: gm.me().getMC('mes_sro5_pln_column_status', '상태'),
                                    dataIndex: 'status',
                                    flex: 1,
                                    renderer: this.rendererStatus
                                }],
                                viewConfig: {
                                    emptyText: gm.me().getMC('mes_sro5_pln_msg_drag', '이곳에 파일을 끌어 놓으세요'),
                                    height: 700,
                                    deferEmptyText: false
                                },
                                store: this.stores[sc],

                                listeners: {

                                    drop: {
                                        element: 'el',
                                        fn: 'drop'
                                    },

                                    dragstart: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragenter: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragover: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragleave: {
                                        element: 'el',
                                        fn: 'removeDropZone'
                                    },

                                    dragexit: {
                                        element: 'el',
                                        fn: 'removeDropZone'
                                    },

                                },

                                noop: function (e) {
                                    e.stopEvent();
                                },

                                addDropZone: function (e) {
                                    if (!e.browserEvent.dataTransfer || Ext.Array.from(e.browserEvent.dataTransfer.types).indexOf('Files') === -1) {
                                        return;
                                    }
                                    e.stopEvent();
                                    this.addCls('drag-over');
                                },

                                removeDropZone: function (e) {
                                    var el = e.getTarget(),
                                        thisEl = this.getEl();
                                    e.stopEvent();
                                    if (el === thisEl.dom) {
                                        this.removeCls('drag-over');
                                        return;
                                    }

                                    while (el !== thisEl.dom && el && el.parentNode) {
                                        el = el.parentNode;
                                    }

                                    if (el !== thisEl.dom) {
                                        this.removeCls('drag-over');
                                    }

                                },

                                drop: function (e) {

                                    e.stopEvent();
                                    Ext.Array.forEach(Ext.Array.from(e.browserEvent.dataTransfer.files), function (file) {
                                        gm.me().stores[0].add({
                                            file: file,
                                            name: file.name,
                                            size: file.size,
                                            status: '대기'

                                        });
                                    });
                                    this.removeCls('drag-over');
                                },

                                tbar: [{
                                    text: gm.me().getMC('mes_sro5_pln_btn_upload', '업로드'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
                                        for (var i = 0; i < l_store.data.items.length; i++) {
                                            if (!(l_store.getData().getAt(i).data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                                                l_store.getData().getAt(i).data.status = gm.me().getMC('mes_sro5_pln_btn_uploading', '업로드중');
                                                l_store.getData().getAt(i).commit();
                                                gm.me().postDocument(CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long'),
                                                    l_store, i, tabname);
                                            }
                                        }
                                    }
                                }, {
                                    text: gm.me().getMC('mes_sro5_pln_btn_remove_all', '전체삭제'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
                                        l_store.reload();
                                    }
                                }, {
                                    text: gm.me().getMC('mes_sro5_pln_btn_remove_optionally', '선택삭제'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
                                        l_store.remove(Ext.getCmp('UploadGrid0').getSelection());
                                    }
                                }]
                            }],
                        }
                    ]
                }
            ]
        });
        return tabDataUpload;
    },

    editRedord: function (field, rec) {

        switch (field) {
            case 'reserved_varchari':
                this.updateDesinComment(rec);
                break;
            case 'reserved_varchark':
                this.updateDesinComment(rec);
                break;
            case 'reserved_varchar1':
                this.updateDesinComment(rec);
                break;
        }


    },

    updateDesinComment: function (rec) {

        var reserved_varchar1 = rec.get('reserved_varchar1');
        var reserved_varchari = rec.get('reserved_varchari');
        var reserved_varchark = rec.get('reserved_varchark');
        var unique_id = rec.get('unique_uid');
        console_logs('====> unique_id', unique_id);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/sales/buyer.do?method=modifyRecvPoSingleVer',
            params: {

                projectUid: unique_id,
                reserved_varchari: reserved_varchari,
                reserved_varchark: reserved_varchark,
                reserved_varchar1: reserved_varchar1
            },
            success: function (result, request) {

                var result = result.responseText;
                //console_logs("", result);
                gm.me().store.load();
            },
            failure: extjsUtil.failureMessage
        });
    },

    postDocument: function (url, store, i, tabname) {

        var xhr = new XMLHttpRequest();
        xhr.timeout = 30000; // time in milliseconds
        var fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('upload_type', /*gu.getCmp('measureType').lastValue.radio1*/'SALES_PLAN');
        //fd.append('product_type', 'BW');

        xhr.setRequestHeader("serverTimeDiff", 0);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.responseText.length > 1) {
                    if (store.getData().getAt(i) !== undefined) {
                        store.getData().getAt(i).data.status = gm.me().getMC('sro1_completeAction', '완료');
                    }
                    for (var j = 0; j < store.data.items.length; j++) {
                        var record = store.getData().getAt(j);
                        if ((record.data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                            store.remove(record);
                            j--;
                        }
                    }
                } else {
                    store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                }
                //store.getData().getAt(i).commit();
                var data = Ext.util.JSON.decode(xhr.responseText).datas;
            } else if (xhr.readyState == 4 && (xhr.status == 404 || xhr.status == 500)) {
                store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                store.getData().getAt(i).commit();
            } else {
                for (var j = 0; j < store.data.items.length; j++) {
                    var record = store.getData().getAt(j);
                    store.remove(record);
                    j--;
                }
                if (store.data.items.length == 0 && gu.getCmp('uploadPrWin') != undefined) {
                    gu.getCmp('uploadPrWin').close();
                    gm.me().showToast(gm.me().getMC('mes_sro5_pln_header_reflection', '반영중'),
                        gm.me().getMC('mes_sro5_pln_msg_reflection', '데이터를 반영 중입니다. 잠시 후 새로고침 하시기 바랍니다.'));
                }
            }
        };
        xhr.send(fd);
    },
    stores: [],
    ingredientList: [],
    storecount: 0,
    // gridContent2: null,
    fields: [],

});



