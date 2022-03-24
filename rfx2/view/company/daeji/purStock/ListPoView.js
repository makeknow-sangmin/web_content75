Ext.require([
    'Ext.ux.CustomSpinner'
]);
Ext.define('Rfx2.view.company.daeji.purStock.ListPoView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'list-po-view',
    listPoviewGrid: null,
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'dateRange',
            field_id: 'aprv_date',
            text: '주문일자',
            labelWidth: 48,
            sdate: Ext.Date.add(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)),
            edate: new Date()
        });

        this.addSearchField('seller_name');
        this.addSearchField('po_no');

        this.addSearchField({
            type: 'combo',
            field_id: 'status_kr_typeb'
            , emptyText: '상태'
            , store: "CommonCodeStore"
            , params: {parentCode: 'PO_STATUS'}
            , displayField: 'code_name_kr'
            , valueField: 'system_code'
            , value: 'NM'
            , innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>'
        });

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', gm.pageSize);

        this.localSize = gm.unlimitedPageSize;

        this.createStore('Rfx2.model.company.bioprotech.ListPo', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            this.localSize
            , {}
            , ['rtgast']
        );

        var option = {};

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGridCore(arr, option);
        this.editAction.setText('상세보기');
        this.setEditPanelTitle('상세보기');

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.modifyPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '주문 수정',
            tooltip: '주문을 수정합니다. 주문서 단위로 수정합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('modifyPoAction'),
            handler: function () {
                gm.me().treatModifyPo(gm.me().grid.getSelectionModel().getSelection()[0]);
            }
        });

        this.approvePoAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '주문 승인',
            tooltip: '주문을 승인합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('approvePoAction'),
            handler: function () {
                gm.me().treatApprovePo(gm.me().grid.getSelectionModel().getSelection()[0]);
            }
        });

        this.restorePoAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '주문취소',
            tooltip: '주문을 취소합니다.',
            disabled: true,
            handler: function () {
                var rec = gm.me().rec;

                if (rec.get('state') == 'A') {
                    Ext.MessageBox.show({
                        title: '확인',
                        msg: '주문을 취소 하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (result) {
                            if (result == 'yes') {
                                gm.me().restorePo();

                            }
                        },
                        icon: Ext.MessageBox.QUESTION
                    });
                } else {
                    Ext.Msg.alert('경고', '결재완료 상태의 주문건만 취소할 수 있습니다.');
                }
            }
        });

        this.sendMailAction = Ext.create('Ext.Action', {
            iconCls: 'af-external-link',
            text: '메일전송',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('sendMailAction'),
            handler: function (widget, event) {
                console_logs('==>Dddd', gm.me().grid.getSelectionModel().getSelection());
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                var supplier_name = '';
                var rtgast_uid = rec.get('unique_id_long');//rtgast_uid
                var supplier_email_address = rec.get('supplier_email_address');
                var po_no = rec.get('po_no');//po_no
                var po_detail = /*Ext.getCmp('po_detail').getValue()*/'';

                var email = vCUR_EMAIL;

                po_detail = po_detail.replace(/(?:\r\n|\r|\n)/g, '<br />');
                po_detail = po_detail + "<br /><br /><br />본 메일은 발신전용이오니 아래의 연락처에 문의하세요.<br /><br />";
                po_detail = po_detail + "문의처: " + vCUR_DEPT_NAME + ', ' + vCUR_USER_NAME + ' (' + email + ')<br />';
                po_detail = po_detail + "별첨: 주문서";

                var byCompany = '';

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
                            anchor: '100%'  // anchor width by percentage
                        },
                        {
                            name: 'mailSubject',
                            allowBlank: false,
                            value: '[' + po_no + ']' + supplier_name + '주문합니다.' + byCompany,
                            anchor: '100%'  // anchor width by percentage
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
                                //console_logs('val', val);
///********************파일첨부시 추가(Only for FileAttachment)**************
                                //alert('add Handler:' + /*(G)*/vFILE_ITEM_CODE);
                                /*(G)*/
                                vFILE_ITEM_CODE = RandomString(10);
                                val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;

                                mailForm.submit({
                                    url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' + /*(G)*/vFILE_ITEM_CODE,
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
                                                }//
                                                Ext.MessageBox.alert('전송확인', '전송되었습니다.');
                                            },
                                            failure: extjsUtil.failureMessage
                                        });//ajaxrequest
                                    },
                                    failure: function () {
                                        console_log('failure');
//	                    		mask.hide();
                                        Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                    }
                                });

                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            }

                        }//endofhandler
                    }, {
                        text: CMD_CANCEL,
                        handler: function () {
                            if (win) {
                                win.close();
                            }//endofwin
                        }//endofhandler
                    }//CMD_CANCEL
                    ]//buttons
                });
                win.show();

            }//endofhandler
        });

        //PDF 파일 출력기능
        this.printPDFPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '발주서',

            tooltip: '발주서 출력',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('printPDFPoAction'),
            handler: function (widget, event) {
                var rtgast_uid = gm.me().vSELECTED_UNIQUE_ID;
                var po_no = gm.me().vSELECTED_PO_NO;

                var route_type = gm.me().vSELECTED_ROUT_TYPE;

                var supplier_code = gm.me().rec.get('supplier_code');

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printPo',
                    params: {
                        rtgast_uid: rtgast_uid,
                        po_no: po_no,
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'N',
                        route_type: route_type,
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

                    },
                    failure: extjsUtil.failureMessage
                });
                is_rotate = '';
            }
        });

        //PDF 파일 출력기능
        this.printPDFPoEnAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '영문발주서',
            tooltip: '영문 발주서 출력',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('printPDFPoEnAction'),
            handler: function (widget, event) {
                var rtgast_uid = gm.me().vSELECTED_UNIQUE_ID;
                var po_no = gm.me().vSELECTED_PO_NO;

                var route_type = gm.me().vSELECTED_ROUT_TYPE;

                var supplier_code = gm.me().rec.get('supplier_code');

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printPo',
                    params: {
                        rtgast_uid: rtgast_uid,
                        po_no: po_no,
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'N',
                        route_type: route_type,
                        supplier_name: supplier_code,
                        type: 'EN'
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

                    },
                    failure: extjsUtil.failureMessage
                });
                is_rotate = '';
            }
        });

        //결의서
        this.printPDFPeAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '결의서',

            tooltip: '결의서 출력',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('printPDFPeAction'),
            handler: function (widget, event) {
                var rtgast_uid = gm.me().vSELECTED_UNIQUE_ID;
                var po_no = gm.me().vSELECTED_PO_NO;

                var route_type = gm.me().vSELECTED_ROUT_TYPE;

                var supplier_code = gm.me().rec.get('supplier_code');

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printPe',
                    params: {
                        rtgast_uid: rtgast_uid,
                        po_no: po_no,
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'N',
                        route_type: route_type,
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

                    },
                    failure: extjsUtil.failureMessage
                });
                is_rotate = '';
            }
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.approvePoAction);
        buttonToolbar.insert(1, this.modifyPoAction);
        buttonToolbar.insert(1, this.sendMailAction);
        buttonToolbar.insert(1, this.printPDFPoEnAction);
        buttonToolbar.insert(1, this.printPDFPoAction);
        buttonToolbar.insert(1, this.printPDFPeAction);
        buttonToolbar.insert(1, '-');

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length > 0) {
                var rec = selections[0];
                gm.me().rec = rec;

                gm.me().vSELECTED_UNIQUE_ID = rec.get('po_group_uid'); //rtgast_uid
                gm.me().vSELECTED_PO_NO = rec.get('po_no'); //po_no
                gm.me().vSELECTED_QUAN = rec.get('quan');
                gm.me().vSELECTED_ROUT_TYPE = rec.get('route_type_s');
                gm.me().vSELECTED_PJ_CODE = rec.get('pj_code');
                gm.me().editAction.enable();
                gm.me().printPDFPeAction.enable();
                gm.me().sendMailAction.enable();
                gm.me().restorePoAction.enable();
                gm.me().modifyPoAction.enable();

                if (rec.get('state') === 'I') {
                    if (gm.me().userType.includes('PURM')) {
                        gm.me().approvePoAction.enable();
                    }
                }

                if (rec.get('state') !== 'I') {
                    gm.me().printPDFPoAction.enable();
                    gm.me().printPDFPoEnAction.enable();
                }

            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().editAction.disable();
                gm.me().printPDFPoAction.disable();
                gm.me().printPDFPoEnAction.disable();
                gm.me().printPDFPeAction.disable();
                gm.me().sendMailAction.disable();
                gm.me().restorePoAction.disable();
                gm.me().approvePoAction.disable();
                gm.me().modifyPoAction.disable();

            }

            if (gm.me().vSELECTED_UNIQUE_ID === -1) {
                gm.me().vSELECTED_UNIQUE_ID = Number.MAX_SAFE_INTEGER;
            }

            gm.me().lStore.getProxy().setExtraParam('po_group_uid', gm.me().vSELECTED_UNIQUE_ID);
            gm.me().lStore.getProxy().setExtraParam('limit', 100);
            gm.me().lStore.load(function (record) {

            });
        });
        this.createCrudTab();
        this.crudTab.setSize(this.getCrudeditSize());
        console_logs('getCrudeditSize>>>>>>>>>', this.getCrudeditSize());


        // Ext.apply(this, {
        //     layout: 'border',
        //     items: [this.grid, this.crudTab]
        // });

        this.cancelPo = Ext.create('Ext.Action', {
            disabled: true,
            iconCls: 'af-remove',
            //cls: 'red-color',
            text: '주문취소',
            tooltip: '주문취소',
            handler: this.cancelPoHandler
        });

        this.returnPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '발주반려',
            tooltip: '발주 반려',
            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
            disabled: true,
            handler: this.returnPoHandler
        });


        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);
        //디폴트 로드
        gm.setCenterLoading(false);
        this.store.getProxy().setExtraParam('rtg_state_list', "A:G"); //입고된 것도 출력.
        this.store.getProxy().setExtraParam('exclude_status_deny', 'Y');

        var s_date = Ext.Date.add(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
        s_date = Ext.Date.format(s_date, 'Y-m-d');
        var e_date = new Date();
        e_date = Ext.Date.format(e_date, 'Y-m-d');

        this.store.getProxy().setExtraParam('aprv_date', s_date + ':' + e_date);
        this.store.getProxy().setExtraParam('status_kr_typeb', 'NM');


        this.store.load();
    },
    selectPcsRecord: null,
    items: [],

    returnPoHandler: function () {
        var viewSelections = gm.me().listPoviewGrid.getSelectionModel().getSelection();
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var xpoast_uids = [];
        var po_no = selections[0].get('po_no');
        var item_quan = selections[0].get('item_quan');
        var pj_code = selections[0].get('pj_code');
        var item_length = viewSelections.length;
        var check_all = false;

        for (var i = 0; i < item_length; i++) {
            var rec = viewSelections[i];
            gr_qty = rec.get('gr_qty');
            if (gr_qty != null && gr_qty > 0) {
                Ext.Msg.alert('경고', '입고된 항목이 있습니다.', function () {
                })
                return;
            }
            xpoast_uids.push(rec.get('id'));
        }

        var msg = '주문반려하시겠습니까?<br> 이작업은 취소할 수 없습니다.'
        var alert = '알림';

        if (item_quan == item_length) {
            msg = '발주전체 반려하시겠습니까?<br> 이작업은 취소할 수 없습니다.'
            alert = '경고';
            check_all = true;
        }
        ;

        Ext.MessageBox.confirm(alert, msg, function (btn) {
            if (btn == 'yes') {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/prch.do?method=returnListPoItems',
                    params: {
                        xpoast_uids: xpoast_uids,
                        po_no: po_no,
                        check_all: check_all,
                        pj_code: pj_code
                    },
                    success: function (result, request) {
                        Ext.Msg.alert('저장', '반려되었습니다.', function () {
                        });
                        gm.me().listPoviewGrid.store.load(function (record) {
                        });
                        gm.me().store.load();

                    },//endofsuccess


                });//endofajax
            } else {
            }
        });
    },
    cancelPoHandler: function () {

        var grid = gu.getCmp('productGrid');

        var selections = grid.getSelectionModel().getSelection();
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
                        account_code: gm.me().vSELECTED_PJ_CODE,
                        po_blocking_qty: blocking,
                        unique_id: uids
                    },
                    success: function (result, request) {
                        Ext.Msg.alert('저장', '취소되었습니다.', function () {
                        });
                        gm.me().lStore().load();

                    },//endofsuccess


                });//endofajax
            } else {
            }
        });


    },
    getCrudeditSize: function () {
        if (this.crudEditSize > 0) {
            return this.crudEditSize;
        }

        if (gm.checkPcHeight()) {
            //console_logs('getCrudeditSize', this.getCrudeditSize);
            return this.crudEditSize < 0 ? 800 : this.crudEditSize;
        } else {
            return 200;
        }
    },

    selMode: vCompanyReserved4 == 'KWLM01KR' ? 'MULIT' : 'SINGLE',
    selCheckOnly: false,
    selAllowDeselect: true,
    setActiveCrudPanel: function (mode) {
        this.crudMode = mode;

        var crudTab = Ext.getCmp(gm.geViewCrudId());
        if (crudTab != null) {
            crudTab.setTitle(this.vMESSAGE[this.crudMode]);
            this.createAction.setText(this.vButtonLabel[this.crudMode]);
            if (this.propDisplayProp == true) {
                switch (this.crudMode) {
                    case "VIEW":
                        crudTab.setSize(this.getCrudviewSize());
                        crudTab.setActiveItem(1);
                        //if(gm.getOpenCrudWindow() == true) {
                        crudTab.collapse();
                        //}
                        break;
                    case "CREATE":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
                        //crudTab.expand();
                        break;
                    case "EDIT":
                    case "COPY":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
                        crudTab.expand();
                        break;
                }
                this.fillEditForm(this.selected_records, this.crudMode);
            } else {
                switch (this.crudMode) {
                    case "CREATE":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
                        crudTab.expand();
                        break;
                    case "VIEW":
                        crudTab.collapse();
                        break;
                    case "EDIT":
                    case "COPY":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
                        crudTab.expand();
                        break;
                }
            }
        }
    },

    restorePo: function () {

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/prch.do?method=restorePo',
            params: {
                rtgast_uid: gm.me().rec.id// rtgast_uid
            },
            success: function (result, request) {
                Ext.Msg.alert('알림', '취소가 완료 되었습니다.');
                gm.me().storeLoad();
            },//endofsuccess

        });//endofajax
    },

    attachFileView: function () {
        var fieldPohistory = [
            {name: 'account_code', type: "string"},
            {name: 'account_name', type: "string"},
            {name: 'po_no', type: "string"},
            {name: 'po_date', type: "string"},
            {name: 'seller_code', type: "string"},
            {name: 'seller_name', type: "string"},
            {name: 'sales_price', type: "string"},
            {name: 'pr_qty', type: "string"}
        ];

        Ext.define('SrcCst', {
            extend: 'Ext.data.Model',
            fields: [{name: 'object_name', type: "string"},
                {name: 'file_path', type: "string"},
                {name: 'file_size', type: "string"}],
            proxy: {
                type: 'ajax',
                api: {
                    read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=detailSrcCstPo',
                },
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success',
                    excelPath: 'excelPath'
                }
            }
        });

        var selections = gm.me().grid.getSelectionModel().getSelection();
        console_logs('===>attachFileView', selections);
        if (selections) {
            file_store = new Ext.data.Store({
                pageSize: getPageSize(),
                model: 'SrcCst',
                sorters: [{
                    property: 'unique_id',
                    direction: 'DESC'
                }]
            });
            var rec = gm.me().grid.getSelectionModel().getSelection()[0];
            var unique_id = selections[0].get('unique_id');
            file_store.getProxy().setExtraParam('rtg_uid', unique_id);
            file_store.load();

            var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});

            var fileGrid = Ext.create('Ext.grid.Panel', {
                title: '첨부',
                store: file_store,
                collapsible: true,
                multiSelect: true,
                selModel: selFilegrid,
                stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

                ],
                columns: [
                    {
                        text: 'UID',
                        width: 100,
                        sortable: true,
                        dataIndex: 'id'
                    },
                    {
                        text: '파일명',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'object_name'
                    },
                    {
                        text: '파일유형',
                        width: 70,
                        sortable: true,
                        dataIndex: 'file_ext'
                    },
                    {
                        text: '날짜',
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
                        style: 'text-align:right',
                        align: 'right',
                        dataIndex: 'file_size'
                    }]
            });

            var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: '첨부파일',
                width: 1200,
                height: 600,
                items: [
                    fileGrid
                ],
                buttons: [
                    {
                        text: CMD_OK,
                        //scope:this,
                        handler: function () {
                            if (prWin) {
                                prWin.close();
                            }
                        }
                    }
                ]
            })
            prWin.show();
        }
    },

    updatePrintYn: function (rtgast_uid) {
        console_logs('>>rtgast_uid', rtgast_uid);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/prch.do?method=updatePoPrintYn',
            params: {
                unique_id: rtgast_uid
            },
            success: function (result, request) {
                gm.me().storeLoad();
            },//endofsuccess

        });//endofajax

    },

    treatModifyPoOld: function (rec) {

        var origin_qty = 0;
        var po_qty = 0;
        var po_blocking_qty = 0;
        var can_qty = 0;
        var gr_qty = 0;
        var sales_price = 0;
        var unique_id = 0;
        var item_name = '';
        var mass = '';
        var req_delivery_date = null;
        var sales_amount = 0;

        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});

        this.lGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('lGrid'),
            store: this.lStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: true,
            region: 'center',
            resizable: false,
            scroll: true,
            height: 530,
            layout: 'fit',
            forceFit: false,
            // dockedItems: {
            //     dock: 'top',
            //     xtype: 'toolbar',
            //     cls: 'my-x-toolbar-default3',
            //     items: [
            //         this.cancelPo
            //     ]
            // },
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

                    //	 gm.me().downListRecord(record);
                }, //endof itemdblclick
                cellkeydown: function (listPoviewGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {
                        console_logs('++++++++++++++++++++ e.getKey()', e.getKey());
                    }


                },
                itemclick: function (view, rec, htmlItem, index, eventObject, opts) {
                    console_logs('++++++++++++++++++++ itemclick rec', rec);
                    unique_id = rec.get('id');
                    po_qty = rec.get('po_qty');
                    origin_qty = rec.get('po_qty');//수정 전 주문수량
                    gr_qty = rec.get('gr_qty');//입고수량
                    sales_price = rec.get('sales_price');//주문단가
                    sales_amount = rec.get('sales_amount'); // 금액
                    can_qty = po_qty - gr_qty;//주문가능수량
                    po_blocking_qty = rec.get('po_blocking_qty');//주문취소수량
                    item_name = rec.get('item_name');
                    mass = rec.get('mass');
                    req_delivery_date = null;
                }
            }
        });

        this.lGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                var sales_amounts = 0;
                var po_qtys = 0;
                if (selections.length > 0) {
                    gm.me().cancelPo.enable();
                    gm.me().returnPoAction.enable();

                    var rec = selections[0];
                    console_logs('상세정보>>>>>>>>>>>>>', rec);

                    var uids = [];

                    for (var i = 0; i < selections.length; i++) {
                        var o = selections[i];
                        gm.me().vSELECTED_QUAN = rec.get('quan');
                        var xpoast_uid = o.get('id');
                        uids.push(xpoast_uid);
                        console_logs('uids', uids);
                        console_logs('gm.me().vSELECTED_QUAN>>>>>>>>>>>>>', gm.me().vSELECTED_QUAN);
                        var sales_amount = o.get('sales_price');
                        var po_qty = o.get('po_qty');
                        sales_amount = parseFloat(sales_amount);
                        po_qty = parseFloat(po_qty);
                        sales_amounts += sales_amount;
                        po_qtys += po_qty;
                    }
                } else {
                    gm.me().cancelPo.disable();
                    gm.me().returnPoAction.disable();
                }
            }
        });

        gm.extFieldColumnStore.load({
            params: {menuCode: 'PPO2_SUB'},
            callback: function (records, operation, success) {
                if (success == true) {

                    var gridId = 'listPoviewGrid' == null ? this.getGridId() : 'listPoviewGrid';
                    console_logs('gridId>>>>>>>>>>', gridId);

                    var o = gm.parseGridRecord(records, gridId);

                    var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
                    gm.me().lGrid.reconfigure(columns);
                    gm.me().lStore.load(function (record) {
                    });

                    //this.callBackWorkList(title, records, arg, fc, id);
                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '주문 수정',
            width: 800,
            height: 600,
            plain: true,
            items: this.lGrid,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {

                    var msg = '주문을 수정하시겠습니까?'
                    var myTitle = '주문 수정 확인';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,

                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {

                            } // btnIf of end
                        }//fn function(btn)

                    });//show
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

    treatApprovePo: function (rec) {
        var msg = '주문을 승인하시겠습니까?'
        var myTitle = '주문 승인 확인';
        Ext.MessageBox.show({
            title: myTitle,
            msg: msg,

            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn) {

                if (btn == "yes") {
                    gm.editAjax('rtgast', 'state', 'A', 'po_no', rec.get('po_no'), {type: ''});
                } else {

                } // btnIf of end
            }//fn function(btn)

        });//show
    },

    lStore: Ext.create('Rfx2.store.company.bioprotech.ListPoStore', {}),

    treatModifyPo: function (recParent) {

        var selections = (gm.me().lStore.getData().getSource() || gm.me().lStore.getData()).getRange();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;

        var rs = null;

        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알 림", "선택된 자재가 없습니다.");
        } else {

            var form = null;
            var pjArr = [];
            var supArr = [];
            var cartmapUids = [];
            var exchange_rates = [];
            var notDefinedSup = false;

            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                console_logs('rec', rec);
                var coord_key1 = rec.get('coord_key1');
                if (coord_key1 == undefined || coord_key1 == null || coord_key1 == '' || coord_key1 < 0) {
                    notDefinedSup = true;
                }
                pjArr.push(rec.get('pj_code'));
                supArr.push(coord_key1);
                cartmapUids.push(rec.get('id'));
                exchange_rates.push(rec.get('exchange_rate'));
            }

            pjArr = gu.removeDupArray(pjArr);
            supArr = gu.removeDupArray(supArr);
            console_logs('pjArr', pjArr);
            console_logs('supArr', supArr);
            console_logs('cartmapUids', cartmapUids);

            var total = 0;
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                var total_price = rec.get('sales_amount');
                total = total + total_price;
            }

            gm.me().cancelPo.disable();

            var productGrid = Ext.create('Ext.grid.Panel', {
                store: gm.me().lStore,
                cls: 'rfx-panel',
                id: gu.id('productGrid'),
                collapsible: false,
                multiSelect: false,
                width: 1150,
                height: 300,
                margin: '0 0 20 0',
                autoHeight: true,
                frame: false,
                border: true,
                forceFit: false,
                viewConfig: {
                    markDirty: false
                },
                columns: [
                    {text: '상태', width: 80, dataIndex: 'status_kr_typeb', style: 'text-align:center', sortable: false},
                    {text: '요청번호', width: 80, dataIndex: 'pr_no', style: 'text-align:center', sortable: false},
                    {text: '품번', width: 100, dataIndex: 'item_code', style: 'text-align:center', sortable: false},
                    {text: '품명', width: 200, dataIndex: 'item_name', style: 'text-align:center', sortable: false},
                    {
                        text: '규격',
                        width: 200,
                        dataIndex: 'specification',
                        style: 'text-align:center',
                        sortable: false
                    },
                    {text: '단위', width: 60, dataIndex: 'unit_code', style: 'text-align:center', sortable: false},
                    {
                        text: '요청수량', width: 80, dataIndex: 'pr_qty', style: 'text-align:center', sortable: false,
                        align: 'right',
                        renderer: renderDecimalNumber
                    },
                    {
                        text: '주문수량', width: 80, dataIndex: 'po_qty', sortable: false,
                        editor: 'textfield',
                        style: 'text-align:center',
                        align: 'right',
                        css: 'edit-cell',
                        renderer: renderDecimalNumber
                    },
                    {
                        text: '주문단가', width: 80, dataIndex: 'sales_price', sortable: false,
                        editor: 'textfield',
                        style: 'text-align:center',
                        align: 'right',
                        renderer: renderDecimalNumber
                    },
                    {
                        text: '계약통화',
                        width: 60,
                        dataIndex: 'sales_currency',
                        style: 'text-align:center',
                        sortable: false
                    },
                    {
                        text: '합계금액',
                        width: 100,
                        dataIndex: 'sales_amount',
                        style: 'text-align:center',
                        sortable: false,
                        align: 'right',
                        renderer: renderDecimalNumber
                    },
                    {
                        text: '환율',
                        width: 100,
                        dataIndex: 'buying_exchange_rate',
                        style: 'text-align:center',
                        sortable: false,
                        align: 'right',
                        renderer: renderDecimalNumber
                    },
                    {
                        text: '원화금액',
                        width: 150,
                        dataIndex: 'total_price_kor',
                        style: 'text-align:center',
                        sortable: false,
                        align: 'right',
                        renderer: renderDecimalNumber
                    },
                    {
                        text: '납기일',
                        width: 102,
                        dataIndex: 'req_delivery_date',
                        style: 'text-align:center',
                        sortable: false,
                        editor: {
                            xtype: 'datefield',
                            format: 'Y-m-d',
                            altFormats: 'm/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j|c'
                        },
                        renderer: Ext.util.Format.dateRenderer('Y-m-d')
                    }
                ],
                selModel: 'cellmodel',
                plugins: {
                    ptype: 'cellediting',
                    clicksToEdit: 2
                },
                dockedItems: {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default3',
                    items: [
                        this.cancelPo
                    ]
                },
                listeners: {
                    edit: function (editor, e, eOpts) {
                        e.record.set('po_qty', e.record.get('po_qty') * 1);
                        e.record.set('sales_price', e.record.get('sales_price') * 1);
                        e.record.set('sales_amount', e.record.get('po_qty') * e.record.get('sales_price'));

                        var store = gu.getCmp('productGrid').getStore();
                        var selections = (store.getData().getSource() || store.getData()).getRange();
                        var total = 0.0;

                        for (var i = 0; i < selections.length; i++) {
                            var rec = selections[i];
                            var total_price = selections[i].get('sales_amount');
                            total = total + total_price;
                        }

                        gu.getCmp('order_total_price').setValue(Ext.util.Format.number(total, '0,00.#####') +
                            ' ' + e.record.get('sales_currency'));
                    },
                    selectionchange: function (sm, selections) {
                        if (selections.length > 0) {
                            gm.me().cancelPo.enable();
                        } else {
                            gm.me().cancelPo.disable();
                        }
                    }
                }
            });

            gm.me().whouseStore.load();

            var form = Ext.create('Ext.form.Panel', {
                id: gu.id('formPanel'),
                xtype: 'form',
                frame: false,
                border: false,
                width: '100%',
                layout: 'column',
                bodyPadding: 10,
                width: '100%',
                items: [{
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
                            border: true,
                            defaultMargins: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 10
                            },
                            items: [
                                {
                                    fieldLabel: '주문처',
                                    xtype: 'textfield',
                                    width: '45%',
                                    padding: '0 0 5px 30px',
                                    value: recParent.get('seller_name'),
                                    fieldStyle: 'background-color: #ddd; background-image: none;',
                                    readOnly: true
                                }, {
                                    fieldLabel: '합계금액',
                                    id: gu.id('order_total_price'),
                                    xtype: 'textfield',
                                    width: '45%',
                                    padding: '0 0 5px 30px',
                                    fieldStyle: 'background-color: #ddd; background-image: none;',
                                    value: Ext.util.Format.number(total, '0,00.#####') + ' ' + recParent.get('sales_currency'),
                                    readOnly: true
                                }, {
                                    fieldLabel: '요약',
                                    xtype: 'textfield',
                                    name: 'item_abst',
                                    width: '45%',
                                    padding: '0 0 5px 30px',
                                    fieldStyle: 'background-color: #ddd; background-image: none;',
                                    value: recParent.get('item_abst'),
                                    readOnly: true
                                },
                                {
                                    fieldLabel: '주문번호',
                                    xtype: 'textfield',
                                    width: '45%',
                                    padding: '0 0 5px 30px',
                                    name: 'po_no',
                                    value: recParent.get('po_no'),
                                    fieldStyle: 'background-color: #ddd; background-image: none;',
                                    readOnly: true
                                },
                                {
                                    fieldLabel: '납품장소',
                                    xtype: 'combo',
                                    width: '45%',
                                    padding: '0 0 5px 30px',
                                    name: 'reserved_number1',
                                    store: gm.me().whouseStore,
                                    displayField: 'wh_name',
                                    valueField: 'unique_id_long',
                                    emptyText: '선택',
                                    allowBlank: true,
                                    typeAhead: false,
                                    value: recParent.get('reserved_number1'),
                                    minChars: 1,
                                    listConfig: {
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{systemCode}">[{wh_code}] {wh_name}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {

                                        }
                                    }
                                },
                                {
                                    fieldLabel: '요청사항',
                                    xtype: 'textarea',
                                    rows: 4,
                                    width: '45%',
                                    padding: '0 0 5px 30px',
                                    name: 'reserved_varchar2',
                                    value: recParent.get('reserved_varchar2')
                                },
                                {
                                    fieldLabel: '작성일자',
                                    xtype: 'datefield',
                                    width: '45%',
                                    padding: '0 0 5px 30px',
                                    name: 'aprv_date',
                                    value: recParent.get('aprv_date'),
                                    fieldStyle: 'background-color: #ddd; background-image: none;',
                                    readOnly: true,
                                    altFormats: 'm/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j|c',
                                    format: 'Y-m-d'
                                },
                                {
                                    fieldLabel: '결제 조건',
                                    xtype: 'combo',
                                    width: '45%',
                                    padding: '0 0 5px 30px',
                                    name: 'reserved_varchar3',
                                    store: gm.me().payConditionStore,
                                    displayField: 'codeName',
                                    valueField: 'systemCode',
                                    emptyText: '선택',
                                    allowBlank: true,
                                    typeAhead: false,
                                    value: recParent.get('reserved_varchar3'),
                                    minChars: 1,
                                    listConfig: {
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            //gu.getCmp('pay_condition').setValue(record.get('codeName'));
                                        }
                                    }
                                },
                                {
                                    xtype: 'hiddenfield',
                                    id: gu.id('rtgast_uid'),
                                    name: 'rtgast_uid',
                                    value: recParent.get('po_group_uid')
                                }
                            ]
                        }
                    ]
                }, {
                    xtype: 'fieldset',
                    frame: true,
                    title: gm.me().getMC('msg_order_dia_prd_header_title', '상세정보'),
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    bodyPadding: 10,
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        productGrid
                    ]
                }
                ]
            });

            var myWidth = 1200;
            var myHeight = 650;

            var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: '주문 수정',
                width: myWidth,
                height: myHeight,
                plain: true,
                items: form,
                buttons: [{
                    text: CMD_OK,
                    handler: function (btn) {

                        var store = gu.getCmp('productGrid').getStore();
                        var selections = (store.getData().getSource() || store.getData()).getRange();

                        var xpoastUids = [];
                        var exchange_rates = [];
                        var sales_prices = [];
                        var sales_amounts = [];
                        var po_qtys = [];
                        var req_delivery_dates = [];

                        for (var i = 0; i < selections.length; i++) {

                            var rec = selections[i];

                            if (rec.get('unique_id_long') < 1) {
                                continue;
                            }

                            xpoastUids.push(rec.get('unique_id_long'));
                            exchange_rates.push(rec.get('buying_exchange_rate') == null ? 0.0 : rec.get('buying_exchange_rate'));

                            var req_delivery_date = rec.get('req_delivery_date');

                            if (req_delivery_date == null) {
                                req_delivery_date = 'N/A';
                            } else {

                                if (typeof req_delivery_date === 'string') {
                                    req_delivery_date = req_delivery_date.substring(0, 10);
                                } else {
                                    req_delivery_date = Ext.Date.format(req_delivery_date, 'Y-m-d');
                                }

                            }

                            req_delivery_dates.push(req_delivery_date);
                            po_qtys.push(rec.get('po_qty') == null ? 0.0 : rec.get('po_qty'));
                            sales_prices.push(rec.get('sales_price') == null ? 0.0 : rec.get('sales_price'));
                            sales_amounts.push(rec.get('sales_amount') == null ? 0.0 : rec.get('sales_amount'));

                        }

                        if (btn == "no") {
                            prWin.close();
                        } else {

                            form.add(new Ext.form.Hidden({
                                name: 'xpoast_uids',
                                value: xpoastUids
                            }));

                            form.add(new Ext.form.Hidden({
                                name: 'po_qtys',
                                value: po_qtys
                            }));

                            form.add(new Ext.form.Hidden({
                                name: 'sales_prices',
                                value: sales_prices
                            }));

                            form.add(new Ext.form.Hidden({
                                name: 'exchange_rates',
                                value: exchange_rates
                            }));

                            form.add(new Ext.form.Hidden({
                                name: 'req_delivery_dates',
                                value: req_delivery_dates
                            }));

                            form.add(new Ext.form.Hidden({
                                name: 'sales_amounts',
                                value: sales_amounts
                            }));


                            if (form.isValid()) {
                                prWin.setLoading(true);

                                var val = form.getValues(false);

                                console_logs('val', val);
                                form.submit({
                                    url: CONTEXT_PATH + '/purchase/request.do?method=modifyPoContract',
                                    params: val,
                                    success: function (val, action) {
                                        prWin.setLoading(false);

                                        prWin.close();
                                        gm.me().store.load(function () {
                                        });
                                    },
                                    failure: function (val, action) {
                                        prWin.setLoading(false);

                                        prWin.close();
                                        gm.me().store.load(function () {
                                        });

                                    }
                                })
                            }  // end of formvalid
                        }//else
                    }
                },
                    {
                        text: CMD_CANCEL,
                        handler: function () {

                            if (prWin) {
                                prWin.close();
                            }
                        }
                    }]
            });
            prWin.show();

        }
    },
    payConditionStore: Ext.create('Mplm.store.CommonCodeExStore', {parentCode: 'PAYMENT_METHOD'}),
    whouseStore: Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {})
});

