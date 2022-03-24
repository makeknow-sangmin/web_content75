//구매요청
Ext.define('Rfx2.view.company.bioprotech.purStock.PurchaseRequestView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'purchase-request-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        //검색툴바 추가
        this.addSearchField({
            type: 'dateRange',
            field_id: 'req_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: new Date(new Date().getFullYear() + '-01-01'),
            //sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });
        this.addSearchField('pur_no');
        this.addSearchField('creator');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        console_logs('this.fields', this.fields);
        this.localSize = gm.unlimitedPageSize;
        this.createStore('Rfx2.model.company.bioprotech.PurchaseRequest', [{
                property: 'po_no',
                direction: 'DESC'
            }],
            this.localSize,
            {},
            ['rtgast']
        );

        Ext.define('CartMap', {
            extend: 'Ext.data.Model',
            fields: [{name: 'route_type', type: "string"},
                {name: 'sp_code', type: "string"},
                {name: 'item_code', type: "string"},
                {name: 'item_name', type: "string"},
                {name: 'specification', type: "string"},
                {name: 'maker_name', type: "string"},
                {name: 'quan', type: "string"},
                {name: 'static_sales_price', type: "string"},
                {name: 'total_price', type: "string"},
                {name: 'model_no', type: "string"},
                {name: 'comment', type: "string"},
                {name: 'creator', type: "string"},
                {name: 'pr_reason', type: "string"}
            ],
            proxy: {
                type: 'ajax',
                api: {
                    read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=detailCartMap',
                },
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success',
                    excelPath: 'excelPath'
                }
            }
        });

        Ext.define('SrcCst', {
            extend: 'Ext.data.Model',
            fields: [{name: 'object_name', type: "string"},
                {name: 'file_path', type: "string"},
                {name: 'file_size', type: "string"}],
            proxy: {
                type: 'ajax',
                api: {
                    read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=detailSrcCst',
                },
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success',
                    excelPath: 'excelPath'
                }
            }
        });

        cart_store = new Ext.data.Store({
            pageSize: getPageSize(),
            model: 'CartMap',
            sorters: [{
                property: 'length(pl_no), pl_no',
                direction: 'ASC'
            }]
        });

        file_store = new Ext.data.Store({
            pageSize: getPageSize(),
            model: 'SrcCst',
            sorters: [{
                property: 'unique_id',
                direction: 'DESC'
            }]
        });

        this.routingStore = Ext.create('Mplm.store.RoutingStore', {});

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);

        this.createCrudTab();

        this.store.remoteFilter = true;

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.editAction.setText('상세보기');
        this.setEditPanelTitle('상세보기');

        this.addTabCartLineGridPanel('상세보기', 'PPR3_SUB', {
                pageSize: 100,
                model: 'Rfx2.store.company.kbtech.CartMapStore',
                dockedItems: [
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default3',
                        items: [
                            '->',
//		 	   		    	excelPrint,
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
                    gm.me().selectPcsRecord = rec;
                    gm.me().parent = rec.get('parent');
                    gm.me().selectSpecification = rec.get('specification');

                } else {

                }
            },
            'cartLineGrid'//toolbar
        );

        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip: '구매요청서 출력',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('printPDFAction'),
            handler: function (widget, event) {
                var rtgast_uid = gm.me().vSELECTED_UNIQUE_ID;
                var po_no = gm.me().vSELECTED_PO_NO;
                var rtg_type = gm.me().vSELECTED_RTG_TYPE;
                var is_rotate = 'N';

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printPr',
                    params: {
                        rtgast_uid: rtgast_uid,
                        po_no: po_no,
                        pdfPrint: 'pdfPrint',
                        is_rotate: is_rotate,
                        rtg_type: rtg_type
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

        //요청접수 Action 생성
        this.reReceiveAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '요청 접수',
            tooltip: '요청 접수',
            disabled: true,
            hidden: gu.setCustomBtnHiddenProp('reReceiveAction'),
            handler: function () {

                gm.me().requestform = Ext.create('Ext.form.Panel', {

                    xtype: 'form',
                    frame: false,
                    border: false,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side',
                        margin: 10
                    },
                    items: []
                });

                var height = 170;

                var requestText = '요청 접수 하시겠습니까? 작성날짜를 기입하고 확인 버튼을 누르시기 바랍니다.';

                gm.me().requestform.add(
                    {
                        xtype: 'label',
                        width: 340,
                        text: requestText
                    }
                );

                gm.me().requestform.add(
                    {
                        fieldLabel: '작성날짜',
                        xtype: 'datefield',
                        value: new Date(),
                        name: 'recv_date',
                        format: 'Y-m-d',
                        id: gu.id('recv_date')
                    }
                );

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '구매요청',
                    width: 360,
                    height: height,
                    items: gm.me().requestform,
                    buttons: [
                        {
                            text: CMD_OK,
                            //scope:this,
                            handler: function () {

                                var recv_date = (gu.getCmp('recv_date') == undefined || gu.getCmp('recv_date') == null)
                                    ? null : gu.getCmp('recv_date').getValue();

                                prWin.setLoading(true);

                                var uniqueuid = gm.me().cartmapUids;

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/purchase/prch.do?method=createOrderCase',
                                    params: {
                                        cartmapUids: uniqueuid,
                                        recv_date: recv_date
                                    },

                                    success: function (result, request) {
                                        gm.me().store.load();
                                        Ext.Msg.alert('안내', '요청접수 되었습니다.', function () {
                                        });

                                        prWin.setLoading(false);

                                        if (prWin) {
                                            prWin.close();
                                        }

                                    },//endofsuccess
                                    failure: extjsUtil.failureMessage
                                });//endofajax
                            }
                        },
                        {
                            text: CMD_CANCEL,
                            scope: this,
                            handler: function () {
                                if (prWin) {
                                    prWin.close();
                                }
                            }
                        }
                    ]
                });
                prWin.show();
            }
        });
//
        //주문작성 Action 생성
        this.createPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '주문 작성',
            tooltip: '주문 작성',
            disabled: false,
            handler: function () {
                gm.me().treatPo();
            }//handler end...

        });

        //반려 Action 생성
        this.removeBAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '반려',
            tooltip: '반려',
            disabled: true,
            handler: function () {

                /*반려 사유 추가*/
                var inputItem = [];

                inputItem.push(
                    {
                        xtype: 'textfield',
                        name: 'reason',
                        fieldLabel: '반려사유',
                        allowBlank: true,
                        anchor: '-5'
                        //fieldStyle: 'background-color: #ddd; background-image: none;'
                    });

                var form = Ext.create('Ext.form.Panel', {
                    id: 'formBack',
                    defaultType: 'textfield',
                    border: false,
                    bodyPadding: 15,
                    width: 400,
                    height: 140,
                    defaults: {
                        // anchor: '100%',
                        editable: true,
                        allowBlank: false,
                        msgTarget: 'side',
                        labelWidth: 100
                    },
                    items: inputItem
                });
                var me = this;
                var win = Ext.create('ModalWindow', {
                    title: '반려 사유를 입력하시기 바랍니다',
                    width: 400,
                    height: 140,
                    minWidth: 250,
                    minHeight: 140,
                    items: form,
                    buttons: [{
                        text: CMD_OK,
                        handler: function () {
                            var form = Ext.getCmp('formBack');
                            var val = form.items.items[0].getValue();
                            me.companion = val;
                            //start
                            Ext.MessageBox.show({
                                title: '확인',
                                msg: '반려 하시겠습니까?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (result) {
                                    if (result == 'yes') {
                                        var selections = gm.me().grid.getSelectionModel().getSelection();
                                        for (var i = 0; i < selections.length; i++) {
                                            var rec = selections[i];
                                            var state = rec.get('state');
                                            if (state != 'A' && state != 'R') {
                                                Ext.Msg.alert('안내', '대기상태가 아닙니다.', function () {
                                                });
                                                return null;
                                            }
                                        }
                                        //var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
                                        var uniqueuid = gm.me().cartmapUids;
                                        console_logs("me.uniqueuid", uniqueuid);
                                        console_logs("me.companion", me.companion);
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/purchase/prch.do?method=destroyOrderCase',
                                            params: {
                                                cartmapUids: uniqueuid,
                                                delivery_info: me.companion // 반려사유
                                            },

                                            success: function (result, request) {
                                                gm.me().store.load();
                                                Ext.Msg.alert('안내', '반려 되었습니다.', function () {
                                                });

                                            },//endofsuccess
                                            failure: extjsUtil.failureMessage
                                        });//endofajax

                                    }
                                },
                                //animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                            //end
                            win.close();
                            //		      		});
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
                win.show(/* this, function(){} */);


            }
        });

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.printPDFAction);
        buttonToolbar.insert(1, this.removeBAction);
        buttonToolbar.insert(1, this.reReceiveAction);
        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length) {
                this.cartmapUids = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    this.cartmapUids.push(uids);
                }
                var rec = selections[0];

                gm.me().vSELECTED_UNIQUE_ID = rec.get('pr_uid'); //rtgast_uid
                gm.me().vSELECTED_PO_NO = rec.get('po_no'); //rtgast_uid
                gm.me().vSELECTED_RTG_TYPE = rec.get('rtg_type');
                console_logs("gm.me().vSELECTED_UNIQUE_ID>>>>>>>>>>", gm.me().vSELECTED_UNIQUE_ID);

                var pending_count = 0;

                for (var i = 0; i < selections.length; i++) {
                    var state = selections[i].get('status');
                    if (state == 'PR') {
                        pending_count++;
                    }
                }

                if (pending_count == selections.length) {
                    gm.me().reReceiveAction.enable();
                } else {
                    gm.me().reReceiveAction.disable();
                }
                gm.me().printPDFAction.enable();
                gm.me().removeBAction.enable();

            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().reReceiveAction.disable();
                gm.me().printPDFAction.disable();
                gm.me().removeBAction.disable();
            }
            this.cartLineGrid.getStore().getProxy().setExtraParam('rtgastuid', this.rtgast_uids);
            console_logs("this.rtgast_uids>>>>>>>>>>", this.rtgast_uids);

            // this.cartLineGrid.getStore().load();

        })

        //디폴트 로드
        gm.setCenterLoading(false);

        this.store.getProxy().setExtraParam('status', 'PR');

        this.store.getProxy().setExtraParam('menuCode', this.link);

        this.store.getProxy().setExtraParam('orderBy', 'rtgast_pr.po_no');
        this.store.getProxy().setExtraParam('ascDesc', 'DESC');

        this.store.load(function (records) {
        });
    },
    items: [],
    cartmapUids: [],
    addTabCartLineGridPanel: function (title, menuCode, arg, fc, id) {

        gm.extFieldColumnStore.load({
            params: {menuCode: menuCode},
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);

                if (success == true) {
                    try {
                        this.callBackWorkList(title, records, arg, fc, id);
                    } catch (e) {
                        console_logs('callBackWorkListCHNG error', e);
                    }
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

    renderDetailView: function (value) {
        var rec = this.grid.getSelectionModel().getSelection()[0];
        console_logs('rd', rec);
        var unique_id = rec.get('unique_id');
        var po_no = rec.get('po_no');

        cart_store.getProxy().setExtraParam('po_no', po_no);
        file_store.getProxy().setExtraParam('rtg_uid', unique_id);

        var gPr_uid = rec.get('unique_id');

        gm.me().routingStore.getProxy().setExtraParam('routingId', gPr_uid);
        gm.me().routingStore.load(function (records) {
            var NULL_DATE = "2001/01/01 00:00:00";
            for (var i = 0; i < records.length; i++) {
                var rtgwrk_unique_id = records[i].get('rtgwrk_unique_id');
                var user_id = records[i].get('user_id');
                var user_name = records[i].get('user_name');
                var submit_date = records[i].get('submit_date');
                var dept_name = records[i].get('dept_name');
                var comment = records[i].get('comment');
                var state = records[i].get('state');
                var result = records[i].get('result');
                var role = records[i].get('role');
                po_user_uid = records[i].get('po_user_uid');
                submit_date = NULL_DATE == submit_date.substring(0, NULL_DATE.length) ? "" : submit_date.substring(0, 19);
                records[i].set('submit_date', submit_date);
                result = i == 0 ? '-' : gm.me().getName(result, 'result');
                records[i].set('result', result);
            }

        });

        var rtgwrkGrid = Ext.create('Ext.grid.Panel', {
            store: gm.me().routingStore,
            stateId: 'stateGrid-rtgwrkGrid-111',
            layout: 'fit',
            border: false,
            frame: false,
            sortable: false,
            menuDisabled: true,
            multiSelect: false,
            autoScroll: true,
            height: 130,
            columns: [
                {text: ppo2_user_name, dataIndex: 'user_name', width: 80}
                , {text: ppo2_dept_name, dataIndex: 'dept_name', width: 80}
                , {text: ppo2_submit_date, dataIndex: 'submit_date', width: 200}
                , {text: ppo2_comment, dataIndex: 'comment', width: 550}
                , {text: ppo2_result, dataIndex: 'result', width: 70}
                , {text: ppo2_role, dataIndex: 'role', width: 70}
                , {text: ppo2_user_id, dataIndex: 'user_id', width: 90}
            ],
            viewConfig: {
                markDirty: false
            }
        });

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/'요청자재/첨부파일',
            width: 1800,
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
                vCompanyReserved4 == 'APM01KR' ? rtgwrkGrid : null,
                {
                    xtype: 'panel',
                    id: 'First Grid',
                    autoScroll: true,
                    autoWidth: true,
                    flex: 3,
                    padding: '5',
                    items: gm.me().createViewForm()
                }
                , {
                    xtype: 'panel',
                    id: 'Second grid',
                    flex: 2,
                    autoScroll: true,
                    padding: '5',
                    items: gm.me().createFileForm()
                }
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

    createViewForm: function () {
        var CART_COLUMN = [];

        CART_COLUMN.push(
            {
                header: '순번', dataIndex: 'cartmap_reserved2',
                width: 40, align: 'left', resizable: true, sortable: true,
            },
            {
                header: '상태', dataIndex: 'statusHangul',
                width: 40, align: 'left', resizable: true, sortable: true,
            },
            {
                header: '구분', dataIndex: 'sp_code',
                width: 40, align: 'left', resizable: true, sortable: true,
            }, {
                header: '구매', dataIndex: 'notify_flag',
                width: 80, align: 'left', resizable: true, sortable: true,
                renderer: function (value) {
                    console_logs('==notify_flag', value);
                    switch (value) {
                        case 'Y':
                            return '사내구매';
                        case 'N':
                            return '외주구매';
                        default:
                            return value;
                    }
                }
            }, {
                header: '품목코드', dataIndex: 'item_code',
                width: 100, align: 'left', resizable: true, sortable: true,
            }, {
                header: '품명', dataIndex: 'item_name',
                width: 130, align: 'left', resizable: true, sortable: true,
                flex: 1
            }, {
                header: '규격', dataIndex: 'specification',
                width: 130, align: 'left', resizable: true, sortable: true,
            }, {
                header: '제조원', dataIndex: 'maker_name',
                width: 130, align: 'left', resizable: true, sortable: true,
            }, {
                header: '중량', dataIndex: 'mass',
                width: 40, align: 'left', resizable: true, sortable: true,
            }, {
                header: '블록', dataIndex: 'area_code',
                width: 80, align: 'left', resizable: true, sortable: true,
            }, {
                header: '설계번호', dataIndex: 'alter_item_code',
                width: 120, align: 'left', resizable: true, sortable: true,
            }, {
                header: '수량', dataIndex: 'quan',
                width: 50, align: 'left', resizable: true, sortable: true,
            }, {
                header: '단위', dataIndex: 'unit_code',
                width: 40, align: 'left', resizable: true, sortable: true,
            }, {
                header: '단가', dataIndex: 'static_sales_price',
                width: 70, align: 'left', resizable: true, sortable: true,
            }, {
                header: '총중량', dataIndex: 'mass',
                width: 60, align: 'left', resizable: true, sortable: true,
            }, {
                header: '합계', dataIndex: 'total_price',
                width: 80, align: 'left', resizable: true, sortable: true,
            }, {
                header: '재질', dataIndex: 'model_no',
                width: 130, align: 'left', resizable: true, sortable: true,
            }, {
                header: '등록자', dataIndex: 'creator',
                width: 80, align: 'left', resizable: true, sortable: true,
            }, {
                header: '납기일', dataIndex: 'req_date',
                width: 130, align: 'left', resizable: true, sortable: true,
            }
        );

        var cart_uids = [];

        cart_store.load(function () {
            for (var i = 0; i < cart_store.data.items.length; i++) {
                var uid = cart_store.data.items[i].get('coord_key3');

                cart_uids.push(uid);
            }
        });


        cart_grid = Ext.create('Ext.grid.Panel', {
            id: 'pr-div2',
            store: cart_store,
            multiSelect: true,
            stateId: 'stateGridsub',
            selModel: Ext.create("Ext.selection.CheckboxModel", {mode: 'single'}),
//        selModel: selModel,
            autoScroll: true,
            autoHeight: true,
            height: 400,  // (getCenterPanelHeight()/5) * 4
//        bbar: getPageToolbar(store),
            region: 'center',
            columns: /*(G)*/CART_COLUMN,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
        });

        return cart_grid;
    },

    createFileForm: function () {
        var FILE_COLUMN = [];


        FILE_COLUMN.push(
            {
                header: '파일명', dataIndex: 'object_name',
                width: 150, align: 'left', resizable: true, sortable: true,
                flex: 1
            }, {
                header: '경로', dataIndex: 'file_path',
                width: 300, align: 'left', resizable: true, sortable: true,
            }, {
                header: '크기', dataIndex: 'file_size',
                width: 150, align: 'left', resizable: true, sortable: true,
            }
        );

        file_store.load(function () {
        });

        file_grid = Ext.create('Ext.grid.Panel', {
            id: 'pr-div3',
            store: file_store,
            // store: this.attachedFileStore,
            multiSelect: true,
            stateId: 'stateGridsub2',
//        selModel: selModel,
            autoScroll: true,
            autoHeight: true,
            height: 400,// (getCenterPanelHeight()/5) * 4,
//        bbar: getPageToolbar(store),
            region: 'center',
            columns: /*(G)*/FILE_COLUMN,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
        });

        return file_grid;
    },

    getName: function (value, code) {
        var lang = vLANG;
        switch (code) {
            case 'state': {
                switch (lang) {
                    case 'ko':
                        switch (value) {
                            case 'R':
                                return '접수';  //Reception 前台
                                break;
                            case 'P':
                                return '작성중'; //在写  In writing
                                break;
                            case 'I':
                                return '결재중';  //批准
                                break;
                            case 'A':
                                return '승인완료'; //Accepted 公认
                                break;
                            case 'D':
                                return '반려';  //Companion 伙伴
                                break;
                            case 'C':
                                return '복합';  //Complex 复杂
                                break;
                            case 'G':
                                return '입고완료';   //Wearing complete
                                break;
                            case 'S':
                                return '시스템삭제';  //Delete System
                                break;
                            case 'E':
                                return '주문완료';   //Order
                                break;
                        }
                        break;
                    case 'zh':
                        switch (value) {
                            case 'R':
                                return '挂号';
                                break;
                            case 'P':
                                return '开具中';
                                break;
                            case 'I':
                                return '批准';
                                break;
                            case 'A':
                                return '承认完成';
                                break;
                            case 'D':
                                return '返还';
                                break;
                            case 'C':
                                return '复合';
                                break;
                            case 'G':
                                return '入库完成';
                                break;
                            case 'S':
                                return '系统删除';
                                break;
                            case 'E':
                                return '订货完成';
                                break;
                        }
                        break;
                    case 'en':
                        switch (value) {
                            case 'R':
                                return 'Receipt';
                                break;
                            case 'P':
                                return 'Drawing';
                                break;
                            case 'I':
                                return 'Sanction';
                                break;
                            case 'A':
                                return 'Recognition';
                                break;
                            case 'D':
                                return 'Return';
                                break;
                            case 'C':
                                return 'Compositeness';
                                break;
                            case 'G':
                                return 'EnterFinish';
                                break;
                            case 'S':
                                return 'System Delete';
                                break;
                            case 'E':
                                return 'RequestFinish';
                                break;
                        }
                        break;
                }
            }
                break;
            case 'result': {
                switch (lang) {
                    case 'ko':
                        switch (value) {
                            case 'Y':
                                return '승인';
                                break;
                            case 'N':
                                return '반려';
                                break;
                            case 'P':
                                return '대기';
                                break;
                        }
                    case 'zh':
                        switch (value) {
                            case 'Y':
                                return '承认';
                                break;
                            case 'N':
                                return '返回';
                                break;
                            case 'P':
                                return '等待';
                                break;
                        }
                    case 'en':
                        switch (value) {
                            case 'Y':
                                return 'Acknowledgment';
                                break;
                            case 'N':
                                return 'Return';
                                break;
                            case 'P':
                                return 'Ready';
                                break;
                        }
                }
            }
                break;
            case 'role': {
                switch (lang) {
                    case 'ko':
                        switch (value) {
                            case 'D':
                                return '결재';
                                break;
                            case 'I':
                                return '통보';
                                break;
                            case 'W':
                                return '상신';
                                break;
                        }
                    case 'zh':
                        switch (value) {
                            case 'D':
                                return '批准';
                                break;
                            case 'I':
                                return '通知';
                                break;
                            case 'W':
                                return '提交';
                                break;
                        }
                    case 'en':
                        switch (value) {
                            case 'D':
                                return 'Sanction';
                                break;
                            case 'I':
                                return 'Notify';
                                break;
                            case 'W':
                                return 'Submit';
                                break;
                        }
                }
            }
                break;
        }

        return '';
    },

    callBackWorkList: function (title, records, arg, fc, id) {

        var gridId = id == null ? this.getGridId() : id;

        var o = gm.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];

        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});
        this.cartLineStore = Ext.create('Rfx2.store.company.kbtech.CartMapStore');
        this.cartLineStore.getProxy().setExtraParam('rtgastuid', gm.me().vSELECTED_UNIQUE_ID);

        this.cartLineGrid = Ext.create('Ext.grid.Panel', {
            id: gu.id('cartLineGrid'),
            store: this.cartLineStore,
            //store: store,
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
                    gm.me().downListRecord(record);
                }, //endof itemdblclick
                cellkeydown: function (cartLineGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {

                    }


                }
            },//endof listeners
            columns: columns
        });
        this.cartLineGrid.getSelectionModel().on({
            selectionchange: function (sm, selections) {
                fc(selections);
            }
        });
        var view = this.cartLineGrid.getView();

        var tabPanel = Ext.getCmp(gm.geTabPanelId());

        tabPanel.add(this.cartLineGrid);
    },
    routingStore: null,

    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),
});
