Ext.define('Rfx2.view.company.chmr.produceMgmt.ProduceMgmtBiotechByPrdView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'produce-mgmt-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        // this.addSearchField(
        //     {
        //         type: 'combo'
        //         , field_id: 'status'
        //         , store: "RecevedStateStore"
        //         , displayField: 'codeName'
        //         , valueField: 'systemCode'
        //         , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        //     });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'regist_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate: new Date()
        });

        // this.addSearchField('reserved_varchar6');
        this.addSearchField('item_code');
        this.addSearchField('item_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        //모델을 통한 스토어 생성
        this.createStoreSimple({
            modelClass: 'Rfx2.model.ProduceAssyPlan',
            // sorters: [{
            //     property: 'pr_no',
            //     direction: 'asc'
            // }],
            pageSize: gMain.pageSize,/*pageSize*/
            byReplacer: {},
            deleteClass: ['cartmap']
        });

        for (var i = 0; i < this.columns.length; i++) {
            var o = this.columns[i];
            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'stock_qty':
                case 'stock_qty_useful':
                case 'unit_mass':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        value = Ext.util.Format.number(value, '0,00/i');
                        value = '<font style="font-weight: bold; font-size:10pt; color:#000000;">' + value + '</font>'
                        return value;
                    };
                    break;
                default:
                    break;
            }

        }


        // this.createStore('Rfx2.model.ProduceAssyPlan', [{
        //     property: 'create_date',
        //     direction: 'ASC'
        // }],
        //     /*pageSize*/
        //     gMain.pageSize
        //     , {}
        //     , ['planmap']
        // );

        this.addAssyProdReqQuanAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: gm.getMC('CMD_Summerize', '수량합산'),
            tooltip: '같은 반제품에 대하여 생산요청수량을 합산처리 합니다.',
            disabled: true,
            handler: function () {
                var record = gm.me().grid.getSelectionModel().getSelection();
                var srcahdUids = [];
                var unique_ids = [];
                var srcahd_uid;
                if(record.length > 1) {
                    for (var i = 0; i < record.length; i++) {
                        var rec = record[i];
                        srcahd_uid = rec.get('srcahd_uid');
                        var unique_id = rec.get('unique_id_long');
                        if(srcahd_uid != rec.get('srcahd_uid')) {
                            srcahdUids.push(srcahd_uid);
                            unique_ids.push(unique_id);
                            Ext.MessageBox.show({
                                title: '수량취소',
                                msg: '선택 한 반제품의 요청수량을 합산 하시겠습니까?<br>본 작업을 실행 시 취소할 수 없습니다.',
                                buttons: Ext.MessageBox.YESNO,
                                icon: Ext.MessageBox.QUESTION,
                                fn: function(btn) {
                                    if (btn == "no") {
                                        return;
                                    } else {
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/production/schdule.do?method=addAssyPdReqQuan',
                                            params: {
                                                srcahdUids : srcahdUids,
                                                uniqueIds : unique_ids
                                            },
                                            success: function(result, request) {
                                                Ext.MessageBox.alert('알림','선택한 반제품의 요청수량이 합산되었습니다.');
                                                gm.me().store.load();
                                            },
                                            failure: extjsUtil.failureMessage
                                        });
                                    }
                                }
                            });
                        } else {
                            Ext.MessageBox.alert('알림','다른 반제품의 정보가 선택되었습니다.<br>다시 선택해주세요.')
                        }
                    }
                } else {
                    Ext.MessageBox.alert('알림','두개 이상의 반제품 정보가 선택되어야 합니다.<br>다시 선택해주세요.')
                }
            }
        });

        this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            handler: function () {
                gm.me().producePlanOp();
            }
        });

        this.prExcelAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            text: '엑셀생산계획표',
            tooltip: '엑셀생산계획표',
            disabled: true,
            handler: function () {

            }
        });


        buttonToolbar.insert(1, this.addAssyProdReqQuanAction);
        buttonToolbar.insert(2, this.prEstablishAction);

        //그리드 생성
        var option = {
            features: {
                ftype: 'groupingsummary',
                groupHeaderTpl: '<div>수주번호 :: <font color=#003471><b>{[values.rows[0].data.pl_no]}</b></font> ({rows.length})</div>'
            }
        };

        //그리드 생성
        this.createGrid(searchToolbar, buttonToolbar, option);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length == 1) {
                    var rec = selections[0];
                    // if(rec.get('status') == 'PR') {
                        gm.me().prEstablishAction.enable();
                    // }
                } else {
                    gm.me().prEstablishAction.disable();
                }
            }
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.load(function (records) { });
    },

    producePlanOp: function () {

        var selection = this.grid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);

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
                                    gm.me().addProUnit();
                                }
                            }]
                        },
                        {
                            text: gm.getMC('CMD_DELETE', '삭제'),
                            listeners: [{
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
                                }
                            }]
                        }
                    ]
                })
            ]
        });

        var site = '';
        var pcs_group = '';

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
                                var store = gu.getCmp('workGrid').getStore();
                                var record = gu.getCmp('workGrid').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var selection = gm.me().grid.getSelectionModel().getSelection();
                                var rec = selection[0];
                                console_logs('rec >>>>', rec);
                                this.store.getProxy().setExtraParam('mchn_types', 'LINE|GROUP');
                                // this.store.getProxy().setExtraParam('reserved_varchar2', rec.get('reserved5'));
                                this.store.getProxy().setExtraParam('pcs_code', rec.get('middle_code'));
                                // if (index % 2 == 0) {
                                    delete this.store.getProxy().getExtraParams()['parameter_name'];
                                    this.store.getProxy().setExtraParam('reserved_varchar3', 'PROD');
                                    // this.store.getProxy().setExtraParam.remove();
                                // } else {
                                //     delete this.store.getProxy().getExtraParams()['parameter_name'];
                                //     this.store.getProxy().setExtraParam('reserved_varchar3', 'PKG');
                                // }
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
                                        line_code: rec.get('mchn_code')
                                    },
                                    success: function (result, request) {
                                        var result = result.responseText;
                                        var result_split = result.split("|",2);
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
                                            store.getAt(index).set('start_time',  date +' '+  time);
                                        } else {
                                            Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                        }
                                        var selectionRec = gm.me().grid.getSelectionModel().getSelection();
                                        var recOther = selectionRec[0];
                                        var unit = gu.getCmp('prodUnitGrid').getStore().getAt(record.get('workNumber') - 1);

                                        console_logs('recOther', recOther);
                                        console_logs('bm_quan >>>>', recOther.get('unit_mass'));
                                        console_logs('start_date >>>>', result);
                                        console_logs('mchn_code', rec.get('mchn_code'));
                                        console_logs('item_code', selection.get('item_code'));

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                            waitMsg: '데이터를 처리중입니다.',
                                            params: {
                                                item_code : selection.get('item_code'),
                                                line_code: rec.get('mchn_code'),
                                                bm_quan: unit.get('proQuan'),
                                                start_date: date
                                            },
                                            success: function (result, request) {
                                                var result = result.responseText;
                                                console_logs('end_time_full >>>>', result);
                                                var result_split_e = result.split("|",2);
                                                var date_e = result_split_e[0];
                                                var time_e = result_split_e[1];
                                                console_logs('end_time >>>>', time_e);
                                                if (result.length > 0) {
                                                    store.getAt(index).set('endDate', date_e);
                                                    store.getAt(index).set('end_time', date_e +' '+ time_e);
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
                                var index = store.indexOf(record);
                                store.getAt(index).set('name_ko', rec.get('name_ko'));
                                store.getAt(index).set('pcsmchn_uid', rec.get('unique_id_long'));
                                store.getAt(index).set('workCapa', rec.get('target_qty')); // Capa 산출
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
                        listeners : {
                            select: function (me) {
                                var store = gu.getCmp('workGrid').getStore();
                                var record = gu.getCmp('workGrid').getSelectionModel().getSelected().items[0];
                                var index = store.indexOf(record);
                                var unitStore = gu.getCmp('prodUnitGrid').getStore().getAt(record.get('workNumber') - 1);
                                console_logs('unitStore ???', unitStore);
                                var selectionRec = gm.me().grid.getSelectionModel().getSelection();
                                var recOther = selectionRec[0];
                                if(record.get('mchn_code') !== null) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/production/schdule.do?method=getCalcEndPlanBIOT',
                                        waitMsg: '데이터를 처리중입니다.',
                                        params: {
                                            item_code: recOther.get('item_code'),
                                            line_code: record.get('mchn_code'),
                                            bm_quan: unitStore.get('proQuan'),
                                            start_date:  me.getSubmitValue()
                                        },
                                        success: function (result, request) {
                                            var result = result.responseText;
                                            if (result.length > 0) {
                                                var result_split_e = result.split('|', 2);
                                                var date_e = result_split_e[0];
                                                var time_e = result_split_e[1];
                                                if (result.length > 0) {
                                                    store.getAt(index).set('endDate', date_e);
                                                    store.getAt(index).set('end_time', date_e + ' ' + time_e);
                                                } else {
                                                    // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                    store.getAt(index).set('end_time', me.getSubmitValue());
                                                }
                                            } else {
                                                // Ext.MessageBox.alert('알림', '스케줄링의 범위를 초과하였습니다.');
                                                store.getAt(index).set('endDate', me.getSubmitValue());
                                            }
                                        },//endofsuccess
                                        failure: function (result, request) {
                                            var result = result.responseText;
                                            Ext.MessageBox.alert('알림', result);
                                        }
                                    }); 
                                } else {
                                    Ext.MessageBox.alert('알림','완료예정일을 계산하기 위한 값이 부적절하거나 정확히 입력되지 않았습니다.')
                                    store.removeAt(store.indexOf(record));
                                }
                            }
                        }
                    },
                },
                {
                    text: '시작시간',
                    width: '40%',
                    xtype: 'datecolumn',
                    format: 'H:i',
                    dataIndex: 'start_time',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    // renderer: Ext.util.Format.dateRenderer('H:i:s'),
                    editor: {
                            xtype: 'timefield',
                            name: 'process_time',
                            id: gu.id('start_time'),
                            width: '29.6%',
                            minValue: '0:00',
                            maxValue: '0:00',
                            format: 'H:i',
                            dateFormat: 'H:i',
                            submitFormat: 'H:i',
                            // value: gm.me().getThirtyMinites(new Date()),
                            increment: 60,
                            anchor: '50%',
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
                    listeners : {
                        
                    }
                },
                {
                    text: '완료시간',
                    width: '40%',
                    xtype: 'datecolumn',
                    format: 'H:i',
                    dataIndex: 'end_time',
                    style: 'text-align:center',
                    align: 'left',
                    typeAhead: false,
                    allowBlank: false,
                    sortable: true,
                    // renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                    editor: {
                            xtype: 'timefield',
                            name: 'process_time',
                            id: gu.id('end_time'),
                            width: '29.6%',
                            minValue: '0:00',
                            maxValue: '0:00',
                            format: 'H:i',
                            dateFormat: 'H:i',
                            submitFormat: 'H:i',
                            // value: gm.me().getThirtyMinites(new Date()),
                            increment: 60,
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
                            fieldLabel: '생산요청량',
                            hideTrigger: true,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            editable: false,
                            value: selection.get('bm_quan')
                        },
                        {
                            xtype: 'numberfield',
                            id: gu.id('capaValue'),
                            name: 'capaValue',
                            fieldLabel: '총 수량',
                            hideTrigger: true,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            allowBlank: false,
                            editable: false,
                            value: selection.get('bm_quan')
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
                                    objv1['workNumber'] = item.get('workNumber');
                                    objv1['workGroup'] = item.get('workGroup');
                                    objv1['workCapa'] = item.get('workCapa');
                                    objv1['startDate'] = item.get('startDate');
                                    objv1['startTime'] =  item.get('start_time');
                                    objv1['endDate'] = item.get('endDate');
                                    objv1['endTime'] =  item.get('end_time');
                                    objv1['pcsmchn_uid'] = item.get('pcsmchn_uid');
                                    columns1.push(objv1);
                                    siteArr.push(item.get('work_site'));
                                    mchnCodeArr.push(item.get('mchn_code'));
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
                                        url: CONTEXT_PATH + '/index/process.do?method=addAssemblyProductionPlan',
                                        waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                        params: {
                                            planmap_uid : selection.get('plan_uid'),
                                            prd_group: selection.get('class_code'),
                                            rtgast_uid: -1,
                                            cartmap_uid: selection.get('unique_id'),
                                            bm_quan: selection.get('bm_quan'),
                                            project_uid: selection.get('ac_uid'),
                                            assymap_uid: selection.get('assymap_uid'),
                                            srcahd_uid: selection.get('child'),
                                            site : selection.get('site'),
                                            item_code : selection.get('item_code'),
                                            jsonData1: jsonData1,
                                            jsonData2: jsonData2,
                                            pcs_group: pcs_group,
                                            siteArr: siteArr,
                                            mchnCodeArr: mchnCodeArr,
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

        gm.me().addProUnitFirst();

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

    addProUnitFirst: function () {
        var store = gu.getCmp('prodUnitGrid').getStore();
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var cnt = store.getCount() + 1;

        store.insert(store.getCount(), new Ext.data.Record({
            'proNumber': cnt,
            'proQuan': rec.get('bm_quan')
        }));

        var workStore = gu.getCmp('workGrid').getStore();

        workStore.insert(workStore.getCount(), new Ext.data.Record({
            'workNumber': cnt,
            'workCapa': 0,
            'startDate': null,
            'endDate': null,
            'start_time' : null,
            'end_time' : null,
            'pcsmchn_uid': null,
            'mchn_code' : null,
            'work_site' : null
        }));

        // workStore.insert(workStore.getCount(), new Ext.data.Record({
        //     'workNumber': cnt,
        //     'workCapa': 0,
        //     'startDate': null,
        //     'endDate': null,
        //     'start_time' : null,
        //     'end_time' : null,
        //     'pcsmchn_uid': null,
        //     'mchn_code' : null
        // }));
    },

    addProUnit: function () {
        var selection = gm.me().grid.getSelectionModel().getSelection();
        var rec = selection[0];
        var bm_quan  = rec.get('unit_mass');
        var store = gu.getCmp('prodUnitGrid').getStore();
        var previous_store = store.data.items;
        var total_quan = 0;

        for (var j = 0; j < previous_store.length; j++) {
            var item = previous_store[j];
            total_quan = Number(total_quan) + Number(item.get('proQuan'));
        }
        console_logs('등록된 total_quan ??? ', total_quan);
        console_logs('차액 ???' , Number(bm_quan) - Number(total_quan))
        var diff_price = Number(bm_quan) - Number(total_quan);
        var cnt = store.getCount() + 1;

        gu.getCmp('capaValue').setValue(Number(bm_quan) - Number(total_quan) + Number(total_quan))

        store.insert(store.getCount(), new Ext.data.Record({
            'proNumber': cnt,
            'proQuan': diff_price
        }));

        var workStore = gu.getCmp('workGrid').getStore();

        workStore.insert(workStore.getCount(), new Ext.data.Record({
            'workNumber': cnt,
            'workCapa': 0,
            'startDate': null,
            'endDate': null,
            'start_time' : null,
            'end_time' : null,
            'pcsmchn_uid': null,
            'mchn_code' : null,
            'work_site' : null
        }));

        // workStore.insert(workStore.getCount(), new Ext.data.Record({
        //     'workNumber': cnt,
        //     'workCapa': 0,
        //     'startDate': null,
        //     'endDate': null,
        //     'start_time' : null,
        //     'end_time' : null,
        //     'pcsmchn_uid': null,
        //     'mchn_code' : null
        // }));
    }
});