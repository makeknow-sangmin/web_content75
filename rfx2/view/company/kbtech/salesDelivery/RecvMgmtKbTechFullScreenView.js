//수주관리 메뉴
Ext.define('Rfx2.view.company.kbtech.salesDelivery.RecvMgmtKbTechFullScreenView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-mgmt-kbtech-fullscreen-view',
    inputBuyer: null,
    initComponent: function () {

        this.setDefValue('regist_date', new Date());
        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);

        // 검색툴바 필드 초기화
        this.initSearchField();

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

        this.createStore('Rfx2.model.RecvMgmtKbTechFullScreen', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            5000/* pageSize */
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['assymap']
        );

        this.setRowClass(function (record, index) {
            var c = record.get('state');
            switch (c) {
                case 'Y':
                    return 'yellow-row';
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

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

        });

        // this.createCrudTab();

        // this.grid.view.loadMask = false;

        //this.grid.forceFit = true;

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        // var task = {
        //     run: function() {
        //         gm.me().store.load(function(records) {
        //             gm.me().storeLoadCallback(records);
        //         });
        //     },
        //     interval: 60000 //1 second
        // }
        //
        // var runner = new Ext.util.TaskRunner();
        //
        // runner.start(task);

        // Ext.create('Ext.window.Window', {
        //     title: '생산현황',
        //     height: 1080 / 150 * 100,
        //     width: 1920 / 150 * 100,
        //     layout: 'fit',
        //     maximizable: true,
        //     items: [  // Let's put an empty grid in just to illustrate fit layout
        //         this.grid
        //     ]
        // }).show();

        this.store.load(function (records) {
            gm.me().storeLoadCallback(records);
        });
        this.callParent(arguments);


        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.

        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('recv_flag', 'GE');
        this.store.getProxy().setExtraParam('big_pcs_code', null);
        this.store.getProxy().setExtraParam('js_pcs_code', null);


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
                                    maxlength: '1',
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
                        title: gm.getMC('CMD_ORDER_CONFIRM','수주확정'),
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
    },

    storeLoadCallback: function (records) {

        gm.me().multi_grid_id = 'KC';
        var multi_grid_id = 'KC';
        console_logs('디폴트 데이터', multi_grid_id);

        if (multi_grid_id == undefined) {
            for (var i = 0; i < records.length; i++) {

                var keyCode = multi_grid_id;
                if (vCompanyReserved4 == 'HAEW01KR') {
                    keyCode = 'SSP';
                }

                var specunit = records[i].get('specification');
                gm.me().spec.push(specunit);

            }
        } else {
            var keyCode = multi_grid_id;
            if (vCompanyReserved4 == 'HAEW01KR') {
                if (keyCode == 'ALL-STL') {
                    keyCode = 'STL';
                }
            }
        }

        gm.me().extoutJson(multi_grid_id, records, null);

        console_logs('extoutJson records', records);

    },

    extoutJson: function (multi_grid_id, records, fname) {

        if (records == null || records.length == 0) {
            return;
        }

        var big_pcs_code = multi_grid_id == undefined ? 'SSP' : multi_grid_id;

        var smallPcs = gUtil.mesTplProcessAll[big_pcs_code];

        if (smallPcs != null && smallPcs.length > 0) {
            for (var j = 0; j < smallPcs.length; j++) {
                var o1 = smallPcs[j];
                var pcsCode = o1['code'];
                for (var i = 0; i < records.length; i++) {
                    var o = records[i];
                    o.set(pcsCode + '|' + 'end_date', null);
                }
            }
        }

        for (var i = 0; i < records.length; i++) {
            var o = records[i];

            var js_end_date = o.get('js_end_date');
            var js_dept_name = o.get('js_dept_name');

            var cnt_exist_date = 0;

            for (var key in js_end_date) {

                var arr = js_end_date[key];
                var arr2 = js_dept_name[key];
                var pcs_code = key.split('-')[1];

                var isNotExistDate = false;

                if (arr instanceof Array) {
                    if (arr[0].length > 0) {
                        cnt_exist_date++;
                        o.set('dept_name', arr2);
                    } else {
                        if (!isNotExistDate) {
                            isNotExistDate = true;
                            o.set('dept_name', arr2);
                        }
                    }
                    o.set(pcs_code + '|' + 'end_date', arr[0]);
                } else {
                    if (arr.length > 0) {
                        cnt_exist_date++;
                        o.set('dept_name', arr2);
                    } else {
                        if (!isNotExistDate) {
                            isNotExistDate = true;
                            o.set('dept_name', arr2);
                        }
                    }
                    o.set(pcs_code + '|' + 'end_date', arr);
                }
            }

            if (cnt_exist_date === Object.keys(js_end_date).length) {
                var gr_quan = o.get('gr_quan');
                var ngr_quan = o.get('ngr_quan');

                if (gr_quan === 0) {
                    o.set('state_name', '입고대기');
                } else if (ngr_quan === 0) {
                    o.set('state_name', '완료');
                } else {
                    o.set('state_name', '입고중');
                }
            }
        }
    }
});

