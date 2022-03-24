Ext.define('Rfx2.view.company.hanjung.stockMgmt.GoodsOutByProjectView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'goods-out-by-project-view',
    srcahdArr: [],
    initComponent: function () {

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
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: ['REGIST', 'EDIT', 'COPY', 'REMOVE']
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

        this.setRowClass(function (record, index) {
            var c = record.get('rcvr_name');
            switch (c) {
                case 'Y':
                    return 'green-row';
                    break;
                default:
                    break;
            }

        });

        //그리드 생성
        var arr = [];
        var assymap_uid = 0;
        var status = '';
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        this.presentBomStore = Ext.create('Rfx2.store.company.hanjung.PresentBomStore', {
        });

        this.extraOutStore = Ext.create('Rfx2.store.company.hanjung.ExtraOutStore', {
        });

        this.cartmapStore = Ext.create('Rfx2.store.company.hanjung.GoDirectStore', {});

        this.addGoodsOutAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '소모자재추가',
            tooltip: '소모한 자재 추가',
            disabled: true,
            handler: function () {
                gm.me().addGoodsOut();
            }
        });

        this.removeGoodsOutAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '취소',
            tooltip: '소모한 자재 취소',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '취소 처리 하시겠습니까?<br/>취소 처리 된 자재는 총 재고에 반영 됩니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {

                            gm.setCenterLoading(true);

                            var records = gm.me().gridViewTable.getSelectionModel().getSelection();
                            var cartmapArr = [];
                            var outQty = [];
                            var projectUid = gm.me().grid.getSelectionModel().getSelection()[0].get('ac_uid');

                            for (var i = 0; i < records.length; i++) {
                                cartmapArr.push(records[i].get('unique_uid'));
                                outQty.push(records[i].get('gr_quan'));
                            }

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=cancelDirect',
                                params: {
                                    projectUid: projectUid,
                                    cartmapArr: cartmapArr,
                                    outQty: outQty
                                },
                                success: function (result, request) {
                                    gm.setCenterLoading(false);
                                    Ext.MessageBox.alert('알림', '불출취소 완료 되었습니다.');
                                    gm.me().presentBomStore.load();
                                    gm.me().store.load();

                                },//endofsuccess
                                failure: function (result, request) {
                                    gm.setCenterLoading(false);
                                    Ext.MessageBox.alert('알림', '불출취소 실패하였습니다.');
                                }
                                // success: function (result, request) {
                                //     gm.me().cartmapStore.load();
                                // },//endofsuccess
                                //failure: extjsUtil.failureMessage
                            });//endofajax
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.progressGoodOutAction = Ext.create('Ext.Action', {
            iconCls: 'af-external-link',
            text: '자재소모 실행',
            tooltip: '자재소모 실행',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '자재를 소모 처리 하시겠습니까?<br/>기존에 소모 처리 한 자재는 반영이 되지 않으며 자재비용도 계산되지 않습니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {

                            gm.setCenterLoading(true);

                            var records = gm.me().gridViewTable.getSelectionModel().getSelection();
                            var srcahdArr = [];
                            var presentQty = [];
                            var outQty = [];
                            var assymapArr = [];
                            var excessItem = [];
                            var excceedItemNameArr = [];
                            var excceedItemCodeArr = [];
                            var exceeedQty = [];
                            var projectUid = gm.me().grid.getSelectionModel().getSelection()[0].get('ac_uid');
                            var assytopUid = gm.me().grid.getSelectionModel().getSelection()[0].get('unique_uid');
                            var isExceedQuan = false;
                            var desc_code = '';
                            var desc_name = '';
                            var excessQty;
                            for (var i = 0; i < records.length; i++) {
                                if (records[i].get('bm_quan') > records[i].get('stock_qty')
                                    && records[i].get('standard_flag') !== 'A') {
                                    isExceedQuan = true;
                                    desc_code = records[i].get('item_code');
                                    desc_name = records[i].get('item_name');
                                    excessQty = records[i].get('bm_quan') - records[i].get('stock_qty');
                                    excceedItemNameArr.push(desc_name);
                                    excceedItemCodeArr.push(desc_code);
                                    exceeedQty.push(excessQty);
                                    //break;
                                }

                                // ASSY는 처리하지 않는다
                                if (records[i].get('standard_flag') !== 'A') {
                                    srcahdArr.push(records[i].get('unique_id'));
                                    presentQty.push(records[i].get('stock_qty'));
                                    outQty.push(records[i].get('bm_quan'));
                                    assymapArr.push(records[i].get('unique_uid'));


                                    console_logs('>>>>>>>>>>>>>>>> LENGTH >>>>>>>>>>', srcahdArr.length);
                                }
                            }
                            if (!isExceedQuan) {
                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/request.do?method=consumeMaterial',
                                    params: {
                                        projectUid: projectUid,
                                        srcahdArr: srcahdArr,
                                        presentQty: presentQty,
                                        outQty: outQty,
                                        assymapArr: assymapArr,
                                        assytopUid: assytopUid
                                    },
                                    success: function (result, request) {
                                        gm.setCenterLoading(false);
                                        Ext.MessageBox.alert('알림', '소모처리 완료 되었습니다.');
                                        gm.me().gridViewTable.getSelectionModel().deselectAll();
                                        gm.me().presentBomStore.load();
                                        gm.me().store.load();

                                    },//endofsuccess
                                    failure: function (result, request) {
                                        gm.setCenterLoading(false);
                                        Ext.MessageBox.alert('알림', '소모처리 완료 실패하였습니다.');
                                    }
                                });//endofajax
                            } else {
                                gm.setCenterLoading(false);
                                console_logs('>>>>>> item_name', excceedItemNameArr);
                                console_logs('>>>>>> item_code', excceedItemCodeArr);
                                var name = '';
                                for (var j = 0; j < excceedItemNameArr.length; j++) {
                                    name = name + '&nbsp* (' + excceedItemCodeArr[j] + ')&nbsp' + excceedItemNameArr[j] + '&nbsp<b>' + gUtil.renderNumber(exceeedQty[j]) + '개 초과</b><br>';
                                }

                                Ext.MessageBox.show({
                                    title: '자재초과',
                                    icon: Ext.MessageBox['WARNING'],
                                    msg: '재고를 초과하는 소모 요청량이 있습니다.<br>그래도 진행하시겠습니까?<br><font color=red><b>초과자재&nbsp' + excceedItemNameArr.length + '건</b><br>' + name,
                                    buttons: Ext.MessageBox.YESNO,
                                    width: 450,
                                    fn: function (result) {
                                        if (result == 'yes') {
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/purchase/request.do?method=consumeMaterial',
                                                params: {
                                                    projectUid: projectUid,
                                                    srcahdArr: srcahdArr,
                                                    presentQty: presentQty,
                                                    outQty: outQty,
                                                    assymapArr: assymapArr,
                                                    assytopUid: assytopUid
                                                },
                                                success: function (result, request) {
                                                    gm.setCenterLoading(false);
                                                    Ext.MessageBox.alert('알림', '소모처리 완료 되었습니다.');
                                                    gm.me().gridViewTable.getSelectionModel().deselectAll();
                                                    gm.me().presentBomStore.load();
                                                    gm.me().store.load();
            
                                                },//endofsuccess
                                                failure: function (result, request) {
                                                    gm.setCenterLoading(false);
                                                    Ext.MessageBox.alert('알림', '소모처리 완료 실패하였습니다.');
                                                }
                                            });//endofajax
                                        }
                                    }
                                })
                            }
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.gridViewTable = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: this.presentBomStore,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            selModel: Ext.create("Ext.selection.CheckboxModel", { mode: 'multi' }),
            autoHeight: true,
            border: true,
            padding: '5 0 0 0',
            viewConfig: {
                getRowClass: function (record, index) {
                    var c = record.get('reserved_integer1');
                    var bm_quan = record.get('bm_quan');
                    var gr_quan = record.get('gr_quan');
                    if (c == '1') {
                        var standard_flag = record.get('standard_flag');
                        if (standard_flag == 'R') {
                            return 'green-row';
                        } else {
                            return 'yellow-row';
                        }
                    }
                    if(bm_quan == gr_quan) {
                        if (c == '1') {
                            var standard_flag = record.get('standard_flag');
                            if (standard_flag == 'R') {
                                return 'blue-row';
                            }
                        } else {
                            return 'blue-row';
                        }
                    }
                }
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1,
                listeners: {
                    edit: function (e, context, eOpts) {
                        switch (context.field) {
                            default:
                                break;
                        }
                    }
                }
            },
            flex: 6,
            layout: 'fit',
            forceFit: false,
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [this.progressGoodOutAction, this.removeGoodsOutAction, '->', buttonToolbar3]
                }
            ],
            listeners: {
                cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if(eOpts.ctrlKey && eOpts.keyCode === 67) {
                        var tempTextArea = document.createElement("textarea");
                        document.body.appendChild(tempTextArea);
                        tempTextArea.value = eOpts.target.innerText;
                        tempTextArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempTextArea);
                    }
                }
            },
            columns: [
                {
                    text: '',
                    width: 49,
                    dataIndex: '',
                    style: 'text-align:center',
                    align: 'right',
                    renderer: function (value, meta, record, rowIndex) {
                        var standard_flag = record.get('standard_flag');
                        var reserved_integer1 = record.get('reserved_integer1');

                        if (standard_flag === 'A') {
                            return '───';
                        }

                        if (reserved_integer1 === 1) {
                            return '───';
                        } else {
                            return '&nbsp;&nbsp;└─';
                        }
                    }
                },
                {
                    text: '',
                    width: 20,
                    dataIndex: 'reserved_integer1',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '구분',
                    width: 50,
                    dataIndex: 'standard_flag_kr',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '품번',
                    width: 90,
                    dataIndex: 'item_code',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '품명',
                    width: 180,
                    dataIndex: 'item_name',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '규격',
                    width: 180,
                    dataIndex: 'specification',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '제조사',
                    width: 100,
                    dataIndex: 'maker_name',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '공급사',
                    width: 100,
                    dataIndex: 'seller_name',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '소모수량',
                    width: 80,
                    dataIndex: 'bm_quan',
                    id: gu.id('bm_quan_value'),
                    style: 'text-align:center; background-color:#0271BC;',
                    css: 'edit-cell',
                    editor: {
                        validator: function (value) {
                            if (/[^0-9.]/g.test(value)) {
                                value = value.replace(/[^0-9.]/g, '');
                            }
                            this.setValue(value);
                            return true;
                        }
                    },
                    align: 'right',
                    renderer: function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, "0.##");
                    }
                },
                {
                    text: '처리완료수량',
                    width: 100,
                    dataIndex: 'gr_quan',
                    //xtype: "numbercolumn",
                    style: 'text-align:center',
                    renderer: function (value, meta) {
                        return Ext.util.Format.number(value, "0,000.##");
                    },
                    align: 'right'
                },
                {
                    text: '재고수량',
                    width: 80,
                    dataIndex: 'stock_qty',
                    id: gu.id('stoqty_value'),
                    //xtype: "numbercolumn",
                    format: "0,000",
                    style: 'text-align:center',
                    align: 'right',
                    renderer: function (value, meta, record, rowIndex) {
                        var standard_flag = record.get('standard_flag');

                        if (standard_flag === 'A') {
                            return '-';
                        }

                        if (value <= 0) {
                            meta.style = "background-color:#d63031;color:#ffffff;text-align:right;text-format:0,000";
                        }
                        value = Ext.util.Format.number(value, '0,000.##');
                        return value;
                    },
                },
                {
                    text: '단가',
                    width: 100,
                    dataIndex: 'sales_price',
                    xtype: "numbercolumn",
                    format: "0,000",
                    style: 'text-align:center',
                    align: 'right'
                },

                // {
                //     text: '사용일',
                //     width: 100,
                //     dataIndex: 'create_date',
                //     align : 'center',
                //     renderer : Ext.util.Format.dateRenderer('Y-m-d')
                // }
            ]
        });


        this.gridViewTable.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    console_logs('rec', selections);
                    if (status != 'Y') {
                        gm.me().progressGoodOutAction.enable();
                        gm.me().removeGoodsOutAction.enable();
                    } else {
                        gm.me().progressGoodOutAction.disable();
                        gm.me().progressGoodOutAction.disable();
                    }
                }
            }
        });


        this.gridViewTableAdd = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            store: this.extraOutStore,
            multiSelect: false,
            region: 'south',
            autoScroll: true,
            // selModel: Ext.create("Ext.selection.CheckboxModel", { mode: 'multi' }),
            autoHeight: true,
            border: true,
            padding: '5 0 0 0',
            flex: 3.5,
            title : '추가자재 불출현황',
            layout: 'fit',
            forceFit: true,
            columns: [
                {
                    text: '품번',
                    width: 80,
                    dataIndex: 'item_code',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '품명',
                    width: 80,
                    dataIndex: 'item_name',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '규격',
                    width: 90,
                    dataIndex: 'specification',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '제조사',
                    width: 80,
                    dataIndex: 'maker_name',
                    style: 'text-align:center',
                    align: 'left'
                },
                {
                    text: '소모수량',
                    width: 80,
                    xtype: "numbercolumn",
                    format: "0,000",
                    dataIndex: 'quan',
                    style: 'text-align:center',
                    align: 'right',
                },
                {
                    text: '단가',
                    width: 80,
                    xtype: "numbercolumn",
                    format: "0,000",
                    dataIndex: 'static_sales_price',
                    style: 'text-align:center',
                    align: 'right',
                },
                {
                    text: '금액',
                    width: 80,
                    xtype: "numbercolumn",
                    format: "0,000",
                    dataIndex: 'releasePrice',
                    style: 'text-align:center',
                    align: 'right',
                },
                {
                    text: '사용일자',
                    width: 80,
                    dataIndex: 'reserved_timestamp1',
                    style: 'text-align:center',
                    align: 'left',
                    renderer : Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: '사유',
                    width: 160,
                    dataIndex: 'out_cause',
                    style: 'text-align:center',
                    align: 'left'
                },
                // {
                //     text: '등록자',
                //     width: 70,
                //     dataIndex: 'creator',
                //     style: 'text-align:center',
                //     align: 'left'
                // }
            ]
        });

        this.grid.forceFit = true;
        this.gridViewTableAdd.forceFit = true;

        Ext.apply(this, {
            layout: 'border',
            items: [{
                //title: '제품 및 템플릿 선택',
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
                height : '50%',
                items: [{
                    region: 'west',
                    layout: 'fit',
                    margin: '0 0 0 0',
                    flex : 1,
                    width: '100%',
                    items: [this.grid ]
                }]
            }, this.gridViewTable, this.gridViewTableAdd]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections.length > 0) {
                    var selection = selections[0];
                    gm.me().presentBomStore.getProxy().setExtraParam('reserved_integer2', selection.get('unique_uid'));
                    gm.me().presentBomStore.getProxy().setExtraParam('standard_flag_list', 'R,A');
                    gm.me().presentBomStore.getProxy().setExtraParam('ac_uid', selection.get('ac_uid'));
                    assymap_uid = selection.get('unique_uid');
                    var rec = selections[0];
                    status = rec.get('rcvr_name');
                    //gm.me().presentBomStore.load();
                    gm.me().presentBomStore.load(function (records) {
                        if (records.length > 0) {
                            var total_price_sum = 0;
                            for (var i = 0; i < records.length; i++) {
                                var t_rec = records[i];

                                if (t_rec.get('reserved_integer1') === 1) {
                                    var quan = t_rec.get('bm_quan');
                                    var sales_price = t_rec.get('sales_price');
                                    var total_price = sales_price * quan;
                                    total_price_sum += total_price;
                                }
                            }
                            buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' 원');
                        }

                    });

                    gm.me().extraOutStore.getProxy().setExtraParam('ac_uid', selection.get('ac_uid'));
                    gm.me().extraOutStore.load();
                } else {
                    // gm.me().progressGoodOutAction.disable();
                    // gm.me().addGoodsOutAction.disable();
                    // gm.me().removeGoodsOutAction.disable();
                }
            }
        });
    },


    addGoodsOut: function () {
        this.stockStore = Ext.create('Rfx2.store.company.hanjung.StockLineStore', {});
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
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            layout: 'fit',
            columns: [
                { text: "품목코드", width: 80, dataIndex: 'item_code', sortable: true },
                { text: "품명", flex: 1, dataIndex: 'item_name', sortable: true },
                { text: "규격", width: 250, dataIndex: 'specification', sortable: true },
                { text: "총재고", width: 80, dataIndex: 'stock_qty', sortable: true }
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
                            field_id: 'search_item_code',
                            id: gu.id('search_item_code'),
                            name: 'search_item_code',
                            xtype: 'triggerfield',
                            emptyText: '품목코드',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners: {
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().redrawSearchStore();
                                        //srchSingleHandler (store, srchId, fieldObj, isWild);
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
                            width: 120,
                            field_id: 'search_item_name',
                            id: gu.id('search_item_name'),
                            name: 'search_item_name',
                            xtype: 'triggerfield',
                            emptyText: '품명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners: {
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().redrawSearchStore();
                                        //srchSingleHandler (store, srchId, fieldObj, isWild);
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
                            width: 120,
                            field_id: 'search_specification',
                            id: gu.id('search_specification'),
                            name: 'search_specification',
                            xtype: 'triggerfield',
                            emptyText: '규격',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners: {
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().redrawSearchStore();
                                        //srchSingleHandler (store, srchId, fieldObj, isWild);
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
                            width: 120,
                            field_id: 'search_model_no',
                            id: gu.id('search_model_no'),
                            name: 'search_model_no',
                            xtype: 'triggerfield',
                            emptyText: '재질',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners: {
                                specialkey: function (fieldObj, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        gm.me().redrawSearchStore();
                                    }
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        }, {
                            width: 120,
                            field_id: 'search_supplier_name',
                            id: gu.id('search_supplier_name'),
                            name: 'search_supplier_name',
                            xtype: 'triggerfield',
                            emptyText: '공급사',
                            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function (c) {
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
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            columns: [
                { text: "품목코드", width: 80, dataIndex: 'item_code' },
                { text: "품명", flex: 1, dataIndex: 'item_name' },
                { text: "규격", width: 250, dataIndex: 'specification' },
                {
                    text: "사용수량",
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
                    layout: {
                        type: 'hbox',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: '▼',
                            width: 200,
                            margin: '5 5 5 5',
                            scale: 'large',
                            anchor: '50%',
                            listeners: {
                                click: function () {
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

                                    if (includesSrcahd) {
                                        Ext.Msg.alert('', '중복으로 담은 자재는 제외됩니다.');
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: '▲',
                            width: 200,
                            margin: '5 5 5 5',
                            scale: 'large',
                            anchor: '50%',
                            listeners: {
                                click: function () {
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
                            title: '확인',
                            msg: '자재를 소모 처리 하시겠습니까?<br/>기존에 소모 처리 한 자재는 반영이 되지 않습니다.',
                            buttons: Ext.MessageBox.YESNO,
                            fn: function (result) {
                                if (result == 'yes') {

                                    //var store = gm.me().goodsOutListStore;

                                    var srcahdArr = [];
                                    var outQty = [];
                                    var assymapArr = [];
                                    var projectUid = gm.me().grid.getSelectionModel().getSelection()[0].get('ac_uid');
                                    var selections = gm.me().stockCartGrid.getSelectionModel().getSelection();

                                    for (var i = 0; i < selections.length; i++) {
                                        srcahdArr.push(selections[i].get('unique_id_long'));
                                        outQty.push(selections[i].get('stock_qty'));
                                        assymapArr.push(selections[i].get('unique_uid'));
                                    }

                                    // for (var i = 0; i < store.getCount(); i++) {
                                    //     srcahdArr.push(store.getAt(i).get('unique_id_long'));
                                    //     outQty.push(store.getAt(i).get('stock_qty'));
                                    //     assymapArr.push(store.getAt(i).get('unique_uid'));
                                    // }

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=addGoDirect',
                                        params: {
                                            projectUid: projectUid,
                                            srcahdArr: srcahdArr,
                                            outQty: outQty,
                                            assymapArr: assymapArr
                                        },
                                        success: function (result, request) {
                                            if (goodsOutWin) {
                                                goodsOutWin.close();
                                                gm.me().cartmapStore.load();
                                                gm.me().store.load();
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
    clearSearchStore: function () {
        var store = gm.me().stockStore;

        store.getProxy().setExtraParam('start', 0);
        store.getProxy().setExtraParam('page', 1);
        store.getProxy().setExtraParam('limit', 12);

        store.getProxy().setExtraParam('item_code', '');
        store.getProxy().setExtraParam('item_name', '');
        store.getProxy().setExtraParam('specification', '');
        store.getProxy().setExtraParam('model_no', '');
    },
    redrawSearchStore: function () {

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
        if (item_code.length > 0) {
            store.getProxy().setExtraParam('item_code', '%' + item_code + '%');
            bIn = true;
        }

        if (item_name.length > 0) {
            store.getProxy().setExtraParam('item_name', '%' + item_name + '%');
            bIn = true;
        }

        if (specification.length > 0) {
            store.getProxy().setExtraParam('specification', '%' + specification + '%');
            bIn = true;
        }

        if (model_no.length > 0) {
            store.getProxy().setExtraParam('model_no', '%' + model_no + '%');
            bIn = true;
        }

        if (supplier_name.length > 0) {
            store.getProxy().setExtraParam('supplier_name', '%' + supplier_name + '%');
            bIn = true;
        } else {
            store.getProxy().setExtraParam('supplier_name', null);
        }

        store.getProxy().setExtraParam('limit', 12);

        if (bIn == true) {
            store.load();
        } else {
            store.removeAll();
        }
    },
    removeItem: function (arr) {
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