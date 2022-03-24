Ext.define('Rfx2.view.company.hsct.salesDelivery.RecvPoEsDetailView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-po-view',

    site: null,

    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');
        this.addSearchField({
            type: 'combo'
            , field_id: 'state'
            , store: "EstimateStateStore"
            , emptyText: this.getMC('ULV_CMD_TOTAL_PROGRESS', '진행상태')
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });
        // this.addSearchField('reserved_varchar4');
        // this.addSearchField('reserved_varchar2');
        this.addSearchField({
            type: 'combo'
            , field_id: 'saler_name'
            , emptyText: '영업담당자'
            , store: "UserDeptStore"
            , displayField: 'user_name'
            , valueField: 'user_name'
            , value: 'user_name'
            , params: {dept_code: "D102"}
            , innerTpl: '<div data-qtip="{dept_name}">{user_name}</div>'
        });

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


        this.createStore('Rfx2.model.company.hanjung.RecvPoEs', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gMain.pageSize
            , {
                reserved_varchar1: 'rtgast.reserved_varchar1',
                reserved_varchar2: 'rtgast.reserved_varchar2',
                reserved_varchar3: 'rtgast.reserved_varchar3',
                po_no: 'rtgast.po_no'
            }
            , ['rtgast']
        );

        this.createPoEsAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: this.getMC('CMD_WRITE_QUOTE', '견적서작성'),
            tooltip: this.getMC('CMD_WRITE_QUOTE', '견적서작성'),
            hidden: gu.setCustomBtnHiddenProp('createPoEsAction'),
            handler: function () {
                gm.me().addPoEsWindow();
            }
        });


        this.copyPoEsAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: this.getMC('CMD_COPY_CREATE', '복사등록'),
            tooltip: '견적서 복사등록',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                console_logs('>>>>>> rec ????? ', rec);
                gm.me().copyPoEsWindow(rec);
            }
        });


        this.modifyPoEsAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: this.getMC('CMD_MODIFY', '수정'),
            tooltip: '견적서수정',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                if (rec.get('state') === 'A') {
                    Ext.MessageBox.alert('', '승인 상태에서 견적서 수정은 불가합니다.')
                    return;
                } else {
                    gm.me().modifyPoEsWindow(rec);
                }
            }
        });

        this.confirmEsByConfirmer = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: this.getMC('CMD_CHECK_QUOTE', '견적확정'),
            tooltip: this.getMC('CMD_CHECK_QUOTE', '견적확정'),
            hidden: gu.setCustomBtnHiddenProp('confirmEsByConfirmer'),
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                console_logs('site ???? ', site);
                console_logs('rec ???? ', rec);
                if (rec.get('state') !== 'A') {
                    gm.me().estimateConfirmByApprover(rec, site);
                } else {
                    Ext.Msg.alert('', '이미 승인처리가 되었습니다.');
                    return;
                }
            }
        });

        this.pdfAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: this.getMC('CMD_QUOTE', '견적서'),
            tooltip: '견적서를 PDF파일로 출력합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('pdfAction'),
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var rec = selections[0];
                console_logs('selections>>>> ', selections);
                if (selections.length > 0) {
                    if (rec.get('state') === 'A') {
                        gm.me().pdfDownload(selections.length, selections, 0);
                    } else {
                        Ext.Msg.alert('', '승인된 상태의 견적서만 출력 가능합니다.');
                        return;
                    }
                } else {
                    Ext.Msg.alert('알림', '출력할 견적서를 선택하십시오.');
                }
            }
        });

        this.confirmClientAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-check',
            text: this.getMC('CMD_CUSTOMER_APPROVAL', '고객승인'),
            tooltip: '고객승인',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('confirmClientAction'),
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                if (rec.get('state') === 'A') {
                    gm.me().clientConfirm(rec);
                } else if (rec.get('state') === 'S') {
                    Ext.Msg.alert('', '이미 고객승인 처리가 완료되었습니다.');
                } else {
                    Ext.Msg.alert('', '승인된 상태에서 고객승인이 가능합니다.');
                }
            }
        });

        this.addPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: this.getMC('CMD_ORDER_REGISTRATION', '수주등록'),
            tooltip: this.getMC('CMD_ORDER_REGISTRATION', '수주등록'),
            hidden: gu.setCustomBtnHiddenProp('addPoAction'),
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                if (rec.get('state') === 'S') {
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
                                dataIndex: '',
                                dataIndex: 'class_code',
                                style: 'text-align:center',
                                sortable: false
                            },
                            {
                                text: '제품명',
                                width: '10%',
                                dataIndex: 'item_code',
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
                                sortable: false
                            },
                            {
                                text: '수량',
                                width: '10%',
                                dataIndex: 'bm_quan',
                                editor: 'numberfield',
                                align: 'right',
                                style: 'text-align:center',
                                sortable: false
                            },
                            {
                                text: 'Unit',
                                width: '10%',
                                dataIndex: 'reserved_varchar9',
                                style: 'text-align:center',
                                sortable: false
                            },
                            {
                                text: '단가',
                                width: '10%',
                                decimalPrecision: 5,
                                dataIndex: 'sales_price',
                                style: 'text-align:center',
                                sortable: false,
                                align: 'right',
                            },
                            {
                                text: '통화',
                                width: '10%',
                                dataIndex: 'reserved_varchar8',
                                style: 'text-align:center',
                                sortable: false
                            },
                            {
                                text: 'PO date',
                                width: '10%',
                                dataIndex: 'regist_date',
                                format: 'Y-m-d',
                                style: 'text-align:center',
                                dateFormat: 'Y-m-d',
                                sortable: false,
                                renderer: Ext.util.Format.dateRenderer('Y-m-d')
                            },
                            {
                                text: '납기일',
                                width: '10%',
                                dataIndex: 'delivery_plan',
                                style: 'text-align:center',
                                editor: {
                                    xtype: 'datefield',
                                    format: 'Y-m-d'
                                },
                                format: 'Y-m-d',
                                dateFormat: 'Y-m-d',
                                sortable: false,
                                renderer: Ext.util.Format.dateRenderer('Y-m-d')
                            },
                            {
                                text: 'Commment',
                                width: '20%',
                                dataIndex: 'item_comment',
                                style: 'text-align:center',
                                editor: 'textfield',
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
                    var bm_quan_disp = 0
                    var sales_price_disp = 0;
                    for (var i = 0; i < gm.me().estiContentRecords.length; i++) {
                        var rec = gm.me().estiContentRecords[i];
                        var store = gu.getCmp('productGrid').getStore();
                        var item_code = rec.get('item_model');
                        var class_code = rec.get('middel_type_full');
                        var bm_quan = rec.get('item_quan');
                        var description = rec.get('srcahd_description');
                        var item_pcs = rec.get('item_pcs');
                        var item_munit = rec.get('item_munit');
                        var srcahd_uid = rec.get('srcahd_uid');
                        var srcmap_uid = rec.get('srcmap_uid');
                        var remark = rec.get('item_remark');
                        var delivery_date = rec.get('delivery_date');
                        var sg_code = rec.get('item_name')
                        var supplier_code = rec.get('division_code');
                        var sales_price = rec.get('item_unit_price');
                        var esti_uid = rec.get('unique_id_long');
                        store.insert(store.getCount(), new Ext.data.Record({
                            'esti_uid': esti_uid,
                            'srcahd_uid': srcahd_uid,
                            'srcmap_uid': srcmap_uid,
                            'description': description,
                            'sg_code': sg_code,
                            'class_code': class_code,
                            'item_code': item_code,
                            'class_code': class_code,
                            'regist_date': new Date(),
                            'reserved_varcharg': supplier_code,
                            'supplier_code': supplier_code,
                            'reserved_varchar9': item_pcs,
                            'sales_price': sales_price,
                            'reserved_varchar8': item_munit,
                            'bm_quan': bm_quan,
                            'currency': item_munit,
                            'delivery_plan': delivery_date,
                            'remark': remark,
                        }));
                        bm_quan_disp = Number(bm_quan_disp) + Number(bm_quan);
                        sales_price_disp = Number(sales_price_disp) + Number(((bm_quan * sales_price)));
                    }

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
                                xtype: 'hiddenfield',
                                name: '',
                                value: gm.me().grid.getSelectionModel().getSelection()[0].get('unique_id')
                            },
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
                                                xtype: 'textfield',
                                                id: gu.id('reserved_varchar4'),
                                                name: 'reserved_varchar4',
                                                padding: '0 0 5px 30px',
                                                width: '45%',
                                                value: gm.me().selectedAreaCode,
                                                allowBlank: false,
                                                readOnly: true,
                                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                                fieldLabel: '지역'
                                            },
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
                                                readOnly: true,
                                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                                value: gm.me().grid.getSelectionModel().getSelection()[0].get('reserved_number1'),
                                                valueField: 'unique_id_long',
                                                sortInfo: {field: 'wa_name', direction: 'ASC'},
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
                                                        gu.getCmp('reserved_varchar5').setValue(record.get('nation_code'));
                                                        var nationTypeStore = Ext.create('Mplm.store.NationTypeStore', {});
                                                        nationTypeStore.load(function (rec) {
                                                            for (var i = 0; i < rec.length; i++) {
                                                                var nationType = rec[i].get('system_code');
                                                                if (nationType === record.get('major_del_area')) {
                                                                    gu.getCmp('reserved_varchar4').setValue(rec[i].get('code_name_kr'));
                                                                }
                                                            }
                                                        });
                                                    }// endofselect
                                                }
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
                                                xtype: 'hiddenfield',
                                                name: 'rtgast_uid',
                                                value: gm.me().grid.getSelectionModel().getSelection()[0].get('unique_id_long')
                                            }
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
                                        width: '80%',
                                        height: '50%',
                                        layout: 'column',
                                        align: 'center',
                                        defaults: {
                                            width: '49%',
                                            margin: '2 2 2 2'
                                        },
                                        items: [
                                            {
                                                fieldLabel: '총계 수량',
                                                xtype: 'numberfield',
                                                width: '40%',
                                                labelAlign: 'right',
                                                editable: false,
                                                fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: right',
                                                value: bm_quan_disp,
                                                hideTrigger: true,
                                                keyNavEnabled: false,
                                                mouseWheelEnabled: false,
                                                id: gu.id('po_total'),
                                            },
                                            {
                                                fieldLabel: '금액',
                                                xtype: 'numberfield',
                                                width: '40%',
                                                labelAlign: 'right',
                                                fieldStyle: 'background-color: #ebe8e8; background-image: none; font-weight: bold; text-align: right',
                                                editable: false,
                                                value: sales_price_disp,
                                                hideTrigger: true,
                                                keyNavEnabled: false,
                                                mouseWheelEnabled: false,
                                                id: gu.id('po_price'),
                                            }
                                        ]
                                    }
                                ]
                            }
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
                                            objv['srcmap_uid'] = item.get('srcmap_uid');
                                            objv['reserved_varcharg'] = item.get('reserved_varcharg');
                                            objv['sales_price'] = item.get('sales_price');
                                            objv['reserved_varchar8'] = item.get('reserved_varchar8');
                                            objv['reserved_varchar9'] = item.get('reserved_varchar9');
                                            objv['regist_date'] = item.get('regist_date');
                                            objv['delivery_plan'] = item.get('delivery_plan');
                                            objv['bm_quan'] = item.get('bm_quan');
                                            objv['item_comment'] = item.get('item_comment');
                                            objs.push(objv);
                                        }
                                        var jsonData = Ext.util.JSON.encode(objs);

                                        form.submit({
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
                } else {
                    Ext.MessageBox.alert('', '확정상태일때 수주등록이 가능합니다.');
                }
            }
        });

        buttonToolbar.insert(1, this.createPoEsAction);
        buttonToolbar.insert(2, this.modifyPoEsAction);
        buttonToolbar.insert(3, this.copyPoEsAction);
        buttonToolbar.insert(4, this.confirmEsByConfirmer);
        buttonToolbar.insert(5, this.confirmClientAction);
        buttonToolbar.insert(6, this.addPoAction);
        buttonToolbar.insert(7, '-');
        buttonToolbar.insert(8, this.pdfAction);

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdDetailByProjectStore', {});

        this.addPoPrdPlus = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: this.getMC('CMD_ADD', '추가'),
            tooltip: '제품추가',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('addPoPrdPlus'),
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                if (selections.get('state') !== 'A') {
                    console_logs('rtgast_uid', selections.get('unique_id'));
                    // 추가 제품을 등록하기 위한 기본 uid를 미리 구해놓는다.
                    var rtgast_uid = selections.get('unique_id');
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
                            {
                                text: gm.getMC('CMD_Product', '제품군'),
                                width: '15%',
                                dataIndex: 'middel_type_full',
                                style: 'text-align:center',
                                sortable: false
                            },
                            {
                                text: '제품명',
                                width: '10%',
                                dataIndex: 'item_code',
                                style: 'text-align:center',
                                sortable: false
                            },
                            // {
                            //     text: '기준모델',
                            //     width: '10%',
                            //     dataIndex: 'description',
                            //     style: 'text-align:center',
                            //     sortable: false
                            // },
                            {
                                text: '사업부',
                                width: '10%',
                                dataIndex: 'supplier_code',
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
                                dataIndex: 'currency',
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
                                sortable: false,
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'bm_quan') {
                                        context.record.set('bm_quan', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                            },
                            {
                                text: 'UNIT',
                                width: '10%',
                                dataIndex: 'unit_code',
                                style: 'text-align:center',
                                // editor: 'textfield',
                                sortable: false
                            },


                            {
                                text: '납기일',
                                width: '10%',
                                dataIndex: 'delivery_plan',
                                style: 'text-align:center',
                                // css: 'edit-cell',
                                editor: {
                                    xtype: 'datefield',
                                    format: 'Y-m-d'
                                },
                                format: 'Y-m-d',
                                dateFormat: 'Y-m-d',
                                sortable: false,

                                renderer: Ext.util.Format.dateRenderer('Y-m-d')
                            },
                            {
                                text: 'Remark',
                                width: '20%',
                                // css: 'edit-cell',
                                dataIndex: 'item_remark',
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
                                // var store = gu.getCmp('productGridExtra').getStore();
                                // var previous_store = store.data.items;
                                // var total_quan = 0.0;
                                // var total_price = 0.0;
                                // console_logs('All Store Contents ??? ', previous_store);
                                // for (var j = 0; j < previous_store.length; j++) {
                                //     var item = previous_store[j];
                                //     console_logs('bm_quan_EDIT', Number(item.get('bm_quan')));
                                //     console_logs('sales_price_EIDT', Number(item.get('sales_price')));
                                //     total_quan = Number(total_quan) + Number(item.get('bm_quan'));
                                //     total_price = Number(total_price) + (Number(item.get('sales_price')) * Number(item.get('bm_quan')));
                                // }
                                // gu.getCmp('po_total').setValue(total_quan);
                                // gu.getCmp('po_price').setValue(total_price);
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
                                    gm.me().getPrdEstimateExtra(),
                                    {
                                        text: gm.getMC('CMD_DELETE', '삭제'),
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
                                title: '추가견적 등록',
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
                        title: '추가견적 등록',
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
                                        var obj = {};
                                        var columns = [];
                                        for (var j = 0; j < storeData.data.items.length; j++) {
                                            var item = storeData.data.items[j];
                                            var objv = {};
                                            objv['srcahd_uid'] = item.get('srcahd_uid');
                                            objv['srcmap_uid'] = item.get('srcmap_uid');
                                            objv['middel_type_full'] = item.get('middel_type_full');
                                            objv['sg_code'] = item.get('sg_code');
                                            objv['item_code'] = item.get('item_code');
                                            objv['supplier_code'] = item.get('supplier_code');
                                            objv['sales_price'] = item.get('sales_price');
                                            objv['currency'] = item.get('currency');
                                            objv['bm_quan'] = item.get('bm_quan');
                                            objv['unit_code'] = item.get('unit_code');
                                            objv['delivery_plan'] = item.get('delivery_plan');
                                            objv['item_remark'] = item.get('item_remark');
                                            columns.push(objv);
                                        }
                                        obj['datas'] = columns;
                                        objs.push(obj);
                                        var jsonData = Ext.util.JSON.encode(objs);
                                        form.submit({
                                            submitEmptyText: false,
                                            url: CONTEXT_PATH + '/purchase/prch.do?method=addEstimateExtra',
                                            params: {
                                                productJsonExtra: jsonData,
                                                rtgast_uid: rtgast_uid
                                            },
                                            success: function (val, action) {
                                                win.setLoading(false);
                                                gm.me().store.load();
                                                gm.me().estiContentStore.load();
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
                } else {
                    Ext.MessageBox.alert('알림', '승인된 상태의 견적서는 수정이 불가합니다.')
                }
            }
        });


        this.deletePrdAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: this.getMC('CMD_DELETE', '삭제'),
            tooltip: '제품삭제',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('deletePrdAction'),
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                if (selections.get('state') !== 'A') {
                    Ext.MessageBox.show({
                        title: '제품 삭제',
                        msg: '선택한 제품을 삭제하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (btn) {
                            if (btn == 'yes') {
                                var grid = gu.getCmp('gridContractCompany');
                                var record = grid.getSelectionModel().getSelected().items[0];
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/prch.do?method=deleteEstiPart',
                                    params: {
                                        unique_id: record.get('unique_id_long'),
                                        item_unit_price: record.get('item_unit_price'),
                                        rtgast_uid: record.get('rtgast_uid'),
                                        quan: record.get('item_quan')
                                    },
                                    success: function (result, request) {
                                        var resultText = result.responseText;
                                        console_log('result:' + resultText);
                                        gm.me().estiContentStore.load();
                                        gm.me().store.load();
                                    },
                                    failure: extjsUtil.failureMessage
                                });//endof ajax request
                            }
                        },
                        icon: Ext.MessageBox.QUESTION
                    });
                } else {
                    Ext.MessageBox.alert('알림', '승인된 상태에서 삭제는 불가합니다.')
                }
            }
        });

        this.gridContractCompany = Ext.create('Ext.grid.Panel', {

            cls: 'rfx-panel',
            id: gu.id('gridContractCompany'),
            store: this.estiContentStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,
            bbar: getPageToolbar(this.estiContentStore),
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
                            html: "등록된 견적을 선택하십시오.",
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
                // { text: 'No', width: 50, style: 'text-align:center', dataIndex: 'pl_no', sortable: false },
                {
                    text: gm.getMC('CMD_Product', '제품군'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'class_code',
                    sortable: false
                },
                {text: '제품명', width: 100, style: 'text-align:center', dataIndex: 'item_model', sortable: false},
                {
                    text: '기준모델',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'srcahd_description',
                    sortable: false
                },
                {text: 'Site', width: 90, style: 'text-align:center', dataIndex: 'division_code', sortable: false},
                {
                    text: '수량',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'item_quan',
                    sortable: false,
                    align: 'right',
                    editor: 'numberfield',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'bm_quan') {
                            context.record.set('bm_quan', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {text: 'UNIT', width: 70, style: 'text-align:center', dataIndex: 'item_pcs', sortable: false},
                {
                    text: '단가',
                    width: 80,
                    style: 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex: 'item_unit_price',
                    sortable: false,
                    align: 'right'
                },
                {text: '통화', width: 80, style: 'text-align:center', dataIndex: 'item_munit', sortable: false},
                {
                    text: '납기일',
                    xtype: 'datecolumn',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'delivery_date',
                    sortable: false,
                    format: 'Y-m-d',
                    editor: {xtype: 'datefield', format: 'Y-m-d'},
                },
                {
                    text: 'Remark',
                    width: 150,
                    style: 'text-align:center',
                    dataIndex: 'item_remark',
                    editor: {xtype: 'textfield'},
                    sortable: false
                },
            ],
            title: this.getMC('CMD_VIEW_DTL', '상세정보'),
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {
                    var selections = gm.me().grid.getSelectionModel().getSelection();
                    var rec = selections[0];
                    console_logs('상세정보 REC', rec);
                    if (rec.get('state') === 'A') {
                        Ext.MessageBox.alert('', '승인 상태에서 견적서 수정은 불가합니다.');
                        gm.me().store.load();
                        gm.me().estiContentStore.load();
                        return;
                    } else {
                        var columnName = e.field;
                        var tableName = 'esticontent';
                        console_logs('e.record >>>>>>> ', e.record);
                        var unique_id = e.record.get('unique_id_long');
                        // var ac_uid = e.record.get('ac_uid');
                        // var unique_id = e.record.getId();
                        var value = e.value;
                        gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                        gm.me().estiContentStore.load();

                    }

                }
            }
        });

        Ext.each(this.gridContractCompany.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'item_remark':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'delivery_date':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'item_remark':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    };
                    break;
                case 'delivery_date':
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
                    width: '55%',
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
            if (selections.length) {
                estimate_wb = 0;
                estimate_re = 0;
                estimate_ch = 0;
                estimate_ch = 0;
                var rec = selections[0];
                var reserved_number1 = gm.me().grid.getSelectionModel().getSelection()[0].get('reserved_number1');
                var buyer_company = gm.me().grid.getSelectionModel().getSelection()[0].get('buyer_company');
                var reserved_varcharb = gm.me().grid.getSelectionModel().getSelection()[0].get('reserved_varcharb');
                gm.me().combstStore.getProxy().setExtraParam('id', reserved_number1);
                gm.me().combstStore.load(function (record) {
                    for (var i = 0; i < record.length; i++) {
                        var unique_id_long = record[i].get('unique_id_long');
                        if (reserved_number1 === unique_id_long) {
                            gm.me().selectedNationCode = record[i].get('nation_code');
                            var nationTypeStore = Ext.create('Mplm.store.NationTypeStore', {});
                            var sel = record[i];
                            nationTypeStore.load(function (rec) {
                                for (var j = 0; j < rec.length; j++) {
                                    var nationType = rec[j].get('system_code');
                                    if (nationType === sel.get('major_del_area')) {
                                        gm.me().selectedAreaCode = rec[j].get('code_name_kr');
                                    }
                                }
                            });
                        }
                    }
                });

                this.copyPoEsAction.enable();
                this.modifyPoEsAction.enable();
                this.confirmEsByConfirmer.enable();
                this.pdfAction.enable();
                this.confirmClientAction.enable();
                this.addPoAction.enable();
                this.addPoPrdPlus.enable();

                if (rec.get('state') == 'C' || rec.get('state') == 'T') {
                    this.esReturnAction.disable();
                    //this.estToPoAction.disable();
                    this.addPoAction.disable();
                } else {
                    // this.esReturnAction.enable();
                    // this.estToPoAction.enable();
                    // this.addPoAction.enable();
                }
                var rtgastUid = rec.get('unique_id_long');


                gm.me().estiContentStore.getProxy().setExtraParam('rtgastUid', rtgastUid);
                gm.me().estiContentStore.load(function (record) {
                    console_logs('record >>>>>', record);
                    objs = [];
                    gm.me().estiContentRecords = record;
                    var obj = {};
                    console_logs(gm.me().estiContentRecords);
                    var rec = gm.me().estiContentRecords;
                    var columns = [];

                    for (var i = 0; i < rec.length; i++) {
                        var sel = rec[i];
                        var objv = {};
                        var code_uid = sel.get('code_uid');
                        var item_model = sel.get('item_model');
                        var total_price = sel.get('total_price');
                        if (i === 0) {
                            site = sel.get('division_code');
                        }
                        objv['code_uid'] = code_uid;
                        objv['total_price'] = total_price;
                        objv['item_model'] = item_model;
                        columns.push(objv);
                    }
                    console_logs('>>>objv', columns);
                    obj['datas'] = columns;
                    objs.push(obj);
                    console_logs('>>>> objs >>>>> ', objs);
                });

                gu.getCmp('selectedMtrl').setHtml(reserved_varcharb + ' / ' + buyer_company);

            } else {
                this.copyPoEsAction.disable();
                this.modifyPoEsAction.disable();
                this.pdfAction.disable();
                this.confirmEsByConfirmer.disable();
                this.pdfAction.disable();
                this.confirmClientAction.disable();
                this.addPoAction.disable();
                this.addPoPrdPlus.disable();
                site = null;
            }
        });

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
            text: '제품추가',
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

                if (reserved_varcharb === 'N' || reserved_varcharb === 'P') {
                    if (rec.get('order_com_unique') == null) {
                        Ext.MessageBox.alert('알림', '거래구분이 정상거래, 유상샘플이 선택 되었을 경우 고객명이 반드시 입력되어야 합니다');
                        return;
                    } else {
                        gm.me().searchDetailStoreOnlySrcMap.getProxy().setExtraParam('srcmap_comastUid', rec.get('order_com_unique'));
                        gm.me().searchDetailStoreOnlySrcMap.pageSize = 100;
                        gm.me().searchDetailStoreOnlySrcMap.load();
                    }
                } else if (reserved_varcharb === 'F') { // 무상샘플일 경우
                    gm.me().searchDetailStoreOnlySrcMap.getProxy().setExtraParam('srcmap_comastUid', -1);
                    gm.me().searchDetailStoreOnlySrcMap.pageSize = 100;
                    gm.me().searchDetailStoreOnlySrcMap.load();
                }

                var partGridWidth = '20%';
                var searchItemGrid = Ext.create('Ext.grid.Panel', {
                    store: gm.me().searchDetailStoreOnlySrcMap,
                    layout: 'fit',
                    title: '제품검색',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    columns: [
                        {
                            text: "사업부",
                            flex: 0.5,
                            style: 'text-align:center',
                            dataIndex: 'supplier_code',
                            sortable: true
                        },
                        {text: "모델명", flex: 1.5, style: 'text-align:center', dataIndex: 'item_name', sortable: true},
                        {
                            text: "기준모델",
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'srcahd_description',
                            sortable: true
                        },
                        {text: "규격", flex: 1.8, style: 'text-align:center', dataIndex: 'specification', sortable: true},
                        {
                            text: "판매단가",
                            flex: 1,
                            align: 'right',
                            style: 'text-align:center',
                            dataIndex: 'sales_price',
                            sortable: true
                        },
                        {text: "통화", flex: 0.5, style: 'text-align:center', dataIndex: 'currency', sortable: true},
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
                                }
                            ]
                        }]
                });

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
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    columns: [
                        {text: "모델명", flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true},
                        {text: "기준모델", flex: 1, dataIndex: 'description', style: 'text-align:center', sortable: true},
                        {text: "규격", flex: 2, dataIndex: 'specification', style: 'text-align:center', sortable: true},
                        {
                            text: "수량",
                            flex: 1,
                            dataIndex: 'bm_quan',
                            editor: 'numberfield',
                            align: 'right',
                            style: 'text-align:center',
                            sortable: true,
                            renderer: function (value, context, tmeta) {
                                console_logs('?????', '??????');
                                if (context.field == 'bm_quan') {
                                    context.record.set('bm_quan', Ext.util.Format.number(value, '0,00/i'));
                                }
                                if (value == null || value.length < 1) {
                                    value = 0;
                                }
                                return Ext.util.Format.number(value, '0,00/i');
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
                });

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
                                var store = gu.getCmp('productGridExtra').getStore();
                                console_logs('store.length ????', store.getCount());
                                var store_cnt = store.getCount();
                                var currency_abst = items[0].get('currency');
                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];
                                    var id = item.get('srcahd_uid'); // srcahd uid
                                    var type = item.get('middel_type_full');
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


                                    if (reserved_varcharb === 'F') {
                                        Ext.MessageBox.alert('단가조정', '무상샘플인 경우 단가가 자동으로 0으로 지정됩니다.');
                                        sales_price = 0.0;
                                    }

                                    sales_price_total_disp = Number(sales_price_total_disp) + (Number(sales_price) * Number(quan));
                                    console_logs('>>>>>>>>>', bm_quan_total_disp);
                                    console_logs('>>>>>>>>> sales_price_total_disp', sales_price_total_disp);

                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'middel_type_full': type,
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
                                        'bm_quan': quan,
                                        'item_incoterms': po_comment,
                                        'item_paycond': ao_name,
                                        'item_pancond_kr': ao_name_kr
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

    doRequest: function (status) {
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/production/schdule.do?method=updateAssyMapStatus',
            params: {
                assymap_uid: gm.me().vSELECTED_ASSYMAP_UID,
                status: status
            },
            success: function (result, request) {
                gMain.selPanel.store.load();
            },
            failure: extjsUtil.failureMessage
        });
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

    redrawSearchStore: function (mode) {

        this.clearSearchStore();

        var item_code = null;
        var item_name = null;
        var specification = null;
        var model_no = null;
        var division_code = null;
        var order_com_unique = null;

        var store = gm.me().searchDetailStore;
        // var srcmapStore = gm.me().searchDetailStoreSrcMap;
        // var 
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

        if (vCompanyReserved4 == 'BIOT01KR' && mode == 'PO') {
            order_com_unique = gu.getCmp('order_com_unique').getValue();
        }

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

    cellEditing: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    cellEditing_save: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),
    cellEditing_prd: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    }),

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


    addPoEsWindow: function () {

        var shippingStore = Ext.create('Ext.data.Store', {
            fields: ['ship', 'ship_kr'],
            data: [
                {"ship": "OCEAN", "ship_kr": "OCEAN"},
                {"ship": "AIR", "ship_kr": "AIR"},
            ]
        });

        var etc_grid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('etc_grid'),
            collapsible: false,
            multiSelect: false,
            width: 900,
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
                    width: '30%',
                    dataIndex: 'middel_type_full',
                    style: 'text-align:center',
                    sortInfo: {field: 'arti_kr', direction: 'DESC'},
                    valueField: 'sg_code',
                    typeAhead: false,
                    allowBlank: false,
                    minChars: 1,
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function () {
                            return '<div data-qtip="{unique_id}">[{arti}] {arti_kr}</div>';
                        }
                    },
                    sortable: false
                },
                {
                    text: '제품명',
                    width: '40%',
                    dataIndex: 'item_code',
                    style: 'text-align:center',
                    sortable: false,
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            field.setValue(newValue.toUpperCase());
                        }
                    }
                },
                {
                    text: '사업부',
                    width: '40%',
                    dataIndex: 'supplier_code',
                    style: 'text-align:center',
                    sortable: false,
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            field.setValue(newValue.toUpperCase());
                        }
                    }
                },
                {
                    text: '단가',
                    width: '45%',
                    dataIndex: 'sales_price',
                    editor: 'numberfield',
                    decimalPrecision: 5,
                    align: 'right',
                    style: 'text-align:center',
                    sortable: false
                },
                {
                    text: '통화',
                    width: '35%',
                    dataIndex: 'currency',
                    style: 'text-align:center',
                    sortInfo: {field: 'mu_kr', direction: 'DESC'},
                    typeAhead: false,
                    allowBlank: false,
                    sortable: false
                },
                {
                    text: '수량',
                    width: '30%',
                    dataIndex: 'bm_quan',
                    editor: 'numberfield',
                    align: 'right',
                    style: 'text-align:center',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'bm_quan') {
                            context.record.set('bm_quan', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    sortable: false
                },
                {
                    text: 'UNIT',
                    width: '20%',
                    dataIndex: 'unit_code',
                    style: 'text-align:center',
                    sortInfo: {field: 'um_kr', direction: 'DESC'},
                    valueField: 'unit_code',
                    typeAhead: false,
                    allowBlank: false,
                    minChars: 1,
                    sortable: false
                },
                {
                    text: '납기일',
                    width: '30%',
                    dataIndex: 'delivery_date',
                    style: 'text-align:center',
                    format: 'Y-m-d',
                    submitFormat: 'Y-m-d',
                    editor: new Ext.form.DateField({
                        disabled: false,
                        format: 'Y-m-d'
                    }),
                    sortable: false,
                    // renderer: function (field) {
                    //     if (field === '0000-00-00') {
                    //         return null;
                    //     } else {
                    //         Ext.util.Format.date(new Date(value), "Y-m-d")
                    //         // var formated = Ext.util.Format.date(field, 'Y-m-d');
                    //         // return formated;
                    //     }
                    // }
                },
                {
                    text: 'Remark',
                    width: '40%',
                    dataIndex: 'remark',
                    editor: 'textfield',
                    style: 'text-align:center',
                    sortable: false
                }
            ],
            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            listeners: {
                beforeedit: function (editor, context, eOpts) {
                    if (context.field == 'srcahd_uid') {
                        context.record.set('srcahd_uid', -1);
                    }
                    if (context.field == 'srcmap_uid') {
                        context.record.set('srcmap_uid', -1);
                    }
                    if (context.field == 'sg_code') {
                        context.record.set('sg_code', '');
                    }
                    if (context.field == 'item_code') {
                        context.record.set('item_code', '');
                    }
                    if (context.field == 'supplier_code') {
                        context.record.set('supplier_code', '');
                    }
                    if (context.field == 'sales_price') {
                        context.record.set('sales_price', '');
                    }
                    if (context.field == 'currency') {
                        context.record.set('currency', '');
                    }
                    if (context.field == 'bm_quan') {
                        context.record.set('bm_quan', '');
                    }
                    if (context.field == 'delivery_date') {
                        context.record.set('delivery_date', '');
                    }
                    if (context.field == 'remark') {
                        context.record.set('remark', '');
                    }
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
                        gm.me().getPrdEstimate(),
                        {
                            text: '제품삭제',
                            iconCls: 'af-remove',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                                    var store = gu.getCmp('etc_grid').getStore();
                                    if (record == null) {
                                        gu.getCmp('etc_grid').getStore().remove(store.last());
                                    } else {
                                        gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));
                                    }
                                }
                            }]
                        },
                        {
                            text: '▲',
                            listeners: [{
                                click: function () {
                                    var direction = -1;
                                    var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                                    if (!record) {
                                        return;
                                    }

                                    var index = gu.getCmp('etc_grid').getStore().indexOf(record);
                                    if (direction < 0) {
                                        index--;
                                        if (index < 0) {
                                            return;
                                        }
                                    } else {
                                        index++;
                                        if (index >= gu.getCmp('etc_grid').getStore().getCount()) {
                                            return;
                                        }
                                    }
                                    gu.getCmp('etc_grid').getStore().remove(record);
                                    gu.getCmp('etc_grid').getStore().insert(index, record);
                                    gu.getCmp('etc_grid').getSelectionModel().select(index, true);
                                }
                            }]
                        },
                        {
                            text: '▼',
                            listeners: [{
                                click: function () {
                                    var direction = 1;
                                    var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                                    if (!record) {
                                        return;
                                    }

                                    var index = gu.getCmp('etc_grid').getStore().indexOf(record);
                                    if (direction < 0) {
                                        index--;
                                        if (index < 0) {
                                            return;
                                        }
                                    } else {
                                        index++;
                                        if (index >= gu.getCmp('etc_grid').getStore().getCount()) {
                                            return;
                                        }
                                    }
                                    gu.getCmp('etc_grid').getStore().remove(record);
                                    gu.getCmp('etc_grid').getStore().insert(index, record);
                                    gu.getCmp('etc_grid').getSelectionModel().select(index, true);
                                }
                            }]
                        }
                    ]
                })
            ]
        });


        gm.me().gridIds = [];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '고객사, P/I 정보 입력',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '작성일 ',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'create_date',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: new Date()
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '담당자 ',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            displayField: 'user_name',
                            valueField: 'unique_id',
                            store: Ext.create('Mplm.store.UserSalerBIOTStore', {}),
                            name: 'reserved_number2'
                        },
                        {
                            fieldLabel: '고객사 ',
                            xtype: 'combo',
                            name: 'reserved_number1',
                            mode: 'local',
                            anchor: '100%',
                            width: '99%',
                            editable: true,
                            displayField: 'wa_name',
                            store: Ext.create('Mplm.store.CombstStore', {}),
                            sortInfo: {field: 'wa_code', direction: 'ASC'},
                            valueField: 'unique_id',
                            allowBlank: false,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false,
                            minChars: 1,
                            pageSize: 25,
                            triggerAction: 'all',
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
                                }
                            }
                        },
                        {
                            fieldLabel: 'P/I 발행일 ',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'regist_date',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: new Date()
                        },
                        {
                            fieldLabel: 'Ref. PO# ',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar1',
                        },
                        {
                            fieldLabel: 'P/O Recv ',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'reserved_timestamp2',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: new Date()
                        },
                        {
                            fieldLabel: 'Site',
                            xtype: 'combo',
                            anchor: '100%',
                            width: '99%',
                            name: 'site',
                            mode: 'local',
                            displayField: 'division_name',
                            store: Ext.create('Mplm.store.ComCstStore', {}),
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            valueField: 'division_code',
                            typeAhead: false,
                            allowBlank: false,
                            minChars: 1,
                            flex: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{division_code}</div>';
                                }
                            }
                        },
                        {
                            items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: 'Po Issued By ',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                default: {
                                    flex: 1
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: 'reserved_varchar2',
                                        width: 390,
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'reserved_varchar3',
                                        width: 390,
                                    }
                                ]
                            }]
                        },
                        {
                            fieldLabel: 'Remark ',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'remark',
                            allowBlank: true,
                        },
                    ]
                },
                {
                    items: [
                        {
                            xtype: 'fieldset',
                            frame: true,
                            title: 'Description',
                            width: '100%',
                            height: '100%',
                            layout: 'fit',
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items: [
                                etc_grid,
                                {
                                    fieldLabel: 'Estimate Time Departure',
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    allowBlank: true,
                                    width: '99%',
                                    name: 'item_etd',
                                },
                            ]
                        }]
                },
                {
                    xtype: 'fieldset',
                    title: '배송 & 지불조건 입력',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: 'Incoterms',
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: true,
                            displayField: 'codeName',
                            store: Ext.create('Mplm.store.IncotermsStore', {}),
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            valueField: 'systemCode',
                            typeAhead: false,
                            allowBlank: false,
                            minChars: 1,
                            flex: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{codeName}</div>';
                                }
                            },
                            width: '99%',
                            name: 'reserved_varchar4',
                        },
                        {
                            fieldLabel: '결제방법',
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            displayField: 'codeName',
                            store: Ext.create('Mplm.store.PaytermStore', {}),
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            valueField: 'systemCode',
                            typeAhead: false,
                            allowBlank: false,
                            minChars: 1,
                            flex: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{codeName}</div>';
                                }
                            },
                            width: '99%',
                            name: 'reserved_varchar5',
                        },
                        {
                            fieldLabel: 'Packing',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar6',
                        },
                        {
                            fieldLabel: 'Port of Departure',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar7',
                        },
                        {
                            fieldLabel: 'Vessel/Flight',
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            editable: true,
                            allowBlank: true,
                            queryMode: 'remote',
                            anchor: '100%',
                            width: '99%',
                            displayField: 'ship_kr',
                            valueField: 'ship',
                            store: shippingStore,
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            name: 'reserved_varchar8',
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{ship}">{ship_kr} </font></div>';
                                }
                            }
                        },
                    ]
                },
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: this.getMC('mes_SRO1_title_write', '작성'),
            width: 950,
            height: 700,
            plain: true,
            items: form,
            overflowY: 'scroll',
            buttons: [
                {
                    text: this.getMC('mes_SRO1_title_write', '작성'),
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                var objs = [];
                                var storeData = gu.getCmp('etc_grid').getStore();
                                var obj = {};
                                var columns = [];
                                for (var j = 0; j < storeData.data.items.length; j++) {
                                    var item = storeData.data.items[j];
                                    var objv = {};
                                    objv['srcahd_uid'] = item.get('srcahd_uid');
                                    objv['srcmap_uid'] = item.get('srcmap_uid');
                                    objv['sg_code'] = item.get('sg_code');
                                    objv['item_code'] = item.get('item_code');
                                    objv['supplier_code'] = item.get('supplier_code');
                                    objv['sales_price'] = item.get('sales_price');
                                    objv['currency'] = item.get('currency');
                                    objv['bm_quan'] = item.get('bm_quan');
                                    objv['unit_code'] = item.get('unit_code');
                                    objv['delivery_date'] = item.get('delivery_date');
                                    objv['remark'] = item.get('remark');
                                    columns.push(objv);
                                }
                                obj['datas'] = columns;
                                objs.push(obj);
                                var jsonData = Ext.util.JSON.encode(objs);
                                form.submit({
                                    url: CONTEXT_PATH + '/purchase/prch.do?method=insertEstBIOT&copy_flag=N',
                                    waitMsg: '데이터를 저장중입니다.',
                                    params: {
                                        jsonData: jsonData
                                    },
                                    success: function (val, action) {
                                        if (prWin) {
                                            prWin.close();
                                        }
                                        Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                        gm.me().store.load();
                                    },
                                    failure: function (val, action) {
                                        if (prWin) {
                                            console_log('failure');
                                            Ext.MessageBox.alert(error_msg_prompt, '부적절한 값이 들어갔거나 필수 입력 항목값이 입력되지 않았습니다.');
                                            prWin.close();
                                        }
                                    }
                                });
                            }
                        }
                    }
                }, {
                    text: '취소',
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    }
                }
            ]
        });
        prWin.show();
    },

    getPrdEstimate: function () {
        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'addItemAction',
            disabled: false,
            id: gu.id('addElementEstimate'),
            text: '제품추가',
            handler: function (widget, event) {
                var partGridWidth = '20%';
                var searchItemGrid = Ext.create('Ext.grid.Panel', {
                    store: gm.me().searchDetailStore,
                    layout: 'fit',
                    title: '제품검색',
                    plugins: [gm.me().cellEditing],
                    columns: [
                        {text: "품번", flex: 1, style: 'text-align:center', dataIndex: 'item_code', sortable: true},
                        {text: "품명", flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true},
                        {text: "규격", flex: 2, style: 'text-align:center', dataIndex: 'specification', sortable: true},
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 700,
                    height: 600,
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: gm.me().searchDetailStore,
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
                                console_logs('record', record);
                                gm.me().searchDetailStoreSrcMap.getProxy().setExtraParam('fix_type', 'SE');
                                gm.me().searchDetailStoreSrcMap.getProxy().setExtraParam('srcahd_uid', record.get('unique_id_long'));
                                gm.me().searchDetailStoreSrcMap.load();
                            }
                        },
                        emptyText: '<div style="text-align:center; padding-top:20% ">No Data..</div>'
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
                                        gm.me().redrawSearchStore('ES');
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            gm.me().redrawSearchStore('ES');
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
                                        gm.me().redrawSearchStore('ES');
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            gm.me().redrawSearchStore('ES');
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
                                        gm.me().redrawSearchStore('ES');
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            gm.me().redrawSearchStore('ES');
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                }
                            ]
                        }]
                });

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
                    model: gm.me().searchDetailStoreSrcMap
                });

                var saveForm = Ext.create('Ext.grid.Panel', {
                    store: saveStore,
                    id: 'saveGrid',
                    layout: 'fit',
                    flex: 0.5,
                    title: '저장목록',
                    region: 'west',
                    style: 'padding-left:10px;',
                    plugins: [gm.me().cellEditing_save],
                    columns: [
                        {text: "계약명", flex: 1, style: 'text-align:center', dataIndex: 'supplier_name', sortable: true},
                        {text: "고객사", flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true},
                        {text: "사업부", flex: 1, style: 'text-align:center', dataIndex: 'supplier_code', sortable: true},
                        {text: "단가", flex: 1, style: 'text-align:center', dataIndex: 'sales_price', sortable: true},
                        {
                            text: "수량",
                            flex: 1,
                            style: 'text-align:center',
                            dataIndex: 'bm_quan',
                            sortable: true,
                            editor: {},
                            css: 'edit-cell',
                            renderer: function (value, meta) {
                                meta.css = 'custom-column';
                                if (value == null || value.length < 1) {
                                    value = 1;
                                }
                                return value;
                            }
                        }
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 700,
                    height: 600,

                });

                saveForm.on('edit', function (editor, e) {
                    var rec = e.record;
                    var field = e['field'];
                    rec.set(field, rec.get(field));
                });

                var priceForm = Ext.create('Ext.grid.Panel', {
                    store: gm.me().searchDetailStoreSrcMap,
                    id: gu.id('priceSelectGrid'),
                    layout: 'fit',
                    title: '판매단가조회',
                    region: 'east',
                    style: 'padding-left:10px;',
                    plugins: [gm.me().cellEditing_save],

                    columns: [
                        {text: "계약명", flex: 1, style: 'text-align:center', dataIndex: 'supplier_name', sortable: true},
                        {text: "고객사", flex: 1, style: 'text-align:center', dataIndex: 'buyer_name', sortable: true},
                        {text: "사업부", flex: 1, style: 'text-align:center', dataIndex: 'division_code', sortable: true},
                        {text: "단가", flex: 1, style: 'text-align:center', dataIndex: 'sales_price', sortable: true},
                        {
                            text: "수량",
                            flex: 1,
                            style: 'text-align:center',
                            dataIndex: 'bm_quan',
                            sortable: true,
                            editor: {},
                            css: 'edit-cell',
                            renderer: function (value, meta) {
                                meta.css = 'custom-column';
                                if (value == null || value.length < 1) {
                                    value = 1;
                                }
                                return value;
                            }
                        }
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 400,
                    height: 300,
                    emptyText: '<div style="text-align:center; padding-top:20% ">No Data...</div>'
                });

                var winProduct = Ext.create('ModalWindow', {
                    title: '제품추가',
                    width: 1100,
                    height: 600,
                    minWidth: 600,
                    minHeight: 300,
                    items: [
                        searchItemGrid, priceForm
                    ],
                    buttons: [
                        {
                            text: CMD_OK,
                            handler: function (btn) {
                                winProduct.setLoading(true);
                                if (btn == "no") {
                                    winProduct.setLoading(false);
                                    winProduct.close();
                                } else {
                                    var items = gu.getCmp('priceSelectGrid').getSelectionModel().getSelection();
                                    var store = gu.getCmp('etc_grid').getStore();
                                    console_logs('store.length ????', store.getCount());
                                    var store_cnt = store.getCount();
                                    console_logs('store >>>> ', store);
                                    console_logs('>>>>>>> items ????? ', items);
                                    for (var i = 0; i < items.length; i++) {
                                        var item = items[i];
                                        var id = item.get('srcahd_uid'); // srcahd uid
                                        var item_code = item.get('item_code');
                                        var middel_type_full = item.get('middel_type_full');
                                        var description = item.get('description');
                                        var supplier_code = item.get('supplier_code');
                                        var currency = item.get('currency');
                                        var unit_code = item.get('unit_code');
                                        var quan = item.get('bm_quan');
                                        var sg_code = item.get('sg_code');
                                        var sales_price = item.get('sales_price');
                                        var unit_code = item.get('unit_code');
                                        var srcmap_uid = item.get('unique_id_long');
                                        if (quan == null || quan == undefined || quan.length < 1) {
                                            quan = 1;
                                        }
                                        var unit = item.get('unit_code');
                                        var currency = item.get('currency');
                                        var po_date = new Date();
                                        var present_date = new Date();
                                        var delivery_plan = present_date.setMonth(present_date.getMonth() + 2);
                                        var delivery_plan_parse = new Date(delivery_plan);
                                        var sales_price = item.get('sales_price');


                                        store.insert(store.getCount(), new Ext.data.Record({
                                            'middel_type_full': middel_type_full,
                                            'srcahd_uid': id,
                                            'item_code': item_code,
                                            // 'description': description,
                                            'description': '',
                                            'supplier_code': supplier_code,
                                            'currency': currency,
                                            'bm_quan': quan,
                                            'unit_code': unit_code,
                                            'sg_code': sg_code,
                                            'sales_price': sales_price,
                                            'reserved_varchar9': unit_code,
                                            'srcmap_uid': srcmap_uid,
                                            'delivery_date': ''
                                        }));
                                        gm.me().searchDetailStore.removeAll();
                                        gm.me().searchDetailStoreSrcMap.removeAll();
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


    getPrdEstimateExtra: function () {
        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'addItemAction',
            disabled: false,
            id: gu.id('addElementEstimate'),
            text: '제품추가',
            handler: function (widget, event) {
                var partGridWidth = '20%';
                var searchItemGrid = Ext.create('Ext.grid.Panel', {
                    store: gm.me().searchDetailStore,
                    layout: 'fit',
                    title: '제품검색',
                    plugins: [gm.me().cellEditing],
                    columns: [
                        {text: "품번", flex: 1, style: 'text-align:center', dataIndex: 'item_code', sortable: true},
                        {text: "품명", flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true},
                        {text: "규격", flex: 2, style: 'text-align:center', dataIndex: 'specification', sortable: true},
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 700,
                    height: 600,
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: gm.me().searchDetailStore,
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
                                console_logs('record', record);
                                gm.me().searchDetailStoreSrcMap.getProxy().setExtraParam('fix_type', 'SE');
                                gm.me().searchDetailStoreSrcMap.getProxy().setExtraParam('srcahd_uid', record.get('unique_id_long'));
                                gm.me().searchDetailStoreSrcMap.load();
                            }
                        },
                        emptyText: '<div style="text-align:center; padding-top:20% ">No Data..</div>'
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
                                        gm.me().redrawSearchStore('ES');
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            gm.me().redrawSearchStore('ES');
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
                                        gm.me().redrawSearchStore('ES');
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            gm.me().redrawSearchStore('ES');
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
                                        gm.me().redrawSearchStore('ES');
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            gm.me().redrawSearchStore('ES');
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                }
                            ]
                        }]
                });

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
                    model: gm.me().searchDetailStoreSrcMap
                });

                var saveForm = Ext.create('Ext.grid.Panel', {
                    store: saveStore,
                    id: 'saveGrid',
                    layout: 'fit',
                    flex: 0.5,
                    title: '저장목록',
                    region: 'west',
                    style: 'padding-left:10px;',
                    plugins: [gm.me().cellEditing_save],
                    columns: [
                        {text: "계약명", flex: 1, style: 'text-align:center', dataIndex: 'supplier_name', sortable: true},
                        {text: "고객사", flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true},
                        {text: "사업부", flex: 1, style: 'text-align:center', dataIndex: 'supplier_code', sortable: true},
                        {text: "단가", flex: 1, style: 'text-align:center', dataIndex: 'sales_price', sortable: true},
                        {
                            text: "수량",
                            flex: 1,
                            style: 'text-align:center',
                            dataIndex: 'bm_quan',
                            sortable: true,
                            editor: {},
                            css: 'edit-cell',
                            renderer: function (value, meta) {
                                meta.css = 'custom-column';
                                if (value == null || value.length < 1) {
                                    value = 1;
                                }
                                return value;
                            }
                        }
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 700,
                    height: 600,

                });

                saveForm.on('edit', function (editor, e) {
                    var rec = e.record;
                    var field = e['field'];
                    rec.set(field, rec.get(field));
                });

                var priceForm = Ext.create('Ext.grid.Panel', {
                    store: gm.me().searchDetailStoreSrcMap,
                    id: gu.id('priceSelectGridExtra'),
                    layout: 'fit',
                    title: '판매단가조회',
                    region: 'east',
                    style: 'padding-left:10px;',
                    plugins: [gm.me().cellEditing_save],

                    columns: [
                        {text: "계약명", flex: 1, style: 'text-align:center', dataIndex: 'supplier_name', sortable: true},
                        {text: "고객사", flex: 1, style: 'text-align:center', dataIndex: 'buyer_name', sortable: true},
                        {text: "사업부", flex: 1, style: 'text-align:center', dataIndex: 'division_code', sortable: true},
                        {text: "단가", flex: 1, style: 'text-align:center', dataIndex: 'sales_price', sortable: true},
                        {
                            text: "수량",
                            flex: 1,
                            style: 'text-align:center',
                            dataIndex: 'bm_quan',
                            sortable: true,
                            editor: {},
                            css: 'edit-cell',
                            renderer: function (value, meta) {
                                meta.css = 'custom-column';
                                if (value == null || value.length < 1) {
                                    value = 1;
                                }
                                return value;
                            }
                        }
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 400,
                    height: 300,
                    emptyText: '<div style="text-align:center; padding-top:20% ">No Data...</div>'
                });

                var winProduct = Ext.create('ModalWindow', {
                    title: '제품추가',
                    width: 1100,
                    height: 600,
                    minWidth: 600,
                    minHeight: 300,
                    items: [
                        searchItemGrid, priceForm
                    ],
                    buttons: [
                        {
                            text: CMD_OK,
                            handler: function (btn) {
                                winProduct.setLoading(true);
                                if (btn == "no") {
                                    winProduct.setLoading(false);
                                    winProduct.close();
                                } else {
                                    var items = gu.getCmp('priceSelectGridExtra').getSelectionModel().getSelection();
                                    var store = gu.getCmp('productGridExtra').getStore();
                                    console_logs('store.length ????', store.getCount());
                                    var store_cnt = store.getCount();
                                    console_logs('store >>>> ', store);
                                    console_logs('>>>>>>> items ????? ', items);
                                    for (var i = 0; i < items.length; i++) {
                                        var item = items[i];
                                        var id = item.get('srcahd_uid'); // srcahd uid
                                        var item_code = item.get('item_code');
                                        var middel_type_full = item.get('middel_type_full');
                                        var description = item.get('description');
                                        var supplier_code = item.get('supplier_code');
                                        var currency = item.get('currency');
                                        var unit_code = item.get('unit_code');
                                        var quan = item.get('bm_quan');
                                        var sg_code = item.get('sg_code');
                                        var sales_price = item.get('sales_price');
                                        var unit_code = item.get('unit_code');
                                        var srcmap_uid = item.get('unique_id_long');
                                        if (quan == null || quan == undefined || quan.length < 1) {
                                            quan = 1;
                                        }
                                        var unit = item.get('unit_code');
                                        var currency = item.get('currency');
                                        var po_date = new Date();
                                        var present_date = new Date();
                                        var delivery_plan = present_date.setMonth(present_date.getMonth() + 2);
                                        var delivery_plan_parse = new Date(delivery_plan);
                                        var sales_price = item.get('sales_price');


                                        store.insert(store.getCount(), new Ext.data.Record({
                                            'middel_type_full': middel_type_full,
                                            'srcahd_uid': id,
                                            'item_code': item_code,
                                            'description': description,
                                            'supplier_code': supplier_code,
                                            'currency': currency,
                                            'bm_quan': quan,
                                            'unit_code': unit_code,
                                            'sg_code': sg_code,
                                            'sales_price': sales_price,
                                            'reserved_varchar9': unit_code,
                                            'srcmap_uid': srcmap_uid
                                        }));
                                        gm.me().searchDetailStore.removeAll();
                                        gm.me().searchDetailStoreSrcMap.removeAll();
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
            text: '제품추가',
            handler: function (widget, event) {
                if (gu.getCmp('reserved_varcharb').getValue() == null) {
                    Ext.MessageBox.alert('알림', '거래구분이 입력되지 않았습니다.');
                    return;
                }
                // 스토어 거래구분과 고객명이 입력될 떄 미리 돌아야 하며.
                // 무상샘플은 전체 제품 리스트를 나열해야 한다.
                // 정상거래와 유상샘플은 지정된 고객에 등록된 제품만 나열해야 한다.
                if (gu.getCmp('reserved_varcharb').getValue() === 'N' || gu.getCmp('reserved_varcharb').getValue() === 'P') {
                    if (gu.getCmp('order_com_unique').getValue() == null) {
                        Ext.MessageBox.alert('알림', '거래구분이 정상거래, 유상샘플이 선택 되었을 경우 고객명이 반드시 입력되어야 합니다');
                        return;
                    } else {
                        gm.me().searchDetailStoreOnlySrcMap.getProxy().setExtraParam('srcmap_comastUid', gu.getCmp('order_com_unique').getValue());
                        gm.me().searchDetailStoreOnlySrcMap.pageSize = 100;
                        gm.me().searchDetailStoreOnlySrcMap.load();
                    }
                } else if (gu.getCmp('reserved_varcharb').getValue() === 'F') {
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
                        {
                            text: "사업부",
                            flex: 0.8,
                            style: 'text-align:center',
                            dataIndex: 'supplier_code',
                            sortable: true
                        },
                        {text: "모델명", flex: 0.8, style: 'text-align:center', dataIndex: 'item_name', sortable: true},
                        {text: "기준모델", flex: 0.8, style: 'text-align:center', dataIndex: 'description', sortable: true},
                        {text: "규격", flex: 1.8, style: 'text-align:center', dataIndex: 'specification', sortable: true},
                        {
                            text: "판매단가",
                            flex: 1,
                            align: 'right',
                            style: 'text-align:center',
                            dataIndex: 'sales_price',
                            sortable: true
                        },
                        {text: "통화", flex: 0.5, style: 'text-align:center', dataIndex: 'currency', sortable: true},
                        {
                            text: "수량",
                            flex: 0.5,
                            dataIndex: 'bm_quan',
                            sortable: false,
                            // editor: 'numberfield',
                            align: 'right',

                            // css: 'edit-cell',
                            style: 'text-align:center',
                            renderer: function (value, meta) {
                                // meta.css = 'custom-column';
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
                                            gm.me().redrawSearchStore();

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
                                            gm.me().redrawSearchStore();
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
                                }
                            ]
                        }]
                });

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
                        {text: "모델명", flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true},
                        {text: "기준모델", flex: 1, dataIndex: 'description', style: 'text-align:center', sortable: true},
                        {text: "규격", flex: 2, dataIndex: 'specification', style: 'text-align:center', sortable: true},
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
                            winProduct.setLoading(true);

                            if (btn == "no") {
                                winProduct.setLoading(false);
                                winProduct.close();
                            } else {
                                var items = saveStore.data.items;
                                var store = gu.getCmp('productGrid').getStore();
                                var sales_price_total_disp = 0;
                                var bm_quan_total_disp = 0.0;
                                var store_cnt = store.getCount();
                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];
                                    var id = item.get('unique_id_long'); // srcahd uid
                                    var sg_code = item.get('sg_code');
                                    var class_name = item.get('class_name');
                                    var item_code = item.get('item_code');
                                    var site = item.get('supplier_code');
                                    var description = item.get('description');
                                    var quan = item.get('bm_quan');
                                    var unit = item.get('unit_code');
                                    var currency = item.get('currency');
                                    var po_date = new Date();
                                    var present_date = new Date();
                                    var delivery_plan = present_date.setMonth(present_date.getMonth() + 2);
                                    var delivery_plan_parse = new Date(delivery_plan);
                                    var sales_price = item.get('sales_price');
                                    if (quan == null || quan == undefined || quan.length < 1) {
                                        quan = 1;
                                    }
                                    bm_quan_total_disp = Number(bm_quan_total_disp) + Number(quan);

                                    if (gu.getCmp('reserved_varcharb').getValue() === 'F') {
                                        Ext.MessageBox.alert('단가조정', '무상샘플인 경우 단가가 자동으로 0으로 지정됩니다.');
                                        sales_price = 0.0;
                                    }
                                    sales_price_total_disp = Number(sales_price_total_disp) + (Number(sales_price) * Number(quan));

                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'srcahd_uid': id,
                                        'sg_code': sg_code,
                                        'class_code': class_name,
                                        'reserved_varcharg': site,
                                        'sales_price': sales_price,
                                        'item_code': item_code,
                                        'regist_date': po_date,
                                        'reserved_varchar8': currency,
                                        'reserved_varchar9': unit,
                                        'delivery_plan': delivery_plan_parse,
                                        'description': description,
                                        'bm_quan': quan
                                    }));
                                }

                                if (store_cnt === 0) {
                                    gu.getCmp('po_total').setValue(bm_quan_total_disp);
                                    gu.getCmp('po_price').setValue(sales_price_total_disp);
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
                                }

                                gm.me().searchDetailStore.removeAll();
                                gm.me().searchDetailStoreSrcMap.removeAll();
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

    pdfDownload: function (size, reportSelection, pos) {
        if (size > pos) {
            var unique_id = reportSelection[pos].get('unique_id');
            console_logs('uid>>>> ', unique_id);
            var state = reportSelection[pos].get('state');
            Ext.Ajax.request({
                waitMsg: '다운로드 요청중입니다.<br> 잠시만 기다려주세요.',
                url: CONTEXT_PATH + '/pdf.do?method=printEst',
                params: {
                    pdfPrint: 'pdfPrint',
                    is_rotate: 'N',
                    rtgast_uids: unique_id,
                    state: state
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
    },

    prdDetailLoad: function () {
        gu.getCmp('selectedMtrl').setHtml('등록된 수주건을 선택하십시오.');
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

    modifyPoEsWindow: function (rec) {
        gm.me().gridIds = [];
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        var shippingStore_mod_es = Ext.create('Ext.data.Store', {
            fields: ['ship', 'ship_kr'],
            data: [
                {"ship": "OCEAN", "ship_kr": "OCEAN"}
            ]
        });
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: this.getMC('mes_SRO1_title_customer_P/I', '고객사, P/I 정보 입력'),
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_create_date', '작성일 '),
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'create_date',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: new Date()
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: this.getMC('mes_SRO1_column_manager', '담당자 '),
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            displayField: 'user_name',
                            valueField: 'user_name',
                            store: Ext.create('Mplm.store.UserSalerBIOTStore', {}),
                            name: 'project_manager',
                            value: rec.get('project_manager')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_customer', '고객사 '),
                            xtype: 'combo',
                            name: 'buyer_company',
                            mode: 'local',
                            anchor: '100%',
                            width: '99%',
                            editable: true,
                            displayField: 'wa_name',
                            store: Ext.create('Mplm.store.CombstStore', {}),
                            sortInfo: {field: 'wa_code', direction: 'ASC'},
                            valueField: 'wa_name',
                            allowBlank: false,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false,
                            minChars: 1,
                            pageSize: 25,
                            triggerAction: 'all',
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
                                }
                            },
                            value: rec.get('buyer_company')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_P/I_published_date', 'P/I 발행일 '),
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'regist_date',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: rec.get('recv_date_str')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_ref_PO', 'Ref. PO# '),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar1',
                            value: rec.get('reserved_varchar1')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_P/O_revc', 'P/O Recv '),
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'reserved_timestamp2',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: rec.get('reserved_timestamp2_str')

                        },
                        {
                            items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: 'Po Issued By ',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                default: {
                                    flex: 1
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: 'reserved_varchar2',
                                        width: 390,
                                        value: rec.get('reserved_varchar2')
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'reserved_varchar3',
                                        width: 390,
                                        value: rec.get('reserved_varchar3')
                                    }
                                ]
                            }]
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_remark', 'Remark '),
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'remark',
                            allowBlank: true,
                            value: rec.get('reserved_varchara')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_estimatetime_departure', 'Estimate Time Departure'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'item_etd',
                            value: rec.get('reserved_varchar10')
                        },

                        {
                            xtype: 'hiddenfield',
                            name: 'rtgast_uid',
                            value: rec.get('unique_id_long')
                        }, {
                            xtype: 'hiddenfield',
                            name: 'reserved_number3',
                            value: rec.get('reserved_number3')
                        },
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: this.getMC('mes_SRO1_title_shipping_payment_terms', '배송 & 지불조건 입력'),
                    frame: true,
                    width: '99%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: 'Shipping Terms',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar4',
                            value: rec.get('reserved_varchar4')
                        },
                        {
                            fieldLabel: 'Payment condition',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar5',
                            value: rec.get('reserved_varchar5')
                        },
                        {
                            fieldLabel: 'Packing',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar6',
                            value: rec.get('reserved_varchar6')
                        },
                        {
                            fieldLabel: 'Port of Departure',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar7',
                            value: rec.get('reserved_varchar7')
                        },
                        {
                            fieldLabel: 'Vessel/Flight',
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            editable: true,
                            allowBlank: true,
                            queryMode: 'remote',
                            anchor: '100%',
                            width: '99%',
                            displayField: 'ship_kr',
                            valueField: 'ship',
                            store: shippingStore_mod_es,
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            name: 'reserved_varchar8',
                            value: rec.get('reserved_varchar8'),
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{ship}">{ship_kr} </font></div>';
                                }
                            }
                        },
                    ]
                },
            ]
        });

        var totalPrice = 0;
        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: 950,
            height: 650,
            plain: true,
            items: form,
            overflowY: 'scroll',
            buttons: [
                {
                    text: gm.getMC('CMD_MODIFY', '수정'),
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                form.submit({
                                    url: CONTEXT_PATH + '/purchase/prch.do?method=modifyEstBIOT',
                                    waitMsg: '수정중입니다.',
                                    params: {},
                                    success: function (val, action) {
                                        if (prWin) {
                                            prWin.close();
                                        }
                                        Ext.MessageBox.alert('확인', '수정 되었습니다.');
                                        gm.me().store.load();
                                        gm.me().estiContentStore.load(function (record) {
                                            gm.me().estiContentRecords = record;
                                        })
                                    },
                                    failure: function (val, action) {
                                        if (prWin) {
                                            console_log('failure');
                                            Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                            prWin.close();
                                        }
                                    }
                                });
                            }
                        }
                    }
                }, {
                    text: '취소',
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    }
                }
            ]
        });

        prWin.show();
    },

    createEsFieldSet: function (system_code, system_name, code_uid, mode) {
        var grid = gm.me().createEsGrid(system_code, code_uid);
        var fieldset = {
            xtype: 'fieldset',
            id: gu.id('fieldset-' + system_code),
            title: 'Description',
            frame: true,
            width: '100%',
            height: '100%',
            layout: 'fit',
            defaults: {
                margin: '2 2 2 2'
            },
            items: [
                grid,
            ]
        };

        var store = grid.getStore();

        if (mode === 'ADD') {
            store.insert(store.getCount(), new Ext.data.Record({
                'esti_uid': -1,
                'item_name': '내용을 입력해주세요',
                'sales_price': ''
            }));
        }

        return fieldset;
    },

    createEsFieldSet: function (system_code, system_name, code_uid, mode) {
        var grid = gm.me().createEsGrid(system_code, code_uid);
        var fieldset = {
            xtype: 'fieldset',
            id: gu.id('fieldset-' + system_code),
            title: 'Description',
            frame: true,
            width: '100%',
            height: '100%',
            layout: 'fit',
            defaults: {
                margin: '2 2 2 2'
            },
            items: [
                grid,
            ]
        };

        var store = grid.getStore();

        if (mode === 'ADD') {
            store.insert(store.getCount(), new Ext.data.Record({
                'esti_uid': -1,
                'item_name': '내용을 입력해주세요',
                'sales_price': ''
            }));
        }

        return fieldset;
    },


    createEsGrid: function (system_code) {

        var unitStore_mod = Ext.create('Ext.data.Store', {
            fields: ['unit', 'unit_kr'],
            data: [
                {"unit": "PCS", "unit_kr": "PCS"},
                {"unit": "SETS", "unit_kr": "SETS"},
            ]
        });

        var muStore_mod = Ext.create('Ext.data.Store', {
            fields: ['mu', 'mu_kr'],
            data: [
                {"mu": "US", "mu_kr": "US"},
            ]
        });

        var articleStore_mod = Ext.create('Ext.data.Store', {
            fields: ['arti', 'arti_kr'],
            data: [
                {"arti": "ECG", "arti_kr": "ECG"},
                {"arti": "ESU", "arti_kr": "ESU PLATE"},
                {"arti": "SMP", "arti_kr": "SMOKE PENCIL"},
                {"arti": "NEO", "arti_kr": "NEO"},
                {"arti": "EEG", "arti_kr": "EEG"},
                {"arti": "TENS", "arti_kr": "TENS"},
                {"arti": "SPO2", "arti_kr": "SPO2"},
                {"arti": "EMG", "arti_kr": "EMG"}
            ]
        });

        var shippingStore_mod = Ext.create('Ext.data.Store', {
            fields: ['ship', 'ship_kr'],
            data: [
                {"ship": "OCEAN", "ship_kr": "OCEAN"}
            ]
        });


        var grid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('grid-' + system_code),
            collapsible: false,
            multiSelect: false,
            width: 900,
            autoScroll: true,
            autoHeight: true,
            frame: false,
            border: true,
            layout: 'fit',
            forceFit: true,
            columns: [
                {
                    text: '제품구분',
                    width: '30%',
                    dataIndex: 'sg_code',
                    style: 'text-align:center',
                    sortInfo: {field: 'arti_kr', direction: 'DESC'},
                    valueField: 'sg_code',
                    typeAhead: false,
                    allowBlank: false,
                    minChars: 1,
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function () {
                            return '<div data-qtip="{unique_id}">[{arti}] {arti_kr}</div>';
                        }
                    },
                    sortable: false
                },
                {
                    text: '제품명',
                    width: '40%',
                    dataIndex: 'item_code',
                    style: 'text-align:center',
                    sortable: false,
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            field.setValue(newValue.toUpperCase());
                        }
                    }
                },
                {
                    text: '사업부',
                    width: '40%',
                    dataIndex: 'supplier_code',
                    style: 'text-align:center',
                    sortable: false,
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            field.setValue(newValue.toUpperCase());
                        }
                    }
                },

                {
                    text: '단가',
                    width: '45%',
                    dataIndex: 'sales_price',
                    editor: 'numberfield',
                    decimalPrecision: 5,
                    align: 'right',
                    style: 'text-align:center',
                    sortable: false
                },
                {
                    text: '통화',
                    width: '35%',
                    dataIndex: 'currency',
                    style: 'text-align:center',
                    sortInfo: {field: 'mu_kr', direction: 'DESC'},
                    typeAhead: false,
                    allowBlank: false,
                    sortable: false
                },
                {
                    text: '수량',
                    width: '30%',
                    dataIndex: 'bm_quan',
                    editor: 'numberfield',
                    align: 'right',
                    style: 'text-align:center',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'bm_quan') {
                            context.record.set('bm_quan', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    sortable: false
                },
                {
                    text: 'UNIT',
                    width: '20%',
                    dataIndex: 'unit_code',
                    style: 'text-align:center',
                    sortInfo: {field: 'um_kr', direction: 'DESC'},
                    valueField: 'unit_code',
                    typeAhead: false,
                    allowBlank: false,
                    minChars: 1,
                    sortable: false
                },
                {
                    text: '납기일',
                    width: '30%',
                    dataIndex: 'delivery_date',
                    style: 'text-align:center',
                    format: 'Y-m-d',
                    submitFormat: 'Y-m-d',
                    editor: new Ext.form.DateField({
                        disabled: false,
                        format: 'Y-m-d'
                    }),
                    sortable: false,
                    renderer: function (field) {
                        if (field === '0000-00-00') {
                            return null;
                        } else {
                            var formated = Ext.util.Format.date(field, 'Y-m-d');
                            return formated;
                        }
                    }
                },
                {
                    text: 'Remark',
                    width: '40%',
                    dataIndex: 'remark',
                    editor: 'textfield',
                    style: 'text-align:center',
                    sortable: false
                }
            ],
            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            listeners: {
                beforeedit: function (editor, context, eOpts) {
                    if (context.field == 'sales_price') {
                        context.record.set('sales_price', '');
                    }
                    if (context.field == 'item_name') {
                        context.record.set('item_name', '');
                    }
                },


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
                        gm.me().getPrdEstimateModifyCopy(system_code),
                        {
                            text: '제품삭제',
                            iconCls: 'af-remove',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('grid-' + system_code).getSelectionModel().getSelected().items[0];
                                    gu.getCmp('grid-' + system_code).getStore().removeAt(gu.getCmp('grid-' + system_code).getStore().indexOf(record));
                                }
                            }]
                        },
                        {
                            text: '▲',
                            listeners: [{
                                click: function () {
                                    var direction = -1;
                                    var grid = gu.getCmp('grid-' + system_code);
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
                                    grid.getStore().remove(record);
                                    grid.getStore().insert(index, record);
                                    grid.getSelectionModel().select(index, true);
                                }
                            }]
                        },
                        {
                            text: '▼',
                            listeners: [{
                                click: function () {
                                    var direction = 1;
                                    var grid = gu.getCmp('grid-' + system_code);
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
                                    grid.getStore().remove(record);
                                    grid.getStore().insert(index, record);
                                    grid.getSelectionModel().select(index, true);
                                }
                            }]
                        }
                    ]
                })
            ]
        });

        gm.me().gridIds.push(system_code);
        return grid;
    },

    getPrdEstimateModifyCopy: function (system_code) {
        var action = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            itemId: 'addItemAction',
            disabled: false,
            id: gu.id('addElementEstimate'),
            text: '제품추가',
            handler: function (widget, event) {
                var partGridWidth = '20%';
                var searchItemGrid = Ext.create('Ext.grid.Panel', {
                    store: gm.me().searchDetailStore,
                    layout: 'fit',
                    title: '제품검색',
                    plugins: [gm.me().cellEditing],
                    columns: [
                        {text: "품번", flex: 1, style: 'text-align:center', dataIndex: 'item_code', sortable: true},
                        {text: "품명", flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true},
                        {text: "규격", flex: 2, style: 'text-align:center', dataIndex: 'specification', sortable: true},
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 700,
                    height: 600,
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: gm.me().searchDetailStore,
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
                                console_logs('record', record);
                                gm.me().searchDetailStoreSrcMap.getProxy().setExtraParam('fix_type', 'SE');
                                gm.me().searchDetailStoreSrcMap.getProxy().setExtraParam('srcahd_uid', record.get('unique_id_long'));
                                gm.me().searchDetailStoreSrcMap.load();
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
                                        gm.me().redrawSearchStore('ES');
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            gm.me().redrawSearchStore('ES');
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
                                        gm.me().redrawSearchStore('ES');
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            gm.me().redrawSearchStore('ES');
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
                                        gm.me().redrawSearchStore('ES');
                                    },
                                    listeners: {
                                        change: function (fieldObj, e) {
                                            gm.me().redrawSearchStore('ES');
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                }
                            ]
                        }]
                });
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
                    model: gm.me().searchDetailStoreSrcMap
                });

                var saveForm = Ext.create('Ext.grid.Panel', {
                    store: saveStore,
                    id: 'saveGrid',
                    layout: 'fit',
                    flex: 0.5,
                    title: '저장목록',
                    region: 'west',
                    style: 'padding-left:10px;',
                    plugins: [gm.me().cellEditing_save],
                    columns: [
                        {text: "계약명", flex: 1, style: 'text-align:center', dataIndex: 'supplier_name', sortable: true},
                        {text: "고객사", flex: 1, style: 'text-align:center', dataIndex: 'item_code', sortable: true},
                        {text: "사업부", flex: 1, style: 'text-align:center', dataIndex: 'supplier_code', sortable: true},
                        // {text: "규격", flex: 1, style: 'text-align:center', dataIndex: 'specification', sortable: true},
                        {text: "단가", flex: 1, style: 'text-align:center', dataIndex: 'sales_price', sortable: true},
                        {
                            text: "수량",
                            flex: 1,
                            style: 'text-align:center',
                            dataIndex: 'bm_quan',
                            sortable: true,
                            editor: {},
                            css: 'edit-cell',
                            renderer: function (value, meta) {
                                meta.css = 'custom-column';
                                if (value == null || value.length < 1) {
                                    value = 1;
                                }
                                return value;
                            }
                        }
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 700,
                    height: 600,

                });

                saveForm.on('edit', function (editor, e) {
                    var rec = e.record;
                    var field = e['field'];
                    rec.set(field, rec.get(field));
                });

                var priceForm = Ext.create('Ext.grid.Panel', {
                    store: gm.me().searchDetailStoreSrcMap,
                    id: gu.id('priceSelectGrid'),
                    layout: 'fit',
                    title: '판매단가조회',
                    region: 'east',
                    style: 'padding-left:10px;',
                    plugins: [gm.me().cellEditing_save],

                    columns: [
                        {text: "계약명", flex: 1, style: 'text-align:center', dataIndex: 'supplier_name', sortable: true},
                        {text: "고객사", flex: 1, style: 'text-align:center', dataIndex: 'buyer_name', sortable: true},
                        {text: "사업부", flex: 1, style: 'text-align:center', dataIndex: 'supplier_code', sortable: true},
                        // {text: "규격", flex: 1, style: 'text-align:center', dataIndex: 'specification', sortable: true},
                        {text: "단가", flex: 1, style: 'text-align:center', dataIndex: 'sales_price', sortable: true},
                        {
                            text: "수량",
                            flex: 1,
                            style: 'text-align:center',
                            dataIndex: 'bm_quan',
                            sortable: true,
                            editor: {},
                            css: 'edit-cell',
                            renderer: function (value, meta) {
                                meta.css = 'custom-column';
                                if (value == null || value.length < 1) {
                                    value = 1;
                                }
                                return value;
                            }
                        }
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 400,
                    height: 300,
                });

                var winProduct = Ext.create('ModalWindow', {
                    title: '제품추가',
                    width: 1100,
                    height: 600,
                    minWidth: 600,
                    minHeight: 300,
                    items: [
                        searchItemGrid, priceForm
                    ],
                    buttons: [
                        {
                            text: CMD_OK,
                            handler: function (btn) {
                                winProduct.setLoading(true);
                                if (btn == "no") {
                                    winProduct.setLoading(false);
                                    winProduct.close();
                                } else {
                                    var items = gu.getCmp('priceSelectGrid').getSelectionModel().getSelection();
                                    var store = gu.getCmp('grid-' + system_code).getStore();
                                    console_logs('store >>>> ', store);
                                    console_logs('>>>>>>> items ????? ', items);
                                    for (var i = 0; i < items.length; i++) {
                                        var item = items[i];
                                        var id = item.get('srcahd_uid'); // srcahd uid
                                        var item_code = item.get('item_code');
                                        var description = item.get('description');
                                        var supplier_code = item.get('supplier_code');
                                        var currency = item.get('currency');
                                        var unit_code = item.get('unit_code');
                                        var quan = item.get('bm_quan');
                                        var sg_code = item.get('sg_code');
                                        var sales_price = item.get('sales_price');
                                        var unit_code = item.get('unit_code');
                                        var srcmap_uid = item.get('unique_id_long');
                                        if (quan == null || quan == undefined || quan.length < 1) {
                                            quan = 1;
                                        }

                                        store.insert(store.getCount(), new Ext.data.Record({
                                            'srcahd_uid': id,
                                            'esti_uid': -1,
                                            'item_code': item_code,
                                            'description': description,
                                            'supplier_code': supplier_code,
                                            'currency': currency,
                                            'bm_quan': quan,
                                            'unit_code': unit_code,
                                            'sg_code': sg_code,
                                            'sales_price': sales_price,
                                            'reserved_varchar9': unit_code,
                                            'srcmap_uid': srcmap_uid
                                        }));

                                        // console_logs('store In data >>>> ', store);
                                        gm.me().searchDetailStore.removeAll();
                                        gm.me().searchDetailStoreSrcMap.removeAll();
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

    copyPoEsWindow: function (rec) {
        gm.me().gridIds = [];

        var shippingStore_mod_copy = Ext.create('Ext.data.Store', {
            fields: ['ship', 'ship_kr'],
            data: [
                {"ship": "OCEAN", "ship_kr": "OCEAN"}
            ]
        });

        var paymentStore = Ext.create('Mplm.store.PaytermStore', {});
        var incotermsStore = Ext.create('Mplm.store.IncotermsStore', {});

        paymentStore.load();
        incotermsStore.load();


        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: this.getMC('mes_SRO1_title_customer_P/I', '고객사, P/I 정보 입력'),
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_create_date', '작성일 '),
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'create_date',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: new Date()
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: this.getMC('mes_SRO1_column_manager', '담당자 '),
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            displayField: 'user_name',
                            valueField: 'user_name',
                            store: Ext.create('Mplm.store.UserSalerBIOTStore', {}),
                            name: 'project_manager',
                            value: rec.get('project_manager')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_customer', '고객사 '),
                            xtype: 'combo',
                            name: 'buyer_company',
                            mode: 'local',
                            anchor: '100%',
                            width: '99%',
                            editable: true,
                            displayField: 'wa_name',
                            store: Ext.create('Mplm.store.CombstStore', {}),
                            sortInfo: {field: 'wa_code', direction: 'ASC'},
                            valueField: 'wa_name',
                            allowBlank: false,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false,
                            minChars: 1,
                            pageSize: 25,
                            triggerAction: 'all',
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
                                }
                            },
                            value: rec.get('buyer_company')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_P/I_published_date', 'P/I 발행일 '),
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'regist_date',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: rec.get('recv_date_str')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_ref_PO', 'Ref. PO# '),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar1',
                            value: rec.get('reserved_varchar1')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_P/O_revc', 'P/O Recv '),
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'reserved_timestamp2',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: rec.get('reserved_timestamp2_str')

                        },
                        {
                            items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: 'Po Issued By ',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                default: {
                                    flex: 1
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: 'reserved_varchar2',
                                        width: 390,
                                        value: rec.get('reserved_varchar2')
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'reserved_varchar3',
                                        width: 390,
                                        value: rec.get('reserved_varchar3')
                                    }
                                ]
                            }]
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_remark', 'Remark '),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'remark',
                            value: rec.get('reserved_varchara')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_estimatetime_departure', 'Estimate Time Departure'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'item_etd',
                            value: rec.get('reserved_varchar10')
                        },
                        {
                            xtype: 'hiddenfield',
                            name: 'rtgast_uid',
                            value: rec.get('unique_id_long')
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: this.getMC('mes_SRO1_title_shipping_payment_terms', '배송 & 지불조건 입력'),
                    frame: true,
                    width: '99%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_incoterms', 'Incoterms'),
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: true,
                            displayField: 'codeName',
                            store: incotermsStore,
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            valueField: 'systemCode',
                            typeAhead: false,
                            allowBlank: false,
                            minChars: 1,
                            flex: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{codeName}</div>';
                                }
                            },
                            width: '99%',
                            name: 'reserved_varchar4',
                            value: rec.get('reserved_varchar4')
                        },
                        {
                            fieldLabel: this.getMC('prf1_pay_type', '결제방법'),
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            displayField: 'codeName',
                            store: paymentStore,
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            valueField: 'systemCode',
                            typeAhead: false,
                            allowBlank: false,
                            minChars: 1,
                            flex: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{codeName}</div>';
                                }
                            },
                            width: '99%',
                            name: 'reserved_varchar5',
                            value: rec.get('reserved_varchar5')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_packing', 'Packing'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar6',
                            value: rec.get('reserved_varchar6')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_port_of_departure', 'Port of Departure'),
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar7',
                            value: rec.get('reserved_varchar7')
                        },
                        {
                            fieldLabel: this.getMC('mes_SRO1_column_vessel/flight', 'Vessel/Flight'),
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            editable: true,
                            allowBlank: true,
                            queryMode: 'remote',
                            anchor: '100%',
                            width: '99%',
                            displayField: 'ship_kr',
                            valueField: 'ship',
                            store: shippingStore_mod_copy,
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            name: 'reserved_varchar8',
                            value: rec.get('reserved_varchar8'),
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{ship}">{ship_kr} </font></div>';
                                }
                            }
                        },
                    ]
                }
            ]
        });

        for (var i = 0; i < gm.me().estiContentRecords.length; i++) {
            var rec = gm.me().estiContentRecords[i];
            var system_code = rec.get('code_name');
            var system_name = rec.get('code_name_kr');
            var code_uid = rec.get('code_uid');

            if (gm.me().gridIds.indexOf(system_code) < 0) {
                gu.getCmp('formPanel').insert(gu.getCmp('formPanel').items.length - 0.5,
                    gm.me().createEsFieldSet(system_code, system_name, code_uid, 'COPY'));
                var curFieldSet = gu.getCmp('fieldset-' + system_code);
                var curFieldItems = curFieldSet.items.items;

                for (var j = 0; j < curFieldItems.length; j++) {
                    if (curFieldItems[j].name != undefined && curFieldItems[j].name === 'totalPrice-' + system_code) {
                        console_logs('rec totalPrice >>>> ', rec.get('total_price'));
                        curFieldItems[j].setValue(rec.get('total_price'));
                    } else if (curFieldItems[j].name != undefined && curFieldItems[j].name === 'codeUid-' + system_code) {
                        curFieldItems[j].setValue(rec.get('code_uid'));
                    }
                }
            }

            var store = gu.getCmp('grid-' + system_code).getStore();
            var item_code = rec.get('item_model')
            var bm_quan = rec.get('item_quan');
            var item_pcs = rec.get('item_pcs');
            var item_munit = rec.get('item_munit');
            var srcahd_uid = rec.get('srcahd_uid');
            var srcmap_uid = rec.get('srcmap_uid');
            var remark = rec.get('item_remark');
            var delivery_date = rec.get('delivery_date');
            var sg_code = rec.get('item_name')
            var supplier_code = rec.get('division_code');
            var supplier_code = rec.get('division_code');
            var sales_price = rec.get('item_unit_price');
            var esti_uid = rec.get('unique_id_long');

            store.insert(store.getCount(), new Ext.data.Record({
                'esti_uid': esti_uid,
                'srcahd_uid': srcahd_uid,
                'srcmap_uid': srcmap_uid,
                'sg_code': sg_code,
                'item_code': item_code,
                'supplier_code': supplier_code,
                'unit_code': item_pcs,
                'sales_price': sales_price,
                'bm_quan': bm_quan,
                'currency': item_munit,
                'delivery_date': delivery_date,
                'remark': remark
            }));
        }

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '견적서 복사등록',
            width: 950,
            height: 700,
            plain: true,
            items: form,
            overflowY: 'scroll',
            buttons: [
                {
                    text: '복사등록',
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                var objs = [];
                                for (var i = 0; i < gm.me().gridIds.length; i++) {
                                    var id = gm.me().gridIds[i];
                                    var storeData = gu.getCmp('grid-' + id).getStore();
                                    var obj = {};
                                    var columns = [];
                                    for (var j = 0; j < storeData.data.items.length; j++) {
                                        var item = storeData.data.items[j];
                                        var objv = {};
                                        objv['srcahd_uid'] = item.get('srcahd_uid');
                                        objv['srcmap_uid'] = item.get('srcmap_uid');
                                        objv['sg_code'] = item.get('sg_code');
                                        objv['item_code'] = item.get('item_code');
                                        objv['supplier_code'] = item.get('supplier_code');
                                        objv['sales_price'] = item.get('sales_price');
                                        objv['currency'] = item.get('currency');
                                        objv['bm_quan'] = item.get('bm_quan');
                                        objv['unit_code'] = item.get('unit_code');
                                        objv['delivery_date'] = item.get('delivery_date');
                                        objv['remark'] = item.get('remark');
                                        columns.push(objv);
                                    }
                                    obj['datas'] = columns;
                                    objs.push(obj);
                                }
                                var jsonData = Ext.util.JSON.encode(objs);
                                form.submit({
                                    url: CONTEXT_PATH + '/purchase/prch.do?method=insertEstBIOT&copy_flag=Y',
                                    waitMsg: '견적서를 등록 중 입니다.',
                                    params: {
                                        jsonData: jsonData
                                    },
                                    success: function (val, action) {
                                        if (prWin) {
                                            prWin.close();
                                        }
                                        Ext.MessageBox.alert('확인', '복사등록 되었습니다.');
                                        gm.me().store.load();
                                        gm.me().estiContentStore.load(function (record) {
                                            gm.me().estiContentRecords = record;
                                        })
                                    },
                                    failure: function (val, action) {
                                        if (prWin) {
                                            console_log('failure');
                                            Ext.MessageBox.alert(error_msg_prompt, '부적절한 값이 들어갔거나 필수 항목이 입력되지 않았습니다. 다시 확인해주세요.');
                                        }
                                    }
                                });
                            }
                        }
                    }
                }, {
                    text: '작성 취소',
                    handler: function () {
                        if (prWin) {
                            prWin.close();
                        }
                    }
                }]
        });

        prWin.show();
    },

    estimateConfirmByApprover: function (rec, site) {
        Ext.MessageBox.show({
            title: this.getMC('CMD_CHECK_QUOTE', '견적확정'),
            msg: '선택 한 건을 확정 처리 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn) {
                if (btn == "no") {
                    return;
                } else {
                    var unique_id = rec.get('unique_id_long');
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/prch.do?method=confirmEstiByApprove',
                        params: {
                            unique_id: unique_id,
                            site: site
                        },
                        success: function (result, request) {
                            Ext.MessageBox.alert('알림', '선택 건이 확정처리 되었습니다.');
                            gm.me().store.load();
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                }
            }
        });
    },

    clientConfirm: function (rec) {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('addWthInWindow'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            height: '100%',
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    frame: true,
                    border: false,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '확인일자',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            format: 'Y-m-d',
                            name: 'aprv_date',
                            value: new Date(),
                        },
                        {
                            fieldLabel: '확인자',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            editable: false,
                            name: 'approver',
                            value: vCUR_USER_NAME,
                            fieldStyle: 'background-color: #ebe8e8; background-image: none;',
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: this.getMC('CMD_CUSTOMER_APPROVAL', '고객승인'),
            width: 400,
            height: 150,
            plain: true,
            items: form,
            buttons: [{
                text: '저장',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            form.submit({
                                url: CONTEXT_PATH + '/purchase/prch.do?method=aprvClientInsertSrcMap',
                                waitMsg: '데이터를 처리중입니다.',
                                params: {
                                    rtgast_uid: rec.get('unique_id_long'),
                                    combst_uid: rec.get('reserved_number1')
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                    gm.me().store.load(function () {
                                    });

                                },
                                failure: function (val, action) {
                                    if (prWin) {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        prWin.close();
                                        gm.me().store.load(function () {
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            }, {
                text: '취소',
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }
            ]
        });
        prWin.show();
    },

    estiContentStore: Ext.create('Rfx2.store.company.hanjung.EstiContentStore', {}),
    estiSpecStore: Ext.create('Rfx2.store.company.hanjung.EstiSelStore', {}),
    estiPfStore: Ext.create('Rfx2.store.company.hanjung.EstiPfStore', {}),

    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchStore', {}),
    searchDetailStoreSrcMap: Ext.create('Mplm.store.ProductPriceInfoStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),
    combstStore: Ext.create('Mplm.store.CombstStore', {pageSize: 1000}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    cStore: Ext.create('Mplm.store.ComCstStore', {}),
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_NEW_DIVISION'}),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_CONDITION'}),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_TYPE'}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SAMPLE_TYPE'})
});



