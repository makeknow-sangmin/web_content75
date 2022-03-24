//수주관리 메뉴
Ext.define('Rfx2.view.company.chmr.salesDelivery.RecvMgmtKbTechVerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-mgmt-kbtech-ver-view',
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
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_day', '오더일'),
            sdate: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            edate: new Date()
        });

        this.addSearchField({
            // type: 'combo',
            field_id: 'year',
            emptyText: '연도'
            , store: 'YearStore'
            , displayField: 'view'
            , valueField: 'year'
            , innerTpl: '{view}'
        });

        this.addSearchField(
            {
                // type: 'combo',
                field_id: 'route_code'
                , store: 'RouteCodeStore'
                , displayField: 'display'
                , valueField: 'value'
                , innerTpl: '[{display}]{value}'
            });

        this.addSearchField(
            {
                // type: 'combo',
                field_id: 'status_delivery'
                , emptyText: '진행상태'
                , store: 'DeliveryStateCodeStore'
                , displayField: 'display'
                , valueField: 'value'
                , innerTpl: '{display}'
            });

        this.addSearchField('reserved_varchard');
        // this.addSearchField('order_number');
        this.addSearchField('wa_name');
        this.addSearchField('pj_name');


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
                    var status = rec.get('status_delivery');
                    if (status === 'CR' || status === 'BC') {
                        gm.me().rejectConfirm(record);
                    } else if (status === 'CA' || status === 'CT') {
                        Ext.MessageBox.alert('알림', '취소된 수주는 확정취소 할 수 없습니다.')
                    } else {
                        Ext.MessageBox.alert('알림', '수주확정 이후 수주건은 취소할 수 없습니다.')
                    }
                }
            }
        });

        this.deleteWthList = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '삭제',
            disabled: true,
            handler: function () {
                var grid = gu.getCmp('loadForm');
                var store = grid.getStore();
                var record = grid.getSelectionModel().getSelected().items[0];
                // var grid2 = gu.getCmp('gridItemName');
                // var record2 = grid2.getSelectionModel().getSelected().items[0];

                // var dept_code = record1.get('dept_code');
                // var plan_uid = record2.get('unique_id_long');
                // var member_count = record2.get('work_quan');

                // var grid3 = gu.getCmp('people_list');
                // var record3 = grid3.getSelectionModel().getSelection();
                // var input_member_cnt = record3.length;

                // if (input_member_cnt > member_count) {
                //     Ext.MessageBox.alert('알림', '계획인원보다 추가 인원이 입력되었습니다.');
                //     return;
                // } else {
                //     var memberArr = [];
                //     for (var i = 0; i < record3.length; i++) {
                //         var selections = record3[i];
                //         memberArr.push(selections.get('unique_id_long'));
                //     }

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/process.do?method=deletewthdrawlist',
                    params: {
                        unique_id: record.get('unique_id_long'),
                    },
                    success: function (result, request) {
                        var resultText = result.responseText;
                        // console_log('result:' + resultText);
                        // if (resultText === 'true') {
                        Ext.MessageBox.alert('알림', '반영처리 되었습니다.');
                        gm.me().store.load();
                        store.load();
                        // } else {
                        //     Ext.MessageBox.alert('알림', '계획 인원수보다 더 많은 인원이 배치되었습니다.<br>다시 확인해주세요.');
                        // }
                    },
                    failure: extjsUtil.failureMessage
                });//endof ajax request
                // }
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
                var status = rec.get('status_delivery');
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
                            } else {
                                Ext.MessageBox.alert('알림', '해당 수주의 대한 생산건이 입고완료 또는 마감처리 된 상태입니다.<br>처리 진행이 불가합니다.')
                            }
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                } else {
                    if (status === 'CR' || status === 'BM') {
                        Ext.MessageBox.show({
                            title: '수주취소',
                            msg: '선택 한 건을 수주 취소 하시겠습니까?<br>본 작업을 실행 시 취소할 수 없습니다.',
                            buttons: Ext.MessageBox.YESNO,
                            icon: Ext.MessageBox.QUESTION,
                            fn: function (btn) {
                                if (btn == "no" || btn == "cancel") {
                                    return;
                                } else {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=rejectPoCrSloast',
                                        params: {
                                            unique_id: rec.get('unique_uid')
                                        },
                                        success: function (result, request) {
                                            gm.me().store.load();
                                        },
                                        failure: extjsUtil.failureMessage
                                    });
                                }
                            }
                        });
                    } else if (status === 'BC') {
                        Ext.MessageBox.show({
                            title: '수주취소',
                            msg: '선택 한 건을 수주 확정취소 하시겠습니까?<br>본 작업을 실행 시 취소할 수 없습니다.',
                            buttons: Ext.MessageBox.YESNO,
                            icon: Ext.MessageBox.QUESTION,
                            fn: function (btn) {
                                if (btn == "no" || btn == "cancel") {
                                    return;
                                } else {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=cancelPoBomCoplete',
                                        params: {
                                            sloastUid: rec.get('unique_id_long'),
                                            cartmapUid: rec.get('cartmap_uid')
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
                    } else if (status === 'CA' || status === 'CT') {
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
                var status = rec.get('status');
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
                // 해당 수주가 출고가 되었는지 안되었는지 판별
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/production/schdule.do?method=isDeliveryCheck',
                    params: {
                        project_uid: rec.get('ac_uid'),
                        srcahd_uid: rec.get('srcahd_uid')
                    },
                    success: function (result, request) {
                        // 여기서 판별한 결과에 따라 나뉘어짐.
                        console_logs('result.responseText >>', result.responseText);
                        var check = result.responseText;
                        if (check === 'true') {
                            var form = Ext.create('Ext.form.Panel', {
                                id: 'editPoForm',
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
                                        if (btn == "no") {
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
                        } else {
                            Ext.MessageBox.alert('알림', '출하 완료상태에서는 수주변경이 불가합니다.')
                        }

                    }, // endofsuccess
                    failure: extjsUtil.failureMessage
                });


            }
        });

        // this.payCompleteAction = Ext.create('Ext.Action', {
        //     iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
        //     disabled: true,
        //     text: '정산완료',
        //     tooltip: '납품완료 후 정산처리를 완료합니다.',
        //     handler: function () {
        //         var record = gm.me().grid.getSelectionModel().getSelection();
        //         for (var i = 0; i < record.length; i++) {
        //             var rec = record[i];
        //             var status = rec.get('status_delivery');
        //             var paytype = Ext.create('Ext.data.Store', {
        //                 fields: ['var_value', 'var_name'],
        //                 data: [
        //                     { "var_value": "MONEY", "var_name": "현금" },
        //                     { "var_value": "CARD", "var_name": "카드" },
        //                     { "var_value": "NOTE", "var_name": "어음" }
        //                 ]
        //             });

        //             if (status === 'DC' || status === 'PS') {
        //                 var form = Ext.create('Ext.form.Panel', {
        //                     id: 'editPoForm',
        //                     xtype: 'form',
        //                     frame: false,
        //                     border: false,
        //                     width: '100%',
        //                     layout: 'column',
        //                     // overflowY: 'scroll',
        //                     bodyPadding: 10,
        //                     items: [
        //                         {
        //                             xtype: 'fieldset',
        //                             collapsible: false,
        //                             title: gm.me().getMC('msg_order_dia_header_title', '계산서발행일, 입금일, 정산액, 결제방법을 입력하십시오.'),
        //                             width: '100%',
        //                             style: 'padding:10px',
        //                             defaults: {
        //                                 labelStyle: 'padding:10px',
        //                                 anchor: '100%',
        //                                 layout: {
        //                                     type: 'column',
        //                                     align: 'middle'
        //                                 }
        //                             },
        //                             items: [
        //                                 {
        //                                     xtype: 'container',
        //                                     width: '100%',
        //                                     // margin: '0 10 10 1',
        //                                     border: true,
        //                                     defaultMargins: {
        //                                         top: 0,
        //                                         right: 0,
        //                                         bottom: 0,
        //                                         left: 10
        //                                     },
        //                                     items: [
        //                                         {
        //                                             xtype: 'datefield',
        //                                             id: gu.id('bill_date'),
        //                                             name: 'bill_date',
        //                                             padding: '0 0 5px 30px',
        //                                             width: '90%',
        //                                             allowBlank: true,
        //                                             fieldLabel: '계산서 발행일',
        //                                             format: 'Y-m-d',
        //                                         },
        //                                         {
        //                                             xtype: 'datefield',
        //                                             id: gu.id('withdraw_date'),
        //                                             name: 'withdraw_date',
        //                                             padding: '0 0 5px 30px',
        //                                             width: '90%',
        //                                             allowBlank: true,
        //                                             fieldLabel: '입금일',
        //                                             format: 'Y-m-d',
        //                                         },
        //                                         {
        //                                             xtype: 'numberfield',
        //                                             id: gu.id('process_price'),
        //                                             name: 'pay_price',
        //                                             padding: '0 0 5px 30px',
        //                                             width: '90%',
        //                                             allowBlank: true,
        //                                             fieldLabel: '정산액',
        //                                         },
        //                                         {
        //                                             xtype: 'combo',
        //                                             fieldLabel: '결제방법',
        //                                             id: gu.id('pay_type'),
        //                                             padding: '0 0 5px 30px',
        //                                             store: paytype,
        //                                             width: '90%',
        //                                             name: 'pay_type',
        //                                             valueField: 'var_value',
        //                                             displayField: 'var_name',
        //                                             selectOnFocus: true,
        //                                             emptyText: '선택해주세요.',
        //                                             listConfig: {
        //                                                 loadingText: '검색중...',
        //                                                 emptyText: '일치하는 항목 없음',
        //                                                 getInnerTpl: function () {
        //                                                     // return '<div data-qtip="{ship}">{ship_kr}</div>';
        //                                                     return '<div data-qtip="{var_value}">{var_name}</div>';
        //                                                 }
        //                                             },
        //                                             listeners: {
        //                                                 afterrender: function (combo) {
        //                                                     // var comboStore = combo.getStore();
        //                                                     // comboStore.on('load', function (store) {
        //                                                     //     combo.select(comboStore.getAt(0));
        //                                                     // });
        //                                                 }
        //                                             }

        //                                         }
        //                                     ]
        //                                 },

        //                             ]
        //                         }
        //                     ]
        //                 });

        //                 var win = Ext.create('Ext.Window', {
        //                     modal: true,
        //                     title: gm.me().getMC('mes_order_recv_btn', '정산정보 입력'),
        //                     width: 500,
        //                     height: 270,
        //                     plain: true,
        //                     items: form,
        //                     buttons: [{
        //                         text: CMD_OK,
        //                         handler: function (btn) {
        //                             if (btn == "no") {
        //                                 win.close();
        //                             } else {
        //                                 var form = Ext.getCmp('editPoForm').getForm();
        //                                 var select = gm.me().grid.getSelectionModel().getSelection();
        //                                 var rec = select[0];
        //                                 var sloastUid = rec.get('unique_uid');
        //                                 var pj_uid = rec.get('ac_uid');
        //                                 var sales_amount = rec.get('sales_amount_include_tax');

        //                                 var order_com_unique = rec.get('order_com_unique');
        //                                 if (form.isValid()) {
        //                                     win.setLoading(true);
        //                                     var val = form.getValues(false);
        //                                     var pay_price = gu.getCmp('process_price').getValue();

        //                                     if (pay_price > sales_amount) {
        //                                         Ext.MessageBox.alert('알림', '정산액이 금액보다 큰 값이 입력되었습니다.<br>다시 확인해주세요.');
        //                                         win.setLoading(false);
        //                                         return;
        //                                     } else; {
        //                                         form.submit({
        //                                             submitEmptyText: false,
        //                                             url: CONTEXT_PATH + '/index/process.do?method=paycompleteSimple',
        //                                             params: {
        //                                                 process_price: pay_price,
        //                                                 sloastUid: sloastUid,
        //                                                 bill_date: val['bill_date'],
        //                                                 pj_uid: pj_uid,
        //                                                 sales_amount: sales_amount,
        //                                                 order_com_unique: order_com_unique,
        //                                                 withdraw_date: val['withdraw_date'],
        //                                                 pay_type: val['pay_type']
        //                                             },
        //                                             success: function (val, action) {
        //                                                 console_logs('val >>>>', val);
        //                                                 win.setLoading(false);
        //                                                 gm.me().store.load();
        //                                                 win.close();
        //                                             },
        //                                             failure: function () {
        //                                                 win.setLoading(false);
        //                                                 extjsUtil.failureMessage();
        //                                             }
        //                                         });
        //                                     }


        //                                 } else {
        //                                     // Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
        //                                 }
        //                             }
        //                         }
        //                     }, {
        //                         text: CMD_CANCEL,
        //                         handler: function (btn) {
        //                             win.close();
        //                         }
        //                     }]
        //                 });
        //                 win.show();
        //             } else {
        //                 var msg = '';
        //                 if (status === 'BM') {
        //                     msg = '수주등록 상태에서의 정산완료처리는 불가합니다.';
        //                 }

        //                 if (status === 'CR') {
        //                     msg = '수주확정 상태에서의 정산완료처리는 불가합니다.';
        //                 }

        //                 if (status === 'CA') {
        //                     msg = '수주취소 상태에서의 정산완료처리는 불가합니다.';
        //                 }

        //                 if (status === 'DS' || status === 'DO') {
        //                     msg = '납품완료 상태에서 처리가 가능합니다.';
        //                 }

        //                 if (status === 'PC') {
        //                     msg = '이미 처리되었습니다.';
        //                 }
        //                 Ext.MessageBox.alert('알림', msg);
        //                 return;
        //             }
        //         }
        //     }
        // });

        this.createStore('Rfx2.model.RecvMgmtVerBioProtech', [{
                property: 'unique_id',
                direction: 'DESC2'
            }],
            gMain.pageSize/* pageSize */
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['sloast']
        );

        this.setRowClass(function (record, index) {
            var c = record.get('status_delivery');
            switch (c) {
                case 'CR':
                case 'BC':
                    return 'white-row';
                    break;
                case 'CA':
                case 'ST':
                case 'RT':
                case 'GC':
                case 'CT':
                    return 'red-row';
                    break;
                case 'BM':
                    return 'white-row';
                    break;
                case 'OP':
                case 'PC':
                    return 'yellow-row';
                    break;
                case 'W':
                case 'DO':
                case 'PC':
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
        // buttonToolbar.insert(2, this.copyPoAction);
        buttonToolbar.insert(2, this.cancelPo);
        // buttonToolbar.insert(3, this.payCompleteAction);
        // buttonToolbar.insert(4, this.changePo);
        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        Ext.each(this.columns, function (columnObj, index) {
            console.log(this.columns);
            var o = columnObj;

            var dataIndex = o['dataIndex'];

            if (o['dataType'] === 'number') {
                console.log('dataType!!!!', o['text'] + ' : ' + o['dataType']);
                o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                    if (gm.me().store.data.items.length > 0) {
                        var summary = gm.me().store.data.items[0].get('summary');
                        console.log('summary', summary);
                        console.log('summary.length', summary.length);
                        if (summary.length > 0) {
                            var objSummary = Ext.decode(summary);
                            console.log('return', Ext.util.Format.number(objSummary[dataIndex], '0,00/i'));
                            return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                        } else {
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                };
            }

        });

        var option = {
            features: [
                {
                    ftype: 'summary',
                    dock: 'top',
                },
            ],
        };

        //그리드 생성
        this.createGrid(searchToolbar, buttonToolbar, option);
        // this.createGridCore(arr/** , option**/);

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
                // this.payCompleteAction.enable();
            } else {
                this.rollbackPoOnlyPrdAceeptAction.disable();
                this.cancelPo.disable();
                this.printPIAction.disable();
                this.copyPoAction.disable();
                this.changePo.disable();
                // this.payCompleteAction.disable();
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
        this.store.getProxy().setExtraParam('route_code', "GO");
        this.store.load(function (records) {
            console_logs("테스트==========", records)
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
                    var sloastUids = [];
                    var statusArr = [];
                    var projectUids = [];
                    var cartmapUids = [];
                    for (var i = 0; i < rec.length; i++) {
                        var selections = rec[i];
                        sloastUids.push(selections.get('unique_uid'));
                        statusArr.push(selections.get('status'));
                        projectUids.push(selections.get('ac_uid'));
                        if (selections.get('cartmap_uid') === null || selections.get('cartmap_uid') === undefined) {
                            cartmapUids.push(-1);
                        } else {
                            cartmapUids.push(selections.get('cartmap_uid'));
                        }
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/schdule.do?method=rejectPoOnlyCRMultiVer',
                        params: {
                            sloastUids: sloastUids,
                            statusArr: statusArr,
                            projectUids: projectUids,
                            cartmapUids: cartmapUids
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

    confirmPayComplete: function (result) {
        if (result == 'yes') {
            // var select = gm.me().grid.getSelectionModel().getSelection()[0];
            var select = gm.me().grid.getSelectionModel().getSelection();
            var sloastUids = [];
            for (var i = 0; i < select.length; i++) {
                var selects = select[i];
                sloastUids.push(selects.get('unique_uid'));
            }
            gMain.setCenterLoading(true);
            // gm.me().loding_msg();
            Ext.Ajax.request({
                waitMsg: '처리중입니다.<br> 잠시만 기다려주세요.',
                url: CONTEXT_PATH + '/index/process.do?method=paycompleteSimple',
                params: {
                    sloastUids: sloastUids
                },
                success: function (result, request) {
                    gMain.setCenterLoading(false);
                    gm.me().store.load();
                    Ext.MessageBox.alert('알림', '확정처리 되었습니다.');
                },
                failure: extjsUtil.failureMessage
            });
            gMain.setCenterLoading(false);
        }
    },

    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var rec = selections[0];
        console_logs('>>>> rec dbclick', rec);
        var detailStore = Ext.create('Rfx2.store.company.chmr.MoneyInStoreByBill', {});
        detailStore.getProxy().setExtraParam('project_uid', rec.get('ac_uid'));
        detailStore.getProxy().setExtraParam('combst_uid', rec.get('order_com_unique'));
        detailStore.getProxy().setExtraParam('not_filter_year', 'Y');
        detailStore.load();
        var paytype = Ext.create('Ext.data.Store', {
            fields: ['var_value', 'var_name'],
            data: [
                {"var_value": "MONEY", "var_name": "현금"},
                {"var_value": "CARD", "var_name": "카드"},
                {"var_value": "NOTE", "var_name": "어음"}
            ]
        });
        paytype.load();
        var loadForm = Ext.create('Ext.grid.Panel', {
            store: detailStore,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            id: gu.id('loadForm'),
            layout: 'fit',
            title: '입력금액 : ' + Ext.util.Format.number(rec.get('payprice_sum'), '0,000') + ' 원',
            region: 'center',
            style: 'padding-left:0px;',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            columns: [
                {
                    text: "계산서 발행일",
                    flex: 1,
                    style: 'text-align:center',
                    dataIndex: 'aprv_date',
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: "입금금액",
                    flex: 1,
                    dataIndex: 'money_summary',
                    align: 'right',
                    style: 'text-align:center',
                    sortable: true,
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'price') {
                            context.record.set('price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: "입금일",
                    flex: 1,
                    style: 'text-align:center',
                    dataIndex: 'in_date',
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },

                {
                    text: "비고",
                    flex: 1,
                    style: 'text-align:center',
                    dataIndex: 'description',
                    sortable: true,
                },
                {
                    text: "결제방법",
                    flex: 1,
                    style: 'text-align:center',
                    dataIndex: 'pay_type',
                    sortable: true,
                },
            ],
            renderTo: Ext.getBody(),
            autoScroll: true,
            multiSelect: true,
            pageSize: 100,
            width: 100,
            height: 300,
        });

        loadForm.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    var rec = selections[0];
                    gm.me().deleteWthList.enable();
                    // gu.getCmp('loadCancel').enable();
                } else {
                    gm.me().deleteWthList.disable();
                    // gu.getCmp('loadCancel').disable();
                }
            }
        });

        var winProduct = Ext.create('ModalWindow', {
            title: '입금이력 조회<br>[고객명 : ' + rec.get('wa_name') + ' / 납품요구번호 : ' + rec.get('reserved_varchard') + ']',
            width: 200,
            height: 600,
            minWidth: 600,
            minHeight: 300,
            items: [
                // searchPalletGrid, 
                loadForm
            ],
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    winProduct.setLoading(false);
                    winProduct.close();
                }
            }]
        });
        winProduct.show();
    },

    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SAMPLE_TYPE'}),
    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
});
