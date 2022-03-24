//출하 현황
Ext.define('Rfx2.view.company.hanjung.salesDelivery.DeliveryMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'delivery-mgmt-view',
    fileContentStore: Ext.create('Rfx2.store.company.hanjung.FileContentStore', {}),
    fileContentRecords: null,

    form: Ext.create('Ext.form.Panel', {
        id: gu.id('barcodeformPanel'),
        xtype: 'form',
        frame: false,
        border: false,
        bodyPadding: '3 3 0',
        region: 'center',
        fieldDefaults: {
            labelAlign: 'right',
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%',
            labelWidth: 60,
            margins: 10,
        },
        items: [
            {
                xtype: 'fieldset',
                title: '수량/인증명을 입력하세요.',
                collapsible: false,
                defaults: {
                    labelWidth: 70,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: { top: 0, right: 5, bottom: 0, left: 0 }
                    }
                },
                items: [
                    {
                        xtype: 'numberfield',
                        id: gu.id('print_qty'),
                        name: 'print_qty',
                        fieldLabel: '출력매수',
                        margin: '3 3 3 3',
                        width: 350,
                        allowBlank: false,
                        value: 1
                    },
                    {
                        xtype: 'textfield',
                        id: gu.id('injung_name'),
                        name: 'injung_name',
                        fieldLabel: '인증명',
                        margin: '3 3 3 3',
                        width: 350,
                        allowBlank: false,
                        //value : assymap_varchar5,
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function (form, e) {
                                gm.me().getBarcodeHtml(rec, gu.getCmp('injung_name').getValue());
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '바코드 미리보기',
                collapsible: false,
                defaults: {
                    labelWidth: 60,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: { top: 0, right: 5, bottom: 0, left: 0 }
                    }
                },
                items: [
                    {
                        xtype: 'component',
                        id: gu.id('barcodeHtml'),
                        width: 380,
                        height: 190,
                        html: ''
                    },
                ]
            }
        ]

    }),
    initComponent: function () {
        this.vMESSAGE.EDIT = '상세보기';
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.setDefComboValue('def_rep_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.

        this.addSearchField({
            type: 'dateRange',
            field_id: 'gr_date',
            text: "기간",
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        // this.addSearchField ('reserved_varchar6');

        this.setDefValue('create_date', new Date());

        var next7 = gUtil.getNextday(7);
        var rtgast_uid = '';
        var assymap_varchar5 = '';
        this.setDefValue('change_date', next7);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        if (vCompanyReserved4 == 'KYNL01KR') {
            var buttonToolbar = this.createCommandToolbar({
                REMOVE_BUTTONS: [
                    'COPY', 'EDIT'
                ],
            });
            (buttonToolbar.items).each(function (item, index, length) {
                if (index == 1 || index == 4) {
                    buttonToolbar.items.remove(item);
                }
            });
        } else {
            var buttonToolbar = this.createCommandToolbar({
                REMOVE_BUTTONS: [
                    'COPY', 'EDIT', 'REMOVE'
                ],
                RENAME_BUTTONS: [
                    // { key: 'EDIT', text: '출고확인'},
                    // { key: 'REMOVE', text: '출하반려'}
                ]
            });
            (buttonToolbar.items).each(function (item, index, length) {
                if (index == 1) {
                    buttonToolbar.items.remove(item);
                }
            });
        }

        //모델 정의
        this.createStore('Rfx2.model.company.kbtech.DeliveryMgmt', [{
            property: 'create_date',
            direction: 'DESC'
        }],
            gm.pageSize/*pageSize*/, {
            create_date: 'r.create_date'
        }
            , ['sledel']
        );

        this.printBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '출고바코드',
            tooltip: '출고바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                var selection = gm.me().grid.getSelectionModel().getSelection();
                rec = selection[0];
                gMain.selPanel.printBarcode(rec);
            }
        });
        this.pdfActionSpo = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: '수주대장',
            tooltip: '수주대장을 PDF파일로 출력합니다.',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var pj_uid = rec.get('ac_uid');
                var assymap_uid = rec.get('unique_uid');
                var rtgast_uid = 'ORDER_' + rec.get('reserved_varcharh');
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printOb',
                    params: {
                        rtgast_uid: rtgast_uid,
                        pj_uid: pj_uid,
                        assymap_uid: assymap_uid,
                        not_restart: 'Y',
                        pl_no: '---',
                        pdfPrint: 'pdfPrint',
                        is_rotate: 'N',
                        sum_wthdraw_flag: 'Y',
                        detail_flag: 'Y',
                    },
                    reader: {
                        pdfPath: 'pdfPath'
                    },
                    success: function (result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        var pdfPathSplit = pdfPath.split('/');
                        var fileName = pdfPathSplit[pdfPathSplit.length - 1];

                        console_log(pdfPath);
                        if (pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + pdfPath;
                            top.location.href = url;
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/document/manage.do?method=makePdfImage',
                                params: {
                                    fileName: pdfPath,
                                    extension: 'png'
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
                    },
                    failure: extjsUtil.failureMessage
                });
            }
        });
        this.attachCarPhoto = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-plus-circle',
            text: '사진파일 첨부',
            tooltip: '사진파일 첨부',
            disabled: true,
            handler: function () {
                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                var rec = selections[0];
                var rtgast_uid = rec.get('rtgast_uid');
                var reserved_varcharh = rec.get('reserved_varcharh');
                var type = 'DLP'
                gm.me().attachedCarPhoto(rtgast_uid, type, reserved_varcharh);
            }
        });

        this.downloadCarPhoto = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-download',
            text: gm.getMC('CMD_FILE_DOWNLOAD','파일 다운로드'),
            tooltip: '파일 다운로드',
            disabled: true,
            handler: function (widget, event) {
                if (gm.me().fileContentRecords.length > 0) {
                    this.gridViewTable = Ext.create('Ext.grid.Panel', {
                        store: gm.me().fileContentRecords,
                        cls: 'rfx-panel',
                        multiSelect: false,
                        autoScroll: true,
                        border: false,
                        width: '99%',
                        height: '80%',
                        flex: 1,
                        layout: 'fit',
                        forceFit: false,
                        dockedItems: [
                            {
                                dock: 'top',
                                xtype: 'toolbar',
                                cls: 'rfx-panel',
                                items: [
                                    {
                                        xtype: 'label',
                                        width: 500,
                                        height: 20,
                                        text: '먼저 다운로드 할 파일명을 선택 후 다운로드버튼을 클릭하세요.',
                                        style: 'color:black;'
                                    },
                                ]
                            }
                        ],
                        columns: [
                            {
                                text: '파일명',
                                width: 500,
                                dataIndex: 'object_name',
                            }
                        ]
                    });

                    var file_path = '';
                    var unique_id = '';
                    this.gridViewTable.getSelectionModel().on({
                        selectionchange: function (sm, selections) {
                            console_logs('>>>>>> records', selections[0]);
                            var rec = selections[0]
                            file_path = rec.get('file_path');
                            unique_id = rec.get('unique_id');
                            console_logs('file_path', file_path);
                        }
                    });

                    gm.me().fileDownloadForm = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        width: 500,
                        height: 400,
                        bodyPadding: 10,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        defaults: {
                            allowBlank: true,
                            msgTarget: 'side',
                            labelWidth: 60
                        },
                        items: [
                            this.gridViewTable,
                        ]
                    });

                    var winPart = Ext.create('ModalWindow', {
                        title: gm.getMC('CMD_FILE_DOWNLOAD','파일 다운로드'),
                        width: 500,
                        height: 400,
                        minWidth: 500,
                        minHeight: 400,
                        items: [gm.me().fileDownloadForm],
                        buttons: [{
                            text: '다운로드',
                            handler: function () {
                                gMain.setCenterLoading(true);
                                if (file_path.length > 0) {
                                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + file_path;
                                    top.location.href = url;
                                    gMain.setCenterLoading(false);
                                } else {
                                    gMain.setCenterLoading(false);
                                    Ext.MessageBox.alert('알림', '다운로드 할 파일이 선택되지 않았습니다.');
                                }
                            }
                        }, {
                            text: '파일삭제',
                            handler: function () {
                                if (unique_id.length > 0) {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params: {
                                            file_path: file_path,
                                            unique_id: unique_id
                                        },
                                        success: function (result, request) {
                                            Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                                            gm.me().fileContentStore.getProxy().setExtraParam('file_code', rtgast_uid + '_DLP');
                                            gm.me().fileContentStore.load(function (record) {
                                                objs = [];
                                                gm.me().fileContentRecords = record;
                                                var obj = {};
                                                console_logs(gm.me().fileContentRecords);
                                                var rec = gm.me().fileContentRecords;
                                                var columns = [];
                                                for (var i = 0; i < rec.length; i++) {
                                                    var sel = rec[i];
                                                    var objv = {};
                                                    console_logs('>>> sel', sel);
                                                    var file_path = sel.get('file_path');
                                                    var object_name = sel.get('object_name');
                                                    var file_ext = sel.get('file_ext');
                                                    objv['file_path'] = file_path;
                                                    objv['object_name'] = object_name;
                                                    objv['file_ext'] = file_ext;
                                                    columns.push(objv);
                                                }
                                                obj['datas'] = columns;
                                                objs.push(obj);
                                                console_logs('>>>> objs >>>>> ', objs);
                                            })
                                            if (winPart) {
                                                winPart.close();
                                            }
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
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
                } else {
                    Ext.MessageBox.alert('알림', '해당 데이터의 파일데이터가 존재하지 않습니다.<br>파일 업로드를 진행 후 다운로드 하세요.')
                }
            }
        }),

            //PDF 파일 출력기능
            this.printPDFAction = Ext.create('Ext.Action', {
                iconCls: 'af-pdf',
                text: '거래명세서',
                tooltip: '거래명세서 출력',
                disabled: true,

                handler: function (widget, event) {
                    var rtgast_uid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                    var po_no = gMain.selPanel.vSELECTED_PO_NO;
                    var rec = gm.me().vSELECTED_RECORD;

                    if (vCompanyReserved4 == 'DOOS01KR') {
                        rtgast_uid = rec.get('reserved_number5');
                    }

                    console_logs('rec', rec);

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/pdf.do?method=printDl',
                        params: {
                            rtgast_uid: rec.get('rtgast_uid'),
                            dl_uid: rtgast_uid,
                            po_no: po_no,
                            pdfPrint: 'pdfPrint'
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

        //버튼 추가.
        if (vCompanyReserved4 != 'KYNL01KR') {
            buttonToolbar.insert(1, this.printPDFAction);
            buttonToolbar.insert(2, this.printBarcodeAction);
            buttonToolbar.insert(3, this.attachCarPhoto);
            buttonToolbar.insert(4, this.downloadCarPhoto);
            buttonToolbar.insert(3, '-');
            buttonToolbar.insert(1, this.pdfActionSpo);
        }

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.

        switch (vCompanyReserved4) {
            case 'HSGC01KR':
                this.createGrid(searchToolbar, buttonToolbar, null, [
                    {
                        locked: false,
                        arr: [0, 1, 2, 3, 4, 5, 6]
                    },
                    {
                        text: '납품현황',
                        locked: false,
                        arr: [7, 8, 9, 10]
                    },
                    {
                        locked: false,
                        arr: [11]
                    }
                ]);
                break;
            default:
                this.createGrid(arr);
                break;
        }
        //this.editAction.setText('상세보기');

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];
                // console_logs('여기', rec);
                gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //rtgast_uid
                gMain.selPanel.vSELECTED_PO_NO = rec.get('po_no'); //rtgast_uid
                gMain.selPanel.printPDFAction.enable();
                gMain.selPanel.pdfActionSpo.enable();
                gMain.selPanel.attachCarPhoto.enable();
                gMain.selPanel.downloadCarPhoto.enable();
                gMain.selPanel.printBarcodeAction.enable();
                rtgast_uid = rec.get('rtgast_uid');

                gm.me().fileContentStore.getProxy().setExtraParam('file_code', rec.get('rtgast_uid') + '_DLP');
                gm.me().fileContentStore.load(function (record) {
                    objs = [];
                    gm.me().fileContentRecords = record;
                    var obj = {};
                    console_logs(gm.me().fileContentRecords);
                    var rec = gm.me().fileContentRecords;
                    var columns = [];
                    for (var i = 0; i < rec.length; i++) {
                        var sel = rec[i];
                        var objv = {};
                        console_logs('>>> sel', sel);
                        var file_path = sel.get('file_path');
                        var object_name = sel.get('object_name');
                        var file_ext = sel.get('file_ext');
                        objv['file_path'] = file_path;
                        objv['object_name'] = object_name;
                        objv['file_ext'] = file_ext;
                        columns.push(objv);
                    }
                    obj['datas'] = columns;
                    objs.push(obj);
                    console_logs('>>>> objs >>>>> ', objs);
                })
            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
                //gMain.selPanel.reReceiveAction.disable();
                gMain.selPanel.printPDFAction.disable();
                gMain.selPanel.downloadCarPhoto.disable();
                gMain.selPanel.printBarcodeAction.disable();
                gMain.selPanel.pdfActionSpo.disable();
            }
        });

        //디폴트 로드
        gMain.setCenterLoading(false);

        var code_name = 'SDL_SUB';

        if (vCompanyReserved4 == 'KYNL01KR') {
            this.store.getProxy().setExtraParam('rtg_group_flag', 'Y');
        }

        this.store.load(function (records) { });

        this.addTabdeliveryPendingGridPanel('상세정보', code_name, {
            pageSize: 100,
            //model: 'Rfx.model.HEAVY4WorkOrder',
            //model: 'Rfx.model.ProductNewStock',
            dockedItems: [

                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default3',
                    items: [
                        /* printpdf_min,
                         '-',
                         addMinPo*/
                    ]
                }
            ],
            sorters: [{
                property: 'serial_no',
                direction: 'ASC'
            }]
        },
            function (selections) {
                if (selections.length) {
                    var rec = selections[0];
                    console_logs('Lot 상세정보>>>>>>>>>>>>>', rec);
                    gMain.selPanel.selectPcsRecord = rec;
                    gMain.selPanel.selectSpecification = rec.get('specification');
                    gMain.selPanel.parent = rec.get('parent');

                } else {

                }
            },
            'deliveryPendingGrid'//toolbar
        );

    },
    addTabdeliveryPendingGridPanel: function (title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: { menuCode: menuCode },
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                if (success == true) {
                    //this.callBackWorkList(title, records, arg, fc, id);
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

        var o = gMain.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];

        var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });

        switch (vCompanyReserved4) {
            case 'KYNL01KR':
                this.detailStore = Ext.create('Mplm.store.DeliveryDetailStore');
                this.detailStore.getProxy().setExtraParam('dl_uid', this.selected_rec.data.id);
                this.detailStore.getProxy().setExtraParam('h_reserved43', this.selected_rec.data.h_reserved43);
                break;
            default:
                this.detailStore = Ext.create('Mplm.store.ProduceQtyStore');
                break;
        }

        try { Ext.FocusManager.enable({ focusFrame: true }); } catch (e) { console_logs('FocusError', e); }

        Ext.each(columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch (dataIndex) {
                case 'wh_qty':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
            }
        });

        var wh_qty_old = 0;
        var wh_qty_new = 0;
        var available_qty = 0;
        var unique_id = 0;
        var stoqty_uid = 0;

        var deliveryPendingGrid = Ext.create('Ext.grid.Panel', {
            store: this.detailStore,
            title: title,
            cls: 'rfx-panel',
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            autoload: true,
            forceFit: false,
            collapsible: false,
            layout: 'fit',
            dockedItems: dockedItems,
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

                    //gMain.selPanel.downListRecord(record);
                }, //endof itemdblclick
                cellkeydown: function (deliveryPendingGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {

                    }

                },
                itemclick: function (view, rec, htmlItem, index, eventObject, opts) {
                    wh_qty_old = rec.get('wh_qty');
                    available_qty = rec.get('available_qty');
                    unique_id = rec.get('unique_id');
                    stoqty_uid = rec.get('stoqty_uid');
                },
                edit: function (view, rec, opts) {

                    wh_qty_new = rec.value;

                    if (wh_qty_new - wh_qty_old > available_qty) {
                        Ext.Msg.alert('경고', '추가 신청하려는 수량이 현재 신청 가능한 수량보다 많습니다.');
                        this.store.rejectChanges();
                    } else {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/sales/product.do?method=updateProductQty',
                            params: {
                                wh_qty: wh_qty_new,
                                wh_qty_old: wh_qty_old - wh_qty_new,
                                unique_id: unique_id,
                                stoqty_uid: stoqty_uid
                            },
                            success: function (result, request) {
                                var result = result.responseText;
                                gm.me().deliveryPendingGrid.getStore().load();
                            },
                            failure: extjsUtil.failureMessage
                        });
                    }
                }
            },//endof listeners
            columns: columns
        });
        gm.me().deliveryPendingGrid = deliveryPendingGrid;
        deliveryPendingGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                fc(selections);
            }
        });

        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
        tabPanel.removeAll(false);
        tabPanel.add(deliveryPendingGrid);
        this.detailStore.load();
    },

    attachedCarPhoto: function (rtgast_uid, type, reserved_varcharh) {
        var form = Ext.create('Ext.ux.upload.Panel', {
            uploader: 'Ext.ux.upload.uploader.FormDataUploader',
            id: gu.id('formPanel'),
            synchronous: true,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            uploaderOptions: {
                url: CONTEXT_PATH + '/uploader.do?method=uploadPhotoHj&pj_uid=' + rtgast_uid + '&pj_code=' + type + '&menu_code=SDL1&reserved_varcharh=' + reserved_varcharh,
            },
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '사진파일 첨부',
            width: 800,
            height: 600,
            plain: false,
            items: form,
            buttons: [{
                text: '닫기',
                handler: function (btn) {
                    if (btn == 'no') {
                        gm.me().fileContentStore.getProxy().setExtraParam('file_code', rtgast_uid + '_DLP');
                        gm.me().fileContentStore.load(function (record) {
                            objs = [];
                            gm.me().fileContentRecords = record;
                            var obj = {};
                            console_logs(gm.me().fileContentRecords);
                            var rec = gm.me().fileContentRecords;
                            var columns = [];
                            for (var i = 0; i < rec.length; i++) {
                                var sel = rec[i];
                                var objv = {};
                                console_logs('>>> sel', sel);
                                var file_path = sel.get('file_path');
                                var object_name = sel.get('object_name');
                                var file_ext = sel.get('file_ext');
                                objv['file_path'] = file_path;
                                objv['object_name'] = object_name;
                                objv['file_ext'] = file_ext;
                                columns.push(objv);
                            }
                            obj['datas'] = columns;
                            objs.push(obj);
                            console_logs('>>>> objs >>>>> ', objs);
                        })
                        prWin.close();
                    } else {
                        gm.me().fileContentStore.getProxy().setExtraParam('file_code', rtgast_uid + '_DLP');
                        gm.me().fileContentStore.load(function (record) {
                            objs = [];
                            gm.me().fileContentRecords = record;
                            var obj = {};
                            console_logs(gm.me().fileContentRecords);
                            var rec = gm.me().fileContentRecords;
                            var columns = [];
                            for (var i = 0; i < rec.length; i++) {
                                var sel = rec[i];
                                var objv = {};
                                console_logs('>>> sel', sel);
                                var file_path = sel.get('file_path');
                                var object_name = sel.get('object_name');
                                var file_ext = sel.get('file_ext');
                                objv['file_path'] = file_path;
                                objv['object_name'] = object_name;
                                objv['file_ext'] = file_ext;
                                columns.push(objv);
                            }
                            obj['datas'] = columns;
                            objs.push(obj);
                            console_logs('>>>> objs >>>>> ', objs);
                        })
                        prWin.close();
                    }
                }
            }]
        });
        prWin.show();
    },

    editRedord: function (field, rec) {
        switch (vCompanyReserved4) {
            case 'DOOS01KR':
                var value = rec.get(field);
                var tableName = gm.getTableName(field);
                var whereField = "dl_uid";
                switch (gm.getTableName(field)) {
                    case 'sledel':
                        var whereValue = rec.get("unique_id");
                        gm.editAjax(tableName, field, value, whereField, whereValue, { type: '' });
                        break;
                    default:
                        gm.editRedord(field, rec);
                }
                this.getStore().load();
                break;
            default:
                gm.editRedord(field, rec);
        }
    },

    printBarcode: function (rec) {
        var selections = null;
        selections = gm.me().grid.getSelectionModel().getSelection();
        if (selections.length > 1) {
            Ext.Msg.alert('알림', '바코드를 출력할 정보를 선택하십시오.');
        } else {
            var uid = rec.get('srcahd_uid'); // 바코드 일련번호
            var make_no = rec.get('project_varcharh'); // 수주번호
            var wearing_date = rec.get('project_timestamp1_str'); // 입고일
            var customer_name = rec.get('project_varchar2'); // 고객명
            var car_name = rec.get('project_varchar3'); // 차명
            var delivery_plan = '';// 출고 예정일
            var project_number1 = rec.get('project_number1');
            delivery_plan = rec.get('delivery_plan');
            var injung_name = rec.get('assymap_varchar5');
            gu.getCmp('injung_name').setValue(injung_name);
            if (delivery_plan == null) {
                delivery_plan = '';
            }
            gm.me().getBarcodeHtml(rec, injung_name);
            gm.me().prbarcodeopen(gm.me().form, rec);
        }
    },

    formatDate: function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('/');
    },

    getBarcodeHtml: function (rec, injung_name) {
        var customerName = rec.get('project_varchar2');      // 고객명
        var project_varcharh = rec.get('reserved_varcharh');  // 수주번호
        var reserved_timestamp1 = rec.get('project_timestamp1_str');  // 입고일
        var project_varchar3 = rec.get('reserved_varchar3');
        var delivery_plan = rec.get('gr_date'); // 출고일
        var reserved_timestamp1_date = '';
        if (reserved_timestamp1.length > 0) {
            reserved_timestamp1_date = gm.me().formatDate(reserved_timestamp1);
        }
        else {
            reserved_timestamp1_date = '';
        }

        var delivery_plan_date = gm.me().formatDate(delivery_plan);
        var proejct_varchari = rec.get('reserved_varchari');
        var order_type = rec.get('pj_name');
        var pmWithCount = rec.get('pmWithCount');

        if (delivery_plan == null) {
            delivery_plan_date = '';
        }
        var htmlData =
            '<div style = "margin: 10px auto; width: 350px; height: 180px; box-shadow: 0 0 10px #999999; border-radius: 5px;">'
            + '<table>'
            + '<tr>'
            + '</tr>'
            + '<tr>'
            + '<td colspan="4" style="vertical-align: top; ">' +
            '<div style ="margin: 7px; font-weight: bold; font-family: 맑은 고딕 !important; font-size:20px; width: 350px; height: 20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'
            //+'<div style ="padding: 10px 0px 0px 0px; font-family: 맑은 고딕 !important; font-size:30px; height: 30px; width: 350px; white-space:nowrap; ">'
            + "[출고]" + project_varcharh +
            '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'
            + pmWithCount + '</div>'
            //+ '</div>'
            + '</div>' +
            '<div style ="margin: 7px; font-family: 맑은 고딕 font-size:25px;  !important; width: 350px; height: 15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
            '차대번호:' + proejct_varchari /**+ '&nbsp&nbsp입고:' + reserved_timestamp1_date +'&nbsp&nbsp출고:' + delivery_plan_date**/ + '</div>' +
            '<div style ="margin: 7px; font-family: 맑은 고딕 font-size:25px;  !important; width: 350px; height: 15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
            '제작명: ' + order_type + '/' + project_varchar3 + '&nbsp&nbsp&nbsp&nbsp</div>' +
            '<div style ="margin: 7px; font-family: 맑은 고딕 font-size:25px;  !important; width: 350px; height: 15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
            '인증명:' + injung_name + '</div>' +
            '<div style ="margin: 7px; font-family: 맑은 고딕 font-size:25px;  !important; width: 350px; height: 15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' +
            '입고일:' + reserved_timestamp1_date + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp출고일: ' + delivery_plan_date + '</div>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td cellpadding="30px" colspan="6" style ="font-weight: bold;">' +
            '<div style="width: 345px; height: 30px; background-color: #333333; font-family: 맑은 고딕 !important; ' +
            'color: white; text-align: center;">' +
            'Barcode 공간</div>' +
            '</td>' +
            '</tr>' +
            '</div>';

        if (gu.getCmp('barcodeHtml') != undefined && gu.getCmp('barcodeHtml') != null) {
            gu.getCmp('barcodeHtml').setHtml(htmlData);
        }
    },

    prbarcodeopen: function (form, rec) {
        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '출고바코드 출력',
            closeAction: 'hide',
            plain: true,
            items: [
                form
            ],
            buttons: [{
                text: '출력하기',
                handler: function () {
                    var form = gu.getCmp('barcodeformPanel').getForm();
                    var val = form.getValues(false);
                    var uid = rec.get('srcahd_uid');
                    var delivery_plan = rec.get('delivery_plan');
                    var make_no = rec.get('reserved_varcharh');
                    var order_type = rec.get('pj_name');
                    var delivery_plan_date = gm.me().formatDate(delivery_plan);
                    var reserved_timestamp1 = rec.get('project_timestamp1_str');
                    var injung_name = val['injung_name'];
                    var reserved_timestamp1_date = '';
                    if (reserved_timestamp1.length > 0) {
                        reserved_timestamp1_date = gm.me().formatDate(reserved_timestamp1);
                    }
                    var desc = rec.get('reserved_varchar2');
                    var car_name = rec.get('reserved_varchar3');
                    var project_number1 = rec.get('reserved_varchari');
                    var pmWithCount = rec.get('pmWithCount');
                    var print_qty = gu.getCmp('print_qty').getValue();

                    console_logs('>>>>> delivery_plan', delivery_plan);
                    form.submit({
                        url: CONTEXT_PATH + '/production/schdule.do?method=printPrdDeliveryBarcode',
                        params: {
                            unique_id: uid,
                            injung_name: injung_name,
                            make_no: make_no,
                            wearing_date: reserved_timestamp1_date,
                            delivery_plan: delivery_plan_date,
                            desc: desc,
                            project_number1: project_number1,
                            print_qty: print_qty,
                            order_type: order_type,
                            car_name: car_name,
                            pmWithCount: pmWithCount
                        },
                        success: function (val, action) {
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 완료하였습니다.');
                            gm.me.store.load();
                        },
                        failure: function (val, action) {
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            gm.me.store.load();
                        }
                    });
                }
            }, {
                text: '닫기',
                handler: function () {
                    if (prWin) {
                        prWin.close();
                    }
                }
            }]
        });
        prWin.show();
    },

    items: [],
    selected_rec: null,
    deliveryPendingGrid: null
});
