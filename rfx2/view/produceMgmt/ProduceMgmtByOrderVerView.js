Ext.define('Rfx2.view.produceMgmt.ProduceMgmtByOrderVerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produce-mgmt-view',
    initComponent: function () {
        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date(),
        });

        // this.addSearchField('reserved_varchar6');
        this.addSearchField('order_no');
        this.addSearchField('wa_name');
        this.addSearchField('final_wa_name');
        this.addSearchField('description');
        this.addSearchField('item_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE'],
        });

        //모델을 통한 스토어 생성
        this.createStore(
            'Rfx2.model.ProduceMgmtVer',
            [
                {
                    property: 'create_date',
                    direction: 'ASC',
                },
            ],
            /*pageSize*/
            gMain.pageSize,
            {},
            ['cartmap']
        );

        this.prEstablishOldAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            handler: function () {
                gm.me().producePlanOpOld();
            },
        });

        this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            handler: function () {
                gm.me().producePlanOp();
            },
        });

        // this.rePackEstablishAction = Ext.create('Ext.Action', {
        //     iconCls: 'mfglabs-retweet_14_0_5395c4_none',
        //     text: gm.getMC('CMD_Repackaging_Order', '재포장계획수립'),
        //     tooltip: '재포장 계획을 수립합니다',
        //     disabled: true,
        //     handler: function () {
        //         gm.me().rePackagePlanOp();
        //     },
        // });

        this.prExcelAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            text: '엑셀생산계획표',
            tooltip: '엑셀생산계획표',
            disabled: true,
            handler: function () {},
        });

        //buttonToolbar.insert(1, this.prEstablishOldAction);
        buttonToolbar.insert(1, this.prEstablishAction);
        // buttonToolbar.insert(2, this.rePackEstablishAction);

        //그리드 생성
        Ext.each(this.columns, function (columnObj, index) {
            console.log(this.columns);
            var o = columnObj;

            var dataIndex = o['dataIndex'];

            if (o['dataType'] === 'number') {
                console.log('dataType!!!!', o['text'] + ' : ' + o['dataType']);
                o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                    if (gm.me().store.data.items.length > 0) {
                        var summary = gm.me().store.data.items[0].get('summary');
                        console.log('summary', summary);
                        console.log('summary.length', summary.length);
                        if (summary.length > 0) {
                            var objSummary = Ext.decode(summary);
                            console.log('return', Ext.util.Format.number(objSummary[dataIndex], '0,00/i'));
                            return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
                        } else {
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                };
            }
            
        });

        var option = {
            features: [
                {
                    ftype: 'summary',
                    dock: 'top',
                },
            ],
        };

        //그리드 생성
        this.createGrid(searchToolbar, buttonToolbar, option);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab],
        });

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length == 1) {
                    gm.me().prEstablishAction.enable();
                    gm.me().rePackEstablishAction.enable();
                } else {
                    gm.me().prEstablishAction.disable();
                    gm.me().rePackEstablishAction.disable();
                }
            },
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.load(function (records) {});
    },

    producePlanOp: function () {
        var selection = this.grid.getSelectionModel().getSelection()[0];

        var myWidth = 1100;
        var myHeight = 600;
        var isCalc = false;

        var prodUnitGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: new Ext.data.Store(),
            id: gu.id('prodUnitGrid'),
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
                    },
                },
            ],
            listeners: {
                edit: function (editor, e, eOpts) {
                    var store = gu.getCmp('prodUnitGrid').getStore();
                    var previous_store = store.data.items;
                    var total_quan = 0;
                    console_logs('All Store Contents ??? ', previous_store);
                    for (var j = 0; j < previous_store.length; j++) {
                        var item = previous_store[j];
                        total_quan = Number(total_quan) + Number(item.get('proQuan'));
                    }
                    if (selection.get('bm_quan') < total_quan) {
                        Ext.MessageBox.alert('', '생산수량은 생산요청량을 초과할 수 없습니다.');
                        for (var k = 0; k < previous_store.length; k++) {
                            secondRecord = gu.getCmp('prodUnitGrid').getStore().getAt(k);
                            secondRecord.set('proQuan', '');
                        }
                        gu.getCmp('capaValue').setValue(selection.get('bm_quan'));
                        return;
                    } else {
                        gu.getCmp('capaValue').setValue(total_quan);
                        isCalc = true;
                    }
                },
            },
            autoScroll: true,
            dockedItems: [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false,
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        '->',
                        {
                            text: '추가',
                            listeners: [
                                {
                                    click: function () {
                                        gm.me().addProUnit();
                                    },
                                },
                            ],
                        },
                        {
                            text: gm.getMC('CMD_DELETE', '삭제'),
                            listeners: [
                                {
                                    click: function () {
                                        var record = gu.getCmp('prodUnitGrid').getSelectionModel().getSelected().items[0];
                                        var store = gu.getCmp('prodUnitGrid').getStore();
                                        var workStore = gu.getCmp('workGrid').getStore();

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
                                    },
                                },
                            ],
                        },
                    ],
                }),
            ],
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
            id: gu.id('workGrid'),
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
                markDirty: false,
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
                    sortable: false,
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
                                var store = gu.getCmp('workGrid').getStore();
                                var record = gu.getCmp('workGrid').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var selection = gm.me().grid.getSelectionModel().getSelection();
                                var rec = selection[0];
                                // site = '';
                                console_logs('rec >>>>', rec);
                                // this.store.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');
                                // this.store.getProxy().setExtraParam('pcs_code', rec.get('middle_code'));
                                if (index % 2 == 0) {
                                    // delete this.store.getProxy().getExtraParams()['parameter_name'];
                                    // this.store.getProxy().setExtraParam('reserved_varchar2', '');
                                    // this.store.getProxy().setExtraParam('reserved_varchar3', 'PROD');
                                    // this.store.getProxy().setExtraParam.remove();
                                } else {
                                    // delete this.store.getProxy().getExtraParams()['parameter_name'];
                                    // this.store.getProxy().setExtraParam('reserved_varchar2', site);
                                    // this.store.getProxy().setExtraParam('reserved_varchar3', 'PKG');
                                    // site = '';
                                }
                                this.store.load();
                            },
                            select: function (combo, rec) {
                                // 이 부분에 CAPA와 시작예정일을 산출해야 함
                                var store = gu.getCmp('workGrid').getStore();
                                var record = gu.getCmp('workGrid').getSelectionModel().getSelected().items[0];

                                site = rec.get('reserved_varchar2');
                                pcs_group = rec.get('pcs_code');

                                // 시작예정일과 종료일 산출
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=getCalcStartPlanBIOT',
                                    params: {
                                        line_code: rec.get('mchn_code'),
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        var result_split = result.split('|', 2);
                                        var date = '';
                                        var time = '';

                                        var date_e = '';
                                        var time_e = '';
                                        if (result.length > 0) {
                                            console_logs('result ????', result);
                                            console_logs('date >>>>', result_split[0]);
                                            date = result_split[0];
                                            console_logs('time >>>>', result_split[1]);
                                            var time_other =  result_split[1];
                                            var time_other_arr = time_other.split(':',2);
                                            var hour = time_other_arr[0];

                                            time = result_split[1];
                                            store.getAt(index).set('startDate', date);
                                            store.getAt(index).set('start_time', /**'9999-12-31' + ' ' + **/time);
                                            // store.getAt(index).set('start_time', time);
                                        } else {
                                            Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                        }
                                        var selectionRec = gm.me().grid.getSelectionModel().getSelection();
                                        var recOther = selectionRec[0];
                                        var unit = gu
                                            .getCmp('prodUnitGrid')
                                            .getStore()
                                            .getAt(record.get('workNumber') - 1);
                                        console_logs('recOther', recOther);
                                        console_logs('bm_quan >>>>', recOther.get('bm_quan'));
                                        console_logs('start_date >>>>', result);
                                        console_logs('mchn_code', rec.get('mchn_code'));
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                            waitMsg: '데이터를 처리중입니다.',
                                            params: {
                                                item_code: recOther.get('item_code'),
                                                line_code: rec.get('mchn_code'),
                                                bm_quan: unit.get('proQuan'),
                                                start_date: date + ' ' + time,
                                            },
                                            success: function (result, request) {
                                                var result = result.responseText;
                                                console_logs('end_time_full >>>>', result);
                                                var result_split_e = result.split('|', 2);
                                                var date_e = result_split_e[0];
                                                var time_e = result_split_e[1];
                                                console_logs('end_time >>>>', time_e);
                                                if (result.length > 0) {
                                                    store.getAt(index).set('endDate', date_e);
                                                    store.getAt(index).set('end_time', /**date_e + ' ' + **/time_e);
                                                } else {
                                                    store.getAt(index).set('endDate', date);
                                                    store.getAt(index).set('end_time', /**date + ' ' + **/time);
                                                    Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                }
                                            }, //endofsuccess
                                            failure: function (result, request) {
                                                var result = result.responseText;
                                                Ext.MessageBox.alert('알림', result);
                                            },
                                        });
                                    }, //endofsuccess
                                    failure: function (result, request) {
                                        var result = result.responseText;
                                        Ext.MessageBox.alert('알림', result);
                                    },
                                });

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=getWorkCapa',
                                    params: {
                                        mchn_uid: rec.get('unique_id'),
                                        srcahd_uid : selection.get('child')
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        if (result.length > 0) {
                                            console_logs('capa ????', result);
                                            if(result === 'N') {
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
                                console_logs('>>>>>work_site', site);
                                store.getAt(index).set('work_site', site);
                            },
                        },
                    },
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
                    sortable: true,
                },
                {
                    text: '시작예정일',
                    width: '40%',
                    dataIndex: 'startDate',
                    style: 'text-align:center',
                    align: 'left',
                    submitFormat: 'Y-m-d',
                    format: 'Y-m-d',
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
                                var store = gu.getCmp('workGrid').getStore();
                                var record = gu.getCmp('workGrid').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var unitStore = gu
                                    .getCmp('prodUnitGrid')
                                    .getStore()
                                    .getAt(record.get('workNumber') - 1);
                                console_logs('unitStore ???', unitStore.get('proQuan'));
                                var selectionRec = gm.me().grid.getSelectionModel().getSelection();
                                var recOther = selectionRec[0];
                                // var sDate = new Date(store.getAt(index).get('startDate'));
                                var sDate = new Date(me.getValue());
                                var sHour = (store.getAt(index).get('start_time')+'').split(':')[0];
                                sDate.setHours(sHour.substr(-2,2));
                                if (record.get('mchn_code') !== null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                        waitMsg: '데이터를 처리중입니다.',
                                        params: {
                                            item_code: recOther.get('item_code'),
                                            line_code: record.get('mchn_code'),
                                            bm_quan: unitStore.get('proQuan'),
                                            // start_date: me.getSubmitValue(),
                                            start_date: new Date(sDate - (sDate.getTimezoneOffset() * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' '),
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
                                                    // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                    store.getAt(index).set('end_time', me.getSubmitValue());
                                                }
                                            } else {
                                                // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                store.getAt(index).set('endDate', me.getSubmitValue());
                                            }
                                        }, //endofsuccess
                                        failure: function (result, request) {
                                            var result = result.responseText;
                                            Ext.MessageBox.alert('알림', result);
                                        },
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림', '완료예정일을 계산하기 위한 값이 부적절하거나 정확히 입력되지 않았습니다.');
                                    store.removeAt(store.indexOf(record));
                                }
                            },
                        },
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
                        format: 'H:i',
                        increment: 60,
                        anchor: '50%',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var store = gu.getCmp('workGrid').getStore();
                                var record = gu.getCmp('workGrid').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                // var time = gm.me().setRefDate(newValue, index);
                                // store.getAt(index).set('start_time', time);
                                var unitStore = gu.getCmp('prodUnitGrid').getStore().getAt(record.get('workNumber') - 1);
                                console_logs('unitStore ???', unitStore.get('proQuan'));
                                var selectionRec = gm.me().grid.getSelectionModel().getSelection();
                                var recOther = selectionRec[0];
                                var sDate = new Date(store.getAt(index).get('startDate'));
                                // sDate.setHours(store.getAt(index).get('start_time').split(':')[0]);
                                // alert(new Date(sDate - (sDate.getTimezoneOffset() * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' '));
                                // var sDate = new Date(me.getValue());
                                // alert(newValue);
                                // var sHour = (store.getAt(index).get('start_time')+'').split(':')[0];
                                var sHour = (newValue+'').split(':')[0];
                                sDate.setHours(sHour.substr(-2,2));
                                if (record.get('mchn_code') !== null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                        waitMsg: '데이터를 처리중입니다.',
                                        params: {
                                            item_code: recOther.get('item_code'),
                                            line_code: record.get('mchn_code'),
                                            bm_quan: unitStore.get('proQuan'),
                                            // start_date: store.getAt(index).get('startDate'),
                                            start_date: new Date(sDate - (sDate.getTimezoneOffset() * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' '),
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
                                                    // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                    store.getAt(index).set('end_time', me.getSubmitValue());
                                                }
                                            } else {
                                                // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                store.getAt(index).set('endDate', me.getSubmitValue());
                                            }
                                        }, //endofsuccess
                                        failure: function (result, request) {
                                            var result = result.responseText;
                                            Ext.MessageBox.alert('알림', result);
                                        },
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림', '완료예정일을 계산하기 위한 값이 부적절하거나 정확히 입력되지 않았습니다.');
                                    store.removeAt(store.indexOf(record));
                                }

                            },
                        },
                        editable: false
                    },
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
                    listeners: {},
                },
                {
                    id: gu.id('end_time'),
                    text: '완료시간',
                    width: '40%',
                    // xtype: 'datecolumn',
                    // format: 'H:i',
                    dataIndex: 'end_time',
                    style: 'text-align:center',
                    align: 'left',
                    // format:'Y-m-d',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    // renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                    // editor: {
                    //     xtype: 'timefield',
                    //     name: 'process_time',
                    //     id: gu.id('end_time'),
                    //     width: '29.6%',
                    //     minValue: '0:00',
                    //     maxValue: '0:00',
                    //     format: 'H:i',
                    //     dateFormat: 'H:i',
                    //     submitFormat: 'H:i',
                    //     // value: gm.me().getThirtyMinites(new Date()),
                    //     increment: 60,
                    //     anchor: '50%',
                    //     listeners: {
                    //         change: function (field, newValue, oldValue) {
                    //             // gm.me().setRefDate();
                    //         },
                    //     },
                    // },
                },
            ],
            listeners: {},
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
                        width: '47%',
                        padding: '3 3 3 20',
                    },
                    border: true,
                    layout: 'column',
                    items: [
                        {
                            fieldLabel: '제품',
                            xtype: 'textfield',
                            name: 'line_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('line_code'),
                            editable: false,
                            value: selection.get('item_name'),
                        },
                    ],
                },
                {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        width: '47%',
                        padding: '3 3 3 20',
                    },
                    border: true,
                    layout: 'column',
                    items: [
                        {
                            xtype: 'numberfield',
                            name: 'bm_quan_disp',
                            fieldLabel: '생산요청량',
                            hideTrigger: true,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            editable: false,
                            value: selection.get('bm_quan'),
                        },
                        {
                            xtype: 'numberfield',
                            id: gu.id('capaValue'),
                            name: 'capaValue',
                            fieldLabel: '총계획수량',
                            hideTrigger: true,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            allowBlank: false,
                            editable: false,
                            value: selection.get('bm_quan'),
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '99%',
                    margin: '3 3 3 3',
                    items: [prodUnitGrid, workGrid],
                },
            ],
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: gm.getMC('CMD_Production_Order', '계획수립'),
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
                                var siteArr = [];
                                var mchnCodeArr = [];
                                var startDateArr = [];
                                var storeData1 = gu.getCmp('prodUnitGrid').getStore();
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
                                var storeData2 = gu.getCmp('workGrid').getStore();
                                var objs1 = [];
                                var columns1 = [];
                                var obj1 = {};
                                for (var i = 0; i < storeData2.data.items.length; i++) {
                                    var item = storeData2.data.items[i];
                                    var objv1 = {};
                                    var work_group = '';
                                    var work_capa = '';
                                    var start_date = '';
                                    var start_time = '';
                                    var end_date = '';
                                    var end_time = '';
                                    var pcsmchn_uid = '';
                                    objv1['workNumber'] = item.get('workNumber');
                                    objv1['workGroup'] = item.get('workGroup');
                                    objv1['workCapa'] = item.get('workCapa');
                                    objv1['startDate'] = item.get('startDate');
                                    objv1['startTime'] = item.get('start_time');
                                    objv1['endDate'] = item.get('endDate');
                                    objv1['endTime'] = item.get('end_time');
                                    objv1['pcsmchn_uid'] = item.get('pcsmchn_uid');
                                    objv1['work_site'] = item.get('work_site');
                                    objv1['mchn_code'] = item.get('mchn_code');
                                    work_group = item.get('workGroup');
                                    work_capa = item.get('workCapa');
                                    start_date = item.get('startDate');
                                    start_time = item.get('start_time');
                                    end_date = item.get('endDate');
                                    end_time = item.get('end_time');
                                    pcsmchn_uid = item.get('pcsmchn_uid');
                                    console_logs('work_group', work_group);
                                    console_logs('work_capa', work_capa);
                                    if (work_group == null) {
                                        Ext.MessageBox.alert('알림', '작업반 정보에 빈 항목이 있습니다.<br>다시 확인해주세요.');
                                        return;
                                    } else {
                                        columns1.push(objv1);
                                    }
                                    siteArr.push(item.get('work_site'));
                                    mchnCodeArr.push(item.get('mchn_code'));
                                    startDateArr.push(item.get('startDate'))
                                }
                                obj1['plan'] = columns1;
                                objs1.push(obj1);
                                var jsonData2 = Ext.util.JSON.encode(objs1);
                                console_logs('jsonData2', jsonData2);
                                console_logs('json1.length...', jsonData1.lenth);
                                console_logs('json2.length...', jsonData2.lenth);
                                if (jsonData1 != null && jsonData2 != null) {
                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/index/process.do?method=addPrdPlanBIOTVersion',
                                        waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                        params: {
                                            prd_group: selection.get('middle_code'),
                                            cartmap_uid: selection.get('unique_id_long'),
                                            bm_quan: selection.get('bm_quan'),
                                            serial_order: selection.get('orderNo'),
                                            project_uid: selection.get('ac_uid'),
                                            pi_number: selection.get('reserved_varchare'),
                                            specification: selection.get('specification'),
                                            assymap_uid: selection.get('coord_key3'),
                                            srcahd_uid: selection.get('child'),
                                            jsonData1: jsonData1,
                                            jsonData2: jsonData2,
                                            site: site,
                                            pcs_group: pcs_group,
                                            item_code: selection.get('item_code'),
                                            combst_uid: selection.get('order_com_unique'),
                                            siteArr: siteArr,
                                            mchnCodeArr: mchnCodeArr,
                                            startDateArr : startDateArr
                                        },
                                        success: function (val, action) {
                                            console_logs('결과 ???', action);
                                            if (prWin) {
                                                Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                                prWin.close();
                                                gm.me().store.load();
                                            }
                                        },
                                        failure: function () {
                                            // console_logs('결과 ???', action);
                                            prWin.setLoading(false);
                                            Ext.MessageBox.alert('에러','데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.')
                                            // extjsUtil.failureMessage();
                                            if (prWin) {
                                                // Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                                prWin.close();
                                                gm.me().store.load();
                                            }
                                        },
                                    });
                                } else {
                                    Ext.MessageBox.alert('', '생산수량 또는 작업반이 정확히 입력되지 않았습니다.');
                                }
                            }
                        }
                    },
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        Ext.MessageBox.alert('알림', '취소 할 시 입력한 모든정보가 저장되지 않습니다.<br>그래도 취소하시겠습니까?', function () {
                            console_logs('취소', '취소');
                            if (prWin) {
                                prWin.close();
                            }
                        });
                    },
                },
            ],
        });

        gm.me().addProUnitFirst();

        prWin.show();
    },

    producePlanOpOld: function () {
        var selection = this.grid.getSelectionModel().getSelection()[0];
        var lineStore = Ext.create('Mplm.store.LineStore');
        var lineStatusStore = Ext.create('Rfx2.store.company.bioprotech.LineDetailStatusStore');
        lineStore.getProxy().setExtraParam('parent', selection.get('middle_code'));

        var myWidth = 1200;
        var myHeight = 510;

        var prd_grid = Ext.create('Ext.grid.Panel', {
            store: lineStatusStore,
            cls: 'rfx-panel',
            id: gu.id('etc_grid'),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '90%',
            autoScroll: true,
            selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'multi' }),
            margin: '0 0 5 0',
            autoHeight: true,
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: true,
            columns: [
                {
                    text: '순서',
                    width: '15%',
                    dataIndex: 'num',
                    style: 'text-align:center',
                    valueField: 'no',
                    align: 'center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '계획수량',
                    width: '40%',
                    xtype: 'numbercolumn',
                    dataIndex: 'item_quan',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '수주번호',
                    width: '40%',
                    dataIndex: 'order_number',
                    style: 'text-align:center',
                    sortable: true,
                },
            ],
            selModel: 'cellmodel',
            listeners: {},
            autoScroll: true,
        });

        var proc_dsn_grid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('proc_dsn_grid'),
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            overflowY: 'scroll',
            multiSelect: false,
            width: '90%',
            autoScroll: true,
            selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'multi' }),
            // bbar: getPageToolbar(lineStatusStore),
            margin: '0 0 5 0',
            autoHeight: true,
            frame: false,
            border: false,
            layout: 'fit',
            forceFit: true,
            columns: [
                {
                    text: '순서',
                    width: '15%',
                    dataIndex: 'num',
                    style: 'text-align:center',
                    valueField: 'no',
                    align: 'center',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '외주업체',
                    width: '40%',
                    // xtype : 'numbercolumn',
                    dataIndex: 'item_quan',
                    style: 'text-align:center',
                    format: '0,000',
                    align: 'right',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                },
                {
                    text: '설비명',
                    width: '40%',
                    dataIndex: 'order_number',
                    style: 'text-align:center',
                    sortable: true,
                },
            ],
            selModel: 'cellmodel',
            listeners: {},
            autoScroll: true,
        });

        var form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'left',
                msgTarget: 'side',
            },
            items: [
                {
                    xtype: 'fieldset',
                    columnWidth: 0.4,
                    rowspan: 5,
                    collapsible: false,
                    border: false,
                    defaults: {
                        width: '49%',
                        height: '100%',
                        margin: '3 3 3 3',
                    },

                    layout: 'anchor',
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'big_pcs_code',
                            value: selection.get('sp_code'),
                        },
                        {
                            fieldLabel: '제품',
                            xtype: 'textfield',
                            anchor: '97%',
                            name: 'item_name',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('item_name'),
                            editable: false,
                            value: selection.get('item_name'),
                        },
                        {
                            fieldLabel: '라인/설비',
                            xtype: 'combo',
                            anchor: '97%',
                            name: 'line_value',
                            allowBlank: false,
                            editable: false,
                            id: gu.id('line_value'),
                            mode: 'local',
                            displayField: 'pcs_name',
                            store: lineStore,
                            sortInfo: { field: 'create_date', direction: 'DESC' },
                            valueField: 'unique_id_long',
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{pcs_code}] {pcs_name}</div>';
                                },
                            },
                            listeners: {
                                select: function (combo, record) {
                                    gu.getCmp('line_code').setValue(record.get('pcs_code'));
                                    gu.getCmp('capaValue').setValue(record.get('plan_qty'));
                                    lineStatusStore.getProxy().setExtraParam('po_type', selection.get('middle_code'));
                                    lineStatusStore.getProxy().setExtraParam('name', record.get('pcs_code'));
                                    lineStatusStore.load(function (rec) {
                                        console_logs('>>>>>> detail', rec);
                                    });
                                    // form.setCenterLoading(true);
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/index/process.do?method=copyPcsstdByPcsTpl',
                                        waitMsg: '공정정보를 생성중입니다.',
                                        params: {
                                            assymap_uid: selection.get('coord_key3'),
                                            line_code: record.get('pcs_code'),
                                        },
                                        success: function (result, request) {
                                            // form.setCenterLoading(false);
                                            // Ext.MessageBox.alert('알림', '소모처리 완료 되었습니다.');
                                        }, //endofsuccess
                                        failure: function (result, request) {
                                            // form.setCenterLoading(false);
                                            // Ext.MessageBox.alert('알림', '소모처리 완료 실패하였습니다.');
                                        },
                                    }); //endofajax
                                },
                            },
                        },
                        {
                            fieldLabel: '제품',
                            xtype: 'hiddenfield',
                            anchor: '97%',
                            name: 'line_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('line_code'),
                            editable: false,
                            // value: selection.get('item_name'),
                        },
                        {
                            xtype: 'numberfield',
                            anchor: '97%',
                            name: 'bm_quan_disp',
                            fieldLabel: '생산요청량',
                            hideTrigger: true,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            editable: false,
                            value: selection.get('bm_quan'),
                        },
                        {
                            xtype: 'numberfield',
                            anchor: '97%',
                            id: gu.id('capaValue'),
                            name: 'capaValue',
                            fieldLabel: '총 Capa',
                            hideTrigger: true,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            editable: false,
                        },
                        {
                            layout: {
                                type: 'column',
                                // align: 'left'
                            },
                            items: [
                                {
                                    xtype: 'datefield',
                                    // anchor: '97%',
                                    id: gu.id('start_plan_date'),
                                    name: 'start_plan_date',
                                    fieldLabel: '시작예정일',
                                    width: '70%',
                                    format: 'Y-m-d',
                                    margin: '0 3 0 0',
                                    submitFormat: 'Y-m-d',
                                    dateFormat: 'Y-m-d',
                                    editable: true,
                                    listeners: {
                                        select: function (me) {
                                            // 시작 예정일이 사용자가 임의로 변경했을 시 그 값으로 받아서 Function 호출한다.
                                            console_logs('selected value >>>> ', me.getSubmitValue());
                                            var line_code = gu.getCmp('line_code').getValue();
                                            var bm_quan = selection.get('bm_quan');
                                            var start_date = me.getSubmitValue();
                                            var target2 = gu.getCmp('end_plan_date');
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                                params: {
                                                    line_code: line_code,
                                                    bm_quan: bm_quan,
                                                    start_date: start_date,
                                                },
                                                success: function (result, request) {
                                                    var result2 = result.responseText;
                                                    console_logs('change_end_date ???', result2);
                                                    target2.setValue(result2);
                                                },
                                                failure: extjsUtil.failureMessage,
                                            });
                                        },
                                    },
                                },
                                {
                                    xtype: 'button',
                                    width: 97,
                                    text: '자동계산',
                                    listeners: {
                                        click: function () {
                                            var line_code = gu.getCmp('line_code').getValue();
                                            var bm_quan = selection.get('bm_quan');
                                            var start_date = '';
                                            if (line_code.length === 0) {
                                                Ext.MessageBox.alert('알림', '라인 명을 입력하십시오');
                                                return;
                                            }
                                            console_logs('LINE_CODE >>>> ', line_code);
                                            var target = gu.getCmp('start_plan_date');
                                            var target2 = gu.getCmp('end_plan_date');

                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/production/schdule.do?method=getCalcStartPlanBIOT',
                                                params: {
                                                    line_code: line_code,
                                                },
                                                success: function (result, request) {
                                                    var result = result.responseText;
                                                    target.setValue(result);
                                                    start_date = result;

                                                    Ext.Ajax.request({
                                                        url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                                        params: {
                                                            line_code: line_code,
                                                            bm_quan: bm_quan,
                                                            start_date: start_date,
                                                        },
                                                        success: function (result, request) {
                                                            var result2 = result.responseText;
                                                            target2.setValue(result2);
                                                        },
                                                        failure: extjsUtil.failureMessage,
                                                    });
                                                },
                                                failure: extjsUtil.failureMessage,
                                            });
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'datefield',
                            anchor: '97%',
                            name: 'end_plan_date',
                            id: gu.id('end_plan_date'),
                            fieldLabel: '완료예정일',
                            width: '70%',
                            margin: '0 3 0 0',
                            format: 'Y-m-d',
                            submitFormat: 'Y-m-d',
                            dateFormat: 'Y-m-d',
                            editable: false,
                            readOnly: true,
                        },
                    ],
                },
                {
                    xtype: 'fieldset',
                    frame: false,
                    border: false,
                    columnWidth: 0.3,
                    collapsed: false,
                    title: '공정, 외주업체 지정',
                    layout: 'anchor',
                    items: [proc_dsn_grid],
                },
                {
                    xtype: 'fieldset',
                    frame: false,
                    border: false,
                    title: '생산계획 현황',
                    columnWidth: 0.3,
                    collapsed: false,
                    layout: 'anchor',
                    items: [prd_grid],
                },
            ],
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: gm.getMC('CMD_Production_Order', '계획수립'),
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
                                form.submit({
                                    submitEmptyText: false,
                                    url: CONTEXT_PATH + '/index/process.do?method=addProcessPlanBIOT',
                                    params: {
                                        prd_group: selection.get('middle_code'),
                                        cartmap_uid: selection.get('unique_id_long'),
                                        bm_quan: selection.get('bm_quan'),
                                        serial_order: selection.get('orderNo'),
                                        project_uid: selection.get('ac_uid'),
                                        pi_number: selection.get('reserved_varchare'),
                                        specification: selection.get('specification'),
                                        assymap_uid: selection.get('coord_key3'),
                                        srcahd_uid: selection.get('child'),
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
                                        prWin.setLoading(false);
                                        // extjsUtil.failureMessage();
                                    },
                                });
                            }
                        }
                    },
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        Ext.MessageBox.alert('알림', '취소 할 시 입력한 모든정보가 저장되지 않습니다.<br>그래도 취소하시겠습니까?', function () {
                            console_logs('취소', '취소');
                            if (prWin) {
                                prWin.close();
                            }
                        });
                    },
                },
            ],
        });

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

    // setRefDate: function (value, idx) {
    //     var store = gu.getCmp('workGrid').getStore();
    //     console_logs('>>>>>>> setrefdate', value);
    //     console_logs('>>>>>> setrefdate_gethour', value.getHours());
    //     var time = value.getHours();
    //     if (time < 10) {
    //         time = '0' + time;
    //     }
    //     var newTime = time + ':00';
    //     return newTime;
    // },

    addProUnitFirst: function () {
        var store = gu.getCmp('prodUnitGrid').getStore();
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var cnt = store.getCount() + 1;

        store.insert(
            store.getCount(),
            new Ext.data.Record({
                proNumber: cnt,
                proQuan: rec.get('bm_quan'),
            })
        );

        var workStore = gu.getCmp('workGrid').getStore();

        workStore.insert(
            workStore.getCount(),
            new Ext.data.Record({
                workNumber: cnt,
                workCapa: 0,
                startDate: null,
                endDate: null,
                start_time: null,
                end_time: null,
                pcsmchn_uid: null,
                mchn_code: null,
                work_site: null,
            })
        );

        workStore.insert(
            workStore.getCount(),
            new Ext.data.Record({
                workNumber: cnt,
                workCapa: 0,
                startDate: null,
                endDate: null,
                start_time: null,
                end_time: null,
                pcsmchn_uid: null,
                mchn_code: null,
                work_site: null,
            })
        );
    },

    addPackUnitFirst: function () {
        var store = gu.getCmp('packUnitGrid').getStore();
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var cnt = store.getCount() + 1;

        store.insert(
            store.getCount(),
            new Ext.data.Record({
                proNumber: cnt,
                proQuan: rec.get('bm_quan'),
            })
        );

        var workStore = gu.getCmp('packworkGrid').getStore();

        workStore.insert(
            workStore.getCount(),
            new Ext.data.Record({
                workNumber: cnt,
                workCapa: 0,
                startDate: null,
                endDate: null,
                start_time: null,
                end_time: null,
                pcsmchn_uid: null,
                mchn_code: null,
                work_site: null,
            })
        );
    },


    rePackagePlanOp: function () {
        var selection = this.grid.getSelectionModel().getSelection()[0];
        var myWidth = 1100;
        var myHeight = 600;
        var isCalc = false;

        var packUnitGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: new Ext.data.Store(),
            id: gu.id('packUnitGrid'),
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
                    text: '포장수량',
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
                    },
                },
            ],
            listeners: {
                edit: function (editor, e, eOpts) {
                    var store = gu.getCmp('packUnitGrid').getStore();
                    var previous_store = store.data.items;
                    var total_quan = 0;
                    console_logs('All Store Contents ??? ', previous_store);
                    for (var j = 0; j < previous_store.length; j++) {
                        var item = previous_store[j];
                        total_quan = Number(total_quan) + Number(item.get('proQuan'));
                    }
                    if (selection.get('bm_quan') < total_quan) {
                        Ext.MessageBox.alert('', '포장수량은 포장요청량을 초과할 수 없습니다.');
                        for (var k = 0; k < previous_store.length; k++) {
                            secondRecord = gu.getCmp('prodUnitGrid').getStore().getAt(k);
                            secondRecord.set('proQuan', '');
                        }
                        gu.getCmp('capaValue').setValue(selection.get('bm_quan'));
                        return;
                    } else {
                        gu.getCmp('capaValue').setValue(total_quan);
                        isCalc = true;
                    }
                },
            },
            autoScroll: true,
            dockedItems: [
                Ext.create('widget.toolbar', {
                    plugins: {
                        boxreorderer: false,
                    },
                    cls: 'my-x-toolbar-default2',
                    margin: '0 0 0 0',
                    items: [
                        '->',
                        {
                            text: '추가',
                            listeners: [
                                {
                                    click: function () {
                                        gm.me().addPackUnit();
                                    },
                                },
                            ],
                        },
                        {
                            text: gm.getMC('CMD_DELETE', '삭제'),
                            listeners: [
                                {
                                    click: function () {
                                        var record = gu.getCmp('packUnitGrid').getSelectionModel().getSelected().items[0];
                                        var store = gu.getCmp('packUnitGrid').getStore();
                                        var workStore = gu.getCmp('packworkGrid').getStore();

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
                                    },
                                },
                            ],
                        },
                    ],
                }),
            ],
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

        var packworkGrid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            cls: 'rfx-panel',
            id: gu.id('packworkGrid'),
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
                markDirty: false,
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
                    sortable: false,
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
                                var store = gu.getCmp('packworkGrid').getStore();
                                var record = gu.getCmp('packworkGrid').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var selection = gm.me().grid.getSelectionModel().getSelection();
                                var rec = selection[0];
                                // site = '';
                                console_logs('rec >>>>', rec);
                                this.store.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');
                                this.store.getProxy().setExtraParam('pcs_code', rec.get('middle_code'));
                                // if (index % 2 == 0) {
                                //     delete this.store.getProxy().getExtraParams()['parameter_name'];
                                //     this.store.getProxy().setExtraParam('reserved_varchar2', '');
                                //     this.store.getProxy().setExtraParam('reserved_varchar3', 'PROD');
                                //     // this.store.getProxy().setExtraParam.remove();
                                // } else {
                                delete this.store.getProxy().getExtraParams()['parameter_name'];
                                // this.store.getProxy().setExtraParam('reserved_varchar2', site);
                                this.store.getProxy().setExtraParam('reserved_varchar3', 'PKG');
                                    // site = '';
                                // }
                                this.store.load();
                            },
                            select: function (combo, rec) {
                                // 이 부분에 CAPA와 시작예정일을 산출해야 함
                                var store = gu.getCmp('packworkGrid').getStore();
                                var record = gu.getCmp('packworkGrid').getSelectionModel().getSelected().items[0];

                                site = rec.get('reserved_varchar2');
                                pcs_group = rec.get('pcs_code');

                                // 시작예정일과 종료일 산출
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=getCalcStartPlanBIOT',
                                    params: {
                                        line_code: rec.get('mchn_code'),
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        var result_split = result.split('|', 2);
                                        var date = '';
                                        var time = '';

                                        var date_e = '';
                                        var time_e = '';
                                        if (result.length > 0) {
                                            console_logs('result ????', result);
                                            console_logs('date >>>>', result_split[0]);
                                            date = result_split[0];
                                            console_logs('time >>>>', result_split[1]);
                                            var time_other =  result_split[1];
                                            var time_other_arr = time_other.split(':',2);
                                            var hour = time_other_arr[0];

                                            time = result_split[1];
                                            store.getAt(index).set('startDate', date);
                                            store.getAt(index).set('start_time', /**'9999-12-31' + ' ' + **/time);
                                            // store.getAt(index).set('start_time', time);
                                        } else {
                                            Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                        }
                                        var selectionRec = gm.me().grid.getSelectionModel().getSelection();
                                        var recOther = selectionRec[0];
                                        var unit = gu
                                            .getCmp('packUnitGrid')
                                            .getStore()
                                            .getAt(record.get('workNumber') - 1);
                                        console_logs('recOther', recOther);
                                        console_logs('bm_quan >>>>', recOther.get('bm_quan'));
                                        console_logs('start_date >>>>', result);
                                        console_logs('mchn_code', rec.get('mchn_code'));
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                            waitMsg: '데이터를 처리중입니다.',
                                            params: {
                                                item_code: recOther.get('item_code'),
                                                line_code: rec.get('mchn_code'),
                                                bm_quan: unit.get('proQuan'),
                                                start_date: date + ' ' + time,
                                            },
                                            success: function (result, request) {
                                                var result = result.responseText;
                                                console_logs('end_time_full >>>>', result);
                                                var result_split_e = result.split('|', 2);
                                                var date_e = result_split_e[0];
                                                var time_e = result_split_e[1];
                                                console_logs('end_time >>>>', time_e);
                                                if (result.length > 0) {
                                                    store.getAt(index).set('endDate', date_e);
                                                    store.getAt(index).set('end_time', /**date_e + ' ' + **/time_e);
                                                } else {
                                                    store.getAt(index).set('endDate', date);
                                                    store.getAt(index).set('end_time', /**date + ' ' + **/time);
                                                    Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                }
                                            }, //endofsuccess
                                            failure: function (result, request) {
                                                var result = result.responseText;
                                                Ext.MessageBox.alert('알림', result);
                                            },
                                        });
                                    }, //endofsuccess
                                    failure: function (result, request) {
                                        var result = result.responseText;
                                        Ext.MessageBox.alert('알림', result);
                                    },
                                });

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/production/schdule.do?method=getWorkCapa',
                                    params: {
                                        mchn_uid: rec.get('unique_id'),
                                        srcahd_uid : selection.get('child')
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        if (result.length > 0) {
                                            console_logs('capa ????', result);
                                            if(result === 'N') {
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
                                console_logs('>>>>>work_site', site);
                                store.getAt(index).set('work_site', site);
                            },
                        },
                    },
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
                    sortable: true,
                },
                {
                    text: '시작예정일',
                    width: '40%',
                    dataIndex: 'startDate',
                    style: 'text-align:center',
                    align: 'left',
                    submitFormat: 'Y-m-d',
                    format: 'Y-m-d',
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
                                var store = gu.getCmp('packworkGrid').getStore();
                                var record = gu.getCmp('packworkGrid').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var unitStore = gu
                                    .getCmp('packUnitGrid')
                                    .getStore()
                                    .getAt(record.get('workNumber') - 1);
                                console_logs('unitStore ???', unitStore.get('proQuan'));
                                var selectionRec = gm.me().grid.getSelectionModel().getSelection();
                                var recOther = selectionRec[0];
                                // var sDate = new Date(store.getAt(index).get('startDate'));
                                var sDate = new Date(me.getValue());
                                var sHour = (store.getAt(index).get('start_time')+'').split(':')[0];
                                sDate.setHours(sHour.substr(-2,2));
                                if (record.get('mchn_code') !== null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                        waitMsg: '데이터를 처리중입니다.',
                                        params: {
                                            item_code: recOther.get('item_code'),
                                            line_code: record.get('mchn_code'),
                                            bm_quan: unitStore.get('proQuan'),
                                            // start_date: me.getSubmitValue(),
                                            start_date: new Date(sDate - (sDate.getTimezoneOffset() * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' '),
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
                                                    // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                    store.getAt(index).set('end_time', me.getSubmitValue());
                                                }
                                            } else {
                                                // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                store.getAt(index).set('endDate', me.getSubmitValue());
                                            }
                                        }, //endofsuccess
                                        failure: function (result, request) {
                                            var result = result.responseText;
                                            Ext.MessageBox.alert('알림', result);
                                        },
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림', '완료예정일을 계산하기 위한 값이 부적절하거나 정확히 입력되지 않았습니다.');
                                    store.removeAt(store.indexOf(record));
                                }
                            },
                        },
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
                        format: 'H:i',
                        increment: 60,
                        anchor: '50%',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var store = gu.getCmp('packworkGrid').getStore();
                                var record = gu.getCmp('packworkGrid').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                // var time = gm.me().setRefDate(newValue, index);
                                // store.getAt(index).set('start_time', time);
                                var unitStore = gu.getCmp('packUnitGrid').getStore().getAt(record.get('workNumber') - 1);
                                console_logs('unitStore ???', unitStore.get('proQuan'));
                                var selectionRec = gm.me().grid.getSelectionModel().getSelection();
                                var recOther = selectionRec[0];
                                var sDate = new Date(store.getAt(index).get('startDate'));
                                // sDate.setHours(store.getAt(index).get('start_time').split(':')[0]);
                                // alert(new Date(sDate - (sDate.getTimezoneOffset() * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' '));
                                // var sDate = new Date(me.getValue());
                                // alert(newValue);
                                // var sHour = (store.getAt(index).get('start_time')+'').split(':')[0];
                                var sHour = (newValue+'').split(':')[0];
                                sDate.setHours(sHour.substr(-2,2));
                                if (record.get('mchn_code') !== null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                        waitMsg: '데이터를 처리중입니다.',
                                        params: {
                                            item_code: recOther.get('item_code'),
                                            line_code: record.get('mchn_code'),
                                            bm_quan: unitStore.get('proQuan'),
                                            // start_date: store.getAt(index).get('startDate'),
                                            start_date: new Date(sDate - (sDate.getTimezoneOffset() * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' '),
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
                                                    // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                    store.getAt(index).set('end_time', me.getSubmitValue());
                                                }
                                            } else {
                                                // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                store.getAt(index).set('endDate', me.getSubmitValue());
                                            }
                                        }, //endofsuccess
                                        failure: function (result, request) {
                                            var result = result.responseText;
                                            Ext.MessageBox.alert('알림', result);
                                        },
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림', '완료예정일을 계산하기 위한 값이 부적절하거나 정확히 입력되지 않았습니다.');
                                    store.removeAt(store.indexOf(record));
                                }

                            },
                        },
                        editable: false
                    },
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
                    listeners: {},
                },
                {
                    id: gu.id('end_time'),
                    text: '완료시간',
                    width: '40%',
                    // xtype: 'datecolumn',
                    // format: 'H:i',
                    dataIndex: 'end_time',
                    style: 'text-align:center',
                    align: 'left',
                    // format:'Y-m-d',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    // renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                    // editor: {
                    //     xtype: 'timefield',
                    //     name: 'process_time',
                    //     id: gu.id('end_time'),
                    //     width: '29.6%',
                    //     minValue: '0:00',
                    //     maxValue: '0:00',
                    //     format: 'H:i',
                    //     dateFormat: 'H:i',
                    //     submitFormat: 'H:i',
                    //     // value: gm.me().getThirtyMinites(new Date()),
                    //     increment: 60,
                    //     anchor: '50%',
                    //     listeners: {
                    //         change: function (field, newValue, oldValue) {
                    //             // gm.me().setRefDate();
                    //         },
                    //     },
                    // },
                },
            ],
            listeners: {},
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
                        width: '47%',
                        padding: '3 3 3 20',
                    },
                    border: true,
                    layout: 'column',
                    items: [
                        {
                            fieldLabel: '제품',
                            xtype: 'textfield',
                            name: 'line_code',
                            allowBlank: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            id: gu.id('line_code'),
                            editable: false,
                            value: selection.get('item_name'),
                        },
                    ],
                },
                {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        width: '47%',
                        padding: '3 3 3 20',
                    },
                    border: true,
                    layout: 'column',
                    items: [
                        {
                            xtype: 'numberfield',
                            name: 'bm_quan_disp',
                            fieldLabel: '포장요청량',
                            hideTrigger: true,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            editable: false,
                            value: selection.get('bm_quan'),
                        },
                        {
                            xtype: 'numberfield',
                            id: gu.id('capaValue'),
                            name: 'capaValue',
                            fieldLabel: '총계획수량',
                            hideTrigger: true,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            allowBlank: false,
                            editable: false,
                            value: selection.get('bm_quan'),
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    width: '99%',
                    margin: '3 3 3 3',
                    items: [packUnitGrid, packworkGrid],
                },
            ],
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
                                var siteArr = [];
                                var mchnCodeArr = [];
                                var startDateArr = [];
                                var storeData1 = gu.getCmp('packUnitGrid').getStore();
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
                                var storeData2 = gu.getCmp('packworkGrid').getStore();
                                var objs1 = [];
                                var columns1 = [];
                                var obj1 = {};
                                for (var i = 0; i < storeData2.data.items.length; i++) {
                                    var item = storeData2.data.items[i];
                                    var objv1 = {};
                                    var work_group = '';
                                    var work_capa = '';
                                    var start_date = '';
                                    var start_time = '';
                                    var end_date = '';
                                    var end_time = '';
                                    var pcsmchn_uid = '';
                                    objv1['workNumber'] = item.get('workNumber');
                                    objv1['workGroup'] = item.get('workGroup');
                                    objv1['workCapa'] = item.get('workCapa');
                                    objv1['startDate'] = item.get('startDate');
                                    objv1['startTime'] = item.get('start_time');
                                    objv1['endDate'] = item.get('endDate');
                                    objv1['endTime'] = item.get('end_time');
                                    objv1['pcsmchn_uid'] = item.get('pcsmchn_uid');
                                    objv1['work_site'] = item.get('work_site');
                                    objv1['mchn_code'] = item.get('mchn_code');
                                    work_group = item.get('workGroup');
                                    work_capa = item.get('workCapa');
                                    start_date = item.get('startDate');
                                    start_time = item.get('start_time');
                                    end_date = item.get('endDate');
                                    end_time = item.get('end_time');
                                    pcsmchn_uid = item.get('pcsmchn_uid');
                                    console_logs('work_group', work_group);
                                    console_logs('work_capa', work_capa);
                                    if (work_group == null) {
                                        Ext.MessageBox.alert('알림', '작업반 정보에 빈 항목이 있습니다.<br>다시 확인해주세요.');
                                        return;
                                    } else {
                                        columns1.push(objv1);
                                    }
                                    siteArr.push(item.get('work_site'));
                                    mchnCodeArr.push(item.get('mchn_code'));
                                    startDateArr.push(item.get('startDate'))
                                }
                                obj1['plan'] = columns1;
                                objs1.push(obj1);
                                var jsonData2 = Ext.util.JSON.encode(objs1);
                                console_logs('jsonData2', jsonData2);
                                console_logs('json1.length...', jsonData1.lenth);
                                console_logs('json2.length...', jsonData2.lenth);
                                if (jsonData1 != null && jsonData2 != null) {
                                    form.submit({
                                        submitEmptyText: false,
                                        url: CONTEXT_PATH + '/index/process.do?method=addPackagePlanBIOT',
                                        waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                        params: {
                                            prd_group: selection.get('middle_code'),
                                            cartmap_uid: selection.get('unique_id_long'),
                                            bm_quan: selection.get('bm_quan'),
                                            serial_order: selection.get('orderNo'),
                                            project_uid: selection.get('ac_uid'),
                                            pi_number: selection.get('reserved_varchare'),
                                            specification: selection.get('specification'),
                                            assymap_uid: selection.get('coord_key3'),
                                            srcahd_uid: selection.get('child'),
                                            jsonData1: jsonData1,
                                            jsonData2: jsonData2,
                                            site: site,
                                            pcs_group: pcs_group,
                                            item_code: selection.get('item_code'),
                                            combst_uid: selection.get('order_com_unique'),
                                            siteArr: siteArr,
                                            mchnCodeArr: mchnCodeArr,
                                            startDateArr : startDateArr
                                        },
                                        success: function (val, action) {
                                            console_logs('결과 ???', action);
                                            if (prWin) {
                                                Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                                prWin.close();
                                                gm.me().store.load();
                                            }
                                        },
                                        failure: function () {
                                            prWin.setLoading(false);
                                            Ext.MessageBox.alert('에러','데이터 처리중 문제가 발생하였습니다.<br>같은 증상이 지속될 시 시스템 관리자에게 문의 바랍니다.');
                                            if (prWin) {
                                                prWin.close();
                                                gm.me().store.load();
                                            }
                                        },
                                    });
                                } else {
                                    Ext.MessageBox.alert('', '생산수량 또는 작업반이 정확히 입력되지 않았습니다.');
                                }
                            }
                        }
                    },
                },
                {
                    text: CMD_CANCEL,
                    scope: this,
                    handler: function () {
                        Ext.MessageBox.alert('알림', '취소 할 시 입력한 모든정보가 저장되지 않습니다.<br>그래도 취소하시겠습니까?', function () {
                            console_logs('취소', '취소');
                            if (prWin) {
                                prWin.close();
                            }
                        });
                    },
                },
            ],
        });
        gm.me().addPackUnitFirst();
        prWin.show();
    },

    addProUnit: function () {
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var bm_quan = rec.get('bm_quan');
        var store = gu.getCmp('prodUnitGrid').getStore();
        var previous_store = store.data.items;
        var total_quan = 0;

        for (var j = 0; j < previous_store.length; j++) {
            var item = previous_store[j];
            total_quan = Number(total_quan) + Number(item.get('proQuan'));
        }
        console_logs('등록된 total_quan ??? ', total_quan);
        console_logs('차액 ???', Number(bm_quan) - Number(total_quan));
        var diff_price = Number(bm_quan) - Number(total_quan);
        var cnt = store.getCount() + 1;

        gu.getCmp('capaValue').setValue(Number(bm_quan) - Number(total_quan) + Number(total_quan));

        store.insert(
            store.getCount(),
            new Ext.data.Record({
                proNumber: cnt,
                proQuan: diff_price,
            })
        );

        var workStore = gu.getCmp('workGrid').getStore();

        workStore.insert(
            workStore.getCount(),
            new Ext.data.Record({
                workNumber: cnt,
                workCapa: 0,
                startDate: null,
                endDate: null,
                start_time: null,
                end_time: null,
                pcsmchn_uid: null,
                mchn_code: null,
                work_site: null,
            })
        );

        workStore.insert(
            workStore.getCount(),
            new Ext.data.Record({
                workNumber: cnt,
                workCapa: 0,
                startDate: null,
                endDate: null,
                start_time: null,
                end_time: null,
                pcsmchn_uid: null,
                mchn_code: null,
                work_site: null,
            })
        );
    },

    addPackUnit: function () {
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var bm_quan = rec.get('bm_quan');
        var store = gu.getCmp('packUnitGrid').getStore();
        var previous_store = store.data.items;
        var total_quan = 0;

        for (var j = 0; j < previous_store.length; j++) {
            var item = previous_store[j];
            total_quan = Number(total_quan) + Number(item.get('proQuan'));
        }
        console_logs('등록된 total_quan ??? ', total_quan);
        console_logs('차액 ???', Number(bm_quan) - Number(total_quan));
        var diff_price = Number(bm_quan) - Number(total_quan);
        var cnt = store.getCount() + 1;

        gu.getCmp('capaValue').setValue(Number(bm_quan) - Number(total_quan) + Number(total_quan));

        store.insert(
            store.getCount(),
            new Ext.data.Record({
                proNumber: cnt,
                proQuan: diff_price,
            })
        );

        var workStore = gu.getCmp('packworkGrid').getStore();

        workStore.insert(
            workStore.getCount(),
            new Ext.data.Record({
                workNumber: cnt,
                workCapa: 0,
                startDate: null,
                endDate: null,
                start_time: null,
                end_time: null,
                pcsmchn_uid: null,
                mchn_code: null,
                work_site: null,
            })
        );
    },

    // 시작예정일, 시작시간값을 이용해 'YYYY-MM-DD HH:TT' 형태로 변환, 리턴(string)
    // sDate : javascript Date type
    // sHour : javascript Date type, or 'H:i' 포맷
    convertToMysqlTimestamp: function (sDateTime, sHourTime) {
        var sDate = new Date(sDateTime);
        var sHour = (sHourTime + '').split(':')[0];
        sDate.setHours(sHour.substr(-2, 2));
        return new Date(sDate - (sDate.getTimezoneOffset() * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
    },

});

