//생산완료 현황
Ext.define('Rfx2.view.company.sejun.salesDelivery.DeliveryPendingDetailView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-pending-view',
    inputBuyer: null,
    preValue: 0,
    initComponent: function () {
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


        this.addSearchField({
            type: 'text',
            field_id: 'po_no',
            emptyText: '요청번호'
        });

        this.addSearchField({
            type: 'text',
            field_id: 'wa_name',
            emptyText: '고객명'
        });


        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1: case 2: case 3: case 4: case 5:
                    buttonToolbar.items.remove(item);
                    break;
                default:
                    break;
            }
        });

        this.createStore('Rfx2.model.company.bioprotech.DeliveryPendingDo', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            gm.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['project']
        );

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdShipmentCartmapStore', {});


        this.addDlAndSledel = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: gm.getMC('CMD_Configuration_configuration', '팔레트 구성'),
            tooltip: this.getMC('msg_btn_prd_add', '팔레트 구성'),
            disabled: true,
            handler: function () {
                var selection = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                var real_stock_qty = selection.get('real_stock_qty');
                var pr_quan = selection.get('pr_quan');
                // if (pr_quan > real_stock_qty) {
                //     Ext.MessageBox.alert('알림', '현 재고보다 요청수량이 큽니다.<br>다시 확인해주세요.');
                //     return;
                // } else {
                 if (real_stock_qty <= 0) {
                    Ext.MessageBox.alert('알림', '실 재고수량이 없습니다.<br>다시 확인해주세요.');
                    return;
                } else {   
                    if (selection.get('ctr_flag') === 'Y') {
                        Ext.MessageBox.alert('알림', '이미 팔레트 적재구성이 진행되었습니다.');
                        return;
                    } else if (selection.get('ctr_flag') === 'D') {
                        Ext.MessageBox.alert('알림', '요청 취소가 진행된 건에 대하여 팔레트 적재처리가 불가능 합니다.');
                        return;
                    } else {
                        gm.me().makePalletEl();
                    }
                }
                // }
                // 위에 것 사용자 요청으로 일시적 comment 처리
                // 추후 다시 걸 예정.
            }
        });

        this.rejectDeliveryOrder = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-reject',
            text: gm.getMC('CMD_Cancel_request', '요청취소'),
            tooltip: this.getMC('msg_btn_prd_add', '요청취소'),
            disabled: true,
            handler: function () {
                var selections = gm.me().gridContractCompany.getSelectionModel().getSelection();
                console_logs('>>>>>>>> Packing Lists >>>>>>>>', selections);
                var cartmapUids = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var cartmapUid = rec.get('unique_id_long');
                    if (rec.get('ctr_flag') === 'Y') {
                        Ext.MessageBox.alert('알림', '패킹리스트가 생성된 제품 또는 취소처러가 된 건은 취소가 불가합니다.');
                        return;
                    } else if (rec.get('ctr_flag') === 'D') {
                        Ext.MessageBox.alert('알림', '패킹리스트가 생성된 제품 또는 취소처러가 된 건은 취소가 불가합니다.');
                        return;
                    } else {
                        cartmapUids.push(cartmapUid);
                        Ext.MessageBox.show({
                            title: '요청취소',
                            msg: '선택한 제품을 요청취소 하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            icon: Ext.MessageBox.QUESTION,
                            fn: function (btn) {
                                console_logs('btn ???', btn);
                                if (btn == "no" || btn == "cancel") {
                                    return;
                                } else {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=denyDeliveryRequest',
                                        params: {
                                            cartmapUids: cartmapUids
                                        },
                                        success: function (result, request) {
                                            Ext.MessageBox.alert('알림', '선택 제품의 출하요청이 취소되었습니다.');
                                            gm.me().store.load();
                                            gm.me().poPrdDetailStore.load();
                                        }, // endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });
                                }
                            }
                        });
                    }
                }
            }
        });

        this.barcodePrintAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            disabled: true,
            text: '팔레트생성',
            handler: function () {
                gm.me().printBarcode();
            }
        });


        this.printShippingMark = Ext.create('Ext.Action', {
            iconCls: 'af-print',
            text: gm.getMC('CMD_Shipping_indication', 'Shipping Mark 출력'),
            tooltip: 'Shipping Mark 출력',
            disabled: true,
            handler: function () {
                var productRecMain = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                if (productRecMain.get('ctr_flag') === 'Y') {
                    var codeStore = Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'LABEL_PRINTERS' });
                    codeStore.load();
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
                                title: '출력단위 및 출력수량을 입력 후 출력버튼을 클릭하십시오.',
                                items: [
                                    {
                                        xtype: 'combo',
                                        fieldLabel: '출력단위',
                                        id: gu.id('print_unit'),
                                        anchor: '97%',
                                        store: codeStore,
                                        name: 'print_unit',
                                        valueField: 'systemCode',
                                        displayField: 'codeName',
                                        emptyText: '선택해주세요.',
                                        value: 'PL',
                                        listConfig: {
                                            loadingText: '검색중...',
                                            emptyText: '일치하는 항목 없음',
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{unique_id}">{codeName}</div>';
                                            }
                                        },
                                        listeners: {
                                            select: function (combo, records) {

                                            },
                                            afterrender: function (combo, records) {
                                                var rec = codeStore[0];
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '부분출력 입력',
                                        id: gu.id('request_page'),
                                        anchor: '97%',
                                        name: 'request_page',
                                        value: 0
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '출력수량',
                                        id: gu.id('print_qty'),
                                        anchor: '97%',
                                        name: 'print_qty',
                                        value: 2
                                    },

                                ]
                            }
                        ]
                    });

                    var prWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: 'Shipping Mark 출력',
                        width: 450,
                        height: 220,
                        items: form,
                        buttons: [
                            {
                                text: '출력',
                                scope: this,
                                handler: function () {
                                    var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                                    var productRec = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                                    var isPartPrint = false;


                                    Ext.MessageBox.show({
                                        title: 'Shipping Mark 출력',
                                        msg: '입력한 정보로 Shipping Mark를 출력하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        icon: Ext.MessageBox.QUESTION,
                                        fn: function (btn) {
                                            if (btn == "no") {
                                                return;
                                            } else {
                                                var val = form.getValues(false);
                                                var request_print = val['request_page'];
                                                if (request_print > 0) {
                                                    isPartPrint = true;
                                                }
                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/production/schdule.do?method=printShippingMark',
                                                    params: {
                                                        print_unit: val['print_unit'],
                                                        print_qty: val['print_qty'],
                                                        customer_name: rec.get('wa_name'),
                                                        destination: rec.get('nation_code'),
                                                        production_type: productRec.get('class_name'),
                                                        item_name: productRec.get('srcahd_item_name'),
                                                        total_pallet: rec.get('pallet_cnt'),
                                                        cartmap_uid: productRec.get('id'),
                                                        code_parent: 'LABEL_PRINTERS',
                                                        request_page: val['request_page'],
                                                        isPartPrint: isPartPrint
                                                    },
                                                    success: function (val, action) {
                                                        Ext.Msg.alert('완료', '라벨 출력 요청 되었습니다.');
                                                        if (prWin) {
                                                            prWin.close();
                                                        }
                                                    },
                                                    failure: function (val, action) {
                                                        Ext.Msg.alert('완료', '라벨 출력을 하였으나 실패하였습니다.');
                                                        if (prWin) {
                                                            prWin.close();
                                                        }
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
                } else {
                    Ext.MessageBox.alert('알림', '팔레트 구성이 완료된 건에 대하여 Label 출력이 가능합니다.')
                }
            }
        });

        this.modifyShipmentAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '출하 요청 수정',
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var shipmentTypeStore = Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'SHIPMENT_TYPE' });
                var reqDate = rec.get('req_date');
                var reservedVarchar1 = rec.get('reserved_varchar1');
                var rtgastUid = rec.get('unique_id_long');
                if (reqDate !== null) {
                    reqDate = reqDate.substring(0, 10);
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
                            title: '출하요청일과 운송 방법을 입력하시기 바랍니다.',
                            items: [
                                {
                                    xtype: 'datefield',
                                    id: gu.id('req_date'),
                                    anchor: '97%',
                                    name: 'req_date',
                                    submitFormat: 'Y-m-d',
                                    dateFormat: 'Y-m-d',
                                    format: 'Y-m-d',
                                    value: reqDate,
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
                                    value: reservedVarchar1,
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
                    title: '출하예정수정',
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
                                    msg: '선택 한 건을 출하 요청 수정 하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            var val = form.getValues(false);
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/sales/productStock.do?method=modifyShipment',
                                                params: {
                                                    rtgast_uid: rtgastUid,
                                                    req_date: val['req_date'],
                                                    shipment_type: val['shipment_type']
                                                },
                                                success: function (val, action) {
                                                    Ext.Msg.alert('완료', '출하 요청이 수정 되었습니다.');
                                                    gm.me().store.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
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

        this.setDeliveryPlanAction = Ext.create('Ext.Action', {
            iconCls: 'af-calendar',
            text: gm.getMC('CMD_Specify_the_expected_shipping_date', '출하예정일 지정'),
            tooltip: '출하예정일 지정',
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var shipmentTypeStore = Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'SHIPMENT_TYPE' });
                var reqDate = rec.get('req_date');
                var reservedVarchar1 = rec.get('reserved_varchar1');
                var rtgastUid = rec.get('unique_id_long');
                if (reqDate !== null) {
                    reqDate = reqDate.substring(0, 10);
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
                            title: '출하예정일을 지정하시기 바랍니다.',
                            items: [
                                {
                                    xtype: 'datefield',
                                    id: gu.id('delivery_plan'),
                                    anchor: '97%',
                                    name: 'delivery_plan',
                                    submitFormat: 'Y-m-d',
                                    dateFormat: 'Y-m-d',
                                    format: 'Y-m-d',
                                    value: new Date(),
                                    fieldLabel: '출하예정일'
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '출하예정일 지정',
                    width: 450,
                    height: 200,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: '출하예정일 지정',
                                    msg: '선택 한 건의 출하예정일을 지정하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            var val = form.getValues(false);
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/sales/productStock.do?method=assignDeliveryPlan',
                                                params: {
                                                    rtgast_uid: rtgastUid,
                                                    delivery_plan: val['delivery_plan']
                                                },
                                                success: function (val, action) {
                                                    Ext.Msg.alert('완료', '출하예정일이 지정되었습니다.');
                                                    gm.me().store.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
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


        this.setCIPrintCi = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: gm.getMC('CMD_CI_output', 'C/I 출력'),
            tooltip: 'Commercial Invoice의 일련번호 부여 및 출력을 시행합니다.',
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var rtgastUid = rec.get('unique_id_long');
                var dl_uids = rec.get('dl_uids');
                var ciNo = rec.get('reserved_varchar2');
                console_logs('>>>> ci', ciNo);
                if (ciNo.length === 0) {
                    Ext.MessageBox.show({
                        title: 'C/I 출력',
                        msg: '선택 한 요청건의 C/I 번호를 발행 후 출력합니다.<br>단, 출하리스트 전체가 팔레트 적재가 안되있을 경우 일련번호 발행 및 출력이 불가합니다.',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no") {
                                return;
                            } else {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/delivery.do?method=issueCi',
                                    params: {
                                        rtgastUid: rtgastUid
                                    },
                                    success: function (result, request) {
                                        console_logs('>>>> result', result.responseText);
                                        var resText = result.responseText;
                                        if (resText === 'true') {
                                            // 여기에 PDF 프린트 명령 실행
                                            gm.me().store.load();
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/pdf.do?method=printCI',
                                                params: {
                                                    rtgast_uid: rtgastUid,
                                                    is_rotate: 'N',
                                                },
                                                success: function (result, request) {
                                                    var jsonData = Ext.JSON.decode(result.responseText);
                                                    var pdfPath = jsonData.pdfPath;
                                                    console_log(pdfPath);
                                                    if (pdfPath.length > 0) {
                                                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                                                        top.location.href = url;
                                                    }
                                                    // gm.me().pdfDownload(size, reportSelection, ++pos);
                                                },
                                                failure: function (result, request) {
                                                    // var result = result.responseText;
                                                    // Ext.MessageBox.alert('알림', result);
                                                }
                                            });
                                        } else {
                                            Ext.MessageBox.alert('알림', '출하리스트 전체가 팔레트 적재확인이 되지 않았습니다.<br>팔레트 적재 후 발행하십시오.')
                                        }
                                    },
                                    failure: function (result, request) {
                                        // var result = result.responseText;
                                        // Ext.MessageBox.alert('알림', result);
                                    }
                                });
                            }
                        }
                    });
                } else {
                    console_logs('STATE', 'PDF 출력');
                    gm.me().store.load();
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/pdf.do?method=printCI',
                        params: {
                            rtgast_uid: rtgastUid,
                            is_rotate: 'N',
                        },
                        success: function (result, request) {
                            var jsonData = Ext.JSON.decode(result.responseText);
                            var pdfPath = jsonData.pdfPath;
                            console_log(pdfPath);
                            if (pdfPath.length > 0) {
                                var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                                top.location.href = url;
                            }
                            // gm.me().pdfDownload(size, reportSelection, ++pos);
                        },
                        failure: function (result, request) {
                            // var result = result.responseText;
                            // Ext.MessageBox.alert('알림', result);
                        }
                    });
                }

            }
        });



        this.deleteDoAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: this.getMC('msg_btn_prd_add', '삭제'),
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '선택한 요청을 삭제 하시겠습니까?<br>우측 리스트에 모두 취소된 건만 삭제됩니다.',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == "yes") {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales/delivery.do?method=deleteDo',
                                params: {
                                    unique_id: rec.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    var result_txt = result.responseText;
                                    console_logs('>>>> result ???', result.responseText);
                                    if (result_txt === 'true') {
                                        Ext.MessageBox.alert('알림', '선택 요청이 삭제되었습니다.');
                                        gm.me().store.load();
                                        gm.me().poPrdDetailStore.load();
                                    } else {
                                        Ext.MessageBox.alert('알림', '우측 리스트에 대기 또는 생성완료건이 있는 관계로<br>삭제가 취소되었습니다.');
                                        gm.me().store.load();
                                        gm.me().poPrdDetailStore.load();
                                    }
                                }, // endofsuccess
                                failure: extjsUtil.failureMessage
                            });
                            return;
                        }
                    }
                });

            }
        });


        this.palletLoadList = Ext.create('Ext.Action', {
            text: gm.getMC('CMD_On_site_loading_status', '팔레트 적재현황'),
            tooltip: 'Pallet 적재내역을 확인 및 적재취소를 시행합니다.',
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var detailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdShipmentPackingListStore', {});
                detailStore.getProxy().setExtraParam('ctr_flags', 'L|Y');
                if (rec.get('dl_uids').length > 0) {
                    detailStore.getProxy().setExtraParam('dl_uids', rec.get('dl_uids'));
                } else {
                    detailStore.getProxy().setExtraParam('dl_uids', '-1');
                }
                detailStore.load();
                // gm.me().palletListStore.getProxy().setExtraParam('reserved_number2', rec.get('unique_id_long'));
                // gm.me().palletListStore.load();
                // var searchPalletGrid = Ext.create('Ext.grid.Panel', {
                //     store: gm.me().palletListStore,
                //     layout: 'fit',
                //     title: '팔레트 리스트',
                //     columns: [
                //         { text: "Pallet ID", flex: 0.5, style: 'text-align:left', dataIndex: 'po_no', sortable: true },
                //     ],
                //     multiSelect: true,
                //     pageSize: 100,
                //     width: 400,
                //     height: 526,
                //     bbar: Ext.create('Ext.PagingToolbar', {
                //         // store: gm.me().searchDetailStoreOnlySrcMap,
                //         displayInfo: false,
                //         displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                //         listeners: {
                //             beforechange: function (page, currentPage) {
                //             }
                //         }
                //     }),
                //     viewConfig: {
                //         emptyText: '<div style="text-align:center; padding-top:20% ">No Data..</div>'
                //     },
                // });

                // searchPalletGrid.getSelectionModel().on({
                //     selectionchange: function (sm, selections) {
                //         if (selections) {
                //             var rec = selections[0];
                //             detailStore.getProxy().setExtraParam('dl_uid', rec.get('unique_id_long'));
                //             detailStore.load();
                //         }
                //     }
                // });

                var loadForm = Ext.create('Ext.grid.Panel', {
                    store: detailStore,
                    id: gu.id('loadForm'),
                    layout: 'fit',
                    // title: '적재목록',
                    region: 'center',
                    style: 'padding-left:0px;',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    columns: [
                        { text: "Pallet No", flex: 2.5, style: 'text-align:center', dataIndex: 'po_no', sortable: true },
                        { text: "제품명", flex: 2.5, style: 'text-align:center', dataIndex: 'item_name', sortable: true },
                        { text: "기준모델", flex: 2, dataIndex: 'description', style: 'text-align:center', sortable: true },
                        { text: "규격", flex: 2, dataIndex: 'specification', style: 'text-align:center', sortable: true },
                        { text: "LOT NO", flex: 2, dataIndex: 'pcs_desc_group', style: 'text-align:center', sortable: true },
                        {
                            text: "수량", flex: 2, dataIndex: 'gr_qty',
                            style: 'text-align:center',
                            sortable: true,
                            align: 'right',
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'gr_qty') {
                                    context.record.set('gr_qty', Ext.util.Format.number(value, '0,00/i'));
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            }
                        },
                        {
                            text: "BOX 수",
                            flex: 2,
                            dataIndex: 'sledel_double1',
                            style: 'text-align:center',
                            sortable: true,
                            align: 'right',
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'sledel_double1') {
                                    context.record.set('sledel_double1', Ext.util.Format.number(value, '0,00/i'));
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            }
                        },
                        {
                            text: "무게(Kg)",
                            flex: 2,
                            dataIndex: 'sledel_double2',
                            style: 'text-align:center',
                            sortable: true,
                            align: 'right',
                            renderer: function (value, context, tmeta) {
                                if (context.field == 'sledel_double1') {
                                    context.record.set('sledel_double1', Ext.util.Format.number(value, '0,00/i'));
                                }
                                return Ext.util.Format.number(value, '0,00/i');
                            }
                        }
                    ],
                    renderTo: Ext.getBody(),
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
                                    text: '적재취소',
                                    iconCls: 'af-reject',
                                    id: gu.id('loadCancel'),
                                    disabled: true,
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('loadForm').getSelectionModel().getSelected().items[0];
                                            if (record == null) {
                                                Ext.MessageBox.alert('알림', '삭제할 항목을 선택하십시오.')
                                                return;
                                            } else {
                                                var unique_id = record.get('unique_id_long');
                                                Ext.MessageBox.show({
                                                    title: '적재취소',
                                                    msg: '선택 목록을 적재취소 처리하시겠습니까?',
                                                    buttons: Ext.MessageBox.YESNO,
                                                    icon: Ext.MessageBox.QUESTION,
                                                    fn: function (btn) {
                                                        if (btn == "no") {
                                                            return;
                                                        } else {
                                                            Ext.Ajax.request({
                                                                url: CONTEXT_PATH + '/sales/delivery.do?method=palletLoadCancel',
                                                                params: {
                                                                    sledel_uid: unique_id
                                                                },
                                                                success: function (result, request) {
                                                                    Ext.MessageBox.alert('알림', '적재취소 되었습니다.');
                                                                    detailStore.load();
                                                                    gm.me().poPrdDetailStore.load();
                                                                }, // endofsuccess
                                                                failure: extjsUtil.failureMessage
                                                            });
                                                        }
                                                    }
                                                });
                                                // gu.getCmp('saveFormGrid').getStore().removeAt(gu.getCmp('saveFormGrid').getStore().indexOf(record));
                                            }
                                        }
                                    }]
                                },
                            ]
                        })
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 490,
                    height: 600
                });

                loadForm.getSelectionModel().on({
                    selectionchange: function (sm, selections) {
                        if (selections) {
                            var rec = selections[0];
                            gu.getCmp('loadCancel').enable();
                        } else {
                            gu.getCmp('loadCancel').disable();
                        }
                    }
                });

                var winProduct = Ext.create('ModalWindow', {
                    title: '팔레트 적재현황 [요청번호 : ' + rec.get('po_no') + ']',
                    width: 900,
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
            }
        });


        this.palletDelete = Ext.create('Ext.Action', {
            text: gm.getMC('CMD_Delete_delete', '팔레트 삭제'),
            tooltip: 'Pallet 생성 리스트를 확인 후 불필요한 팔레트는 삭제합니다.',
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var detailStore = Ext.create('Rfx2.store.company.bioprotech.PresentPalletStore', {});
                if (rec.get('dl_uids').length > 0) {
                    detailStore.getProxy().setExtraParam('unique_ids', rec.get('dl_uids'));
                    detailStore.getProxy().setExtraParam('is_not_state', 'Y')
                } else {
                    detailStore.getProxy().setExtraParam('unique_ids', '-1');
                    detailStore.getProxy().setExtraParam('is_not_state', 'Y')
                }
                detailStore.load();

                var loadForm = Ext.create('Ext.grid.Panel', {
                    store: detailStore,
                    id: gu.id('loadForm'),
                    layout: 'fit',
                    // title: '적재목록',
                    region: 'center',
                    style: 'padding-left:0px;',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    columns: [
                        { text: "Pallet No", flex: 2.5, style: 'text-align:center', dataIndex: 'po_no', sortable: true },
                        {
                            text: "적재수", flex: 2.5,
                            style: 'text-align:center',
                            dataIndex: 'pallet_on_cnt',
                            sortable: true,
                            renderer: function (value, context, tmeta) {
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        },

                    ],
                    renderTo: Ext.getBody(),
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
                                    text: gm.getMC('CMD_Delete_delete', '팔레트 삭제'),
                                    iconCls: 'af-remove',
                                    id: gu.id('deletePallet'),
                                    disabled: true,
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('loadForm').getSelectionModel().getSelected().items[0];
                                            if (record == null) {
                                                Ext.MessageBox.alert('알림', '삭제할 항목을 선택하십시오.')
                                                return;
                                            } else {
                                                var unique_id = record.get('unique_id_long');
                                                if (Number(record.get('pallet_on_cnt')) === 0) {
                                                    console_logs('zzzzz', 'zzzzzz');
                                                    Ext.MessageBox.show({
                                                        title: '삭제',
                                                        msg: '선택한 팔레트를 삭제하시겠습니까?',
                                                        buttons: Ext.MessageBox.YESNO,
                                                        icon: Ext.MessageBox.QUESTION,
                                                        fn: function (btn) {
                                                            if (btn == "no" || btn == "cancel") {
                                                                return;
                                                            } else {
                                                                Ext.Ajax.request({
                                                                    url: CONTEXT_PATH + '/sales/delivery.do?method=palletDelete',
                                                                    params: {
                                                                        unique_id: unique_id
                                                                    },
                                                                    success: function (result, request) {
                                                                        Ext.MessageBox.alert('알림', '삭제 되었습니다.');
                                                                        detailStore.load();
                                                                        gm.me().store.load();
                                                                    }, // endofsuccess
                                                                    failure: extjsUtil.failureMessage
                                                                });
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    Ext.MessageBox.alert('알림', '팔레트 적재수가 존재하면 삭제가 불가능 합니다.')
                                                    return;
                                                }

                                                // gu.getCmp('saveFormGrid').getStore().removeAt(gu.getCmp('saveFormGrid').getStore().indexOf(record));
                                            }
                                        }
                                    }]
                                },
                            ]
                        })
                    ],
                    multiSelect: true,
                    pageSize: 100,
                    width: 300,
                    height: 300
                });

                loadForm.getSelectionModel().on({
                    selectionchange: function (sm, selections) {
                        if (selections) {
                            var rec = selections[0];
                            gu.getCmp('deletePallet').enable();
                        } else {
                            gu.getCmp('deletePallet').disable();
                        }
                    }
                });

                var winProduct = Ext.create('ModalWindow', {
                    title: '팔레트 삭제',
                    width: 400,
                    height: 300,
                    minWidth: 400,
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
            }
        });

        this.adjustRequestQuan = Ext.create('Ext.Action', {
            text: gm.getMC('CMD_Modify_Request_Quantity', '요청수량 수정'),
            tooltip: '기존 입력된 요청수량을 조절합니다.',
            disabled: true,
            handler: function () {
                var rec = gm.me().gridContractCompany.getSelectionModel().getSelection()[0];

                if (rec.get('ctr_flag') != 'Y') {
                    var maxEditQuan = Number(rec.get('assymap_bm_quan')) - Number(rec.get('already_delivery_quan'));
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
                                title: '수정할 요청수량을 입력하시기 바랍니다.<br>선택한 수주의 제품의 이미 출하수량이 존재할 시<br>(수주수량) - (기출고수량) 보다 초과 시 처리가 불가합니다.',
                                items: [
                                    {
                                        xtype: 'label',
                                        width: 400,
                                        height: 200,
                                        html: '<p style="text-align:left;">&nbsp수주수량 : ' + gUtil.renderNumber(rec.get('assymap_bm_quan')) + '<br>&nbsp기출고수량 : ' + gUtil.renderNumber(rec.get('already_delivery_quan')) + '<br>&nbsp최대 수정 가능수량 : ' + gUtil.renderNumber(maxEditQuan) + '<br> </p>',
                                        style: 'color:black;'
                                    },

                                    {
                                        xtype: 'numberfield',
                                        name: 'order_quan',
                                        margin: '10 10 2 2',
                                        fieldLabel: '요청수량 입력',
                                        id: gu.id('order_quan'),
                                        anchor: '97%',
                                        value: maxEditQuan
                                    }
                                ]
                            }
                        ]
                    });

                    var prWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: '요청수량 수정',
                        width: 550,
                        height: 280,
                        items: form,
                        buttons: [
                            {
                                text: CMD_OK,
                                scope: this,
                                handler: function () {
                                    Ext.MessageBox.show({
                                        title: '요청수량 수정',
                                        msg: '선택한 품목의 출하요청수량을 수정하시겠습니까?<br>수주수량과 입력한 수량의 차이가 존재하는 경우 출하지시에서 재 출하지시가 가능합니다. ',
                                        buttons: Ext.MessageBox.YESNO,
                                        icon: Ext.MessageBox.QUESTION,
                                        fn: function (btn) {
                                            if (btn == "no" || btn == "cancel") {
                                                return;
                                            } else {
                                                var val = form.getValues(false);
                                                var inputVal = val['order_quan'];
                                                var inputval_other = Number(inputVal.replace(/,/g, ""));
                                                if (Number(inputval_other) > Number(maxEditQuan)) {
                                                    Ext.MessageBox.alert('알림', '최대 수정 가능수량보다 입력수량이 초과되었습니다.<br>다시 확인해주세요');
                                                    gu.getCmp('order_quan').setValue(maxEditQuan);
                                                    return;
                                                } else {
                                                    Ext.Ajax.request({
                                                        url: CONTEXT_PATH + '/sales/delivery.do?method=modifyDeliveryQuan',
                                                        params: {
                                                            cartmap_uid: rec.get('unique_id_long'),
                                                            request_quan: inputval_other
                                                        },
                                                        success: function (val, action) {
                                                            Ext.Msg.alert('완료', '출하 요청이 수정 되었습니다.');
                                                            gm.me().store.load();
                                                            gm.me().poPrdDetailStore.load();
                                                            if (prWin) {
                                                                prWin.close();
                                                            }
                                                        },
                                                        failure: function (val, action) {

                                                        }
                                                    });

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

                } else {
                    Ext.MessageBox.alert('알림', '팔레트에 적재된 상태에서의 수량조정은 불가능합니다.')
                }


            }
        });

        this.createPallet = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: gm.getMC('CMD_Palette_creation', 'PALLET 생성'),
            tooltip: '팔레트 생성',
            disabled: true,
            handler: function () {
                var palletTypeStore = Ext.create('Mplm.store.PalletStore');
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
                            title: 'Pallet 종류, 바코드 발행수, 팔레트 생성수를 입력하세요.',
                            items: [
                                {
                                    xtype: 'combo',
                                    fieldLabel: '팔레트 종류',
                                    id: gu.id('pallet_type'),
                                    anchor: '97%',
                                    store: palletTypeStore,
                                    name: 'pallet_type',
                                    valueField: 'unique_id',
                                    displayField: 'class_name',
                                    emptyText: '선택해주세요.',
                                    // value: reservedVarchar1,
                                    listConfig: {
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">{class_name}</div>';
                                        }
                                    }
                                },
                                // {
                                //     xtype: 'numberfield',
                                //     id: gu.id('pallet_no'),
                                //     anchor: '97%',
                                //     name: 'pallet_no',
                                //     fieldLabel: '바코드 발행 수'
                                // },
                                {
                                    xtype: 'numberfield',
                                    id: gu.id('pallet_cnt'),
                                    anchor: '97%',
                                    name: 'pallet_cnt',
                                    fieldLabel: '팔레트 생성수'
                                },
                                {
                                    xtype: 'textfield',
                                    id: gu.id('detail'),
                                    anchor: '97%',
                                    name: 'pallet_detail',
                                    fieldLabel: '특이사항'
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: 'Pallet 생성',
                    width: 450,
                    height: 250,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                                Ext.MessageBox.show({
                                    title: 'Pallet 생성',
                                    msg: '입력한 정보로 팔레트를 생성하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no" || btn == "cancel") {
                                            return;
                                        } else {
                                            var val = form.getValues(false);
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/sales/delivery.do?method=createBlankPallet',
                                                params: {
                                                    do_uid: rec.get('unique_id_long'),
                                                    pallet_uid: val['pallet_type'],
                                                    pallet_no: 0,
                                                    pallet_cnt: val['pallet_cnt'],
                                                    pallet_detail: val['pallet_detail']
                                                },
                                                success: function (val, action) {
                                                    Ext.Msg.alert('완료', '팔레트 생성이 완료되었습니다.');
                                                    gm.me().store.load();
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
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

        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractCompany'),
            store: this.poPrdDetailStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            simpleSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,
            // bbar: getPageToolbar(this.poPrdDetailStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },

            selModel: Ext.create('Ext.selection.CheckboxModel', {
                mode: 'SINGLE'
            }),

            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('selectedMtrl'),
                            html: this.getMC('msg_reg_prd_info_detail', '등록된 요청을 선택하십시오.'),
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addDlAndSledel,
                        this.rejectDeliveryOrder,
                        this.adjustRequestQuan,
                        this.palletLoadList,
                        this.palletDelete,
                        this.printShippingMark
                    ]
                }

            ],
            columns: [
                { text: this.getMC('msg_order_grid_prd_fam', '상태'), width: 80, style: 'text-align:center', dataIndex: 'pkListMakedYn', sortable: true },
                { text: this.getMC('msg_order_grid_prd_fam', '수주번호'), width: 100, style: 'text-align:center', dataIndex: 'order_number', sortable: true },
                { text: this.getMC('msg_order_grid_prd_fam', gm.getMC('CMD_Product', '제품군')), width: 100, style: 'text-align:center', dataIndex: 'class_name', sortable: true },
                { text: this.getMC('msg_order_grid_prd_name', '제품명'), width: 100, style: 'text-align:center', dataIndex: 'srcahd_item_name', sortable: true },
                {
                    text: '요청한수량', width: 100, style: 'text-align:center', dataIndex: 'pr_quan', align: 'right',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_order_grid_quan_desc', '실재고수량'), width: 100, style: 'text-align:center', dataIndex: 'real_stock_qty', sortable: true, align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'real_stock_qty') {
                            context.record.set('real_stock_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                { text: 'UNIT', width: 70, style: 'text-align:center', dataIndex: 'srcahd_unit_code', sortable: true },
                { text: this.getMC('msg_order_grid_prd_unitprice', '단가'), width: 80, style: 'text-align:center', decimalPrecision: 5, dataIndex: 'sales_price', sortable: true, align: 'right' },
                { text: this.getMC('msg_order_grid_prd_currency', '통화'), width: 80, style: 'text-align:center', dataIndex: 'reserved4', sortable: true },
                {
                    text: this.getMC('msg_order_grid_prd_delivery_date', '납기예정일'), xtype: 'datecolumn', width: 100, style: 'text-align:center', dataIndex: 'assymap_timestamp1', sortable: true,
                    format: 'Y-m-d', editor: { xtype: 'datefield', format: 'Y-m-d' },
                },


                {
                    text: this.getMC('msg_order_grid_quan_desc', '수주수량'), width: 100, style: 'text-align:center', dataIndex: 'assymap_bm_quan', sortable: true, align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'bm_quan') {
                            context.record.set('bm_quan', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },

            ],
            viewConfig: {
                getRowClass: function (record, index) {
                    var c = record.get('ctr_flag');
                    if (c == 'L') {
                        return 'green-row'
                    }
                    if (c == 'Y') {
                        return 'yellow-row'
                    }
                    if (c == 'D') {
                        return 'red-row'
                    }
                }
            },
            listeners: {
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
            },
            title: this.getMC('mes_reg_prd_info_msg', '출하요청 제품리스트'),
            name: 'po',
        });
        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    gm.me().addDlAndSledel.enable();
                    gm.me().rejectDeliveryOrder.enable();
                    gm.me().printShippingMark.enable();
                    gm.me().adjustRequestQuan.enable();
                    // gm.me().palletDelete.enable();
                } else {
                    gm.me().addDlAndSledel.disable();
                    gm.me().rejectDeliveryOrder.disable();
                    gm.me().printShippingMark.disable();
                    gm.me().adjustRequestQuan.disable();
                    // gm.me().palletDelete.disable();
                }
            }
        });

        //grid 생성.
        this.usePagingToolbar = false;
        this.createGrid(arr);
        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [
                {
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
        buttonToolbar.insert(1, this.createPallet);
        buttonToolbar.insert(2, this.modifyShipmentAction);
        buttonToolbar.insert(3, this.setDeliveryPlanAction);
        buttonToolbar.insert(4, this.deleteDoAction);
        buttonToolbar.insert(5, this.setCIPrintCi);
        this.callParent(arguments);
        // buttonToolbar.insert(1, this.barcodePrintAction);
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>> selections', selections);
                this.modifyShipmentAction.enable();
                this.createPallet.enable();
                this.deleteDoAction.enable();
                this.palletLoadList.enable();
                this.setDeliveryPlanAction.enable();
                this.palletDelete.enable();
                this.setCIPrintCi.enable();
                var rec = selections[0];
                console_logs('rec ???', rec);
                gu.getCmp('selectedMtrl').setHtml('[' + rec.get('po_no') + '] ' + rec.get('wa_name'));
                this.poPrdDetailStore.getProxy().setExtraParam('rtgast_uid', rec.get('unique_id_long'));
                this.poPrdDetailStore.load();
            } else {
                this.modifyShipmentAction.disable();
                this.createPallet.disable();
                this.deleteDoAction.disable();
                this.palletLoadList.disable();
                this.palletDelete.disable();
                this.setCIPrintCi.disable();
                this.setDeliveryPlanAction.disable();
            }
        })
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('having_not_status', 'BM,P0,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('multi_prd', true);
        this.store.getProxy().setExtraParam('exist_pallet_cnt', false);
        this.store.getProxy().setExtraParam('paging_not_use', true);
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
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_NEW_DIVISION' }),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_CONDITION' }),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_TYPE' }),
    searchPrdStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'PRD' }),
    searchAssyStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'ASSY' }),
    searchItemStore: Ext.create('Mplm.store.ProductStore', {}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SAMPLE_TYPE' }),

    printBarcode: function () {
        var form = Ext.create('Ext.form.Panel', {
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
                labelWidth: 60,
                margins: 10,
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '팔레트 개수를 입력하십시오.',
                    collapsible: true,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: { top: 0, right: 5, bottom: 0, left: 0 }
                        }
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '갯수 입력',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'vbox',

                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },

                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'print_qty',
                                    fieldLabel: '팔레트 개수',
                                    margin: '0 5 0 5',
                                    width: 200,
                                    allowBlank: false,
                                    value: 1,
                                    maxlength: '1',
                                },
                            ]
                        }
                    ]
                }
            ]
        });//Panel end...

        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;
        var uniqueIdArr = [];
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');
            uniqueIdArr.push(uid);
        }
        if (uniqueIdArr.length > 0) {
            prwin = gMain.selPanel.prbarcodeopen(form);
        }
    },

    prbarcodeopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '팔레트 생성',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    var uniqueIdArr = [];
                    var po_no_arr = [];
                    var pj_uids = [];
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('unique_id_long');
                        var po_no = rec.get('po_no');
                        var pj_uid = rec.get('coord_key3');
                        po_no_arr.push(po_no);
                        uniqueIdArr.push(uid);
                        pj_uids.push(pj_uid);
                    }
                    var form = gu.getCmp('formPanel').getForm();
                    form.submit({
                        url: CONTEXT_PATH + '/sales/delivery.do?method=printBarcodePalletBiot',
                        params: {
                            rtgastUids: uniqueIdArr,
                            po_no: po_no_arr,
                            pj_uids: pj_uids
                        },
                        success: function (val, action) {
                            prWin.close();
                            gm.me().showToast('결과', '팔레트 생성 후 팔레트 바코드가 출력되었습니다.');
                            gMain.selPanel.store.load(function () {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            gMain.selPanel.store.load(function () {
                            });
                        }
                    });
                }
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

    makePalletEl: function () {
        var saveStore = null;
        var tempBoxQuan = 0;
        var tempBoxWeight = 0;
        console_logs('>>>>>> makePalletEl', '');
        var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
        var selectionsOther = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
        console_logs('>>>>>', selectionsOther);
        console_logs('>>>>> selections', selections);
        gm.me().workListStore.getProxy().setExtraParam('srcahdUid', selectionsOther.get('srcahd_uid'));
        gm.me().workListStore.getProxy().setExtraParam('is_stock_yn', 'Y');
        gm.me().workListStore.load();
        gm.me().palletListStore.getProxy().setExtraParam('reserved_number2', selections.get('unique_id_long'));
        gm.me().palletListStore.load();
        var lotList = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: gm.me().workListStore,
            id: gu.id('prodUnitGrid'),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '70%',
            title: '입고 로트별 재고 List',
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
                    text: '고객사',
                    width: '20%',
                    dataIndex: 'wa_name',
                    style: 'text-align:center',
                    valueField: 'no',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '수주번호',
                    width: '20%',
                    dataIndex: 'orderNumber',
                    style: 'text-align:center',
                    valueField: 'order_number',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '생산LOT',
                    width: '15%',
                    dataIndex: 'pcs_desc_group',
                    style: 'text-align:center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '재고수량',
                    width: '18%',
                    xtype: 'numbercolumn',
                    dataIndex: 'real_wh_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '기적재수량',
                    width: '18%',
                    xtype: 'numbercolumn',
                    dataIndex: 'preload_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: 'BOX포장수',
                    width: '19%',
                    xtype: 'numbercolumn',
                    dataIndex: 'finance_rate',
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
        });


        var palletList = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: gm.me().palletListStore,
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '30%',
            title: '팔레트 List',
            autoScroll: true,
            margin: '0 0 0 10',
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
                    text: '팔레트 ID',
                    width: '15%',
                    dataIndex: 'po_no',
                    style: 'text-align:center',
                    valueField: 'no',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '적재수량',
                    width: '15%',
                    xtype: 'numbercolumn',
                    dataIndex: 'pallet_on_cnt',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    valueField: 'pallet_on_cnt',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },

            ],
            listeners: {

            },
            autoScroll: true,
        });
        var savelist = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('savelist'),
            store: new Ext.data.Store(),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '100%',
            title: '저장목록',
            autoScroll: true,
            margin: '10 0 0 5',
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
                    text: '팔레트',
                    width: '10%',
                    dataIndex: 'pallet',
                    style: 'text-align:center',
                    valueField: 'no',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                // {
                //     text: '품번',
                //     width: '13%',
                //     style: 'text-align:center',
                //     dataIndex: 'item_code',
                //     typeAhead: false,
                //     allowBlank: false,
                //     sortable: true,
                // },
                // {
                //     text: '규격',
                //     width: '12%',
                //     dataIndex: 'specification',
                //     style: 'text-align:center',
                //     format: '0,000',
                //     align: 'right',
                //     typeAhead: false,
                //     allowBlank: false,
                //     sortable: true,
                // },
                {
                    text: 'LOT NO',
                    width: '12%',
                    dataIndex: 'lotno',
                    style: 'text-align:center',
                    // format: '0,000',
                    // align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '제품수량',
                    width: '12%',
                    dataIndex: 'item_quan',
                    editor: 'numberfield',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'item_quan') {
                            context.record.set('item_quan', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: 'BOX 갯수',
                    width: '12%',
                    editor: 'numberfield',
                    dataIndex: 'box_quan',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'box_quan') {
                            context.record.set('box_quan', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },

                },
                {
                    text: '제품중량',
                    width: '12%',
                    editor : {
                        xtype : 'numberfield',
                        decimalPrecision: 1
                    },
                    // editor: 'numberfield',
                    // decimalPrecision: 2,
                    dataIndex: 'box_weight',
                    style: 'text-align:center',
                    // format: '0.0',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'box_weight') {
                            context.record.set('box_weight', Ext.util.Format.number(value, '0,000.0'));
                        }
                        return Ext.util.Format.number(value, '0,000.0');
                    },
                },
                {
                    text: 'description',
                    width: '16%',
                    dataIndex: 'description',
                    editor: 'textfield',
                    style: 'text-align:center',
                    typeAhead: false,
                    allowBlank: true,
                    sortable: true,
                },


            ],
            listeners: {
                beforeedit: function (editor, context) {
                    var record = gu.getCmp('savelist').getSelectionModel().getSelected().items[0];
                    var store = gu.getCmp('savelist').getStore();
                    if (record != null) {
                        if (context.field === 'box_quan') {
                            tempBoxQuan = record.get('box_quan');
                        }
                        if (context.field === 'box_weight') {
                            tempBoxWeight = record.get('box_weight');
                        }
                    }


                },

                edit: function (value, context, ditor, e, eOpts) {
                    var record = gu.getCmp('savelist').getSelectionModel().getSelected().items[0];
                    var store = gu.getCmp('savelist').getStore();
                    var loadList = gu.getCmp('prodUnitGrid').getSelectionModel().getSelected().items[0];
                    console_logs('>>>>>> context', context);
                    console_logs('>>>>>> value', value);
                    var store = gu.getCmp('savelist').getStore();
                    console_logs('record edit >>> ', record);

                    if (context.field === 'item_quan') {
                        var load_qty = Number(record.get('item_quan'));
                        console_logs('load_qty >>', load_qty);
                        var box_pkg_qty = Number(loadList.get('finance_rate'));
                        var gross_weight = Number(loadList.get('gross_weight'));
                        
                        var edit_box_qty = Math.ceil(load_qty / box_pkg_qty);
                        if(gross_weight === 0 || gross_weight === undefined) {
                            edit_box_qty = 0;
                        }
                        secondRecord = gu.getCmp('savelist').getStore().getAt(gu.getCmp('savelist').getStore().indexOf(record));
                        secondRecord.set('box_quan', edit_box_qty);

                        var setbox_weight = edit_box_qty * gross_weight;
                        secondRecord.set('box_weight', setbox_weight);
                        var total_load = 0;
                        console_logs('store Length', store.getCount());
                        var previous_store = store.data.items;
                        for (var i = 0; i < previous_store.length; i++) {
                            total_load = total_load + Number(previous_store[i].get('item_quan'));
                        }
                        gu.getCmp('total_load_disp').setHtml('<b>총 적재수량 : ' + gUtil.renderNumber(Number(total_load)));
                    }

                    if (context.field === 'box_quan') {
                        var box_pkg_qty = Number(loadList.get('finance_rate'));
                        var box_quan = Number(record.get('box_quan'));
                        var gross_weight = Number(loadList.get('gross_weight'));
                        var edit_load_quan = box_pkg_qty * box_quan;
                        secondRecord = gu.getCmp('savelist').getStore().getAt(gu.getCmp('savelist').getStore().indexOf(record));
                        // secondRecord.set('item_quan', edit_load_quan);
                        // 사용자 요청으로 일단 comment 처리

                        var setbox_weight = box_quan * gross_weight;
                        secondRecord.set('box_weight', setbox_weight);

                        var total_load = 0;
                        console_logs('store Length', store.getCount());
                        var previous_store = store.data.items;
                        for (var i = 0; i < previous_store.length; i++) {
                            total_load = total_load + Number(previous_store[i].get('item_quan'));
                        }
                        gu.getCmp('total_load_disp').setHtml('<b>총 적재수량 : ' + gUtil.renderNumber(Number(total_load)));

                    }
                    if (context.field === 'box_weight') {
                        console_logs('>>>> tempBoxWeight', tempBoxWeight);
                        console_logs('>>>> input', record.get('box_weight'));
                        if (tempBoxWeight > record.get('box_weight')) {
                            Ext.MessageBox.show({
                                title: '확인',
                                msg: '기존 계산된 BOX 중량보다 입력 갯수가 작습니다.<br>수정을 진행하시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (result) {
                                    if (result == 'yes') {
                                        secondRecord = gu.getCmp('savelist').getStore().getAt(gu.getCmp('savelist').getStore().indexOf(record));
                                        secondRecord.set('box_weight', record.get('box_weight'));
                                    } else {
                                        secondRecord = gu.getCmp('savelist').getStore().getAt(gu.getCmp('savelist').getStore().indexOf(record));
                                        secondRecord.set('box_weight', tempBoxWeight);
                                    }
                                },
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    }

                    if (context.field === 'item_quan') {
                        var sel = lotList.getSelectionModel().getSelected().items[0];
                        // var sel = this.lotList.getSelectionModel().getSelected().items[0];
                        if (sel.get('real_wh_qty') < record.get('item_quan')) {
                            Ext.MessageBox.show({
                                title: '알림',
                                msg: '재고수량보다 입력한 수량이 더 많습니다.<br> 다시 확인해주세요.',
                                buttons: Ext.MessageBox.YES,
                                fn: function (result) {
                                    if (result == 'yes') {
                                        secondRecord = gu.getCmp('savelist').getStore().getAt(gu.getCmp('savelist').getStore().indexOf(record));
                                        secondRecord.set('item_quan', sel.get('pr_quan'));
                                    }
                                },
                                icon: Ext.MessageBox.QUESTION
                            });
                        } else {
                            var store = gu.getCmp('savelist').getStore();
                            var total_load = 0;
                            console_logs('store Length', store.getCount());
                            var previous_store = store.data.items;
                            for (var i = 0; i < previous_store.length; i++) {
                                total_load = total_load + Number(previous_store[i].get('item_quan'));
                            }
                            gu.getCmp('total_load_disp').setHtml('<b>총 적재수량 : ' + gUtil.renderNumber(Number(total_load)));
                        }
                    }
                }
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
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
                        {
                            xtype: 'label',
                            width: 200,
                            height: 20,
                            id: gu.id('total_load_disp'),
                            html: '<b>총 적재수량 : 0</b>',
                            style: 'color:black;'
                        },
                        '->',
                        {
                            text: '저장목록 추가',
                            iconCls: 'af-plus',
                            listeners: [{
                                click: function () {
                                    var selection = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                                    var isInsert = true;
                                    var store = gu.getCmp('savelist').getStore();
                                    var palletListSel = palletList.getSelectionModel().getSelected().items[0];
                                    console_logs('Pallet List >>', palletListSel);
                                    var lotListSel = lotList.getSelectionModel().getSelected().items[0];
                                    console_logs('lotList >>', lotListSel);

                                    if (palletListSel != undefined && lotListSel != undefined) {
                                        for (var i = 0; i < store.length; i++) {
                                            var storeLot = store[i].get('lotno');
                                            if (storeLot === lotListSel.get('pcs_desc_group')) {
                                                Ext.MessageBox.alert('알림', '같은 LOT번호가 중복입력 되었습니다.');
                                                isInsert = false;
                                            }
                                            break;
                                        }
                                        

                                        var wh_qty = Number(lotListSel.get('real_wh_qty'));
                                        var preload_qty = Number(lotListSel.get('preload_qty'));
                                        console_logs('>>>> wh_qty ???', wh_qty);
                                        console_logs('>>>> preload_qty ???', preload_qty);
                                        if (wh_qty === preload_qty || wh_qty < preload_qty) {
                                            Ext.MessageBox.alert('알림', '이미 팔레트에 적재되었거나 재고수량보다 적재수량이 초과상태입니다.');
                                            return;
                                        }

                                        var item_quan = lotListSel.get('real_wh_qty') - preload_qty;
                                        var pr_quan = selection.get('pr_quan');
                                        var insertion_quan = 0.0;
                                        if (item_quan > pr_quan) {
                                            insertion_quan = pr_quan;
                                        } else {
                                            insertion_quan = item_quan;
                                        }

                                        var box_quan = insertion_quan / lotListSel.get('finance_rate');
                                        if (box_quan === null || box_quan === Infinity) {
                                            box_quan = 0;
                                        }

                                        var box_weight = lotListSel.get('gross_weight') * box_quan;
                                        if (isInsert == true) {
                                            store.insert(store.getCount(), new Ext.data.Record({
                                                'srcahd_uid': lotListSel.get('srcahd_uid'),
                                                'stoqty_uid': lotListSel.get('unique_id_long'),
                                                'pallet_uid': palletListSel.get('unique_id_long'),
                                                'pallet': palletListSel.get('po_no'),
                                                'item_code': lotListSel.get('item_code'),
                                                'specification': lotListSel.get('specification'),
                                                'lotno': lotListSel.get('pcs_desc_group'),
                                                'item_quan': insertion_quan,
                                                'project_uid': lotListSel.get('project_uid'),
                                                'box_quan': box_quan,
                                                'box_weight': box_weight,
                                                'description': ''
                                            }));

                                            var total_load = 0;
                                            console_logs('store Length', store.getCount());
                                            var previous_store = store.data.items;
                                            for (var i = 0; i < previous_store.length; i++) {
                                                total_load = total_load + Number(previous_store[i].get('item_quan'));
                                            }
                                        }
                                        console_logs('총 적재량 >>', total_load);
                                        gu.getCmp('total_load_disp').setHtml('<b>총 적재수량 : ' + gUtil.renderNumber(Number(total_load)));
                                    } else {
                                        Ext.MessageBox.alert('알림', '출고할 로트 리스트 또는 팔레트 리스트를 선택하지 않았습니다.<br>다시 확인해주세요.')
                                    }

                                }
                            }]
                        },
                        {
                            text: '저장목록 삭제',
                            iconCls: 'af-remove',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('savelist').getSelectionModel().getSelected().items[0];
                                    if (record == null) {
                                        Ext.MessageBox.alert('알림', '삭제할 항목을 선택하십시오.')
                                        return;
                                    } else {
                                        var store = gu.getCmp('savelist').getStore();
                                        gu.getCmp('savelist').getStore().removeAt(gu.getCmp('savelist').getStore().indexOf(record));
                                        var total_load = 0;
                                        console_logs('store Length', store.getCount());
                                        var previous_store = store.data.items;
                                        for (var i = 0; i < previous_store.length; i++) {
                                            total_load = total_load + Number(previous_store[i].get('item_quan'));
                                        }
                                        gu.getCmp('total_load_disp').setHtml('<b>총 적재수량 : ' + gUtil.renderNumber(Number(total_load)));
                                    }
                                }
                            }]
                        },
                    ]
                })
            ],
        });

        var form = Ext.create('Ext.form.Panel', {
            id: 'addDlForm',
            xtype: 'form',
            title: '아래 리스트를 선택 후 추가하여 팔레트를 구성하십시오.',
            frame: false,
            border: false,
            region: 'center',
            width: '100%',
            layout: 'vbox',
            bodyPadding: 10,
            items: [
                {
                    xtype: 'label',
                    width: 750,
                    height: 80,
                    html: '<font size=100><p style="text-align:left;">&nbsp&nbsp모델명 : ' + selectionsOther.get('srcahd_item_name') + '<br>&nbsp&nbsp품번 : ' + selectionsOther.get('srcahd_item_code') + '<br>&nbsp&nbsp규격 : ' + selectionsOther.get('srcahd_specification') + '<br>&nbsp&nbsp요청수량 : ' + gUtil.renderNumber(Number(selectionsOther.get('pr_quan'))) + '</p></font>',
                    style: 'color:black;'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '99%',
                    margin: '3 3 3 3',
                    items: [
                        lotList,
                        palletList
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '99%',
                    margin: '20 3 3 3',
                    items: [
                        savelist
                    ]
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: true,
            title: gm.me().getMC('msg_btn_prd_extra_add', '팔레트 구성'),
            width: 800,
            height: 700,
            plain: true,
            overflowY: 'scroll',
            items: form,
            buttons: [
                {
                    text: gm.getMC('CMD_Configuration_configuration', '팔레트 구성'),
                    handler: function (btn) {
                        if (btn == "no" || btn == "cancel") {
                            win.close();
                        } else {
                            var form = Ext.getCmp('addDlForm').getForm();
                            if (form.isValid()) {
                                // win.setLoading(true);
                                var val = form.getValues(false);
                                var mainGrid = gm.me().grid.getSelectionModel().getSelected().items[0];
                                var subGrid = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                                var loadList = gu.getCmp('prodUnitGrid').getSelectionModel().getSelected().items[0];
                                var storeData = gu.getCmp('savelist').getStore();
                                var length = storeData.data.items.length;
                                var isAct = true;
                                var itemQuanArr = [];
                                var boxQuanArr = [];
                                var boxWeighArr = [];
                                if (length > 0) {
                                    var objs = [];
                                    var columns = [];
                                    var obj = {};
                                    var total_load = 0;

                                    for (var j = 0; j < storeData.data.items.length; j++) {
                                        var item = storeData.data.items[j];
                                        var objv = {};
                                        objv['srcahd_uid'] = item.get('srcahd_uid');
                                        objv['stoqty_uid'] = item.get('stoqty_uid');
                                        objv['pallet_uid'] = item.get('pallet_uid');
                                        objv['pallet'] = item.get('pallet');
                                        objv['item_code'] = item.get('item_code');
                                        objv['specification'] = item.get('specification');
                                        objv['lotno'] = item.get('lotno');
                                        objv['item_quan'] = item.get('item_quan');
                                        objv['project_uid'] = item.get('project_uid');
                                        objv['box_quan'] = item.get('box_quan');
                                        objv['box_weight'] = item.get('box_weight');
                                        objv['description'] = item.get('description');
                                        columns.push(objv);
                                        total_load = total_load + Number(item.get('item_quan'));
                                        itemQuanArr.push(Number(item.get('item_quan')));
                                        boxQuanArr.push(Number(item.get('box_quan')));
                                        boxWeighArr.push(Number(item.get('box_weight')));
                                    }
                                    obj['datas'] = columns;
                                    objs.push(obj);
                                    var jsonData = Ext.util.JSON.encode(objs);

                                    // if (itemQuanArr.length > 0) {
                                        // for (var k = 0; k < itemQuanArr.length; k++) {
                                        //     console_logs('itemQuanArr[k] >>', itemQuanArr[k]);
                                        //     var compareValue1 = 0.0;
                                        //     var compareValue2 = 0.0;
                                        //     var compareValue3 = 0.0;
                                        //     var compareValue3_extend = 0.0;
                                        //     var compareValue4 = 0.0;
                                        //     compareValue1 = boxQuanArr[k] * loadList.get('finance_rate');
                                        //     compareValue2 = (boxQuanArr[k] - 1) * loadList.get('finance_rate');
                                        //     compareValue3 = Math.ceil(boxQuanArr[k] * loadList.get('gross_weight'));
                                        //     compareValue4 = Math.ceil((boxQuanArr[k] - 1) * loadList.get('gross_weight'));
                                        //     compareValue3_extend = Math.ceil(Number(boxWeighArr[k] * 1.05));
                                        //     compareValue4_extend = Math.ceil(boxWeighArr[k] - Number(boxWeighArr[k] * 0.95));
                                            // TODO : 추가 판별로직 별도 필요.
                                            // console_logs('>>> 첫번째 비교해야할 값', compareValue1);
                                            // console_logs('>>> 두번째 비교해야할 값', compareValue2);
                                            // console_logs('>>> 세번째 비교해야할 값', compareValue3);
                                            // console_logs('>>> 저장중량의 105% 초과', compareValue3_extend);
                                            // console_logs('>>> 네번째 비교해야할 것', compareValue4);
                                            // console_logs('>>> 저장중량의 95% 미만', compareValue4_extend);
                                            // if (compareValue1 > itemQuanArr[k]) {
                                            //     Ext.MessageBox.show({
                                            //         title: '확인',
                                            //         msg: 'Box 개수 * Box 포장수보다 많은 수량이 입력된 값이 있습니다.<br> 계속 진행하시겠습니까?',
                                            //         buttons: Ext.MessageBox.YESNO,
                                            //         fn: function (result) {
                                            //             if (result == 'yes') {
                                            //                 isAct = true;
                                            //             } else {
                                            //                 isAct = false;
                                            //             }
                                            //         },
                                            //         icon: Ext.MessageBox.QUESTION
                                            //     });
                                            // }

                                            // if (compareValue2 > itemQuanArr[k]) {
                                            //     Ext.MessageBox.show({
                                            //         title: '확인',
                                            //         msg: '(Box 개수 -1) * Box 포장수보다 작은값이 있습니다.<br> 계속 진행하시겠습니까?',
                                            //         buttons: Ext.MessageBox.YESNO,
                                            //         fn: function (result) {
                                            //             if (result == 'yes') {
                                            //                 isAct = true;
                                            //             } else {
                                            //                 isAct = false;
                                            //             }
                                            //         },
                                            //         icon: Ext.MessageBox.QUESTION
                                            //     });
                                            // }

                                            // if (compareValue3 >= compareValue3_extend) {
                                            //     Ext.MessageBox.show({
                                            //         title: '확인',
                                            //         msg: 'Box 개수 * Box 중량보다 저장할 중량이 105% 초과가 발생하였습니다<br> 계속 진행하시겠습니까?',
                                            //         buttons: Ext.MessageBox.YESNO,
                                            //         fn: function (result) {
                                            //             if (result == 'yes') {
                                            //                 isAct = true;
                                            //             } else {
                                            //                 isAct = false;
                                            //             }
                                            //         },
                                            //         icon: Ext.MessageBox.QUESTION
                                            //     });
                                            // }

                                            // if (compareValue4_extend >= compareValue4) {
                                            //     Ext.MessageBox.show({
                                            //         title: '확인',
                                            //         msg: '(Box 개수 -1) * Box 중량보다 저장할 중량이 95% 미만의 값이 발생하였습니다<br> 계속 진행하시겠습니까?',
                                            //         buttons: Ext.MessageBox.YESNO,
                                            //         fn: function (result) {
                                            //             if (result == 'yes') {
                                            //                 isAct = true;
                                            //             } else {
                                            //                 isAct = false;
                                            //             }
                                            //         },
                                            //         icon: Ext.MessageBox.QUESTION
                                            //     });
                                            // }

                                            // if (isAct === false) {
                                            //     break;
                                            // } else {
                                            //     continue;
                                            // }
                                        // }
                                    // }

                                    // 요청수량보다 적게 적재할 경우 적재중인 상태로 띄우고
                                    // 요청수량하고 일치했을 때에만 
                                    if (isAct === true) {
                                        // if (total_load > Number(subGrid.get('pr_quan'))) {
                                        //     console_logs('Total Load >>', total_load);
                                        //     console_logs('Pr Quan >>', Number(subGrid.get('pr_quan')));
                                        //     Ext.MessageBox.alert('알림', '요청수량보다 적재수량이 더 많습니다.<br>다시 확인해 주십시오.');
                                        //     win.setLoading(false);
                                        //     return;
                                        // } else if (total_load < Number(subGrid.get('pr_quan'))) {
                                        //     console_logs('Total Load >>', total_load);
                                        //     console_logs('Pr Quan >>', Number(subGrid.get('pr_quan')));
                                        //     Ext.MessageBox.alert('알림', '요청수량과 적재수량이 미일치 합니다<br>다시 확인해 주십시오,');
                                        //     win.setLoading(false);
                                        // } else {
                                            form.submit({
                                                submitEmptyText: false,
                                                url: CONTEXT_PATH + '/sales/delivery.do?method=configurePalletList',
                                                params: {
                                                    jsonData: jsonData,
                                                    cartmapUid: subGrid.get('unique_id_long'),
                                                    rtgast_do_uid: mainGrid.get('unique_id_long'),
                                                    projectUid: subGrid.get('project_uid')
                                                },
                                                success: function (val, action) {
                                                    win.setLoading(false);
                                                    gm.me().store.load();
                                                    gm.me().poPrdDetailStore.load();
                                                    win.close();
                                                },
                                                failure: function () {
                                                    win.setLoading(false);
                                                    extjsUtil.failureMessage();
                                                }
                                            });
                                        // }
                                    }
                                } else {
                                    Ext.MessageBox.alert('알림', '저장목록 정보가 없습니다.')
                                    // win.setLoading(false);
                                }
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
    },


    selMode: 'SINGLE',
    workListStore: Ext.create('Rfx2.store.company.bioprotech.PStockOfProdStore'),
    palletListStore: Ext.create('Rfx2.store.company.bioprotech.PalletListStore'),
});