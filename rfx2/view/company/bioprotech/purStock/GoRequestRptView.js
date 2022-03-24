//출고확인
Ext.define('Rfx2.view.company.bioprotech.purStock.GoRequestRptView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'go-request-rpt-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'dateRange',
            field_id: 'req_date',
            text: this.getMC('msg_date', '요청일자'),
            sdate: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            edate: new Date()
        });

        this.addSearchField({
            field_id: 'status',
            displayField: 'codeName',
            valueField: 'systemCode',
            store: 'RelStateStore',
            innerTpl: '<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>'
        });
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.addSearchField('user_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var buttonToolbar3 = Ext.create('widget.toolbar', {
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                id: gu.id('total_price'),
                style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
                text: '총 금액 : -'
            }]
        });
        this.localSize = gm.unlimitedPageSize;
        this.createStore('Rfx2.model.company.bioprotech.GoRequestRpt', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            this.localSize
        );

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //arr.push(buttonToolbar3);
        //grid 생성.
        this.createGrid(arr);


        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip: '출고요청서 출력',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('printPDFAction'),
            handler: function (widget, event) {
                var rtgast_uid = gm.me().vSELECTED_UNIQUE_ID;
                var po_no = gm.me().vSELECTED_PO_NO;
                var rtg_type = gm.me().vSELECTED_RTG_TYPE;
                console_logs('rtg_type', rtg_type);
                var is_rotate = 'N';
                var cartmap_uid = gm.me().cartmapUids;

                gm.me().setLoading(true);

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printGo',
                    params: {
                        rtgast_uid: rtgast_uid,
                        po_no: po_no,
                        pdfPrint: 'pdfPrint',
                        is_rotate: is_rotate,
                        rtg_type: rtg_type,
                        cartmap_uid: cartmap_uid
                    },
                    reader: {
                        pdfPath: 'pdfPath'
                    },
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        console_log(pdfPath);
                        if (pdfPath.length > 0) {

                            gm.me().setLoading(false);
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                            top.location.href = url;
                        }
                    },
                    failure: extjsUtil.failureMessage
                });


            }
        });

        this.modifyGoAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '출고요청 내용을 수정합니다',
            disabled: true,
            handler: function () {

                gm.me().requestform = Ext.create('Ext.form.Panel', {

                    xtype: 'form',
                    frame: false,
                    border: false,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side',
                        margin: 10
                    },
                    items: []
                });

                var height = 180;

                var requestText = '출고요청 내용을 수정합니다.';

                gm.me().requestform.add(
                    {
                        xtype: 'label',
                        width: 340,
                        text: requestText
                    }
                );

                gm.me().requestform.add(
                    {
                        fieldLabel: '요청수량',
                        xtype: 'numberfield',
                        value: gm.me().grid.getSelectionModel().getSelection()[0].get('pr_quan'),
                        name: 'pr_quan',
                        id: gu.id('pr_quan')
                    }
                );

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '출고요청 수정',
                    width: 380,
                    height: height,
                    items: gm.me().requestform,
                    buttons: [
                        {
                            text: CMD_OK,
                            handler: function () {
                                console_logs('ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ', gm.me().getSelectionModel().getSelection()[0].get('unique_id_long'));
                                console_logs('ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ', gm.me().getSelectionModel().getSelection()[0].get('unique_uid'));
                                // var unique_id_long = gm.me().getSelectionModel().getSelection()[0].get('unique_id_long');
                                // gm.editAjax('cartmap', 'pr_quan', gu.getCmp('pr_quan').getValue(), 'unique_id_long', unique_id_long, null);
                                //
                                // if (prWin) {
                                //     prWin.close();
                                // }
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

        //요청접수 Action 생성
        this.reReceiveAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '요청 접수',
            tooltip: '요청 접수',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('reReceiveAction'),
            handler: function () {

                gm.me().requestform = Ext.create('Ext.form.Panel', {

                    xtype: 'form',
                    frame: false,
                    border: false,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side',
                        margin: 10
                    },
                    items: []
                });

                var height = 170;

                var requestText = '요청 접수 하시겠습니까? 작성날짜를 기입하고 확인 버튼을 누르시기 바랍니다.';

                gm.me().requestform.add(
                    {
                        xtype: 'label',
                        width: 340,
                        text: requestText
                    }
                );

                gm.me().requestform.add(
                    {
                        fieldLabel: '작성날짜',
                        xtype: 'datefield',
                        value: new Date(),
                        name: 'recv_date',
                        format: 'Y-m-d',
                        id: gu.id('recv_date')
                    }
                );

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '출고요청',
                    width: 360,
                    height: height,
                    items: gm.me().requestform,
                    buttons: [
                        {
                            text: CMD_OK,
                            //scope:this,
                            handler: function () {

                                var recv_date = (gu.getCmp('recv_date') === undefined || gu.getCmp('recv_date') == null)
                                    ? null : gu.getCmp('recv_date').getValue();

                                prWin.setLoading(true);

                                var uniqueuid = gm.me().cartmapUids;

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/prch.do?method=createOrderCase',
                                    params: {
                                        cartmapUids: uniqueuid,
                                        recv_date: recv_date
                                    },

                                    success: function (result, request) {
                                        gm.me().store.load();
                                        Ext.Msg.alert('안내', '요청접수 되었습니다.', function () {
                                        });

                                        prWin.setLoading(false);

                                        if (prWin) {
                                            prWin.close();
                                        }

                                    },//endofsuccess
                                    failure: extjsUtil.failureMessage
                                });//endofajax
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

        var removeBActionText = '반려';

        //반려 Action 생성
        this.removeBAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: removeBActionText,
            tooltip: removeBActionText,
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('removeBAction'),
            handler: function () {

                var selections = gm.me().grid.getSelectionModel().getSelection();
                var isPr = true;

                for (var i = 0; i < selections.length; i++) {
                    var status = selections[i].get('status');
                    if (status !== 'PR') {
                        isPr = false;
                        break;
                    }
                }

                if (isPr) {
                    Ext.MessageBox.show({
                        title: '확인',
                        msg: '반려 하시겠습니까?</br><font color="red">' +
                            '<b>주의: 요청번호 단위로 반려 처리 됩니다.</b></font>',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (result) {
                            if (result == 'yes') {

                                var rtgastArr = [];

                                for (var i = 0; i < selections.length; i++) {
                                    rtgastArr.push(selections[i].get('rtgast_uid'));
                                }

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/prch.do?method=rollbackGo',
                                    params: {
                                        rtgastArr: rtgastArr
                                    },
                                    success: function (result, request) {

                                        gm.me().store.load();

                                        Ext.Msg.alert('안내', '반려 되었습니다.', function () {
                                        });
                                    },//endofsuccess
                                    failure: extjsUtil.failureMessage
                                });//endofajax

                            }
                        },
                        //animateTarget: 'mb4',
                        icon: Ext.MessageBox.QUESTION
                    });
                } else {
                    Ext.Msg.alert('경고', '접수대기인 품목만 반려 가능합니다.');
                }
            }
        });

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.reReceiveAction);
        buttonToolbar.insert(3, this.printPDFAction);
        buttonToolbar.insert(4, this.removeBAction);
        buttonToolbar.insert(5, this.modifyGoAction);

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {

                var isPending = true;

                this.cartmapUids = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    this.cartmapUids.push(uids);
                }

                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    if (rec.get('status') !== 'PR') {
                        isPending = false;
                        break;
                    }
                }

                if (isPending) {
                    gm.me().reReceiveAction.enable();
                    gm.me().modifyGoAction.enable();
                } else {
                    gm.me().reReceiveAction.disable();
                    gm.me().modifyGoAction.disable();
                }

                var rec = selections[0];

                gm.me().vSELECTED_UNIQUE_ID = rec.get('rtgast_uid'); //rtgast_uid
                gm.me().vSELECTED_PO_NO = rec.get('po_no'); //rtgast_uid
                gm.me().vSELECTED_RTG_TYPE = /*rec.get('rtg_type');*/'GO';
                console_logs("gm.me().vSELECTED_UNIQUE_ID>>>>>>>>>>", gm.me().vSELECTED_UNIQUE_ID);


                gm.me().printPDFAction.enable();
                gm.me().removeBAction.enable();

            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().reReceiveAction.disable();
                gm.me().printPDFAction.disable();
                gm.me().removeBAction.disable();
            }
        })

        //디폴트 로드
        gm.setCenterLoading(false);

        this.store.getProxy().setExtraParam("menuCode", this.link);
        this.store.getProxy().setExtraParam("status", 'PR');
        this.store.getProxy().setExtraParam('orderBy', 'rtgast.po_no');
        this.store.getProxy().setExtraParam('ascDesc', 'DESC');

        this.store.load();
        this.setCrudpanelWidth(900);
    },
    items: [],
    // rtgast_uids: [],
    cartmapUids: []
});
