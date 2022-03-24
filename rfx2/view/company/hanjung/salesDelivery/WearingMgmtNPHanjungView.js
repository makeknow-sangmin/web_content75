// 입고 관리 화면
Ext.define('Rfx2.view.company.hanjung.salesDelivery.WearingMgmtNPHanjungView', {
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

        this.createStore('Rfx2.model.RecvNPMgmtHanjung', [{
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
            var c = record.get('pj_type');
            if(c != 'NP') {
                return 'green-row'; 
            } else {
                return 'white-row'; 
            }
        });

        this.createNPPoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '차량등록',
            tooltip: '차량등록',
            handler: function () {
                gm.me().addNPPoWindow();
            }
        });

        this.editNPPoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수정',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                console_logs('>>>>>> rec', rec);
                gm.me().editPoWindow(rec);
            }
        });

        this.deleteNPPoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '삭제',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                console_logs('>>>>>> rec', rec);
                Ext.MessageBox.show({
                    title: '내역 삭제',
                    msg: '선택한 데이터를 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=deleteRecvNP',
                                params: {
                                    pj_uid: rec.get('ac_uid'),
                                    assymap_uid: rec.get('unique_uid'),
                                    srcahd_uid: rec.get('srcahd_uid')
                                },
                                success: function (result, request) {
                                    Ext.MessageBox.alert('알림', '해당 내역이 삭제 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        } else {
                            prWin.close();
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                })
            }
        });
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
            iconCls: 'af-check',
            text: '입고체크리스트 작성',
            tooltip: '해당 수주의 입고체크리스트를 작성합니다.',
            disabled: false,
            handler: function () {
                // var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                // var rec = selections[0];
                // var chkstatus = rec.get('reserved_varcharj');
                // if (chkstatus == 'Y') {
                //     Ext.MessageBox.alert("알림", "체크리스트를 작성한 상태에서 중복 작성할 수 없습니다.");
                // } else {
                gm.me().waringCheckWindow();
                // }
            }
        });

        this.confirmNpToPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '수주등록',
            tooltip: '선택건을 수주로 등록합니다.',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                gm.me().npToPoAct(rec);
            }
        });


        buttonToolbar.insert(6, this.wearingCheckAction);
        buttonToolbar.insert(7, this.pdfAction);
        buttonToolbar.insert(8, this.confirmNpToPoAction);
        buttonToolbar.insert(9, this.deleteNPPoAction);


        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });
        buttonToolbar.insert(1, this.pdfActionSpo);

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);



        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            console_logs('>>>>>>> callback datas', selections);
            if (selections.length > 0) {
                var rec = selections[0];
                this.pdfAction.enable();
                this.pdfActionSpo.enable();
                //this.wearingCheckAction.enable();
                //this.editNPPoAction.enable();
                this.deleteNPPoAction.enable();
                this.confirmNpToPoAction.enable();
            } else {
                this.pdfAction.disable();
                //this.wearingCheckAction.disable();
                // this.editNPPoAction.disable();
                this.deleteNPPoAction.disable();
                this.confirmNpToPoAction.disable();
                this.pdfActionSpo.disable();
            }
        });

        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });
        this.callParent(arguments);
        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.load(function (records) {
        });
    },

    waringCheckWindow: function () {
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
                items: [{
                    xtype: 'fieldset',
                    frame: true,
                    title: '기본정보',
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            layout: {
                                type: 'fit',
                                align: 'left'
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '고객명',
                            allowBlank: true,
                            anchor: '100%',
                            width: '99%',
                            name: 'reserved_varchar2'
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '차량제조사',
                            allowBlank: false,
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            anchor: '100%',
                            width: '99%',
                            store: Ext.create('Rfx2.store.company.hanjung.PoCarMakerStore', {}),
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            name: 'reserved_varchar4'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '차종',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            name: 'reserved_varchar3'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '차대번호',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            name: 'reserved_varchari'
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '영업사원',
                            displayField: 'user_name',
                            valueField: 'unique_id',
                            anchor: '100%',
                            width: '99%',
                            store: Ext.create('Mplm.store.UserSalerStore', {}),
                            name: 'pm_uid'
                        }
                    ]
                },{
                    items: [
                        {
                            xtype: 'radiogroup',
                            bodyPadding: 10,
                            fieldLabel: '차량외관',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            items: [
                                { boxLabel: 'OK  ', name: 'value1', inputValue: 'Y', checked: true },
                                { boxLabel: 'NO  ', name: 'value1', inputValue: 'N' }
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
                                { boxLabel: 'OK  ', name: 'value2', inputValue: 'Y', checked: true },
                                { boxLabel: 'NO  ', name: 'value2', inputValue: 'N' }
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
                                { boxLabel: 'OK  ', name: 'value3', inputValue: 'Y', checked: true },
                                { boxLabel: 'NO  ', name: 'value3', inputValue: 'N' }
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
                                { boxLabel: 'OK  ', name: 'value4', inputValue: 'Y', checked: true },
                                { boxLabel: 'NO  ', name: 'value4', inputValue: 'N' }
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
                                { boxLabel: 'OK  ', name: 'value5', inputValue: 'Y', checked: true },
                                { boxLabel: 'NO  ', name: 'value5', inputValue: 'N' }
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
                                { boxLabel: 'OK  ', name: 'value6', inputValue: 'Y', checked: true },
                                { boxLabel: 'NO  ', name: 'value6', inputValue: 'N' }
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
                                { boxLabel: '알루<br>미늄  ', name: 'value7', inputValue: 'Al', checked: true },
                                { boxLabel: '스틸  ', name: 'value7', inputValue: 'St' }
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
                                { boxLabel: 'OK  ', name: 'value8', inputValue: 'Y', checked: true },
                                { boxLabel: 'NO  ', name: 'value8', inputValue: 'N' }
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
                                { boxLabel: '한국  ', name: 'value9', inputValue: '한국타이어', checked: true },
                                { boxLabel: '넥센 ', name: 'value9', inputValue: '넥센타이어' },
                                { boxLabel: '미쉐린  ', name: 'value9', inputValue: '미쉐린타이어'},
                                { boxLabel: '금호 ', name: 'value9', inputValue: '금호타이어' },
                                { boxLabel: '브릿지<br>스톤 ', name: 'value9', inputValue: '브릿지스톤' }
                            ]
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
                            fieldLabel: '인계자 전화번호',
                            columns: 2,
                            width: '99%',
                            vertical: true,
                            name: 'outer_tel_no'
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
                            wearingCheckForm.submit({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=insertPjWithWearingCheck',
                                waitMsg: '체크리스트를 작성 중 입니다.',
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
            }, {
                text: '취소',
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }]
        });
        prWin.show();
    },

    addNPPoWindow: function () {
        var npForm = Ext.create('Ext.form.Panel', {
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
                title: '미수주 입고차량 입력',
                items: [{
                    xtype: 'fieldset',
                    frame: true,
                    title: '기본정보',
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            layout: {
                                type: 'fit',
                                align: 'left'
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '고객명',
                            allowBlank: true,
                            anchor: '100%',
                            width: '99%',
                            name: 'reserved_varchar2'
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '차량제조사',
                            allowBlank: false,
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            anchor: '100%',
                            width: '99%',
                            store: Ext.create('Rfx2.store.company.hanjung.PoCarMakerStore', {}),
                            sortInfo: { field: 'specification', direction: 'ASC' },
                            name: 'reserved_varchar4'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '차종',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            name: 'reserved_varchar3'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '차대번호',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            name: 'reserved_varchari'
                        },
                        {
                            xtype: 'datefield',
                            fieldLabel: '입고일',
                            anchor: '100%',
                            width: '99%',
                            name: 'reserved_timestamp1'
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '영업사원',
                            allowBlank: false,
                            displayField: 'user_name',
                            valueField: 'unique_id',
                            anchor: '100%',
                            width: '99%',
                            store: Ext.create('Mplm.store.UserSalerStore', {}),
                            name: 'pm_uid'
                        }
                    ]
                }]
            }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '차량등록',
            width: 500,
            height: 340,
            plain: true,
            items: npForm,
            buttons: [{
                text: '차량등록',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (npForm.isValid()) {
                            var val = npForm.getValues(false);
                            npForm.submit({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=addRecvNP',
                                waitMsg: '등록 중 입니다.',
                                params: {
                                    is_def: 'Y',
                                    newmodcont: 'Y'
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
                                        Ext.MessageBox.alert(error_msg_prompt, '차량등록 실패! 같은 증상이 반복되면 시스템 관리자에게 문의하세요.');
                                    }
                                }
                            });
                        } else {
                            Ext.MessageBox.alert(error_msg_prompt, '필수 입력 항목이 입력되지 않았습니다.');
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
    editPoWindow: function (rec) {
        var npForm = Ext.create('Ext.form.Panel', {
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
                title: '정보수정',
                items: [{
                    xtype: 'fieldset',
                    frame: true,
                    title: '기본정보',
                    width: '100%',
                    height: '100%',
                    layout: 'fit',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            layout: {
                                type: 'fit',
                                align: 'left'
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '고객명',
                            allowBlank: true,
                            anchor: '100%',
                            width: '99%',
                            value: rec.get('reserved_varchar2'),
                            name: 'reserved_varchar2'
                        },
                        {
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            id: gu.id('carmakercombo-SRO5_HJ1'),
                            anchor: '100%',
                            width: '99%',
                            editable: true,
                            fieldLabel: '차량제조사',
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
                            name: 'reserved_varchar4',
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
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '차종',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            value: rec.get('reserved_varchar3'),
                            name: 'reserved_varchar3'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '차대번호',
                            allowBlank: false,
                            anchor: '100%',
                            width: '99%',
                            value: rec.get('reserved_varchari'),
                            name: 'reserved_varchari'
                        },
                        {
                            xtype: 'datefield',
                            fieldLabel: '입고일',
                            anchor: '100%',
                            width: '99%',
                            value: rec.get('reserved_timestamp1_str'),
                            name: 'reserved_timestamp1'
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '영업사원',
                            allowBlank: false,
                            displayField: 'user_name',
                            valueField: 'user_name',
                            anchor: '100%',
                            width: '99%',
                            store: Ext.create('Mplm.store.UserSalerStore', {}),
                            name: 'pm_name',
                            value: rec.get('pm_name'),
                        }
                    ]
                }]
            }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수정',
            width: 500,
            height: 340,
            plain: true,
            items: npForm,
            buttons: [{
                text: gm.getMC('CMD_MODIFY', '수정'),
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (npForm.isValid()) {
                            var val = npForm.getValues(false);
                            npForm.submit({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=editRecvNP',
                                waitMsg: '수정 중 입니다.',
                                params: {
                                    is_def: 'Y',
                                    newmodcont: 'Y',
                                    pj_uid: rec.get('ac_uid')
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
                                        Ext.MessageBox.alert(error_msg_prompt, '수정 실패! 같은 증상이 반복되면 시스템 관리자에게 문의하세요.');
                                    }
                                }
                            });
                        } else {
                            Ext.MessageBox.alert(error_msg_prompt, '필수 입력 항목이 입력되지 않았습니다.');
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

    npToPoAct: function (rec) {
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
                    title: '제작유형을 선택하십시오.',
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
                            var val = form.getValues(false);
                            var type = val['pj_type'];
                            Ext.MessageBox.show({
                                title: '수주등록',
                                msg: '선택 건을 수주로 등록하시겠습니까?',
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
                                        var pj_uid = rec.get('ac_uid');
                                        var reserved_varchar2 = rec.get('reserved_varchar2');
                                        var pm_uid = rec.get('pm_uid');
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
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/sales/buyer.do?method=comfirmNPToPo',
                                            params: {
                                                pj_type: type,
                                                pj_first: pj_code,
                                                codeLenth: 3,
                                                standard_column: 'reserved_varcharh',
                                                unique_id: pj_uid,
                                                reserved_varchar2: reserved_varchar2,
                                                pm_uid : pm_uid
                                            },
                                            success: function (result, request) {
                                                Ext.MessageBox.alert('알림', '선택하신 건이 수주등록 되었습니다.<br>그외 데이터는 수주작성에서 입력하세요.');
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
    selMode : 'SINGLE'
});
