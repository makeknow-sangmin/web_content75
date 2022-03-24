Ext.define('Rfx2.view.company.hanjung.stockMgmt.GoodsExtraOutByProjectView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'goods-out-by-project-view',
    srcahdArr: [],
    initComponent: function() {

        //모델을 통한 스토어 생성
        this.createStore('Rfx2.model.company.hanjung.GoodsOutByProject', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gMain.pageSize,/*pageSize*/
            null, ['rtgast']

        );

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField('reserved_varchar2');
        this.addSearchField('reserved_varchar3');

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        var buttonToolbar3 = Ext.create('widget.toolbar', {
            style: 'background-color: transparent;',
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                id: gu.id('total_price'),
                style: 'color: #000000; font-weight: bold; font-size: 15px; margin: 5px;',
                text: '소모를 실행할 건을 선택하세요.'
            }]
        });

        buttonToolbar.insert(1, this.removeAction);

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        this.cartmapStore = Ext.create('Rfx2.store.company.hanjung.GoDirectExtraStore', {});

        this.addGoodsOutAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '소모자재추가',
            tooltip: '소모한 자재 추가',
            disabled: true,
            handler: function() {
                gm.me().addGoodsOut();
            }
        });

        this.removeGoodsOutAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '취소',
            tooltip: '소모한 자재 취소',
            disabled: true,
            handler: function() {
                Ext.MessageBox.show({
                    title:'확인',
                    msg: '취소 처리 하시겠습니까?<br/>취소 처리 된 자재는 총 재고에 반영 됩니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(result) {
                        if(result=='yes') {
                            var records = gm.me().gridViewTable.getSelectionModel().getSelection();
                            var cartmapArr = [];
                            var outQty = [];
                            var projectUid = gm.me().grid.getSelectionModel().getSelection()[0].get('ac_uid');

                            for (var i = 0; i < records.length; i++) {
                                cartmapArr.push(records[i].get('unique_uid'));
                                outQty.push(records[i].get('pr_quan'));
                            }

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=cancelExtDirect',
                                params:{
                                    projectUid: projectUid,
                                    cartmapArr: cartmapArr,
                                    outQty: outQty
                                },
                                success : function(result, request) {
                                    gm.me().cartmapStore.load();
                                },//endofsuccess
                                failure: extjsUtil.failureMessage
                            });//endofajax
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.gridViewTable = Ext.create('Ext.grid.Panel', {
            cls : 'rfx-panel',
            store: this.cartmapStore,
            multiSelect: false,
            region: 'center',
            autoScroll : true,
            selModel : Ext.create("Ext.selection.CheckboxModel", {mode : 'MUITI'}),
            autoHeight: true,
            border: true,
            padding: '5 0 0 0',
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
                listeners: {
                    edit : function ( e, context, eOpts ) {
                        switch(context.field) {
                            case 'pr_quan':
                                //값을 직접 넣는것이 아니라 차이값을 넣는다.
                                var originalValue = context.originalValue;
                                var value = context.value;
                                var diffOutQty = value - originalValue;
                                var cartmapUid = context.record.get('id');
                                var projectUid = context.record.get('ac_uid');

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/request.do?method=modifyGoDirect',
                                    params:{
                                        projectUid: projectUid,
                                        cartmapUid: cartmapUid,
                                        diffOutQty: diffOutQty
                                    },
                                    success : function(result, request) {
                                        if (goodsOutWin) {
                                            goodsOutWin.close();
                                            gm.me().cartmapStore.load();
                                        }
                                    },//endofsuccess
                                    failure: extjsUtil.failureMessage
                                });//endofajax

                                break;
                            default:
                                break;
                        }
                    }
                }
            },
            flex: 1,
            layout:'fit',
            forceFit: false,
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [this.addGoodsOutAction, this.removeGoodsOutAction, '->', buttonToolbar3]
                }
            ],
            columns: [
                {
                    text: '품번',
                    width: 110,
                    style: 'text-align:center',
                    dataIndex: 'item_code'
                },
                {
                    text: '품명',
                    width: 400,
                    style: 'text-align:center',
                    dataIndex: 'item_name'
                },
                {
                    text: '규격',
                    width: 240,
                    style: 'text-align:center',
                    dataIndex: 'specification'
                },
                {
                    text: '제조사',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'maker_name'
                },
                {
                    text: '단가',
                    width: 100,
                    style: 'text-align:center',
                    dataIndex: 'sales_price',
                    xtype: "numbercolumn",
                    format: "0,000",
                    align: 'right',
                },
                {
                    text: '소모수량',
                    width: 100,
                    style: 'text-align:center',
                    xtype: "numbercolumn",
                    format: "0,000",
                    dataIndex: 'pr_quan',
                    align: 'right',
                    renderer: function (value, meta) {
                        return Ext.util.Format.number(value, "0,000");
                    },
                },
                {
                    text: '가격',
                    width: 100,
                    style: 'text-align:center',
                    xtype: "numbercolumn",
                    format: "0,000",
                    dataIndex: 'consumePrice',
                    align: 'right',
                    renderer: function (value, meta) {
                        return Ext.util.Format.number(value, "0,000");
                    },
                },
                {
                    text: '사용일',
                    width: 100,
                    dataIndex: 'create_date',
                    style: 'text-align:center',
                    renderer : Ext.util.Format.dateRenderer('Y-m-d')
                }
            ]
        });



        this.grid.forceFit = true;

        Ext.apply(this, {
            layout: 'border',
            items: [{
                collapsible: false,
                frame: false,
                region: 'west',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                margin: '5 0 0 0',
                width: '35%',
                items: [{
                    region: 'west',
                    layout: 'fit',
                    margin: '0 0 0 0',
                    width: '100%',
                    items: [this.grid]
                }]
            }, this.gridViewTable]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

        this.grid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
               if(selections.length > 0) {
                   var selection = selections[0];
                   gm.me().addGoodsOutAction.enable();
                   gm.me().removeGoodsOutAction.enable();
                   gm.me().cartmapStore.getProxy().setExtraParam('ac_uid', selection.get('ac_uid'));
                  
                   gm.me().cartmapStore.load(function(records) {
                       if(records.length > 0) {
                        var total_price_sum = 0;
                        for (var i = 0; i < records.length; i++) {
                            var t_rec = records[i];
                            var total_price_sum = total_price_sum + t_rec.get('consumePrice');
                        }
                        console_logs('>>> price',total_price_sum)
                        buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' 원');
                       } else {
                        buttonToolbar3.items.items[1].update('총 금액 :  0 원');
                       }
                   });
               } else {
                   gm.me().addGoodsOutAction.disable();
                   gm.me().removeGoodsOutAction.disable();
               }
            }
        });
    },
    addGoodsOut: function() {

        this.stockStore = Ext.create('Rfx2.store.company.hanjung.StockLineSearchStore', {});

        this.goodsOutListStore = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [{
                name: 'item_code',
                type: 'string'
            }, {
                name: 'item_name',
                type: 'string'
            }, {
                name: 'specification',
                type: 'string'
            }, {
                name: 'stock_qty',
                type: 'string'
            }, {
                name: 'unique_id_long',
                type: 'number'
            }
            ]
        });

        this.stockGrid = Ext.create('Ext.grid.Panel', {
            title: '소모할 자재 검색',
            store: this.stockStore,
            height: 395,
            pageSize: 12,
            overflowY: 'hidden',
            selModel : Ext.create("Ext.selection.CheckboxModel", {}),
            layout: 'fit',
            columns: [
                {text: "품목코드", width: 80, style: 'text-align:center', dataIndex: 'item_code', sortable: true},
                {text: "품명", flex: 1, style: 'text-align:center', dataIndex: 'item_name', sortable: true},
                {text: "규격", width: 250, style: 'text-align:center', dataIndex: 'specification', sortable: true},
                {text: "총재고", width: 80, style: 'text-align:center',  dataIndex: 'stock_qty', sortable: true}
            ],
            multiSelect: false,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.stockStore,
                pageSize: 12,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {
                        this.getStore().getProxy().setExtraParam('start', (currentPage - 1) * this.pageSize);
                        this.getStore().getProxy().setExtraParam('page', currentPage);
                        this.getStore().getProxy().setExtraParam('limit', this.pageSize);
                    }
                }

            }),
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            width: 120,
                            field_id:  'search_item_code',
                            id: gu.id('search_item_code'),
                            name: 'search_item_code',
                            xtype: 'triggerfield',
                            emptyText: '품목코드',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners : {
                                specialkey : function(fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().redrawSearchStore();
                                        //srchSingleHandler (store, srchId, fieldObj, isWild);
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
                            width: 120,
                            field_id:  'search_item_name',
                            id: gu.id('search_item_name'),
                            name: 'search_item_name',
                            xtype: 'triggerfield',
                            emptyText: '품명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners : {
                                specialkey : function(fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().redrawSearchStore();
                                        //srchSingleHandler (store, srchId, fieldObj, isWild);
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
                            width: 120,
                            field_id:  'search_specification',
                            id: gu.id('search_specification'),
                            name: 'search_specification',
                            xtype: 'triggerfield',
                            emptyText: '규격',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners : {
                                specialkey : function(fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().redrawSearchStore();
                                        //srchSingleHandler (store, srchId, fieldObj, isWild);
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
                        // },
                        // {
                        //     width: 120,
                        //     field_id:  'search_model_no',
                        //     id: gu.id('search_model_no'),
                        //     name: 'search_model_no',
                        //     xtype: 'triggerfield',
                        //     emptyText: '재질',
                        //     trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        //     onTrigger1Click : function() {
                        //         this.setValue('');
                        //         gm.me().redrawSearchStore();
                        //     },
                        //     listeners : {
                        //         specialkey : function(fieldObj, e) {
                        //             if (e.getKey() == Ext.EventObject.ENTER) {
                        //                 gm.me().redrawSearchStore();
                        //             }
                        //         },
                        //         render: function(c) {
                        //             Ext.create('Ext.tip.ToolTip', {
                        //                 target: c.getEl(),
                        //                 html: c.emptyText
                        //             });
                        //         }
                        //     }
                        // },
                        {
                            width: 120,
                            field_id:  'search_supplier_name',
                            id: gu.id('search_supplier_name'),
                            name: 'search_supplier_name',
                            xtype: 'triggerfield',
                            emptyText: '공급사',
                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        }
                    ]
                }]
        });

        this.stockCartGrid = Ext.create('Ext.grid.Panel', {
            title: '소모할 자재 리스트',
            store: this.goodsOutListStore,
            height: 348,
            overflowY: 'auto',
            layout: 'fit',
            selModel : Ext.create("Ext.selection.CheckboxModel", {}),
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            columns: [
                {text: "품목코드", style: 'text-align:center',width: 80, dataIndex: 'item_code'},
                {text: "품명", style: 'text-align:center',flex: 1, dataIndex: 'item_name'},
                {text: "규격", style: 'text-align:center',width: 250, dataIndex: 'specification'},
                {text: "사용수량",
                    width: 80, dataIndex: 'stock_qty',
                    style: 'background-color:#0271BC;text-align:center',
                    css: 'edit-cell',
                    editor: 'numberfield',
                    renderer: function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    }
                }
            ],
            multiSelect: false,
            dockedItems: []
        });

        var goodsOutWin = Ext.create('Ext.Window', {
            modal: true,
            title: '소모자재추가',
            width: 950,
            height: 880,
            plain: true,
            overflowY: 'auto',
            items: [
                this.stockGrid,
                {
                    xtype: 'panel',
                    frame: false,
                    width: '100%',
                    autoHeight: true,
                    border: false,
                    layout : {
                        type : 'hbox',
                        pack : 'center'
                    },
                    items: [
                        {
                            xtype: 'button',
                            text : '▼',
                            width: 200,
                            margin: '5 5 5 5',
                            scale : 'large',
                            anchor: '50%',
                            listeners: {
                                click: function() {
                                    var selectedRec = gm.me().stockGrid.getSelectionModel().getSelection();
                                    var store = gm.me().goodsOutListStore;
                                    var includesSrcahd = false;

                                    for (var i = 0; i < selectedRec.length; i++) {
                                        if (!gm.me().srcahdArr.includes(selectedRec[i].get('unique_id_long'))) {
                                            store.insert(store.getCount(), new Ext.data.Record({
                                                'unique_id_long': selectedRec[i].get('unique_id_long'),
                                                'item_code': selectedRec[i].get('item_code'),
                                                'item_name': selectedRec[i].get('item_name'),
                                                'specification': selectedRec[i].get('specification'),
                                                'stock_qty': 1
                                            }));
                                            gm.me().srcahdArr.push(selectedRec[i].get('unique_id_long'));
                                        } else {
                                            includesSrcahd = true;
                                        }
                                    }

                                    if(includesSrcahd) {
                                        Ext.Msg.alert('', '중복으로 담은 자재는 제외됩니다.');
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text : '▲',
                            width: 200,
                            margin: '5 5 5 5',
                            scale : 'large',
                            anchor: '50%',
                            listeners: {
                                click: function() {
                                    var selectedRec = gm.me().stockCartGrid.getSelectionModel().getSelection();
                                    var store = gm.me().goodsOutListStore;

                                    for (var i = 0; i < selectedRec.length; i++) {
                                        store.removeAt(store.indexOf(selectedRec[i]));
                                        gm.me().removeItem(gm.me().srcahdArr, selectedRec[i].get('unique_id_long'));
                                    }
                                }
                            }
                        }
                    ]
                },
                this.stockCartGrid
            ],
            buttons: [
                {
                    text: '자재소모실행',
                    handler: function () {
                        Ext.MessageBox.show({
                            title:'확인',
                            msg: '자재를 소모 처리 하시겠습니까?<br/>기존에 소모 처리 한 자재는 반영이 되지 않습니다.',
                            buttons: Ext.MessageBox.YESNO,
                            fn: function(result) {
                                if(result=='yes') {

                                    var store = gm.me().goodsOutListStore;
                                    console_logs('store ???', store);
                                    var srcahdArr = [];
                                    var outQty = [];
                                    var projectUid = gm.me().grid.getSelectionModel().getSelection()[0].get('ac_uid');

                                    for (var i = 0; i < store.getCount(); i++) {
                                        srcahdArr.push(store.getAt(i).get('unique_id_long'));
                                        outQty.push(store.getAt(i).get('stock_qty'));
                                    }

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=addGoExtraDirect',
                                        params:{
                                            projectUid: projectUid,
                                            srcahdArr: srcahdArr,
                                            outQty: outQty
                                        },
                                        success : function(result, request) {
                                            if (goodsOutWin) {
                                                goodsOutWin.close();
                                                
                                                gm.me().cartmapStore.load(function(records) {
                                                    if(records.length > 0) {
                                                        var total_price_sum = 0;
                                                        for (var i = 0; i < records.length; i++) {
                                                            var t_rec = records[i];
                                                            var total_price_sum = total_price_sum + t_rec.get('consumePrice');
                                                        }
                                                        console_logs('>>> price',total_price_sum);
                                                        // buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' 원');
                                                    }
                                                });
                                                
                                            }
                                        },//endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });//endofajax
                                }
                            },
                            icon: Ext.MessageBox.QUESTION
                        });

                    }
                },
                {
                    text: '취소',
                    handler: function () {
                        if (goodsOutWin) {
                            goodsOutWin.close();
                        }
                    }
                }
            ]
        });

        goodsOutWin.show();
    },
    clearSearchStore : function() {
        var store = gm.me().stockStore;

        store.getProxy().setExtraParam('start', 0);
        store.getProxy().setExtraParam('page', 1);
        store.getProxy().setExtraParam('limit', 12);

        store.getProxy().setExtraParam('item_code', '');
        store.getProxy().setExtraParam('item_name', '');
        store.getProxy().setExtraParam('specification', '');
        store.getProxy().setExtraParam('model_no', '');
    },
    redrawSearchStore : function() {

        this.clearSearchStore();

        var store = gm.me().stockStore;

        var item_code = gu.getValue('search_item_code');
        var item_name = gu.getValue('search_item_name');
        var specification = gu.getValue('search_specification');
        var model_no = gu.getValue('search_model_no');
        var supplier_name = '';
        try {
            supplier_name = gu.getValue('search_supplier_name');
        } catch (error) {

        }

        console_logs('item_code', item_code);
        console_logs('item_name', item_name);
        console_logs('specification', specification);
        console_logs('model_no', model_no);

        var bIn = false;
        if(item_code.length>0) {
            store.getProxy().setExtraParam('item_code', '%' + item_code + '%');
            bIn = true;
        }

        if(item_name.length>0) {
            store.getProxy().setExtraParam('item_name', '%' + item_name + '%');
            bIn = true;
        }

        if(specification.length>0) {
            store.getProxy().setExtraParam('specification', '%' + specification + '%');
            bIn = true;
        }

        if(model_no.length>0) {
            store.getProxy().setExtraParam('model_no', '%' + model_no + '%');
            bIn = true;
        }

        if(supplier_name.length>0) {
            store.getProxy().setExtraParam('supplier_name', '%' + supplier_name + '%');
            bIn = true;
        } else {
            store.getProxy().setExtraParam('supplier_name', null);
        }

        store.getProxy().setExtraParam('limit', 12);

        if(bIn == true) {
            store.load();
        } else {
            store.removeAll();
        }
    },
    removeItem : function(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }
});