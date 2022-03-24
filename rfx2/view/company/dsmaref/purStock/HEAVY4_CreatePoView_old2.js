/**
 * 일반 주문 작성
 *
 */
Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);

Ext.define('Rfx2.view.company.dsmaref.purStock.HEAVY4_CreatePoView_old2', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'create-po-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가

        this.addSearchField({
            type: 'radio',
            field_id: 'is_lot_purchase',
            style: 'color: #fffffff !important;',
            items: [
                {
                    text: 'LOT 주문',
                    name: 'is_lot_purchase',
                    value: 'Y',
                    checked: true,
                },
                {
                    text: '일반 주문',
                    name: 'is_lot_purchase',
                    value: 'N',
                    checked: false
                }
            ]
        });

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.kbtech.CreatePo',
            pageSize: 100,
            sorters: [{
                property: 'parent_code',
                direction: 'asc'
            }],
            byReplacer: {},
            deleteClass: ['rtgast']

        }, {
            //groupField: 'parent_code'
        });

        if (this.changeSupplier == false) {
            this.setRowClass(function (record, index) {

                // console_logs('record', record);
                var contract_supplier = record.get('contract_supplier');
                var supplier_name = record.get('supplier_name');
                var item_type = record.get('item_type');

                if (contract_supplier == supplier_name) {
                    return 'green-row';
                } else if (item_type == 'S') {
                    return 'gray-row';
                }
            });
        }

        var arr = [];

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 구매 ({rows.length})</div>'
        });

        var option = {
            features: [groupingFeature],
            listeners: {
                itemdblclick: function() {
                    westTab.collapse();
                    // if(westTab.collapsed) {
                    //     // console_logs('>>>>??', gm.me().treeView.getView());
                    //     // gm.me().treeView.getView().setWidth(30);
                    //     // gm.me().treeView.setWidth('10%');
                    //     gm.me().tabView.setWidth('60%');
                    // }
                }
            }
        };

        //grid 생성.
        this.createGridCore(arr, option);
        this.createCrudTab();

        //사내발주 Action 생성
        this.createInPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '불출 요청',
            tooltip: '불출 요청',
            disabled: true,
            handler: function () {
                gm.me().treatInPo();
            } //handler end...

        });

        //품목추가
        this.addItemAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '품목추가',
            tooltip: '품목추가',
            disabled: false,
            handler: function () {
            } //handler end...

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
                var codeLength = 4;

                if (month.length == 1) {
                    month = '0' + month;
                }

                var first = "OR" + fullYear.substring(2, 4) + month;

                console_logs('first', first);

                if (vCompanyReserved4 == 'KWLM01KR') {
                    gm.me().treatPo('');
                } else {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPono',
                        params: {
                            first: first,
                            codeLength: codeLength
                        },
                        success: function (result, request) {
                            var po_no = result.responseText;

                            gm.me().treatPo(po_no);

                        }, // endofsuccess
                        failure: extjsUtil.failureMessage
                    }); // endofajax
                }
                // 마지막 수주번호 가져오기


            } //handler end...

        });

        this.createPoAllAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '일괄 주문 작성',
            tooltip: '일괄 주문 작성',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title:'일괄 주문 작성',
                    msg: '일괄 주문 작성하시겠습니까?'+
                            '<br/>현재 체크한 품목을 자동으로 주문 작성을 실시합니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(btn) {
                        if(btn=='yes') {

                            var selections = gm.me().gridPoList.getSelectionModel().getSelection();

                            var keys = [];

                            for(var i = 0; i < selections.length; i++) {

                                var contract_uid = selections[i].get('contract_uid');
                                var isExist = false;

                                for (var j = 0; j < keys.length; j++) {
                                    if(contract_uid == keys[j]) {
                                        isExist = true;
                                        break;
                                    }
                                }

                                if(!isExist) {
                                    keys.push(contract_uid);
                                }
                            }

                            gm.me().treatPoAll(0, keys, selections);
                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.cartListStore = Ext.create('Rfx2.store.CartListStore', {pageSize: 100});
        this.poCartListStore = Ext.create('Rfx2.store.PoCartListStore', {pageSize: 100});
        this.goCartListStore = Ext.create('Rfx2.store.GoCartListStore', {pageSize: 100});

        this.gridCartList = Ext.create('Ext.grid.Panel', {
            store: this.cartListStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: false,
            bbar: getPageToolbar(this.cartListStore),
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
                        this.addPartAction,
                        this.removePartAction
                    ]
                }
            ],
            columns: [
                {text: '유형', width: 50, align: 'center', dataIndex: 'pur_type'},
                {text: 'LOT NO', dataIndex: 'project_varchar6'},
                {text: '품번', dataIndex: 'item_code'},
                {text: '품명', dataIndex: 'item_name'},
                {text: '규격', dataIndex: 'specification'},
                {text: '공급사', dataIndex: 'contract_supplier'},
                {text: '소요량', dataIndex: 'bm_quan', editor: 'numberfield'},
                {text: '요청수량', dataIndex: 'pr_quan'},
                {text: '총재고', dataIndex: 'stock_qty'},
                {text: '가용재고', dataIndex: 'stock_qty_useful'},
                {text: '주문수량', dataIndex: 'quan', editor: 'numberfield'},
                {text: '주문단가', dataIndex: 'static_sales_price', editor: 'textfield'},
                {text: '주문금액', dataIndex: 'total_price'},
                {
                    text: '납기일', type: 'date', dataIndex: 'req_date', dateFormat: 'Y-m-d',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                    editor: {
                        xtype: 'datefield',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
                        format: 'Y-m-d',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                        allowBlank: true
                    }
                },
                {text: '등록자', dataIndex: 'creator'},
                {text: '기처리수량', dataIndex: 'rc_quan'}
            ],
            title: '전체',
            name: 'cart',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'cartmap';
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

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                    gm.editAjax(tableName, 'pr_quan', value * _quan, 'unique_id', unique_id, {type: ''});
                    gm.editAjax('assymap', 'bm_quan', value, 'unique_id', assymap_uid, {type: ''});
                    gm.me().cartListStore.getProxy().setExtraParam('update_qty', 'Y');
                    gm.me().cartListStore.load();
                },
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().gridContextMenu(this).showAt(e.getXY());
                    return false;
                },
            },
        });

        this.gridCartList.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    gm.me().removePartAction.enable();
                } else {
                    gm.me().removePartAction.disable();
                }
            }
        });

        Ext.each(this.gridCartList.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'bm_quan':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'bm_quan':
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

        this.gridPoList = Ext.create('Ext.grid.Panel', {
            store: this.poCartListStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: false,
            bbar: getPageToolbar(this.poCartListStore),
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
                        this.createPoAction,
                        this.createPoAllAction,
                        {
                            id: gu.id('req_date_po'),
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
                        },
                        {
                            xtype: 'button',
                            id: gu.id('change_req_date_po'),
                            iconCls: 'af-check',
                            text: '납기일 변경',
                            disabled: true,
                            handler: function () {
                                gm.setCenterLoading(true);
                                var text = gu.getCmp('req_date_po');
                                console_logs('text', text);
                                if (text == null) {
                                    Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function () {
                                    });
                                } else {
                                    var date = text.getValue();
                                    console_logs('val', date);
                                    var selections = gm.me().gridPoList.getSelectionModel().getSelection();
                                    console_logs('selections>>>>>>>>', selections);
                                    if (selections != null) {
                                        var whereValue = [];
                                        var field = 'req_date';
                                        for (var i = 0; i < selections.length; i++) {
                                            var rec = selections[i];
                                            rec.set(field, date);
                                            var cartmap_uid = rec.get('unique_uid');
                                            whereValue.push(cartmap_uid);
                                        }
                                        gm.editAjax('cartmap', 'req_date', date, 'unique_id', whereValue, {type: ''});
                                    }

                                }
                            }
                        }
                    ]
                }
            ],
            columns: [
                {text: '유형', width: 50, align: 'center', dataIndex: 'pur_type'},
                {text: 'LOT NO', dataIndex: 'project_varchar6'},
                {text: '품번', dataIndex: 'item_code'},
                {text: '품명', dataIndex: 'item_name'},
                {text: '규격', dataIndex: 'specification'},
                {text: '공급사', dataIndex: 'contract_supplier'},
                //{text: '소요량', dataIndex: 'column_001'},
                {text: '요청수량', dataIndex: 'pr_quan'},
                {text: '총재고', dataIndex: 'stock_qty'},
                {text: '가용재고', dataIndex: 'stock_qty_useful'},
                {text: '주문수량', dataIndex: 'quan', editor: 'numberfield'},
                {text: '주문단가', dataIndex: 'static_sales_price', editor: 'textfield'},
                {text: '주문금액', dataIndex: 'total_price'},
                {
                    text: '납기일', type: 'date', dataIndex: 'req_date', dateFormat: 'Y-m-d',
                    editor: {
                        xtype: 'datefield',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
                        format: 'Y-m-d',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                        allowBlank: true
                    }
                },
                {text: '등록자', dataIndex: 'creator'},
                {text: '기처리수량', dataIndex: 'rc_quan'}
            ],
            title: '구매',
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'cartmap';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    switch (columnName) {
                        case 'static_sales_price':
                            columnName = 'sales_price';
                            break;
                        default:
                            break;
                    }

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                    gm.me().poCartListStore.getProxy().setExtraParam('update_qty', 'N');
                    gm.me().poCartListStore.load();
                }
            }
        });

        Ext.each(this.gridPoList.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'quan':
                case 'req_date':
                case 'static_sales_price':
                case 'reserved_double1':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'req_date':
                    columnObj['renderer'] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        if (value == null) {
                            return "";
                        } else {
                            return Ext.util.Format.date(value, 'Y-m-d');
                        }
                    };
                    break;
                case 'quan':
                case 'static_sales_price':
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

        this.gridGoList = Ext.create('Ext.grid.Panel', {
            store: this.goCartListStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: false,
            bbar: getPageToolbar(this.goCartListStore),
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
                        this.createInPoAction,
                        {
                            id: gu.id('req_date_go'),
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
                        },
                        {
                            xtype: 'button',
                            id: gu.id('change_req_date_go'),
                            iconCls: 'af-check',
                            text: '납기일 변경',
                            disabled: true,
                            handler: function () {
                                gm.setCenterLoading(true);
                                var text = gu.getCmp('req_date_po');
                                console_logs('text', text);
                                if (text == null) {
                                    Ext.Msg.alert('오류', 'Calendar Combo를 찾을 수 없습니다.', function () {
                                    });
                                } else {
                                    var date = text.getValue();
                                    console_logs('val', date);
                                    var selections = gm.me().gridPoList.getSelectionModel().getSelection();
                                    console_logs('selections>>>>>>>>', selections);
                                    if (selections != null) {
                                        var whereValue = [];
                                        var field = 'req_date';
                                        for (var i = 0; i < selections.length; i++) {
                                            var rec = selections[i];
                                            rec.set(field, date);
                                            var cartmap_uid = rec.get('unique_uid');
                                            whereValue.push(cartmap_uid);
                                        }
                                        gm.editAjax('cartmap', 'req_date', date, 'unique_id', whereValue, {type: ''});
                                    }

                                }
                            }
                        }
                    ]
                }
            ],
            columns: [
                {text: '유형', width: 50, align: 'center', dataIndex: 'pur_type'},
                {text: 'LOT NO', dataIndex: 'project_varchar6'},
                {text: '품번', dataIndex: 'item_code'},
                {text: '품명', dataIndex: 'item_name'},
                {text: '규격', dataIndex: 'specification'},
                {text: '공급사', dataIndex: 'contract_supplier'},
                //{text: '소요량', dataIndex: 'column_001'},
                {text: '요청수량', dataIndex: 'pr_quan'},
                {text: '총재고', dataIndex: 'stock_qty'},
                {text: '가용재고', dataIndex: 'stock_qty_useful'},
                {text: '불출수량', dataIndex: 'reserved_double1', editor: 'numberfield'},
                {text: '주문단가', dataIndex: 'static_sales_price', editor: 'textfield'},
                {text: '주문금액', dataIndex: 'total_price'},
                {
                    text: '납기일', type: 'date', dataIndex: 'req_date', dateFormat: 'Y-m-d',
                    editor: {
                        xtype: 'datefield',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
                        format: 'Y-m-d',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                        allowBlank: true
                    }
                },
                {text: '등록자', dataIndex: 'creator'},
                {text: '기처리수량', dataIndex: 'rc_quan'}
            ],
            title: '불출',
            name: 'go',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'cartmap';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    switch (columnName) {
                        case 'static_sales_price':
                            columnName = 'sales_price';
                            break;
                        default:
                            break;
                    }

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                    gm.me().goCartListStore.getProxy().setExtraParam('update_qty', 'N');
                    gm.me().goCartListStore.load();
                }
            }
        });

        Ext.each(this.gridGoList.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'quan':
                case 'req_date':
                case 'reserved_double1':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'req_date':
                    columnObj['renderer'] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        if (value == null) {
                            return "";
                        } else {
                            return Ext.util.Format.date(value, 'Y-m-d');
                        }
                    };
                    break;
                case 'quan':
                case 'reserved_double1':
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

        this.gridPoList.getSelectionModel().on({
            selectionchange: function (sm, selections) {

                gm.me().setSelections(selections);

                if (selections.length > 0) {
                    gu.getCmp('change_req_date_po').enable();
                    gm.me().createPoAction.enable();
                    gm.me().createPoAllAction.enable();
                } else {
                    gu.getCmp('change_req_date_po').disable();
                    gm.me().createPoAction.disable();
                    gm.me().createPoAllAction.disable();
                }
            }
        });

        this.gridGoList.getSelectionModel().on({
            selectionchange: function (sm, selections) {

                gm.me().setSelections(selections);

                if (selections.length > 0) {
                    gu.getCmp('change_req_date_go').enable();
                    gm.me().createInPoAction.enable();
                } else {
                    gu.getCmp('change_req_date_go').disable();
                    gm.me().createInPoAction.disable();
                }
            }
        });

        this.tabView = Ext.create('Ext.tab.Panel', {
            region: 'east',
            collapsible: false,
            border: true,
            width: '30%',
            margin: '5 0 0 0',
            items: [
                this.gridCartList,
                this.gridPoList,
                this.gridGoList
            ]
            ,
            listeners: {
                tabchange: function (tabPanel, newTab, oldTab, eOpts) {

                    gm.me().currentTab = newTab.name;

                    var selections = gm.me().grid.getSelectionModel().getSelection();

                    if (selections.length == 1) {

                        var po_no = gm.me().grid.getSelectionModel().getSelection()[0].get('po_no');
                        var parent_uid = gm.me().treeView.getSelectionModel().getSelection()[0].get('id');
                        if(po_no == null || po_no.length < 1) return;
                        switch (newTab.name) {
                            case 'cart':
                                //gm.me().poCartListStore.getProxy().setExtraParam('project_varchar6', selections[0].get('project_varchar6'));
                                gm.me().cartListStore.getProxy().setExtraParam('po_no', po_no);
                                gm.me().cartListStore.getProxy().setExtraParam('parent_uid', parent_uid);
                                gm.me().cartListStore.getProxy().setExtraParam('limit', '100');
                                gm.me().cartListStore.getProxy().setExtraParam('update_qty', 'Y');
                                gm.me().cartListStore.load();
                                break;
                            case 'po':
                                //gm.me().poCartListStore.getProxy().setExtraParam('project_varchar6', selections[0].get('project_varchar6'));
                                gm.me().poCartListStore.getProxy().setExtraParam('po_no', po_no);
                                gm.me().poCartListStore.getProxy().setExtraParam('parent_uid', parent_uid);
                                gm.me().poCartListStore.getProxy().setExtraParam('limit', '100');
                                gm.me().poCartListStore.getProxy().setExtraParam('update_qty', 'Y');
                                gm.me().poCartListStore.load();
                                break;
                            case 'go':
                                //gm.me().goCartListStore.getProxy().setExtraParam('project_varchar6', selections[0].get('project_varchar6'));
                                gm.me().goCartListStore.getProxy().setExtraParam('po_no', po_no);
                                gm.me().goCartListStore.getProxy().setExtraParam('parent_uid', parent_uid);
                                gm.me().goCartListStore.getProxy().setExtraParam('limit', '100');
                                gm.me().goCartListStore.getProxy().setExtraParam('update_qty', 'Y');
                                gm.me().goCartListStore.load();
                                break;
                            default:
                                break;
                        }

                        // switch (newTab.name) {
                        //     case 'cart':
                        //         gm.me().cartListStore.getProxy().setExtraParam('po_no', selections[0].get('po_no'));
                        //         gm.me().cartListStore.getProxy().setExtraParam('update_qty', 'Y');
                        //         gm.me().cartListStore.getProxy().setExtraParam('limit', '100');
                        //         gm.me().cartListStore.load();
                        //         break;
                        //     case 'po':
                        //         //gm.me().poCartListStore.getProxy().setExtraParam('project_varchar6', selections[0].get('project_varchar6'));
                        //         gm.me().poCartListStore.getProxy().setExtraParam('po_no', selections[0].get('po_no'));
                        //         gm.me().poCartListStore.getProxy().setExtraParam('update_qty', 'Y');
                        //         gm.me().poCartListStore.getProxy().setExtraParam('limit', '100');
                        //         gm.me().poCartListStore.load();
                        //         break;
                        //     case 'go':
                        //         //gm.me().goCartListStore.getProxy().setExtraParam('project_varchar6', selections[0].get('project_varchar6'));
                        //         gm.me().goCartListStore.getProxy().setExtraParam('po_no', selections[0].get('po_no'));
                        //         gm.me().goCartListStore.getProxy().setExtraParam('limit', '100');
                        //         gm.me().goCartListStore.getProxy().setExtraParam('update_qty', 'Y');
                        //         gm.me().goCartListStore.load();
                        //         break;
                        //     default:
                        //         break;
                        // }
                    }
                }
            }
        });

        this.treeView = Ext.create('Ext.tree.Panel', {
            id:'treeView',
            title: 'Assembly',
            // collapsible: true,
            useArrows: true,
            rootVisible: false,
            // layout :'border',
            width:'60%',
            region:'center',
            margin: '10 0 0 0',
            forceFit: true,
            store: this.cloudAsStore,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
            // multiSelect: true,
            plugins: Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {}
                ]
            }], // dockedItems of End
            columns: [
                {
                    xtype: 'treecolumn', // this is so we know which column
                    // will show the tree
                    text: 'BOM',
                    width: 250,
                    autoSizeColumn: true,
                    sortable: true,
                    dataIndex: 'text',
                    locked: true
                }, {
                    text: '상태',
                    dataIndex: 'status',
                    width: 80,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false,
                    renderer: function(value, meta) {
                        return gm.me().getAssyStatus(value, meta);
                        // switch(value) {
                        //     case 'BM':
                        //         return '설계중';
                        //     default:
                        //         return '대기';
                        // }
                    }
                }, {
                    text:'공정',
                    dataIndex:'working_area',
                    width: 80,
                    style: 'text-align:center',
                    align: 'center',
                    editor: {
                        xtype:'combo',
                        id:'working_area',
                        name:'working_area',
                        store: this.workingAreaStore,
                        displayField:'pcs_name',
                        valueField:'pcs_code',
                        minChars: 1,
                        listConfig:{
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            // Custom rendering template for each item
                            getInnerTpl: function() {
                                return '<div data-qtip="{pcs_code}">{pcs_name}</div>';
                            }			                	
                        },
                    },
                    css:'edit-cell',
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        if(value == null || value.length<1) {
                            return '<미지정>';
                        }
                        return value;
                    }

                }, {
                    text: '생산요청량',
                    dataIndex: 'bm_quan',
                    width: 80,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false
                }, {
                    text: '가용재고',
                    dataIndex: 'stock_qty_useful',
                    width: 80,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false
                }, {
                    text: '비고',
                    dataIndex: 'comment',
                    width: 80,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false
                }
            ]
            , viewConfig: {
                getRowClass: function (record, index) {
                    
                }
            }
            , listeners: {
                'afterrender': function (grid) {
                    var elments = Ext.select(".x-column-header", true);
                    elments.each(function (el) {

                    }, this);

                },
                activate: function (tab) {
                    setTimeout(function () {
                        // gu.getCmp('main-panel-center').setActiveTab(0);
                        // alert(tab.title + ' was activated.');
                    }, 1);
                },
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().assyContextMenu.showAt(e.getXY());
                    return false;
                }
            }
        });

        this.treeView.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                // gm.me().onAssemblyGridSelection(selections);
                if(selections.length>0) {
                    var po_no = gm.me().grid.getSelectionModel().getSelection()[0].get('po_no');
                    var parent_uid = gm.me().treeView.getSelectionModel().getSelection()[0].get('id');
                    if(po_no == null || po_no.length < 1) return;
                    switch (gm.me().currentTab) {
                        case 'cart':
                            //gm.me().poCartListStore.getProxy().setExtraParam('project_varchar6', selections[0].get('project_varchar6'));
                            gm.me().cartListStore.getProxy().setExtraParam('po_no', po_no);
                            gm.me().cartListStore.getProxy().setExtraParam('parent_uid', parent_uid);
                            gm.me().cartListStore.getProxy().setExtraParam('limit', '100');
                            gm.me().cartListStore.getProxy().setExtraParam('update_qty', 'Y');
                            gm.me().cartListStore.load();
                            break;
                        case 'po':
                            //gm.me().poCartListStore.getProxy().setExtraParam('project_varchar6', selections[0].get('project_varchar6'));
                            gm.me().poCartListStore.getProxy().setExtraParam('po_no', po_no);
                            gm.me().poCartListStore.getProxy().setExtraParam('parent_uid', parent_uid);
                            gm.me().poCartListStore.getProxy().setExtraParam('limit', '100');
                            gm.me().poCartListStore.getProxy().setExtraParam('update_qty', 'Y');
                            gm.me().poCartListStore.load();
                            break;
                        case 'go':
                            //gm.me().goCartListStore.getProxy().setExtraParam('project_varchar6', selections[0].get('project_varchar6'));
                            gm.me().goCartListStore.getProxy().setExtraParam('po_no', po_no);
                            gm.me().goCartListStore.getProxy().setExtraParam('parent_uid', parent_uid);
                            gm.me().goCartListStore.getProxy().setExtraParam('limit', '100');
                            gm.me().goCartListStore.getProxy().setExtraParam('update_qty', 'Y');
                            gm.me().goCartListStore.load();
                            break;
                        default:
                            break;
                    }
                } else {
                    switch (gm.me().currentTab) {
                        case 'cart':
                            gm.me().cartListStore.removeAll();
                            break;
                        case 'po':
                            gm.me().poCartListStore.removeAll();
                            break;
                        case 'go':
                            gm.me().goCartListStore.removeAll();
                            break;
                        default:
                            break;
                    }
                }
            }
        });

        this.grid.forceFit = true;
        console_logs('>>>>>>>?!?!?!?', this.grid.dockedItems);

        this.grid.addDocked({
            dock: 'top',
            xtype: 'toolbar',
            cls: 'my-x-toolbar-default2',
            items: [
                    {
                        xtype: 'component',
                        id: gu.id('product_name'),
                        style: 'fontSize:15px;',
                        html: '요청번호를 선택하세요'
                    }
                ]
            }
        );

        var westTab = Ext.create('Ext.panel.Panel', {
            title: '요청서 선택',
            collapsible: false,
            frame: false,
            region: 'west',
            id:'westPanel',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            margin: '5 0 0 0',
            width: '30%',
            items: [{
                region: 'west',
                layout: 'fit',
                margin: '0 0 0 0',
                width: '100%',
                items: [this.grid]
            }],
            listeners: {
                'resize' : function(win,width,height,opt){
                    //console_logs('getCrudviewSize', width);
                    gm.me().setCrudpanelWidth(width);
                },
                collapse : function() {
                    gm.me().tabView.setWidth('60%');
                },
                expand: function() {
                    gm.me().tabView.setWidth('30%');
                }
            },
            tools: [
                {
                    xtype: 'tool',
                    type: 'right',
                    qtip: "접기",
                    handler: function(e, target, header, tool){
                        westTab.collapsed ? westTab.expand() : westTab.collapse();
                    }
                }
            ]
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                westTab,
                this.treeView,
                this.tabView
            ]
        });

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.setAllMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                gMain.selPanel.stockviewType = 'ALL';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                gMain.selPanel.store.load(function () {
                });
            }
        });


        this.setRawMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '원자재',
            tooltip: '원자재 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                this.matType = 'RAW';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R');
                gMain.selPanel.store.load(function () {
                });
            }
        });

        this.setPaintMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'PAINT자재',
            tooltip: 'PAINT자재 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                this.matType = 'PNT';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R2');
                gMain.selPanel.store.load(function () {
                });
            }
        });

        this.setSaMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '공구',
            tooltip: '공구 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                this.matType = 'SUB';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K1');
                gMain.selPanel.store.load(function () {
                });
            }
        });
        this.setSubMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: vCompanyReserved4 == 'KYNL01KR' ? '기계공구류' : '기타소모품',
            tooltip: vCompanyReserved4 == 'KYNL01KR' ? '기계공구류 재고' : '기타소모품 재고',
            //pressed: true,
            toggleGroup: 'stockviewType',
            handler: function () {
                this.matType = 'MRO';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K2');
                gMain.selPanel.store.load(function () {
                });
            }
        });

        //PO Type View Type
        this.setAllPoView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체목록',
            pressed: true,
            //ctCls: 'x-toolbar-grey-btn',
            toggleGroup: 'poViewType',
            handler: function () {
                gm.me().createAddPoAction.disable();
                gm.me().vSELECTED_UNIQUE_ID = '';
                gm.me().poviewType = 'ALL';
                gm.me().store.getProxy().setExtraParam('standard_flag', '');
                gm.me().store.getProxy().setExtraParam('sp_code', '');
                gm.me().store.load(function () {
                });

            }
        });

        this.setAddPoView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '주문이력',
            tooltip: '주문 이력',
            multiSelect: false,
            //ctCls: 'x-toolbar-grey-btn',
            toggleGroup: 'poViewType',
            handler: function () {
                gm.me().poviewType = 'ADDPO';
                gm.me().vSELECTED_UNIQUE_ID = '';
                gm.me().store.getProxy().setExtraParam('standard_flag', '');
                gm.me().store.getProxy().setExtraParam('storeType', 'Y');
                gm.me().store.load(function () {
                });

            }
        });

        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip: '견적서 출력',
            disabled: true,

            handler: function (widget, event) {
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var route_type = gMain.selPanel.vSELECTED_ROUT_TYPE;
                var cartmap_uids = null;

                for (var i = 0; i < selections.length; i++) {
                    var cartmap_uid = selections[i].get('unique_uid');
                    cartmap_uids = cartmap_uids == null || cartmap_uids == '' ? cartmap_uid : cartmap_uids + ',' + cartmap_uid;
                }
                console_logs('=casdqw', selections[0]);
                var po_no = selections[0].get('po_no');

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printRf',
                    params: {
                        cartmap_uids: cartmap_uids,
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'N',
                        po_no: po_no,
                        route_type: 'P'
                    },
                    reader: {
                        pdfPath: 'pdfPath'
                    },
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        console_log(pdfPath);
                        if (pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                            top.location.href = url;
                        }
                    },
                    failure: extjsUtil.failureMessage
                });
                is_rotate = '';

            }
        });

        //임시저장
        this.createTempAction = Ext.create('Ext.Action', {
            // iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '임시저장',
            tooltip: '임시저장',
            disabled: true,
            handler: function () {

                var unique_ids = [];
                var selections = gm.me().grid.getSelectionModel().getSelection();
                console_logs('===>selections', selections);
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    console_logs('===>rec', rec);
                    var unique_uid = rec.get('unique_uid');

                    unique_ids.push(unique_uid);
                }

                // 임시저장
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/request.do?method=setTemporaryStorage',
                    params: {
                        unique_ids: unique_ids
                    },
                    success: function (result, request) {
                        gm.me().store.load();

                    }, // endofsuccess
                    failure: extjsUtil.failureMessage
                }); // endofajax


            } //handler end...

        });

        //합계금액 계산 변경 Action 생성
        this.massAmountAction = Ext.create('Ext.Action', {
            // iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '중량계산',
            tooltip: '중량계산',
            disabled: true,
            handler: function () {

                Ext.MessageBox.show({
                    title: '확인',
                    msg: '금액 계산식을 <br/>중량<예><br/>수량<아니오><br/> 로 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        var selections = gm.me().grid.getSelectionModel().getSelection();
                        var unique_ids = [];
                        for (var i = 0; i < selections.length; i++) {
                            var unique_id = selections[i].get('unique_uid');
                            unique_ids.push(unique_id);
                        }

                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=updateAmountCtrflag',
                                params: {
                                    unique_ids: unique_ids,
                                    ctr_flag: 'M'
                                },
                                success: function (result, request) {
                                    gm.me().showToast('결과', '합계금액 계산식이 총중량*단가 로 변경 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        } else {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=updateAmountCtrflag',
                                params: {
                                    unique_ids: unique_ids,
                                    ctr_flag: 'N'
                                },
                                success: function (result, request) {
                                    gm.me().showToast('결과', '합계금액 계산식이 수량*단가 로 변경 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                });

            } //handler end...

        });

        //제품분류 Action 생성
        this.prdClassification = Ext.create('Ext.Action', {
            // iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '제품분류',
            tooltip: '제품분류',
            disabled: false,
            handler: function () {

                var win = Ext.create('ModalWindow', {
                    title: CMD_VIEW + '::' + /*(G)*/'제품분류코드',
                    width: 560,
                    height: 700,
                    minWidth: 250,
                    minHeight: 180,
                    autoScroll: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    xtype: 'container',
                    plain: true,
                    items: [
                        {
                            xtype: 'panel',
                            id: 'PRD Grid',
                            autoScroll: true,
                            autoWidth: true,
                            flex: 3,
                            padding: '5',
                            items: gm.me().prdClassForm()
                        }
                    ],
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            if (win) {
                                win.close();
                            }
                        }
                    }]
                });
                win.show();

            } //handler end...

        });

        //제품분류 일시에 변경 Action 생성
        this.modifyPdCategoryAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '제품분류 변경',
            tooltip: '제품분류 변경',
            disabled: true,
            handler: function () {

                var selections = gm.me().grid.getSelectionModel().getSelection();
                var cartmap_uids = [];
                var req_date = null;

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: [{
                        fieldLabel: '제품그룹',
                        xtype: 'combo',
                        store: gm.me().PdCategoryTypeStore,
                        id: 'pd_category',
                        name: 'pd_category',
                        anchor: '80%',
                        valueField: 'systemCode',
                        displayField: 'codeName',
                        emptyText: '선택해주세요.',
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음',
                            getInnerTpl: function () {
                                return '<div data-qtip="{}">{codeName}</div>';
                            }
                        }
                    }]
                })

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '제품분류 변경',
                    width: 350,
                    height: 150,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == 'no') {
                                prWin.close();
                            } else {
                                for (var i = 0; i < selections.length; i++) {
                                    var cartmap_uid = selections[i].get('unique_uid');

                                    cartmap_uids.push(cartmap_uid);
                                }

                                var reserved_varchar3 = Ext.getCmp('pd_category').getValue(); // cartmap 제품분류 코드

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/request.do?method=updateSelectedPdCategory',
                                    params: {
                                        unique_ids: cartmap_uids,
                                        reserved_varchar3: reserved_varchar3
                                    },
                                    success: function (result, request) {
                                        gm.me().store.load();
                                        if (prWin) {
                                            prWin.close();
                                        }
                                    }, // endofsuccess
                                    failure: extjsUtil.failureMessage
                                }); // endofajax
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show();

            } //handler end...

        });

        //납기일 변경 Action 생성
        this.modifyDeliveryAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '납기일 변경',
            tooltip: '납기일 변경',
            disabled: true,
            handler: function () {

                var selections = gm.me().grid.getSelectionModel().getSelection();
                var cartmap_uids = [];
                var req_date = null;

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    // defaults: {
                    //     layout: 'form',
                    //     xtype: 'container',
                    //     defaultType: 'textfield',
                    //     style: 'width: 100%'
                    // },
                    items: [{
                        xtype: 'datefield',
                        id: 'request_date',
                        name: 'request_date',
                        fieldLabel: toolbar_pj_req_date,
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y/m/d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y/m/d H:i:s'
                        // value: Ext.Date.add (new Date(),Ext.Date.DAY,14),
                        anchor: '100%'
                    }]
                })

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '납기일 변경',
                    width: 350,
                    height: 150,
                    plain: true,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function (btn) {
                            if (btn == 'no') {
                                prWin.close();
                            } else {
                                for (var i = 0; i < selections.length; i++) {
                                    var cartmap_uid = selections[i].get('unique_uid');

                                    cartmap_uids.push(cartmap_uid);
                                }

                                req_date = Ext.getCmp('request_date').getValue();
                                req_date = Ext.Date.format(req_date, 'Y-m-d');

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/request.do?method=updateSelectedReqDate',
                                    params: {
                                        unique_ids: cartmap_uids,
                                        req_date: req_date
                                    },
                                    success: function (result, request) {
                                        gm.me().store.load();
                                        if (prWin) {
                                            prWin.close();
                                        }
                                    }, // endofsuccess
                                    failure: extjsUtil.failureMessage
                                }); // endofajax
                            }
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show();

            } //handler end...

        });

        this.cartDEAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '반려',
            disabled: true,
            handler: function (widget, event) {
                var rec = gm.me().grid.getSelectionModel().getSelection();

                var cartmap_uids = [];

                for (var i = 0; i < rec.length; i++) {
                    cartmap_uids.push(rec[i].get('unique_uid'));
                }

                var rtg_flag = null;
                if (vCompanyReserved4 == 'KWLM01KR') {
                    rtg_flag = 'Y';
                }

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/prch.do?method=orderRemove',
                    params: {
                        cartmap_uids: cartmap_uids,
                        status: 'DE',
                        rtg_flag: rtg_flag
                    },
                    success: function (result, request) {
                        gm.me().store.load();
                    },
                    failure: extjsUtil.failureMessage
                });


            }
        });

        //견적요청 Action 생성
        this.createRfAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '견적 요청',
            tooltip: '견적 요청',
            disabled: true,
            handler: function () {

                //OR17060001
                var fullYear = gUtil.getFullYear() + '';
                var month = gUtil.getMonth() + '';
                if (month.length == 1) {
                    month = '0' + month;
                }

                var first = "FQ" + fullYear.substring(2, 4) + month;
                console_logs('first', first);

                // 마지막 수주번호 가져오기
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPono',
                    params: {
                        first: first,
                        codeLength: 4
                    },
                    success: function (result, request) {
                        var rf_no = result.responseText;

                        gm.me().treatRf(rf_no);

                    }, // endofsuccess
                    failure: extjsUtil.failureMessage
                }); // endofajax


            } //handler end...

        });

        //계약 갱신/
        this.updateCartmapContract = Ext.create('Ext.Action', {
            iconCls: 'fa-retweet_14_0_5395c4_none',
            text: '계약 갱신',
            tooltip: '계약 갱신',
            disabled: true,
            handler: function () {
                gm.me().treatCartmapContract();

            } //handler end...

        });

        //계약 갱신/
        this.updateCartmapReqdate = Ext.create('Ext.Action', {
            iconCls: 'fa-retweet_14_0_5395c4_none',
            text: '납기일 변경',
            tooltip: '납기일자 변경',
            disabled: true,
            handler: function () {
                gm.me().treatCartmapReqdate();

            } //handler end...

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

            } //handler end...

        });

        this.callParent(arguments);
        this.loadStoreAlways = true;
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            console_logs('>>selections', selections);

            if (selections.length == 1) {
                var select = gm.me().grid.getSelectionModel().getSelection()[0]; 

                var product_name = select.get('dsmf_top_item');
                if(product_name == null || product_name.length<1) product_name = '없음';
                Ext.getCmp(gu.id('product_name')).update(product_name);

                var child = select.get('work_cursor2');
                var pjuid = select.get('coord_key3');
                var parent_uid = select.get('work_cursor3');
                gm.me().cloudAsStore.getProxy().setExtraParam('child', child);
                gm.me().cloudAsStore.getProxy().setExtraParam('parent_uid', parent_uid);
                gm.me().cloudAsStore.getProxy().setExtraParam('pjuid', pjuid);
                gm.me().cloudAsStore.getProxy().setExtraParam('multi_prd', true);
                gm.me().cloudAsStore.load({
                    callback: function() {
                        if (gm.me().treeView != null) {
                            gm.me().treeView.expandAll();
                        }
                    }
                });

            } else {
                Ext.getCmp(gu.id('product_name')).update('요청번호를 선택하세요');
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.storeLoad();
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

                }, //endofsuccess
                failure: extjsUtil.failureMessage
            }); //endofajax
        } // end of if uniqueid
    },


    //불출요청 폼
    treatPaperAddInPoRoll: function () {
        var next = gUtil.getNextday(0);
        var arrExist = [];
        var arrCurrency = [];
        var arrTotalPrice = [];
        var cartmapUids = [];
        var selections = gm.me().gridGoList.getSelectionModel().getSelection();
        var specs = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var unique_id = rec.get('unique_id');
            var child = rec.get('child');
            var item_name = rec.get('item_name');
            var specification = rec.get('specification');
            var pj_name = rec.get('pj_name');
            var stock_qty_useful = rec.get('stock_qty_useful');
            var quan = rec.get('quan');
            var sales_price = rec.get('sales_price');
            cartmapUids.push(rec.get('unique_uid'));
            //	        		total = total+total_price;
            arrExist.push(item_name);
            specs.push(specification);

            console_logs('arrTotalPrice----------------', arrTotalPrice);

            console_logs('arrExist----------------', arrExist);
            console_logs('arrCurrency----------------', arrCurrency);
        }

        var reserved_varcharb = null;

        var orderBy = "사내";

        form = Ext.create('Ext.form.Panel', {
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
                title: '불출요청',
                width: 400,
                margins: '0 20 0 0',
                collapsible: true,
                anchor: '100%',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {
                            top: 0,
                            right: 100,
                            bottom: 0,
                            left: 10
                        }
                    }
                },
                items: [{
                    fieldLabel: '주문처',
                    xtype: 'textfield',
                    hidden: true,
                    anchor: '100%',
                    /*id: 'stcok_pur_supplier_info',
                     name: 'stcok_pur_supplier_info',*/
                    id: 'in_supplier',
                    name: 'in_supplier',
                    value: orderBy,//'스카나코리아',
                    //	            		emptyText: '스카나코리아',
                    allowBlank: false,
                    typeAhead: false,
                    editable: false,
                },
                    {
                        fieldLabel: '프로젝트',
                        name: 'pj_name',
                        fieldLabel: '프로젝트',
                        anchor: '-5',
                        //readOnly : true,
                        //fieldStyle : 'background-color: #ddd; background-image: none;',
                        allowBlank: true,
                        editable: false,
                        value: pj_name
                    },

                    {
                        fieldLabel: '납품장소',
                        hidden: true,
                        xtype: 'textfield',
                        rows: 4,
                        anchor: '100%',
                        id: 'reserved_varchar1',
                        name: 'reserved_varchar1',
                        value: (vCompanyReserved4 == 'SKNH01KR') ? '당사 현장사무실(자재팀)' : '사내'
                    },

                    {
                        fieldLabel: '비고',
                        xtype: 'textarea',
                        rows: 4,
                        anchor: '100%',
                        id: 'reserved_varchar2',
                        name: 'reserved_varchar2',

                    },
                    {
                        fieldLabel: '품명',
                        xtype: 'textfield',
                        id: 'item_name',
                        name: 'item_name',
                        value: arrExist[0] + ' 포함 ' + arrExist.length + '건',
                        readOnly: true

                    },
                    {
                        fieldLabel: '규격',
                        xtype: 'textfield',
                        id: 'specification',
                        name: 'specification',
                        value: specs[0] + ' 포함 ' + specs.length + '건',
                        readOnly: true

                    },
                    {
                        fieldLabel: '가용재고',
                        xtype: 'textfield',
                        hidden: true,
                        id: 'stock_qty_useful',
                        name: 'stock_qty_useful',
                        value: stock_qty_useful,
                        readOnly: true

                    },
                    {
                        fieldLabel: '주문수량',
                        xtype: 'textfield',
                        hidden: true,
                        id: 'quan',
                        name: 'quan',
                        value: quan,
                        fieldStyle: 'background-color:#FBF8E8; background-image: none;',
                        editable: true

                    }
                ]
            }]
        });
        myHeight = 290;
        myWidth = 420;

        prwin = this.Inprwinopen(form);
    },

    treatCartmapContract: function () {
        var selections = gm.me().gridPoList.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
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

    treatCartmapReqdate: function () {
        var selections = gm.me().gridPoList.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
        } else {

            var cartmapUids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                cartmapUids.push(rec.get('id'));
            }

            var o = gu.getCmp('req_date');

            var req_date = o.getValue();

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/request.do?method=updateReqsate',
                params: {
                    unique_uids: cartmapUids,
                    req_date: req_date
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

    treatRf: function (rf_no) {

        var selections = gm.me().gridPoList.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        var next = gUtil.getNextday(0);
        var request_date = gm.me().request_date;


        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
            return;
        } else {

            var form = null;
            var pjArr = [];
            var supArr = [];
            var cartmapUids = [];
            var notDefinedSup = false;

            var price_is_zero = 0;
            var qty_is_zero = 0;

            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                console_logs('rec', rec);
                var supplier_code = rec.get('supplier_code');
                if (coord_key1 == undefined || coord_key1 == null || coord_key1 == '' || coord_key1 < 0) {
                    notDefinedSup = true;
                }
                pjArr.push(rec.get('pj_code'));
                supArr.push(supplier_code);
                cartmapUids.push(rec.get('id'));

                var quan = rec.get('quan');
                var static_sales_price = rec.get('static_sales_price');
                if (quan < 0.0000001) {
                    qty_is_zero++;
                }
                if (static_sales_price < 0.0000001) {
                    price_is_zero++;
                }

            }

            var reserved_number2 = selections[0].get('reserved_number2');

            //중복제거
            pjArr = gu.removeDupArray(pjArr);
            supArr = gu.removeDupArray(supArr);
            console_logs('pjArr', pjArr);
            console_logs('supArr', supArr);
            console_logs('cartmapUids', cartmapUids);


            if (pjArr.length > 1 && gm.me().canDupProject == false) {
                Ext.Msg.alert('알림', '같은 프로젝트를  선택해주세요.', function () {
                });
            } else if (supArr.length > 1 && gm.me().changeSupplier == false) {
                Ext.Msg.alert('알림', '같은 공급사를 지정해 주세요.', function () {
                });
            } else if (notDefinedSup == true && gm.me().changeSupplier == false) {
                Ext.Msg.alert('알림', '공급사를 지정하지 않은 항목이 있습니다. 먼저 계약 갱신을 실행하세요.', function () {
                });
            } else {
                var next = gUtil.getNextday(0);

                var total = 0;
                for (var i = 0; i < selections.length; i++) {
                    var rec = selections[i];
                    var total_price = rec.get('total_price');
                    total = total + total_price;

                }

                var supplierStore = Ext.create('Mplm.store.SupastStore', {
                    supplierType: gm.me().suplier_type,
                    pageSize: 200
                });

                var this_date = Ext.Date.add(new Date(), Ext.Date.DAY, 14);

                this_date = Ext.Date.format(this_date, 'Y-m-d');

                var formItems = [{
                    xtype: 'fieldset',
                    title: '견적 내역',
                    collapsible: false,
                    width: '100%',
                    style: 'padding:10px',
                    defaults: {
                        width: '100%',
                        layout: {
                            type: 'hbox'
                        }
                    },
                    items: [{
                        fieldLabel: '프로젝트',
                        name: 'pj_name',
                        xtype: 'textfield',
                        value: selections[0].get('pj_name'),
                        fieldStyle: 'background-color: #ddd; background-image: none;',
                        readOnly: true
                    },
                        {
                            fieldLabel: '합계금액',
                            name: 'total_price',
                            xtype: 'textfield',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: Ext.util.Format.number(total, '0,00/i')/* + ' ' + selections[0].get('cart_currency')*/,
                            readOnly: true
                        },
                        {
                            fieldLabel: '요약',
                            xtype: 'textfield',
                            name: 'item_abst',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
                            readOnly: true
                        }, {
                            fieldLabel: '견적번호',
                            xtype: 'textfield',
                            rows: 4,
                            anchor: '100%',
                            name: 'rf_no',
                            value: rf_no
                        },
                        // {
                        //     fieldLabel: '요청사항',
                        //     xtype: 'textarea',
                        //     rows: 4,
                        //     anchor: '100%',
                        //     name: 'reserved_varchar2'
                        // },
                        new Ext.form.Hidden({
                            name: 'unique_uids',
                            value: cartmapUids
                        }), new Ext.form.Hidden({
                            name: 'coord_key3',
                            value: selections[0].get('coord_key3')
                        }), new Ext.form.Hidden({
                            name: 'ac_uid',
                            value: selections[0].get('ac_uid')
                        }), new Ext.form.Hidden({
                            name: 'req_date',
                            value: selections[0].get('req_date') == null ? this_date : selections[0].get('req_date'),
                            // value: Ext.Date.format(selections[0].get('req_date'), 'Y-m-d') //selections[0].get('req_date')
                        }), new Ext.form.Hidden({
                            name: 'sales_price',
                            value: total
                        }), new Ext.form.Hidden({
                            name: 'status', //견적 요청시에 상태변경
                            value: 'FQ'
                        })
                    ]
                }];


                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanelRf'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    // defaults: {
                    //     layout: 'form',
                    //     xtype: 'container',
                    //     defaultType: 'textfield',
                    //     style: 'width: 100%'
                    // },
                    items: formItems
                })
                var myHeight = 480;
                var myWidth = 600;

                var items = [form];

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '견적 작성',
                    width: myWidth,
                    height: myHeight,
                    plain: true,
                    items: items,
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
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createheavycontractRf',
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
                                    });

                                } // end of formvalid
                            } //else
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show(undefined, function () {
                    var combo = gu.getCmp('target_supplier');
                    console_logs('combo', combo);
                    var selections = gm.me().gridPoList.getSelectionModel().getSelection();
                    if (selections == null || selections.length == 0) {
                        return;
                    }
                    var rec = selections[0];
                    console_logs('rec', rec);
                    var supplier_uid = rec.get('coord_key1');
                    var supplier_name = rec.get('supplier_name');


                    if (combo != null) { //공급사 자동선택
                        // combo.setValue(supplier_uid);
                        // var record = combo.findRecordByValue(val);
                        // if(record!=null) {
                        //     combo.select(record);
                        // }
                        combo.store.load(function (records) {
                            console_logs('combo.store.load records', records);

                            if (records != null) {
                                for (var i = 0; i < records.length; i++) {
                                    console_logs('obj', records[i]);

                                    var obj = records[i];
                                    try {
                                        if (obj.get(combo.valueField) == supplier_uid) {
                                            combo.select(obj);
                                        }
                                    } catch (e) {
                                    }
                                }
                            }//endofif

                        });


                    }//endof if(combo!=null) {
                });
            }

        }

    },

    treatPo: function (po_no) {

        var selections = gm.me().gridPoList.getSelectionModel().getSelection();
        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
        var next = gUtil.getNextday(0);
        var request_date = gm.me().request_date;


        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
            return;
        } else {

            var form = null;
            var pjArr = [];
            var supArr = [];
            var cartmapUids = [];
            var notDefinedSup = false;

            var price_is_zero = 0;
            var qty_is_zero = 0;

            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                console_logs('rec', rec);
                var contract_uid = rec.get('contract_uid');

                pjArr.push(rec.get('pj_code'));
                supArr.push(contract_uid);
                cartmapUids.push(rec.get('id'));

                var quan = rec.get('quan');
                var static_sales_price = rec.get('static_sales_price');
                if (quan < 0.0000001) {
                    qty_is_zero++;
                }
                if (static_sales_price < 0.0000001) {
                    price_is_zero++;
                }

            }

            var reserved_number2 = selections[0].get('reserved_number2');

            //중복제거
            pjArr = gu.removeDupArray(pjArr);
            supArr = gu.removeDupArray(supArr);
            console_logs('pjArr', pjArr);
            console_logs('supArr', supArr);
            console_logs('cartmapUids', cartmapUids);

            switch (vCompanyReserved4) {
                case 'DABP01KR':  // DABP는 단가 0원 진행 => 말일 결산
                case 'KWLM01KR':
                    if (qty_is_zero > 0) {
                        Ext.Msg.alert('알림', '주문수량이 0인 항목이 ' + qty_is_zero + '건 있습니다.', function () {
                        });
                        return;
                    }
                    break
                case 'KBTC01KR':
                    if (qty_is_zero > 0) {
                        Ext.Msg.alert('알림', '주문수량이 0인 항목이 ' + qty_is_zero + '건 있습니다.', function () {
                        });
                        return;
                    }
                    // else if (price_is_zero > 0) {
                    //     Ext.Msg.alert('알림', '본 주문은 주문단가가 0인 항목이 ' + price_is_zero + '건 포함됩니다.', function () {
                    //     });
                    // }
                    break;
                default:
                    if (qty_is_zero > 0) {
                        Ext.Msg.alert('알림', '주문수량이 0인 항목이 ' + qty_is_zero + '건 있습니다.', function () {
                        });
                        return;
                    } else if (price_is_zero > 0) {
                        Ext.Msg.alert('알림', '주문단가 0인 항목이 ' + price_is_zero + '건 있습니다.', function () {
                        });
                        return;
                    }
                    break;
            }

            if (pjArr.length > 1 && gm.me().canDupProject == false) {
                Ext.Msg.alert('알림', '같은 프로젝트를  선택해주세요.', function () {
                });
            } else if (supArr.length > 1 && gm.me().changeSupplier == false) {
                Ext.Msg.alert('알림', '같은 공급사를 지정해 주세요.', function () {
                });
            } else if (notDefinedSup == true && gm.me().changeSupplier == false) {
                Ext.Msg.alert('알림', '공급사를 지정하지 않은 항목이 있습니다. 먼저 계약 갱신을 실행하세요.', function () {
                });
            } else {
                var next = gUtil.getNextday(0);

                var total = 0;
                for (var i = 0; i < selections.length; i++) {
                    var total_price = 0;
                    if (vCompanyReserved4 == 'KWLM01KR') {
                        var rec = selections[i];
                        console_logs('===rec', rec.get('sales_amount'));
                        try {
                            total_price = parseFloat(rec.get('sales_amount').replace(/,/gi, ''));
                        } catch (error) {
                            total_price = rec.get('sales_amount');
                        }

                    } else {
                        var rec = selections[i];
                        total_price = rec.get('total_price');
                    }
                    total = total + total_price
                }

                var supplierStore = Ext.create('Mplm.store.SupastStore', {
                    supplierType: gm.me().suplier_type
                });

                var this_date = Ext.Date.add(new Date(), Ext.Date.DAY, 14);

                this_date = Ext.Date.format(this_date, 'Y-m-d');

                var reserved_varcharb = selections[0].get('rtgast_varcharb');

                var formItems = [{
                    xtype: 'fieldset',
                    title: '주문 내역',
                    collapsible: false,
                    width: '100%',
                    style: 'padding:10px',
                    defaults: {
                        width: '100%',
                        layout: {
                            type: 'hbox'
                        }
                    },
                    items: [
                        {
                            fieldLabel: '프로젝트',
                            name: 'pj_name',
                            xtype: 'textfield',
                            value: selections[0].get('pj_name'),
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            readOnly: true
                        },
                        {
                            fieldLabel: '합계금액',
                            name: 'total_price',
                            xtype: 'textfield',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: Ext.util.Format.number(total, '0,00/i') /*+ ' ' + selections[0].get('cart_currency')*/,
                            readOnly: true
                        },
                        {
                            fieldLabel: '요약',
                            xtype: 'textfield',
                            name: 'item_abst',
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
                            readOnly: true
                        }, {
                            fieldLabel: '주문처',
                            xtype: 'combo',
                            id: gu.id('target_supplier'),
                            anchor: '100%',
                            name: 'coord_key1',
                            store: supplierStore,
                            displayField: 'supplier_name',
                            valueField: 'unique_id',
                            emptyText: '선택',
                            value: gm.me().gridPoList.getSelectionModel().getSelection()[0].get('contract_uid'),
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
                            triggerAction: 'all',
                            pageSize: 200,
                            hideTrigger:false,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {        
                                    coord_key1 = record.get('unique_id');         
                                }
                            }
                        }, {
                            fieldLabel: '주문번호',
                            xtype: 'textfield',
                            rows: 4,
                            anchor: '100%',
                            name: 'po_no',
                            value: po_no
                        },
                        {
                            fieldLabel: '납품장소',
                            xtype: 'textfield',
                            rows: 4,
                            anchor: '100%',
                            name: 'reserved_varchar1',
                            value: (vCompanyReserved4 == 'SKNH01KR') ? '당사 현장사무실(자재팀)' : '사내'
                        },
                        {
                            fieldLabel: '청구서명',
                            xtype: 'textarea',
                            rows: 4,
                            anchor: '100%',
                            name: 'reserved_varcharb',
                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                            value: reserved_varcharb
                        },
                        {
                            fieldLabel: '비고',
                            xtype: 'textarea',
                            rows: 4,
                            anchor: '100%',
                            name: 'reserved_varchar2'
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
                            name: 'coord_key3',
                            value: selections[0].get('coord_key3')
                        }), new Ext.form.Hidden({
                            name: 'ac_uid',
                            value: selections[0].get('ac_uid')
                        }), new Ext.form.Hidden({
                            name: 'req_date',
                            value: selections[0].get('req_date') == null ? this_date : selections[0].get('req_date'),
                            // value: Ext.Date.format(selections[0].get('req_date'), 'Y-m-d') //selections[0].get('req_date')
                        }), new Ext.form.Hidden({
                            name: 'sales_price',
                            value: total
                        }), new Ext.form.Hidden({
                            name: 'reserved_number2', //사업부
                            value: reserved_number2
                        })
                    ]
                }];

                var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: formItems
                })
                var myHeight = 400;
                var myWidth = 600;

                var items = [form];
                if (this.useRouting == true) {

                    this.rtgapp_store.load();
                    var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false});
                    var removeRtgapp = Ext.create('Ext.Action', {
                        itemId: 'removeRtgapp',
                        glyph: 'xf00d@FontAwesome',
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
                                    console_log(record);
                                    var unique_id = record.get('unique_id');
                                    console_log(unique_id);
                                    var direcition = -15;
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                        params: {
                                            direcition: direcition,
                                            unique_id: unique_id
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
                                        console_log(record);
                                        var unique_id = record.get('unique_id');
                                        console_log(unique_id);
                                        var direcition = 15;
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                            params: {
                                                direcition: direcition,
                                                unique_id: unique_id
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
                        //title: '결재경로',
                        store: this.rtgapp_store,
                        border: true,
                        frame: true,
                        style: 'padding-left:10px;padding-right:10px;',
                        width: '100%',
                        //layout: 'fit',
                        scroll: true,
                        selModel: selModel,
                        columns: [
                            {dataIndex: 'seq_no', text: '순서', width: 70, sortable: false}
                            , {dataIndex: 'user_id', text: '아이디', sortable: false}
                            , {dataIndex: 'user_name', text: '이름', flex: 1, sortable: false}
                            //,{ dataIndex : 'emp_no', text : '사번',  sortable : false	}
                            //,{ dataIndex : 'company_code', text : '회사 코드',  sortable : false	}
                            , {dataIndex: 'dept_name', text: '부서 명', width: 90, sortable: false}
                            // ,{ dataIndex : 'dept_code', text : '부서 코드',  sortable : false	}
                            //,{ dataIndex : 'app_type', text : 'app_type',  sortable : false	}
                            , {dataIndex: 'gubun', text: '구분', width: 50, sortable: false}
                            // ,{ dataIndex : 'unique_id', text : 'unique_id',  sortable : false	}
                            //,{ dataIndex : 'create_date', text : '생성일자',  sortable : false	}
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
                                    text: '결재 권한자 추가'//,
                                    //style: 'color:white;'

                                }, {
                                    id: 'user_name',
                                    name: 'user_name',
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
                                    width: 200,
                                    listConfig: {
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            console_logs('Selected combo : ', combo);
                                            console_logs('Selected record : ', record);
                                            console_logs('Selected Value : ', record.get('unique_id'));

                                            var unique_id = record.get('unique_id');
                                            var user_id = record.get('user_id');
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
                                                params: {
                                                    useruid: unique_id,
                                                    userid: user_id
                                                    , gubun: 'D'
                                                },
                                                success: function (result, request) {
                                                    var result = result.responseText;
                                                    console_log('result:' + result);
                                                    if (result == 'false') {
                                                        Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
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

                    items.push(this.agrid);
                }

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '주문 작성',
                    width: myWidth,
                    height: myHeight,
                    plain: true,
                    items: items,
                    buttons: [{
                        text: CMD_OK,
                        id: 'prBtn',
                        handler: function (btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                if (form.isValid()) {

                                    prWin.setLoading(true);

                                    var val = form.getValues(false);

                                    //결재사용인 경우 결재 경로 확인
                                    if (gm.me().useRouting == true) {

                                        var items = gm.me().rtgapp_store.data.items;
                                        console_logs('items.length', items.length);
                                        if (items.length < 2) {
                                            Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                                            return;
                                        }

                                        var ahid_userlist = new Array();
                                        var ahid_userlist_role = new Array();

                                        for (var i = 0; i < items.length; i++) {
                                            var rec = items[i];
                                            console_logs('items rec', rec);
                                            ahid_userlist.push(rec.get('usrast_unique_id'));
                                            ahid_userlist_role.push(rec.get('gubun'));
                                        }
                                        val['hid_userlist'] = ahid_userlist;
                                        val['hid_userlist_role'] = ahid_userlist_role;
                                    }
                                    console_logs('val', val);



                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createContractByCopy',
                                        params: val,
                                        success: function (val, action) {
                                            prWin.setLoading(false);
                                            prWin.close();
                                            gm.me().poCartListStore.load();
                                        },
                                        failure: function (val, action) {
                                            prWin.setLoading(false);
                                            prWin.close();
                                            gm.me().poCartListStore.load()

                                        }
                                    });

                                } // end of formvalid
                            } //else
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function (btn) {
                            prWin.close();
                        }
                    }]
                });
                prWin.show(undefined, function () {
                    var combo = gu.getCmp('target_supplier');
                    console_logs('combo', combo);
                    var selections = gm.me().gridPoList.getSelectionModel().getSelection();
                    if (selections == null || selections.length == 0) {
                        return;
                    }
                    var rec = selections[0];
                    console_logs('rec', rec);
                    var supplier_uid = rec.get('coord_key1');
                    var supplier_name = rec.get('supplier_name');


                    if (combo != null) { //공급사 자동선택
                        // combo.setValue(supplier_uid);
                        // var record = combo.findRecordByValue(val);
                        // if(record!=null) {
                        //     combo.select(record);
                        // }
                        combo.store.load(function (records) {
                            console_logs('combo.store.load records', records);

                            if (records != null) {
                                for (var i = 0; i < records.length; i++) {
                                    console_logs('obj', records[i]);

                                    var obj = records[i];
                                    try {
                                        if (obj.get(combo.valueField) == supplier_uid) {
                                            combo.select(obj);
                                        }
                                    } catch (e) {
                                    }
                                }
                            }//endofif

                        });


                    }//endof if(combo!=null) {
                });
            }

        }

    },
    treatInPo: function () {

        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;

        var next = gUtil.getNextday(0);

        var request_date = gm.me().request_date;
        var pj_name = gm.me().vSELECTED_pj_name;
        var stock_qty_useful = gm.me().vSELECTED_STOCK_USEFUL;

        var selections = gm.me().gridGoList.getSelectionModel().getSelection();

        var isDifferent = false;


        if (selections.length > 1) {
            for (var i = 0; i < selections.length - 1; i++) {
                if (selections[i].get('ac_uid') != selections[i + 1].get('ac_uid')) {
                    isDifferent = true;
                    break;
                }
            }
        }

        var form = null;

        switch (vCompanyReserved4) {
            case 'KWLM01KR':
                if (uniqueId == undefined || uniqueId < 0) {
                    Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
                } else {
                    if (isDifferent) {
                        Ext.Msg.alert('알림', '같은 프로젝트를 선택해주세요.', function () {
                        });
                    } else {
                        this.treatPaperAddInPoRoll();
                    }
                }
                break;
            default:
                if (uniqueId == undefined || uniqueId < 0) {
                    Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
                } else {
                    if (stock_qty_useful == undefined || stock_qty_useful == "" || stock_qty_useful == null) {
                        Ext.Msg.alert("알림", "가용재고가 없습니다. 확인해주세요.");
                    } else if (isDifferent) {
                        Ext.Msg.alert('알림', '같은 프로젝트를 선택해주세요.', function () {
                        });
                    } else {
                        this.treatPaperAddInPoRoll();
                    }
                }
                break;
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
            case 'cartmap_comment1':
            case 'mass':
            case 'reserved_varchar3':
            case 'sales_amount':
                // case 'unit_code':
                this.updateDesinComment(rec, field);
                switch (vCompanyReserved4) {
                    case 'KWLM01KR':
                        break;
                    case 'KYNL01KR':
                    case 'SWON01KR':
                        this.storeLoad();
                        break;
                    default:
                        break;
                }
                break;
        }
    },
    updateDesinComment: function (rec, field) {
        console_logs('rec>>>', rec);
        var child = rec.get('child');

        var quan = rec.get('quan');
        var static_sales_price = rec.get('static_sales_price');
        var req_date = Ext.Date.format(rec.get('req_date'), 'Y-m-d');
        var cart_currency = rec.get('cart_currency');
        var unique_id = rec.get('unique_uid');
        var comment1 = rec.get('cartmap_comment1');
        var mass = rec.get('mass');
        var reserved_varchar3 = rec.get('reserved_varchar3');
        var sales_amount = rec.get('sales_amount');
        // var unit_code = rec.get('unit_code');
        var ac_uid = rec.get('ac_uid');

        if (vCompanyReserved4 != 'KWLM01KR') {
            if (static_sales_price != null && static_sales_price < 0) {
                static_sales_price = 0;
            }
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updateCreatePo',
            params: {
                quan: quan,
                child: child,
                static_sales_price: static_sales_price,
                cart_currency: cart_currency,
                req_date: req_date,
                unique_id: unique_id,
                comment1: comment1,
                mass: mass,
                reserved_varchar3: reserved_varchar3,
                reserved_double1: sales_amount,
                // unit_code:unit_code,
                field: field,
                // ac_uid:ac_uid
            },
            success: function (result, request) {
                var result = result.responseText;

                var sales_price = rec.get('static_sales_price');
                var quan = rec.get('quan');
                var unit_mass = rec.get('unit_mass');

                switch (vCompanyReserved4) {
                    case 'KWLM01KR':
                        if (field != null && (field == 'sales_price' || field == 'quan' || field == 'static_sales_price' || field == 'mass')) {
                            if (rec.get('unit_code') == 'Kg' && field == 'mass') {
                                rec.set('sales_amount', Math.floor(sales_price * mass));
                                rec.set('mass', mass);
                            } else if (rec.get('unit_code') == 'Kg' && (field == 'sales_price' || field == 'static_sales_price')) {
                                rec.set('sales_amount', Math.floor(sales_price * mass));
                                rec.set('mass', mass);
                            } else {
                                rec.set('sales_amount', Math.floor(sales_price * quan));
                                rec.set('mass', unit_mass * quan);
                            }

                        }
                        // else if(field == 'mass') {
                        //     rec.set('sales_amount', sales_price*mass);
                        // }
                        var selections = gm.me().grid.getSelectionModel().getSelection();
                        var total_price_sum = 0;
                        var total_qty = 0;
                        for (var i = 0; i < selections.length; i++) {
                            var ctr_flag = selections[i].get('ctr_flag');
                            var sales_amount = selections[i].get('sales_amount');
                            try {
                                sales_amount = sales_amount.replace(",", "");
                            } catch (error) {

                            }

                            sales_amount = parseFloat(sales_amount);

                            total_price_sum += sales_amount;
                            var qty = selections[i].get('quan');
                            total_qty += qty;
                        }
                        gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
                        break;
                    default:
                        rec.set('sales_amount', sales_price * quan);
                        rec.set('mass', unit_mass * quan);
                        break;
                }


                // gm.me().store.load();
                //console_logs("", result);

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

            }, //endofsuccess
            failure: extjsUtil.failureMessage
        }); //endofajax
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
    // 불출요청
    Inprwinopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '불출 요청',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var msg = '불출 요청하시겠습니까?';
                    var myTitle = '불출 확인';
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
                                var selections = gm.me().gridGoList.getSelectionModel().getSelection();
                                var ac_uid = selections[0].get('ac_uid');
                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];
                                    var uid = rec.get('id');
                                    var srcahd_uid = rec.get('unique_id');
                                    var coord_key3 = rec.get('coord_key3');
                                    var currency = rec.get('cart_currency');
                                    var item_name = rec.get('item_name');
                                    var static_sales_price = rec.get('static_sales_price');
                                    var request_info = rec.get('request_info');

                                    //불출수량의 수량 = reserved_double1
                                    var quan = rec.get('reserved_double1');

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

                                    prWin.setLoading(true);

                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createGoAtPo',
                                        params: {
                                            sancType: 'YES',
                                            item_name: item_name,
                                            cartmaparr: cartmapArr,
                                            srcahdarr: srcahdArr,
                                            quans: quanArr,
                                            currencies: curArr,
                                            names: nameArr,
                                            coord_key3s: coordArr,
                                            sales_prices: priceArr,
                                            pj_name: pj_name,
                                            mp_status: 'GR',
                                            ac_uid: ac_uid
                                        },
                                        success: function (val, action) {
                                            prWin.close();
                                            Ext.Msg.alert('안내', '발주 완료 되었습니다.', function () {
                                            });
                                            gm.me().goCartListStore.load();
                                            prWin.setLoading(false);
                                        },
                                        failure: function (val, action) {

                                            prWin.close();

                                        }
                                    })
                                } // end of formvalid
                            } // btnIf of end
                        } //fn function(btn)

                    }); //show
                } //btn handler
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

    rtgapp_store: null,
    //결재조건
    payConditionStore: Ext.create('Mplm.store.PayConditionStore', {
        hasNull: false
    }),
    CheckConditionStore: Ext.create('Mplm.store.CheckConditionStore', {
        hasNull: false
    }),
    DeliveryConditionStore: Ext.create('Mplm.store.DeliveryConditionStore', {
        hasNull: false
    }),
    comcstStore: Ext.create('Mplm.store.ComCstStore', {
        hasNull: false
    }),

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
                        url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp',
                        params: {
                            unique_id: unique_id
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

    attachFileView: function () {
        var fieldPohistory = [
            {name: 'account_code', type: "string"},
            {name: 'account_name', type: "string"},
            {name: 'po_no', type: "string"},
            {name: 'po_date', type: "string"},
            {name: 'seller_code', type: "string"},
            {name: 'seller_name', type: "string"},
            {name: 'sales_price', type: "string"},
            {name: 'pr_qty', type: "string"}
        ];


        var selections = gm.me().grid.getSelectionModel().getSelection();
        console_logs('===>attachFileView', selections);
        if (selections) {
            var coord_key3 = selections[0].get('coord_key3');

            if (coord_key3 != null && coord_key3 > -1) {
                gm.me().attachedFileStore.getProxy().setExtraParam('group_code', coord_key3);
                gm.me().attachedFileStore.load(function (records) {

                    console_logs('attachedFileStore records', records);
                    if (records != null) {
                        var o = gu.getCmp('file_quan');
                        if (o != null) {
                            o.update('총수량 : ' + records.length);
                        }
                    }
                });
            }


            var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});

            var fileGrid = Ext.create('Ext.grid.Panel', {
                title: '첨부',
                store: gm.me().attachedFileStore,
                collapsible: true,
                multiSelect: true,
                selModel: selFilegrid,
                stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

                ],
                columns: [
                    {
                        text: 'UID',
                        width: 100,
                        sortable: true,
                        dataIndex: 'id'
                    },
                    {
                        text: '파일명',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'object_name'
                    },
                    {
                        text: '파일유형',
                        width: 70,
                        sortable: true,
                        dataIndex: 'file_ext'
                    },
                    {
                        text: '날짜',
                        width: 160,
                        sortable: true,
                        dataIndex: 'create_date'
                    },
                    {
                        text: 'size',
                        width: 100,
                        sortable: true,
                        xtype: 'numbercolumn',
                        format: '0,000',
                        style: 'text-align:right',
                        align: 'right',
                        dataIndex: 'file_size'
                    }]
            });

            Ext.define('XpoAstHistory', {
                extend: 'Ext.data.Model',
                fields: /*(G)*/fieldPohistory,
                proxy: {
                    type: 'ajax',
                    api: {
                        read: CONTEXT_PATH + '/purchase/request.do?method=readPohistory'
                    },
                    reader: {
                        type: 'json',
                        root: 'datas',
                        totalProperty: 'count',
                        successProperty: 'success',
                        excelPath: 'excelPath'
                    },
                    writer: {
                        type: 'singlepost',
                        writeAllFields: false,
                        root: 'datas'
                    }
                }
            });

            var poHistoryStore = new Ext.data.Store({
                pageSize: 50,
                model: 'XpoAstHistory',
                sorters: [{
                    property: 'po_date',
                    direction: 'DESC'
                }]
            });

            poHistoryStore.getProxy().setExtraParam('uid_srcahd', selections[0].get('child'));
            poHistoryStore.load();
            var selhistoryGrid = Ext.create("Ext.selection.CheckboxModel", {});
            var historyGrid = Ext.create('Ext.grid.Panel', {
                title: '구매이력',
                store: poHistoryStore,
                collapsible: true,
                multiSelect: true,
                selModel: selhistoryGrid,
                stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    // items: [

                    //     ]
                }

                ],
                columns: [
                    {
                        text: '프로젝트코드',
                        sortable: true,
                        width: 120,
                        dataIndex: 'account_code'
                    },
                    {
                        text: '프로젝트명',
                        width: 100,
                        sortable: true,
                        dataIndex: 'account_name',
                        flex: 1
                    },
                    // {
                    //     text     : 'Assembly',
                    //     width     : 160,
                    //     sortable : true,
                    //     dataIndex: 'create_date'
                    // },
                    {
                        text: '발주번호',
                        width: 130,
                        sortable: true,
                        dataIndex: 'po_no'
                    },
                    {
                        text: '주문일자',
                        width: 160,
                        sortable: true,
                        dataIndex: 'po_date'
                    },
                    {
                        text: '공급사명',
                        width: 160,
                        sortable: true,
                        dataIndex: 'seller_name'
                    },
                    {
                        text: '주문단가',
                        width: 160,
                        sortable: true,
                        dataIndex: 'sales_price'
                    },
                    {
                        text: '주문수량',
                        width: 160,
                        sortable: true,
                        dataIndex: 'pr_qty'
                    }
                ]
            });

            var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: '첨부파일',
                width: 1200,
                height: 600,
                items: [
                    fileGrid,
                    historyGrid
                ],
                buttons: [
                    {
                        text: CMD_OK,
                        //scope:this,
                        handler: function () {
                            if (prWin) {
                                prWin.close();
                            }
                        }
                    }
                ]
            })
            prWin.show();
        }
    },

    renderMoveBom: function () {

        var rec = this.grid.getSelectionModel().getSelection()[0];

        if (rec != null) {

            var wa_name = rec.get('wa_name');
            var pj_name = rec.get('pj_name');
            var pj_code = rec.get('pj_code');
            var pj_uid = rec.get('ac_uid');
            var parent_uid = rec.get('parent_uid');
            var child = rec.get('coord_key3');

            if (pj_uid == null || pj_uid < 0) {
                Ext.Msg.alert('안내', '프로젝트가 없습니다.', function () {
                });
                return;
            }

            return gm.me().renderBom(wa_name, pj_name, pj_code, pj_uid, parent_uid, child);
        }
    },

    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),

    // 공급사 유형 필터
    suplier_type: (vCompanyReserved4 == 'KWLM01KR') ? null : 'R',

    //프로젝트 중복 혀용 여부
    canDupProject: (vCompanyReserved4 == 'DABP01KR') ? true : false,

    //주문시 공급사 지정
    changeSupplier: (vCompanyReserved4 == 'SKNH01KR' || vCompanyReserved4 == 'KBTC01KR') ? false : true,

    //결재 기능 사용
    useRouting: (vCompanyReserved4 == 'KWLM01KR' || vCompanyReserved4 == 'DABP01KR' || vCompanyReserved4 == 'APM01KR') ? true : false,

    buttonToolbar3: Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '총 금액 : 0 / 총 수량 : 0'
        }]
    }),

    prdClassForm: function () {

        this.removePRDAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            disabled: true,

            handler: function (widget, event) {
                var selections = gm.me().gridCartList.getSelectionModel().getSelection()[0];
                var unique_id = selections.get('unique_id');

                Ext.MessageBox.show({
                    title: '확인',
                    msg: '삭제 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/code.do?method=prdClassMethod',
                                params: {
                                    unique_id: unique_id,
                                    type: 'REMOVE'
                                },
                                success: function (result, request) {
                                    var result = result.responseText;
                                    gm.me().prd_class_store.load();
                                    // console_logs("", result);

                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                });

            }
        });

        var PRD_COLUMN = [];

        PRD_COLUMN.push(
            {
                header: 'No.', xtype: 'rownumberer',
                width: 100, align: 'left', resizable: true, sortable: true,
            },
            {
                header: '대분류', dataIndex: 'codeName',
                width: 200, align: 'left', resizable: true, sortable: true,
                css: 'edit-cell', renderer: function (value, meta) {
                meta.css = 'custom-column';
                return value;
            },
                editor: {},
                filter: {
                    type: 'list',
                    // store: this.prd_class_store
                },
            },
            {
                header: '순서', dataIndex: 'code_order',
                width: 100, align: 'left', resizable: true, sortable: true,
                css: 'edit-cell', renderer: function (value, meta) {
                meta.css = 'custom-column';
                return value;
            },
                editor: {},
                filter: {
                    type: 'list',
                    // store: this.prd_class_store
                },
            }, {
                header: '비고', dataIndex: '',
                width: 100, align: 'left', resizable: true, sortable: true,
            }
        );

        this.prd_class_store.load(function () {
        });

        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        prd_grid = Ext.create('Ext.grid.Panel', {
            id: 'pr-div2',
            store: this.prd_class_store,
            multiSelect: true,
            stateId: 'stateGridsub',
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            autoScroll: true,
            autoHeight: true,
            filterable: true,
            height: 650,  // (getCenterPanelHeight()/5) * 4
            //        bbar: getPageToolbar(store),
            region: 'center',
            columns: /*(G)*/PRD_COLUMN,
            plugins: [cellEditing, {
                ptype: 'gridfilters'
            }],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addPRDAction, this.removePRDAction
                    ]
                }
            ]
        });

        prd_grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    // gm.me().addPRDAction.enable();
                    // gm.me().editPRDAction.enable();
                    gm.me().removePRDAction.enable();
                } else {
                    // gm.me().addPRDAction.disable();
                    // gm.me().editPRDAction.disable();
                    gm.me().removePRDAction.disable();
                }
            }
        });

        prd_grid.on('edit', function (editor, e) {
            console_logs('===prd_grid', 'pppp');
            var rec = e.record;
            var field = e['field'];
            console_logs('===rec', rec);
            console_logs('===field', field);

            var unique_id = rec.get('unique_id');
            var codeName = rec.get('codeName');
            var code_order = rec.get('code_order');
            console_logs('===codeName', codeName);

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/code.do?method=prdClassMethod',
                params: {
                    unique_id: unique_id,
                    type: 'EDIT',
                    codeName: codeName,
                    code_order: code_order
                },
                success: function (result, request) {
                    var result = result.responseText;
                    gm.me().store.load();
                    // console_logs("", result);

                },
                failure: extjsUtil.failureMessage
            });
        })

        return prd_grid;

    },

    prd_class_store: Ext.create('Mplm.store.PrdClassStore', {}),

    addPRDAction: Ext.create('Ext.Action', {
        iconCls: 'af-plus-circle',
        text: '신규생성',
        disabled: false,

        handler: function (widget, event) {

            var form = Ext.create('Ext.form.Panel', {
                id: 'formBack',
                defaultType: 'textfield',
                border: false,
                bodyPadding: 15,
                width: 400,
                height: 250,
                defaults: {
                    // anchor: '100%',
                    editable: true,
                    allowBlank: false,
                    msgTarget: 'side',
                    labelWidth: 100
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'codeName',
                        id: 'codeName',
                        allowBlank: false,
                        fieldLabel: '대분류'
                    }, {
                        xtype: 'textfield',
                        name: 'code_order',
                        id: 'code_order',
                        allowBlank: true,
                        fieldLabel: '순서'
                    }
                ]
            });

            var win = Ext.create('ModalWindow', {
                title: '신규 생성',
                width: 400,
                height: 250,
                minWidth: 250,
                minHeight: 180,
                items: form,
                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        var form = Ext.getCmp('formBack');
                        var codeName = form.items.items[0].getValue();
                        var code_order = form.items.items[1].getValue();
                        console_logs('==codeName', codeName);
                        console_logs('==code_order', code_order);
                        // var val = form.items.items[0].getValue();
                        // console_logs('==val', val);
                        //start
                        Ext.MessageBox.show({
                            title: '확인',
                            msg: '추가 하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            fn: function (result) {
                                if (result == 'yes') {

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/code.do?method=prdClassMethod',
                                        params: {
                                            type: 'REGIST',
                                            codeName: codeName,
                                            code_order: code_order,
                                            parent_system_code: 'PRD_CLASS_CODE'
                                        },
                                        success: function (result, request) {
                                            var result = result.responseText;
                                            gm.me().prd_class_store.load();
                                            // console_logs("", result);

                                        },
                                        failure: extjsUtil.failureMessage
                                    });

                                }
                            },
                            //animateTarget: 'mb4',
                            icon: Ext.MessageBox.QUESTION
                        });
                        //end
                        win.close();
                        //		      		});
                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (win) {
                            win.close();
                        }
                    }
                }]
            });
            win.show(/* this, function(){} */);
        }
    }),

    nextRow: vCompanyReserved4 == 'KWLM01KR' ? true : false,

    AttachFileViewAction: Ext.create('Ext.Action', {
        iconCls: 'af-pdf',
        text: '첨부파일',
        tooltip: '첨부파일',
        disabled: true,
        handler: function (widget, event) {
            var selections = gm.me().grid.getSelectionModel().getSelection()[0];
            gm.me().attachFileView();
        }
    }),

    currentTab: 'cart',

    PdCategoryTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PRD_CLASS_CODE'}),

    setSelections: function (selections) {

        if (selections.length) {

            var rec = selections[0];
            gm.me().rec = rec;
            console_logs('rec 데이터', rec);
            this.checkEqualPjNames(rec);
            var standard_flag = rec.get('standard_flag');
            standard_flag = gUtil.stripHighlight(standard_flag); //하이라이트 삭제

            console_logs('그리드온 데이터', rec);
            gm.me().request_date = rec.get('req_date'); // 납기일
            gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //cartmap_uid
            gm.me().vSELECTED_PJ_UID = rec.get('ac_uid'); //프로젝트아이디
            gm.me().vSELECTED_SP_CODE = rec.get('sp_code');
            gm.me().vSELECTED_CURRENCY = rec.get('currency'); //스카나 통화
            gm.me().vSELECTED_STANDARD = rec.get('standard_flag');
            gm.me().vSELECTED_MYCARTQUAN = rec.get('mycart_quan');
            gm.me().vSELECTED_coord_key3 = rec.get('coord_key3'); // pj_uid
            gm.me().vSELECTED_coord_key2 = rec.get('coord_key2');
            gm.me().vSELECTED_coord_key1 = rec.get('coord_key1'); // 공급사
            gm.me().vSELECTED_po_user_uid = rec.get('po_user_uid');
            gm.me().vSELECTED_item_name = rec.get('item_name'); // 품명
            gm.me().vSELECTED_item_code = rec.get('item_code'); // 품번
            gm.me().vSELECTED_specification = rec.get('specification'); // 규격
            gm.me().vSELECTED_pj_name = rec.get('pj_name');
            gm.me().vSELECTED_req_date = rec.get('delivery_plan');
            gm.me().vSELECTED_pr_quan = rec.get('pr_quan');
            gm.me().vSELECTED_QUAN = rec.get('quan');
            gm.me().vSELECTED_PRICE = rec.get('sales_price');
            gm.me().vSELECTED_STOCK_USEFUL = rec.get('stock_qty_useful');

            this.cartmap_uids.push(gm.me().vSELECTED_UNIQUE_ID);

        } else {
            gm.me().vSELECTED_UNIQUE_ID = -1;
            gm.me().vSELECTED_PJ_UID = -1;

            this.cartmap_uids = [];
            this.currencies = [];
            for (var i = 0; i < selections.length; i++) {
                var rec1 = selections[i];
                var uids = rec1.get('id');
                var currencies = rec1.get('currency');
                this.cartmap_uids.push(uids);
                this.currencies.push(currencies);
            }
        }
    },

    afterCellEditEventHandler: function (field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        gm.editRedord(field, rec);


    },

    addPartAction: Ext.create('Ext.Action', {
        itemId: 'addPartAction',
        iconCls: 'af-plus-circle',
        disabled: false,
        text: '품목추가',
        handler: function (widget, event) {

            var selected_record = gm.me().grid.getSelectionModel().getSelection();

            if (selected_record == null) {
                Ext.MessageBox.alert('Error', '요청번호를 선택하십시오', function callBack(id) {
                    return
                });
                return;
            }

            var item = gm.me().gridCartList.getStore().data.items[0];

            gm.me().selectedPjUid = item.get('ac_uid');
            gm.me().selectedChild = item.get('child');

            var bHeight = 600;
            var bWidth = 600;

            var selection = gm.me().grid.getSelectionModel().getSelection()[0];
            var project_varchar6 = selection.get('project_varchar6');

            if(project_varchar6 == null || project_varchar6.length < 2) {
                Ext.Msg.alert('', '품목 추가는 LOT 구매인 경우에만 가능합니다.');
            } else {
                gm.me().createPartForm = Ext.create('Ext.form.Panel', {
                    title: '입력폼',
                    xtype: 'form',
                    width: bWidth,
                    height: bHeight,
                    bodyPadding: 15,
                    layout: {
                        type: 'vbox',
                        align: 'stretch' // Child items are stretched to full width
                    },
                    defaults: {
                        allowBlank: true,
                        msgTarget: 'side',
                        labelWidth: 60
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            value: '먼저 등록된 자재인지 검색하세요.'
                        }, {
                            id: gu.id('information'),
                            fieldLabel: '종전자재',
                            field_id: 'information',
                            name: 'information',
                            xtype: 'combo',
                            emptyText: '코드나 규격으로 검색',
                            store: gm.me().searchStore,
                            displayField: 'specification',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            sortInfo: {
                                field: 'specification',
                                direction: 'ASC'
                            },
                            minChars: 1,
                            typeAhead: false,
                            hideLabel: true,
                            hideTrigger: true,
                            anchor: '100%',
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 결과가 없습니다.',

                                // Custom rendering template for each item
                                getInnerTpl: function () {
                                    return '<div onclick="gm.me().setBomData({id});" ><a class="search-item" href="javascript:gm.me().setBomData({id});">' +
                                        '<font color=#999><small>{item_code}</small></font> <font color=#999>{item_name}</font> <font color=#999>{model_no}</font><br />{specification_query} <font color=#999><small>{maker_name}</small></font>' +
                                        '</a></div>';
                                }
                            },
                            pageSize: 10
                        },
                        new Ext.form.Hidden({
                            name: 'parent',
                            value: gm.me().selectedChild
                        }),
                        new Ext.form.Hidden({
                            name: 'ac_uid',
                            value: gm.me().selectedPjUid
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('pj_code'),
                            name: 'pj_code',
                            value: gm.me().selectedPjCode
                        }),
                        new Ext.form.Hidden({
                            id: 'assy_code',
                            name: 'assy_code',
                            value: gm.me().selectedAssyCode
                        }),
                        new Ext.form.Hidden({
                            id: 'vCompanyReserved4',
                            name: 'vCompanyReserved4',
                            value: vCompanyReserved4
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('coord_key2'),
                            name: 'coord_key2'
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('standard_flag'),
                            name: 'standard_flag',
                            value: 'R'
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('child'),
                            name: 'child'
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('sg_code'),
                            name: 'sg_code',
                            value: 'NSD'
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('hier_pos'),
                            name: 'hier_pos'
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('assy_name'),
                            name: 'assy_name',
                            value: this.selectedAssyName
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('rtgast_uid'),
                            name: 'rtgast_uid',
                            value: gm.me().grid.getSelectionModel().getSelection()[0].get('unique_id_long')
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('pj_name_2'),
                            name: 'pj_name',
                            value: this.selectedPjName
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('isUpdateSpec'),
                            name: 'isUpdateSpec',
                            value: 'false'
                        }),
                        {
                            fieldLabel: gm.me().getColName('unique_id'),
                            xtype: 'textfield',
                            id: gu.id('unique_id'),
                            name: 'unique_id',
                            emptyText: '자재 UID',
                            readOnly: true,
                            width: 300,
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        },
                        {
                            xtype: 'triggerfield',
                            fieldLabel: gm.me().getColName('item_code'),
                            id: gu.id('item_code'),
                            name: 'item_code',
                            emptyText: '자동 생성',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                    }
                                }
                            },
                            trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger',
                            'onTrigger1Click': function () {
                                if (vCompanyReserved4 == 'APM01KR') {
                                    var item_code = gm.me().selectedPjCode + gm.me().selectedAssyCode + gu.id('pl_no');
                                }

                                var val = gu.getCmp('item_code').getValue();
                                if (val != null && val != '') {


                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/design/bom.do?method=getMaterialByItemcode',
                                        params: {
                                            item_code: val
                                        },
                                        success: function (result, request) {
                                            var jsonData = Ext.decode(result.responseText);
                                            var records = jsonData.datas;
                                            if (records != null && records.length > 0) {
                                                //modRegAction.enable();
                                                //resetPartForm();
                                                gm.me().setPartFormObj(records[0]);
                                            } else {
                                                Ext.MessageBox.alert('알림', '알 수없는 자재번호입니다.');
                                            }

                                        },
                                        failure: extjsUtil.failureMessage
                                    });

                                } //endofif

                            }
                            //readOnly: true,
                            //fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        },
                        {

                            id: gu.id('standard_flag_disp'),
                            name: 'standard_flag_disp',
                            xtype: 'combo',
                            mode: 'local',
                            editable: true,
                            allowBlank: true,
                            queryMode: 'remote',
                            hidden: (vCompanyReserved4 == 'SKNH01KR'),
                            displayField: 'codeName',
                            value: '',
                            triggerAction: 'all',
                            fieldLabel: gm.me().getColName('sp_code'), // + '*',
                            store: gm.me().commonStandardStore2,
                            listConfig: {
                                getInnerTpl: function () {
                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                    console_log('Selected Value : ' + combo.getValue());
                                    var systemCode = record.get('systemCode');
                                    var codeNameEn = record.get('codeNameEn');
                                    var codeName = record.get('codeName');
                                    console_log('systemCode : ' + systemCode +
                                        ', codeNameEn=' + codeNameEn +
                                        ', codeName=' + codeName);
                                    gu.getCmp('standard_flag').setValue(systemCode);

                                    gm.me().getPl_no(systemCode);

                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            name: 'item_name',
                            id: gu.id('item_name'),
                            fieldLabel: gm.me().getColName('item_name'),
                            readOnly: false,
                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: gm.me().getColName('specification') + '*',
                            id: gu.id('specification'),
                            name: 'specification',
                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: gm.me().getColName('maker_name'),
                            id: gu.id('maker_name'),
                            name: 'maker_name',
                            allowBlank: true
                        }
                        , {
                            id: gu.id('model_no'),
                            name: 'model_no',
                            xtype: 'combo',
                            mode: 'local',
                            editable: true,
                            allowBlank: true,
                            queryMode: 'remote',
                            displayField: 'codeName',
                            valueField: 'codeName',
                            minChars: 1,
                            triggerAction: 'all',
                            fieldLabel: gm.me().getColName('model_no'),
                            store: gm.me().commonModelStore,
                            listConfig: {
                                getInnerTpl: function () {
                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                }
                            },
                            listeners: {
                                load: function (store, records, successful, operation, options) {
                                    if (this.hasNull) {
                                        var blank = {
                                            systemCode: '',
                                            codeNameEn: '',
                                            codeName: ''
                                        };
                                        this.add(blank);
                                    }
                                },
                                select: function (combo, record) {
                                    console_log('Selected Value : ' + combo.getValue());
                                    var systemCode = record.get('systemCode');
                                    var codeNameEn = record.get('codeNameEn');
                                    var codeName = record.get('codeName');
                                    console_log('systemCode : ' + systemCode +
                                        ', codeNameEn=' + codeNameEn +
                                        ', codeName=' + codeName);
                                }
                            }
                        },
                        {
                            xtype: 'checkboxfield',
                            align: 'right',
                            fieldLabel: '화면유지',
                            id: 'win_check',
                            checked: gm.me().win_check == true ? true : false,
                            inputValue: '-1',
                            listeners: {
                                change: function (checkbox, checked) {

                                    if (checked) {
                                        gm.me().win_check = true;
                                    } else {
                                        gm.me().win_check = false;
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'fieldset',
                            title: '분류코드', //panelSRO1139,
                            collapsible: false,
                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                            defaults: {
                                labelWidth: 40,
                                anchor: '100%',
                                layout: {
                                    type: 'hbox',
                                    defaultMargins: {
                                        top: 0,
                                        right: 3,
                                        bottom: 0,
                                        left: 0
                                    }
                                }
                            },
                            items: [

                                {
                                    xtype: 'fieldcontainer',
                                    combineErrors: true,
                                    msgTarget: 'side',
                                    defaults: {
                                        hideLabel: true
                                    },
                                    items: [{
                                        xtype: 'combo',
                                        width: 200,
                                        emptyText: '대분류',
                                        id: 'class_code_level_1',
                                        name: 'class_code_level_1',
                                        store: gm.me().claastStore,
                                        mode: 'local',
                                        queryMode: 'remote',
                                        triggerAction: 'all',
                                        allowBlank: true,
                                        hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                        displayField: 'class_name',
                                        valueField: 'class_code',
                                        listConfig: {
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{class_code}">{class_name}</div>';
                                            }
                                        },
                                        listeners: {
                                            select: function (a, b) {

                                                // gm.me().claastStore.getProxy().setExtraParam('level1', 1);
                                                // gm.me().claastStore.getProxy().setExtraParam('parent_class_code', null);

                                            },
                                            beforequery: function () {
                                                Ext.getCmp('class_code_level_1').clearValue();
                                                gm.me().claastStore.getProxy().setExtraParam('level1', 1);
                                                gm.me().claastStore.getProxy().setExtraParam('parent_class_code', null);
                                                gm.me().claastStore.load();
                                            }
                                        }
                                    },
                                        {
                                            xtype: 'combo',
                                            width: 200,
                                            emptyText: '중분류',
                                            id: 'class_code_level_2',
                                            name: 'class_code_level_2',
                                            store: gm.me().claastStore,
                                            mode: 'local',
                                            queryMode: 'remote',
                                            triggerAction: 'all',
                                            allowBlank: true,
                                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                            displayField: 'class_name',
                                            valueField: 'class_code',
                                            listConfig: {
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{class_code}">{class_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                beforequery: function (a, b) {
                                                    Ext.getCmp('class_code_level_2').clearValue();
                                                    var parent_class_code_1 = Ext.getCmp('class_code_level_1').getValue();
                                                    gm.me().claastStore.getProxy().setExtraParam('level1', 2);
                                                    gm.me().claastStore.getProxy().setExtraParam('parent_class_code', parent_class_code_1);

                                                    gm.me().claastStore.load();
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'combo',
                                            flex: 1,
                                            emptyText: '소분류',
                                            id: 'class_code',
                                            name: 'class_code',
                                            store: gm.me().claastStore,
                                            mode: 'local',
                                            queryMode: 'remote',
                                            triggerAction: 'all',
                                            allowBlank: true,
                                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                            displayField: 'class_name',
                                            valueField: 'class_code',
                                            listConfig: {
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{class_code}">{class_name}</div>';
                                                }
                                            },
                                            listeners: {
                                                beforequery: function (a, b) {
                                                    Ext.getCmp('class_code').clearValue();
                                                    var parent_class_code_2 = Ext.getCmp('class_code_level_2').getValue();
                                                    gm.me().claastStore.getProxy().setExtraParam('level1', 3);
                                                    gm.me().claastStore.getProxy().setExtraParam('parent_class_code', parent_class_code_2);

                                                    gm.me().claastStore.load();
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            xtype: 'fieldset',
                            border: true,
                            // style: 'border-width: 0px',
                            title: panelSRO1186 + ' | ' + panelSRO1187 + ' | ' + panelSRO1188 + ' | 통화', //panelSRO1174,
                            collapsible: false,
                            defaults: {
                                labelWidth: 100,
                                anchor: '100%',
                                layout: {
                                    type: 'hbox',
                                    defaultMargins: {
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 0
                                    }
                                }
                            },
                            items: [

                                {
                                    xtype: 'fieldcontainer',
                                    combineErrors: true,
                                    msgTarget: 'side',
                                    defaults: {
                                        hideLabel: true
                                    },
                                    items: [{
                                        xtype: 'numberfield',
                                        minValue: 0,
                                        width: 100,
                                        id: gu.id('bm_quan'),
                                        name: 'bm_quan',
                                        fieldLabel: gm.me().getColName('bm_quan'),
                                        allowBlank: true,
                                        value: '1',
                                        margins: '0'
                                    }, {
                                        width: 100,
                                        id: gu.id('unit_code'),
                                        name: 'unit_code',
                                        xtype: 'combo',
                                        mode: 'local',
                                        editable: true,
                                        allowBlank: true,
                                        queryMode: 'remote',
                                        displayField: 'codeName',
                                        valueField: 'codeName',
                                        value: 'EA',
                                        triggerAction: 'all',
                                        fieldLabel: gm.me().getColName('unit_code'),
                                        store: gm.me().commonUnitStore,
                                        listConfig: {
                                            getInnerTpl: function () {
                                                return '<div data-qtip="{systemCode}">{codeName}</div>';
                                            }
                                        },
                                        listeners: {
                                            select: function (combo, record) {
                                                console_log('Selected Value : ' + combo.getValue());
                                                var systemCode = record.get('systemCode');
                                                var codeNameEn = record.get('codeNameEn');
                                                var codeName = record.get('codeName');
                                                console_log('systemCode : ' + systemCode +
                                                    ', codeNameEn=' + codeNameEn +
                                                    ', codeName=' + codeName);
                                            }
                                        }
                                    },
                                        {
                                            xtype: 'numberfield',
                                            // minValue: 0,
                                            flex: 1,
                                            id: gu.id('sales_price'),
                                            name: 'sales_price',
                                            fieldLabel: gm.me().getColName('sales_price'),
                                            allowBlank: true,
                                            value: '0',
                                            margins: '0'
                                        }, {
                                            width: 100,
                                            id: gu.id('currency'),
                                            name: 'currency',
                                            xtype: 'combo',
                                            mode: 'local',
                                            editable: true,
                                            allowBlank: true,
                                            queryMode: 'remote',
                                            displayField: 'codeName',
                                            valueField: 'codeName',
                                            value: 'KRW',
                                            triggerAction: 'all',
                                            fieldLabel: gm.me().getColName('currency'),
                                            store: gm.me().commonCurrencyStore,
                                            listConfig: {
                                                getInnerTpl: function () {
                                                    return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                }
                                            },
                                            listeners: {
                                                select: function (combo, record) {
                                                    console_log('Selected Value : ' + combo.getValue());
                                                    var systemCode = record.get('systemCode');
                                                    var codeNameEn = record.get('codeNameEn');
                                                    var codeName = record.get('codeName');
                                                    console_log('systemCode : ' + systemCode +
                                                        ', codeNameEn=' + codeNameEn +
                                                        ', codeName=' + codeName);
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }, {
                            xtype: 'button',
                            text: '초기화',
                            scale: 'small',
                            width: 50,
                            maxWidth: 80,
                            style: {
                                marginTop: '7px',
                                marginLeft: '550px'
                            },
                            // size:50,
                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                            listeners: {
                                click: function () {
                                    gm.me().resetPartForm();
                                }
                            }

                        }, {
                            xtype: 'container',
                            type: 'hbox',
                            padding: '5',
                            pack: 'end',
                            align: 'left',
                            defaults: {},
                            margin: '0 0 0 0',
                            border: false

                        }
                    ]
                });

                var partGridWidth = '25%';
                if (vCompanyReserved4 == 'KWLM01KR') {
                    partGridWidth = '20%';
                }

                var searchPartGrid = Ext.create('Ext.grid.Panel', {
                    title: '자재 검색',
                    store: gm.me().searchDetailStore,

                    layout: 'fit',
                    columns: [
                        {text: "품목코드", width: 80, dataIndex: 'item_code', sortable: true},
                        {text: "품명", flex: 1, dataIndex: 'item_name', sortable: true},
                        {text: "규격", width: 125, dataIndex: 'specification', sortable: true},
                        {text: "재질", width: 80, dataIndex: 'model_no', sortable: true},
                        {
                            text: "단가", width: 80, dataIndex: 'sales_price', sortable: true,
                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true
                        },
                        {
                            text: "중량", width: 80, dataIndex: 'unit_mass', sortable: true,
                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true
                        },
                        {
                            text: "최근 공급사", width: 120, dataIndex: 'supplier_name', sortable: true,
                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true
                        }
                    ],
                    border: false,
                    multiSelect: false,
                    frame: false,
                    dockedItems: [{
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default1',
                        items: [
                            {
                                width: partGridWidth,
                                field_id: 'search_item_code',
                                id: gu.id('search_item_code'),
                                name: 'search_item_code',
                                xtype: 'triggerfield',
                                emptyText: '품목코드',
                                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                onTrigger1Click: function () {
                                    this.setValue('');
                                    gm.me().redrawSearchStore();
                                },
                                listeners: {
                                    change: function (fieldObj, e) {
                                        //if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().redrawSearchStore();
                                        //srchSingleHandler (store, srchId, fieldObj, isWild);
                                        //}
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
                                width: partGridWidth,
                                field_id: 'search_item_name',
                                id: gu.id('search_item_name'),
                                name: 'search_item_name',
                                xtype: 'triggerfield',
                                emptyText: '품명',
                                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                onTrigger1Click: function () {
                                    this.setValue('');
                                    gm.me().redrawSearchStore();
                                },
                                listeners: {
                                    change: function (fieldObj, e) {
                                        //if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().redrawSearchStore();
                                        //srchSingleHandler (store, srchId, fieldObj, isWild);
                                        //}
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
                                width: partGridWidth,
                                field_id: 'search_specification',
                                id: gu.id('search_specification'),
                                name: 'search_specification',
                                xtype: 'triggerfield',
                                emptyText: '규격',
                                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                onTrigger1Click: function () {
                                    this.setValue('');
                                    gm.me().redrawSearchStore();
                                },
                                listeners: {
                                    change: function (fieldObj, e) {
                                        //if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().redrawSearchStore();
                                        //srchSingleHandler (store, srchId, fieldObj, isWild);
                                        //}
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
                                width: partGridWidth,
                                field_id: 'search_model_no',
                                id: gu.id('search_model_no'),
                                name: 'search_model_no',
                                xtype: 'triggerfield',
                                emptyText: '재질',
                                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                onTrigger1Click: function () {
                                    this.setValue('');
                                    gm.me().redrawSearchStore();
                                },
                                listeners: {
                                    change: function (fieldObj, e) {
                                        //if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().redrawSearchStore();
                                        //srchSingleHandler (store, srchId, fieldObj, isWild);
                                        //}
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
                                width: partGridWidth,
                                field_id: 'search_supplier_name',
                                id: gu.id('search_supplier_name'),
                                name: 'search_supplier_name',
                                xtype: 'triggerfield',
                                emptyText: '공급사',
                                hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                onTrigger1Click: function () {
                                    this.setValue('');
                                    gm.me().redrawSearchStore();
                                },
                                listeners: {
                                    change: function (fieldObj, e) {
                                        //if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().redrawSearchStore();
                                        //srchSingleHandler (store, srchId, fieldObj, isWild);
                                        //}
                                    },
                                    render: function (c) {
                                        Ext.create('Ext.tip.ToolTip', {
                                            target: c.getEl(),
                                            html: c.emptyText
                                        });
                                    }
                                }
                            }
                        ]
                    }] // endofdockeditems
                }); // endof Ext.create('Ext.grid.Panel',

                searchPartGrid.getSelectionModel().on({
                    selectionchange: function (sm, selections) {
                        console_logs('selections', selections);
                        if (selections != null && selections.length > 0 && selections[0] != null) {
                            gm.me().setBomData(selections[0].getId());
                        }

                    }
                });

                var winPart = Ext.create('ModalWindow', {
                    title: 'Part 추가',
                    width: bWidth,
                    height: bHeight,
                    minWidth: 250,
                    minHeight: 180,
                    items:
                        [{
                            region: 'center',
                            xtype: 'tabpanel',
                            items: [gm.me().createPartForm, searchPartGrid]
                        }],
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            var form = gm.me().createPartForm;
                            console_logs('>>11', form);
                            console_logs('>>112', form.isValid());
                            if (form.isValid()) {
                                console_logs('>>22', '22');
                                var val = form.getValues(false);
                                console_logs('>>33', '33');
                                console_logs('form val', val);

                                gm.me().registPartFc(val);

                                if (gm.me().win_check) {
                                    // gm.me().resetPartForm();
                                } else {
                                    if (winPart) {
                                        winPart.close();
                                    }
                                }

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
            }
        },
        failure: extjsUtil.failureMessage
    }),

    removePartAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: '품목삭제',
        disabled: true,
        handler: function (widget, event) {
            var selections = gm.me().gridCartList.getSelectionModel().getSelection();
            
            var cartmapArr = [];
            var assymapArr = [];

            for(var i = 0; i < selections.length; i++) {
                cartmapArr.push(selections[i].get('id'));
                assymapArr.push(selections[i].get('coord_key3'));
            }

            var selection = gm.me().grid.getSelectionModel().getSelection()[0];
            var project_varchar6 = selection.get('project_varchar6');

            if(project_varchar6 == null || project_varchar6.length < 2) {
                Ext.Msg.alert('', '품목 삭제는 LOT 구매인 경우에만 가능합니다.');
            } else {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '품목을 삭제 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/material.do?method=removeMaterialAtPo',
                                params: {
                                    cartmap_uids: cartmapArr,
                                    assymap_uids: assymapArr
                                },
                                success: function (result, request) {
                                    var result = result.responseText;
                                    gm.me().cartListStore.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                });
            }

            

        }
    }),

    searchStore: Ext.create('Mplm.store.MaterialSearchStore', {}),

    setBomData: function (id) {

        gm.me().createPartForm.setLoading(true);


        console_logs('setBomData id=', id);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=read',
            params: {
                id: id

            },
            success: function (result, request) {

                var jsonData = Ext.decode(result.responseText);
                // console_logs('jsonData', jsonData);
                var records = jsonData.datas;
                // console_logs('records', records);
                // console_logs('records[0]', records[0]);
                console_logs('===>>>>>aaa', records[0]);
                gm.me().setPartFormObj(records[0]);

                gm.me().createPartForm.setLoading(false);
            },
            failure: extjsUtil.failureMessage
        });

    },

    setPartFormObj: function (o) {
        console_logs('setPartFormObj o', o);

        var standard_flag = 'R';

        gu.getCmp('unique_id').setValue(o['unique_id_long']);
        gu.getCmp('item_code').setValue(o['item_code']);
        gu.getCmp('item_name').setValue(o['item_name']);
        gu.getCmp('specification').setValue(o['specification']);

        gu.getCmp('standard_flag').setValue(standard_flag);
        gu.getCmp('standard_flag_disp').select(gm.me().getPosStandard(standard_flag));
        gu.getCmp('model_no').setValue(o['model_no']);
        //gu.getCmp('description').setValue(o['description']);

        //gu.getCmp('comment').setValue(o['comment']);
        gu.getCmp('maker_name').setValue(o['maker_name']);
        gu.getCmp('bm_quan').setValue('1');
        gu.getCmp('unit_code').setValue(o['unit_code']);
        gu.getCmp('sales_price').setValue(o['sales_price']);

        if (vCompanyReserved4 == 'KWLM01KR') {
            var notify_flag = null;
            if (o['notify_flag'] == 'N' || o['notify_flag'].length < 1) {
                notify_flag = '외주구매';
            } else {
                notify_flag = '사내구매';
            }
            gu.getCmp('notify_flag').setValue(o['notify_flag']);
            gu.getCmp('unit_mass').setValue(o['unit_mass']);
            Ext.getCmp('class_code').setValue(o['class_name']);
        }


        gm.me().getPl_no(standard_flag);

        var currency = o['currency'];
        if (currency == null || currency == '') {
            currency = 'KRW';
        }
        gu.getCmp('currency').setValue(currency);
        this.readOnlyPartForm(true);

    },

    getPosStandard: function (id) {

        for (var i = 0; i < this.standard_flag_datas.length; i++) {
            if (this.standard_flag_datas[i].get('systemCode') == id) {
                return this.standard_flag_datas[i];
            }
        }
        return null;
    },
    standard_flag_datas: [],

    getPl_no: function (systemCode) {
        var prefix = systemCode;
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
            params: {
                first: prefix,
                parent: this.selectedChild,
                parent_uid: this.selectedAssyUid
            },
            success: function (result, request) {
                var result = result.responseText;
                var str = result; // var str = '293';

                if (systemCode == 'O') {
                    str = str.substring(0, str.length - 1) + '0'; //'O'를 0 으로 교체.
                }

                //gu.getCmp( 'pl_no').setValue(str);


            },
            failure: extjsUtil.failureMessage
        });
    },

    readOnlyPartForm: function (b) {

        this.setReadOnlyName('item_code', b);
        this.setReadOnlyName('item_name', b);
        this.setReadOnlyName('specification', b);
        this.setReadOnlyName('standard_flag', b);
        this.setReadOnlyName('standard_flag_disp', b);

        this.setReadOnlyName('model_no', b);
        this.setReadOnlyName('description', b);
        // this.setReadOnlyName('pl_no', b);
        this.setReadOnlyName('comment', b);
        this.setReadOnlyName('maker_name', b);

        this.setReadOnlyName('currency', b);
        this.setReadOnlyName('unit_code', b);

        this.setReadOnlyName('unit_mass', b);

        this.setReadOnlyName('notify_flag', b);

        if (vCompanyReserved4 == 'KWLM01KR') {
            this.setReadOnly(Ext.getCmp('class_code'), b);
        }
        // this.setReadOnlyName('notify_flag', b);

        gu.getCmp('information').setValue('');

    },

    setReadOnlyName: function (name, readonly) {
        this.setReadOnly(gu.getCmp(name), readonly);
    },

    setReadOnly: function (o, readonly) {
        if (o != undefined && o != null) {
            o.setReadOnly(readonly);
            if (readonly) {
                o.setFieldStyle('background-color: #E7EEF6; background-image: none;');
            } else {
                o.setFieldStyle('background-color: #FFFFFF; background-image: none;');
            }
        }


    },

    registPartFc: function (val) {
        console_logs('registPartFc val', val);
        gm.me().addNewAction(val);
    },

    addNewAction: function (val) {

        var partLine = Ext.create('Rfx.model.PartLine');
        for (var attrname in val) {
            //partLine[attrname] = val[attrname];
            partLine.set(attrname, val[attrname]);
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=addMaterialAtPo',
            params: val,
            success: function (result, request) {
                gm.me().gridCartList.getStore().load();
            },
            failure: function (batch, opt) {
                Ext.Msg.alert('결과', '저장 실패.');
            }
        });

    },

    treatPoAll: function(pos, keys, sel) {

        gm.me().setLoading(true);

        //OR17060001
        var fullYear = gUtil.getFullYear() + '';
        var month = gUtil.getMonth() + '';
        var codeLength = 4;

        if (month.length == 1) {
            month = '0' + month;
        }

        var first = "OR" + fullYear.substring(2, 4) + month;

        console_logs('first', first);

        var poNoList = [];

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastPono',
            params: {
                first: first,
                codeLength: codeLength
            },
            success: function (result, request) {
                var po_no = result.responseText;
                var con_uid = keys[pos];
                var selections = [];
                for(var i = 0; i < sel.length; i++) {
                    if(sel[i].get('contract_uid') == con_uid) {
                        selections.push(sel[i]);
                    }
                }

                var uniqueId = selections[0].get('id');
                var next = gUtil.getNextday(0);
                var request_date = gm.me().request_date;

                if (uniqueId == undefined || uniqueId < 0) {
                    Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
                    return;
                } else {

                    var form = null;
                    var pjArr = [];
                    var supArr = [];
                    var cartmapUids = [];
                    var notDefinedSup = false;

                    var price_is_zero = 0;
                    var qty_is_zero = 0;

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        console_logs('rec', rec);
                        var contract_uid = rec.get('contract_uid');

                        pjArr.push(rec.get('pj_code'));
                        supArr.push(contract_uid);
                        cartmapUids.push(rec.get('id'));

                        var quan = rec.get('quan');
                        var static_sales_price = rec.get('static_sales_price');
                        if (quan < 0.0000001) {
                            qty_is_zero++;
                        }
                        if (static_sales_price < 0.0000001) {
                            price_is_zero++;
                        }

                    }

                    var reserved_number2 = selections[0].get('reserved_number2');

                    //중복제거
                    pjArr = gu.removeDupArray(pjArr);
                    supArr = gu.removeDupArray(supArr);
                    console_logs('pjArr', pjArr);
                    console_logs('supArr', supArr);
                    console_logs('cartmapUids', cartmapUids);

                    if (qty_is_zero > 0) {
                        Ext.Msg.alert('알림', '주문수량이 0인 항목이 ' + qty_is_zero + '건 있습니다.', function () {
                        });
                        return;
                    }

                    var next = gUtil.getNextday(0);

                    var total = 0;
                    for (var i = 0; i < selections.length; i++) {
                        var total_price = 0;
                        var rec = selections[i];
                        total_price = rec.get('total_price');
                        total = total + total_price
                    }

                    var this_date = Ext.Date.add(new Date(), Ext.Date.DAY, 14);

                    this_date = Ext.Date.format(this_date, 'Y-m-d');

                    var reserved_varcharb = selections[0].get('rtgast_varcharb');

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/purchase/request.do?method=createContractByCopy',
                        params: {
                            pj_name: selections[0].get('pj_name'),
                            total_price: Ext.util.Format.number(total, '0,00/i'),
                            item_abst: selections[0].get('item_name') + '외 ' + Ext.util.Format.number(selections.length - 1, '0,00/i') + '건',
                            coord_key1: selections[0].get('contract_uid'),
                            po_no: po_no,
                            reserved_varchar1: '사내',
                            unique_uids: cartmapUids,
                            coord_key3: selections[0].get('coord_key3'),
                            ac_uid: selections[0].get('ac_uid'),
                            req_date: selections[0].get('req_date') == null ? this_date : selections[0].get('req_date'),
                            sales_price: total,
                            reserved_number2: reserved_number2

                        },
                        success: function (val, action) {
                            if(keys.length - 1 > pos) {
                                gm.me().treatPoAll(++pos, keys, sel);
                            } else {
                                gm.me().setLoading(false);
                                gm.me().poCartListStore.load();
                            }
                        },
                        failure: function (val, action) {
                            if(keys.length - 1 > pos) {
                                gm.me().treatPoAll(++pos, keys, sel);
                            } else {
                                gm.me().setLoading(false);
                                gm.me().poCartListStore.load();
                            }
                        }
                    });
                }

            }, // endofsuccess
            failure: extjsUtil.failureMessage
        }); // endofajax
    },

    cloudAsStore : Ext.create('Rfx2.store.company.dsmf.cloudSubAssemblyTreeStoreDSMF', {}),

    getStatus: function(value, meta) {
        if(value == null || value.length < 1) {
            return null;
        };
        switch(value) {
            case 'BM':
              return '수주등록';
            case 'CR':
              return '수주확정';
            case 'BR':
              return 'BOM확정';
            case 'N':
            //   meta.css = 'custom-column-working-wait';
              return '생산대기';
            case 'W':
              meta.css = 'custom-column-working';
              return '생산중';
            case 'S':
              return '작업중지';
            case 'I':
                return '작업정지';
            case 'P':
                return '수립완료';
            case 'Y':
                meta.css = 'custom-column-working-complete';
                return '생산완료';
            default:
                return value;
        }
    },
});