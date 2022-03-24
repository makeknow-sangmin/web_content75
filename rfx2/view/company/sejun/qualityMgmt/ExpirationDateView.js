Ext.define('Rfx2.view.company.sejun.qualityMgmt.ExpirationDateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produce-workorder-view',
    requires: [
        'PdfViewer.view.panel.PDF'
    ],
    initComponent: function () {

        this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        //진행상태 검색툴바
        // this.addSearchField(
        //     {
        //         field_id: 'state_name'
        //         , store: "DDStateStore"
        //         , displayField: 'codeName'
        //         , valueField: 'systemCode'
        //         , innerTpl: '<div data-qtip="{code_name_kr}">[{systemCode}]{code_name_kr}</div>'
        //     });

        // this.addSearchField(
        //     {
        //         field_id: 'emergency'
        //         , store: "HeavyEmergency"
        //         , displayField: 'codeName'
        //         , valueField: 'systemCode'
        //         , innerTpl: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
        //     });

        // this.addSearchField('lot_no');
        // this.addSearchField('item_code');

        //this.addSearchField('product_line');
        // this.addSearchField('element_item_name');
        // this.addSearchField('description');
        //this.addSearchField('wa_name');
        //this.addSearchField('final_wa_name');


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }

        });


        this.createStore('Rfx2.model.company.bioprotech.ProduceWorkOrder', [{
            property: 'rtgast.creator',
            direction: 'DESC'
        }],
            //gMain.pageSize
            gMain.pageSize  //pageSize
            , {
                creator: 'rtgast.creator',
                unique_id: 'rtgast.unique_id',
                state_name: 'rtgast.state'
            }
            //삭제테이블 지정. 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['rtgast']
        );


        //그리드 생성
        Ext.each(this.columns, function (columnObj, index) {

            var o = columnObj;

            var dataIndex = o['dataIndex'];

            if (o['dataType'] === 'number') {
                o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                    if (gm.me().store.data.items.length > 0) {
                        var summary = gm.me().store.data.items[0].get('bm_quan');
                        if (summary.length > 0) {
                            var objSummary = Ext.decode(summary);
                            return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                        } else {
                            // return 0;
                        }
                    } else {
                        // return 0;
                    }
                };
            }

        });

        var option = {
            // features: [{
            //     ftype: 'summary',
            //     dock: 'top'
            // }]
        };

        //그리드 생성
        this.createGrid(searchToolbar, buttonToolbar, option);

        this.editAction.setText('상세보기');

        //작업반려 Action 생성
        this.denyWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_Cancel_Plan', '계획취소'),
            tooltip: '요청된 작업지시 건을 생산계획 수립으로 변경 및 스케줄 확정을 취소처리합니다.',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '선택한 건을 생산계획 수립로 이동하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {
                            gm.me().denyWorkOrderFc();
                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        denyOrder = this.denyWorkOrder;

        //작업지시 Action 생성
        this.addWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Job_Confirm', '작업지시'),
            tooltip: '작업지시 확정',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/process.do?method=getBigPcsCodeByRtgAst',
                    params: {
                        rtgastUid: gm.me().vSELECTED_RTGAST_UID
                    },
                    success: function (result, request) {
                        datas = Ext.util.JSON.decode(result.responseText);
                        gm.me().treatWorkStart(datas, rec);
                    },//endofsuccess
                    failure: extjsUtil.failureMessage
                });//endofajax
            }
        });

        this.batchPrdTeam = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '일일 인원편성',
            tooltip: '일일 인원편성',
            disabled: false,
            handler: function () {

                gm.me().presentPlanPrdStore.load();

                var oneTeamGrid = Ext.create('Ext.grid.Panel', {
                    layout: 'fit',
                    store: new Ext.data.Store(),
                    id: gu.id('oneTeamGrid'),
                    columns: [
                        {
                            text: '제품명',
                            width: '60%',
                            css: 'edit-cell',
                            dataIndex: 'item_name',
                            style: 'text-align:center',
                            editor: {
                                xtype: 'combo',
                                // id: gu.id('item_paycond_combo'),
                                displayField: 'item_name',
                                editable: true,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().presentPlanPrdStore,
                                triggerAction: 'all',
                                valueField: 'unique_id',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{item_name} ({item_quan} 개) / {reserved_timestamp1_str} </div>';
                                    }
                                },
                            },
                            listeners: {

                            },
                            renderer: function (val) {
                                var recordIndex = gm.me().presentPlanPrdStore.find('unique_id_long', val);
                                console_logs('>>>> recordIndex ', recordIndex);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                // oneTeamGrid.getSelection()[0].set('item_name', gm.me().presentPlanPrdStore.getAt(recordIndex).get('item_name'));
                                oneTeamGrid.getSelection()[0].set('item_quan', gm.me().presentPlanPrdStore.getAt(recordIndex).get('item_quan'));
                                return gm.me().presentPlanPrdStore.getAt(recordIndex).get('item_name');
                            },


                            sortable: false
                        },
                        { text: '수량(Box)', flex: 1.5, style: 'text-align:center', dataIndex: 'item_quan', sortable: true },

                    ],
                    selModel: 'cellmodel',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
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
                                    text: '+',
                                    listeners: [{
                                        click: function () {
                                            var store = gu.getCmp('oneTeamGrid').getStore();
                                            store.insert(store.getCount(), new Ext.data.Record({
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
                                            var record = gu.getCmp('oneTeamGrid').getSelectionModel().getSelected().items[0];
                                            var store = gu.getCmp('oneTeamGrid').getStore();
                                            if (record == null) {
                                                // gu.getCmp('oneTeamGrid').getStore().remove(store.last());
                                                // console_logs('>>>> exceptMove', store.last().get('item_name'));
                                            } else {
                                                gu.getCmp('oneTeamGrid').getStore().removeAt(gu.getCmp('oneTeamGrid').getStore().indexOf(record));

                                                console_logs('>>>> exceptMove', record.get('item_name'));
                                                var idx = exceptVal.indexOf(record);
                                                exceptVal.splice(idx, 1);
                                                console_logs('>>> erase_exceptVal', exceptVal);
                                                gm.me().presentPlanPrdStore.getProxy().setExtraParam('except_uids', exceptVal);
                                                gm.me().presentPlanPrdStore.load();
                                                // exceptVal.remove()
                                            }
                                        }
                                    }]
                                },
                                {
                                    text: '▲',
                                    listeners: [{
                                        click: function () {
                                            var direction = -1;
                                            var grid = gu.getCmp('oneTeamGrid');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                },
                                {
                                    text: '▼',
                                    listeners: [{
                                        click: function () {
                                            var direction = 1;
                                            var grid = gu.getCmp('oneTeamGrid');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                }

                            ]
                        })
                    ]
                }); // endof Ext.create('Ext.grid.Panel',

                var oneTeamBatch = Ext.create('Ext.grid.Panel', {
                    // region: 'east',
                    style: 'padding-height:20px;',
                    margin: '50 0 0 0',
                    store: new Ext.data.Store(),
                    id: gu.id('oneTeamBatchGrid'),
                    columns: [
                        {
                            text: gm.me().getMC('msg_product_add_dia_div', '역할'),
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'role',
                            //  xtype : 'textfield',
                            sortable: true,
                            editor: {

                            }
                        },
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '작업자'),
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'worker',
                            sortable: true,
                            editor: {
                                xtype: 'combo',
                                // id: gu.id('item_paycond_combo'),
                                displayField: 'user_name',
                                editable: true,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().teamOnePeopleStore,
                                triggerAction: 'all',
                                valueField: 'unique_id',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{user_name}</div>';
                                    }
                                },
                            },
                            listeners: {

                            },
                            renderer: function (val) {
                                var recordIndex = gm.me().teamOnePeopleStore.find('unique_id_long', val);
                                console_logs('>>>> recordIndex ', recordIndex);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                oneTeamBatch.getSelection()[0].set('user_name', gm.me().teamOnePeopleStore.getAt(recordIndex).get('worker'));
                                return gm.me().teamOnePeopleStore.getAt(recordIndex).get('user_name');
                            },
                        },
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '주/야간'),
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'work_type',
                            sortable: true,
                            editor: {
                                xtype: 'combo',
                                // id: gu.id('item_paycond_combo'),
                                displayField: 'code_name_kr',
                                editable: true,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().workTypeStore,
                                triggerAction: 'all',
                                valueField: 'system_code',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{code_name_kr}</div>';
                                    }
                                },
                            },
                            listeners: {

                            },
                            renderer: function (val) {
                                var recordIndex = gm.me().workTypeStore.find('system_code', val);
                                console_logs('>>>> recordIndex ', recordIndex);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                // oneTeamBatch.getSelection()[0].set('work_type', gm.me().workTypeStore.getAt(recordIndex).get('code_name_kr'));
                                return gm.me().workTypeStore.getAt(recordIndex).get('code_name_kr');
                            },
                        },

                    ],
                    selModel: 'cellmodel',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    autoScroll: true,
                    dockedItems: [
                        Ext.create('widget.toolbar', {
                            plugins: {
                                boxreorderer: false
                            },
                            cls: 'my-x-toolbar-default2',
                            items: [
                                '->',
                                {
                                    text: '+',
                                    listeners: [{
                                        click: function () {
                                            var store = gu.getCmp('oneTeamBatchGrid').getStore();
                                            store.insert(store.getCount(), new Ext.data.Record({
                                                'role': '',
                                                'worker': '',
                                                'work_type': '',
                                            }));
                                        }
                                    }]
                                },
                                {
                                    text: '-',
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('oneTeamBatchGrid').getSelectionModel().getSelected().items[0];
                                            var store = gu.getCmp('oneTeamBatchGrid').getStore();
                                            if (record == null) {
                                                gu.getCmp('oneTeamBatchGrid').getStore().remove(store.last());
                                            } else {
                                                gu.getCmp('oneTeamBatchGrid').getStore().removeAt(gu.getCmp('oneTeamBatchGrid').getStore().indexOf(record));
                                            }
                                        }
                                    }]
                                },
                                {
                                    text: '▲',
                                    listeners: [{
                                        click: function () {
                                            var direction = -1;
                                            var grid = gu.getCmp('oneTeamBatchGrid');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                },
                                {
                                    text: '▼',
                                    listeners: [{
                                        click: function () {
                                            var direction = 1;
                                            var grid = gu.getCmp('oneTeamBatchGrid');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                }

                            ]
                        })
                    ]
                }); // endof Ext.create('Ext.grid.Panel',

                var oneTeam = Ext.create('Ext.panel.Panel', {
                    // layout: 'border',
                    items: [
                        {
                            title: '생산 1팀 제품 및 인원배치',
                            collapsible: false,
                            frame: false,
                            region: 'west',
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            margin: '3 0 0 0',
                            width: '100%',
                            items: [{
                                region: 'west',
                                layout: 'fit',
                                margin: '0 0 0 0',
                                width: '100%',
                                items: [oneTeamGrid]
                            }]
                        }, oneTeamBatch
                    ]
                });

                var twoTeamGrid = Ext.create('Ext.grid.Panel', {
                    layout: 'fit',
                    store: new Ext.data.Store(),
                    id: gu.id('twoTeamGrid'),
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
                                    text: '+',
                                    listeners: [{
                                        click: function () {
                                            var store = gu.getCmp('twoTeamGrid').getStore();
                                            store.insert(store.getCount(), new Ext.data.Record({
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
                                            var record = gu.getCmp('twoTeamGrid').getSelectionModel().getSelected().items[0];
                                            var store = gu.getCmp('twoTeamGrid').getStore();
                                            if (record == null) {
                                                gu.getCmp('twoTeamGrid').getStore().remove(store.last());
                                            } else {
                                                gu.getCmp('twoTeamGrid').getStore().removeAt(gu.getCmp('oneTeamBatchGrid').getStore().indexOf(record));
                                            }
                                        }
                                    }]
                                },
                                {
                                    text: '▲',
                                    listeners: [{
                                        click: function () {
                                            var direction = -1;
                                            var grid = gu.getCmp('twoTeamGrid');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                },
                                {
                                    text: '▼',
                                    listeners: [{
                                        click: function () {
                                            var direction = 1;
                                            var grid = gu.getCmp('twoTeamGrid');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                }

                            ]
                        })
                    ],
                    columns: [
                        {
                            text: '제품명',
                            width: '60%',
                            css: 'edit-cell',
                            dataIndex: 'item_name',
                            style: 'text-align:center',
                            editor: {
                                xtype: 'combo',
                                // id: gu.id('item_paycond_combo'),
                                displayField: 'item_name',
                                editable: true,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().presentPlanPrdStore,
                                triggerAction: 'all',
                                valueField: 'unique_id',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{item_name} ({item_quan} 개) / {reserved_timestamp1_str} </div>';
                                    }
                                },
                            },
                            listeners: {

                            },
                            renderer: function (val) {
                                var recordIndex = gm.me().presentPlanPrdStore.find('unique_id_long', val);
                                console_logs('>>>> recordIndex ', recordIndex);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                // twoTeamGrid.getSelection()[0].set('item_name', gm.me().presentPlanPrdStore.getAt(recordIndex).get('item_name'));
                                twoTeamGrid.getSelection()[0].set('item_quan', gm.me().presentPlanPrdStore.getAt(recordIndex).get('item_quan'));
                                return gm.me().presentPlanPrdStore.getAt(recordIndex).get('item_name');
                            },

                            sortable: true
                        },
                        { text: '수량(Box)', flex: 1.5, style: 'text-align:center', dataIndex: 'item_quan', sortable: true },

                    ],
                    selModel: 'cellmodel',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                }); // endof Ext.create('Ext.grid.Panel',

                var twoTeamBatch = Ext.create('Ext.grid.Panel', {
                    // region: 'east',
                    style: 'padding-height:20px;',
                    margin: '50 0 0 0',
                    id: gu.id('twoTeamBatch'),
                    store: new Ext.data.Store(),
                    columns: [
                        {
                            text: gm.me().getMC('msg_product_add_dia_div', '역할'),
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'role',
                            //  xtype : 'textfield',
                            sortable: true,
                            editor: {

                            }
                        },
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '작업자'),
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'worker',
                            sortable: true,
                            editor: {
                                xtype: 'combo',
                                // id: gu.id('item_paycond_combo'),
                                displayField: 'user_name',
                                editable: true,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().teamTwoPeopleStore,
                                triggerAction: 'all',
                                valueField: 'unique_id',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{user_name}</div>';
                                    }
                                },
                            },
                            listeners: {

                            },
                            renderer: function (val) {
                                var recordIndex = gm.me().teamTwoPeopleStore.find('unique_id_long', val);
                                console_logs('>>>> recordIndex ', recordIndex);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                // twoTeamBatch.getSelection()[0].set('user_name', gm.me().teamTwoPeopleStore.getAt(recordIndex).get('worker'));
                                return gm.me().teamTwoPeopleStore.getAt(recordIndex).get('user_name');
                            },
                        },
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '주/야간'),
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'work_type',
                            sortable: true,
                            editor: {
                                xtype: 'combo',
                                // id: gu.id('item_paycond_combo'),
                                displayField: 'code_name_kr',
                                editable: true,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().workTypeStore,
                                triggerAction: 'all',
                                valueField: 'system_code',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{code_name_kr}</div>';
                                    }
                                },
                            },
                            listeners: {

                            },
                            renderer: function (val) {
                                var recordIndex = gm.me().workTypeStore.find('system_code', val);
                                console_logs('>>>> recordIndex ', recordIndex);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                // twoTeamBatch.getSelection()[0].set('work_type', gm.me().workTypeStore.getAt(recordIndex).get('code_name_kr'));
                                return gm.me().workTypeStore.getAt(recordIndex).get('code_name_kr');
                            },
                        },
                    ],
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
                                            var store = gu.getCmp('twoTeamBatch').getStore();
                                            store.insert(store.getCount(), new Ext.data.Record({
                                                'role': '',
                                                'worker': '',
                                                'work_type': '',
                                            }));
                                        }
                                    }]
                                },
                                {
                                    text: '-',
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('twoTeamBatch').getSelectionModel().getSelected().items[0];
                                            var store = gu.getCmp('twoTeamBatch').getStore();
                                            if (record == null) {
                                                gu.getCmp('twoTeamBatch').getStore().remove(store.last());
                                            } else {
                                                gu.getCmp('twoTeamBatch').getStore().removeAt(gu.getCmp('twoTeamBatch').getStore().indexOf(record));
                                            }
                                        }
                                    }]
                                },
                                {
                                    text: '▲',
                                    listeners: [{
                                        click: function () {
                                            var direction = -1;
                                            var grid = gu.getCmp('twoTeamBatch');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                },
                                {
                                    text: '▼',
                                    listeners: [{
                                        click: function () {
                                            var direction = 1;
                                            var grid = gu.getCmp('twoTeamBatch');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                }

                            ]
                        })
                    ],
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                }); // endof Ext.create('Ext.grid.Panel',

                var twoTeam = Ext.create('Ext.panel.Panel', {
                    // layout: 'border',
                    items: [
                        {
                            title: '생산 2팀 제품 및 인원배치',
                            collapsible: false,
                            frame: false,
                            region: 'west',
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            margin: '3 0 0 0',
                            width: '100%',
                            items: [{
                                region: 'west',
                                layout: 'fit',
                                margin: '0 0 0 0',
                                width: '100%',
                                items: [twoTeamGrid]
                            }]
                        }, twoTeamBatch
                    ]
                });


                var threeTeamGrid = Ext.create('Ext.grid.Panel', {
                    layout: 'fit',
                    store: new Ext.data.Store(),
                    id: gu.id('threeTeamGrid'),
                    columns: [
                        {
                            text: '제품명',
                            width: '60%',
                            css: 'edit-cell',
                            dataIndex: 'item_name',
                            style: 'text-align:center',
                            editor: {
                                xtype: 'combo',
                                // id: gu.id('item_paycond_combo'),
                                displayField: 'item_name',
                                editable: true,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().presentPlanPrdStore,
                                triggerAction: 'all',
                                valueField: 'unique_id',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{item_name} ({item_quan} 개) / {reserved_timestamp1_str} </div>';
                                    }
                                },
                            },
                            listeners: {

                            },
                            renderer: function (val) {
                                var recordIndex = gm.me().presentPlanPrdStore.find('unique_id_long', val);
                                console_logs('>>>> recordIndex ', recordIndex);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                // threeTeamGrid.getSelection()[0].set('item_name', gm.me().presentPlanPrdStore.getAt(recordIndex).get('item_name'));
                                threeTeamGrid.getSelection()[0].set('item_quan', gm.me().presentPlanPrdStore.getAt(recordIndex).get('item_quan'));
                                return gm.me().presentPlanPrdStore.getAt(recordIndex).get('item_name');
                            },


                            sortable: false
                        },


                        { text: '수량(Box)', flex: 1.5, style: 'text-align:center', dataIndex: 'item_quan', sortable: true },

                    ],
                    selModel: 'cellmodel',
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
                                    text: '+',
                                    listeners: [{
                                        click: function () {
                                            var store = gu.getCmp('threeTeamGrid').getStore();
                                            store.insert(store.getCount(), new Ext.data.Record({
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
                                            var record = gu.getCmp('threeTeamGrid').getSelectionModel().getSelected().items[0];
                                            var store = gu.getCmp('threeTeamGrid').getStore();
                                            if (record == null) {
                                                gu.getCmp('threeTeamGrid').getStore().remove(store.last());
                                            } else {
                                                gu.getCmp('threeTeamGrid').getStore().removeAt(gu.getCmp('threeTeamGrid').getStore().indexOf(record));
                                            }
                                        }
                                    }]
                                },
                                {
                                    text: '▲',
                                    listeners: [{
                                        click: function () {
                                            var direction = -1;
                                            var grid = gu.getCmp('threeTeamGrid');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                },
                                {
                                    text: '▼',
                                    listeners: [{
                                        click: function () {
                                            var direction = 1;
                                            var grid = gu.getCmp('threeTeamGrid');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                }

                            ]
                        })
                    ],
                }); // endof Ext.create('Ext.grid.Panel',

                var threeTeamBatch = Ext.create('Ext.grid.Panel', {
                    // region: 'east',
                    style: 'padding-height:20px;',
                    margin: '50 0 0 0',
                    store: new Ext.data.Store(),
                    id: gu.id('threeTeamBatch'),
                    columns: [
                        {
                            text: gm.me().getMC('msg_product_add_dia_div', '역할'),
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'role',
                            //  xtype : 'textfield',
                            sortable: true,
                            editor: {

                            }
                        },
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '작업자'),
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'worker',
                            sortable: true,
                            editor: {
                                xtype: 'combo',
                                // id: gu.id('item_paycond_combo'),
                                displayField: 'user_name',
                                editable: true,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().teamThreePeopleStore,
                                triggerAction: 'all',
                                valueField: 'unique_id',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{user_name}</div>';
                                    }
                                },
                            },
                            listeners: {

                            },
                            renderer: function (val) {
                                var recordIndex = gm.me().teamThreePeopleStore.find('unique_id_long', val);
                                console_logs('>>>> recordIndex ', recordIndex);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                // threeTeamBatch.getSelection()[0].set('user_name', gm.me().teamThreePeopleStore.getAt(recordIndex).get('worker'));
                                return gm.me().teamThreePeopleStore.getAt(recordIndex).get('user_name');
                            },
                        },
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '주/야간'),
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'work_type',
                            sortable: true,
                            editor: {
                                xtype: 'combo',
                                // id: gu.id('item_paycond_combo'),
                                displayField: 'code_name_kr',
                                editable: true,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().workTypeStore,
                                triggerAction: 'all',
                                valueField: 'system_code',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{code_name_kr}</div>';
                                    }
                                },
                            },
                            listeners: {

                            },
                            renderer: function (val) {
                                var recordIndex = gm.me().workTypeStore.find('system_code', val);
                                console_logs('>>>> recordIndex ', recordIndex);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                // threeTeamBatch.getSelection()[0].set('work_type', gm.me().workTypeStore.getAt(recordIndex).get('code_name_kr'));
                                return gm.me().workTypeStore.getAt(recordIndex).get('code_name_kr');
                            },
                        },
                    ],
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
                                    text: '+',
                                    listeners: [{
                                        click: function () {
                                            var store = gu.getCmp('threeTeamBatch').getStore();
                                            store.insert(store.getCount(), new Ext.data.Record({
                                                'role': '',
                                                'worker': '',
                                                'work_type': '',
                                            }));
                                        }
                                    }]
                                },
                                {
                                    text: '-',
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('threeTeamBatch').getSelectionModel().getSelected().items[0];
                                            var store = gu.getCmp('threeTeamBatch').getStore();
                                            if (record == null) {
                                                gu.getCmp('threeTeamBatch').getStore().remove(store.last());
                                            } else {
                                                gu.getCmp('threeTeamBatch').getStore().removeAt(gu.getCmp('threeTeamBatch').getStore().indexOf(record));
                                            }
                                        }
                                    }]
                                },
                                {
                                    text: '▲',
                                    listeners: [{
                                        click: function () {
                                            var direction = -1;
                                            var grid = gu.getCmp('threeTeamBatch');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                },
                                {
                                    text: '▼',
                                    listeners: [{
                                        click: function () {
                                            var direction = 1;
                                            var grid = gu.getCmp('threeTeamBatch');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                }

                            ]
                        })
                    ],
                }); // endof Ext.create('Ext.grid.Panel',

                var threeTeam = Ext.create('Ext.panel.Panel', {
                    // layout: 'border',
                    items: [
                        {
                            title: '생산 3팀 제품 및 인원배치',
                            collapsible: false,
                            frame: false,
                            region: 'west',
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            margin: '3 0 0 0',
                            width: '100%',
                            items: [{
                                region: 'west',
                                layout: 'fit',
                                margin: '0 0 0 0',
                                width: '100%',
                                items: [threeTeamGrid]
                            }]
                        }, threeTeamBatch
                    ]
                });

                var fourTeamGrid = Ext.create('Ext.grid.Panel', {
                    layout: 'fit',
                    id: gu.id('fourTeamGrid'),
                    store: new Ext.data.Store(),
                    columns: [
                        {
                            text: '제품명',
                            width: '60%',
                            css: 'edit-cell',
                            dataIndex: 'item_name',
                            style: 'text-align:center',
                            editor: {
                                xtype: 'combo',
                                // id: gu.id('item_paycond_combo'),
                                displayField: 'item_name',
                                editable: true,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().presentPlanPrdStore,
                                triggerAction: 'all',
                                valueField: 'unique_id',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{item_name} ({item_quan} 개) / {reserved_timestamp1_str} </div>';
                                    }
                                },
                            },
                            listeners: {

                            },
                            renderer: function (val) {
                                var recordIndex = gm.me().presentPlanPrdStore.find('unique_id_long', val);
                                console_logs('>>>> recordIndex ', recordIndex);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                // fourTeamGrid.getSelection()[0].set('item_name', gm.me().presentPlanPrdStore.getAt(recordIndex).get('item_name'));
                                fourTeamGrid.getSelection()[0].set('item_quan', gm.me().presentPlanPrdStore.getAt(recordIndex).get('item_quan'));
                                return gm.me().presentPlanPrdStore.getAt(recordIndex).get('item_name');
                            },


                            sortable: false
                        },


                        { text: '수량(Box)', flex: 1.5, style: 'text-align:center', dataIndex: 'item_quan', sortable: true },

                    ],
                    selModel: 'cellmodel',
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
                                    text: '+',
                                    listeners: [{
                                        click: function () {
                                            var store = gu.getCmp('fourTeamGrid').getStore();
                                            store.insert(store.getCount(), new Ext.data.Record({
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
                                            var record = gu.getCmp('fourTeamGrid').getSelectionModel().getSelected().items[0];
                                            var store = gu.getCmp('fourTeamGrid').getStore();
                                            if (record == null) {
                                                gu.getCmp('fourTeamGrid').getStore().remove(store.last());
                                            } else {
                                                gu.getCmp('fourTeamGrid').getStore().removeAt(gu.getCmp('fourTeamGrid').getStore().indexOf(record));
                                            }
                                        }
                                    }]
                                },
                                {
                                    text: '▲',
                                    listeners: [{
                                        click: function () {
                                            var direction = -1;
                                            var grid = gu.getCmp('fourTeamGrid');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                },
                                {
                                    text: '▼',
                                    listeners: [{
                                        click: function () {
                                            var direction = 1;
                                            var grid = gu.getCmp('fourTeamGrid');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                }

                            ]
                        })
                    ],
                }); // endof Ext.create('Ext.grid.Panel',

                var fourTeamBatch = Ext.create('Ext.grid.Panel', {
                    // region: 'east',
                    style: 'padding-height:20px;',
                    store: new Ext.data.Store(),
                    id: gu.id('fourTeamBatch'),
                    margin: '50 0 0 0',
                    columns: [
                        {
                            text: gm.me().getMC('msg_product_add_dia_div', '역할'),
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'role',
                            //  xtype : 'textfield',
                            sortable: true,
                            editor: {

                            }
                        },
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '작업자'),
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'worker',
                            sortable: true,
                            editor: {
                                xtype: 'combo',
                                // id: gu.id('item_paycond_combo'),
                                displayField: 'user_name',
                                editable: true,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().teamFourPeopleStore,
                                triggerAction: 'all',
                                valueField: 'unique_id',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{user_name}</div>';
                                    }
                                },
                            },
                            listeners: {

                            },
                            renderer: function (val) {
                                var recordIndex = gm.me().teamFourPeopleStore.find('unique_id_long', val);
                                console_logs('>>>> recordIndex ', recordIndex);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                // fourTeamBatch.getSelection()[0].set('user_name', gm.me().teamFourPeopleStore.getAt(recordIndex).get('worker'));
                                return gm.me().teamFourPeopleStore.getAt(recordIndex).get('user_name');
                            },
                        },
                        {
                            text: gm.me().getMC('msg_product_add_dia_model', '주/야간'),
                            flex: 1.0,
                            style: 'text-align:center',
                            dataIndex: 'work_type',
                            sortable: true,
                            editor: {
                                xtype: 'combo',
                                // id: gu.id('item_paycond_combo'),
                                displayField: 'code_name_kr',
                                editable: true,
                                forceSelection: true,
                                // mode: 'local',
                                store: gm.me().workTypeStore,
                                triggerAction: 'all',
                                valueField: 'system_code',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div data-qtip="{unique_id}">{code_name_kr}</div>';
                                    }
                                },
                            },
                            listeners: {

                            },
                            renderer: function (val) {
                                var recordIndex = gm.me().workTypeStore.find('system_code', val);
                                console_logs('>>>> recordIndex ', recordIndex);
                                if (recordIndex === -1) {
                                    return '';
                                }
                                // fourTeamBatch.getSelection()[0].set('work_type', gm.me().workTypeStore.getAt(recordIndex).get('code_name_kr'));
                                return gm.me().workTypeStore.getAt(recordIndex).get('code_name_kr');
                            },
                        },
                    ],
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
                                    text: '+',
                                    listeners: [{
                                        click: function () {
                                            var store = gu.getCmp('fourTeamBatch').getStore();
                                            store.insert(store.getCount(), new Ext.data.Record({
                                                'role': '',
                                                'worker': '',
                                                'work_type': '',
                                            }));
                                        }
                                    }]
                                },
                                {
                                    text: '-',
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('fourTeamBatch').getSelectionModel().getSelected().items[0];
                                            var store = gu.getCmp('fourTeamBatch').getStore();
                                            if (record == null) {
                                                gu.getCmp('fourTeamBatch').getStore().remove(store.last());
                                            } else {
                                                gu.getCmp('fourTeamBatch').getStore().removeAt(gu.getCmp('fourTeamBatch').getStore().indexOf(record));
                                            }
                                        }
                                    }]
                                },
                                {
                                    text: '▲',
                                    listeners: [{
                                        click: function () {
                                            var direction = -1;
                                            var grid = gu.getCmp('fourTeamBatch');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                },
                                {
                                    text: '▼',
                                    listeners: [{
                                        click: function () {
                                            var direction = 1;
                                            var grid = gu.getCmp('fourTeamBatch');
                                            var record = grid.getSelectionModel().getSelected().items[0];
                                            if (!record) {
                                                return;
                                            }

                                            var index = grid.getStore().indexOf(record);
                                            if (direction < 0) {
                                                index--;
                                                if (index < 0) {
                                                    return;
                                                }
                                            } else {
                                                index++;
                                                if (index >= grid.getStore().getCount()) {
                                                    return;
                                                }
                                            }
                                            grid.getStore().remove(record);
                                            grid.getStore().insert(index, record);
                                            grid.getSelectionModel().select(index, true);
                                        }
                                    }]
                                }

                            ]
                        })
                    ],
                }); // endof Ext.create('Ext.grid.Panel',

                var fourTeam = Ext.create('Ext.panel.Panel', {
                    // layout: 'border',
                    items: [
                        {
                            title: '생산 4팀 제품 및 인원배치',
                            collapsible: false,
                            frame: false,
                            region: 'west',
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            margin: '3 0 0 0',
                            width: '100%',
                            items: [{
                                region: 'west',
                                layout: 'fit',
                                margin: '0 0 0 0',
                                width: '100%',
                                items: [fourTeamGrid]
                            }]
                        }, fourTeamBatch
                    ]
                });



                var partGridWidth = '20%';
                var searchItemGrid = Ext.create('Ext.tab.Panel', {
                    layout: 'fit',
                    title: '팀별 인원배치',
                    layout: 'border',
                    items: [
                        {
                            title: '생산 1팀',
                            items: [oneTeam],
                            scrollable: {
                                y: 'scroll'
                            }
                        }, {
                            title: '생산 2팀',
                            items: [twoTeam],
                            scrollable: {
                                y: 'scroll'
                            }
                        }, {
                            title: '생산 3팀',
                            items: [threeTeam],
                            scrollable: {
                                y: 'scroll'
                            }
                        }, {
                            title: '생산 4팀',
                            items: [fourTeam],
                            scrollable: {
                                y: 'scroll'
                            }
                        },
                    ],
                    width: 700,
                    height: 526,
                }); // endof Ext.create('Ext.grid.Panel',

                var saveForm = Ext.create('Ext.form.Panel', {
                    // store: saveStore,
                    id: gu.id('saveFormGrid'),
                    layout: 'fit',
                    title: '추가정보 입력',
                    region: 'east',
                    style: 'padding-left:10px;',
                    renderTo: Ext.getBody(),
                    autoScroll: true,
                    pageSize: 100,
                    width: 400,
                    height: 600,
                    items: [
                        {
                            xtype: 'container',
                            width: '100%',
                            // margin: '0 10 10 1',
                            border: true,
                            defaultMargins: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 10
                            },
                            items: [
                                {
                                    xtype: 'textarea',
                                    id: gu.id('etc_comment'),
                                    name: 'etc_comment',
                                    padding: '0 0 5px 30px',
                                    width: '85%',
                                    height: '30%',
                                    allowBlank: true,
                                    fieldLabel: gm.me().getMC('msg_order_dia_order_po_no', '특이사항 입력'),
                                },
                            ]
                        }
                    ]

                }); // endof Ext.create('Ext.grid.Panel',

                saveForm.on('edit', function (editor, e) {
                    var rec = e.record;
                    var field = e['field'];
                    rec.set(field, rec.get(field));
                });

                var winProduct = Ext.create('ModalWindow', {
                    title: '일일 인원배치',
                    width: 1100,
                    height: 600,
                    overflowY: 'scroll',
                    minWidth: 600,
                    minHeight: 300,
                    items: [
                        searchItemGrid, saveForm
                    ],
                    buttons: [
                        {
                            text: CMD_OK,
                            handler: function (btn) {
                                var storeDataOneTeam = gu.getCmp('oneTeamGrid').getStore();
                                var objsOne = [];
                                var columnsOneTeam = [];
                                var objOne = {};
                                var jsonData1Team = '';
                                var oneTeamPlanCnt = storeDataOneTeam.data.items.length;
                                if (oneTeamPlanCnt > 0) {
                                    for (var i = 0; i < storeDataOneTeam.data.items.length; i++) {
                                        var item = storeDataOneTeam.data.items[i];
                                        var objvOne = {};
                                        objvOne['plan_uid'] = item.get('item_name');
                                        objvOne['item_quan'] = item.get('item_quan');
                                        columnsOneTeam.push(objvOne);
                                    }
                                    objOne['team1'] = columnsOneTeam;
                                    objsOne.push(objOne);
                                    jsonData1Team = Ext.util.JSON.encode(objsOne);
                                }

                                console_logs('>>> jsonData1Team', jsonData1Team);

                                var storeDataTwoTeam = gu.getCmp('twoTeamGrid').getStore();
                                var objsTwo = [];
                                var columnsTwoTeam = [];
                                var objTwo = {};
                                var jsonData2Team = '';
                                var twoTeamPlanCnt = storeDataTwoTeam.data.items.length;
                                if (twoTeamPlanCnt > 0) {
                                    for (var i = 0; i < storeDataTwoTeam.data.items.length; i++) {
                                        var item = storeDataTwoTeam.data.items[i];
                                        var objvOne = {};
                                        objvOne['plan_uid'] = item.get('item_name');
                                        objvOne['item_quan'] = item.get('item_quan');
                                        columnsTwoTeam.push(objvOne);
                                    }
                                    objTwo['team2'] = columnsTwoTeam;
                                    objsTwo.push(objTwo);
                                    jsonData2Team = Ext.util.JSON.encode(objsTwo);
                                }

                                console_logs('>>> jsonData2Team', jsonData2Team);

                                var storeDataThreeTeam = gu.getCmp('threeTeamGrid').getStore();
                                var objsThree = [];
                                var columnsThreeTeam = [];
                                var objThree = {};
                                var jsonData3Team = '';
                                var threeTeamPlanCnt = storeDataThreeTeam.data.items.length;
                                if (threeTeamPlanCnt > 0) {
                                    for (var i = 0; i < storeDataThreeTeam.data.items.length; i++) {
                                        var item = storeDataThreeTeam.data.items[i];
                                        var objvOne = {};
                                        objvOne['plan_uid'] = item.get('item_name');
                                        objvOne['item_quan'] = item.get('item_quan');
                                        columnsThreeTeam.push(objvOne);
                                    }
                                    objThree['team3'] = columnsThreeTeam;
                                    objsThree.push(objThree);
                                    jsonData3Team = Ext.util.JSON.encode(objsThree);
                                }

                                console_logs('>>> jsonData3Team', jsonData3Team);

                                var storeDataFourTeam = gu.getCmp('fourTeamGrid').getStore();
                                var objsFour = [];
                                var columnsFourTeam = [];
                                var objFour = {};
                                var jsonData4Team = '';
                                var fourTeamPlanCnt = storeDataFourTeam.data.items.length;
                                if (fourTeamPlanCnt > 0) {
                                    for (var i = 0; i < storeDataFourTeam.data.items.length; i++) {
                                        var item = storeDataFourTeam.data.items[i];
                                        var objvOne = {};
                                        objvOne['plan_uid'] = item.get('item_name');
                                        objvOne['item_quan'] = item.get('item_quan');
                                        columnsFourTeam.push(objvOne);
                                    }
                                    objFour['team4'] = columnsFourTeam;
                                    objsFour.push(objFour);
                                    jsonData4Team = Ext.util.JSON.encode(objsFour);
                                }

                                console_logs('>>> jsonData4Team', jsonData4Team);

                                var jsonData1Batch = '';
                                if (jsonData1Team.length > 0) {
                                    var storeDataOneTeamBatch = gu.getCmp('oneTeamBatchGrid').getStore();
                                    var oneTeamBatchCnt = storeDataOneTeamBatch.data.items.length;
                                    if (oneTeamBatchCnt > 0) {
                                        var objsBOne = [];
                                        var columnsBOneTeam = [];
                                        var objBOne = {};
                                        for (var i = 0; i < storeDataOneTeamBatch.data.items.length; i++) {
                                            var item = storeDataOneTeamBatch.data.items[i];
                                            var objvOne = {};
                                            objvOne['role'] = item.get('role');
                                            objvOne['worker'] = item.get('worker');
                                            objvOne['work_type'] = item.get('work_type');
                                            columnsBOneTeam.push(objvOne);
                                        }
                                        objBOne['team1Batch'] = columnsBOneTeam;
                                        objsBOne.push(objBOne);
                                        jsonData1Batch = Ext.util.JSON.encode(objsBOne);
                                    } else {
                                        Ext.MessageBox.alert('알림', '생산 1팀에 입력된 인원이 없습니다.');
                                        return;
                                    }
                                }

                                var jsonData2Batch = '';
                                if (jsonData2Team.length > 0) {
                                    var storeDataTwoTeamBatch = gu.getCmp('twoTeamBatch').getStore();
                                    var twoTeamBatchCnt = storeDataTwoTeamBatch.data.items.length;
                                    if (twoTeamBatchCnt > 0) {
                                        var objsBTwo = [];
                                        var columnsBTwoTeam = [];
                                        var objBTwo = {};
                                        for (var i = 0; i < storeDataTwoTeamBatch.data.items.length; i++) {
                                            var item = storeDataTwoTeamBatch.data.items[i];
                                            var objvOne = {};
                                            objvOne['role'] = item.get('role');
                                            objvOne['worker'] = item.get('worker');
                                            objvOne['work_type'] = item.get('work_type');
                                            columnsBTwoTeam.push(objvOne);
                                        }
                                        objBTwo['team2Batch'] = columnsBTwoTeam;
                                        objsBTwo.push(objBTwo);
                                        jsonData2Batch = Ext.util.JSON.encode(objsBTwo);
                                    } else {
                                        Ext.MessageBox.alert('알림', '생산 2팀에 입력된 인원이 없습니다.');
                                        return;
                                    }
                                }

                                var jsonData3Batch = '';
                                if (jsonData3Team.length > 0) {
                                    var storeDataThreeTeamBatch = gu.getCmp('threeTeamBatch').getStore();
                                    var threeTeamBatchCnt = storeDataThreeTeamBatch.data.items.length;
                                    if (threeTeamBatchCnt > 0) {
                                        var objsBThree = [];
                                        var columnsBThreeTeam = [];
                                        var objBThree = {};
                                        for (var i = 0; i < storeDataThreeTeamBatch.data.items.length; i++) {
                                            var item = storeDataThreeTeamBatch.data.items[i];
                                            var objvOne = {};
                                            objvOne['role'] = item.get('role');
                                            objvOne['worker'] = item.get('worker');
                                            objvOne['work_type'] = item.get('work_type');
                                            columnsBThreeTeam.push(objvOne);
                                        }
                                        objBThree['team2Batch'] = columnsBThreeTeam;
                                        objsBThree.push(objBThree);
                                        jsonData3Batch = Ext.util.JSON.encode(objsBThree);
                                    } else {
                                        Ext.MessageBox.alert('알림', '생산 3팀에 입력된 인원이 없습니다.');
                                        return;
                                    }
                                }


                                var jsonData4Batch = '';
                                if (jsonData4Team.length > 0) {
                                    var storeDataFourTeamBatch = gu.getCmp('fourTeamBatch').getStore();
                                    var fourTeamBatchCnt = storeDataFourTeamBatch.data.items.length;
                                    if (fourTeamBatchCnt > 0) {
                                        var objsBFour = [];
                                        var columnsBFourTeam = [];
                                        var objBFour = {};
                                        for (var i = 0; i < storeDataFourTeamBatch.data.items.length; i++) {
                                            var item = storeDataFourTeamBatch.data.items[i];
                                            var objvOne = {};
                                            objvOne['role'] = item.get('role');
                                            objvOne['worker'] = item.get('worker');
                                            objvOne['work_type'] = item.get('work_type');
                                            columnsBFourTeam.push(objvOne);
                                        }
                                        objBFour['team2Batch'] = columnsBFourTeam;
                                        objsBFour.push(objBFour);
                                        jsonData4Batch = Ext.util.JSON.encode(objsBFour);
                                    } else {
                                        Ext.MessageBox.alert('알림', '생산 4팀에 입력된 인원이 없습니다.');
                                        return;
                                    }
                                }

                                var etc_comment = gu.getCmp('etc_comment').getValue();
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/index/process.do?method=addDailyWorkerBatch',
                                    params: {
                                        jsonData1Team: jsonData1Team,
                                        jsonData2Team: jsonData2Team,
                                        jsonData3Team: jsonData3Team,
                                        jsonData4Team: jsonData4Team,
                                        jsonData1Batch: jsonData1Batch,
                                        jsonData2Batch: jsonData2Batch,
                                        jsonData3Batch: jsonData3Batch,
                                        jsonData4Batch: jsonData4Batch,
                                        etc_comment: etc_comment
                                    },

                                    success: function (result, request) {
                                        gm.me().store.load();
                                        Ext.Msg.alert('안내', '인원 배치 배치 완료되었습니다.', function () {
                                        });
                                        winProduct.close();
                                    },//endofsuccess
                                    failure: extjsUtil.failureMessage
                                });
                            }
                        }, {
                            text: CMD_CANCEL,
                            handler: function (btn) {
                                winProduct.close();
                            }
                        }]
                });
                winProduct.show();

            }
        });

        workOrder = this.addWorkOrder;

        is_rotate = 'N';

        var processes = null;
        if (gUtil.mesTplProcessBig != null && gUtil.mesTplProcessBig.length > 0) {
            processes = gUtil.mesTplProcessBig;
        } else {
        }

        if (processes != null) {

            for (var i = processes.length - 1; i >= 0; i--) {
                var o = processes[i];
                var big_pcs_code = o['code'];
                var title = /*'[' + o['code'] + ']' +*/ o['name'];
                console_logs('title', title);

                var action = Ext.create('Ext.Action', {
                    xtype: 'button',
                    text: title,
                    tooltip: title + ' 공정',
                    big_pcs_code: big_pcs_code,
                    toggleGroup: this.link + 'bigPcsType',
                    handler: function () {
                        gm.me().setBigPcsCode(this.big_pcs_code);
                    }
                });

                buttonToolbar.insert(4, action);
            }
            var action = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '전체',
                tooltip: '전체',
                big_pcs_code: '',
                pressed: true,
                toggleGroup: this.link + 'bigPcsType',
                handler: function () {
                    gm.me().setBigPcsCode(this.big_pcs_code);
                }
            });

            buttonToolbar.insert(4, action);
        }

        //버튼 추가.
        buttonToolbar.insert(1, this.printProduceExcelAction);
        // buttonToolbar.insert(1, this.printPDFAction);
        //buttonToolbar.insert(1, this.batchPrdTeam);
        //buttonToolbar.insert(1, this.addWorkOrder);
        //buttonToolbar.insert(2, this.denyWorkOrder);

        // buttonToolbar.insert(1, this.modifyDepartment);
        buttonToolbar.insert(1, '-');

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            // gm.me().denyWorkOrder.disable();
            if (selections.length) {
                var rec = selections[0];

                gm.me().big_pcs_code = rec.get('po_type');

                gm.me().vSELECTED_RTGAST_UID = rec.get('unique_id');
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                console_logs('rec>>>>>>>>>', rec);
                gm.me().vSELECTED_PO_NO = rec.get('pj_code');
                // gm.me().printPDFAction.enable();
                gm.me().vSELECTED_PCS_CODE = rec.get('pcs_code');
                gm.me().vSELECTED_STATE = rec.get('state'); //product의 item_code
                console_logs('>>>>>>> SELECTED_STATE', rec.get('state'))

                if (gm.me().vSELECTED_STATE == 'I') {
                    this.refreshButtons(true);
                    gm.me().addWorkOrder.enable();
                    gm.me().denyWorkOrder.enable();

                    // gm.me().printPDFAction.disable();
                } else if (gm.me().vSELECTED_STATE == 'N') {
                    this.refreshButtons(true);
                    gm.me().denyWorkOrder.disable();
                    // gm.me().printPDFAction.enable();
                    // gm.me().finishWorkOrder.enable();
                } else {
                    gm.me().addWorkOrder.disable();
                    gm.me().denyWorkOrder.disable();
                    // gm.me().printPDFAction.enable();
                    // gm.me().finishWorkOrder.enable();
                }
                gm.me().stockGrid.getStore().getProxy().setExtraParam('pr_uid', gm.me().vSELECTED_RTGAST_UID);
                gm.me().stockGrid.getStore().load();
            } else {
                this.refreshButtons(false);
                gm.me().vSELECTED_UNIQUE_ID = -1
            }

        });

        this.createCrudTab();

        this.grid.preserveScrollOnRefresh = true;

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.createEast(), this.crudTab]
        });

        this.callParent(arguments);

        //디폴트 로딩
        gMain.setCenterLoading(true);

        this.grid.getStore().getProxy().setExtraParam('po_type', '');
        this.storeLoad();
    },
    
    createEast: function () {
        this.stockGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            title: '재고상세',
            store: Ext.create('Rfx2.store.company.bioprotech.DetailStockStore'),
            width: '35%',
            region: 'east',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            layout: 'fit',
            forceFit: false,
            columns: [
                {
                    text: '품번',
                    dataIndex: 'item_code',
                    flex: 0.5,
                    style: 'text-align:center',
                },
                {
                    text: '품명',
                    dataIndex: 'item_name',
                    flex: 1,
                    style: 'text-align:center',
                },
                {
                    text: '재고',
                    dataIndex: 'dtl_qty',
                    flex: 0.5,
                    style: 'text-align:center',
                },
                {
                    text: '일부인',
                    dataIndex: 'exp_date',
                    flex: 0.7,
                    style: 'text-align:center',
                },
            ]
        })
        return this.stockGrid;
    },

    selectPcsRecord: null,

    items: [],

    potype: '',

    addTabworkOrderGridPanel: function (title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: { menuCode: menuCode },
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                if (success == true) {
                    this.callBackWorkList(title, records, arg, fc, id);
                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });

    },

    addWorkOrderFc: function () {

        console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);

        var rtgastUid = this.vSELECTED_RECORD.get('unique_id');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=addWorkOrderHeavy',
            params: {
                rtgastUid: rtgastUid
            },

            success: function (result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.', function () {
                });

            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax

    },

    denyWorkOrderFc: function () {
        console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
        // console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);
        var rtgastUid = this.vSELECTED_RECORD.get('unique_id');
        var po_type = this.vSELECTED_RECORD.get('po_type');

        var cartmap_uid = this.vSELECTED_RECORD.get('coord_key1');
        var item_quan = this.vSELECTED_RECORD.get('item_quan');
        // var assymap_uid = this.vSELECTED_RECORD.get('coord_key'); 
        // 수주 생산일 경우
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderProd',
            params: {
                rtgastUid: rtgastUid,
                cartmap_uid: cartmap_uid,
                item_quan: item_quan
            },
            success: function (result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.', function () {
                });
            },
            failure: extjsUtil.failureMessage
        });


        // if (po_type === 'HOD' || po_type === 'COD') {
        //     var cartmap_uid = this.vSELECTED_RECORD.get('coord_key1');
        //     var item_quan = this.vSELECTED_RECORD.get('item_quan');
        //     // var assymap_uid = this.vSELECTED_RECORD.get('coord_key'); 
        //     // 수주 생산일 경우
        //     Ext.Ajax.request({
        //         url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderProd',
        //         params: {
        //             rtgastUid: rtgastUid,
        //             cartmap_uid: cartmap_uid,
        //             item_quan: item_quan
        //         },
        //         success: function (result, request) {
        //             gm.me().store.load();
        //             Ext.Msg.alert('안내', '요청하였습니다.', function () {
        //             });
        //         },
        //         failure: extjsUtil.failureMessage
        //     });
        // } else if (po_type === 'HSC' || po_type === 'CSC') {
        //     var srcahd_uid = this.vSELECTED_RECORD.get('uid_srcahd');
        //     var prev_rtgast_uid = this.vSELECTED_RECORD.get('coord_key2');
        //     var rtgast_uid = this.vSELECTED_RECORD.get('unique_id_long');
        //     // 계획생산 일 경우
        //     Ext.Ajax.request({
        //         url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderAssy',
        //         params: {
        //             srcahd_uid: srcahd_uid,
        //             prev_rtgast_uid: prev_rtgast_uid,
        //             rtgast_uid: rtgast_uid
        //         },
        //         success: function (result, request) {
        //             gm.me().store.load();
        //             Ext.Msg.alert('안내', '요청하였습니다.', function () {
        //             });
        //         },
        //         failure: extjsUtil.failureMessage
        //     });
        // }

    },

    treatWorkStart: function (o, rec) {
        console_logs('rec ????', rec)
        //다수협력사지정
        var itemsPartner = [];
        var pcs_steel = [];
        var big_pcs_code = o;

        for (var i = 0; i < big_pcs_code['datas'].length; i++) {
            pcs_steel = Ext.Array.merge(pcs_steel, gUtil.mesTplProcessAll[big_pcs_code['datas'][i]]);
        }

        itemsPartner.push(
            {
                fieldLabel: '작업지시일',
                xtype: 'datefield',
                anchor: '100%',
                name: 'reserved_timestamp1',
                fieldStyle: 'background-color: #ddd; background-image: none;',
                value: new Date(),
                format: 'Y-m-d',
                readOnly: true,
                submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            });

        itemsPartner.push({

            fieldLabel: '긴급여부',//ppo1_request,
            xtype: 'combo',
            anchor: '100%',
            name: 'recv_flagname',
            mode: 'local',
            value: '일반',
            store: Ext.create('Mplm.store.HeavyEmergency'),
            sortInfo: { field: 'create_date', direction: 'DESC' },
            //valueField : 'system_code',
            displayField: 'code_name_kr',
            typeAhead: false,
            minChars: 1,
            listConfig: {
                loadingText: '검색중...',
                emptyText: '일치하는 항목 없음.',
                getInnerTpl: function () {
                    return '<div data-qtip="{unique_id}">[{system_code}] {code_name_kr}</div>';
                }
            },
            listeners: {
                select: function (combo, record) {
                    var reccode = record.get('system_code');
                    Ext.getCmp('recv_flag').setValue(reccode);
                }
            }
        }, {
            xtype: 'hiddenfield',
            id: 'recv_flag',
            name: 'recv_flag',
            value: 'GE'
        }
            //     fieldLabel: '부서',//ppo1_request,
            //     xtype: 'combo',
            //     anchor: '100%',
            //     name: 'dept_team',
            //     mode: 'local',
            //     store: Ext.create('Rfx2.store.company.sejun.DeptNameStore'),
            //     sortInfo: { field: 'create_date', direction: 'DESC' },
            //     valueField : 'unique_id_long',
            //     displayField: 'dept_name',
            //     typeAhead: false,
            //     minChars: 1,
            //     listConfig: {
            //         loadingText: '검색중...',
            //         emptyText: '일치하는 항목 없음.',
            //         getInnerTpl: function () {
            //             return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
            //         }
            //     },
            //     listeners: {
            //         select: function (combo, record) {
            //             var reccode = record.get('system_code');
            //             Ext.getCmp('recv_flag').setValue(reccode);
            //         }
            //     }
            // },{
            //     fieldLabel: '인원 수',
            //     xtype: 'numberfield',
            //     anchor: '100%',
            //     name: 'member_cnt',
            //     value: '0',
            //     minValue:'0'
            // }
        );

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                margins: 10,
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: gm.getMC('CMD_Job_Confirm', '작업지시'),
                    defaultType: 'textfield',
                    items: itemsPartner
                },
            ]//item end..
        });//Panel end...
        myHeight = 180;
        myWidth = 320;

        prwin = gm.me().prwinopen(form);
    },
    pdfprintHandler: function () {
        var rtgast_uid = gm.me().vSELECTED_RTGAST_UID;
        var po_no = gm.me().vSELECTED_PO_NO;
        var pcs_code = gm.me().vSELECTED_PCS_CODE;
        var ac_uid = gm.me().vSELECTED_AC_UID;
        console_logs('pdf pcs_code>>>>>>>>>>>>>>>>>>>', pcs_code);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/pdf.do?method=printWo',
            params: {
                rtgast_uid: rtgast_uid,
                po_no: po_no,
                pcs_code: pcs_code,
                ac_uid: ac_uid,
                is_heavy: 'Y',	 //중공업:Y  기타:N
                is_rotate: 'Y', //가로양식:Y 세로양식:N
                specification: gm.me().selectSpecification,
                pdfPrint: 'pdfPrint'
            },
            reader: {
                pdfPath: 'pdfPath'
            },
            success: function (result, request) {
                var jsonData = Ext.JSON.decode(result.responseText);
                var pdfPath = jsonData.pdfPath;
                console_logs(pdfPath);
                if (pdfPath.length > 0) {
                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                    top.location.href = url;
                }
            },
            failure: extjsUtil.failureMessage
        });
    },
    prwinopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: gm.getMC('CMD_Job_Confirm', '작업지시'),
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var msg = '작업지시를 하시겠습니까?'
                    var myTitle = '작업지시';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no") {
                                MessageBox.close();
                            } else {
                                var form = gu.getCmp('formPanel').getForm();
                                var ac_uid = gm.me().vSELECTED_AC_UID;
                                var rtgastUid = gm.me().vSELECTED_RTGAST_UID;
                                var selections = gm.me().grid.getSelectionModel().getSelection();
                                var rtgastUids = [];
                                var ac_uids = [];
                                var order_number = ''
                                var srcahd_uid = '';
                                var pi_number = '';
                                var item_quan = '';
                                var po_type = '';
                                var specification = '';
                                var line_code = '';
                                var assymap_uid = '';
                                var cartmap_uid = '';
                                var reserved_varchar2 = '';
                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];
                                    console_logs('rec', rec);
                                    var uid = rec.get('unique_id');  //rtgast_uid
                                    rtgastUids.push(uid);
                                    var ac_uid = rec.get('coord_key3');   //프로젝트 uid
                                    ac_uids.push(ac_uid);
                                    order_number = rec.get('order_number');
                                    srcahd_uid = rec.get('srcahd_uid');
                                    pi_number = rec.get('reserved_varchar1');
                                    item_quan = rec.get('item_quan');
                                    po_type = rec.get('po_type');
                                    specification = rec.get('specification');
                                    line_code = rec.get('name');
                                    assymap_uid = rec.get('coord_key');
                                    cartmap_uid = rec.get('coord_key1'); // cartmap_uid
                                    reserved_varchar2 = rec.get('reserved_varchar2');
                                }

                                prWin.setLoading(true);
                                form.submit({
                                    url: CONTEXT_PATH + '/index/process.do?method=addWorkOrderGeneral',
                                    params: {
                                        order_number: order_number,
                                        srcahd_uid: srcahd_uid,
                                        item_quan: item_quan,
                                        po_type: po_type,
                                        specification: specification,
                                        ac_uid: ac_uid,
                                        rtgastUid: rtgastUid,
                                        assymap_uid: assymap_uid,
                                        cartmap_uid: cartmap_uid,
                                    },
                                    success: function (val, action) {
                                        var myWin = prWin;
                                        workOrder.disable();
                                        // denyOrder.disable();
                                        gm.me().grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'PRD');
                                        gm.me().store.load(function () {
                                            myWin.close();
                                        });
                                    },
                                    failure: function (val, action) {
                                        prWin.close();
                                    }
                                });
                            }
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
        console_logs('start');
        prWin.show(
            undefined, function () {
                var arr = gm.me().madeComboIds;
                for (var i = 0; i < arr.length; i++) {
                    var comboId = arr[i];
                    console_logs('comboId', comboId);
                    Ext.getCmp(comboId).store.load(function (records) {
                        if (records != null && records.length > 0) {
                            var rec = records[0];
                            var mycomboId = gm.me().link + rec.get('pcs_code') + 'h_outmaker';
                            console_logs('record', records[0]);
                            Ext.getCmp(mycomboId).select(records[0]);
                        }
                    });
                }
            }
        );
        console_logs('end');
    },

    madeComboIds: [],
    treatWorkFinish: function () {
        var rtgast_uids = [];
        var selections = this.grid.getSelectionModel().getSelection();
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');
            rtgast_uids.push(uid);
        }
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=finishWorkOrderHeavy',
            params: {
                rtgastUids: rtgast_uids
            },
            reader: {},
            success: function (result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.', function () {
                });

            },
            failure: extjsUtil.failureMessage
        });
    },
    bSelected: false,
    refreshButtons: function (bSelected) {
        console_logs('this.big_pcs_code', this.big_pcs_code);
        if (bSelected != undefined && bSelected != null) {
            this.bSelected = bSelected;
        }

        if (this.bSelected == true &&
            this.big_pcs_code != undefined &&
            this.big_pcs_code != null &&
            this.big_pcs_code != '') {
            if (gm.me().vSELECTED_STATE == 'N') {
                // this.modifyDepartment.enable();
            } else if (gm.me().vSELECTED_STATE == 'P') {
                this.addWorkOrder.enable();
            }
        } else {
            // this.modifyDepartment.disable();
            this.addWorkOrder.disable();
        }
    },
    setBigPcsCode: function (big_pcs_code) {
        console_logs('big_pcs_code', big_pcs_code);
        this.big_pcs_code = big_pcs_code;
        this.refreshButtons();
        this.store.getProxy().setExtraParam('po_type', this.big_pcs_code);
        this.store.getProxy().setExtraParam('rtg_type', 'OD');
        this.storeLoad();
    },
    treatModifyDepartment: function (o) {
        //다수협력사지정
        var itemsPartner = [];
        var pcs_steel = [];
        var big_pcs_code = o;
        for (var i = 0; i < big_pcs_code['datas'].length; i++) {
            pcs_steel = Ext.Array.merge(pcs_steel, gUtil.mesTplProcessAll[big_pcs_code['datas'][i]]);
        }
        for (var i = 0; i < pcs_steel.length; i++) {
            var o = pcs_steel[i];
            var pcs_code = o['code'];
            var pcs_name = o['name'];
            console_logs('itemspartner', o);
            var aStore = Ext.create('Mplm.store.DeptStore', { dept_group: 'PCO' });
            var myId = this.link + pcs_code + 'h_outmaker';
            this.madeComboIds.push(myId);
            itemsPartner.push({
                fieldLabel: pcs_name,//ppo1_request,
                xtype: 'combo',
                anchor: '100%',
                name: pcs_code + 'h_outmaker',
                id: myId,
                mode: 'local',
                displayField: 'dept_name',
                store: aStore,
                sortInfo: { field: 'create_date', direction: 'DESC' },
                valueField: 'dept_code',
                typeAhead: false,
                minChars: 1,
                listConfig: {
                    loadingText: '검색중...',
                    emptyText: '일치하는 항목 없음.',
                    getInnerTpl: function () {
                        return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                    }
                }
            });
        }//endoffor


        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                margins: 10,
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '협력사를 재설정합니다.',
                    defaultType: 'textfield',
                    items: itemsPartner
                },
            ]//item end..
        });//Panel end...
        myWidth = 320;
        myHeight = 200;
        prwin = gm.me().prwinanotheropen(form);
    },
    prwinanotheropen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '협력사재설정',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var msg = '협력사를 재설정 하시겠습니까?'
                    var myTitle = '협력사재설정';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {
                            if (btn == "no") {
                                MessageBox.close();
                            } else {
                                var form = gu.getCmp('formPanel').getForm();
                                var cartmaparr = gm.me().cartmap_uids;
                                var ac_uid = gm.me().vSELECTED_AC_UID;
                                var rtgastUid = gm.me().vSELECTED_RTGAST_UID;

                                var selections = gm.me().grid.getSelectionModel().getSelection();
                                var rtgastUids = [];
                                var ac_uids = [];

                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];
                                    console_logs('rec', rec);

                                    var uid = rec.get('unique_id');  //rtgast_uid
                                    rtgastUids.push(uid);

                                    var ac_uid = rec.get('coord_key3');   //프로젝트 uid
                                    ac_uids.push(ac_uid);
                                }

                                prWin.setLoading(true);
                                form.submit({
                                    url: CONTEXT_PATH + '/index/process.do?method=modifyDepartmentHeavy',
                                    params: {
                                        cartmap_uids: cartmaparr,
                                        ac_uid: ac_uid,
                                        reserved_varchar3: 'PRD',
                                        rtgastUid: rtgastUid,
                                        ac_uids: ac_uids,
                                        rtgastUids: rtgastUids
                                    },
                                    success: function (val, action) {
                                        var myWin = prWin;
                                        gm.me().grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'PRD');
                                        gm.me().store.load(function () {
                                            myWin.close();
                                        });
                                    },
                                    failure: function (val, action) {
                                        prWin.close();
                                    }
                                });
                            }
                        }
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
        console_logs('start');

        prWin.show(
            undefined, function () {
                var arr = gm.me().madeComboIds;
                for (var i = 0; i < arr.length; i++) {
                    var comboId = arr[i];
                    console_logs('comboId', comboId);
                    Ext.getCmp(comboId).store.load(function (records) {
                        if (records != null && records.length > 0) {
                            var rec = records[0];
                            var mycomboId = gm.me().link + rec.get('pcs_code') + 'h_outmaker';
                            console_logs('record', records[0]);
                            Ext.getCmp(mycomboId).select(records[0]);
                        }
                    });
                }
            }
        );
        console_logs('end');
    },

    // itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
    //     var dataIndex = eventObject.position.column.dataIndex;
    //     switch (dataIndex) {
    //         case 'emergency':
    //         case 'reserved_varchar2':
    //             break;
    //         default:
    //             gm.me().doOpenWorkOrder();
    //     }
    // },

    doOpenWorkOrder: function () {
        var rtgast_uid = gm.me().vSELECTED_RTGAST_UID;
        var po_no = gm.me().vSELECTED_PO_NO;
        var pcs_code = gm.me().vSELECTED_PCS_CODE;
        var ac_uid = gm.me().vSELECTED_AC_UID;
        console_logs('pdf po_no>>>>>>>>>>>>>>>>>>>', po_no);
        console_logs('pdf pcs_code>>>>>>>>>>>>>>>>>>>', pcs_code);
        console_logs('pdf ac_uid>>>>>>>>>>>>>>>>>>>', ac_uid);
        gMain.setCenterLoading(true);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/pdf.do?method=printWo',
            params: {
                rtgast_uid: rtgast_uid,
                po_no: po_no,
                pcs_code: pcs_code,
                ac_uid: ac_uid,
                is_heavy: 'Y',	 //중공업:Y  기타:N
                is_rotate: is_rotate, //가로양식:Y 세로양식:N
                wo_type: 'P',
                pdfPrint: 'pdfPrint'
            },
            reader: {
                pdfPath: 'pdfPath'
            },
            success: function (result, request) {
                var jsonData = Ext.JSON.decode(result.responseText);
                var pdfPath = jsonData.pdfPath;
                console_logs(pdfPath);
                if (pdfPath.length > 0) {
                    var pdfPathSplit = pdfPath.split('/');
                    var fileName = pdfPathSplit[pdfPathSplit.length - 1];
                    var pageScale = (window.screen.width / 1000).toFixed(1);
                    var pdfView = Ext.create('PdfViewer.view.panel.PDF', {
                        width: window.screen.width / 5 * 3 + 20,
                        height: window.screen.height / 4 * 3 - 35,
                        pageScale: pageScale,
                        showPerPage: true,
                        pageBorders: false,
                        disableTextLayer: true,
                        src: '/download/PDF/' + fileName,
                        renderTo: Ext.getBody()
                    });
                    var woWin = Ext.create('Ext.Window', {
                        modal: true,
                        title: '작업지시서 PDF 미리보기',
                        width: window.screen.width / 5 * 3 + 20,
                        height: window.screen.height / 4 * 3,
                        plain: true,
                        items: [
                            pdfView
                        ]
                    });
                    gMain.setCenterLoading(false);
                    woWin.show();
                }
            },
            failure: function (val, action) {
                gMain.setCenterLoading(false);
                Ext.Msg.alert('오류', '파일을 불러오는 도중 오류가 발생하였습니다.');
            }
        });
    },
    formatDate: function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    },

    editRedord: function (field, rec) {
        var params = {};
        switch (field) {
            case 'emergency':
                var emergency = rec.get('emergency');
                switch (emergency) {
                    case 'EM':
                        rec.set('emergency', '긴급');
                        break;
                    case 'GE':
                        rec.set('emergency', '일반');
                        break;
                    default:
                        break;
                }
                gm.editAjax('rtgast', 'recv_flag', emergency, 'unique_id', rec.get('unique_id_long'), true);
                //gm.me().store.load();
                break;
            default:
                gm.editRedord(field, rec);
                break;
        }
    },
    payTermsStore: Ext.create('Mplm.store.PaytermStore', {}),
    presentPlanPrdStore: Ext.create('Rfx2.store.company.sejun.PresentPlanPrdStore', {}),

    teamOnePeopleStore: Ext.create('Rfx2.store.company.sejun.PrdOneTeamStore', {}),
    teamTwoPeopleStore: Ext.create('Rfx2.store.company.sejun.PrdTwoTeamStore', {}),
    teamThreePeopleStore: Ext.create('Rfx2.store.company.sejun.PrdThreeTeamStore', {}),
    teamFourPeopleStore: Ext.create('Rfx2.store.company.sejun.PrdFourTeamStore', {}),
    workTypeStore: Ext.create('Mplm.store.ProductionWorkTypeStore', {}),
    workOrder: null,
    denyOrder: null,
    selMode: 'SINGLE'
});