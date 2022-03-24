//주문작성

Ext.define('Rfx2.view.company.mjcm.purStock.HEAVY4_CreatePoView', {
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
            sdate: new Date(new Date().getFullYear() + '-01-01'),
            // sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        this.addSearchField('item_code');
        this.addSearchField('pj_name');
        this.addSearchField('supplier_name');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        //this.addSearchField('creator');

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
                                var child = gm.me().grid.getSelectionModel().getSelection()[0].get('child');
                                this.store.getProxy().setExtraParam('srcahd_uid', child);
                                this.store.load();
                            },
                            select: function (combo, record, eOpts) {
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

                //OR17060001
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

        this.mergePrAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '요청 결합',
            tooltip: '요청 결합',
            disabled: true,
            handler: function () {
                var selections = gm.me().grid.getSelectionModel().getSelection();

                var firstItemCode = null;

                if (selections.length < 2) {
                    Ext.Msg.alert('', '최소 두 건 이상의 같은 품목을 선택하시기 바랍니다.');
                } else {
                    for (var i = 0; i < selections.length; i++) {
                        var itemCode = selections[i].get('item_code');

                        if (i === 0) {
                            firstItemCode = itemCode;
                        }

                        if (firstItemCode !== null && itemCode !== firstItemCode) {
                            Ext.Msg.alert('', '같은 자재를 선택하시기 바랍니다.');
                            break;
                        }

                        if (i === selections.length - 1) {

                            var myTitle = '경고';

                            var msg = '구매요청 번호가 서로 다른 경우 더 이상 요청서와 연동이 불가능해집니다.' +
                                '</br>그래도 진행하시겠습니까?</br><font color="red"><b>이 요청은 되돌리기가 불가능합니다!</b></font>';

                            Ext.MessageBox.show({
                                title: myTitle,
                                msg: msg,

                                buttons: Ext.MessageBox.YESNO,
                                icon: Ext.MessageBox.QUESTION,
                                fn: function (btn) {

                                    if (btn == "no") {
                                        //prWin.close();
                                    } else {

                                        var selections = gm.me().grid.getSelectionModel().getSelection();

                                        var cartmapArr = [];

                                        for (var i = 0; i < selections.length; i++) {
                                            var rec = selections[i];
                                            cartmapArr.push(rec.get('cartmap_uid'));
                                        }

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/purchase/request.do?method=mergePurchaseRequest',
                                            params: {
                                                cartmapUids: cartmapArr
                                            },

                                            success: function (result, request) {
                                                gm.me().store.load();
                                                Ext.Msg.alert('안내', '결합이 완료 되었습니다.', function () {
                                                });

                                            },//endofsuccess
                                            failure: extjsUtil.failureMessage
                                        });//endofajax
                                    } // btnIf of end
                                }//fn function(btn)

                            });//show
                        }
                    }
                }
            }
        });

        this.splitPrAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '요청 분할',
            tooltip: '요청 분할',
            disabled: true,
            handler: function () {
                Ext.Msg.alert('경고', '요청을 분할하시겠습니까?</br><font color="red"><b>이 요청은 되돌리기가 불가능합니다!</b></font>');
            }
        });

        //계약 갱신/
        this.updateCartmapContract = Ext.create('Ext.Action', {
            iconCls: 'fa-retweet_14_0_5395c4_none',
            text: '계약 갱신',
            tooltip: '계약 갱신',
            disabled: true,
            handler: function () {
                gm.me().treatCartmapContract();

            }//handler end...

        });

        //추가 주문작성 Action 생성
        this.createAddPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '복사 하기',
            tooltip: '복사 하기',
            disabled: true,
            handler: function () {

                var sp_code = gm.me().vSELECTED_SP_CODE;
                switch (sp_code) {
                    case 'R':
                        gm.me().purCopyAction();
                        break;
                    case 'O':
                        gm.me().purCopyAction();
                        break;
                    case 'K':
                        gm.me().purCopyAction();
                        break;
                    default:

                }

            }//handler end...

        });

        buttonToolbar.insert(3, this.mergePrAction);
        buttonToolbar.insert(3, this.splitPrAction);
        buttonToolbar.insert(3, this.createPoAction);
        //buttonToolbar.insert(2, this.createInPoAction);

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
                gm.me().vSELECTED_CURRENCY = rec.get('contract_currency'); //스카나 통화
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

                if (gm.me().poviewType == 'ADDPO') {

                    gm.me().createAddPoAction.enable();
                    gm.me().createPoAction.disable();
                    gm.me().updateCartmapContract.disable();
                    gm.me().splitPrAction.disable();
                    gm.me().mergePrAction.disable();
                } else {
                    gm.me().createPoAction.enable();
                    gm.me().updateCartmapContract.enable();
                    gm.me().splitPrAction.enable();
                    gm.me().mergePrAction.enable();
                }

                //gm.me().contractMatStore.getProxy().setExtraParam('srcahd_uid', rec.get('child'));

            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().vSELECTED_PJ_UID = -1;

                if (gm.me().poviewType == 'ADDPO') {
                    gm.me().createAddPoAction.disable();
                    gm.me().createPoAction.enable();
                    gm.me().updateCartmapContract.disable();
                    gm.me().splitPrAction.disable();
                    gm.me().mergePrAction.disable();
                } else {
                    gm.me().createPoAction.disable();
                    gm.me().updateCartmapContract.disable();
                    gm.me().splitPrAction.enable();
                    gm.me().mergePrAction.enable();
                }

                this.cartmap_uids = [];
                this.currencies = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    var currencies = rec1.get('contract_currency');
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

    purCopyAction: function () {
        var uniqueId = gm.me().vSELECTED_PJ_UID;

        if (uniqueId.length < 0) {
            alert('선택된 데이터가 없습니다.');
        } else {

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/request.do?method=purcopycartmap',
                params: {
                    cartmapUids: this.cartmap_uids
                },

                success: function (result, request) {
                    gm.me().store.load();
                    Ext.Msg.alert('안내', '복사가 완료 되었습니다.', function () {
                    });

                },//endofsuccess
                failure: extjsUtil.failureMessage
            });//endofajax
        } // end of if uniqueid
    },

    treatCartmapContract: function () {
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알 림", "선택된 자재가 없습니다.");
        } else {

            var cartmapUids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                cartmapUids.push(rec.get('id'));
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/request.do?method=updateCartmapContract',
                params: {
                    unique_ids: cartmapUids
                },
                success: function (result, request) {

                    var result = result.responseText;
                    console_logs("success", result);
                    gm.me().store.load(function () {
                    });

                },
                failure: extjsUtil.failureMessage
            });
        }
    },

    treatPo: function (po_no) {

        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        var next = gUtil.getNextday(0);
        var request_date = gm.me().request_date;

        var isSamePoDate = true;
        var rs = null;

        for (var i = 0; i < selections.length; i++) {
            var reserved_timestamp1 = selections[i].get('reserved_timestamp1');

            if (reserved_timestamp1 == null) {
                isSamePoDate = false;
                break;
            }

            if (i == 0) {
                rs = reserved_timestamp1;
            } else {
                if (rs != reserved_timestamp1) {
                    isSamePoDate = false;
                    break;
                }
            }
        }

        // if (!isSamePoDate) {
        //     Ext.Msg.alert("알 림", "작성일자가 일치하지 않는 항목이 있습니다.");
        //     return;
        // }


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

            var total = 0;
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                var total_price = rec.get('total_price');
                total = total + total_price;
            }

            if (pjArr.length > 1) {
                Ext.Msg.alert('알림', '같은 프로젝트를  선택해주세요.', function () {
                });
            } else if (supArr.length > 1) {
                Ext.Msg.alert('알림', '같은 공급사를 지정해 주세요.', function () {
                });
            } else if (notDefinedSup == true) {
                Ext.Msg.alert('알림', '공급사를 지정하지 않은 항목이 있습니다.', function () {
                });
            } else {
                var next = gUtil.getNextday(0);

                var productGrid = Ext.create('Ext.grid.Panel', {
                    store: new Ext.data.Store(),
                    cls: 'rfx-panel',
                    id: gu.id('productGrid'),
                    collapsible: false,
                    multiSelect: false,
                    width: 1150,
                    height: 300,
                    margin: '0 0 20 0',
                    autoHeight: true,
                    frame: false,
                    border: true,
                    forceFit: false,
                    columns: [
                        {text: '요청번호', width: 80, dataIndex: 'pr_no', style: 'text-align:center', sortable: false},
                        {text: '품번', width: 100, dataIndex: 'item_code', style: 'text-align:center', sortable: false},
                        {text: '품명', width: 200, dataIndex: 'item_name', style: 'text-align:center', sortable: false},
                        {
                            text: '규격',
                            width: 200,
                            dataIndex: 'specification',
                            style: 'text-align:center',
                            sortable: false
                        },
                        {text: '단위', width: 60, dataIndex: 'unit_code', style: 'text-align:center', sortable: false},
                        {
                            text: '총재고', width: 80, dataIndex: 'stock_qty', sortable: false,
                            // editor: 'textfield',
                            style: 'text-align:center',
                            align: 'right',
                            // css: 'edit-cell',
                            renderer: renderDecimalNumber
                        },
                        {
                            text: '요청수량', width: 80, dataIndex: 'pr_quan', style: 'text-align:center', sortable: false,
                            align: 'right',
                            renderer: renderDecimalNumber
                        },
                        {
                            text: '가용재고', width: 80, dataIndex: 'stock_qty_useful', style: 'text-align:center', sortable: false,
                            align: 'right',
                            renderer: renderDecimalNumber
                        },
                        {
                            text: '주문수량', width: 80, dataIndex: 'quan', sortable: false,
                            // editor: 'textfield',
                            style: 'text-align:center',
                            align: 'right',
                            // css: 'edit-cell',
                            renderer: renderDecimalNumber
                        },
                        {
                            text: '주문단가', width: 80, dataIndex: 'static_sales_price', sortable: false,
                            // editor: 'textfield',
                            style: 'text-align:center',
                            align: 'right',
                            // css: 'edit-cell',
                            renderer: renderDecimalNumber
                        },
                        {text: '계약통화', width: 60, dataIndex: 'contract_currency', style: 'text-align:center', sortable: false},
                        {
                            text: '합계금액',
                            width: 100,
                            dataIndex: 'total_price',
                            style: 'text-align:center',
                            sortable: false,
                            align: 'right',
                            renderer: renderDecimalNumber
                        },
                        {
                            text: '환율',
                            width: 100,
                            dataIndex: 'exchange_rate',
                            style: 'text-align:center',
                            sortable: false,
                            align: 'right',
                            renderer: renderDecimalNumber
                        },
                        {
                            text: '원화금액',
                            width: 150,
                            dataIndex: 'total_price_kor',
                            style: 'text-align:center',
                            sortable: false,
                            align: 'right',
                            renderer: renderDecimalNumber
                        },
                        {
                            text: '납기일', width: 102, dataIndex: 'reserved_timestamp3', style: 'text-align:center', sortable: false,
                            // css: 'edit-cell',
                            // editor: {
                            //     xtype: 'datefield',
                            //     format: 'Y-m-d',
                            //     altFormats: 'm/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j|c'
                            // },
                            format: 'Y-m-d',
                            dateFormat: 'Y-m-d',
                            renderer: Ext.util.Format.dateRenderer('Y-m-d')
                        }
                    ],
                    selModel: 'cellmodel',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    listeners: {
                        edit: function (editor, e, eOpts) {

                            gm.me().editRedord(e.field, e.record);
                        }
                    },
                    dockedItems: []
                });

                for (var i = 0; i < selections.length; i++) {
                    productGrid.getStore().add(selections[i]);
                }

                gm.me().whouseStore.load();

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    layout: 'column',
                    bodyPadding: 10,
                    width: '100%',
                    items: [{
                        xtype: 'fieldset',
                        collapsible: false,
                        title: gm.me().getMC('msg_order_dia_header_title', '공통정보'),
                        width: '100%',
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
                                width: '100%',
                                border: true,
                                defaultMargins: {
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 10
                                },
                                items: [
                                    {
                                        fieldLabel: '주문처',
                                        xtype: 'textfield',
                                        width: '45%',
                                        padding: '0 0 5px 30px',
                                        value: selections[0].get('supplier_name'),
                                        fieldStyle: 'background-color: #ddd; background-image: none;',
                                        readOnly: true
                                    }, {
                                        fieldLabel: '합계금액',
                                        id: gu.id('order_total_price'),
                                        xtype: 'textfield',
                                        width: '45%',
                                        padding: '0 0 5px 30px',
                                        fieldStyle: 'background-color: #ddd; background-image: none;',
                                        value: Ext.util.Format.number(total, '0,00/i') + ' ' + selections[0].get('contract_currency'),
                                        readOnly: true
                                    }, {
                                        fieldLabel: '요약',
                                        xtype: 'textfield',
                                        name: 'item_abst',
                                        width: '45%',
                                        padding: '0 0 5px 30px',
                                        fieldStyle: 'background-color: #ddd; background-image: none;',
                                        value: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
                                        readOnly: true
                                    },
                                    {
                                        fieldLabel: '주문번호',
                                        xtype: 'textfield',
                                        width: '45%',
                                        padding: '0 0 5px 30px',
                                        name: 'po_no',
                                        value: po_no,
                                        fieldStyle: 'background-color: #ddd; background-image: none;',
                                        readOnly: true
                                    },
                                    {
                                        fieldLabel: '납품장소',
                                        xtype: 'combo',
                                        width: '45%',
                                        padding: '0 0 5px 30px',
                                        name: 'reserved_integer1',
                                        store: gm.me().whouseStore,
                                        displayField: 'wh_name',
                                        valueField: 'unique_id_long',
                                        emptyText: '선택',
                                        allowBlank: true,
                                        typeAhead: false,
                                        value: 101,
                                        minChars: 1,
                                        listConfig: {
                                            loadingText: '검색중...',
                                            emptyText: '일치하는 항목 없음.',
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{systemCode}">[{wh_code}] {wh_name}</div>';
                                            }
                                        },
                                        listeners: {
                                            select: function (combo, record) {

                                            }
                                        }
                                    },
                                    // {
                                    //     fieldLabel: '납품장소',
                                    //     xtype: 'textfield',
                                    //     width: '45%',
                                    //     padding: '0 0 5px 30px',
                                    //     name: 'reserved_varchar1',
                                    //     value: '사내',
                                    // },
                                    {
                                        fieldLabel: '요청사항',
                                        xtype: 'textarea',
                                        rows: 4,
                                        width: '45%',
                                        padding: '0 0 5px 30px',
                                        name: 'reserved_varchar2',

                                    },
                                    {
                                        fieldLabel: '작성일자',
                                        xtype: 'datefield',
                                        width: '45%',
                                        padding: '0 0 5px 30px',
                                        name: 'aprv_date',
                                        value: new Date(),
                                        //fieldStyle: 'background-color: #ddd; background-image: none;',
                                        //readOnly: true,
                                        altFormats: 'm/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j|c',
                                        format: 'Y-m-d'
                                    },
                                    {
                                        fieldLabel: '결제 조건',
                                        xtype: 'combo',
                                        width: '45%',
                                        padding: '0 0 5px 30px',
                                        name: 'pay_condition',
                                        store: gm.me().payConditionStore,
                                        displayField: 'codeName',
                                        valueField: 'systemCode',
                                        emptyText: '선택',
                                        allowBlank: true,
                                        typeAhead: false,
                                        value: selections[0].get('payment_method'),
                                        minChars: 1,
                                        listConfig: {
                                            loadingText: '검색중...',
                                            emptyText: '일치하는 항목 없음.',
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{systemCode}">{codeName}</div>';
                                            }
                                        },
                                        listeners: {
                                            select: function (combo, record) {
                                                //gu.getCmp('pay_condition').setValue(record.get('codeName'));
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }, {
                        xtype: 'fieldset',
                        frame: true,
                        title: gm.me().getMC('msg_order_dia_prd_header_title', '상세정보'),
                        width: '100%',
                        height: '100%',
                        layout: 'fit',
                        bodyPadding: 10,
                        defaults: {
                            margin: '2 2 2 2'
                        },
                        items: [
                            productGrid
                        ]
                    }
                    ]
                });

                var myWidth = 1200;
                var myHeight = 650;

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

                            var store = gu.getCmp('productGrid').getStore();
                            var selections = (store.getData().getSource() || store.getData()).getRange();

                            var pjArr = [];
                            var supArr = [];
                            var cartmapUids = [];
                            var exchange_rates = [];
                            var req_delivery_dates = [];

                            for (var i = 0; i < selections.length; i++) {
                                var rec = selections[i];
                                console_logs('rec', rec);
                                var coord_key1 = rec.get('coord_key1');
                                pjArr.push(rec.get('pj_code'));
                                supArr.push(coord_key1);
                                cartmapUids.push(rec.get('id'));
                                exchange_rates.push(rec.get('exchange_rate'));
                                req_delivery_dates.push(rec.get('reserved_timestamp3'));
                            }

                            if (btn == "no") {
                                prWin.close();
                            } else {

                                form.add(new Ext.form.Hidden({
                                    name: 'unique_uids',
                                    value: cartmapUids
                                }));

                                form.add(new Ext.form.Hidden({
                                    name: 'coord_key1',
                                    value: selections[0].get('coord_key1')
                                }));

                                form.add(new Ext.form.Hidden({
                                    name: 'coord_key3',
                                    value: selections[0].get('coord_key3')
                                }));

                                form.add(new Ext.form.Hidden({
                                    name: 'ac_uid',
                                    value: selections[0].get('ac_uid')
                                }));

                                form.add(new Ext.form.Hidden({
                                    name: 'req_date',
                                    value: selections[0].get('req_date')
                                }));

                                form.add(new Ext.form.Hidden({
                                    name: 'sales_price',
                                    value: total
                                }));

                                form.add(new Ext.form.Hidden({
                                    name: 'exchange_rates',
                                    value: exchange_rates
                                }));

                                form.add(new Ext.form.Hidden({
                                    name: 'req_delivery_dates',
                                    value: req_delivery_dates
                                }));


                                if (form.isValid()) {
                                    prWin.setLoading(true);

                                    var val = form.getValues(false);

                                    console_logs('val', val);
                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createPoContract',
                                        params: val,
                                        success: function (val, action) {
                                            prWin.setLoading(false);

                                            prWin.close();
                                            gm.me().store.load(function () {
                                            });
                                        },
                                        failure: function (val, action) {
                                            prWin.setLoading(false);

                                            prWin.close();
                                            gm.me().store.load(function () {
                                            });

                                        }
                                    })
                                }  // end of formvalid
                            }//else
                        }
                    },
                        {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }]
                });
                prWin.show();
            }

        }

    },
    treatInPo: function () {

        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;

        var next = gUtil.getNextday(0);

        var request_date = gm.me().request_date;
        var pj_name = gm.me().vSELECTED_pj_name;
        var stock_qty_useful = gm.me().vSELECTED_STOCK_USEFUL;

        var form = null;

        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알 림", "선택된 자재가 없습니다.");
        } else {
            if (stock_qty_useful == undefined || stock_qty_useful == "" || stock_qty_useful == null) {
                Ext.Msg.alert("알 림", "가용재고가 없습니다. 확인해주세요.");
            } else {
                this.treatPaperAddInPoRoll();
            }
        }

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
            case 'reserved_timestamp1':
            case 'reserved_timestamp3':
                gm.editAjax('cartmap', field, rec.get(field), 'unique_id', rec.get('unique_uid'), {type:''});
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
        var reserved_timestamp1 = rec.get('reserved_timestamp1');
        console_logs('====> unique_id', unique_id);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updateCreatePo',
            params: {
                quan: quan,
                child: child,
                static_sales_price: static_sales_price,
                cart_currency: cart_currency,
                req_date: req_date,
                unique_id: unique_id,
                reserved_timestamp1: reserved_timestamp1
            },
            success: function (result, request) {

                var result = result.responseText;
                gm.me().store.load(function(record) {

                    if (gu.getCmp('productGrid') !== undefined) {
                        var store = gu.getCmp('productGrid').getStore();
                        //var selections = (store.getData().getSource() || store.getData()).getRange();

                        store.removeAll();

                        var selections = gm.me().grid.getSelectionModel().getSelection();

                        for (var i = 0; i < selections.length; i++) {
                            store.add(selections[i]);
                        }

                        var total = 0;
                        for (var i = 0; i < selections.length; i++) {
                            var rec = selections[i];
                            var total_price = rec.get('total_price');
                            total = total + total_price;
                        }

                        gu.getCmp('order_total_price').setValue(Ext.util.Format.number(total, '0,00/i')
                            + ' ' + selections[0].get('contract_currency'));
                    }

                });
            },
            failure: extjsUtil.failureMessage
        });
    },


    calcAge: function (quan, sales_price) {
        return quan * sales_price;


    },
    getPrice: function (total_price) {
        console_logs('total_price++++++++', total_price);
        var uniqueId = gm.me().vSELECTED_PJ_UID;
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updatePrice',
            params: {
                cartmapUids: this.cartmap_uids,
                total_price: total_price
            },

            success: function (result, request) {
                gm.me().store.load();
//				Ext.Msg.alert('안내', '복사가 완료 되었습니다.', function() {});

            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax
    },

    getTableName: function (field_name) {
        //		console_logs('getTableName field_name', field_name);
        var fields = this.getFields();
        for (var i = 0; i < fields.length; i++) {
            var o = fields[i];
            //			console_logs('getTableName o', o);
            if (field_name == o['name']) {
                return o['tableName'];
            }
        }
        return null;
    },

    checkEqualPjNames: function (rec) {
        console_logs('rec+++++++++++++in check' + rec);
    },
    // 사내발주 submit
    Inprwinopen: function (form) {
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
                    var msg = '사내 발주하시겠습니까?';
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
                                var pj_name = rec.get('pj_name');
                                var static_sales_price = rec.get('static_sales_price'); //cartmap.sales_price

                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    console_logs('val', val);

                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createGo',
                                        params: {
                                            sancType: 'YES',
                                            reserved_varchar2: reserved_varchar2,
                                            reserved_varchar1: reserved_varchar1,
                                            item_name: item_name,
                                            cartmaparr: cartmapArr,
                                            srcahdarr: srcahdArr,
                                            quans: quanArr,
                                            currencies: curArr,
                                            names: nameArr,
                                            coord_key3s: coordArr,
                                            sales_prices: priceArr,
                                            pj_name: pj_name,
                                            mp_status: 'GR'
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

    supastSearchActivation: function (combo, e, eOpts) {

        gm.me().myVar = setTimeout(function () {
            gm.me().contractMatStore.getProxy().setExtraParam('supplier_name', '%' + combo.rawValue + '%');
            gm.me().contractMatStore.load();
            combo.expand();
        }, 500);
    },
    payConditionStore: Ext.create('Mplm.store.CommonCodeExStore', {parentCode: 'PAYMENT_METHOD'}),
    whouseStore: Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {})
});
