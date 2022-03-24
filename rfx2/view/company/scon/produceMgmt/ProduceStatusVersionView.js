//수주관리 메뉴
Ext.define('Rfx2.view.company.scon.produceMgmt.ProduceStatusVersionView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'recv-mgmt-kbtech-view',
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
        var month = (date.getMonth() + 1) < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1);
        var last_date = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate());
       

        this.addSearchField({
            type: 'checkbox',
            field_id: 'isModelNo',
            items: [
                {
                    boxLabel: '식별번호 있는 제품만',
                    checked: false
                },
            ],
        });

        this.addSearchField({
            // type: 'combo',
            field_id: 'year',
            emptyText: '연도'
            , store: 'YearStore'
            , displayField: 'view'
            , valueField: 'year'
            , innerTpl: '{view}'
        });

        this.addSearchField('item_name');
        this.addSearchField({
            type: 'text',
            field_id: 'description',
            emptyText: '규격'
        });
        

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.buttonToolbar3 = Ext.create('widget.toolbar', {
        
            items: [{
                xtype: 'tbfill'
            },{
                xtype: 'label',
                style: 'color: #FFFFFF; font-weight: bold; align: left; font-size: 15px; margin: 5px;',
                text: year + '-' + month +'-'+last_date+'일 기준'
            }]
        }),

         this.buttonToolbar3.items.items[1].update(year + '-' + month +'-'+last_date+' 기준');


         this.prEstablishAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Production_Order', '계획수립'),
            tooltip: '생산 계획을 수립합니다',
            disabled: true,
            handler: function () {
                gm.me().producePlanOp();
            }
        });

        this.createStore('Rfx2.model.ProduceStateByPlan', [{
            property: 'create_date',
            direction: 'DESC'
        }],
            gMain.pageSize/* pageSize */
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['cartmap']
        );

        this.setRowClass(function (record, index) {
            var c = record.get('useful_qty');
            if(c < 0) {
                return 'red-row';
                // break;
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
            items: [this.grid, this.crudTab]
        });
        this.callParent(arguments);
        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('not_pj_type', 'NP');
        this.store.load(function (records) {
        });

    },

    producePlanOp: function () {
        var selection = this.grid.getSelectionModel().getSelection()[0];
        console_logs('selection ????', selection);
        var myWidth = 465;
        var myHeight = 280;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        console_logs('>>> first_date', firstDay)

        var form = Ext.create('Ext.form.Panel', {
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
                            value: selection.get('item_name') + ' / ' + selection.get('concat_spec_desc') 
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
                            listeners: {

                            }
                        },
                        {
                            items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>' + '시작일자 /<br>종료일자',
                                anchor: '100%',
                                width: '100%',
                                layout: 'hbox',
                                defaults: {
                                    margin: '2 2 2 2'
                                },
                                default: {
                                    flex: 1
                                },
                                items: [
                                    {
                                        xtype: 'datefield',
                                        name: 'start_plan_date',
                                        anchor: '100%',
                                        width: 158,
                                        editable: true,
                                        format : 'Y-m-d',
                                        allowBlank: false,
                                        value : firstDay,
                                    },
                                    {
                                        xtype: 'datefield',
                                        name: 'end_plan_date',
                                        anchor: '100%',
                                        width: 158,
                                        editable: true,
                                        format : 'Y-m-d',
                                        value : lastDay
                                    },
                                ]
                            }]
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '생산계획수립',
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
                                var val = form.getValues(false);
                                form.submit({
                                    submitEmptyText: false,
                                    url: CONTEXT_PATH + '/index/process.do?method=addPrdPlanEstablishByPlan',
                                    waitMsg: '데이터를 처리중입니다.<br>잠시만 기다려 주십시오.',
                                    params: {
                                        srcahd_uid: selection.get('unique_id_long'),
                                        produce_plan_qty: val['bm_quan']
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
    },

    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var rec = selections[0];
        console_logs('>>>> rec dbclick', rec);
        var detailStore = Ext.create('Rfx2.store.company.chmr.ProjectStatusByProduct', {});
        detailStore.getProxy().setExtraParam('srcahd_uid', rec.get('unique_id_long'));
        detailStore.load();
        var loadForm = Ext.create('Ext.grid.Panel', {
            store: detailStore,
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            id: gu.id('loadForm'),
            layout: 'fit',
            region: 'center',
            style: 'padding-left:0px;',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 2,
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                store: detailStore,
                displayInfo: true,
                pageSize : 100,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }

            }),
            columns: [
                {
                    text: "수주일자",
                    flex: 1,
                    style: 'text-align:center',
                    dataIndex: 'regist_date',
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: "고객사",
                    flex: 1,
                    dataIndex: 'wa_name',
                    align: 'left',
                    style: 'text-align:center',
                    sortable: true,
                },
                {
                    text: "현장명",
                    flex: 1,
                    dataIndex: 'pj_name',
                    align: 'left',
                    style: 'text-align:center',
                    sortable: true,
                },
                {
                    text: "수주수량",
                    flex: 1,
                    style: 'text-align:center',
                    dataIndex: 'po_qty',
                    align: 'right',
                    sortable: true,
                    // renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: "납품수량",
                    flex: 1,
                    style: 'text-align:center',
                    dataIndex: 'out_qty',
                    align: 'right',
                    sortable: true,
                },
            ],
            renderTo: Ext.getBody(),
            autoScroll: true,
            multiSelect: true,
            pageSize: 100,
            width: 100,
            height: 300,
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
            title: '수주이력 조회',
            width: 200,
            height: 600,
            minWidth: 600,
            minHeight: 300,
            items: [
                loadForm
            ],
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    winProduct.setLoading(false);
                    winProduct.close();
                }
            }]
        });
        winProduct.show();
    },

});
