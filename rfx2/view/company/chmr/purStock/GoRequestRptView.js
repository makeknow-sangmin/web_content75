//출고확인
Ext.define('Rfx2.view.company.chmr.purStock.GoRequestRptView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'go-request-rpt-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.addSearchField({
            type: 'dateRange',
            field_id: 'create_date',
            text: gm.getMC('CMD_Order_Date', '등록일자'),
            sdate: new Date(new Date().getFullYear() + '-01-01'),
            // sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });
        switch (vCompanyReserved4) {
            case 'SKNH01KR':
                /*this.addSearchField({
                 field_id:		'state',
                 displayField:   'codeName',
                 valueField:     'systemCode',
                 store: 			'PrchStateStore',
                 innerTpl: 		'<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>'
                 });*/
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'rtgast',
                    tableName: 'rtgast',
                    field_id: 'po_no',
                    fieldName: 'po_no',
                    params: {
                        rtg_type: 'GO',
                        po_type: 'G',
                        state: 'A'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'rtgast',
                    tableName: 'rtgast',
                    field_id: 'item_abst',
                    fieldName: 'item_abst',
                    params: {
                        rtg_type: 'GO',
                        po_type: 'G',
                        state: 'A'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'rtgast',
                    tableName: 'rtgast',
                    field_id: 'user_name',
                    fieldName: 'user_name',
                    params: {
                        rtg_type: 'GO',
                        po_type: 'G',
                        state: 'A'
                    }
                });

                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'rtgast',
                    tableName: 'project',
                    field_id: 'reserved_varchar3',
                    fieldName: 'reserved_varchar3',
                    emptyText: '호선',
                    params: {
                        rtg_type: 'GO',
                        po_type: 'G',
                        state: 'A'
                    }
                });

                break;
            default:
                this.addSearchField({
                    field_id: 'state',
                    displayField: 'codeName',
                    valueField: 'systemCode',
                    store: 'PrchStateStore',
                    innerTpl: '<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>'
                });
                this.addSearchField('name');
                this.addSearchField('content');
                this.addSearchField('user_name');
                break;
        }


        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var buttonToolbar3 = Ext.create('widget.toolbar', {
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                id: gu.id('total_price'),
                style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
                text: '총 금액 : -'
            }]
        });


        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.GoRequestRpt', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
//	        ['cartmap']
        );

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //arr.push(buttonToolbar3);
        //grid 생성.
        this.createGrid(arr);


        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

//        this.removeAction.setText('반려');
        this.editAction.setText('상세보기');

        this.addTabCartLineGridPanel('상세보기', 'PPR3_SUB', {
                pageSize: 100,
                //model: 'Rfx.store.CartMapStore',
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
            tooltip: '불출요청서 출력',
            disabled: true,

            handler: function (widget, event) {
                var rtgast_uid = gm.me().vSELECTED_UNIQUE_ID;
                var po_no = gm.me().vSELECTED_PO_NO;
                var rtg_type = gm.me().vSELECTED_RTG_TYPE;
                console_logs('rtg_type', rtg_type);
                var is_rotate = 'N';
                if (vCompanyReserved4 == 'HSGC01KR') {
                    is_rotate = 'Y';
                }
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
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '요청 접수 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {

                            var gmRtgast_uids = gm.me().rtgast_uids;
                            var states = gm.me().states;

                            if (gmRtgast_uids == null || gmRtgast_uids.length == 0) {
                                Ext.Msg.alert('안내', '선택한 항목이 없습니다.', function () {
                                });
                            } else {

                                var aleady = false;
                                var rtgast_uids = [];
                                for (var i = 0; i < gmRtgast_uids.length; i++) {
                                    var state = states[i];
                                    if (state == 'A') {
                                        rtgast_uids.push(gmRtgast_uids[i]);
                                    } else {
                                        aleady = true;
                                    }
                                }

                                if (aleady == true) {
                                    Ext.Msg.alert('안내', '이미 진행된 항목이 포함되어 있습니다.', function () {
                                    });
                                } else {
                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/purchase/prch.do?method=createOrder',
                                        params: {
//			            						unique_id: rtgast_uid
                                            unique_id: rtgast_uids
                                        },

                                        success: function (result, request) {
                                            gm.me().store.load();
                                            Ext.Msg.alert('안내', '요청접수 되었습니다.', function () {
                                            });
                                            var selections = gm.me().grid.getSelectionModel().getSelection();

                                            for (var i = 0; i < selections.length; i++) {
                                                gm.editAjax('rtgast', 'reserved_varchar1', 'P', 'unique_id', selections[i].get('reserved_number3'), {type: ''});
                                            }

                                        },//endofsuccess
                                        failure: extjsUtil.failureMessage
                                    });//endofajax			            	        		
                                }


                            }


                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
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
                /*switch(gm.me().poviewType) {
                 case 'ALL':
                 alert("자재를 먼저 선택해 주세요");
                 break;
                 case 'RAW':
                 gm.me().treatPo();
                 //gm.me().treatRawPo();
                 break;
                 case 'SUB':
                 gm.me().treatPo();
                 //gm.me().treatSubPo();
                 break;
                 case 'ADDPO':
                 alert("복사 하기 버튼을 누르세요");
                 break;
                 case 'PAPER':
                 gm.me().treatPo();
                 break;
                 default:

                 }*/

            }//handler end...

        });

        var removeBActionText = '반려';

        if (this.link == 'QGR6_SKN') {
            removeBActionText = '취소';
        }

        //반려 Action 생성
        this.removeBAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: removeBActionText,
            tooltip: removeBActionText,
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '확인',
                    msg: '반려 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function (result) {
                        if (result == 'yes') {

                            var selections = gm.me().grid.getSelectionModel().getSelection();

                            var rtgastArr = [];

                            for (var i = 0; i < selections.length; i++) {
                                rtgastArr.push(selections[i].get('unique_id_long'));
                            }

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/prch.do?method=rollbackGo',
                                params: {
                                    rtgastArr: rtgastArr
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
            }
        });

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        //버튼 추가.
        switch (this.link) {
            case 'QGR6_SKN':
                buttonToolbar.insert(2, this.printPDFAction);
                buttonToolbar.insert(2, '-');
                buttonToolbar.insert(3, this.removeBAction);
                buttonToolbar.insert(3, '-');
                break;
            case 'QGR6_RPT':
                buttonToolbar.insert(1, this.reReceiveAction);
                buttonToolbar.insert(1, '-');
                buttonToolbar.insert(3, this.removeBAction);
                buttonToolbar.insert(3, '-');
                break;
            default:
                buttonToolbar.insert(1, this.reReceiveAction);
                buttonToolbar.insert(1, '-');
                buttonToolbar.insert(2, this.printPDFAction);
                buttonToolbar.insert(2, '-');
                buttonToolbar.insert(3, this.removeBAction);
                buttonToolbar.insert(3, '-');
        }
        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                this.rtgast_uids = [];
                this.states = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    var state = rec1.get('state');
                    this.rtgast_uids.push(uids);
                    this.states.push(state);
                }
                var rec = selections[0];

                gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //rtgast_uid
                gm.me().vSELECTED_PO_NO = rec.get('po_no'); //rtgast_uid
                gm.me().vSELECTED_RTG_TYPE = rec.get('rtg_type');
                console_logs("gm.me().vSELECTED_UNIQUE_ID>>>>>>>>>>", gm.me().vSELECTED_UNIQUE_ID);
                gm.me().reReceiveAction.enable();
                gm.me().printPDFAction.enable();
                gm.me().removeBAction.enable();

                this.cartLineGrid.getStore().getProxy().setExtraParam('rtgastuid', this.rtgast_uids);
                console_logs("this.rtgast_uids>>>>>>>>>>", this.rtgast_uids);
                var totalPrice = 0;
                this.cartLineGrid.getStore().load(function (record) {
                    for (var i = 0; i < record.length; i++) {
                        var t_rec = record[i]
                        totalPrice += t_rec.get('sales_price') *  t_rec.get('quan');
                    }
                    buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(totalPrice) + ' 원');
                });

            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().reReceiveAction.disable();
                gm.me().printPDFAction.disable();
                gm.me().removeBAction.disable();

                this.cartLineGrid.getStore().removeAll();
            }

        })

        //디폴트 로드
        gm.setCenterLoading(false);
        if (vCompanyReserved4 == 'DABP01KR') {
            this.store.getProxy().setExtraParam('purcnt', "yes");
        }
        this.store.getProxy().setExtraParam("menuCode", this.link);
        if (vCompanyReserved4 == 'SKNH01KR' || vCompanyReserved4 == 'KBTC01KR') {
            var states = [];
            states.push('A');
            this.store.getProxy().setExtraParam('state', states);
        }
        this.store.load(function (records) {
        });
        this.setCrudpanelWidth(900);
    },
    items: [],
    rtgast_uids: [],
    addTabCartLineGridPanel: function (title, menuCode, arg, fc, id) {

        gm.extFieldColumnStore.load({
            params: {menuCode: menuCode},
            callback: function (records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
//		    	 setEditPanelTitle();
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
        this.cartLineStore.getProxy().setExtraParam('orderBy', 'a.unique_id desc');


        switch (vCompanyReserved4) {
            case 'KBTC01KR':
                break;
            default:
                try {
                    Ext.FocusManager.enable({focusFrame: true});
                } catch (e) {
                    console_logs('FocusError', e);
                }
                break;
        }
        this.cartLineGrid = Ext.create('Ext.grid.Panel', {
            store: this.cartLineStore,
            title: title,
            cls: 'rfx-panel',
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            collapsible: false,
            layout: 'fit',
            //forceFit: true,
            dockedItems: dockedItems,
            //selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
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
        //     down: function(e) {
        //         var selectionModel = this.cartLineGrid.getSelectionModel();
        //         var select = 0; // select first if no record is selected
        //         if ( selectionModel.hasSelection() ) {
        //             select = this.cartLineGrid.getSelectionModel().getSelection()[0].index + 1;
        //         }
        //         view.select(select);
        //
        //     },
        //     up: function(e) {
        //         var selectionModel = this.cartLineGrid.getSelectionModel();
        //         var select = this.cartLineGrid.store.totalCount - 1; // select last element if no record is selected
        //         if ( selectionModel.hasSelection() ) {
        //             select = this.cartLineGrid.getSelectionModel().getSelection()[0].index - 1;
        //         }
        //         view.select(select);
        //
        //     }
        // });

        var tabPanel = Ext.getCmp(gm.geTabPanelId());

        tabPanel.add(this.cartLineGrid);
    },
    selCheckOnly: vCompanyReserved4 == 'SKNH01KR' ? true : false,
    selAllowDeselect: vCompanyReserved4 == 'SKNH01KR' ? false : true
});