//수주관리 메뉴
Ext.define('Hanaro.view.salesDelivery.RecvManageHanaroView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'recv-mgmt-kbtech-view',
    inputBuyer: null,
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
//    	this.addSearchField('item_code');

        // this.addSearchField(
        //     {
        //         type: 'combo'
        //         , field_id: 'status'
        //         , store: "RecevedStateStore"
        //         , displayField: 'codeName'
        //         , valueField: 'systemCode'
        //         , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        //     });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

        // this.addSearchField(
        //     {
        //         type: 'combo'
        //         , field_id: 'pm_uid'
        //         , store: "UserDeptStore"
        //         , displayField: 'user_name'
        //         , valueField: 'unique_id'
        //         , value: vCUR_USER_UID
        //         , params: {dept_code: "D104"}
        //         , innerTpl: '<div data-qtip="{dept_name}">{user_name}</div>'
        //     });
        this.addFormWidget('상세입력', {
            tabTitle: "상세입력",
            id: 'SRO5_KB1_SRCH_CODE',
            xtype: 'combo',
            text: '품목코드',
            name: 'product_code',
            storeClass: 'Rfx2.store.company.kbtech.ProductStore',
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
                    var specification = record.get('specification');
                    var old_item_code = record.get('old_item_code');
                    var stock_qty_useful = record.get('stock_qty_useful');

                    var _item_code = gm.me().getInputJust('srcahd|item_code');
                    var _item_name = gm.me().getInputJust('srcahd|item_name');
                    var _specification = gm.me().getInputJust('srcahd|specification');
                    var _old_item_code = gm.me().getInputJust('srcahd|old_item_code');
                    var _stock_qty_useful = gm.me().getInputJust('|stock_qty_useful');

                    _item_code.setValue(item_code);
                    _item_name.setValue(item_name);
                    _specification.setValue(specification);
                    _old_item_code.setValue(old_item_code);
                    _stock_qty_useful.setValue(stock_qty_useful);

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

                var target = gMain.selPanel.getInputTarget('pj_code');
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
                    url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMes',
                    params: {
                        pj_first: pj_code,
                        codeLength: 3
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

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.defaultOrderAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '주문미납현항',
            tooltip: '주문미납현항',
            disabled: false,
            handler: function () {

            }
        });

        this.createStore('Hanaro.model.RecvPoHanaro', [{
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
        this.store.getProxy().setExtraParam('is_new', 'N');

        this.setRowClass(function (record, index) {
            var c = record.get('status');
            switch (c) {
                case 'P0':
                    return 'yellow-row';
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

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //buttonToolbar.insert(1, this.defaultOrderAction);

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);

        // 수주검토
        this.reviewAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: CMD_CHECK_RPO,
            tooltip: '생산 및 구매 요청',
            disabled: true,

            handler: function () {

                Ext.MessageBox.show({
                    title: CMD_OK,
                    msg: '수주를 검토하시겠습니까?',
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
            text: CMD_CANCEL_RPO,
            tooltip: '반려',
            disabled: true,

            handler: function () {

                Ext.MessageBox.show({
                    title: CMD_OK,
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
            text: CMD_CONFIRM_RPO,
            tooltip: '생산 및 구매 요청',
            disabled: true,

            handler: function () {

                gMain.selPanel.doRequestProduce();
            }
        });

        // 버튼 추가.
//        buttonToolbar.insert(4, this.completeAction);
//        buttonToolbar.insert(4, this.reviewCancleAction);
//        buttonToolbar.insert(4, this.reviewAction);
//        buttonToolbar.insert(4, '-');


        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (this.crudMode == 'EDIT') { // EDIT

            } else {// CREATE,COPY
                this.copyCallback();

            }

            if (selections.length) {
                console_logs('selections.length', selections.length);
                var rec = selections[0];
                var status = rec.get('status');

                gm.me().vSELECTED_ASSYMAP_UID = rec.get('unique_uid');
//            	switch(status){
//            		case 'BM':
//        			case 'DE':
//    					gUtil.enable(gMain.selPanel.reviewAction);
//            			break;
//            		case 'P0':
//            			gUtil.enable(gMain.selPanel.completeAction);
//						gUtil.enable(gMain.selPanel.reviewCancleAction);
//            			break;
//            	}
                gUtil.enable(gMain.selPanel.reviewAction);
                gUtil.enable(gMain.selPanel.completeAction);
                gUtil.enable(gMain.selPanel.reviewCancleAction);
            } else {
                gUtil.disable(gMain.selPanel.reviewAction);
                gUtil.disable(gMain.selPanel.completeAction);
                gUtil.disable(gMain.selPanel.reviewCancleAction);
            }
        });

        // // 수주금액 계산
        // this.addCallback('CAL_PRICE', function (o, cur, prev) {
        //     var quan = gm.me().getInputJust('assymap|quan');
        //     var sales_price = gm.me().getInputJust('assymap|sales_price');
        //     var selling_price = gm.me().getInputJust('project|selling_price');


        //     var _quan = quan.getValue();
        //     var _sales_price = sales_price.getValue();

        //     selling_price.setValue(Math.ceil(_quan * _sales_price));
        // });
        // //검색

        // this.addCallback('SRCH_ITEMCODE', function (o) {

        //     var sp_code = gm.me().getInputJust('srcahd|sp_code').getValue();
        //     //KC 컨버터
        //     var srcadt_varchar1 = gm.me().getInputJust('srcadt|srcadt_varchar1').getValue();
        //     var srcadt_varchar2 = gm.me().getInputJust('srcadt|srcadt_varchar2').getValue();
        //     var srcadt_varchar3 = gm.me().getInputJust('srcadt|srcadt_varchar3').getValue();
        //     var srcadt_varchar4 = gm.me().getInputJust('srcadt|srcadt_varchar4').getValue();
        //     var srcadt_varchar5 = gm.me().getInputJust('srcadt|srcadt_varchar5').getValue();
        //     var srcadt_varchar6 = gm.me().getInputJust('srcadt|srcadt_varchar6').getValue();
        //     var srcadt_varchar7 = gm.me().getInputJust('srcadt|srcadt_varchar7').getValue();
        //     //KB 안정기
        //     var srcadt_varchar9 = gm.me().getInputJust('srcadt|srcadt_varchar9').getValue();
        //     var srcadt_varchar10 = gm.me().getInputJust('srcadt|srcadt_varchar10').getValue();
        //     var srcadt_varchar11 = gm.me().getInputJust('srcadt|srcadt_varchar11').getValue();
        //     var srcadt_varchar12 = gm.me().getInputJust('srcadt|srcadt_varchar12').getValue();
        //     var srcadt_varchar13 = gm.me().getInputJust('srcadt|srcadt_varchar13').getValue();
        //     var srcadt_varchar14 = gm.me().getInputJust('srcadt|srcadt_varchar14').getValue();
        //     var srcadt_varchar15 = gm.me().getInputJust('srcadt|srcadt_varchar15').getValue();

        //     var sales_price = gm.me().getInputJust('assymap|sales_price');
        //     var selling_price = gm.me().getInputJust('project|selling_price');
        //     var srch_store = Ext.getCmp('SRO5_KB1_SRCH_CODE');
        //     srch_store.store.getProxy().setExtraParams({});
        //     srch_store.clearValue();
        //     srch_store.store.removeAll();
        //     console_logs('sp_code', sp_code);
        //     srch_store.store.getProxy().setExtraParam('sp_code', sp_code);
        //     switch (sp_code) {

        //         case 'KC':
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar1', srcadt_varchar1);
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar2', srcadt_varchar2);
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar3', srcadt_varchar3);
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar4', srcadt_varchar4);
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar5', srcadt_varchar5);
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar6', srcadt_varchar6);
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar7', srcadt_varchar7);
        //             break;
        //         case 'KB':
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar9', srcadt_varchar9);
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar10', srcadt_varchar10);
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar11', srcadt_varchar11);
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar12', srcadt_varchar12);
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar13', srcadt_varchar13);
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar14', srcadt_varchar14);
        //             srch_store.store.getProxy().setExtraParam('srcadt_varchar15', srcadt_varchar15);
        //             break;
        //     }
        //     srch_store.store.load(function (records) {
        //     });


        // });
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
                Ext.Msg.alert('안내', '요청하였습니다.', function () {
                });

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
                        labelWidth: 40,
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
                                    width: 50,
                                    text: '자동생성',
                                    //style : "width : 50px;",
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
                                            },// endofsuccess
                                            failure: extjsUtil.failureMessage
                                        });// endofajax


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
                    Ext.MessageBox.show({
                        title: CMD_CONFIRM_RPO,
                        msg: 'LOT번호 : ' + Ext.getCmp('lot_no').getValue() + '의 <br> 수주를 확정하겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (result) {
                            if (result == 'yes') {
                                var form = gu.getCmp('formPanel').getForm();
                                var assymap_uid = gMain.selPanel.vSELECTED_ASSYMAP_UID;
                                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                                var ac_uid = gMain.selPanel.vSELECTED_AC_UID;

                                form.submit({
                                    url: CONTEXT_PATH + '/index/process.do?method=addPrdPntLotHeavy',
                                    params: {
                                        ac_uid: ac_uid,
                                        assymap_uid: assymap_uid,
                                        lot_no: Ext.getCmp('lot_no').getValue()

                                    },
                                    success: function (val, action) {
                                        prWin.close();
                                        gMain.selPanel.store.load(function () {
                                        });
                                    },
                                    failure: function (val, action) {
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
    }
});
