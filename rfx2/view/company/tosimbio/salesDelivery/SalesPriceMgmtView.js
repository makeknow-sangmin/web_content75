Ext.define('Rfx2.view.company.tosimbio.salesDelivery.SalesPriceMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'contract-material-view',


    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //this.addSearchField('unique_id');
        this.setDefComboValue('standard_flag', 'valueField', 'R');

        this.addSearchField({
            type: 'checkbox',
            field_id: 'existSalesPrice',
            items: [
                {
                    boxLabel: this.getMC('msg_sales_price_only_unitprice', '단가있는 품목만'),
                    checked: true
                },
            ],
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        //this.addSearchField('supplier_name');
        //this.addSearchField('specification');
        //this.addSearchField('description');

        this.addCallback('CHECK_SP_CODE', function (combo, record) {

            gMain.selPanel.refreshStandard_flag(record);

        });

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        (buttonToolbar.items).each(function (item, index, length) {
            if (index !== 0) {
                buttonToolbar.remove(item);
            }
        });


        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        //console_logs('this.fields', this.fields);
        this.createStore('Rfx2.model.SalesPriceMgmtProduct', [{
            property: 'unique_id',
            direction: 'DESC'
        }], gm.pageSize
            , {},
            ['srcahd']
        );

        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.salesPriceListStore = Ext.create('Rfx2.store.company.bioprotech.SalesPriceMgmtStore', { pageSize: 100000 });
        this.salesPriceByCompanyListStore = Ext.create('Rfx2.store.company.bioprotech.SalesPriceMgmtStore', { pageSize: 100000 });

        // 판매단가관리 가격 전체 Excel 출력
        // this.downloadSheetAction = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     iconCls: 'af-excel',
        //     text: gm.getMC('CMD_Print_price_list', '가격리스트 출력'),
        //     tooltip: '등록된 판매 가격 전체를 Excel로 다운로드 합니다.',
        //     handler: function () {

        //         gm.setCenterLoading(true);

        //         var store = Ext.create('Rfx2.store.company.bioprotech.SalesPriceMgmtStore', { pageSize: 100000 });

        //         store.getProxy().setExtraParam("srch_type", 'excelPrint');
        //         store.getProxy().setExtraParam("srch_fields", 'major');
        //         store.getProxy().setExtraParam("srch_rows", 'all');
        //         store.getProxy().setExtraParam("menuCode", 'PMT1_PRD_EXL');

        //         var items = searchToolbar.items.items;
        //         for (var i = 0; i < items.length; i++) {
        //             var item = items[i];
        //             store.getProxy().setExtraParam(item.name, item.value);
        //         }

        //         var arrField = gm.me().gSearchField;

        //         try {
        //             Ext.each(arrField, function (fieldObj, index) {
        //                 console_log(typeof fieldObj);
        //                 var dataIndex = '';
        //                 if (typeof fieldObj == 'string') { //text search
        //                     dataIndex = fieldObj;
        //                 } else {
        //                     dataIndex = fieldObj['field_id'];
        //                 }

        //                 var srchId = gm.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
        //                 var value = Ext.getCmp(srchId).getValue();

        //                 if (value != null && value != '') {
        //                     if (dataIndex == 'unique_id' || typeof fieldObj == 'object') {
        //                         store.getProxy().setExtraParam(dataIndex, value);
        //                     } else {
        //                         var enValue = Ext.JSON.encode('%' + value + '%');
        //                         console_info(enValue);
        //                         store.getProxy().setExtraParam(dataIndex, enValue);
        //                     }//endofelse
        //                 }//endofif

        //             });
        //         } catch (noError) { }
        //         store.load({
        //             scope: this,
        //             callback: function (records, operation, success) {
        //                 Ext.Ajax.request({
        //                     url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
        //                     params: {
        //                         mc_codes: gUtil.getMcCodes()
        //                     },
        //                     success: function (response, request) {
        //                         gm.setCenterLoading(false);
        //                         //console_logs('response.responseText', response.responseText);
        //                         store.getProxy().setExtraParam("srch_type", null);
        //                         var excelPath = response.responseText;
        //                         if (excelPath != null && excelPath.length > 0) {
        //                             var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
        //                             top.location.href = url;

        //                         } else {
        //                             Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
        //                         }
        //                     }
        //                 });

        //             }
        //         });
        //     }
        // });


        this.downloadSheetByCompanyAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: gm.getMC('CMD_Print_price_list', '가격리스트 출력'),
            tooltip: '선택한 고객사의 판매단가 자료를 출력합니다.',
            disabled : true,
            handler: function () {

                gm.setCenterLoading(true);
                var sel = gm.me().twoGrid.getSelectionModel().getSelected().items[0];
                var combstUid = sel.get('unique_id_long');
                if (combstUid != undefined) {
                    var store = Ext.create('Rfx2.store.company.bioprotech.SalesPriceMgmtStore', { pageSize: 100000 });

                    store.getProxy().setExtraParam("srch_type", 'excelPrint');
                    store.getProxy().setExtraParam("srch_fields", 'major');
                    store.getProxy().setExtraParam("srch_rows", 'all');
                    store.getProxy().setExtraParam("combst_uid", combstUid);
                    store.getProxy().setExtraParam("menuCode", 'PMT1_PRD_EXL');

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
                }  else {
                    Ext.MessageBox.alert('알림','고객사가 선택되지 않았습니다.')
                }
            }
        });
        // 자재 계약
        this.addContractMatAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: CMD_ADD,
            tooltip: '단가 추가',
            disabled: true,
            handler: function () {
                var mStore = Ext.create('Mplm.store.CombstStore', { pageSize: 2000 });
                var cStore = Ext.create('Mplm.store.ComCstStore', { pageSize: 2000 });
                var currencyStore = Ext.create('Mplm.store.CommonCodeExStore', { parentCode: "CURRENCY_GROUP" })
                var selections = gm.me().grid.getSelectionModel().getSelection();

                console_logs('selections', selections);


                if (selections.length > 0) {
                    var rec = selections[0];

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [

                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                value: rec.get('unique_id'),
                                flex: 1,
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractname', '계약명'),
                                xtype: 'textfield',
                                id: gu.id('c_name'),
                                name: 'c_name',
                                flex: 1
                            },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                value: rec.get('item_code'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                value: rec.get('item_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                             }, 
                            //  {
                            //     fieldLabel: gm.me().getColName('specification'),
                            //     xtype: 'textfield',
                            //     id: gu.id('specification'),
                            //     name: 'item_name',
                            //     value: rec.get('specification'),
                            //     flex: 1,
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // },
                            // {
                            //     fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_order_dia_order_customer', '고객사'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'combst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'wa_name',
                            //     store: mStore,
                            //     sortInfo: { field: 'wa_name', direction: 'DESC' },
                            //     valueField: 'unique_id',
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
                            //         }
                            //     }
                            // },
                            // {
                            //     fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_product_add_dia_div', '사업부'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'comcst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'division_name',
                            //     store: cStore,
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     valueField: 'unique_id',
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">{division_code}</div>';
                            //         }
                            //     }
                            // },
                            // {
                            //     fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_order_grid_prd_currency', '통화'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'currency',
                            //     mode: 'local',
                            //     displayField: 'system_code',
                            //     store: currencyStore,
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     valueField: 'system_code',
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{code_name}">{system_code}</div>';
                            //         }
                            //     }
                            // },  
                            {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_product_add_dia_price', '단가'),
                                xtype: 'textfield',
                                id: gu.id('sales_price'),
                                name: 'sales_price',
                                allowBlank: false,
                                align: "right",
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'sales_price') {
                                        context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                                flex: 1
                            }, {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_sales_price_contractstart', '계약시작일'),
                                xtype: 'datefield',
                                id: gu.id('start_date'),
                                name: 'start_date',
                                allowBlank: false,
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                value: new Date(),
                                flex: 1
                            }, {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractend', '계약종료일'),
                                xtype: 'datefield',
                                id: gu.id('end_date'),
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                name: 'end_date',
                                flex: 1
                            }, {
                                fieldLabel: 'Comment',
                                xtype: 'textfield',
                                id: gu.id('buyer_item_code'),
                                name: 'buyer_item_code',
                                flex: 1
                            }

                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: CMD_ADD,
                        width: 500,
                        height: 420,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().addContractMat(val, winPart);
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                } // endofhandler
            }
        });

        // 자재 갱신
        this.copySalesPriceAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-copy',
            text: gm.getMC('CMD_yet', '갱신'),
            tooltip: '단가 갱신',
            disabled: true,
            handler: function () {
                var mStore = Ext.create('Mplm.store.CombstStore', { pageSize: 2000 });
                var cStore = Ext.create('Mplm.store.ComCstStore', { pageSize: 2000 });
                var currencyStore = Ext.create('Mplm.store.CommonCodeExStore', { parentCode: "CURRENCY_GROUP" })
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var salesPriceSelection = gm.me().gridContractCompany.getSelectionModel().getSelection()[0];
                mStore.load();
                cStore.load();
                console_logs('selections', selections);
                console_logs('selections >>>>> ', salesPriceSelection);
                if (selections.length > 0) {
                    var rec = selections[0];

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [
                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                value: rec.get('unique_id'),
                                flex: 1,
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'hiddenfield',
                                id: gu.id('unique_id_long'),
                                name: 'unique_id_long',
                                value: salesPriceSelection.get('unique_id_long')
                            },
                            {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractname', '계약명'),
                                xtype: 'textfield',
                                id: gu.id('c_name'),
                                name: 'c_name',
                                value: salesPriceSelection.get('supplier_name'),
                                flex: 1
                            },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                value: rec.get('item_code'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                value: rec.get('item_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, 
                            // {
                            //     fieldLabel: gm.me().getColName('specification'),
                            //     xtype: 'textfield',
                            //     id: gu.id('specification'),
                            //     name: 'item_name',
                            //     value: rec.get('specification'),
                            //     flex: 1,
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // },
                            // {
                            //     fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객사'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'combst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'wa_name',
                            //     value: salesPriceSelection.get('combst_uid'),
                            //     store: mStore,
                            //     sortInfo: { field: 'unique_id', direction: 'DESC' },
                            //     valueField: 'unique_id',
                            //     allowBlank: false,
                            //     typeAhead: false,
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
                            //         }
                            //     },
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // },
                            // {
                            //     fieldLabel: gm.me().getMC('msg_product_add_dia_div', '사업부'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'comcst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'division_name',
                            //     store: cStore,
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     valueField: 'unique_id',
                            //     value: salesPriceSelection.get('comcst_uid'),
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">{division_code}</div>';
                            //         }
                            //     },
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // },
                            // {
                            //     fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_order_grid_prd_currency', '통화'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'currency',
                            //     mode: 'local',
                            //     displayField: 'system_code',
                            //     store: currencyStore,
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     valueField: 'system_code',
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     value: salesPriceSelection.get('currency'),
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{code_name}">{system_code}</div>';
                            //         }
                            //     }
                            // },
                             {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_product_add_dia_price', '단가'),
                                xtype: 'textfield',
                                id: gu.id('sales_price'),
                                name: 'sales_price',
                                allowBlank: false,
                                align: "right",
                                value: salesPriceSelection.get('sales_price'),
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'sales_price') {
                                        context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                                flex: 1
                            }, {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_sales_price_contractstart', '계약시작일'),
                                xtype: 'datefield',
                                id: gu.id('start_date'),
                                name: 'start_date',
                                format: 'Y-m-d',
                                allowBlank: false,
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                //value: salesPriceSelection.get('start_date') == null ? null : new Date(salesPriceSelection.get('start_date')),
                                value: new Date(),
                                flex: 1
                            }, {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractend', '계약종료일'),
                                xtype: 'datefield',
                                id: gu.id('end_date'),
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                value: salesPriceSelection.get('end_date') == null ? null : new Date(salesPriceSelection.get('end_date')),
                                name: 'end_date',
                                flex: 1
                            }, {
                                fieldLabel: 'Comment',
                                xtype: 'textfield',
                                id: gu.id('buyer_item_code'),
                                name: 'buyer_item_code',
                                value: salesPriceSelection.get('comment'),
                                flex: 1
                            }

                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: gm.getMC('CMD_yet', '갱신'),
                        width: 500,
                        height: 420,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().copyContractMat(val, winPart);
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                } // endofhandler
            }
        });

        // 자재 계약
        this.modifySalesPriceAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: CMD_MODIFY,
            tooltip: '단가 수정',
            disabled: true,
            handler: function () {
                var mStore = Ext.create('Mplm.store.CombstStore', { pageSize: 2000 });
                var cStore = Ext.create('Mplm.store.ComCstStore', { pageSize: 2000 });
                var currencyStore = Ext.create('Mplm.store.CommonCodeExStore', { parentCode: "CURRENCY_GROUP" })
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var salesPriceSelection = gm.me().gridContractCompany.getSelectionModel().getSelection()[0];
                mStore.load();
                cStore.load();
                console_logs('selections', selections);
                console_logs('selections >>>>> ', salesPriceSelection);
                if (selections.length > 0) {
                    var rec = selections[0];

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [
                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                value: rec.get('unique_id'),
                                flex: 1,
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'hiddenfield',
                                id: gu.id('unique_id_long'),
                                name: 'unique_id_long',
                                value: salesPriceSelection.get('unique_id_long')
                            },
                            {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractname', '계약명'),
                                xtype: 'textfield',
                                id: gu.id('c_name'),
                                name: 'c_name',
                                value: salesPriceSelection.get('supplier_name'),
                                flex: 1
                            },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                value: rec.get('item_code'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                value: rec.get('item_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, 
                            // {
                            //     fieldLabel: gm.me().getColName('specification'),
                            //     xtype: 'textfield',
                            //     id: gu.id('specification'),
                            //     name: 'item_name',
                            //     value: rec.get('specification'),
                            //     flex: 1,
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // },
                            // {
                            //     fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_order_dia_order_customer', '고객사'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'combst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'wa_name',
                            //     value: salesPriceSelection.get('combst_uid'),
                            //     store: mStore,
                            //     sortInfo: { field: 'unique_id', direction: 'DESC' },
                            //     valueField: 'unique_id',
                            //     allowBlank: false,
                            //     typeAhead: false,
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
                            //         }
                            //     }
                            // },

                            // {
                            //     fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_product_add_dia_div', '사업부'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'comcst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'division_name',
                            //     store: cStore,
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     valueField: 'unique_id',
                            //     value: salesPriceSelection.get('comcst_uid'),
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">{division_code}</div>';
                            //         }
                            //     }
                            // },
                            // {
                            //     fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_order_grid_prd_currency', '통화'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'currency',
                            //     mode: 'local',
                            //     displayField: 'system_code',
                            //     store: currencyStore,
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     valueField: 'system_code',
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     value: salesPriceSelection.get('currency'),
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{code_name}">{system_code}</div>';
                            //         }
                            //     }
                            // },
                             {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_product_add_dia_price', '단가'),
                                xtype: 'textfield',
                                id: gu.id('sales_price'),
                                name: 'sales_price',
                                allowBlank: false,
                                value: salesPriceSelection.get('sales_price'),                                align: "right",
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'sales_price') {
                                        context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                                flex: 1

                            }, {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_sales_price_contractstart', '계약시작일'),
                                xtype: 'datefield',
                                id: gu.id('start_date'),
                                name: 'start_date',
                                format: 'Y-m-d',
                                allowBlank: false,
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                value: salesPriceSelection.get('start_date') == null ? null : new Date(salesPriceSelection.get('start_date')),
                                flex: 1
                            }, {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractend', '계약종료일'),
                                xtype: 'datefield',
                                id: gu.id('end_date'),
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                value: salesPriceSelection.get('end_date') == null ? null : new Date(salesPriceSelection.get('end_date')),
                                name: 'end_date',
                                flex: 1
                            }, {
                                fieldLabel: 'Comment',
                                xtype: 'textfield',
                                id: gu.id('buyer_item_code'),
                                name: 'buyer_item_code',
                                value: salesPriceSelection.get('comment'),
                                flex: 1
                            }

                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: CMD_MODIFY,
                        width: 500,
                        height: 420,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().modifyContractMat(val, winPart);
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                } // endofhandler
            }
        });

        // 자재 계약
        this.removeContractMatAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: CMD_DELETE,
            tooltip: '계약 삭제',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '계약 삭제',
                    msg: '계약사를 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {

                            var grid = gu.getCmp('gridContractCompany');
                            var record = grid.getSelectionModel().getSelected().items[0];

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/material.do?method=removeContractMat',
                                params: {
                                    srcmapUid: record.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gu.getCmp('gridContractCompany').getStore().load();
                                },
                                failure: extjsUtil.failureMessage
                            });//endof ajax request
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.addContractMatByCompanyAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus',
            text: CMD_ADD,
            tooltip: '단가 추가',
            disabled: true,
            handler: function () {
                var mStore = Ext.create('Mplm.store.CombstStore', { pageSize: 2000 });
                var cStore = Ext.create('Mplm.store.ComCstStore', { pageSize: 2000 });
                var currencyStore = Ext.create('Mplm.store.CommonCodeExStore', { parentCode: "CURRENCY_GROUP" })
                var selections = gm.me().twoGrid.getSelectionModel().getSelection();

                console_logs('selections', selections);


                if (selections.length > 0) {
                    var rec = selections[0];

                    this.itemSearchAction = Ext.create('Ext.Action', {
                        iconCls: 'af-search',
                        text: CMD_SEARCH/*'검색'*/,
                        tooltip: CMD_SEARCH/*'검색'*/,
                        disabled: false,
                        handler: function () {
                            var extraParams = gm.me().searchStore.getProxy().getExtraParams();
                            // if (Object.keys(extraParams).length == 0) {
                            //     Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                            // } else {
                                gm.me().searchStore.load();
                            // }
                        }
                    });

                    this.gridViewTable = Ext.create('Ext.grid.Panel', {
                        store: gm.me().searchStore,
                        cls: 'rfx-panel',
                        multiSelect: false,
                        autoScroll: true,
                        border: false,
                        height: 320,
                        padding: '0 0 5 0',
                        layout: 'fit',
                        forceFit: false,
                        listeners: {
                            select: function (selModel, record, index, options) {
                                gu.getCmp('unique_id').setValue(record.get('unique_id_long'));
                                gu.getCmp('item_code').setValue(record.get('item_code'));
                                gu.getCmp('item_name').setValue(record.get('item_name'));
                                gu.getCmp('specification').setValue(record.get('specification'));
                            }
                        },
                        dockedItems: [
                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                style: 'background-color: #EFEFEF;',
                                items: [
                                    // {
                                    //     field_id: 'search_standard_flag_part',
                                    //     width: 190,
                                    //     fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                    //     id: gu.id('search_standard_flag_part'),
                                    //     name: 'search_standard_flag_part',
                                    //     xtype: 'triggerfield',
                                    //     margin: '3 3 3 3',
                                    //     hidden: true,
                                    //     value: 'A',
                                    //     emptyText: gm.me().getMC('msg_product_add_search_field0', '완제품'),
                                    //     trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    //     onTrigger1Click: function () {
                                    //         this.setValue('');
                                    //     },
                                    //     listeners: {
                                    //         change: function (fieldObj, e) {
                                    //             if (e.trim().length > 0) {
                                    //                 gm.me().searchStore.getProxy().setExtraParam('standard_flag', '%' + e + '%');
                                    //             } else {
                                    //                 delete gm.me().searchStore.proxy.extraParams.item_name;
                                    //             }
                                    //         },
                                    //         render: function (c) {
                                    //             Ext.create('Ext.tip.ToolTip', {
                                    //                 target: c.getEl(),
                                    //                 html: c.emptyText
                                    //             });
                                    //         }
                                    //     }
                                    // },
                                    {
                                        field_id: 'search_item_code',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_item_code_part'),
                                        name: 'search_item_code',
                                        margin: '3 3 3 3',
                                        xtype: 'triggerfield',
                                        emptyText: gm.me().getMC('msg_product_add_search_field1', '품번'),
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');

                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('item_code', '%' + e + '%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.item_code;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        field_id: 'search_item_name',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_item_name_part'),
                                        name: 'search_item_name',
                                        xtype: 'triggerfield',
                                        margin: '3 3 3 3',
                                        emptyText: gm.me().getMC('msg_product_add_search_field2', '품명'),
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('item_name', '%' + e + '%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.item_name;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        field_id: 'search_specification',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_specification_part'),
                                        name: 'search_specification',
                                        xtype: 'triggerfield',
                                        margin: '3 3 3 3',
                                        emptyText: gm.me().getMC('msg_product_add_search_field3', '규격'),
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('specification', '%' + e + '%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.specification;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    '->',
                                    this.itemSearchAction
                                ]
                            }
                        ],
                        columns: [
                            {
                                text: gm.me().getMC('msg_product_add_search_field1', '품번'),
                                width: 120,
                                dataIndex: 'item_code'
                            },
                            {
                                text: gm.me().getMC('msg_product_add_search_field2', '품명'),
                                width: 270,
                                dataIndex: 'item_name',
                                renderer: function (value) {
                                    return value.replace(/</gi, "&lt;");
                                }
                            },
                            {
                                text: gm.me().getMC('msg_product_add_search_field3', '규격'),
                                width: 270,
                                dataIndex: 'specification'
                            }
                        ]
                    });

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 690,
                        height: 740,
                        bodyPadding: 10,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 100
                        },
                        items: [
                            this.gridViewTable,
                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'hiddenfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                flex: 1,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractname', '계약명'),
                                xtype: 'textfield',
                                id: gu.id('c_name'),
                                name: 'c_name'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'specification',
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            // {
                            //     fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객사'),
                            //     xtype: 'textfield',
                            //     id: gu.id('wa_name_kr'),
                            //     name: 'wa_name',
                            //     value: rec.get('wa_name'),
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // },
                            {
                                fieldLabel: '고객사',
                                xtype: 'hiddenfield',
                                id: gu.id('combst_uid'),
                                name: 'combst_uid',
                                value: rec.get('unique_id_long')
                            },
                            // {
                            //     fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_product_add_dia_div', '사업부'),
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'comcst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'division_name',
                            //     store: cStore,
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     valueField: 'unique_id',
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">{division_code}</div>';
                            //         }
                            //     }
                            // },
                            // {
                            //     fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_order_grid_prd_currency', '통화'),
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'currency',
                            //     mode: 'local',
                            //     displayField: 'system_code',
                            //     store: currencyStore,
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     valueField: 'system_code',
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{code_name}">{system_code}</div>';
                            //         }
                            //     }
                            // }, 
                            {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_product_add_dia_price', '단가'),
                                xtype: 'textfield',
                                id: gu.id('sales_price'),
                                allowBlank: false,
                                name: 'sales_price',
                                align: "right",
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'sales_price') {
                                        context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                }

                            }, {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_sales_price_contractstart', '계약시작일'),
                                xtype: 'datefield',
                                id: gu.id('start_date'),
                                name: 'start_date',
                                format: 'Y-m-d',
                                allowBlank: false,
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                value: new Date()
                            }, {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractend', '계약종료일'),
                                xtype: 'datefield',
                                id: gu.id('end_date'),
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                name: 'end_date'
                            }, {
                                fieldLabel: 'Comment',
                                xtype: 'textfield',
                                id: gu.id('buyer_item_code'),
                                name: 'buyer_item_code'
                            }
                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '추가',
                        width: 690,
                        height: 740,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().addContractMatByCompany(val, winPart, 'company');
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                } // endofhandler
            }
        });

        // 자재 갱신
        this.copySalesPriceByCompanyAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-copy',
            text: gm.getMC('CMD_yet', '갱신'),
            tooltip: '단가 갱신',
            disabled: true,
            handler: function () {
                var mStore = Ext.create('Mplm.store.CombstStore', { pageSize: 2000 });
                var cStore = Ext.create('Mplm.store.ComCstStore', { pageSize: 2000 });
                var currencyStore = Ext.create('Mplm.store.CommonCodeExStore', { parentCode: "CURRENCY_GROUP" })
                var selections = gm.me().twoGrid.getSelectionModel().getSelection();
                var salesPriceSelection = gm.me().gridContractMaterial.getSelectionModel().getSelection()[0];
                mStore.load();
                cStore.load();
                console_logs('selections', selections);
                console_logs('selections >>>>> ', salesPriceSelection);
                if (selections.length > 0) {
                    var rec = selections[0];

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [
                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                value: salesPriceSelection.get('srcahd_uid'),
                                flex: 1,
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'hiddenfield',
                                id: gu.id('unique_id_long'),
                                name: 'unique_id_long',
                                value: salesPriceSelection.get('unique_id_long')
                            },
                            {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractname', '계약명'),
                                xtype: 'textfield',
                                id: gu.id('c_name'),
                                name: 'c_name',
                                value: salesPriceSelection.get('supplier_name'),
                                flex: 1
                            },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                value: salesPriceSelection.get('item_code'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                value: salesPriceSelection.get('item_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'item_name',
                                value: salesPriceSelection.get('specification'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            // {
                            //     fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객사'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'combst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'wa_name',
                            //     value: salesPriceSelection.get('combst_uid'),
                            //     store: mStore,
                            //     sortInfo: { field: 'unique_id', direction: 'DESC' },
                            //     valueField: 'unique_id',
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
                            //         }
                            //     },
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // },

                            // {
                            //     fieldLabel: gm.me().getMC('msg_product_add_dia_div', '사업부'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'comcst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'division_name',
                            //     store: cStore,
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     valueField: 'unique_id',
                            //     value: salesPriceSelection.get('comcst_uid'),
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">{division_code}</div>';
                            //         }
                            //     },
                            //     readOnly: true,
                            //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            // },
                            // {
                            //     fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_order_grid_prd_currency', '통화'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'currency',
                            //     mode: 'local',
                            //     displayField: 'system_code',
                            //     store: currencyStore,
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     valueField: 'system_code',
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     value: salesPriceSelection.get('currency'),
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{code_name}">{system_code}</div>';
                            //         }
                            //     }
                            // },
                             {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_product_add_dia_price', '단가'),
                                xtype: 'textfield',
                                id: gu.id('sales_price'),
                                name: 'sales_price',
                                allowBlank: false,
                                value: salesPriceSelection.get('sales_price'),                
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'sales_price') {
                                        context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                                flex: 1
                            }, {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_sales_price_contractstart', '계약시작일'),
                                xtype: 'datefield',
                                id: gu.id('start_date'),
                                name: 'start_date',
                                format: 'Y-m-d',
                                allowBlank: false,
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                value: new Date(),
                                flex: 1
                            }, {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractend', '계약종료일'),
                                xtype: 'datefield',
                                id: gu.id('end_date'),
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                value: salesPriceSelection.get('end_date') == null ? null : new Date(salesPriceSelection.get('end_date')),
                                name: 'end_date',
                                flex: 1
                            }, {
                                fieldLabel: 'Comment',
                                xtype: 'textfield',
                                id: gu.id('buyer_item_code'),
                                value: salesPriceSelection.get('comment'),
                                name: 'buyer_item_code',
                                flex: 1
                            }

                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: gm.getMC('CMD_yet', '갱신'),
                        width: 500,
                        height: 420,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().copyContractMatByCompany(val, winPart);
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                } // endofhandler
            }
        });

        // 자재 계약
        this.modifySalesPriceByCompanyAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: CMD_MODIFY,
            tooltip: '단가 수정',
            disabled: true,
            handler: function () {
                var mStore = Ext.create('Mplm.store.CombstStore', { pageSize: 2000 });
                var cStore = Ext.create('Mplm.store.ComCstStore', { pageSize: 2000 });
                var currencyStore = Ext.create('Mplm.store.CommonCodeExStore', { parentCode: "CURRENCY_GROUP" })
                var selections = gm.me().twoGrid.getSelectionModel().getSelection();
                var salesPriceSelection = gm.me().gridContractMaterial.getSelectionModel().getSelection()[0];

                mStore.load();
                cStore.load();
                console_logs('selections', selections);
                console_logs('selections >>>>> ', salesPriceSelection);
                if (selections.length > 0) {
                    var rec = selections[0];

                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox',
                            align: 'stretch' // Child items are stretched to full width
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        items: [
                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                value: salesPriceSelection.get('srcahd_uid'),
                                flex: 1,
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'hiddenfield',
                                id: gu.id('unique_id_long'),
                                name: 'unique_id_long',
                                value: salesPriceSelection.get('unique_id_long')
                            },
                            {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractname', '계약명'),
                                xtype: 'textfield',
                                id: gu.id('c_name'),
                                name: 'c_name',
                                value: salesPriceSelection.get('supplier_name'),
                                flex: 1
                            },
                            {
                                fieldLabel: gm.me().getColName('item_code'),
                                xtype: 'textfield',
                                id: gu.id('item_code'),
                                name: 'item_code',
                                value: salesPriceSelection.get('item_code'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                fieldLabel: gm.me().getColName('item_name'),
                                xtype: 'textfield',
                                id: gu.id('item_name'),
                                name: 'item_name',
                                value: salesPriceSelection.get('item_name'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: gm.me().getColName('specification'),
                                xtype: 'textfield',
                                id: gu.id('specification'),
                                name: 'item_name',
                                value: salesPriceSelection.get('specification'),
                                flex: 1,
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            // {
                            //     fieldLabel: gm.me().getMC('msg_order_dia_order_customer', '고객사'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'combst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'wa_name',
                            //     value: salesPriceSelection.get('combst_uid'),
                            //     store: mStore,
                            //     sortInfo: { field: 'unique_id', direction: 'DESC' },
                            //     valueField: 'unique_id',
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">[{wa_code}] {wa_name}</div>';
                            //         }
                            //     }
                            // },

                            // {
                            //     fieldLabel: gm.me().getMC('msg_product_add_dia_div', '사업부'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'comcst_uid',
                            //     //id: 'mola',
                            //     mode: 'local',
                            //     displayField: 'division_name',
                            //     store: cStore,
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     valueField: 'unique_id',
                            //     value: salesPriceSelection.get('comcst_uid'),
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{unique_id}">{division_code}</div>';
                            //         }
                            //     }
                            // },
                            // {
                            //     fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_order_grid_prd_currency', '통화'),
                            //     labelWidth: 80,
                            //     xtype: 'combo',
                            //     anchor: '100%',
                            //     name: 'currency',
                            //     mode: 'local',
                            //     displayField: 'system_code',
                            //     store: currencyStore,
                            //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                            //     valueField: 'system_code',
                            //     typeAhead: false,
                            //     allowBlank: false,
                            //     value: salesPriceSelection.get('currency'),
                            //     minChars: 1,
                            //     flex: 1,
                            //     listConfig: {
                            //         loadingText: '검색중...',
                            //         emptyText: '일치하는 항목 없음.',
                            //         getInnerTpl: function () {
                            //             return '<div data-qtip="{code_name}">{system_code}</div>';
                            //         }
                            //     }
                            // },
                            /*{
                             fieldLabel: '통화',
                             xtype: 'textfield',
                             id: gu.id('currency'),
                             name: 'currency',
                             value: salesPriceSelection.get('currency'),
                             flex: 1
                             },*/ {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_product_add_dia_price', '단가'),
                                xtype: 'textfield',
                                id: gu.id('sales_price'),
                                name: 'sales_price',
                                allowBlank: false,
                                value: salesPriceSelection.get('sales_price'),
                                renderer: function (value, context, tmeta) {
                                    if (context.field == 'sales_price') {
                                        context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                                    }
                                    return Ext.util.Format.number(value, '0,00/i');
                                },
                                flex: 1
                            }, {
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + gm.me().getMC('msg_sales_price_contractstart', '계약시작일'),
                                xtype: 'datefield',
                                id: gu.id('start_date'),
                                name: 'start_date',
                                format: 'Y-m-d',
                                allowBlank: false,
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                value: salesPriceSelection.get('start_date') == null ? null : new Date(salesPriceSelection.get('start_date')),
                                flex: 1
                            }, {
                                fieldLabel: gm.me().getMC('msg_sales_price_contractend', '계약종료일'),
                                xtype: 'datefield',
                                id: gu.id('end_date'),
                                format: 'Y-m-d',
                                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                value: salesPriceSelection.get('end_date') == null ? null : new Date(salesPriceSelection.get('end_date')),
                                name: 'end_date',
                                flex: 1
                            }, {
                                fieldLabel: 'Comment',
                                xtype: 'textfield',
                                id: gu.id('buyer_item_code'),
                                value: salesPriceSelection.get('comment'),
                                name: 'buyer_item_code',
                                flex: 1
                            }

                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: '수정',
                        width: 500,
                        height: 420,
                        items: form,
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    console_logs('form val', val);
                                    gm.me().modifyContractMatByCompany(val, winPart);
                                } else {
                                    Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                                }
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                    });
                    winPart.show(/* this, function(){} */);
                } // endofhandler
            }
        });

        // 자재 계약
        this.removeContractMatByCompanyAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: CMD_DELETE,
            tooltip: '계약 삭제',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '계약 삭제',
                    msg: '계약사를 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (btn) {
                        if (btn == 'yes') {

                            var grid = gu.getCmp('gridContractMaterial');
                            var record = grid.getSelectionModel().getSelected().items[0];

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/material.do?method=removeContractMat',
                                params: {
                                    srcmapUid: record.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gu.getCmp('gridContractMaterial').getStore().load();
                                },
                                failure: extjsUtil.failureMessage
                            });//endof ajax request
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractCompany'),
            store: this.salesPriceListStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            frame: true,
            //bbar: getPageToolbar(this.poCartListStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            //selModel: Ext.create("Ext.selection.CheckboxModel", {}),
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
                            html: gm.getMC('CMD_Sales_unit_price_list', '제품을 선택하시기 바랍니다.'),
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addContractMatAction,
                        this.copySalesPriceAction,
                        this.modifySalesPriceAction,
                        this.removeContractMatAction
                    ]
                }
            ],
            columns: [
                //{text: '순위', width: 50,  style: 'text-align:center', dataIndex: 'sort_order', sortable: false},
                // { text: this.getMC('msg_order_dia_order_customer', '고객사'), width: 150, style: 'text-align:center', dataIndex: 'buyer_name', sortable: true },
                // { text: this.getMC('msg_product_add_dia_div', '사업부'), width: 150, style: 'text-align:center', dataIndex: 'division_name', sortable: true },
                {
                    text: this.getMC('msg_product_add_dia_price', '판매단가'), 
                    width: 100, 
                    style: 'text-align:center', 
                    dataIndex: 'sales_price', 
                    sortable: false,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sales_price') {
                            context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                // {
                //     text: this.getMC('msg_order_grid_prd_currency', '통화'), width: 100, style: 'text-align:center', dataIndex: 'currency', sortable: false,
                //     // editor: 'textfield'
                // },
                { text: this.getMC('msg_sales_price_contractname', '계약명'), width: 150, style: 'text-align:center', dataIndex: 'supplier_name', sortable: false },
                { text: 'Comment', width: 150, style: 'text-align:center', dataIndex: 'comment', sortable: false },
                {
                    text: this.getMC('msg_sales_price_contractstart', '계약시작일'), width: 100, style: 'text-align:center', dataIndex: 'start_date', sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: this.getMC('msg_sales_price_contractend', '계약종료일'), width: 100, style: 'text-align:center', dataIndex: 'end_date', sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                }
            ],
            title: this.getMC('CMD_Sales_unit_price_list', '판매 단가 리스트'),
            name: 'po',
            autoScroll: true,
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
                },
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'srcmap';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, { type: '' });
                    gm.me().store.load();
                }
            }
        });

        this.gridContractMaterial = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractMaterial'),
            store: this.salesPriceByCompanyListStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            frame: true,
            //bbar: getPageToolbar(this.poCartListStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            //selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('selectedCompany'),
                            html: this.getMC('msg_sales_price_description2', '고객사를 선택하시기 바랍니다.'),
                            width: 700,
                            style: 'color:white;font-weight:normal;text-align:left;padding-bottom: 7px; padding-left: 5px; padding-right: 5px; padding-top: 7px;'
                        }
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addContractMatByCompanyAction,
                        this.copySalesPriceByCompanyAction,
                        this.modifySalesPriceByCompanyAction,
                        this.removeContractMatByCompanyAction,
                        this.downloadSheetByCompanyAction
                    ]
                }
            ],
            columns: [
                { text: this.getMC('msg_product_add_search_field1', '품번'), width: 100, style: 'text-align:center', dataIndex: 'item_code', sortable: true },
                { text: this.getMC('msg_product_add_search_field2', '품명'), width: 150, style: 'text-align:center', dataIndex: 'item_name', sortable: true },
                //{ text: this.getMC('msg_product_add_search_field3', '규격'), width: 150, style: 'text-align:center', dataIndex: 'specification', sortable: false },
                //{ text: this.getMC('msg_order_grid_prd_desc', '기준모델'), width: 150, style: 'text-align:center', dataIndex: 'description', sortable: true },
                // { text: this.getMC('msg_product_add_dia_div', '사업부'), width: 100, style: 'text-align:center', dataIndex: 'division_name', sortable: true },
                {
                    text: this.getMC('msg_product_add_dia_price', '판매단가'), 
                    width: 100, style: 'text-align:center', 
                    dataIndex: 'sales_price', 
                    sortable: false,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sales_price') {
                            context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                    // editor: 'textfield'
                },
                {
                    // text: this.getMC('msg_order_grid_prd_currency', '통화'), width: 100, style: 'text-align:center', dataIndex: 'currency', sortable: false,
                    //editor: 'textfield'
                },
                { text: this.getMC('msg_sales_price_contractname', '계약명'), width: 150, style: 'text-align:center', dataIndex: 'supplier_name', sortable: false },
                //{ text: 'Comment', width: 150, style: 'text-align:center', dataIndex: 'comment', sortable: false },
                {
                    text: this.getMC('msg_sales_price_contractstart', '계약시작일'), width: 100, style: 'text-align:center', dataIndex: 'start_date', sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: this.getMC('msg_sales_price_contractend', '계약종료일'), width: 100, style: 'text-align:center', dataIndex: 'end_date', sortable: false,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                }
            ],
            title: this.getMC('CMD_Sales_unit_price_list', '판매 단가 리스트'),
            name: 'po',
            autoScroll: true,
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
                },
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'srcmap';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, { type: '' });
                    gm.me().store.load();
                }
            }
        });

        Ext.each(this.gridContractCompany.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'sales_price':
                    // columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    // columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'sales_price':
                    columnObj["renderer"] = function (value, meta) {
                        // if (meta != null) {
                        // meta.css = 'custom-column';
                        // }
                        return value;
                    };
                    break;
                default:
                    break;
            }
        });

        Ext.each(this.gridContractMaterial.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                // case 'sales_price':
                //     columnObj["style"] = 'background-color:#0271BC;text-align:center';
                //     columnObj["css"] = 'edit-cell';
                //     break;
            }

            switch (dataIndex) {
                case 'sales_price':
                    columnObj["renderer"] = function (value, meta) {
                        //     if (meta != null) {
                        //         meta.css = 'custom-column';
                        //     }
                        return value;
                    };
                    break;
                default:
                    break;
            }
        });

        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {
                    gm.me().copySalesPriceAction.enable();
                    gm.me().modifySalesPriceAction.enable();
                    gm.me().removeContractMatAction.enable();
                } else {
                    gm.me().copySalesPriceAction.disable();
                    gm.me().modifySalesPriceAction.disable();
                    gm.me().removeContractMatAction.disable();
                }
            }
        });

        this.gridContractMaterial.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {
                    gm.me().copySalesPriceByCompanyAction.enable();
                    gm.me().modifySalesPriceByCompanyAction.enable();
                    gm.me().removeContractMatByCompanyAction.enable();
                } else {
                    gm.me().copySalesPriceByCompanyAction.disable();
                    gm.me().modifySalesPriceByCompanyAction.disable();
                    gm.me().removeContractMatByCompanyAction.disable();
                }
            }
        });

        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        this.grid.flex = 1;

        this.newButtonToolBar = buttonToolbar;
        this.newSearchToolBar = searchToolbar;

        this.combstStore = Ext.create('Mplm.store.CombstStore', { pageSize: 100 });
        this.combstStore.sorters.removeAll();

        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var wa_name = '';

                    if (Ext.getCmp('wa_name').getValue().length > 0) {
                        reserved_varcharh = Ext.getCmp('wa_name').getValue();
                    }
                } catch (e) {

                }
                gm.me().combstStore.getProxy().setExtraParam('wa_name', '%' + wa_name + '%');
                gm.me().combstStore.load();
            }
        });

        this.twoGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('twoGrid'),
            selModel: 'checkboxmodel',
            store: this.combstStore,
            columns: [
                {
                    text: this.getMC('msg_order_dia_order_customer', '고객사'),
                    width: 200,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'wa_name'
                },
                {
                    text: this.getMC('msg_sales_price_oem', 'OEM명'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'company_name'
                },
                {
                    text: 'Channel',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'company_info',
                    renderer: gu.renderCodeName({
                        codeName: 'SCS2_CHANNEL',
                        storeId: 'sales-delivery-' + this.link + '-' + 'codeRender'
                            + 'SCS2_CHANNEL'
                    })
                },
                {
                    text: 'Customer Type',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'del_area_info',
                    renderer: gu.renderCodeName({
                        codeName: 'SCS2_CUSTOMER_TYPE',
                        storeId: 'sales-delivery-' + this.link + '-' + 'codeRender'
                            + 'SCS2_CUSTOMER_TYPE'
                    })
                },
                {
                    text: this.getMC('msg_sales_price_regional', '지역'),
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'major_del_area',
                    renderer: gu.renderCodeName({
                        codeName: 'SCS2_AREA_CODE',
                        storeId: 'sales-delivery-' + this.link + '-' + 'codeRender'
                            + 'SCS2_AREA_CODE'
                    })
                },
                {
                    text: this.getMC('msg_sales_price_nation', '국가'),
                    width: 120,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'nation_code'
                }
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.purListSrch,
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    layout: 'column',
                    defaults: {
                        style: 'margin-top: 1px; margin-bottom: 1px;'
                    },
                    items: [{
                        xtype: 'triggerfield',
                        emptyText: this.getMC('msg_order_dia_order_customer', '고객사'),
                        id: gu.id('wa_name'),
                        width: 130,
                        fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                        name: 'query_sup',
                        listeners: {
                            specialkey: function (field, e) {
                                if (e.getKey() == Ext.EventObject.ENTER) {
                                    gm.me().combstStore.getProxy().setExtraParam('wa_name', '%' + gu.getCmp('wa_name').getValue() + '%');
                                    gm.me().combstStore.load(function () { });
                                }
                            }
                        },
                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        'onTrigger1Click': function () {
                            gu.getCmp('wa_name').setValue('');
                            this.combstStore.getProxy().setExtraParam('wa_name', gu.getCmp('wa_name').getValue());
                            this.combstStore.load(function () { });
                        }
                    }]
                }
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.combstStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {
                        // console_logs('여기++++++++++++++++++++++++++++++++++++++++ : ', record);
                    }
                }

            }),
            viewConfig: {
                markDirty: false,
                stripeRows: true,
                enableTextSelection: false,
                preserveScrollOnReload: true,
                getRowClass: function (record, index) {
                    var recv_flag = record.get('recv_flag');
                    switch (recv_flag) {
                        case 'EM':
                            return 'yellow-row';
                            break;
                        case 'SE':
                            return 'red-row';
                            break;
                    }
                }
            },
            listeners: {
                afterrender: function (grid) {
                    var elments = Ext.select(".x-column-header", true);
                    elments.each(function (el) {
                    }, this);
                },
                cellclick: function (iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent) {
                    this.selColIdx = iColIdx;
                    console_logs('iColIdx', this.selColIdx);
                },
                edit: function (editor, e, eOpts) {
                    console_logs('record', e.record);
                    var idx = this.selColIdx;
                    var pos = Math.trunc(idx / 2);
                    var type = idx % 2 == 1 ? 'time' : 'human';
                    var name = type + (pos + 1);
                    var val = e.record.get(name);
                    console.log(name, val);
                }
            }
        });

        this.combstStore.load();

        var leftContainer = new Ext.container.Container({
            title: gm.getMC('CMD_Item_Standard', '품목기준'),
            region: 'center',
            layout: {
                type: 'border'
            },
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 0.85,
                    items: [this.grid]
                },
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [this.gridContractCompany]
                }
            ]
        });


        this.twoGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                gm.me().removeContractMatAction.disable();
                if (selections.length) {
                    var rec = selections[0];

                    var waName = rec.get('wa_name');

                    gu.getCmp('selectedCompany').setHtml(waName);
                    gm.me().salesPriceByCompanyListStore.getProxy().setExtraParam('combst_uid', rec.get('unique_id_long'));
                    gm.me().salesPriceByCompanyListStore.getProxy().setExtraParam('fix_type', 'SE');    // 판매용 단가 리스트 구분
                    gm.me().salesPriceByCompanyListStore.load();
                    gm.me().addContractMatByCompanyAction.enable();
                    gm.me().downloadSheetByCompanyAction.enable();
                } else {
                    gm.me().addContractMatByCompanyAction.disable();
                }
            }
        });

        var rightContainer = new Ext.container.Container({
            title: gm.getMC('CMD_Customer_Standard', '고객사 기준'),
            region: 'center',
            layout: {
                type: 'border'
            },
            defaults: {
                collapsible: true,
                split: true
            },
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 0.6,
                    items: [this.twoGrid]
                },
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    flex: 1,
                    items: [this.gridContractMaterial]
                }
            ]
        });

        var mainTab = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [leftContainer, rightContainer]
        });

        Ext.apply(this, {
            layout: 'border',
            items: mainTab
        });

        //버튼 추가.

        this.callParent(arguments);

        buttonToolbar.insert('->', this.downloadSheetAction);
        buttonToolbar.insert(5, this.downloadSheetAction);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            this.removeContractMatAction.disable();
            if (selections.length) {
                var rec = selections[0];

                var itemCode = rec.get('item_code');
                var itemName = rec.get('item_name');
                var specification = rec.get('specification');

                if (specification.length === 0) {
                    specification = '(규격 정보 없음)';
                }

                gu.getCmp('selectedMtrl').setHtml('[' + itemCode + '] ' + itemName + ' / ' + specification);
                this.salesPriceListStore.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                this.salesPriceListStore.getProxy().setExtraParam('fix_type', 'SE');    // 판매용 단가 리스트 구분
                this.salesPriceListStore.load();
                this.addContractMatAction.enable();
            } else {
                this.addContractMatAction.disable();
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('existSalesPrice', 'true');
        this.store.load(function (records) {

        });
    },

    addContractMat: function (val, win) {
        Ext.MessageBox.show({
            title: '추가',
            msg: '제품가격을 설정 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/material.do?method=addSalesPrice',
                        params: {
                            currency: val['currency'],
                            sales_price: val['sales_price'],
                            srcahd_uid: val['unique_id'],
                            combst_uid: val['combst_uid'],
                            comcst_uid: val['comcst_uid'],
                            start_date: val['start_date'],
                            end_date: val['end_date'],
                            c_name: val['c_name'],
                            buyer_item_code: val['buyer_item_code']
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gu.getCmp('gridContractCompany').getStore().load();
                            //gm.me().store.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    copyContractMat: function (val, win) {
        Ext.MessageBox.show({
            title: gm.getMC('CMD_yet', '갱신'),
            msg: '제품가격을 갱신 하시겠습니까?</br>기존 가격은 전일부로 종료됩니다.',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {

                    var endDate = new Date(val['start_date']);
                    endDate.setDate(endDate.getDate() - 1);
                    var endDateFormat = Ext.Date.format(endDate, "Y-m-d");

                    gm.editAjax('srcmap', 'end_date', endDateFormat, 'unique_id', val['unique_id_long'], { type: '' });

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/material.do?method=addSalesPrice',
                        params: {
                            currency: val['currency'],
                            sales_price: val['sales_price'],
                            srcahd_uid: val['unique_id'],
                            combst_uid: val['combst_uid'],
                            comcst_uid: val['comcst_uid'],
                            start_date: val['start_date'],
                            end_date: val['end_date'],
                            c_name: val['c_name'],
                            buyer_item_code: val['buyer_item_code']
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gu.getCmp('gridContractCompany').getStore().load();
                            //gm.me().store.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    copyContractMatByCompany: function (val, win) {
        Ext.MessageBox.show({
            title: gm.getMC('CMD_yet', '갱신'),
            msg: '제품가격을 갱신 하시겠습니까?</br>기존 가격은 전일부로 종료됩니다.',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {

                    var endDate = new Date(val['start_date']);
                    endDate.setDate(endDate.getDate() - 1);
                    var endDateFormat = Ext.Date.format(endDate, "Y-m-d");

                    gm.editAjax('srcmap', 'end_date', endDateFormat, 'unique_id', val['unique_id_long'], { type: '' });

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/material.do?method=addSalesPrice',
                        params: {
                            currency: val['currency'],
                            sales_price: val['sales_price'],
                            srcahd_uid: val['unique_id'],
                            combst_uid: val['combst_uid'],
                            comcst_uid: val['comcst_uid'],
                            start_date: val['start_date'],
                            end_date: val['end_date'],
                            c_name: val['c_name'],
                            buyer_item_code: val['buyer_item_code']
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gu.getCmp('gridContractMaterial').getStore().load();
                            //gm.me().store.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    addContractMatByCompany: function (val, win) {
        Ext.MessageBox.show({
            title: '추가',
            msg: '제품가격을 설정 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/material.do?method=addSalesPrice',
                        params: {
                            currency: val['currency'],
                            sales_price: val['sales_price'],
                            srcahd_uid: val['unique_id'],
                            combst_uid: val['combst_uid'],
                            comcst_uid: val['comcst_uid'],
                            start_date: val['start_date'],
                            end_date: val['end_date'],
                            c_name: val['c_name'],
                            buyer_item_code: val['buyer_item_code']
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gu.getCmp('gridContractMaterial').getStore().load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    modifyContractMat: function (val, win) {
        Ext.MessageBox.show({
            title: '수정',
            msg: '제품가격을 수정 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/material.do?method=modifySalesPrice',
                        params: {
                            unique_id_long: val['unique_id_long'],
                            currency: val['currency'],
                            sales_price: val['sales_price'],
                            srcahd_uid: val['unique_id'],
                            combst_name: val['combst_name'],
                            combst_uid: val['combst_uid'],
                            comcst_uid: val['comcst_uid'],
                            start_date: val['start_date'],
                            end_date: val['end_date'],
                            c_name: val['c_name'],
                            buyer_item_code: val['buyer_item_code']
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gu.getCmp('gridContractCompany').getStore().load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    modifyContractMatByCompany: function (val, win) {
        Ext.MessageBox.show({
            title: '수정',
            msg: '제품가격을 수정 하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/material.do?method=modifySalesPrice',
                        params: {
                            unique_id_long: val['unique_id_long'],
                            currency: val['currency'],
                            sales_price: val['sales_price'],
                            srcahd_uid: val['unique_id'],
                            combst_name: val['combst_name'],
                            combst_uid: val['combst_uid'],
                            comcst_uid: val['comcst_uid'],
                            start_date: val['start_date'],
                            end_date: val['end_date'],
                            c_name: val['c_name'],
                            buyer_item_code: val['buyer_item_code']
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gu.getCmp('gridContractMaterial').getStore().load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    editRedord: function (field, rec) {

        switch (field) {
            case 'sort_order':
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/material.do?method=updateSortOrder',
                    params: {
                        srcmap_uid: rec.get('unique_id'),
                        srcahd_uid: rec.get('srcahd_uid'),
                        sort_order: rec.get('sort_order')
                    },
                    success: function (result, request) {
                        var resultText = result.responseText;
                        console_log('result:' + resultText);
                        gm.me().getStore().load(function () {
                        });
                        //alert('finished..');
                    },
                    failure: extjsUtil.failureMessage
                });//endof ajax request
                break;
            default:
                gm.editRedord(field, rec);
        }
    },

    searchStore: Ext.create('Rfx2.store.company.tosimbio.MaterialStore', {})
});



