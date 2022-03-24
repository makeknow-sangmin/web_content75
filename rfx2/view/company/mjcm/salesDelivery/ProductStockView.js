//출하 관리
Ext.define('Rfx2.view.company.mjcm.salesDelivery.ProductStockView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'product-stock-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        this.setDefValue('create_date', new Date());

        var next7 = gu.getNextday(7);
        this.setDefValue('change_date', next7);

        this.addSearchField({
            type: 'checkbox',
            field_id: 'existStock',
            items: [
                {
                    boxLabel: gm.getMC('CMD_Only_items_in_stock','재고 있는 품목만'),
                    checked: true
                },
            ],
        });

        this.addSearchField({
            field_id: 'whouse_uid'
            , emptyText: '창고명'
            , width: 200
            , store: "Rfx2.store.company.bioprotech.WarehouseProductStore"
            , displayField: 'wh_name'
            , valueField: 'unique_id'
            , defaultValue: '11030245000001'
            , autoLoad: true
            , innerTpl: '<div data-qtip="{unique_id}">{wh_name}</div>'
        });

        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.addSearchField('class_name');
        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();


        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.printBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: gm.getMC('CMD_Inventory_Barcode','재고조사 바코드'),
            tooltip: '제품의 바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gm.me().printBarcode();
            }
        });

        this.warehousingAction = Ext.create('Ext.Action', {
            iconCls: 'font-awesome_4-7-0_sign-in_14_0_5395c4_none',
            text: gm.getMC('CMD_Wearing','입고'),
            tooltip: '제품을 입고합니다.',
            disabled: true,
            handler: function () {
                gm.me().doWarehousing();
            }
        });

        this.releaseAction = Ext.create('Ext.Action', {
            iconCls: 'font-awesome_4-7-0_sign-out_14_0_5395c4_none',
            text: gm.getMC('CMD_Release','출고'),
            tooltip: '제품을 출고합니다.',
            disabled: true,
            handler: function () {
                gm.me().doRelease();
            }
        });

        this.createStore('Rfx2.model.company.bioprotech.ProductStock',
            [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        this.setRowClass(function (record, index) {

            console_logs('>>>>record', record);
            var c = record.get('stock_pos');
            console_logs('>>>>c', c);
            if (c != null && c != undefined && c != '') {
                return 'green-row';
            }

        });

        buttonToolbar.insert(1, this.printBarcodeAction);
        buttonToolbar.insert(1, '-');
        buttonToolbar.insert(1, this.releaseAction);
        buttonToolbar.insert(1, this.warehousingAction);

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.cancelStockAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Goods_receipt_cancellation', '입고 취소'),
            tooltip: '입고 취소',
            disabled: false,
            handler: function () {
                var rec = gm.me().productDetailGrid.getSelectionModel().getSelection()[0];

                var stoqty_uid = rec.get('unique_id_long');

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
                            title: '입고 취소 수량을 입력하시기 바랍니다',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    id: gu.id('cancel_quan'),
                                    name: 'cancel_quan',
                                    fieldLabel: '취소수량',
                                    margin: '0 5 0 0',
                                    anchor: '97%',
                                    allowBlank: false,
                                    value: 1,
                                    maxlength: '10',
                                }
                            ]
                        }
                    ]
                });

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '입고 취소',
                    width: 450,
                    height: 180,
                    items: form,
                    buttons: [
                        {
                            text: CMD_OK,
                            scope: this,
                            handler: function () {
                                Ext.MessageBox.show({
                                    title: '입고 취소',
                                    msg: '선택 한 건을 입고 취소 하시겠습니까?',
                                    buttons: Ext.MessageBox.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == "no") {
                                            return;
                                        } else {
                                            var val = form.getValues(false);
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/sales/productStock.do?method=cancelStock',
                                                params: {
                                                    stoqty_uid: stoqty_uid,
                                                    cancel_quan: val['cancel_quan']
                                                },
                                                success: function (val, action) {
                                                    Ext.Msg.alert('완료', '입고가 취소되었습니다.');
                                                    if (prWin) {
                                                        prWin.close();
                                                    }
                                                    gm.me().productDetailGrid.getStore().load();
                                                },
                                                failure: function (val, action) {

                                                }
                                            });
                                        }
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


        this.productDetailStore = Ext.create('Rfx2.store.company.bioprotech.PStockOfProdStore');

        this.productDetailGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('productDetailGrid'),
            store: this.productDetailStore,
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
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.productDetailStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {
                        this.getStore().getProxy().setExtraParam('start', (currentPage - 1) * 100);
                        this.getStore().getProxy().setExtraParam('page', currentPage);
                        this.getStore().getProxy().setExtraParam('limit', 100);
                    }
                }
            }),
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            margin: '0 0 0 0',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        this.cancelStockAction
                    ]
                }
            ],
            columns: [
                { text: '수주번호', width: 100, style: 'text-align:center', dataIndex: 'orderNumber' },
                { text: '고객사', width: 100, style: 'text-align:center', dataIndex: 'wa_name' },
                { text: '생산로트번호', width: 85, style: 'text-align:center', dataIndex: 'pcs_desc_group' },
                { 
                    text: '생산수량', 
                    width: 100, 
                    style: 'text-align:center', 
                    dataIndex: 'production_qty_sum', 
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'production_qty_sum') {
                            context.record.set('production_qty_sum', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    } 
                },
                { 
                    text: '현재재고', 
                    width: 100, 
                    style: 'text-align:center', 
                    dataIndex: 'real_wh_qty', 
                    align: 'right',
                    renderer: function (value, context, tmeta) {
                        if (context.field == 'wh_qty') {
                            context.record.set('wh_qty', Ext.util.Format.number(value, '0,00/i'));
                        }
                        return Ext.util.Format.number(value, '0,00/i');
                    } 
                },

            ],
            title: gm.getMC('CMD_Detailed_list', '상세 리스트'),
            name: 'po',
            autoScroll: true,
            listeners: {
                edit: function (editor, e, eOpts) {

                }
            }
        });

        //grid 생성.
        this.createGridCore(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        //        this.editAction.setText('상세정보');

        this.grid.on("headerclick", function (iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent) {
            gm.me().store.load();
        });

        Ext.apply(this, {
            layout: 'border',
            items: [{
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
                width: '65%',
                items: [{
                    region: 'west',
                    layout: 'fit',
                    margin: '0 0 0 0',
                    width: '100%',
                    items: [this.grid]
                }]
            }, this.productDetailGrid
            ]
        });

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                var rec = selections[0];

                gm.me().productDetailStore.getProxy().setExtraParam('srcahdUid', selections[0].get('unique_id_long'));
                //this.workOrderGrid.getStore().getProxy().setExtraParam('range_date', '1999-01-01:2099-12-31');

                var whouseUid = gm.me().store.getProxy().getExtraParams()['whouse_uid'];

                gm.me().productDetailStore.getProxy().setExtraParam('whouseUid', whouseUid);
                gm.me().productDetailStore.getProxy().setExtraParam('is_stock_yn', 'Y');
                gm.me().productDetailStore.load(function (record) {
                });

                gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //stoqty_uid
                gm.me().vSELECTED_PO_NO = rec.get('po_no'); //stoqty_uid
                var stock_pos = rec.get('stock_pos'); //stoqty_uid
                console_logs('stock_pos', stock_pos);
                gm.me().vSELECTED_ITEM_CODE = rec.get('item_code');

                if (stock_pos != null && stock_pos.length > 0) {
                    this.printBarcodeAction.disable();
                } else {
                    this.printBarcodeAction.enable();
                }

                if (selections.length == 1) {
                    this.warehousingAction.enable();
                    this.releaseAction.enable();
                } else {
                    this.warehousingAction.disable();
                    this.releaseAction.disable();
                }

            } else {

                this.warehousingAction.disable();
                this.releaseAction.disable();

                gm.me().vSELECTED_UNIQUE_ID = -1;
                gm.me().vSELECTED_PO_NO = '';
            }

        });

        //디폴트 로드

        gm.setCenterLoading(false);

        for (var i = 0; i < this.searchField.length; i++) {
            var type = 'text';
            var key = this.searchField[i];
            //console_logs('==>key', key);
            if (typeof key == 'string') {

            } else if (typeof key == 'object') {
                var myO = key;
                key = myO['field_id'];
                type = myO['type'];
            }

            var srchId = this.link + '-' + gMain.getSearchField(key);

            var value = null;
            var value1 = null;
            try {
                var o = this.getSearchWidget(srchId);
                if (o == null) {

                } else {
                    value = o.getValue();
                }
                //console_logs('value', value);
                var o1 = this.getSearchWidget(srchId + '_')
                //console_logs('o1', o1);
                if (o1 == null) {

                } else {
                    value1 = o1.getValue();
                }
            } catch (e) {

            }

            if (value1 != null && value1 != '') {//콤보박스 히든밸류
                this.store.getProxy().setExtraParam(key, value1);
            } else {

                if (key != null && key != '' && value != null && value.length > 0) {
                    if (type == 'area' || key == 'unique_id' || key == 'whouse_uid'
                        || key == 'barcode' || typeof key == 'object') {
                        this.store.getProxy().setExtraParam(key, value);
                    } else {
                        //console_logs('key', key);
                        //console_logs('value', value);
                        var enValue = Ext.JSON.encode('%' + value + '%');
                        this.store.getProxy().setExtraParam(key, enValue);
                    }//endofelse

                } else {//endofif
                    this.store.getProxy().setExtraParam(key, null);
                }

            }
        }

        this.store.getProxy().setExtraParam('existStock', 'true');

        this.store.load(function (records) {

        });

    },
    items: [],
    productviewType: "ALL",
    potype: 'PRD',
    records: [],
    cnt: 0,
    po_no_records: [],


//바코드 출력

printBarcode: function () {

    //var selections = selected_rec;
    var selections = gm.me().grid.getSelectionModel().getSelection();

    //var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
    var counts = 0;

    var uniqueIdArr = [];
    var item_name = '';

    var item_name_Arr = [];
    var compare_Arr = [];
    var uniqueIdArr = [];

    for (var i = 0; i < selections.length; i++) {
        var rec = selections[i];
        var uid = rec.get('unique_id');  //Srcahd unique_id
        item_name = rec.get('item_name');
        uniqueIdArr.push(uid);
        item_name_Arr.push(item_name);

        compare_Arr.push(item_name);
    }

    var form = Ext.create('Ext.form.Panel', {
        id: gu.id('formPanel'),
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
       

    });//Panel end...

    //원본
    // if (uniqueIdArr.length > 0) {
    //     prwin = gMain.selPanel.prbarcodeopen(form);
    // }


    var compare = [];
    var checkCompare = 0;

    for (var i = 0; i < item_name_Arr.length; i++) {
        for (var j = 0; j < compare_Arr.length; j++) {
            if (item_name_Arr[i] == compare_Arr[j]) {
            } else {
                checkCompare = j + j;
            }
        }
    }

    console_logs('checkCompare 비교 값   >>>', checkCompare);

    if (uniqueIdArr.length > 0) {
        if (checkCompare > 0) {
            Ext.Msg.alert('안내', '동일한 품명을 선택해주세요', function () { });

        } if (checkCompare == 0) {
            //prwin = gMain.selPanel.prbarcodeopen(form);
            prwin = gMain.selPanel.barcodeModal(form);
            
        }
    }

},

// 바코드 모달



barcodeModal: function (form) {

    //셀렉션붙임 시작
    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

    var uniqueIdArr = [];
    var bararr = [];

    var cartmap_uid_array = [];
    var srcahd_uid_array = [];
    var item_code_uid_array = [];
    var item_name_uid_array = [];
    var po_no_arr = [];
    var pj_uids = [];
    var gr_quan_arr = [];
    var pcs_desc_arr = [];


    var countPlus = 0;


    for (var i = 0; i < selections.length; i++) {
        var rec = selections[i];
        console_logs('rec', rec);
        var uid = rec.get('unique_id');  //rtgast unique_id???
        var item_code = rec.get('item_code');
        var item_name = rec.get('item_name');
        var specification = rec.get('specification');
        var lot_no = rec.get('lot_no');
        var bar_spec = item_code + '|' + item_name + '|' + specification;
        var srcahd_uid = rec.get('srcahd_uid');


        //var GrQuan = rec.get(('gr_quan'));
        var GrQuan = rec.get(('pr_qty'));
        var pcs_desc_group_assy = rec.get('pcs_desc_group_assy');

        // srcahd.finance_rate,
        //  srcahd.cost_qty,

        pcs_desc_arr.push(pcs_desc_group_assy);
        gr_quan_arr.push(GrQuan);

        uniqueIdArr.push(uid);
        bararr.push(bar_spec);
        cartmap_uid_array.push(uid);
        srcahd_uid_array.push(srcahd_uid);

        item_code_uid_array.push(item_code);
        item_name_uid_array.push(item_name);

    }
    //셀렉션 붙임 끝


    var boxPacking = null;

    var printQuan = null;

    var etc_grid = Ext.create('Ext.grid.Panel', {


        store: new Ext.data.Store(),
        cls: 'rfx-panel',
        id: gu.id('etc_grid'),
        collapsible: false,
        multiSelect: false,
        width: 750,
        height : 500,
        autoScroll: true,
        margin: '0 0 20 0',
        autoHeight: true,
        frame: false,
        border: true,
        layout: 'fit',
        forceFit: true,

        columns: [
            {
                id: gu.id('countVale'),
                
                //text: item_code,
                text: '포장수량 설정', 

                width: '20%',
                dataIndex: 'packing',
                editor: 'numberfield',
                //value : this.value,

                listeners: {
  
                },

                renderer : function(value) {
                 
                    gm.me().vEachValueee=value;
                    boxPacking =  gm.me().vEachValueee;
                    console_logs( '  boxPacking 첫번째 '   , boxPacking);

                    return value;
                },

                value : boxPacking,

                sortable: false
            },

            {
                //text: '품명(' + item_name + ') 입고 수량 :' + gr_quan_arr,
                text: '출력 매수',
                //value : gu.id('countVale') * gr_quan_arr,
                width: '20%',
                dataIndex: 'each',
                //editor: 'textfield',
                editor: 'numberfield',
                sortable: false,

                renderer : function(value) {

                    console_logs(' 렌더 value   ', value );
                  
                    gm.me().vprintQuan=value;
                    printQuan =  gm.me().vprintQuan;
                  
                    return value;
                },

                value : printQuan,

            },
            {
                text: '출력 자재 총 수량  ',
                width: '30%',
              
                dataIndex: 'each',
                editor: 'numberfield',
                sortable: false,

                renderer : function(value) {
                    //console_logs(' ' , );

                    return printQuan * boxPacking;

                    //return value * 5;
                }
            },

            // {
            //     text: 'Lot 입력 ',
            //     width: '30%',
            //     //id 중복 xxxx
            //     id: gu.id('OrderGoodsLotInputForm'),
              
            //     //dataIndex: 'supplyerLot',
            //     dataIndex: 'input_lot',
            //     name: 'input_lot',
                
            //     editor: 'textfield',
            //     sortable: false,

            //     // renderer : function(value) {
            //     //     return printQuan * boxPacking;

            //     // }
            // },

          

        ],




        selModel: 'cellmodel',
        plugins: {
            ptype: 'cellediting',
            //clicksToEdit: 2,
            clicksToEdit: 6,
        },
        listeners: {

            click: function () {
              
            }
        },
        autoScroll: true,
        dockedItems: [


            Ext.create('widget.toolbar', {

                plugins: {
                    boxreorderer: false
                },
                cls: 'my-x-toolbar-default2',
                margin: '0 0 0 0',
                items: [
                    '->',

                    {
                        xtype: 'textfield',
                        name: 'print_qty',
                        fieldLabel: '품명',
                        margin: '0 7 0 7',
                        editable: false,
                        width: 200,
                        allowBlank: false,
                        value: item_name,
                        maxlength: '1',
                    },

                    {
                        text: '+',
                        listeners: [{
                            click: function () {
                                
                                // var store = gu.getCmp('etc_grid').getStore();

                                //  store.insert(store.getCount(), new Ext.data.Record({
                                //      'packing': '0', 'each': '0'
                                //  }));

                                 var store = gu.getCmp('etc_grid').getStore();
                                 var getCount = store.getCount();

                                 console_logs('item index >> ', getCount);


                                //+ 버튼은 한번만 입력되도록
                                 
                                // if(getCount==0 ) {

                                //     console_log('item index >> null ');
                                //     store.insert(store.getCount(), new Ext.data.Record({
                                //         'packing': '0', 'each': '0'
                                //     }));

                                //  };

                                store.insert(store.getCount(), new Ext.data.Record({
                                    'packing': '0', 'each': '0'
                                }));
                                
                                var obj = gu.getCmp('countVale');
                                var grValue = obj['value'];

                                console_logs( '연산한 값 3333>>>>', grValue);

                                countPlus = countPlus + 1;
                                //console_logs('countPlus 출력 >>>> ', countPlus);
                               
                            }
                        }]
                    },

                    {
                        text: '-',
                        listeners: [{
                            click: function () {
                                var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                                gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));
                            }
                        }]
                    },

                ]
                 }),
                 
                ]
            });


    prWin = Ext.create('Ext.Window', {
        modal: true,
        title: '자재 입고 바코드 출력  '  ,
        width: 770,
        height: 350,
        plain: true,
        //items: poEditForm,
        //items: form,

        items: etc_grid,

        overflowY: 'scroll',

        buttons: [{
            text: '바코드 출력',

            handler: function (btn) {

                  var store = gu.getCmp('etc_grid').getStore();
                     var totalIndex = store.getCount();

                //     store.insert(store.getCount(), new Ext.data.Record({
                //     'packing': '0', 'each': '0'
                //  }));

                //      var record = gu.getCmp('etc_grid').getSelectionModel().getSelected().items[0];
                //                 gu.getCmp('etc_grid').getStore().removeAt(gu.getCmp('etc_grid').getStore().indexOf(record));

                var packingTotal = [];
                var printTotal = [];

                var packingCount = 0;
                var printCount = 0;
                var multiple = 0;

                var intputLotno = [];


                var quanArray = []; //포장수량 배열
                var lotArray = []; //로트 배열
                var printQuanArray = [];   //출력 매수 배열


                for(i=0; i<totalIndex; i++) {
                    packingCount = packingCount + store.data.items[i].get('packing');
                    printCount = printCount + store.data.items[i].get('each');
                    multiple = multiple + store.data.items[i].get('packing') * store.data.items[i].get('each');
                    //packingTotal.push(packingCount);
                    //printTotal.push(printCount);
                    intputLotno = multiple + store.data.items[i].get('input_lot');


                    var packing = store.data.items[i].get('packing');
                    var each = store.data.items[i].get('each');
                    var input_lot = store.data.items[i].get('input_lot');

                    quanArray.push(packing);
                    printQuanArray.push(each);
                    lotArray.push(input_lot);

                }




                // var testLot = gu.getCmp('OrderGoodsLotInputForm');
                // var LotValue = testLot['value'];


                var LotValue = intputLotno
                
                //원본 (+ 0번째만)
                //var checkValue = printQuan * boxPacking;

                //prwin = gm.me().checkSumOpen(form);

                console_logs('GrQuan 출력 >>' , GrQuan );
                console_logs('LotValue 출력 >>' , LotValue );

                if( multiple < GrQuan ) {
                    // console_log('총 수량 보다 적습니다'  );
                    // prwin = gm.me().checkSumOpen(form);

                    Ext.Msg.alert('알림', '입고 예정 수량 보다 적습니다.');

                }else { 

                var objs = [];
                var columns = [];
                var obj = {};
                var store = gu.getCmp('etc_grid').getStore();

                //cnt는 상관없음
                //var cnt = store.getCount();

                var packingArr = [];
                var packingArray = [];

                var each = 0;
                Boolean = true;
                var sumQty = 0;

                 sumQty = printQuan * boxPacking;

                console_logs( 'printQuan  >>>>>>>>  ', printQuan );
                console_logs( 'boxPacking  >>>>>>>>  ', boxPacking );



                for(var x=0; x<sumQty; x++){
                    //리스트별로 포장수량 입력
                    packingArray.push(boxPacking);
                }

                if (btn == 'no') {
                    prWin.close();
                   
                } else {


                    Ext.Ajax.request({
                        //url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=sanction',
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeBioT',

                        params: {

                            print_type : 'EACH',
                         
                            countPlus: printQuan,
                            print_qty : printQuan,

                            packingArr : packingArray,
                            
                            lotrtgastUids: uniqueIdArr,
                            barcodes: bararr,
                            lot_no: lot_no,
                            cartmap_uid_list: cartmap_uid_array,
                            srcahd_uid_list: srcahd_uid_array,
                            item_code_uid_list: item_code_uid_array,
                            item_name_uid_list: item_name_uid_array,
                            //gr_quan_arr : gr_quan_list
                            gr_quan_list: gr_quan_arr,
                            pcs_desc_list: pcs_desc_arr,
                            input_lot : LotValue,
                            //Boolean : Boolean,
                            labelType : 'order',


                            quanArray : quanArray, 
                            printQuanArray : printQuanArray,
                            lotArray : lotArray
                        },


                        success: function (result, request) {

                            prWin.close();

                        },
                        failure: extjsUtil.failureMessage
                    });

                }

            }   //else 끝
            }
        },

            , {
            text: '취소',
            handler: function () {
                if (prWin) {
                    prWin.close();
                }
            }
        }
        ]
    });
    prWin.show();
},

    

    

    doRelease: function() {

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('releaseForm'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '입력사항',
                    items: [
                        {
                            fieldLabel: '사유',
                            xtype: 'combo',
                            anchor: '100%',
                            name: 'reason_text',
                            mode: 'local',
                            store: Ext.create('Rfx.store.GeneralCodeStore', { hasNull: false, parentCode: 'RELEASE_CODE' }),
                            displayField: 'codeName',
                            valueField: 'systemCode',
                            emptyText: '선택',
                            sortInfo: { field: 'systemCode', direction: 'DESC' },
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div>[{systemCode}] {codeName}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
                        },
                        {
                            xtype: 'datefield',
                            anchor: '100%',
                            fieldLabel: '일자',
                            name: 'gr_date',
                            allowBlank: false,
                            value: ''
                        },
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            fieldLabel: '품번',
                            name: 'item_code',
                            allowBlank: false,
                            editable: false,
                            value: rec.get('item_code')
                        },
                        {
                            xtype: 'numberfield',
                            anchor: '100%',
                            fieldLabel: '수량',
                            name: 'gr_quan',
                            allowBlank: false,
                            value: 0
                        },
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            fieldLabel: '비고',
                            name: 'etc',
                            allowBlank: true,
                            value: ''
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: gm.getMC('CMD_Release','출고'),
            width: 350,
            height: 270,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var selection = gm.me().grid.getSelectionModel().getSelection();

                    if (selection.length > 0) {
                        var rec = selection[0];

                        form.submit({
                            url: CONTEXT_PATH + '/index/process.do?method=releaseProductDirect',
                            params: {
                                srcahd_uid: rec.get('unique_id_long')
                            },
                            success: function (val, action) {
                                prWin.close();
                                gm.me().store.load();
                            },
                            failure: function (val, action) {
                                prWin.close();
                                gm.me().store.load();
                            }
                        });
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function (btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    },

    doWarehousing: function () {

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('warehousingForm'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: '기본정보 입력',
                    items: [
                        {
                            fieldLabel: '사유',
                            xtype: 'combo',
                            anchor: '100%',
                            name: 'reason_text',
                            mode: 'local',
                            store: Ext.create('Rfx.store.GeneralCodeStore', { hasNull: false, parentCode: 'WAREHOUSING_CODE' }),
                            displayField: 'codeName',
                            valueField: 'systemCode',
                            emptyText: '사유를 선택하십시오.',
                            sortInfo: { field: 'systemCode', direction: 'DESC' },
                            typeAhead: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div>[{systemCode}] {codeName}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
                        },
                        {
                            xtype: 'datefield',
                            anchor: '100%',
                            fieldLabel: '일자',
                            name: 'gr_date',
                            format: 'Y-m-d',
                            allowBlank: false,
                            value: ''
                        },
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            fieldLabel: '품번',
                            name: 'item_code',
                            allowBlank: false,
                            editable: false,
                            fieldStyle: 'background-color: #ddd; background-image: none;',
                            value: rec.get('item_code')
                        },
                        {
                            xtype: 'numberfield',
                            anchor: '100%',
                            fieldLabel: '수량',
                            name: 'gr_quan',
                            allowBlank: false,
                            value: 0
                        },
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            fieldLabel: '비고',
                            name: 'etc',
                            allowBlank: true,
                            value: ''
                        },
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: '생산 LOT 정보 입력',
                    items: [
                        {
                            fieldLabel: '생산지',
                            xtype: 'combo',
                            anchor: '100%',
                            name: 'product_site',
                            mode: 'local',
                            store: Ext.create('Rfx.store.GeneralCodeStore', { hasNull: false, parentCode: 'PROUDCT_SITE' }),
                            displayField: 'codeName',
                            valueField: 'systemCode',
                            emptyText: '생산지를 선택하십시오.',
                            sortInfo: { field: 'systemCode', direction: 'DESC' },
                            typeAhead: false,
                            allowBlank: false,
                            minChars: 1,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function () {
                                    return '<div>{codeName}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {

                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            id: gu.id('lotNo'),
                            fieldLabel: 'LOT NO',
                            name: 'lotNo',
                            allowBlank: false,
                            value: '',
                            editable: true,
                            emptyText: 'ex) HCE0FAZC > OFAZC로 입력'
                        }
                    ]
                }
            ]
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: gm.getMC('CMD_Wearing','입고'),
            width: 500,
            height: 380,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var selection = gm.me().grid.getSelectionModel().getSelection();
                    var lotNo = gu.getCmp('lotNo').getValue();
                    if (lotNo.length === 0) {
                        Ext.MessageBox.alert('알림', 'LOT No 를 입력해 주십시오.');
                        return;
                    } else {
                        if (lotNo.length < 5) {
                            Ext.MessageBox.alert('알림', 'LOT번호 형식이 일치하지 않습니다.');
                            return;
                        }
                    }
                    if (selection.length > 0) {
                        var rec = selection[0];
                        form.submit({
                            submitEmptyText : false,
                            url: CONTEXT_PATH + '/index/process.do?method=makeProjectToWarehouse',
                            params: {
                                srcahd_uid: rec.get('unique_id_long'),
                                whouse_uid: rec.get('whouse_uid')
                            },
                            success: function (val, action) {
                                prWin.close();
                                gm.me().store.load();
                                gm.me().productDetailStore.load();
                            },
                            failure: function (val, action) {
                                prWin.close();
                                gm.me().store.load();
                                gm.me().productDetailStore.load();
                                Ext.MessageBox.alert('알림','입고 프로세스를 실시했으나 실패했습니다.')
                            }
                        });
                    }
                }
            }, {
                text: CMD_CANCEL,
                handler: function (btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    },

    searchStore: Ext.create('Mplm.store.MaterialSearchStore', {}),

    projectStore: Ext.create('Mplm.store.ProjectStore', {})
});
