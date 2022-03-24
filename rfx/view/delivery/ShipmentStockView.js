//출하 관리
Ext.define('Rfx.view.delivery.ShipmentStockView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'shipment-stock-view',
    is_loaded: false,
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();

        Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch(dataIndex) {
                case 'request_qty':
                    columnObj["editor"] = {}; columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
            }

        });

        switch(vCompanyReserved4) {
            case 'KYNL01KR':
                this.addSearchField({
                    type: 'condition',
                    width: 120,
                    sqlName: 'stoqtylinesell',
                    tableName: 'itemdetail',
                    emptyText: 'PALLET 번호',
                    field_id: 'h_reserved43',
                    fieldName: 'h_reserved43',
                    params: {
                        pj_type: 'ST'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 120,
                    sqlName: 'stoqtylinesell',
                    tableName: 'project',
                    emptyText: '프로젝트',
                    field_id: 'pj_name',
                    fieldName: 'pj_name',
                    params: {
                        pj_type: 'ST'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 120,
                    sqlName: 'stoqtylinesell',
                    tableName: 'itemdetail',
                    emptyText: '책권번호',
                    field_id: 'h_reserved2',
                    fieldName: 'h_reserved2',
                    params: {
                        pj_type: 'ST'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 120,
                    sqlName: 'stoqtylinesell',
                    tableName: 'project',
                    emptyText: 'P/O번호',
                    field_id: 'pj_code',
                    fieldName: 'pj_code',
                    params: {
                        pj_type: 'ST'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 120,
                    sqlName: 'stoqtylinesell',
                    tableName: 'product',
                    emptyText: 'BLOCK',
                    field_id: 'area_code',
                    fieldName: 'area_code',
                    params: {
                        pj_type: 'ST'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 120,
                    sqlName: 'stoqtylinesell',
                    tableName: 'assymap',
                    emptyText: '도장외부SPEC1',
                    field_id: 'reserved1',
                    fieldName: 'reserved1',
                    params: {
                        pj_type: 'ST'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 150,
                    sqlName: 'stoqtylinesell',
                    tableName: 'itemdetail',
                    emptyText: '자재내역1',
                    field_id: 'h_reserved6',
                    fieldName: 'h_reserved6',
                    params: {
                        pj_type: 'ST'
                    }
                });
                break;
            default:
                this.addSearchField('wa_name');
                this.addSearchField('specification');
                this.addSearchField('area_code');
        }

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');




        this.setDefValue('create_date', new Date());

        var next7 = gUtil.getNextday(7);
        this.setDefValue('change_date', next7);

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();


        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        switch(vCompanyReserved4){

            case 'SHNH01KR':
            case 'DOOS01KR':
            case 'KYNL01KR':
                (buttonToolbar.items).each(function(item,index,length){
                    if(index==1||index==2 ||index==3 ||index==4 ||index==5) {
                        buttonToolbar.items.remove(item);
                    }
                });
                break;
            default :

                break;
        }


        if(vSYSTEM_TYPE_SUB == 'HEAVY4'){
            var groupType = '';
            switch(vCompanyReserved4){
                case "DDNG01KR":
                    groupType = 'sgroup_item_code';
                    break;
                case "SHNH01KR":
                    groupType = 'po_no';
                    break;
                case "DOOS01KR":
                    groupType = 'area_code';
                    break;
                case "KYNL01KR":
                    groupType = 'area_code';
                    break;
                case 'HSGC01KR':
                    break;
                default :
                    groupType = 'item_code';
                    break;
            }
            this.createStoreSimple({
                modelClass: 'Rfx.model.ShipmentStock',
                //pageSize: gMain.pageSize,
                pageSize : 100,
                sorters: [{
                    property: 'pcs_code',
                    direction: 'asc'
                }]

            }, {
                //groupField: 'sgroup_item_code'
                groupField: groupType
            });
        }else{
            //모델 정의
            this.createStore('Rfx.model.ProductStock', [{
                    property: 'create_date',
                    direction: 'DESC'
                }],
                gMain.pageSizepageSize,{
                    create_date: 'create_date'
                },{
                    groupField: 'po_no'
                }

            );
        }

        this.assignShipmentAction = Ext.create('Ext.Action',{
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Shipment_request', '출하 요청'),
            tooltip: '출하 요청',
            disabled: true,
            handler: function() {
                var win = Ext.create('ModalWindow', {
                    title: '메시지',
                    html: '<br><p style="text-align:center;">출하 요청을 하시겠습니까?</p>',
                    width: 300,
                    height: 120,
                    buttons: [{
                        text: '예',
                        handler: function(){
                            gMain.selPanel.assignShipment();
                            if(win) {
                                win.close();
                            }
                        }
                    },
                        {
                            text: '아니오',
                            handler: function(){
                                if(win) {
                                    win.close();
                                }
                            }
                        }]
                });
                win.show();
            }
        });

        this.discardProductAction = Ext.create('Ext.Action',{
            iconCls: 'af-remove',
            text: '폐기 처리',
            tooltip: '폐기 처리',
            disabled: true,
            handler: function() {
                gMain.selPanel.discardProduct();
            }
        });

        this.printBarcodeAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '바코드 출력',
            tooltip: '제품의 바코드를 출력합니다.',
            disabled: true,
            handler: function() {
                gMain.selPanel.printBarcode();
            }
        });


        this.setAllView = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '전체',
            tooltip: '전체',
            handler: function() {
                gMain.selPanel.productviewType = 'ALL';
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                gMain.selPanel.store.load(function(){});
            }
        });

        this.setPrdView = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '제작',
            tooltip: '제작',
            //pressed: true,
            handler: function() {
                gMain.selPanel.productviewType = 'PRD';
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'PRD');
                gMain.selPanel.store.load(function(){});
            }
        });

        this.setPntView = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '도장',
            tooltip: '도장',
            //pressed: true,
            handler: function() {
                gMain.selPanel.productviewType = 'PNT';
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'PNT');
                gMain.selPanel.store.load(function(){});
            }
        });

        var action = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '소조',
            tooltip: '소조만 보기',
            pressed: true,
            toggleGroup: this.link + 'bigPcsType',
            handler: function() {

                console_logs('big_pcs_code', this.big_pcs_code);
                gm.me().store.getProxy().setExtraParam('pj_type', 'S');
                gm.me().storeLoad();
            }
        });

        var action_t = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '철의장(제작)',
            tooltip: '철의장만 보기',
            big_pcs_code: '',
            toggleGroup: this.link + 'bigPcsType',
            handler: function() {

                console_logs('big_pcs_code', this.big_pcs_code);
                gm.me().store.getProxy().setExtraParam('pj_type', 'T');
                gm.me().storeLoad();
            }
        });

        var action_p = Ext.create('Ext.Action', {
            xtype : 'button',
            text: '도장',
            tooltip: '도장만 보기',
            big_pcs_code: '',
            toggleGroup: this.link + 'bigPcsType',
            handler: function() {

                console_logs('big_pcs_code', this.big_pcs_code);
                gm.me().store.getProxy().setExtraParam('pj_type', 'P');
                gm.me().storeLoad();
            }
        });

        if(vCompanyReserved4 == 'DOOS01KR') {
            buttonToolbar.insert(2, action_p);
            buttonToolbar.insert(2, action_t);
            buttonToolbar.insert(2, action);
        }

        switch(vCompanyReserved4) {
            case 'KYNL01KR':
                break;
            default:
                buttonToolbar.insert(1, '-');
                buttonToolbar.insert(2, this.printBarcodeAction);
        }

        buttonToolbar.insert(6, '-');

        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
            groupHeaderTpl: '{name}'
        });

        var option = {
            features: [groupingFeature],
            listeners: {
                groupclick: function (view, node, group, e, eOpts) {
                    console_logs('groupclick', gMain.selPanel.po_no_records);

                    var arr = '';

                    var chk = true;



                    for(var i=0; i<gMain.selPanel.po_no_records.length ; i++){
                        arr = gMain.selPanel.po_no_records[i];
                        console_logs('arr', arr);
                        if(arr == group){
                            chk = false;
                            break;
                        }else{
                            chk = true;
                        }
                    };

                    gMain.selPanel.groupSelect(group, chk);

                    view.features[0].expand(group);

                }
            },
        };

        //grid 생성.
        this.createGridCore(arr, option);

        //입력/상세 창 생성.
        this.createCrudTab();

        this.tab_info = [];

        if(vCompanyReserved4=='KYNL01KR') {
            for(var i = 0; i < gUtil.mesProductCategory.length; i++) {

                var o = gUtil.mesProductCategory[i];

                this.tab_info.push({
                    code: o['code'],
                    name: o['name'],
                    title: o['name']
                });
            }

            var ti = this.tab_info;
            for(var i=0; i<ti.length; i++) {

                var tab = ti[i];
                console_logs('this.tab',tab);
                console_logs('this.columns_map',this.columns_map);

                var tab_code = tab['code'];
                var myColumn = this.columns_map[tab_code];
                var myField =  this.fields_map[tab_code];
                //유형별 필드 추가하기
                this.addExtraColumnBypcscode(myColumn, myField, tab_code);

                Ext.each(myColumn, function(columnObj, index) {
                    var dataIndex = columnObj["dataIndex"];
                    console_logs('dataIndex', dataIndex);
                    switch(dataIndex) {
                        case 'request_qty':
                            columnObj["editor"] = {}; columnObj["css"] = 'edit-cell';
                            columnObj["renderer"] = function (value, meta) {
                                meta.css = 'custom-column';
                                return value;
                            };
                            break;
                    }
                });

            }

            var items = [];

            var tab = this.createTabGrid('Rfx.model.ShipmentStock', items, 'big_pcs_code', arr, function(curTab, prevtab) {

                var multi_grid_id = curTab.multi_grid_id;

                gm.me().multi_grid_id = multi_grid_id;

                var store = gm.me().store_map[multi_grid_id];
                gMain.selPanel.store = store;

                store.getProxy().setExtraParams({});

                if(vCompanyReserved4 == 'KYNL01KR' && this.is_loaded) {

                    while(gm.me().searchField.length > 0) {
                        gm.me().searchField.pop();
                    }

                    switch(gm.me().multi_grid_id) {
                        case 'ST':
                        case 'SP':
                        case 'ET':
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'itemdetail',
                                emptyText: 'PALLET 번호',
                                field_id: 'h_reserved43',
                                fieldName: 'h_reserved43',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'project',
                                emptyText: '프로젝트',
                                field_id: 'pj_name',
                                fieldName: 'pj_name',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'itemdetail',
                                emptyText: '책권번호',
                                field_id: 'h_reserved2',
                                fieldName: 'h_reserved2',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'project',
                                emptyText: 'P/O번호',
                                field_id: 'pj_code',
                                fieldName: 'pj_code',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'product',
                                emptyText: 'BLOCK',
                                field_id: 'area_code',
                                fieldName: 'area_code',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'assymap',
                                emptyText: '도장외부SPEC1',
                                field_id: 'reserved1',
                                fieldName: 'reserved1',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 150,
                                sqlName: 'stoqtylinesell',
                                tableName: 'itemdetail',
                                emptyText: '자재내역1',
                                field_id: 'h_reserved6',
                                fieldName: 'h_reserved6',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            break;
                        case 'SS':
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'itemdetail',
                                emptyText: 'PALLET 번호',
                                field_id: 'h_reserved43',
                                fieldName: 'h_reserved43',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'assymap',
                                emptyText: 'LOT NO',
                                field_id: 'reserved5',
                                fieldName: 'reserved5',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'project',
                                emptyText: '호선',
                                field_id: 'pj_name',
                                fieldName: 'pj_name',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'assymap',
                                emptyText: 'W/O일',
                                field_id: 'reserved2',
                                fieldName: 'reserved2',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'assymap',
                                emptyText: '납품기준일',
                                field_id: 'req_date',
                                fieldName: 'req_date',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'product',
                                emptyText: 'BLOCK',
                                field_id: 'area_code',
                                fieldName: 'area_code',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'stoqtylinesell',
                                tableName: 'itemdetail',
                                emptyText: '도장 OUT',
                                field_id: 'h_reserved84',
                                fieldName: 'h_reserved84',
                                params: {
                                    pj_type: gm.me().multi_grid_id
                                }
                            });
                            break;
                    }
                    gm.me().tabGenPanel.dockedItems.removeAt(0);
                    var searchToolbar2 = gm.me().createSearchToolbar();
                    gm.me().tabGenPanel.addDocked(searchToolbar2, 1);
                }

                this.is_loaded = true;

                store.getProxy().setExtraParam('pj_type', multi_grid_id);
                gm.me().storeLoad();

            });

            Ext.apply(this, {
                layout: 'border',
                items: [tab,  this.crudTab]
            });
        } else {
            Ext.apply(this, {
                layout: 'border',
                items: [this.grid,  this.crudTab]
            });
        }




        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
                var rec = selections[0];
                gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //stoqty_uid
                gMain.selPanel.vSELECTED_PO_NO = rec.get('po_no'); //stoqty_uid
                var stock_pos = rec.get('stock_pos'); //stoqty_uid
                var available_qty = rec.get('available_qty');
                console_logs('stock_pos', stock_pos);
                if(available_qty != null && available_qty.length > 0){
                    gMain.selPanel.assignShipmentAction.disable();
                    gMain.selPanel.discardProductAction.disable();
                    gMain.selPanel.printBarcodeAction.disable();
                }else{
                    gMain.selPanel.assignShipmentAction.enable();
                    gMain.selPanel.discardProductAction.enable();
                    gMain.selPanel.printBarcodeAction.enable();
                }

                //gMain.selPanel.printPDFAction.enable();


            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
                gMain.selPanel.vSELECTED_PO_NO = '';
                gMain.selPanel.assignShipmentAction.disable();
                gMain.selPanel.discardProductAction.enable();
                //gMain.selPanel.reReceiveAction.disable();
                //gMain.selPanel.printPDFAction.disable();
            }

        });

        //디폴트 로드

        gMain.setCenterLoading(false);
        switch(vCompanyReserved4){

            case "SHNH01KR":
            case "DDNG01KR":
                this.store.getProxy().setExtraParam('sp_code', 'PRD');
                break;
            case "DOOS01KR":
                this.store.getProxy().setExtraParam('pj_type', 'S');
                this.store.getProxy().setExtraParam('parentCode', this.link);
                break;
            case 'HSGC01KR':
                this.store.getProxy().setExtraParam('hsg_quality_flag', 'Y');
                break;
            default:
                break;
        }

        this.store.load(function(records){

        });

    },
    items : [],
    productviewType : "ALL",
    potype : 'PRD',
    records : [],
    cnt : 0,
    po_no_records : [],

    assignShipment: function() {

        var productarr =[];
        var requestqtys = [];
        var stoqtyarr= [];
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;

        for(var i=0; i< selections.length; i++) {
            var rec = selections[i];
            var uid =  rec.get('unique_id');  //Product unique_id
            var stoqty_uid = rec.get('stoqty_uid');
            var qty = rec.get('request_qty');
            var stock_qty = rec.get('stock_qty');
            if(qty > stock_qty) {
                counts++;
            }
            if(qty > 0) {
                productarr.push(uid);
                requestqtys.push(qty);
                stoqtyarr.push(stoqty_uid);
            }
        }

        if(counts > 0) {
            Ext.Msg.alert('경고', '현재 신청 가능한 수량보다 신청 수량이 더 많은 제품이 있습니다.');
        } else if(productarr.length > 0) {
            Ext.Ajax.request({
                url : CONTEXT_PATH + '/sales/productStock.do?method=assignShipment',
                params:{
                    productUids: productarr,
                    requestQtys: requestqtys,
                    stoqtyUids: stoqtyarr
                },
                success: function(val, action){
                    Ext.Msg.alert('완료', '출하 요청이 완료 되었습니다.');
                    gMain.selPanel.store.load(function(){});
                },
                failure: function(val, action){

                }
            });
        } else {
            Ext.Msg.alert('경고', '신청할 제품의 수량이 0 입니다.');
        }
    },

    discardProduct: function() {

        var form = null;

        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false ,
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
            items   : [
                {
                    xtype: 'fieldset',
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items   : [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '폐기사유',
                            combineErrors: true,
                            msgTarget : 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype     : 'textfield',
                                    id : 'description',
                                    name      : 'description',
                                    fieldLabel: '폐기사유',
                                    margin: '0 5 0 0',
                                    width: 200,
                                    allowBlank: false,
                                    maxlength: '1',
                                    emptyText: '이 곳에 폐기 사유를 써 주세요',
                                }  // end of xtype
                            ]  // end of itmes
                        }  // end of fieldcontainer
                    ]
                }
            ]

        });//Panel end...

        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;

        var productarr =[];

        for(var i=0; i< selections.length; i++) {
            var rec = selections[i];
            var uid =  rec.get('unique_id');  //Product unique_id
            var qty = rec.get('request_qty');
            var stock_qty = rec.get('stock_qty');
            if(qty > stock_qty) counts++;
            if(qty > 0) productarr.push(uid);
        }

        if(counts > 0) {
            Ext.Msg.alert('경고', '현재 폐기 가능한 수량보다 폐기 처리 수량이 더 많은 제품이 있습니다.');
        } else if(productarr.length > 0) {
            prwin = gMain.selPanel.prwinopen(form);
        } else {
            Ext.Msg.alert('경고', '폐기 처리 할 제품의 수량이 0 입니다.');
        }
    },

    prwinopen: function(form) {

        prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: '폐기 사유를 기입하십시오',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(){

                    var productarr =[];
                    var requestqtys = [];
                    var stoqtyarr= [];
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    var counts = 0;

                    for(var i=0; i< selections.length; i++) {
                        var rec = selections[i];
                        var uid =  rec.get('unique_id');  //Product unique_id
                        var stoqty_uid = rec.get('stoqty_uid');
                        var qty = rec.get('request_qty');
                        var stock_qty = rec.get('stock_qty');
                        if(qty > 0) {
                            productarr.push(uid);
                            requestqtys.push(qty);
                            stoqtyarr.push(stoqty_uid);
                        }
                    }

                    var form = gu.getCmp('formPanel').getForm();
                    var stoqtyarr =[];
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    for(var i=0; i< selections.length; i++) {
                        var rec = selections[i];
                        var uid =  rec.get('unique_id');  //STOQTY unique_id
                        stoqtyarr.push(uid);
                    }

                    form.submit({
                        url : CONTEXT_PATH + '/sales/productStock.do?method=discardProduct',
                        params:{
                            productUids: productarr,
                            requestQtys: requestqtys,
                            stoqtyUids: stoqtyarr
                        },
                        success: function(val, action){
                            prWin.close();
                            gMain.selPanel.store.load(function(){});
                        },
                        failure: function(val, action){
                            prWin.close();
                        }
                    });


                }//btn handler
            },{
                text: CMD_CANCEL,
                handler: function(){
                    if(prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },

    printBarcode: function() {

        var form = null;

        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false ,
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
            items   : [
                {
                    xtype: 'fieldset',
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items   : [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '출력매수',
                            combineErrors: true,
                            msgTarget : 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype     : 'numberfield',
                                    id : 'print_qty',
                                    name      : 'print_qty',
                                    fieldLabel: '출력매수',
                                    margin: '0 5 0 0',
                                    width: 200,
                                    allowBlank: false,
                                    value : 1,
                                    maxlength: '1',
                                }  // end of xtype
                            ]  // end of itmes
                        }  // end of fieldcontainer
                    ]
                }
            ]

        });//Panel end...

        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;

        var productarr =[];

        for(var i=0; i< selections.length; i++) {
            var rec = selections[i];
            var uid =  rec.get('unique_id');  //Product unique_id
            var qty = rec.get('request_qty');
            var stock_qty = rec.get('stock_qty');
            if(qty > stock_qty) counts++;
            /*if(qty > 0) */productarr.push(uid);
        }

        if/*(counts > 0) {
       		Ext.Msg.alert('경고', '현재 폐기 가능한 수량보다 폐기 처리 수량이 더 많은 제품이 있습니다.');
       	} else if*/(productarr.length > 0) {
            prwin = gMain.selPanel.prbarcodeopen(form);
        } /*else {
       		Ext.Msg.alert('경고', '폐기 처리 할 제품의 수량이 0 입니다.');
       	}*/
    },

    prbarcodeopen: function(form) {

        prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: '바코드 출력 매수',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(){

                    var productarr =[];
                    var requestqtys = [];
                    var stoqtyarr= [];
                    var bararr=[];
                    var barcodearr = [];
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    var counts = 0;

                    for(var i=0; i< selections.length; i++) {
                        var rec = selections[i];
                        var uid =  rec.get('unique_id');  //Product unique_id
                        var stoqty_uid = rec.get('stoqty_uid');
                        var qty = rec.get('request_qty');
                        var stock_qty = rec.get('stock_qty');
                        var barcode = rec.get('barcode');
                        var bar_spec = rec.get('pj_name') + ' ' + rec.get('area_code') + ' ' + rec.get('class_code');
                        //if(qty > 0) {
                        productarr.push(uid);
                        requestqtys.push(qty);
                        stoqtyarr.push(stoqty_uid);
                        bararr.push(bar_spec);
                        barcodearr.push(barcode);
                        //}
                    }

                    var form = gu.getCmp('formPanel').getForm();
                    var stoqtyarr =[];
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    for(var i=0; i< selections.length; i++) {
                        var rec = selections[i];
                        var uid =  rec.get('unique_id');  //STOQTY unique_id
                        stoqtyarr.push(uid);
                    }

                    form.submit({
                        url : CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeStoqty',
                        params:{
                            productUids: productarr,
                            requestQtys: requestqtys,
                            stoqtyUids: stoqtyarr,
                            barcodes: bararr
                        },
                        success: function(val, action){
                            prWin.close();
                            gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                            gMain.selPanel.store.load(function(){});
                        },
                        failure: function(val, action){
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            gMain.selPanel.store.load(function(){});
                        }
                    });


                }//btn handler
            },{
                text: CMD_CANCEL,
                handler: function(){
                    if(prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },


    groupSelect : function(id, checked) {

        var arr = id.split('_');
        var chk = checked;

        var po_no = arr[0];
        console_logs('unchk', chk);

        if(chk==true) {
            gMain.selPanel.po_no_records.push(po_no);
            for(var i=0; i<this.store.data.items.length; i++) {
                var rec = this.store.data.items[i];

                var currec = rec.get('area_code');

                if(po_no==rec.get('area_code')) {
                    gMain.selPanel.records.push(rec);
                }
            } //end for


            this.grid.getSelectionModel().select(gMain.selPanel.records);

        } else {
            //gMain.selPanel.po_no_records = Ext.Array.difference(gMain.selPanel.po_no_records, po_no);

            gMain.selPanel.po_no_records.splice(gMain.selPanel.po_no_records.indexOf(po_no),1);

            var new_arr = [];
            for(var i=0; i<this.store.data.items.length; i++) {
                var rec = this.store.data.items[i];
                if(po_no==rec.get('area_code')) {

                    new_arr.push(rec);
                }

            }


            this.grid.getSelectionModel().deselect(new_arr);

            gMain.selPanel.records = Ext.Array.difference(gMain.selPanel.records, new_arr);

            this.grid.getSelectionModel().deselect(new_arr);

            new_arr=[];

        }
    },

    editRedord: function(field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record',rec);

        switch(field) {
            case 'request_qty':
                this.updateDesinComment(rec);
                break;

        }


    },

    updateDesinComment: function(rec) {
        var request_qty = rec.get('request_qty');
        var unique_id = rec.get('id');

        this.store.each(function(record, idx) {
            if(record.get('id') == unique_id) {
                record.set('request_qty', request_qty);
            }
        });

        this.store.sync();

        /* Ext.Ajax.request({
       url: CONTEXT_PATH + '/design/bom.do?method=updateDesinComment',
       params:{
         id: unique_uid,
         req_info:req_info
       },
       success : function(result, request) {

         var result = result.responseText;
         //console_logs("", result);

       },
       failure: extjsUtil.failureMessage
     });*/
    },

    //유형별 필드 추가
    addExtraColumnBypcscode: function(myColumn, myField, tab_code) {

        var columnGroup = [];

        switch(vCompanyReserved4) {
            case 'HSGC01KR':
                if(tab_code != 'DAE') {
                    columnGroup = [ {
                        locked: false,
                        arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                    },
                        {
                            text: '수량',
                            locked: false,
                            arr: [10, 11]
                        },
                        {
                            locked: false,
                            arr: [12]
                        },
                        {
                            text: '중량',
                            locked: false,
                            arr: [13, 14]
                        },
                        {
                            locked: false,
                            arr: [15, 16]
                        },
                        {
                            locked: false,
                            arr: [23, 24, 25, 26, 27, 28]
                        }];
                } else {
                    break;
                }
                break;
            default:
        }

        this.column_group_map[tab_code] = columnGroup;
    }

});
