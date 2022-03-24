Ext.define('Rfx2.view.company.sejun.designPlan.DesignBomPDView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'design-bom-pd-view',

    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : [
                'VIEW', 'EXCEL', /*'SEARCH',*/ 'REGIST', 'COPY', 'EDIT', 'REMOVE'
            ],
            RENAME_BUTTONS : [
            ]
        });

        //모델 정의
        this.createStore('Rfx2.model.company.bioprotech.DesignBomPD', [{
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

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        /*
        아래부터 상세 그리드
         */

        this.poPrdDetailStore = Ext.create('Rfx2.store.company.bioprotech.PoPrdDetailByProjectStore', {});
        this.pdBomStore = Ext.create('Rfx2.store.company.bioprotech.PdBomStore', {});
        
        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractCompany'),
            store: this.poPrdDetailStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,
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
            ],
            columns: [
                { text: 'No', width: 50, style: 'text-align:center', dataIndex: 'pl_no', sortable: false },
                { text:  this.getMC('msg_order_grid_prd_fam', gm.getMC('CMD_Product', '제품군')), width: 100, style: 'text-align:center', dataIndex: 'class_code', sortable: false },
                { text:  this.getMC('msg_order_grid_prd_name', '제품명'), width: 100, style: 'text-align:center', dataIndex: 'item_name', sortable: false },
                { text:  this.getMC('msg_order_grid_prd_desc', '기준모델'), width: 100, style: 'text-align:center', dataIndex: 'description', sortable: false },
                { text: 'Site', width: 90, style: 'text-align:center', dataIndex: 'reserved5', sortable: false },
                {
                    text:  this.getMC('msg_order_grid_quan_desc', '수량'), width: 95, style: 'text-align:center', dataIndex: 'bm_quan', sortable: false, align: 'right',
                    editor: 'numberfield',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'bm_quan') {
                            context.record.set('bm_quan', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                { text: 'UNIT', width: 70, style: 'text-align:center', dataIndex: 'unit_code', sortable: false },
                { text: this.getMC('msg_order_grid_prd_unitprice', '단가'), width: 80, style: 'text-align:center', decimalPrecision : 5, dataIndex: 'sales_price', sortable: false, align: 'right' },
                { text: this.getMC('msg_order_grid_prd_currency', '통화'), width: 80, style: 'text-align:center', dataIndex: 'reserved4', sortable: false },
                {
                    text: this.getMC('msg_order_grid_prd_delivery_date', '납기일'), xtype: 'datecolumn', width: 90, style: 'text-align:center', dataIndex: 'reserved_timestamp1_str', sortable: false,
                    format: 'Y-m-d', editor: { xtype: 'datefield', format: 'Y-m-d' },
                },
                {
                    text: 'Incoterms',
                    width: 90,
                    style: 'text-align:center',
                    dataIndex: 'reserved2',
                    sortable: false,
                    editor: {
                        xtype: 'combobox',
                        displayField: 'codeName',
                        editable: false,
                        forceSelection: true,
                        // mode: 'local',
                        store: this.incotermsStore,
                        triggerAction: 'all',
                        valueField: 'system_code'
                    }
                },
                {
                    text: this.getMC('msg_order_grid_prd_pay_terms', '결제방법'),
                    width: 150,
                    style: 'text-align:center',
                    dataIndex: 'payment_condition',
                    sortable: false,
                    editor: {
                        xtype: 'combobox',
                        displayField: 'codeName',
                        editable: false,
                        forceSelection: true,
                        // mode: 'local',
                        store: this.payTermsStore,
                        triggerAction: 'all',
                        valueField: 'system_code'
                    }
                },
                { text: 'Comment', width: 150, style: 'text-align:center', dataIndex: 'reserved1', editor: { xtype: 'textfield' }, sortable: false },
            ],
            title: gm.getMC('CMD_Registered_product_information', '상세 리스트'),
            autoScroll: true,
            listeners: {

            }
        });

        this.requestPurAction = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '구매요청',
            tooltip: '구매요청',
            iconCls: 'af-dollar',
            disabled: true,
            handler: function () {

                Ext.MessageBox.show({
                    title: '확인',
                    msg: '해당 자재를 구매요청 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {

                            var selections = gm.me().bomListGrid.getSelectionModel().getSelection();
                            var parentSelection = gm.me().gridContractCompany.getSelectionModel().getSelection()[0];

                            var assymapUids = [];
                            var srcahdUids = [];
                            var prQuans = [];

                            var item_name = '';

                            var acUid = parentSelection.get('ac_uid');
                            var req_date = Ext.Date.format(new Date(), 'Y-m-d');

                            for (var i = 0; i < selections.length; i++) {
                                var rec = selections[i];

                                assymapUids.push(rec.get('unique_uid'));
                                srcahdUids.push(rec.get('unique_id_long'));
                                prQuans.push(rec.get('bm_quan') * parentSelection.get('bm_quan'));

                                if (i == 0) {
                                    item_name = rec.get('item_name');
                                }
                            }

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequest',
                                params: {
                                    type: 'BOM',
                                    unique_uids: assymapUids,
                                    child: srcahdUids,
                                    pr_quan: prQuans,
                                    pj_uid: acUid,
                                    item_name: item_name,
                                    route_type: 'P'
                                },
                                success: function (result, request) {
                                    gMain.selPanel.store.load();
                                    Ext.Msg.alert('안내', '요청접수 되었습니다.', function () {
                                    });
                                },//endofsuccess
                                failure: extjsUtil.failureMessage
                            });//endofajax
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.bomListGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('bomListGrid'),
            store: this.pdBomStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,
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
                        this.requestPurAction
                    ]
                }
            ],
            columns: [
                { text: 'LEVEL', width: 50, style: 'text-align:center', dataIndex: 'reserved_integer1', sortable: false },
                { text: '순번', width: 50, style: 'text-align:center', dataIndex: 'reserved_integer3', sortable: false },
                { text: '품목유형', width: 80, style: 'text-align:center', dataIndex: 'standard_flag', sortable: false,
                    renderer: function (value, meta) {
                        if (value == null || value.length < 1) {
                            return '불명';
                        }

                        switch (value) {
                            case 'A':
                                return '반제품';
                            default:
                                return '자재';
                        }
                    }
                },
                { text: '세부유형', width: 80, style: 'text-align:center', dataIndex: 'sg_code', sortable: false },
                { text: '품번', width: 100, style: 'text-align:center', dataIndex: 'item_code', sortable: false },
                { text: '품명', width: 150, style: 'text-align:center', dataIndex: 'item_name', sortable: false },
                { text: '규격', width: 150, style: 'text-align:center', dataIndex: 'specification', sortable: false },
                { text: '단위', width: 50, style: 'text-align:center', dataIndex: 'unit_code', sortable: false },
                { text: '필요수량', width: 100, style: 'text-align:center', dataIndex: 're_quan', sortable: false,
                    renderer: function (value, meta, record) {
                        var rec = gm.me().gridContractCompany.getSelectionModel().getSelection()[0];
                        var pQuan = rec.get('bm_quan');

                        return record.get('bm_quan') * pQuan;
                    }
                },
                { text: '소요량', width: 100, style: 'text-align:center', dataIndex: 'bm_quan', sortable: false },
                { text: '단가', width: 100, style: 'text-align:center', dataIndex: 'sales_price', sortable: false },
                { text: '금액', width: 150, style: 'text-align:center', dataIndex: 'total_sales_price', sortable: false }
            ],
            title: 'BOM 정보',
            autoScroll: true,
            listeners: {
            }
        });

        this.bomListGrid.getSelectionModel().on({
           selectionchange: function(sm, selections) {
               if (selections.length > 0) {
                   gm.me().requestPurAction.enable();
               } else {
                   gm.me().requestPurAction.disable();
               }
           }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '40%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'border',
                        pack: 'start',
                        align: 'stretch'
                    },
                    defaults: {
                        collapsible: false,
                        split: true
                    },
                    margin: '5 0 0 0',
                    width: '60%',
                    items: [{
                        region: 'north',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        height: '40%',
                        items: [this.gridContractCompany]
                    },{
                        region: 'center',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '60%',
                        items: [this.bomListGrid]
                    }]
                }
            ]
        });

        this.setGridOnCallback(function (selections) {

            if (selections.length) {
                var rec = selections[0];

                var pj_no = rec.get('reserved_varchar7');
                var company_name_nation_code = rec.get('company_name_nation_code');
                var specification = rec.get('specification');

                if (specification.length === 0) {
                    specification = '(규격 정보 없음)';
                }

                this.poPrdDetailStore.getProxy().setExtraParam('ac_uid', rec.get('ac_uid'));
                this.poPrdDetailStore.getProxy().setExtraParam('assytop_uid', rec.get('unique_uid'));
                this.poPrdDetailStore.getProxy().setExtraParam('combst_uid', rec.get('reserved_number3'));
                this.poPrdDetailStore.load();
            }
        });

        this.gridContractCompany.getSelectionModel().on({

            selectionchange: function(sm, selections) {

                if (selections.length > 0) {
                    var rec = selections[0];

                    var store = gm.me().pdBomStore;

                    store.getProxy().setExtraParam('parent', rec.get('child'));
                    store.getProxy().setExtraParam('parent_uid', rec.get('assymap_uid'));
                    store.getProxy().setExtraParam('orderBy', 'pl_no');
                    store.getProxy().setExtraParam('ascDesc', 'ASC');
                    store.getProxy().setExtraParam('ac_uid', rec.get('ac_uid'));

                    store.load();
                }
            }
        });

        this.store.load();

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
    }
});