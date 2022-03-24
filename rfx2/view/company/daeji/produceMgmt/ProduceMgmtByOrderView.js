Ext.define('Rfx2.view.company.daeji.produceMgmt.ProduceMgmtByOrderView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'produce-mgmt-byorder-ver-view',
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

        this.addSearchField('order_no');
        this.addSearchField('wa_name');
        this.addSearchField('item_name');

        //검색툴바 생성
        let searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        let buttonToolbar = this.createCommandToolbar({
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
            gm.pageSize,
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

        this.prExcelAction = Ext.create('Ext.Action', {
            iconCls: 'af-download',
            text: '엑셀생산계획표',
            tooltip: '엑셀생산계획표',
            disabled: true,
            handler: function () {
            },
        });

        buttonToolbar.insert(1, this.prEstablishAction);

        //그리드 생성
        this.createGrid(searchToolbar, buttonToolbar);

        //입력/상세 창 생성.
        this.createCrudTab();

        let wdGridStore = Ext.create('Rfx2.store.PrchOnProduceStore', {});

        /* 원단 발주 정보 그리드  */
        let wdGrid = Ext.create('Ext.grid.Panel', {
            store: wdGridStore,
            style: 'padding-left:10px;padding-right:10px;',
            width: '60%',
            region: 'center',
            id: gu.id('wdGrid'),
            title: '원단',
            scroll: true,
            columns: [
                {text: '구분', width: 40, align: 'center', dataIndex: 'column01'},
                {text: '원단명', width: 200, align: 'center', dataIndex: 'item_name'},
                {text: '골', width: 100, align: 'center', dataIndex: 'column03'},
                {text: '장', width: 60, align: 'center', dataIndex: 'column04'},
                {text: '폭', width: 60, align: 'center', dataIndex: 'column05'},
                {text: '절수', width: 60, align: 'center', dataIndex: 'column06'},
                {text: '재단규격', width: 70, align: 'center', dataIndex: 'column07'},
                {text: '수량', width: 70, align: 'center', dataIndex: 'quan'},
                {text: '매입처명', width: 150, align: 'center', dataIndex: 'aprv_date'},
                {text: '일자', width: 100, align: 'center', dataIndex: 'column10'},
                {text: '비고', width: 100, align: 'center', dataIndex: 'column11'}
            ],
            listeners: {

            },
            border: false,
            multiSelect: true,
            frame: true,
            forceFit: true,
            dockedItems: []
        });

        let processGrid = Ext.create('Ext.grid.Panel', {
            store: new Ext.data.Store(),
            style: 'padding-left:10px;padding-right:10px;',
            width: '40%',
            id: gu.id('processGrid'),
            title: '공정',
            region: 'east',
            scroll: true,
            columns: [
                {text: '작업공정', width: 100, align: 'center', dataIndex: 'column01'},
                {text: '작업단위', width: 100, align: 'center', dataIndex: 'column02'},
                {text: '작업수량', width: 100, align: 'center', dataIndex: 'column03'}
            ],
            listeners: {

            },
            border: false,
            multiSelect: true,
            frame: true,
            forceFit: true,
            dockedItems: []
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: true,
                    region: 'north',
                    margin: '0 0 0 0',
                    height: '70%',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    items: [{
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        height: '100%',
                        flex: 0,
                        items: [this.grid]
                    }]
                },
                {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    margin: '0 0 5 0',
                    layout: 'border',
                    height: '30%',
                    items: [{
                        region: 'center',
                        layout: 'fit',
                        margin: '0 5 0 0',
                        width: '70%',
                        height: '100%',
                        autoHeight: true,
                        flex: 0,
                        items: [wdGrid]
                    },{
                        region: 'east',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '30%',
                        height: '100%',
                        autoHeight: true,
                        flex: 0,
                        items: [processGrid]
                    }]
                }
            ]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length === 1) {
                    gm.me().prEstablishAction.enable();
                    wdGridStore.getProxy().setExtraParam('cartmap_uid', selections[0].get('unique_id_long'));
                    wdGridStore.load();
                } else {
                    gm.me().prEstablishAction.disable();
                    wdGridStore.removeAll();
                }
            },
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.store.load();
    },

    producePlanOp: function () {
        let selection = this.grid.getSelectionModel().getSelection()[0];
        let myWidth = 465;
        let myHeight = 300;

        let form = Ext.create('Ext.form.Panel', {
            xtype: 'form',
            frame: false,
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            region: 'center',
            layout: 'vbox',
            width: myWidth,
            height: myHeight - 100,
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
                        },

                        {
                            xtype: 'numberfield',
                            name: 'bm_quan',
                            id: gu.id('bm_quan'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '생산계획량',
                            hideTrigger: false,
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            value: selection.get('assymap_bm_quan'),
                            listeners: {}
                        },
                        {
                            xtype: 'datefield',
                            name: 'start_date',
                            id: gu.id('start_date'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '생산시작일',
                            hideTrigger: false,
                            value: new Date(),
                            format: 'Y-m-d',
                            keyNavEnabled: true,
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {}
                        },
                        {
                            xtype: 'datefield',
                            name: 'end_date',
                            id: gu.id('end_date'),
                            fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '생산종료일',
                            hideTrigger: false,
                            keyNavEnabled: true,
                            format: 'Y-m-d',
                            mouseWheelEnabled: true,
                            editable: true,
                            listeners: {}
                        }
                    ]
                }
            ]
        });

        let prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '생산계획수립',
            width: myWidth,
            height: myHeight,
            items: form,
            buttons: [
                {
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn === 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                let val = form.getValues(false);
                                form.submit({
                                    submitEmptyText: false,
                                    url: CONTEXT_PATH + '/index/process.do?method=addPrdPlanEstablishByOrder',
                                    waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                    params: {
                                        srcahd_uid: selection.get('child'),
                                        produce_plan_qty: val['bm_quan'],
                                        start_date: val['start_date'],
                                        end_date: val['end_date'],
                                        project_uid: selection.get('ac_uid'),
                                        cartmap_uid: selection.get('unique_id_long'),
                                        assymap_uid: selection.get('assymap_uid'),
                                        pcstpl_uid: selection.get('pcstpl_uid'),
                                        machine_uid: val['machine_uid'],
                                        batchWorkCode: selection.get('batch_work_code')
                                    },
                                    success: function () {
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
    }
});

