//수주등록 메뉴
Ext.define('Rfx2.view.company.kbtech.salesDelivery.RecvPoKbTechView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-po-kbtech-view',
    inputBuyer: null,
    isDuplicated: false,
    checkButtonClicked: false,
    initComponent: function () {
        this.setDefValue('regist_date', new Date());
        
        // 삭제할때 사용할 필드 이름.
        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // 검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField(
            {
                type: 'combo'
                , field_id: 'status'
                , store: "RecevedStateStore"
                , displayField: 'codeName'
                , valueField: 'systemCode'
                , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            });

        this.addSearchField('item_code');

        this.addSearchField(
            {
                type: 'combo'
                , field_id: 'pm_uid'
                , store: "UserDeptStore"
                , displayField: 'user_name'
                , valueField: 'unique_id'
                , value: vCUR_USER_UID
                , params: {dept_code: "D104"}
                , innerTpl: '<div data-qtip="{dept_name}">{user_name}</div>'
            });

        this.addFormWidget('상세입력', {
            tabTitle: "상세입력",
            id: gu.id('SRO5_KB1_SRCH_CODE'),
            xtype: 'combo',
            text: '품목코드',
            name: 'product_code',
            storeClass: 'Rfx2.store.company.kbtech.ExtendSrcahdStore',
            params: {srchNull: false},
            emptyText: '제품을 선택하세요.',
            displayField: "item_code",
            valueField: "item_name",
            innerTpl: '<div data-qtip="{item_name}">[{item_code}] - {item_name}</div>',
            buttonText: "검색",
            buttonKey: 'SRCH_ITEMCODE',
            supessTrigger: true,
            listeners: {
                select: function (combo, record) {
                    console_log('Selected Value : ' + combo.getValue());
                    console_logs('record : ', record);
                    var item_code = record.get('item_code');
                    var item_name = record.get('item_name');
                    var sales_price = record.get('sales_price');
                    var specification = record.get('specification');
                    var old_item_code = record.get('old_item_code');
                    var stock_qty_useful = record.get('stock_qty_useful');

                    var _item_code = gm.me().getInputJust('srcahd|item_code');
                    var _item_name = gm.me().getInputJust('srcahd|item_name');
                    var _nearest_price = gm.me().getInputJust('|nearest_price');
                    var _specification = gm.me().getInputJust('srcahd|specification');
                    var _stock_qty_useful = gm.me().getInputJust('|stock_qty_useful');

                    var _order_com_unique = gm.me().getInputJust('project|order_com_unique').value;

                    var srcahd_uid = record.get('unique_id_long');

                    // 최근 단가 가져오기 (0원인 단가는 제외)
                    if (_order_com_unique !== null) {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastProjectSalesPrice',
                            params: {
                                order_com_unique: _order_com_unique,
                                srcahd_uid: srcahd_uid
                            },
                            success: function (result, request) {
                                var result = result.responseText;
                                _nearest_price.setValue(result == null || result == 'null' ? 0 : result);
                            },// endofsuccess
                            failure: extjsUtil.failureMessage
                        });// endofajax
                    }

                    _item_code.setValue(item_code);
                    _item_name.setValue(item_name);
                    _specification.setValue(specification);
                    _stock_qty_useful.setValue(stock_qty_useful);

                    var quan = gm.me().getInputJust('project|quan');
                    var stock_qty_useful = gm.me().getInputJust('|stock_qty_useful');
                    var bm_quan = gm.me().getInputJust('assymap|bm_quan');

                    bm_quan.setValue(quan.getValue() - stock_qty_useful.getValue());
                }
            },
            canCreate: true,
            canEdit: true,
            canView: true,
            position: 'top'
        });
        // 수주번호 자동생성
        this.addCallback('AUTO_PJCODE', function (o) {
            if (this.crudMode == 'EDIT') { // EDIT

            } else {// CREATE,COPY

                var target = gm.me().getInputJust('project|reserved_varchar7');

                var date = new Date();
                var fullYear = gu.getFullYear() + '';
                var month = gu.getMonth() + '';
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


        this.copyCallback = function () {

            var target = gm.me().getInputJust('project|reserved_varchar7');

            var date = new Date();
            var fullYear = gu.getFullYear() + '';
            var month = gu.getMonth() + '';
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
            REMOVE_BUTTONS : [
                'REMOVE'
            ]
        });

        this.createStore('Rfx.model.RecvPoKbTech', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['assymap']
        );

        this.setRowClass(function (record, index) {

            var c = record.get('status');
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
                    break;
            }

        });

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);

        // 수주검토
        this.reviewAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '수주검토',
            tooltip: '수주검토',
            disabled: true,

            handler: function () {

                Ext.MessageBox.show({
                    title: '확인',
                    msg: '수주 검토를 완료하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            gm.me().reviewAction.disable();
                            gm.me().doRequest('P0');
                        }
                    },
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 반려
        this.reviewCancleAction = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            text: '검토취소',
            tooltip: '검토취소',
            disabled: true,

            handler: function () {

                Ext.MessageBox.show({
                    title: '확인',
                    msg: '수주를 검토 취소하시겠습니까?<br>확인 후 반려상태로 수주가 진행됩니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            gm.me().reviewCancleAction.disable();
                            gm.me().doRequest('DE');
                        }
                    },
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 수주확정
        this.completeAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_ORDER_CONFIRM','수주확정'),
            tooltip: 'Lot번호 생성 및 확정',
            disabled: true,
            handler: function () {

                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var unique_id = rec.get('srcahd_uid');

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahdWithBom&standard_flag=A',
                    params: {
                        unique_id: unique_id
                    },
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var datas = jsonData.datas;
                        var data = datas[0];
                        var srcadt_varchar40 = data.srcadt_varchar40;
                        var bm_quan = rec.get('bm_quan');     // 생산 요청량

                        if (srcadt_varchar40 === 'Y') {
                            Ext.Msg.alert('', '해당 제품의 BOM 리스트가 없어 수주확정을 할 수 없습니다.' +
                                '<br/>설계 부서에 문의하시기 바랍니다.');
                        } else if (bm_quan === 0) {
                            gm.me().doRequestProduce(false);
                        } else {
                            gm.me().doRequestProduce(true);
                        }

                    },// endofsuccess
                    failure: extjsUtil.failureMessage
                });// endofajax
            }
        });

        // 수주삭제
        this.removeProjectAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '수주삭제',
            disabled: true,
            handler: function () {

                Ext.MessageBox.show({
                    title: '삭제하기',
                    msg: '선택한 항목을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function () {
                        gm.setCenterLoading(true);

                        var selections = gm.me().grid.getSelectionModel().getSelection();
                        var assymapUids = [];
                        var projectUids = [];

                        for (var i = 0; i < selections.length; i++) {
                            assymapUids.push(selections[i].get('unique_uid'));
                            projectUids.push(selections[i].get('ac_uid'));
                        }

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/production/schdule.do?method=removeProject',
                            params: {
                                assymapUids: assymapUids,
                                projectUids: projectUids
                            },
                            success: function (result, request) {
                                gm.me().store.load();
                                gm.setCenterLoading(false);
                            },// endofsuccess
                            failure: function () {
                                gm.me().store.load();
                                gm.setCenterLoading(false);
                            }
                        });// endofajax
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // 버튼 추가.
        buttonToolbar.insert(4, this.removeProjectAction);
        buttonToolbar.insert(4, this.completeAction);
        buttonToolbar.insert(4, this.reviewCancleAction);
        buttonToolbar.insert(4, this.reviewAction);
        buttonToolbar.insert(4, '-');


        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (this.crudMode == 'EDIT') { // EDIT

            } else {// CREATE,COPY
                this.copyCallback();
            }

            gu.disable(gm.me().removeAction);
            gu.disable(gm.me().removeProjectAction);
            gu.disable(gm.me().modifyAction);

            if (selections.length) {
                console_logs('selections.length', selections.length);
                var rec = selections[0];
                var status = rec.get('status');

                gm.me().vSELECTED_ASSYMAP_UID = rec.get('unique_uid');
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');

                switch (status) {
                    case 'BM':
                        gu.enable(gm.me().removeAction);
                        gu.disable(gm.me().modifyAction);
                        gu.enable(gm.me().removeProjectAction);
                    case 'DE':
                        gu.enable(gm.me().reviewAction);
                        break;
                    case 'P0':
                        gu.enable(gm.me().completeAction);
                        gu.enable(gm.me().reviewCancleAction);
                        break;
                }
            } else {
                gu.disable(gm.me().reviewAction);
                gu.disable(gm.me().completeAction);
                gu.disable(gm.me().reviewCancleAction);
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
                    if (record.length > 0 && old_item_code !== null) {
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

            selling_price.setValue(/*Math.ceil(_quan * _sales_price)*/_quan * _sales_price);

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

            for (var i = 1; i <= 30; i++) {
                srcadt_varchars.push(gm.me().getInputJust('srcadt|srcadt_varchar' + i).getValue());
            }

            var sales_price = gm.me().getInputJust('assymap|sales_price');
            var selling_price = gm.me().getInputJust('project|selling_price');
            var item_name = gm.me().getInputJust('srcahd|item_name').getValue();
            var item_code = gm.me().getInputJust('srcahd|item_code').getValue();
            var specification = gm.me().getInputJust('srcahd|specification').getValue();
            var srch_store = gu.getCmp('SRO5_KB1_SRCH_CODE');

            srch_store.store.getProxy().setExtraParams({});
            srch_store.clearValue();
            srch_store.store.removeAll();

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
                    end = 30;
                    break;
                default:
                    break;
            }

            for (var i = start; i <= end; i++) {
                srch_store.store.getProxy().setExtraParam('srcadt_varchar' + i, srcadt_varchars[i - 1]);
            }

            if (sp_code === 'MT') {
                srch_store.store.getProxy().setExtraParam('item_name', '%' + item_name + '%');
                srch_store.store.getProxy().setExtraParam('item_code', '%' + item_code + '%');
                srch_store.store.getProxy().setExtraParam('specification', '%' + specification + '%');
                srch_store.store.getProxy().setExtraParam('not_sp_code_list', 'KB,KC,KL');
            } else {
                srch_store.store.getProxy().setExtraParam('sp_code', sp_code);
                srch_store.store.getProxy().setExtraParam('standard_flag', 'A');
            }

            srch_store.store.load(function (records) {
            });


        });
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        //추가 항목 탭
        gm.addTabGridPanel('추가항목', 'AMC3_SUB', {
                pageSize: 100,
                model: 'Rfx2.model.company.kbtech.AdditonalSalesPropSub',
                dockedItems: [
                ],
                sorters: [{
                    property: 'serial_no',
                    direction: 'ASC'
                }]
            }, function (selections) {
                if (selections.length) {
                    var rec = selections[0];
                    gm.me().selectPcsRecord = rec;
                } else {

                }
            },
            gu.id('additionalSalesPropGrid')//toolbar
        );

        this.callParent(arguments);


        // 디폴트 로딩
        gm.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.

        this.store.getProxy().setExtraParam('having_not_status', 'CR,I,N,P,R,S,W,Y,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');

        this.store.load(function (records) {
        });


    },
    deleteRequest: function() {
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/production/schdule.do?method=removeProject',
            params: {
                assymap_uid: gm.me().vSELECTED_ASSYMAP_UID
            },
            success: function (result, request) {
                gm.me().store.load();
                //Ext.Msg.alert('안내', '요청하였습니다.', function() {});
            },//endofsuccess

            failure: extjsUtil.failureMessage
        });//endofajax
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
    //수주확정 LOT_NO/CARTMAP 생성
    doRequestProduce: function (isProduce) {

        var produceText = '';

        if(isProduce) {
            produceText = '본 수주를 생산요청합니다.';
        } else {
            produceText = '본 수주는 생산요청량이 0이므로 생산요청을 하지 않습니다.';
        }

        var form = null;
        //var checkname = false;
        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '10 10 10 10',
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
                    xtype: 'label',
                    text: produceText
                },
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
                            fieldLabel: 'Lot 명',
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
                                    fieldLabel: 'LOT 명',
                                    margin: '0 5 0 0',
                                    width: 350,
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

                                        //자동생성 쿼리
                                        //프로젝트 코드 자동생성 비슷하게 만들면됨. 테이블은 project Lot_no 컬럼 reserved_varchar6
                                        var target = gm.me().getInputTarget('pj_code');
                                        var bmQuan = gm.me().grid.getSelectionModel().getSelection()[0].get('bm_quan');
                                        var spCode = gm.me().grid.getSelectionModel().getSelection()[0].get('sp_code');
                                        var date = new Date();
                                        var fullYear = gu.getFullYear() + '';
                                        var month = gu.getMonth() + '';
                                        var day = date.getDate() + '';
                                        var isStockPo = 'N';
                                        var isModulePo = 'N';

                                        if (month.length == 1) {
                                            month = '0' + month;
                                        }

                                        if (bmQuan === 0) {
                                            isStockPo = 'Y';
                                        }

                                        if (spCode === 'KL') {
                                            isModulePo = 'Y';
                                        }

                                        var pj_code = fullYear.substring(2, 4) + month + '-';

                                        // 마지막 수주번호 가져오기
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastlotnoMes',
                                            params: {
                                                pj_first: pj_code,
                                                codeLength: 3,
                                                isStockPo: isStockPo,
                                                isModulePo: isModulePo
                                            },
                                            success: function (result, request) {
                                                var result = result.responseText;
                                                if (isModulePo === 'Y') {
                                                    result = 'LED' + result;
                                                }
                                                if (isStockPo === 'Y') {
                                                    result = '재' + result;
                                                }
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
                                            Ext.Msg.alert('', 'LOT 번호를 입력하시기 바랍니다.');
                                        } else {
                                            var projectStore = Ext.create('Rfx2.store.company.kbtech.ProjectStore', {});
                                            projectStore.getProxy().setExtraParam('reserved_varchar6', lot_no);

                                            projectStore.load(function (record) {

                                                gm.me().checkButtonClicked = true;

                                                if (record.length > 0) {
                                                    Ext.Msg.alert('', 'LOT 번호가 중복 되었습니다.');
                                                    gm.me().isDuplicated = true;
                                                } else {
                                                    Ext.Msg.alert('', '이용 가능한 LOT 번호입니다.');
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
        myHeight = 150;
        myWidth = 440;

        prwin = gm.me().prwinrequest(form, isProduce);
    },

    prwinrequest: function (form, isProduce) {

        var methodName = 'addCartCopyPart';

        if(!isProduce) {
            methodName = 'addCartCopyPartNotProduce';
        }

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: 'LOT 명',
            width: myWidth,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (!gm.me().checkButtonClicked) {
                        Ext.Msg.alert('', '먼저 LOT 번호 중복 검사를 하시기 바랍니다.');
                    } else {
                        if (gm.me().isDuplicated) {
                            Ext.Msg.alert('', 'LOT 번호가 중복 되었습니다.');
                        } else {
                            Ext.MessageBox.show({
                                title: gm.getMC('CMD_ORDER_CONFIRM','수주확정'),
                                msg: 'LOT번호 : ' + Ext.getCmp('lot_no').getValue() + '의 <br> ' +
                                '수주를 확정하겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (result) {
                                    if (result == 'yes') {
                                        var form = gu.getCmp('formPanel').getForm();
                                        var assymap_uid = gm.me().vSELECTED_ASSYMAP_UID;
                                        var ac_uid = gm.me().vSELECTED_AC_UID;
                                        var selections = gm.me().grid.getSelectionModel().getSelection();

                                        prWin.setLoading(true);

                                        form.submit({
                                            url: CONTEXT_PATH + '/index/process.do?method=' + methodName,
                                            params: {
                                                ac_uid: ac_uid,
                                                assymap_uid: assymap_uid,
                                                lot_no: Ext.getCmp('lot_no').getValue()
                                            },
                                            success: function (val, action) {
                                                prWin.setLoading(false);
                                                prWin.close();
                                                gm.me().store.load(function () {
                                                });
                                            },
                                            failure: function (val, action) {
                                                prWin.setLoading(false);
                                                prWin.close();
                                            }
                                        });
                                    } else {
                                        prWin.close();
                                    }
                                },
                                // animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
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
    },

    //AbsBaseView Override
    fillEditForm: function(rec, crudMode) {

        var items = this.getFieldList();

        if (rec != null && crudMode != 'CREATE') {

            if(crudMode == 'COPY' || crudMode == 'EDIT') {
                var selections = gm.me().grid.getSelectionModel().getSelection();

                if (selections.length > 0) {
                    var apStore = gu.getCmp('additionalSalesPropGrid').getStore();
                    apStore.removeAll();
                    var description = gm.me().grid.getSelectionModel().getSelection()[0].get('description');
                    description = description.replace(/&quot;/gi, '"');

                    try {
                        var objs = Ext.JSON.decode(description);

                        for (var i = 0; i < objs.length; i++) {
                            var objv = objs[i];
                            apStore.insert(apStore.getCount(), new Ext.data.Record(objv));
                        }
                    } catch(e) {

                    }
                }
            }

            Ext.each(items, function(o, index) { //Editable

                var id = o['id'];
                var compName = o['name'];
                var xtype = o['xtype'];
                var arr = compName.split('|');

                if(arr.length>1) {
                    var name = arr[1];
                    if(arr.length==3) {
                        name =  name + '|' + arr[2];
                    }
                    var val = rec.get(name);

                    if(val!=null && typeof val == 'string') {
                        val = gUtil.stripHighlight(val);
                        val = gUtil.stripQuotRecover(val);
                    }

                    switch(xtype) {
                        case 'combo':
                            try {
                                var combo = Ext.getCmp(id);
                                console_logs('>>>>>> AbsView combo : ', combo);
                                if(combo!=null) {
                                    //console_logs('combo', combo);
                                    combo.setValue(val);

                                    var record = combo.findRecordByValue(val);

                                    if(record!=null) {
                                        combo.select(record);
                                        if(compName=='project|order_com_unique') {
                                            gm.me().inputBuyer = record;
                                        } else	if(compName=='partline|class_code') {
                                            gm.me().inputClassCode = record;
                                        }

                                    } else {
                                        combo.store.load(function(records) {
                                            if(records!=null) {
                                                for (var i=0; i<records.length; i++){
                                                    var obj = records[i];
                                                    try {
                                                        if(obj.get(combo.valueField)==val ) {
                                                            combo.select(obj);
                                                            if(compName=='project|order_com_unique') {
                                                                gm.me().inputBuyer = record;
                                                            }	if(compName=='partline|class_code') {
                                                                gm.me().inputClassCode = record;
                                                            }
                                                        }
                                                    } catch(e){}
                                                }
                                            }//endofif

                                        });
                                    }

                                }//endof if(combo!=null) {
                            } catch(e){console_logs('catch e', e)}
                            break;
                        case 'datefield':
                            var a = Ext.getCmp(id);
                            if(a!=null) {
                                console_logs('date val', val);
                                //2017-09-13 07:11:49.000
                                if(val!=null && val.length>9) {
                                    var parts = val.substring(0,10).split('-');
                                    console_logs('parts', parts);
                                    var mydate = new Date(parts[0],parts[1]-1,parts[2]);
                                    a.setValue(mydate);
                                } else {
                                    a.setValue(null);
                                }

                            }
                            break;
                        default:
                            var a = Ext.getCmp(id);
                            if(a!=null) {
                                a.setValue(val);
                            }
                    }

                    if(name=='unique_id') {
                        if(gm.me().crudMode =='EDIT') {
                            Ext.getCmp(id).setVisible(true);
                        } else {
                            Ext.getCmp(id).setVisible(false);
                        }
                    }

                    var target = Ext.getCmp(id);

                    if (gm.me().crudMode =='EDIT' && target != null) {

                        if (o['canEdit']==false || !target.editable) {
                            target.setFieldStyle('background-color: #FBF8E6; background-image: none;');
                            target.readOnly = true;
                        } else {
                            target.setFieldStyle('background-color: #FFFFFF; background-image: none;');
                            target.readOnly = false;
                        }
                    } else {

                        if (!target.editable) {
                            target.setFieldStyle('background-color: #FBF8E6; background-image: none;');
                            target.readOnly = true;
                        } else {
                            target.setFieldStyle('background-color: #FFFFFF; background-image: none;');
                            target.readOnly = false;
                        }
                    }
                }//endof if arr.length>1
            });
        } else {
            this.doReset();
            Ext.each(items, function(o, index) { //Editable
                var compName = o['name'];
                var id = o['id'];
                var arr = compName.split('|');
                if(arr.length>1) {
                    var name = arr[1];
                    if(name=='unique_id') {
                        Ext.getCmp(id).setVisible(false);
                    }
                }
            });
        }

    }
});
