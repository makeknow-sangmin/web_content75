//출하 현황
Ext.define('Rfx.view.salesDelivery.DeliveryNewMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'delivery-new-mgmt-view',
    initComponent: function(){

        this.vMESSAGE.EDIT = '상세보기';
        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가
        this.setDefComboValue('def_rep_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.

        this.addSearchField ({
            type: 'dateRange',
            field_id: 'gr_date',
            text: "기간",
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        // this.addSearchField ('reserved_varchar6');
        this.addSearchField('wa_name');
        // this.addSearchField('reserved_varchara');
        // this.addSearchField('reserved_varchar5');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.addSearchField('sp_po_no');

        this.setDefValue('create_date', new Date());

        var next7 = gUtil.getNextday(7);
        this.setDefValue('change_date', next7);

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : [
                'COPY', 'EDIT', 'REMOVE'
            ],
            RENAME_BUTTONS : [
            ]
        });
        (buttonToolbar.items).each(function(item,index,length){
            if(index==1) {
                buttonToolbar.items.remove(item);
            }
        });

        //모델 정의
        this.createStore('Rfx.model.DeliveryNewMgmt', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gm.pageSize/*pageSize*/,{
                create_date: 'r.create_date'
            }
            , ['sledel']
        );

        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip:'납품서 출력',
            disabled: true,

            handler: function(widget, event) {

                var form = Ext.create('Ext.form.Panel', {
                    xtype: 'form',
                    frame: false,
                    border: false,
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'form',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '옵션',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    id: gu.id('includePrice'),
                                    anchor: '97%',
                                    name: 'includePrice',
                                    checked: true,
                                    fieldLabel: '금액포함'
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '입고전표',
                    width: 250,
                    height: 180,
                    items: form,
                    buttons: [
                        {
                            text: 'PDF 출력',
                            scope: this,
                            handler: function () {

                                prWin.setLoading(true);

                                var dlUids = [];

                                var selections = gm.me().grid.getSelectionModel().getSelection();

                                for (var i = 0; i < selections.length; i++) {
                                    dlUids.push(selections[i].get('rtgast_uid'));
                                }

                                var rtgast_uid = gm.me().vSELECTED_UNIQUE_ID;
                                var po_no = gm.me().vSELECTED_PO_NO;
                                var rec = gm.me().vSELECTED_RECORD;

                                console_logs('rec', rec);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/pdf.do?method=printDl',
                                    params:{
                                        rtgast_uid : rec.get('rtgast_uid'),
                                        dl_uid : rtgast_uid,
                                        po_no : po_no,
                                        includePrice : gu.getCmp('includePrice').getValue(),
                                        dlUids: dlUids,
                                        pdfPrint : 'pdfPrint'
                                    },
                                    reader: {
                                        pdfPath: 'pdfPath'
                                    },
                                    success : function(result, request) {
                                        var jsonData = Ext.JSON.decode(result.responseText);
                                        var pdfPath = jsonData.pdfPath;
                                        console_log(pdfPath);
                                        if(pdfPath.length > 0) {
                                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                                            top.location.href=url;
                                        }
                                        prWin.setLoading(false);
                                        if (prWin) {
                                            prWin.close();
                                        }
                                    },
                                    failure: function () {
                                        extjsUtil.failureMessage;
                                        prWin.setLoading(false);
                                    }
                                });
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

        //출하취소기능
        this.cancelDlAction = Ext.create('Ext.Action',{
            iconCls: 'af-reject',
            text: '출하취소',
            tooltip:'출하취소',
            disabled: true,

            handler: function(widget, event) {
                Ext.MessageBox.show({
                    title:'출하취소',
                    msg: '선택한 제품을 출하취소하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(result) {
                        if(result=='yes') {
                            gm.me().cancelDl()
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        //버튼 추가.
        buttonToolbar.insert(1, this.cancelDlAction);
        buttonToolbar.insert(1, this.printPDFAction);
        buttonToolbar.insert(1, '-');

        // Ext.each(this.columns, function(columnObj, index) {

        //     var o = columnObj;

        //     var dataIndex = o['dataIndex'];

        //     if(o['dataType'] === 'number') {
        //         o['summaryRenderer'] = function(value, summaryData, dataIndex) {
        //             if(gm.me().store.data.items.length > 0) {
        //                 var summary = gm.me().store.data.items[1].get('summary');
        //                 if(summary.length > 0) {
        //                     var objSummary = Ext.decode(summary);
        //                     return Ext.util.Format.number(objSummary[dataIndex], '0,00/i');
        //                 } else {
        //                     return 0;
        //                 }
        //             } else {
        //                 return 0;
        //             }
        //         };
        //     }

        // });

        // var option = {
        //     features: [{
        //         ftype: 'summary',
        //         dock: 'top'
        //     }]
        // };

        //그리드 생성
        this.createGrid(searchToolbar, buttonToolbar/*, option*/);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
                var rec = selections[0];
                gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //rtgast_uid
                gm.me().vSELECTED_PO_NO = rec.get('po_no'); //rtgast_uid
                gm.me().printPDFAction.enable();
                gm.me().cancelDlAction.enable();
            } else {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().printPDFAction.disable();
                gm.me().cancelDlAction.disable();
            }

        });

        //디폴트 로드
        gMain.setCenterLoading(false);

        var code_name = 'SDL_SUB';

        this.store.load(function(records){});

        this.addTabdeliveryPendingGridPanel('상세정보', code_name, {
                pageSize: 100,
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
            function(selections) {
                if (selections.length) {
                    var rec = selections[0];
                    console_logs('Lot 상세정보>>>>>>>>>>>>>', rec);
                    gm.me().selectPcsRecord = rec;
                    gm.me().selectSpecification = rec.get('specification');
                    gm.me().parent = rec.get('parent');

                } else {

                }
            },
            'deliveryPendingGrid'//toolbar
        );

    },
    cancelDl: function() {

        var selections = gm.me().grid.getSelectionModel().getSelection();

        var sledelUids = [];

        for (var i = 0; i < selections.length; i++) {
            sledelUids.push(selections[i].get('unique_id_long'));
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/sales/productStock.do?method=cancelDl',
            params: {
                sledelUids: sledelUids
            },
            success: function (val, action) {
                gm.me().store.load();

            },
            failure: function (val, action) {

            }
        });
    },
    addTabdeliveryPendingGridPanel: function(title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: { 	menuCode: menuCode  },
            callback: function(records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
                if(success ==true) {
                    //this.callBackWorkList(title, records, arg, fc, id);
                } else {//endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        //animateTarget: btn,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function() {

                        }
                    });
                }
            },
            scope: this
        });

    },
    callBackWorkList: function(title, records, arg, fc, id) {

        var gridId = id== null? this.getGridId() : id;

        var o = gMain.parseGridRecord(records, gridId);
        var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];

        //var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });

        switch(vCompanyReserved4) {
            case 'KYNL01KR':
                this.detailStore = Ext.create('Mplm.store.DeliveryDetailStore');
                this.detailStore.getProxy().setExtraParam('dl_uid', this.selected_rec.data.id);
                this.detailStore.getProxy().setExtraParam('h_reserved43', this.selected_rec.data.h_reserved43);
                break;
            default:
                this.detailStore = Ext.create('Mplm.store.ProduceQtyStore');
                break;
        }

        try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}

        Ext.each(columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch (dataIndex) {
                case 'wh_qty':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function(value, meta) {
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
            cls : 'rfx-panel',
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            autoload: true,
            forceFit: false,
            collapsible: false,
            layout          :'fit',
            dockedItems: dockedItems,
            //plugins: [cellEditing],
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                },
                select: function(selModel, record, index, options){

                },
                itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                    //gm.me().downListRecord(record);
                }, //endof itemdblclick
                cellkeydown:function (deliveryPendingGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
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
                edit: function(view, rec, opts) {

                    wh_qty_new = rec.value;

                    if(wh_qty_new - wh_qty_old > available_qty) {
                        Ext.Msg.alert('경고', '추가 신청하려는 수량이 현재 신청 가능한 수량보다 많습니다.');
                        this.store.rejectChanges();
                    } else {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/sales/product.do?method=updateProductQty',
                            params: {
                                wh_qty : wh_qty_new,
                                wh_qty_old : wh_qty_old - wh_qty_new,
                                unique_id : unique_id,
                                stoqty_uid : stoqty_uid
                            },
                            success: function(result, request) {
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
            selectionchange: function(sm, selections) {
                fc(selections);
            }
        });

        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
        tabPanel.removeAll(false);
        tabPanel.add(deliveryPendingGrid);
        this.detailStore.load();
    },
    editRedord: function(field, rec) {
        gm.editRedord(field, rec);
    },
    items : [],
    selected_rec : null,
    deliveryPendingGrid: null
});
