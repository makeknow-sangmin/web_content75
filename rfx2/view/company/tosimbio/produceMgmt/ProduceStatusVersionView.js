//수주관리 메뉴
Ext.define('Rfx2.view.company.tosimbio.produceMgmt.ProduceStatusVersionView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produce-status-version-view',
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
            type: 'checkbox',
            field_id: 'isOnlyAssembly',
            items: [
                {
                    boxLabel: gm.getMC('CMD_Assy_Only', '반제품현황만'),
                    checked: false
                },
            ],
        });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_day', '오더일'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

        this.addSearchField({
            type: 'combo',
            field_id: 'product_group'
            , emptyText: gm.getMC('CMD_Product', '제품군')
            , store: "CommonCodeStore"
            , params: {parentCode: 'PRD_GROUP'}
            , displayField: 'code_name_kr'
            , valueField: 'system_code'
            , value: 'code_name_kr'
            , innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>'
        });

        this.addSearchField({
            type: 'combo'
            , field_id: 'reserved5'
            , store: "ProductionSiteStore"
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });

        this.addSearchField('order_number');
        this.addSearchField('wa_name');
        this.addSearchField('final_wa_name');
        this.addSearchField('item_name');

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        is_rotate = 'N';

        this.printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip: '작업지시서 출력',
            disabled: true,
            handler: function (widget, event) {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                if (/**rec.get('status') == 'OP' || **/rec.get('status') == 'W') {
                    // CARTMAP 하나에 RTGAST가 여러개 있을 가능성도 있으므로 기존것 시용 불가
                    var rtgastUids = rec.get('rtgastUids');
                    var ac_uid = rec.get('ac_uid');
                    var rtgastUidsArr = rtgastUids.split(',');
                    console_logs('arr ????', rtgastUidsArr);
                    if (rtgastUidsArr.length > 0) {
                        gm.me().pdfDownload(rtgastUidsArr.length, ac_uid, rtgastUidsArr, 0);
                    }
                } else {
                    Ext.MessageBox.alert('', '상태가 생산 중 일떄 작업지시서를 출력 하실 수 있습니다.');
                    return;
                }
            }
        });

        this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            handler: function () {
                gm.me().producePlanOp();
            }
        });

        this.createStore('Rfx2.model.ProduceStateByPlan', [{
            property: 'create_date',
            direction: 'DESC'
        }],
            gMain.pageSize/* pageSize */
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['cartmap']
        );
        // this.createStore('Rfx2.model.ProduceStateVersionMgmt', [{
        //         property: 'create_date',
        //         direction: 'DESC'
        //     }],
        //     gMain.pageSize/* pageSize */
        //     , {
        //         creator: 'a.creator',
        //         unique_id: 'a.unique_id'
        //     }
        //     , ['cartmap']
        // );

        this.setRowClass(function (record, index) {
            var c = record.get('status');
            switch (c) {
                case 'Y':
                    return 'green-row';
                    break;
                case 'W':
                    return 'blue-row';
                    break;
                case 'OP':
                    return 'yellow-row';
                    break;
                case 'CR':
                    return 'white-row';
                    break;
                default:
                    return 'white-row';
                    break;
            }
        });

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(1, this.prEstablishAction);

        //buttonToolbar.insert(1, this.defaultOrderAction);
        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        console_log("---------------------------------------------------------");

        // this.columns.push({
        //     text: "자재가용성", width: 100, resizable: false,
        //     dataIndex: 'stock_posible', sortable: true, align: 'center', useYn: true,
        //     rowIndex : 15000,
        //     renderer: function (value, metaData, record, rowIndex, colIndex, store) {
        //         console.log(value);
        //         switch (value) {
        //             case 0:
        //                 metaData.css = 'traffic-red';
        //                 break;
        //             case 1:
        //                 metaData.css = 'traffic-green';
        //                 break;
        //             case 2:
        //                 metaData.css = 'traffic-yellow';
        //                 break;
        //             default:
        //                 metaData.css = 'traffic-grey';
        //                 break;
        //         }
        //         return '';     // Do not return anything so only the cell's background is visible
        //     }
        // });

        var cols = this.columns;
        console_logs('cols', cols);
        for (var i = 0; i < cols.length; i++) {
            var o = cols[i];
            console_logs('==============> column o', o);
            if (i === cols.length) {

            }
        }

        // this.columns.reconfigure(this.columns);


        console_log("---------------------------------------------------------");

        this.createGridCore(arr/** , option**/);
        // buttonToolbar.insert(1, this.printPDFAction);

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>>>>> callback datas', selections);
                var rec = selections[0];
                gm.me().printPDFAction.enable();
                gm.me().prEstablishAction.enable();
            } else {
                gm.me().printPDFAction.disable();
                gm.me().prEstablishAction.disable();
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
        this.store.getProxy().setExtraParam('not_pj_type', 'NP');
        this.store.load(function (records) {
        });
    },

    pdfDownload: function (size, ac_uid, reportSelection, pos) {
        if (size > pos) {
            var unique_id = reportSelection[pos];
            console_logs('uid>>>> ', unique_id);
            gMain.setCenterLoading(true);
            Ext.Ajax.request({
                waitMsg: '다운로드 요청중입니다.<br> 잠시만 기다려주세요.',
                url: CONTEXT_PATH + '/pdf.do?method=printWo',
                params: {
                    rtgast_uid: unique_id,
                    po_no: '',
                    pcs_code: '',
                    ac_uid: ac_uid,
                    is_heavy: 'Y',	 //중공업:Y  기타:N
                    is_rotate: is_rotate, //가로양식:Y 세로양식:N
                    wo_type: 'P',
                    pdfPrint: 'pdfPrint'
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
                    gm.me().pdfDownload(size, ac_uid, reportSelection, ++pos);
                    gMain.setCenterLoading(false);
                },
                failure: function (val, action) {
                    gMain.setCenterLoading(false);
                    Ext.Msg.alert('오류', '파일을 불러오는 도중 오류가 발생하였습니다.');
                }
            });
        }
    },

    producePlanOp: function () {
        var selection = this.grid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);
        var myWidth = 465;
        var myHeight = 280;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        console_logs('>>> first_date', firstDay)

        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            width: myWidth,
            height: myHeight - 100,
            items: [
                {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        width: '99%',
                        padding: '1 2 2 10'
                    },
                    border: true,
                    layout: 'vbox',
                    items: [
                        {
                            fieldLabel: '품번',
                            xtype: 'textfield',
                            name: 'line_item_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('item_code'),
                            editable: false,
                            value: selection.get('item_code')
                        },
                        {
                            fieldLabel: '품명',
                            xtype: 'textfield',
                            name: 'line_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('line_code'),
                            editable: false,
                            value: selection.get('item_name') + ' / ' + selection.get('concat_spec_desc') 
                        },
                        {
                            xtype: 'numberfield',
                            name: 'bm_quan',
                            id: gu.id('bm_quan'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '생산계획량',
                            hideTrigger: false,
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {

                            }
                        },
                        {
                            items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '시작일자 /<br>종료일자',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                default: {
                                    flex: 1
                                },
                                items: [
                                    {
                                        xtype: 'datefield',
                                        name: 'start_plan_date',
                                        anchor: '100%',
                                        width: 158,
                                        editable: true,
                                        format : 'Y-m-d',
                                        allowBlank: false,
                                        value : firstDay,
                                    },
                                    {
                                        xtype: 'datefield',
                                        name: 'end_plan_date',
                                        anchor: '100%',
                                        width: 158,
                                        editable: true,
                                        format : 'Y-m-d',
                                        value : lastDay
                                    },
                                ]
                            }]
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '생산계획수립',
            width: myWidth,
            height: myHeight,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                form.submit({
                                    submitEmptyText: false,
                                    url: CONTEXT_PATH + '/index/process.do?method=addPrdPlanEstablishByFP',
                                    waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                    params: {
                                        srcahd_uid: selection.get('unique_id_long'),
                                        produce_plan_qty: val['bm_quan']
                                    },
                                    success: function (val, action) {
                                        console_logs('OK', 'PROCESS OK');
                                        if (prWin) {
                                            Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                            prWin.close();
                                            gm.me().store.load();
                                        }
                                    },
                                    failure: function () {
                                        prWin.setLoading(false);
                                        Ext.MessageBox.alert('에러', '데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.');
                                        if (prWin) {
                                            prWin.close();
                                        }
                                    }
                                });
                            }

                        }
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        Ext.MessageBox.alert(
                            '알림',
                            '취소 할 시 입력한 모든정보가 저장되지 않습니다.<br>그래도 취소하시겠습니까?',
                            function () {
                                console_logs('취소', '취소');
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        )
                    }
                }
            ]
        });


        prWin.show();
    },
});
