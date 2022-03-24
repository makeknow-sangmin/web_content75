Ext.define('Rfx2.view.company.bioprotech.purStock.ListPoDetailView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'list-po-view',

    poStore: Ext.create('Rfx2.store.company.hanjung.ListPoStore', {
        sorters: [{
            property: 'po_no',
            direction: 'DESC'
        }]
    }),
    storeCubeDim: Ext.create('Rfx.store.ListPoViewStore', {
        sorters: [{
            property: 'po_no',
            direction: 'ASC'
        }]
    }),

    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var arr = [];
        var rtgast_uid;
        var po_no;
        var quan;
        var route_type;
        var pj_code;
        var supplier_code;
        var supplier_email_address;
        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 2});
        var po_status;

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var s_date = gu.getCmp('s_date_arv').getValue();
                    var e_date = gu.getCmp('e_date_arv').getValue();
                    var supplier_name = gu.getCmp('query').getValue();
                    var po_no = gu.getCmp('po_no_field').getValue();
                } catch (e) {

                }
                gm.me().poStore.getProxy().setExtraParam('s_date', Ext.Date.format(s_date, 'Y-m-d'));
                gm.me().poStore.getProxy().setExtraParam('e_date', Ext.Date.format(e_date, 'Y-m-d'));
                gm.me().poStore.getProxy().setExtraParam('supplier_name', supplier_name);
                gm.me().poStore.getProxy().setExtraParam('po_no', po_no);
                gm.me().poStore.load();
            }
        });

        var buttonToolbar3 = Ext.create('widget.toolbar', {
            style: 'background-color: transparent;',
            items: [{
                xtype: 'tbfill',
            }, {
                xtype: 'label',
                style: 'color: #000000; font-weight: bold; font-size: 15px; margin: 5px; align: right',
                text: '총 금액 : 0 / 총 주문수량 : 0'
            }]
        })

        var printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '주문서',
            tooltip: '주문서 출력',
            disabled: true,
            handler: function (widget, event) {
                if (route_type == 'U'
                    || vCompanyReserved4 == 'SKNH01KR'
                    || vCompanyReserved4 == 'APM01KR'
                    || vCompanyReserved4 == 'DABP01KR'
                    || vCompanyReserved4 == 'SWON01KR'
                ) {
                    is_rotate = 'Y';
                }
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printPo',
                    params: {
                        rtgast_uid: rtgast_uid,
                        po_no: po_no,
                        pdfPrint: 'pdfPrint',
                        is_rotate: "N",
                        route_type: "",
                        supplier_name: supplier_code
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
                        switch (vCompanyReserved4) {
                            case 'KWLM01KR':
                                gm.me().updatePrintYn(rtgast_uid);
                                break;
                            default:
                                break;
                        }
                    },
                    failure: extjsUtil.failureMessage
                });
                is_rotate = '';
            }
        });

        var restorePoAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '주문취소',
            tooltip: '주문취소',
            disabled: true,
            handler: function () {
                var selections = gridDimension.getSelectionModel().getSelection();
                var uids = [];
                var blocking = [];
                for (var i = 0; i < selections.length; i++) {
                    var record = selections[i];
                    var unique_id = record.get('id');
                    var po_qty = record.get('po_qty');//주문수량
                    var gr_qty = record.get('gr_qty');//입고수량
                    var po_blocking_qty = po_qty - gr_qty;//취소가능수량
                    uids.push(unique_id);
                    blocking.push(po_blocking_qty);
                }
                Ext.MessageBox.confirm('확인', '총' + uids.length + '건 을 주문취소하시겠습니까? 이작업은 취소할 수 없습니다.', function (btn) {
                    if (btn == 'yes') {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/purchase/prch.do?method=modifyListPoGroup',
                            params: {
                                account_code: gMain.selPanel.vSELECTED_PJ_CODE,
                                po_blocking_qty: blocking,
                                unique_id: uids
                            },
                            success: function (result, request) {
                                Ext.Msg.alert('저장', '취소되었습니다.', function () {
                                });
                                gridDimension.store.load(function (record) {
                                });
                            },//endofsuccess
                        });//endofajax
                    } else {
                    }
                });

            }
        });

        var sendMailAction = Ext.create('Ext.Action', {
            iconCls: 'af-external-link',
            text: '메일전송',
            disabled: true,
            handler: function (widget, event) {
                var supplier_name = '';
                var po_detail = '';
                var email = vCUR_EMAIL;
                switch (vCompanyReserved4) {
                    case 'KBTC01KR':
                        email = 'ikbtech001@gmail.com';
                        break;
                    default:
                        break;
                }
                po_detail = po_detail.replace(/(?:\r\n|\r|\n)/g, '<br />');
                po_detail = po_detail + "<br /><br /><br />본 메일은 발신전용이오니 아래의 연락처에 문의하세요.<br /><br />";
                po_detail = po_detail + "문의처: " + vCUR_DEPT_NAME + ', ' + vCUR_USER_NAME + ' (' + email + ')<br />';
                po_detail = po_detail + "별첨: 주문서";
                var byCompany = '';
                switch (vCompanyReserved4) {
                    case 'KBTC01KR':
                        byCompany = "/발주서 -(주)KB텍";
                        supplier_name = rec.get('supplier_name') + ' - ';
                        break;
                    default:
                        byCompany = '';
                        break;
                }

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
                            allowBlank: false,
                            value: supplier_email_address,
                            anchor: '100%'
                        },
                        {
                            name: 'mailSubject',
                            allowBlank: false,
                            value: '[' + po_no + ']' + supplier_name + '주문합니다.' + byCompany,
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
                            emptyText: panelSRO1149,
                            buttonText: '업로드',
                            allowBlank: true,
                            buttonConfig: {
                                iconCls: 'af-upload'
                            },
                            anchor: '100%'
                        }
                    ]
                });

                var win = Ext.create('ModalWindow', {
                    title: '공급사에 메일 전송',
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
                                var loadPage = new Ext.LoadMask({
                                    msg: '메일 전송중입니다.',
                                    visible: true,
                                    target: win
                                });

                                loadPage.show();
                                mailForm.submit({
                                    url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
                                    waitMsg: 'Uploading Files...',
                                    success: function (fp, o) {
                                        console_logs('save  success', o);
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/pdf.do?method=printPoAndSendMail',
                                            params: {
                                                rtgast_uid: val['rtgast_uid'],
                                                po_no: val['po_no'],
                                                mailTo: val['mailTo'],
                                                mailSubject: val['mailSubject'],
                                                mailContents: val['mailContents'],
                                                file_itemcode: vFILE_ITEM_CODE,
                                                pdfPrint: 'sendMail'
                                            },
                                            success: function (result, request) {
                                                console_logs('save  success2', result);
                                                if (win) {
                                                    win.close();
                                                }
                                                Ext.MessageBox.alert('전송확인', '전송되었습니다.');
                                                loadPage.visible = false;
                                                gm.me().poStore.load(function () {
                                                });
                                            },
                                            failure: extjsUtil.failureMessage
                                        });
                                    },
                                    failure: function () {
                                        console_log('failure');
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                        loadPage.visible = false;
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

        var manualSendingAction = Ext.create('Ext.Action', {
            iconCls: 'af-external-link',
            text: '전송처리',
            tooltip: '메일 전송 외 타 방법으로 주문서 전송시 완료처리합니다.',
            disabled: true,
            handler: function () {
                Ext.MessageBox.confirm('확인', '선택한 주문서를 전송처리 하시겠습니까?', function (btn) {
                    if (btn == 'yes') {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/purchase/prch.do?method=modifyMailStatus',
                            params: {
                                rtgast_uid: rtgast_uid
                            },
                            success: function (result, request) {
                                Ext.Msg.alert('완료', '처리완료 되었습니다.', function () {
                                });
                                gm.me().poStore.load(function () {
                                });
                            },//endofsuccess
                        });//endofajax
                    } else {
                    }
                });

            }
        });


        var poStatusTemplate = Ext.create('Ext.grid.Panel', {
            store: this.poStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            bbar: getPageToolbar(this.poStore),
            frame: false,
            layout: 'fit',
            forceFit: true,
            width: '100%',
            sorters: [],
            columns: [{
                text: '주문번호',
                width: 60,
                sortable: true,
                style: 'text-align:center',
                align: "center",
                dataIndex: 'po_no'
            }, {
                text: '상태',
                width: 60,
                sortable: true,
                style: 'text-align:center',
                align: "center",
                dataIndex: 'state_po_Hj'
            }, {
                text: '공급사',
                width: 100,
                sortable: true,
                style: 'text-align:center',
                align: "center",
                dataIndex: 'supplier_name'
            }, {
                text: '주문일자',
                xtype: 'datecolumn',
                format: 'Y-m-d',
                width: 70,
                sortable: true,
                style: 'text-align:center',
                align: "center",
                dataIndex: 'create_date'
            }, {
                text: '주문금액',
                width: 70,
                xtype: "numbercolumn",
                style: 'text-align:center',
                format: "0,000",
                align: "right",
                dataIndex: 'sales_amount'
            }, {
                text: '건수',
                width: 70,
                xtype: "numbercolumn",
                style: 'text-align:center',
                format: "0,000",
                align: "right",
                dataIndex: 'item_quan'
            }, {
                text: '비고',
                width: 90,
                sortable: true,
                style: 'text-align:center',
                align: "center",
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                },
                dataIndex: 'reserved_varchar2'
            }
            ],
            viewConfig: {
                getRowClass: function (record, index) {
                    var c = record.get('mail_status');
                    if (c == 'Y') {
                        return 'green-row';
                    }
                }
            },
        });
        this.poStore.getProxy().setExtraParam('rtg_state_list', "A:G"); //입고된 것도 출력
        this.poStore.load();
        poStatusTemplate.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    console_logs('>>>> rec', selections[0]);
                    gm.me().storeCubeDim.getProxy().setExtraParam('rtgastuid', selections[0].get('id'));
                    gm.me().storeCubeDim.load();
                    rtgast_uid = selections[0].get('id');
                    po_no = selections[0].get('po_no');
                    quan = selections[0].get('quan');
                    route_type = selections[0].get('route_type_s');
                    pj_code = selections[0].get('pj_code');
                    supplier_code = selections[0].get('supplier_code');
                    supplier_email_address = selections[0].get('supplier_email_address');
                    po_status = selections[0].get('state_po_Hj');
                    printPDFAction.enable();
                    sendMailAction.enable();
                    manualSendingAction.enable();
                } else {
                    rtgast_uid = -1;
                }
            }
        });

        var temp = {
            title: '주문서현황',
            collapsible: false,
            frame: true,
            region: 'west',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 0.7,
            items: [poStatusTemplate],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        purListSrch
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype: 'label',
                            width: 50,
                            text: '주문일자',
                            style: 'color:white;'
                        },
                        {
                            id: 's_date_arv',
                            name: 's_date',
                            format: 'Y-m-d',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            xtype: 'datefield',
                            value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                            width: 98

                        }, {
                            xtype: 'label',
                            text: "~",
                            style: 'color:white;'
                        }, {
                            id: 'e_date_arv',
                            name: 'e_date',
                            format: 'Y-m-d',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            xtype: 'datefield',
                            value: new Date(),
                            width: 98
                        },
                        {
                            xtype: 'triggerfield',
                            emptyText: '주문번호',
                            id: 'po_no_field',
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            name: 'po_no',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().poStore.getProxy().setExtraParam('po_no', '%' + Ext.getCmp('po_no_field').getValue() + '%');
                                        gm.me().poStore.load(function () {
                                        });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                Ext.getCmp('po_no').setValue('');
                                this.poStore.getProxy().setExtraParam('po_no', Ext.getCmp('po_no_field').getValue());
                                this.poStore.load(function () {
                                });
                            }
                        }
                    ]
                }
            ]
        };

        var origin_qty = 0;
        var po_qty = 0;
        var po_blocking_qty = 0;
        var can_qty = 0;
        var gr_qty = 0;
        var sales_price = 0;
        var unique_id = 0;

        var gridDimension = Ext.create('Ext.grid.Panel', {
            id: gu.id('gridDimension'),
            store: this.storeCubeDim,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: true,
            autoScroll: true,
            autoHeight: true,
            frame: false,
            reigon: 'center',
            layout: 'fit',
            forceFit: true,
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            plugins: [cellEditing],
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
                select: function (selModel, record, index, options) {

                },
                itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                },
                cellkeydown: function (gridDimension, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    // console_logs('>>>>> e.getKey()', e.getKey());
                    // if (e.getKey() == Ext.EventObject.ENTER) {
                    //     console_logs('>>>>>> e.getKey()', e.getKey());
                    // }
                },
                itemclick: function (view, rec, htmlItem, index, eventObject, opts) {
                    console_logs('>>>> itemclick rec', rec);
                    unique_id = rec.get('id');
                    po_qty = rec.get('po_qty');
                    origin_qty = rec.get('po_qty');//수정 전 주문수량
                    gr_qty = rec.get('gr_qty');//입고수량
                    sales_price = rec.get('sales_price');//주문단가
                    sales_amount = rec.get('sales_amount'); // 금액
                    switch (vCompanyReserved4) {
                        case 'KWLM01KR':
                            sales_price = rec.get('sales_price_local');//주문단가
                            sales_amount = rec.get('sales_amount_local'); // 금액
                            break;
                    }
                    can_qty = po_qty - gr_qty;//주문가능수량
                    po_blocking_qty = rec.get('po_blocking_qty');//주문취소수량
                    item_name = rec.get('item_name');
                    mass = rec.get('mass');
                    req_delivery_date = null;
                },
                edit: function (view, rec, opts) {
                    console_logs('>>> in edit rec', rec);
                    var field = rec.field;
                    switch (field) {
                        case 'po_qty':
                            po_qty = rec.value;//새로 입력되는 주문수량
                            break;
                        case 'gr_qty':
                            gr_qty = rec.value;//새로 입력되는 주문수량
                            break;
                        case 'po_blocking_qty':
                            po_blocking_qty = rec.value;//새로 입력되는 주문수량
                            break;
                        case 'sales_price':
                        case 'sales_price_local':
                            sales_price = rec.value;//새로 입력되는 주문수량
                            break;
                        case 'req_delivery_date':
                            req_delivery_date = rec.value;
                            break;
                        case 'sales_amount':
                        case 'sales_amount_local':
                            console_logs('>>>>ccc', rec.value);
                            sales_amount = Math.floor(rec.value);
                        default:
                            break;
                    }
                    if (vCompanyReserved4 == 'KWLM01KR' && field != 'sales_amount' && field != 'sales_amount_local') {
                        var ctr_flag = rec.record.get('ctr_flag');
                        var mass = rec.record.get('mass');
                        var po_qty = rec.record.get('po_qty');
                        switch (ctr_flag) {
                            case 'M':
                                sales_amount = Math.floor(sales_price * mass)
                                break;
                            default:
                                sales_amount = Math.floor(sales_price * po_qty)
                                break;
                        }
                        console_logs('recrecrec', mass + ' : ' + po_qty);
                    }
                    ;

                    if (req_delivery_date != null) {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/purchase/prch.do?method=updateXpoastReqdate',
                            params: {
                                req_delivery_date: req_delivery_date,
                                unique_id: unique_id  // xpoast_uid
                            },
                            success: function (result, request) {
                                gm.me().showToast('결과', '[' + item_name + '] ' + ' 의 요청납기 ' + '가 수정되었습니다.');
                                this.storeCubeDim, load(function (record) {
                                });
                            }
                        });
                    }
                    if (origin_qty < po_qty) {
                        console_logs('>>> origin_qty', origin_qty);
                        console_logs('>>> po_qty', po_qty);
                        Ext.Msg.alert('알림', '변경 수량은 주문수량을 초과할수 없습니다.');
                        // po_qty = origin_qty;
                        gm.me().storeCubeDim.load();
                    } else {
                        console_logs('>>> po_blocking_qty', po_blocking_qty);
                        console_logs('>>> can_qty', can_qty);
                        if (po_blocking_qty < can_qty || po_blocking_qty == can_qty) {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/prch.do?method=destroy',
                                params: {
                                    account_code: gMain.selPanel.vSELECTED_PJ_CODE,
                                    po_blocking_qty: po_blocking_qty,
                                    sales_price: sales_price,
                                    sales_amount: sales_amount,
                                    unique_id: unique_id  // xpoast_uid
                                },
                                success: function (result, request) {
                                    //취소수량은 취소가능수량(주문가능수량)을 넘을 수 없다.
                                    console_logs('>>  result', result);
                                    gm.me().showToast('결과', '[' + item_name + '] ' + ' 의 수량이 ' + '이 수정되었습니다.');
                                    gm.me().storeCubeDim.load();
                                },//endofsuccess
                            });//endofajax
                        } else {
                            Ext.Msg.alert('다시 입력', '취소수량은 취소가능수량을 초과할수 없습니다.');
                            gr_qty = gr_qty;
                            gm.me().storeCubeDim.load();
                        }
                    }
                }
            },
            flex: 0.5,
            columns: [{
                text: '품번',
                align: 'left',
                width: 50,
                style: 'text-align:center',
                dataIndex: 'item_code'
            }, {
                text: '품명',
                width: 70,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'item_name'
            }, {
                text: '규격',
                width: 70,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'specification'
            }, {
                text: '주문수량',
                width: 30,
                align: 'right',
                style: 'text-align:center',
                dataIndex: 'po_qty'
            }, {
                text: '취소수량',
                width: 30,
                align: 'right',
                style: 'text-align:center',
                editable: true,
                dataIndex: 'po_blocking_qty',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false
                }
            }, {
                text: '입고수량',
                width: 30,
                align: 'right',
                style: 'text-align:center',
                dataIndex: 'gr_qty'
            }, {
                text: '주문단가',
                width: 30,
                align: 'right',
                xtype: "numbercolumn",
                format: "0,000",
                style: 'text-align:center',
                dataIndex: 'sales_price',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false
                }
            }, {
                text: '주문금액',
                width: 30,
                align: 'right',
                xtype: "numbercolumn",
                format: "0,000",
                style: 'text-align:center',
                dataIndex: 'po_amount'
            }, {
                text: '납품일자',
                xtype: 'datecolumn',
                format: 'Y-m-d',
                width: 30,
                align: 'left',
                style: 'text-align:center',
                dataIndex: 'req_delivery_date',
                editor: {
                    xtype: 'datefield',
                    allowBlank: false
                }
            }
            ]
        });

        gridDimension.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                var sales_amounts = 0;
                var po_qtys = 0;
                if (po_status == '입고완료') {
                    restorePoAction.disable();
                } else {
                    restorePoAction.enable();
                }
                for (var i = 0; i < selections.length; i++) {
                    console_logs('>>>>>>records', selections[i]);
                    var sales_amount = selections[i].get('po_amount');
                    var po_qty = selections[i].get('po_qty');
                    sales_amount = parseFloat(sales_amount);
                    po_qty = parseFloat(po_qty);
                    sales_amounts += sales_amount;
                    po_qtys += po_qty;
                }
                buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(sales_amounts) + ' / 총 주문수량 : ' + po_qtys);
            }
        });

        var temp2 = {
            title: '상세내용',
            collapsible: false,
            frame: true,
            region: 'center',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1,
            items: [gridDimension],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [printPDFAction, sendMailAction, manualSendingAction, restorePoAction, '->', buttonToolbar3]
                }
            ]
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
});