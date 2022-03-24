Ext.define('Rfx2.view.company.scon.qualityMgmt.ImportInspectionView', {
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

        this.store.getProxy().setExtraParam('is_ok', 'N');
        this.store.getProxy().setExtraParams({
            'standard_flag': 'R',
        });


        this.addTakeResult = Ext.create('Ext.Action', {
            iconCls : 'af-plus-circle',
            text    : '성적서 결과입력',
            disabled: true,
            handler : function () {
                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                gm.me().inspectList.getProxy().setExtraParam('srcahd_uid', select.get('srcahd_uid'));
                gm.me().inspectList.load();

                var productGrid = Ext.create('Ext.grid.Panel', {
                    store:   gm.me().inspectList,
                    cls: 'rfx-panel',
                    id: gu.id('inspectGrid'),
                    collapsible: false,
                    multiSelect: false,
                    width: 1000,
                    margin: '0 0 20 0',
                    autoHeight: true,
                    frame: false,
                    border: true,
                    forceFit: false,
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
                            width: '30%',
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
                            dataIndex: 'measure',
                            editor: 'textfield',
                            style: 'text-align:center',
                            align: 'left',
                            sortable: false,
                        },
                        {
                            text: '판정',
                            width: '10%',
                            css: 'edit-cell',
                            dataIndex: 'decision',
                            style: 'text-align:center',
                            sortable: false,
                            editor: {
                                xtype: 'combobox',
                                id: gu.id('decision'),
                                displayField: 'codeName',
                                editable: true,
                                forceSelection: true,
                                store: gm.me().decisionStore,
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
                            width: '25%',
                            css: 'edit-cell',
                            dataIndex: 'comment',
                            style: 'text-align:center',
                            editor: 'textfield',
                            sortable: false
                        },
                    ],
                    selModel: 'cellmodel',
                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 2,
                    },
                    listeners: {
                        edit: function (editor, e, eOpts) {

                        }
                    },

                });

                var form = Ext.create('Ext.form.Panel', {
                    id         : 'addTakeResult',
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
                            title      : gm.me().getMC('msg_order_dia_header_title', '공통정보'),
                            width      : '100%',
                            style      : 'padding:10px',
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
                                    defaultMargins: {
                                        top   : 0,
                                        right : 0,
                                        bottom: 0,
                                        left  : 10
                                    },
                                    items         : [
                                        {
                                            id        :  'v000',
                                            name      : 'v000',
                                            allowBlank: true,
                                            fieldLabel: '종류 / 규격',
                                            xtype     : 'textfield',
                                            width     : '45%',
                                            padding   : '0 0 5px 30px',
                                            editable  : false,
                                            fieldStyle: 'background-color: #FFFCCC;',
                                            value     : select.get('item_name') + (select.get('specification') !== '' ? ' / ' + select.get('specification') : '')
                                        },
                                        {
                                            xtype     : 'textfield',
                                            id        : 'v001',
                                            name      : 'v001',
                                            width     : '45%',
                                            allowBlank: true,
                                            padding   : '0 0 5px 30px',
                                            fieldLabel: '채취장소'
                                        },
                                        {
                                            xtype     : 'textfield',
                                            id        : 'v002',
                                            name      : 'v002',
                                            padding   : '0 0 5px 30px',
                                            width     : '45%',
                                            allowBlank: true,
                                            fieldLabel: 'LOT No'
                                        },

                                        {
                                            fieldLabel: '채취일자',
                                            xtype     : 'datefield',
                                            padding   : '0 0 5px 30px',
                                            width     : '45%',
                                            name      : 'v003',
                                            format    : 'Y-m-d',
                                            allowBlank: false,
                                            id        : 'v003'
                                        },
                                        {
                                            xtype     : 'textfield',
                                            id        : 'v004',
                                            name      : 'v004',
                                            padding   : '0 0 5px 30px',
                                            width     : '45%',
                                            allowBlank: false,
                                            fieldLabel: '공급사',
                                            fieldStyle: 'background-color: #FFFCCC;',
                                            value : select.get('seller_name')
                                        },
                                        {
                                            fieldLabel: '시험일자',
                                            xtype     : 'datefield',
                                            padding   : '0 0 5px 30px',
                                            width     : '45%',
                                            name      : 'v005',
                                            format    : 'Y-m-d',
                                            allowBlank: false,
                                            id        : 'v005'
                                        },
                                        {
                                            fieldLabel: '시험방법',
                                            xtype     : 'textfield',
                                            padding   : '0 0 5px 30px',
                                            width     : '45%',
                                            name      : 'v006',
                                            format    : 'Y-m-d',
                                            allowBlank: false,
                                            id        : 'v006'
                                        },
                                    ]
                                },
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            frame: true,
                            title      : '검사항목 입력',
                            width      : '100%',
                            height     : '100%',
                            layout     : 'fit',
                            bodyPadding: 10,
                            items: [
                                productGrid
                            ]
                        },
                    ]
                });

                var win = Ext.create('Ext.Window', {
                    modal    : true,
                    title    : '성적서 검사입력',
                    width    : 1100,
                    height   : 550,
                    plain    : true,
                    items    : form,
                    overflowY: 'scroll',
                    buttons  : [{
                        text   : CMD_OK,
                        handler: function (btn) {
                            if (btn == "no") {
                                win.close();
                            } else {
                                var form = Ext.getCmp('addTakeResult').getForm();
                                if (form.isValid()) {
                                    win.setLoading(true);
                                    var val = form.getValues(false);
                                    var storeData = gu.getCmp('inspectGrid').getStore();
                                    const spccolumn_uids = [];
                                    const measure_values = [];
                                    const decisions = [];
                                    const comments = [];
                                    var isEmptyMeasure = false;
                                    var isEmptyDecision = false;
                                    for (var j = 0; j < storeData.data.items.length; j++) {
                                        var item = storeData.data.items[j];
                                        spccolumn_uids.push(item.get('unique_id_long'));
                                        const measure = item.get('measure');
                                        if (measure == undefined || measure == null ||  (measure.replace(/(\s*)/g, "")).length === 0) {
                                            isEmptyMeasure = true;
                                        } else {
                                            measure_values.push(item.get('measure'));
                                        }
                                        const decision = item.get('decision');
                                        if (decision == undefined || decision == null ||  (decision.replace(/(\s*)/g, "")).length === 0) {
                                            isEmptyDecision = true;
                                        } else {
                                            decisions.push(item.get('decision'));
                                        }
                                        const comment = item.get('comment');
                                        if (comment == undefined || comment == null ||  (comment.replace(/(\s*)/g, "")).length === 0) {
                                            comments.push('-');
                                        } else {
                                            comments.push(item.get('comment'));
                                        }
                                    }

                                    if(isEmptyMeasure === true) {
                                        Ext.MessageBox.alert('알림', '측정값이 공란인 곳이 있습니다.');
                                        win.setLoading(false);
                                        return;
                                    } else if(isEmptyDecision === true) {
                                        Ext.MessageBox.alert('알림', '판정값이 공란인 곳이 있습니다.');
                                        win.setLoading(false);
                                        return;
                                    } else {
                                        form.submit({
                                            submitEmptyText: false,
                                            url: CONTEXT_PATH + '/quality/cementInspect.do?method=insertIncomeResultValue',
                                            waitMsg: '데이터를 저장중입니다.',
                                            params: {
                                                spccolumn_uids : spccolumn_uids,
                                                measure_values : measure_values,
                                                comments : comments,
                                                decisions : decisions,
                                                wgrast_uid : select.get('unique_id_long')
                                            },
                                            success: function (val, action) {
                                                if (win) {
                                                    win.close();
                                                }
                                                Ext.MessageBox.alert('확인', '저장 되었습니다.');
                                                gm.me().store.load();
                                            },
                                            failure: function (val, action) {
                                                if (win) {
                                                    console_log('failure');
                                                    win.close();
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }, {
                        text   : CMD_CANCEL,
                        handler: function (btn) {
                            win.close();
                        }
                    }]
                });
                win.show();
            }
        });

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
        buttonToolbar.insert(1, this.addTakeResult);

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
        this.store.getProxy().setExtraParams({
            isReady: true,
        });
        gm.setCenterLoading(false);
        this.storeLoad();

        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                console_logs('>>> aaa', 'aaa');
                gm.me().addTakeResult.enable();
            } else {
                gm.me().addTakeResult.disable();
            }
        });

    }, // end of init
    inspectList  : Ext.create('Rfx2.store.company.chmr.MaterialInspectionListStore'),
    decisionStore: Ext.create('Mplm.store.CommonCodeStore', { parentCode: 'INPSECT_DECISION' }),
});
