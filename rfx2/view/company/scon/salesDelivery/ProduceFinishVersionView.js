//생산완료 현황
Ext.define('Rfx2.view.company.scon.salesDelivery.ProduceFinishVersionView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-pending-view',
    inputBuyer: null,
    preValue: 0,
    initComponent: function () {

        // flag1 : 운송방법. Y=J2CODE활용
        console_logs('Rfx2.view.gongbang.salesDelivery.DeliveryPendingDetailVerView flag1=', this.flag1);
        console_logs('Rfx2.view.gongbang.salesDelivery.DeliveryPendingDetailVerView flag2=', this.flag2);
        console_logs('Rfx2.view.gongbang.salesDelivery.DeliveryPendingDetailVerView flag3=', this.flag3);
        console_logs('Rfx2.view.gongbang.salesDelivery.DeliveryPendingDetailVerView flag4=', this.flag4);
        console_logs('Rfx2.view.gongbang.salesDelivery.DeliveryPendingDetailVerView flag5=', this.flag5);


        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        var emptyValue = '';
            emptyValue = '거래처명';


            this.addSearchField({
                type: 'dateRange',
                field_id: 'req_delivery_date',
                text: '납기예정',
                sdate: Ext.Date.add(new Date(), Ext.Date.DAY, -7),
                edate: Ext.Date.add(new Date(), Ext.Date.DAY, +6)
            });

            this.addSearchField({
                type: 'text',
                field_id: 'project_varchard',
                emptyText: '납품요구번호'
            });

        
        this.addSearchField({
            type: 'text',
            field_id: 'wa_name',
            emptyText: emptyValue
        });


            this.addSearchField({
                type: 'text',
                field_id: 'pj_name',
                emptyText: '현장명'
            });

            this.addSearchField({
                type: 'text',
                field_id: 'project_varchar1',
                emptyText: '납품업체/연락처'
            });


        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    buttonToolbar.items.remove(item);
                    break;
                default:
                    break;
            }
        });

        /**
         * flag1:
         * SLOAST : SLOAST에서 출하대기 가져오가
         * SRCAHD : SRCAHD/ASSYMAP에서 출하대기가뎌오기
         * PRODUCT : PRODUCT/ASSYMAP에서 출하대기가뎌오기
         * PROJECT : PROJECT의 고객사 / 납품요구일자 기준으로 출하대기품목 가져오기
         */
        var modelName = '';
        console_logs('>>>> this_flag', this.flag1)
        switch (this.flag1) {
            case 'SLOAST':
                modelName = 'Rfx2.model.company.bioprotech.DeliveryPending';
                break;
            case 'SRCAHD':
                modelName = 'Rfx.model.RecvPoKbTech';
                break;
            case 'PRODUCT':
                modelName = 'Rfx.model.ProductStock';
                break;
            case 'PROJECT':
                modelName = 'Rfx.model.CombstInfoProject';
                break;
            default:
                modelName = 'Rfx2.model.company.bioprotech.DeliveryPending';
        }


        this.createStore(modelName, [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['combst']
        );


        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdDetailForShipmentVerStore', {});

        this.assignShipmentAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Shipment_request', '출하 요청'),
            tooltip: '출하 요청',
            disabled: true,
            handler: function () {

                var mainSelection = gm.me().grid.getSelectionModel().getSelection()[0];
                var selections = gm.me().gridContractCompany.getSelectionModel().getSelection();

                // var acUid = mainSelection.get('ac_uid');
                var prQuanArr = [];
                var srcahdUidArr = [];
                var assyMapArr = [];
                var sloastArr = [];

                    var combstUid = mainSelection.get('combst_uid');
               


                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];

                        prQuanArr.push(rec.get('po_qty'));
                        if (rec.get('order_state') === 'Order') {
                            Ext.MessageBox.alert('알림', '이미 요청완료 상태의 건이 있습니다.');
                            return;
                        }
                        if (rec.get('order_state') === 'Dlcomp') {
                            Ext.MessageBox.alert('알림', '이미 납품서 생성 상태의 건이 있습니다.');
                            return;
                        }
                   

                    srcahdUidArr.push(rec.get('srcahd_uid'));
                    assyMapArr.push(-1);
                    sloastArr.push(rec.get('unique_id_long'));
                }


                var shippingStore = Ext.create('Ext.data.Store', {
                    fields: ['ship', 'ship_kr'],
                    data: [
                        {"ship": "SELF", "ship_kr": "자가 도착도"},
                        {"ship": "SPOT", "ship_kr": "현장 도착도"},
                        // { "self": "1","delivery": "2"},
                        // { "selfself": "3", "delivery": "4"},
                    ]
                });
                var shipmentTypeStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'SHIPMENT_TYPE'});
                // flag1 : 운송방법. Y=J2CODE활용
                var shipmentCombo = {
                    xtype: 'combo',
                    fieldLabel: '운송방법',
                    id: gu.id('shipment_type'),
                    anchor: '97%',
                    store: gm.me().flag1 === 'Y' ? shipmentTypeStore : shippingStore,
                    // store: shipmentTypeStore,
                    name: 'shipment_type',
                    valueField: gm.me().flag1 === 'Y' ? 'system_code' : 'ship',
                    displayField: gm.me().flag1 === 'Y' ? 'code_name_kr' : 'ship_kr',
                    selectOnFocus: true,
                    emptyText: '선택해주세요.',
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음',
                        getInnerTpl: function () {
                            // return '<div data-qtip="{ship}">{ship_kr}</div>';
                            return gm.me().flag1 === 'Y' ? '<div data-qtip="{system_code}">{code_name_kr}</div>'
                                : '<div data-qtip="{ship}">{ship_kr}</div>'
                                ;
                        }
                    },
                    listeners: {
                        afterrender: function (combo) {
                            var comboStore = combo.getStore();
                            comboStore.on('load', function (store) {
                                combo.select(comboStore.getAt(0));
                            });
                        }
                    }
                }

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        frame: false,
                        border: false,
                        bodyPadding: 10,
                        region: 'center',
                        layout: 'form',
                        fieldDefaults: {
                            labelAlign: 'right',
                            msgTarget: 'side'
                        },
                        items: [
                            {
                                xtype: 'fieldset',
                                title: '출하요청일을 입력하시기 바랍니다.',
                                items: [
                                    {
                                        xtype: 'datefield',
                                        id: gu.id('req_date'),
                                        anchor: '97%',
                                        name: 'req_date',
                                        submitFormat: 'Y-m-d',
                                        dateFormat: 'Y-m-d',
                                        format: 'Y-m-d',
                                        value: new Date(),
                                        fieldLabel: '출하요청일'
                                    }
                                ]
                            }
                        ]
                    });
                

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '출하예정등록',
                    width: 450,
                    height: 210,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: gm.getMC('CMD_Shipment_request', '출하 요청'),
                                    msg: '선택 한 건을 출하 요청 하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else if (rec.get('ap_Wquan') > rec.get('po_qty')) {
                                            Ext.Msg.alert('경고', '요청수량이 수주수량보다 크게 작성되어있습니다.');
                                        } else if (rec.get('ap_Wquan') <= 0) {
                                            Ext.Msg.alert('경고', '요청수량을 잘못 작성하셨습니다.');
                                        } else {
                                            var val = form.getValues(false);
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/sales/productStock.do?method=requestShipmentBySloast',
                                                params: {
                                                    acUid: -1,
                                                    prQuanArr: prQuanArr,
                                                    srcahdUidArr: srcahdUidArr,
                                                    assyMapArr: assyMapArr,
                                                    sloastArr: sloastArr,
                                                    combstUid: combstUid,
                                                    req_date: val['req_date'],
                                                    shipment_type: val['shipment_type']
                                                },
                                                success: function (val, action) {
                                                    Ext.Msg.alert('완료', '출하 요청이 완료 되었습니다.');
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                    // if(vCompanyReserved4 === 'KMCA01KR') {
                                                    //     gm.me().poPrdDetailStore.getProxy().setExtraParam('pj_name', '검색하지말것');
                                                    // }
                                                    gm.me().poPrdDetailStore.load();
                                                    gm.me().store.load();

                                                    //gm.me().gridContractCompany.getStore().load();
                                                },
                                                failure: function (val, action) {

                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        },
                        {
                            text: CMD_CANCEL,
                            scope: this,
                            handler: function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }
                    ]
                });

                prWin.show();
            }
        });


        // 납기예정일자 변경처리
        this.updateDelReqAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '납기예정일 변경',
            tooltip: '납기예정일 변경',
            disabled: true,
            handler: function () {
                var selections = gm.me().gridContractCompany.getSelectionModel().getSelection();

                var sloastArr = [];


                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];

                    if (rec.get('order_state') === 'Dlcomp') {
                        Ext.MessageBox.alert('알림', '이미 납품서 생성 상태의 건이 있습니다.');
                        return;
                    } else {
                        sloastArr.push(rec.get('unique_id_long'));
                    }
                }


                var form = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    frame: false,
                    border: false,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'form',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '변경할 납기예정일을 입력하시기 바랍니다.',
                            items: [
                                {
                                    xtype: 'datefield',
                                    id: gu.id('delivery_req_date'),
                                    anchor: '97%',
                                    name: 'delivery_req_date',
                                    submitFormat: 'Y-m-d',
                                    dateFormat: 'Y-m-d',
                                    format: 'Y-m-d',
                                    value: new Date(),
                                    fieldLabel: '출하요청일'
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '납기예정일 변경',
                    width: 450,
                    height: 210,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: '',
                                    msg: '선택한 건에 대하여 납기예정일 변경처리를 실행하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            var val = form.getValues(false);
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/sales/productStock.do?method=updateDelReqDate',
                                                params: {
                                                    sloastArr: sloastArr,
                                                    delivery_req_date: val['delivery_req_date'],
                                                },
                                                success: function (val, action) {
                                                    Ext.Msg.alert('완료', '출하 요청이 완료 되었습니다.');
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                    gm.me().poPrdDetailStore.load();
                                                    gm.me().store.load();

                                                },
                                                failure: function (val, action) {

                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        },
                        {
                            text: CMD_CANCEL,
                            scope: this,
                            handler: function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }
                    ]
                });

                prWin.show();
            }
        });


        this.rejectDeliveryOrder = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            text: gm.getMC('CMD_Cancel_request', '요청취소'),
            tooltip: '선택한 수주건에 대한 출하요청을 취소 후 수주등록 상태로 전환합니다.',
            disabled: true,
            handler: function () {
                var selections = gm.me().gridContractCompany.getSelectionModel().getSelection();
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    if (rec.get('order_state') === 'Dlcomp') {
                        Ext.MessageBox.alert('알림', '납품 진행중인 건에 대하여는 처리가 불가합니다.')
                        break;
                    } else if (rec.get('order_state') === 'Order') {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/sales/productStock.do?method=deleteDoBySloastUid',
                            params: {
                                sloast_uid: rec.get('unique_id_long'),
                            },
                            success: function (val, action) {
                                // 완료 후 수주등록 상태로 전환처리 method..
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=backDeliveryRequest',
                                    params: {
                                        project_uid: rec.get('ac_uid'),
                                        sloast_uid: rec.get('unique_id_long'),
                                    },
                                    success: function (val, action) {
                                        // Ext.Msg.alert('완료', '취소처리 되었습니다.');
                                        // gm.me().gridContractCompany.getStore().load();
                                    },
                                    failure: function (val, action) {
                                    }
                                });
                            },
                            failure: function (val, action) {
                            }
                        });
                    } else {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/sales/productStock.do?method=backDeliveryRequest',
                            params: {
                                project_uid: rec.get('ac_uid'),
                                sloast_uid: rec.get('unique_id_long'),
                            },
                            success: function (val, action) {
                                // Ext.Msg.alert('완료', '취소처리 되었습니다.');
                                // gm.me().gridContractCompany.getStore().load();
                            },
                            failure: function (val, action) {

                            }
                        });
                    }
                }
                gm.me().gridContractCompany.getStore().load();
            }
        });


        this.addMyCart = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'fa-cart-arrow-down_14_0_5395c4_none',
            text: gm.getMC('CMD_Add_to_Cart', '카트담기'),
            tooltip: '예정등록 건을 일괄 수량입력 후 카트에 담은 후 일괄 요청합니다.',
            disabled: true,
            handler: function (widget, event) {
                var my_assymap_uid = new Array();
                var my_pr_quan = new Array();
                var my_item_code = new Array();
                var my_item_name = new Array();
                var my_item_name = new Array();
                var my_childs = new Array();
                var mainSelection = gm.me().grid.getSelectionModel().getSelection()[0];
                var buyer = mainSelection.get('wa_code');
                var selections = gm.me().gridContractCompany.getSelectionModel().getSelection();
                // console_logs('selections', selections);
                var arrExist = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    console_logs('rec ???', rec);
                    var pr_quan = rec.get('ap_Wquan');
                    console_logs('ap_Wquan ??', pr_quan);
                    if (pr_quan === 0) {
                        Ext.MessageBox.alert('알림', '요청수량이 0인 건이 있습니다. 다시 확인해주세요.');
                        return;
                    } else {
                        var unique_id = rec.get('unique_id_long');
                        var child = rec.get('srcahd_uid');
                        var item_code = rec.get('item_code');
                        var item_name = rec.get('item_name');
                        // var pr_quan = rec.get('ap_Wquan');
                        arrExist.push(unique_id);
                        my_assymap_uid.push(unique_id)
                        // my_child.push(unique_id);
                        my_childs.push(child);
                        my_item_code.push(item_code);
                        my_item_name.push(item_name);
                        my_pr_quan.push(pr_quan)
                    }
                }
                if (my_childs.length > 0) {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/sales/delivery.do?method=addDlPendingIntoCart',
                        params: {
                            srcahd_uids: my_childs,
                            item_codes: my_item_code,
                            item_name: my_item_name,
                            assymap_uids: my_assymap_uid,
                            pr_quan: my_pr_quan,
                            buyer: buyer
                        },
                        success: function (result, request) {
                            // gm.me().myCartStore.load(function () {
                            var resultText = result.responseText;
                            // console_logs('>>> ddd', resultText);
                            if (resultText === 'true') {
                                Ext.Msg.alert('안내', '카트 담기 완료되었습니다.', function () {
                                });
                            } else if (resultText === 'overlap') {
                                Ext.Msg.alert('안내', '중복된 정보가 있습니다.<br>중복정보는 카트 일괄요청에서 삭제 가능합니다.', function () {
                                });
                            } else if (resultText === 'fail') {
                                Ext.Msg.alert('안내', '데이터 처리 중 문제가 발생했습니다.', function () {
                                });
                            }
                            // });
                        },
                    }); //end of ajax
                } else {

                }
            }
        });


        this.cartGoReq = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Bulk_Request_for_Cart', '카트일괄요청'),
            tooltip: '카트 내 등록 건을 일괄 출하요청합니다.',
            disabled: true,
            handler: function (widget, event) {
                var mainSelection = gm.me().grid.getSelectionModel().getSelection()[0];
                var req_info = mainSelection.get('wa_code');
                gm.me().cartDoListStore.getProxy().setExtraParam('req_info', '%' + req_info + '%');
                gm.me().cartDoListStore.load();

                var cartList = Ext.create('Ext.grid.Panel', {
                    cls: 'rfx-panel',
                    store: gm.me().cartDoListStore,
                    id: gu.id('prodUnitGrid'),
                    autoScroll: true,
                    autoHeight: true,
                    collapsible: false,
                    overflowY: 'scroll',
                    multiSelect: false,
                    width: '99%',
                    title: '아래 카트정보를 일괄 출하예정등록을 실시합니다.',
                    autoScroll: true,
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 1,
                    },
                    autoHeight: true,
                    frame: false,
                    border: false,
                    layout: 'fit',
                    forceFit: true,
                    viewConfig: {
                        markDirty: false
                    },
                    columns: [
                        {
                            text: '수주번호',
                            width: '30%',
                            dataIndex: 'orderNumber',
                            style: 'text-align:center',
                            valueField: 'no',
                            typeAhead: false,
                            allowBlank: false,
                            sortable: true,
                        },
                        {
                            text: '최종고객사',
                            width: '30%',
                            dataIndex: 'wa_name',
                            style: 'text-align:center',
                            typeAhead: false,
                            allowBlank: false,
                            sortable: true,
                        },
                        {
                            text: '요청수량',
                            width: '25%',
                            dataIndex: 'pr_quan',
                            style: 'text-align:center',
                            format: '0,000',
                            align: 'right',
                            typeAhead: false,
                            allowBlank: false,
                            sortable: true,
                            editor: 'numberfield',
                            renderer: function (value, context, tmeta) {
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        },
                        // {
                        //     text: 'Site',
                        //     width: '25%',
                        //     dataIndex: 'reserved5',
                        //     style: 'text-align:center',
                        //     typeAhead: false,
                        //     allowBlank: false,
                        //     sortable: true,
                        // },
                        {
                            text: '제품명',
                            width: '30%',
                            dataIndex: 'item_name',
                            style: 'text-align:center',
                            typeAhead: false,
                            sortable: true,
                        },
                        {
                            text: '기준모델',
                            width: '30%',
                            dataIndex: 'description',
                            style: 'text-align:center',
                            typeAhead: false,
                            allowBlank: false,
                            sortable: true,
                        },
                        {
                            text: '오더수량',
                            width: '25%',
                            xtype: 'numbercolumn',
                            dataIndex: 'sales_amount',
                            style: 'text-align:center',
                            format: '0,000',
                            align: 'right',
                            typeAhead: false,
                            allowBlank: false,
                            sortable: true,
                        }
                    ],
                    listeners: {
                        'itemClick': function (view, record) {
                            console_logs('>>> ddd', record);
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
                                    text: '카트목록 삭제',
                                    iconCls: 'af-remove',
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('prodUnitGrid').getSelectionModel().getSelected().items[0];
                                            if (record == null) {
                                                Ext.MessageBox.alert('알림', '삭제할 항목을 선택하십시오.')
                                                return;
                                            } else {
                                                var unique_id = record.get('id');
                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/sales/delivery.do?method=deleteCartDo',
                                                    params: {
                                                        unique_id: unique_id
                                                    },
                                                    success: function (result, request) {
                                                        Ext.MessageBox.alert('알림', '삭제 처리 되었습니다.');
                                                        gm.me().cartDoListStore.load();
                                                    }, // endofsuccess
                                                    failure: extjsUtil.failureMessage
                                                });
                                            }
                                        }
                                    }]
                                },
                            ]
                        })
                    ]
                });


                var mainSelection = gm.me().grid.getSelectionModel().getSelection()[0];
                var selections = gm.me().gridContractCompany.getSelectionModel().getSelection();
                var prQuanArr = [];
                var srcahdUidArr = [];
                var assyMapArr = [];
                var combstUid = mainSelection.get('unique_id_long');
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    prQuanArr.push(rec.get('ap_Wquan'));
                    srcahdUidArr.push(rec.get('srcahd_uid'));
                    assyMapArr.push(rec.get('assymap_uid'));
                }

                var shipmentTypeStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'SHIPMENT_TYPE'});

                var form = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    frame: false,
                    border: false,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'form',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            width: '99%',
                            margin: '0 3 3 3',
                            items: [
                                cartList
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: '출하요청일과 운송 방법을 입력하시기 바랍니다.',
                            margin: '5 3 0 0',
                            items: [
                                {
                                    xtype: 'datefield',
                                    id: gu.id('req_date'),
                                    anchor: '97%',
                                    name: 'req_date',
                                    submitFormat: 'Y-m-d',
                                    dateFormat: 'Y-m-d',
                                    format: 'Y-m-d',
                                    value: new Date(),
                                    fieldLabel: '출하요청일'
                                },
                                {
                                    xtype: 'combo',
                                    fieldLabel: '운송방법',
                                    id: gu.id('shipment_type'),
                                    anchor: '97%',
                                    store: shipmentTypeStore,
                                    name: 'shipment_type',
                                    valueField: 'systemCode',
                                    displayField: 'codeName',
                                    emptyText: '선택해주세요.',
                                    listConfig: {
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{}">{codeName}</div>';
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '카트일괄요청',
                    width: 650,
                    height: 500,
                    items: form,
                    overflowY: 'scroll',
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: gm.getMC('CMD_Shipment_request', '출하 요청'),
                                    msg: '현재 카트 내 정보를 출하 요청 하시겠습니까?<br>출하 요청 후 기존 카트정보는 삭제처리 됩니다.',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            var storeData = gu.getCmp('prodUnitGrid').getStore();
                                            var length = storeData.data.items.length;
                                            if (length > 0) {
                                                var prQuanArr = [];
                                                var srcahdUidArr = [];
                                                var assyMapArr = [];
                                                var uniqueIdArr = [];
                                                var sloastUidArr = [];
                                                var combstUid = mainSelection.get('unique_id_long');
                                                for (var i = 0; i < storeData.data.items.length; i++) {
                                                    var item = storeData.data.items[i];
                                                    prQuanArr.push(item.get('pr_quan'));
                                                    srcahdUidArr.push(item.get('srcahd_uid'));
                                                    assyMapArr.push(-1);
                                                    sloastUidArr.push(item.get('sloast_uid'));
                                                    uniqueIdArr.push(item.get('id'));
                                                }
                                                var val = form.getValues(false);
                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/sales/productStock.do?method=requestShipmentBySloast',
                                                    params: {
                                                        acUid: -1,
                                                        prQuanArr: prQuanArr,
                                                        srcahdUidArr: srcahdUidArr,
                                                        assyMapArr: assyMapArr,
                                                        combstUid: combstUid,
                                                        req_date: val['req_date'],
                                                        shipment_type: val['shipment_type'],
                                                        sloastArr: sloastUidArr
                                                    },
                                                    success: function (val, action) {
                                                        Ext.Msg.alert('완료', '출하 요청이 완료 되었습니다.');
                                                        Ext.Ajax.request({
                                                            url: CONTEXT_PATH + '/sales/delivery.do?method=deleteCartDoMulti',
                                                            params: {
                                                                uniqueIds: uniqueIdArr
                                                            },
                                                            success: function (val, action) {
                                                                if (prWin) {
                                                                    prWin.close();
                                                                }
                                                                gm.me().gridContractCompany.getStore().load();
                                                            },
                                                            failure: function (val, action) {

                                                            }
                                                        });
                                                    },
                                                    failure: function (val, action) {

                                                    }
                                                });
                                            } else {
                                                Ext.MessageBox.alert('알림', '카트 내 입력 정보가 없습니다.')
                                            }
                                        }
                                    }
                                });
                            }
                        },
                        {
                            text: CMD_CANCEL,
                            scope: this,
                            handler: function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }
                    ]
                });

                prWin.show();
            }
        });

        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var item_name = '';
                    var final_wa_name = '';
                    var project_varchard = '';
                    var order_number = '';

                    if (gu.getCmp('order_number').getValue().length != "" || gu.getCmp('order_number').getValue().length > 0) {
                        order_number = gu.getCmp('order_number').getValue();
                    }
                    if (gu.getCmp('item_name').getValue().length != "" || gu.getCmp('item_name').getValue().length > 0) {
                        item_name = gu.getCmp('item_name').getValue();
                    }
                    if (gu.getCmp('final_wa_name').getValue().length != "" || gu.getCmp('final_wa_name').getValue().length > 0) {
                        final_wa_name = gu.getCmp('final_wa_name').getValue();
                    }
                    if (gu.getCmp('project_varchard').getValue() != "" || gu.getCmp('project_varchard').getValue().length > 0) {
                        project_varchard = gu.getCmp('project_varchard').getValue();
                    }


                } catch (e) {

                }
                if (final_wa_name != "" || final_wa_name.length > 0) {
                    gm.me().poPrdDetailStore.getProxy().setExtraParam('final_wa_name', '%' + final_wa_name + '%');
                }
                if (item_name != "" || item_name.length > 0) {
                    gm.me().poPrdDetailStore.getProxy().setExtraParam('item_name', '%' + item_name + '%');
                }
                if (project_varchard != "" || project_varchard.length > 0) {
                    gm.me().poPrdDetailStore.getProxy().setExtraParam('project_varchard', '%' + project_varchard + '%');
                }
                if (order_number != "" || order_number.length > 0) {
                    gm.me().poPrdDetailStore.getProxy().setExtraParam('order_number', '%' + order_number + '%');
                }
                gm.me().poPrdDetailStore.load();
            }
        });

            this.gridContractCompany = Ext.create('Ext.grid.Panel', {
                cls: 'rfx-panel',
                id: gu.id('gridContractCompany'),
                store: this.poPrdDetailStore,
                viewConfig: {
                    markDirty: false
                },
                collapsible: false,
                multiSelect: false,
                region: 'center',
                autoScroll: true,
                autoHeight: true,
                flex: 0.5,
                frame: true,
                viewConfig: {
                    getRowClass: function (record, index) {
                        var c = record.get('order_state');
                        var d = record.get('delivery_qty');
                        if (c == 'Order') {
                            return 'green-row'

                        }
                        if (c == 'Wait') {
                            return 'white-row'
                        }
                        if (c == 'Dlcomp') {
                            return 'yellow-row'
                        }
                    }
                },
                border: true,
                layout: 'fit',
                forceFit: false,
                plugins: {
                    ptype: 'cellediting',
                    clicksToEdit: 1
                },
                selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                margin: '0 0 0 0',
                dockedItems: [
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        items: [
                            this.purListSrch,
                            this.assignShipmentAction,
                            this.rejectDeliveryOrder,
                            this.updateDelReqAction
                            //   this.addMyCart,
                            //  this.cartGoReq
                        ]
                    },
                   
                ],
                columns: [
                    {
                        text: '상태',
                        width: 80,
                        style: 'text-align:center',
                        dataIndex: 'order_state_kr'/*, sortable: false*/
                    },
                    // { text: '수주번호', width: 100, style: 'text-align:center', dataIndex: 'orderNumber'/*, sortable: false*/ },
                    {
                        text: '납품요구일자',
                        width: 98,
                        style: 'text-align:center',
                        dataIndex: 'regist_date'/*, sortable: false*/,
                        renderer: function (value, context, tmeta) {
                            if (value !== null && value.length > 0) {
                                return value.substring(0, 10);
                            }
                        },
                    },
                    {
                        text: '납기예정일',
                        width: 98,
                        style: 'text-align:center',
                        dataIndex: 'req_delivery_date'/*, sortable: false*/,
                        renderer: function (value, context, tmeta) {
                            if (value !== null && value.length > 0) {
                                return value.substring(0, 10);
                            }
                        },
                    },
                    {
                        text: '납기일자',
                        width: 98,
                        style: 'text-align:center',
                        dataIndex: 'delivery_plan'/*, sortable: false*/,
                        renderer: function (value, context, tmeta) {
                            if (value !== null && value.length > 0) {
                                return value.substring(0, 10);
                            }
                        },
                    },
                    // { text: '현장명', width: 100, style: 'text-align:center', dataIndex: 'pj_name'/*, sortable: false*/ },
                    // { text: '납품업체/연락처', width: 100, style: 'text-align:center', dataIndex: 'project_varchar1'/*, sortable: false*/ },
                    //  { text: 'Site', width: 80, style: 'text-align:center', dataIndex: 'reserved5'/*, sortable: false*/ },
                    {
                        text: this.getMC('msg_order_grid_prd_name', '품명'),
                        width: 100,
                        style: 'text-align:center',
                        dataIndex: 'item_name'/*, sortable: false*/
                    },
                    {
                        text: this.getMC('msg_order_grid_prd_desc', '규격'),
                        width: 100,
                        style: 'text-align:center',
                        dataIndex: 'concat_spec_desc'/*, sortable: false*/
                    },
                    {
                        text: '수주수량', width: 95, style: 'text-align:center', dataIndex: 'po_qty', align: 'right',
                        // editor: 'numberfield',
                        renderer: function (value, context, tmeta) {
                            return Ext.util.Format.number(value, '0,00/i');
                        },
                    },
                    {
                        text: '납품수량', width: 95, style: 'text-align:center', dataIndex: 'delivery_qty', align: 'right',
                        // editor: 'numberfield',
                        renderer: function (value, context, tmeta) {
                            return Ext.util.Format.number(value, '0,00/i');
                        },
                    },
                    {
                        text: this.getMC('msg_order_grid_prd_unitprice', '단가'),
                        width: 100, style: 'text-align:center',
                        decimalPrecision: 5,
                        dataIndex: 'sales_price'/*, sortable: false*/,
                        align: 'right',
                        renderer: function (value, context, tmeta) {
                            if (context.field == 'sales_price') {
                                context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                            }
                            return Ext.util.Format.number(value, '0,00/i');
                        },
                    },
                    {
                        text: this.getMC('msg_order_grid_prd_unitprice', '금액'),
                        width: 100, style: 'text-align:center',
                        decimalPrecision: 5,
                        dataIndex: 'total_sales_price'/*, sortable: false*/,
                        align: 'right',
                        renderer: function (value, context, tmeta) {
                            if (context.field == 'sales_price') {
                                context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                            }
                            return Ext.util.Format.number(value, '0,00/i');
                        },
                    },
                    // {
                    //     text: '기요청', width: 95, style: 'text-align:center', dataIndex: 'ap_quan', align: 'right',
                    //     editor: 'numberfield',
                    //     renderer: function (value, context, tmeta) {
                    //         return Ext.util.Format.number(value, '0,00/i');
                    //     },
                    // },
                    // {
                    //     text: '요청수량', width: 95, style: 'text-align:center', dataIndex: 'ap_Wquan', align: 'right',
                    //     editor: 'numberfield',
                    //     renderer: function (value, context, tmeta) {
                    //         return Ext.util.Format.number(value, '0,00/i');
                    //     },
                    // },
                    // { text: this.getMC('msg_order_grid_prd_currency', '통화'), width: 80, style: 'text-align:center', dataIndex: 'reserved4'/*, sortable: false*/ },
                    // { text: '최종고객명', width: 100, style: 'text-align:center', dataIndex: 'final_wa_name' },
                    // {
                    //     text: '수주일자', width: 100, style: 'text-align:center', dataIndex: 'regist_date'/*, sortable: false*/,
                    //     renderer: function (value, context, tmeta) {
                    //         if (value !== null && value.length > 0) {
                    //             return value.substring(0, 10);
                    //         }
                    //     },
                    // },
                    // { text: 'PI번호', width: 100, style: 'text-align:center', dataIndex: 'project_varchare' },
                ],
                title: this.getMC('mes_reg_prd_info_msg', '수주상세 품목'),
                name: 'po',
                autoScroll: true,
                listeners: {
                    edit: function (editor, e, eOpts) {

                    },
                    cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                        if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                            var tempTextArea = document.createElement("textarea");
                            document.body.appendChild(tempTextArea);
                            tempTextArea.value = eOpts.target.innerText;
                            tempTextArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(tempTextArea);
                        }
                    }
                }
            });
       

        Ext.each(this.gridContractCompany.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'ap_Wquan':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'ap_Wquan':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    };
                    break;
                case 'ap_quan':
                case 'stock_qty':
                case 'stock_qty_safe':
                case 'stock_qty_useful':
                case 'total_out_qty':
                case 'wh_qty':
                case 'remain_qty':
                case 'bm_quan':
                    columnObj["renderer"] = function (value, meta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    };
                    break;
                case 'reserved_timestamp1_str':
                    columnObj["renderer"] = function (value, meta) {
                        return value;
                    };
                    break;
                case 'reserved1':
                    columnObj["renderer"] = function (value, meta) {
                        return value;
                    };
                    break;
                case 'reserved2':
                    columnObj["renderer"] = function (value, meta) {

                        return value;
                    };
                    break;
                case 'payment_condition':
                    columnObj["renderer"] = function (value, meta) {
                        return value;
                    };
                    break;
                default:
                    break;
            }

        });

        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    gm.me().assignShipmentAction.enable();
                    gm.me().addMyCart.enable();
                    gm.me().rejectDeliveryOrder.enable();
                    gm.me().updateDelReqAction.enable();
                    // gm.me().cartGoReq.enable();
                } else {
                    gm.me().assignShipmentAction.disable();
                    gm.me().addMyCart.disable();
                    gm.me().rejectDeliveryOrder.disable();
                    gm.me().updateDelReqAction.disable();
                    // gm.me().cartGoReq.disable();
                }
            }
        });

        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        this.store.getProxy().setExtraParam('project_do_pending', 'Y');


        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    //title: '제품 및 템플릿 선택',
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '45%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, this.gridContractCompany
            ]
        });

        //버튼 추가.

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (this.crudMode == 'EDIT') { // EDIT

            } else {// CREATE,COPY
                this.copyCallback();
            }

            gUtil.disable(gMain.selPanel.removeAction);
            gUtil.disable(gMain.selPanel.modifyAction);
            if (selections.length) {
                console_logs('>>>> selections', selections);
                var rec = selections[0];
                var status = rec.get('status');
                //gm.me().addPoPrdPlus.enable();
                gm.me().vSELECTED_ASSYMAP_UID = rec.get('unique_uid');
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                gUtil.enable(gMain.selPanel.completeAction);
                gUtil.enable(gMain.selPanel.editPoAction);
                gUtil.enable(gMain.selPanel.removeAction);
                gUtil.disable(gMain.selPanel.modifyAction);
                gUtil.enable(gMain.selPanel.fileattachAction);
                // gm.me().cartGoReq.enable();
                // gUtil.enable(gMain.selPanel.cartGoReq);
            } else {
                gUtil.disable(gMain.selPanel.completeAction);
                gUtil.disable(gMain.selPanel.editPoAction);
                gUtil.disable(gMain.selPanel.fileattachAction);
                // gm.me().cartGoReq.disable();
                // gUtil.disable(gMain.selPanel.cartGoReq);
            }

            if (selections.length) {
                var rec = selections[0];
                gm.me().cartGoReq.enable();
                //this.poPrdDetailStore.getProxy().setExtraParam('combst_uid', rec.get('combst_uid'));

                
                    this.poPrdDetailStore.getProxy().setExtraParam('combst_uid', rec.get('combst_uid'));
                    this.poPrdDetailStore.getProxy().setExtraParam('req_delivery_date', rec.get('req_delivery_date'));
                    this.poPrdDetailStore.getProxy().setExtraParam('pj_uid', rec.get('ac_uid'));
                
                this.poPrdDetailStore.load();
            } else {
                gm.me().cartGoReq.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('having_not_status', 'BM,P0,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('multi_prd', true);
        this.store.load(function (records) {
        });
    },

    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchExepOrderStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),
    prdStore: Ext.create('Mplm.store.RecvPoDsmfPoPRD', {}),
    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    PmUserStore: Ext.create('Mplm.store.UserStore', {}),
    payTermsStore: Ext.create('Mplm.store.PaytermStore', {}),
    incotermsStore: Ext.create('Mplm.store.IncotermsStore', {}),
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_NEW_DIVISION'}),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_CONDITION'}),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_TYPE'}),

    searchPrdStore: Ext.create('Mplm.store.MaterialSearchStore', {type: 'PRD'}),
    searchAssyStore: Ext.create('Mplm.store.MaterialSearchStore', {type: 'ASSY'}),

    searchItemStore: Ext.create('Mplm.store.ProductStore', {}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SAMPLE_TYPE'}),
    cartDoListStore: Ext.create('Rfx2.store.company.bioprotech.CartDoListVerStore'),
});