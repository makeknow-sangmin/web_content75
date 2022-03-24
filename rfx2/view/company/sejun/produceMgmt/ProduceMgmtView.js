
Ext.define('Rfx2.view.company.sejun.produceMgmt.ProduceMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produce-mgmt-view',
    initComponent: function() {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();

        var RecevedStateStore = Ext.create('Mplm.store.RecevedStateStore', {});
        RecevedStateStore.load();
        searchToolbar.insert(0, {
            xtype: 'combo'
            ,field_id: 'status'
            ,width:120
            ,store: RecevedStateStore
            ,displayField: 'codeName'
            ,valueField: 'systemCode'
            ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            ,anchor: '100%'
            ,value:'BR'
            ,listeners: {
                select: function(combo, record) {
                    var selected = combo.getValue();
                    gm.me().store.getProxy().setExtraParam('status', selected);
                    this.store.reload();
                }
            }
        })

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        // this.groupField = 'pj_name';
        // 신규 스토어
        this.createStore('Rfx2.model.ProduceMgmt', [{
                property: 'pj_code',
                direction: 'DESC'
            }],
            /*pageSize*/
            gMain.pageSize
            ,{}
            , ['cartmap']
        );

        //this.store.getProxy().setExtraParam('pcr_div', 'MAKE');
        this.store.getProxy().setExtraParam('status', 'CR');
        this.store.getProxy().setExtraParam('orderBy', "pj_code");
        this.store.getProxy().setExtraParam('ascDesc', "DESC");

        //모델을 통한 스토어 생성
        // this.createStore('Rfx2.model.ProduceMgmt', [{
        //         property: 'create_date',
        //         direction: 'ASC'
        //     }],
        //     /*pageSize*/
        //     gMain.pageSize
        //     ,{}
        //     , ['cartmap']
        // );

        this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            handler: function() {
                gm.me().producePlanOp();
            }
        });

        this.assySearchAction = Ext.create('Ext.Action', {
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            tooltip: 'Assembly 검색',
            handler: function() {
                var select_item = gm.me().grid.getSelectionModel().getSelection()[0];
                if(select_item == null || select_item.length<1) {
                    Ext.MessageBox.alert('알림', '수주 대상을 선택해주세요.');
                    return;
                }
                var child = select_item.get('unique_id_long');
                var pjuid = select_item.get('ac_uid');
                var parent_uid = select_item.get('parent_uid');
                gm.me().cloudAsStore.getProxy().setExtraParam('child', child);
                gm.me().cloudAsStore.getProxy().setExtraParam('parent_uid', parent_uid);
                gm.me().cloudAsStore.getProxy().setExtraParam('pjuid', pjuid);
                gm.me().cloudAsStore.getProxy().setExtraParam('multi_prd', true);
                gm.me().cloudAsStore.load({
                    callback: function() {
                        if (gm.me().assyGrid != null) {
                            gm.me().assyGrid.expandAll();
                        }
                    }
                });
            }
        });

        this.prExcelAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            text: '엑셀생산계획표',
            tooltip: '엑셀생산계획표',
            disabled: true,
            handler: function() {

            }
        });

        this.requestPur = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '구매요청',
            tooltip: '선택된 자재를 구매요청 합니다.',
            disabled: true,
            handler: function() {
                // gm.me().producePlanOp();
            }
        });

        this.requestAllocate = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '할당요청',
            tooltip: '선택된 자재를 할당요청 합니다',
            disabled: true,
            handler: function() {
                // gm.me().producePlanOp();
            }
        });

        // buttonToolbar.insert(1, this.prEstablishAction);

        //그리드 생성
        Ext.each(this.columns, function(columnObj, index) {

            var o = columnObj;

            var dataIndex = o['dataIndex'];

            switch(dataIndex) {
                case 'top_status':
                    o['renderer'] = function(value, meta, record) {
                        var route_type = null;
                        if(record != null && record.length>0) {
                            route_type = record.get('route_type');
                        }
                        return gm.me().getAssyStatus(value, meta, route_type);
                    }
                    break;
            }

            if(o['dataType'] === 'number') {
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
                o['renderer'] = function(a,b,c,d,e,f,g) {
                    console_logs('>>>>a', a);console_logs('>>>>b', b);
                    console_logs('>>>>c', c);console_logs('>>>>d', d);
                    console_logs('>>>>e', e);console_logs('>>>>f', f);
                    console_logs('>>>>g', g);console_logs('>>>>a', a);
                }
            }

        });

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
            // id: 'group',
            // ftype: 'groupingsummary',
            /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
            groupHeaderTpl: '<font color=#003471>{name}</font>'
        });

        var option = {
            features: [groupingFeature],
            listeners: {
                itemdblclick: this.tabchangeFn
            }
        };

        // var option = {
        //     features: [{
        //         ftype: 'summary',
        //         dock: 'top'
        //     }]
        // };

        //그리드 생성
        this.createGrid(searchToolbar, buttonToolbar, option);

        this.store.group('pj_name');

        // this.createTabGrid(searchToolbar, buttonToolbar, option);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest()]
            // items: [this.createWest(), this.createCenter(), this.createEast()]
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        // this.store.group('pj_name');
        this.store.load(function(records) {});

    },

    tabchangeFn: function() {
        var tab = Ext.getCmp("totalTab");
        tab.setActiveTab(Ext.getCmp("detailSecond"));
        // tab.setLoading(false);
    },

    createWest: function() {
        this.grid.setTitle('수주목록');
        // this.grid.addListener('itemdblclick', this.tabchangeFn());

        this.west = Ext.widget('tabpanel', {
            id:'totalTab',
            layout: 'border',
            border: true,
            region: 'west',
            width: '100%',
            items: [this.grid, this.createCenter()]
        });
        // this.store.group('pj_name');

        this.grid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length == 1) {
                    var select_item = gm.me().grid.getSelectionModel().getSelection()[0];
                    var child = select_item.get('unique_id_long');
                    var pjuid = select_item.get('ac_uid');
                    var parent_uid = select_item.get('parent_uid');
                    gm.me().cloudAsStore.getProxy().setExtraParam('child', child);
                    gm.me().cloudAsStore.getProxy().setExtraParam('parent_uid', parent_uid);
                    gm.me().cloudAsStore.getProxy().setExtraParam('pjuid', pjuid);
                    gm.me().cloudAsStore.getProxy().setExtraParam('multi_prd', true);
                    gm.me().cloudAsStore.load({
                        callback: function() {
                            if (gm.me().assyGrid != null) {
                                gm.me().assyGrid.expandAll();
                            }
                        }
                    });
                } else {
                    // gm.me().prEstablishAction.disable();
                }
            }
        });

        return this.west;
    },

    /*BOM Tree*/
    createCenter: function () {
        this.cloudAsStore = Ext.create('Rfx2.store.company.dsmf.cloudSubAssemblyTreeStoreDSMF', {});
        // Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a
        // tree.TreePanel
        this.assyGrid = Ext.create('Ext.tree.Panel', {
            id:'treeAssy',
            // title: 'Assembly',
            // collapsible: true,
            useArrows: true,
            rootVisible: false,
            // layout :'border',
            width:'50%',
            region:'center',
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
                    this.assySearchAction,
                    '-',
                    this.prEstablishAction
                ]
            },

                // {
                //     dock: 'top',
                //     xtype: 'toolbar',
                //     cls: 'my-x-toolbar-default1',
                //     items: [
                //         {
                //             width: '33%',
                //             field_id: 'search_item_code',
                //             fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                //             id: gu.id('search_item_code'),
                //             name: 'search_item_code',
                //             xtype: 'triggerfield',
                //             emptyText: '품번',
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             onTrigger1Click: function () {
                //                 this.setValue('');

                //             },
                //             listeners: {
                //                 change: function (fieldObj, e) {
                //                     gu.getCmp('productcombo-DBM7_AST').store.getProxy().setExtraParam('item_code', '%' + e + '%');
                //                 },
                //                 render: function (c) {
                //                     Ext.create('Ext.tip.ToolTip', {
                //                         target: c.getEl(),
                //                         html: c.emptyText
                //                     });
                //                 }
                //             }
                //         },
                //         {
                //             width: '33%',
                //             field_id: 'search_item_name',
                //             fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                //             id: gu.id('search_item_name'),
                //             name: 'search_item_name',
                //             xtype: 'triggerfield',
                //             emptyText: '품명',
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             onTrigger1Click: function () {
                //                 this.setValue('');
                //             },
                //             listeners: {
                //                 change: function (fieldObj, e) {
                //                     gu.getCmp('productcombo-DBM7_AST').store.getProxy().setExtraParam('item_name', '%' + e + '%');
                //                 },
                //                 render: function (c) {
                //                     Ext.create('Ext.tip.ToolTip', {
                //                         target: c.getEl(),
                //                         html: c.emptyText
                //                     });
                //                 }
                //             }
                //         },
                //         {
                //             width: '33%',
                //             field_id: 'search_specification',
                //             fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                //             id: gu.id('search_specification'),
                //             name: 'search_specification',
                //             xtype: 'triggerfield',
                //             emptyText: '규격',
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             onTrigger1Click: function () {
                //                 this.setValue('');
                //             },
                //             listeners: {
                //                 change: function (fieldObj, e) {
                //                     gu.getCmp('productcombo-DBM7_AST').store.getProxy().setExtraParam('specification', '%' + e + '%');
                //                 },
                //                 render: function (c) {
                //                     Ext.create('Ext.tip.ToolTip', {
                //                         target: c.getEl(),
                //                         html: c.emptyText
                //                     });
                //                 }
                //             }
                //         }
                //     ]

                // }, {
                //     dock: 'top',
                //     xtype: 'toolbar',
                //     cls: 'my-x-toolbar-default1',
                //     items: [{
                //         id: gu.id('target-projectcode-DBM7_AST'),
                //         xtype: 'component',
                //         html: "미지정",
                //         width: 90,
                //         style: 'color:white;align:right;'
                //     },
                //         {
                //             id: gu.id('productcombo-DBM7_AST'),
                //             xtype: 'combo',
                //             fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                //             mode: 'local',
                //             editable: true,
                //             // allowBlank: false,
                //             width: '75%',
                //             queryMode: 'remote',
                //             emptyText: '제품을 선택하세요',
                //             displayField: 'item_name',
                //             valueField: 'unique_id',
                //             store: Ext.create('Rfx2.store.company.dsmf.AssyStoreDSMF', {}),
                //             sortInfo: {field: 'specification', direction: 'ASC'},
                //             minChars: 1,
                //             typeAhead: true,
                //             hideLabel: true,
                //             hideTrigger: false,
                //             anchor: '100%',
                //             listConfig: {
                //                 loadingText: '검색중...',
                //                 emptyText: '일치하는 항목이 없습니다',
                //                 // Custom rendering template for each item
                //                 getInnerTpl: function () {
                //                     return '<div data-qtip="{item_code}">[{item_code}] <small><font color=blue>{item_name}/{specification}</font></small></div>';
                //                 }
                //             },
                //             pageSize: 25,
                //             triggerAction: 'all',
                //             listeners: {
                //                 // beforequery: function (queryEvent) {
                //                 //     gu.getCmp('productcombo-DBM7_AST').store.getProxy().setExtraParam('itemCodeOldAndNew',
                //                 //         gu.getCmp('productcombo-DBM7_AST').getValue());
                //                 //     gu.getCmp('productcombo-DBM7_AST').store.getProxy().setExtraParam('query', null);
                //                 // },
                //                 expand: function (field) {
                //                     gu.getCmp('productcombo-DBM7_AST').getStore().load();
                //                 },
                //                 select: function (combo, record) {
                //                     console_log('Selected Value : ' + combo.getValue());
                //                     console_logs('record : ', record);
                //                     gm.me().claastReset(4);
                //                     gm.me().assyTopParent = combo.getValue();
                //                     var srcahd_uid = record.get('unique_id');
                //                     gm.me().selectAssymapCombo(record);
                //                 },
                //                 pageSize: 10
                //             }
                //         }
                //     ]
                // }
            ], // dockedItems of End
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
                    renderer: function(value, meta, record) {
                        var route_type = record.get('route_type');
                        return gm.me().getAssyStatus(value, meta, route_type);
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
                    text: '필요량',
                    dataIndex: 'quan',
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

        this.assyGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                // gm.me().onAssemblyGridSelection(selections);
                if(selections.length>0) {
                    gm.me().prEstablishAction.enable();
                    gm.me().addPartAction.enable();

                    var rec = selections[0];

                    console_logs('>>>???', rec);
                    gm.me().partBomStore.getProxy().setExtraParam('parent', rec.get('child'));
                    gm.me().partBomStore.getProxy().setExtraParam('parent_uid', rec.get('unique_uid'));
                    gm.me().partBomStore.getProxy().setExtraParam('orderBy', "pl_no");
                    gm.me().partBomStore.getProxy().setExtraParam('ascDesc', "ASC");
                    // gm.me().partBomStore.getProxy().setExtraParams({});
                    gm.me().partBomStore.getProxy().setExtraParam('ac_uid', rec.get('ac_uid'));

                    gm.me().partBomStore.load();
                } else {
                    gm.me().prEstablishAction.disable();
                    gm.me().addPartAction.disable();
                }
                // gm.me().assyGrid.setLoading(false);
                // gm.me().assyGrid.expandAll();
            }
        });

        this.assyGrid.on('edit', function(editor, e) {
            var rec = e.record;

            var field = e.field;
            var value = e.value;
            var id = rec.get('child');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/index/process.do?method=setAssyProcess',
                params:{
                    id:id,
                    working_area:value
                },
                success : function(result, request) {
                    rec.set(field, value);
                },
                failure: extjsUtil.failureMessage
            });



        });

        // this.center = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
        //     // {
        //     layout: 'border',
        //     border: true,
        //     region: 'center',
        //     width: '100%',
        //     layoutConfig: {
        //         columns: 2,
        //         rows: 1
        //     },

        //     items: [this.assyGrid]
        // });

        this.second = Ext.create('Ext.panel.Panel', { // Ext.create('Ext.panel.Panel',
            // {
            layout: 'border',
            id:'detailSecond',
            // border: true,
            region: 'center',
            title:'계획수립',
            width: '100%',
            // layoutConfig: {
            //     columns: 2,
            //     rows: 1
            // },

            items: [this.assyGrid, this.createEast()]
        });

        // return this.center;
        return this.second;
    },

    createEast() {
        this.searchPartAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            tooltip: '자재 검색',
            handler: function () {
                gm.me().partBomStore.load();
            }
        });
        this.partBomStore = Ext.create('Rfx2.store.company.dsmf.cloudProducePartLine', {});
        this.partBomGrid = Ext.create('Ext.grid.Panel', {
            //frame: true,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            store: this.partBomStore,
            // layout :'border',
            width:'50%',
            region:'east',
            plugins: Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            // bbar: getPageToolbar(store),
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.searchPartAction, '-', this.addPartAction, '-', this.removePartAction
                ]
            }],
            viewConfig: {
                getRowClass: function(record) {
                    var standard_flag = record.get('standard_flag');
                    switch(standard_flag) {
                        case 'A':
                            return 'blue-row';
                    }
                }
            },
            columns: [
                {
                    text: '레벨',
                    dataIndex: 'reserved_integer1',
                    width: 50,
                    style: 'text-align:center',
                    align: 'center'
                },{
                    text: '순번',
                    dataIndex: 'reserved_integer3',
                    width: 40,
                    style: 'text-align:center',
                    align: 'center'
                },{
                    text: '상태',
                    dataIndex: 'state',
                    width: 80,
                    style: 'text-align:center',
                    align: 'center'
                },{
                    text: '품번',
                    dataIndex: 'item_code',
                    width: 120,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '품명',
                    dataIndex: 'item_name',
                    width: 120,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '규격',
                    dataIndex: 'specification',
                    width: 120,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '가용',
                    dataIndex: 'useful_stock_qty',
                    width: 60,
                    style: 'text-align:right',
                    align: 'right'
                },{
                    text: '소요',
                    dataIndex: 'quan',
                    width: 60,
                    style: 'text-align:right',
                    align: 'right'
                },{
                    text: '구매',
                    dataIndex: 'pr_quan',
                    width: 60,
                    style: 'text-align:right',
                    align: 'right'
                },{
                    text: '할당',
                    dataIndex: 'rc_quan',
                    width: 60,
                    style: 'text-align:right',
                    align: 'right'
                }
            ]
        });

        this.partBomGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                // gm.me().onAssemblyGridSelection(selections);
                if(selections.length>0) {
                    gm.me().removePartAction.enable();
                } else {
                    gm.me().removePartAction.disable();
                }
            }
        });

        // this.east = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
        //     // {
        //     layout: 'border',
        //     border: true,
        //     region: 'east',
        //     width: '48%',
        //     layoutConfig: {
        //         columns: 2,
        //         rows: 1
        //     },

        //     items: [this.partBomGrid]
        // });

        return this.partBomGrid;
    },

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

    producePlanOp: function() {
        // 계획수립: 가용재고가 있는 경우 할당으로 먼저 뺀뒤 나머지를 구매요청.
        //          Sub Assy가 포함되어있는 경우 Sub Assy도 같이 진행됨.

        var rec = gm.me().assyGrid.getSelectionModel().getSelection()[0];
        var status = rec.get('status');
        if(status != null && status != 'BR' && status != 'DE') {
            Ext.MessageBox.alert('알림', '수립 가능 상태가 아닙니다.');
            return;
        };

        gm.me().requestform = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            // title:'공정 선택',
            frame: false ,
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
                    title: '작업요청일 및 특이사항을 기입해주세요.',
                    items: [
                        {
                            xtype: 'datefield',
                            anchor: '97%',
                            name: 'workOrder_date',
                            fieldLabel: '작업요청일',
                            format: 'Y-m-d',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d'// 'Y-m-d H:i:s'
                        },
                        {
                            xtype: 'textarea',
                            anchor: '97%',
                            name: 'comment',
                            fieldLabel: '특이사항'
                        }
                    ]
                }
            ]
        });

        var prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: gm.getMC('CMD_Production_Order', '계획수립'),
            width: 450,
            height: 270,
            items: gm.me().requestform,
            buttons: [
                {text: CMD_OK,
                    scope:this,
                    handler:function(){
                        prWin.setLoading(true);
                        var form = gm.me().requestform.getForm();
                        var val = form.getValues();
                        var assy_selects = gm.me().assyGrid.getSelectionModel().getSelection();
                        var uid = assy_selects[0].get('unique_uid');
                        var ac_uid = assy_selects[0].get('ac_uid');
                        var big_pcs_code = assy_selects[0].get('working_area');

                        Ext.Ajax.request({
                            url : CONTEXT_PATH + '/index/process.do?method=addProcessPlanForMake',
                            params:{
                                assymap_uid: uid,
                                ac_uid: ac_uid,
                                process_code : big_pcs_code,
                                workOrder_date: val['workOrder_date'],
                                comment: val['comment']
                            },
                            success: function(val, action){
                                if(prWin){
                                    prWin.setLoading(false);
                                    prWin.close();
                                }
                                var select_item = gm.me().grid.getSelectionModel().getSelection()[0];
                                var child = select_item.get('unique_id_long');
                                var pjuid = select_item.get('ac_uid');
                                var parent_uid = select_item.get('parent_uid');
                                gm.me().cloudAsStore.getProxy().setExtraParam('child', child);
                                gm.me().cloudAsStore.getProxy().setExtraParam('parent_uid', parent_uid);
                                gm.me().cloudAsStore.getProxy().setExtraParam('pjuid', pjuid);
                                gm.me().cloudAsStore.getProxy().setExtraParam('multi_prd', true);
                                gm.me().cloudAsStore.load({
                                    callback: function() {
                                        if (gm.me().assyGrid != null) {
                                            gm.me().assyGrid.expandAll();
                                        }
                                    }
                                });
                            },
                            failure: function(val, action) {
                                if(prWin){
                                    prWin.setLoading(false);
                                    prWin.close();
                                }
                                gMain.selPanel.store.getProxy().setExtraParam('reserved_varchar3', gMain.selPanel.reserved_varchar3);
                                gMain.selPanel.store.load();
                            }
                        });

                    }},

                {text: CMD_CANCEL,
                    scope:this,
                    handler:function(){
                        if(prWin){
                            prWin.close();
                        }
                    }}
            ]
        });

        prWin.show();
    },

    removePartAction: Ext.create('Ext.Action', {
        itemId: 'removePartAction',
        iconCls: 'af-remove',
        disabled: true,
        text: '품목삭제',
        handler: function (widget, event) {
            var select = gm.me().partBomGrid.getSelectionModel().getSelection()[0];
            var unique_id = select.get('unique_uid');
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/material.do?method=removeAssyMtrlBom',
                params:{
                    unique_id:unique_id
                },
                success : function(result, request) {
                    gm.me().partBomStore.load();
                },
                failure: extjsUtil.failureMessage
            });
        }
    }),

    addPartAction: Ext.create('Ext.Action', {
        itemId: 'addPartAction',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '품목추가',
        handler: function (widget, event) {

            console_logs('gm.me().selected_tree_record', gm.me().assyGrid);

            gm.me().selected_tree_record = gm.me().assyGrid.getSelectionModel().getSelection()[0];
            var records = gm.me().assyGrid.getStore().data.items;

            var max_num = 0;

            for (var i = 0; i < records.length; i++) {

                var reserved_integer3 = records[i].get('reserved_integer3');

                if (max_num < reserved_integer3) {
                    max_num = reserved_integer3;
                }
            }

            gm.me().mNum = max_num + 1;

            if (gm.me().assyGrid == null) {
                Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
                    return;
                });
                return;
            }
            var parent = gm.me().selected_tree_record.get('parent');
            var parent_uid = gm.me().selected_tree_record.get('parentId');
            var ac_uid = gm.me().selected_tree_record.get('ac_uid');
            var top_pl_no = gm.me().selected_tree_record.get('pl_no');
            var unique_uid = gm.me().selected_tree_record.get('unique_uid');
            var reserved_integer1 = gm.me().selected_tree_record.get('reserved_integer1');
            var reserved_integer2 = gm.me().selected_tree_record.get('reserved_integer2');

            var pj_uid = gm.me().assyGrid.getSelectionModel().getSelection()[0].get('ac_uid');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/poreceipt.do?method=getAssyPlnoAll',
                params: {
                    ac_uid: pj_uid,
                    assybom: 'N', //Y면 AssemblyBom N이나 널이면 ProjectBOM,
                    assymap_uid: unique_uid
                },
                success: function (result, request) {
                    console_logs('result.responseText', result);
                    var str = result.responseText;
                    switch (top_pl_no) {
                        case '---':
                            top_pl_no = '';
                            break;
                        case '':
                            top_pl_no = '';
                            break;
                        default:
                            top_pl_no = top_pl_no + '-';
                    }
                    var pl_no = top_pl_no + str;

                    gm.me().plNo = str;


                    var lineGap = 30;
                    var bHeight = 680;
                    var bWidth = 800;

                    var refer_uid = gm.me().selected_tree_record.get('refer_uid');

                    gm.me().searchStore.removeAll();

                    this.itemSearchAction = Ext.create('Ext.Action', {
                        iconCls: 'af-search',
                        text: CMD_SEARCH/*'검색'*/,
                        tooltip: CMD_SEARCH/*'검색'*/,
                        disabled: false,
                        handler: function () {
                            var extraParams = gm.me().searchStore.getProxy().getExtraParams();
                            if (Object.keys(extraParams).length == 0) {
                                Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                            } else {
                                gm.me().searchStore.load();
                            }
                        }
                    });

                    this.gridViewTable = Ext.create('Ext.grid.Panel', {
                        store: gm.me().searchStore,
                        cls : 'rfx-panel',
                        multiSelect: false,
                        autoScroll : true,
                        border: false,
                        height: 200,
                        padding: '0 0 5 0',
                        flex: 1,
                        layout: 'fit',
                        forceFit: false,
                        listeners: {
                            select: function(selModel, record, index, options) {
                                gu.getCmp('unique_id').setValue(record.get('unique_id_long'));
                                gu.getCmp('item_code').setValue(record.get('item_code'));
                                gu.getCmp('item_name').setValue(record.get('item_name'));
                                gu.getCmp('specification').setValue(record.get('specification'));
                                gu.getCmp('maker_name').setValue(record.get('maker_name'));
                                gu.getCmp('unit_code').setValue(record.get('unit_code'));
                                gu.getCmp('sales_price').setValue(record.get('sales_price'));
                                gu.getCmp('currency').setValue(record.get('currency'));
                            }
                        },
                        dockedItems: [
                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                style: 'background-color: #EFEFEF;',
                                items: [
                                    {
                                        xtype:'checkboxfield',
                                        align:'left',
                                        fieldLabel:'화면유지',
                                        labelWidth: 60,
                                        id: 'win_check',
                                        checked: gm.me().win_check == true ? true : false,
                                        inputValue: '-1',
                                        listeners:{
                                            change:function(checkbox, checked){

                                                if(checked) {
                                                    gm.me().win_check = true;
                                                } else {
                                                    gm.me().win_check = false;
                                                }
                                            }
                                        }
                                    }, {
                                        field_id: 'search_item_code',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_item_code_part'),
                                        name: 'search_item_code',
                                        margin: '3 3 3 3',
                                        xtype: 'triggerfield',
                                        emptyText: '품번',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click : function() {
                                            this.setValue('');

                                        },
                                        listeners : {
                                            change : function(fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('item_code', '%'+e+'%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.item_code;
                                                }
                                            },
                                            render: function(c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        field_id:  'search_item_name',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_item_name_part'),
                                        name: 'search_item_name',
                                        xtype: 'triggerfield',
                                        margin: '3 3 3 3',
                                        emptyText: '품명',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click : function() {
                                            this.setValue('');
                                        },
                                        listeners : {
                                            change : function(fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('item_name', '%'+e+'%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.item_name;
                                                }
                                            },
                                            render: function(c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        field_id: 'search_specification',
                                        width: 190,
                                        fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                        id: gu.id('search_specification_part'),
                                        name: 'search_specification',
                                        xtype: 'triggerfield',
                                        margin: '3 3 3 3',
                                        emptyText: '규격',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click: function () {
                                            this.setValue('');
                                        },
                                        listeners: {
                                            change: function (fieldObj, e) {
                                                if (e.trim().length > 0) {
                                                    gm.me().searchStore.getProxy().setExtraParam('specification', '%'+e+'%');
                                                } else {
                                                    delete gm.me().searchStore.proxy.extraParams.specification;
                                                }
                                            },
                                            render: function (c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    '->',
                                    this.itemSearchAction
                                ]
                            }
                        ],
                        columns: [
                            {
                                text: '품번',
                                width: 150,
                                dataIndex: 'item_code'
                            },
                            {
                                text: '품명',
                                width: 300,
                                dataIndex: 'item_name',
                                renderer: function(value) {
                                    return value.replace(/</gi,"&lt;");
                                }
                            },
                            {
                                text: '규격',
                                width: 340,
                                dataIndex: 'specification'
                            }
                        ]
                    });

                    gm.me().createPartForm = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: bWidth,
                        height: bHeight,
                        bodyPadding: 10,
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
                            this.gridViewTable,
                            new Ext.form.Hidden({
                                name: 'parent',
                                value: gm.me().selectedChild
                            }),
                            new Ext.form.Hidden({
                                name: 'ac_uid',
                                value: pj_uid
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
                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                readOnly: true,
                                hidden: true,
                                width: 300,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'textfield',
                                name: 'item_code',
                                id: gu.id('item_code'),
                                fieldLabel: '품번',
                                readOnly: true,
                                allowBlank: false,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'textfield',
                                name: 'item_name',
                                id: gu.id('item_name'),
                                fieldLabel: '품명',
                                readOnly: true,
                                allowBlank: false,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '규격',
                                id: gu.id('specification'),
                                name: 'specification',
                                readOnly: true,
                                allowBlank: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '제조사',
                                id: gu.id('maker_name'),
                                name: 'maker_name',
                                readOnly: true,
                                allowBlank: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                xtype: 'numberfield',
                                minValue: 0,
                                width: '100%',
                                id: gu.id('bm_quan'),
                                name: 'bm_quan',
                                fieldLabel: '수량',
                                allowBlank: true,
                                value: '1',
                                margins: '0'
                            }, {
                                xtype: 'textfield',
                                width: '100%',
                                fieldLabel: gm.me().getColName('unit_code'),
                                id: gu.id('unit_code'),
                                name: 'unit_code',
                                allowBlank: true
                            }, {
                                xtype: 'numberfield',
                                width: '100%',
                                id: gu.id('sales_price'),
                                name: 'sales_price',
                                fieldLabel: '단가',
                                allowBlank: true,
                                value: '0',
                                margins: '0'
                            }, {
                                xtype: 'textfield',
                                width: '100%',
                                fieldLabel: '통화',
                                id: gu.id('currency'),
                                name: 'currency',
                                allowBlank: true
                            },  {
                                fieldLabel: 'Level',
                                xtype: 'textfield',
                                hidden: true,
                                width: '100%',
                                emptyText: 'Level',
                                name: 'reserved_integer1',
                                value: reserved_integer1 + 1,
                            }, {
                                xtype: 'textfield',
                                fieldLabel: '단위',
                                emptyText: '단위',
                                name: 'unit_code',
                                id: gu.id('unit_code'),
                                width: '100%',
                                value: 'EA'
                            }, {
                                xtype: 'textfield',
                                width: '100%',
                                fieldLabel: '위치',
                                margin: '0 0 70 0',
                                id: gu.id('reserved_varchar2'),
                                name: 'reserved_varchar2',
                            }, {
                                xtype: 'textfield',
                                id: gu.id('parent'),
                                name: 'parent',
                                emptyText: '제품 UID',
                                value: gm.me().selectedChild,
                                width: '100%',
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                xtype: 'textfield',
                                id: gu.id('unique_uid'),
                                name: 'unique_uid',
                                emptyText: 'BOM UID',
                                value: refer_uid > -1 ? refer_uid : gm.me().selectedAssyUid,
                                width: '100%',
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: 'AssyTopUID',
                                xtype: 'textfield',
                                name: 'reserved_integer2',
                                value: reserved_integer2,
                                emptyText: '제품ASSY_UID',
                                readOnly: true,
                                hidden: true,
                                width: '100%',
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                xtype: 'textfield',
                                width: '100%',
                                emptyText: '순번',
                                hidden: true,
                                name: 'pl_no',
                                id: gu.id('pl_no'),
                                fieldLabel: '순번',
                                value: gm.me().plNo // pl_no
                            },
                            {
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

                    var winPart = Ext.create('ModalWindow', {
                        title: '품목 추가',
                        width: bWidth,
                        height: bHeight,
                        minWidth: 250,
                        minHeight: 180,
                        items: [gm.me().createPartForm
                        ],
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                var form = gm.me().createPartForm;
                                if (form.isValid()) {
                                    var val = form.getValues(false);
                                    var refer_uid = gm.me().selected_tree_record.get('refer_uid');
                                    console_logs('form val', val);
                                    gm.me().registPartFc(val);

                                    if(gm.me().win_check == false) {
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
                } // endofhandler
            });


        },
        failure: extjsUtil.failureMessage
    }),

    registPartFc: function (val) {
        var parent_rec = gm.me().assyGrid.getSelectionModel().getSelection()[0];
        var parent_uid = parent_rec.get('unique_uid');
        var child = parent_rec.get('child');
//        gm.me().addNewAction(val);
        // return;
        Ext.Ajax.request({
            // url: CONTEXT_PATH + '/purchase/material.do?method=addChildBOMTreeWithUsedProduct',
            //url: CONTEXT_PATH + '/purchase/material.do?method=addChildBOMTreeWithPr',
            url: CONTEXT_PATH + '/purchase/material.do?method=addAssyMtrlBom',
            params: {
                calculate_quan:true,
                ac_uid:val['ac_uid'],
                parent_uid: parent_uid,
                parent: child,
                bm_quan: val['bm_quan'],
                child: val['unique_id'],
                item_code: val['item_code'],
                pl_no: val['pl_no'],
                level: val['reserved_integer1'],
                assytop_uid: val['reserved_integer2'],
                reserved_varchar2: val['reserved_varchar2'], // ????
                reserved_integer3: gm.me().mNum  // 흠?..
            },

            success: function (result, request) {
                // gm.me().store.getProxy().setExtraParam('parent', gm.me().selectedChild);
                // gm.me().store.getProxy().setExtraParam('parent_uid', gm.me().selectedAssyUid);
                // gm.me().store.getProxy().setExtraParam('ac_uid', -1);
                // gm.me().store.load();
                gm.me().partBomStore.load();
                // gu.getCmp('DBM7TREE-Assembly').store.load();
                gm.me().showToast('성공', '자재가 정상적으로 등록 되었습니다.');
                if(gm.me().win_check) {
                    gm.me().plNo = gm.me().plNo*1 + 1;
                    gm.me().resetPartForm();
                }
                // Ext.MessageBox.alert('성공', '자재가 정상적으로 등록 되었습니다.');

            },
            failure: extjsUtil.failureMessage
        });
    },

    resetPartForm: function () {
        // var reserved_integer1 = gm.me().selected_tree_record.get('reserved_integer1');
        Ext.getCmp(gu.id('bm_quan')).setValue('1');
        Ext.getCmp(gu.id('sales_price')).setValue('0');
        Ext.getCmp(gu.id('currency')).setValue('KRW');
        Ext.getCmp(gu.id('unit_code')).setValue('EA');
        Ext.getCmp(gu.id('reserved_varchar2')).setValue('');

        // gm.me().toResetData();
    },

    mNum: 0,
    plNo:0,
    win_check:true,
    workingAreaStore: Ext.create('Mplm.store.PcsTplStore', {}),
    searchStore: Ext.create('Rfx2.store.company.kbtech.MaterialStore', {}),
});