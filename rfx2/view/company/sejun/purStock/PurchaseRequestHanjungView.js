Ext.define('Rfx2.view.company.sejun.purStock.PurchaseRequestHanjungView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'list-po-view',

    poStore: Ext.create('Rfx2.store.company.hanjung.PurchaseRequestStore', {}),
    storeCubeDim: Ext.create('Rfx2.store.company.hanjung.CartMapStore', {}),

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
        var user_name; 
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
                gm.me().poStore.getProxy().setExtraParam('order_by', 'create_date');
                gm.me().poStore.load();
            }
        });

        var printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '구매요청서',
            tooltip: '구매요청서 출력',
            disabled: true,
            handler: function (widget, event) {
                var is_rotate = 'N';
                if (rtg_type == 'PR') {
                    switch (vCompanyReserved4) {
                        case 'SKNH01KR':
                        case 'HSGC01KR':
                            is_rotate = 'Y';
                            break;
                    }
                }
                if (vCompanyReserved4 == 'HSGC01KR') {
                    Ext.MessageBox.show({
                        title: '확인',
                        msg: '서명란을 포함하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (result) {
                            if (result == 'yes') {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/pdf.do?method=printPr',
                                    params: {
                                        rtgast_uid: rtgast_uid,
                                        po_no: po_no,
                                        pdfPrint: 'pdfPrint',
                                        is_rotate: is_rotate,
                                        rtg_type: rtg_type,
                                        contain_sign: 'Y'
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
                            } else {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/pdf.do?method=printPr',
                                    params: {
                                        rtgast_uid: rtgast_uid,
                                        po_no: po_no,
                                        pdfPrint: 'pdfPrint',
                                        is_rotate: is_rotate,
                                        rtg_type: rtg_type,
                                        contain_sign: 'N',
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
                            }
                        },
                        icon: Ext.MessageBox.QUESTION
                    });
                } else {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/pdf.do?method=printPr',
                        params: {
                            rtgast_uid: rtgast_uid,
                            po_no: po_no,
                            pdfPrint: 'pdfPrint',
                            is_rotate: is_rotate,
                            rtg_type: rtg_type
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
                }
            }
        });

        var reReceiveAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '요청접수',
            tooltip: '요청접수',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '요청접수 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            var uniqueuid = rtgast_uid;
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/prch.do?method=createOrder',
                                params: {
                                    unique_id: uniqueuid
                                },
                                success: function (result, request) {
                                    gm.me().poStore.load();
                                    gm.me().storeCubeDim.getProxy().setExtraParam('rtgastuid', -1);
                                    gm.me().storeCubeDim.load();
                                    Ext.Msg.alert('안내', '요청접수 되었습니다.', function () { });
                                },//endofsuccess
                                failure: extjsUtil.failureMessage
                            });//endofajax
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });


        var cancleReceiveAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '반려',
            tooltip: '요청반려',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '반려처리 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            var records = gridDimension.getSelectionModel().getSelection();
                            console_logs('records >>>>',records);
                            var uniqueUids = [];
                            var srcahdUids = [];
                            var itemCodes = [];
                            var pr_quans = [];
                            for(var i = 0; i<records.length; i++){
                                uniqueUids.push(records[i].get('id'));
                                srcahdUids.push(records[i].get('child'))
                                itemCodes.push(records[i].get('item_code'));
                                pr_quans.push(records[i].get('quan'));
                            }
                            console_logs('uniqueids >>>> ',uniqueUids);
                            console_logs('uniqueids >>>> ',srcahdUids);
                            console_logs('itemCodes >>>> ',itemCodes);
                            console_logs('pr_quans >>>> ',pr_quans);
                            
                            
                            var rejectForm = Ext.create('Ext.form.Panel', {
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
                                    {
                                        xtype: 'label',
                                        text: "반려사유를 기입하십시오",
                                        anchor: '100%',
                                        margin: '0 0 40 0'
                                    },
                                    {
                                        name: 'contents',
                                        allowBlank: false,
                                        xtype: 'textarea',
                                        value: "",
                                        height: 100,
                                        anchor: '100%'
                                    }
                                ]
                            });

                            var win = Ext.create('ModalWindow', {
                                title: '반려',
                                width: 750,
                                height: 250,
                                items: rejectForm,
                                buttons: [{
                                    text: CMD_OK,
                                    handler: function () {
                                        var form = Ext.getCmp('formPanelSendmail').getForm();
                                        if (form.isValid()) {
                                            var val = form.getValues(false);
                                            rejectForm.submit({
                                                url: CONTEXT_PATH + '/purchase/prch.do?method=dismissOrder',
                                                params: {
                                                    unique_ids: uniqueUids,
                                                    srcahd_uids : srcahdUids,
                                                    pr_quans : pr_quans,
                                                    itemCodes : itemCodes,
                                                    content: val['contents'],
                                                    user_name : user_name,
                                                    rtgast_uid : rtgast_uid
                                                },
                                                success: function (result, request) {
                                                    console_logs('save success', result);
                                                    if (win) {
                                                        win.close();
                                                    }
                                                    Ext.MessageBox.alert('반려', '반려 되었습니다.');
                                                    gm.me().storeCubeDim.load(function () {
                                                    });
                                                    gm.me().poStore.load(function () {
                                                    });
                                                },
                                                failure: function () {
                                                    console_log('failure');
                                                    Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                                    gm.me().storeCubeDim.load(function () {
                                                    });
                                                    gm.me().poStore.load(function () {
                                                    });
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
                                        }
                                    }
                                }
                                ]
                            });
                            win.show();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
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

            columns: [{
                text: '요청번호',
                width: 60,
                sortable: true,
                style: 'text-align:center',
                align: "left",
                dataIndex: 'po_no'
            }, {
                text: '상태',
                width: 60,
                sortable: true,
                style: 'text-align:center',
                align: "left",
                dataIndex: 'state_name'
            }, {
                text: '요청내용',
                width: 90,
                sortable: true,
                style: 'text-align:center',
                align: "left",
                dataIndex: 'item_abst'
            }, {
                text: '총건수',
                width: 30,
                sortable: true,
                style: 'text-align:center',
                align: "right",
                dataIndex: 'item_quan'
            }, {
                text: '요청자',
                width: 70,
                sortable: true,
                style: 'text-align:center',
                align: "left",
                dataIndex: 'user_name'
            }, {
                text: '요청일자',
                width: 70,
                xtype: 'datecolumn',
                style: 'text-align:center',
                format: 'Y-m-d',
                align: "left",
                dataIndex: 'req_date'
            }
            ]
        });

        this.poStore.getProxy().setExtraParam('state', "A");
        this.poStore.getProxy().setExtraParam('orderBy', 'po_no');
        this.poStore.getProxy().setExtraParam('ascDesc', 'DESC');
        this.poStore.getProxy().setExtraParam('menuCode', this.link);
        this.poStore.load();
        poStatusTemplate.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('>>>> rec', selections[0]);
                    gm.me().storeCubeDim.getProxy().setExtraParam('rtgastuid', selections[0].get('id'));
                    gm.me().storeCubeDim.load();
                    rtgast_uid = selections[0].get('id');
                    po_no = selections[0].get('po_no');
                    rtg_type = selections[0].get('rtg_type');
                    user_name =  selections[0].get('user_name');
                    reReceiveAction.enable();
                } else {
                    rtgast_uid = -1;
                    // printPDFAction.disable();
                    // reReceiveAction.disable();
                }
            }
        });

        var temp = {
            title: '구매요청현황',
            collapsible: false,
            frame: true,
            region: 'west',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '0 0 0 0',
            flex: 1,
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
                            xtype: 'triggerfield',
                            emptyText: '요청번호',
                            id: gu.id('po_no_field'),
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            name: 'po_no',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().poStore.getProxy().setExtraParam('po_no', '%' + gu.getCmp('po_no_field').getValue() + '%');
                                        gm.me().poStore.load(function () { });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                Ext.getCmp('po_no').setValue('');
                                this.poStore.getProxy().setExtraParam('po_no', gu.getCmp('po_no_field').getValue());
                                this.poStore.load(function () { });
                            }
                        },
                        {
                            xtype: 'triggerfield',
                            emptyText: '요청자',
                            id: gu.id('user_name'),
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            name: 'po_no',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().poStore.getProxy().setExtraParam('user_name', '%' + gu.getCmp('user_name').getValue() + '%');
                                        gm.me().poStore.load(function () { });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                Ext.getCmp('user_name').setValue('');
                                this.poStore.getProxy().setExtraParam('user_name', gu.getCmp('user_name').getValue());
                                this.poStore.load(function () { });
                            }
                        }
                    ]
                },
            ]
        };

        var gridDimension = Ext.create('Ext.grid.Panel', {
            id: gu.id('gridDimension'),
            store: this.storeCubeDim,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: true,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            autoScroll: true,
            autoHeight: true,
            frame: false,
            reigon: 'center',
            layout: 'fit',
            forceFit: true,
            flex: 0.5,
            columns: [{
                text: '품번',
                align: 'left',
                style: 'text-align:center',
                width: 50,
                dataIndex: 'item_code'
            }, {
                text: '품명',
                width: 100,
                style: 'text-align:center',
                align: 'left',
                dataIndex: 'item_name'
            }, {
                text: '규격',
                width: 80,
                style: 'text-align:center',
                align: 'left',
                dataIndex: 'specification'
            }, {
                text: '수량',
                width: 40,
                style: 'text-align:center',
                xtype: "numbercolumn",
                format: "0,000",
                align: "right",
                dataIndex: 'quan'
            }, {
                text: '총재고수량',
                width: 40,
                style: 'text-align:center',
                xtype: "numbercolumn",
                format: "0,000",
                align: "right",
                dataIndex: 'stock_qty'
            }
            ]
        });

        gridDimension.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    cancleReceiveAction.enable();
                }
                else {
                //     // rtgast_uid = -1;
                //     // reReceiveAction.disable();
                    cancleReceiveAction.disable();
                }
            }
        });

        var temp2 = {
            title: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
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
                    items: [/**printPDFAction, **/reReceiveAction, cancleReceiveAction]
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