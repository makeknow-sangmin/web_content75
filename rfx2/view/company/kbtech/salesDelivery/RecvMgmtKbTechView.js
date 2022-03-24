//수주관리 메뉴
Ext.define('Rfx2.view.company.kbtech.salesDelivery.RecvMgmtKbTechView', {
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
        this.addSearchField(
            {
                type: 'combo'
                , field_id: 'status'
                , store: "RecevedStateStore"
                , displayField: 'codeName'
                , valueField: 'systemCode'
                , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

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

        this.addSearchField ('reserved_varchar6');
        this.addSearchField('wa_name');
        this.addSearchField('reserved_varchara');
        this.addSearchField('reserved_varchar5');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        Ext.each(this.columns, function(columnObj, index) {

            var o = columnObj;

            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'quan':
                case 'sales_price':
                case 'selling_price':
                case 'bm_quan':
                    o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                        if(gm.me().store.data.items.length > 0) {
                            var summary = gm.me().store.data.items[0].get('summary');
                            if(summary.length > 0) {
                                var objSummary = Ext.decode(summary);
                                return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                            } else {
                                return 0;
                            }
                        } else {
                            return 0;
                        }
                    };
                    break;
                default:
                    break;
            }
        });

        var option = {
            features: [{
                ftype: 'summary',
                dock: 'top'
            }]
        };

        this.defaultOrderAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '주문미납현항',
            tooltip: '주문미납현항',
            disabled: false,
            handler: function () {

            }
        });

        this.cancelPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_ORDER_CANCELLATION','수주취소'),
            tooltip: '수주취소',
            disabled: true,
            handler: function () {
                gm.me().cancelPo();
            }
        });

        this.createStore('Rfx2.model.RecvMgmtKbTech', [{
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
            var c = record.get('status');
            switch (c) {
                case 'P0':
                    return 'yellow-row';
                    break;
                case 'P':
                    return 'orange-row';
                    break;
                case 'CA':
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
        buttonToolbar.insert(1, this.cancelPoAction);

        // 그리드 생성
        this.createGrid(searchToolbar, buttonToolbar, option);

        // 버튼 추가.

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if(selections.length == 1) {
                gm.me().cancelPoAction.enable();
            } else {
                gm.me().cancelPoAction.disable();
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

    cancelPo: function() {

        var selection = gm.me().grid.getSelectionModel().getSelection()[0];

        var projectUid = selection.get('ac_uid');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/production/schdule.do?method=getCancelOrderType',
            params:{
                projectUid : projectUid,
            },
            success: function(result, request) {
                var jsonData = Ext.JSON.decode(result.responseText);
                console_logs('>>>json', jsonData.datas);

                var data = jsonData.datas;

                var a1 = '→ 수주가 확정되었습니다.<br/>';
                var a2 = '→ 수주가 확정되기 이전입니다.<br/>';
                var b1 = '→ 구매 요청을 하여 주문 작성 혹은 불출 요청을 하였습니다.<br/>';
                var c1 = '→ 주문한 자재가 일부 혹은 전체가 입고 되었습니다.<br/>';
                var d1 = '→ 자재가 본 수주에 할당 되어 본사 창고에서 이동되었습니다<br/>';
                // var e1 = '→ 본 수주의 생산이 시작되었습니다.<br/>';
                // var e2 = '→ 생산계획수립을 하여 작업 지시를 내리기 전입니다.<br/>';

                var cancelPoText = '본 수주는 다음과 같이 진행되었습니다.<br/>';

                for(var i = 0; i < (data.length / 2); i++) {
                    var statusText = data.substring(i * 2, i * 2 + 2);
                    var alphabet = statusText.substring(0, 1);
                    switch(alphabet) {
                        case 'A':
                            if (statusText.substring(1, 2) == 1) {
                                cancelPoText += a1;
                            } else {
                                cancelPoText += a2;
                            }
                            break;
                        case 'B':
                            if (statusText.substring(1, 2) == 1) {
                                cancelPoText += b1;
                            }
                            break;
                        case 'C':
                            if (statusText.substring(1, 2) == 1) {
                                cancelPoText += c1;
                            }
                            break;
                        case 'D':
                            if (statusText.substring(1, 2) == 1) {
                                cancelPoText += d1;
                            }
                            break;
                        // case 'E':
                        //     if (statusText.substring(1, 2) == 1) {
                        //         cancelPoText += e1;
                        //     } else {
                        //         cancelPoText += e2;
                        //     }
                        //     break;
                        default:
                            break;
                    }
                }

                cancelPoText +=  "<br/>수주 취소를 하면 아래와 같이 처리 할 예정입니다.<br/>";

                a1 = '→ 확정 된 수주는 취소가 되며 더 이상 진행 할 수 없습니다.<br/>';
                a2 = '→ 본 수주는 취소가 되며 더 이상 진행할 수 없습니다.<br/>';
                b1 = '→ 구매 요청 및 주문작성, 불출요청은 반려 처리 됩니다.<br/>';
                var b2 = '→ 구매 요청은 반려 처리 됩니다.<br/>';
                c1 = '→ 입고 된 자재는 반품 리스트에 추가 됩니다.<br/>';
                d1 = '→ 할당 된 자재는 제품이 생산 된 경우 입고 처리 후 할당이 취소됩니다.<br/>';
                // e1 = '→ 수주 생산은 중단 됩니다. 제품을 입고 처리 하시기 바랍니다.<br/>';
                // e2 = '→ 생산계획은 취소 됩니다.<br/>';

                for(var i = 0; i < (data.length / 2); i++) {
                    var statusText = data.substring(i * 2, i * 2 + 2);
                    var alphabet = statusText.substring(0, 1);
                    switch(alphabet) {
                        case 'A':
                            if (statusText.substring(1, 2) == 1) {
                                cancelPoText += a1;
                            } else {
                                cancelPoText += a2;
                            }
                            break;
                        case 'B':
                            if (statusText.substring(1, 2) == 1) {
                                cancelPoText += b1;
                            }else {
                                cancelPoText += b2;
                            }
                            break;
                        case 'C':
                            if (statusText.substring(1, 2) == 1) {
                                cancelPoText += c1;
                            }
                            break;
                        case 'D':
                            if (statusText.substring(1, 2) == 1) {
                                cancelPoText += d1;
                            }
                            break;
                        // case 'E':
                        //     if (statusText.substring(1, 2) == 1) {
                        //         cancelPoText += e1;
                        //     } else {
                        //         cancelPoText += e2;
                        //     }
                        //     break;
                        default:
                            break;
                    }
                }

                cancelPoText +=  "<br/>주의: 수주취소를 하시면, 더이상 수주진행을 할 수 없습니다!(원상복구불가)<br/>"
                                    + "그래도 수주취소를 진행하시겠습니까?";

                Ext.MessageBox.show({
                    title: gm.getMC('CMD_ORDER_CANCELLATION','수주취소'),
                    msg: cancelPoText,
                    width: 500,
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(btn) {
                        if(btn=='yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/production/schdule.do?method=cancelProject',
                                params:{
                                    cancelCode : data,
                                    projectUid : projectUid
                                },
                                success: function(result, request) {
                                    Ext.Msg.alert('', '수주가 취소되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });

            },
            failure: extjsUtil.failureMessage
        });
    }
});
