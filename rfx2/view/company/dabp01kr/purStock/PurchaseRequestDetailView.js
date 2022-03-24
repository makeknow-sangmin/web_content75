//구매요청
Ext.define('Rfx2.view.company.dabp01kr.purStock.PurchaseRequestDetailView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'purchase-detail-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField({
            type: 'dateRange',
            field_id: 'req_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        this.addSearchField({
            field_id: 'state',
            displayField: 'codeName',
            valueField: 'systemCode',
            store: 'PrchStateStore',
            innerTpl: '<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>'
        });

        this.addSearchField('pj_name');
        this.addSearchField('name');
        this.addSearchField('content');
        this.addSearchField('user_name');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.PurchaseRequestDetail', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gm.pageSize,
            null, ['rtgast']
        );

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);
        this.editAction.setText('상세보기');
        this.setEditPanelTitle('상세보기');

        this.createCrudTab();

        this.crudTab.setSize(this.getCrudeditSize());

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.addTabCartLineGridPanel('상세보기', 'PPR3_SUB', {
                pageSize: 100,
                model: 'Rfx.store.CartMapStore',
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
        this.callParent(arguments);
        //디폴트 로드
        gm.setCenterLoading(false);//스토어로딩에서는 Loading Message를 끈다.
        this.store.getProxy().setExtraParam('state', "A");
        this.store.load();

        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action', {
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip: '구매요청서 출력',
            disabled: true,

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

        this.removeBAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '취소',
            tooltip: '취소',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '취소 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {

                            //var uniqueId = gm.me().vSELECTED_UNIQUE_ID;
                            var uniqueuid = gm.me().rtgast_uids;
                            console_logs("uniqueuid", uniqueuid);
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/prch.do?method=cancleOrder',
                                params: {
                                    unique_id: uniqueuid
                                },

                                success: function (result, request) {
                                    gm.me().store.load();
                                    Ext.Msg.alert('안내', '취소 되었습니다.', function () {
                                    });

                                },//endofsuccess
                                failure: extjsUtil.failureMessage
                            });//endofajax

                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.editAction);
        // buttonToolbar.insert(1, '-');
        buttonToolbar.insert(2, this.printPDFAction);
        // buttonToolbar.insert(2, '-');
        buttonToolbar.insert(3, this.removeBAction);
        // buttonToolbar.insert(3, '-');
        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                this.rtgast_uids = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    this.rtgast_uids.push(uids);
                }
                var rec = selections[0];

                gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //rtgast_uid
                gm.me().vSELECTED_PO_NO = rec.get('po_no'); //rtgast_uid
                gm.me().vSELECTED_RTG_TYPE = rec.get('rtg_type');
                gm.me().vSELECTED_STATE = rec.get('state');
                console_logs("gm.me().vSELECTED_UNIQUE_ID>>>>>>>>>>", gm.me().vSELECTED_UNIQUE_ID);
                console_logs("gm.me().vSELECTED_STATE>>>>>>>>>>", gm.me().vSELECTED_STATE);

                gm.me().printPDFAction.enable();
                gm.me().removeBAction.enable();

                if (gm.me().vSELECTED_STATE == 'A') {
                    gm.me().removeBAction.enable();
                } else {
                    gm.me().removeBAction.disable();
                }
            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().printPDFAction.disable();
                gm.me().removeBAction.disable();
            }
            this.cartLineGrid.getStore().getProxy().setExtraParam('rtgastuid', this.rtgast_uids);
            console_logs("this.rtgast_uids>>>>>>>>>>", this.rtgast_uids);

            this.cartLineGrid.getStore().load();

        })

        //디폴트 로드
        gm.setCenterLoading(false);
        if (vCompanyReserved4 == 'DABP01KR') {
            this.store.getProxy().setExtraParam('purcnt', null);
        }

        this.store.load(function (records) {
        });
    },
    items: [],
    rtgast_uids: [],

    getCrudeditSize: function () {
        if (this.crudEditSize > 0) {
            return this.crudEditSize;
        }

        if (gm.checkPcHeight()) {
            return this.crudEditSize < 0 ? 800 : this.crudEditSize;
        } else {
            return 200;
        }
    },
    addTabCartLineGridPanel: function (title, menuCode, arg, fc, id) {

        gm.extFieldColumnStore.load({
            params: {menuCode: menuCode},
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
//			    	 setEditPanelTitle();
                if (success == true) {
                    try {
                        this.callBackWorkListCHNG(title, records, arg, fc, id);
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
    callBackWorkListCHNG: function (title, records, arg, fc, id) {
        var gridId = id == null ? this.getGridId() : id;

        var o = gm.parseGridRecord(records, gridId);
        var fields = o['fields'], columns = o['columns'], tooltips = o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];

        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});
        this.cartLineStore = Ext.create('Rfx.store.CartMapStore');
        this.cartLineStore.getProxy().setExtraParam('rtgastuid', gm.me().vSELECTED_UNIQUE_ID);

        try {
            Ext.FocusManager.enable({focusFrame: true});
        } catch (e) {
            console_logs('FocusError', e);
        }
        this.cartLineGrid = Ext.create('Ext.grid.Panel', {
            //id: gridId,
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

        // var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
        //     down: function (e) {
        //         var selectionModel = this.cartLineGrid.getSelectionModel();
        //         var select = 0; // select first if no record is selected
        //         if (selectionModel.hasSelection()) {
        //             select = this.cartLineGrid.getSelectionModel().getSelection()[0].index + 1;
        //         }
        //         view.select(select);
        //
        //     },
        //     up: function (e) {
        //         var selectionModel = this.cartLineGrid.getSelectionModel();
        //         var select = this.cartLineGrid.store.totalCount - 1; // select last element if no record is selected
        //         if (selectionModel.hasSelection()) {
        //             select = this.cartLineGrid.getSelectionModel().getSelection()[0].index - 1;
        //         }
        //         view.select(select);
        //
        //     }
        // });

        var tabPanel = Ext.getCmp(gm.geTabPanelId());

        tabPanel.add(this.cartLineGrid);
    },

});
