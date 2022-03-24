//수주관리 메뉴
Ext.define('Rfx2.view.company.mjcm.salesDelivery.RecvMgmtKbTechView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-mgmt-kbtech-view',
    inputBuyer: null,
    wthContentStore: Ext.create('Rfx2.store.company.hanjung.WthDrawEtcStore', {}),
    wthContentRecords: null,
    onSortChange: function (container, column, direction, eOpts) {
        console_logs('column', column);
        console_logs('direction', direction);
    },
    initComponent: function () {
        console_logs('<<-----------------------------------', 1);
        this.on('sortchange', this.onSortChange, this);
        console_logs('<<-----------------------------------', 1);

        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.
        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // 검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'checkbox',
            field_id: 'isOnlyCancel',
            items: [
                {
                    boxLabel: '수주취소포함',
                    checked: false
                },
            ],
        });

        this.addSearchField({
            type: 'checkbox',
            field_id: 'isOnlyDlComplete',
            items: [
                {
                    boxLabel: gm.me().getMC('CMD_Including_delivery_completion','출고완료포함'),
                    checked: false
                },
            ],
        });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_day', '오더일'),
            sdate: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            edate: new Date()
        });

        this.addSearchField({
            type: 'combo',
            field_id: 'product_group'
            , emptyText: gm.getMC('CMD_Product', '제품군')
            , store: "CommonCodeStore"
            , params: { parentCode: 'PRD_GROUP' }
            , displayField: 'code_name_kr'
            , valueField: 'system_code'
            , value: 'code_name_kr'
            , innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>'
        });

        this.addSearchField('item_name');
        this.addSearchField('order_number');
        this.addSearchField('wa_name');

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.rollbackPoOnlyPrdAceeptAction = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            disabled: true,
            text: '확정취소',
            tooltip: '수주확정 후 계획 전 단계의 수주건을 취소합니다.',
            handler: function () {
                var record = gm.me().grid.getSelectionModel().getSelection();
                for (var i = 0; i < record.length; i++) {
                    var rec = record[i];
                    var status = rec.get('status');
                    if (status === 'CR') {
                        gm.me().rejectConfirm(record);
                    } else if (status === 'CA') {
                        Ext.MessageBox.alert('알림', '취소된 수주는 확정취소 할 수 없습니다.')
                    } else {
                        Ext.MessageBox.alert('알림', '수주확정 이후 수주건은 취소할 수 없습니다.')
                    }
                }
            }
        });

        this.cancelPo = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            disabled: true,
            text: '수주취소',
            tooltip: '등록상태에 수주 건에 대하여 삭제를 진행합니다.',
            handler: function () {
                var record = gm.me().grid.getSelectionModel().getSelection();
                // for (var i = 0; i < record.length; i++) {
                var rec = record[0];
                var status = rec.get('status_bio');
                // 현재 수주의 상태를 판단해야 함. 
                var assymapUid = rec.get('unique_uid');
                // 새로 쓴 버전
                if (status === 'OP' || status === 'W') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/schdule.do?method=currentOdCheck',
                        params: {
                            assymapUid: assymapUid
                        },
                        success: function (result, request) {
                            var resultStr = '';
                            console_logs('result.responseText >>', result.responseText);
                            resultStr = result.responseText;
                            if (resultStr === 'true') {
                                var pj_code = rec.get('pj_code');
                                var pl_no = rec.get('pl_no');
                                var assymap_uid = rec.get('unique_uid');
                                var before_customer = rec.get('wa_name');
                                var cartmap_uid = rec.get('cartmap_uid');
                                var reserved1 = rec.get('reserved1');
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=changePlanInventoryByPo',
                                    params: {
                                        assymap_uid: assymap_uid,
                                        pj_code: pj_code,
                                        pl_no: pl_no,
                                        before_customer: before_customer,
                                        cartmap_uid: cartmap_uid,
                                        reserved1: reserved1
                                    },
                                    success: function (result, request) {
                                        Ext.MessageBox.alert('알림', '해당 수주건이 취소처리 되었습니다.');
                                        gm.me().store.load();
                                    }, // endofsuccess
                                    failure: extjsUtil.failureMessage
                                });

                                // Ext.MessageBox.show({
                                //     title: '계획생산 변경',
                                //     msg: '선택 한 수주 건의 생산계획이 존재합니다.<br>해당 생산계획 데이터를 계획생산으로 변경을 진행하시겠습니까?<br><b>본 작업을 진행 시 취소가 불가능 합니다.</b>',
                                //     buttons: Ext.MessageBox.YESNO,
                                //     icon: Ext.MessageBox.QUESTION,
                                //     fn: function (btn) {
                                //         if (btn == "no" || btn == "cancel") {
                                //             return;
                                //         } else {
                                //             var pj_code = rec.get('pj_code');
                                //             var pl_no = rec.get('pl_no');
                                //             var assymap_uid = rec.get('unique_uid');
                                //             var before_customer = rec.get('wa_name');
                                //             var cartmap_uid = rec.get('cartmap_uid');
                                //             var reserved1 = rec.get('reserved1');
                                //             Ext.Ajax.request({
                                //                 url: CONTEXT_PATH + '/production/schdule.do?method=changePlanInventoryByPo',
                                //                 params: {
                                //                     assymap_uid: assymap_uid,
                                //                     pj_code: pj_code,
                                //                     pl_no: pl_no,
                                //                     before_customer: before_customer,
                                //                     cartmap_uid: cartmap_uid,
                                //                     reserved1: reserved1
                                //                 },
                                //                 success: function (result, request) {
                                //                     Ext.MessageBox.alert('알림', '해당 수주에 대한 생산계획이 계획생산으로 변경되었습니다.');
                                //                     gm.me().store.load();
                                //                 }, // endofsuccess
                                //                 failure: extjsUtil.failureMessage
                                //             });
                                //         }
                                //     }
                                // });
                            } else {
                                Ext.MessageBox.alert('알림', '해당 수주의 대한 생산건이 입고완료 또는 마감처리 된 상태입니다.<br>처리 진행이 불가합니다.')
                            }
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                } else {
                    if (status === 'BM') {
                        gm.me().cancelPoAct(record);
                    } else if (status === 'CR') {
                        Ext.MessageBox.show({
                            title: '수주취소',
                            msg: '선택 한 건을 수주 취소 하시겠습니까?<br>본 작업을 실행 시 취소할 수 없습니다.',
                            buttons: Ext.MessageBox.YESNO,
                            icon: Ext.MessageBox.QUESTION,
                            fn: function (btn) {
                                if (btn == "no" || btn == "cancel") {
                                    return;
                                } else {
                                    var assymapUids = [];
                                    assymapUids.push(rec.get('unique_uid'));
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=rejectPoOnlyCR',
                                        params: {
                                            assymap_uid: rec.get('unique_uid'),
                                            assytop_uid: rec.get('parent_uid'),
                                            ac_uid: rec.get('ac_uid'),
                                            pj_code: rec.get('pj_code'),
                                            pl_no: rec.get('pl_no')
                                        },
                                        success: function (result, request) {
                                            gm.me().store.load();
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/production/schdule.do?method=cancelPoComplete',
                                                params: {
                                                    assymapUid: rec.get('unique_uid'),
                                                    projectUid: rec.get('ac_uid')
                                                },
                                                success: function (result, request) {
                                                    Ext.MessageBox.alert('알림', '해당 건이 취소처리 되었습니다.');
                                                    gm.me().store.load();
                                                },
                                                failure: extjsUtil.failureMessage
                                            });
                                        },
                                        failure: extjsUtil.failureMessage
                                    });
                                }
                            }
                        });
                    } else if (status === 'CA') {
                        Ext.MessageBox.alert('알림', '이미 수주취소 되었습니다.')
                    } else if (status === 'DC') {
                        Ext.MessageBox.alert('알림', '출하완료된 상태에서는 취소가 불가합니다.')
                    } else if (status === 'DS') {
                        Ext.MessageBox.alert('알림', '부분출고된 상태에서는 직접취소가 불가하며<br>수주변경으로 수량조절로 가능합니다.')
                    }
                }
            }
        });

        this.printPIAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            disabled: true,
            text: 'P/I출력',
            tooltip: '확정된 수주에 대한 Proforma Inovice를 출력합니다.',
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var record = gm.me().grid.getSelectionModel().getSelection();
                var rec = record[0];
                var status = rec.get('status_bio');
                if (status === 'BM' || status === 'CA') {
                    Ext.MessageBox.alert('알림', '수주 확정상태가 아닌 수주 건에 대해서는 P/I 출력이 불가합니다.');
                } else {
                    gm.me().pdfDownload(selections.length, selections, 0);
                }
            }
        });

        this.copyPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-copy',
            disabled: true,
            text: '복사등록',
            tooltip: '선택한 수주에 대하여 복사등록을 실시합니다.',
            handler: function () {
                var record = gm.me().grid.getSelectionModel().getSelection();
                var rec = record[0];
                var form = Ext.create('Ext.form.Panel', {
                    id: 'addPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    // overflowY: 'scroll',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('msg_order_dia_header_title', '기준정보를 입력하십시오.'),
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
                                            fieldLabel: gm.me().getMC('msg_order_dia_order_transaction', '거래구분'),
                                            xtype: 'combo',
                                            width: '90%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().sampleTypeStore,
                                            emptyText: '선택해주세요.',
                                            displayField: 'codeName',
                                            valueField: 'systemCode',
                                            value: 'N',
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
                                            id: 'reserved_varchard',
                                            name: 'reserved_varchard',
                                            padding: '0 0 5px 30px',
                                            width: '90%',
                                            allowBlank: true,
                                            fieldLabel: gm.me().getMC('msg_order_dia_order_po_no', '고객 PO번호'),
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'po_date',
                                            name: 'po_date',
                                            padding: '0 0 5px 30px',
                                            width: '90%',
                                            allowBlank: true,
                                            fieldLabel: 'Po Date',
                                            format: 'Y-m-d',
                                            value: new Date()
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'delivery_plan',
                                            name: 'delivery_plan',
                                            padding: '0 0 5px 30px',
                                            width: '90%',
                                            allowBlank: true,
                                            fieldLabel: '고객요청일',
                                            format: 'Y-m-d',
                                            value: new Date()
                                        }
                                    ]
                                },

                            ]
                        }
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_order_recv_btn', '수주 복사등록'),
                    width: 500,
                    height: 300,
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
                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=addRecvPoCopy',
                                        params: {
                                            pj_type: val['reserved_varcharb'],
                                            reserved_varchard: val['reserved_varchard'],
                                            regist_date: val['po_date'],
                                            assymap_uid: rec.get('unique_uid'),
                                            ac_uid: rec.get('ac_uid')
                                        },
                                        success: function (val, action) {
                                            console_logs('val >>>>', val);
                                            win.setLoading(false);
                                            gm.me().store.load();
                                            // gm.me().poPrdDetailStore.load();
                                            win.close();
                                        },
                                        failure: function () {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                        }
                                    });
                                } else {
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


        this.changePo = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            disabled: true,
            text: '수주변경',
            tooltip: '선택한 수주에 대하여 수주변경을 실시합니다.',
            handler: function () {
                var record = gm.me().grid.getSelectionModel().getSelection();
                var rec = record[0];
                if (rec.get('status_bio') === 'DC' /**|| rec.get('status_bio') === 'DS'**/) {
                    Ext.MessageBox.alert('알림', '출하 완료상태에서는 수주변경이 불가합니다.')
                } else {
                    var form = Ext.create('Ext.form.Panel', {
                        id: 'editPoForm',
                        xtype: 'form',
                        frame: false,
                        border: false,
                        width: '100%',
                        layout: 'column',
                        overflowY: 'scroll',
                        bodyPadding: 10,
                        items: [
                            {
                                xtype: 'fieldset',
                                collapsible: false,
                                title: gm.me().getMC('msg_order_dia_header_title', '변경정보를 입력하십시오.'),
                                width: '100%',
                                style: 'padding:10px',
                                defaults: {
                                    labelStyle: 'padding:10px',
                                    anchor: '100%',
                                    layout: {
                                        type: 'column',
                                        align: 'middle'
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
                                                xtype: 'label',
                                                width: 400,
                                                height: 60,
                                                html: '<p style="text-align:left;">&nbsp&nbsp&nbsp&nbsp&nbsp수주번호 : ' + rec.get('order_number') + '<br>&nbsp&nbsp&nbsp&nbsp&nbsp고객사 : ' + rec.get('wa_name') + '<br>&nbsp&nbsp&nbsp&nbsp&nbsp제품명 / 기준모델 : ' + rec.get('item_name') + ' / ' + rec.get('description_src') + '</p>',
                                                style: 'color:black;'
                                            },
                                            {
                                                xtype: 'datefield',
                                                id: 'assymap_timestamp1',
                                                name: 'assymap_timestamp1',
                                                padding: '0 0 5px 30px',
                                                width: '90%',
                                                allowBlank: true,
                                                fieldLabel: '고객요청일',
                                                format: 'Y-m-d',
                                                value: rec.get('assymap_resv_timestamp1_str')
                                            },
                                            {
                                                xtype: 'numberfield',
                                                id: 'bm_quan',
                                                name: 'bm_quan',
                                                padding: '0 0 5px 30px',
                                                width: '90%',
                                                allowBlank: true,
                                                fieldLabel: '요청수량',
                                                value: rec.get('bm_quan')
                                            }
                                        ]
                                    },

                                ]
                            }
                        ]
                    });

                    var win = Ext.create('Ext.Window', {
                        modal: true,
                        title: gm.me().getMC('mes_order_recv_btn', '수주변경'),
                        width: 500,
                        height: 270,
                        plain: true,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function (btn) {
                                if (btn == "no" || btn == "cancel") {
                                    win.close();
                                } else {
                                    var form = Ext.getCmp('editPoForm').getForm();
                                    if (form.isValid()) {
                                        win.setLoading(true);
                                        var val = form.getValues(false);
                                        form.submit({
                                            submitEmptyText: false,
                                            url: CONTEXT_PATH + '/production/schdule.do?method=changePo',
                                            params: {
                                                bm_quan: val['bm_quan'],
                                                assymap_timestamp1: val['assymap_timestamp1'],
                                                assymap_uid: rec.get('unique_uid')
                                            },
                                            success: function (val, action) {
                                                console_logs('val >>>>', val);
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
                                        // Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
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
            }
        });

        this.createStore('Rfx2.model.RecvMgmtBioProtech', [{
            property: 'unique_id',
            direction: 'DESC2'
        }],
            gMain.pageSize/* pageSize */
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['assymap']
        );

        this.setRowClass(function (record, index) {
            var c = record.get('status_bio');
            switch (c) {
                case 'CR':
                    return 'white-row';
                    break;
                case 'CA':
                    return 'red-row';
                    break;
                case 'BM':
                    return 'green-row';
                    break;
                case 'OP':
                    return 'yellow-row';
                    break;
                case 'W':
                    return 'blue-row';
                    break;
                case 'DS':
                    return 'gray-row';
                    break;
                case 'DC':
                    return 'orange-row';
                    break;
                default:
                    return 'green-row';
                    break;
            }
        });

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(1, this.rollbackPoOnlyPrdAceeptAction);
        buttonToolbar.insert(2, this.copyPoAction);
        buttonToolbar.insert(2, this.cancelPo);
        buttonToolbar.insert(3, this.printPIAction);
        buttonToolbar.insert(4, this.changePo);
        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGridCore(arr/** , option**/);

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>>>>> callback datas', selections);
                var rec = selections[0];
                this.rollbackPoOnlyPrdAceeptAction.enable();
                this.cancelPo.enable();
                this.printPIAction.enable();
                this.copyPoAction.enable();
                this.changePo.enable();
            } else {
                this.rollbackPoOnlyPrdAceeptAction.disable();
                this.cancelPo.disable();
                this.printPIAction.disable();
                this.copyPoAction.disable();
                this.changePo.enable();
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
        this.store.getProxy().setExtraParam('not_pj_type', 'A');
        this.store.getProxy().setExtraParam('not_cancel_po_dc', 'Y');
        this.store.load(function (records) {
        });
    },
    rejectConfirm: function (rec) {
        Ext.MessageBox.show({
            title: '확정취소',
            msg: '선택 한 건을 수주 확정취소 하시겠습니까?<br>본 작업을 실행 시 취소할 수 없습니다.',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn) {
                if (btn == "no") {
                    return;
                } else {
                    var assymapUids = [];
                    var assytopUids = [];
                    var acUids = [];
                    var pjCodes = [];
                    var plNos = [];
                    for (var i = 0; i < rec.length; i++) {
                        var selections = rec[i];
                        var assymap_uid = selections.get('unique_uid');
                        var assytop_uid = selections.get('parent_uid');
                        var ac_uid = selections.get('ac_uid');
                        var pj_code = selections.get('pj_code');
                        var pl_no = selections.get('pl_no');

                        assymapUids.push(assymap_uid);
                        assytopUids.push(assytop_uid);
                        acUids.push(ac_uid);
                        pjCodes.push(pj_code);
                        plNos.push(pl_no);
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/schdule.do?method=rejectPoOnlyCRMulti',
                        params: {
                            assymapUids: assymapUids,
                            assytopUids: assytopUids,
                            acUids: acUids,
                            pjCodes: pjCodes,
                            plNos: plNos
                        },
                        success: function (result, request) {
                            Ext.MessageBox.alert('알림', '해당 건이 확정취소 되었습니다.');
                            gm.me().store.load();
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                }
            }
        });
    },

    cancelPoAct: function (rec) {
        Ext.MessageBox.show({
            title: '수주취소',
            msg: '선택 한 건을 수주취소 하시겠습니까?<br>본 작업을 실행 시 취소할 수 없습니다.',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn) {
                if (btn == "no") {
                    return;
                } else {
                    var assymapUids = [];
                    for (var i = 0; i < rec.length; i++) {
                        var selections = rec[i];
                        var assymap_uid = selections.get('unique_uid');
                        assymapUids.push(assymap_uid);
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/schdule.do?method=cancelPo',
                        params: {
                            assymapUids: assymapUids
                        },
                        success: function (result, request) {
                            Ext.MessageBox.alert('알림', '해당 건이 확정취소 되었습니다.');
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
            var ac_uid = reportSelection[pos].get('ac_uid');
            var parent_uid = reportSelection[pos].get('parent_uid');
            Ext.Ajax.request({
                waitMsg: '다운로드 요청중입니다.<br> 잠시만 기다려주세요.',
                url: CONTEXT_PATH + '/pdf.do?method=printProforma',
                params: {
                    pdfPrint: 'pdfPrint',
                    is_rotate: 'N',
                    ac_uid: ac_uid,
                    rtgast_uids: ac_uid,
                    parent_uid: parent_uid
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

    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SAMPLE_TYPE' }),
    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
});
