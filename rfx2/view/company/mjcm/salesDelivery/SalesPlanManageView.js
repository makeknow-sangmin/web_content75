//수주관리 메뉴
Ext.define('Rfx2.view.company.mjcm.salesDelivery.SalesPlanManageView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'sales-plan-manage-view',
    requires: [
        'Rfx.util.MonthField'
    ],
    initComponent: function () {

        this.initSearchField();

        var eDateYear = 0;
        var eDateMonth = 0;

        if (new Date().getMonth() > 0) {
            eDateYear = new Date().getFullYear() + 1;
            eDateMonth = new Date().getMonth() - 1;
        } else {
            eDateYear = new Date().getFullYear();
            eDateMonth = 11;
        }

        var eDateDay = new Date(eDateYear, eDateMonth + 1, 0).getDate();

        var sDate = Ext.Date.add(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
        var eDate = new Date(new Date(eDateYear, eDateMonth, eDateDay));

        this.addSearchField({
            type: 'dateRange',
            field_id: 'monthYear',
            text:  this.getMC('mes_sro5_pln_sbar_period', '조회기간'),
            sdate: sDate,
            edate: eDate
        });

        this.addSearchField(
            {
                type: 'combo'
                , field_id: 'combst_uid'
                , store: "CombstStore"
                , width: 250
                , emptyText: this.getMC('mes_sro5_pln_sbar_customer', '고객사')
                , displayField: 'wa_name'
                , valueField: 'unique_id_long'
                , innerTpl: '<div data-qtip="{codeNameEn}">{wa_name} [{nation_code}]</div>'
            });

        this.addSearchField(
        {
            type: 'combo'
            , field_id: 'group_name'
            , store: "ProductTypeStore"
            , emptyText: this.getMC('mes_sro5_pln_sbar_prdt_type', gm.getMC('CMD_Product', '제품군'))
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });

        this.addSearchField(
        {
            type: 'combo'
            , field_id: 'dim_uid'
            , store: "ClaastStorePD"
            , emptyText: this.getMC('mes_sro5_pln_sbar_small_cat', '소분류')
            , width: 200
            , displayField: 'class_name'
            , valueField: 'unique_id_long'
            , innerTpl: '<div data-qtip="{class_name}">[{class_code}] {class_name}</div>'
            , params: {
                identification_code: "PRD_CLS_CODE", level1: 3
            }
        });



        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        var BuyerStore = Ext.create('Mplm.store.BuyerStore', {});

        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx2.model.company.bioprotech.SalesPlanManage', [{
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

        this.setRowClass(function (record, index) {
            return 'salesplan-custom-row';
        });

        var tabFileUpload = {
            padding: 10,
            items: [
                {
                    bodyPadding: 5,
                    defaults: {
                        border: false,
                        labelWidth: 100,
                        labelAlign: 'right',
                        layout: 'anchor'
                    },
                    layout: {
                        type: 'hbox',
                        pack: 'start'
                    },
                    items: [{
                        xtype: 'radiogroup',
                        id: gu.id('measureType'),
                        fieldLabel: this.getMC('pms1_gubun', '구분'),
                        items: [
                            {boxLabel: 'BOM', name: 'radio1', inputValue: 'BOM', checked: true}
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                switch (newValue.radio1) {
                                    case 'BW':
                                        break;
                                    case 'SB':
                                        break;
                                }
                            }
                        }
                    }]
                }
            ]
        };

        //this.gridContent2 = );

        //this.panelDataUpload = ;

        this.addPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: this.getMC('mes_sro5_pln_btn_add_plan', '계획추가'),
            tooltip: this.getMC('mes_sro5_pln_btn_add_plan', '계획추가'),
            disabled: false,
            handler: function () {

                var itemsK = [];

                var sYear = new Date().getFullYear();
                var sMonth = new Date().getMonth() + 2;
                var seq = 1;

                for (var i = 0; i <= 12; i++) {

                    var calStr = '';
                    var seqStr = '';

                    if (i > 9) {
                        calStr = i;
                    } else {
                        calStr = '0' + i;
                    }

                    if (seq > 9) {
                        seqStr = seq;
                    } else {
                        seqStr = '0' + seq;
                    }

                    if (sMonth > 12) {
                        sMonth = 1;
                    }

                    if (sMonth === 1) {
                        sYear += 1;
                    }

                    if (i === 0) {
                        itemsK.push(
                            {
                                xtype: 'label',
                                width: '8%',
                                padding: '5 5 5 5',
                                text: ''
                            },
                            {
                                xtype: 'label',
                                width: '22%',
                                padding: '0 0 5 1',
                                style: 'display:inline-block;text-align:center',
                                text: gm.me().getMC('mes_sro5_pln_column_year_month', '연월')
                            },
                            {
                                xtype: 'label',
                                width: '22%',
                                padding: '0 0 5 5',
                                style: 'display:inline-block;text-align:center',
                                text: gm.me().getMC('mes_sro5_pln_column_year_qty', '수량')
                            },
                            {
                                xtype: 'label',
                                width: '22%',
                                padding: '0 0 5 9',
                                style: 'display:inline-block;text-align:center',
                                text: gm.me().getMC('mes_sro5_pln_column_price', '단가')
                            },
                            {
                                xtype: 'label',
                                width: '22%',
                                padding: '0 0 5 13',
                                style: 'display:inline-block;text-align:center',
                                text: gm.me().getMC('mes_sro5_pln_column_amount', '금액')
                            }
                        );
                    } else {
                        seq++;
                        itemsK.push(
                            {
                                xtype: 'label',
                                width: '8%',
                                padding: '5 5 5 5',
                                text: seqStr + '. '
                            },
                            {
                                id: gu.id('calendar' + seqStr),
                                name: 'calendar' + seqStr,
                                xtype: 'monthfield',
                                width: '22%',
                                padding: '0 5 5 0',
                                emptyText: gm.me().getMC('mes_sro5_pln_column_year_month', '연월'),
                                format: 'Y-m',
                                submitFormat: 'Y-m',
                                dateFormat: 'Y-m',
                                value: sYear + '-' + (sMonth > 9 ? sMonth : '0' + sMonth),
                                submitEmptyText: false
                            },
                            {
                                id: gu.id('quan' + seqStr),
                                name: 'quan' + seqStr,
                                width: '22%',
                                padding: '0 5 5 0',
                                xtype: 'numberfield',
                                enableKeyEvents: true,
                                listeners: {
                                    keyup: function (numberfield, e, eOpts) {
                                        var salesPriceField = gu.getCmp('sales_price' + numberfield.name.replace('quan', ''));
                                        var totalSalesPriceField = gu.getCmp('total_sales_price' + numberfield.name.replace('quan', ''));

                                        if (salesPriceField.getValue() !== null) {

                                            totalSalesPriceField.setValue(+(Number(numberfield.value) * Number(salesPriceField.getValue())).toFixed(12));
                                        } else {
                                            totalSalesPriceField.setValue(0);
                                        }
                                    }
                                }
                            },
                            {
                                id: gu.id('sales_price' + seqStr),
                                name: 'sales_price' + seqStr,
                                width: '22%',
                                padding: '0 5 5 0',
                                xtype: 'numberfield',
                                decimalPrecision: 5,
                                enableKeyEvents: true,
                                listeners: {
                                    keyup: function (numberfield, e, eOpts) {
                                        var quanField = gu.getCmp('quan' + numberfield.name.replace('sales_price', ''));
                                        var totalSalesPriceField = gu.getCmp('total_sales_price' + numberfield.name.replace('sales_price', ''));

                                        if (quanField.getValue() !== null) {
                                            totalSalesPriceField.setValue(+(Number(numberfield.value) * Number(quanField.getValue())).toFixed(12));
                                        } else {
                                            totalSalesPriceField.setValue(0);
                                        }
                                    }
                                }
                            },
                            {
                                id: gu.id('total_sales_price' + seqStr),
                                readOnly: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none; text-align: right',
                                name: 'total_sales_price' + seqStr,
                                width: '22%',
                                padding: '0 5 5 0',
                                value: 0,
                                xtype: 'textfield'
                            }
                        );

                        sMonth++;
                    }
                }

                var currencyStore = Ext.create('Mplm.store.CommonCodeExStore', {parentCode: 'CURRENCY_GROUP'})

                var form = Ext.create('Ext.form.Panel', {
                    id: 'addPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('mes_sro5_pln_fieldset_regi', '공통정보'),
                            width: '39%',
                            style: 'padding:10px',
                            defaults: {
                                labelStyle: 'padding:10px',
                                anchor: '100%',
                                layout: {
                                    type: 'column'
                                }
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: '95%',
                                    border: true,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [
                                        {
                                            id: gu.id('combstUid'),
                                            name: 'combstUid',
                                            fieldLabel: gm.me().getMC('mes_sro5_pln_sbar_customer','고객사'),
                                            labelWidth: 60,
                                            xtype: 'combo',
                                            width: '95%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().combstStore,
                                            emptyText: gm.me().getMC('msg_common_emptytext_select','선택해주세요.'),
                                            displayField: 'wa_name',
                                            valueField: 'unique_id_long',
                                            // sortInfo: { field: 'codeName', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{wa_name} [{nation_code}]</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    gu.getCmp('finalCombstUid').setValue(combo.value);
                                                }// endofselect
                                            }
                                        }, {
                                            id: gu.id('finalCombstUid'),
                                            name: 'finalCombstUid',
                                            fieldLabel: gm.me().getMC('mes_sro5_pln_column_ecustomer','최종고객'),
                                            labelWidth: 60,
                                            xtype: 'combo',
                                            width: '95%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().combstStore,
                                            emptyText: gm.me().getMC('msg_common_emptytext_select','선택해주세요.'),
                                            displayField: 'wa_name',
                                            valueField: 'unique_id_long',
                                            // sortInfo: { field: 'codeName', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{wa_name} [{nation_code}]</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        }, {
                                            id: gu.id('spCode'),
                                            name: 'spCode',
                                            fieldLabel: gm.me().getMC('mes_sro5_pln_sbar_prdt_type',gm.getMC('CMD_Product', '제품군')),
                                            labelWidth: 60,
                                            xtype: 'combo',
                                            width: '95%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().spCodeStore,
                                            emptyText: gm.me().getMC('msg_common_emptytext_select','선택해주세요.'),
                                            displayField: 'class_name',
                                            valueField: 'unique_id_long',
                                            // sortInfo: { field: 'codeName', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">[{class_code}] {class_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    gu.getCmp('sgCode').setValue(null);
                                                    gm.me().sgCodeStore.getProxy().setExtraParam('parent_class_code', record.get('class_code'));
                                                    gm.me().sgCodeStore.load();
                                                }
                                            }
                                        }, {
                                            id: gu.id('sgCode'),
                                            name: 'sgCode',
                                            fieldLabel: gm.me().getMC('mes_sro5_pln_sbar_small_cat', '소분류'),
                                            labelWidth: 60,
                                            xtype: 'combo',
                                            width: '95%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: gm.me().sgCodeStore,
                                            emptyText: gm.me().getMC('msg_common_emptytext_select','선택해주세요.'),
                                            displayField: 'class_name',
                                            valueField: 'unique_id_long',
                                            // sortInfo: { field: 'codeName', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">[{class_code}] {class_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }
                                            }
                                        }, /*{
                                            id: gu.id('currency'),
                                            name: 'currency',
                                            fieldLabel: '통화',
                                            labelWidth: 60,
                                            width: '95%',
                                            padding: '0 0 5px 30px',
                                            xtype: 'textfield',
                                            allowBlank: false
                                        }*/
                                        {
                                            id: gu.id('currency'),
                                            name: 'currency',
                                            fieldLabel: gm.me().getMC('mes_sro5_pln_column_currency', '통화'),
                                            labelWidth: 60,
                                            xtype: 'combo',
                                            width: '95%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-image: none;',
                                            store: currencyStore,
                                            emptyText: gm.me().getMC('msg_common_emptytext_select','선택해주세요.'),
                                            displayField: 'system_code',
                                            valueField: 'system_code',
                                            // sortInfo: { field: 'codeName', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{system_code}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            frame: true,
                            title: gm.me().getMC('mes_sro5_pln_fieldset_goals','목표설정'),
                            width: '60%',
                            height: '100%',
                            layout: 'fit',
                            margin: '0 0 0 5',
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: '98%',
                                    // margin: '0 10 10 1',
                                    border: true,
                                    layout: 'column',
                                    items: itemsK
                                }
                            ]
                        }
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_sro5_pln_title_regi','영업계획등록'),
                    width: 900,
                    height: 500,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('addPoForm').getForm();
                                if (form.isValid()) {

                                    win.setLoading(true);

                                    var val = form.getValues(false);

                                    form.submit({
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=addSalesPlan',
                                        submitEmptyText: false,
                                        params: {

                                        },
                                        success: function (val, action) {
                                            win.setLoading(false);
                                            gm.me().storeLoad();
                                            win.close();
                                        },
                                        failure: function() {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                        }
                                    });

                                } else {
                                    //Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
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
            }
        });

        this.excelUploadAction = Ext.create('Ext.Action', {
            iconCls: 'af-upload-white',
            text: this.getMC('mes_sro5_pln_btn_upload_all','일괄업로드'),
            tooltip: this.getMC('mes_sro5_pln_btn_upload_all','일괄업로드'),
            handler: function() {

                var gridContent = Ext.create('Ext.panel.Panel', {
                    cls: 'rfx-panel',
                    id: gu.id('gridContent2'),
                    collapsible: false,
                    region: 'east',
                    multiSelect: false,
                    //autoScroll: true,
                    autoHeight: true,
                    frame: false,
                    layout: 'vbox',
                    forceFit: true,
                    flex: 1,
                    items: [gm.me().createMsTab('SIZE', 'SI')]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_sro5_pln_btn_upload_all','일괄업로드'),
                    id: gu.id('uploadPrWin'),
                    width: 500,
                    height: 500,
                    items: {
                        collapsible: false,
                        frame: false,
                        region: 'center',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        margin: '0 0 5 0',
                        flex: 1,
                        items: [gridContent]
                    }
                });

                prWin.show();
            }
        });

        this.excelAction = Ext.create('Ext.Action', {
            iconCls: 'af-excel',
            text: 'Excel',
            tooltip: 'Excel',
            handler: function() {
                gm.me().popUpExcelHandler();
            }
        });

        this.editPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: this.getMC('mes_sro5_pln_btn_modify_plan','계획수정'),
            tooltip: this.getMC('mes_sro5_pln_btn_modify_plan','계획수정'),
            disabled: true,
            handler: function () {

                var monthYear = gm.me().store.getProxy().getExtraParams().monthYear;

                var sMonth = new Date().getMonth() + 1;
                var eYear = 0;
                var eMonth = 0;

                if (new Date().getMonth() > 0) {
                    eYear = new Date().getFullYear() + 1;
                    eMonth = new Date().getMonth();
                    if (eMonth < 10) {
                        eMonth = '0' + eMonth;
                    }
                } else {
                    eYear = new Date().getFullYear();
                    eMonth = 12;
                }

                if (sMonth < 10) {
                    sMonth = '0' + sMonth;
                }

                if (monthYear === undefined || monthYear === null) {
                    monthYear = new Date().getFullYear() + '-' + sMonth + '-' + '01:'
                        + eYear + '-' + eMonth + '-' + '31';
                }

                var monthYearTemp = monthYear.split('%').join('');
                monthYearTemp = monthYearTemp.split('"').join('');

                var monthYears = monthYearTemp.split(":");

                var itemsK = [];

                var sTemp = monthYears[0].split("-").join("");
                var eTemp = monthYears[1].split("-").join("");

                var sYearMonth = sTemp.substring(0, 6) * 1;
                var eYearMonth = eTemp.substring(0, 6) * 1;

                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var quan_val = rec.get('quan_val');
                var sales_price_val = rec.get('sales_price_val');

                var quan_vals = quan_val.split(',');
                var sales_price_vals = sales_price_val.split(',');

                var seq = 1;

                for (var i = sYearMonth; i <= eYearMonth; i++) {

                    var year = Math.floor(i / 100);
                    var month = i - (Math.floor(i / 100) * 100);

                    if (month < 1 || month > 12) {
                        continue;
                    }

                    var calStr = '';
                    var seqStr = '';

                    if (month > 9) {
                        calStr = month;
                    } else {
                        calStr = '0' + month;
                    }

                    if (seq > 9) {
                        seqStr = seq;
                    } else {
                        seqStr = '0' + seq;
                    }

                    seq++;

                    var existVal = false;
                    var cal = '';
                    var quan = 0;
                    var sales_price = 0;
                    var total_sales_price = 0;

                    for (var l = 0; l < quan_vals.length; l++) {
                        var quanSplits = quan_vals[l].split(':');
                        var salesPriceSplits = sales_price_vals[l].split(':');
                        var calVal = quanSplits[0];
                        var quanVal = quanSplits[1];
                        var salesPriceVal = salesPriceSplits[1];

                        if ((year + '-' + calStr) === calVal) {
                            quan = quanVal;
                            sales_price = salesPriceVal;
                            total_sales_price = +(Number(quan) * Number(sales_price)).toFixed(12);
                        }
                    }

                    if (i === sYearMonth) {
                        itemsK.push(
                            {
                                xtype: 'label',
                                width: '8%',
                                padding: '5 5 5 5',
                                text: ''
                            },
                            {
                                xtype: 'label',
                                width: '22%',
                                padding: '0 0 5 1',
                                style: 'display:inline-block;text-align:center',
                                text: gm.me().getMC('mes_sro5_pln_column_year_month', '연월')
                            },
                            {
                                xtype: 'label',
                                width: '22%',
                                padding: '0 0 5 5',
                                style: 'display:inline-block;text-align:center',
                                text: gm.me().getMC('mes_sro5_pln_column_year_qty', '수량')
                            },
                            {
                                xtype: 'label',
                                width: '22%',
                                padding: '0 0 5 9',
                                style: 'display:inline-block;text-align:center',
                                text: gm.me().getMC('mes_sro5_pln_column_price', '단가')
                            },
                            {
                                xtype: 'label',
                                width: '22%',
                                padding: '0 0 5 13',
                                style: 'display:inline-block;text-align:center',
                                text: gm.me().getMC('mes_sro5_pln_column_amount', '금액')
                            }
                        );
                    }

                    itemsK.push(
                        {
                            xtype: 'label',
                            width: '8%',
                            padding: '5 5 5 5',
                            text: seqStr + '. '
                        },
                        {
                            id: gu.id('calendar' + seqStr),
                            name: 'calendar' + seqStr,
                            xtype: 'monthfield',
                            width: '22%',
                            padding: '0 5 5 0',
                            emptyText: gm.me().getMC('mes_sro5_pln_column_year_month', '연월'),
                            format: 'Y-m',
                            submitFormat: 'Y-m',
                            dateFormat: 'Y-m',
                            value: new Date(year + '-' + calStr),
                            submitEmptyText: false
                        },
                        {
                            id: gu.id('quan' + seqStr),
                            name: 'quan' + seqStr,
                            width: '22%',
                            padding: '0 5 5 0',
                            xtype: 'textfield',
                            //maskRe: new RegExp("[0-9]+"),
                            fieldStyle: 'text-align: right;',
                            enableKeyEvents: true,
                            value: quan > 0 ? quan : '',
                            listeners: {
                                keyup: function (numberfield, e, eOpts) {
                                    var salesPriceField = gu.getCmp('sales_price' + numberfield.name.replace('quan', ''));
                                    var totalSalesPriceField = gu.getCmp('total_sales_price' + numberfield.name.replace('quan', ''));

                                    if (salesPriceField.getValue() !== null) {
                                        totalSalesPriceField.setValue(+(Number(numberfield.value) * Number(salesPriceField.getValue())).toFixed(12));
                                    } else {
                                        totalSalesPriceField.setValue(0);
                                    }
                                }
                                // keyup: function (numberfield, e, eOpts) {
                                //     var salesPriceField = gu.getCmp('sales_price' + numberfield.name.replace('quan', ''));
                                //     var totalSalesPriceField = gu.getCmp('total_sales_price' + numberfield.name.replace('quan', ''));
                                //
                                //     if (salesPriceField.getValue() !== null) {
                                //         var totalValue = numberfield.value * salesPriceField.getValue();
                                //
                                //         totalSalesPriceField.setValue(gm.me().renderDecimal(totalValue));
                                //     } else {
                                //         totalSalesPriceField.setValue(0);
                                //     }
                                //
                                //     this.setValue(gm.me().renderDecimal(numberfield.value));
                                // }
                            }
                        },
                        {
                            id: gu.id('sales_price' + seqStr),
                            name: 'sales_price' + seqStr,
                            width: '22%',
                            padding: '0 5 5 0',
                            //xtype: 'textfield',
                            xtype: 'numberfield',
                            decimalPrecision: 5,
                            //fieldStyle: 'text-align: right;',
                            //maskRe: new RegExp("[0-9.]+"),
                            enableKeyEvents: true,
                            value: sales_price > 0 ? sales_price : '',
                            listeners: {
                                // keyup: function (numberfield, e, eOpts) {
                                //     var quanField = gu.getCmp('quan' + numberfield.name.replace('sales_price', ''));
                                //     var totalSalesPriceField = gu.getCmp('total_sales_price' + numberfield.name.replace('sales_price', ''));
                                //
                                //     if (quanField.getValue() !== null) {
                                //         var totalValue = numberfield.value * quanField.getValue();
                                //
                                //         totalSalesPriceField.setValue(gm.me().renderDecimal(totalValue));
                                //     } else {
                                //         totalSalesPriceField.setValue(0);
                                //     }
                                //
                                //     this.setValue(gm.me().renderDecimal(numberfield.value));
                                // }
                                keyup: function (numberfield, e, eOpts) {
                                    var quanField = gu.getCmp('quan' + numberfield.name.replace('sales_price', ''));
                                    var totalSalesPriceField = gu.getCmp('total_sales_price' + numberfield.name.replace('sales_price', ''));

                                    if (quanField.getValue() !== null) {
                                        totalSalesPriceField.setValue(+(Number(numberfield.value) * Number(quanField.getValue())).toFixed(12));
                                    } else {
                                        totalSalesPriceField.setValue(0);
                                    }
                                }
                            }
                        },
                        {
                            id: gu.id('total_sales_price' + seqStr),
                            name: 'total_sales_price' + seqStr,
                            readOnly: true,
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;text-align: right;',
                            value: total_sales_price > 0 ? total_sales_price : 0,
                            width: '22%',
                            padding: '0 5 5 0',
                            xtype: 'textfield'
                        }
                    );

                    // itemsK.push({
                    //         id: gu.id('calendar' + seqStr),
                    //         name: 'calendar' + seqStr,
                    //         fieldLabel: seqStr + '. ',
                    //         labelWidth: 40,
                    //         xtype: 'monthfield',
                    //         width: '49%',
                    //         padding: '0 8 8 0',
                    //         emptyText: '연월',
                    //         format: 'Y-m',
                    //         submitFormat: 'Y-m',
                    //         dateFormat: 'Y-m',
                    //         submitEmptyText: false,
                    //         value: new Date(year + '-' + calStr)
                    //     },
                    //     {
                    //         id: gu.id('quan' + seqStr),
                    //         name: 'quan' + seqStr,
                    //         width: '49%',
                    //         xtype: 'numberfield',
                    //         value: quan > 0 ? quan : ''
                    //     });


                }

                gm.me().spCodeStore.load();
                gm.me().sgCodeStore.load();
                gm.me().combstStore.load();

                var form = Ext.create('Ext.form.Panel', {
                    id: 'addPoForm',
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '97.8%',
                    layout: 'column',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'viewPropUid',
                            value: rec.get('unique_id_long')
                        },
                        {
                            xtype: 'fieldset',
                            collapsible: false,
                            title: gm.me().getMC('mes_sro5_pln_fieldset_regi', '공통정보'),
                            width: '39%',
                            style: 'padding:10px',
                            defaults: {
                                labelStyle: 'padding:10px',
                                anchor: '100%',
                                layout: {
                                    type: 'column'
                                }
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: '95%',
                                    // margin: '0 10 10 1',
                                    border: true,
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 10
                                    },
                                    items: [
                                        {
                                            id: gu.id('combstUid'),
                                            name: 'combstUid',
                                            fieldLabel: gm.me().getMC('mes_sro5_pln_sbar_customer', '고객사'),
                                            hidden: true,
                                            labelWidth: 60,
                                            readOnly: true,
                                            xtype: 'combo',
                                            width: '95%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                            store: gm.me().combstStore,
                                            emptyText:  gm.me().getMC('msg_common_emptytext_select', '선택해주세요'),
                                            displayField: 'wa_name',
                                            valueField: 'unique_id_long',
                                            value: rec.get('combst_uid'),
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{wa_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        }, {
                                            id: gu.id('waName'),
                                            name: 'waName',
                                            fieldLabel: gm.me().getMC('mes_sro5_pln_sbar_customer', '고객사'),
                                            labelWidth: 60,
                                            readOnly: true,
                                            xtype: 'combo',
                                            width: '95%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            value: rec.get('wa_name'),
                                            fieldStyle: 'background-color: #EAEAEA; background-image: none;',

                                        },
                                        {
                                            id: gu.id('finalCombstUid'),
                                            name: 'finalCombstUid',
                                            fieldLabel: gm.me().getMC('mes_sro5_pln_sbar_customer', '고객사'),
                                            hidden: true,
                                            labelWidth: 60,
                                            readOnly: true,
                                            xtype: 'combo',
                                            width: '95%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                            store: gm.me().combstStore,
                                            emptyText: gm.me().getMC('msg_common_emptytext_select', '선택해주세요'),
                                            displayField: 'wa_name',
                                            valueField: 'unique_id_long',
                                            value: rec.get('final_combst_uid'),
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{wa_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }// endofselect
                                            }
                                        }, {
                                            id: gu.id('finalWaName'),
                                            name: 'finalWaName',
                                            fieldLabel: gm.me().getMC('mes_sro5_pln_column_ecustomer', '최종고객'),
                                            labelWidth: 60,
                                            readOnly: true,
                                            xtype: 'combo',
                                            width: '95%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            value: rec.get('final_wa_name'),
                                            fieldStyle: 'background-color: #EAEAEA; background-image: none;',

                                        }, {
                                            id: gu.id('spCode'),
                                            name: 'spCode',
                                            fieldLabel: gm.me().getMC('mes_sro5_pln_sbar_prdt_type', gm.getMC('CMD_Product', '제품군')),
                                            readOnly: true,
                                            labelWidth: 60,
                                            xtype: 'combo',
                                            width: '95%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                            store: gm.me().spCodeStore,
                                            emptyText: gm.me().getMC('msg_common_emptytext_select', '선택해주세요'),
                                            displayField: 'class_name',
                                            valueField: 'unique_id_long',
                                            // sortInfo: { field: 'codeName', direction: 'ASC' },
                                            typeAhead: false,
                                            minChars: 1,
                                            value: rec.get('parent_claast_uid'),
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">[{class_code}] {class_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                }
                                            }
                                        }, {
                                            id: gu.id('sgCode'),
                                            name: 'sgCode',
                                            fieldLabel: gm.me().getMC('mes_sro5_pln_sbar_small_cat', '소분류'),
                                            labelWidth: 60,
                                            readOnly: true,
                                            xtype: 'combo',
                                            width: '95%',
                                            padding: '0 0 5px 30px',
                                            allowBlank: false,
                                            fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                            store: gm.me().sgCodeStore,
                                            emptyText: gm.me().getMC('msg_common_emptytext_select', '선택해주세요'),
                                            displayField: 'class_name',
                                            valueField: 'unique_id_long',
                                            value: rec.get('claast_uid'),
                                            typeAhead: false,
                                            minChars: 1,
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching posts found.',
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">[{class_code}] {class_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {

                                                }
                                            }
                                        }, {
                                            id: gu.id('currency'),
                                            name: 'currency',
                                            fieldLabel: gm.me().getMC('mes_sro5_pln_column_currency', '통화'),
                                            labelWidth: 60,
                                            width: '95%',
                                            readOnly: true,
                                            padding: '0 0 5px 30px',
                                            xtype: 'textfield',
                                            fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                            value: rec.get('currency'),
                                            allowBlank: false
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            frame: true,
                            title: gm.me().getMC('mes_sro5_pln_fieldset_goals', '목표설정'),
                            width: '60%',
                            height: '100%',
                            layout: 'fit',
                            margin: '0 0 0 5',
                            defaults: {
                                margin: '2 2 2 2'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: '98%',
                                    // margin: '0 10 10 1',
                                    border: true,
                                    layout: 'column',
                                    items: itemsK
                                }
                            ]
                        }
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal: true,
                    title: gm.me().getMC('mes_sro5_pln_title_modi', '영업계획수정'),
                    width: 900,
                    height: 500,
                    autoScroll: true,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('addPoForm').getForm();

                                if (form.isValid()) {

                                    win.setLoading(true);

                                    var val = form.getValues(false);

                                    form.submit({
                                        url: CONTEXT_PATH + '/sales/buyer.do?method=modifySalesPlan',
                                        submitEmptyText: false,
                                        params: {

                                        },
                                        success: function (val, action) {
                                            win.setLoading(false);
                                            gm.me().storeLoad();
                                            win.close();
                                        },
                                        failure: function() {
                                            win.setLoading(false);
                                            extjsUtil.failureMessage();
                                        }
                                    });

                                } else {
                                    //Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
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
            }
        });

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5 || index == 11) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(12, this.excelAction);
        buttonToolbar.insert(1, this.excelUploadAction);
        buttonToolbar.insert(1, this.editPoAction);
        buttonToolbar.insert(1, this.addPoAction);

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections) {
                this.editPoAction.enable();
            } else {
                this.editPoAction.disable();
            }
        });

        this.createCrudTab();

        this.grid

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);


        // 디폴트 로딩
        gm.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.

        sDate = Ext.Date.format(sDate, 'Y-m-d');
        eDate = Ext.Date.format(eDate, 'Y-m-d');

        this.store.getProxy().setExtraParam('monthYear', sDate + ':' + eDate);

        this.storeLoad();

    },

    //spCodeStore: Ext.create('Mplm.store.CommonCodeExStore', {parentCode: "PRODUCT_TYPE"}),
    spCodeStore: Ext.create('Mplm.store.ClaastStorePD', {identification_code: "PRD_CLS_CODE", level1: 2}),
    sgCodeStore: Ext.create('Mplm.store.ClaastStorePD', {identification_code: "PRD_CLS_CODE", level1: 3}),
    combstStore: Ext.create('Mplm.store.CombstStore', {pageSize: 1000}),

    redrawStore: function (reset) {

        console_logs('redrawStore2 reset', reset);

        if (reset == true) {
            gm.me().getStore().getProxy().setExtraParam('start', 0);
            gm.me().getStore().getProxy().setExtraParam('page', 1);
            gm.me().getStore().getProxy().setExtraParam('limit', gMain.pageSize);
            gm.me().getStore().currentPage = 1;
        }

        var multisort = gu.getCmp('sortCond-multisort');
        var sortCond = multisort == null ? '' : multisort.getValue();
        gm.me().getStore().getProxy().setExtraParam('sortCond', sortCond);

        try {
            var store = gm.me().getStore();
            // Remove default sorting
            delete store.sorters;

            try {

                if (sortCond != null && sortCond != '') {

                    var sorters = [];
                    var arr = sortCond.split(':');
                    for (var i = 0; i < arr.length; i++) {

                        var cond = arr[i];
                        var arr1 = cond.split(' ');
                        sorters.push({
                            property: arr1[0],
                            direction: arr1[1]
                        })

                    }

                    store.setSorters(sorters);

                }
            } catch (e) {

            }

            for (var i = 0; i < this.searchField.length; i++) {
                var type = 'text';
                var key = this.searchField[i];
                if (typeof key == 'string') {

                } else if (typeof key == 'object') {
                    var myO = key;
                    key = myO['field_id'];
                    type = myO['type'];
                }

                var srchId = this.link + '-' + gMain.getSearchField(key);

                var value = null;
                var value1 = null;
                try {
                    var o = this.getSearchWidget(srchId);
                    if (o == null) {

                    } else {
                        value = o.getValue();
                    }

                    var o1 = this.getSearchWidget(srchId + '_')

                    if (o1 == null) {

                    } else {
                        value1 = o1.getValue();
                    }
                } catch (e) {

                }

                if (value1 != null && value1 != '') {//콤보박스 히든밸류
                    this.getStore().getProxy().setExtraParam(key, value1);
                } else {
                    if (key != null && key != '' && value != null && value.length > 0) {
                        if (type == 'area' || key == 'unique_id' || key == 'barcode' || typeof key == 'object') {
                            this.getStore().getProxy().setExtraParam(key, value);
                        } else {
                            var enValue = Ext.JSON.encode('%' + value + '%');
                            this.getStore().getProxy().setExtraParam(key, enValue);
                        }//endofelse

                    } else {//endofif
                        this.getStore().getProxy().setExtraParam(key, null);
                    }

                }
            }

            gm.me().storeLoad();

        } catch (e) {
            // Ext.MessageBox.show({
            //     title: '연결 종료',
            //     msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.<br>그래도 해결되지 않으면 관리자에게 문의하세요.<hr>' + e,
            //     buttons: Ext.MessageBox.OK,
            //     //animateTarget: btn,
            //     scope: this,
            //     icon: Ext.MessageBox['ERROR'],
            //     fn: function () {
            //
            //     }
            // });
        }

    },

    storeLoad: function() {

        var monthYear = this.store.getProxy().getExtraParams().monthYear;

        var sMonth = new Date().getMonth() + 1;
        var eYear = 0;
        var eMonth = 0;

        if (new Date().getMonth() > 0) {
            eYear = new Date().getFullYear() + 1;
            eMonth = new Date().getMonth();
            if (eMonth < 10) {
                eMonth = '0' + eMonth;
            }
        } else {
            eYear = new Date().getFullYear();
            eMonth = 12;
        }

        if (sMonth < 10) {
            sMonth = '0' + sMonth;
        }

        if (monthYear === undefined || monthYear === null) {
            monthYear = new Date().getFullYear() + '-' + sMonth + '-' + '01:'
                + eYear + '-' + eMonth + '-' + '31';
        }

        var monthYearTemp = monthYear.split('%').join('');
        monthYearTemp = monthYearTemp.split('"').join('');

        var monthYears = monthYearTemp.split(":");

        var sTemp = monthYears[0].split("-").join("");
        var eTemp = monthYears[1].split("-").join("");

        var sYearMonth = sTemp.substring(2, 6) * 1;
        var eYearMonth = eTemp.substring(2, 6) * 1;


        for (var i = this.columns.length; i >= 6; i--) {
            this.columns.pop();
        }


        for (var i = sYearMonth; i <= eYearMonth; i++) {

            var year = Math.floor(i / 100);
            var month = i - (Math.floor(i / 100) * 100);

            if (month < 1 || month > 12) {
                continue;
            }

            this.columns.push({
                text: year + '-' + (month > 9 ? month : '0' + month),
                dataIndex: 'calendar_' + year + '-' + (month > 9 ? month : '0' + month),
                width : 95,
                style: 'text-align:center',
                align:'right'
            });
        }

        this.grid.reconfigure(undefined, this.columns);

        this.store.load({
            callback: function(records, operation, success) {

                if (records !== null) {
                    for (var i = 0; i < records.length; i++) {

                        var rec = records[i];
                        var quan_val = rec.get('quan_val');
                        var sales_price_val = rec.get('sales_price_val');

                        var quan_vals = quan_val.split(',');
                        var sales_price_vals = sales_price_val.split(',');

                        var recUid = rec.get('unique_id_long');

                        for (var j = 0; j < records.length; j++) {

                            var storeUid = gm.me().store.getAt(j).get('unique_id_long');

                            if (recUid === storeUid) {
                                for (var k = 0; k < quan_vals.length; k++) {
                                    var quan_splits = quan_vals[k].split(':');
                                    var calVal = quan_splits[0];
                                    var quanVal = quan_splits[1];

                                    var sales_price_splits = sales_price_vals[k].split(':');
                                    var salesPriceVal = sales_price_splits[1];

                                    var totalSalesPrice = +(Number(quanVal) * Number(salesPriceVal)).toFixed(12);

                                    var calSplits = calVal.split('-');

                                    gm.me().store.getAt(j).set('calendar_' + calVal.substring(2, calVal.length + 1),
                                        '<font color="red"><b>' + gm.me().renderNumber(quanVal) + '</b></font>' +
                                        '</br><font color="black"><b>' + gm.me().renderNumber(totalSalesPrice) + '</b></font>');
                                }
                            }
                        }

                    }
                }
            }
        });
    },

    renderNumber: function(value) {

        if (value !== null && value > 0) {
            //value = +(Number(quanVal) * Number(salesPriceVal)).toFixed(12);
            return Ext.util.Format.number(value, '0,000.#####');
        } else {
            return 0;
        }
    },

    // numberWithCommas: function(x) {
    //     x = +(Number(x)).toFixed(12);
    //     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // },

    renderDecimal: function(value) {

        if (typeof value !== 'number') {

            var totalValueChars = value.split('');

            if (totalValueChars[totalValueChars.length - 1] === '.') {
                return value;
            }

            value = new Number(value);
        }

        value = value.toFixed(5);

        var totalValueChars = value.split('');
        var finalValue = '';
        for (var i = totalValueChars.length - 1; i > 0; i--) {
            if (totalValueChars[i] === '0') {
                continue;
            } else if (totalValueChars[i] === '.') {
                for (var j = 0; j < i; j++) {
                    finalValue += totalValueChars[j];
                }
                break;
            } else {
                for (var j = 0; j <= i; j++) {
                    finalValue += totalValueChars[j];
                }
                break;
            }
        }

        return renderNumber(finalValue);
    },

    popUpExcelHandler: function () {

        var checkboxItems = [];
        var myWidth = 600;
        var myHeight = 80;

        var store = gm.me().getStore();
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var unique_ids = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');
            unique_ids.push(uid);
        }

        store.getProxy().setExtraParam("srch_type", 'excelPrint');
        store.getProxy().setExtraParam("srch_fields", 'major');
        store.getProxy().setExtraParam("srch_rows", 'all');
        store.getProxy().setExtraParam("menuCode", gm.me().link);
        store.getProxy().setExtraParam("unique_ids", unique_ids);

        for (var i = 0; i < 4; i++) {

            if (i % 4 == 0) {
                myHeight += 30;
            }

            checkboxItems.push({
                xtype: 'checkbox',
                checked: gm.me().columns[i]['excel_set'] === 'Y' ? true : false,
                fieldLabel: gm.me().columns[i]['text'],
                name: gm.me().columns[i]['id'],
                margin: '5 20 0 5',
                allowBlank: false,
                codeName: gm.me().columns[i]['codeName'],
                stateId: gm.me().columns[i]['stateId'],
                listeners: {
                    change: function (checkbox, newVal, oldVal) {
                        for (var i = 0; i < gm.me().columns.length; i++) {
                            if(checkbox.name === gm.me().columns[i]['id']) {
                                gm.me().columns[i]['excel_set'] = newVal ? 'Y' : 'N';
                            }
                        }
                    }
                }
            });
        }

        try {
            Ext.each(arrField, function (fieldObj, index) {

                console_log(typeof fieldObj);

                var dataIndex = '';

                if (typeof fieldObj == 'string') { //text search
                    dataIndex = fieldObj;
                } else {
                    dataIndex = fieldObj['field_id'];
                }

                var srchId = gMain.getSearchField(dataIndex);
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

        var formPanel = Ext.create('Ext.form.Panel', {
            bodyPadding: 5,
            width: myWidth,
            vertical: false,
            layout: 'column',
            defaults: {
                anchor: '100%'
            },
            defaultType: 'textfield',
            items: checkboxItems

        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: gm.me().getMC('mes_sro5_pln_msg_excel', '엑셀을 출력할 항목을 선택하세요.'),
            width: myWidth,
            height: myHeight,
            items: formPanel,
            buttons: [
                {
                    text: CMD_OK,
                    scope: this,
                    handler: function () {

                        var formItems = formPanel.items.items;
                        var code_uids = [];
                        var system_codes = [];

                        for (var i = 0; i < formItems.length; i++) {
                            var formItem = formItems[i];

                            if (formItem['name'] === undefined) {
                                continue;
                            }

                            var formUidArr = formItem['name'].split('-');
                            var formUid = formUidArr[1];
                            if(formItem.checked) {
                                var system_code = formItem['codeName'];
                                var stateId = formItem['stateId'];
                                if(system_code !== undefined && system_code !== null) {
                                    system_codes.push(system_code + ':' + stateId);
                                }
                                code_uids.push(formUid);
                            }
                        }

                        store.getProxy().setExtraParam("code_uids", code_uids);
                        store.getProxy().setExtraParam("system_codes", system_codes);
                        prWin.setLoading(true);

                        var monthYear = this.store.getProxy().getExtraParams().monthYear;

                        var sMonth = new Date().getMonth() + 1;
                        var eYear = 0;
                        var eMonth = 0;

                        if (new Date().getMonth() > 0) {
                            eYear = new Date().getFullYear() + 1;
                            eMonth = new Date().getMonth();
                            if (eMonth < 10) {
                                eMonth = '0' + eMonth;
                            }
                        } else {
                            eYear = new Date().getFullYear();
                            eMonth = 12;
                        }

                        if (sMonth < 10) {
                            sMonth = '0' + sMonth;
                        }

                        if (monthYear === undefined || monthYear === null) {
                            monthYear = new Date().getFullYear() + '-' + sMonth + '-' + '01:'
                                + eYear + '-' + eMonth + '-' + '31';
                        }

                        var monthYearTemp = monthYear.split('%').join('');
                        monthYearTemp = monthYearTemp.split('"').join('');

                        var monthYears = monthYearTemp.split(":");

                        var sTemp = monthYears[0].split("-").join("");
                        var eTemp = monthYears[1].split("-").join("");

                        var sYearMonth = sTemp.substring(2, 6) * 1;
                        var eYearMonth = eTemp.substring(2, 6) * 1;


                        for (var i = this.columns.length; i >= 6; i--) {
                            this.columns.pop();
                        }


                        for (var i = sYearMonth; i <= eYearMonth; i++) {

                            var year = Math.floor(i / 100);
                            var month = i - (Math.floor(i / 100) * 100);

                            if (month < 1 || month > 12) {
                                continue;
                            }

                            this.columns.push({
                                text: year + '-' + (month > 9 ? month : '0' + month),
                                dataIndex: 'calendar_' + year + '-' + (month > 9 ? month : '0' + month),
                                width : 95,
                                style: 'text-align:center',
                                align:'right'
                            });
                        }

                        this.grid.reconfigure(undefined, this.columns);

                        this.store.load({
                            scope: this,
                            callback: function(records, operation, success) {

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/filedown.do?method=myExcelPath',
                                    params: {
                                        mc_codes: gUtil.getMcCodes()
                                    },
                                    success: function (response, request) {
                                        store.getProxy().setExtraParam("srch_type", null);
                                        var excelPath = response.responseText;
                                        if (excelPath != null && excelPath.length > 0) {
                                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                            top.location.href = url;

                                        } else {
                                            Ext.Msg.alert(gm.me().getMC('mes_header_warning', '경고'),
                                                gm.me().getMC('mes_sro5_pln_msg_excel_fail', '엑셀 파일을 다운로드 할 수 없습니다.'));
                                        }
                                        prWin.setLoading(false);

                                        if(prWin) {
                                            prWin.close();
                                        }
                                    }
                                });

                                if (records !== null) {
                                    for (var i = 0; i < records.length; i++) {

                                        var rec = records[i];
                                        var quan_val = rec.get('quan_val');
                                        var sales_price_val = rec.get('sales_price_val');

                                        var quan_vals = quan_val.split(',');
                                        var sales_price_vals = sales_price_val.split(',');

                                        var recUid = rec.get('unique_id_long');

                                        for (var j = 0; j < records.length; j++) {

                                            var storeUid = gm.me().store.getAt(j).get('unique_id_long');

                                            if (recUid === storeUid) {
                                                for (var k = 0; k < quan_vals.length; k++) {
                                                    var quan_splits = quan_vals[k].split(':');
                                                    var calVal = quan_splits[0];
                                                    var quanVal = quan_splits[1];

                                                    var sales_price_splits = sales_price_vals[k].split(':');
                                                    var salesPriceVal = sales_price_splits[1];

                                                    var totalSalesPrice = +(Number(quanVal) * Number(salesPriceVal)).toFixed(12);

                                                    var calSplits = calVal.split('-');

                                                    gm.me().store.getAt(j).set('calendar_' + calVal.substring(2, calVal.length + 1),
                                                        '<font color="red"><b>' + gm.me().renderNumber(quanVal) + '</b></font>' +
                                                        '</br><font color="black"><b>' + gm.me().renderNumber(totalSalesPrice) + '</b></font>');
                                                }
                                            }
                                        }

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

                        if(prWin) {
                            prWin.close();
                        }
                    }
                }
            ]
        });

        prWin.show();
    },

    createMsTab: function (title, tabname) {

        if (this.stores.length < 1) {
            this.stores.push(Ext.create('Ext.data.Store', {
                fields: ['name', 'size', 'file', 'status']
            }));
        }

        var sc = this.storecount/*++*/;

        var tabDataUpload = Ext.create('Ext.panel.Panel', {
            //title: title,
            tabPosition: 'bottom',
            plain: true,
            width: '100%',
            items: [
                {
                    xtype: 'form',
                    items: [
                        {
                            items: [{
                                multiSelect: true,
                                xtype: 'grid',
                                id: 'UploadGrid' + [sc],
                                selModel: Ext.create("Ext.selection.CheckboxModel"),
                                columns: [{
                                    header: gm.me().getMC('mes_sro5_pln_column_file_name', '파일명'),
                                    dataIndex: 'name',
                                    flex: 2
                                }, {
                                    header: gm.me().getMC('mes_sro5_pln_column_file_size', '파일크기'),
                                    dataIndex: 'size',
                                    flex: 1,
                                    renderer: Ext.util.Format.fileSize
                                }, {
                                    header: gm.me().getMC('mes_sro5_pln_column_status', '상태'),
                                    dataIndex: 'status',
                                    flex: 1,
                                    renderer: this.rendererStatus
                                }],
                                viewConfig: {
                                    emptyText: gm.me().getMC('mes_sro5_pln_msg_drag', '이곳에 파일을 끌어 놓으세요'),
                                    height: 700,
                                    deferEmptyText: false
                                },
                                store: this.stores[sc],

                                listeners: {

                                    drop: {
                                        element: 'el',
                                        fn: 'drop'
                                    },

                                    dragstart: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragenter: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragover: {
                                        element: 'el',
                                        fn: 'addDropZone'
                                    },

                                    dragleave: {
                                        element: 'el',
                                        fn: 'removeDropZone'
                                    },

                                    dragexit: {
                                        element: 'el',
                                        fn: 'removeDropZone'
                                    },

                                },

                                noop: function (e) {
                                    e.stopEvent();
                                },

                                addDropZone: function (e) {
                                    if (!e.browserEvent.dataTransfer || Ext.Array.from(e.browserEvent.dataTransfer.types).indexOf('Files') === -1) {
                                        return;
                                    }

                                    e.stopEvent();

                                    this.addCls('drag-over');
                                },

                                removeDropZone: function (e) {
                                    var el = e.getTarget(),
                                        thisEl = this.getEl();

                                    e.stopEvent();


                                    if (el === thisEl.dom) {
                                        this.removeCls('drag-over');
                                        return;
                                    }

                                    while (el !== thisEl.dom && el && el.parentNode) {
                                        el = el.parentNode;
                                    }

                                    if (el !== thisEl.dom) {
                                        this.removeCls('drag-over');
                                    }

                                },

                                drop: function (e) {

                                    e.stopEvent();
                                    Ext.Array.forEach(Ext.Array.from(e.browserEvent.dataTransfer.files), function (file) {
                                        gm.me().stores[0].add({
                                            file: file,
                                            name: file.name,
                                            size: file.size,
                                            status: '대기'

                                        });
                                    });
                                    this.removeCls('drag-over');
                                },

                                tbar: [{
                                    text: gm.me().getMC('mes_sro5_pln_btn_upload', '업로드'),
                                    handler: function () {

                                        var l_store = gm.me().stores[0];

                                        for (var i = 0; i < l_store.data.items.length; i++) {
                                            if (!(l_store.getData().getAt(i).data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                                                l_store.getData().getAt(i).data.status = gm.me().getMC('mes_sro5_pln_btn_uploading', '업로드중');
                                                l_store.getData().getAt(i).commit();
                                                gm.me().postDocument(CONTEXT_PATH + '/sales/buyer.do?method=uploadSalesPlan&file_itemcode=' + gUtil.RandomString(10),
                                                    l_store, i, tabname);
                                            }
                                        }

                                    }
                                }, {
                                    text: gm.me().getMC('mes_sro5_pln_btn_remove_all', '전체삭제'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
                                        l_store.reload();
                                    }
                                }, /*{
                                 text: "업로드 한 파일 삭제",
                                 handler: function () {

                                 var l_store = gm.me().stores[0];

                                 for (var i = 0; i < l_store.data.items.length; i++) {
                                 var record = l_store.getData().getAt(i);
                                 if ((record.data.status === '완료')) {
                                 l_store.remove(record);
                                 i--;
                                 }
                                 }
                                 }
                                 }, */{
                                    text: gm.me().getMC('mes_sro5_pln_btn_remove_optionally', '선택삭제'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];

                                        l_store.remove(Ext.getCmp('UploadGrid0').getSelection());
                                    }
                                }]
                            }],
                        }
                    ]
                }
            ]
        });

        return tabDataUpload;
    },

    postDocument: function (url, store, i, tabname) {

        var xhr = new XMLHttpRequest();
        xhr.timeout = 30000; // time in milliseconds
        var fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('upload_type', /*gu.getCmp('measureType').lastValue.radio1*/'SALES_PLAN');
        //fd.append('product_type', 'BW');

        xhr.setRequestHeader("serverTimeDiff", 0);
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {
                //handle the answer, in order to detect any server side error

                //Ext.decode(xhr.responseText).success);

                if (xhr.responseText.length > 1) {
                    if (store.getData().getAt(i) !== undefined) {
                        store.getData().getAt(i).data.status = gm.me().getMC('sro1_completeAction', '완료');
                    }

                    for (var j = 0; j < store.data.items.length; j++) {
                        var record = store.getData().getAt(j);
                        if ((record.data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                            store.remove(record);
                            j--;
                        }
                    }

                } else {
                    store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                }
                //store.getData().getAt(i).commit();
                var data = Ext.util.JSON.decode(xhr.responseText).datas;


            } else if (xhr.readyState == 4 && (xhr.status == 404 || xhr.status == 500)) {
                store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                store.getData().getAt(i).commit();
            } else {
                for (var j = 0; j < store.data.items.length; j++) {
                    var record = store.getData().getAt(j);
                    //if ((record.data.status === '완료')) {
                    store.remove(record);
                    j--;
                    //}
                }

                if (store.data.items.length == 0 && gu.getCmp('uploadPrWin') != undefined) {
                    gu.getCmp('uploadPrWin').close();
                    gm.me().showToast(gm.me().getMC('mes_sro5_pln_header_reflection', '반영중'),
                        gm.me().getMC('mes_sro5_pln_msg_reflection', '데이터를 반영 중입니다. 잠시 후 새로고침 하시기 바랍니다.'));
                }
            }

            //gm.me().storeLoad();
        };
        // Initiate a multipart/form-data upload
        xhr.send(fd);
    },
    stores: [],
    ingredientList: [],
    storecount: 0,
   // gridContent2: null,
    fields: []
});