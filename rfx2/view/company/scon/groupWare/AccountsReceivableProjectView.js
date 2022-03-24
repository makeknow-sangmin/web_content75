//주문작성

Ext.define('Rfx2.view.company.scon.groupWare.AccountsReceivableProjectView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'account-receivable-project-view',
    initComponent: function () {


        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'checkbox',
            field_id: 'is_all',
            items: [
                {
                    boxLabel: '정산완료만 확인',
                    checked: false
                },
            ],
        });
        this.addSearchField('reserved_varchard');
        this.addSearchField('pj_name');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        var searchToolbar = this.createSearchToolbar();
        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.AccountsReceivableProjectModel', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
        );

        this.setRowClass(function (record, index) {
            var c = record.get('is_bill');
            console_logs('>>>> c', c);
            if (c === 'Y') {
                return 'blue-row';
            } else {
                return 'white-row';
            }
        });


        var arr = [];

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        Ext.each(this.columns, function (columnObj, index) {
            console.log(this.columns);
            var o = columnObj;

            var dataIndex = o['dataIndex'];

            if (o['dataType'] === 'number') {
                console.log('dataType!!!!', o['text'] + ' : ' + o['dataType']);
                o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                    if (gm.me().store.data.items.length > 0) {
                        var summary = gm.me().store.data.items[0].get('summary');
                        console.log('summary', summary);
                        console.log('summary.length', summary.length);
                        if (summary.length > 0) {
                            var objSummary = Ext.decode(summary);
                            console.log('return', Ext.util.Format.number(objSummary[dataIndex], '0,00/i'));
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
            features: [
                {
                    ftype: 'summary',
                    dock: 'top',
                },
            ],
        };

        //grid 생성.
        this.usePagingToolbar = false;
        this.createGrid(searchToolbar, buttonToolbar/**, option**/);

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 0 || index == 1 || index == 2 || index == 3 || index == 4 || index == 5 || index == 11) {
                buttonToolbar.items.remove(item);
            }
        });

        this.salessettleAction = Ext.create('Ext.Action', {
            itemId: 'salessettleAction',
            iconCls: 'af-plus-circle',
            disabled: true,
            text: '매출정산',
            plain: true,
            handler: function (widget, event) {
                var selectedUids = [];
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var item_abst = '';
                var pj_name = '';
                var sales_price_display = 0;
                if (selections.length > 0) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        selectedUids.push(rec.get('unique_id_long'));
                        if (i == 0) {
                            item_abst = rec.get('pj_name') + ' 외 ' + (selections.length - 1) + '건';
                            pj_name = rec.get('pj_name');
                        }
                        var supply_price = rec.get('supply_price');
                        var is_bill = rec.get('is_bill');
                        if (supply_price === 0) {
                            Ext.MessageBox.alert('알림', '공급가액이 입력이 되지 않는 항목이 있습니다.<br>다시 확인해주세요.');
                            return;
                        }

                        if (is_bill === 'Y') {
                            Ext.MessageBox.alert('알림', '이미 정산처리 된 항목이 있습니다. <br>다시 확인해주세요.');
                            return;
                        }

                        sales_price_display = sales_price_display + (rec.get('sales_price') * rec.get('prebill_qty'));
                    }
                }
                var wa_code = selections[0]['data']['wa_code'];
                var wa_name = selections[0]['data']['wa_name'];
                var txt_name = '[' + wa_code + '] ' + wa_name + ' - ' + (new Date()).getFullYear() + '년' + ((new Date()).getMonth() + 1) + '월';
                var myWidth = 700;
                var myHeight = 300;

                var formItem = [
                    {
                        fieldLabel: '정산 구분',
                        xtype: 'textarea',
                        anchor: '100%',
                        padding: '0 0 5px 10px',
                        labelWidth: 80,
                        name: 'txt_name',
                        style: 'width: 95%',
                        value: txt_name
                    },
                    {
                        xtype: 'datefield',
                        id: gu.id('tax_bill_date'),
                        name: 'tax_bill_date',
                        padding: '0 0 5px 10px',
                        labelWidth: 80,
                        style: 'width: 95%',
                        allowBlank: true,
                        value: new Date(),
                        fieldLabel: '세금 계산서',
                        format: 'Y-m-d',
                    },
                    {
                        fieldLabel: '현장명',
                        xtype: 'textfield',
                        anchor: '100%',
                        padding: '0 0 5px 10px',
                        labelWidth: 80,
                        name: 'pj_name',
                        readOnly: true,
                        style: 'width: 95%',
                        fieldStyle: 'width: 95%; background-color: #ebe8e8; background-image: none; text-align:left',
                        value: pj_name
                    },
                    {
                        fieldLabel: '합계금액',
                        xtype: 'numberfield',
                        anchor: '100%',
                        padding: '0 0 5px 10px',
                        labelWidth: 80,
                        id: gu.id('sales_price_display'),
                        name: 'sales_price_display',
                        readOnly: false,
                        style: 'width: 95%',
                        // fieldStyle: 'background-color: #ebe8e8; text-align: right',
                        value: sales_price_display
                    },
                    {
                        xtype: 'checkbox',
                        name: 'is_sep_yn',
                        padding: '0 0 5px 10px',
                        id: gu.id('is_sep_yn'),
                        fieldLabel: '분할청구여부',
                        checked: false
                    }
                ];

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
                    items: formItem
                })

                var item = [form];

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '매출정산 작성',
                    width: myWidth,
                    height: myHeight,
                    items: item,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {
                                    var selections = gm.me().grid.getSelectionModel().getSelection();
                                    var isCheck = gu.getCmp('is_sep_yn').getValue();
                                    var isSep = '';
                                    console_logs('>>> isCheck', isCheck);
                                    if (isCheck === true) {
                                        isSep = 'Y';
                                    } else {
                                        isSep = 'N';
                                    }
                                    var pj_uids = [];
                                    var srcahd_uids = [];
                                    var order_com_unique = "";
                                    var po_qty = 0;
                                    var sales_price = 0;
                                    var sales_amount = 0;
                                    var uid_sloasts = [];
                                    var po_qtys = [];
                                    for (var i = 0; i < selections.length; i++) {
                                        var selection = selections[i];
                                        pj_uids.push(selection.get('pj_uid'));
                                        srcahd_uids.push(selection.get('srcahd_uid'));
                                        order_com_unique = selection.get('order_com_unique');
                                        po_qty = po_qty + selection.get('po_qty');
                                        sales_price = sales_price + selection.get('sales_price');
                                        // sales_amount = sales_amount + selection.get('sales_amount');
                                        uid_sloasts.push(selection.get('unique_id'));
                                        po_qtys.push(selection.get('prebill_qty'))
                                    }

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/account/arap.do?method=addSalesSettleGs',
                                        params: {
                                            item_abst: item_abst,
                                            pj_uids: pj_uids,
                                            srcahd_uids: srcahd_uids,
                                            order_com_unique: order_com_unique,
                                            po_qty: po_qty,
                                            sales_price: sales_price,
                                            sales_amount: gu.getCmp('sales_price_display').getValue(0),
                                            uid_sloasts: uid_sloasts,
                                            isSep: isSep,
                                            tax_bill_date: gu.getCmp('tax_bill_date').getValue(),
                                            po_qtys: po_qtys
                                        },
                                        success: function (result, request) {
                                            gm.me().store.load();
                                            // gm.me().buyerStore.load();
                                            // gm.me().delBuyerGrid.store.load();
                                            Ext.Msg.alert('안내', '정산을 요청하였습니다.', function () {
                                            });
                                            prWin.close();
                                            gUtil.disable(gm.me().addArAction);
                                            gUtil.disable(gm.me().salessettleAction);
                                        },// endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });// endofajax
                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show();
            }
        });

        this.printProduceResult = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '외상매출리스트 출력',
            tooltip: '외상매출리스트를 출력합니다.',
            disabled: true,
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var unique_ids = '';
                if (selections.length > 0) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        unique_ids += rec.get('unique_id_long') + ',';
                    }
                }
                var sel = gm.me().delBuyerGrid.getSelectionModel().getSelection()[0];

                if (unique_ids.length > 0) {
                    unique_ids = unique_ids.substr(0, unique_ids.length - 1);
                }

                Ext.Ajax.request({
                    waitMsg: '다운로드 요청중입니다.<br> 잠시만 기다려주세요.',
                    url: CONTEXT_PATH + '/pdf.do?method=printAr',
                    params: {
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'N',
                        type: 'GOV',
                        combst_uid: sel.get('unique_id_long'),
                        unique_ids: unique_ids
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
                        gm.me().pdfDownload(size, reportSelection, ++pos);
                    },

                });
            }
        });

        buttonToolbar.insert(0, this.salessettleAction);
        buttonToolbar.insert(1, this.printProduceResult);

        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var s_date = Ext.getCmp('s_date_arv').getValue();
                    var e_date = Ext.getCmp('s_date_arv').getValue();
                    var lot_no = Ext.getCmp('lot_no').getValue();
                } catch (e) {
                }
                gm.me().buyerStore.getProxy().setExtraParam('s_date', Ext.Date.format(s_date, 'Y-m-d'));
                gm.me().buyerStore.getProxy().setExtraParam('e_date', Ext.Date.format(e_date, 'Y-m-d'));
                gm.me().buyerStore.getProxy().setExtraParam('name', lot_no);
                gm.me().buyerStore.load();
            }
        });


        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()]
        });

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                gUtil.enable(gm.me().addArAction);
                gUtil.enable(gm.me().salessettleAction);
            } else {
                gUtil.disable(gm.me().addArAction);
                gUtil.disable(gm.me().salessettleAction);
            }
        });


        this.store.getProxy().setExtraParam('is_all', 'false');

        this.callParent(arguments);

        this.store.load(function (records) {

        });
    },

    //   rtgast_uid_arr : [],
    setRelationship: function (relationship) {
    },
    createCenter: function () {/*자재목록 그리드*/
        this.grid.setTitle('납품목록');
        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            width: '55%',
            items: [this.grid]
        });


        return this.center;
    },
    createWest: function () {/*요청서 목록*/

        this.removeAssyAction = Ext.create('Ext.Action', {
            itemId: 'removeAssyAction',
            iconCls: 'af-remove',
            text: 'Assy' + CMD_DELETE,
            disabled: true,
            handler: function (widget, event) {
                Ext.MessageBox.show({
                    title: delete_msg_title,
                    msg: delete_msg_content,
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().deleteAssyConfirm,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });


        this.buyerStore = Ext.create('Rfx2.store.company.chmr.BuyerProjectStore');
        this.buyerStore.getProxy().setExtraParam('project_del_finished', 'T');


        this.delBuyerGrid =
            Ext.create('Rfx.view.grid.AccountsReceivableVerGrid', {
                title: '납품 고객사',// cloud_product_class,
                border: true,
                resizable: true,
                scroll: true,
                collapsible: false,
                store: this.buyerStore,
                multiSelect: true,
                selModel: Ext.create("Ext.selection.CheckboxModel", {}),
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: this.buyerStore,
                    displayInfo: true,
                    displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                    emptyMsg: "표시할 항목이 없습니다."
                    , listeners: {
                        beforechange: function (page, currentPage) {

                        }
                    }

                }),
                dockedItems: [
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default2',
                        items: [
                            this.purListSrch//,
                        ]
                    },
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default1',
                        items: [
                            // {
                            // 	xtype: 'label',
                            // 	width: 40,
                            // 	text: '기간',
                            // 	style: 'color:white;'

                            // },
                            // {
                            // 	id: gu.id('s_date_arv'),
                            // 	name: 's_date',
                            // 	format: 'Y-m-d',
                            // 	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            // 	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            // 	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            // 	xtype: 'datefield',
                            // 	value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                            // 	width: 98

                            // }, {
                            // 	xtype: 'label',
                            // 	text: "~",
                            // 	style: 'color:white;'
                            // },
                            // {
                            // 	id: gu.id('e_date_arv'),
                            // 	name: 'e_date',
                            // 	format: 'Y-m-d',
                            // 	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            // 	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            // 	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            // 	xtype: 'datefield',
                            // 	value: new Date(),
                            // 	width: 98

                            // },
                            {
                                xtype: 'triggerfield',
                                emptyText: '고객사 명',
                                id: gu.id('src_wa_name'),
                                name: 'wa_name',
                                listeners: {
                                    specialkey: function (field, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER) {
                                            gm.me().buyerStore.getProxy().setExtraParam('wa_name', gu.getCmp('src_wa_name').getValue());
                                            gm.me().buyerStore.load(function () {
                                            });
                                        }
                                    }
                                },
                                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                'onTrigger1Click': function () {
                                    Ext.getCmp('src_wa_name').setValue('');
                                    gm.me().buyerStore.getProxy().setExtraParam('query', gu.getCmp('src_wa_name').getValue());
                                    gm.me().buyerStore.load(function () {
                                    });
                                }
                            }
                        ]
                    },
                ] //dockedItems of End


            });//delBuyerGrid of End


        this.delBuyerGrid.store.load();

        this.delBuyerGrid.store.on('load', function (store, records, successful, eOpts) {
            var start_date = new Date();
            console.log('>> start_date', start_date);

            var arr = [];
            var prev_rec = null;
            for (var i = 0; i < records.length; i++) {
                var cur = records[i];
                prev_rec = {};
                for (var key in cur['data']) {
                    prev_rec[key] = cur.get(key);
                }
                var unique_id = cur.get('unique_id');
                prev_rec['unique_id'] = unique_id;


                var po_no = cur.get('po_no');
                prev_rec['po_no'] = po_no;

                var name = cur.get('name');
                prev_rec['name'] = name;

                var item_quan = cur.get('item_quan');
                prev_rec['item_quan'] = item_quan;

                var creator = cur.get('creator');
                prev_rec['creator'] = creator;

                var create_date = cur.get('create_date');
                prev_rec['create_date'] = create_date;


                arr.push(prev_rec);
            }
            records = arr;
            console_logs('==== storeLoadCallback arr', arr);

            store.removeAll();
            store.add(arr);

            var end_date = new Date();
            console.log('end_date', end_date);

            var elapsed_time = end_date - start_date;
            console.log('>> elapsed_time', elapsed_time);
        });
        this.delBuyerGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                try {
                    if (selections.length) {
                        console_logs('>>>>> selection', selections);
                        var rec = selections[0];
                        var start_delbuyergrid_date = new Date();
                        console.log('start_delbuyergrid_date', start_delbuyergrid_date);
                        gm.me().SELECTED_UID = rec.get('unique_id');
                        gm.me().SELECTED_RECORD = rec;
                        gm.me().store.getProxy().setExtraParam('combst_uid', gm.me().SELECTED_UID);
                        // gm.me().store.getProxy().setExtraParam('is_all', 'false');
                        gm.me().store.load({});
                        console_logs('---ssss', gm.me().store);
                        gm.me().printProduceResult.enable();
                    } else {
                        gm.me().store.getProxy().setExtraParam('combst_uid', -1);
                        gm.me().store.load({});
                        gm.me().printProduceResult.disable();
                    }
                } catch (e) {
                    console_logs('e', e);
                }
            }
        });

        this.west = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: true,
            region: 'west',
            width: '45%',
            layoutConfig: {columns: 2, rows: 1},

            items: [this.delBuyerGrid /*, myFormPanel*/]
        });

        return this.west;
    },
    rtgapp_store: null,
    useRouting: false,
});
