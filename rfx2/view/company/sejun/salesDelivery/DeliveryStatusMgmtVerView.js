//생산완료 현황
Ext.define('Rfx2.view.company.sejun.salesDelivery.DeliveryStatusMgmtVerView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'delivery-pending-view',
    inputBuyer: null,
    preValue: 0,
    initComponent: function () {
        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = false;
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');

        this.addSearchField({
            type: 'text',
            field_id: 'po_no',
            emptyText: '거래명세서번호'
        });

        this.addSearchField({
            type: 'text',
            field_id: 'wa_name',
            emptyText: '고객명'
        });




        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            switch (index) {
                case 1: case 2: case 3: case 4: case 5:
                    buttonToolbar.items.remove(item);
                    break;
                default:
                    break;
            }
        });

        this.createStore('Rfx2.model.DeliveryDl', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            gm.pageSize
            , {
                creator: 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['combst']
        );

        var arr = [];
        arr.push(buttonToolbar);

        this.printDl = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '거래명세서',
            tooltip: '거래명세서 출력을 합니다.',
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var rtgastUid = rec.get('unique_id_long');
                var rtgastAdUid = rec.get('rtgast_ad_uid');
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printDl',
                    params: {
                        rtgast_uid: rtgastUid,

                        is_rotate: 'N',
                    },
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        console_log(pdfPath);
                        if (pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                            top.location.href = url;
                        }
                        // gm.me().pdfDownload(size, reportSelection, ++pos);
                    },
                    failure: function (result, request) {
                        // var result = result.responseText;
                        // Ext.MessageBox.alert('알림', result);
                    }
                });
                // }

            }
        });

        buttonToolbar.insert(1, this.printDl);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);



        this.poPrdDetailSumStore = Ext.create('Rfx2.store.DeliveryStateStore', { srch_type: "Y" });
        this.poPrdDetailStore = Ext.create('Rfx2.store.DeliveryStateStore', {});

        this.gridContractCompany = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridContractCompany'),
            store: this.poPrdDetailSumStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,
            // bbar: Ext.create('Ext.PagingToolbar', {
            //     store: this.poPrdDetailStore,
            //     displayInfo: true,
            //     displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
            //     emptyMsg: "표시할 항목이 없습니다.",
            //     listeners: {
            //         beforechange: function (page, currentPage) {
            //             this.getStore().getProxy().setExtraParam('start', (currentPage - 1) * 100);
            //             this.getStore().getProxy().setExtraParam('page', currentPage);
            //             this.getStore().getProxy().setExtraParam('limit', 100);
            //         }
            //     }
            // }),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',

            columns: [
                { text: '수주번호', width: 100, style: 'text-align:center', dataIndex: 'order_number'/*, sortable: false*/ },

                { text: this.getMC('msg_order_grid_prd_name', '품번'), width: 100, style: 'text-align:center', dataIndex: 'srcahd_item_code'/*, sortable: false*/ },
                { text: this.getMC('msg_order_grid_prd_name', '품명'), width: 250, style: 'text-align:center', dataIndex: 'srcahd_item_name'/*, sortable: false*/ },

                {
                    text: this.getMC('msg_order_grid_prd_unitprice', '단가'),
                    width: 80, style: 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex: 'sales_price'/*, sortable: false*/,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'sales_price') {
                            context.record.set('sales_price', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    }
                },
                {
                    text: this.getMC('msg_order_grid_prd_unitprice', '수주수량'),
                    width: 100, style: 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex: 'po_qty'/*, sortable: false*/,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'po_qty') {
                            context.record.set('po_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_order_grid_prd_unitprice', '출고수량'),
                    width: 100,
                    style: 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex: 'gr_qty'/*, sortable: false*/,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'gr_qty') {
                            context.record.set('gr_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                {
                    text: this.getMC('msg_order_grid_prd_unitprice', '잔여수량'),
                    width: 100,
                    style: 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex: 'remain_qty'/*, sortable: false*/,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'remain_qty') {
                            context.record.set('remain_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                }
            ],
            title: this.getMC('mes_reg_prd_info_msg', '거래명세서 상세내역'),
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                },
                cellkeydown: function (td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if (eOpts.ctrlKey && eOpts.keyCode === 67) {
                        var tempTextArea = document.createElement("textarea");
                        document.body.appendChild(tempTextArea);
                        tempTextArea.value = eOpts.target.innerText;
                        tempTextArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempTextArea);
                    }
                },
                celldblclick: function (view, td, col_idx, record, tr, row_idx) {

                    console_logs('row_idx   :  ', row_idx);
                    var dataIndex = this.columns[col_idx - 1].dataIndex;
                    console_logs('celldblclick dataIndex   :  ', dataIndex);

                    var varcharb = record.get('reserved_varcharb');
                    console_logs('varcharb   :  ', varcharb);

                    gm.me().showDetailContent(varcharb);



                },
            }
        });



        this.gridSledelList = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('gridSledelList'),
            store: this.poPrdDetailStore,
            viewConfig: {
                markDirty: false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            flex: 0.5,
            frame: true,

            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            margin: '0 0 0 0',

            columns: [
                { text: this.getMC('msg_order_grid_prd_name', '품명'), width: 200, style: 'text-align:center', dataIndex: 'srcahd_item_name'/*, sortable: false*/ },
                { text: this.getMC('msg_order_grid_prd_name', '품번'), width: 100, style: 'text-align:center', dataIndex: 'srcahd_item_code'/*, sortable: false*/ },
                {
                    text: this.getMC('msg_order_grid_prd_unitprice', '출고수량'),
                    width: 100,
                    style: 'text-align:center',
                    decimalPrecision: 5,
                    dataIndex: 'gr_qty'/*, sortable: false*/,
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'gr_qty') {
                            context.record.set('gr_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        if (value == null || value.length < 1) {
                            value = 0;
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    },
                },
                { text: this.getMC('msg_order_grid_prd_name', '일부인'), width: 200, style: 'text-align:center', dataIndex: 'exp_date'/*, sortable: false*/ },
                { text: this.getMC('msg_order_grid_prd_name', 'PALLET'), width: 200, style: 'text-align:center', dataIndex: 'stock_pos'/*, sortable: false*/ },
                { text: this.getMC('msg_order_grid_prd_name', '출고일자'), width: 200, style: 'text-align:center', dataIndex: 'create_date_str'/*, sortable: false*/ },

            ],
            name: 'po',
            autoScroll: true,
            listeners: {
            }
        });



        Ext.each(this.gridContractCompany.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'ap_Wquan':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
                case 'reserved16':
                    columnObj["style"] = 'background-color:#0271BC;text-align:center';
                    columnObj["css"] = 'edit-cell';
                    break;
            }

            switch (dataIndex) {
                case 'ap_Wquan':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    };
                    break;
                case 'ap_quan':
                case 'stock_qty':
                case 'stock_qty_safe':
                case 'stock_qty_useful':
                case 'total_out_qty':
                case 'wh_qty':
                case 'remain_qty':
                case 'bm_quan':
                    columnObj["renderer"] = function (value, meta) {
                        return Ext.util.Format.number(value, '0,00/i');
                    };
                    break;
                case 'reserved_timestamp1_str':
                    columnObj["renderer"] = function (value, meta) {
                        return value;
                    };
                    break;
                case 'reserved1':
                    columnObj["renderer"] = function (value, meta) {
                        return value;
                    };
                    break;
                case 'reserved2':
                    columnObj["renderer"] = function (value, meta) {

                        return value;
                    };
                    break;
                case 'payment_condition':
                    columnObj["renderer"] = function (value, meta) {
                        return value;
                    };
                    break;
                case 'reserved16':
                    columnObj["renderer"] = function (value, meta) {
                        if (meta != null) {
                            meta.css = 'custom-column';
                        }
                        return value;
                    };
                    break;
                default:
                    break;
            }

        });

        this.gridContractCompany.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                var rec = selections[0]
                if (selections.length > 0) {
                    gm.me().poPrdDetailStore.getProxy().setExtraParam('dl_uid', rec.get('dl_uid'));
                    gm.me().poPrdDetailStore.getProxy().setExtraParam('item_code', rec.get('item_code'));
                    console.log('unique_id : ', rec);
                    console.log('unique_id : ', rec.get('unique_id_long'));
                    console.log('item_code : ', rec.get('item_code'));
                } else {

                }
            }
        });

        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
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
                    width: '30%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, this.gridContractCompany
            ]
        });

        //버튼 추가.

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (this.crudMode == 'EDIT') { // EDIT

            } else {// CREATE,COPY
                this.copyCallback();
            }

            gUtil.disable(gMain.selPanel.removeAction);
            gUtil.disable(gMain.selPanel.modifyAction);
            if (selections.length) {
                console_logs('>>>> selections', selections);
                var rec = selections[0];
                var status = rec.get('status');
                //gm.me().addPoPrdPlus.enable();
                gm.me().vSELECTED_ASSYMAP_UID = rec.get('unique_uid');
                gm.me().vSELECTED_AC_UID = rec.get('ac_uid');
                gUtil.enable(gMain.selPanel.printDl);
                // gUtil.enable(gMain.selPanel.editPoAction);
                // gUtil.enable(gMain.selPanel.removeAction);
                // gUtil.disable(gMain.selPanel.modifyAction);
                // gUtil.enable(gMain.selPanel.fileattachAction);
                // gm.me().cartGoReq.enable();
                // gUtil.enable(gMain.selPanel.cartGoReq);
                // var rec = selections[0];
                // gm.me().cartGoReq.enable();
                this.poPrdDetailSumStore.getProxy().setExtraParam('dl_uid', rec.get('unique_id_long'));
                this.poPrdDetailSumStore.load();
            } else {
                gUtil.disable(gMain.selPanel.printDl);
            }


        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('having_not_status', 'BM,P0,DC');
        this.store.getProxy().setExtraParam('not_pj_type', 'OU');
        this.store.getProxy().setExtraParam('multi_prd', true);
        this.store.load(function (records) {
        });






    },


    showDetailContent: function (varcharb) {

        var varcharbEnter = varcharb.replace(/(?:\r\n|\r|\n)/g, '<br />');
        console.log("탑니다.");
        gm.me().poPrdDetailStore.load();
        var win = Ext.create('ModalWindow', {
            title: '상세목록',
            width: 1000,
            height: 500,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            closable:false,
            items: [
                // {
                //     //xtype: 'component',
                //     xtype: 'grid',
                //     store: gm.me().poPrdDetailStore,
                //     columns: [
                //         { text: '품명', width: 300, style: 'text-align:center', dataIndex: 'srcahd_item_name'/*, sortable: false*/ },
                //         { text: '일부인', width: 200, style: 'text-align:center', dataIndex: 'srcahd_item_name'/*, sortable: false*/ },
                //         { text: 'PALLET', width: 200, style: 'text-align:center', dataIndex: 'order_number'/*, sortable: false*/ },
                //         { text: '출고수량', width: 100, style: 'text-align:center', dataIndex: 'gr_qty'/*, sortable: false*/ },
                //         { text: '출고일자', width: 200, style: 'text-align:center', dataIndex: 'create_date_str'/*, sortable: false*/ },
                //     ]
                // },
                gm.me().gridSledelList
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (win) { win.hide(); }
                }
            }]


        });
        win.show(/* this, function(){} */);
    },



});

