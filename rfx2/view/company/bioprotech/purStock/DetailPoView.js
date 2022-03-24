Ext.define('Rfx2.view.company.bioprotech.purStock.DetailPoView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'detail-po-view',
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = true;

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField(
            {
                field_id: 'date_type'
                , store: "DatetypeStore"
                , displayField: 'codeName'
                , emptyText: '기준기간'
                , valueField: 'systemCode'
                , innerTpl: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            });
        this.addSearchField({
            type: 'dateRange',
            field_id: 'listpodate',
            labelWidth: 0,
            sdate: new Date(new Date().getFullYear() + '-01-01'),
            // sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });
        //this.addSearchField ('project_varchar6');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('po_no');
        this.addSearchField('seller_name');
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');
        this.addReadonlyField('creator');
        this.addReadonlyField('creator_uid');
        this.addReadonlyField('user_id');
        this.addReadonlyField('board_count');

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);
        this.localSize = gm.unlimitedPageSize;
        this.createStoreSimple({
            modelClass: 'Rfx.model.Heavy4DetailPo',
            pageSize: this.pageSize,/*pageSize*/
            byReplacer: {},
            deleteClass: ['xpoast']
        }, {
            groupField: 'po_no',
            groupDir: 'DESC',
            sorters: [{
                property: 'pr_no',
                direction: 'asc'
            }],
        });

        this.store.getProxy().setExtraParam('route_type', null);

        this.attachFileAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '파일 첨부',
            tooltip: '파일 첨부',
            disabled: true,
            handler: function () {

                gm.me().attachFile();
            } //handler end...

        });

        var arr = [];
        arr.push(buttonToolbar);
        for (var i = 0; i < this.columns.length; i++) {
            var o = this.columns[i];
            //console_logs('this.columns' + i, o);
            var dataIndex = o['dataIndex'];
            switch (dataIndex) {
                case 'po_qty':
                case 'sales_price':
                case 'po_amount':
                case 'gr_amount':
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

        var option = {
            // features: {
            //     ftype: 'groupingsummary',
            //     groupHeaderTpl: '<div>주문번호 ::  <font color=#003471><b>{name}</b></font> ({rows.length})</div>'
            // }
        };

        //검색툴바 생성
        if (useMultitoolbar == true) {
            var multiToolbar = this.createMultiSearchToolbar({first: 9, length: 11});
            console_logs('multiToolbar', multiToolbar);
            for (var i = 0; i < multiToolbar.length; i++) {
                arr.push(multiToolbar[i]);
            }
        } else {
            var searchToolbar = this.createSearchToolbar();
            arr.push(searchToolbar);
        }

        this.createGridCore(arr, option);

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

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(5, '-');
        // buttonToolbar.insert(5, this.setUsedMatView);
        // buttonToolbar.insert(5, this.setMROView);
        // buttonToolbar.insert(5, this.setSubMatView);
        // buttonToolbar.insert(5, this.setSaMatView);
        // buttonToolbar.insert(5, this.setAllMatView);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.fileGrid, this.crudTab]
        });

        this.addTablistPoviewGridPanel('상세보기', 'PPO2_SUB', {
                pageSize: 100,
                //model: 'Rfx.model.HEAVY4WorkOrder',
                model: 'Rfx.store.ListPoViewStore',
                dockedItems: [

                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default3',
                        items: [
                            '->',
                        ]
                    }
                ],
                sorters: [{
                    property: 'unique_id',
                    direction: 'ASC'
                }]
            },
            function (selections) {

                if (selections.length) {
                    var rec = selections[0];
                    console_logs('상세정보>>>>>>>>>>>>>', rec);

                    var uids = [];
                    for (var i = 0; i < selections.length; i++) {
                        var o = selections[i];
                        var xpoast_uid = o.get('id');
                        uids.push(xpoast_uid);
                        console_logs('uids', uids);
                    }
                } else {

                }
            },
            'listPoviewGrid'//toolbar
        );
        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        var po_types = [];
        po_types.push('P');
        po_types.push('G');
        po_types.push('MN');
        this.store.getProxy().setExtraParam('po_types', po_types);

        this.store.load(function (records) {
        });

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                if (selections != null && selections.length > 0) {
                    gm.me().attachFileAction.enable();
                    gm.me().readHistoryAction.enable();
                } else {
                    gm.me().attachFileAction.disable();
                    gm.me().readHistoryAction.disable();
                }
            }

        });
    },
    addTablistPoviewGridPanel: function (title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: {menuCode: menuCode},
            callback: function (records, operation, success) {
                console_logs('menuCode>>>>>>>>>>', menuCode);

                if (success == true) {
                    this.callBackWorkList(title, records, arg, fc, id);
                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {

                        }
                    });
                }
            },
            scope: this
        });

    },

    callBackWorkList: function (title, records, arg, fc, id) {
        var gridId = id == null ? this.getGridId() : id;
        console_logs('gridId>>>>>>>>>>', gridId);

        var o = gMain.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];
        console_logs('fields>>>>>>>>>>', fields);
        console_logs('columns>>>>>>>>>>', columns);
        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];

        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});
        this.listPoViewStore = Ext.create('Rfx.store.ListPoViewStore');
        this.listPoViewStore.getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_UNIQUE_ID);

        this.listPoviewGrid = Ext.create('Ext.grid.Panel', {
            store: this.listPoViewStore,
            title: title,
            cls: 'rfx-panel',
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            collapsible: false,
            layout: 'fit',
            forceFit: true,
            dockedItems: dockedItems,
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            plugins: [cellEditing],
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
                select: function (selModel, record, index, options) {

                },
                itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                    gMain.selPanel.downListRecord(record);
                }, //endof itemdblclick
                cellkeydown: function (listPoviewGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {
                        console_logs('++++++++++++++++++++ e.getKey()', e.getKey());
                    }


                }
            },//endof listeners
            columns: columns
        });
        this.listPoviewGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                fc(selections);
            }
        });


        var tabPanel = Ext.getCmp(gMain.geTabPanelId());

        tabPanel.add(this.listPoviewGrid);
    },

    items: [],
    poviewType: 'ALL',

    attachFile: function () {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        console_logs('==>zzz', record);

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('coord_key3'));
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
            // selModel: selFilegrid,
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


                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');

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

    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),

    editRedord: function (field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        var record = gm.me().grid.getSelectionModel().getSelection()[0];

        switch (field) {
            case 'reserved_varcharb':
                gm.editAjax('rtgast', 'reserved_varcharb', rec.data.reserved_varcharb, 'unique_id', record.data.po_group_uid, {type: ''});
                gm.me().storeLoad();
                break;
            default:
                gm.editRedord(field, rec);

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

    buttonToolbar3: Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '프로젝트를 하나 선택하시기 바랍니다.'
        }]
    }),

    storeLoad: function (fc) {

        var store = this.getStore();

        store.load(function (records) {

            var rec = records;

            if (vCompanyReserved4 == 'HSGC01KR') {
                var total_price_sum = 0;
                var total_origin = rec[0].get('reserved_double1');

                for (var i = 0; i < rec.length; i++) {
                    var t_rec = rec[i];
                    total_price_sum += t_rec.get('total_price');
                }

                var reserved_varcharb = gm.me().store.getProxy().getExtraParams().reserved_varcharb;

                if (reserved_varcharb != null && reserved_varcharb != undefined) {
                    gm.me().buttonToolbar3.items.items[1].update('원청 발주금액 : ' + gUtil.renderNumber(total_origin) + ' / 발주합계 : ' +
                        gUtil.renderNumber(total_price_sum) + ' / 이윤 : ' + gUtil.renderNumber(total_origin - total_price_sum));
                } else {
                    gm.me().buttonToolbar3.items.items[1].update('프로젝트를 하나 선택하시기 바랍니다.');
                }
            }
        });
    },

    renderMoveBom: function () {

        var rec = this.grid.getSelectionModel().getSelection()[0];

        if (rec != null) {

            var wa_name = rec.get('wa_name');
            var pj_name = rec.get('pj_name');
            var pj_code = rec.get('pj_code');
            var pj_uid = rec.get('pj_uid');
            var parent_uid = rec.get('parent_uid');
            var child = rec.get('coord_key3');

            return gm.me().renderBom(wa_name, pj_name, pj_code, pj_uid, parent_uid, child);
        }
    },

    readHistoryAction: Ext.create('Ext.Action', {
        iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
        text: '이력조회',
        tooltip: '이력조회',
        disabled: true,
        handler: function (widget, event) {
            gm.me().readHistroyView();
        }
    }),

    readHistroyView: function () {
        Ext.define('XpoAstHistory', {
            extend: 'Ext.data.Model',
            fields: /*(G)fieldPohistory*/'',
            proxy: {
                type: 'ajax',
                api: {
                    read: CONTEXT_PATH + '/purchase/request.do?method=readPohistory'
                },
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success',
                    excelPath: 'excelPath'
                },
                writer: {
                    type: 'singlepost',
                    writeAllFields: false,
                    root: 'datas'
                }
            }
        });

        var poHistoryStore = new Ext.data.Store({
            pageSize: 50,
            model: 'XpoAstHistory',
            sorters: [{
                property: 'po_date',
                direction: 'DESC'
            }]
        });

        var selection = gm.me().grid.getSelectionModel().getSelection()[0];
        var uid_srcahd = selection.get('barcode');

        poHistoryStore.getProxy().setExtraParam('uid_srcahd', uid_srcahd);
        poHistoryStore.load();

        var bomHistoryGrid = Ext.create('Ext.grid.Panel', {
            store: poHistoryStore,
            stateId: 'bomHistoryGrid',
            layout: 'fit',
            border: false,
            frame: false,
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'multi'}),
            sortable: false,
            multiSelect: false,
            autoScroll: true,
            heigth: 300,
            columns: [
                {text: '프로젝트 코드', dataIndex: 'account_code', width: 100},
                {text: '프로젝트 명', dataIndex: 'account_name', width: 80},
                {text: 'Assembly', dataIndex: 'pl_no', width: 80},
                {text: '발주번호', dataIndex: 'po_no', width: 120},
                {text: '주문일자', dataIndex: 'po_date', width: 120},
                {text: '공급사 코드', dataIndex: 'seller_code', width: 80},
                {text: '공급사 명', dataIndex: 'seller_name', width: 120},
                {text: '주문단가', dataIndex: 'sales_price', width: 80},
                {text: '주문수량', dataIndex: 'po_qty', width: 80},
            ]
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/'주문 P/O 이력',
            width: 900,
            height: 700,
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
                bomHistoryGrid
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
});


