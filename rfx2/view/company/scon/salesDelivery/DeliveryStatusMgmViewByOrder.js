//생산완료 현황
Ext.define('Rfx2.view.gongbang.salesDelivery.DeliveryStatusMgmViewByOrder', {
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
            type: 'dateRange',
            field_id: 'delivery_plan',
            text: "납기일",
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });


        this.addSearchField({
            type: 'text',
            field_id: 'wa_name',
            emptyText: '고객명'
        });

        this.addSearchField({
            type: 'text',
            field_id: 'reserved_varcharj',
            emptyText: '업체명'
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

        this.createStore('Rfx2.model.DlStatusOrder', [{
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
            text: '거래명세서 출력',
            tooltip: '거래명세서 출력을 합니다.',
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

        this.downloadSheetActionByDelivery = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: '규격별 출하이력',
            disabled: false,
            handler: function () {
                var valSdate = Ext.Date.getFirstDateOfMonth(new Date());
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
                            title: '기준이 되는 시작일자와 종료일자를 선택하십시오.',
                            items: [
                                {
                                    xtype: 'datefield',
                                    id: gu.id('start_date'),
                                    anchor: '97%',
                                    name: 'start_date',
                                    fieldLabel: '시작일자',
                                    format: 'Y-m-d',
                                    value: valSdate
                                },
                                {
                                    xtype: 'datefield',
                                    id: gu.id('end_date'),
                                    anchor: '97%',
                                    name: 'end_date',
                                    fieldLabel: '종료일자',
                                    format: 'Y-m-d',
                                    value: new Date()
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: 'Excel 출력',
                    width: 450,
                    height: 250,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                gm.setCenterLoading(true);
                                prWin.setLoading(true);
                                var store = Ext.create('Rfx2.store.company.chmr.ProducePerformanceExcelStore', {});
                                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                                store.getProxy().setExtraParam("srch_fields", 'major');
                                store.getProxy().setExtraParam("srch_rows", 'all');
                                store.getProxy().setExtraParam("is_excel_print", 'Y');
                                store.getProxy().setExtraParam("is_based_product",'Y');
                                store.getProxy().setExtraParam("menuCode", 'SRO5_PERF_EXL_PRD');
                                var start_date = gu.getCmp('start_date').getValue();

                                var start_date_year = start_date.getFullYear();
                                var start_date_month = start_date.getMonth() +1;
                                var start_date_day = start_date.getDate();

                                if(start_date_month < 10) {
                                    start_date_month = '0' + start_date_month;
                                }
                                if(start_date_day < 10) {
                                    start_date_day = '0' + start_date_day;
                                }

                                var start_date_parse = start_date_year + '-' + start_date_month+ '-' +  start_date_day;

                                // 종료일
                                var end_date = gu.getCmp('end_date').getValue();

                                var end_date_year = end_date.getFullYear();
                                var end_date_month = end_date.getMonth() +1;
                                var end_date_day = end_date.getDate();

                                if(end_date_month < 10) {
                                    end_date_month = '0' + end_date_month;
                                }
                                if(end_date_day < 10) {
                                    end_date_day = '0' + end_date_day;
                                }

                                var end_date_parse = end_date_year + '-' + end_date_month+ '-' +  end_date_day;

                                store.getProxy().setExtraParam("start_date", start_date_parse);
                                store.getProxy().setExtraParam("end_date", end_date_parse);
                                // store.getProxy().setExtraParam("mchn_code", gu.getCmp('mchn_code').getValue());
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
                                                    prWin.setLoading(false);
                                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                                    top.location.href = url;
                                                    if(prWin) {
                                                        prWin.close();
                                                    }

                                                } else {
                                                    prWin.setLoading(false);
                                                    Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
                                                    if(prWin) {
                                                        prWin.close();
                                                    }
                                                }
                                            }
                                        });

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

        buttonToolbar.insert(1, this.downloadSheetActionByDelivery);
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
            // bbar: Ext.create('Ext.PagingToolbar', {
            //     store: this.poPrdDetailStore,
            //     displayInfo: true,
            //     displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
            //     emptyMsg: "표시할 항목이 없습니다.",
            //     listeners: {
            //         beforechange: function (page, currentPage) {
            //             this.getStore().getProxy().setExtraParam('start', (currentPage - 1) * 100);
            //             this.getStore().getProxy().setExtraParam('page', currentPage);
            //             this.getStore().getProxy().setExtraParam('limit', 100);
            //         }
            //     }
            // }),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            // dockedItems: [
            //     {
            //         dock: 'top',
            //         xtype: 'toolbar',
            //         items: [
            //             this.purListSrch,
            //             // this.assignShipmentAction,
            //             // this.addMyCart,
            //             // this.cartGoReq
            //         ]
            //     },
            //     {
            //         dock: 'top',
            //         xtype: 'toolbar',
            //         cls: 'my-x-toolbar-default1',
            //         items: [{
            //             xtype: 'triggerfield',
            //             emptyText: '제품명',
            //             id: gu.id('item_name'),
            //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
            //             name: 'item_name',
            //             listeners: {
            //                 specialkey: function (field, e) {
            //                     if (e.getKey() == Ext.EventObject.ENTER) {
            //                         gm.me().poPrdDetailStore.getProxy().setExtraParam('item_name', '%' + gu.getCmp('item_name').getValue() + '%');
            //                         gm.me().poPrdDetailStore.load(function () { });
            //                     }
            //                 }
            //             },
            //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            //             'onTrigger1Click': function () {
            //                 gu.getCmp('item_name').setValue('');
            //                 gm.me().poPrdDetailStore.getProxy().setExtraParam('item_name', gu.getCmp('item_name').getValue());
            //                 gm.me().poPrdDetailStore.load(function () { });
            //             }
            //         }, {
            //             xtype: 'triggerfield',
            //             emptyText: '최종고객사',
            //             id: gu.id('final_wa_name'),
            //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
            //             name: 'final_wa_name',
            //             listeners: {
            //                 specialkey: function (field, e) {
            //                     if (e.getKey() == Ext.EventObject.ENTER) {
            //                         gm.me().poPrdDetailStore.getProxy().setExtraParam('final_wa_name', '%' + gu.getCmp('final_wa_name').getValue() + '%');
            //                         gm.me().poPrdDetailStore.load(function () { });
            //                     }
            //                 }
            //             },
            //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            //             'onTrigger1Click': function () {
            //                 gu.getCmp('final_wa_name').setValue('');
            //                 gm.me().poPrdDetailStore.getProxy().setExtraParam('final_wa_name', gu.getCmp('final_wa_name').getValue());
            //                 gm.me().poPrdDetailStore.load(function () { });
            //             }
            //         }, {
            //             xtype: 'triggerfield',
            //             emptyText: '고객PO번호',
            //             id: gu.id('project_varchard'),
            //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
            //             name: 'query_sup',
            //             listeners: {
            //                 specialkey: function (field, e) {
            //                     if (e.getKey() == Ext.EventObject.ENTER) {
            //                         gm.me().poPrdDetailStore.getProxy().setExtraParam('project_varchard', '%' + gu.getCmp('project_varchard').getValue() + '%');
            //                         gm.me().poPrdDetailStore.load(function () { });
            //                     }
            //                 }
            //             },
            //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            //             'onTrigger1Click': function () {
            //                 Ext.getCmp('project_varchard').setValue('');
            //                 gm.me().poPrdDetailStore.getProxy().setExtraParam('project_varchard', gu.getCmp('project_varchard').getValue());
            //                 gm.me().poPrdDetailStore.load(function () { });
            //             }
            //         },
            //         {
            //             xtype: 'triggerfield',
            //             emptyText: '수주번호',
            //             id: gu.id('order_number'),
            //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
            //             name: 'query_sup',
            //             listeners: {
            //                 specialkey: function (field, e) {
            //                     if (e.getKey() == Ext.EventObject.ENTER) {
            //                         gm.me().poPrdDetailStore.getProxy().setExtraParam('order_number', '%' + gu.getCmp('order_number').getValue() + '%');
            //                         gm.me().poPrdDetailStore.load(function () { });
            //                     }
            //                 }
            //             },
            //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            //             'onTrigger1Click': function () {
            //                 Ext.getCmp('order_number').setValue('');
            //                 gm.me().poPrdDetailStore.getProxy().setExtraParam('order_number', gu.getCmp('order_number').getValue());
            //                 gm.me().poPrdDetailStore.load(function () { });
            //             }
            //         }
            //         ]
            //     }
            // ],
            columns: [
                { text: '출하일자', width: 100, style: 'text-align:center', dataIndex: 'reserved_timestamp1'/*, sortable: false*/ },
                { text: '차량번호', width: 100, style: 'text-align:center', dataIndex: 'car_info'/*, sortable: false*/ },
                // { text: '최종고객사', width: 100, style: 'text-align:center', dataIndex: 'final_wa_name'/*, sortable: false*/ },
                // {
                //     text: '요청수량', width: 95, style: 'text-align:center', dataIndex: 'ap_Wquan', align: 'right',
                //     editor: 'numberfield',
                //     renderer: function (value, context, tmeta) {
                //         return Ext.util.Format.number(value, '0,00/i');
                //     },
                // },
                // { text: 'Site', width: 80, style: 'text-align:center', dataIndex: 'reserved5'/*, sortable: false*/ },
                // { text: this.getMC('msg_order_grid_prd_name', '품번'), width: 150, style: 'text-align:center', dataIndex: 'srcahd_item_code'/*, sortable: false*/ },
                // { text: this.getMC('msg_order_grid_prd_name', '품명'), width: 150, style: 'text-align:center', dataIndex: 'srcahd_item_name'/*, sortable: false*/ },
                // { text: this.getMC('msg_order_grid_prd_desc', '기준모델'), width: 100, style: 'text-align:center', dataIndex: 'description'/*, sortable: false*/ },
                // {
                //     text: '고객요청일', width: 100, style: 'text-align:center', dataIndex: 'reserved_timestamp1'/*, sortable: false*/,
                //     renderer: function (value, context, tmeta) {
                //         if (value !== null && value.length > 0) {
                //             return value.substring(0, 10);
                //         }
                //     },
                // },
                // { text: this.getMC('msg_order_grid_prd_name', '규격'), width: 150, style: 'text-align:center', dataIndex: 'srcahd_specification'/*, sortable: false*/ },
                // { text: '고객PO번호', width: 120, style: 'text-align:center', dataIndex: 'project_varchard' },
                // { text: '수주특기사항', width: 150, style: 'text-align:center', dataIndex: 'reserved1' },
                // { 
                //     text: this.getMC('msg_order_grid_prd_unitprice', '단가'), 
                //     width: 150, style: 'text-align:center', 
                //     decimalPrecision: 5, 
                //     dataIndex: 'sales_price'/*, sortable: false*/, 
                //     align: 'right' 
                // },
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
                    text: this.getMC('msg_order_grid_prd_unitprice', '잔여수량'), 
                    width: 100, 
                    style: 'text-align:center',
                    decimalPrecision: 5, 
                    dataIndex: 'remain_qty'/*, sortable: false*/, 
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'remain_qty') {
                            context.record.set('remain_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                }
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
            title: this.getMC('mes_reg_prd_info_msg', '납품서 상세내역'),
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                },
                cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if(eOpts.ctrlKey && eOpts.keyCode === 67) {
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

                } else {

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
                    width: '64%',
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
                for(var i = 0; i<selections.length; i++) {
                    var rec = selections[i];
                }
                // var rec = selections[0];
                // var status = rec.get('status');
                // //gm.me().addPoPrdPlus.enable();
                // gm.me().vSELECTED_ASSYMAP_UID = rec.get('unique_uid');
                // gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                // gUtil.enable(gMain.selPanel.printDl);
                // this.poPrdDetailStore.getProxy().setExtraParam('sloast_uid', rec.get('unique_id_long'));
                // this.poPrdDetailStore.load();
            } else {
                gUtil.disable(gMain.selPanel.printDl);
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
});