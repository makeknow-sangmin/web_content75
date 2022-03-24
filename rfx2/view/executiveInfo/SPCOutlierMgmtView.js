Ext.define('Rfx2.view.executiveInfo.SPCOutlierMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'spc-outlier-mgmt-view',
    temper : 1,
    initComponent: function () {

        this.createStore('Rfx.model.BuyerList', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/,{}
            ,['combst']
        );

        this.store.getProxy().setExtraParam('exist_co', 'Y');

        this.addSearchField('wa_name');
        this.addSearchField('company_name');

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'COPY', 'REMOVE', 'EDIT', 'VIEW'
            ],
            RENAME_BUTTONS: []
        });

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        var storeInspect = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'buyer_name',
                type: 'string'
            },{
                name: 'index_number',
                type: 'number'
            }

            ],
            data: [/*{
                buyer_name: '1. 1개의 점이 중심선으로부터 3σ 범위 밖에 있음',
                index_number: 1,
                lock: true
            },*/{
                buyer_name: '2. 9개의 연속된 점이 중심선으로부터 같은 쪽에 있음',
                index_number: 2
            },{
                buyer_name: '3. 6개의 연속된 점이 모두 상승 또는 하락',
                index_number: 3
            },{
                buyer_name: '4. 14개의 연속된 점이 교대로 상승 또는 하락',
                index_number: 4
            },{
                buyer_name: '5. 3개의 점 중에서 2개의 점이 중심선으로부터 2σ 범위 밖에 있음(한쪽)',
                index_number: 5
            },{
                buyer_name: '6. 5개의 점 중에서 4개의 점이 중심선으로부터 1σ 범위 밖에 있음(한쪽)',
                index_number: 6
            },{
                buyer_name: '7. 15개의 연속된 점이 중심선으로부터 1σ 범위 내에 있음(양쪽)',
                index_number: 7
            },{
                buyer_name: '8. 8개의 연속된 점이 중심선으로부터 1σ 범위 밖에 있음(양쪽)',
                index_number: 8
            }/*,{
                buyer_name: '9. QA UCL/LCL 상하한 연속으로 5개 벗어나있음(양쪽)',
                index_number: 9
            }*/
            ]
        });

        var storeOutlier = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'outlier_list',
                type: 'string'
            }],
            data: [{
                outlier_list: '1. 1개의 점이 중심선으로부터 3σ 범위 밖에 있음'
            },{
                outlier_list: '2. 9개의 연속된 점이 중심선으로부터 같은 쪽에 있음'
            },{
                outlier_list: '3. 5개의 연속된 점이 모두 상승 또는 하락'
            },{
                outlier_list: '4. 14개의 연속된 점이 교대로 상승 또는 하락'
            },{
                outlier_list: '5. 3개의 점 중에서 2개의 점이 중심선으로부터 2σ 범위 밖에 있음(한쪽)'
            },{
                outlier_list: '6. 5개의 점 중에서 4개의 점이 중심선으로부터 1σ 범위 밖에 있음(한쪽)'
            },{
                outlier_list: '7. 15개의 연속된 점이 중심선으로부터 1σ 범위 내에 있음(양쪽)'
            },{
                outlier_list: '8. 8개의 연속된 점이 중심선으로부터 1σ 범위 밖에 있음(양쪽)'
            }
            ]
        });

        var gridViewTable = Ext.create('Ext.grid.Panel', {
            //title: '분석표 목록',
            store: this.store,
            cls : 'rfx-panel',
            //region:'west',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            border: true,
            bbar: getPageToolbar(this.store),
            //frame: true,
            layout          :'fit',
            forceFit: true,
            flex: 1.5,
            columns: [{
                text: '고객사코드',
                flex: 1,
                dataIndex: 'company_name'
            },{
                text: '고객사명',
                flex: 1.5,
                dataIndex: 'wa_name'
            },{
                text: '이상점 리스트',
                flex: 1.5,
                dataIndex: 'biz_type'
            }]
        });

        var action = Ext.create('Ext.Action', {
            iconCls: 'af-search',
            text: CMD_SEARCH/*'검색'*/,
            tooltip: '조건 검색',
            handler: function() {
                var items = searchToolbar.items.items;
                for(var i=0; i<items.length; i++) {
                    var item = items[i];
                    gm.me().store.getProxy().setExtraParam(item.name, item.value);
                }
                gm.me().store.load();
            }
        });

        var buttonToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: action
        });

        var combstStore = Ext.create('Mplm.store.CombstStore', {});

        var search = [
            {
                id: gu.id('information'),
                fieldLabel: '종전자재',
                width: 300,
                field_id: 'information',
                name: 'information',
                xtype: 'combo',
                emptyText: '업체코드',
                store: combstStore,
                displayField: 'company_name',
                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                sortInfo: {
                    field: 'company_name',
                    direction: 'ASC'
                },
                minChars: 1,
                margin: '0 3 3 3',
                typeAhead: false,
                hideLabel: true,
                hideTrigger: true,
                listConfig: {
                    loadingText: '검색중...',
                    emptyText: '일치하는 결과가 없습니다.',
                    // Custom rendering template for each item
                    getInnerTpl: function () {
                        return '<div data-qtip="{company_name}">[{company_name}]{wa_name}</div>';
                    }
                },
                pageSize: 10,
                listeners: {
                    select: function(combo, record) {
                        gm.me().store.getProxy().setExtraParam('company_name', record.get('company_name'));
                    },
                    change: function(e, newValue, oldValue) {
                        if(newValue == null) {
                            gm.me().store.getProxy().setExtraParam('company_name', null);
                        }
                    },
                }
            }
        ];

        var searchToolbar = Ext.create('widget.toolbar', {
            items:search,
            layout:'column',
            cls: 'my-x-toolbar-default1'
        });

        this.gridOutlierList = Ext.create('Ext.grid.Panel', {
            store: this.store,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: true,
            autoScroll : true,
            bbar: getPageToolbar(this.store),
            autoHeight: true,
            border: true,
            layout          :'fit',
            forceFit: true,
            margin: '0 3 0 0',
            flex: 2,
            dockedItems: [
                buttonToolbar,
                searchToolbar
            ],
            columns: [{
                text: '고객사명',
                flex: 2,
                dataIndex: 'wa_name'
            }, {
                text: '고객사코드',
                flex: 1,
                dataIndex: 'company_name'
            }]
            //,
            //title: '검사유형 선택'
        });

        this.spcItemStore = Ext.create('Mplm.store.SpcItemStore', {});

        this.gridSpcItemGrid = Ext.create('Ext.grid.Panel', {
            store: this.spcItemStore,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: true,
            autoScroll : true,
            //bbar: getPageToolbar(storeInspect),
            autoHeight: true,
            border: true,
            layout          :'fit',
            forceFit: true,
            margin: '0 3 0 0',
            flex: 1.5,
            columns: [
            {
                text: gm.getMC('CMD_Product', '제품군'),
                flex: 1,
                dataIndex: 'item_type_kr'
            },
            {
                text: '공정',
                flex: 1,
                dataIndex: 'process_type_kr'
            },
            {
                text: '검사명',
                flex: 2,
                dataIndex: 'legend_code_kr'
            }
            ]
            //,
            //title: '검사유형 선택'
        });

        this.gridInspect = Ext.create('Ext.grid.Panel', {
            store: storeInspect,
            cls : 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll : true,
            selModel : Ext.create("Ext.selection.CheckboxModel", {} ),
            autoHeight: true,
            border: true,
            //bbar: getPageToolbar(storeInspect),
            frame: false,
            layout:'fit',
            forceFit: true,
            flex: 1,
            columns: [{
                text: '이상점 체크',
                flex: 2,
                dataIndex: 'buyer_name'
            }]
            //,
            //title: '검사유형 선택'
        });

        // this.grid.forceFit = 'true';
         this.store.getProxy().setExtraParam('exist_company_name', 'Y');
         this.store.load();

        this.outlierStore = Ext.create('Mplm.store.OutlierStore', {});

        this.gridOutlierList.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                gm.me().gridSpcItemGrid.getSelectionModel().deselectAll();
                gm.me().gridInspect.getSelectionModel().deselectAll();
                gm.me().outlier_lock = true;
            }
        });

        this.gridSpcItemGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {

                if(selections.length > 0) {

                    var gridOutlierSelection = gm.me().gridOutlierList.getSelectionModel().getSelection();

                    if(gridOutlierSelection.length > 0) {
                        var selection = selections[0];

                        var combst_uid = gridOutlierSelection[0].get('unique_id_long');
                        var claast_uid = selection.get('unique_id_long');

                        gm.me().outlierStore.getProxy().setExtraParam('combst_uid', combst_uid);
                        gm.me().outlierStore.getProxy().setExtraParam('column_uid', claast_uid);

                        gm.me().gridInspect.getSelectionModel().deselectAll();

                        gm.me().outlierStore.load(function(record) {

                            if(record.length > 0) {
                                var outlier_list = record[0].get('outlier_list');
                                var outlier_list_split = outlier_list.split(',');

                                for(var i = 0; i < outlier_list_split.length; i++) {
                                    var parseValue = parseInt(outlier_list_split[i].trim()) - 2;

                                    if(parseValue > -1 && parseValue < 8) {
                                        gm.me().gridInspect.getSelectionModel().select(parseValue, true);
                                    }
                                }
                            } else {

                            }

                            gm.me().outlier_lock = false;
                        });

                    } else {
                        gm.me().outlier_lock = true;
                    }
                } else {
                    gm.me().outlier_lock = true;
                }
            }
        });

        this.gridInspect.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                var gridSelection = gm.me().gridOutlierList.getSelectionModel().getSelection();

                if(gridSelection.length > 0 && !gm.me().outlier_lock) {

                    var value = '';

                    for(var i = 0; i < selections.length; i++) {
                        value += selections[i].get('index_number') + (i == selections.length - 1 ? '' : ', ');
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=sendOutlierItem',
                        params:{
                            combst_uid : gm.me().gridOutlierList.getSelectionModel().getSelection()[0].get('unique_id_long'),
                            column_uid : gm.me().gridSpcItemGrid.getSelectionModel().getSelection()[0].get('unique_id_long'),
                            outlier_list : value
                        },

                        success : function(result, request) {

                        }
                    });

                }
            }
        });

        Ext.apply(this, {

            layout: 'border',
            bodyBorder: false,

            defaults: {
                collapsible: false,
                split: true
            },
            items:[
                {
                    title: '고객사별 이상점 리스트',
                    collapsible: true,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: 750,
                    items: [this.gridOutlierList, this.gridSpcItemGrid]
                },
                {
                    title: '이상점 체크(1개의 점이 중심선으로부터 3σ 범위 밖에 있음 이상점 항목은 기본적으로 검색합니다.)',
                    frame: true,
                    region: 'center',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    items: [this.gridInspect]
                },

            ]
        });


        this.callParent(arguments);
    },

    autoScroll: true,
    items: null,
    outlier_lock: true
});
