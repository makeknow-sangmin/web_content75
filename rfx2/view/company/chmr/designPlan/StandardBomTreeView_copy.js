Ext.define('Rfx2.view.company.chmr.designPlan.StandardBomTreeView_copy', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'standard-bom-tree-view-chmr',

    /* init */
    initComponent: function () {

        this.initSearchField();

        Ext.each(this.columns, function (columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			console_logs('dataIndex', dataIndex);
			switch (dataIndex) {
				case 'temp_quan':
					columnObj["editor"] = {};
					columnObj["css"] = 'edit-cell';
					columnObj["renderer"] = function (value, meta) {
						meta.css = 'custom-column';

						return value;
					};
					break;
			}

		});


        this.bomverListStore = Ext.create('Mplm.store.BomverListStore', { autoLoad: true, sg_code: 'MIX' });

        var mixGrid = Ext.create('Ext.grid.Panel', {
            region: 'west',
            frame: true,
            flex: 0.3,
            store: this.bomverListStore,
            // flex: 2,
            border: false,
            resizable: false,
            autoScroll: true,
            autoHeight: true,
            collapsible: false,
            forceFit: true,
            layout: 'fit',
            columns: [
                {
                    text: '배합명',
                    flex: 2,
                    sortable: true,
                    dataIndex: 'item_name'
                },
                {
                    text: '등록자',
                    sortable: true,
                    // width: 100,
                    flex: 1,
                    dataIndex: 'user_name'
                }
            ],
            listeners: {
                'selectionchange': function (view, records) {
                    console_logs('selectionchange records', records);
                    // gm.me().store.removeAll();
                    if (records != null && records.length > 0) {
                        var record = records[0];
                        gm.me().selected_tree_record = record;
                        // console_logs('recoed', record.get('unique_id_long'));
                        gm.me().store.getProxy().setExtraParams({
                            bomver_uid: record.get('unique_id_long')
                        })
                        gm.me().store.load();

                        // 버튼 제어
                        gm.me().addPartAction.enable();
                        gm.me().calcRatioAction.enable();
                    } else {
                        gm.me().addPartAction.disable();
                        gm.me().calcRatioAction.disable();
                    }
                },

            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.addMixAction,
                        this.removeAssyAction
                    ]
                }
            ]
        })

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = Ext.create('widget.toolbar', {
            cls: 'my-x-toolbar-default2',
            items: [
                this.addPartAction,
                this.editPartAction,
                this.removePartAction,
                this.calcRatioAction,
                {
                    xtype: 'component',
                    style: 'margin-right:5px;width:18px;text-align:right',
                    id: gu.id('childCount'),
                    style: 'color:#094C80;align:right;',
                    html: ''
                }

            ]
        });

        this.createStore('Rfx2.model.company.bioprotech.Bomdtl', [{
        }],
            gm.pageSize
            , {}
            , ['bomdtl']
        );

        this.setGridOnCallback(function (selections) {
            if (selections.length /*&& gm.me().depth == 1*/) {
                // gm.me().editPartAction.enable();
                gm.me().removePartAction.enable();
            } else {
                gm.me().removePartAction.disable();
                gm.me().editPartAction.disable();
            }
        });

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        Ext.apply(this, {
            layout: 'border',
            items: [
                // this.west,
                mixGrid,
                this.grid]
        });

        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        // this.store.load(function(records){});



    },

    /* global variable */
    selected_tree_record : null,

    searchStore: Ext.create('Rfx2.store.company.kbtech.MaterialStore', {}),

    addMixAction: Ext.create('Ext.Action', {
        itemId: 'addMixAction',
        iconCls: 'af-plus-circle',
        disabled: false,
        text: '추가',
        handler: function (widget, event) {

            var lineGap = 30;
            var bHeight = 100;

            var inputItem = [];

            inputItem.push(new Ext.form.Hidden({
                value: 'MIX',
                name: 'sg_code'
            }));
            inputItem.push({
                xtype: 'textfield',
                name: 'item_name',
                fieldLabel: '배합명',
                allowBlank: false,
                anchor: '-5'
            });

            gm.me().createAssyForm = Ext.create('Ext.form.Panel', {
                defaultType: 'textfield',
                border: false,
                bodyPadding: 15,
                width: 400,
                height: bHeight,
                bodyPadding: 15,
                defaults: {
                    // anchor: '100%',
                    editable: true,
                    allowBlank: false,
                    msgTarget: 'side',
                    labelWidth: 100
                },
                items: inputItem
            });


            var win = Ext.create('ModalWindow', {
                title: '배합 추가',
                width: 400,
                height: bHeight,
                minWidth: 250,
                minHeight: 180,
                items: gm.me().createAssyForm,

                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        var form = gm.me().createAssyForm;
                        if (form.isValid()) {
                            var val = form.getValues(false);

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/design/bom.do?method=createBomver',
                                params: {
                                    sg_code: val['sg_code'],
                                    item_name: val['item_name'],
                                },
                                success: function (result, request) {
                                    gm.me().bomverListStore.load();
                                    // gm.me().reSelect();
                                },
                                failure: extjsUtil.failureMessage
                            });

                            if (win) {
                                win.close();
                            }
                        } else {
                            Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                        }
                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function () {
                        if (win) {
                            win.close();
                        }
                    }
                }]
            });
            win.show( /* this, function(){} */);
        } // endofhandler
    }),
    removeAssyAction: Ext.create('Ext.Action', {
        itemId: 'removeAssyAction',
        iconCls: 'af-remove',
        text: CMD_DELETE,
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: delete_msg_title,
                msg: delete_msg_content,
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteBomverConfirm,
                // animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),
    deleteBomverConfirm: function (result) {

        if (result == 'yes') {

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=deleteBomver',
                params: {
                    bomver_uid: gm.me().selected_tree_record.data.unique_id_long,
                    posterity: gm.me().selected_tree_record.data.posterity,
                },
                success: function (result, request) {
                    gm.me().setLoading(false);
                    gm.me().mixGrid.getStore().load();
                },
                failure: function () {
                    gm.me().setLoading(false);
                }
            });
        }
    },
    addPartAction: Ext.create('Ext.Action', {
        itemId: 'addPartAction',
        iconCls: 'af-plus-circle',
        disabled: true,
        text: '추가',
        handler: function (widget, event) {

            var records = gm.me().store.data.items;

            var max_num = 0;

            for (var i = 0; i < records.length; i++) {

                var reserved_integer3 = records[i].get('reserved_integer3');

                if (max_num < reserved_integer3) {
                    max_num = reserved_integer3;
                }
            }

            gm.me().mNum = max_num + 1;

            if (gm.me().selected_tree_record == null) {
                Ext.MessageBox.alert('Error', '자재를 추가할 배합을 선택하세요.', function callBack(id) {
                    return;
                });
                return;
            }
            var parent = gm.me().selected_tree_record.get('parent');
            var parent_uid = gm.me().selected_tree_record.get('parentId');
            var ac_uid = gm.me().selected_tree_record.get('ac_uid');
            var top_pl_no = gm.me().selected_tree_record.get('pl_no');
            var unique_uid = gm.me().selected_tree_record.get('unique_uid');
            var reserved_integer1 = gm.me().selected_tree_record.get('reserved_integer1');
            var reserved_integer2 = gm.me().selected_tree_record.get('reserved_integer2');

            this.plnoSuccessFn = function() {

                var bHeight = 500;
                var bWidth = 500;

                var refer_uid = gm.me().selected_tree_record.get('refer_uid');

                gm.me().searchStore.removeAll();
                gm.me().searchStore.getProxy().setExtraParams({
                    sp_code: 'S'
                });

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
                    height: 250,
                    padding: '0 0 5 0',
                    // flex: 1,
                    layout: 'fit',
                    forceFit: false,
                    listeners: {
                        select: function (selModel, record, index, options) {
                            gu.getCmp('unique_id').setValue(record.get('unique_id_long'));
                            gu.getCmp('item_code').setValue(record.get('item_code'));
                            gu.getCmp('item_name').setValue(record.get('item_name'));
                            gu.getCmp('specification').setValue(record.get('specification'));
                            // gu.getCmp('maker_name').setValue(record.get('maker_name'));
                            gu.getCmp('unit_code').setValue(record.get('unit_code'));
                            //gu.getCmp('sales_price').setValue(record.get('sales_price'));
                            // gu.getCmp('currency').setValue(record.get('currency'));
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
                                    width: 120,
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
                                    width: 120,
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
                                    width: 120,
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
                            width: 170,
                            dataIndex: 'item_name',
                            renderer: function (value) {
                                return value.replace(/</gi, "&lt;");
                            }
                        },
                        {
                            text: '규격',
                            width: 170,
                            dataIndex: 'specification'
                        }
                    ]
                });
                // var prodStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PROCESS_TYPE'});
                // var ynStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'YN'});

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
                        new Ext.form.Hidden({
                            name: 'parent',
                            value: gm.me().selectedChild
                        }),
                        new Ext.form.Hidden({
                            name: 'ac_uid',
                            value: gm.me().selectedPjUid
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('pj_code'),
                            name: 'pj_code',
                            value: gm.me().selectedPjCode
                        }),
                        new Ext.form.Hidden({
                            id: 'assy_code',
                            name: 'assy_code',
                            value: gm.me().selectedAssyCode
                        }),
                        new Ext.form.Hidden({
                            id: gu.id('standard_flag'),
                            name: 'standard_flag'
                        }),
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
                        },
                        {
                        //     xtype: 'textfield',
                        //     fieldLabel: gm.me().getColName('maker_name'),
                        //     id: gu.id('maker_name'),
                        //     name: 'maker_name',
                        //     readOnly: true,
                        //     allowBlank: true,
                        //     fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        // }, {
                        //     xtype: 'numberfield',
                        //     minValue: 0,
                        //     width: '100%',
                        //     id: gu.id('bm_quan'),
                        //     name: 'bm_quan',
                        //     fieldLabel: gm.me().getColName('bm_quan'),
                        //     decimalPrecision: 5,
                        //     allowBlank: true,
                        //     value: '1',
                        //     margins: '0'
                        // }, {
                            xtype: 'textfield',
                            width: '100%',
                            fieldLabel: gm.me().getColName('unit_code'),
                            id: gu.id('unit_code'),
                            name: 'unit_code',
                            allowBlank: true,
                        }, /*{
                            xtype: 'numberfield',
                            width: '100%',
                            id: gu.id('sales_price'),
                            name: 'sales_price',
                            decimalPrecision: 5,
                            fieldLabel: gm.me().getColName('sales_price'),
                            allowBlank: true,
                            value: '0',
                            margins: '0'
                        }, */{
                            fieldLabel: 'Level',
                            xtype: 'textfield',
                            hidden: true,
                            width: '100%',
                            emptyText: 'Level',
                            name: 'reserved_integer1',
                            value: reserved_integer1 + 1,
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '단위',
                            emptyText: '단위',
                            name: 'unit_code',
                            id: gu.id('unit_code'),
                            width: '100%',
                            value: 'kg'
                        }, {
                            xtype: 'textfield',
                            id: gu.id('parent'),
                            name: 'parent',
                            emptyText: '제품 UID',
                            value: gm.me().selectedChild,
                            width: '100%',
                            readOnly: true,
                            hidden: true,
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        }, {
                            xtype: 'textfield',
                            id: gu.id('unique_uid'),
                            name: 'unique_uid',
                            emptyText: 'BOM UID',
                            value: refer_uid > -1 ? refer_uid : gm.me().selectedAssyUid,
                            width: '100%',
                            readOnly: true,
                            hidden: true,
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        }, {
                            xtype: 'textfield',
                            id: gu.id('bomdtl_uid'),
                            name: 'bomdtl_uid',
                            emptyText: 'BOMDTL UID',
                            value: -1, // 추가시 -1
                            width: '100%',
                            readOnly: true,
                            hidden: true,
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        }, {
                            fieldLabel: 'AssyTopUID',
                            xtype: 'textfield',
                            name: 'reserved_integer2',
                            value: reserved_integer2,
                            emptyText: '제품ASSY_UID',
                            readOnly: true,
                            hidden: true,
                            width: '100%',
                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                        // }, {
                        //     xtype: 'textfield',
                        //     width: '100%',
                        //     emptyText: '순번',
                        //     hidden: true,
                        //     name: 'pl_no',
                        //     id: gu.id('pl_no'),
                        //     fieldLabel: '순번',
                        //     value: pl_no
                        },
                        {
                            xtype: 'button',
                            text: '초기화',
                            scale: 'small',
                            width: 50,
                            maxWidth: 80,
                            style: {
                                marginTop: '7px',
                                marginLeft: '550px'
                            },
                            // size:50,
                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                            listeners: {
                                click: function () {
                                    gm.me().resetPartForm();
                                }
                            }

                        }, {
                            xtype: 'container',
                            type: 'hbox',
                            padding: '5',
                            pack: 'end',
                            align: 'left',
                            defaults: {},
                            margin: '0 0 0 0',
                            border: false

                        }
                    ]
                });
                // prodStore.load();
                // ynStore.load();

                var winPart = Ext.create('ModalWindow', {
                    title: '품목 추가',
                    width: bWidth,
                    height: bHeight,
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
                                var refer_uid = gm.me().selected_tree_record.get('refer_uid');
                                if (refer_uid > -1) {
                                    Ext.MessageBox.show({
                                        title: '경고',
                                        msg: '참조된 Assy입니다.',
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (result) {
                                            if (result == 'yes') {

                                                gm.me().registPartFc(val);

                                                if (winPart) {
                                                    winPart.close();
                                                }
                                            }
                                        },
                                        icon: Ext.MessageBox.QUESTION
                                    });

                                } else {

                                    gm.me().registPartFc(val);

                                    if (winPart) {
                                        winPart.close();
                                    }
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

            }
            this.plnoSuccessFn();
        }
    }),
    editPartAction: Ext.create('Ext.Action', {
        iconCls: 'af-edit',
        text: gm.getMC('CMD_MODIFY', '수정'),
        tooltip: 'Part 수정하기',
        disabled: true,
        handler: function (widget, event) {

            var rec = gm.me().grid.getSelectionModel().getSelection()[0];

            var standardFlag = rec.get('standard_flag');

            var bomUid = rec.getId();
            var child = rec.get('unique_id_long');
            var bmQuan = rec.get('bm_quan');
            var itemCode = rec.get('item_code');
            var itemName = rec.get('item_name');
            var specification = rec.get('specification');
            var unitCode = rec.get('unit_code');
            var currency = rec.get('currency');
            var makerName = rec.get('maker_name');
            var reservedVarchar2 = rec.get('reserved_varchar2');
            var reservedInteger3 = rec.get('reserved_integer3');
            var salesPrice = rec.get('sales_price');
            var pl_no = rec.get('pl_no');

            if(salesPrice == null || salesPrice === '') {
                salesPrice = 0;
            }

            var records = gm.me().store.data.items;
            var parent = gm.me().selected_tree_record.get('parent');
            var parent_uid = gm.me().selected_tree_record.get('parentId');
            var ac_uid = gm.me().selected_tree_record.get('ac_uid');
           // var top_pl_no = gm.me().selected_tree_record.get('pl_no');
            var unique_uid = gm.me().selected_tree_record.get('unique_uid');
            var reserved_integer1 = gm.me().selected_tree_record.get('reserved_integer1');
            var reserved_integer2 = gm.me().selected_tree_record.get('reserved_integer2');

            var standard_flag = gm.me().selected_tree_record.get('standard_flag');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/poreceipt.do?method=getAssyPlno2',
                params: {
                    ac_uid: gm.me().selectedPjUid,
                    assybom: 'Y', //Y면 AssemblyBom N이나 널이면 ProjectBOM,
                    assymap_uid: unique_uid
                },
                success: function (result, request) {

                    var str = result.responseText;
                    // switch (top_pl_no) {
                    //     case '---':
                    //         top_pl_no = '';
                    //         break;
                    //     case '':
                    //         top_pl_no = '';
                    //         break;
                    //     default:
                    //         top_pl_no = top_pl_no + '-';
                    // }
                    // var pl_no = top_pl_no + str;

                    var bHeight = 750;
                    var bWidth = 700;

                    var refer_uid = gm.me().selected_tree_record.get('refer_uid');

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
                        cls: 'rfx-panel',
                        multiSelect: false,
                        autoScroll: true,
                        border: false,
                        height: 200,
                        padding: '0 0 5 0',
                        flex: 1,
                        layout: 'fit',
                        forceFit: false,
                        listeners: {
                            select: function (selModel, record, index, options) {
                                gu.getCmp('unique_id').setValue(record.get('unique_id_long'));
                                gu.getCmp('item_code').setValue(record.get('item_code'));
                                gu.getCmp('item_name').setValue(record.get('item_name'));
                                gu.getCmp('specification').setValue(record.get('specification'));
                                gu.getCmp('maker_name').setValue(record.get('maker_name'));
                                gu.getCmp('unit_code').setValue(record.get('unit_code'));
                                //gu.getCmp('sales_price').setValue(record.get('sales_price'));
                                gu.getCmp('currency').setValue(record.get('currency'));
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
                                width: 270,
                                dataIndex: 'specification'
                            }
                        ]
                    });
                    var prodStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PROCESS_TYPE'});
                    var ynStore = Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'YN'});

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
                            labelWidth: 60
                        },
                        items: [
                            this.gridViewTable,
                            new Ext.form.Hidden({
                                name: 'parent',
                                value: gm.me().selectedChild
                            }),
                            new Ext.form.Hidden({
                                name: 'ac_uid',
                                value: gm.me().selectedPjUid
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('pj_code'),
                                name: 'pj_code',
                                value: gm.me().selectedPjCode
                            }),
                            new Ext.form.Hidden({
                                id: 'assy_code',
                                name: 'assy_code',
                                value: gm.me().selectedAssyCode
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('standard_flag'),
                                name: 'standard_flag',
                                value: standard_flag
                            }),
                            {
                                fieldLabel: gm.me().getColName('unique_id'),
                                xtype: 'textfield',
                                id: gu.id('unique_id'),
                                name: 'unique_id',
                                emptyText: '자재 UID',
                                readOnly: true,
                                hidden: true,
                                width: 300,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                value: child
                            },
                            {
                                xtype: 'textfield',
                                name: 'item_code',
                                id: gu.id('item_code'),
                                fieldLabel: '품번',
                                readOnly: true,
                                allowBlank: false,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                value: itemCode
                            },
                            {
                                xtype: 'textfield',
                                name: 'item_name',
                                id: gu.id('item_name'),
                                fieldLabel: '품명',
                                readOnly: true,
                                allowBlank: false,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                value: itemName
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '규격',
                                id: gu.id('specification'),
                                name: 'specification',
                                readOnly: true,
                                allowBlank: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                value: specification
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: gm.me().getColName('maker_name'),
                                id: gu.id('maker_name'),
                                name: 'maker_name',
                                readOnly: true,
                                allowBlank: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                                value: makerName
                            },
                            {
                                xtype: 'textfield',
                                name: 'reserved_integer3',
                                id: gu.id('reserved_integer3'),
                                fieldLabel: '순번',
                                allowBlank: false,
                                value: reservedInteger3
                            },
                            {
                                xtype: 'numberfield',
                                minValue: 0,
                                width: '100%',
                                id: gu.id('bm_quan'),
                                name: 'bm_quan',
                                decimalPrecision : 5,
                                fieldLabel: gm.me().getColName('bm_quan'),
                                allowBlank: true,
                                value: bmQuan,
                                margins: '0'
                            }, /*{
                                xtype: 'numberfield',
                                width: '100%',
                                id: gu.id('sales_price'),
                                name: 'sales_price',
                                decimalPrecision : 5,
                                fieldLabel: gm.me().getColName('sales_price'),
                                allowBlank: true,
                                value: salesPrice,
                                margins: '0'
                            },*/ {
                                xtype: 'textfield',
                                width: '100%',
                                fieldLabel: '통화',
                                id: gu.id('currency'),
                                name: 'currency',
                                allowBlank: true,
                                value: currency
                            }, {
                                fieldLabel: 'Level',
                                xtype: 'textfield',
                                hidden: true,
                                width: '100%',
                                emptyText: 'Level',
                                name: 'reserved_integer1',
                                value: reserved_integer1 + 1,
                            }, {
                                xtype: 'textfield',
                                fieldLabel: '단위',
                                name: 'unit_code',
                                id: gu.id('unit_code'),
                                width: '100%',
                                value: unitCode
                            }, {
                                xtype: 'textfield',
                                width: '100%',
                                fieldLabel: '위치',
                                margin: '0 0 70 0',
                                name: 'reserved_varchar2',
                                value: reservedVarchar2
                            }, {
                                fieldLabel: '사용공정',
                                xtype: 'combo',
                                width: '100%',
                                name: 'reserved6',
                                displayField: 'code_name_kr',
                                store: prodStore,
                                sortInfo: { field: 'unique_id', direction: 'ASC' },
                                valueField: 'system_code',
                                typeAhead: false,
                                allowBlank: false,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div>[{system_code}] {code_name_kr}</div>';
                                    }
                                },
                                value: rec.get('reserved6')
                            }, {
                                fieldLabel: 'LOT추적여부',
                                xtype: 'combo',
                                width: '100%',
                                name: 'reserved7',
                                displayField: 'code_name_kr',
                                store: ynStore,
                                sortInfo: { field: 'unique_id', direction: 'ASC' },
                                valueField: 'system_code',
                                typeAhead: false,
                                allowBlank: false,
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 항목 없음.',
                                    getInnerTpl: function () {
                                        return '<div>{code_name_kr}</div>';
                                    }
                                },
                                margin: '0 0 70 0',
                                value: rec.get('reserved7')
                            }, {
                                xtype: 'textfield',
                                id: gu.id('parent'),
                                name: 'parent',
                                emptyText: '제품 UID',
                                value: gm.me().selectedChild,
                                width: '100%',
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                xtype: 'textfield',
                                id: gu.id('unique_uid'),
                                name: 'unique_uid',
                                emptyText: 'BOM UID',
                                value: refer_uid > -1 ? refer_uid : gm.me().selectedAssyUid,
                                width: '100%',
                                readOnly: true,
                                hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                xtype: 'textfield',
                                id: gu.id('bomdtl_uid'),
                                name: 'bomdtl_uid',
                                emptyText: 'BOMDTL UID',
                                // value: refer_uid > -1 ? refer_uid : gm.me().selectedAssyUid,
                                valud: rec.get('unique_id_long'),
                                width: '100%',
                                readOnly: true,
                                // hidden: true,
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                fieldLabel: 'AssyTopUID',
                                xtype: 'textfield',
                                name: 'reserved_integer2',
                                value: reserved_integer2,
                                emptyText: '제품ASSY_UID',
                                readOnly: true,
                                hidden: true,
                                width: '100%',
                                fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                            }, {
                                xtype: 'textfield',
                                width: '100%',
                                emptyText: '순번',
                                hidden: true,
                                name: 'pl_no',
                                id: gu.id('pl_no'),
                                fieldLabel: '순번',
                                value: pl_no
                            }, {
                                xtype: 'container',
                                type: 'hbox',
                                padding: '5',
                                pack: 'end',
                                align: 'left',
                                defaults: {},
                                margin: '0 0 0 0',
                                border: false

                            }
                        ]
                    });

                    prodStore.load();
                    ynStore.load();

                    var winPart = Ext.create('ModalWindow', {
                        title: '품목 수정',
                        width: bWidth,
                        height: bHeight,
                        minWidth: 250,
                        minHeight: 180,
                        items: [gm.me().editPartForm
                        ],
                        buttons: [{
                            text: CMD_OK,
                            handler: function () {
                                var form = gm.me().editPartForm;
                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    var selectedSF = gu.getCmp('standard_flag').getValue();

                                    var editedItemCode = gu.getCmp('item_code').getValue();

                                    var isEqualItemCode = itemCode === editedItemCode;

                                    // 대상이 어셈블리거나 기존이 어셈블리인경우;;;
                                    if ((standardFlag === 'A' || selectedSF === 'A') && !isEqualItemCode) {
                                        // 어셈블리는 지우고 생성
                                        gm.me().deleteConfirm('yes');
                                        gm.me().registPartFc(val);

                                        if(winPart) {
                                            winPart.close();
                                        }
                                    } else {
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=assymapUdate',
                                            params: {
                                                unique_id: bomUid,
                                                reserved_integer3: val['reserved_integer3'],
                                                bmQuan: val['bm_quan'],
                                                item_code: val['item_code'],
                                                child: val['unique_id'],
                                                reserved_varchar2: val['reserved_varchar2']
                                            },
                                            success: function (result, request) {
                                                gm.me().store.load();
                                                if(winPart) {
                                                    winPart.close();
                                                }
                                            },
                                            failure: extjsUtil.failureMessage
                                        });
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


        },
        failure: extjsUtil.failureMessage
    }),

    removePartAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: 'Part 삭제하기',
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: '삭제하기',
                msg: '선택한 항목을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().deleteBomdtlConfirm,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),
    deleteBomdtlConfirm: function (result) {
        if (result == 'yes') {
            gm.setCenterLoading(true);

            var selections = gm.me().grid.getSelectionModel().getSelection();
            var bomdtl_uid = selections[0].get('unique_id_long');
            // var standard_flag = selections[0].get('standard_flag');
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=deleteBomdtl',
                params: {
                    // bomdtl_uids: bomdtl_uids
                    bomdtl_uid: bomdtl_uid
                },
                method: 'POST',
                success: function (rec, op) {
                    gm.me().store.load();

                },
                failure: function (rec, op) {
                    Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function () {
                    });
                    gm.setCenterLoading(false);
                    // gu.getCmp('DBM7TREE-Assembly').store.load();
                }
            });
            gm.setCenterLoading(false);
            // gm.me().store.load();
        }
    },
    calcRatioAction: Ext.create('Ext.Action', {
        iconCls: 'af-save',
        text: '소요량비율저장',
        tooltip: '소요량비율저장',
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: '저장하기',
                msg: '저장하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().calcRatioConfirm,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),
    calcRatioConfirm: function (result) {
        if (result == 'yes') {
            // 숫자입력확인(regex), 미입력 확인
            // 이상시 리턴 & 메시지

            // 입력값 이상없을 경우
            var data = gm.me().grid.getStore().getDataSource();
            var temp_quan_sum = 0;
            var uidArr = [];
            var calcRatioArr = [];
            console.log('calcRatio', data);
            data.items.forEach(el => {
                temp_quan_sum += el.get('temp_quan')*1;
                console.log('inputRatio | ', el.get('unique_id_long'), ' , temp_quan', el.get('temp_quan'));
            });
            data.items.forEach(el => {
                calcRatio = el.get('temp_quan') / temp_quan_sum;
                // console.log('calcRatio | ', calcRatio, ' , temp_quan : ', el.get('temp_quan'), ', temp_quan_sum : ', temp_quan_sum);
                //uid_ratioArr.push(('' + el.get('unique_id_long') + '_' + calcRatio));
                uidArr.push(el.get('unique_id_long'));
                calcRatioArr.push(calcRatio);
            });
            console.log('temp_quan_sum | ', temp_quan_sum);
            console.log('uidArr | ', uidArr);
            console.log('calcRatioArr | ', calcRatioArr);
            // 저장 
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=updateBomdtlChmr',
                params:{
                    uidArr: uidArr,
                    calcRatioArr: calcRatioArr
                },
                success: function(result, request) {
                    gm.me().store.load();
                },
                failure: extjsUtil.failureMessage
            })
        }

    },
    registPartFc: function (val) {

        var standard_flag = val['standard_flag'];
        // 어셈블리추가
        if (standard_flag == 'A') {
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=createBomver',
                params: {
                    // parent_uid: val['unique_uid'],
                    parent_uid: gm.me().selected_tree_record.get('unique_id_long'),
                    parent: val['child'],
                    // ac_uid: val['ac_uid'],
                    pl_no: val['pl_no'],
                    bm_quan: val['bm_quan'],
                    item_name: val['assy_name'],
                    // pj_code: val['pj_code'],
                    child: val['target_child'],
                    reserved_integer1: gm.me().selected_tree_record.get('posterity')*1 + 1,
                    reserved6: val['reserved6'],
                    reserved7: val['reserved7']
    
    
                },
                success: function(result, request) {
                    gm.me().assyGrid2.getStore().load();
                    gm.me().store.load();
                    // gm.me().reSelect();
                },
                failure: extjsUtil.failureMessage
            });

        } else {

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design/bom.do?method=addBomdtl',
                params: {
                    ver_parent_uid: gm.me().selected_tree_record.get('unique_id_long'),
                    parent: gm.me().selected_tree_record.get('child'),
                    reserved_integer1: gm.me().selected_tree_record.get('posterity') * 1 + 1,
                    bm_quan: val['bm_quan'],
                    child: val['unique_id'],
                    bomdtl_uid: val['bomdtl_uid'],
                    reserved6: val['reserved6'],
                    reserved7: val['reserved7']
                },

                success: function (result, request) {

                    gm.me().store.getProxy().setExtraParam('parent', gm.me().selectedChild);
                    gm.me().store.getProxy().setExtraParam('parent_uid', gm.me().selectedAssyUid);
                    gm.me().store.getProxy().setExtraParam('ac_uid', -1);
                    gm.me().store.load(function (records) {
                        var max_num = 0;

                        for (var i = 0; i < records.length; i++) {

                            var reserved_integer3 = records[i].get('reserved_integer3');

                            if (max_num < reserved_integer3) {
                                max_num = reserved_integer3;
                            }
                        }

                        gm.me().mNum = max_num + 1;
                    });
                    gu.getCmp('DBM7TREE-Assembly').store.load();
                    // Ext.MessageBox.alert('성공', '자재가 정상적으로 등록 되었습니다.');
                },
                failure: extjsUtil.failureMessage
            });

        }       


    },

});