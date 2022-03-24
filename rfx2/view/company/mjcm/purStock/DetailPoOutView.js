Ext.define('Rfx2.view.company.mjcm.purStock.DetailPoOutView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'detail-po-out-view',
    cartmap_uids: [],
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();
        this.addSearchField (
            {
                field_id: 'date_type'
                ,store: "DatetypeStore"
                ,displayField: 'codeName'
                ,valueField: 'systemCode'
                ,emptyText: '기준기간'
                ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            });

        this.addSearchField ({
            type: 'dateRange',
            field_id: 'listpodate',
            labelWidth: 0,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

        this.addSearchField ('po_no');
        // this.addSearchField ('seller_name');
        // this.addSearchField ('wa_name');
        //this.addSearchField ('item_name_dabp');//(원지는 지종 / 원단은 지종배합)

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');
        this.addReadonlyField('creator');
        this.addReadonlyField('creator_uid');
        this.addReadonlyField('user_id');
        this.addReadonlyField('board_count');


        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.partlineStockStore = Ext.create('Rfx2.store.company.bioprotech.PartlineStockStore', {});

        this.createPrAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '구매 요청',
            tooltip: '구매 요청',
            disabled: true,
            handler: function () {
                gm.me().treatPr();
            } //handler end...
        });

        this.createInPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '불출 요청',
            tooltip: '불출 요청',
            disabled: true,
            handler: function () {
                gm.me().treatInPo();
            } //handler end...
        });

        this.bomListGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('bomListGrid'),
            store: this.partlineStockStore,
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
                        this.createPrAction,
                        this.createInPoAction
                    ]
                }
            ],
            columns: [
                { text: '품번', width: 100, style: 'text-align:center', dataIndex: 'item_code', sortable: false },
                { text: '품명', width: 150, style: 'text-align:center', dataIndex: 'item_name', sortable: false },
                { text: '규격', width: 150, style: 'text-align:center', dataIndex: 'specification', sortable: false },
                { text: '단위', width: 50, style: 'text-align:center', dataIndex: 'unit_code', sortable: false },
                { text: '단위수량', width: 100, style: 'text-align:center', dataIndex: 'unit_mass', sortable: false },
                { text: '본사재고', width: 100, style: 'text-align:center', dataIndex: 'stock_qty_useful', sortable: false },
                { text: '외주재고', width: 100, style: 'text-align:center', dataIndex: 'stock_qty_useful', sortable: false },
                { text: '필요수량', width: 100, style: 'text-align:center', dataIndex: 're_quan', sortable: false,
                    renderer: function (value, meta, record) {
                        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                        var pQuan = rec.get('pr_qty');
                        var bQuan = record.get('bm_quan');

                        return Ext.util.Format.number(pQuan * bQuan, '0,00.##/i');
                    }
                },
                { text: '소요량', width: 100, style: 'text-align:center', dataIndex: 'bm_quan', sortable: false },
                { text: '단가', width: 100, style: 'text-align:center', dataIndex: 'sales_price', sortable: false },
                { text: '금액', width: 150, style: 'text-align:center', dataIndex: 'total_sales_price', sortable: false }
            ],
            title: '하위 자재',
            autoScroll: true,
            listeners: {
            }
        });

        console_logs('this.fields', this.fields);

        this.bomListGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections.length > 0) {
                    gm.me().setSelections(selections);
                    gm.me().createInPoAction.enable();
                    gm.me().createPrAction.enable();
                } else {
                    gm.me().createInPoAction.disable();
                    gm.me().createPrAction.disable();
                }
            }
        });

        this.createStore('Rfx2.model.company.kbtech.DetailPoOut', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gm.pageSize
        );

        this.store.getProxy().setExtraParam('route_type', 'OU,U,UC');
        this.store.getProxy().setExtraParam('po_type', 'OU');

        var toolbars = [];
        toolbars.push(buttonToolbar);
        toolbars.push(searchToolbar);
        this.createGrid(toolbars);

        this.grAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: 'ASSY 입고',
            tooltip: 'ASSY 입고',
            disabled: true,
            handler: function() {

                if(gm.me().grid.getSelectionModel().getSelection()[0].get('by_status') != 'Y') {
                    Ext.Msg.alert('', '해당 ASSY의 하위 자재 불출이 완료 되지 않았습니다.');
                } else {
                    var form = Ext.create('Ext.form.Panel', {
                        xtype: 'form',
                        frame: false ,
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
                                title: '입고 수량을 정확히 입력하시기 바랍니다.',
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        id: gu.id('gr_quan'),
                                        anchor: '97%',
                                        name: 'gr_quan',
                                        fieldLabel: '금번 입고수량'
                                    }
                                ]
                            }
                        ]
                    });

                    var prWin =	Ext.create('Ext.Window', {
                        modal : true,
                        title: 'ASSY 입고',
                        width: 450,
                        height: 180,
                        items: form,
                        buttons: [
                            {text: CMD_OK,
                                scope:this,
                                handler:function() {
                                    //첫번째만 갖고 와야 한다.
                                    var selection = gm.me().grid.getSelectionModel().getSelection()[0];

                                    var gr_quan = selection.get('gr_qty');
                                    var pr_quan = selection.get('pr_qty');
                                    var ngr_quan = pr_quan - gr_quan;
                                    var cur_gr_quan = gu.getCmp('gr_quan').getValue();

                                    var cartmap_uid = selection.get('unique_id_long');

                                    if(cur_gr_quan > ngr_quan) {
                                        Ext.Msg.alert('', '입력 수량이 미입고 수량보다 더 많습니다.');
                                    } else {
                                        Ext.Ajax.request({
                                            url : CONTEXT_PATH + '/index/process.do?method=warehouseAssy',
                                            params: {
                                                'cartmap_uid' : cartmap_uid,
                                                'gr_quan' : cur_gr_quan
                                            },
                                            success: function(val, action){
                                                if(prWin){
                                                    prWin.close();
                                                }
                                                gm.me().storeLoad();
                                            },
                                            failure: function(val, action) {
                                                if(prWin){
                                                    prWin.close();
                                                }
                                            }
                                        });
                                    }
                                }},
                            {text: CMD_CANCEL,
                                scope:this,
                                handler:function(){
                                    if(prWin){
                                        prWin.close();
                                    }
                                }}
                        ]
                    });

                    prWin.show();
                }

            } //handler end...
        });

        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            /*text: '제작',*/
            text: '작업지시서 출력',
            tooltip:'작업지시서 출력',
            disabled: true,

            handler: function(widget, event) {
                var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID;
                var po_no = gMain.selPanel.vSELECTED_PO_NO;
                var pcs_code = gMain.selPanel.vSELECTED_PCS_CODE;
                var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                console_logs('pdf po_no>>>>>>>>>>>>>>>>>>>', po_no);
                console_logs('pdf pcs_code>>>>>>>>>>>>>>>>>>>', pcs_code);
                console_logs('pdf ac_uid>>>>>>>>>>>>>>>>>>>', ac_uid);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printWoOu',
                    params:{
                        rtgast_uid : rtgast_uid,
                        po_no : po_no,
                        pcs_code : pcs_code,
                        ac_uid : ac_uid,
                        is_heavy : 'Y',	 //중공업:Y  기타:N
                        is_rotate : 'N', //가로양식:Y 세로양식:N
                        wo_type : 'P',
                        pdfPrint : 'pdfPrint'
                    },
                    reader: {
                        pdfPath: 'pdfPath'
                    },
                    success : function(result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        console_logs(pdfPath);
                        if(pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                            top.location.href=url;
                        }
                    },
                    failure: extjsUtil.failureMessage
                });


            }
        });

        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4||index==5) {
                buttonToolbar.items.remove(item);
            }
        });

        //버튼 추가.
        //buttonToolbar.insert(1, this.grAction);
        buttonToolbar.insert(1, this.printPDFAction);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
                    frame: false,
                    region: 'west',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    margin: '5 0 0 0',
                    width: '40%',
                    items: [{
                        region: 'west',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '100%',
                        items: [this.grid]
                    }]
                }, {
                    collapsible: false,
                    frame: false,
                    region: 'center',
                    layout: {
                        type: 'border',
                        pack: 'start',
                        align: 'stretch'
                    },
                    defaults: {
                        collapsible: false,
                        split: true
                    },
                    margin: '5 0 0 0',
                    width: '60%',
                    items: [{
                        region: 'center',
                        layout: 'fit',
                        margin: '0 0 0 0',
                        width: '60%',
                        items: [this.bomListGrid]
                    }]
                }
            ]
        });

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {

            if (selections.length) {
                gm.me().grAction.enable()
                var rec = selections[0];
                gMain.selPanel.vSELECTED_RTGAST_UID = rec.get('pr_seq');
                gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid');
                gMain.selPanel.vSELECTED_PO_NO = rec.get('pj_code');
                gMain.selPanel.printPDFAction.enable();
                gMain.selPanel.vSELECTED_PCS_CODE = rec.get('pcs_code');
                gMain.selPanel.vSELECTED_STATE = rec.get('state'); //product의 item_code

                var store = gm.me().partlineStockStore;

                store.getProxy().setExtraParam('parent', rec.get('srcahd_uid'));
                store.getProxy().setExtraParam('parent_uid', rec.get('coord_key3'));
                store.getProxy().setExtraParam('orderBy', 'pl_no');
                store.getProxy().setExtraParam('ascDesc', 'ASC');
                store.getProxy().setExtraParam('ac_uid', rec.get('project_uid'));

                store.load(function(records) {
                });
            } else {
                gm.me().grAction.disable();
            }
        })

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },

    items : [],
    poviewType: 'ALL',

    treatPr: function () {

        var selections = gm.me().bomListGrid.getSelectionModel().getSelection();

        var form = null;

        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;

        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
        } else {
            this.treatMtrlPr();
        }
    },

    treatInPo: function () {

        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;

        var next = gUtil.getNextday(0);

        var request_date = gm.me().request_date;
        var pj_name = gm.me().vSELECTED_pj_name;
        var stock_qty_useful = gm.me().vSELECTED_STOCK_USEFUL;

        var selections = gm.me().bomListGrid.getSelectionModel().getSelection();

        var isDifferent = false;


        if (selections.length > 1) {
            for (var i = 0; i < selections.length - 1; i++) {
                if (selections[i].get('ac_uid') != selections[i + 1].get('ac_uid')) {
                    isDifferent = true;
                    break;
                }
            }
        }

        var form = null;

        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알림", "선택된 자재가 없습니다.");
        } else {
            if (stock_qty_useful == undefined || stock_qty_useful == "" || stock_qty_useful == null) {
                Ext.Msg.alert("알림", "가용재고가 없습니다. 확인해주세요.");
            } else if (isDifferent) {
                Ext.Msg.alert('알림', '같은 프로젝트를 선택해주세요.', function () {
                });
            } else {
                this.treatMtrlOut();
            }
        }
    },

    //구매요청 폼
    treatMtrlPr: function () {
        var next = gUtil.getNextday(0);
        var arrExist = [];
        var arrCurrency = [];
        var arrTotalPrice = [];
        var cartmapUids = [];
        var selections = gm.me().bomListGrid.getSelectionModel().getSelection();
        var specs = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var unique_id = rec.get('unique_id');
            var child = rec.get('child');
            var item_name = rec.get('item_name');
            var specification = rec.get('specification');
            var pj_name = rec.get('pj_name');
            var stock_qty_useful = rec.get('stock_qty_useful');
            var quan = rec.get('quan');
            var sales_price = rec.get('sales_price');
            cartmapUids.push(rec.get('unique_uid'));
            //	        		total = total+total_price;
            arrExist.push(item_name);
            specs.push(specification);

            console_logs('arrTotalPrice----------------', arrTotalPrice);

            console_logs('arrExist----------------', arrExist);
            console_logs('arrCurrency----------------', arrCurrency);
        }

        var reserved_varcharb = null;

        var orderBy = "사내";

        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: true,
            border: false,
            bodyPadding: 10,
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                layout: 'form',
                xtype: 'container',
                defaultType: 'textfield',
                style: 'width: 50%'
            },
            items: [{
                xtype: 'fieldset',
                title: '구매요청',
                width: 400,
                margins: '0 20 0 0',
                collapsible: true,
                anchor: '100%',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {
                            top: 0,
                            right: 100,
                            bottom: 0,
                            left: 10
                        }
                    }
                },
                items: [{
                    fieldLabel: '주문처',
                    xtype: 'textfield',
                    hidden: true,
                    anchor: '100%',
                    /*id: 'stcok_pur_supplier_info',
                     name: 'stcok_pur_supplier_info',*/
                    id: 'in_supplier',
                    name: 'in_supplier',
                    value: orderBy,//'스카나코리아',
                    //	            		emptyText: '스카나코리아',
                    allowBlank: false,
                    typeAhead: false,
                    editable: false,
                },
                    {
                        fieldLabel: '프로젝트',
                        name: 'pj_name',
                        fieldLabel: '프로젝트',
                        anchor: '-5',
                        //readOnly : true,
                        //fieldStyle : 'background-color: #ddd; background-image: none;',
                        allowBlank: true,
                        editable: false,
                        value: pj_name
                    },

                    {
                        fieldLabel: '납품장소',
                        hidden: true,
                        xtype: 'textfield',
                        rows: 4,
                        anchor: '100%',
                        id: 'reserved_varchar1',
                        name: 'reserved_varchar1',
                        value: (vCompanyReserved4 == 'SKNH01KR') ? '당사 현장사무실(자재팀)' : '사내'
                    },

                    {
                        fieldLabel: '비고',
                        xtype: 'textarea',
                        rows: 4,
                        anchor: '100%',
                        id: 'reserved_varchar2',
                        name: 'reserved_varchar2',

                    },
                    {
                        fieldLabel: '품명',
                        xtype: 'textfield',
                        id: 'item_name',
                        name: 'item_name',
                        value: arrExist[0] + ' 포함 ' + arrExist.length + '건',
                        readOnly: true

                    },
                    {
                        fieldLabel: '규격',
                        xtype: 'textfield',
                        id: 'specification',
                        name: 'specification',
                        value: specs[0] + ' 포함 ' + specs.length + '건',
                        readOnly: true

                    },
                    {
                        fieldLabel: '가용재고',
                        xtype: 'textfield',
                        hidden: true,
                        id: 'stock_qty_useful',
                        name: 'stock_qty_useful',
                        value: stock_qty_useful,
                        readOnly: true

                    },
                    {
                        fieldLabel: '주문수량',
                        xtype: 'textfield',
                        hidden: true,
                        id: 'quan',
                        name: 'quan',
                        value: quan,
                        fieldStyle: 'background-color:#FBF8E8; background-image: none;',
                        editable: true

                    }
                ]
            }]
        });
        myHeight = 290;
        myWidth = 420;

        prwin = this.Inprwinopen(form);
    },

    //불출요청 폼
    treatMtrlOut: function () {
        var next = gUtil.getNextday(0);
        var arrExist = [];
        var arrCurrency = [];
        var arrTotalPrice = [];
        var cartmapUids = [];
        var selections = gm.me().bomListGrid.getSelectionModel().getSelection();
        var specs = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var unique_id = rec.get('unique_id');
            var child = rec.get('child');
            var item_name = rec.get('item_name');
            var specification = rec.get('specification');
            var pj_name = rec.get('pj_name');
            var stock_qty_useful = rec.get('stock_qty_useful');
            var quan = rec.get('quan');
            var sales_price = rec.get('sales_price');
            cartmapUids.push(rec.get('unique_uid'));
            //	        		total = total+total_price;
            arrExist.push(item_name);
            specs.push(specification);

            console_logs('arrTotalPrice----------------', arrTotalPrice);

            console_logs('arrExist----------------', arrExist);
            console_logs('arrCurrency----------------', arrCurrency);
        }

        var reserved_varcharb = null;

        var orderBy = "사내";

        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: true,
            border: false,
            bodyPadding: 10,
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                layout: 'form',
                xtype: 'container',
                defaultType: 'textfield',
                style: 'width: 50%'
            },
            items: [{
                xtype: 'fieldset',
                title: '불출요청',
                width: 400,
                margins: '0 20 0 0',
                collapsible: true,
                anchor: '100%',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {
                            top: 0,
                            right: 100,
                            bottom: 0,
                            left: 10
                        }
                    }
                },
                items: [{
                    fieldLabel: '주문처',
                    xtype: 'textfield',
                    hidden: true,
                    anchor: '100%',
                    /*id: 'stcok_pur_supplier_info',
                     name: 'stcok_pur_supplier_info',*/
                    id: 'in_supplier',
                    name: 'in_supplier',
                    value: orderBy,//'스카나코리아',
                    //	            		emptyText: '스카나코리아',
                    allowBlank: false,
                    typeAhead: false,
                    editable: false,
                },
                    {
                        fieldLabel: '프로젝트',
                        name: 'pj_name',
                        fieldLabel: '프로젝트',
                        anchor: '-5',
                        //readOnly : true,
                        //fieldStyle : 'background-color: #ddd; background-image: none;',
                        allowBlank: true,
                        editable: false,
                        value: pj_name
                    },

                    {
                        fieldLabel: '납품장소',
                        hidden: true,
                        xtype: 'textfield',
                        rows: 4,
                        anchor: '100%',
                        id: 'reserved_varchar1',
                        name: 'reserved_varchar1',
                        value: (vCompanyReserved4 == 'SKNH01KR') ? '당사 현장사무실(자재팀)' : '사내'
                    },

                    {
                        fieldLabel: '비고',
                        xtype: 'textarea',
                        rows: 4,
                        anchor: '100%',
                        id: 'reserved_varchar2',
                        name: 'reserved_varchar2',

                    },
                    {
                        fieldLabel: '품명',
                        xtype: 'textfield',
                        id: 'item_name',
                        name: 'item_name',
                        value: arrExist[0] + ' 포함 ' + arrExist.length + '건',
                        readOnly: true

                    },
                    {
                        fieldLabel: '규격',
                        xtype: 'textfield',
                        id: 'specification',
                        name: 'specification',
                        value: specs[0] + ' 포함 ' + specs.length + '건',
                        readOnly: true

                    },
                    {
                        fieldLabel: '가용재고',
                        xtype: 'textfield',
                        hidden: true,
                        id: 'stock_qty_useful',
                        name: 'stock_qty_useful',
                        value: stock_qty_useful,
                        readOnly: true

                    },
                    {
                        fieldLabel: '주문수량',
                        xtype: 'textfield',
                        hidden: true,
                        id: 'quan',
                        name: 'quan',
                        value: quan,
                        fieldStyle: 'background-color:#FBF8E8; background-image: none;',
                        editable: true

                    }
                ]
            }]
        });
        myHeight = 290;
        myWidth = 420;

        prwin = this.prwinopen(form);
    },

    setSelections: function (selections) {

        if (selections.length) {

            var rec = selections[0];
            gm.me().rec = rec;
            console_logs('rec 데이터', rec);
            //this.checkEqualPjNames(rec);
            var standard_flag = rec.get('standard_flag');
            standard_flag = gUtil.stripHighlight(standard_flag); //하이라이트 삭제

            console_logs('그리드온 데이터', rec);
            gm.me().request_date = rec.get('req_date'); // 납기일
            gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id_long'); //cartmap_uid
            gm.me().vSELECTED_PJ_UID = rec.get('ac_uid'); //프로젝트아이디
            gm.me().vSELECTED_SP_CODE = rec.get('sp_code');
            gm.me().vSELECTED_CURRENCY = rec.get('currency'); //스카나 통화
            gm.me().vSELECTED_STANDARD = rec.get('standard_flag');
            gm.me().vSELECTED_MYCARTQUAN = rec.get('mycart_quan');
            gm.me().vSELECTED_coord_key3 = rec.get('coord_key3'); // pj_uid
            gm.me().vSELECTED_coord_key2 = rec.get('coord_key2');
            gm.me().vSELECTED_coord_key1 = rec.get('coord_key1'); // 공급사
            gm.me().vSELECTED_po_user_uid = rec.get('po_user_uid');
            gm.me().vSELECTED_item_name = rec.get('item_name'); // 품명
            gm.me().vSELECTED_item_code = rec.get('item_code'); // 품번
            gm.me().vSELECTED_specification = rec.get('specification'); // 규격
            gm.me().vSELECTED_pj_name = rec.get('pj_name');
            gm.me().vSELECTED_req_date = rec.get('delivery_plan');
            gm.me().vSELECTED_pr_quan = rec.get('pr_quan');
            gm.me().vSELECTED_QUAN = rec.get('quan');
            gm.me().vSELECTED_PRICE = rec.get('sales_price');
            gm.me().vSELECTED_STOCK_USEFUL = rec.get('stock_qty_useful');

            this.cartmap_uids.push(gm.me().vSELECTED_UNIQUE_ID);

        } else {
            gm.me().vSELECTED_UNIQUE_ID = -1;
            gm.me().vSELECTED_PJ_UID = -1;

            this.cartmap_uids = [];
            this.currencies = [];
            for (var i = 0; i < selections.length; i++) {
                var rec1 = selections[i];
                var uids = rec1.get('id');
                var currencies = rec1.get('currency');
                this.cartmap_uids.push(uids);
                this.currencies.push(currencies);
            }
        }
    },

    // 불출요청
    prwinopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '불출 요청',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var msg = '불출 요청하시겠습니까?';
                    var myTitle = '불출 확인';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,

                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                var po_user_uid = gm.me().vSELECTED_po_user_uid;
                                var srcahdArr = [];
                                var assymapArr = [];
                                var nameArr = [];
                                var priceArr = [];
                                var curArr = [];
                                var quanArr = [];
                                var coordArr = [];
                                var selections = gm.me().bomListGrid.getSelectionModel().getSelection();
                                var ac_uid = selections[0].get('ac_uid');
                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];
                                    var uid = rec.get('id');
                                    var srcahd_uid = rec.get('unique_id');
                                    var coord_key3 = rec.get('coord_key3');
                                    var currency = rec.get('currency');
                                    var item_name = rec.get('item_name');
                                    var static_sales_price = rec.get('static_sales_price');
                                    var request_info = rec.get('request_info');

                                    var unit_mass = rec.get('unit_mass');
                                    var pr_qty = gm.me().grid.getSelectionModel().getSelection()[0].get('pr_qty');
                                    var bm_quan = rec.get('bm_quan');

                                    //불출수량의 수량 = reserved_double1
                                    //var quan = rec.get('reserved_double1');
                                    var quan = unit_mass * Math.ceil(bm_quan * pr_qty / unit_mass);

                                    quanArr.push(quan);
                                    assymapArr.push(uid);
                                    srcahdArr.push(srcahd_uid);
                                    curArr.push(currency);
                                    priceArr.push(static_sales_price);
                                    nameArr.push(item_name);
                                    coordArr.push(coord_key3);

                                }
                                var pj_name = rec.get('pj_name');
                                var static_sales_price = rec.get('static_sales_price'); //cartmap.sales_price

                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    console_logs('val', val);

                                    prWin.setLoading(true);

                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createGoByAssyMap',
                                        params: {
                                            sancType: 'YES',
                                            item_name: item_name,
                                            assymapArr: assymapArr,
                                            srcahdarr: srcahdArr,
                                            quans: quanArr,
                                            currencies: curArr,
                                            names: nameArr,
                                            coord_key3s: coordArr,
                                            sales_prices: priceArr,
                                            pj_name: pj_name,
                                            mp_status: 'GR',
                                            ac_uid: ac_uid
                                        },
                                        success: function (val, action) {
                                            prWin.close();
                                            Ext.Msg.alert('안내', '불출 요청이 완료 되었습니다.', function () {
                                            });
                                            gm.me().goCartListStore.load();
                                            prWin.setLoading(false);
                                        },
                                        failure: function (val, action) {

                                            prWin.close();

                                        }
                                    })
                                } // end of formvalid
                            } // btnIf of end
                        } //fn function(btn)

                    }); //show
                } //btn handler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },

    // 불출요청
    Inprwinopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '구매 요청',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var msg = '구매 요청하시겠습니까?';
                    var myTitle = '구매요청 확인';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,

                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                var po_user_uid = gm.me().vSELECTED_po_user_uid;
                                var srcahdArr = [];
                                var bomArr = [];
                                var bomQtyArr = [];
                                var sites = [];
                                var selections = gm.me().bomListGrid.getSelectionModel().getSelection();

                                var parentSelection = gm.me().grid.getSelectionModel().getSelection()[0];

                                var pr_quan = parentSelection.get('pr_qty');
                                var projectUid = selections[0].get('ac_uid');
                                var assy_child = selections[0].get('parent');
                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];
                                    var uid = rec.get('id');
                                    var srcahd_uid = rec.get('unique_id');

                                    var unit_mass = rec.get('unit_mass');
                                    var pr_qty = gm.me().grid.getSelectionModel().getSelection()[0].get('pr_qty');
                                    var bm_quan = rec.get('bm_quan');

                                    //불출수량의 수량 = reserved_double1
                                    //var quan = rec.get('reserved_double1');
                                    var quan = 0;
                                    if (unit_mass === null || unit_mass === 0) {
                                        quan = Math.ceil(bm_quan * pr_qty);
                                    } else {
                                        quan = unit_mass * Math.ceil(bm_quan * pr_qty / unit_mass);
                                    }

                                    bomQtyArr.push(quan);
                                    bomArr.push(uid);
                                    srcahdArr.push(srcahd_uid);
                                    sites.push('');
                                }
                                var pj_name = rec.get('pj_name');
                                var static_sales_price = rec.get('static_sales_price'); //cartmap.sales_price

                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    console_logs('val', val);

                                    prWin.setLoading(true);

                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=requestOuPr',
                                        params: {
                                            projectUid: projectUid,
                                            bomArr: bomArr,
                                            srcahdArr: srcahdArr,
                                            bomQtyArr: bomQtyArr,
                                            assy_child: assy_child,
                                            pr_quan: pr_quan,
                                            sites: sites
                                        },
                                        success: function (val, action) {
                                            prWin.close();
                                            Ext.Msg.alert('안내', '구매 요청이 완료 되었습니다.', function () {
                                            });
                                            gm.me().goCartListStore.load();
                                            prWin.setLoading(false);
                                        },
                                        failure: function (val, action) {

                                            prWin.close();

                                        }
                                    })
                                } // end of formvalid
                            } // btnIf of end
                        } //fn function(btn)

                    }); //show
                } //btn handler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    }

});

