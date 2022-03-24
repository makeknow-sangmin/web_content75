//구매요청
Ext.define('Rfx2.view.company.daeji.purStock.PurchaseRequestDetailView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'purchase-detail-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField({
            type: 'dateRange',
            field_id: 'req_date',
            text: "요청일자",
            sdate: Ext.Date.add(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)),
            edate: new Date()
        });

        this.addSearchField({
            field_id: 'status',
            displayField: 'codeName',
            valueField: 'systemCode',
            store: 'Rfx2.store.PrchStateStore',
            innerTpl: '<div data-qtip="{systemCode}">{codeName}</div>'
        });

        this.addSearchField('creator');
        this.addSearchField('content');
        this.addSearchField('item_code');

        this.addSearchField('item_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx2.model.company.bioprotech.PurchaseRequestDetail', [{
                property: 'po_no',
                direction: 'DESC'
            }],
            gMain.pageSize, {},
            ['rtgast']
        );

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        this.editAction.setText('상세보기');
        this.setEditPanelTitle('상세보기');


        this.createCrudTab();
        this.crudTab.setSize(this.getCrudeditSize());
        console_logs('getCrudeditSize>>>>>>>>>', this.getCrudeditSize());

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);
        //디폴트 로드
        gm.setCenterLoading(false);
        //this.store.getProxy().setExtraParam('state', "A");

        this.store.getProxy().setExtraParam('orderBy', 'rtgast_pr.po_no');
        this.store.getProxy().setExtraParam('ascDesc', 'DESC');

        var s_date = Ext.Date.add(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
        s_date = Ext.Date.format(s_date, 'Y-m-d');
        var e_date = new Date();
        e_date = Ext.Date.format(e_date, 'Y-m-d');

        this.store.getProxy().setExtraParam('req_date', s_date + ':' + e_date);
        this.store.load();

        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip: '구매요청서 출력',
            disabled: true,

            handler: function (widget, event) {
                var rtgast_uid = gm.me().vSELECTED_UNIQUE_ID;
                var po_no = gm.me().vSELECTED_PO_NO;
                var rtg_type = gm.me().vSELECTED_RTG_TYPE;
                var is_rotate = 'N';

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
        });


        //주문작성 Action 생성
        this.createPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '주문 작성',
            tooltip: '주문 작성',
            disabled: false,
            handler: function () {
                gm.me().treatPo();
            }//handler end...

        });

        //반려 Action 생성

        switch (vCompanyReserved4) {
            case 'SKNH01KR':
                this.removeBAction = Ext.create('Ext.Action', {
                    iconCls: 'af-remove',
                    text: '반려(취소)',
                    tooltip: '반려',
                    disabled: true,
                    handler: function () {
                        Ext.MessageBox.show({
                            title: '확인',
                            msg: '반려 하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            fn: function (result) {
                                if (result == 'yes') {
                                    var selections = gm.me().grid.getSelectionModel().getSelection();
                                    for (var i = 0; i < selections.length; i++) {
                                        var rec = selections[i];
                                        var state = rec.get('state');
                                        if (state != 'A') {
                                            Ext.Msg.alert('안내', '대기상태가 아닙니다.', function () {
                                            });
                                            return null;
                                        }
                                    }
                                    //var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
                                    var uniqueuid = gm.me().rtgast_uids;
                                    console_logs("uniqueuid", uniqueuid);
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/purchase/prch.do?method=destroyOrder',
                                        params: {
                                            unique_id: uniqueuid
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
                    }
                });
                break;
            default:
                this.removeBAction = Ext.create('Ext.Action', {
                    iconCls: 'af-remove',
                    text: '취소',
                    tooltip: '취소',
                    disabled: true,
                    handler: function () {
                        Ext.MessageBox.show({
                            title: '확인',
                            msg: '취소 하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            fn: function (result) {
                                if (result == 'yes') {

                                    //var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
                                    var uniqueuid = gm.me().rtgast_uids;
                                    console_logs("uniqueuid", uniqueuid);
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/purchase/prch.do?method=cancleOrder',
                                        params: {
                                            unique_id: uniqueuid
                                        },

                                        success: function (result, request) {
                                            gm.me().store.load();
                                            Ext.Msg.alert('안내', '취소 되었습니다.', function () {
                                            });

                                        },//endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });//endofajax

                                }
                            },
                            //animateTarget: 'mb4',
                            icon: Ext.MessageBox.QUESTION
                        });
                    }
                });
        }


        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //버튼 추가.
        //buttonToolbar.insert(1, this.editAction);
        buttonToolbar.insert(2, this.printPDFAction);
        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                this.rtgast_uids = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    this.rtgast_uids.push(uids);
                }
                var rec = selections[0];

                gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //rtgast_uid
                gm.me().vSELECTED_PO_NO = rec.get('po_no'); //rtgast_uid
                gm.me().vSELECTED_RTG_TYPE = rec.get('rtg_type');
                gm.me().vSELECTED_STATE = rec.get('state');
                console_logs("gm.me().vSELECTED_UNIQUE_ID>>>>>>>>>>", gm.me().vSELECTED_UNIQUE_ID);
                console_logs("gm.me().vSELECTED_STATE>>>>>>>>>>", gm.me().vSELECTED_STATE);

                gm.me().printPDFAction.enable();
                gm.me().removeBAction.enable();

                if (gm.me().vSELECTED_STATE == 'A') {
                    gm.me().removeBAction.enable();
                } else {
                    gm.me().removeBAction.disable();
                }
            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().printPDFAction.disable();
                gm.me().removeBAction.disable();
            }
            // this.cartLineGrid.getStore().getProxy().setExtraParam('rtgastuid', this.rtgast_uids);
            // console_logs("this.rtgast_uids>>>>>>>>>>", this.rtgast_uids);
            //
            // this.cartLineGrid.getStore().load();

        });

        //디폴트 로드
        gm.setCenterLoading(false);
        if (vCompanyReserved4 == 'DABP01KR') {
            this.store.getProxy().setExtraParam('purcnt', "yes");
        }

        //this.store.getProxy().setExtraParam('tr_uid', '-1');
        this.store.load(function (records) {
        });
    },
    items: [],
    rtgast_uids: [],

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
    }
});
