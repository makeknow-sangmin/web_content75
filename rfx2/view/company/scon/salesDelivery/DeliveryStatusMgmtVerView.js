//생산완료 현황
Ext.define('Rfx2.view.company.scon.salesDelivery.DeliveryStatusMgmtVerView', {
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
            type: 'checkbox',
            field_id: 'ignoreDate',
            items: [
                {
                    boxLabel: '날짜조건 해제',
                    checked: false
                },
            ],
        });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'reserved_timestamp1',
            text: gm.getMC('CMD_Date', '납품일자'),
            sdate: Ext.Date.add(new Date(), new Date()),
            edate: new Date()
        });

        this.addSearchField({
            type: 'text',
            field_id: 'car_number',
            emptyText: '차량번호'
        });


        this.addSearchField({
            type: 'text',
            field_id: 'pj_name',
            emptyText: '사업명'
        });

        this.addSearchField({
            type: 'text',
            field_id: 'wa_name',
            emptyText: '고객명'
        });

        this.addSearchField({
            type: 'text',
            field_id: 'project_varchar1',
            emptyText: '업체명'
        });

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE', 'EXCEL']
        });

        this.createStore('Rfx2.model.DeliveryDl', [{
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

        this.printDl = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '납품서 출력',
            tooltip: '납품서 출력을 합니다.',
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var rtgastUid = rec.get('unique_id_long');
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printDl',
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

        this.returnAction = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            text: '반품처리',
            tooltip: '납품서가 생성된 제품에 대하여 납품서 삭제 처리 및 재고 복구 및 반품처리 작업을 실행합니다.',
            disabled: true,
            handler: function () {

                var selections_two = gm.me().gridContractCompany.getSelectionModel().getSelection();
                console_logs('>>>> selections_two', selections_two);
                if (selections_two.length > 1) {
                    Ext.MessageBox.alert('알림', '하나의 요청건만 선택 후 실행 가능한 기능입니다.<br>한 개의 건만 선택해주십시오,');
                    return;
                } else {
                    var rec = selections_two[0];
                    if (rec.get('gr_qty') > 0) {
                        if (rec.get('is_closed') === 'C') {
                            Ext.MessageBox.alert('알림', '이미 반품처리 된 건입니다.');
                            return;
                        } else {
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
                                        title: '반품수량을 입력하시기 바랍니다.',
                                        items: [
                                            {
                                                xtype: 'combo',
                                                fieldLabel: '차량정보 선택',
                                                id: gu.id('carinfo'),
                                                anchor: '97%',
                                                store: gm.me().carMgmtStore,
                                                name: 'carUid',
                                                valueField: 'unique_id_long',
                                                minChars: 1,
                                                allowBlank: false,
                                                displayField: 'disp_carno',
                                                emptyText: '선택해주세요.',
                                                listConfig: {
                                                    loadingText: '검색중...',
                                                    emptyText: '일치하는 항목 없음',
                                                    getInnerTpl: function () {
                                                        return '<div data-qtip="{unique_id_long}">{disp_carno}</div>';
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'numberfield',
                                                id: gu.id('return_qty'),
                                                anchor: '97%',
                                                name: 'return_qty',
                                                fieldLabel: '반품수량',
                                                value: rec.get('gr_qty')
                                            },
                                            {
                                                xtype: 'datefield',
                                                id: gu.id('return_date'),
                                                anchor: '97%',
                                                name: 'return_date',
                                                fieldLabel: '반품일자',
                                                format: 'Y-m-d',
                                                value: new Date()
                                            }
                                        ]
                                    }
                                ]
                            });

                            var prWin = Ext.create('Ext.Window', {
                                modal: true,
                                title: '반품처리',
                                width: 450,
                                height: 300,
                                items: form,
                                buttons: [
                                    {
                                        text: CMD_OK,
                                        scope: this,
                                        handler: function () {
                                            Ext.MessageBox.show({
                                                title: '반품처리',
                                                msg: '선택 한 건을 반품처리하시겠습니까?<br><font color=red><b>본 작업을 실행 시 취소할 수 없습니다.</b></font>',
                                                buttons: Ext.MessageBox.YESNO,
                                                icon: Ext.MessageBox.QUESTION,
                                                fn: function (btn) {
                                                    if (btn == "no") {
                                                        return;
                                                    } else {
                                                        var input_returrn = gu.getCmp('return_qty').getValue();
                                                        var gr_qty = rec.get('gr_qty');
                                                        if (input_returrn > gr_qty) {
                                                            Ext.MessageBox.alert('알림', '반품수량은 출고수량보다 클 수 없습니다.')
                                                            return;
                                                        } else {
                                                            Ext.Ajax.request({
                                                                url: CONTEXT_PATH + '/sales/delivery.do?method=returnProduct',
                                                                params: {
                                                                    unique_id: rec.get('unique_id_long'),
                                                                    dl_uid: rec.get('dl_uid'),
                                                                    sloast_uid: rec.get('sloast_uid'),
                                                                    return_qty: gu.getCmp('return_qty').getValue(),
                                                                    return_date: gu.getCmp('return_date').getValue(),
                                                                    carinfo_uid : gu.getCmp('carinfo').getValue()
                                                                },
                                                                success: function (response, request) {
                                                                    gm.setCenterLoading(false);
                                                                    gm.me().store.load();
                                                                    gm.me().poPrdDetailStore.load();
                                                                    Ext.MessageBox.alert('알림', '처리되었습니다.');
                                                                    if (prWin) {
                                                                        prWin.close();
                                                                    }
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
                                            prWin.close();
                                        }
                                    }
                                ]
                            });

                            prWin.show();
                        }

                    } else {
                        Ext.MessageBox.alert('알림', '이미 취소된 수량입니다.');
                        return;
                    }
                }
            }
        });

        this.deleteAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '수정처리',
            tooltip: '선택한 납품서 내역을 삭제 후 출하대기 상태로 되돌립니다.<br>출하된 재고는 원상복구 됩니다.',
            disabled: true,
            handler: function () {
                var selections_two = gm.me().gridContractCompany.getSelectionModel().getSelection();
                console_logs('>>>> selections_two', selections_two);
                var is_delete = true;
                var sledelUids = [];
                for (var i = 0; i < selections_two.length; i++) {
                    var rec = selections_two[i];
                    if (rec.get('gr_qty') > 0) {
                        if (rec.get('is_closed') === 'C') {
                            Ext.MessageBox.alert('알림', '반품처리가 된 건이 선택되었습니다.');
                            is_delete = false;
                            break;
                        } else {
                            sledelUids.push(rec.get('unique_id_long'));
                        }
                    } else {
                        Ext.MessageBox.alert('알림', '이미 취소된 수량입니다.');
                        is_delete = false;
                        return;
                    }
                }

                if (sledelUids.length > 0 && is_delete === true) {
                    Ext.MessageBox.show({
                        title: '수정처리',
                        msg: '선택한 납품서 내역을 삭제 하시겠습니까?<br>선택한 납품서 내역을 삭제 후 출하대기 상태로 되돌리며.<br>출하된 재고는 원상복구 됩니다.',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no") {
                                return;
                            } else {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/delivery.do?method=removeDlReturnPrd',
                                    params: {
                                        sledel_uids : sledelUids,
                                    },
                                    success: function (response, request) {
                                        gm.setCenterLoading(false);
                                        gm.me().store.load();
                                        gm.me().poPrdDetailStore.load();
                                        Ext.MessageBox.alert('알림', '처리되었습니다.');
                                        
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });

        this.downloadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: 'Excel',
            tooltip: '선택한 양생실의 현황을 다운로드 합니다.',
            disabled: true,
            handler: function () {
                gm.setCenterLoading(true);
                var rec = gm.me().grid.getSelectionModel().getSelection();
                var uids = [];
                for (var i = 0; i < rec.length; i++) {
                    var selections = rec[i];
                    uids.push(selections.get('unique_id_long'));
                }
                console_logs('>>>> UIDS', uids);
                var store = Ext.create('Rfx2.store.company.bioprotech.PoPrdShipmentPackingListVerStore', {});
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("is_excel_print", 'Y');
                store.getProxy().setExtraParam('dl_uids_arr', uids)
                store.getProxy().setExtraParam("menuCode", 'SDL3_EXL');

                store.getProxy().setExtraParam('orderBy', 'item_code');
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
                } catch (noError) { }

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

        buttonToolbar.insert(1, this.printDl);
        buttonToolbar.insert(3, this.downloadSheetAction);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);





        this.poPrdDetailStore = Ext.create('Rfx2.store.DeliveryStateStore', {});

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
                        this.returnAction,
                        this.deleteAction
                    ]
                },

            ],
            columns: [
                // { text: '수주번호', width: 100, style: 'text-align:center', dataIndex: 'order_number'/*, sortable: false*/ },
                { text: this.getMC('msg_order_grid_prd_name', '품번'), width: 120, style: 'text-align:center', dataIndex: 'srcahd_item_code'/*, sortable: false*/ },
                { text: this.getMC('msg_order_grid_prd_name', '품명'), width: 120, style: 'text-align:center', dataIndex: 'srcahd_item_name'/*, sortable: false*/ },

                { text: this.getMC('msg_order_grid_prd_name', '규격'), width: 150, style: 'text-align:center', dataIndex: 'concat_spec_desc'/*, sortable: false*/ },
                
                {
                    text: this.getMC('msg_order_grid_prd_unitprice', '수주수량'),
                    width: 100, style: 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex: 'po_qty'/*, sortable: false*/,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'po_qty') {
                            context.record.set('po_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_order_grid_prd_unitprice', '출고수량'),
                    width: 100,
                    style: 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex: 'gr_qty'/*, sortable: false*/,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'gr_qty') {
                            context.record.set('gr_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_order_grid_prd_unitprice', '단가'),
                    width: 100,
                    style: 'text-align:center',
                    decimalPrecision: 5,
                    editor: 'numberfield',
                    css: 'edit-cell',
                    dataIndex: 'sales_price'/*, sortable: false*/,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sales_price') {
                            context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },

            ],
            title: this.getMC('mes_reg_prd_info_msg', '납품서 상세내역'),
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {
                    var columnName = e.field;
                    console_logs('e.record >>>>>>> ', e.field);
                    var unique_id = e.record.get('sloast_uid');
                    var sales_price = e.record.get('sales_price');
                    var po_qty = e.record.get('po_qty');
                    var sales_amount = sales_price * po_qty;
                    console_logs('>>>>> sales_amount', sales_amount);
                    gm.me().editSalesPrice(unique_id, sales_price, sales_amount);
                    gm.me().poPrdDetailStore.load();
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
                case 'sales_price':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'ap_Wquan':
                case 'sales_price':
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
                    gm.me().returnAction.enable();
                    gm.me().deleteAction.enable();
                } else {
                    gm.me().returnAction.disable();
                    gm.me().deleteAction.disable();
                }
            }
        });

        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

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
                    width: '54%',
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
                gUtil.enable(gMain.selPanel.printDl);
                gUtil.enable(gMain.selPanel.downloadSheetAction);
                // gUtil.enable(gMain.selPanel.editPoAction);
                // gUtil.enable(gMain.selPanel.removeAction);
                // gUtil.disable(gMain.selPanel.modifyAction);
                // gUtil.enable(gMain.selPanel.fileattachAction);
                // gm.me().cartGoReq.enable();
                // gUtil.enable(gMain.selPanel.cartGoReq);
                // var rec = selections[0];
                // gm.me().cartGoReq.enable();
                this.poPrdDetailStore.getProxy().setExtraParam('dl_uid', rec.get('unique_id_long'));
                this.poPrdDetailStore.load();
            } else {
                gUtil.disable(gMain.selPanel.printDl);
                gUtil.disable(gMain.selPanel.downloadSheetAction);
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
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_NEW_DIVISION' }),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_CONDITION' }),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SALES_TYPE' }),

    searchPrdStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'PRD' }),
    searchAssyStore: Ext.create('Mplm.store.MaterialSearchStore', { type: 'ASSY' }),

    searchItemStore: Ext.create('Mplm.store.ProductStore', {}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'PO_SAMPLE_TYPE' }),
    cartDoListStore: Ext.create('Rfx2.store.company.bioprotech.CartDoListVerStore'),
    carMgmtStore: Ext.create('Mplm.store.CarMgntStore'),
    editSalesPrice: function (unique_id, sales_price, sales_amount) {
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/sales/buyer.do?method=updateSalesPriceBySledel',
            params: {
                unique_id: unique_id,
                sales_price: sales_price,
                sales_amount: sales_amount
            },
            success: function (result, request) {
                console_logs('price setting status', 'OK');
            },
            failure: extjsUtil.failureMessage
        });
    },
});