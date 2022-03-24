Ext.define('Rfx2.view.company.bioprotech.produceMgmt.VersionBomConfirmationView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'requirement-aanalysis-view',

    initComponent: function () {

        //검색툴바 필드 초기화
        
        //검색툴바 생성
       
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        
        this.initSearchField();

        this.addSearchField({
            type: 'combo',
            width: 100
            , field_id: 'plan_type'
            , emptyText: '구분'
            , store: "CommonCodeStore"
            , params: { parentCode: 'RESOURCE_GUBUN' }
            , displayField: 'code_name_kr'
            , valueField: 'system_code'
            , value: 'code_name_kr'
            , innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>'
        });

        this.addSearchField({
            type: 'combo',
            width: 100
            , field_id: 'class_code'
            , emptyText: this.getMC('CMD_PRODUCTS', gm.getMC('CMD_Product', '제품군'))
            , store: "CommonCodeStore"
            , params: { parentCode: 'PRD_GROUP' }
            , displayField: 'code_name_kr'
            , valueField: 'system_code'
            , value: 'code_name_kr'
            , innerTpl: '<div data-qtip="{system_code}">{code_name_kr}</div>'
        });
        this.addSearchField('item_name');
        this.addSearchField('specification');

        //모델을 통한 스토어 생성
        this.createStore('Rfx2.model.ReourcePlan', [{
                property: 'plan_date',
                direction: 'ASC'
            }],
            gm.pageSize
            , {}
            , ['stoplan']
        );
        this.store.getProxy().setExtraParam('orderBy', 'plan_date');

        var arr = [];
        var searchToolbar = this.createSearchToolbar();
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.usePagingToolbar = false;
        //grid 생성
        this.createGrid(arr);
        this.createCrudTab();

        this.replacePlanButton = Ext.create('Ext.Action', {
            iconCls: 'af-refresh',
            text: gm.getMC('CMD_Restore_Plan', '계획가져오기'),
            tooltip: 'Replace plan-list based on DB',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('replacePlanButton'),
            handler: function () {
                Ext.MessageBox.show({
                    title: '계획가져오기',
                    msg: '시스템에 등록된 계획을 가져오시겠습니까? 사용자가 작업한 내역은 저장하지 않습니다.',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == "no" || btn == "cancel") {
                            return;
                        } else {
                            // console.log('동명');
                            gm.setCenterLoading(true);
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/admin/psi.do?method=restoreStoPlan',
                                success: function (result, request) {
                                    gm.me().store.load();
                                    gm.setCenterLoading(false);
                                },
                                failure: function () {
                                    extjsUtil.failureMessage
                                    gm.setCenterLoading(false);
                                }
                            });
                        }
                    }
                });
            }
        });

        this.acButton = Ext.create('Ext.Action', {
            iconCls: 'af-play',
            text: gm.getMC('CMD_Calculation', '소요량계산'),
            tooltip: this.getMC('msg_btn_prd_add', '소요량 계산 실행'),
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('acButton'),
            handler: function () {
                Ext.MessageBox.show({
                    title: '소요량계산',
                    msg: '전체 목록에 대하여 소요량 분석을 실시하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == "no" || btn == "cancel") {
                            return;
                        } else {
                            gm.setCenterLoading(true);
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/admin/psi.do?method=calcRequirementByPlan',
                                success: function (result, request) {
                                    // gm.me().store.load();
                                    gm.setCenterLoading(false);
                                },
                                failure: function(result, request) {
                                    gm.setCenterLoading(false);
                                    extjsUtil.failureMessage;
                                }
                            });
                        }
                    }
                });
            }
        });

        this.selectedAcButton = Ext.create('Ext.Action', {
            iconCls: 'af-play',
            text: gm.getMC('CMD_Calculation_selected', '선택계산'),
            tooltip: this.getMC('msg_btn_prd_add', '소요량 계산 실행'),
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('selectedAcButton'),
            handler: function () {
                var records = gm.me().grid.getSelectionModel().getSelection();
                var unique_ids = [];

                if(!!records && records.length > 0) {
                    records.forEach(el => {
                        unique_ids.push(el.get('unique_id_long'));
                    });
                } else {
                    Ext.MessageBox.alert('','소요량계산할 계획을 선택해주세요.');
                    return;
                }

                Ext.MessageBox.show({
                    title: '소요량계산',
                    msg: '선택항목들에 대하여 소요량 분석을 실시하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == "no" || btn == "cancel") {
                            return;
                        } else {
                            
                            gm.setCenterLoading(true);
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/admin/psi.do?method=calcRequirementByPlan',
                                params: {'unique_ids' : unique_ids},
                                success: function (result, request) {
                                    // gm.me().store.load();
                                    gm.setCenterLoading(false);
                                },
                                failure: function(result, request) {
                                    gm.setCenterLoading(false);
                                    extjsUtil.failureMessage;
                                }
                            });
                        }
                    }
                });
            }
        });

        this.addButton = Ext.create('Ext.Action', {
            iconCls: 'af-plus',
            text: '추가',
            tooltip: 'Add custom plan',
            disabled: false,
            hidden: gu.setCustomBtnHiddenProp('addButton'),
            handler: function () {
                var bHeight = 700;
                var bWidth = 700;

                var noStockMaterialStore = Ext.create('Mplm.store.ProductForMoldStore');
                var locationStore = Ext.create('Rfx2.store.company.bioprotech.WhouseLocationStore', {pageSize: 100});
                noStockMaterialStore.getProxy().setExtraParam('standard_flag','A');
                noStockMaterialStore.load();
                var uid_srcahd = -1;
                var comcstStore =  Ext.create('Mplm.store.ComCstStore');


                this.itemSearchAction = Ext.create('Ext.Action', {
                    iconCls: 'af-search',
                    text: CMD_SEARCH/*'검색'*/,
                    tooltip: CMD_SEARCH/*'검색'*/,
                    disabled: false,
                    handler: function () {
                        var extraParams = noStockMaterialStore.getProxy().getExtraParams();
                        if (Object.keys(extraParams).length == 0) {
                            noStockMaterialStore.load();
                            // Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                        } else {
                            noStockMaterialStore.load();
                        }
                    }
                });

                this.gridViewTable = Ext.create('Ext.grid.Panel', {
                    store: noStockMaterialStore,
                    cls: 'rfx-panel',
                    multiSelect: false,
                    autoScroll: true,
                    border: false,
                    height: 50,
                    padding: '0 0 5 0',
                    flex: 1,
                    layout: 'fit',
                    forceFit: false,
                    listeners: {
                        select: function (selModel, record, index, options) {
                            uid_srcahd = record.get('unique_id_long');

                        }
                    },
                    bbar: getPageToolbar(noStockMaterialStore),
                    dockedItems: [
                        {
                            dock: 'top',
                            xtype: 'toolbar',
                            style: 'background-color: #EFEFEF;',
                            items: [
                                {
                                    field_id: 'search_item_code',
                                    width: 190,
                                    fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                    id: gu.id('search_item_code_part'),
                                    name: 'search_item_code',
                                    margin: '3 3 3 3',
                                    xtype: 'triggerfield',
                                    emptyText: '품번',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');

                                    },
                                    listeners: {
                                        specialkey: function (fieldObj, e) {
                                            if (e.getKey() == Ext.EventObject.ENTER) {
                                                noStockMaterialStore.load();
                                            }
                                        },
                                        change: function (fieldObj, e) {
                                            if (e.trim().length > 0) {
                                                noStockMaterialStore.getProxy().setExtraParam('item_code', '%' + e + '%');
                                            } else {
                                                delete noStockMaterialStore.proxy.extraParams.item_code;
                                            }
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                {
                                    field_id: 'search_item_name',
                                    width: 190,
                                    fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                    id: gu.id('search_item_name_part'),
                                    name: 'search_item_name',
                                    xtype: 'triggerfield',
                                    margin: '3 3 3 3',
                                    emptyText: '품명',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                    },
                                    listeners: {
                                        specialkey: function (fieldObj, e) {
                                            if (e.getKey() == Ext.EventObject.ENTER) {
                                                noStockMaterialStore.load();
                                            }
                                        },
                                        change: function (fieldObj, e) {
                                            if (e.trim().length > 0) {
                                                noStockMaterialStore.getProxy().setExtraParam('item_name', '%' + e + '%');
                                            } else {
                                                delete noStockMaterialStore.proxy.extraParams.item_name;
                                            }
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                {
                                    field_id: 'search_specification',
                                    width: 190,
                                    fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                    id: gu.id('search_specification_part'),
                                    name: 'search_specification',
                                    xtype: 'triggerfield',
                                    margin: '3 3 3 3',
                                    emptyText: '규격',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click: function () {
                                        this.setValue('');
                                    },
                                    listeners: {
                                        specialkey: function (fieldObj, e) {
                                            if (e.getKey() == Ext.EventObject.ENTER) {
                                                noStockMaterialStore.load();
                                            }
                                        },
                                        change: function (fieldObj, e) {
                                            if (e.trim().length > 0) {
                                                noStockMaterialStore.getProxy().setExtraParam('specification', '%' + e + '%');
                                            } else {
                                                delete noStockMaterialStore.proxy.extraParams.specification;
                                            }
                                        },
                                        render: function (c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                '->',
                                this.itemSearchAction
                            ]
                        }
                    ],
                    columns: [
                        {
                            text: '품번',
                            width: 120,
                            dataIndex: 'item_code'
                        },
                        {
                            text: '품명',
                            width: 270,
                            dataIndex: 'item_name',
                            renderer: function (value) {
                                return value.replace(/</gi, "&lt;");
                            }
                        },
                        {
                            text: '규격',
                            width: 270,
                            dataIndex: 'specification'
                        }
                    ],

                });

                gm.me().createPartForm = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    width: bWidth,
                    height: bHeight,
                    bodyPadding: 10,
                    layout: {
                        type: 'vbox',
                        align: 'stretch' // Child items are stretched to full width
                    },
                    defaults: {
                        allowBlank: true,
                        msgTarget: 'side',
                        labelWidth: 60
                    },
                    items: [
                        this.gridViewTable,
                        {
                            fieldLabel: 'Site',
                            xtype: 'combo',
                            id: gu.id('comcst_uid'),
                            anchor: '100%',
                            name: 'comcst_uid',
                            mode: 'local',
                            store: comcstStore,
                            displayField: 'division_code',
                            valueField: 'unique_id_long',
                            emptyText: '선택',
                            sortInfo: {field: 'systemCode', direction: 'DESC'},
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{division_code}">{division_code}</div>';
                                }
                            },
                            listeners: {
                                
                            }
                        },
                        {
                            xtype: 'numberfield',
                            name: 'in_qty',
                            id: gu.id('in_qty'),
                            fieldLabel: '수량',
                            // readOnly: true,
                            allowBlank: false,
                        },
                    ]
                });
                // prodStore.load();
                // ynStore.load();

                var winPart = Ext.create('ModalWindow', {
                    title: '소요량계획 추가',
                    width: bWidth,
                    height: 800,
                    minWidth: 250,
                    minHeight: 180,
                    items: [gm.me().createPartForm
                    ],
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            var form = gm.me().createPartForm;
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                var comcst_uid = gu.getCmp('comcst_uid').getValue();
                                var in_qty = gu.getCmp('in_qty').getValue();
                                if (uid_srcahd === -1) {
                                    Ext.MessageBox.alert('알림', '제품이 선택되지 않았습니다.');
                                    return;
                                } else {
                                    Ext.MessageBox.show({
                                        title: '소요량 계획추가',
                                        msg: '선택한 제품의 소요량 계획을 추가하시겠습니까?',
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (btn) {
                                            if (btn == 'yes') {
                                                Ext.Ajax.request({
                                                    url: CONTEXT_PATH + '/admin/psi.do?method=insertCustomPlan',
                                                    params: {
                                                        comcst_uid: comcst_uid,
                                                        uid_srcahd: uid_srcahd,
                                                        in_qty: in_qty
                                                    },
                                                    success: function (result, request) {
                                                        var resultText = result.responseText;
                                                        console_log('result:' + resultText);
                                                        if (winPart) {
                                                            winPart.close();
                                                        }
                                                        gm.me().getStore().load(function () {
                                                        });
                                                    },
                                                    failure: extjsUtil.failureMessage
                                                });//endof ajax request
                                            }
                                        },
                                        //animateTarget: 'mb4',
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                }


                            } else {
                                Ext.MessageBox.alert('알림', '입고 자재가 선택되지 않았습니다.');
                            }
                        }

                    }, {
                        text: CMD_CANCEL,
                        handler: function () {
                            if (winPart) {
                                winPart.close();
                            }
                        }
                    }]
                });
                winPart.show(/* this, function(){} */);
            }
        });
        this.editButton = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수정',
            tooltip: 'Edit plan',
            disabled: true,
            handler: function () {
            }
        });
        this.removeButton = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '삭제',
            tooltip: 'Remove plan',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('removeButton'),
            handler: function () {
                // var record = gm.me().grid.getSelectionModel().getSelection()[0];
                // var unique_id = record.get('unique_id_long');

                var records = gm.me().grid.getSelectionModel().getSelection();
                var unique_ids = [];

                if(!!records && records.length > 0) {
                    records.forEach(el => {
                        unique_ids.push(el.get('unique_id_long'));
                    });
                } else {
                    Ext.MessageBox.alert('','삭제할 계획을 선택해주세요.');
                    return;
                }

                Ext.MessageBox.show({
                    title: '',
                    msg: '선택된 건에 대한 삭제를 진행하시겠습니까?<br>해당 기능을 실행 시 취소할 수 없습니다.',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == "no" || btn == "cancel") {
                            return;
                        } else {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/admin/psi.do?method=deletePlan',
                                params: {
                                    // unique_id : unique_id
                                    unique_ids: unique_ids
                                 },
                                success: function (result, request) {
                                    Ext.MessageBox.alert('','삭제처리 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                });

            }
        });
        buttonToolbar.insert(1, this.removeButton);
        // buttonToolbar.insert(1, this.editButton);
        buttonToolbar.insert(1, this.addButton);
        buttonToolbar.insert(1, this.acButton);
        buttonToolbar.insert(1, this.selectedAcButton);
        buttonToolbar.insert(1, this.replacePlanButton);

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
                    width: '100%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        flex: 0,
                        items: [this.grid]
                    }]
                }
            ]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);
        this.storeLoad();
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                // this.acButton.enable();
                var rec = selections[0];
                this.removeButton.enable();
            } else {
                this.removeButton.disable();
                // this.acButton.disable();
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