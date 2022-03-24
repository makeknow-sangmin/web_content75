//수주관리 메뉴
Ext.define('Rfx2.view.company.kbtech.produceMgmt.PrintPackageLabelView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'print-package-label-view',
    inputBuyer: null,
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

        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.

        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // 검색툴바 필드 초기화
        this.initSearchField();
        this.addSearchField(
            {
                type: 'combo'
                , field_id: 'status'
                , store: "RecevedStateStore"
                , displayField: 'codeName'
                , valueField: 'systemCode'
                , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

        this.addSearchField('reserved_varchar6');
        this.addSearchField('item_code');
        this.addSearchField('item_name');

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        Ext.each(this.columns, function(columnObj, index) {

            var o = columnObj;

            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'quan':
                case 'sales_price':
                case 'selling_price':
                case 'bm_quan':
                    o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                        if(gm.me().store.data.items.length > 0) {
                            var summary = gm.me().store.data.items[0].get('summary');
                            if(summary.length > 0) {
                                var objSummary = Ext.decode(summary);
                                return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                            } else {
                                return 0;
                            }
                        } else {
                            return 0;
                        }
                    };
                    break;
                default:
                    break;
            }
        });

        var option = {
            features: [{
                ftype: 'summary',
                dock: 'top'
            }]
        };

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

        this.createStore('Rfx2.model.PrintPackageLabel', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['assymap']
        );

        // this.setRowClass(function (record, index) {
        //     var c = record.get('status');
        //     switch (c) {
        //         case 'P0':
        //             return 'yellow-row';
        //             break;
        //         case 'P':
        //             return 'orange-row';
        //             break;
        //         case 'CA':
        //             return 'red-row';
        //             break;
        //         case 'CR':
        //             return 'green-row';
        //             break;
        //         default:
        //     }
        //
        // });

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        // 그리드 생성
        this.createGrid(searchToolbar, buttonToolbar, option);

        // 버튼 추가.
        buttonToolbar.insert(1, this.printBarcodeAction);
        buttonToolbar.insert(1, '-');

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length == 1) {
                gUtil.enable(gm.me().printBarcodeAction);
            } else {
                gUtil.disable(gm.me().printBarcodeAction);
            }
        });

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        this.callParent(arguments);


        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.

        this.store.getProxy().setExtraParam('not_pj_type', 'OU');

        this.store.load(function (records) {
        });


    },

    printBarcode: function () {

        var selections = gm.me().grid.getSelectionModel().getSelection();

        if (selections.length > 1) {
            Ext.Msg.alert('', '하나의 제품을 선택하시기 바랍니다.');
        } else {
            var rec = selections[0];

            var spCode = rec.get('sp_code');
            var itemCode = rec.get('item_code');
            var reserved3 = rec.get('reserved3');       // 바코드 저장 데이터

            var customerName = rec.get('wa_name');          // 고객사
            var quan = rec.get('quan');                           // 수주 요청 수량
            var reservedVarchar5 = rec.get('reserved_varchar5');  // 현장명
            var reservedVarchar9 = rec.get('reserved_varchar9');  // 라벨명
            var reservedVarchar6 = rec.get('reserved_varchar6');  // LOT 번호
            var reservedVarcharb = rec.get('reserved_varcharb');  // 입력
            var reservedVarchare = rec.get('reserved_varchare');  // 접지
            var reservedVarchard = rec.get('reserved_varchard');  // 출력
            var reservedVarcharg = rec.get('reserved_varcharg');  // LED
            var reservedVarcharh = rec.get('reserved_varcharh');  // CH
            var reservedVarchari = rec.get('reserved_varchari');  // 실수주품명
            var reservedVarcharj = rec.get('reserved_varcharj');  // JACK/WIRE
            var projectNumber7 = rec.get('reserved_number7');     // 포장단위

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

                    gm.editAjax('assymap', 'reserved3', jsonData, 'unique_id', selections[0].get('unique_uid'),  {type:''});

                    Ext.Msg.alert('', '바코드가 저장 되었습니다.');

                }//btn handler
            }, {
                text: '출력하기',
                handler: function () {

                    var assyTopArr = [];
                    var selections = gm.me().grid.getSelectionModel().getSelection();

                    var counts = 0;

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];

                        var assyTopUid = rec.get('unique_uid');

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
    }
});