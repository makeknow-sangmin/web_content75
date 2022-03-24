//수주관리 메뉴
Ext.define('Rfx.view.salesDelivery.DeliveryNewPendingView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'delivery-new-pending-view',
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
        // this.addSearchField('reserved_varchar6');
        this.addSearchField('reserved_varchar3');
        this.addSearchField('sp_po_no');
        this.addSearchField('item_name');
        //this.addSearchField('item_code');

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.dlAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '출하',
            tooltip: '출하를 실시합니다',
            disabled: true,
            handler: function () {
                gm.me().prwinDl();
            }
        });

        this.assignShipmentAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Shipment_request', '출하 요청'),
            tooltip: '출하 요청',
            disabled: true,
            handler: function () {
               
                    var win = Ext.create('ModalWindow', {
                        title: '메시지',
                        width: 300,
                        height: 120,
                        items: [

                            {
                                xtype: 'datefield',
                                fieldLabel: '출하일',
                                id: gu.id('gr_date'),
                                name: 'gr_date',
                                value: Ext.Date.format(new Date(),'Y-m-d'),
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',
                                dateFormat: 'Y-m-d',
                                anchor: '100%'
                            }
                            

                        ],
                        buttons: [{
                            text: '예',
                            handler: function () {
                                gMain.selPanel.assignShipmentNew();
                                if (win) {
                                    win.close();
                                }
                            }
                        },
                        {
                            text: '아니오',
                            handler: function () {
                                if (win) {
                                    win.close();
                                }
                            }
                        }]
                    });
                
                win.show();
            }
        });

        // 바코드 검색 추가
        this.inputBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '바코드 입력',
            tooltip: '제품의 바코드를 입력하여 검색 합니다.',
            handler: function () {
                gm.me().inputBarcode();
            }
        });

        this.createStore('Rfx.model.DeliveryNewPending', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            gMain.pageSize/* pageSize */
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['assymap']
        );

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //buttonToolbar.insert(1, this.inputBarcodeAction);
        //buttonToolbar.insert(1, this.dlAction);
        buttonToolbar.insert(1, this.assignShipmentAction);
        // this.setRowClass(function (record, index) {
        //     var c = record.get('status');
        //     switch (c) {
        //         case 'P0':
        //             return 'yellow-row';
        //             break;
        //         case 'Y':
        //             return 'blue-row';
        //             break;
        //         case 'P':
        //             return 'orange-row';
        //             break;
        //         case 'DE':
        //             return 'red-row';
        //             break;
        //         case 'CR':
        //             return 'green-row';
        //             break;
        //         default:
        //     }
        // });


        Ext.each(this.columns, function (columnObj, index) {

            var o = columnObj;

            var dataIndex = o['dataIndex'];

            if (o['dataType'] === 'number') {
                o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                    if (gm.me().store.data.items.length > 0) {
                        var summary = gm.me().store.data.items[0].get('summary');
                        if (summary.length > 0) {
                            var objSummary = Ext.decode(summary);
                            return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                        } else {
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                };
            }

        });

        var option = {
            /*features: [{
                ftype: 'summary',
                dock: 'top'
            }]*/
        };

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.createGrid(searchToolbar, buttonToolbar, option);

        buttonToolbar.insert(4, '-');

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length >0) {
                    
                    gm.me().assignShipmentAction.enable();
                    //gm.me().dlAction.enable();
                } else {
                    // gm.me().dlAction.disable();
                    gm.me().assignShipmentAction.disable();
                }
            }
        });

        this.callParent(arguments);

        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.

        this.store.getProxy().setExtraParam('having_not_status', 'BM,P0,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');

        this.store.load(function (record) {

        });

    },
    // prwinDl: function () {

    //     var selection = gm.me().grid.getSelectionModel().getSelection()[0];

    //     var status = selection.get('status');
    //     var wh_qty = selection.get('wh_qty');
    //     var aprv_date = selection.get('reserved_timestamp1');

    //    // if (wh_qty > 0) {
    //         var form = Ext.create('Ext.form.Panel', {
    //             xtype: 'form',
    //             // title:'공정 선택',
    //             frame: false,
    //             border: false,
    //             bodyPadding: 10,
    //             region: 'center',
    //             layout: 'form',
    //             fieldDefaults: {
    //                 labelAlign: 'right',
    //                 msgTarget: 'side'
    //             },
    //             items: [
    //                 {
    //                     xtype: 'fieldset',
    //                     title: '출하를 실시합니다.',
    //                     items: [
    //                         {
    //                             fieldLabel: '출하수량',
    //                             xtype: 'numberfield',
    //                             id: gu.id('requestQty'),
    //                             name: 'requestQty',
    //                             anchor: '97%',
    //                             value: selection.get('wh_qty')
    //                         },
    //                         {
    //                             fieldLabel: '납품장소',
    //                             xtype: 'textarea',
    //                             id: gu.id('reserved_varchar3'),
    //                             name: 'reserved_varchar3',
    //                             anchor: '97%',
    //                             value: selection.get('reserved_varchar3')
    //                         },
    //                         {
    //                             fieldLabel: '납품방법',
    //                             xtype: 'textfield',
    //                             id: gu.id('reserved_varchar4'),
    //                             name: 'reserved_varchar4',
    //                             anchor: '97%',
    //                             value: selection.get('reserved_varchar4')
    //                         },
    //                         {
    //                             fieldLabel: '납품처정보',
    //                             xtype: 'textarea',
    //                             id: gu.id('reserved_varchark'),
    //                             name: 'reserved_varchark',
    //                             anchor: '97%',
    //                             value: selection.get('reserved_varchark')
    //                         },
    //                         {
    //                             xtype: 'datefield',
    //                             anchor: '97%',
    //                             name: 'aprv_date',
    //                             id: gu.id('aprv_date'),
    //                             fieldLabel: '출하날짜',
    //                             format: 'Y-m-d',
    //                             submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    //                             dateFormat: 'Y-m-d',// 'Y-m-d H:i:s',
    //                             value: new Date(aprv_date)
    //                         }
    //                     ]
    //                 }
    //             ]
    //         });

    //         var myHeight = 370;
    //         var myWidth = 390;

    //         var prWin = Ext.create('Ext.Window', {
    //             modal: true,
    //             title: '출하',
    //             width: myWidth,
    //             height: myHeight,
    //             plain: true,
    //             items: form,
    //             buttons: [{
    //                 text: CMD_OK,
    //                 handler: function () {
    //                     //if (gu.getCmp('requestQty').getValue() <= selection.get('wh_qty')) {
    //                         Ext.MessageBox.show({
    //                             title: '출하확정',
    //                             msg: '출하를 하시겠습니까?',
    //                             buttons: Ext.MessageBox.YESNO,
    //                             fn: function (result) {

    //                                 if (result == 'yes') {

    //                                     prWin.setLoading(true);

    //                                     var selections = gm.me().grid.getSelectionModel().getSelection();

    //                                     var srcahdArr = [];
    //                                     var requestQtyArr = [];
    //                                     var projectArr = [];

    //                                     //if (gu.getCmp('requestQty').getValue() > 0) {
    //                                         for (var i = 0; i < selections.length; i++) {
    //                                             srcahdArr.push(selections[i].get('srcahd_uid'));
    //                                             requestQtyArr.push(gu.getCmp('requestQty').getValue());
    //                                             projectArr.push(selections[i].get('ac_uid'));
    //                                         }

    //                                         Ext.Ajax.request({
    //                                             url: CONTEXT_PATH + '/sales/productStock.do?method=assignShipmentBySrcahd',
    //                                             params: {
    //                                                 srcahdUids: srcahdArr,
    //                                                 requestQtys: requestQtyArr,
    //                                                 projectArr: projectArr,
    //                                                 reserved_varchar3: gu.getCmp('reserved_varchar3').getValue(),
    //                                                 reserved_varchar4: gu.getCmp('reserved_varchar4').getValue(),
    //                                                 reserved_varchark: gu.getCmp('reserved_varchark').getValue(),
    //                                                 aprv_date: gu.getCmp('aprv_date').getValue()
    //                                             },
    //                                             success: function (val, action) {
    //                                                 Ext.Msg.alert('완료', '출하 요청이 완료 되었습니다.');
    //                                                 gMain.selPanel.store.load(function () {
    //                                                 });
    //                                                 prWin.setLoading(false);
    //                                                 prWin.close();
    //                                             },
    //                                             failure: function (val, action) {
    //                                                 Ext.Msg.alert('', '출하 요청 도중 오류가 발생하였습니다.');
    //                                                 prWin.setLoading(false);
    //                                                 prWin.close();
    //                                             }
    //                                         });
    //                                     // } else {
    //                                     //     Ext.Msg.alert('', '최소 1개 이상의 수량을 입력하시기 바랍니다.');
    //                                     // }

    //                                 } else {
    //                                     prWin.close();
    //                                 }
    //                             },
    //                             icon: Ext.MessageBox.QUESTION
    //                         });
    //                     // } else {
    //                     //     Ext.Msg.alert('', '요청수량이 출하가능 수량보다 더 많습니다.');
    //                     // }

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
    //         prWin.show();
    //     // } else {
    //     //     Ext.Msg.alert('', '출하 가능한 상품이 아닙니다.');
    //     // }
    // },

    assignShipmentOld: function () {

        var productarr = [];
        var requestqtys = [];
        var stoqtyarr = [];
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('srcahd_uid');  //Product unique_id
            var stoqty_uid = rec.get('unique_id_long');
            var qty = rec.get('request_qty');
            var stock_qty = rec.get('stock_qty');
            if (qty > stock_qty) {
                counts++;
            }
            // if (qty > 0) {
            productarr.push(uid);
            requestqtys.push(qty);
            stoqtyarr.push(stoqty_uid);
            // }
        }
        if (counts > 0) {
            Ext.Msg.alert('경고', '현재 신청 가능한 수량보다 신청 수량이 더 많은 제품이 있습니다.');
        } else if (true) {
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/productStock.do?method=assignShipment',
                params: {
                    productUids: productarr,
                    requestQtys: requestqtys,
                    stoqtyUids: stoqtyarr
                },
                success: function (val, action) {
                    Ext.Msg.alert('완료', '출하 요청이 완료 되었습니다.');

                    gMain.selPanel.store.load(function () {
                    });

                },
                failure: function (val, action) {

                }
            });
        } else {
            Ext.Msg.alert('경고', '신청할 제품의 수량이 0 입니다.');
        }
    },

    assignShipmentNew: function () {
        var a = gu.getCmp('gr_date').getValue();
        var gr_date = Ext.Date.format(a,'Y-m-d');
        var srcahd_uids = [];
        var po_qtys = [];
        var projectUids = [];
        var sloastUids = [];
        var hoseons = [];
        var order_com_uniques = [];
        var assymap_uids = [];
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var srcahd_uid = rec.get('srcahd_uid');  //Product unique_id
            var sloast_uid = rec.get('unique_id_long');
            var po_qty = rec.get('po_qty');
            var reserved_varchar3 = rec.get('reserved_varchar3');
            var order_com_unique = rec.get('order_com_unique');
            var pj_uid = rec.get('pj_uid');
            var assymap_uid = rec.get('assymap_uid');
            srcahd_uids.push(srcahd_uid);
            po_qtys.push(po_qty);
            projectUids.push(pj_uid);
            sloastUids.push(sloast_uid);
            hoseons.push(reserved_varchar3);
            order_com_uniques.push(order_com_unique);
            assymap_uids.push(assymap_uid);
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/sales/productStock.do?method=requestShDirectOutDlHeavy',
            params: {
                srcahd_uids : srcahd_uids,
                po_qtys : po_qtys,
                sloastUids : sloastUids,
                hoseons : hoseons,
                projectUids  :projectUids,
                order_com_uniques : order_com_uniques,
                gr_date : gr_date,
                assymapUids : assymap_uids
            },
            success: function (val, action) {
                Ext.Msg.alert('완료', '출하 요청이 완료 되었습니다.');
                gMain.selPanel.store.load(function () {
                });

            },
            failure: function (val, action) {

            }
        });

    },

    inputBarcode: function () {

        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            title: '바코드를 스캔하시기 바랍니다.',
            frame: false,
            border: false,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'textarea',
                    id: gu.id('barcodeData'),
                    name: 'barcode',
                    anchor: '100%',
                    width: 480,
                    height: 370
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 입력',
            width: 500,
            height: 500,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    var barcodeData = gu.getCmp('barcodeData').getValue().split('\n');
                    barcodeData.pop();  //마지막 공백 제거
                    var uniqueBarcodeData = barcodeData.reduce(function (a, b) {
                        if (a.indexOf(b) < 0) a.push(b);
                        return a;
                    }, []);
                    gm.me().store.getProxy().setExtraParam('projectUids', uniqueBarcodeData);
                    gm.me().store.load(function (records) {
                        gm.me().store.getProxy().setExtraParam('projectUids', null);
                    });
                    if (prWin) {
                        prWin.close();
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
        gu.getCmp('barcodeData').focus(false, 500);
    }
});
