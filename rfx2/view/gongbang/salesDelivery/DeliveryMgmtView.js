//출하 현황
Ext.define('Rfx2.view.gongbang.salesDelivery.DeliveryMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-mgmt-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.setDefComboValue('def_rep_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
        var to_date = new Date();
        var registCont = gUtil.yyyymmdd(to_date) + ':' + gUtil.yyyymmdd(to_date);
        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: "기간",
            sdate: to_date,
            edate: to_date
        });

        this.addSearchField('wa_name'); //minChars: 1, BuyerStore
        this.setDefValue('create_date', new Date());
        var next7 = gUtil.getNextday(7);
        this.setDefValue('change_date', next7);
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'COPY', 'REMOVE'
            ],
        });

        this.removeAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '납품반려',
            tooltip: '반려 확인',
            disabled: true,
            handler: function (widget, event) {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                console_logs('=>cdasa', selections);
                var dl_uids = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    if (rec.get('state') == 'A') {
                        Ext.MessageBox.alert("알림", "배송완료된 납품서가 있습니다.");
                        return;
                    }
                    dl_uids.push(rec.get('unique_id_long'));
                }

                Ext.MessageBox.show({
                    title: '납품 반려',
                    msg: '출하요청으로 되돌아갑니다. 반려하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {

                        if (btn == "no") {
                            return;
                        } else {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales/delivery.do?method=deliveryRemove',
                                params: {
                                    unique_ids: dl_uids
                                },
                                success: function (result, request) {
                                    gm.me().store.load();

                                    gm.me().showToast('안내', dl_uids.length + '건 반려되었습니다.');
                                }, // endofsuccess
                                failure: extjsUtil.failureMessage
                            }); // endofajax
                        } // btnIf of end
                    } //fn function(btn)
                }); //show
            }
        });

        this.DeliveryCompleteAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '배송완료',
            tooltip: '배송완료 확인',
            disabled: true,
            handler: function (widget, event) {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var selectUids = [];
                var state = [];
                var out_qtys = [];
                if (selections) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        console_logs('rec', rec);
                        selectUids.push(rec.get('unique_id_long'));
                        out_qtys.push(rec.get('reserved_double1'));
                        if (rec.get('state') != 'I') {
                            Ext.MessageBox.alert("알림", "배송중인 상태가 아닙니다.");
                            return;
                        }
                    }
                }

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: [
                        {
                            fieldLabel: '납품 날짜',
                            xtype: 'datefield',
                            rows: 4,
                            format: 'Y-m-d',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            anchor: '100%',
                            labelWidth: 80,
                            id: 'reserved_timestamp1',
                            name: 'reserved_timestamp1',
                            style: 'width: 100%',
                            value: new Date
                        },
                        new Ext.form.Hidden({
                            name: 'unique_uids',
                            value: selectUids
                        }),
                        new Ext.form.Hidden({
                            name: 'out_qtys',
                            value: out_qtys
                        })
                    ]
                })

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '배송 완료',
                    width: 300,
                    height: 150,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == 'no') {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    form.submit({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=deliveryComplete',
                                        params: val,
                                        success: function (result, request) {
                                            gm.me().store.load();
                                            Ext.Msg.alert('안내', '배송 완료.', function () {
                                            });

                                            prWin.close();
                                        },// endofsuccess
                                        failure: function () {
                                            Ext.Msg.alert('안내', '배송 처리 실패.', function () {
                                            });
                                            prWin.close();
                                        }
                                    });// endofajax
                                }
                            }
                        }
                    }]
                });
                prWin.show();
            }
        });

        //모델 정의
        this.createStore('Rfx.model.DeliveryMgmt', [{
                property: 'po_no',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/, {
                create_date: 'r.create_date'
            });

        this.store.getProxy().setExtraParam('not_state', 'D');
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 3) {
                buttonToolbar.items.remove(item);
            }
        });

        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '납품서출력',
            tooltip: '납품서 출력',
            disabled: true,
            handler: function (widget, event) {
                var rtgast_uid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                var po_no = gMain.selPanel.vSELECTED_PO_NO;
                var rec = gm.me().vSELECTED_RECORD;
                var selection = gm.me().grid.getSelectionModel().getSelection();
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printDl',
                    params: {
                        // rtgast_uid : rec.get('reserved_number5'),  // DO(x) -> DL 로 변경
                        rtgast_uid: rec.get('unique_id_long'),
                        po_no: po_no,
                        pdfPrint: 'pdfPrint'
                    },
                    reader: {
                        pdfPath: 'pdfPath'
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
                    failure: extjsUtil.failureMessage
                });
            }
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.printPDFAction);
        buttonToolbar.insert(4, '-');
        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        //입력/상세 창 생성.
        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.editAction.setText(CMD_VIEW_DTL);
        this.addTabsledelLineGridPanel(CMD_VIEW_DTL, 'SDL1_SUB', {
                pageSize: 100,
                model: 'Rfx.store.SleDelStore',
                dockedItems: [
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default3',
                        items: [
                            '->',
                        ]
                    }
                ],
                sorters: [{
                    property: 'serial_no',
                    direction: 'ASC'
                }]
            },

            function (selections) {
                if (selections.length) {
                    var rec = selections[0];
                    console_logs('Lot 상세정보>>>>>>>>>>>>>', rec);
                    gMain.selPanel.selectPcsRecord = rec;
                    gMain.selPanel.parent = rec.get('parent');
                    gMain.selPanel.selectSpecification = rec.get('specification');

                } else {

                }
            },
            'sledelLineGrid'//toolbar
        );


        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //rtgast_uid
                gMain.selPanel.vSELECTED_PO_NO = rec.get('po_no'); //rtgast_uid
                gMain.selPanel.printPDFAction.enable();
                this.DeliveryCompleteAction.enable();
                this.removeAction.enable();
                var rec = selections[0];
                console_logs('===zzzzzz', rec);
                this.sledelLineStore.getProxy().setExtraParam('dl_uid', rec.get('unique_id'));
                this.sledelLineStore.load();
            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
                // gMain.selPanel.reReceiveAction.disable();
                gMain.selPanel.printPDFAction.disable();
                this.DeliveryCompleteAction.disable();
                this.removeAction.disable();
            }

        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('menu', 'SDL1');
        this.store.load(function (records) {
        });
    },
    items: [],

    addTabsledelLineGridPanel: function (title, menuCode, arg, fc, id) {
        gMain.extFieldColumnStore.load({
            params: {menuCode: menuCode},
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                if (success == true) {
                    try {
                        this.callBackWorkListCHNG(title, records, arg, fc, id);
                    } catch (e) {
                        console_logs('callBackWorkListCHNG error', e);
                    }
                    this.sledelLineGrid.on('edit', function (editor, e) {
                        var rec = e.record;
                        var out_blocking_qty = rec.get('gr_blocking_qty') == undefined ? 0 : rec.get('gr_blocking_qty');
                        var sales_price = rec.get('sales_price');
                        var unique_id = rec.get('unique_id');
                        var dl_uid = rec.get('dl_uid');
                        var pj_uid = rec.get('pj_uid');
                        var gr_qty = rec.get('gr_qty');
                        var dl_info = rec.get('dl_info');
                        if (gr_qty < out_blocking_qty) {
                            Ext.Msg.alert('안내', '납품수량 보다 많습니다.', function () {
                            });
                            out_blocking_qty = gr_qty;
                        }
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/sales/delivery.do?method=destroy',
                            params: {
                                out_blocking_qty: out_blocking_qty,
                                sales_price: sales_price,
                                sledel_uid: unique_id,
                                dl_uid: dl_uid,
                                pj_uid: pj_uid,
                                dl_info: dl_info
                            },
                            success: function (result, request) {
                                gm.me().sledelLineStore.load();
                                gm.me().store.load();
                                gm.me().showToast('안내', '수정되었습니다.');
                            },
                            failure: extjsUtil.failureMessage
                        });
                        rec.commit();
                    });
                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {
                        }
                    });
                }
            },
            scope: this
        });
    },

    callBackWorkListCHNG: function (title, records, arg, fc, id) {
        var gridId = id == null ? this.getGridId() : id;
        var o = gMain.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];
        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});
        this.sledelLineStore = Ext.create('Rfx.store.SleDelStore');
        Ext.each(columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            // console_logs('===columnObj', columnObj);
            var qty = 0;
            switch (dataIndex) {
                case 'gr_blocking_qty':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function (value, meta, record) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    // columnObj["dataIndex"] = 'stock_qty';
                    break;
                case 'sales_price':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function (value, meta, record) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
                case 'dl_info':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function (value, meta, record) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
                default:
                    break;
            }
        });

        try {
            Ext.FocusManager.enable({focusFrame: true});
        } catch (e) {
            console_logs('FocusError', e);
        }
        this.sledelLineGrid = Ext.create('Ext.grid.Panel', {
            store: this.sledelLineStore,
            title: title,
            cls: 'rfx-panel',
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            collapsible: false,
            layout: 'fit',
            dockedItems: dockedItems,
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            plugins: [cellEditing],
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
                select: function (selModel, record, index, options) {

                },
                cellkeydown: function (sledelLineGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                }
            },//endof listeners
            columns: columns
        });
        this.sledelLineGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                fc(selections);
            }
        });
        var view = this.sledelLineGrid.getView();
        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
        tabPanel.add(this.sledelLineGrid);
    },
});
