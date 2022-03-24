Ext.define('Rfx2.view.gongbang.qualityMgmt.LotTrackingView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'lot-tracking-view',

    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        // 검색조건
        this.addSearchField('item_name');
        this.addSearchField('pcs_desc_group_assy');
        this.addSearchField('udi_code');
        this.addSearchField(
            {
                field_id: 'date_type'
                , store: "DatetypeStore"
                , displayField: 'validity'
                , valueField: 'validity'
                , emptyText: '유효기간'
                , innerTpl: '<div data-qtip="{validity}">{validity}</div>'
            });
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });


        //모델을 통한 스토어 생성
        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.bioprotech.LotTrackingStore',
            pageSize: 100,
            sorters: [{
                property: 'cartmap.unique_id',
                direction: 'DESC'
            }],
            byReplacer: {
                'state_name': 'rtgast.state',
            }
        }, {});

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        // 수주정보
        //this.orderInfoStore = Ext.create('Rfx2.model.company.bioprotech.OrderInfoStore', { pageSize: 100 });
        this.orderInfoGrid = Ext.create('Ext.grid.Panel', {
            //store: this.orderInfoStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {text: 'Site', width: 150, style: 'text-align:center', align: 'left', dataIndex: 'reserved5'},
                {
                    text: gm.getMC('CMD_Product', '제품군'),
                    width: 150,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'class_code'
                },
                {text: '수주번호', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'orderNo'},
                {text: '고객사명', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'wa_name'},
                {text: '최종고객사', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'final_wa_name'},
                {text: '품번', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'item_code'},
                {text: '품명', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'item_name'},
                {text: '기준모델', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'description'},
                {text: '규격', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'specification'},
                {text: '수주수량', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'assymap_bm_quan'},
                {text: '요청잔량', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'bm_quan'},
                {text: '총재고', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'stock_qty'},
                {text: '가용재고', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'stock_qty_useful'},
                {text: '납품일자', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'delivery_plan'},
                {text: '잔여납기일', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'remain_date'},
                {text: '수주특기사항', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'reserved1'}
            ],
            name: 'capa',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'capamap';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    switch (columnName) {
                        case 'static_sales_price':
                            columnName = 'sales_price';
                            break;
                        default:
                            break;
                    }

                    var cStore = gm.me().cpapListStore;
                    var rec = cStore.getAt(0);
                    var _quan = rec.get('quan') / rec.get('bm_quan');

                    var assymap_uid = e.record.get('coord_key3');

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                    gm.editAjax(tableName, 'pr_quan', value * _quan, 'unique_id', unique_id, {type: ''});
                    gm.editAjax('assymap', 'bm_quan', value, 'unique_id', assymap_uid, {type: ''});
                    gm.me().cpapListStore.getProxy().setExtraParam('update_qty', 'Y');
                    gm.me().cpapListStore.load();
                }
            }
        });

        // 출하정보
        this.deliveryInfoStore = Ext.create('Rfx2.model.company.bioprotech.DeliveryInfoStore', {pageSize: 100});
        this.deliveryInfoGrid = Ext.create('Ext.grid.Panel', {
            store: this.deliveryInfoStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {text: '출하요청번호', width: 150, style: 'text-align:center', align: 'left', dataIndex: 'request_no'},
                {text: '수주번호', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'order_number'},
                {text: '고객사', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'buyer_name'},
                {text: '최종고객사', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'final_wa_name'},
                {text: '품번', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'item_code'},
                {text: '품명', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'item_name'},
                {text: '단위', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'unit_code'},
                {text: '규격', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'specification'},
                {text: '기준모델', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'description'},
                {text: '단가', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'sales_price'},
                {text: '통화', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'assymap_reserved4'},
                {text: '요청일자', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'req_date'},
                {text: '납기일자', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'rtgastdl_timestamp1'},
                {text: '실제출하일자', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'real_req_date'},
                {
                    text: '출하특이사항',
                    width: 150,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'sledel_description'
                },
                {text: '출하수량', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'transit_type'},
                {text: '물류방법', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'pr_quan'}
            ],
            name: 'deliveryInfo',
            autoScroll: true
        });

        // 생산정보
        this.productInfoStore = Ext.create('Rfx2.model.company.bioprotech.ProductInfoStore', {pageSize: 100});
        this.productInfoGrid = Ext.create('Ext.grid.Panel', {
            store: this.productInfoStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {text: '생산일자', width: 150, style: 'text-align:center', align: 'left', dataIndex: 'start_date'},
                {text: '생산라인', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'name_ko'},
                {text: '작업조', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'work_type'},
                {text: '작업자명', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'mchn_code'},
                {text: '생산수(양품수)', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'work_qty'},
                {text: '불량수', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'defect_quan'},
                {text: '불량률', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'defect_ratio'}
            ],
            name: 'productInfo',
            autoScroll: true
        });

        this.propProduceStore = Ext.create('Rfx2.store.company.bioprotech.PropProduceStore'/*, { pageSize: 100 }*/);

        // 자재정보
        this.materialInfoGrid = Ext.create('Ext.grid.Panel', {
            store: this.propProduceStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {text: '투입일자', width: 100, style: 'text-align:center', align: 'left', dataIndex: 'work_date'},
                {text: '투입자재명', width: 220, align: 'left', style: 'text-align:center', dataIndex: 'item_name'},
                {text: '자재 LOT', width: 100, align: 'left', style: 'text-align:center', dataIndex: 'material_lot'},
                {
                    text: '투입수량',
                    width: 100,
                    align: 'left',
                    style: 'text-align:center',
                    align: 'right',
                    dataIndex: 'inserted_qty',
                    renderer: function (value) {
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {text: '자재입고일', width: 100, align: 'left', style: 'text-align:center', dataIndex: 'column05'},
                {text: '공급업체', width: 180, align: 'left', style: 'text-align:center', dataIndex: 'column06'},
                {text: '자재구매번호', width: 100, align: 'left', style: 'text-align:center', dataIndex: 'column07'}
            ],
            name: 'capa',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'capamap';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    switch (columnName) {
                        case 'static_sales_price':
                            columnName = 'sales_price';
                            break;
                        default:
                            break;
                    }

                    var cStore = gm.me().cpapListStore;
                    var rec = cStore.getAt(0);
                    var _quan = rec.get('quan') / rec.get('bm_quan');

                    var assymap_uid = e.record.get('coord_key3');

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                    gm.editAjax(tableName, 'pr_quan', value * _quan, 'unique_id', unique_id, {type: ''});
                    gm.editAjax('assymap', 'bm_quan', value, 'unique_id', assymap_uid, {type: ''});
                    gm.me().cpapListStore.getProxy().setExtraParam('update_qty', 'Y');
                    gm.me().cpapListStore.load();
                }
            }
        });

        // 설비정보
        //this.machineInfoStore = Ext.create('Rfx2.model.company.bioprotech.machineInfoStore', { pageSize: 100 });
        this.machineInfoGrid = Ext.create('Ext.grid.Panel', {
            //store: this.machineInfoStore,
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            columns: [
                {text: '작업조', width: 80, style: 'text-align:center', align: 'left', dataIndex: 'v178'},
                {text: '작업일자', width: 80, style: 'text-align:center', align: 'left', dataIndex: 'v179'},
                {text: 'Machine Speed', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'v000'},
                {text: 'pump Speed', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'v001'},
                {text: 'Shim size', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'v002'},
                {text: 'Smoother gap size', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'v003'},
                {text: 'UV Setting', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'v004'},
                {text: 'Unwind Tension', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'v005'},
                {text: 'Interleave Tension', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'v006'},
                {text: 'Rewind Tension', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'v007'},
                {text: 'Parabolic', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'v008'},
                {text: '피부점착면', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'v009'},
                {text: 'GEL Width(폭)', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'v010'},
                {text: 'Mesh 사용', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'v011'},
                {text: 'Setting Type', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'setting_type'}
            ],
            name: 'capa',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                    var columnName = e.field;
                    var tableName = 'capamap';
                    var unique_id = e.record.getId();
                    var value = e.value;

                    switch (columnName) {
                        case 'static_sales_price':
                            columnName = 'sales_price';
                            break;
                        default:
                            break;
                    }

                    var cStore = gm.me().cpapListStore;
                    var rec = cStore.getAt(0);
                    var _quan = rec.get('quan') / rec.get('bm_quan');

                    var assymap_uid = e.record.get('coord_key3');

                    gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
                    gm.editAjax(tableName, 'pr_quan', value * _quan, 'unique_id', unique_id, {type: ''});
                    gm.editAjax('assymap', 'bm_quan', value, 'unique_id', assymap_uid, {type: ''});
                    gm.me().cpapListStore.getProxy().setExtraParam('update_qty', 'Y');
                    gm.me().cpapListStore.load();
                }
            }
        });

        this.form = Ext.create('Ext.form.Panel', {
            title: '상세정보',
            cls: 'rfx-panel',
            autoHeight: true,
            frame: true,
            border: true,
            region: 'center',
            layout: 'fit',
            forceFit: false,
            margin: '5 0 0 0',
            items: {
                xtype: 'tabpanel',
                border: false,
                fullscreen: true,
                items: [
                    {
                        title: '수주정보',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.orderInfoGrid]
                    },
                    {
                        title: '출하정보',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.deliveryInfoGrid]
                    },
                    {
                        title: '생산정보',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.productInfoGrid]
                    },
                    {
                        title: '자재정보',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.materialInfoGrid]
                    },
                    {
                        title: '설비정보',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.machineInfoGrid]
                    }
                ]
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: true,
                    region: 'north',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    height: '50%',
                    items: [{
                        region: 'south',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        height: '100%',
                        flex: 0,
                        items: [this.grid]
                    }]
                }, this.form
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        //this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];

                console_log('rec =' + rec);
                console_log('rec =' + rec.get('pcs_desc_group_assy'));
                var pcs_desc_group_assy = rec.get('pcs_desc_group_assy');
                var tr_uid = rec.get('tr_uid');
                var target_uid = rec.get('unique_id_long');
                console_logs('target_uid>>>>>>>>>>>>>', target_uid);
                gm.me().materialInfoGrid.getStore().getProxy().setExtraParam('pcs_desc_group', pcs_desc_group_assy);
                gm.me().materialInfoGrid.getStore().load(function (record) {
                });

                gm.me().deliveryInfoGrid.getStore().getProxy().setExtraParam('pcs_desc_group', pcs_desc_group_assy);
                gm.me().deliveryInfoGrid.getStore().load(function (record) {
                });
                gm.me().productInfoGrid.getStore().getProxy().setExtraParam('pcs_desc_group', pcs_desc_group_assy);
                gm.me().productInfoGrid.getStore().load(function (record) {
                });
                gm.me().orderInfoGrid.getStore().getProxy().setExtraParam('tr_uid', tr_uid);
                gm.me().orderInfoGrid.getStore().load(function (record) {
                });
                // machineInfoGrid
                gm.me().machineInfoGrid.getStore().getProxy().setExtraParam('target_uid', target_uid);
                gm.me().machineInfoGrid.getStore().load(function (record) {
                });
            } else {
            }
        });
    }
});
