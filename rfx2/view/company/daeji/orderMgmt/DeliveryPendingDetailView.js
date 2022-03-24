//생산완료 현황
/*
    flag1 : 출하바코드 사용 여부 (바코드 출력버튼 노출 여부)
*/
Ext.define('Rfx2.view.company.daeji.orderMgmt.DeliveryPendingDetailView', {
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

        this.addSearchField({
            type: 'dateRange',
            field_id: 'search_date',
            text: "출하요청일",
            labelWidth: 60,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
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

        this.createStore('Rfx2.model.company.chmr.PrdShipmentCartmap', [{
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

        this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdShipmentCartmapVerStore', {});


        this.addDlAndSledel = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: gm.getMC('CMD_Configuration_configuration', '팔레트 구성'),
            tooltip: this.getMC('msg_btn_prd_add', '팔레트 구성'),
            disabled: true,
            handler: function () {
                var selection = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                var real_stock_qty = selection.get('stock_qty');
                var pr_quan = selection.get('pr_quan');
                if (pr_quan > real_stock_qty) {
                    Ext.MessageBox.alert('알림', '현 재고보다 요청수량이 큽니다.<br>다시 확인해주세요.');
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

        // this.barcodePrintAction = Ext.create('Ext.Action', {
        //     iconCls: 'barcode',
        //     disabled: true,
        //     text: '바코드 출력',
        //     handler: function () {
        //         gm.me().printBarcode();
        //     }
        // });

        // this.printBarcodeAction = Ext.create('Ext.Action', {
        //     iconCls: 'barcode',
        //     text: '바코드 출력',
        //     tooltip: '제품의 바코드를 출력합니다.',
        //     disabled: true,
        //     handler: function () {
        //         gMain.selPanel.printBarcode();
        //     }
        // });

        //buttonToolbar.insert(6, this.printBarcodeAction);

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

        this.printDo = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: gm.getMC('CMD_Shipment_request_report', '출하요청서'),
            tooltip: '출하요청서 출력을 합니다.',
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var rtgastUid = rec.get('unique_id_long');
                var dl_uids = rec.get('dl_uids');
                var ciNo = rec.get('reserved_varchar2');
                console_logs('>>>> ci', ciNo);
                // if (ciNo.length === 0) {
                //     Ext.MessageBox.show({
                //         title: 'C/I 출력',
                //         msg: '선택 한 요청건의 C/I 번호를 발행 후 출력합니다.<br>단, 출하리스트 전체가 팔레트 적재가 안되있을 경우 일련번호 발행 및 출력이 불가합니다.',
                //         buttons: Ext.MessageBox.YESNO,
                //         icon: Ext.MessageBox.QUESTION,
                //         fn: function (btn) {
                //             if (btn == "no") {
                //                 return;
                //             } else {
                //                 Ext.Ajax.request({
                //                     url: CONTEXT_PATH + '/sales/delivery.do?method=issueCi',
                //                     params: {
                //                         rtgastUid: rtgastUid
                //                     },
                //                     success: function (result, request) {
                //                         console_logs('>>>> result', result.responseText);
                //                         var resText = result.responseText;
                //                         if (resText === true) {
                //                             // 여기에 PDF 프린트 명령 실행
                //                             gm.me().store.load();


                //                         } else {
                //                             Ext.MessageBox.alert('알림', '출하리스트 전체가 팔레트 적재확인이 되지 않았습니다.<br>팔레트 적재 후 발행하십시오.')
                //                         }
                //                     },
                //                     failure: function (result, request) {
                //                         // var result = result.responseText;
                //                         // Ext.MessageBox.alert('알림', result);
                //                     }
                //                 });
                //             }
                //         }
                //     });
                // } else {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printDo',
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
                // }

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
                                        if (resText === true) {
                                            // 여기에 PDF 프린트 명령 실행
                                            gm.me().store.load();


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
                var detailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdShipmentPackingListVerStore', {});
                if (rec.get('dl_uids').length > 0) {
                    detailStore.getProxy().setExtraParam('dl_uids', rec.get('dl_uids'));
                } else {
                    detailStore.getProxy().setExtraParam('dl_uids', '-1');
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
                        { text: "제품명", flex: 2.5, style: 'text-align:center', dataIndex: 'srcahd_item_name', sortable: true },
                        { text: "기준모델", flex: 2, dataIndex: 'description', style: 'text-align:center', sortable: true },
                        { text: "규격", flex: 2, dataIndex: 'specification', style: 'text-align:center', sortable: true },
                        { text: "LOT NO", flex: 2, dataIndex: 'lot_no', style: 'text-align:center', sortable: true },
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
                    var maxEditQuan = Number(rec.get('sales_amount')) - Number(rec.get('already_delivery_quan'));
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
                                        html: '<p style="text-align:left;">&nbsp수주수량 : ' + gUtil.renderNumber(rec.get('sales_amount')) + '<br>&nbsp기출고수량 : ' + gUtil.renderNumber(rec.get('already_delivery_quan')) + '<br>&nbsp최대 수정 가능수량 : ' + gUtil.renderNumber(maxEditQuan) + '<br> </p>',
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
            // iconCls: 'af-plus',
            text: '납품서 생성',
            tooltip: '납품서 생성',
            disabled: true,
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var combstUids = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    console_logs('>>> rec', rec);
                    if (i > 0) {
                        var before = selections[i - 1];
                        var after = rec.get('combst_uid');
                        var before_combst = before.get('combst_uid');
                        if (before_combst != after) {
                            Ext.MessageBox.alert('알림', '같은 고객사를 선택하십시오.');
                            isAct = false;
                            break;
                        } else {
                            isAct = true;
                        }
                    } else {
                        isAct = true;
                    }
                }

                if (isAct === true) {
                    var srcahdUids = [];
                    var doUids = [];
                    var cartmapUids =  [];
                    var projectUids  = [];
                    var prQuans = [];
                    var sloastUids = [];
                    var combstUids = [];
                    var SumPrQuans = 0;
                    var real_stock_qty_stosum = 0;
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        srcahdUids.push(rec.get('srcahd_uid'));
                        doUids.push(rec.get('do_uid'));
                        cartmapUids.push(rec.get('unique_id_long'));
                        prQuans.push(rec.get('pr_quan'));
                        projectUids.push(rec.get('project_uid'));
                        sloastUids.push(rec.get('sloast_uid'));
                        combstUids.push(rec.get('combst_uid'));
                    }

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        SumPrQuans = SumPrQuans + rec.get('pr_quan');
                        real_stock_qty_stosum = real_stock_qty_stosum + rec.get('real_stock_qty_stosum');
                    }

                    Ext.MessageBox.show({
                        title: '납품서 생성',
                        msg: '선택한 품목과 요청건으로 납품서 생성을 하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no" || btn == "cancel") {
                                return;
                            } else {

                                if (SumPrQuans > real_stock_qty_stosum) {
                                    Ext.MessageBox.alert('경고', '납품예정 수량이 현재 재고 수량보다 많습니다.');
                                }else {
                                // var val = form.getValues(false);
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/delivery.do?method=generalDeliveryProcess',
                                    params: {
                                        combst_uids : combstUids,
                                        sloastUids : sloastUids,
                                        projectUids : projectUids,
                                        prQuans : prQuans,
                                        cartmapUids : cartmapUids,
                                        doUids : doUids,
                                        srcahdUids : srcahdUids
                                    },
                                    success: function (val, action) {
                                        Ext.Msg.alert('완료', '납품서 생성이 완료되었습니다.');
                                        gm.me().store.load();
                                        // if (prWin) {
                                        //     prWin.close();
                                        // }
                                    },
                                    failure: function (val, action) {

                                    }
                                });
                            }
                          }
                        }
                    });
                }

            }
        });

        this.cancelRequest = Ext.create('Ext.Action',{
            text : '요청취소',
            tooltip : '요청취소',
            disabled : true,
            handler : function () {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    console_logs('>>> rec', rec);
                    if (i > 0) {
                        var before = selections[i - 1];
                        var after = rec.get('do_uid');
                        var before_rtgastuid = before.get('do_uid');
                        if (before_rtgastuid != after) {
                            Ext.MessageBox.alert('알림', '같은 요청번호를 선택하십시오.');
                            isAct = false;
                            break;
                        } else {
                            isAct = true;
                        }
                    } else {
                        isAct = true;
                    }
                } // for
                if(isAct === true){
                    var cartmapUids = [];
                    var doUids = rec.get('do_uid');
                    
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        cartmapUids.push(rec.get('unique_id_long'));
                    }//for

                    Ext.MessageBox.show({
                        title : '요청취소',
                        msg : '선택한 요청건을 삭제 하시겠습니까?',
                        buttons : Ext.MessageBox.YESNO,
                        icon : Ext.MessageBox.QUESTION,
                        fn : function(btn){
                            if(btn == "no" || btn == "cancel") {
                                return;
                            }else{
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/delivery.do?method=cancelRequest',
                                    params: {
                                        cartmapUids : cartmapUids,
                                        doUids : doUids
                                    },
                                    success: function (val, action) {
                                        Ext.Msg.alert('완료', '해당 요청건 삭제가 완료되었습니다.');
                                        gm.me().store.load();
                                    },
                                    failure: function (val, action) {
                                    }
                                }) //Ajax
                            } //else
                        } //fn
                    }) //MessageBox
                } //if
            } //handler
        }) //cancelRequest


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
                    text: this.getMC('msg_order_grid_quan_desc', '실재고수량'), width: 100, style: 'text-align:center', dataIndex: 'stock_qty', sortable: true, align: 'right',
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
                    text: this.getMC('msg_order_grid_prd_delivery_date', '납기예정일'), xtype: 'datecolumn', width: 100, style: 'text-align:center', dataIndex: 'gr_date', sortable: true,
                    format: 'Y-m-d', editor: { xtype: 'datefield', format: 'Y-m-d' },
                },


                {
                    text: this.getMC('msg_order_grid_quan_desc', '수주수량'), width: 100, style: 'text-align:center', dataIndex: 'sales_amount', sortable: true, align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sales_amount') {
                            context.record.set('sales_amount', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },

            ],
            viewConfig: {
                getRowClass: function (record, index) {
                    var c = record.get('ctr_flag');
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
                    width: '100%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, /**this.gridContractCompany**/
            ]
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.createPallet);
        // buttonToolbar.insert(2, this.modifyShipmentAction);
        // buttonToolbar.insert(3, this.setDeliveryPlanActio1n);
        // buttonToolbar.insert(4, this.deleteDoAction);
        // buttonToolbar.insert(5, this.setCIPrintCi);
        // buttonToolbar.insert(6, this.printDo);
        this.callParent(arguments);
        if(this.flag1 == 'Y'){
            buttonToolbar.insert(1, this.barcodePrintAction);
        }
        if(this.flag2 === 'Y'){
            buttonToolbar.insert(2, this.cancelRequest);
        }
        
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>> selections', selections);
                this.createPallet.enable();
                this.cancelRequest.enable();
                this.modifyShipmentAction.enable();
                this.deleteDoAction.enable();
                this.setDeliveryPlanAction.enable();
                this.setCIPrintCi.enable();
                //this.barcodePrintAction.enable();
                this.printDo.enable();
                var rec = selections[0];
                console_logs('rec ???', rec);
                // gu.getCmp('selectedMtrl').setHtml('[' + rec.get('po_no') + '] ' + rec.get('wa_name'));
                // this.poPrdDetailStore.getProxy().setExtraParam('rtgast_uid', rec.get('unique_id_long'));
                // this.poPrdDetailStore.load();
            } else {
                this.modifyShipmentAction.disable();
                this.createPallet.disable();
                this.cancelRequest.disable();
                //this.barcodePrintAction.disable();
                this.deleteDoAction.disable();
                this.setCIPrintCi.disable();
                this.printDo.disable();
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

    //추가작성 바코드 메소드
//     printBarcode: function () {

//         var form = Ext.create('Ext.form.Panel', {
//             id: gu.id('formPanel'),
//             xtype: 'form',
//             frame: false,
//             border: false,
//             bodyPadding: '3 3 0',
//             region: 'center',
//             fieldDefaults: {
//                 labelAlign: 'right',
//                 msgTarget: 'side'
//             },
//             defaults: {
//                 anchor: '100%',
//                 labelWidth: 60,
//                 margins: 10,
//             },
//             items: [
//                 {
//                     xtype: 'fieldset',
//                     title: '입력',
//                     collapsible: true,
//                     defaults: {
//                         labelWidth: 60,
//                         anchor: '100%',
//                         layout: {
//                             type: 'hbox',
//                             defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
//                         }
//                     },
//                     items: [
//                         //1장만 출력해서 전표에 붙이므로 출력매수는 삭제
//                         {

//                             xtype: 'fieldcontainer',
//                             fieldLabel: '출력매수',
//                             combineErrors: true,
//                             msgTarget: 'side',
//                             layout: 'vbox',
                            
//                             defaults: {
//                                 flex: 1,
//                                 hideLabel: true,
//                             },

//                             items: [
//                                 {
//                                     xtype: 'numberfield',
//                                     name: 'print_qty',
//                                     fieldLabel: '출력매수',
//                                     margin: '0 5 0 5',
//                                     width: 200,
//                                     allowBlank: false,
//                                     value: 1,
//                                     maxlength: '1',
//                                 },

//                                 {
//                                     xtype: 'radiogroup',
//                                     fieldLabel: '출력 구분',
//                                     margin: '0 5 0 5',
//                                     width: 200,
//                                     allowBlank: false,

//                                         //1장만 출력

//                                     items: [
//                                         {boxLabel: '개별', name: 'print_type', inputValue: 'EACH', checked: true}
//                                         // ,{boxLabel: '동일', name: 'print_type', inputValue: 'SAME'},
//                                     ]

//                                 }


//                             ]  // end of itmes

//                         }  // end of fieldcontainer

//                     ]
//                 }
//             ]

//         });//Panel end...

//         var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
//         var counts = 0;

//         var uniqueIdArr = [];

//         for (var i = 0; i < selections.length; i++) {
//             var rec = selections[i];
//             var uid = rec.get('unique_id');  //Srcahd unique_id
//             uniqueIdArr.push(uid);
//         }

//         if (uniqueIdArr.length > 0) {
//             prwin = gMain.selPanel.prbarcodeopen(form);
//         }
//     },

// //     //바코드 추가작성
//     prbarcodeopen: function (form) {

//         prWin = Ext.create('Ext.Window', {
//             modal: true,
//             title: '바코드 출력',
//             plain: true,
//             items: form,
//             buttons: [{
//                 text: CMD_OK,
//                 handler: function () {

//                     var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

//                     var uniqueIdArr = [];
//                     var bararr = [];
//                     var po_no_arr = [];
//                     var reserved_double1_arr = [];
//                     var pj_code_arr = [];
  
//                     //회사이름 추가작성
//                     var wa_nameArr = [];

//                     for (var i = 0; i < selections.length; i++) {
//                         var rec = selections[i];

//                      //추가작성 01 28
//                     console_logs("셀렉션 i 출력 >>> " , selections[i] );
                        
//                         var uid = rec.get('do_uid');  //Product unique_id -> cartmapuid

//                         var item_code = rec.get('srcahd_item_code');
//                         var item_name = rec.get('srcahd_item_name'); 
//                         var specification = rec.get('srcahd_specification'); 
                        
//                         var reserved_double1 = rec.get('pr_quan'); 
//                         //추가작성
//                         var wa_name = rec.get('combst_wa_name'); 
//                         wa_nameArr.push(wa_name);

//                         var bar_spec =  
//                         '<' + item_code + '>'+ '|' + item_name + '|' +specification;

//                         uniqueIdArr.push(uid);
//                         bararr.push(bar_spec);
//                         reserved_double1_arr.push(reserved_double1);
                        
//                         //추가작성
//                         var po_no = rec.get('po_no');
//                         po_no_arr.push(po_no);
//                         console_logs( 'po_no >>>>>>>>>>>>>>' , po_no);

//                         var pj_code = rec.get('pj_code');
//                         pj_code_arr.push(pj_code)
//                         console_logs( 'pj_code >>>>>>>>>>>>>>' , pj_code);
//                     }

//                     var form = gu.getCmp('formPanel').getForm();


//                     //바코드 출력 회사별 분기
                
//                     if(vCompanyReserved4=='MJCM01KR') {
//                         console_logs("MJCM01KR  분기 출력 >>>", reserved_double1_arr)
//                         form.submit({
//                             url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeDelivery',
//                             params: {
//                                 rtgastUids: uniqueIdArr,
//                                 barcodes: bararr,
//                                 po_no : po_no_arr,

//                                 //원본
//                                 order_multiple : reserved_double1_arr,
//                                 //order_multiple : 1,

                                
//                                 pj_code_arr : pj_code_arr,
//                                 wa_name : wa_nameArr
//                             },
//                             success: function (val, action) {
//                                 prWin.close();
//                                 gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
//                                 gMain.selPanel.store.load(function () {
//                                 });
//                             },
//                             failure: function (val, action) {
//                                 prWin.close();
//                                 Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
//                                 gMain.selPanel.store.load(function () {
//                                 });
//                             }
//                         });

//                     }else {
//                             //국송
//                         form.submit({
//                             url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeDelivery',
//                             params: {
//                                 rtgastUids: uniqueIdArr,
//                                 barcodes: bararr,
//                                 po_no : po_no_arr,
//                                 order_multiple : reserved_double1_arr,
//                                 pj_code_arr : pj_code_arr,
//                                 wa_name : wa_nameArr
//                             },
//                             success: function (val, action) {
//                                 prWin.close();
//                                 gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
//                                 gMain.selPanel.store.load(function () {
//                                 });
//                             },
//                             failure: function (val, action) {
//                                 prWin.close();
//                                 Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
//                                 gMain.selPanel.store.load(function () {
//                                 });
//                             }
//                         });


//                       }//else 끝

                   


//                 }//btn handler
//             }, {
//                 text: CMD_CANCEL,
//                 handler: function () {
//                     if (prWin) {

//                         prWin.close();

//                     }
//                 }
//             }]
//         });
//       prWin.show();
//  }//바코드관련 끝
});