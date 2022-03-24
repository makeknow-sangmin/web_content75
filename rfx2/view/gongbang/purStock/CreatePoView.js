//주문작성
Ext.define('Rfx2.view.gongbang.purStock.CreatePoView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'create-po-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        this.addSearchField({
            type: 'dateRange',
            field_id: 'gr_date',
            text: "요청기간",
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        this.addSearchField('item_code');
        //this.addSearchField('pj_name');
        this.addSearchField('supplier_name');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.addSearchField('creator');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.bioprotech.CreatePo',
            pageSize: 500,
            sorters: [{
                property: 'parent_code',
                direction: 'asc'
            }],
            byReplacer: {},
            deleteClass: ['cartmap']

        }, {});

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 구매 ({rows.length})</div>'
        });

        var option = {
            features: [groupingFeature]
        };

        Ext.each(this.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'supplier_name':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    columnObj["editor"] = {
                        xtype: 'combo',
                        store: Ext.create('Rfx2.store.company.bioprotech.ContractMaterialStore', {}),
                        displayField: 'supplier_name',
                        valueField: 'supplier_name',
                        enableKeyEvents: true,
                        editable: false,
                        listeners: {
                            expand: function (field) {
                                gm.me().stockposStore.getProxy().setExtraParams(
                                    {
                                        nstock_uid: rec.get('unique_id')
                                    }
                                );
                                gm.me().stockposStore.load();
                                var child = gm.me().grid.getSelectionModel().getSelection()[0].get('child');
                                this.store.getProxy().setExtraParam('srcahd_uid', child);
                                this.store.load();
                            },
                            select(combo, record, eOpts) {
                                var cartmapUid = gm.me().grid.getSelectionModel().getSelection()[0].get('cartmap_uid');
                                gm.editAjax('cartmap', 'coord_key1', record.get('supast_uid'), 'unique_id', cartmapUid, {type: ''});
                                gm.editAjax('cartmap', 'sales_price', record.get('sales_price'), 'unique_id', cartmapUid, {type: ''});
                                gm.me().store.sync();
                            }
                        }
                    };
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

        //grid 생성.
        this.createGridCore(arr, option);
        this.createCrudTab();


        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.removeAction.setText('반려');

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3) {
                buttonToolbar.items.remove(item);
            }
        });

        //주문작성 Action 생성
        this.createPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '주문 작성',
            tooltip: '주문 작성',
            disabled: true,
            handler: function () {

                var fullYear = gUtil.getFullYear() + '';
                var month = gUtil.getMonth() + '';
                if (month.length == 1) {
                    month = '0' + month;
                }

                var first = "OR" + fullYear.substring(2, 4) + month;
                console_logs('first', first);

                // 마지막 수주번호 가져오기
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPono',
                    params: {
                        first: first,
                        codeLength: 4
                    },
                    success: function (result, request) {
                        var po_no = result.responseText;

                        gm.me().treatPo(po_no);

                    },// endofsuccess
                    failure: extjsUtil.failureMessage
                });// endofajax

            }//handler end...

        });

        buttonToolbar.insert(3, this.createPoAction);

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length) {

                var rec = selections[0];
                gm.me().rec = rec;
                console_logs('rec 데이터', rec);
                this.checkEqualPjNames(rec);
                var standard_flag = rec.get('standard_flag');
                standard_flag = gUtil.stripHighlight(standard_flag);  //하이라이트 삭제

                console_logs('그리드온 데이터', rec);
                gm.me().request_date = rec.get('req_date'); // 납기일
                gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //cartmap_uid
                gm.me().vSELECTED_PJ_UID = rec.get('ac_uid'); //프로젝트아이디
                gm.me().vSELECTED_SP_CODE = rec.get('sp_code');
                gm.me().vSELECTED_CURRENCY = rec.get('currency'); //스카나 통화
                gm.me().vSELECTED_STANDARD = rec.get('standard_flag');
                gm.me().vSELECTED_MYCARTQUAN = rec.get('mycart_quan');
                gm.me().vSELECTED_coord_key3 = rec.get('coord_key3');   // pj_uid
                gm.me().vSELECTED_coord_key2 = rec.get('coord_key2');
                gm.me().vSELECTED_coord_key1 = rec.get('coord_key1');   // 공급사
                gm.me().vSELECTED_po_user_uid = rec.get('po_user_uid');
                gm.me().vSELECTED_item_name = rec.get('item_name');    // 품명
                gm.me().vSELECTED_item_code = rec.get('item_code');    // 품번
                gm.me().vSELECTED_specification = rec.get('specification');    // 규격
                gm.me().vSELECTED_pj_name = rec.get('pj_name');
                gm.me().vSELECTED_req_date = rec.get('delivery_plan');
                gm.me().vSELECTED_quan = rec.get('pr_quan');
                gm.me().vSELECTED_QUAN = rec.get('quan');
                gm.me().vSELECTED_PRICE = rec.get('sales_price');
                gm.me().vSELECTED_STOCK_USEFUL = rec.get('stock_qty_useful');
                var pj_name = gm.me().vSELECTED_pj_name

                console_logs('유니크아이디', gm.me().vSELECTED_UNIQUE_ID);
                this.cartmap_uids.push(gm.me().vSELECTED_UNIQUE_ID);

                console_logs('선택된 uid', this.cartmap_uids);
                console_logs('pj_name++++++', pj_name);

                gm.me().createPoAction.enable();

            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().vSELECTED_PJ_UID = -1;

                gm.me().createPoAction.disable();

                this.cartmap_uids = [];
                this.currencies = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    var currencies = rec1.get('currency');
                    this.cartmap_uids.push(uids);
                    this.currencies.push(currencies);
                }

                console_logs('this.currencies>>>', currencies);
            }

        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function (records) {
            console_logs('디폴트 데이터', records);

        });
    },
    items: [],
    poviewType: 'ALL',
    cartmap_uids: [],
    deleteClass: ['cartmap'],

    treatPo: function (po_no) {

        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        var next = gUtil.getNextday(0);
        var request_date = gm.me().request_date;

        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알 림", "선택된 자재가 없습니다.");

        } else {

            var form = null;
            var pjArr = [];
            var supArr = [];
            var cartmapUids = [];
            var exchange_rates = [];
            var notDefinedSup = false;

            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                console_logs('rec', rec);
                var coord_key1 = rec.get('coord_key1');
                if (coord_key1 == undefined || coord_key1 == null || coord_key1 == '' || coord_key1 < 0) {
                    notDefinedSup = true;
                }
                pjArr.push(rec.get('pj_code'));
                supArr.push(coord_key1);
                cartmapUids.push(rec.get('id'));
                exchange_rates.push(rec.get('exchange_rate'));
            }

            pjArr = gu.removeDupArray(pjArr);
            supArr = gu.removeDupArray(supArr);
            console_logs('pjArr', pjArr);
            console_logs('supArr', supArr);
            console_logs('cartmapUids', cartmapUids);

            if (pjArr.length > 1) {
                Ext.Msg.alert('알림', '같은 프로젝트를  선택해주세요.');
                return;
            }

            // flag로 대체 예정
            if (!gm.me().isNotSelectSupplierOnMainGrid()) {
                if (supArr.length > 1) {
                    Ext.Msg.alert('알림', '같은 공급사를 지정해 주세요.');
                    return;
                }

                if (notDefinedSup) {
                    Ext.Msg.alert('알림', '공급사를 지정하지 않은 항목이 있습니다.');
                    return;
                }
            }

            var next = gUtil.getNextday(0);

            var total = 0;

            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                var total_price = rec.get('total_price');
                total = total + total_price;
            }

            var supplierStore = Ext.create('Mplm.store.SupastStore', {
                supplierType: gm.me().suplier_type
            });

            var form = Ext.create('Ext.form.Panel', {
                id: gu.id('formPanel'),
                xtype: 'form',
                frame: true,
                border: false,
                bodyPadding: 10,
                region: 'center',
                layout: 'column',
                fieldDefaults: {
                    labelAlign: 'right',
                    msgTarget: 'side'
                },
                defaults: {
                    layout: 'form',
                    xtype: 'container',
                    defaultType: 'textfield',
                    style: 'width: 50%'
                },
                items: [{
                    xtype: 'fieldset',
                    width: 400,
                    height: 250,
                    margins: '0 20 0 0',
                    collapsible: true,
                    anchor: '100%',
                    defaults: {
                        labelWidth: 89,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 100, bottom: 0, left: 10}
                        }
                    },
                    items: [
                        // {
                        //     fieldLabel: '프로젝트',
                        //     xtype: 'textfield',
                        //     rows: 4,
                        //     anchor: '100%',
                        //     value: selections[0].get('pj_name'),
                        //     fieldStyle: 'background-color: #ddd; background-image: none;',
                        //     readOnly: true
                        // },
                        {
                            fieldLabel: '주문처',
                            xtype: 'combo',
                            id: gu.id('target_supplier'),
                            anchor: '100%',
                            name: 'coord_key1',
                            store: supplierStore,
                            displayField: 'supplier_name',
                            valueField: 'unique_id',
                            emptyText: '선택',
                            //value: selections[0].get('coord_key1'),
                            value: "",
                            allowBlank: false,
                            sortInfo: {
                                field: 'create_date',
                                direction: 'DESC'
                            },
                            typeAhead: false,
                            readOnly: /* !(this.changeSupplier),*/ false,
                            fieldStyle: /*(this.changeSupplier) ?*/
                                'background-color: #fff; background-image: none;' /*:
                         'background-color: #ddd; background-image: none;'*/
                            ,
                            //hideLabel: true,
                            minChars: 2,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                    //    			            	        	   var reccode = record.get('area_code');
                                    coord_key1 = record.get('unique_id');
                                    //    			            	        	   Ext.getCmp('maker_code').setValue(reccode);
                                }
                            }
                        },
                        {
                            fieldLabel: '합계금액',
                            xtype: 'textfield',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: Ext.util.Format.number(total, '0,00/i') + ' ' + selections[0].get('currency'),
                            readOnly: true
                        },
                        {
                            fieldLabel: '요약',
                            xtype: 'textfield',
                            name: 'item_abst',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
                            readOnly: true
                        },
                        {
                            fieldLabel: '주문번호',
                            xtype: 'textfield',
                            rows: 4,
                            anchor: '100%',
                            name: 'po_no',
                            value: po_no,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            readOnly: true
                        },
                        // {
                        //     fieldLabel: '납품장소',
                        //     xtype: 'textfield',
                        //     rows: 4,
                        //     anchor: '100%',
                        //     name: 'reserved_varchar1',
                        //     value: '사내'
                        // },
                        {
                            fieldLabel: '요청사항',
                            xtype: 'textarea',
                            rows: 4,
                            anchor: '100%',
                            name: 'reserved_varchar2',

                        },
                        // {
                        //     fieldLabel: '결제 조건',
                        //     xtype: 'combo',
                        //     anchor: '100%',
                        //     name: 'pay_condition',
                        //     store: gm.me().payConditionStore,
                        //     displayField: 'codeName',
                        //     valueField: 'codeName',
                        //     emptyText: '선택',
                        //     allowBlank: true,
                        //     typeAhead: false,
                        //     minChars: 1,
                        //     listConfig: {
                        //         loadingText: '검색중...',
                        //         emptyText: '일치하는 항목 없음.',
                        //         getInnerTpl: function () {
                        //             return '<div data-qtip="{systemCode}">{codeName}</div>';
                        //         }
                        //     },
                        //     listeners: {
                        //         select: function (combo, record) {
                        //         }
                        //     }
                        // },
                        new Ext.form.Hidden({
                            name: 'unique_uids',
                            value: cartmapUids
                        }), new Ext.form.Hidden({
                            name: 'coord_key1',
                            value: selections[0].get('coord_key1')
                        }), new Ext.form.Hidden({
                            name: 'coord_key3',
                            value: selections[0].get('coord_key3')
                        }), new Ext.form.Hidden({
                            name: 'ac_uid',
                            value: selections[0].get('ac_uid')
                        }), new Ext.form.Hidden({
                            name: 'req_date',
                            value: selections[0].get('req_date')
                        }), new Ext.form.Hidden({
                            name: 'sales_price',
                            value: total
                        }), new Ext.form.Hidden({
                            name: 'exchange_rates',
                            value: exchange_rates
                        })
                    ]
                }]
            });

            supplierStore.load();

            var myHeight = 350;
            var myWidth = 420;

            var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: '주문 작성',
                width: myWidth,
                height: myHeight,
                plain: true,
                items: form,
                buttons: [{
                    text: CMD_OK,
                    handler: function (btn) {

                        if (btn == "no") {
                            prWin.close();
                        } else {

                            if (form.isValid()) {
                                var val = form.getValues(false);

                                console_logs('val', val);
                                form.submit({
                                    url: CONTEXT_PATH + '/purchase/request.do?method=createheavycontract',
                                    params: val,
                                    success: function (val, action) {
                                        prWin.close();
                                        gm.me().store.load(function () {
                                        });
                                    },
                                    failure: function (val, action) {

                                        prWin.close();
                                        gm.me().store.load(function () {
                                        });

                                    }
                                })
                            }  // end of formvalid
                        }//else
                    }
                }]
            });

            prWin.show();
        }
    },

    // 주문 submit
    prwinopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '주문 작성',
            width: myWidth,

            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var msg = '발주하시겠습니까?';
                    var myTitle = '주문 작성 확인';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,

                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                var form = gu.getCmp('formPanel').getForm();
                                var po_user_uid = gm.me().vSELECTED_po_user_uid;
                                var srcahdArr = [];
                                var cartmapArr = [];
                                var nameArr = [];
                                var priceArr = [];
                                var curArr = [];
                                var quanArr = [];
                                var coordArr = [];
                                var selections = gm.me().grid.getSelectionModel().getSelection();
                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];

                                    var uid = rec.get('id');
                                    var srcahd_uid = rec.get('unique_id');
                                    var coord_key3 = rec.get('coord_key3');
                                    var currency = rec.get('cart_currency');
                                    var item_name = rec.get('item_name');
                                    var static_sales_price = rec.get('static_sales_price');
                                    var request_info = rec.get('request_info');
                                    var quan = rec.get('quan');
                                    quanArr.push(quan);
                                    cartmapArr.push(uid);
                                    srcahdArr.push(srcahd_uid);
                                    curArr.push(currency);
                                    priceArr.push(static_sales_price);
                                    nameArr.push(item_name);
                                    coordArr.push(coord_key3);

                                }
                                var mycart_quan = rec.get('mycart_quan');
                                var static_sales_price = rec.get('static_sales_price'); //cartmap.sales_price

                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    console_logs('val', val);
                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createheavy',
                                        params: {
                                            sancType: 'YES',
                                            reserved_varchar2: reserved_varchar2,
                                            reserved_varchar1: reserved_varchar1,
                                            supplier_information: supplier_information,
                                            cartmaparr: cartmapArr,
                                            srcahdarr: srcahdArr,
                                            quans: quanArr,
                                            currencies: curArr,
                                            names: nameArr,
                                            coord_key3s: coordArr,
                                            sales_prices: priceArr
                                        },
                                        success: function (val, action) {
                                            prWin.close();
                                            Ext.Msg.alert('안내', '발주 완료 되었습니다.', function () {
                                            });
                                            gm.me().store.load(function () {
                                            });

                                            //this.store.load();
                                            //gm.me().store.load();
                                        },
                                        failure: function (val, action) {

                                            prWin.close();

                                        }
                                    })
                                }  // end of formvalid
                            } // btnIf of end
                        }//fn function(btn)

                    });//show
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

    editRedord: function (field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        switch (field) {
            case 'quan':
            case 'static_sales_price':
            case 'req_date':
            case 'cart_currency':
                this.updateDesinComment(rec);
                break;
            case 'exchange_rate':
                var total_price = rec.get('total_price');
                var exchange_rate = rec.get('exchange_rate');
                rec.set('total_price_kor', total_price * exchange_rate);
                break;
        }
    },

    updateDesinComment: function (rec) {

        var child = rec.get('child');
        console_logs('child>>>', child);
        var quan = rec.get('quan');
        var static_sales_price = rec.get('static_sales_price');
        var req_date = rec.get('req_date');
        req_date = Ext.Date.format(req_date, 'Y-m-d');
        var cart_currency = rec.get('cart_currency');
        var unique_id = rec.get('unique_uid');
        console_logs('====> unique_id', unique_id);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updateCreatePo',
            params: {
                quan: quan,
                child: child,
                static_sales_price: static_sales_price,
                cart_currency: cart_currency,
                req_date: req_date,
                unique_id: unique_id
            },
            success: function (result, request) {

                var result = result.responseText;
                //console_logs("", result);
                gm.me().store.load();
            },
            failure: extjsUtil.failureMessage
        });
    },


    checkEqualPjNames: function (rec) {
        console_logs('rec+++++++++++++in check' + rec);
    },

    supastSearchActivation: function (combo, e, eOpts) {

        gm.me().myVar = setTimeout(function () {
            gm.me().contractMatStore.getProxy().setExtraParam('supplier_name', '%' + combo.rawValue + '%');
            gm.me().contractMatStore.load();
            combo.expand();
        }, 500);
    },
    payConditionStore: Ext.create('Mplm.store.PayConditionStore', {hasNull: false}),

    // flag로 대체 예정
    isNotSelectSupplierOnMainGrid() {
        switch (vCompanyReserved4) {
            case 'KMCA01KR':
                return true;
            default:
                return false;
        }
    }
});
