//주문작성

Ext.define('Rfx2.view.company.dsmaref.stockMgmt.GoodsOutView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'goods-out-view',
    initComponent: function () {


        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        this.addSearchField('pj_name');
        this.addSearchField('make_no');
        this.addSearchField('item_code');
        this.addSearchField('item_name');
        this.addSearchField('specification');

        //검색툴바 생성
        var searchToolbar = this.createSearchToolbar();

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        Ext.each(this.columns, function(columnObj, index) {
            var o = columnObj;
            var dataIndex = o['dataIndex'];
            console_logs('>>>> dataIndex', dataIndex);

            switch(dataIndex) {
                case 'real_status':
                    o['align'] = 'center';
                    o['renderer'] = function(value, meta, record) {
                        if(record != null) {
                            var route_type = record.get('route_type');

                            switch(route_type) {
                                case 'G': // 불출
                                    switch(value) {
                                        case 'CR':
                                            meta.css = 'custom-column-delivery';
                                            return '불출대기';
                                        case 'DE':
                                            meta.css = 'custom-column-delivery';
                                            return '불출반려';
                                        case 'GC':
                                            meta.css = 'custom-column-red';
                                            return '불출취소';
                                        case 'GY':
                                            meta.css = 'custom-column-working-complete';
                                            return '불출완료';
                                        default:
                                            return value;
                                    }
                                    break;
                                case 'P': // 구매
                                    switch(value) {
                                        case 'CR':
                                            meta.css = 'custom-column-purchase-wait';
                                            return '구매접수';
                                        case 'PO':
                                            meta.css = 'custom-column-purchase-wait';
                                            return '입고대기';
                                        case 'GR':
                                            meta.css = 'custom-column-working-complete';
                                            return '입고완료';
                                        case 'PC':
                                            meta.css = 'custom-column-red';
                                            return '발주취소';
                                        case 'DE':
                                            meta.css = 'custom-column-red';
                                            return '구매반려';
                                        case 'GY':
                                            meta.css = 'custom-column-working-complete';
                                            return '불출완료';
                                        default:
                                            return value;
                                    }
                                    break;
                                default:
                                    return value;
                            }
                        }
                    }
                    break;
            }
        });

        this.createStoreSimple({
            modelClass: 'Rfx.model.GoodsOut',
            pageSize: gMain.pageSize, /*pageSize*/
            sorters: [{
                property: 'parent_code',
                direction: 'asc'
            }],
            byReplacer: {},
            deleteClass: ['cartmap']

        }, {
            //groupField: 'parent_code'
        });


        var arr = [];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
            groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 불출 ({rows.length})</div>'
        });

        var option = {
            /*features: [groupingFeature]*/
        };

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

        //PO Type View Type
        this.setAllPoView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '전체',
            tooltip: '전체목록',
            pressed: true,
            //ctCls: 'x-toolbar-grey-btn',
            toggleGroup: 'poViewType',
            handler: function () {
                gMain.selPanel.createAddPoAction.disable();
                gMain.selPanel.vSELECTED_UNIQUE_ID = '';
                gMain.selPanel.poviewType = 'ALL';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                gMain.selPanel.store.load(function () {
                });

            }
        });

        this.setRawPoView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '원자재',
            tooltip: '원자재',
            //ctCls: 'x-toolbar-grey-btn',
            toggleGroup: 'poViewType',
            handler: function () {
                gMain.selPanel.createAddPoAction.disable();
                gMain.selPanel.createGoutAction.enable();
                gMain.selPanel.createInPoAction.enable();
                gMain.selPanel.vSELECTED_UNIQUE_ID = '';
                gMain.selPanel.poviewType = 'RAW';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                gMain.selPanel.store.getProxy().setExtraParam('storeType', '');
                gMain.selPanel.store.load(function () {
                });

            }
        });
        this.setSubPoView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '공구류',
            tooltip: '공구류 주문',
            //ctCls: 'x-toolbar-grey-btn',
            toggleGroup: 'poViewType',
            handler: function () {
                gMain.selPanel.createAddPoAction.disable();
                gMain.selPanel.createGoutAction.enable();
                gMain.selPanel.vSELECTED_UNIQUE_ID = '';
                gMain.selPanel.poviewType = 'SUB';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                gMain.selPanel.store.getProxy().setExtraParam('storeType', '');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K1');
                gMain.selPanel.store.load(function () {
                });

            }
        });
        this.setMroPoView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '기타 소모품',
            tooltip: '기타 소모품',
            //ctCls: 'x-toolbar-grey-btn',
            toggleGroup: 'poViewType',
            handler: function () {
                gMain.selPanel.createAddPoAction.disable();
                gMain.selPanel.createGoutAction.enable();
                gMain.selPanel.vSELECTED_UNIQUE_ID = '';
                gMain.selPanel.poviewType = 'PAPER';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                gMain.selPanel.store.getProxy().setExtraParam('storeType', '');
                gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K3');
                gMain.selPanel.store.load(function () {
                });


            }
        });


        this.setAddPoView = Ext.create('Ext.Action', {
            xtype: 'button',
            text: '주문이력',
            tooltip: '주문 이력',
            multiSelect: false,
            //ctCls: 'x-toolbar-grey-btn',
            toggleGroup: 'poViewType',
            handler: function () {
                gMain.selPanel.poviewType = 'ADDPO';
                gMain.selPanel.vSELECTED_UNIQUE_ID = '';
                gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
                gMain.selPanel.store.getProxy().setExtraParam('storeType', 'Y');
                gMain.selPanel.store.load(function () {
                });

            }
        });
        //사내발주 Action 생성
        this.createInPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '사내 발주',
            tooltip: '사내 발주',
            disabled: false,
            handler: function () {
                gMain.selPanel.treatInPo();
            }//handler end...

        });
        //주문작성 Action 생성
        this.createGoutAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '불출 확인',
            tooltip: '불출 확인',
            disabled: true,
            handler: function () {

                var selects = gm.me().grid.getSelectionModel().getSelection();
                for(var i=0; i<selects.length;i++) {
                    var select = selects[i];
                    var real_status = select.get('real_status');
                    var route_type = select.get('route_type');

                    if(route_type != null && route_type =='P') { // 구매인 경우에
                        if(real_status != null && real_status != 'GR') {
                            Ext.Msg.alert("알림", "입고된 상태가 아닙니다.");
                            return;
                        };
                    };
                }

                var uids = [];
                var wh_qtys = [];

                if (selects.length) {
                    for (var i = 0; i < selects.length; i++) {
                        var rec = selects[i];
                        var id = rec.get('id');
                        var wh_qty = rec.get('quan');
                        uids.push(id);
                        wh_qtys.push(wh_qty);
                    }

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
                                {
                                    fieldLabel: '창고',
                                    xtype: 'combo',
                                    anchor: '100%',
                                    id: gu.id('whouse_uid'),
                                    name: 'whouse_uid',
                                    store: Ext.create('Mplm.store.WareHouseStore'),
                                    displayField: 'wh_name',
                                    valueField: 'unique_id_long',
                                    emptyText: '선택',
                                    allowBlank: false,
                                    sortInfo: {field: 'create_date', direction: 'DESC'},
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
                                    fieldLabel: '불출일',
                                    xtype: 'datefield',
                                    id: gu.id('reserved_timestamp1'),
                                    name: 'reserved_timestamp1',
                                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                    fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                                    format: 'Y-m-d',
                                    value: Ext.Date.format(new Date(), 'Y-m-d')
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
                                    var msg = '불출 실행 하시겠습니까?';
                                    var myTitle = '불출 실행';
                                    Ext.MessageBox.show({
                                        title: myTitle,
                                        msg: msg,
                                        buttons: Ext.MessageBox.YESNO,
                                        icon: Ext.MessageBox.QUESTION,
                                        fn: function (btn) {

                                            if(btn=='yes') {
                                                var form = gu.getCmp('formPanel').getForm();
                                                console_logs('>>>> form', form);
                                                if(form.isValid()) {
                                                    var val = form.getValues(false);
                                                    console_logs('>>>> val', val);
                                                    prWin.setLoading(true);

                                                    form.submit({
                                                        url:CONTEXT_PATH + '/purchase/request.do?method=executionGO',
                                                        params: {
                                                            unique_ids : uids,
                                                            wh_qtys:wh_qtys
                                                        },
                                                        success: function() {
                                                            Ext.Msg.alert('안내', '불출 실행 성공');
                                                            gm.me().storeLoad();
                                                            if(prWin) {
                                                                prWin.setLoading(false);
                                                                prWin.close();
                                                            };
                                                        },
                                                        failure: function() {
                                                            Ext.Msg.alert('안내', '불출 실행 실패');
                                                            gm.me().storeLoad();
                                                            if(prWin) {
                                                                prWin.setLoading(false);
                                                                prWin.close();
                                                            };
                                                        }
                                                    });
                                                };

                                                // form.submit({
                                                //     url: CONTEXT_PATH + '/purchase/request.do?method=createOutGrKb',
                                                //     params: {
                                                //         cartmap_uids: uids,
                                                //         quans: quanArr,
                                                //         childs: childArr,
                                                //         stoqty_uids: stoqArr,
                                                //         wh_qtys: whArr,
                                                //         stock_qty_usefuls: usefulArr,
                                                //         stock_qtys: stocArr,
                                                //         ac_uids: acUids,
                                                //         stock_positions: stockPosArr
                                                //     },
                                                //     success: function () {
                                                //         Ext.Msg.alert('안내', '불출 확인하였습니다.');
                                                //          gm.me().storeLoad();
                                                //         prWin.close();
                                                //     },
                                                //     failure: function () {
                                                //         Ext.Msg.alert('안내', '불출 확인하였습니다.');
                                                //         gm.me().storeLoad();
                                                //         prWin.close();
                                                //     }
                                                // });
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

                // gMain.selPanel.treatGo();
                /*switch(gMain.selPanel.poviewType) {
                 case 'ALL':
                 alert("자재를 먼저 선택해 주세요");
                 break;
                 case 'RAW':
                 gMain.selPanel.treatGo();
                 //gMain.selPanel.treatRawPo();
                 break;
                 case 'SUB':
                 gMain.selPanel.treatGo();
                 //gMain.selPanel.treatSubPo();
                 break;
                 case 'ADDPO':
                 alert("복사 하기 버튼을 누르세요");
                 break;
                 case 'PAPER':
                 gMain.selPanel.treatGo();
                 break;
                 default:

                 }*/

            }//handler end...

        });

        //추가 주문작성 Action 생성
        this.createAddPoAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '복사 하기',
            tooltip: '복사 하기',
            disabled: true,
            handler: function () {

                var sp_code = gMain.selPanel.vSELECTED_SP_CODE;
                switch (sp_code) {
                    case 'R':
                        gMain.selPanel.purCopyAction();
                        break;
                    case 'O':
                        gMain.selPanel.purCopyAction();
                        break;
                    case 'K':
                        gMain.selPanel.purCopyAction();
                        break;
                    default:

                }

            }//handler end...

        });

        //버튼 추가.
        buttonToolbar.insert(5, '-');
        /*buttonToolbar.insert(5, this.setAddPoView);*/
//       buttonToolbar.insert(5, this.setMisPoView);
//       buttonToolbar.insert(5, this.setMroPoView);
//       buttonToolbar.insert(5, this.setSubPoView);
//       buttonToolbar.insert(5, this.setRawPoView);
//       buttonToolbar.insert(5, this.setAllPoView);
        /*buttonToolbar.insert(3, this.createAddPoAction);*/
        buttonToolbar.insert(3, this.createGoutAction);
//       buttonToolbar.insert(3, '-');
        //      buttonToolbar.insert(2, this.createInPoAction);
//       buttonToolbar.insert(2, '-');

        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function (selections) {

            if (selections.length) {
                var rec = selections[0];
                console_logs('rec 데이터', rec);
                gMain.selPanel.createGoutAction.enable();
            } else {
                gMain.selPanel.createGoutAction.disable();
            }

        });

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('parent_code', this.link);
        this.store.getProxy().setExtraParam('route_type_list', 'G,P');
        // this.store.getProxy().setExtraParam('pr_state', 'R');
        this.store.getProxy().setExtraParam('pr_state_list', 'R,G,Y');
        this.store.getProxy().setExtraParam('pr_go_status', 'CR,CT,MY,GR,PO');
        this.store.getProxy().setExtraParam('allow_true', true);
        this.store.getProxy().setExtraParam('use_po_no', true);
        
        this.store.load(function (records) {
            console_logs('디폴트 데이터', records);

        });
    },
    items: [],
    poviewType: 'ALL',
    cartmap_uids: [],
    deleteClass: ['cartmap'],

    purCopyAction: function () {
        var uniqueId = gMain.selPanel.vSELECTED_PJ_UID;

        if (uniqueId.length < 0) {
            alert('선택된 데이터가 없습니다.');
        } else {

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/request.do?method=purcopycartmap',
                params: {
                    cartmapUids: this.cartmap_uids
                },

                success: function (result, request) {
                    gMain.selPanel.store.load();
                    Ext.Msg.alert('안내', '복사가 완료 되었습니다.', function () {
                    });

                },//endofsuccess
                failure: extjsUtil.failureMessage
            });//endofajax
        } // end of if uniqueid
    },


    //사내발주 폼
    treatPaperAddInPoRoll: function () {
        var next = gUtil.getNextday(0);
        var arrExist = [];
        var arrCurrency = [];
        var arrTotalPrice = [];
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

//		    if (selections) {
//		    	var uids = [];

        var total = 0;
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var unique_id = rec.get('unique_id');
            var child = rec.get('child');
            var item_name = rec.get('item_name');
            var pj_name = rec.get('pj_name');
            var stock_qty_useful = rec.get('stock_qty_useful');
            var quan = rec.get('quan');
            var sales_price = rec.get('sales_price');
//	        		total = total+total_price;
            arrExist.push(item_name);

            console_logs('arrTotalPrice----------------', arrTotalPrice);

            console_logs('arrExist----------------', arrExist);
            console_logs('arrCurrency----------------', arrCurrency);
        }


//		    }

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
                title: '사내발주',
                width: 400,
                height: 400,
                margins: '0 20 0 0',
                collapsible: true,
                anchor: '100%',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 100, bottom: 0, left: 10}
                    }
                },
                items: [
                    {
                        fieldLabel: '주문처',
                        xtype: 'textfield',
                        anchor: '100%',
                        /*id: 'stcok_pur_supplier_info',
                         name: 'stcok_pur_supplier_info',*/
                        id: 'in_pur_information',
                        name: 'in_pur_information',
                        value: '스카나코리아',
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
                        xtype: 'textfield',
                        rows: 4,
                        anchor: '100%',
                        id: 'delivery_address1',
                        name: 'delivery_address1',
                        value: '사내'
                    },

                    {
                        fieldLabel: '비고',
                        xtype: 'textarea',
                        rows: 4,
                        anchor: '100%',
                        id: 'item_abst',
                        name: 'item_abst',

                    },
                    {
                        fieldLabel: '품명',
                        xtype: 'textfield',
                        id: 'item_name',
                        name: 'item_name',
                        value: arrExist,
//                        	arrExist[0] + ' 포함 ' + arrExist.length + '건',
                        readOnly: true

                    },
                    {
                        fieldLabel: '가용재고',
                        xtype: 'textfield',
                        id: 'stock_qty_useful',
                        name: 'stock_qty_useful',
                        value: stock_qty_useful,
                        readOnly: true

                    },
                    {
                        fieldLabel: '주문수량',
                        xtype: 'textfield',
                        id: 'quan',
                        name: 'quan',
                        value: quan,
                        fieldStyle: 'background-color:#FBF8E8; background-image: none;',
                        editable: true

                    }]
            }]
        })
        myHeight = 500;
        myWidth = 420;

        prwin = this.Inprwinopen(form);
    },

    //주문 작성 폼
    treatPaperAddPoRoll: function () {
        var next = gUtil.getNextday(0);
        var arrExist = [];
        var arrCurrency = [];
        var arrTotalPrice = [];
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

//		    if (selections) {
//		    	var uids = [];

        var total = 0;
        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            var unique_id = rec.get('unique_id');
            var child = rec.get('child');
            var item_name = rec.get('item_name');
            var currency = rec.get('currency');
            var sales_price = rec.get('sales_price');
            //var total_price = gMain.selPanel.vSELECTED_QUAN * gMain.selPanel.vSELECTED_PRICE;
            var total_price = rec.get('total_price');
//	        		var total_price = rec.get('reserved_double5');
//	        		console_logs('reserved_double5----------------', reserved_double5);
//	        		uids.push(unique_id);
//	        		uids.push(child);
//	        		arrExist.push(unique_id);
            total = total + total_price;
            arrExist.push(item_name);
            arrCurrency.push(currency);
            console_logs('total----------------', total);
//					console_logs('arrTotalPrice----------------', arrTotalPrice);

            console_logs('arrExist----------------', arrExist);
            console_logs('arrCurrency----------------', arrCurrency);
        }


//		    }

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
                title: '구매',
                width: 400,
                height: 400,
                margins: '0 20 0 0',
                collapsible: true,
                anchor: '100%',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 100, bottom: 0, left: 10}
                    }
                },
                items: [
                    {
                        fieldLabel: '주문처',
                        xtype: 'combo',
                        anchor: '100%',
                        /*id: 'stcok_pur_supplier_info',
                         name: 'stcok_pur_supplier_info',*/
                        id: 'supplier_information',
                        name: 'supplier_information',
                        store: Ext.create('Mplm.store.SupastStore'),
                        displayField: 'supplier_name',
                        valueField: 'unique_id',
                        emptyText: '선택',
                        allowBlank: false,
                        sortInfo: {field: 'create_date', direction: 'DESC'},
                        typeAhead: false,
                        //hideLabel: true,
                        minChars: 1,
                        listConfig: {
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function () {
                                return '<div data-qtip="{unique_id}">{supplier_name}|{supplier_code}</div>';
                            }
                        },
                        listeners: {
                            select: function (combo, record) {
                                var reccode = record.get('area_code');
//	            	        	   Ext.getCmp('maker_code').setValue(reccode);
                            }
                        }
                    },
                    {
                        fieldLabel: '납품장소',
                        xtype: 'textfield',
                        rows: 4,
                        anchor: '100%',
                        id: 'delivery_address1',
                        name: 'delivery_address1',
                        value: '사내'
                    },

                    {
                        fieldLabel: '비고',
                        xtype: 'textarea',
                        rows: 4,
                        anchor: '100%',
                        id: 'item_abst',
                        name: 'item_abst',

                    },
                    {
                        fieldLabel: '품명',
                        xtype: 'textfield',
                        id: 'item_name',
                        name: 'item_name',
                        value: arrExist,
//                        	arrExist[0] + ' 포함 ' + arrExist.length + '건',
                        readOnly: true

                    },
                    {
                        fieldLabel: '통화',
                        xtype: 'textfield',
                        id: 'currency',
                        name: 'currency',
                        value: arrCurrency,
                        readOnly: true

                    },
                    {
                        fieldLabel: '합계금액',
                        xtype: 'textfield',
                        id: 'reserved_double5',
                        name: 'reserved_double5',
                        value: total,
                        readOnly: true

                    }


                ]
            }]
        })
        myHeight = 500;
        myWidth = 420;

        prwin = this.prwinopen(form);
    },

    treatGo: function () {

        var uniqueId = gMain.selPanel.vSELECTED_UNIQUE_ID;

        var next = gUtil.getNextday(0);

        var request_date = gMain.selPanel.request_date;
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
    treatInPo: function () {

        var uniqueId = gMain.selPanel.vSELECTED_UNIQUE_ID;

        var next = gUtil.getNextday(0);

        var request_date = gMain.selPanel.request_date;
        var pj_name = gMain.selPanel.vSELECTED_pj_name;
        var stock_qty_useful = gMain.selPanel.vSELECTED_STOCK_USEFUL;

        var form = null;

        if (uniqueId == undefined || uniqueId < 0) {
            Ext.Msg.alert("알 림", "선택된 자재가 없습니다.");
        } else {
            if (stock_qty_useful == undefined || stock_qty_useful == "" || stock_qty_useful == null) {
                Ext.Msg.alert("알 림", "가용재고가 없습니다. 확인해주세요.");
            } else {
                this.treatPaperAddInPoRoll();
            }
        }

    },

    // 주문 submit
    prwinopen: function (form) {
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
                    var msg = '발주하시겠습니까?';
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
                                //var form = gMain.selPanel.up('form').getForm();
                                var po_user_uid = gMain.selPanel.vSELECTED_po_user_uid;
                                //var catmapuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                                var cartmaparr = [];
                                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                                for (var i = 0; i < selections.length; i++) {
                                    var rec = selections[i];
                                    var uid = rec.get('id');

                                    cartmaparr.push(uid);

                                }
                                var mycart_quan = rec.get('mycart_quan');
                                var sales_price = rec.get('sales_price');
                                if (form.isValid()) {
                                    var val = form.getValues(false);

                                    console_logs('val', val);

                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createheavy',
                                        params: {
                                            sancType: 'YES',
                                            //cartmapUid: catmapuid,
                                            cartmaparr: cartmaparr,
                                            mycart_quan: mycart_quan,
                                            sales_price: sales_price
                                        },
                                        success: function (val, action) {
                                            prWin.close();
                                            Ext.Msg.alert('안내', '발주 완료 되었습니다.', function () {
                                            });
                                            gMain.selPanel.store.load(function () {
                                            });

                                            //this.store.load();
                                            //gMain.selPanel.store.load();
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

    editRedord: function (field, rec) {
        console_logs('====> edited field', field);
        console_logs('====> edited record', rec);

        switch (field) {
            case 'stock_pos':
                break;
        }
    }, /*
     updateDesinComment: function(rec) {

     var child = gMain.selPanel.vSELECTED_UNIQUE_ID;
     console_logs('child>>>', child);
     var quan = rec.get('quan');
     var static_sales_price = rec.get('static_sales_price');
     var req_date = rec.get('req_date');
     var unique_id = rec.get('unique_uid');
     console_logs('====> unique_id', unique_id);

     Ext.Ajax.request({
     url: CONTEXT_PATH + '/purchase/request.do?method=updateCreatePo',
     params: {
     quan: quan,
     static_sales_price: static_sales_price,
     req_date: req_date,
     unique_id: unique_id
     },
     success: function(result, request) {

     var result = result.responseText;
     //console_logs("", result);

     },
     failure: extjsUtil.failureMessage
     });
     },*/

    getCell_edit: function (me) {
        var listLmenu = gUtil.lmenuStruct;
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
        console_logs('여기로 오나????');
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
            //gm.me().showToast('오류', '수정할 테이블 이름이 J2_CODE에 정의되지 않았습니다.');
            return;
        }
        gm.me().recCount++;

//						console_logs('editAjax', 'in');
//						console_logs('in_params', in_params);
//						console_logs('in_whereValue', in_whereValue);

        var params = {};
        if (in_params != null) {
            for (var key in in_params) {
                params[key] = in_params[key];
            }
        }
        //console_logs('params', params);

        var whereValue = [];
        whereValue.push(in_whereValue);
        //console_logs('in_whereValue', whereValue);
        params['tableName'] = tableName;
        params['setField'] = field;
        params['setValue'] = value;
        params['whereField'] = whereField;
        params['whereValue'] = whereValue;
        params['valueType'] = gm.getColType(field);
//		params['reserved_double5'] = gMain.selPanel.reserved_double5;
        /*
         params['menuCode'] = this.link;*/
//		console_logs('editAjax - params', params);
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
                    gMain.selPanel.store.load();

                    /*
                     if(field_name == "주문수량"){
                     gMain.selPanel.vSELECTED_QUAN = value;
                     console_logs('gMain.selPanel.vSELECTED_QUAN', gMain.selPanel.vSELECTED_QUAN);
                     }
                     if(field_name == "단가"){
                     gMain.selPanel.vSELECTED_PRICE = value;
                     console_logs('gMain.selPanel.vSELECTED_PRICE', gMain.selPanel.vSELECTED_PRICE);
                     }
                     console_logs('gMain.selPanel.vSELECTED_QUAN>후', gMain.selPanel.vSELECTED_QUAN);
                     console_logs('gMain.selPanel.vSELECTED_PRICE>후', gMain.selPanel.vSELECTED_PRICE);

                     var total_price= gMain.selPanel.vSELECTED_QUAN * gMain.selPanel.vSELECTED_PRICE;

                     gm.me().getPrice(total_price);*/
                }

            }

        });

    },
    calcAge: function (quan, sales_price) {
        return quan * sales_price;


    },
    getPrice: function (total_price) {
        console_logs('total_price++++++++', total_price);
        var uniqueId = gMain.selPanel.vSELECTED_PJ_UID;
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/request.do?method=updatePrice',
            params: {
                cartmapUids: this.cartmap_uids,
                total_price: total_price
            },

            success: function (result, request) {
                gMain.selPanel.store.load();
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
    // 사내발주 submit
    Inprwinopen: function (form) {
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
                                //var form = gMain.selPanel.up('form').getForm();
                                var po_user_uid = gMain.selPanel.vSELECTED_po_user_uid;
                                //var catmapuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                                var cartmaparr = [];
                                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
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
                                            gMain.selPanel.store.load(function () {
                                            });

                                            //this.store.load();
                                            //gMain.selPanel.store.load();
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
                                //var form = gMain.selPanel.up('form').getForm();
                                var po_user_uid = gMain.selPanel.vSELECTED_po_user_uid;
                                //var catmapuid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                                var cartmaparr = [];
                                var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
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
                                            gMain.selPanel.store.load(function () {
                                            });

                                            //this.store.load();
                                            //gMain.selPanel.store.load();
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
