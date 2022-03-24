//생산완료 현황
Ext.define('Rfx2.view.company.sejun.salesDelivery.DeliveryPendingDetailVerView', {
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
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'COPY', 'EDIT', 'REMOVE', 'EXCEL'
            ]
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

        this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdShipmentCartmapVerStore', {});


        this.addDlAndSledel = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: '일부인 지정',
            // tooltip: this.getMC('msg_btn_prd_add', '팔레트 구성'),
            disabled: true,
            handler: function () {
                var selection = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                var real_stock_qty = selection.get('real_stock_qty_stosum');
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
                    var codeStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'LABEL_PRINTERS'});
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
                var shipmentTypeStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'SHIPMENT_TYPE'});
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
                var shipmentTypeStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'SHIPMENT_TYPE'});
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
                var ciNo = rec.get('reserved_varchar5');
                console_logs('>>>> ci', ciNo);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printCI',
                    params: {
                        rtgast_uid: rtgastUid,
                        ciNo: ciNo,
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
                    },
                    failure: function (result, request) {
                    }
                });
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

        this.downloadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: 'Excel',
            disabled: false,
            handler: function () {
                gm.setCenterLoading(true);
                var rec = gm.me().grid.getSelectionModel().getSelected().items[0];
                var store = Ext.create('Rfx2.store.company.bioprotech.DeliveryOrderListStore', {});
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                // store.getProxy().setExtraParam('dl_uids', rec.get('dl_uids'))
                store.getProxy().setExtraParam("menuCode", 'SDL2_EXL');

                // store.getProxy().setExtraParam('orderBy', 'item_code');
                var items = searchToolbar.items.items;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    store.getProxy().setExtraParam(item.name, item.value);
                }
                var arrField = gm.me().gSearchField;
                try {
                    Ext.each(arrField, function (fieldObj, index) {
                        console_log(typeof fieldObj);
                        var dataIndex = '';
                        if (typeof fieldObj == 'string') { //text search
                            dataIndex = fieldObj;
                        } else {
                            dataIndex = fieldObj['field_id'];
                        }
                        var srchId = gm.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
                        var value = Ext.getCmp(srchId).getValue();
                        if (value != null && value != '') {
                            if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
                                store.getProxy().setExtraParam(dataIndex, value);
                            } else {
                                var enValue = Ext.JSON.encode('%' + value + '%');
                                console_info(enValue);
                                store.getProxy().setExtraParam(dataIndex, enValue);
                            }//endofelse
                        }//endofif

                    });
                } catch (noError) {
                }

                store.load({
                    scope: this,
                    callback: function (records, operation, success) {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                            params: {
                                mc_codes: gUtil.getMcCodes()
                            },
                            success: function (response, request) {
                                gm.setCenterLoading(false);
                                //console_logs('response.responseText', response.responseText);
                                store.getProxy().setExtraParam("srch_type", null);
                                var excelPath = response.responseText;
                                if (excelPath != null && excelPath.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                    top.location.href = url;

                                } else {
                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                }
                            }
                        });

                    }
                });
            }
        });

        this.combineDeliveryOrder = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '요청결합',
            tooltip: '두개의 출하요청을 결합합니다.',
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection();
                console_logs('rec >>', rec);
                var before_combst_uid = -1;
                var isCombine = true;
                for (var i = 0; i < rec.length; i++) {
                    var recc = rec[i];
                    console_logs('>> recc', recc);
                    if (i == 0) {
                        before_combst_uid = recc.get('combst_final_uid');
                    } else {
                        var present_combst_uid = recc.get('combst_final_uid');
                        if (before_combst_uid !== present_combst_uid) {
                            Ext.MessageBox.alert('알림', '다른 고객명으로 생성된 요청은 결합이 불가합니다.');
                            isCombine = false;
                        } else {
                            isCombine = true;
                        }
                    }
                }

                if (isCombine == true) {
                    var recRe = gm.me().grid.getSelectionModel().getSelection();
                    var one_do_uid = -1;
                    var two_do_uid = -1;
                    for (var i = 0; i < recRe.length; i++) {
                        var recc = recRe[i];
                        console_logs('>> recc', recc);
                        if (i === 0) {
                            one_do_uid = recc.get('unique_id_long');
                        } else if (i === 1) {
                            two_do_uid = recc.get('unique_id_long');
                        }
                    }

                    Ext.MessageBox.show({
                        title: '요청결합',
                        msg: '선택한 두개의 요청을 결합하시겠습니까?<b><br><br>본 작업을 실행 시 취소가 불가하며<br><font color=red>기존에 적재된 팔레트 적재는 취소되며 팔레트 재 적재를 시행하시기 바랍니다.</b>',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no" || btn == "cancel") {
                                return;
                            } else {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/delivery.do?method=combineDeliveryOrder',
                                    params: {
                                        one_do_uid: one_do_uid,
                                        two_do_uid: two_do_uid
                                    },
                                    success: function (result, request) {
                                        Ext.MessageBox.alert('알림', '결합 처리되었습니다.');
                                        gm.me().store.load();
                                        gm.me().poPrdDetailStore.load();
                                    }, // endofsuccess
                                    failure: extjsUtil.failureMessage
                                });
                            }
                        }
                    });
                } else {
                    console_logs('>>> console', '요청결합 불가.')
                }
            }
        });


        this.procDeliveryAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '출하처리',
            // tooltip: this.getMC('msg_btn_prd_add', '삭제'),
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                Ext.MessageBox.show({
                    title: '출하처리',
                    msg: '선택한 요청에 대한 제품을 출하처리 하시겠습니까?<br><b>일부인이 지정된 제품에 대해서만 출하처리가 됩니다.<b>',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == "yes") {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales/delivery.do?method=processDeliveyOutWithExpDate',
                                params: {
                                    unique_id: rec.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    var result_txt = result.responseText;
                                    console_logs('>>>> result ???', result.responseText);
                                    // if (result_txt === 'true') {
                                    //     Ext.MessageBox.alert('알림', '선택 요청이 삭제되었습니다.');
                                    //     gm.me().store.load();
                                    //     gm.me().poPrdDetailStore.load();
                                    // } else {
                                    //     Ext.MessageBox.alert('알림', '우측 리스트에 대기 또는 생성완료건이 있는 관계로<br>삭제가 취소되었습니다.');
                                    //     gm.me().store.load();
                                    //     gm.me().poPrdDetailStore.load();
                                    // }
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
                detailStore.getProxy().setExtraParam('not_use_ctr_flag', 'Y');
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
                        {text: "Pallet No", flex: 2.5, style: 'text-align:center', dataIndex: 'po_no', sortable: true},
                        {text: "제품명", flex: 2.5, style: 'text-align:center', dataIndex: 'item_name', sortable: true},
                        {text: "기준모델", flex: 2, dataIndex: 'description', style: 'text-align:center', sortable: true},
                        {text: "규격", flex: 2, dataIndex: 'specification', style: 'text-align:center', sortable: true},
                        {text: "LOT NO", flex: 2, dataIndex: 'lot_no', style: 'text-align:center', sortable: true},
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
                        {text: "Pallet No", flex: 2.5, style: 'text-align:center', dataIndex: 'po_no', sortable: true},
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
                    var maxEditQuan = Number(rec.get('po_qty')) - Number(rec.get('already_delivery_quan'));
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
                                        html: '<p style="text-align:left;">&nbsp수주수량 : ' + gUtil.renderNumber(rec.get('po_qty')) + '<br>&nbsp기출고수량 : ' + gUtil.renderNumber(rec.get('already_delivery_quan')) + '<br>&nbsp최대 수정 가능수량 : ' + gUtil.renderNumber(maxEditQuan) + '<br> </p>',
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

        this.barcodePrintAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            disabled: true,
            text: gm.getMC('CMD_Pallet_barcode_printing', 'Pallet바코드 출력'),
            handler: function () {
                gm.me().printBarcode();
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
                                // {
                                //     xtype: 'combo',
                                //     fieldLabel: '팔레트 종류',
                                //     id: gu.id('pallet_type'),
                                //     anchor: '97%',
                                //     store: palletTypeStore,
                                //     name: 'pallet_type',
                                //     valueField: 'unique_id',
                                //     displayField: 'class_name',
                                //     emptyText: '선택해주세요.',
                                //     // value: reservedVarchar1,
                                //     listConfig: {
                                //         loadingText: '검색중...',
                                //         emptyText: '일치하는 항목 없음',
                                //         getInnerTpl: function () {
                                //             return '<div data-qtip="{unique_id}">{class_name}</div>';
                                //         }
                                //     }
                                // },
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
                                                    // pallet_uid: val['pallet_type'],
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
                        // this.palletLoadList,
                        // this.palletDelete,
                        // this.printShippingMark
                    ]
                }

            ],
            columns: [
                {
                    text: this.getMC('msg_order_grid_prd_fam', '상태'),
                    width: 80,
                    style: 'text-align:center',
                    dataIndex: 'expdateState',
                    sortable: true
                },
                {
                    text: this.getMC('msg_order_grid_prd_fam', '수주번호'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'order_number',
                    sortable: true
                },
                // {
                //     text: this.getMC('msg_order_grid_prd_fam', gm.getMC('CMD_Product', '제품군')),
                //     width: 100,
                //     style: 'text-align:center',
                //     dataIndex: 'class_name',
                //     sortable: true
                // },
                {
                    text: this.getMC('msg_order_grid_prd_name', '제품명'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'srcahd_item_name',
                    sortable: true
                },
                {
                    text: '요청한수량', width: 100, style: 'text-align:center', dataIndex: 'pr_quan', align: 'right',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_order_grid_quan_desc', '실재고수량'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'box_stock_qty',
                    sortable: true,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'real_stock_qty') {
                            context.record.set('real_stock_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_order_grid_quan_desc', '남은수량'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'need_quan',
                    sortable: true,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'need_quan') {
                            context.record.set('need_quan', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {text: 'UNIT', width: 70, style: 'text-align:center', dataIndex: 'srcahd_unit_code', sortable: true},
                {
                    text: this.getMC('msg_order_grid_prd_unitprice', '단가'),
                    width: 80,
                    style: 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex: 'sales_price',
                    sortable: true,
                    align: 'right'
                },
                {
                    text: this.getMC('msg_order_grid_prd_currency', '통화'),
                    width: 80,
                    style: 'text-align:center',
                    dataIndex: 'reserved4',
                    sortable: true
                },
                {
                    text: this.getMC('msg_order_grid_prd_delivery_date', '납기예정일'),
                    xtype: 'datecolumn',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'gr_date',
                    sortable: true,
                    format: 'Y-m-d',
                    editor: {xtype: 'datefield', format: 'Y-m-d'},
                },


                {
                    text: this.getMC('msg_order_grid_quan_desc', '수주수량'),
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'po_qty',
                    sortable: true,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'po_qty') {
                            context.record.set('po_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },

            ],
            viewConfig: {
                getRowClass: function (record, index) {
                    var c = record.get('expdateState');
                    if (c == 'Y') {
                        return 'yellow-row'
                    }
                    // if (c == 'D') {
                    //     return 'red-row'
                    // }
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
                    width: '50%',
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
        buttonToolbar.insert(1, this.deleteDoAction);
        buttonToolbar.insert(2, this.printDo);
        buttonToolbar.insert(3, this.procDeliveryAction);

        buttonToolbar.insert(11, this.downloadSheetAction);
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
                this.printDo.enable();
                this.barcodePrintAction.enable();
                this.procDeliveryAction.enable();
                if (selections.length === 2) {
                    this.combineDeliveryOrder.enable();
                } else {
                    this.combineDeliveryOrder.disable();
                }
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
                this.printDo.disable();
                this.combineDeliveryOrder.disable();
                this.setDeliveryPlanAction.disable();
                this.barcodePrintAction.disable();
                this.procDeliveryAction.disable();
            }
        })
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('having_not_status', 'BM,P0,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('multi_prd', true);
        this.store.getProxy().setExtraParam('exist_pallet_cnt', false);
        this.store.getProxy().setExtraParam('paging_not_use', true);
        this.store.getProxy().setExtraParam('orderBy', "req_date");
        this.store.getProxy().setExtraParam('ascDesc', "DESC");
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

    printBarcode: function () {
        var selection = gm.me().grid.getSelectionModel().getSelected().items[0];
        console_logs('>>> printBarcode selection', selection)
        var dl_uids = selection.get('dl_uids');
        if (dl_uids.length > 0) {
            gm.me().palletListStore.getProxy().setExtraParam('reserved_number2', selection.get('unique_id_long'));
            gm.me().palletListStore.getProxy().setExtraParam('is_not_state', 'Y')
        } else {
            gm.me().palletListStore.getProxy().setExtraParam('unique_ids', '-1');
        }
        gm.me().palletListStore.load();
        var palletList = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: gm.me().palletListStore,
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '99%',
            title: '출력할 Pallet 번호를 선택하십시오.',
            autoScroll: true,
            margin: '0 0 0 0',
            autoHeight: true,
            frame: false,
            border: false,
            id: gu.id('palletList'),
            layout: 'fit',
            forceFit: true,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            viewConfig: {
                markDirty: false
            },
            columns: [
                {
                    text: 'Pallet No',
                    width: '50%',
                    dataIndex: 'po_no',
                    style: 'text-align:center',
                    valueField: 'no',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                }
            ],
            listeners: {},
            autoScroll: true,

        });

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: 500,
            height: 300,
            overflowY: 'scroll',
            multiSelect: false,
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
                    // title: '입력',
                    broder: false,
                    collapsible: false,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 100, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [
                        //1장만 출력해서 전표에 붙이므로 출력매수는 삭제
                        {

                            xtype: 'fieldcontainer',
                            //fieldLabel: '출력매수',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'vbox',

                            // defaults: {
                            //     flex: 1,
                            //    // hideLabel: true,
                            // },

                            items: [
                                {
                                    fieldLabel: '프린터',
                                    xtype: 'combo',
                                    margin: '5 5 5 5',
                                    id: gu.id('printer'),
                                    name: 'printIpAddress',
                                    store: Ext.create('Mplm.store.PrinterStore'),
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    emptyText: '프린터 선택',
                                    allowBlank: false
                                },
                                /*
                                {
                                    fieldLabel: '프린트 라벨',
                                    xtype: 'combo',
                                    margin: '5 5 5 5',
                                    id: gu.id('print_label'),
                                    name: 'labelSize',
                                    store: Ext.create('Mplm.store.PrintLabelStore'),
                                    displayField: 'code_name_kr',
                                    valueField: 'system_code',
                                    emptyText: '라벨 선택',
                                    allowBlank: false
                                },
                                */
                                {
                                    xtype: 'numberfield',
                                    name: 'packing_qty',
                                    fieldLabel: 'BOX 수량',
                                    margin: '5 5 5 5',
                                    //width: 200,
                                    allowBlank: false,
                                    value: 1,
                                    maxlength: '1',
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'print_qty',
                                    fieldLabel: '출력매수',
                                    margin: '5 5 5 5',
                                    //width: 200,
                                    allowBlank: false,
                                    value: 1,
                                    maxlength: '1',
                                }
                            ]
                        }
                    ]
                }, palletList
            ]
        });//Panel end...

        var comboPrinter = gu.getCmp('printer');
        comboPrinter.store.load(
            function () {
                this.each(function (record) {
                    var system_code = record.get('system_code');
                    if (system_code == '192.168.20.12') {
                        comboPrinter.select(record);
                    }
                });
            }
        );

        // 프린터 라벨 사이즈 
        /*
        var comboLabel = gu.getCmp('print_label');
        comboLabel.store.load(
            function () {
                this.each(function (record) {
                    var system_code = record.get('system_code');
                    if (system_code == 'L100x150') {
                        comboLabel.select(record);
                    }
                });
            }
        );
        */
        

        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;
        var uniqueIdArr = [];
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');  //Srcahd unique_id
            uniqueIdArr.push(uid);
        }
        if (uniqueIdArr.length > 0) {
            prwin = gMain.selPanel.prbarcodeopen(form);
        }
    },

    prbarcodeopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '팔레트바코드 출력',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    var selectionsBarcode = gu.getCmp('palletList').getSelectionModel().getSelected().items;
                
                    console_logs('selections >>>>>>>>>>>>>', selections);
                    console_logs('selectionsBarcode >>>>>>>>>>>>>', selectionsBarcode);

                    var rtgast_uid = selections[0].get('unique_id_long');           // 출하요청서 rtgast_uid
                    var barcodes = [];
                    var pallet_no_list = [];
                    var do_no_list = [];
                    var date_stamp = [];
                    var item_codes = [];
                    var item_names = [];
                    var lots = [];
                    var packing_quan = [];
                    var box_serial = [];
                    //po_no, unique_id_long
      
                    if (selectionsBarcode !== undefined) {

                        for(var i=0; i<selectionsBarcode.length; i++) {
                            var pallet_uid = selectionsBarcode[i].get('unique_id_long');
                            var po_no = selectionsBarcode[i].get('po_no');

                            barcodes.push(pallet_uid);
                            pallet_no_list.push(po_no);
                            
                        }

                        for(var i=0; i<selections.length; i++) {
                            var po_no = selections[i].get('po_no');

                            do_no_list.push(po_no);
                        }
                        
                        var form = gu.getCmp('formPanel').getForm();

                        var printIpAddress = gu.getCmp('printer').getValue();
                        // var labelSize = gu.getCmp('print_label').getValue();

                        form.submit({
                            url: CONTEXT_PATH + '/sales/productStock.do?method=printSjBarcode',
                            params: {
                                label_size: 'L100x80',
                                barcode_type: 'pallet',
                                printIpAddress: printIpAddress,
                                barcodes : barcodes,
                                pallet_no_list: pallet_no_list,
                                do_no_list: do_no_list,
                                packing_quan: form.packing_quan,
                                print_qty: form.print_qty,
                            },
                            success: function (val, action) {
                                prWin.close();
                                gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                                gMain.selPanel.store.load(function () {
                                });
                            },
                            failure: function (val, action) {
                                prWin.close();
                                Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                                gMain.selPanel.store.load(function () {
                                });
                            }
                        })


                    } else {
                        Ext.MessageBox.alert('알림', 'Pallet 번호를 선택하십시오.')
                    }

                    // }//else 끝
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
    },//바코드관련 끝

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
       

        gm.me().realDeliveryStore.getProxy().setExtraParam('cartmap_uid', selectionsOther.get('unique_id_long'));
        gm.me().realDeliveryStore.load({callback: function() {
            var total_load = 0;
            var previous_store = gm.me().realDeliveryStore.data.items;
            console_logs('previous_store.length VALUE : ', previous_store.length);
            for (var j = 0; j < previous_store.length; j++) {
                console_logs('previous_store['+j+'].get(\'real_out_qty\') VALUE : ', previous_store[j].get('real_out_qty'));
                total_load = total_load + Number(previous_store[j].get('real_out_qty'));
            }
            
            gu.getCmp('total_load_disp').setHtml('<b>출하수량 : ' + gUtil.renderNumber(Number(total_load)));
        }});

        
        

        var lotList = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: gm.me().workListStore,
            id: gu.id('prodUnitGrid'),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '99%',
            title: '일부인 별 재고 List',
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
                // {
                //     text: '생산LOT',
                //     width: '15%',
                //     dataIndex: 'lot_no',
                //     style: 'text-align:center',
                //     typeAhead: false,
                //     allowBlank: false,
                //     sortable: true,
                // },
                {
                    text: '일부인',
                    xtype: 'datecolumn',
                    width: '15%',
                    dataIndex: 'exp_date',
                    style: 'text-align:center',
                    typeAhead: false,
                    format: 'Y-m-d',
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: 'PALLET',
                    width: '15%',
                    dataIndex: 'stock_pos',
                    style: 'text-align:center',
                    typeAhead: false,
                    format: 'Y-m-d',
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '재고수량',
                    width: '18%',
                    xtype: 'numbercolumn',
                    dataIndex: 'box_stock_qty',
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
                },
                'itemdblClick': function (view, record) {
                    // var selection = lotList.getSelectionModel().getSelected().items[0];
                    var isInsert = true;
                    var store = gu.getCmp('savelist').getStore();
                    
                    var lotListSel = lotList.getSelectionModel().getSelected().items[0];
                 
                    var duplication_flag = 0;
                    for(var k = 0; k < store.data.items.length; k++) {
                        if(lotListSel.get('unique_id') == store.data.items[k].get('stodtl_uid')) {
                            duplication_flag = 1
                            alert('이미 지정된 일부인입니다.');
                        }
                    }
                        if (isInsert == true && duplication_flag == 0) {
                            store.insert(store.getCount(), new Ext.data.Record({
                                'exp_date': lotListSel.get('exp_date'),
                                'stodtl_uid': lotListSel.get('unique_id'),
                                'item_code': lotListSel.get('item_code'),
                                // 'stock_qty': lotListSel.get('box_stock_qty'),
                                'dtl_box_qty': lotListSel.get('box_stock_qty'),
                                'real_out_qty' : selectionsOther.get('pr_quan'),
                                'stock_pos' : lotListSel.get('stock_pos')
                                // 'item_quan': insertion_quan,
                        }));

                        var total_load = 0;
                        var previous_store = store.data.items;
                        for (var i = 0; i < previous_store.length; i++) {
                            total_load = total_load + Number(previous_store[i].get('real_out_qty'));
                        }
                        
                        // console_logs('총 적재량 >>', total_load);
                        gu.getCmp('total_load_disp').setHtml('<b>출하수량 : ' + gUtil.renderNumber(Number(total_load)));
                        }
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
                    width: '30%',
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
            listeners: {},
            autoScroll: true,
        });

        

   

        var savelist = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('savelist'),
            // store: new Ext.data.Store(),
            // store: saveStore,
            store: gm.me().realDeliveryStore,
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
                // {
                //     text: '팔레트',
                //     width: '10%',
                //     dataIndex: 'pallet',
                //     style: 'text-align:center',
                //     valueField: 'no',
                //     typeAhead: false,
                //     allowBlank: false,
                //     sortable: true,
                // },
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
                    text: '일부인',
                    width: '12%',
                    xtype: 'datecolumn',
                    dataIndex: 'exp_date',
                    format: 'Y-m-d',
                    style: 'text-align:center',
                    // format: '0,000',
                    // align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: 'PALLET',
                    width: '15%',
                    dataIndex: 'stock_pos',
                    style: 'text-align:center',
                    typeAhead: false,
                    format: 'Y-m-d',
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '재고수량',
                    width: '12%',
                    // dataIndex: 'stock_qty',
                    dataIndex: 'dtl_box_qty',
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
                    text: '실제 출하수량',
                    width: '12%',
                    editor: 'numberfield',
                    dataIndex: 'real_out_qty',
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
                // {
                //     text: 'BOX 중량',
                //     width: '12%',
                //     editor: 'numberfield',
                //     dataIndex: 'box_weight',
                //     style: 'text-align:center',
                //     format: '0,000',
                //     align: 'right',
                //     typeAhead: false,
                //     allowBlank: false,
                //     sortable: true,
                //     renderer: function (value, context, tmeta) {
                //         if (context.field == 'box_weight') {
                //             context.record.set('box_weight', Ext.util.Format.number(value, '0,00/i'));
                //         }
                //         return Ext.util.Format.number(value, '0,00/i');
                //     },
                // },
                // {
                //     text: 'description',
                //     width: '16%',
                //     dataIndex: 'description',
                //     editor: 'textfield',
                //     style: 'text-align:center',
                //     typeAhead: false,
                //     allowBlank: true,
                //     sortable: true,
                // },


            ],
            listeners: {
                'itemClick': function (view, record) {
                    console_logs('>>> ddddddd', record);
                },
                beforeedit: function (editor, context) {
                    var record = gu.getCmp('savelist').getSelectionModel().getSelected().items[0];
                    var store = gu.getCmp('savelist').getStore();
                },

                edit: function (value, context, ditor, e, eOpts) {
                    var record = gu.getCmp('savelist').getSelectionModel().getSelected().items[0];
                    var store = gu.getCmp('savelist').getStore(); 
                    var loadList = gu.getCmp('prodUnitGrid').getSelectionModel().getSelected().items[0];
                    console_logs('>>>>>> context', context);
                    console_logs('>>>>>> value', value);
                    var store = gu.getCmp('savelist').getStore();
                    console_logs('record edit >>> ', record);

                    if (context.field === 'real_out_qty') {
                        var load_qty = Number(record.get('item_quan'));
                        // console_logs('load_qty >>', load_qty);
                        // var box_pkg_qty = Number(loadList.get('finance_rate'));
                        // console_logs('box_pkg_qty >>', box_pkg_qty);
                        // var gross_weight = Number(loadList.get('gross_weight'));
                        // console_logs('gross_weight >>', gross_weight);
                        // var edit_box_qty = Math.ceil(load_qty / box_pkg_qty);
                        // console_logs('gross_weight >>', edit_box_qty);
                        // if (edit_box_qty === 0 || edit_box_qty === undefined || edit_box_qty === Infinity) {
                        //     edit_box_qty = 0;
                        // }
                        // secondRecord = gu.getCmp('savelist').getStore().getAt(gu.getCmp('savelist').getStore().indexOf(record));
                        // secondRecord.set('box_quan', edit_box_qty);

                        // var setbox_weight = edit_box_qty * gross_weight;
                        // secondRecord.set('box_weight', setbox_weight);
                        var total_load = 0;
                        // console_logs('store Length', store.getCount());
                        var previous_store = store.data.items;
                        for (var i = 0; i < previous_store.length; i++) {
                            total_load = total_load + Number(previous_store[i].get('real_out_qty'));
                        }
                        gu.getCmp('total_load_disp').setHtml('<b>출하수량 : ' + gUtil.renderNumber(Number(total_load)));
                    }

                    // if (context.field === 'box_quan') {
                    //     var box_pkg_qty = Number(loadList.get('finance_rate'));
                    //     var box_quan = Number(record.get('box_quan'));
                    //     var gross_weight = Number(loadList.get('gross_weight'));
                    //     var edit_load_quan = box_pkg_qty * box_quan;
                    //     secondRecord = gu.getCmp('savelist').getStore().getAt(gu.getCmp('savelist').getStore().indexOf(record));
                    //     // secondRecord.set('item_quan', edit_load_quan);
                    //     // 사용자 요청으로 일단 comment 처리

                    //     var setbox_weight = box_quan * gross_weight;
                    //     secondRecord.set('box_weight', setbox_weight);

                    //     var total_load = 0;
                    //     console_logs('store Length', store.getCount());
                    //     var previous_store = store.data.items;
                    //     for (var i = 0; i < previous_store.length; i++) {
                    //         total_load = total_load + Number(previous_store[i].get('item_quan'));
                    //     }
                    //     gu.getCmp('total_load_disp').setHtml('<b>총 적재수량 : ' + gUtil.renderNumber(Number(total_load)));
                    // }
                    // if (context.field === 'box_weight') {
                    //     console_logs('>>>> tempBoxWeight', tempBoxWeight);
                    //     console_logs('>>>> input', record.get('box_weight'));
                    //     if (tempBoxWeight > record.get('box_weight')) {
                    //         Ext.MessageBox.show({
                    //             title: '확인',
                    //             msg: '기존 계산된 BOX 중량보다 입력 갯수가 작습니다.<br>수정을 진행하시겠습니까?',
                    //             buttons: Ext.MessageBox.YESNO,
                    //             fn: function (result) {
                    //                 if (result == 'yes') {
                    //                     secondRecord = gu.getCmp('savelist').getStore().getAt(gu.getCmp('savelist').getStore().indexOf(record));
                    //                     secondRecord.set('box_weight', record.get('box_weight'));
                    //                 } else {
                    //                     secondRecord = gu.getCmp('savelist').getStore().getAt(gu.getCmp('savelist').getStore().indexOf(record));
                    //                     secondRecord.set('box_weight', tempBoxWeight);
                    //                 }
                    //             },
                    //             icon: Ext.MessageBox.QUESTION
                    //         });
                    //     }
                    // }

                    // if (context.field === 'item_quan') {
                    //     var sel = lotList.getSelectionModel().getSelected().items[0];
                    //     // var sel = this.lotList.getSelectionModel().getSelected().items[0];
                    //     if (sel.get('real_wh_qty') < record.get('item_quan')) {
                    //         Ext.MessageBox.show({
                    //             title: '알림',
                    //             msg: '재고수량보다 입력한 수량이 더 많습니다.<br> 다시 확인해주세요.',
                    //             buttons: Ext.MessageBox.YES,
                    //             fn: function (result) {
                    //                 if (result == 'yes') {
                    //                     secondRecord = gu.getCmp('savelist').getStore().getAt(gu.getCmp('savelist').getStore().indexOf(record));
                    //                     secondRecord.set('item_quan', sel.get('pr_quan'));
                    //                 }
                    //             },
                    //             icon: Ext.MessageBox.QUESTION
                    //         });
                    //     } else {
                    //         var store = gu.getCmp('savelist').getStore();
                    //         var total_load = 0;
                    //         console_logs('store Length', store.getCount());
                    //         var previous_store = store.data.items;
                    //         for (var i = 0; i < previous_store.length; i++) {
                    //             total_load = total_load + Number(previous_store[i].get('item_quan'));
                    //         }
                    //         gu.getCmp('total_load_disp').setHtml('<b>총 적재수량 : ' + gUtil.renderNumber(Number(total_load)));
                    //     }
                    // }
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
                            html: '<b>출하수량 : 0</b>',
                            style: 'color:blue;'
                        },
                        '->',
                        {
                            text: '추가',
                            iconCls: 'af-plus',
                            listeners: [{
                                click: function (record) {
                                    var selection = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                                    var isInsert = true;
                                    var store = gu.getCmp('savelist').getStore();
                                    
                                    // var palletListSel = palletList.getSelectionModel().getSelected().items[0];
                                    // console_logs('Pallet List >>', palletListSel);
                                    var lotListSel = lotList.getSelectionModel().getSelected().items[0];
                                    // console_logs('lotList >>', lotListSel);

                                    // if (palletListSel != undefined && lotListSel != undefined) {
                                    //     for (var i = 0; i < store.length; i++) {
                                    //         var storeLot = store[i].get('lotno');
                                    //         if (storeLot === lotListSel.get('lot_no')) {
                                    //             Ext.MessageBox.alert('알림', '같은 LOT번호가 중복입력 되었습니다.');
                                    //             isInsert = false;
                                    //         }
                                    //         break;
                                    //     }


                                    //     var wh_qty = Number(lotListSel.get('real_wh_qty'));
                                    //     var preload_qty = Number(lotListSel.get('preload_qty'));
                                    //     console_logs('>>>> wh_qty ???', wh_qty);
                                    //     console_logs('>>>> preload_qty ???', preload_qty);
                                    //     if (wh_qty === preload_qty || wh_qty < preload_qty) {
                                    //         Ext.MessageBox.alert('알림', '이미 팔레트에 적재되었거나 재고수량보다 적재수량이 초과상태입니다.');
                                    //         return;
                                    //     }

                                    //     var item_quan = lotListSel.get('real_wh_qty') - preload_qty;
                                    //     console_logs('>>>>> item_quan', item_quan);
                                    //     var pr_quan = selection.get('pr_quan');
                                    //     console_logs('>>>>> pr_quan', pr_quan);
                                    //     var insertion_quan = 0.0;
                                    //     if (item_quan > pr_quan) {
                                    //         insertion_quan = pr_quan;
                                    //     } else {
                                    //         insertion_quan = item_quan;
                                    //     }

                                    //     var box_quan = insertion_quan / lotListSel.get('finance_rate');
                                    //     if (box_quan === null || box_quan === Infinity) {
                                    //         box_quan = 0;
                                    //     }

                                    //     var box_weight = lotListSel.get('gross_weight') * box_quan;
                                    //////////////////////////
                                   
                                    var duplication_flag = 0;
                                    for(var k = 0; k < store.data.items.length; k++) {
                                        if(lotListSel.get('unique_id') == store.data.items[k].get('stodtl_uid')) {
                                            duplication_flag = 1
                                            alert('이미 지정된 일부인입니다.');
                                        }
                                    }
                                        if (isInsert == true && duplication_flag == 0) {
                                            store.insert(store.getCount(), new Ext.data.Record({
                                                'exp_date': lotListSel.get('exp_date'),
                                                'stodtl_uid': lotListSel.get('unique_id'),
                                                'item_code': lotListSel.get('item_code'),
                                                // 'stock_qty': lotListSel.get('box_stock_qty'),
                                                'dtl_box_qty': lotListSel.get('box_stock_qty'),
                                                'real_out_qty' : selectionsOther.get('pr_quan'),
                                                'stock_pos' : lotListSel.get('stock_pos')
                                                // 'item_quan': insertion_quan,
                                        }));

                                        var total_load = 0;
                                        var previous_store = store.data.items;
                                        for (var i = 0; i < previous_store.length; i++) {
                                            total_load = total_load + Number(previous_store[i].get('real_out_qty'));
                                        }
                                        
                                        // console_logs('총 적재량 >>', total_load);
                                        gu.getCmp('total_load_disp').setHtml('<b>출하수량 : ' + gUtil.renderNumber(Number(total_load)));
                                        }
                                    } 
                            }]
                        },
                        {
                            text: '삭제',
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
            title: '아래 리스트를 선택 후 추가하여 출고할 일부인을 지정하십시오.',
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
                    html: '<font size=100><p style="text-align:left;">&nbsp&nbsp품명 : ' + selectionsOther.get('srcahd_item_name') + '<br>&nbsp&nbsp품번 : ' + selectionsOther.get('srcahd_item_code')  + '<br>&nbsp&nbsp요청수량 : ' + gUtil.renderNumber(Number(selectionsOther.get('pr_quan'))) + '</p></font>',
                    style: 'color:black;'
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '99%',
                    margin: '3 3 3 3',
                    items: [
                        lotList,
                        // palletList
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
            title: '출하 일부인 지정',
            width: 800,
            height: 700,
            plain: true,
            overflowY: 'scroll',
            items: form,
            buttons: [
                {
                    text: '일부인 지정',
                    handler: function (btn) {
                        if (btn == "no" || btn == "cancel") {
                            win.close();
                        } else {
                            var form = Ext.getCmp('addDlForm').getForm();
                            if (form.isValid()) {
                                win.setLoading(true);
                                var val = form.getValues(false);
                                var mainGrid = gm.me().grid.getSelectionModel().getSelected().items[0];
                                var subGrid = gm.me().gridContractCompany.getSelectionModel().getSelected().items[0];
                                var storeData = gu.getCmp('savelist').getStore();
                                var length = storeData.data.items.length;
                                if (length > 0) {
                                    var objs = [];
                                    var columns = [];
                                    var obj = {};
                                    var total_load = 0;
                                    var stodtl_uids = [];
                                    var real_out_qtys = [];
                                    for (var j = 0; j < storeData.data.items.length; j++) {
                                        var item = storeData.data.items[j];
                                        // stodtl_uids.push(item.get('stodtl_uid'));

                                        if(item.get('stodtl_uid') == null) {
                                            stodtl_uids.push(item.get('unique_id'));
                                        } else {
                                            stodtl_uids.push(item.get('stodtl_uid'));
                                        }

                                        // + 재고관리 - 원부자재 할당에도 똑같이 적용해주기 

                                        real_out_qtys.push(item.get('real_out_qty'));
                                        // var objv = {};
                                        // objv['srcahd_uid'] = item.get('srcahd_uid');
                                        // objv['stodtl_uid'] = item.get('stodtl_uid');
                                        // objv['pallet_uid'] = item.get('pallet_uid');
                                        // objv['pallet'] = item.get('pallet');
                                        // objv['item_code'] = item.get('item_code');
                                        // objv['specification'] = item.get('specification');
                                        // objv['lotno'] = item.get('lotno');
                                        // objv['item_quan'] = item.get('item_quan');
                                        // objv['project_uid'] = item.get('project_uid');
                                        // objv['box_quan'] = item.get('box_quan');
                                        // objv['box_weight'] = item.get('box_weight');
                                        // objv['description'] = item.get('description');
                                        // columns.push(objv);
                                        // total_load = total_load + Number(item.get('item_quan'));
                                    }
                                    // obj['datas'] = columns;
                                    // objs.push(obj);
                                    // var jsonData = Ext.util.JSON.encode(objs);

                                    // 여기서 요청수량과 제품수량을 비고하여 요청수량이 크면 팔레트 적재 불가.
                                    // if (total_load > Number(subGrid.get('pr_quan'))) {
                                    //     console_logs('Total Load >>', total_load);
                                    //     console_logs('Pr Quan >>', Number(subGrid.get('pr_quan')));
                                    //     Ext.MessageBox.alert('알림', '요청수량보다 적재수량이 더 많습니다.<br>다시 확인해 주십시오.');
                                    //     win.setLoading(false);
                                    //     return;
                                    // }
                                    //     // else if (total_load < Number(subGrid.get('pr_quan'))) {
                                    //     //     console_logs('Total Load >>', total_load);
                                    //     //     console_logs('Pr Quan >>', Number(subGrid.get('pr_quan')));
                                    //     //     Ext.MessageBox.alert('알림', '요청수량과 적재수량이 미일치 합니다<br>다시 확인해 주십시오,');
                                    //     //     win.setLoading(false);
                                    // // } 
                                    // else {
                                        form.submit({
                                            submitEmptyText: false,
                                            url: CONTEXT_PATH + '/sales/delivery.do?method=assignExpdateForOut',
                                            params: {
                                                cartmapUid: subGrid.get('unique_id_long'),
                                                stodtl_uids : stodtl_uids,
                                                real_out_qtys : real_out_qtys
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
                                } else {
                                    Ext.MessageBox.alert('알림', '저장목록 정보가 없습니다.')
                                    win.setLoading(false);
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


    selMode: 'MULTI',
    realDeliveryStore: Ext.create('Rfx2.store.company.tosimbio.realDeliveryStore'),
    workListStore: Ext.create('Rfx2.store.company.bioprotech.PStockOfProdStore'),
    palletListStore: Ext.create('Rfx2.store.company.bioprotech.PalletListStore'),
});