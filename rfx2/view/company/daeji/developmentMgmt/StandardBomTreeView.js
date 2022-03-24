Ext.define('Rfx2.view.company.daeji.developmentMgmt.StandardBomTreeView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'standard-bom-tree-view',
    initComponent: function () {
        this.columns.splice(0, 0, {
            menuDisabled: true,
            sortable: false,
            useYn: true,
            xtype: 'actioncolumn',
            align: 'center',
            style: 'align:center;',
            width: 30,
            items: [{
                getClass: function (v, meta, rec) {
                    if (rec.get('standard_flag') == 'A') {
                        return 'assembly-col';
                    } else {
                        return 'part-col';
                    }
                },
                getTip: function (v, meta, rec) {
                    if (rec.get('standard_flag') == 'A') {
                        return 'Assembly';
                    } else {
                        return 'Part';
                    }
                },
                handler: function (grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex),
                        action = (rec.get('standard_flag') == 'A' ? 'Assembly' : 'Part');

                    Ext.Msg.alert(action, action);
                }
            }]
        });

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //검색툴바 생성
        // var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델 정의
        this.createStore('Rfx2.model.company.bioprotech.Bomdtl', [{
                property: 'reserved_integer3',
                direction: 'ASC'
            }],
            gm.pageSize
            , {
                // creator: 'a.creator',
                // unique_id: 'a.unique_uid'
            }
            , ['bomdtl']
        );
        this.store.autoLoad = false;
        this.store.getProxy().setExtraParams({
            orderBy: 'reserved_integer3',
            ascDesc: 'ASC'
        });
        this.store.on('load', function (params) {
            gm.me().originStoreDatas = gu.deepCloneStore(gm.me().store).data.items;
        })
        //그리드 생성
        var arr = [];
        // arr.push(buttonToolbar);
        //grid 생성.
        this.createGrid(arr, {
            // width: '59%'
            multiSelect: false,
            autoSync: false,
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()]
        });


        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        // this.store.load(function(records){});
        this.loadStoreAlways = true;

    }, // end of init

    selectedAssy: null,
    selectedBomdtl: null,

    searchStore: Ext.create('Rfx2.store.company.kbtech.MaterialStore', {}),
    pcrDivStroe: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PCR_DIV'}),
    prodStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PROCESS_TYPE'}),
    ynStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'YN'}),
    originStoreDatas: null,

    createWest: function () {
        this.productStore = Ext.create('Ext.data.Store', {
            model: Ext.create('Rfx2.model.company.bioprotech.ProductVerMgmt', {}),
            autoLoad: true,
            pageSize: 50
        });
        this.productStore.getProxy().setExtraParams(
            {
                standard_flag: 'A'
            }
        );
        this.productStore.on('load', function (params) {
            gm.me().selectedAssy = null;
            gm.me().selectedBomdtl = null;
            gm.me().store.data.clear();
        })

        this.productGrid = Ext.create('Rfx.base.BaseGrid', {
            title: 'Assembly',
            store: this.productStore,
            forceFit: true,
            multiSelect: false,
            listeners: {
                cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                        var tempTextArea = document.createElement("textarea");
                        document.body.appendChild(tempTextArea);
                        tempTextArea.value = eOpts.target.innerText;
                        tempTextArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempTextArea);
                    }
                }
            },
            bbar: getPageToolbar(this.productStore),
            dockedItems: [
                /*
                        Ext.create('Ext.Action', {
                            iconCls: 'af-search',
                            text: CMD_SEARCH,
                            region: 'east',
                            tooltip: CMD_SEARCH,
                            handler: function () {
                                gm.me().redrawStore(true);
                            }
                        })
                        */
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        Ext.create('Ext.Action', {
                            iconCls: 'af-search',
                            text: CMD_SEARCH,
                            region: 'east',
                            tooltip: CMD_SEARCH,
                            handler: function () {
                                gm.me().productGrid.getStore().load();
                            }
                        })
                    ]
                },
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            // width: '33%',
                            flex: 1,
                            field_id: 'search_item_code',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_item_code'),
                            name: 'search_item_code',
                            xtype: 'triggerfield',
                            emptyText: '품번',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().productGrid.getStore().getProxy().setExtraParam('item_code', '%' + e + '%');

                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().productGrid.getStore().load();
                                    }
                                }
                            }
                        },
                        {
                            // width: '33%',
                            flex: 1,
                            field_id: 'search_item_name',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_item_name'),
                            name: 'search_item_name',
                            xtype: 'triggerfield',
                            emptyText: '품명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().productGrid.getStore().getProxy().setExtraParam('item_name', '%' + e + '%');
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().productGrid.getStore().load();
                                    }
                                }
                            }
                        },
                        {
                            // width: '33%',
                            flex: 1,
                            field_id: 'search_specification',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_specification'),
                            name: 'search_specification',
                            xtype: 'triggerfield',
                            emptyText: '규격',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().productGrid.getStore().getProxy().setExtraParam('specification', '%' + e + '%');

                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().productGrid.getStore().load();
                                    }
                                }
                            }
                        },
                        {
                            // width: '33%',
                            flex: 1,
                            field_id: 'search_description',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_description'),
                            name: 'search_description',
                            xtype: 'triggerfield',
                            emptyText: '기준모델',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');

                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    var paramVal = '%' + e + '%';
                                    // if (!!e) {
                                    // } else {
                                    //     paramVal = '';
                                    // }
                                    gm.me().productGrid.getStore().getProxy().setExtraParam('description', paramVal);
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().productGrid.getStore().load();
                                    }
                                }
                            }
                        },
                        {
                            // width: '33%',
                            flex: 1,
                            field_id: 'search_item_type',
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_item_type'),
                            name: 'search_item_type',
                            xtype: 'triggerfield',
                            emptyText: 'OEM 고객',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().productGrid.getStore().getProxy().setExtraParam('item_type', '%' + e + '%');
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().productGrid.getStore().load();
                                    }
                                }
                            }
                        },
                    ]
                },
                // {
                //     dock: 'top',
                //     xtype: 'toolbar',
                //     cls: 'my-x-toolbar-default1',
                //     items: [
                //         {
                //             width: '33%',
                //             field_id: 'search_description',
                //             fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                //             id: gu.id('search_description'),
                //             name: 'search_description',
                //             xtype: 'triggerfield',
                //             emptyText: '기준모델',
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             onTrigger1Click: function () {
                //                 this.setValue('');

                //             },
                //             listeners: {
                //                 change: function (fieldObj, e) {
                //                     var paramVal = '%' + e + '%';
                //                     // if (!!e) {
                //                     // } else {
                //                     //     paramVal = '';
                //                     // }
                //                     gm.me().productGrid.getStore().getProxy().setExtraParam('description', paramVal);
                //                 },
                //                 render: function (c) {
                //                     Ext.create('Ext.tip.ToolTip', {
                //                         target: c.getEl(),
                //                         html: c.emptyText
                //                     });
                //                 },
                //                 specialkey: function (fieldObj, e) {
                //                     if (e.getKey() == Ext.EventObject.ENTER) {
                //                         gm.me().productGrid.getStore().load();
                //                     }
                //                 }
                //             }
                //         },
                //         {
                //             width: '33%',
                //             field_id: 'search_item_type',
                //             fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                //             id: gu.id('search_item_type'),
                //             name: 'search_item_type',
                //             xtype: 'triggerfield',
                //             emptyText: 'OEM 고객',
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             onTrigger1Click: function () {
                //                 this.setValue('');
                //             },
                //             listeners: {
                //                 change: function (fieldObj, e) {
                //                     gm.me().productGrid.getStore().getProxy().setExtraParam('item_type', '%' + e + '%');
                //                 },
                //                 render: function (c) {
                //                     Ext.create('Ext.tip.ToolTip', {
                //                         target: c.getEl(),
                //                         html: c.emptyText
                //                     });
                //                 },
                //                 specialkey: function (fieldObj, e) {
                //                     if (e.getKey() == Ext.EventObject.ENTER) {
                //                         gm.me().productGrid.getStore().load();
                //                     }
                //                 }
                //             }
                //         },
                //     ]
                // },
            ],
            columns: [
                {
                    text: '품번',
                    dataIndex: 'item_code',
                    width: 40
                },
                {
                    text: '품명',
                    dataIndex: 'item_name',
                    width: 60
                },
                {
                    text: '규격',
                    dataIndex: 'specification',
                    width: 60
                },
                {
                    text: '기준모델',
                    dataIndex: 'description',
                    width: 60
                },
                {
                    text: 'OEM 고객',
                    dataIndex: 'item_type',
                    width: 40
                },
                {
                    xtype: 'datecolumn',
                    format: 'Y-m-d',
                    align: 'right',
                    text: 'BOM최종수정일',
                    dataIndex: 'last_bom_change_date',
                    width: 60
                },
                {
                    text: 'VERSION',
                    dataIndex: 'last_bom_version',
                    width: 40
                },
            ]
        });

        this.productGrid.getSelectionModel().on({
            selectionchange: function (aa, selections) {
                if (selections.length === 1) {
                    var rec = selections[0]
                    gm.me().selectedAssy = rec;
                    console.log('Selected Products : ', rec);
                    gm.me().store.getProxy().setExtraParam('ver_child', rec.get('unique_id_long'));
                    gm.me().store.load();

                    gm.me().addPartAction.enable();
                    gm.me().getHistoryAction.enable();
                    gm.me().resetAction.enable();
                    gm.me().saveAction.enable();

                    gm.me().grid.getSelectionModel().deselect();
                    if(window.sessionStorage.length > 0) {
                        gm.me().pastePartsAction.enable();
                    }
                } else {
                    gm.me().selectedAssy = null;
                    gm.me().addPartAction.disable();
                    gm.me().getHistoryAction.disable();
                    gm.me().resetAction.disable();
                    gm.me().saveAction.disable();
                    gm.me().pastePartsAction.disable();
                }
            }
        });

        this.west = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
            // {
            layout: 'border',
            border: true,
            region: 'west',
            width: '40%',
            items: [this.productGrid]
        });
        return this.west;
    },


    // ================================================================= Center
    registPartFc: function (val) {
        gm.me().store.add({
            parent: val['parent'],
            child: val['child'],
            bm_quan: val['bm_quan'],
            reserved_integer1: val['reserved_integer1'],
            reserved_integer3: val['reserved_integer3'],
            reserved6: val['reserved6'],
            reserved7: val['reserved7'],
            pcr_div: val['pcr_div'],

            bomdtl_uid: val['bomdtl_uid'],

            item_code: val['item_code'],
            item_name: val['item_name'],
            specification: val['specification'],
            standard_flag: val['standard_flag']
        })
    },

    editPartFc: function (val) {
        console.log('editPartFc : ', val);
        gm.me().selectedBomdtl.set('bm_quan', val['bm_quan']);
        gm.me().selectedBomdtl.set('reserved6', val['reserved6']);
        gm.me().selectedBomdtl.set('reserved7', val['reserved7']);
        gm.me().selectedBomdtl.set('pcr_div', val['pcr_div']);
    },

    /* isAdd = ADD:ture | EDIT:false  */
    createPartForm: function (isAdd) {
        var dtlRec = null;
        var max_num = 0;

        if (!isAdd && gm.me().grid.getSelectionModel().getSelection().length > 0) {
            dtlRec = gm.me().grid.getSelectionModel().getSelection()[0];
        } else if (isAdd) {
            var records = gm.me().store.data.items;
            for (var i = 0; i < records.length; i++) {
                var reserved_integer3 = records[i].get('reserved_integer3');
                if (max_num < reserved_integer3) {
                    max_num = reserved_integer3;
                }
            }
            max_num = max_num * 1 + 1;
        }
        gm.me().pcrDivStroe.load();
        gm.me().prodStore.load();
        gm.me().ynStore.load();

        var form = Ext.create('Ext.form.Panel', {
            // xtype: 'form',
            height: 400,
            bodyPadding: 10,
            flex: 1,
            defaults: {
                allowBlank: true,
                msgTarget: 'side',
                labelWidth: 60,
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
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    value: isAdd ? null : dtlRec.get('item_code')
                },
                {
                    xtype: 'textfield',
                    name: 'item_name',
                    id: gu.id('item_name'),
                    fieldLabel: '품명',
                    readOnly: true,
                    allowBlank: false,
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    value: isAdd ? null : dtlRec.get('item_name')
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '규격',
                    id: gu.id('specification'),
                    name: 'specification',
                    readOnly: true,
                    allowBlank: true,
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    value: isAdd ? null : dtlRec.get('specification')
                },
                //=============================hidden
                new Ext.form.Hidden({
                    id: gu.id('parent'),
                    name: 'parent',
                    value: gm.me().selectedAssy.get('unique_id_long')
                }),
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
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    value: isAdd ? null : dtlRec.get('child')
                },
                {
                    xtype: 'textfield',
                    id: gu.id('bomdtl_uid'),
                    name: 'bomdtl_uid',
                    emptyText: 'BOMDTL UID',
                    value: -1, // 추가시 -1
                    readOnly: true,
                    hidden: true,
                    fieldStyle: 'background-color: #EAEAEA; background-image: none;',
                    value: isAdd ? null : dtlRec.get('unique_id_long')
                },
                {
                    xtype: 'textfield',
                    emptyText: '순번',
                    hidden: true,
                    name: 'reserved_integer3',
                    id: gu.id('reserved_integer3'),
                    fieldLabel: '순번',
                    value: isAdd ? max_num : dtlRec.get('reserved_integer3')
                },
                {
                    fieldLabel: 'Level',
                    xtype: 'textfield',
                    hidden: true,
                    emptyText: 'Level',
                    name: 'reserved_integer1',
                    value: 1
                },
                // ================ end of hidden fields
                {
                    xtype: 'numberfield',
                    minValue: 0,
                    id: gu.id('bm_quan'),
                    name: 'bm_quan',
                    fieldLabel: gm.me().getColName('bm_quan'),
                    decimalPrecision: 5,
                    allowBlank: true,
                    margins: '0',
                    value: isAdd ? '1' : dtlRec.get('bm_quan')
                },
                // {
                //     fieldLabel: '조달',
                //     xtype: 'combo',
                //     name: 'pcr_div',
                //     id: gu.id('pcr_div'),
                //     displayField: 'code_name_kr',
                //     store: gm.me().pcrDivStroe,
                //     sortInfo: { field: 'unique_id', direction: 'ASC' },
                //     valueField: 'system_code',
                //     typeAhead: false,
                //     allowBlank: false,
                //     listConfig: {
                //         loadingText: '검색중...',
                //         emptyText: '일치하는 항목 없음.',
                //         getInnerTpl: function () {
                //             return '<div>[{system_code}] {code_name_kr}</div>';
                //         }
                //     },
                //     value: isAdd ? 'PUR' : dtlRec.get('pcr_div')
                // },
                {
                    fieldLabel: '사용공정',
                    xtype: 'combo',
                    name: 'reserved6',
                    id: gu.id('reserved6'),
                    displayField: 'code_name_kr',
                    store: gm.me().prodStore,
                    sortInfo: {field: 'unique_id', direction: 'ASC'},
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
                    // value: 'M' // 생산
                    value: isAdd ? 'M' : dtlRec.get('reserved6')
                },
                {
                    fieldLabel: 'LOT추적',
                    xtype: 'combo',
                    name: 'reserved7',
                    id: gu.id('reserved7'),
                    displayField: 'code_name_kr',
                    store: gm.me().ynStore,
                    sortInfo: {field: 'unique_id', direction: 'ASC'},
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
                    // value: 'Y' // 예
                    value: isAdd ? 'Y' : dtlRec.get('reserved7')
                },
            ]
        })
        return form;
    },

    addPartAction: Ext.create('Ext.Action', {
        itemId: 'addPartAction',
        iconCls: 'af-plus-circle',
        text: '추가',
        tooltip: 'ADD MATERIAL',
        disabled: true,
        handler: function (widget, event) {
            if (gm.me().selectedAssy == null) {
                Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
                    return;
                });
                return;
            }
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
                title: '품목 추가',
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
            winPart.show(/* this, function(){} */);
        }
    }),

    editPartAction: Ext.create('Ext.Action', {
        itemId: 'editPartAction',
        iconCls: 'af-edit',
        text: gm.getMC('CMD_MODIFY', '수정'),
        tooltip: 'EDIT MATERIAL',
        disabled: true,
        handler: function (widget, event) {
            if (gm.me().selectedAssy == null) {
                Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
                    return;
                });
                return;
            } else if (gm.me().selectedBomdtl == null) {
                Ext.MessageBox.alert('Error', '수정할 항목을 선택하세요.', function callBack(id) {
                    return;
                });
                return;
            }

            var bHeight = 300;
            var bWidth = 500;

            var addForm = gm.me().createPartForm(false);
            var winPart = Ext.create('ModalWindow', {
                title: '품목 수정',
                width: bWidth,
                height: bHeight,
                items: [
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
                            gm.me().editPartFc(val);
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
            winPart.show(/* this, function(){} */);
        }
    }),

    removePartAction: Ext.create('Ext.Action', {
        itemId: 'removePartAction',
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        tooltip: 'REMOVE MATERIAL',
        disabled: true,
        handler: function (widget, event) {
            if (!gm.me().selectedBomdtl) {
                Ext.MessageBox.alert('삭제 실패!', '선택한 자재가 없습니다.');
                return;
            }
            var records = gm.me().grid.getSelectionModel().getSelection();
            Ext.MessageBox.show({
                title: '삭제하기',
                msg: '선택한 항목들을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function () {
                    gm.me().store.remove(records);
                }
            });
        }
    }),

    getHistoryAction: Ext.create('Ext.Action', {
        itemId: 'getHistoryAction',
        iconCls: 'af-search',
        text: '이력보기',
        tooltip: 'GET HISTORY',
        disabled: true,
        hidden: gu.setCustomBtnHiddenProp('getHistoryAction'),
        handler: function (widget, event) {
            if (gm.me().selectedAssy == null) {
                return;
            }

            var bomhstStore = Ext.create('Rfx2.store.BomhstStore', {});
            // bomhstStore.getProxy().setExtraParam('bomver_uid', gm.me().selectedAssy.get('unique_id_long'));
            bomhstStore.getProxy().setExtraParams({
                srcahdUid: gm.me().selectedAssy.get('unique_id_long'),
                order_by: 'create_date',
                ascDesc: 'DESC'
            });
            bomhstStore.load();
            var bWidth = 580;
            var bHeight = 400;

            var historyGrid = Ext.create('Ext.grid.Panel', {
                id: gu.id('historyGrid'),
                // cls: 'rfx-panel',
                store: bomhstStore,
                // border: false,
                width: bWidth,
                height: bHeight,
                multiSelect: false,
                autoScroll: false,
                // padding: '0 0 5 0',
                // flex: 1,
                // layout: 'fit',
                // forceFit: false,
                columns: [
                    {
                        text: 'VERSION',
                        dataIndex: 'rev',
                        width: 60
                    },
                    // {
                    //     text: 'TYPE',
                    //     dataIndex: 'change_type',
                    //     width: 40
                    // },
                    {
                        text: '변경내역',
                        dataIndex: 'description',
                        width: 330
                    },
                    {
                        text: '작업자',
                        dataIndex: 'creator',
                        width: 70
                    },
                    {
                        xtype: 'datecolumn',
                        format: 'Y-m-d H:i',
                        text: '작업시간',
                        dataIndex: 'create_date',
                        width: 110
                    }
                ]
            });

            var win = Ext.create('ModalWindow', {
                title: 'BOM 히스토리',
                width: bWidth + 20,
                height: bHeight,
                // minWidth: 250,
                // minHeight: 250,
                // autoScroll: true,
                layout: {
                    xtype: 'vbox',
                    align: 'stretch'
                },
                items: historyGrid,
                buttons: [{
                    text: CMD_OK,
                    handler: function () {
                        if (win) {
                            win.close();
                        }
                    }
                }]
            });
            win.show(/* this, function(){} */);
        }
    }),

    resetAction: Ext.create('Ext.Action', {
        itemId: 'resetAction',
        iconCls: 'af-refresh',
        text: '되돌리기',
        tooltip: 'RESET',
        disabled: true,
        handler: function (widget, event) {
            Ext.MessageBox.show({
                title: '되돌리기',
                msg: '작업내역을 저장하지 않고 새로고침 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function () {
                    gm.me().store.load();
                }
            });
        }
    }),

    saveAction: Ext.create('Ext.Action', {
        itemId: 'saveAction',
        iconCls: 'af-save',
        text: '저장',
        tooltip: 'SAVE',
        disabled: true,
        hidden: gu.setCustomBtnHiddenProp('saveAction'),
        handler: function (widget, event) {

            Ext.MessageBox.show({
                title: 'EBOM 저장',
                msg: '저장 하시겠습니까?',
                // msg: '저장 기능은 개발 중입니다.',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function () {
                    gm.setCenterLoading(true);
                    var storeDatas = gm.me().store.data.items.slice();
                    var sameChildDatas = []; // 자재의 종류 변동 X
                    var sameDatas = []; // 자재의 종류,수량 등 변동 X
                    var diffDatas = []; // 업데이트 할 자재

                    gm.me().originStoreDatas.forEach(element => {
                        var sameChildPart = storeDatas.filter(x => x.get('child') == element.get('child'));
                        sameChildDatas = sameChildDatas.concat(sameChildPart);
                        var samePart = storeDatas.filter(x => x.get('child') == element.get('child')
                                && x.get('bm_quan') == element.get('bm_quan')
                                && x.get('reserved6') == element.get('reserved6')
                                && x.get('reserved7') == element.get('reserved7')
                            // && x.get('reserved_integer1') == element.get('reserved_integer1')
                            // && x.get('reserved_integer3') == element.get('reserved_integer3')
                        );
                        sameDatas = sameDatas.concat(samePart);
                        var diffPart = storeDatas.filter(x => x.get('child') == element.get('child')
                            && (x.get('bm_quan') != element.get('bm_quan')
                                || x.get('reserved6') != element.get('reserved6')
                                || x.get('reserved7') != element.get('reserved7')
                                // || x.get('reserved_integer1') != element.get('reserved_integer1')
                                // || x.get('reserved_integer3') != element.get('reserved_integer3')
                            )
                        );
                        diffDatas = diffDatas.concat(diffPart);
                        // if(!!diffPart && diffPart.length > 0){
                        //     diffDatas.push(diffPart[0].get('child'));
                        // }
                    });

                    var srcahdUid = gm.me().selectedAssy.get('unique_id'),
                        bomdtlUids = [],
                        childs = [],
                        itemCodes = [],
                        standardFlags = [],
                        bmQuans = [],
                        reservedInteger1s = [],
                        reservedInteger3s = [],
                        reserved6s = [],
                        reserved7s = [];
                    if (gm.me().originStoreDatas.length != 0 && gm.me().originStoreDatas.length == storeDatas.length && gm.me().originStoreDatas.length == sameChildDatas.length) {
                        console.log('자재 종류 변동 없음!');

                        if (gm.me().originStoreDatas.length == sameDatas.length) {
                            console.log('변동 사항 없음! 업데이트 하지 않습니다.');
                            gm.setCenterLoading(false);
                            Ext.MessageBox.alert('알림', '변동사항이 없습니다.');
                            // gm.me().store.load();
                            return;
                        } else {
                            gm.me().originStoreDatas.forEach(origin => {
                                storeDatas.forEach(dev => {
                                    if (origin.get('child') == dev.get('child')) {
                                        origin.set('bm_quan', dev.get('bm_quan'));
                                        origin.set('reserved6', dev.get('reserved6'));
                                        origin.set('reserved7', dev.get('reserved7'));
                                        origin.set('reserved_integer1', dev.get('reserved_integer1'));
                                        origin.set('reserved_integer3', dev.get('reserved_integer3'));
                                    }
                                })
                            });
                            console.log('상세 정보 변동! Update 및 Revision 필요! ');

                            gm.me().originStoreDatas.forEach(origin => {
                                diffDatas.forEach(dev => {
                                    if (origin.get('child') == dev.get('child')) {
                                        console.log('업데이트 할 것 : ', origin);
                                        bomdtlUids.push(origin.get('unique_id_long'));
                                        childs.push(origin.get('child'));
                                        itemCodes.push(origin.get('item_code'));
                                        standardFlags.push(origin.get('standard_flag'));
                                        bmQuans.push(origin.get('bm_quan'));
                                        reservedInteger1s.push(origin.get('reserved_integer1'));
                                        reservedInteger3s.push(origin.get('reserved_integer3'));
                                        reserved6s.push(origin.get('reserved6'));
                                        reserved7s.push(origin.get('reserved7'));
                                    }
                                })
                                // if (diffDatas.includes(origin.get('child'))) {
                                //     console.log('업데이트 할 것 : ', origin);
                                //     bomdtlUids.push(origin.get('unique_id_long'));
                                //     childs.push(origin.get('child'));
                                //     standardFlags.push(origin.get('standard_flag'));
                                //     bmQuans.push(origin.get('bm_quan'));
                                //     reservedInteger1s.push(origin.get('reserved_integer1'));
                                //     reservedInteger3s.push(origin.get('reserved_integer3'));
                                //     reserved6s.push(origin.get('reserved6'));
                                //     reserved7s.push(origin.get('reserved7'));
                                // }
                            });
                        }
                    } else if (gm.me().originStoreDatas.length != sameChildDatas.length
                        || gm.me().originStoreDatas.length != storeDatas.length) {
                        console.log('자재 종류 변동! Major 버전 생성 필요!');
                        for (let index = 0; index < storeDatas.length; index++) {
                            const element = storeDatas[index];
                            childs.push(element.get('child'));
                            itemCodes.push(element.get('item_code'));
                            standardFlags.push(element.get('standard_flag'));
                            bmQuans.push(element.get('bm_quan'));
                            reservedInteger1s.push(element.get('reserved_integer1'));
                            reservedInteger3s.push(element.get('reserved_integer3'));
                            reserved6s.push(element.get('reserved6'));
                            reserved7s.push(element.get('reserved7'));
                            // pcrDivs.push(element.get('pcr_div'));
                        }
                        bomdtlUids = null;
                    }
                    // else {
                    //     console.log('자재 종류 변동! Major 버전 생성 필요!', gm.me().originStoreDatas);
                    //     console.log('자재 종류 변동! Major 버전 생성 필요!', sameChildDatas);
                    //     console.log('자재 종류 변동! Major 버전 생성 필요!', storeDatas);
                    // }
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=saveBomDesign',
                        params: {
                            srcahdUid: srcahdUid,
                            bomdtlUids: bomdtlUids,
                            childs: childs,
                            itemCodes: itemCodes,
                            standardFlags: standardFlags,
                            bmQuans: bmQuans,
                            reservedInteger1s: reservedInteger1s,
                            reservedInteger3s: reservedInteger3s,
                            reserved6s: reserved6s,
                            reserved7s: reserved7s,
                            // pcrDivs: pcrDivs
                        },
                        success: function (result, request) {
                            gm.setCenterLoading(false);
                            // Ext.MessageBox.alert('결과', result.responseText);
                            var responseText = Ext.util.JSON.decode(result.responseText);
                            if (responseText.datas == 'false') {
                                Ext.MessageBox.alert('결과', responseText.reason);
                            }
                            gm.me().store.load();
                        }, // endof success for ajax
                        failure: function (result, request) {
                            gm.setCenterLoading(false);
                            extjsUtil.failureMessage
                        }
                    }); // endof Ajax
                },
            });

            // gm.me().store.sync({
            //     success: function (batch, opt) {
            //         Ext.Msg.alert('Status', 'Changes saved successfully.');
            //     },
            //     failure: function (batch, opt) {
            //         var msg = '';
            //         if (batch.hasException) {
            //             for (var i = 0; i < batch.exceptions.length; i++) {
            //                 switch (batch.exceptions[i].action) {
            //                     case "destroy":
            //                         msg = msg + batch.exceptions[i].records.length + " Delete, ";
            //                         break;
            //                     case "update":
            //                         msg = msg + batch.exceptions[i].records.length + " Update, ";
            //                         break;
            //                     case "create":
            //                         msg = msg + batch.exceptions[i].records.length + " Create, ";
            //                         break;
            //                 }
            //             }
            //             Ext.Msg.alert("Status", msg + " operation failed!");
            //         }
            //         else
            //             Ext.Msg.alert('Status', 'Changes failed.');
            //     }
            // });
        }
    }),

    copyPartsAction: Ext.create('Ext.Action', {
        itemId: 'copyPartsAction',
        iconCls: 'af-copy',
        text: '복사',
        tooltip: 'COPY',
        hidden: gu.setCustomBtnHiddenProp('copyPartsAction'),
        disabled: true,
        handler: function (widget, event) {
            var records = gm.me().grid.getSelectionModel().getSelection();
            window.sessionStorage.clear();
            var datas = [];
            records.forEach(element => {
                datas.push(element.getData());
            });
            var recordsJson = JSON.stringify(datas);
            window.sessionStorage.setItem('copiedParts', recordsJson);
            gm.me().showToast('결과', records.length + '개 자재가 복사되었습니다.');
        }
    }),

    pastePartsAction: Ext.create('Ext.Action', {
        itemId: 'pastePartsAction',
        iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
        text: '붙여넣기',
        tooltip: 'PASTE',
        hidden: gu.setCustomBtnHiddenProp('pastePartsAction'),
        disabled: true,
        handler: function (widget, event) {
            var copiedRecords = window.sessionStorage.getItem('copiedParts');
            var copiedRecordsJson = JSON.parse(copiedRecords);
            gm.me().store.add(copiedRecordsJson);
        }
    }),



    addToolbar: function () {
        var dockedItems = Ext.create('widget.toolbar', {
            dock: 'top',
            cls: 'my-x-toolbar-default2',
            // xtype: 'toolbar',
            items: [
                this.addPartAction,
                this.editPartAction,
                this.removePartAction,
                '-', '-',
                this.getHistoryAction,
                // this.resetAction,
                this.saveAction,
                '-', '-',
                this.copyPartsAction,
                this.pastePartsAction
            ]
        });
        this.grid.addDocked(dockedItems)
    },

    createCenter: function () {
        this.addToolbar();

        this.setGridOnCallback(function (selections) {
            if (selections.length === 1) {
                gm.me().selectedBomdtl = selections[0];
                gm.me().editPartAction.enable();
                gm.me().removePartAction.enable();
                gm.me().copyPartsAction.enable();
            } else if (selections.length > 1) {
                gm.me().removePartAction.enable();
                gm.me().editPartAction.disable();
                gm.me().copyPartsAction.enable();
            } else {
                gm.me().selectedBomdtl = null;
                gm.me().editPartAction.disable();
                gm.me().removePartAction.disable();
                gm.me().copyPartsAction.disable();
            }
        });

        this.center = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: true,
            region: 'center',
            width: '59%',
            items: [this.grid]
        });
        return this.center;
    }
});