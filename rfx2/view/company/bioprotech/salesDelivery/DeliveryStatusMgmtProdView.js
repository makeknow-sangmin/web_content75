//수주관리 메뉴
Ext.define('Rfx2.view.company.bioprotech.salesDelivery.DeliveryStatusMgmtProdView', {
    extend    : 'Rfx2.base.BaseView',
    xtype     : 'recv-mgmt-kbtech-view',
    inputBuyer: null,

    onSortChange: function (container, column, direction, eOpts) {
        console_logs('column', column);
        console_logs('direction', direction);
    },

    initComponent: function () {

        this.on('sortchange', this.onSortChange, this);

        this.setDefValue('regist_date', new Date());
        // 삭제할때 사용할 필드 이름.
        this.setDefValue('h_reserved6', vCUR_USER_NAME);
        this.setDefValue('h_reserved5', vCUR_DEPT_NAME);
        this.setDefValue('pm_uid', vCUR_USER_UID);
        this.setDefValue('pm_name', vCUR_USER_NAME);
        // 검색툴바 필드 초기화
        this.initSearchField();

        // this.addSearchField({
        //     type: 'dateRange',
        //     field_id: 'regist_date',
        //     text: gm.getMC('CMD_Order_day', '오더일'),
        //     sdate: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
        //     edate: new Date()
        // });

        this.addSearchField({
            type    : 'dateRange',
            field_id: 'rtgastdl_timestamp1',
            text    : gm.getMC('CMD_Date', '납품일자'),
            sdate   : Ext.Date.add(new Date(), Ext.Date.MONTH, -3),
            edate   : new Date()
        });

        this.addSearchField('request_no');
        this.addSearchField('buyer_name');
        this.addSearchField('order_number');
        this.addSearchField('item_name');
        this.addSearchField('product_lot');

        // 검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        // 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx2.model.company.bioprotech.DeliveryFinishStatusGroupLot', [{
                property : 'unique_id',
                direction: 'DESC2'
            }],
            gMain.pageSize/* pageSize */
            , {
                creator  : 'a.creator',
                unique_id: 'a.unique_id'
            }
            , ['sledel']
        );

        this.excelUploadAction = Ext.create('Ext.Action', {
            iconCls : 'af-upload-white',
            disabled: true,
            text    : '문서 업로드',
            tooltip : this.getMC('선적서류등 필요문서를 일괄 업로드 합니다.'),
            handler : function () {

                var gridContent = Ext.create('Ext.panel.Panel', {
                    cls        : 'rfx-panel',
                    id         : gu.id('gridContent2'),
                    collapsible: false,
                    region     : 'east',
                    multiSelect: false,
                    //autoScroll: true,
                    autoHeight: true,
                    frame     : false,
                    layout    : 'vbox',
                    forceFit  : true,
                    flex      : 1,
                    items     : [gm.me().createMsTab('SIZE', 'SI')]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal : true,
                    title : gm.me().getMC('CMD_FILE_UPLOAD', '파일 업로드'),
                    id    : gu.id('uploadPrWin'),
                    width : 500,
                    height: 500,
                    items : {
                        collapsible: false,
                        frame      : false,
                        region     : 'center',
                        layout     : {
                            type : 'vbox',
                            align: 'stretch'
                        },
                        margin     : '0 0 5 0',
                        flex       : 1,
                        items      : [gridContent]
                    }
                });

                prWin.show();
            }
        });

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls : 'af-download',
            itemId  : 'fileattachAction',
            disabled: true,
            tooltip : '문서 파일을 다운로드 및 추가 필요한 파일을 업로드 합니다.',
            text    : '문서 다운로드',
            handler : function (widget, event) {
                gm.me().attachFile();
            }
        });

        this.returnProduct = Ext.create('Ext.Action', {
            iconCls : 'af-reject',
            itemId  : 'addBlInfoAction',
            disabled: true,
            tooltip : '해당 제품을 반품처리 합니다.',
            hidden  : gu.setCustomBtnHiddenProp('returnProduct'),
            text    : gm.getMC('CMD_RETURN', '제품 반품'),
            handler : function (widget, event) {
                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                var boxPacking = null;
                var printQuan = null;
                var finance_rate = rec.get('finance_rate');
                if(finance_rate === 'N/A') {
                    finance_rate = 1;
                }

                var barcodeGridTwo = Ext.create('Ext.grid.Panel', {
                    store      : new Ext.data.Store(),
                    cls        : 'rfx-panel',
                    id         : gu.id('barcodeWareTwoGrid'),
                    collapsible: false,
                    multiSelect: false,
                    width      : 480,
                    height     : 400,
                    autoScroll : true,
                    autoHeight : true,
                    frame      : false,
                    border     : true,
                    layout     : 'fit',
                    forceFit   : false,
                    viewConfig : {
                        markDirty: false
                    },
                    columns    : [
                        // {
                        //     text     : 'LOT No',
                        //     width    : '30%',
                        //     style    : 'text-align:center',
                        //     dataIndex: 'input_lot',
                        //     name     : 'input_lot',
                        //     editor   : 'textfield',
                        //     sortable : false
                        // },
                        {
                            text     : '포장단위',
                            width    : '30%',
                            dataIndex: 'packing',
                            editor   : 'numberfield',
                            style    : 'text-align:center',
                            align    : 'right',
                            value    : boxPacking,
                            listeners: {},
                            renderer : function (value) {
                                boxPacking = value;
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                            sortable : false
                        },
                        {
                            text     : '박스 수량',
                            width    : '30%',
                            dataIndex: 'each',
                            editor   : 'numberfield',
                            sortable : false,
                            style    : 'text-align:center',
                            align    : 'right',
                            // value: printQuan,
                            renderer: function (value) {
                                printQuan = value;
                                return Ext.util.Format.number(value, '0,00/i');
                            },
                        },
                        {
                            text     : '자재 총 수량  ',
                            width    : '35%',
                            dataIndex: 'totalQuan',
                            style    : 'text-align:center',
                            align    : 'right',
                            sortable : false,
                            renderer : function (val, meta, record, rowIndex) {
                                return Ext.util.Format.number(record.get('packing') * record.get('each'), '0,00/i');
                            }
                        }
                    ],
                    selModel   : 'cellmodel',
                    plugins    : {
                        ptype       : 'cellediting',
                        clicksToEdit: 2
                    },
                    listeners  : {},
                    autoScroll : true,
                    dockedItems: [
                        Ext.create('widget.toolbar', {
                            plugins: {
                                boxreorderer: false
                            },
                            cls    : 'my-x-toolbar-default2',
                            margin : '0 0 0 0',
                            items  : [
                                '->',
                                {
                                    text     : '추가',
                                    listeners: [{
                                        click: function () {
                                            var grQuan = gu.getCmp('return_qty').getValue();
                                            console_logs('>>>> grQuan', grQuan);
                                            if (grQuan === null || grQuan <= 0) {
                                                Ext.MessageBox.alert('알림', '총 입고수량이 입력되지 않았습니다.')
                                            } else {
                                                var store_cnt = gu.getCmp('barcodeWareTwoGrid').getStore().getCount();
                                                if (store_cnt > 0) {
                                                    if (finance_rate == 0 || finance_rate == 1 || finance_rate < 0 ) {
                                                        gu.getCmp('barcodeWareTwoGrid').getStore().insert(store_cnt + 1, new Ext.data.Record({
                                                            'each'     : 1,
                                                            'packing'  : grQuan,
                                                            'multiple' : grQuan,
                                                            'totalQuan': grQuan
                                                        }));
                                                    } else {
                                                        var divNum = parseInt(grQuan / finance_rate); //몫
                                                        var resNum = grQuan - divNum * finance_rate;
                                                        console_logs('grQuan', grQuan);
                                                        console_logs('divNum', divNum);
                                                        console_logs('resNum', resNum);
                                                        if (divNum > 0) {
                                                            gu.getCmp('barcodeWareTwoGrid').getStore().insert(store_cnt + 1, new Ext.data.Record({
                                                                'each'     : divNum,
                                                                'packing'  : finance_rate,
                                                                'multiple' : divNum * finance_rate,
                                                                'totalQuan': divNum * finance_rate
                                                            }));
                                                        }

                                                        if (resNum > 0) {
                                                            gu.getCmp('barcodeWareTwoGrid').getStore().insert(store_cnt + 2, new Ext.data.Record({
                                                                'each'     : 1,
                                                                'packing'  : resNum,
                                                                'multiple' : grQuan - (divNum * finance_rate),
                                                                'totalQuan': grQuan - (divNum * finance_rate)
                                                            }));
                                                        }
                                                    }
                                                } else {
                                                    console_logs('>>>> finance_rate', finance_rate)
                                                    if (finance_rate == 0 || finance_rate == 1 || finance_rate < 0 || finance_rate === 'N/A') {
                                                        gu.getCmp('barcodeWareTwoGrid').getStore().insert(0, new Ext.data.Record({
                                                            'each'     : 1,
                                                            'packing'  : grQuan,
                                                            'multiple' : grQuan,
                                                            'totalQuan': grQuan
                                                        }));
                                                    } else {

                                                        var divNum = parseInt(grQuan / finance_rate); //몫
                                                        var resNum = grQuan - divNum * finance_rate;
                                                        console_logs('grQuan', grQuan);
                                                        console_logs('divNum', divNum);
                                                        console_logs('resNum', resNum);
                                                        if (divNum > 0) {
                                                            gu.getCmp('barcodeWareTwoGrid').getStore().insert(0, new Ext.data.Record({
                                                                'each'     : divNum,
                                                                'packing'  : finance_rate,
                                                                'multiple' : divNum * finance_rate,
                                                                'totalQuan': divNum * finance_rate
                                                            }));
                                                        }


                                                        if (resNum > 0) {
                                                            gu.getCmp('barcodeWareTwoGrid').getStore().insert(1, new Ext.data.Record({
                                                                'each'     : 1,
                                                                'packing'  : resNum,
                                                                'multiple' : grQuan - (divNum * finance_rate),
                                                                'totalQuan': grQuan - (divNum * finance_rate)
                                                            }));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }]
                                },
                                {
                                    text     : '삭제',
                                    listeners: [{
                                        click: function () {
                                            var record = gu.getCmp('barcodeWareTwoGrid').getSelectionModel().getSelected().items[0];
                                            gu.getCmp('barcodeWareTwoGrid').getStore().removeAt(gu.getCmp('barcodeWareTwoGrid').getStore().indexOf(record));
                                        }
                                    }]
                                }

                            ]
                        })
                    ]
                });

                var form = Ext.create('Ext.form.Panel', {
                    xtype        : 'form',
                    frame        : false,
                    border       : false,
                    bodyPadding  : 10,
                    region       : 'center',
                    layout       : 'form',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget : 'side'
                    },
                    items        : [
                        {
                            xtype: 'fieldset',
                            title: gm.getMC('CMD_RETURN_DESC', '해당 제품을 수주 Site로 반품처리 및 납품수량을 감소처리합니다.<br>위 작업은 취소할 수 없습니다.'),
                            items: [
                                {
                                    xtype       : 'datefield',
                                    id          : gu.id('bring_date'),
                                    anchor      : '97%',
                                    name        : 'bring_date',
                                    submitFormat: 'Y-m-d',
                                    dateFormat  : 'Y-m-d',
                                    format      : 'Y-m-d',
                                    value       : new Date(),
                                    fieldLabel  : gm.getMC('CMD_RETURN_DATE', '반입일자')
                                },
                                {
                                    xtype     : 'numberfield',
                                    id        : gu.id('return_qty'),
                                    anchor    : '97%',
                                    name      : 'return_qty',
                                    fieldLabel: gm.getMC('CMD_RETURN_QTY', '반품수량')
                                },
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: '아래를 추가하여 해당 LOT의 반입수량으로 <b>바코드를 재발행</b>을 실시합니다.<br>',
                            items: [
                                barcodeGridTwo
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal  : true,
                    title  : '반품처리',
                    width  : 550,
                    height : 700,
                    items  : form,
                    buttons: [
                        {
                            text   : CMD_OK,
                            scope  : this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title  : '반품처리',
                                    msg    : '선택 한 건에 대하여 반품처리를 하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon   : Ext.MessageBox.QUESTION,
                                    fn     : function (btn) {
                                        if (btn == "no" || btn == "cancel") {
                                            return;
                                        } else {
                                            var val = form.getValues(false);
                                            var return_qty = val['return_qty'];
                                            var out_qty = rec.get('gr_qty');
                                            var store = gu.getCmp('barcodeWareTwoGrid').getStore();
                                            console_logs('>>>>> return_qty', return_qty.replace(/,/g, ""));
                                            console_logs('>>>>> out_qty', out_qty);
                                            var return_qty_number = parseInt(return_qty.replace(/,/g, ""));
                                            console_logs('>>>>> return_qty_number', return_qty_number);
                                            if (return_qty_number > out_qty) {
                                                Ext.MessageBox.alert('오류', '출고 수량보다 많은 반입수량이 입력되었습니다.<br>다시 확인해주세요.');
                                                return;
                                            } else {

                                                var totalIndex = store.getCount();
                                                console_logs('>>>> totalIndex', totalIndex);

                                                if (totalIndex > 0) {

                                                    var packingCount = 0;
                                                    var printCount = 0;
                                                    var multiple = 0;

                                                    var quanArray = []; //포장수량 배열
                                                    var printQuanArray = [];   //출력 매수 배열

                                                    for (var i = 0; i < totalIndex; i++) {
                                                        var vo = store.data.items[i];
                                                        var packing = vo.get('packing');
                                                        var each = vo.get('each');
                                                        quanArray.push(packing);
                                                        printQuanArray.push(each);
                                                        packingCount = packingCount + packing;
                                                        printCount = printCount + each;
                                                        multiple = multiple + packing * each;
                                                    }
                                                    if (multiple < return_qty || multiple > return_qty) {
                                                        Ext.MessageBox.alert('알림', '반입수량 보다 크거나 작습니다.');
                                                    } else {
                                                        Ext.Ajax.request({
                                                            url: CONTEXT_PATH + '/sales/delivery.do?method=returnProduct',
                                                            params: {
                                                                return_qty : return_qty_number, // 반품수량
                                                                bring_date : gu.getCmp('bring_date').getValue(), // 반입일자
                                                                sloast_uid : rec.get('sloast_uid'), // sloast_uid
                                                                project_uid : rec.get('pj_uid'), // project_uid
                                                                lot_no : rec.get('product_lot'), // lot_no
                                                                unique_id : rec.get('unique_id_long') ,// sledel_uid,
                                                                quanArray : quanArray,
                                                                printQuanArray : printQuanArray
                                                            },
                                                            success: function (val, action) {
                                                                Ext.Msg.alert('완료', '반품처리가 완료되었습니다.');
                                                                gm.me().store.load();
                                                                if (prWin) {
                                                                    prWin.close();
                                                                }
                                                            },
                                                            failure: function (val, action) {

                                                            }
                                                        });
                                                    }
                                                } else {
                                                    Ext.MessageBox.alert('알림', '바코드를 생성하는 정보가 입력되지 않았습니다.');
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        },
                        {
                            text   : CMD_CANCEL,
                            scope  : this,
                            handler: function () {
                                prWin.close();
                            }
                        }
                    ]
                });

                prWin.show();
            }
        });


        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(1, this.returnProduct);
        // buttonToolbar.insert(2, this.fileattachAction);

        // buttonToolbar.insert(2, this.excelUploadAction);
        // buttonToolbar.insert(1, this.rollbackPoOnlyPrdAceeptAction);
        // // buttonToolbar.insert(2, this.copyPoAction);
        // buttonToolbar.insert(2, this.cancelPo);
        // buttonToolbar.insert(3, this.printPIAction);
        // buttonToolbar.insert(4, this.changePo);
        // 그리드 생성
        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGridCore(arr/** , option**/);

        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length > 0) {
                console_logs('>>>>>>> callback datas', selections);
                var rec = selections[0];
                this.returnProduct.enable();
                // this.addBlInfoAction.enable();
                // this.fileattachAction.enable();
            } else {
                this.returnProduct.disable();
                // this.addBlInfoAction.disable();
                // this.fileattachAction.disable();
            }
        });

        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items : [this.grid, this.crudTab]
        });
        this.callParent(arguments);
        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        this.store.load(function (records) {
        });
    },

    createMsTab: function (title, tabname) {

        var record = gm.me().grid.getSelectionModel().getSelection()[0];
        if (this.stores.length < 1) {
            this.stores.push(Ext.create('Ext.data.Store', {
                fields: ['name', 'size', 'file', 'status']
            }));
        }

        var sc = this.storecount/*++*/;

        var tabDataUpload = Ext.create('Ext.panel.Panel', {
            //title: title,
            tabPosition: 'bottom',
            plain      : true,
            width      : '100%',
            items      : [
                {
                    xtype: 'form',
                    items: [
                        {
                            items: [{
                                multiSelect: true,
                                xtype      : 'grid',
                                id         : 'UploadGrid' + [sc],
                                selModel   : Ext.create("Ext.selection.CheckboxModel"),
                                columns    : [{
                                    header   : gm.me().getMC('mes_sro5_pln_column_file_name', '파일명'),
                                    dataIndex: 'name',
                                    style    : 'text-align:center',
                                    flex     : 2
                                }, {
                                    header   : gm.me().getMC('mes_sro5_pln_column_file_size', '파일크기'),
                                    dataIndex: 'size',
                                    style    : 'text-align:center',
                                    flex     : 1,
                                    renderer : Ext.util.Format.fileSize
                                }, {
                                    header   : gm.me().getMC('mes_sro5_pln_column_status', '상태'),
                                    dataIndex: 'status',
                                    style    : 'text-align:center',
                                    flex     : 1,
                                    renderer : this.rendererStatus
                                }, {
                                    // header: gm.me().getMC('mes_sro5_pln_column_status', '도면종류'),
                                    header   : '문서종류',
                                    dataIndex: 'srccst_varchar2',
                                    style    : 'text-align:center',
                                    flex     : 1,
                                    editor   : {
                                        xtype       : 'combobox',
                                        displayField: 'codeName',
                                        css         : 'edit-cell',
                                        editable    : false,
                                        // forceSelection: true,
                                        // mode: 'local',
                                        store        : gm.me().docuTypeStore,
                                        triggerAction: 'all',
                                        valueField   : 'codeName'
                                    }
                                    // renderer: this.rendererStatus

                                }],
                                viewConfig : {
                                    emptyText     : gm.me().getMC('mes_sro5_pln_msg_drag', '이곳에 파일을 끌어 놓으세요'),
                                    height        : 700,
                                    deferEmptyText: false
                                },
                                plugins    : {
                                    ptype       : 'cellediting',
                                    clicksToEdit: 2,
                                },
                                store      : this.stores[sc],

                                listeners: {

                                    drop: {
                                        element: 'el',
                                        fn     : 'drop'
                                    },

                                    dragstart: {
                                        element: 'el',
                                        fn     : 'addDropZone'
                                    },

                                    dragenter: {
                                        element: 'el',
                                        fn     : 'addDropZone'
                                    },

                                    dragover: {
                                        element: 'el',
                                        fn     : 'addDropZone'
                                    },

                                    dragleave: {
                                        element: 'el',
                                        fn     : 'removeDropZone'
                                    },

                                    dragexit: {
                                        element: 'el',
                                        fn     : 'removeDropZone'
                                    },

                                },

                                noop: function (e) {
                                    e.stopEvent();
                                },

                                addDropZone: function (e) {
                                    if (!e.browserEvent.dataTransfer || Ext.Array.from(e.browserEvent.dataTransfer.types).indexOf('Files') === -1) {
                                        return;
                                    }

                                    e.stopEvent();

                                    this.addCls('drag-over');
                                },

                                removeDropZone: function (e) {
                                    var el = e.getTarget(),
                                        thisEl = this.getEl();

                                    e.stopEvent();


                                    if (el === thisEl.dom) {
                                        this.removeCls('drag-over');
                                        return;
                                    }

                                    while (el !== thisEl.dom && el && el.parentNode) {
                                        el = el.parentNode;
                                    }

                                    if (el !== thisEl.dom) {
                                        this.removeCls('drag-over');
                                    }

                                },

                                drop: function (e) {

                                    e.stopEvent();
                                    Ext.Array.forEach(Ext.Array.from(e.browserEvent.dataTransfer.files), function (file) {
                                        gm.me().stores[0].add({
                                            file  : file,
                                            name  : file.name,
                                            size  : file.size,
                                            status: '대기'

                                        });
                                    });
                                    this.removeCls('drag-over');
                                },

                                tbar: [{
                                    text   : gm.me().getMC('mes_sro5_pln_btn_upload', '업로드'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
                                        for (var i = 0; i < l_store.data.items.length; i++) {
                                            if (!(l_store.getData().getAt(i).data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                                                l_store.getData().getAt(i).data.status = gm.me().getMC('mes_sro5_pln_btn_uploading', '업로드중');
                                                l_store.getData().getAt(i).commit();
                                                gm.me().postDocument(CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long'),
                                                    l_store, i, tabname);
                                            }
                                        }
                                    }
                                }, {
                                    text   : gm.me().getMC('mes_sro5_pln_btn_remove_all', '전체삭제'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
                                        l_store.reload();
                                    }
                                }, {
                                    text   : gm.me().getMC('mes_sro5_pln_btn_remove_optionally', '선택삭제'),
                                    handler: function () {
                                        var l_store = gm.me().stores[0];
                                        l_store.remove(Ext.getCmp('UploadGrid0').getSelection());
                                    }
                                }]
                            }],
                        }
                    ]
                }
            ]
        });
        return tabDataUpload;
    },

    postDocument: function (url, store, i, tabname) {

        var xhr = new XMLHttpRequest();
        xhr.timeout = 30000; // time in milliseconds
        var fd = new FormData();
        fd.append("serverTimeDiff", 0);
        xhr.open("POST", url, true);
        fd.append('index', i);
        fd.append('file', store.getData().getAt(i).data.file);
        fd.append('upload_type', /*gu.getCmp('measureType').lastValue.radio1*/'DELIVERY');
        fd.append('srccst_varchar2', store.getData().getAt(i).data.srccst_varchar2);
        //fd.append('product_type', 'BW');

        xhr.setRequestHeader("serverTimeDiff", 0);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.responseText.length > 1) {
                    if (store.getData().getAt(i) !== undefined) {
                        store.getData().getAt(i).data.status = gm.me().getMC('sro1_completeAction', '완료');
                    }
                    for (var j = 0; j < store.data.items.length; j++) {
                        var record = store.getData().getAt(j);
                        if ((record.data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                            store.remove(record);
                            j--;
                        }
                    }
                } else {
                    store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                }
                //store.getData().getAt(i).commit();
                var data = Ext.util.JSON.decode(xhr.responseText).datas;
            } else if (xhr.readyState == 4 && (xhr.status == 404 || xhr.status == 500)) {
                store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
                store.getData().getAt(i).commit();
            } else {
                for (var j = 0; j < store.data.items.length; j++) {
                    var record = store.getData().getAt(j);
                    store.remove(record);
                    j--;
                }
                if (store.data.items.length == 0 && gu.getCmp('uploadPrWin') != undefined) {
                    gu.getCmp('uploadPrWin').close();
                    gm.me().showToast(gm.me().getMC('mes_sro5_pln_header_reflection', '반영중'),
                        gm.me().getMC('mes_sro5_pln_msg_reflection', '데이터를 반영 중입니다. 잠시 후 새로고침 하시기 바랍니다.'));
                }
            }
        };
        xhr.send(fd);
    },


    attachFile: function () {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('rtgastdo_uid'));
        // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });

        var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title      : '첨부된 파일 리스트',
            store      : this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId    : 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock : 'top',
                xtype: 'toolbar',
                cls  : 'my-x-toolbar-default2',
                items: [
                    {
                        xtype  : 'button',
                        text   : '파일 업로드',
                        scale  : 'small',
                        iconCls: 'af-upload-white',
                        scope  : this.fileGrid,
                        handler: function () {
                            console_logs('=====aaa', record);
                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader       : 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous    : true
                            });

                            var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일첨부',
                                panel      : uploadPanel
                            });

                            this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
                                console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                console_logs('this.mon uploadcomplete manager', manager);
                                console_logs('this.mon uploadcomplete items', items);
                                console_logs('this.mon uploadcomplete errorCount', errorCount);
                                gm.me().uploadComplete(items);
                                uploadDialog.close();
                            }, this);
                            uploadDialog.show();
                        }
                    },
                    {
                        xtype  : 'button',
                        text   : '파일삭제',
                        scale  : 'small',
                        iconCls: 'af-remove',
                        scope  : this.fileGrid,
                        handler: function () {
                            console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
                            if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                                var unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                                var file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                                if (unique_id != null) {
                                    Ext.Ajax.request({
                                        url    : CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params : {
                                            file_path: file_path,
                                            unique_id: unique_id
                                        },
                                        success: function (result, request) {
                                            Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                                            gm.me().attachedFileStore.load(function (records) {
                                                if (records != null) {
                                                    var o = gu.getCmp('file_quan');
                                                    if (o != null) {
                                                        o.update('파일 수 : ' + records.length);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
                            }

                        }
                    },
                    {
                        xtype  : 'button',
                        text   : '새로고침',
                        scale  : 'small',
                        scope  : this.fileGrid,
                        handler: function () {
                            gm.me().attachedFileStore.load();
                        }
                    },
                    this.removeActionFile,
                    '-',
                    this.sendFileAction,
                    '->',
                    {
                        xtype: 'component',
                        id   : gu.id('file_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html : '파일 수 : 0'
                    },

                ]
            }

            ],
            columns    : [
                {
                    text     : '파일 일련번호',
                    width    : 100,
                    style    : 'text-align:center',
                    sortable : true,
                    dataIndex: 'id'
                },
                {
                    text     : '파일명',
                    style    : 'text-align:center',
                    flex     : 0.7,
                    sortable : true,
                    dataIndex: 'object_name'
                },
                {
                    text     : '파일유형',
                    style    : 'text-align:center',
                    width    : 70,
                    sortable : true,
                    dataIndex: 'file_ext'
                },
                {
                    text     : '업로드 날짜',
                    style    : 'text-align:center',
                    width    : 160,
                    sortable : true,
                    dataIndex: 'create_date'
                },
                {
                    text     : 'size',
                    width    : 100,
                    sortable : true,
                    xtype    : 'numbercolumn',
                    format   : '0,000',
                    style    : 'text-align:center',
                    align    : 'right',
                    dataIndex: 'file_size'
                },
                {
                    text    : '문서종류',
                    width   : 100,
                    sortable: true,
                    // xtype: 'numbercolumn',
                    // format: '0,000',
                    style: 'text-align:center',
                    // align: 'right',
                    dataIndex: 'file_usage'
                },
                {
                    text     : '등록자',
                    style    : 'text-align:center',
                    width    : 70,
                    sortable : true,
                    dataIndex: 'creator'
                },
            ]
        });

        var win = Ext.create('ModalWindow', {
            title     : '첨부파일',
            width     : 1300,
            height    : 600,
            minWidth  : 250,
            minHeight : 180,
            autoScroll: true,
            layout    : {
                type : 'vbox',
                align: 'stretch'
            },
            xtype     : 'container',
            plain     : true,
            items     : [
                this.fileGrid
            ],
            buttons   : [{
                text   : CMD_OK,
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

    uploadComplete: function (items) {

        console_logs('uploadComplete items', items);

        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });

        console_logs('파일업로드 결과', output);
        Ext.MessageBox.show({
            title  : '파일업로드 완료',
            icon   : Ext.MessageBox['INFO'],
            msg    : '파일첨부가 완료되었습니다.',
            buttons: Ext.MessageBox.OK,
            width  : 450
        });
        gm.me().store.load();

        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });
    },

    stores        : [],
    ingredientList: [],
    storecount    : 0,
    // gridContent2: null,
    fields       : [],
    docuTypeStore: Ext.create('Mplm.store.DocuTypeStore', {}),

    tempoaryFileGroupcode: function (min, max) {
        var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNum;
    },

    attachFileTemp: function (group_code) {
        this.attachedFileStore.getProxy().setExtraParam('group_code', group_code);

        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('파일 수 : ' + records.length);
                }

            }
        });

        var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title      : '첨부된 파일 리스트',
            store      : this.attachedFileStore,
            collapsible: false,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId    : 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock : 'top',
                xtype: 'toolbar',
                cls  : 'my-x-toolbar-default2',
                items: [
                    {
                        xtype  : 'button',
                        text   : '파일 업로드',
                        scale  : 'small',
                        iconCls: 'af-upload-white',
                        scope  : this.fileGrid,
                        handler: function () {
                            var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + group_code;
                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader       : 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions: {
                                    url: url
                                },
                                synchronous    : true
                            });
                            var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                dialogTitle: '파일첨부',
                                panel      : uploadPanel
                            });
                            this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
                                console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                console_logs('this.mon uploadcomplete manager', manager);
                                console_logs('this.mon uploadcomplete items', items);
                                console_logs('this.mon uploadcomplete errorCount', errorCount);
                                gm.me().uploadComplete(items);
                                uploadDialog.close();
                            }, this);
                            uploadDialog.show();
                        }
                    },
                    {
                        xtype  : 'button',
                        text   : '파일삭제',
                        scale  : 'small',
                        iconCls: 'af-remove',
                        scope  : this.fileGrid,
                        handler: function () {
                            console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
                            if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                                var unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                                var file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                                if (unique_id != null) {
                                    Ext.Ajax.request({
                                        url    : CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                                        params : {
                                            file_path: file_path,
                                            unique_id: unique_id
                                        },
                                        success: function (result, request) {
                                            Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                                            gm.me().attachedFileStore.load(function (records) {
                                                if (records != null) {
                                                    var o = gu.getCmp('file_quan');
                                                    if (o != null) {
                                                        o.update('파일 수 : ' + records.length);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
                            }
                        }
                    },
                    {
                        xtype  : 'button',
                        text   : '새로고침',
                        scale  : 'small',
                        scope  : this.fileGrid,
                        handler: function () {
                            gm.me().attachedFileStore.load();
                        }
                    },
                    // this.removeActionFile,
                    '-',
                    this.sendFileAction,
                    '->',
                    {
                        xtype: 'component',
                        id   : gu.id('file_quan'),
                        style: 'margin-right:5px;width:100px;text-align:right',
                        html : '파일 수 : 0'
                    },
                ]
            }

            ],
            columns    : [
                {
                    text     : '파일 일련번호',
                    width    : 100,
                    style    : 'text-align:center',
                    sortable : true,
                    dataIndex: 'id'
                },
                {
                    text     : '파일명',
                    style    : 'text-align:center',
                    flex     : 0.7,
                    sortable : true,
                    dataIndex: 'object_name'
                },
                {
                    text     : '파일유형',
                    style    : 'text-align:center',
                    width    : 70,
                    sortable : true,
                    dataIndex: 'file_ext'
                },
                {
                    text     : '업로드 날짜',
                    style    : 'text-align:center',
                    width    : 160,
                    sortable : true,
                    dataIndex: 'create_date'
                },
                {
                    text     : 'size',
                    width    : 100,
                    sortable : true,
                    xtype    : 'numbercolumn',
                    format   : '0,000',
                    style    : 'text-align:center',
                    align    : 'right',
                    dataIndex: 'file_size'
                },
                {
                    text     : '등록자',
                    style    : 'text-align:center',
                    width    : 70,
                    sortable : true,
                    dataIndex: 'creator'
                },
            ]
        });

        var win = Ext.create('ModalWindow', {
            title     : '첨부파일',
            width     : 1300,
            height    : 600,
            minWidth  : 250,
            minHeight : 180,
            autoScroll: true,
            layout    : {
                type : 'vbox',
                align: 'stretch'
            },
            xtype     : 'container',
            plain     : true,
            items     : [
                this.fileGrid
            ],
            buttons   : [{
                text   : CMD_OK,
                handler: function () {
                    if (win) {
                        win.close();
                    }
                }
            }, {
                text   : CMD_CANCEL,
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