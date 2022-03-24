Ext.define('Rfx2.view.company.sejun.produceMgmt.ProduceMgmtAssyDetailView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'contract-material-view',


    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //this.addSearchField('unique_id');
        this.setDefComboValue('standard_flag', 'valueField', 'R');
        this.addSearchField({
            type: 'checkbox',
            field_id: 'isOnlyDelete',
            items: [
                {
                    boxLabel: '삭제이력만 보기',
                    checked: false
                },
            ],
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        // this.addSearchField('specification');
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function (item, index, length) {
            if (index !== 0) {
                buttonToolbar.remove(item);
            }
        });


        //부자재 선택시 구분(sg_code) disabled로 이벤트처리
        this.addCallback('STANDARD_FLAG', function (o) {
            console_logs('addCallback>>>>>>>>>', o);
        });

        this.createStore('Rfx2.model.company.sejun.PresentPlanPrd', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            gMain.pageSize
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['rtgast']
        );
        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.salesPriceListStore = Ext.create('Rfx2.store.company.bioprotech.SalesPriceMgmtStore', { pageSize: 100000 });
        // this.salesPriceByCompanyListStore = Ext.create('Rfx2.store.company.bioprotech.SalesPriceMgmtStore', { pageSize: 100000 });
        // this.salesPriceByCompanyListStore = Ext.create('Rfx2.store.company.bioprotech.AanalysisBomStore', { pageSize: 100000 });


        this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: false,
            handler: function () {
                gm.me().producePlanOp();
            }
        });

        this.editEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '주간계획 수정',
            tooltip: '생산계획을 수정합니다.',
            disabled: true,
            handler: function () {
                gm.me().editPlanOp();
            }
        });

        this.deleteEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '주간계획 삭제',
            tooltip: '생산계획을 삭제합니다.',
            disabled: true,
            handler: function () {
                gm.me().deletePlanOp();
            }
        });

        this.packageEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Repackaging_Order', '재포장계획수립'),
            tooltip: '재포장 계획을 수립합니다',
            disabled: true,
            handler: function () {
                gm.me().packagePlanOp();
            }
        });



        this.prEstablishActionOrder = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            handler: function () {
                var rec = gm.me().gridContractMaterial.getSelection()[0];
                var bm_quan = rec.get('produce_request_quan');
                var status = rec.get('reserved2');
                var bm_quan_percent = bm_quan * 0.05;
                var compareQuan = bm_quan + bm_quan_percent;
                var pr_quan = rec.get('pr_quan');
                console_logs('compareQuan', compareQuan);
                console_logs('pr_quan', pr_quan);
                if (status === 'Y') {
                    Ext.MessageBox.show({
                        title: '알림',
                        msg: '이미 생산요청이 되었습니다.<br>그래도 진행하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no") {
                                return;
                            } else {
                                gm.me().producePlanOpByOrder();
                            }
                        }
                    });
                } else if (compareQuan < pr_quan) {
                    Ext.MessageBox.show({
                        title: '알림',
                        msg: '요청잔량보다 큰 수량이 입력되었습니다<br>그래도 진행하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no") {
                                return;
                            } else {
                                gm.me().producePlanOpByOrder();
                            }
                        }
                    });
                    // Ext.MessageBox.alert('zzzzz','zzzzzz');
                } else if (pr_quan === 0) {
                    Ext.MessageBox.alert('알림', '요청수량이 0이 입력되었습니다.');
                } else {
                    gm.me().producePlanOpByOrder();
                }

            }
        });


        this.packageEstablishOrder = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Repackaging_Order', '재포장계획수립'),
            tooltip: '재포장 계획을 수립합니다',
            disabled: true,
            handler: function () {
                var rec = gm.me().gridContractMaterial.getSelection()[0];
                var bm_quan = rec.get('produce_request_quan');
                var status = rec.get('reserved2');
                var bm_quan_percent = bm_quan * 0.05;
                var compareQuan = bm_quan + bm_quan_percent;
                var pr_quan = rec.get('pr_quan');
                console_logs('compareQuan', compareQuan);
                console_logs('pr_quan', pr_quan);
                if (status === 'Y') {
                    Ext.MessageBox.show({
                        title: '알림',
                        msg: '이미 요청이 되었습니다.<br>그래도 진행하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no") {
                                return;
                            } else {
                                gm.me().packagePlanOpByOrder();
                            }
                        }
                    });
                } else if (compareQuan < pr_quan) {
                    Ext.MessageBox.show({
                        title: '알림',
                        msg: '요청잔량보다 큰 수량이 입력되었습니다<br>그래도 진행하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no") {
                                return;
                            } else {
                                gm.me().packagePlanOpByOrder();
                            }
                        }
                    });
                    // Ext.MessageBox.alert('zzzzz','zzzzzz');
                } else if (pr_quan === 0) {
                    Ext.MessageBox.alert('알림', '요청수량이 0이 입력되었습니다.');
                } else {
                    gm.me().packagePlanOpByOrder();
                }
            }
        });

        this.purListSrch = Ext.create('Ext.Action', {
            itemId: 'putListSrch',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            disabled: false,
            handler: function (widget, event) {
                try {
                    var start_date = '';
                    var end_date = '';
                    // var project_varchard = '';
                    // if (gu.getCmp('start_date_field') != null) {
                    start_date = gu.getCmp('start_date_field').getValue();
                    // }
                    // if (gu.getCmp('end_date_field').getValue() != null) {
                    end_date = gu.getCmp('end_date_field').getValue();
                    // }
                } catch (e) {

                }
                console_logs('start_date', start_date);
                console_logs('end_date', end_date);
                gm.me().productPlanStore.getProxy().setExtraParam('start_date', start_date);
                gm.me().productPlanStore.getProxy().setExtraParam('end_date', end_date);
                // gm.me().productPlanStore.getProxy().setExtraParam('project_varchard', '%' + project_varchard + '%');
                gm.me().productPlanStore.load();
            }
        });


        this.gridContractMaterial = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractMaterial'),
            store: this.productPlanStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            frame: true,
            //bbar: getPageToolbar(this.poCartListStore),
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
                {
                    text: '수정일자',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'create_date',
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                { text: '수정이력', width: 200, style: 'text-align:center', dataIndex: 'change_history', sortable: true },
                { text: '사유', width: 100, style: 'text-align:center', dataIndex: 'change_reason', sortable: true },
                {
                    text: '수정자',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'user_name',
                },
            ],
            title: '계획변동이력',
            name: 'po',
            autoScroll: true,
            listeners: {
            }
        });




        this.gridContractMaterial.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections) {
                    console_logs('selections', selections);
                } else {

                }
            }
        });

        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        this.grid.flex = 1;

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
                    width: '70%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                },
                this.gridContractMaterial
            ]
        }
        );

        //버튼 추가.

        this.callParent(arguments);
        buttonToolbar.insert(1, this.prEstablishAction);
        buttonToolbar.insert(2, this.editEstablishAction);
        buttonToolbar.insert(3, this.deleteEstablishAction);
        // buttonToolbar.insert(5, this.downloadSheetAction);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                this.editEstablishAction.enable();
                this.deleteEstablishAction.enable();
                this.productPlanStore.getProxy().setExtraParam('rtgast_uid', rec.get('unique_id_long'));
                this.productPlanStore.load();
            } else {
                this.deleteEstablishAction.disable();
                this.editEstablishAction.disable();
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('existSalesPrice', 'true');
        this.store.load(function (records) {
        });
    },

    producePlanOp: function () {
        var selection = this.grid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);
        var myWidth = 950;
        var myHeight = 600;
        var isAccept = true;
        var ebomStore = Ext.create('Rfx2.store.company.sejun.ReferenceEbomStore', { pageSize: 100000 });

        var productGrid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('productGrid'),
            collapsible: false,
            multiSelect: false,
            width: '60%',
            margin: '0 0 30 0',
            autoHeight: true,
            frame: false,
            border: true,
            forceFit: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            dockedItems: [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        '->',
                        {
                            text: '+',
                            listeners: [{
                                click: function () {
                                    var store = gu.getCmp('productGrid').getStore();
                                    store.insert(store.getCount(), new Ext.data.Record({
                                        'start_date': '',
                                        'srcahd_uid': '',
                                        'item_quan': '',
                                    }));
                                }
                            }]
                        },
                        {
                            text: '-',
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('productGrid').getSelectionModel().getSelected().items[0];
                                    var store = gu.getCmp('productGrid').getStore();
                                    if (record == null) {
                                        gu.getCmp('productGrid').getStore().remove(store.last());
                                    } else {
                                        gu.getCmp('productGrid').getStore().removeAt(gu.getCmp('productGrid').getStore().indexOf(record));
                                    }
                                }
                            }]
                        }

                    ]
                })
            ],

            columns: [
                {
                    text: gm.me().getMC('msg_order_grid_prd_fam', '날짜'),
                    width: '30%',
                    dataIndex: 'start_date',
                    style: 'text-align:center',
                    sortable: false,
                    align: 'left',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                    editor: {
                        xtype: 'datefield',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
                        format: 'Y-m-d',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                        listeners: {
                            change: function (me) {
                                isAccept = true;
                                var start_date = gu.getCmp('start_plan_date').getValue();
                                var end_date = gu.getCmp('end_plan_date').getValue();
                                console_logs('>>>> start_date', start_date);
                                console_logs('>>>> end_date', end_date);
                                if (start_date === null || end_date === null) {
                                    Ext.MessageBox.alert('알림', '기준 시작예정일자와 종료 예정일자가 입력되지 않았습니다.');
                                    isAccept = false;
                                } else {
                                    var start_date = gu.getCmp('start_plan_date').getValue();
                                    var end_date = gu.getCmp('end_plan_date').getValue();
                                    console_logs('me >>', new Date(me.getValue()));
                                    var sDate = new Date(me.getValue());
                                    console_logs('start_date >>', sDate);
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=determinateDate',
                                        waitMsg: '데이터를 처리중입니다.',
                                        params: {
                                            start_date: start_date,
                                            end_date: end_date,
                                            sDate: sDate,
                                        },
                                        success: function (result, request) {
                                            var result = result.responseText;
                                            console_logs('result >>', result);
                                            if (result === 'false') {
                                                Ext.MessageBox.alert('알림', '기준일자와 입력날짜의 범위가 초과되었습니다.');
                                                isAccept = false;
                                            }
                                        }, //endofsuccess
                                        failure: function (result, request) {
                                            var result = result.responseText;
                                            Ext.MessageBox.alert('알림', result);
                                        },
                                    });
                                }
                            },
                        },
                    }
                },
                {
                    text: gm.me().getMC('msg_order_grid_prd_fam', '품명'),
                    width: '40%',
                    dataIndex: 'srcahd_uid',
                    style: 'text-align:center',
                    align: 'left',
                    css: 'edit-cell',
                    // dataIndex: 'item_name',
                    style: 'text-align:center',
                    editor: {
                        xtype: 'combo',
                        id: gu.id('item_paycond_combo'),
                        displayField: 'item_name',
                        editable: true,
                        forceSelection: true,
                        mode: 'local',
                        store: gm.me().productStore,
                        triggerAction: 'all',
                        typeAhead: false,
                        minChars: 1,
                        valueField: 'unique_id',
                        listConfig: {
                            loadingText: 'Searching...',
                            emptyText: 'No matching posts found.',
                        },
                    },
                    listeners: {

                    },
                    renderer: function (val) {
                        var recordIndex = gm.me().productStore.find('unique_id_long', val);
                        console_logs('>>>> recordIndex ', recordIndex);
                        if (recordIndex === -1) {
                            return '';
                        }
                        productGrid.getSelection()[0].set('item_name', gm.me().productStore.getAt(recordIndex).get('item_name'));
                        productGrid.getSelection()[0].set('unit_code', gm.me().productStore.getAt(recordIndex).get('unit_code'));
                        return gm.me().productStore.getAt(recordIndex).get('item_name');
                    },
                    sortable: false
                },
                {
                    text: gm.me().getMC('msg_order_grid_prd_fam', '단위'),
                    width: '20%',
                    dataIndex: 'unit_code',
                    style: 'text-align:center',
                    // format: '0,000',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                
                {
                    text: gm.me().getMC('msg_order_grid_prd_fam', '계획수량'),
                    width: '25%',
                    dataIndex: 'quan',
                    xtype: 'numbercolumn',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    value: 0,
                    editor: {
                        xtype: 'numberfield',
                        listeners: {
                            change: function (me) {
                                var selectRecord = productGrid.getSelectionModel().getSelection()[0];
                                console_logs('>>>>> selectRecord', selectRecord);
                                var srcahd_uid = selectRecord.get('srcahd_uid');
                                console_logs('>>>>>',me.getValue());
                                console_logs('>>>>> 111111 ', srcahd_uid);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=convEaToBoxQty',
                                    waitMsg: '데이터를 처리중입니다.',
                                    params: {
                                        srcahd_uid: srcahd_uid,
                                        ea_qty : me.getValue()
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        console_logs('>>>> conv_result', result);
                                        console_logs('>>>> conv_result', Number(result));
                                        productGrid.getSelection()[0].set('box_qty', Number(result));
                                    }, //endofsuccess
                                    failure: function (result, request) {
                                        var result = result.responseText;
                                        Ext.MessageBox.alert('알림', result);
                                    },
                                });


                            }
                        }
                    }
                },
                {
                    text: 'BOX수량',
                    width: '20%',
                    dataIndex: 'box_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: gm.me().getMC('msg_order_grid_prd_fam', '부서'),
                    width: '30%',
                    dataIndex: 'dept_uid',
                    style: 'text-align:center',
                    align: 'left',
                    css: 'edit-cell',
                    // dataIndex: 'item_name',
                    style: 'text-align:center',
                    editor: {
                        xtype: 'combo',
                        id: gu.id('item_paycond_combo2'),
                        displayField: 'dept_name',
                        editable: true,
                        forceSelection: true,
                        mode: 'local',
                        store: gm.me().deptStore,
                        triggerAction: 'all',
                        typeAhead: false,
                        minChars: 1,
                        valueField: 'unique_id',
                        listConfig: {
                            loadingText: 'Searching...',
                            emptyText: 'No matching posts found.',
                            getInnerTpl: function () {
                                return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                            }
                        },
                    },
                    listeners: {

                    },
                    renderer: function (val) {
                        var recordIndex = gm.me().deptStore.find('unique_id_long', val);

                        if (recordIndex === -1) {
                            return '';
                        }

                        return gm.me().deptStore.getAt(recordIndex).get('dept_name');
                    },
                },
                {
                    text: gm.me().getMC('msg_order_grid_prd_fam', '인원수'),
                    width: '20%',
                    dataIndex: 'member_cnt',
                    xtype: 'numbercolumn',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    value: 0,
                    editor: {
                        xtype: 'numberfield',
                    }
                }
            ],
            selModel: 'cellmodel',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            listeners: {
                edit: function (editor, e, eOpts) {

                }
            }
        });

        productGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                var record = gu.getCmp('productGrid').getSelectionModel().getSelected().items[0];
                console_logs('>>>>>>> selections', record);
                if (record !== undefined) {
                    var srcahd_uid = record.get('srcahd_uid');
                    var quan = record.get('quan');
                    console_logs('>>>>> quan', quan);
                    if (srcahd_uid.length > 0) {
                        if (quan !== undefined) {
                            console_logs('상태', '설계 BOM을 보여줄수 있음');
                            ebomStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                            ebomStore.getProxy().setExtraParam('quan', quan);
                            ebomStore.load();

                        } else {
                            console_logs('상태', '게획수량 없음 설계 BOM을 보여줄수 없음');
                        }
                    } else {
                        console_logs('상태', '설계 BOM을 보여줄수 없음');
                    }
                }
            }
        });

        var bomlist = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('bomlist'),
            store: ebomStore,
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '40%',
            autoScroll: true,
            margin: '10 0 0 5',
            autoHeight: true,
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                stripeRows: false,
                getRowClass: function (record) {
                    var resource_rate = record.get('resource_rate');
                    var stock_qty = record.get('stock_qty');
                    if (resource_rate > stock_qty) {
                        return 'red-row';
                    }
                }
            },
            columns: [
                {
                    text: '품번',
                    width: '30%',
                    dataIndex: 'item_code',
                    style: 'text-align:center',
                    valueField: 'no',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '품명',
                    width: '40%',
                    dataIndex: 'item_name',
                    style: 'text-align:center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '소요량',
                    width: '30%',
                    dataIndex: 'resource_rate',
                    style: 'text-align:center',
                    // format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    // renderer: function (value, context, tmeta) {
                    //     if (context.field == 'resource_rate') {
                    //         context.record.set('resource_rate', Ext.util.Format.number(value, '0,00/i'));
                    //     }
                    //     return Ext.util.Format.number(value, '0,00/i');
                    // },
                },
                {
                    text: '현재고',
                    width: '30%',
                    dataIndex: 'stock_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'stock_qty') {
                            context.record.set('stock_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },

                }
            ],
            listeners: {

            },
            autoScroll: true,
        });

        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            width: myWidth,
            height: myHeight - 10,
            items: [
                {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        width: '99%',
                        padding: '1 2 2 10'
                    },
                    border: true,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'datefield',
                            name: 'start_plan_date',
                            format: 'Y-m-d',
                            id: gu.id('start_plan_date'),
                            emptyText: '시작예정일자',
                            // fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '시작일자',
                            hideTrigger: false,
                            width: 250,
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {
                                select: function () {

                                }

                            },
                        },
                        {
                            xtype: 'label',
                            // forId: 'myFieldId',
                            text: '~',
                            width: 20,
                            // margin: '0 0 0 0'
                        },
                        {
                            xtype: 'datefield',
                            name: 'end_plan_date',
                            format: 'Y-m-d',
                            emptyText: '종료예정일자',
                            id: gu.id('end_plan_date'),
                            hideTrigger: false,
                            width: 250,
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {
                                select: function () {

                                }

                            },
                        },

                    ]
                },
                {
                    xtype: 'container',
                    width: '99%',
                    margin: '3 3 3 3',
                    defaults: {
                        width: '99%',
                        // padding: '1 30 30 10'
                    },
                    layout: 'hbox',
                    items: [
                        productGrid,
                        bomlist
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '주간 생산계획수립',
            width: myWidth,
            height: myHeight,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                if (isAccept === true) {
                                    console_logs('결과', '넘어간다.');
                                    var val = form.getValues(false);
                                    var storeData = gu.getCmp('productGrid').getStore();
                                    var objs = [];
                                    var columns = [];
                                    var obj = {};
                                    var quan = 0;
                                    for (var j = 0; j < storeData.data.items.length; j++) {
                                        var item = storeData.data.items[j];
                                        var objv = {};
                                        if (item.get('quan') == null) {
                                            Ext.MessageBox.alert('알림', '수량 필드에 빈값이 있습니다.');
                                            isAccept = false;
                                            return;
                                        } else {
                                            objv['start_date'] = item.get('start_date');
                                            objv['srcahd_uid'] = item.get('srcahd_uid');
                                            objv['quan'] = item.get('quan');
                                            objv['dept_uid'] = item.get('dept_uid');
                                            objv['member_cnt'] = item.get('member_cnt');
                                            columns.push(objv);
                                        }
                                    }
                                    obj['plan'] = columns;
                                    objs.push(obj);
                                    var jsonData = Ext.util.JSON.encode(objs);
                                    if (columns.length > 0) {
                                        form.submit({
                                            submitEmptyText: false,
                                            url: CONTEXT_PATH + '/index/process.do?method=addPrdPlanEstablishByPlan',
                                            waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                            params: {
                                                jsonData: jsonData
                                            },
                                            success: function (val, action) {
                                                console_logs('OK', 'PROCESS OK');
                                                if (prWin) {
                                                    Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                                    prWin.close();
                                                    gm.me().productPlanStore.load();
                                                }
                                            },
                                            failure: function () {
                                                // console_logs('결과 ???', action);
                                                prWin.setLoading(false);
                                                Ext.MessageBox.alert('에러', '데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.');
                                                if (prWin) {
                                                    prWin.close();
                                                }
                                            }
                                        });
                                    } else {
                                        Ext.MessageBox.alert('알림', '입력되어있는 값이 존재하지 않습니다.')
                                    }


                                } else {
                                    console_logs('결과', '빠꾸');
                                }
                            }

                        }
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        Ext.MessageBox.alert(
                            '알림',
                            '취소 할 시 입력한 모든정보가 저장되지 않습니다.<br>그래도 취소하시겠습니까?',
                            function () {
                                console_logs('취소', '취소');
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        )
                    }
                }
            ]
        });


        prWin.show();
    },


    editPlanOp: function () {
        var selection = this.grid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);
        var srcahd_uid = selection.get('srcahd_uid');
        gm.me().deptStore.load();
        var myWidth = 950;
        var myHeight = 400;
        var isAccept = true;
        var ebomStore = Ext.create('Rfx2.store.company.sejun.ReferenceEbomStore', { pageSize: 100000 });
        var productForm = Ext.create('Ext.form.Panel', {
            id: gu.id('productForm'),
            collapsible: false,
            multiSelect: false,
            width: '60%',
            margin: '0 0 30 0',
            autoHeight: true,
            frame: false,
            border: true,
            forceFit: true,
            items: [
                {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        width: '99%',
                        padding: '1 2 2 10'
                    },
                    border: true,
                    layout: 'vbox',
                    items: [
                        {
                            fieldLabel: '품번',
                            xtype: 'textfield',
                            name: 'item_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('item_code'),
                            editable: false,
                            value: selection.get('item_code')
                        },
                        {
                            fieldLabel: '품명',
                            xtype: 'textfield',
                            name: 'line_name',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('line_name'),
                            editable: false,
                            value: selection.get('item_name')
                        },
                        {
                            xtype: 'numberfield',
                            name: 'item_quan',
                            id: gu.id('item_quan'),
                            fieldLabel: '계획수량',
                            hideTrigger: false,
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            value: selection.get('item_quan'),
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    ebomStore.getProxy().setExtraParam('srcahd_uid', srcahd_uid);
                                    ebomStore.getProxy().setExtraParam('quan', newValue);
                                    ebomStore.load();
                                }
                            }
                        },
                        {
                            xtype: 'combo',
                            name: 'dept_uid',
                            fieldLabel: '부서',
                            anchor: '100%',
                            width: '99%',
                            editable: true,
                            displayField: 'dept_name',
                            store: gm.me().deptStore,
                            value: selection.get('reserved_number1'),
                            valueField: 'unique_id_long',
                            allowBlank: false,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false
                        },
                        {
                            xtype: 'combo',
                            name: 'dept_uid',
                            fieldLabel: '부서',
                            anchor: '100%',
                            width: '99%',
                            editable: true,
                            displayField: 'dept_name',
                            store: gm.me().deptStore,
                            value: selection.get('reserved_number1'),
                            valueField: 'unique_id_long',
                            allowBlank: false,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false
                        },
                        {
                            xtype: 'datefield',
                            name: 'start_plan_date',
                            format: 'Y-m-d',
                            id: gu.id('start_plan_date'),
                            fieldLabel: '시작일자',
                            value: selection.get('reserved_timestamp1_str'),
                            hideTrigger: false,
                            width: '99%',
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {
                                select: function () {

                                }

                            },
                        },
                        {
                            xtype: 'numberfield',
                            name: 'work_quan',
                            id: gu.id('work_quan'),
                            fieldLabel: '인원수',
                            hideTrigger: false,
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            value: selection.get('work_quan'),
                            listeners: {

                            }
                        },
                        {
                            xtype: 'textfield',
                            name: 'change_reason',
                            fieldLabel: '변경사유',
                            anchor: '100%',
                            width: '99%',
                            editable: true,
                            typeAhead: false,
                            hideLabel: false,
                            hideTrigger: false
                        },
                    ]
                }
            ]
        });



        var bomlist = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('bomlist'),
            store: ebomStore,
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '40%',
            autoScroll: true,
            margin: '10 0 0 5',
            autoHeight: true,
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                stripeRows: false,
                getRowClass: function (record) {
                    var resource_rate = record.get('resource_rate');
                    var stock_qty = record.get('stock_qty');
                    if (resource_rate > stock_qty) {
                        return 'red-row';
                    }
                }
            },
            columns: [
                {
                    text: '품번',
                    width: '30%',
                    dataIndex: 'item_code',
                    style: 'text-align:center',
                    valueField: 'no',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '품명',
                    width: '40%',
                    dataIndex: 'item_name',
                    style: 'text-align:center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '소요량',
                    width: '30%',
                    dataIndex: 'resource_rate',
                    style: 'text-align:center',
                    // format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '현재고',
                    width: '30%',
                    dataIndex: 'stock_qty',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'stock_qty') {
                            context.record.set('stock_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },

                }
            ],
            listeners: {

            },
            autoScroll: true,
        });

        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            width: myWidth,
            height: myHeight - 10,
            items: [
                {
                    xtype: 'container',
                    width: '99%',
                    margin: '3 3 3 3',
                    defaults: {
                        width: '99%',
                        // padding: '1 30 30 10'
                    },
                    layout: 'hbox',
                    items: [
                        productForm,
                        bomlist
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '생산계획수립 수정',
            width: myWidth,
            height: myHeight,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                form.submit({
                                    submitEmptyText: false,
                                    url: CONTEXT_PATH + '/index/process.do?method=editPrdPlan',
                                    waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                    params: {
                                        unique_id_long: selection.get('unique_id_long')
                                    },
                                    success: function (val, action) {
                                        if (prWin) {
                                            Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                            prWin.close();
                                            gm.me().store.load();
                                        }
                                    },
                                    failure: function () {
                                        prWin.setLoading(false);
                                        Ext.MessageBox.alert('에러', '데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.');
                                        if (prWin) {
                                            prWin.close();
                                        }
                                    }
                                });
                            }

                        }
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        Ext.MessageBox.alert(
                            '알림',
                            '취소 할 시 입력한 모든정보가 저장되지 않습니다.<br>그래도 취소하시겠습니까?',
                            function () {
                                console_logs('취소', '취소');
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        )
                    }
                }
            ]
        });


        prWin.show();
    },


    deletePlanOp: function () {
        var selection = this.grid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);
        gm.me().deptStore.load();
        var myWidth = 500;
        var myHeight = 200;
        var productForm = Ext.create('Ext.form.Panel', {
            id: gu.id('productForm'),
            collapsible: false,
            multiSelect: false,
            width: '100%',
            margin: '0 0 30 0',
            autoHeight: true,
            frame: false,
            border: true,
            forceFit: true,
            items: [
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    title: '삭제사유를 입력하십시오.',
                    width: '100%',
                    style: 'padding:5px',
                    defaults: {
                        labelStyle: 'padding:5px',
                        anchor: '100%',
                        layout: {
                            type: 'column'
                        }
                    },
                    items: [
                        {
                            fieldLabel: '삭제사유',
                            xtype: 'textfield',
                            width: '20%',
                            name : 'delete_reason',
                            labelAlign: 'left',
                            value: '',
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                        }       
                    ]
                }
                    
            ]
        });

        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            width: myWidth,
            height: myHeight - 10,
            items: [
                productForm
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '생산계획수립 삭제',
            width: myWidth,
            height: myHeight,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                form.submit({
                                    submitEmptyText: false,
                                    url: CONTEXT_PATH + '/index/process.do?method=deletePrdPlanWriteReason',
                                    waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                    params: {
                                        unique_id_long: selection.get('unique_id_long')
                                    },
                                    success: function (val, action) {
                                        if (prWin) {
                                            Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                            prWin.close();
                                            gm.me().store.load();
                                        }
                                    },
                                    failure: function () {
                                        prWin.setLoading(false);
                                        Ext.MessageBox.alert('에러', '데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.');
                                        if (prWin) {
                                            prWin.close();
                                        }
                                    }
                                });
                            }

                        }
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        prWin.close();
                    }
                }
            ]
        });
        prWin.show();
    },


    producePlanOpByOrder: function () {

        var selection = gm.me().gridContractMaterial.getSelectionModel().getSelection()[0];
        var twoGridSelection = gm.me().twoGrid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);

        var myWidth = 600;
        var myHeight = 600;
        var isCalc = false;



        var prodUnitGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: new Ext.data.Store(),
            id: gu.id('prodUnitGridOrder'),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '30%',
            autoScroll: true,
            title: '생산단위',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            margin: '10 0 0 0',
            autoHeight: true,
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false,

            },
            columns: [
                {
                    text: 'NO',
                    width: '15%',
                    dataIndex: 'proNumber',
                    style: 'text-align:center',
                    valueField: 'no',
                    align: 'center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '생산수량',
                    width: '40%',
                    xtype: 'numbercolumn',
                    dataIndex: 'proQuan',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    editor: {
                        xtype: 'numberfield',
                    }
                }
            ],
            listeners: {
                edit: function (editor, e, eOpts) {
                    var store = gu.getCmp('prodUnitGridOrder').getStore();
                    var previous_store = store.data.items;
                    var total_quan = 0;
                    console_logs('All Store Contents ??? ', previous_store);
                    for (var j = 0; j < previous_store.length; j++) {
                        var item = previous_store[j];
                        total_quan = Number(total_quan) + Number(item.get('proQuan'));
                    }
                    if (gu.getCmp('bm_quan_order').getValue() < total_quan) {
                        Ext.MessageBox.alert('', '생산수량은 생산요청량을 초과할 수 없습니다.');
                        for (var k = 0; k < previous_store.length; k++) {
                            secondRecord = gu.getCmp('prodUnitGridOrder').getStore().getAt(k);
                            secondRecord.set('proQuan', '');
                        }
                        gu.getCmp('capaValueOrder').setValue(selection.get('unit_mass'));
                        return;
                    } else {
                        gu.getCmp('capaValueOrder').setValue(total_quan);
                        isCalc = true;
                    }
                }
            },
            autoScroll: true,
            dockedItems: [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        '->',
                        {
                            text: '추가',
                            listeners: [{
                                click: function () {
                                    console_logs('bm_quan >>>', gu.getCmp('bm_quan_order').getValue());
                                    if (gu.getCmp('bm_quan_order').getValue() === null || gu.getCmp('bm_quan_order').getValue() === 0) {
                                        Ext.MessageBox.alert('알림', '생산요청량을 입력해주시기 바랍니다.')
                                        return;
                                    } else {
                                        gm.me().addProUnitOrder();
                                    }
                                }
                            }]
                        },
                        {
                            text: gm.getMC('CMD_DELETE', '삭제'),
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('prodUnitGridOrder').getSelectionModel().getSelected().items[0];
                                    var store = gu.getCmp('prodUnitGridOrder').getStore();
                                    var workStore = gu.getCmp('workGridOrder').getStore();
                                    var proNumber = record.get('proNumber');
                                    var cnt = workStore.getCount();
                                    for (var i = cnt - 1; i >= 0; i--) {
                                        var rec = workStore.getAt(i);
                                        if (rec.get('workNumber') === proNumber) {
                                            workStore.removeAt(workStore.indexOf(rec));
                                        }
                                    }
                                    if (record == null) {
                                        store.remove(store.last());
                                    } else {
                                        store.removeAt(store.indexOf(record));
                                    }
                                    cnt = workStore.getCount();
                                    var cnt2 = store.getCount();
                                    for (var i = cnt2 - 1; i >= 0; i--) {
                                        var rec = store.getAt(i);
                                        if (rec.get('proNumber') > proNumber) {
                                            rec.set('proNumber', rec.get('proNumber') - 1);
                                        }
                                    }
                                    for (var i = cnt - 1; i >= 0; i--) {
                                        var rec = workStore.getAt(i);
                                        if (rec.get('workNumber') > proNumber) {
                                            rec.set('workNumber', rec.get('workNumber') - 1);
                                        }
                                    }
                                }
                            }]
                        }
                    ]
                })
            ]
        });

        var site = '';
        var pcs_group = '';

        var timeStore = Ext.create('Ext.data.Store', {
            fields: ['time', 'view'],
            data: [
                { "time": "00:00", "view": "00:00" },
                { "time": "01:00", "view": "01:00" },
                { "time": "02:00", "view": "02:00" },
                { "time": "03:00", "view": "03:00" },
                { "time": "04:00", "view": "04:00" },
                { "time": "05:00", "view": "05:00" },
                { "time": "06:00", "view": "06:00" },
                { "time": "07:00", "view": "07:00" },
                { "time": "08:00", "view": "08:00" },
                { "time": "09:00", "view": "09:00" },
                { "time": "10:00", "view": "10:00" },
                { "time": "11:00", "view": "11:00" },
                { "time": "12:00", "view": "12:00" },
                { "time": "13:00", "view": "13:00" },
                { "time": "14:00", "view": "14:00" },
                { "time": "15:00", "view": "15:00" },
                { "time": "16:00", "view": "16:00" },
                { "time": "17:00", "view": "17:00" },
                { "time": "18:00", "view": "18:00" },
                { "time": "19:00", "view": "19:00" },
                { "time": "20:00", "view": "20:00" },
                { "time": "21:00", "view": "21:00" },
                { "time": "22:00", "view": "22:00" },
                { "time": "23:00", "view": "23:00" },
            ]
        });

        var workGrid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('workGridOrder'),
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '69%',
            autoScroll: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            margin: '10 0 0 40',
            autoHeight: true,
            frame: false,
            title: '작업반',
            border: false,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false
            },
            columns: [
                {
                    text: 'NO',
                    width: '15%',
                    dataIndex: 'workNumber',
                    style: 'text-align:center',
                    valueField: 'no',
                    align: 'center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: false
                },
                {
                    text: '라인',
                    width: '60%',
                    dataIndex: 'workGroup',
                    style: 'text-align:center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: false,
                    editor: {
                        xtype: 'combo',
                        store: Ext.create('Mplm.store.MachineStore', {}),
                        displayField: 'site_name',
                        valueField: 'name_ko',
                        editable: false,
                        listeners: {
                            expand: function () {
                                var store = gu.getCmp('workGridOrder').getStore();
                                var record = gu.getCmp('workGridOrder').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var selection = gm.me().gridContractMaterial.getSelectionModel().getSelection();
                                var rec = selection[0];
                                console_logs('rec >>>>', rec);
                                this.store.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');

                                this.store.getProxy().setExtraParam('pcs_code', rec.get('product_group'));

                                delete this.store.getProxy().getExtraParams()['parameter_name'];
                                this.store.getProxy().setExtraParam('reserved_varchar3', 'PROD');
                                this.store.load();
                            },
                            select: function (combo, rec) {
                                // 이 부분에 CAPA와 시작예정일을 산출해야 함
                                var store = gu.getCmp('workGridOrder').getStore();
                                var record = gu.getCmp('workGridOrder').getSelectionModel().getSelected().items[0];
                                // var twoGrid = gm.me().twoGrid.getSelectionModel().getSelection()[0];
                                site = rec.get('reserved_varchar2');
                                pcs_group = rec.get('pcs_code');

                                // 시작예정일과 종료일 산출
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=getCalcStartPlanBIOT',
                                    params: {
                                        line_code: rec.get('mchn_code')
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        var result_split = result.split("|", 2);
                                        var date = '';
                                        var time = '';

                                        var date_e = '';
                                        var time_e = '';
                                        if (result.length > 0) {
                                            console_logs('result ????', result);
                                            console_logs('date >>>>', result_split[0]);
                                            date = result_split[0];
                                            console_logs('time >>>>', result_split[1]);
                                            time = result_split[1];
                                            store.getAt(index).set('startDate', date);
                                            store.getAt(index).set('start_time', /**date + ' ' + **/time);
                                        } else {
                                            Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                        }
                                        var selectionRec = gm.me().gridContractMaterial.getSelectionModel().getSelection();
                                        var recOther = selectionRec[0];
                                        var unit = gu.getCmp('prodUnitGridOrder').getStore().getAt(record.get('workNumber') - 1);

                                        console_logs('recOther', recOther);
                                        console_logs('bm_quan >>>>', recOther.get('pr_quan'));
                                        console_logs('start_date >>>>', result);
                                        console_logs('mchn_code', rec.get('mchn_code'));
                                        console_logs('item_code', recOther.get('item_code'));

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                            waitMsg: '데이터를 처리중입니다.',
                                            params: {
                                                item_code: recOther.get('item_code'),
                                                line_code: rec.get('mchn_code'),
                                                bm_quan: unit.get('proQuan'),
                                                start_date: date
                                            },
                                            success: function (result, request) {
                                                var result = result.responseText;
                                                console_logs('end_time_full >>>>', result);
                                                var result_split_e = result.split("|", 2);
                                                var date_e = result_split_e[0];
                                                var time_e = result_split_e[1];
                                                console_logs('end_time >>>>', time_e);
                                                if (result.length > 0) {
                                                    store.getAt(index).set('endDate', date_e);
                                                    store.getAt(index).set('end_time', /**date_e + ' ' + **/time_e);
                                                } else {
                                                    Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                }

                                            },//endofsuccess
                                            failure: function (result, request) {
                                                var result = result.responseText;
                                                Ext.MessageBox.alert('알림', result);
                                            }
                                        });
                                    },//endofsuccess
                                    failure: function (result, request) {
                                        var result = result.responseText;
                                        Ext.MessageBox.alert('알림', result);
                                    }
                                });

                                // CAPA 산출
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=getWorkCapa',
                                    params: {
                                        mchn_uid: rec.get('unique_id'),
                                        srcahd_uid: selection.get('srcahd_uid')
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        if (result.length > 0) {
                                            console_logs('capa ????', result);
                                            if (result === 'N') {
                                                store.getAt(index).set('workCapa', rec.get('target_qty'));
                                            } else {
                                                store.getAt(index).set('workCapa', Number(result));
                                            }
                                        }
                                    },//endofsuccess
                                    failure: function (result, request) {
                                        var result = result.responseText;
                                        Ext.MessageBox.alert('알림', result);
                                    }
                                });

                                var index = store.indexOf(record);
                                store.getAt(index).set('name_ko', rec.get('name_ko'));
                                store.getAt(index).set('pcsmchn_uid', rec.get('unique_id_long'));
                                // store.getAt(index).set('workCapa', rec.get('target_qty')); // Capa 산출
                                store.getAt(index).set('mchn_code', rec.get('mchn_code'));
                                store.getAt(index).set('work_site', site);
                            }
                        }
                    }
                },
                {
                    text: 'CAPA',
                    width: '40%',
                    id: gu.id('workCapa'),
                    xtype: 'numbercolumn',
                    dataIndex: 'workCapa',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true
                },
                {
                    text: '시작예정일',
                    width: '40%',
                    dataIndex: 'startDate',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                    editor: {
                        xtype: 'datefield',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
                        format: 'Y-m-d',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                        listeners: {
                            select: function (me) {
                                var store = gu.getCmp('workGridOrder').getStore();
                                var record = gu.getCmp('workGridOrder').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var unitStore = gu.getCmp('prodUnitGridOrder').getStore().getAt(record.get('workNumber') - 1);
                                console_logs('unitStore ???', unitStore);
                                var selectionRec = gm.me().gridContractMaterial.getSelectionModel().getSelection();
                                var recOther = selectionRec[0];
                                if (record.get('mchn_code') !== null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                        waitMsg: '데이터를 처리중입니다.',
                                        params: {
                                            item_code: recOther.get('item_code'),
                                            line_code: record.get('mchn_code'),
                                            bm_quan: unitStore.get('proQuan'),
                                            start_date: me.getSubmitValue()
                                        },
                                        success: function (result, request) {
                                            var result = result.responseText;
                                            if (result.length > 0) {
                                                var result_split_e = result.split('|', 2);
                                                var date_e = result_split_e[0];
                                                var time_e = result_split_e[1];
                                                if (result.length > 0) {
                                                    store.getAt(index).set('endDate', date_e);
                                                    store.getAt(index).set('end_time', /**date_e + ' ' + **/time_e);
                                                } else {
                                                    store.getAt(index).set('end_time', me.getSubmitValue());
                                                }
                                            } else {
                                                store.getAt(index).set('endDate', me.getSubmitValue());
                                            }
                                        },//endofsuccess
                                        failure: function (result, request) {
                                            var result = result.responseText;
                                            Ext.MessageBox.alert('알림', result);
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림', '완료예정일을 계산하기 위한 값이 부적절하거나 정확히 입력되지 않았습니다.')
                                    store.removeAt(store.indexOf(record));
                                }
                            }
                        }
                    },
                },
                {
                    text: '시작시간',
                    width: '40%',
                    // xtype: 'datecolumn',
                    // format: 'H:i',
                    dataIndex: 'start_time',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    editor: {
                        xtype: 'combo',
                        store: timeStore,
                        displayField: 'view',
                        valueField: 'time',
                        // format: 'H:i',
                        // increment: 60,
                        anchor: '50%',
                        // value: gm.me().getThirtyMinites(new Date()),
                        // increment: 60,
                        // anchor: '50%',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                // gm.me().setRefDate();
                            }
                        }
                    }
                },
                {
                    text: '완료예정일',
                    width: '40%',
                    dataIndex: 'endDate',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                    listeners: {

                    }
                },
                {
                    text: '완료시간',
                    width: '40%',
                    // xtype: 'datecolumn',
                    // format: 'H:i',
                    dataIndex: 'end_time',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    editor: {
                        xtype: 'combo',
                        store: timeStore,
                        displayField: 'view',
                        valueField: 'time',
                        // format: 'H:i',
                        // increment: 60,
                        anchor: '50%',
                        // value: gm.me().getThirtyMinites(new Date()),
                        // increment: 60,
                        // anchor: '50%',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                // gm.me().setRefDate();
                            }
                        }
                    }
                },
            ],
            listeners: {

            },
            autoScroll: true
        });

        var formOrder = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            width: myWidth,
            height: myHeight - 10,
            items: [
                {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        width: '47%',
                        padding: '3 3 3 20'
                    },
                    border: true,
                    layout: 'column',
                    items: [
                        {
                            fieldLabel: '품번',
                            xtype: 'textfield',
                            name: 'line_item_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('item_code'),
                            editable: false,
                            value: selection.get('item_code')
                        },
                        {
                            fieldLabel: '품명',
                            xtype: 'textfield',
                            name: 'line_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('line_code'),
                            editable: false,
                            value: selection.get('item_name')
                        }
                    ]
                },
                {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        width: '47%',
                        padding: '3 3 3 20'
                    },
                    border: true,
                    layout: 'column',
                    items: [
                        {
                            xtype: 'numberfield',
                            name: 'bm_quan_disp',
                            id: gu.id('bm_quan_order'),
                            value: selection.get('pr_quan'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '생산요청량',
                            hideTrigger: false,
                            // fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            editable: false,
                            listeners: {
                                change: function () {
                                    // gu.getCmp('capaValue').setValue(gu.getCmp('bm_quan').getValue());
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            id: gu.id('capaValueOrder'),
                            name: 'capaValue',
                            // value : selection.get('pr_quan'),
                            fieldLabel: '총 수량',
                            hideTrigger: true,
                            fieldStyle: 'background-color: #ddd; background-image: none;font-align:right',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            allowBlank: false,
                            editable: false
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '99%',
                    margin: '3 3 3 3',
                    items: [
                        prodUnitGrid,
                        workGrid
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '반제품 생산계획수립',
            width: myWidth,
            height: myHeight,
            items: formOrder,
            buttons: [
                {
                    text: '확인',
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            // if (formOrder.isValid()) {
                            console_logs('zzzzzzOK')
                            // 생산단위 JSON 
                            var siteArr = [];
                            var mchnCodeArr = [];
                            var startDateArr = [];
                            var storeData1 = gu.getCmp('prodUnitGridOrder').getStore();
                            var objs = [];
                            var columns = [];
                            var obj = {};
                            for (var i = 0; i < storeData1.data.items.length; i++) {
                                var item = storeData1.data.items[i];
                                var objv = {};
                                objv['proNumber'] = item.get('proNumber');
                                objv['proQuan'] = item.get('proQuan');
                                columns.push(objv);
                            }

                            obj['units'] = columns;
                            objs.push(obj);
                            var jsonData1 = Ext.util.JSON.encode(objs);

                            // 작업반 JSON
                            var storeData2 = gu.getCmp('workGridOrder').getStore();
                            var objs1 = [];
                            var columns1 = [];
                            var obj1 = {};
                            for (var i = 0; i < storeData2.data.items.length; i++) {
                                var item = storeData2.data.items[i];
                                var objv1 = {};
                                objv1['workNumber'] = item.get('workNumber');
                                objv1['workGroup'] = item.get('workGroup');
                                objv1['workCapa'] = item.get('workCapa');
                                objv1['startDate'] = item.get('startDate');
                                objv1['startTime'] = item.get('start_time');
                                objv1['endDate'] = item.get('endDate');
                                objv1['endTime'] = item.get('end_time');
                                objv1['pcsmchn_uid'] = item.get('pcsmchn_uid');
                                columns1.push(objv1);
                                siteArr.push(item.get('work_site'));
                                mchnCodeArr.push(item.get('mchn_code'));
                                startDateArr.push(item.get('startDate'));
                            }

                            obj1['plan'] = columns1;
                            objs1.push(obj1);
                            var jsonData2 = Ext.util.JSON.encode(objs1);
                            console_logs('jsonData2', jsonData2);
                            console_logs('json1.length...', jsonData1.lenth);
                            console_logs('json2.length...', jsonData2.lenth);
                            if (jsonData1 != null && jsonData2 != null) {
                                gm.me().loding_msg();
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=addAssemblyProductionManualOrder',
                                    waitMsg: '데이터를 처리중입니다.',
                                    params: {
                                        bm_quan: gu.getCmp('bm_quan_order').getValue(),
                                        prd_group: selection.get('product_group'),
                                        assymap_uid: selection.get('assymap_uid'),
                                        project_uid: selection.get('ac_uid'),
                                        srcahd_uid: selection.get('srcahd_uid'),
                                        item_code: selection.get('item_code'),
                                        jsonData1: jsonData1,
                                        jsonData2: jsonData2,
                                        pcs_group: pcs_group,
                                        siteArr: siteArr,
                                        mchnCodeArr: mchnCodeArr,
                                        project_code: twoGridSelection.get('pj_code'),
                                        pl_no: twoGridSelection.get('pl_no'),
                                        final_buyer_uid: twoGridSelection.get('reserved_number3'),
                                        startDateArr: startDateArr
                                    },
                                    success: function (result, request) {
                                        console_logs('OK', 'PROCESS OK');
                                        if (prWin) {
                                            Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                            prWin.close();
                                            gm.me().store.load();
                                            gm.me().salesPriceByCompanyListStore.load();
                                        }
                                    },//endofsuccess
                                    failure: function (result, request) {
                                        // console_logs('결과 ???', action);
                                        prWin.setLoading(false);
                                        Ext.MessageBox.alert('에러', '데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.')
                                        // extjsUtil.failureMessage();
                                        if (prWin) {
                                            // Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                            prWin.close();
                                            gm.me().store.load();
                                        }
                                    }
                                });
                            }
                        }
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        Ext.MessageBox.alert(
                            '알림',
                            '취소 할 시 입력한 모든정보가 저장되지 않습니다.<br>그래도 취소하시겠습니까?',
                            function () {
                                console_logs('취소', '취소');
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        )
                    }
                }
            ]
        });

        // gm.me().addProUnitFirstOrder();

        prWin.show();
    },


    packagePlanOpByOrder: function () {

        var selection = gm.me().gridContractMaterial.getSelectionModel().getSelection()[0];
        var twoGridSelection = gm.me().twoGrid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);

        var myWidth = 1100;
        var myHeight = 600;
        var isCalc = false;



        var prodUnitGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: new Ext.data.Store(),
            id: gu.id('packageUnitGridOrder'),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '30%',
            autoScroll: true,
            title: '포장단위',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            margin: '10 0 0 0',
            autoHeight: true,
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false
            },
            columns: [
                {
                    text: 'NO',
                    width: '15%',
                    dataIndex: 'proNumber',
                    style: 'text-align:center',
                    valueField: 'no',
                    align: 'center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '생산수량',
                    width: '40%',
                    xtype: 'numbercolumn',
                    dataIndex: 'proQuan',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    editor: {
                        xtype: 'numberfield',
                    }
                }
            ],
            listeners: {
                edit: function (editor, e, eOpts) {
                    var store = gu.getCmp('packageUnitGridOrder').getStore();
                    var previous_store = store.data.items;
                    var total_quan = 0;
                    console_logs('All Store Contents ??? ', previous_store);
                    for (var j = 0; j < previous_store.length; j++) {
                        var item = previous_store[j];
                        total_quan = Number(total_quan) + Number(item.get('proQuan'));
                    }
                    if (gu.getCmp('bm_quan_order').getValue() < total_quan) {
                        Ext.MessageBox.alert('', '작업수량은 작업요청량을 초과할 수 없습니다.');
                        for (var k = 0; k < previous_store.length; k++) {
                            secondRecord = gu.getCmp('prodUnitGridOrder').getStore().getAt(k);
                            secondRecord.set('proQuan', '');
                        }
                        gu.getCmp('capaValueOrder').setValue(selection.get('unit_mass'));
                        return;
                    } else {
                        gu.getCmp('capaValueOrder').setValue(total_quan);
                        isCalc = true;
                    }
                }
            },
            autoScroll: true,
            dockedItems: [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        '->',
                        {
                            text: '추가',
                            listeners: [{
                                click: function () {
                                    console_logs('bm_quan >>>', gu.getCmp('bm_quan_order').getValue());
                                    if (gu.getCmp('bm_quan_order').getValue() === null || gu.getCmp('bm_quan_order').getValue() === 0) {
                                        Ext.MessageBox.alert('알림', '작업요청량을 입력해주시기 바랍니다.')
                                        return;
                                    } else {
                                        gm.me().addPackageUnitOrder();
                                    }
                                }
                            }]
                        },
                        {
                            text: gm.getMC('CMD_DELETE', '삭제'),
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('packageUnitGridOrder').getSelectionModel().getSelected().items[0];
                                    var store = gu.getCmp('packageUnitGridOrder').getStore();
                                    var workStore = gu.getCmp('packageWorkGridOrder').getStore();
                                    var proNumber = record.get('proNumber');
                                    var cnt = workStore.getCount();
                                    for (var i = cnt - 1; i >= 0; i--) {
                                        var rec = workStore.getAt(i);
                                        if (rec.get('workNumber') === proNumber) {
                                            workStore.removeAt(workStore.indexOf(rec));
                                        }
                                    }
                                    if (record == null) {
                                        store.remove(store.last());
                                    } else {
                                        store.removeAt(store.indexOf(record));
                                    }
                                    cnt = workStore.getCount();
                                    var cnt2 = store.getCount();
                                    for (var i = cnt2 - 1; i >= 0; i--) {
                                        var rec = store.getAt(i);
                                        if (rec.get('proNumber') > proNumber) {
                                            rec.set('proNumber', rec.get('proNumber') - 1);
                                        }
                                    }
                                    for (var i = cnt - 1; i >= 0; i--) {
                                        var rec = workStore.getAt(i);
                                        if (rec.get('workNumber') > proNumber) {
                                            rec.set('workNumber', rec.get('workNumber') - 1);
                                        }
                                    }
                                }
                            }]
                        }
                    ]
                })
            ]
        });

        var site = '';
        var pcs_group = '';

        var timeStore = Ext.create('Ext.data.Store', {
            fields: ['time', 'view'],
            data: [
                { "time": "00:00", "view": "00:00" },
                { "time": "01:00", "view": "01:00" },
                { "time": "02:00", "view": "02:00" },
                { "time": "03:00", "view": "03:00" },
                { "time": "04:00", "view": "04:00" },
                { "time": "05:00", "view": "05:00" },
                { "time": "06:00", "view": "06:00" },
                { "time": "07:00", "view": "07:00" },
                { "time": "08:00", "view": "08:00" },
                { "time": "09:00", "view": "09:00" },
                { "time": "10:00", "view": "10:00" },
                { "time": "11:00", "view": "11:00" },
                { "time": "12:00", "view": "12:00" },
                { "time": "13:00", "view": "13:00" },
                { "time": "14:00", "view": "14:00" },
                { "time": "15:00", "view": "15:00" },
                { "time": "16:00", "view": "16:00" },
                { "time": "17:00", "view": "17:00" },
                { "time": "18:00", "view": "18:00" },
                { "time": "19:00", "view": "19:00" },
                { "time": "20:00", "view": "20:00" },
                { "time": "21:00", "view": "21:00" },
                { "time": "22:00", "view": "22:00" },
                { "time": "23:00", "view": "23:00" },
            ]
        });

        var workGrid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('packageWorkGridOrder'),
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '69%',
            autoScroll: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            margin: '10 0 0 40',
            autoHeight: true,
            frame: false,
            title: '작업반',
            border: false,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false
            },
            columns: [
                {
                    text: 'NO',
                    width: '15%',
                    dataIndex: 'workNumber',
                    style: 'text-align:center',
                    valueField: 'no',
                    align: 'center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: false
                },
                {
                    text: '라인',
                    width: '60%',
                    dataIndex: 'workGroup',
                    style: 'text-align:center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: false,
                    editor: {
                        xtype: 'combo',
                        store: Ext.create('Mplm.store.MachineStore', {}),
                        displayField: 'site_name',
                        valueField: 'name_ko',
                        editable: false,
                        listeners: {
                            expand: function () {
                                var store = gu.getCmp('packageWorkGridOrder').getStore();
                                var record = gu.getCmp('packageWorkGridOrder').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var selection = gm.me().gridContractMaterial.getSelectionModel().getSelection();
                                var rec = selection[0];
                                console_logs('rec >>>>', rec);
                                this.store.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');

                                this.store.getProxy().setExtraParam('pcs_code', rec.get('product_group'));

                                delete this.store.getProxy().getExtraParams()['parameter_name'];
                                this.store.getProxy().setExtraParam('reserved_varchar3', 'PKG');
                                this.store.load();
                            },
                            select: function (combo, rec) {
                                // 이 부분에 CAPA와 시작예정일을 산출해야 함
                                var store = gu.getCmp('packageWorkGridOrder').getStore();
                                var record = gu.getCmp('packageWorkGridOrder').getSelectionModel().getSelected().items[0];
                                // var twoGrid = gm.me().twoGrid.getSelectionModel().getSelection()[0];
                                site = rec.get('reserved_varchar2');
                                pcs_group = rec.get('pcs_code');

                                // 시작예정일과 종료일 산출
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=getCalcStartPlanBIOT',
                                    params: {
                                        line_code: rec.get('mchn_code')
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        var result_split = result.split("|", 2);
                                        var date = '';
                                        var time = '';

                                        var date_e = '';
                                        var time_e = '';
                                        if (result.length > 0) {
                                            console_logs('result ????', result);
                                            console_logs('date >>>>', result_split[0]);
                                            date = result_split[0];
                                            console_logs('time >>>>', result_split[1]);
                                            time = result_split[1];
                                            store.getAt(index).set('startDate', date);
                                            store.getAt(index).set('start_time', /**date + ' ' + **/time);
                                        } else {
                                            Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                        }
                                        var selectionRec = gm.me().gridContractMaterial.getSelectionModel().getSelection();
                                        var recOther = selectionRec[0];
                                        var unit = gu.getCmp('packageUnitGridOrder').getStore().getAt(record.get('workNumber') - 1);

                                        console_logs('recOther', recOther);
                                        console_logs('bm_quan >>>>', recOther.get('pr_quan'));
                                        console_logs('start_date >>>>', result);
                                        console_logs('mchn_code', rec.get('mchn_code'));
                                        console_logs('item_code', recOther.get('item_code'));

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                            waitMsg: '데이터를 처리중입니다.',
                                            params: {
                                                item_code: recOther.get('item_code'),
                                                line_code: rec.get('mchn_code'),
                                                bm_quan: unit.get('proQuan'),
                                                start_date: date
                                            },
                                            success: function (result, request) {
                                                var result = result.responseText;
                                                console_logs('end_time_full >>>>', result);
                                                var result_split_e = result.split("|", 2);
                                                var date_e = result_split_e[0];
                                                var time_e = result_split_e[1];
                                                console_logs('end_time >>>>', time_e);
                                                if (result.length > 0) {
                                                    store.getAt(index).set('endDate', date_e);
                                                    store.getAt(index).set('end_time', /**date_e + ' ' + **/time_e);
                                                } else {
                                                    Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                }

                                            },//endofsuccess
                                            failure: function (result, request) {
                                                var result = result.responseText;
                                                Ext.MessageBox.alert('알림', result);
                                            }
                                        });
                                    },//endofsuccess
                                    failure: function (result, request) {
                                        var result = result.responseText;
                                        Ext.MessageBox.alert('알림', result);
                                    }
                                });

                                // CAPA 산출
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=getWorkCapa',
                                    params: {
                                        mchn_uid: rec.get('unique_id'),
                                        srcahd_uid: selection.get('srcahd_uid')
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        if (result.length > 0) {
                                            console_logs('capa ????', result);
                                            if (result === 'N') {
                                                store.getAt(index).set('workCapa', rec.get('target_qty'));
                                            } else {
                                                store.getAt(index).set('workCapa', Number(result));
                                            }
                                        }
                                    },//endofsuccess
                                    failure: function (result, request) {
                                        var result = result.responseText;
                                        Ext.MessageBox.alert('알림', result);
                                    }
                                });

                                var index = store.indexOf(record);
                                store.getAt(index).set('name_ko', rec.get('name_ko'));
                                store.getAt(index).set('pcsmchn_uid', rec.get('unique_id_long'));
                                // store.getAt(index).set('workCapa', rec.get('target_qty')); // Capa 산출
                                store.getAt(index).set('mchn_code', rec.get('mchn_code'));
                                store.getAt(index).set('work_site', site);
                            }
                        }
                    }
                },
                {
                    text: 'CAPA',
                    width: '40%',
                    id: gu.id('workCapa'),
                    xtype: 'numbercolumn',
                    dataIndex: 'workCapa',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true
                },
                {
                    text: '시작예정일',
                    width: '40%',
                    dataIndex: 'startDate',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                    editor: {
                        xtype: 'datefield',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
                        format: 'Y-m-d',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                        listeners: {
                            select: function (me) {
                                var store = gu.getCmp('packageWorkGridOrder').getStore();
                                var record = gu.getCmp('packageWorkGridOrder').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var unitStore = gu.getCmp('packageUnitGridOrder').getStore().getAt(record.get('workNumber') - 1);
                                console_logs('unitStore ???', unitStore);
                                var selectionRec = gm.me().gridContractMaterial.getSelectionModel().getSelection();
                                var recOther = selectionRec[0];
                                if (record.get('mchn_code') !== null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                        waitMsg: '데이터를 처리중입니다.',
                                        params: {
                                            item_code: recOther.get('item_code'),
                                            line_code: record.get('mchn_code'),
                                            bm_quan: unitStore.get('proQuan'),
                                            start_date: me.getSubmitValue()
                                        },
                                        success: function (result, request) {
                                            var result = result.responseText;
                                            if (result.length > 0) {
                                                var result_split_e = result.split('|', 2);
                                                var date_e = result_split_e[0];
                                                var time_e = result_split_e[1];
                                                if (result.length > 0) {
                                                    store.getAt(index).set('endDate', date_e);
                                                    store.getAt(index).set('end_time', /**date_e + ' ' + **/time_e);
                                                } else {
                                                    store.getAt(index).set('end_time', me.getSubmitValue());
                                                }
                                            } else {
                                                store.getAt(index).set('endDate', me.getSubmitValue());
                                            }
                                        },//endofsuccess
                                        failure: function (result, request) {
                                            var result = result.responseText;
                                            Ext.MessageBox.alert('알림', result);
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림', '완료예정일을 계산하기 위한 값이 부적절하거나 정확히 입력되지 않았습니다.')
                                    store.removeAt(store.indexOf(record));
                                }
                            }
                        }
                    },
                },
                {
                    text: '시작시간',
                    width: '40%',
                    // xtype: 'datecolumn',
                    // format: 'H:i',
                    dataIndex: 'start_time',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    editor: {
                        xtype: 'combo',
                        store: timeStore,
                        displayField: 'view',
                        valueField: 'time',
                        // format: 'H:i',
                        // increment: 60,
                        anchor: '50%',
                        // value: gm.me().getThirtyMinites(new Date()),
                        // increment: 60,
                        // anchor: '50%',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                // gm.me().setRefDate();
                            }
                        }
                    }
                },
                {
                    text: '완료예정일',
                    width: '40%',
                    dataIndex: 'endDate',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                    listeners: {

                    }
                },
                {
                    text: '완료시간',
                    width: '40%',
                    // xtype: 'datecolumn',
                    // format: 'H:i',
                    dataIndex: 'end_time',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    editor: {
                        xtype: 'combo',
                        store: timeStore,
                        displayField: 'view',
                        valueField: 'time',
                        // format: 'H:i',
                        // increment: 60,
                        anchor: '50%',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                // gm.me().setRefDate();
                            }
                        }
                    }
                },
            ],
            listeners: {

            },
            autoScroll: true
        });

        var formOrder = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            width: myWidth,
            height: myHeight - 10,
            items: [
                {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        width: '47%',
                        padding: '3 3 3 20'
                    },
                    border: true,
                    layout: 'column',
                    items: [
                        {
                            fieldLabel: '품번',
                            xtype: 'textfield',
                            name: 'line_item_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('item_code'),
                            editable: false,
                            value: selection.get('item_code')
                        },
                        {
                            fieldLabel: '품명',
                            xtype: 'textfield',
                            name: 'line_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('line_code'),
                            editable: false,
                            value: selection.get('item_name')
                        }
                    ]
                },
                {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        width: '47%',
                        padding: '3 3 3 20'
                    },
                    border: true,
                    layout: 'column',
                    items: [
                        {
                            xtype: 'numberfield',
                            name: 'bm_quan_disp',
                            id: gu.id('bm_quan_order'),
                            value: selection.get('pr_quan'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '작업요청량',
                            hideTrigger: false,
                            // fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            editable: false,
                            listeners: {
                                change: function () {
                                    // gu.getCmp('capaValue').setValue(gu.getCmp('bm_quan').getValue());
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            id: gu.id('capaValueOrder'),
                            name: 'capaValue',
                            // value : selection.get('pr_quan'),
                            fieldLabel: '총 수량',
                            hideTrigger: true,
                            fieldStyle: 'background-color: #ddd; background-image: none;font-align:right',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            allowBlank: false,
                            editable: false
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '99%',
                    margin: '3 3 3 3',
                    items: [
                        prodUnitGrid,
                        workGrid
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: gm.getMC('CMD_Repackaging_Order', '재포장계획수립'),
            width: myWidth,
            height: myHeight,
            items: formOrder,
            buttons: [
                {
                    text: '확인',
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            // if (formOrder.isValid()) {
                            // 생산단위 JSON 
                            var siteArr = [];
                            var mchnCodeArr = [];
                            var startDateArr = [];
                            var storeData1 = gu.getCmp('packageUnitGridOrder').getStore();
                            var objs = [];
                            var columns = [];
                            var obj = {};
                            for (var i = 0; i < storeData1.data.items.length; i++) {
                                var item = storeData1.data.items[i];
                                var objv = {};
                                objv['proNumber'] = item.get('proNumber');
                                objv['proQuan'] = item.get('proQuan');
                                columns.push(objv);
                            }

                            obj['units'] = columns;
                            objs.push(obj);
                            var jsonData1 = Ext.util.JSON.encode(objs);

                            // 작업반 JSON
                            var storeData2 = gu.getCmp('packageWorkGridOrder').getStore();
                            var objs1 = [];
                            var columns1 = [];
                            var obj1 = {};
                            for (var i = 0; i < storeData2.data.items.length; i++) {
                                var item = storeData2.data.items[i];
                                var objv1 = {};
                                objv1['workNumber'] = item.get('workNumber');
                                objv1['workGroup'] = item.get('workGroup');
                                objv1['workCapa'] = item.get('workCapa');
                                objv1['startDate'] = item.get('startDate');
                                objv1['startTime'] = item.get('start_time');
                                objv1['endDate'] = item.get('endDate');
                                objv1['endTime'] = item.get('end_time');
                                objv1['pcsmchn_uid'] = item.get('pcsmchn_uid');
                                columns1.push(objv1);
                                siteArr.push(item.get('work_site'));
                                mchnCodeArr.push(item.get('mchn_code'));
                                startDateArr.push(item.get('startDate'));
                            }

                            obj1['plan'] = columns1;
                            objs1.push(obj1);
                            var jsonData2 = Ext.util.JSON.encode(objs1);
                            console_logs('jsonData2', jsonData2);
                            console_logs('json1.length...', jsonData1.lenth);
                            console_logs('json2.length...', jsonData2.lenth);
                            if (jsonData1 != null && jsonData2 != null) {
                                gm.me().loding_msg();
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=addAssemblyPackageManualOrder',
                                    waitMsg: '데이터를 처리중입니다.',
                                    params: {
                                        bm_quan: gu.getCmp('bm_quan_order').getValue(),
                                        prd_group: selection.get('product_group'),
                                        assymap_uid: selection.get('assymap_uid'),
                                        project_uid: selection.get('ac_uid'),
                                        srcahd_uid: selection.get('srcahd_uid'),
                                        item_code: selection.get('item_code'),
                                        jsonData1: jsonData1,
                                        jsonData2: jsonData2,
                                        pcs_group: pcs_group,
                                        siteArr: siteArr,
                                        mchnCodeArr: mchnCodeArr,
                                        project_code: twoGridSelection.get('pj_code'),
                                        pl_no: twoGridSelection.get('pl_no'),
                                        final_buyer_uid: twoGridSelection.get('reserved_number3'),
                                        startDateArr: startDateArr
                                    },
                                    success: function (result, request) {
                                        console_logs('OK', 'PROCESS OK');
                                        if (prWin) {
                                            Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                            prWin.close();
                                            gm.me().store.load();
                                            gm.me().salesPriceByCompanyListStore.load();
                                        }
                                    },//endofsuccess
                                    failure: function (result, request) {
                                        // console_logs('결과 ???', action);
                                        prWin.setLoading(false);
                                        Ext.MessageBox.alert('에러', '데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.')
                                        // extjsUtil.failureMessage();
                                        if (prWin) {
                                            // Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                            prWin.close();
                                            gm.me().store.load();
                                        }
                                    }
                                });
                            }
                        }
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        Ext.MessageBox.alert(
                            '알림',
                            '취소 할 시 입력한 모든정보가 저장되지 않습니다.<br>그래도 취소하시겠습니까?',
                            function () {
                                console_logs('취소', '취소');
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        )
                    }
                }
            ]
        });

        gm.me().addPackageUnitFirstOrder();

        prWin.show();
    },


    packagePlanOp: function () {
        var selection = this.grid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);
        var myWidth = 500;
        var myHeight = 400;
        var isCalc = false;
        var prodUnitGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: new Ext.data.Store(),
            id: gu.id('packageUnitGrid'),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '30%',
            autoScroll: true,
            title: '포장단위',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            margin: '10 0 0 0',
            autoHeight: true,
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false
            },
            columns: [
                {
                    text: 'NO',
                    width: '15%',
                    dataIndex: 'proNumber',
                    style: 'text-align:center',
                    valueField: 'no',
                    align: 'center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '작업수량',
                    width: '40%',
                    xtype: 'numbercolumn',
                    dataIndex: 'proQuan',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    editor: {
                        xtype: 'numberfield',
                    }
                }
            ],
            listeners: {
                edit: function (editor, e, eOpts) {
                    var store = gu.getCmp('packageUnitGrid').getStore();
                    var previous_store = store.data.items;
                    var total_quan = 0;
                    console_logs('All Store Contents ??? ', previous_store);
                    for (var j = 0; j < previous_store.length; j++) {
                        var item = previous_store[j];
                        total_quan = Number(total_quan) + Number(item.get('proQuan'));
                    }
                    if (gu.getCmp('bm_quan').getValue() < total_quan) {
                        Ext.MessageBox.alert('', '작업수량은 작업요청량을 초과할 수 없습니다.');
                        for (var k = 0; k < previous_store.length; k++) {
                            secondRecord = gu.getCmp('packageUnitGrid').getStore().getAt(k);
                            secondRecord.set('proQuan', '');
                        }
                        return;
                    } else {
                        isCalc = true;
                    }
                }
            },
            autoScroll: true,
            dockedItems: [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        '->',
                        {
                            text: '추가',
                            listeners: [{
                                click: function () {
                                    console_logs('bm_quan >>>', gu.getCmp('bm_quan').getValue());
                                    if (gu.getCmp('bm_quan').getValue() === null || gu.getCmp('bm_quan').getValue() === 0) {
                                        Ext.MessageBox.alert('알림', '작업요청량을 입력해주시기 바랍니다.')
                                        return;
                                    } else {
                                        gm.me().addPackageUnit();
                                    }
                                }
                            }]
                        },
                        {
                            text: gm.getMC('CMD_DELETE', '삭제'),
                            listeners: [{
                                click: function () {
                                    var record = gu.getCmp('packageUnitGrid').getSelectionModel().getSelected().items[0];
                                    var store = gu.getCmp('packageUnitGrid').getStore();
                                    var workStore = gu.getCmp('packageWorkGrid').getStore();
                                    var proNumber = record.get('proNumber');
                                    var cnt = workStore.getCount();
                                    for (var i = cnt - 1; i >= 0; i--) {
                                        var rec = workStore.getAt(i);
                                        if (rec.get('workNumber') === proNumber) {
                                            workStore.removeAt(workStore.indexOf(rec));
                                        }
                                    }
                                    if (record == null) {
                                        store.remove(store.last());
                                    } else {
                                        store.removeAt(store.indexOf(record));
                                    }
                                    cnt = workStore.getCount();
                                    var cnt2 = store.getCount();
                                    for (var i = cnt2 - 1; i >= 0; i--) {
                                        var rec = store.getAt(i);
                                        if (rec.get('proNumber') > proNumber) {
                                            rec.set('proNumber', rec.get('proNumber') - 1);
                                        }
                                    }
                                    for (var i = cnt - 1; i >= 0; i--) {
                                        var rec = workStore.getAt(i);
                                        if (rec.get('workNumber') > proNumber) {
                                            rec.set('workNumber', rec.get('workNumber') - 1);
                                        }
                                    }
                                }
                            }]
                        }
                    ]
                })
            ]
        });

        var site = '';
        var pcs_group = '';

        var timeStore = Ext.create('Ext.data.Store', {
            fields: ['time', 'view'],
            data: [
                { "time": "00:00", "view": "00:00" },
                { "time": "01:00", "view": "01:00" },
                { "time": "02:00", "view": "02:00" },
                { "time": "03:00", "view": "03:00" },
                { "time": "04:00", "view": "04:00" },
                { "time": "05:00", "view": "05:00" },
                { "time": "06:00", "view": "06:00" },
                { "time": "07:00", "view": "07:00" },
                { "time": "08:00", "view": "08:00" },
                { "time": "09:00", "view": "09:00" },
                { "time": "10:00", "view": "10:00" },
                { "time": "11:00", "view": "11:00" },
                { "time": "12:00", "view": "12:00" },
                { "time": "13:00", "view": "13:00" },
                { "time": "14:00", "view": "14:00" },
                { "time": "15:00", "view": "15:00" },
                { "time": "16:00", "view": "16:00" },
                { "time": "17:00", "view": "17:00" },
                { "time": "18:00", "view": "18:00" },
                { "time": "19:00", "view": "19:00" },
                { "time": "20:00", "view": "20:00" },
                { "time": "21:00", "view": "21:00" },
                { "time": "22:00", "view": "22:00" },
                { "time": "23:00", "view": "23:00" },
            ]
        });


        var workGrid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('packageWorkGrid'),
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '69%',
            autoScroll: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
            },
            margin: '10 0 0 40',
            autoHeight: true,
            frame: false,
            title: '작업반',
            border: false,
            layout: 'fit',
            forceFit: true,
            viewConfig: {
                markDirty: false
            },
            columns: [
                {
                    text: 'NO',
                    width: '15%',
                    dataIndex: 'workNumber',
                    style: 'text-align:center',
                    valueField: 'no',
                    align: 'center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: false
                },
                {
                    text: '라인',
                    width: '60%',
                    dataIndex: 'workGroup',
                    style: 'text-align:center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: false,
                    editor: {
                        xtype: 'combo',
                        store: Ext.create('Mplm.store.MachineStore', {}),
                        displayField: 'site_name',
                        valueField: 'name_ko',
                        editable: false,
                        listeners: {
                            expand: function () {
                                var store = gu.getCmp('packageWorkGrid').getStore();
                                var record = gu.getCmp('packageWorkGrid').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var selection = gm.me().grid.getSelectionModel().getSelection();
                                var rec = selection[0];
                                console_logs('rec >>>>', rec);
                                this.store.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');
                                this.store.getProxy().setExtraParam('pcs_code', rec.get('product_group'));
                                delete this.store.getProxy().getExtraParams()['parameter_name'];
                                this.store.getProxy().setExtraParam('reserved_varchar3', 'PKG');
                                this.store.load();
                            },
                            select: function (combo, rec) {
                                // 이 부분에 CAPA와 시작예정일을 산출해야 함
                                var store = gu.getCmp('packageWorkGrid').getStore();
                                var record = gu.getCmp('packageWorkGrid').getSelectionModel().getSelected().items[0];
                                site = rec.get('reserved_varchar2');
                                pcs_group = rec.get('pcs_code');
                                // 시작예정일과 종료일 산출
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=getCalcStartPlanBIOT',
                                    params: {
                                        line_code: rec.get('mchn_code')
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        var result_split = result.split("|", 2);
                                        var date = '';
                                        var time = '';

                                        var date_e = '';
                                        var time_e = '';
                                        if (result.length > 0) {
                                            console_logs('result ????', result);
                                            console_logs('date >>>>', result_split[0]);
                                            date = result_split[0];
                                            console_logs('time >>>>', result_split[1]);
                                            time = result_split[1];
                                            store.getAt(index).set('startDate', date);
                                            store.getAt(index).set('start_time', /**date + ' ' + **/time);
                                        } else {
                                            Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                        }
                                        var selectionRec = gm.me().grid.getSelectionModel().getSelection();
                                        var recOther = selectionRec[0];
                                        var unit = gu.getCmp('packageUnitGrid').getStore().getAt(record.get('workNumber') - 1);

                                        console_logs('recOther', recOther);
                                        console_logs('bm_quan >>>>', recOther.get('unit_mass'));
                                        console_logs('start_date >>>>', result);
                                        console_logs('mchn_code', rec.get('mchn_code'));
                                        console_logs('item_code', selection.get('item_code'));

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                            waitMsg: '데이터를 처리중입니다.',
                                            params: {
                                                item_code: selection.get('item_code'),
                                                line_code: rec.get('mchn_code'),
                                                bm_quan: unit.get('proQuan'),
                                                start_date: date
                                            },
                                            success: function (result, request) {
                                                var result = result.responseText;
                                                console_logs('end_time_full >>>>', result);
                                                var result_split_e = result.split("|", 2);
                                                var date_e = result_split_e[0];
                                                var time_e = result_split_e[1];
                                                console_logs('end_time >>>>', time_e);
                                                if (result.length > 0) {
                                                    store.getAt(index).set('endDate', date_e);
                                                    store.getAt(index).set('end_time', /**date_e + ' ' + **/time_e);
                                                } else {
                                                    Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                }

                                            },//endofsuccess
                                            failure: function (result, request) {
                                                var result = result.responseText;
                                                Ext.MessageBox.alert('알림', result);
                                            }
                                        });
                                    },//endofsuccess
                                    failure: function (result, request) {
                                        var result = result.responseText;
                                        Ext.MessageBox.alert('알림', result);
                                    }
                                });

                                // CAPA 산출
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=getWorkCapa',
                                    params: {
                                        mchn_uid: rec.get('unique_id'),
                                        srcahd_uid: selection.get('unique_id_long')
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        if (result.length > 0) {
                                            console_logs('capa ????', result);
                                            if (result === 'N') {
                                                store.getAt(index).set('workCapa', rec.get('target_qty'));
                                            } else {
                                                store.getAt(index).set('workCapa', Number(result));
                                            }
                                        }
                                    },//endofsuccess
                                    failure: function (result, request) {
                                        var result = result.responseText;
                                        Ext.MessageBox.alert('알림', result);
                                    }
                                });

                                var index = store.indexOf(record);
                                store.getAt(index).set('name_ko', rec.get('name_ko'));
                                store.getAt(index).set('pcsmchn_uid', rec.get('unique_id_long'));
                                store.getAt(index).set('mchn_code', rec.get('mchn_code'));
                                store.getAt(index).set('work_site', site);
                            }
                        }
                    }
                },
                {
                    text: 'CAPA',
                    width: '40%',
                    id: gu.id('workCapa'),
                    xtype: 'numbercolumn',
                    dataIndex: 'workCapa',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true
                },
                {
                    text: '시작예정일',
                    width: '40%',
                    dataIndex: 'startDate',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                    editor: {
                        xtype: 'datefield',
                        submitFormat: 'Y-m-d',
                        dateFormat: 'Y-m-d',
                        format: 'Y-m-d',
                        renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                        listeners: {
                            select: function (me) {
                                var store = gu.getCmp('packageWorkGrid').getStore();
                                var record = gu.getCmp('packageWorkGrid').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var unitStore = gu.getCmp('packageUnitGrid').getStore().getAt(record.get('workNumber') - 1);
                                console_logs('unitStore ???', unitStore);
                                var selectionRec = gm.me().grid.getSelectionModel().getSelection();
                                var recOther = selectionRec[0];
                                if (record.get('mchn_code') !== null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                        waitMsg: '데이터를 처리중입니다.',
                                        params: {
                                            item_code: recOther.get('item_code'),
                                            line_code: record.get('mchn_code'),
                                            bm_quan: unitStore.get('proQuan'),
                                            start_date: me.getSubmitValue()
                                        },
                                        success: function (result, request) {
                                            var result = result.responseText;
                                            if (result.length > 0) {
                                                var result_split_e = result.split('|', 2);
                                                var date_e = result_split_e[0];
                                                var time_e = result_split_e[1];
                                                if (result.length > 0) {
                                                    store.getAt(index).set('endDate', date_e);
                                                    store.getAt(index).set('end_time', /**date_e + ' ' + **/time_e);
                                                } else {
                                                    store.getAt(index).set('end_time', me.getSubmitValue());
                                                }
                                            } else {
                                                store.getAt(index).set('endDate', me.getSubmitValue());
                                            }
                                        },//endofsuccess
                                        failure: function (result, request) {
                                            var result = result.responseText;
                                            Ext.MessageBox.alert('알림', result);
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림', '완료예정일을 계산하기 위한 값이 부적절하거나 정확히 입력되지 않았습니다.')
                                    store.removeAt(store.indexOf(record));
                                }
                            }
                        }
                    },
                },
                {
                    text: '시작시간',
                    width: '40%',
                    dataIndex: 'start_time',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    editor: {
                        xtype: 'combo',
                        store: timeStore,
                        displayField: 'view',
                        valueField: 'time',
                        anchor: '50%',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                            }
                        }
                    }
                },
                {
                    text: '완료예정일',
                    width: '40%',
                    dataIndex: 'endDate',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                    listeners: {

                    }
                },
                {
                    text: '완료시간',
                    width: '40%',
                    dataIndex: 'end_time',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    editor: {
                        xtype: 'combo',
                        store: timeStore,
                        displayField: 'view',
                        valueField: 'time',
                        format: 'H:i',
                        increment: 60,
                        anchor: '50%',
                        increment: 60,
                        anchor: '50%',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                            }
                        }
                    }
                },
            ],
            listeners: {

            },
            autoScroll: true
        });

        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            width: myWidth,
            height: myHeight - 10,
            items: [
                {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        width: '47%',
                        padding: '3 3 3 20'
                    },
                    border: true,
                    layout: 'column',
                    items: [
                        {
                            fieldLabel: '품번',
                            xtype: 'textfield',
                            name: 'line_item_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('item_code'),
                            editable: false,
                            value: selection.get('item_code')
                        },
                        {
                            fieldLabel: '품명',
                            xtype: 'textfield',
                            name: 'line_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('line_code'),
                            editable: false,
                            value: selection.get('item_name')
                        }
                    ]
                },
                {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        width: '47%',
                        padding: '3 3 3 20'
                    },
                    border: true,
                    layout: 'column',
                    items: [
                        {
                            xtype: 'numberfield',
                            name: 'bm_quan_disp',
                            id: gu.id('bm_quan'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '작업요청량',
                            hideTrigger: false,
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {
                                change: function () {
                                    var store = gu.getCmp('packageUnitGrid').getStore();
                                    store.getAt(0).set('proQuan', gu.getCmp('bm_quan').getValue());
                                    // gu.getCmp('capaValue').setValue(gu.getCmp('bm_quan').getValue());
                                }
                            }
                        },
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '99%',
                    margin: '3 3 3 3',
                    items: [
                        prodUnitGrid,
                        workGrid
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: gm.getMC('CMD_Repackaging_Order', '재포장계획수립'),
            width: myWidth,
            height: myHeight,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                // 생산단위 JSON 
                                if (jsonData1 != null && jsonData2 != null) {
                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/index/process.do?method=addAssemblyPackageManual',
                                        waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                        params: {
                                            bm_quan: gu.getCmp('bm_quan').getValue(),
                                            prd_group: selection.get('product_group'),
                                            assymap_uid: selection.get('assymap_uid'),
                                            srcahd_uid: selection.get('unique_id_long'),
                                            item_code: selection.get('item_code'),
                                            jsonData1: jsonData1,
                                            jsonData2: jsonData2,
                                            pcs_group: pcs_group,
                                            siteArr: siteArr,
                                            mchnCodeArr: mchnCodeArr,
                                            startDateArr: startDateArr
                                        },
                                        success: function (val, action) {
                                            console_logs('OK', 'PROCESS OK');
                                            if (prWin) {
                                                Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                                prWin.close();
                                                gm.me().store.load();
                                            }
                                        },
                                        failure: function () {
                                            // console_logs('결과 ???', action);
                                            prWin.setLoading(false);
                                            Ext.MessageBox.alert('에러', '데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.')
                                            // extjsUtil.failureMessage();
                                            if (prWin) {
                                                // Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                                prWin.close();
                                                gm.me().store.load();
                                            }
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.alert('', '생산수량 또는 작업반이 정확히 입력되지 않았습니다.')
                                }
                            }
                        }
                    }
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        Ext.MessageBox.alert(
                            '알림',
                            '취소 할 시 입력한 모든정보가 저장되지 않습니다.<br>그래도 취소하시겠습니까?',
                            function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        )
                    }
                }
            ]
        });
        // gm.me().addProUnitPackageFirstOrder();
        prWin.show();
    },

    renderNumber: function (value, p, record) {
        var isNumber = true;
        if (value == null) {
            value = 0;
        }
        for (var i = 0; i < value.length; i++) {
            var charValue = value.charCodeAt(i);
            if (charValue < 48 || charValue > 57) {
                isNumber = false;
            }
        }

        if (typeof value == 'number' || isNumber) {
            return Ext.util.Format.number(value, '0,00/i');
        } else {
            return value;
        }
    },
    loding_msg: function () {
        Ext.MessageBox.wait('데이터를 처리중입니다.<br>잠시만 기다려주세요.', '알림');
    },
    stop_msg: function () {
        Ext.MessageBox.hide();
    },

    searchStore: Ext.create('Rfx2.store.company.kbtech.MaterialStore', {}),
    productStore: Ext.create('Rfx2.store.company.sejun.ProductListStore', {}),
    deptStore: Ext.create('Rfx2.store.company.sejun.DeptNameStore', {}),
    productPlanStore: Ext.create('Rfx2.store.company.sejun.ProductChangeHistoryStore', { pageSize: 100000 })
});