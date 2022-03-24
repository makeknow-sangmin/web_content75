//자재 관리
Ext.define('Rfx2.view.company.scon.stockMgmt.StocktakingView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'stocktaking-view',

    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        // 창고 목록
        /*
        this.addSearchField({
            type: 'combo'
            , field_id: 'whouse_uid'
            , emptyText: '창고'
            , store: "WhouseStore"
            , displayField: 'wh_name'
            , valueField: 'unique_id'
            , value: 'unique_id'
            , innerTpl: '<div data-qtip="{unique_id}">{wh_name}</div>'
        });
        */

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE','EXCEL']
        });

        // //모델을 통한 스토어 생성
        this.createStore('Rfx2.model.company.kbtech.Stocktaking', [{
            property: 'unique_id',
            direction: 'ASC'
        }],
            gm.pageSize
            , {}
            , ['rtgast']
        );

        // // 창고 입고
        this.downloadSheetActionResource = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-download',
            text: '재고조사표 (모래/시멘트)',
            tooltip: '재고조사표 양식받기',
            handler: function () {

                gm.setCenterLoading(true);

                //var store = Ext.create('Mplm.store.MaterialRStore', {});
                var store = Ext.create('Rfx2.model.company.chmr.StoqtyLineSands', {});
                store.getProxy().setExtraParam("standard_flag", 'R');
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("menuCode", 'PMS2_EXL');
                store.getProxy().setExtraParam('orderBy', 'item_name');

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
                                // console_logs('response.responseText', response.responseText);
                                store.getProxy().setExtraParam("srch_type", null);
                                var excelPath = response.responseText;
                                // console_logs('excelPAth>>>>>>>>>>>>>>>', excelPath);
                                if (excelPath != null && excelPath.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                    console_logs('url>>>>>>>>>>>>>>>>>>', url);
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

        // this.downloadSheetActionResourceWire = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     iconCls: 'af-download',
        //     text: '재고조사표 (철망)',
        //     tooltip: '재고조사표 양식받기',
        //     handler: function () {

        //         gm.setCenterLoading(true);

        //         //var store = Ext.create('Mplm.store.MaterialRStore', {});
        //         var store = Ext.create('Rfx2.model.company.chmr.StoqtyLineWires', {});
        //         store.getProxy().setExtraParam("standard_flag", 'R');
        //         store.getProxy().setExtraParam("srch_type", 'excelPrint');
        //         store.getProxy().setExtraParam("srch_fields", 'major');
        //         store.getProxy().setExtraParam("srch_rows", 'all');
        //         store.getProxy().setExtraParam("menuCode", 'PMS2_EXL');
        //         store.getProxy().setExtraParam('orderBy', 'item_name');

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
        //                         // console_logs('response.responseText', response.responseText);
        //                         store.getProxy().setExtraParam("srch_type", null);
        //                         var excelPath = response.responseText;
        //                         // console_logs('excelPAth>>>>>>>>>>>>>>>', excelPath);
        //                         if (excelPath != null && excelPath.length > 0) {
        //                             var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
        //                             console_logs('url>>>>>>>>>>>>>>>>>>', url);
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

        this.downloadSheetActionProduct = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-download',
            text: '재고조사표 (제품)',
            tooltip: '재고조사표 양식받기',
            handler: function () {

                gm.setCenterLoading(true);

                //var store = Ext.create('Mplm.store.MaterialRStore', {});
                var store = Ext.create('Rfx2.model.company.chmr.StoqtyLineProduct', {});
                store.getProxy().setExtraParam("standard_flag", 'A');
                store.getProxy().setExtraParam("not_sg_codes", 'MIX|DELIVERY');
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("sp_code", "P");
                store.getProxy().setExtraParam("menuCode", 'PMS2_EXL');
                store.getProxy().setExtraParam('orderBy', 'item_name');

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
                                // console_logs('response.responseText', response.responseText);
                                store.getProxy().setExtraParam("srch_type", null);
                                var excelPath = response.responseText;
                                // console_logs('excelPAth>>>>>>>>>>>>>>>', excelPath);
                                if (excelPath != null && excelPath.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                    console_logs('url>>>>>>>>>>>>>>>>>>', url);
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

        this.downloadSheetActionGoods = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-download',
            text: '재고조사표 (상품)',
            tooltip: '재고조사표 양식받기',
            handler: function () {

                gm.setCenterLoading(true);

                //var store = Ext.create('Mplm.store.MaterialRStore', {});
                var store = Ext.create('Rfx2.model.company.chmr.StoqtyLineProduct', {});
                store.getProxy().setExtraParam("standard_flag", 'A');
                store.getProxy().setExtraParam("not_sg_codes", 'MIX|DELIVERY');
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("sp_code", "M");
                store.getProxy().setExtraParam("menuCode", 'PMS2_EXL');
                store.getProxy().setExtraParam('orderBy', 'item_name');

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
                                // console_logs('response.responseText', response.responseText);
                                store.getProxy().setExtraParam("srch_type", null);
                                var excelPath = response.responseText;
                                // console_logs('excelPAth>>>>>>>>>>>>>>>', excelPath);
                                if (excelPath != null && excelPath.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                    console_logs('url>>>>>>>>>>>>>>>>>>', url);
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

        this.downloadSheetStockTake = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: 'Excel',
            // tooltip: '선택한 양생실의 현황을 다운로드 합니다.',
            disabled: true,
            handler: function () {
                gm.setCenterLoading(true);
                var rec = gm.me().grid.getSelectionModel().getSelection();
                // var uids = [];
                // for (var i = 0; i < rec.length; i++) {
                    var selections = rec[0];
                //     uids.push(selections.get('unique_id_long'));
                // }
                // console_logs('>>>> UIDS', uids);
                var store = Ext.create('Rfx2.store.company.hanjung.StochkListStore', {});
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("is_excel_print", 'Y');
                store.getProxy().setExtraParam('rtgast_uid', selections.get('unique_id_long'))
                store.getProxy().setExtraParam("menuCode", 'PMS_STOCK_EXL');

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


        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var item_name = '';
                    var description = '';

                    if (gu.getCmp('item_name_search').getValue().length > 0) {
                        item_name = Ext.getCmp('item_name_search').getValue();
                    }

                    if (gu.getCmp('description_search').getValue().length > 0) {
                        description = Ext.getCmp('description_search').getValue();
                    }

                    var basic_sdate = gu.getCmp('s_date').getValue();
                    var basic_edate = gu.getCmp('e_date').getValue();


                    var basic_sdate_str = basic_sdate.getFullYear() + '-' + ((basic_sdate.getMonth() + 1) < 10 ? '0' + (basic_sdate.getMonth() + 1) : (basic_sdate.getMonth() + 1)) + '-' + ((basic_sdate.getDate()) < 10 ? '0' + (basic_sdate.getDate()) : (basic_sdate.getDate()));
                    var basic_edate_str = basic_edate.getFullYear() + '-' + ((basic_edate.getMonth() + 1) < 10 ? '0' + (basic_edate.getMonth() + 1) : (basic_edate.getMonth() + 1)) + '-' + ((basic_edate.getDate()) < 10 ? '0' + (basic_edate.getDate()) : (basic_edate.getDate()));

                    gm.me().stockPrevChangeStore.getProxy().setExtraParam('item_name', '%' + item_name + '%');

                    gm.me().stockPrevChangeStore.getProxy().setExtraParam('description', '%' + description + '%');
                    gm.me().stockPrevChangeStore.getProxy().setExtraParam('create_date', basic_sdate_str + ':' + basic_edate_str);
                } catch (e) {

                }


                gm.me().stockPrevChangeStore.load();
            }
        });

        // this.downloadSheetActionGoods = Ext.create('Ext.Action', {
        //     xtype: 'button',
        //     iconCls: 'af-download',
        //     text: '재고조사표 양식(상품)',
        //     tooltip: '재고조사표 양식받기',
        //     handler: function () {

        //         gm.setCenterLoading(true);

        //         //var store = Ext.create('Mplm.store.MaterialRStore', {});
        //         var store = Ext.create('Rfx2.model.company.bioprotech.StoqtyLine', {});
        //         store.getProxy().setExtraParam("standard_flag", 'A');
        //         store.getProxy().setExtraParam("not_sg_codes", 'MIX|DELIVERY');
        //         store.getProxy().setExtraParam("srch_type", 'excelPrint');
        //         store.getProxy().setExtraParam("srch_fields", 'major');
        //         store.getProxy().setExtraParam("srch_rows", 'all');
        //         store.getProxy().setExtraParam("menuCode", 'PMS2_EXL');
        //         store.getProxy().setExtraParam('orderBy', 'item_name');

        //         var items = searchToolbar.items.items;
        //         for (var i = 0; i < items.length; i++) {
        //             var item = items[i];
        //             store.getProxy().setExtraParam(item.name, item.value);
        //         }

        //         var arrField = gm.me().gSearchField;

        //         try {
        //             Ext.each(arrField, function(fieldObj, index) {

        //                 console_log(typeof fieldObj);

        //                 var dataIndex = '';

        //                 if(typeof fieldObj == 'string') { //text search
        //                     dataIndex = fieldObj;
        //                 } else {
        //                     dataIndex = fieldObj['field_id'];
        //                 }

        //                 var srchId = gm.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
        //                 var value = Ext.getCmp(srchId).getValue();

        //                 if(value!=null && value!='') {
        //                     if(dataIndex=='unique_id' || typeof fieldObj == 'object') {
        //                         store.getProxy().setExtraParam(dataIndex, value);
        //                     } else {
        //                         var enValue = Ext.JSON.encode('%' + value+ '%');
        //                         console_info(enValue);
        //                         store.getProxy().setExtraParam(dataIndex, enValue);
        //                     }//endofelse
        //                 }//endofif

        //             });
        //         } catch(noError){}

        //         store.load({
        //             scope: this,
        //             callback: function(records, operation, success) {

        //                 Ext.Ajax.request({
        //                     url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
        //                     params:{
        //                         mc_codes : gUtil.getMcCodes()
        //                     },
        //                     success : function(response, request) {
        //                         gm.setCenterLoading(false);
        //                         // console_logs('response.responseText', response.responseText);
        //                         store.getProxy().setExtraParam("srch_type", null);
        //                         var excelPath = response.responseText;
        //                         // console_logs('excelPAth>>>>>>>>>>>>>>>', excelPath);
        //                         if(excelPath!=null && excelPath.length>0) {
        //                             var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
        //                             console_logs('url>>>>>>>>>>>>>>>>>>', url);
        //                             top.location.href=url;

        //                         } else {
        //                             Ext.Msg.alert('경고', '엑셀 다운로드 경로를 찾을 수 없습니다.<br>엑셀 출력정책이 정의되지 않았습니다.');
        //                         }
        //                     }
        //                 });

        //             }
        //         });
        //     }
        // });

        // // 수정 버튼
        this.updateChildCodeBtn = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-edit',
            text: gm.getMC('CMD_MODIFY', '수정'),
            tooltip: '수량 변경',
            disabled: true,
            handler: function () {
                // 메인 그리드에서 선택한 system_code 정보 가져오기
                var selections = gm.me().grid.getSelectionModel().getSelected().items[0];

                // 서브 그리드에서 선택한 한행의 정보를 다 가져오는 것
                var selectionFromChild = gm.me().gridDetstoList.getSelectionModel().getSelection()[0];
                console_logs('코드정보 수정입니다', selectionFromChild.get('role_code'));

                var form = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    width: 330,
                    bodyPadding: 15,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    }, defaults: {
                        allowBlank: true,
                        msgTarget: 'side',
                        labelWidth: 150
                    }, items: [
                        {
                            fieldLabel: '수량',
                            xtype: 'textfield',
                            id: gu.id('dtl_qty'),
                            name: 'dtl_qty',
                            value: selectionFromChild.get('dtl_qty'),
                            readOnly: false
                        },
                        {
                            fieldLabel: '단위량',
                            xtype: 'textfield',
                            id: gu.id('unit_mass'),
                            name: 'unit_mass',
                            value: selectionFromChild.get('unit_mass'),
                            readOnly: true,
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        },
                        {
                            fieldLabel: '총량',
                            xtype: 'textfield',
                            id: gu.id('amount'),
                            name: 'amount',
                            value: selectionFromChild.get('amount'),
                            readOnly: false
                        },
                        {
                            fieldLabel: '단위',
                            xtype: 'textfield',
                            id: gu.id('unit_code'),
                            name: 'unit_code',
                            value: selectionFromChild.get('unit_code'),
                            readOnly: true,
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        },
                        {
                            fieldLabel: '위치',
                            xtype: 'textfield',
                            id: gu.id('stock_pos'),
                            name: 'stock_pos',
                            value: selectionFromChild.get('stock_pos'),
                            readOnly: false
                        },
                        {
                            fieldLabel: 'LOT_NO',
                            xtype: 'textfield',
                            id: gu.id('lot_no'),
                            name: 'lot_no',
                            value: selectionFromChild.get('lot_no'),
                            readOnly: false
                        }
                    ]
                });

                var winPart = Ext.create('Ext.Window', {
                    modal: true,
                    title: '수량 수정',
                    width: 350,
                    height: 400,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                winPart.close();
                            } else {
                                if (form.isValid()) {
                                    winPart.setLoading(true);
                                    var val = form.getValues(false);
                                    var unique_id = selectionFromChild.get('unique_id');
                                    console_logs('unique_id', unique_id)
                                    // 수정 함수 호출
                                    gm.me().updateChildCode(val, unique_id, winPart);
                                }
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            if (winPart) {
                                winPart.close();
                            }
                        }
                    }],
                });
                winPart.show();
            }
        });

        // // 그리드 선택 했을 시 콜백
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                this.detstoListStore.getProxy().setExtraParams(
                    {
                        dtl_qty: rec.get('dtl_qty'),
                        unit_mass: rec.get('unit_mass'),
                        amount: rec.get('amount'),
                        unit_code: rec.get('unit_code'),
                        stock_pos: rec.get('stock_pos'),
                        lot_no: rec.get('lot_no')
                    }
                );
                this.updateChildCodeBtn.disable();
            }
        })

        // // 창고 입고
        this.uploadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-upload-white',
            text: '재고조사표 업로드',
            tooltip: '재고조사표 업로드',
            handler: function () {

                var form = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    width: 500,
                    bodyPadding: 15,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    defaults: {
                        allowBlank: true,
                        msgTarget: 'side',
                        labelWidth: 60
                    },
                    items: [
                        {
                            fieldLabel: '재고조사일',
                            labelWidth: 100,
                            xtype: 'datefield',
                            id: gu.id('aprv_date'),
                            name: 'aprv_date',
                            format: 'Y-m-d',
                            value: new Date()
                        },
                        {
                            fieldLabel: '조사자',
                            labelWidth: 100,
                            xtype: 'combo',
                            id: gu.id('pr_uid'),
                            name: 'pr_uid',
                            store: Ext.create('Mplm.store.UserStore'),
                            displayField: 'user_name',
                            valueField: 'unique_id_long',
                            emptyText: '선택',
                            allowBlank: false,
                            sortInfo: { field: 'create_date', direction: 'DESC' },
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{user_id}] {user_name}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
                        },
                        {
                            fieldLabel: '비고',
                            labelWidth: 100,
                            xtype: 'textfield',
                            id: gu.id('reserved_varchar1'),
                            name: 'reserved_varchar1'
                        },
                        {
                            fieldLabel: '첨부파일',
                            labelWidth: 100,
                            xtype: 'filefield',
                            allowBlank: false,
                            id: gu.id('stocktaking_file'),
                            name: 'stocktaking_file'
                        },
                    ]
                });

                var winPart = Ext.create('ModalWindow', {
                    title: '재고조사',
                    width: 500,
                    height: 250,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {

                            if (form.isValid()) {
                                var val = form.getValues(false);

                                form.submit({
                                    url: CONTEXT_PATH + '/sales/sps1.do?method=uploadStocktakingTemplate&file_itemcode=' + gUtil.RandomString(10),
                                    waitMsg: '재고조사 반영 중입니다...',
                                    params: {

                                    },
                                    success: function (result, request) {
                                        gm.me().startTask();
                                        gm.me().store.load();
                                        Ext.MessageBox.alert('알림', '반영처리 되었습니다.')
                                        if (winPart) {
                                            winPart.close();

                                        }
                                    }, //endofsuccess
                                    failure: extjsUtil.failureMessage
                                }); //endofajax

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
                winPart.show();
            }
        });

        this.adjustStockAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-check',
            text: '재고반영',
            tooltip: '재고반영',
            disabled: true,
            handler: function () {

                var selection = gm.me().grid.getSelectionModel().getSelection()[0];
                var state = selection.get('state');
                var rtgastUid = selection.get('unique_id_long');
                var fileObjectUid = selection.get('fileobject_uid');

                if (state == 'A') {

                    Ext.MessageBox.show({
                        title: '확인',
                        msg: '재고를 반영하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn: function (result) {

                            if (result == 'yes') {

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/sps1.do?method=adjustStocktaking',
                                    params: {
                                        rtgastUid: rtgastUid,
                                        fileObjectUid: fileObjectUid
                                    },

                                    success: function (result, request) {
                                        gm.me().store.load();
                                        Ext.Msg.alert('안내', '재고를 반영중입니다.', function () { });

                                    },//endofsuccess
                                    failure: extjsUtil.failureMessage
                                });//endofajax
                            }
                        },
                        icon: Ext.MessageBox.QUESTION
                    });
                } else {
                    Ext.Msg.alert('', '이미 재고조사가 반영 된 파일입니다.');
                }
            }
        });

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        // //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        this.grid.flex = 1;

        this.stockPrevChangeStore = Ext.create('Rfx2.store.company.chmr.StockPrevChangeStore', { pageSize: 100 });
        // this.stockPrevChangeStore.sorters.removeAll();


        buttonToolbar.insert(1, this.uploadSheetAction);
        buttonToolbar.insert(2, this.downloadSheetActionResource);
        // buttonToolbar.insert(2, this.downloadSheetActionResourceWire);
        buttonToolbar.insert(3, this.downloadSheetActionProduct);
        buttonToolbar.insert(4, this.downloadSheetActionGoods);
        
        // // 상품은 나중에
        buttonToolbar.insert(11,this.downloadSheetStockTake);
        buttonToolbar.insert(1, '-');

        this.setGridOnCallback(function (selections) {

            if (selections.length > 0) {
                this.adjustStockAction.enable();
            } else {
                this.adjustStockAction.disable();
            }
        });

        this.stochkListStore = Ext.create('Rfx2.store.company.hanjung.StochkListStore', { pageSize: 100 });


        this.downloadSheetAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-excel',
            text: 'Excel 출력',
            tooltip: 'Excel 출력',
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
                var store = Ext.create('Rfx2.store.company.hanjung.StochkListStore', {});
                store.getProxy().setExtraParam("srch_type", 'excelPrint');
                store.getProxy().setExtraParam("srch_fields", 'major');
                store.getProxy().setExtraParam("srch_rows", 'all');
                store.getProxy().setExtraParam("is_excel_print", 'Y');
                store.getProxy().setExtraParam('rtgast_uids', uids)
                store.getProxy().setExtraParam("menuCode", 'PMS3_EXL');

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

        this.twoGrid = Ext.create('Rfx2.base.BaseGrid', {
            cls: 'rfx-panel',
            id: gu.id('twoGrid'),
            selModel: 'checkboxmodel',
            store: this.stockPrevChangeStore,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2
            },
            columns: [
                {
                    text: '변경일자',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'create_date',
                    format: 'Y-m-d',
                    dateFormat: 'Y-m-d',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: '품명',
                    width: 150,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: '규격',
                    width: 200,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'concat_spec_desc'
                },
                {
                    text: '변경전 수량',
                    width: 100,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'base_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '변경수량',
                    width: 100,
                    sortable: true,
                    align: "right",
                    style: 'text-align:center',
                    dataIndex: 'check_qty',
                    renderer: function (value, context, tmeta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '변경사유',
                    width: 200,
                    sortable: true,
                    editor: 'textfield',
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'reserved5'
                },
                {
                    text: '수정자',
                    width: 100,
                    sortable: true,
                    align: "left",
                    style: 'text-align:center',
                    dataIndex: 'user_name'
                }
            ],
            listeners: {
                edit: function (editor, e, eOpts) {
                    var columnName = e.field;
                    var tableName = 'stochk';
                    console_logs('e.record >>>>>>> ', e.record);
                    var unique_id = e.record.get('unique_id_long');
                    var value = e.value;
                    if (columnName === 'reserved5') {
                        columnName = 'reserved5';
                    }
                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, { type: '' });

                    gm.me().stockPrevChangeStore.load();
                }
            },
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
                    items: [

                        {
                            xtype: 'datefield',
                            labelStyle: 'width:60px; color: #ffffff;',
                            fieldLabel: '변경일자',
                            id: gu.id('s_date'),
                            width: 200,
                            name: 's_date',
                            value: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                            format: 'Y-m-d',
                            listeners: {

                            },
                        },
                        {
                            xtype: 'label',
                            text: '-',
                            margin: '0 0 0 0'
                        },
                        {
                            xtype: 'datefield',
                            padding: '0 0 5px 5px',
                            id: gu.id('e_date'),
                            width: 150,
                            name: 'e_date',
                            value: new Date(),
                            format: 'Y-m-d',
                            listeners: {

                            },
                        },
                        {
                            xtype: 'triggerfield',
                            emptyText: '품명',
                            id: gu.id('item_name_search'),
                            width: 130,
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            name: 'item_name',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().stockPrevChangeStore.getProxy().setExtraParam('item_name', '%' + gu.getCmp('item_name_search').getValue() + '%');
                                        gm.me().stockPrevChangeStore.load(function () { });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                gu.getCmp('item_name_search').setValue('');
                                gm.me().stockPrevChangeStore.getProxy().setExtraParam('item_name', '');
                                gm.me().stockPrevChangeStore.load(function () { });
                            }
                        },
                        {
                            xtype: 'triggerfield',
                            emptyText: '규격',
                            id: gu.id('description_search'),
                            width: 130,
                            fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                            name: 'description',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().stockPrevChangeStore.getProxy().setExtraParam('description', '%' + gu.getCmp('description_search').getValue() + '%');
                                        gm.me().stockPrevChangeStore.load(function () { });
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            'onTrigger1Click': function () {
                                gu.getCmp('description_search').setValue('');
                                gm.me().stockPrevChangeStore.getProxy().setExtraParam('description', '');
                                gm.me().stockPrevChangeStore.load(function () { });
                            }
                        }
                    ]
                }
            ],
            scrollable: true,
            flex: 1,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.stockPrevChangeStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }

            }),
        });

        Ext.each(this.twoGrid.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'reserved5':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'reserved5':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    };
                    break;
                default:
                    break;
            }

        });

        this.stockPrevChangeStore.load();

        // //gridCartList
        this.gridStochkList = Ext.create('Ext.grid.Panel', {
            store: this.stochkListStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: false,
            region: 'center',
            bbar: getPageToolbar(this.stochkListStore),
            border: true,
            reigon: 'north',
            height: '100%',
            layout: 'fit',
            forceFit: true,
            //title: '---',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        '->',
                        this.downloadSheetAction,
                        // this.deleteAction
                    ]
                },

            ],
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            columns: [
                //{ text: '자재번호', width: 90, style: 'text-align:center', align: 'left', dataIndex: 'item_code' },
                { text: '품명', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'concat_item_desc' },
                // { text: '규격', width: 100, align: 'left', style: 'text-align:center', dataIndex: 'specification' },
                { text: '단위', width: 50, align: 'left', style: 'text-align:center', dataIndex: 'unit_code' },
                {
                    text: '반영전재고', width: 80, align: 'right', style: 'text-align:center', dataIndex: 'system_qty', renderer: function (value, context, tmeta) {
                        if (context.field == 'system_qty') {
                            context.record.set('system_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '반영재고', width: 80, align: 'right', style: 'text-align:center', dataIndex: 'check_qty', renderer: function (value, context, tmeta) {
                        if (context.field == 'wh_qty') {
                            context.record.set('wh_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '변동수량', width: 80, align: 'right', style: 'text-align:center', dataIndex: 'variable_qty', renderer: function (value, context, tmeta) {
                        if (context.field == 'variable_qty') {
                            context.record.set('variable_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                { text: '변동사유', width: 120, align: 'left', style: 'text-align:center', dataIndex: 'reserved5' },

            ],
            name: 'cart',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'stochk';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    switch (columnName) {
                        case 'static_sales_price':
                            columnName = 'sales_price';
                            break;
                        default:
                            break;
                    }

                    var cStore = gm.me().cartListStore;
                    var rec = cStore.getAt(0);
                    var _quan = rec.get('quan') / rec.get('bm_quan');

                    var assymap_uid = e.record.get('coord_key3');

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, { type: '' });
                    gm.editAjax(tableName, 'pr_quan', value * _quan, 'unique_id', unique_id, { type: '' });
                    gm.editAjax('assymap', 'bm_quan', value, 'unique_id', assymap_uid, { type: '' });
                    gm.me().cartListStore.getProxy().setExtraParam('update_qty', 'Y');
                    gm.me().cartListStore.load();
                },
                select: function (dv, record) {
                    var rec = record.data;
                    console_logs('로그 확인 : `', rec);
                    gm.me().readOptionfactor(rec.unique_id);
                }
            }
        });


        // // 하단DET_정병준
        this.detstoListStore = Ext.create('Rfx.store.DetstoListStore', { pageSize: 100 });

        this.gridDetstoList = Ext.create('Ext.grid.Panel', {
            store: this.detstoListStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            reigon: 'south',
            // layout : fit,
            //title:'---',
            flex: 0.5,
            forceFit: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'bottom',
                    xtype: 'toolbar',
                    items: [
                        this.updateChildCodeBtn
                    ]
                }
            ],
            columns: [
                {
                    text: '수량', width: 130, align: 'right', style: 'text-align:center', dataIndex: 'dtl_qty',
                    renderer: function (value, meta) {
                        return value == null ? 0 : Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '단위량', width: 70, align: 'right', style: 'text-align:center', dataIndex: 'unit_mass', sortable: false,
                    renderer: function (value, meta) {
                        return value == null ? 0 : Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: '총량', width: 70, align: 'right', style: 'text-align:center', dataIndex: 'amount', sortable: false,
                    renderer: function (value, meta) {
                        return value == null ? 0 : Ext.util.Format.number(value, '0,00/i');
                    }
                },
                { text: '단위', width: 50, align: 'center', style: 'text-align:center', dataIndex: 'unit_code' },
                { text: '위치', width: 60, align: 'center', style: 'text-align:center', dataIndex: 'stock_pos' },
                { text: 'LOT NO', width: 100, align: 'right', style: 'text-align:center', dataIndex: 'lot_no' }
            ],
            name: 'detsto',
            autoScroll: true
        });
        this.gridDetstoList.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {
                    console_logs('----------selection : ', selections);
                }
            }
        });
        this.tabView = Ext.create('Ext.tab.Panel', {
            region: 'center',
            collapsible: false,
            border: true,
            width: '100%',
            margin: '5 0 0 0',
            flex: 2,
            items: [
                this.gridStochkList,
            ]
            ,
            listeners: {
                tabchange: function (tabPanel, newTab, oldTab, eOpts) {

                    gm.me().currentTab = newTab.name;
                    console_logs('>>>>> zzzzzz', gm.me().currentTab);

                    var selections = gm.me().grid.getSelectionModel().getSelection();
                }
            }
        });

        // 재고조사 상단 하단 나누기
        var myPanel = {
            collapsible: false,
            frame: false,
            region: 'east',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            flex: 0.5,
            margin: '0 0 0 0',
            items: [
                this.gridStochkList
            ]
        };

        var leftContainer = new Ext.container.Container({
            title: '엑셀업로드',
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
                    // margin: '5 0 0 0',
                    flex: 1.3,
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
                    items: [myPanel]
                }
            ]
        });

        var rightContainer = new Ext.container.Container({
            title: '이월재고 변경이력',
            region: 'center',
            layout: {
                type: 'border'
            },
            defaults: {
                collapsible: true,
            },
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    flex: 10,
                    items: [this.twoGrid]
                },
            ]
        });

        // 재고조사 상단 하단 나누기
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

        this.callParent(arguments);

        // //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                this.rtgast_uids = [];
                this.states = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    var state = rec1.get('state');
                    this.rtgast_uids.push(uids);
                    this.states.push(state);
                }
                var rec = selections[0];

                gm.me().vSELECTED_UNIQUE_ID = rec.get('id');
                gm.me().vSELECTED_PO_NO = rec.get('po_no');
                gm.me().vSELECTED_RTG_TYPE = rec.get('rtg_type');
                console_logs("gm.me().vSELECTED_UNIQUE_ID>>>>>>>>>>", gm.me().vSELECTED_UNIQUE_ID);

                this.gridStochkList.getStore().getProxy().setExtraParam('rtgast_uid', this.rtgast_uids);
                console_logs("this.rtgast_uids>>>>>>>>>>", this.rtgast_uids);

                // gm.me().gridStochkList.setTitle(rec.get('po_no'));

                var totalPrice = 0;
                this.gridStochkList.getStore().load(function (record) {
                });
                this.downloadSheetStockTake.enable();
                this.downloadSheetAction.enable();

            } else {
                this.downloadSheetStockTake.disable();
                this.downloadSheetAction.disable();
            }
        });

        this.gridDetstoList.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    gm.me().updateChildCodeBtn.enable();
                } else {
                    gm.me().updateChildCodeBtn.disable();
                }
            }
        })

        var runner = new Ext.util.TaskRunner();
        this.task = runner.newTask({
            run: function () {
                gm.me().myFunction();
            },
            interval: 1000
        });

        this.startTask();
    },

    // 수정 jbj
    updateChildCode: function (val, unique_id, win) {
        Ext.MessageBox.show({
            title: '수정',
            msg: '수정하시겠습니까?',
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/inventory/prchStock.do?method=updateNstockQty',
                        params: {
                            dtl_qty: val['dtl_qty'],
                            unit_mass: val['unit_mass'],
                            amount: val['amount'],
                            unit_code: val['unit_code'],
                            stock_pos: val['stock_pos'],
                            lot_no: val['lot_no'],
                            unique_id: unique_id
                        },
                        success: function (result, request) {
                            var resultText = result.responseText;
                            console_log('result:' + resultText);
                            gm.me().store.load();
                            gm.me().detstoListStore.load();
                            if (win) {
                                win.close();
                            }
                        },
                        failure: extjsUtil.failureMessage
                    });//endof ajax request
                }
            },
            icon: Ext.MessageBox.QUESTION
        })
    },

    // 정병준 
    readOptionfactor: function (unique_id) {
        gm.me().detstoListStore.getProxy().setExtraParam('nstock_uid', unique_id);
        gm.me().detstoListStore.load();
    },
    // 정병준 

    task: null,

    startTask: function () {
        this.task.start();
    },
    endTask: function () {
        cur_cnt = 0;
        this.task.stop();
    },

    loding_msg: function () {
        Ext.MessageBox.wait('재고 조사 반영 중 입니다...', '재고조사');
    },
    stop_msg: function () {
        Ext.MessageBox.hide();
    },
    useValueCopyCombo: false, //값복사 사용
    useDivisionCombo: false  //사업부 콤보 시용

});



