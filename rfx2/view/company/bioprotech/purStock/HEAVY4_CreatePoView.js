//주문작성
Ext.define('Rfx2.view.company.bioprotech.purStock.HEAVY4_CreatePoView', {
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
            edate: new Date()
        });

        this.addSearchField('item_code');
        this.addSearchField('supplier_name');
        this.addSearchField('item_name');
        this.addSearchField('specification');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        this.localSize = gm.unlimitedPageSize;  
        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.bioprotech.CreatePo',
            pageSize: this.localSize,
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

        this.readAndPublicStore = Ext.create('Rfx2.store.BufferStore', {});
        this.readAndPublicStore.getProxy().setExtraParam('group_uid', vCUR_USER_UID);
        this.readAndPublicStore.getProxy().setExtraParam('type', 'READ_AND_PUBLIC');
        this.readAndPublicStore.getProxy().setExtraParam('v001', 'PR');
        this.readAndPublicStore.getProxy().setExtraParam('target_uid', -1);
        this.readAndPublicStore.load();

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
                        // forceSelection: true,
                        editable: false,
                        // queryMode: 'remote',
                        allowBlank: false,
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function () {
                                return "<div>{supplier_name} ({sales_price} {currency})</div>";
                            }
                        },
                        editable: false,
                        multiSelect: false,
                        // selectOnFocus: true,
                        listeners: {
                            activate: function( eventObj, eOpts ) { console_logs('EVENTS', 'activate') },
                            added: function( eventObj, container, pos, eOpts ) { console_logs('EVENTS', 'added') },
                            afterlayoutanimation: function( eventObj, eOpts ) { console_logs('EVENTS', 'afterrender') },
                            afterrender: function( eventObj, eOpts ) { console_logs('EVENTS', 'afterrender') },
                            autosize: function( eventObj, width, eOpts ) { console_logs('EVENTS', 'autosize') },
                            beforeactivate: function( eventObj, eOpts ) { console_logs('EVENTS', '') },
                            beforedeactivate: function( eventObj, eOpts ) { console_logs('EVENTS', 'beforedeactivate') },
                            beforedeselect: function( combo, record, index, eOpts ) { console_logs('EVENTS', 'beforedeselect') },
                            beforedestroy: function( eventObj, eOpts ) { console_logs('EVENTS', 'beforedestroy') },
                            beforehide: function( eventObj, eOpts ) { console_logs('EVENTS', 'beforehide') },
                            beforequery: function( queryPlan, eOpts ) { console_logs('EVENTS', 'beforequery') },
                            beforerender: function( eventObj, eOpts ) { console_logs('EVENTS', 'beforerender') },
                            beforeselect: function( combo, record, index, eOpts ) { console_logs('EVENTS', 'beforeselect') },
                            beforeshow: function( eventObj, eOpts ) { console_logs('EVENTS', 'beforeshow') },
                            beforestaterestore: function( eventObj, state, eOpts ) { console_logs('EVENTS', 'beforestaterestore') },
                            beforestatesave: function( eventObj, state, eOpts ) { console_logs('EVENTS', 'beforestatesave') },
                            blur: function( eventObj, event, eOpts ) { console_logs('EVENTS', 'blur') },
                            boxready: function( eventObj, width, height, eOpts ) { console_logs('EVENTS', 'boxready') },
                            change: function( eventObj, newValue, oldValue, eOpts ) {
                                console_logs('EVENTS', 'change');
                            },
                            collapse: function( field, eOpts ) { console_logs('EVENTS', 'collapse') },
                            deactivate: function( eventObj, eOpts ) { console_logs('EVENTS', 'deactivate') },
                            destroy: function( eventObj, eOpts ) { console_logs('EVENTS', 'destroy') },
                            dirtychange: function( eventObj, isDirty, eOpts ) { console_logs('EVENTS', 'dirtychange') },
                            disable: function( eventObj, eOpts ) { console_logs('EVENTS', 'disable') },
                            enable: function( eventObj, eOpts ) { console_logs('EVENTS', 'enable') },
                            errorchange: function( eventObj, error, eOpts ) { console_logs('EVENTS', 'errorchange') },
                            expand: function( field, eOpts ) { console_logs('EVENTS', 'expand') },
                            focus: function( eventObj, event, eOpts ) { console_logs('EVENTS', 'focus') },
                            focusenter: function( eventObj, event, eOpts ) {
                                console_logs('EVENTS', 'focusenter');
                            },
                            focusleave: function( eventObj, event, eOpts ) { console_logs('EVENTS', 'focusleave') },
                            hide: function( eventObj, eOpts ) { console_logs('EVENTS', 'hide') },
                            keydown: function( eventObj, e, eOpts ) { console_logs('EVENTS', 'keydown') },
                            keypress: function( eventObj, e, eOpts ) { console_logs('EVENTS', 'keypress') },
                            keyup: function( eventObj, e, eOpts ) { console_logs('EVENTS', 'keyup') },
                            move: function( eventObj, x, y, eOpts ) { console_logs('EVENTS', 'move') },
                            removed: function( eventObj, ownerCt, eOpts ) { console_logs('EVENTS', 'removed') },
                            render: function( eventObj, eOpts ) { console_logs('EVENTS', 'render') },
                            resize: function( eventObj, width, height, oldWidth, oldHeight, eOpts ) { console_logs('EVENTS', 'resize') },
                            show: function( eventObj, eOpts ) { console_logs('EVENTS', 'specialkey') },
                            staterestore: function( eventObj, state, eOpts ) { console_logs('EVENTS', 'statesave') },
                            statesave: function( eventObj, state, eOpts ) { console_logs('EVENTS', '') },
                            validitychange: function( eventObj, isValid, eOpts ) { console_logs('EVENTS', 'validitychange') },
                            writeablechange: function( eventObj, Read, eOpts ) { console_logs('EVENTS', 'writeablechange') },
                            focus: function (eventObj, event, eOpts) {
                                console_logs('EVENTS', 'focus');
                                var combo = this;
                                combo.expand();
                                var child = gm.me().store.getAt(combo.column.field.container.component.context.rowIdx).get('child');
                                this.store.getProxy().setExtraParam('srcahd_uid', child);
                                this.store.load();
                            },
                            select: function (combo, record, eOpts) {
                                console_logs('EVENTS', 'select');
                                var cartmapUid = gm.me().store.getAt(combo.column.field.container.component.context.rowIdx).get('unique_uid');
                                gm.editAjax('cartmap', 'coord_key1', record.get('supast_uid'), 'unique_id', cartmapUid, {type: ''});
                                gm.editAjax('cartmap', 'sales_price', record.get('sales_price'), 'unique_id', cartmapUid, {type: ''});
                                gm.editAjax('cartmap', 'reserved_varchar4', record.get('currency'), 'unique_id', cartmapUid, {type: ''});
                            },
                            specialkey: function (f, e) {
                                console_logs('EVENTS', 'specialkey');
                                // 다음 row의 cell editing

                                if (e.getKey() == Ext.EventObject.ENTER && gm.me().nextRow == true) {
                                    var grid = gm.me().grid;
                                    var code = e.getCharCode();

                                    var maxRows = grid.store.data.length;
                                    var maxColumns = grid.columns.length;
                                    var rowSelected = f.column.field.container.component.context.rowIdx;
                                    var colSelected = f.column.field.container.component.context.colIdx;

                                    if (maxRows > rowSelected) {
                                        grid.editingPlugin.startEditByPosition({
                                            row: rowSelected + 1,
                                            column: colSelected
                                        });
                                        grid.selModel.doSelect(grid.store.data.items[rowSelected + 1]);
                                        grid.editingPlugin.edit();
                                    }
                                }
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
        this.createGridCore(arr);
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
            hidden: gu.setCustomBtnHiddenProp('createPoAction'),
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
            hidden: gu.setCustomBtnHiddenProp('mergePrAction'),
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
            hidden: gu.setCustomBtnHiddenProp('splitPrAction'),
            handler: function () {

                var length = gm.me().grid.getSelectionModel().getSelection().length;

                if (length > 1) {
                    Ext.Msg.alert('경고', '품목 하나를 선택하시기 바랍니다.');
                    return;
                }

                var msg = '해당 구매 요청을 분할하시겠습니까?</br><font color="red">' +
                    '<b>이 요청은 되돌리기가 불가능합니다!</b></font>';

                Ext.MessageBox.show({
                    title: '경고',
                    msg: msg,
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=dupPurchaseRequest',
                                params: {
                                    cartmap_uid: rec.get('unique_uid')
                                },
                                success: function (result, request) {
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                });
            }
        });

        buttonToolbar.insert(3, this.mergePrAction);
        buttonToolbar.insert(3, this.splitPrAction);
        buttonToolbar.insert(3, this.createPoAction);

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length > 0) {

                var rec = selections[0];
                gm.me().rec = rec;

                var standard_flag = rec.get('standard_flag');
                standard_flag = gUtil.stripHighlight(standard_flag);  //하이라이트 삭제

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
                var pj_name = gm.me().vSELECTED_pj_name;

                this.cartmap_uids.push(gm.me().vSELECTED_UNIQUE_ID);

                gm.me().createPoAction.enable();
                gm.me().splitPrAction.enable();
                gm.me().mergePrAction.enable();

            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().vSELECTED_PJ_UID = -1;

                gm.me().createPoAction.disable();
                gm.me().splitPrAction.enable();
                gm.me().mergePrAction.enable();

                this.cartmap_uids = [];
                this.currencies = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    var currencies = rec1.get('contract_currency');
                    this.cartmap_uids.push(uids);
                    this.currencies.push(currencies);
                }
            }

        })

        //디폴트 로드
        gm.setCenterLoading(false);

        this.store.getProxy().setExtraParam('orderBy', 'supast.supplier_name asc, rtgast_pr.po_no asc, cartmap.pl_no asc');
        this.store.load(function (records) {
        });

        this.supastStore.load();
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
        var isExistOut = false; // 외주인 품목이 존재
        var isNotOut = false;   // 외주가 아닌 품목이 존재 (외주인 품목과 동시에 존재하면 안됨)
        var isSamePoDate = true;
        var rs = null;
        var reserved_timestamp1 = null;

        for (var i = 0; i < selections.length; i++) {
            var rt1 = selections[i].get('reserved_timestamp1');

            if (typeof rt1 !== 'string') {
                reserved_timestamp1 = Ext.Date.format(rt1, "Y-m-d");
            } else {
                reserved_timestamp1 = rt1;
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

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var workingArea = rec.get('working_area');

            if (workingArea == 'OUT') {
                isExistOut = true;
            } else {
                isNotOut = true;
            }
        }

        if (isExistOut && isNotOut) {
            Ext.Msg.alert('알 림', '외주로 주문할 품목과 그렇지 않은 품목을 동시에 주문할 수 없습니다.');
            return;
        }

        if (!isSamePoDate) {
            Ext.Msg.alert("알 림", "작성일자가 일치하지 않는 항목이 있습니다.");
            return;
        }

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
                    height: 270,
                    margin: '0 0 20 0',
                    autoHeight: true,
                    frame: false,
                    border: true,
                    forceFit: false,
                    viewConfig: {
                        markDirty: false
                    },
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
                            text: '가용재고',
                            width: 80,
                            dataIndex: 'stock_qty_useful',
                            style: 'text-align:center',
                            sortable: false,
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
                        {
                            text: '계약통화',
                            width: 60,
                            dataIndex: 'cart_currency',
                            style: 'text-align:center',
                            sortable: false
                        },
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
                            text: '납기일',
                            width: 102,
                            dataIndex: 'reserved_timestamp3',
                            style: 'text-align:center',
                            sortable: false,
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

                var srcahdUids = [];

                for (var i = 0; i < selections.length; i++) {
                    productGrid.getStore().add(selections[i]);
                    srcahdUids.push(selections[i].get('unique_id_long'));
                }

                gm.me().whouseStore.load();

                gm.me().fileInfoStore.getProxy().setExtraParam('group_codes', srcahdUids);
                gm.me().fileInfoStore.getProxy().setExtraParam('srccst_varchar2_list', 'DES,IIS');
                gm.me().fileInfoStore.load();

                this.rtgapp_store = Ext.create('Rfx2.store.RtgappStore', {});
                this.rtgapp_store.getProxy().setExtraParam('change_type', 'D');
                this.rtgapp_store.getProxy().setExtraParam('app_type', 'PR');

                this.rtgapp_store.load();

                var userStore = Ext.create('Rfx2.store.company.bioprotech.UsrAstStore', {});
                userStore.getProxy().setExtraParam('email', '%protechsite.com%');
                userStore.getProxy().setExtraParam('limit', 1000);
                userStore.load();

                var removeRtgapp = Ext.create('Ext.Action', {
                    itemId: 'removeRtgapp',
                    iconCls: 'af-remove',
                    text: CMD_DELETE,
                    disabled: true,
                    handler: function (widget, event) {
                        Ext.MessageBox.show({
                            title: delete_msg_title,
                            msg: delete_msg_content,
                            buttons: Ext.MessageBox.YESNO,
                            fn: gm.me().deleteRtgappConfirm,
                            // animateTarget: 'mb4',
                            icon: Ext.MessageBox.QUESTION
                        });
                    }
                });

                var updown =
                    {
                        text: '이동',
                        menuDisabled: true,
                        sortable: false,
                        xtype: 'actioncolumn',
                        width: 70,
                        align: 'center',
                        items: [{
                            icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/up.png',
                            tooltip: 'Up',
                            handler: function (agridV, rowIndex, colIndex) {
                                var record = gm.me().agrid.getStore().getAt(rowIndex);

                                var unique_id = record.get('unique_id');

                                var direcition = -15;

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappWithType',
                                    params: {
                                        direcition: direcition,
                                        unique_id: unique_id,
                                        appType: 'PR'
                                    },
                                    success: function (result, request) {
                                        gm.me().rtgapp_store.load(function () {
                                        });
                                    }
                                });

                            }


                        }, '-',
                            {
                                icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/down.png',
                                tooltip: 'Down',
                                handler: function (agridV, rowIndex, colIndex) {

                                    var record = gm.me().agrid.getStore().getAt(rowIndex);

                                    var unique_id = record.get('unique_id');

                                    var direcition = 15;
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappWithType',
                                        params: {
                                            direcition: direcition,
                                            unique_id: unique_id,
                                            appType: 'PR'
                                        },
                                        success: function (result, request) {
                                            gm.me().rtgapp_store.load(function () {
                                            });
                                        }
                                    });
                                }

                            }]
                    };

                var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false});

                this.agrid = Ext.create('Ext.grid.Panel', {
                    cls: 'rfx-panel',
                    id: gu.id('rtgAppGrid'),
                    collapsible: false,
                    multiSelect: false,
                    viewConfig: {
                        markDirty: false
                    },
                    width: 1150,
                    height: 150,
                    margin: '0 0 20 0',
                    autoHeight: true,
                    forceFit: false,
                    store: this.rtgapp_store,
                    border: true,
                    frame: true,
                    selModel: selModel,
                    columns: [
                        {dataIndex: 'seq_no', text: '순서', width: 70, sortable: false},
                        {
                            dataIndex: 'groupware_id', text: '아이디(그룹웨어)', width: 150, sortable: false,
                            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                                var email = record.get('email');
                                var emailSplit = email.split('@');
                                var groupwareId = emailSplit[0];

                                record.set('groupware_id', groupwareId);

                                return groupwareId;
                            }
                        }, {dataIndex: 'user_name', text: '이름', flex: 1, sortable: false}
                        , {dataIndex: 'dept_name', text: '부서 명', width: 90, sortable: false}
                        , {dataIndex: 'gubun', text: '구분', width: 50, sortable: false}
                        , updown
                    ],
                    border: false,
                    multiSelect: true,
                    frame: false,
                    dockedItems: [{
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default2',
                        items: [
                            {
                                xtype: 'label',
                                labelWidth: 20,
                                text: '합의'
                            }, {
                                id: gu.id('user_name_a'),
                                name: 'user_name_a',
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                store: userStore,
                                labelSeparator: ':',
                                emptyText: dbm1_name_input,
                                displayField: 'user_name',
                                valueField: 'unique_id',
                                sortInfo: {field: 'user_name', direction: 'ASC'},
                                typeAhead: false,
                                hideLabel: true,
                                minChars: 2,
                                width: 250,
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {

                                        var unique_id = record.get('unique_id');
                                        var user_id = record.get('user_id');

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappWithType',
                                            params: {
                                                useruid: unique_id,
                                                userid: user_id,
                                                gubun: 'S',
                                                appType: 'PR'
                                            },
                                            success: function (result, request) {
                                                var result = result.responseText;

                                                if (result == 'false') {
                                                    Ext.MessageBox.alert(error_msg_prompt, '동일한 사용자가 존재합니다.');
                                                } else {
                                                    gm.me().rtgapp_store.load(function () {
                                                    });
                                                }
                                            },
                                            failure: extjsUtil.failureMessage
                                        });
                                    }// endofselect
                                }
                            },
                            '-',
                            {
                                xtype: 'label',
                                labelWidth: 20,
                                text: '결재'

                            }, {
                                id: gu.id('user_name_b'),
                                name: 'user_name_b',
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                store: userStore,
                                labelSeparator: ':',
                                emptyText: dbm1_name_input,
                                displayField: 'user_name',
                                valueField: 'unique_id',
                                sortInfo: {field: 'user_name', direction: 'ASC'},
                                typeAhead: false,
                                hideLabel: true,
                                minChars: 2,
                                width: 250,
                                listConfig: {
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                    }
                                },
                                listeners: {
                                    select: function (combo, record) {

                                        var unique_id = record.get('unique_id');
                                        var user_id = record.get('user_id');

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappWithType',
                                            params: {
                                                useruid: unique_id,
                                                userid: user_id,
                                                gubun: 'D',
                                                appType: 'PR'
                                            },
                                            success: function (result, request) {
                                                var result = result.responseText;

                                                if (result == 'false') {
                                                    Ext.MessageBox.alert(error_msg_prompt, '동일한 사용자가 존재합니다.');
                                                } else {
                                                    gm.me().rtgapp_store.load(function () {
                                                    });
                                                }
                                            },
                                            failure: extjsUtil.failureMessage
                                        });
                                    }// endofselect
                                }
                            },
                            '->', removeRtgapp

                        ]// endofitems
                    }] // endofdockeditems

                }); // endof Ext.create('Ext.grid.Panel',

                this.agrid.getSelectionModel().on({
                    selectionchange: function (sm, selections) {
                        if (selections.length) {
                            removeRtgapp.enable();
                        } else {
                            removeRtgapp.disable();
                        }
                    }
                });

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
                        title: gm.me().getMC('msg_order_dia_header_title', '공통/결재 정보'),
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
                                        name: 'supplier_name',
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
                                        fieldLabel: '입고창고',
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
                                        value: 11030245000002,
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
                                        value: gm.me().getAprv_date(selections[0].get('reserved_timestamp1')),
                                        fieldStyle: 'background-color: #ddd; background-image: none;',
                                        readOnly: true,
                                        altFormats: 'm/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j|c',
                                        format: 'Y-m-d'
                                    },
                                    {
                                        fieldLabel: '결제 조건',
                                        xtype: 'combo',
                                        width: '34.5%',
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
                                            added: function (sender, container, index, eOpts) {

                                                for (var i = 0; i < this.store.getCount(); i++) {
                                                    var rec = this.store.getAt(i);

                                                    if (rec.get('systemCode') == selections[0].get('payment_method')) {
                                                        gm.me().selectedPayCondition = rec.get('codeName');
                                                        break;
                                                    }
                                                }
                                            },
                                            select: function (combo, record) {
                                                gm.me().selectedPayCondition = record.get('codeName');
                                            }
                                        }
                                    },
                                    {
                                        fieldLabel: '과세여부',
                                        xtype: 'checkbox',
                                        labelWidth: 70,
                                        width: '9%',
                                        value: true,
                                        padding: '0 0 5px 30px',
                                        name: 'cartmap_varchar1'
                                    }, {
                                        xtype: 'tagfield',
                                        width: '92.8%',
                                        padding: '0 0 5px 30px',
                                        fieldLabel: '열람자',
                                        name: 'reader_list',
                                        id: gu.id('reader_list'),
                                        store: userStore,
                                        queryMode: 'local',
                                        listConfig: {
                                            loadingText: 'Searching...',
                                            emptyText: 'No matching posts found.',
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                            }
                                        },
                                        displayField: 'user_name',
                                        valueField: 'email',
                                        filterPickList: true,
                                        listeners: {
                                            afterrender: function () {
                                                var store = gm.me().readAndPublicStore;
                                                for (var i = 0; i < store.count(); i++) {
                                                    var rec = store.getAt(i);
                                                    var v000 = rec.get('v000');
                                                    if (v000 == 'READ') {
                                                        var values = [];
                                                        for (var j = 2; j < 30; j++) {
                                                            var value = rec.get('v' + (j > 9 ? (j > 99 ? j : "0" + j) : "00" + j));
                                                            if (value == null || value.length == 0) {
                                                                break;
                                                            }
                                                            values.push(value);
                                                        }
                                                        gu.getCmp('reader_list').setValue(values);
                                                    }
                                                }
                                            },
                                            select: function (combo, record, eOpts) {
                                                gm.me().updateReadAndPublic(combo, 'READ');
                                            }
                                        }
                                    }, {
                                        xtype: 'tagfield',
                                        width: '92.8%',
                                        padding: '0 0 5px 30px',
                                        fieldLabel: '공람자',
                                        name: 'p_inspector_list',
                                        store: userStore,
                                        queryMode: 'local',
                                        listConfig: {
                                            loadingText: 'Searching...',
                                            emptyText: 'No matching posts found.',
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                            }
                                        },
                                        displayField: 'user_name',
                                        valueField: 'email',
                                        filterPickList: true,
                                        listeners: {
                                            afterrender: function () {
                                                var store = gm.me().readAndPublicStore;
                                                for (var i = 0; i < store.count(); i++) {
                                                    var rec = store.getAt(i);
                                                    var v000 = rec.get('v000');
                                                    if (v000 == 'PUBLIC') {
                                                        var values = [];
                                                        for (var j = 2; j < 30; j++) {
                                                            var value = rec.get('v' + (j > 9 ? (j > 99 ? j : "0" + j) : "00" + j));
                                                            if (value == null || value.length == 0) {
                                                                break;
                                                            }
                                                            values.push(value);
                                                        }
                                                        this.setValue(values);
                                                    }
                                                }
                                            },
                                            select: function (combo, record, eOpts) {
                                                gm.me().updateReadAndPublic(combo, 'PUBLIC');
                                            }
                                        }
                                    },
                                    this.agrid
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
                var myHeight = 880;

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
                            var supastStore = gm.me().supastStore;

                            var poTemplate = Ext.create('Rfx2.view.company.bioprotech.template.PurchaseOrderTemplate');
                            var tempObj = {};

                            var pjArr = [];
                            var supArr = [];
                            var cartmapUids = [];
                            var exchange_rates = [];
                            var req_delivery_dates = [];

                            var tempPos = 1;

                            var total_sum = 0;

                            for (var i = 0; i < selections.length; i++) {
                                var rec = selections[i];

                                var coord_key1 = rec.get('coord_key1');
                                var srcahdUid = rec.get('child');
                                pjArr.push(rec.get('pj_code'));
                                supArr.push(coord_key1);
                                cartmapUids.push(rec.get('id'));
                                exchange_rates.push(rec.get('exchange_rate'));
                                req_delivery_dates.push(typeof rec.get('reserved_timestamp3') === 'string' ?
                                    rec.get('reserved_timestamp3') : Ext.Date.format(rec.get('reserved_timestamp3'), 'Y-m-d'));

                                tempObj['item_name_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = rec.get('item_name');
                                tempObj['specification_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = rec.get('specification');
                                tempObj['unit_code_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = rec.get('unit_code');
                                tempObj['quan_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = Ext.util.Format.number(rec.get('quan'), '0,00.#####');
                                tempObj['sales_price_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = Ext.util.Format.number(rec.get('static_sales_price'), '0,00.#####');
                                tempObj['total_price_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = Ext.util.Format.number(rec.get('total_price'), '0,00.#####');

                                for (var j = 0; j < gm.me().fileInfoStore.getCount(); j++) {
                                    var fileRec = gm.me().fileInfoStore.getAt(j);
                                    var groupCode = fileRec.get('group_code');
                                    var fileType = fileRec.get('srccst_varchar2');
                                    var fileName = fileRec.get('srccst_varchar1');

                                    if (groupCode == srcahdUid && fileType == 'DES') {
                                        tempObj['des_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = fileName;
                                        break;
                                    }
                                }

                                for (var j = 0; j < gm.me().fileInfoStore.count; j++) {
                                    var fileRec = gm.me().fileInfoStore.getAt(j);
                                    var groupCode = fileRec.get('group_code');
                                    var fileType = fileRec.get('srccst_varchar2');
                                    var fileName = fileRec.get('srccst_varchar1');

                                    if (groupCode == srcahdUid && fileType == 'IIS') {
                                        tempObj['iis_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = fileName;
                                        break;
                                    }
                                }


                                if (i == 0) {
                                    tempObj['payment_deadline'] = Ext.Date.format(rec.get('reserved_timestamp3'), 'Y년 m월 d일');
                                }

                                total_sum = total_sum + rec.get('total_price');

                                tempPos++;
                            }

                            for (var i = 0; i < supastStore.getCount(); i++) {
                                var rec = supastStore.getAt(i);
                                var coord_key1 = selections[0].get('coord_key1');

                                if (rec.get('unique_id_long') == coord_key1) {

                                    tempObj['sales_person_name'] = rec.get('sales_person1_name');

                                    if (tempObj['sales_person_name'].length > 0) {
                                        tempObj['sales_person_name'] += '님';
                                    }

                                    tempObj['sales_tel_no'] = rec.get('telephone_no');
                                    tempObj['sales_fax_no'] = rec.get('fax_no');
                                    break;
                                }
                            }

                            tempObj['total_sum'] = Ext.util.Format.number(total_sum, '0,00.#####');
                            tempObj['total_tax'] = Ext.util.Format.number(+(total_sum * 0.1).toFixed(5), '0,00.#####');
                            tempObj['total_sum_tax'] = Ext.util.Format.number(+(total_sum * 1.1).toFixed(5), '0,00.#####');


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
                                    name: 'working_area',
                                    value: selections[0].get('working_area')
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

                                    var items = gm.me().rtgapp_store.data.items;

                                    if (items.length < 2) {
                                        Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                                        return;
                                    }

                                    var ahid_userlist = new Array();
                                    var ahid_userlist_role = new Array();
                                    var ahid_userlist_id = new Array();

                                    for (var i = 0; i < items.length; i++) {
                                        var rec = items[i];

                                        ahid_userlist.push(rec.get('usrast_unique_id'));
                                        ahid_userlist_role.push(rec.get('gubun'));
                                        ahid_userlist_id.push(rec.get('groupware_id'));
                                    }
                                    val['hid_userlist'] = ahid_userlist;
                                    val['hid_userlist_role'] = ahid_userlist_role;
                                    val['hid_userlist_id'] = ahid_userlist_id;

                                    tempObj['supplier_name'] = val['supplier_name'];
                                    tempObj['po_user_name'] = vCUR_USER_NAME;
                                    tempObj['aprv_date'] = val['aprv_date'];
                                    tempObj['pay_condition'] = gm.me().selectedPayCondition;
                                    tempObj['requested_term'] = val['reserved_varchar2'];
                                    tempObj['po_no'] = val['po_no'];

                                    var result = poTemplate.apply(tempObj);

                                    result = result.replace(/"/g, '\\"').replace(/\n/g, '').replace(/\t/g, '').replace(/  /g, '');

                                    val['purchase_order_html'] = result;

                                    if (val['cartmap_varchar1'] == 'on') {
                                        val['cartmap_varchar1'] = 'Y';
                                    } else {
                                        val['cartmap_varchar1'] = 'N';
                                    }

                                    var reader = val['reader_list'];
                                    var inspector = val['p_inspector_list'];

                                    var newReader = [];
                                    var newInspector = [];

                                    for (var i = 0; i < reader.length; i++) {

                                        if (reader[i] !== '') {
                                            var emailSplit = reader[i].split('@');
                                            var groupwareId = emailSplit[0];
                                            newReader.push(groupwareId);
                                        }
                                    }

                                    for (var i = 0; i < inspector.length; i++) {
                                        if (inspector[i] !== '') {
                                            var emailSplit = inspector[i].split('@');
                                            var groupwareId = emailSplit[0];
                                            newInspector.push(groupwareId);
                                        }
                                    }

                                    val['readerList'] = newReader;
                                    val['pInspectorList'] = newInspector;

                                    Ext.Ajax.request({
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
                                    });

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

    // treatOutPo: function (po_no) {
    //
    //     var selections = gm.me().grid.getSelectionModel().getSelection();
    //     var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
    //     var next = gUtil.getNextday(0);
    //     var request_date = gm.me().request_date;
    //
    //     var isSamePoDate = true;
    //     var rs = null;
    //
    //     for (var i = 0; i < selections.length; i++) {
    //         var reserved_timestamp1 = selections[i].get('reserved_timestamp1');
    //
    //         if (reserved_timestamp1 == null) {
    //             isSamePoDate = false;
    //             break;
    //         }
    //
    //         if (i == 0) {
    //             rs = reserved_timestamp1;
    //         } else {
    //             if (rs != reserved_timestamp1) {
    //                 isSamePoDate = false;
    //                 break;
    //             }
    //         }
    //     }
    //
    //     if (!isSamePoDate) {
    //         Ext.Msg.alert("알 림", "작성일자가 일치하지 않는 항목이 있습니다.");
    //         return;
    //     }
    //
    //     if (uniqueId == undefined || uniqueId < 0) {
    //         Ext.Msg.alert("알 림", "선택된 자재가 없습니다.");
    //     } else {
    //
    //         var form = null;
    //         var pjArr = [];
    //         var supArr = [];
    //         var cartmapUids = [];
    //         var exchange_rates = [];
    //         var notDefinedSup = false;
    //
    //         for (var i = 0; i < selections.length; i++) {
    //             var rec = selections[i];
    //
    //             var coord_key1 = rec.get('coord_key1');
    //             if (coord_key1 == undefined || coord_key1 == null || coord_key1 == '' || coord_key1 < 0) {
    //                 notDefinedSup = true;
    //             }
    //             pjArr.push(rec.get('pj_code'));
    //             supArr.push(coord_key1);
    //             cartmapUids.push(rec.get('id'));
    //             exchange_rates.push(rec.get('exchange_rate'));
    //         }
    //
    //         pjArr = gu.removeDupArray(pjArr);
    //         supArr = gu.removeDupArray(supArr);
    //
    //         var total = 0;
    //         for (var i = 0; i < selections.length; i++) {
    //             var rec = selections[i];
    //             var total_price = rec.get('total_price');
    //             total = total + total_price;
    //         }
    //
    //         if (pjArr.length > 1) {
    //             Ext.Msg.alert('알림', '같은 프로젝트를  선택해주세요.', function () {
    //             });
    //         } else if (supArr.length > 1) {
    //             Ext.Msg.alert('알림', '같은 공급사를 지정해 주세요.', function () {
    //             });
    //         } else if (notDefinedSup == true) {
    //             Ext.Msg.alert('알림', '공급사를 지정하지 않은 항목이 있습니다.', function () {
    //             });
    //         } else {
    //             var next = gUtil.getNextday(0);
    //
    //             var productGrid = Ext.create('Ext.grid.Panel', {
    //                 store: new Ext.data.Store(),
    //                 cls: 'rfx-panel',
    //                 id: gu.id('productGrid'),
    //                 collapsible: false,
    //                 multiSelect: false,
    //                 width: 1150,
    //                 height: 300,
    //                 margin: '0 0 20 0',
    //                 autoHeight: true,
    //                 frame: false,
    //                 border: true,
    //                 forceFit: false,
    //                 columns: [
    //                     {text: '요청번호', width: 80, dataIndex: 'pr_no', style: 'text-align:center', sortable: false},
    //                     {text: '품번', width: 100, dataIndex: 'item_code', style: 'text-align:center', sortable: false},
    //                     {text: '품명', width: 200, dataIndex: 'item_name', style: 'text-align:center', sortable: false},
    //                     {
    //                         text: '규격',
    //                         width: 200,
    //                         dataIndex: 'specification',
    //                         style: 'text-align:center',
    //                         sortable: false
    //                     },
    //                     {text: '단위', width: 60, dataIndex: 'unit_code', style: 'text-align:center', sortable: false},
    //                     {
    //                         text: '총재고', width: 80, dataIndex: 'stock_qty', sortable: false,
    //                         // editor: 'textfield',
    //                         style: 'text-align:center',
    //                         align: 'right',
    //                         // css: 'edit-cell',
    //                         renderer: renderDecimalNumber
    //                     },
    //                     {
    //                         text: '요청수량', width: 80, dataIndex: 'pr_quan', style: 'text-align:center', sortable: false,
    //                         align: 'right',
    //                         renderer: renderDecimalNumber
    //                     },
    //                     {
    //                         text: '가용재고',
    //                         width: 80,
    //                         dataIndex: 'stock_qty_useful',
    //                         style: 'text-align:center',
    //                         sortable: false,
    //                         align: 'right',
    //                         renderer: renderDecimalNumber
    //                     },
    //                     {
    //                         text: '주문수량', width: 80, dataIndex: 'quan', sortable: false,
    //                         // editor: 'textfield',
    //                         style: 'text-align:center',
    //                         align: 'right',
    //                         // css: 'edit-cell',
    //                         renderer: renderDecimalNumber
    //                     },
    //                     {
    //                         text: '주문단가', width: 80, dataIndex: 'static_sales_price', sortable: false,
    //                         // editor: 'textfield',
    //                         style: 'text-align:center',
    //                         align: 'right',
    //                         // css: 'edit-cell',
    //                         renderer: renderDecimalNumber
    //                     },
    //                     {
    //                         text: '계약통화',
    //                         width: 60,
    //                         dataIndex: 'cart_currency',
    //                         style: 'text-align:center',
    //                         sortable: false
    //                     },
    //                     {
    //                         text: '합계금액',
    //                         width: 100,
    //                         dataIndex: 'total_price',
    //                         style: 'text-align:center',
    //                         sortable: false,
    //                         align: 'right',
    //                         renderer: renderDecimalNumber
    //                     },
    //                     {
    //                         text: '환율',
    //                         width: 100,
    //                         dataIndex: 'exchange_rate',
    //                         style: 'text-align:center',
    //                         sortable: false,
    //                         align: 'right',
    //                         renderer: renderDecimalNumber
    //                     },
    //                     {
    //                         text: '원화금액',
    //                         width: 150,
    //                         dataIndex: 'total_price_kor',
    //                         style: 'text-align:center',
    //                         sortable: false,
    //                         align: 'right',
    //                         renderer: renderDecimalNumber
    //                     },
    //                     {
    //                         text: '납기일',
    //                         width: 102,
    //                         dataIndex: 'reserved_timestamp3',
    //                         style: 'text-align:center',
    //                         sortable: false,
    //                         format: 'Y-m-d',
    //                         dateFormat: 'Y-m-d',
    //                         renderer: Ext.util.Format.dateRenderer('Y-m-d')
    //                     }
    //                 ],
    //                 selModel: 'cellmodel',
    //                 plugins: {
    //                     ptype: 'cellediting',
    //                     clicksToEdit: 2,
    //                 },
    //                 listeners: {
    //                     edit: function (editor, e, eOpts) {
    //
    //                         gm.me().editRedord(e.field, e.record);
    //                     }
    //                 },
    //                 dockedItems: []
    //             });
    //
    //             var srcahdUids = [];
    //
    //             for (var i = 0; i < selections.length; i++) {
    //                 productGrid.getStore().add(selections[i]);
    //                 srcahdUids.push(selections[i].get('unique_id_long'));
    //             }
    //
    //             gm.me().whouseStore.load();
    //
    //             gm.me().fileInfoStore.getProxy().setExtraParam('group_codes', srcahdUids);
    //             gm.me().fileInfoStore.getProxy().setExtraParam('srccst_varchar2_list', 'DES,IIS');
    //             gm.me().fileInfoStore.load();
    //
    //             this.rtgapp_store = Ext.create('Rfx2.store.RtgappStore', {});
    //             this.rtgapp_store.getProxy().setExtraParam('change_type', 'D');
    //             this.rtgapp_store.getProxy().setExtraParam('app_type', 'PR');
    //
    //             this.rtgapp_store.load();
    //             var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false});
    //             var removeRtgapp = Ext.create('Ext.Action', {
    //                 itemId: 'removeRtgapp',
    //                 iconCls: 'af-remove',
    //                 text: CMD_DELETE,
    //                 disabled: true,
    //                 handler: function (widget, event) {
    //                     Ext.MessageBox.show({
    //                         title: delete_msg_title,
    //                         msg: delete_msg_content,
    //                         buttons: Ext.MessageBox.YESNO,
    //                         fn: gm.me().deleteRtgappConfirm,
    //                         // animateTarget: 'mb4',
    //                         icon: Ext.MessageBox.QUESTION
    //                     });
    //                 }
    //             });
    //
    //             var updown =
    //                 {
    //                     text: '이동',
    //                     menuDisabled: true,
    //                     sortable: false,
    //                     xtype: 'actioncolumn',
    //                     width: 70,
    //                     align: 'center',
    //                     items: [{
    //                         icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/up.png',
    //                         tooltip: 'Up',
    //                         handler: function (agridV, rowIndex, colIndex) {
    //                             var record = gm.me().agrid.getStore().getAt(rowIndex);
    //
    //                             var unique_id = record.get('unique_id');
    //
    //                             var direcition = -15;
    //
    //                             Ext.Ajax.request({
    //                                 url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappWithType',
    //                                 params: {
    //                                     direcition: direcition,
    //                                     unique_id: unique_id,
    //                                     appType: 'PR'
    //                                 },
    //                                 success: function (result, request) {
    //                                     gm.me().rtgapp_store.load(function () {
    //                                     });
    //                                 }
    //                             });
    //
    //                         }
    //
    //
    //                     }, '-',
    //                         {
    //                             icon: 'http://hosu.io/web_content75' + '/resources/follower/demo/resources/images/down.png',
    //                             tooltip: 'Down',
    //                             handler: function (agridV, rowIndex, colIndex) {
    //
    //                                 var record = gm.me().agrid.getStore().getAt(rowIndex);
    //
    //                                 var unique_id = record.get('unique_id');
    //
    //                                 var direcition = 15;
    //                                 Ext.Ajax.request({
    //                                     url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappWithType',
    //                                     params: {
    //                                         direcition: direcition,
    //                                         unique_id: unique_id,
    //                                         appType: 'PR'
    //                                     },
    //                                     success: function (result, request) {
    //                                         gm.me().rtgapp_store.load(function () {
    //                                         });
    //                                     }
    //                                 });
    //                             }
    //
    //                         }]
    //                 };
    //
    //             var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false});
    //
    //             this.agrid = Ext.create('Ext.grid.Panel', {
    //                 cls: 'rfx-panel',
    //                 id: gu.id('rtgAppGrid'),
    //                 collapsible: false,
    //                 multiSelect: false,
    //                 viewConfig: {
    //                     markDirty: false
    //                 },
    //                 width: 1150,
    //                 height: 150,
    //                 margin: '0 0 20 0',
    //                 autoHeight: true,
    //                 forceFit: false,
    //                 store: this.rtgapp_store,
    //                 border: true,
    //                 frame: true,
    //                 selModel: selModel,
    //                 columns: [
    //                     {dataIndex: 'seq_no', text: '순서', width: 70, sortable: false},
    //                     {
    //                         dataIndex: 'groupware_id', text: '아이디(그룹웨어)', width: 150, sortable: false,
    //                         renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
    //                             var email = record.get('email');
    //                             var emailSplit = email.split('@');
    //                             var groupwareId = emailSplit[0];
    //
    //                             record.set('groupware_id', groupwareId);
    //
    //                             return groupwareId;
    //                         }
    //                     }, {dataIndex: 'user_name', text: '이름', flex: 1, sortable: false}
    //                     , {dataIndex: 'dept_name', text: '부서 명', width: 90, sortable: false}
    //                     , {dataIndex: 'gubun', text: '구분', width: 50, sortable: false}
    //                     , updown
    //                 ],
    //                 border: false,
    //                 multiSelect: true,
    //                 frame: false,
    //                 dockedItems: [{
    //                     xtype: 'toolbar',
    //                     cls: 'my-x-toolbar-default2',
    //                     items: [
    //                         {
    //                             xtype: 'label',
    //                             labelWidth: 20,
    //                             text: '결재 권한자 추가'
    //
    //                         }, {
    //                             id: 'user_name',
    //                             name: 'user_name',
    //                             xtype: 'combo',
    //                             fieldStyle: 'background-color: #FBF8E6; background-image: none;',
    //                             store: userStore,
    //                             labelSeparator: ':',
    //                             emptyText: dbm1_name_input,
    //                             displayField: 'user_name',
    //                             valueField: 'unique_id',
    //                             sortInfo: {field: 'user_name', direction: 'ASC'},
    //                             typeAhead: false,
    //                             hideLabel: true,
    //                             minChars: 2,
    //                             width: 200,
    //                             listConfig: {
    //                                 loadingText: 'Searching...',
    //                                 emptyText: 'No matching posts found.',
    //                                 getInnerTpl: function () {
    //                                     return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
    //                                 }
    //                             },
    //                             listeners: {
    //                                 select: function (combo, record) {
    //
    //                                     var unique_id = record.get('unique_id');
    //                                     var user_id = record.get('user_id');
    //
    //                                     Ext.Ajax.request({
    //                                         url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappWithType',
    //                                         params: {
    //                                             useruid: unique_id,
    //                                             userid: user_id,
    //                                             gubun: 'D',
    //                                             appType: 'PR'
    //                                         },
    //                                         success: function (result, request) {
    //                                             var result = result.responseText;
    //
    //                                             if (result == 'false') {
    //                                                 Ext.MessageBox.alert(error_msg_prompt, '동일한 사용자가 존재합니다.');
    //                                             } else {
    //                                                 gm.me().rtgapp_store.load(function () {
    //                                                 });
    //                                             }
    //                                         },
    //                                         failure: extjsUtil.failureMessage
    //                                     });
    //                                 }// endofselect
    //                             }
    //                         },
    //                         '->', removeRtgapp
    //
    //                     ]// endofitems
    //                 }] // endofdockeditems
    //
    //             }); // endof Ext.create('Ext.grid.Panel',
    //
    //             this.agrid.getSelectionModel().on({
    //                 selectionchange: function (sm, selections) {
    //                     if (selections.length) {
    //                         removeRtgapp.enable();
    //                     } else {
    //                         removeRtgapp.disable();
    //                     }
    //                 }
    //             });
    //
    //             var form = Ext.create('Ext.form.Panel', {
    //                 id: gu.id('formPanel'),
    //                 xtype: 'form',
    //                 frame: false,
    //                 border: false,
    //                 width: '100%',
    //                 layout: 'column',
    //                 bodyPadding: 10,
    //                 width: '100%',
    //                 items: [{
    //                     xtype: 'fieldset',
    //                     collapsible: false,
    //                     title: gm.me().getMC('msg_order_dia_header_title', '공통/결재 정보'),
    //                     width: '100%',
    //                     style: 'padding:10px',
    //                     defaults: {
    //                         labelStyle: 'padding:10px',
    //                         anchor: '100%',
    //                         layout: {
    //                             type: 'column'
    //                         }
    //                     },
    //                     items: [
    //                         {
    //                             xtype: 'container',
    //                             width: '100%',
    //                             border: true,
    //                             defaultMargins: {
    //                                 top: 0,
    //                                 right: 0,
    //                                 bottom: 0,
    //                                 left: 10
    //                             },
    //                             items: [
    //                                 {
    //                                     fieldLabel: '주문처',
    //                                     xtype: 'textfield',
    //                                     name: 'supplier_name',
    //                                     width: '45%',
    //                                     padding: '0 0 5px 30px',
    //                                     value: selections[0].get('supplier_name'),
    //                                     fieldStyle: 'background-color: #ddd; background-image: none;',
    //                                     readOnly: true
    //                                 }, {
    //                                     fieldLabel: '합계금액',
    //                                     id: gu.id('order_total_price'),
    //                                     xtype: 'textfield',
    //                                     width: '45%',
    //                                     padding: '0 0 5px 30px',
    //                                     fieldStyle: 'background-color: #ddd; background-image: none;',
    //                                     value: Ext.util.Format.number(total, '0,00/i') + ' ' + selections[0].get('contract_currency'),
    //                                     readOnly: true
    //                                 }, {
    //                                     fieldLabel: '요약',
    //                                     xtype: 'textfield',
    //                                     name: 'item_abst',
    //                                     width: '45%',
    //                                     padding: '0 0 5px 30px',
    //                                     fieldStyle: 'background-color: #ddd; background-image: none;',
    //                                     value: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
    //                                     readOnly: true
    //                                 },
    //                                 {
    //                                     fieldLabel: '주문번호',
    //                                     xtype: 'textfield',
    //                                     width: '45%',
    //                                     padding: '0 0 5px 30px',
    //                                     name: 'po_no',
    //                                     value: po_no,
    //                                     fieldStyle: 'background-color: #ddd; background-image: none;',
    //                                     readOnly: true
    //                                 },
    //                                 {
    //                                     fieldLabel: '입고창고',
    //                                     xtype: 'combo',
    //                                     width: '45%',
    //                                     padding: '0 0 5px 30px',
    //                                     name: 'reserved_integer1',
    //                                     store: gm.me().whouseStore,
    //                                     displayField: 'wh_name',
    //                                     valueField: 'unique_id_long',
    //                                     emptyText: '선택',
    //                                     allowBlank: true,
    //                                     typeAhead: false,
    //                                     value: 11030245000002,
    //                                     minChars: 1,
    //                                     listConfig: {
    //                                         loadingText: '검색중...',
    //                                         emptyText: '일치하는 항목 없음.',
    //                                         getInnerTpl: function () {
    //                                             return '<div data-qtip="{systemCode}">[{wh_code}] {wh_name}</div>';
    //                                         }
    //                                     },
    //                                     listeners: {
    //                                         select: function (combo, record) {
    //
    //                                         }
    //                                     }
    //                                 },
    //                                 {
    //                                     fieldLabel: '요청사항',
    //                                     xtype: 'textarea',
    //                                     rows: 4,
    //                                     width: '45%',
    //                                     padding: '0 0 5px 30px',
    //                                     name: 'reserved_varchar2',
    //                                 },
    //                                 {
    //                                     fieldLabel: '작성일자',
    //                                     xtype: 'datefield',
    //                                     width: '45%',
    //                                     padding: '0 0 5px 30px',
    //                                     name: 'aprv_date',
    //                                     value: selections[0].get('reserved_timestamp1'),
    //                                     fieldStyle: 'background-color: #ddd; background-image: none;',
    //                                     readOnly: true,
    //                                     altFormats: 'm/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j|c',
    //                                     format: 'Y-m-d'
    //                                 },
    //                                 {
    //                                     fieldLabel: '결제 조건',
    //                                     xtype: 'combo',
    //                                     width: '34.5%',
    //                                     padding: '0 0 5px 30px',
    //                                     name: 'pay_condition',
    //                                     store: gm.me().payConditionStore,
    //                                     displayField: 'codeName',
    //                                     valueField: 'systemCode',
    //                                     emptyText: '선택',
    //                                     allowBlank: true,
    //                                     typeAhead: false,
    //                                     value: selections[0].get('payment_method'),
    //                                     minChars: 1,
    //                                     listConfig: {
    //                                         loadingText: '검색중...',
    //                                         emptyText: '일치하는 항목 없음.',
    //                                         getInnerTpl: function () {
    //                                             return '<div data-qtip="{systemCode}">{codeName}</div>';
    //                                         }
    //                                     },
    //                                     listeners: {
    //                                         added: function (sender, container, index, eOpts) {
    //
    //                                             for (var i = 0; i < this.store.getCount(); i++) {
    //                                                 var rec = this.store.getAt(i);
    //
    //                                                 if (rec.get('systemCode') == selections[0].get('payment_method')) {
    //                                                     gm.me().selectedPayCondition = rec.get('codeName');
    //                                                     break;
    //                                                 }
    //                                             }
    //                                         },
    //                                         select: function (combo, record) {
    //                                             gm.me().selectedPayCondition = record.get('codeName');
    //                                         }
    //                                     }
    //                                 },
    //                                 {
    //                                     fieldLabel: '과세여부',
    //                                     xtype: 'checkbox',
    //                                     labelWidth: 70,
    //                                     width: '9%',
    //                                     value: true,
    //                                     padding: '0 0 5px 30px',
    //                                     name: 'cartmap_varchar1'
    //                                 },
    //                                 {
    //                                     xtype: 'tagfield',
    //                                     width: '92.8%',
    //                                     padding: '0 0 5px 30px',
    //                                     fieldLabel: '열람자',
    //                                     name: 'reader_list',
    //                                     id: gu.id('reader_list'),
    //                                     store: userStore,
    //                                     queryMode: 'local',
    //                                     listConfig: {
    //                                         loadingText: 'Searching...',
    //                                         emptyText: 'No matching posts found.',
    //                                         getInnerTpl: function () {
    //                                             return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
    //                                         }
    //                                     },
    //                                     displayField: 'user_name',
    //                                     valueField: 'email',
    //                                     filterPickList: true,
    //                                     listeners: {
    //                                         afterrender: function () {
    //                                             var store = gm.me().readAndPublicStore;
    //                                             for (var i = 0; i < store.count(); i++) {
    //                                                 var rec = store.getAt(i);
    //                                                 var v000 = rec.get('v000');
    //                                                 if (v000 == 'READ') {
    //                                                     var values = [];
    //                                                     for (var j = 2; j < 30; j++) {
    //                                                         var value = rec.get('v' + (j > 9 ? (j > 99 ? j : "0" + j) : "00" + j));
    //                                                         if (value == null || value.length == 0) {
    //                                                             break;
    //                                                         }
    //                                                         values.push(value);
    //                                                     }
    //                                                     this.setValue(values);
    //                                                 }
    //                                             }
    //                                         },
    //                                         select: function (combo, record, eOpts) {
    //                                             gm.me().updateReadAndPublic(combo, 'READ');
    //                                         }
    //                                     }
    //                                 }, {
    //                                     xtype: 'tagfield',
    //                                     width: '92.8%',
    //                                     padding: '0 0 5px 30px',
    //                                     fieldLabel: '공람자',
    //                                     name: 'p_inspector_list',
    //                                     store: userStore,
    //                                     listConfig: {
    //                                         loadingText: 'Searching...',
    //                                         emptyText: 'No matching posts found.',
    //                                         getInnerTpl: function () {
    //                                             return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
    //                                         }
    //                                     },
    //                                     displayField: 'user_name',
    //                                     valueField: 'email',
    //                                     filterPickList: true,
    //                                     listeners: {
    //                                         afterrender: function () {
    //                                             var store = gm.me().readAndPublicStore;
    //                                             for (var i = 0; i < store.count(); i++) {
    //                                                 var rec = store.getAt(i);
    //                                                 var v000 = rec.get('v000');
    //                                                 if (v000 == 'PUBLIC') {
    //                                                     var values = [];
    //                                                     for (var j = 2; j < 30; j++) {
    //                                                         var value = rec.get('v' + (j > 9 ? (j > 99 ? j : "0" + j) : "00" + j));
    //                                                         if (value == null || value.length == 0) {
    //                                                             break;
    //                                                         }
    //                                                         values.push(value);
    //                                                     }
    //                                                     this.setValue(values);
    //                                                 }
    //                                             }
    //                                         },
    //                                         select: function (combo, record, eOpts) {
    //                                             gm.me().updateReadAndPublic(combo, 'PUBLIC');
    //                                         }
    //                                     }
    //                                 },
    //                             ]
    //                         }
    //                     ]
    //                 }, {
    //                     xtype: 'fieldset',
    //                     frame: true,
    //                     title: gm.me().getMC('msg_order_dia_prd_header_title', '상세정보'),
    //                     width: '100%',
    //                     height: '100%',
    //                     layout: 'fit',
    //                     bodyPadding: 10,
    //                     defaults: {
    //                         margin: '2 2 2 2'
    //                     },
    //                     items: [
    //                         productGrid
    //                     ]
    //                 }, {
    //                     xtype: 'fieldset',
    //                     frame: true,
    //                     title: '결재정보',
    //                     width: '100%',
    //                     height: '100%',
    //                     layout: 'fit',
    //                     bodyPadding: 10,
    //                     defaults: {
    //                         margin: '2 2 2 2'
    //                     },
    //                     items: [
    //                         this.agrid
    //                     ]
    //                 }
    //                 ]
    //             });
    //
    //             var myWidth = 1200;
    //             var myHeight = 880;
    //
    //             var prWin = Ext.create('Ext.Window', {
    //                 modal: true,
    //                 title: '주문 작성',
    //                 width: myWidth,
    //                 height: myHeight,
    //                 plain: true,
    //                 items: form,
    //                 buttons: [{
    //                     text: CMD_OK,
    //                     handler: function (btn) {
    //
    //                         var store = gu.getCmp('productGrid').getStore();
    //                         var selections = (store.getData().getSource() || store.getData()).getRange();
    //                         var supastStore = gm.me().supastStore;
    //
    //                         var poTemplate = Ext.create('Rfx2.view.company.bioprotech.template.PurchaseOrderTemplate');
    //                         var tempObj = {};
    //
    //                         var pjArr = [];
    //                         var supArr = [];
    //                         var cartmapUids = [];
    //                         var exchange_rates = [];
    //                         var req_delivery_dates = [];
    //
    //                         var tempPos = 1;
    //
    //                         var total_sum = 0;
    //
    //                         for (var i = 0; i < selections.length; i++) {
    //                             var rec = selections[i];
    //
    //                             var coord_key1 = rec.get('coord_key1');
    //                             var srcahdUid = rec.get('child');
    //                             pjArr.push(rec.get('pj_code'));
    //                             supArr.push(coord_key1);
    //                             cartmapUids.push(rec.get('id'));
    //                             exchange_rates.push(rec.get('exchange_rate'));
    //                             req_delivery_dates.push(rec.get('reserved_timestamp3'));
    //
    //                             tempObj['item_name_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = rec.get('item_name');
    //                             tempObj['specification_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = rec.get('specification');
    //                             tempObj['unit_code_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = rec.get('unit_code');
    //                             tempObj['quan_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = Ext.util.Format.number(rec.get('quan'), '0,00.#####');
    //                             tempObj['sales_price_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = Ext.util.Format.number(rec.get('static_sales_price'), '0,00.#####');
    //                             tempObj['total_price_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = Ext.util.Format.number(rec.get('total_price'), '0,00.#####');
    //
    //                             for (var j = 0; j < gm.me().fileInfoStore.getCount(); j++) {
    //                                 var fileRec = gm.me().fileInfoStore.getAt(j);
    //                                 var groupCode = fileRec.get('group_code');
    //                                 var fileType = fileRec.get('srccst_varchar2');
    //                                 var fileName = fileRec.get('srccst_varchar1');
    //
    //                                 if (groupCode == srcahdUid && fileType == 'DES') {
    //                                     tempObj['des_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = fileName;
    //                                     break;
    //                                 }
    //                             }
    //
    //                             for (var j = 0; j < gm.me().fileInfoStore.count; j++) {
    //                                 var fileRec = gm.me().fileInfoStore.getAt(j);
    //                                 var groupCode = fileRec.get('group_code');
    //                                 var fileType = fileRec.get('srccst_varchar2');
    //                                 var fileName = fileRec.get('srccst_varchar1');
    //
    //                                 if (groupCode == srcahdUid && fileType == 'IIS') {
    //                                     tempObj['iis_' + (tempPos > 9 ? tempPos : '0' + tempPos)] = fileName;
    //                                     break;
    //                                 }
    //                             }
    //
    //
    //                             if (i == 0) {
    //                                 tempObj['payment_deadline'] = Ext.Date.format(rec.get('reserved_timestamp3'), 'Y년 m월 d일');
    //                             }
    //
    //                             total_sum = total_sum + rec.get('total_price');
    //
    //                             tempPos++;
    //                         }
    //
    //                         for (var i = 0; i < supastStore.getCount(); i++) {
    //                             var rec = supastStore.getAt(i);
    //                             var coord_key1 = selections[0].get('coord_key1');
    //
    //                             if (rec.get('unique_id_long') == coord_key1) {
    //
    //                                 tempObj['sales_person_name'] = rec.get('sales_person1_name');
    //
    //                                 if (tempObj['sales_person_name'].length > 0) {
    //                                     tempObj['sales_person_name'] += '님';
    //                                 }
    //
    //                                 tempObj['sales_tel_no'] = rec.get('telephone_no');
    //                                 tempObj['sales_fax_no'] = rec.get('fax_no');
    //                                 break;
    //                             }
    //                         }
    //
    //                         tempObj['total_sum'] = Ext.util.Format.number(total_sum, '0,00.#####');
    //                         tempObj['total_tax'] = Ext.util.Format.number(+(total_sum * 0.1).toFixed(5), '0,00.#####');
    //                         tempObj['total_sum_tax'] = Ext.util.Format.number(+(total_sum * 1.1).toFixed(5), '0,00.#####');
    //
    //
    //                         if (btn == "no") {
    //                             prWin.close();
    //                         } else {
    //
    //                             form.add(new Ext.form.Hidden({
    //                                 name: 'unique_uids',
    //                                 value: cartmapUids
    //                             }));
    //
    //                             form.add(new Ext.form.Hidden({
    //                                 name: 'coord_key1',
    //                                 value: selections[0].get('coord_key1')
    //                             }));
    //
    //                             form.add(new Ext.form.Hidden({
    //                                 name: 'coord_key3',
    //                                 value: selections[0].get('coord_key3')
    //                             }));
    //
    //                             form.add(new Ext.form.Hidden({
    //                                 name: 'ac_uid',
    //                                 value: selections[0].get('ac_uid')
    //                             }));
    //
    //                             form.add(new Ext.form.Hidden({
    //                                 name: 'req_date',
    //                                 value: selections[0].get('req_date')
    //                             }));
    //
    //                             form.add(new Ext.form.Hidden({
    //                                 name: 'sales_price',
    //                                 value: total
    //                             }));
    //
    //                             form.add(new Ext.form.Hidden({
    //                                 name: 'exchange_rates',
    //                                 value: exchange_rates
    //                             }));
    //
    //                             form.add(new Ext.form.Hidden({
    //                                 name: 'req_delivery_dates',
    //                                 value: req_delivery_dates
    //                             }));
    //
    //                             if (form.isValid()) {
    //                                 prWin.setLoading(true);
    //
    //                                 var val = form.getValues(false);
    //
    //                                 var items = gm.me().rtgapp_store.data.items;
    //
    //                                 if (items.length < 2) {
    //                                     Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
    //                                     return;
    //                                 }
    //
    //                                 var ahid_userlist = new Array();
    //                                 var ahid_userlist_role = new Array();
    //                                 var ahid_userlist_id = new Array();
    //
    //                                 for (var i = 0; i < items.length; i++) {
    //                                     var rec = items[i];
    //
    //                                     ahid_userlist.push(rec.get('usrast_unique_id'));
    //                                     ahid_userlist_role.push(rec.get('gubun'));
    //                                     ahid_userlist_id.push(rec.get('groupware_id'));
    //                                 }
    //                                 val['hid_userlist'] = ahid_userlist;
    //                                 val['hid_userlist_role'] = ahid_userlist_role;
    //                                 val['hid_userlist_id'] = ahid_userlist_id;
    //
    //
    //                                 tempObj['supplier_name'] = val['supplier_name'];
    //                                 tempObj['po_user_name'] = vCUR_USER_NAME;
    //                                 tempObj['aprv_date'] = val['aprv_date'];
    //                                 tempObj['pay_condition'] = gm.me().selectedPayCondition;
    //                                 tempObj['requested_term'] = val['reserved_varchar2'];
    //                                 tempObj['po_no'] = val['po_no'];
    //
    //                                 var result = poTemplate.apply(tempObj);
    //
    //                                 result = result.replace(/"/g, '\\"').replace(/\n/g, '').replace(/\t/g, '').replace(/  /g, '');
    //
    //                                 val['purchase_order_html'] = result;
    //
    //                                 if (val['cartmap_varchar1'] == 'on') {
    //                                     val['cartmap_varchar1'] = 'Y';
    //                                 } else {
    //                                     val['cartmap_varchar1'] = 'N';
    //                                 }
    //
    //                                 Ext.Ajax.request({
    //                                     url: CONTEXT_PATH + '/purchase/request.do?method=createPoContract',
    //                                     params: val,
    //                                     success: function (val, action) {
    //                                         prWin.setLoading(false);
    //                                         prWin.close();
    //                                         gm.me().store.load(function () {
    //                                         });
    //                                     },
    //                                     failure: function (val, action) {
    //                                         prWin.setLoading(false);
    //
    //                                         prWin.close();
    //                                         gm.me().store.load(function () {
    //                                         });
    //
    //                                     }
    //                                 });
    //                             }  // end of formvalid
    //                         }//else
    //                     }
    //                 },
    //                     {
    //                         text: CMD_CANCEL,
    //                         handler: function () {
    //                             if (prWin) {
    //                                 prWin.close();
    //                             }
    //                         }
    //                     }]
    //             });
    //             prWin.show();
    //         }
    //
    //     }
    //
    // },

    editRedord: function (field, rec) {

        switch (field) {
            case 'quan':
            case 'static_sales_price':
            case 'req_date':
            case 'cart_currency':
                this.updateDesinComment(rec);
                break;
            case 'reserved_timestamp1':
            case 'reserved_timestamp3':
                gm.editAjax('cartmap', field, rec.get(field), 'unique_id', rec.get('unique_uid'), {type: ''});
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
        var quan = rec.get('quan');
        var static_sales_price = rec.get('static_sales_price');
        var req_date = rec.get('req_date');
        req_date = Ext.Date.format(req_date, 'Y-m-d');
        var cart_currency = rec.get('cart_currency');
        var unique_id = rec.get('unique_uid');
        var reserved_timestamp1 = rec.get('reserved_timestamp1');

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

                gm.me().store.getAt(gm.me().store.indexOf(rec)).set('total_price', static_sales_price * quan);

                // gm.me().store.load(function (record) {
                //
                //     if (gu.getCmp('productGrid') !== undefined) {
                //         var store = gu.getCmp('productGrid').getStore();
                //         //var selections = (store.getData().getSource() || store.getData()).getRange();
                //
                //         store.removeAll();
                //
                //         var selections = gm.me().grid.getSelectionModel().getSelection();
                //
                //         for (var i = 0; i < selections.length; i++) {
                //             store.add(selections[i]);
                //         }
                //
                //         var total = 0;
                //         for (var i = 0; i < selections.length; i++) {
                //             var rec = selections[i];
                //             var total_price = rec.get('total_price');
                //             total = total + total_price;
                //         }
                //
                //         gu.getCmp('order_total_price').setValue(Ext.util.Format.number(total, '0,00/i')
                //             + ' ' + selections[0].get('contract_currency'));
                //     }
                //
                // });
            },
            failure: extjsUtil.failureMessage
        });
    },

    payConditionStore: Ext.create('Mplm.store.CommonCodeExStore', {parentCode: 'PAYMENT_METHOD'}),
    whouseStore: Ext.create('Rfx2.store.company.bioprotech.WarehouseStore', {}),
    fileInfoStore: Ext.create('Rfx2.store.FileInfoStore', {}),
    supastStore: Ext.create('Rfx2.store.company.bioprotech.SupastStore', {pageSize: 1000000}),
    selectedPayCondition: null,
    deleteRtgappConfirm: function (result) {
        console_logs('result', result)
        var selections = gm.me().agrid.getSelectionModel().getSelection();
        if (selections) {
            //var result = MessageBox.msg('{0}', btn);
            if (result == 'yes') {

                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var user_id = rec.get('user_id');

                    if (user_id == vCUR_USER_ID) {
                        Ext.Msg.alert('안내', '본인은 결재경로에서 삭제할 수 없습니다.', function () {
                        });
                        return;
                    }
                }

                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var unique_id = rec.get('unique_id');

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgappWithType',
                        params: {
                            unique_id: unique_id,
                            appType: 'PR'
                        },
                        success: function (result, request) {
                            gm.me().agrid.store.load();
                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    }); // endofajax
                }
                gm.me().agrid.store.remove(selections);
            }
        }
    },
    updateReadAndPublic: function (combo, category) {
        var store = gm.me().readAndPublicStore;
        var isExist = false;

        for (var i = 0; i < store.count(); i++) {
            var rec = store.getAt(i);
            var v000 = rec.get('v000');
            if (v000 == category) {
                var unique_id_long = rec.get('unique_id_long');
                var obj = {};
                obj['v000'] = category;
                obj['v001'] = 'PR';
                var pos = 2;
                for (var j = 0; j < combo.getValue().length; j++) {
                    var key = 'v' + (pos > 9 ? (pos > 99 ? pos : "0" + pos) : "00" + pos);
                    obj[key] = combo.getValue()[j];
                    pos++;
                }

                var bufValues = Ext.JSON.encode(obj);

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/buffer.do?method=editBufferForce',
                    params: {
                        unique_id_long: unique_id_long,
                        bufValues: bufValues
                    },
                    success: function (result, request) {
                        store.load();
                    },
                    failure: function (result, request) {

                    }
                });
                isExist = true;
                break;
            }
        }

        if (!isExist) {
            var obj = {};
            obj['v000'] = category;
            obj['v001'] = 'PR';
            obj['v002'] = combo.getValue()[0];
            var group_uid = vCUR_USER_UID;
            var type = 'READ_AND_PUBLIC';
            var bufValues = Ext.JSON.encode(obj);

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/buffer.do?method=createBuffer',
                params: {
                    group_uid: group_uid,
                    type: type,
                    bufValues: bufValues
                },
                success: function (result, request) {
                    store.load();
                },
                failure: function (result, request) {

                }
            });

        }
    },
    getAprv_date: function(rDate) {
        if (rDate == null) {
            return Ext.Date.format(new Date(), 'Y-m-d');
        } else {
            return rDate;
        }
    },
    nextRow: true,
    isFirstRenderCombo: true
});
