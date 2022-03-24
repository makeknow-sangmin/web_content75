//출하 대기
Ext.define('Rfx2.view.company.dabp01kr.delivery.HEAVY4_DeliveryPendingView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-pending-view',
    detailStore: null,
    initComponent: function () {

        this.vMESSAGE.EDIT = '출하수량 수정';

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'COPY', 'REMOVE'
            ],
            RENAME_BUTTONS: []
        });

        //모델 정의
        this.createStore('Rfx.model.Heavy4DeliveryPending', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/, {
                car_name: 'r.coord_key1'
            }
        );

        //그리드 생성
        var arr = [];

        this.addSearchField({
            type: 'condition',
            width: 140,
            sqlName: 'rtgast-do',
            tableName: 'itemdetail',
            field_id: 'h_reserved43',
            fieldName: 'h_reserved43',
            params: {}
        });
        arr.push(buttonToolbar);
        arr.push(this.createSearchToolbar());
        //arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        switch (vCompanyReserved4) {
            case 'KYNL01KR':
                this.editAction.setText('상세정보');
                break;
            default:
                this.editAction.setText('출하수량 수정');
                break;
        }

        //출고지시 Action 생성
        this.addDeliveryConfirm = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '출하지시',
            tooltip: '출하지시',
            disabled: true,
            handler: function () {
                var rec = gMain.selPanel.vSELECTED_RECORD;
                var out_qty = rec.get('reserved_double1') - rec.get('delivery_qty');
                if (vCompanyReserved4 == 'KYNL01KR') {
                    var form = Ext.create('Ext.form.Panel', {
                        defaultType: 'textfield',
                        border: false,
                        bodyPadding: 15,
                        region: 'center',
                        defaults: {
                            anchor: '100%',
                            allowBlank: false,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [{
                            xtype: 'datefield',
                            fieldLabel: '불출일',
                            name: 'h_reserved51',
                            anchor: '100%'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '불출메모',
                            name: 'h_reserved52',
                            anchor: '100%'
                        }
                        ]
                    });
                } else {
                    var form = Ext.create('Ext.form.Panel', {
                        defaultType: 'textfield',
                        border: false,
                        bodyPadding: 15,
                        region: 'center',
                        defaults: {
                            anchor: '100%',
                            allowBlank: false,
                            msgTarget: 'side',
                            labelWidth: 80
                        }
                    });
                }

                switch (vCompanyReserved4) {
                    case 'KYNL01KR':
                        var win = Ext.create('ModalWindow', {
                            title: '출하지시',
                            width: 400,
                            height: 150,
                            minWidth: 400,
                            minHeight: 150,
                            items: form,
                            buttons: [{
                                text: '확인',
                                handler: function () {
                                    var val = form.getValues(false);
                                    gMain.selPanel.addDeliveryConfirmFc(val['out_qty'], val['reserved_varchar1'],
                                        val['h_reserved51'], val['h_reserved52'], win);
                                    if (win) {
                                        win.close();
                                    }
                                }
                            },
                                {
                                    text: '취소',
                                    handler: function () {
                                        if (win) {
                                            win.close();
                                        }


                                    }
                                }]
                        });

                        break;
                    default:
                        var win = Ext.create('ModalWindow', {
                            title: '메시지',
                            html: '<br><p style="text-align:center;">출하 지시를 내리시겠습니까?</p>',
                            width: 300,
                            height: 120,
                            buttons: [{
                                text: '예',
                                handler: function () {
                                    var val = form.getValues(false);
                                    gMain.selPanel.addDeliveryConfirmFc(val['out_qty'], val['reserved_varchar1']);
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
                }
                win.show();
            }
        });

        //출고지시 Action 생성
        this.addDeliveryConfirmPart = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '출하지시',
            tooltip: '출하지시',
            disabled: true,
            handler: function () {
                var rec = gMain.selPanel.vSELECTED_RECORD;
                var out_qty = rec.get('reserved_double1') - rec.get('delivery_qty');
                if (vCompanyReserved4 == 'KYNL01KR') {
                    var form = Ext.create('Ext.form.Panel', {
                        defaultType: 'textfield',
                        border: false,
                        bodyPadding: 15,
                        region: 'center',
                        defaults: {
                            anchor: '100%',
                            allowBlank: false,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [{
                            xtype: 'datefield',
                            fieldLabel: '불출일',
                            name: 'h_reserved51',
                            anchor: '100%'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '불출메모',
                            name: 'h_reserved52',
                            anchor: '100%'
                        }
                        ]
                    });
                } else {
                    var form = Ext.create('Ext.form.Panel', {
                        defaultType: 'textfield',
                        border: false,
                        bodyPadding: 15,
                        region: 'center',
                        defaults: {
                            anchor: '100%',
                            allowBlank: false,
                            msgTarget: 'side',
                            labelWidth: 80
                        }
                    });
                }

                switch (vCompanyReserved4) {
                    case 'KYNL01KR':

                        var rtgastUid = gm.me().selected_rec[0].data.id;
                        var stock_pos = gm.me().selected_rec[0].data.po_no;
                        var reserved_varchar1 = gm.me().selected_rec[0].data.reserved_varchar1;
                        var stoqty_uids = [];
                        var specifications = [];

                        for (var i = 0; i < gm.me().selected_sub_rec.length; i++) {
                            stoqty_uids.push(gm.me().selected_sub_rec[i].data.id);
                            specifications.push(gm.me().selected_sub_rec[i].data.specification);
                        }

                        var win = Ext.create('ModalWindow', {
                            title: '출하지시',
                            width: 400,
                            height: 150,
                            minWidth: 400,
                            minHeight: 150,
                            items: form,
                            buttons: [{
                                text: '확인',
                                handler: function () {
                                    var val = form.getValues(false);

                                    var myWin = win;

                                    myWin.setLoading(true);

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=addDeliveryConfirmByRqstHeavy',
                                        params: {
                                            rtgastUid: rtgastUid,
                                            out_qty: val['out_qty'],
                                            stock_pos: stock_pos,
                                            reserved_varchar1: reserved_varchar1,
                                            stoqty_uids: stoqty_uids,
                                            specifications: specifications,
                                            h_reserved51: val['h_reserved51'],
                                            h_reserved52: val['h_reserved52']
                                        },

                                        success: function (result, request) {

                                            //BATCH_INSERT_STOQTY_KYNL에서 처리함

                                            /* var whereValue = [];

                                         for(var k = 0; k < gm.me().selected_sub_rec.length; k++) {
                                               whereValue.push(gm.me().selected_sub_rec[k].data.assymap_uid);
                                           }

                                           if(this.sub_rec_count <= gm.me().selected_sub_rec.length) {
                                               //gm.editAjax('claast', 'egci_code', null, 'egci_code', stock_pos, {type:''});
                                               for(var i = 0; i < 5; i++) {
                                                   gm.editAjax('claast', 'reserved_varchar' + (i+1), '0', 'reserved_varchar' + (i+1), stock_pos, {type:''});
                                               }
                                           } else {
                                               //gm.editAjax('rtgast', 'state', 'I', 'unique_id', rtgastUid, {type:''});
                                           }*/

                                            //gm.editAjax('assymap', 'reserved6', '불출완료', 'unique_id', whereValue,  {type:''});

                                            myWin.setLoading(false);

                                            Ext.Msg.alert('출고', '출고처리 하였습니다.');
                                            win.close();
                                            gm.me().detailStore.load();
                                            gm.me().store.load();
                                        },
                                        failure: extjsUtil.failureMessage
                                    });
                                }
                            },
                                {
                                    text: '취소',
                                    handler: function () {
                                        if (win) {
                                            win.close();
                                        }


                                    }
                                }]
                        });

                        break;
                    default:
                        var win = Ext.create('ModalWindow', {
                            title: '메시지',
                            html: '<br><p style="text-align:center;">출하 지시를 내리시겠습니까?</p>',
                            width: 300,
                            height: 120,
                            buttons: [{
                                text: '예',
                                handler: function () {
                                    var val = form.getValues(false);
                                    gMain.selPanel.addDeliveryConfirmFc(val['out_qty'], val['reserved_varchar1']);
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
                }
                win.show();
            }
        });

        buttonToolbar.insert(2, this.addDeliveryConfirm);
        buttonToolbar.insert(2, '-');

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length > 0) {

                var submenu = '';
                this.selected_rec = selections;
                this.pallet_no = selections[0].data.po_no;

                switch (selections[0].data.pj_type) {
                    case '해양':
                        submenu = 'SDL2_KM';
                        break;
                    case '조선':
                        submenu = 'SDL2_KM2';
                        break;
                    case '도장':
                        submenu = 'SDL2_KM3';
                        break;
                    case '기타':
                        submenu = 'SDL2_KM4';
                        break;
                    default:
                        submenu = 'SDL2_SUB';
                }

                this.addTabdeliveryPendingGridPanel('상세정보', submenu, {
                        pageSize: 100,
                        //model: 'Rfx.model.HEAVY4WorkOrder',
                        //model: 'Rfx.model.ProductNewStock',
                        dockedItems: [

                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                cls: 'my-x-toolbar-default3',
                                items: [
                                    this.addDeliveryConfirmPart
                                    /*'-',
                                        addMinPo*!/*/
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
                            gMain.selPanel.selectSpecification = rec.get('specification');
                            gMain.selPanel.parent = rec.get('parent');

                        } else {

                        }
                    },
                    'deliveryPendingGrid'//toolbar
                );

                if (selections.length) {
                    gMain.selPanel.addDeliveryConfirm.enable();
                } else {
                    gMain.selPanel.addDeliveryConfirm.disable();
                }
            }
        });
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        switch (vCompanyReserved4) {
            case 'KYNL01KR':
                this.store.getProxy().setExtraParam('rtg_group_flag', 'Y');
                break;
            default:
                break;
        }

        this.store.load(function (records) {
        });

    },
    addDeliveryConfirmFc: function (out_qty, reserved_varchar1, h_reserved51, h_reserved52, win) {
        if (this.vSELECTED_RECORD == null) {
            Ext.MessageBox.alert('오류', '선택한 항목를 찾을 수 없습니다.');

        } else {
            var rtgastUid = this.vSELECTED_RECORD.get('id');
            var stock_pos = this.vSELECTED_RECORD.get('po_no');

            var myWin = win;
            gm.me().setLoading(true);

            var stoqty_uids = null;

            switch (vCompanyReserved4) {
                case 'KYNL01KR':
                    stoqty_uids = [];

                    for (var i = 0; i < this.detailStore.data.items.length; i++) {
                        stoqty_uids.push(this.detailStore.data.items[i].data.id);
                    }
                    break;
                default:
                    break;
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/delivery.do?method=addDeliveryConfirmByRqstHeavy',
                params: {
                    rtgastUid: rtgastUid,
                    out_qty: out_qty,
                    stock_pos: stock_pos,
                    reserved_varchar1: reserved_varchar1,
                    h_reserved51: h_reserved51,
                    h_reserved52: h_reserved52,
                    stoqty_uids: stoqty_uids
                },

                success: function (result, request) {
                    gMain.selPanel.store.load(function (records) {
                    });
                    gm.me().setLoading(false);
                    myWin.close();

                },//endofsuccess
                failure: extjsUtil.failureMessage
            });//endofajax
        }

    },
    addTabdeliveryPendingGridPanel: function (title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: {menuCode: menuCode},
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                if (success == true) {
                    this.callBackWorkList(title, records, arg, fc, id);
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
    callBackWorkList: function (title, records, arg, fc, id) {

        var gridId = id == null ? this.getGridId() : id;

        var o = gMain.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];


        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});
        //console_logs('cellEditing>>>>>>>>>>', cellEditing);

        this.detailStore = Ext.create('Mplm.store.ProduceQtyStore');
        this.detailStore.getProxy().setExtraParam('rtgastuid', this.selected_rec[0].get('id'));
        this.detailStore.getProxy().setExtraParam('parentCode', this.link);
        this.detailStore.getProxy().setExtraParam('limit', 1000);

        try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}

        Ext.each(columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch (dataIndex) {
                case 'wh_qty':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
            }
        });

        var wh_qty_old = 0;
        var wh_qty_new = 0;
        var available_qty = 0;
        var unique_id = 0;
        var stoqty_uid = 0;

        var deliveryPendingGrid = Ext.create('Ext.grid.Panel', {
            store: this.detailStore,
            title: title,
            cls: 'rfx-panel',
            selModel: vCompanyReserved4 == 'KYNL01KR' ? Ext.create("Ext.selection.CheckboxModel", {}) : null,
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            autoload: true,
            collapsible: false,
            layout: 'fit',
            dockedItems: dockedItems,
            plugins: [cellEditing],
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
                select: function (selModel, record, index, options) {

                },
                itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                    //gMain.selPanel.downListRecord(record);
                }, //endof itemdblclick
                cellkeydown: function (deliveryPendingGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {

                    }

                },
                itemclick: function (view, rec, htmlItem, index, eventObject, opts) {
                    wh_qty_old = rec.get('wh_qty');
                    available_qty = rec.get('available_qty');
                    unique_id = rec.get('unique_id');
                    stoqty_uid = rec.get('stoqty_uid');
                },
                edit: function (view, rec, opts) {

                    wh_qty_new = rec.value;

                    if (wh_qty_new - wh_qty_old > available_qty) {
                        Ext.Msg.alert('경고', '추가 신청하려는 수량이 현재 신청 가능한 수량보다 많습니다.');
                        this.store.rejectChanges();
                    } else {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/sales/product.do?method=updateProductQty',
                            params: {
                                wh_qty: wh_qty_new,
                                wh_qty_old: wh_qty_old - wh_qty_new,
                                unique_id: unique_id,
                                stoqty_uid: stoqty_uid
                            },
                            success: function (result, request) {
                                var result = result.responseText;
                                gm.me().deliveryPendingGrid.getStore().load();
                            },
                            failure: extjsUtil.failureMessage
                        });
                    }
                }
            },//endof listeners
            columns: columns
        });
        gm.me().deliveryPendingGrid = deliveryPendingGrid;
        deliveryPendingGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {

                if (selections.length > 0) {
                    gm.me().addDeliveryConfirmPart.enable();
                } else {
                    gm.me().addDeliveryConfirmPart.disable();
                }

                fc(selections);

                //서브그리드
                gm.me().selected_sub_rec = selections;
            }
        });

        var view = deliveryPendingGrid.getView();

        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function (e) {
                var selectionModel = deliveryPendingGrid.getSelectionModel();
                var select = 0; // select first if no record is selected
                if (selectionModel.hasSelection()) {
                    select = deliveryPendingGrid.getSelectionModel().getSelection()[0].index + 1;
                }
                view.select(select);

            },
            up: function (e) {
                var selectionModel = deliveryPendingGrid.getSelectionModel();
                var select = deliveryPendingGrid.store.totalCount - 1; // select last element if no record is selected
                if (selectionModel.hasSelection()) {
                    select = deliveryPendingGrid.getSelectionModel().getSelection()[0].index - 1;
                }
                view.select(select);

            }
        });

        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
        tabPanel.removeAll(false);
        tabPanel.add(deliveryPendingGrid);
        this.detailStore.load(function (rec) {
            this.sub_rec_count = rec.length;
        });
    },

    editRedord: function (field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        switch (field) {
            case 'po_no':
                gm.editAjax('itemdetail', 'h_reserved43', rec.get(field), 'h_reserved43', this.pallet_no, {type: ''});
                gm.editRedord(field, rec);
                break;
            case 'h_reserved46':
            case 'h_reserved47':
            case 'h_reserved58':
                var assy_uids = [];
                for (var i = 0; i < this.detailStore.data.items.length; i++) {
                    assy_uids.push(this.detailStore.data.items[i].data.assymap_uid);
                }
                gm.editAjax('itemdetail', field, rec.get(field), 'unique_id', assy_uids, {type: ''});
                break;
            default:
                gm.editRedord(field, rec);
                break;
        }

    },

    items: [],
    rtgastuid: 0,
    selected_rec: null,
    selected_sub_rec: null,
    sub_rec_count: 0,
    deliveryPendingGrid: null,
    pallet_no: null
});
