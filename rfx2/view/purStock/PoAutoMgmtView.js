Ext.define('Rfx2.view.purStock.PoAutoMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'po-auto-mgmt-view',
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : ['REGIST', 'EDIT', 'COPY']
        });

        //모델 정의
        this.createStore('Rfx2.model.PoAutoMgmt', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gm.pageSize
            ,{}
            //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
            , ['autopo']
        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        this.addAutoPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '발주 목록추가',
            tooltip: '발주 목록을 추가합니다.',
            disabled: false,
            handler: function () {

                var lineGap = 30;
                var bHeight = 700;
                var bWidth = 700;

                gm.me().searchStore.removeAll();

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
                    cls : 'rfx-panel',
                    multiSelect: false,
                    autoScroll : true,
                    border: false,
                    height: 200,
                    padding: '0 0 5 0',
                    flex: 1,
                    layout: 'fit',
                    forceFit: false,
                    listeners: {
                        select: function(selModel, record, index, options) {
                            gu.getCmp('unique_id').setValue(record.get('unique_id_long'));
                            gu.getCmp('item_code').setValue(record.get('item_code'));
                            gu.getCmp('item_name').setValue(record.get('item_name'));
                            gu.getCmp('specification').setValue(record.get('specification'));
                            gu.getCmp('maker_name').setValue(record.get('maker_name'));
                            gu.getCmp('unit_code').setValue(record.get('unit_code'));
                            gu.getCmp('sales_price').setValue(record.get('sales_price'));
                            gu.getCmp('currency').setValue(record.get('currency'));
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
                                    onTrigger1Click : function() {
                                        this.setValue('');

                                    },
                                    listeners : {
                                        change : function(fieldObj, e) {
                                            if (e.trim().length > 0) {
                                                gm.me().searchStore.getProxy().setExtraParam('item_code', '%'+e+'%');
                                            } else {
                                                delete gm.me().searchStore.proxy.extraParams.item_code;
                                            }
                                        },
                                        render: function(c) {
                                            Ext.create('Ext.tip.ToolTip', {
                                                target: c.getEl(),
                                                html: c.emptyText
                                            });
                                        }
                                    }
                                },
                                {
                                    field_id:  'search_item_name',
                                    width: 190,
                                    fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                    id: gu.id('search_item_name_part'),
                                    name: 'search_item_name',
                                    xtype: 'triggerfield',
                                    margin: '3 3 3 3',
                                    emptyText: '품명',
                                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                    onTrigger1Click : function() {
                                        this.setValue('');
                                    },
                                    listeners : {
                                        change : function(fieldObj, e) {
                                            if (e.trim().length > 0) {
                                                gm.me().searchStore.getProxy().setExtraParam('item_name', '%'+e+'%');
                                            } else {
                                                delete gm.me().searchStore.proxy.extraParams.item_name;
                                            }
                                        },
                                        render: function(c) {
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
                                        change: function (fieldObj, e) {
                                            if (e.trim().length > 0) {
                                                gm.me().searchStore.getProxy().setExtraParam('specification', '%'+e+'%');
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
                            width: 150,
                            dataIndex: 'item_code'
                        },
                        {
                            text: '품명',
                            width: 300,
                            dataIndex: 'item_name',
                            renderer: function(value) {
                                return value.replace(/</gi,"&lt;");
                            }
                        },
                        {
                            text: '규격',
                            width: 340,
                            dataIndex: 'specification'
                        }
                    ]
                });

                var supastStore = Ext.create('Rfx2.store.SupastStore', {});
                var userStore = Ext.create('Rfx2.store.UserStore', {});

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
                        labelWidth: 80
                    },
                    items: [
                        this.gridViewTable,
                        {
                            fieldLabel: gm.me().getColName('unique_id'),
                            xtype: 'textfield',
                            id: gu.id('unique_id'),
                            name: 'unique_id',
                            emptyText: '자재 UID',
                            readOnly: true,
                            hidden: true,
                            width: 300,
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        },
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
                        }, {
                            fieldLabel: '공급사',
                            xtype: 'combo',
                            name: 'supast_uid',
                            mode: 'local',
                            displayField: 'supplier_name',
                            store: supastStore,
                            sortInfo: { field: 'unique_id', direction: 'ASC' },
                            valueField: 'unique_id_long',
                            typeAhead: false,
                            allowBlank: false,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{supplier_name}</div>';
                                }
                            }
                        }, {
                            xtype: 'numberfield',
                            minValue: 0,
                            width: '100%',
                            id: gu.id('pr_quan'),
                            name: 'pr_quan',
                            fieldLabel: '발주수량',
                            allowBlank: true,
                            value: '1',
                            margins: '0'
                        }, {
                            xtype: 'textfield',
                            width: '100%',
                            fieldLabel: gm.me().getColName('unit_code'),
                            id: gu.id('unit_code'),
                            name: 'unit_code',
                            allowBlank: true
                        }, {
                            xtype: 'numberfield',
                            width: '100%',
                            id: gu.id('sales_price'),
                            name: 'sales_price',
                            fieldLabel: '단가',
                            allowBlank: true,
                            value: '0',
                            margins: '0'
                        }, {
                            xtype: 'textfield',
                            width: '100%',
                            fieldLabel: '통화',
                            id: gu.id('currency'),
                            name: 'currency',
                            allowBlank: true
                        }, {
                            fieldLabel: '발주담당자',
                            xtype: 'combo',
                            name: 'po_user_uid',
                            mode: 'local',
                            displayField: 'user_name',
                            store: userStore,
                            sortInfo: { field: 'unique_id', direction: 'ASC' },
                            valueField: 'unique_id_long',
                            typeAhead: false,
                            allowBlank: false,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{user_id}] {user_name}</div>';
                                }
                            }
                        }, {
                            name: 'po_start_date',
                            format: 'Y-m-d',
                            fieldLabel: '시작일',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            xtype: 'datefield',
                            value: Ext.Date.add(new Date(), Ext.Date.MONTH, -1)
                        }, {
                            name: 'po_end_date',
                            format: 'Y-m-d',
                            fieldLabel: '종료일',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            xtype: 'datefield',
                            margin: '0 0 70 0'
                        },
                    ]
                });

                supastStore.load();
                userStore.load();

                var winPart = Ext.create('ModalWindow', {
                    title: '발주 목록추가',
                    width: bWidth,
                    height: bHeight,
                    minWidth: 250,
                    minHeight: 180,
                    items: [gm.me().createPartForm],
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            var form = gm.me().createPartForm;
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                console_logs('form val', val);
                                gm.me().registAutoPo(val);

                                if (winPart) {
                                    winPart.close();
                                }

                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
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
            } // endofhandler
        });

        this.editAutoPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '발주 목록수정',
            tooltip: '발주 목록을 수정합니다.',
            disabled: true,
            handler: function () {

                var lineGap = 30;
                var bHeight = 410;
                var bWidth = 700;

                var rec = gm.me().grid.getSelectionModel().getSelection()[0];

                var supastStore = Ext.create('Rfx2.store.SupastStore', {});
                var userStore = Ext.create('Rfx2.store.UserStore', {});

                gm.me().editPartForm = Ext.create('Ext.form.Panel', {
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
                        labelWidth: 80
                    },
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'autopo_uid',
                            value: rec.get('unique_id_long')
                        },
                        {
                            xtype: 'textfield',
                            name: 'item_code',
                            fieldLabel: '품번',
                            readOnly: true,
                            allowBlank: false,
                            value: rec.get('item_code'),
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        },
                        {
                            xtype: 'textfield',
                            name: 'item_name',
                            fieldLabel: '품명',
                            readOnly: true,
                            allowBlank: false,
                            value: rec.get('item_name'),
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '규격',
                            name: 'specification',
                            readOnly: true,
                            allowBlank: true,
                            value: rec.get('specification'),
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        }, {
                            fieldLabel: '공급사',
                            xtype: 'combo',
                            name: 'supast_uid',
                            displayField: 'supplier_name',
                            store: supastStore,
                            sortInfo: { field: 'unique_id', direction: 'ASC' },
                            valueField: 'unique_id_long',
                            typeAhead: false,
                            allowBlank: false,
                            value: rec.get('supast_uid'),
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{supplier_name}</div>';
                                }
                            }
                        }, {
                            xtype: 'numberfield',
                            minValue: 0,
                            width: '100%',
                            name: 'pr_quan',
                            fieldLabel: '발주수량',
                            allowBlank: true,
                            value: rec.get('pr_quan'),
                            margins: '0'
                        }, {
                            xtype: 'textfield',
                            width: '100%',
                            fieldLabel: '단위',
                            name: 'unit_code',
                            value: rec.get('unit_code'),
                            allowBlank: true
                        }, {
                            xtype: 'numberfield',
                            width: '100%',
                            name: 'sales_price',
                            fieldLabel: '단가',
                            allowBlank: true,
                            value: '0',
                            value: rec.get('sales_price'),
                            margins: '0'
                        }, {
                            xtype: 'textfield',
                            width: '100%',
                            fieldLabel: '통화',
                            name: 'currency',
                            value: rec.get('currency'),
                            allowBlank: true
                        }, {
                            fieldLabel: '발주담당자',
                            xtype: 'combo',
                            name: 'po_user_uid',
                            mode: 'local',
                            displayField: 'user_name',
                            store: userStore,
                            sortInfo: { field: 'unique_id', direction: 'ASC' },
                            valueField: 'unique_id_long',
                            typeAhead: false,
                            allowBlank: false,
                            value: rec.get('po_user_uid'),
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">[{user_id}] {user_name}</div>';
                                }
                            }
                        }, {
                            fieldLabel: '시작일',
                            name: 'po_start_date',
                            format: 'Y-m-d',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            xtype: 'datefield',
                            value: rec.get('po_start_date')
                        }, {
                            fieldLabel: '종료일',
                            name: 'po_end_date',
                            format: 'Y-m-d',
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                            value: rec.get('po_end_date'),
                            xtype: 'datefield',
                            margin: '0 0 70 0'
                        },
                    ]
                });

                supastStore.load();
                userStore.load();

                var winPart = Ext.create('ModalWindow', {
                    title: '발주 목록수정',
                    width: bWidth,
                    height: bHeight,
                    minWidth: 250,
                    minHeight: 180,
                    items: [gm.me().editPartForm],
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            var form = gm.me().editPartForm;
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                console_logs('form val', val);
                                gm.me().editAutoPo(val);

                                if (winPart) {
                                    winPart.close();
                                }

                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
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
            } // endofhandler
        });

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.callParent(arguments);

        buttonToolbar.insert(1, this.editAutoPoAction);
        buttonToolbar.insert(1, this.addAutoPoAction);

        this.setGridOnCallback(function (selections) {

            if (selections.length > 0) {
                this.editAutoPoAction.enable();
            } else {
                this.editAutoPoAction.disable();
            }
        });

        //디폴트 로드
        gm.setCenterLoading(false);

        this.store.load(function(records){

        });
    },

    registAutoPo: function(val) {

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/prch.do?method=createAutoPo',
            params: {
                srcahd_uid: val['unique_id'],
                supast_uid: val['supast_uid'],
                sales_price: val['sales_price'],
                po_user_uid: val['po_user_uid'],
                po_start_date: val['po_start_date'],
                po_end_date: val['po_end_date'],
                pr_quan: val['pr_quan']
            },
            success: function (result, request) {
                gm.me().store.load();
            },
            failure: function (batch, opt) {
                Ext.Msg.alert('결과', '저장 실패.');
            }
        });
    },

    editAutoPo: function(val) {

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/prch.do?method=editAutoPo',
            params: {
                autopo_uid: val['autopo_uid'],
                supast_uid: val['supast_uid'],
                sales_price: val['sales_price'],
                po_user_uid: val['po_user_uid'],
                po_start_date: val['po_start_date'],
                po_end_date: val['po_end_date'],
                pr_quan: val['pr_quan']
            },
            success: function (result, request) {
                gm.me().store.load();
            },
            failure: function (batch, opt) {
                Ext.Msg.alert('결과', '저장 실패.');
            }
        });
    },

    searchStore: Ext.create('Rfx2.store.company.kbtech.MaterialStore', {})
});
