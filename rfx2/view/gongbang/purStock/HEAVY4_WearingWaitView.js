Ext.define('Rfx2.view.gongbang.purStock.HEAVY4_WearingWaitView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'wearing-wait-view',
    //items: [{html: 'Rfx.view.purStock.WearingWaitView'}]}
    initComponent: function () {

        //order by 에서 자동 테이블명 붙이기 켜기.
        this.orderbyAutoTable = true;
        useMultitoolbar = true;

        //검색툴바 필드 초기화
        this.initSearchField();
        this.addSearchField('po_no');
        //this.addSearchField('project_varchar6');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.addSearchField('seller_name');


        // this.addSearchField(
        //     {
        //         type: 'combo'
        //         , width: 175
        //         , field_id: 'seller_code'
        //         , store: "SupastStore"
        //         , displayField: 'supplier_name'
        //         , valueField: 'supplier_code'
        //         , emptyText: '공급사'
        //         , innerTpl: '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>'

        //     });

        if (vCompanyReserved4 == 'KWLM01KR') {
            this.addSearchField({
                type: 'radio',
                field_id: 'date_check',
                items: [
                    {
                        text: '포함',
                        name: 'date_check',
                        value: 'N',
                        checked: true
                    },
                    {
                        text: '미포함',
                        name: 'date_check',
                        value: 'Y'
                    }
                ]
            });
        }


        Ext.each(this.columns, function (columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('===>>>>>dataIndex', dataIndex);
            // console_logs('===columnObj', columnObj);
            var qty = 0;
            switch (dataIndex) {
                case 'sales_price':
                case 'curGr_qty':
                case 'sales_amount':
                    columnObj["css"] = 'edit-cell';
                    columnObj["editor"] = {
                        xtype: 'numberfield'
                    };
                    columnObj["renderer"] = function (value, meta) {
                        console_logs('===dataIndex', dataIndex);
                        meta.css = 'custom-column';
                        value = Math.floor(value);
                        return value;
                    }
                    break;
                case 'req_info':
                    columnObj["css"] = 'edit-cell';
                    columnObj["editor"] = {
                        xtype: 'textfield'
                    };
                    columnObj["renderer"] = function (value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    break;
                default:
                    break;
            }
        });


        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        if (vCompanyReserved4 == 'KWLM01KR') {
            gMain.pageSize = 500;
        }

        //모델 정의
        this.createStore('Rfx.model.Heavy4WearingWait', [{
                property: 'po_no',
                direction: 'DESC'
            }],
            /*pageSize*/
            gMain.pageSize
            , {}
            , ['xpoast-abst']
        );

        //그리드 생성
        var arr = [];
        arr.push(buttonToolbar);

        //검색툴바 생성
        if (useMultitoolbar == true) {
            var multiToolbar = this.createMultiSearchToolbar({first: 9, length: 11});
            console_logs('multiToolbar', multiToolbar);
            for (var i = 0; i < multiToolbar.length; i++) {
                arr.push(multiToolbar[i]);
            }
        } else {
            var searchToolbar = this.createSearchToolbar();

            arr.push(searchToolbar);
        }

        var option = {
            listeners: {
                // itemdblclick: this.attachFileView
            }
        };

        console_logs('=>push', arr);

        //grid 생성.
        this.createGridCore(arr, option);
        // this.createGrid(arr);


        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });


        //this.editAction.setText('입고확인' );


        this.setAllMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.load(function () {
                });
            }
        });
        this.setAssyMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'ASSY',
            tooltip: 'ASSEMBLY',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('standard_flag', 'A');
                gm.me().store.getProxy().setExtraParam('sg_code', 'AASSY');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSetMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'SET',
            tooltip: 'SET',
            toggleGroup: 'matType',
            handler: function () {
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('standard_flag', 'A');
                gm.me().store.getProxy().setExtraParam('sg_code', 'SET00');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSaMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '원자재',
            tooltip: '원자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'RAW';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'S');
                gm.me().store.load(function () {
                });
            }
        });
        this.setMROView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: 'MRO',
            tooltip: '소모성',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'M');
                gm.me().store.load(function () {
                });
            }
        });
        this.setSubMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '부자재',
            tooltip: '부자재',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'B');
                gm.me().store.load(function () {
                });
            }
        });
        this.setUsedMatView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '상품',
            tooltip: '상품',
            toggleGroup: 'matType',
            handler: function () {
                this.matType = 'SUB';
                gm.me().store.getProxy().setExtraParams({});
                gm.me().store.getProxy().setExtraParam('sp_code', 'P');
                gm.me().store.load(function () {
                });
            }
        });

        //합계금액 계산 변경 Action 생성
        this.massAmountAction = Ext.create('Ext.Action', {
            // iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '중량계산',
            tooltip: '중량계산',
            disabled: true,
            handler: function () {

                Ext.MessageBox.show({
                    title: '확인',
                    msg: '금액 계산식을 <br/>중량<예><br/>수량<아니오><br/> 로 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function (btn) {
                        var selections = gm.me().grid.getSelectionModel().getSelection();
                        var unique_ids = [];
                        for (var i = 0; i < selections.length; i++) {
                            var unique_id = selections[i].get('unique_id_long');
                            unique_ids.push(unique_id);
                        }

                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=updateAmountCtrflag',
                                params: {
                                    unique_ids: unique_ids,
                                    ctr_flag: 'M',
                                    unit_code: 'Kg'
                                },
                                success: function (result, request) {
                                    gm.me().showToast('결과', '합계금액 계산식이 총중량*단가 로 변경 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        } else {
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/request.do?method=updateAmountCtrflag',
                                params: {
                                    unique_ids: unique_ids,
                                    ctr_flag: 'N',
                                    unit_code: 'EA'
                                },
                                success: function (result, request) {
                                    gm.me().showToast('결과', '합계금액 계산식이 수량*단가 로 변경 되었습니다.');
                                    gm.me().store.load();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        }
                    }
                });

            } //handler end...

        });

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        buttonToolbar.insert(5, '-');

        //버튼 추가.
        buttonToolbar.insert(5, this.setUsedMatView);
        buttonToolbar.insert(5, this.setMROView);
        buttonToolbar.insert(5, this.setSubMatView);
        buttonToolbar.insert(5, this.setSaMatView);
        buttonToolbar.insert(5, this.setSetMatView);
        buttonToolbar.insert(5, this.setAssyMatView);
        buttonToolbar.insert(5, this.setAllMatView);


        //입고 확인 Action 생성
        this.createGoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '입고 확인',
            tooltip: '입고 확인',
            disabled: true,
            handler: function () {
                gMain.selPanel.treatPaperGoRoll();
            }
        });

        buttonToolbar.insert(1, '-');
        buttonToolbar.insert(1, this.createGoAction);

        this.callParent(arguments);

        this.grid.getSelectionModel().on({
            selectionchange: function (sm, selections) {

                if (selections == null || selections.length < 1) {
                    if (vCompanyReserved4 == 'KWLM01KR') {

                        var store = this.store;
                        var total_price_sum = 0;
                        var total_qty = 0;

                        console_logs('>>>>>>>>>********store', store.data);
                        for (var i = 0; i < store.data.items.length; i++) {
                            var rec = store.data.items[i];
                            total_qty += rec.get('curGr_qty');
                            var ctr_flag = rec.get('ctr_flag');
                            total_price_sum += rec.get('sales_amount');

                        }

                        gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
                    }

                }
            }
        });

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (vCompanyReserved4 == 'SKNH01KR' || vCompanyReserved4 == 'KWLM01KR') {
                var total_price_sum = 0;
                var total_qty = 0;


                for (var i = 0; i < selections.length; i++) {
                    var t_rec = selections[i];
                    if (vCompanyReserved4 == 'KWLM01KR') {
                        var ctr_flag = t_rec.get('ctr_flag');
                        total_price_sum += t_rec.get('sales_amount');
                    } else {
                        total_price_sum += t_rec.get('curGr_qty') * t_rec.get('sales_price');
                    }

                    total_qty += t_rec.get('curGr_qty');
                }

                this.buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
            }

            if (selections.length) {
                this.cartmap_uids = [];
                this.gr_qtys = [];
                for (var i = 0; i < selections.length; i++) {
                    var rec1 = selections[i];
                    var uids = rec1.get('id');
                    var curGr_qty = rec1.get('curGr_qty');
                    this.cartmap_uids.push(uids);
                    this.gr_qtys.push(curGr_qty);
                }//endoffor
                console_logs('그리드온 uid', this.cartmap_uids);
                console_logs('그리드온 curGr_qty', this.gr_qtys);

                var rec = selections[0];
                //console_logs('rec', rec);
                gMain.selPanel.cartmapuids = this.cartmap_uids;
                gMain.selPanel.gr_qtys = this.gr_qtys;
                console_logs('gMain.selPanel.cartmapuids>>>>>>>>>>>', gMain.selPanel.cartmapuids);
                gMain.selPanel.cartmapuid = rec.get('id');
                gMain.selPanel.gr_qty = rec.get('curGr_qty');
                gMain.selPanel.item_name = rec.get('item_name');
                gMain.selPanel.vSELECTED_description = rec.get('description');   // 평량
                gMain.selPanel.vSELECTED_remark = rec.get('remark');    // 장
                gMain.selPanel.vSELECTED_comment = rec.get('comment1');   // 폭
                gMain.selPanel.vSELECTED_quan = rec.get('po_qty');
                gMain.selPanel.vSELECTED_spcode = rec.get('sp_code');

                console_logs('그리드 데이터', rec);

                gMain.selPanel.createGoAction.enable();
                gMain.selPanel.divisionChangeAction.enable();
                gMain.selPanel.massAmountAction.enable();
            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
                gMain.selPanel.createGoAction.disable();
                gMain.selPanel.divisionChangeAction.disable();
                gMain.selPanel.massAmountAction.disable();
            }

        });

        this.grid.on('edit', function (editor, e) {

            var field = e.field;
            var gr_qty = gm.me().grid.getSelectionModel().getSelection()[0].get('curGr_qty');

            switch (field) {
                case 'curGr_qty':
                    if (gr_qty.length == 1) {
                        gr_qty = rec.get(field);
                    }
                    var selection = gm.me().grid.getSelectionModel().getSelection();
                    var rec = selection[0];
                    selection[0].set('curGr_qty', rec.get(field));
                    if (ctr_flag == 'M') {
                        selection[0].set('sales_amount', Math.floor(selection[0].get('sales_price') * selection[0].get('mass')));
                    } else {
                        selection[0].set('sales_amount', Math.floor(rec.get(field) * selection[0].get('sales_price')));
                    }
                    // selection[0].set('sales_amount', rec.get(field) * selection[0].get('sales_price'));
                    gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(rec.get(field) * selection[0].get('sales_price')) + ' / 총 수량 : ' + rec.get(field));
                    break;
                case 'sales_price':
                    if (gr_qty.length == 1) {
                        gr_qty = rec.get(field);
                    }
                    var selection = gm.me().grid.getSelectionModel().getSelection();
                    var rec = selection[0];
                    selection[0].set('sales_price', rec.get(field));
                    var ctr_flag = selection[0].get('ctr_flag');
                    if (ctr_flag == 'M') {
                        selection[0].set('sales_amount', Math.floor(rec.get(field) * selection[0].get('mass')));
                    } else {
                        selection[0].set('sales_amount', Math.floor(rec.get(field) * selection[0].get('curGr_qty')));
                    }

                    gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(rec.get(field) * selection[0].get('curGr_qty')) + ' / 총 수량 : ' + rec.get('curGr_qty'));
                    break;
            }

            var rec = e.record;
            var request_qty = rec.get('request_qty');
            var sales_price = rec.get('sales_price');
            var po_no = rec.get('po_no');
            var item_name = rec.get('item_name');
            var unique_id = rec.get('unique_id_long');
            var pj_code = rec.get('pj_code');

            var unit_code = rec.get('unit_code');
            var sales_amount = rec.get('sales_amount');

            console_logs('==unit_code', unit_code);

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/prch.do?method=grWaitChange',
                params: {
                    sales_price: sales_price,
                    sales_amount: sales_amount,
                    unique_id: unique_id  // xpoast_uid
                },
                success: function (result, request) {
                    //취소수량은 취소가능수량(주문가능수량)을 넘을 수 없다.
                    // gm.me().store.load(function() {});
                    gm.me().showToast('결과', po_no + '의 ' + item_name + '의 단가 ' + sales_price + '으로 수정되었습니다.');

                },//endofsuccess

            });//endofajax
        });

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.load(function (records) {
            if (vCompanyReserved4 == 'KWLM01KR') {
                console_logs('>>>>>>>>>********records', records);

                var total_price_sum = 0;
                var total_qty = 0;

                for (var i = 0; i < gm.me().store.data.items.length; i++) {
                    var t_rec = gm.me().store.data.items[i];
                    total_price_sum += t_rec.get('sales_amount');
                    total_qty += t_rec.get('curGr_qty');
                }

                gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(total_price_sum) + ' / 총 수량 : ' + total_qty);
            }
        });

    },
    items: [],
    cartmap_uids: [],
    gr_qtys: [],
    poviewType: 'ALL',

    onRenderCell: function (value, metaData, record, rowIndex, colIndex, store, view) {
        Ext.util.Format.number(1.23456, '0.000');
        return value;
    },

    treatPaperGoRoll: function () {
        var form = null;

        form = Ext.create('Ext.form.Panel', {
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
            items: [
                {
                    fieldLabel: '창고',
                    xtype: 'combo',
                    anchor: '100%',
                    id: gu.id('wh_code'),
                    name: 'wh_code',
                    store: Ext.create('Mplm.store.MainWareHouseStore'),
                    displayField: 'wh_name',
                    valueField: 'unique_id',
                    emptyText: '선택',
                    allowBlank: false,
                    value: '100',
                    //sortInfo: {field: 'wh_code', direction: 'ASC'},
                    typeAhead: false,
                    minChars: 1,
                    listConfig: {
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function () {
                            return '<div data-qtip="{unique_id}">{wh_code} - {wh_name}</div>';
                        }
                    },
                    listeners: {
                        select: function (combo, record) {

                        }
                    }
                },
                {
                    fieldLabel: '입고 의견',//ppo1_request,
                    xtype: 'textarea',
                    rows: 4,
                    anchor: '100%',
                    name: 'gr_reason',
                    //value: '',
                    emptyText: '입고의견을 입력해주세요'
                },
                {
                    fieldLabel: '입고 날짜',
                    xtype: 'datefield',
                    name: 'gr_date',
                    format: 'Y-m-d',
                    value: new Date()
                }
            ]//item end..

        });//Panel end...

        var combo = gu.getCmp('wh_code');
        combo.store.load(
            function () {
                this.each(function (record) {
                    var wh_code = record.get('wh_code');
                    if (wh_code == '100') {
                        combo.select(record);
                    }
                });
            }
        );


        prwin = gMain.selPanel.prwinopen(form);
    },

    prwinopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '입고 확인',
            width: 400,
            height: (vCompanyReserved4 == 'KWLM01KR') ? 220 : 220,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {

                    var form = gu.getCmp('formPanel').getForm();
                    var cartmapuids = gMain.selPanel.cartmap_uids;
                    // var gr_qtys = gMain.selPanel.gr_qtys;
                    var selections = gm.me().grid.getSelectionModel().getSelection();
                    var gr_qtys = [];
                    var project_varchar6_arr = [];
                    for (var i = 0; i < selections.length; i++) {
                        gr_qtys.push(selections[i].get('curGr_qty'));
                        project_varchar6_arr.push(selections[i].get('project_varchar6'));
                    }
                    var item_name = gMain.selPanel.item_name;
                    var item_abst = item_name + ' 外';
                    var val = form.getValues(false);

                    var reserved_number2 = null;
                    var wa_code = null;
                    var selections = gm.me().grid.getSelectionModel().getSelection();


                    //console_logs('form', form);
                    prWin.setLoading(true);

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/quality/wgrast.do?method=createGrMes',
                        params: {
                            cartmap_uids: cartmapuids,
                            gr_qty: gr_qtys,
                            project_varchar6: project_varchar6_arr,
                            item_abst: item_abst,
                            gr_reason: val['gr_reason'],
                            gr_date: val['gr_date'],
                            whouse_uid: val['wh_code'],
                            reserved_number2: reserved_number2,
                            wa_code: wa_code
                        },
                        success: function () {

                            var srcahdArr = [];
                            var cartmapArr = [];
                            var nameArr = [];
                            var priceArr = [];
                            var curArr = [];
                            var quanArr = [];
                            var coordArr = [];
                            var selections = gm.me().grid.getSelectionModel().getSelection();
                            var ac_uid = selections[0].get('pj_uid');
                            for (var i = 0; i < selections.length; i++) {
                                var rec = selections[i];
                                var uid = rec.get('id');
                                var srcahd_uid = rec.get('unique_id');
                                var coord_key3 = rec.get('coord_key3');
                                var currency = rec.get('cart_currency');
                                var item_name = rec.get('item_name');
                                var static_sales_price = rec.get('static_sales_price');
                                var quan = rec.get('quan');
                                quanArr.push(quan);
                                cartmapArr.push(uid);
                                srcahdArr.push(srcahd_uid);
                                curArr.push(currency);
                                priceArr.push(static_sales_price);
                                nameArr.push(item_name);
                                coordArr.push(coord_key3);
                            }

                            var pj_name = rec.get('pj_name');
                            var lot_no = rec.get('project_varchar6');

                            if (prWin) {
                                prWin.close();
                            }

                            // //LOT 주문만 자동불출 요청을 한다.
                            // if(lot_no.length > 1) {
                            //     Ext.Ajax.request({
                            //         url: CONTEXT_PATH + '/purchase/request.do?method=createGoAtPo',
                            //         params: {
                            //             sancType: 'YES',
                            //             item_name: item_name,
                            //             cartmaparr: cartmapuids,
                            //             srcahdarr: srcahdArr,
                            //             quans: gr_qtys,
                            //             currencies: curArr,
                            //             names: nameArr,
                            //             coord_key3s: coordArr,
                            //             sales_prices: priceArr,
                            //             pj_name: pj_name,
                            //             mp_status: 'GR',
                            //             ac_uid: ac_uid,
                            //             is_automatic_go: 'Y'
                            //         },
                            //         success: function () {
                            //             gm.me().showToast('결과', item_name + ' 등' + gr_qtys.length + ' 건이 입고되었습니다.');
                            //             gm.me().getStore().load(function () {
                            //             });
                            //             if (prWin) {
                            //                 prWin.close();
                            //             }
                            //         },
                            //         failure: function () {
                            //             if (prWin) {
                            //                 prWin.close();
                            //             }
                            //         }
                            //     });
                            // } else {
                            //     if (prWin) {
                            //         prWin.close();
                            //     }
                            // }

                        },
                        failure: function () {
                            if (prWin) {
                                prWin.close();
                            }
                        }
                    });

                    gm.me().store.load();
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

    buttonToolbar3: Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '총 금액 : 0 / 총 수량 : 0'
        }]
    }),
    /*
        attachFile: function () {
            var record = gm.me().grid.getSelectionModel().getSelection()[0];
            console_logs('==>zzz', record);

            this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
            this.attachedFileStore.load(function (records) {
                if (records != null) {
                    var o = gu.getCmp('file_quan');
                    if (o != null) {
                        o.update('총수량 : ' + records.length);
                    }

                }
            });

            var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
            this.fileGrid = Ext.create('Ext.grid.Panel', {
                title: '첨부',
                store: this.attachedFileStore,
                collapsible: true,
                multiSelect: true,
                // hidden : ! this.useDocument,
                // selModel: selFilegrid,
                stateId: 'fileGrid' +  vCUR_MENU_CODE,
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'button',
                            text: '파일 첨부',
                            scale: 'small',
                            glyph: 'xf0c6@FontAwesome',
                            scope: this.fileGrid,
                            handler: function () {


                                var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long') + '&change_reason=' + 'G';

                                var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                    uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                                    uploaderOptions: {
                                        url: url
                                    },
                                    synchronous: true
                                });
                                var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                    dialogTitle: '파일 첨부',
                                    panel: uploadPanel
                                });

                                this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {

                                    console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                    console_logs('this.mon uploadcomplete manager', manager);
                                    console_logs('this.mon uploadcomplete items', items);
                                    console_logs('this.mon uploadcomplete errorCount', errorCount);

                                    gm.me().uploadComplete(items);
                                    //if (!errorCount) {
                                    uploadDialog.close();
                                    //}
                                }, this);

                                uploadDialog.show();
                            }
                        },
                        this.removeActionFile,
                        '-',
                        this.sendFileAction,
                        '->',
                        {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

                ],
                columns: [
                    {
                        text: 'UID',
                        width: 100,
                        sortable: true,
                        dataIndex: 'id'
                    },
                    {
                        text: '파일명',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'object_name'
                    },
                    {
                        text: '파일유형',
                        width: 70,
                        sortable: true,
                        dataIndex: 'file_ext'
                    },
                    {
                        text: '날짜',
                        width: 160,
                        sortable: true,
                        dataIndex: 'create_date'
                    },
                    {
                        text: 'size',
                        width: 100,
                        sortable: true,
                        xtype: 'numbercolumn',
                        format: '0,000',
                        style: 'text-align:right',
                        align: 'right',
                        dataIndex: 'file_size'
                    }]
            });

            var win = Ext.create('ModalWindow', {
                title: CMD_VIEW + '::' +  ' 첨부파일',
                width: 1300,
                height: 600,
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
                    this.fileGrid
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
    */
    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),

    uploadComplete: function (items) {

        console_logs('uploadComplete items', items);

        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });

        console_logs('파일업로드 결과', output);

        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('총수량 : ' + records.length);
                }

            }
        });


    },

    buttonToolbar3: Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px; margin: 5px;',
            text: '총 금액 : 0 / 총 수량 : 0'
        }]
    }),

    divisionChangeAction: Ext.create('Ext.Action', {
        iconCls: 'mfglabs-retweet_14_0_5395c4_none',
        text: '사업부 변경',
        tooltip: '사업부 변경',
        disabled: true,
        handler: function () {
            var selections = gm.me().grid.getSelectionModel().getSelection();

            var po_no = selections[0].get('po_no');

            var form = Ext.create('Ext.form.Panel', {
                id: 'formDivision',
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
                    //labelWidth: 60,
                    //margins: 10,
                },
                items: [
                    {
                        xtype: 'textfield',
                        id: 'po_no',
                        name: 'po_no',
                        value: po_no,
                        editable: false,
                        fieldLabel: '주문번호',
                        fieldStyle: 'background-color: #ddd; background-image: none;',
                        anchor: '100%',
                    }, {
                        xtype: 'combo',
                        fieldLabel: '사업부',
                        name: 'wa_code',
                        id: 'wa_code',
                        anchor: '100%',
                        store: gm.me().comcstStore,
                        displayField: 'division_name',
                        valueField: 'wa_code',
                        minChars: 1,
                        allowBlank: true,
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function () {
                                return '<div data-qtip="{wa_code}">{division_name}</div>';
                            }
                        },
                    }
                ]
            });

            var win = Ext.create('ModalWindow', {
                title: '사업부 수정',
                width: 400,
                height: 250,
                minWidth: 250,
                minHeight: 180,
                items: form,
                buttons: [{
                    text: CMD_OK,
                    handler: function (btn) {
                        if (btn == 'no') {
                            win.close();
                        } else {
                            var po_no = Ext.getCmp('po_no').getValue();
                            var wa_code = Ext.getCmp('wa_code').getValue();
                            console_logs('==po_no', po_no);
                            console_logs('==wa_code', wa_code);
                            // return;
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/prch.do?method=changeDivision',
                                params: {
                                    po_no: po_no,
                                    wa_code: wa_code
                                },
                                success: function (result, request) {
                                    gm.me().store.load();
                                    if (win) {
                                        win.close();
                                    }
                                }, // endofsuccess
                                failure: extjsUtil.failureMessage
                            }); // endofajax
                        }

                    }
                }, {
                    text: CMD_CANCEL,
                    handler: function (btn) {
                        win.close();
                    }
                }]
            });
            win.show();
        }//handler end...

    }),

    attachFileView: function () {
        var fieldPohistory = [
            {name: 'account_code', type: "string"},
            {name: 'account_name', type: "string"},
            {name: 'po_no', type: "string"},
            {name: 'po_date', type: "string"},
            {name: 'seller_code', type: "string"},
            {name: 'seller_name', type: "string"},
            {name: 'sales_price', type: "string"},
            {name: 'pr_qty', type: "string"}
        ];


        var selections = gm.me().grid.getSelectionModel().getSelection();
        console_logs('===>attachFileView', selections);
        if (selections != null && selections.length > 0) {
            var unique_id_long = selections[0].get('coord_key3');

            gm.me().attachedFileStore.getProxy().setExtraParam('group_code', unique_id_long);
            gm.me().attachedFileStore.load(function (records) {

                console_logs('attachedFileStore records', records);
                if (records != null) {
                    var o = gu.getCmp('file_quan');
                    if (o != null) {
                        o.update('총수량 : ' + records.length);
                    }

                }
            });

            var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});

            var fileGrid = Ext.create('Ext.grid.Panel', {
                title: '첨부',
                store: gm.me().attachedFileStore,
                collapsible: true,
                layout: 'fit',
                multiSelect: true,
                selModel: selFilegrid,
                stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

                ],
                columns: [
                    {
                        text: 'UID',
                        width: 100,
                        sortable: true,
                        dataIndex: 'id'
                    },
                    {
                        text: '파일명',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'object_name'
                    },
                    {
                        text: '파일유형',
                        width: 70,
                        sortable: true,
                        dataIndex: 'file_ext'
                    },
                    {
                        text: '날짜',
                        width: 160,
                        sortable: true,
                        dataIndex: 'create_date'
                    },
                    {
                        text: 'size',
                        width: 100,
                        sortable: true,
                        xtype: 'numbercolumn',
                        format: '0,000',
                        style: 'text-align:right',
                        align: 'right',
                        dataIndex: 'file_size'
                    }]
            });

            var prWin = Ext.create('Ext.Window', {
                modal: true,
                title: '첨부파일',
                width: 1200,
                height: 600,
                items: fileGrid,
                buttons: [
                    {
                        text: CMD_OK,
                        //scope:this,
                        handler: function () {
                            if (prWin) {
                                prWin.close();
                            }
                        }
                    }
                ]
            })
            prWin.show();
        }
    },

    uploadComplete: function (items) {

        console_logs('uploadComplete items', items);

        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function (item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });

        console_logs('파일업로드 결과', output);

        this.attachedFileStore.load(function (records) {
            if (records != null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update('총수량 : ' + records.length);
                }

            }
        });


    },
    /*
        attachFile: function () {
            var record = gm.me().grid.getSelectionModel().getSelection()[0];
            console_logs('==>zzz', record);

            this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
            this.attachedFileStore.load(function (records) {
                if (records != null) {
                    var o = gu.getCmp('file_quan');
                    if (o != null) {
                        o.update('총수량 : ' + records.length);
                    }

                }
            });

            var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
            this.fileGrid = Ext.create('Ext.grid.Panel', {
                title: '첨부',
                store: this.attachedFileStore,
                collapsible: true,
                multiSelect: true,
                // hidden : ! this.useDocument,
                selModel: selFilegrid,
                stateId: 'fileGrid' +   vCUR_MENU_CODE,
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'button',
                            text: '파일 첨부',
                            scale: 'small',
                            glyph: 'xf0c6@FontAwesome',
                            scope: this.fileGrid,
                            handler: function () {


                                var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long') + '&change_reason=' + 'G';

                                var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                    uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                                    uploaderOptions: {
                                        url: url
                                    },
                                    synchronous: true
                                });
                                var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                    dialogTitle: '파일 첨부',
                                    panel: uploadPanel
                                });

                                this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {

                                    console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                    console_logs('this.mon uploadcomplete manager', manager);
                                    console_logs('this.mon uploadcomplete items', items);
                                    console_logs('this.mon uploadcomplete errorCount', errorCount);

                                    gm.me().uploadComplete(items);
                                    //if (!errorCount) {
                                    uploadDialog.close();
                                    //}
                                }, this);

                                uploadDialog.show();
                            }
                        },
                        this.removeActionFile,
                        '-',
                        this.sendFileAction,
                        '-',
                        this.fileRemoveAction,
                        '->',
                        {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

                ],
                columns: [
                    {
                        text: 'UID',
                        width: 100,
                        sortable: true,
                        dataIndex: 'id'
                    },
                    {
                        text: '파일명',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'object_name'
                    },
                    {
                        text: '파일유형',
                        width: 70,
                        sortable: true,
                        dataIndex: 'file_ext'
                    },
                    {
                        text: '날짜',
                        width: 160,
                        sortable: true,
                        dataIndex: 'create_date'
                    },
                    {
                        text: 'size',
                        width: 100,
                        sortable: true,
                        xtype: 'numbercolumn',
                        format: '0,000',
                        style: 'text-align:right',
                        align: 'right',
                        dataIndex: 'file_size'
                    }]
            });

            this.fileGrid.getSelectionModel().on({
                selectionchange: function (sm, selections) {
                    if (selections != null && selections.length > 0) {
                        gm.me().fileRemoveAction.enable();
                    } else {
                        gm.me().fileRemoveAction.disable();
                    }
                }
            })

            var win = Ext.create('ModalWindow', {
                title: CMD_VIEW + '::' +  ' 첨부파일',
                width: 1300,
                height: 600,
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
                    this.fileGrid
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
    */
    fileRemoveAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: gm.getMC('CMD_DELETE', '삭제'),
        disabled: true,
        handler: function (widget, event) {
            var selections = gm.me().fileGrid.getSelectionModel().getSelection();
            console_logs('===selections', selections);

            var srccst_uids = [];
            for (var i = 0; i < selections.length; i++) {
                var rec = selections[i];
                srccst_uids.push(rec.get('unique_id'));
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/uploader.do?method=assyMatchFile',
                params: {
                    srcahd_uid: -1,
                    srccst_uids: srccst_uids,
                    type: 'remove'
                },
                success: function () {
                    gm.me().showToast('결과', '성공');
                    gm.me().attachedFileStore.load();
                },
                failure: function () {
                    gm.me().showToast('결과', '실패');
                }
            });
        }
    }),

    attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', {group_code: null}),

    comcstStore: Ext.create('Mplm.store.ComCstStore', {
        hasNull: false
    }),

    selCheckOnly: vCompanyReserved4 == 'SKNH01KR' ? true : false,
    selAllowDeselect: vCompanyReserved4 == 'SKNH01KR' ? false : true,
    nextRow: vCompanyReserved4 == 'KWLM01KR' ? true : false

});
