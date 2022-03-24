Ext.define('Rfx2.view.gongbang.salesDelivery.RecvPoEsView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'receved-po-es-view',
    gridIds: [],
    estiContentStore: Ext.create('Rfx2.store.company.hanjung.EstiContentStore', {}),
    estiSpecStore: Ext.create('Rfx2.store.company.hanjung.EstiSelStore', {}),
    estiPfStore: Ext.create('Rfx2.store.company.hanjung.EstiPfStore', {}),
    etd: null,
    selectedNationCode: null,
    selectedAreaCode: null,
    estiContentRecords: null,
    initComponent: function () {
        //모델을 통한 스토어 생성
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
        var objs = [];
        //검색툴바 필드 초기화
        this.initSearchField();
        this.addSearchField(
            {
                type: 'combo'
                , field_id: 'state'
                , store: "EstimateStateStore"
                , emptyText: '진행상태'
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
            , params: {dept_code: "BPH301"}
            , innerTpl: '<div data-qtip="{dept_name}">{user_name}</div>'
        });
        // this.addSearchField('saler_name');
        // this.addSearchField('reserved_varchar5');
        // this.addSearchField('reserved_varchar1');

        this.createPoEsAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '견적서작성',
            tooltip: '견적서작성',
            handler: function () {
                gm.me().addPoEsWindow();
            }
        });

        this.modifyPoEsAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '견적서수정',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                gm.me().modifyPoEsWindow(rec);
            }
        });

        this.copyPoEsAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: '복사등록',
            tooltip: '견적서 복사등록',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                console_logs('>>>>>> rec ????? ', rec);
                gm.me().copyPoEsWindow(rec);
            }
        });

        this.pdfAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '견적서',
            tooltip: '견적서를 PDF파일로 출력합니다.',
            disabled: true,
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                console_logs('selections>>>> ', selections);
                if (selections.length > 0) {
                    gm.me().pdfDownload(selections.length, selections, 0);
                } else {
                    Ext.Msg.alert('알림', '출력할 견적서를 선택하십시오.');
                }
            }
        });

        this.sendMailAction = Ext.create('Ext.Action', {
            iconCls: 'af-external-link',
            text: '메일전송',
            disabled: true,
            handler: function (widget, event) {
                console_logs('==>', gm.me().grid.getSelectionModel().getSelection());
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                var state = rec.get('state');
                var supplier_name = '';
                var rtgast_uid = rec.get('unique_id_long');//rtgast_uid
                var supplier_email_address = rec.get('supplier_email_address');
                var po_no = rec.get('po_no');//po_no
                var po_detail = /*Ext.getCmp('po_detail').getValue()*/'';
                var email = vCUR_EMAIL;
                switch (vCompanyReserved4) {
                    case 'KBTC01KR':
                        email = 'ikbtech001@gmail.com';
                        break;
                    case 'HJSV01KR':
                        email = 'hanjung001@gmail.com';
                        break;
                    default:
                        break;
                }
                var byCompany = ''; // "/발주서 -(주)제이엔에스";
                switch (vCompanyReserved4) {
                    case 'HJSV01KR':
                        byCompany = '(주)한중특장';
                        supplier_name = rec.get('reserved_varchar4') + '고객님 ';
                        break;
                    case 'BIOT01KR':
                        byCompany = '(주)바이오프로테크';
                        supplier_name = rec.get('buyer_company');
                        break;
                    default:
                        break;
                }

                po_detail = po_detail.replace(/(?:\r\n|\r|\n)/g, '<br />');
                po_detail = po_detail + "<br /><br />---------------------------------------------------------------------------------------<br/>";
                po_detail = po_detail + "본 메일주소는 발신전용이오니 기타 문의사항은 " + byCompany + "으로 문의해주시기 바랍니다.<br/><br/>";
                po_detail = po_detail + supplier_name + "귀하" + "<br/>";

                po_detail = po_detail + "Tel: 031)672-4301~2 / 031)284-6060 <br/>";
                po_detail = po_detail + "Fax: 031)672-4304 <br/>";
                var mailForm = Ext.create('Ext.form.Panel', {
                    id: 'formPanelSendmail',
                    defaultType: 'textfield',
                    border: false,
                    bodyPadding: 15,
                    region: 'center',
                    defaults: {
                        anchor: '100%',
                        allowBlank: false,
                        msgTarget: 'side',
                        labelWidth: 100
                    },
                    items: [
                        new Ext.form.Hidden({
                            name: 'rtgast_uid',
                            value: rtgast_uid
                        }),
                        new Ext.form.Hidden({
                            name: 'po_no',
                            value: po_no
                        }),
                        {
                            name: 'mailTo',
                            fieldLabel: '고객 메일주소',
                            allowBlank: false,
                            value: supplier_email_address,
                            anchor: '100%'
                        },
                        {
                            name: 'mailSubject',
                            fieldLabel: '제목',
                            allowBlank: false,
                            value: '[견적번호 : ' + po_no + ']' + supplier_name + '견적서 전송합니다. ' + byCompany,
                            anchor: '100%'
                        },
                        {
                            name: 'mailContents',
                            allowBlank: false,
                            xtype: 'htmleditor',
                            value: po_detail,
                            height: 240,
                            anchor: '100%'
                        },
                        {
                            xtype: 'filefield',
                            emptyText: '견적서 PDF 파일을 첨부하세요.',
                            buttonText: '업로드',
                            hidden: true,
                            allowBlank: true,
                            buttonConfig: {
                                iconCls: 'af-upload'
                            },
                            anchor: '100%'
                        }
                    ]
                });

                var win = Ext.create('ModalWindow', {
                    title: '견적서 메일 전송',
                    width: 750,
                    height: 430,
                    items: mailForm,
                    buttons: [{
                        text: '메일전송 ' + CMD_OK,
                        handler: function () {
                            var form = Ext.getCmp('formPanelSendmail').getForm();
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                vFILE_ITEM_CODE = RandomString(10);
                                val["file_itemcode"] = vFILE_ITEM_CODE;
                                mailForm.submit({
                                    url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
                                    waitMsg: '전송 파일을 다운로드 중입니다.',
                                    success: function (fp, o) {
                                        console_logs('save  success', o);
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/pdf.do?method=printEsAndSendMail',
                                            waitMsg: '메일 전송중입니다.',
                                            params: {
                                                rtgast_uid: val['rtgast_uid'],
                                                from_addr: email,
                                                sender: byCompany,
                                                po_no: val['po_no'],
                                                mailTo: val['mailTo'],
                                                mailSubject: val['mailSubject'],
                                                mailContents: val['mailContents'],
                                                file_itemcode: vFILE_ITEM_CODE,
                                                state: state,
                                                pdfPrint: 'sendMail'
                                            },
                                            success: function (result, request) {
                                                console_logs('save  success2', result);
                                                if (win) {
                                                    win.close();
                                                }
                                                Ext.MessageBox.alert('전송확인', '전송되었습니다.');
                                            },
                                            failure: extjsUtil.failureMessage
                                        });
                                    },
                                    failure: function () {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                    }
                                });
                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function () {
                            if (win) {
                                win.close();
                            }
                        }
                    }
                    ]
                });
                win.show();
            }//endofhandler
        });

        this.sendFaxAction = Ext.create('Ext.Action', {
            iconCls: 'af-external-link',
            text: 'FAX 전송',
            disabled: true,
            handler: function (widget, event) {
                console_logs('==>', gm.me().grid.getSelectionModel().getSelection());
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                var supplier_name = '';
                var rtgast_uid = rec.get('unique_id_long');//rtgast_uid
                var supplier_email_address = rec.get('supplier_email_address');
                var po_no = rec.get('po_no');//po_no
                var po_detail = /*Ext.getCmp('po_detail').getValue()*/'';
            }//endofhandler
        });

        this.esReturnAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-reject',
            text: '견적취소',
            tooltip: '해당 견적건을 취소합니다.',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                var unique_id = rec.get('unique_id');
                gm.me().esReturnWork(unique_id);
            }
        });

        this.addPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '수주등록',
            tooltip: '수주등록',
            disabled: true,
            handler: function () {
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
                                            decimalPrecision: 5,
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

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'EDIT', 'COPY'
            ],
        });
        buttonToolbar.insert(1, this.modifyPoEsAction);
        buttonToolbar.insert(1, this.createPoEsAction);
        buttonToolbar.insert(3, this.copyPoEsAction);
        //buttonToolbar.insert(4, this.estToPoAction);
        buttonToolbar.insert(4, this.addPoAction);
        buttonToolbar.insert(5, this.esReturnAction);
        buttonToolbar.insert(10, '-');
        buttonToolbar.insert(9, this.pdfAction);
        buttonToolbar.insert(10, this.sendMailAction);
        // buttonToolbar.insert(11, this.sendFaxAction);
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 7) {
                buttonToolbar.items.remove(item);
            }
        });


        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length) {

                estimate_wb = 0;
                estimate_re = 0;
                estimate_ch = 0;
                estimate_ch = 0;

                var rec = selections[0];

                var reserved_number1 = gm.me().grid.getSelectionModel().getSelection()[0].get('reserved_number1');

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
                this.pdfAction.enable();
                this.sendMailAction.enable();
                this.sendFaxAction.enable();
                if (rec.get('state') == 'C' || rec.get('state') == 'T') {
                    this.esReturnAction.disable();
                    //this.estToPoAction.disable();
                    this.addPoAction.disable();
                } else {
                    this.esReturnAction.enable();
                    //this.estToPoAction.enable();
                    this.addPoAction.enable();
                }
                var rtgastUid = rec.get('unique_id_long');

                gm.me().estiContentStore.getProxy().setExtraParam('rtgastUid', rtgastUid);
                gm.me().estiContentStore.load(function (record) {
                    objs = [];
                    gm.me().estiContentRecords = record;
                    var obj = {};
                    console_logs(gm.me().estiContentRecords);
                    var rec = gm.me().estiContentRecords;
                    var columns = [];
                    for (var i = 0; i < rec.length; i++) {
                        var sel = rec[i];
                        var objv = {};
                        // console_logs('>>> sel', sel);
                        var code_uid = sel.get('code_uid');
                        var item_model = sel.get('item_model');
                        var total_price = sel.get('total_price');
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

            } else {
                this.copyPoEsAction.disable();
                this.modifyPoEsAction.disable();
                this.pdfAction.disable();
                this.esReturnAction.disable();
                //this.estToPoAction.disable();
                this.addPoAction.disable();
            }
        });

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.setRowClass(function (record, index) {
            console_logs('record>>>', record);
            var c = record.get('state');
            switch (c) {
                case 'T':
                    return 'green-row';
                    break;
                case 'C':
                    return 'red-row';
                    break;
                default:
                    break;
            }
        });
        //grid 생성.
        this.createGrid(arr);
        //입력/상세 창 생성.
        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });
        this.callParent(arguments);
        //디폴트 로드
        gm.setCenterLoading(false);
        this.store.load();
        this.loadStoreAlways = true;
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
                    text: '단가',
                    width: '45%',
                    dataIndex: 'sales_price',
                    editor: 'numberfield',
                    decimalPrecision: 5,
                    align: 'right',
                    // renderer: function (value, context, meta) {
                    //     if (context.field == 'sales_price') {
                    //         context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                    //     }
                    //     return Ext.util.Format.number(value, "0,00/i");
                    // },
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
                    title: '견적서1',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '견적일자',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'create_date',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: new Date()
                        },
                        {
                            fieldLabel: '고객사',
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
                            xtype: 'combo',
                            fieldLabel: '영업담당자',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            displayField: 'user_name',
                            store: Ext.create('Mplm.store.UserStore', { blocking_flag: 'N' }),
                            valueField: 'unique_id',
                            name: 'reserved_number2',
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{user_name}</div>';
                                }
                            }
                        },
                        {
                            fieldLabel: '견적유효기간',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'regist_date',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: new Date()
                        },
                        {
                            fieldLabel: '견적조건',
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar1',
                            store: gm.me().payConditionStore,
                            emptyText: '선택',
                            displayField: 'codeName',
                            valueField: 'codeName',
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                }
                            }
                        },
                        {
                            fieldLabel: '수주여부',
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar1',
                            store: gm.me().ynFlagStore,
                            emptyText: gm.me().getMC('msg_order_dia_prd_empty_msg', '선택해주세요'),
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                }
                            }
                        },
                        {
                            fieldLabel: '특이사항 ',
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
                            title: '제품',
                            width: '100%',
                            height: '100%',
                            layout: 'fit',
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items: [
                                etc_grid,
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

                                            fieldLabel: gm.me().getMC('msg_order_dia_prd_total_quan', '수량'),
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
                                        }
                                    ]

                                }
                            ]
                        }]
                },
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '작성',
            width: 950,
            height: 700,
            plain: true,
            items: form,
            overflowY: 'scroll',
            buttons: [
                {
                    text: '작성',
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
                                    objv['supplier_code'] = item.get('division_code');
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

    addElement: function () {
        // var estiSpecStore =Ext.create('Rfx2.store.company.hanjung.EstiSelStore', {});
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('elementFormPanel'),
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
                    title: '추가할 사양을 선택해 주세요',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '사양 선택',
                            id: gu.id('sel_option'),
                            xtype: 'combo',
                            anchor: '100%',
                            width: '98%',
                            displayField: 'obj_name',
                            valueField: 'obj_type',
                            store: this.estiPfStore,
                            sortInfo: {field: 'specification', direction: 'ASC'},
                            name: 'sel_option',
                            listeners: {
                                select: function (combo, records, eOpts) {
                                    console_logs('records >>>> ', records);
                                    var sel_option_code = gu.getCmp('sel_option').getValue();
                                    var sel_option_name = gu.getCmp('sel_option').getRawValue();
                                    var code_uid = records.get('code_uid');
                                    gu.getCmp('code_name_kr').setValue(sel_option_name);
                                    gu.getCmp('code_uid').setValue(code_uid);
                                }
                            }

                        },
                        {
                            xtype: 'hiddenfield',
                            id: gu.id('code_name_kr'),
                            name: 'code_name_kr',
                            value: ''
                        },
                        {
                            xtype: 'hiddenfield',
                            id: gu.id('code_uid'),
                            name: 'code_uid',
                            value: ''
                        }
                    ]
                }
            ]
        });

        var subWin = Ext.create('Ext.Window', {
            modal: true,
            title: '항목추가',
            width: 500,
            height: 150,
            plain: true,
            items: form,
            autoScroll: true,
            buttons: [
                {
                    text: '사양추가',
                    handler: function () {
                        gm.me().addSpecList();
                    }
                }, {
                    text: '확인',
                    handler: function (btn) {
                        if (btn == 'no') {
                            subWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                var systemCode = val['sel_option'];
                                var code_name_kr = val['code_name_kr'];
                                var code_uid = val['code_uid'];
                                var formPanelKeys = gu.getCmp('formPanel').items.keys;
                                var isIncludeItem = false;
                                for (var i = 0; i < formPanelKeys.length; i++) {
                                    if (formPanelKeys[i].includes(gu.id(systemCode))) {
                                        isIncludeItem = true;
                                        break;
                                    }
                                }
                                if (!isIncludeItem) {
                                    gu.getCmp('formPanel').insert(gu.getCmp('formPanel').items.length - 1,
                                        gm.me().createEsFieldSet(systemCode, code_name_kr, code_uid, 'ADD'));
                                    if (subWin) {
                                        subWin.close();
                                    }
                                } else {
                                    Ext.Msg.alert('오류', '같은 항목을 중복으로 삽입할 수 없습니다.');
                                }
                            } else {
                                if (subWin) {
                                    subWin.close();
                                }
                            }
                        }
                    }
                }, {
                    text: '취소',
                    handler: function () {
                        if (subWin) {
                            subWin.close();
                        }
                    }
                }]
        });
        subWin.show();
    },

    addSpecList: function () {
        // var estiSpecStore =Ext.create('Rfx2.store.company.hanjung.EstiSelStore', {});
        var form = Ext.create('Ext.form.Panel', {
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
                    title: '추가할 사양의 제품군과 사양명을 입력해 주세요',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: gm.getMC('CMD_Product', '제품군'),
                            xtype: 'combo',
                            anchor: '100%',
                            width: '98%',
                            store: this.estiSpecStore,
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            name: 'spectype',
                        },
                        {
                            fieldLabel: '사양명',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '98%',
                            name: 'addspec',
                        }
                    ]
                }
            ]
        });

        var subWin = Ext.create('Ext.Window', {
            modal: true,
            title: '사양추가',
            width: 500,
            height: 190,
            plain: true,
            items: form,
            autoScroll: true,
            buttons: [
                {
                    text: '확인',
                    handler: function (btn) {
                        if (btn == 'no') {
                            subWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                var addspecname = val['addspec'];
                                var spectype = val['spectype'];
                                form.submit({
                                    url: CONTEXT_PATH + '/purchase/prch.do?method=addSpecList',
                                    waitMsg: '등록 중 입니다.',
                                    params: {
                                        addspecname: addspecname,
                                        spectype: spectype
                                    },
                                    success: function (val, action) {
                                        if (subWin) {
                                            subWin.close();
                                        }
                                        Ext.MessageBox.alert('확인', '등록되었습니다.');
                                        gm.me().estiPfStore.load(function () {
                                        });
                                    },
                                    failure: function (val, action) {
                                        if (subWin) {
                                            console_log('failure');
                                            Ext.MessageBox.alert(error_msg_prompt, '추가사양 등록이 실패되었습니다.');
                                            gm.me().estiPfStore.load(function () {
                                            });
                                            // prWin.close();
                                        }
                                    }
                                });
                            } else {
                                if (subWin) {
                                    subWin.close();
                                }
                            }
                        }
                    }
                }, {
                    text: '취소',
                    handler: function () {
                        if (subWin) {
                            subWin.close();
                        }
                    }
                }]
        });
        subWin.show();
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
                    title: '견적서 수정',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '견적일자',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'create_date',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: new Date()
                        },
                        {
                            fieldLabel: '고객사',
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
                            xtype: 'combo',
                            fieldLabel: '영업담당자',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            displayField: 'user_name',
                            store: Ext.create('Mplm.store.UserStore', { blocking_flag: 'N' }),
                            valueField: 'unique_id',
                            name: 'reserved_number2',
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{user_name}</div>';
                                }
                            }
                        },
                        {
                            fieldLabel: '견적유효기간',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'regist_date',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: new Date()
                        },
                        {
                            fieldLabel: '견적조건',
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar1',
                            store: gm.me().payConditionStore,
                            emptyText: '선택',
                            displayField: 'codeName',
                            valueField: 'codeName',
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                }
                            }
                        },
                        {
                            fieldLabel: '수주여부',
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar1',
                            store: gm.me().ynFlagStore,
                            emptyText: gm.me().getMC('msg_order_dia_prd_empty_msg', '선택해주세요'),
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No matching posts found.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                }
                            }
                        },
                        {
                            fieldLabel: '특이사항 ',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'remark',
                            allowBlank: true,
                        },
                    ]
                },
            ]
        });

        var totalPrice = 0;

        for (var i = 0; i < gm.me().estiContentRecords.length; i++) {
            var rec = gm.me().estiContentRecords[i];
            console_logs('estiContentRecords >>>', rec);
            var system_code = rec.get('code_name');
            var system_name = rec.get('code_name_kr');
            var code_uid = rec.get('code_uid');
            if (gm.me().gridIds.indexOf(system_code) < 0) {
                gu.getCmp('formPanel').insert(gu.getCmp('formPanel').items.length - 0.5,
                    gm.me().createEsFieldSet(system_code, system_name, code_uid, 'MODIFY'));
                var curFieldSet = gu.getCmp('fieldset-' + system_code);
                var curFieldItems = curFieldSet.items.items;
                console_logs('>>>>> curFieldItems.length', curFieldItems.length);
                console_logs('>>>>> curFieldItems', curFieldSet.items.items);
                for (var j = 0; j < curFieldItems.length; j++) {
                    if (curFieldItems[j].name != undefined && curFieldItems[j].name === 'totalPrice-' + system_code) {
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
            title: '수정',
            width: 950,
            height: 700,
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
                                var objs = [];
                                for (var i = 0; i < gm.me().gridIds.length; i++) {
                                    var id = gm.me().gridIds[i];
                                    var storeData = gu.getCmp('grid-' + id).getStore();
                                    var obj = {};
                                    // obj['totalPrice'] = val['totalPrice-' + id].replace(/,/g, '');
                                    // obj['codeUid'] = val['codeUid-' + id];
                                    var columns = [];
                                    for (var j = 0; j < storeData.data.items.length; j++) {
                                        var item = storeData.data.items[j];
                                        var objv = {};
                                        objv['esti_uid'] = item.get('esti_uid');
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
                                    url: CONTEXT_PATH + '/purchase/prch.do?method=modifyEstBIOT',
                                    waitMsg: '수정중입니다.',
                                    params: {
                                        jsonData: jsonData,
                                        // reserved_number3: reserved_number3
                                    },
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
            title: '제품 수정',
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
                    text: '단가',
                    width: '45%',
                    dataIndex: 'sales_price',
                    editor: 'numberfield',
                    decimalPrecision: 5,
                    align: 'right',
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

    copyPoEsWindow: function (rec) {
        gm.me().gridIds = [];

        var shippingStore_mod_copy = Ext.create('Ext.data.Store', {
            fields: ['ship', 'ship_kr'],
            data: [
                {"ship": "OCEAN", "ship_kr": "OCEAN"}
            ]
        });

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
                            valueField: 'user_name',
                            store: Ext.create('Mplm.store.UserSalerBIOTStore', {}),
                            name: 'project_manager',
                            value: rec.get('project_manager')
                        },
                        {
                            fieldLabel: '고객사 ',
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
                            fieldLabel: 'P/I 발행일 ',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            name: 'regist_date',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: rec.get('recv_date_str')
                        },
                        {
                            fieldLabel: 'Ref. PO# ',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar1',
                            value: rec.get('reserved_varchar1')
                        },
                        {
                            fieldLabel: 'P/O Recv ',
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
                            fieldLabel: 'Remark ',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'remark',
                            value: rec.get('reserved_varchara')
                        },
                        {
                            fieldLabel: 'Estimate Time Departure',
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
                    title: '배송 & 지불조건 입력',
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
    esReturnWork: function (unique_id) {
        Ext.MessageBox.show({
            title: '견적취소',
            msg: '선택한 건을 견적취소 하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn) {
                if (btn == "no") {
                    return;
                } else {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/prch.do?method=esReturn',
                        params: {
                            unique_id: unique_id
                        },
                        success: function (result, request) {
                            Ext.MessageBox.alert('알림', '해당 견적서가 취소처리 되었습니다.');
                            gm.me().store.load();
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                }
            }
        });
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
                    store: gm.me().searchDetailStore.load(),
                    layout: 'fit',
                    title: '제품검색',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    columns: [
                        {text: "품번1", flex: 2, style: 'text-align:center', dataIndex: 'item_code', sortable: true},
                        {text: "품명", flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true},
                        {text: "규격", flex: 1, style: 'text-align:center', dataIndex: 'specification', sortable: true},
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
                                record.commit();
                                console_logs('>>> ddd', record);
                                saveStore.add(record);
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
                    model: gm.me().searchDetailStore
                });

                var saveForm = Ext.create('Ext.grid.Panel', {
                    store: saveStore,
                    id: gu.id('saveGrid'),
                    layout: 'fit',
                    flex: 0.5,
                    title: '저장목록',
                    region: 'east',
                    style: 'padding-left:10px;',
                    plugins: [gm.me().cellEditing_save],
                    columns: [
                        {text: "품번", flex: 1, style: 'text-align:center', dataIndex: 'item_code', sortable: true},
                        {
                            text: gm.me().getMC('msg_product_add_dia_price', '단가'),
                            flex: 0.5,
                            dataIndex: 'sales_price',
                            editor: {},
                            align: 'right',
                            style: 'text-align:center',
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
                        {
                            text: gm.me().getMC('msg_order_grid_quan_desc', '수량'),
                            flex: 0.5,
                            dataIndex: 'bm_quan',
                            editor: {},
                            align: 'right',
                            style: 'text-align:center',
                            sortable: true,

                            renderer: function (value, context, tmeta) {
                                if (context.field == 'bm_quan') {
                                    context.record.set('bm_quan', Ext.util.Format.number(value, '0,00/i'));
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
                                                var record = gu.getCmp('saveGrid').getSelectionModel().getSelected().items[0];
                                                if (record == null) {
                                                    Ext.MessageBox.alert('알림', '삭제할 항목을 선택하십시오.')
                                                    return;
                                                } else {
                                                    gu.getCmp('saveGrid').getStore().removeAt(gu.getCmp('saveGrid').getStore().indexOf(record));
                                                }
                                            }
                                        }]
                                    },
                                ]
                            })
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

                var winProduct = Ext.create('ModalWindow', {
                    title: '제품추가',
                    width: 1100,
                    height: 600,
                    minWidth: 600,
                    minHeight: 300,
                    items: [
                        searchItemGrid, saveForm
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
                                    var items = saveStore.data.items;
                                    var store = gu.getCmp('etc_grid').getStore();
                                    console_logs('store.length ????', store.getCount());
                                    console_logs('길이확인베베',items.length);
                                    var store_cnt = store.getCount();
                                    console_logs('store >>>> ', store);
                                    console_logs('>>>>>>> items ????? ', items);
                                    var sales_price_total_disp = 0;
                                    var bm_quan_total_disp = 0.0;
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

                                        var unit = item.get('unit_code');
                                        var currency = item.get('currency');
                                        var po_date = new Date();
                                        var present_date = new Date();
                                        var delivery_plan = present_date.setMonth(present_date.getMonth() + 2);
                                        var delivery_plan_parse = new Date(delivery_plan);
                                        var sales_price = item.get('sales_price');
                                        
                                        bm_quan_total_disp = Number(bm_quan_total_disp) + Number(quan);
                                        sales_price_total_disp = Number(sales_price_total_disp) + (Number(sales_price) * Number(quan));

                                        store.insert(store.getCount(), new Ext.data.Record({
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
                        // {text: "품명", flex: 1.5, dataIndex: 'item_name', sortable: true},
                        // {text: "규격", flex: 1.5, dataIndex: 'specification', sortable: true},
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


    // getPrdAdd: function () {
    //     var action = Ext.create('Ext.Action', {
    //         iconCls: 'af-plus-circle',
    //         itemId: 'addItemAction',
    //         disabled: false,
    //         id: gu.id('addElementBtn'),
    //         text: '제품추가',
    //         handler: function (widget, event) {
    //             var partGridWidth = '20%';
    //             var searchItemGrid = Ext.create('Ext.grid.Panel', {
    //                 store: gm.me().searchDetailStore,
    //                 layout: 'fit',
    //                 title: '제품검색',
    //                 plugins: [gm.me().cellEditing],
    //                 columns: [
    //                     { text: "품번", flex: 1, style: 'text-align:center', dataIndex: 'item_code', sortable: true },
    //                     { text: "품명", flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true },
    //                     { text: "규격", flex: 2, style: 'text-align:center', dataIndex: 'specification', sortable: true },
    //                     {
    //                         text: "수량", flex: 1, style: 'text-align:center', dataIndex: 'bm_quan', sortable: true, editor: {},
    //                         css: 'edit-cell',
    //                         renderer: function (value, meta) {
    //                             meta.css = 'custom-column';
    //                             if (value == null || value.length < 1) {
    //                                 value = 1;
    //                             }
    //                             return value;
    //                         }
    //                     }
    //                 ],
    //                 multiSelect: true,
    //                 pageSize: 100,
    //                 width: 700,
    //                 height: 600,
    //                 bbar: Ext.create('Ext.PagingToolbar', {
    //                     store: gm.me().searchDetailStore,
    //                     displayInfo: true,
    //                     displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
    //                     emptyMsg: "표시할 항목이 없습니다."
    //                     , listeners: {
    //                         beforechange: function (page, currentPage) {

    //                         }
    //                     }

    //                 }),
    //                 viewConfig: {
    //                     listeners: {
    //                         'itemdblClick': function (view, record) {
    //                             console_logs('')
    //                             if(gu.getCmp('reserved_varcharb').getValue() == null) {
    //                                 Ext.MessageBox.alert('알림','거래구분이 입력되지 않았습니다.');
    //                                 return;
    //                             }
    //                             if(gu.getCmp('division_code').getValue() == null) {
    //                                 Ext.MessageBox.alert('알림','사업부가 입력되지 않았습니다.');
    //                                 return;
    //                             }

    //                             if(gu.getCmp('order_com_unique').getValue() == null) {
    //                                 Ext.MessageBox.alert('알림','고객사 입력되지 않았습니다.');
    //                                 return;
    //                             }


    //                             gm.me().searchDetailStoreSrcMap.getProxy().setExtraParam('srcahd_uid', record.get('unique_id_long'));
    //                             gm.me().searchDetailStoreSrcMap.getProxy().setExtraParam('order_com_unique', gu.getCmp('order_com_unique').getValue());
    //                             gm.me().searchDetailStoreSrcMap.getProxy().setExtraParam('division_code', gu.getCmp('division_code').getValue());
    //                             gm.me().searchDetailStoreSrcMap.getProxy().setExtraParam('srcahd_uid', record.get('unique_id_long'));
    //                             gm.me().searchDetailStoreSrcMap.load();
    //                             // saveStore.add(record);
    //                         }
    //                     },
    //                     emptyText: '<div style="text-align:center; padding-top:20% ">No Data..</div>'
    //                     // emptyText: 'No data...'
    //                 },
    //                 dockedItems: [
    //                     {
    //                         dock: 'top',
    //                         xtype: 'toolbar',
    //                         cls: 'my-x-toolbar-default1',
    //                         items: [
    //                             {
    //                                 width: partGridWidth,
    //                                 field_id: 'search_item_code',
    //                                 id: gu.id('search_item_code'),
    //                                 name: 'search_item_code',
    //                                 xtype: 'triggerfield',
    //                                 emptyText: '품목코드',
    //                                 trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    //                                 onTrigger1Click: function () {
    //                                     this.setValue('');
    //                                     gm.me().redrawSearchStore('PO');
    //                                 },
    //                                 listeners: {
    //                                     change: function (fieldObj, e) {
    //                                         gm.me().redrawSearchStore('PO');
    //                                     },
    //                                     render: function (c) {
    //                                         Ext.create('Ext.tip.ToolTip', {
    //                                             target: c.getEl(),
    //                                             html: c.emptyText
    //                                         });
    //                                     }
    //                                 }
    //                             },
    //                             {
    //                                 width: partGridWidth,
    //                                 field_id: 'search_item_name',
    //                                 id: gu.id('search_item_name'),
    //                                 name: 'search_item_name',
    //                                 xtype: 'triggerfield',
    //                                 emptyText: '품명',
    //                                 trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    //                                 onTrigger1Click: function () {
    //                                     this.setValue('');
    //                                     gm.me().redrawSearchStore('PO');
    //                                 },
    //                                 listeners: {
    //                                     change: function (fieldObj, e) {
    //                                         gm.me().redrawSearchStore('PO');
    //                                     },
    //                                     render: function (c) {
    //                                         Ext.create('Ext.tip.ToolTip', {
    //                                             target: c.getEl(),
    //                                             html: c.emptyText
    //                                         });
    //                                     }
    //                                 }
    //                             },
    //                             {
    //                                 width: partGridWidth,
    //                                 field_id: 'search_specification',
    //                                 id: gu.id('search_specification'),
    //                                 name: 'search_specification',
    //                                 xtype: 'triggerfield',
    //                                 emptyText: '규격',
    //                                 trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    //                                 onTrigger1Click: function () {
    //                                     this.setValue('');
    //                                     gm.me().redrawSearchStore('PO');
    //                                 },
    //                                 listeners: {
    //                                     change: function (fieldObj, e) {
    //                                         gm.me().redrawSearchStore('PO');
    //                                     },
    //                                     render: function (c) {
    //                                         Ext.create('Ext.tip.ToolTip', {
    //                                             target: c.getEl(),
    //                                             html: c.emptyText
    //                                         });
    //                                     }
    //                                 }
    //                             },
    //                             {
    //                                 width: partGridWidth,
    //                                 field_id: 'search_model_no',
    //                                 id: gu.id('search_model_no'),
    //                                 name: 'search_model_no',
    //                                 xtype: 'triggerfield',
    //                                 emptyText: '재질',
    //                                 trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    //                                 onTrigger1Click: function () {
    //                                     this.setValue('');
    //                                     gm.me().redrawSearchStore('PO');
    //                                 },
    //                                 listeners: {
    //                                     change: function (fieldObj, e) {
    //                                         gm.me().redrawSearchStore('PO');
    //                                     },
    //                                     render: function (c) {
    //                                         Ext.create('Ext.tip.ToolTip', {
    //                                             target: c.getEl(),
    //                                             html: c.emptyText
    //                                         });
    //                                     }
    //                                 }
    //                             }
    //                         ]
    //                     }] // endofdockeditems

    //             }); // endof Ext.create('Ext.grid.Panel',

    //             searchItemGrid.getSelectionModel().on({
    //                 selectionchange: function (sm, selections) {
    //                 }
    //             });

    //             searchItemGrid.on('edit', function (editor, e) {
    //                 var rec = e.record;
    //                 var field = e['field'];

    //                 rec.set(field, rec.get(field));

    //             });

    //             var saveStore = null;

    //             var saveStore = new Ext.data.Store({
    //                 model: gm.me().searchDetailStoreSrcMap
    //             });

    //             var saveForm = Ext.create('Ext.grid.Panel', {
    //                 store: gm.me().searchDetailStoreSrcMap,
    //                 id: gu.id('saveFormGrid_PrdAdd'),
    //                 layout: 'fit',
    //                 title: '판매단가조회',
    //                 region: 'east',
    //                 style: 'padding-left:10px;',
    //                 plugins: [gm.me().cellEditing_save],
    //                 columns: [
    //                     { text: "계약명", flex: 2, style: 'text-align:center', dataIndex: 'supplier_name', sortable: true },
    //                     { text: "고객사", flex: 2, style: 'text-align:center', dataIndex: 'buyer_name', sortable: true },
    //                     { text: "사업부", flex: 1, style: 'text-align:center', dataIndex: 'supplier_code', sortable: true },
    //                     { text: "단가", flex: 1, style: 'text-align:center', dataIndex: 'sales_price', sortable: true },
    //                     {
    //                         text: "수량", flex: 1, style: 'text-align:center', dataIndex: 'bm_quan', sortable: true, editor: {},
    //                         css: 'edit-cell',
    //                         renderer: function (value, meta) {
    //                             meta.css = 'custom-column';
    //                             if (value == null || value.length < 1) {
    //                                 value = 1;
    //                             }
    //                             return value;
    //                         }
    //                     }
    //                 ],
    //                 multiSelect: true,
    //                 pageSize: 100,
    //                 width: 400,
    //                 height: 600,
    //                 viewConfig: {
    //                     emptyText: '<div style="text-align:center; padding-top:20% ">No Data..</div>'
    //                 },
    //             }); // endof Ext.create('Ext.grid.Panel',

    //             saveForm.on('edit', function (editor, e) {
    //                 var rec = e.record;
    //                 var field = e['field'];
    //                 rec.set(field, rec.get(field));

    //             });

    //             var winProduct = Ext.create('ModalWindow', {
    //                 title: '제품추가',
    //                 width: 1100,
    //                 height: 600,
    //                 minWidth: 600,
    //                 minHeight: 300,
    //                 items: [
    //                     searchItemGrid, saveForm
    //                 ],
    //                 buttons: [
    //                 {
    //                     text: CMD_OK,
    //                     handler: function (btn) {
    //                         winProduct.setLoading(true);
    //                         if (btn == "no") {
    //                             winProduct.setLoading(false);
    //                             winProduct.close();
    //                         } else {
    //                             var items = gu.getCmp('saveFormGrid_PrdAdd').getSelectionModel().getSelection();
    //                             var store = gu.getCmp('productGrid').getStore();
    //                             console_logs('>>>>>>> items ????? ', items);
    //                             for (var i = 0; i < items.length; i++) {
    //                                 var item = items[i];
    //                                 var id = item.get('srcahd_uid'); // srcahd uid
    //                                 var srcmap_uid = item.get('id');
    //                                 var item_code = item.get('item_code');
    //                                 var description = item.get('description');
    //                                 var quan = item.get('bm_quan');
    //                                 var sg_code = item.get('sg_code');
    //                                 var sales_price = item.get('sales_price');
    //                                 var unit_code = item.get('unit_code');
    //                                 if (quan == null || quan == undefined || quan.length < 1) quan = 1;
    //                                 if(gu.getCmp('reserved_varcharb').getValue() === 'F') {
    //                                     sales_price = 0.0;
    //                                 }

    //                                 store.insert(store.getCount(), new Ext.data.Record({
    //                                     'srcahd_uid': id,
    //                                     'srcmap_uid' : srcmap_uid,
    //                                     'item_code': item_code,
    //                                     'description': description,
    //                                     'bm_quan': quan,
    //                                     'sg_code': sg_code,
    //                                     'sales_price': sales_price,
    //                                     'reserved_varchar9': unit_code
    //                                 }));
    //                             }

    //                             winProduct.setLoading(false);
    //                             winProduct.close();
    //                         }
    //                     }
    //                 }, {
    //                     text: CMD_CANCEL,
    //                     handler: function (btn) {
    //                         winProduct.close();
    //                     }
    //                 }]
    //             });
    //             winProduct.show();
    //         }
    //     });

    //     return action;
    // },


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
                                gm.me().searchDetailStoreSrcMap.getProxy().setExtraParam('srcahd_uid', record.get('unique_id_long'));
                                gm.me().searchDetailStoreSrcMap.load();
                                // record.commit();
                                // console_logs('>>> ddd', saveStore);
                                // saveStore.add(record);
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


    // itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
    //     var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
    //     var rec = selections[0];
    //     var unique_id = rec.get('unique_id');
    //     var state = rec.get('state');
    //     gMain.setCenterLoading(true);
    //     Ext.Ajax.request({
    //         url: CONTEXT_PATH + '/pdf.do?method=printEst',
    //         params: {
    //             pdfPrint: 'pdfPrint',
    //             is_rotate: 'N',
    //             rtgast_uids: unique_id,
    //             state: state
    //         },
    //         reader: {
    //             pdfPath: 'pdfPath'
    //         },
    //         success: function (result, request) {
    //             var jsonData = Ext.JSON.decode(result.responseText);
    //             var pdfPath = jsonData.pdfPath;
    //             console_logs(pdfPath);
    //             if (pdfPath.length > 0) {
    //                 var pdfPathSplit = pdfPath.split('/');
    //                 var fileName = pdfPathSplit[pdfPathSplit.length - 1];
    //                 var pageScale = (window.screen.width / 1000).toFixed(1);
    //                 console_logs('>>>>>> fileName', fileName);
    //                 var pdfView = Ext.create('PdfViewer.view.panel.PDF', {
    //                     width: window.screen.width / 5 * 3 + 20,
    //                     height: window.screen.height / 4 * 3 - 35,
    //                     pageScale: pageScale,
    //                     showPerPage: true,
    //                     pageBorders: false,
    //                     disableTextLayer: true,
    //                     src: '/download/PDF/' + fileName,
    //                     renderTo: Ext.getBody()
    //                 });
    //                 var woWin = Ext.create('Ext.Window', {
    //                     modal: true,
    //                     title: '견적서 PDF 미리보기',
    //                     width: window.screen.width / 5 * 3 + 20,
    //                     height: window.screen.height / 4 * 3,
    //                     plain: true,
    //                     items: [
    //                         pdfView
    //                     ]
    //                 });
    //                 gMain.setCenterLoading(false);
    //                 woWin.show();
    //             }
    //         },
    //         failure: function (val, action) {
    //             gMain.setCenterLoading(false);
    //             Ext.Msg.alert('오류', '파일을 불러오는 도중 오류가 발생하였습니다.');
    //         }
    //     });
    // },

    clearSearchStore: function () {
        var store = gm.me().searchDetailStore;

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
        var srcmapStore = gm.me().searchDetailStoreSrcMap;
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
            // division_code = gu.getCmp('division_code').getValue();
            // console_logs('>>>>>>> division_code', division_code);
            order_com_unique = gu.getCmp('order_com_unique').getValue();

            // if (division_code == null) {
            // Ext.MessageBox.alert('알림','사업부 미기입!!!');
            // return;
            // }

            // if (order_com_unique == null) {
            // Ext.MessageBox.alert('알림','고객사 미기입!!!');
            // return;
            // }
            // if (division_code != null) {
            //     store.getProxy().setExtraParam('division_code', division_code);
            // }
            // if (order_com_unique != null) {
            //     store.getProxy().setExtraParam('order_com_unique', order_com_unique);
            // }
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

    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchStore', {}),
    searchDetailStoreSrcMap: Ext.create('Mplm.store.ProductPriceInfoStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),
    combstStore: Ext.create('Mplm.store.CombstStore', {pageSize: 1000}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    cStore: Ext.create('Mplm.store.ComCstStore', {}),
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_NEW_DIVISION'}),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_CONDITION'}),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_TYPE'}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SAMPLE_TYPE'}),
    ynFlagStore: Ext.create('Mplm.store.YnFlagStore', {}),
    payConditionStore: Ext.create('Mplm.store.PayConditionStore', {hasNull: false})
});
