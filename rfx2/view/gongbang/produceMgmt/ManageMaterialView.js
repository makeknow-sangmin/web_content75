Ext.define('Rfx2.view.gongbang.produceMgmt.ManageMaterialView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'manage-material-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.setDefValue('create_date', new Date());
        var next7 = gUtil.getNextday(7);
        this.setDefValue('change_date', next7);

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || /*index == 2  ||*/ index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        // this.createStoreSimple({
        // 	modelClass: 'Rfx2.model.company.hanaro.ProductMaterialHanaro',
        // 	pageSize: 100,
        // 	sorters: [{
        // 		property: 'item_code',
        // 		direction: 'asc'
        // 	}],
        // 	byReplacer: {

        // 	},
        // 	deleteClass: ['product']

        // }, {
        // 	//groupField: 'parent_code'
        // });

        this.createStore('Rfx2.model.company.mjcm.ProductMgmtAssy', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );

        // this.store.getProxy().setExtraParam('standard_flag', 'R');


        this.doProduceAction = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '생산작업지시',
            tooltip: '생산작업지시',
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            disabled: true,
            //pressed: true,
            handler: function () {
                gm.me().registPj();
            }
        });


        buttonToolbar.insert(2, '-');
        buttonToolbar.insert(3, this.doProduceAction);

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        Ext.each(this.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            switch (dataIndex) {
                case 'ship_req_qty':
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
            }
        });


        // 안전재고수량 보다 출하가능수량이 적으면 표시
        this.rowClassFc = function (record, index) {
            var ship_avail_qty = record.get('ship_avail_qty');
            stock_qty_safe = record.get('stock_qty_safe');

            if (ship_avail_qty == null || ship_avail_qty == undefined) {
                ship_avail_qty = 0;
            }
            if (stock_qty_safe == null || stock_qty_safe == undefined) {
                stock_qty_safe = 0;
            }

            if (ship_avail_qty < stock_qty_safe) {
                return 'red-row';
            }
        }

        //grid 생성.
        //this.createGrid(searchToolbar, buttonToolbar);
        this.createGrid(arr);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {
            if (selections.length) {
                gm.me().doProduceAction.enable();

                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                if (rec == null) {
                    return;
                }
                var stock_quan = rec.get('stock_qty');
                var product_uid = rec.get('unique_id_long');

            } else {
                gm.me().doProduceAction.disable();
            }

        });

        //디폴트 로드

        gMain.setCenterLoading(false);

        this.store.load();

    },

    registPj: function () {
        var selection = gm.me().grid.getSelectionModel().getSelection()[0];
        var pj_code = new Date();
        pj_code = Ext.Date.format(pj_code, 'YmdHis');

        var srcahd_uid = selection.get('unique_id_long');
        var pj_uid = selection.get('pj_uid');
        var sales_price = selection.get('sales_price');
        var assymap_uid = selection.get('unique_uid');

        var itemsInner = [
            new Ext.form.Hidden({
                name: 'pj_type',
                value: 'P'
            }),
            new Ext.form.Hidden({
                name: 'pj_code',
                value: pj_code
            }),
            new Ext.form.Hidden({
                name: 'pj_uid',
                value: pj_uid
            }),
            new Ext.form.Hidden({
                name: 'assymap_uid',
                value: assymap_uid
            }),
            new Ext.form.Hidden({
                name: 'srcahd_uid',
                value: srcahd_uid
            }),
            new Ext.form.Hidden({
                name: 'order_com_unique',
                value: vCOMAST_UID
            }),
            new Ext.form.Hidden({
                name: 'big_pcs_code',
                value: 'FN'
            })];
        itemsInner.push({
            xtype: 'fieldcontainer',
            fieldLabel: '작업지시 번호',
            combineErrors: true,
            msgTarget: 'side',
            width: '100%',
            layout: 'hbox',
            defaults: {
                flex: 1,
                hideLabel: true,
            },
            items: [
                {
                    xtype: 'textfield',
                    id: gu.id('lot_no'),
                    name: 'lot_no',
                    fieldLabel: 'LOT 명',
                    margin: '0 5 0 0',
                    width: 360,
                    allowBlank: true,
                    value: gm.me().lotname,
                    fieldStyle: 'text-transform:uppercase',
                    emptyText: '영문 대문자 및 숫자',
                    validator: function (v) {
                        gm.me().setCheckname(false);
                        if (/[^a-zA-Z0-9_-]/g.test(v)) {
                            v = v.replace(/[^a-zA-Z0-9_-]/g, '');
                        }
                        this.setValue(v.toUpperCase());
                        return true;
                    }
                },
                {
                    xtype: 'button',
                    style: 'margin-left: 3px;',
                    flex: 1,
                    text: '중복' + CMD_CONFIRM,
                    //style : "width : 50px;",
                    handler: function () {

                        var lot_no = gu.getCmp('lot_no').getValue();
                        console_logs('lot_no', lot_no);
                        if (lot_no == null || lot_no.length == 0) {
                            gm.me().setCheckname(false);
                        } else {
                            //중복 코드 체크
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/index/process.do?method=checkName',
                                params: {
                                    po_no: lot_no
                                },

                                success: function (result, request) {
                                    var resultText = result.responseText;

                                    if (resultText == '0') {
                                        gm.me().setCheckname(true);
                                        Ext.MessageBox.alert('정상', '사용가능합니다.');

                                    } else {
                                        gm.me().setCheckname(false);
                                        Ext.MessageBox.alert('사용불가', '이미 사용중인 코드입니다.');
                                    }


                                },//Ajax success
                                failure: extjsUtil.failureMessage
                            });

                        }

                    }//endofhandler
                }
            ]
        });
        itemsInner.push({
            fieldLabel: '생산납기',
            xtype: 'datefield',
            id: 'req_date',
            name: 'req_date',
            format: 'Y-m-d',
            submitFormat: 'Y-m-d',
            dateFormat: 'Y-m-d',
            width: '100%',
            anchor: '100%'
        });
        itemsInner.push({
            fieldLabel: '생산수량',
            xtype: 'numberfield',
            width: '100%',
            id: 'quan',
            name: 'quan',
            value: 1,
            minValue: 1,
            listeners: {
                change: function (combo, value) {
                    var sales_price = Ext.getCmp('sales_price').getValue();
                    Ext.getCmp('selling_price').setValue(value * sales_price);
                }
            }
        });
        itemsInner.push({
            fieldLabel: '수주금액',
            xtype: 'numberfield',
            width: '100%',
            id: 'selling_price',
            name: 'selling_price',
            hidden: true,
            value: 0
        });
        itemsInner.push({
                fieldLabel: '수주단가',
                xtype: 'numberfield',
                width: '100%',
                id: 'sales_price',
                name: 'sales_price',
                hidden: true,
                value: sales_price,
                listeners: {
                    change: function (combo, value) {
                        var quan = Ext.getCmp('quan').getValue();
                        Ext.getCmp('selling_price').setValue(value * quan);
                    }
                }
            }
        );

        if (vCompanyReserved4 == 'KSCM01KR') {
            itemsInner.push({
                xtype: 'numberfield',
                name: 'reserved_double5',
                fieldLabel: '금형벌수',
                value: 1,
                width: '100%'
            });
        } else if (vCompanyReserved4 == 'MJCM01KR') {
            itemsInner.push({
                xtype: 'numberfield',
                name: 'reserved_double5',
                fieldLabel: '단위포장수량',
                value: 1,
                width: '100%'
            });
        } else {
            itemsInner.push({
                xtype: 'textarea',
                name: 'reserved_varchark',
                rows: 5,
                fieldLabel: '설명',
                width: '100%'
            });
        }


        var formItems = [
            {
                xtype: 'fieldset',
                title: '생산정보',
                collapsible: false,
                width: '100%',
                style: 'padding:10px',
                default: {
                    width: '100%',
                    layout: {
                        type: 'hbox'
                    }
                },
                items: itemsInner
            },
            {
                xtype: 'fieldset',
                title: '제품정보',
                collapsible: false,
                width: '100%',
                style: 'padding:10px',
                default: {
                    width: '100%',
                    layout: {
                        type: 'hbox'
                    }
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: MSG_BUYER,
                        value: selection.get('wa_name'),
                        height: 30,
                        width: '100%',
                        editable: false,
                        hidden: true,
                        fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '품명',
                        value: selection.get('item_name'),
                        height: 30,
                        width: '100%',
                        editable: false,
                        fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '규격',
                        value: selection.get('specification'),
                        height: 30,
                        width: '100%',
                        editable: false,
                        fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '재고수량',
                        value: selection.get('stock_qty'),
                        height: 30,
                        width: '100%',
                        editable: false,
                        fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
                    }, {
                        fieldLabel: '기존단가',
                        xtype: 'textfield',
                        width: '100%',
                        id: 'pre_sales_price',
                        name: 'pre_sales_price',
                        editable: false,
                        hidden: true,
                        fieldStyle: 'background-color: #FBF8E6;  background-image: none; ',
                        value: sales_price
                    }
                ]
            }
        ]

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formRegistPj'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            bodyPadding: 10,
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 100,
                margins: 10,
            },
            items: formItems
        });

        var items = [form];

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '생산작업지시',
            width: 600,
            height: 500,
            plain: true,
            items: items,
            buttons: [
                {
                    text: CMD_OK,
                    id: gu.id('prwinopen-OK-button'),
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                console_logs('>>>>>Val', val);

                                Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/sales/productStock.do?method=stockHanaroProjectRegist',
                                    params: val,
                                    success: function (result, request) {
                                        gm.me().store.load();
                                        if (prWin) {
                                            prWin.close();
                                        }
                                        Ext.Msg.alert('안내', '등록하였습니다.', function () {
                                        });
                                    },
                                    failure: extjsUtil.failureMessage
                                });

                            }
                        }
                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function (btn) {
                        prWin.close();
                    }
                }
            ]
        });
        prWin.show();
    },

    produceRequest: function () {
        var selection = gm.me().grid.getSelectionModel().getSelection()[0];

        var formItems = [
            {
                xtype: 'fieldset',
                title: '요청정보',
                collapsible: false,
                width: '100%',
                style: 'padding:10px',
                default: {
                    width: '100%',
                    layout: {
                        type: 'hbox'
                    }
                },
                items: [
                    {
                        fieldLabel: '생산요청 수량',
                        xtype: 'numberfield',
                        id: 'prd_req_qty',
                        name: 'prd_req_qty',
                        value: 0,
                        minValue: 1
                    }
                ]
            }, {
                xtype: 'fieldset',
                title: '재고정보',
                collapsible: false,
                width: '100%',
                style: 'padding:10px',
                default: {
                    width: '100%',
                    layout: {
                        type: 'hbox'
                    }
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: MSG_BUYER,
                        value: selection.get('wa_name'),
                        height: 30,
                        width: '100%',
                        editable: false,
                        fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '품명',
                        value: selection.get('item_name'),
                        height: 30,
                        width: '100%',
                        editable: false,
                        fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '규격',
                        value: selection.get('specification'),
                        height: 30,
                        width: '100%',
                        editable: false,
                        fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
                    },
                    {
                        fieldLabel: '재고 수량',
                        xtype: 'textfield',
                        id: 'stock_qty',
                        name: 'stock_qty',
                        value: selection.get('stock_qty'),
                        editable: false,
                        height: 30,
                        width: '100%',
                        fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
                    }, {
                        fieldLabel: '생산중 수량',
                        xtype: 'textfield',
                        id: 'produce_qty',
                        name: 'produce_qty',
                        value: selection.get('produce_qty'),
                        editable: false,
                        height: 30,
                        width: '100%',
                        fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
                    }, {
                        fieldLabel: '출하가능 수량',
                        xtype: 'textfield',
                        id: 'ship_avail_qty',
                        name: 'ship_avail_qty',
                        value: selection.get('ship_avail_qty'),
                        editable: false,
                        height: 30,
                        width: '100%',
                        fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
                    }
                ]
            }
        ]

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formRegistPrd'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            bodyPadding: 10,
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: formItems
        });

        var items = [form];

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '생산요청',
            width: 700,
            height: 600,
            plain: true,
            items: items,
            buttons: [
                {
                    text: CMD_OK,
                    id: 'prdBtn',
                    handler: function (btn) {
                        if (btn == 'no') {
                            prWin.close();
                        } else {
                            if (form.isValid()) {
                                var val = form.getValues(false);
                                var selection = gm.me().grid.getSelectionModel().getSelection()[0];
                                var assymapUid = selection.get('assymap_uid');
                                var ac_uid = selection.get('pj_uid');
                                var pj_code = new Date();
                                pj_code = Ext.Date.format(pj_code, 'YmdHis');

                                form.submit({
                                    url: CONTEXT_PATH + '/index/process.do?method=addRequestStock',
                                    params: {
                                        assymapUid: assymapUid,
                                        ac_uid: ac_uid,
                                        pj_code: pj_code
                                    },
                                    success: function (result, request) {
                                        gMain.selPanel.store.load();
                                        if (prWin) {
                                            prWin.close();
                                        }
                                        Ext.Msg.alert('안내', '요청하였습니다.', function () {
                                        });

                                    },// endofsuccess
                                    failure: extjsUtil.failureMessage
                                });

                                // Ext.Ajax.request({
                                // 	url: CONTEXT_PATH + '/index/process.do?method=addRequest',
                                // 	params:{
                                // 		assymapUid: assymapUid,
                                // 		ac_uid: ac_uid
                                // 	},
                                // 	success : function(result, request) {
                                // 		gMain.selPanel.store.load();
                                // 		Ext.Msg.alert('안내', '요청하였습니다.', function() {});

                                // 	},// endofsuccess
                                // 	failure: extjsUtil.failureMessage
                                // });// endofajax
                            }
                        }
                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function (btn) {
                        prWin.close();
                    }
                }
            ]
        });
        prWin.show();
    },

    shipmentRequest: function (pj_rec) {
        // console_logs('>>>> rec', rec);

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        var task_title = rec.get('wa_name');
        var reminder = rec.get('pj_name');
        var description = rec.get('pj_description');
        var delivery_info = rec.get('address_1');
        var not_dl_qty = rec.get('not_dl_qty');
        var delivery_plan = Ext.Date.add(new Date(), Ext.Date.DAY, 14);
        console_logs('>>> delivery_plan', delivery_plan);
        var noti_flag = rec.get('noti_flag');
        var IsAllDay = rec.get('is_all_day');
        var ship_avail_qty = rec.get('ship_avail_qty');

        var stock = rec.get('stock_qty');
        console_logs('>>>> pj_rec', pj_rec);
        var quans = stock;
        var pj_quans = 0;
        for (var i = 0; i < pj_rec.length; i++) {
            var r = pj_rec[i];
            quans += r.get('req_quan') * 1;
            pj_quans += r.get('req_quan') * 1;
        }

        //포장단위
        var unit_code = rec.get('unit_code');//포장단위 BOX/VENDING
        console_logs('unit_code@@@@', unit_code);
        if (unit_code == 'UNIT_PC') {
            unit_code = 'BOX';
//					var reserved_number4 = rec.get('reserved_number4');//포장수량
//					var reserved6 = rec.get('reserved6');//품명
//					var reserved7 = rec.get('reserved7');//가로
//					var reserved8 = rec.get('reserved8');//세로
//					var reserved9 = rec.get('reserved9');//높이
//					var reserved10 = rec.get('reserved10');//적재패턴
//					var reserved11 = rec.get('reserved11');//비고
            //카톤박스
            var reserved_number4 = rec.get('reserved15');//포장수량
            var reserved6 = rec.get('reserved6');//품명
            var reserved2 = rec.get('reserved7');//가로
            var reserved3 = rec.get('reserved8');//세로
            var reserved4 = rec.get('reserved9');//높이
            var reserved10 = rec.get('reserved10');//적재패턴
            var reserved11 = rec.get('reserved11');//비고

        } else {//UNIT_SET
            unit_code = 'VENDING';
            //팔레트
//					var reserved_double5 = rec.get('reserved14');//적재수량
            var reserved_number4 = rec.get('reserved14');//적재수량
            var reserved1 = rec.get('reserved1');//유형
            var reserved2 = rec.get('reserved2');//가로
            var reserved3 = rec.get('reserved3');//세로
            var reserved4 = rec.get('reserved4');//높이
            var reserved5 = rec.get('reserved5');//무게

        }

        console_logs('not_dl_qty', not_dl_qty);
        console_logs('reserved2', reserved2);
        var ea = 0;
        if (reserved_number4 > 0) {
            ea = Math.ceil((Number(not_dl_qty) / Number(reserved_number4))); //.toFixed(0);
        }

        var prd_vol = Number(ea * reserved2 * reserved3 * reserved4);

        var form = Ext.create('Ext.form.Panel', {
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            region: 'center',
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 80
            },
            items: [
                {
                    xtype: 'component',
                    //									html: msg,
                    anchor: '100%'
                }, {
                    xtype: 'combo',
                    fieldLabel: '고객사<br>(본사/지사)',
                    id: 'task_title',
                    name: 'task_title',
                    anchor: '100%',
                    store: gm.me().combstBranchStore,
                    valueField: 'unique_id',
                    displayField: 'wa_name',
                    value: task_title,
                    minChars: 2,
                    listConfig: {
                        loadingText: '검색중..',
                        emptyText: '일치하는 항목 없음',
                        getInnerTpl: function () {
                            return '<div data-qtip="{unique_id}">{wa_name}</div>';
                        }
                    },
                    listeners: {
                        select: function (combo, record) {
                            var address = record.get('address_1');
                            Ext.getCmp('delivery_info').setValue(address);
                        }
                    }

                }
                // ,{
                // 	xtype: 'textfield',
                // 	fieldLabel: MSG_BUYER,
                // 	name: 'task_title',
                // 	value:  task_title,
                // 	anchor: '100%',
                // 	fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
                // 	readOnly: true
                // }
                , {
                    xtype: 'textfield',
                    fieldLabel: '제품명',
                    name: 'reminder',
                    value: reminder,
                    anchor: '100%',
                    fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
                    readOnly: true
                }, {
                    xtype: 'textarea',
                    fieldLabel: '상세설명',
                    name: 'description',
                    value: description,
                    anchor: '100%',
                    grow: true,
                    growMax: 150,
                    maxLength: 10000,
                    anchor: '100%',
                    fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
                    readOnly: true
                }, {
                    xtype: 'textfield',
                    fieldLabel: '배송지',
                    id: 'delivery_info',
                    name: 'delivery_info',
                    value: delivery_info,
                    anchor: '100%'
                },
                // {
                // 	xtype: 'numberfield',
                // 	fieldLabel: '납품계획수량',
                // 	name: 'not_dl_qty',
                // 	value: pj_quans,
                // 	// value:  not_dl_qty,
                // 	anchor: '100%',
                // 	listeners: {
                // 			change: function(field, value) {

                // 				// if(reserved_number4>0){
                // 				// 	ea = Math.ceil((Number(value)/Number(reserved_number4))); //.toFixed(0);
                // 				// }else{
                // 				// 	var ea = 0;
                // 				// }
                // 				// var prd_vol = Number(ea*reserved2*reserved3*reserved4);

                // 				// Ext.getCmp('prd_vol').setValue(prd_vol);
                // 				// Ext.getCmp('prd_ea').setValue(ea);
                // 				// Ext.getCmp('car_vol').getValue(car_vol);

                // 				// var car_vol = Ext.getCmp('car_vol').getValue();
                // 				// if(car_vol>0&&prd_vol>0){
                // 				// 		weight_percent = Number(prd_vol/car_vol)*100;
                // 				// }else{
                // 				// 		var weight_percent = 0;
                // 				// };


                // 				// Ext.getCmp('weight_percent').setValue(weight_percent.toFixed(2));


                // 			}
                // 	}
                // }
                , {
                    xtype: 'datefield',
                    fieldLabel: '배송일시',
                    name: 'delivery_plan',
                    value: delivery_plan,
                    anchor: '100%'
                }, {
                    xtype: 'timefield',
                    //						            labelWidth: 0,
                    fieldLabel: '배송시간',
                    name: 'delivery_time',
                    anchor: '100%',
                    //						            hideLabel: true,
                    width: 110,
                    minValue: '7:00 AM',
                    maxValue: '11:00 PM',
                    value: '7:00 AM',
                    increment: 30,
                    format: 'H:i'
                }, {
                    xtype: 'textfield',
                    fieldLabel: '출하수량',
                    anchor: '100%',
                    readOnly: true,
                    // value: ship_avail_qty,
                    value: quans,
                    fieldStyle: 'background-color: #FBF8E6;  background-image: none; '
                }

                /*,{
                    xtype: 'combo',
                    fieldLabel: '차량지정',
                    name: 'noti_flag',
                    value:  noti_flag,
                    anchor: '100%',
                    store: Ext.create('Mplm.store.CarMgntStore',{})
                    ,displayField: 'reserved_varchar1'
                    ,valueField: 'class_code'
                    ,innerTpl	: '<div data-qtip="{unique_id}">{reserved_varchar1}</div>',
                    triggerAction: 'all',
                    listeners: {
                        select: function(combo, record) {
                            var horizon = record.get('reserved_double1'); //가로
                            var vertical = record.get('reserved_double2'); //세로
                            var height = record.get('reserved_double3'); //높이
                            var allow_weight = record.get('reserved_double4'); //허용하중

                            var car_vol = Number(horizon*vertical*height);
                            var weight_percent = 0;

                            if(car_vol>0&&prd_vol>0){
                                weight_percent = Number(prd_vol/car_vol)*100;
                            }

                            Ext.getCmp('car_vol').setValue(car_vol);
                            Ext.getCmp('weight_percent').setValue(weight_percent.toFixed(2));

                        }
                    }
                }*/
            ]
        });


        var capacityForm = Ext.create('Ext.form.Panel', {
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            region: 'east',
            title: '용적율 계산',
            width: 300,
            split: true,
            collapsible: true,
            floatable: false,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 80
            },
            items: [
                {
//								xtype: 'combo',
//								fieldLabel: '포장방식', //포장단위
//								name: 'unit_code',
//								displayField: 'codeName',
//								valueField: 'systemCode',
//								value:  unit_code,
//								anchor: '100%',
//								store: Ext.create('Mplm.store.CommonUnitStore',{})
//								,displayField: 'codeName'
//								,valueField: 'systemCode'
//								,innerTpl	: '<div>{codeName}</div>',
//				                triggerAction: 'all',
//				                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
////				                readOnly: true,
//				                listeners: {
//				                    select: function(combo, record) {
//
//				                    }
//				                }
                    xtype: 'textfield',
                    fieldLabel: '포장방식',
                    value: unit_code,
                    anchor: '100%',
                    fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
                    readOnly: true


                },

                {
                    xtype: 'fieldset',
                    title: '카톤박스/파레트 규격',
                    defaults: {
                        labelWidth: 80,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },

                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '가로(X)',
                        value: reserved2,
                        anchor: '100%',
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
                        readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '세로(Y)',
                        value: reserved3,
                        anchor: '100%',
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
                        readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '높이(Z)',
                        value: reserved4,
                        anchor: '100%',
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
                        readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '적재수량\n(포장단위)',
                        value: reserved_number4,
                        anchor: '100%',
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
                        readOnly: true
                    }/*,{
									xtype: 'textfield',
									fieldLabel: '밴딩수량',
									value:  reserved_number4,
									anchor: '100%',
									fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
									readOnly: true
							}*/, {
                        xtype: 'textfield',
                        fieldLabel: '갯수',
                        id: 'prd_ea',
                        value: ea,//ea.toFixed(1),//'출하수량/포장수량=',
                        anchor: '100%',
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
                        readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '제품용적',
                        id: 'prd_vol',
                        name: 'prd_vol',
                        value: prd_vol,//'갯수*가로*세로*높이=',
                        anchor: '100%',
                        fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;text-align:right;',
                        readOnly: true
                    }]
                },
                {
                    xtype: 'textfield',
                    id: 'car_vol',
                    name: 'car_vol',
                    fieldLabel: '차량용적',
                    value: '가로*세로*높이',
                    anchor: '100%',
                    fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '용적율',
                    id: 'weight_percent',
                    value: '제품용적/차량용적 *100%',
                    anchor: '100%',
                    fieldStyle: 'font-weight:100%;background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
                    readOnly: true
                }

            ]
        });

        var win = Ext.create('ModalWindow', {
            title: gm.getMC('CMD_Shipment_request', '출하 요청'),
            width: 680,
            height: 480,
            minWidth: 600,
            minHeight: 300,
            items: [form/*,
				capacityForm*/
            ],
            buttons: [{
                text: CMD_OK,
                handler: function () {
                    var val = form.getValues(false);

                    gMain.selPanel.addDeliveryRequestFc(val, pj_rec);
                    if (win) {
                        win.close();
                    }
                }
            },
                {
                    text: '취소',
                    handler: function () {
                        if (win) {
                            win.close();
                        }


                    }
                }]
        });
        win.show();

        // Ext.MessageBox.show({
        // 	title: CMD_OK,
        // 	msg: '지정된 <출하요청수량> 으로 출하요청을 하시겠습니까?',
        // 	buttons: Ext.MessageBox.YESNO,
        // 	icon: Ext.MessageBox.QUESTION,
        // 	fn: function(btn) {
        // 		var selections = gm.me().grid.getSelectionModel().getSelection();
        // 		var unique_ids = [];
        // 		for(var i=0; i<selections.length; i++) {
        // 			var unique_id = selections[i].get('unique_uid');
        // 			unique_ids.push(unique_id);
        // 		}

        // 		if (btn == 'yes') {
        // 			console_logs('>>>>yes', 'y');
        // 			// Ext.Ajax.request({
        // 			// 	url: CONTEXT_PATH + '/purchase/request.do?method=updateAmountCtrflag',
        // 			// 	params: {
        // 			// 		unique_ids:unique_ids,
        // 			// 		ctr_flag:'M'
        // 			// 	},
        // 			// 	success: function(result, request) {
        // 			// 		gm.me().showToast('결과', '합계금액 계산식이 총중량*단가 로 변경 되었습니다.');
        // 			// 		gm.me().store.load();
        // 			// 	},
        // 			// 	failure: extjsUtil.failureMessage
        // 			// });
        // 		} else {
        // 			return;
        // 		}
        // 	}
        // });
    },

    addDeliveryRequestFc: function (val, pj_rec) {
        console_logs('>>>>val', val);

        var address = val['delivery_info'];
        var ship_qty = val['not_dl_qty'];
        var delivery_plan = val['delivery_plan'];
        var delivery_time = val['delivery_time'];

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        var product_uid = rec.get('unique_id_long');
        // var pj_uid = rec.get('pj_uid');
        // var pj_code = new Date();
        // pj_code = Ext.Date.format(pj_code, 'YmdHis');

        var infos = [];
        for (var i = 0; i < pj_rec.length; i++) {
            var r = pj_rec[i];
            infos.push(r.get('unique_id_long') + ':' + r.get('req_quan'));
            // req_quans.push(r.get('req_quan'));
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/sales/productStock.do?method=addStockShip',
            params: {
                address: address,
                ship_qty: ship_qty,
                delivery_plan: delivery_plan,
                delivery_time: delivery_time,
                product_uid: product_uid,
                infos: infos
                // pj_uid:pj_uid,
                // pj_code:pj_code
            },

            success: function (result, request) {
                if (this.win) {
                    this.win.close();
                }
                gm.me().store.load();
            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax
    },

    vMESSAGE: {
        PJ: '생산이력',
        PRODUCE: '생산이력',
        SHIP: '출하이력'
    },


    buttonToolbar3: Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            style: 'color: #133160; font-weight: bold; font-size: 15px;',
            text: '총 출하가능수량: 0'
        }]
    }),

    setPartFormObj: function (o) {
        console_logs('setPartFormObj o', o);

        // gu.getCmp('unique_id').setValue(o['unique_id_long']);
        gu.getCmp('item_code').setValue(o['item_code']);
        gu.getCmp('item_name').setValue(o['item_name']);
        gu.getCmp('specification').setValue(o['specification']);
    },

    combstBranchStore: Ext.create('Mplm.store.CombstBranchStore', {}),

    searchStore: Ext.create('Mplm.store.MaterialSearchStore', {}),

    projectStore: Ext.create('Mplm.store.ProjectStore', {}),
    setCheckname: function (b) {
        this.checkname = b;

        var btn = gu.getCmp('prwinopen-OK-button');
        if (b == true) {
            btn.enable();
        } else {
            btn.disable();
        }

    }
});
