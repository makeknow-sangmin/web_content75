Ext.define('Rfx2.view.gongbang.produceMgmt.VersionBomConfirmationView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'requirement-aanalysis-view',

    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        //모델을 통한 스토어 생성
        this.createStore('Rfx2.model.SalesPriceResourcePlan', [{
                property: 'unique_id',
                direction: 'ASC'
            }],
            gm.pageSize
            , {}
            , ['srcahd']
        );

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.pdBomStore = Ext.create('Rfx2.store.company.bioprotech.RegistPoStore', {});
        this.createGrid(arr);
        this.createCrudTab();

        this.acButton = Ext.create('Ext.Action', {
            iconCls: 'af-play',
            text: gm.getMC('CMD_Calculation', '소요량계산'),
            tooltip: this.getMC('msg_btn_prd_add', '소요량 계산 실행'),
            disabled: true,
            handler: function () {
                var record = gm.me().grid.getSelectionModel().getSelection();
                var rec = record[0];
                var version_uid = -1;
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=getLastBomVer',
                    params: {
                        srcahd_uid: rec.get('unique_id_long'),
                    },
                    success: function (result, request) {
                        console_logs('result.responseText >>', result.responseText);
                        version_uid = result.responseText;
                    },
                    failure: function () {
                        Ext.MessageBox.alert('알림', '소요량 분석을 위한 최신 BOM 버전을 불러오는 중 오류가 발생하였습니다.<br>같은 증상이 계속될 시 관리자에게 문의하십시오.')
                    }
                });

                Ext.MessageBox.show({
                    title: '소요량계산',
                    msg: '선택한 제품에 대하여 소요량 분석을 실시하시겠습니까?<br>단, 최신버전의 BOM Version을 기준으로 계산을 실시합니다.',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == "no" || btn == "cancel") {
                            return;
                        } else {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/production/ra.do?method=calcConsumeRatioBomVer',
                                params: {
                                    bomverUid: version_uid,
                                    srcahdUid: rec.get('unique_id_long')
                                },
                                success: function (result, request) {
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                });
            }
        });

        buttonToolbar.insert(1, this.acButton);

        this.gridPoList = Ext.create('Ext.grid.Panel', {
            store: this.pdBomStore,
            cls: 'rfx-panel',
            id: gu.id('bomListGrid'),
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
            bbar: getPageToolbar(this.pdBomStore),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            margin: '0 0 0 0',
            columns: [
                {
                    text: '상태',
                    width: 80,
                    align: 'center',
                    style: 'text-align:center',
                    dataIndex: 'sloast_status_kr',
                    sortable: false,
                    renderer: function (value, meta) {
                        if (value === '수주등록') {
                            meta.style = "background-color:#2F9D27;color:#ffffff;text-align:center;";
                        }
                        if (value === 'BOM확정') {
                            meta.style = "background-color:#ffffff;color:#000000;text-align:center;";
                        }
                        if (value === '수주확정') {
                            meta.style = "background-color:#ffffff;color:#000000;text-align:center;";
                        }
                        if (value === '계획수립') {
                            meta.style = "background-color:#FAED7D;color:#000000;text-align:center;";
                        }
                        if (value === '생산중') {
                            meta.style = "background-color:#0054FF;color:#ffffff;text-align:center;";
                        }
                        if (value === '분할출고') {
                            meta.style = "background-color:#008299;color:#ffffff;text-align:center;";
                        }
                        if (value === '출고완료') {
                            meta.style = "background-color:#FFE08C;color:#000000;text-align:center;";
                        }
                        return value;
                    },
                },
                {
                    text: '수주번호',
                    width: 100,
                    align: 'left',
                    style: 'text-align:center',
                    dataIndex: 'order_number',
                    sortable: false
                },
                {
                    text: '수주일자',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'regist_date',
                    renderer: function (value, meta, record) {

                        if (value !== null && value.length > 10) {
                            return value.substring(0, 10);
                        } else {
                            return null;
                        }

                    }
                },
                {text: '고객사', width: 120, style: 'text-align:center', dataIndex: 'wa_name', sortable: false},
                {text: '최종고객사', width: 120, style: 'text-align:center', dataIndex: 'final_wa_name', sortable: false},
                {text: '사업부', width: 80, style: 'text-align:center', dataIndex: 'reserved5', sortable: false},
                {
                    text: '수주수량',
                    width: 100, align: 'right', style: 'text-align:center',
                    dataIndex: 'sales_amount', sortable: false, align: 'right',

                }
            ],
            title: '수주이력',
            autoScroll: true,
            listeners: {}
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: true,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '48%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.grid]
                    }]
                }, this.gridPoList
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                this.acButton.enable();
                var rec = selections[0];
                this.gridPoList.getStore().getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
                this.gridPoList.getStore().load(function (record) {
                });
            } else {
                this.acButton.disable();
            }
        });

        this.gridPoList.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {

                } else {

                }
            }
        });
    },

    loding_msg: function () {
        Ext.MessageBox.wait('데이터를 처리중입니다.<br>잠시만 기다려주세요.', '알림');
    },

    stop_msg: function () {
        Ext.MessageBox.hide();
    },
    versionSelStore: Ext.create('Mplm.store.BomVersionSelStore')
});