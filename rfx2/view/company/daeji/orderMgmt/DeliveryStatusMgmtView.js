//생산완료 현황
Ext.define('Rfx2.view.company.daeji.orderMgmt.DeliveryStatusMgmtView', {
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
            emptyText: '납품서번호'
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
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
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
            text: '납품서 출력',
            tooltip: '납품서 출력을 합니다.',
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var rtgastUid = rec.get('unique_id_long');
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

        this.deleteAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: this.getMC('msg_btn_prd_add', '삭제'),
            disabled: true,
            handler: function () {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '선택한 납품서 삭제 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        if (btn == "yes") {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales/delivery.do?method=deleteDeliveryNote',
                                params: {
                                    unique_id: rec.get('unique_id_long'),
                                    po_no: rec.get('po_no')
                                },
                                success: function (result, request) {
                                    var result_txt = result.responseText;
                                    console_logs('>>>> result ???', result.responseText);
                                    if (result_txt === 'true') {
                                        Ext.MessageBox.alert('알림', '선택한 납품서 삭제되었습니다.');
                                        gm.me().store.load();
                                    } else {
                                        Ext.MessageBox.alert('알림', '선택한 납품서 삭제취소되었습니다.');
                                        gm.me().store.load();
                                    }
                                }, // endofsuccess
                                failure: extjsUtil.failureMessage
                            });
                            return;
                        }
                    }
                });

            }
        });

        if (this.flag1 === 'Y') {
            buttonToolbar.insert(1, this.deleteAction);
            buttonToolbar.insert(2, this.printDl);
        } else {
            buttonToolbar.insert(1, this.printDl);
        }

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        arr.push(searchToolbar);

        this.poPrdDetailStore = Ext.create('Rfx2.store.DeliveryStateStore', {});

        if (this.flag1 === 'Y') {
            this.gridContractCompany = Ext.create('Ext.grid.Panel', {
                cls: 'rfx-panel',
                id: gu.id('gridContractCompany'),
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
                // dockedItems: [
                //     {
                //         dock: 'top',
                //         xtype: 'toolbar',
                //         items: [
                //             this.purListSrch,
                //             // this.assignShipmentAction,
                //             // this.addMyCart,
                //             // this.cartGoReq
                //         ]
                //     },
                //     {
                //         dock: 'top',
                //         xtype: 'toolbar',
                //         cls: 'my-x-toolbar-default1',
                //         items: [{
                //             xtype: 'triggerfield',
                //             emptyText: '제품명',
                //             id: gu.id('item_name'),
                //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                //             name: 'item_name',
                //             listeners: {
                //                 specialkey: function (field, e) {
                //                     if (e.getKey() == Ext.EventObject.ENTER) {
                //                         gm.me().poPrdDetailStore.getProxy().setExtraParam('item_name', '%' + gu.getCmp('item_name').getValue() + '%');
                //                         gm.me().poPrdDetailStore.load(function () { });
                //                     }
                //                 }
                //             },
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             'onTrigger1Click': function () {
                //                 gu.getCmp('item_name').setValue('');
                //                 gm.me().poPrdDetailStore.getProxy().setExtraParam('item_name', gu.getCmp('item_name').getValue());
                //                 gm.me().poPrdDetailStore.load(function () { });
                //             }
                //         }, {
                //             xtype: 'triggerfield',
                //             emptyText: '최종고객사',
                //             id: gu.id('final_wa_name'),
                //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                //             name: 'final_wa_name',
                //             listeners: {
                //                 specialkey: function (field, e) {
                //                     if (e.getKey() == Ext.EventObject.ENTER) {
                //                         gm.me().poPrdDetailStore.getProxy().setExtraParam('final_wa_name', '%' + gu.getCmp('final_wa_name').getValue() + '%');
                //                         gm.me().poPrdDetailStore.load(function () { });
                //                     }
                //                 }
                //             },
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             'onTrigger1Click': function () {
                //                 gu.getCmp('final_wa_name').setValue('');
                //                 gm.me().poPrdDetailStore.getProxy().setExtraParam('final_wa_name', gu.getCmp('final_wa_name').getValue());
                //                 gm.me().poPrdDetailStore.load(function () { });
                //             }
                //         }, {
                //             xtype: 'triggerfield',
                //             emptyText: '고객PO번호',
                //             id: gu.id('project_varchard'),
                //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                //             name: 'query_sup',
                //             listeners: {
                //                 specialkey: function (field, e) {
                //                     if (e.getKey() == Ext.EventObject.ENTER) {
                //                         gm.me().poPrdDetailStore.getProxy().setExtraParam('project_varchard', '%' + gu.getCmp('project_varchard').getValue() + '%');
                //                         gm.me().poPrdDetailStore.load(function () { });
                //                     }
                //                 }
                //             },
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             'onTrigger1Click': function () {
                //                 Ext.getCmp('project_varchard').setValue('');
                //                 gm.me().poPrdDetailStore.getProxy().setExtraParam('project_varchard', gu.getCmp('project_varchard').getValue());
                //                 gm.me().poPrdDetailStore.load(function () { });
                //             }
                //         },
                //         {
                //             xtype: 'triggerfield',
                //             emptyText: '수주번호',
                //             id: gu.id('order_number'),
                //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                //             name: 'query_sup',
                //             listeners: {
                //                 specialkey: function (field, e) {
                //                     if (e.getKey() == Ext.EventObject.ENTER) {
                //                         gm.me().poPrdDetailStore.getProxy().setExtraParam('order_number', '%' + gu.getCmp('order_number').getValue() + '%');
                //                         gm.me().poPrdDetailStore.load(function () { });
                //                     }
                //                 }
                //             },
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             'onTrigger1Click': function () {
                //                 Ext.getCmp('order_number').setValue('');
                //                 gm.me().poPrdDetailStore.getProxy().setExtraParam('order_number', gu.getCmp('order_number').getValue());
                //                 gm.me().poPrdDetailStore.load(function () { });
                //             }
                //         }
                //         ]
                //     }
                // ],
                columns: [
                    {
                        text: '수주번호',
                        width: 100,
                        style: 'text-align:center',
                        dataIndex: 'order_number'/*, sortable: false*/
                    },
                    {
                        text: this.getMC('msg_order_grid_prd_name', '품번'),
                        width: 120,
                        style: 'text-align:center',
                        dataIndex: 'srcahd_item_code'/*, sortable: false*/
                    },
                    {
                        text: this.getMC('msg_order_grid_prd_name', '품명'),
                        width: 120,
                        style: 'text-align:center',
                        dataIndex: 'srcahd_item_name'/*, sortable: false*/
                    },
                    {
                        text: this.getMC('msg_order_grid_prd_name', '규격'),
                        width: 120,
                        style: 'text-align:center',
                        dataIndex: 'srcahd_specification'/*, sortable: false*/
                    },
                    {
                        text: this.getMC('msg_order_grid_prd_name', 'Order'),
                        width: 80,
                        style: 'text-align:center',
                        dataIndex: 'reserved18'/*, sortable: false*/
                    },
                    {
                        text: this.getMC('msg_order_grid_prd_unitprice', '단가'),
                        width: 150, style: 'text-align:center',
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
                    },
                    {
                        text: this.getMC('msg_order_grid_prd_name', '입금날짜'),
                        width: 80,
                        style: 'text-align:center',
                        dataIndex: 'reserved16',
                        editor: {xtype: 'textfield'},
                        sortable: false
                    },
                ],
                title: this.getMC('mes_reg_prd_info_msg', '납품서 상세내역'),
                name: 'po',
                autoScroll: true,
                listeners: {
                    edit: function (editor, e, eOpts) {
                        var columnName = e.field;
                        var tableName = 'sloast';
                        //var selections = gm.me().grid.getSelectionModel().getSelected().items[0];
                        var selections = gu.getCmp('gridContractCompany').getSelectionModel().getSelection()[0];

                        var unique_id = selections.get('sloast_uid');
                        var value = e.value;
                        gm.editAjax(tableName, columnName, value, 'unique_id', unique_id, {type: ''});
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
                    }
                }
            });
        } else {
            this.gridContractCompany = Ext.create('Ext.grid.Panel', {
                cls: 'rfx-panel',
                id: gu.id('gridContractCompany'),
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
                // dockedItems: [
                //     {
                //         dock: 'top',
                //         xtype: 'toolbar',
                //         items: [
                //             this.purListSrch,
                //             // this.assignShipmentAction,
                //             // this.addMyCart,
                //             // this.cartGoReq
                //         ]
                //     },
                //     {
                //         dock: 'top',
                //         xtype: 'toolbar',
                //         cls: 'my-x-toolbar-default1',
                //         items: [{
                //             xtype: 'triggerfield',
                //             emptyText: '제품명',
                //             id: gu.id('item_name'),
                //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                //             name: 'item_name',
                //             listeners: {
                //                 specialkey: function (field, e) {
                //                     if (e.getKey() == Ext.EventObject.ENTER) {
                //                         gm.me().poPrdDetailStore.getProxy().setExtraParam('item_name', '%' + gu.getCmp('item_name').getValue() + '%');
                //                         gm.me().poPrdDetailStore.load(function () { });
                //                     }
                //                 }
                //             },
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             'onTrigger1Click': function () {
                //                 gu.getCmp('item_name').setValue('');
                //                 gm.me().poPrdDetailStore.getProxy().setExtraParam('item_name', gu.getCmp('item_name').getValue());
                //                 gm.me().poPrdDetailStore.load(function () { });
                //             }
                //         }, {
                //             xtype: 'triggerfield',
                //             emptyText: '최종고객사',
                //             id: gu.id('final_wa_name'),
                //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                //             name: 'final_wa_name',
                //             listeners: {
                //                 specialkey: function (field, e) {
                //                     if (e.getKey() == Ext.EventObject.ENTER) {
                //                         gm.me().poPrdDetailStore.getProxy().setExtraParam('final_wa_name', '%' + gu.getCmp('final_wa_name').getValue() + '%');
                //                         gm.me().poPrdDetailStore.load(function () { });
                //                     }
                //                 }
                //             },
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             'onTrigger1Click': function () {
                //                 gu.getCmp('final_wa_name').setValue('');
                //                 gm.me().poPrdDetailStore.getProxy().setExtraParam('final_wa_name', gu.getCmp('final_wa_name').getValue());
                //                 gm.me().poPrdDetailStore.load(function () { });
                //             }
                //         }, {
                //             xtype: 'triggerfield',
                //             emptyText: '고객PO번호',
                //             id: gu.id('project_varchard'),
                //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                //             name: 'query_sup',
                //             listeners: {
                //                 specialkey: function (field, e) {
                //                     if (e.getKey() == Ext.EventObject.ENTER) {
                //                         gm.me().poPrdDetailStore.getProxy().setExtraParam('project_varchard', '%' + gu.getCmp('project_varchard').getValue() + '%');
                //                         gm.me().poPrdDetailStore.load(function () { });
                //                     }
                //                 }
                //             },
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             'onTrigger1Click': function () {
                //                 Ext.getCmp('project_varchard').setValue('');
                //                 gm.me().poPrdDetailStore.getProxy().setExtraParam('project_varchard', gu.getCmp('project_varchard').getValue());
                //                 gm.me().poPrdDetailStore.load(function () { });
                //             }
                //         },
                //         {
                //             xtype: 'triggerfield',
                //             emptyText: '수주번호',
                //             id: gu.id('order_number'),
                //             fieldStyle: 'background-color: #d6e8f6; background-image: none;',
                //             name: 'query_sup',
                //             listeners: {
                //                 specialkey: function (field, e) {
                //                     if (e.getKey() == Ext.EventObject.ENTER) {
                //                         gm.me().poPrdDetailStore.getProxy().setExtraParam('order_number', '%' + gu.getCmp('order_number').getValue() + '%');
                //                         gm.me().poPrdDetailStore.load(function () { });
                //                     }
                //                 }
                //             },
                //             trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //             'onTrigger1Click': function () {
                //                 Ext.getCmp('order_number').setValue('');
                //                 gm.me().poPrdDetailStore.getProxy().setExtraParam('order_number', gu.getCmp('order_number').getValue());
                //                 gm.me().poPrdDetailStore.load(function () { });
                //             }
                //         }
                //         ]
                //     }
                // ],
                columns: [
                    {
                        text: '수주번호',
                        width: 100,
                        style: 'text-align:center',
                        dataIndex: 'order_number'/*, sortable: false*/
                    },
                    // { text: '최종고객사', width: 100, style: 'text-align:center', dataIndex: 'final_wa_name'/*, sortable: false*/ },
                    // {
                    //     text: '요청수량', width: 95, style: 'text-align:center', dataIndex: 'ap_Wquan', align: 'right',
                    //     editor: 'numberfield',
                    //     renderer: function (value, context, tmeta) {
                    //         return Ext.util.Format.number(value, '0,00/i');
                    //     },
                    // },
                    // { text: 'Site', width: 80, style: 'text-align:center', dataIndex: 'reserved5'/*, sortable: false*/ },
                    {
                        text: this.getMC('msg_order_grid_prd_name', '품번'),
                        width: 150,
                        style: 'text-align:center',
                        dataIndex: 'srcahd_item_code'/*, sortable: false*/
                    },
                    {
                        text: this.getMC('msg_order_grid_prd_name', '품명'),
                        width: 150,
                        style: 'text-align:center',
                        dataIndex: 'srcahd_item_name'/*, sortable: false*/
                    },
                    // { text: this.getMC('msg_order_grid_prd_desc', '기준모델'), width: 100, style: 'text-align:center', dataIndex: 'description'/*, sortable: false*/ },
                    // {
                    //     text: '고객요청일', width: 100, style: 'text-align:center', dataIndex: 'reserved_timestamp1'/*, sortable: false*/,
                    //     renderer: function (value, context, tmeta) {
                    //         if (value !== null && value.length > 0) {
                    //             return value.substring(0, 10);
                    //         }
                    //     },
                    // },
                    {
                        text: this.getMC('msg_order_grid_prd_name', '규격'),
                        width: 150,
                        style: 'text-align:center',
                        dataIndex: 'srcahd_specification'/*, sortable: false*/
                    },
                    // { text: '고객PO번호', width: 120, style: 'text-align:center', dataIndex: 'project_varchard' },
                    // { text: '수주특기사항', width: 150, style: 'text-align:center', dataIndex: 'reserved1' },
                    {
                        text: this.getMC('msg_order_grid_prd_unitprice', '단가'),
                        width: 150, style: 'text-align:center',
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
                    // { text: this.getMC('msg_order_grid_prd_currency', '통화'), width: 80, style: 'text-align:center', dataIndex: 'reserved4'/*, sortable: false*/ },
                    // { text: '최종고객명', width: 100, style: 'text-align:center', dataIndex: 'final_wa_name' },
                    // {
                    //     text: '수주일자', width: 100, style: 'text-align:center', dataIndex: 'regist_date'/*, sortable: false*/,
                    //     renderer: function (value, context, tmeta) {
                    //         if (value !== null && value.length > 0) {
                    //             return value.substring(0, 10);
                    //         }
                    //     },
                    // },
                    // { text: 'PI번호', width: 100, style: 'text-align:center', dataIndex: 'project_varchare' },
                ],
                title: this.getMC('mes_reg_prd_info_msg', '납품서 상세내역'),
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
                    }
                }
            });
        }


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
                if (selections.length > 0) {

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
                gUtil.enable(gMain.selPanel.deleteAction);
                // gUtil.enable(gMain.selPanel.editPoAction);
                // gUtil.enable(gMain.selPanel.removeAction);
                // gUtil.disable(gMain.selPanel.modifyAction);
                // gUtil.enable(gMain.selPanel.fileattachAction);
                // gm.me().cartGoReq.enable();
                // gUtil.enable(gMain.selPanel.cartGoReq);
                // var rec = selections[0];
                // gm.me().cartGoReq.enable();
                this.poPrdDetailStore.getProxy().setExtraParam('dl_uid', rec.get('unique_id_long'));
                this.poPrdDetailStore.load();
            } else {
                gUtil.disable(gMain.selPanel.printDl);
                gUtil.enable(gMain.selPanel.deleteAction);
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

    searchDetailStore: Ext.create('Mplm.store.ProductDetailSearchExepOrderStore', {}),
    searchDetailStoreOnlySrcMap: Ext.create('Mplm.store.ProductDetailSearchExepOrderSrcMapStore', {}),
    prdStore: Ext.create('Mplm.store.RecvPoDsmfPoPRD', {}),
    combstStore: Ext.create('Mplm.store.CombstStore', {}),
    ProjectTypeStore: Ext.create('Mplm.store.ProjectTypeStore', {}),
    PmUserStore: Ext.create('Mplm.store.UserStore', {}),
    payTermsStore: Ext.create('Mplm.store.PaytermStore', {}),
    incotermsStore: Ext.create('Mplm.store.IncotermsStore', {}),
    poNewDivisionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_NEW_DIVISION'}),
    poSalesConditionStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_CONDITION'}),
    poSalesTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SALES_TYPE'}),

    searchPrdStore: Ext.create('Mplm.store.MaterialSearchStore', {type: 'PRD'}),
    searchAssyStore: Ext.create('Mplm.store.MaterialSearchStore', {type: 'ASSY'}),

    searchItemStore: Ext.create('Mplm.store.ProductStore', {}),
    sampleTypeStore: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PO_SAMPLE_TYPE'}),
    cartDoListStore: Ext.create('Rfx2.store.company.bioprotech.CartDoListVerStore'),
});