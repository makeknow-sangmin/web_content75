Ext.define('Rfx2.view.company.scon.qualityMgmt.ImportInspectionResultView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'import-inspection-view',


    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type    : 'dateRange',
            field_id: 'search_date',
            text    : "입고일",
            sdate   : Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            edate   : new Date()
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });


        this.createStoreSimple({
            modelClass: 'Rfx2.model.company.chmr.ImportInspection',
            sorters   : [{
                property : 'unique_id',
                direction: 'DESC'
            }],
            pageSize  : gMain.pageSize,/*pageSize*/
        }, {});

        // 검사 삭제 버튼
        this.deleteInspection = Ext.create('Ext.Action', {
            xtype   : 'button',
            iconCls : 'af-remove',
            text    : '검사삭제',
            tooltip : this.getMC('msg_btn_prd_add', '수입검사 내역 삭제'),
            disabled: true,
            handler : function () {
                Ext.MessageBox.show({
                    title  : '삭제',
                    msg    : '선택한 차수의 수입검사 내역을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn     : function (btn) {
                        if (btn == 'yes') {
                            var record = gm.me().grid.getSelectionModel().getSelection()[0].data;
                            Ext.Ajax.request({
                                url    : CONTEXT_PATH + '/xdview/spcMgmt.do?method=destroyInspection',
                                params : {
                                    target_uid   : record.unique_id_long,
                                    type         : !record.type ? 'I' : record.type, // 기본값 2(최종검사)
                                    inspection_no: !record.v027 ? 1 : record.v027 // 기본값 1차 검사
                                },
                                success: function (result, request) {
                                    var resultText = result.responseText;
                                    console_log('result:' + resultText);
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    },
                    icon   : Ext.MessageBox.QUESTION
                });
            }
        });

        var btnsNeedsSelection = [];

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.createCrudTab();

        this.testStore = Ext.create('Rfx2.store.company.bioprotech.ImportInspectionStore', {pageSize: 10});

        Ext.apply(this, {
            layout: 'border',
            items : this.grid
        });

        this.callParent(arguments);

        var dateRangeId = this.link + '-' + gMain.getSearchField('search_date');
        sDateField = Ext.getCmp(dateRangeId + '-s');
        eDateField = Ext.getCmp(dateRangeId + '-e');
        sDateField.setMaxValue(new Date());
        eDateField.setMaxValue(new Date());

        //디폴트 로드
        // this.store.getProxy().setExtraParams({
        //     isReady: true,
        // });
        gm.setCenterLoading(false);
        this.store.getProxy().setExtraParam('is_ok', 'Y');
        this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                console_logs('>>> aaa', 'aaa');
                gm.me().addTakeResult.enable();
            } else {
                gm.me().addTakeResult.disable();
            }
        });

        this.inspectionResultStore = Ext.create('Rfx2.store.company.chmr.InspectionResultStore', {});

        this.subInspectionResultStore = Ext.create('Rfx2.store.company.chmr.subInspectionResultStore', {});

        var subGridMain = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('subGridMain'),
            store: this.inspectionResultStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            width: 800,
            height : 350,
            frame: true,
            border: true,
            layout: 'fit',
            forceFit: false,
            margin: '0 0 0 0',
            columns: [
                { text: '항목', width: 370, style: 'text-align:center', dataIndex: 'category', sortable: false},
                { text: '값', width: 370, style: 'text-align:center', dataIndex: 'category_value', sortable: false, editor: 'textfield' },
            ],
            tbar: [

            ],
            listeners: {
                selectionchange: function (selectionModel, records, listeners) {
                }
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
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
                            text: '수정값 저장',
                            iconCls: 'af-edit',
                            id : gu.id('value_edit'),
                            disabled: true,
                            listeners: [{
                                click: function () {
                                    // target_uid와 Header에 있는 항목, 값들을 불러온다.
                                    var select = gm.me().grid.getSelectionModel().getSelection()[0];
                                    console_logs('>>>> select', select);
                                    let storeData = gu.getCmp('subGridMain').getStore();
                                    let edit_v000 = '';
                                    let edit_v001 = '';
                                    let edit_v002 = '';
                                    let edit_v003 = '';
                                    let edit_v004 = '';
                                    let edit_v005 = '';
                                    let edit_v006 = '';
                                    for (var i = 0; i < storeData.data.items.length; i++) {
                                        const item = storeData.data.items[i];
                                        console_logs('item >>>', item);
                                        if(i === 0) {
                                            edit_v000 = item.get('category_value');
                                        }
                                        if(i === 1) {
                                            edit_v001 = item.get('category_value');
                                        }
                                        if(i === 2) {
                                            edit_v002 = item.get('category_value');
                                        }
                                        if(i === 3) {
                                            edit_v003 = item.get('category_value');
                                        }
                                        if(i === 4) {
                                            edit_v004 = item.get('category_value');
                                        }
                                        if(i === 5) {
                                            edit_v005 = item.get('category_value');
                                        }
                                        if(i === 6) {
                                            edit_v006 = item.get('category_value');
                                        }
                                    }

                                    // 세부정보에 해당하는 측정치, 판정, 비고값들을 List화 하여 저장한 후 한번에 update 처리.
                                    let storeDataSub = gu.getCmp('subGrid').getStore();
                                    let v000List = [];
                                    let v001List = [];
                                    let v028List = [];
                                    let subMabufferUids = [];
                                    for (var j = 0; j < storeDataSub.data.items.length; j++) {
                                        const itemSub = storeDataSub.data.items[j];
                                        console_logs('itemSub >>>', itemSub);
                                        v000List.push(itemSub.get('v000'));
                                        v001List.push(itemSub.get('v001'));
                                        v028List.push(itemSub.get('v028'));
                                        subMabufferUids.push(itemSub.get('unique_id_long'));
                                    }

                                    Ext.Ajax.request({
                                        url    : CONTEXT_PATH + '/quality/cementInspect.do?method=editInspectResult',
                                        params : {
                                            target_uid : select.get('unique_id_long'),
                                            subMabufferUids : subMabufferUids,
                                            v000List : v000List,
                                            v001List : v001List,
                                            v028List : v028List,
                                            edit_v000 : edit_v000,
                                            edit_v001 : edit_v001,
                                            edit_v002 : edit_v002,
                                            edit_v003 : edit_v003,
                                            edit_v004 : edit_v004,
                                            edit_v005 : edit_v005,
                                            edit_v006 : edit_v006,
                                        },
                                        success: function (result, request) {
                                            var resultText = result.responseText;
                                            console_log('result:' + resultText);
                                            gm.me().store.load();
                                            gm.me().inspectionResultStore.load();
                                            gm.me().subInspectionResultStore.load();
                                            gu.getCmp('value_edit').disable();
                                        },
                                        failure: extjsUtil.failureMessage
                                    });
                                }
                            }]
                        },
                        {
                            text: '성적서 삭제',
                            iconCls: 'af-remove',
                            id : gu.id('value_delete'),
                            disabled: true,
                            listeners: [{
                                click: function () {
                                    // target_uid에 해당하는 성적서 정보를 삭제한 후
                                    // Header Mabuffer에 있는 정보 및 최종 판정 값을 NULL로 초기화.
                                    Ext.MessageBox.show({
                                        title: '성적서 삭제',
                                        msg: '선택한 성적서를 삭제 후 입력 전 상태로 초기화 하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (result) {
                                            if (result == 'yes') {
                                                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                                                Ext.Ajax.request({
                                                    url    : CONTEXT_PATH + '/quality/cementInspect.do?method=deleteInspectResult',
                                                    params : {
                                                        target_uid : select.get('unique_id_long'),

                                                    },
                                                    success: function (result, request) {
                                                        var resultText = result.responseText;
                                                        console_log('result:' + resultText);
                                                        gm.me().store.load();
                                                        gm.me().inspectionResultStore.load();
                                                        gm.me().subInspectionResultStore.load();
                                                        gu.getCmp('value_edit').disable();
                                                        gu.getCmp('value_delete').disable();
                                                    },
                                                    failure: extjsUtil.failureMessage
                                                });
                                            } else {
                                                prWin.close();
                                            }
                                        },
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                }
                            }]
                        }
                    ]
                })
            ]
        });

        var subGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('subGrid'),
            store: this.subInspectionResultStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 1,
            width: 800,
            height : 350,
            frame: true,
            border: true,
            layout: 'fit',
            forceFit: false,
            margin: '0 0 0 0',
            columns: [
                {
                    text: 'No',
                    width: '5%',
                    dataIndex: 'row_num',
                    style: 'text-align:center',
                    sortable: false
                },
                {
                    text: '검사항목',
                    width: '20%',
                    dataIndex: 'legend_code_kr',
                    style: 'text-align:center',
                    sortable: false
                },
                {
                    text: '단위',
                    width: '10%',
                    dataIndex: 'unit_name',
                    style: 'text-align:center',
                    sortable: false,
                },
                {
                    text: '기준치',
                    width: '10%',
                    dataIndex: 'baseline',
                    style: 'text-align:center',
                    sortable: false
                },
                {
                    text: '측정치',
                    width: '10%',
                    dataIndex: 'v000',
                    editor: 'textfield',
                    style: 'text-align:center',
                    align: 'left',
                    sortable: false,
                    editor: 'textfield'
                },
                {
                    text: '판정',
                    width: '10%',
                    css: 'edit-cell',
                    dataIndex: 'v028',
                    style: 'text-align:center',
                    sortable: false,
                    editor: {
                        xtype: 'combobox',
                        id: gu.id('decision'),
                        displayField: 'codeName',
                        editable: true,
                        forceSelection: true,
                        store: this.decisionStore,
                        triggerAction: 'all',
                        valueField: 'systemCode'
                    },
                    renderer: function (val) {
                        var recordIndex = gm.me().decisionStore.find('systemCode', val);
                        console_logs('>>>> recordIndex ', recordIndex);
                        if (recordIndex === -1) {
                            return '';
                        }
                        return gm.me().decisionStore.getAt(recordIndex).get('codeName');
                    },
                },
                {
                    text: '비고',
                    width: '31%',
                    css: 'edit-cell',
                    dataIndex: 'v001',
                    style: 'text-align:center',
                    editor: 'textfield',
                    sortable: false,
                },
            ],
            tbar: [

            ],
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            listeners: {
                selectionchange: function (selectionModel, records, listeners) {

                }
            }
        });

        var rtPanel = Ext.create('Ext.form.Panel', {
            id         : 'rtPanel',
            xtype      : 'form',
            frame      : false,
            border     : false,
            width      : '100%',
            layout     : 'column',
            bodyPadding: 10,
            items      : [
                {
                    xtype      : 'fieldset',
                    collapsible: false,
                    // title      : gm.me().getMC('msg_order_dia_header_title', '공통정보'),
                    width      : '100%',
                    height : '50%',
                    // style      : 'padding:10px',
                    defaults   : {
                        labelStyle: 'padding:10px',
                        anchor    : '100%',
                        layout    : {
                            type: 'column'
                        }
                    },
                    items      : [
                        {
                            xtype: 'container',
                            width: '100%',
                            border        : true,
                            height : '50%',
                            // defaultMargins: {
                            //     top   : 0,
                            //     right : 0,
                            //     bottom: 0,
                            //     // left  : 10
                            // },
                            items         : [
                                subGridMain
                            ]
                        },

                    ]
                },
                {
                    xtype: 'fieldset',
                    frame: true,
                    // title      : '검사항목 입력',
                    width      : '100%',
                    height     : '100%',
                    layout     : 'fit',
                    // bodyPadding: 10,
                    items: [
                        subGrid
                    ]
                },
                // subGridMain,
                // {
                //     xtype: 'fieldset',
                //     frame: true,
                //     title      : '검사항목 입력',
                //     width      : '100%',
                //     height     : '100%',
                //     layout     : 'fit',
                //     bodyPadding: 10,
                //     items: [
                //         subGridMain,
                //         subGrid
                //     ]
                // },
            ]
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
                    width: '50%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                },
                // this.crudTab, 
                rtPanel
            ]
        });
        this.callParent(arguments);

        this.setGridOnCallback(function(selections){
            if (selections.length) {
                var rec = selections[0];
                gm.me().inspectionResultStore.getProxy().setExtraParam('target_uid', rec.get('unique_id_long'));
                gm.me().inspectionResultStore.load();
                gm.me().subInspectionResultStore.getProxy().setExtraParam('type', 'D');
                gm.me().subInspectionResultStore.getProxy().setExtraParam('target_uid', rec.get('unique_id_long'));
                gm.me().subInspectionResultStore.load();
                gm.me().decisionStore.load();
                gu.getCmp('value_edit').enable();
                gu.getCmp('value_delete').enable();
            } else {
                gu.getCmp('value_edit').disable();
                gu.getCmp('value_delete').disable();
            }
        })
       
    }, // end of init
    inspectList  : Ext.create('Rfx2.store.company.chmr.MaterialInspectionListStore'),
    decisionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'INPSECT_DECISION' }),
});
