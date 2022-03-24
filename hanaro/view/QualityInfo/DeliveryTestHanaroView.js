//출하 관리
Ext.define('Hanaro.view.qualityInfo.DeliveryTestHanaroView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'delivery-test-view',
    selected_records: null,
    is_loaded: false,
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();

        Ext.each(myColumn, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch (dataIndex) {
                case 'request_qty':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
            }
        });

        switch (vCompanyReserved4) {
            case 'KYNL01KR':
                this.addSearchField({
                    type: 'condition',
                    width: 120,
                    sqlName: 'productlinesell',
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
                    sqlName: 'productlinesell',
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
                    sqlName: 'productlinesell',
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
                    sqlName: 'productlinesell',
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
                    sqlName: 'productlinesell',
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
                    width: 120,
                    sqlName: 'productlinesell',
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
//                this.addSearchField('area_code');
        }

        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.setDefValue('create_date', new Date());

        var next7 = gUtil.getNextday(7);
        this.setDefValue('change_date', next7);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        

        switch (vCompanyReserved4) {

            case 'SHNH01KR':
            case 'DOOS01KR':
            case 'KYNL01KR':
            case 'HSGC01KR':
                (buttonToolbar.items).each(function (item, index, length) {
                    if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                        buttonToolbar.items.remove(item);
                    }
                });
                break;
            default :

                break;
        }

        this.createStore('Hanaro.model.ProductStockHanaro', [{
            property: 'create_date',
            direction: 'DESC'
            }],
            gMain.pageSizepageSize, {
                create_date: 'create_date'
            }, {
                groupField: 'po_no'
            }
        );

        this.assignRackAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: 'Pallet 지정',
            tooltip: 'Pallet 지정',
            disabled: true,
            handler: function () {
                gm.selPanel.assignRack();
            }
        });

        // 불량입력
		this.defectInputAction = Ext.create('Ext.Action', {
			iconCls: '',
			text: '출하불량입력',
			tooltip: '출하불량 입력',
			disabled: true,
			handler: function() {
			   console_logs('treatPcsInfo---------------',gMain.selPanel.vSELECTED_PCS_CODE);
			Ext.Ajax.request({
				  url: CONTEXT_PATH + '/production/popcontroller.do?method=ProcessInput02Machine',
				  params:{
					  pcs_code: gMain.selPanel.vSELECTED_PCS_CODE,
					  lot_no: gMain.selPanel.vSELECTED_PJ_CODE
				  },
				  success : function(result, request) {
                        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                        var rec = selections[0];
                        console.log('>>>rec',rec);
                        if(rec!=null) {
                            gMain.selPanel.treatPcsInfo(rec);
                        }
                    },//end of success
				  failure: extjsUtil.failureMessage
			  });//end of ajax
			}
        });
        
        
        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4||index==5) {
                buttonToolbar.items.remove(item);
            }
    });
   

                // buttonToolbar.insert(1, '-');
                // buttonToolbar.insert(2, this.discardProductAction);
                // buttonToolbar.insert(2, this.assignShipmentAction);

                
                buttonToolbar.insert(1, this.defectInputAction);
                buttonToolbar.insert(1, '-');


        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '{name}'
        });

        var option = {
            features: [groupingFeature],
            listeners: {
                groupclick: function (view, node, group, e, eOpts) {
                    console_logs('groupclick', gMain.selPanel.po_no_records);

                    var arr = '';

                    var chk = true;


                    for (var i = 0; i < gMain.selPanel.po_no_records.length; i++) {
                        arr = gMain.selPanel.po_no_records[i];
                        console_logs('arr', arr);
                        if (arr == group) {
                            chk = false;
                            break;
                        } else {
                            chk = true;
                        }
                    }
                    ;

                    gMain.selPanel.groupSelect(group, chk);

                    view.features[0].expand(group);

                }
            },
        };

        //grid 생성.
        //this.createGrid(searchToolbar, buttonToolbar);
        this.createGridCore(arr, option);

        //입력/상세 창 생성.
        this.createCrudTab();


        this.tab_info = [];

        if (vCompanyReserved4 == 'KYNL01KR') {
            for (var i = 0; i < gUtil.mesProductCategory.length; i++) {

                var o = gUtil.mesProductCategory[i];

                this.tab_info.push({
                    code: o['code'],
                    name: o['name'],
                    title: o['name']
                });
            }

            var ti = this.tab_info;
            for (var i = 0; i < ti.length; i++) {
                var tab = ti[i];
                console_logs('this.tab', tab);
                console_logs('this.columns_map', this.columns_map);

                var tab_code = tab['code'];
                var myColumn = this.columns_map[tab_code];
                var myField = this.fields_map[tab_code];
                //유형별 필드 추가하기
                this.addExtraColumnBypcscode(myColumn, myField, tab_code);

                Ext.each(myColumn, function (columnObj, index) {
                    var dataIndex = columnObj["dataIndex"];
                    console_logs('dataIndex', dataIndex);
                    switch (dataIndex) {
                        case 'request_qty':
                            columnObj["editor"] = {};
                            columnObj["css"] = 'edit-cell';
                            columnObj["renderer"] = function (value, meta) {
                                meta.css = 'custom-column';
                                return value;
                            };
                            break;
                    }
                });

            }

            var items = [];

            var tab = this.createTabGrid('Rfx.model.ProductNewStock', items, 'big_pcs_code', arr, function (curTab, prevtab) {

                var multi_grid_id = curTab.multi_grid_id;

                gm.me().multi_grid_id = multi_grid_id;

                var store = gm.me().store_map[multi_grid_id];
                gMain.selPanel.store = store;

                store.getProxy().setExtraParams({});

                if (vCompanyReserved4 == 'KYNL01KR' && this.is_loaded) {

                    while (gm.me().searchField.length > 0) {
                        gm.me().searchField.pop();
                    }

                    switch (gm.me().multi_grid_id) {
                        case 'ST':
                        case 'SP':
                        case 'ET':
                            gm.me().addSearchField({
                                type: 'condition',
                                width: 120,
                                sqlName: 'productlinesell',
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
                                sqlName: 'productlinesell',
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
                                sqlName: 'productlinesell',
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
                                sqlName: 'productlinesell',
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
                                sqlName: 'productlinesell',
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
                                width: 120,
                                sqlName: 'productlinesell',
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
                                sqlName: 'productlinesell',
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
                                sqlName: 'productlinesell',
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
                                sqlName: 'productlinesell',
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
                                sqlName: 'productlinesell',
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
                                sqlName: 'productlinesell',
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
                                sqlName: 'productlinesell',
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
                store.getProxy().setExtraParam('stock_pos', null);
                store.getProxy().setExtraParam('pj_type', multi_grid_id);
                store.getProxy().setExtraParam('ky_quality_flag', 'Y');
                gm.me().storeLoad();
            });

            Ext.apply(this, {
                layout: 'border',
                items: [tab, this.crudTab]
            });
        } else {
            Ext.apply(this, {
                layout: 'border',
                items: [this.grid, this.crudTab]
            });
        }
        this.callParent(arguments);
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length>0) {
                var rec = selections[0];
                selected_records = selections;
                gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //stoqty_uid
                gMain.selPanel.vSELECTED_PO_NO = rec.get('po_no'); //stoqty_uid
                
                gMain.selPanel.defectInputAction.enable();
                
            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
                gMain.selPanel.vSELECTED_PO_NO = '';

                gMain.selPanel.defectInputAction.disable();

            }

        });
        //디폴트 로드
        gMain.setCenterLoading(false);
        switch (vCompanyReserved4) {
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
            case 'KYNL01KR':
                this.store.getProxy().setExtraParam('stock_pos', null);
                this.store.getProxy().setExtraParam('ky_quality_flag', 'Y');
                break;
            default:
                break;
        }
        if (vCompanyReserved4 != 'KYNL01KR') {
            this.storeLoad();
        }
    },
    items: [],
    productviewType: "ALL",
    potype: 'PRD',
    records: [],
    cnt: 0,
    po_no_records: [],

    assignShipment: function () {

        var productarr = [];
        var requestqtys = [];
        var stoqtyarr = [];
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        var counts = 0;
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('product_uid');  //Product unique_id
            var stoqty_uid = rec.get('unique_id_long');
            var qty = rec.get('request_qty');
            var stock_qty = rec.get('stock_qty');
            if (qty > stock_qty) {
                counts++;
            }
            if (qty > 0) {
                productarr.push(uid);
                requestqtys.push(qty);
                stoqtyarr.push(stoqty_uid);
            }
        }
        if (counts > 0) {
            Ext.Msg.alert('경고', '현재 신청 가능한 수량보다 신청 수량이 더 많은 제품이 있습니다.');
        } else if (productarr.length > 0) {
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales/productStock.do?method=assignShipment',
                params: {
                    productUids: productarr,
                    requestQtys: requestqtys,
                    stoqtyUids: stoqtyarr
                },
                success: function (val, action) {
                    Ext.Msg.alert('완료', '출하 요청이 완료 되었습니다.');

                    gMain.selPanel.store.load(function () {
                    });

                },
                failure: function (val, action) {

                }
            });
        } else {
            Ext.Msg.alert('경고', '신청할 제품의 수량이 0 입니다.');
        }
    },

    discardProduct: function () {

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel_discard'),
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
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '폐기사유',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    id: 'discard_reason',
                                    name: 'discard_reason',
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

        switch (vCompanyReserved4) {
            case 'KYNL01KR':
                selections = selected_records;
                break;
            default:
                break;
        }

        var counts = 0;
        var productarr = [];
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');  //Product unique_id
            var qty = rec.get('request_qty');
            var stock_qty = rec.get('stock_qty');
            if (qty > stock_qty) counts++;
            if (qty > 0) productarr.push(uid);
        }

        if (counts > 0) {
            Ext.Msg.alert('경고', '현재 폐기 가능한 수량보다 폐기 처리 수량이 더 많은 제품이 있습니다.');
        } else if (productarr.length > 0) {
            prwin = gMain.selPanel.prwinopen(form);
        } else {
            Ext.Msg.alert('경고', '폐기 처리 할 제품의 수량이 0 입니다.');
        }
    },

    prwinopen: function (form) {

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '폐기 사유를 기입하십시오',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var productarr = [];
                    var requestqtys = [];
                    var stoqtyarr = [];
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    var counts = 0;

                    switch (vCompanyReserved4) {
                        case 'KYNL01KR':
                            selections = selected_records;
                            break;
                        default:
                            break;
                    }

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('unique_id');  //Product unique_id
                        var stoqty_uid = rec.get('stoqty_uid');
                        var qty = rec.get('request_qty');
                        var stock_qty = rec.get('stock_qty');
                        if (qty > 0) {
                            productarr.push(uid);
                            requestqtys.push(qty);
                            stoqtyarr.push(stoqty_uid);
                        }
                    }

                    var form = gu.getCmp('formPanel_discard').getForm();
                    var stoqtyarr = [];
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                    switch (vCompanyReserved4) {
                        case 'KYNL01KR':
                            selections = selected_records;
                            break;
                        default:
                            break;
                    }

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('unique_id');  //STOQTY unique_id
                        stoqtyarr.push(uid);
                    }

                    var val = form.getValues(false);


                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=discardProduct',
                        params: {
                            discard_reason: val['discard_reason'],
                            productUids: productarr,
                            requestQtys: requestqtys,
                            stoqtyUids: stoqtyarr
                        },
                        success: function (val, action) {
                            prWin.close();
                            gm.me().storeLoad();
                        },
                        failure: function (val, action) {
                            prWin.close();
                        }
                    });


                }//btn handler
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

    printBarcode: function () {

        var form = null;
        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel_print'),
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
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '출력매수',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    id: 'print_qty',
                                    name: 'print_qty',
                                    fieldLabel: '출력매수',
                                    margin: '0 5 0 0',
                                    width: 200,
                                    allowBlank: false,
                                    value: 1,
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

        var productarr = [];

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var uid = rec.get('unique_id');  //Product unique_id
            var qty = rec.get('request_qty');
            var stock_qty = rec.get('stock_qty');
            if (qty > stock_qty) counts++;
            /*if(qty > 0) */
            productarr.push(uid);
        }

        if/*(counts > 0) {
       		Ext.Msg.alert('경고', '현재 폐기 가능한 수량보다 폐기 처리 수량이 더 많은 제품이 있습니다.');
       	} else if*/(productarr.length > 0) {
            prwin = gMain.selPanel.prbarcodeopen(form);
        }
        /*else {
                      Ext.Msg.alert('경고', '폐기 처리 할 제품의 수량이 0 입니다.');
                  }*/
    },

    prbarcodeopen: function (form) {

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 출력 매수',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var productarr = [];
                    var requestqtys = [];
                    var stoqtyarr = [];
                    var bararr = [];
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    var counts = 0;

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('unique_id');  //Product unique_id
                        var stoqty_uid = rec.get('stoqty_uid');
                        var qty = rec.get('request_qty');
                        var stock_qty = rec.get('stock_qty');
                        var bar_spec = rec.get('pj_name') + ' ' + rec.get('area_code') + ' ' + rec.get('class_code');
                        //if(qty > 0) {
                        productarr.push(uid);
                        requestqtys.push(qty);
                        stoqtyarr.push(stoqty_uid);
                        bararr.push(bar_spec);
                        //}
                    }

                    var form = gu.getCmp('formPanel_print').getForm();
                    var stoqtyarr = [];
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('unique_id');  //STOQTY unique_id
                        stoqtyarr.push(uid);
                    }

                    form.submit({
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcode',
                        params: {
                            productUids: productarr,
                            requestQtys: requestqtys,
                            stoqtyUids: stoqtyarr,
                            barcodes: bararr,
                        },
                        success: function (val, action) {
                            prWin.close();
                            gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                            gMain.selPanel.store.load(function () {
                            });
                        },
                        failure: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            gMain.selPanel.store.load(function () {
                            });
                        }
                    });


                }//btn handler
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


    groupSelect: function (id, checked) {

        var arr = id.split('_');
        var chk = checked;

        var po_no = arr[0];
        console_logs('unchk', chk);

        if (chk == true) {
            gMain.selPanel.po_no_records.push(po_no);
            for (var i = 0; i < this.store.data.items.length; i++) {
                var rec = this.store.data.items[i];

                var currec = rec.get('area_code');

                if (po_no == rec.get('area_code')) {
                    gMain.selPanel.records.push(rec);
                }
            } //end for


            this.grid.getSelectionModel().select(gMain.selPanel.records);

        } else {
            //gMain.selPanel.po_no_records = Ext.Array.difference(gMain.selPanel.po_no_records, po_no);

            gMain.selPanel.po_no_records.splice(gMain.selPanel.po_no_records.indexOf(po_no), 1);

            var new_arr = [];
            for (var i = 0; i < this.store.data.items.length; i++) {
                var rec = this.store.data.items[i];
                if (po_no == rec.get('area_code')) {
                    new_arr.push(rec);
                }
            }
            this.grid.getSelectionModel().deselect(new_arr);

            gMain.selPanel.records = Ext.Array.difference(gMain.selPanel.records, new_arr);

            this.grid.getSelectionModel().deselect(new_arr);

            new_arr = [];

        }
    },

    editRedord: function (field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);
        switch (field) {
            case 'request_qty':
                this.updateDesinComment(rec);
                break;
        }
    },

    updateDesinComment: function (rec) {
        var request_qty = rec.get('request_qty');
        var unique_id = rec.get('id');

        this.store.each(function (record, idx) {
            if (record.get('id') == unique_id) {
                record.set('request_qty', request_qty);
            }
        });
        this.store.sync();
    },

    assignRack: function () {
        var form = null;

        form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel_assign'),
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
                    title: '수량',
                    collapsible: true,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'PALLET 명',
                            combineErrors: true,
                            msgTarget: 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    id: gu.id('stock_pos'),
                                    name: 'stock_pos',
                                    fieldLabel: 'PALLET 명',
                                    margin: '0 5 0 0',
                                    width: 180,
                                    allowBlank: false,
                                    maxlength: '1',
                                    emptyText: '영문대소문자와 숫자만 입력',
                                    validator: function (v) {
                                        if (/[^a-zA-Z0-9_-]/g.test(v)) {
                                            v = v.replace(/[^a-zA-Z0-9_-]/g, '');
                                        }
                                        this.setValue(v);
                                        return true;
                                    }  // end of validator
                                },
                                {
                                    xtype: 'button',
                                    style: 'margin-left: 3px;',
                                    width: 80,
                                    text: '중복' + CMD_CONFIRM,
                                    //style : "width : 50px;",
                                    handler: function () {
                                        var stock_pos = gu.getCmp('stock_pos').getValue();
                                        console_logs('stock_pos >>>>>', gu.getCmp('stock_pos'));
                                        if (stock_pos == null || stock_pos.length == 0) {
                                            gm.me().setCheckname(false);
                                        } else {
                                            //중복 코드 체크
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/index/stockRack.do?method=checkPalletName',
                                                params: {
                                                    stock_pos: stock_pos
                                                },

                                                success: function (result, request) {
                                                    var resultText = result.responseText;
                                                    if (resultText == '0') {
                                                        gm.me().setCheckname(true);
                                                        Ext.MessageBox.alert('정상', '사용가능합니다.');
                                                        //alert('사용가능합니다.');
                                                    } else {
                                                        gm.me().setCheckname(false);
                                                        Ext.MessageBox.alert('사용불가', '이미 사용중인 팔레트 번호입니다.');
                                                        //alert('코드를 확인하세요.');
                                                    }

                                                    console_log('resultText', gMain.selPanel.checkname);

                                                },//Ajax success
                                                failure: extjsUtil.failureMessage
                                            });

                                        }

                                    }//endofhandler
                                }

                                // end of xtype
                            ]  // end of itmes
                        }  // end of fieldcontainer
                    ]
                }
            ]

        });//Panel end...

        prwin = gMain.selPanel.prwinopen2(form);

    },

    prwinopen2: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: 'Pallet 지정',
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                id: gu.id('prwinopen-OK-button'),
                disabled: true,
                handler: function () {
                    var form = gu.getCmp('formPanel_assign').getForm();
                    var productarr = [];
                    var requestqtys = [];
                    var stoqtyarr = [];
                    var mass = 0.0;
                    var selections = selected_records;
                    var counts = 0;

                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];
                        var uid = rec.get('unique_id');  //Product unique_id
                        var stoqty_uid = rec.get('stoqty_uid');
                        var qty = rec.get('request_qty');
                        var stock_qty = rec.get('stock_qty');
                        mass += rec.get('mass');
                        if (qty > stock_qty) {
                            counts++;
                        }
                        if (qty > 0) {
                            productarr.push(uid);
                            requestqtys.push(qty);
                            stoqtyarr.push(stoqty_uid);
                        }
                    }

                    if (counts > 0) {
                        Ext.Msg.alert('경고', '현재 가능한 수량보다 신청 수량이 더 많은 제품이 있습니다.');
                    } else if (productarr.length > 0) {
                        var myWin = prWin;
                        myWin.setLoading(true);

                        form.submit({
                            url: CONTEXT_PATH + '/sales/productStock.do?method=assignShipment',
                            params: {
                                productUids: productarr,
                                requestQtys: requestqtys,
                                stoqtyUids: stoqtyarr,
                                mass: mass,
                            },
                            success: function (val, action) {
                                Ext.Msg.alert('완료', 'Pallet에 담았습니다.');
                                myWin.setLoading(false);
                                myWin.close();
                                gMain.selPanel.store.load(function () {
                                });
                            },
                            failure: function (val, action) {

                            }
                        });
                    } else {
                        Ext.Msg.alert('경고', 'Pallet에 담을 제품의 수량이 0 입니다.');
                    }

                }//btn handler
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
    //유형별 필드 추가
    addExtraColumnBypcscode: function (myColumn, myField, tab_code) {

        var columnGroup = [];

        switch (vCompanyReserved4) {
            case 'HSGC01KR':
                if (tab_code != 'DAE') {
                    columnGroup = [{
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
    },

    setCheckname: function (b) {
        this.checkname = b;

        var btn = gu.getCmp('prwinopen-OK-button');
        if (b == true) {
            btn.enable();
        } else {
            btn.disable();
        }

    },
    returnValue: function(o){
        item_code = o[0];
        item_name = o[1];
        specification = o[2];
		wa_name = o[3];
		bm_quan = o[4];
	},
	treatPcsInfo: function(rec) {
    	var form = null;
	    form = Ext.create('Ext.form.Panel', {
	    	id: gu.id('formPanel_defect'),
	    	xtype: 'form',
	    	//xtype: 'form-multicolumn',
	    	frame: true ,
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
	            title: '출하제품 정보',
	            boder: true,
	            collapsible: true,
	            margin: '5',
	            //fieldStyle: 'width:100%;',
	            width: '100%',
	            defaults: {
	            	anchor: '100%',
	                labelWidth: 10,
	                useThousandSeparator: false
	            },
                 items :[{
                	 xtype : 'fieldcontainer',
					 combineErrors: true,
					 //msgTarget: 'side',
					 layout: 'hbox',
					 defaults: {
					  	 labelWidth: 50,
					 },
					 items: [{
						 items: [{
                            xtype:'textfield',
                            name: 'unique_id',
                            fieldLabel: '재고바코드',
                            fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
                            value: rec.get('unique_id'),
                            readOnly: true,
                            width: 270
                         },{
                            xtype:'textfield',
                            name: 'product_uid',
                            fieldLabel: '제품바코드',
                            fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
                            value: rec.get('product_uid'),
                            readOnly: true,
                            width: 270
                         },{
                             xtype:'textfield',
                             name: 'item_code',
						     fieldLabel: '품목코드',
						     fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
						     value: rec.get('item_code'),
						     readOnly: true,
						     width: 270
						  },{
								xtype:'textfield',
								fieldLabel: '품명',
								anchor: '100%',
								fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
								value: rec.get('item_name'),
								readOnly: true,
								width: 270
							},
							{
                                xtype:'textfield',
                                name: 'wh_qty',
								fieldLabel: '재고 수량',
								anchor: '100%',
								fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
								value: rec.get('wh_qty'),
								readOnly: true,
								width: 270
							}]
					},{
						items: [{
							xtype:'textfield',
							fieldLabel: '규격',
							anchor: '100%',
							fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
							value: rec.get('specification'),
							readOnly: true,
							width: 400
						},{
							xtype:'textfield',
						    fieldLabel: '발주업체',
						    anchor: '100%',
						    fieldStyle: 'background-color: #F0F0F0; background-image: none; ',
						    name: 'wa_name',
						    value: rec.get('wa_name'),
						    readOnly: true,
						    width: 400
						}]
					}]
                 }]
                },{
                    items:[{
                        xtype: 'fieldset',
                        title: '불량 입력',
                        margin: '5',
                        width: '100%',
                        //height : 250,
                        collapsible: true,
                        defaults: {
                            anchor: '100%',
                            style: 'width: 50%',
                            labelWidth: 10,
                            useThousandSeparator: false
                        },
                        layout: 'vbox',
                        items : [{
                            xtype : 'fieldcontainer',
                            layout: 'hbox',
                            items :[{
                                    xtype: 'combo',
                                    id : gu.id('defect_code1'),
                                    name : 'defect_code1',
                                    margin : '5 5 0 15',
                                    emptyText : '불량원인',
                                    allowBlank: false, 
                                    //anchor: '40%',
                                    width: 250,
                                    mode: 'local',
                                    //value: 'supplier_name',
                                    store: Ext.create('Mplm.store.DefectiveCodeStore', {role_code: gMain.selPanel.vSELECTED_PCS_CODE}),
                                    displayField:   'code_name_kr',
                                    valueField: 'system_code',
                                    sortInfo: { field: 'code_name_kr', direction: 'DESC' },
                                    typeAhead: false,
                                    //hideLabel: true,
                                    minChars: 1,
                                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                    listConfig:{
                                        loadingText: '검색중...',
                                        emptyText: '일치하는 항목 없음.',
                                          getInnerTpl: function(){
                                              return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                                          }
                                    },
                                    listeners: {
                                           select: function (combo, record) {
                                               
                                           }
                                      }
                                },{
                                    xtype: 'numberfield',
                                    id : gu.id('qty1'),
                                    name : 'qty1',
                                    margin : '5 0 0 0',
                                    emptyText : '수량',
                                    allowBlank: false, 
                                    minValue: 1,
                                    maxValue: rec.get('wh_qty'),
                                    value: 1,
                                    width: 100,
                                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                    listeners: {
                                          change: function(field, value) {
                                              gMain.selPanel.sumDefectQty();
                                          }
                                      }
                            }]
                        }]
                    }]	
                    }] // items
                });//Panel end...
	    myHeight = 400;
	    myWidth = 720;
	    prwin = this.prwinopen_defect(form);
    },
	prwinopen_defect: function(form) {
    	prWin =	Ext.create('Ext.Window', {
		modal : true,
        title: '츨하불량입력',
        width: myWidth,
        height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
        	handler: function(btn){
				if(form.isValid()) {
					var msg = '츨하불량입력를 입력하시겠습니까?'
					var myTitle = '츨하불량입력';
					Ext.MessageBox.show({
						title: myTitle,
						msg: msg,
						buttons: Ext.MessageBox.YESNO,
						icon: Ext.MessageBox.QUESTION,
						fn: function(btn) {
							var form = gu.getCmp('formPanel_defect').getForm();
							if(btn == "no"){
								MessageBox.close();
							}else{
							if(form.isValid()){	
							var val = form.getValues(false);
							console_logs('formPanel_defect val', val);
							Ext.Ajax.request({
								url: CONTEXT_PATH + '/sales/productStock.do?method=discardProductDefect',
								params:{
									product_uid : val.product_uid, // uid_srcahd
                                    stoqty_uid : val.unique_id, //stoqty_uid
                                    item_code : val.item_code,
                                    originQty : val.wh_qty,
									defectQty : gMain.selPanel.sumDefectQty(),
									defectCode : gMain.selPanel.sumDefectDetail(),
								},
								success : function(result, request) {
									if(prWin) {
										prWin.close();
									}
									gMain.selPanel.store.load();
								},
								failure: extjsUtil.failureMessage
							});	
							}  // end of formvalid 
						}
					   }//fn function(btn)
					});//show	
				} //endof form valid
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
    sumDefectQty : function(){
        var q1 = gu.getCmp('qty1').getValue();
		var sum = q1;
		return sum;
	},
    selMode: 'SINGLE',
    sumDefectDetail : function() {
        var defect_detail = '';
        var defect_code1 = gu.getCmp('defect_code1').getValue();
        var q1 = gu.getCmp('qty1').getValue();
        if(q1==undefined || q1==null) {
            q1=0;
        } else{
            defect_detail = defect_code1;
        }
        return defect_detail;
    }
});
