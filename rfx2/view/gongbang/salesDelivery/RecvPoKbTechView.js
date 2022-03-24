//수주관리 메뉴
Ext.define('Rfx2.view.gongbang.salesDelivery.RecvPoKbTechView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-po-kbtech-view',
    inputBuyer: null,
    isDuplicated: false,

    estiContentStore: Ext.create('Rfx2.store.company.hanjung.EstiContentStore', {}),
    estiContentRecords: null,
    checkButtonClicked: false,
    wthContentStore: Ext.create('Rfx2.store.company.hanjung.WthDrawEtcStore', {}),
    wthContentRecords: null,
    initComponent: function () {

        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.
        var objs = [];
        var estimate_wb = 0;
        var estimate_ch = 0;
        var estimate_re = 0;
        var estimate_etc = 0;

        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // this.setDefValue('pj_code', 'test');
        // 검색툴바 필드 초기화
        this.initSearchField();

        // this.addSearchField({
        //     type: 'combo'
        //     , field_id: 'status'
        //     , store: "RecevedStateStore"
        //     , displayField: 'codeName'
        //     , valueField: 'systemCode'
        //     , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        // });

        // this.addSearchField('item_code');

        this.addSearchField({
            type: 'combo'
            , field_id: 'pm_uid'
            , emptyText: '영업담당자'
            , store: "UserDeptStore"
            , displayField: 'user_name'
            , valueField: 'unique_id'
            , value: vCUR_USER_UID
            , params: {dept_code: "D102"}
            , innerTpl: '<div data-qtip="{dept_name}">{user_name}</div>'
        });

        this.addCallback('AUTO_PJCODE', function (o) {
            if (this.crudMode == 'EDIT') { // EDIT
            } else {// CREATE,COPY
                var target = gm.me().getInputJust('project|reserved_varchar7');
                var date = new Date();
                var fullYear = gUtil.getFullYear() + '';
                var month = gUtil.getMonth() + '';
                var day = date.getDate() + '';
                if (month.length == 1) {
                    month = '0' + month;
                }
                if (day.length == 1) {
                    day = '0' + day;
                }
                var pj_code = fullYear.substring(2, 4) + month + day + '-';
                // 마지막 수주번호 가져오기
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoWithStColumn',
                    params: {
                        pj_first: pj_code,
                        codeLength: 3,
                        standard_column: 'reserved_varchar7'
                    },
                    success: function (result, request) {
                        var result = result.responseText;
                        target.setValue(result);
                    },// endofsuccess
                    failure: extjsUtil.failureMessage
                });// endofajax
            }

        });

        this.createPoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '수주등록',
            tooltip: '수주등록',
            handler: function () {
                gm.me().addPoWindow();
            }
        });

        this.createPoEditAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            disabled: true,
            text: '수주작성',
            tooltip: '수주작성',
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                console_logs('>>>>>> rec', rec);
                gm.me().addPoEditWindow(rec, estimate_wb, estimate_ch, estimate_re, estimate_etc);
            }
        });


        this.copyCallback = function () {
            var target = gm.me().getInputJust('pj_code');
            var date = new Date();
            var fullYear = gUtil.getFullYear() + '';
            var month = gUtil.getMonth() + '';
            var day = date.getDate() + '';
            if (month.length == 1) {
                month = '0' + month;
            }
            if (day.length == 1) {
                day = '0' + day;
            }
            var pj_code = fullYear.substring(2, 4) + month + day + '-';
            // 마지막 수주번호 가져오기
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoWithStColumn',
                params: {
                    pj_first: pj_code,
                    codeLength: 3,
                    standard_column: 'reserved_varchar7'
                },
                success: function (result, request) {
                    var result = result.responseText;
                    target.setValue(result);
                },// endofsuccess
                failure: extjsUtil.failureMessage
            });// endofajax
        };
        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'EDIT', 'COPY', 'REMOVE'
            ],
        });

        this.createStore('Rfx.model.RecvPoHanjung', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/* pageSize */
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['assymap']
        );

        this.setRowClass(function (record, index) {
            // console_logs('record', record);
            var c = record.get('status');
            //            var is_stop_flag = record.get('reserved20');
            console_logs('c', c);
            switch (c) {
                case 'P0':
                    return 'yellow-row';
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

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);

        // 제작요청
        // this.completeAction = Ext.create('Ext.Action', {
        //     iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
        //     text: '제작요청',
        //     tooltip: '제작번호 생성 및 제작요청',
        //     disabled: true,
        //     handler: function () {
        //         var selection = gm.me().grid.getSelectionModel().getSelection();
        //         var rec = selection[0];
        //         var reserved_number1 = rec.get('reserved_number1');
        //         var reserved_timestamp1 = rec.get('reserved_timestamp1');
        //         if (reserved_number1 == 0 || reserved_number1 == -1) {
        //             if (reserved_timestamp1 == null) {
        //                 Ext.MessageBox.alert('알림', '입고일이 지정되지 않았습니다.');

        //             } else {
        //                 Ext.MessageBox.show({
        //                     title: '알림',
        //                     msg: '차대번호가 입력되지 않았습니다.<br>제작요청을 계속 진행하시겠습니까?',
        //                     buttons: Ext.MessageBox.YESNO,
        //                     fn: function (result) {
        //                         if (result == 'yes') {
        //                             gm.me().doRequestProduce();
        //                         }
        //                     },
        //                     icon: Ext.MessageBox.QUESTION
        //                 });
        //             }
        //         } else if (reserved_timestamp1 == null || reserved_timestamp1.length < 0) {
        //             Ext.MessageBox.alert('알림', '입고일이 지정되지 않았습니다.');
        //         } else {
        //             gm.me().doRequestProduce();
        //         }
        //     }
        // });

        this.completeAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '제작요청',
            tooltip: '제작번호 생성 및 제작요청',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                var reserved_varchari = rec.get('reserved_varchari');
                var reserved_timestamp1 = rec.get('reserved_timestamp1');
                if (reserved_varchari == null || reserved_varchari.length < 0) {
                    Ext.MessageBox.show({
                        title: '알림',
                        msg: '차대번호가 입력되지 않았습니다.<br>제작요청을 계속 진행하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (result) {
                            if (result == 'yes') {
                                gm.me().prwinrequest();
                            }
                        },
                        icon: Ext.MessageBox.QUESTION
                    });
                } else {
                    gm.me().prwinrequest();
                }
            }
        });

        this.completeAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '수주등록 취소',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                gm.me().canclePjAndRecountHumanPlan(rec);
            }
        });

        // 버튼 추가.
        buttonToolbar.insert(1, this.createPoAction);
        buttonToolbar.insert(2, this.createPoEditAction);
        buttonToolbar.insert(3, this.completeAction);
        buttonToolbar.insert(4, this.reviewCancleAction);
        buttonToolbar.insert(5, this.reviewAction);
        buttonToolbar.insert(5, '-');

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            gUtil.enable(gm.me().createPoEditAction);
            if (selections.length) {
                estimate_wb = 0;
                estimate_re = 0;
                estimate_ch = 0;
                estimate_ch = 0;
                console_logs('selections.length', selections.length);
                var rec = selections[0];
                var status = rec.get('status');
                gm.me().vSELECTED_ASSYMAP_UID = rec.get('unique_uid');
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                switch (status) {
                    case 'BM':
                        gUtil.enable(gm.me().completeAction);
                        gUtil.enable(gm.me().removeAction);
                        gUtil.disable(gm.me().modifyAction);
                        break;
                }

                gm.me().estiContentStore.getProxy().setExtraParam('pj_uid', gm.me().vSELECTED_AC_UID);
                gm.me().estiContentStore.load(function (record) {
                    gm.me().estiContentRecords = record;
                })

                gm.me().wthContentStore.getProxy().setExtraParam('pj_uid', gm.me().vSELECTED_AC_UID);
                gm.me().wthContentStore.getProxy().setExtraParam('type', 'ETC');
                gm.me().wthContentStore.load(function (record) {
                    console_logs('record >>>> ', record);
                    objs = [];
                    gm.me().wthContentRecords = record;
                    var obj = {};
                    console_logs('>>>> wthContentRecords ', gm.me().wthContentRecords);
                    var recc = gm.me().wthContentRecords;
                    var columns = [];
                    if (recc != null) {
                        for (var i = 0; i < recc.length; i++) {
                            var sel = recc[i];
                            var objv = {};
                            var wth_uid = sel.get('unique_id');
                            var etc_date = sel.get('requestDateStr');
                            var etc_items = sel.get('description');
                            var etc_price = sel.get('price');
                            objv['wth_uid'] = wth_uid;
                            objv['etc_date'] = etc_date;
                            objv['etc_items'] = etc_items;
                            objv['etc_price'] = etc_price;
                            columns.push(objv);
                        }
                        console_logs('>>>objv', columns);
                        obj['datas'] = columns;
                        objs.push(obj);
                        console_logs('>>>> objs >>>>> ', objs);
                    }
                })
            } else {
                gUtil.disable(gm.me().completeAction);
            }
        });

        // 건설사 적용하기
        this.addCallback('GET_CONST_CODE', function (o, cur, prev) {
            var reserved_number2 = gm.me().getInputJust('project|reserved_number2');
            var reserved_varchara = gm.me().getInputJust('project|reserved_varchara');
            reserved_varchara.setValue(reserved_number2.rawValue);
        });

        // 건설사 적용하기
        this.addCallback('SRCH_REAL_ITEM_CODE', function (o, cur, prev) {
            var reserved_varchari = gm.me().getInputJust('project|reserved_varchari');
            var old_item_code = gm.me().getInputJust('srcahd|old_item_code');
            if (reserved_varchari.getValue().length > 8) {
                var store = Ext.create('Rfx2.store.company.kbtech.ProductSubStore', {});
                store.getProxy().setExtraParam('item_name', '%' + reserved_varchari.getValue() + '%');
                store.load(function (record) {
                    if (record.length > 0) {
                        old_item_code.setValue(record[0].get('old_item_code'));
                    }
                });
            }
        });

        // 수주금액 계산 + 생산요청량 계산
        this.addCallback('CAL_PRICE', function (o, cur, prev) {
            var crudMode = gm.me().crudMode;
            var quan = gm.me().getInputJust('project|quan');
            var bm_quan = gm.me().getInputJust('project|bm_quan');
            var sales_price = gm.me().getInputJust('assymap|sales_price');
            var selling_price = gm.me().getInputJust('project|selling_price');
            var _quan = quan.getValue();
            var _sales_price = sales_price.getValue();
            selling_price.setValue(Math.ceil(_quan * _sales_price));
            var stock_qty_useful = gm.me().getInputJust('|stock_qty_useful');
            var bm_quan = gm.me().getInputJust('assymap|bm_quan');
            if (crudMode == 'EDIT') {
                var selection = gm.me().grid.getSelectionModel().getSelection()[0];
                var rec_bm_quan = selection.get('bm_quan');
                var rec_quan = selection.get('quan');
                var totalQty = (quan.getValue() - rec_quan) + rec_bm_quan;
                bm_quan.setValue(totalQty);
            } else {
                var totalQty = quan.getValue() - stock_qty_useful.getValue();
                if (totalQty < 0) {
                    totalQty = 0;
                }
                bm_quan.setValue(totalQty);
            }
        });

        // 수주금액 계산 + 생산요청량 계산
        this.addCallback('ADD_PO', function (o, cur, prev) {
            var combine_no = gm.me().getInputJust('|combine_no');
            var sales_price = gm.me().getInputJust('project|reserved_varchar7');
            sales_price.setValue(combine_no.getValue());
        });

        //검색
        this.addCallback('SRCH_ITEMCODE', function (o) {
            var sp_code = gm.me().getInputJust('srcahd|sp_code').getValue();
            var srcadt_varchars = [];
            for (var i = 1; i <= 27; i++) {
                srcadt_varchars.push(gm.me().getInputJust('srcadt|srcadt_varchar' + i).getValue());
            }
            var sales_price = gm.me().getInputJust('assymap|sales_price');
            var selling_price = gm.me().getInputJust('project|selling_price');
            var srch_store = gu.getCmp('SRO5_KB1_SRCH_CODE');
            srch_store.store.getProxy().setExtraParams({});
            srch_store.clearValue();
            srch_store.store.removeAll();
            srch_store.store.getProxy().setExtraParam('sp_code', sp_code);
            var start = 0;
            var end = 0;
            switch (sp_code) {
                case 'KC':
                    start = 1;
                    end = 7;
                    break;
                case 'KB':
                    start = 9;
                    end = 16;
                    break;
                case 'KL':
                    start = 17;
                    end = 27;
                    break;
            }
            for (var i = start; i <= end; i++) {
                srch_store.store.getProxy().setExtraParam('srcadt_varchar' + i, srcadt_varchars[i - 1]);
            }
            srch_store.store.load(function (records) {
            });
        });
        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });
        this.callParent(arguments);
        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('having_not_status', 'CR,I,N,P,R,S,W,Y,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'NP');
        this.store.load();
        this.loadStoreAlways = true;
    },

    addPoWindow: function () {
        gm.me().gridIds = [];
        var pjTypeStore = Ext.create('Ext.data.Store', {
            fields: ['pj_type', 'pj_type_kr'],
            data: [
                {"pj_type": "WB", "pj_type_kr": "윙타입"},
                {"pj_type": "OB", "pj_type_kr": "원바디타입"},
                {"pj_type": "CT", "pj_type_kr": "컨테이너타입"},
                {"pj_type": "CG", "pj_type_kr": "카고타입"},
                {"pj_type": "RT", "pj_type_kr": "냉동내장타입"},
                {"pj_type": "ETC", "pj_type_kr": "기타"}
            ]
        });

        var ijPatternStoreAdd = Ext.create('Ext.data.Store', {
            fields: ['injung_code', 'injung_kr'],
            data: [
                {"injung_code": "CONTI", "injung_kr": "계속"},
                {"injung_code": "FIRST", "injung_kr": "최초"},
            ]
        });

        var poForm = Ext.create('Ext.form.Panel', {
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
                title: '기본정보',
                items: [{
                    xtype: 'fieldset',
                    frame: true,
                    title: '기본정보',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [
                        {
                            layout: {
                                type: 'column',
                                align: 'left'
                            },
                            items: [
                                {
                                    id: gu.id('pj_code'),
                                    xtype: 'textfield',
                                    fieldLabel: '수주번호',
                                    width: '41.5%',
                                    margin: '0 3 0 0',
                                    allowBlank: false,
                                    name: 'reserved_varcharh'
                                },
                                {
                                    xtype: 'button',
                                    //width: 97,
                                    text: '신규생성',
                                    listeners: {
                                        click: function () {
                                            var target = gu.getCmp('pj_code');
                                            var date = new Date();
                                            var fullYear = gUtil.getFullYear() + '';
                                            var month = gUtil.getMonth() + '';
                                            var day = date.getDate() + '';
                                            if (month.length == 1) {
                                                month = '0' + month;
                                            }
                                            if (day.length == 1) {
                                                day = '0' + day;
                                            }
                                            var pj_code = fullYear.substring(2, 4) + month + day + '-';
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoWithStColumn',
                                                params: {
                                                    pj_first: pj_code,
                                                    codeLength: 3,
                                                    standard_column: 'reserved_varcharh'
                                                },
                                                success: function (result, request) {
                                                    var result = result.responseText;
                                                    target.setValue(result);
                                                },
                                                failure: extjsUtil.failureMessage
                                            });
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '지입사',
                            allowBlank: true,
                            name: 'reserved_varchar1'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '고객명',
                            allowBlank: true,
                            name: 'reserved_varchar2'
                        },
                        {
                            fieldLabel: '제작유형',
                            xtype: 'combo',
                            name: 'pj_type',
                            mode: 'local',
                            displayField: 'pj_type_kr',
                            store: pjTypeStore,
                            sortInfo: {field: 'pj_name', direction: 'DESC'},
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
                        },
                        {
                            fieldLabel: '제작명',
                            xtype: 'textfield',
                            allowBlank: false,
                            name: 'pj_name'
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '차량제조사',
                            allowBlank: false,
                            displayField: 'code_name_kr',
                            valueField: 'system_code',
                            store: Ext.create('Rfx2.store.company.hanjung.PoCarMakerStore', {}),
                            sortInfo: {field: 'specification', direction: 'ASC'},
                            name: 'reserved_varchar4'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '차대번호',
                            name: 'reserved_varchari'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '차종',
                            allowBlank: false,
                            name: 'reserved_varchar3'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '톤',
                            allowBlank: true,
                            name: 'h_reserved8'
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '영업사원',
                            allowBlank: false,
                            displayField: 'user_name',
                            valueField: 'unique_id',
                            store: Ext.create('Mplm.store.UserSalerStore', {}),
                            name: 'pm_uid'
                        },
                        {
                            xtype: 'datefield',
                            fieldLabel: '입고일',
                            name: 'reserved_timestamp1'
                        },
                        {
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            fieldLabel: '적재함',
                            mode: 'local',
                            id: gu.id('jukjaecombo-SRO5_HJ1'),
                            editable: true,
                            queryMode: 'remote',
                            displayField: 'code_name_kr',
                            valueField: 'code_name_kr',
                            store: Ext.create('Rfx2.store.company.hanjung.JukjaeFlagStore', {}),
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            name: 'reserved_varchar5',
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                }
                            }
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '가변축종류',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            id: gu.id('shaftcombo-SRO5_HJ1'),
                            editable: true,
                            queryMode: 'remote',
                            displayField: 'code_name_kr',
                            valueField: 'code_name_kr',
                            store: Ext.create('Rfx2.store.company.hanjung.VariableShaftTypeStore', {}),
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            name: 'h_reserved7',
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '비고',
                            name: 'reserved32'
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '차량가격',
                            name: 'h_reserved11'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '주민번호',
                            placeholder: 'xxxxxx-xxxxxxx',
                            inputMask: '999999-9999999',
                            name: 'h_reserved12'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '타이어',
                            name: 'h_reserved18'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '휠',
                            name: 'h_reserved19'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '그외',
                            name: 'h_reserved20'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '검사용적재함<br>길이',
                            name: 'trunk_length',
                            id: gu.id('trunk_length'),
                            name: 'reserved_varchar6',
                        },

                    ]
                },
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '견적가',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            xtype: 'numberfield',
                            fieldLabel: '윙바디',
                            id: gu.id('estPrice_option1_add'),
                            name: 'reserved_doublea'

                        }, {
                            xtype: 'numberfield',
                            fieldLabel: '축',
                            id: gu.id('estPrice_option2_add'),
                            name: 'reserved_doublec'
                        }, {
                            xtype: 'numberfield',
                            fieldLabel: '컨테이너',
                            id: gu.id('estPrice_option3_add'),
                            name: 'reserved_doublef'
                        }, {
                            xtype: 'numberfield',
                            fieldLabel: '냉동기',
                            id: gu.id('estPrice_option4_add'),
                            name: 'reserved_doubleb'
                        },
                            {
                                xtype: 'numberfield',
                                fieldLabel: '추가옵션',
                                id: gu.id('estPrice_option5_add'),
                                name: 'reserved_doublee'
                            }, {
                                xtype: 'numberfield',
                                fieldLabel: '기타사항',
                                id: gu.id('estPrice_option6_add'),
                                name: 'reserved_doubled'
                            },
                            {
                                xtype: 'fieldcontainer',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '5 5 5 5'
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        width: 110,
                                        name: 'h_reserved31',
                                        emptyText: '추가금액 사양명1'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: gu.id('estPrice_option7_add'),
                                        width: 315,
                                        name: 'reserved33'
                                    }
                                ]

                            },
                            {
                                xtype: 'fieldcontainer',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '5 5 5 5'
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        width: 110,
                                        name: 'h_reserved32',
                                        emptyText: '추가금액 사양명2'
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: gu.id('estPrice_option8_add'),
                                        width: 250,
                                        name: 'reserved34',
                                        listeners: {
                                            specialkey: function (f, e) {
                                                if (e.getKey() == e.ENTER) {
                                                    var target = gu.getCmp('estPrice_field');
                                                    var est1 = gu.getCmp('estPrice_option1').getValue();
                                                    var est2 = gu.getCmp('estPrice_option2').getValue();
                                                    var est3 = gu.getCmp('estPrice_option3').getValue();
                                                    var est4 = gu.getCmp('estPrice_option4').getValue();
                                                    var est5 = gu.getCmp('estPrice_option5').getValue();
                                                    var est6 = gu.getCmp('estPrice_option6').getValue();
                                                    var est7 = gu.getCmp('estPrice_option7').getValue();
                                                    var est8 = gu.getCmp('estPrice_option8').getValue();
                                                    var total_estPrice = est1 + est2 + est3 + est4 + est5 + est6 + est7 + est8;
                                                    var tax = total_estPrice * 0.1;
                                                    target.setValue(total_estPrice + tax);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        text: '견적가 계산',
                                        listeners: {
                                            click: function () {
                                                var target = gu.getCmp('estPrice_field_add');
                                                var est1 = gu.getCmp('estPrice_option1_add').getValue();
                                                var est2 = gu.getCmp('estPrice_option2_add').getValue();
                                                var est3 = gu.getCmp('estPrice_option3_add').getValue();
                                                var est4 = gu.getCmp('estPrice_option4_add').getValue();
                                                var est5 = gu.getCmp('estPrice_option5_add').getValue();
                                                var est6 = gu.getCmp('estPrice_option6_add').getValue();
                                                var est7 = gu.getCmp('estPrice_option7_add').getValue();
                                                var est8 = gu.getCmp('estPrice_option8_add').getValue();

                                                var total_estPrice = est1 + est2 + est3 + est4 + est5 + est6 + est7 + est8;
                                                var tax = total_estPrice * 0.1;
                                                target.setValue(total_estPrice + tax);
                                            }
                                        }
                                    }
                                ]

                            }


                            // {
                            //     xtype: 'numberfield',
                            //     fieldLabel: '비고3',
                            //     id: gu.id('estPrice_option7_add'),
                            //     name: 'reserved33'
                            // },
                            // {
                            //     layout: {
                            //         type: 'column',
                            //         align: 'left'
                            //     },
                            //     items: [
                            //         {
                            //             xtype: 'numberfield',
                            //             fieldLabel: '비고4',
                            //             width: '39.5%',
                            //             margin: '0 3 0 0',
                            //             allowBlank: false,
                            //             name: 'reserved34',
                            //             id: gu.id('estPrice_option8_add'),
                            //             listeners: {
                            //                 specialkey: function (f, e) {
                            //                     if (e.getKey() == e.ENTER) {
                            //                         var target = gu.getCmp('estPrice_field_add');
                            //                         var est1 = gu.getCmp('estPrice_option1_add').getValue();
                            //                         var est2 = gu.getCmp('estPrice_option2_add').getValue();
                            //                         var est3 = gu.getCmp('estPrice_option3_add').getValue();
                            //                         var est4 = gu.getCmp('estPrice_option4_add').getValue();
                            //                         var est5 = gu.getCmp('estPrice_option5_add').getValue();
                            //                         var est6 = gu.getCmp('estPrice_option6_add').getValue();
                            //                         var est7 = gu.getCmp('estPrice_option7_add').getValue();
                            //                         var est8 = gu.getCmp('estPrice_option8_add').getValue();
                            //                         var total_estPrice = est1 + est2 + est3 + est4 + est5 + est6 + est7 + est8;
                            //                         var tax = total_estPrice * 0.1;
                            //                         target.setValue(total_estPrice + tax);
                            //                     }
                            //                 }
                            //             }
                            //         },
                            //         {
                            //             xtype: 'button',
                            //             text: '견적가 계산',
                            //             listeners: {
                            //                 click: function () {
                            //                     var target = gu.getCmp('estPrice_field_add');
                            //                     var est1 = gu.getCmp('estPrice_option1_add').getValue();
                            //                     var est2 = gu.getCmp('estPrice_option2_add').getValue();
                            //                     var est3 = gu.getCmp('estPrice_option3_add').getValue();
                            //                     var est4 = gu.getCmp('estPrice_option4_add').getValue();
                            //                     var est5 = gu.getCmp('estPrice_option5_add').getValue();
                            //                     var est6 = gu.getCmp('estPrice_option6_add').getValue();
                            //                     var est7 = gu.getCmp('estPrice_option7_add').getValue();
                            //                     var est8 = gu.getCmp('estPrice_option8_add').getValue();
                            //                     var total_estPrice = est1 + est2 + est3 + est4 + est5 + est6 + est7 + est8;
                            //                     var tax = total_estPrice * 0.1;
                            //                     target.setValue(total_estPrice + tax);
                            //                 }
                            //             }
                            //         }
                            // ]
                            // }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '견적가 합',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            xtype: 'numberfield',
                            fieldLabel: '견적가 합<br>(부가세포함)',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('estPrice_field_add'),
                            name: 'h_reserved4',
                            editable: false,
                        }]
                    },
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '실견적',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            xtype: 'numberfield',
                            fieldLabel: '축견적',
                            id: gu.id('real_option1_add'),
                            name: 'assy_reserved_double1'
                        }, {
                            xtype: 'numberfield',
                            fieldLabel: '윙바디견적',
                            id: gu.id('real_option2_add'),
                            name: 'reserved35'
                        },
                            {
                                xtype: 'numberfield',
                                fieldLabel: '그외견적',
                                width: '35.5%',
                                allowBlank: false,
                                name: 'assy_reserved_double2',
                                id: gu.id('real_option3_add'),
                                listeners: {
                                    specialkey: function (f, e) {
                                        if (e.getKey() == e.ENTER) {
                                            var target = gu.getCmp('realPrice_field_add');
                                            var real1 = gu.getCmp('real_option1_add').getValue();
                                            var real2 = gu.getCmp('real_option2_add').getValue();
                                            var real3 = gu.getCmp('real_option3_add').getValue();
                                            var total_rPrice = real1 + real2 + real3;
                                            var tax = total_rPrice * 0.1
                                            var rP = total_rPrice + tax;
                                            target.setValue(rP);
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                text: '실견적/차액금 계산',
                                width: '15%',
                                listeners: {
                                    click: function () {
                                        var target = gu.getCmp('realPrice_field_add');
                                        var real1 = gu.getCmp('real_option1_add').getValue();
                                        var real2 = gu.getCmp('real_option2_add').getValue();
                                        var real3 = gu.getCmp('real_option3_add').getValue();
                                        var total_rPrice = (real1 + real2 + real3) + ((real1 + real2 + real3) * 0.1);

                                        target.setValue(total_rPrice);
                                        var target2 = gu.getCmp('diffPrice_add');
                                        var estP = gu.getCmp('estPrice_field_add').getValue();
                                        var realP = total_rPrice;
                                        var diffPrice = estP - realP;
                                        target2.setValue(diffPrice);
                                    }
                                }
                            },
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '실견적 합',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            xtype: 'numberfield',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('realPrice_field_add'),
                            fieldLabel: '실견적 합<br>(부가세 포함)',
                            editable: false,
                            name: 'h_reserved5'
                        }]
                    },
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '차액금(UP)',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            fieldStyle: 'background-color: #fa879c; background-image: none;',
                            xtype: 'numberfield',
                            fieldLabel: '가격',
                            id: gu.id('diffPrice_add'),
                            name: 'h_reserved6'
                        }]
                    },
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '검사종류',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [
                            {
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                mode: 'local',
                                fieldLabel: '인증',
                                id: gu.id('injungcombo-SRO5_HJ1_ADD'),
                                editable: true,
                                queryMode: 'remote',
                                displayField: 'code_name_kr',
                                valueField: 'system_code',
                                store: Ext.create('Rfx2.store.company.hanjung.AssignFlagStore', {}),
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                // value: rec.get('assignStatus'),
                                name: 'reserved_varchar7',
                                listConfig: {
                                    loadingText: '검색 중...',
                                    emptyText: '검색 결과가 없습니다.',
                                    // Custom rendering template for each item
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                    }
                                },
                            },
                            {
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                mode: 'local',
                                fieldLabel: '구변여부',
                                id: gu.id('gubuyncombo-SRO5_HJ1_ADD'),
                                editable: true,

                                queryMode: 'remote',
                                displayField: 'code_name_kr',
                                valueField: 'code_name_kr',
                                store: Ext.create('Rfx2.store.company.hanjung.GubyunFlagStore', {}),
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                name: 'reserved_varchar9',
                                listConfig: {
                                    loadingText: '검색 중...',
                                    emptyText: '검색 결과가 없습니다.',
                                    // Custom rendering template for each item
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                    }
                                },
                            },
                            {
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                mode: 'local',
                                fieldLabel: '유형',
                                editable: true,
                                queryMode: 'remote',
                                displayField: 'injung_kr',
                                valueField: 'injung_code',
                                store: ijPatternStoreAdd,
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                name: 'reserved_varchar8',
                                listConfig: {
                                    loadingText: '검색 중...',
                                    emptyText: '검색 결과가 없습니다.',
                                    // Custom rendering template for each item
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{injung_code}">{injung_kr} </font></div>';
                                    }
                                },
                            },
                            {
                                xtype: 'datefield',
                                fieldLabel: '구변날짜',
                                name: 'reserved_timestamp2',
                            },
                            {
                                xtype: 'datefield',
                                fieldLabel: '인증날짜',
                                name: 'h_reserved16',

                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '비고',
                                name: 'h_reserved17',
                            }
                        ]
                    }]
            }, {
                title: '연락처 정보',
                items: [{
                    xtype: 'fieldset',
                    frame: true,
                    title: '고객 연락처',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '고객 1 정보',
                        name: 'reserved_varchara'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '고객 2 정보',
                        name: 'reserved_varcharb'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '팩스번호',
                        name: 'h_reserved10'
                    }]
                },
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '연락처(회사)',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: '휴대폰번호',
                            name: 'hp_no'

                        }, {
                            xtype: 'textfield',
                            fieldLabel: '전화번호',
                            name: 'tel_no'

                        }, {
                            xtype: 'textfield',
                            fieldLabel: '팩스번호',
                            name: 'fax_no'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '비고',
                            name: 'h_reserved33'
                        }]
                    }, {
                        xtype: 'fieldset',
                        frame: true,
                        title: '캐피탈',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: '캐피탈 명',
                            name: 'capital_corp_name'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '휴대폰번호',
                            name: 'capital_hp_no'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '전화번호',
                            name: 'capital_tel_no'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '팩스번호',
                            name: 'capital_fax_no'
                        }]
                    }]
            },

                {
                    title: '영업정보',
                    items: [{
                        xtype: 'fieldset',
                        frame: true,
                        title: '영업사원 명 선택',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [
                            {
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                mode: 'local',
                                id: gu.id('companycombo-SRO5_HJ1_SALE'),
                                editable: true,
                                fieldLabel: '성명',
                                queryMode: 'remote',
                                displayField: 'president_name',
                                valueField: 'unique_id',
                                store: Ext.create('Mplm.store.ComCstSalerStore', {}),
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                minChars: 1,
                                typeAhead: false,
                                hideLabel: false,
                                hideTrigger: false,
                                name: 'pl_uid',
                                listConfig: {
                                    loadingText: '검색 중...',
                                    emptyText: '검색 결과가 없습니다.',
                                    // Custom rendering template for each item
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{president_name}">{president_name} </font></div>';
                                    }
                                },
                                pageSize: 25,
                                triggerAction: 'all',
                                listeners: {
                                    beforeload: function () {
                                        gu.getCmp('companycombo-SRO5_HJ1_SALE').store.getProxy().setExtraParam('president_name',
                                            '%' + gu.getCmp('companycombo-SRO5_HJ1_SALE').getValue() + '%');
                                    },
                                }
                            }
                            // {
                            //     xtype: 'textfield',
                            //     fieldLabel: '휴대폰번호',
                            //     name: 'reserved2',
                            // }, {
                            //     xtype: 'textfield',
                            //     fieldLabel: '계좌번호',
                            //     name: 'h_reserved13',
                            // }, {
                            //     xtype: 'textfield',
                            //     fieldLabel: 'FAX',
                            //     name: 'h_reserved14',
                            // }, {
                            //     xtype: 'textfield',
                            //     fieldLabel: '주민번호',
                            //     name: 'h_reserved15'
                            // }

                        ]
                    }]
                },
                {
                    title: '출고정보',
                    items: [{
                        xtype: 'fieldset',
                        frame: true,
                        title: '기본',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            xtype: 'datefield',
                            fieldLabel: '출고요청일',
                            name: 'delivery_plan'
                        }, {
                            xtype: 'datefield',
                            fieldLabel: '출고일자',
                            name: 'delivery_date',

                        }, {
                            xtype: 'textfield',
                            fieldLabel: '주소',
                            name: 'reserved3',
                        }]
                    }]
                },
                {
                    title: '기타',
                    items: [
                        {
                            xtype: 'fieldset',
                            frame: true,
                            title: '등록서류',
                            width: '100%',
                            height: '100%',
                            layout: 'column',
                            defaults: {
                                width: '49%',
                                margin: '2 2 2 2'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: '번호판',
                                    name: 'reserved4', // 새로 입력

                                },
                                {
                                    xtype: 'datefield',
                                    fieldLabel: '일자',
                                    name: 'reserved_timestamp3', // 새로 입력

                                },
                                {
                                    fieldLabel: '등록서류',
                                    xtype: 'textfield',
                                    name: 'reserved5', // 새로 입력

                                }, {
                                    xtype: 'datefield',
                                    fieldLabel: '일자',
                                    name: 'reserved_timestamp4', // 새로 입력

                                }, {
                                    xtype: 'textfield',
                                    fieldLabel: '비고',
                                    name: 'reserved6', // 새로 입력

                                }, {
                                    xtype: 'datefield',
                                    fieldLabel: '일자',
                                    name: 'reserved_timestamp5', // 새로 입력
                                }]
                        },
                        {
                            xtype: 'fieldset',
                            frame: true,
                            width: '100%',
                            height: '100%',
                            layout: 'column',
                            defaults: {
                                width: '49%',
                                margin: '2 2 2 2'
                            },
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: '특이사항 1',
                                name: 'reserved29'
                            },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: '특이사항 2',
                                    name: 'reserved30'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: '특이사항 3',
                                    name: 'reserved31'
                                }]
                        }]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수주등록',
            width: 950,
            height: 700,
            plain: true,
            items: poForm,
            overflowY: 'scroll',
            buttons: [{
                text: '수주등록',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                    } else {
                        if (poForm.isValid()) {
                            var val = poForm.getValues(false);
                            poForm.submit({
                                url: CONTEXT_PATH + '/sales/buyer.do?method=addRecvPo',
                                waitMsg: '등록 중 입니다.',
                                params: {},
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
                                        Ext.MessageBox.alert(error_msg_prompt, '수주등록 실패! 같은 증상이 반복되면 시스템 관리자에게 문의하세요.');
                                        // prWin.close();
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

    addPoEditWindow: function (rec, estimate_wb, estimate_ch, estimate_re, estimate_etc) {
        gm.me().gridIds = [];

        var ijPatternStore = Ext.create('Ext.data.Store', {
            fields: ['injung_code', 'injung_kr'],
            data: [
                {"injung_code": "CONTI", "injung_kr": "계속"},
                {"injung_code": "FIRST", "injung_kr": "최초"},
            ]
        });

        var blackboxSelStore = Ext.create('Ext.data.Store', {
            fields: ['blackbox_code', 'blackbox_sel'],
            data: [
                {"blackbox_code": "1", "blackbox_sel": "1"},
                {"blackbox_code": "2", "blackbox_sel": "2"},
                {"blackbox_code": "3", "blackbox_sel": "3"}
            ]
        });

        var naviSelStore = Ext.create('Ext.data.Store', {
            fields: ['navi_code', 'navi_sel'],
            data: [
                {"navi_code": "CARGO", "navi_sel": "화물용"},
                {"navi_code": "NORMAL", "navi_sel": "일반용"},
            ]
        });


        var etc_grid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('etc_grid'),
            collapsible: false,
            multiSelect: false,
            width: 900,
            autoScroll: true,
            margin: '0 0 20 0',
            autoHeight: true,
            frame: false,
            border: true,
            layout: 'fit',
            forceFit: true,
            columns: [
                {
                    text: '날짜',
                    width: '30%',
                    dataIndex: 'etc_date',
                    style: 'text-align:center',
                    format: 'Y-m-d',
                    submitFormat: 'Y-m-d',
                    editor: new Ext.form.DateField({
                        disabled: false,
                        format: 'Y-m-d'
                    }),
                    sortable: false,
                    renderer: function (field) {
                        if (field === '0000-00-00') {
                            return null;
                        } else {
                            var formated = Ext.util.Format.date(field, 'Y-m-d');
                            return formated;
                        }
                    }
                },
                {
                    text: '출고지',
                    width: '70%',
                    dataIndex: 'etc_items',
                    editor: 'textfield',
                    sortable: false
                },
                {
                    text: '가격',
                    width: '50%',
                    dataIndex: 'etc_price',
                    editor: 'numberfield',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'etc_price') {
                            context.record.set('etc_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    sortable: false
                }
            ],
            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            listeners: {
                beforeedit: function (editor, context, eOpts) {
                    if (context.field == 'etc_date') {
                        context.record.set('etc_date', '');
                    }
                    if (context.field == 'etc_items') {
                        context.record.set('etc_items', '');
                    }
                    if (context.field == 'etc_price') {
                        context.record.set('etc_price', '');
                    }

                }
            },
            autoScroll: true,
            dockedItems: [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        '->',
                        {
                            text: '+',
                            listeners: [{
                                click: function () {
                                    var store = gu.getCmp('etc_grid').getStore();
                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'wth_uid': -1,
                                        'etc_date': '',
                                        'etc_items': '',
                                        'etc_price': '0'
                                    }));
                                }
                            }]
                        },
                        {
                            text: '-',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                                    gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));
                                }
                            }]
                        }
                    ]
                })
            ]
        });

        var poEditForm = Ext.create('Ext.form.Panel', {
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
                msgTarget: 'side',
                labelWidth: 110
            },
            items: [{
                title: '기본 정보',
                items: [{
                    xtype: 'fieldset',
                    frame: true,
                    title: '기본정보',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '수주번호',
                        allowBlank: false,
                        value: rec.get('reserved_varcharh'),
                        name: 'reserved_varcharh',
                        editable: false,
                        fieldStyle: 'background-color: #ddd; background-image: none;'
                    },
                        {
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            id: gu.id('companycombo-SRO5_HJ1'),
                            editable: true,
                            fieldLabel: '지입사',
                            queryMode: 'remote',
                            displayField: 'company_name',
                            valueField: 'company_name',
                            store: Ext.create('Mplm.store.ComCstHjStore', {}),
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            value: rec.get('reserved_varchar1'),
                            minChars: 1,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false,
                            name: 'reserved_varchar1',
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{company_name}">{company_name} </font></div>';
                                }
                            },
                            pageSize: 25,
                            triggerAction: 'all',
                            listeners: {
                                beforeload: function () {
                                    gu.getCmp('companycombo-SRO5_HJ1').store.getProxy().setExtraParam('company_name',
                                        '%' + gu.getCmp('companycombo-SRO5_HJ1').getValue() + '%');
                                },
                            }
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '고객명',
                            allowBlank: false,
                            value: rec.get('reserved_varchar2'),
                            name: 'reserved_varchar2'
                        }, {
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            id: gu.id('carmakercombo-SRO5_HJ1'),
                            editable: true,
                            fieldLabel: '차량제조사',
                            queryMode: 'remote',
                            displayField: 'code_name_kr',
                            valueField: 'code_name_kr',
                            store: Ext.create('Rfx2.store.company.hanjung.PoCarMakerStore', {}),
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
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
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '차종',
                            allowBlank: false,
                            value: rec.get('reserved_varchar3'),
                            name: 'reserved_varchar3'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '톤',
                            allowBlank: true,
                            value: rec.get('h_reserved8'),
                            name: 'h_reserved8'
                        }, {
                            xtype: 'combo',
                            fieldLabel: '영업사원',
                            allowBlank: false,
                            displayField: 'user_name',
                            valueField: 'user_name',
                            store: Ext.create('Mplm.store.UserSalerStore', {}),
                            name: 'pm_name',
                            value: rec.get('pm_name'),
                        }, {
                            xtype: 'datefield',
                            fieldLabel: '입고일',
                            value: rec.get('reserved_timestamp1_str'),
                            name: 'reserved_timestamp1'
                        }, {
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            fieldLabel: '적재함',
                            mode: 'local',
                            id: gu.id('jukjaecombo-SRO5_HJ1'),
                            editable: true,
                            queryMode: 'remote',
                            displayField: 'code_name_kr',
                            valueField: 'code_name_kr',
                            store: Ext.create('Rfx2.store.company.hanjung.JukjaeFlagStore', {}),
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            value: rec.get('jukjaeStatus'),
                            name: 'reserved_varchar5',
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                }
                            }
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '검사용적재함 길이',
                            name: 'trunk_length',
                            id: gu.id('trunk_length'),
                            name: 'reserved_varchar6',
                            value: rec.get('reserved_varchar6')
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '차대번호',
                            value: rec.get('reserved_varchari'),
                            name: 'reserved_varchari'
                        }, {
                            xtype: 'combo',
                            fieldLabel: '가변축종류',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            id: gu.id('shaftcombo-SRO5_HJ1'),
                            editable: true,
                            queryMode: 'remote',
                            displayField: 'code_name_kr',
                            valueField: 'code_name_kr',
                            store: Ext.create('Rfx2.store.company.hanjung.VariableShaftTypeStore', {}),
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            value: rec.get('shaftType'),
                            name: 'h_reserved7',
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                }
                            }
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '비고',
                            value: rec.get('reserved32'),
                            name: 'reserved32'
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '차량가격',
                            value: rec.get('carTotalPrice'),
                            name: 'h_reserved11'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '주민번호',
                            placeholder: 'xxxxxx-xxxxxxx',
                            inputMask: '999999-9999999',
                            value: rec.get('h_reserved12'),
                            name: 'h_reserved12'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '타이어',
                            value: rec.get('h_reserved18'),
                            name: 'h_reserved18'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '휠',
                            value: rec.get('h_reserved19'),
                            name: 'h_reserved19'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '그외',
                            value: rec.get('h_reserved20'),
                            name: 'h_reserved20'
                        }]
                }, {
                    xtype: 'fieldset',
                    frame: true,
                    title: '견적가',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'numberfield',
                        fieldLabel: '윙바디',
                        value: rec.get('reserved_doublea'),
                        id: gu.id('estPrice_option1'),
                        name: 'reserved_doublea'

                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '축',
                        value: rec.get('reserved_doublec'),
                        id: gu.id('estPrice_option2'),
                        name: 'reserved_doublec'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '컨테이너',
                        value: rec.get('reserved_doublef'),
                        id: gu.id('estPrice_option3'),
                        name: 'reserved_doublef'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '냉동기',
                        value: rec.get('reserved_doubleb'),
                        id: gu.id('estPrice_option4'),
                        name: 'reserved_doubleb'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '추가옵션',
                        value: rec.get('reserved_doublee'),
                        id: gu.id('estPrice_option5'),
                        name: 'reserved_doublee'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '기타사항',
                        value: rec.get('reserved_doubled'),
                        id: gu.id('estPrice_option6'),
                        name: 'reserved_doubled'
                    }, {
                        xtype: 'fieldcontainer',
                        anchor: '100%',
                        width: '100%',
                        layout: 'hbox',
                        defaults: {
                            margin: '5 5 5 5'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                value: rec.get('h_reserved31'),
                                width: 110,
                                name: 'h_reserved31',
                                emptyText: '추가금액 사양명1'
                            },
                            {
                                xtype: 'numberfield',
                                value: rec.get('estiOptionTPrice'),
                                id: gu.id('estPrice_option7'),
                                width: 315,
                                name: 'reserved33'
                            }
                        ]

                    },
                        {
                            xtype: 'fieldcontainer',
                            anchor: '100%',
                            width: '100%',
                            layout: 'hbox',
                            defaults: {
                                margin: '5 5 5 5'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    value: rec.get('h_reserved32'),
                                    width: 110,
                                    name: 'h_reserved32',
                                    emptyText: '추가금액 사양명2'
                                },
                                {
                                    xtype: 'numberfield',
                                    value: rec.get('estiOptionFPrice'),
                                    id: gu.id('estPrice_option8'),
                                    width: 250,
                                    name: 'reserved34',
                                    listeners: {
                                        specialkey: function (f, e) {
                                            if (e.getKey() == e.ENTER) {
                                                var target = gu.getCmp('estPrice_field');
                                                var est1 = gu.getCmp('estPrice_option1').getValue();
                                                var est2 = gu.getCmp('estPrice_option2').getValue();
                                                var est3 = gu.getCmp('estPrice_option3').getValue();
                                                var est4 = gu.getCmp('estPrice_option4').getValue();
                                                var est5 = gu.getCmp('estPrice_option5').getValue();
                                                var est6 = gu.getCmp('estPrice_option6').getValue();
                                                var est7 = gu.getCmp('estPrice_option7').getValue();
                                                var est8 = gu.getCmp('estPrice_option8').getValue();
                                                var total_estPrice = est1 + est2 + est3 + est4 + est5 + est6 + est7 + est8;
                                                var tax = total_estPrice * 0.1;
                                                target.setValue(total_estPrice + tax);
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: '견적가 계산',
                                    listeners: {
                                        click: function () {
                                            var target = gu.getCmp('estPrice_field');
                                            var est1 = gu.getCmp('estPrice_option1').getValue();
                                            var est2 = gu.getCmp('estPrice_option2').getValue();
                                            var est3 = gu.getCmp('estPrice_option3').getValue();
                                            var est4 = gu.getCmp('estPrice_option4').getValue();
                                            var est5 = gu.getCmp('estPrice_option5').getValue();
                                            var est6 = gu.getCmp('estPrice_option6').getValue();
                                            var est7 = gu.getCmp('estPrice_option7').getValue();
                                            var est8 = gu.getCmp('estPrice_option8').getValue();
                                            var total_estPrice = est1 + est2 + est3 + est4 + est5 + est6 + est7 + est8;
                                            var tax = total_estPrice * 0.1;
                                            target.setValue(total_estPrice + tax);
                                        }
                                    }
                                }
                            ]

                        }
                    ]
                }, {
                    xtype: 'fieldset',
                    frame: true,
                    title: '견적가 합',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'numberfield',
                        fieldLabel: '견적가 합<br>(부가세포함)',
                        fieldStyle: 'background-color: #ddd; background-image: none;',
                        id: gu.id('estPrice_field'),
                        value: rec.get('preEstiPrice') == 0.0 ? rec.get('totalPrice') + rec.get('totalPrice') * 0.1 : rec.get('preEstiPrice'),
                        name: 'h_reserved4',
                        editable: false,
                    }]
                }, {
                    xtype: 'fieldset',
                    frame: true,
                    title: '실견적',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'numberfield',
                        fieldLabel: '축견적',
                        id: gu.id('real_option1'),
                        value: rec.get('assy_reserved_double1') == 0.0 ? rec.get('reserved_doublec') : rec.get('assy_reserved_double1'),
                        name: 'assy_reserved_double1'
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '윙바디견적',
                        id: gu.id('real_option2'),
                        value: rec.get('wbPrice') == 0.0 ? rec.get('reserved_doublea') : rec.get('wbPrice'),
                        name: 'reserved35'
                    },
                        {
                            xtype: 'numberfield',
                            fieldLabel: '그외견적',
                            width: '35.5%',
                            allowBlank: false,
                            name: 'assy_reserved_double2',
                            id: gu.id('real_option3'),
                            value: rec.get('assy_reserved_double2') == 0.0 ? rec.get('reserved_doublef') + rec.get('reserved_doubleb') + rec.get('reserved_doublee')
                                + rec.get('reserved_doubled') + rec.get('estiOptionTPrice') : rec.get('assy_reserved_double2'),
                            listeners: {
                                specialkey: function (f, e) {
                                    if (e.getKey() == e.ENTER) {
                                        var target = gu.getCmp('realPrice_field');
                                        var real1 = gu.getCmp('real_option1').getValue();
                                        var real2 = gu.getCmp('real_option2').getValue();
                                        var real3 = gu.getCmp('real_option3').getValue();
                                        var total_rPrice = real1 + real2 + real3;
                                        var tax = total_rPrice * 0.1
                                        var rP = total_rPrice + tax;
                                        target.setValue(rP);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: '실견적/차액금 계산',
                            width: '15%',
                            listeners: {
                                click: function () {
                                    var target = gu.getCmp('realPrice_field');
                                    var real1 = gu.getCmp('real_option1').getValue();
                                    var real2 = gu.getCmp('real_option2').getValue();
                                    var real3 = gu.getCmp('real_option3').getValue();
                                    var total_rPrice = (real1 + real2 + real3) + (real1 + real2 + real3) * 0.1;
                                    target.setValue(total_rPrice);

                                    var target2 = gu.getCmp('diffPrice');
                                    var estP = gu.getCmp('estPrice_field').getValue();
                                    console_logs('estP ?', estP);

                                    var realP = Math.round(total_rPrice);
                                    console_logs('realP ?', realP);
                                    var diffPrice = estP - realP;
                                    target2.setValue(diffPrice);
                                }
                            }
                        },
                    ]
                },
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '실견적 합',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            xtype: 'numberfield',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('realPrice_field'),
                            fieldLabel: '실견적 합<br>(부가세 포함)',
                            editable: false,
                            value: rec.get('estiPriceReal') == 0.0 ? rec.get('estiPrice') : rec.get('estiPriceReal'),
                            name: 'h_reserved5'
                        }]
                    },
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '차액금(UP)',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            fieldStyle: 'background-color: #fa879c; background-image: none;',
                            xtype: 'numberfield',
                            fieldLabel: '가격',
                            id: gu.id('diffPrice'),
                            value: rec.get('upTotalPrice'),
                            name: 'h_reserved6'
                        }]
                    },
                    {
                        xtype: 'fieldset',
                        frame: false,
                        title: '검사종류',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            xtype: 'combo',
                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            mode: 'local',
                            fieldLabel: '인증',
                            id: gu.id('injungcombo-SRO5_HJ1'),
                            editable: true,
                            queryMode: 'remote',
                            displayField: 'code_name_kr',
                            valueField: 'code_name_kr',
                            store: Ext.create('Rfx2.store.company.hanjung.AssignFlagStore', {}),
                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                            value: rec.get('assignStatus'),
                            name: 'reserved_varchar7',
                            listConfig: {
                                loadingText: '검색 중...',
                                emptyText: '검색 결과가 없습니다.',
                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                }
                            },
                        },
                            {
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                mode: 'local',
                                fieldLabel: '구변여부',
                                id: gu.id('gubuyncombo-SRO5_HJ1'),
                                editable: true,

                                queryMode: 'remote',
                                displayField: 'code_name_kr',
                                valueField: 'code_name_kr',
                                store: Ext.create('Rfx2.store.company.hanjung.GubyunFlagStore', {}),
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                value: rec.get('gubynStatus'),
                                name: 'reserved_varchar9',
                                listConfig: {
                                    loadingText: '검색 중...',
                                    emptyText: '검색 결과가 없습니다.',
                                    // Custom rendering template for each item
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                    }
                                },
                            },

                            {
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                mode: 'local',
                                fieldLabel: '유형',
                                id: gu.id('injungtypecombo-SRO5_HJ1'),
                                editable: true,
                                queryMode: 'remote',
                                displayField: 'injung_kr',
                                valueField: 'injung_code',
                                store: ijPatternStore,
                                value: rec.get('injungStatus'),
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                // value: rec.get('assignStatus'),
                                name: 'reserved_varchar8',
                                listConfig: {
                                    loadingText: '검색 중...',
                                    emptyText: '검색 결과가 없습니다.',
                                    // Custom rendering template for each item
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{injung_code}">{injung_kr} </font></div>';
                                    }
                                },
                            },
                            // 사용자 요청으로 인한 주석
                            // {
                            //     xtype: 'combo',
                            //     fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                            //     mode: 'local',
                            //     fieldLabel: '구변여부',
                            //     id: gu.id('gubuyncombo-SRO5_HJ1'),
                            //     editable: true,

                            //     queryMode: 'remote',
                            //     displayField: 'code_name_kr',
                            //     valueField: 'code_name_kr',
                            //     store: Ext.create('Rfx2.store.company.hanjung.GubyunFlagStore', {}),
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     value: rec.get('gubynStatus'),
                            //     name: 'reserved_varchar9',
                            //     listConfig: {
                            //         loadingText: '검색 중...',
                            //         emptyText: '검색 결과가 없습니다.',
                            //         // Custom rendering template for each item
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                            //         }
                            //     },
                            // },
                            {
                                xtype: 'datefield',
                                fieldLabel: '구변날짜',
                                name: 'reserved_timestamp2',
                                value: rec.get('reserved_timestamp2_str')
                            },
                            {
                                xtype: 'datefield',
                                fieldLabel: '인증날짜',
                                name: 'h_reserved16',
                                value: rec.get('h_reserved16')
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '비고',
                                name: 'h_reserved17',
                                value: rec.get('h_reserved17')
                            }]
                    }
                ]
            }, {
                title: '연락처 정보',
                items: [{
                    xtype: 'fieldset',
                    frame: true,
                    title: '고객 연락처',
                    width: '100%',
                    height: '100%',
                    layout: 'column',
                    defaults: {
                        width: '49%',
                        margin: '2 2 2 2'
                    },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '고객 1 정보',
                        name: 'reserved_varchara',
                        value: rec.get('reserved_varchara')
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '고객 2 정보',
                        name: 'reserved_varcharb',
                        value: rec.get('reserved_varcharb')
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '팩스번호',
                        name: 'h_reserved10',
                        value: rec.get('h_reserved10')
                    }]
                },
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: '연락처(회사)',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '휴대폰번호',
                                name: 'hp_no',
                                value: rec.get('corp_hp')
                            }, {
                                xtype: 'textfield',
                                fieldLabel: '전화번호',
                                name: 'tel_no',
                                value: rec.get('corp_tel')
                            }, {
                                xtype: 'textfield',
                                fieldLabel: '팩스번호',
                                name: 'fax_no',
                                value: rec.get('corp_fax')
                            }, {
                                xtype: 'textfield',
                                fieldLabel: '비고',
                                name: 'h_reserved33',
                                value: rec.get('h_reserved33')
                            }]
                    }, {
                        xtype: 'fieldset',
                        frame: true,
                        title: '캐피탈',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: '캐피탈 명',
                            name: 'capital_corp_name',
                            value: rec.get('capital_name')
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '휴대폰번호',
                            value: rec.get('capital_hp'),
                            name: 'capital_hp_no'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '전화번호',
                            value: rec.get('capital_tel'),
                            name: 'capital_tel_no'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '팩스번호',
                            name: 'capital_fax_no',
                            value: rec.get('capital_fax')
                        }]
                    }]
            },
                {
                    title: '영업정보',
                    items: [{
                        xtype: 'fieldset',
                        frame: true,
                        title: '기본',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [
                            {
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                mode: 'local',
                                id: gu.id('companycombo-SRO5_HJ1_SALE'),
                                editable: true,
                                fieldLabel: '성명',
                                queryMode: 'remote',
                                displayField: 'president_name',
                                valueField: 'president_name',
                                store: Ext.create('Mplm.store.ComCstSalerStore', {}),
                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                minChars: 1,
                                typeAhead: false,
                                hideLabel: false,
                                hideTrigger: false,
                                value: rec.get('delear_name'),
                                name: 'delear_name',
                                listConfig: {
                                    loadingText: '검색 중...',
                                    emptyText: '검색 결과가 없습니다.',
                                    // Custom rendering template for each item
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{president_name}">{president_name} </font></div>';
                                    }
                                },
                                pageSize: 25,
                                triggerAction: 'all',
                                listeners: {
                                    beforeload: function () {
                                        gu.getCmp('companycombo-SRO5_HJ1_SALE').store.getProxy().setExtraParam('president_name',
                                            '%' + gu.getCmp('companycombo-SRO5_HJ1_SALE').getValue() + '%');
                                    },
                                }
                            }
                            // {
                            //     xtype: 'textfield',
                            //     fieldLabel: '이름',
                            //     name: 'reserved1',
                            //     value: rec.get('reserved1')
                            // }, {
                            //     xtype: 'textfield',
                            //     fieldLabel: '휴대폰번호',
                            //     name: 'reserved2',
                            //     value: rec.get('reserved2')
                            // }, {
                            //     xtype: 'textfield',
                            //     fieldLabel: '계좌번호',
                            //     name: 'h_reserved13',
                            //     value: rec.get('h_reserved13'),
                            // }, {
                            //     xtype: 'textfield',
                            //     fieldLabel: 'FAX',
                            //     name: 'h_reserved14',
                            //     value: rec.get('h_reserved14'),
                            // }, {
                            //     xtype: 'textfield',
                            //     fieldLabel: '주민번호',
                            //     name: 'h_reserved15',
                            //     value: rec.get('h_reserved15'),
                            // }
                        ]
                    }]
                },
                {
                    title: '출고정보',
                    items: [{
                        xtype: 'fieldset',
                        frame: true,
                        title: '기본',
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [
                            {
                                xtype: 'datefield',
                                fieldLabel: '출고요청일',
                                name: 'delivery_plan',
                                value: rec.get('delivery_plan_str')
                            }, {
                                xtype: 'datefield',
                                fieldLabel: '출고일자',
                                name: 'delivery_date',
                                value: rec.get('delivery_date_str')
                            }, {
                                xtype: 'textfield',
                                fieldLabel: '주소',
                                name: 'reserved3',
                                value: rec.get('reserved3')
                            }]
                    }]
                },
                {
                    title: '기타',
                    items: [
                        {
                            xtype: 'fieldset',
                            frame: true,
                            title: '등록서류',
                            width: '100%',
                            height: '100%',
                            layout: 'column',
                            defaults: {
                                width: '49%',
                                margin: '2 2 2 2'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: '번호판',
                                    name: 'reserved4', // 새로 입력
                                    value: rec.get('reserved4')
                                },
                                {
                                    xtype: 'datefield',
                                    fieldLabel: '일자',
                                    name: 'reserved_timestamp3', // 새로 입력
                                    value: rec.get('reserved_timestamp3_str')
                                },
                                {
                                    fieldLabel: '등록서류',
                                    xtype: 'textfield',
                                    name: 'reserved5', // 새로 입력
                                    value: rec.get('reserved5')
                                }, {
                                    xtype: 'datefield',
                                    fieldLabel: '일자',
                                    name: 'reserved_timestamp4', // 새로 입력
                                    value: rec.get('reserved_timestamp4_str')
                                }, {
                                    xtype: 'textfield',
                                    fieldLabel: '비고',
                                    name: 'reserved6', // 새로 입력
                                    value: rec.get('reserved6')
                                }, {
                                    xtype: 'datefield',
                                    fieldLabel: '일자',
                                    name: 'reserved_timestamp5', // 새로 입력
                                    value: rec.get('reserved_timestamp5_str')
                                }]
                        },
                        {
                            xtype: 'fieldset',
                            frame: true,
                            title: '네비外',
                            width: '100%',
                            height: '100%',
                            layout: 'column',
                            defaults: {
                                width: '33%',
                                margin: '2 2 2 2'
                            },
                            items: [{
                                items: [{
                                    xtype: 'fieldcontainer',
                                    fieldLabel: '1.네비',
                                    anchor: '100%',
                                    width: '100%',
                                    layout: 'hbox',
                                    defaults: {
                                        margin: '2 2 2 2'
                                    },
                                    items: [
                                        {
                                            xtype: 'combo',
                                            store: naviSelStore,
                                            name: 'h_reserved9',
                                            value: rec.get('naviUsingType'),
                                            displayField: 'navi_sel',
                                            valueField: 'navi_code',
                                            allowBlank: true,
                                            width: 150,
                                            innerTpl: "<div>[{navi_code}] {navi_sel}</div>",
                                            emptyText: '용도'
                                        },
                                        {
                                            xtype: 'combo',
                                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                            mode: 'local',
                                            editable: true,
                                            queryMode: 'remote',
                                            displayField: 'code_name_kr',
                                            valueField: 'code_name_kr',
                                            store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                                            value: rec.get('firstSelectStatus'),
                                            name: 'reserved7',
                                            width: 150,
                                            listConfig: {
                                                loadingText: '검색 중...',
                                                emptyText: '검색 결과가 없습니다.',
                                                // Custom rendering template for each item
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                                }
                                            },
                                            emptyText: '담당'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'reserved8',
                                            id: gu.id('rev6'),
                                            value: rec.get('naviPrice'),
                                            width: 150,
                                            emptyText: '가격'
                                        },
                                        {
                                            xtype: 'datefield',
                                            name: 'reserved_timestamp6',
                                            width: 150,
                                            value: rec.get('reserved_timestamp6_str'),
                                            emptyText: '설치일자'
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'h_reserved21',
                                            width: 150,
                                            value: rec.get('h_reserved21'),
                                            emptyText: '업체명'
                                        }
                                    ],
                                }]

                            }, {
                                items: [{
                                    xtype: 'fieldcontainer',
                                    fieldLabel: '2.후방',
                                    anchor: '100%',
                                    width: '100%',
                                    layout: 'hbox',
                                    defaults: {
                                        margin: '2 2 2 2'
                                    },
                                    items: [
                                        {
                                            xtype: 'combo',
                                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                            mode: 'local',
                                            editable: true,
                                            queryMode: 'remote',
                                            displayField: 'code_name_kr',
                                            valueField: 'code_name_kr',
                                            store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                                            value: rec.get('secondSelectStatus'),
                                            name: 'reserved10',
                                            width: 150,
                                            listConfig: {
                                                loadingText: '검색 중...',
                                                emptyText: '검색 결과가 없습니다.',
                                                // Custom rendering template for each item
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                                }
                                            },
                                            emptyText: '담당'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'reserved11',
                                            id: gu.id('rev7'),
                                            width: 150,
                                            value: rec.get('backcamPrice'),
                                            emptyText: '가격'
                                        }, {
                                            xtype: 'datefield',
                                            name: 'reserved_timestamp7',
                                            width: 150,
                                            value: rec.get('reserved_timestamp7_str'),
                                            emptyText: '설치일자'
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'h_reserved22',
                                            width: 150,
                                            value: rec.get('h_reserved22'),
                                            emptyText: '업체명'
                                        }
                                    ]
                                }]
                            }, {
                                items: [{
                                    xtype: 'fieldcontainer',
                                    fieldLabel: '3.블랙박스',
                                    anchor: '100%',
                                    width: '100%',
                                    layout: 'hbox',
                                    defaults: {
                                        margin: '2 2 2 2'
                                    },
                                    columnWidth: 1,
                                    default: {
                                        flex: 1
                                    },
                                    items: [
                                        {
                                            xtype: 'combo',
                                            multiSelect: true,
                                            store: blackboxSelStore,
                                            name: 'reserved12',
                                            value: rec.get('reserved12'),
                                            displayField: 'blackbox_sel',
                                            valueField: 'blackbox_code',
                                            allowBlank: true,
                                            width: 150,
                                            innerTpl: "<div>[{blackbox_code}] {blackbox_sel}</div>",
                                            emptyText: '1,2,3'
                                        },
                                        {
                                            xtype: 'combo',
                                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                            mode: 'local',
                                            editable: true,
                                            queryMode: 'remote',
                                            displayField: 'code_name_kr',
                                            valueField: 'code_name_kr',
                                            store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                                            value: rec.get('thirdSelectStatus'),
                                            name: 'reserved13',
                                            width: 150,
                                            listConfig: {
                                                loadingText: '검색 중...',
                                                emptyText: '검색 결과가 없습니다.',
                                                // Custom rendering template for each item
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                                }
                                            },
                                            emptyText: '담당'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'reserved14',
                                            width: 150,
                                            value: rec.get('bboxPrice'),
                                            emptyText: '가격'
                                        },
                                        {
                                            xtype: 'datefield',
                                            name: 'reserved_timestampa',
                                            width: 150,
                                            value: rec.get('reserved_timestampa_str'),
                                            emptyText: '설치일자'
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'h_reserved23',
                                            width: 150,
                                            value: rec.get('h_reserved23'),
                                            emptyText: '업체명'
                                        }
                                    ]
                                }]
                            }, {
                                items: [
                                    {
                                        xtype: 'fieldcontainer',
                                        fieldLabel: '4.썬팅',
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
                                                xtype: 'combo',
                                                fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                                mode: 'local',
                                                editable: true,
                                                queryMode: 'remote',
                                                displayField: 'code_name_kr',
                                                valueField: 'code_name_kr',
                                                store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                                name: 'reserved15',
                                                value: rec.get('forthSelectStatus'),
                                                width: 150,
                                                listConfig: {
                                                    loadingText: '검색 중...',
                                                    emptyText: '검색 결과가 없습니다.',
                                                    // Custom rendering template for each item
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                                    }
                                                },
                                                emptyText: '담당'
                                            },
                                            {
                                                xtype: 'numberfield',
                                                name: 'reserved16',
                                                width: 150,
                                                value: rec.get('suntingPrice'),
                                                emptyText: '가격'
                                            },
                                            {
                                                xtype: 'datefield',
                                                name: 'reserved_timestampb',
                                                width: 150,
                                                value: rec.get('reserved_timestampb_str'),
                                                emptyText: '설치일자'
                                            },
                                            {
                                                xtype: 'textfield',
                                                name: 'h_reserved24',
                                                width: 150,
                                                value: rec.get('h_reserved24'),
                                                emptyText: '업체명'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'fieldcontainer',
                                        fieldLabel: '5.띠',
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
                                                xtype: 'combo',
                                                fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                                mode: 'local',
                                                editable: true,
                                                queryMode: 'remote',
                                                displayField: 'code_name_kr',
                                                valueField: 'code_name_kr',
                                                store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                                value: rec.get('fifthSelectStatus'),
                                                name: 'reserved17',
                                                width: 150,
                                                listConfig: {
                                                    loadingText: '검색 중...',
                                                    emptyText: '검색 결과가 없습니다.',
                                                    // Custom rendering template for each item
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                                    }
                                                },
                                                emptyText: '담당'
                                            },
                                            {
                                                xtype: 'numberfield',
                                                name: 'reserved18',
                                                width: 150,
                                                value: rec.get('beltPrice'),
                                                emptyText: '가격'
                                            },
                                            {
                                                xtype: 'datefield',
                                                name: 'reserved_timestampc',
                                                width: 150,
                                                value: rec.get('reserved_timestampc_str'),
                                                emptyText: '설치일자',
                                            },
                                            {
                                                xtype: 'textfield',
                                                name: 'h_reserved25',
                                                width: 150,
                                                value: rec.get('h_reserved25'),
                                                emptyText: '업체명'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'fieldcontainer',
                                        fieldLabel: '6.썬바이저',
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
                                                xtype: 'combo',
                                                fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                                mode: 'local',
                                                editable: true,
                                                queryMode: 'remote',
                                                displayField: 'code_name_kr',
                                                valueField: 'code_name_kr',
                                                store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                                sortInfo: {field: 'unique_id', direction: 'ASC'},
                                                value: rec.get('sixthSelectStatus'),
                                                name: 'reserved19',
                                                width: 150,
                                                listConfig: {
                                                    loadingText: '검색 중...',
                                                    emptyText: '검색 결과가 없습니다.',
                                                    // Custom rendering template for each item
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                                    }
                                                },
                                                emptyText: '담당'
                                            },
                                            {
                                                xtype: 'numberfield',
                                                name: 'reserved20',
                                                width: 150,
                                                value: rec.get('sunvisorPrice'),
                                                emptyText: '가격'
                                            },
                                            {
                                                xtype: 'datefield',
                                                name: 'reserved_timestampd',
                                                width: 150,
                                                value: rec.get('reserved_timestampd_str'),
                                                emptyText: '설치일자'
                                            },
                                            {
                                                xtype: 'textfield',
                                                name: 'h_reserved26',
                                                width: 150,
                                                value: rec.get('h_reserved26'),
                                                emptyText: '업체명'
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                items: [{
                                    xtype: 'fieldcontainer',
                                    fieldLabel: '7.배선',
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
                                            xtype: 'combo',
                                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                            mode: 'local',
                                            editable: true,
                                            queryMode: 'remote',
                                            displayField: 'code_name_kr',
                                            valueField: 'code_name_kr',
                                            store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                                            value: rec.get('seventhSelectStatus'),
                                            width: 150,
                                            name: 'reserved21',
                                            listConfig: {
                                                loadingText: '검색 중...',
                                                emptyText: '검색 결과가 없습니다.',
                                                // Custom rendering template for each item
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                                }
                                            },
                                            emptyText: '담당'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'reserved22',
                                            width: 150,
                                            value: rec.get('routePrice'),
                                            emptyText: '가격'
                                        }, {
                                            xtype: 'datefield',
                                            name: 'reserved_timestampe',
                                            width: 150,
                                            value: rec.get('reserved_timestampe_str'),
                                            emptyText: '설치일자'
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'h_reserved27',
                                            width: 150,
                                            value: rec.get('h_reserved27'),
                                            emptyText: '업체명'
                                        }
                                    ]
                                }]

                            }, {
                                items: [{
                                    xtype: 'fieldcontainer',
                                    fieldLabel: '8.모니터',
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
                                            xtype: 'combo',
                                            fieldStyle: 'background-color: #FFFFFF; background-image: none;',
                                            mode: 'local',
                                            editable: true,
                                            queryMode: 'remote',
                                            displayField: 'code_name_kr',
                                            valueField: 'code_name_kr',
                                            store: Ext.create('Rfx2.store.company.hanjung.OptionFlagStore', {}),
                                            sortInfo: {field: 'unique_id', direction: 'ASC'},
                                            value: rec.get('eightSelectStatus'),
                                            name: 'reserved23',
                                            width: 150,
                                            listConfig: {
                                                loadingText: '검색 중...',
                                                emptyText: '검색 결과가 없습니다.',
                                                // Custom rendering template for each item
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{code_name_kr}">{code_name_kr} </font></div>';
                                                }
                                            },
                                            emptyText: '담당'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'reserved24',
                                            width: 150,
                                            value: rec.get('monPrice'),
                                            emptyText: '가격'
                                        }, {
                                            xtype: 'datefield',
                                            name: 'reserved_timestampf',
                                            width: 150,
                                            value: rec.get('reserved_timestampf_str'),
                                            emptyText: '설치일자'
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'h_reserved28',
                                            width: 150,
                                            value: rec.get('h_reserved28'),
                                            emptyText: '업체명'
                                        }
                                    ]
                                }]
                            }, {
                                items: [{
                                    xtype: 'fieldcontainer',
                                    fieldLabel: '9.기타 1',
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
                                            xtype: 'textfield',
                                            name: 'reserved25',
                                            width: 150,
                                            value: rec.get('reserved25')
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'reserved26',
                                            width: 150,
                                            value: rec.get('etcPrice')
                                        }, {
                                            xtype: 'datefield',
                                            name: 'assy_reserved_timestamp1',
                                            width: 150,
                                            value: rec.get('assymap_timestamp1_str')
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'h_reserved29',
                                            width: 150,
                                            value: rec.get('h_reserved29')
                                        }
                                    ]
                                }]
                            }, {
                                items: [{
                                    xtype: 'fieldcontainer',
                                    fieldLabel: '10.기타 2',
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
                                            xtype: 'textfield',
                                            name: 'reserved27',
                                            width: 150,
                                            value: rec.get('reserved27')
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'reserved28',
                                            width: 150,
                                            value: rec.get('etcSPrice')
                                        }, {
                                            xtype: 'datefield',
                                            name: 'assy_reserved_timestamp2',
                                            width: 150,
                                            value: rec.get('assymap_timestamp2_str')
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'h_reserved30',
                                            width: 150,
                                            value: rec.get('h_reserved30')
                                        }
                                    ]
                                }]
                            }

                            ]
                        }]
                },
                {
                    title: '탁송외 비용',
                    items: [
                        {
                            xtype: 'fieldset',
                            frame: true,
                            title: '',
                            width: '100%',
                            height: '100%',
                            layout: 'fit',
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items: [
                                etc_grid // json 파싱 wthdraw에 ETC 코드로 입력
                            ]
                        }]
                },
                {
                    title: '기타',
                    items: [{
                        xtype: 'fieldset',
                        frame: true,
                        width: '100%',
                        height: '100%',
                        layout: 'column',
                        defaults: {
                            width: '49%',
                            margin: '2 2 2 2'
                        },
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: '특이사항 1',
                            name: 'reserved29',
                            value: rec.get('reserved29')
                        },
                            {
                                xtype: 'textfield',
                                fieldLabel: '특이사항 2',
                                name: 'reserved30',
                                value: rec.get('reserved30')
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '특이사항 3',
                                name: 'reserved31',
                                value: rec.get('reserved31')
                            }]

                    }]
                }
            ]
        });

        if (gm.me().wthContentRecords != null) {
            for (var i = 0; i < gm.me().wthContentRecords.length; i++) {
                var recc = gm.me().wthContentRecords[i];
                var etc_price = recc.get('price');
                var unique_id = recc.get('unique_id_long');
                var etc_date = recc.get('requestDateStr');
                var etc_items = recc.get('description');
                var store = gu.getCmp('etc_grid').getStore();
                store.insert(store.getCount(), new Ext.data.Record({
                    'wth_uid': unique_id,
                    'etc_date': etc_date,
                    'etc_items': etc_items,
                    'etc_price': etc_price
                }));
            }
        }

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '수주작성',
            width: 950,
            height: 700,
            plain: true,
            items: poEditForm,
            overflowY: 'scroll',
            buttons: [{
                text: '수주작성',
                handler: function (btn) {
                    if (btn == 'no') {
                        prWin.close();
                        estimate_wb = 0;
                        estimate_ch = 0;
                        estimate_re = 0;
                        estimate_etc = 0;
                    } else {
                        if (poEditForm.isValid()) {
                            var val = poEditForm.getValues(false);

                            var project_uid = rec.get('ac_uid');
                            var srcahd_uid = rec.get('srcahd_uid');
                            var assymap_uid = rec.get('unique_uid');
                            var cap_unique_id = rec.get('reserved_numbera');
                            var comcst_uid = rec.get('comcst_uid');

                            var objs = [];
                            var columns = [];
                            var obj = {};
                            var store = gu.getCmp('etc_grid').getStore();
                            var cnt = store.getCount();
                            console_logs('cnt', cnt);
                            for (var i = 0; i < cnt; i++) {
                                var record = store.getAt(i);
                                var objv = {};
                                objv['pj_uid'] = rec.get('ac_uid');
                                objv['wth_uid'] = record.get('wth_uid');
                                if (typeof record.get('etc_date') === 'string') {
                                    objv['etc_date'] = record.get('etc_date');
                                    if (objv['etc_date'] === '0000-00-00') {
                                        objv['etc_date'] = '';
                                    }
                                } else {
                                    objv['etc_date'] = Ext.Date.format(record.get('etc_date'), 'Y-m-d');
                                }
                                objv['etc_items'] = record.get('etc_items');
                                objv['etc_price'] = record.get('etc_price');
                                columns.push(objv);
                            }
                            obj['datas'] = columns;
                            objs.push(obj);
                            var jsonData = Ext.util.JSON.encode(objs);
                            poEditForm.submit({
                                submitEmptyText: false,
                                url: CONTEXT_PATH + '/sales/buyer.do?method=updateRecvPo',
                                waitMsg: '작성 중 입니다.',
                                params: {
                                    project_uid: project_uid,
                                    srcahd_uid: srcahd_uid,
                                    assymap_uid: assymap_uid,
                                    comcst_uid: comcst_uid,
                                    cap_unique_id: cap_unique_id,
                                    jsonData: jsonData
                                },
                                success: function (val, action) {
                                    if (prWin) {
                                        prWin.close();
                                    }
                                    Ext.MessageBox.alert('확인', '작성 되었습니다.');
                                    gm.me().store.load();
                                    gm.me().wthContentStore.getProxy().setExtraParam('pj_uid', gm.me().vSELECTED_AC_UID);
                                    gm.me().wthContentStore.getProxy().setExtraParam('type', 'ETC');
                                    gm.me().wthContentStore.load(function (record) {
                                        console_logs('record >>>> ', record);
                                        objs = [];
                                        gm.me().wthContentRecords = record;
                                        var obj = {};
                                        console_logs('>>>> wthContentRecords ', gm.me().wthContentRecords);
                                        var recc = gm.me().wthContentRecords;
                                        var columns = [];
                                        if (recc != null) {
                                            for (var i = 0; i < recc.length; i++) {
                                                var sel = recc[i];
                                                var objv = {};
                                                var wth_uid = sel.get('unique_id');
                                                var etc_date = sel.get('requestDateStr');
                                                var etc_items = sel.get('description');
                                                var etc_price = sel.get('price');
                                                objv['wth_uid'] = wth_uid;
                                                objv['etc_date'] = etc_date;
                                                objv['etc_items'] = etc_items;
                                                objv['etc_price'] = etc_price;
                                                columns.push(objv);
                                            }
                                            console_logs('>>>objv', columns);
                                            obj['datas'] = columns;
                                            objs.push(obj);
                                            console_logs('>>>> objs >>>>> ', objs);
                                        }
                                    })
                                    // gm.me().wthContentRecords.load(function () {
                                    // });
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
                            Ext.MessageBox.alert('확인', '필수 입력항목이 입력되지 않았습니다.');
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
    //assymap STATUS 변경
    doRequest: function (status) {
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/production/schdule.do?method=updateAssyMapStatus',
            params: {
                assymap_uid: gm.me().vSELECTED_ASSYMAP_UID,
                status: status
            },
            success: function (result, request) {
                gm.me().store.load();
                //Ext.Msg.alert('안내', '요청하였습니다.', function() {});
            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax

    },

    //수주확정 제작번호 / CARTMAP 생성
    doRequestProduce: function () {
        var form = null;
        //var checkname = false;
        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                //labelWidth: 60,
                //margins: 10,
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        labelWidth: 50,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    id: 'lot_no',
                                    name: 'po_no',
                                    fieldLabel: '제작번호',
                                    margin: '0 5 0 0',
                                    width: 300,
                                    allowBlank: false,
                                    maxlength: '1',
                                    listeners: {
                                        change: function (sender, newValue, oldValue, opts) {
                                            gm.me().checkButtonClicked = false;
                                        }
                                    }
                                },
                                {
                                    id: 'AutoLotCreateButton',
                                    xtype: 'button',
                                    style: 'margin-left: 3px;',
                                    text: '자동생성',
                                    handler: function () {
                                        var lot_no = Ext.getCmp('lot_no');
                                        var target = gm.me().getInputTarget('pj_code');
                                        var date = new Date();
                                        var fullYear = gUtil.getFullYear() + '';
                                        var month = gUtil.getMonth() + '';
                                        var day = date.getDate() + '';
                                        if (month.length == 1) {
                                            month = '0' + month;
                                        }
                                        var pj_code = fullYear.substring(2, 4) + month + '-';
                                        // 마지막 수주번호 가져오기
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastlotnoMesHj',
                                            params: {
                                                pj_first: pj_code,
                                                codeLength: 3
                                            },
                                            success: function (result, request) {
                                                var result = result.responseText;
                                                lot_no.setValue(result);
                                                gm.me().checkButtonClicked = false;
                                            },// endofsuccess
                                            failure: extjsUtil.failureMessage
                                        });// endofajax
                                    }//endofhandler
                                },
                                {
                                    id: 'isDuplicatedButton',
                                    xtype: 'button',
                                    style: 'margin-left: 3px;',
                                    text: '중복확인',
                                    handler: function () {
                                        var lot_no = Ext.getCmp('lot_no').getValue();
                                        if (lot_no.length === 1) {
                                            Ext.Msg.alert('', '제작번호를 입력하시기 바랍니다.');
                                        } else {
                                            var projectStore = Ext.create('Rfx2.store.company.kbtech.ProjectStore', {});
                                            projectStore.getProxy().setExtraParam('reserved_varchari', lot_no);
                                            projectStore.load(function (record) {
                                                gm.me().checkButtonClicked = true;
                                                if (record.length > 0) {
                                                    Ext.Msg.alert('', '제작번호가 중복 되었습니다.');
                                                    gm.me().isDuplicated = true;
                                                } else {
                                                    Ext.Msg.alert('', '이용 가능한 제작번호입니다.');
                                                    gm.me().isDuplicated = false;
                                                }
                                            });
                                        }
                                    }//endofhandler
                                }
                            ]
                        },


                    ]
                }
            ]

        });//Panel end...
        myHeight = 120;
        myWidth = 450;
        prwin = gm.me().prwinrequest(form);
    },

    canclePjAndRecountHumanPlan: function (rec) {
        Ext.MessageBox.show({
            title: '수주 삭제',
            msg: '선택한 건의 수주등록을 취소하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn) {
                if (btn == "no") {
                    return;
                } else {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/sales/buyer.do?method=deleteProjectAndReCount',
                        params: {
                            assymap_uid: rec.get('unique_uid'),
                            project_uid: rec.get('ac_uid'),
                            srcahd_uid: rec.get('srcahd_uid'),
                            pm_uid: rec.get('pm_uid')
                        },
                        success: function (result, request) {
                            Ext.MessageBox.alert('알림', '해당 수주건의 등록이 취소 되었습니다.');
                            gm.me().store.load();
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                }
            }
        });
    },

    prwinrequest: function () {
        console_logs('>>>>> assymap_uid : ', gm.me().vSELECTED_ASSYMAP_UID);
        console_logs('>>>>> ac_uid : ', gm.me().vSELECTED_AC_UID);
        Ext.MessageBox.show({
            title: '제작요청',
            msg: '해당 수주를 제작 요청하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn) {
                if (btn == "no") {
                    return;
                } else {
                    var assymap_uid = gm.me().vSELECTED_ASSYMAP_UID;
                    var ac_uid = gm.me().vSELECTED_AC_UID;
                    var selections = gm.me().grid.getSelectionModel().getSelection();
                    var date = new Date();
                    var fullYear = gUtil.getFullYear() + '';
                    var month = gUtil.getMonth() + '';
                    var day = date.getDate() + '';
                    if (month.length == 1) {
                        month = '0' + month;
                    }
                    var pj_code = fullYear.substring(2, 4) + month + '-';
                    // Ext.MessageBox.setCenterLoading(true);
                    // prWin.setLoading(true);
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/index/process.do?method=addCartCopyPartHjSv',
                        params: {
                            pj_first: pj_code,
                            codeLength: 3,
                            ac_uid: ac_uid,
                            assymap_uid: assymap_uid,
                        },
                        success: function (result, request) {
                            // Ext.MessageBox.setCenterLoading(false);
                            Ext.MessageBox.alert('알림', '해당 수주가 제작요청 되었습니다.');
                            gm.me().store.load(function () {
                            });
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    });
                    //Ext.MessageBox.setCenterLoading(false);
                }
            }
        });
    },

    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var estimate_wb = 0;
        var estimate_ch = 0;
        var estimate_re = 0;
        var estimate_etc = 0;
        console_logs('>>>>>> rec', rec);
        gm.me().addPoEditWindow(rec, estimate_wb, estimate_ch, estimate_re, estimate_etc);
    },


});
