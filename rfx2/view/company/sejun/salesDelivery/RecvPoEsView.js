Ext.define('Rfx2.view.company.sejun.salesDelivery.RecvPoEsView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'receved-po-es-view',
    gridIds: [],
    estiContentStore: Ext.create('Rfx2.store.company.hanjung.EstiContentStore', {}),
    estiSpecStore  : Ext.create('Rfx2.store.company.hanjung.EstiSelStore', {}),
    estiPfStore  : Ext.create('Rfx2.store.company.hanjung.EstiPfStore', {}),
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
        this.addSearchField('reserved_varchar4');
        this.addSearchField('reserved_varchar2');
        this.addSearchField({
            type: 'combo'
            , field_id: 'saler_name'
            , emptyText: '영업담당자'
            , store: "UserDeptStore"
            , displayField: 'user_name'
            , valueField: 'user_name'
            , value: 'user_name'
            , params: { dept_code: "D102" }
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
                console_logs('>>>>>>', rec.get('reserved_number3'));
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
                        email = 'hanjungsv001@gmail.com';
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
                    default:
                        break;
                }

                po_detail = po_detail.replace(/(?:\r\n|\r|\n)/g, '<br />');
                po_detail = po_detail + "<br /><br />---------------------------------------------------------------------------------------<br/>";
                po_detail = po_detail + "본 메일주소는 발신전용이오니 기타 문의사항은 " + byCompany + "으로 문의해주시기 바랍니다.<br/><br/>";
                po_detail = po_detail + supplier_name + "귀하" + "<br/>";
                po_detail = po_detail + "영업 담당자 : " + rec.get('saler_name') + "<br/>";
                po_detail = po_detail + "별첨: 견적서(" + rec.get('reserved_varchar1') + ")<br/>";

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

        this.estToPoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '수주등록',
            tooltip: '해당 견적을 수주등록 합니다.',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                var unique_id = rec.get('unique_id');
                var reserved_varchar1 = rec.get('reserved_varchar1'); // 제작명
                var reserved_varchar2 = rec.get('reserved_varchar2'); // 차종
                var reserved_number1 = rec.get('reserved_number1'); // 영업사원 UID
                var reserved_varchar4 = rec.get('reserved_varchar4'); // 고객명
                var total_price = Ext.util.Format.number(rec.get('total_price'), '0,000'); // 견적가격
                var car_maker = rec.get('reserved_varchar5'); // 차량제조사
                var combst_uid = rec.get('reserved_number2'); // COMBST unique_id
                var comcst_uid = rec.get('reserved_number3'); // 지입사 uid
                var company_name = rec.get('company_name');
                var reserved_double1 = rec.get('reserved_double1'); // 차량가격 
                console_logs('>>>> usrast_uid', reserved_number1);

                gm.me().estToPoAct(unique_id, reserved_varchar1, reserved_varchar2,
                    reserved_number1, reserved_varchar4, total_price, car_maker,
                    combst_uid, comcst_uid, company_name, objs, reserved_double1);
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
        buttonToolbar.insert(4, this.estToPoAction);
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
                this.copyPoEsAction.enable();
                this.modifyPoEsAction.enable();
                this.pdfAction.enable();
                this.sendMailAction.enable();
                this.sendFaxAction.enable();
                if (rec.get('state') == 'C' || rec.get('state') == 'T') {
                    this.esReturnAction.disable();
                    this.estToPoAction.disable();
                } else {
                    this.esReturnAction.enable();
                    this.estToPoAction.enable();
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
                        var estobj_uid = sel.get('estobj_uid');
                        var total_price = sel.get('total_price');

                        objv['code_uid'] = code_uid;
                        objv['estobj_uid'] = estobj_uid;
                        objv['total_price'] = total_price;

                       
                        columns.push(objv);
                    }
                    console_logs('>>>objv', columns);
                    obj['datas'] = columns;
                    objs.push(obj);
                    console_logs('>>>> objs >>>>> ', objs);
                })
            } else {
                this.copyPoEsAction.disable();
                this.modifyPoEsAction.disable();
                this.pdfAction.disable();
                this.esReturnAction.disable();
                this.estToPoAction.disable();
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
                    title: '기본정보',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '작성일',
                            xtype: 'datefield',
                            anchor: '100%',
                            format : 'Y-m-d',
                            width: '99%',
                            name: 'create_date',
                            allowBlank: false,
                            value: new Date()
                        }, {
                            fieldLabel: '제작명',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            name: 'item_name'
                        }, {
                            fieldLabel: '차량제조사',
                            xtype: 'combo',
                            anchor: '100%',
                            width: '99%',
                            allowBlank: false,
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            store: Ext.create('Rfx2.store.company.hanjung.PoCarMakerStore', {}),
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            name: 'reserved_varchar5'
                        }, {
                            fieldLabel: '차종',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            name: 'car_name'
                        }, {
                            fieldLabel: '고객명',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            name: 'customer_name'
                        }, {
                            fieldLabel: '지입사',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'corp_name',
                        }, {
                            fieldLabel: '영업사원',
                            xtype: 'combo',
                            anchor: '100%',
                            allowBlank: false,
                            width: '99%',
                            store: Ext.create('Mplm.store.UserSalerStore', {}),
                            valueField: 'unique_id',
                            displayField: 'user_name',
                            name: 'emp_name'
                        }, {
                            fieldLabel: '견적가<br>(세액포함)',
                            xtype: 'numberfield',
                            anchor: '100%',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            allowBlank: true,
                            editable: false,
                            width: '99%',
                            name: 'sale_price',
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            id: gu.id('sale_price')
                        }, {
                            fieldLabel: '사양',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            editable: true,
                            width: '99%',
                            name: 'reserved_varchar6'
                        },{
                            fieldLabel: '차량가격',
                            xtype: 'numberfield',
                            anchor: '100%',
                            allowBlank: true,
                            editable: true,
                            width: '99%',
                            name: 'car_price'
                        },{
                            // fieldLabel: '공급가(VAT)포함 계산',
                            id : gu.id('vatInclude'),
                            xtype: 'checkbox',
                            align : 'right',
                            anchor: '100%',
                            checked : false,
                            field_id: 'vatInclude',
                            hidden: true,
                            boxLabel: 'VAT 포함여부 확인',
                            style: 'background-color: transparent; text-align: left; align: right',
                            width: '99%',
                        }
                    ]
                },
                // {
                //     xtype: 'fieldset',
                //     title: '상세정보',
                //     frame: true,
                //     width: '100%',
                //     height: '100%',
                //     layout: 'fit',
                //     defaults: {
                //         margin: '2 2 2 2'
                //     },
                //     items: [
                //         {
                //             fieldLabel: '견적서 틀',
                //             xtype: 'combo',
                //             anchor: '100%',
                //             width: '99%',
                //             name: 'esti_template'
                //         }
                //     ]
                // },
                Ext.create('Ext.Button', {
                    text: '항목 추가',
                    width: '100%',
                    renderTo: Ext.getBody(),
                    handler: function () {
                        gm.me().addElement();
                    }
                })
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '견적서작성',
            width: 950,
            height: 700,
            plain: true,
            items: form,
            overflowY: 'scroll',
            buttons: [{
                text: '견적가격 계산',
                listeners: {
                    click: function () {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var objs = [];
                            var arr = [];
                            var sum_price = 0;
                            for (var i = 0; i < gm.me().gridIds.length; i++) {
                                var id = gm.me().gridIds[i];
                                var storeData = gu.getCmp('grid-' + id).getStore();
                                var prices = val['totalPrice-' + id];
                                prices = prices.replace(/\,/g, '');
                                prices = Number(prices);
                                sum_price += prices;
                                console_logs('sum_price>>', sum_price);;
                            }
                            var real_sum_price = 0;

                            if(gu.getCmp('vatInclude').checked) {
                                real_sum_price = sum_price;
                            } else {
                                real_sum_price = sum_price + (sum_price * 0.1);
                            }

                            gu.getCmp('sale_price').setValue(real_sum_price);
                        }
                    }
                }

            },
            {
                text: '견적서 작성',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var estiPrice = val['sale_price'];
                            if (estiPrice.length == 0 || estiPrice == null) {
                                Ext.MessageBox.alert('오류', '견적가격이 계산되지 않았습니다.');
                                return;
                            }
                            var objs = [];
                            for (var i = 0; i < gm.me().gridIds.length; i++) {
                                var id = gm.me().gridIds[i];
                                var storeData = gu.getCmp('grid-' + id).getStore();
                                var obj = {};
                                obj['totalPrice'] = val['totalPrice-' + id];
                                obj['codeUid'] = val['codeUid-' + id];
                                obj['estUid'] = val['estUid-' + id];
                                var columns = [];
                                for (var j = 0; j < storeData.data.items.length; j++) {
                                    var item = storeData.data.items[j];
                                    var objv = {};
                                    objv['item_name'] = item.get('item_name');
                                    objv['sales_price'] = item.get('sales_price');
                                    columns.push(objv);
                                }
                                obj['datas'] = columns;
                                objs.push(obj);
                            }
                            var jsonData = Ext.util.JSON.encode(objs);
                            form.submit({
                                url: CONTEXT_PATH + '/purchase/prch.do?method=insertEst&copy_flag=N',
                                waitMsg: '견적서를 저장중입니다.',
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
                text: '작성 취소',
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

    createEsFieldSet: function (system_code, system_name, code_uid, est_uid, mode) {
        var grid = gm.me().createEsGrid(system_code, code_uid, mode);
        var fieldset = {
            xtype: 'fieldset',
            id: gu.id('fieldset-' + system_code),
            title: system_name,
            frame: true,
            width: '100%',
            height: '100%',
            layout: 'fit',
            defaults: {
                margin: '2 2 2 2'
            },
            items: [
                grid,
                {
                    fieldLabel: '소계',
                    xtype: 'numberfield',
                    anchor: '100%',
                    width: '99%',
                    allowBlank: true,
                    id: gu.id('totalPrice-' + system_code),
                    name: 'totalPrice-' + system_code,
                    listeners: {
                        specialkey: function (f, e) {
                            if (e.getKey() == e.ENTER) {
                                // ENTER Key 눌렀을 시 focus out.
                                f.blur();
                            }
                        }
                    },
                },
                {
                    xtype: 'hiddenfield',
                    name: 'codeUid-' + system_code,
                    value: code_uid
                },
                {
                    xtype: 'hiddenfield',
                    name: 'estUid-' + system_code,
                    value: est_uid
                }
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

    createEsGrid: function (system_code, code_uid, mode) {
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
                    text: '항목',
                    width: '80%',
                    dataIndex: 'item_name',
                    editor: 'textfield',
                    sortable: false,
                },
                {
                    text: '공급가',
                    width: '20%',
                    dataIndex: 'sales_price',
                    editor: 'numberfield',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sales_price') {
                            context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
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
                beforeedit: function (editor, context, eOpts) {
                    if(mode == 'ADD') {
                        if (context.field == 'item_name') {
                            context.record.set('item_name', '');
                        } 
                    }
                   
                    // if (context.field == 'item_name') {
                    //     context.record.set('item_name', '');
                    // }
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
                        {
                            text: '항목삭제',
                            listeners: [{
                                click: function () {
                                    Ext.MessageBox.show({
                                        title: '항목삭제',
                                        msg: '해당 항목을 삭제하시겠습니까?<br>항목의 모든 내용이 삭제 됩니다.',
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (result) {
                                            if (result == 'yes') {
                                                gu.getCmp('fieldset-' + system_code).destroy();
                                                var idIndex = gm.me().gridIds.indexOf(system_code);
                                                if (idIndex !== -1) {
                                                    gm.me().gridIds.splice(idIndex, 1);
                                                }
                                            }
                                        },
                                        //animateTarget: this,
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                }
                            }]
                        },
                        {
                            text: '+',
                            listeners: [{
                                click: function () {
                                    var store = gu.getCmp('grid-' + system_code).getStore();
                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'esti_uid': -1,
                                        'item_name': '',
                                        'sales_price': ''
                                    }));
                                }
                            }]
                        },
                        {
                            text: '-',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('grid-' + system_code).getSelectionModel().getSelected().items[0];
                                    var store = gu.getCmp('grid-' + system_code).getStore();
                                    if(record == null) {
                                        gu.getCmp('grid-' + system_code).getStore().remove(store.last());
                                    } else {
                                        gu.getCmp('grid-' + system_code).getStore().removeAt(gu.getCmp('grid-' + system_code).getStore().indexOf(record));
                                    }
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
                        },
                        {
                            text: '자동합계',
                            listeners: [{
                                click: function () {
                                    var store = gu.getCmp('grid-' + system_code).getStore();
                                    var cnt = store.getCount();
                                    var p_price = 0;
                                    for (var i = 0; i < cnt; i++) {
                                        var record = store.getAt(i);
                                        p_price = p_price + Number(record.get('sales_price'));
                                    }
                                    console_logs('p_price >>> ', p_price);
                                    gu.getCmp('totalPrice-' + system_code).setValue(p_price);
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
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            name: 'sel_option',
                            listeners: {
                                select: function (combo, records, eOpts) {
                                    console_logs('records >>>> ', records);
                                    var sel_option_code = gu.getCmp('sel_option').getValue();
                                    var sel_option_name = gu.getCmp('sel_option').getRawValue();
                                    var code_uid = records.get('code_uid');
                                    var est_uid = records.get('unique_id_long');
                                    gu.getCmp('code_name_kr').setValue(sel_option_name);
                                    gu.getCmp('code_uid').setValue(code_uid);
                                    gu.getCmp('est_uid').setValue(est_uid);
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
                        },
                        {
                            xtype: 'hiddenfield',
                            id: gu.id('est_uid'),
                            name: 'est_uid',
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
                                var est_uid = val['est_uid'];
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
                                        gm.me().createEsFieldSet(systemCode, code_name_kr, code_uid, est_uid, 'ADD'));
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
                                        addspecname : addspecname,
                                        spectype : spectype
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
                    title: '기본정보',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '작성일',
                            xtype: 'datefield',
                            anchor: '100%',
                            width: '99%',
                            format : 'Y-m-d',
                            name: 'create_date',
                            value: rec.get('create_date_str')
                        },
                        // 이름 -> 코드 (item_name)
                        {
                            xtype: 'textfield',
                            editable: true,
                            fieldLabel: '제작명',
                            width: '99%',
                            value: rec.get('itemName'),
                            name: 'item_name',
                            anchor: '100%',
                        },
                        // 이름 -> 코드 (reserved_varchar5)
                        {
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            id: gu.id('carmakercombo-SRO5_HJ1'),
                            editable: true,
                            fieldLabel: '차량제조사',
                            width: '99%',
                            queryMode: 'remote',
                            displayField: 'code_name_kr',
                            valueField: 'code_name_kr',
                            store: Ext.create('Rfx2.store.company.hanjung.PoCarMakerStore', {}),
                            sortInfo: { field: 'unique_id', direction: 'ASC' },
                            value: rec.get('carMaker'),
                            minChars: 1,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false,
                            name: 'reserved_varchar5',
                            anchor: '100%',
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                }
                            },
                            pageSize: 25,
                            triggerAction: 'all',
                            listeners: {
                                beforeload: function () {
                                    gu.getCmp('carmakercombo-SRO5_HJ1').store.getProxy().setExtraParam('company_name',
                                        '%' + gu.getCmp('carmakercombo-SRO5_HJ1').getValue() + '%');
                                },
                            }
                        }, {
                            fieldLabel: '차종',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'car_name',
                            value: rec.get('reserved_varchar2')
                        }, {
                            fieldLabel: '고객명',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'customer_name',
                            value: rec.get('reserved_varchar4')
                        }, {
                            fieldLabel: '지입사',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'corp_name',
                            value: rec.get('company_name')
                        },
                        // 이름 -> uid (emp_name)
                        {
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            id: gu.id('pmcombo-SRO5_HJ1'),
                            editable: true,
                            fieldLabel: '영업사원',
                            width: '99%',
                            queryMode: 'remote',
                            displayField: 'user_name',
                            valueField: 'user_name',
                            store: Ext.create('Mplm.store.UserSalerStore', {}),
                            sortInfo: { field: 'unique_id', direction: 'ASC' },
                            value: rec.get('saler_name'),
                            minChars: 1,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false,
                            name: 'emp_name',
                            anchor: '100%',
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{user_name}">{user_name} </font></div>';
                                }
                            },
                            pageSize: 25,
                            triggerAction: 'all',
                            listeners: {
                                beforeload: function () {
                                    gu.getCmp('pmcombo-SRO5_HJ1').store.getProxy().setExtraParam('company_name',
                                        '%' + gu.getCmp('pmcombo-SRO5_HJ1').getValue() + '%');
                                },
                            }
                        },
                        {
                            fieldLabel: '견적가<br>(세액포함)',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            editable: false,
                            name: 'sale_price',
                            id: gu.id('sale_price_edit'),
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: rec.get('total_price'),
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false
                        },  {
                            fieldLabel: '사양',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'reserved_varchar6',
                            value: rec.get('reserved_varchar6')
                        },{
                            fieldLabel: '차량가격',
                            xtype: 'numberfield',
                            anchor: '100%',
                            allowBlank: true,
                            value: rec.get('carPrice'),
                            editable: true,
                            width: '99%',
                            name: 'car_price'
                        },{
                            // fieldLabel: '공급가(VAT)포함 계산',
                            id : gu.id('vatInclude_edit'),
                            xtype: 'checkbox',
                            align : 'right',
                            anchor: '100%',
                            checked : false,
                            field_id: 'vatInclude',
                            hidden: true,
                            boxLabel: 'VAT 포함여부 확인',
                            style: 'background-color: transparent; text-align: left; align: right',
                            width: '99%',
                        },{
                            xtype: 'hiddenfield',
                            name: 'rtgast_uid',
                            value: rec.get('unique_id_long')
                        }, {
                            xtype: 'hiddenfield',
                            name: 'reserved_number3',
                            value: rec.get('reserved_number3')
                        }
                    ]
                },
                // {
                //     xtype: 'fieldset',
                //     title: '상세정보',
                //     frame: true,
                //     width: '100%',
                //     height: '100%',
                //     layout: 'fit',
                //     defaults: {
                //         margin: '2 2 2 2'
                //     },
                //     items: [
                //         {
                //             fieldLabel: '견적서 틀',
                //             xtype: 'combo',
                //             anchor: '100%',
                //             width: '99%',
                //             name: 'esti_template'
                //         }
                //     ]
                // },
                Ext.create('Ext.Button', {
                    text: '항목 추가',
                    width: '100%',
                    renderTo: Ext.getBody(),
                    handler: function () {
                        gm.me().addElement();
                    }
                })
            ]
        });

        var totalPrice = 0;

        for (var i = 0; i < gm.me().estiContentRecords.length; i++) {
            var rec = gm.me().estiContentRecords[i];
            console_logs('estiContentRecords >>>' ,rec);
            var system_code = rec.get('code_name');
            var system_name = rec.get('code_name_kr');
            var code_uid = rec.get('code_uid');
            var estobj_uid = rec.get('estobj_uid');
            if (gm.me().gridIds.indexOf(system_code) < 0) {
                gu.getCmp('formPanel').insert(gu.getCmp('formPanel').items.length - 1,
                    gm.me().createEsFieldSet(system_code, system_name, code_uid, estobj_uid, 'MODIFY'));
                var curFieldSet = gu.getCmp('fieldset-' + system_code);
                var curFieldItems = curFieldSet.items.items;
                console_logs('>>>>> curFieldItems.length' , curFieldItems.length);
                console_logs('>>>>> curFieldItems' , curFieldSet.items.items);
                for (var j = 0; j < curFieldItems.length; j++) {
                    if (curFieldItems[j].name != undefined && curFieldItems[j].name === 'totalPrice-' + system_code) {
                        curFieldItems[j].setValue(rec.get('total_price'));
                    } else if (curFieldItems[j].name != undefined && curFieldItems[j].name === 'codeUid-' + system_code) {
                        curFieldItems[j].setValue(rec.get('code_uid'));
                    }
                }
            }
 
            var store = gu.getCmp('grid-' + system_code).getStore();
            var item_name = rec.get('item_name');
            var sales_price = rec.get('item_price');
            var esti_uid = rec.get('unique_id_long');
            store.insert(store.getCount(), new Ext.data.Record({
                'esti_uid': esti_uid,
                'item_name': item_name,
                'sales_price': sales_price
            }));
        }

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '견적서수정',
            width: 950,
            height: 700,
            plain: true,
            items: form,
            overflowY: 'scroll',
            buttons: [{
                text: '견적가격 계산',
                listeners: {
                    click: function () {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var objs = [];
                            var arr = [];
                            var sum_price = 0;
                            for (var i = 0; i < gm.me().gridIds.length; i++) {
                                var id = gm.me().gridIds[i];
                                var storeData = gu.getCmp('grid-' + id).getStore();
                                var prices = val['totalPrice-' + id];
                                prices = prices.replace(/\,/g, '');
                                prices = Number(prices);
                                sum_price += prices;
                                console_logs('sum_price>>', sum_price);;
                            }
                            var real_sum_price = 0.0;
                            if(gu.getCmp('vatInclude_edit').checked) {
                                real_sum_price = sum_price;
                            } else {
                                real_sum_price = sum_price + (sum_price * 0.1);
                            }
                            
                            gu.getCmp('sale_price_edit').setValue(real_sum_price);
                        }
                    }
                }

            },
            {
                text: '견적서 수정',
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
                                obj['totalPrice'] = val['totalPrice-' + id].replace(/,/g, '');
                                obj['codeUid'] = val['codeUid-' + id];
                                obj['estUid'] = val['estUid-' + id];
                                var columns = [];
                                for (var j = 0; j < storeData.data.items.length; j++) {
                                    var item = storeData.data.items[j];
                                    var objv = {};
                                    objv['esti_uid'] = item.get('esti_uid');
                                    objv['item_name'] = item.get('item_name');
                                    objv['sales_price'] = item.get('sales_price');
                                    columns.push(objv);
                                }
                                obj['datas'] = columns;
                                objs.push(obj);
                            }
                            var reserved_number3 = rec.get('reserved_number3');
                            var jsonData = Ext.util.JSON.encode(objs);
                            var isVatYn= 'N';
                            if(gu.getCmp('vatInclude_edit').checked) { 
                                isVatYn= 'Y'
                            }
                            form.submit({
                                url: CONTEXT_PATH + '/purchase/prch.do?method=modifyEst',
                                waitMsg: '견적서를 수정중입니다.',
                                params: {
                                    jsonData: jsonData,
                                    reserved_number3: reserved_number3,
                                    isVatYn : isVatYn,
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
                text: '수정 취소',
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
    copyPoEsWindow: function (rec) {
        gm.me().gridIds = [];
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
                    title: '기본정보',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '작성일',
                            xtype: 'datefield',
                            anchor: '100%',
                            format : 'Y-m-d',
                            width: '99%',
                            name: 'create_date',
                            value: rec.get('create_date_str')
                        },
                        // 이름 -> 코드 (item_name) 
                        {
                            xtype: 'textfield',
                            editable: true,
                            fieldLabel: '제작명',
                            name: 'item_name',
                            width: '99%',
                            anchor: '100%',
                            value: rec.get('reserved_varchar1')
                        },
                        // 이름 -> 코드 (reserved_varchar5)
                        {
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            id: gu.id('carmakercombo-SRO5_HJ1'),
                            editable: true,
                            fieldLabel: '차량제조사',
                            width: '99%',
                            queryMode: 'remote',
                            displayField: 'code_name_kr',
                            valueField: 'code_name_kr',
                            store: Ext.create('Rfx2.store.company.hanjung.PoCarMakerStore', {}),
                            sortInfo: { field: 'unique_id', direction: 'ASC' },
                            value: rec.get('carMaker'),
                            minChars: 1,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false,
                            name: 'reserved_varchar5',
                            anchor: '100%',
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                }
                            },
                            pageSize: 25,
                            triggerAction: 'all',
                            listeners: {
                                beforeload: function () {
                                    gu.getCmp('carmakercombo-SRO5_HJ1').store.getProxy().setExtraParam('company_name',
                                        '%' + gu.getCmp('carmakercombo-SRO5_HJ1').getValue() + '%');
                                },
                            }
                        }, {
                            fieldLabel: '차종',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'car_name',
                            value: rec.get('reserved_varchar2')
                        }, {
                            fieldLabel: '고객명',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'customer_name',
                            value: rec.get('reserved_varchar4')
                        }, {
                            fieldLabel: '지입사',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            width: '99%',
                            name: 'corp_name'
                        },
                        // 이름 -> uid (emp_name)
                        {
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            id: gu.id('pmcombo-SRO5_HJ1'),
                            editable: true,
                            fieldLabel: '영업사원',
                            width: '99%',
                            queryMode: 'remote',
                            displayField: 'user_name',
                            valueField: 'user_name',
                            store: Ext.create('Mplm.store.UserSalerStore', {}),
                            sortInfo: { field: 'unique_id', direction: 'ASC' },
                            value: rec.get('saler_name'),
                            minChars: 1,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false,
                            name: 'emp_name',
                            anchor: '100%',
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{user_name}">{user_name} </font></div>';
                                }
                            },
                            pageSize: 25,
                            triggerAction: 'all',
                            listeners: {
                                beforeload: function () {
                                    gu.getCmp('pmcombo-SRO5_HJ1').store.getProxy().setExtraParam('company_name',
                                        '%' + gu.getCmp('pmcombo-SRO5_HJ1').getValue() + '%');
                                },
                            }
                        }, {
                            fieldLabel: '견적가<br>(세액포함)',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'sale_price',
                            id: gu.id('sales_price_add'),
                            value: rec.get('total_price')
                        }, {
                            fieldLabel: '사양',
                            xtype: 'textfield',
                            anchor: '100%',
                            allowBlank: true,
                            editable: true,
                            width: '99%',
                            value: rec.get('reserved_varchar6'),
                            name: 'reserved_varchar6'
                        },{
                            fieldLabel: '차량가격',
                            xtype: 'numberfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'car_price',
                            id: gu.id('car_price_add'),
                            value: rec.get('carPrice')
                        }, {
                            // fieldLabel: '공급가(VAT)포함 계산',
                            id : gu.id('vatInclude_copy'),
                            xtype: 'checkbox',
                            align : 'right',
                            anchor: '100%',
                            checked : false,
                            field_id: 'vatInclude',
                            hidden: true,
                            boxLabel: 'VAT 포함여부 확인',
                            style: 'background-color: transparent; text-align: left; align: right',
                            width: '99%',
                        },{
                            xtype: 'hiddenfield',
                            name: 'rtgast_uid',
                            value: rec.get('unique_id_long')
                        }
                    ]
                },
                // {
                //     xtype: 'fieldset',
                //     title: '상세정보',
                //     frame: true,
                //     width: '100%',
                //     height: '100%',
                //     layout: 'fit',
                //     defaults: {
                //         margin: '2 2 2 2'
                //     },
                //     items: [
                //         {
                //             fieldLabel: '견적서 틀',
                //             xtype: 'combo',
                //             anchor: '100%',
                //             width: '98%',
                //             name: 'esti_template'
                //         }
                //     ]
                // },
                Ext.create('Ext.Button', {
                    text: '항목 추가',
                    width: '100%',
                    renderTo: Ext.getBody(),
                    handler: function () {
                        gm.me().addElement();
                    }
                })
            ]
        });

        for (var i = 0; i < gm.me().estiContentRecords.length; i++) {
            var rec = gm.me().estiContentRecords[i];
            var system_code = rec.get('code_name');
            var system_name = rec.get('code_name_kr');
            var code_uid = rec.get('code_uid');
            var code_uid = rec.get('code_uid');
            var estobj_uid = rec.get('estobj_uid');

            if (gm.me().gridIds.indexOf(system_code) < 0) {
                gu.getCmp('formPanel').insert(gu.getCmp('formPanel').items.length - 1,
                    gm.me().createEsFieldSet(system_code, system_name, code_uid, estobj_uid, 'COPY'));
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

            var item_name = rec.get('item_name');
            var sales_price = rec.get('item_price');
            var esti_uid = rec.get('unique_id_long');

            store.insert(store.getCount(), new Ext.data.Record({
                'esti_uid': esti_uid,
                'item_name': item_name,
                'sales_price': sales_price
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
            buttons: [{
                text: '견적가격 계산',
                listeners: {
                    click: function () {
                        if (form.isValid()) {
                            var val = form.getValues(false);
                            var objs = [];
                            var arr = [];
                            var sum_price = 0;
                            for (var i = 0; i < gm.me().gridIds.length; i++) {
                                var id = gm.me().gridIds[i];
                                var storeData = gu.getCmp('grid-' + id).getStore();
                                var prices = val['totalPrice-' + id];
                                prices = prices.replace(/\,/g, '');
                                prices = Number(prices);
                                sum_price += prices;
                                console_logs('sum_price>>', sum_price);
                            }
                            var real_sum_price = 0;

                            if(gu.getCmp('vatInclude_copy').checked) {
                                real_sum_price = sum_price;
                            } else {
                                real_sum_price = sum_price + (sum_price * 0.1);
                            }
                            gu.getCmp('sales_price_add').setValue(real_sum_price);
                        }
                    }
                }

            }, {
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
                                obj['totalPrice'] = val['totalPrice-' + id].replace(/,/g, '');
                                obj['codeUid'] = val['codeUid-' + id];
                                obj['estUid'] = val['estUid-' + id];
                                var columns = [];
                                for (var j = 0; j < storeData.data.items.length; j++) {
                                    var item = storeData.data.items[j];
                                    var objv = {};
                                    objv['esti_uid'] = item.get('esti_uid');
                                    objv['item_name'] = item.get('item_name');
                                    objv['sales_price'] = item.get('sales_price');
                                    columns.push(objv);
                                }
                                obj['datas'] = columns;
                                objs.push(obj);
                            }
                            var jsonData = Ext.util.JSON.encode(objs);
                            form.submit({
                                url: CONTEXT_PATH + '/purchase/prch.do?method=insertEst&copy_flag=Y',
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
                                        // prWin.close();
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
    estToPoAct: function (unique_id, reserved_varchar1, reserved_varchar2, reserved_number1, reserved_varchar4, total_price, car_maker, combst_uid, reserved_number3, company_name, objs, reserved_double1) {
        var pjTypeStore = Ext.create('Ext.data.Store', {
            fields: ['pj_type', 'pj_type_kr'],
            data: [
                { "pj_type": "WB", "pj_type_kr": "윙타입" },
                { "pj_type": "OB", "pj_type_kr": "원바디타입" },
                { "pj_type": "CT", "pj_type_kr": "컨테이너타입" },
                { "pj_type": "CG", "pj_type_kr": "카고타입" },
                { "pj_type": "RT", "pj_type_kr": "냉동내장타입" },
                { "pj_type": "ETC", "pj_type_kr": "기타" }
            ]
        });
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
                    title: '수주등록 전 제작유형을 선택하십시오.',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '제작유형',
                            anchor: '100%',
                            width: '99%',
                            xtype: 'combo',
                            name: 'pj_type',
                            mode: 'local',
                            displayField: 'pj_type_kr',
                            store: pjTypeStore,
                            sortInfo: { field: 'pj_name', direction: 'DESC' },
                            valueField: 'pj_type',
                            typeAhead: false,
                            allowBlank: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{pj_type}] {pj_type_kr}</div>';
                                }
                            }
                        }
                    ]
                }
            ]
        });

        var subWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수주등록',
            width: 500,
            height: 150,
            plain: true,
            items: form,
            autoScroll: true,
            buttons: [{
                text: '확인',
                handler: function (btn) {
                    if (btn == 'no') {
                        subWin.close();
                    } else {
                        if (form.isValid()) {
                            console_logs('totalPrice >>>', total_price)
                            var val = form.getValues(false);
                            var type = val['pj_type'];
                            var type_kr = '';
                            switch (type) {
                                case 'WB':
                                    type_kr = '윙바디';
                                    break;
                                case 'CT':
                                    type_kr = '컨테이너';
                                    break;
                                case 'CG':
                                    type_kr = '카고';
                                    break;
                                case 'OB':
                                    type_kr = '원바디';
                                    break;
                                case 'RT':
                                    type_kr = '냉동내장';
                                    break;
                                case 'ETC':
                                    type_kr = '기타';
                                    break;
                                default:
                                    type_kr = type;
                                    break;
                            }

                            Ext.MessageBox.show({
                                title: '수주등록',
                                msg: '제작명 : ' + reserved_varchar1 + '<br>' + '차종 : ' + reserved_varchar2 + '<br>고객명 : ' + reserved_varchar4 + '<br> 견적가격 : ' + total_price + '<br>제작유형 : [' + type + '] ' + type_kr + '<br><br>해당 견적을 수주등록 하시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                icon: Ext.MessageBox.QUESTION,
                                fn: function (btn) {
                                    if (btn == "no") {
                                        subWin.close();
                                        return;
                                    } else {
                                        var date = new Date();
                                        var fullYear = gUtil.getFullYear() + '';
                                        var month = gUtil.getMonth() + '';
                                        var day = date.getDate() + '';
                                        if (month.length == 1) {
                                            month = '0' + month;
                                        }
                                        if (day.length == 1) {
                                            day = '0' + day;
                                        }
                                        var pj_code = fullYear.substring(2, 4) + month + day + '-';

                                        var loadPage = new Ext.LoadMask({
                                            msg: '데이터를 처리중입니다.',
                                            visible: true,
                                            target: subWin
                                        });

                                        loadPage.show();
                                        var jsonData = Ext.util.JSON.encode(objs);
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/purchase/prch.do?method=estimateToPo',
                                            params: {
                                                unique_id: unique_id, // rtgast_uid
                                                reserved_varchar1: reserved_varchar1, // 제작명
                                                reserved_varchar2: reserved_varchar2, // 차종
                                                reserved_number1: reserved_number1, // 영업사원
                                                reserved_varchar4: reserved_varchar4, // 고객명
                                                reserved_number3: reserved_number3, // 지입사 uid
                                                total_price: total_price, // 견적가격
                                                pj_type: type, // 제작유형
                                                pj_first: pj_code,
                                                codeLenth: 3,
                                                car_maker: car_maker, // 차량제조사
                                                combst_uid: combst_uid, // combst_uid 
                                                standard_column: 'reserved_varcharh',
                                                company_name: company_name,
                                                jsonData: jsonData,
                                                reserved_double1: reserved_double1
                                            },
                                            success: function (result, request) {
                                                Ext.MessageBox.alert('알림', '해당 견적서가 수주등록 되었습니다.<br>해당 결과는 수주등록에서 확인하십시오.');
                                                subWin.close();
                                                loadPage.visible = false;
                                                gm.me().store.load();

                                            },
                                            failure: extjsUtil.failureMessage
                                        });
                                    }
                                }
                            });
                        } else {
                            Ext.MessageBox.show({
                                title: '수주등록',
                                msg: '제작유형을 선택하십시오',
                                buttons: Ext.MessageBox.YES,
                                icon: Ext.MessageBox.WARNING,
                                fn: function (btn) {
                                    if (btn == "yes") {
                                        return;
                                    }
                                }
                            });
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
            }
            ]
        });
        subWin.show();
    },
    pdfDownload: function (size, reportSelection, pos) {
        if (size > pos) {
            var unique_id = reportSelection[pos].get('unique_id');
            console_logs('uid>>>> ', unique_id);
            var state = reportSelection[pos].get('state');
            gMain.setCenterLoading(true);
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
                    gMain.setCenterLoading(false);
                },
                failure: function (val, action) {
                    gMain.setCenterLoading(false);
                    Ext.Msg.alert('오류', '파일을 불러오는 도중 오류가 발생하였습니다.');
                }
            });
        }
    },
    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var rec = selections[0];
        var unique_id = rec.get('unique_id');
        var state = rec.get('state');
        gMain.setCenterLoading(true);
        Ext.Ajax.request({
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
                console_logs(pdfPath);
                if (pdfPath.length > 0) {
                    var pdfPathSplit = pdfPath.split('/');
                    var fileName = pdfPathSplit[pdfPathSplit.length - 1];
                    var pageScale = (window.screen.width / 1000).toFixed(1);
                    console_logs('>>>>>> fileName', fileName);
                    var pdfView = Ext.create('PdfViewer.view.panel.PDF', {
                        width: window.screen.width / 5 * 3 + 20,
                        height: window.screen.height / 4 * 3 - 35,
                        pageScale: pageScale,
                        showPerPage: true,
                        pageBorders: false,
                        disableTextLayer: true,
                        src: '/download/PDF/' + fileName,
                        renderTo: Ext.getBody()
                    });
                    var woWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: '견적서 PDF 미리보기',
                        width: window.screen.width / 5 * 3 + 20,
                        height: window.screen.height / 4 * 3,
                        plain: true,
                        items: [
                            pdfView
                        ]
                    });
                    gMain.setCenterLoading(false);
                    woWin.show();
                }
            },
            failure: function (val, action) {
                gMain.setCenterLoading(false);
                Ext.Msg.alert('오류', '파일을 불러오는 도중 오류가 발생하였습니다.');
            }
        });
    }

});
