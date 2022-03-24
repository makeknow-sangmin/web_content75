// 입고 관리 화면
Ext.define('Rfx2.view.gongbang.salesDelivery.WearingMgmtHanjungView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-mgmt-kbtech-view',
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

        this.addSearchField({
            type: 'dateRange',
            field_id: 'reserved_timestamp1',
            text: "입고일자",
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx2.model.RecvMgmtHanjung', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['assymap']
        );

        this.setRowClass(function (record, index) {
            var c = record.get('reserved_varcharj');
            switch (c) {
                case 'Y':
                    return 'green-row';
                    break;
                default:
            }

        });

        this.pdfAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '입고체크리스트 출력',
            tooltip: '입고체크리스트를 PDF파일로 출력합니다.',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var pj_uid = rec.get('ac_uid');
                var assymap_uid = rec.get('unique_uid');
                var rtgast_uid = 'WARECHECK_' + rec.get('reserved_varcharh');
                var check_status = rec.get('reserved_varcharj');
                if (check_status == "" || check_status == null) {
                    Ext.MessageBox.alert("알림", "체크리스트가 작성되지 않았습니다.<br>체크리스트를 작성 후 출력하십시오.");
                    return;
                }

                Ext.Ajax.request({
                    waitMsg: '다운로드 요청중입니다.<br> 잠시만 기다려주세요.',
                    url: CONTEXT_PATH + '/pdf.do?method=printWcl',
                    params: {
                        rtgast_uid: rtgast_uid,
                        pj_uid: pj_uid,
                        assymap_uid: assymap_uid,
                        not_restart: 'Y',
                        pl_no: '---',
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'N',
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


        this.wearingCheckAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '입고체크리스트 작성',
            tooltip: '해당 수주의 입고체크리스트를 작성합니다.',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var chkstatus = rec.get('reserved_varcharj');
                if (chkstatus == 'Y') {
                    Ext.MessageBox.alert("알림", "체크리스트를 작성한 상태에서 중복 작성할 수 없습니다.");
                } else {
                    gm.me().waringCheckWindow(rec);
                }
            }
        });

        buttonToolbar.insert(6, this.wearingCheckAction);
        buttonToolbar.insert(7, this.pdfAction);

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });
        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            console_logs('>>>>>>> callback datas', selections);
            var rec = selections[0];
            //var chkstatus = rec.get('reserved18');
            this.pdfAction.enable();
            this.wearingCheckAction.enable();
        });

        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });
        this.callParent(arguments);
        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('not_pj_type', 'NP');
        this.store.load(function (records) {
        });
    },
    waringCheckWindow: function (rec) {
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
            items: [{
                title: '체크리스트',
                items: [{
                    items: [
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '차량외관',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                {boxLabel: 'OK  ', name: 'value1', inputValue: 'Y', checked: true},
                                {boxLabel: 'NO  ', name: 'value1', inputValue: 'N'}
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '타이어 상태',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                {boxLabel: 'OK  ', name: 'value2', inputValue: 'Y', checked: true},
                                {boxLabel: 'NO  ', name: 'value2', inputValue: 'N'}
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '계기판',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                {boxLabel: 'OK  ', name: 'value3', inputValue: 'Y', checked: true},
                                {boxLabel: 'NO  ', name: 'value3', inputValue: 'N'}
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '등기구',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                {boxLabel: 'OK  ', name: 'value4', inputValue: 'Y', checked: true},
                                {boxLabel: 'NO  ', name: 'value4', inputValue: 'N'}
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '적재함 여부',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                {boxLabel: 'OK  ', name: 'value5', inputValue: 'Y', checked: true},
                                {boxLabel: 'NO  ', name: 'value5', inputValue: 'N'}
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '스페어 타이어<br>여부',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                {boxLabel: 'OK  ', name: 'value6', inputValue: 'Y', checked: true},
                                {boxLabel: 'NO  ', name: 'value6', inputValue: 'N'}
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '휠 종류',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                {boxLabel: '알루<br>미늄  ', name: 'value7', inputValue: 'Al', checked: true},
                                {boxLabel: '스틸  ', name: 'value7', inputValue: 'St'}
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '공구통 여부',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                {boxLabel: 'OK  ', name: 'value8', inputValue: 'Y', checked: true},
                                {boxLabel: 'NO  ', name: 'value8', inputValue: 'N'}
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '타이어 종류',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                {boxLabel: '한국  ', name: 'value9', inputValue: '한국타이어', checked: true},
                                {boxLabel: '넥센 ', name: 'value9', inputValue: '넥센타이어'},
                                {boxLabel: '미쉐린  ', name: 'value9', inputValue: '미쉐린타이어'},
                                {boxLabel: '금호 ', name: 'value9', inputValue: '금호타이어'},
                                {boxLabel: '브릿지<br>스톤 ', name: 'value9', inputValue: '브릿지스톤'}
                            ]
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '차대번호',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            name: 'reserved_varchari',
                            value: rec.get('reserved_varchari')
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '인계자',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            name: 'outer_name'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '인수자',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            name: 'inner_name'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '차량 계약자',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            name: 'value10'
                        }
                    ]
                }]
            }]
        });
        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '입고체크리스트 작성',
            width: 750,
            height: 450,
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
                        }
                        wearingCheckForm.submit({
                            url: CONTEXT_PATH + '/sales/buyer.do?method=insertWearingCheck',
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
    }
});
