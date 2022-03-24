Ext.define('Rfx2.view.company.hanjung.purStock.HEAVY4_WearingStateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'wearing-view',
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = true;

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            field_id: 'date_type',
            store: 'DatetypeStore',
            displayField: 'codeName',
            valueField: 'systemCode',
            innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
        });

        this.addSearchField({
            type: 'dateRange',
            field_id: 'listpodate',
            labelWidth: 0,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        //this.addSearchField('project_varchar6');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var buttonToolbar3 = Ext.create('widget.toolbar', {
           // style: 'background-color: #000069;',
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                id: gu.id('total_price'),
                style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
                //style: 'color: yellow; font-size: 15px; margin: 5px;',
                text: '총 입고금액 : '
            }]
        });

        var option = {
            features: {
                ftype: 'groupingsummary',
                groupHeaderTpl: '<div>입고번호 :: <font color=#003471><b>{[values.rows[0].data.gr_no]}</b></font> ({rows.length})</div>'
            }
        };
        this.createStoreSimple({
            modelClass: 'Rfx.model.WarehousingState',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            pageSize: gMain.pageSize,/*pageSize*/
        }, {
            groupField: 'gr_no',
            groupDir: 'DESC'
        });

        for (var i = 0; i < this.columns.length; i++) {
            var o = this.columns[i];
            //console_logs('this.columns' + i, o);
            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'po_qty':
                case 'gr_qty':
                case 'sales_price':
                case 'gr_amount_Hj':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function (value, summaryData, dataIndex) {
                        value = Ext.util.Format.number(value, '0,00/i');
                        value = '<font style="font-weight: bold; font-size:10pt; color:#000000;">' + value + '</font>'
                        return value;
                    };
                    break;
                default:
                    break;
            }

        }

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.setRowClass(function (record, index) {
            var uid_srccst = record.get('uid_srccst');
            var change_reason = record.get('change_reason');
            console_logs('===dasdas', change_reason);
            if (uid_srccst != null && uid_srccst != undefined && uid_srccst > 1) {
                if (change_reason == '') {
                    return 'green-row';
                }
                var len = change_reason.split(',').length;
                for (var i = 0; i < len; i++) {
                    var s = change_reason.split(',')[i];
                    console_logs('===ss', s);
                    if (s == 'G') {
                        return 'yellow-row';
                        break;
                    } else {
                        return 'green-row';
                    }
                }

            }
        });

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
//        arr.push(searchToolbar);

        //검색툴바 생성
        if (useMultitoolbar == true) {
            var multiToolbar = this.createMultiSearchToolbar({first: 9, length: 9});
            console_logs('multiToolbar', multiToolbar);
            for (var i = 0; i < multiToolbar.length; i++) {
                arr.push(multiToolbar[i]);
            }
        } else {
            var searchToolbar = this.createSearchToolbar();
            arr.push(searchToolbar);
        }

        arr.push(buttonToolbar3);

        


        //grid 생성.
        this.createGridCore(arr, option);
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        this.setAllMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.load(function () {
                });
            }
        });
        this.setSaMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '원자재',
            tooltip: '원자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'RAW';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'S');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSubMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '부자재',
            tooltip: '부자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'B');
                gm.me().store.load(function () {
                });
            }
        });
        this.setMROView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'MRO',
            tooltip: 'MRO',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'M');
                gm.me().store.load(function () {
                });
            }
        });
        this.setUsedMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '상품',
            tooltip: '상품',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'P');
                gm.me().store.load(function () {
                });
            }
        });

        this.printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '수입검사성적서PDF',
            disabled: true,
            handler: function (widget, event) {
                var rec = gm.me().grid.getSelectionModel().getSelection();

                var wgrast_uids = [];

                for (var i = 0; i < rec.length; i++) {
                    wgrast_uids.push(rec[i].getId());
                }

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printRi',
                    params: {
                        wgrast_uids: wgrast_uids,
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'Y'
                    },
                    reader: {
                        pdfPath: 'pdfPath'
                    },
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        console_log(pdfPath);
                        if (pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                            top.location.href = url;
                        }
                    },
                    failure: extjsUtil.failureMessage
                });


            }
        });

        this.fileAttach = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '성적서 첨부',
            disabled: true,
            handler: function (widget, event) {
                gm.me().attachFile();
            }
        });


        //버튼 추가.
        buttonToolbar.insert(5, '-');
        buttonToolbar.insert(5, this.setUsedMatView);
        buttonToolbar.insert(5, this.setMROView);
        buttonToolbar.insert(5, this.setSubMatView);
        buttonToolbar.insert(5, this.setSaMatView);
        buttonToolbar.insert(5, this.setAllMatView)

        //입고 취소 Action 생성
        this.removeGoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: gm.getMC('CMD_Goods_receipt_cancellation', '입고 취소'),
            tooltip: '입고 취소',
            disabled: true,
            handler: function () {
                gm.me().treatremoveGo();
               
            }//handler end...

        });

        buttonToolbar.insert(1, this.removeGoAction);
        buttonToolbar.insert(1, '-');

        this.callParent(arguments);


        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {

            }
        });

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length) {
                this.wgrast_uids = [];
                this.arrGrqty = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    var gr_qty = rec1.get('gr_qty');
                    this.arrGrqty.push(gr_qty);
                    this.wgrast_uids.push(uids);
                }
                var rec = selections[0];
                //console_logs('rec', rec);
                gm.me().rec = rec;
                gm.me().cartmapuid = rec.get('id');

                gm.me().removeGoAction.enable();
                gm.me().fileAttach.enable();
                gm.me().printPDFAction.enable();
            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().removeGoAction.disable();
                gm.me().fileAttach.disable();
                gm.me().printPDFAction.disable();
                this.wgrast_uids = [];
                this.arrGrqty = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    var gr_qty = rec1.get('gr_qty');
                    this.arrGrqty.push(gr_qty);
                    this.wgrast_uids.push(uids);
                }
            }

        })
        //디폴트 로드
        gm.setCenterLoading(false);
        this.store.load(function (records) {
            var total_price_sum = 0;
                var total_qty = 0;
                for (var i = 0; i < gm.me().store.data.items.length; i++) {
                    var t_rec = gm.me().store.data.items[i];
                    total_price_sum += t_rec.get('gr_amount_Hj');
                    total_qty += t_rec.get('curGr_qty');
                }

                buttonToolbar3.items.items[1].update('총 입고금액 : ' + gUtil.renderNumber(total_price_sum) + ' 원');
        });

    },
    items: [],
    arrGrqty: [],
    wgrast_uids: [],
    poviewType: 'ALL',
    treatremoveGo: function () {
        Ext.MessageBox.show({
            title: '입고 취소',
            multiline: true,
            msg: '입고 취소 사유',
            buttons: Ext.MessageBox.YESNO,
            fn: gm.me().deleteConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    },
    deleteConfirm: function (btn, text) {

        if (btn != 'yes') {
            return;
        }
        var unique_ids = gm.me().wgrast_uids;
        var arrGrqty = gm.me().arrGrqty;
        console_logs('uid', unique_ids);
        console_logs('arrGrqty', arrGrqty);
        console_logs('text', text);

        gm.me().setLoading(true);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/quality/wgrast.do?method=destroy',
            params: {
                arrGrqty: arrGrqty
                , cancel_reason: text
                , unique_ids: unique_ids
            },
            success: function (result, request) {
                gm.me().showToast('결과', unique_ids.length + ' 건을 입고 취소하었습니다.');
                gm.me().getStore().load(function () {
                });
                gm.me().setLoading(false);
            },
            failure: extjsUtil.failureMessage
        });
    },


    attachFileView: function () {
        var fieldPohistory = [
            {name: 'account_code', type: "string"},
            {name: 'account_name', type: "string"},
            {name: 'po_no', type: "string"},
            {name: 'po_date', type: "string"},
            {name: 'seller_code', type: "string"},
            {name: 'seller_name', type: "string"},
            {name: 'sales_price', type: "string"},
            {name: 'pr_qty', type: "string"}
        ];


        var selections = gm.me().grid.getSelectionModel().getSelection();
        console_logs('===>attachFileView', selections);
        if (selections != null && selections.length > 0) {
            var unique_id_long = selections[0].get('coord_key3');

            gm.me().attachedFileStore.getProxy().setExtraParam('group_code', unique_id_long);
            gm.me().attachedFileStore.load(function (records) {

                console_logs('attachedFileStore records', records);
                if (records != null) {
                    var o = gu.getCmp('file_quan');
                    if (o != null) {
                        o.update('총수량 : ' + records.length);
                    }

                }
            });

            var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});

            var fileGrid = Ext.create('Ext.grid.Panel', {
                title: '첨부',
                store: gm.me().attachedFileStore,
                collapsible: true,
                layout: 'fit',
                multiSelect: true,
                selModel: selFilegrid,
                stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

                ],
                columns: [
                    {
                        text: 'UID',
                        width: 100,
                        sortable: true,
                        dataIndex: 'id'
                    },
                    {
                        text: '파일명',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'object_name'
                    },
                    {
                        text: '파일유형',
                        width: 70,
                        sortable: true,
                        dataIndex: 'file_ext'
                    },
                    {
                        text: '날짜',
                        width: 160,
                        sortable: true,
                        dataIndex: 'create_date'
                    },
                    {
                        text: 'size',
                        width: 100,
                        sortable: true,
                        xtype: 'numbercolumn',
                        format: '0,000',
                        style: 'text-align:right',
                        align: 'right',
                        dataIndex: 'file_size'
                    }]
            });

            var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: '첨부파일',
                width: 1200,
                height: 600,
                items: fileGrid,
                buttons: [
                    {
                        text: CMD_OK,
                        //scope:this,
                        handler: function () {
                            if (prWin) {
                                prWin.close();
                            }
                        }
                    }
                ]
            })
            prWin.show();
        }
    },

    uploadComplete: function (items) {

        console_logs('uploadComplete items', items);

        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });

        console_logs('파일업로드 결과', output);

        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('총수량 : ' + records.length);
                }

            }
        });


    },

    attachFile: function () {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('==>zzz', record);

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('총수량 : ' + records.length);
                }

            }
        });

        var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부',
            store: this.attachedFileStore,
            collapsible: true,
            multiSelect: true,
            // hidden : ! this.useDocument,
            selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype: 'button',
                        text: '파일 첨부',
                        scale: 'small',
                        glyph: 'xf0c6@FontAwesome',
                        scope: this.fileGrid,
                        handler: function () {

                            var group_rec = gm.me().grid.getSelectionModel().getSelection();
                            var group_code_list = [];
                            for (var i = 0; i < group_rec.length; i++) {
                                var g = group_rec[i];
                                group_code_list.push(g.get('unique_id_long'));
                            }
                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code_list=' + group_code_list + '&change_reason=' + 'G';

                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous: true
                            });
                            var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일 첨부',
                                panel: uploadPanel
                            });

                            this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {

                                console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                console_logs('this.mon uploadcomplete manager', manager);
                                console_logs('this.mon uploadcomplete items', items);
                                console_logs('this.mon uploadcomplete errorCount', errorCount);

                                gm.me().uploadComplete(items);
                                //if (!errorCount) {
                                uploadDialog.close();
                                //}
                            }, this);

                            uploadDialog.show();
                        }
                    },
                    this.removeActionFile,
                    '-',
                    this.sendFileAction,
                    '-',
                    this.fileRemoveAction,
                    '->',
                    {
                        xtype: 'component',
                        id: gu.id('file_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html: '총수량 : 0'
                    }
                ]
            }

            ],
            columns: [
                {
                    text: 'UID',
                    width: 100,
                    sortable: true,
                    dataIndex: 'id'
                },
                {
                    text: '파일명',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'object_name'
                },
                {
                    text: '파일유형',
                    width: 70,
                    sortable: true,
                    dataIndex: 'file_ext'
                },
                {
                    text: '날짜',
                    width: 160,
                    sortable: true,
                    dataIndex: 'create_date'
                },
                {
                    text: 'size',
                    width: 100,
                    sortable: true,
                    xtype: 'numbercolumn',
                    format: '0,000',
                    style: 'text-align:right',
                    align: 'right',
                    dataIndex: 'file_size'
                }]
        });

        this.fileGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections != null && selections.length > 0) {
                    gm.me().fileRemoveAction.enable();
                } else {
                    gm.me().fileRemoveAction.disable();
                }
            }
        })

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/' 첨부파일',
            width: 1300,
            height: 600,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype: 'container',
            plain: true,
            items: [
                this.fileGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }]
        });
        win.show();
    },

    fileRemoveAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        disabled: true,
        handler: function (widget, event) {
            var selections = gm.me().fileGrid.getSelectionModel().getSelection();
            console_logs('===selections', selections);

            var srccst_uids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                srccst_uids.push(rec.get('unique_id'));
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/uploader.do?method=assyMatchFile',
                params: {
                    srcahd_uid: -1,
                    srccst_uids: srccst_uids,
                    type: 'remove'
                },
                success: function () {
                    gm.me().showToast('결과', '성공');
                    gm.me().attachedFileStore.load();
                },
                failure: function () {
                    gm.me().showToast('결과', '실패');
                }
            });
        }
    }),

    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),

    excelDownBySelect: Ext.create('Ext.Action', {
        iconCls: 'mfglabs-retweet_14_0_5395c4_none',
        text: '엑셀다운',
        tooltip: '엑셀다운',
        disabled: false,
        handler: function () {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var unique_ids = [];
            for (var i = 0; i < selections.length; i++) {
                unique_ids.push(selections[i].get('unique_id_long'));
            }
            // console_logs('====ids', unique_ids);
            var excel_store = gm.me().store;
            excel_store.getProxy().setExtraParam('srch_rows', 'all');
            excel_store.getProxy().setExtraParam('srch_type', 'excelPrint');
            excel_store.getProxy().setExtraParam('srch_fields', 'major');
            excel_store.getProxy().setExtraParam('menuCode', gm.me().link);
            excel_store.getProxy().setExtraParam('is_excel', 'Y');
            excel_store.getProxy().setExtraParam('unique_ids', unique_ids);
            excel_store.load({
                callback: function () {
                    gm.me().excelPrintFc();
                }
            });

        }//handler end...

    }),
});
