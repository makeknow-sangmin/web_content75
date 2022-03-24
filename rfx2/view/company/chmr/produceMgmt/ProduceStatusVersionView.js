//수주관리 메뉴
Ext.define('Rfx2.view.company.chmr.produceMgmt.ProduceStatusVersionView', {
    extend       : 'Rfx2.base.BaseView',
    xtype        : 'recv-mgmt-kbtech-view',
    initComponent: function () {
        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.
        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // 검색툴바 필드 초기화
        this.initSearchField();


        // console_logs('>>>> present', present);
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        var last_date = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate());


        this.addSearchField({
            type    : 'checkbox',
            field_id: 'isModelNo',
            items   : [
                {
                    boxLabel: '식별번호 있는 제품만',
                    checked : false
                },
            ],
        });

        this.addSearchField({
            // type: 'combo',
            field_id      : 'year',
            emptyText     : '연도'
            , store       : 'YearStore'
            , displayField: 'view'
            , valueField  : 'year'
            , innerTpl    : '{view}'
        });

        this.addSearchField('item_name');
        this.addSearchField({
            type     : 'text',
            field_id : 'description',
            emptyText: '규격'
        });


        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.buttonToolbar3 = Ext.create('widget.toolbar', {

            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                style: 'color: #FFFFFF; font-weight: bold; align: left; font-size: 15px; margin: 5px;',
                text : year + '-' + month + '-' + last_date + '일 기준'
            }]
        }),

            this.buttonToolbar3.items.items[1].update(year + '-' + month + '-' + last_date + ' 기준');


        this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls : 'mfglabs-retweet_14_0_5395c4_none',
            text    : gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip : '생산 계획을 수립합니다',
            disabled: true,
            handler : function () {
                gm.me().producePlanOp();
            }
        });

        this.createStore('Rfx2.model.ProduceStateByPlan', [{
                property : 'create_date',
                direction: 'DESC'
            }],
            gMain.pageSize/* pageSize */
            , {
                creator  : 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['cartmap']
        );

        this.setRowClass(function (record, index) {
            var c = record.get('useful_qty');
            if (c < 0) {
                return 'red-row';
            }
        });

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(1, this.prEstablishAction);

        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        arr.push(this.buttonToolbar3);

        this.createGridCore(arr/** , option**/);
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>>>>> callback datas', selections);
                var rec = selections[0];
                gm.me().prEstablishAction.enable();
            } else {
                gm.me().prEstablishAction.disable();
            }
        });

        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items : [this.grid, this.crudTab]
        });
        this.callParent(arguments);
        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('not_pj_type', 'NP');
        this.store.load(function (records) {
        });

    },

    producePlanOp: function () {
        var selections = gm.me().grid.getSelectionModel().getSelection();
        console_logs('selection ????', selections);
        var myWidth = 600;
        var myHeight = 600;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        console_logs('>>> first_date', firstDay);

        this.producePlanOpGrid = Ext.create('Ext.grid.Panel', {
            store      : new Ext.data.Store(),
            cls        : 'rfx-panel',
            id         : gu.id('producePlanOpGrid'),
            multiSelect: false,
            autoScroll : true,
            viewConfig : {
                markDirty: false
            },
            height     : 480,
            border     : true,
            overflowY  : 'scroll',
            padding    : '0 0 0 0',
            width      : 580,
            layout     : 'fit',
            forceFit   : true,
            plugins    : {
                ptype       : 'cellediting',
                clicksToEdit: 2
            },
            columns    : [{
                text     : '품명',
                style    : 'text-align:center',
                flex     : 1,
                dataIndex: 'item_name'
            }, {
                text     : '규격',
                flex     : 1.2,
                dataIndex: 'concat_spec_desc',
                style    : 'text-align:center',

            }, {
                text     : '생산계획량',
                flex     : 0.8,
                dataIndex: 'bm_quan',
                style    : 'text-align:center',
                align    : 'right',
                editor   : {
                    xtype: 'numberfield'
                },
                renderer : function (value, context, tmeta) {
                    if (value == null) {
                        return 0;
                    }
                    return Ext.util.Format.number(value, '0,00/i');
                }
            }, {
                text     : '시작일자',
                flex     : 0.8,
                dataIndex: 'produce_start_plan',
                style    : 'text-align:center',
                format   : 'Y-m-d',
                renderer : Ext.util.Format.dateRenderer('Y-m-d'),
                editor   : new Ext.form.DateField({
                    xtype : 'datefield',
                    format: 'Y-m-d'
                }),
            }, {
                text     : '종료일자',
                flex     : 0.8,
                dataIndex: 'produce_end_plan',
                style    : 'text-align:center',
                renderer : Ext.util.Format.dateRenderer('Y-m-d'),
                editor   : new Ext.form.DateField({
                    xtype : 'datefield',
                    format: 'Y-m-d'
                }),
            }]
        });

        this.producePlanOpGrid.getStore().remove();
        for (var i = 0; i < selections.length; i++) {
            this.producePlanOpGrid.getStore().add(selections[i]);
        }

        var form = Ext.create('Ext.form.Panel', {
            xtype      : 'form',
            frame      : false,
            border     : false,
            autoScroll : true,
            bodyPadding: 10,
            region     : 'center',
            layout     : 'vbox',
            width      : myWidth,
            height     : myHeight,
            items      : [
                {
                    xtype   : 'container',
                    width   : '100%',
                    defaults: {
                        width  : '99%',
                        padding: '1 2 2 10'
                    },
                    border  : true,
                    layout  : 'vbox',
                    items   : [
                        this.producePlanOpGrid
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal  : true,
            title  : '생산계획수립',
            width  : myWidth,
            height : myHeight,
            items  : form,
            buttons: [
                {
                    text   : CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                var store = gu.getCmp('producePlanOpGrid').getStore();

                                var isOk = false;
                                var srcahd_uids = [];
                                var bm_quans = [];
                                var start_dates = [];
                                var end_dates = [];

                                for (var i = 0; i < store.getCount(); i++) {
                                    var rec = store.getAt(i);
                                    var bm_quan = rec.get('bm_quan');
                                    var start_date = rec.get('produce_start_plan');
                                    var end_date =  rec.get('produce_end_plan');
                                    if (bm_quan === 0 || start_dates === null || end_date === null) {
                                        isOk = false;
                                        break;
                                    } else {
                                        var start_date_str = '';
                                        var end_date_str = '';
                                        var is_start_date_type =  typeof(start_date);
                                        var is_end_date_type = typeof(end_date);
                                        console_logs('>>>> is_start_date_type', is_start_date_type);
                                        console_logs('>>>> is_end_date_type', is_end_date_type);
                                        if(is_start_date_type === 'object') {
                                            start_date_str = start_date.getFullYear() + '-' + (start_date.getMonth() + 1) + '-' + start_date.getDate();
                                        } else {
                                            start_date_str = start_date;
                                        }

                                        if(is_end_date_type === 'object') {
                                            end_date_str = end_date.getFullYear() + '-' + (end_date.getMonth()  +  1)+ '-' + end_date.getDate();
                                        } else {
                                            end_date_str = end_date;
                                        }

                                        srcahd_uids.push(rec.get('unique_id_long'));
                                        bm_quans.push(bm_quan);
                                        start_dates.push(start_date_str);
                                        end_dates.push(end_date_str);
                                    }
                                }

                                form.submit({
                                    submitEmptyText: false,
                                    url            : CONTEXT_PATH + '/index/process.do?method=addPrdPlanEstablishByPlanMulti',
                                    waitMsg        : '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                    params         : {
                                        srcahd_uids : srcahd_uids,
                                        bm_quans : bm_quans,
                                        start_dates : start_dates,
                                        end_dates : end_dates
                                    },
                                    success        : function (val, action) {
                                        console_logs('OK', 'PROCESS OK');
                                        if (prWin) {
                                            Ext.MessageBox.alert('확인', '확인 되었습니다.');
                                            prWin.close();
                                            gm.me().store.load();
                                        }
                                    },
                                    failure        : function () {
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
                    text   : CMD_CANCEL,
                    scope  : this,
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

    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var rec = selections[0];
        console_logs('>>>> rec dbclick', rec);
        var detailStore = Ext.create('Rfx2.store.company.chmr.ProjectStatusByProduct', {});
        detailStore.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
        detailStore.getProxy().setExtraParam('is_req_del', 'Y');
        detailStore.load();
        var loadForm = Ext.create('Ext.grid.Panel', {
            store      : detailStore,
            selModel   : Ext.create("Ext.selection.CheckboxModel", {}),
            id         : gu.id('loadForm'),
            layout     : 'fit',
            region     : 'center',
            style      : 'padding-left:0px;',
            plugins    : {
                ptype       : 'cellediting',
                clicksToEdit: 2,
            },
            bbar       : Ext.create('Ext.PagingToolbar', {
                store      : detailStore,
                displayInfo: true,
                pageSize   : 100,
                displayMsg : '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg   : "표시할 항목이 없습니다.",
                listeners  : {
                    beforechange: function (page, currentPage) {

                    }
                }

            }),
            columns    : [
                {
                    text     : "수주일자",
                    flex     : 1,
                    style    : 'text-align:center',
                    dataIndex: 'regist_date',
                    sortable : true,
                    renderer : Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text     : "고객사",
                    flex     : 1,
                    dataIndex: 'wa_name',
                    align    : 'left',
                    style    : 'text-align:center',
                    sortable : true,
                },
                {
                    text     : "현장명",
                    flex     : 1,
                    dataIndex: 'pj_name',
                    align    : 'left',
                    style    : 'text-align:center',
                    sortable : true,
                },
                {
                    text     : "수주수량",
                    flex     : 1,
                    style    : 'text-align:center',
                    dataIndex: 'po_qty',
                    align    : 'right',
                    sortable : true,
                    // renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text     : "납품수량",
                    flex     : 1,
                    style    : 'text-align:center',
                    dataIndex: 'out_qty',
                    align    : 'right',
                    sortable : true,
                },
            ],
            renderTo   : Ext.getBody(),
            autoScroll : true,
            multiSelect: true,
            pageSize   : 100,
            width      : 100,
            height     : 300,
        });

        loadForm.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length) {
                    var rec = selections[0];
                    gm.me().deleteWthList.enable();
                    // gu.getCmp('loadCancel').enable();
                } else {
                    gm.me().deleteWthList.disable();
                    // gu.getCmp('loadCancel').disable();
                }
            }
        });

        var winProduct = Ext.create('ModalWindow', {
            title    : '수주이력 조회',
            width    : 200,
            height   : 600,
            minWidth : 600,
            minHeight: 300,
            items    : [
                loadForm
            ],
            buttons  : [{
                text   : CMD_OK,
                handler: function (btn) {
                    winProduct.setLoading(false);
                    winProduct.close();
                }
            }]
        });
        winProduct.show();
    },

});
