Ext.define('Rfx2.view.company.bioprotech.designPlan.MaterialSplitView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'board-view',
    searchStore: Ext.create('Rfx2.store.company.bioprotech.MaterialStore', {}),
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField(
            {
                xtype: 'combo'
                , anchor: '100%'
                , width: 300
                , field_id: 'sg_code'
                , store: 'ClaastStore'
                , displayField: 'class_name'
                , valueField: 'class_code'
                , params: {level1: '1', identification_code: 'MT'}
                , innerTpl: '[{class_code}]{class_name}'
            });
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        buttonToolbar.items.each(function (item, index, length) {
            if (index >= 1 && index <= 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //모델 정의
        this.createStore('Rfx2.model.company.bioprotech.MaterialSplit', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gMain.pageSize
            ,{
            }
            //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , []
        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        this.addChildSplitMtrlAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '추가',
            tooltip: 'SPLIT 자재 구성을 추가합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('addChildSplitMtrlAction'),
            handler: function () {

                var bHeight = 600;
                var bWidth = 700;

                gm.me().searchStore.removeAll();
                gm.me().searchStore.getProxy().setExtraParam('exchange_flag', 'C');
                gm.me().searchStore.load();

                this.itemSearchAction = Ext.create('Ext.Action', {
                    iconCls: 'af-search',
                    text: CMD_SEARCH/*'검색'*/,
                    tooltip: CMD_SEARCH/*'검색'*/,
                    disabled: false,
                    handler: function () {
                        var extraParams = gm.me().searchStore.getProxy().getExtraParams();
                        if (Object.keys(extraParams).length == 0) {
                            Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                        } else {
                            gm.me().searchStore.load();
                        }
                    }
                });

                this.gridViewTable = Ext.create('Ext.grid.Panel', {
                    store: gm.me().searchStore,
                    cls: 'rfx-panel',
                    multiSelect: false,
                    autoScroll: true,
                    border: false,
                    height: 400,
                    padding: '0 0 5 0',
                    flex: 1,
                    layout: 'fit',
                    forceFit: false,
                    listeners: {
                        select: function (selModel, record, index, options) {
                            gu.getCmp('child').setValue(record.get('unique_id_long'));
                            gu.getCmp('item_code').setValue(record.get('item_code'));
                            gu.getCmp('item_name').setValue(record.get('item_name'));
                            gu.getCmp('specification').setValue(record.get('specification'));
                            gu.getCmp('standard_flag').setValue(record.get('standard_flag'));
                        }
                    },
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
                                                gm.me().searchStore.load();
                                            }
                                        },
                                        change: function (fieldObj, e) {
                                            if (e.trim().length > 0) {
                                                gm.me().searchStore.getProxy().setExtraParam('item_code', '%' + e + '%');
                                            } else {
                                                delete gm.me().searchStore.proxy.extraParams.item_code;
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
                                                gm.me().searchStore.load();
                                            }
                                        },
                                        change: function (fieldObj, e) {
                                            if (e.trim().length > 0) {
                                                gm.me().searchStore.getProxy().setExtraParam('item_name', '%' + e + '%');
                                            } else {
                                                delete gm.me().searchStore.proxy.extraParams.item_name;
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
                                                gm.me().searchStore.load();
                                            }
                                        },
                                        change: function (fieldObj, e) {
                                            if (e.trim().length > 0) {
                                                gm.me().searchStore.getProxy().setExtraParam('specification', '%' + e + '%');
                                            } else {
                                                delete gm.me().searchStore.proxy.extraParams.specification;
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
                            width: 300,
                            dataIndex: 'specification'
                        }
                    ]
                });
                var addForm = gm.me().createPartForm(true);

                var winPart = Ext.create('ModalWindow', {
                    title: '분할후 자재 추가',
                    width: bWidth,
                    height: bHeight,
                    items: [
                        this.gridViewTable,
                        addForm
                    ],
                    layout: {
                        xtype: 'vbox',
                        align: 'stretch'
                    },
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            var form = addForm;
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                gm.me().registPartFc(val);
                                if (winPart) {
                                    winPart.close();
                                }
                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            }
                        }
                    },
                        {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                });
                winPart.show();
            }
        });

        this.setDefSplitMtrlAction = Ext.create('Ext.Action', {
            iconCls: 'af-check',
            text: '기본으로 지정',
            tooltip: '해당 자재를 SPLIT 자재의 기본자재로 지정합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('setDefSplitMtrlAction'),
            handler: function () {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '해당 자재를 SPLIT 자재의 기본자재로 지정하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == "no") {
                            MessageBox.close();
                        } else {
                            var rec = gm.me().childSplitMtrlGrid.getSelectionModel().getSelection()[0];
                            var assymap_uid = rec.get('unique_uid');
                            var parent = rec.get('parent');
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/material.do?method=setDefSplitMtrl',
                                params: {
                                    parent: parent,
                                    assymap_uid: assymap_uid
                                },
                                success: function (result, request) {
                                    gm.me().childSplitMtrlGrid.getStore().load();
                                },
                                failure: function (batch, opt) {
                                    Ext.Msg.alert('결과', '저장 실패.');
                                }
                            });
                        }
                    }
                });
            }
        });

        this.modifyChildSplitMtrlAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수정',
            tooltip: 'SPLIT 자재 구성을 수정합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('modifyChildSplitMtrlAction'),
            handler: function () {

                var rec = gm.me().childSplitMtrlGrid.getSelectionModel().getSelection()[0];

                var modifyForm = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    width: 330,
                    bodyPadding: 15,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    }, defaults: {
                        allowBlank: true,
                        msgTarget: 'side',
                        labelWidth: 150
                    }, items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'assymap_uid',
                            value: rec.get('unique_uid')
                        },
                        {
                            xtype: 'numberfield',
                            minValue: 1,
                            id: gu.id('splitQty'),
                            name: 'splitQty',
                            fieldLabel: 'SPLIT 수량',
                            decimalPrecision: 0,
                            allowBlank: true,
                            margins: '0',
                            value: rec.get('bm_quan')
                        }
                    ]

                });

                var winPart = Ext.create('ModalWindow', {
                    title: '분할 수량 수정',
                    width: 350,
                    height: 150,
                    items: [
                        modifyForm
                    ],
                    layout: {
                        xtype: 'vbox',
                        align: 'stretch'
                    },
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            var form = modifyForm;
                            if (form.isValid()) {
                                var val = form.getValues(false);

                                gm.editAjax('assymap', 'bm_quan', val['splitQty'], 'unique_id', val['assymap_uid'], {type: ''});
                                gm.me().childSplitMtrlGrid.getStore().load();
                                if (winPart) {
                                    winPart.close();
                                }
                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            }
                        }
                    },
                        {
                            text: CMD_CANCEL,
                            handler: function () {
                                if (winPart) {
                                    winPart.close();
                                }
                            }
                        }]
                });
                winPart.show();
            }
        });

        this.removeChildSplitMtrlAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '삭제',
            tooltip: 'SPLIT 자재 구성을 삭제합니다.',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('removeChildSplitMtrlAction'),
            handler: function () {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: 'SPLIT 자재 구성을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == "no") {
                            MessageBox.close();
                        } else {
                            var rec = gm.me().childSplitMtrlGrid.getSelectionModel().getSelection()[0];
                            var unique_id = rec.get('unique_uid');
                            gm.editAjax('assymap', 'delete_flag', 'Y', 'unique_id', unique_id, {type: ''});
                            gm.me().childSplitMtrlGrid.getStore().load();
                        }
                    }
                });
            }
        });

        // 좌측의 모자재에 대한 SPLIT 자재 구성
        this.childSplitMtrlGrid = Ext.create('Ext.grid.Panel', {
            store: Ext.create('Rfx2.store.company.bioprotech.ChildSplitMtrlStore'),
            cls: 'rfx-panel',
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            frame: true,
            border: true,
            layout: 'fit',
            height: 300,
            forceFit: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '5 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    style: 'background-color: #EFEFEF;',
                    items: [
                        this.addChildSplitMtrlAction,
                        this.setDefSplitMtrlAction,
                        this.modifyChildSplitMtrlAction,
                        this.removeChildSplitMtrlAction
                    ]
                }
            ],
            columns: [
                {text: '품번', width: 100, align: 'left', style: 'text-align:center', dataIndex: 'item_code'},
                {text: '품명', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'item_name'},
                {text: '규격', width: 150, align: 'left', style: 'text-align:center', dataIndex: 'specification'},
                {text: 'SPLIT수량', width: 100, align: 'right', style: 'text-align:center', dataIndex: 'bm_quan'},
                {text: '기본지정', width: 100, align: 'left', style: 'text-align:center', dataIndex: 'reserved2',
                    renderer: function(value) {
                        if (value == null || value == '') {
                            return '미지정';
                        }

                        if (value == 'Y') {
                            return '예';
                        } else {
                            return '아니오';
                        }
                    }
                }
            ],
            name: 'childSplitMtrl',
            autoScroll: true,
            listeners: {
                select: function (dv, record) {
                    gm.me().modifyChildSplitMtrlAction.enable();
                    gm.me().setDefSplitMtrlAction.enable();
                    gm.me().removeChildSplitMtrlAction.enable();
                }
            }
        });

        this.detailInfo = Ext.create('Ext.form.Panel', {
            title: '분할후',
            layout: 'fit',
            border: true,
            frame: true,
            width: "45%",
            minWidth: 200,
            height: "100%",
            region: 'east',
            resizable: true,
            scroll: false,
            tabPosition: 'top',
            collapsible: false,
            autoScroll: true,
            items: [
                this.childSplitMtrlGrid
            ]
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.detailInfo]
        });

        this.callParent(arguments);

        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                var store = gm.me().childSplitMtrlGrid.getStore();
                var rec = selections[0];
                store.getProxy().setExtraParam('parent', rec.get('unique_id_long'));
                store.load();
                gm.me().addChildSplitMtrlAction.enable();
            } else {
                gm.me().addChildSplitMtrlAction.disable();
            }
        });

        this.childSplitMtrlGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections.length > 0) {
                    gm.me().modifyChildSplitMtrlAction.enable();
                    gm.me().setDefSplitMtrlAction.enable();
                    gm.me().removeChildSplitMtrlAction.enable();
                } else {
                    gm.me().modifyChildSplitMtrlAction.disable();
                    gm.me().setDefSplitMtrlAction.disable();
                    gm.me().removeChildSplitMtrlAction.disable();
                }
            }
        });

        //디폴트 로드
        gm.setCenterLoading(false);
        this.store.load(function(records){});
    },

    createPartForm: function (isAdd) {

        var form = Ext.create('Ext.form.Panel', {
            height: 400,
            bodyPadding: 10,
            flex: 1,
            defaults: {
                allowBlank: true,
                msgTarget: 'side',
                labelWidth: 80,
                width: '100%'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'item_code',
                    id: gu.id('item_code'),
                    fieldLabel: '품번',
                    readOnly: true,
                    allowBlank: false,
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                },
                {
                    xtype: 'textfield',
                    name: 'item_name',
                    id: gu.id('item_name'),
                    fieldLabel: '품명',
                    readOnly: true,
                    allowBlank: false,
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '규격',
                    id: gu.id('specification'),
                    name: 'specification',
                    readOnly: true,
                    allowBlank: true,
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                },

                new Ext.form.Hidden({
                    id: gu.id('standard_flag'),
                    name: 'standard_flag'
                }),
                {
                    fieldLabel: '자재 UID',
                    xtype: 'textfield',
                    id: gu.id('child'),
                    name: 'child',
                    emptyText: '자재 UID',
                    readOnly: true,
                    hidden: true,
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                },
                {
                    xtype: 'numberfield',
                    minValue: 1,
                    id: gu.id('splitQty'),
                    name: 'splitQty',
                    fieldLabel: 'SPLIT 수량',
                    decimalPrecision: 0,
                    allowBlank: true,
                    margins: '0',
                    value: 2
                }
            ]
        })
        return form;
    },

    registPartFc: function (val) {

        var parentSelection = gm.me().grid.getSelectionModel().getSelection()[0];

        val['parent'] = parentSelection.get('unique_id_long');
        val['parentItemCode'] = parentSelection['item_code'];
        val['childItemCode'] = val['item_code'];

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=addChildSplitMtrl',
            params: val,
            success: function (result, request) {
                gm.me().childSplitMtrlGrid.getStore().load();
            },
            failure: function (batch, opt) {
                Ext.Msg.alert('결과', '저장 실패.');
            }
        });
    },
});
