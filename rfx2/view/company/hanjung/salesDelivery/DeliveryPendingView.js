//수주관리 메뉴
Ext.define('Rfx2.view.company.hanjung.salesDelivery.DeliveryPendingView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-pending-view',
    inputBuyer: null,
    initComponent: function () {

        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.


        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // 검색툴바 필드 초기화
        this.initSearchField();
        // this.addSearchField('reserved_varchar6');
        this.addSearchField('reserved_varchar2');

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        this.pdfActionSpo = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '수주대장',
            tooltip: '수주대장을 PDF파일로 출력합니다.',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var pj_uid = rec.get('ac_uid');
                var assymap_uid = rec.get('unique_uid');
                var rtgast_uid = 'ORDER_' + rec.get('reserved_varcharh');
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printOb',
                    params: {
                        rtgast_uid: rtgast_uid,
                        pj_uid: pj_uid,
                        assymap_uid: assymap_uid,
                        not_restart: 'Y',
                        pl_no: '---',
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'N',
                        sum_wthdraw_flag: 'Y',
                        detail_flag: 'Y',
                    },
                    reader: {
                        pdfPath: 'pdfPath'
                    },
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        var pdfPathSplit = pdfPath.split('/');
                        var fileName = pdfPathSplit[pdfPathSplit.length - 1];

                        console_log(pdfPath);
                        if (pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                            top.location.href = url;
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/document/manage.do?method=makePdfImage',
                                params: {
                                    fileName: pdfPath,
                                    extension: 'png'
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
                    failure: extjsUtil.failureMessage
                });
            }
        });
        this.dlAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Release','출고'),
            tooltip: '출고를 실시합니다',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var receivable = rec.get('receivables');
                console_logs('receivables >>>', receivable);
                if (receivable > 0) {
                    Ext.MessageBox.alert('알림', '미수금이 발생하였습니다.<br>미수금 완납 후 출고 가능합니다.');
                } else {
                    gm.me().prwinDl();
                }
            }
        });

        this.releaseCheckAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '출고체크리스트 작성',
            tooltip: '출고 차량의 출고체크리스트를 작성합니다.',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var status = rec.get('status');
                var is_checked = rec.get('reserved_varchark');
                if (status == 'CR' || status == 'W' || status == 'P') {
                    Ext.MessageBox.alert('알림', '제작완료가 되지 않은 상태에서 체크리스트를 작성할 수 없습니다.');
                } else if (is_checked == 'Y') {
                    Ext.MessageBox.alert('알림', '체크리스트를 작성한 상태에서 중복 작성할 수 없습니다.');
                } else {
                    gm.me().releaseCheckWindow(rec);
                }
            }
        });

        this.backProductionStatusAction = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            text: '재제작 요청',
            tooltip: '선택 차량을 제작상태로 반려합니다.',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var status = rec.get('status');
                var is_checked = rec.get('reserved_varchark');
                if (status == 'CR' || status == 'W' || status == 'P') {
                    Ext.MessageBox.alert('알림', '출고대기 상태가 아닌 상태에서 제작 상태로 반려시킬 수 없습니다.');
                } else {
                    var ac_uid = rec.get('ac_uid');
                    var cartmap_uid = rec.get('cartmap_uid');
                    var srcahd_uid = rec.get('srcahd_uid');
                    gm.me().rollbackProductionStatus(ac_uid, cartmap_uid, srcahd_uid);
                }
            }
        });

        this.pdfAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '출고체크리스트 출력',
            tooltip: '출고체크리스트를 PDF파일로 출력합니다.',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var pj_uid = rec.get('ac_uid');
                var assymap_uid = rec.get('unique_uid');
                var is_checked = rec.get('reserved_varchark');
                var rtgast_uid = 'REL_CHECK_' + rec.get('reserved_varcharh');
                if (is_checked == "" || is_checked == null) {
                    Ext.MessageBox.alert("알림", "체크리스트가 작성되지 않았습니다.<br>체크리스트를 작성 후 출력하십시오.");
                    return;
                }
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printRcl',
                    params: {
                        rtgast_uid: rtgast_uid,
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'N',
                        pj_uid: pj_uid,
                        assymap_uid: assymap_uid,
                        not_restart: 'Y',
                        pl_no: '---',
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

        this.createStore('Rfx2.model.company.hanjung.DeliveryPending', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            gMain.pageSize/* pageSize */
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['assymap']
        );

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });
        buttonToolbar.insert(1, this.releaseCheckAction);
        buttonToolbar.insert(2, this.pdfAction);
        buttonToolbar.insert(4, this.backProductionStatusAction);
        buttonToolbar.insert(3, this.dlAction);

        buttonToolbar.insert(1, this.pdfActionSpo);

        this.setRowClass(function (record, index) {
            var c = record.get('status');
            switch (c) {
                case 'P0':
                    return 'yellow-row';
                    break;
                case 'Y':
                    return 'blue-row';
                    break;
                case 'P':
                    return 'orange-row';
                    break;
                case 'DE':
                    return 'red-row';
                    break;
                case 'CR':
                    return 'green-row';
                    break;
                default:
            }
        });


        Ext.each(this.columns, function (columnObj, index) {
            var o = columnObj;
            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'quan':
                case 'remain_qty':
                case 'total_out_qty':
                case 'wh_qty':
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        if (gm.me().store.data.items.length > 0) {
                            var summary = gm.me().store.data.items[0].get('summary');
                            if (summary.length > 0) {
                                var objSummary = Ext.decode(summary);
                                return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                            } else {
                                return 0;
                            }
                        } else {
                            return 0;
                        }
                    };
                    break;
                default:
                    break;
            }
        });

        var option = {

        };

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(searchToolbar, buttonToolbar, option);

        buttonToolbar.insert(4, '-');

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                var rec = selections[0];
                if (selections.length == 1) {
                    gm.me().pdfActionSpo.enable();
                    gm.me().pdfAction.enable();
                    gm.me().backProductionStatusAction.enable();
                    gm.me().releaseCheckAction.enable();
                    var relChkStatus = rec.get('reserved_varchark');
                    if (relChkStatus == 'Y') {
                        gm.me().dlAction.enable();
                    } else {
                        gm.me().dlAction.disable();
                        gm.me().pdfAction.disable();
                    }
                } else {
                    gm.me().pdfActionSpo.disable();
                    gm.me().dlAction.disable();
                    gm.me().pdfAction.disable();
                    gm.me().releaseCheckAction.disable();
                    gm.me().backProductionStatusAction.disable();
                }
            }
        });

        this.callParent(arguments);

        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('having_not_status', 'BM,P0,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.load(function (record) {

        });

    },
    prwinDl: function () {
        var selection = gm.me().grid.getSelectionModel().getSelection()[0];
        var status = selection.get('status');
        var wh_qty = selection.get('wh_qty');
        var aprv_date = selection.get('reserved_timestamp1');
        // if (wh_qty > 0) {
        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            // title:'공정 선택',
            frame: false,
            border: false,
            bodyPadding: 10,
            region: 'center',
            layout: 'form',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '출고를 실시합니다.',
                    items: [
                        {
                            fieldLabel: '출하수량',
                            xtype: 'hiddenfield',
                            id: gu.id('requestQty'),
                            name: 'requestQty',
                            anchor: '97%',
                            value: 1
                        },
                        {
                            fieldLabel: '차종',
                            xtype: 'textfield',
                            id: gu.id('reserved_varchar3'),
                            name: 'reserved_varchar3',
                            anchor: '97%',
                            editable: false,
                            value: selection.get('reserved_varchar3')
                        },
                        {
                            fieldLabel: '차량제조사',
                            xtype: 'textfield',
                            id: gu.id('reserved_varchar4'),
                            name: 'reserved_varchar4',
                            editable: false,
                            anchor: '97%',
                            value: selection.get('carMaker')
                        },
                        {
                            xtype: 'hiddenfield',
                            id: gu.id('reserved_varchark'),
                            name: 'reserved_varchark',
                            anchor: '97%',
                            value: selection.get('reserved_varchark')
                        },
                        {
                            xtype: 'datefield',
                            anchor: '97%',
                            name: 'aprv_date',
                            id: gu.id('aprv_date'),
                            fieldLabel: '출고날짜',
                            format: 'Y-m-d',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            value: new Date()
                        }
                    ]
                }
            ]
        });

        var myHeight = 250;
        var myWidth = 390;
        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: gm.getMC('CMD_Release','출고'),
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (gu.getCmp('requestQty').getValue() <= selection.get('wh_qty')) {
                        Ext.MessageBox.show({
                            title: '출고확정',
                            msg: '출고를 하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            fn: function (result) {
                                if (result == 'yes') {
                                    prWin.setLoading(true);
                                    var selections = gm.me().grid.getSelectionModel().getSelection();
                                    var srcahdArr = [];
                                    var requestQtyArr = [];
                                    var lotNoArr = [];
                                    var lotQtyArr = [];
                                    var projectArr = [];


                                    if (gu.getCmp('requestQty').getValue() > 0) {
                                        for (var i = 0; i < selections.length; i++) {
                                            srcahdArr.push(selections[i].get('srcahd_uid'));
                                            requestQtyArr.push(gu.getCmp('requestQty').getValue());
                                            projectArr.push(selections[i].get('ac_uid'));
                                            lotNoArr.push(selections[i].get('reserved_varchari'));
                                            lotQtyArr.push(gu.getCmp('requestQty').getValue());
                                        }
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/sales/productStock.do?method=assignShipmentBySrcahd',
                                            params: {
                                                srcahdUids: srcahdArr,
                                                requestQtys: requestQtyArr,
                                                projectArr: projectArr,
                                                reserved_varchar3: gu.getCmp('reserved_varchar3').getValue(),
                                                reserved_varchar4: gu.getCmp('reserved_varchar4').getValue(),
                                                reserved_varchark: gu.getCmp('reserved_varchark').getValue(),
                                                aprv_date: gu.getCmp('aprv_date').getValue(),
                                                lotNoArr: lotNoArr,
                                                lotQtyArr: lotQtyArr
                                            },
                                            success: function (val, action) {
                                                Ext.Msg.alert('완료', '출고 요청이 완료 되었습니다.');
                                                gMain.selPanel.store.load(function () {
                                                    gMain.setCenterLoading(false);
                                                });
                                                prWin.setLoading(false);
                                                prWin.close();
                                            },
                                            failure: function (val, action) {
                                                Ext.Msg.alert('', '출고 요청 도중 오류가 발생하였습니다.');
                                                prWin.setLoading(false);
                                                prWin.close();
                                            }
                                        });
                                    } else {
                                        Ext.Msg.alert('', '최소 1개 이상의 수량을 입력하시기 바랍니다.');
                                    }

                                } else {
                                    prWin.close();
                                }
                            },
                            icon: Ext.MessageBox.QUESTION
                        });
                    } else {
                        Ext.Msg.alert('', '요청수량이 출고가능 수량보다 더 많습니다.');
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
        // } 
        // else {
        //     Ext.Msg.alert('', '출하 가능한 상품이 아닙니다.');
        // }
    },
    inputBarcode: function () {
        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            title: '바코드를 스캔하시기 바랍니다.',
            frame: false,
            border: false,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'textarea',
                    id: gu.id('barcodeData'),
                    name: 'barcode',
                    anchor: '100%',
                    width: 480,
                    height: 370
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 입력',
            width: 500,
            height: 500,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    var barcodeData = gu.getCmp('barcodeData').getValue().split('\n');
                    barcodeData.pop();  //마지막 공백 제거
                    var uniqueBarcodeData = barcodeData.reduce(function (a, b) {
                        if (a.indexOf(b) < 0) a.push(b);
                        return a;
                    }, []);
                    gm.me().store.getProxy().setExtraParam('projectUids', uniqueBarcodeData);
                    gm.me().store.load(function (records) {
                        gm.me().store.getProxy().setExtraParam('projectUids', null);
                    });
                    if (prWin) {
                        prWin.close();
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
        gu.getCmp('barcodeData').focus(false, 500);
    },
    releaseCheckWindow: function (rec) {
        gm.me().gridIds = [];
        var wearingCheckForm = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            tabBarPosition: 'top',
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
                    title: '윙바디',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [{
                        items: [
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: '자재상태',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb1', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb1', inputValue: 'N' }
                                ]
                            },
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: '절곡/절단치수',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb2', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb2', inputValue: 'N' }
                                ]
                            },
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: '용접/작업면<br>상태',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb3', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb3', inputValue: 'N' }
                                ]
                            },
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: '하부도장<br>언더코팅',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb4', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb4', inputValue: 'N' }
                                ]
                            },
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: '차대번호<br>일치여부',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb5', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb5', inputValue: 'N' }
                                ]
                            },
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: '차량외관',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb6', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb6', inputValue: 'N' }
                                ]
                            },
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: '윙 작동상태',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb7', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb7', inputValue: 'N' }
                                ]
                            },
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: '차폭등',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb8', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb8', inputValue: 'N' }
                                ]
                            },
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: '써치등',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb9', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb9', inputValue: 'N' }
                                ]
                            },
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: '점열등',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb10', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb10', inputValue: 'N' }
                                ]
                            },
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: '실내등',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb11', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb11', inputValue: 'N' }
                                ]
                            },
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: '후진등',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb12', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb12', inputValue: 'N' }
                                ]
                            },
                            {
                                xtype: 'radiogroup',
                                bodyPadding: 10,
                                fieldLabel: 'T바고리<br>T고리',
                                columns: 2,
                                width: '99%',
                                vertical: true,
                                items: [
                                    { boxLabel: '여  ', name: 'value_wb13', inputValue: 'Y', checked: true },
                                    { boxLabel: '부  ', name: 'value_wb13', inputValue: 'N' }
                                ]
                            }
                        ]
                    }]
                },
                {
                    xtype: 'fieldset',
                    title: '제작사양서',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '내장',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'ps_value1'
                        },
                        {
                            fieldLabel: '폭',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'ps_value2'
                        },
                        {
                            fieldLabel: '고',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'ps_value3'
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '외부판',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: 'GRP  ', name: 'ps_value4', inputValue: 'Y', checked: true },
                                { boxLabel: 'AL  ', name: 'ps_value4', inputValue: 'N' }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '내부바닥',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: '철  ', name: 'ps_value5', inputValue: 'Y', checked: true },
                                { boxLabel: '아연  ', name: 'ps_value5', inputValue: 'N' }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '누름천막',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: '고정', name: 'ps_value6', inputValue: 'Y', checked: true },
                                { boxLabel: '이동  ', name: 'ps_value6', inputValue: 'N' }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '앞뒤판',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: '철', name: 'ps_value7', inputValue: 'Y', checked: true },
                                { boxLabel: 'SUS  ', name: 'ps_value7', inputValue: 'N' }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '축조립체외',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: '철', name: 'ps_value8', inputValue: 'Y', checked: true },
                                { boxLabel: 'SUS  ', name: 'ps_value8', inputValue: 'N' }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '스포일러',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: '국내', name: 'ps_value9', inputValue: 'Y', checked: true },
                                { boxLabel: '수입  ', name: 'ps_value9', inputValue: 'N' }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '냉동기',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: '브랜드', name: 'ps_value10', inputValue: 'Y', checked: true },
                                { boxLabel: '써브/메인', name: 'ps_value10', inputValue: 'N' }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '축(앞/뒤)',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '차대번호 일치',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: '여', name: 'value_sh1', inputValue: 'Y', checked: true },
                                { boxLabel: '부', name: 'value_sh1', inputValue: 'N' }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '차량외관',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: '여', name: 'value_sh2', inputValue: 'Y', checked: true },
                                { boxLabel: '부', name: 'value_sh2', inputValue: 'N' }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '작동상태',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: '여', name: 'value_sh3', inputValue: 'Y', checked: true },
                                { boxLabel: '부', name: 'value_sh3', inputValue: 'N' }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '에어압력게이지',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: '여', name: 'value_sh4', inputValue: 'Y', checked: true },
                                { boxLabel: '부', name: 'value_sh4', inputValue: 'N' }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '에어장치누기',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: '여', name: 'value_sh5', inputValue: 'Y', checked: true },
                                { boxLabel: '부', name: 'value_sh5', inputValue: 'N' }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            fieldLabel: '출고자명',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'outer_name'
                        },
                        {
                            fieldLabel: '출고탁송기사 명',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'deliverer_name'
                        },
                        {
                            fieldLabel: '인수자 명',
                            xtype: 'textfield',
                            anchor: '100%',
                            width: '99%',
                            name: 'inner_name'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '',
                    frame: true,
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            xtype: 'label',
                            anchor: '100%',
                            width: '99%',
                            margin: '0 0 0 0',
                            text: '1) 써치등 장착 및 점열등 작업시 미적합 판정 요소 및 민원으로 인해 법적인 제약이 있을 수 있습니다.',
                            style: 'color:blue; align:left'
                        },
                        {
                            xtype: 'label',
                            anchor: '100%',
                            width: '99%',
                            margin: '0 10 2 0',
                            html: '<br>2) 리모컨 및 스위치는 정기검사시 미 적합 요소입니다.',
                            style: 'color:blue; align:left'
                        },
                        {
                            xtype : 'checkbox',
                            boxLabel: '동의',
                            name: 'agree',
                            inputValue: 'AGREE',
                            id: gu.id('agreeCb')
                        },
                    ]
                }
            ]

        });
        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '출고체크리스트 작성',
            width: 900,
            height: 800,
            plain: true,
            items: wearingCheckForm,
            overflowY: 'scroll',
            buttons: [{
                text: '작성확인',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (wearingCheckForm.isValid()) {
                            var val = wearingCheckForm.getValues(false);
                            var pj_uid = rec.get('ac_uid');
                            if (gu.getCmp('agreeCb').checked == true) {
                                if(val['emp_name'] ==  '' || val['deliverer_name'] == '') {
                                    Ext.MessageBox.alert('알림', '출고자 명 혹은 탁송기사 명을 표시하시기 바랍니다.');
                                    return;
                                }
                                if(val['customer_name'] ==  '') {
                                    Ext.MessageBox.alert('알림', '인수자 명을 표시하시기 바랍니다.');
                                    return;
                                }
                                wearingCheckForm.submit({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=insertReleaseCheck',
                                    waitMsg: '체크리스트를 작성 중 입니다.',
                                    params: {
                                        pj_uid: pj_uid
                                    },
                                    success: function (val, action) {
                                        if (prWin) {
                                            prWin.close();
                                        }
                                        Ext.MessageBox.alert('확인', '작성 되었습니다.');
                                        gm.me().store.load();
                                    },
                                    failure: function (val, action) {
                                        if (prWin) {
                                            console_log('failure');
                                            Ext.MessageBox.alert(error_msg_prompt, 'Failed');
                                            prWin.close();
                                        }
                                    }
                                });
                            } else {
                                Ext.MessageBox.alert('알림', '위 동의사항에 체크하지 않을 시 작성되지 않습니다.');
                                return;
                            }
                        }
                    }
                }
            }
                , {
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

    rollbackProductionStatus : function(ac_uid, cartmap_uid, srcahd_uid) {
        Ext.MessageBox.show({
            title: '재제작 요청',
            msg: '선택 한 건을 재제작 요청하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn) {
                if (btn == "no") {
                    return;
                } else {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/schdule.do?method=rollbackPrdStatus',
                        params: {
                            ac_uid: ac_uid,
                            cartmap_uid : cartmap_uid,
                            srcahd_uid : srcahd_uid
                        },
                        success: function(result, request) {
                            Ext.MessageBox.alert('알림','해당 건을 제작중인 상태로 변경하였습니다.');
                            gm.me().store.load();
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                }
            }
        });
    },
});
