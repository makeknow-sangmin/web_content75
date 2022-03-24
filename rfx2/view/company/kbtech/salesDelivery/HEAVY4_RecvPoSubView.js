//수주등록된 전체 제품 메뉴
Ext.define('Rfx2.view.company.kbtech.salesDelivery.HEAVY4_RecvPoSubView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'receved-mgmt-view',
    vFILE_ITEM_CODE: null,
    inputBuyer: null,
    currentTab: null,
    selected_rec: null,
    form : Ext.create('Ext.form.Panel', {
        id: gu.id('formPanel'),
        xtype: 'form',
        frame: false,
        border: false,
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
                title: '입력',
                collapsible: true,
                defaults: {
                    labelWidth: 70,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items: [
                    {
                        xtype: 'radiogroup',
                        fieldLabel: '출력방법',
                        columns: 2,
                        margin: '3 3 3 3',
                        vertical: true,
                        hidden: true,
                        items: [
                            {boxLabel: '묶음출력', name: 'is_auto', inputValue: '1'/*, checked: true*/},
                            {boxLabel: '낱개출력', name: 'is_auto', inputValue: '2', checked: true}
                        ]
                    },
                    {
                        xtype: 'numberfield',
                        id: gu.id('print_qty'),
                        name: 'print_qty',
                        fieldLabel: '출력매수',
                        margin: '3 3 3 3',
                        width: 350,
                        allowBlank: false,
                        value: 1
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('customerName'),
                        name: 'customerName',
                        fieldLabel: '고객사',
                        margin: '3 3 3 3',
                        width: 350,
                        value: '',
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(form, e) {
                                gm.me().getBarcodeHtml();
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('reservedVarchar5'),
                        name: 'reservedVarchar5',
                        fieldLabel: '현장명',
                        margin: '3 3 3 3',
                        width: 350,
                        value: '',
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(form, e) {
                                gm.me().getBarcodeHtml();
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('reservedVarchar9'),
                        name: 'reservedVarchar9',
                        fieldLabel: '라벨명',
                        margin: '3 3 3 3',
                        width: 350,
                        value: '',
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(form, e) {
                                gm.me().getBarcodeHtml();
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('reservedVarchar6'),
                        name: 'reservedVarchar6',
                        fieldLabel: 'LOT 번호',
                        margin: '3 3 3 3',
                        width: 350,
                        value: '',
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(form, e) {
                                gm.me().getBarcodeHtml();
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('reservedVarcharb'),
                        name: 'reservedVarcharb',
                        fieldLabel: '입력',
                        margin: '3 3 3 3',
                        width: 350,
                        value: '',
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(form, e) {
                                gm.me().getBarcodeHtml();
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('reservedVarchare'),
                        name: 'reservedVarchare',
                        fieldLabel: '접지',
                        margin: '3 3 3 3',
                        width: 350,
                        value: '',
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(form, e) {
                                gm.me().getBarcodeHtml();
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('reservedVarchard'),
                        name: 'reservedVarchard',
                        fieldLabel: '출력',
                        margin: '3 3 3 3',
                        width: 350,
                        value: '',
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(form, e) {
                                gm.me().getBarcodeHtml();
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('quan'),
                        name: 'quan',
                        fieldLabel: '수량입력란',
                        margin: '3 3 3 3',
                        width: 350,
                        value: '',
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(form, e) {
                                gm.me().getBarcodeHtml();
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('reservedVarcharg'),
                        name: 'reservedVarcharg',
                        fieldLabel: ''/*spCode == 'KB' ? '품번' : 'LED-채널'*/,
                        margin: '3 3 3 3',
                        width: 350,
                        value: ''/*spCode == 'KB' ? '[' + itemCode + ']' : '[LED' + reservedVarcharg + '-' + reservedVarcharh.trim() + ']'*/,
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(form, e) {
                                gm.me().getBarcodeHtml();
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('reservedVarchari'),
                        name: 'reservedVarchari',
                        fieldLabel: '실수주품명',
                        margin: '3 3 3 3',
                        width: 350,
                        value: ''/*spCode == 'KB' ? '' : reservedVarchari*/,
                        hidden: /*spCode == 'KB' ? true :*/ false,
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(form, e) {
                                gm.me().getBarcodeHtml();
                            }
                        }
                    },
                    {
                        xtype: 'numberfield',
                        id: gu.id('projectNumber7'),
                        name: 'projectNumber7',
                        fieldLabel: '포장단위',
                        margin: '3 3 3 3',
                        width: 350,
                        allowBlank: false,
                        value: '',
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(form, e) {
                                gm.me().getBarcodeHtml();
                            }
                        }
                    },
                ]
            },
            {
                xtype: 'fieldset',
                title: '미리보기',
                collapsible: true,
                defaults: {
                    labelWidth: 60,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items: [
                    {
                        xtype: 'component',
                        id: gu.id('barcodeHtml'),
                        width: 380,
                        height: 190,
                        html: ''
                    },
                ]
            }
        ]

    }),//Panel end...
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        gUtil.setDistinctFilters(this.link, ['pj_name', 'specification', 'pj_code']);
        //console_logs('gUtil.getDistinctFilters(this.link)', gUtil.getDistinctFilters(this.link));

        this.setDefValue('regist_date', new Date());
        //삭제할때 사용할 필드 이름.
        this.setDeleteFieldName('unique_uid');

        var next7 = gUtil.getNextday(7);
        this.setDefValue('delivery_plan', next7);

        this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
        this.setDefComboValue('pj_type', 'valueField', 'P');
        this.setDefComboValue('newmodcont', 'valueField', 'N');
        this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');

        //검색툴바 필드 초기화
        this.initSearchField();

        var useMultitoolbar = false;

        this.addSearchField({
            type: 'dateRange',
            field_id: 'aprv_date',
            text: "작업지시일",
            labelWidth: 60,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        this.addSearchField('po_no');
        this.addSearchField('item_code');
        this.addSearchField('item_name');

        //Function Callback 정의
        //redirect
        this.refreshActiveCrudPanel = function (source, selectOn, unique_id, record) {
            if (selectOn == true) {
                this.propertyPane.setSource(source); // Now load data
                this.selectedUid = unique_id;
                gUtil.enable(this.removeAction);
                gUtil.enable(this.editAction);
                gUtil.enable(this.copyAction);
                gUtil.enable(this.viewAction);
                //gUtil.disable(this.registAction);

            } else {//not selected
                this.propertyPane.setSource(source);
                this.selectedUid = '-1';
                gUtil.disable(this.removeAction);
                gUtil.disable(this.editAction);
                gUtil.disable(this.copyAction);
                gUtil.disable(this.viewAction);
                gUtil.enable(this.registAction);
                this.crudTab.collapse();
            }

            //console_logs('this.crudMode', this.crudMode);
            this.setActiveCrudPanel(this.crudMode);
        };

        this.createStoreSimple({
            modelClass: 'Rfx.model.HEAVY4RecvPoSubViewModel',
            pageSize: 100,//gMain.pageSize,
            sorters: [{
                property: 'assymap.unique_id',
                direction: 'DESC'
            }],
            byReplacer: {
                'state_name': 'rtgast.state',
            }

        }, {});


        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                /*'REGIST',*/'COPY'
            ]
        });

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        //arr.push(dateToolbar);

        //검색툴바 생성
        if (useMultitoolbar == true) {
            var multiToolbar = null;

            this.createMultiSearchToolbar({first: 9, length: 11});

            console_logs('multiToolbar', multiToolbar);
            for (var i = 0; i < multiToolbar.length; i++) {
                arr.push(multiToolbar[i]);
            }
        } else {
            var searchToolbar = this.createSearchToolbar();
            arr.push(searchToolbar);
        }

        console_logs('arr', arr);

        this.setRowClass(function (record, index) {

            var c = record.get('state');

            switch (c) {
                case 'Y':
                    return 'orange-row';
                    break;
                default:
                    break;
            }
        });

        //grid 생성.
        for (var i = 0; i < this.columns.length; i++) {

            var o = this.columns[i];
            var dataIndex = o['dataIndex'];

            switch (dataIndex) {
                case 'mass':
                case 'reserved_double1':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        value = Ext.util.Format.number(value, '0,00.000/i');

                        value = '<div  style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">' + value + '(KG)</font></div>'
                        return value;
                    };
                    break;
                case 'quan':
                case 'bm_quan':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">' + value + '</font></div>'
                        return value;
                    };
                    break;
                default:
            }
        }//endoffor

        var processList = null;

        if (gUtil.checkUsePcstpl() == true) {
            processList = gUtil.mesTplProcessBig;
            console_logs('processList', processList);
        } else {
            processList = [];
            var pcs_length = gUtil.mesStdProcess.length;

            for (var i = 0; i < gUtil.mesStdProcess.length; i++) {
                var o = gUtil.mesStdProcess[i];
                console_logs('processList', o);
                if (o['parent'] == o['code']) {
                    var o1 = {
                        pcsTemplate: o['code'],
                        code: o['code'],
                        process_price: 0,
                        name: o['name']
                    };
                    console_logs('o1', o1);
                    processList.push(o1);
                }
            }

        }

        this.tab_info = [];
        var start = 0;
        var process_length = processList.length;

        for (var i = start; i < process_length; i++) {
            var o = processList[i];
            var code = o['code'];
            var name = o['name'];
            var title = name;
            var a = this.createPcsToobars(code);
            console_logs('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>buttonToolbar', a);
            this.tab_info.push({
                code: code,
                name: name,
                title: title,
                toolbars: [a]
            });
        }

        var ti = this.tab_info;
        for (var i = 0; i < ti.length; i++) {
            console_logs('vCompanyReserved4>>>>>>>>>>>>>>>>>>>>>>>', vCompanyReserved4);
            var tab = ti[i];
            var tab_code = tab['code'];
            var temp_code = '';
            console_logs('this.tab', tab);
            console_logs('this.columns_map', this.columns_map);
            var myColumn = this.columns_map[tab_code];
            var myField = this.fields_map[tab_code];
            var pos = tab_code == 'STL' ? 6 : 5;
            this.addExtraColumnBypcscode(myColumn, myField, tab_code, temp_code, 'end_date', true, pos);
        }

        this.createGrid();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4) {
                buttonToolbar.items.remove(item);
            }
        });

        this.properInputAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '속성 입력',
            tooltip: '속성 입력',
            disabled: true,
            handler: function () {
                gm.me().attributeInput();
            }
        });

        this.processInputAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '바코드로 처리',
            tooltip: '바코드로 처리',
            disabled: false,
            handler: function () {
                gm.me().processInput();
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

        // 입고전표
        this.printStockedStatementAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '입고전표',
            tooltip: '입고전표를 출력합니다',
            handler: function () {

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
                            title: '입고 한 날짜를 입력하시기 바랍니다.',
                            items: [
                                {
                                    xtype: 'datefield',
                                    id: gu.id('in_date'),
                                    anchor: '97%',
                                    name: 'in_date',
                                    value: new Date(),
                                    fieldLabel: '입고날짜'
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '입고전표',
                    width: 450,
                    height: 180,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/pdf.do?method=printSs',
                                    params:{
                                        in_date: gu.getCmp('in_date').getValue()
                                    },
                                    reader: {
                                        pdfPath: 'pdfPath'
                                    },
                                    success : function(result, request) {
                                        var jsonData = Ext.JSON.decode(result.responseText);
                                        var pdfPath = jsonData.pdfPath;
                                        console_log(pdfPath);
                                        if(pdfPath.length > 0) {
                                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                                            top.location.href=url;
                                        }
                                        prWin.close();
                                    },
                                    failure: function (result, request) {
                                        Ext.Msg.alert('오류', '입고전표를 출력 할 수 없습니다.');
                                        prWin.close();
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

        // 바코드 출력
        this.printBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '바코드 출력',
            tooltip: '제품의 바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gm.me().printBarcode();
            }
        });

        this.inAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Wearing','입고'),
            tooltip: '입고',
            disabled: false,
            handler: function () {

                var selections = currentTab.getSelectionModel().getSelection();

                if (selections.length === 0) {
                    Ext.Msg.alert('', 'LOT를 선택 하시기 바랍니다.');
                    return;
                } else if (selections.length > 1) {
                    Ext.Msg.alert('', '한번에 하나의 LOT만 지정 가능합니다.');
                    return;
                }

                var selection = selections[0];

                var ngr_quan = selection.get('ngr_quan');

                if (ngr_quan > 0) {
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
                                title: '입고 수량과 날짜를 정확히 입력하시기 바랍니다.',
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        id: gu.id('gr_quan'),
                                        anchor: '97%',
                                        name: 'gr_quan',
                                        value: selection.get('ngr_quan'),
                                        fieldLabel: '금번 입고수량'
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: gu.id('goods_in_date'),
                                        anchor: '97%',
                                        name: 'goods_in_date',
                                        value: new Date(),
                                        fieldLabel: '금번 입고날짜'
                                    }
                                ]
                            }
                        ]
                    });

                    var prWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: '제품입고',
                        width: 450,
                        height: 210,
                        items: form,
                        buttons: [
                            {
                                text: CMD_OK,
                                scope: this,
                                handler: function () {
                                    //첫번째만 갖고 와야 한다.
                                    //var selection = selected_rec[0];

                                    var gr_quan = selection.get('gr_quan');
                                    var pr_quan = selection.get('pr_quan');
                                    var ngr_quan = selection.get('ngr_quan');
                                    var cur_gr_quan = gu.getCmp('gr_quan').getValue();
                                    var goods_in_date = gu.getCmp('goods_in_date').getValue();

                                    var cartmap_uid = selection.get('coord_key3');

                                    if (cur_gr_quan > ngr_quan) {
                                        Ext.Msg.alert('', '입력 수량이 미입고 수량보다 더 많습니다.');
                                    } else {

                                        var params = {
                                            'cartmap_uid': cartmap_uid,
                                            'gr_quan': cur_gr_quan,
                                            'goods_in_date': goods_in_date
                                        };
                                        
                                        if(cur_gr_quan == ngr_quan) {
                                            params['cart_status'] = 'Y';
                                        }


                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/index/process.do?method=warehouseProduct',
                                            params: params,
                                            success: function (val, action) {
                                                if (prWin) {
                                                    prWin.close();
                                                }
                                                gm.me().getStore().load();
                                            },
                                            failure: function (val, action) {
                                                if (prWin) {
                                                    prWin.close();
                                                }
                                            }
                                        });
                                    }
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
                    Ext.Msg.alert('', '제품이 모두 입고 되어 있습니다.');
                }
            }
        });

        this.produceWhouseAction = Ext.create('Ext.Action', {
            iconCls: 'af-excel',
            text: '생산일보',
            tooltip: '생산일보',
            disabled: false,
            handler: function () {

                var today = new Date();

                gm.me().produceExcel = Ext.create('Ext.form.Panel', {
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
                            title: '생산일보의 기준 날짜을 선택하시기 바랍니다.',
                            items: [
                                {
                                    fieldLabel: '기준날짜',
                                    id: gu.id('sDate'),
                                    xtype: 'datefield',
                                    anchor: '95%',
                                    value: today,
                                    name: 'sDate',
                                    format: 'Y-m-d',
                                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '생산일보',
                    width: 450,
                    height: 180,
                    items: gm.me().produceExcel,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {

                                var form = gm.me().produceExcel.getForm();
                                var sDate = gu.getCmp('sDate').getValue();

                                var todayWeek = sDate.getDay();
                                sDate.setDate(sDate.getDate() - (sDate.getDay() - 1));

                                var sDateDay = sDate.getDay();

                                prWin.setLoading(true);
                                var eDate = new Date(sDate.valueOf());

                                eDate.setDate(eDate.getDate() + 5);

                                sDate = gm.me().formatDate(sDate);
                                eDate = gm.me().formatDate(eDate);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=printProduceWhouseExcel',
                                    params: {
                                        sDate: sDate,
                                        eDate: eDate
                                    },
                                    success: function (result, request) {
                                        var jsonData = Ext.JSON.decode(result.responseText);
                                        var excelPath = jsonData.excelPath;
                                        var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                                        top.location.href = url;
                                        prWin.close();
                                    },//Ajax success
                                    failure: function (result, request) {
                                        Ext.Msg.alert('오류', '생산일보를 출력 할 수 없습니다.');
                                        prWin.close();
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

        //buttonToolbar.insert(6, this.printBarcodeAction);
        buttonToolbar.insert(1, this.printStockedStatementAction);
        buttonToolbar.insert(1, this.inputBarcodeAction);
        buttonToolbar.insert(1, this.produceWhouseAction);
        buttonToolbar.insert(1, this.inAction);
        buttonToolbar.insert(5, '->');

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            selected_rec = selections;
            console_logs('selections', selections);
            console_logs('gm.me().selected_tab', gm.me().selected_tab);
            console_logs('info...	', gm.me().tab_info);

            var code = gm.me().selected_tab;

            if (code != undefined) {
                gm.me().tab_selections[code] = selections;
            }

            var quan = 0;
            for (var i = 0; i < selections.length; i++) {
                quan += selections[i].get('bm_quan');
            }

            this.buttonToolbar3.items.items[1].update('총 선택 : ' + selections.length + ' / 총 수량 : ' + quan);

            var toolbar = null;
            var items = null;
            if (code != undefined) {
                var infos = gm.me().tab_info;
                console_logs('infos', infos);
                if (infos != null) {
                    for (var i = 0; i < infos.length; i++) {
                        var o = infos[i];
                        if (o['code'] == code) {
                            var toolbars = o['toolbars'];
                            switch (vCompanyReserved4) {
                                case 'KBTC01KR':
                                    toolbar = toolbars[1];
                                    break;
                                default:
                                    toolbar = toolbars[0];
                            }

                            items = toolbar.items.items;
                        }

                    }
                }

            }

            console_logs('toolbar', toolbar);
            console_logs('toolbar items', items);

            if (selections.length) {

                var rec = selections[0];

                gUtil.enable(gm.me().removeAction);
                gUtil.enable(gm.me().editAction);
                gUtil.enable(gm.me().properInputAction);
                gUtil.enable(gm.me().printBarcodeAction);

                gUtil.enable(gm.me().moldidAction);
                gUtil.enable(gm.me().minLotAction);

                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                gm.me().vSELECTED_PJ_CODE = rec.get('pj_code');
                gm.me().vSELECTED_PJ_CODE = gUtil.stripHighlight(gm.me().vSELECTED_PJ_CODE);
                var ac_uid = gm.me().vSELECTED_AC_UID;
                gm.me().pj_code = gm.me().vSELECTED_PJ_CODE + "-";

                if (items != null) {
                    for (var i = 0; i < items.length; i++) {
                        gUtil.enable(items[i]);
                    }
                }

                //console_logs('activite', gm.me().vSELECTED_ACTIVITY);

            } else {
                gUtil.disable(gm.me().removeAction);
                gUtil.disable(gm.me().editAction);
                gUtil.disable(gm.me().properInputAction);
                gUtil.disable(gm.me().moldidAction);
                gUtil.disable(gm.me().minLotAction);
                gUtil.disable(gm.me().printBarcodeAction);

                if (items != null) {
                    for (var i = 0; i < items.length; i++) {
                        gUtil.disable(items[i]);
                    }
                }
            }

        });


        this.createCrudTab();


        console_logs('tab_info', this.tab_info);

        //Tab을 만들지 않는 경우.
        if (this.tab_info.length == 0) {

            Ext.apply(this, {
                layout: 'border',
                items: [this.grid, this.crudTab]
            });
            this.callParent(arguments);
            //디폴트 로드
            gMain.setCenterLoading(true);
            this.grid.store.getProxy().setExtraParam('orderBy', 'unique_id');
            this.grid.store.getProxy().setExtraParam('ascDesc', 'ASC');
            this.storeLoad(function (records) {
                console_logs('디폴트 데이터', main);
                for (var i = 0; i < records.length; i++) {
                    var specunit = records[i].get('specification');
                    gm.me().spec.push(specunit);

                }
            });

        } else { //Tab그리드를 사용하는 경우.

            this.grid.setTitle('전체');

            var items = [];

            items.push(this.grid);

            var tab = this.createTabGrid('Rfx.model.HEAVY4RecvPoSubViewModel', items, 'big_pcs_code', arr, function (curTab, prevtab) {

                currentTab = curTab;

                var multi_grid_id = curTab.multi_grid_id;
                gm.me().multi_grid_id = multi_grid_id;

                console_logs('multi_grid_id: ', curTab);
                console_logs('multi_grid_id: ', multi_grid_id);

                if (multi_grid_id == undefined) { //Main grid

                    gm.me().store.getProxy().setExtraParam('start', 0);
                    gm.me().store.getProxy().setExtraParam('page', 1);

                    switch (vCompanyReserved4) {
                        case 'KBTC01KR':
                            gm.me().store.getProxy().setExtraParam('recv_flag', 'GE');
                            gm.me().store.getProxy().setExtraParam('big_pcs_code', null);
                            gm.me().store.getProxy().setExtraParam('js_pcs_code', null);
                            break;
                        default:
                            break;
                    }
                    gm.me().storeLoad();
                } else {//추가 탭그리드
                    var store = gm.me().store_map[multi_grid_id];
                    store.getProxy().setExtraParam('big_pcs_code', multi_grid_id);
                    store.getProxy().setExtraParam('status', null);
                    gm.me().store.getProxy().setExtraParam('start', 0);
                    gm.me().store.getProxy().setExtraParam('page', 1);

                    switch (multi_grid_id) {
                        case 'STL':
                            gm.me().store.getProxy().setExtraParam('big_pcs_code', null);
                            break;
                        default:
                            break;
                    }

                    gm.me().storeLoad();
                }

            });


            //모든 스토어에 디폴트 조건
            Ext.apply(this, {
                layout: 'border',
                items: [tab, this.crudTab]
            });

            this.callParent(arguments);
            //디폴트 로드
            gMain.setCenterLoading(false);
        }

    },


    selectPcsRecord: null,
    items: [],
    potype: 'PRD',
    pj_code: null,
    spec: [],

    processInput: function () {
        var form = null;
        form = Ext.create('Ext.form.Panel', {
            id: gu.id(gu.id('formPanel')),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                margins: 10,
            },
            items: [{
                xtype: 'fieldset',
                title: '입력',
                margin: '3',

                defaults: {
                    anchor: '100%',
                },
                items: [{
                    xtype: 'container',

                    layout: 'hbox',
                    defaults: {
                        //margin: '5'
                        margin: '0, 3, 3, 0,'

                    },

                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        items: [{
                            xtype: 'textarea',
                            width: 250,
                            height: 300,
                            name: 'barcodes',
                            fieldLabel: '바코드번호'
                        }]
                    },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [{
                                id: 'process_name',
                                width: 300,
                                xtype: 'radiogroup',
                                fieldLabel: '공정선택',
                                // Arrange radio buttons into three columns, distributed vertically
                                columns: 1,
                                vertical: true,
                                items: [
                                    {boxLabel: '제작', name: 'pcs_code', inputValue: 'PRD'},
                                    {boxLabel: '도금', name: 'pcs_code', inputValue: 'GLT'},
                                    {boxLabel: '도장', name: 'pcs_code', inputValue: 'PNT'},
                                ]
                            }
                            ]

                        }]
                }]
            }
            ]


        });//Panel end...
        prwin = gm.me().prwinbarcodeopen(form);
    },

    attributeInput: function () {

        var tab_code = gm.me().multi_grid_id;


        var fields = (tab_code == undefined) ? this.fields : this.fields_map[tab_code];

        var oItems = [];

        var line = 0;
        var arr = null;
        for (var i = 0; i < fields.length; i++) {
            var o = fields[i];
            if (o['canEdit'] == true) {
                console_logs('fields o', o);
                if (line % 3 == 0) {
                    if (o1 != null) {
                        oItems.push(arr);
                    }
                    arr = [];

                }
                var xtype = null;
                switch (o['type']) {
                    case 'sdate':
                    case 'date':
                        xtype = 'datefield';
                        break;
                    case 'number':
                    case 'digit':
                    case 'integer':
                        xtype = 'numberfield';
                        break;
                    default:
                        xtype = 'textfield';

                }
                var o1 = {

                    xtype: xtype,
                    width: 250,
                    name: o['name'],
                    fieldLabel: o['text']
                };
                switch (o['type']) {
                    case 'sdate':
                    case 'date':
                        o1['value'] = '';
                        break;
                    default:

                }

                arr.push(o1);

                line++;
            }
        }
        if (o1 != null) {
            oItems.push(o1);
        }
        console_logs('oItems', oItems);

        var items = [];
        for (var i = 0; i < oItems.length; i++) {
            items.push(
                {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        margin: '0, 5, 5, 0,',
                        items: oItems[i]
                    },
                    items: oItems[i]
                });

        }
        console_logs('items', items);

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id(gu.id('formPanel')),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                margins: 10,
            },
            items: items

        });//Panel end...
        prwin = gm.me().prwinopen(form);

    },

    getPcsRadio: function () {

        var arr = [];

        var n = 0;
        console_logs('================= START =============', arr);

        for (var i = 0; i < gUtil.mesTplProcessBig.length; i++) {
            var o = gUtil.mesTplProcessBig[i];
            console_logs('o', o);

            var pcsCode = o['code'];
            var pcsTemplate = o['pcsTemplate'];
            console_logs('pcsTemplate=', pcsTemplate);
            console_logs('pcsCode=', pcsCode);
            var o1 = gUtil.mesTplProcessAll;
            console_logs('o1=', o1);
            var subArr = o1[pcsCode];
            console_logs('subArr=', subArr);

            var big_pcs_code = 'SPL';

            console_logs('===+this.multi_grid_id', this.multi_grid_id);

            console_logs('===+big_pcs_code', big_pcs_code);

            console_logs('===+pcsTemplate', pcsTemplate);
            if (pcsTemplate == big_pcs_code) {
                var pcsnames = ''
                for (j = 0; j < subArr.length; j++) {
                    var o2 = subArr[j];

                    if (pcsnames != '') {
                        pcsnames = pcsnames + ' -> ';
                    }
                    pcsnames = pcsnames + o2['name'];
                }
                arr.push({

                    inputValue: o['code'],
                    boxLabel: o['name'] + '  (' + pcsnames + ')',
                    name: 'big_pcs_code',
                    checked: (n == 0) ? true : false,

                    listeners: {
                        change: function (radiogroup, radio, checked) {
                            Ext.MessageBox.alert('click', checked);
                        }
                    }
                });
                n++;
            }
        }
        console_logs('================= END =============', arr);
        return arr;
    },

    prwinopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '정보 수정',
            plain: true,
            items: form,
            margin: 5,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    var form = gu.getCmp(gu.id('formPanel')).getForm();
                    var srcahd_uids = [];
                    //var selections = gm.me().grid.getSelectionModel().getSelection();
                    selections = selected_rec;
                    console_logs('=====>selections', selections);
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('itemdetail_uid');
                        console_logs('=====>uid', uid);
                        srcahd_uids.push(uid);
                    }
                    form.submit({
                        url: CONTEXT_PATH + '/index/process.do?method=updateItemdetail',
                        params: {
                            srcahduids: srcahd_uids
                        },
                        success: function (val, action) {
                            prWin.close();
                            gm.me().storeLoad(function (records) {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                        }
                    });


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
    },

    prwinbarcodeopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드로 처리',
            plain: true,
            items: form,
            margin: 5,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    var form = gu.getCmp(gu.id('formPanel')).getForm();
                    form.submit({
                        url: CONTEXT_PATH + '/index/process.do?method=updateProcessWork',
                        /* params:{
                         srcahduids: srcahd_uids
                         },*/
                        success: function (val, action) {
                            prWin.close();
                            gm.me().storeLoad(function (records) {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                        }
                    });


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
    },

    specConfirm: function () {

        var form = null;
        form = Ext.create('Ext.form.Panel', {
            id: 'formPanel-spec',
            xtype: 'form',
            bodyPadding: '3 3 0',
            region: 'center',
            items: [
                {
                    xtype: 'textareafield',
                    width: 300,
                    height: 300,
                    value: gm.me().spec
                }
            ]
        });

        this.specwinopen(form);

    },

    extoutJson: function (multi_grid_id, records, fname) {

        if (records == null || records.length == 0) {
            return;
        }

        var big_pcs_code = multi_grid_id == undefined ? 'SSP' : multi_grid_id;

        var smallPcs = gUtil.mesTplProcessAll[big_pcs_code];

        var column_name = ['end_date', 'step_uid'];

        for (var k = 0; k < 2; k++) {

            fname = column_name[k];

            if (smallPcs != null && smallPcs.length > 0) {
                for (var j = 0; j < smallPcs.length; j++) {
                    var o1 = smallPcs[j];
                    var pcsCode = o1['code'];


                    for (var i = 0; i < records.length; i++) {
                        var o = records[i];
                        o.set(pcsCode + '|' + fname, null);
                    }

                }
            }

            for (var i = 0; i < records.length; i++) {
                var o = records[i];
                o.set('update_pcsstep_and_work', 'FULL_MAKE');//공정처리
                var js_fname = o.get('js_' + fname);

                for (var key in js_fname) {
                    //console_logs('key', key);
                    var arr = js_fname[key];
                    if (arr instanceof Array) {
                        o.set(key + '|' + fname, arr[0]);
                    } else {
                        o.set(key + '|' + fname, arr);
                    }
                }
            }
        }

    },
    addExtraColumnBypcscode: function (myColumn, myField, big_pcs_code, temp_code, step_field, editable, pos) {
        console_logs('big_pcs_code', big_pcs_code);
        console_logs('myColumn', myColumn);
        console_logs('myField', myField);

        var columnGroup = [];

        var smallPcs = gUtil.mesTplProcessAll[big_pcs_code];
        if (smallPcs == undefined || smallPcs.length == 0) {
            return;
        }
        console_logs('smallPcs', smallPcs);
        //복사대상
        var c = myColumn[0];
        var f = myField[0];

        for (var j = 0; j < smallPcs.length; j++) {
            var o = smallPcs[j];

            var new_c = {};
            for (var key in c) {
                switch (key) {
                    case 'dataIndex':
                        new_c[key] = o['code'] + '|' + step_field;
                        break;
                    case 'text':
                        new_c[key] = o['name'];
                        break;
                    default:
                        new_c[key] = c[key];

                }
            }
            var new_f = {};
            console_logs('smallPcs o', o);
            for (var key in f) {
                switch (key) {
                    case 'text':
                        new_f[key] = o['name'];
                        break;
                    case 'name':
                        new_f[key] = o['code'] + '|' + step_field;
                        break;
                    default:
                        new_f[key] = f[key];

                }
            }
            new_c['canEdit'] = editable;
            new_c['dataType'] = 'sdate';
            new_c['important'] = true;
            new_c['id'] = 'uid-' + Math.floor((Math.random() * 10000000000) + 1);
            new_f['tableName'] = 'pcsstep';
            new_f['type'] = 'date';
            new_f['useYn'] = 'Y';

            console_logs('-----------new_c', new_c);
            console_logs('--------------new_f', new_f);

            myColumn.splice(pos + j, 0, new_c);
            myField.splice(pos + j, 0, new_f);

        }
        console_logs('-----------myColumn', myColumn);
        console_logs('--------------myField', myField);

    },

    specwinopen: function (form) {
        specwin = Ext.create('Ext.Window', {
            modal: true,
            title: '정보 수정',
            plain: true,
            items: form,
            margin: 5,
            width: 340,
            height: 400,
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    specwin.close();

                }//btn handler
            }]
        });
        specwin.show();
    },
    //10일 이전:초록, 5일이전 노랑 3일이전 빨강. 지나면 검정
    highlightCell: function (o, gap, value, field) {
        if (gap != '') {
            var n = Number(gap);
            var background = 'white';
            var color = 'black';
            if (n > 9) {
                background = '#6CB33E';
                color = 'white';
            } else if (n > 5 && n < 10) {
                background = '#FFE8A6';
                color = 'black';
            } else if (n < 4 && n > -1) {
                background = '#E82030';
                color = 'white';
            } else {
                background = '#333333';
                color = 'white';
            }

            o.set(field, '<span style="background:' + background + ';color:' + color + ';">' + value + '</span>');
        }
    },
    highlightCodes: ['reserved6', 'h_reserved45', 'h_reserved46'],
    multi_grid_id: undefined,

    createPcsToobars: function (code) {
        console_logs('createPcsToobars code', code);
        var buttonItems = [];
        buttonItems.push(
            {
                name: code + 'finish_date',
                cmpId: code + 'finish_date',
                format: 'Y-m-d',
                fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                allowBlank: true,
                xtype: 'datefield',
                value: new Date(),
                width: 100,
                handler: function () {
                }
            });

        var temp_code = code;

        var smallPcs = gUtil.mesTplProcessAll[temp_code];
        console_logs('-------------->  smallPcs', smallPcs);


        if (smallPcs != null && smallPcs.length > 0) {

            for (var i = 0; i < smallPcs.length; i++) {
                var o1 = smallPcs[i];
                var code1 = o1['code'];
                var name1 = o1['name'];
                console_logs('createPcsToobars code1', code1);
                console_logs('createPcsToobars name1', name1);

                var action = {
                    xtype: 'button',
                    iconCls: 'af-check',
                    cmpId: code + code1,
                    text: name1 + ' 완료',
                    big_pcs_code: code,
                    pcs_code: code1,
                    disabled: true,
                    handler: function () {
                        gm.setCenterLoading(true);

                        console_logs('createPcsToobars', this.cmpId + ' clicked');
                        console_logs('big_pcs_code', this.big_pcs_code);
                        console_logs('pcs_code', this.pcs_code);
                        var text = gm.me().findToolbarCal(this.big_pcs_code);
                        console_logs('text', text);
                        if (text == null) {
                            Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function () {
                            });
                        } else {
                            var date = text.getValue();
                            console_logs('val', date);
                            var selections = gm.me().tab_selections[this.big_pcs_code];
                            console_logs('selections>>>>>>>>', selections);
                            if (selections != null) {
                                var whereValue = [];
                                var field = this.pcs_code + '|' + 'end_date';
                                for (var i = 0; i < selections.length; i++) {
                                    var o = selections[i];
                                    o.set(field, date);
                                    console_logs('o', o);
                                    console_logs('this.pcs_code', this.pcs_code);
                                    var step_uid = o.get(this.pcs_code + '|' + 'step_uid');
                                    whereValue.push(step_uid);
                                }
                                console_logs('createPcsToobars', whereValue);
                                gm.editAjax('pcsstep', 'end_date', date, 'unique_id', whereValue, {type: 'update_pcsstep_and_work'});
                            }

                        }
                    }
                };
                buttonItems.push(action);
            }//endoffor
        }

        console_logs('createPcsToobars buttonItems', buttonItems);
        var buttonToolbar1 = Ext.create('widget.toolbar', {
            items: buttonItems
        });

        console_logs('createPcsToobars buttonToolbar', buttonToolbar1);

        return buttonToolbar1;
    },

    //생산중단
    workOrderStop: function () {

        var code = gm.me().selected_tab;
        var selections = gm.me().tab_selections[code];
        console_logs('===>selections====>', selections);
        console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
        var cartmapUid = this.vSELECTED_RECORD.get('coord_key3');
        var ac_uid = this.vSELECTED_RECORD.get('ac_uid');
        var state = this.vSELECTED_RECORD.get('state');

        var ac_uids = [];
        var cartmapUids = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uids = rec.get('ac_uid');
            var c_uids = rec.get('coord_key3');
            console_logs('==uids==', uids);
            ac_uids.push(uids);
            cartmapUids.push(c_uids);
        }

        console_logs('==ac_uids==>>', ac_uids);
        console_logs('==cartmapUids==>>', cartmapUids);
        console_logs('==state==>>', state);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=delStopOrder',
            params: {
                ac_uid: ac_uids,
                status: state,
            },

            success: function (result, request) {
                gm.me().storeLoad(function () {
                });
                Ext.Msg.alert('안내', '생산작업을 취소하였습니다.', function () {
                });

            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax

    },

    doRequest: function (o) {


        var assymap_uids = [];
        var code = gm.me().selected_tab;
        if (code != undefined) {
            var selections = gm.me().tab_selections[code];
        } else {
            var selections = this.grid.getSelectionModel().getSelection();
        }

//
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');
            assymap_uids.push(uid);

        }

        o['assymap_uids'] = assymap_uids;
        o['parent_code'] = this.link;


        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=addRequestHeavy',
            params: o,
            /*{
             assymap_uids: assymap_uids
             },*/

            success: function (result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.', function () {
                });

            },//endofsuccess

            failure: extjsUtil.failureMessage
        });//endofajax

    },

    findToolbarCal: function (big_pcs_code) {
        var toolbar = null;
        var items = null;
        if (big_pcs_code != undefined) {
            var infos = gm.me().tab_info;
            console_logs('infos', infos);
            if (infos != null) {
                for (var i = 0; i < infos.length; i++) {
                    var o = infos[i];
                    if (o['code'] == big_pcs_code) {
                        var toolbars = o['toolbars'];
                        switch (vCompanyReserved4) {
                            case 'KBTC01KR':
                                toolbar = toolbars[1];
                                break;
                            default:
                                toolbar = toolbars[0];
                        }
                        items = toolbar.items.items;
                    }

                }
            }

        }

        if (items != null && items.length > 0) {
            return items[0];
        } else {
            return null;
        }

        console_logs('toolbar', toolbar);
        console_logs('toolbar items', items);
    },

    tab_selections: {},

    prevTagnoIn: '',
    setCheckname: function (b) {
        this.checkname = b;

        var btn = gu.getCmp('prwinopen-OK-button');
        if (b == true) {
            btn.enable();
        } else {
            btn.disable();
        }

    },
    madeComboIds: [],

    //storeLoad callback override
    storeLoadCallbackSub: function (records) {

        console_logs('records', records);

        //gm.me().multi_grid_id = multi_grid_id;
        var multi_grid_id = gm.me().multi_grid_id;
        console_logs('디폴트 데이터', multi_grid_id);

        if (multi_grid_id == undefined) {
            for (var i = 0; i < records.length; i++) {

                var keyCode = multi_grid_id;
                var specunit = records[i].get('specification');
                gm.me().spec.push(specunit);

            }
        } else {
            var keyCode = multi_grid_id;
        }

        gm.me().extoutJson(multi_grid_id, records, null);
    },

    buttonToolbar3: Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            style: 'color: #FF7F27; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '총 금액 : 0 / 총 수량 : 0'
        }]
    }),

    printBarcode: function () {

        var selections = null;

        if (gm.me().multi_grid_id != undefined) {
            selections = gm.me().tab_selections[gm.me().multi_grid_id];
        } else {
            selections = gm.me().grid.getSelectionModel().getSelection();
        }


        if (selections.length > 1) {
            Ext.Msg.alert('', '하나의 제품을 선택하시기 바랍니다.');
        } else {
            var rec = selections[0];

            var spCode = rec.get('sp_code');
            var itemCode = rec.get('item_code');
            var reserved3 = rec.get('reserved3');       // 바코드 저장 데이터

            var customerName = rec.get('customer_name');          // 고객사
            var quan = rec.get('quan');                           // 수주 요청 수량
            var reservedVarchar5 = rec.get('project_varchar5');  // 현장명
            var reservedVarchar9 = rec.get('project_varchar9');  // 라벨명
            var reservedVarchar6 = rec.get('project_varchar6');  // LOT 번호
            var reservedVarcharb = rec.get('project_varcharb');  // 입력
            var reservedVarchare = rec.get('project_varchare');  // 접지
            var reservedVarchard = rec.get('project_varchard');  // 출력
            var reservedVarcharg = rec.get('project_varcharg');  // LED
            var reservedVarcharh = rec.get('project_varcharh');  // CH
            var reservedVarchari = rec.get('project_varchari');  // 실수주품명
            var projectNumber7 = rec.get('project_number7');     // 포장단위

            reservedVarcharg = spCode == 'KB' ? '[' + itemCode + ']' : '[LED' + reservedVarcharg + '-' + reservedVarcharh.trim() + ']' + ' ' + reservedVarcharj;
            reservedVarchari = spCode == 'KB' ? '' : reservedVarchari;

            if(reserved3 !== null && reserved3.length > 0) {
                var objBarcode = Ext.decode(reserved3);
                customerName = objBarcode['customerName'];
                reservedVarchar5 = objBarcode['reservedVarchar5'];
                reservedVarchar9 = objBarcode['reservedVarchar9'];
                reservedVarchar6 = objBarcode['reservedVarchar6'];
                reservedVarcharb = objBarcode['reservedVarcharb'];
                reservedVarchare = objBarcode['reservedVarchare'];
                reservedVarchard = objBarcode['reservedVarchard'];
                reservedVarcharg = objBarcode['reservedVarcharg'];
                quan = objBarcode['quan'];
                reservedVarchari = objBarcode['reservedVarchari'];
                projectNumber7 = objBarcode['projectNumber7'];
            }

            gu.getCmp('print_qty').setValue(1);
            gu.getCmp('customerName').setValue(customerName);
            gu.getCmp('reservedVarchar5').setValue(reservedVarchar5);
            gu.getCmp('reservedVarchar9').setValue(reservedVarchar9);
            gu.getCmp('reservedVarchar6').setValue(reservedVarchar6);
            gu.getCmp('reservedVarcharb').setValue(reservedVarcharb);
            gu.getCmp('reservedVarchare').setValue(reservedVarchare);
            gu.getCmp('reservedVarchard').setValue(reservedVarchard);
            gu.getCmp('reservedVarcharg').setValue(reservedVarcharg);
            gu.getCmp('quan').setValue(quan);
            gu.getCmp('reservedVarcharg').setFieldLabel(spCode == 'KB' ? '품번' : 'LED-채널');
            gu.getCmp('reservedVarchari').setValue(reservedVarchari);
            gu.getCmp('projectNumber7').setValue(projectNumber7);

            var counts = 0;

            var productarr = [];

            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                var uid = rec.get('unique_id');  //Product unique_id
                var qty = rec.get('request_qty');
                var stock_qty = rec.get('stock_qty');
                if (qty > stock_qty) counts++;
                /*if(qty > 0) */
                productarr.push(uid);
            }

            if (productarr.length > 0) {
                gm.me().getBarcodeHtml();
                gm.me().prbarcodeopen(gm.me().form);
            }
        }
    },

    prbarcodeopen: function (form) {

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 출력하기',
            closeAction: 'hide',
            plain: true,
            items: [
                form
            ]
            ,
            buttons: [{
                text: '양식 저장하기',
                handler: function () {

                    var objBarcode = {};

                    var selections = null;

                    if (gm.me().multi_grid_id != undefined) {
                        selections = gm.me().tab_selections[gm.me().multi_grid_id];
                    } else {
                        selections = gm.me().grid.getSelectionModel().getSelection();
                    }

                    objBarcode['customerName'] = gu.getCmp('customerName').getValue();          // 고객사
                    objBarcode['quan'] = gu.getCmp('quan').getValue();                          // 수주 요청 수량
                    objBarcode['reservedVarchar5'] =  gu.getCmp('reservedVarchar5').getValue();  // 현장명
                    objBarcode['reservedVarchar9'] = gu.getCmp('reservedVarchar9').getValue();  // 라벨명
                    objBarcode['reservedVarchar6'] = gu.getCmp('reservedVarchar6').getValue();  // LOT 번호
                    objBarcode['reservedVarcharb'] = gu.getCmp('reservedVarcharb').getValue();  // 입력
                    objBarcode['reservedVarchare'] = gu.getCmp('reservedVarchare').getValue();  // 접지
                    objBarcode['reservedVarchard'] = gu.getCmp('reservedVarchard').getValue();  // 출력
                    objBarcode['reservedVarcharg'] = gu.getCmp('reservedVarcharg').getValue();  // LED
                    objBarcode['reservedVarchari'] = gu.getCmp('reservedVarchari').getValue();  // 실수주품명
                    objBarcode['projectNumber7'] = gu.getCmp('projectNumber7').getValue();     // 포장단위

                    var jsonData = Ext.encode(objBarcode);

                    gm.editAjax('assymap', 'reserved3', jsonData, 'unique_id', selections[0].get('unique_id_long'),  {type:''});

                    Ext.Msg.alert('', '바코드가 저장 되었습니다.');

                }//btn handler
            }, {
                text: '출력하기',
                handler: function () {

                    var assyTopArr = [];
                    var selections = null;

                    if (gm.me().multi_grid_id != undefined) {
                        selections = gm.me().tab_selections[gm.me().multi_grid_id];
                    } else {
                        selections = gm.me().grid.getSelectionModel().getSelection();
                    }
                    var counts = 0;

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];

                        var assyTopUid = rec.get('unique_id_long');

                        assyTopArr.push(assyTopUid);
                    }

                    var form = gu.getCmp('formPanel').getForm();

                    form.submit({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printProductBarcodeByAssyTop',
                        params: {
                            assyTopArr: assyTopArr
                        },
                        success: function (val, action) {
                            //prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 완료하였습니다.');
                            //gMain.selPanel.store.load(function () {
                            //});
                        },
                        failure: function (val, action) {
                            //prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            //gMain.selPanel.store.load(function () {
                            //});
                        }
                    });


                }//btn handler
            }, {
                text: '닫기',
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }]
        });
        prWin.show();
    },
    getBarcodeHtml: function() {

        var selection = gm.me().grid.getSelectionModel().getSelection()[0];

        var customerName = gu.getCmp('customerName').getValue();          // 고객사
        var quan = gu.getCmp('quan').getValue();                          // 수주 요청 수량
        var reservedVarchar5 = gu.getCmp('reservedVarchar5').getValue();  // 현장명
        var reservedVarchar9 = gu.getCmp('reservedVarchar9').getValue();  // 라벨명
        var reservedVarchar6 = gu.getCmp('reservedVarchar6').getValue();  // LOT 번호
        var reservedVarcharb = gu.getCmp('reservedVarcharb').getValue();  // 입력
        var reservedVarchare = gu.getCmp('reservedVarchare').getValue();  // 접지
        var reservedVarchard = gu.getCmp('reservedVarchard').getValue();  // 출력
        var reservedVarcharg = gu.getCmp('reservedVarcharg').getValue();  // LED
        //var reservedVarcharh = gu.getCmp('reservedVarcharh').getValue();  // CH
        var reservedVarchari = gu.getCmp('reservedVarchari').getValue();  // 실수주품명
        var projectNumber7 = gu.getCmp('projectNumber7').getValue();     // 포장단위

        var scale = 0.75 * (9 / customerName.length);
        if(scale > 0.75) {
            scale = 0.75;
        }

        var scaleQuan = 0.8 * (8 / quan.length);
        if(scaleQuan > 0.8) {
            scaleQuan = 0.8;
        }

        var scaleLED = 0.8 * (14 / reservedVarcharg.length);
        if(scaleLED > 0.8) {
            scaleLED = 0.8;
        }

        var scaleb = 1.0 * (15 / reservedVarcharb.length);
        if(scaleb > 1.0) {
            scaleb = 1.0;
        }

        var scalee = 1.0 * (15 / reservedVarchare.length);
        if(scalee > 1.0) {
            scalee = 1.0;
        }

        var scaled = 1.0 * (15 / reservedVarchard.length);
        if(scaled > 1.0) {
            scaled = 1.0;
        }

        var scale5 = 1.0 * (16 / reservedVarchar5.length);
        if(scale5 > 1.0) {
            scale5 = 1.0;
        }

        if(reservedVarchari.length > 0) {
            if(!reservedVarchari.includes('C-')) {
                reservedVarchari = reservedVarchari.substring(2, reservedVarchari.length);
            }
            reservedVarchari = reservedVarchari.toLowerCase();
        }

        var htmlreservedVarcharb = reservedVarcharb.length > 0 ?
            '<div style ="font-family: 맑은 고딕 !important; width: 190px; height: 15px; white-space:nowrap; transform: scaleX('+scaleb+'); transform-origin:top left; text-overflow:ellipsis;">' +
            '입력 : ' + reservedVarcharb + '</div>' :
            '';
        var htmlreservedVarchare = reservedVarchare.length > 0 ?
            '<div style ="font-family: 맑은 고딕 !important; width: 190px; height: 15px; white-space:nowrap; transform: scaleX('+scalee+'); transform-origin:top left; text-overflow:ellipsis;">' +
            '접지 : ' + reservedVarchare + '</div>' :
            '';
        var htmlreservedVarchard = reservedVarchard.length > 0 ?
            '<div style ="font-family: 맑은 고딕 !important; width: 190px; height: 15px; white-space:nowrap;transform: scaleX('+scaled+'); transform-origin:top left; text-overflow:ellipsis;">' +
            '출력 : ' + reservedVarchard + '</div>' :
            '';

        var htmlData = '<div style = "margin: 10px auto; width: 350px; height: 180px; box-shadow: 0 0 10px #999999; border-radius: 5px;">' +
            '<table>' +
            '<tr>' +
            '<td style="vertical-align: top; ">' +
            '<div style ="margin: 10px; font-weight: bold; width: 190px;">' +
            '<div style ="padding: 5px 0px 0px 0px; font-family: 맑은 고딕 !important; font-size:30px; transform: scaleX('+scale+'); transform-origin:top left; height: 30px; width: 190px; white-space:nowrap; ">' +
            customerName + '</div>' +
            '<div style ="font-family: 맑은 고딕 !important; width: 190px; height: 15px; white-space:nowrap; transform: scaleX('+scale5+'); transform-origin:top left; ">' +
            (reservedVarchar5 == null ? '' : reservedVarchar5) + '</div>' +
            '<div style ="font-family: 맑은 고딕 !important; width: 190px; height: 15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
            reservedVarchar9 + '</div>' +
            '<div style ="font-family: 맑은 고딕 !important; width: 190px; height: 15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
            'Lot No : ' + reservedVarchar6 + '</div>' +
            htmlreservedVarcharb +
            htmlreservedVarchare +
            htmlreservedVarchard +
            '</div>' +
            '</td>' +
            '<td style="vertical-align: top;">' +
            '<div style ="margin: 10px; font-weight: bold; width: 150px;">' +
            '<div style ="padding: 5px 0px 0px 0px; font-family: 맑은 고딕 !important; font-size:30px; width: 150px; height: 30px; transform: scaleX('+scaleQuan+'); transform-origin:top left; white-space:nowrap; ">' +
            quan + '</div>' +
            '<div style ="font-family: 맑은 고딕 !important; font-size:18px; transform: scaleX('+scaleLED+'); transform-origin:top left; transform-origin:top left; width: 150px; white-space:nowrap; height: 20px;">' +
            reservedVarcharg + '</div>' +
            '<div style ="font-family: 맑은 고딕 !important; width: 150px; white-space:nowrap; height: 15px; overflow:hidden; text-overflow:ellipsis;">' +
            reservedVarchari + '</div>' +
            '<div style ="text-align: left;padding: 5px 0px 0px 0px; font-family: 맑은 고딕 !important; font-size:25px; transform: scaleX(0.7); transform-origin:top left; width: 150px; height: 27px; white-space:nowrap;">' +
            projectNumber7 + '개/박스' + '</div>' +
            '</div>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="2" style ="font-weight: bold;">' +
            '<div style="width: 345px; height: 30px; background-color: #333333; font-family: 맑은 고딕 !important; ' +
            'color: white; text-align: center;">' +
            '바코드 공간</div>' +
            '</td>' +
            '</tr>' +
            '</div>';

            if(gu.getCmp('barcodeHtml') != undefined && gu.getCmp('barcodeHtml') != null) {
                gu.getCmp('barcodeHtml').setHtml(htmlData);
            }
    },
    formatDate: function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
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
                    if (barcodeData[barcodeData.length -1] === '') {
                        barcodeData.pop();  //마지막 공백 제거
                    }
                    var uniqueBarcodeData = barcodeData.reduce(function(a, b){
                        if (a.indexOf(b) < 0 ) a.push(b);
                        return a;
                    },[]);
                    gm.me().store.getProxy().setExtraParam('projectUids', uniqueBarcodeData);
                    gm.me().store.load(function(records) {
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
