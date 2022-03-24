//수주관리 메뉴
Ext.define('Rfx2.view.company.dsmaref.salesDelivery.RecvPoKbTechView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-po-kbtech-view',
    inputBuyer: null,
    isDuplicated: false,
    checkButtonClicked: false,
    initComponent: function () {
//    	this.callOverridden();
//    	this.callParent([]);
        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.
//    	this.setDeleteFieldName('unique_uid');

//    	var next7 = gUtil.getNextday(7);
//    	this.setDefValue('delivery_plan', next7);
//    	this.defOnlyCreate = true;
//    	this.setDefComboValue('pm_uid', 'valueField', -1); // Hidden

        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // this.setDefValue('pj_code', 'test');
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

//		this.addSearchField ({
//			type: 'dateRange',
//			field_id: 'regist_date',
//			text: gm.getMC('CMD_Order_Date', '등록일자'),
//			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
//			edate: new Date()
//		});
//
//		this.addSearchField (
//		{
//			type: 'combo'
//			,field_id: 'status'
//			,store: "RecevedStateStore"
//			,displayField: 'codeName'
//			,valueField: 'systemCode'
//			,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
//		});
//

        this.addFormWidget('상세입력', {
            tabTitle: "상세입력",
            id: gu.id('SRO5_KB1_SRCH_CODE'),
            xtype: 'combo',
            text: '품목코드',
            name: 'product_code',
            storeClass: 'Rfx2.store.company.kbtech.ProductStore',
            params: {srchNull: false},
            emptyText: '제품을 선택하세요.',
            displayField: "item_code",
            valueField: "item_name",
            innerTpl: '<div data-qtip="{item_name}">{item_code}</div>',
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
                    if(_order_com_unique !== null) {
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
//	    		console_logs('preCreateCallback', 'IN EDIT');
            } else {// CREATE,COPY
//	    		console_logs('수주번호 자동생성', 'success');

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
//						console_logs('마지막 수주번호 가져오기', 'success');
                        var result = result.responseText;
//						result = result.substring(0,6)+'-'+result.substring(6,9);
                        target.setValue(result);
                    },// endofsuccess
                    failure: extjsUtil.failureMessage
                });// endofajax

            }

        });


        this.copyCallback = function () {

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
//						console_logs('마지막 수주번호 가져오기', 'success');
                    var result = result.responseText;
//						result = result.substring(0,6)+'-'+result.substring(6,9);
                    target.setValue(result);
                },// endofsuccess
                failure: extjsUtil.failureMessage
            });// endofajax

        };
        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.RecvPoKbTech', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/* pageSize */
            // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
            // Orderby list key change
            // ordery create_date -> p.create로 변경.
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
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
                            gMain.selPanel.reviewAction.disable();
                            gMain.selPanel.doRequest('P0');
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
                            gMain.selPanel.reviewCancleAction.disable();
                            gMain.selPanel.doRequest('DE');
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

                gMain.selPanel.doRequestProduce();
            }
        });

        // 버튼 추가.
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

            gUtil.disable(gMain.selPanel.removeAction);
            gUtil.disable(gMain.selPanel.modifyAction);

            if (selections.length) {
                console_logs('selections.length', selections.length);
                var rec = selections[0];
                var status = rec.get('status');

                gm.me().vSELECTED_ASSYMAP_UID = rec.get('unique_uid');
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');

                switch (status) {
                    case 'BM':
                        gUtil.enable(gMain.selPanel.removeAction);
                        gUtil.disable(gMain.selPanel.modifyAction);
                    case 'DE':
                        gUtil.enable(gMain.selPanel.reviewAction);
                        break;
                    case 'P0':
                        gUtil.enable(gMain.selPanel.completeAction);
                        gUtil.enable(gMain.selPanel.reviewCancleAction);
                        break;
                }
            } else {
                gUtil.disable(gMain.selPanel.reviewAction);
                gUtil.disable(gMain.selPanel.completeAction);
                gUtil.disable(gMain.selPanel.reviewCancleAction);
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
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');

        this.store.load(function (records) {
        });


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
                gMain.selPanel.store.load();
                //Ext.Msg.alert('안내', '요청하였습니다.', function() {});
            },//endofsuccess

            failure: extjsUtil.failureMessage
        });//endofajax

    },
    //수주확정 LOT_NO/CARTMAP 생성
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
                                    width: 300,
                                    allowBlank: false,
//	                                   value : gMain.selPanel.lotname,
                                    maxlength: '1',
                                    listeners: {
                                        change: function(sender, newValue, oldValue, opts) {
                                            gm.me().checkButtonClicked = false;
                                        }
                                    }
//	                                   emptyText: '영문대문자와 숫자만 입력',
//	                                   validator: function(v) {
//	                                       if (/[^A-Z0-9_-]/g.test(v)) {
//	                                    	   v = v.replace(/[^A-Z0-9_-]/g,'');
//	                                       }
//	                                	  /* if(/^[ㄱ-ㅎ|가-힣\ ]/g.test(v)){
//	                                		   console_logs('입력 제한 >>>>', v);
//	                                		   v = v.replace(/^[ㄱ-ㅎ|가-힣\ ]/g,'');
//	                                	   }*/
//	                                       this.setValue(v);
//	                                       return true;
//	                                   }
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
                                        var target = gMain.selPanel.getInputTarget('pj_code');
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
                                            url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastlotnoMes',
                                            params: {
                                                pj_first: pj_code,
                                                codeLength: 3
                                            },
                                            success: function (result, request) {
//	                       						console_logs('마지막 수주번호 가져오기', 'success');
                                                var result = result.responseText;
//	                       						result = result.substring(0,6)+'-'+result.substring(6,9);
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

                                        if(lot_no.length === 1) {
                                            Ext.Msg.alert('', 'LOT 번호를 입력하시기 바랍니다.');
                                        } else {
                                            var projectStore = Ext.create('Rfx2.store.company.kbtech.ProjectStore', {});
                                            projectStore.getProxy().setExtraParam('reserved_varchar6', lot_no);

                                            projectStore.load(function(record) {

                                                gm.me().checkButtonClicked = true;

                                                if(record.length > 0) {
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
        myHeight = 120;
        myWidth = 390;


        prwin = gMain.selPanel.prwinrequest(form);


    },

    prwinrequest: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: 'LOT 명',
            width: myWidth,
            //height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if(!gm.me().checkButtonClicked) {
                        Ext.Msg.alert('', '먼저 LOT 번호 중복 검사를 하시기 바랍니다.');
                    } else {
                        if(gm.me().isDuplicated) {
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
                                        var assymap_uid = gMain.selPanel.vSELECTED_ASSYMAP_UID;
                                        var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                                        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                                        prWin.setLoading(true);

                                        form.submit({
                                            url: CONTEXT_PATH + '/index/process.do?method=addCartCopyPart',
                                            params: {
                                                ac_uid: ac_uid,
                                                assymap_uid: assymap_uid,
                                                lot_no: Ext.getCmp('lot_no').getValue()
                                            },
                                            success: function (val, action) {
                                                prWin.setLoading(false);
                                                prWin.close();
                                                gMain.selPanel.store.load(function () {
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
});
