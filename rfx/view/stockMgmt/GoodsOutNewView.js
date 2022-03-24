//출고확인(스카나)
Ext.define('Rfx.view.stockMgmt.GoodsOutNewView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'goods-out-new-view',
    initComponent: function () {

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        this.addSearchField({
            type: 'checkbox',
            field_id: 'existStockAll',
            items: [
                {
                    boxLabel: this.getMC('CMD_Only_items_in_stock','재고 있는 항목만'),
                    checked: false
                },
            ],
        });

        this.addSearchField('project_varchar3');
        this.addSearchField('pr_no');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');
        this.addSearchField('rtgast_uid');

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

        this.createStoreSimple({
            modelClass: 'Rfx.model.GoodsOutDtl',
            pageSize: gm.pageSize,
            sorters: [{
                property: 'parent_code',
                direction: 'asc'
            }],
            byReplacer: {},
            deleteClass: ['cartmap']

        }, {});

        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var option = {};


        // Ext.each(this.columns, function (columnObj, index) {
        //     var dataIndex = columnObj["dataIndex"];
        //     switch (dataIndex) {
        //         case 'reserved_varchar2':
        //             columnObj["style"] = 'background-color:#0271BC;text-align:center';
        //             columnObj["css"] = 'edit-cell';
        //             columnObj["editor"] = {
        //                 xtype: 'combo',
        //                 store: Ext.create('Rfx2.store.company.bioprotech.DetailStockStore', {}),
        //                 displayField: 'stock_pos',
        //                 valueField: 'stock_pos',
        //                 enableKeyEvents: true,
        //                 editable: false,
        //                 listeners: {
        //                     expand: function (field) {
        //                         var nstock_uid = gm.me().grid.getSelectionModel().getSelection()[0].get('nstock_uid');
        //                         this.store.getProxy().setExtraParam('nstock_uid', nstock_uid);
        //                         this.store.load();
        //                     }
        //                     // ,
        //                     // select (combo, record, eOpts) {
        //                     //     var cartmapUid = gm.me().grid.getSelectionModel().getSelection()[0].get('cartmap_uid');
        //                     //     gm.editAjax('cartmap', 'coord_key1', record.get('supast_uid'), 'unique_id', cartmapUid, {type: ''});
        //                     //     gm.editAjax('cartmap', 'sales_price', record.get('sales_price'), 'unique_id', cartmapUid, {type: ''});
        //                     //     gm.me().store.sync();
        //                     // }
        //                 }
        //             };
        //             columnObj["renderer"] = function (value, meta) {
        //                 if (meta != null) {
        //                     meta.css = 'custom-column';
        //                 }
        //                 return value;
        //             };
        //             break;
        //         default:
        //             break;
        //     }
        // });

        //grid 생성.
        this.createGridCore(arr, option);
        this.createCrudTab();


        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.removeAction.setText('반려');

        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 1 || index == 3) {
                buttonToolbar.items.remove(item);
            }
        });


       

        //불출확인 Action 생성
        this.createGoutAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '불출 확인',
            tooltip: '불출 확인',
            disabled: false,
            handler: function () {

                var uids = [];
                var quanArr = [];
                var childArr = [];
                var stodtlArr = [];
                var rtgastArr = [];
                var qtySum ={ };
                var maxQty ={ };
                var rcQty = {};
                var selections = gm.me().grid.getSelectionModel().getSelection();
                var cur = 0;
                if (selections.length) {
                    for (var i = 0; i < selections.length; i++) {
                        var rec = selections[i];

                        var cartmapuids = rec.get('cartmap_uid');
                        var quans = rec.get('quan');
                        var quan = rec.get('quan');
                        var childs = rec.get('child');
                        // var stodtlUid = rec.get('id');
                        var stodtlUid = rec.get('stodtl_uid');
                        var rtgastUid = rec.get('rtgast_uid');
                        var dtl_qty = rec.get('dtl_qty');
                        var item_code = rec.get('item_code');

                        maxQty[cartmapuids] = rec.get('pr_quan');
                        rcQty[cartmapuids] = rec.get('rc_quan');
                      
                        cur = (qtySum[cartmapuids] == null) ? 0 : qtySum[cartmapuids] ;
                        qtySum[cartmapuids] = cur + quans ;
                        
                        uids.push(cartmapuids);
                        quanArr.push(quans);
                        childArr.push(childs);
                        stodtlArr.push(stodtlUid);
                        rtgastArr.push(rtgastUid);

                        
                        if(quan> dtl_qty){
                            Ext.Msg.alert("알 림", "선택재고 보다 자재가 없습니다.");
                            return;
                        }else if(qtySum[cartmapuids] >  maxQty[cartmapuids]){
                            Ext.Msg.alert("알 림", "요청수량 보다 불출 수량이 많습니다.");
                            return;
                        }else if(qtySum[cartmapuids] >  maxQty[cartmapuids] - rcQty[cartmapuids]){
                            Ext.Msg.alert("알 림", "남은 요청수량 보다 불출 수량이 많습니다.");
                            return;
                        }
                       

                    }
                    console_logs('테스트트111썸',qtySum[item_code] );
                    console_logs('테스트트222기출고',rcQty[item_code]);
                    console_logs('테스트트',qtySum[item_code] - rcQty[item_code]);
                    


                    if (uids == undefined || uids < 0) {
                        Ext.Msg.alert("알 림", "선택선택된 자재가 없습니다.");
                    } else {

                        


                        var form = Ext.create('Ext.form.Panel', {
                            id: gu.id('formPanel'),
                            xtype: 'form',
                            frame: false,
                            border: false,
                            bodyPadding: 15,
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
                                // {
                                //     fieldLabel: '창고',
                                //     xtype: 'combo',
                                //     anchor: '100%',
                                //     id: gu.id('stock_pos'),
                                //     name: 'wh_code',
                                //     store: Ext.create('Mplm.store.WareHouseStore'),
                                //     displayField: 'wh_name',
                                //     valueField: 'wh_code',
                                //     emptyText: '선택',
                                //     allowBlank: false,
                                //     sortInfo: {field: 'create_date', direction: 'DESC'},
                                //     typeAhead: false,
                                //     minChars: 1,
                                //     listConfig: {
                                //         loadingText: '검색중...',
                                //         emptyText: '일치하는 항목 없음.',
                                //         getInnerTpl: function () {
                                //             return '<div data-qtip="{unique_id}">{wh_code} - {wh_name}</div>';
                                //         }
                                //     },
                                //     listeners: {
                                //         select: function (combo, record) {

                                //         }
                                //     }
                                // },
                                {
                                    fieldLabel: '불출 날짜',
                                    xtype: 'datefield',
                                    id: gu.id('reserved_timestamp1'),
                                    name: 'reserved_timestamp1',
                                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                    readOnly: true,
                                    fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                    format: 'Y-m-d',
                                    value: new Date()
                                }
                            ]//item end..

                        });//Panel end...
                        myHeight = 150;

                        prWin = Ext.create('Ext.Window', {
                            modal: true,
                            title: '불출 확인',
                            width: 400,
                            height: myHeight,
                            plain: true,
                            items: form,
                            buttons: [{
                                text: CMD_OK,
                                handler: function (btn) {
                                    var msg = '불출 확인하시겠습니까?'
                                    var myTitle = '불출 확인';
                                    Ext.MessageBox.show({
                                        title: myTitle,
                                        msg: msg,

                                        buttons: Ext.MessageBox.YESNO,
                                        icon: Ext.MessageBox.QUESTION,
                                        fn: function (btn) {

                                            if (btn == 'yes') {
                                                var form = gu.getCmp('formPanel').getForm();

                                                var val = form.getValues(false);
                                                prWin.setLoading(true);
                                                form.submit({
                                                    url: CONTEXT_PATH + '/purchase/request.do?method=createOutDtl',
                                                    params: {
                                                        cartmap_uids: uids,
                                                        quans: quanArr,
                                                        childs: childArr,
                                                        stodtl_uids: stodtlArr,
                                                        rtgast_uids: rtgastArr
                                                    },
                                                    success: function () {
                                                        Ext.Msg.alert('안내', '불출 확인하였습니다.');
                                                        gm.me().storeLoad();
                                                        gm.me().grid.getSelectionModel().deselectAll();
                                                        prWin.close();
                                                    },
                                                    failure: function () {
                                                        Ext.Msg.alert('안내', '불출 확인하였습니다.');
                                                        gm.me().storeLoad();
                                                        gm.me().grid.getSelectionModel().deselectAll();
                                                        prWin.close();
                                                    }
                                                });
                                            } else {
                                                prWin.close();
                                            }

                                        }//fn function(btn)

                                    });//show
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
                    }

                }

            }//handler end...

        });

        //버튼 추가.
        buttonToolbar.insert(3, this.createGoutAction);

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length) {

                var rec = selections[0];
                gm.me().rec = rec;
                console_logs('rec 데이터', rec);
                var standard_flag = rec.get('standard_flag');
                standard_flag = gu.stripHighlight(standard_flag);  //하이라이트 삭제

                console_logs('그리드온 데이터', rec);
                gm.me().request_date = rec.get('req_date'); // 납기일
                gm.me().vSELECTED_UNIQUE_ID = rec.get('id'); //cartmap_uid
                gm.me().vSELECTED_PJ_UID = rec.get('ac_uid'); //프로젝트아이디
                gm.me().vSELECTED_SP_CODE = rec.get('sp_code');
                gm.me().vSELECTED_CURRENCY = rec.get('currency'); //스카나 통화
                gm.me().vSELECTED_STANDARD = rec.get('standard_flag');
                gm.me().vSELECTED_MYCARTQUAN = rec.get('mycart_quan');
                gm.me().vSELECTED_coord_key3 = rec.get('coord_key3');   // pj_uid
                gm.me().vSELECTED_coord_key2 = rec.get('coord_key2');
                gm.me().vSELECTED_coord_key1 = rec.get('coord_key1');   // 공급사
                gm.me().vSELECTED_po_user_uid = rec.get('po_user_uid');
                gm.me().vSELECTED_item_name = rec.get('item_name');    // 품명
                gm.me().vSELECTED_item_code = rec.get('item_code');    // 품번
                gm.me().vSELECTED_specification = rec.get('specification');    // 규격
                gm.me().vSELECTED_pj_name = rec.get('pj_name');
                gm.me().vSELECTED_req_date = rec.get('delivery_plan');
                gm.me().vSELECTED_quan = rec.get('pr_quan');
                gm.me().vSELECTED_CHILD = rec.get('child');
                gm.me().vSELECTED_QUAN = rec.get('quan');
                gm.me().vSELECTED_PRICE = rec.get('sales_price');
                gm.me().vSELECTED_STOCK_USEFUL = rec.get('stock_qty_useful');

                var pj_name = gm.me().vSELECTED_pj_name
                console_logs('유니크아이디', gm.me().vSELECTED_UNIQUE_ID);
                this.cartmap_uids.push(gm.me().vSELECTED_UNIQUE_ID);
                console_logs('선택된 uid', this.cartmap_uids);

                gm.me().createGoutAction.enable();

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

                console_logs('this.currencies>>>', currencies);
            }

        })

        //디폴트 로드
        gm.setCenterLoading(false);
        this.store.getProxy().setExtraParam('orderBy', 'cartmap.unique_id desc');
        this.store.getProxy().setExtraParam('parent_code', this.link);
        this.store.getProxy().setExtraParam('route_type', 'G');
        this.store.getProxy().setExtraParam('status_cr', 'Y');

        this.store.load(function (records) {
            console_logs('디폴트 데이터', records);
            var total_price_sum = 0;
            for (var i = 0; i < records.length; i++) {
                var t_rec = records[i]
                total_price_sum += t_rec.get('releasePrice');
            }
            buttonToolbar3.items.items[1].update('총  금액 : ' + gu.renderNumber(total_price_sum) + ' 원');
        });
    },
    items: [],
    poviewType: 'ALL',
    cartmap_uids: [],
    deleteClass: ['cartmap'],

    treatGo: function () {

        var uniqueId = gm.me().vSELECTED_UNIQUE_ID;

        var next = gu.getNextday(0);

        var request_date = gm.me().request_date;
        var form = null;

        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알 림", "선택된 자재가 없습니다.");
        } else {
            Ext.MessageBox.show({
                title: '확인',
                msg: '요청 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: function (result) {
                    if (result == 'yes') {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/quality/wgrast.do?method=createGrMes',
                            params: {
                                cartmap_uids: cartmapuids,
                                gr_qty: gr_qtys,
                                item_abst: item_abst,
                                gr_reason: val['gr_reason']
                            },
                            success: function () {
                                gm.me().showToast('결과', item_name + ' 등' + gr_qtys.length + ' 건이 입고되었습니다.');
                                gm.me().getStore().load(function () {
                                });
                            },
                            failure: function () {
                            }
                        });
                    }
                },
            });

            //this.treatPaperAddPoRoll();
        }

    },

    editRedord: function (field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        switch (field) {
            case 'stock_pos':
                break;
        }
    },

    getCell_edit: function (me) {
        var listLmenu = gu.lmenuStruct;
        var cell_edit = 'N'
        for (var i = 0; i < listLmenu.length; i++) {
            var o = listLmenu[i];

            //console_logs('getCell_edit o', o);

            if (o['menu_key'] == gm.me().link) {
                return o['cell_edit']
            }
        }
        return cell_edit;
    },
    me: function () {
        return this.selPanel;
    },
    editRedord: function (field, rec, columnType) {

        console_logs('gm ====> edited field', field);
        console_logs('gm ====> edited record', rec);
        var cell_edit = this.getCell_edit(this.me());
        console_logs('gm ====>  cell_edit', cell_edit);

        if (cell_edit == 'Y') {
            var update_pcsstep = rec.get('update_pcsstep'); //공정 졀로 PCSSTEP 수정

            console_logs('update_pcsstep = ', update_pcsstep);

            //Ext.Msg.alert(value);

            var arr = field.split('|');

            // ONLY_STEP : 단순한 PCSSTEP 수정
            // FULL_MAKE : FULL 동정처리
            //var columnType = this.getColumnType(field);
            var value = rec.get(field);
            var tableName = this.getTableName(field);
            var whereField = "unique_id";

            var whereValue = rec.get(tableName + '_uid');

            if (whereValue == null) {
                whereValue = rec.get('id');
            }

            console_logs('value = ', value);
            console_logs('whereValue = ', whereValue);
            console_logs('arr = ', arr);

            if (update_pcsstep != null && arr.length > 1) {
                var vo = rec.data;

                value = vo[field];
                var uidKey = arr[0] + '|' + 'step_uid';
                console_logs('uidKey', uidKey);
                console_logs('vo+++++++++++++++', vo);
                whereValue = vo[uidKey];
                console_logs('whereValue', whereValue);
                if (value == null) {
                    //Ext.MessageBox.alert('오류','지정된 값을 확인할 수 없습니다.');
                    gm.me().showToast('셀수정 결과', '지정된 값을 확인할 수 없습니다.');
                } else if (whereValue == null) {
                    //Ext.MessageBox.alert('오류','작업지시 항목(PCSSTEP UID)를 확인할 수 없습니다.');
                    gm.me().showToast('셀수정 결과', '작업지시 항목(PCSSTEP UID)를 확인할 수 없습니다.');
                }
                else {

                    var type = (update_pcsstep == 'FULL_MAKE') ? 'update_pcsstep' : '';
                    this.editAjax('pcsstep', arr[1], value, whereField, whereValue, {type: type});

                }
            } else {
                if (value != null) {
                    this.editAjax(tableName, field, value, whereField, whereValue, {type: ''});

                }
            }
        }//endof cell_edit=='Y'

    },
    editAjax: function (tableName, field, value, whereField, in_whereValue, in_params, multi_grid_id) {
        console_logs('tableName', tableName);
        if (tableName == null || tableName == '') {
            return;
        }
        gm.me().recCount++;

        var params = {};
        if (in_params != null) {
            for (var key in in_params) {
                params[key] = in_params[key];
            }
        }

        var whereValue = [];
        whereValue.push(in_whereValue);

        params['tableName'] = tableName;
        params['setField'] = field;
        params['setValue'] = value;
        params['whereField'] = whereField;
        params['whereValue'] = whereValue;
        params['valueType'] = gm.getColType(field);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/generalData.do?method=updateGeneralOne',
            params: params,
            success: function (result, request) {
                //console_logs('editRedord result', result);
                var result = result.responseText;
                if (result != null) {
                    var o = Ext.util.JSON.decode(result);
                    if (o != null) {

                        var field_name = gm.getColName(o['setField']);
                        var value = o['setValue'];
                        var id = o['whereValue'];

                        var msg = '';
                        if (value == '') {
                            msg = 'UID ' + id + '의 <' + field_name + '> 값이 ' + ' 초기화 되었습니다.'
                        } else {
                            msg = 'UID ' + id + '의 <' + field_name + '> 값이 ' + '"' + value + '" (으)로 수정되었습니다.'
                        }
                        gm.me().showToast('셀수정 결과', msg);
                        gm.me().recCount--;


                    }
                    gm.me().store.load();
                }

            }

        });

    },
    calcAge: function (quan, sales_price) {
        return quan * sales_price;


    },
    getPrice: function (total_price) {
        console_logs('total_price++++++++', total_price);
        var uniqueId = gm.me().vSELECTED_PJ_UID;
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updatePrice',
            params: {
                cartmapUids: this.cartmap_uids,
                total_price: total_price
            },

            success: function (result, request) {
                gm.me().store.load();
//				Ext.Msg.alert('안내', '복사가 완료 되었습니다.', function() {});

            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax
    },

    getTableName: function (field_name) {
        //		console_logs('getTableName field_name', field_name);
        var fields = this.getFields();
        for (var i = 0; i < fields.length; i++) {
            var o = fields[i];
            //			console_logs('getTableName o', o);
            if (field_name == o['name']) {
                return o['tableName'];
            }
        }
        return null;
    },

    Goprwinopen: function (form) {
        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '주문 작성',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function (btn) {
                    var msg = '사내 발주하시겠습니까?';
                    var myTitle = '주문 작성 확인';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,

                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function (btn) {

                            if (btn == "no") {
                                prWin.close();
                            } else {
                                var form = gu.getCmp('formPanel').getForm();
                                //var form = gm.me().up('form').getForm();
                                var po_user_uid = gm.me().vSELECTED_po_user_uid;
                                //var catmapuid = gm.me().vSELECTED_UNIQUE_ID;
                                var cartmaparr = [];
                                var selections = gm.me().grid.getSelectionModel().getSelection();
                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];
                                    var uid = rec.get('id');

                                    cartmaparr.push(uid);

                                }
                                var quan = rec.get('quan');

                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    console_logs('val', val);

                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createGo',
                                        params: {
                                            sancType: 'YES',
                                            //cartmapUid: catmapuid,
                                            catmapUids: cartmaparr,
                                            quan: quan,
                                            mp_status: 'GR'
                                        },
                                        success: function (val, action) {
                                            prWin.close();
                                            Ext.Msg.alert('안내', '발주 완료 되었습니다.', function () {
                                            });
                                            gm.me().store.load(function () {
                                            });

                                            //this.store.load();
                                            //gm.me().store.load();
                                        },
                                        failure: function (val, action) {

                                            prWin.close();

                                        }
                                    })
                                }  // end of formvalid
                            } // btnIf of end
                        }//fn function(btn)

                    });//show
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
    selCheckOnly: vCompanyReserved4 == 'SKNH01KR' ? true : false,
    selAllowDeselect: vCompanyReserved4 == 'SKNH01KR' ? false : true
});
